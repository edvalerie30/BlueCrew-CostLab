/**
 * BlueCrew CostLab - Parts Catalog
 * Detailed parts inventory with suppliers, part numbers, and brands
 *
 * Source: Production parts lists from Blue Crew Construction projects
 */

import type { TradeCategory } from '../types/estimate';

// ============================================================================
// PART TYPES
// ============================================================================

export interface Part {
  id: string;
  tradeId: TradeCategory;
  phase: number;
  supplier: 'SCP' | 'LOCAL';
  productNumber?: string;
  quantity: number;
  mfgPartNumber?: string;
  unitOfMeasure: 'EA' | 'LF' | 'SF' | 'TON' | 'LOAD' | 'SQF';
  brand?: string;
  keyword?: string;
  title: string;
  notes?: string;
  estimatedCost?: number;
}

// ============================================================================
// SITE PREP PARTS (Phase 0)
// ============================================================================

export const SITE_PREP_PARTS: Part[] = [
  {
    id: 'site_silt_fence',
    tradeId: 'access',
    phase: 0,
    supplier: 'LOCAL',
    quantity: 0,
    unitOfMeasure: 'EA',
    title: 'Silt Fence',
  },
  {
    id: 'site_concrete_wash_bag',
    tradeId: 'access',
    phase: 0,
    supplier: 'LOCAL',
    quantity: 1,
    unitOfMeasure: 'EA',
    title: 'Concrete Wash Bag',
  },
  {
    id: 'site_sprinkler_cap',
    tradeId: 'access',
    phase: 0,
    supplier: 'LOCAL',
    quantity: 0,
    unitOfMeasure: 'EA',
    title: 'Sprinkler System Cap Materials',
    notes: 'Roger Scope of work',
  },
];

// ============================================================================
// EXCAVATION PARTS (Phase 1)
// ============================================================================

export const EXCAVATION_PARTS: Part[] = [
  {
    id: 'exc_gravel_57',
    tradeId: 'excavation',
    phase: 1,
    supplier: 'LOCAL',
    quantity: 10,
    unitOfMeasure: 'TON',
    title: 'Gravel #57',
  },
];

// ============================================================================
// FORM/REBAR PARTS (Phase 1)
// ============================================================================

