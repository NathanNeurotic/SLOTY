import React, { useEffect } from 'react';
import { Flame, Sparkles, Trees, Moon, Gamepad2, Zap } from 'lucide-react';
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
  const isPixel = activeGameId === 'pixel-arcade';
  const isPs2 = activeGameId === 'ps2-legends';

  useEffect(() => {
    if (isPs2) {
      soundManager.playPs2Startup();
    } else if (isPixel) {
      soundManager.playArcadeVictoryFanfare();
    } else if (isTimber) {
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
  }, [onStart, isTimber, isPixel]);

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
  // --- VERSION B: PIXEL ARCADE (1989 BOSS RUSH MECHA DRAGON BATTLE) ---
  // =========================================================================
  if (isPixel) {
    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/90 backdrop-blur-md select-none animate-fadeIn">
        <div className="relative max-w-md w-full bg-gradient-to-b from-[#240638] via-[#100326] to-[#05010e] border-4 border-pink-500 shadow-[0_0_80px_rgba(236,72,153,0.8),inset_0_0_40px_rgba(0,0,0,0.95)] rounded-3xl p-6 sm:p-8 text-center flex flex-col items-center">
          {/* Top 8-Bit Cartridge / Boss Icon */}
          <div className="w-18 h-18 rounded-full bg-gradient-to-tr from-purple-600 via-pink-500 to-cyan-400 flex items-center justify-center shadow-[0_0_40px_rgba(236,72,153,0.9)] mb-4 animate-bounce">
            <span className="text-4xl">🐉</span>
          </div>

          <div className="flex items-center space-x-1.5 text-pink-400 text-xs font-mono font-black uppercase tracking-widest mb-1">
            <Zap className="w-4 h-4 text-cyan-300 animate-pulse" />
            <span>BOSS BATTLE ENCOUNTER</span>
            <Gamepad2 className="w-4 h-4 text-pink-400 animate-pulse" />
          </div>

          <h1 className="text-3xl sm:text-4xl font-black text-transparent bg-clip-text bg-gradient-to-r from-pink-400 via-cyan-300 to-yellow-300 tracking-wide uppercase mb-2 drop-shadow-[0_2px_10px_rgba(236,72,153,0.9)] font-mono">
            BOSS RUSH UNLOCKED!
          </h1>

          <p className="text-cyan-100 text-xs sm:text-sm mb-6 leading-relaxed font-mono">
            Mecha Dragon descends upon the 6x5 Mega-Grid! All 50 lines pay <span className="text-yellow-300 font-black">3X MULTIPLIERS</span> with locking power-ups and laser wilds!
          </p>

          {/* Feature stats in arcade neon display */}
          <div className="grid grid-cols-2 gap-3 w-full mb-6 font-mono">
            <div className="bg-black/80 border-2 border-pink-500/70 p-3 rounded-2xl flex flex-col items-center shadow-inner">
              <span className="text-[10px] text-pink-400 font-black uppercase tracking-wider">Free Spins</span>
              <span className="text-3xl font-black text-white">{freeSpinsAwarded}</span>
            </div>
            <div className="bg-black/80 border-2 border-cyan-400/70 p-3 rounded-2xl flex flex-col items-center shadow-inner">
              <span className="text-[10px] text-cyan-400 font-black uppercase tracking-wider">Arcade Boost</span>
              <span className="text-3xl font-black text-cyan-300">{multiplier}X</span>
            </div>
          </div>

          {/* Start button */}
          <button
            onClick={() => {
              soundManager.playButtonClick();
              onStart();
            }}
            className="w-full py-3.5 rounded-2xl font-black text-base uppercase tracking-wider text-white bg-gradient-to-r from-pink-600 via-purple-600 to-cyan-500 hover:from-pink-500 hover:to-cyan-400 border-2 border-pink-300 shadow-[0_0_35px_rgba(236,72,153,0.9)] hover:scale-105 active:scale-95 transition-transform flex items-center justify-center space-x-2 font-mono"
          >
            <span>INSERT COIN / START BATTLE</span>
            <span className="px-2 py-0.5 rounded bg-black/40 text-[11px] font-mono tracking-tight font-bold">SPACE</span>
          </button>
        </div>
      </div>
    );
  }

  // =========================================================================
  // --- VERSION C: PLAYSTATION 2 (128-BIT EMOTION ENGINE OVERCLOCK FREE SPINS) ---
  // =========================================================================
  if (isPs2) {
    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/90 backdrop-blur-md select-none animate-fadeIn">
        <div className="relative max-w-md w-full bg-gradient-to-b from-[#00102b] via-[#000817] to-black border-4 border-[#006FCD] shadow-[0_0_80px_rgba(0,111,205,0.85),inset_0_0_40px_rgba(0,0,0,0.95)] rounded-3xl p-6 sm:p-8 text-center flex flex-col items-center">
          {/* Top 128-Bit Disc Core Icon */}
          <div className="w-18 h-18 rounded-full bg-gradient-to-tr from-[#002660] via-[#006FCD] to-[#00F0FF] flex items-center justify-center shadow-[0_0_40px_rgba(0,240,255,0.9)] mb-4 animate-bounce">
            <span className="text-4xl">💿</span>
          </div>

          <div className="flex items-center space-x-1.5 text-[#00F0FF] text-xs font-mono font-black uppercase tracking-widest mb-1">
            <span className="text-sm">🎮</span>
            <span>DUALSHOCK 2 CACHE ACTIVE</span>
            <span className="text-sm">💿</span>
          </div>

          <h1 className="text-2xl sm:text-4xl font-black text-transparent bg-clip-text bg-gradient-to-r from-[#00F0FF] via-white to-[#006FCD] tracking-wide uppercase mb-2 drop-shadow-[0_2px_10px_rgba(0,240,255,0.9)] font-mono">
            128-BIT OVERCLOCK!
          </h1>

          <p className="text-cyan-100 text-xs sm:text-sm mb-6 leading-relaxed font-mono">
            Optical DVD laser seeks at 294 MHz! All 40 paylines supercharged at <span className="text-[#00F0FF] font-black">2X OVERCLOCK</span> with DualShock Wilds and Memory Card re-triggers!
          </p>

          {/* Feature stats in PS2 Memory Card / BIOS readout */}
          <div className="grid grid-cols-2 gap-3 w-full mb-6 font-mono">
            <div className="bg-[#020917] border-2 border-[#006FCD]/70 p-3 rounded-2xl flex flex-col items-center shadow-inner">
              <span className="text-[10px] text-cyan-400 font-black uppercase tracking-wider">Free Spins</span>
              <span className="text-3xl font-black text-white">{freeSpinsAwarded}</span>
            </div>
            <div className="bg-[#020917] border-2 border-[#00F0FF]/70 p-3 rounded-2xl flex flex-col items-center shadow-inner">
              <span className="text-[10px] text-[#00F0FF] font-black uppercase tracking-wider">Clock Boost</span>
              <span className="text-3xl font-black text-cyan-200">{multiplier}X</span>
            </div>
          </div>

          {/* Start button */}
          <button
            onClick={() => {
              soundManager.playButtonClick();
              onStart();
            }}
            className="w-full py-3.5 rounded-2xl font-black text-base uppercase tracking-wider text-white bg-gradient-to-r from-[#00478F] via-[#006FCD] to-[#00A3FF] hover:from-[#005bb8] hover:to-[#00F0FF] border-2 border-[#00F0FF] shadow-[0_0_35px_rgba(0,111,205,0.9)] hover:scale-105 active:scale-95 transition-transform flex items-center justify-center space-x-2 font-mono"
          >
            <span>BOOT EMOTION ENGINE SPINS</span>
            <span className="px-2 py-0.5 rounded bg-black/40 text-[11px] font-mono tracking-tight font-bold">SPACE</span>
          </button>
        </div>
      </div>
    );
  }

  // =========================================================================
  // --- VERSION D: 24K VAULT (MOLTEN VAULT OVERDRIVE) ---
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
