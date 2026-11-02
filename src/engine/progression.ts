import type { ProgressionState } from './types';

export function getXpRequiredForLevel(level: number): number {
  if (level <= 1) return 0;
  // Cumulative XP needed to reach this level
  return Math.floor(1000 * Math.pow(level - 1, 1.4));
}

export function calculateProgression(totalXp: number): ProgressionState {
  let level = 1;
  while (totalXp >= getXpRequiredForLevel(level + 1)) {
    level++;
  }

  const xpForCurrentLevel = getXpRequiredForLevel(level);
  const xpForNextLevel = getXpRequiredForLevel(level + 1);
  const xpNeededThisLevel = xpForNextLevel - xpForCurrentLevel;
  const currentLevelProgress = Math.max(0, totalXp - xpForCurrentLevel);
  const progressPercent = Math.min(100, Math.floor((currentLevelProgress / xpNeededThisLevel) * 100));

  // Max bet increases with level
  const maxBet = Math.min(1000000, 500 * Math.pow(2, Math.floor((level - 1) / 2)));

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
  return level * 3000;
}
