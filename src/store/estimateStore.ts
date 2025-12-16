/**
 * BlueCrew CostLab - Estimate State Management
 * Zustand store for managing estimate state
 */

import { create } from 'zustand';
import { v4 as uuidv4 } from 'uuid';
import type {
  Estimate,
  LineItem,
  TradeSummary,
  TradeCategory,
  ReviewFlag,
  DrawingAnalysis,
  ChangeRecord,
} from '../types/estimate';
import {
  calculateLineItem,
  calculateTradeSummary,
  calculateEstimateTotals,
  generateReviewFlags,
} from '../engine/calculator';
import { TRADE_LIST } from '../data/trades';

interface EstimateState {
  // Current estimate
  estimate: Estimate | null;

  // Actions
  createEstimate: (projectName: string, clientName: string, address: string) => void;
  loadEstimate: (estimate: Estimate) => void;

  // Line items
  addLineItem: (item: Partial<LineItem>) => void;
  updateLineItem: (itemId: string, updates: Partial<LineItem>) => void;
  deleteLineItem: (itemId: string) => void;
  overrideLineItem: (itemId: string, newValue: Partial<LineItem>, reason: string) => void;

  // Trades
  toggleTrade: (tradeId: TradeCategory, enabled: boolean) => void;

  // Drawing analysis
  setDrawingAnalysis: (analysis: DrawingAnalysis) => void;

  // Review
  resolveFlag: (flagId: string, userId: string) => void;
  approveEstimate: (userId: string) => void;
  updateStatus: (status: Estimate['status']) => void;

  // Recalculation
  recalculate: () => void;
}

function createEmptyEstimate(projectName: string, clientName: string, address: string): Estimate {
  const trades = new Map<TradeCategory, TradeSummary>();

  // Initialize all trades as disabled
  TRADE_LIST.forEach((trade) => {
    trades.set(trade.id, {
      tradeId: trade.id,
      enabled: false,
      totalCost: 0,
      totalPrice: 0,
      marginPercent: trade.defaultMarginPercent,
      marginDollars: 0,
      lineItemCount: 0,
      hasLowMarginWarning: false,
      hasOverrides: false,
    });
  });

  return {
    id: uuidv4(),
    projectName,
    clientName,
    address,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    status: 'draft',
    trades,
    lineItems: [],
    totalCost: 0,
    totalPrice: 0,
    overallMarginPercent: 0,
    overallMarginDollars: 0,
    reviewFlags: [],
    version: 1,
    changeHistory: [],
  };
}

