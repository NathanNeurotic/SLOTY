import type { GameDefinition } from '../types';
import { SYMBOLS } from '../../engine/symbols';
import { PAYLINES } from '../../engine/paylines';
import type { SymbolId } from '../../engine/types';

export const VAULT_REEL_STRIPS: SymbolId[][] = [
  // Reel 1
  [
    'ACE', 'ACE', 'KING', 'QUEEN', 'JACK', 'BELL', 'BELL', 'MELON', 'GRAPES', 'SEVEN',
    'JACK', 'COIN', 'QUEEN', 'KING', 'ACE', 'WILD', 'HORSESHOE', 'GOLDBAR', 'COIN', 'SCATTER',
    'DIAMOND', 'SEVEN', 'BELL', 'MELON', 'COIN', 'GRAPES', 'ACE', 'KING', 'QUEEN', 'JACK',
    'COIN', 'HORSESHOE', 'BELL', 'GOLDBAR', 'WILD', 'SEVEN', 'DIAMOND', 'KING', 'QUEEN', 'JACK',
    'ACE', 'MELON', 'GRAPES', 'COIN', 'SCATTER', 'BELL', 'HORSESHOE', 'KING', 'QUEEN', 'JACK',
  ],
  // Reel 2
  [
    'KING', 'KING', 'QUEEN', 'JACK', 'ACE', 'WILD', 'BELL', 'MELON', 'GRAPES', 'SEVEN',
    'DIAMOND', 'COIN', 'COIN', 'HORSESHOE', 'GOLDBAR', 'SCATTER', 'JACK', 'QUEEN', 'KING', 'ACE',
    'BELL', 'BELL', 'MELON', 'GRAPES', 'SEVEN', 'WILD', 'HORSESHOE', 'COIN', 'JACK', 'QUEEN',
    'ACE', 'COIN', 'KING', 'QUEEN', 'JACK', 'GOLDBAR', 'DIAMOND', 'SEVEN', 'BELL', 'MELON',
    'COIN', 'SCATTER', 'HORSESHOE', 'GRAPES', 'ACE', 'KING', 'QUEEN', 'JACK', 'BELL', 'WILD',
  ],
  // Reel 3
  [
    'QUEEN', 'QUEEN', 'JACK', 'ACE', 'KING', 'SEVEN', 'SEVEN', 'DIAMOND', 'GOLDBAR', 'BELL',
    'MELON', 'COIN', 'GRAPES', 'COIN', 'WILD', 'SCATTER', 'HORSESHOE', 'JACK', 'QUEEN', 'KING',
    'ACE', 'ACE', 'BELL', 'BELL', 'MELON', 'GRAPES', 'SEVEN', 'DIAMOND', 'COIN', 'HORSESHOE',
    'JACK', 'COIN', 'QUEEN', 'KING', 'ACE', 'WILD', 'GOLDBAR', 'BELL', 'MELON', 'GRAPES',
    'COIN', 'SCATTER', 'SEVEN', 'DIAMOND', 'ACE', 'KING', 'QUEEN', 'JACK', 'HORSESHOE', 'WILD',
  ],
  // Reel 4
  [
    'JACK', 'JACK', 'QUEEN', 'KING', 'ACE', 'GOLDBAR', 'GOLDBAR', 'SEVEN', 'DIAMOND', 'BELL',
    'MELON', 'COIN', 'GRAPES', 'COIN', 'WILD', 'SCATTER', 'HORSESHOE', 'JACK', 'QUEEN', 'KING',
    'ACE', 'COIN', 'BELL', 'MELON', 'SEVEN', 'DIAMOND', 'COIN', 'HORSESHOE', 'GOLDBAR', 'WILD',
    'QUEEN', 'QUEEN', 'JACK', 'KING', 'ACE', 'BELL', 'BELL', 'MELON', 'GRAPES', 'SEVEN',
    'COIN', 'SCATTER', 'DIAMOND', 'HORSESHOE', 'ACE', 'KING', 'QUEEN', 'JACK', 'GOLDBAR', 'WILD',
  ],
  // Reel 5
  [
    'ACE', 'ACE', 'KING', 'KING', 'QUEEN', 'JACK', 'SEVEN', 'SEVEN', 'DIAMOND', 'DIAMOND',
    'GOLDBAR', 'BELL', 'BELL', 'MELON', 'GRAPES', 'COIN', 'WILD', 'SCATTER', 'HORSESHOE', 'JACK',
    'QUEEN', 'COIN', 'KING', 'ACE', 'BELL', 'MELON', 'COIN', 'GRAPES', 'SEVEN', 'DIAMOND',
    'COIN', 'HORSESHOE', 'GOLDBAR', 'WILD', 'JACK', 'JACK', 'QUEEN', 'KING', 'ACE', 'BELL',
    'COIN', 'SCATTER', 'SEVEN', 'DIAMOND', 'ACE', 'KING', 'QUEEN', 'JACK', 'HORSESHOE', 'WILD',
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
    tickerText: '★ 24K GOLD & CASH VAULT ★ 40 HIGH-ROLLER PAYLINES ★ HIT 6 MINTED BULLION COINS FOR FORT KNOX CASH LINK ★ 3 VAULT SCATTERS AWARD 10 FREE SPINS AT 3X MULTIPLIER ★ RISK WINS IN VIDEO POKER DOUBLE-UP ★ 95.8% RTP CERTIFIED ★ GOOD LUCK HIGH ROLLER! ★',
    tickerFreeSpinsText: '🔥🔥🔥 PENTHOUSE CASH RUSH ACTIVE • ALL PAYLINE WINS TRIPLED (3X) • RAINING $100 BILLS 🔥🔥🔥',
    feverTitle: 'MOLTEN GOLD OVERDRIVE',
    feverSubtitle: 'CHARGE WITH WINS',
    spinButtonLabel: 'SPIN',
  },
};
