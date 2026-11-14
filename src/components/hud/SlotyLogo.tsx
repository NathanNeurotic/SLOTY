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
  const isPs2 = activeGameId === 'ps2-legends';

  const handleClickLogo = () => {
    if (isPs2) {
      soundManager.playPs2Startup();
      soundManager.speakAnnouncement('PLAYSTATION 2 EMOTION ENGINE');
    } else if (isTimber) {
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

  const getSubTagline = () => {
    if (isPs2) return { left: '🎮 128-BIT ENGINE', right: '40 LINES DUALSHOCK 💾' };
    if (isTimber) return { left: '🌲 FOREST CRITTERS', right: 'ACORN CASH LINK 🌲' };
    if (isPixel) return { left: '🕹️ 6x5 MEGA-GRID', right: '50 LINES ARCADE 👾' };
    return { left: '★ CASH VAULT', right: 'CURRENCY TYCOON ★' };
  };

  const tag = getSubTagline();

  return (
    <div
      onClick={handleClickLogo}
      className="flex items-center space-x-1 sm:space-x-2 xl:space-x-3 cursor-pointer group select-none"
      title={isPs2 ? 'PS2 Legends 128-Bit Emotion Engine' : isTimber ? 'Timberland Critters' : isPixel ? 'Pixel Arcade 8-Bit Quest' : 'SLOTY 24K Gold & Cash Vault'}
    >
      {/* 3D Emblem Token with Bespoke Physical Silhouette */}
      <div
        className={`relative w-7 h-7 sm:w-9 sm:h-9 xl:w-11 xl:h-11 p-0.5 shadow-lg group-hover:scale-105 transition-transform duration-200 flex-shrink-0 ${
          isPs2
            ? 'bg-gradient-to-tr from-[#006FCD] via-cyan-400 to-[#001433] shadow-[0_0_20px_rgba(0,111,205,0.7)]'
            : isTimber
            ? 'bg-gradient-to-tr from-amber-700 via-emerald-600 to-emerald-400 shadow-[0_0_20px_rgba(16,185,129,0.6)]'
            : isPixel
            ? 'bg-gradient-to-tr from-purple-700 via-pink-500 to-cyan-400 shadow-[0_0_20px_rgba(236,72,153,0.7)]'
            : 'bg-gradient-to-tr from-amber-600 via-yellow-400 to-amber-700 shadow-[0_0_20px_rgba(245,158,11,0.6)]'
        }`}
        style={{
          clipPath: isPixel
            ? 'polygon(0 4px, 4px 0, calc(100% - 4px) 0, 100% 4px, 100% calc(100% - 4px), calc(100% - 4px) 100%, 4px 100%, 0 calc(100% - 4px))'
            : isPs2
            ? 'polygon(0 3px, 3px 0, calc(100% - 3px) 0, 100% 3px, 100% calc(100% - 3px), calc(100% - 3px) 100%, 3px 100%, 0 calc(100% - 3px))'
            : isTimber
            ? 'polygon(0% 15%, 4% 0%, 96% 0%, 100% 15%, 96% 50%, 100% 85%, 96% 100%, 4% 100%, 0% 85%, 4% 50%)'
            : 'polygon(6px 0, calc(100% - 6px) 0, 100% 6px, 100% calc(100% - 6px), calc(100% - 6px) 100%, 6px 100%, 0 calc(100% - 6px), 0 6px)',
        }}
      >
        <div
          className={`w-full h-full flex flex-col items-center justify-center relative overflow-hidden border ${
            isPs2
              ? 'bg-[#030614] border-[#006FCD]/80'
              : isTimber
              ? 'bg-[#0a180e] border-emerald-400/60'
              : isPixel
              ? 'bg-[#0a051b] border-pink-400/60'
              : 'bg-casino-950 border-yellow-300/40'
          }`}
          style={{
            clipPath: isPixel
              ? 'polygon(0 3px, 3px 0, calc(100% - 3px) 0, 100% 3px, 100% calc(100% - 3px), calc(100% - 3px) 100%, 3px 100%, 0 calc(100% - 3px))'
              : isPs2
              ? 'polygon(0 2px, 2px 0, calc(100% - 2px) 0, 100% 2px, 100% calc(100% - 2px), calc(100% - 2px) 100%, 2px 100%, 0 calc(100% - 2px))'
              : isTimber
              ? 'polygon(0% 15%, 4% 0%, 96% 0%, 100% 15%, 96% 50%, 100% 85%, 96% 100%, 4% 100%, 0% 85%, 4% 50%)'
              : 'polygon(5px 0, calc(100% - 5px) 0, 100% 5px, 100% calc(100% - 5px), calc(100% - 5px) 100%, 5px 100%, 0 calc(100% - 5px), 0 5px)',
          }}
        >
          {/* Animated background radial glow */}
          <div
            className={`absolute inset-0 animate-pulse ${
              isPs2
                ? 'bg-[radial-gradient(circle_at_50%_40%,rgba(0,111,205,0.5),transparent_70%)]'
                : isTimber
                ? 'bg-[radial-gradient(circle_at_50%_40%,rgba(16,185,129,0.4),transparent_70%)]'
                : isPixel
                ? 'bg-[radial-gradient(circle_at_50%_40%,rgba(236,72,153,0.4),transparent_70%)]'
                : 'bg-[radial-gradient(circle_at_50%_40%,rgba(245,158,11,0.35),transparent_70%)]'
            }`}
          />

          {/* Center Graphic */}
          <div className="relative z-10 flex items-center justify-center leading-none">
            {isPs2 ? (
              <span className="text-xs sm:text-sm font-mono font-black text-cyan-300 drop-shadow-[0_0_8px_#00F0FF]">
                PS2
              </span>
            ) : isTimber ? (
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
            {isPs2 ? '🎮' : isTimber ? '🌲' : isPixel ? '👾' : '👑'}
          </div>
        </div>
      </div>

      {/* Marquee Typography - Bespoke Title Styling Per Game (hidden below lg: the active game is named by the selector) */}
      <div className="hidden lg:flex flex-col justify-center">
        {isPs2 ? (
          <div className="flex items-center space-x-1.5 leading-none font-mono">
            <span className="text-sm sm:text-lg font-black tracking-wider uppercase text-cyan-300 drop-shadow-[0_0_10px_rgba(0,111,205,0.9)]">
              PS2 LEGENDS
            </span>
            <span className="inline-flex items-center justify-center whitespace-nowrap leading-none shrink-0 text-[8.5px] sm:text-[9.5px] px-2 py-0.5 rounded font-black tracking-widest uppercase bg-gradient-to-r from-[#006FCD] to-cyan-500 text-white border border-cyan-300 shadow-[0_0_10px_rgba(0,111,205,0.8)]">
              EMOTION ENGINE 🎮
            </span>
          </div>
        ) : isTimber ? (
          <div className="flex items-center space-x-1.5 leading-none">
            <span className="text-sm sm:text-lg font-black tracking-wider uppercase text-amber-200 drop-shadow-[0_2px_4px_rgba(0,0,0,0.9)] font-serif">
              TIMBERLAND
            </span>
            <span className="inline-flex items-center justify-center whitespace-nowrap leading-none shrink-0 text-[8.5px] sm:text-[9.5px] px-2 py-0.5 rounded-full font-black tracking-widest uppercase bg-gradient-to-r from-emerald-600 to-teal-500 text-white border border-emerald-300 shadow-[0_0_10px_rgba(16,185,129,0.8)]">
              CRITTERS 🌲
            </span>
          </div>
        ) : isPixel ? (
          <div className="flex items-center space-x-1.5 leading-none font-mono">
            <span className="text-sm sm:text-lg font-black tracking-wider uppercase text-pink-400 drop-shadow-[0_0_10px_rgba(236,72,153,0.8)]">
              PIXEL
            </span>
            <span className="inline-flex items-center justify-center whitespace-nowrap leading-none shrink-0 text-[8.5px] sm:text-[9.5px] px-2 py-0.5 rounded font-black tracking-widest uppercase bg-gradient-to-r from-purple-600 to-pink-500 text-cyan-200 border border-cyan-400 shadow-[0_0_10px_rgba(6,182,212,0.8)]">
              ARCADE 🕹️
            </span>
          </div>
        ) : (
          <div className="flex items-center space-x-1 sm:space-x-1.5 leading-none shrink-0">
            <span className="text-sm sm:text-base xl:text-lg font-black tracking-wider uppercase gold-gradient-text drop-shadow-[0_2px_4px_rgba(0,0,0,0.8)] whitespace-nowrap">
              24K GOLD
            </span>
            <span className="inline-flex items-center justify-center whitespace-nowrap leading-none shrink-0 text-[8px] sm:text-[9px] px-1.5 sm:px-2 py-0.5 rounded font-black tracking-wider uppercase bg-gradient-to-r from-amber-500 to-yellow-400 text-amber-950 border border-yellow-200 shadow-[0_0_10px_rgba(245,158,11,0.8)]">
              CASH VAULT 👑
            </span>
            <Sparkles className="w-3 h-3 sm:w-3.5 sm:h-3.5 animate-spin text-yellow-300 fill-yellow-300 shrink-0" />
          </div>
        )}

        <div
          className={`hidden xl:flex items-center space-x-1 text-[8px] sm:text-[9px] font-black tracking-widest leading-none mt-1 truncate max-w-full overflow-hidden ${
            isPs2
              ? 'text-cyan-300 drop-shadow-[0_0_6px_rgba(0,111,205,0.7)] font-mono'
              : isTimber
              ? 'text-amber-400 drop-shadow-[0_0_6px_rgba(245,158,11,0.7)]'
              : isPixel
              ? 'text-cyan-300 drop-shadow-[0_0_6px_rgba(6,182,212,0.7)] font-mono'
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
