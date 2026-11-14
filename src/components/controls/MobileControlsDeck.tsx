import React, { useState } from 'react';
import { Minus, Plus, Zap, RefreshCw } from 'lucide-react';
import { soundManager } from '../../audio/soundManager';
import type { GameId } from '../../games/types';

interface MobileControlsDeckProps {
  activeGameId: GameId;
  selectedLines: number;
  betPerLine: number;
  totalBet: number;
  winAmount: number;
  balance: number;
  isSpinning: boolean;
  isTurbo: boolean;
  isFreeSpins: boolean;
  autoSpinsRemaining: number;
  canStepLinesDown: boolean;
  canStepLinesUp: boolean;
  canStepBetDown: boolean;
  canStepBetUp: boolean;
  canMaxBet: boolean;
  onLinesStep: (direction: 'up' | 'down') => void;
  onBetStep: (direction: 'up' | 'down') => void;
  onTriggerSpin: () => void;
  onTurboToggle: () => void;
  onMaxBet: () => void;
  onAutoSpinStart: (count: number) => void;
  onAutoSpinStop: () => void;
  onOpenGamble?: () => void;
}

const AUTO_COUNTS = [10, 25, 50, 100];

const octagon = (r: number) =>
  `polygon(${r}px 0, calc(100% - ${r}px) 0, 100% ${r}px, 100% calc(100% - ${r}px), calc(100% - ${r}px) 100%, ${r}px 100%, 0 calc(100% - ${r}px), 0 ${r}px)`;

const LABEL_CLS = 'text-[9px] leading-none font-bold uppercase tracking-wide text-slate-400';

interface StepperProps {
  label: string;
  value: number;
  onDown: () => void;
  onUp: () => void;
  disableDown: boolean;
  disableUp: boolean;
  tone: string;
  accent: string;
  locked: boolean;
}

const Stepper: React.FC<StepperProps> = ({ label, value, onDown, onUp, disableDown, disableUp, tone, accent, locked }) => (
  <div className="flex flex-col items-center gap-1 min-w-0">
    <span className={LABEL_CLS}>{label}</span>
    <div className="flex items-center gap-0.5">
      <button
        type="button"
        aria-label={`Decrease ${label}`}
        onClick={onDown}
        disabled={locked || disableDown}
        className="w-7 h-8 vlt-btn-stepper disabled:opacity-30 flex items-center justify-center touch-manipulation active:scale-90"
      >
        <Minus className={`w-3.5 h-3.5 ${tone}`} />
      </button>
      <span className={`text-[14px] leading-none font-black min-w-[24px] text-center tabular-nums ${accent}`}>{value}</span>
      <button
        type="button"
        aria-label={`Increase ${label}`}
        onClick={onUp}
        disabled={locked || disableUp}
        className="w-7 h-8 vlt-btn-stepper disabled:opacity-30 flex items-center justify-center touch-manipulation active:scale-90"
      >
        <Plus className={`w-3.5 h-3.5 ${tone}`} />
      </button>
    </div>
  </div>
);

/**
 * Touch-first control deck for phones and landscape handsets.
 * Buttons are at least 32px tall and the values use 13px+ type, replacing the
 * old 20px steppers with 7.5px labels.
 */