export const useEstimateStore = create<EstimateState>((set, get) => ({
  estimate: null,

  createEstimate: (projectName, clientName, address) => {
    set({ estimate: createEmptyEstimate(projectName, clientName, address) });
  },

  loadEstimate: (estimate) => {
    set({ estimate });
  },

  addLineItem: (item) => {
    const state = get();
    if (!state.estimate) return;

    const newItem = calculateLineItem(item);
    const newLineItems = [...state.estimate.lineItems, newItem];

    // Enable the trade if it wasn't enabled
    const trades = new Map(state.estimate.trades);
    const tradeSummary = trades.get(newItem.tradeId);
    if (tradeSummary && !tradeSummary.enabled) {
      trades.set(newItem.tradeId, { ...tradeSummary, enabled: true });
    }

    set({
      estimate: {
        ...state.estimate,
        lineItems: newLineItems,
        trades,
        updatedAt: new Date().toISOString(),
      },
    });

    get().recalculate();
  },

  updateLineItem: (itemId, updates) => {
    const state = get();
    if (!state.estimate) return;

    const newLineItems = state.estimate.lineItems.map((item) => {
      if (item.id === itemId) {
        return calculateLineItem({ ...item, ...updates });
      }
      return item;
    });

    set({
      estimate: {
        ...state.estimate,
        lineItems: newLineItems,
        updatedAt: new Date().toISOString(),
      },
    });

    get().recalculate();
  },

  deleteLineItem: (itemId) => {
    const state = get();
    if (!state.estimate) return;

    const newLineItems = state.estimate.lineItems.filter((item) => item.id !== itemId);

    set({
      estimate: {
        ...state.estimate,
        lineItems: newLineItems,
        updatedAt: new Date().toISOString(),
      },
    });

    get().recalculate();
  },

  overrideLineItem: (itemId, newValue, reason) => {
    const state = get();
    if (!state.estimate) return;

    const oldItem = state.estimate.lineItems.find((item) => item.id === itemId);
    if (!oldItem) return;

    const changeRecord: ChangeRecord = {
      id: uuidv4(),
      timestamp: new Date().toISOString(),
      userId: 'current_user', // Would come from auth in real app
      action: 'override',
      field: Object.keys(newValue).join(', '),
      previousValue: oldItem,
      newValue: { ...oldItem, ...newValue },
      reason,
    };

    const newLineItems = state.estimate.lineItems.map((item) => {
      if (item.id === itemId) {
        return calculateLineItem({
          ...item,
          ...newValue,
          isOverridden: true,
          overrideReason: reason,
        });
      }
      return item;
    });

    set({
      estimate: {
        ...state.estimate,
        lineItems: newLineItems,
        changeHistory: [...state.estimate.changeHistory, changeRecord],
        updatedAt: new Date().toISOString(),
      },
    });

    get().recalculate();
  },

  toggleTrade: (tradeId, enabled) => {
    const state = get();
    if (!state.estimate) return;

    const trades = new Map(state.estimate.trades);
    const tradeSummary = trades.get(tradeId);
    if (tradeSummary) {
      trades.set(tradeId, { ...tradeSummary, enabled });
    }

    set({
      estimate: {
        ...state.estimate,
        trades,
        updatedAt: new Date().toISOString(),
      },
    });

    get().recalculate();
  },

  setDrawingAnalysis: (analysis) => {
    const state = get();
    if (!state.estimate) return;

    set({
      estimate: {
        ...state.estimate,
        drawingAnalysis: analysis,
        updatedAt: new Date().toISOString(),
      },
    });
  },

  resolveFlag: (flagId, userId) => {
    const state = get();
    if (!state.estimate) return;

    const newFlags = state.estimate.reviewFlags.map((flag) => {
      if (flag.id === flagId) {
        return {
          ...flag,
          resolved: true,
          resolvedBy: userId,
          resolvedAt: new Date().toISOString(),
        };
      }
      return flag;
    });

    set({
      estimate: {
        ...state.estimate,
        reviewFlags: newFlags,
        updatedAt: new Date().toISOString(),
      },
    });
  },

  approveEstimate: (userId) => {
    const state = get();
    if (!state.estimate) return;

    set({
      estimate: {
        ...state.estimate,
        status: 'approved',
        approvedBy: userId,
        approvedAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      },
    });
  },

  updateStatus: (status) => {
    const state = get();
    if (!state.estimate) return;

    set({
      estimate: {
        ...state.estimate,
        status,
        updatedAt: new Date().toISOString(),
      },
    });
  },

  recalculate: () => {
    const state = get();
    if (!state.estimate) return;

    // Recalculate all trade summaries
    const trades = new Map(state.estimate.trades);
    const enabledTrades = new Set<TradeCategory>();

    trades.forEach((summary, tradeId) => {
      const newSummary = calculateTradeSummary(tradeId, state.estimate!.lineItems, summary.enabled);
      trades.set(tradeId, newSummary);
      if (newSummary.enabled) {
        enabledTrades.add(tradeId);
      }
    });

    // Recalculate totals
    const totals = calculateEstimateTotals(state.estimate.lineItems, enabledTrades);

    // Generate review flags
    const reviewFlags = generateReviewFlags(state.estimate.lineItems, trades);

    set({
      estimate: {
        ...state.estimate,
        trades,
        ...totals,
        reviewFlags,
      },
    });
  },
}));
