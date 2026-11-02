import React, { useState } from 'react';
import { soundManager } from '../../audio/soundManager';

interface SlotLeverProps {
  isSpinning: boolean;
  disabled: boolean;
  onPull: () => void;
}

export const SlotLever: React.FC<SlotLeverProps> = ({ isSpinning, disabled, onPull }) => {
  const [isPulled, setIsPulled] = useState(false);

  const handlePullLever = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (disabled || isSpinning || isPulled) return;

    soundManager.playLeverPull();
    setIsPulled(true);
    onPull();

    // Reset lever arm position after mechanical stroke
    setTimeout(() => {
      setIsPulled(false);
    }, 600);
  };

  return (
    <div
      onClick={handlePullLever}
      className={`hidden xl:flex flex-col items-center absolute -right-16 sm:-right-20 top-1/4 select-none cursor-pointer group z-20 ${
        disabled && !isSpinning ? 'opacity-40 cursor-not-allowed' : ''
      }`}
      title={disabled ? 'Insufficient coins' : 'Pull the Vegas Slot Lever!'}
    >
      {/* 1. Cabinet Base Mount Bracket */}
      <div className="w-6 h-14 bg-gradient-to-r from-slate-800 via-slate-600 to-slate-900 rounded-l-md border-y border-l border-white/20 shadow-2xl flex items-center justify-center">
        <div className="w-3 h-8 rounded bg-gradient-to-b from-amber-600 to-amber-900 border border-yellow-400/50 shadow-inner" />
      </div>

      {/* 2. Mechanical Pivot Knuckle */}
      <div className="relative -mt-7 -ml-2">
        <div className="w-10 h-10 rounded-full bg-gradient-to-tr from-slate-900 via-slate-700 to-slate-500 border-2 border-slate-400 shadow-xl flex items-center justify-center">
          <div className="w-5 h-5 rounded-full bg-gradient-to-tr from-amber-500 to-yellow-300 border border-white/60 shadow-inner" />
        </div>
      </div>

      {/* 3. The 3D Lever Shaft & Glowing Knob */}
      <div
        className={`relative flex flex-col items-center origin-bottom transition-all duration-300 ${
          isPulled
            ? 'transform rotate-[75deg] scale-y-75 translate-y-12 translate-x-3'
            : isSpinning
            ? 'transform rotate-[10deg]'
            : 'group-hover:rotate-[5deg]'
        }`}
        style={{
          transitionTimingFunction: isPulled ? 'cubic-bezier(0.4, 0, 0.2, 1)' : 'cubic-bezier(0.175, 0.885, 0.32, 1.275)',
        }}
      >
        {/* Shiny Red / Gold Grip Ball Knob */}
        <div
          className={`w-10 h-10 rounded-full shadow-[0_0_20px_rgba(239,68,68,0.8)] border-2 border-white/80 transition-all ${
            isSpinning
              ? 'bg-gradient-to-tr from-amber-600 via-yellow-400 to-amber-300 animate-pulse'
              : 'bg-gradient-to-tr from-rose-700 via-red-500 to-rose-300 group-hover:scale-110'
          }`}
        >
          {/* Specular Glint */}
          <div className="w-3 h-3 rounded-full bg-white/80 ml-2 mt-1.5 filter blur-[0.5px]" />
        </div>

        {/* Polished Chrome Shaft */}
        <div className="w-3.5 h-32 bg-gradient-to-r from-slate-400 via-slate-100 to-slate-500 border-x border-slate-300 shadow-lg rounded-t-sm" />
      </div>

      {/* "PULL" Flashing Sign */}
      {!isSpinning && !disabled && (
        <div className="mt-2 -ml-2 px-1.5 py-0.5 rounded bg-red-600/80 border border-red-400 text-white font-black text-[9px] tracking-widest uppercase shadow-[0_0_10px_rgba(239,68,68,0.8)] animate-pulse">
          PULL
        </div>
      )}
    </div>
  );
};
