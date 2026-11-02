import React from 'react';
import type { WinningLine } from '../../engine/types';
import { PAYLINE_COLORS } from '../../engine/paylines';

interface PaylineOverlayProps {
  winningLines: WinningLine[];
  activeLineIndex: number | null; // null means show all winning lines softly or cycle
}

export const PaylineOverlay: React.FC<PaylineOverlayProps> = ({
  winningLines,
  activeLineIndex,
}) => {
  if (winningLines.length === 0) return null;

  // 5 reels (columns 0..4), 3 rows (0..2)
  // We use percentage coordinates from 0 to 100
  const getCellCenterPercent = (reel: number, row: number): [number, number] => {
    const x = (reel + 0.5) * 20; // 5 reels = 20% each
    const y = (row + 0.5) * 33.333; // 3 rows = 33.333% each
    return [x, y];
  };

  return (
    <svg className="absolute inset-0 w-full h-full pointer-events-none z-20 overflow-visible">
      <defs>
        <filter id="lineGlow" x="-20%" y="-20%" width="140%" height="140%">
          <feGaussianBlur stdDeviation="3" result="blur" />
          <feMerge>
            <feMergeNode in="blur" />
            <feMergeNode in="SourceGraphic" />
          </feMerge>
        </filter>
      </defs>

      {winningLines.map((win) => {
        const isHighlighted = activeLineIndex === null || activeLineIndex === win.lineIndex;
        const color = PAYLINE_COLORS[win.lineIndex % PAYLINE_COLORS.length];

        // Build SVG path d attribute across the 5 points of the payline
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
              strokeWidth={isHighlighted ? '7' : '3'}
              strokeOpacity={isHighlighted ? 0.7 : 0.25}
              strokeLinecap="round"
              strokeLinejoin="round"
              filter="url(#lineGlow)"
            />
            {/* Inner crisp line */}
            <path
              d={pathData}
              fill="none"
              stroke="#FFFFFF"
              strokeWidth={isHighlighted ? '2.5' : '1.5'}
              strokeOpacity={isHighlighted ? 0.95 : 0.4}
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeDasharray={isHighlighted ? '8 4' : 'none'}
              className={isHighlighted ? 'animate-marquee' : ''}
            />

            {/* Circular node indicators on winning symbols */}
            {points.map(([x, y], pIdx) => (
              <g key={pIdx}>
                <circle
                  cx={x}
                  cy={y}
                  r={isHighlighted ? 8 : 5}
                  fill={color}
                  stroke="#FFF"
                  strokeWidth="2"
                  filter="url(#lineGlow)"
                  className={isHighlighted ? 'animate-pulse-fast' : ''}
                />
              </g>
            ))}

            {/* Line Index Badge on left */}
            {points[0] && (
              <g transform={`translate(${points[0][0] - 8}, ${points[0][1]})`}>
                <circle cx="0" cy="0" r="10" fill="#0C0F18" stroke={color} strokeWidth="2" />
                <text
                  x="0"
                  y="3.5"
                  textAnchor="middle"
                  fill="#FFF"
                  fontSize="9"
                  fontWeight="bold"
                >
                  {win.lineIndex + 1}
                </text>
              </g>
            )}
          </g>
        );
      })}
    </svg>
  );
};
