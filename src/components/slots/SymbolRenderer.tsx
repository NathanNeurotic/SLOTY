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
            <path d="M15 72 L85 72 L88 78 L12 78 Z" fill="url(#wildGold)" stroke="#FFF" strokeWidth="1.5" />
            <path d="M15 72 L10 32 L32 50 L50 20 L68 50 L90 32 L85 72 Z" fill="url(#wildGold)" stroke="#FFE885" strokeWidth="2" />
            <circle cx="10" cy="30" r="5" fill="url(#rubyGrad)" stroke="#FFF" strokeWidth="1" />
            <circle cx="50" cy="18" r="6.5" fill="url(#rubyGrad)" stroke="#FFF" strokeWidth="1.5" />
            <circle cx="90" cy="30" r="5" fill="url(#rubyGrad)" stroke="#FFF" strokeWidth="1" />
            <circle cx="32" cy="50" r="3.5" fill="#38BDF8" />
            <circle cx="68" cy="50" r="3.5" fill="#38BDF8" />
            <polygon points="50,42 56,54 50,65 44,54" fill="url(#rubyGrad)" stroke="#FFF" strokeWidth="1" />
            <rect x="16" y="75" width="68" height="18" rx="4" fill="#0C0F18" stroke="#F59E0B" strokeWidth="2" />
            <text x="50" y="88" textAnchor="middle" fill="#FBBF24" fontWeight="900" fontSize="11" letterSpacing="1.5">
              WILD 2X
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
            <polygon points="50,6 88,28 88,72 50,94 12,72 12,28" fill="url(#vaultGrad)" stroke="#00F0FF" strokeWidth="3" />
            <polygon points="50,20 57,38 76,38 61,50 67,68 50,56 33,68 39,50 24,38 43,38" fill="url(#starGlow)" stroke="#FFF" strokeWidth="1.5" />
            <circle cx="50" cy="46" r="6" fill="#FFF" />
            <rect x="16" y="75" width="68" height="17" rx="3" fill="#0F172A" stroke="#00F0FF" strokeWidth="1.5" />
            <text x="50" y="87" textAnchor="middle" fill="#00F0FF" fontWeight="900" fontSize="10" letterSpacing="1.5">
              BONUS
            </text>
          </svg>
        );

      case 'COIN':
        return (
          <svg viewBox="0 0 100 100" className="w-full h-full drop-shadow-md animate-glow-pulse">
            <defs>
              <radialGradient id="coinGrad" cx="40%" cy="35%" r="65%">
                <stop offset="0%" stopColor="#FFF8DB" />
                <stop offset="35%" stopColor="#F59E0B" />
                <stop offset="75%" stopColor="#B45309" />
                <stop offset="100%" stopColor="#78350F" />
              </radialGradient>
            </defs>
            {/* Outer Orb glow */}
            <circle cx="50" cy="50" r="42" fill="url(#coinGrad)" stroke="#FDE047" strokeWidth="3" />
            <circle cx="50" cy="50" r="35" fill="none" stroke="#FEF08A" strokeWidth="1.5" strokeDasharray="4 2" />
            {/* Dollar / Cash Symbol */}
            <text x="50" y="44" textAnchor="middle" fill="#FFF" fontWeight="900" fontSize="18" className="drop-shadow">
              CASH
            </text>
            <text x="50" y="65" textAnchor="middle" fill="#FEF08A" fontWeight="900" fontSize="16">
              LINK
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
            <polygon points="22,35 78,35 66,15 34,15" fill="url(#diaTop)" stroke="#BAE6FD" strokeWidth="1.5" />
            <polygon points="34,15 50,35 22,35" fill="#7DD3FC" opacity="0.9" stroke="#BAE6FD" strokeWidth="1" />
            <polygon points="50,35 66,15 78,35" fill="#7DD3FC" opacity="0.9" stroke="#BAE6FD" strokeWidth="1" />
            <polygon points="34,15 50,35 66,15" fill="#F0F9FF" opacity="0.95" stroke="#BAE6FD" strokeWidth="1" />
            <polygon points="22,35 78,35 50,88" fill="url(#diaBottom)" stroke="#38BDF8" strokeWidth="1.5" />
            <circle cx="38" cy="25" r="2.5" fill="#FFF" />
            {/* Glistening Specular Star Flare */}
            <polygon points="50,15 52,22 59,24 52,26 50,33 48,26 41,24 48,22" fill="#FFFFFF" />
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
            {/* Licking Flames */}
            <path d="M22 18 Q30 4 40 18 Q50 2 60 18 Q70 5 78 18 Z" fill="#F59E0B" opacity="0.85" />
            <path
              d="M20 18 L80 18 L80 32 L54 84 L34 84 L58 35 L20 35 Z"
              fill="url(#sevenGrad)"
              stroke="#FBBF24"
              strokeWidth="3.5"
              strokeLinejoin="round"
            />
            <path d="M26 23 L74 23 L54 62 L42 62 L60 29 L26 29 Z" fill="#F87171" opacity="0.8" />
            <polygon points="75,20 77,24 81,25 77,26 75,30 73,26 69,25 73,24" fill="#FFFFFF" />
          </svg>
        );

      case 'GOLDBAR':
        return (
          <svg viewBox="0 0 100 100" className="w-full h-full drop-shadow-md">
            <defs>
              <linearGradient id="barGold" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#FFFBEB" />
                <stop offset="30%" stopColor="#FBBF24" />
                <stop offset="70%" stopColor="#D97706" />
                <stop offset="100%" stopColor="#78350F" />
              </linearGradient>
            </defs>
            {/* Bottom Bar */}
            <polygon points="20,68 80,68 70,82 10,82" fill="url(#barGold)" stroke="#FEF08A" strokeWidth="1.5" />
            {/* Top Bar */}
            <polygon points="30,42 90,42 80,56 20,56" fill="url(#barGold)" stroke="#FEF08A" strokeWidth="1.5" />
            {/* Center Bar */}
            <polygon points="25,22 85,22 75,36 15,36" fill="url(#barGold)" stroke="#FEF08A" strokeWidth="1.5" />
            <text x="50" y="32" textAnchor="middle" fill="#78350F" fontWeight="900" fontSize="8">
              999.9 GOLD
            </text>
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
            <path d="M42 22 C42 16, 58 16, 58 22" fill="none" stroke="#FDE047" strokeWidth="4" />
            <path d="M48 22 C34 24, 25 45, 18 68 L82 68 C75 45, 66 24, 52 22 Z" fill="url(#bellGrad)" stroke="#FFF" strokeWidth="1.5" />
            <rect x="14" y="68" width="72" height="10" rx="5" fill="#CA8A04" stroke="#FEF08A" strokeWidth="2" />
            <circle cx="50" cy="83" r="8" fill="#713F12" stroke="#FDE047" strokeWidth="2" />
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
            <path d="M20 22 C20 68, 80 68, 80 22 L65 22 C65 52, 35 52, 35 22 Z" fill="url(#shoeGrad)" stroke="#F3E8FF" strokeWidth="2" />
            <rect x="16" y="16" width="18" height="8" rx="2" fill="#C084FC" stroke="#FFF" strokeWidth="1" />
            <rect x="66" y="16" width="18" height="8" rx="2" fill="#C084FC" stroke="#FFF" strokeWidth="1" />
            <circle cx="28" cy="35" r="2.5" fill="#1E1B4B" />
            <circle cx="29" cy="48" r="2.5" fill="#1E1B4B" />
            <circle cx="72" cy="35" r="2.5" fill="#1E1B4B" />
            <circle cx="71" cy="48" r="2.5" fill="#1E1B4B" />
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
            <path d="M15 45 C15 88, 85 88, 85 45 Z" fill="url(#rindGrad)" stroke="#86EFAC" strokeWidth="2" />
            <path d="M20 45 C20 82, 80 82, 80 45 Z" fill="#DCFCE7" />
            <path d="M24 45 C24 77, 76 77, 76 45 Z" fill="#EF4444" />
            <ellipse cx="38" cy="53" rx="2" ry="3.5" fill="#18181B" transform="rotate(-15 38 53)" />
            <ellipse cx="50" cy="62" rx="2" ry="3.5" fill="#18181B" />
            <ellipse cx="62" cy="53" rx="2" ry="3.5" fill="#18181B" transform="rotate(15 62 53)" />
          </svg>
        );

      case 'GRAPES':
        return (
          <svg viewBox="0 0 100 100" className="w-full h-full drop-shadow-md">
            <defs>
              <radialGradient id="grapeGrad" cx="35%" cy="30%" r="65%">
                <stop offset="0%" stopColor="#D8B4FE" />
                <stop offset="40%" stopColor="#9333EA" />
                <stop offset="100%" stopColor="#581C87" />
              </radialGradient>
            </defs>
            <path d="M50 20 C56 10, 70 12, 65 22 Z" fill="#22C55E" stroke="#15803D" strokeWidth="1" />
            <path d="M50 22 C50 16, 46 12, 42 10" fill="none" stroke="#78350F" strokeWidth="2.5" strokeLinecap="round" />
            {/* Top row */}
            <circle cx="36" cy="36" r="10" fill="url(#grapeGrad)" stroke="#E9D5FF" strokeWidth="1" />
            <circle cx="50" cy="34" r="10" fill="url(#grapeGrad)" stroke="#E9D5FF" strokeWidth="1" />
            <circle cx="64" cy="36" r="10" fill="url(#grapeGrad)" stroke="#E9D5FF" strokeWidth="1" />
            {/* Middle row */}
            <circle cx="43" cy="50" r="10" fill="url(#grapeGrad)" stroke="#E9D5FF" strokeWidth="1" />
            <circle cx="57" cy="50" r="10" fill="url(#grapeGrad)" stroke="#E9D5FF" strokeWidth="1" />
            {/* Bottom row */}
            <circle cx="50" cy="65" r="10" fill="url(#grapeGrad)" stroke="#E9D5FF" strokeWidth="1" />
          </svg>
        );

      case 'ACE':
        return (
          <svg viewBox="0 0 100 100" className="w-full h-full drop-shadow-md">
            <rect x="18" y="12" width="64" height="76" rx="8" fill="#1E293B" stroke="#F59E0B" strokeWidth="2.5" />
            <text x="50" y="58" textAnchor="middle" fill="#FDE047" fontWeight="900" fontSize="38" className="drop-shadow">
              A
            </text>
            <path d="M50 68 C45 74, 40 76, 40 80 C40 83, 44 85, 47 84 L46 87 L54 87 L53 84 C56 85, 60 83, 60 80 C60 76, 55 74, 50 68 Z" fill="#F59E0B" />
          </svg>
        );

      case 'KING':
        return (
          <svg viewBox="0 0 100 100" className="w-full h-full drop-shadow-md">
            <rect x="18" y="12" width="64" height="76" rx="8" fill="#1E293B" stroke="#EC4899" strokeWidth="2.5" />
            <text x="50" y="60" textAnchor="middle" fill="#F472B6" fontWeight="900" fontSize="38" className="drop-shadow">
              K
            </text>
            <polygon points="42,20 46,25 50,18 54,25 58,20 56,28 44,28" fill="#F472B6" />
          </svg>
        );

      case 'QUEEN':
        return (
          <svg viewBox="0 0 100 100" className="w-full h-full drop-shadow-md">
            <rect x="18" y="12" width="64" height="76" rx="8" fill="#1E293B" stroke="#8B5CF6" strokeWidth="2.5" />
            <text x="50" y="60" textAnchor="middle" fill="#A78BFA" fontWeight="900" fontSize="38" className="drop-shadow">
              Q
            </text>
            <circle cx="50" cy="22" r="3.5" fill="#A78BFA" />
          </svg>
        );

      case 'JACK':
        return (
          <svg viewBox="0 0 100 100" className="w-full h-full drop-shadow-md">
            <rect x="18" y="12" width="64" height="76" rx="8" fill="#1E293B" stroke="#06B6D4" strokeWidth="2.5" />
            <text x="50" y="60" textAnchor="middle" fill="#67E8F9" fontWeight="900" fontSize="38" className="drop-shadow">
              J
            </text>
            <circle cx="50" cy="22" r="3.5" fill="#67E8F9" />
          </svg>
        );

      case 'CHERRY':
        return (
          <svg viewBox="0 0 100 100" className="w-full h-full drop-shadow-md">
            <path d="M40 50 C40 25, 60 18, 70 20" fill="none" stroke="#65A30D" strokeWidth="3" strokeLinecap="round" />
            <path d="M60 52 C55 35, 62 25, 70 20" fill="none" stroke="#65A30D" strokeWidth="3" strokeLinecap="round" />
            <path d="M68 20 C78 16, 85 22, 78 28 Z" fill="#84CC16" />
            <circle cx="36" cy="62" r="15" fill="#E11D48" stroke="#FDA4AF" strokeWidth="1.5" />
            <circle cx="32" cy="56" r="4" fill="#FFF" opacity="0.6" />
            <circle cx="62" cy="64" r="15" fill="#BE123C" stroke="#FDA4AF" strokeWidth="1.5" />
            <circle cx="58" cy="58" r="4" fill="#FFF" opacity="0.6" />
          </svg>
        );

      case 'PLUM':
        return (
          <svg viewBox="0 0 100 100" className="w-full h-full drop-shadow-md">
            <path d="M50 24 C50 16, 56 12, 58 10" fill="none" stroke="#78350F" strokeWidth="3" strokeLinecap="round" />
            <path d="M54 16 C62 10, 72 16, 64 22 Z" fill="#22C55E" />
            <ellipse cx="50" cy="55" rx="26" ry="30" fill="#7E22CE" stroke="#D8B4FE" strokeWidth="2" />
            <ellipse cx="42" cy="46" rx="6" ry="10" fill="#FFF" opacity="0.4" />
          </svg>
        );

      default:
        return null;
    }
  };

  return (
    <div
      className={`relative w-full h-full flex items-center justify-center p-1 transition-transform duration-200 ${
        isWinning ? 'scale-105 z-10 filter drop-shadow-[0_0_15px_rgba(251,191,36,0.9)] animate-pulse-fast' : ''
      } ${
        isScatterHighlight ? 'scale-110 z-10 filter drop-shadow-[0_0_20px_rgba(0,240,255,0.9)] animate-bounce-soft' : ''
      } ${className}`}
    >
      {isWinning && (
        <>
          <div className="absolute top-0 right-1 text-xs animate-spin pointer-events-none select-none">✨</div>
          <div className="absolute bottom-0 left-1 text-[10px] animate-ping pointer-events-none select-none">⭐</div>
        </>
      )}
      {getSymbolSvg()}
    </div>
  );
};
