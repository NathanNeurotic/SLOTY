import React, { useState } from 'react';
import { Minus, Plus, Zap, RefreshCw, Flame, StopCircle, Dices } from 'lucide-react';
import { soundManager } from '../../audio/soundManager';

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
}

const AVAILABLE_LINES = [1, 5, 10, 20, 30, 40];
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
}) => {
  const [showAutoMenu, setShowAutoMenu] = useState(false);

  const handleLinesStep = (direction: 'up' | 'down') => {
    soundManager.playButtonClick();
    const curIdx = AVAILABLE_LINES.indexOf(selectedLines);
    if (direction === 'up' && curIdx < AVAILABLE_LINES.length - 1) {
      onLinesChange(AVAILABLE_LINES[curIdx + 1]);
    } else if (direction === 'down' && curIdx > 0) {
      onLinesChange(AVAILABLE_LINES[curIdx - 1]);
    }
  };

  const handleBetStep = (direction: 'up' | 'down') => {
    soundManager.playButtonClick();
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
    <div className="relative w-full max-w-4xl mx-auto px-1 sm:px-3 mt-2 select-none">
      <div className="bg-gradient-to-r from-casino-900 via-casino-850 to-casino-900 border border-white/10 rounded-2xl p-2.5 sm:p-3.5 shadow-xl flex flex-col md:flex-row items-center justify-between gap-2.5">
        {/* Left Side: Lines & Bet Adjuster */}
        <div className="flex items-center justify-between w-full md:w-auto space-x-1.5 sm:space-x-2">
          {/* Turbo Toggle */}
          <button
            onClick={() => {
              soundManager.playButtonClick();
              onTurboToggle();
            }}
            disabled={isSpinning}
            title={isTurbo ? 'Turbo mode ON' : 'Turbo mode OFF'}
            className={`p-2 sm:p-2.5 rounded-xl border transition-all ${
              isTurbo
                ? 'bg-amber-500/20 border-amber-400 text-amber-300 shadow-[0_0_12px_rgba(245,158,11,0.5)]'
                : 'bg-casino-800 border-white/10 text-slate-400 hover:text-white'
            }`}
          >
            <Zap className={`w-4 h-4 sm:w-5 sm:h-5 ${isTurbo ? 'fill-amber-400 animate-pulse' : ''}`} />
          </button>

          {/* Lines & Bet Display Box (Oregon Lottery VLT Style) */}
          <div className="flex items-center space-x-1.5 sm:space-x-2 bg-casino-950 px-2 sm:px-3 py-1.5 rounded-xl border border-white/10">
            {/* Active Lines selector with - / + buttons */}
            <div className="flex flex-col items-center pr-1.5 border-r border-white/10">
              <span className="text-[8px] sm:text-[9px] uppercase font-bold tracking-wider text-slate-400">
                Lines
              </span>
              <div className="flex items-center space-x-1 mt-0.5">
                <button
                  onClick={() => handleLinesStep('down')}
                  disabled={isSpinning || isFreeSpins || selectedLines <= 1}
                  className="w-5 h-5 rounded bg-casino-800 hover:bg-casino-700 disabled:opacity-30 flex items-center justify-center text-slate-200"
                >
                  <Minus className="w-3 h-3" />
                </button>
                <span className="text-xs sm:text-sm font-black text-neon-cyan min-w-[22px] text-center">
                  {selectedLines}
                </span>
                <button
                  onClick={() => handleLinesStep('up')}
                  disabled={isSpinning || isFreeSpins || selectedLines >= 40}
                  className="w-5 h-5 rounded bg-casino-800 hover:bg-casino-700 disabled:opacity-30 flex items-center justify-center text-slate-200"
                >
                  <Plus className="w-3 h-3" />
                </button>
              </div>
            </div>

            {/* Bet Per Line with - / + buttons */}
            <div className="flex flex-col items-center px-1">
              <span className="text-[8px] sm:text-[9px] uppercase font-bold tracking-wider text-slate-400">
                Bet/Line
              </span>
              <div className="flex items-center space-x-1 mt-0.5">
                <button
                  onClick={() => handleBetStep('down')}
                  disabled={isSpinning || isFreeSpins || betPerLine <= 1}
                  className="w-5 h-5 rounded bg-casino-800 hover:bg-casino-700 disabled:opacity-30 flex items-center justify-center text-slate-200"
                >
                  <Minus className="w-3 h-3" />
                </button>
                <span className="text-xs sm:text-sm font-black text-white min-w-[32px] text-center">
                  {betPerLine.toLocaleString()}
                </span>
                <button
                  onClick={() => handleBetStep('up')}
                  disabled={isSpinning || isFreeSpins || (betPerLine * selectedLines) >= maxBet}
                  className="w-5 h-5 rounded bg-casino-800 hover:bg-casino-700 disabled:opacity-30 flex items-center justify-center text-slate-200"
                >
                  <Plus className="w-3 h-3" />
                </button>
              </div>
            </div>

            {/* Total Bet Calculation */}
            <div className="flex flex-col items-center pl-1.5 border-l border-white/10 min-w-[65px] sm:min-w-[80px]">
              <span className="text-[8px] sm:text-[9px] uppercase font-bold tracking-wider text-gold-bright">
                Total Bet
              </span>
              <span className="text-xs sm:text-base font-black text-amber-300">
                {totalBet.toLocaleString()}
              </span>
            </div>
          </div>

          {/* Max Bet Button */}
          <button
            onClick={() => {
              soundManager.playButtonClick();
              onMaxBet();
            }}
            disabled={isSpinning || isFreeSpins || totalBet >= maxBet}
            className="px-2.5 sm:px-3 py-2 sm:py-2.5 rounded-xl bg-casino-800 hover:bg-casino-700 border border-white/10 font-bold text-[10px] sm:text-xs uppercase tracking-wider text-amber-400 disabled:opacity-40 transition-colors"
          >
            Max Bet
          </button>
        </div>

        {/* Center: Latest Win Display & Oregon Lottery Gamble Double-Up Button */}
        <div className="flex items-center space-x-2">
          <div className="flex flex-col items-center justify-center bg-casino-950/80 px-3 sm:px-4 py-1.5 sm:py-2 rounded-xl border border-gold-bright/30 min-w-[130px] sm:min-w-[160px] shadow-inner">
            <span className="text-[9px] sm:text-[10px] uppercase font-extrabold tracking-widest text-gold-bright">
              {isFreeSpins ? 'FREE SPIN WIN' : 'WIN PAYOUT'}
            </span>
            <span
              className={`text-lg sm:text-xl font-black ${
                winAmount > 0
                  ? 'text-gold-light animate-pulse filter drop-shadow-[0_0_8px_rgba(251,191,36,0.8)]'
                  : 'text-slate-500'
              }`}
            >
              {winAmount > 0 ? `+${winAmount.toLocaleString()}` : '0'}
            </span>
          </div>

          {/* Oregon Lottery Video Poker Style Double-Up Gamble Button */}
          {winAmount > 0 && !isSpinning && !isFreeSpins && onOpenGamble && (
            <button
              onClick={() => {
                soundManager.playButtonClick();
                onOpenGamble();
              }}
              className="flex flex-col items-center justify-center px-2.5 py-1.5 rounded-xl bg-gradient-to-r from-red-600 to-rose-700 border border-yellow-300 text-white font-black text-[10px] uppercase shadow-[0_0_12px_rgba(239,68,68,0.7)] animate-bounce-soft hover:scale-105 active:scale-95"
            >
              <Dices className="w-4 h-4 text-yellow-300 mb-0.5" />
              <span>GAMBLE 2X</span>
            </button>
          )}
        </div>

        {/* Right Side: Auto-Spin & Main Spin Trigger */}
        <div className="flex items-center space-x-2 sm:space-x-2.5 w-full md:w-auto justify-end">
          {/* Auto Spin Button & Popover */}
          <div className="relative">
            {isAutoSpinning ? (
              <button
                onClick={onAutoSpinStop}
                className="flex items-center space-x-1 px-2.5 sm:px-3 py-2 sm:py-2.5 rounded-xl bg-rose-600/30 border border-rose-500 text-rose-300 font-bold text-xs uppercase animate-pulse"
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
                className="flex items-center space-x-1 px-2.5 sm:px-3 py-2 sm:py-2.5 rounded-xl bg-casino-800 hover:bg-casino-700 border border-white/10 text-slate-300 font-bold text-xs uppercase tracking-wider disabled:opacity-40"
              >
                <RefreshCw className="w-4 h-4" />
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

          {/* The Big Glowing Spin / Quick Stop Button */}
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
            className={`relative flex items-center justify-center px-6 sm:px-8 py-2.5 sm:py-3.5 rounded-2xl font-black tracking-widest text-sm sm:text-base uppercase text-white transition-all transform select-none ${
              isSpinning
                ? 'bg-gradient-to-r from-red-600 via-rose-600 to-amber-600 shadow-[0_0_25px_rgba(239,68,68,0.8)] animate-pulse hover:scale-[1.03] active:scale-95 cursor-pointer'
                : !isFreeSpins && balance < totalBet
                ? 'bg-slate-800 opacity-50 cursor-not-allowed text-slate-500'
                : isFreeSpins
                ? 'bg-gradient-to-r from-amber-500 to-red-600 shadow-[0_0_25px_rgba(239,68,68,0.7)] animate-pulse'
                : 'spin-btn-active hover:scale-[1.03] active:scale-95'
            }`}
          >
            {isSpinning ? (
              <span className="flex items-center space-x-1.5 text-white">
                <StopCircle className="w-5 h-5 fill-white text-rose-600" />
                <span>STOP</span>
              </span>
            ) : isAutoSpinning ? (
              <span className="flex items-center space-x-1.5">
                <StopCircle className="w-5 h-5" />
                <span>STOP</span>
              </span>
            ) : isFreeSpins ? (
              <span className="flex items-center space-x-1.5">
                <Flame className="w-5 h-5 text-yellow-300 fill-yellow-300 animate-bounce" />
                <span>FREE SPIN</span>
              </span>
            ) : (
              <span>SPIN</span>
            )}
          </button>
        </div>
      </div>
    </div>
  );
};
