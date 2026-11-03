import React, { useState } from 'react';
import { soundManager } from '../../audio/soundManager';
import type { GameId } from '../../games/types';

interface SlotLeverProps {
  isSpinning: boolean;
  disabled: boolean;
  onPull: () => void;
  activeGameId?: GameId;
}

export const SlotLever: React.FC<SlotLeverProps> = ({
  isSpinning,
  disabled,
  onPull,
  activeGameId = 'vault-24k',
}) => {
  const isTimber = activeGameId === 'timber-critters';
  const isPixel = activeGameId === 'pixel-arcade';
  const isPs2 = activeGameId === 'ps2-legends';
  const [isPulled, setIsPulled] = useState(false);
  const [isCoinInserted, setIsCoinInserted] = useState(false);

  const handlePullLever = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (disabled || isSpinning || isPulled) return;

    if (isPs2) {
      soundManager.playPs2MemoryCardSave();
      setIsCoinInserted(true);
      setTimeout(() => setIsCoinInserted(false), 400);
    } else if (isPixel) {
      soundManager.playCoinTally();
      setIsCoinInserted(true);
      setTimeout(() => setIsCoinInserted(false), 400);
    } else {
      soundManager.playLeverPull();
    }

    setIsPulled(true);
    onPull();

    setTimeout(() => {
      setIsPulled(false);
    }, 600);
  };

  // =========================================================================
  // --- VERSION A: PIXEL ARCADE (AUTHENTIC 25¢ COIN DOOR & REJECT MECH) ---
  // =========================================================================
  if (isPixel) {
    return (
      <div
        onClick={handlePullLever}
        className={`hidden xl:flex flex-col items-center absolute -right-8 top-1/4 select-none cursor-pointer group z-20 font-mono transition-transform duration-150 ${
          disabled && !isSpinning ? 'opacity-40 cursor-not-allowed' : 'hover:scale-105 active:scale-95'
        }`}
        title={disabled ? 'Need more credits' : 'Click to insert 25¢ arcade token and play!'}
      >
        {/* Cast Iron Arcade Coin Door Unit */}
        <div className="w-12 py-3 px-1.5 rounded-lg bg-gradient-to-b from-[#1c1c24] via-[#0e0e14] to-[#050508] border-2 border-pink-500/80 shadow-[0_0_20px_rgba(236,72,153,0.5),inset_0_2px_4px_rgba(255,255,255,0.2)] flex flex-col items-center space-y-2 relative">
          {/* Header Label */}
          <div className="px-1 py-0.5 rounded bg-black border border-cyan-400 text-[6.5px] font-black text-cyan-300 tracking-tighter uppercase whitespace-nowrap shadow-[0_0_6px_#06B6D4]">
            TOKEN MECH
          </div>

          {/* Coin Entry Slot 1 */}
          <div className="flex flex-col items-center space-y-1">
            <div className="w-6 h-1.5 rounded-full bg-black border border-slate-600 shadow-inner flex items-center justify-center">
              <div className="w-4 h-0.5 bg-yellow-400/80 animate-pulse" />
            </div>
            {/* Illuminated 25¢ Push-To-Reject Button */}
            <div className={`w-8 h-6 rounded bg-gradient-to-b from-orange-500 to-amber-700 border-2 border-orange-300 shadow-[0_0_12px_#F97316] flex items-center justify-center transition-all ${
              isCoinInserted ? 'scale-90 brightness-150' : 'group-hover:brightness-125'
            }`}>
              <span className="text-[8.5px] font-black text-amber-950 font-mono drop-shadow">25¢</span>
            </div>
          </div>

          {/* Coin Entry Slot 2 */}
          <div className="flex flex-col items-center space-y-1 pt-1 border-t border-white/10">
            <div className="w-6 h-1.5 rounded-full bg-black border border-slate-600 shadow-inner flex items-center justify-center">
              <div className="w-4 h-0.5 bg-yellow-400/80 animate-pulse" />
            </div>
            <div className={`w-8 h-6 rounded bg-gradient-to-b from-orange-500 to-amber-700 border-2 border-orange-300 shadow-[0_0_12px_#F97316] flex items-center justify-center transition-all ${
              isCoinInserted ? 'scale-90 brightness-150' : 'group-hover:brightness-125'
            }`}>
              <span className="text-[8.5px] font-black text-amber-950 font-mono drop-shadow">25¢</span>
            </div>
          </div>

          {/* Lower Coin Return Pocket */}
          <div className="w-7 h-4 rounded bg-black border border-purple-500/50 shadow-inner flex items-center justify-center">
            <span className="text-[7px]">🪙</span>
          </div>

          {/* Interactive Insert Callout */}
          {!isSpinning && !disabled && (
            <div className="absolute -bottom-6 whitespace-nowrap px-1.5 py-0.5 rounded bg-pink-600 text-white font-black text-[7.5px] border border-pink-200 shadow-[0_0_8px_#EC4899] animate-bounce">
              INSERT COIN
            </div>
          )}
        </div>
      </div>
    );
  }

  // =========================================================================
  // --- VERSION D: PLAYSTATION 2 (8MB MEMORY CARD DOCK & DUALSHOCK R2 TRIGGER) ---
  // =========================================================================
  if (isPs2) {
    return (
      <div
        onClick={handlePullLever}
        className={`hidden xl:flex flex-col items-center absolute -right-8 top-1/4 select-none cursor-pointer group z-20 font-mono transition-transform duration-150 ${
          disabled && !isSpinning ? 'opacity-40 cursor-not-allowed' : 'hover:scale-105 active:scale-95'
        }`}
        title={disabled ? 'Need more credits' : 'Click to trigger 8MB Memory Card save & spin!'}
      >
        <div className="w-12 py-3 px-1.5 rounded-lg bg-gradient-to-b from-[#0a0f1d] via-[#040711] to-[#010308] border-2 border-[#006FCD] shadow-[0_0_20px_rgba(0,111,205,0.6),inset_0_2px_4px_rgba(255,255,255,0.2)] flex flex-col items-center space-y-2 relative">
          <div className="px-1 py-0.5 rounded bg-black border border-cyan-400 text-[6.5px] font-black text-cyan-300 tracking-tighter uppercase whitespace-nowrap shadow-[0_0_6px_#00F0FF]">
            SLOT 1
          </div>

          {/* 8MB Memory Card Silhouette */}
          <div className={`w-9 h-11 rounded-t-sm rounded-b-md bg-gradient-to-b from-[#182038] via-[#0b0e1a] to-[#02050e] border-2 border-[#006FCD] shadow-[0_0_10px_rgba(0,111,205,0.5)] flex flex-col items-center justify-between p-1 transition-all ${
            isCoinInserted ? 'scale-95 brightness-150' : 'group-hover:brightness-125'
          }`}>
            <span className="text-[6px] font-black text-slate-300">MagicGate</span>
            <span className="text-[9px]">💾</span>
            <span className="text-[7px] font-black text-cyan-300">8MB</span>
          </div>

          {/* R2 Analog Trigger Button */}
          <div className="flex flex-col items-center space-y-0.5">
            <div className={`w-8 h-5 rounded-md bg-gradient-to-b from-[#003d80] to-[#001f40] border border-cyan-400 shadow-[0_0_8px_#006FCD] flex items-center justify-center transition-all ${
              isCoinInserted ? 'scale-90 bg-cyan-600' : ''
            }`}>
              <span className="text-[8px] font-black text-white font-mono">R2</span>
            </div>
          </div>

          {!isSpinning && !disabled && (
            <div className="absolute -bottom-6 whitespace-nowrap px-1.5 py-0.5 rounded bg-[#006FCD] text-white font-black text-[7.5px] border border-cyan-300 shadow-[0_0_8px_#00F0FF] animate-bounce">
              SAVE & SPIN
            </div>
          )}
        </div>
      </div>
    );
  }

  // =========================================================================
  // --- VERSION B: TIMBERLAND CRITTERS & VERSION C: 24K VAULT (LEVER ARM) ---
  // =========================================================================
  return (
    <div
      onClick={handlePullLever}
      className={`hidden xl:flex items-center absolute -right-4 sm:-right-5 top-1/3 select-none cursor-pointer group z-20 ${
        disabled && !isSpinning ? 'opacity-40 cursor-not-allowed' : ''
      }`}
      title={disabled ? 'Insufficient coins' : isTimber ? 'Pull the Timberland Logging Lever!' : 'Pull the 24K Vegas Slot Lever!'}
    >
      {/* 1. Heavy Structural Chassis Mount Extension */}
      <div
        className={`w-6 sm:w-7 h-9 -mr-1.5 shadow-2xl flex items-center justify-between px-1 border-y-2 border-r-2 rounded-r-md relative z-10 ${
          isTimber
            ? 'bg-gradient-to-r from-[#2a1306] via-[#3d1c0a] to-[#1c0c04] border-[#78350f]'
            : 'bg-gradient-to-r from-amber-900 via-slate-800 to-black border-yellow-500/80'
        }`}
      >
        {/* Hex Mounting Bolts */}
        <div className="flex flex-col justify-between h-full py-1">
          <div className={`w-2 h-2 rounded-full border shadow-sm ${isTimber ? 'bg-[#5c2b09] border-[#a16207]' : 'bg-yellow-400 border-yellow-100'}`} />
          <div className={`w-2 h-2 rounded-full border shadow-sm ${isTimber ? 'bg-[#5c2b09] border-[#a16207]' : 'bg-yellow-400 border-yellow-100'}`} />
        </div>
        <div className={`w-1 h-6 rounded-full ${isTimber ? 'bg-[#78350f]' : 'bg-yellow-500/50'}`} />
      </div>

      {/* 2. Mechanical Pivot Knuckle Assembly */}
      <div className="relative -ml-3 z-20 flex flex-col items-center">
        <div
          className={`w-11 h-11 rounded-full border-2 shadow-2xl flex items-center justify-center ${
            isTimber
              ? 'bg-gradient-to-tr from-[#1c0c04] via-[#3d1c0a] to-[#5c2b09] border-[#a16207]'
              : 'bg-gradient-to-tr from-slate-950 via-slate-800 to-amber-700 border-yellow-400'
          }`}
        >
          <div
            className={`w-5 h-5 rounded-full border shadow-inner ${
              isTimber
                ? 'bg-gradient-to-tr from-[#78350f] to-[#b45309] border-[#d97706]'
                : 'bg-gradient-to-tr from-yellow-300 to-amber-500 border-white/80'
            }`}
          />
        </div>

        {/* 3. The 3D Lever Shaft & Themed Grip Ball */}
        <div
          className={`relative flex flex-col items-center origin-bottom transition-all duration-300 ${
            isPulled
              ? 'transform rotate-[75deg] scale-y-75 translate-y-12 translate-x-3'
              : isSpinning
              ? 'transform rotate-[10deg]'
              : 'group-hover:rotate-[6deg]'
          }`}
          style={{
            transitionTimingFunction: isPulled ? 'cubic-bezier(0.4, 0, 0.2, 1)' : 'cubic-bezier(0.175, 0.885, 0.32, 1.275)',
          }}
        >
          {/* Grip Knob */}
          <div
            className={`w-11 h-11 rounded-full shadow-2xl border-2 transition-all flex items-center justify-center relative overflow-hidden ${
              isTimber
                ? isSpinning
                  ? 'bg-gradient-to-tr from-amber-700 via-emerald-600 to-amber-400 border-amber-300 animate-pulse shadow-[0_0_20px_rgba(52,211,153,0.8)]'
                  : 'bg-gradient-to-tr from-[#3b1d0c] via-[#5c2b09] to-[#854d0e] border-amber-400 shadow-[0_0_15px_rgba(180,83,9,0.7)] group-hover:scale-110'
                : isSpinning
                ? 'bg-gradient-to-tr from-amber-500 via-yellow-300 to-amber-200 border-yellow-100 animate-pulse shadow-[0_0_25px_rgba(253,224,71,0.9)]'
                : 'bg-gradient-to-tr from-rose-800 via-red-600 to-amber-400 border-yellow-200 shadow-[0_0_20px_rgba(239,68,68,0.8)] group-hover:scale-110'
            }`}
          >
            <div className="absolute top-1 left-2 w-3.5 h-3.5 rounded-full bg-white/70 filter blur-[0.5px]" />
            <span className="text-sm select-none">{isTimber ? '🌰' : '👑'}</span>
          </div>

          {/* Heavy Lever Shaft */}
          <div
            className={`w-4 h-32 border-x shadow-xl rounded-t-sm ${
              isTimber
                ? 'bg-gradient-to-r from-[#1c0c04] via-[#451e0a] to-[#1c0c04] border-[#78350f]'
                : 'bg-gradient-to-r from-slate-400 via-slate-100 to-slate-400 border-slate-300'
            }`}
          />
        </div>

        {/* Flashing "PULL" Indicator */}
        {!isSpinning && !disabled && (
          <div
            className={`mt-2 -ml-1 px-2 py-0.5 rounded-md border text-white font-black text-[9px] tracking-widest uppercase shadow-lg animate-pulse ${
              isTimber
                ? 'bg-gradient-to-r from-emerald-600 to-green-700 border-emerald-300 shadow-[0_0_12px_rgba(16,185,129,0.7)]'
                : 'bg-gradient-to-r from-red-600 to-rose-700 border-red-300 shadow-[0_0_12px_rgba(239,68,68,0.7)]'
            }`}
          >
            PULL
          </div>
        )}
      </div>
    </div>
  );
};
