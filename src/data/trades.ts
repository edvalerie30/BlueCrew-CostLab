/**
 * BlueCrew CostLab - Trade Configuration
 * Defines all trade modules for the estimating system
 */

import type { TradeCategory, TradeConfig } from '../types/estimate';

export const TRADE_CONFIGS: Record<TradeCategory, TradeConfig> = {
  planning: {
    id: 'planning',
    name: 'Planning',
    description: 'Project planning, permits, engineering, design services',
    defaultMarginPercent: 20,
    minimumMarginPercent: 15,
    sortOrder: 1,
  },
  site_preparation: {
    id: 'site_preparation',
    name: 'Site Preparation',
    description: 'Site clearing, grading, demolition, tree removal, utility locates',
    defaultMarginPercent: 22,
    minimumMarginPercent: 15,
    sortOrder: 2,
  },
  inground_pool: {
    id: 'inground_pool',
    name: 'Inground Pool',
    description: 'Pool shell construction including excavation, steel, gunite/shotcrete',
    defaultMarginPercent: 25,
    minimumMarginPercent: 18,
    sortOrder: 3,
  },
  inground_spa: {
    id: 'inground_spa',
    name: 'Inground Spa',
    description: 'Attached or detached spa construction',
    defaultMarginPercent: 28,
    minimumMarginPercent: 20,
    sortOrder: 4,
  },
  access: {
    id: 'access',
    name: 'Access',
    description: 'Site access, gate removal, temporary fencing, crane access',
    defaultMarginPercent: 20,
    minimumMarginPercent: 15,
    sortOrder: 5,
  },
  excavation: {
    id: 'excavation',
    name: 'Excavation (Add-Ons)',
    description: 'Additional excavation beyond standard pool dig',
    defaultMarginPercent: 22,
    minimumMarginPercent: 15,
    sortOrder: 6,
  },
  equipment_runs: {
    id: 'equipment_runs',
    name: 'Equipment Runs (Trenches)',
    description: 'Trenching for equipment lines and conduit',
    defaultMarginPercent: 20,
    minimumMarginPercent: 15,
    sortOrder: 7,
  },
  plumbing: {
    id: 'plumbing',
    name: 'Plumbing (Add-Ons)',
    description: 'Additional plumbing beyond standard pool package',
    defaultMarginPercent: 25,
    minimumMarginPercent: 18,
    sortOrder: 8,
  },
  electrical: {
    id: 'electrical',
    name: 'Electrical (Add-Ons)',
    description: 'Electrical work including sub-panel, bonding, lighting',
    defaultMarginPercent: 25,
    minimumMarginPercent: 18,
    sortOrder: 9,
  },
  gas_lp_solar: {
    id: 'gas_lp_solar',
    name: 'Gas / LP / Solar',
    description: 'Gas lines, LP tank installation, solar heating systems',
    defaultMarginPercent: 22,
    minimumMarginPercent: 15,
    sortOrder: 10,
  },
  structural: {
    id: 'structural',
    name: 'Structural',
    description: 'Retaining walls, grade beams, structural engineering',
    defaultMarginPercent: 25,
    minimumMarginPercent: 18,
    sortOrder: 11,
  },
  masonry: {
    id: 'masonry',
    name: 'Masonry',
    description: 'Block walls, raised bond beams, decorative masonry',
    defaultMarginPercent: 28,
    minimumMarginPercent: 20,
    sortOrder: 12,
  },
  coping_tile: {
    id: 'coping_tile',
    name: 'Coping & Tile',
    description: 'Pool coping, waterline tile, decorative tile features',
    defaultMarginPercent: 30,
    minimumMarginPercent: 22,
    sortOrder: 13,
  },
  concrete_decking: {
    id: 'concrete_decking',
    name: 'Concrete Decking',
    description: 'Pool deck concrete including prep and forming',
    defaultMarginPercent: 25,
    minimumMarginPercent: 18,
    sortOrder: 14,
  },
  deck_finish: {
    id: 'deck_finish',
    name: 'Deck Finish',
    description: 'Cool deck, pavers, travertine, stamped concrete',
    defaultMarginPercent: 28,
    minimumMarginPercent: 20,
    sortOrder: 15,
  },
  pool_interiors: {
    id: 'pool_interiors',
    name: 'Pool Interiors',
    description: 'Plaster, pebble finish, tile interiors',
    defaultMarginPercent: 28,
    minimumMarginPercent: 20,
    sortOrder: 16,
  },
  cleaning_system: {
    id: 'cleaning_system',
    name: 'Cleaning System',
    description: 'In-floor cleaning, robotic cleaners, suction cleaners',
    defaultMarginPercent: 30,
    minimumMarginPercent: 22,
    sortOrder: 17,
  },
  equipment_controls: {
    id: 'equipment_controls',
    name: 'Equipment & Controls',
    description: 'Pumps, filters, heaters, automation, sanitization',
    defaultMarginPercent: 25,
    minimumMarginPercent: 18,
    sortOrder: 18,
  },
  water_features: {
    id: 'water_features',
    name: 'Water Features',
    description: 'Waterfalls, sheer descents, bubblers, deck jets, fountains',
    defaultMarginPercent: 32,
    minimumMarginPercent: 25,
    sortOrder: 19,
  },
  pool_accessories: {
    id: 'pool_accessories',
    name: 'Pool Accessories',
    description: 'Handrails, ladders, diving boards, slides, covers',
    defaultMarginPercent: 28,
    minimumMarginPercent: 20,
    sortOrder: 20,
  },
  landscaping_misc: {
    id: 'landscaping_misc',
    name: 'Landscaping / Misc',
    description: 'Turf, planting, irrigation, outdoor kitchens, pergolas',
    defaultMarginPercent: 25,
    minimumMarginPercent: 18,
    sortOrder: 21,
  },
  other: {
    id: 'other',
    name: 'Other',
    description: 'Permits, engineering, allowances, contingency',
    defaultMarginPercent: 15,
    minimumMarginPercent: 10,
    sortOrder: 22,
  },
};

export const TRADE_LIST: TradeConfig[] = Object.values(TRADE_CONFIGS).sort(
  (a, b) => a.sortOrder - b.sortOrder
);

export function getTradeConfig(tradeId: TradeCategory): TradeConfig {
  return TRADE_CONFIGS[tradeId];
}

export function getTradeMinMargin(tradeId: TradeCategory): number {
  return TRADE_CONFIGS[tradeId].minimumMarginPercent;
}

export function getTradeDefaultMargin(tradeId: TradeCategory): number {
  return TRADE_CONFIGS[tradeId].defaultMarginPercent;
}