export const FORM_REBAR_PARTS: Part[] = [
  {
    id: 'rebar_2x3_4_reducer',
    tradeId: 'inground_pool',
    phase: 1,
    supplier: 'SCP',
    productNumber: 'LAS-56-4239',
    quantity: 6,
    mfgPartNumber: '437248BC',
    unitOfMeasure: 'EA',
    brand: 'Westlake Pipe & Fittings',
    keyword: '2", 3/4" Reducer',
    title: '2" x 3/4" SCH 40 PVC Spigot x Slip Reducer Bushing',
  },
  {
    id: 'rebar_2_cap',
    tradeId: 'inground_pool',
    phase: 1,
    supplier: 'SCP',
    productNumber: 'LAS-56-4194',
    quantity: 4,
    mfgPartNumber: '447028C',
    unitOfMeasure: 'EA',
    brand: 'Westlake Pipe & Fittings',
    keyword: '2" CAP',
    title: '2" Slip SCH 40 PVC Cap',
  },
  {
    id: 'rebar_2_fpt',
    tradeId: 'inground_pool',
    phase: 1,
    supplier: 'SCP',
    productNumber: 'LAS-56-4085',
    quantity: 4,
    mfgPartNumber: '435020',
    unitOfMeasure: 'EA',
    brand: 'Westlake Pipe & Fittings',
    keyword: '2" FPT',
    title: '2" x 2" Slip x FPT SCH 40 PVC Female Adapter',
  },
  {
    id: 'rebar_venturi_tee',
    tradeId: 'inground_pool',
    phase: 1,
    supplier: 'SCP',
    productNumber: 'SPG-85-0023',
    quantity: 0,
    mfgPartNumber: '23308-100-000',
    unitOfMeasure: 'EA',
    keyword: 'Venturi Tee',
    title: 'Venturi Tee. 1-1/2" Spigot x 1-1/2" Spigot x 3/4" Spigot Extended Venturi Tee Gunite',
  },
  {
    id: 'rebar_500_copper_wire',
    tradeId: 'inground_pool',
    phase: 1,
    supplier: 'SCP',
    productNumber: 'GEP-57-6084',
    quantity: 0,
    mfgPartNumber: '10632802',
    unitOfMeasure: 'EA',
    brand: 'Regency Wire',
    title: '500\' #8 Roll Bare Solid Copper Wire',
    notes: 'Have one in storage 308',
  },
  {
    id: 'rebar_concrete_bricks',
    tradeId: 'inground_pool',
    phase: 1,
    supplier: 'LOCAL',
    quantity: 40,
    unitOfMeasure: 'EA',
    title: 'Concrete Bricks',
  },
  {
    id: 'rebar_2x4x16_spruce',
    tradeId: 'inground_pool',
    phase: 1,
    supplier: 'LOCAL',
    quantity: 15,
    unitOfMeasure: 'EA',
    title: '2" x 4" x16\' Spruce',
  },
  {
    id: 'rebar_1x6x16',
    tradeId: 'inground_pool',
    phase: 1,
    supplier: 'LOCAL',
    quantity: 10,
    unitOfMeasure: 'EA',
    title: '1" x 6" x16\'',
  },
  {
    id: 'rebar_wood_panels',
    tradeId: 'inground_pool',
    phase: 1,
    supplier: 'LOCAL',
    quantity: 0,
    unitOfMeasure: 'EA',
    title: 'Wood Panels 4\' x 8\'',
  },
  {
    id: 'rebar_wood_brackets',
    tradeId: 'inground_pool',
    phase: 1,
    supplier: 'LOCAL',
    quantity: 0,
    unitOfMeasure: 'EA',
    title: 'Wood Brackets',
  },
  {
    id: 'rebar_colorvision_niche',
    tradeId: 'inground_pool',
    phase: 1,
    supplier: 'SCP',
    productNumber: 'AMP-30-7025',
    quantity: 1,
    mfgPartNumber: '580037',
    unitOfMeasure: 'EA',
    brand: 'Pentair',
    title: 'ColorVision Gunite Niche Kit',
  },
  {
    id: 'rebar_umbrella_stand',
    tradeId: 'inground_pool',
    phase: 1,
    supplier: 'SCP',
    productNumber: 'API-25-1230',
    quantity: 2,
    mfgPartNumber: 'US101',
    unitOfMeasure: 'EA',
    brand: 'AquaStar Pool Products',
    keyword: '7 1/2" White Umbrella Stand with Sleeve and Center Cap',
    title: '7 1/2" White Umbrella Stand with Sleeve and Center Cap',
  },
  {
    id: 'rebar_mpt_collector',
    tradeId: 'inground_pool',
    phase: 1,
    supplier: 'SCP',
    productNumber: 'HAY-25-1516',
    quantity: 1,
    mfgPartNumber: 'SP1055PAK2',
    unitOfMeasure: 'EA',
    brand: 'Hayward',
    title: '1.5"/2" MPT Slotted Collector Tube',
  },
  {
    id: 'rebar_skimmer_slip_port',
    tradeId: 'inground_pool',
    phase: 1,
    supplier: 'SCP',
    productNumber: 'PAC-25-1629',
    quantity: 2,
    mfgPartNumber: '506300',
    unitOfMeasure: 'EA',
    brand: 'Pentair',
    title: '2" Bermuda™ Skimmer Slip Port PVC White',
  },
  {
    id: 'rebar_pressure_gauge_bubbler',
    tradeId: 'inground_pool',
    phase: 1,
    supplier: 'LOCAL',
    quantity: 1,
    unitOfMeasure: 'EA',
    title: 'Pressure Gauge for bubbler',
  },
  {
    id: 'rebar_pressure_gauge_main',
    tradeId: 'inground_pool',
    phase: 1,
    supplier: 'LOCAL',
    quantity: 1,
    unitOfMeasure: 'EA',
    title: 'Pressure Gauge for Main Drain',
  },
  {
    id: 'rebar_pressure_gauge_spa_main',
    tradeId: 'inground_pool',
    phase: 1,
    supplier: 'LOCAL',
    quantity: 0,
    unitOfMeasure: 'EA',
    title: 'Pressure Gauge for Spa Main Drain',
  },
  {
    id: 'rebar_pressure_gauge_blower',
    tradeId: 'inground_pool',
    phase: 1,
    supplier: 'LOCAL',
    quantity: 0,
    unitOfMeasure: 'EA',
    title: 'Pressure Gauge for Blower line',
  },
  {
    id: 'rebar_5x20_grade40',
    tradeId: 'inground_pool',
    phase: 1,
    supplier: 'LOCAL',
    productNumber: 'AAA-37-538',
    quantity: 220,
    unitOfMeasure: 'EA',
    keyword: 'REBAR 1/2',
    title: '.5" x 20\' Grade 40 #4 Rebar',
  },
  {
    id: 'rebar_bt6',
    tradeId: 'inground_pool',
    phase: 1,
    supplier: 'LOCAL',
    productNumber: 'SOW-37-118',
    quantity: 1,
    unitOfMeasure: 'EA',
    brand: 'Southwestern Suppliers',
    keyword: 'BT6',
    title: '8" loop ties (5000)',
  },
  {
    id: 'rebar_gs',
    tradeId: 'inground_pool',
    phase: 1,
    supplier: 'LOCAL',
    productNumber: 'THC-57-6278',
    quantity: 6,
    unitOfMeasure: 'EA',
    keyword: 'GS',
    title: '5/8" Bronze Ground Rod Clamp',
  },
  {
    id: 'rebar_reducer_bushing',
    tradeId: 'inground_pool',
    phase: 1,
    supplier: 'SCP',
    productNumber: 'LAS-56-4095',
    quantity: 0,
    mfgPartNumber: '437211BC',
    unitOfMeasure: 'EA',
    brand: 'Westlake Pipe & Fittings',
    keyword: '1-1/2" - 1" reducer',
    title: '1-1/2" - 1" SCH 40 Reducer Bushing',
  },
  {
    id: 'rebar_45deg_elbow',
    tradeId: 'inground_pool',
    phase: 1,
    supplier: 'SCP',
    productNumber: 'LAS-56-4072',
    quantity: 25,
    mfgPartNumber: '417015BC',
    unitOfMeasure: 'EA',
    brand: 'Westlake Pipe & Fittings',
    keyword: '1-1/2" 45 deg',
    title: '1-1/2" x 1-1/2" Slip x Slip SCH 40 PVC 45 Degree Elbow',
  },
  {
    id: 'rebar_90deg_elbow',
    tradeId: 'inground_pool',
    phase: 1,
    supplier: 'SCP',
    productNumber: 'LAS-56-4062',
    quantity: 25,
    mfgPartNumber: '406015BC',
    unitOfMeasure: 'EA',
    brand: 'Westlake Pipe & Fittings',
    keyword: '1-1/2" 90 deg',
    title: '1-1/2" x 1-1/2" Slip x Slip SCH 40 PVC 90 Degree Elbow',
  },
  {
    id: 'rebar_coupling_1_5',
    tradeId: 'inground_pool',
    phase: 1,
    supplier: 'SCP',
    productNumber: 'LAS-56-4079',
    quantity: 25,
    mfgPartNumber: '429015BC',
    unitOfMeasure: 'EA',
    brand: 'Westlake Pipe & Fittings',
    keyword: '1-1/2" Coupling',
    title: '1-1/2" Slip x Slip SCH 40 PVC Coupling',
  },
  {
    id: 'rebar_bell_end_pipe',
    tradeId: 'inground_pool',
    phase: 1,
    supplier: 'SCP',
    productNumber: 'AAA-56-4165',
    quantity: 5,
    mfgPartNumber: '1-1/2X20 BELL END',
    unitOfMeasure: 'EA',
    title: '1-1/2" x 20\' SCH 40 Bell End PVC Pipe',
  },
  {
    id: 'rebar_2_90deg',
    tradeId: 'inground_pool',
    phase: 1,
    supplier: 'SCP',
    productNumber: 'LAS-56-4063',
    quantity: 50,
    mfgPartNumber: '406020BC',
    unitOfMeasure: 'EA',
    brand: 'Westlake Pipe & Fittings',
    keyword: '2" 90 deg',
    title: '2" x 2" Slip x Slip SCH 40 PVC 90 Degree Elbow',
  },
  {
    id: 'rebar_2_coupling',
    tradeId: 'inground_pool',
    phase: 1,
    supplier: 'SCP',
    productNumber: 'LAS-56-4080',
    quantity: 25,
    mfgPartNumber: '429020BC',
    unitOfMeasure: 'EA',
    brand: 'Westlake Pipe & Fittings',
    keyword: '2" Coupling',
    title: '2" Slip x Slip SCH 40 PVC Coupling',
  },
  {
    id: 'rebar_2_20ft_pipe',
    tradeId: 'inground_pool',
    phase: 1,
    supplier: 'SCP',
    productNumber: 'LAS-56-4166',
    quantity: 20,
    mfgPartNumber: '47645',
    unitOfMeasure: 'EA',
    brand: 'Westlake Pipe & Fittings',
    keyword: '2"Pipe',
    title: '2" x 20\' SCH 40 Bell End PVC Pipe',
  },
  {
    id: 'rebar_tee_2x2x2',
    tradeId: 'inground_pool',
    phase: 1,
    supplier: 'SCP',
    productNumber: 'LAS-56-4056',
    quantity: 25,
    mfgPartNumber: '401020BC',
    unitOfMeasure: 'EA',
    brand: 'Westlake Pipe & Fittings',
    keyword: '2" Tee',
    title: '2" x 2" x 2" Slip x Slip x Slip SCH 40 PVC Tee',
  },
  {
    id: 'rebar_pvc_glue',
    tradeId: 'inground_pool',
    phase: 1,
    supplier: 'LOCAL',
    quantity: 3,
    unitOfMeasure: 'EA',
    title: 'PVC Glue',
    notes: 'Home Depot',
  },
  {
    id: 'rebar_pvc_primer',
    tradeId: 'inground_pool',
    phase: 1,
    supplier: 'LOCAL',
    quantity: 3,
    unitOfMeasure: 'EA',
    title: 'PVC Primer',
    notes: 'Home Depot',
  },
];

