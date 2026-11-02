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
}) => {
  // Left side shows lines 0..19 (displayed as 1..20)
  // Right side shows lines 20..39 (displayed as 21..40)
  const lineIndices =
    side === 'left'
      ? Array.from({ length: 20 }, (_, i) => i)
      : Array.from({ length: 20 }, (_, i) => i + 20);

  // Set of winning line indices
  const winningLineIndices = new Set(winningLines.map((w) => w.lineIndex));

  return (
    <div className="flex flex-col justify-between py-1 h-[320px] sm:h-[400px] md:h-[480px] w-5 sm:w-7 select-none z-20 flex-shrink-0">
      {lineIndices.map((lineIdx) => {
        const isLineActiveInGame = lineIdx < selectedLines;
        const isWinning = winningLineIndices.has(lineIdx);
        const isActive = activeLineIndex === lineIdx;
        const isHovered = hoveredLineIndex === lineIdx;
        const color = PAYLINE_COLORS[lineIdx % PAYLINE_COLORS.length];

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
                  ? `${color}70`
                  : 'rgba(255, 255, 255, 0.1)',
              backgroundColor: isActive
                ? color
                : isWinning
                ? `${color}50`
                : isHovered
                ? `${color}35`
                : isLineActiveInGame
                ? 'rgba(15, 20, 32, 0.9)'
                : 'rgba(10, 12, 18, 0.6)',
              color: isActive
                ? '#000'
                : isWinning || isHovered
                ? '#FFF'
                : isLineActiveInGame
                ? 'rgba(255, 255, 255, 0.85)'
                : 'rgba(255, 255, 255, 0.25)',
              boxShadow:
                isWinning || isActive
                  ? `0 0 8px ${color}`
                  : isHovered
                  ? `0 0 5px ${color}`
                  : 'none',
              opacity: isLineActiveInGame || isHovered ? 1 : 0.35,
            }}
            className={`w-4 h-3.5 sm:w-6 sm:h-4.5 md:w-6.5 md:h-5 rounded-[3px] text-[8px] sm:text-[9px] font-black flex items-center justify-center border transition-all duration-150 transform hover:scale-110 active:scale-95 leading-none ${
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
