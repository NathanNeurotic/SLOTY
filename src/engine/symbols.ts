import type { SlotSymbol, SymbolId } from './types';

// Tuned against SLOTY's own math model; measured by test-engine.ts (not a certification)
// Profile is measured, not targeted on paper: see the Monte Carlo output of test-engine.ts for current numbers
export const SYMBOLS: Record<string, SlotSymbol> = {
  WILD: {
    id: 'WILD',
    name: '24K Liquid Gold Crown',
    payouts: { 2: 4, 3: 135, 4: 675, 5: 3150 },
    weight: 4,
    color: '#FFD700',
    tier: 'special',
  },
  SCATTER: {
    id: 'SCATTER',
    name: 'Bank Vault Safe Door',
    payouts: { 3: 50, 4: 200, 5: 1000 },
    weight: 6,
    color: '#00F0FF',
    tier: 'special',
  },
  COIN: {
    id: 'COIN',
    name: 'Minted Bullion Coin',
    payouts: { 3: 0, 4: 0, 5: 0 },
    weight: 8,
    color: '#F59E0B',
    tier: 'special',
  },
  DIAMOND: {
    id: 'DIAMOND',
    name: 'Diamond Cash Briefcase',
    payouts: { 3: 95, 4: 360, 5: 1200 },
    weight: 8,
    color: '#38BDF8',
    tier: 'high',
  },
  SEVEN: {
    id: 'SEVEN',
    name: 'Solid Gold 777 Ingot',
    payouts: { 3: 75, 4: 260, 5: 850 },
    weight: 10,
    color: '#EF4444',
    tier: 'high',
  },
  GOLDBAR: {
    id: 'GOLDBAR',
    name: '999.9 Gold Bullion Pyramid',
    payouts: { 3: 52, 4: 190, 5: 640 },
    weight: 12,
    color: '#FBBF24',
    tier: 'high',
  },
  BELL: {
    id: 'BELL',
    name: 'Overstuffed Cash Bag',
    payouts: { 3: 38, 4: 135, 5: 460 },
    weight: 14,
    color: '#EAB308',
    tier: 'mid',
  },
  HORSESHOE: {
    id: 'HORSESHOE',
    name: 'Banded Cash Brick',
    payouts: { 3: 28, 4: 100, 5: 320 },
    weight: 16,
    color: '#A855F7',
    tier: 'mid',
  },
  MELON: {
    id: 'MELON',
    name: 'Royal Gold Treasure Chest',
    payouts: { 3: 22, 4: 72, 5: 240 },
    weight: 18,
    color: '#22C55E',
    tier: 'mid',
  },
  GRAPES: {
    id: 'GRAPES',
    name: 'Gold Ingot Stack',
    payouts: { 3: 17, 4: 55, 5: 180 },
    weight: 20,
    color: '#9333EA',
    tier: 'mid',
  },
  ACE: {
    id: 'ACE',
    name: '24K Gold Ace',
    payouts: { 3: 12, 4: 38, 5: 120 },
    weight: 24,
    color: '#F59E0B',
    tier: 'low',
  },
  KING: {
    id: 'KING',
    name: 'Gold King Scepter',
    payouts: { 3: 10, 4: 30, 5: 92 },
    weight: 26,
    color: '#EC4899',
    tier: 'low',
  },
  QUEEN: {
    id: 'QUEEN',
    name: 'Gold Queen Tiara',
    payouts: { 3: 8, 4: 22, 5: 68 },
    weight: 28,
    color: '#8B5CF6',
    tier: 'low',
  },
  JACK: {
    id: 'JACK',
    name: 'Gold Jack Crest',
    payouts: { 3: 6, 4: 17, 5: 46 },
    weight: 30,
    color: '#06B6D4',
    tier: 'low',
  },
  CHERRY: {
    id: 'CHERRY',
    name: 'Diamond Dollar Sign',
    payouts: { 3: 6, 4: 17, 5: 46 },
    weight: 25,
    color: '#F43F5E',
    tier: 'low',
  },
  PLUM: {
    id: 'PLUM',
    name: 'Cash Currency Roll',
    payouts: { 3: 8, 4: 22, 5: 68 },
    weight: 22,
    color: '#C084FC',
    tier: 'low',
  },
};

export const SYMBOL_LIST = Object.values(SYMBOLS);

export const WEIGHTED_SYMBOL_POOL: SymbolId[] = SYMBOL_LIST.flatMap((sym) =>
  Array(sym.weight).fill(sym.id)
);
