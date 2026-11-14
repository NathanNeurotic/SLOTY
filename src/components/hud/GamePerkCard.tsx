import React from 'react';
import { Crown, Trees, BookOpen, Gamepad2 } from 'lucide-react';
import type { GameId } from '../../games/types';
import { getGame } from '../../games/gameRegistry';
import { soundManager } from '../../audio/soundManager';

interface GamePerkCardProps {
  activeGameId?: GameId;
  onOpenPaytable?: () => void;
}

export const GamePerkCard: React.FC<GamePerkCardProps> = ({
  activeGameId = 'vault-24k',
  onOpenPaytable,
}) => {
  const gameDef = getGame(activeGameId);
  const isTimber = activeGameId === 'timber-critters';
  const isPixel = activeGameId === 'pixel-arcade';
  const isPs2 = activeGameId === 'ps2-legends';

  const handleClick = () => {
    soundManager.unlockAudio();
    soundManager.playButtonClick();
    if (onOpenPaytable) {
      onOpenPaytable();
    }
  };

  return (
    <div
      onClick={handleClick}
      className="relative group cursor-pointer select-none transition-transform duration-200 flex flex-col items-center w-full max-w-[196px] 2xl:max-w-[224px] hover:scale-[1.02]"
      title="Click to view full paytable and game rules"
    >
      {/* Top Banner Tag */}
      <div className="relative mb-2 z-30 w-full max-w-[220px]">
        <div
          className={`px-3 py-1.5 rounded-2xl border-2 text-[11px] font-black shadow-xl tracking-wide text-center flex items-center justify-center space-x-1 ${
            isPs2
              ? 'bg-[#030818]/95 text-cyan-300 border-[#006FCD]/80 shadow-[0_4px_12px_rgba(0,111,205,0.4)]'
              : isPixel
              ? 'bg-[#180938]/95 text-pink-300 border-pink-500/60 shadow-[0_4px_12px_rgba(236,72,153,0.4)]'
              : isTimber
              ? 'bg-[#0a1e12]/95 text-emerald-200 border-emerald-500/50 shadow-[0_4px_12px_rgba(0,0,0,0.8)]'
              : 'bg-casino-900/95 text-amber-200 border-yellow-500/50 shadow-[0_4px_12px_rgba(0,0,0,0.8)]'
          }`}
        >
          {isPs2 ? <Gamepad2 className="w-3.5 h-3.5 text-cyan-400" /> : isPixel ? <Gamepad2 className="w-3.5 h-3.5 text-cyan-300" /> : <BookOpen className="w-3.5 h-3.5" />}
          <span className="font-mono">{isPs2 ? 'EMOTION ENGINE GUIDE' : isPixel ? 'ARCADE COMBO GUIDE' : isTimber ? 'FOREST TRAIL GUIDE' : 'VAULT PERK GUIDE'}</span>
        </div>
      </div>

      {/* Main Standee Chamber */}
      <div
        className={`relative w-52 h-[340px] rounded-2xl overflow-hidden border-2 shadow-2xl p-3 flex flex-col justify-between ${
          isPs2
            ? 'bg-gradient-to-b from-[#060c1d] via-[#02050e] to-black border-[#006FCD]/80 shadow-[0_0_30px_rgba(0,111,205,0.4)]'
            : isPixel
            ? 'bg-gradient-to-b from-[#180938] via-[#0d0422] to-[#05010e] border-pink-500/70 shadow-[0_0_30px_rgba(236,72,153,0.35)]'
            : isTimber
            ? 'bg-gradient-to-b from-[#14261b] via-[#0d1a12] to-[#060c08] border-emerald-400/70 shadow-[0_0_30px_rgba(16,185,129,0.35)]'
            : 'bg-gradient-to-b from-slate-900 via-casino-950 to-black border-yellow-400/60 shadow-[0_0_30px_rgba(245,158,11,0.35)]'
        }`}
      >
        {/* Subtle decorative grid/stripes */}
        <div className="absolute inset-0 bg-[radial-gradient(#ffffff_1px,transparent_1px)] [background-size:12px_12px] opacity-10 pointer-events-none" />

        {/* Header */}
        <div className="relative z-10 text-center pb-2 border-b border-white/10">
          <div className="flex items-center justify-center space-x-1">
            {isPs2 ? (
              <Gamepad2 className="w-3.5 h-3.5 text-cyan-400" />
            ) : isPixel ? (
              <Gamepad2 className="w-3.5 h-3.5 text-cyan-300" />
            ) : isTimber ? (
              <Trees className="w-3.5 h-3.5 text-emerald-400" />
            ) : (
              <Crown className="w-3.5 h-3.5 text-yellow-300 fill-yellow-300" />
            )}
            <span className={`text-xs font-black uppercase tracking-wider font-mono ${
              isPs2 ? 'text-cyan-300' : isPixel ? 'text-pink-300' : isTimber ? 'text-emerald-300' : 'text-yellow-300'
            }`}>
              {gameDef.name} ({gameDef.reels}x{gameDef.rows})
            </span>
          </div>
          <span className="text-[9px] font-bold text-slate-400 uppercase tracking-widest block mt-0.5 font-mono">
            {`${gameDef.defaultLines} PAYLINES • ${gameDef.volatilityLabel}`}
          </span>
        </div>

        {/* Feature Rows */}
        <div className="relative z-10 flex flex-col space-y-2 py-1">
          {/* Perk 1: Wild */}
          <div className="flex items-center space-x-2 bg-black/40 rounded-xl p-1.5 border border-white/5">
            <span className="text-xl">{isPs2 ? '🎮' : isPixel ? '⭐' : isTimber ? '🐻' : '👑'}</span>
            <div className="flex flex-col text-left">
              <span className={`text-[10px] font-black uppercase font-mono ${
                isPs2 ? 'text-cyan-300' : isPixel ? 'text-pink-300' : isTimber ? 'text-emerald-300' : 'text-yellow-300'
              }`}>
                {gameDef.symbols[gameDef.wildId]?.name.toUpperCase()} ({Math.max(...Object.values(gameDef.symbols[gameDef.wildId]?.payouts || { 5: 1000 })).toLocaleString()}X)
              </span>
              <span className="text-[8px] text-slate-300 font-mono">
                Substitutes all standard symbols except {gameDef.symbols[gameDef.scatterId]?.name} & {gameDef.symbols[gameDef.coinId]?.name}
              </span>
            </div>
          </div>

          {/* Perk 2: Free Spins */}
          <div className="flex items-center space-x-2 bg-black/40 rounded-xl p-1.5 border border-white/5">
            <span className="text-xl">{isPs2 ? '💿' : isPixel ? '👾' : isTimber ? '🦉' : '🔥'}</span>
            <div className="flex flex-col text-left">
              <span className={`text-[10px] font-black uppercase font-mono ${
                isPs2 ? 'text-blue-300' : isPixel ? 'text-cyan-300' : isTimber ? 'text-teal-300' : 'text-cyan-300'
              }`}>
                {`${gameDef.freeSpinsAward} ${gameDef.theme.freeSpinsTitle} (${gameDef.freeSpinsMultiplier}X)`}
              </span>
              <span className="text-[8px] text-slate-300 font-mono">
                3+ {gameDef.symbols[gameDef.scatterId]?.name} = {gameDef.freeSpinsAward} Free Spins at {gameDef.freeSpinsMultiplier}X
              </span>
            </div>
          </div>

          {/* Perk 3: Hold & Spin */}
          <div className="flex items-center space-x-2 bg-black/40 rounded-xl p-1.5 border border-white/5">
            <span className="text-xl">{isPs2 ? '💾' : isPixel ? '🪙' : isTimber ? '🌰' : '🪙'}</span>
            <div className="flex flex-col text-left">
              <span className={`text-[10px] font-black uppercase font-mono ${
                isPs2 ? 'text-purple-300' : isPixel ? 'text-yellow-300' : isTimber ? 'text-amber-300' : 'text-amber-300'
              }`}>
                {gameDef.theme.bonusTitle.toUpperCase()}
              </span>
              <span className="text-[8px] text-slate-300 font-mono">
                6+ {gameDef.symbols[gameDef.coinId]?.name} lock & reset 3 respins for Grand
              </span>
            </div>
          </div>

          {/* Perk 4: Multiplier / Gamble */}
          <div className="flex items-center space-x-2 bg-black/40 rounded-xl p-1.5 border border-white/5">
            <span className="text-xl">{isPs2 ? '⚡' : isPixel ? '🕹️' : isTimber ? '🍃' : '🎲'}</span>
            <div className="flex flex-col text-left">
              <span className={`text-[10px] font-black uppercase font-mono ${
                isPs2 ? 'text-cyan-300' : isPixel ? 'text-purple-300' : isTimber ? 'text-emerald-300' : 'text-rose-400'
              }`}>
                {isPs2 ? '294 MHz OVERCLOCK FEVER' : isPixel ? 'OVERDRIVE COMBO FEVER' : isTimber ? "NATURE'S FURY CHARGE" : 'VIDEO POKER 2X GAMBLE'}
              </span>
              <span className="text-[8px] text-slate-300 font-mono">
                {isPs2 ? 'Spins charge 2X Emotion Engine fever' : isPixel ? 'Spins charge 2X arcade fever' : isTimber ? 'Spins charge 2X woodland fever' : 'Double your win in high-stakes cards'}
              </span>
            </div>
          </div>
        </div>

        {/* Action Button at bottom */}
        <div className="relative z-10 w-full pt-1">
          <div className={`w-full py-2 rounded-xl text-[10px] font-black uppercase tracking-wider text-center flex items-center justify-center space-x-1 shadow-md transition-all font-mono ${
            isPs2
              ? 'bg-gradient-to-r from-[#006FCD] to-cyan-500 text-white hover:brightness-110 shadow-[0_0_15px_rgba(0,111,205,0.5)]'
              : isPixel
              ? 'bg-gradient-to-r from-pink-600 to-purple-600 text-white hover:brightness-110 shadow-[0_0_15px_rgba(236,72,153,0.5)]'
              : isTimber
              ? 'bg-gradient-to-r from-emerald-600 to-teal-700 text-emerald-100 hover:brightness-110 shadow-[0_0_15px_rgba(16,185,129,0.5)]'
              : 'bg-gradient-to-r from-yellow-500 to-amber-600 text-amber-950 hover:brightness-110 shadow-[0_0_15px_rgba(245,158,11,0.5)]'
          }`}>
            <span>{isPs2 ? 'VIEW PS2 PAYTABLE & BIOS' : isPixel ? 'VIEW ARCADE PAYTABLE' : isTimber ? 'VIEW PAYTABLE & RULES' : 'VIEW PAYTABLE & RULES'}</span>
          </div>
        </div>
      </div>
    </div>
  );
};
