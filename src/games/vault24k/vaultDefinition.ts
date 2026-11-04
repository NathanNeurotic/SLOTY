import type { GameDefinition } from '../types';
import { SYMBOLS } from '../../engine/symbols';
import { PAYLINES } from '../../engine/paylines';
import type { SymbolId } from '../../engine/types';

// Reel strips are SLOTY's own free-play math model (not lottery-calibrated).
// Measured profile (Monte Carlo, see test-engine.ts): ~93-99% total RTP, ~33-34% hit frequency.
export const VAULT_REEL_STRIPS: SymbolId[][] = [
  // Reel 1: 1 scatter, [2, 1, 1] coins (4 coins), 1 wild
  [
    'ACE', 'KING', 'QUEEN', 'JACK', 'BELL', 'COIN', 'COIN', 'MELON', 'GRAPES', 'SEVEN',
    'JACK', 'QUEEN', 'KING', 'ACE', 'WILD', 'HORSESHOE', 'GOLDBAR', 'SCATTER', 'DIAMOND', 'SEVEN',
    'BELL', 'MELON', 'COIN', 'GRAPES', 'ACE', 'KING', 'QUEEN', 'JACK', 'HORSESHOE', 'BELL',
    'GOLDBAR', 'SEVEN', 'DIAMOND', 'KING', 'QUEEN', 'JACK', 'ACE', 'MELON', 'COIN', 'GRAPES',
    'BELL', 'HORSESHOE', 'KING', 'QUEEN', 'JACK', 'DIAMOND', 'SEVEN', 'GOLDBAR', 'BELL', 'ACE',
  ],
  // Reel 2: 1 scatter, [2, 1, 1] coins (4 coins), 2 wilds
  [
    'KING', 'QUEEN', 'JACK', 'ACE', 'WILD', 'BELL', 'COIN', 'COIN', 'MELON', 'GRAPES',
    'SEVEN', 'DIAMOND', 'HORSESHOE', 'GOLDBAR', 'SCATTER', 'JACK', 'QUEEN', 'KING', 'ACE', 'BELL',
    'MELON', 'GRAPES', 'SEVEN', 'WILD', 'HORSESHOE', 'COIN', 'JACK', 'QUEEN', 'ACE', 'KING',
    'QUEEN', 'JACK', 'GOLDBAR', 'DIAMOND', 'SEVEN', 'BELL', 'MELON', 'COIN', 'HORSESHOE', 'GRAPES',
    'ACE', 'KING', 'QUEEN', 'JACK', 'BELL', 'DIAMOND', 'SEVEN', 'GOLDBAR', 'KING', 'QUEEN',
  ],
  // Reel 3: 2 scatters, [2, 1, 1] coins (4 coins), 2 wilds
  [
    'QUEEN', 'JACK', 'ACE', 'KING', 'SEVEN', 'DIAMOND', 'COIN', 'COIN', 'GOLDBAR', 'BELL',
    'MELON', 'GRAPES', 'WILD', 'SCATTER', 'HORSESHOE', 'JACK', 'QUEEN', 'KING', 'ACE', 'BELL',
    'MELON', 'GRAPES', 'SEVEN', 'DIAMOND', 'COIN', 'HORSESHOE', 'JACK', 'QUEEN', 'KING', 'ACE',
    'WILD', 'GOLDBAR', 'BELL', 'MELON', 'GRAPES', 'COIN', 'SCATTER', 'SEVEN', 'DIAMOND', 'ACE',
    'KING', 'QUEEN', 'JACK', 'HORSESHOE', 'BELL', 'GOLDBAR', 'SEVEN', 'DIAMOND', 'KING', 'ACE',
  ],
  // Reel 4: 1 scatter, [2, 1, 1] coins (4 coins), 2 wilds
  [
    'JACK', 'QUEEN', 'KING', 'ACE', 'GOLDBAR', 'SEVEN', 'DIAMOND', 'COIN', 'COIN', 'BELL',
    'MELON', 'GRAPES', 'WILD', 'SCATTER', 'HORSESHOE', 'JACK', 'QUEEN', 'KING', 'ACE', 'BELL',
    'MELON', 'SEVEN', 'DIAMOND', 'COIN', 'HORSESHOE', 'GOLDBAR', 'WILD', 'QUEEN', 'JACK', 'KING',
    'ACE', 'BELL', 'MELON', 'GRAPES', 'SEVEN', 'COIN', 'DIAMOND', 'HORSESHOE', 'ACE', 'KING',
    'QUEEN', 'JACK', 'GOLDBAR', 'BELL', 'MELON', 'SEVEN', 'DIAMOND', 'KING', 'QUEEN', 'ACE',
  ],
  // Reel 5: 1 scatter, [2, 1, 1] coins (4 coins), 2 wilds
  [
    'ACE', 'KING', 'QUEEN', 'JACK', 'SEVEN', 'DIAMOND', 'GOLDBAR', 'COIN', 'COIN', 'BELL',
    'MELON', 'GRAPES', 'WILD', 'SCATTER', 'HORSESHOE', 'JACK', 'QUEEN', 'COIN', 'KING', 'ACE',
    'BELL', 'MELON', 'GRAPES', 'SEVEN', 'DIAMOND', 'COIN', 'HORSESHOE', 'GOLDBAR', 'WILD', 'JACK',
    'QUEEN', 'KING', 'ACE', 'BELL', 'SEVEN', 'DIAMOND', 'ACE', 'KING', 'QUEEN', 'JACK',
    'HORSESHOE', 'GOLDBAR', 'BELL', 'MELON', 'SEVEN', 'DIAMOND', 'KING', 'QUEEN', 'ACE', 'JACK',
  ],
];

