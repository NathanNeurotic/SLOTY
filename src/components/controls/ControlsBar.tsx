import React, { useState } from 'react';
import { Minus, Plus, Zap, RefreshCw, Flame, StopCircle, Dices, Trees } from 'lucide-react';
import { soundManager } from '../../audio/soundManager';
import { RollingWinDisplay } from './RollingWinDisplay';
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
}

const DEFAULT_LINES = [1, 5, 10, 20, 30, 40];
const BET_PER_LINE_STEPS = [1, 2, 5, 10, 25, 50, 100, 250, 500, 1000, 2500, 5000];

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
}) => {
  const isTimber = activeGameId === 'timber-critters';
  const [showAutoMenu, setShowAutoMenu] = useState(false);

  const handleLinesStep = (direction: 'up' | 'down') => {
    soundManager.playChipClick();
    const curIdx = availableLines.indexOf(selectedLines);
    if (direction === 'up' && curIdx < availableLines.length - 1) {
      onLinesChange(availableLines[curIdx + 1]);
    } else if (direction === 'down' && curIdx > 0) {
      onLinesChange(availableLines[curIdx - 1]);
    }
  };

  const handleBetStep = (direction: 'up' | 'down') => {
    soundManager.playChipClick();
    let curIdx = BET_PER_LINE_STEPS.indexOf(betPerLine);
    if (curIdx === -1) {
      curIdx = BET_PER_LINE_STEPS.findIndex((s) => s >= betPerLine);
      if (curIdx === -1) curIdx = BET_PER_LINE_STEPS.length - 1;
    }

    if (direction === 'up' && curIdx < BET_PER_LINE_STEPS.length - 1) {
      const nextStep = BET_PER_LINE_STEPS[curIdx + 1];
      if (nextStep * selectedLines <= maxBet) {
        onBetPerLineChange(nextStep);
      }
    } else if (direction === 'down' && curIdx > 0) {
      onBetPerLineChange(BET_PER_LINE_STEPS[curIdx - 1]);
    }
  };

  const handleTriggerSpin = () => {
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

  return (
    <div className="relative w-full max-w-4xl mx-auto px-1 sm:px-3 py-1 sm:py-1.5 select-none flex flex-col space-y-1 sm:space-y-1.5 flex-shrink-0">
      {/* ========================================================================= */}
      {/* --- MOBILE COMPACT CONTROLS DECK (< 640px) - STRICT 82px HEIGHT --- */}
      {/* ========================================================================= */}
      <div className="sm:hidden flex flex-col space-y-1 w-full">
        {/* Mobile Row 1: Quick Steppers, Win Readout, Gamble & Auto */}
        <div className={`flex items-center justify-between px-1.5 py-1 rounded-xl border shadow-md h-9 ${
          isTimber
            ? 'bg-[#121c15]/95 border-emerald-600/40 text-emerald-200'
            : 'bg-casino-900/95 border-white/10 text-slate-200'
        }`}>
          {/* Lines Stepper */}
          <div className="flex items-center space-x-0.5">
            <span className="text-[7.5px] font-bold uppercase text-slate-400">L:</span>
            <button
              onClick={() => handleLinesStep('down')}
              disabled={isSpinning || isFreeSpins || selectedLines <= 1}
              className="w-5 h-5 rounded vlt-btn-stepper disabled:opacity-30 flex items-center justify-center text-slate-200"
            >
              <Minus className="w-2.5 h-2.5 text-cyan-300" />
            </button>
            <span className={`text-[11px] font-black font-mono min-w-[16px] text-center ${
              isTimber ? 'text-emerald-300' : 'text-neon-cyan'
            }`}>
              {selectedLines}
            </span>
            <button
              onClick={() => handleLinesStep('up')}
              disabled={isSpinning || isFreeSpins || selectedLines >= maxLines}
              className="w-5 h-5 rounded vlt-btn-stepper disabled:opacity-30 flex items-center justify-center text-slate-200"
            >
              <Plus className="w-2.5 h-2.5 text-cyan-300" />
            </button>
          </div>

          {/* Bet/Line Stepper */}
          <div className="flex items-center space-x-0.5 pl-1 border-l border-white/10">
            <span className="text-[7.5px] font-bold uppercase text-slate-400">B:</span>
            <button
              onClick={() => handleBetStep('down')}
              disabled={isSpinning || isFreeSpins || betPerLine <= 1}
              className="w-5 h-5 rounded vlt-btn-stepper disabled:opacity-30 flex items-center justify-center text-slate-200"
            >
              <Minus className="w-2.5 h-2.5 text-amber-300" />
            </button>
            <span className="text-[11px] font-black font-mono text-white min-w-[20px] text-center">
              {betPerLine}
            </span>
            <button
              onClick={() => handleBetStep('up')}
              disabled={isSpinning || isFreeSpins || (betPerLine * selectedLines) >= maxBet}
              className="w-5 h-5 rounded vlt-btn-stepper disabled:opacity-30 flex items-center justify-center text-slate-200"
            >
              <Plus className="w-2.5 h-2.5 text-amber-300" />
            </button>
          </div>

          {/* Total Bet */}
          <div className="flex flex-col items-center px-1 border-l border-white/10">
            <span className="text-[7px] uppercase font-bold text-slate-400 leading-none">BET</span>
            <span className={`text-[11px] font-black font-mono leading-none mt-0.5 ${
              isTimber ? 'text-emerald-300' : 'text-amber-300'
            }`}>
              {totalBet}
            </span>
          </div>

          {/* Win Display */}
          <div className="flex items-center pl-1 border-l border-white/10">
            <RollingWinDisplay targetAmount={winAmount} isFreeSpins={isFreeSpins} />
          </div>

          {/* Gamble 2X (shown when win > 0) */}
          {onOpenGamble && winAmount > 0 && !isSpinning && !isFreeSpins && (
            <button
              onClick={() => {
                soundManager.playButtonClick();
                onOpenGamble();
              }}
              className="px-2 h-7 rounded-lg vlt-gamble-btn text-[9px] font-black uppercase text-white animate-pulse"
            >
              2X
            </button>
          )}

          {/* Auto Spin */}
          <div className="relative">
            {isAutoSpinning ? (
              <button
                onClick={onAutoSpinStop}
                className="px-2 h-7 rounded-lg bg-rose-600/40 border border-rose-500 text-rose-300 font-bold text-[9px] uppercase animate-pulse"
              >
                STOP ({autoSpinsRemaining})
              </button>
            ) : (
              <button
                onClick={() => {
                  soundManager.playButtonClick();
                  setShowAutoMenu(!showAutoMenu);
                }}
                disabled={isSpinning || isFreeSpins}
                className="px-2 h-7 rounded-lg vlt-btn-stepper text-slate-300 font-bold text-[9px] uppercase tracking-wider disabled:opacity-40"
              >
                AUTO
              </button>
            )}
          </div>
        </div>

        {/* Mobile Row 2: Turbo, Full Spin Button, Max Bet */}
        <div className="flex items-center space-x-1.5 w-full h-11">
          {/* Turbo Toggle */}
          <button
            onClick={() => {
              soundManager.playButtonClick();
              onTurboToggle();
            }}
            disabled={isSpinning}
            title={isTurbo ? 'Turbo Fast' : 'Normal Speed'}
            className={`w-10 h-10 rounded-xl border flex items-center justify-center flex-shrink-0 transition-all ${
              isTurbo
                ? 'bg-gradient-to-b from-amber-500/30 to-amber-950/60 border-amber-400 text-amber-300 shadow-[0_0_10px_rgba(245,158,11,0.6)]'
                : 'vlt-btn-stepper text-slate-400'
            }`}
          >
            <Zap className={`w-4 h-4 ${isTurbo ? 'fill-amber-400 text-amber-300' : ''}`} />
          </button>

          {/* Centered Mobile Spin / Stop Button */}
          <button
            onClick={handleTriggerSpin}
            disabled={!isSpinning && !isFreeSpins && balance < totalBet}
            className={`flex-1 h-10 flex items-center justify-center rounded-xl font-black tracking-wider text-base uppercase text-white select-none transition-all touch-manipulation shadow-lg ${
              isSpinning
                ? isTimber
                  ? 'bg-gradient-to-r from-rose-700 via-red-600 to-rose-800 border-2 border-red-300 shadow-[0_0_15px_rgba(244,63,94,0.8)] animate-pulse'
                  : 'vlt-stop-btn animate-pulse'
                : !isFreeSpins && balance < totalBet
                ? 'bg-slate-800 opacity-40 text-slate-500 border border-white/5'
                : isFreeSpins
                ? isTimber
                  ? 'bg-gradient-to-r from-emerald-600 via-teal-500 to-amber-500 border-2 border-yellow-300 shadow-[0_0_20px_rgba(16,185,129,0.9)] animate-pulse'
                  : 'vlt-spin-btn animate-pulse'
                : isTimber
                ? 'bg-gradient-to-r from-emerald-600 via-green-500 to-emerald-700 border-2 border-emerald-300 shadow-[0_0_25px_rgba(16,185,129,0.8)] active:scale-95'
                : 'vlt-spin-btn'
            }`}
          >
            {isSpinning ? (
              <span className="flex items-center space-x-1.5">
                <StopCircle className="w-5 h-5 fill-white text-rose-700" />
                <span>STOP</span>
              </span>
            ) : isAutoSpinning ? (
              <span className="flex items-center space-x-1.5">
                <StopCircle className="w-5 h-5" />
                <span>STOP ({autoSpinsRemaining})</span>
              </span>
            ) : isFreeSpins ? (
              <span className="flex items-center space-x-1.5">
                <Flame className="w-5 h-5 text-yellow-300 fill-yellow-300 animate-pulse" />
                <span>FREE SPIN</span>
              </span>
            ) : (
              <span className="flex items-center space-x-1.5">
                {isTimber ? <Trees className="w-4 h-4 text-emerald-200 fill-emerald-200" /> : null}
                <span>{isTimber ? 'WOODLAND SPIN' : 'SPIN'}</span>
                {isTimber ? <Trees className="w-4 h-4 text-emerald-200 fill-emerald-200" /> : null}
              </span>
            )}
          </button>

          {/* Max Bet Button */}
          <button
            onClick={() => {
              soundManager.playChipClick();
              onMaxBet();
            }}
            disabled={isSpinning || isFreeSpins || totalBet >= maxBet}
            className={`px-2 h-10 rounded-xl font-black text-[9px] uppercase tracking-wider disabled:opacity-40 flex items-center justify-center flex-shrink-0 shadow-md ${
              isTimber
                ? 'bg-gradient-to-r from-amber-600 via-yellow-500 to-amber-700 text-amber-950 border border-yellow-200'
                : 'vlt-maxbet-btn text-amber-950'
            }`}
          >
            MAX
          </button>
        </div>
      </div>

      {/* ========================================================================= */}
      {/* --- DESKTOP CONTROLS DECK (>= 640px) --- */}
      {/* ========================================================================= */}
      {/* TIER 1: Bet Adjusters & Win Displays - Rigid Geometry, Zero Reflow */}
      <div className="hidden sm:flex bg-gradient-to-r from-casino-900 via-casino-850 to-casino-900 border border-white/10 rounded-2xl p-1.5 sm:p-2 shadow-xl items-center justify-between gap-2 flex-shrink-0">
        {/* Left: Turbo, Lines, Bet/Line, Total, Max Bet */}
        <div className="flex items-center justify-center space-x-1 sm:space-x-1.5 flex-shrink-0 h-9 sm:h-10">
          {/* Turbo Toggle */}
          <button
            onClick={() => {
              soundManager.playButtonClick();
              onTurboToggle();
            }}
            disabled={isSpinning}
            title={isTurbo ? 'Turbo Mode: FAST' : 'Turbo Mode: NORMAL'}
            className={`w-9 h-9 sm:w-10 sm:h-10 rounded-xl border flex items-center justify-center flex-shrink-0 transition-all ${
              isTurbo
                ? 'bg-gradient-to-b from-amber-500/30 to-amber-950/60 border-amber-400 text-amber-300 shadow-[0_0_15px_rgba(245,158,11,0.6)]'
                : 'vlt-btn-stepper text-slate-400 hover:text-white'
            }`}
          >
            <Zap className={`w-4 h-4 sm:w-4.5 sm:h-4.5 ${isTurbo ? 'fill-amber-400 animate-pulse text-amber-300' : ''}`} />
          </button>

          {/* Lines & Bet Display Box */}
          <div className={`flex items-center space-x-1 sm:space-x-1.5 px-1.5 sm:px-2 py-0.5 rounded-xl border shadow-inner h-9 sm:h-10 flex-shrink-0 ${
            isTimber
              ? 'bg-gradient-to-b from-[#142318] to-[#0a140e] border-emerald-600/50'
              : 'bg-gradient-to-b from-casino-950 to-casino-900 border-white/15'
          }`}>
            {/* Active Lines selector with - / + buttons */}
            <div className="flex flex-col items-center pr-1 sm:pr-1.5 border-r border-white/10">
              <span className={`text-[7.5px] sm:text-[8.5px] uppercase font-bold tracking-wider leading-none ${
                isTimber ? 'text-emerald-400' : 'text-slate-400'
              }`}>
                Lines
              </span>
              <div className="flex items-center space-x-0.5 sm:space-x-1 mt-0.5">
                <button
                  onClick={() => handleLinesStep('down')}
                  disabled={isSpinning || isFreeSpins || selectedLines <= 1}
                  className="w-5 h-5 rounded-md vlt-btn-stepper disabled:opacity-30 flex items-center justify-center text-slate-200 font-bold"
                >
                  <Minus className={`w-3 h-3 ${isTimber ? 'text-emerald-300' : 'text-cyan-300'}`} />
                </button>
                <span className={`text-xs sm:text-sm font-black min-w-[20px] text-center font-mono ${
                  isTimber
                    ? 'text-emerald-300 drop-shadow-[0_0_6px_rgba(52,211,153,0.8)]'
                    : 'text-neon-cyan drop-shadow-[0_0_6px_rgba(0,240,255,0.7)]'
                }`}>
                  {selectedLines}
                </span>
                <button
                  onClick={() => handleLinesStep('up')}
                  disabled={isSpinning || isFreeSpins || selectedLines >= maxLines}
                  className="w-5 h-5 rounded-md vlt-btn-stepper disabled:opacity-30 flex items-center justify-center text-slate-200 font-bold"
                >
                  <Plus className={`w-3 h-3 ${isTimber ? 'text-emerald-300' : 'text-cyan-300'}`} />
                </button>
              </div>
            </div>

            {/* Bet Per Line with - / + buttons */}
            <div className="flex flex-col items-center px-0.5 sm:px-1">
              <span className={`text-[7.5px] sm:text-[8.5px] uppercase font-bold tracking-wider leading-none ${
                isTimber ? 'text-emerald-400' : 'text-slate-400'
              }`}>
                Bet/Line
              </span>
              <div className="flex items-center space-x-0.5 sm:space-x-1 mt-0.5">
                <button
                  onClick={() => handleBetStep('down')}
                  disabled={isSpinning || isFreeSpins || betPerLine <= 1}
                  className="w-5 h-5 rounded-md vlt-btn-stepper disabled:opacity-30 flex items-center justify-center text-slate-200 font-bold"
                >
                  <Minus className={`w-3 h-3 ${isTimber ? 'text-amber-300' : 'text-amber-300'}`} />
                </button>
                <span className="text-xs sm:text-sm font-black text-white min-w-[26px] text-center font-mono">
                  {betPerLine.toLocaleString()}
                </span>
                <button
                  onClick={() => handleBetStep('up')}
                  disabled={isSpinning || isFreeSpins || (betPerLine * selectedLines) >= maxBet}
                  className="w-5 h-5 rounded-md vlt-btn-stepper disabled:opacity-30 flex items-center justify-center text-slate-200 font-bold"
                >
                  <Plus className={`w-3 h-3 ${isTimber ? 'text-amber-300' : 'text-amber-300'}`} />
                </button>
              </div>
            </div>

            {/* Total Bet Calculation */}
            <div className="flex flex-col items-center pl-1 sm:pl-1.5 border-l border-white/10 min-w-[55px] sm:min-w-[65px]">
              <span className={`text-[7.5px] sm:text-[8.5px] uppercase font-bold tracking-wider leading-none ${
                isTimber ? 'text-emerald-400' : 'text-gold-bright'
              }`}>
                Total Bet
              </span>
              <span className={`text-xs sm:text-sm font-black font-mono leading-none mt-1 ${
                isTimber
                  ? 'text-emerald-200 drop-shadow-[0_0_8px_rgba(52,211,153,0.7)]'
                  : 'text-amber-300 drop-shadow-[0_0_8px_rgba(251,191,36,0.5)]'
              }`}>
                {totalBet.toLocaleString()}
              </span>
            </div>
          </div>

          {/* Themed Max Bet Button */}
          <button
            onClick={() => {
              soundManager.playChipClick();
              onMaxBet();
            }}
            disabled={isSpinning || isFreeSpins || totalBet >= maxBet}
            className={`px-2 sm:px-2.5 h-9 sm:h-10 rounded-xl font-black text-[9px] sm:text-[10px] uppercase tracking-wider disabled:opacity-40 flex items-center justify-center flex-shrink-0 shadow-md ${
              isTimber
                ? 'bg-gradient-to-r from-amber-600 via-yellow-500 to-amber-700 text-amber-950 border border-yellow-200 shadow-[0_0_15px_rgba(245,158,11,0.6)]'
                : 'vlt-maxbet-btn text-amber-950'
            }`}
          >
            MAX BET
          </button>
        </div>

        {/* Right: Win Payout, Gamble 2X, and Auto-Spin */}
        <div className="flex items-center justify-center space-x-1 sm:space-x-1.5 flex-shrink-0 h-9 sm:h-10">
          {/* Animated Rolling Win Display */}
          <RollingWinDisplay targetAmount={winAmount} isFreeSpins={isFreeSpins} />

          {/* Themed Video Poker Style Double-Up Gamble Button (Always present to prevent layout shift) */}
          {onOpenGamble && (
            <button
              onClick={() => {
                if (winAmount > 0 && !isSpinning && !isFreeSpins) {
                  soundManager.playButtonClick();
                  onOpenGamble();
                }
              }}
              disabled={winAmount <= 0 || isSpinning || isFreeSpins}
              className={`flex items-center justify-center space-x-1 w-20 sm:w-24 h-9 sm:h-10 rounded-xl font-black text-[9px] sm:text-[10px] uppercase transition-all duration-200 flex-shrink-0 ${
                winAmount > 0 && !isSpinning && !isFreeSpins
                  ? 'vlt-gamble-btn text-white animate-pulse cursor-pointer shadow-[0_0_15px_rgba(244,63,94,0.7)]'
                  : 'bg-casino-950/40 border border-white/5 text-slate-600 opacity-40 cursor-not-allowed'
              }`}
              title={
                winAmount > 0 && !isSpinning && !isFreeSpins
                  ? 'Risk your win to double it in Video Poker Double-Up'
                  : 'Win credits on any spin to activate Gamble 2X'
              }
            >
              <Dices className={`w-3.5 h-3.5 ${winAmount > 0 ? 'text-yellow-300' : 'text-slate-600'}`} />
              <span className="hidden xs:inline">GAMBLE</span>
              <span>2X</span>
            </button>
          )}

          {/* Auto Spin Button & Popover */}
          <div className="relative flex-shrink-0">
            {isAutoSpinning ? (
              <button
                onClick={onAutoSpinStop}
                className="flex items-center justify-center space-x-1 px-2.5 h-9 sm:h-10 rounded-xl bg-rose-600/30 border border-rose-500 text-rose-300 font-bold text-xs uppercase animate-pulse shadow-[0_0_12px_rgba(244,63,94,0.5)]"
              >
                <StopCircle className="w-4 h-4" />
                <span>Stop ({autoSpinsRemaining})</span>
              </button>
            ) : (
              <button
                onClick={() => {
                  soundManager.playButtonClick();
                  setShowAutoMenu(!showAutoMenu);
                }}
                disabled={isSpinning || isFreeSpins}
                className="flex items-center justify-center space-x-1 px-2.5 h-9 sm:h-10 rounded-xl vlt-btn-stepper text-slate-300 font-bold text-xs uppercase tracking-wider disabled:opacity-40"
              >
                <RefreshCw className="w-3.5 h-3.5 text-emerald-400" />
                <span>Auto</span>
              </button>
            )}

            {/* Auto Spin Count Modal */}
            {showAutoMenu && !isAutoSpinning && (
              <div className="absolute bottom-full mb-2 right-0 bg-casino-900 border border-white/20 rounded-xl p-2 shadow-2xl flex flex-col space-y-1.5 z-40 min-w-[130px]">
                <div className="text-[10px] text-slate-400 font-bold uppercase text-center py-0.5">
                  Select Auto Spins
                </div>
                {[10, 25, 50, 100].map((count) => (
                  <button
                    key={count}
                    onClick={() => {
                      soundManager.playButtonClick();
                      setShowAutoMenu(false);
                      onAutoSpinStart(count);
                    }}
                    className="px-3 py-1.5 rounded-lg bg-casino-800 hover:bg-gold-metallic hover:text-white text-xs font-bold text-slate-200 text-center transition-colors"
                  >
                    {count} Spins
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* TIER 2: Dedicated Centered Action Line for SPIN / STOP - (Desktop only >= 640px) */}
      <div className="hidden sm:flex w-full h-14 sm:h-16 items-center justify-center flex-shrink-0">
        <button
          onClick={handleTriggerSpin}
          disabled={!isSpinning && !isFreeSpins && balance < totalBet}
          title={
            isSpinning
              ? 'Quick Stop (Space / Click)'
              : !isFreeSpins && balance < totalBet
              ? 'Insufficient coins'
              : undefined
          }
          className={`relative w-64 sm:w-80 h-12 sm:h-14 flex-shrink-0 flex items-center justify-center rounded-2xl font-black tracking-widest text-lg sm:text-xl uppercase text-white select-none transition-all touch-manipulation ${
            isSpinning
              ? isTimber
                ? 'bg-gradient-to-r from-rose-700 via-red-600 to-rose-800 border-2 border-red-300 shadow-[0_0_20px_rgba(244,63,94,0.8)] animate-pulse cursor-pointer'
                : 'vlt-stop-btn animate-pulse cursor-pointer'
              : !isFreeSpins && balance < totalBet
              ? 'bg-slate-800 opacity-40 cursor-not-allowed text-slate-500 border border-white/5'
              : isFreeSpins
              ? isTimber
                ? 'bg-gradient-to-r from-emerald-600 via-teal-500 to-amber-500 border-2 border-yellow-300 shadow-[0_0_25px_rgba(16,185,129,0.9)] animate-pulse'
                : 'vlt-spin-btn animate-pulse'
              : isTimber
              ? 'bg-gradient-to-r from-emerald-600 via-green-500 to-emerald-700 border-2 border-emerald-300 shadow-[0_0_30px_rgba(16,185,129,0.8)] hover:brightness-110 active:scale-95'
              : 'vlt-spin-btn'
          }`}
        >
          {isSpinning ? (
            <span className="flex items-center space-x-2 text-white">
              <StopCircle className="w-6 h-6 fill-white text-rose-700" />
              <span>{isTimber ? 'LEAF STOP' : 'STOP'}</span>
            </span>
          ) : isAutoSpinning ? (
            <span className="flex items-center space-x-2">
              <StopCircle className="w-6 h-6" />
              <span>STOP</span>
            </span>
          ) : isFreeSpins ? (
            <span className="flex items-center space-x-2">
              <Flame className="w-6 h-6 text-yellow-300 fill-yellow-300 animate-pulse" />
              <span>{isTimber ? 'OWL FREE SPIN' : 'FREE SPIN'}</span>
            </span>
          ) : (
            <span className="flex items-center space-x-2">
              {isTimber ? <Trees className="w-6 h-6 text-emerald-200 fill-emerald-200" /> : null}
              <span>{isTimber ? 'WOODLAND SPIN' : 'SPIN'}</span>
              {isTimber ? <Trees className="w-6 h-6 text-emerald-200 fill-emerald-200" /> : null}
            </span>
          )}
        </button>
      </div>
    </div>
  );
};
