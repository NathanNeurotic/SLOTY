import React, { useEffect, useState, useRef } from 'react';

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
      className={`flex flex-col items-center justify-center bg-gradient-to-b from-casino-950 to-casino-900 px-3 py-1 rounded-xl border transition-all duration-300 min-w-[110px] sm:min-w-[130px] ${
        targetAmount > 0
          ? 'border-gold-bright shadow-[0_0_15px_rgba(245,158,11,0.5),inset_0_0_12px_rgba(245,158,11,0.25)]'
          : 'border-white/10 shadow-[inset_0_0_10px_rgba(0,0,0,0.5)]'
      }`}
    >
      <span className="text-[8px] sm:text-[9px] uppercase font-extrabold tracking-widest text-gold-bright">
        {isFreeSpins ? 'FREE SPIN WIN' : 'WIN PAYOUT'}
      </span>
      <span
        className={`text-base sm:text-lg font-black transition-all ${
          displayedAmount > 0
            ? 'text-gold-light animate-pulse filter drop-shadow-[0_0_10px_rgba(251,191,36,0.9)] scale-105'
            : 'text-slate-500'
        }`}
      >
        {displayedAmount > 0 ? `+${displayedAmount.toLocaleString()}` : '0'}
      </span>
    </div>
  );
};
