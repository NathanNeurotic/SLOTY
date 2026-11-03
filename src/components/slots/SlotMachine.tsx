import React, { useEffect, useState, useMemo, useRef, useCallback } from 'react';
import type { SpinResult, SymbolGrid } from '../../engine/types';
import type { CasinoSceneId } from '../scenes/SceneTypes';
import { Reel } from './Reel';
import { PaylineOverlay } from './PaylineOverlay';
import { PaylineSideTabs } from './PaylineSideTabs';
import { FloatingWins } from './FloatingWins';
import { SlotLever } from './SlotLever';
import { ColossalSceneSlide } from '../scenes/ColossalSceneSlide';
import { CabinetVentsAndWoodsFX } from '../../fx/CabinetVentsAndWoodsFX';
import { HeroWinCelebration } from './HeroWinCelebration';
import { CabinetFrameOverlay } from './CabinetFrameOverlay';
import { CabinetGlassOverlay } from './CabinetGlassOverlay';
import { soundManager } from '../../audio/soundManager';
import { ChevronLeft, ChevronRight, Award, Film, Trophy } from 'lucide-react';
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
  onOpenGamble?: () => void;
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
  onRewardCoins: _onRewardCoins,
  activeGameId = 'vault-24k',
  isFloorMode = false,
  onOpenGamble,
}) => {
  const gameDef = getGame(activeGameId);
  const isTimber = activeGameId === 'timber-critters';
  const isPixel = activeGameId === 'pixel-arcade';
  const rowCount = gameDef.rows;
  const numReels = gameDef.reels || 5;
  const totalLines = gameDef.defaultLines;

  // Track spinning state per reel dynamically
  const [reelSpinning, setReelSpinning] = useState<boolean[]>(() => Array(numReels).fill(false));
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
    setReelSpinning(Array(numReels).fill(false));
    soundManager.playReelStop(numReels - 1);
    setIsCabinetSlamming(true);
    setTimeout(() => setIsCabinetSlamming(false), 380);

    if (onAllReelsStoppedRef.current) {
      onAllReelsStoppedRef.current();
    }
  }, [numReels]);

  // Handle spin start and staggered stopping schedule with longer, more satisfying spin duration
  useEffect(() => {
    if (isSpinning) {
      setReelSpinning(Array(numReels).fill(true));
      setActiveWinningLineIdx(null);
      setHoveredLineIndex(null);

      // Start the continuous stimulating Deluxe Casino reel roll arpeggio & stepper ticker
      soundManager.startSpinRollLoop(isFeverMode);

      timersRef.current.forEach((t) => clearTimeout(t));
      timersRef.current = [];

      // Check if reels hit scatters for suspense anticipation excitement
      const scatterSym = isTimber ? 'OWL' : isPixel ? 'PIXEL_CARTRIDGE' : 'SCATTER';
      const hasScatter0 = currentGrid[0]?.includes(scatterSym);
      const hasScatter1 = currentGrid[1]?.includes(scatterSym);
      const anticipation = hasScatter0 && hasScatter1;

      // Realistic casino spin durations: satisfying 2.8s - 3.8s total roll for dramatic gameplay
      const baseDelays = Array.from({ length: numReels }, (_, i) => {
        if (isTurbo) {
          return 350 + i * 180;
        }
        if (anticipation && i >= 2) {
          // Extended suspense build-up when 2 scatters hit
          return 1900 + (i - 1) * 750;
        }
        // Satisfying mechanical deceleration: Reel 0 rolls for 1,400ms, then +450ms per reel
        return 1400 + i * 450;
      });

      baseDelays.forEach((delay, reelIdx) => {
        const timerId = window.setTimeout(() => {
          soundManager.playReelStop(reelIdx);

          if (currentGrid[reelIdx]?.includes(scatterSym)) {
            const scattersCount = currentGrid
              .slice(0, reelIdx + 1)
              .filter((col) => col.includes(scatterSym)).length;
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

  // Screen-slam tactile impact when big hit or scatter lock lands
  useEffect(() => {
    if (!isAnyReelSpinning && spinResult) {
      if (spinResult.totalPayout >= 500 || spinResult.scatterCoords.length >= 3) {
        setIsCabinetSlamming(true);
        const t = setTimeout(() => setIsCabinetSlamming(false), 450);
        return () => clearTimeout(t);
      }
    }
  }, [isAnyReelSpinning, spinResult]);

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
  const scatterSym = isTimber ? 'OWL' : 'SCATTER';
  const hasScatter0 = !reelSpinning[0] && currentGrid[0]?.includes(scatterSym);
  const hasScatter1 = !reelSpinning[1] && currentGrid[1]?.includes(scatterSym);
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
      className={`relative w-full max-w-5xl xl:max-w-6xl 2xl:max-w-7xl mx-auto px-1 sm:px-3 select-none flex flex-col flex-1 min-h-0 justify-center ${
        isSpinning ? 'cursor-pointer' : ''
      }`}
      title={isSpinning ? 'Click anywhere to Quick Stop' : undefined}
    >
      {/* 3D Interactive Mechanical Pull-Arm Slot Lever (Solo Mode only, well clear of cabinet) */}
      {!isFloorMode && (
        <SlotLever
          isSpinning={isSpinning}
          disabled={!canSpin}
          onPull={() => {
            if (onSpin) onSpin();
          }}
          activeGameId={activeGameId}
        />
      )}

      {/* Outer Luxury Cabinet Frame with Handcrafted Theming */}
      <div
        className={`relative p-[3px] rounded-2xl sm:rounded-3xl transition-all ${
          isTimber
            ? 'border-[6px] border-[#5c2b09] bg-gradient-to-b from-[#3b1d0c] via-[#200f07] to-[#0d0603] shadow-[0_0_40px_rgba(16,185,129,0.5),0_25px_60px_rgba(0,0,0,0.95)]'
            : 'border-4 border-yellow-500/80 bg-gradient-to-b from-amber-600 via-amber-950 to-black neon-chase-border shadow-[0_0_35px_rgba(245,158,11,0.4)]'
        }`}
      >
        <div
          className={`relative p-1 sm:p-3.5 rounded-[14px] sm:rounded-[22px] transition-all duration-300 shadow-2xl ${
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
              ? 'bg-gradient-to-b from-[#182a1d] via-[#0d1810] to-[#050a06] shadow-[0_15px_40px_rgba(0,0,0,0.95)] border-2 border-emerald-700/60'
              : isPixel
              ? 'bg-gradient-to-b from-[#16062c] via-[#0c031a] to-[#05010b] shadow-[0_15px_40px_rgba(0,0,0,0.95)] border-2 border-purple-500/80 shadow-[0_0_35px_rgba(139,92,246,0.5)]'
              : 'bg-gradient-to-b from-casino-800 via-casino-900 to-black shadow-[0_15px_40px_rgba(0,0,0,0.9)] border border-white/10'
          }`}
        >
          {/* Authentic Physical Cabinet Hardware Overlay (Hand-forged brackets / Art-deco brass / Neon cyber corners) */}
          <CabinetFrameOverlay
            activeGameId={activeGameId}
            isSpinning={isAnyReelSpinning}
            isFeverMode={isFeverMode}
          />

          {/* Special Effects: Hydraulic Steam Vents / Living Woodland Canopy & Critter Eyes */}
          <CabinetVentsAndWoodsFX
            activeGameId={activeGameId}
            isSpinning={isAnyReelSpinning}
            isCabinetSlamming={isCabinetSlamming}
            hasActiveWin={!!activeWin}
            isAnticipating={isAnticipating}
          />

        {/* Flashing Marquee Bulbs Header: FIXED STRICT HEIGHT to prevent frame jumping */}
        <div className="flex items-center justify-between h-8 sm:h-11 px-1.5 sm:px-2 border-b border-white/10 mb-1 sm:mb-2 overflow-hidden flex-shrink-0">
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
              <div className="flex items-center justify-center space-x-1 sm:space-x-1.5 truncate whitespace-nowrap animate-pulse min-w-0 flex-1">
                <button
                  onClick={handlePrevWinningLine}
                  className="p-0.5 sm:p-1 rounded-md vlt-btn-stepper text-white flex-shrink-0"
                  title="Previous Winning Line"
                >
                  <ChevronLeft className="w-3.5 h-3.5 text-cyan-300" />
                </button>
                <span className="text-[10.5px] sm:text-xs md:text-sm font-black tracking-tight sm:tracking-wide text-gold-light truncate drop-shadow-[0_0_8px_rgba(251,191,36,0.8)]">
                  <Award className="w-3.5 h-3.5 sm:w-4 sm:h-4 inline mr-1 text-gold-bright flex-shrink-0 animate-pulse" />
                  LINE {activeWin.lineIndex + 1}: {activeWin.count}x {(gameDef.symbols[activeWin.symbolId]?.name || SYMBOLS[activeWin.symbolId]?.name || '').toUpperCase()} (+{activeWin.payout.toLocaleString()} COINS)
                </span>
                <button
                  onClick={handleNextWinningLine}
                  className="p-0.5 sm:p-1 rounded-md vlt-btn-stepper text-white flex-shrink-0"
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

        {/* Central Playing Stage Flanked by Deluxe VLT Numbered Tabs and Architectural Pilasters */}
        <div className="flex items-center space-x-1 sm:space-x-1.5 w-full">
          {/* Left Themed Cabinet Pilaster */}
          {isTimber ? (
            <div className="hidden md:flex flex-col items-center justify-between w-4 sm:w-6 py-4 rounded-l-xl bg-gradient-to-r from-[#2a1306] via-[#451e0a] to-[#2a1306] border-y-2 border-l-2 border-[#78350f] shadow-2xl relative flex-shrink-0 self-stretch">
              <div className="w-3 h-3 rounded-full bg-[#1c0c04] border border-[#a16207] shadow-inner" />
              <div className="flex flex-col space-y-5">
                {[...Array(3)].map((_, i) => (
                  <div key={i} className="w-2.5 h-2.5 rounded-full bg-amber-950 border border-amber-600/60 shadow-md flex items-center justify-center">
                    <div className="w-1 h-1 rounded-full bg-amber-400/80 shadow-[0_0_6px_#f59e0b]" />
                  </div>
                ))}
              </div>
              <div className="w-3 h-3 rounded-full bg-[#1c0c04] border border-[#a16207] shadow-inner" />
            </div>
          ) : (
            <div className="hidden md:flex flex-col items-center justify-between w-4 sm:w-6 py-4 rounded-l-xl bg-gradient-to-r from-slate-900 via-amber-900 to-black border-y-2 border-l-2 border-yellow-500/60 shadow-2xl relative flex-shrink-0 self-stretch">
              <div className="w-3 h-3 rounded-full bg-slate-950 border border-yellow-300 shadow-inner flex items-center justify-center">
                <div className="w-1 h-1 rounded-full bg-cyan-400 shadow-[0_0_8px_#00f0ff]" />
              </div>
              <div className="flex flex-col space-y-5">
                {[...Array(3)].map((_, i) => (
                  <div key={i} className="w-3 h-1.5 rounded-xs bg-gradient-to-r from-yellow-300 to-amber-500 border border-yellow-100 shadow-[0_0_8px_rgba(245,158,11,0.6)]" />
                ))}
              </div>
              <div className="w-3 h-3 rounded-full bg-slate-950 border border-yellow-300 shadow-inner flex items-center justify-center">
                <div className="w-1 h-1 rounded-full bg-cyan-400 shadow-[0_0_8px_#00f0ff]" />
              </div>
            </div>
          )}

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
            isTimber={isTimber}
          />

          {/* The Animated Reels with SVG Payline Canvas & Real Glass Depth */}
          <div
            className={`relative flex-1 min-h-0 flex space-x-1 sm:space-x-1.5 p-1 sm:p-2 rounded-xl border shadow-inner overflow-hidden h-[clamp(240px,44vh,380px)] sm:h-[clamp(270px,46vh,440px)] md:h-[clamp(300px,48vh,480px)] lg:h-[clamp(330px,50vh,520px)] xl:h-[clamp(360px,52vh,560px)] 2xl:h-[clamp(400px,54vh,600px)] ${
              isTimber
                ? 'bg-[#180e07] border-2 border-[#78350f] shadow-[inset_0_0_35px_rgba(0,0,0,0.95)]'
                : isPixel
                ? 'bg-[#0f0524] border-2 border-purple-500/70 shadow-[inset_0_0_35px_rgba(0,0,0,0.98)]'
                : 'bg-casino-950/95 border-white/10'
            }`}
            style={
              isTimber
                ? {
                    backgroundImage:
                      'repeating-linear-gradient(90deg, #180e07, #180e07 19.5%, #3d2010 19.5%, #0e0703 20%)',
                  }
                : undefined
            }
          >
            {/* SVG Payline Glow Overlay: strictly hidden while reels are spinning */}
            <PaylineOverlay
              winningLines={!isAnyReelSpinning ? (spinResult?.winningLines || []) : []}
              activeLineIndex={!isAnyReelSpinning ? activeWinningLineIdx : null}
              previewLineIndex={hoveredLineIndex}
              rowCount={rowCount}
              reelsCount={numReels}
              paylines={gameDef.paylines}
              isTimber={isTimber}
            />

            {/* Physical Cabinet Glass Depth Overlay (Cylindrical softbox reflection, studio streak & divider mullions) */}
            <CabinetGlassOverlay activeGameId={activeGameId} reelsCount={numReels} />

            {/* Floating Win Badges on Active Winning Paylines */}
            {!isAnyReelSpinning && activeWin && (
              <FloatingWins activeWin={activeWin} isTimber={isTimber} />
            )}

            {/* HERO CENTER-STAGE WIN CELEBRATION BANNER */}
            {!isAnyReelSpinning && spinResult && spinResult.totalPayout > 0 && (
              <HeroWinCelebration
                totalPayout={spinResult.totalPayout}
                winningLines={spinResult.winningLines}
                activeWinningLine={activeWin}
                activeGameId={activeGameId}
                onOpenGamble={onOpenGamble}
              />
            )}

            {/* Full Slot Panoramic Scene Slide (Middle Reels Merge) */}
            {isColossalSlideOpen && !isAnyReelSpinning && (
              <div className="absolute inset-x-16 sm:inset-x-24 inset-y-2 z-25">
                <ColossalSceneSlide
                  sceneId={currentSceneId}
                  multiplier={freeSpinsRemaining > 0 ? 3 : isFeverMode ? 2 : 1}
                  onClose={() => setIsColossalSlideOpen(false)}
                />
              </div>
            )}

            {/* Dynamic Reels (5 Reels for Vault & Timberland, 6 Reels for Pixel Arcade) */}
            {Array.from({ length: numReels }, (_, reelIdx) => (
              <Reel
                key={reelIdx}
                reelIndex={reelIdx}
                symbols={currentGrid[reelIdx] || []}
                isSpinning={reelSpinning[reelIdx]}
                isAnticipating={isAnticipating && reelIdx >= 2 && reelSpinning[reelIdx]}
                isDimmed={isAnticipating && isAnyReelSpinning && !reelSpinning[reelIdx]}
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
            isTimber={isTimber}
          />

          {/* Right Themed Cabinet Pilaster */}
          {isTimber ? (
            <div className="hidden md:flex flex-col items-center justify-between w-4 sm:w-6 py-4 rounded-r-xl bg-gradient-to-r from-[#2a1306] via-[#451e0a] to-[#2a1306] border-y-2 border-r-2 border-[#78350f] shadow-2xl relative flex-shrink-0 self-stretch">
              <div className="w-3 h-3 rounded-full bg-[#1c0c04] border border-[#a16207] shadow-inner" />
              <div className="flex flex-col space-y-5">
                {[...Array(3)].map((_, i) => (
                  <div key={i} className="w-2.5 h-2.5 rounded-full bg-amber-950 border border-amber-600/60 shadow-md flex items-center justify-center">
                    <div className="w-1 h-1 rounded-full bg-amber-400/80 shadow-[0_0_6px_#f59e0b]" />
                  </div>
                ))}
              </div>
              <div className="w-3 h-3 rounded-full bg-[#1c0c04] border border-[#a16207] shadow-inner" />
            </div>
          ) : (
            <div className="hidden md:flex flex-col items-center justify-between w-4 sm:w-6 py-4 rounded-r-xl bg-gradient-to-r from-black via-amber-900 to-slate-900 border-y-2 border-r-2 border-yellow-500/60 shadow-2xl relative flex-shrink-0 self-stretch">
              <div className="w-3 h-3 rounded-full bg-slate-950 border border-yellow-300 shadow-inner flex items-center justify-center">
                <div className="w-1 h-1 rounded-full bg-cyan-400 shadow-[0_0_8px_#00f0ff]" />
              </div>
              <div className="flex flex-col space-y-5">
                {[...Array(3)].map((_, i) => (
                  <div key={i} className="w-3 h-1.5 rounded-xs bg-gradient-to-r from-yellow-300 to-amber-500 border border-yellow-100 shadow-[0_0_8px_rgba(245,158,11,0.6)]" />
                ))}
              </div>
              <div className="w-3 h-3 rounded-full bg-slate-950 border border-yellow-300 shadow-inner flex items-center justify-center">
                <div className="w-1 h-1 rounded-full bg-cyan-400 shadow-[0_0_8px_#00f0ff]" />
              </div>
            </div>
          )}
        </div>

        {/* Cabinet Bottom Status Bar - Upgrades to Illuminated Hero Win Banner when Winning */}
        <div
          className={`overflow-hidden flex items-center justify-between text-[9px] sm:text-[11px] font-semibold px-2 sm:px-3 mt-1 sm:mt-1.5 flex-shrink-0 rounded-lg sm:rounded-xl border transition-all duration-300 ${
            !isAnyReelSpinning && spinResult && spinResult.totalPayout > 0
              ? isTimber
                ? 'h-8 sm:h-10 bg-gradient-to-r from-[#0d2818] via-[#1a4028] to-[#0d2818] border-emerald-400 shadow-[0_0_20px_rgba(52,211,153,0.8)]'
                : 'h-8 sm:h-10 bg-gradient-to-r from-amber-950 via-casino-900 to-amber-950 border-yellow-300 shadow-[0_0_20px_rgba(253,224,71,0.8)]'
              : 'h-5 sm:h-7 bg-black/40 border-white/5 text-slate-400'
          }`}
        >
          {/* Left Speaker + RTP Cert */}
          <div className="flex items-center space-x-1 sm:space-x-1.5 flex-shrink-0 pl-1.5 sm:pl-2.5">
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
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-ping flex-shrink-0" />
            <span className="font-mono text-emerald-400 text-[10px] font-black flex-shrink-0 whitespace-nowrap">
              {isTimber ? '95.2% RTP' : '95.2% RTP'}
            </span>
          </div>

          {/* Center: MASSIVE HERO WIN DISPLAY BANNER */}
          <div className="flex items-center justify-center space-x-1.5 truncate px-1 sm:px-2 flex-1 text-center min-w-0">
            {!isAnyReelSpinning && spinResult && spinResult.totalPayout > 0 ? (
              <div className="flex items-center justify-center space-x-1.5 animate-pulse truncate">
                <Trophy className="w-4 h-4 sm:w-5 sm:h-5 text-yellow-300 fill-yellow-400 flex-shrink-0 animate-bounce" />
                <span className={`text-xs sm:text-sm md:text-base font-black font-mono tracking-tight sm:tracking-wide truncate ${
                  isTimber
                    ? 'text-emerald-200 drop-shadow-[0_0_12px_rgba(52,211,153,1)]'
                    : 'text-yellow-300 drop-shadow-[0_0_12px_rgba(253,224,71,1)]'
                }`}>
                  WIN: +{spinResult.totalPayout.toLocaleString()} COINS {activeWin ? `• ${activeWin.count}x ${(gameDef.symbols[activeWin.symbolId]?.name || '').toUpperCase()} (+${activeWin.payout.toLocaleString()})` : `(${spinResult.winningLines.length} LINES)`}
                </span>
                <Trophy className="w-4 h-4 sm:w-5 sm:h-5 text-yellow-300 fill-yellow-400 flex-shrink-0 animate-bounce" />
              </div>
            ) : isAnyReelSpinning ? (
              <span className="text-[10px] text-slate-400 uppercase tracking-widest font-mono">REELS IN MOTION</span>
            ) : (
              <span className="text-[10px] text-slate-500 uppercase tracking-wider font-mono">READY TO SPIN</span>
            )}
          </div>

          {/* Right Speaker + Scene */}
          <div className="flex items-center space-x-1 sm:space-x-1.5 flex-shrink-0 pr-1.5 sm:pr-2.5">
            <span className={`text-[10px] font-mono font-bold hidden sm:inline tracking-wide ${isTimber ? 'text-emerald-300' : 'text-amber-300'}`}>
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
