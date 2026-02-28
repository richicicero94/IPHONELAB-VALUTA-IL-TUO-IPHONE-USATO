
import { iPhoneModel, CheckItem, StorageOption } from './types';

export const IPHONE_MODELS: iPhoneModel[] = [
  { name: 'iPhone 17 Pro Max', baseMarketValue: 1600 },
  { name: 'iPhone 17 Pro', baseMarketValue: 1450 },
  { name: 'iPhone 17 Air', baseMarketValue: 1300 },
  { name: 'iPhone 17 Plus', baseMarketValue: 1200 },
  { name: 'iPhone 17', baseMarketValue: 1100 },
  { name: 'iPhone 16 Pro Max', baseMarketValue: 1400 },
  { name: 'iPhone 16 Pro', baseMarketValue: 1250 },
  { name: 'iPhone 16 Plus', baseMarketValue: 1050 },
  { name: 'iPhone 16', baseMarketValue: 950 },
  { name: 'iPhone 16e', baseMarketValue: 800 },
  { name: 'iPhone 15 Pro Max', baseMarketValue: 1200 },
  { name: 'iPhone 15 Pro', baseMarketValue: 1050 },
  { name: 'iPhone 15 Plus', baseMarketValue: 900 },
  { name: 'iPhone 15', baseMarketValue: 800 },
  { name: 'iPhone 14 Pro Max', baseMarketValue: 950 },
  { name: 'iPhone 14 Pro', baseMarketValue: 850 },
  { name: 'iPhone 14', baseMarketValue: 650 },
  { name: 'iPhone 13 Pro Max', baseMarketValue: 750 },
  { name: 'iPhone 13 Pro', baseMarketValue: 650 },
  { name: 'iPhone 13', baseMarketValue: 500 },
  { name: 'iPhone 12 Pro Max', baseMarketValue: 600 },
  { name: 'iPhone 12 Pro', baseMarketValue: 550 },
  { name: 'iPhone 12', baseMarketValue: 400 },
  { name: 'iPhone 11 Pro Max', baseMarketValue: 500 },
  { name: 'iPhone 11 Pro', baseMarketValue: 450 },
  { name: 'iPhone 11', baseMarketValue: 300 },
  { name: 'iPhone XS Max', baseMarketValue: 250 },
  { name: 'iPhone XS', baseMarketValue: 220 },
  { name: 'iPhone XR', baseMarketValue: 200 },
  { name: 'iPhone X', baseMarketValue: 180 },
];

export const STORAGE_OPTIONS: StorageOption[] = [
  { label: '64 GB', multiplier: 0.9 },
  { label: '128 GB', multiplier: 1.0 },
  { label: '256 GB', multiplier: 1.15 },
  { label: '512 GB', multiplier: 1.3 },
  { label: '1 TB', multiplier: 1.5 },
];

export const FUNCTIONAL_CHECKS: CheckItem[] = [
  { id: 'faceId', label: 'Face ID / Touch ID Funzionante', penaltyPercent: 15, category: 'functional' },
  { id: 'speaker', label: 'Altoparlante Funzionante', penaltyPercent: 5, category: 'functional' },
  { id: 'frontCamera', label: 'Fotocamera Frontale Funzionante', penaltyPercent: 8, category: 'functional' },
  { id: 'backCamera', label: 'Fotocamera Posteriore Funzionante', penaltyPercent: 12, category: 'functional' },
  { id: 'cellular', label: 'Rete Cellulare Funzionante', penaltyPercent: 20, category: 'functional' },
  { id: 'displayFunctional', label: 'Display Funzionante (no righe/macchie)', penaltyPercent: 30, category: 'functional' },
  { id: 'simReader', label: 'Lettore SIM Funzionante', penaltyPercent: 10, category: 'functional' },
  { id: 'chargingPort', label: 'Connettore di Carica Funzionante', penaltyPercent: 8, category: 'functional' },
  { id: 'wifi', label: 'WiFi Funzionante', penaltyPercent: 10, category: 'functional' },
  { id: 'bluetooth', label: 'Bluetooth Funzionante', penaltyPercent: 5, category: 'functional' },
];

export const COSMETIC_CHECKS: CheckItem[] = [
  { id: 'screenCracked', label: 'Schermo Crepato', penaltyPercent: 25, category: 'cosmetic' },
  { id: 'frontWear', label: 'Segni di usura fronte minimi', penaltyPercent: 5, category: 'cosmetic' },
  { id: 'backWear', label: 'Segni di usura retro minimi', penaltyPercent: 5, category: 'cosmetic' },
  { id: 'backCracked', label: 'Back Cover Crepata', penaltyPercent: 15, category: 'cosmetic' },
];
