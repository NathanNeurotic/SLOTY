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

// 24K Vault rolling filler strips (4 rows x 2 = 8 symbols)
const VAULT_STRIP_A: SymbolId[] = ['WILD', 'SEVEN', 'DIAMOND', 'BELL', 'WILD', 'SEVEN', 'DIAMOND', 'BELL'];
const VAULT_STRIP_B: SymbolId[] = ['SEVEN', 'COIN', 'KING', 'ACE', 'SEVEN', 'COIN', 'KING', 'ACE'];

// Timberland Critters rolling filler strips (3 rows x 2 = 6 symbols)
const TIMBER_STRIP_A: SymbolId[] = ['BEAR', 'WOLF', 'WOOD_A', 'BEAR', 'WOLF', 'WOOD_A'];
const TIMBER_STRIP_B: SymbolId[] = ['FOX', 'OWL', 'ACORN', 'FOX', 'OWL', 'ACORN'];

// Pixel Arcade rolling filler strips (5 rows x 2 = 10 symbols)
const PIXEL_STRIP_A: SymbolId[] = [
  'CYBER_WILD', 'BOSS_DRAGON', 'GAMEPAD', 'PIXEL_A', 'PIXEL_10',
  'CYBER_WILD', 'BOSS_DRAGON', 'GAMEPAD', 'PIXEL_A', 'PIXEL_10'
];
const PIXEL_STRIP_B: SymbolId[] = [
  'PIXEL_CARTRIDGE', 'RETRO_TOKEN', 'HERO_KNIGHT', 'PIXEL_K', 'JOYSTICK',
  'PIXEL_CARTRIDGE', 'RETRO_TOKEN', 'HERO_KNIGHT', 'PIXEL_K', 'JOYSTICK'
];

