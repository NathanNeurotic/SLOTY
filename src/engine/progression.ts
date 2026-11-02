import type { ProgressionState } from './types';

export function getMaxBetForLevel(level: number): number {
  // Max bet scales every 2 levels, capped at 1,000,000
  return Math.min(1000000, 500 * Math.pow(2, Math.floor((level - 1) / 2)));
}

// XP delta needed to advance from level to level + 1.
// Paced so Level 1 requires 20 spins at max bet (10,000 XP), and each subsequent
// level compounds by +15% spins, ensuring levels pace steadily apart
// and prevent multiple level-ups per spin.
export function getXpDeltaForLevel(level: number): number {
  const currentMaxBet = getMaxBetForLevel(level);
  const spinsNeeded = Math.round(20 * Math.pow(1.15, Math.max(0, level - 1)));
  return Math.max(10000, currentMaxBet * spinsNeeded);
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
  // Reward scales with 5x max bet for that level
  return Math.min(5000000, getMaxBetForLevel(level) * 5);
}
