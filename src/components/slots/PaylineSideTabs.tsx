import React from 'react';
import { PAYLINE_COLORS } from '../../engine/paylines';
import type { WinningLine } from '../../engine/types';

interface PaylineSideTabsProps {
  side: 'left' | 'right';
  selectedLines: number;
  winningLines: WinningLine[];
  activeLineIndex: number | null;
  hoveredLineIndex: number | null;
  onHoverLine: (lineIdx: number | null) => void;
  onClickLine: (lineIdx: number) => void;
  onSelectLines?: (linesCount: number) => void;
  totalLinesCount?: number;
  paylineColors?: string[];
  isTimber?: boolean;
  isPixel?: boolean;
  isPs2?: boolean;
}

export const PaylineSideTabs: React.FC<PaylineSideTabsProps> = ({
  side,
  selectedLines,
  winningLines,
  activeLineIndex,
  hoveredLineIndex,
  onHoverLine,
  onClickLine,
  onSelectLines,
  totalLinesCount = 40,
  paylineColors = PAYLINE_COLORS,
  isTimber = false,
  isPixel = false,
  isPs2 = false,
}) => {
  const halfCount = Math.ceil(totalLinesCount / 2);
  const lineIndices =
    side === 'left'
      ? Array.from({ length: halfCount }, (_, i) => i)
      : Array.from({ length: totalLinesCount - halfCount }, (_, i) => i + halfCount);

  // Set of winning line indices
  const winningLineIndices = new Set(winningLines.map((w) => w.lineIndex));

  return (
    <div
      className="hidden sm:flex flex-col justify-between py-0.5 self-stretch h-full w-4 sm:w-5 md:w-6 select-none z-20 flex-shrink-0 min-h-0 gap-[0.5px]"
    >
      {lineIndices.map((lineIdx) => {
        const isLineActiveInGame = lineIdx < selectedLines;
        const isWinning = winningLineIndices.has(lineIdx);
        const isActive = activeLineIndex === lineIdx;
        const isHovered = hoveredLineIndex === lineIdx;
        const color = paylineColors[lineIdx % paylineColors.length];

        const handleClick = () => {
          if (!isLineActiveInGame && onSelectLines) {
            onSelectLines(lineIdx + 1);
          } else {
            onClickLine(lineIdx);
          }
        };

        const clipPathStyle = isPs2
          ? side === 'left'
            ? 'polygon(0 0, calc(100% - 3px) 0, 100% 3px, 100% calc(100% - 3px), calc(100% - 3px) 100%, 0 100%)'
            : 'polygon(3px 0, 100% 0, 100% 100%, 3px 100%, 0 calc(100% - 3px), 0 3px)'
          : isPixel
          ? 'polygon(0 2px, 2px 0, calc(100% - 2px) 0, 100% 2px, 100% 100%, 0 100%)'
          : isTimber
          ? side === 'left'
            ? 'polygon(0% 0%, 82% 0%, 100% 50%, 82% 100%, 0% 100%, 12% 50%)'
            : 'polygon(18% 0%, 100% 0%, 88% 50%, 100% 100%, 18% 100%, 0% 50%)'
          : 'polygon(3px 0, calc(100% - 3px) 0, 100% 3px, 100% calc(100% - 3px), calc(100% - 3px) 100%, 3px 100%, 0 calc(100% - 3px), 0 3px)';

        return (
          <button
            key={lineIdx}
            onMouseEnter={() => onHoverLine(lineIdx)}
            onMouseLeave={() => onHoverLine(null)}
            onClick={handleClick}
            title={`Payline ${lineIdx + 1}${
              isWinning
                ? ' (WINNING LINE!)'
                : !isLineActiveInGame
                ? ' (Inactive - click to activate lines up to ' + (lineIdx + 1) + ')'
                : ' (Active)'
            }`}
            style={{
              clipPath: clipPathStyle,
              borderColor:
                isWinning || isActive || isHovered
                  ? color
                  : isLineActiveInGame
                  ? isPs2 ? '#006FCD' : isTimber ? '#b45309' : isPixel ? `${color}bb` : `${color}90`
                  : 'rgba(255, 255, 255, 0.12)',
              backgroundColor: isActive
                ? color
                : isWinning
                ? `${color}66`
                : isHovered
                ? `${color}40`
                : isLineActiveInGame
                ? isPs2 ? '#020614' : isTimber ? 'rgba(36, 19, 10, 0.95)' : isPixel ? '#0f0524' : 'rgba(15, 23, 42, 0.95)'
                : 'rgba(10, 12, 18, 0.65)',
              color: isActive ? '#000' : isWinning || isHovered ? '#FFF' : isLineActiveInGame ? (isPs2 ? '#38BDF8' : isTimber ? '#fde047' : isPixel ? '#00F0FF' : '#FFF') : 'rgba(255, 255, 255, 0.3)',
              boxShadow:
                isWinning || isActive
                  ? `0 0 8px ${color}, inset 0 1px 0 rgba(255,255,255,0.6)`
                  : isHovered
                  ? `0 0 5px ${color}`
                  : isPs2 && isLineActiveInGame
                  ? '0 0 4px rgba(0, 111, 205, 0.4)'
                  : 'inset 0 1px 0 rgba(255,255,255,0.15)',
              opacity: isLineActiveInGame || isHovered ? 1 : 0.35,
              fontFamily: isPs2 ? "'Courier New', monospace" : isPixel ? "'Courier New', monospace" : isTimber ? 'serif' : undefined,
            }}
            className={`flex-1 min-h-0 w-full max-w-[28px] max-h-[19px] text-[6.5px] sm:text-[7.5px] md:text-[8px] font-black flex items-center justify-center border transition-all duration-150 transform hover:scale-115 active:scale-90 leading-none shadow-sm ${
              isWinning ? 'animate-pulse font-extrabold ring-1 ring-yellow-300 z-10' : ''
            }`}
          >
            {lineIdx + 1}
          </button>
        );
      })}
    </div>
  );
};
