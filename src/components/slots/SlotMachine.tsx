import React, { useEffect, useState, useMemo, useRef, useCallback } from 'react';
import type { SpinResult, SymbolGrid } from '../../engine/types';
import { Reel } from './Reel';
import { PaylineOverlay } from './PaylineOverlay';
import { PaylineSideTabs } from './PaylineSideTabs';
import { soundManager } from '../../audio/soundManager';
import { ChevronLeft, ChevronRight, Award } from 'lucide-react';
import { SYMBOLS } from '../../engine/symbols';

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
  const [hoveredLineIndex, setHoveredLineIndex] = useState<number | null>(null);

  // References to active stop timers
  const timersRef = useRef<number[]>([]);

  // Function to perform immediate quick-stop
  const triggerQuickStop = useCallback(() => {
    timersRef.current.forEach((t) => clearTimeout(t));
    timersRef.current = [];

    setReelSpinning([false, false, false, false, false]);
    soundManager.playReelStop(4);

    onAllReelsStopped();
  }, [onAllReelsStopped]);

  // Handle spin start and staggered stopping schedule
  useEffect(() => {
    if (isSpinning) {
      setReelSpinning([true, true, true, true, true]);
      setActiveWinningLineIdx(null);
      setHoveredLineIndex(null);

      timersRef.current.forEach((t) => clearTimeout(t));
      timersRef.current = [];

      // Check if reels 0 and 1 hit scatters for suspense excitement
      const hasScatter0 = currentGrid[0]?.includes('SCATTER');
      const hasScatter1 = currentGrid[1]?.includes('SCATTER');
      const anticipation = hasScatter0 && hasScatter1;

      // Realistic casino spin durations: ~2.3s total for watchable, dramatic roll
      const baseDelays = isTurbo
        ? [120, 240, 360, 480, 600]
        : anticipation
        ? [900, 1250, 2100, 2600, 3100] // Extended suspense build-up
        : [900, 1250, 1600, 1950, 2300];

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

          // Final reel settled
          if (reelIdx === 4) {
            onAllReelsStopped();
          }
        }, delay);

        timersRef.current.push(timerId);
      });
    } else {
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
      // Start with first winning line
      if (activeWinningLineIdx === null) {
        setActiveWinningLineIdx(spinResult.winningLines[0].lineIndex);
      }
      const interval = setInterval(() => {
        setActiveWinningLineIdx((prev) => {
          if (prev === null) return spinResult.winningLines[0]?.lineIndex ?? 0;
          const currentIdx = spinResult.winningLines.findIndex((w) => w.lineIndex === prev);
          const nextIdx = (currentIdx + 1) % spinResult.winningLines.length;
          return spinResult.winningLines[nextIdx]?.lineIndex ?? 0;
        });
      }, 1900);
      return () => clearInterval(interval);
    } else {
      setActiveWinningLineIdx(null);
    }
  }, [isSpinning, reelSpinning, spinResult, activeWinningLineIdx]);

  // Manual navigation of winning lines
  const handleNextWinningLine = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (!spinResult || spinResult.winningLines.length === 0) return;
    const currentIdx = spinResult.winningLines.findIndex((w) => w.lineIndex === activeWinningLineIdx);
    const nextIdx = (currentIdx + 1) % spinResult.winningLines.length;
    setActiveWinningLineIdx(spinResult.winningLines[nextIdx].lineIndex);
  };

  const handlePrevWinningLine = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (!spinResult || spinResult.winningLines.length === 0) return;
    const currentIdx = spinResult.winningLines.findIndex((w) => w.lineIndex === activeWinningLineIdx);
    const prevIdx = (currentIdx - 1 + spinResult.winningLines.length) % spinResult.winningLines.length;
    setActiveWinningLineIdx(spinResult.winningLines[prevIdx].lineIndex);
  };

  // Winning line details for Oregon Lottery style banner
  const activeWin = useMemo(() => {
    if (!spinResult || activeWinningLineIdx === null) return null;
    return spinResult.winningLines.find((w) => w.lineIndex === activeWinningLineIdx) || null;
  }, [spinResult, activeWinningLineIdx]);

  // Winning coordinates for symbol highlight
  const winningCoordsMap = useMemo(() => {
    const map = new Map<number, Set<number>>();
    for (let r = 0; r < 5; r++) map.set(r, new Set<number>());

    const isAnyReelSpinning = reelSpinning.some(Boolean);
    if (spinResult && !isSpinning && !isAnyReelSpinning) {
      const linesToConsider =
        activeWinningLineIdx !== null
          ? spinResult.winningLines.filter((w) => w.lineIndex === activeWinningLineIdx)
          : spinResult.winningLines;

      linesToConsider.forEach((line) => {
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
      className={`relative w-full max-w-4xl mx-auto px-1 sm:px-3 select-none ${
        isSpinning ? 'cursor-pointer' : ''
      }`}
      title={isSpinning ? 'Click anywhere to Quick Stop' : undefined}
    >
      {/* Outer Luxury Cabinet Frame */}
      <div
        className={`relative p-2.5 sm:p-4 rounded-2xl sm:rounded-3xl transition-all duration-500 shadow-2xl ${
          freeSpinsRemaining > 0
            ? 'bg-gradient-to-b from-amber-600 via-yellow-700 to-amber-950 shadow-[0_0_50px_rgba(245,158,11,0.6)] border-2 border-yellow-400'
            : 'bg-gradient-to-b from-casino-800 via-casino-900 to-black shadow-[0_15px_40px_rgba(0,0,0,0.9)] border border-white/10'
        }`}
      >
        {/* Flashing Marquee Bulbs Header */}
        <div className="flex items-center justify-between pb-2.5 px-2 border-b border-white/10 mb-2.5">
          <div className="flex items-center space-x-1.5 sm:space-x-2">
            {[...Array(6)].map((_, i) => (
              <div
                key={i}
                className="w-2 sm:w-2.5 h-2 sm:h-2.5 rounded-full bg-gold-bright shadow-[0_0_8px_#F59E0B] animate-pulse"
                style={{ animationDelay: `${i * 150}ms` }}
              />
            ))}
          </div>

          {/* Oregon Lottery Style Active Marquee Win / Info Header */}
          <div className="text-center flex-1 px-2">
            {freeSpinsRemaining > 0 ? (
              <span className="text-xs sm:text-sm font-black tracking-widest uppercase text-yellow-300 animate-bounce">
                🔥 FREE SPINS ACTIVE: {freeSpinsRemaining} REMAINING (3X WINS) 🔥
              </span>
            ) : isSpinning ? (
              <span className="text-xs sm:text-sm font-black tracking-widest uppercase text-amber-300 animate-pulse">
                ⚡ REELS SPINNING • CLICK TO QUICK STOP ⚡
              </span>
            ) : hoveredLineIndex !== null ? (
              <span className="text-xs sm:text-sm font-black tracking-wider uppercase text-neon-cyan">
                PAYLINE {hoveredLineIndex + 1} PATH PREVIEW
              </span>
            ) : activeWin ? (
              <div className="flex items-center justify-center space-x-2 animate-bounce-soft">
                <button
                  onClick={handlePrevWinningLine}
                  className="p-1 rounded bg-casino-800 hover:bg-casino-700 text-white"
                >
                  <ChevronLeft className="w-3.5 h-3.5" />
                </button>
                <span className="text-xs sm:text-sm font-black tracking-wide text-gold-light">
                  <Award className="w-4 h-4 inline mr-1 text-gold-bright" />
                  LINE {activeWin.lineIndex + 1}: {activeWin.count}x {SYMBOLS[activeWin.symbolId]?.name.toUpperCase()} PAYS +{activeWin.payout.toLocaleString()} COINS!
                </span>
                <button
                  onClick={handleNextWinningLine}
                  className="p-1 rounded bg-casino-800 hover:bg-casino-700 text-white"
                >
                  <ChevronRight className="w-3.5 h-3.5" />
                </button>
              </div>
            ) : (
              <span className="text-xs sm:text-sm font-black tracking-widest uppercase gold-gradient-text">
                ★ 20 FIXED PAYLINES • DELUXE OREGON LOTTERY STYLE ★
              </span>
            )}
          </div>

          <div className="flex items-center space-x-1.5 sm:space-x-2">
            {[...Array(6)].map((_, i) => (
              <div
                key={i}
                className="w-2 sm:w-2.5 h-2 sm:h-2.5 rounded-full bg-neon-cyan shadow-[0_0_8px_#00F0FF] animate-pulse"
                style={{ animationDelay: `${(5 - i) * 150}ms` }}
              />
            ))}
          </div>
        </div>

        {/* Central Playing Stage Flanked by Oregon Lottery Numbered Tabs */}
        <div className="flex items-center space-x-1.5 sm:space-x-2 w-full">
          {/* Left Flank: Lines 1 to 10 */}
          <PaylineSideTabs
            side="left"
            winningLines={spinResult?.winningLines || []}
            activeLineIndex={activeWinningLineIdx}
            hoveredLineIndex={hoveredLineIndex}
            onHoverLine={(idx) => setHoveredLineIndex(idx)}
            onClickLine={(idx) => {
              setActiveWinningLineIdx(idx);
              soundManager.playButtonClick();
            }}
          />

          {/* The 5 Animated Reels with SVG Payline Canvas */}
          <div className="relative flex-1 flex space-x-1 sm:space-x-2 bg-casino-950/95 p-1.5 sm:p-2.5 rounded-xl border border-white/10 shadow-inner overflow-hidden">
            {/* SVG Payline Glow Overlay */}
            <PaylineOverlay
              winningLines={spinResult?.winningLines || []}
              activeLineIndex={activeWinningLineIdx}
              previewLineIndex={hoveredLineIndex}
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

          {/* Right Flank: Lines 11 to 20 */}
          <PaylineSideTabs
            side="right"
            winningLines={spinResult?.winningLines || []}
            activeLineIndex={activeWinningLineIdx}
            hoveredLineIndex={hoveredLineIndex}
            onHoverLine={(idx) => setHoveredLineIndex(idx)}
            onClickLine={(idx) => {
              setActiveWinningLineIdx(idx);
              soundManager.playButtonClick();
            }}
          />
        </div>

        {/* Cabinet Bottom Status Bar */}
        <div className="mt-2.5 flex items-center justify-between text-[11px] text-slate-400 font-semibold px-2">
          <div className="flex items-center space-x-1.5">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
            <span>PAYOUT RATE: 95.8% RTP</span>
          </div>

          {spinResult && !isSpinning && spinResult.winningLines.length > 0 && (
            <div className="text-gold-bright font-black animate-pulse text-xs">
              {spinResult.winningLines.length} WINNING LINE(S) PAID OUT!
            </div>
          )}

          <div className="tracking-wide">HOVER SIDE NUMBERS (1-20) TO VIEW LINES</div>
        </div>
      </div>
    </div>
  );
};
