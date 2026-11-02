import type {
  DebugScenario,
  Payline,
  SpinResult,
  SymbolGrid,
  SymbolId,
  WinningLine,
  WinTier,
} from './types';
import type { GameDefinition } from '../games/types';
import { getGame, DEFAULT_GAME_ID } from '../games/gameRegistry';

// Realistic 50-stop reel strips with authentic Vegas symbol distribution and stacks
const REEL_STRIPS: SymbolId[][] = [
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

// 5 reels x dynamic rows (4 for 24K Vault, 3 for Timberland Critters)
export function generateRandomGrid(gameDef?: GameDefinition): SymbolGrid {
  const activeDef = gameDef || getGame(DEFAULT_GAME_ID);
  const rows = activeDef.rows;
  const strips = activeDef.reelStrips;
  const grid: SymbolGrid = [];

  for (let reel = 0; reel < 5; reel++) {
    const strip = strips[reel] || REEL_STRIPS[reel];
    const stopIndex = Math.floor(Math.random() * strip.length);
    const reelSymbols: SymbolId[] = [];
    for (let row = 0; row < rows; row++) {
      const symIndex = (stopIndex + row) % strip.length;
      reelSymbols.push(strip[symIndex]);
    }
    grid.push(reelSymbols);
  }
  return grid;
}

export function generateForcedGrid(scenario: DebugScenario): SymbolGrid {
  if (scenario === 'FIVE_WILDS') {
    return [
      ['WILD', 'WILD', 'BELL', 'JACK'],
      ['WILD', 'WILD', 'MELON', 'QUEEN'],
      ['WILD', 'WILD', 'SEVEN', 'KING'],
      ['WILD', 'WILD', 'DIAMOND', 'ACE'],
      ['WILD', 'WILD', 'GOLDBAR', 'GRAPES'],
    ];
  }

  if (scenario === 'FIVE_DIAMONDS') {
    return [
      ['JACK', 'DIAMOND', 'QUEEN', 'KING'],
      ['BELL', 'DIAMOND', 'MELON', 'ACE'],
      ['GOLDBAR', 'DIAMOND', 'GRAPES', 'JACK'],
      ['HORSESHOE', 'DIAMOND', 'SEVEN', 'QUEEN'],
      ['ACE', 'DIAMOND', 'BELL', 'KING'],
    ];
  }

  if (scenario === 'FIVE_SEVENS') {
    return [
      ['SEVEN', 'JACK', 'QUEEN', 'KING'],
      ['SEVEN', 'BELL', 'MELON', 'ACE'],
      ['SEVEN', 'GOLDBAR', 'GRAPES', 'JACK'],
      ['SEVEN', 'HORSESHOE', 'DIAMOND', 'QUEEN'],
      ['SEVEN', 'ACE', 'BELL', 'KING'],
    ];
  }

  if (scenario === 'FREE_SPINS') {
    return [
      ['SCATTER', 'JACK', 'QUEEN', 'KING'],
      ['BELL', 'MELON', 'GOLDBAR', 'ACE'],
      ['GRAPES', 'SCATTER', 'DIAMOND', 'JACK'],
      ['HORSESHOE', 'BELL', 'SEVEN', 'QUEEN'],
      ['ACE', 'KING', 'SCATTER', 'MELON'],
    ];
  }

  if (scenario === 'HOLD_AND_SPIN') {
    return [
      ['COIN', 'JACK', 'QUEEN', 'COIN'],
      ['BELL', 'COIN', 'MELON', 'ACE'],
      ['GRAPES', 'BELL', 'COIN', 'JACK'],
      ['COIN', 'HORSESHOE', 'SEVEN', 'QUEEN'],
      ['ACE', 'KING', 'COIN', 'MELON'],
    ];
  }

  if (scenario === 'NEAR_MISS') {
    return [
      ['SCATTER', 'JACK', 'QUEEN', 'KING'],
      ['BELL', 'SCATTER', 'MELON', 'ACE'],
      ['GRAPES', 'BELL', 'DIAMOND', 'JACK'],
      ['HORSESHOE', 'BELL', 'SEVEN', 'QUEEN'],
      ['ACE', 'KING', 'GOLDBAR', 'MELON'],
    ];
  }

  if (scenario === 'BIG_WIN') {
    return [
      ['GOLDBAR', 'BELL', 'HORSESHOE', 'MELON'],
      ['GOLDBAR', 'BELL', 'HORSESHOE', 'MELON'],
      ['GOLDBAR', 'BELL', 'HORSESHOE', 'MELON'],
      ['GOLDBAR', 'BELL', 'HORSESHOE', 'MELON'],
      ['JACK', 'QUEEN', 'KING', 'ACE'],
    ];
  }

  if (scenario === 'NO_WIN') {
    return [
      ['ACE', 'KING', 'QUEEN', 'JACK'],
      ['BELL', 'SEVEN', 'DIAMOND', 'GOLDBAR'],
      ['MELON', 'GRAPES', 'HORSESHOE', 'BELL'],
      ['ACE', 'KING', 'QUEEN', 'JACK'],
      ['BELL', 'SEVEN', 'DIAMOND', 'GOLDBAR'],
    ];
  }

  return generateRandomGrid();
}

export function evaluateSpin(
  grid: SymbolGrid,
  totalBet: number,
  activePaylinesCount: number = 40,
  winMultiplier: number = 1,
  gameDef?: GameDefinition
): SpinResult {
  const activeDef = gameDef || getGame(DEFAULT_GAME_ID);
  const paylines = activeDef.paylines;
  const symbolsMap = activeDef.symbols;
  const rowCount = activeDef.rows;

  const isWild = (sym: SymbolId) => sym === 'WILD' || sym === 'BEAR';
  const isScatter = (sym: SymbolId) => sym === 'SCATTER' || sym === 'OWL';
  const isCoin = (sym: SymbolId) => sym === 'COIN' || sym === 'ACORN';

  const lineBet = Math.max(1, Math.floor(totalBet / activePaylinesCount));
  const winningLines: WinningLine[] = [];
  let totalPayout = 0;

  // 1. Evaluate Line Wins (Left to Right)
  for (let lineIdx = 0; lineIdx < Math.min(activePaylinesCount, paylines.length); lineIdx++) {
    const payline: Payline = paylines[lineIdx];
    const lineSymbols: SymbolId[] = payline.map((row, reel) => grid[reel]?.[row]);

    // Scatters and Coins do not pay on paylines; they pay as bonus scatters
    if (!lineSymbols[0] || isScatter(lineSymbols[0]) || isCoin(lineSymbols[0])) {
      continue;
    }

    // Determine target symbol: first non-wild from left
    let targetSymbol: SymbolId = lineSymbols[0];
    for (let i = 0; i < 5; i++) {
      if (!isWild(lineSymbols[i])) {
        targetSymbol = lineSymbols[i];
        break;
      }
    }

    if (isScatter(targetSymbol) || isCoin(targetSymbol)) {
      continue;
    }

    // Count consecutive matching symbols from reel 0
    let matchCount = 0;
    const coords: [number, number][] = [];

    for (let reel = 0; reel < 5; reel++) {
      const currentSym = lineSymbols[reel];
      if (currentSym === targetSymbol || isWild(currentSym)) {
        matchCount++;
        coords.push([reel, payline[reel]]);
      } else {
        break;
      }
    }

    if (matchCount >= 3) {
      const symbolDef = symbolsMap[targetSymbol];
      if (symbolDef) {
        const payoutMultiplier = symbolDef.payouts[matchCount as 3 | 4 | 5] || 0;
        if (payoutMultiplier > 0) {
          const linePayout = lineBet * payoutMultiplier * winMultiplier;
          totalPayout += linePayout;
          winningLines.push({
            lineIndex: lineIdx,
            symbolId: targetSymbol,
            count: matchCount,
            coords,
            multiplier: payoutMultiplier,
            payout: linePayout,
          });
        }
      }
    }
  }

  // 2. Evaluate Scatters (Free Spins)
  let scatterCount = 0;
  const scatterCoords: [number, number][] = [];
  for (let reel = 0; reel < 5; reel++) {
    for (let row = 0; row < rowCount; row++) {
      const sym = grid[reel]?.[row];
      if (sym && isScatter(sym)) {
        scatterCount++;
        scatterCoords.push([reel, row]);
      }
    }
  }

  const isFreeSpinsTriggered = scatterCount >= 3;
  if (isFreeSpinsTriggered) {
    const scatterDef = symbolsMap['SCATTER'] || symbolsMap['OWL'];
    const scatterMultiplier = scatterDef?.payouts[Math.min(5, scatterCount) as 3 | 4 | 5] || 50;
    const scatterPayout = totalBet * (scatterMultiplier / 10) * winMultiplier;
    totalPayout += scatterPayout;
  }

  // 3. Evaluate Cash Orbs / Coins (Hold & Spin)
  let coinCount = 0;
  const coinCoords: [number, number][] = [];
  for (let reel = 0; reel < 5; reel++) {
    for (let row = 0; row < rowCount; row++) {
      const sym = grid[reel]?.[row];
      if (sym && isCoin(sym)) {
        coinCount++;
        coinCoords.push([reel, row]);
      }
    }
  }

  // 6 or more coins trigger Deluxe Casino style Hold & Spin Cash Respins
  const isHoldAndSpinTriggered = coinCount >= 6;

  // 4. Determine Win Tier
  let winTier: WinTier = 'NONE';
  if (totalPayout > 0) {
    const winRatio = totalPayout / totalBet;
    if (winRatio >= 50) {
      winTier = 'EPIC_JACKPOT';
    } else if (winRatio >= 25) {
      winTier = 'MEGA_WIN';
    } else if (winRatio >= 10) {
      winTier = 'BIG_WIN';
    } else {
      winTier = 'REGULAR';
    }
  }

  return {
    grid,
    winningLines,
    scatterCount,
    scatterCoords,
    coinCount,
    coinCoords,
    totalPayout: Math.round(totalPayout),
    isFreeSpinsTriggered,
    isHoldAndSpinTriggered,
    winTier,
  };
}
