import type { Payline } from '../../engine/types';

// 50 Paylines for 6 Reels x 5 Rows (row indices 0..4 across reels 0..5)
export const PIXEL_PAYLINES: Payline[] = [
  // 1-5: Center & Parallel Horizontals
  [2, 2, 2, 2, 2, 2], // 1: Middle row
  [1, 1, 1, 1, 1, 1], // 2: Upper mid row
  [3, 3, 3, 3, 3, 3], // 3: Lower mid row
  [0, 0, 0, 0, 0, 0], // 4: Top row
  [4, 4, 4, 4, 4, 4], // 5: Bottom row

  // 6-10: V-shapes & Inverted V-shapes
  [0, 1, 2, 3, 2, 1], // 6: Shallow V down
  [4, 3, 2, 1, 2, 3], // 7: Shallow V up
  [0, 1, 3, 4, 3, 1], // 8: Deep V down
  [4, 3, 1, 0, 1, 3], // 9: Deep inverted V
  [1, 2, 3, 4, 3, 2], // 10: Smooth valley

  // 11-15: Inverted Valleys & Pyramids
  [3, 2, 1, 0, 1, 2], // 11: Smooth hill
  [0, 2, 4, 4, 2, 0], // 12: U-trough
  [4, 2, 0, 0, 2, 4], // 13: Arch peak
  [1, 0, 1, 2, 1, 0], // 14: Top wave
  [3, 4, 3, 2, 3, 4], // 15: Bottom wave

  // 16-20: Zig-Zags & Sine Waves
  [1, 3, 1, 3, 1, 3], // 16: Sine wave mid-high
  [2, 4, 2, 4, 2, 4], // 17: Sine wave mid-low
  [0, 2, 0, 2, 0, 2], // 18: Top oscillation
  [2, 0, 2, 0, 2, 0], // 19: High inversion
  [3, 1, 3, 1, 3, 1], // 20: Counter sine

  // 21-25: Diagonals & Crossings
  [0, 1, 2, 3, 4, 4], // 21: Full downward descent
  [4, 3, 2, 1, 0, 0], // 22: Full upward ascent
  [1, 1, 2, 3, 4, 4], // 23: Stepped descent
  [3, 3, 2, 1, 0, 0], // 24: Stepped ascent
  [0, 0, 1, 3, 4, 4], // 25: Ski jump down

  // 26-30: Inverted Ski Jumps & Double Arches
  [4, 4, 3, 1, 0, 0], // 26: Ski jump up
  [2, 1, 0, 1, 2, 3], // 27: Asymmetrical dip
  [2, 3, 4, 3, 2, 1], // 28: Asymmetrical crest
  [1, 2, 1, 0, 1, 2], // 29: Crown ripple
  [3, 2, 3, 4, 3, 2], // 30: Inverted crown

  // 31-35: M and W Patterns
  [0, 3, 0, 3, 0, 3], // 31: Deep W high
  [4, 1, 4, 1, 4, 1], // 32: Deep M low
  [1, 4, 1, 4, 1, 4], // 33: W wave
  [3, 0, 3, 0, 3, 0], // 34: M wave
  [0, 2, 3, 3, 2, 0], // 35: Central bowl

  // 36-40: Central Plateau & Saddles
  [4, 2, 1, 1, 2, 4], // 36: Central dome
  [2, 0, 1, 3, 4, 2], // 37: S-curve down
  [2, 4, 3, 1, 0, 2], // 38: S-curve up
  [1, 3, 4, 3, 1, 0], // 39: Rising peak
  [3, 1, 0, 1, 3, 4], // 40: Falling valley

  // 41-45: Stepped Terraces
  [0, 0, 2, 2, 4, 4], // 41: Terrace down
  [4, 4, 2, 2, 0, 0], // 42: Terrace up
  [1, 1, 3, 3, 1, 1], // 43: Double flat dip
  [3, 3, 1, 1, 3, 3], // 44: Double flat peak
  [0, 1, 1, 3, 3, 4], // 45: Center slide

  // 46-50: Full Matrix Explorers
  [4, 3, 3, 1, 1, 0], // 46: Center climb
  [2, 2, 0, 4, 2, 2], // 47: Diamond split
  [1, 3, 2, 2, 3, 1], // 48: Eye shape
  [3, 1, 2, 2, 1, 3], // 49: Hourglass
  [0, 4, 0, 4, 0, 4], // 50: Grand extreme wave
];