// ============================================================================
// PLUMBING PARTS (Phase 1)
// ============================================================================

export const PLUMBING_PARTS: Part[] = [
  {
    id: 'plumb_1_pipe',
    tradeId: 'plumbing',
    phase: 1,
    supplier: 'SCP',
    productNumber: 'AAA-56-4169',
    quantity: 0,
    mfgPartNumber: '3X20 BELL END',
    unitOfMeasure: 'EA',
    keyword: '1" Pipe',
    title: '1" x 20\' SCH 40 Bell End PVC Pipe',
  },
  {
    id: 'plumb_1_tee',
    tradeId: 'plumbing',
    phase: 1,
    supplier: 'SCP',
    productNumber: 'LAS-56-4054',
    quantity: 0,
    mfgPartNumber: '401010BC',
    unitOfMeasure: 'EA',
    brand: 'Westlake Pipe & Fittings',
    keyword: '1" Tee',
    title: '1" x 1" x 1" Slip x Slip x Slip SCH 40 PVC Tee',
  },
  {
    id: 'plumb_1_1_2_cap',
    tradeId: 'plumbing',
    phase: 1,
    supplier: 'SCP',
    productNumber: 'LAS-56-4103',
    quantity: 0,
    mfgPartNumber: '447015BC',
    unitOfMeasure: 'EA',
    brand: 'Westlake Pipe & Fittings',
    keyword: '1-1/2" Cap',
    title: '1-1/2" Slip SCH 40 PVC Cap',
  },
  {
    id: 'plumb_2_45deg_elbow',
    tradeId: 'plumbing',
    phase: 1,
    supplier: 'SCP',
    productNumber: 'LAS-56-4073',
    quantity: 25,
    mfgPartNumber: '417020BC',
    unitOfMeasure: 'EA',
    brand: 'Westlake Pipe & Fittings',
    keyword: '2" 45 deg',
    title: '2" x 2" Slip x Slip SCH 40 PVC 45 Degree Elbow',
  },
  {
    id: 'plumb_reducer_bushing_2x1_1_2',
    tradeId: 'plumbing',
    phase: 1,
    supplier: 'SCP',
    productNumber: 'LAS-56-4096',
    quantity: 25,
    mfgPartNumber: '437251BC',
    unitOfMeasure: 'EA',
    brand: 'Westlake Pipe & Fittings',
    keyword: '2" - 1-1/2" Reducer',
    title: '2" x 1-1/2" SCH 40 PVC Spigot x Slip Reducer Bushing',
  },
  {
    id: 'plumb_laminar_100ft',
    tradeId: 'plumbing',
    phase: 1,
    supplier: 'SCP',
    productNumber: 'PAC-27-0003',
    quantity: 0,
    mfgPartNumber: '5800013',
    unitOfMeasure: 'EA',
    brand: 'Pentair',
    title: 'MagicStream* Laminar LED Gray Lid with 100 ft cord',
    notes: 'N/A',
  },
  {
    id: 'plumb_18_elec_conduits',
    tradeId: 'plumbing',
    phase: 1,
    supplier: 'SCP',
    productNumber: 'AAA-57-3966',
    quantity: 38,
    mfgPartNumber: 'AAA-3966',
    unitOfMeasure: 'EA',
    title: '18" Electrical Conduits',
  },
  {
    id: 'plumb_conduit_elbow',
    tradeId: 'plumbing',
    phase: 1,
    supplier: 'SCP',
    productNumber: 'GEP-57-6263',
    quantity: 12,
    mfgPartNumber: 'E021100',
    unitOfMeasure: 'EA',
    brand: 'Westlake Pipe & Fittings',
    keyword: '1" 90 deg bell end',
    title: 'Electrical conduit elbow',
  },
  {
    id: 'plumb_white_deck_drain',
    tradeId: 'plumbing',
    phase: 1,
    supplier: 'SCP',
    productNumber: 'SPG-25-0070',
    quantity: 1,
    mfgPartNumber: '25533-000-000',
    unitOfMeasure: 'EA',
    brand: 'Super-Pro',
    title: '2" FPT x 2" S White Deck Drain',
  },
];

