/**
 * BlueCrew CostLab - Main Application Component
 * AI-Powered Construction Estimating Platform
 */

import React, { useState, useCallback } from 'react';
import { TRADE_LIST } from './data/trades';
import { getPricingByTrade, getCategoriesByTrade, getPricingById } from './data/pricingDatabase';
import type { TradeCategory } from './types/estimate';
import './App.css';

// Types for our local state
interface LineItem {
  id: string;
  description: string;
  qty: number;
  unit: string;
  materials: number;
  equipment: number;
  labor: number;
  notes: string;
}

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

interface PoolGeometry {
  poolShape: string;
  length: number;
  width: number;
  shallowDepth: number;
  deepEnd: number;
  deckArea: number;
  poolGallons: number;
  spaGallons: number;
}

interface TradeData {
  enabled: boolean;
  expanded: boolean;
  lineItems: LineItem[];
}

function App() {
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

  // Pool Geometry State
  const [poolGeometry, setPoolGeometry] = useState<PoolGeometry>({
    poolShape: 'Rectangular',
    length: 36,
    width: 18,
    shallowDepth: 3.5,
    deepEnd: 7,
    deckArea: 740,
    poolGallons: 0,
    spaGallons: 0,
  });

  // Uploaded Files State
  const [uploadedFiles, setUploadedFiles] = useState<File[]>([]);
  const [filePreviewUrls, setFilePreviewUrls] = useState<string[]>([]);
  const [isDragging, setIsDragging] = useState(false);
  const [analysisStatus, setAnalysisStatus] = useState<'idle' | 'analyzing' | 'complete'>('idle');

  // Trade Data State - initialize with pricing from database
  const [tradeData, setTradeData] = useState<Record<TradeCategory, TradeData>>(() => {
    const initial: Partial<Record<TradeCategory, TradeData>> = {};
    TRADE_LIST.forEach((trade) => {
      const pricing = getPricingByTrade(trade.id);
      initial[trade.id] = {
        enabled: pricing.length > 0,
        expanded: trade.id === 'inground_pool' || trade.id === 'access',
        lineItems: pricing.slice(0, 6).map((p, idx) => ({
          id: `${trade.id}-${idx}`,
          description: p.item,
          qty: 0,
          unit: p.unit.toUpperCase(),
          materials: p.baseCost,
          equipment: 0,
          labor: 0,
          notes: p.notes || '',
        })),
      };
    });
    return initial as Record<TradeCategory, TradeData>;
  });

  // View Mode State
  const [viewMode, setViewMode] = useState<'internal' | 'client'>('internal');

  // Modal State
  const [showAddItemModal, setShowAddItemModal] = useState<TradeCategory | null>(null);
  const [showExportMenu, setShowExportMenu] = useState(false);
  const [newItemForm, setNewItemForm] = useState({
    selectedPricingId: '',
    customDescription: '',
    quantity: 1,
    materials: 0,
    equipment: 0,
    labor: 0,
    unit: 'EA',
  });

  // File Upload Handlers
  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  }, []);

  const handleDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
  }, []);

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    const files = Array.from(e.dataTransfer.files);
    setUploadedFiles((prev) => [...prev, ...files]);
    // Create preview URLs for images
    files.forEach(file => {
      if (file.type.startsWith('image/')) {
        const url = URL.createObjectURL(file);
        setFilePreviewUrls(prev => [...prev, url]);
      } else {
        setFilePreviewUrls(prev => [...prev, '']);
      }
    });
    setAnalysisStatus('idle');
  }, []);

  const handleFileSelect = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const files = Array.from(e.target.files);
      setUploadedFiles((prev) => [...prev, ...files]);
      // Create preview URLs for images
      files.forEach(file => {
        if (file.type.startsWith('image/')) {
          const url = URL.createObjectURL(file);
          setFilePreviewUrls(prev => [...prev, url]);
        } else {
          setFilePreviewUrls(prev => [...prev, '']);
        }
      });
      setAnalysisStatus('idle');
    }
  }, []);

  const removeFile = useCallback((index: number) => {
    // Revoke the object URL to free memory
    if (filePreviewUrls[index]) {
      URL.revokeObjectURL(filePreviewUrls[index]);
    }
    setUploadedFiles((prev) => prev.filter((_, i) => i !== index));
    setFilePreviewUrls((prev) => prev.filter((_, i) => i !== index));
  }, [filePreviewUrls]);

  // Analyze uploaded drawings (simulated for now)
  const analyzeDrawings = useCallback(() => {
    if (uploadedFiles.length === 0) return;

    setAnalysisStatus('analyzing');

    // Simulate analysis delay
    setTimeout(() => {
      // Detected pool dimensions (simulated AI extraction)
      const detectedLength = 32;
      const detectedWidth = 16;
      const detectedShallowDepth = 3.5;
      const detectedDeepEnd = 6;
      const poolArea = detectedLength * detectedWidth; // 512 sqft
      const poolPerimeter = 2 * (detectedLength + detectedWidth); // 96 LF
      const avgDepth = (detectedShallowDepth + detectedDeepEnd) / 2; // 4.75 ft
      const deckArea = poolPerimeter * 6; // 6ft deck width
      // Calculate gallons: Area x Avg Depth x 7.48 gallons per cubic foot
      const poolGallons = Math.round(poolArea * avgDepth * 7.48);

      // Update pool geometry
      setPoolGeometry({
        poolShape: 'Rectangular',
        length: detectedLength,
        width: detectedWidth,
        shallowDepth: detectedShallowDepth,
        deepEnd: detectedDeepEnd,
        deckArea: deckArea,
        poolGallons: poolGallons,
        spaGallons: 450, // Default spa size estimate
      });

      // Auto-populate line items with calculated quantities
      setTradeData(prev => {
        const updated = { ...prev };

        // Inground Pool trade - update quantities based on pool size
        if (updated.inground_pool) {
          updated.inground_pool = {
            ...updated.inground_pool,
            enabled: true,
            expanded: true,
            lineItems: updated.inground_pool.lineItems.map(item => {
              let qty = item.qty;
              // Auto-calculate quantities based on description
              if (item.description.toLowerCase().includes('shotcrete') || item.description.toLowerCase().includes('gunite')) {
                qty = Math.ceil((poolArea * avgDepth * 0.08) / 27); // cubic yards
              } else if (item.description.toLowerCase().includes('rebar')) {
                qty = Math.ceil(poolArea / 50); // sections
              } else if (item.description.toLowerCase().includes('concrete pump')) {
                qty = 1;
              } else if (item.description.toLowerCase().includes('fuel charge')) {
                qty = Math.ceil((poolArea * avgDepth * 0.08) / 27 / 9); // per 9 CYD
              } else if (item.description.toLowerCase().includes('admixture')) {
                qty = Math.ceil((poolArea * avgDepth * 0.08) / 27); // per cubic yard
              }
              return { ...item, qty };
            }),
          };
        }

        // Access trade - excavation, deck work
        if (updated.access) {
          updated.access = {
            ...updated.access,
            enabled: true,
            expanded: true,
            lineItems: updated.access.lineItems.map(item => {
              let qty = item.qty;
              if (item.description.toLowerCase().includes('deck')) {
                qty = deckArea;
              } else if (item.description.toLowerCase().includes('fence')) {
                qty = Math.ceil(poolPerimeter * 1.5); // fence around pool area
              } else if (item.description.toLowerCase().includes('gate')) {
                qty = 1;
              }
              return { ...item, qty };
            }),
          };
        }

        // Plumbing
        if (updated.plumbing) {
          updated.plumbing = {
            ...updated.plumbing,
            enabled: true,
            lineItems: updated.plumbing.lineItems.map(item => {
              let qty = item.qty;
              if (item.description.toLowerCase().includes('main drain')) {
                qty = 2;
              } else if (item.description.toLowerCase().includes('skimmer')) {
                qty = Math.ceil(poolPerimeter / 40); // 1 per 40 LF
              } else if (item.description.toLowerCase().includes('return')) {
                qty = Math.ceil(poolPerimeter / 25); // 1 per 25 LF
              }
              return { ...item, qty };
            }),
          };
        }

        // Electrical
        if (updated.electrical) {
          updated.electrical = {
            ...updated.electrical,
            enabled: true,
            lineItems: updated.electrical.lineItems.map(item => {
              let qty = item.qty;
              if (item.description.toLowerCase().includes('light')) {
                qty = Math.ceil(poolPerimeter / 30); // 1 per 30 LF
              } else if (item.description.toLowerCase().includes('bonding')) {
                qty = 1;
              }
              return { ...item, qty };
            }),
          };
        }

        return updated;
      });

      setAnalysisStatus('complete');
    }, 1500);
  }, [uploadedFiles.length]);

  // Trade Handlers
  const toggleTradeEnabled = useCallback((tradeId: TradeCategory) => {
    setTradeData((prev) => ({
      ...prev,
      [tradeId]: { ...prev[tradeId], enabled: !prev[tradeId].enabled },
    }));
  }, []);

  const toggleTradeExpanded = useCallback((tradeId: TradeCategory) => {
    setTradeData((prev) => ({
      ...prev,
      [tradeId]: { ...prev[tradeId], expanded: !prev[tradeId].expanded },
    }));
  }, []);

  const updateLineItem = useCallback(
    (tradeId: TradeCategory, itemId: string, field: keyof LineItem, value: number | string) => {
      setTradeData((prev) => ({
        ...prev,
        [tradeId]: {
          ...prev[tradeId],
          lineItems: prev[tradeId].lineItems.map((item) =>
            item.id === itemId ? { ...item, [field]: value } : item
          ),
        },
      }));
    },
    []
  );

  // Handle selecting a pricing item from the database
  const handlePricingSelect = useCallback((pricingId: string) => {
    if (!pricingId) {
      setNewItemForm(prev => ({ ...prev, selectedPricingId: '', materials: 0, unit: 'EA' }));
      return;
    }
    const pricing = getPricingById(pricingId);
    if (pricing) {
      setNewItemForm(prev => ({
        ...prev,
        selectedPricingId: pricingId,
        materials: pricing.baseCost,
        unit: pricing.unit.toUpperCase(),
        customDescription: '',
      }));
    }
  }, []);

  // Add a new line item to a trade
  const addLineItem = useCallback((tradeId: TradeCategory) => {
    const pricing = newItemForm.selectedPricingId ? getPricingById(newItemForm.selectedPricingId) : null;
    const description = pricing ? pricing.item : newItemForm.customDescription;

    if (!description) return;

    const newItem: LineItem = {
      id: `${tradeId}-${Date.now()}`,
      description,
      qty: newItemForm.quantity,
      unit: newItemForm.unit,
      materials: newItemForm.materials,
      equipment: newItemForm.equipment,
      labor: newItemForm.labor,
      notes: pricing?.notes || '',
    };

    setTradeData(prev => ({
      ...prev,
      [tradeId]: {
        ...prev[tradeId],
        lineItems: [...prev[tradeId].lineItems, newItem],
      },
    }));

    // Reset form and close modal
    setNewItemForm({
      selectedPricingId: '',
      customDescription: '',
      quantity: 1,
      materials: 0,
      equipment: 0,
      labor: 0,
      unit: 'EA',
    });
    setShowAddItemModal(null);
  }, [newItemForm]);

  // Calculate Totals
  const calculateTradeTotals = useCallback((trade: TradeData) => {
    let costTotal = 0;
    let sellTotal = 0;
    trade.lineItems.forEach((item) => {
      const itemMaterials = item.qty * item.materials;
      const itemEquipment = item.qty * item.equipment;
      const itemLabor = item.qty * item.labor;
      costTotal += itemMaterials + itemEquipment + itemLabor;
      sellTotal += (itemMaterials + itemEquipment + itemLabor) * 1.25; // 25% markup
    });
    return { costTotal, sellTotal };
  }, []);

  // Project Totals
  const projectTotals = React.useMemo(() => {
    let materialsCost = 0;
    let equipmentCost = 0;
    let laborCost = 0;
    let activeTradesCount = 0;
    let totalLineItems = 0;

    Object.entries(tradeData).forEach(([, trade]) => {
      if (trade.enabled) {
        activeTradesCount++;
        trade.lineItems.forEach((item) => {
          if (item.qty > 0) {
            totalLineItems++;
            materialsCost += item.qty * item.materials;
            equipmentCost += item.qty * item.equipment;
            laborCost += item.qty * item.labor;
          }
        });
      }
    });

    const totalCost = materialsCost + equipmentCost + laborCost;
    const subtotal = totalCost * 1.25; // 25% markup
    // Sales tax only applies to materials and equipment, not labor
    const taxableAmount = (materialsCost + equipmentCost) * 1.25;
    const salesTax = taxableAmount * 0.08;
    const contractPrice = subtotal + salesTax;
    const grossProfit = contractPrice - totalCost;
    const marginPercent = totalCost > 0 ? (grossProfit / contractPrice) * 100 : 0;

    return {
      materialsCost,
      equipmentCost,
      laborCost,
      totalCost,
      subtotal,
      salesTax,
      contractPrice,
      grossProfit,
      marginPercent,
      activeTradesCount,
      totalLineItems,
    };
  }, [tradeData]);

  // Export to CSV
  const exportToCSV = useCallback((isClientView: boolean) => {
    const lines: string[] = [];
    const date = new Date().toLocaleDateString();

    // Header info
    lines.push(`BlueCrew CostLab - ${isClientView ? 'Client Proposal' : 'Internal Estimate'}`);
    lines.push(`Generated: ${date}`);
    lines.push(`Job Number: ${projectInfo.jobNumber}`);
    lines.push(`Job Name: ${projectInfo.jobName}`);
    lines.push(`Owner: ${projectInfo.ownerName}`);
    lines.push(`Address: ${projectInfo.streetAddress}, ${projectInfo.city}, ${projectInfo.state}`);
    lines.push('');

    // Pool info
    lines.push('Pool Geometry');
    lines.push(`Shape: ${poolGeometry.poolShape}`);
    lines.push(`Dimensions: ${poolGeometry.length}' x ${poolGeometry.width}'`);
    lines.push(`Depth: ${poolGeometry.shallowDepth}' - ${poolGeometry.deepEnd}'`);
    lines.push(`Pool Gallons: ${poolGeometry.poolGallons.toLocaleString()}`);
    lines.push(`Spa Gallons: ${poolGeometry.spaGallons.toLocaleString()}`);
    lines.push('');

    // Line items header
    if (isClientView) {
      lines.push('Trade,Description,QTY,Unit,Sell Total');
    } else {
      lines.push('Trade,Description,QTY,Unit,Materials,Equipment,Labor,Cost Total,Sell Total');
    }

    // Line items
    TRADE_LIST.forEach(trade => {
      const data = tradeData[trade.id];
      if (data.enabled) {
        data.lineItems.forEach(item => {
          if (item.qty > 0) {
            const costTotal = item.qty * item.materials + item.qty * item.equipment + item.qty * item.labor;
            const sellTotal = costTotal * 1.25;
            if (isClientView) {
              lines.push(`"${trade.name}","${item.description}",${item.qty},${item.unit},$${sellTotal.toFixed(2)}`);
            } else {
              lines.push(`"${trade.name}","${item.description}",${item.qty},${item.unit},$${item.materials.toFixed(2)},$${item.equipment.toFixed(2)},$${item.labor.toFixed(2)},$${costTotal.toFixed(2)},$${sellTotal.toFixed(2)}`);
            }
          }
        });
      }
    });

    lines.push('');

    // Totals
    if (isClientView) {
      lines.push('Summary');
      lines.push(`Subtotal,$${projectTotals.subtotal.toLocaleString()}`);
      lines.push(`Sales Tax (8%),$${projectTotals.salesTax.toLocaleString()}`);
      lines.push(`Contract Price,$${projectTotals.contractPrice.toLocaleString()}`);
    } else {
      lines.push('Cost Summary');
      lines.push(`Materials Cost,$${projectTotals.materialsCost.toLocaleString()}`);
      lines.push(`Equipment Cost,$${projectTotals.equipmentCost.toLocaleString()}`);
      lines.push(`Labor Cost,$${projectTotals.laborCost.toLocaleString()}`);
      lines.push(`Total Cost,$${projectTotals.totalCost.toLocaleString()}`);
      lines.push('');
      lines.push('Pricing');
      lines.push(`Subtotal,$${projectTotals.subtotal.toLocaleString()}`);
      lines.push(`Sales Tax (8%),$${projectTotals.salesTax.toLocaleString()}`);
      lines.push(`Contract Price,$${projectTotals.contractPrice.toLocaleString()}`);
      lines.push(`Gross Profit,$${projectTotals.grossProfit.toLocaleString()}`);
      lines.push(`Margin,${projectTotals.marginPercent.toFixed(1)}%`);
    }

    // Create and download file
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
  }, [projectInfo, poolGeometry, tradeData, projectTotals]);

  // Export to PDF (opens print dialog)
  const exportToPDF = useCallback((isClientView: boolean) => {
    const printWindow = window.open('', '_blank');
    if (!printWindow) {
      alert('Please allow popups to export PDF');
      return;
    }

    const date = new Date().toLocaleDateString();

    // Build line items HTML
    let lineItemsHTML = '';
    TRADE_LIST.forEach(trade => {
      const data = tradeData[trade.id];
      if (data.enabled) {
        const tradeItems = data.lineItems.filter(item => item.qty > 0);
        if (tradeItems.length > 0) {
          lineItemsHTML += `<tr class="trade-header"><td colspan="${isClientView ? 4 : 8}">${trade.name}</td></tr>`;
          tradeItems.forEach(item => {
            const costTotal = item.qty * item.materials + item.qty * item.equipment + item.qty * item.labor;
            const sellTotal = costTotal * 1.25;
            if (isClientView) {
              lineItemsHTML += `<tr><td>${item.description}</td><td>${item.qty}</td><td>${item.unit}</td><td>$${sellTotal.toLocaleString()}</td></tr>`;
            } else {
              lineItemsHTML += `<tr><td>${item.description}</td><td>${item.qty}</td><td>${item.unit}</td><td>$${item.materials.toLocaleString()}</td><td>$${item.equipment.toLocaleString()}</td><td>$${item.labor.toLocaleString()}</td><td>$${costTotal.toLocaleString()}</td><td>$${sellTotal.toLocaleString()}</td></tr>`;
            }
          });
        }
      }
    });

    const html = `
      <!DOCTYPE html>
      <html>
      <head>
        <title>${isClientView ? 'Proposal' : 'Estimate'} - ${projectInfo.jobNumber}</title>
        <style>
          body { font-family: Arial, sans-serif; padding: 20px; max-width: 1000px; margin: 0 auto; }
          h1 { color: #1e40af; margin-bottom: 5px; }
          h2 { color: #374151; font-size: 18px; margin-top: 20px; border-bottom: 2px solid #1e40af; padding-bottom: 5px; }
          .header { display: flex; justify-content: space-between; align-items: start; margin-bottom: 20px; }
          .company { font-size: 12px; color: #6b7280; }
          .info-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 20px; margin-bottom: 20px; }
          .info-section { background: #f3f4f6; padding: 15px; border-radius: 8px; }
          .info-section h3 { margin: 0 0 10px 0; font-size: 14px; color: #1e40af; }
          .info-row { display: flex; justify-content: space-between; font-size: 12px; margin: 5px 0; }
          .info-label { color: #6b7280; }
          table { width: 100%; border-collapse: collapse; font-size: 11px; margin-top: 10px; }
          th { background: #1e40af; color: white; padding: 8px; text-align: left; }
          td { padding: 6px 8px; border-bottom: 1px solid #e5e7eb; }
          tr.trade-header { background: #dbeafe; font-weight: bold; }
          .totals { margin-top: 20px; background: #f3f4f6; padding: 15px; border-radius: 8px; }
          .totals-row { display: flex; justify-content: space-between; padding: 5px 0; font-size: 13px; }
          .totals-row.highlight { font-weight: bold; font-size: 16px; color: #1e40af; border-top: 2px solid #1e40af; margin-top: 10px; padding-top: 10px; }
          .footer { margin-top: 30px; text-align: center; font-size: 11px; color: #6b7280; }
          @media print { body { padding: 0; } }
        </style>
      </head>
      <body>
        <div class="header">
          <div>
            <h1>BlueCrew CostLab</h1>
            <div class="company">Blue Crew Construction • Augusta, GA • (762) 994-6083</div>
          </div>
          <div style="text-align: right;">
            <strong>${isClientView ? 'CLIENT PROPOSAL' : 'INTERNAL ESTIMATE'}</strong><br/>
            <span style="font-size: 12px; color: #6b7280;">Date: ${date}</span>
          </div>
        </div>

        <div class="info-grid">
          <div class="info-section">
            <h3>Project Information</h3>
            <div class="info-row"><span class="info-label">Job Number:</span><span>${projectInfo.jobNumber}</span></div>
            <div class="info-row"><span class="info-label">Job Name:</span><span>${projectInfo.jobName}</span></div>
            <div class="info-row"><span class="info-label">Owner:</span><span>${projectInfo.ownerName}</span></div>
            <div class="info-row"><span class="info-label">Address:</span><span>${projectInfo.streetAddress}</span></div>
            <div class="info-row"><span class="info-label">City/State:</span><span>${projectInfo.city}, ${projectInfo.state}</span></div>
          </div>
          <div class="info-section">
            <h3>Pool Specifications</h3>
            <div class="info-row"><span class="info-label">Shape:</span><span>${poolGeometry.poolShape}</span></div>
            <div class="info-row"><span class="info-label">Dimensions:</span><span>${poolGeometry.length}' x ${poolGeometry.width}'</span></div>
            <div class="info-row"><span class="info-label">Depth:</span><span>${poolGeometry.shallowDepth}' - ${poolGeometry.deepEnd}'</span></div>
            <div class="info-row"><span class="info-label">Pool Gallons:</span><span>${poolGeometry.poolGallons.toLocaleString()}</span></div>
            <div class="info-row"><span class="info-label">Spa Gallons:</span><span>${poolGeometry.spaGallons.toLocaleString()}</span></div>
          </div>
        </div>

        <h2>Line Items</h2>
        <table>
          <thead>
            <tr>
              <th>Description</th>
              <th>QTY</th>
              <th>Unit</th>
              ${isClientView ? '' : '<th>Materials</th><th>Equipment</th><th>Labor</th><th>Cost</th>'}
              <th>${isClientView ? 'Price' : 'Sell'}</th>
            </tr>
          </thead>
          <tbody>
            ${lineItemsHTML}
          </tbody>
        </table>

        <div class="totals">
          ${isClientView ? `
            <div class="totals-row"><span>Subtotal:</span><span>$${projectTotals.subtotal.toLocaleString()}</span></div>
            <div class="totals-row"><span>Sales Tax (8%):</span><span>$${projectTotals.salesTax.toLocaleString()}</span></div>
            <div class="totals-row highlight"><span>Contract Price:</span><span>$${projectTotals.contractPrice.toLocaleString()}</span></div>
          ` : `
            <div class="totals-row"><span>Materials Cost:</span><span>$${projectTotals.materialsCost.toLocaleString()}</span></div>
            <div class="totals-row"><span>Equipment Cost:</span><span>$${projectTotals.equipmentCost.toLocaleString()}</span></div>
            <div class="totals-row"><span>Labor Cost:</span><span>$${projectTotals.laborCost.toLocaleString()}</span></div>
            <div class="totals-row" style="font-weight:bold;"><span>Total Cost:</span><span>$${projectTotals.totalCost.toLocaleString()}</span></div>
            <div class="totals-row" style="margin-top:10px;"><span>Subtotal (with markup):</span><span>$${projectTotals.subtotal.toLocaleString()}</span></div>
            <div class="totals-row"><span>Sales Tax (8%):</span><span>$${projectTotals.salesTax.toLocaleString()}</span></div>
            <div class="totals-row highlight"><span>Contract Price:</span><span>$${projectTotals.contractPrice.toLocaleString()}</span></div>
            <div class="totals-row" style="color:#10b981;"><span>Gross Profit:</span><span>$${projectTotals.grossProfit.toLocaleString()}</span></div>
            <div class="totals-row" style="color:#10b981;"><span>Margin:</span><span>${projectTotals.marginPercent.toFixed(1)}%</span></div>
          `}
        </div>

        <div class="footer">
          <p>Blue Crew Construction • Augusta, GA • (762) 994-6083</p>
          <p>Thank you for your business!</p>
        </div>

        <script>window.onload = function() { window.print(); }</script>
      </body>
      </html>
    `;

    printWindow.document.write(html);
    printWindow.document.close();
    setShowExportMenu(false);
  }, [projectInfo, poolGeometry, tradeData, projectTotals]);

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
            ◉ Internal
          </button>
          <button
            className={`btn ${viewMode === 'client' ? 'btn-internal' : 'btn-client'}`}
            onClick={() => setViewMode('client')}
          >
            👤 Client
          </button>
          <button className="btn btn-save">💾 Save</button>
          <div className="export-dropdown">
            <button className="btn btn-export" onClick={() => setShowExportMenu(!showExportMenu)}>
              📤 Export ▼
            </button>
            {showExportMenu && (
              <div className="export-menu">
                <div className="export-menu-section">
                  <div className="export-menu-title">Internal (Full Details)</div>
                  <button onClick={() => exportToPDF(false)}>📄 PDF - Internal</button>
                  <button onClick={() => exportToCSV(false)}>📊 CSV - Internal</button>
                </div>
                <div className="export-menu-section">
                  <div className="export-menu-title">Client (Proposal)</div>
                  <button onClick={() => exportToPDF(true)}>📄 PDF - Client</button>
                  <button onClick={() => exportToCSV(true)}>📊 CSV - Client</button>
                </div>
              </div>
            )}
          </div>
        </div>
      </header>

      {/* Main Content - 3 Column Layout */}
      <main className="main-content">
        {/* Left Sidebar */}
        <aside className="left-sidebar">
          {/* Drawing Analysis */}
          <div className="sidebar-card">
            <div className="sidebar-card-header">
              <span className="icon">📐</span>
              <h3>Drawing Analysis</h3>
              <span className="collapse-icon">▼</span>
            </div>
            <div className="sidebar-card-content">
              <div
                className={`upload-zone ${isDragging ? 'dragging' : ''}`}
                onDragOver={handleDragOver}
                onDragLeave={handleDragLeave}
                onDrop={handleDrop}
                onClick={() => document.getElementById('file-input')?.click()}
              >
                <div className="upload-icon">⬆️</div>
                <p>Drop drawing here or click to upload</p>
                <p className="supported">PNG, JPG, PDF supported</p>
                <input
                  id="file-input"
                  type="file"
                  accept=".png,.jpg,.jpeg,.pdf,.xlsx,.xls,.csv"
                  multiple
                  onChange={handleFileSelect}
                  style={{ display: 'none' }}
                />
              </div>
              {uploadedFiles.length > 0 && (
                <>
                  <div className="uploaded-files-list">
                    {uploadedFiles.map((file, index) => (
                      <div key={index} className="uploaded-file-card">
                        {filePreviewUrls[index] ? (
                          <img
                            src={filePreviewUrls[index]}
                            alt={file.name}
                            className="file-preview-image"
                          />
                        ) : (
                          <div className="file-preview-placeholder">
                            <span className="file-icon">📄</span>
                          </div>
                        )}
                        <div className="file-info">
                          <span className="file-name">{file.name}</span>
                          <span className="file-size">{(file.size / 1024).toFixed(1)} KB</span>
                        </div>
                        <button className="file-remove" onClick={(e) => { e.stopPropagation(); removeFile(index); }}>
                          ✕
                        </button>
                      </div>
                    ))}
                  </div>
                  <button
                    className={`btn btn-analyze ${analysisStatus === 'analyzing' ? 'analyzing' : ''} ${analysisStatus === 'complete' ? 'complete' : ''}`}
                    onClick={analyzeDrawings}
                    disabled={analysisStatus === 'analyzing'}
                  >
                    {analysisStatus === 'analyzing' ? '🔄 Analyzing...' :
                     analysisStatus === 'complete' ? '✓ Analysis Complete' :
                     '🔍 Analyze Drawing'}
                  </button>
                  {analysisStatus === 'complete' && (
                    <div className="analysis-result">
                      <p>✓ Pool dimensions detected</p>
                      <p>✓ Relevant trades enabled</p>
                    </div>
                  )}
                </>
              )}
            </div>
          </div>

          {/* Project Information */}
          <div className="sidebar-card">
            <div className="sidebar-card-header">
              <span className="icon">📋</span>
              <h3>Project Information</h3>
              <span className="collapse-icon">▼</span>
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
                  placeholder="e.g., Kraemer's Family Pool"
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
              <div className="form-row">
                <div className="form-group">
                  <label>County</label>
                  <input
                    type="text"
                    value={projectInfo.county}
                    onChange={(e) => setProjectInfo({ ...projectInfo, county: e.target.value })}
                  />
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
          </div>

          {/* Pool Geometry */}
          <div className="sidebar-card">
            <div className="sidebar-card-header">
              <span className="icon">📐</span>
              <h3>Pool Geometry</h3>
              <span className="collapse-icon">▼</span>
            </div>
            <div className="sidebar-card-content">
              <div className="form-group">
                <label>Pool Shape</label>
                <select
                  value={poolGeometry.poolShape}
                  onChange={(e) => setPoolGeometry({ ...poolGeometry, poolShape: e.target.value })}
                >
                  <option>Rectangular</option>
                  <option>Freeform</option>
                  <option>Kidney</option>
                  <option>Roman</option>
                  <option>Grecian</option>
                  <option>Lazy L</option>
                </select>
              </div>
              <div className="form-row">
                <div className="form-group">
                  <label>Length (ft)</label>
                  <input
                    type="number"
                    value={poolGeometry.length}
                    onChange={(e) =>
                      setPoolGeometry({ ...poolGeometry, length: parseFloat(e.target.value) || 0 })
                    }
                  />
                </div>
                <div className="form-group">
                  <label>Width (ft)</label>
                  <input
                    type="number"
                    value={poolGeometry.width}
                    onChange={(e) =>
                      setPoolGeometry({ ...poolGeometry, width: parseFloat(e.target.value) || 0 })
                    }
                  />
                </div>
              </div>
              <div className="form-row">
                <div className="form-group">
                  <label>Shallow Depth (ft)</label>
                  <input
                    type="number"
                    step="0.1"
                    value={poolGeometry.shallowDepth}
                    onChange={(e) =>
                      setPoolGeometry({
                        ...poolGeometry,
                        shallowDepth: parseFloat(e.target.value) || 0,
                      })
                    }
                  />
                </div>
                <div className="form-group">
                  <label>Deep End (ft)</label>
                  <input
                    type="number"
                    step="0.1"
                    value={poolGeometry.deepEnd}
                    onChange={(e) =>
                      setPoolGeometry({ ...poolGeometry, deepEnd: parseFloat(e.target.value) || 0 })
                    }
                  />
                </div>
              </div>
              <div className="form-group">
                <label>Deck Area (SF)</label>
                <input
                  type="number"
                  value={poolGeometry.deckArea}
                  onChange={(e) =>
                    setPoolGeometry({ ...poolGeometry, deckArea: parseFloat(e.target.value) || 0 })
                  }
                />
              </div>
              <div className="form-row">
                <div className="form-group">
                  <label>Pool Gallons</label>
                  <input
                    type="number"
                    value={poolGeometry.poolGallons || ''}
                    placeholder="0"
                    onChange={(e) =>
                      setPoolGeometry({ ...poolGeometry, poolGallons: parseFloat(e.target.value) || 0 })
                    }
                  />
                </div>
                <div className="form-group">
                  <label>Spa Gallons</label>
                  <input
                    type="number"
                    value={poolGeometry.spaGallons || ''}
                    placeholder="0"
                    onChange={(e) =>
                      setPoolGeometry({ ...poolGeometry, spaGallons: parseFloat(e.target.value) || 0 })
                    }
                  />
                </div>
              </div>
            </div>
          </div>
        </aside>

        {/* Center Panel - Trade Based Estimate */}
        <section className="center-panel">
          <div className="panel-header">
            <h2>
              <span className="icon">📊</span> Trade-Based Estimate
            </h2>
            <div className="panel-stats">
              <div className="stat">
                <div className="stat-label">Active Trades</div>
                <div className="stat-value">
                  {projectTotals.activeTradesCount} <span>/ 20</span>
                </div>
              </div>
              <div className="stat">
                <div className="stat-label">Line Items</div>
                <div className="stat-value">{projectTotals.totalLineItems}</div>
              </div>
            </div>
          </div>

          <div className="trade-list">
            {TRADE_LIST.map((trade) => {
              const data = tradeData[trade.id];
              const totals = calculateTradeTotals(data);

              return (
                <div key={trade.id} className="trade-section">
                  <div className="trade-header" onClick={() => toggleTradeExpanded(trade.id)}>
                    <span className={`trade-toggle ${data.expanded ? 'expanded' : ''}`}>▶</span>
                    <input
                      type="checkbox"
                      className="trade-checkbox"
                      checked={data.enabled}
                      onChange={(e) => {
                        e.stopPropagation();
                        toggleTradeEnabled(trade.id);
                      }}
                    />
                    <span className="trade-name">◉ {trade.name}</span>
                    <div className="trade-totals">
                      <span className="trade-cost">${totals.costTotal.toLocaleString()}</span>
                      <span className="trade-sell">${totals.sellTotal.toLocaleString()}</span>
                    </div>
                  </div>

                  {data.expanded && (
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
                            <th>Cost Total</th>
                            <th>Sell Total</th>
                          </tr>
                        </thead>
                        <tbody>
                          {data.lineItems.map((item) => {
                            const costTotal = item.qty * item.materials + item.qty * item.equipment + item.qty * item.labor;
                            const sellTotal = costTotal * 1.25;
                            return (
                              <tr key={item.id}>
                                <td className="description">
                                  <input
                                    type="text"
                                    className="desc-input"
                                    value={item.description}
                                    onChange={(e) =>
                                      updateLineItem(trade.id, item.id, 'description', e.target.value)
                                    }
                                  />
                                </td>
                                <td>
                                  <input
                                    type="number"
                                    className="qty-input"
                                    value={item.qty || ''}
                                    onChange={(e) =>
                                      updateLineItem(
                                        trade.id,
                                        item.id,
                                        'qty',
                                        parseFloat(e.target.value) || 0
                                      )
                                    }
                                  />
                                </td>
                                <td>
                                  <input
                                    type="text"
                                    className="unit-input"
                                    value={item.unit}
                                    onChange={(e) =>
                                      updateLineItem(trade.id, item.id, 'unit', e.target.value)
                                    }
                                  />
                                </td>
                                <td>
                                  <input
                                    type="number"
                                    className="cost-input"
                                    value={item.materials || ''}
                                    placeholder="$0.00"
                                    onChange={(e) =>
                                      updateLineItem(
                                        trade.id,
                                        item.id,
                                        'materials',
                                        parseFloat(e.target.value) || 0
                                      )
                                    }
                                  />
                                </td>
                                <td>
                                  <input
                                    type="number"
                                    className="cost-input"
                                    value={item.equipment || ''}
                                    placeholder="$0.00"
                                    onChange={(e) =>
                                      updateLineItem(
                                        trade.id,
                                        item.id,
                                        'equipment',
                                        parseFloat(e.target.value) || 0
                                      )
                                    }
                                  />
                                </td>
                                <td>
                                  <input
                                    type="number"
                                    className="cost-input"
                                    value={item.labor || ''}
                                    placeholder="$0.00"
                                    onChange={(e) =>
                                      updateLineItem(
                                        trade.id,
                                        item.id,
                                        'labor',
                                        parseFloat(e.target.value) || 0
                                      )
                                    }
                                  />
                                </td>
                                <td className="cost-total">
                                  {costTotal > 0 ? `$${costTotal.toLocaleString()}` : '-'}
                                </td>
                                <td className="sell-total">
                                  {sellTotal > 0 ? `$${sellTotal.toLocaleString()}` : '-'}
                                </td>
                              </tr>
                            );
                          })}
                        </tbody>
                      </table>
                      <button
                        className="add-line-btn"
                        onClick={() => setShowAddItemModal(trade.id)}
                      >
                        + Add Line Item
                      </button>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </section>

        {/* Right Sidebar - Project Totals */}
        <aside className="right-sidebar">
          <div className="totals-card">
            <h3>
              <span className="icon">⭐</span> Project Totals
            </h3>

            <div className="totals-section">
              <div className="totals-section-title">Cost Breakdown</div>
              <div className="totals-row">
                <span className="label">Materials Cost:</span>
                <span className="value">${projectTotals.materialsCost.toLocaleString()}</span>
              </div>
              <div className="totals-row">
                <span className="label">Equipment Cost:</span>
                <span className="value">${projectTotals.equipmentCost.toLocaleString()}</span>
              </div>
              <div className="totals-row">
                <span className="label">Labor Cost:</span>
                <span className="value">${projectTotals.laborCost.toLocaleString()}</span>
              </div>
              <div className="totals-row highlight">
                <span className="label">Total Cost:</span>
                <span className="value">${projectTotals.totalCost.toLocaleString()}</span>
              </div>
            </div>

            <div className="totals-section">
              <div className="totals-section-title">Sell Prices</div>
              <div className="totals-row">
                <span className="label">Subtotal:</span>
                <span className="value">${projectTotals.subtotal.toLocaleString()}</span>
              </div>
              <div className="totals-row">
                <span className="label">Sales Tax (8%):</span>
                <span className="value">${projectTotals.salesTax.toLocaleString()}</span>
              </div>
              <div className="totals-row highlight">
                <span className="label">Contract Price:</span>
                <span className="value">${projectTotals.contractPrice.toLocaleString()}</span>
              </div>
            </div>

            <div className="totals-section">
              <div className="totals-section-title">Margin Analysis</div>
              <div
                className={`margin-badge ${
                  projectTotals.marginPercent >= 20
                    ? 'good'
                    : projectTotals.marginPercent >= 15
                      ? 'warning'
                      : 'danger'
                }`}
              >
                ▲ {projectTotals.marginPercent.toFixed(1)}% Margin
              </div>
              <div className="totals-row" style={{ marginTop: '0.75rem' }}>
                <span className="label">Gross Profit:</span>
                <span className="value" style={{ color: 'var(--accent-green)' }}>
                  ${projectTotals.grossProfit.toLocaleString()}
                </span>
              </div>
            </div>

            <div className="totals-section">
              <div className="totals-section-title">Trade Allocation</div>
              <div className="allocation-bar">
                {/* Placeholder allocation segments */}
                <div
                  className="allocation-segment"
                  style={{ width: '30%', background: 'var(--accent-blue)' }}
                />
                <div
                  className="allocation-segment"
                  style={{ width: '20%', background: 'var(--accent-green)' }}
                />
                <div
                  className="allocation-segment"
                  style={{ width: '15%', background: 'var(--accent-orange)' }}
                />
                <div
                  className="allocation-segment"
                  style={{ width: '35%', background: 'var(--accent-purple)' }}
                />
              </div>
            </div>
          </div>
        </aside>
      </main>

      {/* Add Item Modal */}
      {showAddItemModal && (
        <div className="modal-overlay" onClick={() => setShowAddItemModal(null)}>
          <div className="modal" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h3>Add Line Item - {TRADE_LIST.find((t) => t.id === showAddItemModal)?.name}</h3>
              <button className="modal-close" onClick={() => setShowAddItemModal(null)}>
                ✕
              </button>
            </div>
            <div className="modal-body">
              <div className="form-group">
                <label>Category</label>
                <select>
                  <option value="">All Categories</option>
                  {getCategoriesByTrade(showAddItemModal).map((cat) => (
                    <option key={cat} value={cat}>
                      {cat}
                    </option>
                  ))}
                </select>
              </div>
              <div className="form-group">
                <label>Select from Pricing Database</label>
                <select
                  value={newItemForm.selectedPricingId}
                  onChange={(e) => handlePricingSelect(e.target.value)}
                >
                  <option value="">Choose an item...</option>
                  {getPricingByTrade(showAddItemModal).map((p) => (
                    <option key={p.id} value={p.id}>
                      {p.item} - ${p.baseCost.toLocaleString()}/{p.unit}
                    </option>
                  ))}
                </select>
              </div>
              <div className="form-group">
                <label>Or Enter Custom Description</label>
                <input
                  type="text"
                  placeholder="Custom item description"
                  value={newItemForm.customDescription}
                  onChange={(e) => setNewItemForm(prev => ({ ...prev, customDescription: e.target.value, selectedPricingId: '' }))}
                />
              </div>
              <div className="form-row">
                <div className="form-group">
                  <label>Quantity</label>
                  <input
                    type="number"
                    value={newItemForm.quantity}
                    onChange={(e) => setNewItemForm(prev => ({ ...prev, quantity: parseFloat(e.target.value) || 0 }))}
                  />
                </div>
                <div className="form-group">
                  <label>Unit</label>
                  <input
                    type="text"
                    value={newItemForm.unit}
                    onChange={(e) => setNewItemForm(prev => ({ ...prev, unit: e.target.value }))}
                  />
                </div>
              </div>
              <div className="form-row">
                <div className="form-group">
                  <label>Materials ($)</label>
                  <input
                    type="number"
                    step="0.01"
                    value={newItemForm.materials}
                    onChange={(e) => setNewItemForm(prev => ({ ...prev, materials: parseFloat(e.target.value) || 0 }))}
                  />
                </div>
                <div className="form-group">
                  <label>Equipment ($)</label>
                  <input
                    type="number"
                    step="0.01"
                    value={newItemForm.equipment}
                    onChange={(e) => setNewItemForm(prev => ({ ...prev, equipment: parseFloat(e.target.value) || 0 }))}
                  />
                </div>
              </div>
              <div className="form-group">
                <label>Labor ($)</label>
                <input
                  type="number"
                  step="0.01"
                  value={newItemForm.labor}
                  onChange={(e) => setNewItemForm(prev => ({ ...prev, labor: parseFloat(e.target.value) || 0 }))}
                />
              </div>
            </div>
            <div className="modal-footer">
              <button className="btn btn-secondary" onClick={() => setShowAddItemModal(null)}>
                Cancel
              </button>
              <button
                className="btn btn-primary"
                onClick={() => addLineItem(showAddItemModal)}
                disabled={!newItemForm.selectedPricingId && !newItemForm.customDescription}
              >
                Add Item
              </button>
            </div>
          </div>
        </div>
      )}

      <footer className="app-footer">
        <p>BlueCrew CostLab v0.2.0 - AI-Powered Construction Estimating</p>
        <p className="disclaimer">Blue Crew Construction • Augusta, GA • (762) 994-6083</p>
      </footer>
    </div>
  );
}

export default App;
