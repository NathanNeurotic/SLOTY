import React, { useMemo, useRef, useEffect } from 'react';
import type { SymbolId } from '../../engine/types';
import { SymbolRenderer } from './SymbolRenderer';
import { SYMBOL_LIST } from '../../engine/symbols';

interface ReelProps {
  reelIndex: number;
  symbols: SymbolId[]; // 3 symbols [top, middle, bottom]
  isSpinning: boolean;
  isAnticipating?: boolean;
  winningRows?: Set<number>;
  scatterRows?: Set<number>;
}

export const Reel: React.FC<ReelProps> = ({
  reelIndex,
  symbols,
  isSpinning,
  isAnticipating = false,
  winningRows = new Set(),
  scatterRows = new Set(),
}) => {
  // Store the symbols that were on the reel right before spinning started
  const lastRestingSymbolsRef = useRef<SymbolId[]>(symbols);

  useEffect(() => {
    if (!isSpinning) {
      lastRestingSymbolsRef.current = symbols;
    }
  }, [isSpinning, symbols]);

  // Generate a unique, randomized strip for this specific reel
  // Begins with the symbols that were already showing to prevent any visual "reset" flash!
  const reelStrip = useMemo(() => {
    const resting = lastRestingSymbolsRef.current;
    // Shuffle symbol pool specifically with reelIndex offset for unique visual pattern
    const allIds = SYMBOL_LIST.map((s) => s.id);
    const shuffled: SymbolId[] = [];
    for (let i = 0; i < 14; i++) {
      const idx = (i * 3 + reelIndex * 5 + Math.floor(Math.random() * 4)) % allIds.length;
      shuffled.push(allIds[idx]);
    }
    // Strip starts with previous symbols, then random whizzing symbols, then repeats
    return [...resting, ...shuffled, ...resting, ...shuffled];
  }, [reelIndex, isSpinning]);

  // Unique spin speed per reel to create realistic physical wheel desynchronization
  const spinSpeeds = ['0.24s', '0.21s', '0.27s', '0.22s', '0.25s'];
  const animDuration = spinSpeeds[reelIndex % spinSpeeds.length];

  return (
    <div
      className={`relative flex-1 h-[270px] sm:h-[330px] md:h-[390px] overflow-hidden rounded-xl bg-gradient-to-b from-casino-950 via-casino-900 to-casino-950 border transition-all duration-300 ${
        isAnticipating
          ? 'border-neon-cyan shadow-[0_0_25px_rgba(0,240,255,0.7)] z-10 scale-[1.02]'
          : 'border-white/10'
      }`}
    >
      {/* Anticipation border glow */}
      {isAnticipating && (
        <div className="absolute inset-0 border-2 border-neon-cyan animate-pulse pointer-events-none z-30" />
      )}

      {/* Reel content */}
      {isSpinning ? (
        <div
          className="w-full flex flex-col animate-reel-spin blur-[1px] will-change-transform"
          style={{ animationDuration: animDuration }}
        >
          {reelStrip.map((sym, idx) => (
            <div
              key={idx}
              className="h-[90px] sm:h-[110px] md:h-[130px] w-full flex items-center justify-center p-2 flex-shrink-0"
            >
              <SymbolRenderer id={sym} />
            </div>
          ))}
        </div>
      ) : (
        <div className="h-full w-full flex flex-col justify-around py-1 animate-bounce-soft">
          {symbols.map((sym, rowIdx) => {
            const isWinning = winningRows.has(rowIdx);
            const isScatterHighlight = scatterRows.has(rowIdx);
            return (
              <div
                key={rowIdx}
                className={`relative h-[86px] sm:h-[106px] md:h-[126px] w-full flex items-center justify-center rounded-lg transition-all duration-200 ${
                  isWinning
                    ? 'bg-gold-500/20 ring-2 ring-gold-bright shadow-[0_0_20px_rgba(251,191,36,0.5)] z-10 scale-105'
                    : isScatterHighlight
                    ? 'bg-neon-cyan/20 ring-2 ring-neon-cyan shadow-[0_0_20px_rgba(0,240,255,0.5)] z-10 scale-105'
                    : winningRows.size > 0
                    ? 'opacity-40' // Dim non-winning symbols like Oregon Lottery terminals
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

      {/* 3D Cylindrical shadow overlay */}
      <div className="absolute inset-0 pointer-events-none bg-gradient-to-b from-black/55 via-transparent to-black/55 z-20" />
      <div className="absolute inset-0 pointer-events-none shadow-[inset_0_0_15px_rgba(0,0,0,0.8)] z-20" />
    </div>
  );
};