// ============================================================================
// TILE/COPING PARTS (Phase 2)
// ============================================================================

export const TILE_COPING_PARTS: Part[] = [
  {
    id: 'tile_ivory_bullnose',
    tradeId: 'coping_tile',
    phase: 2,
    supplier: 'SCP',
    productNumber: 'TMR-37-1021',
    quantity: 72,
    mfgPartNumber: '22',
    unitOfMeasure: 'EA',
    title: '12" x 24" 3cm Premium ivory light Tumbled Bullnose Coping',
    notes: '144 LFT',
  },
  {
    id: 'tile_blended_brick',
    tradeId: 'coping_tile',
    phase: 2,
    supplier: 'SCP',
    productNumber: 'CEK-37-9239',
    quantity: 106,
    mfgPartNumber: 'MASBSM1',
    unitOfMeasure: 'SQF',
    brand: 'NPT',
    title: '1" x 2" Blended Brick Mix Tile Blue Mix',
  },
  {
    id: 'tile_thinset',
    tradeId: 'coping_tile',
    phase: 2,
    supplier: 'LOCAL',
    quantity: 3,
    unitOfMeasure: 'EA',
    title: 'Thinset',
  },
  {
    id: 'tile_grout',
    tradeId: 'coping_tile',
    phase: 2,
    supplier: 'LOCAL',
    quantity: 2,
    unitOfMeasure: 'EA',
    title: 'grout',
  },
  {
    id: 'tile_mortar_mix_ivory',
    tradeId: 'coping_tile',
    phase: 2,
    supplier: 'LOCAL',
    quantity: 8,
    unitOfMeasure: 'EA',
    title: 'Mortar Mix Type N (Ivory Buff)',
  },
  {
    id: 'tile_masonry_sand_50',
    tradeId: 'coping_tile',
    phase: 2,
    supplier: 'LOCAL',
    quantity: 1,
    unitOfMeasure: 'EA',
    title: 'Masonry Sand Bag 50#',
  },
];

