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
        <filter id="lineNeonGlow" x="-30%" y="-30%" width="160%" height="160%">
          <feGaussianBlur stdDeviation="2.5" result="blur" />
          <feMerge>
            <feMergeNode in="blur" />
            <feMergeNode in="SourceGraphic" />
          </feMerge>
        </filter>
        <filter id="superNeonGlow" x="-50%" y="-50%" width="200%" height="200%">
          <feGaussianBlur stdDeviation="3.5" result="blur1" />
          <feGaussianBlur stdDeviation="1.5" result="blur2" />
          <feMerge>
            <feMergeNode in="blur1" />
            <feMergeNode in="blur2" />
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
              {/* 1. Deep Neon Ambient Aura */}
              <path
                d={pathData}
                fill="none"
                stroke={color}
                strokeWidth={isHighlighted ? '4.5' : '1.8'}
                strokeOpacity={isHighlighted ? 0.75 : 0.2}
                strokeLinecap="round"
                strokeLinejoin="round"
                filter="url(#superNeonGlow)"
              />

              {/* 2. Primary Vibrant Laser Beam */}
              <path
                d={pathData}
                fill="none"
                stroke={color}
                strokeWidth={isHighlighted ? '2.8' : '1.2'}
                strokeOpacity={isHighlighted ? 0.95 : 0.3}
                strokeLinecap="round"
                strokeLinejoin="round"
                filter="url(#lineNeonGlow)"
              />

              {/* 3. High-Voltage Traveling Laser Stream */}
              {isHighlighted && (
                <path
                  d={pathData}
                  fill="none"
                  stroke="#FFFFFF"
                  strokeWidth="1.6"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  className="animate-laser-stream"
                />
              )}

              {/* 4. White-Hot Core Laser Thread */}
              <path
                d={pathData}
                fill="none"
                stroke="#FFFFFF"
                strokeWidth={isHighlighted ? '0.9' : '0.4'}
                strokeOpacity={isHighlighted ? 1 : 0.4}
                strokeLinecap="round"
                strokeLinejoin="round"
              />

              {/* 5. Concentric Shockwave Ripples & Glowing Nodes on Symbols */}
              {points.map(([x, y], pIdx) => (
                <g key={pIdx}>
                  {isHighlighted && (
                    <circle
                      cx={x}
                      cy={y}
                      fill="none"
                      stroke={color}
                      strokeWidth="1.2"
                      className="animate-node-shockwave"
                    />
                  )}
                  {/* Glowing Node Base */}
                  <circle
                    cx={x}
                    cy={y}
                    r={isHighlighted ? 3.4 : 1.8}
                    fill={color}
                    stroke="#FFF"
                    strokeWidth={isHighlighted ? 1 : 0.6}
                    filter="url(#lineNeonGlow)"
                  />
                  {/* White Center Flare Core */}
                  {isHighlighted && (
                    <circle cx={x} cy={y} r={1.2} fill="#FFFFFF" />
                  )}
                </g>
              ))}
            </g>
          );
        })}
    </svg>
  );
};
