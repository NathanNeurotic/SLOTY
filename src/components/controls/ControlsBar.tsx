import React, { useState } from 'react';
import { Minus, Plus, Zap, RefreshCw, Flame, StopCircle } from 'lucide-react';
import { soundManager } from '../../audio/soundManager';

interface ControlsBarProps {
  balance: number;
  currentBet: number;
  maxBet: number;
  winAmount: number;
  isSpinning: boolean;
  isTurbo: boolean;
  autoSpinsRemaining: number;
  freeSpinsRemaining: number;
  onSpin: () => void;
  onQuickStop?: () => void;
  onBetChange: (newBet: number) => void;
  onTurboToggle: () => void;
  onAutoSpinStart: (count: number) => void;
  onAutoSpinStop: () => void;
}

const BET_STEPS = [20, 40, 60, 100, 200, 400, 800, 1500, 3000, 6000, 12000, 25000, 50000];

export const ControlsBar: React.FC<ControlsBarProps> = ({
  balance,
  currentBet,
  maxBet,
  winAmount,
  isSpinning,
  isTurbo,
  autoSpinsRemaining,
  freeSpinsRemaining,
  onSpin,
  onQuickStop,
  onBetChange,
  onTurboToggle,
  onAutoSpinStart,
  onAutoSpinStop,
}) => {
  const [showAutoMenu, setShowAutoMenu] = useState(false);

  const handleBetStep = (direction: 'up' | 'down') => {
    soundManager.playButtonClick();
    const availableSteps = BET_STEPS.filter((step) => step <= maxBet);
    let currentIndex = availableSteps.indexOf(currentBet);
    if (currentIndex === -1) {
      // Find nearest
      currentIndex = availableSteps.findIndex((step) => step >= currentBet);
      if (currentIndex === -1) currentIndex = availableSteps.length - 1;
    }

    if (direction === 'up' && currentIndex < availableSteps.length - 1) {
      onBetChange(availableSteps[currentIndex + 1]);
    } else if (direction === 'down' && currentIndex > 0) {
      onBetChange(availableSteps[currentIndex - 1]);
    }
  };

  const handleMaxBet = () => {
    soundManager.playButtonClick();
    const availableSteps = BET_STEPS.filter((step) => step <= maxBet);
    const maxAvailable = availableSteps[availableSteps.length - 1] || maxBet;
    onBetChange(maxAvailable);
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
    <div className="relative w-full max-w-4xl mx-auto px-2 sm:px-4 mt-3 select-none">
      <div className="bg-gradient-to-r from-casino-900 via-casino-850 to-casino-900 border border-white/10 rounded-2xl p-3 sm:p-4 shadow-xl flex flex-col md:flex-row items-center justify-between gap-3">
        {/* Left Side: Bet Adjuster */}
        <div className="flex items-center justify-between w-full md:w-auto space-x-2 sm:space-x-3">
          {/* Turbo Toggle */}
          <button
            onClick={() => {
              soundManager.playButtonClick();
              onTurboToggle();
            }}
            disabled={isSpinning}
            title={isTurbo ? 'Turbo mode ON' : 'Turbo mode OFF'}
            className={`p-2.5 rounded-xl border transition-all ${
              isTurbo
                ? 'bg-amber-500/20 border-amber-400 text-amber-300 shadow-[0_0_12px_rgba(245,158,11,0.5)]'
                : 'bg-casino-800 border-white/10 text-slate-400 hover:text-white'
            }`}
          >
            <Zap className={`w-5 h-5 ${isTurbo ? 'fill-amber-400 animate-pulse' : ''}`} />
          </button>

          {/* Bet Display Box */}
          <div className="flex flex-col items-center bg-casino-950 px-3 py-1.5 rounded-xl border border-white/10 min-w-[130px] sm:min-w-[150px]">
            <span className="text-[10px] uppercase font-bold tracking-wider text-slate-400">
              Total Bet (20 Lines)
            </span>
            <div className="flex items-center space-x-2 mt-0.5">
              <button
                onClick={() => handleBetStep('down')}
                disabled={isSpinning || isFreeSpins || currentBet <= 20}
                className="w-7 h-7 rounded-lg bg-casino-800 hover:bg-casino-700 disabled:opacity-40 flex items-center justify-center text-slate-200"
              >
                <Minus className="w-4 h-4" />
              </button>
              <span className="text-base sm:text-lg font-black text-amber-300 min-w-[60px] text-center">
                {currentBet.toLocaleString()}
              </span>
              <button
                onClick={() => handleBetStep('up')}
                disabled={isSpinning || isFreeSpins || currentBet >= maxBet}
                className="w-7 h-7 rounded-lg bg-casino-800 hover:bg-casino-700 disabled:opacity-40 flex items-center justify-center text-slate-200"
              >
                <Plus className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Max Bet Button */}
          <button
            onClick={handleMaxBet}
            disabled={isSpinning || isFreeSpins || currentBet >= maxBet}
            className="px-3 py-2.5 rounded-xl bg-casino-800 hover:bg-casino-700 border border-white/10 font-bold text-xs uppercase tracking-wider text-amber-400 disabled:opacity-40 transition-colors"
          >
            Max Bet
          </button>
        </div>

        {/* Center: Latest Win Display */}
        <div className="flex flex-col items-center justify-center bg-casino-950/80 px-4 py-2 rounded-xl border border-gold-bright/30 min-w-[160px] sm:min-w-[200px] shadow-inner">
          <span className="text-[10px] uppercase font-extrabold tracking-widest text-gold-bright">
            {isFreeSpins ? 'FREE SPIN WIN' : 'WIN PAYOUT'}
          </span>
          <span
            className={`text-xl sm:text-2xl font-black ${
              winAmount > 0
                ? 'text-gold-light animate-pulse filter drop-shadow-[0_0_8px_rgba(251,191,36,0.8)]'
                : 'text-slate-500'
            }`}
          >
            {winAmount > 0 ? `+${winAmount.toLocaleString()}` : '0'}
          </span>
        </div>

        {/* Right Side: Auto-Spin & Main Spin Trigger */}
        <div className="flex items-center space-x-2 sm:space-x-3 w-full md:w-auto justify-end">
          {/* Auto Spin Button & Popover */}
          <div className="relative">
            {isAutoSpinning ? (
              <button
                onClick={onAutoSpinStop}
                className="flex items-center space-x-1.5 px-3 py-2.5 rounded-xl bg-rose-600/30 border border-rose-500 text-rose-300 font-bold text-xs uppercase animate-pulse"
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
                className="flex items-center space-x-1 px-3 py-2.5 rounded-xl bg-casino-800 hover:bg-casino-700 border border-white/10 text-slate-300 font-bold text-xs uppercase tracking-wider disabled:opacity-40"
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
            disabled={!isSpinning && !isFreeSpins && balance < currentBet}
            title={
              isSpinning
                ? 'Quick Stop (Space / Click)'
                : !isFreeSpins && balance < currentBet
                ? 'Insufficient coins'
                : undefined
            }
            className={`relative flex items-center justify-center px-7 sm:px-9 py-3 sm:py-3.5 rounded-2xl font-black tracking-widest text-base sm:text-lg uppercase text-white transition-all transform select-none ${
              isSpinning
                ? 'bg-gradient-to-r from-red-600 via-rose-600 to-amber-600 shadow-[0_0_25px_rgba(239,68,68,0.8)] animate-pulse hover:scale-[1.03] active:scale-95 cursor-pointer'
                : !isFreeSpins && balance < currentBet
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
