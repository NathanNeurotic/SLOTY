import React, { useEffect, useState } from 'react';
import { Trophy, Sparkles, Trees, Dices } from 'lucide-react';
import type { GameId } from '../../games/types';
import type { WinningLine } from '../../engine/types';
import { soundManager } from '../../audio/soundManager';

interface HeroWinCelebrationProps {
  totalPayout: number;
  winningLines: WinningLine[];
  activeWinningLine: WinningLine | null;
  activeGameId?: GameId;
  onOpenGamble?: () => void;
  onDismiss?: () => void;
}

export const HeroWinCelebration: React.FC<HeroWinCelebrationProps> = ({
  totalPayout,
  winningLines,
  activeWinningLine,
  activeGameId = 'vault-24k',
  onOpenGamble,
  onDismiss,
}) => {
  const isTimber = activeGameId === 'timber-critters';
  const [displayedCount, setDisplayedCount] = useState(0);

  useEffect(() => {
    let animId: number;
    const duration = 650;
    const start = performance.now();

    const tick = (now: number) => {
      const elapsed = now - start;
      const progress = Math.min(1, elapsed / duration);
      // Ease out cubic
      const current = Math.floor(totalPayout * (1 - Math.pow(1 - progress, 3)));
      setDisplayedCount(current);

      if (progress < 1) {
        animId = requestAnimationFrame(tick);
      } else {
        setDisplayedCount(totalPayout);
      }
    };

    animId = requestAnimationFrame(tick);
    soundManager.playCoinCascade(Math.min(18, Math.max(8, Math.floor(totalPayout / 200))));

    return () => cancelAnimationFrame(animId);
  }, [totalPayout]);

  if (totalPayout <= 0) return null;

  return (
    <div
      onClick={onDismiss}
      className="absolute inset-x-2 sm:inset-x-8 top-1/2 -translate-y-1/2 z-35 pointer-events-auto select-none cursor-pointer flex flex-col items-center animate-win-symbol-juice"
      title="Click to collect and continue"
    >
      {/* 1. Luminous Ambient Radial Backlight */}
      <div
        className={`absolute -inset-8 rounded-3xl filter blur-2xl pointer-events-none opacity-85 transition-colors ${
          isTimber
            ? 'bg-gradient-to-r from-emerald-600/50 via-teal-400/40 to-amber-500/50'
            : 'bg-gradient-to-r from-yellow-500/50 via-amber-400/40 to-yellow-600/50'
        }`}
      />

      {/* 2. Main Hero Win Plaque Container */}
      <div
        className={`relative w-full max-w-xl sm:max-w-2xl px-4 sm:px-8 py-3 sm:py-5 rounded-2xl sm:rounded-3xl border-3 sm:border-4 shadow-[0_20px_60px_rgba(0,0,0,0.95)] backdrop-blur-md flex flex-col items-center text-center overflow-hidden transition-all ${
          isTimber
            ? 'bg-gradient-to-b from-[#1c3624]/95 via-[#0c1f13]/95 to-[#051009]/95 border-emerald-300 shadow-[0_0_40px_rgba(52,211,153,0.9)]'
            : 'bg-gradient-to-b from-amber-950/95 via-black/95 to-amber-950/95 border-yellow-300 shadow-[0_0_45px_rgba(253,224,71,0.95)]'
        }`}
      >
        {/* Shimmer Light Sweep */}
        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/15 to-transparent animate-shimmer-sweep pointer-events-none" />

        {/* Top Header Tag: Winning Line & Combination */}
        <div className="flex items-center space-x-2 mb-1 z-10">
          {isTimber ? (
            <Trees className="w-4 h-4 sm:w-5 sm:h-5 text-emerald-300 animate-bounce" />
          ) : (
            <Trophy className="w-4 h-4 sm:w-5 sm:h-5 text-yellow-300 fill-yellow-400 animate-bounce" />
          )}
          <span
            className={`text-xs sm:text-sm md:text-base font-black uppercase tracking-widest ${
              isTimber ? 'text-emerald-300 drop-shadow-[0_0_8px_#34D399]' : 'text-amber-300 drop-shadow-[0_0_8px_#FDE047]'
            }`}
          >
            {activeWinningLine
              ? `LINE ${activeWinningLine.lineIndex + 1} PAYOUT`
              : `${winningLines.length} WINNING PAYLINES!`}
          </span>
          {isTimber ? (
            <Trees className="w-4 h-4 sm:w-5 sm:h-5 text-emerald-300 animate-bounce" />
          ) : (
            <Trophy className="w-4 h-4 sm:w-5 sm:h-5 text-yellow-300 fill-yellow-400 animate-bounce" />
          )}
        </div>

        {/* GIGANTIC HERO WIN NUMERALS (56px to 76px) */}
        <div className="flex items-baseline justify-center font-mono my-1 z-10">
          <span className="text-2xl sm:text-4xl md:text-5xl font-black text-amber-400 mr-1 sm:mr-2">
            +
          </span>
          <span
            className={`text-4xl sm:text-6xl md:text-7xl font-black tracking-tight leading-none ${
              isTimber
                ? 'text-emerald-200 drop-shadow-[0_0_25px_rgba(52,211,153,1),0_0_50px_rgba(16,185,129,0.8)]'
                : 'text-yellow-300 drop-shadow-[0_0_25px_rgba(253,224,71,1),0_0_50px_rgba(245,158,11,0.8)]'
            }`}
          >
            {displayedCount.toLocaleString()}
          </span>
          <span className="text-sm sm:text-lg md:text-xl font-black uppercase text-amber-300 ml-1.5 sm:ml-2.5">
            COINS
          </span>
        </div>

        {/* Combination Detail Pill */}
        {activeWinningLine && (
          <div
            className={`z-10 mt-1 px-3 sm:px-4 py-1 rounded-full border shadow-md flex items-center space-x-1.5 text-[10px] sm:text-xs font-black uppercase tracking-wider ${
              isTimber
                ? 'bg-[#183321] text-emerald-100 border-emerald-400/80 shadow-[0_0_12px_rgba(52,211,153,0.5)]'
                : 'bg-casino-900 text-yellow-100 border-yellow-400/80 shadow-[0_0_12px_rgba(253,224,71,0.5)]'
            }`}
          >
            <Sparkles className="w-3.5 h-3.5 text-yellow-300 animate-spin" />
            <span>
              {activeWinningLine.count}x {activeWinningLine.symbolId.replace('_', ' ')} HIT • PAYS +
              {activeWinningLine.payout.toLocaleString()}
            </span>
          </div>
        )}

        {/* Bottom Action Prompts: 2X Gamble Double-Up or Spin to Continue */}
        <div className="mt-3 sm:mt-4 flex items-center space-x-3 z-10">
          {onOpenGamble && (
            <button
              onClick={(e) => {
                e.stopPropagation();
                soundManager.playButtonClick();
                onOpenGamble();
              }}
              className="flex items-center space-x-1.5 px-3 sm:px-4 py-1.5 rounded-xl text-xs sm:text-sm font-black text-white bg-gradient-to-r from-pink-600 via-rose-600 to-amber-600 border-2 border-yellow-300 shadow-[0_0_15px_rgba(244,63,94,0.8)] hover:scale-105 active:scale-95 transition-all"
            >
              <Dices className="w-4 h-4 animate-bounce text-yellow-300" />
              <span>2X GAMBLE</span>
            </button>
          )}

          <div className="text-[9px] sm:text-[10.5px] font-mono text-slate-300 flex items-center space-x-1 uppercase tracking-wider bg-black/50 px-3 py-1.5 rounded-xl border border-white/10">
            <span>Click or Press</span>
            <kbd className="px-1.5 py-0.5 rounded bg-white/20 text-white font-black font-mono">
              SPACE
            </kbd>
            <span>to collect</span>
          </div>
        </div>
      </div>
    </div>
  );
};
