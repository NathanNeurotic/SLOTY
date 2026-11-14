import React, { useRef, useState, useLayoutEffect, useCallback, useId } from 'react';
import type { WinningLine, Payline } from '../../engine/types';
import { PAYLINES, PAYLINE_COLORS } from '../../engine/paylines';
import type { GameId } from '../../games/types';

interface PaylineOverlayProps {
  winningLines: WinningLine[];
  activeLineIndex: number | null; // null means show all winning lines softly or cycle
  previewLineIndex: number | null; // preview a payline when player hovers a side tab
  rowCount?: number;
  reelsCount?: number;
  paylines?: Payline[];
  paylineColors?: string[];
  isTimber?: boolean;
  isPixel?: boolean;
  activeGameId?: GameId;
}

interface OverlayMeasurement {
  width: number;
  height: number;
  centers: Record<string, [number, number]>;
}

function centersMatch(
  a: Record<string, [number, number]>,
  b: Record<string, [number, number]>
): boolean {
  const keysA = Object.keys(a);
  const keysB = Object.keys(b);
  if (keysA.length !== keysB.length) return false;
  for (const key of keysA) {
    const ptA = a[key];
    const ptB = b[key];
    if (!ptB) return false;
    if (Math.abs(ptA[0] - ptB[0]) > 0.5 || Math.abs(ptA[1] - ptB[1]) > 0.5) {
      return false;
    }
  }
  return true;
}

