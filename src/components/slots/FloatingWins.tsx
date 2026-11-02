import React from 'react';
import type { WinningLine } from '../../engine/types';
import { Coins, Sparkles } from 'lucide-react';

interface FloatingWinsProps {
  activeWin: WinningLine | null;
}

export const FloatingWins: React.FC<FloatingWinsProps> = ({ activeWin }) => {
  if (!activeWin || activeWin.coords.length === 0) return null;

  // Find center-most coordinate of the winning sequence to anchor the floating badge
  const midCoordIdx = Math.floor(activeWin.coords.length / 2);
  const [reel, row] = activeWin.coords[midCoordIdx] || [2, 1];

  // 5 reels = 20% width each, 4 rows = 25% height each
  const leftPercent = (reel + 0.5) * 20;
  const topPercent = (row + 0.5) * 25;

  return (
    <div
      key={`${activeWin.lineIndex}-${activeWin.payout}`}
      style={{
        left: `${leftPercent}%`,
        top: `${topPercent}%`,
      }}
      className="absolute pointer-events-none z-30 animate-float-score"
    >
      <div className="flex items-center space-x-1 px-3 py-1 rounded-full gold-gradient-bg text-black font-black text-xs sm:text-sm shadow-[0_0_20px_rgba(245,158,11,0.9)] border border-yellow-200 whitespace-nowrap">
        <Sparkles className="w-3.5 h-3.5 fill-black text-black animate-spin" />
        <span>+{activeWin.payout.toLocaleString()}</span>
        <Coins className="w-3.5 h-3.5 fill-black text-black" />
      </div>
    </div>
  );
};
