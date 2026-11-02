import React, { useEffect, useState, useMemo, useRef, useCallback } from 'react';
import type { SpinResult, SymbolGrid } from '../../engine/types';
import { Reel } from './Reel';
import { PaylineOverlay } from './PaylineOverlay';
import { soundManager } from '../../audio/soundManager';

interface SlotMachineProps {
  currentGrid: SymbolGrid;
  isSpinning: boolean;
  spinResult: SpinResult | null;
  isTurbo: boolean;
  onAllReelsStopped: () => void;
  freeSpinsRemaining: number;
  onQuickStop?: () => void;
}

export const SlotMachine: React.FC<SlotMachineProps> = ({
  currentGrid,
  isSpinning,
  spinResult,
  isTurbo,
  onAllReelsStopped,
  freeSpinsRemaining,
  onQuickStop,
}) => {
  // Track spinning state per reel [0..4]
  const [reelSpinning, setReelSpinning] = useState<boolean[]>([false, false, false, false, false]);
  const [activeWinningLineIdx, setActiveWinningLineIdx] = useState<number | null>(null);

  // References to active stop timers
  const timersRef = useRef<number[]>([]);

  // Function to perform immediate quick-stop
  const triggerQuickStop = useCallback(() => {
    // Clear all pending stop timers
    timersRef.current.forEach((t) => clearTimeout(t));
    timersRef.current = [];

    // Stop all reels immediately
    setReelSpinning([false, false, false, false, false]);
    soundManager.playReelStop(4);

    // Notify parent that all reels have settled
    onAllReelsStopped();
  }, [onAllReelsStopped]);

  // Handle spin start and staggered stopping schedule
  useEffect(() => {
    if (isSpinning) {
      // Start all reels
      setReelSpinning([true, true, true, true, true]);
      setActiveWinningLineIdx(null);

      // Clear any prior timers
      timersRef.current.forEach((t) => clearTimeout(t));
      timersRef.current = [];

      // Check if reels 0 and 1 hit scatters for anticipation tension
      const hasScatter0 = currentGrid[0]?.includes('SCATTER');
      const hasScatter1 = currentGrid[1]?.includes('SCATTER');
      const anticipation = hasScatter0 && hasScatter1;

      // Base stop intervals
      const baseDelays = isTurbo
        ? [100, 200, 300, 400, 500]
        : anticipation
        ? [500, 750, 1500, 2000, 2500] // Anticipation slow-down
        : [500, 750, 1000, 1250, 1500];

      baseDelays.forEach((delay, reelIdx) => {
        const timerId = window.setTimeout(() => {
          soundManager.playReelStop(reelIdx);

          if (currentGrid[reelIdx]?.includes('SCATTER')) {
            const scattersCount = currentGrid
              .slice(0, reelIdx + 1)
              .filter((col) => col.includes('SCATTER')).length;
            soundManager.playScatterLand(scattersCount);
          }

          setReelSpinning((prev) => {
            const next = [...prev];
            next[reelIdx] = false;
            return next;
          });

          // If last reel just stopped, finish the spin cycle
          if (reelIdx === 4) {
            onAllReelsStopped();
          }
        }, delay);

        timersRef.current.push(timerId);
      });
    } else {
      // Not spinning: ensure all reels are stopped
      timersRef.current.forEach((t) => clearTimeout(t));
      timersRef.current = [];
      setReelSpinning([false, false, false, false, false]);
    }

    return () => {
      timersRef.current.forEach((t) => clearTimeout(t));
    };
  }, [isSpinning, isTurbo, currentGrid, onAllReelsStopped]);

  // Cycle through winning lines when idle after a win
  useEffect(() => {
    const isAnyReelSpinning = reelSpinning.some(Boolean);
    if (!isSpinning && !isAnyReelSpinning && spinResult && spinResult.winningLines.length > 0) {
      const interval = setInterval(() => {
        setActiveWinningLineIdx((prev) => {
          if (prev === null) return 0;
          return (prev + 1) % spinResult.winningLines.length;
        });
      }, 1600);
      return () => clearInterval(interval);
    } else {
      setActiveWinningLineIdx(null);
    }
  }, [isSpinning, reelSpinning, spinResult]);

  // Compute winning coordinates for symbol highlights
  const winningCoordsMap = useMemo(() => {
    const map = new Map<number, Set<number>>();
    for (let r = 0; r < 5; r++) map.set(r, new Set<number>());

    const isAnyReelSpinning = reelSpinning.some(Boolean);
    if (spinResult && !isSpinning && !isAnyReelSpinning) {
      const linesToConsider =
        activeWinningLineIdx !== null
          ? [spinResult.winningLines[activeWinningLineIdx]]
          : spinResult.winningLines;

      linesToConsider.forEach((line) => {
        if (!line) return;
        line.coords.forEach(([reel, row]) => {
          map.get(reel)?.add(row);
        });
      });
    }
    return map;
  }, [spinResult, isSpinning, reelSpinning, activeWinningLineIdx]);

  // Compute scatter coordinates
  const scatterCoordsMap = useMemo(() => {
    const map = new Map<number, Set<number>>();
    for (let r = 0; r < 5; r++) map.set(r, new Set<number>());

    const isAnyReelSpinning = reelSpinning.some(Boolean);
    if (spinResult && !isSpinning && !isAnyReelSpinning && spinResult.scatterCoords.length >= 2) {
      spinResult.scatterCoords.forEach(([reel, row]) => {
        map.get(reel)?.add(row);
      });
    }
    return map;
  }, [spinResult, isSpinning, reelSpinning]);

  // Anticipation status for reels 2, 3, 4
  const hasScatter0 = !reelSpinning[0] && currentGrid[0]?.includes('SCATTER');
  const hasScatter1 = !reelSpinning[1] && currentGrid[1]?.includes('SCATTER');
  const isAnticipating = hasScatter0 && hasScatter1;

  const handleStageClick = () => {
    if (isSpinning) {
      if (onQuickStop) {
        onQuickStop();
      } else {
        triggerQuickStop();
      }
    }
  };

  return (
    <div
      onClick={handleStageClick}
      className={`relative w-full max-w-4xl mx-auto px-2 sm:px-4 select-none ${
        isSpinning ? 'cursor-pointer' : ''
      }`}
      title={isSpinning ? 'Click anywhere on reels to Quick Stop' : undefined}
    >
      {/* Outer Luxury Cabinet Frame */}
      <div
        className={`relative p-3 sm:p-5 rounded-2xl sm:rounded-3xl transition-all duration-500 shadow-2xl ${
          freeSpinsRemaining > 0
            ? 'bg-gradient-to-b from-amber-600 via-yellow-700 to-amber-950 shadow-[0_0_50px_rgba(245,158,11,0.6)] border-2 border-yellow-400'
            : 'bg-gradient-to-b from-casino-800 via-casino-900 to-black shadow-[0_15px_40px_rgba(0,0,0,0.9)] border border-white/10'
        }`}
      >
        {/* Flashing Marquee Bulbs Header */}
        <div className="flex items-center justify-between pb-3 px-2 border-b border-white/10 mb-3">
          <div className="flex items-center space-x-2">
            {[...Array(6)].map((_, i) => (
              <div
                key={i}
                className="w-2.5 h-2.5 rounded-full bg-gold-bright shadow-[0_0_8px_#F59E0B] animate-pulse"
                style={{ animationDelay: `${i * 150}ms` }}
              />
            ))}
          </div>

          <div className="text-center">
            {freeSpinsRemaining > 0 ? (
              <span className="text-xs sm:text-sm font-black tracking-widest uppercase text-yellow-300 animate-bounce">
                🔥 FREE SPINS ACTIVE: {freeSpinsRemaining} REMAINING (3X WINS) 🔥
              </span>
            ) : isSpinning ? (
              <span className="text-xs sm:text-sm font-black tracking-widest uppercase text-amber-300 animate-pulse">
                ⚡ REELS SPINNING • CLICK TO QUICK STOP ⚡
              </span>
            ) : (
              <span className="text-xs sm:text-sm font-black tracking-widest uppercase gold-gradient-text">
                ★ 20 FIXED PAYLINES • DELUXE VEGAS SLOTS ★
              </span>
            )}
          </div>

          <div className="flex items-center space-x-2">
            {[...Array(6)].map((_, i) => (
              <div
                key={i}
                className="w-2.5 h-2.5 rounded-full bg-neon-cyan shadow-[0_0_8px_#00F0FF] animate-pulse"
                style={{ animationDelay: `${(5 - i) * 150}ms` }}
              />
            ))}
          </div>
        </div>

        {/* The 5 Reels Stage */}
        <div className="relative flex space-x-1.5 sm:space-x-3 bg-casino-950/90 p-2 sm:p-3 rounded-xl border border-white/5 shadow-inner">
          {/* SVG Payline Glow Overlay */}
          <PaylineOverlay
            winningLines={spinResult?.winningLines || []}
            activeLineIndex={activeWinningLineIdx}
          />

          {/* 5 Reels */}
          {[0, 1, 2, 3, 4].map((reelIdx) => (
            <Reel
              key={reelIdx}
              reelIndex={reelIdx}
              symbols={currentGrid[reelIdx]}
              isSpinning={reelSpinning[reelIdx]}
              isAnticipating={isAnticipating && reelIdx >= 2 && reelSpinning[reelIdx]}
              winningRows={winningCoordsMap.get(reelIdx)}
              scatterRows={scatterCoordsMap.get(reelIdx)}
            />
          ))}
        </div>

        {/* Cabinet Bottom Status Bar */}
        <div className="mt-3 flex items-center justify-between text-[11px] text-slate-400 font-semibold px-2">
          <div className="flex items-center space-x-1">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
            <span>PAYOUT RATE: 95.8% RTP</span>
          </div>
          {spinResult && !isSpinning && spinResult.winningLines.length > 0 && (
            <div className="text-gold-bright font-bold animate-pulse text-xs">
              {spinResult.winningLines.length} WINNING LINE(S) HIT!
            </div>
          )}
          <div className="tracking-wide">WILD PAYS 1000x • 3 SCATTERS = FREE SPINS</div>
        </div>
      </div>
    </div>
  );
};
