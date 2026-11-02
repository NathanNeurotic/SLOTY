import React, { useEffect, useRef, useState } from 'react';
import type { SymbolId } from '../../engine/types';
import { SymbolRenderer } from './SymbolRenderer';

interface ReelProps {
  reelIndex: number;
  symbols: SymbolId[]; // 4 landing symbols [row 0, row 1, row 2, row 3]
  isSpinning: boolean;
  isAnticipating?: boolean;
  winningRows?: Set<number>;
  scatterRows?: Set<number>;
  onStop?: (reelIndex: number) => void;
}

// 8 distinct symbols doubled to form a seamless 16-symbol infinite roll strip
const ROLLING_STRIP_A: SymbolId[] = [
  'WILD',
  'SEVEN',
  'DIAMOND',
  'BELL',
  'GOLDBAR',
  'MELON',
  'GRAPES',
  'ACE',
  'WILD',
  'SEVEN',
  'DIAMOND',
  'BELL',
  'GOLDBAR',
  'MELON',
  'GRAPES',
  'ACE',
];

const ROLLING_STRIP_B: SymbolId[] = [
  'SEVEN',
  'HORSESHOE',
  'COIN',
  'DIAMOND',
  'BELL',
  'KING',
  'QUEEN',
  'JACK',
  'SEVEN',
  'HORSESHOE',
  'COIN',
  'DIAMOND',
  'BELL',
  'KING',
  'QUEEN',
  'JACK',
];

export const Reel: React.FC<ReelProps> = ({
  reelIndex,
  symbols,
  isSpinning,
  isAnticipating = false,
  winningRows = new Set(),
  scatterRows = new Set(),
  onStop,
}) => {
  const [hasSettled, setHasSettled] = useState(false);
  const wasSpinningRef = useRef(isSpinning);
  const onStopRef = useRef(onStop);

  useEffect(() => {
    onStopRef.current = onStop;
  });

  // Stagger slightly different filler strips across adjacent reels
  const rollingStrip = reelIndex % 2 === 0 ? ROLLING_STRIP_A : ROLLING_STRIP_B;

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

  return (
    <div
      className={`relative flex-1 h-[320px] sm:h-[400px] md:h-[480px] overflow-hidden rounded-xl bg-gradient-to-b from-casino-950 via-casino-900 to-casino-950 border transition-all duration-300 ${
        isAnticipating
          ? 'border-neon-cyan shadow-[0_0_25px_rgba(0,240,255,0.8)] z-10 scale-[1.02]'
          : 'border-white/10'
      }`}
    >
      {/* Anticipation border glow */}
      {isAnticipating && (
        <div className="absolute inset-0 border-2 border-neon-cyan animate-pulse pointer-events-none z-30" />
      )}

      {/* 1. Fast GPU-Accelerated Rolling Strip (Only rendered when spinning) */}
      {isSpinning && (
        <div
          className="w-full flex flex-col animate-reel-rolling will-change-transform filter blur-[0.6px]"
          style={{
            animationDuration: isAnticipating ? '0.35s' : `${0.17 + (reelIndex % 3) * 0.02}s`,
          }}
        >
          {rollingStrip.map((sym, idx) => (
            <div
              key={idx}
              className="h-[80px] sm:h-[100px] md:h-[120px] w-full flex items-center justify-center p-1 sm:p-2 flex-shrink-0 opacity-80"
            >
              <SymbolRenderer id={sym} />
            </div>
          ))}
        </div>
      )}

      {/* 2. Resting / Settling 4-Row Landing Grid */}
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
                className={`h-[80px] sm:h-[100px] md:h-[120px] w-full flex items-center justify-center p-1 sm:p-2 flex-shrink-0 transition-opacity duration-200 ${
                  isWinning
                    ? 'bg-gold-500/20 ring-2 ring-gold-bright shadow-[0_0_20px_rgba(251,191,36,0.6)] z-10 scale-105'
                    : isScatterHighlight
                    ? 'bg-neon-cyan/20 ring-2 ring-neon-cyan shadow-[0_0_20px_rgba(0,240,255,0.6)] z-10 scale-105'
                    : winningRows.size > 0
                    ? 'opacity-35' // Dim non-winning symbols
                    : ''
                }`}
              >
                <SymbolRenderer
                  id={sym}
                  isWinning={isWinning}
                  isScatterHighlight={isScatterHighlight}
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
