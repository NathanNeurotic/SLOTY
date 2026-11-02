import React, { useEffect, useState, useRef } from 'react';
import type { SymbolId } from '../../engine/types';
import { SymbolRenderer } from './SymbolRenderer';
import { WEIGHTED_SYMBOL_POOL } from '../../engine/symbols';

interface ReelProps {
  reelIndex: number;
  finalSymbols: SymbolId[]; // 3 symbols [top, mid, bottom]
  isSpinning: boolean;
  stopDelay: number; // ms to stop this specific reel
  isAnticipating?: boolean;
  winningRows?: Set<number>;
  scatterRows?: Set<number>;
  onStop: (reelIndex: number) => void;
}

export const Reel: React.FC<ReelProps> = ({
  reelIndex,
  finalSymbols,
  isSpinning,
  stopDelay,
  isAnticipating = false,
  winningRows = new Set(),
  scatterRows = new Set(),
  onStop,
}) => {
  const [displayedSymbols, setDisplayedSymbols] = useState<SymbolId[]>(finalSymbols);
  const [isAnimating, setIsAnimating] = useState(false);
  const [stripOffset, setStripOffset] = useState(0);
  const [isBouncing, setIsBouncing] = useState(false);

  // Buffer of symbols for the reel strip during spin
  const [stripSymbols, setStripSymbols] = useState<SymbolId[]>([]);
  const stopTimeoutRef = useRef<number | null>(null);

  // Generate random filler symbols whenever a spin starts
  useEffect(() => {
    if (isSpinning) {
      // Build a strip of 24 random symbols + the target final 3 symbols at the end
      const stripLength = 24 + reelIndex * 4;
      const filler: SymbolId[] = [];
      for (let i = 0; i < stripLength; i++) {
        const rand = WEIGHTED_SYMBOL_POOL[Math.floor(Math.random() * WEIGHTED_SYMBOL_POOL.length)];
        filler.push(rand);
      }
      const fullStrip = [...filler, ...finalSymbols];
      setStripSymbols(fullStrip);
      setIsAnimating(true);
      setIsBouncing(false);

      // Start scrolling the strip
      // We will scroll from top to bottom
      requestAnimationFrame(() => {
        setStripOffset((fullStrip.length - 3) * 100); // 100px per cell unit
      });

      // Schedule reel stop
      stopTimeoutRef.current = window.setTimeout(() => {
        setIsAnimating(false);
        setDisplayedSymbols(finalSymbols);
        setIsBouncing(true);
        onStop(reelIndex);

        // Reset bounce state after physics recoil
        setTimeout(() => {
          setIsBouncing(false);
        }, 350);
      }, stopDelay);
    } else {
      setDisplayedSymbols(finalSymbols);
      setIsAnimating(false);
      setIsBouncing(false);
      setStripOffset(0);
    }

    return () => {
      if (stopTimeoutRef.current) {
        clearTimeout(stopTimeoutRef.current);
      }
    };
  }, [isSpinning, stopDelay, finalSymbols, reelIndex, onStop]);

  return (
    <div
      className={`relative flex-1 h-[270px] sm:h-[330px] md:h-[390px] overflow-hidden rounded-lg bg-gradient-to-b from-casino-900 via-casino-850 to-casino-900 border transition-all duration-300 ${
        isAnticipating
          ? 'border-neon-cyan shadow-[0_0_25px_rgba(0,240,255,0.7)] z-10 scale-[1.02]'
          : 'border-white/10'
      }`}
    >
      {/* Anticipation Flame / Glow Header if anticipation is active */}
      {isAnticipating && (
        <div className="absolute inset-0 border-2 border-neon-cyan animate-pulse pointer-events-none z-30" />
      )}

      {/* Reel content */}
      {isAnimating ? (
        <div
          className="absolute inset-x-0 w-full transition-transform duration-[ease-in] blur-[1px]"
          style={{
            transform: `translateY(-${stripOffset}%)`,
            transitionDuration: `${stopDelay}ms`,
            transitionTimingFunction: isAnticipating
              ? 'cubic-bezier(0.1, 0.7, 0.1, 1)'
              : 'cubic-bezier(0.25, 0.1, 0.25, 1)',
          }}
        >
          {stripSymbols.map((sym, idx) => (
            <div
              key={idx}
              className="h-[90px] sm:h-[110px] md:h-[130px] w-full flex items-center justify-center p-2"
            >
              <SymbolRenderer id={sym} />
            </div>
          ))}
        </div>
      ) : (
        <div
          className={`h-full w-full flex flex-col justify-around py-1 ${
            isBouncing ? 'animate-bounce-soft' : ''
          }`}
        >
          {displayedSymbols.map((sym, rowIdx) => {
            const isWinning = winningRows.has(rowIdx);
            const isScatterHighlight = scatterRows.has(rowIdx);
            return (
              <div
                key={rowIdx}
                className={`relative h-[86px] sm:h-[106px] md:h-[126px] w-full flex items-center justify-center rounded transition-all duration-200 ${
                  isWinning
                    ? 'bg-gold-500/15 ring-2 ring-gold-bright/60 shadow-[0_0_15px_rgba(251,191,36,0.3)]'
                    : isScatterHighlight
                    ? 'bg-neon-cyan/15 ring-2 ring-neon-cyan/60 shadow-[0_0_15px_rgba(0,240,255,0.4)]'
                    : 'hover:bg-white/[0.02]'
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

      {/* 3D Cylindrical shadow overlay (dark top & bottom vignetting for depth) */}
      <div className="absolute inset-0 pointer-events-none bg-gradient-to-b from-black/60 via-transparent to-black/60 z-10" />
      <div className="absolute inset-0 pointer-events-none shadow-[inset_0_0_20px_rgba(0,0,0,0.8)] z-10" />
    </div>
  );
};