export const MobileControlsDeck: React.FC<MobileControlsDeckProps> = ({
  activeGameId,
  selectedLines,
  betPerLine,
  totalBet,
  winAmount,
  isSpinning,
  isTurbo,
  isFreeSpins,
  balance,
  autoSpinsRemaining,
  canStepLinesDown,
  canStepLinesUp,
  canStepBetDown,
  canStepBetUp,
  canMaxBet,
  onLinesStep,
  onBetStep,
  onTriggerSpin,
  onTurboToggle,
  onMaxBet,
  onAutoSpinStart,
  onAutoSpinStop,
  onOpenGamble,
}) => {
  const [showAutoMenu, setShowAutoMenu] = useState(false);
  const isTimber = activeGameId === 'timber-critters';
  const isPixel = activeGameId === 'pixel-arcade';
  const isPs2 = activeGameId === 'ps2-legends';
  const isAuto = autoSpinsRemaining > 0;
  const locked = isSpinning || isFreeSpins;
  const cannotAfford = !isSpinning && !isFreeSpins && balance < totalBet;

  const clip = isPixel ? octagon(4) : isTimber ? octagon(5) : octagon(6);

  const barClass = isPs2
    ? 'bg-[#050811]/95 border-[#006FCD] text-cyan-200 font-mono shadow-[0_0_12px_rgba(0,111,205,0.4)]'
    : isTimber
    ? 'bg-[#121c15]/95 border-emerald-600/70 text-emerald-200 font-serif'
    : isPixel
    ? 'bg-black border-2 border-pink-500 text-cyan-200 font-mono'
    : 'bg-casino-900/95 border border-yellow-400/70 text-slate-200 font-mono';

  const accent = isPs2 ? 'text-[#00F0FF]' : isTimber ? 'text-emerald-300' : isPixel ? 'text-pink-300' : 'text-neon-cyan';
  const labelCls = LABEL_CLS;

  const spinClass = isSpinning
    ? 'bg-rose-700 animate-pulse text-white'
    : isAuto
    ? 'bg-rose-700 text-white'
    : isFreeSpins
    ? 'bg-gradient-to-r from-purple-600 to-pink-600 animate-pulse text-white'
    : cannotAfford
    ? 'bg-slate-800 text-slate-500 opacity-60'
    : isPs2
    ? 'bg-gradient-to-r from-[#001933] via-[#004B93] to-[#001933] border border-[#00F0FF] text-cyan-200 shadow-[0_0_12px_rgba(0,111,205,0.6)]'
    : isPixel
    ? 'bg-gradient-to-r from-pink-600 via-purple-600 to-cyan-500 border border-pink-300 text-white'
    : isTimber
    ? 'bg-gradient-to-r from-emerald-600 to-green-700 border border-emerald-300 text-white'
    : 'vlt-spin-btn text-white';

  const spinLabel = isSpinning
    ? 'STOP'
    : isAuto
    ? `STOP AUTO (${autoSpinsRemaining})`
    : isFreeSpins
    ? 'OVERCLOCK'
    : isPs2
    ? '✕ EMOTION ENGINE'
    : isPixel
    ? 'INSERT COIN'
    : isTimber
    ? 'WOODLAND SPIN'
    : 'SPIN';

  return (
    <div className="flex sm:hidden short:flex flex-col gap-1 w-full">
      {/* Bet readout bar */}
      <div className={`flex items-center justify-between gap-1 px-1.5 py-1 border shadow-md ${barClass}`} style={{ clipPath: clip }}>
        <Stepper
          label="Lines"
          value={selectedLines}
          onDown={() => onLinesStep('down')}
          onUp={() => onLinesStep('up')}
          disableDown={!canStepLinesDown}
          disableUp={!canStepLinesUp}
          tone="text-cyan-300"
          accent={accent}
          locked={locked}
        />
        <div className="w-px self-stretch bg-white/10" />
        <Stepper
          label="Bet/Line"
          value={betPerLine}
          onDown={() => onBetStep('down')}
          onUp={() => onBetStep('up')}
          disableDown={!canStepBetDown}
          disableUp={!canStepBetUp}
          tone="text-amber-300"
          accent={accent}
          locked={locked}
        />
        <div className="w-px self-stretch bg-white/10" />
        <div className="flex flex-col items-center gap-1 min-w-[52px]">
          <span className={labelCls}>Total</span>
          <span className="text-[14px] leading-none font-black text-white tabular-nums">{totalBet.toLocaleString()}</span>
        </div>
        <div className="w-px self-stretch bg-white/10" />
        {onOpenGamble && winAmount > 0 && !isSpinning && !isFreeSpins ? (
          <button
            type="button"
            onClick={() => {
              soundManager.playButtonClick();
              onOpenGamble();
            }}
            className="flex flex-col items-center gap-1 min-w-[52px] touch-manipulation"
            aria-label="Double or nothing gamble"
          >
            <span className="text-[9px] leading-none font-black uppercase text-rose-300 animate-pulse">Gamble 2X</span>
            <span className="text-[14px] leading-none font-black text-yellow-300 tabular-nums">{winAmount.toLocaleString()}</span>
          </button>
        ) : (
          <div className="flex flex-col items-center gap-1 min-w-[52px]">
            <span className={labelCls}>Win</span>
            <span className="text-[14px] leading-none font-black text-yellow-300 tabular-nums">{winAmount.toLocaleString()}</span>
          </div>
        )}
      </div>

      {/* Action row: turbo, auto, spin, max */}
      <div className="relative flex items-stretch gap-1.5 w-full">
        <button
          type="button"
          aria-label="Toggle turbo"
          aria-pressed={isTurbo}
          onClick={() => {
            soundManager.playButtonClick();
            onTurboToggle();
          }}
          disabled={isSpinning}
          className={`w-11 h-11 border flex flex-col items-center justify-center flex-shrink-0 touch-manipulation active:scale-95 ${
            isTurbo ? 'bg-amber-600 text-white border-amber-300' : 'vlt-btn-stepper text-slate-300'
          }`}
          style={{ clipPath: octagon(4) }}
        >
          <Zap className="w-4 h-4" />
          <span className="text-[8px] font-black leading-none mt-0.5">TURBO</span>
        </button>

        <button
          type="button"
          aria-label="Auto spin"
          onClick={() => {
            soundManager.playButtonClick();
            if (isAuto) onAutoSpinStop();
            else setShowAutoMenu((v) => !v);
          }}
          disabled={(isSpinning && !isAuto) || isFreeSpins}
          className={`w-11 h-11 border flex flex-col items-center justify-center flex-shrink-0 touch-manipulation active:scale-95 disabled:opacity-40 ${
            isAuto
              ? 'bg-rose-600 border-rose-300 text-white animate-pulse'
              : 'bg-gradient-to-b from-purple-700 to-indigo-900 border-purple-400 text-purple-100'
          }`}
          style={{ clipPath: octagon(4) }}
        >
          <RefreshCw className="w-4 h-4" />
          <span className="text-[8px] font-black leading-none mt-0.5">{isAuto ? 'STOP' : 'AUTO'}</span>
        </button>

        <button
          type="button"
          onClick={onTriggerSpin}
          disabled={cannotAfford}
          className={`flex-1 min-w-0 h-11 flex items-center justify-center font-black text-sm tracking-wide uppercase shadow-lg touch-manipulation active:scale-[0.98] ${spinClass}`}
          style={{ clipPath: octagon(8) }}
        >
          <span className="truncate px-1">{spinLabel}</span>
        </button>

        <button
          type="button"
          aria-label="Max bet"
          onClick={() => {
            soundManager.playChipClick();
            onMaxBet();
          }}
          disabled={locked || !canMaxBet}
          className="w-12 h-11 font-black text-[11px] uppercase tracking-wider vlt-maxbet-btn text-amber-950 flex-shrink-0 touch-manipulation active:scale-95 disabled:opacity-40"
          style={{ clipPath: octagon(4) }}
        >
          MAX
        </button>

        {showAutoMenu && !isAuto && (
          <>
            <div className="fixed inset-0 z-40" onClick={() => setShowAutoMenu(false)} />
            <div className="absolute bottom-full mb-2 left-0 z-50 w-full max-w-[260px] bg-black/95 border-2 border-purple-400 rounded-xl p-2 shadow-2xl">
              <div className="text-[10px] text-purple-200 font-black uppercase text-center mb-1.5">Auto spins</div>
              <div className="grid grid-cols-4 gap-1.5">
                {AUTO_COUNTS.map((count) => (
                  <button
                    key={count}
                    type="button"
                    onClick={() => {
                      soundManager.playButtonClick();
                      setShowAutoMenu(false);
                      onAutoSpinStart(count);
                    }}
                    className="h-10 rounded-lg bg-purple-950 hover:bg-purple-700 border border-purple-500/60 text-sm font-black text-cyan-100 touch-manipulation active:scale-95"
                  >
                    {count}
                  </button>
                ))}
              </div>
              <div className="mt-1.5 text-[9px] text-slate-400 text-center leading-tight">
                Auto stops when a bonus triggers or you can&apos;t cover the bet.
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
};
