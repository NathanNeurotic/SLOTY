import React, { useEffect, useState, useMemo, useRef, useCallback } from 'react';
import type { SpinResult, SymbolGrid } from '../../engine/types';
import { Reel } from './Reel';
import { PaylineOverlay } from './PaylineOverlay';
import { PaylineSideTabs } from './PaylineSideTabs';
import { FloatingWins } from './FloatingWins';
import { SlotLever } from './SlotLever';
import { soundManager } from '../../audio/soundManager';
import { ChevronLeft, ChevronRight, Award } from 'lucide-react';
import { SYMBOLS } from '../../engine/symbols';

interface SlotMachineProps {
  currentGrid: SymbolGrid;
  isSpinning: boolean;
  spinResult: SpinResult | null;
  isTurbo: boolean;
  selectedLines: number;
  onSelectLines?: (linesCount: number) => void;
  onAllReelsStopped: () => void;
  freeSpinsRemaining: number;
  onQuickStop?: () => void;
  onSpin?: () => void;
  canSpin?: boolean;
  isFeverMode?: boolean;
}

export const SlotMachine: React.FC<SlotMachineProps> = ({
  currentGrid,
  isSpinning,
  spinResult,
  isTurbo,
  selectedLines,
  onSelectLines,
  onAllReelsStopped,
  freeSpinsRemaining,
  onQuickStop,
  onSpin,
  canSpin = true,
  isFeverMode = false,
}) => {
  // Track spinning state per reel [0..4]
  const [reelSpinning, setReelSpinning] = useState<boolean[]>([false, false, false, false, false]);
  const [activeWinningLineIdx, setActiveWinningLineIdx] = useState<number | null>(null);
  const [hoveredLineIndex, setHoveredLineIndex] = useState<number | null>(null);

  // References to active stop timers
  const timersRef = useRef<number[]>([]);

  // Keep a ref to onAllReelsStopped to prevent recreation of effect timers
  const onAllReelsStoppedRef = useRef(onAllReelsStopped);
  useEffect(() => {
    onAllReelsStoppedRef.current = onAllReelsStopped;
  });

  const isAnyReelSpinning = isSpinning || reelSpinning.some(Boolean);

  // Function to perform immediate quick-stop
  const triggerQuickStop = useCallback(() => {
    timersRef.current.forEach((t) => clearTimeout(t));
    timersRef.current = [];

    setReelSpinning([false, false, false, false, false]);
    soundManager.playReelStop(4);

    if (onAllReelsStoppedRef.current) {
      onAllReelsStoppedRef.current();
    }
  }, []);

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

      // Realistic casino spin durations: ~2s total for watchable, dramatic roll
      const baseDelays = isTurbo
        ? [180, 320, 460, 600, 750]
        : anticipation
        ? [800, 1150, 2000, 2550, 3100] // Extended suspense build-up
        : [800, 1150, 1450, 1750, 2050];

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
            if (onAllReelsStoppedRef.current) {
              onAllReelsStoppedRef.current();
            }
          } else if (anticipation && reelIdx >= 1) {
            soundManager.playAnticipationHeartbeat();
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
  }, [isSpinning, isTurbo, currentGrid]);

  // Cycle through winning lines when idle after a win
  useEffect(() => {
    if (!isAnyReelSpinning && spinResult && spinResult.winningLines.length > 0) {
      if (activeWinningLineIdx === null) {
        setActiveWinningLineIdx(spinResult.winningLines[0].lineIndex);
        soundManager.playLaserZap();
      }
      const interval = setInterval(() => {
        setActiveWinningLineIdx((prev) => {
          if (prev === null) return spinResult.winningLines[0]?.lineIndex ?? 0;
          const currentIdx = spinResult.winningLines.findIndex((w) => w.lineIndex === prev);
          const nextIdx = (currentIdx + 1) % spinResult.winningLines.length;
          soundManager.playLaserZap();
          return spinResult.winningLines[nextIdx]?.lineIndex ?? 0;
        });
      }, 1900);
      return () => clearInterval(interval);
    } else {
      setActiveWinningLineIdx(null);
    }
  }, [isAnyReelSpinning, spinResult, activeWinningLineIdx]);

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
    if (isAnyReelSpinning || !spinResult || activeWinningLineIdx === null) return null;
    return spinResult.winningLines.find((w) => w.lineIndex === activeWinningLineIdx) || null;
  }, [isAnyReelSpinning, spinResult, activeWinningLineIdx]);

  // Winning coordinates for symbol highlight
  const winningCoordsMap = useMemo(() => {
    const map = new Map<number, Set<number>>();
    for (let r = 0; r < 5; r++) map.set(r, new Set<number>());

    if (spinResult && !isAnyReelSpinning) {
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
  }, [spinResult, isAnyReelSpinning, activeWinningLineIdx]);

  // Compute scatter coordinates
  const scatterCoordsMap = useMemo(() => {
    const map = new Map<number, Set<number>>();
    for (let r = 0; r < 5; r++) map.set(r, new Set<number>());

    if (spinResult && !isAnyReelSpinning && spinResult.scatterCoords.length >= 2) {
      spinResult.scatterCoords.forEach(([reel, row]) => {
        map.get(reel)?.add(row);
      });
    }
    return map;
  }, [spinResult, isAnyReelSpinning]);

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
      {/* 3D Interactive Vegas Slot Pull-Arm Lever */}
      <SlotLever
        isSpinning={isSpinning}
        disabled={!canSpin}
        onPull={() => {
          if (onSpin) onSpin();
        }}
      />

      {/* Outer Luxury Cabinet Frame */}
      <div
        className={`relative p-2 sm:p-3.5 rounded-2xl sm:rounded-3xl transition-all duration-300 shadow-2xl ${
          isFeverMode
            ? 'bg-gradient-to-b from-red-900 via-purple-950 to-amber-950 shadow-[0_0_60px_rgba(234,179,8,0.7)] border-2 border-yellow-300'
            : freeSpinsRemaining > 0
            ? 'bg-gradient-to-b from-amber-600 via-yellow-700 to-amber-950 shadow-[0_0_50px_rgba(245,158,11,0.6)] border-2 border-yellow-400'
            : 'bg-gradient-to-b from-casino-800 via-casino-900 to-black shadow-[0_15px_40px_rgba(0,0,0,0.9)] border border-white/10'
        }`}
      >
        {/* Flashing Marquee Bulbs Header: FIXED STRICT HEIGHT to prevent frame jumping */}
        <div className="flex items-center justify-between h-10 sm:h-12 px-2 border-b border-white/10 mb-2 overflow-hidden flex-shrink-0">
          <div className="flex items-center space-x-1 sm:space-x-1.5 flex-shrink-0">
            {[...Array(6)].map((_, i) => (
              <div
                key={i}
                className={`w-2 sm:w-2.5 h-2 sm:h-2.5 rounded-full transition-all duration-150 ${
                  activeWin
                    ? 'bg-amber-300 shadow-[0_0_12px_#FCD34D] animate-ping'
                    : isAnyReelSpinning
                    ? 'bg-gold-bright shadow-[0_0_10px_#F59E0B] animate-pulse'
                    : 'bg-gold-bright shadow-[0_0_6px_#F59E0B]'
                }`}
                style={{
                  animationDuration: isAnyReelSpinning ? '250ms' : activeWin ? '600ms' : '1200ms',
                  animationDelay: `${i * (isAnyReelSpinning ? 70 : 150)}ms`,
                }}
              />
            ))}
          </div>

          {/* Oregon Lottery Style Active Marquee Win / Info Header (Strictly Single-line, No Wrapping) */}
          <div className="text-center flex-1 px-1 sm:px-3 overflow-hidden flex items-center justify-center">
            {freeSpinsRemaining > 0 ? (
              <span className="text-xs sm:text-sm font-black tracking-widest uppercase text-yellow-300 animate-pulse truncate whitespace-nowrap">
                🔥 FREE SPINS ACTIVE: {freeSpinsRemaining} REMAINING (3X WINS) 🔥
              </span>
            ) : isAnyReelSpinning ? (
              <span className="text-xs sm:text-sm font-black tracking-widest uppercase text-amber-300 animate-pulse truncate whitespace-nowrap">
                ⚡ REELS SPINNING • CLICK TO QUICK STOP ⚡
              </span>
            ) : hoveredLineIndex !== null ? (
              <span className="text-xs sm:text-sm font-black tracking-wider uppercase text-neon-cyan truncate whitespace-nowrap">
                PAYLINE {hoveredLineIndex + 1} PATH PREVIEW
              </span>
            ) : activeWin ? (
              <div className="flex items-center justify-center space-x-1.5 sm:space-x-2 truncate whitespace-nowrap animate-pulse">
                <button
                  onClick={handlePrevWinningLine}
                  className="p-1 rounded-md vlt-btn-stepper text-white flex-shrink-0"
                  title="Previous Winning Line"
                >
                  <ChevronLeft className="w-3.5 h-3.5 text-cyan-300" />
                </button>
                <span className="text-xs sm:text-sm font-black tracking-wide text-gold-light truncate drop-shadow-[0_0_8px_rgba(251,191,36,0.8)]">
                  <Award className="w-4 h-4 inline mr-1 text-gold-bright flex-shrink-0 animate-pulse" />
                  LINE {activeWin.lineIndex + 1}: {activeWin.count}x {SYMBOLS[activeWin.symbolId]?.name.toUpperCase()} (+{activeWin.payout.toLocaleString()} COINS)
                </span>
                <button
                  onClick={handleNextWinningLine}
                  className="p-1 rounded-md vlt-btn-stepper text-white flex-shrink-0"
                  title="Next Winning Line"
                >
                  <ChevronRight className="w-3.5 h-3.5 text-cyan-300" />
                </button>
              </div>
            ) : (
              <span className="text-xs sm:text-sm font-black tracking-widest uppercase gold-gradient-text truncate whitespace-nowrap">
                ★ {selectedLines} PAYLINES • DELUXE OREGON LOTTERY STYLE ★
              </span>
            )}
          </div>

          <div className="flex items-center space-x-1 sm:space-x-1.5 flex-shrink-0">
            {[...Array(6)].map((_, i) => (
              <div
                key={i}
                className={`w-2 sm:w-2.5 h-2 sm:h-2.5 rounded-full transition-all duration-150 ${
                  activeWin
                    ? 'bg-neon-cyan shadow-[0_0_12px_#00F0FF] animate-ping'
                    : isAnyReelSpinning
                    ? 'bg-neon-cyan shadow-[0_0_10px_#00F0FF] animate-pulse'
                    : 'bg-neon-cyan shadow-[0_0_6px_#00F0FF]'
                }`}
                style={{
                  animationDuration: isAnyReelSpinning ? '250ms' : activeWin ? '600ms' : '1200ms',
                  animationDelay: `${(5 - i) * (isAnyReelSpinning ? 70 : 150)}ms`,
                }}
              />
            ))}
          </div>
        </div>

        {/* Central Playing Stage Flanked by Oregon Lottery Numbered Tabs */}
        <div className="flex items-center space-x-1 sm:space-x-2 w-full">
          {/* Left Flank: Lines 1 to 20 */}
          <PaylineSideTabs
            side="left"
            selectedLines={selectedLines}
            winningLines={!isAnyReelSpinning ? (spinResult?.winningLines || []) : []}
            activeLineIndex={!isAnyReelSpinning ? activeWinningLineIdx : null}
            hoveredLineIndex={hoveredLineIndex}
            onHoverLine={(idx) => setHoveredLineIndex(idx)}
            onClickLine={(idx) => {
              setActiveWinningLineIdx(idx);
              soundManager.playButtonClick();
            }}
            onSelectLines={onSelectLines}
          />

          {/* The 5 Animated Reels with SVG Payline Canvas */}
          <div className="relative flex-1 flex space-x-1 sm:space-x-1.5 bg-casino-950/95 p-1 sm:p-2 rounded-xl border border-white/10 shadow-inner overflow-hidden h-[320px] sm:h-[400px] md:h-[480px]">
            {/* SVG Payline Glow Overlay: strictly hidden while reels are spinning */}
            <PaylineOverlay
              winningLines={!isAnyReelSpinning ? (spinResult?.winningLines || []) : []}
              activeLineIndex={!isAnyReelSpinning ? activeWinningLineIdx : null}
              previewLineIndex={hoveredLineIndex}
            />

            {/* Floating Win Badges on Active Winning Paylines */}
            {!isAnyReelSpinning && activeWin && (
              <FloatingWins activeWin={activeWin} />
            )}

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

          {/* Right Flank: Lines 21 to 40 */}
          <PaylineSideTabs
            side="right"
            selectedLines={selectedLines}
            winningLines={!isAnyReelSpinning ? (spinResult?.winningLines || []) : []}
            activeLineIndex={!isAnyReelSpinning ? activeWinningLineIdx : null}
            hoveredLineIndex={hoveredLineIndex}
            onHoverLine={(idx) => setHoveredLineIndex(idx)}
            onClickLine={(idx) => {
              setActiveWinningLineIdx(idx);
              soundManager.playButtonClick();
            }}
            onSelectLines={onSelectLines}
          />
        </div>

        {/* Cabinet Bottom Status Bar - Strictly Fixed Height */}
        <div className="h-6 overflow-hidden flex items-center justify-between text-[10px] sm:text-[11px] text-slate-400 font-semibold px-2 mt-2 truncate whitespace-nowrap flex-shrink-0">
          <div className="flex items-center space-x-1.5 flex-shrink-0">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
            <span>PAYOUT RATE: 95.8% RTP</span>
          </div>

          <div className="text-gold-bright font-black text-xs truncate px-2 text-center flex-1">
            {!isAnyReelSpinning && spinResult && spinResult.winningLines.length > 0 ? (
              <span className="animate-pulse">{spinResult.winningLines.length} WINNING LINE(S) PAID OUT!</span>
            ) : null}
          </div>

          <div className="tracking-wide flex-shrink-0 hidden sm:block">HOVER (1-40) FOR LINES</div>
        </div>
      </div>
    </div>
  );
};
