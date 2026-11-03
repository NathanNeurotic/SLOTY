import React from 'react';
import type { GameId } from '../../games/types';

interface CabinetFrameOverlayProps {
  activeGameId?: GameId;
  isSpinning?: boolean;
  isFeverMode?: boolean;
}

export const CabinetFrameOverlay: React.FC<CabinetFrameOverlayProps> = ({
  activeGameId = 'vault-24k',
  isSpinning = false,
}) => {
  const isTimber = activeGameId === 'timber-critters';
  const isPixel = activeGameId === 'pixel-arcade';

  // =========================================================================
  // --- VERSION A: TIMBERLAND CRITTERS (BLACKSMITH HAND-FORGED IRON BRACKETS) ---
  // =========================================================================
  if (isTimber) {
    return (
      <div className="absolute inset-0 pointer-events-none z-30 overflow-visible select-none">
        {/* Top-Left Wrought Iron Bracket */}
        <div className="absolute -top-2 -left-2 w-14 sm:w-18 h-14 sm:h-18">
          <svg viewBox="0 0 72 72" className="w-full h-full drop-shadow-[2px_4px_8px_rgba(0,0,0,0.95)]">
            <path
              d="M0 0 L48 0 C48 10 36 14 26 14 L14 14 L14 26 C14 36 10 48 0 48 Z"
              fill="#18110B"
              stroke="#5c2b09"
              strokeWidth="2.5"
            />
            <path d="M4 4 L44 4 L24 10 L10 10 L10 24 L4 44 Z" fill="#2d170b" opacity="0.6" />
            <rect x="7" y="7" width="4.5" height="4.5" fill="#a16207" stroke="#000" strokeWidth="1" transform="rotate(15 9 9)" />
            <rect x="28" y="5" width="4" height="4" fill="#a16207" stroke="#000" strokeWidth="1" />
            <rect x="5" y="28" width="4" height="4" fill="#a16207" stroke="#000" strokeWidth="1" />
            <circle cx="15" cy="15" r="3" fill="#15803d" opacity="0.8" />
            <circle cx="18" cy="13" r="2" fill="#22c55e" opacity="0.7" />
          </svg>
        </div>

        {/* Top-Right Wrought Iron Bracket */}
        <div className="absolute -top-2 -right-2 w-14 sm:w-18 h-14 sm:h-18 transform -scale-x-100">
          <svg viewBox="0 0 72 72" className="w-full h-full drop-shadow-[2px_4px_8px_rgba(0,0,0,0.95)]">
            <path
              d="M0 0 L48 0 C48 10 36 14 26 14 L14 14 L14 26 C14 36 10 48 0 48 Z"
              fill="#18110B"
              stroke="#5c2b09"
              strokeWidth="2.5"
            />
            <path d="M4 4 L44 4 L24 10 L10 10 L10 24 L4 44 Z" fill="#2d170b" opacity="0.6" />
            <rect x="7" y="7" width="4.5" height="4.5" fill="#a16207" stroke="#000" strokeWidth="1" transform="rotate(15 9 9)" />
            <rect x="28" y="5" width="4" height="4" fill="#a16207" stroke="#000" strokeWidth="1" />
            <rect x="5" y="28" width="4" height="4" fill="#a16207" stroke="#000" strokeWidth="1" />
            <circle cx="15" cy="15" r="3" fill="#15803d" opacity="0.8" />
          </svg>
        </div>

        {/* Bottom-Left Wrought Iron Bracket */}
        <div className="absolute -bottom-2 -left-2 w-14 sm:w-18 h-14 sm:h-18 transform -scale-y-100">
          <svg viewBox="0 0 72 72" className="w-full h-full drop-shadow-[2px_4px_8px_rgba(0,0,0,0.95)]">
            <path
              d="M0 0 L48 0 C48 10 36 14 26 14 L14 14 L14 26 C14 36 10 48 0 48 Z"
              fill="#18110B"
              stroke="#5c2b09"
              strokeWidth="2.5"
            />
            <path d="M4 4 L44 4 L24 10 L10 10 L10 24 L4 44 Z" fill="#2d170b" opacity="0.6" />
            <rect x="7" y="7" width="4.5" height="4.5" fill="#a16207" stroke="#000" strokeWidth="1" transform="rotate(15 9 9)" />
            <rect x="28" y="5" width="4" height="4" fill="#a16207" stroke="#000" strokeWidth="1" />
            <rect x="5" y="28" width="4" height="4" fill="#a16207" stroke="#000" strokeWidth="1" />
          </svg>
        </div>

        {/* Bottom-Right Wrought Iron Bracket */}
        <div className="absolute -bottom-2 -right-2 w-14 sm:w-18 h-14 sm:h-18 transform -scale-x-100 -scale-y-100">
          <svg viewBox="0 0 72 72" className="w-full h-full drop-shadow-[2px_4px_8px_rgba(0,0,0,0.95)]">
            <path
              d="M0 0 L48 0 C48 10 36 14 26 14 L14 14 L14 26 C14 36 10 48 0 48 Z"
              fill="#18110B"
              stroke="#5c2b09"
              strokeWidth="2.5"
            />
            <path d="M4 4 L44 4 L24 10 L10 10 L10 24 L4 44 Z" fill="#2d170b" opacity="0.6" />
            <rect x="7" y="7" width="4.5" height="4.5" fill="#a16207" stroke="#000" strokeWidth="1" transform="rotate(15 9 9)" />
            <rect x="28" y="5" width="4" height="4" fill="#a16207" stroke="#000" strokeWidth="1" />
            <rect x="5" y="28" width="4" height="4" fill="#a16207" stroke="#000" strokeWidth="1" />
          </svg>
        </div>
      </div>
    );
  }

  // =========================================================================
  // --- VERSION B: PIXEL ARCADE (MOLDED COIN-OP CRT BEZEL & NEON CAPS) ---
  // =========================================================================
  if (isPixel) {
    return (
      <div className="absolute inset-0 pointer-events-none z-30 overflow-visible select-none">
        {/* Top-Left Neon Cyber Corner Cap */}
        <div className="absolute -top-3 -left-3 w-16 sm:w-20 h-16 sm:h-20">
          <svg viewBox="0 0 80 80" className="w-full h-full drop-shadow-[0_0_15px_rgba(236,72,153,0.8)]">
            <defs>
              <linearGradient id="neonCornerPink" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#F43F5E" />
                <stop offset="50%" stopColor="#EC4899" />
                <stop offset="100%" stopColor="#8B5CF6" />
              </linearGradient>
            </defs>
            {/* Molded Cyber Corner Plaque */}
            <path d="M0 0 L56 0 L56 14 L20 14 L20 56 L0 56 Z" fill="url(#neonCornerPink)" stroke="#FFF" strokeWidth="1.5" />
            <rect x="4" y="4" width="8" height="8" rx="2" fill="#06B6D4" stroke="#FFF" strokeWidth="1" className={isSpinning ? 'animate-ping' : ''} />
            <circle cx="36" cy="7" r="3" fill="#1E1B4B" stroke="#06B6D4" strokeWidth="1" />
            <circle cx="7" cy="36" r="3" fill="#1E1B4B" stroke="#06B6D4" strokeWidth="1" />
          </svg>
        </div>

        {/* Top-Right Neon Cyber Corner Cap */}
        <div className="absolute -top-3 -right-3 w-16 sm:w-20 h-16 sm:h-20 transform -scale-x-100">
          <svg viewBox="0 0 80 80" className="w-full h-full drop-shadow-[0_0_15px_rgba(236,72,153,0.8)]">
            <path d="M0 0 L56 0 L56 14 L20 14 L20 56 L0 56 Z" fill="url(#neonCornerPink)" stroke="#FFF" strokeWidth="1.5" />
            <rect x="4" y="4" width="8" height="8" rx="2" fill="#06B6D4" stroke="#FFF" strokeWidth="1" className={isSpinning ? 'animate-ping' : ''} />
            <circle cx="36" cy="7" r="3" fill="#1E1B4B" stroke="#06B6D4" strokeWidth="1" />
            <circle cx="7" cy="36" r="3" fill="#1E1B4B" stroke="#06B6D4" strokeWidth="1" />
          </svg>
        </div>

        {/* Bottom-Left Neon Cyber Corner Cap */}
        <div className="absolute -bottom-3 -left-3 w-16 sm:w-20 h-16 sm:h-20 transform -scale-y-100">
          <svg viewBox="0 0 80 80" className="w-full h-full drop-shadow-[0_0_15px_rgba(236,72,153,0.8)]">
            <path d="M0 0 L56 0 L56 14 L20 14 L20 56 L0 56 Z" fill="url(#neonCornerPink)" stroke="#FFF" strokeWidth="1.5" />
            <rect x="4" y="4" width="8" height="8" rx="2" fill="#06B6D4" stroke="#FFF" strokeWidth="1" />
            <circle cx="36" cy="7" r="3" fill="#1E1B4B" stroke="#06B6D4" strokeWidth="1" />
            <circle cx="7" cy="36" r="3" fill="#1E1B4B" stroke="#06B6D4" strokeWidth="1" />
          </svg>
        </div>

        {/* Bottom-Right Neon Cyber Corner Cap */}
        <div className="absolute -bottom-3 -right-3 w-16 sm:w-20 h-16 sm:h-20 transform -scale-x-100 -scale-y-100">
          <svg viewBox="0 0 80 80" className="w-full h-full drop-shadow-[0_0_15px_rgba(236,72,153,0.8)]">
            <path d="M0 0 L56 0 L56 14 L20 14 L20 56 L0 56 Z" fill="url(#neonCornerPink)" stroke="#FFF" strokeWidth="1.5" />
            <rect x="4" y="4" width="8" height="8" rx="2" fill="#06B6D4" stroke="#FFF" strokeWidth="1" />
            <circle cx="36" cy="7" r="3" fill="#1E1B4B" stroke="#06B6D4" strokeWidth="1" />
            <circle cx="7" cy="36" r="3" fill="#1E1B4B" stroke="#06B6D4" strokeWidth="1" />
          </svg>
        </div>

        {/* Arcade Cabinet Illuminated Coin Reject Buttons on Sides */}
        <div className="absolute top-1/3 -left-3.5 hidden sm:flex flex-col space-y-3 pointer-events-none">
          <div className="w-3.5 h-10 rounded-sm bg-black border border-orange-500 shadow-[0_0_8px_#F97316] flex items-center justify-center">
            <span className="text-[7px] text-orange-400 font-mono font-black -rotate-90">25¢</span>
          </div>
        </div>
        <div className="absolute top-1/3 -right-3.5 hidden sm:flex flex-col space-y-3 pointer-events-none">
          <div className="w-3.5 h-10 rounded-sm bg-black border border-cyan-500 shadow-[0_0_8px_#06B6D4] flex items-center justify-center">
            <span className="text-[7px] text-cyan-300 font-mono font-black rotate-90">1UP</span>
          </div>
        </div>
      </div>
    );
  }

  // =========================================================================
  // --- VERSION C: 24K GOLD VAULT (DIE-CAST BRASS & ART-DECO CHROME ACCENTS) ---
  // =========================================================================
  return (
    <div className="absolute inset-0 pointer-events-none z-30 overflow-visible select-none">
      {/* Top-Left Polished Brass Art-Deco Corner Cap */}
      <div className="absolute -top-2.5 -left-2.5 w-16 sm:w-20 h-16 sm:h-20">
        <svg viewBox="0 0 80 80" className="w-full h-full drop-shadow-[0_4px_12px_rgba(0,0,0,0.95)]">
          <defs>
            <linearGradient id="cornerBrassGold" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#FFFBEB" />
              <stop offset="35%" stopColor="#F59E0B" />
              <stop offset="70%" stopColor="#D97706" />
              <stop offset="100%" stopColor="#78350F" />
            </linearGradient>
            <linearGradient id="cornerChrome" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#FFFFFF" />
              <stop offset="50%" stopColor="#94A3B8" />
              <stop offset="100%" stopColor="#334155" />
            </linearGradient>
          </defs>

          {/* Stepped Art-Deco Corner Bracket */}
          <path
            d="M0 0 L56 0 L56 16 L22 16 L22 56 L0 56 Z"
            fill="url(#cornerBrassGold)"
            stroke="#FEF08A"
            strokeWidth="1.5"
          />
          <path d="M6 6 L48 6 L48 10 L10 10 L10 48 L6 48 Z" fill="url(#cornerChrome)" />
          <circle cx="16" cy="8" r="3" fill="#1E293B" stroke="#FDE047" strokeWidth="1" />
          <circle cx="36" cy="8" r="3" fill="#1E293B" stroke="#FDE047" strokeWidth="1" />
          <circle cx="8" cy="26" r="3" fill="#1E293B" stroke="#FDE047" strokeWidth="1" />
          <circle cx="8" cy="44" r="3" fill="#1E293B" stroke="#FDE047" strokeWidth="1" />
          <polygon points="16,16 26,20 22,30 12,26" fill="#10B981" stroke="#A7F3D0" strokeWidth="1" className={isSpinning ? 'animate-pulse' : ''} />
        </svg>
      </div>

      {/* Top-Right Polished Brass Corner Cap */}
      <div className="absolute -top-2.5 -right-2.5 w-16 sm:w-20 h-16 sm:h-20 transform -scale-x-100">
        <svg viewBox="0 0 80 80" className="w-full h-full drop-shadow-[0_4px_12px_rgba(0,0,0,0.95)]">
          <path
            d="M0 0 L56 0 L56 16 L22 16 L22 56 L0 56 Z"
            fill="url(#cornerBrassGold)"
            stroke="#FEF08A"
            strokeWidth="1.5"
          />
          <path d="M6 6 L48 6 L48 10 L10 10 L10 48 L6 48 Z" fill="url(#cornerChrome)" />
          <circle cx="16" cy="8" r="3" fill="#1E293B" stroke="#FDE047" strokeWidth="1" />
          <circle cx="36" cy="8" r="3" fill="#1E293B" stroke="#FDE047" strokeWidth="1" />
          <circle cx="8" cy="26" r="3" fill="#1E293B" stroke="#FDE047" strokeWidth="1" />
          <circle cx="8" cy="44" r="3" fill="#1E293B" stroke="#FDE047" strokeWidth="1" />
          <polygon points="16,16 26,20 22,30 12,26" fill="#10B981" stroke="#A7F3D0" strokeWidth="1" className={isSpinning ? 'animate-pulse' : ''} />
        </svg>
      </div>

      {/* Bottom-Left Polished Brass Corner Cap */}
      <div className="absolute -bottom-2.5 -left-2.5 w-16 sm:w-20 h-16 sm:h-20 transform -scale-y-100">
        <svg viewBox="0 0 80 80" className="w-full h-full drop-shadow-[0_4px_12px_rgba(0,0,0,0.95)]">
          <path
            d="M0 0 L56 0 L56 16 L22 16 L22 56 L0 56 Z"
            fill="url(#cornerBrassGold)"
            stroke="#FEF08A"
            strokeWidth="1.5"
          />
          <path d="M6 6 L48 6 L48 10 L10 10 L10 48 L6 48 Z" fill="url(#cornerChrome)" />
          <circle cx="16" cy="8" r="3" fill="#1E293B" stroke="#FDE047" strokeWidth="1" />
          <circle cx="36" cy="8" r="3" fill="#1E293B" stroke="#FDE047" strokeWidth="1" />
          <circle cx="8" cy="26" r="3" fill="#1E293B" stroke="#FDE047" strokeWidth="1" />
          <circle cx="8" cy="44" r="3" fill="#1E293B" stroke="#FDE047" strokeWidth="1" />
        </svg>
      </div>

      {/* Bottom-Right Polished Brass Corner Cap */}
      <div className="absolute -bottom-2.5 -right-2.5 w-16 sm:w-20 h-16 sm:h-20 transform -scale-x-100 -scale-y-100">
        <svg viewBox="0 0 80 80" className="w-full h-full drop-shadow-[0_4px_12px_rgba(0,0,0,0.95)]">
          <path
            d="M0 0 L56 0 L56 16 L22 16 L22 56 L0 56 Z"
            fill="url(#cornerBrassGold)"
            stroke="#FEF08A"
            strokeWidth="1.5"
          />
          <path d="M6 6 L48 6 L48 10 L10 10 L10 48 L6 48 Z" fill="url(#cornerChrome)" />
          <circle cx="16" cy="8" r="3" fill="#1E293B" stroke="#FDE047" strokeWidth="1" />
          <circle cx="36" cy="8" r="3" fill="#1E293B" stroke="#FDE047" strokeWidth="1" />
          <circle cx="8" cy="26" r="3" fill="#1E293B" stroke="#FDE047" strokeWidth="1" />
          <circle cx="8" cy="44" r="3" fill="#1E293B" stroke="#FDE047" strokeWidth="1" />
        </svg>
      </div>
    </div>
  );
};
