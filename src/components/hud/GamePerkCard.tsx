import React from 'react';
import { Crown, Trees, BookOpen, Gamepad2 } from 'lucide-react';
import type { GameId } from '../../games/types';
import { soundManager } from '../../audio/soundManager';

interface GamePerkCardProps {
  activeGameId?: GameId;
  onOpenPaytable?: () => void;
}

export const GamePerkCard: React.FC<GamePerkCardProps> = ({
  activeGameId = 'vault-24k',
  onOpenPaytable,
}) => {
  const isTimber = activeGameId === 'timber-critters';
  const isPixel = activeGameId === 'pixel-arcade';

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
      className="relative group cursor-pointer select-none transition-transform duration-200 flex flex-col items-center w-56 hover:scale-[1.02]"
      title="Click to view full paytable and game rules"
    >
      {/* Top Banner Tag */}
      <div className="relative mb-2 z-30 w-full max-w-[220px]">
        <div
          className={`px-3 py-1.5 rounded-2xl border-2 text-[11px] font-black shadow-xl tracking-wide text-center flex items-center justify-center space-x-1 ${
            isPixel
              ? 'bg-[#180938]/95 text-pink-300 border-pink-500/60 shadow-[0_4px_12px_rgba(236,72,153,0.4)]'
              : isTimber
              ? 'bg-[#0a1e12]/95 text-emerald-200 border-emerald-500/50 shadow-[0_4px_12px_rgba(0,0,0,0.8)]'
              : 'bg-casino-900/95 text-amber-200 border-yellow-500/50 shadow-[0_4px_12px_rgba(0,0,0,0.8)]'
          }`}
        >
          {isPixel ? <Gamepad2 className="w-3.5 h-3.5 text-cyan-300" /> : <BookOpen className="w-3.5 h-3.5" />}
          <span className="font-mono">{isPixel ? 'ARCADE COMBO GUIDE' : isTimber ? 'FOREST TRAIL GUIDE' : 'VAULT PERK GUIDE'}</span>
        </div>
      </div>

      {/* Main Standee Chamber */}
      <div
        className={`relative w-52 h-[340px] rounded-2xl overflow-hidden border-2 shadow-2xl p-3 flex flex-col justify-between ${
          isPixel
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
            {isPixel ? (
              <Gamepad2 className="w-3.5 h-3.5 text-cyan-300" />
            ) : isTimber ? (
              <Trees className="w-3.5 h-3.5 text-emerald-400" />
            ) : (
              <Crown className="w-3.5 h-3.5 text-yellow-300 fill-yellow-300" />
            )}
            <span className={`text-xs font-black uppercase tracking-wider font-mono ${
              isPixel ? 'text-pink-300' : isTimber ? 'text-emerald-300' : 'text-yellow-300'
            }`}>
              {isPixel ? 'PIXEL ARCADE 6x5' : isTimber ? 'TIMBERLAND CRITTERS' : '24K GOLD VAULT'}
            </span>
          </div>
          <span className="text-[9px] font-bold text-slate-400 uppercase tracking-widest block mt-0.5 font-mono">
            {isPixel ? '50 RETRO PAYLINES • 96.0% RTP' : isTimber ? '25 WILD PAYLINES • 96.2% RTP' : '40 HIGH-ROLLER PAYLINES • 95.8% RTP'}
          </span>
        </div>

        {/* Feature Rows */}
        <div className="relative z-10 flex flex-col space-y-2 py-1">
          {/* Perk 1: Wild */}
          <div className="flex items-center space-x-2 bg-black/40 rounded-xl p-1.5 border border-white/5">
            <span className="text-xl">{isPixel ? '⭐' : isTimber ? '🐻' : '👑'}</span>
            <div className="flex flex-col text-left">
              <span className={`text-[10px] font-black uppercase font-mono ${
                isPixel ? 'text-pink-300' : isTimber ? 'text-emerald-300' : 'text-yellow-300'
              }`}>
                {isPixel ? 'STAR WILD (1,000X)' : isTimber ? 'BEAR WILD (1,000X)' : 'IMPERIAL WILD (1,000X)'}
              </span>
              <span className="text-[8px] text-slate-300 font-mono">
                {isPixel ? 'Substitutes all arcade symbols' : isTimber ? 'Substitutes all woodland critters' : 'Substitutes all standard vault symbols'}
              </span>
            </div>
          </div>

          {/* Perk 2: Free Spins */}
          <div className="flex items-center space-x-2 bg-black/40 rounded-xl p-1.5 border border-white/5">
            <span className="text-xl">{isPixel ? '👾' : isTimber ? '🦉' : '🔥'}</span>
            <div className="flex flex-col text-left">
              <span className={`text-[10px] font-black uppercase font-mono ${
                isPixel ? 'text-cyan-300' : isTimber ? 'text-teal-300' : 'text-cyan-300'
              }`}>
                {isPixel ? 'CARTRIDGE SCATTER' : isTimber ? 'MOONLIT OWL SCATTER' : 'VAULT BLAST SCATTER'}
              </span>
              <span className="text-[8px] text-slate-300 font-mono">
                {isPixel ? '3+ cartridges = 10 Boss Games (3X)' : isTimber ? '3+ scatters = 10 Free Spins at 3X' : '3+ scatters = 10 Free Spins at 3X'}
              </span>
            </div>
          </div>

          {/* Perk 3: Hold & Spin */}
          <div className="flex items-center space-x-2 bg-black/40 rounded-xl p-1.5 border border-white/5">
            <span className="text-xl">{isPixel ? '🪙' : isTimber ? '🌰' : '🪙'}</span>
            <div className="flex flex-col text-left">
              <span className={`text-[10px] font-black uppercase font-mono ${
                isPixel ? 'text-yellow-300' : isTimber ? 'text-amber-300' : 'text-amber-300'
              }`}>
                {isPixel ? 'HIGH SCORE RESPIN' : isTimber ? 'ACORN CASH LINK' : 'BULLION CASH LINK'}
              </span>
              <span className="text-[8px] text-slate-300 font-mono">
                {isPixel ? '6+ tokens lock & reset 3 respins' : isTimber ? '6+ cash coins lock & reset 3 respins' : '6+ cash coins lock & reset 3 respins'}
              </span>
            </div>
          </div>

          {/* Perk 4: Multiplier / Gamble */}
          <div className="flex items-center space-x-2 bg-black/40 rounded-xl p-1.5 border border-white/5">
            <span className="text-xl">{isPixel ? '🕹️' : isTimber ? '🍃' : '🎲'}</span>
            <div className="flex flex-col text-left">
              <span className={`text-[10px] font-black uppercase font-mono ${
                isPixel ? 'text-purple-300' : isTimber ? 'text-emerald-300' : 'text-rose-400'
              }`}>
                {isPixel ? 'OVERDRIVE COMBO FEVER' : isTimber ? "NATURE'S FURY CHARGE" : 'VIDEO POKER 2X GAMBLE'}
              </span>
              <span className="text-[8px] text-slate-300 font-mono">
                {isPixel ? 'Spins charge 2X arcade fever' : isTimber ? 'Spins charge 2X woodland fever' : 'Double your win in high-stakes cards'}
              </span>
            </div>
          </div>
        </div>

        {/* Action Button at bottom */}
        <div className="relative z-10 w-full pt-1">
          <div className={`w-full py-2 rounded-xl text-[10px] font-black uppercase tracking-wider text-center flex items-center justify-center space-x-1 shadow-md transition-all font-mono ${
            isPixel
              ? 'bg-gradient-to-r from-pink-600 to-purple-600 text-white hover:brightness-110 shadow-[0_0_15px_rgba(236,72,153,0.5)]'
              : isTimber
              ? 'bg-gradient-to-r from-emerald-600 to-teal-700 text-emerald-100 hover:brightness-110 shadow-[0_0_15px_rgba(16,185,129,0.5)]'
              : 'bg-gradient-to-r from-yellow-500 to-amber-600 text-amber-950 hover:brightness-110 shadow-[0_0_15px_rgba(245,158,11,0.5)]'
          }`}>
            <span>{isPixel ? 'VIEW ARCADE PAYTABLE' : isTimber ? 'VIEW PAYTABLE & RULES' : 'VIEW PAYTABLE & RULES'}</span>
          </div>
        </div>
      </div>
    </div>
  );
};
