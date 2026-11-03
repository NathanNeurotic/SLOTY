import React, { useEffect, useState } from 'react';
import type { GameId } from '../games/types';
import { soundManager } from '../audio/soundManager';

interface CabinetVentsAndWoodsFXProps {
  activeGameId?: GameId;
  isSpinning: boolean;
  isCabinetSlamming: boolean;
  hasActiveWin: boolean;
  isAnticipating: boolean;
}

interface PineNeedleParticle {
  id: number;
  x: number; // percentage across cabinet width
  y: number; // px from top
  vx: number;
  vy: number;
  rotation: number;
  vRot: number;
  type: 'needle' | 'leaf';
  color: string;
  opacity: number;
}

export const CabinetVentsAndWoodsFX: React.FC<CabinetVentsAndWoodsFXProps> = ({
  activeGameId = 'vault-24k',
  isSpinning,
  isCabinetSlamming,
  hasActiveWin,
  isAnticipating,
}) => {
  const isTimber = activeGameId === 'timber-critters';

  // 24K Vault: Steam blast active state
  const [steamActive, setSteamActive] = useState(false);

  // Timberland: Pine needles shower active particles
  const [needles, setNeedles] = useState<PineNeedleParticle[]>([]);

  // Timberland: Blinking eyes state
  const [eyesBlinking, setEyesBlinking] = useState(false);

  // Trigger Steam Vents on 24K Vault spin start or cabinet slam
  useEffect(() => {
    if (!isTimber && (isCabinetSlamming || (hasActiveWin && !isSpinning))) {
      setSteamActive(true);
      soundManager.playSteamHiss();
      const t = setTimeout(() => setSteamActive(false), 900);
      return () => clearTimeout(t);
    }
  }, [isCabinetSlamming, hasActiveWin, isSpinning, isTimber]);

  // Trigger Pine Needle Shower on Timberland cabinet slam
  useEffect(() => {
    if (isTimber && isCabinetSlamming) {
      soundManager.playPineNeedleRustle();
      const newNeedles: PineNeedleParticle[] = Array.from({ length: 14 }).map((_, i) => ({
        id: Date.now() + i,
        x: 10 + Math.random() * 80,
        y: 0,
        vx: (Math.random() - 0.5) * 1.5,
        vy: 2.2 + Math.random() * 2.8,
        rotation: Math.random() * Math.PI * 2,
        vRot: (Math.random() - 0.5) * 0.15,
        type: Math.random() < 0.6 ? 'needle' : 'leaf',
        color: Math.random() < 0.5 ? '#15803D' : Math.random() < 0.8 ? '#D97706' : '#DC2626',
        opacity: 0.95,
      }));
      setNeedles((prev) => [...prev.slice(-10), ...newNeedles]);
    }
  }, [isTimber, isCabinetSlamming]);

  // Animate needles falling
  useEffect(() => {
    if (needles.length === 0) return;
    const interval = setInterval(() => {
      setNeedles((prev) =>
        prev
          .map((n) => ({
            ...n,
            y: n.y + n.vy,
            x: n.x + n.vx * 0.2,
            rotation: n.rotation + n.vRot,
            opacity: n.opacity - 0.02,
          }))
          .filter((n) => n.opacity > 0 && n.y < 380)
      );
    }, 28);
    return () => clearInterval(interval);
  }, [needles]);

  // Random critter eye blink intervals for Timberland
  useEffect(() => {
    if (!isTimber) return;
    const interval = setInterval(() => {
      if (Math.random() < 0.4) {
        setEyesBlinking(true);
        setTimeout(() => setEyesBlinking(false), 240);
      }
    }, 2200);
    return () => clearInterval(interval);
  }, [isTimber]);

  // =========================================================================
  // --- VERSION A: TIMBERLAND CRITTERS (CANOPY NEEDLES & FOREST EYES) ---
  // =========================================================================
  if (isTimber) {
    return (
      <div className="absolute inset-0 pointer-events-none overflow-hidden z-25">
        {/* Falling Pine Needles & Cedar Flakes on Reel Slam */}
        {needles.map((n) => (
          <div
            key={n.id}
            className="absolute pointer-events-none will-change-transform"
            style={{
              left: `${n.x}%`,
              top: `${n.y}px`,
              opacity: n.opacity,
              transform: `rotate(${n.rotation}rad)`,
            }}
          >
            {n.type === 'needle' ? (
              <div
                className="w-4 h-[2px] rounded-full shadow-sm"
                style={{ backgroundColor: n.color }}
              />
            ) : (
              <div
                className="w-2.5 h-2 rounded-full shadow-sm"
                style={{ backgroundColor: n.color }}
              />
            )}
          </div>
        ))}

        {/* Ambient Glowing Critter Eyes in the Shadows (Left & Right Eaves) */}
        <div className="hidden sm:block absolute top-1 left-3 z-30">
          <div
            className={`flex items-center space-x-1 transition-all duration-150 ${
              eyesBlinking ? 'opacity-0 scale-y-10' : 'opacity-85 scale-100'
            }`}
          >
            <div className="w-1.5 h-2 rounded-full bg-amber-400 shadow-[0_0_8px_#F59E0B]" />
            <div className="w-1.5 h-2 rounded-full bg-amber-400 shadow-[0_0_8px_#F59E0B]" />
          </div>
        </div>
        <div className="hidden sm:block absolute top-1 right-3 z-30">
          <div
            className={`flex items-center space-x-1 transition-all duration-150 ${
              eyesBlinking ? 'opacity-0 scale-y-10' : 'opacity-85 scale-100'
            }`}
          >
            <div className="w-1.5 h-2 rounded-full bg-emerald-400 shadow-[0_0_8px_#34D399]" />
            <div className="w-1.5 h-2 rounded-full bg-emerald-400 shadow-[0_0_8px_#34D399]" />
          </div>
        </div>

        {/* Glowing Bioluminescent Fairy Mushrooms in Bottom Corners */}
        <div className="absolute bottom-1 left-2 flex items-end space-x-0.5 z-25 opacity-85">
          <div className="w-2.5 h-3.5 rounded-t-full bg-emerald-400 shadow-[0_0_10px_#34D399] animate-pulse" />
          <div className="w-2 h-2.5 rounded-t-full bg-teal-300 shadow-[0_0_8px_#5EEAD4] -ml-0.5" />
        </div>
        <div className="absolute bottom-1 right-2 flex items-end space-x-0.5 z-25 opacity-85">
          <div className="w-2 h-2.5 rounded-t-full bg-amber-400 shadow-[0_0_8px_#FBBF24] -mr-0.5" />
          <div className="w-2.5 h-3.5 rounded-t-full bg-emerald-400 shadow-[0_0_10px_#34D399] animate-pulse" style={{ animationDelay: '1s' }} />
        </div>
      </div>
    );
  }

  // =========================================================================
  // --- VERSION B: 24K VAULT (HYDRAULIC STEAM VENTS & LASER SCANNER) ---
  // =========================================================================
  return (
    <div className="absolute inset-0 pointer-events-none overflow-hidden z-25">
      {/* Laser Tripwire Scanner during Anticipation */}
      {isAnticipating && (
        <div className="absolute inset-x-0 h-[2.5px] bg-gradient-to-r from-transparent via-cyan-400 to-transparent shadow-[0_0_15px_#00F0FF] animate-laser-scan-vert z-30 opacity-90 flex items-center justify-center">
          <div className="w-3 h-3 rounded-full bg-cyan-200 shadow-[0_0_10px_#00F0FF] animate-ping" />
        </div>
      )}

      {/* Hydraulic Steam Jets on Left Flank */}
      {steamActive && (
        <div className="absolute -left-6 top-1/2 -translate-y-1/2 flex flex-col items-center space-y-4 z-40 pointer-events-none">
          {/* Billowing Steam Puff Clouds Left */}
          <div className="w-20 h-16 rounded-full bg-gradient-to-r from-white/80 via-slate-200/50 to-transparent blur-md animate-steam-puff-left" />
          <div className="w-24 h-20 rounded-full bg-gradient-to-r from-cyan-100/70 via-white/40 to-transparent blur-lg animate-steam-puff-left" style={{ animationDelay: '80ms' }} />
        </div>
      )}

      {/* Hydraulic Steam Jets on Right Flank */}
      {steamActive && (
        <div className="absolute -right-6 top-1/2 -translate-y-1/2 flex flex-col items-center space-y-4 z-40 pointer-events-none">
          {/* Billowing Steam Puff Clouds Right */}
          <div className="w-20 h-16 rounded-full bg-gradient-to-l from-white/80 via-slate-200/50 to-transparent blur-md animate-steam-puff-right" />
          <div className="w-24 h-20 rounded-full bg-gradient-to-l from-cyan-100/70 via-white/40 to-transparent blur-lg animate-steam-puff-right" style={{ animationDelay: '80ms' }} />
        </div>
      )}

      {/* Industrial Steam Vent Nozzles on Cabinet Borders (Always Visible) */}
      <div className="hidden sm:flex absolute -left-2 top-1/2 -translate-y-1/2 flex-col space-y-8 z-30">
        <div className="w-3 h-6 bg-gradient-to-r from-slate-600 via-slate-400 to-slate-800 rounded-l border border-slate-400/80 shadow-md flex items-center justify-center">
          <div className={`w-1 h-3 rounded-full ${steamActive ? 'bg-amber-400 shadow-[0_0_8px_#F59E0B]' : 'bg-slate-950'}`} />
        </div>
      </div>
      <div className="hidden sm:flex absolute -right-2 top-1/2 -translate-y-1/2 flex-col space-y-8 z-30">
        <div className="w-3 h-6 bg-gradient-to-l from-slate-600 via-slate-400 to-slate-800 rounded-r border border-slate-400/80 shadow-md flex items-center justify-center">
          <div className={`w-1 h-3 rounded-full ${steamActive ? 'bg-amber-400 shadow-[0_0_8px_#F59E0B]' : 'bg-slate-950'}`} />
        </div>
      </div>
    </div>
  );
};
