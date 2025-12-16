/**
 * BlueCrew CostLab - Add Line Item Form
 * Form for adding new line items to a trade with dropdown selections
 */

import React, { useState } from 'react';
import type { TradeCategory } from '../types/estimate';
import { useEstimateStore } from '../store/estimateStore';
import { getPricingByTrade, getCategoriesByTrade } from '../data/pricing';
import { getTradeDefaultMargin } from '../data/trades';

interface AddLineItemFormProps {
  tradeId: TradeCategory;
  onClose: () => void;
}

export function AddLineItemForm({ tradeId, onClose }: AddLineItemFormProps) {
  const pricingOptions = getPricingByTrade(tradeId);
  const categories = getCategoriesByTrade(tradeId);
  const defaultMarkup = getTradeDefaultMargin(tradeId);

  const [selectedCategory, setSelectedCategory] = useState(categories[0] || '');
  const [selectedPricingId, setSelectedPricingId] = useState('');
  const [isCustom, setIsCustom] = useState(pricingOptions.length === 0);

  const [formValues, setFormValues] = useState({
    description: '',
    quantity: 1,
    unit: 'ea',
    unitCost: 0,
    markup: defaultMarkup,
  });

  const addLineItem = useEstimateStore((state) => state.addLineItem);

  const filteredPricing = pricingOptions.filter(
    (p) => !selectedCategory || p.category === selectedCategory
  );

  const handlePricingSelect = (pricingId: string) => {
    const pricing = pricingOptions.find((p) => p.id === pricingId);
    if (pricing) {
      setSelectedPricingId(pricingId);
      setFormValues({
        description: pricing.item,
        quantity: 1,
        unit: pricing.unit,
        unitCost: pricing.baseCost,
        markup: pricing.defaultMarkup * 100,
      });
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!formValues.description.trim()) {
      alert('Please enter a description');
      return;
    }

    addLineItem({
      tradeId,
      description: formValues.description,
      quantity: formValues.quantity,
      unit: formValues.unit,
      unitCost: formValues.unitCost,
      markup: formValues.markup / 100,
      aiGenerated: false,
    });

    onClose();
  };

  return (
    <form className="add-line-item-form" onSubmit={handleSubmit}>
      <div className="form-header">
        <h4>Add Line Item</h4>
        <button type="button" className="close-btn" onClick={onClose}>
          ✕
        </button>
      </div>

      <div className="form-row">
        <label>
          <input
            type="checkbox"
            checked={isCustom}
            onChange={(e) => setIsCustom(e.target.checked)}
          />
          Custom Item
        </label>
      </div>

      {!isCustom && pricingOptions.length > 0 && (
        <>
          <div className="form-row">
            <label>Category</label>
            <select
              value={selectedCategory}
              onChange={(e) => {
                setSelectedCategory(e.target.value);
                setSelectedPricingId('');
              }}
            >
              <option value="">All Categories</option>
              {categories.map((cat) => (
                <option key={cat} value={cat}>
                  {cat}
                </option>
              ))}
            </select>
          </div>

          <div className="form-row">
            <label>Select Item</label>
            <select
              value={selectedPricingId}
              onChange={(e) => handlePricingSelect(e.target.value)}
            >
              <option value="">Choose from pricing table...</option>
              {filteredPricing.map((p) => (
                <option key={p.id} value={p.id}>
                  {p.item} - ${p.baseCost}/{p.unit}
                  {p.tier && ` (${p.tier})`}
                </option>
              ))}
            </select>
          </div>
        </>
      )}

      <div className="form-row">
        <label>Description</label>
        <input
          type="text"
          value={formValues.description}
          onChange={(e) => setFormValues({ ...formValues, description: e.target.value })}
          placeholder="Item description"
          required
        />
      </div>

      <div className="form-row-inline">
        <div className="form-field">
          <label>Quantity</label>
          <input
            type="number"
            value={formValues.quantity}
            onChange={(e) =>
              setFormValues({ ...formValues, quantity: parseFloat(e.target.value) || 0 })
            }
            step="0.1"
            min="0"
            required
          />
        </div>

        <div className="form-field">
          <label>Unit</label>
          <select
            value={formValues.unit}
            onChange={(e) => setFormValues({ ...formValues, unit: e.target.value })}
          >
            <option value="ea">Each</option>
            <option value="sqft">Sq Ft</option>
            <option value="lf">Lin Ft</option>
            <option value="cuyd">Cu Yd</option>
            <option value="lb">Pounds</option>
            <option value="hr">Hours</option>
            <option value="ls">Lump Sum</option>
          </select>
        </div>

        <div className="form-field">
          <label>Unit Cost ($)</label>
          <input
            type="number"
            value={formValues.unitCost}
            onChange={(e) =>
              setFormValues({ ...formValues, unitCost: parseFloat(e.target.value) || 0 })
            }
            step="0.01"
            min="0"
            required
          />
        </div>

        <div className="form-field">
          <label>Markup (%)</label>
          <input
            type="number"
            value={formValues.markup}
            onChange={(e) =>
              setFormValues({ ...formValues, markup: parseFloat(e.target.value) || 0 })
            }
            step="1"
            min="0"
            max="100"
          />
        </div>
      </div>

      <div className="form-summary">
        <span>
          Total Cost: ${(formValues.quantity * formValues.unitCost).toFixed(2)}
        </span>
        <span>
          Total Price: $
          {(formValues.quantity * formValues.unitCost * (1 + formValues.markup / 100)).toFixed(2)}
        </span>
      </div>

      <div className="form-actions">
        <button type="button" onClick={onClose} className="cancel-btn">
          Cancel
        </button>
        <button type="submit" className="submit-btn">
          Add Item
        </button>
      </div>
    </form>
  );
}
