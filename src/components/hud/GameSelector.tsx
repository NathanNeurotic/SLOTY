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

  return (
    <div className="flex items-center space-x-1 sm:space-x-1.5 bg-gradient-to-b from-black via-slate-950 to-black p-1 rounded-2xl border-2 border-amber-500/50 shadow-[inset_0_2px_6px_rgba(0,0,0,0.9)] select-none">
      {games.map((g) => {
        const isActive = g.id === activeGameId;
        const isTimber = g.id === 'timber-critters';
        const isPixel = g.id === 'pixel-arcade';

        return (
          <button
            key={g.id}
            onClick={() => handleSelect(g.id)}
            disabled={disabled}
            title={`${g.name} (${g.reels}x${g.rows} Reels • ${g.defaultLines} Lines)`}
            className={`flex items-center space-x-1 sm:space-x-1.5 px-1.5 sm:px-3 py-0.5 sm:py-1 rounded-xl text-xs font-black transition-all ${
              isActive
                ? isTimber
                  ? 'bg-gradient-to-r from-emerald-600 via-teal-700 to-emerald-900 text-white border-2 border-emerald-300 shadow-[0_0_15px_rgba(16,185,129,0.7)] scale-[1.02]'
                  : isPixel
                  ? 'bg-gradient-to-r from-purple-600 via-pink-600 to-indigo-900 text-white border-2 border-pink-300 shadow-[0_0_15px_rgba(236,72,153,0.8)] scale-[1.02]'
                  : 'bg-gradient-to-r from-amber-500 via-yellow-400 to-amber-600 text-amber-950 border-2 border-yellow-200 shadow-[0_0_15px_rgba(245,158,11,0.7)] scale-[1.02]'
                : 'text-slate-400 hover:text-white hover:bg-white/5 border border-transparent'
            }`}
          >
            <span className="text-sm sm:text-base leading-none">{g.icon}</span>
            <div className="flex flex-col text-left">
              <span className="text-[9px] sm:text-[10.5px] font-black uppercase tracking-wider leading-none">
                {g.shortName}
              </span>
              <span className="text-[6.5px] sm:text-[7.5px] font-mono font-bold text-slate-300/80 leading-none mt-0.5">
                {g.reels}x{g.rows} • {g.defaultLines}L
              </span>
            </div>
          </button>
        );
      })}
    </div>
  );
};
