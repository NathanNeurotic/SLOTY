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
  // --- VERSION D: PLAYSTATION 2 (DUALSHOCK 2 CONTROLLER SPIN ACTUATOR) ---
  // =========================================================================
  if (isPs2) {
    return (
      <div
        onClick={handlePullLever}
        className={`hidden xl:flex flex-col items-center absolute -right-12 xl:-right-14 2xl:-right-16 top-1/4 select-none cursor-pointer group z-20 font-mono transition-transform duration-150 ${
          disabled && !isSpinning ? 'opacity-40 cursor-not-allowed' : 'hover:scale-105 active:scale-95'
        }`}
        title={disabled ? 'Need more credits' : 'Press DualShock 2 controller to spin!'}
      >
        {/* Sculpted DualShock 2 Hardware Dock Station */}
        <div className="w-24 sm:w-28 py-2.5 px-2 rounded-2xl bg-gradient-to-b from-[#0a1428] via-[#040814] to-[#010206] border-2 border-[#006FCD] shadow-[0_0_25px_rgba(0,111,205,0.7),inset_0_2px_4px_rgba(255,255,255,0.2)] flex flex-col items-center space-y-2">
          {/* Header Title Badge */}
          <div className="px-2 py-0.5 rounded bg-black/90 border border-cyan-400 text-[8px] font-black text-cyan-300 tracking-wider uppercase whitespace-nowrap shadow-[0_0_8px_#00F0FF]">
            DUALSHOCK 2
          </div>

          {/* High-Resolution DualShock 2 Controller Vector */}
          <div className="w-full flex items-center justify-center py-0.5">
            <svg
              viewBox="0 0 100 80"
              className={`w-20 sm:w-24 h-16 sm:h-18 drop-shadow-[0_4px_12px_rgba(0,111,205,0.9)] transition-transform duration-150 ${
                isCoinInserted ? 'scale-90 brightness-150' : 'group-hover:scale-105'
              }`}
            >
              <defs>
                <linearGradient id="ds2LeverBody" x1="0%" y1="0%" x2="0%" y2="100%">
                  <stop offset="0%" stopColor="#223052" />
                  <stop offset="40%" stopColor="#10172A" />
                  <stop offset="100%" stopColor="#03050C" />
                </linearGradient>
              </defs>

              {/* L1 & R1 Shoulder Bumpers */}
              <rect x="18" y="5" width="16" height="7" rx="2" fill="#182238" stroke="#006FCD" strokeWidth="0.9" />
              <rect x="66" y="5" width="16" height="7" rx="2" fill="#182238" stroke="#006FCD" strokeWidth="0.9" />

              {/* Controller Cable Bushing at Top Center */}
              <rect x="46" y="6" width="8" height="5" rx="1" fill="#0A0F1E" stroke="#334155" strokeWidth="0.6" />

              {/* DualShock 2 Ergonomic Main Body Silhouette */}
              <path
                d="M 22 11
                   C 32 11, 38 15, 50 16
                   C 62 15, 68 11, 78 11
                   C 88 11, 96 19, 94 44
                   C 93 60, 88 76, 80 78
                   C 72 80, 66 66, 62 54
                   C 58 48, 54 46, 50 46
                   C 46 46, 42 48, 38 54
                   C 34 66, 28 80, 20 78
                   C 12 76, 7 60, 6 44
                   C 4 19, 12 11, 22 11 Z"
                fill="url(#ds2LeverBody)"
                stroke="#006FCD"
                strokeWidth="1.4"
                strokeLinejoin="round"
              />

              {/* Grip Edge 3D Highlight Highlights */}
              <path d="M 8 42 C 7 58, 12 72, 19 75" fill="none" stroke="#38BDF8" strokeWidth="1" opacity="0.6" />
              <path d="M 92 42 C 93 58, 88 72, 81 75" fill="none" stroke="#38BDF8" strokeWidth="1" opacity="0.6" />

              {/* D-Pad (Left Grip) */}
              <g transform="translate(26, 32)">
                <rect x="-10" y="-3.5" width="20" height="7" rx="1.5" fill="#04060E" stroke="#334155" strokeWidth="0.7" />
                <rect x="-3.5" y="-10" width="7" height="20" rx="1.5" fill="#04060E" stroke="#334155" strokeWidth="0.7" />
                <polygon points="0,-8 -2,-5.5 2,-5.5" fill="#38BDF8" />
                <polygon points="0,8 -2,5.5 2,5.5" fill="#38BDF8" />
                <polygon points="-8,0 -5.5,-2 -5.5,2" fill="#38BDF8" />
                <polygon points="8,0 5.5,-2 5.5,2" fill="#38BDF8" />
              </g>

              {/* =========================================================== */}
              {/* LARGE HIGH-CONTRAST PLAYSTATION ACTION BUTTONS (Right Grip) */}
              {/* Triangle (Green), Square (Pink), Circle (Red), Cross (Blue) */}
              {/* =========================================================== */}
              <g transform="translate(74, 32)">
                {/* 1. GREEN TRIANGLE △ (Top) */}
                <circle cx="0" cy="-9" r="4.2" fill="#040712" stroke="#22C55E" strokeWidth="1.1" />
                <polygon points="0,-11.2 -2.4,-7.2 2.4,-7.2" fill="#22C55E" />

                {/* 2. PINK SQUARE □ (Left) */}
                <circle cx="-9" cy="0" r="4.2" fill="#040712" stroke="#EC4899" strokeWidth="1.1" />
                <rect x="-11" y="-2" width="4" height="4" fill="none" stroke="#EC4899" strokeWidth="1.2" />

                {/* 3. RED CIRCLE ○ (Right) */}
                <circle cx="9" cy="0" r="4.2" fill="#040712" stroke="#EF4444" strokeWidth="1.1" />
                <circle cx="9" cy="0" r="2" fill="none" stroke="#EF4444" strokeWidth="1.2" />

                {/* 4. BLUE CROSS ✕ (Bottom) */}
                <circle cx="0" cy="9" r="4.2" fill="#040712" stroke="#38BDF8" strokeWidth="1.1" />
                <line x1="-1.8" y1="7.2" x2="1.8" y2="10.8" stroke="#38BDF8" strokeWidth="1.3" />
                <line x1="1.8" y1="7.2" x2="-1.8" y2="10.8" stroke="#38BDF8" strokeWidth="1.3" />
              </g>

              {/* SONY Corporate Logo in Center */}
              <text x="50" y="22" textAnchor="middle" fill="#CBD5E1" fontSize="3.6" fontFamily="sans-serif" fontWeight="bold" letterSpacing="0.6">
                SONY
              </text>

              {/* SELECT & START Buttons */}
              <rect x="41" y="27" width="4.5" height="2" rx="0.5" fill="#1E293B" />
              <rect x="54.5" y="27" width="4.5" height="2" rx="0.5" fill="#1E293B" />

              {/* ANALOG Button & Glowing Red Indicator LED */}
              <circle cx="50" cy="34" r="2.8" fill="#04060E" stroke="#334155" strokeWidth="0.7" />
              <circle cx="50" cy="38.5" r="1.2" fill="#EF4444" className="animate-pulse" />

              {/* Twin Analog Thumbsticks with Concentric Domes */}
              {/* Left Thumbstick */}
              <circle cx="38" cy="49" r="8.5" fill="#060A14" stroke="#334155" strokeWidth="1" />
              <circle cx="38" cy="49" r="6.2" fill="#111827" stroke="#1E293B" strokeWidth="0.7" />
              <circle cx="38" cy="49" r="3.2" fill="#060A14" stroke="#006FCD" strokeWidth="0.5" />

              {/* Right Thumbstick */}
              <circle cx="62" cy="49" r="8.5" fill="#060A14" stroke="#334155" strokeWidth="1" />
              <circle cx="62" cy="49" r="6.2" fill="#111827" stroke="#1E293B" strokeWidth="0.7" />
              <circle cx="62" cy="49" r="3.2" fill="#060A14" stroke="#006FCD" strokeWidth="0.5" />
            </svg>
          </div>

          {/* Prominent, Fully Contained Integrated Spin Action Button */}
          <div className="w-full py-2 px-1 rounded-lg bg-gradient-to-r from-[#003B75] via-[#006FCD] to-[#003B75] border-2 border-cyan-300 text-white font-mono font-black text-xs sm:text-[13px] uppercase tracking-wider text-center shadow-[0_0_12px_rgba(0,111,205,0.8)] group-hover:brightness-125 transition-all select-none">
            {isSpinning ? 'STOP' : 'SPIN'}
          </div>

          {/* Ambient Hint Callout */}
          {!isSpinning && !disabled && (
            <div className="px-2 py-0.5 rounded bg-cyan-950/80 border border-cyan-400/60 text-[7.5px] text-cyan-300 font-bold uppercase tracking-wider text-center shadow-[0_0_6px_rgba(0,240,255,0.4)] animate-pulse">
              PRESS TO SPIN
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