// ============================================================================
// CONCRETE DECK/GRADING PARTS (Phase 3)
// ============================================================================

export const CONCRETE_DECK_PARTS: Part[] = [
  {
    id: 'deck_4_drain_wye',
    tradeId: 'concrete_decking',
    phase: 3,
    supplier: 'LOCAL',
    quantity: 2,
    unitOfMeasure: 'EA',
    keyword: '4" Wye',
    title: '4" Drain Wye',
  },
  {
    id: 'deck_4_90deg',
    tradeId: 'concrete_decking',
    phase: 3,
    supplier: 'LOCAL',
    quantity: 4,
    unitOfMeasure: 'EA',
    keyword: '4" 90 deg',
    title: '4" drain elbows',
  },
  {
    id: 'deck_4_drain_pipe',
    tradeId: 'concrete_decking',
    phase: 3,
    supplier: 'LOCAL',
    quantity: 2,
    unitOfMeasure: 'EA',
    keyword: '4" Drain Pipe',
    title: '4" Drain Pipe',
  },
  {
    id: 'deck_corrugated_drain',
    tradeId: 'concrete_decking',
    phase: 3,
    supplier: 'LOCAL',
    quantity: 1,
    unitOfMeasure: 'EA',
    keyword: 'Corrugated',
    title: '100\' Corrugated drain pipe',
  },
  {
    id: 'deck_gutter_downspout',
    tradeId: 'concrete_decking',
    phase: 3,
    supplier: 'LOCAL',
    quantity: 2,
    unitOfMeasure: 'EA',
    keyword: 'Gutter',
    title: 'Gutter downspout adapter',
  },
  {
    id: 'deck_concrete_wash_bag',
    tradeId: 'concrete_decking',
    phase: 3,
    supplier: 'LOCAL',
    quantity: 1,
    unitOfMeasure: 'EA',
    title: 'Concrete Wash Bag',
  },
  {
    id: 'deck_4_trench_drain',
    tradeId: 'concrete_decking',
    phase: 3,
    supplier: 'LOCAL',
    quantity: 3,
    unitOfMeasure: 'EA',
    title: '4" Trench drain 10ft ea',
  },
  {
    id: 'deck_umbrella_stand_sleeve',
    tradeId: 'concrete_decking',
    phase: 3,
    supplier: 'SCP',
    productNumber: 'API-25-1232',
    quantity: 1,
    mfgPartNumber: 'US103',
    unitOfMeasure: 'EA',
    brand: 'AquaStar Pool Products',
    title: '7 1/2" Light Gray Umbrella Stand with Sleeve and Center Cap',
  },
  {
    id: 'deck_masonry_sand_50',
    tradeId: 'concrete_decking',
    phase: 3,
    supplier: 'LOCAL',
    quantity: 1,
    unitOfMeasure: 'EA',
    title: 'Masonry Sand Bag 50#',
  },
  {
    id: 'deck_sand_clay_16cyd',
    tradeId: 'concrete_decking',
    phase: 3,
    supplier: 'LOCAL',
    quantity: 1,
    unitOfMeasure: 'LOAD',
    title: 'Sand Clay (16CYD)',
  },
];

