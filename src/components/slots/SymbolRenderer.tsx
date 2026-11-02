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
              <linearGradient id="wildGold" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#FFF2A3" />
                <stop offset="30%" stopColor="#F59E0B" />
                <stop offset="70%" stopColor="#D97706" />
                <stop offset="100%" stopColor="#78350F" />
              </linearGradient>
              <linearGradient id="rubyGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#FF4D6D" />
                <stop offset="100%" stopColor="#800F2F" />
              </linearGradient>
            </defs>
            {/* Crown Base */}
            <path
              d="M15 72 L85 72 L88 78 L12 78 Z"
              fill="url(#wildGold)"
              stroke="#FFF"
              strokeWidth="1.5"
            />
            {/* Crown Spikes */}
            <path
              d="M15 72 L10 32 L32 50 L50 20 L68 50 L90 32 L85 72 Z"
              fill="url(#wildGold)"
              stroke="#FFE885"
              strokeWidth="2"
            />
            {/* Crown Jewels */}
            <circle cx="10" cy="30" r="5" fill="url(#rubyGrad)" stroke="#FFF" strokeWidth="1" />
            <circle cx="50" cy="18" r="6.5" fill="url(#rubyGrad)" stroke="#FFF" strokeWidth="1.5" />
            <circle cx="90" cy="30" r="5" fill="url(#rubyGrad)" stroke="#FFF" strokeWidth="1" />
            <circle cx="32" cy="50" r="3.5" fill="#38BDF8" />
            <circle cx="68" cy="50" r="3.5" fill="#38BDF8" />
            {/* Center Gem */}
            <polygon points="50,42 56,54 50,65 44,54" fill="url(#rubyGrad)" stroke="#FFF" strokeWidth="1" />
            {/* Banner */}
            <rect x="18" y="76" width="64" height="18" rx="4" fill="#0C0F18" stroke="#F59E0B" strokeWidth="2" />
            <text
              x="50"
              y="89"
              textAnchor="middle"
              fill="#FBBF24"
              fontWeight="900"
              fontSize="12"
              letterSpacing="2"
            >
              WILD
            </text>
          </svg>
        );

      case 'SCATTER':
        return (
          <svg viewBox="0 0 100 100" className="w-full h-full drop-shadow-md">
            <defs>
              <linearGradient id="vaultGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#00F0FF" />
                <stop offset="50%" stopColor="#3B82F6" />
                <stop offset="100%" stopColor="#1E1B4B" />
              </linearGradient>
              <radialGradient id="starGlow" cx="50%" cy="50%" r="50%">
                <stop offset="0%" stopColor="#FFF" />
                <stop offset="50%" stopColor="#FDE047" />
                <stop offset="100%" stopColor="#EAB308" />
              </radialGradient>
            </defs>
            {/* Outer Hexagon / Shield */}
            <polygon
              points="50,6 88,28 88,72 50,94 12,72 12,28"
              fill="url(#vaultGrad)"
              stroke="#00F0FF"
              strokeWidth="3"
            />
            {/* Glowing Star */}
            <polygon
              points="50,20 57,38 76,38 61,50 67,68 50,56 33,68 39,50 24,38 43,38"
              fill="url(#starGlow)"
              stroke="#FFF"
              strokeWidth="1.5"
            />
            {/* Center Core */}
            <circle cx="50" cy="46" r="6" fill="#FFF" />
            {/* Banner */}
            <rect x="16" y="75" width="68" height="17" rx="3" fill="#0F172A" stroke="#00F0FF" strokeWidth="1.5" />
            <text
              x="50"
              y="87"
              textAnchor="middle"
              fill="#00F0FF"
              fontWeight="900"
              fontSize="10"
              letterSpacing="1.5"
            >
              BONUS
            </text>
          </svg>
        );

      case 'DIAMOND':
        return (
          <svg viewBox="0 0 100 100" className="w-full h-full drop-shadow-md">
            <defs>
              <linearGradient id="diaTop" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#E0F2FE" />
                <stop offset="100%" stopColor="#38BDF8" />
              </linearGradient>
              <linearGradient id="diaBottom" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#0284C7" />
                <stop offset="100%" stopColor="#0C4A6E" />
              </linearGradient>
            </defs>
            {/* Diamond Crown */}
            <polygon points="22,35 78,35 66,15 34,15" fill="url(#diaTop)" stroke="#BAE6FD" strokeWidth="1.5" />
            {/* Facets */}
            <polygon points="34,15 50,35 22,35" fill="#7DD3FC" opacity="0.9" stroke="#BAE6FD" strokeWidth="1" />
            <polygon points="50,35 66,15 78,35" fill="#7DD3FC" opacity="0.9" stroke="#BAE6FD" strokeWidth="1" />
            <polygon points="34,15 50,35 66,15" fill="#F0F9FF" opacity="0.95" stroke="#BAE6FD" strokeWidth="1" />
            {/* Diamond Pavilion (Bottom point) */}
            <polygon points="22,35 78,35 50,88" fill="url(#diaBottom)" stroke="#38BDF8" strokeWidth="1.5" />
            <polygon points="22,35 50,35 50,88" fill="#0369A1" stroke="#38BDF8" strokeWidth="1" />
            <polygon points="50,35 78,35 50,88" fill="#0EA5E9" stroke="#38BDF8" strokeWidth="1" />
            {/* Sparkle highlight */}
            <circle cx="38" cy="25" r="2.5" fill="#FFF" />
            <polygon points="38,20 40,25 38,30 36,25" fill="#FFF" />
          </svg>
        );

      case 'SEVEN':
        return (
          <svg viewBox="0 0 100 100" className="w-full h-full drop-shadow-md">
            <defs>
              <linearGradient id="sevenGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#FEE2E2" />
                <stop offset="25%" stopColor="#EF4444" />
                <stop offset="70%" stopColor="#B91C1C" />
                <stop offset="100%" stopColor="#7F1D1D" />
              </linearGradient>
            </defs>
            {/* Outer Glow Outline */}
            <path
              d="M20 18 L80 18 L80 32 L54 84 L34 84 L58 35 L20 35 Z"
              fill="url(#sevenGrad)"
              stroke="#FBBF24"
              strokeWidth="3.5"
              strokeLinejoin="round"
            />
            {/* Inner Highlight Inset */}
            <path
              d="M26 23 L74 23 L54 62 L42 62 L60 29 L26 29 Z"
              fill="#F87171"
              opacity="0.8"
            />
            {/* Glint */}
            <circle cx="75" cy="20" r="3.5" fill="#FFF" />
          </svg>
        );

      case 'BELL':
        return (
          <svg viewBox="0 0 100 100" className="w-full h-full drop-shadow-md">
            <defs>
              <linearGradient id="bellGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#FEF08A" />
                <stop offset="40%" stopColor="#EAB308" />
                <stop offset="80%" stopColor="#A16207" />
                <stop offset="100%" stopColor="#713F12" />
              </linearGradient>
            </defs>
            {/* Bell Hanger */}
            <path d="M42 22 C42 16, 58 16, 58 22" fill="none" stroke="#FDE047" strokeWidth="4" />
            {/* Bell Dome */}
            <path
              d="M48 22 C34 24, 25 45, 18 68 L82 68 C75 45, 66 24, 52 22 Z"
              fill="url(#bellGrad)"
              stroke="#FFF"
              strokeWidth="1.5"
            />
            {/* Bell Rim */}
            <rect x="14" y="68" width="72" height="10" rx="5" fill="#CA8A04" stroke="#FEF08A" strokeWidth="2" />
            {/* Bell Clapper */}
            <circle cx="50" cy="83" r="8" fill="#713F12" stroke="#FDE047" strokeWidth="2" />
            {/* Shine */}
            <path d="M30 35 C33 45, 30 55, 26 62" fill="none" stroke="#FFF" strokeWidth="2.5" strokeLinecap="round" />
          </svg>
        );

      case 'HORSESHOE':
        return (
          <svg viewBox="0 0 100 100" className="w-full h-full drop-shadow-md">
            <defs>
              <linearGradient id="shoeGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#E9D5FF" />
                <stop offset="40%" stopColor="#A855F7" />
                <stop offset="80%" stopColor="#6B21A8" />
                <stop offset="100%" stopColor="#3B0764" />
              </linearGradient>
            </defs>
            {/* Horseshoe Body */}
            <path
              d="M20 22 C20 68, 80 68, 80 22 L65 22 C65 52, 35 52, 35 22 Z"
              fill="url(#shoeGrad)"
              stroke="#F3E8FF"
              strokeWidth="2"
            />
            {/* Horseshoe Tips */}
            <rect x="16" y="16" width="18" height="8" rx="2" fill="#C084FC" stroke="#FFF" strokeWidth="1" />
            <rect x="66" y="16" width="18" height="8" rx="2" fill="#C084FC" stroke="#FFF" strokeWidth="1" />
            {/* Nail holes */}
            <circle cx="28" cy="35" r="2.5" fill="#1E1B4B" />
            <circle cx="29" cy="48" r="2.5" fill="#1E1B4B" />
            <circle cx="37" cy="58" r="2.5" fill="#1E1B4B" />
            <circle cx="72" cy="35" r="2.5" fill="#1E1B4B" />
            <circle cx="71" cy="48" r="2.5" fill="#1E1B4B" />
            <circle cx="63" cy="58" r="2.5" fill="#1E1B4B" />
          </svg>
        );

      case 'MELON':
        return (
          <svg viewBox="0 0 100 100" className="w-full h-full drop-shadow-md">
            <defs>
              <linearGradient id="rindGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#22C55E" />
                <stop offset="100%" stopColor="#14532D" />
              </linearGradient>
            </defs>
            {/* Outer Rind */}
            <path d="M15 45 C15 88, 85 88, 85 45 Z" fill="url(#rindGrad)" stroke="#86EFAC" strokeWidth="2" />
            {/* Inner White Rind */}
            <path d="M20 45 C20 82, 80 82, 80 45 Z" fill="#DCFCE7" />
            {/* Juicy Red Flesh */}
            <path d="M24 45 C24 77, 76 77, 76 45 Z" fill="#EF4444" />
            {/* Seeds */}
            <ellipse cx="38" cy="53" rx="2" ry="3.5" fill="#18181B" transform="rotate(-15 38 53)" />
            <ellipse cx="50" cy="62" rx="2" ry="3.5" fill="#18181B" />
            <ellipse cx="62" cy="53" rx="2" ry="3.5" fill="#18181B" transform="rotate(15 62 53)" />
          </svg>
        );

      case 'PLUM':
        return (
          <svg viewBox="0 0 100 100" className="w-full h-full drop-shadow-md">
            <defs>
              <radialGradient id="plumGrad" cx="40%" cy="35%" r="65%">
                <stop offset="0%" stopColor="#E9D5FF" />
                <stop offset="40%" stopColor="#A855F7" />
                <stop offset="80%" stopColor="#581C87" />
                <stop offset="100%" stopColor="#2E1065" />
              </radialGradient>
            </defs>
            {/* Leaf */}
            <path d="M50 25 C58 10, 75 14, 72 24 C60 26, 54 26, 50 25 Z" fill="#22C55E" stroke="#15803D" strokeWidth="1" />
            {/* Stem */}
            <path d="M50 30 C50 20, 52 16, 56 12" fill="none" stroke="#78350F" strokeWidth="3" strokeLinecap="round" />
            {/* Plum Body */}
            <circle cx="50" cy="58" r="30" fill="url(#plumGrad)" stroke="#C084FC" strokeWidth="1.5" />
            {/* Indentation line */}
            <path d="M50 30 C46 45, 48 70, 50 88" fill="none" stroke="#3B0764" strokeWidth="2" opacity="0.6" />
          </svg>
        );

      case 'CHERRY':
        return (
          <svg viewBox="0 0 100 100" className="w-full h-full drop-shadow-md">
            <defs>
              <radialGradient id="cherryGrad" cx="35%" cy="30%" r="65%">
                <stop offset="0%" stopColor="#FFA4B6" />
                <stop offset="35%" stopColor="#E11D48" />
                <stop offset="80%" stopColor="#881337" />
                <stop offset="100%" stopColor="#4C0519" />
              </radialGradient>
            </defs>
            {/* Green Leaf */}
            <path d="M54 22 C65 14, 80 18, 76 28 C64 30, 58 28, 54 22 Z" fill="#22C55E" />
            {/* Stems joined at top */}
            <path d="M54 22 C48 38, 38 48, 34 60" fill="none" stroke="#65A30D" strokeWidth="3" strokeLinecap="round" />
            <path d="M54 22 C62 38, 66 48, 68 62" fill="none" stroke="#65A30D" strokeWidth="3" strokeLinecap="round" />
            {/* Left Cherry */}
            <circle cx="34" cy="68" r="18" fill="url(#cherryGrad)" stroke="#FDA4AF" strokeWidth="1" />
            <ellipse cx="28" cy="62" rx="4" ry="2" fill="#FFF" opacity="0.8" transform="rotate(-30 28 62)" />
            {/* Right Cherry */}
            <circle cx="68" cy="70" r="18" fill="url(#cherryGrad)" stroke="#FDA4AF" strokeWidth="1" />
            <ellipse cx="62" cy="64" rx="4" ry="2" fill="#FFF" opacity="0.8" transform="rotate(-30 62 64)" />
          </svg>
        );

      default:
        return null;
    }
  };

  return (
    <div
      className={`relative w-full h-full flex items-center justify-center p-1 sm:p-2 transition-transform duration-200 ${
        isWinning ? 'scale-110 z-10 filter drop-shadow-[0_0_15px_rgba(251,191,36,0.9)] animate-pulse-fast' : ''
      } ${
        isScatterHighlight ? 'scale-115 z-10 filter drop-shadow-[0_0_20px_rgba(0,240,255,0.9)] animate-bounce-soft' : ''
      } ${className}`}
    >
      {getSymbolSvg()}
    </div>
  );
};
