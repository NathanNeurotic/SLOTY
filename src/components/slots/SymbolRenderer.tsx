import React from 'react';
import type { SymbolId } from '../../engine/types';

interface SymbolRendererProps {
  id: SymbolId;
  isWinning?: boolean;
  isScatterHighlight?: boolean;
  className?: string;
}

export const SymbolRenderer: React.FC<SymbolRendererProps> = ({
  id,
  isWinning = false,
  isScatterHighlight = false,
  className = '',
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
                y="89.5"
                textAnchor="middle"
                fill="#FBBF24"
                fontWeight="900"
                fontSize="13"
                fontFamily="sans-serif"
                letterSpacing="2.5"
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
                y="88.5"
                textAnchor="middle"
                fill="#00F0FF"
                fontWeight="900"
                fontSize="12.5"
                fontFamily="sans-serif"
                letterSpacing="2.5"
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
                y="82.5"
                textAnchor="middle"
                fill="#FEF08A"
                stroke="#451A03"
                strokeWidth="0.8"
                fontWeight="900"
                fontSize="12"
                fontFamily="sans-serif"
                letterSpacing="2.5"
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
            <polygon points="10,64 54,64 44,86 2,86" fill="url(#bullionGoldA)" stroke="#FEF08A" strokeWidth="1.4" />
            <polygon points="54,64 64,69 54,91 44,86" fill="#92400E" stroke="#FEF08A" strokeWidth="1" />

            {/* Bottom Right Bullion Bar */}
            <polygon points="46,64 90,64 80,86 36,86" fill="url(#bullionGoldA)" stroke="#FEF08A" strokeWidth="1.4" />
            <polygon points="90,64 98,69 88,91 80,86" fill="#92400E" stroke="#FEF08A" strokeWidth="1" />

            {/* Center Pyramid Top Bullion Bar */}
            <polygon points="26,30 74,30 62,56 14,56" fill="url(#bullionGoldB)" stroke="#FFF" strokeWidth="2" />
            <polygon points="74,30 86,37 74,63 62,56" fill="#78350F" stroke="#FEF08A" strokeWidth="1.2" />

            {/* Top Bar Stamped 24K Bullion Hallmark */}
            <ellipse cx="44" cy="43" rx="16" ry="7" fill="#78350F" opacity="0.35" />
            <ellipse cx="44" cy="43" rx="14" ry="5.5" fill="none" stroke="#FEF08A" strokeWidth="0.8" />
            <text x="44" y="46" textAnchor="middle" fill="#FFFBEB" stroke="#451A03" strokeWidth="0.6" fontWeight="900" fontSize="8" fontFamily="sans-serif" letterSpacing="1" style={{ paintOrder: 'stroke fill' }}>
              24K GOLD
            </text>

            {/* Specular Starbursts */}
            <polygon points="26,30 28,34 33,35 28,36 26,41 24,36 19,35 24,34" fill="#FFFFFF" />
            <polygon points="74,30 76,34 81,35 76,36 74,41 72,36 67,35 72,34" fill="#FFFFFF" />
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

            {/* Federal Reserve Security Band */}
            <polygon points="44,26 62,26 52,50 34,50" fill="url(#fedBandBlue)" stroke="#FEF08A" strokeWidth="1.4" />
            <text x="48" y="40.5" textAnchor="middle" fill="#FEF08A" stroke="#0F172A" strokeWidth="0.8" fontWeight="900" fontSize="7.5" fontFamily="sans-serif" letterSpacing="0.8" style={{ paintOrder: 'stroke fill' }}>
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

            {/* Top Bar Engraved Seal */}
            <ellipse cx="45" cy="31" rx="14" ry="5" fill="#78350F" opacity="0.3" />
            <text x="45" y="33.5" textAnchor="middle" fill="#FFFBEB" stroke="#78350F" strokeWidth="0.5" fontWeight="900" fontSize="6.5" fontFamily="sans-serif" letterSpacing="1" style={{ paintOrder: 'stroke fill' }}>
              24K FINE
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
          <svg viewBox="0 0 100 100" className="w-full h-full drop-shadow-lg overflow-visible">
            <defs>
              <linearGradient id="aceGold" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#FFFDEB" />
                <stop offset="35%" stopColor="#FBBF24" />
                <stop offset="75%" stopColor="#D97706" />
                <stop offset="100%" stopColor="#78350F" />
              </linearGradient>
            </defs>
            <path
              d="M50 12 L78 84 L60 84 L53 66 L47 66 L40 84 L22 84 Z M48 52 L50 42 L52 52 Z"
              fill="url(#aceGold)"
              stroke="#FFF"
              strokeWidth="2.5"
              strokeLinejoin="round"
            />
            {/* Diamond Cut-out at Top */}
            <polygon points="50,22 55,30 50,38 45,30" fill="#38BDF8" stroke="#FFF" strokeWidth="1" />
          </svg>
        );

      case 'KING':
        return (
          <svg viewBox="0 0 100 100" className="w-full h-full drop-shadow-lg overflow-visible">
            <defs>
              <linearGradient id="kingGold" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#FFF9D2" />
                <stop offset="30%" stopColor="#F59E0B" />
                <stop offset="70%" stopColor="#B45309" />
                <stop offset="100%" stopColor="#451A03" />
              </linearGradient>
            </defs>
            {/* King Crown at Top */}
            <polygon points="28,26 36,18 44,24 50,14 56,24 64,18 72,26" fill="#FDE047" stroke="#78350F" strokeWidth="1.2" />
            <path
              d="M26 26 L42 26 L42 50 L62 26 L80 26 L56 54 L82 86 L64 86 L44 60 L42 62 L42 86 L26 86 Z"
              fill="url(#kingGold)"
              stroke="#FFF"
              strokeWidth="2.5"
              strokeLinejoin="round"
            />
            <circle cx="50" cy="14" r="2.8" fill="#EF4444" />
          </svg>
        );

      case 'QUEEN':
        return (
          <svg viewBox="0 0 100 100" className="w-full h-full drop-shadow-lg overflow-visible">
            <defs>
              <linearGradient id="queenGold" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#FFFBEB" />
                <stop offset="30%" stopColor="#FBBF24" />
                <stop offset="75%" stopColor="#C084FC" />
                <stop offset="100%" stopColor="#581C87" />
              </linearGradient>
            </defs>
            {/* Queen Tiara */}
            <polygon points="34,22 42,16 50,12 58,16 66,22" fill="#E9D5FF" stroke="#A855F7" strokeWidth="1" />
            <path
              d="M50 18 C32 18, 20 32, 20 52 C20 72, 32 86, 50 86 C58 86, 66 82, 72 76 L78 84 L84 78 L78 70 C80 64, 80 58, 80 52 C80 32, 68 18, 50 18 Z M50 34 C60 34, 66 42, 66 52 C66 62, 60 70, 50 70 C40 70, 34 62, 34 52 C34 42, 40 34, 50 34 Z"
              fill="url(#queenGold)"
              stroke="#FFF"
              strokeWidth="2.5"
            />
            <circle cx="50" cy="12" r="2.8" fill="#A855F7" />
          </svg>
        );

      case 'JACK':
        return (
          <svg viewBox="0 0 100 100" className="w-full h-full drop-shadow-lg overflow-visible">
            <defs>
              <linearGradient id="jackGold" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#E0F2FE" />
                <stop offset="30%" stopColor="#38BDF8" />
                <stop offset="70%" stopColor="#0284C7" />
                <stop offset="100%" stopColor="#0F172A" />
              </linearGradient>
            </defs>
            <path
              d="M38 18 L76 18 L76 32 L60 32 L60 66 C60 76, 54 86, 40 86 C26 86, 20 76, 20 66 L36 66 C36 72, 38 74, 40 74 C42 74, 44 72, 44 66 L44 32 L38 32 Z"
              fill="url(#jackGold)"
              stroke="#FDE047"
              strokeWidth="2.5"
              strokeLinejoin="round"
            />
            <polygon points="52,18 56,12 60,18" fill="#FBBF24" />
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
              y="82"
              textAnchor="middle"
              fill="#FEF08A"
              stroke="#451A03"
              strokeWidth="0.8"
              fontSize="12.5"
              fontWeight="900"
              fontFamily="sans-serif"
              letterSpacing="2.5"
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
              y="87"
              textAnchor="middle"
              fill="#93C5FD"
              stroke="#0F172A"
              strokeWidth="0.8"
              fontSize="11"
              fontWeight="900"
              fontFamily="sans-serif"
              letterSpacing="2"
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
                y="63.5"
                textAnchor="middle"
                fill="#FFFBEB"
                stroke="#000"
                strokeWidth="2.5"
                fontSize="17"
                fontWeight="900"
                fontFamily="system-ui, -apple-system, sans-serif"
                letterSpacing="4"
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
          <svg viewBox="0 0 100 100" className="w-full h-full drop-shadow-lg overflow-visible">
            <defs>
              <linearGradient id="woodAGrad" x1="0%" y1="0%" x2="0%" y2="100%">
                <stop offset="0%" stopColor="#10B981" />
                <stop offset="50%" stopColor="#059669" />
                <stop offset="100%" stopColor="#047857" />
              </linearGradient>
            </defs>
            <path d="M50 14 L20 84 L38 84 L44 68 L56 68 L62 84 L80 84 Z M50 36 L54 54 L46 54 Z" fill="url(#woodAGrad)" stroke="#A7F3D0" strokeWidth="2.5" strokeLinejoin="round" />
            {/* Ivy vine leaf */}
            <circle cx="28" cy="72" r="3.5" fill="#4ADE80" />
            <circle cx="72" cy="72" r="3.5" fill="#4ADE80" />
          </svg>
        );

      case 'WOOD_K':
        return (
          <svg viewBox="0 0 100 100" className="w-full h-full drop-shadow-lg overflow-visible">
            <defs>
              <linearGradient id="woodKGrad" x1="0%" y1="0%" x2="0%" y2="100%">
                <stop offset="0%" stopColor="#F59E0B" />
                <stop offset="50%" stopColor="#D97706" />
                <stop offset="100%" stopColor="#92400E" />
              </linearGradient>
            </defs>
            <path d="M26 16 L42 16 L42 46 L64 16 L84 16 L56 50 L84 84 L64 84 L42 56 L42 84 L26 84 Z" fill="url(#woodKGrad)" stroke="#FDE68A" strokeWidth="2.5" strokeLinejoin="round" />
          </svg>
        );

      case 'WOOD_Q':
        return (
          <svg viewBox="0 0 100 100" className="w-full h-full drop-shadow-lg overflow-visible">
            <defs>
              <linearGradient id="woodQGrad" x1="0%" y1="0%" x2="0%" y2="100%">
                <stop offset="0%" stopColor="#8B5CF6" />
                <stop offset="50%" stopColor="#7C3AED" />
                <stop offset="100%" stopColor="#5B21B6" />
              </linearGradient>
            </defs>
            <path d="M50 16 Q28 16 28 48 Q28 80 50 80 Q62 80 70 72 L76 84 L84 78 L74 64 Q72 48 72 48 Q72 16 50 16 Z M50 32 Q58 32 58 48 Q58 64 50 64 Q42 64 42 48 Q42 32 50 32 Z" fill="url(#woodQGrad)" stroke="#DDD6FE" strokeWidth="2.5" strokeLinejoin="round" />
          </svg>
        );

      case 'WOOD_J':
        return (
          <svg viewBox="0 0 100 100" className="w-full h-full drop-shadow-lg overflow-visible">
            <defs>
              <linearGradient id="woodJGrad" x1="0%" y1="0%" x2="0%" y2="100%">
                <stop offset="0%" stopColor="#06B6D4" />
                <stop offset="50%" stopColor="#0891B2" />
                <stop offset="100%" stopColor="#0E7490" />
              </linearGradient>
            </defs>
            <path d="M42 16 L76 16 L76 30 L60 30 L60 64 C60 76, 52 84, 38 84 C26 84, 22 76, 22 66 L38 66 C38 72, 40 72, 42 72 C44 72, 44 68, 44 62 L44 30 L42 30 Z" fill="url(#woodJGrad)" stroke="#A5F3FC" strokeWidth="2.5" strokeLinejoin="round" />
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

  const getWinningAnimationClass = () => {
    if (!isWinning && !isScatterHighlight) return '';
    switch (id) {
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
              : 'bg-cyan-400/40 shadow-[0_0_25px_rgba(0,240,255,0.8)]'
          }`}
        />
      )}
      <div className="relative z-10 w-full h-full flex items-center justify-center p-1">
        {getSymbolSvg()}
      </div>
    </div>
  );
};
