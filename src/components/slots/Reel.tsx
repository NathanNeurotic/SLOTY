import React, { useEffect, useRef, useState } from 'react';
import type { SymbolId } from '../../engine/types';
import { SymbolRenderer } from './SymbolRenderer';

interface ReelProps {
  reelIndex: number;
  symbols: SymbolId[]; // landing symbols [row 0, row 1, ...]
  isSpinning: boolean;
  isAnticipating?: boolean;
  isDimmed?: boolean;
  winningRows?: Set<number>;
  scatterRows?: Set<number>;
  onStop?: (reelIndex: number) => void;
  rowCount?: number;
  gameId?: string;
}

// 24K Vault rolling filler strips
const VAULT_STRIP_A: SymbolId[] = ['WILD', 'SEVEN', 'DIAMOND', 'BELL', 'WILD', 'SEVEN', 'DIAMOND', 'BELL'];
const VAULT_STRIP_B: SymbolId[] = ['SEVEN', 'COIN', 'KING', 'ACE', 'SEVEN', 'COIN', 'KING', 'ACE'];

// Timberland Critters rolling filler strips
const TIMBER_STRIP_A: SymbolId[] = ['BEAR', 'WOLF', 'MUSHROOM', 'WOOD_A', 'BEAR', 'WOLF', 'MUSHROOM', 'WOOD_A'];
const TIMBER_STRIP_B: SymbolId[] = ['OWL', 'ACORN', 'FOX', 'WOOD_K', 'OWL', 'ACORN', 'FOX', 'WOOD_K'];

// Pixel Arcade rolling filler strips
const PIXEL_STRIP_A: SymbolId[] = ['CYBER_WILD', 'BOSS_DRAGON', 'GAMEPAD', 'PIXEL_A', 'CYBER_WILD', 'BOSS_DRAGON', 'GAMEPAD', 'PIXEL_A'];
const PIXEL_STRIP_B: SymbolId[] = ['PIXEL_CARTRIDGE', 'RETRO_TOKEN', 'HERO_KNIGHT', 'PIXEL_K', 'PIXEL_CARTRIDGE', 'RETRO_TOKEN', 'HERO_KNIGHT', 'PIXEL_K'];

