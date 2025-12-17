/**
 * BlueCrew CostLab - Line Item Row Component
 * Displays and allows editing of individual line items
 */

import { useState } from 'react';
import type { LineItem } from '../types/estimate';
import { useEstimateStore } from '../store/estimateStore';
import { formatCurrency, formatPercent } from '../utils/format';

interface LineItemRowProps {
  item: LineItem;
}

export function LineItemRow({ item }: LineItemRowProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [editValues, setEditValues] = useState({
    quantity: item.quantity,
    unitCost: item.unitCost,
    markup: item.markup * 100,
  });
  const [overrideReason, setOverrideReason] = useState('');

  const { updateLineItem, deleteLineItem, overrideLineItem } = useEstimateStore();

  const handleSave = () => {
    const hasChanges =
      editValues.quantity !== item.quantity ||
      editValues.unitCost !== item.unitCost ||
      editValues.markup !== item.markup * 100;

    if (hasChanges) {
      if (item.aiGenerated && !item.isOverridden) {
        // Require override reason for AI-generated items
        if (!overrideReason.trim()) {
          alert('Please provide a reason for overriding this AI-generated value');
          return;
        }
        overrideLineItem(
          item.id,
          {
            quantity: editValues.quantity,
            unitCost: editValues.unitCost,
            markup: editValues.markup / 100,
          },
          overrideReason
        );
      } else {
        updateLineItem(item.id, {
          quantity: editValues.quantity,
          unitCost: editValues.unitCost,
          markup: editValues.markup / 100,
        });
      }
    }
    setIsEditing(false);
    setOverrideReason('');
  };

  const handleCancel = () => {
    setEditValues({
      quantity: item.quantity,
      unitCost: item.unitCost,
      markup: item.markup * 100,
    });
    setOverrideReason('');
    setIsEditing(false);
  };

  const handleDelete = () => {
    if (confirm(`Delete "${item.description}"?`)) {
      deleteLineItem(item.id);
    }
  };

  if (isEditing) {
    return (
      <tr className="line-item editing">
        <td className="description">
          {item.description}
          {item.aiGenerated && <span className="ai-badge">AI</span>}
        </td>
        <td>
          <input
            type="number"
            value={editValues.quantity}
            onChange={(e) => setEditValues({ ...editValues, quantity: parseFloat(e.target.value) || 0 })}
            step="0.1"
          />
        </td>
        <td>{item.unit}</td>
        <td>
          <input
            type="number"
            value={editValues.unitCost}
            onChange={(e) => setEditValues({ ...editValues, unitCost: parseFloat(e.target.value) || 0 })}
            step="0.01"
          />
        </td>
        <td>{formatCurrency(editValues.quantity * editValues.unitCost)}</td>
        <td>
          <input
            type="number"
            value={editValues.markup}
            onChange={(e) => setEditValues({ ...editValues, markup: parseFloat(e.target.value) || 0 })}
            step="1"
            min="0"
            max="100"
          />
          %
        </td>
        <td>
          {formatCurrency(
            editValues.quantity * editValues.unitCost * (1 + editValues.markup / 100)
          )}
        </td>
        <td className="actions">
          {item.aiGenerated && !item.isOverridden && (
            <input
              type="text"
              placeholder="Override reason..."
              value={overrideReason}
              onChange={(e) => setOverrideReason(e.target.value)}
              className="override-reason"
            />
          )}
          <button onClick={handleSave} className="save-btn">
            Save
          </button>
          <button onClick={handleCancel} className="cancel-btn">
            Cancel
          </button>
        </td>
      </tr>
    );
  }

  return (
    <tr className={`line-item ${item.isOverridden ? 'overridden' : ''} ${item.aiGenerated ? 'ai-generated' : ''}`}>
      <td className="description">
        {item.description}
        {item.aiGenerated && (
          <span
            className={`ai-badge ${item.confidenceScore && item.confidenceScore < 0.7 ? 'low-confidence' : ''}`}
            title={`AI Generated - Confidence: ${item.confidenceScore ? (item.confidenceScore * 100).toFixed(0) : 'N/A'}%`}
          >
            AI
          </span>
        )}
        {item.isOverridden && (
          <span className="override-badge" title={item.overrideReason}>
            ✎
          </span>
        )}
      </td>
      <td>{item.quantity}</td>
      <td>{item.unit}</td>
      <td>{formatCurrency(item.unitCost)}</td>
      <td>{formatCurrency(item.totalCost)}</td>
      <td>{formatPercent(item.markup * 100)}</td>
      <td className="total-price">{formatCurrency(item.totalPrice)}</td>
      <td className="actions">
        <button onClick={() => setIsEditing(true)} className="edit-btn" title="Edit">
          ✎
        </button>
        <button onClick={handleDelete} className="delete-btn" title="Delete">
          ✕
        </button>
      </td>
    </tr>
  );
}
