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
            <circle cx="50" cy="44" r="11" fill="url(#vaultGoldSpoke)" stroke="#FFF" strokeWidth="1.8" />
            <circle cx="50" cy="44" r="5" fill="#0C0F18" stroke="#FDE047" strokeWidth="1" />

            {/* Top Indicator Alarm LEDs */}
            <circle cx="43" cy="20" r="2.5" fill="#22C55E" className="animate-pulse" />
            <circle cx="57" cy="20" r="2.5" fill="#EF4444" className="animate-ping" />

            {/* SCATTER 3D Plaque */}
            <g transform="translate(0, 1)">
              <rect x="12" y="75" width="76" height="20" rx="5" fill="#090E17" stroke="#00F0FF" strokeWidth="2.5" />
              <text
                x="50"
                y="89"
                textAnchor="middle"
                fill="#00F0FF"
                fontWeight="900"
                fontSize="11.5"
                fontFamily="sans-serif"
                letterSpacing="1.8"
                className="drop-shadow-[0_0_8px_rgba(0,240,255,0.8)]"
              >
                SCATTER
              </text>
            </g>
          </svg>
        );

      case 'COIN':
        return (
          <svg viewBox="0 0 100 100" className="w-full h-full drop-shadow-lg overflow-visible">
            <defs>
              <radialGradient id="coinGoldFace" cx="35%" cy="35%" r="65%">
                <stop offset="0%" stopColor="#FFFDEB" />
                <stop offset="25%" stopColor="#FEF08A" />
                <stop offset="60%" stopColor="#F59E0B" />
                <stop offset="85%" stopColor="#D97706" />
                <stop offset="100%" stopColor="#78350F" />
              </radialGradient>
              <linearGradient id="reededRim" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#FFFBEB" />
                <stop offset="50%" stopColor="#D97706" />
                <stop offset="100%" stopColor="#FFFBEB" />
              </linearGradient>
            </defs>

            {/* 3D Drop Shadow */}
            <circle cx="53" cy="53" r="44" fill="#1E0E03" opacity="0.8" />

            {/* Outer Reeded Security Edge with 32 micro-serrations */}
            <circle cx="50" cy="50" r="44" fill="url(#reededRim)" stroke="#78350F" strokeWidth="2" />
            {/* Coin Face */}
            <circle cx="50" cy="50" r="40" fill="url(#coinGoldFace)" stroke="#FEF08A" strokeWidth="2" />
            <circle cx="50" cy="50" r="34" fill="none" stroke="#FBBF24" strokeWidth="1.6" strokeDasharray="3 2" />

            {/* Embossed Bold 3D Dollar Emblem */}
            <text
              x="50"
              y="63"
              textAnchor="middle"
              fill="#FFFFFF"
              fontWeight="900"
              fontSize="40"
              fontFamily="monospace"
              stroke="#78350F"
              strokeWidth="2.2"
              className="drop-shadow-[0_3px_6px_rgba(0,0,0,0.8)]"
            >
              $
            </text>

            {/* Purity & Vault Stamp */}
            <text x="50" y="24" textAnchor="middle" fill="#78350F" fontWeight="900" fontSize="8" letterSpacing="1">
              ★ 999.9 ★
            </text>
            <text x="50" y="78" textAnchor="middle" fill="#78350F" fontWeight="900" fontSize="7.5" letterSpacing="1.2">
              BONUS
            </text>

            {/* Specular Starburst */}
            <polygon points="76,28 78,33 83,34 78,36 76,41 74,36 69,34 74,33" fill="#FFFFFF" />
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

            {/* Top Bar Stamped Hallmark */}
            <text x="44" y="46" textAnchor="middle" fill="#78350F" fontWeight="900" fontSize="10.5" fontFamily="sans-serif">
              ★ 999.9 ★
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
            <text x="48" y="41" textAnchor="middle" fill="#FFF" fontWeight="900" fontSize="8.5" fontFamily="sans-serif">
              $10K
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

            {/* Top Bar Gold Emblem */}
            <text x="45" y="34" textAnchor="middle" fill="#78350F" fontWeight="900" fontSize="9" fontFamily="sans-serif">
              ★ GOLD ★
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

      default:
        return null;
    }
  };

  return (
    <div
      className={`relative w-full h-full flex items-center justify-center transition-all ${
        isWinning ? 'animate-win-symbol-juice' : ''
      } ${className}`}
    >
      {/* Radiant golden aura burst behind winning symbols */}
      {isWinning && (
        <div className="absolute inset-0 rounded-xl bg-gold-400/40 animate-pulse filter blur-md pointer-events-none z-0" />
      )}
      {/* Cyan aura behind scatter */}
      {isScatterHighlight && (
        <div className="absolute inset-0 rounded-xl bg-cyan-400/40 animate-pulse filter blur-md pointer-events-none z-0" />
      )}
      <div className="relative z-10 w-full h-full flex items-center justify-center p-1">
        {getSymbolSvg()}
      </div>
    </div>
  );
};
