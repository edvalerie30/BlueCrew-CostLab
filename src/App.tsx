/**
 * BlueCrew CostLab - Main Application Component
 * AI-Powered Construction Estimating Platform
 * Multi-scope project estimating with proposal generation
 */

import { useState, useCallback, useMemo, useRef } from 'react';
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

// Proposal content for each scope
interface ProposalContent {
  sectionTitle: string;
  imageUrl: string;
  constructionBullets: string[];
  componentsIncluded: string[];
  finishes: string[];
  notIncluded: string[];
  upgrades: { description: string; amount: number }[];
  designFee: number;
}

// Scope data structure
interface ScopeData {
  enabled: boolean;
  categories: CategoryData[];
  proposal: ProposalContent;
}

// Project Info
interface ProjectInfo {
  jobNumber: string;
  jobName: string;
  ownerName: string;
  ownerPhone: string;
  ownerEmail: string;
  streetAddress: string;
  city: string;
  state: string;
  county: string;
  bidDate: string;
  bidEndDate: string;
  estimator: string;
  revision: number;
  projectType: string;
  poolArea: number;
  poolPerimeter: number;
  poolDepthShallow: number;
  poolDepthMiddle: number;
  poolDepthDeep: number;
  avgDepth: number;
  poolGallons: number;
}

// Scope configuration
const SCOPE_CONFIGS: Record<ProjectScope, { name: string; icon: string; categories: string[]; defaultTitle: string }> = {
  pool: {
    name: 'Pool',
    icon: '🏊',
    categories: ['Planning', 'Site Prep', 'Excavation', 'Steel & Gunite', 'Plumbing', 'Electrical', 'Equipment', 'Tile & Coping', 'Deck', 'Interior Finish', 'Water Features', 'Accessories'],
    defaultTitle: 'Pool Package',
  },
  portable_spa: {
    name: 'Portable Spa',
    icon: '🛁',
    categories: ['Spa Unit', 'Electrical', 'Site Prep', 'Delivery', 'Accessories'],
    defaultTitle: 'Portable Spa Area',
  },
  pavilion: {
    name: 'Pavilion/Gazebo',
    icon: '🏛️',
    categories: ['Structure', 'Concrete/Foundation', 'Flooring', 'Electrical & Lighting', 'Painting & Stain', 'Fireplace/Masonry', 'Accessories'],
    defaultTitle: 'Outdoor Kitchen, brick steps and pool deck extension',
  },
  retaining_wall: {
    name: 'Retaining Wall',
    icon: '🧱',
    categories: ['Excavation', 'Foundation', 'Block/Stone', 'Caps & Finish', 'Drainage', 'Backfill'],
    defaultTitle: 'Retaining Wall',
  },
  fire_pit: {
    name: 'Fire Pit Area',
    icon: '🔥',
    categories: ['Foundation', 'Masonry', 'Stone/Veneer', 'Gas Line', 'Fire Features', 'Seating', 'Lighting'],
    defaultTitle: 'Outdoor Fireplace Area',
  },
  summary: {
    name: 'Summary',
    icon: '📊',
    categories: [],
    defaultTitle: 'Project Summary',
  },
};

// Line item template with pricing data
interface LineItemTemplate {
  description: string;
  unit: string;
  margin: number;
  materials?: number;
  labor?: number;
  equipment?: number;
  subcontract?: number;
  notes?: string;
}

