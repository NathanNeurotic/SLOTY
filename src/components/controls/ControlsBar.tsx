import React, { useState, useEffect, useRef } from 'react';
import {
  Minus,
  Plus,
  Zap,
  RefreshCw,
  Flame,
  StopCircle,
  Dices,
  Trees,
  Gamepad2,
} from 'lucide-react';
import { soundManager } from '../../audio/soundManager';
import { RollingWinDisplay } from './RollingWinDisplay';
import { MobileControlsDeck } from './MobileControlsDeck';
import { getGame } from '../../games/gameRegistry';
import type { GameId } from '../../games/types';

interface ControlsBarProps {
  balance: number;
  selectedLines: number;
  betPerLine: number;
  totalBet: number;
  maxBet: number;
  winAmount: number;
  isSpinning: boolean;
  isTurbo: boolean;
  autoSpinsRemaining: number;
  freeSpinsRemaining: number;
  onSpin: () => void;
  onQuickStop?: () => void;
  onLinesChange: (lines: number) => void;
  onBetPerLineChange: (betPerLine: number) => void;
  onMaxBet: () => void;
  onTurboToggle: () => void;
  onAutoSpinStart: (count: number) => void;
  onAutoSpinStop: () => void;
  onOpenGamble?: () => void;
  availableLines?: number[];
  maxLines?: number;
  activeGameId?: GameId;
  betSteps?: number[];
  maxBetPerLine?: number;
  maxTotalBet?: number;
}

const DEFAULT_LINES = [1, 5, 10, 20, 30, 40];
const BET_PER_LINE_STEPS = [1, 2, 5, 10, 25, 50, 100, 250, 500, 1000, 2500, 5000];
const AUTO_SPIN_COUNTS = [10, 25, 50, 100];

const OCTAGON_CLIP =
  'polygon(0 3px, 3px 0, calc(100% - 3px) 0, 100% 3px, 100% calc(100% - 3px), calc(100% - 3px) 100%, 3px 100%, 0 calc(100% - 3px))';
const HEX_CLIP =
  'polygon(6px 0, calc(100% - 6px) 0, 100% 6px, 100% calc(100% - 6px), calc(100% - 6px) 100%, 6px 100%, 0 calc(100% - 6px), 0 6px)';

interface DesktopThemeConfig {
  fontClass: string;
  deckBg: string;
  deckBorder: string;
  showScrews?: boolean;
  clipMode?: 'octagon' | 'hex';
  linesLabel: string;
  totalLabel: string;
  betStepLabel: string;
  turboActiveClass: string;
  turboIdleClass: string;
  boxClass: string;
  stepBtnClass: string;
  linesTextClass: string;
  betTextClass: string;
  totalTextClass: string;
  maxBtnClass: string;
  maxLabel: string;
  gambleBtnClass: string;
  autoBtnClass: string;
  autoMenuClass: string;
  autoItemClass: string;
  autoUnit: string;
  spinBtnReadyClass: string;
  spinBtnFreeClass: string;
  spinBtnStopClass: string;
  stopLabel: string;
  insufficientLabel: string;
  chipSelectedClass: string;
  chipAllowedClass: string;
}

