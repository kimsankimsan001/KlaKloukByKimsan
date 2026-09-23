import { SymbolDefinition, SymbolId } from '../types';

export const ALL_SYMBOLS: Record<SymbolId, SymbolDefinition> = {
  tiger: {
    id: 'tiger',
    nameKhmer: 'ខ្លា',
    nameEnglish: 'Tiger',
    pronunciation: 'Kla',
    primaryColor: '#F59E0B',
    accentColor: '#D97706',
    textColor: '#78350F',
  },
  calabash: {
    id: 'calabash',
    nameKhmer: 'ឃ្លោក',
    nameEnglish: 'Calabash Gourd',
    pronunciation: 'Klouk',
    primaryColor: '#EF4444',
    accentColor: '#DC2626',
    textColor: '#7F1D1D',
  },
  rooster: {
    id: 'rooster',
    nameKhmer: 'មាន់',
    nameEnglish: 'Rooster',
    pronunciation: 'Moan',
    primaryColor: '#10B981',
    accentColor: '#059669',
    textColor: '#064E3B',
  },
  shrimp: {
    id: 'shrimp',
    nameKhmer: 'បង្គា',
    nameEnglish: 'Shrimp',
    pronunciation: 'Bongkea',
    primaryColor: '#3B82F6',
    accentColor: '#2563EB',
    textColor: '#1E3A8A',
  },
  crab: {
    id: 'crab',
    nameKhmer: 'ក្តាម',
    nameEnglish: 'Crab',
    pronunciation: 'Kdam',
    primaryColor: '#8B5CF6',
    accentColor: '#7C3AED',
    textColor: '#4C1D95',
  },
  fish: {
    id: 'fish',
    nameKhmer: 'ត្រី',
    nameEnglish: 'Fish',
    pronunciation: 'Trey',
    primaryColor: '#06B6D4',
    accentColor: '#0891B2',
    textColor: '#164E63',
  },
  deer: {
    id: 'deer',
    nameKhmer: 'ក្តាន់',
    nameEnglish: 'Deer',
    pronunciation: 'Kdan',
    primaryColor: '#D97706',
    accentColor: '#B45309',
    textColor: '#78350F',
  },
};

/**
 * Returns the 6 active board symbols based on the chosen variant.
 * In the visual reference, the 2x3 grid is:
 * Row 1: Tiger, Calabash/Deer, Rooster
 * Row 2: Shrimp, Crab, Fish
 */
export function getActiveSymbols(variant: 'calabash' | 'deer' = 'calabash'): SymbolDefinition[] {
  const middleSymbol = variant === 'calabash' ? ALL_SYMBOLS.calabash : ALL_SYMBOLS.deer;
  return [
    ALL_SYMBOLS.tiger,
    middleSymbol,
    ALL_SYMBOLS.rooster,
    ALL_SYMBOLS.shrimp,
    ALL_SYMBOLS.crab,
    ALL_SYMBOLS.fish,
  ];
}
