import React from 'react';
import { soundManager } from '../../audio/soundManager';
import { Sparkles, Trees } from 'lucide-react';
import type { GameId } from '../../games/types';

interface SlotyLogoProps {
  activeGameId?: GameId;
}

export const SlotyLogo: React.FC<SlotyLogoProps> = ({ activeGameId = 'vault-24k' }) => {
  const isTimber = activeGameId === 'timber-critters';
  const isPixel = activeGameId === 'pixel-arcade';

  const handleClickLogo = () => {
    if (isTimber) {
      soundManager.playOwlHoot(2);
      soundManager.speakAnnouncement('TIMBERLAND CRITTERS');
    } else if (isPixel) {
      soundManager.playPuppetBoing();
      soundManager.speakAnnouncement('PIXEL ARCADE 8-BIT QUEST');
    } else {
      soundManager.playCashRegister();
      soundManager.speakAnnouncement('CASH VAULT TYCOON');
    }
  };

  const getGameBadge = () => {
    if (isTimber) return 'TIMBERLAND';
    if (isPixel) return 'PIXEL ARCADE';
    return '24K GOLD';
  };

  const getSubTagline = () => {
    if (isTimber) return { left: '🌲 FOREST CRITTERS', right: 'ACORN CASH LINK 🌲' };
    if (isPixel) return { left: '🕹️ 6x5 MEGA-GRID', right: '50 LINES ARCADE 👾' };
    return { left: '★ CASH VAULT', right: 'CURRENCY TYCOON ★' };
  };

  const tag = getSubTagline();

  return (
    <div
      onClick={handleClickLogo}
      className="flex items-center space-x-2 sm:space-x-3 cursor-pointer group select-none"
      title={isTimber ? 'Timberland Critters' : isPixel ? 'Pixel Arcade 8-Bit Quest' : 'SLOTY 24K Gold & Cash Vault'}
    >
      {/* 3D Emblem Token */}
      <div
        className={`relative w-9 h-9 sm:w-11 sm:h-11 rounded-2xl p-0.5 shadow-lg group-hover:scale-105 transition-transform duration-200 flex-shrink-0 ${
          isTimber
            ? 'bg-gradient-to-tr from-amber-700 via-emerald-600 to-emerald-400 shadow-[0_0_20px_rgba(16,185,129,0.6)]'
            : isPixel
            ? 'bg-gradient-to-tr from-purple-700 via-pink-500 to-cyan-400 shadow-[0_0_20px_rgba(236,72,153,0.7)]'
            : 'bg-gradient-to-tr from-amber-600 via-yellow-400 to-amber-700 shadow-[0_0_20px_rgba(245,158,11,0.6)]'
        }`}
      >
        <div
          className={`w-full h-full rounded-[14px] flex flex-col items-center justify-center relative overflow-hidden border ${
            isTimber
              ? 'bg-[#0a180e] border-emerald-400/60'
              : isPixel
              ? 'bg-[#0a051b] border-pink-400/60'
              : 'bg-casino-950 border-yellow-300/40'
          }`}
        >
          {/* Animated background radial glow */}
          <div
            className={`absolute inset-0 animate-pulse ${
              isTimber
                ? 'bg-[radial-gradient(circle_at_50%_40%,rgba(16,185,129,0.4),transparent_70%)]'
                : isPixel
                ? 'bg-[radial-gradient(circle_at_50%_40%,rgba(236,72,153,0.4),transparent_70%)]'
                : 'bg-[radial-gradient(circle_at_50%_40%,rgba(245,158,11,0.35),transparent_70%)]'
            }`}
          />

          {/* Center Graphic */}
          <div className="relative z-10 flex items-center justify-center leading-none">
            {isTimber ? (
              <Trees className="w-5 h-5 sm:w-6 sm:h-6 text-emerald-300 drop-shadow-[0_0_8px_rgba(16,185,129,0.9)]" />
            ) : isPixel ? (
              <span className="text-sm sm:text-base">🕹️</span>
            ) : (
              <span className="text-sm sm:text-base font-black italic gold-gradient-text drop-shadow-[0_0_8px_rgba(245,158,11,0.9)] tracking-tighter">
                $777
              </span>
            )}
          </div>

          {/* Tiny badge */}
          <div className="absolute top-0.5 text-[8px] animate-pulse">
            {isTimber ? '🌲' : isPixel ? '👾' : '👑'}
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
                : isPixel
                ? 'text-pink-400 drop-shadow-[0_0_10px_rgba(236,72,153,0.7)]'
                : 'gold-gradient-text'
            }`}
          >
            SLOTY
          </span>
          <span
            className={`inline-flex items-center justify-center whitespace-nowrap leading-none shrink-0 text-[8.5px] sm:text-[9.5px] px-2 py-0.5 rounded font-black tracking-widest uppercase shadow-md border ${
              isTimber
                ? 'bg-gradient-to-r from-emerald-600 to-teal-500 text-white border-emerald-300 shadow-[0_0_10px_rgba(16,185,129,0.8)]'
                : isPixel
                ? 'bg-gradient-to-r from-purple-600 to-pink-500 text-white border-pink-300 shadow-[0_0_10px_rgba(236,72,153,0.8)]'
                : 'bg-gradient-to-r from-amber-500 to-yellow-400 text-amber-950 border-yellow-200 shadow-[0_0_10px_rgba(245,158,11,0.8)]'
            }`}
          >
            {getGameBadge()}
          </span>
          <Sparkles className={`w-3.5 h-3.5 animate-spin opacity-80 group-hover:opacity-100 ${isTimber ? 'text-emerald-300 fill-emerald-300' : isPixel ? 'text-pink-300 fill-pink-300' : 'text-yellow-300 fill-yellow-300'}`} />
        </div>

        <div
          className={`hidden sm:flex items-center space-x-1 text-[8px] sm:text-[9px] font-black tracking-widest leading-none mt-1 ${
            isTimber
              ? 'text-amber-400 drop-shadow-[0_0_6px_rgba(245,158,11,0.7)]'
              : isPixel
              ? 'text-cyan-300 drop-shadow-[0_0_6px_rgba(6,182,212,0.7)]'
              : 'text-emerald-400 drop-shadow-[0_0_6px_rgba(16,185,129,0.7)]'
          }`}
        >
          <span>{tag.left}</span>
          <span>•</span>
          <span>{tag.right}</span>
        </div>
      </div>
    </div>
  );
};
