import React, { useEffect, useState, useRef } from 'react';
import type { WinTier } from '../../engine/types';
import { soundManager } from '../../audio/soundManager';
import { launchCoinFountain } from '../../fx/celebrations';
import { Coins, Sparkles } from 'lucide-react';

interface WinCelebrationModalProps {
  winTier: WinTier;
  winAmount: number;
  onDismiss: () => void;
}

export const WinCelebrationModal: React.FC<WinCelebrationModalProps> = ({
  winTier,
  winAmount,
  onDismiss,
}) => {
  const [displayedAmount, setDisplayedAmount] = useState(0);
  const [isFinishedCounting, setIsFinishedCounting] = useState(false);
  const animationFrameRef = useRef<number | null>(null);
  const autoDismissTimerRef = useRef<number | null>(null);
  const isDismissedRef = useRef(false);

  const handleDismiss = () => {
    if (isDismissedRef.current) return;
    isDismissedRef.current = true;
    if (animationFrameRef.current) cancelAnimationFrame(animationFrameRef.current);
    if (autoDismissTimerRef.current) clearTimeout(autoDismissTimerRef.current);
    soundManager.playButtonClick();
    onDismiss();
  };

  useEffect(() => {
    // Determine celebration intensity
    const intensity =
      winTier === 'EPIC_JACKPOT' ? 'jackpot' : winTier === 'MEGA_WIN' ? 'mega' : 'big';

    launchCoinFountain(intensity);

    if (winTier === 'EPIC_JACKPOT') {
      soundManager.playJackpotFanfare();
    } else {
      soundManager.playWinChime(winTier === 'MEGA_WIN' ? 25 : 10);
    }

    const duration = 1800; // Snappy 1.8 seconds roll-up
    const startTime = performance.now();
    let lastTallySound = 0;

    const tick = (now: number) => {
      const elapsed = now - startTime;
      const progress = Math.min(1, elapsed / duration);
      // Ease out cubic
      const eased = 1 - Math.pow(1 - progress, 3);
      const current = Math.floor(eased * winAmount);
      setDisplayedAmount(current);

      if (now - lastTallySound > 85) {
        soundManager.playCoinTally();
        lastTallySound = now;
      }

      if (progress < 1) {
        animationFrameRef.current = requestAnimationFrame(tick);
      } else {
        setDisplayedAmount(winAmount);
        setIsFinishedCounting(true);

        // Auto-dismiss after 2 seconds so Auto-Spin never hangs or freezes
        autoDismissTimerRef.current = window.setTimeout(() => {
          handleDismiss();
        }, 2200);
      }
    };

    animationFrameRef.current = requestAnimationFrame(tick);

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.code === 'Space' || e.code === 'Enter' || e.key === 'Escape') {
        e.preventDefault();
        e.stopPropagation();
        handleSkipOrCollect();
      }
    };

    window.addEventListener('keydown', handleKeyDown, { capture: true });

    return () => {
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }
      if (autoDismissTimerRef.current) {
        clearTimeout(autoDismissTimerRef.current);
      }
      window.removeEventListener('keydown', handleKeyDown, { capture: true });
    };
  }, [winTier, winAmount]);

  const handleSkipOrCollect = () => {
    if (!isFinishedCounting) {
      if (animationFrameRef.current) cancelAnimationFrame(animationFrameRef.current);
      setDisplayedAmount(winAmount);
      setIsFinishedCounting(true);
      soundManager.playButtonClick();
      // Auto dismiss after skip
      autoDismissTimerRef.current = window.setTimeout(() => {
        handleDismiss();
      }, 1200);
    } else {
      handleDismiss();
    }
  };

  const getTierDetails = () => {
    switch (winTier) {
      case 'EPIC_JACKPOT':
        return {
          title: 'EPIC JACKPOT!',
          subtitle: 'LEGENDARY CASINO HIT!',
          gradient: 'from-amber-400 via-yellow-300 to-amber-500',
          borderColor: 'border-yellow-400',
          textColor: 'text-yellow-300',
          glow: 'shadow-[0_0_80px_rgba(245,158,11,0.9)]',
        };
      case 'MEGA_WIN':
        return {
          title: 'MEGA WIN!',
          subtitle: 'INCREDIBLE FORTUNE!',
          gradient: 'from-pink-500 via-purple-500 to-indigo-500',
          borderColor: 'border-pink-400',
          textColor: 'text-pink-300',
          glow: 'shadow-[0_0_60px_rgba(236,72,153,0.8)]',
        };
      default:
        return {
          title: 'BIG WIN!',
          subtitle: 'NICE PAYOUT!',
          gradient: 'from-emerald-400 via-teal-300 to-cyan-500',
          borderColor: 'border-emerald-400',
          textColor: 'text-emerald-300',
          glow: 'shadow-[0_0_50px_rgba(16,185,129,0.7)]',
        };
    }
  };

  const tier = getTierDetails();

  return (
    <div
      onClick={handleSkipOrCollect}
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/90 cursor-pointer select-none animate-fadeIn"
    >
      <div
        className={`relative max-w-lg w-full bg-casino-950/95 border-2 ${tier.borderColor} ${tier.glow} rounded-3xl p-6 sm:p-10 text-center flex flex-col items-center transform transition-transform hover:scale-[1.01]`}
      >
        {/* Top Decorative Sparkles */}
        <div className="flex items-center space-x-2 text-gold-bright mb-2 animate-bounce">
          <Sparkles className="w-6 h-6" />
          <span className="text-xs font-black uppercase tracking-widest text-slate-300">
            {tier.subtitle}
          </span>
          <Sparkles className="w-6 h-6" />
        </div>

        {/* Big Banner Title */}
        <h1
          className={`text-4xl sm:text-6xl font-black uppercase tracking-wider bg-gradient-to-r ${tier.gradient} bg-clip-text text-transparent drop-shadow-lg mb-4`}
        >
          {tier.title}
        </h1>

        {/* Animated Win Ticker */}
        <div className="flex items-center justify-center space-x-3 my-4 bg-casino-900/90 border border-white/10 px-6 py-4 rounded-2xl w-full">
          <Coins className="w-8 h-8 text-gold-bright fill-gold animate-spin" />
          <span className="text-4xl sm:text-5xl font-black text-white tracking-wide">
            +{displayedAmount.toLocaleString()}
          </span>
        </div>

        {/* Tap to collect hint */}
        <div className="mt-4 flex flex-col items-center">
          <button
            onClick={(e) => {
              e.stopPropagation();
              handleSkipOrCollect();
            }}
            className="gold-btn px-8 py-3 rounded-2xl font-black text-sm uppercase tracking-widest text-casino-950 shadow-xl hover:scale-105 active:scale-95 transition-transform flex items-center justify-center space-x-2"
          >
            <span>{isFinishedCounting ? 'COLLECT COINS' : 'SKIP TO END'}</span>
            <span className="px-1.5 py-0.5 rounded bg-black/25 text-[10px] font-mono font-bold">SPACE</span>
          </button>
          <div className="text-[11px] text-slate-400 mt-2">
            Press Space or click anywhere to {isFinishedCounting ? 'dismiss' : 'fast-forward'}
          </div>
        </div>
      </div>
    </div>
  );
};