export const Reel: React.FC<ReelProps> = ({
  reelIndex,
  symbols,
  isSpinning,
  isAnticipating = false,
  isDimmed = false,
  winningRows = new Set(),
  scatterRows = new Set(),
  onStop,
  rowCount = 4,
  gameId = 'vault-24k',
}) => {
  const [hasSettled, setHasSettled] = useState(false);
  const wasSpinningRef = useRef(isSpinning);
  const onStopRef = useRef(onStop);

  useEffect(() => {
    onStopRef.current = onStop;
  });

  // Stagger slightly different filler strips across adjacent reels depending on active game
  const isTimber = gameId === 'timber-critters';
  const isPixel = gameId === 'pixel-arcade';
  const rollingStrip = isTimber
    ? (reelIndex % 2 === 0 ? TIMBER_STRIP_A : TIMBER_STRIP_B)
    : isPixel
    ? (reelIndex % 2 === 0 ? PIXEL_STRIP_A : PIXEL_STRIP_B)
    : (reelIndex % 2 === 0 ? VAULT_STRIP_A : VAULT_STRIP_B);

  useEffect(() => {
    if (isSpinning) {
      setHasSettled(false);
      wasSpinningRef.current = true;
    } else if (wasSpinningRef.current) {
      // Transition from spinning to settled
      wasSpinningRef.current = false;
      setHasSettled(true);
      if (onStopRef.current) {
        onStopRef.current(reelIndex);
      }
      const t = setTimeout(() => {
        setHasSettled(false);
      }, 350);
      return () => clearTimeout(t);
    }
  }, [isSpinning, reelIndex]);

  const activeRowCount = rowCount || symbols.length || 4;

  return (
    <div
      data-reel-container={reelIndex}
      className={`relative flex-1 h-full min-h-0 overflow-hidden rounded-xl border transition-all duration-300 ${
        isDimmed ? 'opacity-40 brightness-75 scale-[0.98]' : ''
      } ${
        isTimber
          ? 'bg-gradient-to-b from-[#142419] via-[#0c1810] to-[#050e08]'
          : isPixel
          ? 'bg-gradient-to-b from-[#180938] via-[#0e0422] to-[#070114]'
          : 'bg-gradient-to-b from-casino-950 via-casino-900 to-casino-950'
      } ${
        isAnticipating
          ? isTimber
            ? 'border-2 border-emerald-400 animate-lightning-border z-10 scale-[1.03] shadow-[0_0_35px_rgba(52,211,153,0.9)]'
            : isPixel
            ? 'border-2 border-pink-400 animate-lightning-border z-10 scale-[1.03] shadow-[0_0_35px_rgba(236,72,153,0.9)]'
            : 'border-2 border-neon-cyan animate-lightning-border z-10 scale-[1.03] shadow-[0_0_35px_rgba(0,240,255,0.9)]'
          : isTimber
          ? 'border-emerald-800/40'
          : isPixel
          ? 'border-purple-600/40'
          : 'border-white/10'
      }`}
    >
      {/* High-Voltage Electric Anticipation Tension Frame & Energy Corona */}
      {isAnticipating && (
        <div className={`absolute inset-0 pointer-events-none z-30 flex flex-col justify-between p-1 ${
          isTimber
            ? 'bg-gradient-to-b from-emerald-500/20 via-amber-400/10 to-emerald-500/20 shadow-[inset_0_0_30px_rgba(52,211,153,0.7)]'
            : isPixel
            ? 'bg-gradient-to-b from-purple-500/20 via-pink-400/10 to-cyan-500/20 shadow-[inset_0_0_30px_rgba(236,72,153,0.7)]'
            : 'bg-gradient-to-b from-cyan-500/20 via-yellow-400/10 to-cyan-500/20 shadow-[inset_0_0_30px_rgba(0,240,255,0.7)]'
        }`}>
          <div className={`w-full text-center text-[8px] font-black tracking-widest rounded py-0.5 animate-pulse uppercase border ${
            isTimber
              ? 'text-emerald-200 bg-emerald-950/80 border-emerald-400/50'
              : isPixel
              ? 'text-pink-200 bg-purple-950/80 border-pink-400/50'
              : 'text-cyan-200 bg-cyan-950/80 border-cyan-400/50'
          }`}>
            {isTimber ? '🍃 OWL SCATTER LOCK 🍃' : isPixel ? '👾 CARTRIDGE LOCK 👾' : '⚡ SCATTER LOCK ⚡'}
          </div>
          <div className="w-full text-center text-[8px] font-black tracking-widest text-amber-300 bg-amber-950/80 rounded py-0.5 animate-ping uppercase border border-amber-400/50">
            ★ 1 MORE TO WIN ★
          </div>
        </div>
      )}

      {/* Reel Stop Landing Impact Shockwave Flare */}
      {hasSettled && (
        <div className={`absolute bottom-0 left-0 right-0 h-24 pointer-events-none z-30 animate-landing-flare ${
          isTimber
            ? 'bg-gradient-to-t from-emerald-400/80 via-amber-400/30 to-transparent'
            : 'bg-gradient-to-t from-gold-bright/80 via-amber-400/40 to-transparent'
        }`} />
      )}

      {/* 1. Fast GPU-Accelerated Rolling Strip (Only rendered when spinning) */}
      {isSpinning && (
        <div
          className="w-full h-full flex flex-col animate-reel-rolling will-change-transform"
          style={{
            animationDuration: isAnticipating ? '0.35s' : `${0.17 + (reelIndex % 3) * 0.02}s`,
          }}
        >
          {rollingStrip.map((sym, idx) => (
            <div
              key={idx}
              className="w-full flex items-center justify-center p-0.5 sm:p-1 flex-shrink-0 opacity-85"
              style={{ height: `${100 / activeRowCount}%` }}
            >
              <SymbolRenderer id={sym} reelIndex={reelIndex} rowIndex={idx} />
            </div>
          ))}
        </div>
      )}

      {/* 2. Resting / Settling Landing Grid */}
      {!isSpinning && (
        <div
          className={`w-full h-full flex flex-col justify-between ${
            hasSettled ? 'animate-reel-settle' : ''
          }`}
        >
          {symbols.map((sym, rowIdx) => {
            const isWinning = winningRows.has(rowIdx);
            const isScatterHighlight = scatterRows.has(rowIdx);

            return (
              <div
                key={rowIdx}
                data-reel={reelIndex}
                data-row={rowIdx}
                className={`flex-1 min-h-0 w-full flex items-center justify-center p-0.5 sm:p-1 transition-all duration-200 ${
                  isWinning
                    ? isTimber
                      ? 'bg-emerald-500/30 ring-2 ring-emerald-300 shadow-[0_0_25px_rgba(52,211,153,0.85)] z-10 animate-win-symbol-juice'
                      : 'bg-gold-500/25 ring-2 ring-gold-bright shadow-[0_0_25px_rgba(251,191,36,0.85)] z-10 animate-win-symbol-juice'
                    : isScatterHighlight
                    ? isTimber
                      ? 'bg-emerald-400/25 ring-2 ring-emerald-300 shadow-[0_0_20px_rgba(16,185,129,0.7)] z-10 scale-105'
                      : 'bg-neon-cyan/20 ring-2 ring-neon-cyan shadow-[0_0_20px_rgba(0,240,255,0.6)] z-10 scale-105'
                    : winningRows.size > 0
                    ? 'opacity-35' // Dim non-winning symbols
                    : ''
                }`}
              >
                <SymbolRenderer
                  id={sym}
                  isWinning={isWinning}
                  isScatterHighlight={isScatterHighlight}
                  reelIndex={reelIndex}
                  rowIndex={rowIdx}
                />
              </div>
            );
          })}
        </div>
      )}

      {/* 3D Cylindrical shadow overlays */}
      <div className="absolute inset-0 pointer-events-none bg-gradient-to-b from-black/60 via-transparent to-black/60 z-20" />
      <div className="absolute inset-0 pointer-events-none shadow-[inset_0_0_15px_rgba(0,0,0,0.8)] z-20" />
    </div>
  );
};
