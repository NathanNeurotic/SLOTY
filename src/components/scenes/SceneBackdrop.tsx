import React, { useMemo } from 'react';
import type { CasinoSceneId } from './SceneTypes';

interface SceneBackdropProps {
  sceneId: CasinoSceneId;
}

export const SceneBackdrop: React.FC<SceneBackdropProps> = ({ sceneId }) => {
  // Pre-generate deterministic floating particles for the active scene
  const particles = useMemo(() => {
    return Array.from({ length: 28 }).map((_, i) => ({
      id: i,
      left: `${(i * 3.7 + 5) % 96}%`,
      top: `${(i * 6.3 + 10) % 90}%`,
      size: 2 + (i % 3) * 1.5,
      delay: `${(i * 0.25) % 3.5}s`,
      duration: `${3.2 + (i % 4) * 0.7}s`,
      color:
        sceneId === 'VAULT'
          ? i % 3 === 0
            ? '#FDE047'
            : i % 2 === 0
            ? '#F59E0B'
            : '#10B981'
          : sceneId === 'PENTHOUSE'
          ? i % 3 === 0
            ? '#C084FC'
            : i % 2 === 0
            ? '#38BDF8'
            : '#FBBF24'
          : sceneId === 'MINT'
          ? i % 3 === 0
            ? '#F87171'
            : i % 2 === 0
            ? '#FBBF24'
            : '#FB923C'
          : i % 3 === 0
          ? '#00F0FF'
          : i % 2 === 0
          ? '#EF4444'
          : '#FBBF24',
    }));
  }, [sceneId]);

  return (
    <div className="fixed inset-0 pointer-events-none overflow-hidden z-0 select-none transition-all duration-700">
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

          {/* Heavy Vault Ambient Gold Glow */}
          <div className="absolute top-1/3 left-1/2 -translate-x-1/2 w-[650px] h-[350px] bg-amber-500/12 rounded-full blur-[140px]" />
          <div className="absolute bottom-1/4 left-1/2 -translate-x-1/2 w-[750px] h-[300px] bg-emerald-600/10 rounded-full blur-[150px]" />
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

          {/* Sweeping Sky Searchlights */}
          <div className="absolute -bottom-10 left-[18%] w-36 sm:w-56 h-[120vh] origin-bottom transform rotate-[-25deg] animate-spotlight-left opacity-30 bg-gradient-to-t from-purple-500/30 via-pink-500/15 to-transparent blur-2xl" />
          <div className="absolute -bottom-10 right-[18%] w-36 sm:w-56 h-[120vh] origin-bottom transform rotate-[25deg] animate-spotlight-right opacity-30 bg-gradient-to-t from-amber-400/30 via-yellow-400/15 to-transparent blur-2xl" />

          {/* Penthouse Ambient Neon Purple & Gold Glow */}
          <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-[700px] h-[400px] bg-purple-700/15 rounded-full blur-[140px]" />
          <div className="absolute bottom-1/4 left-1/2 -translate-x-1/2 w-[800px] h-[350px] bg-amber-500/15 rounded-full blur-[150px]" />
        </>
      )}

      {/* --- SCENE 3: THE FEDERAL CURRENCY MINT --- */}
      {sceneId === 'MINT' && (
        <>
          {/* Molten Metal Forge Gradient */}
          <div className="absolute inset-0 bg-gradient-to-b from-[#1a0505] via-[#140807] to-[#0a0302]" />

          {/* Industrial Gear Wheels Silhouette in Background */}
          <div className="absolute top-12 left-10 w-48 h-48 rounded-full border-4 border-dashed border-red-500/15 animate-spin opacity-40" style={{ animationDuration: '45s' }} />
          <div className="absolute top-20 right-12 w-64 h-64 rounded-full border-4 border-dashed border-amber-500/15 animate-spin opacity-40" style={{ animationDuration: '60s', animationDirection: 'reverse' }} />

          {/* Molten Gold River Heat Reflection at Bottom */}
          <div className="absolute bottom-0 left-0 right-0 h-40 bg-gradient-to-t from-red-600/25 via-amber-600/15 to-transparent blur-xl" />

          {/* Fiery Crucible Center Ambience */}
          <div className="absolute top-1/3 left-1/2 -translate-x-1/2 w-[700px] h-[380px] bg-red-600/15 rounded-full blur-[140px]" />
          <div className="absolute bottom-1/4 left-1/2 -translate-x-1/2 w-[800px] h-[350px] bg-amber-500/20 rounded-full blur-[150px]" />
        </>
      )}

      {/* --- SCENE 4: HIGH STAKES HEIST --- */}
      {sceneId === 'HEIST' && (
        <>
          {/* Crimson & Electric Cyan Midnight Heist */}
          <div className="absolute inset-0 bg-gradient-to-b from-[#020b18] via-[#0f0408] to-[#040103]" />

          {/* Sweeping Emergency Alarm Flashers */}
          <div className="absolute -bottom-10 left-[10%] w-44 h-[120vh] origin-bottom transform rotate-[-20deg] animate-spotlight-left opacity-35 bg-gradient-to-t from-cyan-400/35 via-blue-500/15 to-transparent blur-2xl" />
          <div className="absolute -bottom-10 right-[10%] w-44 h-[120vh] origin-bottom transform rotate-[20deg] animate-spotlight-right opacity-35 bg-gradient-to-t from-red-600/35 via-rose-500/15 to-transparent blur-2xl" />

          {/* Security Laser Crosshairs */}
          <div className="absolute top-1/3 left-0 right-0 h-[1px] bg-gradient-to-r from-transparent via-cyan-400 to-transparent opacity-50 shadow-[0_0_10px_#00F0FF]" />
          <div className="absolute top-2/3 left-0 right-0 h-[1px] bg-gradient-to-r from-transparent via-red-500 to-transparent opacity-50 shadow-[0_0_10px_#EF4444]" />

          {/* Ambient Heist Glow */}
          <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-[700px] h-[400px] bg-cyan-600/12 rounded-full blur-[140px]" />
          <div className="absolute bottom-1/4 left-1/2 -translate-x-1/2 w-[800px] h-[350px] bg-red-600/15 rounded-full blur-[150px]" />
        </>
      )}

      {/* Floating Stardust / Embers / Sparks */}
      {particles.map((p) => (
        <div
          key={p.id}
          className="absolute rounded-full animate-float-sparkle"
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
  );
};
