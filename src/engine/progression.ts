import type { ProgressionState } from './types';

// Base XP needed to advance from Level 1 to Level 2
const BASE_LEVEL_XP = 2500;
// Pacing multiplier: XP required per level grows geometrically by 42% each level.
// This matches the exponential growth of maxBet (which doubles every 2 levels = sqrt(2) ≈ 1.4142),
// ensuring that reaching the next level always requires 15-30 normal spins or 6-8 max-bet spins,
// and completely prevents jumping multiple levels in a single spin.
const LEVEL_GROWTH_RATE = 0.42;

export function getXpRequiredForLevel(targetLevel: number): number {
  if (targetLevel <= 1) return 0;
  // Cumulative XP needed to reach targetLevel using geometric series sum:
  // S_n = D_1 * ((1 + r)^n - 1) / r, where n = targetLevel - 1
  const n = targetLevel - 1;
  const cumulative = (BASE_LEVEL_XP * (Math.pow(1 + LEVEL_GROWTH_RATE, n) - 1)) / LEVEL_GROWTH_RATE;
  return Math.floor(cumulative);
}

export function calculateProgression(totalXp: number): ProgressionState {
  let level = 1;
  // Find current level based on cumulative XP thresholds
  while (totalXp >= getXpRequiredForLevel(level + 1)) {
    level++;
    if (level >= 300) break; // Hard safety clamp
  }

  const xpForCurrentLevel = getXpRequiredForLevel(level);
  const xpForNextLevel = getXpRequiredForLevel(level + 1);
  const xpNeededThisLevel = Math.max(1, xpForNextLevel - xpForCurrentLevel);
  const currentLevelProgress = Math.max(0, totalXp - xpForCurrentLevel);
  const progressPercent = Math.min(100, Math.floor((currentLevelProgress / xpNeededThisLevel) * 100));

  // Max bet doubles every 2 levels, capped at 1,000,000
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
  // Reward scales with level progression
  return Math.min(500000, level * 3500);
}
