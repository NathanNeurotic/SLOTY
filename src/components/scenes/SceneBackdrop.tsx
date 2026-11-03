import React, { useMemo } from 'react';
import type { CasinoSceneId } from './SceneTypes';
import type { GameId } from '../../games/types';

interface SceneBackdropProps {
  sceneId: CasinoSceneId;
  activeGameId?: GameId;
}

export const SceneBackdrop: React.FC<SceneBackdropProps> = ({ sceneId, activeGameId = 'vault-24k' }) => {
  const isTimber = activeGameId === 'timber-critters';

  // 28 animated ambient particles (fireflies, gold dust, diamond glints)
  const particles = useMemo(() => {
    return Array.from({ length: 28 }).map((_, i) => ({
      id: i,
      left: `${(i * 3.7 + 2) % 96}%`,
      top: `${(i * 4.1 + 8) % 88}%`,
      size: isTimber ? 2.5 + (i % 3) * 1.5 : 2 + (i % 3) * 1.5,
      delay: `${(i * 0.28) % 3.6}s`,
      duration: `${3.5 + (i % 4) * 0.8}s`,
      color: isTimber
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
  }, [sceneId, isTimber]);

  // 24 twinkling night sky stars for Timberland
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
      {/* --- TIMBERLAND CRITTERS: LIVING PACIFIC MOUNTAIN FOREST --- */}
      {/* ========================================================= */}
      {isTimber ? (
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
            {/* Lunar craters */}
            <div className="absolute top-5 left-7 w-6 h-6 rounded-full bg-[#EAB308]/20" />
            <div className="absolute top-12 left-14 w-8 h-8 rounded-full bg-[#EAB308]/25" />
            <div className="absolute top-18 left-8 w-5 h-5 rounded-full bg-[#EAB308]/15" />
          </div>

          {/* Drifting Translucent Moonlit Clouds Across Lunar Face */}
          <div className="absolute top-8 right-8 sm:right-20 w-44 sm:w-56 h-16 pointer-events-none opacity-45 animate-cloud-drift">
            <div className="w-full h-full bg-gradient-to-r from-transparent via-emerald-100/30 to-transparent blur-md rounded-full" />
          </div>
          <div className="absolute top-16 right-16 sm:right-32 w-36 sm:w-48 h-12 pointer-events-none opacity-35 animate-cloud-drift" style={{ animationDelay: '-12s', animationDuration: '40s' }}>
            <div className="w-full h-full bg-gradient-to-r from-transparent via-teal-200/25 to-transparent blur-md rounded-full" />
          </div>

          {/* Moonlight Volumetric Light Shafts Slicing Through Canopy */}
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
              {/* Mountain Ridge with Misty Valleys */}
              <path
                d="M0 240 Q180 140 380 230 Q600 110 840 210 Q1060 120 1260 220 L1440 160 L1440 420 L0 420 Z"
                fill="#072417"
              />
              {/* Mid Pine Tree Silhouettes Layer */}
              <path
                d="M0 290 L30 250 L60 295 L100 240 L140 290 L180 235 L220 295 L270 245 L320 300 L370 230 L420 290 L480 240 L540 300 L600 235 L660 295 L720 240 L780 300 L840 230 L900 295 L960 245 L1020 300 L1080 235 L1140 290 L1200 240 L1260 300 L1320 235 L1380 290 L1440 240 L1440 420 L0 420 Z"
                fill="#04180d"
              />
              {/* Foreground Dense Evergreen Crowns */}
              <path
                d="M0 340 L40 290 L80 345 L130 280 L180 340 L240 285 L300 350 L360 275 L420 345 L490 280 L560 350 L630 270 L700 345 L770 285 L840 350 L910 275 L980 345 L1050 280 L1120 350 L1190 270 L1260 345 L1330 285 L1400 345 L1440 295 L1440 420 L0 420 Z"
                fill="#020c05"
              />
            </svg>
          </div>

          {/* Towering Ancient Redwood Trunks Framing Left & Right Borders with Swaying Pine Boughs */}
          {/* Left Trunk & Swaying Boughs */}
          <div className="absolute top-0 bottom-0 left-0 w-16 sm:w-36 pointer-events-none z-10 opacity-80 sm:opacity-90">
            <div className="w-full h-full bg-gradient-to-r from-[#170a04] via-[#2c1308] to-transparent border-r border-[#451a03]/40 shadow-[10px_0_30px_rgba(0,0,0,0.85)] relative">
              <div className="absolute inset-0 opacity-40 bg-[repeating-linear-gradient(90deg,transparent,transparent_8px,rgba(0,0,0,0.6)_8px,rgba(0,0,0,0.6)_14px)]" />
              {/* Overhanging Swaying Pine Branches from Left */}
              <div className="absolute top-6 -right-20 w-36 h-72 animate-branch-sway-left overflow-visible">
                <svg viewBox="0 0 120 240" className="w-full h-full overflow-visible opacity-90 drop-shadow-[0_4px_12px_rgba(0,0,0,0.9)]">
                  <path d="M0 40 Q50 60 90 90 Q60 85 40 100 Q80 115 110 140 Q70 135 50 150 Q90 170 120 200" fill="none" stroke="#041a0d" strokeWidth="10" strokeLinecap="round" />
                  <path d="M0 40 Q50 60 90 90 Q60 85 40 100 Q80 115 110 140 Q70 135 50 150 Q90 170 120 200" fill="none" stroke="#15803d" strokeWidth="5" strokeLinecap="round" />
                  {/* Pine needle clusters */}
                  <circle cx="90" cy="90" r="14" fill="#14532d" opacity="0.8" />
                  <circle cx="110" cy="140" r="16" fill="#166534" opacity="0.8" />
                  <circle cx="120" cy="200" r="18" fill="#14532d" opacity="0.8" />
                </svg>
              </div>
            </div>
          </div>

          {/* Right Trunk & Swaying Boughs */}
          <div className="absolute top-0 bottom-0 right-0 w-16 sm:w-36 pointer-events-none z-10 opacity-80 sm:opacity-90">
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
          {/* ========================================================= */}
          {/* --- SCENE 1: THE FORT KNOX GOLD VAULT (DYNAMIC HIGH ROLLER) --- */}
          {/* ========================================================= */}
          {sceneId === 'VAULT' && (
            <>
              {/* Deep Obsidian Marble & Velvet Base */}
              <div className="absolute inset-0 bg-gradient-to-b from-[#020d08] via-[#040e14] to-[#010507]" />

              {/* Sweeping Dual High-Intensity Volumetric Spotlights */}
              <div className="absolute -bottom-20 left-[10%] w-[420px] h-[900px] pointer-events-none opacity-20 transform origin-bottom animate-spotlight-left"
                style={{
                  background: 'linear-gradient(to top, rgba(245, 158, 11, 0.5) 0%, rgba(254, 240, 138, 0.25) 40%, transparent 80%)',
                }}
              />
              <div className="absolute -bottom-20 right-[10%] w-[420px] h-[900px] pointer-events-none opacity-20 transform origin-bottom animate-spotlight-right"
                style={{
                  background: 'linear-gradient(to top, rgba(245, 158, 11, 0.5) 0%, rgba(254, 240, 138, 0.25) 40%, transparent 80%)',
                }}
              />

              {/* Towering Background Bullion Stacks Silhouettes with Shimmering Edges */}
              <div className="absolute bottom-0 left-0 right-0 h-64 opacity-35 flex justify-between items-end px-4 pointer-events-none">
                <div className="w-48 h-56 bg-gradient-to-t from-amber-600/50 via-amber-800/30 to-transparent rounded-t-lg border-t-2 border-x border-yellow-400/40 relative overflow-hidden shadow-2xl">
                  <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/15 to-transparent animate-shimmer-sweep" />
                </div>
                <div className="w-72 h-44 bg-gradient-to-t from-amber-600/40 via-amber-800/20 to-transparent rounded-t-lg border-t-2 border-x border-yellow-400/30 hidden sm:block relative overflow-hidden shadow-2xl">
                  <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/15 to-transparent animate-shimmer-sweep" style={{ animationDelay: '2s' }} />
                </div>
                <div className="w-56 h-60 bg-gradient-to-t from-amber-600/50 via-amber-800/30 to-transparent rounded-t-lg border-t-2 border-x border-yellow-400/40 relative overflow-hidden shadow-2xl">
                  <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/15 to-transparent animate-shimmer-sweep" style={{ animationDelay: '1s' }} />
                </div>
              </div>

              {/* Biometric Security Scanning Laser Grid (Sweeping Vertically) */}
              <div className="absolute top-1/4 left-0 right-0 h-[2px] bg-gradient-to-r from-transparent via-cyan-400 to-transparent opacity-60 shadow-[0_0_15px_#00F0FF] animate-laser-scan-vert pointer-events-none flex items-center justify-center">
                <div className="w-3 h-3 rounded-full bg-cyan-300 shadow-[0_0_10px_#00F0FF] animate-ping" />
              </div>

              {/* Secondary Amber Security Laser Beam */}
              <div className="absolute top-2/3 left-0 right-0 h-[1.5px] bg-gradient-to-r from-transparent via-amber-400 to-transparent opacity-45 shadow-[0_0_12px_#F59E0B] pointer-events-none" />

              {/* Central Opulent Gold Ambient Corona */}
              <div
                className="absolute top-1/3 left-1/2 -translate-x-1/2 w-[700px] h-[400px] pointer-events-none opacity-40 animate-pulse"
                style={{
                  background: 'radial-gradient(circle, rgba(245, 158, 11, 0.25) 0%, rgba(16, 185, 129, 0.08) 50%, transparent 75%)',
                  animationDuration: '7s',
                }}
              />
            </>
          )}

          {/* --- SCENE 2: MIDNIGHT CASH PENTHOUSE --- */}
          {sceneId === 'PENTHOUSE' && (
            <>
              {/* Midnight Skyline Gradient */}
              <div className="absolute inset-0 bg-gradient-to-b from-[#0f0728] via-[#0c091f] to-[#04020a]" />

              {/* Sweeping Sky Searchlights */}
              <div className="absolute -bottom-10 left-[20%] w-[350px] h-[800px] pointer-events-none opacity-25 transform origin-bottom animate-spotlight-left"
                style={{ background: 'linear-gradient(to top, rgba(168, 85, 247, 0.4) 0%, transparent 80%)' }}
              />
              <div className="absolute -bottom-10 right-[20%] w-[350px] h-[800px] pointer-events-none opacity-25 transform origin-bottom animate-spotlight-right"
                style={{ background: 'linear-gradient(to top, rgba(56, 189, 248, 0.4) 0%, transparent 80%)' }}
              />

              {/* Las Vegas Strip Casino Skyline Silhouette with Glowing Windows */}
              <div className="absolute bottom-0 left-0 right-0 h-72 opacity-40 flex items-end justify-around px-2 pointer-events-none">
                <div className="w-16 h-52 bg-slate-900 border-t-2 border-purple-400/60 relative shadow-2xl">
                  <div className="w-1 h-14 bg-amber-400/80 mx-auto -mt-14 shadow-[0_0_10px_#FBBF24]" />
                  <div className="grid grid-cols-2 gap-1 p-1 opacity-70">
                    {[...Array(6)].map((_, i) => (
                      <div key={i} className="w-2 h-2 rounded-xs bg-yellow-300 animate-pulse" style={{ animationDelay: `${i * 300}ms` }} />
                    ))}
                  </div>
                </div>
                <div className="w-24 h-64 bg-slate-950 border-t-2 border-cyan-400/60 shadow-2xl relative">
                  <div className="grid grid-cols-3 gap-1 p-2 opacity-60">
                    {[...Array(9)].map((_, i) => (
                      <div key={i} className="w-2 h-2 rounded-xs bg-cyan-300 animate-pulse" style={{ animationDelay: `${i * 250}ms` }} />
                    ))}
                  </div>
                </div>
                <div className="w-32 h-44 bg-slate-900 border-t-2 border-pink-400/60" />
                <div className="w-20 h-60 bg-slate-950 border-t-2 border-yellow-400/60" />
                <div className="w-28 h-48 bg-slate-900 border-t-2 border-purple-400/60 hidden sm:block" />
              </div>

              {/* Radial Penthouse Ambient Glow */}
              <div
                className="absolute top-1/3 left-1/2 -translate-x-1/2 w-[650px] h-[400px] pointer-events-none opacity-45"
                style={{
                  background: 'radial-gradient(circle, rgba(168, 85, 247, 0.28) 0%, rgba(245, 158, 11, 0.12) 50%, transparent 70%)',
                }}
              />
            </>
          )}

          {/* --- SCENE 3: THE FEDERAL CURRENCY MINT --- */}
          {sceneId === 'MINT' && (
            <>
              {/* Molten Metal Forge Gradient */}
              <div className="absolute inset-0 bg-gradient-to-b from-[#1a0505] via-[#140807] to-[#0a0302]" />

              {/* Industrial Gear Wheels Silhouette in Background */}
              <div className="absolute top-12 left-10 w-48 h-48 rounded-full border-2 border-dashed border-red-500/25 animate-spin opacity-40 hidden sm:block" style={{ animationDuration: '40s' }} />
              <div className="absolute top-28 right-14 w-36 h-36 rounded-full border-2 border-dashed border-amber-500/20 animate-spin opacity-35 hidden sm:block transform -scale-x-100" style={{ animationDuration: '30s' }} />

              {/* Molten Gold River Heat Reflection at Bottom */}
              <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-red-600/35 via-amber-600/20 to-transparent animate-pulse" style={{ animationDuration: '4s' }} />

              {/* Forge Glow */}
              <div
                className="absolute top-1/3 left-1/2 -translate-x-1/2 w-[650px] h-[380px] pointer-events-none opacity-45"
                style={{
                  background: 'radial-gradient(circle, rgba(239, 68, 68, 0.28) 0%, rgba(245, 158, 11, 0.18) 50%, transparent 70%)',
                }}
              />
            </>
          )}

          {/* --- SCENE 4: HIGH STAKES HEIST --- */}
          {sceneId === 'HEIST' && (
            <>
              {/* Crimson & Electric Cyan Midnight Heist */}
              <div className="absolute inset-0 bg-gradient-to-b from-[#020b18] via-[#0f0408] to-[#040103]" />

              {/* Security Laser Crosshairs */}
              <div className="absolute top-1/3 left-0 right-0 h-[1.5px] bg-gradient-to-r from-transparent via-cyan-400 to-transparent opacity-60 shadow-[0_0_12px_#00F0FF] animate-pulse" />
              <div className="absolute top-2/3 left-0 right-0 h-[1.5px] bg-gradient-to-r from-transparent via-red-500 to-transparent opacity-60 shadow-[0_0_12px_#EF4444] animate-pulse" style={{ animationDelay: '1s' }} />

              {/* Sweeping Blue Alarm Beacon */}
              <div className="absolute -bottom-10 left-1/2 -translate-x-1/2 w-[500px] h-[800px] pointer-events-none opacity-20 transform origin-bottom animate-spotlight-left"
                style={{ background: 'linear-gradient(to top, rgba(0, 240, 255, 0.35) 0%, transparent 75%)' }}
              />

              {/* Ambient Glow */}
              <div
                className="absolute top-1/3 left-1/2 -translate-x-1/2 w-[650px] h-[380px] pointer-events-none opacity-45"
                style={{
                  background: 'radial-gradient(circle, rgba(0, 240, 255, 0.22) 0%, rgba(239, 68, 68, 0.2) 50%, transparent 70%)',
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
        {isTimber ? (
          // Timberland Hand-Hewn Rustic Boardwalk Floor
          <div className="w-full h-full bg-gradient-to-t from-[#0e0602] via-[#1b0d06] to-transparent relative border-t border-[#78350f]/40">
            {/* Horizontal cedar plank seams */}
            <div className="absolute inset-0 opacity-30 bg-[repeating-linear-gradient(0deg,transparent,transparent_22px,#0a0401_22px,#0a0401_24px)]" />
            {/* Subtle wood grain texture */}
            <div className="absolute inset-0 opacity-20 bg-[repeating-linear-gradient(90deg,transparent,transparent_60px,#2e1408_60px,#2e1408_62px)]" />
            {/* Scattered fallen autumn leaves on the boards */}
            <div className="absolute bottom-10 left-[12%] text-sm select-none opacity-85 animate-float-sparkle">🍂</div>
            <div className="absolute bottom-16 left-[28%] text-sm select-none opacity-85">🍁</div>
            <div className="absolute bottom-12 right-[25%] text-sm select-none opacity-85 animate-float-sparkle">🍂</div>
            <div className="absolute bottom-8 right-[10%] text-sm select-none opacity-85">🍁</div>
            {/* Mossy baseline wash */}
            <div className="absolute bottom-0 inset-x-0 h-3 bg-gradient-to-r from-emerald-950 via-emerald-800/40 to-emerald-950" />
          </div>
        ) : (
          // 24K Vault Luxury Las Vegas Red Velvet Diamond Trellis Carpet
          <div className="w-full h-full bg-gradient-to-t from-[#140202] via-[#240404] to-transparent relative border-t border-yellow-500/25">
            {/* Velvet diamond lattice pattern */}
            <svg viewBox="0 0 100 100" className="w-full h-full object-repeat opacity-25">
              <defs>
                <pattern id="carpetTrellis" width="24" height="24" patternUnits="userSpaceOnUse">
                  <path d="M 0 12 L 12 0 L 24 12 L 12 24 Z" fill="none" stroke="#FBBF24" strokeWidth="0.6" />
                  <circle cx="12" cy="12" r="1.5" fill="#EF4444" />
                </pattern>
              </defs>
              <rect width="100%" height="100%" fill="url(#carpetTrellis)" />
            </svg>
            {/* Warm casino floor ambient pools */}
            <div className="absolute bottom-0 inset-x-0 h-4 bg-gradient-to-r from-amber-600/30 via-yellow-400/40 to-amber-600/30" />
          </div>
        )}
      </div>

      {/* Living Atmospheric Floating Particles (Fireflies / Stardust) */}
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