const DESKTOP_CONSOLE_THEMES: Record<GameId, DesktopThemeConfig> = {
  'vault-24k': {
    fontClass: 'font-mono',
    deckBg: 'bg-gradient-to-b from-[#1a1308] via-[#0e0a04] to-[#050301]',
    deckBorder:
      'border-2 border-amber-500/80 rounded-2xl shadow-[0_10px_28px_rgba(0,0,0,0.92),0_0_20px_rgba(245,158,11,0.28)]',
    linesLabel: 'LINES',
    betStepLabel: 'BET/LINE',
    totalLabel: 'TOTAL BET',
    turboActiveClass:
      'bg-gradient-to-tr from-amber-500 to-yellow-300 border-yellow-100 text-amber-950 shadow-[0_0_15px_#F59E0B] scale-105',
    turboIdleClass:
      'bg-black/70 border-amber-600/60 text-amber-300 hover:border-amber-400 hover:text-yellow-200',
    boxClass: 'bg-black/80 border border-amber-500/40 rounded-lg',
    stepBtnClass:
      'bg-gradient-to-b from-stone-800 to-black border border-amber-500/60 text-amber-300 hover:border-yellow-300',
    linesTextClass: 'text-amber-200',
    betTextClass: 'text-yellow-300',
    totalTextClass: 'text-amber-300',
    maxBtnClass:
      'bg-gradient-to-b from-amber-500 via-yellow-500 to-amber-700 border-2 border-yellow-200 text-amber-950 shadow-[0_0_12px_rgba(245,158,11,0.45)] rounded-lg',
    maxLabel: 'MAX BET',
    gambleBtnClass:
      'bg-gradient-to-b from-rose-600 to-red-800 border border-rose-300 text-white shadow-[0_0_12px_#F43F5E] rounded-lg',
    autoBtnClass:
      'bg-gradient-to-b from-stone-800 to-black border border-amber-500/60 text-amber-200 hover:border-yellow-300 rounded-lg',
    autoMenuClass: 'bg-casino-950/98 border-2 border-amber-500 rounded-xl',
    autoItemClass: 'bg-casino-800 hover:bg-amber-600 hover:text-black text-slate-200',
    autoUnit: 'Spins',
    spinBtnReadyClass:
      'bg-gradient-to-r from-amber-600 via-yellow-400 to-amber-600 border-yellow-200 text-amber-950 shadow-[0_0_24px_rgba(245,158,11,0.65)] hover:brightness-110 rounded-xl',
    spinBtnFreeClass:
      'bg-gradient-to-r from-cyan-600 via-sky-400 to-blue-600 border-cyan-200 text-white shadow-[0_0_25px_#00F0FF] rounded-xl',
    spinBtnStopClass:
      'bg-gradient-to-r from-rose-700 via-red-600 to-rose-700 border-rose-300 text-white shadow-[0_0_20px_#F43F5E] rounded-xl',
    stopLabel: 'EMERGENCY STOP',
    insufficientLabel: 'CREDITS NEEDED BELOW TOTAL BET',
    chipSelectedClass:
      'bg-gradient-to-b from-yellow-400 to-amber-600 border-yellow-200 text-amber-950 shadow-[0_0_10px_#FBBF24]',
    chipAllowedClass:
      'bg-stone-900 border-amber-600/50 text-amber-200 hover:border-yellow-400',
  },
  'timber-critters': {
    fontClass: 'font-serif',
    deckBg: 'bg-gradient-to-b from-[#2e170c] via-[#1a0c05] to-[#0a0502]',
    deckBorder:
      'border-2 sm:border-3 border-[#78350f] rounded-xl shadow-[0_10px_25px_rgba(0,0,0,0.95),0_0_20px_rgba(16,185,129,0.25)]',
    linesLabel: 'TRAIL LINES',
    betStepLabel: 'BET/LINE',
    totalLabel: 'TOTAL STAKE',
    turboActiveClass:
      'bg-gradient-to-tr from-emerald-600 to-teal-400 border-emerald-200 text-emerald-950 shadow-[0_0_15px_#10B981] scale-105',
    turboIdleClass:
      'bg-[#1a0c05] border-emerald-700/70 text-emerald-300 hover:border-emerald-400',
    boxClass: 'bg-black/75 border border-amber-800/70 rounded-lg',
    stepBtnClass:
      'bg-gradient-to-b from-[#3d1f0d] to-[#1a0c05] border border-emerald-500/70 text-emerald-300 hover:border-emerald-300',
    linesTextClass: 'text-emerald-300',
    betTextClass: 'text-amber-300',
    totalTextClass: 'text-emerald-200',
    maxBtnClass:
      'bg-gradient-to-b from-emerald-600 to-teal-800 border-2 border-emerald-300 text-white shadow-[0_0_12px_rgba(16,185,129,0.45)] rounded-lg',
    maxLabel: 'MAX',
    gambleBtnClass:
      'bg-gradient-to-b from-amber-600 to-orange-800 border border-amber-300 text-white shadow-[0_0_12px_#F59E0B] rounded-lg',
    autoBtnClass:
      'bg-gradient-to-b from-[#3d1f0d] to-[#1a0c05] border border-amber-600/70 text-amber-200 hover:border-amber-400 rounded-lg',
    autoMenuClass: 'bg-[#170b05]/98 border-2 border-amber-600 rounded-xl',
    autoItemClass: 'bg-[#2e180e] hover:bg-[#451e0a] text-amber-200',
    autoUnit: 'Harvests',
    spinBtnReadyClass:
      'bg-gradient-to-r from-emerald-700 via-teal-500 to-emerald-700 border-emerald-200 text-white shadow-[0_0_24px_rgba(16,185,129,0.55)] hover:brightness-110 rounded-xl',
    spinBtnFreeClass:
      'bg-gradient-to-r from-teal-600 via-emerald-400 to-cyan-600 border-cyan-200 text-emerald-950 shadow-[0_0_25px_#10B981] rounded-xl',
    spinBtnStopClass:
      'bg-gradient-to-r from-amber-700 via-orange-600 to-amber-700 border-amber-300 text-white shadow-[0_0_18px_#F59E0B] rounded-xl',
    stopLabel: 'LEAF STOP',
    insufficientLabel: 'MORE ACORN CREDITS NEEDED',
    chipSelectedClass:
      'bg-gradient-to-b from-emerald-400 to-teal-700 border-emerald-200 text-emerald-950 shadow-[0_0_10px_#10B981]',
    chipAllowedClass:
      'bg-[#1a0c05] border-amber-700/70 text-amber-200 hover:border-emerald-400',
  },
  'pixel-arcade': {
    fontClass: 'font-mono',
    deckBg: 'bg-gradient-to-b from-[#1c1c28] via-[#101018] to-[#08080f]',
    deckBorder:
      'border-2 border-pink-500 rounded-xl shadow-[0_0_20px_rgba(236,72,153,0.35),inset_0_1px_3px_rgba(255,255,255,0.2)]',
    showScrews: true,
    clipMode: 'octagon',
    linesLabel: 'LINES',
    betStepLabel: 'BET/LINE',
    totalLabel: 'TOTAL BET',
    turboActiveClass:
      'bg-gradient-to-tr from-amber-600 to-yellow-400 border-yellow-200 text-black shadow-[0_0_15px_#F59E0B] scale-105',
    turboIdleClass:
      'bg-gradient-to-b from-slate-800 to-black border-cyan-400 text-cyan-300 hover:brightness-125',
    boxClass: 'bg-black/90 border border-pink-500/80',
    stepBtnClass:
      'bg-gradient-to-b from-slate-700 to-black border border-cyan-300 text-cyan-300 hover:brightness-125',
    linesTextClass: 'text-cyan-200',
    betTextClass: 'text-pink-300',
    totalTextClass: 'text-purple-200',
    maxBtnClass:
      'bg-gradient-to-b from-red-500 via-rose-600 to-red-900 border-2 border-yellow-300 text-white shadow-[0_0_12px_#EF4444]',
    maxLabel: 'MAX',
    gambleBtnClass:
      'bg-gradient-to-b from-amber-500 to-orange-700 border-2 border-yellow-200 text-black shadow-[0_0_12px_#F59E0B]',
    autoBtnClass:
      'bg-gradient-to-b from-purple-700 to-indigo-900 border-2 border-purple-400 text-purple-200 hover:brightness-125',
    autoMenuClass: 'bg-[#0c041e]/98 border-2 border-pink-500 rounded-lg',
    autoItemClass: 'bg-purple-950 hover:bg-pink-600 text-cyan-200',
    autoUnit: 'Plays',
    spinBtnReadyClass:
      'bg-gradient-to-r from-pink-600 via-fuchsia-500 to-purple-600 border-pink-300 text-white shadow-[0_0_24px_rgba(236,72,153,0.65)] hover:brightness-110',
    spinBtnFreeClass:
      'bg-gradient-to-r from-cyan-500 via-sky-400 to-purple-600 border-cyan-200 text-white shadow-[0_0_25px_#00F0FF]',
    spinBtnStopClass:
      'bg-gradient-to-r from-amber-600 via-red-600 to-pink-600 border-yellow-300 text-white shadow-[0_0_20px_#EF4444]',
    stopLabel: '[ QUICK STOP ]',
    insufficientLabel: '🪙 NEED 25¢ CREDITS 🪙',
    chipSelectedClass:
      'bg-gradient-to-b from-pink-500 to-purple-700 border-pink-200 text-white shadow-[0_0_10px_#EC4899]',
    chipAllowedClass:
      'bg-black/80 border-cyan-500/50 text-cyan-200 hover:border-pink-400',
  },
  'ps2-legends': {
    fontClass: 'font-mono',
    deckBg: 'bg-gradient-to-r from-[#03060c] via-[#080d1a] to-[#03060c]',
    deckBorder:
      'border-2 border-[#006FCD] rounded-xl shadow-[0_10px_25px_rgba(0,0,0,0.95),0_0_20px_rgba(0,111,205,0.45)]',
    clipMode: 'hex',
    linesLabel: 'LINES',
    betStepLabel: 'BET/LINE',
    totalLabel: 'TOTAL WAGER',
    turboActiveClass:
      'bg-gradient-to-tr from-[#006FCD] to-cyan-400 border-cyan-100 text-white shadow-[0_0_15px_#00F0FF] scale-105',
    turboIdleClass:
      'bg-[#080d1a] border-[#006FCD] text-cyan-300 hover:border-cyan-300',
    boxClass: 'bg-black border border-[#006FCD]/80',
    stepBtnClass:
      'bg-[#0a1224] border border-[#006FCD] text-cyan-300 hover:border-cyan-300',
    linesTextClass: 'text-cyan-200',
    betTextClass: 'text-blue-200',
    totalTextClass: 'text-cyan-200 drop-shadow-[0_0_8px_#00F0FF]',
    maxBtnClass:
      'bg-gradient-to-b from-[#006FCD] to-[#003a75] border-2 border-cyan-300 text-white shadow-[0_0_12px_rgba(0,111,205,0.65)]',
    maxLabel: 'R2 MAX',
    gambleBtnClass:
      'bg-gradient-to-b from-rose-600 to-fuchsia-900 border-2 border-pink-300 text-white shadow-[0_0_12px_#DF508E]',
    autoBtnClass:
      'bg-[#080d1a] border border-[#006FCD] hover:border-[#00F0FF] text-cyan-300 hover:bg-[#006FCD]/20 shadow-[0_0_8px_rgba(0,111,205,0.4)]',
    autoMenuClass: 'bg-[#040914]/98 border-2 border-[#006FCD] rounded-xl',
    autoItemClass: 'bg-[#0a1224] hover:bg-[#006FCD] hover:text-white text-cyan-200',
    autoUnit: 'Cycles',
    spinBtnReadyClass:
      'bg-gradient-to-r from-[#003a75] via-[#006FCD] to-cyan-600 border-cyan-300 text-white shadow-[0_0_24px_rgba(0,111,205,0.7)] hover:brightness-110',
    spinBtnFreeClass:
      'bg-gradient-to-r from-indigo-600 via-cyan-500 to-blue-600 border-cyan-200 text-white shadow-[0_0_25px_#00F0FF]',
    spinBtnStopClass:
      'bg-gradient-to-r from-rose-700 via-red-600 to-rose-800 border-rose-300 text-white shadow-[0_0_20px_#F43F5E]',
    stopLabel: 'ABORT SPIN',
    insufficientLabel: '⚠ INSUFFICIENT CREDITS ⚠',
    chipSelectedClass:
      'bg-gradient-to-b from-[#006FCD] to-cyan-600 border-cyan-200 text-white shadow-[0_0_10px_#00F0FF]',
    chipAllowedClass:
      'bg-[#080d1a] border-[#006FCD]/60 text-cyan-200 hover:border-cyan-300',
  },
};

