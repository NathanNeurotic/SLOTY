import React, { useMemo } from 'react';
import type { CasinoSceneId } from './SceneTypes';
import type { GameId } from '../../games/types';

interface SceneBackdropProps {
  sceneId: CasinoSceneId;
  activeGameId?: GameId;
}

export const SceneBackdrop: React.FC<SceneBackdropProps> = ({ sceneId, activeGameId = 'vault-24k' }) => {
  const isTimber = activeGameId === 'timber-critters';

  // Pre-generate 14 lightweight floating particles
  const particles = useMemo(() => {
    return Array.from({ length: 14 }).map((_, i) => ({
      id: i,
      left: `${(i * 7.5 + 4) % 96}%`,
      top: `${(i * 7.1 + 10) % 90}%`,
      size: isTimber ? 2.5 + (i % 3) * 1.5 : 2 + (i % 2) * 1.5,
      delay: `${(i * 0.35) % 3.0}s`,
      duration: `${3.2 + (i % 3) * 0.9}s`,
      color: isTimber
        ? i % 3 === 0
          ? '#F59E0B' // Golden Firefly
          : i % 3 === 1
          ? '#10B981' // Emerald Spore
          : '#34D399' // Bright Moss
        : sceneId === 'VAULT'
        ? i % 2 === 0
          ? '#FDE047'
          : '#10B981'
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

  return (
    <div className="fixed inset-0 pointer-events-none overflow-hidden z-0 select-none">
      {/* ========================================================= */}
      {/* --- TIMBERLAND CRITTERS ENCHANTED PINE FOREST BACKDROP --- */}
      {/* ========================================================= */}
      {isTimber ? (
        <>
          {/* Deep Twilight Evergreen Night Base */}
          <div className="absolute inset-0 bg-gradient-to-b from-[#021308] via-[#052113] to-[#010a04]" />

          {/* Luminous Full Forest Moon */}
          <div className="absolute top-6 right-16 sm:right-32 w-28 sm:w-36 h-28 sm:h-36 rounded-full bg-gradient-to-br from-[#FFFBEB] via-[#FEF08A] to-[#F59E0B] shadow-[0_0_60px_rgba(254,240,138,0.7),0_0_120px_rgba(245,158,11,0.4)] pointer-events-none opacity-85">
            {/* Moon craters / lunar texture */}
            <div className="absolute top-5 left-7 w-6 h-6 rounded-full bg-[#EAB308]/20" />
            <div className="absolute top-12 left-14 w-8 h-8 rounded-full bg-[#EAB308]/25" />
            <div className="absolute top-18 left-8 w-5 h-5 rounded-full bg-[#EAB308]/15" />
          </div>

          {/* Moonlight Volumetric Light Shafts */}
          <div
            className="absolute -top-10 right-20 sm:right-40 w-[600px] h-[800px] pointer-events-none opacity-25 transform rotate-25"
            style={{
              background: 'radial-gradient(ellipse at 50% 0%, rgba(254, 240, 138, 0.4) 0%, rgba(52, 211, 153, 0.15) 45%, transparent 75%)',
            }}
          />

          {/* Distant Mountain Ridges & Dense Pine Silhouettes */}
          <div className="absolute bottom-0 left-0 right-0 h-[420px] opacity-60 pointer-events-none">
            <svg viewBox="0 0 1440 420" className="w-full h-full object-cover" preserveAspectRatio="none">
              {/* Back Mountain Ridge with Misty Valleys */}
              <path
                d="M0 240 Q180 140 380 230 Q600 110 840 210 Q1060 120 1260 220 L1440 160 L1440 420 L0 420 Z"
                fill="#0a2e1d"
              />
              {/* Mid Pine Tree Silhouettes Layer */}
              <path
                d="M0 290 L30 250 L60 295 L100 240 L140 290 L180 235 L220 295 L270 245 L320 300 L370 230 L420 290 L480 240 L540 300 L600 235 L660 295 L720 240 L780 300 L840 230 L900 295 L960 245 L1020 300 L1080 235 L1140 290 L1200 240 L1260 300 L1320 235 L1380 290 L1440 240 L1440 420 L0 420 Z"
                fill="#051c10"
              />
              {/* Foreground Dense Evergreen Crowns */}
              <path
                d="M0 340 L40 290 L80 345 L130 280 L180 340 L240 285 L300 350 L360 275 L420 345 L490 280 L560 350 L630 270 L700 345 L770 285 L840 350 L910 275 L980 345 L1050 280 L1120 350 L1190 270 L1260 345 L1330 285 L1400 345 L1440 295 L1440 420 L0 420 Z"
                fill="#020e06"
              />
            </svg>
          </div>

          {/* Towering Ancient Redwood Trunks Framing Left & Right Borders */}
          {/* Left Trunk */}
          <div className="absolute top-0 bottom-0 left-0 w-16 sm:w-36 pointer-events-none z-10 opacity-75 sm:opacity-85">
            <div className="w-full h-full bg-gradient-to-r from-[#170a04] via-[#2c1308] to-transparent border-r border-[#451a03]/30 shadow-[10px_0_25px_rgba(0,0,0,0.8)] relative">
              {/* Wood bark vertical grooves */}
              <div className="absolute inset-0 opacity-40 bg-[repeating-linear-gradient(90deg,transparent,transparent_8px,rgba(0,0,0,0.6)_8px,rgba(0,0,0,0.6)_14px)]" />
              {/* Overhanging Pine Branches from Left */}
              <svg viewBox="0 0 120 240" className="absolute top-8 -right-16 w-32 h-64 overflow-visible opacity-80 pointer-events-none">
                <path d="M0 40 Q50 60 90 90 Q60 85 40 100 Q80 115 110 140 Q70 135 50 150 Q90 170 120 200" fill="none" stroke="#062413" strokeWidth="8" strokeLinecap="round" />
                <path d="M0 40 Q50 60 90 90 Q60 85 40 100 Q80 115 110 140 Q70 135 50 150 Q90 170 120 200" fill="none" stroke="#166534" strokeWidth="4" strokeLinecap="round" />
              </svg>
            </div>
          </div>

          {/* Right Trunk */}
          <div className="absolute top-0 bottom-0 right-0 w-16 sm:w-36 pointer-events-none z-10 opacity-75 sm:opacity-85">
            <div className="w-full h-full bg-gradient-to-l from-[#170a04] via-[#2c1308] to-transparent border-l border-[#451a03]/30 shadow-[-10px_0_25px_rgba(0,0,0,0.8)] relative">
              {/* Wood bark vertical grooves */}
              <div className="absolute inset-0 opacity-40 bg-[repeating-linear-gradient(90deg,transparent,transparent_8px,rgba(0,0,0,0.6)_8px,rgba(0,0,0,0.6)_14px)]" />
              {/* Overhanging Pine Branches from Right */}
              <svg viewBox="0 0 120 240" className="absolute top-20 -left-16 w-32 h-64 overflow-visible opacity-80 pointer-events-none transform -scale-x-100">
                <path d="M0 40 Q50 60 90 90 Q60 85 40 100 Q80 115 110 140 Q70 135 50 150 Q90 170 120 200" fill="none" stroke="#062413" strokeWidth="8" strokeLinecap="round" />
                <path d="M0 40 Q50 60 90 90 Q60 85 40 100 Q80 115 110 140 Q70 135 50 150 Q90 170 120 200" fill="none" stroke="#166534" strokeWidth="4" strokeLinecap="round" />
              </svg>
            </div>
          </div>

          {/* Swirling Woodland Ground Fog */}
          <div className="absolute bottom-0 left-0 right-0 h-48 bg-gradient-to-t from-[#010904] via-[#041a0e]/50 to-transparent pointer-events-none" />
        </>
      ) : (
        <>
          {/* --- SCENE 1: THE FORT KNOX GOLD VAULT --- */}
          {sceneId === 'VAULT' && (
            <>
              {/* Deep Emerald & Obsidian Marble Base */}
              <div className="absolute inset-0 bg-gradient-to-b from-[#03150d] via-[#050f14] to-[#020609]" />

              {/* Towering Background Bullion Stacks Silhouettes */}
              <div className="absolute bottom-0 left-0 right-0 h-64 opacity-25 flex justify-between items-end px-4 pointer-events-none">
                <div className="w-48 h-56 bg-gradient-to-t from-amber-600/40 to-transparent rounded-t-lg border-t border-x border-yellow-400/30" />
                <div className="w-72 h-44 bg-gradient-to-t from-amber-600/30 to-transparent rounded-t-lg border-t border-x border-yellow-400/20 hidden sm:block" />
                <div className="w-56 h-60 bg-gradient-to-t from-amber-600/40 to-transparent rounded-t-lg border-t border-x border-yellow-400/30" />
              </div>

              {/* Biometric Security Green Laser Sweep */}
              <div className="absolute top-1/4 left-0 right-0 h-[1.5px] bg-gradient-to-r from-transparent via-emerald-400 to-transparent opacity-40 shadow-[0_0_12px_#34D399] animate-pulse" />

              {/* Hardware-friendly Radial Ambient Glow */}
              <div
                className="absolute top-1/3 left-1/2 -translate-x-1/2 w-[600px] h-[350px] pointer-events-none opacity-40"
                style={{
                  background: 'radial-gradient(circle, rgba(245, 158, 11, 0.22) 0%, rgba(16, 185, 129, 0.08) 45%, transparent 70%)',
                }}
              />
            </>
          )}

          {/* --- SCENE 2: MIDNIGHT CASH PENTHOUSE --- */}
          {sceneId === 'PENTHOUSE' && (
            <>
              {/* Midnight Skyline Gradient */}
              <div className="absolute inset-0 bg-gradient-to-b from-[#0f0728] via-[#0c091f] to-[#04020a]" />

              {/* Las Vegas Strip Casino Skyline Silhouette */}
              <div className="absolute bottom-0 left-0 right-0 h-72 opacity-30 flex items-end justify-around px-2 pointer-events-none">
                <div className="w-16 h-52 bg-slate-900 border-t-2 border-purple-400/40 relative shadow-2xl">
                  <div className="w-1 h-12 bg-amber-400/60 mx-auto -mt-12" />
                </div>
                <div className="w-24 h-64 bg-slate-950 border-t-2 border-cyan-400/40" />
                <div className="w-32 h-44 bg-slate-900 border-t-2 border-pink-400/40" />
                <div className="w-20 h-60 bg-slate-950 border-t-2 border-yellow-400/40" />
                <div className="w-28 h-48 bg-slate-900 border-t-2 border-purple-400/40 hidden sm:block" />
              </div>

              {/* Hardware-friendly Radial Ambient Glow */}
              <div
                className="absolute top-1/3 left-1/2 -translate-x-1/2 w-[600px] h-[380px] pointer-events-none opacity-45"
                style={{
                  background: 'radial-gradient(circle, rgba(168, 85, 247, 0.25) 0%, rgba(245, 158, 11, 0.12) 50%, transparent 70%)',
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
              <div className="absolute top-12 left-10 w-44 h-44 rounded-full border-2 border-dashed border-red-500/15 animate-spin opacity-30 hidden sm:block" style={{ animationDuration: '45s' }} />

              {/* Molten Gold River Heat Reflection at Bottom */}
              <div className="absolute bottom-0 left-0 right-0 h-28 bg-gradient-to-t from-red-600/25 via-amber-600/15 to-transparent" />

              {/* Hardware-friendly Radial Ambient Glow */}
              <div
                className="absolute top-1/3 left-1/2 -translate-x-1/2 w-[600px] h-[350px] pointer-events-none opacity-40"
                style={{
                  background: 'radial-gradient(circle, rgba(239, 68, 68, 0.25) 0%, rgba(245, 158, 11, 0.15) 50%, transparent 70%)',
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
              <div className="absolute top-1/3 left-0 right-0 h-[1px] bg-gradient-to-r from-transparent via-cyan-400 to-transparent opacity-50 shadow-[0_0_10px_#00F0FF]" />
              <div className="absolute top-2/3 left-0 right-0 h-[1px] bg-gradient-to-r from-transparent via-red-500 to-transparent opacity-50 shadow-[0_0_10px_#EF4444]" />

              {/* Hardware-friendly Radial Ambient Glow */}
              <div
                className="absolute top-1/3 left-1/2 -translate-x-1/2 w-[600px] h-[350px] pointer-events-none opacity-40"
                style={{
                  background: 'radial-gradient(circle, rgba(0, 240, 255, 0.2) 0%, rgba(239, 68, 68, 0.18) 50%, transparent 70%)',
                }}
              />
            </>
          )}
        </>
      )}

      {/* Lightweight Floating Stardust / Fireflies (Desktop only) */}
      <div className="hidden sm:block">
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
              boxShadow: `0 0 8px ${p.color}`,
              animationDelay: p.delay,
              animationDuration: p.duration,
            }}
          />
        ))}
      </div>
    </div>
  );
};
