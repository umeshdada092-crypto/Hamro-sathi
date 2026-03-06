export interface GoldPrice {
  date: string;
  fineGold: number;
  tejabiGold: number;
  silver: number;
}

export interface CurrencyRate {
  code: string;
  name: string;
  buy: number;
  sell: number;
}

export interface NepaliDate {
  year: number;
  month: number;
  day: number;
  monthName: string;
  dayName: string;
}

export const NEPALI_MONTHS = [
  "Baishakh", "Jestha", "Ashadh", "Shrawan", "Bhadra", "Ashwin",
  "Kartik", "Mangsir", "Poush", "Magh", "Falgun", "Chaitra"
];

export const NEPALI_DAYS = [
  "Aaitabar", "Sombar", "Mangalbar", "Budhabar", "Bihibar", "Sukrabar", "Sanibar"
];

// Simplified conversion constants for 2081 BS (2024-2025 AD)
export const BS_2081_START_AD = new Date(2024, 3, 13); // April 13, 2024 is Baishakh 1, 2081
