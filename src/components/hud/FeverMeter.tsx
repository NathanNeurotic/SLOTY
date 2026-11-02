import React from 'react';
import { Flame, Zap } from 'lucide-react';

interface FeverMeterProps {
  charge: number; // 0 to 100
  feverSpinsLeft: number;
}

export const FeverMeter: React.FC<FeverMeterProps> = ({ charge, feverSpinsLeft }) => {
  const isFeverActive = feverSpinsLeft > 0;

  return (
    <div className="w-full max-w-4xl mx-auto px-1 sm:px-3 mb-1 select-none flex-shrink-0">
      <div
        className={`relative rounded-xl px-2 py-0.5 sm:px-2.5 sm:py-1 border-2 transition-all duration-300 flex items-center justify-between overflow-hidden shadow-lg h-7 sm:h-9 flex-shrink-0 ${
          isFeverActive
            ? 'bg-gradient-to-r from-red-950 via-purple-950 to-amber-950 border-yellow-300 shadow-[0_0_20px_rgba(234,179,8,0.7)] animate-pulse'
            : 'bg-gradient-to-r from-slate-950 via-casino-950 to-slate-950 border-amber-500/40'
        }`}
      >
        {/* Left Badge: Molten Reactor Gauge */}
        <div className="flex items-center space-x-1 sm:space-x-1.5 flex-shrink-0 z-10 mr-1 sm:mr-2">
          <div
            className={`w-5 h-5 sm:w-6 sm:h-6 rounded-lg flex items-center justify-center border shadow-md flex-shrink-0 ${
              isFeverActive
                ? 'bg-gradient-to-b from-amber-400 to-red-600 border-yellow-200 animate-bounce'
                : 'bg-gradient-to-b from-slate-800 to-black border-amber-400/50'
            }`}
          >
            {isFeverActive ? (
              <Flame className="w-3.5 h-3.5 fill-white text-white" />
            ) : (
              <Zap className="w-3 h-3 text-yellow-400" />
            )}
          </div>

          <div className="flex flex-col">
            <span
              className={`text-[8px] sm:text-[9.5px] font-black uppercase tracking-wider leading-none ${
                isFeverActive ? 'text-yellow-300 animate-pulse' : 'text-amber-300'
              }`}
            >
              {isFeverActive
                ? `🔥 OVERDRIVE: ${feverSpinsLeft} SPINS`
                : 'OVERDRIVE'}
            </span>
            <span className="hidden sm:block text-[6.5px] sm:text-[7.5px] font-bold text-slate-400 uppercase tracking-widest leading-none mt-0.5">
              {isFeverActive ? 'ALL PAYOUTS DOUBLED' : 'CHARGE WITH WINS'}
            </span>
          </div>
        </div>

        {/* Center Glass Tube Progress Chamber */}
        <div className="flex-1 h-3 sm:h-3.5 bg-black/90 rounded-full border border-amber-500/40 overflow-hidden relative shadow-[inset_0_2px_4px_rgba(0,0,0,0.9)] mx-1.5">
          {/* Animated Molten Gold Core */}
          <div
            className={`h-full rounded-full transition-all duration-300 relative ${
              isFeverActive
                ? 'bg-gradient-to-r from-yellow-400 via-rose-500 to-amber-400 animate-shimmer-sweep w-full shadow-[0_0_15px_#F59E0B]'
                : 'bg-gradient-to-r from-amber-600 via-yellow-400 to-amber-500'
            }`}
            style={{ width: isFeverActive ? '100%' : `${charge}%` }}
          >
            {/* Plasma flow gloss */}
            <div className="absolute inset-0 bg-white/25 animate-pulse" />
          </div>

          {/* Sparking leading edge */}
          {!isFeverActive && charge > 0 && (
            <div
              className="absolute top-0 bottom-0 w-2.5 bg-white rounded-full shadow-[0_0_10px_#FFF] filter blur-[0.5px]"
              style={{ left: `calc(${charge}% - 5px)` }}
            />
          )}
        </div>

        {/* Right Percentage / Status Readout */}
        <div className="flex-shrink-0 ml-1 z-10 text-right min-w-[50px]">
          <span
            className={`font-mono text-[10px] sm:text-xs font-black px-1.5 py-0.5 rounded border ${
              isFeverActive
                ? 'bg-red-600 text-yellow-200 border-yellow-300 animate-pulse'
                : 'bg-black/60 text-amber-300 border-amber-400/30'
            }`}
          >
            {isFeverActive ? 'ACTIVE' : `${Math.floor(charge)}%`}
          </span>
        </div>
      </div>
    </div>
  );
};
