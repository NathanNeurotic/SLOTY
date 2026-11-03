import React, { useMemo } from 'react';
import type { CasinoSceneId } from './SceneTypes';
import type { GameId } from '../../games/types';

interface SceneBackdropProps {
  sceneId: CasinoSceneId;
  activeGameId?: GameId;
}

export const SceneBackdrop: React.FC<SceneBackdropProps> = ({ sceneId, activeGameId = 'vault-24k' }) => {
  const isTimber = activeGameId === 'timber-critters';
  const isPixel = activeGameId === 'pixel-arcade';
  const isPs2 = activeGameId === 'ps2-legends';

  // 32 animated ambient particles (fireflies, gold dust motes, 8-bit pixel cubes, PS2 BIOS crystals)
  const particles = useMemo(() => {
    return Array.from({ length: 32 }).map((_, i) => ({
      id: i,
      left: `${(i * 3.1 + 2) % 96}%`,
      top: `${(i * 3.7 + 6) % 90}%`,
      size: isPs2 ? 2.5 + (i % 3) * 2 : isPixel ? 3 + (i % 3) * 2 : isTimber ? 2.5 + (i % 3) * 1.5 : 2 + (i % 3) * 1.5,
      delay: `${(i * 0.25) % 3.5}s`,
      duration: `${3.2 + (i % 4) * 0.9}s`,
      color: isPs2
        ? i % 5 === 0
          ? '#00F0FF' // Crystalline BIOS Cyan
          : i % 5 === 1
          ? '#006FCD' // PlayStation Cobalt Blue
          : i % 5 === 2
          ? '#A78BFA' // Lavender BIOS Mist
          : i % 5 === 3
          ? '#24B059' // DualShock Green
          : '#E61A22' // DualShock Crimson
        : isPixel
        ? i % 5 === 0
          ? '#00F0FF' // Neon Cyan
          : i % 5 === 1
          ? '#FF007F' // Hot Magenta
          : i % 5 === 2
          ? '#39FF14' // Phosphor Green
          : i % 5 === 3
          ? '#FFE600' // Arcade Amber
          : '#B026FF' // Ultraviolet
        : isTimber
        ? i % 4 === 0
          ? '#F59E0B' // Golden Firefly
          : i % 4 === 1
          ? '#10B981' // Emerald Spore
          : i % 4 === 2
          ? '#34D399' // Bright Moss
          : '#FBBF24' // Honey Glow
        : sceneId === 'VAULT'
        ? i % 3 === 0
          ? '#FDE047' // 24K Gold
          : i % 3 === 1
          ? '#00F0FF' // Security Cyan
          : '#FFFFFF' // Diamond Glint
        : sceneId === 'PENTHOUSE'
        ? i % 2 === 0
          ? '#C084FC'
          : '#38BDF8'
        : sceneId === 'MINT'
        ? i % 2 === 0
          ? '#F87171'
          : '#FBBF24'
        : i % 2 === 0
        ? '#00F0FF'
        : '#EF4444',
    }));
  }, [sceneId, isTimber, isPixel, isPs2]);

  // 26 twinkling night sky stars for Timberland
  const stars = useMemo(() => {
    return Array.from({ length: 26 }).map((_, i) => ({
      id: i,
      left: `${(i * 4.3 + 3) % 94}%`,
      top: `${(i * 3.2 + 2) % 45}%`,
      size: 1 + (i % 3) * 0.8,
      delay: `${(i * 0.45) % 4.0}s`,
      duration: `${2.2 + (i % 3) * 1.2}s`,
    }));
  }, []);

  return (
    <div className="fixed inset-0 pointer-events-none overflow-hidden z-0 select-none">
      {/* ========================================================= */}
      {/* --- PLAYSTATION 2: BIOS DEEP OCEAN MONOLITH VOID --- */}
      {/* ========================================================= */}
      {isPs2 ? (
        <>
          {/* Deep Endless BIOS Ocean Void Radial Base */}
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_50%_65%,_#001838_0%,_#000a1c_45%,_#000105_100%)]" />

          {/* Vanishing 3D Ocean Perspective Floor Grid */}
          <div className="absolute inset-x-0 bottom-0 h-3/5 overflow-hidden pointer-events-none opacity-30">
            <div className="w-full h-full" style={{ perspective: '300px' }}>
              <div
                className="w-full h-[220%] origin-bottom"
                style={{
                  transform: 'rotateX(72deg)',
                  backgroundImage:
                    'linear-gradient(to right, rgba(0, 111, 205, 0.35) 1px, transparent 1px), linear-gradient(to bottom, rgba(0, 240, 255, 0.25) 1px, transparent 1px)',
                  backgroundSize: '48px 48px',
                }}
              />
            </div>
          </div>

          {/* Ambient BIOS Radiant Ocean Fog Swell */}
          <div className="absolute top-[40%] inset-x-0 h-48 bg-gradient-to-t from-transparent via-[#004B93]/20 to-transparent blur-3xl pointer-events-none" />
          <div className="absolute top-[52%] left-1/2 -translate-x-1/2 w-[700px] h-32 bg-[radial-gradient(ellipse_at_center,_rgba(0,240,255,0.18)_0%,_transparent_70%)] blur-2xl pointer-events-none" />

          {/* Left Flank: Towering 3D Glass Save Monoliths */}
          <div className="absolute left-2 sm:left-6 md:left-12 bottom-6 w-32 sm:w-48 md:w-60 h-[480px] pointer-events-none opacity-85 hidden sm:block">
            {/* Monolith 1: Giant Rear Tower */}
            <div
              className="absolute left-0 bottom-0 w-14 sm:w-18 h-[360px] bg-gradient-to-t from-[#000d1e] via-[#002852]/80 to-[#0055a5]/30 border border-[#006FCD]/50 shadow-[0_0_25px_rgba(0,111,205,0.4)] backdrop-blur-xs"
              style={{ clipPath: 'polygon(0 8px, 8px 0, 100% 0, 100% 100%, 0 100%)' }}
            >
              <div className="absolute top-2 inset-x-1 h-0.5 bg-[#00F0FF]/60 shadow-[0_0_6px_#00F0FF]" />
              <div className="absolute top-0 right-0 w-2 h-full bg-[#00F0FF]/10" />
            </div>

            {/* Monolith 2: Tall Mid Tower */}
            <div
              className="absolute left-10 sm:left-14 bottom-0 w-16 sm:w-20 h-[420px] bg-gradient-to-t from-[#000a18] via-[#003874]/80 to-[#00F0FF]/25 border border-[#00F0FF]/60 shadow-[0_0_35px_rgba(0,240,255,0.3)] animate-pulse"
              style={{ clipPath: 'polygon(0 12px, 12px 0, 100% 0, 100% 100%, 0 100%)', animationDuration: '4.5s' }}
            >
              <div className="absolute top-3 inset-x-2 h-0.5 bg-[#00F0FF] shadow-[0_0_8px_#00F0FF]" />
              <div className="absolute bottom-6 left-2 text-[7px] font-mono text-[#00F0FF]/70 tracking-widest -rotate-90">
                DATA 01
              </div>
            </div>

            {/* Monolith 3: Low Foreground Pillar */}
            <div
              className="absolute left-24 sm:left-32 bottom-0 w-12 sm:w-16 h-[220px] bg-gradient-to-t from-[#000e20] via-[#002244]/90 to-[#006FCD]/40 border border-[#006FCD]/60 shadow-[0_0_20px_rgba(0,111,205,0.5)]"
              style={{ clipPath: 'polygon(0 8px, 8px 0, 100% 0, 100% 100%, 0 100%)' }}
            >
              <div className="absolute top-2 inset-x-1 h-0.5 bg-[#00F0FF]/80" />
            </div>
          </div>

          {/* Right Flank: Towering 3D Glass Save Monoliths */}
          <div className="absolute right-2 sm:right-6 md:right-12 bottom-6 w-32 sm:w-48 md:w-60 h-[480px] pointer-events-none opacity-85 hidden sm:block">
            {/* Monolith 1: Low Foreground Pillar */}
            <div
              className="absolute right-24 sm:right-32 bottom-0 w-12 sm:w-16 h-[240px] bg-gradient-to-t from-[#000e20] via-[#002244]/90 to-[#006FCD]/40 border border-[#006FCD]/60 shadow-[0_0_20px_rgba(0,111,205,0.5)]"
              style={{ clipPath: 'polygon(0 0, calc(100% - 8px) 0, 100% 8px, 100% 100%, 0 100%)' }}
            >
              <div className="absolute top-2 inset-x-1 h-0.5 bg-[#00F0FF]/80" />
            </div>

            {/* Monolith 2: Tall Mid Tower */}
            <div
              className="absolute right-10 sm:right-14 bottom-0 w-16 sm:w-20 h-[440px] bg-gradient-to-t from-[#000a18] via-[#003874]/80 to-[#00F0FF]/25 border border-[#00F0FF]/60 shadow-[0_0_35px_rgba(0,240,255,0.3)] animate-pulse"
              style={{ clipPath: 'polygon(0 0, calc(100% - 12px) 0, 100% 12px, 100% 100%, 0 100%)', animationDuration: '5.2s' }}
            >
              <div className="absolute top-3 inset-x-2 h-0.5 bg-[#00F0FF] shadow-[0_0_8px_#00F0FF]" />
              <div className="absolute bottom-6 right-2 text-[7px] font-mono text-[#00F0FF]/70 tracking-widest rotate-90">
                SYSTEM DATA
              </div>
            </div>

            {/* Monolith 3: Giant Rear Tower */}
            <div
              className="absolute right-0 bottom-0 w-14 sm:w-18 h-[340px] bg-gradient-to-t from-[#000d1e] via-[#002852]/80 to-[#0055a5]/30 border border-[#006FCD]/50 shadow-[0_0_25px_rgba(0,111,205,0.4)]"
              style={{ clipPath: 'polygon(0 0, calc(100% - 8px) 0, 100% 8px, 100% 100%, 0 100%)' }}
            >
              <div className="absolute top-2 inset-x-1 h-0.5 bg-[#00F0FF]/60 shadow-[0_0_6px_#00F0FF]" />
            </div>
          </div>

          {/* Floating Subtle Ambient PlayStation Glyphs in Distance */}
          <div className="absolute top-24 left-[18%] pointer-events-none opacity-20 text-3xl font-mono text-[#24B059] animate-pulse">
            △
          </div>
          <div className="absolute top-36 right-[20%] pointer-events-none opacity-20 text-3xl font-mono text-[#E61A22] animate-pulse" style={{ animationDelay: '1.2s' }}>
            ○
          </div>
          <div className="absolute top-64 left-[24%] pointer-events-none opacity-15 text-3xl font-mono text-[#006FCD] animate-pulse" style={{ animationDelay: '2.5s' }}>
            ✕
          </div>
          <div className="absolute top-52 right-[25%] pointer-events-none opacity-15 text-3xl font-mono text-[#DF508E] animate-pulse" style={{ animationDelay: '1.8s' }}>
            □
          </div>

          {/* OSD Watermark Headers */}
          <div className="absolute top-3 left-4 sm:left-8 pointer-events-none opacity-40 flex items-center space-x-2 font-mono">
            <div className="w-1.5 h-1.5 rounded-full bg-[#00F0FF] shadow-[0_0_6px_#00F0FF] animate-ping" />
            <span className="text-[8px] sm:text-[9px] text-[#00F0FF] tracking-widest uppercase">
              SONY COMPUTER ENTERTAINMENT // BROWSER 1.00
            </span>
          </div>
          <div className="absolute top-3 right-4 sm:right-8 pointer-events-none opacity-40 flex items-center space-x-2 font-mono">
            <span className="text-[8px] sm:text-[9px] text-cyan-300 tracking-widest uppercase">
              EMOTION ENGINE 128-BIT // 294.912 MHz
            </span>
          </div>
        </>
      ) : isPixel ? (
        <>
          {/* Deep Retro 80s Arcade Cyber-Void Base */}
          <div className="absolute inset-0 bg-gradient-to-b from-[#060112] via-[#0d0422] to-[#04010a]" />

          {/* Synthwave Retrowave Horizon Sun with Slat Blinds */}
          <div className="absolute top-[18%] left-1/2 -translate-x-1/2 w-72 sm:w-96 h-72 sm:h-96 pointer-events-none opacity-80">
            {/* Glowing Radial Aura */}
            <div className="absolute inset-0 rounded-full bg-gradient-to-t from-[#FF007F] via-[#FF5500] to-[#FFE600] blur-xl opacity-50" />
            {/* Sun Disc */}
            <div className="relative w-full h-full rounded-full overflow-hidden bg-gradient-to-t from-[#FF007F] via-[#FF6600] to-[#FFE600] shadow-[0_0_80px_rgba(255,0,127,0.8),0_0_120px_rgba(255,230,0,0.5)]">
              {/* Horizontal Sun Slat Laser Cuts */}
              <div className="absolute bottom-6 inset-x-0 h-1.5 bg-[#0d0422]" />
              <div className="absolute bottom-11 inset-x-0 h-2 bg-[#0d0422]" />
              <div className="absolute bottom-18 inset-x-0 h-3 bg-[#0d0422]" />
              <div className="absolute bottom-27 inset-x-0 h-4 bg-[#0d0422]" />
              <div className="absolute bottom-38 inset-x-0 h-5 bg-[#0d0422]" />
            </div>
          </div>

          {/* Cyber Wireframe Mountain Silhouettes on Horizon */}
          <div className="absolute top-[32%] inset-x-0 h-40 pointer-events-none opacity-45">
            <svg viewBox="0 0 1440 200" className="w-full h-full object-cover" preserveAspectRatio="none">
              <path
                d="M 0 180 L 120 120 L 240 160 L 380 90 L 520 170 L 680 80 L 820 150 L 980 70 L 1140 160 L 1280 110 L 1440 180 L 1440 200 L 0 200 Z"
                fill="none"
                stroke="#FF007F"
                strokeWidth="2"
              />
              <path
                d="M 0 190 L 180 140 L 340 175 L 500 130 L 720 180 L 900 120 L 1080 170 L 1260 135 L 1440 190 L 1440 200 L 0 200 Z"
                fill="#0a0218"
                stroke="#00F0FF"
                strokeWidth="1.5"
                opacity="0.8"
              />
            </svg>
          </div>

          {/* 3D Perspective Wireframe Synthwave Grid Floor */}
          <div className="absolute inset-x-0 bottom-0 h-[48%] overflow-hidden pointer-events-none opacity-85">
            <div
              className="w-full h-full"
              style={{
                perspective: '450px',
                perspectiveOrigin: '50% 0%',
              }}
            >
              <div
                className="w-[200%] -ml-[50%] h-[200%] origin-top"
                style={{
                  transform: 'rotateX(75deg)',
                  backgroundImage: `
                    linear-gradient(to right, rgba(0, 240, 255, 0.45) 2px, transparent 2px),
                    linear-gradient(to bottom, rgba(255, 0, 127, 0.45) 2px, transparent 2px)
                  `,
                  backgroundSize: '60px 40px',
                  boxShadow: 'inset 0 0 80px rgba(0, 240, 255, 0.5)',
                }}
              />
            </div>
            {/* Horizon Glow Bar */}
            <div className="absolute top-0 inset-x-0 h-1.5 bg-gradient-to-r from-transparent via-[#00F0FF] to-transparent shadow-[0_0_20px_#00F0FF]" />
            <div className="absolute top-0 inset-x-0 h-10 bg-gradient-to-b from-[#00F0FF]/30 to-transparent blur-sm" />
          </div>

          {/* Left Flank: Vintage Arcade Cabinets Silhouette with Illuminated Marquees */}
          <div className="absolute left-0 bottom-12 w-64 sm:w-80 h-[520px] pointer-events-none opacity-90 hidden md:block">
            {/* Cabinet 1: Upright Coin-Op (Galaxy 1984) */}
            <div className="absolute left-2 bottom-0 w-44 h-[440px] bg-gradient-to-r from-[#030108] via-[#090314] to-[#040108] rounded-t-2xl border-r-2 border-t-2 border-purple-500/40 shadow-2xl">
              {/* Illuminated Marquee Header */}
              <div className="mx-3 mt-4 h-14 rounded-md bg-gradient-to-r from-pink-600 via-purple-600 to-cyan-500 p-0.5 border border-white/60 shadow-[0_0_25px_rgba(236,72,153,0.8)]">
                <div className="w-full h-full bg-black/80 rounded flex items-center justify-center">
                  <span className="text-[10px] font-black tracking-widest text-cyan-300 animate-pulse font-mono">
                    ★ GALAXY 1984 ★
                  </span>
                </div>
              </div>
              {/* CRT Monitor Bezel with 8-bit Attract Demo */}
              <div className="mx-4 mt-4 h-36 rounded-lg bg-[#020d0a] border-4 border-slate-900 shadow-[inset_0_0_20px_rgba(0,240,255,0.4)] p-1.5 overflow-hidden relative">
                <div className="absolute inset-0 bg-[linear-gradient(rgba(18,16,16,0)_50%,rgba(0,0,0,0.4)_50%)] bg-[length:100%_4px] pointer-events-none" />
                <div className="w-full h-full flex flex-col items-center justify-center text-center">
                  <span className="text-[8px] text-green-400 font-mono font-black animate-pulse">INSERT COIN</span>
                  <span className="text-[7px] text-yellow-300 font-mono mt-1">HIGH SCORE: 999,990</span>
                  <div className="flex space-x-1 mt-2 text-xs">👾 🚀 👾</div>
                </div>
              </div>
              {/* Coin Door with Glowing 25¢ Insert Slot */}
              <div className="mx-8 mt-6 h-28 rounded bg-[#0a0512] border border-white/10 p-2 flex flex-col items-center justify-center space-y-2">
                <div className="w-8 h-3 rounded-xs bg-red-600/80 border border-red-400 shadow-[0_0_8px_#ef4444] flex items-center justify-center">
                  <div className="w-4 h-0.5 bg-black" />
                </div>
                <span className="text-[7px] font-black text-amber-400 font-mono tracking-wider">25¢ PLAY</span>
              </div>
            </div>

            {/* Cabinet 2: Angled Wing Cabinet Behind */}
            <div className="absolute left-36 bottom-0 w-36 h-[380px] bg-gradient-to-r from-[#020106] to-[#080212] rounded-t-xl border-t border-r border-pink-500/30 opacity-70">
              <div className="mx-2 mt-4 h-10 rounded bg-gradient-to-r from-amber-500 to-red-600 p-0.5 shadow-[0_0_15px_rgba(245,158,11,0.6)]">
                <div className="w-full h-full bg-black/85 rounded flex items-center justify-center">
                  <span className="text-[8px] font-black text-amber-300 font-mono">BRAWLER II</span>
                </div>
              </div>
            </div>
          </div>

          {/* Right Flank: Vintage Arcade Cabinets Silhouette with Marquees */}
          <div className="absolute right-0 bottom-12 w-64 sm:w-80 h-[520px] pointer-events-none opacity-90 hidden md:block">
            {/* Cabinet 1: Upright Coin-Op (Cyber Quest) */}
            <div className="absolute right-2 bottom-0 w-44 h-[440px] bg-gradient-to-l from-[#030108] via-[#090314] to-[#040108] rounded-t-2xl border-l-2 border-t-2 border-pink-500/40 shadow-2xl">
              {/* Illuminated Marquee Header */}
              <div className="mx-3 mt-4 h-14 rounded-md bg-gradient-to-r from-cyan-500 via-purple-600 to-pink-600 p-0.5 border border-white/60 shadow-[0_0_25px_rgba(0,240,255,0.8)]">
                <div className="w-full h-full bg-black/80 rounded flex items-center justify-center">
                  <span className="text-[10px] font-black tracking-widest text-pink-300 animate-pulse font-mono">
                    ★ CYBER QUEST ★
                  </span>
                </div>
              </div>
              {/* CRT Monitor Bezel with 8-bit Attract Demo */}
              <div className="mx-4 mt-4 h-36 rounded-lg bg-[#0e0214] border-4 border-slate-900 shadow-[inset_0_0_20px_rgba(255,0,127,0.4)] p-1.5 overflow-hidden relative">
                <div className="absolute inset-0 bg-[linear-gradient(rgba(18,16,16,0)_50%,rgba(0,0,0,0.4)_50%)] bg-[length:100%_4px] pointer-events-none" />
                <div className="w-full h-full flex flex-col items-center justify-center text-center">
                  <span className="text-[8px] text-pink-400 font-mono font-black animate-pulse">PRESS START</span>
                  <span className="text-[7px] text-cyan-300 font-mono mt-1">PLAYER 1 READY</span>
                  <div className="flex space-x-1 mt-2 text-xs">🕹️ ⭐ 🕹️</div>
                </div>
              </div>
              {/* Coin Door with Glowing 25¢ Insert Slot */}
              <div className="mx-8 mt-6 h-28 rounded bg-[#0a0512] border border-white/10 p-2 flex flex-col items-center justify-center space-y-2">
                <div className="w-8 h-3 rounded-xs bg-cyan-500/80 border border-cyan-300 shadow-[0_0_8px_#00F0FF] flex items-center justify-center">
                  <div className="w-4 h-0.5 bg-black" />
                </div>
                <span className="text-[7px] font-black text-cyan-300 font-mono tracking-wider">25¢ PLAY</span>
              </div>
            </div>

            {/* Cabinet 2: Angled Wing Cabinet Behind */}
            <div className="absolute right-36 bottom-0 w-36 h-[380px] bg-gradient-to-l from-[#020106] to-[#080212] rounded-t-xl border-t border-l border-cyan-500/30 opacity-70">
              <div className="mx-2 mt-4 h-10 rounded bg-gradient-to-r from-emerald-500 to-cyan-500 p-0.5 shadow-[0_0_15px_rgba(16,185,129,0.6)]">
                <div className="w-full h-full bg-black/85 rounded flex items-center justify-center">
                  <span className="text-[8px] font-black text-emerald-300 font-mono">PIXEL RACER</span>
                </div>
              </div>
            </div>
          </div>

          {/* Overhead Retro Neon Arcade Signage */}
          <div className="absolute top-4 left-6 sm:left-12 pointer-events-none opacity-80">
            <div className="px-3 py-1 rounded-md border-2 border-pink-500 bg-purple-950/80 shadow-[0_0_20px_#FF007F]">
              <span className="text-xs sm:text-sm font-black text-pink-300 font-mono tracking-widest animate-pulse">
                RETRO ARCADE 1989
              </span>
            </div>
          </div>
          <div className="absolute top-4 right-6 sm:right-12 pointer-events-none opacity-80">
            <div className="px-3 py-1 rounded-md border-2 border-cyan-400 bg-cyan-950/80 shadow-[0_0_20px_#00F0FF]">
              <span className="text-xs sm:text-sm font-black text-cyan-300 font-mono tracking-widest animate-pulse">
                LEVEL 99 HIGH-SCORES
              </span>
            </div>
          </div>
        </>
      ) : isTimber ? (
        <>
          {/* Deep Twilight Evergreen Night Sky Base */}
          <div className="absolute inset-0 bg-gradient-to-b from-[#010e05] via-[#041a0e] to-[#010803]" />

          {/* Twinkling Night Sky Stars */}
          <div className="absolute inset-x-0 top-0 h-1/2 pointer-events-none">
            {stars.map((s) => (
              <div
                key={s.id}
                className="absolute rounded-full bg-yellow-100 animate-star-twinkle"
                style={{
                  left: s.left,
                  top: s.top,
                  width: `${s.size}px`,
                  height: `${s.size}px`,
                  boxShadow: '0 0 6px rgba(254,240,138,0.9)',
                  animationDelay: s.delay,
                  animationDuration: s.duration,
                }}
              />
            ))}

            {/* Diagonal Shooting Star */}
            <div className="absolute top-10 left-12 w-20 h-[1.5px] bg-gradient-to-r from-transparent via-yellow-100 to-white shadow-[0_0_10px_#FEF08A] transform -rotate-25 animate-shooting-star pointer-events-none" />
          </div>

          {/* Luminous Full Forest Moon with Atmospheric Pulse */}
          <div className="absolute top-5 right-12 sm:right-28 w-28 sm:w-36 h-28 sm:h-36 rounded-full bg-gradient-to-br from-[#FFFBEB] via-[#FEF08A] to-[#F59E0B] shadow-[0_0_70px_rgba(254,240,138,0.7),0_0_140px_rgba(245,158,11,0.4)] pointer-events-none opacity-90 animate-pulse" style={{ animationDuration: '6s' }}>
            <div className="absolute top-5 left-7 w-6 h-6 rounded-full bg-[#EAB308]/20" />
            <div className="absolute top-12 left-14 w-8 h-8 rounded-full bg-[#EAB308]/25" />
            <div className="absolute top-18 left-8 w-5 h-5 rounded-full bg-[#EAB308]/15" />
          </div>

          {/* Drifting Translucent Moonlit Clouds */}
          <div className="absolute top-8 right-8 sm:right-20 w-44 sm:w-56 h-16 pointer-events-none opacity-45 animate-cloud-drift">
            <div className="w-full h-full bg-gradient-to-r from-transparent via-emerald-100/30 to-transparent blur-md rounded-full" />
          </div>
          <div className="absolute top-16 right-16 sm:right-32 w-36 sm:w-48 h-12 pointer-events-none opacity-35 animate-cloud-drift" style={{ animationDelay: '-12s', animationDuration: '40s' }}>
            <div className="w-full h-full bg-gradient-to-r from-transparent via-teal-200/25 to-transparent blur-md rounded-full" />
          </div>

          {/* Moonlight Volumetric Light Shafts */}
          <div
            className="absolute -top-12 right-16 sm:right-36 w-[620px] h-[850px] pointer-events-none opacity-30 transform rotate-25 animate-pulse"
            style={{
              background: 'radial-gradient(ellipse at 50% 0%, rgba(254, 240, 138, 0.45) 0%, rgba(52, 211, 153, 0.18) 45%, transparent 75%)',
              animationDuration: '8s',
            }}
          />

          {/* Distant Mountain Ridges & Dense Pine Silhouettes */}
          <div className="absolute bottom-0 left-0 right-0 h-[420px] opacity-65 pointer-events-none">
            <svg viewBox="0 0 1440 420" className="w-full h-full object-cover" preserveAspectRatio="none">
              <path
                d="M0 240 Q180 140 380 230 Q600 110 840 210 Q1060 120 1260 220 L1440 160 L1440 420 L0 420 Z"
                fill="#072417"
              />
              <path
                d="M0 290 L30 250 L60 295 L100 240 L140 290 L180 235 L220 295 L270 245 L320 300 L370 230 L420 290 L480 240 L540 300 L600 235 L660 295 L720 240 L780 300 L840 230 L900 295 L960 245 L1020 300 L1080 235 L1140 290 L1200 240 L1260 300 L1320 235 L1380 290 L1440 240 L1440 420 L0 420 Z"
                fill="#04180d"
              />
              <path
                d="M0 340 L40 290 L80 345 L130 280 L180 340 L240 285 L300 350 L360 275 L420 345 L490 280 L560 350 L630 270 L700 345 L770 285 L840 350 L910 275 L980 345 L1050 280 L1120 350 L1190 270 L1260 345 L1330 285 L1400 345 L1440 295 L1440 420 L0 420 Z"
                fill="#020c05"
              />
            </svg>
          </div>

          {/* Cozy Mountain Log Cabin on Left Ridge with Glowing Windows and Chimney Smoke */}
          <div className="absolute bottom-28 left-4 sm:left-14 w-28 sm:w-36 h-28 pointer-events-none opacity-85 z-10 hidden md:block">
            {/* Cabin Structure */}
            <div className="relative w-full h-full">
              {/* Chimney with rising animated woodsmoke */}
              <div className="absolute -top-6 right-6 w-3 h-8 bg-[#2d1b10] border-t border-amber-800/80 rounded-t" />
              <div className="absolute -top-12 right-6 w-4 h-6 rounded-full bg-amber-100/30 blur-xs animate-smoke-curl" />
              <div className="absolute -top-16 right-5 w-6 h-8 rounded-full bg-slate-200/20 blur-sm animate-smoke-curl" style={{ animationDelay: '1.2s' }} />

              {/* Cabin Roof */}
              <div className="w-0 h-0 border-l-[56px] border-l-transparent border-r-[56px] border-r-transparent border-b-[36px] border-b-[#3e1d0b] drop-shadow-lg mx-auto" />
              {/* Cabin Body */}
              <div className="w-24 h-16 bg-[#261207] border-2 border-[#54280f] rounded-b-md mx-auto relative p-1">
                {/* Glowing Lantern Windows */}
                <div className="flex justify-around items-center pt-2">
                  <div className="w-5 h-6 rounded bg-gradient-to-b from-amber-200 to-yellow-500 shadow-[0_0_15px_rgba(251,191,36,0.9)] animate-pulse" style={{ animationDuration: '3s' }} />
                  <div className="w-5 h-6 rounded bg-gradient-to-b from-amber-200 to-yellow-500 shadow-[0_0_15px_rgba(251,191,36,0.9)] animate-pulse" style={{ animationDuration: '4s', animationDelay: '1s' }} />
                </div>
              </div>
            </div>
          </div>

          {/* Campfire on Right Ridge with Glowing Embers */}
          <div className="absolute bottom-28 right-6 sm:right-16 w-20 h-20 pointer-events-none opacity-85 z-10 hidden md:block">
            <div className="relative w-full h-full flex flex-col items-center justify-end">
              {/* Fire Flame */}
              <div className="w-8 h-10 rounded-full bg-gradient-to-t from-red-600 via-amber-500 to-yellow-200 blur-[1px] animate-pulse shadow-[0_0_20px_rgba(245,158,11,0.9)]" style={{ animationDuration: '1.5s' }} />
              {/* Logs */}
              <div className="w-12 h-3 bg-[#3e1d0b] rounded-full border border-black -mt-1" />
              {/* Sparks rising */}
              <div className="absolute -top-4 w-1.5 h-1.5 rounded-full bg-yellow-300 shadow-[0_0_8px_#FDE047] animate-float-sparkle" />
              <div className="absolute -top-8 right-4 w-1 h-1 rounded-full bg-amber-400 shadow-[0_0_6px_#F59E0B] animate-float-sparkle" style={{ animationDelay: '0.8s' }} />
            </div>
          </div>

          {/* Ancient Redwood Trunks Framing Borders with Swaying Pine Boughs and Hanging Lanterns */}
          {/* Left Trunk & Hanging Lantern */}
          <div className="absolute top-0 bottom-0 left-0 w-16 sm:w-40 pointer-events-none z-10 opacity-90">
            <div className="w-full h-full bg-gradient-to-r from-[#170a04] via-[#2c1308] to-transparent border-r border-[#451a03]/40 shadow-[10px_0_30px_rgba(0,0,0,0.85)] relative">
              <div className="absolute inset-0 opacity-40 bg-[repeating-linear-gradient(90deg,transparent,transparent_8px,rgba(0,0,0,0.6)_8px,rgba(0,0,0,0.6)_14px)]" />

              {/* Overhanging Swaying Pine Branches from Left */}
              <div className="absolute top-6 -right-20 w-36 h-72 animate-branch-sway-left overflow-visible">
                <svg viewBox="0 0 120 240" className="w-full h-full overflow-visible opacity-90 drop-shadow-[0_4px_12px_rgba(0,0,0,0.9)]">
                  <path d="M0 40 Q50 60 90 90 Q60 85 40 100 Q80 115 110 140 Q70 135 50 150 Q90 170 120 200" fill="none" stroke="#041a0d" strokeWidth="10" strokeLinecap="round" />
                  <path d="M0 40 Q50 60 90 90 Q60 85 40 100 Q80 115 110 140 Q70 135 50 150 Q90 170 120 200" fill="none" stroke="#15803d" strokeWidth="5" strokeLinecap="round" />
                  <circle cx="90" cy="90" r="14" fill="#14532d" opacity="0.8" />
                  <circle cx="110" cy="140" r="16" fill="#166534" opacity="0.8" />
                  <circle cx="120" cy="200" r="18" fill="#14532d" opacity="0.8" />
                </svg>

                {/* Hanging Rustic Iron Lantern from branch */}
                <div className="absolute top-36 left-24 w-8 h-12 flex flex-col items-center">
                  {/* Iron chain */}
                  <div className="w-[1.5px] h-6 bg-stone-700 shadow-sm" />
                  {/* Lantern Housing */}
                  <div className="w-6 h-8 rounded-md bg-[#261207] border-2 border-amber-600/80 shadow-[0_0_20px_rgba(245,158,11,0.9)] flex items-center justify-center relative overflow-hidden animate-lantern-flicker">
                    <div className="w-3 h-4 rounded-full bg-gradient-to-t from-red-500 via-amber-400 to-yellow-200 shadow-[0_0_12px_#FBBF24]" />
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Right Trunk & Hanging Lantern */}
          <div className="absolute top-0 bottom-0 right-0 w-16 sm:w-40 pointer-events-none z-10 opacity-90">
            <div className="w-full h-full bg-gradient-to-l from-[#170a04] via-[#2c1308] to-transparent border-l border-[#451a03]/40 shadow-[-10px_0_30px_rgba(0,0,0,0.85)] relative">
              <div className="absolute inset-0 opacity-40 bg-[repeating-linear-gradient(90deg,transparent,transparent_8px,rgba(0,0,0,0.6)_8px,rgba(0,0,0,0.6)_14px)]" />

              {/* Overhanging Swaying Pine Branches from Right */}
              <div className="absolute top-16 -left-20 w-36 h-72 animate-branch-sway-right overflow-visible transform -scale-x-100">
                <svg viewBox="0 0 120 240" className="w-full h-full overflow-visible opacity-90 drop-shadow-[0_4px_12px_rgba(0,0,0,0.9)]">
                  <path d="M0 40 Q50 60 90 90 Q60 85 40 100 Q80 115 110 140 Q70 135 50 150 Q90 170 120 200" fill="none" stroke="#041a0d" strokeWidth="10" strokeLinecap="round" />
                  <path d="M0 40 Q50 60 90 90 Q60 85 40 100 Q80 115 110 140 Q70 135 50 150 Q90 170 120 200" fill="none" stroke="#15803d" strokeWidth="5" strokeLinecap="round" />
                  <circle cx="90" cy="90" r="14" fill="#14532d" opacity="0.8" />
                  <circle cx="110" cy="140" r="16" fill="#166534" opacity="0.8" />
                  <circle cx="120" cy="200" r="18" fill="#14532d" opacity="0.8" />
                </svg>

                {/* Hanging Rustic Iron Lantern */}
                <div className="absolute top-36 left-24 w-8 h-12 flex flex-col items-center">
                  <div className="w-[1.5px] h-6 bg-stone-700 shadow-sm" />
                  <div className="w-6 h-8 rounded-md bg-[#261207] border-2 border-amber-600/80 shadow-[0_0_20px_rgba(245,158,11,0.9)] flex items-center justify-center relative overflow-hidden animate-lantern-flicker">
                    <div className="w-3 h-4 rounded-full bg-gradient-to-t from-red-500 via-amber-400 to-yellow-200 shadow-[0_0_12px_#FBBF24]" />
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Rolling Multi-Layer Valley Ground Mist / Fog */}
          <div className="absolute bottom-12 left-0 right-0 h-44 overflow-hidden pointer-events-none opacity-45">
            <div className="w-[200%] h-full flex animate-fog-scroll-slow">
              <div className="w-1/2 h-full bg-gradient-to-t from-[#021308] via-emerald-950/40 to-transparent blur-lg" />
              <div className="w-1/2 h-full bg-gradient-to-t from-[#021308] via-emerald-950/40 to-transparent blur-lg" />
            </div>
          </div>
          <div className="absolute bottom-6 left-0 right-0 h-32 overflow-hidden pointer-events-none opacity-35">
            <div className="w-[200%] h-full flex animate-fog-scroll-fast">
              <div className="w-1/2 h-full bg-gradient-to-t from-[#010a04] via-teal-950/30 to-transparent blur-md" />
              <div className="w-1/2 h-full bg-gradient-to-t from-[#010a04] via-teal-950/30 to-transparent blur-md" />
            </div>
          </div>
        </>
      ) : (
        <>
          {/* ========================================================================= */}
          {/* --- SCENE 1: THE FORT KNOX GOLD VAULT (FORTIFIED BULLION DEPOSITORY) --- */}
          {/* ========================================================================= */}
          {sceneId === 'VAULT' && (
            <>
              {/* Deep Industrial Titanium Steel & Obsidian Vault Chamber Base */}
              <div className="absolute inset-0 bg-gradient-to-b from-[#050b11] via-[#09131d] to-[#020508]" />

              {/* Overhead Industrial Steel Ceiling Girder with Caution Striping */}
              <div className="absolute top-0 inset-x-0 h-9 bg-gradient-to-b from-stone-900 via-slate-900 to-black border-b-2 border-yellow-600/50 shadow-2xl flex items-center justify-between px-6 z-10">
                <div className="flex items-center space-x-2">
                  <div className="w-2.5 h-2.5 rounded-full bg-emerald-400 shadow-[0_0_8px_#34D399] animate-pulse" />
                  <span className="text-[10px] font-mono font-black text-amber-300 tracking-widest uppercase">
                    SLOTY 24K IMPERIAL DEPOSITORY • MAXIMUM SECURITY
                  </span>
                </div>
                <div className="hidden sm:flex items-center space-x-4 text-[9px] font-mono text-cyan-300/80">
                  <span>VAULT INTEGRITY: 100%</span>
                  <span>•</span>
                  <span>SURVEILLANCE: ONLINE</span>
                </div>
              </div>

              {/* Motorized Security Surveillance Cameras on Left & Right */}
              <div className="absolute top-9 left-12 w-8 h-10 pointer-events-none z-10 hidden sm:block">
                <div className="w-full h-full flex flex-col items-center animate-camera-pan">
                  <div className="w-1 h-3 bg-slate-600" />
                  <div className="w-7 h-4 bg-slate-900 border border-slate-500 rounded-sm flex items-center justify-end px-1 shadow-lg">
                    <div className="w-2 h-2 rounded-full bg-red-600 shadow-[0_0_8px_#EF4444] animate-ping" />
                  </div>
                </div>
              </div>
              <div className="absolute top-9 right-12 w-8 h-10 pointer-events-none z-10 hidden sm:block">
                <div className="w-full h-full flex flex-col items-center animate-camera-pan" style={{ animationDelay: '2.5s' }}>
                  <div className="w-1 h-3 bg-slate-600" />
                  <div className="w-7 h-4 bg-slate-900 border border-slate-500 rounded-sm flex items-center justify-start px-1 shadow-lg">
                    <div className="w-2 h-2 rounded-full bg-red-600 shadow-[0_0_8px_#EF4444] animate-ping" />
                  </div>
                </div>
              </div>

              {/* ===================================================================== */}
              {/* --- GIGANTIC FORT KNOX CIRCULAR VAULT DOOR (UPPER CENTER BACKDROP) --- */}
              {/* ===================================================================== */}
              <div className="absolute top-8 left-1/2 -translate-x-1/2 w-[480px] sm:w-[680px] h-[480px] sm:h-[680px] pointer-events-none opacity-80 z-0">
                <div className="relative w-full h-full flex items-center justify-center">
                  {/* Outer Armored Titanium Ring with 24 Radial Steel Locking Bolts */}
                  <div className="absolute inset-0 rounded-full border-[18px] border-slate-700/80 shadow-[0_0_60px_rgba(0,240,255,0.25),inset_0_0_50px_rgba(0,0,0,0.9)] bg-gradient-to-br from-slate-900 via-slate-950 to-black">
                    {/* Radial Hex Bolts around the circumference */}
                    {[...Array(16)].map((_, i) => (
                      <div
                        key={i}
                        className="absolute w-3.5 h-3.5 rounded-full bg-gradient-to-b from-slate-300 to-slate-600 border border-slate-400 shadow-md"
                        style={{
                          top: `${50 - 46 * Math.cos((i * 2 * Math.PI) / 16)}%`,
                          left: `${50 + 46 * Math.sin((i * 2 * Math.PI) / 16)}%`,
                          transform: 'translate(-50%, -50%)',
                        }}
                      />
                    ))}
                  </div>

                  {/* Outer Geared Locking Ring (Rotates Slow Clockwise) */}
                  <div className="absolute inset-10 rounded-full border-4 border-dashed border-yellow-500/40 animate-gear-spin-slow opacity-60" />

                  {/* Inner Counter-Rotating Geared Ring (Rotates Counter-Clockwise) */}
                  <div className="absolute inset-20 rounded-full border-4 border-dashed border-cyan-400/35 animate-gear-spin-reverse opacity-70" />

                  {/* Central Heavy Brass 6-Spoke Vault Wheel */}
                  <div className="relative w-40 sm:w-56 h-40 sm:h-56 rounded-full border-8 border-yellow-500 bg-gradient-to-tr from-amber-800 via-yellow-600 to-amber-700 shadow-[0_0_40px_rgba(245,158,11,0.6)] flex items-center justify-center animate-gear-spin-slow">
                    {/* 6 Radial Brass Spokes */}
                    {[...Array(6)].map((_, i) => (
                      <div
                        key={i}
                        className="absolute w-full h-3 bg-gradient-to-r from-amber-400 via-yellow-200 to-amber-400 rounded-sm shadow-md"
                        style={{ transform: `rotate(${i * 60}deg)` }}
                      />
                    ))}
                    {/* Center Hub */}
                    <div className="relative w-16 h-16 rounded-full bg-gradient-to-br from-yellow-200 via-amber-500 to-amber-900 border-4 border-yellow-100 shadow-2xl flex items-center justify-center z-10">
                      <div className="w-5 h-5 rounded-full bg-slate-950 border border-yellow-300 shadow-inner" />
                    </div>
                  </div>
                </div>
              </div>

              {/* ================================================================= */}
              {/* --- TOWERING SAFE DEPOSIT LOCKBOX WALLS (LEFT & RIGHT FLANKS) --- */}
              {/* ================================================================= */}
              {/* Left Wall of Brushed Steel Safe Deposit Boxes */}
              <div className="absolute top-9 bottom-0 left-0 w-24 sm:w-44 md:w-56 pointer-events-none z-10 opacity-70 hidden sm:block">
                <div className="w-full h-full bg-gradient-to-r from-slate-900 via-slate-950 to-transparent border-r border-slate-700/60 p-2 relative shadow-2xl">
                  {/* Grid of stainless steel deposit boxes with keyholes & handles */}
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-1.5 pt-2">
                    {[...Array(18)].map((_, i) => (
                      <div
                        key={i}
                        className="h-10 bg-gradient-to-b from-slate-800 via-slate-900 to-slate-950 border border-slate-600/70 rounded-xs flex flex-col justify-between p-1 shadow-md relative overflow-hidden"
                      >
                        <div className="flex justify-between items-center text-[7px] font-mono text-amber-300/80">
                          <span>BOX</span>
                          <span className="font-bold">{700 + i * 15}</span>
                        </div>
                        <div className="flex justify-between items-center px-1">
                          <div className="w-1.5 h-1.5 rounded-full bg-slate-950 border border-yellow-500/60" />
                          <div className="w-3 h-1 bg-amber-400/80 rounded-xs shadow-[0_0_4px_#F59E0B]" />
                        </div>
                      </div>
                    ))}
                  </div>
                  {/* Ambient Amber Downlight Wash */}
                  <div className="absolute top-0 inset-x-0 h-36 bg-gradient-to-b from-amber-500/20 to-transparent blur-md" />
                </div>
              </div>

              {/* Right Wall of Brushed Steel Safe Deposit Boxes */}
              <div className="absolute top-9 bottom-0 right-0 w-24 sm:w-44 md:w-56 pointer-events-none z-10 opacity-70 hidden sm:block">
                <div className="w-full h-full bg-gradient-to-l from-slate-900 via-slate-950 to-transparent border-l border-slate-700/60 p-2 relative shadow-2xl">
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-1.5 pt-2">
                    {[...Array(18)].map((_, i) => (
                      <div
                        key={i}
                        className="h-10 bg-gradient-to-b from-slate-800 via-slate-900 to-slate-950 border border-slate-600/70 rounded-xs flex flex-col justify-between p-1 shadow-md relative overflow-hidden"
                      >
                        <div className="flex justify-between items-center text-[7px] font-mono text-amber-300/80">
                          <span>BOX</span>
                          <span className="font-bold">{800 + i * 15}</span>
                        </div>
                        <div className="flex justify-between items-center px-1">
                          <div className="w-3 h-1 bg-amber-400/80 rounded-xs shadow-[0_0_4px_#F59E0B]" />
                          <div className="w-1.5 h-1.5 rounded-full bg-slate-950 border border-yellow-500/60" />
                        </div>
                      </div>
                    ))}
                  </div>
                  <div className="absolute top-0 inset-x-0 h-36 bg-gradient-to-b from-amber-500/20 to-transparent blur-md" />
                </div>
              </div>

              {/* Sweeping Dual High-Intensity Volumetric Spotlights */}
              <div
                className="absolute -bottom-20 left-[15%] w-[420px] h-[900px] pointer-events-none opacity-25 transform origin-bottom animate-spotlight-left"
                style={{
                  background: 'linear-gradient(to top, rgba(245, 158, 11, 0.5) 0%, rgba(254, 240, 138, 0.25) 40%, transparent 80%)',
                }}
              />
              <div
                className="absolute -bottom-20 right-[15%] w-[420px] h-[900px] pointer-events-none opacity-25 transform origin-bottom animate-spotlight-right"
                style={{
                  background: 'linear-gradient(to top, rgba(0, 240, 255, 0.4) 0%, rgba(56, 189, 248, 0.2) 40%, transparent 80%)',
                }}
              />

              {/* Stacks of 24K Gold Bullion on Heavy Pallets Flanking the Outer Edges */}
              <div className="absolute bottom-4 sm:bottom-8 left-1 sm:left-3 w-32 sm:w-44 h-36 pointer-events-none z-10 opacity-90 hidden sm:block">
                <div className="relative w-full h-full flex flex-col justify-end">
                  {/* Bullion stack pyramid */}
                  <div className="w-24 sm:w-28 h-6 bg-gradient-to-r from-amber-500 via-yellow-200 to-amber-600 rounded-xs border border-yellow-100 shadow-[0_0_20px_rgba(251,191,36,0.9)] mx-auto relative overflow-hidden">
                    <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/50 to-transparent animate-shimmer-sweep" />
                    <span className="absolute inset-0 flex items-center justify-center text-[7px] sm:text-[8px] font-mono font-black text-amber-950">999.9 FINE GOLD</span>
                  </div>
                  <div className="w-30 sm:w-36 h-6 bg-gradient-to-r from-amber-600 via-yellow-300 to-amber-700 rounded-xs border border-yellow-200 shadow-lg mx-auto relative overflow-hidden -mt-1">
                    <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent animate-shimmer-sweep" style={{ animationDelay: '1s' }} />
                  </div>
                  <div className="w-36 sm:w-42 h-6 bg-gradient-to-r from-amber-700 via-yellow-400 to-amber-800 rounded-xs border border-yellow-300 shadow-xl mx-auto -mt-1" />
                  {/* Steel pallet */}
                  <div className="w-40 sm:w-44 h-3 bg-slate-800 border-t border-slate-600 rounded-xs" />
                </div>
              </div>

              <div className="absolute bottom-4 sm:bottom-8 right-1 sm:right-3 w-32 sm:w-44 h-36 pointer-events-none z-10 opacity-90 hidden sm:block">
                <div className="relative w-full h-full flex flex-col justify-end">
                  <div className="w-24 sm:w-28 h-6 bg-gradient-to-r from-amber-500 via-yellow-200 to-amber-600 rounded-xs border border-yellow-100 shadow-[0_0_20px_rgba(251,191,36,0.9)] mx-auto relative overflow-hidden">
                    <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/50 to-transparent animate-shimmer-sweep" style={{ animationDelay: '1.5s' }} />
                    <span className="absolute inset-0 flex items-center justify-center text-[7px] sm:text-[8px] font-mono font-black text-amber-950">24K FORT KNOX</span>
                  </div>
                  <div className="w-30 sm:w-36 h-6 bg-gradient-to-r from-amber-600 via-yellow-300 to-amber-700 rounded-xs border border-yellow-200 shadow-lg mx-auto relative overflow-hidden -mt-1">
                    <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent animate-shimmer-sweep" style={{ animationDelay: '2.5s' }} />
                  </div>
                  <div className="w-36 sm:w-42 h-6 bg-gradient-to-r from-amber-700 via-yellow-400 to-amber-800 rounded-xs border border-yellow-300 shadow-xl mx-auto -mt-1" />
                  <div className="w-40 sm:w-44 h-3 bg-slate-800 border-t border-slate-600 rounded-xs" />
                </div>
              </div>

              {/* Biometric Security Laser Grid (Sweeping Vertically) */}
              <div className="absolute top-1/4 left-0 right-0 h-[2px] bg-gradient-to-r from-transparent via-cyan-400 to-transparent opacity-65 shadow-[0_0_15px_#00F0FF] animate-laser-scan-vert pointer-events-none flex items-center justify-center">
                <div className="w-3 h-3 rounded-full bg-cyan-300 shadow-[0_0_10px_#00F0FF] animate-ping" />
              </div>

              {/* Secondary Amber Security Laser Beam */}
              <div className="absolute top-2/3 left-0 right-0 h-[1.5px] bg-gradient-to-r from-transparent via-amber-400 to-transparent opacity-50 shadow-[0_0_12px_#F59E0B] pointer-events-none" />

              {/* Central Opulent Gold Ambient Corona */}
              <div
                className="absolute top-1/3 left-1/2 -translate-x-1/2 w-[700px] h-[400px] pointer-events-none opacity-45 animate-pulse"
                style={{
                  background: 'radial-gradient(circle, rgba(245, 158, 11, 0.3) 0%, rgba(16, 185, 129, 0.08) 50%, transparent 75%)',
                  animationDuration: '7s',
                }}
              />
            </>
          )}

          {/* ========================================================================= */}
          {/* --- SCENE 2: MIDNIGHT CASH PENTHOUSE (VIP CASINO STRIP SKYLINE) ---       */}
          {/* ========================================================================= */}
          {sceneId === 'PENTHOUSE' && (
            <>
              {/* Midnight Skyline Gradient */}
              <div className="absolute inset-0 bg-gradient-to-b from-[#0f0728] via-[#0c091f] to-[#04020a]" />

              {/* Sweeping Sky Searchlights */}
              <div
                className="absolute -bottom-10 left-[20%] w-[380px] h-[850px] pointer-events-none opacity-30 transform origin-bottom animate-spotlight-left"
                style={{ background: 'linear-gradient(to top, rgba(168, 85, 247, 0.5) 0%, transparent 80%)' }}
              />
              <div
                className="absolute -bottom-10 right-[20%] w-[380px] h-[850px] pointer-events-none opacity-30 transform origin-bottom animate-spotlight-right"
                style={{ background: 'linear-gradient(to top, rgba(56, 189, 248, 0.5) 0%, transparent 80%)' }}
              />

              {/* High-Roller Velvet Curtains with Gold Tassels Framing Left & Right Borders */}
              <div className="absolute top-0 bottom-0 left-0 w-20 sm:w-36 pointer-events-none z-10 opacity-80">
                <div className="w-full h-full bg-gradient-to-r from-[#3b0716] via-[#1f030a] to-transparent border-r-2 border-yellow-500/40 shadow-2xl relative">
                  <div className="absolute top-12 right-2 text-2xl select-none">🎗️</div>
                </div>
              </div>
              <div className="absolute top-0 bottom-0 right-0 w-20 sm:w-36 pointer-events-none z-10 opacity-80">
                <div className="w-full h-full bg-gradient-to-l from-[#3b0716] via-[#1f030a] to-transparent border-l-2 border-yellow-500/40 shadow-2xl relative">
                  <div className="absolute top-12 left-2 text-2xl select-none">🎗️</div>
                </div>
              </div>

              {/* Las Vegas Strip Casino Skyline Silhouette with Glowing Windows */}
              <div className="absolute bottom-0 left-0 right-0 h-80 opacity-55 flex items-end justify-around px-4 pointer-events-none">
                <div className="w-20 h-64 bg-slate-900 border-t-2 border-purple-400/80 relative shadow-2xl">
                  <div className="w-1.5 h-16 bg-amber-400 mx-auto -mt-16 shadow-[0_0_12px_#FBBF24]" />
                  <div className="grid grid-cols-2 gap-1.5 p-1.5 opacity-80">
                    {[...Array(8)].map((_, i) => (
                      <div key={i} className="w-2 h-2 rounded-xs bg-yellow-300 animate-pulse" style={{ animationDelay: `${i * 250}ms` }} />
                    ))}
                  </div>
                </div>
                <div className="w-32 h-72 bg-slate-950 border-t-2 border-cyan-400/80 shadow-2xl relative">
                  <div className="text-center pt-1 text-[8px] font-mono font-black text-cyan-300">CASINO VIP</div>
                  <div className="grid grid-cols-3 gap-1.5 p-2 opacity-75">
                    {[...Array(12)].map((_, i) => (
                      <div key={i} className="w-2 h-2 rounded-xs bg-cyan-300 animate-pulse" style={{ animationDelay: `${i * 200}ms` }} />
                    ))}
                  </div>
                </div>
                <div className="w-28 h-52 bg-slate-900 border-t-2 border-pink-400/80" />
                <div className="w-24 h-68 bg-slate-950 border-t-2 border-yellow-400/80" />
                <div className="w-36 h-56 bg-slate-900 border-t-2 border-purple-400/80 hidden sm:block" />
              </div>

              {/* Radial Penthouse Ambient Glow */}
              <div
                className="absolute top-1/3 left-1/2 -translate-x-1/2 w-[700px] h-[420px] pointer-events-none opacity-50"
                style={{
                  background: 'radial-gradient(circle, rgba(168, 85, 247, 0.35) 0%, rgba(245, 158, 11, 0.15) 50%, transparent 70%)',
                }}
              />
            </>
          )}

          {/* ========================================================================= */}
          {/* --- SCENE 3: THE FEDERAL CURRENCY MINT (INDUSTRIAL COIN FOUNDRY) ---     */}
          {/* ========================================================================= */}
          {sceneId === 'MINT' && (
            <>
              {/* Molten Metal Forge Gradient */}
              <div className="absolute inset-0 bg-gradient-to-b from-[#1a0505] via-[#140807] to-[#0a0302]" />

              {/* Massive Industrial Gear Wheels Silhouette in Background */}
              <div className="absolute top-12 left-10 w-56 h-56 rounded-full border-4 border-dashed border-red-500/35 animate-gear-spin-slow opacity-50 hidden sm:block" />
              <div className="absolute top-28 right-14 w-44 h-44 rounded-full border-4 border-dashed border-amber-500/30 animate-gear-spin-reverse opacity-45 hidden sm:block" />

              {/* Molten Gold River Heat Reflection at Bottom */}
              <div className="absolute bottom-0 left-0 right-0 h-36 bg-gradient-to-t from-red-600/40 via-amber-600/25 to-transparent animate-pulse" style={{ animationDuration: '4s' }} />

              {/* Forge Glow */}
              <div
                className="absolute top-1/3 left-1/2 -translate-x-1/2 w-[700px] h-[400px] pointer-events-none opacity-50"
                style={{
                  background: 'radial-gradient(circle, rgba(239, 68, 68, 0.32) 0%, rgba(245, 158, 11, 0.22) 50%, transparent 70%)',
                }}
              />
            </>
          )}

          {/* ========================================================================= */}
          {/* --- SCENE 4: HIGH STAKES HEIST (MIDNIGHT LASER TRIPWIRE BREACH) ---      */}
          {/* ========================================================================= */}
          {sceneId === 'HEIST' && (
            <>
              {/* Crimson & Electric Cyan Midnight Heist */}
              <div className="absolute inset-0 bg-gradient-to-b from-[#020b18] via-[#0f0408] to-[#040103]" />

              {/* Intersecting Security Laser Crosshairs */}
              <div className="absolute top-1/3 left-0 right-0 h-[2px] bg-gradient-to-r from-transparent via-cyan-400 to-transparent opacity-75 shadow-[0_0_15px_#00F0FF] animate-pulse" />
              <div className="absolute top-2/3 left-0 right-0 h-[2px] bg-gradient-to-r from-transparent via-red-500 to-transparent opacity-75 shadow-[0_0_15px_#EF4444] animate-pulse" style={{ animationDelay: '1s' }} />

              {/* Diagonal Alert Laser */}
              <div className="absolute top-0 left-1/4 w-[2px] h-full bg-gradient-to-b from-transparent via-red-500/60 to-transparent shadow-[0_0_12px_#EF4444]" />

              {/* Sweeping Blue Alarm Beacon */}
              <div
                className="absolute -bottom-10 left-1/2 -translate-x-1/2 w-[550px] h-[850px] pointer-events-none opacity-25 transform origin-bottom animate-spotlight-left"
                style={{ background: 'linear-gradient(to top, rgba(0, 240, 255, 0.45) 0%, transparent 75%)' }}
              />

              {/* Ambient Glow */}
              <div
                className="absolute top-1/3 left-1/2 -translate-x-1/2 w-[700px] h-[400px] pointer-events-none opacity-50"
                style={{
                  background: 'radial-gradient(circle, rgba(0, 240, 255, 0.25) 0%, rgba(239, 68, 68, 0.25) 50%, transparent 70%)',
                }}
              />
            </>
          )}
        </>
      )}

      {/* ========================================================================= */}
      {/* --- PHYSICAL CASINO & BOARDWALK GROUND FLOOR (Full Viewport Width) --- */}
      {/* ========================================================================= */}
      <div className="absolute inset-x-0 bottom-0 h-44 sm:h-56 pointer-events-none z-0 overflow-hidden">
        {isPixel ? (
          // Pixel Arcade 90s Geometric Neon Roller-Rink & Arcade Carpet
          <div className="w-full h-full bg-[#0a0318] relative border-t-2 border-purple-500/50 shadow-[inset_0_10px_30px_rgba(0,0,0,0.9)]">
            <svg viewBox="0 0 200 100" className="w-full h-full object-repeat opacity-45">
              <defs>
                <pattern id="carpet90s" width="40" height="40" patternUnits="userSpaceOnUse">
                  {/* Neon Cyan Geometric Triangles */}
                  <polygon points="6,6 18,10 10,22" fill="#00F0FF" />
                  {/* Hot Magenta Confetti Squiggles */}
                  <path d="M 24 6 Q 28 14 34 8 Q 38 18 30 22" fill="none" stroke="#FF007F" strokeWidth="2" strokeLinecap="round" />
                  {/* Electric Yellow Zigzags */}
                  <polygon points="4,28 12,24 10,36 18,32" fill="#FFE600" />
                  {/* Phosphor Lime Square Confetti */}
                  <rect x="26" y="28" width="5" height="5" fill="#39FF14" transform="rotate(25 28 30)" />
                  <rect x="34" y="32" width="3" height="3" fill="#FFF" />
                </pattern>
              </defs>
              <rect width="100%" height="100%" fill="url(#carpet90s)" />
            </svg>
            <div className="absolute bottom-0 inset-x-0 h-4 bg-gradient-to-r from-purple-900/60 via-pink-600/50 to-purple-900/60" />
          </div>
        ) : isTimber ? (
          // Timberland Hand-Hewn Rustic Boardwalk Floor
          <div className="w-full h-full bg-gradient-to-t from-[#0e0602] via-[#1b0d06] to-transparent relative border-t border-[#78350f]/40">
            <div className="absolute inset-0 opacity-30 bg-[repeating-linear-gradient(0deg,transparent,transparent_22px,#0a0401_22px,#0a0401_24px)]" />
            <div className="absolute inset-0 opacity-20 bg-[repeating-linear-gradient(90deg,transparent,transparent_60px,#2e1408_60px,#2e1408_62px)]" />
            <div className="absolute bottom-10 left-[12%] text-sm select-none opacity-85 animate-float-sparkle">🍂</div>
            <div className="absolute bottom-16 left-[28%] text-sm select-none opacity-85">🍁</div>
            <div className="absolute bottom-12 right-[25%] text-sm select-none opacity-85 animate-float-sparkle">🍂</div>
            <div className="absolute bottom-8 right-[10%] text-sm select-none opacity-85">🍁</div>
            <div className="absolute bottom-0 inset-x-0 h-3 bg-gradient-to-r from-emerald-950 via-emerald-800/40 to-emerald-950" />
          </div>
        ) : (
          // 24K Vault Luxury Las Vegas Red Velvet Diamond Trellis Carpet
          <div className="w-full h-full bg-gradient-to-t from-[#140202] via-[#240404] to-transparent relative border-t border-yellow-500/25">
            <svg viewBox="0 0 100 100" className="w-full h-full object-repeat opacity-30">
              <defs>
                <pattern id="carpetTrellis" width="24" height="24" patternUnits="userSpaceOnUse">
                  <path d="M 0 12 L 12 0 L 24 12 L 12 24 Z" fill="none" stroke="#FBBF24" strokeWidth="0.6" />
                  <circle cx="12" cy="12" r="1.5" fill="#EF4444" />
                </pattern>
              </defs>
              <rect width="100%" height="100%" fill="url(#carpetTrellis)" />
            </svg>
            <div className="absolute bottom-0 inset-x-0 h-4 bg-gradient-to-r from-amber-600/30 via-yellow-400/40 to-amber-600/30" />
          </div>
        )}
      </div>

      {/* Living Atmospheric Floating Particles (Fireflies / Stardust / Gold Dust) */}
      <div className="block">
        {particles.map((p) => (
          <div
            key={p.id}
            className="absolute rounded-full animate-float-sparkle pointer-events-none"
            style={{
              left: p.left,
              top: p.top,
              width: `${p.size}px`,
              height: `${p.size}px`,
              backgroundColor: p.color,
              boxShadow: `0 0 10px ${p.color}`,
              animationDelay: p.delay,
              animationDuration: p.duration,
            }}
          />
        ))}
      </div>
    </div>
  );
};
