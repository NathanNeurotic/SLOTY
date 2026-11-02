import type { SlotSymbol, SymbolId } from './types';

export const SYMBOLS: Record<SymbolId, SlotSymbol> = {
  WILD: {
    id: 'WILD',
    name: 'Wild Crown',
    payouts: { 3: 50, 4: 200, 5: 1000 },
    weight: 4,
    color: '#FFD700',
    tier: 'special',
  },
  SCATTER: {
    id: 'SCATTER',
    name: 'Bonus Vault',
    payouts: { 3: 100, 4: 300, 5: 1500 },
    weight: 5,
    color: '#00F0FF',
    tier: 'special',
  },
  DIAMOND: {
    id: 'DIAMOND',
    name: 'Royal Diamond',
    payouts: { 3: 30, 4: 100, 5: 400 },
    weight: 7,
    color: '#38BDF8',
    tier: 'high',
  },
  SEVEN: {
    id: 'SEVEN',
    name: 'Blazing 7',
    payouts: { 3: 20, 4: 60, 5: 250 },
    weight: 9,
    color: '#EF4444',
    tier: 'high',
  },
  BELL: {
    id: 'BELL',
    name: 'Golden Bell',
    payouts: { 3: 15, 4: 40, 5: 150 },
    weight: 12,
    color: '#FBBF24',
    tier: 'mid',
  },
  HORSESHOE: {
    id: 'HORSESHOE',
    name: 'Lucky Horseshoe',
    payouts: { 3: 10, 4: 25, 5: 100 },
    weight: 14,
    color: '#A855F7',
    tier: 'mid',
  },
  MELON: {
    id: 'MELON',
    name: 'Neon Melon',
    payouts: { 3: 8, 4: 20, 5: 75 },
    weight: 18,
    color: '#22C55E',
    tier: 'low',
  },
  PLUM: {
    id: 'PLUM',
    name: 'Velvet Plum',
    payouts: { 3: 6, 4: 15, 5: 50 },
    weight: 22,
    color: '#C084FC',
    tier: 'low',
  },
  CHERRY: {
    id: 'CHERRY',
    name: 'Twin Cherries',
    payouts: { 3: 5, 4: 12, 5: 35 },
    weight: 25,
    color: '#F43F5E',
    tier: 'low',
  },
};

export const SYMBOL_LIST = Object.values(SYMBOLS);

// Helper array pre-weighted for fast random picking
export const WEIGHTED_SYMBOL_POOL: SymbolId[] = SYMBOL_LIST.flatMap((sym) =>
  Array(sym.weight).fill(sym.id)
);