// PS2 Legends rolling filler strips (4 rows x 2 = 8 symbols)
const PS2_STRIP_A: SymbolId[] = ['PS2_LOGO', 'EMOTION_ENGINE', 'PS_TRIANGLE', 'PS_CROSS', 'PS2_LOGO', 'EMOTION_ENGINE', 'PS_TRIANGLE', 'PS_CROSS'];
const PS2_STRIP_B: SymbolId[] = ['DVD_DISC', 'MEMORY_CARD', 'DUALSHOCK', 'PS_CIRCLE', 'DVD_DISC', 'MEMORY_CARD', 'DUALSHOCK', 'PS_CIRCLE'];

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
  const isPs2 = gameId === 'ps2-legends';
  const rollingStrip = isTimber
    ? (reelIndex % 2 === 0 ? TIMBER_STRIP_A : TIMBER_STRIP_B)
    : isPixel
    ? (reelIndex % 2 === 0 ? PIXEL_STRIP_A : PIXEL_STRIP_B)
    : isPs2
    ? (reelIndex % 2 === 0 ? PS2_STRIP_A : PS2_STRIP_B)
    : (reelIndex % 2 === 0 ? VAULT_STRIP_A : VAULT_STRIP_B);

  useEffect(() => {
    if (isSpinning) {
      wasSpinningRef.current = true;
      const raf = requestAnimationFrame(() => setHasSettled(false));
      return () => cancelAnimationFrame(raf);
    } else if (wasSpinningRef.current) {
      // Transition from spinning to settled
      wasSpinningRef.current = false;
      const raf = requestAnimationFrame(() => {
        setHasSettled(true);
        if (onStopRef.current) {
          onStopRef.current(reelIndex);
        }
      });
      const t = setTimeout(() => {
        setHasSettled(false);
      }, 350);
      return () => {
        cancelAnimationFrame(raf);
        clearTimeout(t);
      };
    }
  }, [isSpinning, reelIndex]);

  const activeRowCount = rowCount || 4;
  const displaySymbols = (symbols || []).slice(0, activeRowCount);
  while (displaySymbols.length < activeRowCount) {
    displaySymbols.push(
      isPs2 ? 'PS_CROSS' : isPixel ? 'PIXEL_10' : isTimber ? 'WOOD_A' : 'SEVEN'
    );
  }

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
          : isPs2
          ? 'bg-gradient-to-b from-[#030712] via-[#050d24] to-[#02050e]'
          : 'bg-gradient-to-b from-casino-950 via-casino-900 to-casino-950'
      } ${
        isAnticipating
          ? isTimber
            ? 'border-2 border-emerald-400 animate-lightning-border z-10 scale-[1.03] shadow-[0_0_35px_rgba(52,211,153,0.9)]'
            : isPixel
            ? 'border-2 border-pink-400 animate-lightning-border z-10 scale-[1.03] shadow-[0_0_35px_rgba(236,72,153,0.9)]'
            : isPs2
            ? 'border-2 border-[#006FCD] animate-lightning-border z-10 scale-[1.03] shadow-[0_0_35px_rgba(0,111,205,0.95)]'
            : 'border-2 border-neon-cyan animate-lightning-border z-10 scale-[1.03] shadow-[0_0_35px_rgba(0,240,255,0.9)]'
          : isTimber
          ? 'border-emerald-800/40'
          : isPixel
          ? 'border-purple-600/40'
          : isPs2
          ? 'border-[#006FCD]/40'
          : 'border-white/10'
      }`}
    >
      {/* Physical Cabinet Bezel Aperture Shadows (Seamless entrance/exit masking) */}
      <div className="pointer-events-none absolute inset-x-0 top-0 h-6 sm:h-8 bg-gradient-to-b from-black/85 via-black/35 to-transparent z-20" />
      <div className="pointer-events-none absolute inset-x-0 bottom-0 h-6 sm:h-8 bg-gradient-to-t from-black/85 via-black/35 to-transparent z-20" />

      {/* High-Voltage Electric Anticipation Tension Frame & Energy Corona */}
      {isAnticipating && (
        <div className={`absolute inset-0 pointer-events-none z-30 flex flex-col justify-between p-1 ${
          isTimber
            ? 'bg-gradient-to-b from-emerald-500/20 via-amber-400/10 to-emerald-500/20 shadow-[inset_0_0_30px_rgba(52,211,153,0.7)]'
            : isPixel
            ? 'bg-gradient-to-b from-purple-500/20 via-pink-400/10 to-cyan-500/20 shadow-[inset_0_0_30px_rgba(236,72,153,0.7)]'
            : isPs2
            ? 'bg-gradient-to-b from-[#006FCD]/25 via-cyan-400/15 to-[#006FCD]/25 shadow-[inset_0_0_30px_rgba(0,111,205,0.8)]'
            : 'bg-gradient-to-b from-cyan-500/20 via-yellow-400/10 to-cyan-500/20 shadow-[inset_0_0_30px_rgba(0,240,255,0.7)]'
        }`}>
          <div className={`w-full text-center text-[8px] font-black tracking-widest rounded py-0.5 animate-pulse uppercase border ${
            isTimber
              ? 'text-emerald-200 bg-emerald-950/80 border-emerald-400/50'
              : isPixel
              ? 'text-pink-200 bg-purple-950/80 border-pink-400/50'
              : isPs2
              ? 'text-cyan-200 bg-[#001026]/90 border-cyan-400/50'
              : 'text-cyan-200 bg-cyan-950/80 border-cyan-400/50'
          }`}>
            {isTimber ? '🍃 OWL SCATTER LOCK 🍃' : isPixel ? '👾 CARTRIDGE LOCK 👾' : isPs2 ? '💿 DVD SCATTER LOCK 💿' : '⚡ SCATTER LOCK ⚡'}
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
            : isPixel
            ? 'bg-gradient-to-t from-purple-400/80 via-pink-400/30 to-transparent'
            : isPs2
            ? 'bg-gradient-to-t from-[#006FCD]/80 via-cyan-400/30 to-transparent'
            : 'bg-gradient-to-t from-gold-bright/80 via-amber-400/40 to-transparent'
        }`} />
      )}
      {/* 1. Fast GPU-Accelerated Rolling Strip (Absolute overlay, strictly clipped to reel bounds) */}
      {isSpinning && (
        <div className="absolute inset-0 overflow-hidden pointer-events-none z-10">
          <div
            className="absolute inset-x-0 top-0 flex flex-col animate-reel-rolling will-change-transform"
            style={{
              height: '200%',
              animationDuration: isAnticipating ? '0.35s' : `${0.17 + (reelIndex % 3) * 0.02}s`,
            }}
          >
            {Array.from({ length: activeRowCount * 2 }, (_, i) => {
              const sym = rollingStrip[(i + reelIndex) % rollingStrip.length];
              return (
                <div
                  key={i}
                  className="w-full flex-shrink-0 min-h-0 flex items-center justify-center p-0.5 sm:p-1"
                  style={{ height: `${100 / (activeRowCount * 2)}%` }}
                >
                  <SymbolRenderer id={sym} reelIndex={reelIndex} rowIndex={i % activeRowCount} />
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* 2. Resting / Settling Landing Grid (Maintains exact in-flow reel height; hidden via visibility+opacity while spinning) */}
      <div
        aria-hidden={isSpinning}
        style={{
          visibility: isSpinning ? 'hidden' : 'visible',
          opacity: isSpinning ? 0 : 1,
        }}
        className={`w-full h-full flex flex-col ${
          hasSettled ? 'animate-reel-settle' : ''
        }`}
      >
          {displaySymbols.map((sym, rowIdx) => {
            const isWinning = winningRows.has(rowIdx);
            const isScatterHighlight = scatterRows.has(rowIdx);

            return (
              <div
                key={rowIdx}
                data-reel={reelIndex}
                data-row={rowIdx}
                style={{ height: `${100 / activeRowCount}%` }}
                className={`w-full flex-shrink-0 min-h-0 flex items-center justify-center p-0.5 sm:p-1 transition-all duration-200 ${
                  isWinning
                    ? isTimber
                      ? 'bg-emerald-500/30 ring-2 ring-emerald-300 shadow-[0_0_25px_rgba(52,211,153,0.85)] z-10 animate-win-symbol-juice'
                      : isPixel
                      ? 'bg-purple-500/30 ring-2 ring-pink-400 shadow-[0_0_25px_rgba(236,72,153,0.85)] z-10 animate-win-symbol-juice'
                      : isPs2
                      ? 'bg-[#006FCD]/30 ring-2 ring-[#00F0FF] shadow-[0_0_25px_rgba(0,111,205,0.85)] z-10 animate-win-symbol-juice'
                      : 'bg-gold-500/25 ring-2 ring-gold-bright shadow-[0_0_25px_rgba(251,191,36,0.85)] z-10 animate-win-symbol-juice'
                    : isScatterHighlight
                    ? isTimber
                      ? 'bg-emerald-400/25 ring-2 ring-emerald-300 shadow-[0_0_20px_rgba(16,185,129,0.7)] z-10 scale-105'
                      : isPixel
                      ? 'bg-pink-400/25 ring-2 ring-pink-300 shadow-[0_0_20px_rgba(236,72,153,0.7)] z-10 scale-105'
                      : isPs2
                      ? 'bg-[#00F0FF]/25 ring-2 ring-[#006FCD] shadow-[0_0_20px_rgba(0,111,205,0.7)] z-10 scale-105'
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

      {/* Themed Reel Background Textures */}
      {isPixel ? (
        <div
          className="absolute inset-0 pointer-events-none z-10 opacity-35"
          style={{
            backgroundImage: 'repeating-linear-gradient(0deg, rgba(0,0,0,0.4) 0px, rgba(0,0,0,0.4) 1px, transparent 1px, transparent 3px)',
          }}
        />
      ) : isTimber ? (
        <div
          className="absolute inset-0 pointer-events-none z-10 opacity-25"
          style={{
            backgroundImage: 'repeating-linear-gradient(90deg, rgba(245,158,11,0.08) 0px, transparent 2px, transparent 20px)',
          }}
        />
      ) : isPs2 ? (
        <div
          className="absolute inset-0 pointer-events-none z-10 opacity-30"
          style={{
            backgroundImage: 'repeating-linear-gradient(0deg, rgba(0,111,205,0.14) 0px, transparent 1px, transparent 4px)',
          }}
        />
      ) : (
        <div
          className="absolute inset-0 pointer-events-none z-10 opacity-30"
          style={{
            backgroundImage: 'linear-gradient(135deg, rgba(245,158,11,0.08) 0%, transparent 40%, rgba(253,224,71,0.1) 60%, transparent 100%)',
          }}
        />
      )}

      {/* 3D Cylindrical shadow overlays */}
      <div className="absolute inset-0 pointer-events-none bg-gradient-to-b from-black/60 via-transparent to-black/60 z-20" />
      <div className="absolute inset-0 pointer-events-none shadow-[inset_0_0_15px_rgba(0,0,0,0.8)] z-20" />
    </div>
  );
};
