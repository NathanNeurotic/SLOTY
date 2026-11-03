import React from 'react';
import type { SymbolId } from '../../engine/types';

interface SymbolRendererProps {
  id: SymbolId;
  isWinning?: boolean;
  isScatterHighlight?: boolean;
  className?: string;
  reelIndex?: number;
  rowIndex?: number;
}

export const SymbolRenderer: React.FC<SymbolRendererProps> = ({
  id,
  isWinning = false,
  isScatterHighlight = false,
  className = '',
  reelIndex,
  rowIndex,
}) => {
  const getSymbolSvg = () => {
    switch (id) {
      case 'WILD':
        return (
          <svg viewBox="0 0 100 100" className="w-full h-full drop-shadow-lg overflow-visible">
            <defs>
              <linearGradient id="wildCrownGold" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#FFFDEB" />
                <stop offset="20%" stopColor="#FDE047" />
                <stop offset="50%" stopColor="#F59E0B" />
                <stop offset="80%" stopColor="#B45309" />
                <stop offset="100%" stopColor="#451A03" />
              </linearGradient>
              <linearGradient id="rubyJewel" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#FFAEC0" />
                <stop offset="30%" stopColor="#FF1E56" />
                <stop offset="70%" stopColor="#9B0024" />
                <stop offset="100%" stopColor="#40000D" />
              </linearGradient>
              <linearGradient id="diamondJewel" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#FFFFFF" />
                <stop offset="45%" stopColor="#BAE6FD" />
                <stop offset="85%" stopColor="#0284C7" />
                <stop offset="100%" stopColor="#082F49" />
              </linearGradient>
            </defs>

            {/* 3D Drop Shadow Behind Crown */}
            <path
              d="M14 66 L9 28 L30 44 L50 14 L70 44 L91 28 L86 66 Z"
              fill="#1C0A00"
              transform="translate(3, 4)"
              opacity="0.85"
            />

            {/* 5-Peak Imperial 24K Gold Crown */}
            <path
              d="M14 66 L9 28 L30 44 L50 14 L70 44 L91 28 L86 66 Z"
              fill="url(#wildCrownGold)"
              stroke="#FFFBEB"
              strokeWidth="2.2"
              strokeLinejoin="round"
            />

            {/* Inner Crown Bevel Highlights */}
            <path d="M50 16 L31 43 L12 29 L16 64 L84 64 L88 29 L69 43 Z" fill="#FEF08A" opacity="0.35" />

            {/* Crown Base Band with Gold Rivets */}
            <path d="M12 65 L88 65 L86 73 L14 73 Z" fill="url(#wildCrownGold)" stroke="#FEF08A" strokeWidth="1.5" />
            <circle cx="24" cy="69" r="2.2" fill="#451A03" stroke="#FEF08A" strokeWidth="0.6" />
            <circle cx="37" cy="69" r="2.2" fill="#451A03" stroke="#FEF08A" strokeWidth="0.6" />
            <circle cx="50" cy="69" r="3" fill="url(#rubyJewel)" stroke="#FEF08A" strokeWidth="1" />
            <circle cx="63" cy="69" r="2.2" fill="#451A03" stroke="#FEF08A" strokeWidth="0.6" />
            <circle cx="76" cy="69" r="2.2" fill="#451A03" stroke="#FEF08A" strokeWidth="0.6" />

            {/* Sparkling Jewels on Crown Peaks */}
            <circle cx="9" cy="27" r="5" fill="url(#diamondJewel)" stroke="#FFF" strokeWidth="1.2" />
            <circle cx="50" cy="13" r="6.5" fill="url(#rubyJewel)" stroke="#FFF" strokeWidth="1.5" />
            <circle cx="91" cy="27" r="5" fill="url(#diamondJewel)" stroke="#FFF" strokeWidth="1.2" />
            <circle cx="30" cy="44" r="4" fill="url(#diamondJewel)" stroke="#FFF" strokeWidth="1" />
            <circle cx="70" cy="44" r="4" fill="url(#diamondJewel)" stroke="#FFF" strokeWidth="1" />

            {/* Center Royal Medallion */}
            <polygon points="50,33 58,45 50,57 42,45" fill="url(#rubyJewel)" stroke="#FEF08A" strokeWidth="1.8" />
            <circle cx="50" cy="45" r="2.5" fill="#FFF" />

            {/* Specular Starbursts on Diamonds */}
            <polygon points="9,27 10,23 13,27 10,31 9,27 8,31 5,27 8,23" fill="#FFF" />
            <polygon points="50,13 52,7 54,13 60,13 55,17 57,23 50,19 43,23 45,17 40,13 46,13" fill="#FFF" />
            <polygon points="91,27 92,23 95,27 92,31 91,27 90,31 87,27 90,23" fill="#FFF" />

            {/* 3D WILD Banner Plaque */}
            <g transform="translate(0, 1)">
              <rect x="15" y="75" width="70" height="20" rx="5" fill="#0C0F18" stroke="#F59E0B" strokeWidth="2.5" />
              <rect x="17" y="77" width="66" height="16" rx="3" fill="#1C1408" stroke="#FEF08A" strokeWidth="0.8" />
              <text
                x="50"
                y="89"
                textAnchor="middle"
                fill="#FBBF24"
                fontWeight="900"
                fontSize="11"
                fontFamily="sans-serif"
                letterSpacing="1.5"
                className="drop-shadow-[0_2px_4px_rgba(0,0,0,0.9)]"
              >
                WILD
              </text>
            </g>
          </svg>
        );

      case 'SCATTER':
        return (
          <svg viewBox="0 0 100 100" className="w-full h-full drop-shadow-lg overflow-visible">
            <defs>
              <linearGradient id="vaultSteelRing" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#F8FAFC" />
                <stop offset="25%" stopColor="#94A3B8" />
                <stop offset="65%" stopColor="#334155" />
                <stop offset="100%" stopColor="#0F172A" />
              </linearGradient>
              <radialGradient id="vaultGoldSpoke" cx="40%" cy="40%" r="65%">
                <stop offset="0%" stopColor="#FFFDEB" />
                <stop offset="35%" stopColor="#FBBF24" />
                <stop offset="75%" stopColor="#D97706" />
                <stop offset="100%" stopColor="#78350F" />
              </radialGradient>
              <radialGradient id="vaultDoorInteriorGlow" cx="50%" cy="50%" r="50%">
                <stop offset="0%" stopColor="#FDE047" stopOpacity="0.8" />
                <stop offset="50%" stopColor="#F59E0B" stopOpacity="0.3" />
                <stop offset="100%" stopColor="#000000" stopOpacity="0.8" />
              </radialGradient>
            </defs>

            {/* Outer Heavy Steel Flange with 8 Chrome Hex Bolts */}
            <circle cx="50" cy="44" r="39" fill="url(#vaultSteelRing)" stroke="#00F0FF" strokeWidth="2.5" />
            {[0, 45, 90, 135, 180, 225, 270, 315].map((angle, i) => (
              <circle
                key={i}
                cx={50 + 35 * Math.cos((angle * Math.PI) / 180)}
                cy={44 + 35 * Math.sin((angle * Math.PI) / 180)}
                r="2"
                fill="#CBD5E1"
                stroke="#0F172A"
                strokeWidth="1"
              />
            ))}

            {/* Recessed Vault Cavity */}
            <circle cx="50" cy="44" r="29" fill="url(#vaultDoorInteriorGlow)" stroke="#FBBF24" strokeWidth="2" />

            {/* 3-Spoke Hydraulic Gold Steering Wheel */}
            <g className={isScatterHighlight || isWinning ? 'animate-spin origin-[50px_44px]' : ''}>
              <line x1="50" y1="18" x2="50" y2="70" stroke="url(#vaultGoldSpoke)" strokeWidth="4.5" strokeLinecap="round" />
              <line x1="27" y1="31" x2="73" y2="57" stroke="url(#vaultGoldSpoke)" strokeWidth="4.5" strokeLinecap="round" />
              <line x1="27" y1="57" x2="73" y2="31" stroke="url(#vaultGoldSpoke)" strokeWidth="4.5" strokeLinecap="round" />

              {/* Hand Grips at spoke ends */}
              <circle cx="50" cy="18" r="3.2" fill="#FEF08A" stroke="#78350F" strokeWidth="1" />
              <circle cx="50" cy="70" r="3.2" fill="#FEF08A" stroke="#78350F" strokeWidth="1" />
              <circle cx="27" cy="31" r="3.2" fill="#FEF08A" stroke="#78350F" strokeWidth="1" />
              <circle cx="73" cy="57" r="3.2" fill="#FEF08A" stroke="#78350F" strokeWidth="1" />
              <circle cx="27" cy="57" r="3.2" fill="#FEF08A" stroke="#78350F" strokeWidth="1" />
              <circle cx="73" cy="31" r="3.2" fill="#FEF08A" stroke="#78350F" strokeWidth="1" />
            </g>

            {/* Center Lock Dial Core */}
            <circle cx="50" cy="40" r="11" fill="url(#vaultGoldSpoke)" stroke="#FFF" strokeWidth="1.8" />
            <circle cx="50" cy="40" r="5" fill="#0C0F18" stroke="#FDE047" strokeWidth="1" />

            {/* Top Indicator Alarm LEDs */}
            <circle cx="43" cy="16" r="2.5" fill="#22C55E" className="animate-pulse" />
            <circle cx="57" cy="16" r="2.5" fill="#EF4444" className="animate-ping" />

            {/* SCATTER 3D Pedestal Plaque */}
            <g transform="translate(0, 0)">
              <rect x="10" y="73" width="80" height="23" rx="6" fill="#030712" stroke="#00F0FF" strokeWidth="2" />
              <rect x="12" y="75" width="76" height="19" rx="4" fill="url(#vaultSteelRing)" opacity="0.4" />
              <text
                x="50"
                y="87.5"
                textAnchor="middle"
                fill="#00F0FF"
                fontWeight="900"
                fontSize="10"
                fontFamily="sans-serif"
                letterSpacing="1.2"
                className="drop-shadow-[0_0_8px_rgba(0,240,255,0.9)]"
              >
                SCATTER
              </text>
            </g>
          </svg>
        );

      case 'COIN':
        return (
          <svg viewBox="0 0 100 100" className="w-full h-full drop-shadow-xl overflow-visible">
            <defs>
              <radialGradient id="coinGoldFace" cx="35%" cy="35%" r="65%">
                <stop offset="0%" stopColor="#FFFDEB" />
                <stop offset="20%" stopColor="#FEF08A" />
                <stop offset="55%" stopColor="#F59E0B" />
                <stop offset="85%" stopColor="#D97706" />
                <stop offset="100%" stopColor="#78350F" />
              </radialGradient>
              <linearGradient id="reededRim" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#FFFBEB" />
                <stop offset="50%" stopColor="#D97706" />
                <stop offset="100%" stopColor="#FFFBEB" />
              </linearGradient>
              <linearGradient id="coinPlaqueBg" x1="0%" y1="0%" x2="0%" y2="100%">
                <stop offset="0%" stopColor="#1E1202" />
                <stop offset="100%" stopColor="#080401" />
              </linearGradient>
            </defs>

            {/* 3D Drop Shadow */}
            <circle cx="52" cy="48" r="42" fill="#1E0E03" opacity="0.75" />

            {/* Outer Reeded Security Edge */}
            <circle cx="50" cy="45" r="41" fill="url(#reededRim)" stroke="#78350F" strokeWidth="1.8" />
            {/* Mirror Gold Coin Face */}
            <circle cx="50" cy="45" r="37" fill="url(#coinGoldFace)" stroke="#FEF08A" strokeWidth="1.8" />
            <circle cx="50" cy="45" r="31" fill="none" stroke="#FBBF24" strokeWidth="1.2" strokeDasharray="3 2" />

            {/* Engraved Arch Stars at Top Rim */}
            <polygon points="50,15 51,18 54,18 51.5,20 52.5,23 50,21 47.5,23 48.5,20 46,18 49,18" fill="#FFFBEB" opacity="0.9" />
            <polygon points="36,19 37,21 39,21 37.5,22.5 38,24.5 36,23 34,24.5 34.5,22.5 33,21 35,21" fill="#FFFBEB" opacity="0.8" />
            <polygon points="64,19 65,21 67,21 65.5,22.5 66,24.5 64,23 62,24.5 62.5,22.5 61,21 63,21" fill="#FFFBEB" opacity="0.8" />

            {/* Center Sculpted 3D Dollar Medallion */}
            <circle cx="50" cy="43" r="18" fill="#1C0A00" stroke="#FDE047" strokeWidth="1.8" />
            <text
              x="50"
              y="51"
              textAnchor="middle"
              fill="#FFFFFF"
              fontWeight="900"
              fontSize="24"
              fontFamily="sans-serif"
              stroke="#78350F"
              strokeWidth="1.2"
              className="drop-shadow-[0_2px_4px_rgba(0,0,0,0.9)]"
            >
              $
            </text>

            {/* Clean, Raised High-Contrast BONUS Chamber at Bottom */}
            <g transform="translate(0, 1)">
              <rect x="14" y="70" width="72" height="21" rx="6" fill="#000" opacity="0.8" />
              <rect x="12" y="68" width="76" height="21" rx="6" fill="url(#coinGoldFace)" stroke="#FFF" strokeWidth="1.2" />
              <rect x="14" y="70" width="72" height="17" rx="4" fill="url(#coinPlaqueBg)" stroke="#F59E0B" strokeWidth="0.8" />
              <text
                x="50"
                y="82"
                textAnchor="middle"
                fill="#FEF08A"
                stroke="#451A03"
                strokeWidth="0.8"
                fontWeight="900"
                fontSize="10"
                fontFamily="sans-serif"
                letterSpacing="1.2"
                style={{ paintOrder: 'stroke fill' }}
              >
                BONUS
              </text>
            </g>

            {/* Specular Starburst */}
            <polygon points="76,24 78,28 83,29 78,30 76,34 74,30 69,29 74,28" fill="#FFFFFF" />
          </svg>
        );

      case 'DIAMOND':
        return (
          <svg viewBox="0 0 100 100" className="w-full h-full drop-shadow-lg overflow-visible">
            <defs>
              <linearGradient id="briefcaseMetal" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#F1F5F9" />
                <stop offset="40%" stopColor="#94A3B8" />
                <stop offset="80%" stopColor="#475569" />
                <stop offset="100%" stopColor="#1E293B" />
              </linearGradient>
              <linearGradient id="diamondBlueCut" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#FFFFFF" />
                <stop offset="35%" stopColor="#7DD3FC" />
                <stop offset="70%" stopColor="#0284C7" />
                <stop offset="100%" stopColor="#082F49" />
              </linearGradient>
              <linearGradient id="cashStackGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#BBF7D0" />
                <stop offset="45%" stopColor="#22C55E" />
                <stop offset="85%" stopColor="#15803D" />
                <stop offset="100%" stopColor="#052E16" />
              </linearGradient>
            </defs>

            {/* Briefcase Base */}
            <rect x="10" y="36" width="80" height="52" rx="6" fill="url(#briefcaseMetal)" stroke="#FBBF24" strokeWidth="2.5" />
            <rect x="14" y="40" width="72" height="44" rx="4" fill="#020617" stroke="#334155" strokeWidth="1" />

            {/* Stacks of $100 Cash Overflowing */}
            <rect x="18" y="60" width="30" height="20" rx="2" fill="url(#cashStackGrad)" stroke="#166534" strokeWidth="1" />
            <rect x="30" y="60" width="6" height="20" fill="#38BDF8" opacity="0.9" />
            <rect x="52" y="60" width="30" height="20" rx="2" fill="url(#cashStackGrad)" stroke="#166534" strokeWidth="1" />
            <rect x="64" y="60" width="6" height="20" fill="#38BDF8" opacity="0.9" />

            {/* Briefcase Handle */}
            <path d="M38 36 L38 22 Q38 17 50 17 Q62 17 62 22 L62 36" fill="none" stroke="#FBBF24" strokeWidth="4.5" strokeLinecap="round" />

            {/* Giant Radiant 3D Diamond in Center */}
            <polygon points="32,20 68,20 82,38 50,66 18,38" fill="url(#diamondBlueCut)" stroke="#FFF" strokeWidth="2" />
            <polygon points="32,20 50,38 18,38" fill="#BAE6FD" opacity="0.85" />
            <polygon points="50,38 68,20 82,38" fill="#BAE6FD" opacity="0.85" />
            <polygon points="32,20 50,38 68,20" fill="#FFFFFF" opacity="0.95" />
            <polygon points="18,38 82,38 50,66" fill="url(#diamondBlueCut)" stroke="#7DD3FC" strokeWidth="1" />

            {/* Blazing Specular 8-Point Star Glint */}
            <polygon points="50,8 52,18 62,20 52,22 50,32 48,22 38,20 48,18" fill="#FFFFFF" className="animate-pulse" />
          </svg>
        );

      case 'SEVEN':
        return (
          <svg viewBox="0 0 100 100" className="w-full h-full drop-shadow-lg overflow-visible">
            <defs>
              <linearGradient id="gold777" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#FFFBEB" />
                <stop offset="20%" stopColor="#FEF08A" />
                <stop offset="50%" stopColor="#F59E0B" />
                <stop offset="80%" stopColor="#B45309" />
                <stop offset="100%" stopColor="#451A03" />
              </linearGradient>
              <linearGradient id="rubyCore7" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#FF4D6D" />
                <stop offset="50%" stopColor="#E11D48" />
                <stop offset="100%" stopColor="#881337" />
              </linearGradient>
            </defs>

            {/* Back Deep Shadow */}
            <path
              d="M16 14 L84 14 L84 32 L56 88 L34 88 L60 36 L16 36 Z"
              fill="#2A0B02"
              transform="translate(4, 4)"
            />

            {/* Main Solid 24K Gold 7 Frame */}
            <path
              d="M16 14 L84 14 L84 32 L56 88 L34 88 L60 36 L16 36 Z"
              fill="url(#gold777)"
              stroke="#FFF"
              strokeWidth="2.5"
              strokeLinejoin="round"
            />

            {/* Fiery Ruby Neon Core Stripe */}
            <path
              d="M24 22 L76 22 L52 70 L42 70 L64 30 L24 30 Z"
              fill="url(#rubyCore7)"
              stroke="#FDE047"
              strokeWidth="1.2"
            />

            {/* Brilliant Diamond Star Glints */}
            <polygon points="78,16 80,21 87,23 80,25 78,30 76,25 69,23 76,21" fill="#FFFFFF" />
            <polygon points="38,82 39,85 43,86 39,87 38,90 37,87 33,86 37,85" fill="#FFFFFF" />
          </svg>
        );

      case 'GOLDBAR':
        return (
          <svg viewBox="0 0 100 100" className="w-full h-full drop-shadow-lg overflow-visible">
            <defs>
              <linearGradient id="bullionGoldA" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#FFFDEB" />
                <stop offset="30%" stopColor="#FBBF24" />
                <stop offset="70%" stopColor="#D97706" />
                <stop offset="100%" stopColor="#78350F" />
              </linearGradient>
              <linearGradient id="bullionGoldB" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#FFF9D2" />
                <stop offset="40%" stopColor="#F59E0B" />
                <stop offset="100%" stopColor="#92400E" />
              </linearGradient>
            </defs>

            {/* Bottom Left Bullion Bar */}
            <polygon points="10,60 54,60 44,80 2,80" fill="url(#bullionGoldA)" stroke="#FEF08A" strokeWidth="1.4" />
            <polygon points="54,60 64,65 54,85 44,80" fill="#92400E" stroke="#FEF08A" strokeWidth="1" />

            {/* Bottom Right Bullion Bar */}
            <polygon points="46,60 90,60 80,80 36,80" fill="url(#bullionGoldA)" stroke="#FEF08A" strokeWidth="1.4" />
            <polygon points="90,60 98,65 88,85 80,80" fill="#92400E" stroke="#FEF08A" strokeWidth="1" />

            {/* Center Pyramid Top Bullion Bar */}
            <polygon points="26,24 74,24 62,52 14,52" fill="url(#bullionGoldB)" stroke="#FFF" strokeWidth="2" />
            <polygon points="74,24 86,31 74,59 62,52" fill="#78350F" stroke="#FEF08A" strokeWidth="1.2" />

            {/* Top Bar Embossed Mint Seal Medallion */}
            <ellipse cx="44" cy="38" rx="14" ry="7.5" fill="#78350F" opacity="0.35" />
            <ellipse cx="44" cy="38" rx="12" ry="6" fill="none" stroke="#FEF08A" strokeWidth="0.8" />
            <polygon points="44,34 45.5,37 48.5,37 46,38.5 47,41.5 44,39.5 41,41.5 42,38.5 39.5,37 42.5,37" fill="#FEF08A" />

            {/* Base Horizontal 24K Gold Cartouche Plaque (Text strictly contained inside frame) */}
            <rect x="12" y="73" width="76" height="20" rx="5" fill="#1C1408" stroke="#F59E0B" strokeWidth="2" />
            <rect x="14" y="75" width="72" height="16" rx="3.5" fill="#2E180E" stroke="#FEF08A" strokeWidth="0.8" />
            <text
              x="50"
              y="86.5"
              textAnchor="middle"
              fill="#FDE047"
              stroke="#451A03"
              strokeWidth="0.5"
              fontWeight="900"
              fontSize="7.5"
              fontFamily="sans-serif"
              letterSpacing="1"
              style={{ paintOrder: 'stroke fill' }}
            >
              24K GOLD
            </text>

            {/* Specular Starbursts */}
            <polygon points="26,24 28,28 33,29 28,30 26,35 24,30 19,29 24,28" fill="#FFFFFF" />
            <polygon points="74,24 76,28 81,29 76,30 74,35 72,30 67,29 72,28" fill="#FFFFFF" />
          </svg>
        );

      case 'BELL': // Themed as Overstuffed Cash Bag ($100 Bills & Coins)
        return (
          <svg viewBox="0 0 100 100" className="w-full h-full drop-shadow-lg overflow-visible">
            <defs>
              <linearGradient id="sackBurlap" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#FEF08A" />
                <stop offset="35%" stopColor="#EAB308" />
                <stop offset="75%" stopColor="#A16207" />
                <stop offset="100%" stopColor="#451A03" />
              </linearGradient>
            </defs>

            {/* Green Hundred-Dollar Bills Spilling from Top */}
            <polygon points="30,16 46,6 54,16 38,26" fill="#22C55E" stroke="#14532D" strokeWidth="1" />
            <polygon points="46,14 66,4 74,14 54,24" fill="#4ADE80" stroke="#15803D" strokeWidth="1" />

            {/* Plump Bulging Money Sack Body */}
            <path
              d="M50 32 C30 32, 10 46, 10 70 C10 88, 30 92, 50 92 C70 92, 90 88, 90 70 C90 46, 70 32, 50 32 Z"
              fill="url(#sackBurlap)"
              stroke="#FFFBEB"
              strokeWidth="2.2"
            />

            {/* Tied Neck & Ruffled Top Frill */}
            <path d="M34 26 L26 12 L40 18 L50 10 L60 18 L74 12 L66 26 Z" fill="url(#sackBurlap)" stroke="#FEF08A" strokeWidth="1.5" />

            {/* Thick Golden Twine Tie */}
            <rect x="32" y="27" width="36" height="7" rx="3.5" fill="#FDE047" stroke="#78350F" strokeWidth="1.5" />

            {/* 3D Bold Golden Dollar Emblem in Center */}
            <circle cx="50" cy="65" r="17" fill="#0C0F18" stroke="#FDE047" strokeWidth="2.5" />
            <text
              x="50"
              y="72"
              textAnchor="middle"
              fill="#FBBF24"
              fontWeight="900"
              fontSize="21"
              fontFamily="sans-serif"
            >
              $
            </text>
          </svg>
        );

      case 'HORSESHOE': // Themed as Banded Cash Bricks ($10,000 Wads)
        return (
          <svg viewBox="0 0 100 100" className="w-full h-full drop-shadow-lg overflow-visible">
            <defs>
              <linearGradient id="brickGreenA" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#DCFCE7" />
                <stop offset="40%" stopColor="#4ADE80" />
                <stop offset="80%" stopColor="#16A34A" />
                <stop offset="100%" stopColor="#14532D" />
              </linearGradient>
              <linearGradient id="fedBandBlue" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#BAE6FD" />
                <stop offset="50%" stopColor="#0284C7" />
                <stop offset="100%" stopColor="#082F49" />
              </linearGradient>
            </defs>

            {/* Bottom Cash Brick */}
            <polygon points="12,56 78,56 66,80 0,80" fill="url(#brickGreenA)" stroke="#15803D" strokeWidth="1.8" />
            <polygon points="78,56 90,62 78,86 66,80" fill="#14532D" stroke="#15803D" strokeWidth="1.2" />
            <polygon points="34,56 50,56 40,80 24,80" fill="url(#fedBandBlue)" stroke="#FFF" strokeWidth="1" />

            {/* Top Cash Brick Stacked Crosswise */}
            <polygon points="20,26 86,26 74,50 8,50" fill="url(#brickGreenA)" stroke="#FFF" strokeWidth="2" />
            <polygon points="86,26 98,33 86,57 74,50" fill="#14532D" stroke="#15803D" strokeWidth="1.2" />

            {/* Federal Reserve Security Band & Embossed Reserve Seal */}
            <polygon points="44,26 62,26 52,50 34,50" fill="url(#fedBandBlue)" stroke="#FEF08A" strokeWidth="1.4" />
            <circle cx="48" cy="38" r="7" fill="#0C4A6E" stroke="#FEF08A" strokeWidth="1.2" />
            <text x="48" y="41" textAnchor="middle" fill="#FEF08A" fontWeight="900" fontSize="7.5" fontFamily="sans-serif">
              $
            </text>

            {/* Base Horizontal Stamped Plaque (Strictly bounded) */}
            <rect x="16" y="72" width="68" height="18" rx="4" fill="#0C4A6E" stroke="#38BDF8" strokeWidth="1.5" />
            <text x="50" y="84.5" textAnchor="middle" fill="#BAE6FD" fontWeight="900" fontSize="7.5" fontFamily="sans-serif" letterSpacing="0.8">
              $10,000
            </text>
          </svg>
        );

      case 'MELON': // Themed as Royal Gold Treasure Chest
        return (
          <svg viewBox="0 0 100 100" className="w-full h-full drop-shadow-lg overflow-visible">
            <defs>
              <linearGradient id="chestWood" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#78350F" />
                <stop offset="50%" stopColor="#451A03" />
                <stop offset="100%" stopColor="#1C0A00" />
              </linearGradient>
              <linearGradient id="chestGoldTrim" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#FFF9D2" />
                <stop offset="40%" stopColor="#F59E0B" />
                <stop offset="100%" stopColor="#78350F" />
              </linearGradient>
            </defs>

            {/* Chest Base */}
            <rect x="12" y="46" width="76" height="42" rx="4" fill="url(#chestWood)" stroke="#FBBF24" strokeWidth="2.5" />

            {/* Gold Straps with Rivets */}
            <rect x="20" y="46" width="9" height="42" fill="url(#chestGoldTrim)" />
            <rect x="71" y="46" width="9" height="42" fill="url(#chestGoldTrim)" />

            {/* Open Lid Angled Up */}
            <polygon points="10,46 90,46 84,20 16,20" fill="url(#chestWood)" stroke="#FDE047" strokeWidth="2.2" />
            <polygon points="20,20 29,20 29,46 20,46" fill="url(#chestGoldTrim)" />
            <polygon points="71,20 80,20 80,46 71,46" fill="url(#chestGoldTrim)" />

            {/* Overflowing Gold Coins & Jewels */}
            <ellipse cx="50" cy="46" rx="32" ry="9" fill="#FBBF24" />
            <circle cx="35" cy="44" r="4.5" fill="#FEF08A" stroke="#78350F" strokeWidth="1" />
            <circle cx="48" cy="43" r="5" fill="#FEF08A" stroke="#78350F" strokeWidth="1" />
            <circle cx="61" cy="44" r="4.5" fill="#FEF08A" stroke="#78350F" strokeWidth="1" />
            <polygon points="41,41 44,45 41,49 38,45" fill="#EF4444" stroke="#FFF" strokeWidth="0.8" />
            <polygon points="57,41 60,45 57,49 54,45" fill="#38BDF8" stroke="#FFF" strokeWidth="0.8" />

            {/* Keyhole Medallion */}
            <circle cx="50" cy="62" r="7" fill="url(#chestGoldTrim)" stroke="#FEF08A" strokeWidth="1.2" />
            <circle cx="50" cy="61" r="1.8" fill="#000" />
            <path d="M49 61 L51 61 L52 66 L48 66 Z" fill="#000" />
          </svg>
        );

      case 'GRAPES': // Themed as Gold Ingot Staircase
        return (
          <svg viewBox="0 0 100 100" className="w-full h-full drop-shadow-lg overflow-visible">
            <defs>
              <linearGradient id="ingotBarA" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#FFFBEB" />
                <stop offset="30%" stopColor="#FDE047" />
                <stop offset="70%" stopColor="#D97706" />
                <stop offset="100%" stopColor="#78350F" />
              </linearGradient>
            </defs>

            {/* Ingot 1 (Bottom) */}
            <polygon points="14,66 86,66 76,84 6,84" fill="url(#ingotBarA)" stroke="#FFF" strokeWidth="1.5" />
            {/* Ingot 2 (Middle) */}
            <polygon points="20,44 80,44 70,62 10,62" fill="url(#ingotBarA)" stroke="#FFF" strokeWidth="1.5" />
            {/* Ingot 3 (Top) */}
            <polygon points="26,22 74,22 64,40 16,40" fill="url(#ingotBarA)" stroke="#FFF" strokeWidth="1.8" />

            {/* Top Bar Embossed Mint Seal */}
            <ellipse cx="45" cy="31" rx="14" ry="5.5" fill="#78350F" opacity="0.35" />
            <ellipse cx="45" cy="31" rx="11" ry="4" fill="none" stroke="#FEF08A" strokeWidth="0.8" />
            <circle cx="45" cy="31" r="2.5" fill="#FEF08A" />

            {/* Base Horizontal Ingot Inscription Plaque */}
            <rect x="16" y="72" width="68" height="16" rx="4" fill="#1C1408" stroke="#F59E0B" strokeWidth="1.2" />
            <text x="50" y="83" textAnchor="middle" fill="#FDE047" fontWeight="900" fontSize="7" fontFamily="sans-serif" letterSpacing="0.8">
              FINE GOLD
            </text>

            <polygon points="70,24 72,28 77,29 72,30 70,35 68,30 63,29 68,28" fill="#FFFFFF" />
          </svg>
        );

      case 'CHERRY': // Themed as Diamond Dollar Sign ($)
        return (
          <svg viewBox="0 0 100 100" className="w-full h-full drop-shadow-lg overflow-visible">
            <defs>
              <linearGradient id="diaDollarGold" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#FFFDEB" />
                <stop offset="35%" stopColor="#F59E0B" />
                <stop offset="80%" stopColor="#B45309" />
                <stop offset="100%" stopColor="#78350F" />
              </linearGradient>
            </defs>

            {/* Giant 3D Diamond-Studded Dollar Sign */}
            <text
              x="50"
              y="74"
              textAnchor="middle"
              fill="url(#diaDollarGold)"
              stroke="#FFF"
              strokeWidth="2.5"
              fontWeight="900"
              fontSize="76"
              fontFamily="sans-serif"
              className="drop-shadow-[0_4px_8px_rgba(0,0,0,0.8)]"
            >
              $
            </text>

            {/* Inlaid Pavé Diamond Studs */}
            <circle cx="50" cy="20" r="2.8" fill="#FFF" />
            <circle cx="50" cy="34" r="2.8" fill="#BAE6FD" />
            <circle cx="50" cy="49" r="3.2" fill="#FFF" />
            <circle cx="50" cy="65" r="2.8" fill="#BAE6FD" />
            <circle cx="35" cy="32" r="2.8" fill="#FFF" />
            <circle cx="65" cy="63" r="2.8" fill="#FFF" />

            {/* Sparkle */}
            <polygon points="66,22 68,26 73,27 68,28 66,33 64,28 59,27 64,26" fill="#FFFFFF" />
          </svg>
        );

      case 'PLUM': // Themed as Cash Currency Roll with Gold Money Clip
        return (
          <svg viewBox="0 0 100 100" className="w-full h-full drop-shadow-lg overflow-visible">
            <defs>
              <linearGradient id="rollGreen" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#86EFAC" />
                <stop offset="40%" stopColor="#22C55E" />
                <stop offset="80%" stopColor="#15803D" />
                <stop offset="100%" stopColor="#052E16" />
              </linearGradient>
              <linearGradient id="goldClip" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#FFFDEB" />
                <stop offset="50%" stopColor="#F59E0B" />
                <stop offset="100%" stopColor="#78350F" />
              </linearGradient>
            </defs>

            {/* Cylindrical Currency Roll */}
            <ellipse cx="28" cy="50" rx="16" ry="32" fill="url(#rollGreen)" stroke="#FFF" strokeWidth="2" />
            <path d="M28 18 L76 18 C92 18, 92 82, 76 82 L28 82 Z" fill="url(#rollGreen)" stroke="#FFF" strokeWidth="2" />
            <ellipse cx="76" cy="50" rx="14" ry="31" fill="#14532D" stroke="#4ADE80" strokeWidth="1.2" />

            {/* 24K Gold Money Clip Clamp */}
            <rect x="48" y="14" width="16" height="72" rx="4" fill="url(#goldClip)" stroke="#FEF08A" strokeWidth="2" />
            <circle cx="56" cy="50" r="4.5" fill="#78350F" stroke="#FEF08A" strokeWidth="1" />
            <text x="56" y="53" textAnchor="middle" fill="#FDE047" fontWeight="900" fontSize="8" fontFamily="sans-serif">
              $
            </text>
          </svg>
        );

      case 'ACE':
        return (
          <svg viewBox="0 0 100 100" className="w-full h-full drop-shadow-xl overflow-visible">
            <defs>
              <linearGradient id="aceIngotGold" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#FFFDEB" />
                <stop offset="25%" stopColor="#FDE047" />
                <stop offset="60%" stopColor="#D97706" />
                <stop offset="100%" stopColor="#451A03" />
              </linearGradient>
              <linearGradient id="aceGleamLine" x1="0%" y1="0%" x2="100%" y2="0%">
                <stop offset="0%" stopColor="#FBBF24" stopOpacity="0" />
                <stop offset="50%" stopColor="#FFF" stopOpacity="0.9" />
                <stop offset="100%" stopColor="#FBBF24" stopOpacity="0" />
              </linearGradient>
            </defs>

            {/* 3D Gold Ingot Body - Angled Perspective */}
            <polygon points="18,30 32,14 82,14 68,30" fill="#FEF08A" stroke="#78350F" strokeWidth="1" />
            <polygon points="68,30 82,14 82,72 68,84" fill="#B45309" stroke="#78350F" strokeWidth="1" />
            <polygon points="18,30 68,30 68,84 18,84" fill="url(#aceIngotGold)" stroke="#FFF" strokeWidth="1.5" />

            {/* Ingot Inset Bevel Frame */}
            <rect x="22" y="34" width="42" height="46" rx="3" fill="#1C1004" stroke="#FDE047" strokeWidth="1.2" />

            {/* Ingot Top Hallmark Stamping */}
            <text x="43" y="42" textAnchor="middle" fill="#FDE047" fontSize="5" fontWeight="900" fontFamily="sans-serif" letterSpacing="0.8">
              ★ 999.9 FINE ★
            </text>

            {/* Bold 3D Raised Ingot 'A' */}
            <path
              d="M43 45 L54 71 L48 71 L45 64 L41 64 L38 71 L32 71 Z M43 53 L41 60 L45 60 Z"
              fill="url(#aceIngotGold)"
              stroke="#FFF"
              strokeWidth="1.2"
              strokeLinejoin="round"
            />

            {/* Specular Glint Star on Apex */}
            <polygon points="43,45 44.5,41 46,45 50,45 47,48 48,52 43,49 38,52 39,48 36,45 40,45" fill="#FFF" />

            {/* Plaque Banner: "ACE" */}
            <g transform="translate(0, 5)">
              <rect x="20" y="74" width="46" height="13" rx="3" fill="#0C0F18" stroke="#F59E0B" strokeWidth="1.5" />
              <rect x="22" y="76" width="42" height="9" rx="1.5" fill="#1E1408" />
              <text x="43" y="83.5" textAnchor="middle" fill="#FEF08A" fontSize="7" fontWeight="900" fontFamily="sans-serif" letterSpacing="1.2">
                ACE
              </text>
            </g>
          </svg>
        );

      case 'KING':
        return (
          <svg viewBox="0 0 100 100" className="w-full h-full drop-shadow-xl overflow-visible">
            <defs>
              <linearGradient id="kingShieldGold" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#FFF9D2" />
                <stop offset="30%" stopColor="#F59E0B" />
                <stop offset="70%" stopColor="#B45309" />
                <stop offset="100%" stopColor="#451A03" />
              </linearGradient>
              <linearGradient id="kingRuby" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#FDA4AF" />
                <stop offset="50%" stopColor="#E11D48" />
                <stop offset="100%" stopColor="#4C0519" />
              </linearGradient>
            </defs>

            {/* Crossed Golden King Scepters Behind Shield */}
            <line x1="20" y1="20" x2="80" y2="80" stroke="url(#kingShieldGold)" strokeWidth="4" strokeLinecap="round" />
            <circle cx="20" cy="20" r="5" fill="url(#kingRuby)" stroke="#FFF" strokeWidth="1" />
            <line x1="80" y1="20" x2="20" y2="80" stroke="url(#kingShieldGold)" strokeWidth="4" strokeLinecap="round" />
            <circle cx="80" cy="20" r="5" fill="url(#kingRuby)" stroke="#FFF" strokeWidth="1" />

            {/* Royal King's Crest Shield */}
            <path
              d="M50 16 L76 26 C76 56 64 74 50 82 C36 74 24 56 24 26 Z"
              fill="#1C0F08"
              stroke="url(#kingShieldGold)"
              strokeWidth="2.5"
            />
            <path
              d="M50 20 L72 28 C72 54 62 70 50 77 C38 70 28 54 28 28 Z"
              fill="#4A0404"
              stroke="#FDE047"
              strokeWidth="1"
            />

            {/* Imperial 5-Point Crown Atop Shield */}
            <path d="M36 28 L42 20 L50 26 L58 20 L64 28 Z" fill="url(#kingShieldGold)" stroke="#FFF" strokeWidth="0.8" />
            <circle cx="50" cy="18" r="2.5" fill="url(#kingRuby)" stroke="#FFF" strokeWidth="0.6" />

            {/* Bold Regal 3D 'K' */}
            <path
              d="M38 34 H44 V52 L56 34 H64 L52 53 L66 72 H57 L44 55 V72 H38 Z"
              fill="url(#kingShieldGold)"
              stroke="#FFF"
              strokeWidth="1.2"
              strokeLinejoin="round"
            />

            {/* Plaque Banner: "KING" */}
            <g transform="translate(0, 6)">
              <rect x="22" y="74" width="56" height="13" rx="3" fill="#0C0F18" stroke="#F59E0B" strokeWidth="1.5" />
              <rect x="24" y="76" width="52" height="9" rx="1.5" fill="#1E1408" />
              <text x="50" y="83.5" textAnchor="middle" fill="#FEF08A" fontSize="7" fontWeight="900" fontFamily="sans-serif" letterSpacing="1.2">
                KING
              </text>
            </g>
          </svg>
        );

      case 'QUEEN':
        return (
          <svg viewBox="0 0 100 100" className="w-full h-full drop-shadow-xl overflow-visible">
            <defs>
              <linearGradient id="queenGoldMedal" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#FFFBEB" />
                <stop offset="35%" stopColor="#FBBF24" />
                <stop offset="70%" stopColor="#C084FC" />
                <stop offset="100%" stopColor="#3B0764" />
              </linearGradient>
              <linearGradient id="queenVelvet" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#581C87" />
                <stop offset="50%" stopColor="#2E1065" />
                <stop offset="100%" stopColor="#0F031E" />
              </linearGradient>
            </defs>

            {/* Golden Radiating Sunburst / Laurel Ring */}
            <circle cx="50" cy="48" r="32" fill="none" stroke="#FDE047" strokeWidth="1.5" strokeDasharray="2,3" />

            {/* Royal Cameo Medallion Frame */}
            <ellipse cx="50" cy="48" rx="27" ry="31" fill="url(#queenGoldMedal)" stroke="#FFF" strokeWidth="2" />
            <ellipse cx="50" cy="48" rx="23" ry="27" fill="url(#queenVelvet)" stroke="#E9D5FF" strokeWidth="1" />

            {/* Sparkling Queen's Diamond Tiara */}
            <path
              d="M34 26 L42 21 L50 15 L58 21 L66 26 L62 31 L38 31 Z"
              fill="#E0F2FE"
              stroke="#FFF"
              strokeWidth="1"
            />
            <circle cx="50" cy="15" r="3" fill="#A855F7" stroke="#FFF" strokeWidth="0.8" />
            <circle cx="42" cy="21" r="2" fill="#38BDF8" />
            <circle cx="58" cy="21" r="2" fill="#38BDF8" />

            {/* Elegant Royal 'Q' */}
            <path
              d="M50 32 C41 32 34 38 34 50 C34 61 40 67 48 68 L53 73 L58 73 L55 67 C61 64 65 58 65 50 C65 38 59 32 50 32 Z M50 40 C55 40 58 44 58 50 C58 56 55 60 50 60 C45 60 42 56 42 50 C42 44 45 40 50 40 Z"
              fill="url(#queenGoldMedal)"
              stroke="#FFF"
              strokeWidth="1.2"
            />

            {/* Plaque Banner: "QUEEN" */}
            <g transform="translate(0, 6)">
              <rect x="20" y="74" width="60" height="13" rx="3" fill="#0C0F18" stroke="#A855F7" strokeWidth="1.5" />
              <rect x="22" y="76" width="56" height="9" rx="1.5" fill="#1E0B36" />
              <text x="50" y="83.5" textAnchor="middle" fill="#E9D5FF" fontSize="7" fontWeight="900" fontFamily="sans-serif" letterSpacing="1.2">
                QUEEN
              </text>
            </g>
          </svg>
        );

      case 'JACK':
        return (
          <svg viewBox="0 0 100 100" className="w-full h-full drop-shadow-xl overflow-visible">
            <defs>
              <linearGradient id="jackKeyGold" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#E0F2FE" />
                <stop offset="30%" stopColor="#38BDF8" />
                <stop offset="70%" stopColor="#0284C7" />
                <stop offset="100%" stopColor="#082F49" />
              </linearGradient>
            </defs>

            {/* Dual Crossed Master Vault Keys */}
            <g opacity="0.85">
              <line x1="22" y1="22" x2="78" y2="78" stroke="url(#jackKeyGold)" strokeWidth="4.5" strokeLinecap="round" />
              <circle cx="22" cy="22" r="7" fill="none" stroke="#38BDF8" strokeWidth="2.5" />
              <line x1="78" y1="22" x2="22" y2="78" stroke="url(#jackKeyGold)" strokeWidth="4.5" strokeLinecap="round" />
              <circle cx="78" cy="22" r="7" fill="none" stroke="#38BDF8" strokeWidth="2.5" />
            </g>

            {/* Vault Keycard / Armored Security Badge Body */}
            <path
              d="M32 20 L68 20 L76 34 L68 76 L32 76 L24 34 Z"
              fill="#0A1424"
              stroke="url(#jackKeyGold)"
              strokeWidth="2.2"
            />
            <path
              d="M36 24 L64 24 L70 34 L64 72 L36 72 L30 34 Z"
              fill="#0F172A"
              stroke="#38BDF8"
              strokeWidth="0.8"
            />

            {/* High-Roller Gold Microchip Pattern */}
            <rect x="42" y="27" width="16" height="8" rx="1.5" fill="#F59E0B" stroke="#FEF08A" strokeWidth="0.8" />

            {/* Bold Glowing 'J' */}
            <path
              d="M44 38 H62 V44 H54 V64 C54 69 50 72 44 72 C38 72 34 69 34 64 H41 C41 66 42 67 44 67 C46 67 47 66 47 63 V38 Z"
              fill="url(#jackKeyGold)"
              stroke="#FFF"
              strokeWidth="1.2"
              strokeLinejoin="round"
            />

            {/* Plaque Banner: "JACK" */}
            <g transform="translate(0, 6)">
              <rect x="22" y="74" width="56" height="13" rx="3" fill="#0C0F18" stroke="#0284C7" strokeWidth="1.5" />
              <rect x="24" y="76" width="52" height="9" rx="1.5" fill="#082F49" />
              <text x="50" y="83.5" textAnchor="middle" fill="#BAE6FD" fontSize="7" fontWeight="900" fontFamily="sans-serif" letterSpacing="1.2">
                JACK
              </text>
            </g>
          </svg>
        );

      // =========================================================================
      // --- TIMBERLAND CRITTERS SYMBOLS ---
      // =========================================================================

      case 'BEAR':
        return (
          <svg viewBox="0 0 100 100" className="w-full h-full drop-shadow-lg overflow-visible">
            <defs>
              <linearGradient id="bearPlaque" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#78350F" />
                <stop offset="50%" stopColor="#451A03" />
                <stop offset="100%" stopColor="#1C0A00" />
              </linearGradient>
              <linearGradient id="bearFur" x1="0%" y1="0%" x2="0%" y2="100%">
                <stop offset="0%" stopColor="#B45309" />
                <stop offset="50%" stopColor="#78350F" />
                <stop offset="100%" stopColor="#451A03" />
              </linearGradient>
              <linearGradient id="wildBanner" x1="0%" y1="0%" x2="100%" y2="0%">
                <stop offset="0%" stopColor="#F59E0B" />
                <stop offset="50%" stopColor="#FEF08A" />
                <stop offset="100%" stopColor="#D97706" />
              </linearGradient>
            </defs>
            {/* Wooden Plaque Frame */}
            <rect x="10" y="8" width="80" height="78" rx="16" fill="url(#bearPlaque)" stroke="#F59E0B" strokeWidth="2.5" />
            <rect x="14" y="12" width="72" height="70" rx="12" fill="none" stroke="#92400E" strokeWidth="1.5" strokeDasharray="4 2" />
            {/* Bear Ears */}
            <circle cx="28" cy="24" r="10" fill="#78350F" stroke="#F59E0B" strokeWidth="1.5" />
            <circle cx="28" cy="24" r="5" fill="#FDE68A" />
            <circle cx="72" cy="24" r="10" fill="#78350F" stroke="#F59E0B" strokeWidth="1.5" />
            <circle cx="72" cy="24" r="5" fill="#FDE68A" />
            {/* Bear Head & Snout */}
            <ellipse cx="50" cy="42" rx="28" ry="24" fill="url(#bearFur)" />
            <ellipse cx="50" cy="50" rx="16" ry="12" fill="#FDE68A" />
            <polygon points="50,44 43,40 57,40" fill="#1C0A00" />
            {/* Roaring Mouth & Fangs */}
            <path d="M43 51 Q50 60 57 51 Z" fill="#991B1B" stroke="#451A03" strokeWidth="1" />
            <polygon points="45,51 46,55 48,51" fill="#FFF" />
            <polygon points="52,51 54,55 55,51" fill="#FFF" />
            {/* Glowing Golden Eyes */}
            <circle cx="38" cy="38" r="4.5" fill="#FEF08A" stroke="#451A03" strokeWidth="1" />
            <circle cx="39" cy="38" r="2" fill="#1C0A00" />
            <circle cx="62" cy="38" r="4.5" fill="#FEF08A" stroke="#451A03" strokeWidth="1" />
            <circle cx="61" cy="38" r="2" fill="#1C0A00" />
            {/* Golden Claw Scratch Marks */}
            <path d="M15 15 L22 30 M22 14 L29 28 M29 14 L35 27" stroke="#FEF08A" strokeWidth="2" strokeLinecap="round" opacity="0.85" />
            {/* Carved Wood WILD Banner */}
            <rect x="16" y="68" width="68" height="22" rx="7" fill="#000" opacity="0.6" />
            <rect x="14" y="66" width="72" height="22" rx="7" fill="url(#wildBanner)" stroke="#FFF" strokeWidth="1.5" />
            <rect x="16" y="68" width="68" height="18" rx="5" fill="#2E1005" stroke="#F59E0B" strokeWidth="1" />
            <text
              x="50"
              y="81.5"
              textAnchor="middle"
              fill="#FEF08A"
              stroke="#451A03"
              strokeWidth="0.8"
              fontSize="11"
              fontWeight="900"
              fontFamily="sans-serif"
              letterSpacing="1.5"
              style={{ paintOrder: 'stroke fill' }}
            >
              WILD
            </text>
          </svg>
        );

      case 'OWL':
        return (
          <svg viewBox="0 0 100 100" className="w-full h-full drop-shadow-lg overflow-visible">
            <defs>
              <linearGradient id="nightSky" x1="0%" y1="0%" x2="0%" y2="100%">
                <stop offset="0%" stopColor="#0F172A" />
                <stop offset="100%" stopColor="#1E3A8A" />
              </linearGradient>
              <linearGradient id="moonGold" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#FEF08A" />
                <stop offset="100%" stopColor="#F59E0B" />
              </linearGradient>
            </defs>
            {/* Night Sky Circle */}
            <circle cx="50" cy="45" r="38" fill="url(#nightSky)" stroke="#60A5FA" strokeWidth="2.5" />
            {/* Crescent Moon */}
            <path d="M68 20 A22 22 0 1 1 54 52 A26 26 0 1 0 68 20 Z" fill="url(#moonGold)" opacity="0.9" />
            {/* Stars */}
            <circle cx="28" cy="22" r="1.5" fill="#FFF" />
            <circle cx="36" cy="18" r="1.2" fill="#FEF08A" />
            <circle cx="72" cy="38" r="1.5" fill="#FFF" />
            {/* Owl Body & Horn Feathers */}
            <polygon points="34,22 42,32 30,32" fill="#78350F" />
            <polygon points="66,22 58,32 70,32" fill="#78350F" />
            <ellipse cx="50" cy="48" rx="24" ry="22" fill="#92400E" stroke="#B45309" strokeWidth="1" />
            {/* Big Luminous Eyes */}
            <circle cx="41" cy="42" r="10" fill="#FEF08A" stroke="#451A03" strokeWidth="2" />
            <circle cx="41" cy="42" r="5" fill="#0F172A" />
            <circle cx="43" cy="40" r="1.5" fill="#FFF" />
            <circle cx="59" cy="42" r="10" fill="#FEF08A" stroke="#451A03" strokeWidth="2" />
            <circle cx="59" cy="42" r="5" fill="#0F172A" />
            <circle cx="61" cy="40" r="1.5" fill="#FFF" />
            {/* Beak & Chest Scallop */}
            <polygon points="50,47 46,55 54,55" fill="#F59E0B" stroke="#B45309" strokeWidth="0.8" />
            <path d="M42 58 Q50 63 58 58" fill="none" stroke="#FEF08A" strokeWidth="1.5" />
            <path d="M44 63 Q50 68 56 63" fill="none" stroke="#FEF08A" strokeWidth="1.5" />
            {/* SCATTER Perch Pedestal */}
            <rect x="12" y="72" width="76" height="22" rx="7" fill="#020617" stroke="#60A5FA" strokeWidth="1.8" />
            <rect x="14" y="74" width="72" height="18" rx="5" fill="#172554" stroke="#93C5FD" strokeWidth="0.8" />
            <text
              x="50"
              y="86.5"
              textAnchor="middle"
              fill="#93C5FD"
              stroke="#0F172A"
              strokeWidth="0.8"
              fontSize="9.5"
              fontWeight="900"
              fontFamily="sans-serif"
              letterSpacing="1"
              style={{ paintOrder: 'stroke fill' }}
            >
              SCATTER
            </text>
          </svg>
        );

      case 'ACORN':
        return (
          <svg viewBox="0 0 100 100" className="w-full h-full drop-shadow-xl overflow-visible">
            <defs>
              <linearGradient id="acornNutGold" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#FFFBEB" />
                <stop offset="25%" stopColor="#FDE047" />
                <stop offset="55%" stopColor="#F59E0B" />
                <stop offset="85%" stopColor="#D97706" />
                <stop offset="100%" stopColor="#78350F" />
              </linearGradient>
              <linearGradient id="acornCapBark" x1="0%" y1="0%" x2="0%" y2="100%">
                <stop offset="0%" stopColor="#B45309" />
                <stop offset="50%" stopColor="#78350F" />
                <stop offset="100%" stopColor="#2E1005" />
              </linearGradient>
              <linearGradient id="cashPlaqueGrad" x1="0%" y1="0%" x2="0%" y2="100%">
                <stop offset="0%" stopColor="#1E293B" />
                <stop offset="50%" stopColor="#0F172A" />
                <stop offset="100%" stopColor="#020617" />
              </linearGradient>
            </defs>

            {/* Glowing Golden Aura Behind Acorn */}
            <circle cx="50" cy="50" r="44" fill="url(#acornNutGold)" opacity="0.25" filter="blur(6px)" />

            {/* Radiant Autumn Leaves Behind */}
            <path d="M22 36 Q6 16 22 4 Q38 12 36 28 Z" fill="#16A34A" stroke="#86EFAC" strokeWidth="1.5" />
            <path d="M78 36 Q94 16 78 4 Q62 12 64 28 Z" fill="#EA580C" stroke="#FDBA74" strokeWidth="1.5" />

            {/* Curved Woody Stem */}
            <path d="M50 18 Q48 6 42 4" fill="none" stroke="#78350F" strokeWidth="4.5" strokeLinecap="round" />

            {/* Large Golden Nut Body */}
            <path
              d="M26 36 Q18 68 50 92 Q82 68 74 36 Z"
              fill="url(#acornNutGold)"
              stroke="#FFFBEB"
              strokeWidth="2.5"
              strokeLinejoin="round"
            />

            {/* Specular Nut Highlight */}
            <path d="M32 40 Q26 62 48 82 Q34 62 38 42 Z" fill="#FFF" opacity="0.4" />

            {/* Textured Oak Cap */}
            <path
              d="M22 36 Q50 20 78 36 Q78 44 74 46 Q50 36 26 46 Q22 44 22 36 Z"
              fill="url(#acornCapBark)"
              stroke="#FDE047"
              strokeWidth="1.8"
            />
            {/* Cap Studs / Texture */}
            <circle cx="34" cy="32" r="2" fill="#FEF08A" />
            <circle cx="50" cy="28" r="2.2" fill="#FEF08A" />
            <circle cx="66" cy="32" r="2" fill="#FEF08A" />
            <circle cx="42" cy="36" r="1.8" fill="#F59E0B" />
            <circle cx="58" cy="36" r="1.8" fill="#F59E0B" />

            {/* ULTRA-READABLE HIGH-CONTRAST RAISED CASH LINK PLAQUE */}
            <g transform="translate(0, 4)">
              {/* Plaque 3D Drop Shadow */}
              <rect x="8" y="46" width="84" height="26" rx="8" fill="#000" opacity="0.85" />
              {/* Outer Radiant Gold Border */}
              <rect x="7" y="44" width="86" height="26" rx="8" fill="#F59E0B" stroke="#FFF" strokeWidth="2" />
              {/* Inner Pure Jet Black Chamber */}
              <rect x="10" y="46" width="80" height="22" rx="6" fill="#000" stroke="#FDE047" strokeWidth="1.2" />

              {/* Bold, Ultra-Legible Pure Gold CASH Text */}
              <text
                x="50"
                y="62.5"
                textAnchor="middle"
                fill="#FFFBEB"
                stroke="#000"
                strokeWidth="2"
                fontSize="13"
                fontWeight="900"
                fontFamily="system-ui, -apple-system, sans-serif"
                letterSpacing="2"
                style={{ paintOrder: 'stroke fill' }}
              >
                CASH
              </text>
            </g>

            {/* Twinkling 4-Point Diamond Sparkles */}
            <polygon points="50,22 52,16 54,22 60,22 55,25 57,31 50,27 43,31 45,25 40,22 46,22" fill="#FFF" />
            <polygon points="80,50 82,45 84,50 89,50 85,53 87,58 82,55 77,58 79,53 74,50 79,50" fill="#FEF08A" />
            <polygon points="20,55 21,51 23,55 27,55 24,57 25,61 21,59 17,61 19,57 15,55 19,55" fill="#FEF08A" />
          </svg>
        );

      case 'WOLF':
        return (
          <svg viewBox="0 0 100 100" className="w-full h-full drop-shadow-lg overflow-visible">
            <defs>
              <linearGradient id="wolfBg" x1="0%" y1="0%" x2="0%" y2="100%">
                <stop offset="0%" stopColor="#082F49" />
                <stop offset="100%" stopColor="#0C4A6E" />
              </linearGradient>
              <linearGradient id="wolfSilver" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#F8FAFC" />
                <stop offset="50%" stopColor="#CBD5E1" />
                <stop offset="100%" stopColor="#64748B" />
              </linearGradient>
            </defs>
            <circle cx="50" cy="50" r="42" fill="url(#wolfBg)" stroke="#38BDF8" strokeWidth="2.5" />
            {/* Cyan Moon in background */}
            <circle cx="70" cy="28" r="12" fill="#BAE6FD" opacity="0.7" />
            {/* Howling Wolf Silhouette & Silver Highlights */}
            <path
              d="M32 78 L35 62 L42 54 L38 38 L48 45 L62 25 L65 35 L60 48 L70 56 L66 78 Z"
              fill="url(#wolfSilver)"
              stroke="#FFF"
              strokeWidth="1.5"
              strokeLinejoin="round"
            />
            {/* Piercing Cyan Eye */}
            <circle cx="54" cy="40" r="2.5" fill="#38BDF8" stroke="#082F49" strokeWidth="0.8" />
            <path d="M44 56 Q52 64 62 60" fill="none" stroke="#475569" strokeWidth="1.5" />
          </svg>
        );

      case 'FOX':
        return (
          <svg viewBox="0 0 100 100" className="w-full h-full drop-shadow-lg overflow-visible">
            <defs>
              <linearGradient id="foxOrange" x1="0%" y1="0%" x2="0%" y2="100%">
                <stop offset="0%" stopColor="#FB923C" />
                <stop offset="50%" stopColor="#EA580C" />
                <stop offset="100%" stopColor="#9A3412" />
              </linearGradient>
            </defs>
            <circle cx="50" cy="50" r="42" fill="#431407" stroke="#F97316" strokeWidth="2.5" />
            {/* Fox Ears */}
            <polygon points="26,18 42,38 24,42" fill="url(#foxOrange)" stroke="#F97316" strokeWidth="1" />
            <polygon points="28,24 38,36 28,38" fill="#1C1917" />
            <polygon points="74,18 58,38 76,42" fill="url(#foxOrange)" stroke="#F97316" strokeWidth="1" />
            <polygon points="72,24 62,36 72,38" fill="#1C1917" />
            {/* Fox Face */}
            <polygon points="24,42 76,42 50,78" fill="url(#foxOrange)" stroke="#F97316" strokeWidth="1.5" />
            {/* White Cheeks */}
            <polygon points="24,42 42,56 50,78 30,68" fill="#FFFBEB" />
            <polygon points="76,42 58,56 50,78 70,68" fill="#FFFBEB" />
            {/* Black Nose */}
            <ellipse cx="50" cy="74" rx="4" ry="3" fill="#1C1917" />
            {/* Fox Eyes */}
            <polygon points="34,46 42,48 37,52" fill="#1C1917" />
            <circle cx="37" cy="49" r="1" fill="#FEF08A" />
            <polygon points="66,46 58,48 63,52" fill="#1C1917" />
            <circle cx="63" cy="49" r="1" fill="#FEF08A" />
          </svg>
        );

      case 'RACCOON':
        return (
          <svg viewBox="0 0 100 100" className="w-full h-full drop-shadow-lg overflow-visible">
            <circle cx="50" cy="50" r="42" fill="#0F172A" stroke="#94A3B8" strokeWidth="2.5" />
            {/* Raccoon Ears */}
            <circle cx="28" cy="26" r="9" fill="#475569" stroke="#E2E8F0" strokeWidth="1.5" />
            <circle cx="28" cy="26" r="5" fill="#0F172A" />
            <circle cx="72" cy="26" r="9" fill="#475569" stroke="#E2E8F0" strokeWidth="1.5" />
            <circle cx="72" cy="26" r="5" fill="#0F172A" />
            {/* Head Face */}
            <ellipse cx="50" cy="50" rx="28" ry="24" fill="#94A3B8" stroke="#E2E8F0" strokeWidth="1" />
            {/* Black Bandit Mask */}
            <path d="M25 46 Q36 38 50 44 Q64 38 75 46 Q70 58 50 56 Q30 58 25 46 Z" fill="#0F172A" />
            {/* White Eyes in Mask */}
            <circle cx="38" cy="48" r="4.5" fill="#FFF" />
            <circle cx="38" cy="48" r="2.5" fill="#0F172A" />
            <circle cx="62" cy="48" r="4.5" fill="#FFF" />
            <circle cx="62" cy="48" r="2.5" fill="#0F172A" />
            {/* White Snout & Nose */}
            <ellipse cx="50" cy="62" rx="10" ry="7" fill="#F8FAFC" />
            <polygon points="50,58 46,62 54,62" fill="#0F172A" />
            {/* Whisker details */}
            <line x1="28" y1="62" x2="18" y2="60" stroke="#FFF" strokeWidth="1" />
            <line x1="28" y1="65" x2="18" y2="66" stroke="#FFF" strokeWidth="1" />
            <line x1="72" y1="62" x2="82" y2="60" stroke="#FFF" strokeWidth="1" />
            <line x1="72" y1="65" x2="82" y2="66" stroke="#FFF" strokeWidth="1" />
          </svg>
        );

      case 'SQUIRREL':
        return (
          <svg viewBox="0 0 100 100" className="w-full h-full drop-shadow-lg overflow-visible">
            <circle cx="50" cy="50" r="42" fill="#431407" stroke="#EA580C" strokeWidth="2.5" />
            {/* Giant Bushy Tail curving up */}
            <path
              d="M48 78 Q22 72 20 44 Q18 20 40 18 Q50 16 46 32 Q42 46 54 62 Z"
              fill="#EA580C"
              stroke="#FDBA74"
              strokeWidth="2"
            />
            {/* Squirrel Body & Head */}
            <ellipse cx="62" cy="56" rx="14" ry="18" fill="#C2410C" />
            <circle cx="64" cy="38" r="12" fill="#EA580C" stroke="#FDBA74" strokeWidth="1.5" />
            {/* Ear */}
            <polygon points="62,28 68,18 70,28" fill="#C2410C" />
            {/* Eye */}
            <circle cx="68" cy="36" r="3" fill="#0F172A" />
            <circle cx="69" cy="35" r="1" fill="#FFF" />
            {/* Acorn in Paws */}
            <circle cx="56" cy="56" r="6" fill="#F59E0B" stroke="#78350F" strokeWidth="1" />
          </svg>
        );

      case 'PINECONE':
        return (
          <svg viewBox="0 0 100 100" className="w-full h-full drop-shadow-lg overflow-visible">
            {/* Pine Needles */}
            <path d="M50 20 L30 10 M50 20 L70 10 M50 20 L24 22 M50 20 L76 22" stroke="#16A34A" strokeWidth="2.5" strokeLinecap="round" />
            {/* Pinecone Scales */}
            <ellipse cx="50" cy="56" rx="24" ry="32" fill="#78350F" stroke="#F59E0B" strokeWidth="2" />
            <path d="M38 36 Q50 44 62 36" stroke="#FEF08A" strokeWidth="2" fill="none" />
            <path d="M32 48 Q50 58 68 48" stroke="#FEF08A" strokeWidth="2" fill="none" />
            <path d="M34 60 Q50 70 66 60" stroke="#FEF08A" strokeWidth="2" fill="none" />
            <path d="M40 72 Q50 80 60 72" stroke="#FEF08A" strokeWidth="2" fill="none" />
          </svg>
        );

      case 'BERRIES':
        return (
          <svg viewBox="0 0 100 100" className="w-full h-full drop-shadow-lg overflow-visible">
            {/* Green Leaves */}
            <path d="M50 36 Q30 20 40 10 Q60 20 50 36 Z" fill="#15803D" stroke="#86EFAC" strokeWidth="1.5" />
            <path d="M50 36 Q70 20 60 10 Q40 20 50 36 Z" fill="#15803D" stroke="#86EFAC" strokeWidth="1.5" />
            {/* Berries Cluster */}
            <circle cx="36" cy="54" r="14" fill="#2563EB" stroke="#93C5FD" strokeWidth="2" />
            <circle cx="33" cy="50" r="3" fill="#93C5FD" opacity="0.8" />
            <circle cx="64" cy="54" r="14" fill="#E11D48" stroke="#FDA4AF" strokeWidth="2" />
            <circle cx="61" cy="50" r="3" fill="#FDA4AF" opacity="0.8" />
            <circle cx="50" cy="68" r="15" fill="#7C3AED" stroke="#C4B5FD" strokeWidth="2" />
            <circle cx="47" cy="64" r="3.5" fill="#C4B5FD" opacity="0.8" />
          </svg>
        );

      case 'MUSHROOM':
        return (
          <svg viewBox="0 0 100 100" className="w-full h-full drop-shadow-lg overflow-visible">
            {/* Bioluminescent Spores */}
            <circle cx="24" cy="30" r="2" fill="#FEF08A" opacity="0.8" />
            <circle cx="76" cy="32" r="2" fill="#FEF08A" opacity="0.8" />
            <circle cx="20" cy="58" r="2.5" fill="#FEF08A" opacity="0.8" />
            <circle cx="80" cy="56" r="2.5" fill="#FEF08A" opacity="0.8" />
            {/* Mushroom Stem */}
            <path d="M42 48 L40 82 Q50 86 60 82 L58 48 Z" fill="#F8FAFC" stroke="#CBD5E1" strokeWidth="2" />
            {/* Red Cap */}
            <path d="M16 52 Q50 14 84 52 Q50 58 16 52 Z" fill="#DC2626" stroke="#FEF08A" strokeWidth="2.5" />
            {/* White Polka Dots */}
            <circle cx="34" cy="38" r="5" fill="#FFF" />
            <circle cx="50" cy="28" r="6" fill="#FFF" />
            <circle cx="66" cy="38" r="5" fill="#FFF" />
            <circle cx="48" cy="46" r="3.5" fill="#FFF" />
          </svg>
        );

      case 'WOOD_A':
        return (
          <svg viewBox="0 0 100 100" className="w-full h-full drop-shadow-xl overflow-visible">
            <defs>
              <linearGradient id="oakArrowGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#2E180E" />
                <stop offset="50%" stopColor="#1E0F08" />
                <stop offset="100%" stopColor="#0D0603" />
              </linearGradient>
              <linearGradient id="oakEmerald" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#6EE7B7" />
                <stop offset="35%" stopColor="#10B981" />
                <stop offset="80%" stopColor="#047857" />
                <stop offset="100%" stopColor="#064E3B" />
              </linearGradient>
            </defs>

            {/* Hand-Chipped Oak Arrowhead Base Plaque */}
            <path
              d="M50 12 L78 36 L66 74 L50 68 L34 74 L22 36 Z"
              fill="url(#oakArrowGrad)"
              stroke="#B45309"
              strokeWidth="2.5"
              strokeLinejoin="round"
            />
            {/* Chipped Flint Inner Texture */}
            <path d="M50 16 L72 37 L62 70 L50 65 L38 70 L28 37 Z" fill="#3B1D0C" stroke="#78350F" strokeWidth="1" />

            {/* Leather Twine Binding at Base */}
            <line x1="42" y1="67" x2="58" y2="67" stroke="#D97706" strokeWidth="2" />
            <line x1="44" y1="69" x2="56" y2="69" stroke="#78350F" strokeWidth="1.5" />

            {/* Twin Evergreen Pine Needles */}
            <path d="M26 34 Q16 28 20 22 Q26 28 30 32" fill="#22C55E" />
            <path d="M74 34 Q84 28 80 22 Q74 28 70 32" fill="#22C55E" />

            {/* Carved Emerald Oak 'A' */}
            <path
              d="M50 25 L64 61 L56 61 L53 53 L47 53 L44 61 L36 61 Z M50 35 L47 47 L53 47 Z"
              fill="url(#oakEmerald)"
              stroke="#A7F3D0"
              strokeWidth="1.2"
              strokeLinejoin="round"
            />

            {/* Plaque Banner: "ACE" */}
            <g transform="translate(0, 5)">
              <rect x="24" y="74" width="52" height="13" rx="3" fill="#180C06" stroke="#059669" strokeWidth="1.5" />
              <rect x="26" y="76" width="48" height="9" rx="1.5" fill="#064E3B" />
              <text x="50" y="83.5" textAnchor="middle" fill="#A7F3D0" fontSize="7" fontWeight="900" fontFamily="sans-serif" letterSpacing="1.2">
                ACE
              </text>
            </g>
          </svg>
        );

      case 'WOOD_K':
        return (
          <svg viewBox="0 0 100 100" className="w-full h-full drop-shadow-xl overflow-visible">
            <defs>
              <linearGradient id="pineStagGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#FEF3C7" />
                <stop offset="35%" stopColor="#F59E0B" />
                <stop offset="75%" stopColor="#B45309" />
                <stop offset="100%" stopColor="#451A03" />
              </linearGradient>
            </defs>

            {/* Branching Cedar Stag Antlers Behind Shield */}
            <g stroke="#92400E" strokeWidth="3" strokeLinecap="round" fill="none">
              <path d="M42 28 Q30 14 16 16 M26 20 Q16 12 18 6 M34 18 Q28 8 32 4" />
              <path d="M58 28 Q70 14 84 16 M74 20 Q84 12 82 6 M66 18 Q72 8 68 4" />
            </g>

            {/* Hand-Hewn Pine Log Shield */}
            <path
              d="M50 18 L76 26 C76 54 64 72 50 80 C36 72 24 54 24 26 Z"
              fill="#2E180E"
              stroke="#D97706"
              strokeWidth="2.2"
            />
            <path
              d="M50 22 L72 28 C72 50 62 68 50 75 C38 68 28 50 28 28 Z"
              fill="#1A0C05"
              stroke="#78350F"
              strokeWidth="1"
            />

            {/* Golden Carved Rustic 'K' */}
            <path
              d="M38 32 H44 V50 L56 32 H64 L52 51 L66 70 H57 L44 53 V70 H38 Z"
              fill="url(#pineStagGrad)"
              stroke="#FEF3C7"
              strokeWidth="1.2"
              strokeLinejoin="round"
            />

            {/* Plaque Banner: "KING" */}
            <g transform="translate(0, 5)">
              <rect x="22" y="74" width="56" height="13" rx="3" fill="#180C06" stroke="#D97706" strokeWidth="1.5" />
              <rect x="24" y="76" width="52" height="9" rx="1.5" fill="#451A03" />
              <text x="50" y="83.5" textAnchor="middle" fill="#FDE68A" fontSize="7" fontWeight="900" fontFamily="sans-serif" letterSpacing="1.2">
                KING
              </text>
            </g>
          </svg>
        );

      case 'WOOD_Q':
        return (
          <svg viewBox="0 0 100 100" className="w-full h-full drop-shadow-xl overflow-visible">
            <defs>
              <linearGradient id="honeycombGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#DDD6FE" />
                <stop offset="30%" stopColor="#A855F7" />
                <stop offset="75%" stopColor="#7C3AED" />
                <stop offset="100%" stopColor="#3B0764" />
              </linearGradient>
            </defs>

            {/* Natural Hexagonal Honeycomb Frame */}
            <g fill="#241208" stroke="#F59E0B" strokeWidth="1.2">
              <polygon points="50,14 66,23 66,41 50,50 34,41 34,23" fill="#3B1D0C" />
              <polygon points="26,30 38,37 38,51 26,58 14,51 14,37" opacity="0.75" />
              <polygon points="74,30 86,37 86,51 74,58 62,51 62,37" opacity="0.75" />
              <polygon points="50,50 66,59 66,73 50,82 34,73 34,59" opacity="0.8" />
            </g>

            {/* Mountain Wildflower Petals */}
            <circle cx="50" cy="18" r="3.5" fill="#EC4899" />
            <circle cx="47" cy="16" r="3" fill="#F472B6" />
            <circle cx="53" cy="16" r="3" fill="#F472B6" />

            {/* Carved Royal Amethyst 'Q' */}
            <path
              d="M50 30 C41 30 34 36 34 47 C34 57 40 63 48 64 L53 69 L58 69 L55 63 C61 60 65 55 65 47 C65 36 59 30 50 30 Z M50 37 C55 37 58 41 58 47 C58 53 55 56 50 56 C45 56 42 53 42 47 C42 41 45 37 50 37 Z"
              fill="url(#honeycombGrad)"
              stroke="#EDE9FE"
              strokeWidth="1.2"
            />

            {/* Plaque Banner: "QUEEN" */}
            <g transform="translate(0, 5)">
              <rect x="20" y="74" width="60" height="13" rx="3" fill="#180C06" stroke="#7C3AED" strokeWidth="1.5" />
              <rect x="22" y="76" width="56" height="9" rx="1.5" fill="#3B0764" />
              <text x="50" y="83.5" textAnchor="middle" fill="#DDD6FE" fontSize="7" fontWeight="900" fontFamily="sans-serif" letterSpacing="1.2">
                QUEEN
              </text>
            </g>
          </svg>
        );

      case 'WOOD_J':
        return (
          <svg viewBox="0 0 100 100" className="w-full h-full drop-shadow-xl overflow-visible">
            <defs>
              <linearGradient id="axeTealGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#A5F3FC" />
                <stop offset="30%" stopColor="#06B6D4" />
                <stop offset="70%" stopColor="#0891B2" />
                <stop offset="100%" stopColor="#164E63" />
              </linearGradient>
            </defs>

            {/* Woodcutter's Double-Bit Axe in Cedar Stump */}
            {/* Axe Handle */}
            <line x1="72" y1="18" x2="32" y2="76" stroke="#78350F" strokeWidth="5" strokeLinecap="round" />
            <line x1="72" y1="18" x2="32" y2="76" stroke="#D97706" strokeWidth="2.5" strokeLinecap="round" />

            {/* Double Steel Axe Head */}
            <path
              d="M62 20 L80 14 C82 24 82 32 80 42 L62 36 L52 24 C50 30 50 36 52 42 Z"
              fill="#94A3B8"
              stroke="#F1F5F9"
              strokeWidth="1.2"
            />

            {/* Mossy Tree Stump Round */}
            <ellipse cx="48" cy="62" rx="32" ry="18" fill="#2E180E" stroke="#5C2B09" strokeWidth="2" />
            <ellipse cx="48" cy="62" rx="28" ry="14" fill="#1C0D05" stroke="#16A34A" strokeWidth="1" />

            {/* Carved Teal 'J' */}
            <path
              d="M44 38 H62 V44 H54 V60 C54 65 50 68 44 68 C38 68 34 65 34 60 H41 C41 62 42 63 44 63 C46 63 47 62 47 59 V38 Z"
              fill="url(#axeTealGrad)"
              stroke="#FFF"
              strokeWidth="1.2"
              strokeLinejoin="round"
            />

            {/* Plaque Banner: "JACK" */}
            <g transform="translate(0, 5)">
              <rect x="22" y="74" width="56" height="13" rx="3" fill="#180C06" stroke="#0891B2" strokeWidth="1.5" />
              <rect x="24" y="76" width="52" height="9" rx="1.5" fill="#164E63" />
              <text x="50" y="83.5" textAnchor="middle" fill="#A5F3FC" fontSize="7" fontWeight="900" fontFamily="sans-serif" letterSpacing="1.2">
                JACK
              </text>
            </g>
          </svg>
        );

      // =========================================================================
      // --- PIXEL ARCADE 8-BIT RETRO VIDEO GAME SYMBOLS ---
      // =========================================================================
      case 'CYBER_WILD':
        return (
          <svg viewBox="0 0 100 100" className="w-full h-full drop-shadow-xl overflow-visible">
            {/* Chromatic Rainbow 8-Bit Pixel After-Trail */}
            <rect x="22" y="58" width="8" height="6" fill="#FF007F" opacity="0.6" />
            <rect x="70" y="58" width="8" height="6" fill="#00F0FF" opacity="0.6" />
            <rect x="30" y="64" width="8" height="6" fill="#FFE600" opacity="0.6" />
            <rect x="62" y="64" width="8" height="6" fill="#39FF14" opacity="0.6" />

            {/* Stepped 8-Bit Star Outer Black Border */}
            <path
              d="M44 8 H56 V16 H64 V24 H76 V32 H88 V44 H76 V52 H68 V60 H76 V72 H64 V64 H56 V56 H44 V64 H36 V72 H24 V60 H32 V52 H24 V44 H12 V32 H24 V24 H36 V16 H44 Z"
              fill="#0F0524"
            />
            {/* Stepped 8-Bit Star Inner Body - Golden Core */}
            <path
              d="M46 12 H54 V18 H62 V26 H74 V34 H84 V42 H74 V50 H66 V58 H72 V68 H64 V60 H54 V52 H46 V60 H36 V68 H28 V58 H34 V50 H26 V42 H16 V34 H26 V26 H38 V18 H46 Z"
              fill="#FFE600"
            />
            {/* 8-Bit Shading & Specular Highlights */}
            <rect x="46" y="14" width="8" height="6" fill="#FFF" />
            <rect x="38" y="20" width="8" height="6" fill="#FFF" />
            <rect x="28" y="28" width="8" height="6" fill="#FFF" />
            {/* Bottom Dark Gold Stepped Shading */}
            <rect x="30" y="54" width="6" height="6" fill="#D97706" />
            <rect x="64" y="54" width="6" height="6" fill="#D97706" />
            <rect x="46" y="46" width="8" height="6" fill="#D97706" />

            {/* Iconic 8-Bit Vertical Pixel Eyes */}
            <rect x="42" y="30" width="5" height="12" fill="#000" />
            <rect x="42" y="30" width="5" height="4" fill="#FFF" />
            <rect x="53" y="30" width="5" height="12" fill="#000" />
            <rect x="53" y="30" width="5" height="4" fill="#FFF" />

            {/* Stepped 8-Bit WILD Plaque */}
            <path d="M14 74 H86 V92 H14 Z" fill="#000" />
            <path d="M16 76 H84 V90 H16 Z" fill="#FF007F" />
            <path d="M18 78 H82 V88 H18 Z" fill="#2E0854" />
            {/* Stepped 8-bit text: W I L D */}
            <text x="50" y="86.5" textAnchor="middle" fill="#00F0FF" fontWeight="900" fontSize="9.5" fontFamily="'Courier New', monospace" letterSpacing="1.5">
              WILD
            </text>
          </svg>
        );

      case 'PIXEL_CARTRIDGE':
        return (
          <svg viewBox="0 0 100 100" className="w-full h-full drop-shadow-xl overflow-visible">
            {/* Stepped 8-Bit Cartridge Black Outer Shell */}
            <path d="M18 10 H82 V74 H78 V80 H22 V74 H18 Z" fill="#05010B" />
            {/* Main Cartridge Body (Retro Dark Slate Gray) */}
            <path d="M20 12 H80 V72 H76 V78 H24 V72 H20 Z" fill="#475569" />
            {/* Cartridge Bevel Highlight */}
            <rect x="22" y="14" width="56" height="3" fill="#94A3B8" />

            {/* Top Stepped Grip Ridges */}
            <rect x="28" y="19" width="44" height="3" fill="#1E293B" />
            <rect x="28" y="24" width="44" height="3" fill="#1E293B" />
            <rect x="28" y="29" width="44" height="3" fill="#1E293B" />

            {/* Stepped Holographic Game Label */}
            <rect x="23" y="35" width="54" height="32" fill="#0D031F" stroke="#00F0FF" strokeWidth="1.5" />
            {/* 8-Bit Pixel Skull / Lightning Emblem */}
            <rect x="44" y="39" width="12" height="4" fill="#FF007F" />
            <rect x="42" y="43" width="16" height="4" fill="#FF007F" />
            <rect x="46" y="47" width="8" height="4" fill="#FFE600" />
            <rect x="48" y="51" width="4" height="4" fill="#FFE600" />
            <text x="50" y="62" textAnchor="middle" fill="#00F0FF" fontWeight="900" fontSize="6.5" fontFamily="sans-serif" letterSpacing="0.8">
              FREE SPINS
            </text>

            {/* Bottom Stepped Gold Connector Fingers */}
            <rect x="26" y="74" width="4" height="5" fill="#FBBF24" />
            <rect x="33" y="74" width="4" height="5" fill="#FBBF24" />
            <rect x="40" y="74" width="4" height="5" fill="#FBBF24" />
            <rect x="47" y="74" width="4" height="5" fill="#FBBF24" />
            <rect x="54" y="74" width="4" height="5" fill="#FBBF24" />
            <rect x="61" y="74" width="4" height="5" fill="#FBBF24" />
            <rect x="68" y="74" width="4" height="5" fill="#FBBF24" />

            {/* SCATTER Badge */}
            <path d="M12 78 H88 V94 H12 Z" fill="#000" />
            <path d="M14 80 H86 V92 H14 Z" fill="#00F0FF" />
            <path d="M16 82 H84 V90 H16 Z" fill="#061826" />
            <text x="50" y="88.5" textAnchor="middle" fill="#00F0FF" fontWeight="900" fontSize="7.5" fontFamily="sans-serif" letterSpacing="1.2">
              SCATTER
            </text>
          </svg>
        );

      case 'RETRO_TOKEN':
        return (
          <svg viewBox="0 0 100 100" className="w-full h-full drop-shadow-xl overflow-visible">
            {/* Stepped 8-Bit Outer Octagon Token Edge */}
            <path
              d="M36 8 H64 V14 H78 V22 H86 V36 H92 V64 H86 V78 H78 V86 H64 V92 H36 V86 H22 V78 H14 V64 H8 V36 H14 V22 H22 V14 H36 Z"
              fill="#0F0524"
            />
            {/* Heavy Brass Token Body */}
            <path
              d="M38 10 H62 V16 H76 V24 H84 V38 H90 V62 H84 V76 H76 V84 H62 V90 H38 V84 H24 V76 H16 V62 H10 V38 H16 V24 H24 V16 H38 Z"
              fill="#F59E0B"
            />
            {/* Beveled Specular Highlight Ring */}
            <path
              d="M38 12 H62 V18 H74 V26 H82 V38 H88 V50 H82 V28 H74 V20 H62 V14 H38 V20 H26 V28 H18 V50 H12 V38 H18 V26 H26 V18 H38 Z"
              fill="#FEF08A"
            />
            {/* Dark Stamped Coin Center */}
            <rect x="24" y="24" width="52" height="52" fill="#78350F" />
            <rect x="26" y="26" width="48" height="48" fill="#B45309" />

            {/* Stepped 8-Bit Joystick Stamped Motif */}
            <rect x="46" y="32" width="8" height="8" fill="#FEF08A" />
            <rect x="48" y="40" width="4" height="12" fill="#FEF08A" />
            <rect x="42" y="52" width="16" height="4" fill="#FEF08A" />
            {/* "25¢" Pixel Stamp */}
            <text x="50" y="66" textAnchor="middle" fill="#FEF08A" fontWeight="900" fontSize="10" fontFamily="'Courier New', monospace" letterSpacing="1">
              25¢
            </text>

            {/* Stepped 1-UP Badge */}
            <path d="M12 78 H88 V94 H12 Z" fill="#000" />
            <path d="M14 80 H86 V92 H14 Z" fill="#FBBF24" />
            <path d="M16 82 H84 V90 H16 Z" fill="#451A03" />
            <text x="50" y="88.5" textAnchor="middle" fill="#FEF08A" fontWeight="900" fontSize="7.5" fontFamily="sans-serif" letterSpacing="1.2">
              1-UP TOKEN
            </text>
          </svg>
        );

      case 'BOSS_DRAGON':
        return (
          <svg viewBox="0 0 100 100" className="w-full h-full drop-shadow-xl overflow-visible">
            {/* 8-Bit Cyber Mecha Dragon Horns */}
            <path d="M22 8 H32 V18 H22 Z M16 18 H26 V28 H16 Z" fill="#FFE600" />
            <path d="M68 8 H78 V18 H68 Z M74 18 H84 V28 H74 Z" fill="#FFE600" />

            {/* Stepped Dragon Skull Black Frame */}
            <path
              d="M26 22 H74 V32 H86 V56 H78 V68 H68 V80 H32 V68 H22 V56 H14 V32 H26 Z"
              fill="#0F0208"
            />
            {/* Cyber Armor Red Plates */}
            <path
              d="M28 24 H72 V34 H84 V54 H76 V66 H66 V78 H34 V66 H24 V54 H16 V34 H28 Z"
              fill="#DC2626"
            />
            {/* Armor Specular Plates */}
            <rect x="32" y="26" width="36" height="4" fill="#F87171" />
            <rect x="20" y="36" width="8" height="12" fill="#EF4444" />
            <rect x="72" y="36" width="8" height="12" fill="#991B1B" />

            {/* Glowing Cyan Optical Visor */}
            <rect x="22" y="40" width="56" height="8" fill="#000" />
            <rect x="24" y="42" width="52" height="4" fill="#00F0FF" />
            <rect x="42" y="42" width="16" height="4" fill="#FFFFFF" />

            {/* Stepped Cyber Fangs & Plasma Vent */}
            <rect x="34" y="58" width="6" height="8" fill="#FFF" />
            <rect x="44" y="58" width="6" height="6" fill="#00F0FF" />
            <rect x="52" y="58" width="6" height="6" fill="#00F0FF" />
            <rect x="60" y="58" width="6" height="8" fill="#FFF" />

            {/* Stepped BOSS Plaque */}
            <path d="M12 78 H88 V94 H12 Z" fill="#000" />
            <path d="M14 80 H86 V92 H14 Z" fill="#EF4444" />
            <path d="M16 82 H84 V90 H16 Z" fill="#450A0A" />
            <text x="50" y="88.5" textAnchor="middle" fill="#FCA5A5" fontWeight="900" fontSize="7.5" fontFamily="sans-serif" letterSpacing="1.2">
              BOSS 1500X
            </text>
          </svg>
        );

      case 'HERO_KNIGHT':
        return (
          <svg viewBox="0 0 100 100" className="w-full h-full drop-shadow-xl overflow-visible">
            {/* Stepped Crimson Feather Plume */}
            <path d="M46 6 H54 V16 H58 V24 H42 V16 H46 Z" fill="#EF4444" />
            <rect x="48" y="8" width="4" height="12" fill="#FCA5A5" />

            {/* Stepped Cyber Knight Helmet Shell */}
            <path
              d="M24 22 H76 V34 H84 V56 H76 V74 H64 V80 H36 V74 H24 V56 H16 V34 H24 Z"
              fill="#061226"
            />
            {/* Cobalt Armor Body */}
            <path
              d="M26 24 H74 V36 H82 V54 H74 V72 H62 V78 H38 V72 H26 V54 H18 V36 H26 Z"
              fill="#2563EB"
            />
            {/* Silver Armor Highlights */}
            <rect x="30" y="26" width="40" height="4" fill="#93C5FD" />
            <rect x="20" y="38" width="6" height="12" fill="#60A5FA" />
            <rect x="74" y="38" width="6" height="12" fill="#1D4ED8" />

            {/* Glowing Cyan Eye Slit */}
            <rect x="28" y="42" width="44" height="8" fill="#000" />
            <rect x="30" y="44" width="40" height="4" fill="#22D3EE" />
            <rect x="46" y="44" width="8" height="4" fill="#FFF" />

            {/* Stepped Diagonal Broadsword */}
            <path d="M78 12 H86 V20 H78 Z M74 20 H82 V28 H74 Z M68 28 H76 V36 H68 Z" fill="#E2E8F0" />
            <rect x="72" y="24" width="6" height="4" fill="#F59E0B" />

            {/* Stepped HERO Plaque */}
            <path d="M12 78 H88 V94 H12 Z" fill="#000" />
            <path d="M14 80 H86 V92 H14 Z" fill="#3B82F6" />
            <path d="M16 82 H84 V90 H16 Z" fill="#0F172A" />
            <text x="50" y="88.5" textAnchor="middle" fill="#93C5FD" fontWeight="900" fontSize="7.5" fontFamily="sans-serif" letterSpacing="1.2">
              HERO 900X
            </text>
          </svg>
        );

      case 'GAMEPAD':
        return (
          <svg viewBox="0 0 100 100" className="w-full h-full drop-shadow-xl overflow-visible">
            {/* Controller Cord Curling Out Top */}
            <path d="M50 10 H54 V20 H50 Z" fill="#0F172A" />
            <rect x="46" y="10" width="8" height="4" fill="#334155" />

            {/* Stepped Controller Outer Shell */}
            <path
              d="M14 20 H86 V26 H92 V68 H86 V74 H14 V68 H8 V26 H14 Z"
              fill="#050811"
            />
            {/* Controller Body (Classic 8-Bit Gray) */}
            <path
              d="M16 22 H84 V28 H90 V66 H84 V72 H16 V66 H10 V28 H16 Z"
              fill="#334155"
            />
            {/* Top Bevel Highlight */}
            <rect x="18" y="24" width="64" height="3" fill="#64748B" />

            {/* Stepped D-Pad Cross on Left */}
            <rect x="22" y="40" width="18" height="6" fill="#0F172A" />
            <rect x="28" y="34" width="6" height="18" fill="#0F172A" />
            <rect x="29" y="35" width="4" height="16" fill="#1E293B" />
            <rect x="23" y="41" width="16" height="4" fill="#1E293B" />

            {/* Select / Start Black Pills in Middle */}
            <rect x="44" y="44" width="6" height="3" fill="#0F172A" transform="rotate(-25 47 45)" />
            <rect x="53" y="44" width="6" height="3" fill="#0F172A" transform="rotate(-25 56 45)" />

            {/* Round Cherry-Red A & B Buttons on Right */}
            <rect x="66" y="42" width="8" height="8" fill="#000" />
            <rect x="67" y="43" width="6" height="6" fill="#EF4444" />
            <rect x="67" y="43" width="2" height="2" fill="#FFF" />

            <rect x="76" y="36" width="8" height="8" fill="#000" />
            <rect x="77" y="37" width="6" height="6" fill="#EF4444" />
            <rect x="77" y="37" width="2" height="2" fill="#FFF" />

            {/* Stepped GAMEPAD Plaque */}
            <path d="M14 78 H86 V94 H14 Z" fill="#000" />
            <path d="M16 80 H84 V92 H16 Z" fill="#10B981" />
            <path d="M18 82 H82 V90 H18 Z" fill="#062E1A" />
            <text x="50" y="88.5" textAnchor="middle" fill="#34D399" fontWeight="900" fontSize="7.5" fontFamily="sans-serif" letterSpacing="1.2">
              GAMEPAD
            </text>
          </svg>
        );

      case 'JOYSTICK':
        return (
          <svg viewBox="0 0 100 100" className="w-full h-full drop-shadow-xl overflow-visible">
            {/* Stepped Metal Base Plate */}
            <path d="M16 62 H84 V76 H16 Z" fill="#0F172A" />
            <path d="M18 64 H82 V74 H18 Z" fill="#475569" />
            {/* 4 Corner Screws */}
            <rect x="22" y="67" width="3" height="3" fill="#CBD5E1" />
            <rect x="75" y="67" width="3" height="3" fill="#CBD5E1" />

            {/* Black Stepped Rubber Dust Washer */}
            <rect x="36" y="60" width="28" height="4" fill="#0F172A" />

            {/* Stepped Chrome Shaft */}
            <rect x="46" y="30" width="8" height="30" fill="#0F172A" />
            <rect x="47" y="30" width="6" height="30" fill="#CBD5E1" />
            <rect x="48" y="30" width="2" height="30" fill="#FFFFFF" />

            {/* Stepped 8-Bit Red Balltop */}
            <path
              d="M42 12 H58 V18 H66 V26 H70 V36 H66 V44 H58 V48 H42 V44 H34 V36 H30 V26 H34 V18 H42 Z"
              fill="#0F0208"
            />
            <path
              d="M44 14 H56 V20 H64 V28 H68 V34 H64 V42 H56 V46 H44 V42 H36 V34 H32 V28 H36 V20 H44 Z"
              fill="#DC2626"
            />
            {/* White Glint Highlight Pixels */}
            <rect x="38" y="18" width="6" height="6" fill="#FFF" />
            <rect x="44" y="24" width="4" height="4" fill="#FFF" />
            {/* Dark Shading */}
            <rect x="52" y="36" width="10" height="6" fill="#7F1D1D" />

            {/* Stepped JOYSTICK Plaque */}
            <path d="M14 78 H86 V94 H14 Z" fill="#000" />
            <path d="M16 80 H84 V92 H16 Z" fill="#F97316" />
            <path d="M18 82 H82 V90 H18 Z" fill="#431407" />
            <text x="50" y="88.5" textAnchor="middle" fill="#FDBA74" fontWeight="900" fontSize="7.5" fontFamily="sans-serif" letterSpacing="1.2">
              JOYSTICK
            </text>
          </svg>
        );

      case 'POTION_HEAL':
        return (
          <svg viewBox="0 0 100 100" className="w-full h-full drop-shadow-xl overflow-visible">
            {/* Stepped Brown Cork Stopper */}
            <rect x="42" y="12" width="16" height="8" fill="#000" />
            <rect x="44" y="14" width="12" height="6" fill="#B45309" />
            <rect x="44" y="14" width="4" height="2" fill="#FEF08A" />

            {/* Stepped Glass Neck */}
            <rect x="45" y="20" width="10" height="12" fill="#0F172A" />
            <rect x="46" y="20" width="8" height="12" fill="#6366F1" opacity="0.6" />

            {/* Stepped Spherical Glass Flask Body */}
            <path
              d="M34 32 H66 V40 H76 V52 H80 V66 H76 V76 H66 V82 H34 V76 H24 V66 H20 V52 H24 V40 H34 Z"
              fill="#0F0524"
            />
            {/* Bubbling Magic Liquid Body */}
            <path
              d="M36 44 H64 V52 H74 V64 H72 V74 H64 V80 H36 V74 H28 V64 H26 V52 H36 Z"
              fill="#9333EA"
            />
            {/* Bright Magenta Glowing Fluid Core */}
            <rect x="32" y="56" width="36" height="18" fill="#C084FC" />
            {/* Stepped Glass Specular Glints */}
            <rect x="28" y="44" width="4" height="10" fill="#FFF" />
            <rect x="36" y="36" width="6" height="4" fill="#FFF" />
            {/* Bubbling Rising Pixels */}
            <rect x="46" y="48" width="4" height="4" fill="#FFF" />
            <rect x="56" y="54" width="3" height="3" fill="#FFF" />
            <rect x="40" y="62" width="3" height="3" fill="#FFF" />

            {/* Stepped POTION Plaque */}
            <path d="M14 78 H86 V94 H14 Z" fill="#000" />
            <path d="M16 80 H84 V92 H16 Z" fill="#A855F7" />
            <path d="M18 82 H82 V90 H18 Z" fill="#2E1065" />
            <text x="50" y="88.5" textAnchor="middle" fill="#E9D5FF" fontWeight="900" fontSize="7.5" fontFamily="sans-serif" letterSpacing="1.2">
              POTION
            </text>
          </svg>
        );

      case 'PIXEL_A':
        return (
          <svg viewBox="0 0 100 100" className="w-full h-full drop-shadow-xl overflow-visible">
            {/* 8-Bit Cyber Ace Starfighter & Power Shield */}
            {/* Outer Drop Shadow */}
            <path
              d="M44 8 H56 V16 H68 V28 H78 V44 H88 V64 H76 V72 H60 V64 H56 V56 H44 V56 H40 V64 H24 V72 H12 V64 H22 V44 H32 V28 H44 Z"
              fill="#05010B"
            />
            {/* Crimson Starfighter Hull */}
            <path
              d="M46 10 H54 V18 H66 V30 H76 V46 H84 V62 H74 V68 H58 V60 H54 V54 H46 V54 H42 V60 H26 V68 H16 V62 H24 V46 H34 V30 H46 Z"
              fill="#E11D48"
            />
            {/* Cyan Energy Plasma Wings */}
            <rect x="14" y="50" width="8" height="8" fill="#06B6D4" />
            <rect x="78" y="50" width="8" height="8" fill="#06B6D4" />
            <rect x="16" y="52" width="4" height="4" fill="#CFFAFE" />
            <rect x="80" y="52" width="4" height="4" fill="#CFFAFE" />

            {/* Cockpit Center Shield Plate */}
            <rect x="36" y="24" width="28" height="34" fill="#0F0524" />
            <rect x="38" y="26" width="24" height="30" fill="#BE123C" />

            {/* Stepped Pixel 'A' Inside Starfighter */}
            <path
              d="M46 30 H54 V36 H58 V52 H52 V44 H48 V52 H42 V36 H46 Z M48 36 H52 V40 H48 Z"
              fill="#FFF"
            />

            {/* Specular Highlights */}
            <rect x="46" y="10" width="8" height="4" fill="#FDA4AF" />
            <rect x="34" y="30" width="4" height="16" fill="#FDA4AF" />

            {/* Stepped Plaque: "ACE" */}
            <path d="M16 76 H84 V92 H16 Z" fill="#000" />
            <path d="M18 78 H82 V90 H18 Z" fill="#F43F5E" />
            <path d="M20 80 H80 V88 H20 Z" fill="#881337" />
            <text x="50" y="86.5" textAnchor="middle" fill="#FECDD3" fontWeight="900" fontSize="7.5" fontFamily="sans-serif" letterSpacing="1.2">
              ACE
            </text>
          </svg>
        );

      case 'PIXEL_K':
        return (
          <svg viewBox="0 0 100 100" className="w-full h-full drop-shadow-xl overflow-visible">
            {/* 8-Bit Royal Arcade King Crown & Crest */}
            {/* Black Drop Shadow */}
            <path
              d="M16 24 H26 V14 H38 V24 H50 V10 H62 V24 H74 V14 H84 V64 H76 V72 H24 V64 H16 Z"
              fill="#05010B"
            />
            {/* Gold Crown Body */}
            <path
              d="M18 26 H24 V16 H36 V26 H48 V12 H52 V26 H64 V16 H76 V26 H82 V62 H74 V70 H26 V62 H18 Z"
              fill="#F59E0B"
            />
            {/* Specular Crown Rim */}
            <rect x="22" y="58" width="56" height="8" fill="#FEF08A" />
            <rect x="26" y="60" width="48" height="4" fill="#B45309" />

            {/* Pixel Jewels on Crown Peaks */}
            <rect x="26" y="18" width="8" height="8" fill="#EF4444" />
            <rect x="46" y="14" width="8" height="8" fill="#06B6D4" />
            <rect x="66" y="18" width="8" height="8" fill="#EF4444" />

            {/* Stepped Electric Cyan 'K' Inside Crown */}
            <path
              d="M36 32 H42 V46 H48 V38 H56 V32 H64 V40 H56 V48 H66 V60 H58 V52 H48 V52 H42 V60 H36 Z"
              fill="#06B6D4"
            />
            <rect x="36" y="32" width="6" height="4" fill="#CFFAFE" />
            <rect x="56" y="32" width="8" height="4" fill="#CFFAFE" />

            {/* Stepped Plaque: "KING" */}
            <path d="M16 76 H84 V92 H16 Z" fill="#000" />
            <path d="M18 78 H82 V90 H18 Z" fill="#06B6D4" />
            <path d="M20 80 H80 V88 H20 Z" fill="#164E63" />
            <text x="50" y="86.5" textAnchor="middle" fill="#CFFAFE" fontWeight="900" fontSize="7.5" fontFamily="sans-serif" letterSpacing="1.2">
              KING
            </text>
          </svg>
        );

      case 'PIXEL_Q':
        return (
          <svg viewBox="0 0 100 100" className="w-full h-full drop-shadow-xl overflow-visible">
            {/* 8-Bit Pixel Heart Crystal & Royal Tiara */}
            {/* Outer Drop Shadow */}
            <path
              d="M24 16 H44 V26 H56 V16 H76 V42 H84 V56 H74 V68 H50 V76 H26 V68 H16 V56 H24 Z"
              fill="#05010B"
            />
            {/* Stepped Gold Tiara & Heart Wings */}
            <path
              d="M26 18 H42 V28 H58 V18 H74 V40 H82 V54 H72 V66 H50 V74 H28 V66 H18 V54 H26 Z"
              fill="#FBBF24"
            />
            {/* Inner Magenta Crystal Heart Core */}
            <path
              d="M34 26 H46 V34 H54 V26 H66 V44 H74 V52 H66 V62 H50 V68 H34 V62 H26 V52 H34 Z"
              fill="#EC4899"
            />
            {/* Crystal Facet Highlight */}
            <rect x="36" y="28" width="8" height="8" fill="#FCE7F3" />
            <rect x="56" y="28" width="8" height="8" fill="#FCE7F3" />
            <rect x="30" y="44" width="8" height="8" fill="#BE185D" />
            <rect x="62" y="44" width="8" height="8" fill="#BE185D" />

            {/* Stepped Pixel 'Q' in Center */}
            <path
              d="M42 34 H58 V42 H62 V54 H58 V58 H64 V64 H56 V58 H54 V58 H42 V54 H38 V42 H42 Z M46 42 H54 V50 H46 Z"
              fill="#FFF"
            />

            {/* Stepped Plaque: "QUEEN" */}
            <path d="M16 76 H84 V92 H16 Z" fill="#000" />
            <path d="M18 78 H82 V90 H18 Z" fill="#FBBF24" />
            <path d="M20 80 H80 V88 H20 Z" fill="#78350F" />
            <text x="50" y="86.5" textAnchor="middle" fill="#FEF08A" fontWeight="900" fontSize="7.5" fontFamily="sans-serif" letterSpacing="1.2">
              QUEEN
            </text>
          </svg>
        );

      case 'PIXEL_J':
        return (
          <svg viewBox="0 0 100 100" className="w-full h-full drop-shadow-xl overflow-visible">
            {/* 8-Bit Pixel Knight Broadsword & Iron Shield */}
            {/* Diagonal Broadsword Behind Shield */}
            <rect x="68" y="10" width="8" height="8" fill="#FEF08A" />
            <rect x="60" y="18" width="8" height="8" fill="#CBD5E1" />
            <rect x="52" y="26" width="8" height="8" fill="#94A3B8" />
            <rect x="28" y="50" width="8" height="8" fill="#E2E8F0" />
            <rect x="20" y="58" width="8" height="8" fill="#FFF" />

            {/* Stepped Iron Buckler Shield Body */}
            <path
              d="M26 22 H74 V30 H82 V58 H74 V68 H50 V74 H26 V68 H18 V58 H26 Z"
              fill="#0F172A"
            />
            <path
              d="M28 24 H72 V32 H80 V56 H72 V66 H50 V72 H28 V66 H20 V56 H28 Z"
              fill="#1E293B"
            />
            {/* Shield Rivet Pixels */}
            <rect x="30" y="26" width="4" height="4" fill="#38BDF8" />
            <rect x="66" y="26" width="4" height="4" fill="#38BDF8" />

            {/* Stepped Phosphor Green 'J' on Shield */}
            <path
              d="M44 32 H66 V40 H56 V58 H46 V62 H32 V54 H24 V46 H36 V52 H46 V32 Z"
              fill="#22C55E"
            />
            <rect x="44" y="32" width="22" height="4" fill="#86EFAC" />

            {/* Stepped Plaque: "JACK" */}
            <path d="M16 76 H84 V92 H16 Z" fill="#000" />
            <path d="M18 78 H82 V90 H18 Z" fill="#22C55E" />
            <path d="M20 80 H80 V88 H20 Z" fill="#14532D" />
            <text x="50" y="86.5" textAnchor="middle" fill="#BBF7D0" fontWeight="900" fontSize="7.5" fontFamily="sans-serif" letterSpacing="1.2">
              JACK
            </text>
          </svg>
        );

      case 'PIXEL_10':
        return (
          <svg viewBox="0 0 100 100" className="w-full h-full drop-shadow-xl overflow-visible">
            {/* 8-Bit Pixel High-Voltage Bomb / Power-Up Cell */}
            {/* Pixel Fuse & Spark */}
            <rect x="48" y="6" width="6" height="4" fill="#EF4444" />
            <rect x="44" y="10" width="4" height="4" fill="#F59E0B" />
            <rect x="52" y="10" width="4" height="4" fill="#F59E0B" />
            <rect x="48" y="14" width="6" height="8" fill="#78350F" />

            {/* Bomb / Crate Outer Shadow */}
            <path
              d="M22 22 H78 V30 H86 V64 H78 V72 H22 V64 H14 V30 H22 Z"
              fill="#05010B"
            />
            {/* Ultraviolet Power Crate Body */}
            <path
              d="M24 24 H76 V32 H84 V62 H76 V70 H24 V62 H16 V32 H24 Z"
              fill="#7E22CE"
            />
            {/* Top Bevel Highlight */}
            <rect x="24" y="24" width="52" height="4" fill="#E9D5FF" />
            <rect x="16" y="32" width="4" height="30" fill="#E9D5FF" />
            <rect x="76" y="32" width="8" height="30" fill="#3B0764" />

            {/* Stepped Pixel '10' on Crate Face */}
            {/* Digit '1' */}
            <path d="M28 34 H38 V30 H46 V62 H38 V54 H38 V38 H28 Z" fill="#FFF" />
            {/* Digit '0' */}
            <path d="M52 30 H72 V38 H76 V56 H72 V62 H52 V56 H48 V38 H52 Z M56 38 H64 V54 H56 Z" fill="#FFF" />

            {/* Stepped Plaque: "10 PTS" */}
            <path d="M16 76 H84 V92 H16 Z" fill="#000" />
            <path d="M18 78 H82 V90 H18 Z" fill="#A855F7" />
            <path d="M20 80 H80 V88 H20 Z" fill="#3B0764" />
            <text x="50" y="86.5" textAnchor="middle" fill="#F3E8FF" fontWeight="900" fontSize="7.5" fontFamily="sans-serif" letterSpacing="1.2">
              10 PTS
            </text>
          </svg>
        );

      // =====================================================================
      // --- PLAYSTATION 2 EMOTION ENGINE LEGENDS SYMBOLS ---
      // =====================================================================

      case 'PS2_LOGO':
        return (
          <svg viewBox="0 0 100 100" className="w-full h-full drop-shadow-[0_4px_12px_rgba(0,111,205,0.8)] overflow-visible">
            <defs>
              <linearGradient id="ps2BlueGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#00F0FF" />
                <stop offset="30%" stopColor="#006FCD" />
                <stop offset="70%" stopColor="#003791" />
                <stop offset="100%" stopColor="#4F46E5" />
              </linearGradient>
              <linearGradient id="ps2BadgeChassis" x1="0%" y1="0%" x2="0%" y2="100%">
                <stop offset="0%" stopColor="#1E293B" />
                <stop offset="50%" stopColor="#0F172A" />
                <stop offset="100%" stopColor="#020617" />
              </linearGradient>
            </defs>

            {/* Monolithic Ribbed PS2 Standee Plaque */}
            <rect x="6" y="8" width="88" height="84" rx="4" fill="url(#ps2BadgeChassis)" stroke="#006FCD" strokeWidth="2.5" />
            <rect x="10" y="12" width="80" height="8" rx="1" fill="#020617" />
            <rect x="10" y="80" width="80" height="8" rx="1" fill="#020617" />

            {/* Glowing Cooling Rib Lines */}
            <line x1="12" y1="23" x2="88" y2="23" stroke="#006FCD" strokeWidth="0.8" opacity="0.6" />
            <line x1="12" y1="77" x2="88" y2="77" stroke="#006FCD" strokeWidth="0.8" opacity="0.6" />

            {/* Rotating PlayStation Quad-Color Family Badge in Corner */}
            <rect x="12" y="14" width="9" height="9" rx="1" fill="#000" stroke="#38BDF8" strokeWidth="0.8" />
            <path d="M14 16 L17 19 L19 14" stroke="#FF1744" strokeWidth="1" fill="none" />
            <path d="M14 20 L19 20" stroke="#00E676" strokeWidth="1" />

            {/* Standby & Eject LEDs */}
            <circle cx="82" cy="18" r="2" fill="#00F0FF" className="animate-pulse" />
            <circle cx="76" cy="18" r="1.5" fill="#10B981" />

            {/* Iconic 128-Bit Stylized 'PS2' Monolithic Wordmark */}
            <text x="50" y="56" textAnchor="middle" fill="url(#ps2BlueGrad)" fontWeight="900" fontSize="30" fontFamily="'Impact', 'Arial Black', sans-serif" letterSpacing="2.5" stroke="#E0F2FE" strokeWidth="0.8">
              PS2
            </text>

            {/* Badge: EMOTION ENGINE • 128-BIT */}
            <rect x="10" y="64" width="80" height="12" rx="2" fill="#003791" stroke="#38BDF8" strokeWidth="1" />
            <text x="50" y="72.5" textAnchor="middle" fill="#FFFFFF" fontWeight="900" fontSize="6" fontFamily="sans-serif" letterSpacing="0.8">
              ★ EMOTION WILD ★
            </text>
          </svg>
        );

      case 'DVD_DISC':
        return (
          <svg viewBox="0 0 100 100" className="w-full h-full drop-shadow-[0_4px_12px_rgba(56,189,248,0.8)] overflow-visible">
            <defs>
              <radialGradient id="ps2DiscSheen" cx="50%" cy="50%" r="50%">
                <stop offset="0%" stopColor="#0F172A" />
                <stop offset="18%" stopColor="#1E293B" />
                <stop offset="22%" stopColor="#E2E8F0" />
                <stop offset="35%" stopColor="#38BDF8" />
                <stop offset="55%" stopColor="#818CF8" />
                <stop offset="75%" stopColor="#006FCD" />
                <stop offset="90%" stopColor="#C084FC" />
                <stop offset="100%" stopColor="#0284C7" />
              </radialGradient>
              <linearGradient id="discHoloPrism" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="rgba(255,255,255,0.8)" />
                <stop offset="30%" stopColor="rgba(56,189,248,0.7)" />
                <stop offset="60%" stopColor="rgba(236,72,153,0.7)" />
                <stop offset="100%" stopColor="rgba(52,211,153,0.8)" />
              </linearGradient>
            </defs>

            {/* Disc Outer Rim */}
            <circle cx="50" cy="50" r="44" fill="url(#ps2DiscSheen)" stroke="#BAE6FD" strokeWidth="2" />

            {/* Prismatic Rainbow Laser Reflection Cones */}
            <path d="M50 50 L18 18 A44 44 0 0 1 82 18 Z" fill="url(#discHoloPrism)" opacity="0.45" />
            <path d="M50 50 L82 82 A44 44 0 0 1 18 82 Z" fill="url(#discHoloPrism)" opacity="0.45" />

            {/* Clear Center Spindle Ring */}
            <circle cx="50" cy="50" r="18" fill="#020617" stroke="#E2E8F0" strokeWidth="1.5" />
            <circle cx="50" cy="50" r="14" fill="#0F172A" stroke="#94A3B8" strokeWidth="1" />
            <circle cx="50" cy="50" r="7" fill="#000" stroke="#38BDF8" strokeWidth="1" />

            {/* PlayStation Authentic Outer Hologram Ring */}
            <circle cx="50" cy="50" r="40" fill="none" stroke="#60A5FA" strokeWidth="0.8" strokeDasharray="3,2" opacity="0.8" />

            {/* Banner: FREE SPINS SCATTER */}
            <rect x="8" y="74" width="84" height="15" rx="3" fill="#000" stroke="#38BDF8" strokeWidth="1.5" />
            <rect x="10" y="76" width="80" height="11" rx="2" fill="#003791" />
            <text x="50" y="84" textAnchor="middle" fill="#E0F2FE" fontWeight="900" fontSize="6.5" fontFamily="sans-serif" letterSpacing="0.8">
              💿 DVD SCATTER 💿
            </text>
          </svg>
        );

      case 'MEMORY_CARD':
        return (
          <svg viewBox="0 0 100 100" className="w-full h-full drop-shadow-[0_4px_12px_rgba(168,85,247,0.7)] overflow-visible">
            <defs>
              <linearGradient id="memCardBody" x1="0%" y1="0%" x2="0%" y2="100%">
                <stop offset="0%" stopColor="#1E1B4B" />
                <stop offset="40%" stopColor="#0F172A" />
                <stop offset="100%" stopColor="#020617" />
              </linearGradient>
            </defs>

            {/* 8MB Memory Card Silhouette with Notched Corner */}
            <path
              d="M18 10 H76 L84 18 V88 H18 Z"
              fill="url(#memCardBody)"
              stroke="#A855F7"
              strokeWidth="2.5"
            />

            {/* Top Grip Recess */}
            <rect x="26" y="16" width="48" height="6" rx="2" fill="#020617" stroke="#38BDF8" strokeWidth="0.8" />
            <line x1="32" y1="19" x2="68" y2="19" stroke="#64748B" strokeWidth="1" strokeDasharray="2,2" />

            {/* Red Access LED */}
            <circle cx="74" cy="28" r="2.5" fill="#EF4444" className="animate-pulse" />
            <circle cx="74" cy="28" r="4" fill="none" stroke="#EF4444" strokeWidth="0.8" opacity="0.6" />

            {/* Printed "Memory Card" Label Plaque */}
            <rect x="22" y="26" width="46" height="16" rx="2" fill="#000" stroke="#64748B" strokeWidth="1" />
            <text x="25" y="34" fill="#C084FC" fontWeight="900" fontSize="6.5" fontFamily="sans-serif">
              MagicGate
            </text>
            <text x="25" y="40" fill="#94A3B8" fontWeight="bold" fontSize="5" fontFamily="monospace">
              MEMORY CARD
            </text>

            {/* Big 8MB Foil Stamp */}
            <rect x="22" y="46" width="56" height="26" rx="2" fill="#1E1B4B" stroke="#C084FC" strokeWidth="1.2" />
            <text x="50" y="65" textAnchor="middle" fill="#F3E8FF" fontWeight="900" fontSize="18" fontFamily="monospace" letterSpacing="1">
              8MB
            </text>

            {/* Bottom Connector Pin Notches */}
            <rect x="26" y="80" width="48" height="6" fill="#020617" />
            {[...Array(6)].map((_, i) => (
              <rect key={i} x={30 + i * 7} y="81" width="4" height="4" fill="#EAB308" />
            ))}
          </svg>
        );

      case 'EMOTION_ENGINE':
        return (
          <svg viewBox="0 0 100 100" className="w-full h-full drop-shadow-[0_4px_12px_rgba(96,165,250,0.8)] overflow-visible">
            <defs>
              <linearGradient id="eeChipBody" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#1E293B" />
                <stop offset="50%" stopColor="#0B132B" />
                <stop offset="100%" stopColor="#020617" />
              </linearGradient>
              <linearGradient id="eeGoldPins" x1="0%" y1="0%" x2="0%" y2="100%">
                <stop offset="0%" stopColor="#FDE047" />
                <stop offset="100%" stopColor="#D97706" />
              </linearGradient>
            </defs>

            {/* Silicon Ceramic Chip Package */}
            <rect x="14" y="14" width="72" height="72" rx="4" fill="url(#eeChipBody)" stroke="#38BDF8" strokeWidth="2" />

            {/* Gold Wire Leads / Pins on Perimeter */}
            {[...Array(8)].map((_, i) => (
              <React.Fragment key={i}>
                <rect x={18 + i * 8} y="8" width="4" height="6" fill="url(#eeGoldPins)" />
                <rect x={18 + i * 8} y="86" width="4" height="6" fill="url(#eeGoldPins)" />
                <rect x="8" y={18 + i * 8} width="6" height="4" fill="url(#eeGoldPins)" />
                <rect x="86" y={18 + i * 8} width="6" height="4" fill="url(#eeGoldPins)" />
              </React.Fragment>
            ))}

            {/* Central Heatspreader Mirror Die */}
            <rect x="24" y="24" width="52" height="52" rx="2" fill="#020617" stroke="#60A5FA" strokeWidth="1.5" />

            {/* Circuit Traces */}
            <path d="M28 28 H38 V40 H48" stroke="#38BDF8" strokeWidth="1" fill="none" opacity="0.6" />
            <path d="M72 72 H62 V60 H52" stroke="#38BDF8" strokeWidth="1" fill="none" opacity="0.6" />

            {/* Laser Engraved CPU Branding */}
            <text x="50" y="42" textAnchor="middle" fill="#94A3B8" fontWeight="bold" fontSize="7" fontFamily="sans-serif" letterSpacing="1.5">
              SONY ®
            </text>
            <text x="50" y="52" textAnchor="middle" fill="#38BDF8" fontWeight="900" fontSize="9" fontFamily="sans-serif" letterSpacing="0.8">
              Emotion
            </text>
            <text x="50" y="61" textAnchor="middle" fill="#60A5FA" fontWeight="900" fontSize="9" fontFamily="sans-serif" letterSpacing="0.8">
              Engine
            </text>
            <text x="50" y="70" textAnchor="middle" fill="#E2E8F0" fontWeight="bold" fontSize="6" fontFamily="monospace">
              294.912 MHz
            </text>
          </svg>
        );

      case 'DUALSHOCK':
        return (
          <svg viewBox="0 0 100 100" className="w-full h-full drop-shadow-[0_4px_12px_rgba(56,189,248,0.7)] overflow-visible">
            {/* DualShock 2 Monolithic Grip Chassis */}
            <path
              d="M15 72 C12 55 16 34 26 28 C34 24 42 28 50 32 C58 28 66 24 74 28 C84 34 88 55 85 72 C83 80 75 82 70 76 L62 58 C58 56 54 56 50 56 C46 56 42 56 38 58 L30 76 C25 82 17 80 15 72 Z"
              fill="#0F172A"
              stroke="#006FCD"
              strokeWidth="2.5"
            />

            {/* D-Pad on Left */}
            <path d="M26 36 H32 V42 H38 V48 H32 V54 H26 V48 H20 V42 H26 Z" fill="#020617" stroke="#64748B" strokeWidth="1" />

            {/* Twin Analog Sticks with Concave Thumb Cups */}
            <circle cx="38" cy="62" r="9" fill="#020617" stroke="#38BDF8" strokeWidth="1.5" />
            <circle cx="38" cy="62" r="5" fill="#1E293B" stroke="#64748B" strokeWidth="0.8" />
            <circle cx="62" cy="62" r="9" fill="#020617" stroke="#38BDF8" strokeWidth="1.5" />
            <circle cx="62" cy="62" r="5" fill="#1E293B" stroke="#64748B" strokeWidth="0.8" />

            {/* Red Analog Mode LED */}
            <circle cx="50" cy="50" r="1.5" fill="#EF4444" className="animate-pulse" />

            {/* The 4 Iconic Symbol Buttons on Right Face */}
            <circle cx="74" cy="36" r="2.8" fill="#020617" stroke="#00E676" strokeWidth="1" />
            <circle cx="81" cy="43" r="2.8" fill="#020617" stroke="#FF1744" strokeWidth="1" />
            <circle cx="74" cy="50" r="2.8" fill="#020617" stroke="#2979FF" strokeWidth="1" />
            <circle cx="67" cy="43" r="2.8" fill="#020617" stroke="#F50057" strokeWidth="1" />

            {/* SONY Branding Header */}
            <text x="50" y="38" textAnchor="middle" fill="#94A3B8" fontWeight="bold" fontSize="5" fontFamily="sans-serif" letterSpacing="1">
              SONY
            </text>
          </svg>
        );

      case 'PS_TRIANGLE':
        return (
          <svg viewBox="0 0 100 100" className="w-full h-full drop-shadow-[0_4px_12px_rgba(0,230,118,0.8)] overflow-visible">
            {/* DualShock Beveled Button Well */}
            <circle cx="50" cy="50" r="42" fill="#0F172A" stroke="#1E293B" strokeWidth="3" />
            <circle cx="50" cy="50" r="36" fill="#020617" stroke="#00E676" strokeWidth="2" />

            {/* Radiant Glowing Triangle */}
            <polygon
              points="50,22 76,68 24,68"
              fill="none"
              stroke="#00E676"
              strokeWidth="7"
              strokeLinejoin="round"
              className="drop-shadow-[0_0_10px_#00E676]"
            />
            <polygon
              points="50,22 76,68 24,68"
              fill="none"
              stroke="#FFFFFF"
              strokeWidth="2"
              strokeLinejoin="round"
            />
          </svg>
        );

      case 'PS_CIRCLE':
        return (
          <svg viewBox="0 0 100 100" className="w-full h-full drop-shadow-[0_4px_12px_rgba(255,23,68,0.8)] overflow-visible">
            {/* DualShock Beveled Button Well */}
            <circle cx="50" cy="50" r="42" fill="#0F172A" stroke="#1E293B" strokeWidth="3" />
            <circle cx="50" cy="50" r="36" fill="#020617" stroke="#FF1744" strokeWidth="2" />

            {/* Radiant Glowing Circle */}
            <circle
              cx="50"
              cy="50"
              r="24"
              fill="none"
              stroke="#FF1744"
              strokeWidth="7"
              className="drop-shadow-[0_0_10px_#FF1744]"
            />
            <circle cx="50" cy="50" r="24" fill="none" stroke="#FFFFFF" strokeWidth="2" />
          </svg>
        );

      case 'PS_CROSS':
        return (
          <svg viewBox="0 0 100 100" className="w-full h-full drop-shadow-[0_4px_12px_rgba(41,121,255,0.8)] overflow-visible">
            {/* DualShock Beveled Button Well */}
            <circle cx="50" cy="50" r="42" fill="#0F172A" stroke="#1E293B" strokeWidth="3" />
            <circle cx="50" cy="50" r="36" fill="#020617" stroke="#2979FF" strokeWidth="2" />

            {/* Radiant Glowing Cross */}
            <path
              d="M32 32 L68 68 M68 32 L32 68"
              stroke="#2979FF"
              strokeWidth="8"
              strokeLinecap="round"
              className="drop-shadow-[0_0_10px_#2979FF]"
            />
            <path
              d="M32 32 L68 68 M68 32 L32 68"
              stroke="#FFFFFF"
              strokeWidth="2.5"
              strokeLinecap="round"
            />
          </svg>
        );

      case 'PS_SQUARE':
        return (
          <svg viewBox="0 0 100 100" className="w-full h-full drop-shadow-[0_4px_12px_rgba(245,0,87,0.8)] overflow-visible">
            {/* DualShock Beveled Button Well */}
            <circle cx="50" cy="50" r="42" fill="#0F172A" stroke="#1E293B" strokeWidth="3" />
            <circle cx="50" cy="50" r="36" fill="#020617" stroke="#F50057" strokeWidth="2" />

            {/* Radiant Glowing Square */}
            <rect
              x="29"
              y="29"
              width="42"
              height="42"
              rx="4"
              fill="none"
              stroke="#F50057"
              strokeWidth="7"
              className="drop-shadow-[0_0_10px_#F50057]"
            />
            <rect x="29" y="29" width="42" height="42" rx="4" fill="none" stroke="#FFFFFF" strokeWidth="2" />
          </svg>
        );

      case 'BOOT_TOWER':
        return (
          <svg viewBox="0 0 100 100" className="w-full h-full drop-shadow-[0_4px_12px_rgba(129,140,248,0.8)] overflow-visible">
            <defs>
              <linearGradient id="towerGlassGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#C7D2FE" />
                <stop offset="35%" stopColor="#818CF8" />
                <stop offset="70%" stopColor="#4338CA" />
                <stop offset="100%" stopColor="#1E1B4B" />
              </linearGradient>
            </defs>

            {/* Bios Ocean Dark Void Background with Horizon Grid Line */}
            <rect x="8" y="10" width="84" height="80" rx="4" fill="#020617" stroke="#4338CA" strokeWidth="2" />
            <line x1="8" y1="65" x2="92" y2="65" stroke="#6366F1" strokeWidth="1" strokeDasharray="3,3" opacity="0.6" />

            {/* 3D Translucent Floating Boot Monoliths */}
            {/* Monolith 1 (Back left) */}
            <polygon points="22,35 32,28 32,70 22,76" fill="#312E81" opacity="0.7" />
            <polygon points="32,28 42,34 42,74 32,70" fill="#4338CA" opacity="0.8" />
            <polygon points="22,35 32,28 42,34 32,40" fill="#818CF8" opacity="0.9" />

            {/* Monolith 2 (Main front right) */}
            <polygon points="46,24 64,14 64,68 46,78" fill="#4338CA" />
            <polygon points="64,14 78,22 78,74 64,68" fill="url(#towerGlassGrad)" />
            <polygon points="46,24 64,14 78,22 60,32" fill="#E0E7FF" opacity="0.9" />

            {/* Atmospheric Starlight Specks */}
            <circle cx="28" cy="20" r="1.5" fill="#FFF" className="animate-ping" />
            <circle cx="80" cy="40" r="1" fill="#818CF8" />
            <circle cx="70" cy="80" r="1.2" fill="#00F0FF" />
          </svg>
        );

      case 'ANALOG_STICK':
        return (
          <svg viewBox="0 0 100 100" className="w-full h-full drop-shadow-[0_4px_12px_rgba(148,163,184,0.7)] overflow-visible">
            {/* Beveled Stick Well */}
            <circle cx="50" cy="50" r="42" fill="#0B132B" stroke="#1E293B" strokeWidth="3" />
            <circle cx="50" cy="50" r="36" fill="#020617" stroke="#475569" strokeWidth="1.5" />

            {/* Knurled Outer Rubber Thumb Cap */}
            <circle cx="50" cy="50" r="30" fill="#1E293B" stroke="#64748B" strokeWidth="2" />

            {/* Tactile 4-Direction Knurls */}
            <rect x="48" y="22" width="4" height="6" rx="1" fill="#94A3B8" />
            <rect x="48" y="72" width="4" height="6" rx="1" fill="#94A3B8" />
            <rect x="22" y="48" width="6" height="4" rx="1" fill="#94A3B8" />
            <rect x="72" y="48" width="6" height="4" rx="1" fill="#94A3B8" />

            {/* Concave Center Cup */}
            <circle cx="50" cy="50" r="18" fill="#0F172A" stroke="#334155" strokeWidth="1.5" />
            <circle cx="50" cy="50" r="10" fill="#020617" />
          </svg>
        );

      default:
        return null;
    }
  };

  const isTimberSymbol = [
    'BEAR', 'OWL', 'ACORN', 'WOLF', 'FOX', 'RACCOON', 'SQUIRREL',
    'PINECONE', 'BERRIES', 'MUSHROOM', 'WOOD_A', 'WOOD_K', 'WOOD_Q', 'WOOD_J'
  ].includes(id);

  const isPixelSymbol = [
    'CYBER_WILD', 'PIXEL_CARTRIDGE', 'RETRO_TOKEN', 'BOSS_DRAGON', 'HERO_KNIGHT',
    'GAMEPAD', 'JOYSTICK', 'POTION_HEAL', 'PIXEL_A', 'PIXEL_K', 'PIXEL_Q', 'PIXEL_J', 'PIXEL_10'
  ].includes(id);

  const isPs2Symbol = [
    'PS2_LOGO', 'DVD_DISC', 'MEMORY_CARD', 'EMOTION_ENGINE', 'DUALSHOCK',
    'PS_TRIANGLE', 'PS_CIRCLE', 'PS_CROSS', 'PS_SQUARE', 'BOOT_TOWER', 'ANALOG_STICK'
  ].includes(id);

  const getWinningAnimationClass = () => {
    if (!isWinning && !isScatterHighlight) return '';
    switch (id) {
      case 'CYBER_WILD':
      case 'PIXEL_CARTRIDGE':
      case 'RETRO_TOKEN':
      case 'BOSS_DRAGON':
        return 'animate-win-symbol-juice scale-105';
      case 'BEAR':
        return 'animate-bear-roar';
      case 'OWL':
        return 'animate-owl-blink-tilt';
      case 'WOLF':
        return 'animate-wolf-howl';
      case 'FOX':
        return 'animate-fox-wink';
      case 'RACCOON':
        return 'animate-raccoon-bandit';
      case 'SQUIRREL':
        return 'animate-squirrel-nibble';
      case 'MUSHROOM':
        return 'animate-mushroom-bounce';
      case 'ACORN':
        return 'animate-acorn-wobble';
      case 'PINECONE':
        return 'animate-pinecone-shake';
      case 'BERRIES':
        return 'animate-berries-juice';
      case 'WOOD_A':
      case 'WOOD_K':
      case 'WOOD_Q':
      case 'WOOD_J':
        return 'animate-wood-royal';
      default:
        return 'animate-win-symbol-juice';
    }
  };

  const staggerDelay =
    reelIndex !== undefined && rowIndex !== undefined
      ? `${((reelIndex * 0.45 + rowIndex * 0.2) % 3.6).toFixed(2)}s`
      : undefined;

  return (
    <div
      className={`relative w-full h-full flex items-center justify-center transition-all ${getWinningAnimationClass()} ${className}`}
    >
      {/* Radiant aura burst behind winning symbols */}
      {isWinning && (
        <div
          className={`absolute inset-0 rounded-xl pointer-events-none z-0 animate-pulse filter blur-sm ${
            isTimberSymbol
              ? 'bg-gradient-to-r from-emerald-400/40 via-amber-400/40 to-emerald-400/40 shadow-[0_0_25px_rgba(52,211,153,0.9)]'
              : isPixelSymbol
              ? 'bg-gradient-to-r from-purple-500/40 via-pink-500/40 to-cyan-400/40 shadow-[0_0_25px_rgba(236,72,153,0.9)]'
              : isPs2Symbol
              ? 'bg-gradient-to-r from-blue-600/45 via-cyan-400/45 to-indigo-600/45 shadow-[0_0_30px_rgba(0,111,205,0.95)]'
              : 'bg-gold-400/40 shadow-[0_0_25px_rgba(251,191,36,0.9)]'
          }`}
        />
      )}
      {/* Cyan/Emerald aura behind scatter */}
      {isScatterHighlight && (
        <div
          className={`absolute inset-0 rounded-xl pointer-events-none z-0 animate-pulse filter blur-sm ${
            id === 'OWL'
              ? 'bg-emerald-400/45 shadow-[0_0_25px_rgba(52,211,153,0.9)]'
              : id === 'PIXEL_CARTRIDGE'
              ? 'bg-purple-400/45 shadow-[0_0_25px_rgba(168,85,247,0.9)]'
              : id === 'DVD_DISC' || id === 'MEMORY_CARD'
              ? 'bg-cyan-400/50 shadow-[0_0_30px_rgba(56,189,248,0.9)]'
              : 'bg-cyan-400/40 shadow-[0_0_25px_rgba(0,240,255,0.8)]'
          }`}
        />
      )}
      <div className="relative z-10 w-full h-full flex items-center justify-center p-1 drop-shadow-[0_4px_8px_rgba(0,0,0,0.65)] filter">
        {getSymbolSvg()}
      </div>

      {/* Dynamic Specular Shimmer Beam, Prismatic Flare & Lens Reflection */}
      <div className="absolute inset-0.5 pointer-events-none overflow-hidden rounded-xl z-20">
        {/* Layer 1: Sharp specular gleam beam */}
        <div
          className={`absolute -inset-full w-[350%] h-[160%] ${
            isTimberSymbol
              ? 'bg-gradient-to-r from-transparent via-amber-200/50 via-emerald-100/60 to-transparent'
              : isPixelSymbol
              ? 'bg-gradient-to-r from-transparent via-cyan-200/55 via-pink-200/60 to-transparent'
              : isPs2Symbol
              ? 'bg-gradient-to-r from-transparent via-cyan-300/60 via-blue-200/70 to-transparent'
              : 'bg-gradient-to-r from-transparent via-white/65 via-yellow-100/80 to-transparent'
          } animate-symbol-gleam mix-blend-screen pointer-events-none`}
          style={staggerDelay ? { animationDelay: staggerDelay } : undefined}
        />

        {/* Layer 2: Prismatic chromatic rainbow refraction sweep */}
        <div
          className="absolute -inset-full w-[300%] h-[150%] bg-gradient-to-r from-transparent via-cyan-400/25 via-pink-400/25 via-amber-300/30 to-transparent animate-chromatic-sweep mix-blend-color-dodge pointer-events-none"
          style={staggerDelay ? { animationDelay: `${((parseFloat(staggerDelay) + 0.6) % 3.4).toFixed(2)}s` } : undefined}
        />

        {/* Curved Glass Highlight Dome Rim */}
        <div className="absolute inset-0 rounded-xl bg-gradient-to-b from-white/30 via-transparent to-black/35 mix-blend-overlay pointer-events-none" />
      </div>

      {/* Micro-Sparkle Highlight Flares on Symbol Peaks */}
      <div
        className="absolute top-1 left-1.5 pointer-events-none z-20 animate-micro-sparkle-1"
        style={staggerDelay ? { animationDelay: `${((parseFloat(staggerDelay) + 0.2) % 2.6).toFixed(2)}s` } : undefined}
      >
        <svg viewBox="0 0 16 16" className="w-3.5 h-3.5 fill-white drop-shadow-[0_0_6px_rgba(255,255,255,1)]">
          <path d="M8 0 L9.5 6.5 L16 8 L9.5 9.5 L8 16 L6.5 9.5 L0 8 L6.5 6.5 Z" />
        </svg>
      </div>
      <div
        className="absolute bottom-1.5 right-1.5 pointer-events-none z-20 animate-micro-sparkle-2"
        style={staggerDelay ? { animationDelay: `${((parseFloat(staggerDelay) + 1.3) % 2.6).toFixed(2)}s` } : undefined}
      >
        <svg
          viewBox="0 0 16 16"
          className={`w-3 h-3 ${
            isTimberSymbol
              ? 'fill-amber-300 drop-shadow-[0_0_6px_#F59E0B]'
              : isPixelSymbol
              ? 'fill-cyan-300 drop-shadow-[0_0_6px_#06B6D4]'
              : isPs2Symbol
              ? 'fill-blue-400 drop-shadow-[0_0_8px_#38BDF8]'
              : 'fill-yellow-200 drop-shadow-[0_0_6px_#FDE047]'
          }`}
        >
          <path d="M8 0 L9.5 6.5 L16 8 L9.5 9.5 L8 16 L6.5 9.5 L0 8 L6.5 6.5 Z" />
        </svg>
      </div>
    </div>
  );
};
