import React from 'react';
import type { GameId } from '../../games/types';

interface CabinetGlassOverlayProps {
  activeGameId?: GameId;
  reelsCount?: number;
}

export const CabinetGlassOverlay: React.FC<CabinetGlassOverlayProps> = ({
  activeGameId = 'vault-24k',
  reelsCount = 5,
}) => {
  const isTimber = activeGameId === 'timber-critters';
  const isPixel = activeGameId === 'pixel-arcade';

  // Compute divider percentages dynamically
  const dividers = Array.from({ length: reelsCount - 1 }, (_, i) => ((i + 1) * 100) / reelsCount);

  return (
    <div className="absolute inset-0 pointer-events-none z-25 overflow-hidden select-none">
      {/* 1. Deep Recessed Reel Well Perimeter Drop Shadow (Gives 3D physical depth) */}
      <div className="absolute inset-0 shadow-[inset_0_14px_28px_rgba(0,0,0,0.98),inset_0_-14px_28px_rgba(0,0,0,0.98),inset_12px_0_24px_rgba(0,0,0,0.95),inset_-12px_0_24px_rgba(0,0,0,0.95)]" />

      {/* 2. CRT Scanline Raster Texture for Pixel Arcade */}
      {isPixel && (
        <div
          className="absolute inset-0 pointer-events-none opacity-20"
          style={{
            backgroundImage:
              'repeating-linear-gradient(0deg, rgba(0,0,0,0.35), rgba(0,0,0,0.35) 1.5px, transparent 1.5px, transparent 3px)',
          }}
        />
      )}

      {/* 3. Top-Third Cylindrical Convex Glass Softbox Reflection */}
      <div className="absolute inset-x-0 top-0 h-1/3 bg-gradient-to-b from-white/16 via-white/5 to-transparent pointer-events-none" />

      {/* 4. Diagonal Anti-Glare Studio Keylight Streak */}
      <div className="absolute -top-24 -left-24 w-52 h-[220%] bg-gradient-to-r from-transparent via-white/6 to-transparent transform rotate-18 pointer-events-none" />

      {/* 5. Bottom Glass Horizon Glint */}
      <div className="absolute inset-x-0 bottom-0 h-2 bg-gradient-to-t from-white/12 to-transparent pointer-events-none" />

      {/* 6. Physical Reel Separator Mullions (Vertical Divider Strips) */}
      {dividers.map((percent, idx) => (
        <div
          key={idx}
          className="absolute top-0 bottom-0 pointer-events-none -translate-x-1/2 flex items-center justify-center"
          style={{ left: `${percent}%` }}
        >
          {isTimber ? (
            // Hand-Hewn Birch Reel Post with Wrought Nails
            <div className="w-1.5 sm:w-2 h-full bg-gradient-to-r from-[#170a04] via-[#3b1d0c] to-[#170a04] border-x border-[#5c2b09]/80 shadow-[0_0_8px_rgba(0,0,0,0.9)] flex flex-col justify-between py-4">
              <div className="w-1 h-1 rounded-full bg-[#a16207] shadow-xs mx-auto" />
              <div className="w-1 h-1 rounded-full bg-[#a16207] shadow-xs mx-auto" />
              <div className="w-1 h-1 rounded-full bg-[#a16207] shadow-xs mx-auto" />
            </div>
          ) : isPixel ? (
            // Neon Cyber Laser Mullion with Blinking Arcade Diodes
            <div className="w-1 sm:w-1.5 h-full bg-gradient-to-r from-purple-950 via-pink-600 to-purple-950 border-x border-cyan-400/50 shadow-[0_0_10px_rgba(236,72,153,0.8)] flex flex-col justify-between py-4">
              <div className="w-1 h-1 rounded-full bg-cyan-300 shadow-[0_0_6px_#06B6D4] mx-auto animate-pulse" />
              <div className="w-1 h-1 rounded-full bg-pink-400 shadow-[0_0_6px_#EC4899] mx-auto animate-pulse" style={{ animationDelay: '250ms' }} />
              <div className="w-1 h-1 rounded-full bg-cyan-300 shadow-[0_0_6px_#06B6D4] mx-auto animate-pulse" style={{ animationDelay: '500ms' }} />
            </div>
          ) : (
            // Polished Chrome Vault Separator with Micro-LED Edge Lighting
            <div className="w-1.5 sm:w-2 h-full bg-gradient-to-r from-slate-900 via-slate-500 to-slate-900 border-x border-yellow-500/40 shadow-[0_0_8px_rgba(0,0,0,0.95)] flex flex-col justify-between py-4">
              <div className="w-1 h-1 rounded-full bg-yellow-300 shadow-[0_0_4px_#FDE047] mx-auto animate-pulse" />
              <div className="w-1 h-1 rounded-full bg-cyan-300 shadow-[0_0_4px_#00F0FF] mx-auto animate-pulse" style={{ animationDelay: '300ms' }} />
              <div className="w-1 h-1 rounded-full bg-yellow-300 shadow-[0_0_4px_#FDE047] mx-auto animate-pulse" style={{ animationDelay: '600ms' }} />
            </div>
          )}
        </div>
      ))}
    </div>
  );
};