// Default line items for each scope/category with pricing from spreadsheets
const DEFAULT_LINE_ITEMS: Record<ProjectScope, Record<string, LineItemTemplate[]>> = {
  pool: {
    'Planning': [
      { description: 'Pool Design / Engineering', unit: 'LS', margin: 20 },
      { description: 'Building Permit', unit: 'LS', margin: 15 },
      { description: 'Survey / Stakeout', unit: 'LS', margin: 20 },
      { description: 'HOA Approval / Coordination', unit: 'LS', margin: 15 },
      { description: 'Structural Engineering', unit: 'LS', margin: 20 },
    ],
    'Site Prep': [
      { description: 'Clear & Grub', unit: 'LS', margin: 22 },
      { description: 'Tree Removal', unit: 'EA', margin: 22 },
      { description: 'Temporary Fencing', unit: 'LF', margin: 20 },
      { description: 'Layout & Staking', unit: 'LS', margin: 20 },
      { description: 'Silt Fence / Erosion Control', unit: 'LF', margin: 20 },
      { description: 'Utility Locates', unit: 'LS', margin: 15 },
    ],
    'Excavation': [
      { description: 'Pool Excavation', unit: 'CY', margin: 22 },
      { description: 'Spoils Removal / Haul Off', unit: 'LD', margin: 22 },
      { description: 'Over-Dig (Rock/Groundwater)', unit: 'CY', margin: 25 },
      { description: 'Fine Grade', unit: 'SF', margin: 22 },
      { description: 'Dewatering', unit: 'DAY', margin: 25 },
    ],
    'Steel & Gunite': [
      { description: 'Steel Rebar Package', unit: 'LS', margin: 25 },
      { description: 'Gunite / Shotcrete Shell', unit: 'SF', margin: 28 },
      { description: 'Bond Beam', unit: 'LF', margin: 25 },
      { description: 'Step / Bench Forms', unit: 'EA', margin: 25 },
      { description: 'Spa Spillway', unit: 'EA', margin: 28 },
    ],
    'Plumbing': [
      { description: 'Main Drain(s)', unit: 'EA', margin: 25 },
      { description: 'Skimmer(s)', unit: 'EA', margin: 25 },
      { description: 'Return Inlets', unit: 'EA', margin: 25 },
      { description: 'Spa Jets', unit: 'EA', margin: 25 },
      { description: 'Water Feature Plumbing', unit: 'EA', margin: 25 },
      { description: 'Autofill', unit: 'EA', margin: 25 },
      { description: 'Equipment Pad Plumbing', unit: 'LS', margin: 25 },
    ],
    'Electrical': [
      { description: 'Sub-Panel Installation', unit: 'EA', margin: 25 },
      { description: 'Pool/Spa Bonding', unit: 'LS', margin: 25 },
      { description: 'Light Niche(s)', unit: 'EA', margin: 25 },
      { description: 'LED Pool Light(s)', unit: 'EA', margin: 28 },
      { description: 'Equipment Power Wiring', unit: 'LS', margin: 25 },
      { description: 'GFCI Outlets', unit: 'EA', margin: 22 },
    ],
    'Equipment': [
      { description: 'Variable Speed Pump', unit: 'EA', margin: 28 },
      { description: 'Cartridge Filter', unit: 'EA', margin: 28 },
      { description: 'Gas Heater', unit: 'EA', margin: 25 },
      { description: 'Salt Chlorine Generator', unit: 'EA', margin: 30 },
      { description: 'Pool Automation System', unit: 'EA', margin: 30 },
      { description: 'Check Valves / Unions', unit: 'SET', margin: 25 },
      { description: 'Equipment Pad (Concrete)', unit: 'SF', margin: 22 },
    ],
    'Tile & Coping': [
      { description: 'Cantilever Coping', unit: 'LF', margin: 30 },
      { description: 'Bullnose Coping (Upgrade)', unit: 'LF', margin: 32 },
      { description: 'Waterline Tile', unit: 'LF', margin: 30 },
      { description: 'Step/Bench Tile', unit: 'SF', margin: 30 },
      { description: 'Mosaic Tile Accent', unit: 'SF', margin: 32 },
    ],
    'Deck': [
      { description: 'Concrete Deck (4")', unit: 'SF', margin: 20, materials: 4.00, labor: 3.00 },
      { description: 'Cool Deck Finish', unit: 'SF', margin: 28 },
      { description: 'Travertine Pavers', unit: 'SF', margin: 30 },
      { description: 'Stamped Concrete', unit: 'SF', margin: 28 },
      { description: 'Expansion Joints', unit: 'LF', margin: 22 },
    ],
    'Interior Finish': [
      { description: 'Standard White Plaster', unit: 'SF', margin: 28 },
      { description: 'Pebble Finish (Standard)', unit: 'SF', margin: 30 },
      { description: 'Pebble Finish (Premium)', unit: 'SF', margin: 32 },
      { description: 'Glass Bead Finish', unit: 'SF', margin: 32 },
      { description: 'Quartz Finish', unit: 'SF', margin: 30 },
    ],
    'Water Features': [
      { description: 'Sheer Descent', unit: 'EA', margin: 32 },
      { description: 'Raised Wall w/ Sheer Descent', unit: 'LS', margin: 32 },
      { description: 'Deck Jets', unit: 'EA', margin: 30 },
      { description: 'Bubblers', unit: 'EA', margin: 30 },
      { description: 'Grotto / Waterfall', unit: 'LS', margin: 35 },
    ],
    'Accessories': [
      { description: 'Stainless Handrail', unit: 'EA', margin: 28 },
      { description: 'In-Pool Ladder', unit: 'EA', margin: 28 },
      { description: 'Diving Board', unit: 'EA', margin: 28 },
      { description: 'Pool Slide', unit: 'EA', margin: 28 },
      { description: 'Safety Cover', unit: 'SF', margin: 30 },
      { description: 'Automatic Cover', unit: 'LS', margin: 30 },
    ],
  },
  portable_spa: {
    'Spa Unit': [
      { description: 'Trex Table and Trim around Spa', unit: 'LS', margin: 20, subcontract: 2450.00, notes: 'Caleb Bowen' },
      { description: 'Trex Small side Door', unit: 'LS', margin: 20, subcontract: 550.00, notes: 'Caleb Bowen' },
      { description: 'Trex Cap - Trex surrounding spa', unit: 'LF', margin: 20, materials: 17.00, labor: 1000.00 },
    ],
    'Electrical': [
      { description: 'Electrical (Spa)', unit: 'LS', margin: 20, subcontract: 400.00 },
      { description: 'Main Feeder Connection', unit: 'LS', margin: 25, materials: 75.00, labor: 1500.00 },
      { description: 'Ledge Lights - Sollos Black 2W', unit: 'EA', margin: 25, materials: 75.00, labor: 30.00, equipment: 36.00 },
      { description: 'Low Voltage Cable #12 - 250ft', unit: 'Roll', margin: 22, materials: 235.00, labor: 230.00 },
      { description: '300W Transformer', unit: 'EA', margin: 22, materials: 208.00, labor: 200.00 },
    ],
    'Site Prep': [
      { description: 'Concrete Footer 2x3x1 ft', unit: 'CYD', margin: 25, materials: 200.00, labor: 100.00, equipment: 60.00 },
      { description: 'Spa Concrete Floor', unit: 'SF', margin: 25, materials: 3.00, labor: 3.00 },
      { description: 'Brick Steps (632F) 363 bricks', unit: 'LS', margin: 25, materials: 794.00, labor: 636.00 },
      { description: 'Wall CMU Blocks', unit: 'CMU', margin: 25, materials: 2.06, labor: 12.00 },
    ],
    'Delivery': [
      { description: 'Spa Delivery (Standard)', unit: 'LS', margin: 20 },
      { description: 'Spa Delivery (Crane Required)', unit: 'LS', margin: 22 },
      { description: 'Setup & Start-Up', unit: 'LS', margin: 20 },
    ],
    'Accessories': [
      { description: 'Stone Pedestals - Fire bowls and pedestals', unit: 'EA', margin: 25, materials: 60.00, labor: 150.00 },
      { description: 'Pedestals Veneer with 10% waste', unit: 'SF', margin: 25, materials: 12.00, labor: 14.00, notes: 'Eric Salas' },
      { description: 'Travertine Cap Spa', unit: 'LF', margin: 28, materials: 17.00 },
      { description: 'Fire Bowls', unit: 'EA', margin: 30, materials: 3515.43, labor: 240.00, notes: 'Eric Salas Installation' },
      { description: 'Rebar Dowels', unit: 'Bar', margin: 22, materials: 13.13, notes: 'Caleb Bowen' },
    ],
  },
  pavilion: {
    'Structure': [
      { description: 'Pavilion 16\'x18\' - Alpine Pine Wrapping 10/12 pitch', unit: 'LS', margin: 20, subcontract: 21475.00, notes: 'Caleb Bowen' },
      { description: 'Pavilion 14\'X16\' - Shiplap ceiling stained', unit: 'LS', margin: 20, subcontract: 17200.00, notes: 'Caleb Bowen' },
      { description: 'Additions to Storage Area', unit: 'LS', margin: 20, subcontract: 800.00, notes: 'Caleb Bowen' },
      { description: 'Bathroom and Storage - back framing and siding', unit: 'LS', margin: 20, subcontract: 13360.00, notes: 'Caleb Bowen' },
    ],
    'Concrete/Foundation': [
      { description: 'Concrete Footer 3\'x3\'x1ft', unit: 'CYD', margin: 20, materials: 190.00, labor: 116.67, equipment: 50.00, notes: 'To be poured with concrete' },
      { description: 'Swim up bar Counter Top - Installed (40SF)', unit: 'EA', margin: 20, subcontract: 2500.00, notes: 'GA Granite' },
      { description: 'Kitchen Counter Top (145.11SF)', unit: 'LS', margin: 20, subcontract: 7000.00, notes: 'GA Granite' },
      { description: 'Bali Pitter Floor', unit: 'SF', margin: 25, materials: 3.00, labor: 3.00 },
      { description: 'Floor Prep', unit: 'LS', margin: 25, equipment: 900.00 },
    ],
    'Flooring': [
      { description: 'Travertine Pavers', unit: 'SF', margin: 30 },
      { description: 'Porcelain Tile', unit: 'SF', margin: 28 },
      { description: 'Flagstone', unit: 'SF', margin: 30 },
      { description: 'Brick Pavers', unit: 'SF', margin: 28 },
    ],
    'Electrical & Lighting': [
      { description: 'Electrical - Pavilion (6 sconces, fans, TV, outlets)', unit: 'LS', margin: 20, subcontract: 6000.00 },
      { description: 'Sound System - Fosi Audio BT20A Amplifier', unit: 'LS', margin: 25, subcontract: 6000.00, notes: 'Amazon' },
      { description: 'Ledge Lights - Sollos Black 2W', unit: 'EA', margin: 25, materials: 70.00 },
      { description: 'Low Voltage Cable #12 - 250ft', unit: 'Roll', margin: 22, materials: 230.00, labor: 230.00 },
      { description: '300W Transformer', unit: 'EA', margin: 22, materials: 180.00, labor: 180.00 },
    ],
    'Painting & Stain': [
      { description: 'Stain Pavilion & Painting', unit: 'LS', margin: 20, materials: 250.00, notes: 'Included with Caleb Bowen' },
    ],
    'Fireplace/Masonry': [
      { description: 'Cabinets - Masonry Center Blocks 8x8x16', unit: 'Block', margin: 20, materials: 2.08, labor: 3.50, notes: 'Augusta Concrete Block' },
      { description: 'Rebar Dowels for Cabinet Walls', unit: 'Bar', margin: 22, materials: 13.11 },
      { description: 'Bagged Concrete - Center block cell filling', unit: 'EA', margin: 22, materials: 6.00 },
      { description: 'Sand Bag - Augusta Concrete Blocks', unit: 'EA', margin: 22, materials: 80.00 },
      { description: 'Mortar Type N', unit: 'EA', margin: 22, materials: 18.00 },
      { description: 'Cabinet Veneer with 10% waste', unit: 'SF', margin: 22, materials: 10.50, labor: 14.00, subcontract: 1.18, notes: 'Eric Salas' },
      { description: 'Wall Veneer Back Tail with 10% waste', unit: 'SF', margin: 22, materials: 10.50, labor: 14.00, subcontract: 1.18, notes: 'Eric Salas' },
      { description: 'Large Format Tile Mortar', unit: 'EA', margin: 22, materials: 42.00 },
      { description: 'Fire Bowls', unit: 'EA', margin: 30, materials: 3515.43, labor: 240.00, notes: 'Eric Salas Installation' },
      { description: 'Fire Brick 4.5x9 with 10% waste', unit: 'EA', margin: 25, materials: 5.00, labor: 5.00 },
      { description: 'Fireplace CMU Blocks', unit: 'SF', margin: 25, materials: 2.00, labor: 12.00 },
      { description: 'Wall Veneer', unit: 'SF', margin: 25, materials: 4.55, labor: 12.00, notes: 'Eric Salas' },
      { description: 'Fireplace Travertine Cap Pedestals', unit: 'EA', margin: 28, materials: 24.00, labor: 28.00, notes: 'Eric Salas' },
      { description: 'Fireplace Wood Mantle', unit: 'EA', margin: 25, materials: 360.00 },
      { description: 'Fireplace Chimney Cap', unit: 'EA', margin: 25, materials: 500.00, labor: 250.00, notes: 'Caleb Bowen' },
    ],
    'Accessories': [
      { description: '30" Lonestar Select Drop-In Grill NG 4 Burner 60000 BTUs', unit: 'EA', margin: 25, materials: 1131.07 },
      { description: 'Stainless Steel Ice Chest', unit: 'EA', margin: 25, materials: 419.26 },
      { description: 'Standard Refrigerator', unit: 'EA', margin: 25, materials: 33.46 },
      { description: '25" Double Doors - Stainless Steel #33570', unit: 'EA', margin: 25, materials: 263.82 },
      { description: '38" Double Doors - Stainless Steel', unit: 'EA', margin: 25, materials: 374.70 },
      { description: '30" Door/Drawer Combo w/2 Drawers', unit: 'EA', margin: 25, materials: 521.89 },
      { description: '38" Door/Drawer Combo w/2 Drawers', unit: 'EA', margin: 25, materials: 601.55 },
      { description: 'Double Trash Drawer', unit: 'EA', margin: 25, materials: 594.53 },
      { description: 'Triple Drawers 2+1 Stainless Steel', unit: 'EA', margin: 25, materials: 483.60 },
      { description: 'Kegerator with Single Tap', unit: 'EA', margin: 25, materials: 2081.20 },
      { description: 'BBQGuys Signature 18" Paper Towel/Drawer Combo', unit: 'EA', margin: 25, materials: 602.99 },
      { description: 'Pool Veneer', unit: 'SF', margin: 22, materials: 10.50, labor: 14.00 },
      { description: 'Plumbing - Kitchen Sink Hot and Cold water', unit: 'LS', margin: 20, subcontract: 3500.00 },
      { description: 'Tankless Water Heater', unit: 'LS', margin: 25, materials: 949.00, equipment: 350.00, subcontract: 2200.00 },
      { description: 'Large Kitchen Sink with Faucet (Bull #12391)', unit: 'EA', margin: 25, materials: 215.30 },
    ],
  },
  retaining_wall: {
    'Excavation': [
      { description: 'Wall Excavation', unit: 'LF', margin: 22 },
      { description: 'Spoils Removal', unit: 'CY', margin: 22 },
      { description: 'Fine Grade', unit: 'LF', margin: 22 },
    ],
    'Foundation': [
      { description: 'Compacted Base Material', unit: 'TON', margin: 22 },
      { description: 'Leveling Pad (Concrete)', unit: 'LF', margin: 25 },
      { description: 'Compacted Gravel Base', unit: 'TON', margin: 22 },
      { description: 'Geogrid Reinforcement', unit: 'SF', margin: 25 },
    ],
    'Block/Stone': [
      { description: 'CMU Block, per block', unit: 'EA', margin: 25, materials: 2.10, labor: 12.00 },
      { description: 'Segmental Retaining Wall Block', unit: 'SF', margin: 28 },
      { description: 'Natural Stone (Stackable)', unit: 'SF', margin: 30 },
      { description: 'Boulder Wall', unit: 'TON', margin: 28 },
      { description: 'Poured Concrete Wall', unit: 'SF', margin: 25 },
    ],
    'Caps & Finish': [
      { description: 'Cap Block (Standard)', unit: 'LF', margin: 28 },
      { description: 'Cap Block (Premium)', unit: 'LF', margin: 30 },
      { description: 'Natural Stone Caps', unit: 'LF', margin: 32 },
      { description: 'Sealer Application', unit: 'SF', margin: 22 },
    ],
    'Drainage': [
      { description: 'Perforated Drain Pipe (4")', unit: 'LF', margin: 22 },
      { description: 'Drainage Aggregate', unit: 'TON', margin: 22 },
      { description: 'Filter Fabric', unit: 'SF', margin: 20 },
      { description: 'Outlet/Pop-Up Emitter', unit: 'EA', margin: 22 },
    ],
    'Backfill': [
      { description: 'Drainage Stone Backfill', unit: 'TON', margin: 22 },
      { description: 'Structural Backfill', unit: 'CY', margin: 22 },
      { description: 'Topsoil (Final Grade)', unit: 'CY', margin: 22 },
      { description: 'Sod Installation', unit: 'SF', margin: 25 },
    ],
  },
  fire_pit: {
    'Foundation': [
      { description: 'Excavation & Prep', unit: 'LS', margin: 22 },
      { description: 'Compacted Base', unit: 'TON', margin: 22 },
      { description: 'Concrete Footing', unit: 'SF', margin: 25 },
      { description: 'Concrete Deck', unit: 'SF', margin: 20, materials: 4.00, labor: 3.00 },
    ],
    'Masonry': [
      { description: 'Onyx Black Brick', unit: 'EA', margin: 25, materials: 7.81, labor: 12.00 },
      { description: 'Mortar Bag', unit: 'EA', margin: 22, materials: 17.95, notes: 'Price per bag, Pool 360' },
      { description: 'CMU Block, per block', unit: 'EA', margin: 25, materials: 2.10, labor: 12.00 },
      { description: 'HP Storm Dual Wall Pipe', unit: 'LS', margin: 22, materials: 551.60 },
      { description: 'Fire Brick Lining', unit: 'SF', margin: 28 },
    ],
    'Stone/Veneer': [
      { description: 'Splitface Travertine', unit: 'EA', margin: 28, materials: 12.00, labor: 14.00 },
      { description: 'Travertine Cap 6x12 (LFT)', unit: 'EA', margin: 28, materials: 17.00, labor: 14.00 },
      { description: 'Wall Veneer', unit: 'SF', margin: 25, materials: 4.55, labor: 12.00, notes: 'Eric Salas' },
      { description: 'Fireplace Travertine Cap', unit: 'EA', margin: 28, materials: 24.00, labor: 28.00, notes: 'Eric Salas' },
      { description: 'Thinset Stain', unit: 'LS', margin: 25, materials: 225.00 },
    ],
    'Gas Line': [
      { description: 'Gas Line Run (Trenching)', unit: 'LF', margin: 25 },
      { description: 'Gas Shutoff Valve', unit: 'EA', margin: 22 },
      { description: 'Gas Connection', unit: 'LS', margin: 25 },
      { description: 'LP Tank Installation', unit: 'EA', margin: 25 },
    ],
    'Fire Features': [
      { description: 'Firepit Valencia Push Button Ignition [HPC]', unit: 'EA', margin: 25, materials: 1605.00, labor: 400.00 },
      { description: 'Valencia Fire Pit [No Sleeve] Champlain Grey', unit: 'EA', margin: 25, materials: 1333.47, labor: 400.00 },
      { description: 'Fire Bowls', unit: 'EA', margin: 30, materials: 3515.43, labor: 240.00 },
      { description: 'Fire Glass', unit: 'LB', margin: 30 },
      { description: 'Lava Rock', unit: 'LB', margin: 25 },
    ],
    'Seating': [
      { description: 'Integrated Stone Bench', unit: 'LF', margin: 28 },
      { description: 'Seat Wall (Block)', unit: 'LF', margin: 28 },
      { description: 'Concrete Seat Wall', unit: 'LF', margin: 25 },
    ],
    'Lighting': [
      { description: 'Ledge Lights - Sollos Black 2W', unit: 'EA', margin: 25, materials: 75.00, labor: 35.00 },
      { description: 'Step Lights', unit: 'EA', margin: 25 },
      { description: 'LED Strip Lighting', unit: 'LF', margin: 28 },
      { description: 'Transformer & Wiring', unit: 'LS', margin: 22 },
    ],
  },
  summary: {},
};

