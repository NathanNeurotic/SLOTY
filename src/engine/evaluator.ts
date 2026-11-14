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
import { VAULT_REEL_STRIPS } from '../games/vault24k/vaultDefinition';

// Reel strips are SLOTY's own free-play math model (see test-engine.ts for measured profiles)
const REEL_STRIPS: SymbolId[][] = VAULT_REEL_STRIPS;

// Dynamic reels x dynamic rows (5x4 Vault, 5x3 Timberland, 6x5 Pixel Arcade)
export function generateRandomGrid(gameDef?: GameDefinition): SymbolGrid {
  const activeDef = gameDef || getGame(DEFAULT_GAME_ID);
  const rows = activeDef.rows;
  const numReels = activeDef.reels || 5;
  const strips = activeDef.reelStrips;
  const grid: SymbolGrid = [];

  for (let reel = 0; reel < numReels; reel++) {
    const strip = strips[reel] || REEL_STRIPS[reel % REEL_STRIPS.length];
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

  if (scenario === 'MYSTERY_PICK') {
    return [
      ['GOLDBAR', 'JACK', 'QUEEN', 'KING'],
      ['BELL', 'MELON', 'ACE', 'CHERRY'],
      ['GRAPES', 'GOLDBAR', 'DIAMOND', 'JACK'],
      ['HORSESHOE', 'BELL', 'SEVEN', 'QUEEN'],
      ['ACE', 'KING', 'GOLDBAR', 'MELON'],
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

  // Bonus roles come from the active game's definition — no per-game ID lists here.
  const isWild = (sym: SymbolId) => sym === activeDef.wildId;
  const isScatter = (sym: SymbolId) => sym === activeDef.scatterId;
  const isCoin = (sym: SymbolId) => sym === activeDef.coinId;

  const lineBet = Math.max(1, Math.floor(totalBet / activePaylinesCount));
  const winningLines: WinningLine[] = [];
  let totalPayout = 0;
  const numReels = activeDef.reels || 5;

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
    for (let i = 0; i < payline.length; i++) {
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

    for (let reel = 0; reel < payline.length; reel++) {
      const currentSym = lineSymbols[reel];
      if (currentSym === targetSymbol || isWild(currentSym)) {
        matchCount++;
        coords.push([reel, payline[reel]]);
      } else {
        break;
      }
    }

    if (matchCount >= 2) {
      const symbolDef = symbolsMap[targetSymbol];
      if (symbolDef) {
        const payoutMultiplier = (symbolDef.payouts as Record<number, number>)[matchCount] || 0;
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
  for (let reel = 0; reel < numReels; reel++) {
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
    const scatterDef = symbolsMap[activeDef.scatterId];
    const scatterMultiplier = (scatterDef?.payouts as Record<number, number>)?.[Math.min(numReels, scatterCount)] || 50;
    const scatterPayout = totalBet * (scatterMultiplier / 10) * winMultiplier;
    totalPayout += scatterPayout;
  }

  // 3. Evaluate Cash Orbs / Coins (Hold & Spin)
  let coinCount = 0;
  const coinCoords: [number, number][] = [];
  for (let reel = 0; reel < numReels; reel++) {
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
