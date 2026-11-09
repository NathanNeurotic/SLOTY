import React, { useRef, useState, useEffect, useCallback } from 'react';
import type { WinningLine } from '../../engine/types';
import { Coins, Star, Gamepad2 } from 'lucide-react';
import type { GameId } from '../../games/types';

interface FloatingWinsProps {
  activeWin: WinningLine | null;
  isTimber?: boolean;
  isPixel?: boolean;
  rowCount?: number;
  reelsCount?: number;
  activeGameId?: GameId;
}

export const FloatingWins: React.FC<FloatingWinsProps> = ({
  activeWin,
  isTimber = false,
  isPixel = false,
  rowCount = 4,
  reelsCount = 5,
  activeGameId,
}) => {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const [, setTick] = useState(0);

  // Re-render once on mount to capture accurate DOM cell bounding rects
  useEffect(() => {
    const t = requestAnimationFrame(() => setTick((v) => v + 1));
    return () => cancelAnimationFrame(t);
  }, [activeWin]);

  const effectiveIsTimber = isTimber || activeGameId === 'timber-critters';
  const effectiveIsPixel = isPixel || activeGameId === 'pixel-arcade';
  const effectiveIsPs2 = activeGameId === 'ps2-legends';

  const getCellPosition = useCallback(
    (reel: number, row: number) => {
      if (containerRef.current && containerRef.current.parentElement) {
        const cell = containerRef.current.parentElement.querySelector(`[data-reel="${reel}"][data-row="${row}"]`);
        if (cell) {
          const cellRect = cell.getBoundingClientRect();
          const parentRect = containerRef.current.getBoundingClientRect();
          if (parentRect.width > 0 && parentRect.height > 0) {
            const rawLeft = cellRect.left - parentRect.left + cellRect.width / 2;
            const rawTop = cellRect.top - parentRect.top + cellRect.height / 2;
            const clampedLeft = Math.max(30, Math.min(parentRect.width - 30, rawLeft));
            const clampedTop = Math.max(28, Math.min(parentRect.height - 28, rawTop));
            return {
              left: `${clampedLeft}px`,
              top: `${clampedTop}px`,
            };
          }
        }
      }
      return {
        left: `${Math.max(10, Math.min(90, ((reel + 0.5) / reelsCount) * 100))}%`,
        top: `${Math.max(15, Math.min(85, ((row + 0.5) / rowCount) * 100))}%`,
      };
    },
    [reelsCount, rowCount]
  );

  if (!activeWin || activeWin.coords.length === 0) return null;

  // Find center-most coordinate of the winning sequence to anchor the main payout banner
  const midCoordIdx = Math.floor(activeWin.coords.length / 2);
  const [midReel, midRow] = activeWin.coords[midCoordIdx] || [
    Math.floor(reelsCount / 2),
    Math.floor(rowCount / 2),
  ];

  const mainPos = getCellPosition(midReel, midRow);

  return (
    <div
      ref={containerRef}
      className="absolute inset-1 sm:inset-2 pointer-events-none z-30 overflow-visible w-[calc(100%-8px)] sm:w-[calc(100%-16px)] h-[calc(100%-8px)] sm:h-[calc(100%-16px)]"
    >
      {/* 1. Dynamic Coin / Acorn / Token / Memory Particle Bursts */}
      {activeWin.coords.map(([r, row], idx) => {
        const pos = getCellPosition(r, row);

        // Generate 3 energetic flying particles per symbol hit
        const particles = effectiveIsPs2
          ? [
              { key: 'c1', tx: -30, ty: -65, delay: idx * 50, icon: '🎮' },
              { key: 'c2', tx: 30, ty: -75, delay: idx * 50 + 70, icon: '💾' },
              { key: 'c3', tx: 0, ty: -85, delay: idx * 50 + 120, icon: '💿' },
            ]
          : effectiveIsPixel
          ? [
              { key: 'c1', tx: -30, ty: -65, delay: idx * 50, icon: '👾' },
              { key: 'c2', tx: 30, ty: -75, delay: idx * 50 + 70, icon: '🪙' },
              { key: 'c3', tx: 0, ty: -85, delay: idx * 50 + 120, icon: '⚡' },
            ]
          : effectiveIsTimber
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
            style={{ left: pos.left, top: pos.top }}
            className="absolute transform -translate-x-1/2 -translate-y-1/2"
          >
            {/* Glowing Golden / Emerald / Neon Pink / Cobalt Blue Energy Halo */}
            <div
              className={`absolute w-16 h-16 sm:w-20 sm:h-20 -left-8 -top-8 sm:-left-10 sm:-top-10 rounded-full blur-md animate-ping ${
                effectiveIsPs2
                  ? 'bg-[#006FCD]/50 shadow-[0_0_20px_#00F0FF]'
                  : effectiveIsPixel
                  ? 'bg-pink-500/40 shadow-[0_0_20px_#EC4899]'
                  : effectiveIsTimber
                  ? 'bg-emerald-400/40 shadow-[0_0_20px_#34D399]'
                  : 'bg-amber-400/30 shadow-[0_0_20px_#F59E0B]'
              }`}
            />

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
                className="absolute text-base sm:text-xl animate-coin-burst filter drop-shadow-[0_0_8px_rgba(0,111,205,1)] font-mono"
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
          left: mainPos.left,
          top: mainPos.top,
        }}
        className="absolute transform -translate-x-1/2 -translate-y-1/2 animate-float-score z-40"
      >
        <div
          className={`flex items-center space-x-1.5 px-3.5 py-1.5 rounded-full font-black text-xs sm:text-base border-2 whitespace-nowrap animate-pulse ${
            effectiveIsPs2
              ? 'bg-gradient-to-r from-[#001026] via-[#006FCD] to-cyan-500 text-white border-cyan-300 shadow-[0_0_25px_rgba(0,111,205,1)] font-mono'
              : effectiveIsPixel
              ? 'bg-gradient-to-r from-purple-700 via-pink-600 to-cyan-400 text-white border-pink-300 shadow-[0_0_25px_rgba(236,72,153,1)] font-mono'
              : effectiveIsTimber
              ? 'bg-gradient-to-r from-emerald-500 via-teal-400 to-amber-400 text-black border-emerald-200 shadow-[0_0_25px_rgba(52,211,153,1)]'
              : 'gold-gradient-bg text-black border-yellow-200 shadow-[0_0_25px_rgba(245,158,11,1)]'
          }`}
        >
          {effectiveIsPs2 ? (
            <Gamepad2 className="w-4 h-4 fill-cyan-300 text-cyan-300 animate-spin" />
          ) : effectiveIsPixel ? (
            <Gamepad2 className="w-4 h-4 fill-cyan-300 text-cyan-300 animate-spin" />
          ) : (
            <Star className="w-4 h-4 fill-amber-950 text-amber-950 animate-spin" />
          )}
          <span className="tracking-wide">
            {effectiveIsPs2 ? '🎮 ' : effectiveIsPixel ? '👾 ' : effectiveIsTimber ? '🌲 ' : '★ '}
            LINE {activeWin.lineIndex + 1}: +{activeWin.payout.toLocaleString()}
            {effectiveIsPs2 ? ' CREDITS 🎮' : effectiveIsPixel ? ' PTS 👾' : effectiveIsTimber ? ' ACORNS 🌲' : ' COINS ★'}
          </span>
          <Coins className="w-4 h-4 fill-amber-950 text-amber-950" />
        </div>
      </div>
    </div>
  );
};
