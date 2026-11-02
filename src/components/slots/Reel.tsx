import React, { useMemo } from 'react';
import type { SymbolId } from '../../engine/types';
import { SymbolRenderer } from './SymbolRenderer';

interface ReelProps {
  reelIndex: number;
  symbols: SymbolId[]; // 3 symbols [top, middle, bottom]
  isSpinning: boolean;
  isAnticipating?: boolean;
  winningRows?: Set<number>;
  scatterRows?: Set<number>;
}

// Pre-generated filler pool for the spinning blur animation
const SPIN_FILLER: SymbolId[] = [
  'SEVEN',
  'CHERRY',
  'BELL',
  'DIAMOND',
  'WILD',
  'MELON',
  'HORSESHOE',
  'PLUM',
];

export const Reel: React.FC<ReelProps> = ({
  reelIndex: _reelIndex,
  symbols,
  isSpinning,
  isAnticipating = false,
  winningRows = new Set(),
  scatterRows = new Set(),
}) => {
  // Loop strip: duplicate filler pool to allow seamless 0% to -50% CSS looping
  const loopStrip = useMemo(() => [...SPIN_FILLER, ...SPIN_FILLER], []);

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

      {/* Reel symbols */}
      {isSpinning ? (
        <div className="w-full flex flex-col animate-reel-spin blur-[1.5px] will-change-transform">
          {loopStrip.map((sym, idx) => (
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

      {/* 3D Cylindrical shadow overlay for physical depth */}
      <div className="absolute inset-0 pointer-events-none bg-gradient-to-b from-black/50 via-transparent to-black/50 z-20" />
      <div className="absolute inset-0 pointer-events-none shadow-[inset_0_0_15px_rgba(0,0,0,0.8)] z-20" />
    </div>
  );
};