// Initialize proposal content
const initializeProposal = (scope: ProjectScope): ProposalContent => {
  const config = SCOPE_CONFIGS[scope];
  return {
    sectionTitle: config.defaultTitle,
    imageUrl: '',
    constructionBullets: [],
    componentsIncluded: [],
    finishes: [],
    notIncluded: [],
    upgrades: [],
    designFee: 0,
  };
};

// Initialize categories with default line items (including pricing from spreadsheets)
const initializeScope = (scope: ProjectScope): ScopeData => {
  const config = SCOPE_CONFIGS[scope];
  const defaultItems = DEFAULT_LINE_ITEMS[scope] || {};

  return {
    enabled: scope === 'pool',
    categories: config.categories.map((name) => ({
      name,
      expanded: false,
      lineItems: (defaultItems[name] || []).map((item, idx) => ({
        id: `${scope}-${name}-${idx}-${Date.now()}`,
        description: item.description,
        qty: 0,
        unit: item.unit,
        materials: item.materials || 0,
        equipment: item.equipment || 0,
        labor: item.labor || 0,
        margin: item.margin,
        subcontract: item.subcontract || 0,
        notes: item.notes || '',
      })),
    })),
    proposal: initializeProposal(scope),
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
  const [activeSubTab, setActiveSubTab] = useState<'estimate' | 'proposal'>('estimate');

  // Project Info State
  const [projectInfo, setProjectInfo] = useState<ProjectInfo>({
    jobNumber: '2024B-12-01',
    jobName: '',
    ownerName: '',
    ownerPhone: '',
    ownerEmail: '',
    streetAddress: '',
    city: 'Augusta',
    state: 'GA',
    county: 'Columbia County',
    bidDate: new Date().toISOString().split('T')[0],
    bidEndDate: '',
    estimator: 'VL',
    revision: 3,
    projectType: 'Concrete Pool',
    poolArea: 512,
    poolPerimeter: 96,
    poolDepthShallow: 1,
    poolDepthMiddle: 3.5,
    poolDepthDeep: 6,
    avgDepth: 3.50,
    poolGallons: 13493,
  });

  // Scope Data State
  const [scopeData, setScopeData] = useState<Record<ProjectScope, ScopeData>>(() => ({
    pool: initializeScope('pool'),
    portable_spa: initializeScope('portable_spa'),
    pavilion: initializeScope('pavilion'),
    retaining_wall: initializeScope('retaining_wall'),
    fire_pit: initializeScope('fire_pit'),
    summary: { enabled: true, categories: [], proposal: initializeProposal('summary') },
  }));

  // View Mode State
  const [showExportMenu, setShowExportMenu] = useState(false);

  // File input refs for image upload
  const fileInputRefs = useRef<Record<ProjectScope, HTMLInputElement | null>>({
    pool: null,
    portable_spa: null,
    pavilion: null,
    retaining_wall: null,
    fire_pit: null,
    summary: null,
  });

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

  // Update proposal content
  const updateProposal = useCallback((scope: ProjectScope, field: keyof ProposalContent, value: unknown) => {
    setScopeData((prev) => ({
      ...prev,
      [scope]: {
        ...prev[scope],
        proposal: { ...prev[scope].proposal, [field]: value },
      },
    }));
  }, []);

  // Add bullet point
  const addBullet = useCallback((scope: ProjectScope, field: 'constructionBullets' | 'componentsIncluded' | 'finishes' | 'notIncluded') => {
    setScopeData((prev) => ({
      ...prev,
      [scope]: {
        ...prev[scope],
        proposal: {
          ...prev[scope].proposal,
          [field]: [...prev[scope].proposal[field], ''],
        },
      },
    }));
  }, []);

  // Update bullet point
  const updateBullet = useCallback((scope: ProjectScope, field: 'constructionBullets' | 'componentsIncluded' | 'finishes' | 'notIncluded', index: number, value: string) => {
    setScopeData((prev) => ({
      ...prev,
      [scope]: {
        ...prev[scope],
        proposal: {
          ...prev[scope].proposal,
          [field]: prev[scope].proposal[field].map((item, i) => (i === index ? value : item)),
        },
      },
    }));
  }, []);

  // Delete bullet point
  const deleteBullet = useCallback((scope: ProjectScope, field: 'constructionBullets' | 'componentsIncluded' | 'finishes' | 'notIncluded', index: number) => {
    setScopeData((prev) => ({
      ...prev,
      [scope]: {
        ...prev[scope],
        proposal: {
          ...prev[scope].proposal,
          [field]: prev[scope].proposal[field].filter((_, i) => i !== index),
        },
      },
    }));
  }, []);

  // Add upgrade
  const addUpgrade = useCallback((scope: ProjectScope) => {
    setScopeData((prev) => ({
      ...prev,
      [scope]: {
        ...prev[scope],
        proposal: {
          ...prev[scope].proposal,
          upgrades: [...prev[scope].proposal.upgrades, { description: '', amount: 0 }],
        },
      },
    }));
  }, []);

  // Update upgrade
  const updateUpgrade = useCallback((scope: ProjectScope, index: number, field: 'description' | 'amount', value: string | number) => {
    setScopeData((prev) => ({
      ...prev,
      [scope]: {
        ...prev[scope],
        proposal: {
          ...prev[scope].proposal,
          upgrades: prev[scope].proposal.upgrades.map((u, i) =>
            i === index ? { ...u, [field]: value } : u
          ),
        },
      },
    }));
  }, []);

  // Delete upgrade
  const deleteUpgrade = useCallback((scope: ProjectScope, index: number) => {
    setScopeData((prev) => ({
      ...prev,
      [scope]: {
        ...prev[scope],
        proposal: {
          ...prev[scope].proposal,
          upgrades: prev[scope].proposal.upgrades.filter((_, i) => i !== index),
        },
      },
    }));
  }, []);

  // Handle image upload
  const handleImageUpload = useCallback((scope: ProjectScope, file: File) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      if (e.target?.result) {
        updateProposal(scope, 'imageUrl', e.target.result as string);
      }
    };
    reader.readAsDataURL(file);
  }, [updateProposal]);

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
    const designFee = data.proposal?.designFee || 0;
    const netTotal = subtotal - designFee;
    const salesTax = taxableSubtotal * 0.08;
    const contractPrice = netTotal + salesTax;
    const grossProfit = contractPrice - totalCost;
    const marginPercent = totalCost > 0 ? (grossProfit / contractPrice) * 100 : 0;

    return {
      materialsCost,
      equipmentCost,
      laborCost,
      subcontractCost,
      totalCost,
      subtotal,
      designFee,
      netTotal,
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
    let totalDesignFee = 0;

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
        taxableSubtotal += totals.subtotal - (totals.laborCost + totals.subcontractCost) * (1 + 20 / 100);
        totalLineItems += totals.lineItemCount;
        totalDesignFee += totals.designFee;
      }
    });

    const totalCost = materialsCost + equipmentCost + laborCost + subcontractCost;
    const netTotal = subtotal - totalDesignFee;
    const salesTax = taxableSubtotal * 0.08;
    const contractPrice = netTotal + salesTax;
    const grossProfit = contractPrice - totalCost;
    const marginPercent = totalCost > 0 ? (grossProfit / contractPrice) * 100 : 0;

    return {
      materialsCost,
      equipmentCost,
      laborCost,
      subcontractCost,
      totalCost,
      subtotal,
      designFee: totalDesignFee,
      netTotal,
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

  // Generate formal proposal PDF (BlueCrew format)
  const generateProposalPDF = useCallback(() => {
    const printWindow = window.open('', '_blank');
    if (!printWindow) {
      alert('Please allow popups to generate proposal');
      return;
    }

    const formatDate = (dateStr: string) => {
      if (!dateStr) return '';
      const date = new Date(dateStr);
      return date.toLocaleDateString('en-US', { month: 'numeric', day: 'numeric', year: 'numeric' });
    };

    // Get enabled scopes in order
    const enabledScopes = (Object.keys(scopeData) as ProjectScope[])
      .filter(s => s !== 'summary' && scopeData[s].enabled);

    // Generate sections HTML
    let sectionsHTML = '';
    let sectionNumber = 1;

    enabledScopes.forEach((scope) => {
      const data = scopeData[scope];
      const proposal = data.proposal;
      const totals = calculateScopeTotals(data);

      sectionsHTML += `
        <div class="page-break"></div>
        <div class="section-header">Section ${sectionNumber}: ${proposal.sectionTitle || SCOPE_CONFIGS[scope].defaultTitle}</div>

        ${proposal.imageUrl ? `<div class="section-image"><img src="${proposal.imageUrl}" alt="${proposal.sectionTitle}" /></div>` : ''}

        ${proposal.constructionBullets.length > 0 ? `
          <div class="section-content">
            <h3>CONSTRUCTION</h3>
            <ul>
              ${proposal.constructionBullets.map(b => `<li>${b}</li>`).join('')}
            </ul>
          </div>
        ` : ''}

        ${proposal.componentsIncluded.length > 0 ? `
          <div class="section-content">
            <h3>COMPONENTS INCLUDED</h3>
            <ul>
              ${proposal.componentsIncluded.map(b => `<li>${b}</li>`).join('')}
            </ul>
          </div>
        ` : ''}

        ${proposal.finishes.length > 0 ? `
          <div class="section-content">
            <h3>FINISHES</h3>
            <ul>
              ${proposal.finishes.map(b => `<li>${b}</li>`).join('')}
            </ul>
          </div>
        ` : ''}

        ${proposal.upgrades.length > 0 ? `
          <div class="upgrades-section">
            <h3>PROPOSED UPGRADES</h3>
            <p class="upgrade-note"><em>The upgrades are currently <strong style="color:red;">NOT included</strong> in the total price. However, these are optional features to the scope that can be added to the total price by the client.</em></p>
            <table class="upgrades-table">
              <thead>
                <tr>
                  <th>Upgrade Option</th>
                  <th>Description</th>
                  <th>Amount</th>
                </tr>
              </thead>
              <tbody>
                ${proposal.upgrades.map(u => `
                  <tr>
                    <td>${u.description.split(' - ')[0] || ''}</td>
                    <td>${u.description}</td>
                    <td>$ ${u.amount.toLocaleString()}</td>
                  </tr>
                `).join('')}
              </tbody>
            </table>
          </div>
        ` : ''}

        ${proposal.notIncluded.length > 0 ? `
          <div class="section-content not-included">
            <h3>NOT INCLUDED</h3>
            <ul>
              ${proposal.notIncluded.map(b => `<li>${b}</li>`).join('')}
            </ul>
          </div>
        ` : ''}

        <div class="section-footer">
          <div class="acceptance-text">
            <p><strong>By initialing below, I accept the ${proposal.sectionTitle || SCOPE_CONFIGS[scope].name} price.</strong></p>
            <p class="legal-text">THIS IS NOT A CONSTRUCTION CONTRACT. THIS FORMAL PROPOSAL PRICE IS VALID UNTIL THE 'BID END' DATE (listed at the top of this Proposal form). This price is guaranteed only for 30 days after the Proposal is submitted to the Buyer. The Construction Contract has its own Bid End Date and Shall be signed on or prior to the date provided in the Construction Contract.</p>
          </div>
          <div class="pricing-box">
            <div class="price-row"><span>Sub Total:</span><span>$ ${totals.subtotal.toLocaleString(undefined, {minimumFractionDigits: 2, maximumFractionDigits: 2})}</span></div>
            <div class="price-row"><span>Design Fee:</span><span>$ ${totals.designFee > 0 ? `(${totals.designFee.toLocaleString(undefined, {minimumFractionDigits: 2, maximumFractionDigits: 2})})` : '-'}</span></div>
            <div class="price-row"><span>Net Total:</span><span>$ ${totals.netTotal.toLocaleString(undefined, {minimumFractionDigits: 2, maximumFractionDigits: 2})}</span></div>
            <div class="price-row"><span>Sales Tax:</span><span>$ ${totals.salesTax.toLocaleString(undefined, {minimumFractionDigits: 2, maximumFractionDigits: 2})}</span></div>
            <div class="price-row total"><span>Total Price:</span><span>$ ${totals.contractPrice.toLocaleString(undefined, {minimumFractionDigits: 2, maximumFractionDigits: 2})}</span></div>
          </div>
        </div>

        <div class="signature-area">
          <div class="signature-line">
            <div class="initials-box">_______________</div>
            <p>Buyer's Initials</p>
          </div>
        </div>
      `;
      sectionNumber++;
    });

    const html = `<!DOCTYPE html>
<html>
<head>
  <title>Proposal - ${projectInfo.jobNumber}</title>
  <style>
    @page { margin: 0.5in; size: letter; }
    body { font-family: Arial, sans-serif; font-size: 10pt; line-height: 1.4; color: #333; margin: 0; padding: 20px; }

    /* Header */
    .header { display: flex; justify-content: space-between; align-items: flex-start; margin-bottom: 15px; border-bottom: 3px solid #00a651; padding-bottom: 10px; }
    .logo-section { display: flex; align-items: center; gap: 10px; }
    .logo { width: 80px; height: auto; }
    .company-info { font-size: 9pt; }
    .company-name { color: #00a651; font-weight: bold; font-size: 12pt; }
    .license-info { text-align: right; font-size: 9pt; }
    .license-info table { margin-left: auto; }
    .license-info td { padding: 1px 5px; }
    .license-info td:first-child { color: #666; }
    .license-info td:last-child { font-weight: bold; }

    /* Project Info Grid */
    .info-grid { display: grid; grid-template-columns: 1fr 1fr 1fr; gap: 15px; margin-bottom: 15px; font-size: 9pt; }
    .info-box { }
    .info-row { display: flex; margin: 2px 0; }
    .info-label { color: #00a651; font-weight: bold; min-width: 80px; }
    .info-value { }

    /* Project Banner */
    .project-banner { background: #00a651; color: white; padding: 8px 15px; display: flex; justify-content: space-between; margin-bottom: 15px; }
    .project-type { font-weight: bold; }

    /* Cover Page */
    .cover-image { width: 100%; max-height: 400px; object-fit: cover; border-radius: 8px; margin-bottom: 15px; }
    .thank-you { text-align: center; font-style: italic; font-size: 14pt; color: #00a651; margin: 30px 0; }

    /* Section Header */
    .section-header { background: linear-gradient(90deg, #00a651, #00d46a); color: white; padding: 10px 15px; font-size: 14pt; font-weight: bold; margin: 20px 0 15px 0; }

    /* Section Image */
    .section-image { margin-bottom: 15px; }
    .section-image img { width: 100%; max-height: 350px; object-fit: cover; border-radius: 4px; }

    /* Section Content */
    .section-content { margin-bottom: 15px; }
    .section-content h3 { color: #333; font-size: 11pt; margin: 10px 0 5px 0; text-decoration: underline; }
    .section-content ul { margin: 5px 0; padding-left: 20px; }
    .section-content li { margin: 3px 0; }

    /* Upgrades */
    .upgrades-section { margin: 15px 0; padding: 10px; background: #f9f9f9; border: 1px solid #ddd; }
    .upgrades-section h3 { color: #00a651; margin: 0 0 5px 0; }
    .upgrade-note { font-size: 9pt; margin: 5px 0; }
    .upgrades-table { width: 100%; border-collapse: collapse; margin-top: 10px; }
    .upgrades-table th { background: #00a651; color: white; padding: 5px; text-align: left; font-size: 9pt; }
    .upgrades-table td { padding: 5px; border-bottom: 1px solid #ddd; font-size: 9pt; }

    /* Not Included */
    .not-included { background: #fff5f5; padding: 10px; border-left: 3px solid #ff6b6b; }
    .not-included h3 { color: #333; }

    /* Section Footer */
    .section-footer { display: flex; justify-content: space-between; align-items: flex-start; margin-top: 20px; gap: 20px; }
    .acceptance-text { flex: 1; font-size: 9pt; }
    .legal-text { font-size: 8pt; color: #666; margin-top: 5px; }
    .pricing-box { min-width: 200px; border: 1px solid #ddd; }
    .price-row { display: flex; justify-content: space-between; padding: 4px 10px; font-size: 9pt; }
    .price-row span:first-child { font-weight: bold; }
    .price-row.total { background: #ffeb3b; font-weight: bold; }

    /* Signature */
    .signature-area { margin-top: 30px; display: flex; justify-content: flex-start; }
    .signature-line { text-align: center; }
    .initials-box { font-size: 14pt; margin-bottom: 5px; }
    .signature-line p { font-size: 9pt; margin: 0; }

    /* Page Break */
    .page-break { page-break-before: always; }

    /* Print styles */
    @media print {
      body { padding: 0; }
      .page-break { page-break-before: always; }
    }
  </style>
</head>
<body>
  <!-- Header (repeated on each page) -->
  <div class="header">
    <div class="logo-section">
      <div style="background: linear-gradient(135deg, #1e40af, #00a651); padding: 10px 15px; border-radius: 8px;">
        <div style="color: white; font-weight: bold; font-size: 16pt;">BLUE<span style="color: #00a651;">CREW</span> CO</div>
        <div style="color: #aaa; font-size: 7pt;">SWIMMING POOL CONSTRUCTION</div>
      </div>
      <div class="company-info">
        <div class="company-name">BlueCrew Construction, LLC</div>
        <div>1450 Greene St. Suite 221</div>
        <div>Augusta, GA 30901</div>
        <div>(762) 994-6083 • info@bluecrewco.com • www.bluecrewco.com</div>
      </div>
    </div>
    <div class="license-info">
      <table>
        <tr><td>SC GC Lic.#:</td><td>CLG.125618</td></tr>
        <tr><td>Job#:</td><td>${projectInfo.jobNumber}</td></tr>
        <tr><td>Bid Date:</td><td>${formatDate(projectInfo.bidDate)}</td></tr>
        <tr><td>Bid End:</td><td>${formatDate(projectInfo.bidEndDate)}</td></tr>
        <tr><td>Estimator:</td><td>${projectInfo.estimator}</td></tr>
        <tr><td>Rev #:</td><td style="color: red; font-weight: bold;">${projectInfo.revision}</td></tr>
      </table>
    </div>
  </div>

  <!-- Project Info -->
  <div class="info-grid">
    <div class="info-box">
      <div class="info-row"><span class="info-label">Job Name</span><span class="info-value">${projectInfo.jobName}</span></div>
      <div class="info-row"><span class="info-label">Street</span><span class="info-value">${projectInfo.streetAddress}</span></div>
      <div class="info-row"><span class="info-label">Address</span><span class="info-value">${projectInfo.city}, ${projectInfo.state}</span></div>
      <div class="info-row"><span class="info-label">Project Type</span><span class="info-value">${projectInfo.projectType}</span></div>
      <div class="info-row"><span class="info-label">Pool Area</span><span class="info-value">${projectInfo.poolArea} <small>Sq.Ft.</small></span></div>
      <div class="info-row"><span class="info-label">Pool Perimeter</span><span class="info-value">${projectInfo.poolPerimeter} <small>Lin.Ft.</small></span></div>
      <div class="info-row"><span class="info-label">Pool Depths (Ft)</span><span class="info-value">${projectInfo.poolDepthShallow} &nbsp; ${projectInfo.poolDepthMiddle} &nbsp; ${projectInfo.poolDepthDeep}</span></div>
    </div>
    <div class="info-box">
      <div class="info-row"><span class="info-label">Owner</span><span class="info-value">${projectInfo.ownerName}</span></div>
      <div class="info-row"><span class="info-label">Home #</span><span class="info-value">${projectInfo.ownerPhone}</span></div>
      <div class="info-row"><span class="info-label">Cell #</span><span class="info-value"></span></div>
      <div class="info-row"><span class="info-label">Work #</span><span class="info-value">NA</span></div>
      <div class="info-row"><span class="info-label">Email</span><span class="info-value" style="color: #1e40af;">${projectInfo.ownerEmail}</span></div>
      <div class="info-row"><span class="info-label">County</span><span class="info-value">${projectInfo.county}</span></div>
    </div>
    <div class="info-box" style="text-align: right;">
      <div style="font-weight: bold; font-size: 12pt; margin-bottom: 10px;">FORMAL PROPOSAL</div>
      <div class="info-row" style="justify-content: flex-end;"><span class="info-label">Avg. Depth:</span><span class="info-value">${projectInfo.avgDepth.toFixed(2)}</span></div>
      <div class="info-row" style="justify-content: flex-end;"><span class="info-label">Pool I.A. (Sft):</span><span class="info-value">${Math.round(projectInfo.poolArea * 1.95)}</span></div>
      <div class="info-row" style="justify-content: flex-end;"><span class="info-label">Avg. Pool Gallon</span><span class="info-value">${projectInfo.poolGallons.toLocaleString()}</span></div>
    </div>
  </div>

  <div style="font-size: 9pt; color: #666; margin-bottom: 10px;">
    PROPOSED PROJECT: <strong>IN-GROUND ${projectInfo.projectType.toUpperCase()}</strong>
  </div>

  <!-- Project Banner -->
  <div class="project-banner">
    <span class="project-type">IN-GROUND ${projectInfo.projectType.toUpperCase()} ${Math.round(Math.sqrt(projectInfo.poolArea * 2))}' x ${Math.round(Math.sqrt(projectInfo.poolArea / 2))}'</span>
    <span>AMOUNT</span>
  </div>

  <!-- Cover Images -->
  ${scopeData.pool.proposal.imageUrl ? `<img class="cover-image" src="${scopeData.pool.proposal.imageUrl}" alt="Pool Design" />` : ''}

  <div class="thank-you">"THANK YOU FOR THE OPPORTUNITY TO BID YOUR NEW OUTDOOR OASIS!"</div>

  <!-- Sections -->
  ${sectionsHTML}

  <script>window.onload = function() { window.print(); }</script>
</body>
</html>`;

    printWindow.document.write(html);
    printWindow.document.close();
    setShowExportMenu(false);
  }, [projectInfo, scopeData, calculateScopeTotals]);

  // Export to CSV
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
      lines.push(`Design Fee,$${projectTotals.designFee.toLocaleString()}`);
      lines.push(`Net Total,$${projectTotals.netTotal.toLocaleString()}`);
      lines.push(`Sales Tax (8%),$${projectTotals.salesTax.toLocaleString()}`);
      lines.push(`Contract Price,$${projectTotals.contractPrice.toLocaleString()}`);
    } else {
      lines.push(`Materials,$${projectTotals.materialsCost.toLocaleString()}`);
      lines.push(`Equipment,$${projectTotals.equipmentCost.toLocaleString()}`);
      lines.push(`Labor,$${projectTotals.laborCost.toLocaleString()}`);
      lines.push(`Subcontract,$${projectTotals.subcontractCost.toLocaleString()}`);
      lines.push(`Total Cost,$${projectTotals.totalCost.toLocaleString()}`);
      lines.push(`Subtotal,$${projectTotals.subtotal.toLocaleString()}`);
      lines.push(`Design Fee,$${projectTotals.designFee.toLocaleString()}`);
      lines.push(`Net Total,$${projectTotals.netTotal.toLocaleString()}`);
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

  // Render estimate content (categories and line items)
  const renderEstimateContent = (scope: ProjectScope) => {
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
          <div className="sub-tabs">
            <button
              className={`sub-tab ${activeSubTab === 'estimate' ? 'active' : ''}`}
              onClick={() => setActiveSubTab('estimate')}
            >
              Estimate
            </button>
            <button
              className={`sub-tab ${activeSubTab === 'proposal' ? 'active' : ''}`}
              onClick={() => setActiveSubTab('proposal')}
            >
              Proposal Content
            </button>
          </div>
        </div>

        {data.enabled && activeSubTab === 'estimate' && (
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

        {data.enabled && activeSubTab === 'proposal' && renderProposalEditor(scope)}
      </div>
    );
  };

  // Render proposal editor
  const renderProposalEditor = (scope: ProjectScope) => {
    const proposal = scopeData[scope].proposal;

    return (
      <div className="proposal-editor">
        {/* Section Title */}
        <div className="proposal-section">
          <h4>Section Title</h4>
          <input
            type="text"
            value={proposal.sectionTitle}
            onChange={(e) => updateProposal(scope, 'sectionTitle', e.target.value)}
            placeholder="e.g., Pool Package"
            className="full-width-input"
          />
        </div>

        {/* Image Upload */}
        <div className="proposal-section">
          <h4>Section Image</h4>
          <div className="image-upload-area">
            {proposal.imageUrl ? (
              <div className="image-preview">
                <img src={proposal.imageUrl} alt="Section preview" />
                <button className="remove-image-btn" onClick={() => updateProposal(scope, 'imageUrl', '')}>
                  Remove
                </button>
              </div>
            ) : (
              <div
                className="upload-placeholder"
                onClick={() => fileInputRefs.current[scope]?.click()}
              >
                <span>Click to upload image</span>
                <span className="upload-hint">Recommended: 1200x600px</span>
              </div>
            )}
            <input
              type="file"
              ref={(el) => { fileInputRefs.current[scope] = el; }}
              accept="image/*"
              style={{ display: 'none' }}
              onChange={(e) => {
                const file = e.target.files?.[0];
                if (file) handleImageUpload(scope, file);
              }}
            />
          </div>
        </div>

        {/* Design Fee */}
        <div className="proposal-section">
          <h4>Design Fee (Credit)</h4>
          <div className="design-fee-input">
            <span>$</span>
            <input
              type="number"
              value={proposal.designFee || ''}
              onChange={(e) => updateProposal(scope, 'designFee', parseFloat(e.target.value) || 0)}
              placeholder="0.00"
            />
            <span className="hint">This amount is subtracted from the subtotal</span>
          </div>
        </div>

        {/* Construction Bullets */}
        <div className="proposal-section">
          <h4>CONSTRUCTION</h4>
          <div className="bullets-list">
            {proposal.constructionBullets.map((bullet, index) => (
              <div key={index} className="bullet-item">
                <span className="bullet-marker">•</span>
                <input
                  type="text"
                  value={bullet}
                  onChange={(e) => updateBullet(scope, 'constructionBullets', index, e.target.value)}
                  placeholder="Construction detail..."
                />
                <button className="delete-btn" onClick={() => deleteBullet(scope, 'constructionBullets', index)}>✕</button>
              </div>
            ))}
            <button className="add-bullet-btn" onClick={() => addBullet(scope, 'constructionBullets')}>
              + Add Construction Item
            </button>
          </div>
        </div>

        {/* Components Included */}
        <div className="proposal-section">
          <h4>COMPONENTS INCLUDED</h4>
          <div className="bullets-list">
            {proposal.componentsIncluded.map((bullet, index) => (
              <div key={index} className="bullet-item">
                <span className="bullet-marker">•</span>
                <input
                  type="text"
                  value={bullet}
                  onChange={(e) => updateBullet(scope, 'componentsIncluded', index, e.target.value)}
                  placeholder="Component..."
                />
                <button className="delete-btn" onClick={() => deleteBullet(scope, 'componentsIncluded', index)}>✕</button>
              </div>
            ))}
            <button className="add-bullet-btn" onClick={() => addBullet(scope, 'componentsIncluded')}>
              + Add Component
            </button>
          </div>
        </div>

        {/* Finishes */}
        <div className="proposal-section">
          <h4>FINISHES</h4>
          <div className="bullets-list">
            {proposal.finishes.map((bullet, index) => (
              <div key={index} className="bullet-item">
                <span className="bullet-marker">•</span>
                <input
                  type="text"
                  value={bullet}
                  onChange={(e) => updateBullet(scope, 'finishes', index, e.target.value)}
                  placeholder="Finish detail..."
                />
                <button className="delete-btn" onClick={() => deleteBullet(scope, 'finishes', index)}>✕</button>
              </div>
            ))}
            <button className="add-bullet-btn" onClick={() => addBullet(scope, 'finishes')}>
              + Add Finish
            </button>
          </div>
        </div>

        {/* Proposed Upgrades */}
        <div className="proposal-section upgrades-section-editor">
          <h4>PROPOSED UPGRADES (Optional - Not Included in Total)</h4>
          <div className="upgrades-list">
            {proposal.upgrades.map((upgrade, index) => (
              <div key={index} className="upgrade-item">
                <input
                  type="text"
                  value={upgrade.description}
                  onChange={(e) => updateUpgrade(scope, index, 'description', e.target.value)}
                  placeholder="Upgrade description..."
                  className="upgrade-desc"
                />
                <div className="upgrade-amount">
                  <span>$</span>
                  <input
                    type="number"
                    value={upgrade.amount || ''}
                    onChange={(e) => updateUpgrade(scope, index, 'amount', parseFloat(e.target.value) || 0)}
                    placeholder="0.00"
                  />
                </div>
                <button className="delete-btn" onClick={() => deleteUpgrade(scope, index)}>✕</button>
              </div>
            ))}
            <button className="add-bullet-btn" onClick={() => addUpgrade(scope)}>
              + Add Upgrade Option
            </button>
          </div>
        </div>

        {/* NOT INCLUDED */}
        <div className="proposal-section not-included-editor">
          <h4>NOT INCLUDED</h4>
          <div className="bullets-list">
            {proposal.notIncluded.map((bullet, index) => (
              <div key={index} className="bullet-item">
                <span className="bullet-marker">•</span>
                <input
                  type="text"
                  value={bullet}
                  onChange={(e) => updateBullet(scope, 'notIncluded', index, e.target.value)}
                  placeholder="Item not included..."
                />
                <button className="delete-btn" onClick={() => deleteBullet(scope, 'notIncluded', index)}>✕</button>
              </div>
            ))}
            <button className="add-bullet-btn" onClick={() => addBullet(scope, 'notIncluded')}>
              + Add Exclusion
            </button>
          </div>
        </div>
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
                      <span>Sub Total:</span>
                      <span>${totals.subtotal.toLocaleString()}</span>
                    </div>
                    <div className="summary-row">
                      <span>Design Fee:</span>
                      <span>${totals.designFee.toLocaleString()}</span>
                    </div>
                    <div className="summary-row highlight">
                      <span>Total Price:</span>
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
              <span className="label">Design Fee</span>
              <span className="value">${projectTotals.designFee.toLocaleString()}</span>
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
          <button className="btn btn-save">Save</button>
          <div className="export-dropdown">
            <button className="btn btn-export" onClick={() => setShowExportMenu(!showExportMenu)}>
              Export
            </button>
            {showExportMenu && (
              <div className="export-menu">
                <div className="export-menu-section">
                  <div className="export-menu-title">Formal Proposal</div>
                  <button onClick={generateProposalPDF}>PDF (BlueCrew Format)</button>
                </div>
                <div className="export-menu-section">
                  <div className="export-menu-title">Internal</div>
                  <button onClick={() => exportToCSV(false)}>CSV</button>
                </div>
                <div className="export-menu-section">
                  <div className="export-menu-title">Client</div>
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
              onClick={() => { setActiveTab(scope); setActiveSubTab('estimate'); }}
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
              <div className="form-row">
                <div className="form-group">
                  <label>Job Number</label>
                  <input
                    type="text"
                    value={projectInfo.jobNumber}
                    onChange={(e) => setProjectInfo({ ...projectInfo, jobNumber: e.target.value })}
                  />
                </div>
                <div className="form-group">
                  <label>Rev #</label>
                  <input
                    type="number"
                    value={projectInfo.revision}
                    onChange={(e) => setProjectInfo({ ...projectInfo, revision: parseInt(e.target.value) || 1 })}
                  />
                </div>
              </div>
              <div className="form-group">
                <label>Job Name</label>
                <input
                  type="text"
                  placeholder="e.g., Preston's Family Pool"
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
                <label>Owner Phone</label>
                <input
                  type="text"
                  value={projectInfo.ownerPhone}
                  onChange={(e) => setProjectInfo({ ...projectInfo, ownerPhone: e.target.value })}
                />
              </div>
              <div className="form-group">
                <label>Owner Email</label>
                <input
                  type="email"
                  value={projectInfo.ownerEmail}
                  onChange={(e) => setProjectInfo({ ...projectInfo, ownerEmail: e.target.value })}
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
                <label>County</label>
                <input
                  type="text"
                  value={projectInfo.county}
                  onChange={(e) => setProjectInfo({ ...projectInfo, county: e.target.value })}
                />
              </div>
              <div className="form-row">
                <div className="form-group">
                  <label>Bid Date</label>
                  <input
                    type="date"
                    value={projectInfo.bidDate}
                    onChange={(e) => setProjectInfo({ ...projectInfo, bidDate: e.target.value })}
                  />
                </div>
                <div className="form-group">
                  <label>Bid End</label>
                  <input
                    type="date"
                    value={projectInfo.bidEndDate}
                    onChange={(e) => setProjectInfo({ ...projectInfo, bidEndDate: e.target.value })}
                  />
                </div>
              </div>
              <div className="form-group">
                <label>Estimator</label>
                <input
                  type="text"
                  value={projectInfo.estimator}
                  onChange={(e) => setProjectInfo({ ...projectInfo, estimator: e.target.value })}
                />
              </div>
            </div>
          </div>

          <div className="sidebar-card">
            <div className="sidebar-card-header">
              <span className="icon">🏊</span>
              <h3>Pool Geometry</h3>
            </div>
            <div className="sidebar-card-content">
              <div className="form-group">
                <label>Project Type</label>
                <input
                  type="text"
                  value={projectInfo.projectType}
                  onChange={(e) => setProjectInfo({ ...projectInfo, projectType: e.target.value })}
                />
              </div>
              <div className="form-row">
                <div className="form-group">
                  <label>Pool Area (SF)</label>
                  <input
                    type="number"
                    value={projectInfo.poolArea}
                    onChange={(e) => setProjectInfo({ ...projectInfo, poolArea: parseFloat(e.target.value) || 0 })}
                  />
                </div>
                <div className="form-group">
                  <label>Perimeter (LF)</label>
                  <input
                    type="number"
                    value={projectInfo.poolPerimeter}
                    onChange={(e) => setProjectInfo({ ...projectInfo, poolPerimeter: parseFloat(e.target.value) || 0 })}
                  />
                </div>
              </div>
              <div className="form-row">
                <div className="form-group">
                  <label>Shallow</label>
                  <input
                    type="number"
                    step="0.5"
                    value={projectInfo.poolDepthShallow}
                    onChange={(e) => setProjectInfo({ ...projectInfo, poolDepthShallow: parseFloat(e.target.value) || 0 })}
                  />
                </div>
                <div className="form-group">
                  <label>Middle</label>
                  <input
                    type="number"
                    step="0.5"
                    value={projectInfo.poolDepthMiddle}
                    onChange={(e) => setProjectInfo({ ...projectInfo, poolDepthMiddle: parseFloat(e.target.value) || 0 })}
                  />
                </div>
                <div className="form-group">
                  <label>Deep</label>
                  <input
                    type="number"
                    step="0.5"
                    value={projectInfo.poolDepthDeep}
                    onChange={(e) => setProjectInfo({ ...projectInfo, poolDepthDeep: parseFloat(e.target.value) || 0 })}
                  />
                </div>
              </div>
              <div className="form-row">
                <div className="form-group">
                  <label>Avg Depth</label>
                  <input
                    type="number"
                    step="0.01"
                    value={projectInfo.avgDepth}
                    onChange={(e) => setProjectInfo({ ...projectInfo, avgDepth: parseFloat(e.target.value) || 0 })}
                  />
                </div>
                <div className="form-group">
                  <label>Pool Gallons</label>
                  <input
                    type="number"
                    value={projectInfo.poolGallons}
                    onChange={(e) => setProjectInfo({ ...projectInfo, poolGallons: parseInt(e.target.value) || 0 })}
                  />
                </div>
              </div>
            </div>
          </div>
        </aside>

        {/* Center Panel - Active Tab Content */}
        <section className="center-panel">
          {renderEstimateContent(activeTab)}
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
                <span className="label">Design Fee:</span>
                <span className="value">-${currentScopeTotals.designFee.toLocaleString()}</span>
              </div>
              <div className="totals-row">
                <span className="label">Net Total:</span>
                <span className="value">${currentScopeTotals.netTotal.toLocaleString()}</span>
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
        <p>BlueCrew CostLab v0.4.0 - Multi-Scope Estimating with Proposal Generation</p>
        <p className="disclaimer">Blue Crew Construction • Augusta, GA • (762) 994-6083</p>
      </footer>
    </div>
  );
}

export default App;
