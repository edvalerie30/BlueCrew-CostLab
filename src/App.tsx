/**
 * BlueCrew CostLab - Main Application Component
 * AI-Powered Construction Estimating Platform
 * Multi-scope project estimating with tabs
 */

import { useState, useCallback, useMemo } from 'react';
import './App.css';

// Project Scope Types
type ProjectScope = 'pool' | 'portable_spa' | 'pavilion' | 'retaining_wall' | 'fire_pit' | 'summary';

// Line Item interface
interface LineItem {
  id: string;
  description: string;
  qty: number;
  unit: string;
  materials: number;
  equipment: number;
  labor: number;
  margin: number;
  subcontract: number;
  notes: string;
}

// Category with line items
interface CategoryData {
  name: string;
  expanded: boolean;
  lineItems: LineItem[];
}

// Scope data structure
interface ScopeData {
  enabled: boolean;
  categories: CategoryData[];
}

// Project Info
interface ProjectInfo {
  jobNumber: string;
  jobName: string;
  ownerName: string;
  streetAddress: string;
  city: string;
  state: string;
  county: string;
  bidDate: string;
}

// Scope configuration
const SCOPE_CONFIGS: Record<ProjectScope, { name: string; icon: string; categories: string[] }> = {
  pool: {
    name: 'Pool',
    icon: '🏊',
    categories: ['Planning', 'Site Prep', 'Excavation', 'Steel & Gunite', 'Plumbing', 'Electrical', 'Equipment', 'Tile & Coping', 'Deck', 'Interior Finish', 'Water Features', 'Accessories'],
  },
  portable_spa: {
    name: 'Portable Spa',
    icon: '🛁',
    categories: ['Spa Unit', 'Electrical', 'Site Prep', 'Delivery', 'Accessories'],
  },
  pavilion: {
    name: 'Pavilion/Gazebo',
    icon: '🏛️',
    categories: ['Structure', 'Concrete/Foundation', 'Flooring', 'Electrical & Lighting', 'Painting & Stain', 'Fireplace/Masonry', 'Accessories'],
  },
  retaining_wall: {
    name: 'Retaining Wall',
    icon: '🧱',
    categories: ['Excavation', 'Foundation', 'Block/Stone', 'Caps & Finish', 'Drainage', 'Backfill'],
  },
  fire_pit: {
    name: 'Fire Pit Area',
    icon: '🔥',
    categories: ['Foundation', 'Masonry', 'Stone/Veneer', 'Gas Line', 'Fire Features', 'Seating', 'Lighting'],
  },
  summary: {
    name: 'Summary',
    icon: '📊',
    categories: [],
  },
};

// Initialize categories with empty line items
const initializeScope = (scope: ProjectScope): ScopeData => {
  const config = SCOPE_CONFIGS[scope];
  return {
    enabled: scope === 'pool', // Pool enabled by default
    categories: config.categories.map((name) => ({
      name,
      expanded: false,
      lineItems: [],
    })),
  };
};

