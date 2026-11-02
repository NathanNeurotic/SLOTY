import React from 'react';
import { Flame, Coins } from 'lucide-react';

interface FeverMeterProps {
  charge: number; // 0 to 100
  feverSpinsLeft: number;
}

export const FeverMeter: React.FC<FeverMeterProps> = ({ charge, feverSpinsLeft }) => {
  const isFeverActive = feverSpinsLeft > 0;

  return (
    <div className="w-full max-w-4xl mx-auto px-1 sm:px-3 mb-1 select-none flex-shrink-0">
      <div
        className={`relative rounded-xl px-2 py-1 border transition-colors duration-200 flex items-center justify-between overflow-hidden shadow-lg h-8 sm:h-9 flex-shrink-0 ${
          isFeverActive
            ? 'bg-gradient-to-r from-red-950 via-purple-950 to-amber-950 border-yellow-300 shadow-[0_0_25px_rgba(234,179,8,0.8)] animate-pulse'
            : 'bg-casino-950/80 border-white/10'
        }`}
      >
        {/* Left Badge */}
        <div className="flex items-center space-x-1.5 flex-shrink-0 z-10 mr-2">
          <div
            className={`w-5 h-5 rounded-md flex items-center justify-center ${
              isFeverActive ? 'bg-amber-500 animate-pulse' : 'bg-casino-800'
            }`}
          >
            {isFeverActive ? (
              <Flame className="w-3.5 h-3.5 fill-white text-white" />
            ) : (
              <Coins className="w-3.5 h-3.5 text-yellow-400" />
            )}
          </div>
          <span
            className={`text-[8.5px] sm:text-[9.5px] font-black uppercase tracking-wider ${
              isFeverActive ? 'text-yellow-300 animate-pulse' : 'text-slate-300'
            }`}
          >
            {isFeverActive
              ? `🔥 24K GOLD OVERDRIVE: ${feverSpinsLeft} SPINS (2X CASH WINS) 🔥`
              : 'GOLD VAULT OVERDRIVE'}
          </span>
        </div>

        {/* Center Progress Bar */}
        <div className="flex-1 h-3 sm:h-3.5 bg-black/60 rounded-full border border-white/10 overflow-hidden relative shadow-inner mx-1">
          {/* Animated fill */}
          <div
            className={`h-full rounded-full transition-all duration-500 relative ${
              isFeverActive
                ? 'bg-gradient-to-r from-yellow-400 via-rose-500 to-amber-400 animate-shimmer-sweep w-full'
                : 'bg-gradient-to-r from-amber-500 via-yellow-400 to-emerald-500'
            }`}
            style={{ width: isFeverActive ? '100%' : `${charge}%` }}
          >
            {/* Plasma flow gloss */}
            <div className="absolute inset-0 bg-white/20 animate-pulse" />
          </div>

          {/* Sparking head */}
          {!isFeverActive && charge > 0 && (
            <div
              className="absolute top-0 bottom-0 w-2 bg-white rounded-full shadow-[0_0_8px_#FFF] filter blur-[0.5px]"
              style={{ left: `calc(${charge}% - 4px)` }}
            />
          )}
        </div>

        {/* Right Percentage / Status */}
        <div className="flex-shrink-0 ml-2 z-10 text-right min-w-[45px]">
          <span
            className={`font-mono text-[9px] sm:text-[10px] font-black ${
              isFeverActive ? 'text-yellow-300' : 'text-amber-400'
            }`}
          >
            {isFeverActive ? 'ACTIVE' : `${Math.floor(charge)}%`}
          </span>
        </div>
      </div>
    </div>
  );
};