// ============================================================================
// PANTER/RETAINING WALL PARTS (Phase 3)
// ============================================================================

export const PANTER_WALL_PARTS: Part[] = [
  {
    id: 'wall_cmu_blocks',
    tradeId: 'masonry',
    phase: 3,
    supplier: 'LOCAL',
    quantity: 190,
    unitOfMeasure: 'EA',
    title: '8"x 8"x 16" CMU Blocks',
  },
  {
    id: 'wall_mortar_mix',
    tradeId: 'masonry',
    phase: 3,
    supplier: 'LOCAL',
    quantity: 11,
    unitOfMeasure: 'EA',
    title: 'Mortar Mix',
    notes: 'Color to be requested by the client',
  },
  {
    id: 'wall_masonry_sand',
    tradeId: 'masonry',
    phase: 3,
    supplier: 'LOCAL',
    quantity: 1,
    unitOfMeasure: 'EA',
    title: 'Masonry Sand Bag 50#',
  },
  {
    id: 'wall_bricks_scarlet_oak',
    tradeId: 'masonry',
    phase: 3,
    supplier: 'LOCAL',
    quantity: 828,
    unitOfMeasure: 'EA',
    title: 'Bricks: Meridian brick, Scarlet Oak Blend',
    notes: '26 SF',
  },
];

// ============================================================================
// ELECTRICAL & FENCING PARTS (Phase 4)
// ============================================================================