export const ControlsBar: React.FC<ControlsBarProps> = ({
  balance,
  selectedLines,
  betPerLine,
  totalBet,
  maxBet,
  winAmount,
  isSpinning,
  isTurbo,
  autoSpinsRemaining,
  freeSpinsRemaining,
  onSpin,
  onQuickStop,
  onLinesChange,
  onBetPerLineChange,
  onMaxBet,
  onTurboToggle,
  onAutoSpinStart,
  onAutoSpinStop,
  onOpenGamble,
  availableLines = DEFAULT_LINES,
  maxLines = 40,
  activeGameId = 'vault-24k',
  betSteps,
  maxBetPerLine,
  maxTotalBet,
}) => {
  const gameDef = getGame(activeGameId);
  const theme = DESKTOP_CONSOLE_THEMES[activeGameId] || DESKTOP_CONSOLE_THEMES['vault-24k'];
  const isTimber = activeGameId === 'timber-critters';
  const isPixel = activeGameId === 'pixel-arcade';
  const isPs2 = activeGameId === 'ps2-legends';
  const [showAutoMenu, setShowAutoMenu] = useState(false);
  const autoMenuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!showAutoMenu) return;
    const onPointerDown = (e: MouseEvent) => {
      if (autoMenuRef.current && !autoMenuRef.current.contains(e.target as Node)) {
        setShowAutoMenu(false);
      }
    };
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setShowAutoMenu(false);
    };
    window.addEventListener('mousedown', onPointerDown);
    window.addEventListener('keydown', onKeyDown);
    return () => {
      window.removeEventListener('mousedown', onPointerDown);
      window.removeEventListener('keydown', onKeyDown);
    };
  }, [showAutoMenu]);

  const effectiveBetSteps = betSteps && betSteps.length > 0 ? betSteps : BET_PER_LINE_STEPS;
  const effectiveMaxBetPerLine = maxBetPerLine || effectiveBetSteps[effectiveBetSteps.length - 1];
  const effectiveMaxTotalBet = maxTotalBet || maxBet;
  const maxAllowedBet = Math.min(balance, maxBet, effectiveMaxTotalBet);

  const handleLinesStep = (direction: 'up' | 'down') => {
    soundManager.playChipClick();
    const curIdx = availableLines.indexOf(selectedLines);
    if (direction === 'up' && curIdx < availableLines.length - 1) {
      const nextLines = availableLines[curIdx + 1];
      if (nextLines * betPerLine <= maxAllowedBet) {
        onLinesChange(nextLines);
      }
    } else if (direction === 'down' && curIdx > 0) {
      onLinesChange(availableLines[curIdx - 1]);
    }
  };

  const handleBetStep = (direction: 'up' | 'down') => {
    soundManager.playChipClick();
    let curIdx = effectiveBetSteps.indexOf(betPerLine);
    if (curIdx === -1) {
      curIdx = effectiveBetSteps.findIndex((s) => s >= betPerLine);
      if (curIdx === -1) curIdx = effectiveBetSteps.length - 1;
    }

    if (direction === 'up' && curIdx < effectiveBetSteps.length - 1) {
      const nextStep = effectiveBetSteps[curIdx + 1];
      if (nextStep <= effectiveMaxBetPerLine && nextStep * selectedLines <= maxAllowedBet) {
        onBetPerLineChange(nextStep);
      }
    } else if (direction === 'down' && curIdx > 0) {
      onBetPerLineChange(effectiveBetSteps[curIdx - 1]);
    }
  };

  const handleTriggerSpin = () => {
    setShowAutoMenu(false);
    if (autoSpinsRemaining > 0) {
      onAutoSpinStop();
      return;
    }
    if (isSpinning) {
      if (onQuickStop) {
        onQuickStop();
      }
      return;
    }
    onSpin();
  };

  const isAutoSpinning = autoSpinsRemaining > 0;
  const isFreeSpins = freeSpinsRemaining > 0;
  const boxStyle =
    theme.clipMode === 'octagon'
      ? { clipPath: OCTAGON_CLIP }
      : theme.clipMode === 'hex'
      ? { clipPath: HEX_CLIP }
      : undefined;

  const canStepLinesDown =
    !isSpinning && !isFreeSpins && availableLines.indexOf(selectedLines) > 0;
  const canStepLinesUp =
    !isSpinning &&
    !isFreeSpins &&
    availableLines.indexOf(selectedLines) < availableLines.length - 1 &&
    selectedLines < maxLines &&
    (availableLines[availableLines.indexOf(selectedLines) + 1] ?? Infinity) * betPerLine <= maxAllowedBet;

  const canStepBetDown = !isSpinning && !isFreeSpins && betPerLine > effectiveBetSteps[0];
  const nextBetStepIdx = effectiveBetSteps.findIndex((s) => s > betPerLine);
  const nextBetStep = nextBetStepIdx >= 0 ? effectiveBetSteps[nextBetStepIdx] : Infinity;
  const canStepBetUp =
    !isSpinning &&
    !isFreeSpins &&
    nextBetStep <= effectiveMaxBetPerLine &&
    nextBetStep * selectedLines <= maxAllowedBet;

  const quickChips = effectiveBetSteps.slice(0, 6);

  return (
    <div className="relative w-full max-w-5xl xl:max-w-6xl 2xl:max-w-7xl mx-auto px-1 sm:px-3 py-0.5 sm:py-1 select-none flex flex-col space-y-0.5 sm:space-y-1 flex-shrink-0">
      {/* Touch-first deck for phones and landscape handsets */}
      <MobileControlsDeck
        activeGameId={activeGameId}
        selectedLines={selectedLines}
        betPerLine={betPerLine}
        totalBet={totalBet}
        winAmount={winAmount}
        balance={balance}
        isSpinning={isSpinning}
        isTurbo={isTurbo}
        isFreeSpins={isFreeSpins}
        autoSpinsRemaining={autoSpinsRemaining}
        canStepLinesDown={availableLines.indexOf(selectedLines) > 0}
        canStepLinesUp={availableLines.indexOf(selectedLines) < availableLines.length - 1 && selectedLines < maxLines}
        canStepBetDown={betPerLine > effectiveBetSteps[0]}
        canStepBetUp={betPerLine < effectiveMaxBetPerLine && betPerLine * selectedLines < maxAllowedBet}
        canMaxBet={totalBet < maxAllowedBet}
        onLinesStep={handleLinesStep}
        onBetStep={handleBetStep}
        onTriggerSpin={handleTriggerSpin}
        onTurboToggle={onTurboToggle}
        onMaxBet={onMaxBet}
        onAutoSpinStart={onAutoSpinStart}
        onAutoSpinStop={onAutoSpinStop}
        onOpenGamble={onOpenGamble}
      />

      {/* Desktop 4-Theme Physical Control Deck (>= 640px & tall enough) */}
      <div className={`hidden sm:flex short:hidden flex-col space-y-1 sm:space-y-1.5 w-full ${theme.fontClass}`}>
        <div
          className={`relative ${theme.deckBg} ${theme.deckBorder} p-1 sm:p-1.5 flex items-center justify-between gap-1.5 sm:gap-2`}
        >
          {/* Decorative corner mounting screws for arcade hardware feel */}
          {theme.showScrews && (
            <>
              <div className="absolute top-1 left-1.5 w-1.5 h-1.5 bg-slate-700 border border-slate-500 pointer-events-none" />
              <div className="absolute top-1 right-1.5 w-1.5 h-1.5 bg-slate-700 border border-slate-500 pointer-events-none" />
              <div className="absolute bottom-1 left-1.5 w-1.5 h-1.5 bg-slate-700 border border-slate-500 pointer-events-none" />
              <div className="absolute bottom-1 right-1.5 w-1.5 h-1.5 bg-slate-700 border border-slate-500 pointer-events-none" />
            </>
          )}

          {/* Left Wing: Turbo, Lines, Bet Stepper, XL Bet Chips, Total Wager, Max Bet */}
          <div className="flex items-center space-x-1 sm:space-x-1.5 pl-1 sm:pl-1.5">
            <button
              type="button"
              onClick={() => {
                soundManager.playButtonClick();
                onTurboToggle();
              }}
              aria-pressed={isTurbo}
              aria-label="Toggle Turbo Spin Speed (Shortcut T)"
              title={isTurbo ? 'Turbo: 2X SPEED [T]' : 'Turbo: NORMAL [T]'}
              style={boxStyle}
              className={`w-8.5 h-8.5 sm:w-9.5 sm:h-9.5 md:w-10 md:h-10 border-2 flex flex-col items-center justify-center transition-all flex-shrink-0 ${
                isTurbo ? theme.turboActiveClass : theme.turboIdleClass
              }`}
            >
              <Zap className={`w-3.5 h-3.5 ${isTurbo ? 'animate-pulse' : ''}`} />
              <span className="text-[7px] font-black uppercase tracking-tight">TURBO</span>
            </button>

            {/* Lines Stepper */}
            <div style={boxStyle} className={`flex flex-col items-center px-1.5 py-0.5 sm:py-1 shadow-inner ${theme.boxClass}`}>
              <span className="text-[6.5px] font-black uppercase text-slate-400 tracking-wider">{theme.linesLabel}</span>
              <div className="flex items-center space-x-0.5 sm:space-x-1 mt-0.5">
                <button
                  type="button"
                  onClick={() => handleLinesStep('down')}
                  disabled={!canStepLinesDown}
                  aria-label="Decrease Active Paylines"
                  className={`w-5 h-5 sm:w-5.5 sm:h-5.5 rounded disabled:opacity-30 flex items-center justify-center shadow hover:brightness-125 active:scale-95 ${theme.stepBtnClass}`}
                >
                  <Minus className="w-2.5 h-2.5" />
                </button>
                <span className={`min-w-[24px] text-center font-black font-mono tabular-nums text-xs sm:text-sm ${theme.linesTextClass}`}>
                  {selectedLines}
                </span>
                <button
                  type="button"
                  onClick={() => handleLinesStep('up')}
                  disabled={!canStepLinesUp}
                  aria-label="Increase Active Paylines"
                  className={`w-5 h-5 sm:w-5.5 sm:h-5.5 rounded disabled:opacity-30 flex items-center justify-center shadow hover:brightness-125 active:scale-95 ${theme.stepBtnClass}`}
                >
                  <Plus className="w-2.5 h-2.5" />
                </button>
              </div>
            </div>

            {/* Bet/Line Stepper */}
            <div style={boxStyle} className={`flex flex-col items-center px-1.5 py-0.5 sm:py-1 shadow-inner ${theme.boxClass}`}>
              <span className="text-[6.5px] font-black uppercase text-slate-400 tracking-wider">{theme.betStepLabel}</span>
              <div className="flex items-center space-x-0.5 sm:space-x-1 mt-0.5">
                <button
                  type="button"
                  onClick={() => handleBetStep('down')}
                  disabled={!canStepBetDown}
                  aria-label="Decrease Bet Per Line (Down Arrow)"
                  className={`w-5 h-5 sm:w-5.5 sm:h-5.5 rounded disabled:opacity-30 flex items-center justify-center shadow hover:brightness-125 active:scale-95 ${theme.stepBtnClass}`}
                >
                  <Minus className="w-2.5 h-2.5" />
                </button>
                <span className={`min-w-[30px] text-center font-black font-mono tabular-nums text-xs sm:text-sm ${theme.betTextClass}`}>
                  {betPerLine}
                </span>
                <button
                  type="button"
                  onClick={() => handleBetStep('up')}
                  disabled={!canStepBetUp}
                  aria-label="Increase Bet Per Line (Up Arrow)"
                  className={`w-5 h-5 sm:w-5.5 sm:h-5.5 rounded disabled:opacity-30 flex items-center justify-center shadow hover:brightness-125 active:scale-95 ${theme.stepBtnClass}`}
                >
                  <Plus className="w-2.5 h-2.5" />
                </button>
              </div>
            </div>

            {/* Quick-Bet Chips Row (visible on xl+ desktops across all cabinets) */}
            <div style={boxStyle} className={`hidden xl:flex items-center space-x-1 px-1.5 py-1 shadow-inner ${theme.boxClass}`}>
              {quickChips.map((step) => {
                const isSelected = betPerLine === step;
                const isChipAllowed = step <= effectiveMaxBetPerLine && step * selectedLines <= maxAllowedBet;
                return (
                  <button
                    key={step}
                    type="button"
                    disabled={!isChipAllowed || isSpinning || isFreeSpins}
                    onClick={() => {
                      soundManager.playChipClick();
                      onBetPerLineChange(step);
                    }}
                    aria-label={`Set bet per line to ${step}`}
                    aria-pressed={isSelected}
                    className={`min-w-[28px] h-6 px-1.5 rounded border text-[10px] font-black font-mono tabular-nums transition-all active:scale-95 disabled:opacity-30 ${
                      isSelected ? theme.chipSelectedClass : theme.chipAllowedClass
                    }`}
                  >
                    {step}
                  </button>
                );
              })}
            </div>

            {/* Total Wager Display */}
            <div style={boxStyle} className={`flex flex-col items-center px-2 py-0.5 sm:py-1 shadow-inner min-w-[60px] sm:min-w-[70px] ${theme.boxClass}`}>
              <span className="text-[6.5px] font-black uppercase text-slate-400 tracking-wider">{theme.totalLabel}</span>
              <span className={`text-xs sm:text-sm font-black font-mono tabular-nums ${theme.totalTextClass}`}>
                ${totalBet.toLocaleString()}
              </span>
            </div>

            {/* MAX BET */}
            <button
              type="button"
              onClick={() => {
                soundManager.playButtonClick();
                onMaxBet();
              }}
              disabled={isSpinning || isFreeSpins || totalBet >= maxAllowedBet}
              aria-label="Set Maximum Affordable Bet (Shortcut B)"
              title="Set Max Affordable Bet [B]"
              style={boxStyle}
              className={`h-8.5 sm:h-9.5 md:h-10 px-2 sm:px-2.5 disabled:opacity-35 flex flex-col items-center justify-center font-black text-[8px] sm:text-[9px] uppercase tracking-wider hover:brightness-110 active:scale-95 flex-shrink-0 ${theme.maxBtnClass}`}
            >
              <span>{theme.maxLabel}</span>
            </button>
          </div>

          {/* Center Accent Plaque for Pixel Arcade Coin Reject */}
          {isPixel && (
            <button
              type="button"
              onClick={handleTriggerSpin}
              aria-label="25 Cents Coin Slot Quick Spin"
              style={boxStyle}
              className="hidden lg:flex items-center space-x-1.5 px-2 py-0.5 bg-black/90 border border-orange-500/70 shadow-inner hover:brightness-110 active:scale-95"
            >
              <div className="w-2 h-6 bg-black border border-slate-600 flex items-center justify-center">
                <div className="w-0.5 h-4 bg-orange-400/80" />
              </div>
              <div className="px-1.5 py-0.5 bg-gradient-to-b from-orange-500 to-amber-700 border border-orange-300 shadow-[0_0_8px_#F97316] text-[8px] font-black text-amber-950 flex flex-col items-center leading-tight">
                <span>25¢</span>
                <span className="text-[6px]">DROP</span>
              </div>
            </button>
          )}

          {/* Right Wing: Win Readout, Gamble, Auto-Spin */}
          <div className="flex items-center space-x-1 sm:space-x-1.5 pr-1 sm:pr-1.5">
            <RollingWinDisplay targetAmount={winAmount} isFreeSpins={isFreeSpins} activeGameId={activeGameId} />

            {onOpenGamble && (
              <button
                type="button"
                onClick={() => {
                  soundManager.playButtonClick();
                  onOpenGamble();
                }}
                disabled={winAmount <= 0 || isSpinning || isFreeSpins}
                aria-label="Double or Nothing Card Gamble"
                title={winAmount > 0 ? 'Risk current win in 2X Card Gamble!' : 'Land a win to unlock 2X Gamble'}
                style={boxStyle}
                className={`h-8.5 sm:h-9.5 md:h-10 px-2 border flex flex-col items-center justify-center text-[7.5px] sm:text-[8px] font-black uppercase transition-all flex-shrink-0 ${
                  winAmount > 0 && !isSpinning && !isFreeSpins
                    ? `${theme.gambleBtnClass} hover:brightness-110 active:scale-95`
                    : 'bg-black/50 border-slate-700 text-slate-600 opacity-40 cursor-not-allowed'
                }`}
              >
                <Dices className="w-3.5 h-3.5" />
                <span>2X GAMBLE</span>
              </button>
            )}

            {/* AUTO-SPIN CONTROL */}
            <div ref={autoMenuRef} className="relative flex-shrink-0">
              {isAutoSpinning ? (
                <button
                  type="button"
                  onClick={() => {
                    soundManager.playButtonClick();
                    onAutoSpinStop();
                  }}
                  aria-label="Stop Auto Spins"
                  style={boxStyle}
                  className="h-8.5 sm:h-9.5 md:h-10 px-2.5 bg-rose-600 border-2 border-rose-300 text-white font-black font-mono tabular-nums text-[8px] sm:text-[9px] uppercase flex flex-col items-center justify-center animate-pulse shadow-[0_0_12px_#F43F5E]"
                >
                  <StopCircle className="w-3.5 h-3.5" />
                  <span>STOP ({autoSpinsRemaining})</span>
                </button>
              ) : (
                <button
                  type="button"
                  onClick={() => {
                    soundManager.playButtonClick();
                    setShowAutoMenu((prev) => !prev);
                  }}
                  disabled={isSpinning || isFreeSpins}
                  aria-expanded={showAutoMenu}
                  aria-label="Open Auto Spin Menu (Shortcut A)"
                  title="Auto Spin [A]"
                  style={boxStyle}
                  className={`h-8.5 sm:h-9.5 md:h-10 px-2.5 border-2 font-black text-[8px] sm:text-[9px] uppercase flex flex-col items-center justify-center hover:brightness-110 active:scale-95 disabled:opacity-40 transition-all ${theme.autoBtnClass}`}
                >
                  <RefreshCw className="w-3.5 h-3.5" />
                  <span>AUTO</span>
                </button>
              )}

              {showAutoMenu && !isAutoSpinning && (
                <div
                  className={`absolute bottom-full right-0 mb-2 w-32 p-1.5 shadow-2xl z-50 flex flex-col space-y-1 animate-fadeIn ${theme.autoMenuClass}`}
                >
                  <div className="text-[9px] text-slate-400 font-black uppercase text-center py-0.5">
                    AUTO SPINS
                  </div>
                  {AUTO_SPIN_COUNTS.map((count) => (
                    <button
                      key={count}
                      type="button"
                      onClick={() => {
                        soundManager.playButtonClick();
                        setShowAutoMenu(false);
                        onAutoSpinStart(count);
                      }}
                      className={`px-2 py-1.5 text-xs font-bold text-center transition-colors rounded ${theme.autoItemClass}`}
                    >
                      {count} {theme.autoUnit}
                    </button>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Full-Width Ergonomic SPIN Bar */}
        <button
          type="button"
          onClick={handleTriggerSpin}
          disabled={!isFreeSpins && !isSpinning && balance < totalBet}
          aria-label="Spin Slot Machine (Shortcut Space)"
          title="Spin Reels [Space]"
          className={`w-full h-10 sm:h-11 md:h-12 border-2 flex items-center justify-center font-black uppercase tracking-widest text-sm sm:text-base transition-all active:scale-[0.99] disabled:opacity-40 disabled:cursor-not-allowed ${
            isSpinning
              ? theme.spinBtnStopClass
              : isFreeSpins
              ? theme.spinBtnFreeClass
              : theme.spinBtnReadyClass
          }`}
        >
          {isSpinning ? (
            <span className="flex items-center space-x-2">
              <StopCircle className="w-5 h-5 animate-pulse" />
              <span>{theme.stopLabel}</span>
            </span>
          ) : isFreeSpins ? (
            <span className="flex items-center space-x-2">
              <Flame className="w-5 h-5 animate-bounce" />
              <span>
                {gameDef.theme.freeSpinsTitle} ({gameDef.freeSpinsMultiplier}X) • {freeSpinsRemaining} LEFT
              </span>
              <Flame className="w-5 h-5 animate-bounce" />
            </span>
          ) : balance < totalBet ? (
            <span className="whitespace-nowrap truncate max-w-full px-2 text-rose-200">{theme.insufficientLabel}</span>
          ) : isPixel ? (
            <span className="flex items-center space-x-2">
              <Gamepad2 className="w-4 h-4 sm:w-5 sm:h-5 text-cyan-200 flex-shrink-0" />
              <span>🕹️ 1P START / INSERT COIN 🕹️</span>
              <Gamepad2 className="w-4 h-4 sm:w-5 sm:h-5 text-cyan-200 flex-shrink-0" />
            </span>
          ) : isTimber ? (
            <span className="flex items-center space-x-2">
              <Trees className="w-4 h-4 sm:w-5 sm:h-5 text-emerald-100 flex-shrink-0" />
              <span>🌲 WOODLAND HARVEST / SPIN 🌲</span>
            </span>
          ) : isPs2 ? (
            <span className="flex items-center space-x-2">
              <span className="text-[#24B059]">△</span>
              <span className="text-[#DF508E]">□</span>
              <span className="px-1">{gameDef.theme.spinButtonLabel}</span>
              <span className="text-[#E64C4C]">○</span>
              <span className="text-[#6F8CE6]">✕</span>
            </span>
          ) : (
            <span>👑 {gameDef.theme.spinButtonLabel} 👑</span>
          )}
        </button>
      </div>
    </div>
  );
};
