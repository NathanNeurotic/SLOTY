import type { ProgressionState } from './types';

export function getMaxBetForLevel(level: number): number {
  // Max bet scales every 2 levels, capped at 1,000,000
  return Math.min(1000000, 500 * Math.pow(2, Math.floor((level - 1) / 2)));
}

// XP delta needed to advance from level to level + 1.
// Directly anchors XP requirement to maxBet * spinsNeeded, so that no matter how high
// the stakes get (from 500 up to 1,000,000 chips), advancing a level ALWAYS requires
// 20-50 spins at early levels, and 60-120 spins at high levels.
export function getXpDeltaForLevel(level: number): number {
  const currentMaxBet = getMaxBetForLevel(level);
  // Pacing: starts at 18 spins at level 1, growing to 100+ spins at high levels
  const spinsNeeded = Math.min(120, 18 + Math.floor(level * 4.2));
  return currentMaxBet * spinsNeeded;
}

export function getXpRequiredForLevel(targetLevel: number): number {
  if (targetLevel <= 1) return 0;
  let cumulative = 0;
  for (let l = 1; l < targetLevel; l++) {
    cumulative += getXpDeltaForLevel(l);
  }
  return cumulative;
}

export function calculateProgression(totalXp: number): ProgressionState {
  let level = 1;
  while (totalXp >= getXpRequiredForLevel(level + 1)) {
    level++;
    if (level >= 300) break; // Hard safety clamp
  }

  const xpForCurrentLevel = getXpRequiredForLevel(level);
  const xpForNextLevel = getXpRequiredForLevel(level + 1);
  const xpNeededThisLevel = Math.max(1, xpForNextLevel - xpForCurrentLevel);
  const currentLevelProgress = Math.max(0, totalXp - xpForCurrentLevel);
  const progressPercent = Math.min(100, Math.floor((currentLevelProgress / xpNeededThisLevel) * 100));
  const maxBet = getMaxBetForLevel(level);

  return {
    level,
    xp: totalXp,
    xpForCurrentLevel,
    xpForNextLevel,
    progressPercent,
    maxBet,
  };
}

export function getLevelUpReward(level: number): number {
  // Reward scales with level progression
  return Math.min(1000000, level * 5000);
}
