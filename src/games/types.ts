import type { SymbolId, Payline, SlotSymbol } from '../engine/types';

export type GameId = 'vault-24k' | 'timber-critters';

export interface GameTheme {
  primaryColor: string;
  accentColor: string;
  cabinetBorder: string;
  cabinetBg: string;
  marqueeTitle: string;
  freeSpinsTitle: string;
  bonusTitle: string;
  reserveTitle: string;
  grandTitle: string;
  majorTitle: string;
  minorTitle: string;
  miniTitle: string;
  tickerBadge: string;
  tickerText: string;
  tickerFreeSpinsText: string;
  feverTitle: string;
  feverSubtitle: string;
  spinButtonLabel: string;
}

export interface GameDefinition {
  id: GameId;
  name: string;
  shortName: string;
  tagline: string;
  icon: string;
  reels: number; // 5
  rows: number; // 4 for vault, 3 for timber-critters
  defaultLines: number; // 40 for vault, 25 for timber-critters
  availableLines: number[];
  paylines: Payline[];
  symbols: Record<string, SlotSymbol>;
  reelStrips: SymbolId[][];
  theme: GameTheme;
}
