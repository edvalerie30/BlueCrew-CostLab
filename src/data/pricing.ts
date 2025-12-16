/**
 * BlueCrew CostLab - Default Pricing Tables
 * Sample pricing data for pool construction trades
 *
 * IMPORTANT: In production, this would be loaded from company-specific data files
 * These are placeholder values for demonstration purposes
 */

import type { PricingTable, PricingTableEntry } from '../types/estimate';

export const DEFAULT_PRICING_TABLE: PricingTable = {
  version: '1.0.0',
  lastUpdated: '2024-01-01',
  entries: [
    // Inground Pool
    {
      id: 'pool_gunite_standard',
      tradeId: 'inground_pool',
      category: 'Gunite/Shotcrete',
      item: 'Standard Pool Shell (per sqft pool area)',
      unit: 'sqft',
      baseCost: 45,
      defaultMarkup: 0.25,
      tier: 'standard',
    },
    {
      id: 'pool_steel_rebar',
      tradeId: 'inground_pool',
      category: 'Steel',
      item: 'Rebar Package',
      unit: 'lb',
      baseCost: 1.25,
      defaultMarkup: 0.25,
    },
    {
      id: 'pool_excavation',
      tradeId: 'inground_pool',
      category: 'Excavation',
      item: 'Pool Excavation (included)',
      unit: 'cuyd',
      baseCost: 35,
      defaultMarkup: 0.22,
    },

    // Inground Spa
    {
      id: 'spa_attached',
      tradeId: 'inground_spa',
      category: 'Spa',
      item: 'Attached Spa Package (up to 8x8)',
      unit: 'ea',
      baseCost: 8500,
      defaultMarkup: 0.28,
    },
    {
      id: 'spa_spillover',
      tradeId: 'inground_spa',
      category: 'Spa',
      item: 'Spillover Feature',
      unit: 'ea',
      baseCost: 2200,
      defaultMarkup: 0.30,
    },

    // Masonry
    {
      id: 'masonry_raised_wall',
      tradeId: 'masonry',
      category: 'Raised Walls',
      item: 'Raised Bond Beam (per LF)',
      unit: 'lf',
      baseCost: 85,
      defaultMarkup: 0.28,
    },
    {
      id: 'masonry_block_wall',
      tradeId: 'masonry',
      category: 'Block Walls',
      item: 'CMU Block Wall (per sqft)',
      unit: 'sqft',
      baseCost: 22,
      defaultMarkup: 0.28,
    },

    // Coping & Tile
    {
      id: 'coping_precast',
      tradeId: 'coping_tile',
      category: 'Coping',
      item: 'Precast Coping - Standard',
      unit: 'lf',
      baseCost: 28,
      defaultMarkup: 0.30,
      tier: 'standard',
    },
    {
      id: 'coping_travertine',
      tradeId: 'coping_tile',
      category: 'Coping',
      item: 'Travertine Coping',
      unit: 'lf',
      baseCost: 48,
      defaultMarkup: 0.30,
      tier: 'premium',
    },
    {
      id: 'tile_waterline_6',
      tradeId: 'coping_tile',
      category: 'Tile',
      item: 'Waterline Tile - 6" Standard',
      unit: 'lf',
      baseCost: 18,
      defaultMarkup: 0.30,
      tier: 'standard',
    },
    {
      id: 'tile_waterline_glass',
      tradeId: 'coping_tile',
      category: 'Tile',
      item: 'Waterline Tile - Glass Mosaic',
      unit: 'lf',
      baseCost: 42,
      defaultMarkup: 0.32,
      tier: 'premium',
    },

    // Concrete Decking
    {
      id: 'deck_concrete_standard',
      tradeId: 'concrete_decking',
      category: 'Concrete',
      item: 'Pool Deck Concrete (4" with wire mesh)',
      unit: 'sqft',
      baseCost: 8.5,
      defaultMarkup: 0.25,
    },
    {
      id: 'deck_demo',
      tradeId: 'concrete_decking',
      category: 'Demo',
      item: 'Existing Concrete Demo',
      unit: 'sqft',
      baseCost: 3.5,
      defaultMarkup: 0.22,
    },

    // Deck Finish
    {
      id: 'finish_cool_deck',
      tradeId: 'deck_finish',
      category: 'Finish',
      item: 'Kool Deck - Standard Color',
      unit: 'sqft',
      baseCost: 6.5,
      defaultMarkup: 0.28,
      tier: 'standard',
    },
    {
      id: 'finish_pavers',
      tradeId: 'deck_finish',
      category: 'Finish',
      item: 'Pavers - Standard',
      unit: 'sqft',
      baseCost: 14,
      defaultMarkup: 0.28,
      tier: 'premium',
    },
    {
      id: 'finish_travertine',
      tradeId: 'deck_finish',
      category: 'Finish',
      item: 'Travertine Pavers',
      unit: 'sqft',
      baseCost: 22,
      defaultMarkup: 0.30,
      tier: 'luxury',
    },

    // Pool Interiors
    {
      id: 'interior_white_plaster',
      tradeId: 'pool_interiors',
      category: 'Plaster',
      item: 'White Marcite Plaster',
      unit: 'sqft',
      baseCost: 5.5,
      defaultMarkup: 0.28,
      tier: 'standard',
    },
    {
      id: 'interior_quartz',
      tradeId: 'pool_interiors',
      category: 'Plaster',
      item: 'Quartz Aggregate Finish',
      unit: 'sqft',
      baseCost: 8.5,
      defaultMarkup: 0.28,
      tier: 'premium',
    },
    {
      id: 'interior_pebble',
      tradeId: 'pool_interiors',
      category: 'Plaster',
      item: 'Pebble Tech Finish',
      unit: 'sqft',
      baseCost: 11,
      defaultMarkup: 0.30,
      tier: 'luxury',
    },

    // Equipment & Controls
    {
      id: 'equipment_pump_vs',
      tradeId: 'equipment_controls',
      category: 'Pumps',
      item: 'Variable Speed Pump - Standard',
      unit: 'ea',
      baseCost: 1200,
      defaultMarkup: 0.25,
    },
    {
      id: 'equipment_filter_de',
      tradeId: 'equipment_controls',
      category: 'Filters',
      item: 'DE Filter - 60 sqft',
      unit: 'ea',
      baseCost: 850,
      defaultMarkup: 0.25,
    },
    {
      id: 'equipment_heater_gas',
      tradeId: 'equipment_controls',
      category: 'Heaters',
      item: 'Gas Heater - 400K BTU',
      unit: 'ea',
      baseCost: 3200,
      defaultMarkup: 0.25,
    },
    {
      id: 'equipment_automation',
      tradeId: 'equipment_controls',
      category: 'Automation',
      item: 'Pool Automation System - Basic',
      unit: 'ea',
      baseCost: 2800,
      defaultMarkup: 0.28,
    },
    {
      id: 'equipment_salt_cell',
      tradeId: 'equipment_controls',
      category: 'Sanitization',
      item: 'Salt Chlorine Generator',
      unit: 'ea',
      baseCost: 1400,
      defaultMarkup: 0.28,
    },

    // Water Features
    {
      id: 'wf_sheer_descent_2ft',
      tradeId: 'water_features',
      category: 'Sheer Descents',
      item: 'Sheer Descent - 2ft',
      unit: 'ea',
      baseCost: 1100,
      defaultMarkup: 0.32,
    },
    {
      id: 'wf_sheer_descent_4ft',
      tradeId: 'water_features',
      category: 'Sheer Descents',
      item: 'Sheer Descent - 4ft',
      unit: 'ea',
      baseCost: 1600,
      defaultMarkup: 0.32,
    },
    {
      id: 'wf_bubbler',
      tradeId: 'water_features',
      category: 'Bubblers',
      item: 'Bubbler - LED',
      unit: 'ea',
      baseCost: 450,
      defaultMarkup: 0.32,
    },
    {
      id: 'wf_deck_jet',
      tradeId: 'water_features',
      category: 'Deck Jets',
      item: 'Deck Jet - Laminar',
      unit: 'ea',
      baseCost: 550,
      defaultMarkup: 0.32,
    },

    // Electrical
    {
      id: 'elec_sub_panel',
      tradeId: 'electrical',
      category: 'Electrical',
      item: 'Sub Panel Installation',
      unit: 'ea',
      baseCost: 1800,
      defaultMarkup: 0.25,
    },
    {
      id: 'elec_led_light',
      tradeId: 'electrical',
      category: 'Lighting',
      item: 'LED Pool Light',
      unit: 'ea',
      baseCost: 650,
      defaultMarkup: 0.28,
    },
    {
      id: 'elec_bonding',
      tradeId: 'electrical',
      category: 'Bonding',
      item: 'Pool Bonding Package',
      unit: 'ea',
      baseCost: 450,
      defaultMarkup: 0.22,
    },

    // Plumbing
    {
      id: 'plumb_return',
      tradeId: 'plumbing',
      category: 'Returns',
      item: 'Additional Return Line',
      unit: 'ea',
      baseCost: 350,
      defaultMarkup: 0.25,
    },
    {
      id: 'plumb_main_drain',
      tradeId: 'plumbing',
      category: 'Drains',
      item: 'Additional Main Drain',
      unit: 'ea',
      baseCost: 450,
      defaultMarkup: 0.25,
    },

    // Cleaning System
    {
      id: 'clean_infloor',
      tradeId: 'cleaning_system',
      category: 'In-Floor',
      item: 'In-Floor Cleaning System',
      unit: 'sqft',
      baseCost: 12,
      defaultMarkup: 0.30,
    },

    // Other
    {
      id: 'other_permit',
      tradeId: 'other',
      category: 'Permits',
      item: 'Building Permit Allowance',
      unit: 'ea',
      baseCost: 1500,
      defaultMarkup: 0.10,
    },
    {
      id: 'other_engineering',
      tradeId: 'other',
      category: 'Engineering',
      item: 'Structural Engineering',
      unit: 'ea',
      baseCost: 1200,
      defaultMarkup: 0.15,
    },
  ],
};

/**
 * Get pricing entries by trade
 */
export function getPricingByTrade(tradeId: string): PricingTableEntry[] {
  return DEFAULT_PRICING_TABLE.entries.filter((entry) => entry.tradeId === tradeId);
}

/**
 * Get pricing entry by ID
 */
export function getPricingById(id: string): PricingTableEntry | undefined {
  return DEFAULT_PRICING_TABLE.entries.find((entry) => entry.id === id);
}

/**
 * Get all pricing categories for a trade
 */
export function getCategoriesByTrade(tradeId: string): string[] {
  const entries = getPricingByTrade(tradeId);
  return [...new Set(entries.map((e) => e.category))];
}
