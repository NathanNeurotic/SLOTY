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
  const [isPulled, setIsPulled] = useState(false);

  const handlePullLever = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (disabled || isSpinning || isPulled) return;

    soundManager.playLeverPull();
    setIsPulled(true);
    onPull();

    setTimeout(() => {
      setIsPulled(false);
    }, 600);
  };

  return (
    <div
      onClick={handlePullLever}
      className={`hidden xl:flex items-center absolute -right-16 sm:-right-20 top-1/3 select-none cursor-pointer group z-20 ${
        disabled && !isSpinning ? 'opacity-40 cursor-not-allowed' : ''
      }`}
      title={disabled ? 'Insufficient coins' : isTimber ? 'Pull the Timberland Logging Lever!' : 'Pull the 24K Vegas Slot Lever!'}
    >
      {/* 1. Heavy Structural Chassis Mount Extension (Connects seamlessly to Cabinet border) */}
      <div
        className={`w-14 sm:w-16 h-10 -mr-2 shadow-2xl flex items-center justify-between px-1.5 border-y-2 border-r-2 rounded-r-md relative z-10 ${
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
            {/* Knob glint */}
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
                ? 'bg-[#15803d] border-emerald-400 shadow-[0_0_10px_rgba(34,197,94,0.7)]'
                : 'bg-red-600 border-red-300 shadow-[0_0_12px_rgba(239,68,68,0.8)]'
            }`}
          >
            PULL
          </div>
        )}
      </div>
    </div>
  );
};
