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
  | 'WOOD_J'
  // Pixel Arcade 8-Bit Retro Video Game Symbols
  | 'CYBER_WILD'
  | 'PIXEL_CARTRIDGE'
  | 'RETRO_TOKEN'
  | 'BOSS_DRAGON'
  | 'HERO_KNIGHT'
  | 'GAMEPAD'
  | 'JOYSTICK'
  | 'POTION_HEAL'
  | 'PIXEL_A'
  | 'PIXEL_K'
  | 'PIXEL_Q'
  | 'PIXEL_J'
  | 'PIXEL_10'
  // PlayStation 2 Emotion Engine Legends Symbols
  | 'PS2_LOGO'
  | 'DVD_DISC'
  | 'MEMORY_CARD'
  | 'EMOTION_ENGINE'
  | 'DUALSHOCK'
  | 'PS_TRIANGLE'
  | 'PS_CIRCLE'
  | 'PS_CROSS'
  | 'PS_SQUARE'
  | 'BOOT_TOWER'
  | 'ANALOG_STICK';

export type SymbolTier = 'special' | 'high' | 'mid' | 'low';

export interface SlotSymbol {
  id: SymbolId;
  name: string;
  payouts: { 2?: number; 3: number; 4: number; 5: number; 6?: number };
  weight: number;
  color: string;
  tier: SymbolTier;
}

export type Payline = number[]; // Row index for each reel (e.g. 5 or 6 reels)

export type SymbolGrid = SymbolId[][]; // grid[reelIdx][rowIdx] (e.g. 5x4, 5x3, or 6x5)

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
