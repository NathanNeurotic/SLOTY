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
}) => {
  const halfCount = Math.ceil(totalLinesCount / 2);
  const lineIndices =
    side === 'left'
      ? Array.from({ length: halfCount }, (_, i) => i)
      : Array.from({ length: totalLinesCount - halfCount }, (_, i) => i + halfCount);

  // Set of winning line indices
  const winningLineIndices = new Set(winningLines.map((w) => w.lineIndex));

  return (
    <div className="hidden sm:flex flex-col justify-between py-1 h-full w-5 sm:w-7 select-none z-20 flex-shrink-0">
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
                  ? `${color}90`
                  : 'rgba(255, 255, 255, 0.12)',
              backgroundColor: isActive
                ? color
                : isWinning
                ? `${color}55`
                : isHovered
                ? `${color}35`
                : isLineActiveInGame
                ? 'rgba(15, 23, 42, 0.95)'
                : 'rgba(10, 12, 18, 0.65)',
              color: isActive ? '#000' : isWinning || isHovered ? '#FFF' : isLineActiveInGame ? '#FFF' : 'rgba(255, 255, 255, 0.3)',
              boxShadow:
                isWinning || isActive
                  ? `0 0 10px ${color}, inset 0 1px 0 rgba(255,255,255,0.6)`
                  : isHovered
                  ? `0 0 6px ${color}`
                  : 'inset 0 1px 0 rgba(255,255,255,0.15)',
              opacity: isLineActiveInGame || isHovered ? 1 : 0.35,
            }}
            className={`w-4 h-3.5 sm:w-6 sm:h-4.5 md:w-6.5 md:h-5 rounded-[4px] text-[8px] sm:text-[9px] font-black flex items-center justify-center border transition-all duration-150 transform hover:scale-115 active:scale-90 leading-none shadow-sm ${
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
