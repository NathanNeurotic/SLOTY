import React from 'react';
import { PAYLINE_COLORS } from '../../engine/paylines';
import type { WinningLine } from '../../engine/types';

interface PaylineSideTabsProps {
  side: 'left' | 'right';
  winningLines: WinningLine[];
  activeLineIndex: number | null;
  hoveredLineIndex: number | null;
  onHoverLine: (lineIdx: number | null) => void;
  onClickLine: (lineIdx: number) => void;
}

export const PaylineSideTabs: React.FC<PaylineSideTabsProps> = ({
  side,
  winningLines,
  activeLineIndex,
  hoveredLineIndex,
  onHoverLine,
  onClickLine,
}) => {
  // Left side shows lines 0..9 (displayed as 1..10)
  // Right side shows lines 10..19 (displayed as 11..20)
  const lineIndices = side === 'left' ? [0, 1, 2, 3, 4, 5, 6, 7, 8, 9] : [10, 11, 12, 13, 14, 15, 16, 17, 18, 19];

  // Set of winning line indices
  const winningLineIndices = new Set(winningLines.map((w) => w.lineIndex));

  return (
    <div className="flex flex-col justify-between py-1 h-[270px] sm:h-[330px] md:h-[390px] w-6 sm:w-8 select-none z-20">
      {lineIndices.map((lineIdx) => {
        const isWinning = winningLineIndices.has(lineIdx);
        const isActive = activeLineIndex === lineIdx;
        const isHovered = hoveredLineIndex === lineIdx;
        const color = PAYLINE_COLORS[lineIdx % PAYLINE_COLORS.length];

        return (
          <button
            key={lineIdx}
            onMouseEnter={() => onHoverLine(lineIdx)}
            onMouseLeave={() => onHoverLine(null)}
            onClick={() => onClickLine(lineIdx)}
            title={`Payline ${lineIdx + 1}${isWinning ? ' (WINNING LINE!)' : ''}`}
            style={{
              borderColor: isWinning || isActive || isHovered ? color : 'rgba(255, 255, 255, 0.15)',
              backgroundColor: isActive
                ? color
                : isWinning
                ? `${color}40`
                : isHovered
                ? `${color}30`
                : 'rgba(12, 15, 24, 0.85)',
              color: isActive ? '#000' : isWinning || isHovered ? '#FFF' : 'rgba(255, 255, 255, 0.6)',
              boxShadow: isWinning || isActive
                ? `0 0 10px ${color}`
                : isHovered
                ? `0 0 6px ${color}`
                : 'none',
            }}
            className={`w-5 h-5 sm:w-6 sm:h-6 rounded-md text-[9px] sm:text-[10px] font-black flex items-center justify-center border transition-all duration-150 transform hover:scale-110 active:scale-95 ${
              isWinning ? 'animate-pulse font-extrabold ring-1 ring-yellow-300' : ''
            }`}
          >
            {lineIdx + 1}
          </button>
        );
      })}
    </div>
  );
};
