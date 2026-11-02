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
          {/* Deep Twilight Evergreen Base */}
          <div className="absolute inset-0 bg-gradient-to-b from-[#011309] via-[#041d11] to-[#010904]" />

          {/* Distant Mountain Ridges & Pine Silhouettes SVG */}
          <div className="absolute bottom-0 left-0 right-0 h-96 opacity-45 pointer-events-none">
            <svg viewBox="0 0 1440 320" className="w-full h-full object-cover" preserveAspectRatio="none">
              {/* Back Mountain Ridge */}
              <path
                d="M0 160 L180 80 L380 190 L620 60 L860 170 L1100 70 L1280 180 L1440 100 L1440 320 L0 320 Z"
                fill="#072317"
              />
              {/* Mid Pine Tree Silhouettes */}
              <path
                d="M0 220 L60 180 L120 220 L180 160 L240 230 L320 170 L400 240 L500 150 L600 230 L720 160 L840 240 L960 170 L1080 230 L1200 150 L1320 220 L1440 160 L1440 320 L0 320 Z"
                fill="#04160E"
              />
              {/* Foreground Dense Pine Forest Silhouette */}
              <path
                d="M0 260 L40 220 L80 270 L140 210 L200 280 L280 200 L360 270 L440 220 L540 290 L640 210 L760 270 L860 200 L960 280 L1080 210 L1200 270 L1300 200 L1440 260 L1440 320 L0 320 Z"
                fill="#020C06"
              />
            </svg>
          </div>

          {/* Moonlight Sunbeams / Light Shafts Slicing Through Trees */}
          <div
            className="absolute -top-20 left-1/4 w-[700px] h-[600px] pointer-events-none opacity-30 transform -rotate-12"
            style={{
              background: 'radial-gradient(ellipse at 50% 0%, rgba(245, 158, 11, 0.28) 0%, rgba(16, 185, 129, 0.15) 45%, transparent 75%)',
            }}
          />

          {/* Woodland Fog Rolling on Floor */}
          <div className="absolute bottom-0 left-0 right-0 h-44 bg-gradient-to-t from-[#020b05] via-[#041a0e]/40 to-transparent pointer-events-none" />
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