// Create a new line item
const createLineItem = (categoryName: string): LineItem => ({
  id: `${categoryName}-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
  description: '',
  qty: 0,
  unit: 'EA',
  materials: 0,
  equipment: 0,
  labor: 0,
  margin: 20,
  subcontract: 0,
  notes: '',
});

function App() {
  // Active Tab State
  const [activeTab, setActiveTab] = useState<ProjectScope>('pool');

  // Project Info State
  const [projectInfo, setProjectInfo] = useState<ProjectInfo>({
    jobNumber: '2025B-01-01',
    jobName: '',
    ownerName: '',
    streetAddress: '',
    city: 'Augusta',
    state: 'GA',
    county: 'Richmond County',
    bidDate: new Date().toISOString().split('T')[0],
  });

  // Scope Data State - each scope has its own categories and line items
  const [scopeData, setScopeData] = useState<Record<ProjectScope, ScopeData>>(() => ({
    pool: initializeScope('pool'),
    portable_spa: initializeScope('portable_spa'),
    pavilion: initializeScope('pavilion'),
    retaining_wall: initializeScope('retaining_wall'),
    fire_pit: initializeScope('fire_pit'),
    summary: { enabled: true, categories: [] },
  }));

  // View Mode State
  const [viewMode, setViewMode] = useState<'internal' | 'client'>('internal');
  const [showExportMenu, setShowExportMenu] = useState(false);

  // Toggle scope enabled
  const toggleScopeEnabled = useCallback((scope: ProjectScope) => {
    setScopeData((prev) => ({
      ...prev,
      [scope]: { ...prev[scope], enabled: !prev[scope].enabled },
    }));
  }, []);

  // Toggle category expanded
  const toggleCategoryExpanded = useCallback((scope: ProjectScope, categoryIndex: number) => {
    setScopeData((prev) => ({
      ...prev,
      [scope]: {
        ...prev[scope],
        categories: prev[scope].categories.map((cat, idx) =>
          idx === categoryIndex ? { ...cat, expanded: !cat.expanded } : cat
        ),
      },
    }));
  }, []);

  // Add line item to category
  const addLineItem = useCallback((scope: ProjectScope, categoryIndex: number) => {
    setScopeData((prev) => {
      const categoryName = prev[scope].categories[categoryIndex].name;
      return {
        ...prev,
        [scope]: {
          ...prev[scope],
          categories: prev[scope].categories.map((cat, idx) =>
            idx === categoryIndex
              ? { ...cat, lineItems: [...cat.lineItems, createLineItem(categoryName)] }
              : cat
          ),
        },
      };
    });
  }, []);

  // Update line item
  const updateLineItem = useCallback(
    (scope: ProjectScope, categoryIndex: number, itemId: string, field: keyof LineItem, value: number | string) => {
      setScopeData((prev) => ({
        ...prev,
        [scope]: {
          ...prev[scope],
          categories: prev[scope].categories.map((cat, idx) =>
            idx === categoryIndex
              ? {
                  ...cat,
                  lineItems: cat.lineItems.map((item) =>
                    item.id === itemId ? { ...item, [field]: value } : item
                  ),
                }
              : cat
          ),
        },
      }));
    },
    []
  );

  // Delete line item
  const deleteLineItem = useCallback((scope: ProjectScope, categoryIndex: number, itemId: string) => {
    setScopeData((prev) => ({
      ...prev,
      [scope]: {
        ...prev[scope],
        categories: prev[scope].categories.map((cat, idx) =>
          idx === categoryIndex
            ? { ...cat, lineItems: cat.lineItems.filter((item) => item.id !== itemId) }
            : cat
        ),
      },
    }));
  }, []);

  // Calculate totals for a single scope
  const calculateScopeTotals = useCallback((data: ScopeData) => {
    let materialsCost = 0;
    let equipmentCost = 0;
    let laborCost = 0;
    let subcontractCost = 0;
    let subtotal = 0;
    let taxableSubtotal = 0;
    let lineItemCount = 0;

    data.categories.forEach((category) => {
      category.lineItems.forEach((item) => {
        if (item.qty > 0) {
          lineItemCount++;
          const itemMaterials = item.qty * item.materials;
          const itemEquipment = item.qty * item.equipment;
          const itemLabor = item.qty * item.labor;
          const itemSubcontract = item.qty * item.subcontract;
          const itemCost = itemMaterials + itemEquipment + itemLabor + itemSubcontract;
          const markupMultiplier = 1 + item.margin / 100;
          const itemSell = itemCost * markupMultiplier;

          materialsCost += itemMaterials;
          equipmentCost += itemEquipment;
          laborCost += itemLabor;
          subcontractCost += itemSubcontract;
          subtotal += itemSell;
          taxableSubtotal += (itemMaterials + itemEquipment) * markupMultiplier;
        }
      });
    });

    const totalCost = materialsCost + equipmentCost + laborCost + subcontractCost;
    const salesTax = taxableSubtotal * 0.08;
    const contractPrice = subtotal + salesTax;
    const grossProfit = contractPrice - totalCost;
    const marginPercent = totalCost > 0 ? (grossProfit / contractPrice) * 100 : 0;

    return {
      materialsCost,
      equipmentCost,
      laborCost,
      subcontractCost,
      totalCost,
      subtotal,
      salesTax,
      contractPrice,
      grossProfit,
      marginPercent,
      lineItemCount,
    };
  }, []);

  // Calculate category totals
  const calculateCategoryTotals = useCallback((category: CategoryData) => {
    let costTotal = 0;
    let sellTotal = 0;

    category.lineItems.forEach((item) => {
      const itemCost = item.qty * (item.materials + item.equipment + item.labor + item.subcontract);
      const markupMultiplier = 1 + item.margin / 100;
      costTotal += itemCost;
      sellTotal += itemCost * markupMultiplier;
    });

    return { costTotal, sellTotal };
  }, []);

  // Project-wide totals (all enabled scopes)
  const projectTotals = useMemo(() => {
    let materialsCost = 0;
    let equipmentCost = 0;
    let laborCost = 0;
    let subcontractCost = 0;
    let subtotal = 0;
    let taxableSubtotal = 0;
    let activeScopesCount = 0;
    let totalLineItems = 0;

    const scopeTotals: Record<string, ReturnType<typeof calculateScopeTotals>> = {};

    (Object.keys(scopeData) as ProjectScope[]).forEach((scope) => {
      if (scope !== 'summary' && scopeData[scope].enabled) {
        activeScopesCount++;
        const totals = calculateScopeTotals(scopeData[scope]);
        scopeTotals[scope] = totals;

        materialsCost += totals.materialsCost;
        equipmentCost += totals.equipmentCost;
        laborCost += totals.laborCost;
        subcontractCost += totals.subcontractCost;
        subtotal += totals.subtotal;
        taxableSubtotal += totals.subtotal - (totals.laborCost + totals.subcontractCost) * (1 + 20 / 100); // Approximate
        totalLineItems += totals.lineItemCount;
      }
    });

    const totalCost = materialsCost + equipmentCost + laborCost + subcontractCost;
    const salesTax = taxableSubtotal * 0.08;
    const contractPrice = subtotal + salesTax;
    const grossProfit = contractPrice - totalCost;
    const marginPercent = totalCost > 0 ? (grossProfit / contractPrice) * 100 : 0;

    return {
      materialsCost,
      equipmentCost,
      laborCost,
      subcontractCost,
      totalCost,
      subtotal,
      salesTax,
      contractPrice,
      grossProfit,
      marginPercent,
      activeScopesCount,
      totalLineItems,
      scopeTotals,
    };
  }, [scopeData, calculateScopeTotals]);

  // Get current scope totals
  const currentScopeTotals = useMemo(() => {
    if (activeTab === 'summary') return projectTotals;
    return calculateScopeTotals(scopeData[activeTab]);
  }, [activeTab, scopeData, calculateScopeTotals, projectTotals]);

  // Export functions
  const exportToCSV = useCallback((isClientView: boolean) => {
    const lines: string[] = [];
    const date = new Date().toLocaleDateString();

    lines.push(`BlueCrew CostLab - ${isClientView ? 'Client Proposal' : 'Internal Estimate'}`);
    lines.push(`Generated: ${date}`);
    lines.push(`Job Number: ${projectInfo.jobNumber}`);
    lines.push(`Job Name: ${projectInfo.jobName}`);
    lines.push(`Owner: ${projectInfo.ownerName}`);
    lines.push(`Address: ${projectInfo.streetAddress}, ${projectInfo.city}, ${projectInfo.state}`);
    lines.push('');

    (Object.keys(scopeData) as ProjectScope[]).forEach((scope) => {
      if (scope !== 'summary' && scopeData[scope].enabled) {
        const config = SCOPE_CONFIGS[scope];
        lines.push(`=== ${config.name} ===`);

        if (isClientView) {
          lines.push('Category,Description,QTY,Unit,Total');
        } else {
          lines.push('Category,Description,QTY,Unit,Materials,Equipment,Labor,Subcontract,Margin %,Cost,Sell');
        }

        scopeData[scope].categories.forEach((category) => {
          category.lineItems.forEach((item) => {
            if (item.qty > 0) {
              const costTotal = item.qty * (item.materials + item.equipment + item.labor + item.subcontract);
              const sellTotal = costTotal * (1 + item.margin / 100);
              if (isClientView) {
                lines.push(`"${category.name}","${item.description}",${item.qty},${item.unit},$${sellTotal.toFixed(2)}`);
              } else {
                lines.push(`"${category.name}","${item.description}",${item.qty},${item.unit},$${item.materials.toFixed(2)},$${item.equipment.toFixed(2)},$${item.labor.toFixed(2)},$${item.subcontract.toFixed(2)},${item.margin}%,$${costTotal.toFixed(2)},$${sellTotal.toFixed(2)}`);
              }
            }
          });
        });
        lines.push('');
      }
    });

    lines.push('=== PROJECT TOTALS ===');
    if (isClientView) {
      lines.push(`Subtotal,$${projectTotals.subtotal.toLocaleString()}`);
      lines.push(`Sales Tax (8%),$${projectTotals.salesTax.toLocaleString()}`);
      lines.push(`Contract Price,$${projectTotals.contractPrice.toLocaleString()}`);
    } else {
      lines.push(`Materials,$${projectTotals.materialsCost.toLocaleString()}`);
      lines.push(`Equipment,$${projectTotals.equipmentCost.toLocaleString()}`);
      lines.push(`Labor,$${projectTotals.laborCost.toLocaleString()}`);
      lines.push(`Subcontract,$${projectTotals.subcontractCost.toLocaleString()}`);
      lines.push(`Total Cost,$${projectTotals.totalCost.toLocaleString()}`);
      lines.push(`Subtotal,$${projectTotals.subtotal.toLocaleString()}`);
      lines.push(`Sales Tax,$${projectTotals.salesTax.toLocaleString()}`);
      lines.push(`Contract Price,$${projectTotals.contractPrice.toLocaleString()}`);
      lines.push(`Gross Profit,$${projectTotals.grossProfit.toLocaleString()}`);
      lines.push(`Margin,${projectTotals.marginPercent.toFixed(1)}%`);
    }

    const csv = lines.join('\n');
    const blob = new Blob([csv], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${projectInfo.jobNumber || 'estimate'}_${isClientView ? 'proposal' : 'internal'}.csv`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    setShowExportMenu(false);
  }, [projectInfo, scopeData, projectTotals]);

  const exportToPDF = useCallback((isClientView: boolean) => {
    const printWindow = window.open('', '_blank');
    if (!printWindow) {
      alert('Please allow popups to export PDF');
      return;
    }

    const date = new Date().toLocaleDateString();

    let scopesHTML = '';
    (Object.keys(scopeData) as ProjectScope[]).forEach((scope) => {
      if (scope !== 'summary' && scopeData[scope].enabled) {
        const config = SCOPE_CONFIGS[scope];
        const totals = calculateScopeTotals(scopeData[scope]);

        scopesHTML += `<h2>${config.icon} ${config.name}</h2>`;
        scopesHTML += `<table><thead><tr>
          <th>Category</th><th>Description</th><th>QTY</th><th>Unit</th>
          ${isClientView ? '' : '<th>Materials</th><th>Equipment</th><th>Labor</th><th>Sub</th><th>Margin</th><th>Cost</th>'}
          <th>${isClientView ? 'Price' : 'Sell'}</th>
        </tr></thead><tbody>`;

        scopeData[scope].categories.forEach((category) => {
          category.lineItems.forEach((item) => {
            if (item.qty > 0) {
              const costTotal = item.qty * (item.materials + item.equipment + item.labor + item.subcontract);
              const sellTotal = costTotal * (1 + item.margin / 100);
              if (isClientView) {
                scopesHTML += `<tr><td>${category.name}</td><td>${item.description}</td><td>${item.qty}</td><td>${item.unit}</td><td>$${sellTotal.toLocaleString()}</td></tr>`;
              } else {
                scopesHTML += `<tr><td>${category.name}</td><td>${item.description}</td><td>${item.qty}</td><td>${item.unit}</td><td>$${item.materials}</td><td>$${item.equipment}</td><td>$${item.labor}</td><td>$${item.subcontract}</td><td>${item.margin}%</td><td>$${costTotal.toLocaleString()}</td><td>$${sellTotal.toLocaleString()}</td></tr>`;
              }
            }
          });
        });

        scopesHTML += `</tbody></table>`;
        scopesHTML += `<div class="scope-total"><strong>${config.name} Total: $${totals.contractPrice.toLocaleString()}</strong></div>`;
      }
    });

    const html = `<!DOCTYPE html><html><head>
      <title>${isClientView ? 'Proposal' : 'Estimate'} - ${projectInfo.jobNumber}</title>
      <style>
        body { font-family: Arial, sans-serif; padding: 20px; max-width: 1100px; margin: 0 auto; font-size: 11px; }
        h1 { color: #1e40af; margin-bottom: 5px; }
        h2 { color: #374151; font-size: 16px; margin-top: 25px; border-bottom: 2px solid #1e40af; padding-bottom: 5px; }
        .header { display: flex; justify-content: space-between; margin-bottom: 20px; }
        .info-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 15px; margin-bottom: 20px; }
        .info-section { background: #f3f4f6; padding: 12px; border-radius: 6px; }
        .info-section h3 { margin: 0 0 8px 0; font-size: 13px; color: #1e40af; }
        .info-row { display: flex; justify-content: space-between; margin: 3px 0; }
        table { width: 100%; border-collapse: collapse; margin: 10px 0; }
        th { background: #1e40af; color: white; padding: 6px; text-align: left; font-size: 10px; }
        td { padding: 5px 6px; border-bottom: 1px solid #e5e7eb; }
        .scope-total { text-align: right; margin: 10px 0 20px 0; font-size: 13px; color: #1e40af; }
        .grand-total { background: #1e40af; color: white; padding: 15px; border-radius: 8px; margin-top: 20px; }
        .grand-total h3 { margin: 0 0 10px 0; }
        .grand-total .row { display: flex; justify-content: space-between; padding: 4px 0; }
        .grand-total .highlight { font-size: 18px; font-weight: bold; border-top: 2px solid white; margin-top: 10px; padding-top: 10px; }
        @media print { body { padding: 0; } }
      </style>
    </head><body>
      <div class="header">
        <div><h1>BlueCrew CostLab</h1><div>Blue Crew Construction • Augusta, GA • (762) 994-6083</div></div>
        <div style="text-align:right;"><strong>${isClientView ? 'CLIENT PROPOSAL' : 'INTERNAL ESTIMATE'}</strong><br/>Date: ${date}</div>
      </div>
      <div class="info-grid">
        <div class="info-section">
          <h3>Project Information</h3>
          <div class="info-row"><span>Job Number:</span><span>${projectInfo.jobNumber}</span></div>
          <div class="info-row"><span>Job Name:</span><span>${projectInfo.jobName}</span></div>
          <div class="info-row"><span>Owner:</span><span>${projectInfo.ownerName}</span></div>
          <div class="info-row"><span>Address:</span><span>${projectInfo.streetAddress}, ${projectInfo.city}, ${projectInfo.state}</span></div>
        </div>
        <div class="info-section">
          <h3>Project Scopes</h3>
          ${(Object.keys(scopeData) as ProjectScope[]).filter(s => s !== 'summary' && scopeData[s].enabled).map(s => `<div class="info-row"><span>${SCOPE_CONFIGS[s].icon} ${SCOPE_CONFIGS[s].name}</span><span>$${(projectTotals.scopeTotals[s]?.contractPrice || 0).toLocaleString()}</span></div>`).join('')}
        </div>
      </div>
      ${scopesHTML}
      <div class="grand-total">
        <h3>Project Total</h3>
        ${isClientView ? `
          <div class="row"><span>Subtotal:</span><span>$${projectTotals.subtotal.toLocaleString()}</span></div>
          <div class="row"><span>Sales Tax (8%):</span><span>$${projectTotals.salesTax.toLocaleString()}</span></div>
          <div class="row highlight"><span>Contract Price:</span><span>$${projectTotals.contractPrice.toLocaleString()}</span></div>
        ` : `
          <div class="row"><span>Total Cost:</span><span>$${projectTotals.totalCost.toLocaleString()}</span></div>
          <div class="row"><span>Subtotal (with markup):</span><span>$${projectTotals.subtotal.toLocaleString()}</span></div>
          <div class="row"><span>Sales Tax (8%):</span><span>$${projectTotals.salesTax.toLocaleString()}</span></div>
          <div class="row highlight"><span>Contract Price:</span><span>$${projectTotals.contractPrice.toLocaleString()}</span></div>
          <div class="row" style="color:#90EE90;"><span>Gross Profit:</span><span>$${projectTotals.grossProfit.toLocaleString()}</span></div>
          <div class="row" style="color:#90EE90;"><span>Margin:</span><span>${projectTotals.marginPercent.toFixed(1)}%</span></div>
        `}
      </div>
      <div style="text-align:center;margin-top:30px;color:#666;">
        <p>Blue Crew Construction • Augusta, GA • (762) 994-6083</p>
        <p>Thank you for your business!</p>
      </div>
      <script>window.onload = function() { window.print(); }</script>
    </body></html>`;

    printWindow.document.write(html);
    printWindow.document.close();
    setShowExportMenu(false);
  }, [projectInfo, scopeData, projectTotals, calculateScopeTotals]);

  // Render scope content (categories and line items)
  const renderScopeContent = (scope: ProjectScope) => {
    if (scope === 'summary') {
      return renderSummary();
    }

    const data = scopeData[scope];
    const config = SCOPE_CONFIGS[scope];

    return (
      <div className="scope-content">
        <div className="scope-header">
          <div className="scope-title">
            <span className="scope-icon">{config.icon}</span>
            <h2>{config.name}</h2>
            <label className="scope-toggle">
              <input
                type="checkbox"
                checked={data.enabled}
                onChange={() => toggleScopeEnabled(scope)}
              />
              <span>Include in Project</span>
            </label>
          </div>
        </div>

        {data.enabled && (
          <div className="categories-list">
            {data.categories.map((category, categoryIndex) => {
              const catTotals = calculateCategoryTotals(category);
              return (
                <div key={category.name} className="category-section">
                  <div
                    className="category-header"
                    onClick={() => toggleCategoryExpanded(scope, categoryIndex)}
                  >
                    <span className={`category-toggle ${category.expanded ? 'expanded' : ''}`}>▶</span>
                    <span className="category-name">{category.name}</span>
                    <span className="category-count">({category.lineItems.length} items)</span>
                    <div className="category-totals">
                      <span className="category-cost">${catTotals.costTotal.toLocaleString()}</span>
                      <span className="category-sell">${catTotals.sellTotal.toLocaleString()}</span>
                    </div>
                  </div>

                  {category.expanded && (
                    <div className="line-items-container">
                      <table className="line-items-table">
                        <thead>
                          <tr>
                            <th>Description</th>
                            <th>QTY</th>
                            <th>Unit</th>
                            <th>Materials</th>
                            <th>Equipment</th>
                            <th>Labor</th>
                            <th>Subcontract</th>
                            <th>Margin %</th>
                            <th>Cost</th>
                            <th>Sell</th>
                            <th></th>
                          </tr>
                        </thead>
                        <tbody>
                          {category.lineItems.map((item) => {
                            const costTotal = item.qty * (item.materials + item.equipment + item.labor + item.subcontract);
                            const sellTotal = costTotal * (1 + item.margin / 100);
                            return (
                              <tr key={item.id}>
                                <td>
                                  <input
                                    type="text"
                                    className="desc-input"
                                    value={item.description}
                                    placeholder="Item description"
                                    onChange={(e) => updateLineItem(scope, categoryIndex, item.id, 'description', e.target.value)}
                                  />
                                </td>
                                <td>
                                  <input
                                    type="number"
                                    className="qty-input"
                                    value={item.qty || ''}
                                    onChange={(e) => updateLineItem(scope, categoryIndex, item.id, 'qty', parseFloat(e.target.value) || 0)}
                                  />
                                </td>
                                <td>
                                  <input
                                    type="text"
                                    className="unit-input"
                                    value={item.unit}
                                    onChange={(e) => updateLineItem(scope, categoryIndex, item.id, 'unit', e.target.value)}
                                  />
                                </td>
                                <td>
                                  <input
                                    type="number"
                                    className="cost-input"
                                    value={item.materials || ''}
                                    placeholder="0"
                                    onChange={(e) => updateLineItem(scope, categoryIndex, item.id, 'materials', parseFloat(e.target.value) || 0)}
                                  />
                                </td>
                                <td>
                                  <input
                                    type="number"
                                    className="cost-input"
                                    value={item.equipment || ''}
                                    placeholder="0"
                                    onChange={(e) => updateLineItem(scope, categoryIndex, item.id, 'equipment', parseFloat(e.target.value) || 0)}
                                  />
                                </td>
                                <td>
                                  <input
                                    type="number"
                                    className="cost-input"
                                    value={item.labor || ''}
                                    placeholder="0"
                                    onChange={(e) => updateLineItem(scope, categoryIndex, item.id, 'labor', parseFloat(e.target.value) || 0)}
                                  />
                                </td>
                                <td>
                                  <input
                                    type="number"
                                    className="cost-input"
                                    value={item.subcontract || ''}
                                    placeholder="0"
                                    onChange={(e) => updateLineItem(scope, categoryIndex, item.id, 'subcontract', parseFloat(e.target.value) || 0)}
                                  />
                                </td>
                                <td>
                                  <input
                                    type="number"
                                    className="margin-input"
                                    value={item.margin}
                                    onChange={(e) => updateLineItem(scope, categoryIndex, item.id, 'margin', parseFloat(e.target.value) || 0)}
                                  />
                                </td>
                                <td className="cost-total">
                                  {costTotal > 0 ? `$${costTotal.toLocaleString()}` : '-'}
                                </td>
                                <td className="sell-total">
                                  {sellTotal > 0 ? `$${sellTotal.toLocaleString()}` : '-'}
                                </td>
                                <td>
                                  <button
                                    className="delete-btn"
                                    onClick={() => deleteLineItem(scope, categoryIndex, item.id)}
                                    title="Delete item"
                                  >
                                    ✕
                                  </button>
                                </td>
                              </tr>
                            );
                          })}
                        </tbody>
                      </table>
                      <button
                        className="add-line-btn"
                        onClick={() => addLineItem(scope, categoryIndex)}
                      >
                        + Add Line Item
                      </button>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        )}
      </div>
    );
  };

  // Render summary tab
  const renderSummary = () => {
    return (
      <div className="summary-content">
        <div className="scope-header">
          <div className="scope-title">
            <span className="scope-icon">📊</span>
            <h2>Project Summary</h2>
          </div>
        </div>

        <div className="summary-scopes">
          {(Object.keys(scopeData) as ProjectScope[]).map((scope) => {
            if (scope === 'summary') return null;
            const config = SCOPE_CONFIGS[scope];
            const data = scopeData[scope];
            const totals = calculateScopeTotals(data);

            return (
              <div
                key={scope}
                className={`summary-scope-card ${data.enabled ? 'enabled' : 'disabled'}`}
              >
                <div className="summary-scope-header">
                  <span className="scope-icon">{config.icon}</span>
                  <span className="scope-name">{config.name}</span>
                  <label className="scope-checkbox">
                    <input
                      type="checkbox"
                      checked={data.enabled}
                      onChange={() => toggleScopeEnabled(scope)}
                    />
                  </label>
                </div>
                {data.enabled && (
                  <div className="summary-scope-details">
                    <div className="summary-row">
                      <span>Line Items:</span>
                      <span>{totals.lineItemCount}</span>
                    </div>
                    <div className="summary-row">
                      <span>Cost:</span>
                      <span>${totals.totalCost.toLocaleString()}</span>
                    </div>
                    <div className="summary-row">
                      <span>Sell:</span>
                      <span>${totals.subtotal.toLocaleString()}</span>
                    </div>
                    <div className="summary-row highlight">
                      <span>w/ Tax:</span>
                      <span>${totals.contractPrice.toLocaleString()}</span>
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>

        <div className="grand-total-section">
          <h3>Grand Total</h3>
          <div className="grand-total-grid">
            <div className="total-item">
              <span className="label">Materials</span>
              <span className="value">${projectTotals.materialsCost.toLocaleString()}</span>
            </div>
            <div className="total-item">
              <span className="label">Equipment</span>
              <span className="value">${projectTotals.equipmentCost.toLocaleString()}</span>
            </div>
            <div className="total-item">
              <span className="label">Labor</span>
              <span className="value">${projectTotals.laborCost.toLocaleString()}</span>
            </div>
            <div className="total-item">
              <span className="label">Subcontract</span>
              <span className="value">${projectTotals.subcontractCost.toLocaleString()}</span>
            </div>
            <div className="total-item highlight">
              <span className="label">Total Cost</span>
              <span className="value">${projectTotals.totalCost.toLocaleString()}</span>
            </div>
            <div className="total-item">
              <span className="label">Subtotal</span>
              <span className="value">${projectTotals.subtotal.toLocaleString()}</span>
            </div>
            <div className="total-item">
              <span className="label">Sales Tax (8%)</span>
              <span className="value">${projectTotals.salesTax.toLocaleString()}</span>
            </div>
            <div className="total-item primary">
              <span className="label">Contract Price</span>
              <span className="value">${projectTotals.contractPrice.toLocaleString()}</span>
            </div>
            <div className="total-item profit">
              <span className="label">Gross Profit</span>
              <span className="value">${projectTotals.grossProfit.toLocaleString()}</span>
            </div>
            <div className="total-item profit">
              <span className="label">Margin</span>
              <span className="value">{projectTotals.marginPercent.toFixed(1)}%</span>
            </div>
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="app">
      {/* Header */}
      <header className="app-header">
        <div className="logo">
          <div className="logo-icon">BC</div>
          <h1>
            <span>Blue</span>Crew <span>Cost</span>Lab
          </h1>
          <span className="tagline">AI-Powered Estimating</span>
        </div>
        <div className="header-actions">
          <button
            className={`btn ${viewMode === 'internal' ? 'btn-internal' : 'btn-client'}`}
            onClick={() => setViewMode('internal')}
          >
            Internal
          </button>
          <button
            className={`btn ${viewMode === 'client' ? 'btn-internal' : 'btn-client'}`}
            onClick={() => setViewMode('client')}
          >
            Client
          </button>
          <button className="btn btn-save">Save</button>
          <div className="export-dropdown">
            <button className="btn btn-export" onClick={() => setShowExportMenu(!showExportMenu)}>
              Export
            </button>
            {showExportMenu && (
              <div className="export-menu">
                <div className="export-menu-section">
                  <div className="export-menu-title">Internal</div>
                  <button onClick={() => exportToPDF(false)}>PDF</button>
                  <button onClick={() => exportToCSV(false)}>CSV</button>
                </div>
                <div className="export-menu-section">
                  <div className="export-menu-title">Client</div>
                  <button onClick={() => exportToPDF(true)}>PDF</button>
                  <button onClick={() => exportToCSV(true)}>CSV</button>
                </div>
              </div>
            )}
          </div>
        </div>
      </header>

      {/* Tab Navigation */}
      <nav className="tab-navigation">
        {(Object.keys(SCOPE_CONFIGS) as ProjectScope[]).map((scope) => {
          const config = SCOPE_CONFIGS[scope];
          const isActive = activeTab === scope;
          const isEnabled = scope === 'summary' || scopeData[scope].enabled;

          return (
            <button
              key={scope}
              className={`tab-btn ${isActive ? 'active' : ''} ${!isEnabled ? 'disabled-scope' : ''}`}
              onClick={() => setActiveTab(scope)}
            >
              <span className="tab-icon">{config.icon}</span>
              <span className="tab-name">{config.name}</span>
              {scope !== 'summary' && scopeData[scope].enabled && (
                <span className="tab-total">
                  ${calculateScopeTotals(scopeData[scope]).contractPrice.toLocaleString()}
                </span>
              )}
            </button>
          );
        })}
      </nav>

      {/* Main Content */}
      <main className="main-content tabbed">
        {/* Left Sidebar - Project Info */}
        <aside className="left-sidebar">
          <div className="sidebar-card">
            <div className="sidebar-card-header">
              <span className="icon">📋</span>
              <h3>Project Information</h3>
            </div>
            <div className="sidebar-card-content">
              <div className="form-group">
                <label>Job Number</label>
                <input
                  type="text"
                  value={projectInfo.jobNumber}
                  onChange={(e) => setProjectInfo({ ...projectInfo, jobNumber: e.target.value })}
                />
              </div>
              <div className="form-group">
                <label>Job Name</label>
                <input
                  type="text"
                  placeholder="e.g., Smith Backyard Project"
                  value={projectInfo.jobName}
                  onChange={(e) => setProjectInfo({ ...projectInfo, jobName: e.target.value })}
                />
              </div>
              <div className="form-group">
                <label>Owner Name</label>
                <input
                  type="text"
                  value={projectInfo.ownerName}
                  onChange={(e) => setProjectInfo({ ...projectInfo, ownerName: e.target.value })}
                />
              </div>
              <div className="form-group">
                <label>Street Address</label>
                <input
                  type="text"
                  value={projectInfo.streetAddress}
                  onChange={(e) => setProjectInfo({ ...projectInfo, streetAddress: e.target.value })}
                />
              </div>
              <div className="form-row">
                <div className="form-group">
                  <label>City</label>
                  <input
                    type="text"
                    value={projectInfo.city}
                    onChange={(e) => setProjectInfo({ ...projectInfo, city: e.target.value })}
                  />
                </div>
                <div className="form-group">
                  <label>State</label>
                  <input
                    type="text"
                    value={projectInfo.state}
                    onChange={(e) => setProjectInfo({ ...projectInfo, state: e.target.value })}
                  />
                </div>
              </div>
              <div className="form-group">
                <label>Bid Date</label>
                <input
                  type="date"
                  value={projectInfo.bidDate}
                  onChange={(e) => setProjectInfo({ ...projectInfo, bidDate: e.target.value })}
                />
              </div>
            </div>
          </div>
        </aside>

        {/* Center Panel - Active Tab Content */}
        <section className="center-panel">
          {renderScopeContent(activeTab)}
        </section>

        {/* Right Sidebar - Totals */}
        <aside className="right-sidebar">
          <div className="totals-card">
            <h3>
              {activeTab === 'summary' ? 'Project' : SCOPE_CONFIGS[activeTab].name} Totals
            </h3>

            <div className="totals-section">
              <div className="totals-section-title">Cost Breakdown</div>
              <div className="totals-row">
                <span className="label">Materials:</span>
                <span className="value">${currentScopeTotals.materialsCost.toLocaleString()}</span>
              </div>
              <div className="totals-row">
                <span className="label">Equipment:</span>
                <span className="value">${currentScopeTotals.equipmentCost.toLocaleString()}</span>
              </div>
              <div className="totals-row">
                <span className="label">Labor:</span>
                <span className="value">${currentScopeTotals.laborCost.toLocaleString()}</span>
              </div>
              <div className="totals-row">
                <span className="label">Subcontract:</span>
                <span className="value">${currentScopeTotals.subcontractCost.toLocaleString()}</span>
              </div>
              <div className="totals-row highlight">
                <span className="label">Total Cost:</span>
                <span className="value">${currentScopeTotals.totalCost.toLocaleString()}</span>
              </div>
            </div>

            <div className="totals-section">
              <div className="totals-section-title">Sell Prices</div>
              <div className="totals-row">
                <span className="label">Subtotal:</span>
                <span className="value">${currentScopeTotals.subtotal.toLocaleString()}</span>
              </div>
              <div className="totals-row">
                <span className="label">Sales Tax (8%):</span>
                <span className="value">${currentScopeTotals.salesTax.toLocaleString()}</span>
              </div>
              <div className="totals-row highlight">
                <span className="label">Contract Price:</span>
                <span className="value">${currentScopeTotals.contractPrice.toLocaleString()}</span>
              </div>
            </div>

            <div className="totals-section">
              <div className="totals-section-title">Margin</div>
              <div
                className={`margin-badge ${
                  currentScopeTotals.marginPercent >= 20
                    ? 'good'
                    : currentScopeTotals.marginPercent >= 15
                      ? 'warning'
                      : 'danger'
                }`}
              >
                {currentScopeTotals.marginPercent.toFixed(1)}% Margin
              </div>
              <div className="totals-row" style={{ marginTop: '0.75rem' }}>
                <span className="label">Gross Profit:</span>
                <span className="value" style={{ color: 'var(--accent-green)' }}>
                  ${currentScopeTotals.grossProfit.toLocaleString()}
                </span>
              </div>
            </div>

            {activeTab !== 'summary' && (
              <div className="totals-section">
                <div className="totals-section-title">Project Total</div>
                <div className="totals-row highlight">
                  <span className="label">All Scopes:</span>
                  <span className="value">${projectTotals.contractPrice.toLocaleString()}</span>
                </div>
              </div>
            )}
          </div>
        </aside>
      </main>

      <footer className="app-footer">
        <p>BlueCrew CostLab v0.3.0 - Multi-Scope Estimating</p>
        <p className="disclaimer">Blue Crew Construction • Augusta, GA • (762) 994-6083</p>
      </footer>
    </div>
  );
}

export default App;
