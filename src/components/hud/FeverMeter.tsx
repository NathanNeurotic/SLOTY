import React from 'react';
import { Flame, Zap, Sparkles } from 'lucide-react';
import type { GameId } from '../../games/types';
import { getGame } from '../../games/gameRegistry';

interface FeverMeterProps {
  charge: number; // 0 to 100
  feverSpinsLeft: number;
  activeGameId?: GameId;
}

export const FeverMeter: React.FC<FeverMeterProps> = ({
  charge,
  feverSpinsLeft,
  activeGameId = 'vault-24k',
}) => {
  const isFeverActive = feverSpinsLeft > 0;
  const isTimber = activeGameId === 'timber-critters';
  const gameDef = getGame(activeGameId);

  return (
    <div className="w-full max-w-5xl xl:max-w-6xl mx-auto px-1 sm:px-3 mb-0.5 sm:mb-1 select-none flex-shrink-0">
      <div
        className={`relative rounded-xl px-2 py-0.5 sm:px-2.5 sm:py-0.5 border-2 transition-all duration-300 flex items-center justify-between overflow-hidden shadow-lg h-6 sm:h-7.5 flex-shrink-0 ${
          isFeverActive
            ? isTimber
              ? 'bg-gradient-to-r from-emerald-950 via-teal-950 to-amber-950 border-emerald-300 shadow-[0_0_20px_rgba(52,211,153,0.7)] animate-pulse'
              : 'bg-gradient-to-r from-red-950 via-purple-950 to-amber-950 border-yellow-300 shadow-[0_0_20px_rgba(234,179,8,0.7)] animate-pulse'
            : isTimber
            ? 'bg-gradient-to-r from-stone-950 via-[#0a180e] to-stone-950 border-emerald-600/40'
            : 'bg-gradient-to-r from-slate-950 via-casino-950 to-slate-950 border-amber-500/40'
        }`}
      >
        {/* Left Badge: Molten Reactor / Nature Gauge */}
        <div className="flex items-center space-x-1 sm:space-x-1.5 flex-shrink-0 z-10 mr-1 sm:mr-2">
          <div
            className={`w-5 h-5 sm:w-6 sm:h-6 rounded-lg flex items-center justify-center border shadow-md flex-shrink-0 ${
              isFeverActive
                ? isTimber
                  ? 'bg-gradient-to-b from-emerald-400 to-teal-700 border-emerald-200 animate-bounce'
                  : 'bg-gradient-to-b from-amber-400 to-red-600 border-yellow-200 animate-bounce'
                : isTimber
                ? 'bg-gradient-to-b from-stone-800 to-black border-emerald-500/50'
                : 'bg-gradient-to-b from-slate-800 to-black border-amber-400/50'
            }`}
          >
            {isFeverActive ? (
              <Flame className="w-3.5 h-3.5 fill-white text-white" />
            ) : isTimber ? (
              <Sparkles className="w-3 h-3 text-emerald-300" />
            ) : (
              <Zap className="w-3 h-3 text-yellow-400" />
            )}
          </div>

          <div className="flex flex-col">
            <span
              className={`text-[8px] sm:text-[9.5px] font-black uppercase tracking-wider leading-none ${
                isFeverActive
                  ? isTimber
                    ? 'text-emerald-300 animate-pulse'
                    : 'text-yellow-300 animate-pulse'
                  : isTimber
                  ? 'text-emerald-300'
                  : 'text-amber-300'
              }`}
            >
              {isFeverActive
                ? `🔥 ${gameDef.theme.feverTitle}: ${feverSpinsLeft} SPINS`
                : gameDef.theme.feverTitle}
            </span>
            <span className="hidden sm:block text-[6.5px] sm:text-[7.5px] font-bold text-slate-400 uppercase tracking-widest leading-none mt-0.5">
              {isFeverActive ? 'ALL PAYOUTS DOUBLED (2X)' : gameDef.theme.feverSubtitle}
            </span>
          </div>
        </div>

        {/* Center Glass Tube Progress Chamber */}
        <div className={`flex-1 h-3 sm:h-3.5 bg-black/90 rounded-full border overflow-hidden relative shadow-[inset_0_2px_4px_rgba(0,0,0,0.9)] mx-1.5 ${
          isTimber ? 'border-emerald-600/40' : 'border-amber-500/40'
        }`}>
          {/* Animated Fluid Core */}
          <div
            className={`h-full rounded-full transition-all duration-300 relative ${
              isFeverActive
                ? isTimber
                  ? 'bg-gradient-to-r from-emerald-400 via-teal-300 to-amber-400 animate-shimmer-sweep w-full shadow-[0_0_15px_#10B981]'
                  : 'bg-gradient-to-r from-yellow-400 via-rose-500 to-amber-400 animate-shimmer-sweep w-full shadow-[0_0_15px_#F59E0B]'
                : isTimber
                ? 'bg-gradient-to-r from-emerald-700 via-teal-500 to-emerald-400 shadow-[0_0_8px_#10B981]'
                : 'bg-gradient-to-r from-amber-600 via-yellow-400 to-amber-500 shadow-[0_0_8px_#F59E0B]'
            }`}
            style={{ width: isFeverActive ? '100%' : `${charge}%` }}
          >
            {/* Fluid surface gloss */}
            <div className="absolute inset-0 bg-white/25 animate-pulse" />
          </div>
        </div>

        {/* Right Percentage / Status Readout */}
        <div className="flex-shrink-0 ml-1 z-10 text-right min-w-[50px]">
          <span
            className={`font-mono text-[10px] sm:text-xs font-black px-1.5 py-0.5 rounded border ${
              isFeverActive
                ? isTimber
                  ? 'bg-emerald-700 text-emerald-100 border-emerald-300 animate-pulse'
                  : 'bg-red-600 text-yellow-200 border-yellow-300 animate-pulse'
                : isTimber
                ? 'bg-black/60 text-emerald-300 border-emerald-500/40'
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
