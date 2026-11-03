import React from 'react';
import { soundManager } from '../../audio/soundManager';
import { Sparkles, Trees } from 'lucide-react';
import type { GameId } from '../../games/types';

interface SlotyLogoProps {
  activeGameId?: GameId;
}

export const SlotyLogo: React.FC<SlotyLogoProps> = ({ activeGameId = 'vault-24k' }) => {
  const isTimber = activeGameId === 'timber-critters';

  const handleClickLogo = () => {
    if (isTimber) {
      soundManager.playOwlHoot(2);
      soundManager.speakAnnouncement('TIMBERLAND CRITTERS');
    } else {
      soundManager.playCashRegister();
      soundManager.speakAnnouncement('CASH VAULT TYCOON');
    }
  };

  return (
    <div
      onClick={handleClickLogo}
      className="flex items-center space-x-2 sm:space-x-3 cursor-pointer group select-none"
      title={isTimber ? 'Timberland Critters - Click for sound!' : 'SLOTY 24K Gold & Cash Vault - Click for Cha-Ching!'}
    >
      {/* 3D Emblem Token */}
      <div
        className={`relative w-9 h-9 sm:w-11 sm:h-11 rounded-2xl p-0.5 shadow-lg group-hover:scale-105 transition-transform duration-200 flex-shrink-0 ${
          isTimber
            ? 'bg-gradient-to-tr from-amber-700 via-emerald-600 to-emerald-400 shadow-[0_0_20px_rgba(16,185,129,0.6)]'
            : 'bg-gradient-to-tr from-amber-600 via-yellow-400 to-amber-700 shadow-[0_0_20px_rgba(245,158,11,0.6)]'
        }`}
      >
        <div
          className={`w-full h-full rounded-[14px] flex flex-col items-center justify-center relative overflow-hidden border ${
            isTimber
              ? 'bg-[#0a180e] border-emerald-400/60'
              : 'bg-casino-950 border-yellow-300/40'
          }`}
        >
          {/* Animated background radial glow */}
          <div
            className={`absolute inset-0 animate-pulse ${
              isTimber
                ? 'bg-[radial-gradient(circle_at_50%_40%,rgba(16,185,129,0.4),transparent_70%)]'
                : 'bg-[radial-gradient(circle_at_50%_40%,rgba(245,158,11,0.35),transparent_70%)]'
            }`}
          />

          {/* Center Graphic */}
          <div className="relative z-10 flex items-center justify-center leading-none">
            {isTimber ? (
              <Trees className="w-5 h-5 sm:w-6 sm:h-6 text-emerald-300 drop-shadow-[0_0_8px_rgba(16,185,129,0.9)]" />
            ) : (
              <span className="text-sm sm:text-base font-black italic gold-gradient-text drop-shadow-[0_0_8px_rgba(245,158,11,0.9)] tracking-tighter">
                $777
              </span>
            )}
          </div>

          {/* Tiny badge */}
          <div className="absolute top-0.5 text-[8px] animate-pulse">
            {isTimber ? '🌲' : '👑'}
          </div>
        </div>
      </div>

      {/* Marquee Typography */}
      <div className="flex flex-col justify-center">
        <div className="flex items-center space-x-1.5 leading-none">
          <span
            className={`text-base sm:text-xl font-black tracking-wider uppercase drop-shadow-[0_2px_4px_rgba(0,0,0,0.8)] group-hover:brightness-110 transition-all font-sans ${
              isTimber
                ? 'text-emerald-300 drop-shadow-[0_0_10px_rgba(16,185,129,0.6)]'
                : 'gold-gradient-text'
            }`}
          >
            SLOTY
          </span>
          <span
            className={`text-[8.5px] sm:text-[9.5px] px-1.5 py-0.5 rounded font-black tracking-widest uppercase shadow-md border ${
              isTimber
                ? 'bg-gradient-to-r from-emerald-600 to-teal-500 text-white border-emerald-300 shadow-[0_0_10px_rgba(16,185,129,0.8)]'
                : 'bg-gradient-to-r from-amber-500 to-yellow-400 text-amber-950 border-yellow-200 shadow-[0_0_10px_rgba(245,158,11,0.8)]'
            }`}
          >
            {isTimber ? 'TIMBERLAND' : '24K GOLD'}
          </span>
          <Sparkles className={`w-3.5 h-3.5 animate-spin opacity-80 group-hover:opacity-100 ${isTimber ? 'text-emerald-300 fill-emerald-300' : 'text-yellow-300 fill-yellow-300'}`} />
        </div>

        <div
          className={`hidden sm:flex items-center space-x-1 text-[8px] sm:text-[9px] font-black tracking-widest leading-none mt-1 ${
            isTimber
              ? 'text-amber-400 drop-shadow-[0_0_6px_rgba(245,158,11,0.7)]'
              : 'text-emerald-400 drop-shadow-[0_0_6px_rgba(16,185,129,0.7)]'
          }`}
        >
          <span>{isTimber ? '🌲 FOREST CRITTERS' : '★ CASH VAULT'}</span>
          <span>•</span>
          <span>{isTimber ? 'ACORN CASH LINK 🌲' : 'CURRENCY TYCOON ★'}</span>
        </div>
      </div>
    </div>
  );
};
