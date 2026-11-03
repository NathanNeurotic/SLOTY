import type { GameDefinition } from '../types';
import { PIXEL_SYMBOLS } from './pixelSymbols';
import { PIXEL_PAYLINES } from './pixelPaylines';
import { PIXEL_REEL_STRIPS } from './pixelStrips';

export const PIXEL_ARCADE_GAME: GameDefinition = {
  id: 'pixel-arcade',
  name: 'Pixel Arcade: 8-Bit Quest',
  shortName: 'Pixel Arcade',
  tagline: '6x5 Mega-Grid // 50 Paylines // Boss Rush',
  icon: '🕹️',
  reels: 6,
  rows: 5,
  defaultLines: 50,
  availableLines: [10, 25, 40, 50],
  paylines: PIXEL_PAYLINES,
  symbols: PIXEL_SYMBOLS,
  reelStrips: PIXEL_REEL_STRIPS,
  theme: {
    primaryColor: '#8B5CF6', // Electric Violet
    accentColor: '#EC4899', // Hot Pink
    cabinetBorder: 'border-purple-500/80 shadow-[0_0_40px_rgba(139,92,246,0.6)]',
    cabinetBg: 'bg-gradient-to-b from-[#0e0725] via-[#160a36] to-[#080314]',
    marqueeTitle: '🕹️ PIXEL ARCADE • 6x5 MEGA-GRID • 50 LINES 🕹️',
    freeSpinsTitle: '👾 8-BIT BOSS STAGE (3X COMBO MULTIPLIER) 👾',
    bonusTitle: '🪙 HIGH SCORE TOKEN RESPIN 🪙',
    reserveTitle: '🪙 ARCADE TOKEN VAULT',
    grandTitle: '👾 CYBER MEGA-BOSS GRAND JACKPOT 👾',
    majorTitle: 'MECHA DRAGON',
    minorTitle: 'PIXEL KNIGHT',
    miniTitle: '1-UP EXTRA LIFE',
    tickerBadge: 'ARCADE TICKER',
    tickerText:
      '🕹️ PIXEL ARCADE 🕹️ 6x5 MEGA-GRID 50 LINES 🕹️ HIT 6 RETRO TOKENS TO TRIGGER HIGH SCORE RESPIN 🕹️ 3 CARTRIDGES UNLOCK 8-BIT BOSS STAGE WITH 3X MULTIPLIERS 🕹️ 95.8% OREGON VLT CERTIFIED 🕹️ INSERT COIN TO PLAY! 🕹️',
    tickerFreeSpinsText:
      '👾👾👾 8-BIT BOSS RUSH FREE SPINS ACTIVE • ALL ARCADE WINS TRIPLED (3X) • DEFEAT THE FINAL BOSS! 👾👾👾',
    feverTitle: 'OVERDRIVE COMBO',
    feverSubtitle: 'CHARGE 100% FEVER FOR 2X 8-BIT WIN STRIKES',
    spinButtonLabel: 'INSERT COIN / SPIN',
  },
};
