import type { GameDefinition } from '../types';
import { TIMBER_SYMBOLS } from './timberSymbols';
import { TIMBER_PAYLINES } from './timberPaylines';
import { TIMBER_REEL_STRIPS } from './timberStrips';

export const TIMBER_CRITTERS_GAME: GameDefinition = {
  id: 'timber-critters',
  name: 'Timberland Critters',
  shortName: 'Timberland',
  tagline: 'Forest Wildlife & Acorn Cash Link',
  icon: '🌲',
  reels: 5,
  rows: 3,
  defaultLines: 25,
  availableLines: [1, 5, 10, 15, 20, 25],
  paylines: TIMBER_PAYLINES,
  symbols: TIMBER_SYMBOLS,
  reelStrips: TIMBER_REEL_STRIPS,
  theme: {
    primaryColor: '#10B981', // Emerald Forest
    accentColor: '#F59E0B', // Amber
    cabinetBorder: 'border-emerald-500/70 shadow-[0_0_35px_rgba(16,185,129,0.5)]',
    cabinetBg: 'bg-gradient-to-b from-stone-900 via-emerald-950 to-stone-950',
    marqueeTitle: '🌲 TIMBERLAND CRITTERS • 25 PAYLINES 🌲',
    freeSpinsTitle: '🦉 MOONLIT OWL FREE SPINS (3X MULTIPLIER) 🦉',
    bonusTitle: '🌰 GOLDEN ACORN CASH LINK 🌰',
    reserveTitle: '🌰 FOREST ACORN RESERVE',
    grandTitle: '🌲 GRIZZLY PEAK GRAND JACKPOT 🌲',
    majorTitle: 'TIMBER WOLF',
    minorTitle: 'CLEVER FOX',
    miniTitle: 'SQUIRREL',
    tickerBadge: 'TIMBER TICKER',
    tickerText: '🌲 TIMBERLAND CRITTERS 🌲 25 WILD WOODLAND PAYLINES 🌲 HIT 6 GOLDEN ACORNS FOR THE FOREST HARVEST RESPIN 🌲 3 MOONLIT OWLS AWARD 10 FREE SPINS AT 3X WINS 🌲 BEAR WILDS BOOST WINS 🌲 96.2% RTP CERTIFIED 🌲 GOOD LUCK EXPLORER! 🌲',
    tickerFreeSpinsText: '🦉🦉🦉 MOONLIT OWL FREE SPINS ACTIVE • ALL WOODLAND WINS TRIPLED (3X) • HARVEST THE FOREST GOLD! 🦉🦉🦉',
    feverTitle: "NATURE'S FURY",
    feverSubtitle: 'CHARGE WITH FOREST WINS',
    spinButtonLabel: 'WOODLAND SPIN',
  },
};
