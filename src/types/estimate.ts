/**
 * BlueCrew CostLab - Core Type Definitions
 * Trade-based estimating architecture for construction projects
 */

// All supported trade categories
export type TradeCategory =
  | 'planning'
  | 'site_preparation'
  | 'inground_pool'
  | 'inground_spa'
  | 'access'
  | 'excavation'
  | 'equipment_runs'
  | 'plumbing'
  | 'electrical'
  | 'gas_lp_solar'
  | 'structural'
  | 'masonry'
  | 'coping_tile'
  | 'concrete_decking'
  | 'deck_finish'
  | 'pool_interiors'
  | 'cleaning_system'
  | 'equipment_controls'
  | 'water_features'
  | 'pool_accessories'
  | 'landscaping_misc'
  | 'other';

export interface TradeConfig {
  id: TradeCategory;
  name: string;
  description: string;
  defaultMarginPercent: number;
  minimumMarginPercent: number;
  sortOrder: number;
}

export interface LineItem {
  id: string;
  tradeId: TradeCategory;
  description: string;
  quantity: number;
  unit: string;
  unitCost: number;
  totalCost: number;
  markup: number;
  totalPrice: number;
  isOverridden: boolean;
  overrideReason?: string;
  confidenceScore?: number; // 0-1, AI-generated items have confidence
  aiGenerated: boolean;
  notes?: string;
}

export interface TradeSummary {
  tradeId: TradeCategory;
  enabled: boolean;
  totalCost: number;
  totalPrice: number;
  marginPercent: number;
  marginDollars: number;
  lineItemCount: number;
  hasLowMarginWarning: boolean;
  hasOverrides: boolean;
  confidenceScore?: number;
}

export interface PoolGeometry {
  shape: 'rectangular' | 'freeform' | 'kidney' | 'roman' | 'grecian' | 'lazy_l' | 'custom';
  lengthFt: number | null;
  widthFt: number | null;
  avgDepthFt: number | null;
  areaSqft: number | null;
  perimeterLf: number | null;
  volumeGallons: number | null;
}

export interface DetectedFeatures {
  spa: 'present' | 'not_present' | 'unclear';
  raisedWall: 'present' | 'not_present' | 'unclear';
  waterFeatures: string[];
  steps: 'present' | 'not_present' | 'unclear';
  benches: 'present' | 'not_present' | 'unclear';
  sunshelf: 'present' | 'not_present' | 'unclear';
  sheerDescent: 'present' | 'not_present' | 'unclear';
  bubblers: 'present' | 'not_present' | 'unclear';
  deckJets: 'present' | 'not_present' | 'unclear';
  equipmentPad: 'present' | 'not_present' | 'unclear';
  deckExtentsSqft: number | null;
}

export interface DrawingAnalysis {
  geometry: PoolGeometry;
  features: DetectedFeatures;
  confidence: {
    geometry: number;
    features: number;
  };
  notes: string;
  extractedAt: string;
}

export interface Estimate {
  id: string;
  projectName: string;
  clientName: string;
  address: string;
  createdAt: string;
  updatedAt: string;
  status: 'draft' | 'pending_review' | 'approved' | 'sent' | 'accepted' | 'rejected';

  // Drawing/plan analysis
  drawingAnalysis?: DrawingAnalysis;

  // Trade-level data
  trades: Map<TradeCategory, TradeSummary>;
  lineItems: LineItem[];

  // Totals
  totalCost: number;
  totalPrice: number;
  overallMarginPercent: number;
  overallMarginDollars: number;

  // Review tracking
  reviewFlags: ReviewFlag[];
  approvedBy?: string;
  approvedAt?: string;

  // Versioning
  version: number;
  changeHistory: ChangeRecord[];
}

export interface ReviewFlag {
  id: string;
  type: 'low_margin' | 'override' | 'assumption' | 'missing_data' | 'confidence';
  tradeId?: TradeCategory;
  lineItemId?: string;
  message: string;
  severity: 'info' | 'warning' | 'error';
  resolved: boolean;
  resolvedBy?: string;
  resolvedAt?: string;
}

export interface ChangeRecord {
  id: string;
  timestamp: string;
  userId: string;
  action: 'create' | 'update' | 'override' | 'approve' | 'reject';
  field?: string;
  previousValue?: unknown;
  newValue?: unknown;
  reason?: string;
}

// Pricing table structures (loaded from company data)
export interface PricingTableEntry {
  id: string;
  tradeId: TradeCategory;
  category: string;
  item: string;
  unit: string;
  baseCost: number;
  defaultMarkup: number;
  tier?: 'standard' | 'premium' | 'luxury';
  notes?: string;
}

export interface PricingTable {
  version: string;
  lastUpdated: string;
  entries: PricingTableEntry[];
}