export const PaylineOverlay: React.FC<PaylineOverlayProps> = ({
  winningLines,
  activeLineIndex,
  previewLineIndex,
  rowCount = 4,
  reelsCount = 5,
  paylines = PAYLINES,
  paylineColors = PAYLINE_COLORS,
  isTimber = false,
  isPixel = false,
  activeGameId,
}) => {
  const svgRef = useRef<SVGSVGElement | null>(null);
  const uid = useId().replace(/:/g, '');
  const lineNeonGlowId = `lineNeonGlow-${uid}`;
  const superNeonGlowId = `superNeonGlow-${uid}`;
  const pixelBlockGlowId = `pixelBlockGlow-${uid}`;

  const [measurement, setMeasurement] = useState<OverlayMeasurement>({
    width: 0,
    height: 0,
    centers: {},
  });

  const effectiveIsTimber = isTimber || activeGameId === 'timber-critters';
  const effectiveIsPixel = isPixel || activeGameId === 'pixel-arcade';
  const effectiveIsPs2 = activeGameId === 'ps2-legends';

  // Continuous measurement of rendered SVG container and symbol cell centers
  useLayoutEffect(() => {
    const measureLayout = () => {
      const svg = svgRef.current;
      if (!svg) return;
      const svgRect = svg.getBoundingClientRect();
      if (svgRect.width <= 0 || svgRect.height <= 0) return;

      const nextCenters: Record<string, [number, number]> = {};
      const parent = svg.parentElement;
      if (parent) {
        const cells = parent.querySelectorAll('[data-reel][data-row]');
        cells.forEach((cell) => {
          const reelAttr = cell.getAttribute('data-reel');
          const rowAttr = cell.getAttribute('data-row');
          if (reelAttr === null || rowAttr === null) return;
          const cellRect = cell.getBoundingClientRect();
          if (cellRect.width <= 0 || cellRect.height <= 0) return;
          const xRel = cellRect.left - svgRect.left + cellRect.width / 2;
          const yRel = cellRect.top - svgRect.top + cellRect.height / 2;
          nextCenters[`${reelAttr}-${rowAttr}`] = [xRel, yRel];
        });
      }

      setMeasurement((prev) => {
        const sameDims =
          Math.abs(prev.width - svgRect.width) <= 0.5 &&
          Math.abs(prev.height - svgRect.height) <= 0.5;
        if (sameDims && centersMatch(prev.centers, nextCenters)) {
          return prev;
        }
        return {
          width: svgRect.width,
          height: svgRect.height,
          centers: nextCenters,
        };
      });
    };

    const rafId = requestAnimationFrame(measureLayout);

    let ro: ResizeObserver | null = null;
    const svg = svgRef.current;
    if (typeof ResizeObserver !== 'undefined' && svg) {
      ro = new ResizeObserver(() => {
        measureLayout();
      });
      ro.observe(svg);
      if (svg.parentElement) {
        ro.observe(svg.parentElement);
      }
    }

    window.addEventListener('resize', measureLayout);
    return () => {
      cancelAnimationFrame(rafId);
      ro?.disconnect();
      window.removeEventListener('resize', measureLayout);
    };
  }, [reelsCount, rowCount, activeGameId, winningLines.length, previewLineIndex]);

  const { width, height, centers } = measurement;
  const isMeasured = width > 0 && height > 0;
  const svgW = isMeasured ? width : 1000;
  const svgH = isMeasured ? height : 500;

  // Exact reel column & row slice center lookup with mathematical fallback
  const getCellCenter = useCallback(
    (reel: number, row: number): [number, number] => {
      const measured = centers[`${reel}-${row}`];
      if (measured) return measured;

      // Mathematical fallback matching slot machine grid flex layout
      const isSm = typeof window !== 'undefined' ? window.innerWidth >= 640 : svgW >= 640;
      const gap = isSm ? 6 : 4;
      const totalGap = (reelsCount - 1) * gap;
      const reelWidth = Math.max(10, (svgW - totalGap) / reelsCount);
      const x = reel * (reelWidth + gap) + reelWidth / 2;
      const y = (row + 0.5) * (svgH / rowCount);
      return [x, y];
    },
    [centers, reelsCount, rowCount, svgW, svgH]
  );

  const hasContent = winningLines.length > 0 || previewLineIndex !== null;

  return (
    <svg
      ref={svgRef}
      viewBox={`0 0 ${svgW} ${svgH}`}
      preserveAspectRatio="none"
      style={{
        opacity: hasContent ? 1 : 0,
        visibility: hasContent ? 'visible' : 'hidden',
        transition: 'opacity 200ms ease',
      }}
      className="absolute inset-1 sm:inset-2 pointer-events-none z-20 overflow-visible w-[calc(100%-8px)] sm:w-[calc(100%-16px)] h-[calc(100%-8px)] sm:h-[calc(100%-16px)]"
    >
      <defs>
        <filter id={lineNeonGlowId} x="-30%" y="-30%" width="160%" height="160%">
          <feGaussianBlur stdDeviation="3.0" result="blur" />
          <feMerge>
            <feMergeNode in="blur" />
            <feMergeNode in="SourceGraphic" />
          </feMerge>
        </filter>
        <filter id={superNeonGlowId} x="-50%" y="-50%" width="200%" height="200%">
          <feGaussianBlur stdDeviation="6.0" result="blur1" />
          <feGaussianBlur stdDeviation="2.5" result="blur2" />
          <feMerge>
            <feMergeNode in="blur1" />
            <feMergeNode in="blur2" />
            <feMergeNode in="SourceGraphic" />
          </feMerge>
        </filter>
        <filter id={pixelBlockGlowId} x="-20%" y="-20%" width="140%" height="140%">
          <feDropShadow dx="0" dy="0" stdDeviation="4" floodColor="#EC4899" floodOpacity="0.8" />
        </filter>
      </defs>

      {/* 1. Preview Line (when player hovers side payline tab) */}
      {previewLineIndex !== null && (
        <g>
          {(() => {
            const pattern = paylines[previewLineIndex];
            if (!pattern) return null;
            const points = pattern.map((row: number, reel: number) => getCellCenter(reel, row));
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
                  strokeWidth={5}
                  strokeOpacity="0.85"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  filter={`url(#${lineNeonGlowId})`}
                />
                <path
                  d={pathData}
                  fill="none"
                  stroke="#FFFFFF"
                  strokeWidth={2}
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
                {points.map(([x, y]: [number, number], pIdx: number) => (
                  <circle
                    key={pIdx}
                    cx={x}
                    cy={y}
                    r={6}
                    fill={color}
                    stroke="#FFF"
                    strokeWidth={1.5}
                    filter={`url(#${lineNeonGlowId})`}
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

          // Build SVG path across the exact points of the winning symbols
          const points = win.coords.map(([reel, row]) => getCellCenter(reel, row));
          if (points.length === 0) return null;

          const pathData = points.reduce((acc, [x, y], idx) => {
            return idx === 0 ? `M ${x} ${y}` : `${acc} L ${x} ${y}`;
          }, '');

          return (
            <g key={win.lineIndex} className="transition-opacity duration-300">
              {effectiveIsPixel ? (
                <>
                  {/* ======================================================== */}
                  {/* PIXEL ARCADE: 8-BIT STEPPED NEON LASER & BEACON CHUNKS */}
                  {/* ======================================================== */}
                  {/* 1. Ultraviolet Synth Ambient Glow */}
                  <path
                    d={pathData}
                    fill="none"
                    stroke={color}
                    strokeWidth={isHighlighted ? 12 : 5}
                    strokeOpacity={isHighlighted ? 0.75 : 0.25}
                    strokeLinecap="square"
                    strokeLinejoin="miter"
                    filter={`url(#${superNeonGlowId})`}
                  />

                  {/* 2. Stepped High-Intensity Laser Core */}
                  <path
                    d={pathData}
                    fill="none"
                    stroke={color}
                    strokeWidth={isHighlighted ? 6 : 3}
                    strokeLinecap="square"
                    strokeLinejoin="miter"
                    filter={`url(#${lineNeonGlowId})`}
                  />

                  {/* 3. White Core Pixel Streak */}
                  {isHighlighted && (
                    <path
                      d={pathData}
                      fill="none"
                      stroke="#FFFFFF"
                      strokeWidth={2.5}
                      strokeLinecap="square"
                      strokeLinejoin="miter"
                      className="animate-laser-stream"
                    />
                  )}

                  {/* 4. 8-Bit Chunky Square Beacon Nodes on Winning Symbols */}
                  {points.map(([x, y], pIdx) => {
                    const boxSize = isHighlighted ? 24 : 14;
                    const half = boxSize / 2;
                    return (
                      <g key={pIdx}>
                        {isHighlighted && (
                          <rect
                            x={x - half - 5}
                            y={y - half - 5}
                            width={boxSize + 10}
                            height={boxSize + 10}
                            fill="none"
                            stroke="#FFF"
                            strokeWidth={1.5}
                            strokeDasharray="4 2"
                            className="animate-node-shockwave"
                          />
                        )}
                        {/* Outer Pixel Box with Drop Shadow */}
                        <rect
                          x={x - half}
                          y={y - half}
                          width={boxSize}
                          height={boxSize}
                          fill={color}
                          stroke="#FFF"
                          strokeWidth={2}
                          filter={`url(#${lineNeonGlowId})`}
                        />
                        {/* Inner Specular Core */}
                        {isHighlighted && (
                          <rect
                            x={x - half * 0.4}
                            y={y - half * 0.4}
                            width={boxSize * 0.8}
                            height={boxSize * 0.8}
                            fill="#FFFFFF"
                          />
                        )}
                      </g>
                    );
                  })}
                </>
              ) : effectiveIsTimber ? (
                <>
                  {/* ======================================================== */}
                  {/* TIMBERLAND CRITTERS: ORGANIC BRIAR VINE & HONEY SAP    */}
                  {/* ======================================================== */}
                  {/* 1. Deep Forest Moss Halo */}
                  <path
                    d={pathData}
                    fill="none"
                    stroke="#10B981"
                    strokeWidth={isHighlighted ? 14 : 6}
                    strokeOpacity={isHighlighted ? 0.7 : 0.25}
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    filter={`url(#${superNeonGlowId})`}
                  />
                  {/* 2. Heavy Twisted Briar Bark Stem */}
                  <path
                    d={pathData}
                    fill="none"
                    stroke="#042F1A"
                    strokeWidth={isHighlighted ? 9 : 4}
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                  {/* 3. Glowing Golden Honey Sap Vein */}
                  <path
                    d={pathData}
                    fill="none"
                    stroke="#F59E0B"
                    strokeWidth={isHighlighted ? 5 : 2.5}
                    strokeDasharray={isHighlighted ? '10,5' : undefined}
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    className={isHighlighted ? 'animate-laser-stream' : undefined}
                  />
                  {/* 4. White-Hot Pollen Thread */}
                  <path
                    d={pathData}
                    fill="none"
                    stroke="#FEF08A"
                    strokeWidth={isHighlighted ? 2 : 1}
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                  {/* 5. Blooming Flower & Acorn Nodes */}
                  {points.map(([x, y], pIdx) => {
                    const r = isHighlighted ? 10 : 5;
                    return (
                      <g key={pIdx}>
                        {isHighlighted && (
                          <circle
                            cx={x}
                            cy={y}
                            r={r + 6}
                            fill="none"
                            stroke="#34D399"
                            strokeWidth={2}
                            className="animate-node-shockwave"
                          />
                        )}
                        {/* Leaf Petals around node */}
                        {isHighlighted && (
                          <>
                            <circle cx={x - 5} cy={y - 5} r={4} fill="#059669" opacity="0.8" />
                            <circle cx={x + 5} cy={y - 5} r={4} fill="#059669" opacity="0.8" />
                            <circle cx={x} cy={y + 6} r={4} fill="#10B981" opacity="0.8" />
                          </>
                        )}
                        {/* Central Golden Honey Node */}
                        <circle
                          cx={x}
                          cy={y}
                          r={r}
                          fill="#F59E0B"
                          stroke="#FEF08A"
                          strokeWidth={isHighlighted ? 2.5 : 1.5}
                          filter={`url(#${lineNeonGlowId})`}
                        />
                        {isHighlighted && (
                          <circle cx={x} cy={y} r={3.5} fill="#FFFFFF" />
                        )}
                      </g>
                    );
                  })}
                </>
              ) : effectiveIsPs2 ? (
                <>
                  {/* ======================================================== */}
                  {/* PLAYSTATION 2: 128-BIT VECTOR BUS & GLYPH NODES        */}
                  {/* ======================================================== */}
                  {/* 1. Cobalt Blue Vector Bus Ambient Glow */}
                  <path
                    d={pathData}
                    fill="none"
                    stroke="#006FCD"
                    strokeWidth={isHighlighted ? 12 : 5}
                    strokeOpacity={isHighlighted ? 0.75 : 0.25}
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    filter={`url(#${superNeonGlowId})`}
                  />
                  {/* 2. Cyan High-Bandwidth DMA Core */}
                  <path
                    d={pathData}
                    fill="none"
                    stroke="#00F0FF"
                    strokeWidth={isHighlighted ? 5 : 2.5}
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    filter={`url(#${lineNeonGlowId})`}
                  />
                  {/* 3. High-Speed White Bus Pulse */}
                  {isHighlighted && (
                    <path
                      d={pathData}
                      fill="none"
                      stroke="#FFFFFF"
                      strokeWidth={2}
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      className="animate-laser-stream"
                    />
                  )}
                  {/* 4. PlayStation Controller Glyph Nodes on Symbols */}
                  {points.map(([x, y], pIdx) => {
                    const r = isHighlighted ? 10 : 5;
                    const glyphIndex = pIdx % 4; // 0: Triangle, 1: Circle, 2: Cross, 3: Square
                    return (
                      <g key={pIdx}>
                        {isHighlighted && (
                          <circle
                            cx={x}
                            cy={y}
                            r={r + 6}
                            fill="none"
                            stroke="#00F0FF"
                            strokeWidth={1.5}
                            className="animate-node-shockwave"
                          />
                        )}
                        <circle
                          cx={x}
                          cy={y}
                          r={r}
                          fill="#030816"
                          stroke="#006FCD"
                          strokeWidth={2}
                          filter={`url(#${lineNeonGlowId})`}
                        />
                        {/* Distinct Controller Symbol Glyphs inside nodes */}
                        {glyphIndex === 0 ? (
                          <polygon points={`${x},${y - 4} ${x - 3.5},${y + 3} ${x + 3.5},${y + 3}`} fill="#22C55E" />
                        ) : glyphIndex === 1 ? (
                          <circle cx={x} cy={y} r={3} fill="none" stroke="#EF4444" strokeWidth={1.5} />
                        ) : glyphIndex === 2 ? (
                          <g stroke="#38BDF8" strokeWidth={1.5} strokeLinecap="round">
                            <line x1={x - 2.5} y1={y - 2.5} x2={x + 2.5} y2={y + 2.5} />
                            <line x1={x + 2.5} y1={y - 2.5} x2={x - 2.5} y2={y + 2.5} />
                          </g>
                        ) : (
                          <rect x={x - 2.5} y={y - 2.5} width={5} height={5} fill="none" stroke="#EC4899" strokeWidth={1.5} />
                        )}
                      </g>
                    );
                  })}
                </>
              ) : (
                <>
                  {/* ======================================================== */}
                  {/* 24K VAULT: HIGH-VOLTAGE LASERS & DIAMOND REFRACTORS    */}
                  {/* ======================================================== */}
                  {/* 1. Deep Neon Ambient Aura */}
                  <path
                    d={pathData}
                    fill="none"
                    stroke={color}
                    strokeWidth={isHighlighted ? 12 : 5}
                    strokeOpacity={isHighlighted ? 0.75 : 0.2}
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    filter={`url(#${superNeonGlowId})`}
                  />

                  {/* 2. Primary Vibrant Laser Beam */}
                  <path
                    d={pathData}
                    fill="none"
                    stroke={color}
                    strokeWidth={isHighlighted ? 7 : 3}
                    strokeOpacity={isHighlighted ? 0.95 : 0.3}
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    filter={`url(#${lineNeonGlowId})`}
                  />

                  {/* 3. High-Voltage Traveling Laser Stream */}
                  {isHighlighted && (
                    <path
                      d={pathData}
                      fill="none"
                      stroke="#FFFFFF"
                      strokeWidth={3.5}
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
                    strokeWidth={isHighlighted ? 2 : 1}
                    strokeOpacity={1}
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />

                  {/* 5. Concentric Shockwave Ripples & Glowing Nodes on Symbols */}
                  {points.map(([x, y], pIdx) => {
                    const r = isHighlighted ? 9 : 5;
                    return (
                      <g key={pIdx}>
                        {isHighlighted && (
                          <circle
                            cx={x}
                            cy={y}
                            r={r + 6}
                            fill="none"
                            stroke={color}
                            strokeWidth={2}
                            className="animate-node-shockwave"
                          />
                        )}
                        {/* Glowing Node Base */}
                        <circle
                          cx={x}
                          cy={y}
                          r={r}
                          fill={color}
                          stroke="#FFF"
                          strokeWidth={isHighlighted ? 2 : 1.2}
                          filter={`url(#${lineNeonGlowId})`}
                        />
                        {/* White Center Flare Core */}
                        {isHighlighted && (
                          <circle cx={x} cy={y} r={3.2} fill="#FFFFFF" />
                        )}
                      </g>
                    );
                  })}
                </>
              )}
            </g>
          );
        })}
    </svg>
  );
};
