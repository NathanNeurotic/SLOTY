import type {
  DebugScenario,
  Payline,
  SpinResult,
  SymbolGrid,
  SymbolId,
  WinningLine,
  WinTier,
} from './types';
import { SYMBOLS, WEIGHTED_SYMBOL_POOL } from './symbols';
import { PAYLINES } from './paylines';

export function generateRandomGrid(): SymbolGrid {
  const grid: SymbolGrid = [];
  for (let reel = 0; reel < 5; reel++) {
    const reelSymbols: SymbolId[] = [];
    for (let row = 0; row < 3; row++) {
      const randomIndex = Math.floor(Math.random() * WEIGHTED_SYMBOL_POOL.length);
      reelSymbols.push(WEIGHTED_SYMBOL_POOL[randomIndex]);
    }
    grid.push(reelSymbols);
  }
  return grid;
}

export function generateForcedGrid(scenario: DebugScenario): SymbolGrid {
  if (scenario === 'FIVE_WILDS') {
    return [
      ['WILD', 'WILD', 'CHERRY'],
      ['WILD', 'WILD', 'PLUM'],
      ['WILD', 'WILD', 'MELON'],
      ['WILD', 'WILD', 'BELL'],
      ['WILD', 'WILD', 'SEVEN'],
    ];
  }

  if (scenario === 'FIVE_DIAMONDS') {
    return [
      ['CHERRY', 'DIAMOND', 'PLUM'],
      ['MELON', 'DIAMOND', 'BELL'],
      ['PLUM', 'DIAMOND', 'CHERRY'],
      ['BELL', 'DIAMOND', 'MELON'],
      ['SEVEN', 'DIAMOND', 'PLUM'],
    ];
  }

  if (scenario === 'FIVE_SEVENS') {
    return [
      ['SEVEN', 'CHERRY', 'PLUM'],
      ['SEVEN', 'MELON', 'BELL'],
      ['SEVEN', 'PLUM', 'CHERRY'],
      ['SEVEN', 'BELL', 'MELON'],
      ['SEVEN', 'PLUM', 'BELL'],
    ];
  }

  if (scenario === 'FREE_SPINS') {
    return [
      ['SCATTER', 'CHERRY', 'PLUM'],
      ['MELON', 'BELL', 'CHERRY'],
      ['PLUM', 'SCATTER', 'MELON'],
      ['BELL', 'CHERRY', 'PLUM'],
      ['CHERRY', 'MELON', 'SCATTER'],
    ];
  }

  if (scenario === 'NEAR_MISS') {
    // 2 scatters on reels 0 and 1, triggers excitement anticipation for reels 2, 3, 4
    return [
      ['SCATTER', 'CHERRY', 'PLUM'],
      ['MELON', 'SCATTER', 'BELL'],
      ['PLUM', 'BELL', 'MELON'],
      ['BELL', 'CHERRY', 'PLUM'],
      ['CHERRY', 'MELON', 'BELL'],
    ];
  }

  if (scenario === 'BIG_WIN') {
    return [
      ['BELL', 'HORSESHOE', 'CHERRY'],
      ['BELL', 'HORSESHOE', 'PLUM'],
      ['BELL', 'HORSESHOE', 'MELON'],
      ['BELL', 'HORSESHOE', 'BELL'],
      ['CHERRY', 'PLUM', 'MELON'],
    ];
  }

  if (scenario === 'NO_WIN') {
    return [
      ['CHERRY', 'PLUM', 'MELON'],
      ['BELL', 'SEVEN', 'DIAMOND'],
      ['HORSESHOE', 'CHERRY', 'PLUM'],
      ['BELL', 'SEVEN', 'DIAMOND'],
      ['HORSESHOE', 'BELL', 'SEVEN'],
    ];
  }

  return generateRandomGrid();
}

export function evaluateSpin(
  grid: SymbolGrid,
  totalBet: number,
  activePaylinesCount: number = 20,
  winMultiplier: number = 1
): SpinResult {
  const lineBet = Math.max(1, Math.floor(totalBet / activePaylinesCount));
  const winningLines: WinningLine[] = [];
  let totalPayout = 0;

  // 1. Evaluate Line Wins
  for (let lineIdx = 0; lineIdx < Math.min(activePaylinesCount, PAYLINES.length); lineIdx++) {
    const payline: Payline = PAYLINES[lineIdx];
    const lineSymbols: SymbolId[] = payline.map((row, reel) => grid[reel][row]);

    // Exclude scatter from paylines - scatters pay anywhere
    if (lineSymbols[0] === 'SCATTER') {
      continue;
    }

    // Determine target symbol: first non-wild symbol from left, or WILD if all wilds
    let targetSymbol: SymbolId = lineSymbols[0];
    for (let i = 0; i < 5; i++) {
      if (lineSymbols[i] !== 'WILD') {
        targetSymbol = lineSymbols[i];
        break;
      }
    }

    // If target ended up being scatter, this line cannot form a regular payline
    if (targetSymbol === 'SCATTER') {
      continue;
    }

    // Count consecutive matching symbols from reel 0
    let matchCount = 0;
    const coords: [number, number][] = [];

    for (let reel = 0; reel < 5; reel++) {
      const currentSym = lineSymbols[reel];
      if (currentSym === targetSymbol || currentSym === 'WILD') {
        matchCount++;
        coords.push([reel, payline[reel]]);
      } else {
        break; // Left-to-right requirement broken
      }
    }

    if (matchCount >= 3) {
      const symbolDef = SYMBOLS[targetSymbol];
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

  // 2. Evaluate Scatters
  let scatterCount = 0;
  const scatterCoords: [number, number][] = [];
  for (let reel = 0; reel < 5; reel++) {
    for (let row = 0; row < 3; row++) {
      if (grid[reel][row] === 'SCATTER') {
        scatterCount++;
        scatterCoords.push([reel, row]);
      }
    }
  }

  const isFreeSpinsTriggered = scatterCount >= 3;
  if (isFreeSpinsTriggered) {
    const scatterDef = SYMBOLS.SCATTER;
    const scatterMultiplier = scatterDef.payouts[Math.min(5, scatterCount) as 3 | 4 | 5] || 50;
    const scatterPayout = totalBet * (scatterMultiplier / 10) * winMultiplier;
    totalPayout += scatterPayout;
  }

  // 3. Determine Win Tier
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
    totalPayout: Math.round(totalPayout),
    isFreeSpinsTriggered,
    winTier,
  };
}
