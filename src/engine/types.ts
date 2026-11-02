export type SymbolId =
  | 'WILD'
  | 'SCATTER'
  | 'DIAMOND'
  | 'SEVEN'
  | 'BELL'
  | 'HORSESHOE'
  | 'MELON'
  | 'PLUM'
  | 'CHERRY';

export type SymbolTier = 'special' | 'high' | 'mid' | 'low';

export interface SlotSymbol {
  id: SymbolId;
  name: string;
  payouts: { 3: number; 4: number; 5: number };
  weight: number;
  color: string;
  tier: SymbolTier;
}

export type Payline = number[]; // 5 elements corresponding to row index (0, 1, 2) on each reel

export type SymbolGrid = SymbolId[][]; // grid[reelIndex][rowIndex], 5 reels x 3 rows

export interface WinningLine {
  lineIndex: number;
  symbolId: SymbolId;
  count: number;
  coords: [number, number][]; // [reelIdx, rowIdx]
  multiplier: number;
  payout: number;
}

export type WinTier = 'NONE' | 'REGULAR' | 'BIG_WIN' | 'MEGA_WIN' | 'EPIC_JACKPOT';

export interface SpinResult {
  grid: SymbolGrid;
  winningLines: WinningLine[];
  scatterCount: number;
  scatterCoords: [number, number][];
  totalPayout: number;
  isFreeSpinsTriggered: boolean;
  winTier: WinTier;
}

export interface GameStats {
  totalSpins: number;
  totalWagered: number;
  totalWon: number;
  biggestWin: number;
  freeSpinsPlayed: number;
}

export type DebugScenario =
  | 'RANDOM'
  | 'FIVE_WILDS'
  | 'FIVE_DIAMONDS'
  | 'FIVE_SEVENS'
  | 'FREE_SPINS'
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
