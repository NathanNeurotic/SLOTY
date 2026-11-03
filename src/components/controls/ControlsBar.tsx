import React, { useState } from 'react';
import { Minus, Plus, Zap, RefreshCw, Flame, StopCircle, Dices, Trees, Gamepad2 } from 'lucide-react';
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
  betSteps?: number[];
  maxBetPerLine?: number;
  maxTotalBet?: number;
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
  betSteps,
  maxBetPerLine,
  maxTotalBet,
}) => {
  const isTimber = activeGameId === 'timber-critters';
  const isPixel = activeGameId === 'pixel-arcade';
  const isPs2 = activeGameId === 'ps2-legends';
  const [showAutoMenu, setShowAutoMenu] = useState(false);

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

  // =========================================================================
  // --- VERSION A: PIXEL ARCADE (JAPANESE COIN-OP FIGHTSTICK CONSOLE) ---
  // =========================================================================
  const renderPixelDesktopControls = () => (
    <div className="hidden sm:flex flex-col space-y-1 sm:space-y-1.5 w-full font-mono">
      {/* Heavy Brushed-Steel Control Panel with Stepped 8-Bit Chassis */}
      <div
        className="relative bg-gradient-to-b from-[#1c1c28] via-[#101018] to-[#08080f] border-2 border-pink-500 p-1 sm:p-1.5 shadow-[0_0_20px_rgba(236,72,153,0.35),inset_0_1px_3px_rgba(255,255,255,0.2)] flex items-center justify-between gap-1.5 sm:gap-2"
        style={{
          clipPath:
            'polygon(0 8px, 8px 0, calc(100% - 8px) 0, 100% 8px, 100% calc(100% - 8px), calc(100% - 8px) 100%, 8px 100%, 0 calc(100% - 8px))',
        }}
      >
        {/* Corner Hex Mounting Screws */}
        <div className="absolute top-1 left-1.5 w-1.5 h-1.5 bg-slate-700 border border-slate-500 flex items-center justify-center">
          <div className="w-1 h-0.5 bg-black" />
        </div>
        <div className="absolute top-1 right-1.5 w-1.5 h-1.5 bg-slate-700 border border-slate-500 flex items-center justify-center">
          <div className="w-1 h-0.5 bg-black" />
        </div>
        <div className="absolute bottom-1 left-1.5 w-1.5 h-1.5 bg-slate-700 border border-slate-500 flex items-center justify-center">
          <div className="w-1 h-0.5 bg-black" />
        </div>
        <div className="absolute bottom-1 right-1.5 w-1.5 h-1.5 bg-slate-700 border border-slate-500 flex items-center justify-center">
          <div className="w-1 h-0.5 bg-black" />
        </div>

        {/* Left Wing: Sanwa Push-Buttons for Lines & Coin Wager */}
        <div className="flex items-center space-x-1 sm:space-x-1.5 pl-1.5 sm:pl-2">
          {/* Turbo Microswitch */}
          <button
            onClick={() => {
              soundManager.playButtonClick();
              onTurboToggle();
            }}
            disabled={isSpinning}
            title={isTurbo ? 'Turbo: 2X SPEED' : 'Turbo: NORMAL'}
            className={`w-7.5 h-7.5 sm:w-8.5 sm:h-8.5 border-2 flex items-center justify-center transition-all ${
              isTurbo
                ? 'bg-gradient-to-tr from-amber-600 to-yellow-400 border-yellow-200 text-black shadow-[0_0_15px_#F59E0B] scale-105'
                : 'bg-black/80 border-slate-600 text-slate-400 hover:text-white hover:border-cyan-400'
            }`}
            style={{
              clipPath:
                'polygon(0 3px, 3px 0, calc(100% - 3px) 0, 100% 3px, 100% calc(100% - 3px), calc(100% - 3px) 100%, 3px 100%, 0 calc(100% - 3px))',
            }}
          >
            <Zap className={`w-3.5 h-3.5 ${isTurbo ? 'fill-black' : ''}`} />
          </button>

          {/* Sanwa Lines Controller */}
          <div
            className="flex flex-col items-center bg-black/90 px-1.5 py-0.5 sm:py-1 border border-cyan-400/80 shadow-inner"
            style={{
              clipPath:
                'polygon(0 3px, 3px 0, calc(100% - 3px) 0, 100% 3px, 100% 100%, 0 100%)',
            }}
          >
            <span className="text-[7px] font-black uppercase text-cyan-300 tracking-wider">LINES</span>
            <div className="flex items-center space-x-0.5 sm:space-x-1 mt-0.5">
              <button
                onClick={() => handleLinesStep('down')}
                disabled={isSpinning || isFreeSpins || selectedLines <= 1}
                className="w-5 h-5 sm:w-5.5 sm:h-5.5 bg-gradient-to-b from-slate-700 to-black border border-cyan-300 disabled:opacity-30 flex items-center justify-center text-cyan-300 shadow hover:brightness-125 active:scale-95"
              >
                <Minus className="w-2.5 h-2.5" />
              </button>
              <span className="text-xs sm:text-sm font-black text-cyan-200 min-w-[22px] sm:min-w-[26px] text-center drop-shadow-[0_0_8px_#06B6D4]">
                {selectedLines}
              </span>
              <button
                onClick={() => handleLinesStep('up')}
                disabled={isSpinning || isFreeSpins || selectedLines >= maxLines}
                className="w-5 h-5 sm:w-5.5 sm:h-5.5 bg-gradient-to-b from-slate-700 to-black border border-cyan-300 disabled:opacity-30 flex items-center justify-center text-cyan-300 shadow hover:brightness-125 active:scale-95"
              >
                <Plus className="w-2.5 h-2.5" />
              </button>
            </div>
          </div>

          {/* Sanwa Bet/Line Controller */}
          <div
            className="flex flex-col items-center bg-black/90 px-1.5 py-0.5 sm:py-1 border border-pink-500/80 shadow-inner"
            style={{
              clipPath:
                'polygon(0 3px, 3px 0, calc(100% - 3px) 0, 100% 3px, 100% 100%, 0 100%)',
            }}
          >
            <span className="text-[7px] font-black uppercase text-pink-300 tracking-wider">COIN BET</span>
            <div className="flex items-center space-x-0.5 sm:space-x-1 mt-0.5">
              <button
                onClick={() => handleBetStep('down')}
                disabled={isSpinning || isFreeSpins || betPerLine <= 1}
                className="w-5 h-5 sm:w-5.5 sm:h-5.5 bg-gradient-to-b from-slate-700 to-black border border-pink-400 disabled:opacity-30 flex items-center justify-center text-pink-300 shadow hover:brightness-125 active:scale-95"
              >
                <Minus className="w-2.5 h-2.5" />
              </button>
              <span className="text-xs sm:text-sm font-black text-pink-200 min-w-[24px] sm:min-w-[28px] text-center drop-shadow-[0_0_8px_#EC4899]">
                {betPerLine}
              </span>
              <button
                onClick={() => handleBetStep('up')}
                disabled={isSpinning || isFreeSpins || betPerLine >= effectiveMaxBetPerLine || (betPerLine * selectedLines) >= maxAllowedBet}
                className="w-5 h-5 sm:w-5.5 sm:h-5.5 bg-gradient-to-b from-slate-700 to-black border border-pink-400 disabled:opacity-30 flex items-center justify-center text-pink-300 shadow hover:brightness-125 active:scale-95"
              >
                <Plus className="w-2.5 h-2.5" />
              </button>
            </div>
          </div>

          {/* 7-Segment Total Bet Box */}
          <div className="flex flex-col items-center px-1.5 py-0.5 sm:py-1 bg-black border border-purple-500 shadow-inner min-w-[55px] sm:min-w-[65px]">
            <span className="text-[6.5px] font-black uppercase text-purple-300 tracking-wider">TOTAL BET</span>
            <span className="text-xs sm:text-sm font-black text-yellow-300 drop-shadow-[0_0_8px_#F59E0B]">
              {totalBet.toLocaleString()}
            </span>
          </div>

          {/* Stepped Red Sanwa MAX BET Button */}
          <button
            onClick={() => {
              soundManager.playChipClick();
              onMaxBet();
            }}
            disabled={isSpinning || isFreeSpins || totalBet >= maxAllowedBet}
            className="w-8.5 h-8.5 sm:w-9.5 sm:h-9.5 md:w-10 md:h-10 bg-gradient-to-b from-red-500 via-rose-600 to-red-900 border-2 border-yellow-300 shadow-[0_0_12px_#EF4444] disabled:opacity-30 flex flex-col items-center justify-center text-white font-black text-[7.5px] sm:text-[8px] uppercase tracking-wider hover:brightness-110 active:scale-95 flex-shrink-0"
            style={{
              clipPath:
                'polygon(0 3px, 3px 0, calc(100% - 3px) 0, 100% 3px, 100% calc(100% - 3px), calc(100% - 3px) 100%, 3px 100%, 0 calc(100% - 3px))',
            }}
          >
            <span>MAX</span>
            <span className="text-[6.5px] sm:text-[7px] text-yellow-200">BET</span>
          </button>
        </div>

        {/* Center Section: Dual 25¢ Coin Reject Housing */}
        <div
          className="hidden md:flex items-center space-x-1.5 px-2 py-0.5 bg-black/90 border border-orange-500/70 shadow-inner"
          style={{
            clipPath:
              'polygon(0 3px, 3px 0, calc(100% - 3px) 0, 100% 3px, 100% calc(100% - 3px), calc(100% - 3px) 100%, 3px 100%, 0 calc(100% - 3px))',
          }}
        >
          <div className="w-2 h-6 bg-black border border-slate-600 flex items-center justify-center">
            <div className="w-1 h-3.5 bg-yellow-400 animate-pulse" />
          </div>
          <div
            onClick={handleTriggerSpin}
            className="px-1.5 py-0.5 bg-gradient-to-b from-orange-500 to-amber-700 border border-orange-300 shadow-[0_0_8px_#F97316] text-[8px] font-black text-amber-950 cursor-pointer active:scale-95 flex flex-col items-center leading-tight"
          >
            <span>25¢</span>
            <span className="text-[6px]">DROP</span>
          </div>
        </div>

        {/* Right Wing: Win Score Display & Arcade Service Buttons */}
        <div className="flex items-center space-x-1 sm:space-x-1.5 pr-1.5 sm:pr-2">
          <RollingWinDisplay targetAmount={winAmount} isFreeSpins={isFreeSpins} activeGameId={activeGameId} />

          {/* 2X Double-Up Arcade Button */}
          {onOpenGamble && (
            <button
              onClick={() => {
                if (winAmount > 0 && !isSpinning && !isFreeSpins) {
                  soundManager.playButtonClick();
                  onOpenGamble();
                }
              }}
              disabled={winAmount <= 0 || isSpinning || isFreeSpins}
              className={`w-8.5 h-8.5 sm:w-9.5 sm:h-9.5 md:w-10 md:h-10 border-2 flex flex-col items-center justify-center text-[7.5px] sm:text-[8px] font-black uppercase transition-all ${
                winAmount > 0 && !isSpinning && !isFreeSpins
                  ? 'bg-gradient-to-b from-yellow-400 to-amber-600 border-yellow-200 text-black animate-bounce shadow-[0_0_15px_#FBBF24]'
                  : 'bg-black/50 border-slate-700 text-slate-600 opacity-40 cursor-not-allowed'
              }`}
              style={{
                clipPath:
                  'polygon(0 3px, 3px 0, calc(100% - 3px) 0, 100% 3px, 100% calc(100% - 3px), calc(100% - 3px) 100%, 3px 100%, 0 calc(100% - 3px))',
              }}
            >
              <span>2X</span>
              <span className="text-[6px]">RISK</span>
            </button>
          )}

          {/* Auto Play Sanwa Button */}
          <div className="relative">
            {isAutoSpinning ? (
              <button
                onClick={onAutoSpinStop}
                className="w-8.5 h-8.5 sm:w-9.5 sm:h-9.5 md:w-10 md:h-10 bg-rose-600 border-2 border-rose-300 text-white font-black text-[7.5px] sm:text-[8px] uppercase flex flex-col items-center justify-center animate-pulse shadow-[0_0_12px_#F43F5E]"
                style={{
                  clipPath:
                    'polygon(0 3px, 3px 0, calc(100% - 3px) 0, 100% 3px, 100% calc(100% - 3px), calc(100% - 3px) 100%, 3px 100%, 0 calc(100% - 3px))',
                }}
              >
                <span>STOP</span>
                <span className="text-[6.5px]">({autoSpinsRemaining})</span>
              </button>
            ) : (
              <button
                onClick={() => {
                  soundManager.playButtonClick();
                  setShowAutoMenu(!showAutoMenu);
                }}
                disabled={isSpinning || isFreeSpins}
                className="w-8.5 h-8.5 sm:w-9.5 sm:h-9.5 md:w-10 md:h-10 bg-gradient-to-b from-purple-700 to-indigo-900 border-2 border-purple-400 text-purple-200 font-black text-[7.5px] sm:text-[8px] uppercase flex flex-col items-center justify-center hover:brightness-125 active:scale-95 disabled:opacity-40"
                style={{
                  clipPath:
                    'polygon(0 3px, 3px 0, calc(100% - 3px) 0, 100% 3px, 100% calc(100% - 3px), calc(100% - 3px) 100%, 3px 100%, 0 calc(100% - 3px))',
                }}
              >
                <RefreshCw className="w-3 h-3 text-cyan-300 mb-0.5" />
                <span>AUTO</span>
              </button>
            )}

            {showAutoMenu && !isAutoSpinning && (
              <div
                className="absolute bottom-full mb-2 right-0 bg-black border-2 border-pink-500 p-2 shadow-2xl flex flex-col space-y-1.5 z-40 min-w-[120px]"
                style={{
                  clipPath:
                    'polygon(0 4px, 4px 0, calc(100% - 4px) 0, 100% 4px, 100% calc(100% - 4px), calc(100% - 4px) 100%, 4px 100%, 0 calc(100% - 4px))',
                }}
              >
                <div className="text-[9px] text-pink-300 font-black uppercase text-center">AUTO SPINS</div>
                {[10, 25, 50, 100].map((count) => (
                  <button
                    key={count}
                    onClick={() => {
                      soundManager.playButtonClick();
                      setShowAutoMenu(false);
                      onAutoSpinStart(count);
                    }}
                    className="px-2 py-1 bg-purple-950 hover:bg-pink-600 text-xs font-bold text-cyan-200 text-center transition-colors"
                  >
                    {count} Plays
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Massive 80mm Stepped Sanwa Arcade Push-Bar */}
      <div className="w-full h-8 sm:h-9 md:h-10 flex items-center justify-center">
        <button
          onClick={handleTriggerSpin}
          disabled={!isSpinning && !isFreeSpins && balance < totalBet}
          className={`w-72 sm:w-88 md:w-96 h-8 sm:h-9 md:h-9.5 font-black tracking-widest text-xs sm:text-sm md:text-base uppercase select-none transition-all touch-manipulation shadow-xl border-2 active:scale-95 flex items-center justify-center ${
            isSpinning
              ? 'bg-gradient-to-r from-red-600 to-rose-700 border-red-300 text-white shadow-[0_0_25px_#EF4444] animate-pulse'
              : !isFreeSpins && balance < totalBet
              ? 'bg-slate-900 opacity-40 border-slate-700 text-slate-500 cursor-not-allowed'
              : isFreeSpins
              ? 'bg-gradient-to-r from-purple-600 via-pink-600 to-cyan-500 border-pink-300 text-white shadow-[0_0_35px_#EC4899] animate-pulse'
              : 'bg-gradient-to-r from-pink-600 via-purple-600 to-cyan-500 hover:from-pink-500 hover:to-cyan-400 border-pink-300 text-white shadow-[0_0_35px_rgba(236,72,153,0.9)] hover:scale-[1.01]'
          }`}
          style={{
            clipPath:
              'polygon(0 6px, 6px 0, calc(100% - 6px) 0, 100% 6px, 100% calc(100% - 6px), calc(100% - 6px) 100%, 6px 100%, 0 calc(100% - 6px))',
          }}
        >
          {isSpinning ? (
            <span className="flex items-center space-x-2">
              <StopCircle className="w-5 h-5 text-white" />
              <span>[ QUICK STOP ]</span>
            </span>
          ) : isFreeSpins ? (
            <span className="flex items-center space-x-2">
              <Flame className="w-5 h-5 text-yellow-300 animate-pulse" />
              <span>👾 BOSS RUSH (3X MULTIPLIER) 👾</span>
            </span>
          ) : !isFreeSpins && balance < totalBet ? (
            <span>🪙 NEED 25¢ CREDITS 🪙</span>
          ) : (
            <span className="flex items-center space-x-2">
              <Gamepad2 className="w-5 h-5 text-cyan-200" />
              <span>🕹️ 1P START / INSERT COIN 🕹️</span>
              <Gamepad2 className="w-5 h-5 text-cyan-200" />
            </span>
          )}
        </button>
      </div>
    </div>
  );

  // =========================================================================
  // --- VERSION B: TIMBERLAND CRITTERS (RUSTIC CEDAR LOG HEWN CONSOLE) ---
  // =========================================================================
  const renderTimberDesktopControls = () => (
    <div className="hidden sm:flex flex-col space-y-1 sm:space-y-1.5 w-full font-serif">
      {/* Hewn Cedar Bench Console with Notched Log Ends */}
      <div
        className="relative bg-gradient-to-b from-[#2e170c] via-[#1a0c05] to-[#0a0502] border-2 sm:border-3 border-[#78350f] p-1 sm:p-1.5 shadow-[0_10px_25px_rgba(0,0,0,0.95),0_0_20px_rgba(16,185,129,0.25)] flex items-center justify-between gap-1.5 sm:gap-2"
        style={{
          clipPath:
            'polygon(0% 10%, 2% 0%, 98% 0%, 100% 10%, 98% 50%, 100% 90%, 98% 100%, 2% 100%, 0% 90%, 2% 50%)',
        }}
      >
        {/* Left Wing: Tree-Stump Growth Ring Dials */}
        <div className="flex items-center space-x-1 sm:space-x-1.5 pl-1.5 sm:pl-2.5">
          {/* Amber Crystal Turbo Toggle */}
          <button
            onClick={() => {
              soundManager.playButtonClick();
              onTurboToggle();
            }}
            disabled={isSpinning}
            title={isTurbo ? 'Turbo Fast' : 'Normal Speed'}
            className={`w-7.5 h-7.5 sm:w-8.5 sm:h-8.5 border-2 flex items-center justify-center transition-all ${
              isTurbo
                ? 'bg-gradient-to-b from-amber-600 to-yellow-500 border-amber-200 text-amber-950 shadow-[0_0_15px_#F59E0B] scale-105'
                : 'bg-[#180e07] border-[#854d0e] text-amber-300 hover:text-white'
            }`}
            style={{
              clipPath:
                'polygon(6px 0, calc(100% - 6px) 0, 100% 6px, 100% calc(100% - 6px), calc(100% - 6px) 100%, 6px 100%, 0 calc(100% - 6px), 0 6px)',
            }}
          >
            <Zap className={`w-3.5 h-3.5 ${isTurbo ? 'fill-amber-950' : ''}`} />
          </button>

          {/* Carved Wood Lines Dial */}
          <div
            className="flex flex-col items-center bg-[#150a04] px-1.5 py-0.5 sm:py-1 border border-[#a16207] shadow-inner"
            style={{
              clipPath:
                'polygon(6px 0, calc(100% - 6px) 0, 100% 6px, 100% calc(100% - 6px), calc(100% - 6px) 100%, 6px 100%, 0 calc(100% - 6px), 0 6px)',
            }}
          >
            <span className="text-[7px] font-black uppercase text-emerald-400 tracking-wider">TRAIL LINES</span>
            <div className="flex items-center space-x-0.5 sm:space-x-1 mt-0.5">
              <button
                onClick={() => handleLinesStep('down')}
                disabled={isSpinning || isFreeSpins || selectedLines <= 1}
                className="w-5 h-5 sm:w-5.5 sm:h-5.5 bg-[#2e180e] border border-[#a16207] disabled:opacity-30 flex items-center justify-center text-amber-300 hover:bg-[#3d1c0a] active:scale-95"
                style={{
                  clipPath:
                    'polygon(3px 0, calc(100% - 3px) 0, 100% 3px, 100% calc(100% - 3px), calc(100% - 3px) 100%, 3px 100%, 0 calc(100% - 3px), 0 3px)',
                }}
              >
                <Minus className="w-2.5 h-2.5 text-emerald-300" />
              </button>
              <span className="text-xs sm:text-sm font-black text-emerald-300 min-w-[22px] sm:min-w-[26px] text-center font-mono drop-shadow-[0_0_6px_#34D399]">
                {selectedLines}
              </span>
              <button
                onClick={() => handleLinesStep('up')}
                disabled={isSpinning || isFreeSpins || selectedLines >= maxLines}
                className="w-5 h-5 sm:w-5.5 sm:h-5.5 bg-[#2e180e] border border-[#a16207] disabled:opacity-30 flex items-center justify-center text-amber-300 hover:bg-[#3d1c0a] active:scale-95"
                style={{
                  clipPath:
                    'polygon(3px 0, calc(100% - 3px) 0, 100% 3px, 100% calc(100% - 3px), calc(100% - 3px) 100%, 3px 100%, 0 calc(100% - 3px), 0 3px)',
                }}
              >
                <Plus className="w-2.5 h-2.5 text-emerald-300" />
              </button>
            </div>
          </div>

          {/* Carved Acorn Wager Disc */}
          <div
            className="flex flex-col items-center bg-[#150a04] px-1.5 py-0.5 sm:py-1 border border-[#a16207] shadow-inner"
            style={{
              clipPath:
                'polygon(6px 0, calc(100% - 6px) 0, 100% 6px, 100% calc(100% - 6px), calc(100% - 6px) 100%, 6px 100%, 0 calc(100% - 6px), 0 6px)',
            }}
          >
            <span className="text-[7px] font-black uppercase text-amber-400 tracking-wider">ACORN BET</span>
            <div className="flex items-center space-x-0.5 sm:space-x-1 mt-0.5">
              <button
                onClick={() => handleBetStep('down')}
                disabled={isSpinning || isFreeSpins || betPerLine <= 1}
                className="w-5 h-5 sm:w-5.5 sm:h-5.5 bg-[#2e180e] border border-[#a16207] disabled:opacity-30 flex items-center justify-center text-amber-300 hover:bg-[#3d1c0a] active:scale-95"
                style={{
                  clipPath:
                    'polygon(3px 0, calc(100% - 3px) 0, 100% 3px, 100% calc(100% - 3px), calc(100% - 3px) 100%, 3px 100%, 0 calc(100% - 3px), 0 3px)',
                }}
              >
                <Minus className="w-2.5 h-2.5" />
              </button>
              <span className="text-xs sm:text-sm font-black text-amber-200 min-w-[24px] sm:min-w-[28px] text-center font-mono drop-shadow-[0_0_6px_#F59E0B]">
                {betPerLine}
              </span>
              <button
                onClick={() => handleBetStep('up')}
                disabled={isSpinning || isFreeSpins || betPerLine >= effectiveMaxBetPerLine || (betPerLine * selectedLines) >= maxAllowedBet}
                className="w-5 h-5 sm:w-5.5 sm:h-5.5 bg-[#2e180e] border border-[#a16207] disabled:opacity-30 flex items-center justify-center text-amber-300 hover:bg-[#3d1c0a] active:scale-95"
                style={{
                  clipPath:
                    'polygon(3px 0, calc(100% - 3px) 0, 100% 3px, 100% calc(100% - 3px), calc(100% - 3px) 100%, 3px 100%, 0 calc(100% - 3px), 0 3px)',
                }}
              >
                <Plus className="w-2.5 h-2.5" />
              </button>
            </div>
          </div>

          {/* Carved Pine Board Total Wager */}
          <div
            className="flex flex-col items-center px-1.5 py-0.5 sm:py-1 bg-[#100703] border border-[#78350f] shadow-inner min-w-[55px] sm:min-w-[65px]"
            style={{
              clipPath:
                'polygon(4px 0, calc(100% - 4px) 0, 100% 4px, 100% calc(100% - 4px), calc(100% - 4px) 100%, 4px 100%, 0 calc(100% - 4px), 0 4px)',
            }}
          >
            <span className="text-[6.5px] font-black uppercase text-amber-400 tracking-wider">WAGER</span>
            <span className="text-xs sm:text-sm font-black text-emerald-300 font-mono drop-shadow-[0_0_8px_#34D399]">
              {totalBet.toLocaleString()}
            </span>
          </div>

          {/* Bear-Paw Branded Wood Block MAX WAGER */}
          <button
            onClick={() => {
              soundManager.playChipClick();
              onMaxBet();
            }}
            disabled={isSpinning || isFreeSpins || totalBet >= maxAllowedBet}
            className="w-8.5 h-8.5 sm:w-9.5 sm:h-9.5 md:w-10 md:h-10 bg-gradient-to-b from-[#b45309] to-[#78350f] border-2 border-amber-300 shadow-[0_0_12px_rgba(245,158,11,0.5)] disabled:opacity-30 flex flex-col items-center justify-center text-amber-950 font-black text-[7.5px] sm:text-[8px] uppercase tracking-wider hover:brightness-110 active:scale-95 flex-shrink-0"
            style={{
              clipPath:
                'polygon(6px 0, calc(100% - 6px) 0, 100% 6px, 100% calc(100% - 6px), calc(100% - 6px) 100%, 6px 100%, 0 calc(100% - 6px), 0 6px)',
            }}
          >
            <span>🐾 MAX</span>
            <span className="text-[6.5px] sm:text-[7px] text-amber-200">WAGER</span>
          </button>
        </div>

        {/* Right Wing: Birch Bark Win Plaque & Log Controls */}
        <div className="flex items-center space-x-1 sm:space-x-1.5 pr-1.5 sm:pr-2.5">
          <RollingWinDisplay targetAmount={winAmount} isFreeSpins={isFreeSpins} activeGameId={activeGameId} />

          {/* River Stone Double-Up Button */}
          {onOpenGamble && (
            <button
              onClick={() => {
                if (winAmount > 0 && !isSpinning && !isFreeSpins) {
                  soundManager.playButtonClick();
                  onOpenGamble();
                }
              }}
              disabled={winAmount <= 0 || isSpinning || isFreeSpins}
              className={`w-8.5 h-8.5 sm:w-9.5 sm:h-9.5 md:w-10 md:h-10 border-2 flex flex-col items-center justify-center text-[7.5px] sm:text-[8px] font-black uppercase transition-all ${
                winAmount > 0 && !isSpinning && !isFreeSpins
                  ? 'bg-gradient-to-b from-amber-500 to-yellow-600 border-yellow-200 text-amber-950 animate-bounce shadow-[0_0_15px_#F59E0B]'
                  : 'bg-[#150a04] border-[#78350f] text-stone-600 opacity-40 cursor-not-allowed'
              }`}
              style={{
                clipPath:
                  'polygon(6px 0, calc(100% - 6px) 0, 100% 6px, 100% calc(100% - 6px), calc(100% - 6px) 100%, 6px 100%, 0 calc(100% - 6px), 0 6px)',
              }}
            >
              <span>2X</span>
              <span className="text-[6px]">RISK</span>
            </button>
          )}

          {/* Wooden Peg Auto Harvest */}
          <div className="relative">
            {isAutoSpinning ? (
              <button
                onClick={onAutoSpinStop}
                className="w-8.5 h-8.5 sm:w-9.5 sm:h-9.5 md:w-10 md:h-10 bg-rose-700 border-2 border-rose-300 text-white font-black text-[7.5px] sm:text-[8px] uppercase flex flex-col items-center justify-center animate-pulse shadow-[0_0_12px_#F43F5E]"
                style={{
                  clipPath:
                    'polygon(6px 0, calc(100% - 6px) 0, 100% 6px, 100% calc(100% - 6px), calc(100% - 6px) 100%, 6px 100%, 0 calc(100% - 6px), 0 6px)',
                }}
              >
                <span>STOP</span>
                <span className="text-[6.5px]">({autoSpinsRemaining})</span>
              </button>
            ) : (
              <button
                onClick={() => {
                  soundManager.playButtonClick();
                  setShowAutoMenu(!showAutoMenu);
                }}
                disabled={isSpinning || isFreeSpins}
                className="w-8.5 h-8.5 sm:w-9.5 sm:h-9.5 md:w-10 md:h-10 bg-[#2e180e] border-2 border-[#a16207] text-amber-200 font-black text-[7.5px] sm:text-[8px] uppercase flex flex-col items-center justify-center hover:bg-[#3d1c0a] active:scale-95 disabled:opacity-40"
                style={{
                  clipPath:
                    'polygon(6px 0, calc(100% - 6px) 0, 100% 6px, 100% calc(100% - 6px), calc(100% - 6px) 100%, 6px 100%, 0 calc(100% - 6px), 0 6px)',
                }}
              >
                <RefreshCw className="w-3 h-3 text-emerald-400 mb-0.5" />
                <span>AUTO</span>
              </button>
            )}

            {showAutoMenu && !isAutoSpinning && (
              <div
                className="absolute bottom-full mb-2 right-0 bg-[#1c0c04] border-2 border-[#a16207] p-2 shadow-2xl flex flex-col space-y-1.5 z-40 min-w-[120px]"
                style={{
                  clipPath:
                    'polygon(6px 0, calc(100% - 6px) 0, 100% 6px, 100% calc(100% - 6px), calc(100% - 6px) 100%, 6px 100%, 0 calc(100% - 6px), 0 6px)',
                }}
              >
                <div className="text-[9px] text-amber-300 font-black uppercase text-center">AUTO SPINS</div>
                {[10, 25, 50, 100].map((count) => (
                  <button
                    key={count}
                    onClick={() => {
                      soundManager.playButtonClick();
                      setShowAutoMenu(false);
                      onAutoSpinStart(count);
                    }}
                    className="px-2 py-1 bg-[#2e180e] hover:bg-[#451e0a] text-xs font-bold text-amber-200 text-center transition-colors"
                  >
                    {count} Harvests
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Massive Carved Redwood Push-Bar with Notched Ends */}
      <div className="w-full h-8 sm:h-9 md:h-10 flex items-center justify-center">
        <button
          onClick={handleTriggerSpin}
          disabled={!isSpinning && !isFreeSpins && balance < totalBet}
          className={`w-72 sm:w-88 md:w-96 h-8 sm:h-9 md:h-9.5 font-black tracking-widest text-xs sm:text-sm md:text-base uppercase select-none transition-all touch-manipulation shadow-xl border-2 active:scale-95 flex items-center justify-center font-serif ${
            isSpinning
              ? 'bg-gradient-to-r from-rose-800 via-red-700 to-rose-900 border-red-300 text-white shadow-[0_0_20px_#EF4444] animate-pulse'
              : !isFreeSpins && balance < totalBet
              ? 'bg-stone-900 opacity-40 border-stone-700 text-stone-500 cursor-not-allowed'
              : isFreeSpins
              ? 'bg-gradient-to-r from-emerald-600 via-teal-500 to-amber-500 border-yellow-300 text-white shadow-[0_0_25px_#34D399] animate-pulse'
              : 'bg-gradient-to-r from-emerald-700 via-green-600 to-emerald-800 hover:from-emerald-600 hover:to-emerald-700 border-emerald-300 text-white shadow-[0_0_25px_rgba(16,185,129,0.8)] hover:scale-[1.01]'
          }`}
          style={{
            clipPath:
              'polygon(0% 15%, 2% 0%, 98% 0%, 100% 15%, 98% 50%, 100% 85%, 98% 100%, 2% 100%, 0% 85%, 2% 50%)',
          }}
        >
          {isSpinning ? (
            <span className="flex items-center space-x-2">
              <StopCircle className="w-5 h-5 text-white" />
              <span>LEAF STOP</span>
            </span>
          ) : isFreeSpins ? (
            <span className="flex items-center space-x-2">
              <Flame className="w-5 h-5 text-yellow-300 animate-pulse" />
              <span>🦉 MOONLIT FREE HARVEST 🦉</span>
            </span>
          ) : !isFreeSpins && balance < totalBet ? (
            <span>🪵 NEED MORE ACORNS 🪵</span>
          ) : (
            <span className="flex items-center space-x-2">
              <Trees className="w-5 h-5 text-emerald-200" />
              <span>🌲 WOODLAND HARVEST / SPIN 🌲</span>
              <Trees className="w-5 h-5 text-emerald-200" />
            </span>
          )}
        </button>
      </div>
    </div>
  );

  // =========================================================================
  // --- VERSION C: 24K GOLD VAULT (HIGH-ROLLER VIP SALON CONSOLE) ---
  // =========================================================================
  const renderVaultDesktopControls = () => (
    <div className="hidden sm:flex flex-col space-y-1 sm:space-y-1.5 w-full font-mono">
      {/* Polished Titanium & 24K Gold Bullion Ingot Console */}
      <div
        className="relative bg-gradient-to-r from-slate-950 via-casino-950 to-slate-950 border-2 border-yellow-400 p-1 sm:p-1.5 shadow-[0_10px_25px_rgba(0,0,0,0.95),0_0_20px_rgba(245,158,11,0.45)] flex items-center justify-between gap-1.5 sm:gap-2"
        style={{
          clipPath:
            'polygon(10px 0, calc(100% - 10px) 0, 100% 10px, 100% calc(100% - 10px), calc(100% - 10px) 100%, 10px 100%, 0 calc(100% - 10px), 0 10px)',
        }}
      >
        {/* Left Wing: Minted Casino Chips & Lines */}
        <div className="flex items-center space-x-1 sm:space-x-1.5 pl-1.5 sm:pl-2.5">
          <button
            onClick={() => {
              soundManager.playButtonClick();
              onTurboToggle();
            }}
            disabled={isSpinning}
            title={isTurbo ? 'Turbo Fast' : 'Normal Speed'}
            className={`w-7.5 h-7.5 sm:w-8.5 sm:h-8.5 border flex items-center justify-center transition-all ${
              isTurbo
                ? 'bg-gradient-to-b from-amber-500/30 to-amber-950/60 border-amber-400 text-amber-300 shadow-[0_0_15px_rgba(245,158,11,0.6)] scale-105'
                : 'vlt-btn-stepper text-slate-400 hover:text-white'
            }`}
            style={{
              clipPath:
                'polygon(5px 0, calc(100% - 5px) 0, 100% 5px, 100% calc(100% - 5px), calc(100% - 5px) 100%, 5px 100%, 0 calc(100% - 5px), 0 5px)',
            }}
          >
            <Zap className={`w-3.5 h-3.5 ${isTurbo ? 'fill-amber-400 text-amber-300' : ''}`} />
          </button>

          {/* Brass Lines Stepper */}
          <div
            className="flex flex-col items-center bg-casino-900 px-1.5 py-0.5 sm:py-1 border border-yellow-500/40 shadow-inner"
            style={{
              clipPath:
                'polygon(6px 0, calc(100% - 6px) 0, 100% 6px, 100% calc(100% - 6px), calc(100% - 6px) 100%, 6px 100%, 0 calc(100% - 6px), 0 6px)',
            }}
          >
            <span className="text-[7px] font-black uppercase text-slate-400 tracking-wider">LINES</span>
            <div className="flex items-center space-x-0.5 sm:space-x-1 mt-0.5">
              <button
                onClick={() => handleLinesStep('down')}
                disabled={isSpinning || isFreeSpins || selectedLines <= 1}
                className="w-5 h-5 sm:w-5.5 sm:h-5.5 vlt-btn-stepper disabled:opacity-30 flex items-center justify-center text-slate-200 font-bold active:scale-95"
                style={{
                  clipPath:
                    'polygon(3px 0, calc(100% - 3px) 0, 100% 3px, 100% calc(100% - 3px), calc(100% - 3px) 100%, 3px 100%, 0 calc(100% - 3px), 0 3px)',
                }}
              >
                <Minus className="w-2.5 h-2.5 text-cyan-300" />
              </button>
              <span className="text-xs sm:text-sm font-black text-neon-cyan min-w-[22px] sm:min-w-[26px] text-center font-mono drop-shadow-[0_0_6px_#00F0FF]">
                {selectedLines}
              </span>
              <button
                onClick={() => handleLinesStep('up')}
                disabled={isSpinning || isFreeSpins || selectedLines >= maxLines}
                className="w-5 h-5 sm:w-5.5 sm:h-5.5 vlt-btn-stepper disabled:opacity-30 flex items-center justify-center text-slate-200 font-bold active:scale-95"
                style={{
                  clipPath:
                    'polygon(3px 0, calc(100% - 3px) 0, 100% 3px, 100% calc(100% - 3px), calc(100% - 3px) 100%, 3px 100%, 0 calc(100% - 3px), 0 3px)',
                }}
              >
                <Plus className="w-2.5 h-2.5 text-cyan-300" />
              </button>
            </div>
          </div>

          {/* Minted Casino Chips Quick Bet Selector */}
          <div
            className="flex items-center space-x-1 px-1 sm:px-1.5 py-0.5 sm:py-1 bg-black/80 border border-yellow-500/60 shadow-inner"
            style={{
              clipPath:
                'polygon(6px 0, calc(100% - 6px) 0, 100% 6px, 100% calc(100% - 6px), calc(100% - 6px) 100%, 6px 100%, 0 calc(100% - 6px), 0 6px)',
            }}
          >
            {[1, 5, 25, 50, 100].map((step) => {
              const isSelected = betPerLine === step;
              const isChipAllowed = step <= effectiveMaxBetPerLine && step * selectedLines <= maxAllowedBet;
              return (
                <button
                  key={step}
                  onClick={() => {
                    if (isChipAllowed && !isSpinning && !isFreeSpins) {
                      soundManager.playChipClick();
                      onBetPerLineChange(step);
                    }
                  }}
                  disabled={!isChipAllowed || isSpinning || isFreeSpins}
                  className={`w-6 h-6 sm:w-6.5 sm:h-6.5 border text-[7.5px] sm:text-[8px] font-black font-mono flex items-center justify-center shadow-md transition-all ${
                    isSelected
                      ? 'bg-gradient-to-tr from-yellow-300 to-amber-500 text-amber-950 border-white ring-2 ring-yellow-400 scale-110 shadow-[0_0_10px_#F59E0B]'
                      : isChipAllowed
                      ? 'bg-slate-800 text-yellow-300 border-yellow-500/60 hover:scale-105'
                      : 'bg-black/40 text-slate-600 border-white/5 opacity-40 cursor-not-allowed'
                  }`}
                  style={{
                    clipPath:
                      'polygon(4px 0, calc(100% - 4px) 0, 100% 4px, 100% calc(100% - 4px), calc(100% - 4px) 100%, 4px 100%, 0 calc(100% - 4px), 0 4px)',
                  }}
                  title={`Bet $${step} per line`}
                >
                  ${step}
                </button>
              );
            })}
          </div>

          {/* Total Bet Wager Display */}
          <div
            className="flex flex-col items-center px-1.5 py-0.5 sm:py-1 bg-black border border-amber-500/60 shadow-inner min-w-[55px] sm:min-w-[65px]"
            style={{
              clipPath:
                'polygon(4px 0, calc(100% - 4px) 0, 100% 4px, 100% calc(100% - 4px), calc(100% - 4px) 100%, 4px 100%, 0 calc(100% - 4px), 0 4px)',
            }}
          >
            <span className="text-[6.5px] font-black uppercase text-amber-400 tracking-wider">TOTAL BET</span>
            <span className="text-xs sm:text-sm font-black text-amber-300 font-mono drop-shadow-[0_0_8px_#F59E0B]">
              ${totalBet.toLocaleString()}
            </span>
          </div>

          {/* Gold Ingot MAX BET */}
          <button
            onClick={() => {
              soundManager.playChipClick();
              onMaxBet();
            }}
            disabled={isSpinning || isFreeSpins || totalBet >= maxAllowedBet}
            className="px-2 sm:px-2.5 h-8 sm:h-8.5 md:h-9 font-black text-[8px] sm:text-[8.5px] uppercase tracking-wider disabled:opacity-40 flex items-center justify-center flex-shrink-0 shadow-md vlt-maxbet-btn text-amber-950"
            style={{
              clipPath:
                'polygon(6px 0, calc(100% - 6px) 0, 100% 6px, 100% calc(100% - 6px), calc(100% - 6px) 100%, 6px 100%, 0 calc(100% - 6px), 0 6px)',
            }}
          >
            MAX BET
          </button>
        </div>

        {/* Right Wing: Win Readout, Gamble, Auto */}
        <div className="flex items-center space-x-1 sm:space-x-1.5 pr-1.5 sm:pr-2.5">
          <RollingWinDisplay targetAmount={winAmount} isFreeSpins={isFreeSpins} activeGameId={activeGameId} />

          {onOpenGamble && (
            <button
              onClick={() => {
                if (winAmount > 0 && !isSpinning && !isFreeSpins) {
                  soundManager.playButtonClick();
                  onOpenGamble();
                }
              }}
              disabled={winAmount <= 0 || isSpinning || isFreeSpins}
              className={`flex items-center justify-center space-x-1 px-1.5 sm:px-2 h-8 sm:h-8.5 md:h-9 font-black text-[8px] sm:text-[8.5px] uppercase transition-all duration-200 flex-shrink-0 ${
                winAmount > 0 && !isSpinning && !isFreeSpins
                  ? 'vlt-gamble-btn text-white animate-pulse cursor-pointer shadow-[0_0_15px_rgba(244,63,94,0.7)]'
                  : 'bg-casino-950/40 border border-white/5 text-slate-600 opacity-40 cursor-not-allowed'
              }`}
              style={{
                clipPath:
                  'polygon(6px 0, calc(100% - 6px) 0, 100% 6px, 100% calc(100% - 6px), calc(100% - 6px) 100%, 6px 100%, 0 calc(100% - 6px), 0 6px)',
              }}
            >
              <Dices className={`w-3 h-3 ${winAmount > 0 ? 'text-yellow-300' : 'text-slate-600'}`} />
              <span>2X GAMBLE</span>
            </button>
          )}

          <div className="relative">
            {isAutoSpinning ? (
              <button
                onClick={onAutoSpinStop}
                className="flex items-center justify-center space-x-1 px-2 h-8 sm:h-8.5 md:h-9 bg-rose-600/30 border border-rose-500 text-rose-300 font-bold text-[10px] sm:text-xs uppercase animate-pulse shadow-[0_0_12px_#F43F5E]"
                style={{
                  clipPath:
                    'polygon(6px 0, calc(100% - 6px) 0, 100% 6px, 100% calc(100% - 6px), calc(100% - 6px) 100%, 6px 100%, 0 calc(100% - 6px), 0 6px)',
                }}
              >
                <StopCircle className="w-3.5 h-3.5" />
                <span>Stop ({autoSpinsRemaining})</span>
              </button>
            ) : (
              <button
                onClick={() => {
                  soundManager.playButtonClick();
                  setShowAutoMenu(!showAutoMenu);
                }}
                disabled={isSpinning || isFreeSpins}
                className="flex items-center justify-center space-x-1 px-2 h-8 sm:h-8.5 md:h-9 vlt-btn-stepper text-slate-300 font-bold text-[10px] sm:text-xs uppercase tracking-wider disabled:opacity-40"
                style={{
                  clipPath:
                    'polygon(6px 0, calc(100% - 6px) 0, 100% 6px, 100% calc(100% - 6px), calc(100% - 6px) 100%, 6px 100%, 0 calc(100% - 6px), 0 6px)',
                }}
              >
                <RefreshCw className="w-3 h-3 text-emerald-400" />
                <span>Auto</span>
              </button>
            )}

            {showAutoMenu && !isAutoSpinning && (
              <div
                className="absolute bottom-full mb-2 right-0 bg-casino-900 border border-white/20 p-2 shadow-2xl flex flex-col space-y-1.5 z-40 min-w-[130px]"
                style={{
                  clipPath:
                    'polygon(6px 0, calc(100% - 6px) 0, 100% 6px, 100% calc(100% - 6px), calc(100% - 6px) 100%, 6px 100%, 0 calc(100% - 6px), 0 6px)',
                }}
              >
                <div className="text-[10px] text-slate-400 font-bold uppercase text-center py-0.5">Select Auto Spins</div>
                {[10, 25, 50, 100].map((count) => (
                  <button
                    key={count}
                    onClick={() => {
                      soundManager.playButtonClick();
                      setShowAutoMenu(false);
                      onAutoSpinStart(count);
                    }}
                    className="px-3 py-1.5 bg-casino-800 hover:bg-gold-metallic hover:text-white text-xs font-bold text-slate-200 text-center transition-colors"
                  >
                    {count} Spins
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Gold Bullion Bar Push Actuator */}
      <div className="w-full h-8 sm:h-9 md:h-10 flex items-center justify-center">
        <button
          onClick={handleTriggerSpin}
          disabled={!isSpinning && !isFreeSpins && balance < totalBet}
          className={`w-72 sm:w-88 md:w-96 h-8 sm:h-9 md:h-9.5 font-black tracking-widest text-xs sm:text-sm md:text-base uppercase select-none transition-all touch-manipulation shadow-xl active:scale-95 flex items-center justify-center ${
            isSpinning
              ? 'vlt-stop-btn animate-pulse cursor-pointer'
              : !isFreeSpins && balance < totalBet
              ? 'bg-slate-800 opacity-40 cursor-not-allowed text-slate-500 border border-white/5'
              : isFreeSpins
              ? 'vlt-spin-btn animate-pulse'
              : 'vlt-spin-btn'
          }`}
          style={{
            clipPath:
              'polygon(12px 0, calc(100% - 12px) 0, 100% 12px, 100% calc(100% - 12px), calc(100% - 12px) 100%, 12px 100%, 0 calc(100% - 12px), 0 12px)',
          }}
        >
          {isSpinning ? (
            <span className="flex items-center space-x-2 text-white">
              <StopCircle className="w-5 h-5 fill-white text-rose-700" />
              <span>EMERGENCY STOP</span>
            </span>
          ) : isFreeSpins ? (
            <span className="flex items-center space-x-2 font-mono">
              <Flame className="w-5 h-5 text-yellow-300 fill-yellow-300 animate-pulse" />
              <span>VAULT FREE SPINS (3X)</span>
            </span>
          ) : !isFreeSpins && balance < totalBet ? (
            <span className="flex items-center space-x-2 text-amber-300 font-mono">
              <span>⚡ INSUFFICIENT GOLD ⚡</span>
            </span>
          ) : (
            <span className="flex items-center space-x-2 font-mono">
              <span>👑 VAULT UNLOCK / SPIN 👑</span>
            </span>
          )}
        </button>
      </div>
    </div>
  );

  // =========================================================================
  // --- VERSION D: PLAYSTATION 2 EMOTION ENGINE DUALSHOCK 2 CONTROLS DECK ---
  // =========================================================================
  const renderPs2DesktopControls = () => (
    <div className="hidden sm:flex flex-col space-y-1 sm:space-y-1.5 w-full font-mono">
      {/* Matte Obsidian Ribbed DualShock 2 Console Frame */}
      <div
        className="relative bg-gradient-to-r from-[#03060c] via-[#080d1a] to-[#03060c] border-2 border-[#006FCD] p-1 sm:p-1.5 shadow-[0_10px_25px_rgba(0,0,0,0.95),0_0_20px_rgba(0,111,205,0.45)] flex items-center justify-between gap-1.5 sm:gap-2"
        style={{
          clipPath:
            'polygon(10px 0, calc(100% - 10px) 0, 100% 10px, 100% calc(100% - 10px), calc(100% - 10px) 100%, 10px 100%, 0 calc(100% - 10px), 0 10px)',
        }}
      >
        {/* Left Wing: DualShock D-Pad & Analog Bet Stepper */}
        <div className="flex items-center space-x-1 sm:space-x-1.5 pl-1.5 sm:pl-2.5">
          {/* DualShock Red LED Analog / Turbo Mode Toggle */}
          <button
            onClick={() => {
              soundManager.playButtonClick();
              onTurboToggle();
            }}
            disabled={isSpinning}
            title={isTurbo ? 'Analog Turbo Mode Active' : 'Digital Mode (Normal)'}
            className={`flex flex-col items-center justify-center w-8 h-8 sm:w-9 sm:h-9 border transition-all ${
              isTurbo
                ? 'bg-gradient-to-b from-[#1a080c] to-[#2a0c14] border-rose-500 shadow-[0_0_15px_rgba(244,63,94,0.6)]'
                : 'bg-[#080a14] border-slate-700 hover:border-[#006FCD]'
            }`}
            style={{
              clipPath:
                'polygon(4px 0, calc(100% - 4px) 0, 100% 4px, 100% calc(100% - 4px), calc(100% - 4px) 100%, 4px 100%, 0 calc(100% - 4px), 0 4px)',
            }}
          >
            <span className="text-[6.5px] font-black tracking-tighter text-slate-400 uppercase">ANALOG</span>
            <div
              className={`w-2 h-2 rounded-full mt-0.5 border ${
                isTurbo
                  ? 'bg-rose-500 border-white shadow-[0_0_8px_#f43f5e] animate-pulse'
                  : 'bg-rose-950 border-rose-900/60'
              }`}
            />
          </button>

          {/* D-Pad Payline Selector */}
          <div
            className="flex flex-col items-center bg-[#050811] px-1.5 py-0.5 sm:py-1 border border-[#006FCD]/60 shadow-inner"
            style={{
              clipPath:
                'polygon(6px 0, calc(100% - 6px) 0, 100% 6px, 100% calc(100% - 6px), calc(100% - 6px) 100%, 6px 100%, 0 calc(100% - 6px), 0 6px)',
            }}
          >
            <span className="text-[7px] font-black uppercase text-[#00F0FF] tracking-wider">LINES</span>
            <div className="flex items-center space-x-0.5 sm:space-x-1 mt-0.5">
              <button
                onClick={() => handleLinesStep('down')}
                disabled={isSpinning || isFreeSpins || selectedLines <= 1}
                className="w-5 h-5 sm:w-5.5 sm:h-5.5 bg-[#0a1224] border border-[#006FCD]/40 disabled:opacity-30 flex items-center justify-center text-cyan-300 font-bold active:scale-95 hover:bg-[#006FCD]/30"
              >
                <Minus className="w-2.5 h-2.5 text-cyan-300" />
              </button>
              <span className="text-xs sm:text-sm font-black text-[#00F0FF] min-w-[22px] sm:min-w-[26px] text-center font-mono drop-shadow-[0_0_6px_#00F0FF]">
                {selectedLines}
              </span>
              <button
                onClick={() => handleLinesStep('up')}
                disabled={isSpinning || isFreeSpins || selectedLines >= maxLines}
                className="w-5 h-5 sm:w-5.5 sm:h-5.5 bg-[#0a1224] border border-[#006FCD]/40 disabled:opacity-30 flex items-center justify-center text-cyan-300 font-bold active:scale-95 hover:bg-[#006FCD]/30"
              >
                <Plus className="w-2.5 h-2.5 text-cyan-300" />
              </button>
            </div>
          </div>

          {/* DualShock Stepped Bet Values */}
          <div
            className="flex items-center space-x-1 px-1 sm:px-1.5 py-0.5 sm:py-1 bg-black/90 border border-[#006FCD]/60 shadow-inner"
            style={{
              clipPath:
                'polygon(6px 0, calc(100% - 6px) 0, 100% 6px, 100% calc(100% - 6px), calc(100% - 6px) 100%, 6px 100%, 0 calc(100% - 6px), 0 6px)',
            }}
          >
            {effectiveBetSteps.slice(0, 6).map((step) => {
              const isSelected = betPerLine === step;
              const isChipAllowed = step <= effectiveMaxBetPerLine && step * selectedLines <= maxAllowedBet;
              return (
                <button
                  key={step}
                  onClick={() => {
                    if (isChipAllowed && !isSpinning && !isFreeSpins) {
                      soundManager.playChipClick();
                      onBetPerLineChange(step);
                    }
                  }}
                  disabled={!isChipAllowed || isSpinning || isFreeSpins}
                  className={`w-6 h-6 sm:w-6.5 sm:h-6.5 border text-[7.5px] sm:text-[8px] font-black font-mono flex items-center justify-center shadow-md transition-all ${
                    isSelected
                      ? 'bg-gradient-to-tr from-[#004B93] to-[#00F0FF] text-white border-white ring-2 ring-[#006FCD] scale-110 shadow-[0_0_10px_#006FCD]'
                      : isChipAllowed
                      ? 'bg-[#060c18] text-cyan-300 border-[#006FCD]/60 hover:scale-105'
                      : 'bg-black/40 text-slate-600 border-white/5 opacity-40 cursor-not-allowed'
                  }`}
                  style={{
                    clipPath:
                      'polygon(4px 0, calc(100% - 4px) 0, 100% 4px, 100% calc(100% - 4px), calc(100% - 4px) 100%, 4px 100%, 0 calc(100% - 4px), 0 4px)',
                  }}
                  title={`Bet $${step} per line`}
                >
                  ${step}
                </button>
              );
            })}
          </div>

          {/* Total Wager Display */}
          <div
            className="flex flex-col items-center px-1.5 py-0.5 sm:py-1 bg-black border border-[#006FCD]/80 shadow-inner min-w-[55px] sm:min-w-[65px]"
            style={{
              clipPath:
                'polygon(4px 0, calc(100% - 4px) 0, 100% 4px, 100% calc(100% - 4px), calc(100% - 4px) 100%, 4px 100%, 0 calc(100% - 4px), 0 4px)',
            }}
          >
            <span className="text-[6.5px] font-black uppercase text-cyan-400 tracking-wider">TOTAL WAGER</span>
            <span className="text-xs sm:text-sm font-black text-cyan-200 font-mono drop-shadow-[0_0_8px_#00F0FF]">
              ${totalBet.toLocaleString()}
            </span>
          </div>

          {/* R2 MAX Wager Trigger */}
          <button
            onClick={() => {
              soundManager.playChipClick();
              onMaxBet();
            }}
            disabled={isSpinning || isFreeSpins || totalBet >= maxAllowedBet}
            className="px-2 sm:px-2.5 h-8 sm:h-8.5 md:h-9 font-black text-[8px] sm:text-[8.5px] uppercase tracking-wider disabled:opacity-40 flex items-center justify-center flex-shrink-0 shadow-md bg-gradient-to-b from-[#003366] to-[#001933] border-2 border-[#006FCD] hover:border-[#00F0FF] text-cyan-200 active:scale-95"
            style={{
              clipPath:
                'polygon(6px 0, calc(100% - 6px) 0, 100% 6px, 100% calc(100% - 6px), calc(100% - 6px) 100%, 6px 100%, 0 calc(100% - 6px), 0 6px)',
            }}
          >
            R2 MAX
          </button>
        </div>

        {/* Right Wing: Win Readout, Gamble, Auto */}
        <div className="flex items-center space-x-1 sm:space-x-1.5 pr-1.5 sm:pr-2.5">
          <RollingWinDisplay targetAmount={winAmount} isFreeSpins={isFreeSpins} activeGameId={activeGameId} />

          {onOpenGamble && (
            <button
              onClick={() => {
                if (winAmount > 0 && !isSpinning && !isFreeSpins) {
                  soundManager.playButtonClick();
                  onOpenGamble();
                }
              }}
              disabled={winAmount <= 0 || isSpinning || isFreeSpins}
              className={`flex items-center justify-center space-x-1 px-1.5 sm:px-2 h-8 sm:h-8.5 md:h-9 font-black text-[8px] sm:text-[8.5px] uppercase transition-all duration-200 flex-shrink-0 ${
                winAmount > 0 && !isSpinning && !isFreeSpins
                  ? 'bg-gradient-to-r from-rose-700 to-rose-900 border border-rose-400 text-white animate-pulse cursor-pointer shadow-[0_0_15px_rgba(244,63,94,0.7)]'
                  : 'bg-[#03060c] border border-white/5 text-slate-600 opacity-40 cursor-not-allowed'
              }`}
              style={{
                clipPath:
                  'polygon(6px 0, calc(100% - 6px) 0, 100% 6px, 100% calc(100% - 6px), calc(100% - 6px) 100%, 6px 100%, 0 calc(100% - 6px), 0 6px)',
              }}
            >
              <span className="text-[#24B059] text-[9px]">△</span>
              <span>2X GAMBLE</span>
              <span className="text-[#E61A22] text-[9px]">○</span>
            </button>
          )}

          {/* DualShock Pill SELECT / START Auto Spins */}
          <div className="relative">
            {isAutoSpinning ? (
              <button
                onClick={onAutoSpinStop}
                className="flex items-center justify-center space-x-1 px-2 h-8 sm:h-8.5 md:h-9 bg-rose-900/60 border border-rose-500 text-rose-200 font-bold text-[10px] sm:text-xs uppercase animate-pulse shadow-[0_0_12px_#F43F5E]"
                style={{
                  clipPath:
                    'polygon(6px 0, calc(100% - 6px) 0, 100% 6px, 100% calc(100% - 6px), calc(100% - 6px) 100%, 6px 100%, 0 calc(100% - 6px), 0 6px)',
                }}
              >
                <StopCircle className="w-3.5 h-3.5" />
                <span>Stop ({autoSpinsRemaining})</span>
              </button>
            ) : (
              <button
                onClick={() => {
                  soundManager.playButtonClick();
                  setShowAutoMenu(!showAutoMenu);
                }}
                disabled={isSpinning || isFreeSpins}
                className="flex items-center justify-center space-x-1 px-2 h-8 sm:h-8.5 md:h-9 bg-[#080d1a] border border-[#006FCD] hover:border-[#00F0FF] text-cyan-300 font-bold text-[10px] sm:text-xs uppercase tracking-wider disabled:opacity-40"
                style={{
                  clipPath:
                    'polygon(6px 0, calc(100% - 6px) 0, 100% 6px, 100% calc(100% - 6px), calc(100% - 6px) 100%, 6px 100%, 0 calc(100% - 6px), 0 6px)',
                }}
              >
                <RefreshCw className="w-3 h-3 text-[#00F0FF]" />
                <span>SELECT</span>
              </button>
            )}

            {showAutoMenu && !isAutoSpinning && (
              <div
                className="absolute bottom-full mb-2 right-0 bg-[#050811] border-2 border-[#006FCD] p-2 shadow-2xl flex flex-col space-y-1.5 z-40 min-w-[130px]"
                style={{
                  clipPath:
                    'polygon(6px 0, calc(100% - 6px) 0, 100% 6px, 100% calc(100% - 6px), calc(100% - 6px) 100%, 6px 100%, 0 calc(100% - 6px), 0 6px)',
                }}
              >
                <div className="text-[10px] text-cyan-400 font-bold uppercase text-center py-0.5">AUTO CYCLE</div>
                {[10, 25, 50, 100].map((count) => (
                  <button
                    key={count}
                    onClick={() => {
                      soundManager.playButtonClick();
                      setShowAutoMenu(false);
                      onAutoSpinStart(count);
                    }}
                    className="px-3 py-1.5 bg-[#0a1224] hover:bg-[#006FCD] hover:text-white text-xs font-bold text-cyan-200 text-center transition-colors"
                  >
                    {count} Cycles
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Giant DualShock 2 Face Button Actuator */}
      <div className="w-full h-8 sm:h-9 md:h-10 flex items-center justify-center">
        <button
          onClick={handleTriggerSpin}
          disabled={!isSpinning && !isFreeSpins && balance < totalBet}
          className={`w-72 sm:w-88 md:w-96 h-8 sm:h-9 md:h-9.5 font-black tracking-widest text-xs sm:text-sm md:text-base uppercase select-none transition-all touch-manipulation shadow-xl active:scale-95 flex items-center justify-center ${
            isSpinning
              ? 'bg-gradient-to-r from-rose-900 via-rose-700 to-rose-900 border-2 border-rose-400 animate-pulse cursor-pointer shadow-[0_0_20px_rgba(244,63,94,0.7)]'
              : !isFreeSpins && balance < totalBet
              ? 'bg-[#080d1a] opacity-40 cursor-not-allowed text-slate-500 border border-white/5'
              : isFreeSpins
              ? 'bg-gradient-to-r from-[#003366] via-[#006FCD] to-[#003366] border-2 border-[#00F0FF] animate-pulse text-white shadow-[0_0_25px_rgba(0,111,205,0.8)]'
              : 'bg-gradient-to-r from-[#001933] via-[#004B93] to-[#001933] border-2 border-[#006FCD] hover:border-[#00F0FF] text-white shadow-[0_0_20px_rgba(0,111,205,0.6)]'
          }`}
          style={{
            clipPath:
              'polygon(12px 0, calc(100% - 12px) 0, 100% 12px, 100% calc(100% - 12px), calc(100% - 12px) 100%, 12px 100%, 0 calc(100% - 12px), 0 12px)',
          }}
        >
          {isSpinning ? (
            <span className="flex items-center space-x-2 text-white">
              <StopCircle className="w-5 h-5 fill-white text-rose-700" />
              <span>[ ✕ QUICK STOP ]</span>
            </span>
          ) : isFreeSpins ? (
            <span className="flex items-center space-x-2 font-mono text-cyan-200">
              <Zap className="w-5 h-5 text-[#00F0FF] fill-[#00F0FF] animate-pulse" />
              <span>⚡ EMOTION ENGINE OVERCLOCK ⚡</span>
            </span>
          ) : !isFreeSpins && balance < totalBet ? (
            <span className="flex items-center space-x-2 text-rose-400 font-mono text-[10px] sm:text-xs">
              <span>⚠ INSUFFICIENT CREDITS ⚠</span>
            </span>
          ) : (
            <span className="flex items-center space-x-2 font-mono">
              <span className="text-[#24B059] text-sm">△</span>
              <span className="text-[#DF508E] text-sm">□</span>
              <span className="text-[#00F0FF] font-black tracking-widest px-1">EMOTION ENGINE SPIN</span>
              <span className="text-[#006FCD] text-sm font-black">✕</span>
              <span className="text-[#E61A22] text-sm">○</span>
            </span>
          )}
        </button>
      </div>
    </div>
  );

  return (
    <div className="relative w-full max-w-5xl xl:max-w-6xl 2xl:max-w-7xl mx-auto px-1 sm:px-3 py-0.5 sm:py-1 select-none flex flex-col space-y-0.5 sm:space-y-1 flex-shrink-0">
      {/* ========================================================================= */}
      {/* --- MOBILE COMPACT CONTROLS DECK (< 640px) --- */}
      {/* ========================================================================= */}
      <div className="sm:hidden flex flex-col space-y-1 w-full">
        <div
          className={`flex items-center justify-between px-2 py-1 border shadow-md h-9 ${
            isPs2
              ? 'bg-[#050811]/95 border-[#006FCD] text-cyan-200 font-mono shadow-[0_0_12px_rgba(0,111,205,0.4)]'
              : isTimber
              ? 'bg-[#121c15]/95 border-emerald-600/70 text-emerald-200'
              : isPixel
              ? 'bg-black border-2 border-pink-500 text-cyan-200 font-mono'
              : 'bg-casino-900/95 border border-yellow-400/70 text-slate-200 font-mono'
          }`}
          style={{
            clipPath: isPixel
              ? 'polygon(0 4px, 4px 0, calc(100% - 4px) 0, 100% 4px, 100% calc(100% - 4px), calc(100% - 4px) 100%, 4px 100%, 0 calc(100% - 4px))'
              : isTimber
              ? 'polygon(0% 12%, 2% 0%, 98% 0%, 100% 12%, 98% 50%, 100% 88%, 98% 100%, 2% 100%, 0% 88%, 2% 50%)'
              : 'polygon(6px 0, calc(100% - 6px) 0, 100% 6px, 100% calc(100% - 6px), calc(100% - 6px) 100%, 6px 100%, 0 calc(100% - 6px), 0 6px)',
          }}
        >
          {/* Lines Stepper */}
          <div className="flex items-center space-x-0.5">
            <span className="text-[7.5px] font-bold uppercase text-slate-400">L:</span>
            <button
              onClick={() => handleLinesStep('down')}
              disabled={isSpinning || isFreeSpins || selectedLines <= 1}
              className="w-5 h-5 vlt-btn-stepper disabled:opacity-30 flex items-center justify-center text-slate-200"
              style={{
                clipPath: isPixel ? 'polygon(0 2px, 2px 0, calc(100% - 2px) 0, 100% 2px, 100% 100%, 0 100%)' : undefined,
              }}
            >
              <Minus className="w-2.5 h-2.5 text-cyan-300" />
            </button>
            <span className={`text-[11px] font-black font-mono min-w-[16px] text-center ${
              isPs2 ? 'text-[#00F0FF]' : isTimber ? 'text-emerald-300' : isPixel ? 'text-pink-300' : 'text-neon-cyan'
            }`}>
              {selectedLines}
            </span>
            <button
              onClick={() => handleLinesStep('up')}
              disabled={isSpinning || isFreeSpins || selectedLines >= maxLines}
              className="w-5 h-5 vlt-btn-stepper disabled:opacity-30 flex items-center justify-center text-slate-200"
              style={{
                clipPath: isPixel ? 'polygon(0 2px, 2px 0, calc(100% - 2px) 0, 100% 2px, 100% 100%, 0 100%)' : undefined,
              }}
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
              className="w-5 h-5 vlt-btn-stepper disabled:opacity-30 flex items-center justify-center text-slate-200"
              style={{
                clipPath: isPixel ? 'polygon(0 2px, 2px 0, calc(100% - 2px) 0, 100% 2px, 100% 100%, 0 100%)' : undefined,
              }}
            >
              <Minus className="w-2.5 h-2.5 text-amber-300" />
            </button>
            <span className="text-[11px] font-black font-mono min-w-[18px] text-center text-white">
              {betPerLine}
            </span>
            <button
              onClick={() => handleBetStep('up')}
              disabled={isSpinning || isFreeSpins || betPerLine >= effectiveMaxBetPerLine || (betPerLine * selectedLines) >= maxAllowedBet}
              className="w-5 h-5 vlt-btn-stepper disabled:opacity-30 flex items-center justify-center text-slate-200"
              style={{
                clipPath: isPixel ? 'polygon(0 2px, 2px 0, calc(100% - 2px) 0, 100% 2px, 100% 100%, 0 100%)' : undefined,
              }}
            >
              <Plus className="w-2.5 h-2.5 text-amber-300" />
            </button>
          </div>

          {/* Win readout */}
          <div className="flex items-center space-x-1 pl-1 border-l border-white/10">
            <span className="text-[7.5px] font-bold uppercase text-slate-400">W:</span>
            <span className="text-[11px] font-black font-mono text-yellow-300">
              {winAmount.toLocaleString()}
            </span>
          </div>

          {/* Gamble 2X */}
          {onOpenGamble && (
            <button
              onClick={() => {
                if (winAmount > 0 && !isSpinning && !isFreeSpins) {
                  soundManager.playButtonClick();
                  onOpenGamble();
                }
              }}
              disabled={winAmount <= 0 || isSpinning || isFreeSpins}
              className={`px-1.5 h-6 text-[8px] font-black uppercase ${
                winAmount > 0 && !isSpinning && !isFreeSpins
                  ? 'bg-rose-600 text-white animate-pulse'
                  : 'bg-black/40 text-slate-600 opacity-40'
              }`}
              style={{
                clipPath: isPixel ? 'polygon(0 2px, 2px 0, calc(100% - 2px) 0, 100% 2px, 100% 100%, 0 100%)' : undefined,
              }}
            >
              2X
            </button>
          )}
        </div>

        {/* Mobile Row 2: Turbo, Spin, Max */}
        <div className="flex items-center space-x-1.5 w-full">
          <button
            onClick={() => {
              soundManager.playButtonClick();
              onTurboToggle();
            }}
            disabled={isSpinning}
            className={`w-9 h-9 border flex items-center justify-center flex-shrink-0 ${
              isPs2
                ? isTurbo
                  ? 'bg-rose-600 text-white border-rose-300 shadow-[0_0_10px_#f43f5e]'
                  : 'bg-[#080d1a] text-cyan-400 border-[#006FCD]'
                : isTurbo
                ? 'bg-amber-600 text-white border-amber-300'
                : 'vlt-btn-stepper text-slate-400'
            }`}
            style={{
              clipPath: isPixel
                ? 'polygon(0 3px, 3px 0, calc(100% - 3px) 0, 100% 3px, 100% calc(100% - 3px), calc(100% - 3px) 100%, 3px 100%, 0 calc(100% - 3px))'
                : isTimber
                ? 'polygon(4px 0, calc(100% - 4px) 0, 100% 4px, 100% calc(100% - 4px), calc(100% - 4px) 100%, 4px 100%, 0 calc(100% - 4px), 0 4px)'
                : 'polygon(4px 0, calc(100% - 4px) 0, 100% 4px, 100% calc(100% - 4px), calc(100% - 4px) 100%, 4px 100%, 0 calc(100% - 4px), 0 4px)',
            }}
          >
            <Zap className="w-4 h-4" />
          </button>

          <button
            onClick={handleTriggerSpin}
            disabled={!isSpinning && !isFreeSpins && balance < totalBet}
            className={`flex-1 h-9 flex items-center justify-center font-black text-xs uppercase text-white shadow-lg ${
              isSpinning
                ? 'bg-rose-700 animate-pulse'
                : isFreeSpins
                ? 'bg-gradient-to-r from-purple-600 to-pink-600 animate-pulse'
                : isPs2
                ? 'bg-gradient-to-r from-[#001933] via-[#004B93] to-[#001933] border border-[#00F0FF] text-cyan-200 font-mono shadow-[0_0_12px_rgba(0,111,205,0.6)]'
                : isPixel
                ? 'bg-gradient-to-r from-pink-600 via-purple-600 to-cyan-500 border border-pink-300'
                : isTimber
                ? 'bg-gradient-to-r from-emerald-600 to-green-700 border border-emerald-300 font-serif'
                : 'vlt-spin-btn'
            }`}
            style={{
              clipPath: isPixel
                ? 'polygon(0 4px, 4px 0, calc(100% - 4px) 0, 100% 4px, 100% calc(100% - 4px), calc(100% - 4px) 100%, 4px 100%, 0 calc(100% - 4px))'
                : isTimber
                ? 'polygon(0% 12%, 2% 0%, 98% 0%, 100% 12%, 98% 50%, 100% 88%, 98% 100%, 2% 100%, 0% 88%, 2% 50%)'
                : 'polygon(8px 0, calc(100% - 8px) 0, 100% 8px, 100% calc(100% - 8px), calc(100% - 8px) 100%, 8px 100%, 0 calc(100% - 8px), 0 8px)',
            }}
          >
            {isSpinning ? 'STOP' : isFreeSpins ? 'OVERCLOCK' : isPs2 ? '✕ EMOTION ENGINE' : isPixel ? 'INSERT COIN' : isTimber ? 'WOODLAND SPIN' : 'SPIN'}
          </button>

          <button
            onClick={() => {
              soundManager.playChipClick();
              onMaxBet();
            }}
            disabled={isSpinning || isFreeSpins || totalBet >= maxAllowedBet}
            className="px-2 h-9 font-black text-[9px] uppercase tracking-wider vlt-maxbet-btn text-amber-950 flex-shrink-0"
            style={{
              clipPath: isPixel
                ? 'polygon(0 3px, 3px 0, calc(100% - 3px) 0, 100% 3px, 100% calc(100% - 3px), calc(100% - 3px) 100%, 3px 100%, 0 calc(100% - 3px))'
                : isTimber
                ? 'polygon(4px 0, calc(100% - 4px) 0, 100% 4px, 100% calc(100% - 4px), calc(100% - 4px) 100%, 4px 100%, 0 calc(100% - 4px), 0 4px)'
                : 'polygon(4px 0, calc(100% - 4px) 0, 100% 4px, 100% calc(100% - 4px), calc(100% - 4px) 100%, 4px 100%, 0 calc(100% - 4px), 0 4px)',
            }}
          >
            MAX
          </button>
        </div>
      </div>

      {/* ========================================================================= */}
      {/* --- DESKTOP 4 BESPOKE PHYSICAL CONSOLES (>= 640px) --- */}
      {/* ========================================================================= */}
      {isPixel
        ? renderPixelDesktopControls()
        : isTimber
        ? renderTimberDesktopControls()
        : isPs2
        ? renderPs2DesktopControls()
        : renderVaultDesktopControls()}
    </div>
  );
};
