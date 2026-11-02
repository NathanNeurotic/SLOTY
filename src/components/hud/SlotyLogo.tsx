import React from 'react';
import { soundManager } from '../../audio/soundManager';
import { Sparkles } from 'lucide-react';

export const SlotyLogo: React.FC = () => {
  const handleClickLogo = () => {
    soundManager.playCelebrationWhistle();
  };

  return (
    <div
      onClick={handleClickLogo}
      className="flex items-center space-x-2 sm:space-x-3 cursor-pointer group select-none"
      title="SLOTY Deluxe 777 - Click for lucky whistle!"
    >
      {/* Deluxe 3D Shield Token Emblem */}
      <div className="relative w-9 h-9 sm:w-11 sm:h-11 rounded-2xl bg-gradient-to-tr from-amber-600 via-yellow-400 to-amber-700 p-0.5 shadow-[0_0_20px_rgba(245,158,11,0.6)] group-hover:scale-105 transition-transform duration-200 flex-shrink-0">
        <div className="w-full h-full bg-casino-950 rounded-[14px] flex flex-col items-center justify-center relative overflow-hidden border border-yellow-300/40">
          {/* Animated background radial glow */}
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_40%,rgba(245,158,11,0.35),transparent_70%)] animate-pulse" />

          {/* 777 Golden Triple Seven Crown */}
          <div className="relative z-10 flex items-center justify-center leading-none">
            <span className="text-sm sm:text-base font-black italic gold-gradient-text drop-shadow-[0_0_8px_rgba(245,158,11,0.9)] tracking-tighter">
              777
            </span>
          </div>

          {/* Tiny glowing crown badge */}
          <div className="absolute top-0.5 text-[8px] animate-bounce-soft">
            👑
          </div>
        </div>
      </div>

      {/* Vegas Marquee Typography */}
      <div className="flex flex-col justify-center">
        <div className="flex items-center space-x-1.5 leading-none">
          <span className="text-base sm:text-xl font-black tracking-wider gold-gradient-text uppercase drop-shadow-[0_2px_4px_rgba(0,0,0,0.8)] group-hover:brightness-110 transition-all font-sans">
            SLOTY
          </span>
          <span className="text-[9px] sm:text-[10px] px-1.5 py-0.5 rounded bg-gradient-to-r from-red-600 to-pink-600 text-white font-black tracking-widest uppercase shadow-[0_0_8px_rgba(239,68,68,0.7)] animate-pulse">
            DELUXE
          </span>
          <Sparkles className="w-3.5 h-3.5 text-yellow-300 fill-yellow-300 animate-spin opacity-80 group-hover:opacity-100" />
        </div>

        <div className="flex items-center space-x-1 text-[8px] sm:text-[9.5px] font-black tracking-widest leading-none mt-1 text-neon-cyan drop-shadow-[0_0_6px_rgba(0,240,255,0.7)]">
          <span>★ OREGON VLT</span>
          <span className="text-amber-400">•</span>
          <span>VEGAS CASINO ★</span>
        </div>
      </div>
    </div>
  );
};
