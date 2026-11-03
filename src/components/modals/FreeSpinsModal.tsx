import React, { useEffect } from 'react';
import { Flame, Sparkles, Trees, Moon } from 'lucide-react';
import { soundManager } from '../../audio/soundManager';
import { launchCoinFountain } from '../../fx/celebrations';
import type { GameId } from '../../games/types';

interface FreeSpinsModalProps {
  freeSpinsAwarded: number;
  multiplier: number;
  onStart: () => void;
  activeGameId?: GameId;
}

export const FreeSpinsModal: React.FC<FreeSpinsModalProps> = ({
  freeSpinsAwarded,
  multiplier,
  onStart,
  activeGameId = 'vault-24k',
}) => {
  const isTimber = activeGameId === 'timber-critters';

  useEffect(() => {
    if (isTimber) {
      soundManager.playWoodlandFanfare();
      soundManager.playOwlHoot(3);
    } else {
      soundManager.playJackpotFanfare();
    }
    launchCoinFountain('mega');

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.code === 'Space' || e.code === 'Enter' || e.key === 'Escape') {
        e.preventDefault();
        e.stopPropagation();
        soundManager.playButtonClick();
        onStart();
      }
    };

    window.addEventListener('keydown', handleKeyDown, { capture: true });
    return () => window.removeEventListener('keydown', handleKeyDown, { capture: true });
  }, [onStart, isTimber]);

  // =========================================================================
  // --- VERSION A: TIMBERLAND CRITTERS (MOONLIT FOREST HARVEST) ---
  // =========================================================================
  if (isTimber) {
    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/90 backdrop-blur-md select-none animate-fadeIn">
        <div className="relative max-w-md w-full bg-gradient-to-b from-[#2a1708] via-[#140c06] to-[#080503] border-4 border-[#78350f] shadow-[0_0_80px_rgba(16,185,129,0.7),inset_0_0_40px_rgba(0,0,0,0.9)] rounded-3xl p-6 sm:p-8 text-center flex flex-col items-center">
          {/* Top Hanging Pine Bough & Lantern Header */}
          <div className="w-18 h-18 rounded-full bg-gradient-to-tr from-emerald-600 via-teal-500 to-amber-400 flex items-center justify-center shadow-[0_0_35px_rgba(52,211,153,0.8)] mb-4 animate-bounce">
            <span className="text-4xl">🦉</span>
          </div>

          <div className="flex items-center space-x-1.5 text-emerald-400 text-xs font-black uppercase tracking-widest mb-1">
            <Trees className="w-4 h-4 text-emerald-400" />
            <span>MOONLIT HARVEST UNLOCKED</span>
            <Moon className="w-4 h-4 text-amber-300" />
          </div>

          <h1 className="text-3xl sm:text-4xl font-black text-amber-300 tracking-wide uppercase mb-2 drop-shadow-[0_2px_10px_rgba(245,158,11,0.8)]">
            FOREST FREE SPINS!
          </h1>

          <p className="text-emerald-100 text-xs sm:text-sm mb-6 leading-relaxed">
            The ancient wise owl calls through the canopy! All paylines pay <span className="text-amber-300 font-black">3X WINS</span> and Grizzly Gus prowls with wild multipliers!
          </p>

          {/* Feature stats in rustic cedar log frames */}
          <div className="grid grid-cols-2 gap-3 w-full mb-6">
            <div className="bg-[#120a05] border-2 border-emerald-600/60 p-3 rounded-2xl flex flex-col items-center shadow-inner">
              <span className="text-[10px] text-emerald-400 font-bold uppercase tracking-wider">Free Spins</span>
              <span className="text-3xl font-black text-white">{freeSpinsAwarded}</span>
            </div>
            <div className="bg-[#120a05] border-2 border-amber-600/60 p-3 rounded-2xl flex flex-col items-center shadow-inner">
              <span className="text-[10px] text-amber-400 font-bold uppercase tracking-wider">Woodland Multiplier</span>
              <span className="text-3xl font-black text-amber-300">{multiplier}X</span>
            </div>
          </div>

          {/* Start button */}
          <button
            onClick={() => {
              soundManager.playButtonClick();
              onStart();
            }}
            className="w-full py-3.5 rounded-2xl font-black text-base uppercase tracking-wider text-white bg-gradient-to-r from-emerald-600 via-green-500 to-emerald-700 border-2 border-emerald-300 shadow-[0_0_30px_rgba(16,185,129,0.8)] hover:scale-105 active:scale-95 transition-transform flex items-center justify-center space-x-2"
          >
            <span>START WOODLAND SPINS</span>
            <span className="px-2 py-0.5 rounded bg-black/35 text-[11px] font-mono tracking-tight font-bold">SPACE</span>
          </button>
        </div>
      </div>
    );
  }

  // =========================================================================
  // --- VERSION B: 24K VAULT (MOLTEN VAULT OVERDRIVE) ---
  // =========================================================================
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/90 backdrop-blur-md select-none animate-fadeIn">
      <div className="relative max-w-md w-full bg-gradient-to-b from-amber-950 via-casino-950 to-black border-4 border-yellow-400 shadow-[0_0_80px_rgba(245,158,11,0.8),inset_0_0_50px_rgba(0,0,0,0.95)] rounded-3xl p-6 sm:p-8 text-center flex flex-col items-center">
        {/* Glowing Fire Icon */}
        <div className="w-18 h-18 rounded-full bg-gradient-to-tr from-amber-500 to-red-600 flex items-center justify-center shadow-[0_0_40px_rgba(239,68,68,0.9)] mb-4 animate-bounce">
          <Flame className="w-11 h-11 text-yellow-300 fill-yellow-300" />
        </div>

        <div className="flex items-center space-x-1 text-gold-bright text-xs font-bold uppercase tracking-widest mb-1">
          <Sparkles className="w-4 h-4" />
          <span>SECURITY PROTOCOL OVERRIDDEN</span>
          <Sparkles className="w-4 h-4" />
        </div>

        <h1 className="text-3xl sm:text-5xl font-black text-amber-300 tracking-wide uppercase mb-2 drop-shadow-[0_2px_12px_rgba(253,224,71,0.9)]">
          MOLTEN OVERDRIVE!
        </h1>

        <p className="text-slate-300 text-xs sm:text-sm mb-6 leading-relaxed">
          Fort Knox blast doors breached! All paylines supercharged at <span className="text-amber-300 font-black">3X MULTIPLIERS</span> with cash showers and minted gold bullion wilds!
        </p>

        {/* Feature stats */}
        <div className="grid grid-cols-2 gap-3 w-full mb-6">
          <div className="bg-casino-900 border border-amber-500/50 p-3 rounded-2xl flex flex-col items-center shadow-inner">
            <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">Free Spins</span>
            <span className="text-3xl font-black text-white">{freeSpinsAwarded}</span>
          </div>
          <div className="bg-casino-900 border border-amber-500/50 p-3 rounded-2xl flex flex-col items-center shadow-inner">
            <span className="text-[10px] text-amber-400 font-bold uppercase tracking-wider">Line Multiplier</span>
            <span className="text-3xl font-black text-yellow-400">{multiplier}X</span>
          </div>
        </div>

        {/* Start button */}
        <button
          onClick={() => {
            soundManager.playButtonClick();
            onStart();
          }}
          className="gold-btn w-full py-3.5 rounded-2xl font-black text-base uppercase tracking-wider text-casino-950 hover:scale-105 active:scale-95 transition-transform flex items-center justify-center space-x-2 shadow-[0_0_30px_rgba(245,158,11,0.8)]"
        >
          <span>ENTER HIGH-ROLLER VAULT</span>
          <span className="px-2 py-0.5 rounded bg-black/25 text-[11px] font-mono tracking-tight font-bold">SPACE</span>
        </button>
      </div>
    </div>
  );
};
