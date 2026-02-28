
export interface iPhoneModel {
  name: string;
  baseMarketValue: number; // Valore per il taglio base
}

export interface StorageOption {
  label: string;
  multiplier: number;
}

export interface CheckItem {
  id: string;
  label: string;
  penaltyPercent: number;
  category: 'functional' | 'cosmetic';
}

export interface EvaluationState {
  model: string;
  storage: string;
  batteryHealth: number;
  checks: Record<string, boolean>;
}
