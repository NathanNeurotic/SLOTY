import type { Payline } from './types';

export const PAYLINES: Payline[] = [
  [1, 1, 1, 1, 1], // 1: Middle horizontal
  [0, 0, 0, 0, 0], // 2: Top horizontal
  [2, 2, 2, 2, 2], // 3: Bottom horizontal
  [0, 1, 2, 1, 0], // 4: V-shape
  [2, 1, 0, 1, 2], // 5: Inverted V-shape
  [0, 0, 1, 2, 2], // 6: Descending diagonal step
  [2, 2, 1, 0, 0], // 7: Ascending diagonal step
  [1, 0, 0, 0, 1], // 8: Upper shallow cup
  [1, 2, 2, 2, 1], // 9: Lower shallow dome
  [0, 1, 0, 1, 0], // 10: Top zigzag
  [2, 1, 2, 1, 2], // 11: Bottom zigzag
  [1, 0, 1, 0, 1], // 12: Upper wave
  [1, 2, 1, 2, 1], // 13: Lower wave
  [0, 1, 1, 1, 0], // 14: High arch
  [2, 1, 1, 1, 2], // 15: Low arch
  [0, 0, 1, 0, 0], // 16: Center dip from top
  [2, 2, 1, 2, 2], // 17: Center peak from bottom
  [1, 1, 0, 1, 1], // 18: Upper bump
  [1, 1, 2, 1, 1], // 19: Lower dip
  [0, 2, 0, 2, 0], // 20: Full zigzag
];

export const PAYLINE_COLORS = [
  '#FF007F', // Neon Magenta
  '#00F0FF', // Neon Cyan
  '#FFD700', // Gold
  '#10B981', // Emerald
  '#A855F7', // Purple
  '#F97316', // Orange
  '#EC4899', // Pink
  '#3B82F6', // Blue
  '#84CC16', // Lime
  '#EAB308', // Yellow
  '#06B6D4', // Teal
  '#8B5CF6', // Violet
  '#F43F5E', // Rose
  '#14B8A6', // Cyan-Green
  '#6366F1', // Indigo
  '#D946EF', // Fuchsia
  '#22C55E', // Green
  '#FB923C', // Light Orange
  '#38BDF8', // Sky Blue
  '#E11D48', // Crimson
];
