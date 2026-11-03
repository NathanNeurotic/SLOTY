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
}) => {
  const halfCount = Math.ceil(totalLinesCount / 2);
  const lineIndices =
    side === 'left'
      ? Array.from({ length: halfCount }, (_, i) => i)
      : Array.from({ length: totalLinesCount - halfCount }, (_, i) => i + halfCount);

  // Set of winning line indices
  const winningLineIndices = new Set(winningLines.map((w) => w.lineIndex));
  const isFiftyLines = totalLinesCount > 40;

  return (
    <div
      className={`${
        isFiftyLines ? 'hidden lg:flex' : 'hidden md:flex'
      } flex-col justify-between py-0.5 self-stretch h-full w-5 sm:w-6 md:w-7 select-none z-20 flex-shrink-0 min-h-0 gap-[1px]`}
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

        const leafShape =
          side === 'left'
            ? 'rounded-tl-lg rounded-br-lg rounded-tr-none rounded-bl-none'
            : 'rounded-tr-lg rounded-bl-lg rounded-tl-none rounded-br-none';

        const pixelShape = 'rounded-none border';

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
              borderColor:
                isWinning || isActive || isHovered
                  ? color
                  : isLineActiveInGame
                  ? isTimber ? '#b45309' : isPixel ? `${color}bb` : `${color}90`
                  : 'rgba(255, 255, 255, 0.12)',
              backgroundColor: isActive
                ? color
                : isWinning
                ? `${color}66`
                : isHovered
                ? `${color}40`
                : isLineActiveInGame
                ? isTimber ? 'rgba(36, 19, 10, 0.95)' : isPixel ? '#0f0524' : 'rgba(15, 23, 42, 0.95)'
                : 'rgba(10, 12, 18, 0.65)',
              color: isActive ? '#000' : isWinning || isHovered ? '#FFF' : isLineActiveInGame ? (isTimber ? '#fde047' : isPixel ? '#00F0FF' : '#FFF') : 'rgba(255, 255, 255, 0.3)',
              boxShadow:
                isWinning || isActive
                  ? `0 0 8px ${color}, inset 0 1px 0 rgba(255,255,255,0.6)`
                  : isHovered
                  ? `0 0 5px ${color}`
                  : 'inset 0 1px 0 rgba(255,255,255,0.15)',
              opacity: isLineActiveInGame || isHovered ? 1 : 0.35,
              fontFamily: isPixel ? "'Courier New', monospace" : undefined,
            }}
            className={`flex-1 min-h-0 w-full max-w-[28px] max-h-[16px] text-[7px] sm:text-[8px] font-black flex items-center justify-center border transition-all duration-150 transform hover:scale-115 active:scale-90 leading-none shadow-sm ${
              isTimber ? leafShape : isPixel ? pixelShape : 'rounded-[3px]'
            } ${
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
