import React, { useEffect, useState, useMemo } from 'react';
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
}

export const SlotMachine: React.FC<SlotMachineProps> = ({
  currentGrid,
  isSpinning,
  spinResult,
  isTurbo,
  onAllReelsStopped,
  freeSpinsRemaining,
}) => {
  const [stoppedReels, setStoppedReels] = useState<Set<number>>(new Set());
  const [activeWinningLineIdx, setActiveWinningLineIdx] = useState<number | null>(null);

  // Reset stopped reels when a new spin begins
  useEffect(() => {
    if (isSpinning) {
      setStoppedReels(new Set());
      setActiveWinningLineIdx(null);
    }
  }, [isSpinning]);

  // Handle individual reel stops
  const handleReelStop = (reelIdx: number) => {
    soundManager.playReelStop(reelIdx);

    // Check if scatter landed on this reel
    const reelSymbols = currentGrid[reelIdx];
    if (reelSymbols.includes('SCATTER')) {
      const scattersCountSoFar = Array.from({ length: reelIdx + 1 }).reduce<number>(
        (acc, _, idx) => acc + (currentGrid[idx]?.includes('SCATTER') ? 1 : 0),
        0
      );
      soundManager.playScatterLand(scattersCountSoFar);
    }

    setStoppedReels((prev) => {
      const next = new Set(prev);
      next.add(reelIdx);
      if (next.size === 5) {
        onAllReelsStopped();
      }
      return next;
    });
  };

  // Determine if anticipation is active for reels 2, 3, 4
  // Anticipation happens when reel 0 and reel 1 both have SCATTER
  const hasScatterOnReel0 = stoppedReels.has(0) && currentGrid[0]?.includes('SCATTER');
  const hasScatterOnReel1 = stoppedReels.has(1) && currentGrid[1]?.includes('SCATTER');
  const isAnticipationTriggered = hasScatterOnReel0 && hasScatterOnReel1;

  // Cycle through winning lines when idle after a win
  useEffect(() => {
    if (!isSpinning && spinResult && spinResult.winningLines.length > 0) {
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
  }, [isSpinning, spinResult]);

  // Compute winning coordinates per reel for highlighting
  const winningCoordsMap = useMemo(() => {
    const map = new Map<number, Set<number>>();
    for (let r = 0; r < 5; r++) map.set(r, new Set<number>());

    if (spinResult && !isSpinning) {
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
  }, [spinResult, isSpinning, activeWinningLineIdx]);

  // Compute scatter coordinates
  const scatterCoordsMap = useMemo(() => {
    const map = new Map<number, Set<number>>();
    for (let r = 0; r < 5; r++) map.set(r, new Set<number>());

    if (spinResult && !isSpinning && spinResult.scatterCoords.length >= 2) {
      spinResult.scatterCoords.forEach(([reel, row]) => {
        map.get(reel)?.add(row);
      });
    }
    return map;
  }, [spinResult, isSpinning]);

  // Calculate stop delay for each reel
  const getStopDelay = (reelIdx: number) => {
    if (isTurbo) {
      return 150 + reelIdx * 120;
    }
    const baseDelay = 700 + reelIdx * 250;
    // If anticipation applies to reels 2, 3, 4, extend spin duration
    if (isAnticipationTriggered && reelIdx >= 2) {
      return baseDelay + 1000 + (reelIdx - 2) * 500;
    }
    return baseDelay;
  };

  return (
    <div className="relative w-full max-w-4xl mx-auto px-2 sm:px-4 select-none">
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

        {/* The 5 Reels Container */}
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
              finalSymbols={currentGrid[reelIdx]}
              isSpinning={isSpinning}
              stopDelay={getStopDelay(reelIdx)}
              isAnticipating={isAnticipationTriggered && reelIdx >= 2 && !stoppedReels.has(reelIdx)}
              winningRows={winningCoordsMap.get(reelIdx)}
              scatterRows={scatterCoordsMap.get(reelIdx)}
              onStop={handleReelStop}
            />
          ))}
        </div>

        {/* Cabinet Bottom Bevel */}
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
