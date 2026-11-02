import React, { useEffect, useState, useRef } from 'react';
import { soundManager } from '../../audio/soundManager';

interface RollingWinDisplayProps {
  targetAmount: number;
  isFreeSpins: boolean;
}

export const RollingWinDisplay: React.FC<RollingWinDisplayProps> = ({
  targetAmount,
  isFreeSpins,
}) => {
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

    const duration = 650; // ms
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

  return (
    <div
      className={`flex flex-col items-center justify-center bg-gradient-to-b from-casino-950 to-casino-900 px-2 sm:px-3 rounded-xl border transition-colors duration-200 w-28 sm:w-36 h-9 sm:h-10 flex-shrink-0 overflow-hidden ${
        targetAmount > 0
          ? 'border-gold-bright shadow-[0_0_15px_rgba(245,158,11,0.5),inset_0_0_12px_rgba(245,158,11,0.25)]'
          : 'border-white/10 shadow-[inset_0_0_10px_rgba(0,0,0,0.5)]'
      }`}
    >
      <span className="text-[7.5px] sm:text-[8.5px] uppercase font-extrabold tracking-widest text-gold-bright leading-tight truncate">
        {isFreeSpins ? 'FREE SPIN WIN' : 'WIN PAYOUT'}
      </span>
      <span
        className={`text-sm sm:text-base font-black font-mono leading-tight truncate ${
          displayedAmount > 0
            ? 'text-gold-light animate-pulse filter drop-shadow-[0_0_8px_rgba(251,191,36,0.9)]'
            : 'text-slate-500'
        }`}
      >
        {displayedAmount > 0 ? `+${displayedAmount.toLocaleString()}` : '0'}
      </span>
    </div>
  );
};
