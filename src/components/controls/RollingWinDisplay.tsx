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
  const isPs2 = activeGameId === 'ps2-legends';
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

  const getWinLabel = () => {
    if (hasWin) {
      if (isFreeSpins) {
        if (isPs2) return 'OVERCLOCK WIN';
        if (isTimber) return 'HARVEST WIN';
        if (isPixel) return 'BONUS WIN';
        return 'FREE SPIN WIN';
      }
      if (isPs2) return 'PS2 WIN';
      if (isTimber) return 'CRITTER WIN';
      if (isPixel) return 'ARCADE WIN';
      return 'WINNER PAID';
    }
    if (isPs2) return 'CARD PAID';
    return 'WIN PAID';
  };

  return (
    <div
      className={`relative flex flex-col items-center justify-center rounded-lg sm:rounded-xl border transition-all duration-300 min-w-[130px] w-36 sm:w-44 md:w-52 h-11 sm:h-12 md:h-12.5 px-3 py-1.5 flex-shrink-0 overflow-hidden box-border ${
        hasWin
          ? isPs2
            ? 'bg-gradient-to-b from-[#001026] via-[#000814] to-black border-2 border-[#00F0FF] shadow-[0_0_18px_rgba(0,240,255,0.7),inset_0_0_10px_rgba(0,111,205,0.4)] animate-pulse'
            : isTimber
            ? 'bg-gradient-to-b from-[#1b3323] via-[#0d1f14] to-[#061009] border-2 border-emerald-400 shadow-[0_0_18px_rgba(52,211,153,0.7),inset_0_0_10px_rgba(52,211,153,0.3)] animate-pulse'
            : isPixel
            ? 'bg-gradient-to-b from-[#1a0630] via-black to-[#0d021c] border-2 border-pink-400 shadow-[0_0_18px_rgba(236,72,153,0.7),inset_0_0_10px_rgba(6,182,212,0.3)] animate-pulse'
            : 'bg-gradient-to-b from-amber-950 via-slate-950 to-black border-2 border-yellow-300 shadow-[0_0_18px_rgba(253,224,71,0.7),inset_0_0_10px_rgba(245,158,11,0.3)] animate-pulse'
          : isPs2
          ? 'bg-gradient-to-b from-[#020b18] to-black border-[#006FCD]/50 shadow-inner'
          : isTimber
          ? 'bg-gradient-to-b from-[#142318] to-[#0a140e] border-emerald-700/50 shadow-inner'
          : isPixel
          ? 'bg-gradient-to-b from-[#130722] to-black border-pink-900/50 shadow-inner'
          : 'bg-gradient-to-b from-casino-950 to-casino-900 border-white/15 shadow-inner'
      }`}
    >
      {/* Top Banner Label */}
      <div className="flex items-center justify-center space-x-1 leading-none select-none max-w-full px-1 mb-1">
        {hasWin && (
          isPs2 ? (
            <span className="text-[9px] text-[#00F0FF] leading-none">🎮</span>
          ) : isTimber ? (
            <Trees className="w-2.5 h-2.5 text-emerald-400 leading-none flex-shrink-0" />
          ) : isPixel ? (
            <span className="text-[9px] text-pink-400 leading-none">🕹️</span>
          ) : (
            <Trophy className="w-2.5 h-2.5 text-yellow-300 fill-yellow-400 leading-none flex-shrink-0" />
          )
        )}
        <span
          className={`text-[7px] sm:text-[8px] md:text-[8.5px] uppercase font-black tracking-wider whitespace-nowrap truncate leading-none ${
            hasWin
              ? isPs2
                ? 'text-[#00F0FF] drop-shadow-[0_0_6px_rgba(0,240,255,0.9)] font-mono'
                : isTimber
                ? 'text-emerald-300 drop-shadow-[0_0_6px_rgba(52,211,153,0.9)]'
                : isPixel
                ? 'text-pink-300 drop-shadow-[0_0_6px_rgba(236,72,153,0.9)] font-mono'
                : 'text-amber-300 drop-shadow-[0_0_6px_rgba(251,191,36,0.9)]'
              : isPs2
              ? 'text-cyan-500/80 font-mono'
              : 'text-slate-400'
          }`}
        >
          {getWinLabel()}
        </span>
      </div>

      {/* Hero Win Digits */}
      <div className="flex items-center justify-center space-x-1.5 max-w-full px-1 leading-none">
        {hasWin && (
          <Coins
            className={`w-4 h-4 sm:w-4.5 sm:h-4.5 flex-shrink-0 ${
              isPs2
                ? 'text-[#00F0FF] fill-[#006FCD]'
                : isTimber
                ? 'text-emerald-300 fill-emerald-500'
                : isPixel
                ? 'text-pink-300 fill-pink-500'
                : 'text-yellow-300 fill-yellow-500'
            }`}
          />
        )}
        <span
          className={`font-black font-mono tracking-tight leading-none whitespace-nowrap truncate ${
            hasWin
              ? isPs2
                ? 'text-sm sm:text-base md:text-lg text-cyan-200 drop-shadow-[0_0_10px_rgba(0,240,255,0.9)]'
                : isTimber
                ? 'text-sm sm:text-base md:text-lg text-emerald-200 drop-shadow-[0_0_10px_rgba(52,211,153,0.9)]'
                : isPixel
                ? 'text-sm sm:text-base md:text-lg text-pink-200 drop-shadow-[0_0_10px_rgba(236,72,153,0.9)]'
                : 'text-sm sm:text-base md:text-lg text-yellow-300 drop-shadow-[0_0_10px_rgba(253,224,71,0.9)]'
              : isPs2
              ? 'text-xs sm:text-sm text-cyan-700 font-bold'
              : 'text-xs sm:text-sm text-slate-500 font-bold'
          }`}
        >
          {displayedAmount > 0 ? `+${displayedAmount.toLocaleString()}` : '0'}
        </span>
      </div>
    </div>
  );
};
