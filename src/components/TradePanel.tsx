/**
 * BlueCrew CostLab - Trade Panel Component
 * Toggleable trade module with line items and margin tracking
 */

import React, { useState } from 'react';
import type { TradeCategory, TradeSummary, LineItem } from '../types/estimate';
import { useEstimateStore } from '../store/estimateStore';
import { getTradeConfig, getTradeMinMargin } from '../data/trades';
import { formatCurrency, formatPercent } from '../utils/format';
import { LineItemRow } from './LineItemRow';
import { AddLineItemForm } from './AddLineItemForm';

interface TradePanelProps {
  tradeId: TradeCategory;
  summary: TradeSummary;
  lineItems: LineItem[];
}

export function TradePanel({ tradeId, summary, lineItems }: TradePanelProps) {
  const [isExpanded, setIsExpanded] = useState(summary.enabled && lineItems.length > 0);
  const [showAddForm, setShowAddForm] = useState(false);
  const toggleTrade = useEstimateStore((state) => state.toggleTrade);

  const config = getTradeConfig(tradeId);
  const minMargin = getTradeMinMargin(tradeId);

  const handleToggle = (e: React.ChangeEvent<HTMLInputElement>) => {
    toggleTrade(tradeId, e.target.checked);
  };

  return (
    <div className={`trade-panel ${summary.enabled ? 'enabled' : 'disabled'}`}>
      <div className="trade-header" onClick={() => setIsExpanded(!isExpanded)}>
        <div className="trade-toggle">
          <input
            type="checkbox"
            checked={summary.enabled}
            onChange={handleToggle}
            onClick={(e) => e.stopPropagation()}
          />
        </div>

        <div className="trade-info">
          <h3>{config.name}</h3>
          <span className="item-count">{summary.lineItemCount} items</span>
        </div>

        <div className="trade-totals">
          <div className="total-block">
            <span className="label">Cost</span>
            <span className="value">{formatCurrency(summary.totalCost)}</span>
          </div>

          <div className="total-block">
            <span className="label">Price</span>
            <span className="value">{formatCurrency(summary.totalPrice)}</span>
          </div>

          <div className={`total-block margin ${summary.hasLowMarginWarning ? 'warning' : ''}`}>
            <span className="label">Margin</span>
            <span className="value">
              {formatPercent(summary.marginPercent)}
              {summary.hasLowMarginWarning && (
                <span className="warning-icon" title={`Below minimum ${minMargin}%`}>
                  ⚠
                </span>
              )}
            </span>
          </div>

          {summary.hasOverrides && (
            <span className="override-indicator" title="Contains overridden items">
              ✎
            </span>
          )}

          {summary.confidenceScore !== undefined && (
            <span
              className={`confidence-badge ${summary.confidenceScore < 0.7 ? 'low' : ''}`}
              title={`AI Confidence: ${(summary.confidenceScore * 100).toFixed(0)}%`}
            >
              AI {(summary.confidenceScore * 100).toFixed(0)}%
            </span>
          )}
        </div>

        <div className="expand-icon">{isExpanded ? '▼' : '▶'}</div>
      </div>

      {isExpanded && (
        <div className="trade-content">
          <table className="line-items-table">
            <thead>
              <tr>
                <th>Description</th>
                <th>Qty</th>
                <th>Unit</th>
                <th>Unit Cost</th>
                <th>Total Cost</th>
                <th>Markup</th>
                <th>Total Price</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {lineItems.map((item) => (
                <LineItemRow key={item.id} item={item} />
              ))}
            </tbody>
          </table>

          {showAddForm ? (
            <AddLineItemForm tradeId={tradeId} onClose={() => setShowAddForm(false)} />
          ) : (
            <button className="add-item-btn" onClick={() => setShowAddForm(true)}>
              + Add Line Item
            </button>
          )}
        </div>
      )}
    </div>
  );
}
