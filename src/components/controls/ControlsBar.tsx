import React, { useState } from 'react';
import { Minus, Plus, Zap, RefreshCw, Flame, StopCircle, Dices } from 'lucide-react';
import { soundManager } from '../../audio/soundManager';
import { RollingWinDisplay } from './RollingWinDisplay';

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
    <div className="relative w-full max-w-4xl mx-auto px-1 sm:px-3 mt-2 select-none flex flex-col space-y-2">
      {/* TIER 1: Bet Adjusters & Win Displays */}
      <div className="bg-gradient-to-r from-casino-900 via-casino-850 to-casino-900 border border-white/10 rounded-2xl p-2 sm:p-3 shadow-xl flex flex-wrap items-center justify-between gap-2">
        {/* Left: Turbo, Lines, Bet/Line, Total, Max Bet */}
        <div className="flex items-center space-x-1.5 sm:space-x-2 flex-wrap">
          {/* Turbo Toggle */}
          <button
            onClick={() => {
              soundManager.playButtonClick();
              onTurboToggle();
            }}
            disabled={isSpinning}
            title={isTurbo ? 'Turbo Mode: FAST' : 'Turbo Mode: NORMAL'}
            className={`p-2 rounded-xl border transition-all ${
              isTurbo
                ? 'bg-gradient-to-b from-amber-500/30 to-amber-950/60 border-amber-400 text-amber-300 shadow-[0_0_15px_rgba(245,158,11,0.6)]'
                : 'vlt-btn-stepper text-slate-400 hover:text-white'
            }`}
          >
            <Zap className={`w-4 h-4 sm:w-4.5 sm:h-4.5 ${isTurbo ? 'fill-amber-400 animate-pulse text-amber-300' : ''}`} />
          </button>

          {/* Lines & Bet Display Box */}
          <div className="flex items-center space-x-1.5 sm:space-x-2 bg-gradient-to-b from-casino-950 to-casino-900 px-2 sm:px-2.5 py-1 rounded-xl border border-white/15 shadow-inner">
            {/* Active Lines selector with - / + buttons */}
            <div className="flex flex-col items-center pr-1.5 border-r border-white/10">
              <span className="text-[8px] sm:text-[9px] uppercase font-bold tracking-wider text-slate-400">
                Lines
              </span>
              <div className="flex items-center space-x-1 mt-0.5">
                <button
                  onClick={() => handleLinesStep('down')}
                  disabled={isSpinning || isFreeSpins || selectedLines <= 1}
                  className="w-5 h-5 rounded-md vlt-btn-stepper disabled:opacity-30 flex items-center justify-center text-slate-200 font-bold"
                >
                  <Minus className="w-3 h-3 text-cyan-300" />
                </button>
                <span className="text-xs sm:text-sm font-black text-neon-cyan min-w-[22px] text-center drop-shadow-[0_0_6px_rgba(0,240,255,0.7)]">
                  {selectedLines}
                </span>
                <button
                  onClick={() => handleLinesStep('up')}
                  disabled={isSpinning || isFreeSpins || selectedLines >= 40}
                  className="w-5 h-5 rounded-md vlt-btn-stepper disabled:opacity-30 flex items-center justify-center text-slate-200 font-bold"
                >
                  <Plus className="w-3 h-3 text-cyan-300" />
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
                  className="w-5 h-5 rounded-md vlt-btn-stepper disabled:opacity-30 flex items-center justify-center text-slate-200 font-bold"
                >
                  <Minus className="w-3 h-3 text-amber-300" />
                </button>
                <span className="text-xs sm:text-sm font-black text-white min-w-[28px] text-center">
                  {betPerLine.toLocaleString()}
                </span>
                <button
                  onClick={() => handleBetStep('up')}
                  disabled={isSpinning || isFreeSpins || (betPerLine * selectedLines) >= maxBet}
                  className="w-5 h-5 rounded-md vlt-btn-stepper disabled:opacity-30 flex items-center justify-center text-slate-200 font-bold"
                >
                  <Plus className="w-3 h-3 text-amber-300" />
                </button>
              </div>
            </div>

            {/* Total Bet Calculation */}
            <div className="flex flex-col items-center pl-1.5 border-l border-white/10 min-w-[60px] sm:min-w-[75px]">
              <span className="text-[8px] sm:text-[9px] uppercase font-bold tracking-wider text-gold-bright">
                Total Bet
              </span>
              <span className="text-xs sm:text-base font-black text-amber-300 drop-shadow-[0_0_8px_rgba(251,191,36,0.5)]">
                {totalBet.toLocaleString()}
              </span>
            </div>
          </div>

          {/* Themed Max Bet Button */}
          <button
            onClick={() => {
              soundManager.playButtonClick();
              onMaxBet();
            }}
            disabled={isSpinning || isFreeSpins || totalBet >= maxBet}
            className="px-2.5 sm:px-3 py-1.5 sm:py-2 rounded-xl vlt-maxbet-btn font-black text-[9px] sm:text-xs uppercase tracking-wider text-amber-950 disabled:opacity-40"
          >
            MAX BET
          </button>
        </div>

        {/* Right: Win Payout, Gamble 2X, and Auto-Spin */}
        <div className="flex items-center space-x-2">
          {/* Animated Rolling Win Display */}
          <RollingWinDisplay targetAmount={winAmount} isFreeSpins={isFreeSpins} />

          {/* Themed Oregon Lottery Video Poker Style Double-Up Gamble Button */}
          {winAmount > 0 && !isSpinning && !isFreeSpins && onOpenGamble && (
            <button
              onClick={() => {
                soundManager.playButtonClick();
                onOpenGamble();
              }}
              className="flex items-center space-x-1 px-2.5 py-1.5 rounded-xl vlt-gamble-btn text-white font-black text-[10px] uppercase animate-bounce-soft"
              title="Risk your win to double it in Oregon Lottery Video Poker"
            >
              <Dices className="w-3.5 h-3.5 text-yellow-300" />
              <span>GAMBLE 2X</span>
            </button>
          )}

          {/* Auto Spin Button & Popover */}
          <div className="relative">
            {isAutoSpinning ? (
              <button
                onClick={onAutoSpinStop}
                className="flex items-center space-x-1 px-2.5 py-1.5 rounded-xl bg-rose-600/30 border border-rose-500 text-rose-300 font-bold text-xs uppercase animate-pulse shadow-[0_0_12px_rgba(244,63,94,0.5)]"
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
                className="flex items-center space-x-1 px-2.5 py-1.5 rounded-xl vlt-btn-stepper text-slate-300 font-bold text-xs uppercase tracking-wider disabled:opacity-40"
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

      {/* TIER 2: Dedicated Centered Action Line for SPIN / STOP */}
      <div className="w-full flex items-center justify-center pt-1 pb-1">
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
          className={`relative w-64 sm:w-80 h-13 sm:h-15 flex items-center justify-center rounded-2xl font-black tracking-widest text-base sm:text-xl uppercase text-white select-none transition-all ${
            isSpinning
              ? 'vlt-stop-btn animate-pulse cursor-pointer'
              : !isFreeSpins && balance < totalBet
              ? 'bg-slate-800 opacity-40 cursor-not-allowed text-slate-500 border border-white/5'
              : isFreeSpins
              ? 'vlt-spin-btn animate-pulse'
              : 'vlt-spin-btn'
          }`}
        >
          {isSpinning ? (
            <span className="flex items-center space-x-2 text-white">
              <StopCircle className="w-6 h-6 fill-white text-rose-700" />
              <span>STOP</span>
            </span>
          ) : isAutoSpinning ? (
            <span className="flex items-center space-x-2">
              <StopCircle className="w-6 h-6" />
              <span>STOP</span>
            </span>
          ) : isFreeSpins ? (
            <span className="flex items-center space-x-2">
              <Flame className="w-6 h-6 text-yellow-300 fill-yellow-300 animate-bounce" />
              <span>FREE SPIN</span>
            </span>
          ) : (
            <span className="flex items-center space-x-2">
              <span>SPIN</span>
            </span>
          )}
        </button>
      </div>
    </div>
  );
};
