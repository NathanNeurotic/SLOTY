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

  // 5 reels (columns 0..4), 3 rows (0..2)
  const getCellCenterPercent = (reel: number, row: number): [number, number] => {
    const x = (reel + 0.5) * 20; // 5 reels = 20% each
    const y = (row + 0.5) * 33.333; // 3 rows = 33.333% each
    return [x, y];
  };

  // Find if active line is a winning line
  const activeWin = winningLines.find((w) => w.lineIndex === activeLineIndex);

  return (
    <svg className="absolute inset-0 w-full h-full pointer-events-none z-20 overflow-visible">
      <defs>
        <filter id="lineNeonGlow" x="-20%" y="-20%" width="140%" height="140%">
          <feGaussianBlur stdDeviation="4" result="blur" />
          <feMerge>
            <feMergeNode in="blur" />
            <feMergeNode in="SourceGraphic" />
          </feMerge>
        </filter>
      </defs>

      {/* 1. Preview Line (when player hovers side payline tab) */}
      {previewLineIndex !== null && (
        <g className="animate-fadeIn">
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
                  strokeWidth="8"
                  strokeOpacity="0.8"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  filter="url(#lineNeonGlow)"
                />
                <path
                  d={pathData}
                  fill="none"
                  stroke="#FFFFFF"
                  strokeWidth="3"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
                {points.map(([x, y], pIdx) => (
                  <circle
                    key={pIdx}
                    cx={x}
                    cy={y}
                    r={8}
                    fill={color}
                    stroke="#FFF"
                    strokeWidth="2.5"
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

          // Build SVG path d attribute across the points of the winning line
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
                strokeWidth={isHighlighted ? '8' : '3'}
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
                strokeWidth={isHighlighted ? '3' : '1.5'}
                strokeOpacity={isHighlighted ? 1 : 0.4}
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeDasharray={isHighlighted ? '10 5' : 'none'}
                className={isHighlighted ? 'animate-marquee' : ''}
              />

              {/* Circular node indicators on winning symbols */}
              {points.map(([x, y], pIdx) => (
                <g key={pIdx}>
                  <circle
                    cx={x}
                    cy={y}
                    r={isHighlighted ? 10 : 5}
                    fill={color}
                    stroke="#FFF"
                    strokeWidth={isHighlighted ? '3' : '1.5'}
                    filter="url(#lineNeonGlow)"
                    className={isHighlighted ? 'animate-pulse-fast' : ''}
                  />
                </g>
              ))}
            </g>
          );
        })}

      {/* 3. Floating Score Tag for the Active Winning Line */}
      {previewLineIndex === null && activeWin && (
        <g
          transform={`translate(${getCellCenterPercent(2, activeWin.coords[2]?.[1] ?? 1)[0]}, ${
            getCellCenterPercent(2, activeWin.coords[2]?.[1] ?? 1)[1] - 30
          })`}
          className="animate-bounce-soft pointer-events-none"
        >
          <rect
            x="-65"
            y="-14"
            width="130"
            height="26"
            rx="13"
            fill="#0C0F18"
            stroke="#F59E0B"
            strokeWidth="2"
            filter="url(#lineNeonGlow)"
          />
          <text
            x="0"
            y="4"
            textAnchor="middle"
            fill="#FDE047"
            fontSize="11"
            fontWeight="900"
            letterSpacing="1"
          >
            +{activeWin.payout.toLocaleString()} COINS
          </text>
        </g>
      )}
    </svg>
  );
};