export const VAULT_24K_GAME: GameDefinition = {
  id: 'vault-24k',
  name: '24K Gold & Cash Vault',
  shortName: '24K Vault',
  tagline: 'High Roller Bullion & Blast Door Scatters',
  icon: '🎰',
  reels: 5,
  rows: 4,
  defaultLines: 40,
  availableLines: [1, 5, 10, 20, 30, 40],
  paylines: PAYLINES,
  symbols: SYMBOLS,
  reelStrips: VAULT_REEL_STRIPS,
  theme: {
    primaryColor: '#F59E0B', // 24K Gold
    accentColor: '#00F0FF', // Neon Cyan
    cabinetBorder: 'border-yellow-400/80 shadow-[0_0_35px_rgba(245,158,11,0.5)]',
    cabinetBg: 'bg-gradient-to-b from-casino-800 via-casino-900 to-black',
    marqueeTitle: '★ 24K GOLD & CASH VAULT • 40 PAYLINES ★',
    freeSpinsTitle: '🔥 VAULT BLAST DOOR FREE SPINS (3X MULTIPLIER) 🔥',
    bonusTitle: '🪙 FORT KNOX CASH LINK 🪙',
    reserveTitle: '24K VAULT RESERVE',
    grandTitle: '★ FORT KNOX IMPERIAL GRAND ★',
    majorTitle: 'MAJOR',
    minorTitle: 'MINOR',
    miniTitle: 'MINI',
    tickerBadge: 'CASH TICKER',
    tickerText: '★ 24K GOLD & CASH VAULT ★ 40 HIGH-ROLLER PAYLINES ★ HIT 6 MINTED BULLION COINS FOR FORT KNOX CASH LINK ★ 3 VAULT SCATTERS AWARD 10 FREE SPINS AT 3X MULTIPLIER ★ RISK WINS IN VIDEO POKER DOUBLE-UP ★ FREE-PLAY FUN — NO REAL-MONEY PAYOUTS ★ GOOD LUCK HIGH ROLLER! ★',
    tickerFreeSpinsText: '🔥🔥🔥 PENTHOUSE CASH RUSH ACTIVE • ALL PAYLINE WINS TRIPLED (3X) • RAINING $100 BILLS 🔥🔥🔥',
    feverTitle: 'MOLTEN GOLD OVERDRIVE',
    feverSubtitle: 'CHARGE WITH WINS',
    spinButtonLabel: 'SPIN',
  },
  betSteps: [1, 2, 5, 10, 25, 50, 100],
  maxBetPerLine: 100,
  maxTotalBet: 2000,
  wildId: 'WILD',
  scatterId: 'SCATTER',
  coinId: 'COIN',
  freeSpinsAward: 10,
  freeSpinsMultiplier: 3,
  volatilityLabel: 'Balanced, big-win leaning',
};
