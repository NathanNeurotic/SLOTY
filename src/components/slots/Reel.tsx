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

// 4 distinct symbols doubled to form a lean, high-framerate 8-symbol infinite roll strip
const ROLLING_STRIP_A: SymbolId[] = [
  'WILD',
  'SEVEN',
  'DIAMOND',
  'BELL',
  'WILD',
  'SEVEN',
  'DIAMOND',
  'BELL',
];

const ROLLING_STRIP_B: SymbolId[] = [
  'SEVEN',
  'COIN',
  'KING',
  'ACE',
  'SEVEN',
  'COIN',
  'KING',
  'ACE',
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
          ? 'border-2 border-neon-cyan animate-lightning-border z-10 scale-[1.03] shadow-[0_0_35px_rgba(0,240,255,0.9)]'
          : 'border-white/10'
      }`}
    >
      {/* High-Voltage Electric Anticipation Tension Frame & Energy Corona */}
      {isAnticipating && (
        <div className="absolute inset-0 bg-gradient-to-b from-cyan-500/20 via-yellow-400/10 to-cyan-500/20 pointer-events-none z-30 shadow-[inset_0_0_30px_rgba(0,240,255,0.7)] flex flex-col justify-between p-1">
          <div className="w-full text-center text-[8px] font-black tracking-widest text-cyan-200 bg-cyan-950/80 rounded py-0.5 animate-pulse uppercase border border-cyan-400/50">
            ⚡ SCATTER LOCK ⚡
          </div>
          <div className="w-full text-center text-[8px] font-black tracking-widest text-amber-300 bg-amber-950/80 rounded py-0.5 animate-ping uppercase border border-amber-400/50">
            ★ 1 MORE TO WIN ★
          </div>
        </div>
      )}

      {/* Reel Stop Landing Impact Shockwave Flare */}
      {hasSettled && (
        <div className="absolute bottom-0 left-0 right-0 h-24 bg-gradient-to-t from-gold-bright/80 via-amber-400/40 to-transparent pointer-events-none z-30 animate-landing-flare" />
      )}

      {/* 1. Fast GPU-Accelerated Rolling Strip (Only rendered when spinning) */}
      {isSpinning && (
        <div
          className="w-full flex flex-col animate-reel-rolling will-change-transform"
          style={{
            animationDuration: isAnticipating ? '0.35s' : `${0.17 + (reelIndex % 3) * 0.02}s`,
          }}
        >
          {rollingStrip.map((sym, idx) => (
            <div
              key={idx}
              className="h-[80px] sm:h-[100px] md:h-[120px] w-full flex items-center justify-center p-1 sm:p-2 flex-shrink-0 opacity-85"
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
                className={`h-[80px] sm:h-[100px] md:h-[120px] w-full flex items-center justify-center p-1 sm:p-2 flex-shrink-0 transition-all duration-200 ${
                  isWinning
                    ? 'bg-gold-500/25 ring-2 ring-gold-bright shadow-[0_0_25px_rgba(251,191,36,0.85)] z-10 animate-win-symbol-juice'
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
