import React, { useEffect, useState } from 'react';
import type { CasinoScene } from './SceneTypes';
import { soundManager } from '../../audio/soundManager';

interface VaultBlastDoorsProps {
  isOpen: boolean;
  targetScene: CasinoScene | null;
  onTransitionComplete: () => void;
}

export const VaultBlastDoors: React.FC<VaultBlastDoorsProps> = ({
  isOpen,
  targetScene,
  onTransitionComplete,
}) => {
  const [phase, setPhase] = useState<'idle' | 'closing' | 'locked' | 'opening'>('idle');

  useEffect(() => {
    if (isOpen && targetScene) {
      const raf = requestAnimationFrame(() => {
        setPhase('closing');
        soundManager.playVaultSlide();
      });

      // Door closed & locked after 350ms
      const t1 = setTimeout(() => {
        setPhase('locked');
        soundManager.playVaultLock();
      }, 350);

      // Begin opening after reveal pause
      const t2 = setTimeout(() => {
        setPhase('opening');
        soundManager.playVaultSlide();
      }, 950);

      // Complete transition
      const t3 = setTimeout(() => {
        setPhase('idle');
        onTransitionComplete();
      }, 1450);

      return () => {
        cancelAnimationFrame(raf);
        clearTimeout(t1);
        clearTimeout(t2);
        clearTimeout(t3);
      };
    }
  }, [isOpen, targetScene, onTransitionComplete]);

  if (phase === 'idle') return null;

  const isClosed = phase === 'closing' || phase === 'locked';

  return (
    <div className="fixed inset-0 z-50 pointer-events-none select-none flex overflow-hidden">
      {/* Left Blast Door Half */}
      <div
        className={`w-1/2 h-full bg-gradient-to-r from-slate-950 via-slate-900 to-slate-800 border-r-4 border-yellow-400 shadow-2xl relative transition-transform duration-500 ease-out flex items-center justify-end ${
          isClosed ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        {/* Steel Plating & Rivets */}
        <div className="absolute inset-0 bg-[radial-gradient(#1e293b_1px,transparent_1px)] [background-size:16px_16px] opacity-40" />

        {/* Hazard Caution Warning Stripe */}
        <div className="absolute top-0 bottom-0 right-4 w-3 bg-gradient-to-b from-yellow-400 via-amber-600 to-yellow-400 opacity-80" />

        {/* Heavy Mechanical Locking Bolt Bar */}
        <div className="w-16 h-8 bg-gradient-to-r from-slate-700 to-amber-500 rounded-l-md border border-white/40 shadow-xl mr-2" />

        {/* Hydraulic Piston Cylinders */}
        <div className="absolute top-1/4 left-6 w-8 h-32 bg-gradient-to-r from-slate-600 to-slate-800 rounded-md border border-slate-500 flex flex-col justify-around py-2">
          <div className="h-1.5 w-full bg-cyan-400 shadow-[0_0_8px_#38BDF8]" />
          <div className="h-1.5 w-full bg-cyan-400 shadow-[0_0_8px_#38BDF8]" />
        </div>
      </div>

      {/* Right Blast Door Half */}
      <div
        className={`w-1/2 h-full bg-gradient-to-l from-slate-950 via-slate-900 to-slate-800 border-l-4 border-yellow-400 shadow-2xl relative transition-transform duration-500 ease-out flex items-center justify-start ${
          isClosed ? 'translate-x-0' : 'translate-x-full'
        }`}
      >
        {/* Steel Plating & Rivets */}
        <div className="absolute inset-0 bg-[radial-gradient(#1e293b_1px,transparent_1px)] [background-size:16px_16px] opacity-40" />

        {/* Hazard Caution Warning Stripe */}
        <div className="absolute top-0 bottom-0 left-4 w-3 bg-gradient-to-b from-yellow-400 via-amber-600 to-yellow-400 opacity-80" />

        {/* Heavy Mechanical Locking Bolt Bar */}
        <div className="w-16 h-8 bg-gradient-to-l from-slate-700 to-amber-500 rounded-r-md border border-white/40 shadow-xl ml-2" />

        {/* Hydraulic Piston Cylinders */}
        <div className="absolute top-1/4 right-6 w-8 h-32 bg-gradient-to-l from-slate-600 to-slate-800 rounded-md border border-slate-500 flex flex-col justify-around py-2">
          <div className="h-1.5 w-full bg-amber-400 shadow-[0_0_8px_#F59E0B]" />
          <div className="h-1.5 w-full bg-amber-400 shadow-[0_0_8px_#F59E0B]" />
        </div>
      </div>

      {/* Center Vault Wheel & Announcement Seal */}
      <div
        className={`absolute inset-0 flex flex-col items-center justify-center transition-all duration-300 ${
          isClosed ? 'opacity-100 scale-100' : 'opacity-0 scale-75'
        }`}
      >
        {/* 3D Rotating Vault Combination Wheel */}
        <div
          className={`relative w-36 h-36 sm:w-44 sm:h-44 rounded-full bg-gradient-to-tr from-slate-900 via-slate-700 to-slate-800 border-4 border-yellow-400 shadow-[0_0_50px_rgba(245,158,11,0.8)] flex items-center justify-center ${
            phase === 'closing' ? 'animate-spin' : ''
          }`}
          style={{ animationDuration: '0.8s' }}
        >
          {/* Wheel Spokes */}
          <div className="absolute w-full h-4 bg-gradient-to-r from-yellow-500 to-amber-600 rounded-full" />
          <div className="absolute h-full w-4 bg-gradient-to-b from-yellow-500 to-amber-600 rounded-full" />
          <div className="absolute w-full h-4 bg-gradient-to-r from-yellow-500 to-amber-600 rounded-full transform rotate-45" />
          <div className="absolute w-full h-4 bg-gradient-to-r from-yellow-500 to-amber-600 rounded-full transform -rotate-45" />

          {/* Center Vault Core */}
          <div className="relative z-10 w-20 h-20 rounded-full bg-gradient-to-b from-amber-400 via-yellow-500 to-amber-700 border-2 border-white shadow-2xl flex items-center justify-center">
            <span className="font-mono text-xs sm:text-sm font-black text-slate-950 uppercase">
              {phase === 'locked' ? 'UNLOCKED' : 'SLOTY'}
            </span>
          </div>
        </div>

        {/* Scene Title Marquee Banner */}
        {targetScene && (
          <div className="mt-6 px-6 py-2.5 rounded-2xl bg-casino-950/95 border-2 border-yellow-400 shadow-[0_0_30px_rgba(245,158,11,0.9)] text-center animate-pulse">
            <div className="text-[10px] font-black uppercase tracking-widest text-yellow-300">
              ENTERING SCENIC ENVIRONMENT
            </div>
            <div className="text-lg sm:text-2xl font-black gold-gradient-text uppercase tracking-wider mt-0.5">
              {targetScene.name}
            </div>
            <div className="text-[10px] font-bold text-slate-400 tracking-wide mt-0.5">
              {targetScene.tagline}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
