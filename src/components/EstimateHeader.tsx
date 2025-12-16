/**
 * BlueCrew CostLab - Estimate Header Component
 * Displays project info and overall estimate summary
 */

import React from 'react';
import { useEstimateStore } from '../store/estimateStore';
import { formatCurrency, formatPercent } from '../utils/format';

export function EstimateHeader() {
  const estimate = useEstimateStore((state) => state.estimate);

  if (!estimate) {
    return null;
  }

  const isLowMargin = estimate.overallMarginPercent < 20;
  const hasWarnings = estimate.reviewFlags.filter((f) => !f.resolved && f.severity === 'warning').length > 0;

  return (
    <div className="estimate-header">
      <div className="project-info">
        <h1>{estimate.projectName}</h1>
        <p className="client-name">{estimate.clientName}</p>
        <p className="address">{estimate.address}</p>
        <span className={`status-badge status-${estimate.status}`}>
          {estimate.status.replace('_', ' ')}
        </span>
      </div>

      <div className="estimate-summary">
        <div className="summary-card">
          <span className="label">Total Cost</span>
          <span className="value">{formatCurrency(estimate.totalCost)}</span>
        </div>

        <div className="summary-card">
          <span className="label">Total Price</span>
          <span className="value primary">{formatCurrency(estimate.totalPrice)}</span>
        </div>

        <div className={`summary-card ${isLowMargin ? 'warning' : ''}`}>
          <span className="label">Margin</span>
          <span className="value">
            {formatPercent(estimate.overallMarginPercent)}
            <span className="sub-value">({formatCurrency(estimate.overallMarginDollars)})</span>
          </span>
        </div>

        {hasWarnings && (
          <div className="summary-card alert">
            <span className="label">Warnings</span>
            <span className="value">
              {estimate.reviewFlags.filter((f) => !f.resolved && f.severity === 'warning').length}
            </span>
          </div>
        )}
      </div>
    </div>
  );
}