export const ELECTRICAL_FENCING_PARTS: Part[] = [
  {
    id: 'elec_aluminum_fence',
    tradeId: 'access',
    phase: 4,
    supplier: 'SCP',
    quantity: 0,
    unitOfMeasure: 'EA',
    title: 'Aluminum Fence',
  },
  {
    id: 'elec_back_door_alarm',
    tradeId: 'access',
    phase: 4,
    supplier: 'LOCAL',
    quantity: 0,
    unitOfMeasure: 'EA',
    title: 'Back Door Alarm',
  },
  {
    id: 'elec_1_5_body_return',
    tradeId: 'electrical',
    phase: 4,
    supplier: 'SCP',
    productNumber: 'PAC-25-1650',
    quantity: 6,
    mfgPartNumber: '542405',
    unitOfMeasure: 'EA',
    brand: 'Pentair',
    title: '1.5" Threaded x 1.5" Socket Standard Body Return Fitting for Concrete White',
  },
  {
    id: 'elec_transformer_12_14v',
    tradeId: 'electrical',
    phase: 5,
    supplier: 'SCP',
    productNumber: 'AMP-30-7013',
    quantity: 3,
    mfgPartNumber: '619963',
    unitOfMeasure: 'EA',
    brand: 'Pentair',
    title: 'Transformer 12-14V 300W',
  },
  {
    id: 'elec_intellicenter_scg',
    tradeId: 'electrical',
    phase: 5,
    supplier: 'SCP',
    productNumber: 'COM-30-0968',
    quantity: 6,
    mfgPartNumber: '521903',
    unitOfMeasure: 'EA',
    brand: 'Pentair',
    title: 'IntelliCenter* Load Center System with i8PS, Personality Kit & IntelliChlor* SCG',
  },
  {
    id: 'elec_intellivalve_actuator',
    tradeId: 'electrical',
    phase: 5,
    supplier: 'SCP',
    productNumber: 'COM-30-6338',
    quantity: 0,
    mfgPartNumber: '521485',
    unitOfMeasure: 'EA',
    brand: 'Pentair',
    title: 'IntelliValve™ Valve Actuator for Any Automation System',
  },
  {
    id: 'elec_5hole_junction',
    tradeId: 'electrical',
    phase: 5,
    supplier: 'SCP',
    productNumber: 'GEP-57-6036',
    quantity: 3,
    mfgPartNumber: 'JBP57510',
    unitOfMeasure: 'EA',
    brand: 'CMI',
    title: '15" x 15" x 10" Black Plastic 5-Hole Swimming Pool Junction Box',
  },
  {
    id: 'elec_cartridge_filter_420',
    tradeId: 'equipment_controls',
    phase: 5,
    supplier: 'SCP',
    productNumber: 'PAC-05-506',
    quantity: 1,
    mfgPartNumber: '160301',
    unitOfMeasure: 'EA',
    brand: 'Pentair',
    title: '420 SqFt Clean and Clear Plus Cartridge Filter',
  },
  {
    id: 'elec_automation_cable_kit',
    tradeId: 'equipment_controls',
    phase: 5,
    supplier: 'SCP',
    productNumber: 'PAC-101-0140',
    quantity: 1,
    mfgPartNumber: '350242',
    unitOfMeasure: 'EA',
    brand: 'Pentair',
    title: '25 Automation Cable Wiring Kit',
  },
  {
    id: 'elec_3port_diverter',
    tradeId: 'equipment_controls',
    phase: 5,
    supplier: 'SCP',
    productNumber: 'PAC-56-4102',
    quantity: 1,
    mfgPartNumber: '263028',
    unitOfMeasure: 'EA',
    brand: 'Pentair',
    title: '2" 3-Port PVC Diverter Valve',
  },
  {
    id: 'elec_2port_diverter',
    tradeId: 'equipment_controls',
    phase: 5,
    supplier: 'SCP',
    productNumber: 'PAC-56-4103',
    quantity: 5,
    mfgPartNumber: '263029',
    unitOfMeasure: 'EA',
    brand: 'Pentair',
    title: '2" 2-Port PVC Diverter Valve',
  },
  {
    id: 'elec_cpvc_check_valve',
    tradeId: 'equipment_controls',
    phase: 5,
    supplier: 'SCP',
    productNumber: 'PAC-56-4107',
    quantity: 0,
    mfgPartNumber: '263042',
    unitOfMeasure: 'EA',
    brand: 'Pentair',
    title: '2" Straight CPVC Check Valve',
  },
  {
    id: 'elec_1_5_diverter',
    tradeId: 'equipment_controls',
    phase: 5,
    supplier: 'SCP',
    productNumber: 'PAC-56-4125',
    quantity: 0,
    mfgPartNumber: '263038',
    unitOfMeasure: 'EA',
    brand: 'Pentair',
    title: '1.5" 2 Port PVC Diverter Valve',
  },
  {
    id: 'elec_npt_bonding',
    tradeId: 'equipment_controls',
    phase: 5,
    supplier: 'SCP',
    productNumber: 'PER-57-1090',
    quantity: 0,
    mfgPartNumber: 'PB-2008',
    unitOfMeasure: 'EA',
    brand: 'Perma-Cast',
    title: '1" NPT Watse Bonding Fitting',
  },
  {
    id: 'elec_whisperflo_vst',
    tradeId: 'equipment_controls',
    phase: 5,
    supplier: 'SCP',
    productNumber: 'PUR-10-414',
    quantity: 1,
    mfgPartNumber: '11533',
    unitOfMeasure: 'EA',
    brand: 'Pentair',
    title: 'WhisperFlo* VST Variable Speed Pump 115/208-230V',
  },
  {
    id: 'elec_gfci_2pole_20a',
    tradeId: 'equipment_controls',
    phase: 5,
    supplier: 'SCP',
    productNumber: 'PUR-101-0220',
    quantity: 1,
    mfgPartNumber: 'PA220GF',
    unitOfMeasure: 'EA',
    brand: 'Pentair',
    title: 'GFCI Circuit Breaker 2 pole-20A',
  },
  {
    id: 'elec_gfci_1pole_15a',
    tradeId: 'equipment_controls',
    phase: 5,
    supplier: 'LOCAL',
    quantity: 1,
    unitOfMeasure: 'EA',
    title: 'GFCI Circuit Breaker 1 pole-15A',
  },
  {
    id: 'elec_white_ball_valve_1',
    tradeId: 'equipment_controls',
    phase: 5,
    supplier: 'SCP',
    productNumber: 'SPG-56-6004',
    quantity: 0,
    mfgPartNumber: '25800-110-000',
    unitOfMeasure: 'EA',
    brand: 'Super-Pro',
    title: '1" S White PVC Ball Valve',
  },
  {
    id: 'elec_white_ball_valve_3_4',
    tradeId: 'equipment_controls',
    phase: 5,
    supplier: 'SCP',
    productNumber: 'SPG-56-6003',
    quantity: 0,
    mfgPartNumber: '25800-750-000',
    unitOfMeasure: 'EA',
    brand: 'Super-Pro',
    title: '3/4" S White PVC Ball Valve',
  },
  {
    id: 'elec_microbrite_100cord',
    tradeId: 'electrical',
    phase: 5,
    supplier: 'SCP',
    productNumber: 'AMP-30-1310',
    quantity: 5,
    mfgPartNumber: '620425',
    unitOfMeasure: 'EA',
    brand: 'Pentair',
    title: 'Microbrite* Color LED Light with 100\' Cord 12V 14W',
  },
];

