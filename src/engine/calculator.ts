/**
 * BlueCrew CostLab - Estimate Calculation Engine
 * Core calculation logic with margin protection
 */

import type {
  Estimate,
  LineItem,
  TradeSummary,
  TradeCategory,
  ReviewFlag,
  PoolGeometry,
} from '../types/estimate';
import { TRADE_CONFIGS, getTradeMinMargin } from '../data/trades';
import { v4 as uuidv4 } from 'uuid';

/**
 * Calculate line item total cost and price
 */
export function calculateLineItem(item: Partial<LineItem>): LineItem {
  const quantity = item.quantity ?? 0;
  const unitCost = item.unitCost ?? 0;
  const markup = item.markup ?? TRADE_CONFIGS[item.tradeId!].defaultMarginPercent / 100;

  const totalCost = quantity * unitCost;
  const totalPrice = totalCost * (1 + markup);

  return {
    id: item.id ?? uuidv4(),
    tradeId: item.tradeId!,
    description: item.description ?? '',
    quantity,
    unit: item.unit ?? 'ea',
    unitCost,
    totalCost,
    markup,
    totalPrice,
    isOverridden: item.isOverridden ?? false,
    overrideReason: item.overrideReason,
    confidenceScore: item.confidenceScore,
    aiGenerated: item.aiGenerated ?? false,
    notes: item.notes,
  };
}

/**
 * Calculate trade summary from line items
 */
export function calculateTradeSummary(
  tradeId: TradeCategory,
  lineItems: LineItem[],
  enabled: boolean = true
): TradeSummary {
  const tradeItems = lineItems.filter((item) => item.tradeId === tradeId);
  const totalCost = tradeItems.reduce((sum, item) => sum + item.totalCost, 0);
  const totalPrice = tradeItems.reduce((sum, item) => sum + item.totalPrice, 0);
  const marginDollars = totalPrice - totalCost;
  const marginPercent = totalCost > 0 ? (marginDollars / totalCost) * 100 : 0;
  const minMargin = getTradeMinMargin(tradeId);

  // Calculate average confidence if AI items exist
  const aiItems = tradeItems.filter((item) => item.aiGenerated && item.confidenceScore !== undefined);
  const avgConfidence =
    aiItems.length > 0
      ? aiItems.reduce((sum, item) => sum + (item.confidenceScore ?? 0), 0) / aiItems.length
      : undefined;

  return {
    tradeId,
    enabled,
    totalCost,
    totalPrice,
    marginPercent,
    marginDollars,
    lineItemCount: tradeItems.length,
    hasLowMarginWarning: marginPercent < minMargin && totalCost > 0,
    hasOverrides: tradeItems.some((item) => item.isOverridden),
    confidenceScore: avgConfidence,
  };
}

/**
 * Calculate full estimate totals
 */
export function calculateEstimateTotals(
  lineItems: LineItem[],
  enabledTrades: Set<TradeCategory>
): {
  totalCost: number;
  totalPrice: number;
  overallMarginPercent: number;
  overallMarginDollars: number;
} {
  const enabledItems = lineItems.filter((item) => enabledTrades.has(item.tradeId));
  const totalCost = enabledItems.reduce((sum, item) => sum + item.totalCost, 0);
  const totalPrice = enabledItems.reduce((sum, item) => sum + item.totalPrice, 0);
  const overallMarginDollars = totalPrice - totalCost;
  const overallMarginPercent = totalCost > 0 ? (overallMarginDollars / totalCost) * 100 : 0;

  return {
    totalCost,
    totalPrice,
    overallMarginPercent,
    overallMarginDollars,
  };
}

/**
 * Generate review flags for the estimate
 */
