import React, { useEffect } from 'react';
import { Flame, Sparkles } from 'lucide-react';
import { soundManager } from '../../audio/soundManager';
import { launchCoinFountain } from '../../fx/celebrations';

interface FreeSpinsModalProps {
  freeSpinsAwarded: number;
  multiplier: number;
  onStart: () => void;
}

export const FreeSpinsModal: React.FC<FreeSpinsModalProps> = ({
  freeSpinsAwarded,
  multiplier,
  onStart,
}) => {
  useEffect(() => {
    soundManager.playJackpotFanfare();
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
  }, [onStart]);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/90 backdrop-blur-md select-none">
      <div className="relative max-w-md w-full bg-gradient-to-b from-amber-950 via-casino-950 to-black border-2 border-amber-400 shadow-[0_0_80px_rgba(245,158,11,0.8)] rounded-3xl p-6 sm:p-8 text-center flex flex-col items-center">
        {/* Glowing Fire Icon */}
        <div className="w-16 h-16 rounded-full bg-gradient-to-tr from-amber-500 to-red-600 flex items-center justify-center shadow-[0_0_30px_rgba(239,68,68,0.8)] mb-4 animate-bounce">
          <Flame className="w-10 h-10 text-yellow-300 fill-yellow-300" />
        </div>

        <div className="flex items-center space-x-1 text-gold-bright text-xs font-bold uppercase tracking-widest mb-1">
          <Sparkles className="w-4 h-4" />
          <span>BONUS FEATURE TRIGGERED</span>
          <Sparkles className="w-4 h-4" />
        </div>

        <h1 className="text-4xl sm:text-5xl font-black text-amber-300 tracking-wide uppercase mb-2">
          FREE SPINS!
        </h1>

        <p className="text-slate-300 text-sm mb-6">
          You unlocked the high-roller Free Spins round with increased line payouts!
        </p>

        {/* Feature stats */}
        <div className="grid grid-cols-2 gap-3 w-full mb-6">
          <div className="bg-casino-900 border border-amber-500/40 p-3 rounded-2xl flex flex-col items-center">
            <span className="text-[10px] text-slate-400 font-bold uppercase">Spins</span>
            <span className="text-3xl font-black text-white">{freeSpinsAwarded}</span>
          </div>
          <div className="bg-casino-900 border border-amber-500/40 p-3 rounded-2xl flex flex-col items-center">
            <span className="text-[10px] text-slate-400 font-bold uppercase">Multiplier</span>
            <span className="text-3xl font-black text-yellow-400">{multiplier}X</span>
          </div>
        </div>

        {/* Start button */}
        <button
          onClick={() => {
            soundManager.playButtonClick();
            onStart();
          }}
          className="gold-btn w-full py-3.5 rounded-2xl font-black text-base uppercase tracking-wider text-casino-950 hover:scale-105 active:scale-95 transition-transform flex items-center justify-center space-x-2 shadow-[0_0_25px_rgba(245,158,11,0.7)]"
        >
          <span>START FREE SPINS</span>
          <span className="px-2 py-0.5 rounded bg-black/25 text-[11px] font-mono tracking-tight font-bold">SPACE</span>
        </button>
      </div>
    </div>
  );
};
