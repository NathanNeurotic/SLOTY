import React from 'react';
import type { GameId } from '../../games/types';
import { getAllGames } from '../../games/gameRegistry';
import { soundManager } from '../../audio/soundManager';

interface GameSelectorProps {
  activeGameId: GameId;
  onSelectGame: (gameId: GameId) => void;
  disabled?: boolean;
}

export const GameSelector: React.FC<GameSelectorProps> = ({
  activeGameId,
  onSelectGame,
  disabled = false,
}) => {
  const games = getAllGames();

  const handleSelect = (id: GameId) => {
    if (disabled || id === activeGameId) return;
    soundManager.playButtonClick();
    soundManager.playCashRegister();
    onSelectGame(id);
  };

  const isTimberActive = activeGameId === 'timber-critters';
  const isPixelActive = activeGameId === 'pixel-arcade';
  const isPs2Active = activeGameId === 'ps2-legends';

  // 1. PLAYSTATION 2: 8MB MAGICGATE MEMORY CARD BAY
  if (isPs2Active) {
    return (
      <div
        className="flex items-center space-x-1 p-0.5 sm:p-1 bg-[#05070d] border-2 border-[#006FCD] shadow-[0_0_15px_rgba(0,111,205,0.7)] select-none font-mono"
        style={{
          clipPath:
            'polygon(0 0, calc(100% - 6px) 0, 100% 6px, 100% 100%, 6px 100%, 0 calc(100% - 6px))',
        }}
      >
        <span className="hidden 2xl:inline text-[7.5px] font-black text-[#38BDF8] uppercase tracking-widest pl-1.5 pr-0.5">
          MEMORY CARD [8MB]:
        </span>
        {games.map((g) => {
          const isActive = g.id === activeGameId;
          return (
            <button
              key={g.id}
              onClick={() => handleSelect(g.id)}
              disabled={disabled}
              title={`${g.name} (${g.reels}x${g.rows} Reels • ${g.defaultLines} Lines)`}
              className={`flex items-center space-x-1 px-1.5 sm:px-2.5 py-0.5 sm:py-1 text-[8.5px] sm:text-[10px] font-black uppercase transition-all ${
                isActive
                  ? 'bg-gradient-to-r from-[#003875] via-[#0052a3] to-[#006FCD] text-white border border-cyan-300 shadow-[0_0_15px_rgba(0,111,205,0.9)] scale-[1.02]'
                  : 'bg-[#0a0d17] text-slate-400 hover:text-cyan-300 border border-[#1e293b]'
              }`}
              style={{
                clipPath:
                  'polygon(0 0, calc(100% - 4px) 0, 100% 4px, 100% 100%, 4px 100%, 0 calc(100% - 4px))',
              }}
            >
              <span className="text-xs shrink-0">{g.icon}</span>
              <span className="leading-none whitespace-nowrap truncate">{g.shortName}</span>
              {isActive && (
                <span className="w-1.5 h-1.5 rounded-full bg-cyan-400 animate-pulse ml-0.5 shadow-[0_0_6px_#00F0FF]" />
              )}
            </button>
          );
        })}
      </div>
    );
  }

  // 1. PIXEL ARCADE: 8-BIT ROM CARTRIDGE LOADER
  if (isPixelActive) {
    return (
      <div
        className="flex items-center space-x-1 p-0.5 sm:p-1 bg-black border-2 border-pink-500 shadow-[0_0_15px_rgba(236,72,153,0.6)] select-none"
        style={{
          clipPath:
            'polygon(0 4px, 4px 0, calc(100% - 4px) 0, 100% 4px, 100% calc(100% - 4px), calc(100% - 4px) 100%, 4px 100%, 0 calc(100% - 4px))',
        }}
      >
        <span className="hidden 2xl:inline text-[7.5px] font-mono font-black text-pink-400 uppercase tracking-widest pl-1 pr-0.5">
          ROM CART:
        </span>
        {games.map((g) => {
          const isActive = g.id === activeGameId;
          return (
            <button
              key={g.id}
              onClick={() => handleSelect(g.id)}
              disabled={disabled}
              title={`${g.name} (${g.reels}x${g.rows} Reels • ${g.defaultLines} Lines)`}
              className={`flex items-center space-x-1 px-1.5 sm:px-2.5 py-0.5 sm:py-1 font-mono text-[8.5px] sm:text-[10px] font-black uppercase transition-all ${
                isActive
                  ? 'bg-gradient-to-r from-pink-600 via-purple-600 to-cyan-500 text-white border border-cyan-300 shadow-[0_0_12px_#06B6D4] scale-[1.02]'
                  : 'bg-slate-950 text-slate-400 hover:text-cyan-300 hover:bg-slate-900 border border-slate-700'
              }`}
              style={{
                clipPath:
                  'polygon(0 3px, 3px 0, calc(100% - 3px) 0, 100% 3px, 100% 100%, 0 100%)',
              }}
            >
              <span className="text-xs shrink-0">{g.icon}</span>
              <span className="leading-none whitespace-nowrap truncate">{g.shortName}</span>
              {isActive && (
                <span className="w-1.5 h-1.5 bg-cyan-300 animate-ping ml-0.5" />
              )}
            </button>
          );
        })}
      </div>
    );
  }

  // 2. TIMBERLAND CRITTERS: HAND-CARVED RUSTIC TRAIL SIGNS
  if (isTimberActive) {
    return (
      <div
        className="flex items-center space-x-1 p-0.5 sm:p-1 bg-[#200e04] border-2 border-[#854d0e] shadow-[0_4px_15px_rgba(0,0,0,0.9)] select-none font-serif"
        style={{
          clipPath:
            'polygon(0% 15%, 2% 0%, 98% 0%, 100% 15%, 98% 50%, 100% 85%, 98% 100%, 2% 100%, 0% 85%, 2% 50%)',
        }}
      >
        <span className="hidden 2xl:inline text-[7.5px] font-black text-amber-400 uppercase tracking-widest pl-1.5 pr-0.5">
          TRAILHEAD:
        </span>
        {games.map((g) => {
          const isActive = g.id === activeGameId;
          return (
            <button
              key={g.id}
              onClick={() => handleSelect(g.id)}
              disabled={disabled}
              title={`${g.name} (${g.reels}x${g.rows} Reels • ${g.defaultLines} Lines)`}
              className={`flex items-center space-x-1 px-1.5 sm:px-2.5 py-0.5 sm:py-1 text-[8.5px] sm:text-[10px] font-black uppercase transition-all ${
                isActive
                  ? 'bg-gradient-to-r from-emerald-800 via-teal-700 to-emerald-900 text-amber-100 border-2 border-emerald-400 shadow-[0_0_12px_rgba(52,211,153,0.7)] scale-[1.02]'
                  : 'bg-[#140803] text-stone-400 hover:text-amber-200 border border-[#78350f]'
              }`}
              style={{
                clipPath:
                  'polygon(0% 0%, 88% 0%, 100% 50%, 88% 100%, 0% 100%, 5% 50%)',
              }}
            >
              <span className="text-xs shrink-0">{g.icon}</span>
              <span className="leading-none tracking-wide whitespace-nowrap truncate">{g.shortName}</span>
            </button>
          );
        })}
      </div>
    );
  }

  // 3. 24K GOLD VAULT: FORT KNOX BULLION INGOT SELECTOR
  return (
    <div
      className="flex items-center space-x-1 p-0.5 sm:p-1 bg-gradient-to-r from-slate-950 via-casino-950 to-slate-950 border-2 border-yellow-400 shadow-[0_0_15px_rgba(245,158,11,0.5)] select-none"
      style={{
        clipPath:
          'polygon(8px 0, calc(100% - 8px) 0, 100% 8px, 100% calc(100% - 8px), calc(100% - 8px) 100%, 8px 100%, 0 calc(100% - 8px), 0 8px)',
      }}
    >
      <span className="hidden 2xl:inline text-[7.5px] font-mono font-black text-yellow-300 uppercase tracking-widest pl-1.5 pr-0.5">
        DEPOSITORY:
      </span>
      {games.map((g) => {
        const isActive = g.id === activeGameId;
        return (
          <button
            key={g.id}
            onClick={() => handleSelect(g.id)}
            disabled={disabled}
            title={`${g.name} (${g.reels}x${g.rows} Reels • ${g.defaultLines} Lines)`}
            className={`flex items-center space-x-1 px-1.5 sm:px-2.5 py-0.5 sm:py-1 text-[8.5px] sm:text-[10px] font-black uppercase font-mono transition-all ${
              isActive
                ? 'bg-gradient-to-r from-yellow-400 via-amber-300 to-yellow-500 text-amber-950 border border-yellow-100 shadow-[0_0_15px_rgba(245,158,11,0.9)] scale-[1.02]'
                : 'bg-black/90 text-yellow-500/70 hover:text-yellow-200 border border-yellow-500/30'
            }`}
            style={{
              clipPath:
                'polygon(6px 0, calc(100% - 6px) 0, 100% 6px, 100% calc(100% - 6px), calc(100% - 6px) 100%, 6px 100%, 0 calc(100% - 6px), 0 6px)',
            }}
          >
            <span className="text-xs shrink-0">{g.icon}</span>
            <span className="leading-none tracking-wide whitespace-nowrap truncate">{g.shortName}</span>
          </button>
        );
      })}
    </div>
  );
};
