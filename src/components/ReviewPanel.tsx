/**
 * BlueCrew CostLab - Review Panel Component
 * Displays and manages review flags for estimator approval
 */

import React from 'react';
import type { ReviewFlag } from '../types/estimate';
import { useEstimateStore } from '../store/estimateStore';
import { getTradeConfig } from '../data/trades';

export function ReviewPanel() {
  const estimate = useEstimateStore((state) => state.estimate);
  const resolveFlag = useEstimateStore((state) => state.resolveFlag);
  const approveEstimate = useEstimateStore((state) => state.approveEstimate);

  if (!estimate) return null;

  const unresolvedFlags = estimate.reviewFlags.filter((f) => !f.resolved);
  const resolvedFlags = estimate.reviewFlags.filter((f) => f.resolved);

  const canApprove = unresolvedFlags.filter((f) => f.severity === 'error').length === 0;

  const handleResolve = (flagId: string) => {
    resolveFlag(flagId, 'current_user'); // Would come from auth
  };

  const handleApprove = () => {
    if (!canApprove) {
      alert('Please resolve all error-level flags before approving');
      return;
    }
    if (
      confirm(
        `Approve estimate for ${estimate.projectName}?\n\nTotal Price: $${estimate.totalPrice.toFixed(2)}\nMargin: ${estimate.overallMarginPercent.toFixed(1)}%`
      )
    ) {
      approveEstimate('current_user');
    }
  };

  const getFlagIcon = (flag: ReviewFlag) => {
    switch (flag.type) {
      case 'low_margin':
        return '📉';
      case 'override':
        return '✎';
      case 'assumption':
        return '❓';
      case 'missing_data':
        return '⚠';
      case 'confidence':
        return '🤖';
      default:
        return '•';
    }
  };

  const getSeverityClass = (severity: ReviewFlag['severity']) => {
    switch (severity) {
      case 'error':
        return 'flag-error';
      case 'warning':
        return 'flag-warning';
      default:
        return 'flag-info';
    }
  };

  return (
    <div className="review-panel">
      <div className="review-header">
        <h2>Estimate Review</h2>
        {estimate.status === 'draft' && (
          <button
            className={`approve-btn ${canApprove ? '' : 'disabled'}`}
            onClick={handleApprove}
            disabled={!canApprove}
          >
            Approve Estimate
          </button>
        )}
        {estimate.status === 'approved' && (
          <span className="approved-badge">
            ✓ Approved by {estimate.approvedBy} on{' '}
            {new Date(estimate.approvedAt!).toLocaleDateString()}
          </span>
        )}
      </div>

      {unresolvedFlags.length > 0 && (
        <div className="flags-section">
          <h3>Review Items ({unresolvedFlags.length})</h3>
          <div className="flags-list">
            {unresolvedFlags.map((flag) => (
              <div key={flag.id} className={`review-flag ${getSeverityClass(flag.severity)}`}>
                <span className="flag-icon">{getFlagIcon(flag)}</span>
                <div className="flag-content">
                  {flag.tradeId && (
                    <span className="flag-trade">{getTradeConfig(flag.tradeId).name}</span>
                  )}
                  <span className="flag-message">{flag.message}</span>
                </div>
                <button className="resolve-btn" onClick={() => handleResolve(flag.id)}>
                  Acknowledge
                </button>
              </div>
            ))}
          </div>
        </div>
      )}

      {unresolvedFlags.length === 0 && estimate.status === 'draft' && (
        <div className="no-flags">
          <span className="success-icon">✓</span>
          <p>No review items remaining. Ready for approval.</p>
        </div>
      )}

      {resolvedFlags.length > 0 && (
        <details className="resolved-section">
          <summary>Resolved Items ({resolvedFlags.length})</summary>
          <div className="flags-list resolved">
            {resolvedFlags.map((flag) => (
              <div key={flag.id} className="review-flag resolved">
                <span className="flag-icon">{getFlagIcon(flag)}</span>
                <div className="flag-content">
                  {flag.tradeId && (
                    <span className="flag-trade">{getTradeConfig(flag.tradeId).name}</span>
                  )}
                  <span className="flag-message">{flag.message}</span>
                  <span className="resolved-info">
                    Resolved by {flag.resolvedBy} on{' '}
                    {new Date(flag.resolvedAt!).toLocaleDateString()}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </details>
      )}
    </div>
  );
}
