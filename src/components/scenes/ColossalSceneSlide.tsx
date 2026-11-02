import React from 'react';
import type { CasinoSceneId } from './SceneTypes';
import { Sparkles, Crown, Zap, Flame } from 'lucide-react';

interface ColossalSceneSlideProps {
  sceneId: CasinoSceneId;
  multiplier?: number;
  onClose?: () => void;
}

export const ColossalSceneSlide: React.FC<ColossalSceneSlideProps> = ({
  sceneId,
  multiplier = 3,
}) => {
  return (
    <div className="absolute inset-0 z-20 rounded-xl overflow-hidden shadow-2xl border-2 border-yellow-400 bg-casino-950 flex flex-col items-center justify-between p-2 select-none animate-fadeIn">
      {/* Top Banner */}
      <div className="w-full flex items-center justify-between px-2 py-1 bg-gradient-to-r from-amber-950 via-yellow-900 to-amber-950 rounded-lg border border-yellow-400/40 shadow-md">
        <div className="flex items-center space-x-1.5">
          <Crown className="w-4 h-4 text-yellow-300 animate-pulse" />
          <span className="text-[10px] sm:text-xs font-black uppercase tracking-wider text-yellow-300">
            ★ COLOSSAL {sceneId} SCENE SLIDE ★
          </span>
        </div>
        <div className="flex items-center space-x-1 bg-red-600/80 px-2 py-0.5 rounded-md border border-red-400">
          <Zap className="w-3 h-3 text-white fill-white" />
          <span className="text-[9px] font-black text-white">{multiplier}X MEGA WINS</span>
        </div>
      </div>

      {/* Central Panoramic Scene Vista */}
      <div className="relative flex-1 w-full my-1 rounded-lg overflow-hidden border border-white/10 flex items-center justify-center">
        {/* Scenic Background */}
        {sceneId === 'VAULT' && (
          <div className="absolute inset-0 bg-gradient-to-br from-[#0c2e1f] via-[#051910] to-black flex items-center justify-center">
            {/* Stacks of 3D Gold Bars Illustration */}
            <div className="relative flex flex-col items-center">
              <div className="flex space-x-2">
                <div className="w-20 h-9 rounded bg-gradient-to-b from-yellow-300 via-amber-500 to-amber-800 border border-yellow-200 shadow-xl flex items-center justify-center">
                  <span className="text-[8px] font-black text-amber-950">999.9 GOLD</span>
                </div>
                <div className="w-20 h-9 rounded bg-gradient-to-b from-yellow-300 via-amber-500 to-amber-800 border border-yellow-200 shadow-xl flex items-center justify-center">
                  <span className="text-[8px] font-black text-amber-950">999.9 GOLD</span>
                </div>
              </div>
              <div className="w-28 h-10 rounded bg-gradient-to-b from-yellow-200 via-amber-400 to-amber-700 border-2 border-white shadow-2xl flex items-center justify-center mt-1">
                <span className="text-[9px] font-black text-amber-950">FORT KNOX RESERVE</span>
              </div>
            </div>
            <div className="absolute inset-0 bg-radial-gradient from-transparent via-amber-400/10 to-black/60 pointer-events-none" />
          </div>
        )}

        {sceneId === 'PENTHOUSE' && (
          <div className="absolute inset-0 bg-gradient-to-br from-[#1e0a3d] via-[#100624] to-black flex items-center justify-center">
            <div className="text-center z-10">
              <Sparkles className="w-8 h-8 text-yellow-300 mx-auto animate-bounce" />
              <div className="text-sm font-black gold-gradient-text uppercase mt-1">
                HIGH ROLLER MIDNIGHT SKYLINE
              </div>
              <div className="text-[10px] text-cyan-300 font-bold uppercase mt-0.5">
                Raining $100 Banknotes &amp; Multipliers
              </div>
            </div>
          </div>
        )}

        {sceneId === 'MINT' && (
          <div className="absolute inset-0 bg-gradient-to-br from-[#3b0d0d] via-[#1f0606] to-black flex items-center justify-center">
            <div className="relative flex flex-col items-center">
              <Flame className="w-10 h-10 text-orange-400 fill-orange-400 animate-pulse" />
              <div className="text-sm font-black text-amber-300 uppercase tracking-wider mt-1">
                MOLTEN COIN FORGE ACTIVE
              </div>
              <div className="text-[10px] text-red-300 font-bold uppercase">
                Stamping Solid 24K Bullion Coins
              </div>
            </div>
          </div>
        )}

        {sceneId === 'HEIST' && (
          <div className="absolute inset-0 bg-gradient-to-br from-[#02182b] via-[#050814] to-black flex items-center justify-center">
            <div className="text-center z-10">
              <div className="text-base font-black text-neon-cyan uppercase animate-pulse">
                ⚡ VAULT ALARM CRACKED ⚡
              </div>
              <div className="text-[10px] text-yellow-300 font-bold uppercase mt-1">
                Cash Vault Overflowing With Loot
              </div>
            </div>
          </div>
        )}

        {/* Ambient Shimmer Sheen */}
        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent animate-shimmer-sweep pointer-events-none" />
      </div>

      {/* Bottom Scenic Status */}
      <div className="w-full text-center py-0.5 bg-black/60 rounded border border-white/5">
        <span className="text-[9px] font-black text-gold-light tracking-widest uppercase">
          ★ COLOSSAL SYMBOL REELS MERGED INTO PANORAMA SCENE ★
        </span>
      </div>
    </div>
  );
};
