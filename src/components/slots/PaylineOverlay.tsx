import React from 'react';
import type { WinningLine } from '../../engine/types';
import { PAYLINES, PAYLINE_COLORS } from '../../engine/paylines';

interface PaylineOverlayProps {
  winningLines: WinningLine[];
  activeLineIndex: number | null; // null means show all winning lines softly or cycle
  previewLineIndex: number | null; // preview a payline when player hovers a side tab
}

export const PaylineOverlay: React.FC<PaylineOverlayProps> = ({
  winningLines,
  activeLineIndex,
  previewLineIndex,
}) => {
  // If no winning lines and no previewed line, render nothing
  if (winningLines.length === 0 && previewLineIndex === null) {
    return null;
  }

  // 5 reels (columns 0..4 = 20% each), 4 rows (rows 0..3 = 25% each)
  const getCellCenterPercent = (reel: number, row: number): [number, number] => {
    const x = (reel + 0.5) * 20; // 5 reels = 20% width each
    const y = (row + 0.5) * 25; // 4 rows = 25% height each
    return [x, y];
  };

  return (
    <svg
      viewBox="0 0 100 100"
      preserveAspectRatio="none"
      className="absolute inset-0 w-full h-full pointer-events-none z-20 overflow-visible"
    >
      <defs>
        <filter id="lineNeonGlow" x="-20%" y="-20%" width="140%" height="140%">
          <feGaussianBlur stdDeviation="1.5" result="blur" />
          <feMerge>
            <feMergeNode in="blur" />
            <feMergeNode in="SourceGraphic" />
          </feMerge>
        </filter>
      </defs>

      {/* 1. Preview Line (when player hovers side payline tab) */}
      {previewLineIndex !== null && (
        <g>
          {(() => {
            const pattern = PAYLINES[previewLineIndex];
            if (!pattern) return null;
            const points = pattern.map((row, reel) => getCellCenterPercent(reel, row));
            const pathData = points.reduce((acc, [x, y], idx) => {
              return idx === 0 ? `M ${x} ${y}` : `${acc} L ${x} ${y}`;
            }, '');
            const color = PAYLINE_COLORS[previewLineIndex % PAYLINE_COLORS.length];

            return (
              <>
                <path
                  d={pathData}
                  fill="none"
                  stroke={color}
                  strokeWidth="2.5"
                  strokeOpacity="0.8"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  filter="url(#lineNeonGlow)"
                />
                <path
                  d={pathData}
                  fill="none"
                  stroke="#FFFFFF"
                  strokeWidth="1"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
                {points.map(([x, y], pIdx) => (
                  <circle
                    key={pIdx}
                    cx={x}
                    cy={y}
                    r={2.5}
                    fill={color}
                    stroke="#FFF"
                    strokeWidth="0.8"
                    filter="url(#lineNeonGlow)"
                  />
                ))}
              </>
            );
          })()}
        </g>
      )}

      {/* 2. Winning Lines Display */}
      {previewLineIndex === null &&
        winningLines.map((win) => {
          const isHighlighted = activeLineIndex === null || activeLineIndex === win.lineIndex;
          const color = PAYLINE_COLORS[win.lineIndex % PAYLINE_COLORS.length];

          // Build SVG path across the points of the winning line
          const points = win.coords.map(([reel, row]) => getCellCenterPercent(reel, row));
          if (points.length === 0) return null;

          const pathData = points.reduce((acc, [x, y], idx) => {
            return idx === 0 ? `M ${x} ${y}` : `${acc} L ${x} ${y}`;
          }, '');

          return (
            <g key={win.lineIndex} className="transition-opacity duration-300">
              {/* Outer soft glow line */}
              <path
                d={pathData}
                fill="none"
                stroke={color}
                strokeWidth={isHighlighted ? '2.5' : '1.2'}
                strokeOpacity={isHighlighted ? 0.9 : 0.25}
                strokeLinecap="round"
                strokeLinejoin="round"
                filter="url(#lineNeonGlow)"
              />

              {/* Inner crisp moving stroke */}
              <path
                d={pathData}
                fill="none"
                stroke="#FFFFFF"
                strokeWidth={isHighlighted ? '1' : '0.5'}
                strokeOpacity={isHighlighted ? 1 : 0.4}
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeDasharray={isHighlighted ? '3 1.5' : 'none'}
              />

              {/* Circular node indicators on winning symbols */}
              {points.map(([x, y], pIdx) => (
                <circle
                  key={pIdx}
                  cx={x}
                  cy={y}
                  r={isHighlighted ? 3 : 1.8}
                  fill={color}
                  stroke="#FFF"
                  strokeWidth="0.8"
                  filter="url(#lineNeonGlow)"
                  className={isHighlighted ? 'animate-pulse' : ''}
                />
              ))}
            </g>
          );
        })}
    </svg>
  );
};
