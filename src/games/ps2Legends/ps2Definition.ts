import type { GameDefinition } from '../types';
import { PS2_SYMBOLS } from './ps2Symbols';
import { PAYLINES } from '../../engine/paylines';
import { PS2_REEL_STRIPS } from './ps2Strips';

export const PS2_LEGENDS_GAME: GameDefinition = {
  id: 'ps2-legends',
  name: 'PlayStation 2: Emotion Engine',
  shortName: 'PS2 Legends',
  tagline: '128-Bit Emotion Engine • 8MB MagicGate Cash Link',
  icon: '🎮',
  reels: 5,
  rows: 4,
  defaultLines: 40,
  availableLines: [1, 5, 10, 20, 30, 40],
  paylines: PAYLINES,
  symbols: PS2_SYMBOLS,
  reelStrips: PS2_REEL_STRIPS,
  theme: {
    primaryColor: '#006FCD',
    accentColor: '#38BDF8',
    cabinetBorder: 'border-blue-600/80 shadow-[0_0_40px_rgba(0,111,205,0.7)]',
    cabinetBg: 'bg-gradient-to-b from-[#020617] via-[#040d21] to-[#01040a]',
    marqueeTitle: '🎮 EMOTION ENGINE • PS2 LEGENDS • 40 LINES 🎮',
    freeSpinsTitle: '💿 BLUE LASER DVD-ROM FREE SPINS (3X MULTIPLIER) 💿',
    bonusTitle: '💾 8MB MAGICGATE MEMORY CARD CASH LINK 💾',
    reserveTitle: '💾 8MB MEMORY CARD SYSTEM CACHE',
    grandTitle: '🌌 128-BIT EMOTION ENGINE GRAND JACKPOT 🌌',
    majorTitle: 'DUALSHOCK RUMBLE',
    minorTitle: 'MAGICGATE 8MB',
    miniTitle: 'STANDBY BLUE',
    tickerBadge: 'PS2 128-BIT',
    tickerText:
      '🎮 PLAYSTATION 2 EMOTION ENGINE 🎮 40 REVERED 128-BIT PAYLINES 🎮 HIT 6 MEMORY CARDS FOR THE 8MB SAVE-STATE CASH LINK 🎮 3 BLUE LASER DVD-ROMS AWARD 10 FREE SPINS AT 3X MULTIPLIERS 🎮 95.5% OREGON VLT CERTIFIED 🎮 LIVE IN YOUR WORLD, PLAY IN OURS! 🎮',
    tickerFreeSpinsText:
      '💿💿💿 128-BIT DVD-ROM FREE SPINS ACTIVE • ALL PLAYSTATION WINS TRIPLED (3X) • UNLOCK THE MASTER DISCS! 💿💿💿',
    feverTitle: 'OVERCLOCK 294MHz',
    feverSubtitle: 'CHARGE 100% FOR 2X 128-BIT VECTOR MULTIPLIER',
    spinButtonLabel: 'DUALSHOCK START',
  },
  betSteps: [1, 2, 5, 10, 25, 50],
  maxBetPerLine: 50,
  maxTotalBet: 500,
};
