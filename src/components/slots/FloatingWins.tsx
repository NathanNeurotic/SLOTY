import React from 'react';
import type { WinningLine } from '../../engine/types';
import { Coins, Star } from 'lucide-react';

interface FloatingWinsProps {
  activeWin: WinningLine | null;
}

export const FloatingWins: React.FC<FloatingWinsProps> = ({ activeWin }) => {
  if (!activeWin || activeWin.coords.length === 0) return null;

  // Find center-most coordinate of the winning sequence to anchor the main payout banner
  const midCoordIdx = Math.floor(activeWin.coords.length / 2);
  const [midReel, midRow] = activeWin.coords[midCoordIdx] || [2, 1];

  const mainLeftPercent = (midReel + 0.5) * 20;
  const mainTopPercent = (midRow + 0.5) * 25;

  return (
    <div className="absolute inset-0 pointer-events-none z-30 overflow-visible">
      {/* 1. Dynamic Coin Fountain Bursts from every winning coordinate */}
      {activeWin.coords.map(([r, row], idx) => {
        const leftPct = (r + 0.5) * 20;
        const topPct = (row + 0.5) * 25;

        // Generate 3 energetic flying gold coins & sparkles per symbol hit
        const particles = [
          { key: 'c1', tx: -30, ty: -65, delay: idx * 50, icon: '🪙' },
          { key: 'c2', tx: 30, ty: -75, delay: idx * 50 + 70, icon: '✨' },
          { key: 'c3', tx: 0, ty: -85, delay: idx * 50 + 120, icon: '💎' },
        ];

        return (
          <div
            key={`win-burst-${r}-${row}-${idx}`}
            style={{ left: `${leftPct}%`, top: `${topPct}%` }}
            className="absolute transform -translate-x-1/2 -translate-y-1/2"
          >
            {/* Glowing Golden Energy Halo */}
            <div className="absolute w-16 h-16 sm:w-20 sm:h-20 -left-8 -top-8 sm:-left-10 sm:-top-10 rounded-full bg-amber-400/30 blur-md animate-ping" />

            {/* Flying fountain particles */}
            {particles.map((p) => (
              <div
                key={p.key}
                style={
                  {
                    '--tx': `${p.tx}px`,
                    '--ty': `${p.ty}px`,
                    animationDelay: `${p.delay}ms`,
                  } as React.CSSProperties
                }
                className="absolute text-base sm:text-xl animate-coin-burst filter drop-shadow-[0_0_8px_rgba(251,191,36,1)]"
              >
                {p.icon}
              </div>
            ))}
          </div>
        );
      })}

      {/* 2. Floating Payout Badge hovering over the center */}
      <div
        key={`banner-${activeWin.lineIndex}-${activeWin.payout}`}
        style={{
          left: `${mainLeftPercent}%`,
          top: `${mainTopPercent}%`,
        }}
        className="absolute transform -translate-x-1/2 -translate-y-1/2 animate-float-score z-40"
      >
        <div className="flex items-center space-x-1.5 px-3.5 py-1.5 rounded-full gold-gradient-bg text-black font-black text-xs sm:text-base shadow-[0_0_25px_rgba(245,158,11,1)] border-2 border-yellow-200 whitespace-nowrap animate-pulse">
          <Star className="w-4 h-4 fill-amber-950 text-amber-950 animate-spin" />
          <span className="tracking-wide">LINE {activeWin.lineIndex + 1}: +{activeWin.payout.toLocaleString()}</span>
          <Coins className="w-4 h-4 fill-amber-950 text-amber-950" />
        </div>
      </div>
    </div>
  );
};
