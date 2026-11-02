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
          <svg viewBox="0 0 100 100" className="w-full h-full drop-shadow-md">
            <defs>
              <linearGradient id="wildCrownGold" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#FFF9D2" />
                <stop offset="25%" stopColor="#FDE047" />
                <stop offset="55%" stopColor="#F59E0B" />
                <stop offset="85%" stopColor="#B45309" />
                <stop offset="100%" stopColor="#78350F" />
              </linearGradient>
              <linearGradient id="rubyJewel" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#FF4D6D" />
                <stop offset="50%" stopColor="#C9184A" />
                <stop offset="100%" stopColor="#590D22" />
              </linearGradient>
              <linearGradient id="diamondJewel" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#FFFFFF" />
                <stop offset="60%" stopColor="#BAE6FD" />
                <stop offset="100%" stopColor="#0284C7" />
              </linearGradient>
            </defs>
            {/* Crown Base Band with Gold Rivets */}
            <path d="M14 70 L86 70 L89 76 L11 76 Z" fill="url(#wildCrownGold)" stroke="#FEF08A" strokeWidth="1.5" />
            <circle cx="22" cy="73" r="2" fill="#78350F" />
            <circle cx="36" cy="73" r="2" fill="#78350F" />
            <circle cx="50" cy="73" r="2.5" fill="url(#rubyJewel)" />
            <circle cx="64" cy="73" r="2" fill="#78350F" />
            <circle cx="78" cy="73" r="2" fill="#78350F" />
            {/* 5-Peak Imperial Crown */}
            <path
              d="M14 70 L9 32 L30 48 L50 18 L70 48 L91 32 L86 70 Z"
              fill="url(#wildCrownGold)"
              stroke="#FFF"
              strokeWidth="1.5"
              strokeLinejoin="round"
            />
            {/* Jewels on Tips */}
            <circle cx="9" cy="30" r="5" fill="url(#diamondJewel)" stroke="#FFF" strokeWidth="1" />
            <circle cx="50" cy="16" r="6.5" fill="url(#rubyJewel)" stroke="#FFF" strokeWidth="1.5" />
            <circle cx="91" cy="30" r="5" fill="url(#diamondJewel)" stroke="#FFF" strokeWidth="1" />
            <circle cx="30" cy="48" r="4" fill="url(#diamondJewel)" stroke="#FFF" strokeWidth="1" />
            <circle cx="70" cy="48" r="4" fill="url(#diamondJewel)" stroke="#FFF" strokeWidth="1" />
            {/* Center Royal Medallion */}
            <polygon points="50,38 58,50 50,62 42,50" fill="url(#rubyJewel)" stroke="#FEF08A" strokeWidth="1.5" />
            <circle cx="50" cy="50" r="2.5" fill="#FFF" />
            {/* 24K WILD Plaque */}
            <rect x="14" y="77" width="72" height="17" rx="4" fill="#0C0F18" stroke="#F59E0B" strokeWidth="2" />
            <text x="50" y="89" textAnchor="middle" fill="#FBBF24" fontWeight="900" fontSize="11" letterSpacing="1.5">
              24K WILD
            </text>
          </svg>
        );

      case 'SCATTER':
        return (
          <svg viewBox="0 0 100 100" className="w-full h-full drop-shadow-md">
            <defs>
              <linearGradient id="vaultDoorSteel" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#F8FAFC" />
                <stop offset="25%" stopColor="#94A3B8" />
                <stop offset="60%" stopColor="#475569" />
                <stop offset="100%" stopColor="#0F172A" />
              </linearGradient>
              <radialGradient id="vaultHubGold" cx="40%" cy="40%" r="60%">
                <stop offset="0%" stopColor="#FFFBEB" />
                <stop offset="40%" stopColor="#FBBF24" />
                <stop offset="85%" stopColor="#D97706" />
                <stop offset="100%" stopColor="#78350F" />
              </radialGradient>
            </defs>
            {/* Outer Heavy Steel Flange with Bolts */}
            <circle cx="50" cy="46" r="40" fill="url(#vaultDoorSteel)" stroke="#00F0FF" strokeWidth="2.5" />
            {[0, 45, 90, 135, 180, 225, 270, 315].map((angle, i) => (
              <circle
                key={i}
                cx={50 + 36 * Math.cos((angle * Math.PI) / 180)}
                cy={46 + 36 * Math.sin((angle * Math.PI) / 180)}
                r="2"
                fill="#CBD5E1"
                stroke="#0F172A"
                strokeWidth="0.8"
              />
            ))}
            {/* Inner Recessed Door Plate */}
            <circle cx="50" cy="46" r="30" fill="#1E293B" stroke="#FBBF24" strokeWidth="1.5" />
            {/* 3-Spoke Golden Steering Vault Wheel */}
            <line x1="50" y1="20" x2="50" y2="72" stroke="url(#vaultHubGold)" strokeWidth="4" strokeLinecap="round" />
            <line x1="27" y1="33" x2="73" y2="59" stroke="url(#vaultHubGold)" strokeWidth="4" strokeLinecap="round" />
            <line x1="27" y1="59" x2="73" y2="33" stroke="url(#vaultHubGold)" strokeWidth="4" strokeLinecap="round" />
            {/* Center Lock Dial */}
            <circle cx="50" cy="46" r="11" fill="url(#vaultHubGold)" stroke="#FFF" strokeWidth="1.5" />
            <circle cx="50" cy="46" r="5" fill="#0C0F18" />
            {/* Top Indicator LEDs */}
            <circle cx="43" cy="22" r="2" fill="#22C55E" />
            <circle cx="57" cy="22" r="2" fill="#EF4444" />
            {/* VAULT Plaque */}
            <rect x="14" y="78" width="72" height="17" rx="3" fill="#0F172A" stroke="#00F0FF" strokeWidth="2" />
            <text x="50" y="90" textAnchor="middle" fill="#00F0FF" fontWeight="900" fontSize="10.5" letterSpacing="1.5">
              VAULT SCATTER
            </text>
          </svg>
        );

      case 'COIN':
        return (
          <svg viewBox="0 0 100 100" className="w-full h-full drop-shadow-md">
            <defs>
              <radialGradient id="mintedGoldCoin" cx="35%" cy="30%" r="65%">
                <stop offset="0%" stopColor="#FFFDEB" />
                <stop offset="25%" stopColor="#FDE047" />
                <stop offset="60%" stopColor="#F59E0B" />
                <stop offset="85%" stopColor="#D97706" />
                <stop offset="100%" stopColor="#78350F" />
              </radialGradient>
              <linearGradient id="coinRimShine" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#FFF9D2" />
                <stop offset="50%" stopColor="#D97706" />
                <stop offset="100%" stopColor="#FFF9D2" />
              </linearGradient>
            </defs>
            {/* Outer Reeded Security Edge */}
            <circle cx="50" cy="50" r="43" fill="url(#coinRimShine)" stroke="#78350F" strokeWidth="2" />
            {/* Coin Face */}
            <circle cx="50" cy="50" r="39" fill="url(#mintedGoldCoin)" stroke="#FEF08A" strokeWidth="1.5" />
            <circle cx="50" cy="50" r="33" fill="none" stroke="#FBBF24" strokeWidth="1.2" strokeDasharray="3 1.5" />
            {/* Embossed Bold Dollar Sign */}
            <text
              x="50"
              y="60"
              textAnchor="middle"
              fill="#FFF"
              fontWeight="900"
              fontSize="34"
              fontFamily="monospace"
              stroke="#78350F"
              strokeWidth="1.5"
              className="drop-shadow-[0_2px_4px_rgba(0,0,0,0.6)]"
            >
              $
            </text>
            {/* Top Stars & Bottom Mint Stamp */}
            <text x="50" y="24" textAnchor="middle" fill="#78350F" fontWeight="900" fontSize="7" letterSpacing="1.2">
              ★ PURE GOLD ★
            </text>
            <text x="50" y="78" textAnchor="middle" fill="#78350F" fontWeight="900" fontSize="6.5" letterSpacing="1">
              HOLD &amp; SPIN
            </text>
          </svg>
        );

      case 'DIAMOND':
        return (
          <svg viewBox="0 0 100 100" className="w-full h-full drop-shadow-md">
            <defs>
              <linearGradient id="caseMetal" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#E2E8F0" />
                <stop offset="45%" stopColor="#64748B" />
                <stop offset="100%" stopColor="#1E293B" />
              </linearGradient>
              <linearGradient id="diamondCrownGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#FFFFFF" />
                <stop offset="35%" stopColor="#7DD3FC" />
                <stop offset="70%" stopColor="#0284C7" />
                <stop offset="100%" stopColor="#082F49" />
              </linearGradient>
              <linearGradient id="cashStackGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#86EFAC" />
                <stop offset="50%" stopColor="#16A34A" />
                <stop offset="100%" stopColor="#14532D" />
              </linearGradient>
            </defs>
            {/* Open Briefcase Base */}
            <rect x="14" y="38" width="72" height="48" rx="6" fill="url(#caseMetal)" stroke="#FBBF24" strokeWidth="2" />
            <rect x="18" y="42" width="64" height="40" rx="3" fill="#020617" stroke="#334155" strokeWidth="1" />
            {/* Cash Bundles Inside Briefcase */}
            <rect x="22" y="56" width="26" height="12" rx="1.5" fill="url(#cashStackGrad)" stroke="#15803D" strokeWidth="0.8" />
            <rect x="32" y="56" width="6" height="12" fill="#38BDF8" opacity="0.9" />
            <rect x="52" y="56" width="26" height="12" rx="1.5" fill="url(#cashStackGrad)" stroke="#15803D" strokeWidth="0.8" />
            <rect x="62" y="56" width="6" height="12" fill="#38BDF8" opacity="0.9" />
            {/* Briefcase Handle */}
            <path d="M40 38 L40 28 Q40 24 50 24 Q60 24 60 28 L60 38" fill="none" stroke="#FBBF24" strokeWidth="3.5" strokeLinecap="round" />
            {/* Huge Sparkling Diamond in Center */}
            <polygon points="34,22 66,22 76,36 50,60 24,36" fill="url(#diamondCrownGrad)" stroke="#FFF" strokeWidth="1.5" />
            <polygon points="34,22 50,36 24,36" fill="#BAE6FD" opacity="0.8" />
            <polygon points="50,36 66,22 76,36" fill="#BAE6FD" opacity="0.8" />
            <polygon points="34,22 50,36 66,22" fill="#FFFFFF" opacity="0.95" />
            <polygon points="24,36 76,36 50,60" fill="url(#diamondCrownGrad)" stroke="#7DD3FC" strokeWidth="1" />
            {/* Specular Starburst */}
            <polygon points="50,14 52,20 58,22 52,24 50,30 48,24 42,22 48,20" fill="#FFFFFF" />
            {/* Label */}
            <text x="50" y="80" textAnchor="middle" fill="#FEF08A" fontWeight="900" fontSize="7" letterSpacing="1">
              DIAMOND BRIEFCASE
            </text>
          </svg>
        );

      case 'SEVEN':
        return (
          <svg viewBox="0 0 100 100" className="w-full h-full drop-shadow-md">
            <defs>
              <linearGradient id="gold777" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#FFFBEB" />
                <stop offset="20%" stopColor="#FEF08A" />
                <stop offset="50%" stopColor="#F59E0B" />
                <stop offset="80%" stopColor="#B45309" />
                <stop offset="100%" stopColor="#451A03" />
              </linearGradient>
            </defs>
            {/* Back Golden Flare Shadow */}
            <path
              d="M18 16 L82 16 L82 32 L56 86 L36 86 L60 34 L18 34 Z"
              fill="#451A03"
              transform="translate(3, 3)"
            />
            {/* Main Solid 24K Gold 7 */}
            <path
              d="M18 16 L82 16 L82 32 L56 86 L36 86 L60 34 L18 34 Z"
              fill="url(#gold777)"
              stroke="#FFF"
              strokeWidth="2.5"
              strokeLinejoin="round"
            />
            {/* Inner Precision Bevel Stripe */}
            <path d="M26 22 L74 22 L54 66 L44 66 L62 28 L26 28 Z" fill="#FFFBEB" opacity="0.75" />
            {/* Dollar Sign Engraving on the Stem */}
            <text x="56" y="52" fill="#78350F" fontWeight="900" fontSize="12" fontStyle="italic">
              $
            </text>
            {/* Brilliant Diamond Star Glint */}
            <polygon points="76,18 78,22 84,24 78,26 76,30 74,26 68,24 74,22" fill="#FFFFFF" />
            <polygon points="40,80 41,83 45,84 41,85 40,88 39,85 35,84 39,83" fill="#FFFFFF" />
          </svg>
        );

      case 'GOLDBAR':
        return (
          <svg viewBox="0 0 100 100" className="w-full h-full drop-shadow-md">
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
            <polygon points="12,66 52,66 44,84 4,84" fill="url(#bullionGoldA)" stroke="#FEF08A" strokeWidth="1.2" />
            <polygon points="52,66 60,70 52,88 44,84" fill="#92400E" stroke="#FEF08A" strokeWidth="0.8" />
            {/* Bottom Right Bullion Bar */}
            <polygon points="48,66 88,66 80,84 40,84" fill="url(#bullionGoldA)" stroke="#FEF08A" strokeWidth="1.2" />
            <polygon points="88,66 96,70 88,88 80,84" fill="#92400E" stroke="#FEF08A" strokeWidth="0.8" />
            {/* Center Pyramid Top Bullion Bar */}
            <polygon points="28,34 72,34 62,56 18,56" fill="url(#bullionGoldB)" stroke="#FFF" strokeWidth="1.5" />
            <polygon points="72,34 82,40 72,62 62,56" fill="#78350F" stroke="#FEF08A" strokeWidth="1" />
            {/* Top Bar Stamp */}
            <text x="44" y="44" textAnchor="middle" fill="#78350F" fontWeight="900" fontSize="7.5" letterSpacing="0.8">
              999.9 FINE GOLD
            </text>
            <text x="44" y="52" textAnchor="middle" fill="#451A03" fontWeight="800" fontSize="6.5">
              FORT KNOX 1000g
            </text>
            {/* Specular Starburst */}
            <polygon points="28,34 30,38 34,39 30,40 28,44 26,40 22,39 26,38" fill="#FFFFFF" />
          </svg>
        );

      case 'BELL': // Themed as Overstuffed Cash Bag ($100 Bills & Coins)
        return (
          <svg viewBox="0 0 100 100" className="w-full h-full drop-shadow-md">
            <defs>
              <linearGradient id="sackBurlap" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#FEF08A" />
                <stop offset="35%" stopColor="#EAB308" />
                <stop offset="75%" stopColor="#A16207" />
                <stop offset="100%" stopColor="#451A03" />
              </linearGradient>
              <linearGradient id="cashGreen" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#86EFAC" />
                <stop offset="50%" stopColor="#22C55E" />
                <stop offset="100%" stopColor="#14532D" />
              </linearGradient>
            </defs>
            {/* Green Banknotes Bursting out of Top */}
            <polygon points="36,22 52,14 62,26 46,34" fill="url(#cashGreen)" stroke="#FFF" strokeWidth="1" />
            <polygon points="46,18 64,12 72,24 54,30" fill="url(#cashGreen)" stroke="#FFF" strokeWidth="1" />
            <text x="50" y="24" fill="#052E16" fontWeight="900" fontSize="6" transform="rotate(-15 50 24)">
              $100
            </text>
            {/* Main Overstuffed Bag Body */}
            <path
              d="M38 32 C38 24, 62 24, 62 32 C66 35, 84 50, 84 72 C84 86, 72 90, 50 90 C28 90, 16 86, 16 72 C16 50, 34 35, 38 32 Z"
              fill="url(#sackBurlap)"
              stroke="#FEF08A"
              strokeWidth="2"
            />
            {/* Golden Rope Tie */}
            <ellipse cx="50" cy="34" rx="14" ry="4.5" fill="#78350F" stroke="#FEF08A" strokeWidth="1.5" />
            {/* Stenciled Big Black Dollar Sign on Bag Belly */}
            <text
              x="50"
              y="69"
              textAnchor="middle"
              fill="#451A03"
              fontWeight="900"
              fontSize="30"
              stroke="#FEF08A"
              strokeWidth="1"
            >
              $
            </text>
            {/* Gold Doubloons Spilling at Base */}
            <circle cx="26" cy="84" r="5" fill="#FBBF24" stroke="#78350F" strokeWidth="1" />
            <circle cx="74" cy="84" r="5" fill="#FBBF24" stroke="#78350F" strokeWidth="1" />
          </svg>
        );

      case 'HORSESHOE': // Themed as Banded Cash Bricks ($10,000 Wads)
        return (
          <svg viewBox="0 0 100 100" className="w-full h-full drop-shadow-md">
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
            {/* Bottom Brick */}
            <polygon points="12,58 76,58 66,78 2,78" fill="url(#brickGreenA)" stroke="#15803D" strokeWidth="1.5" />
            <polygon points="76,58 88,64 78,84 66,78" fill="#14532D" stroke="#15803D" strokeWidth="1" />
            <polygon points="36,58 50,58 42,78 28,78" fill="url(#fedBandBlue)" stroke="#FFF" strokeWidth="0.8" />
            {/* Top Brick Stacked Crosswise */}
            <polygon points="22,30 86,30 76,50 12,50" fill="url(#brickGreenA)" stroke="#FFF" strokeWidth="1.8" />
            <polygon points="86,30 96,36 86,56 76,50" fill="#14532D" stroke="#15803D" strokeWidth="1" />
            {/* Federal Reserve Security Band */}
            <polygon points="46,30 60,30 52,50 38,50" fill="url(#fedBandBlue)" stroke="#FEF08A" strokeWidth="1" />
            <text x="49" y="42" textAnchor="middle" fill="#FFF" fontWeight="900" fontSize="6.5" transform="rotate(-15 49 42)">
              $10,000
            </text>
            {/* Benjamin Portrait Silhouette Circle */}
            <circle cx="30" cy="40" r="5" fill="#14532D" opacity="0.6" />
            <text x="70" y="43" fill="#052E16" fontWeight="900" fontSize="8">
              100
            </text>
            <text x="50" y="86" textAnchor="middle" fill="#4ADE80" fontWeight="900" fontSize="7" letterSpacing="1">
              BANDED CASH BRICK
            </text>
          </svg>
        );

      case 'MELON': // Themed as Royal Gold Treasure Chest
        return (
          <svg viewBox="0 0 100 100" className="w-full h-full drop-shadow-md">
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
            <rect x="14" y="48" width="72" height="38" rx="4" fill="url(#chestWood)" stroke="#FBBF24" strokeWidth="2" />
            {/* Gold Straps with Rivets */}
            <rect x="22" y="48" width="8" height="38" fill="url(#chestGoldTrim)" />
            <rect x="70" y="48" width="8" height="38" fill="url(#chestGoldTrim)" />
            {/* Open Lid Angled Up */}
            <polygon points="12,48 88,48 82,24 18,24" fill="url(#chestWood)" stroke="#FDE047" strokeWidth="2" />
            <polygon points="22,24 30,24 30,48 22,48" fill="url(#chestGoldTrim)" />
            <polygon points="70,24 78,24 78,48 70,48" fill="url(#chestGoldTrim)" />
            {/* Overflowing Gold Coins and Rubies inside */}
            <ellipse cx="50" cy="48" rx="30" ry="8" fill="#FBBF24" />
            <circle cx="36" cy="46" r="4" fill="#FEF08A" stroke="#78350F" strokeWidth="0.8" />
            <circle cx="48" cy="45" r="4.5" fill="#FEF08A" stroke="#78350F" strokeWidth="0.8" />
            <circle cx="60" cy="46" r="4" fill="#FEF08A" stroke="#78350F" strokeWidth="0.8" />
            <polygon points="42,43 45,47 42,51 39,47" fill="#EF4444" stroke="#FFF" strokeWidth="0.6" />
            <polygon points="56,43 59,47 56,51 53,47" fill="#38BDF8" stroke="#FFF" strokeWidth="0.6" />
            {/* Keyhole Medallion */}
            <circle cx="50" cy="62" r="6" fill="url(#chestGoldTrim)" stroke="#FEF08A" strokeWidth="1" />
            <path d="M49 60 L51 60 L52 64 L48 64 Z" fill="#000" />
            <circle cx="50" cy="60" r="1.5" fill="#000" />
          </svg>
        );

      case 'GRAPES': // Themed as Gold Ingot Stack
        return (
          <svg viewBox="0 0 100 100" className="w-full h-full drop-shadow-md">
            <defs>
              <linearGradient id="ingotBarA" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#FFFBEB" />
                <stop offset="30%" stopColor="#FDE047" />
                <stop offset="70%" stopColor="#D97706" />
                <stop offset="100%" stopColor="#78350F" />
              </linearGradient>
            </defs>
            {/* Ingot 1 (Bottom) */}
            <polygon points="16,68 84,68 76,84 8,84" fill="url(#ingotBarA)" stroke="#FFF" strokeWidth="1" />
            {/* Ingot 2 (Middle) */}
            <polygon points="22,46 78,46 70,62 14,62" fill="url(#ingotBarA)" stroke="#FFF" strokeWidth="1" />
            {/* Ingot 3 (Top) */}
            <polygon points="28,24 72,24 64,40 20,40" fill="url(#ingotBarA)" stroke="#FFF" strokeWidth="1.5" />
            {/* Stamps */}
            <text x="44" y="34" textAnchor="middle" fill="#78350F" fontWeight="900" fontSize="7">
              GOLD 100g
            </text>
            <text x="44" y="56" textAnchor="middle" fill="#78350F" fontWeight="900" fontSize="7">
              SWISS BANK
            </text>
            <text x="44" y="78" textAnchor="middle" fill="#78350F" fontWeight="900" fontSize="7">
              999.9 FINE
            </text>
            <polygon points="68,26 70,30 74,31 70,32 68,36 66,32 62,31 66,30" fill="#FFFFFF" />
          </svg>
        );

      case 'CHERRY': // Themed as Diamond Dollar Sign ($)
        return (
          <svg viewBox="0 0 100 100" className="w-full h-full drop-shadow-md">
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
              y="75"
              textAnchor="middle"
              fill="url(#diaDollarGold)"
              stroke="#FFF"
              strokeWidth="2.5"
              fontWeight="900"
              fontSize="75"
              fontFamily="sans-serif"
              className="drop-shadow-[0_4px_8px_rgba(0,0,0,0.8)]"
            >
              $
            </text>
            {/* Inlaid Diamond Pavé Studs */}
            <circle cx="50" cy="20" r="2.5" fill="#FFF" />
            <circle cx="50" cy="34" r="2.5" fill="#BAE6FD" />
            <circle cx="50" cy="50" r="3" fill="#FFF" />
            <circle cx="50" cy="66" r="2.5" fill="#BAE6FD" />
            <circle cx="50" cy="80" r="2.5" fill="#FFF" />
            <circle cx="35" cy="32" r="2.5" fill="#FFF" />
            <circle cx="65" cy="64" r="2.5" fill="#FFF" />
            {/* Sparkle */}
            <polygon points="66,24 68,28 72,29 68,30 66,34 64,30 60,29 64,28" fill="#FFFFFF" />
          </svg>
        );

      case 'PLUM': // Themed as Cash Currency Roll with Gold Money Clip
        return (
          <svg viewBox="0 0 100 100" className="w-full h-full drop-shadow-md">
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
            <ellipse cx="30" cy="50" rx="16" ry="30" fill="url(#rollGreen)" stroke="#FFF" strokeWidth="1.5" />
            <path d="M30 20 L76 20 C92 20, 92 80, 76 80 L30 80 Z" fill="url(#rollGreen)" stroke="#FFF" strokeWidth="1.5" />
            <ellipse cx="76" cy="50" rx="14" ry="29" fill="#14532D" stroke="#4ADE80" strokeWidth="1" />
            {/* Center Spiral on Face */}
            <circle cx="30" cy="50" r="9" fill="#052E16" />
            <text x="30" y="54" textAnchor="middle" fill="#86EFAC" fontWeight="900" fontSize="10">
              $
            </text>
            {/* 24K Gold Money Clip Clamp */}
            <rect x="52" y="16" width="16" height="68" rx="4" fill="url(#goldClip)" stroke="#FEF08A" strokeWidth="2" />
            <circle cx="60" cy="50" r="4.5" fill="#78350F" stroke="#FEF08A" strokeWidth="1" />
            <text x="60" y="53" textAnchor="middle" fill="#FDE047" fontWeight="900" fontSize="7">
              $
            </text>
          </svg>
        );

      case 'ACE':
        return (
          <svg viewBox="0 0 100 100" className="w-full h-full drop-shadow-md">
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
            <text x="50" y="62" textAnchor="middle" fill="#78350F" fontWeight="900" fontSize="9">
              $
            </text>
          </svg>
        );

      case 'KING':
        return (
          <svg viewBox="0 0 100 100" className="w-full h-full drop-shadow-md">
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
              strokeWidth="2.2"
              strokeLinejoin="round"
            />
            <circle cx="50" cy="14" r="2" fill="#EF4444" />
          </svg>
        );

      case 'QUEEN':
        return (
          <svg viewBox="0 0 100 100" className="w-full h-full drop-shadow-md">
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
              strokeWidth="2"
            />
            <circle cx="50" cy="12" r="2" fill="#A855F7" />
          </svg>
        );

      case 'JACK':
        return (
          <svg viewBox="0 0 100 100" className="w-full h-full drop-shadow-md">
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
              strokeWidth="2.2"
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
        <div className="absolute inset-0 rounded-xl bg-gold-400/30 animate-pulse filter blur-sm pointer-events-none z-0" />
      )}
      {/* Cyan aura behind scatter */}
      {isScatterHighlight && (
        <div className="absolute inset-0 rounded-xl bg-cyan-400/30 animate-pulse filter blur-sm pointer-events-none z-0" />
      )}
      <div className="relative z-10 w-full h-full flex items-center justify-center p-0.5">
        {getSymbolSvg()}
      </div>
    </div>
  );
};
