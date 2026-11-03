export type SymbolId =
  | 'WILD'
  | 'SCATTER'
  | 'COIN'
  | 'DIAMOND'
  | 'SEVEN'
  | 'GOLDBAR'
  | 'BELL'
  | 'HORSESHOE'
  | 'MELON'
  | 'GRAPES'
  | 'ACE'
  | 'KING'
  | 'QUEEN'
  | 'JACK'
  | 'CHERRY'
  | 'PLUM'
  // Timberland Critters Symbols
  | 'BEAR'
  | 'OWL'
  | 'ACORN'
  | 'WOLF'
  | 'FOX'
  | 'RACCOON'
  | 'SQUIRREL'
  | 'PINECONE'
  | 'BERRIES'
  | 'MUSHROOM'
  | 'WOOD_A'
  | 'WOOD_K'
  | 'WOOD_Q'
  | 'WOOD_J';

export type SymbolTier = 'special' | 'high' | 'mid' | 'low';

export interface SlotSymbol {
  id: SymbolId;
  name: string;
  payouts: { 2?: number; 3: number; 4: number; 5: number };
  weight: number;
  color: string;
  tier: SymbolTier;
}

export type Payline = number[]; // 5 elements corresponding to row index (0..3) on each of the 5 reels

export type SymbolGrid = SymbolId[][]; // 5 reels x 4 rows: grid[reelIdx][rowIdx]

export interface WinningLine {
  lineIndex: number;
  symbolId: SymbolId;
  count: number;
  coords: [number, number][]; // [reelIdx, rowIdx]
  multiplier: number;
  payout: number;
}

export interface CashCoin {
  reel: number;
  row: number;
  value: number;
  jackpot?: 'MINI' | 'MINOR' | 'MAJOR' | 'GRAND';
}

export type WinTier = 'NONE' | 'REGULAR' | 'BIG_WIN' | 'MEGA_WIN' | 'EPIC_JACKPOT';

export interface SpinResult {
  grid: SymbolGrid;
  winningLines: WinningLine[];
  scatterCount: number;
  scatterCoords: [number, number][];
  coinCount: number;
  coinCoords: [number, number][];
  totalPayout: number;
  isFreeSpinsTriggered: boolean;
  isHoldAndSpinTriggered: boolean;
  winTier: WinTier;
}

export interface GameStats {
  totalSpins: number;
  totalWagered: number;
  totalWon: number;
  biggestWin: number;
  freeSpinsPlayed: number;
  holdAndSpinsPlayed: number;
}

export type DebugScenario =
  | 'RANDOM'
  | 'FIVE_WILDS'
  | 'FIVE_DIAMONDS'
  | 'FIVE_SEVENS'
  | 'FREE_SPINS'
  | 'HOLD_AND_SPIN'
  | 'NEAR_MISS'
  | 'BIG_WIN'
  | 'NO_WIN';

export interface ProgressionState {
  level: number;
  xp: number;
  xpForCurrentLevel: number;
  xpForNextLevel: number;
  progressPercent: number;
  maxBet: number;
}
