import React from 'react';
import type { CasinoSceneId } from './SceneTypes';
import type { GameId } from '../../games/types';
import { Sparkles, Crown, Zap, Flame, Gamepad2, Trees } from 'lucide-react';

interface ColossalSceneSlideProps {
  sceneId: CasinoSceneId;
  multiplier?: number;
  onClose?: () => void;
  activeGameId?: GameId;
}

export const ColossalSceneSlide: React.FC<ColossalSceneSlideProps> = ({
  sceneId,
  multiplier = 3,
  activeGameId = 'vault-24k',
}) => {
  const isPixel = activeGameId === 'pixel-arcade';
  const isTimber = activeGameId === 'timber-critters';

  return (
    <div className={`absolute inset-0 z-20 rounded-xl overflow-hidden shadow-2xl border-2 flex flex-col items-center justify-between p-2 select-none animate-fadeIn ${
      isPixel
        ? 'border-pink-500 bg-[#0c041c]'
        : isTimber
        ? 'border-emerald-500 bg-[#07130a]'
        : 'border-yellow-400 bg-casino-950'
    }`}>
      {/* Top Banner */}
      <div className={`w-full flex items-center justify-between px-2 py-1 rounded-lg border shadow-md ${
        isPixel
          ? 'bg-gradient-to-r from-purple-950 via-pink-900 to-purple-950 border-pink-500/50'
          : isTimber
          ? 'bg-gradient-to-r from-emerald-950 via-teal-900 to-emerald-950 border-emerald-500/50'
          : 'bg-gradient-to-r from-amber-950 via-yellow-900 to-amber-950 border-yellow-400/40'
      }`}>
        <div className="flex items-center space-x-1.5">
          {isPixel ? (
            <Gamepad2 className="w-4 h-4 text-cyan-300 animate-pulse" />
          ) : isTimber ? (
            <Trees className="w-4 h-4 text-emerald-300 animate-pulse" />
          ) : (
            <Crown className="w-4 h-4 text-yellow-300 animate-pulse" />
          )}
          <span className={`text-[10px] sm:text-xs font-black uppercase tracking-wider font-mono ${
            isPixel ? 'text-pink-300' : isTimber ? 'text-emerald-300' : 'text-yellow-300'
          }`}>
            ★ {isPixel ? '8-BIT CYBERSPACE MEGA-STAGE' : isTimber ? 'GRIZZLY PEAK MOUNTAIN SUMMIT' : `COLOSSAL ${sceneId} SCENE SLIDE`} ★
          </span>
        </div>
        <div className="flex items-center space-x-1 bg-red-600/80 px-2 py-0.5 rounded-md border border-red-400">
          <Zap className="w-3 h-3 text-white fill-white" />
          <span className="text-[9px] font-black text-white font-mono">{multiplier}X MEGA WINS</span>
        </div>
      </div>

      {/* Central Panoramic Scene Vista */}
      <div className="relative flex-1 w-full my-1 rounded-lg overflow-hidden border border-white/10 flex items-center justify-center">
        {/* Pixel Arcade Panoramic Cyber Stage */}
        {isPixel ? (
          <div className="absolute inset-0 bg-gradient-to-br from-[#1b053a] via-[#090214] to-black flex items-center justify-center">
            {/* Cyber Grid Floor & Neon Wireframe */}
            <div className="absolute inset-0 opacity-40 bg-[linear-gradient(to_right,#00F0FF_1px,transparent_1px),linear-gradient(to_bottom,#FF007F_1px,transparent_1px)] bg-[size:24px_24px]" />
            <div className="relative z-10 flex flex-col items-center text-center">
              <div className="flex items-center space-x-2 text-2xl animate-bounce">
                <span>👾</span>
                <span>⭐</span>
                <span>🎮</span>
                <span>⭐</span>
                <span>👾</span>
              </div>
              <div className="text-sm font-black text-pink-300 font-mono uppercase tracking-widest mt-1">
                CYBER MEGA-BOSS ARENA ACTIVE
              </div>
              <div className="text-[10px] text-cyan-300 font-mono font-bold uppercase mt-0.5">
                Defeat the Mecha Dragon for 10,000X Progressive Jackpots
              </div>
            </div>
            <div className="absolute inset-0 bg-radial-gradient from-transparent via-pink-500/10 to-black/70 pointer-events-none" />
          </div>
        ) : isTimber ? (
          /* Timberland Mountain Ridge Vista */
          <div className="absolute inset-0 bg-gradient-to-br from-[#0c2e1b] via-[#05190e] to-black flex items-center justify-center">
            <div className="relative z-10 flex flex-col items-center text-center">
              <div className="flex items-center space-x-2 text-2xl animate-bounce">
                <span>🌲</span>
                <span>🐻</span>
                <span>🍯</span>
                <span>🦉</span>
                <span>🌲</span>
              </div>
              <div className="text-sm font-black text-emerald-300 font-serif uppercase tracking-widest mt-1">
                GRIZZLY PEAK ENCHANTED SUMMIT
              </div>
              <div className="text-[10px] text-amber-300 font-bold uppercase mt-0.5">
                Golden Honeycomb Forest Harvest • All Critters 3X Boosted
              </div>
            </div>
            <div className="absolute inset-0 bg-radial-gradient from-transparent via-emerald-400/10 to-black/70 pointer-events-none" />
          </div>
        ) : (
          /* 24K Vault Scenes */
          <>
            {sceneId === 'VAULT' && (
              <div className="absolute inset-0 bg-gradient-to-br from-[#0c2e1f] via-[#051910] to-black flex items-center justify-center">
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
          </>
        )}

        {/* Ambient Shimmer Sheen */}
        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent animate-shimmer-sweep pointer-events-none" />
      </div>

      {/* Bottom Scenic Status */}
      <div className={`w-full text-center py-0.5 rounded border border-white/5 ${
        isPixel ? 'bg-purple-950/80 text-pink-300' : isTimber ? 'bg-emerald-950/80 text-emerald-300' : 'bg-black/60 text-slate-300'
      }`}>
        <span className="text-[8px] sm:text-[9px] font-bold uppercase tracking-wider font-mono">
          {isPixel
            ? '🕹️ LEVEL 99 STAGE CLEAR • 6x5 MEGA COMBOS TRIPLED • INSERT COIN TO RESUME 🕹️'
            : isTimber
            ? '🌲 TIMBERLAND CRITTERS CASCADE • 25 WILD PAYLINES ACTIVE 🌲'
            : '★ COLOSSAL SYMBOL REELS MERGED INTO PANORAMA SCENE ★'}
        </span>
      </div>
    </div>
  );
};
