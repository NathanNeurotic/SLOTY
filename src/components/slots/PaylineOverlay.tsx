import React from 'react';
import type { WinningLine, Payline } from '../../engine/types';
import { PAYLINES, PAYLINE_COLORS } from '../../engine/paylines';

interface PaylineOverlayProps {
  winningLines: WinningLine[];
  activeLineIndex: number | null; // null means show all winning lines softly or cycle
  previewLineIndex: number | null; // preview a payline when player hovers a side tab
  rowCount?: number;
  paylines?: Payline[];
  paylineColors?: string[];
  isTimber?: boolean;
}

export const PaylineOverlay: React.FC<PaylineOverlayProps> = ({
  winningLines,
  activeLineIndex,
  previewLineIndex,
  rowCount = 4,
  paylines = PAYLINES,
  paylineColors = PAYLINE_COLORS,
  isTimber = false,
}) => {
  // If no winning lines and no previewed line, render nothing
  if (winningLines.length === 0 && previewLineIndex === null) {
    return null;
  }

  // 5 reels (columns 0..4 = 20% each), dynamic rows (3 rows = 33.33% each, 4 rows = 25% each)
  const getCellCenterPercent = (reel: number, row: number): [number, number] => {
    const x = (reel + 0.5) * 20;
    const y = (row + 0.5) * (100 / rowCount);
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
            const pattern = paylines[previewLineIndex];
            if (!pattern) return null;
            const points = pattern.map((row: number, reel: number) => getCellCenterPercent(reel, row));
            const pathData = points.reduce((acc: string, [x, y]: [number, number], idx: number) => {
              return idx === 0 ? `M ${x} ${y}` : `${acc} L ${x} ${y}`;
            }, '');
            const color = paylineColors[previewLineIndex % paylineColors.length];

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
                {points.map(([x, y]: [number, number], pIdx: number) => (
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
          const color = paylineColors[win.lineIndex % paylineColors.length];

          // Build SVG path across the points of the winning line
          const points = win.coords.map(([reel, row]) => getCellCenterPercent(reel, row));
          if (points.length === 0) return null;

          const pathData = points.reduce((acc, [x, y], idx) => {
            return idx === 0 ? `M ${x} ${y}` : `${acc} L ${x} ${y}`;
          }, '');

          return (
            <g key={win.lineIndex} className="transition-opacity duration-300">
              {isTimber ? (
                <>
                  {/* Timberland: Organic Living Bramble Vine with Golden Sap */}
                  {/* 1. Deep Forest Moss Halo */}
                  <path
                    d={pathData}
                    fill="none"
                    stroke="#10B981"
                    strokeWidth={isHighlighted ? '6.0' : '2.2'}
                    strokeOpacity={isHighlighted ? 0.65 : 0.25}
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    filter="url(#superNeonGlow)"
                  />
                  {/* 2. Heavy Twisted Briar Bark Stem */}
                  <path
                    d={pathData}
                    fill="none"
                    stroke="#042F1A"
                    strokeWidth={isHighlighted ? '4.0' : '1.8'}
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                  {/* 3. Glowing Golden Honey Sap Vein */}
                  <path
                    d={pathData}
                    fill="none"
                    stroke="#F59E0B"
                    strokeWidth={isHighlighted ? '2.4' : '1.0'}
                    strokeDasharray={isHighlighted ? '6,3' : undefined}
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    className={isHighlighted ? 'animate-laser-stream' : undefined}
                  />
                  {/* 4. White-Hot Pollen Thread */}
                  <path
                    d={pathData}
                    fill="none"
                    stroke="#FEF08A"
                    strokeWidth={isHighlighted ? '1.0' : '0.4'}
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                  {/* 5. Blooming Flower & Acorn Nodes */}
                  {points.map(([x, y], pIdx) => (
                    <g key={pIdx}>
                      {isHighlighted && (
                        <circle
                          cx={x}
                          cy={y}
                          fill="none"
                          stroke="#34D399"
                          strokeWidth="1.2"
                          className="animate-node-shockwave"
                        />
                      )}
                      {/* Leaf Petals around node */}
                      {isHighlighted && (
                        <>
                          <circle cx={x - 2} cy={y - 2} r={1.6} fill="#059669" opacity="0.8" />
                          <circle cx={x + 2} cy={y - 2} r={1.6} fill="#059669" opacity="0.8" />
                          <circle cx={x} cy={y + 2.5} r={1.6} fill="#10B981" opacity="0.8" />
                        </>
                      )}
                      {/* Central Golden Honey Node */}
                      <circle
                        cx={x}
                        cy={y}
                        r={isHighlighted ? 3.6 : 1.8}
                        fill="#F59E0B"
                        stroke="#FEF08A"
                        strokeWidth={isHighlighted ? 1.2 : 0.6}
                        filter="url(#lineNeonGlow)"
                      />
                      {isHighlighted && (
                        <circle cx={x} cy={y} r={1.3} fill="#FFFFFF" />
                      )}
                    </g>
                  ))}
                </>
              ) : (
                <>
                  {/* 24K Vault: High-Voltage Lasers & Diamond Refractors */}
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
                </>
              )}
            </g>
          );
        })}
    </svg>
  );
};