// ============================================================================
// PLASTER PARTS (Phase 5)
// ============================================================================

export const PLASTER_PARTS: Part[] = [
  {
    id: 'plaster_globrite_color',
    tradeId: 'pool_interiors',
    phase: 5,
    supplier: 'SCP',
    productNumber: 'AMP-30-7002',
    quantity: 6,
    mfgPartNumber: '602055',
    unitOfMeasure: 'EA',
    brand: 'Pentair',
    title: 'GloBrite* Color Changing LED Light 12V 15W 100\' Cord',
  },
  {
    id: 'plaster_main_drain_frame',
    tradeId: 'pool_interiors',
    phase: 5,
    supplier: 'SCP',
    productNumber: 'SPG-25-8000',
    quantity: 2,
    mfgPartNumber: 'SG6402310 VC',
    unitOfMeasure: 'EA',
    brand: 'Super-Pro',
    title: '8" Round White Anti-Vortex Main Drain Frame & Grate',
  },
  {
    id: 'plaster_flow_outlet',
    tradeId: 'pool_interiors',
    phase: 5,
    supplier: 'SCP',
    productNumber: 'SPG-251-1026',
    quantity: 8,
    mfgPartNumber: '25554-300-000',
    unitOfMeasure: 'EA',
    brand: 'Super-Pro',
    title: '3.5" White Insider Directional Flow Outlet with 0.75" Eye Opening',
  },
  {
    id: 'plaster_suction_hydrostat',
    tradeId: 'pool_interiors',
    phase: 5,
    supplier: 'SCP',
    productNumber: 'SPG-56-0080',
    quantity: 2,
    mfgPartNumber: '25620-000-000',
    unitOfMeasure: 'EA',
    brand: 'Super-Pro',
    title: '1.5" White Hi-Flo Suction Fitting with Hydrostat Relief Valve',
  },
];

// ============================================================================
// CONSOLIDATE ALL PARTS
// ============================================================================

export const ALL_PARTS: Part[] = [
  ...SITE_PREP_PARTS,
  ...EXCAVATION_PARTS,
  ...FORM_REBAR_PARTS,
  ...PLUMBING_PARTS,
  ...TILE_COPING_PARTS,
  ...CONCRETE_DECK_PARTS,
  ...PANTER_WALL_PARTS,
  ...ELECTRICAL_FENCING_PARTS,
  ...PLASTER_PARTS,
];

// ============================================================================
// LOOKUP FUNCTIONS
// ============================================================================

export function getPartsByPhase(phase: number): Part[] {
  return ALL_PARTS.filter((part) => part.phase === phase);
}

export function getPartsByTrade(tradeId: TradeCategory): Part[] {
  return ALL_PARTS.filter((part) => part.tradeId === tradeId);
}

export function getPartsBySupplier(supplier: 'SCP' | 'LOCAL'): Part[] {
  return ALL_PARTS.filter((part) => part.supplier === supplier);
}

export function getPartByProductNumber(productNumber: string): Part | undefined {
  return ALL_PARTS.find((part) => part.productNumber === productNumber);
}

export function getPartsByBrand(brand: string): Part[] {
  return ALL_PARTS.filter((part) => part.brand?.toLowerCase() === brand.toLowerCase());
}

export function searchParts(query: string): Part[] {
  const lowerQuery = query.toLowerCase();
  return ALL_PARTS.filter(
    (part) =>
      part.title.toLowerCase().includes(lowerQuery) ||
      part.productNumber?.toLowerCase().includes(lowerQuery) ||
      part.mfgPartNumber?.toLowerCase().includes(lowerQuery) ||
      part.brand?.toLowerCase().includes(lowerQuery) ||
      part.keyword?.toLowerCase().includes(lowerQuery)
  );
}

// ============================================================================
// PHASE DEFINITIONS
// ============================================================================

export const CONSTRUCTION_PHASES = [
  { phase: 0, name: 'Site Prep', description: 'Erosion control, silt fence, permits' },
  { phase: 1, name: 'Excavation & Form/Rebar', description: 'Dig, steel, plumbing rough-in' },
  { phase: 2, name: 'Tile/Coping', description: 'Waterline tile, coping installation' },
  { phase: 3, name: 'Concrete Deck/Grading', description: 'Pour deck, masonry work' },
  { phase: 4, name: 'Electrical & Fencing', description: 'Bonding, panel, safety fence' },
  { phase: 5, name: 'Equipment & Plaster', description: 'Equipment pad, plaster, startup' },
];
