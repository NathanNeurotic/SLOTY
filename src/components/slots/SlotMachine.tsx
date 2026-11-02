import React, { useEffect, useState, useMemo, useRef, useCallback } from 'react';
import type { SpinResult, SymbolGrid } from '../../engine/types';
import type { CasinoSceneId } from '../scenes/SceneTypes';
import { Reel } from './Reel';
import { PaylineOverlay } from './PaylineOverlay';
import { PaylineSideTabs } from './PaylineSideTabs';
import { FloatingWins } from './FloatingWins';
import { SlotLever } from './SlotLever';
import { ColossalSceneSlide } from '../scenes/ColossalSceneSlide';
import { soundManager } from '../../audio/soundManager';
import { CompanionLounge } from '../character/CompanionLounge';
import { ChevronLeft, ChevronRight, Award, Film } from 'lucide-react';
import { SYMBOLS } from '../../engine/symbols';
import type { GameId } from '../../games/types';
import { getGame } from '../../games/gameRegistry';

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
  currentSceneId?: CasinoSceneId;
  onRewardCoins?: (amount: number) => void;
  activeGameId?: GameId;
  isFloorMode?: boolean;
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
  currentSceneId = 'VAULT',
  onRewardCoins,
  activeGameId = 'vault-24k',
  isFloorMode = false,
}) => {
  const gameDef = getGame(activeGameId);
  const isTimber = activeGameId === 'timber-critters';
  const rowCount = gameDef.rows;
  const totalLines = gameDef.defaultLines;
  // Track spinning state per reel [0..4]
  const [reelSpinning, setReelSpinning] = useState<boolean[]>([false, false, false, false, false]);
  const [activeWinningLineIdx, setActiveWinningLineIdx] = useState<number | null>(null);
  const [hoveredLineIndex, setHoveredLineIndex] = useState<number | null>(null);
  const [isColossalSlideOpen, setIsColossalSlideOpen] = useState(false);
  const [isCabinetSlamming, setIsCabinetSlamming] = useState(false);

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

    soundManager.stopSpinRollLoop();
    setReelSpinning([false, false, false, false, false]);
    soundManager.playReelStop(4);
    setIsCabinetSlamming(true);
    setTimeout(() => setIsCabinetSlamming(false), 380);

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

      // Start the continuous stimulating Deluxe Casino reel roll arpeggio & stepper ticker
      soundManager.startSpinRollLoop(isFeverMode);

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
            soundManager.stopSpinRollLoop();
            setIsCabinetSlamming(true);
            setTimeout(() => setIsCabinetSlamming(false), 380);
            if (onAllReelsStoppedRef.current) {
              onAllReelsStoppedRef.current();
            }
          } else if (anticipation && reelIdx >= 1) {
            soundManager.updateSpinRollAnticipation();
            soundManager.playAnticipationHeartbeat();
          }
        }, delay);

        timersRef.current.push(timerId);
      });
    } else {
      soundManager.stopSpinRollLoop();
      timersRef.current.forEach((t) => clearTimeout(t));
      timersRef.current = [];
      setReelSpinning([false, false, false, false, false]);
    }

    return () => {
      soundManager.stopSpinRollLoop();
      timersRef.current.forEach((t) => clearTimeout(t));
    };
  }, [isSpinning, isTurbo, currentGrid, isFeverMode]);

  // Audio reaction for active winning paylines with authentic critter voices
  const playWinLineSound = useCallback((symId: string) => {
    if (isTimber) {
      switch (symId) {
        case 'BEAR':
          soundManager.playGrizzlyRoar();
          break;
        case 'WOLF':
          soundManager.playWolfHowl();
          break;
        case 'FOX':
          soundManager.playFoxYip();
          break;
        case 'OWL':
          soundManager.playOwlHoot(2);
          break;
        case 'ACORN':
          soundManager.playAcornChime();
          break;
        case 'SQUIRREL':
          soundManager.playSquirrelChatter();
          break;
        default:
          soundManager.playForestWin(1);
          break;
      }
    } else {
      soundManager.playLaserZap();
    }
  }, [isTimber]);

  // Cycle through winning lines when idle after a win
  useEffect(() => {
    if (!isAnyReelSpinning && spinResult && spinResult.winningLines.length > 0) {
      if (activeWinningLineIdx === null) {
        const firstLine = spinResult.winningLines[0];
        setActiveWinningLineIdx(firstLine.lineIndex);
        playWinLineSound(firstLine.symbolId);
      }
      const interval = setInterval(() => {
        setActiveWinningLineIdx((prev) => {
          if (prev === null) {
            const first = spinResult.winningLines[0];
            playWinLineSound(first.symbolId);
            return first.lineIndex;
          }
          const currentIdx = spinResult.winningLines.findIndex((w) => w.lineIndex === prev);
          const nextIdx = (currentIdx + 1) % spinResult.winningLines.length;
          const nextLine = spinResult.winningLines[nextIdx];
          playWinLineSound(nextLine.symbolId);
          return nextLine.lineIndex;
        });
      }, 1900);
      return () => clearInterval(interval);
    } else {
      setActiveWinningLineIdx(null);
    }
  }, [isAnyReelSpinning, spinResult, activeWinningLineIdx, playWinLineSound]);

  // Manual navigation of winning lines
  const handleNextWinningLine = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (!spinResult || spinResult.winningLines.length === 0) return;
    const currentIdx = spinResult.winningLines.findIndex((w) => w.lineIndex === activeWinningLineIdx);
    const nextIdx = (currentIdx + 1) % spinResult.winningLines.length;
    const nextLine = spinResult.winningLines[nextIdx];
    setActiveWinningLineIdx(nextLine.lineIndex);
    playWinLineSound(nextLine.symbolId);
  };

  const handlePrevWinningLine = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (!spinResult || spinResult.winningLines.length === 0) return;
    const currentIdx = spinResult.winningLines.findIndex((w) => w.lineIndex === activeWinningLineIdx);
    const prevIdx = (currentIdx - 1 + spinResult.winningLines.length) % spinResult.winningLines.length;
    const prevLine = spinResult.winningLines[prevIdx];
    setActiveWinningLineIdx(prevLine.lineIndex);
    playWinLineSound(prevLine.symbolId);
  };

  // Winning line details for Deluxe Casino style banner
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

  const handleToggleColossalSlide = (e: React.MouseEvent) => {
    e.stopPropagation();
    soundManager.playVaultSlide();
    setIsColossalSlideOpen((prev) => !prev);
  };

  return (
    <div
      onClick={handleStageClick}
      className={`relative w-full max-w-4xl mx-auto px-1 sm:px-3 select-none ${
        isSpinning ? 'cursor-pointer' : ''
      }`}
      title={isSpinning ? 'Click anywhere to Quick Stop' : undefined}
    >
      {/* Desktop Hostess Flank: Ruby Sparkle cleanly placed beside the cabinet (hidden in floor mode to prevent overlapping neighbor terminals) */}
      <div className={`${isFloorMode ? 'hidden' : 'hidden 2xl:block'} absolute -left-64 top-8 z-20`}>
        <CompanionLounge
          position="desktop-flank"
          isSpinning={isSpinning}
          isAnticipating={isAnticipating}
          isWinning={!isAnyReelSpinning && !!spinResult && spinResult.totalPayout > 0}
          isBigWin={!isAnyReelSpinning && !!spinResult && spinResult.totalPayout >= 500}
          isFeverMode={isFeverMode}
          winAmount={spinResult?.totalPayout || 0}
          onRewardCoins={onRewardCoins}
          activeGameId={activeGameId}
        />
      </div>

      {/* Responsive VIP Companion Lounge Bar (hidden on small phones to maximize reel height) */}
      <div className="hidden md:flex 2xl:hidden justify-center mb-1 w-full px-1">
        <CompanionLounge
          position="mobile-bar"
          isSpinning={isSpinning}
          isAnticipating={isAnticipating}
          isWinning={!isAnyReelSpinning && !!spinResult && spinResult.totalPayout > 0}
          isBigWin={!isAnyReelSpinning && !!spinResult && spinResult.totalPayout >= 500}
          isFeverMode={isFeverMode}
          winAmount={spinResult?.totalPayout || 0}
          onRewardCoins={onRewardCoins}
          activeGameId={activeGameId}
        />
      </div>

      {/* 3D Interactive Vegas Slot Pull-Arm Lever (hidden in floor mode to prevent overlapping neighbor machine) */}
      {!isFloorMode && (
        <SlotLever
          isSpinning={isSpinning}
          disabled={!canSpin}
          onPull={() => {
            if (onSpin) onSpin();
          }}
        />
      )}

      {/* Handcrafted Rustic Log Pediment Crest for Timberland Critters */}
      {isTimber && (
        <div className="w-full flex justify-center -mb-2 relative z-20 pointer-events-none">
          <div className="flex items-center space-x-2 px-5 py-1.5 rounded-t-2xl bg-gradient-to-r from-[#2e180e] via-[#451a03] to-[#2e180e] border-t-2 border-x-2 border-[#b45309] shadow-[0_-6px_15px_rgba(0,0,0,0.85)]">
            <span className="text-amber-400 text-sm animate-pulse">🌲</span>
            <span className="text-[10px] sm:text-xs font-black tracking-widest text-[#fde047] uppercase font-sans drop-shadow-[0_2px_4px_rgba(0,0,0,0.9)]">
              HANDCRAFTED TIMBER CABIN
            </span>
            <span className="text-amber-400 text-sm animate-pulse">🌲</span>
          </div>
        </div>
      )}

      {/* Outer Luxury Cabinet Frame with Handcrafted Theming */}
      <div
        className={`relative p-[3px] rounded-2xl sm:rounded-3xl transition-all ${
          isTimber
            ? 'border-4 border-[#78350f] bg-gradient-to-b from-[#2e180e] via-[#1a0d07] to-[#0d0603] shadow-[0_0_40px_rgba(16,185,129,0.5),0_20px_50px_rgba(0,0,0,0.95)]'
            : 'neon-chase-border shadow-[0_0_35px_rgba(245,158,11,0.4)]'
        }`}
      >
        <div
          className={`relative p-2 sm:p-3.5 rounded-[14px] sm:rounded-[22px] transition-all duration-300 shadow-2xl ${
            isCabinetSlamming ? 'animate-cabinet-slam' : ''
          } ${
            isFeverMode
              ? isTimber
                ? 'bg-gradient-to-b from-emerald-950 via-teal-950 to-amber-950 border-2 border-emerald-300 shadow-[0_0_60px_rgba(52,211,153,0.7)]'
                : 'bg-gradient-to-b from-red-900 via-purple-950 to-amber-950 shadow-[0_0_60px_rgba(234,179,8,0.7)] border-2 border-yellow-300'
              : freeSpinsRemaining > 0
              ? isTimber
                ? 'bg-gradient-to-b from-emerald-900 via-stone-900 to-[#120a05] shadow-[0_0_50px_rgba(16,185,129,0.6)] border-2 border-emerald-400'
                : 'bg-gradient-to-b from-amber-600 via-yellow-700 to-amber-950 shadow-[0_0_50px_rgba(245,158,11,0.6)] border-2 border-yellow-400'
              : isTimber
              ? 'bg-gradient-to-b from-[#182a1d] via-[#0d1810] to-[#050a06] shadow-[0_15px_40px_rgba(0,0,0,0.95)] border-2 border-emerald-700/50'
              : 'bg-gradient-to-b from-casino-800 via-casino-900 to-black shadow-[0_15px_40px_rgba(0,0,0,0.9)] border border-white/10'
          }`}
        >
          {/* 4 Ornate Corner Brackets */}
          <div className="absolute top-1.5 left-1.5 w-5 h-5 border-t-2 border-l-2 border-yellow-300 rounded-tl pointer-events-none z-30 flex items-start justify-start p-0.5">
            <div className={`w-1.5 h-1.5 rounded-full ${isTimber ? 'bg-amber-400 shadow-[0_0_6px_#F59E0B]' : 'bg-yellow-200 shadow-[0_0_6px_#FEF08A]'}`} />
          </div>
          <div className="absolute top-1.5 right-1.5 w-5 h-5 border-t-2 border-r-2 border-yellow-300 rounded-tr pointer-events-none z-30 flex items-start justify-end p-0.5">
            <div className={`w-1.5 h-1.5 rounded-full ${isTimber ? 'bg-amber-400 shadow-[0_0_6px_#F59E0B]' : 'bg-yellow-200 shadow-[0_0_6px_#FEF08A]'}`} />
          </div>
          <div className="absolute bottom-1.5 left-1.5 w-5 h-5 border-b-2 border-l-2 border-yellow-300 rounded-bl pointer-events-none z-30 flex items-end justify-start p-0.5">
            <div className={`w-1.5 h-1.5 rounded-full ${isTimber ? 'bg-amber-400 shadow-[0_0_6px_#F59E0B]' : 'bg-yellow-200 shadow-[0_0_6px_#FEF08A]'}`} />
          </div>
          <div className="absolute bottom-1.5 right-1.5 w-5 h-5 border-b-2 border-r-2 border-yellow-300 rounded-br pointer-events-none z-30 flex items-end justify-end p-0.5">
            <div className={`w-1.5 h-1.5 rounded-full ${isTimber ? 'bg-amber-400 shadow-[0_0_6px_#F59E0B]' : 'bg-yellow-200 shadow-[0_0_6px_#FEF08A]'}`} />
          </div>

        {/* Flashing Marquee Bulbs Header: FIXED STRICT HEIGHT to prevent frame jumping */}
        <div className="flex items-center justify-between h-10 sm:h-12 px-2 border-b border-white/10 mb-2 overflow-hidden flex-shrink-0">
          <div className="flex items-center space-x-1 sm:space-x-1.5 flex-shrink-0">
            {[...Array(6)].map((_, i) => (
              <div
                key={i}
                className={`w-2 sm:w-2.5 h-2 sm:h-2.5 rounded-full transition-all duration-150 ${
                  isTimber
                    ? i % 2 === 0
                      ? 'bg-emerald-400 shadow-[0_0_8px_#34D399]'
                      : 'bg-amber-400 shadow-[0_0_8px_#FBBF24]'
                    : activeWin
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

          {/* Active Marquee Win / Info Header (Strictly Single-line, No Wrapping) */}
          <div className="text-center flex-1 px-1 sm:px-3 overflow-hidden flex items-center justify-center">
            {freeSpinsRemaining > 0 ? (
              <span className={`text-xs sm:text-sm font-black tracking-widest uppercase animate-pulse truncate whitespace-nowrap ${
                isTimber ? 'text-emerald-300' : 'text-yellow-300'
              }`}>
                {isTimber
                  ? `🦉 MOONLIT FREE SPINS: ${freeSpinsRemaining} REMAINING (3X WINS) 🦉`
                  : `🔥 FREE SPINS ACTIVE: ${freeSpinsRemaining} REMAINING (3X WINS) 🔥`}
              </span>
            ) : isAnticipating && isAnyReelSpinning ? (
              <span className={`text-xs sm:text-sm font-black tracking-widest uppercase animate-pulse truncate whitespace-nowrap px-2.5 py-0.5 rounded-full border ${
                isTimber
                  ? 'text-emerald-200 bg-emerald-950/80 border-emerald-400 shadow-[0_0_12px_rgba(52,211,153,0.8)]'
                  : 'text-cyan-200 bg-cyan-950/80 border-neon-cyan shadow-[0_0_12px_rgba(0,240,255,0.8)]'
              }`}>
                {isTimber
                  ? '🍃 SUSPENSE LOCK! 2 OWLS • NEED 1 MORE! 🍃'
                  : '⚡⚡ SUSPENSE LOCK! 2 VAULT DOORS • NEED 1 MORE! ⚡⚡'}
              </span>
            ) : isAnyReelSpinning ? (
              <span className={`text-xs sm:text-sm font-black tracking-widest uppercase animate-pulse truncate whitespace-nowrap ${
                isTimber ? 'text-emerald-300' : 'text-amber-300'
              }`}>
                {isTimber ? '🌲 CRITTERS TUMBLING • CLICK TO QUICK STOP 🌲' : '⚡ REELS SPINNING • CLICK TO QUICK STOP ⚡'}
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
                  LINE {activeWin.lineIndex + 1}: {activeWin.count}x {(gameDef.symbols[activeWin.symbolId]?.name || SYMBOLS[activeWin.symbolId]?.name || '').toUpperCase()} (+{activeWin.payout.toLocaleString()} COINS)
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
              <span className={`text-xs sm:text-sm font-black tracking-widest uppercase truncate whitespace-nowrap ${isTimber ? 'text-emerald-300 drop-shadow-[0_0_8px_rgba(16,185,129,0.8)]' : 'gold-gradient-text'}`}>
                {gameDef.theme.marqueeTitle}
              </span>
            )}
          </div>

          {/* Right Header Controls: Colossal Scene Slide Toggle & Flashing Bulbs */}
          <div className="flex items-center space-x-1 sm:space-x-1.5 flex-shrink-0">
            {/* Interactive Full Slot Slide Button */}
            <button
              onClick={handleToggleColossalSlide}
              className={`flex items-center space-x-1 px-2 py-0.5 rounded-lg border text-[9px] font-black uppercase transition-all ${
                isColossalSlideOpen
                  ? 'bg-amber-400 text-black border-white shadow-[0_0_10px_#F59E0B]'
                  : 'bg-casino-900/80 text-yellow-300 border-yellow-400/30 hover:border-yellow-400'
              }`}
              title="Toggle Full Slot Panoramic Scene Slide"
            >
              <Film className="w-3 h-3" />
              <span className="hidden sm:inline">SCENE SLIDE</span>
            </button>

            {[...Array(3)].map((_, i) => (
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
                  animationDelay: `${(3 - i) * (isAnyReelSpinning ? 70 : 150)}ms`,
                }}
              />
            ))}
          </div>
        </div>

        {/* Central Playing Stage Flanked by Deluxe VLT Numbered Tabs */}
        <div className="flex items-center space-x-1 sm:space-x-2 w-full">
          {/* Left Flank */}
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
            totalLinesCount={totalLines}
          />

          {/* The 5 Animated Reels with SVG Payline Canvas */}
          <div className={`relative flex-1 flex space-x-1 sm:space-x-1.5 p-1 sm:p-2 rounded-xl border shadow-inner overflow-hidden h-[210px] xs:h-[240px] sm:h-[340px] md:h-[420px] ${
            isTimber
              ? 'bg-[#040e07]/95 border-emerald-800/60 shadow-[inset_0_0_20px_rgba(0,0,0,0.9)]'
              : 'bg-casino-950/95 border-white/10'
          }`}>
            {/* SVG Payline Glow Overlay: strictly hidden while reels are spinning */}
            <PaylineOverlay
              winningLines={!isAnyReelSpinning ? (spinResult?.winningLines || []) : []}
              activeLineIndex={!isAnyReelSpinning ? activeWinningLineIdx : null}
              previewLineIndex={hoveredLineIndex}
              rowCount={rowCount}
              paylines={gameDef.paylines}
            />

            {/* Floating Win Badges on Active Winning Paylines */}
            {!isAnyReelSpinning && activeWin && (
              <FloatingWins activeWin={activeWin} />
            )}

            {/* Full Slot Panoramic Scene Slide (Middle 3 Reels Merge) */}
            {isColossalSlideOpen && !isAnyReelSpinning && (
              <div className="absolute inset-x-16 sm:inset-x-24 inset-y-2 z-25">
                <ColossalSceneSlide
                  sceneId={currentSceneId}
                  multiplier={freeSpinsRemaining > 0 ? 3 : isFeverMode ? 2 : 1}
                  onClose={() => setIsColossalSlideOpen(false)}
                />
              </div>
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
                rowCount={rowCount}
                gameId={activeGameId}
              />
            ))}
          </div>

          {/* Right Flank */}
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
            totalLinesCount={totalLines}
          />
        </div>

        {/* Cabinet Bottom Status Bar - Strictly Fixed Height with Themed Speakers */}
        <div className="h-7 overflow-hidden flex items-center justify-between text-[10px] sm:text-[11px] text-slate-400 font-semibold px-2 mt-2 truncate whitespace-nowrap flex-shrink-0 border-t border-white/5 pt-1">
          {/* Left Speaker */}
          <div className="flex items-center space-x-1.5 flex-shrink-0">
            <div
              className={`w-4 h-4 rounded-full border flex items-center justify-center shadow-md ${
                isTimber
                  ? 'border-amber-600/70 bg-gradient-to-br from-stone-800 via-stone-900 to-black shadow-[0_0_6px_rgba(245,158,11,0.5)]'
                  : 'border-yellow-400/60 bg-gradient-to-br from-slate-700 via-slate-900 to-black shadow-[0_0_6px_rgba(245,158,11,0.6)]'
              } ${isSpinning ? 'animate-subwoofer' : ''}`}
              title={isTimber ? "Acoustic Forest Speakers" : "Vegas Subwoofer Sound System"}
            >
              <div className={`w-2 h-2 rounded-full border flex items-center justify-center ${
                isTimber ? 'border-emerald-500 bg-stone-950' : 'border-cyan-400 bg-black'
              }`}>
                <div className={`w-0.5 h-0.5 rounded-full ${isTimber ? 'bg-emerald-400' : 'bg-amber-400'}`} />
              </div>
            </div>
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-ping" />
            <span className="font-mono text-emerald-400 text-[10px]">{isTimber ? '96.2% RTP' : '95.8% RTP'}</span>
          </div>

          <div className={`font-black text-xs truncate px-2 text-center flex-1 ${isTimber ? 'text-emerald-300' : 'text-gold-bright'}`}>
            {!isAnyReelSpinning && spinResult && spinResult.winningLines.length > 0 ? (
              <span className="animate-pulse">{spinResult.winningLines.length} {isTimber ? 'CRITTER WINS HIT!' : 'CASH PAYLINES HIT!'}</span>
            ) : null}
          </div>

          {/* Right Speaker */}
          <div className="flex items-center space-x-1.5 flex-shrink-0">
            <span className={`text-[10px] hidden sm:inline tracking-wide ${isTimber ? 'text-emerald-300' : 'text-amber-300'}`}>
              SCENE: {isTimber ? 'DEEP WOODS' : currentSceneId}
            </span>
            <div
              className={`w-4 h-4 rounded-full border flex items-center justify-center shadow-md ${
                isTimber
                  ? 'border-amber-600/70 bg-gradient-to-br from-stone-800 via-stone-900 to-black shadow-[0_0_6px_rgba(245,158,11,0.5)]'
                  : 'border-yellow-400/60 bg-gradient-to-br from-slate-700 via-slate-900 to-black shadow-[0_0_6px_rgba(245,158,11,0.6)]'
              } ${isSpinning ? 'animate-subwoofer' : ''}`}
              title={isTimber ? "Acoustic Forest Speakers" : "Vegas Subwoofer Sound System"}
            >
              <div className={`w-2 h-2 rounded-full border flex items-center justify-center ${
                isTimber ? 'border-amber-500 bg-stone-950' : 'border-pink-400 bg-black'
              }`}>
                <div className={`w-0.5 h-0.5 rounded-full ${isTimber ? 'bg-amber-400' : 'bg-rose-400'}`} />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
);
};
