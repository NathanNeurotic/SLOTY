import React, { useEffect, useState, useRef } from 'react';
import { soundManager } from '../../audio/soundManager';
import { Coins, Trophy, Trees } from 'lucide-react';
import type { GameId } from '../../games/types';

interface RollingWinDisplayProps {
  targetAmount: number;
  isFreeSpins: boolean;
  activeGameId?: GameId;
}

export const RollingWinDisplay: React.FC<RollingWinDisplayProps> = ({
  targetAmount,
  isFreeSpins,
  activeGameId = 'vault-24k',
}) => {
  const isTimber = activeGameId === 'timber-critters';
  const isPixel = activeGameId === 'pixel-arcade';
  const [displayedAmount, setDisplayedAmount] = useState(targetAmount);
  const animRef = useRef<number | null>(null);
  const prevTargetRef = useRef(targetAmount);

  useEffect(() => {
    const startVal = prevTargetRef.current;
    const endVal = targetAmount;
    prevTargetRef.current = targetAmount;

    if (endVal === 0) {
      setDisplayedAmount(0);
      return;
    }

    if (startVal === endVal) {
      setDisplayedAmount(endVal);
      return;
    }

    if (endVal > 0) {
      soundManager.playCoinCascade(Math.min(16, Math.max(6, Math.floor(endVal / 250))));
    }

    const duration = 750; // ms
    const startTime = performance.now();

    const step = (now: number) => {
      const elapsed = now - startTime;
      const progress = Math.min(1, elapsed / duration);
      // Ease out cubic
      const ease = 1 - Math.pow(1 - progress, 3);
      const current = Math.floor(startVal + (endVal - startVal) * ease);
      setDisplayedAmount(current);

      if (progress < 1) {
        animRef.current = requestAnimationFrame(step);
      } else {
        setDisplayedAmount(endVal);
      }
    };

    animRef.current = requestAnimationFrame(step);

    return () => {
      if (animRef.current) cancelAnimationFrame(animRef.current);
    };
  }, [targetAmount]);

  const hasWin = targetAmount > 0;

  return (
    <div
      className={`relative flex flex-col items-center justify-center rounded-xl sm:rounded-2xl border transition-all duration-300 w-32 sm:w-48 xl:w-56 h-10 sm:h-12 flex-shrink-0 overflow-hidden ${
        hasWin
          ? isTimber
            ? 'bg-gradient-to-b from-[#1b3323] via-[#0d1f14] to-[#061009] border-2 border-emerald-400 shadow-[0_0_25px_rgba(52,211,153,0.8),inset_0_0_15px_rgba(52,211,153,0.3)] animate-pulse'
            : isPixel
            ? 'bg-gradient-to-b from-[#1a0630] via-black to-[#0d021c] border-2 border-pink-400 shadow-[0_0_25px_rgba(236,72,153,0.85),inset_0_0_15px_rgba(6,182,212,0.3)] animate-pulse'
            : 'bg-gradient-to-b from-amber-950 via-slate-950 to-black border-2 border-yellow-300 shadow-[0_0_25px_rgba(253,224,71,0.85),inset_0_0_15px_rgba(245,158,11,0.3)] animate-pulse'
          : isTimber
          ? 'bg-gradient-to-b from-[#142318] to-[#0a140e] border-emerald-700/40 shadow-inner'
          : isPixel
          ? 'bg-gradient-to-b from-[#130722] to-black border-pink-900/40 shadow-inner'
          : 'bg-gradient-to-b from-casino-950 to-casino-900 border-white/15 shadow-inner'
      }`}
    >
      {/* Top Banner Label */}
      <div className="flex items-center space-x-1 leading-none">
        {hasWin ? (
          isTimber ? (
            <Trees className="w-3 h-3 text-emerald-400 animate-bounce" />
          ) : isPixel ? (
            <span className="text-xs animate-bounce">🕹️</span>
          ) : (
            <Trophy className="w-3 h-3 text-yellow-300 fill-yellow-400 animate-bounce" />
          )
        ) : null}
        <span
          className={`text-[8px] sm:text-[9.5px] uppercase font-black tracking-widest ${
            hasWin
              ? isTimber
                ? 'text-emerald-300 drop-shadow-[0_0_6px_rgba(52,211,153,0.9)]'
                : isPixel
                ? 'text-pink-300 drop-shadow-[0_0_6px_rgba(236,72,153,0.9)] font-mono'
                : 'text-amber-300 drop-shadow-[0_0_6px_rgba(251,191,36,0.9)]'
              : 'text-slate-400'
          }`}
        >
          {hasWin
            ? isFreeSpins
              ? '★ FREE SPIN WIN ★'
              : isPixel
              ? '★ HIGH SCORE WIN ★'
              : '★ TOTAL WIN ★'
            : 'WIN PAYOUT'}
        </span>
      </div>

      {/* Massive Hero Win Digits */}
      <div className="flex items-center space-x-1 mt-0.5">
        {hasWin && (
          <Coins
            className={`w-4 h-4 sm:w-5 sm:h-5 ${
              isTimber ? 'text-emerald-300 fill-emerald-400 animate-spin' : isPixel ? 'text-pink-300 fill-pink-400 animate-spin' : 'text-yellow-300 fill-yellow-400 animate-spin'
            }`}
          />
        )}
        <span
          className={`font-black font-mono tracking-tight leading-none ${
            hasWin
              ? isTimber
                ? 'text-xl sm:text-2xl xl:text-3xl text-emerald-200 drop-shadow-[0_0_15px_rgba(52,211,153,1)]'
                : isPixel
                ? 'text-xl sm:text-2xl xl:text-3xl text-pink-300 drop-shadow-[0_0_15px_rgba(236,72,153,1)]'
                : 'text-xl sm:text-2xl xl:text-3xl text-yellow-300 drop-shadow-[0_0_15px_rgba(253,224,71,1)]'
              : 'text-base sm:text-lg text-slate-500'
          }`}
        >
          {displayedAmount > 0 ? `+${displayedAmount.toLocaleString()}` : '0'}
        </span>
      </div>
    </div>
  );
};