export function generateReviewFlags(
  lineItems: LineItem[],
  tradeSummaries: Map<TradeCategory, TradeSummary>
): ReviewFlag[] {
  const flags: ReviewFlag[] = [];

  // Check for low-margin trades
  tradeSummaries.forEach((summary, tradeId) => {
    if (summary.hasLowMarginWarning && summary.enabled) {
      const minMargin = getTradeMinMargin(tradeId);
      flags.push({
        id: uuidv4(),
        type: 'low_margin',
        tradeId,
        message: `${TRADE_CONFIGS[tradeId].name} margin (${summary.marginPercent.toFixed(1)}%) is below minimum threshold (${minMargin}%)`,
        severity: 'warning',
        resolved: false,
      });
    }
  });

  // Check for overridden items
  lineItems.forEach((item) => {
    if (item.isOverridden) {
      flags.push({
        id: uuidv4(),
        type: 'override',
        tradeId: item.tradeId,
        lineItemId: item.id,
        message: `"${item.description}" has been manually overridden${item.overrideReason ? `: ${item.overrideReason}` : ''}`,
        severity: 'info',
        resolved: false,
      });
    }
  });

  // Check for low-confidence AI items
  lineItems.forEach((item) => {
    if (item.aiGenerated && item.confidenceScore !== undefined && item.confidenceScore < 0.7) {
      flags.push({
        id: uuidv4(),
        type: 'confidence',
        tradeId: item.tradeId,
        lineItemId: item.id,
        message: `AI-generated item "${item.description}" has low confidence (${(item.confidenceScore * 100).toFixed(0)}%)`,
        severity: item.confidenceScore < 0.5 ? 'warning' : 'info',
        resolved: false,
      });
    }
  });

  return flags;
}

/**
 * Pool geometry calculations
 */
export function calculatePoolVolume(geometry: PoolGeometry): number | null {
  if (!geometry.areaSqft || !geometry.avgDepthFt) {
    return null;
  }
  // Volume in gallons = area * avg depth * 7.48 gallons per cubic foot
  return geometry.areaSqft * geometry.avgDepthFt * 7.48;
}

export function calculatePoolPerimeter(geometry: PoolGeometry): number | null {
  if (geometry.perimeterLf) {
    return geometry.perimeterLf;
  }

  // Estimate perimeter based on shape
  if (geometry.lengthFt && geometry.widthFt) {
    switch (geometry.shape) {
      case 'rectangular':
        return 2 * (geometry.lengthFt + geometry.widthFt);
      case 'kidney':
      case 'freeform':
        // Approximate - freeform pools typically have ~20% more perimeter
        return 2 * (geometry.lengthFt + geometry.widthFt) * 1.2;
      default:
        return 2 * (geometry.lengthFt + geometry.widthFt) * 1.1;
    }
  }

  return null;
}

export function calculatePoolArea(geometry: PoolGeometry): number | null {
  if (geometry.areaSqft) {
    return geometry.areaSqft;
  }

  if (geometry.lengthFt && geometry.widthFt) {
    switch (geometry.shape) {
      case 'rectangular':
        return geometry.lengthFt * geometry.widthFt;
      case 'kidney':
      case 'freeform':
        // Approximate - kidney/freeform typically 70-80% of bounding rectangle
        return geometry.lengthFt * geometry.widthFt * 0.75;
      default:
        return geometry.lengthFt * geometry.widthFt * 0.85;
    }
  }

  return null;
}

/**
 * Material quantity estimators
 */
export function estimateGuniteQuantity(areaSqft: number, avgDepthFt: number): number {
  // Gunite in cubic yards - walls + floor
  // Approximate shell thickness of 8 inches
  const shellThickness = 8 / 12; // feet
  const surfaceArea = areaSqft + areaSqft * avgDepthFt * 0.5; // rough estimate including walls
  return (surfaceArea * shellThickness) / 27; // convert to cubic yards
}

export function estimateSteelQuantity(areaSqft: number): number {
  // Rebar in pounds - approximately 1.5-2 lbs per sqft of pool area
  return areaSqft * 1.75;
}

export function estimatePlasterQuantity(areaSqft: number, avgDepthFt: number): number {
  // Interior surface area including walls
  // Walls area = perimeter * avg depth (approximate)
  const perimeterEstimate = Math.sqrt(areaSqft) * 4 * 0.9;
  const wallArea = perimeterEstimate * avgDepthFt;
  return areaSqft + wallArea; // total interior sqft
}

export function estimateTileQuantity(perimeterLf: number): number {
  // Waterline tile in linear feet (typically 6" band)
  return perimeterLf;
}

export function estimateCopingQuantity(perimeterLf: number): number {
  // Coping in linear feet
  return perimeterLf;
}

export function estimateDeckArea(poolAreaSqft: number, deckWidthFt: number = 6): number {
  // Estimate deck area based on pool size and typical deck width
  const poolPerimeter = Math.sqrt(poolAreaSqft) * 4 * 0.9;
  return poolPerimeter * deckWidthFt + poolAreaSqft * 0.2; // perimeter band + corners
}
