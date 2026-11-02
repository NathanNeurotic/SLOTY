import type { Payline } from '../../engine/types';

// 25 Classic 5-Reel x 3-Row Casino Paylines (Rows 0, 1, 2)
export const TIMBER_PAYLINES: Payline[] = [
  // 1-3: Horizontals
  [1, 1, 1, 1, 1], // 1: Center row
  [0, 0, 0, 0, 0], // 2: Top row
  [2, 2, 2, 2, 2], // 3: Bottom row

  // 4-5: Standard V and Inverted V
  [0, 1, 2, 1, 0], // 4: V-shape
  [2, 1, 0, 1, 2], // 5: Inverted V-shape

  // 6-7: Diagonals & Steps
  [0, 0, 1, 2, 2], // 6
  [2, 2, 1, 0, 0], // 7

  // 8-11: Valley & Peak shapes
  [1, 0, 0, 0, 1], // 8
  [1, 2, 2, 2, 1], // 9
  [0, 1, 0, 1, 0], // 10
  [2, 1, 2, 1, 2], // 11

  // 12-15: Alternating Zigzags
  [1, 0, 1, 0, 1], // 12
  [1, 2, 1, 2, 1], // 13
  [0, 1, 1, 1, 0], // 14
  [2, 1, 1, 1, 2], // 15

  // 16-19: Center dips & jumps
  [0, 0, 1, 0, 0], // 16
  [2, 2, 1, 2, 2], // 17
  [1, 1, 0, 1, 1], // 18
  [1, 1, 2, 1, 1], // 19

  // 20-25: Extreme corners & deep swings
  [0, 2, 0, 2, 0], // 20
  [2, 0, 2, 0, 2], // 21
  [0, 2, 2, 2, 0], // 22
  [2, 0, 0, 0, 2], // 23
  [0, 0, 2, 0, 0], // 24
  [2, 2, 0, 2, 2], // 25
];

export const TIMBER_PAYLINE_COLORS = [
  '#10B981', '#34D399', '#F59E0B', '#F97316', '#EF4444',
  '#8B5CF6', '#38BDF8', '#84CC16', '#EAB308', '#EC4899',
  '#06B6D4', '#6366F1', '#14B8A6', '#D97706', '#A855F7',
  '#F43F5E', '#22C55E', '#E11D48', '#2563EB', '#CA8A04',
  '#059669', '#7C3AED', '#DB2777', '#0284C7', '#4ADE80',
];
