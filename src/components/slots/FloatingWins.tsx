import React from 'react';
import type { WinningLine } from '../../engine/types';
import { Coins, Star } from 'lucide-react';

interface FloatingWinsProps {
  activeWin: WinningLine | null;
  isTimber?: boolean;
}

export const FloatingWins: React.FC<FloatingWinsProps> = ({ activeWin, isTimber = false }) => {
  if (!activeWin || activeWin.coords.length === 0) return null;

  // Find center-most coordinate of the winning sequence to anchor the main payout banner
  const midCoordIdx = Math.floor(activeWin.coords.length / 2);
  const [midReel, midRow] = activeWin.coords[midCoordIdx] || [2, 1];

  const mainLeftPercent = (midReel + 0.5) * 20;
  const mainTopPercent = (midRow + 0.5) * 25;

  return (
    <div className="absolute inset-0 pointer-events-none z-30 overflow-visible">
      {/* 1. Dynamic Coin / Acorn Fountain Bursts from every winning coordinate */}
      {activeWin.coords.map(([r, row], idx) => {
        const leftPct = (r + 0.5) * 20;
        const topPct = (row + 0.5) * 25;

        // Generate 3 energetic flying particles per symbol hit
        const particles = isTimber
          ? [
              { key: 'c1', tx: -30, ty: -65, delay: idx * 50, icon: '🌰' },
              { key: 'c2', tx: 30, ty: -75, delay: idx * 50 + 70, icon: '🍃' },
              { key: 'c3', tx: 0, ty: -85, delay: idx * 50 + 120, icon: '⭐' },
            ]
          : [
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
            {/* Glowing Golden / Emerald Energy Halo */}
            <div className={`absolute w-16 h-16 sm:w-20 sm:h-20 -left-8 -top-8 sm:-left-10 sm:-top-10 rounded-full blur-md animate-ping ${
              isTimber ? 'bg-emerald-400/40 shadow-[0_0_20px_#34D399]' : 'bg-amber-400/30 shadow-[0_0_20px_#F59E0B]'
            }`} />

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
        <div className={`flex items-center space-x-1.5 px-3.5 py-1.5 rounded-full font-black text-xs sm:text-base border-2 whitespace-nowrap animate-pulse ${
          isTimber
            ? 'bg-gradient-to-r from-emerald-500 via-teal-400 to-amber-400 text-black border-emerald-200 shadow-[0_0_25px_rgba(52,211,153,1)]'
            : 'gold-gradient-bg text-black border-yellow-200 shadow-[0_0_25px_rgba(245,158,11,1)]'
        }`}>
          <Star className="w-4 h-4 fill-amber-950 text-amber-950 animate-spin" />
          <span className="tracking-wide">
            {isTimber ? '🌲 ' : '★ '}
            LINE {activeWin.lineIndex + 1}: +{activeWin.payout.toLocaleString()}
            {isTimber ? ' ACORNS 🌲' : ' COINS ★'}
          </span>
          <Coins className="w-4 h-4 fill-amber-950 text-amber-950" />
        </div>
      </div>
    </div>
  );
};
