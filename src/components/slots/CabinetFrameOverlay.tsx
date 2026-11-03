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
  const isPs2 = activeGameId === 'ps2-legends';

  // =========================================================================
  // --- VERSION D: PLAYSTATION 2 (AUTHENTIC CONSOLE BADGES & LED HARDWARE) ---
  // =========================================================================
  if (isPs2) {
    return (
      <div className="absolute inset-0 pointer-events-none z-30 overflow-visible select-none">
        {/* Top-Left PlayStation Family Logo Badge */}
        <div className="absolute -top-3 -left-3 w-16 sm:w-20 h-16 sm:h-20">
          <svg viewBox="0 0 80 80" className="w-full h-full drop-shadow-[0_4px_12px_rgba(0,111,205,0.8)]">
            {/* Matte chassis bracket */}
            <path
              d="M0 0 L56 0 L56 16 L20 16 L20 56 L0 56 Z"
              fill="#060913"
              stroke="#006FCD"
              strokeWidth="1.5"
            />
            {/* Ribbed vent accents */}
            <line x1="6" y1="6" x2="48" y2="6" stroke="#006FCD" strokeWidth="1" strokeDasharray="3 2" />
            <line x1="6" y1="10" x2="48" y2="10" stroke="#006FCD" strokeWidth="1" strokeDasharray="3 2" />
            {/* PlayStation Family Logo */}
            <g transform="translate(14, 18) scale(0.65)">
              {/* Upright Red P */}
              <path d="M12 2 L20 2 C26 2 28 6 28 12 C28 18 24 22 18 22 L12 22 Z" fill="#EF4444" />
              <path d="M16 6 L18 6 C21 6 23 8 23 12 C23 16 21 18 18 18 L16 18 Z" fill="#060913" />
              {/* Horizontal Yellow/Green S */}
              <path d="M6 24 C14 20 28 20 34 24 C38 27 34 30 26 31 C16 32 10 34 10 38 C10 43 20 44 28 42 L26 46 C16 48 4 47 4 40 C4 35 12 32 20 31 C28 30 32 28 30 26 C28 24 16 24 8 28 Z" fill="#38BDF8" opacity="0.9" />
              <path d="M12 32 C16 30 26 30 30 32 L28 34 C24 33 16 33 12 34 Z" fill="#22C55E" />
              <path d="M8 26 L12 24 L14 28 L10 30 Z" fill="#EAB308" />
            </g>
          </svg>
        </div>

        {/* Top-Right Power & Eject Buttons with Dual LED Indicators */}
        <div className="absolute -top-3 -right-3 w-16 sm:w-20 h-16 sm:h-20 transform -scale-x-100">
          <svg viewBox="0 0 80 80" className="w-full h-full drop-shadow-[0_4px_12px_rgba(0,111,205,0.8)]">
            <path
              d="M0 0 L56 0 L56 16 L20 16 L20 56 L0 56 Z"
              fill="#060913"
              stroke="#006FCD"
              strokeWidth="1.5"
            />
            <line x1="6" y1="6" x2="48" y2="6" stroke="#006FCD" strokeWidth="1" strokeDasharray="3 2" />
            <line x1="6" y1="10" x2="48" y2="10" stroke="#006FCD" strokeWidth="1" strokeDasharray="3 2" />
            {/* Green Power LED */}
            <circle cx="26" cy="24" r="3" fill="#22C55E" className={isSpinning ? 'animate-ping' : ''} />
            <circle cx="26" cy="24" r="2" fill="#86EFAC" />
            {/* Blue Eject LED */}
            <circle cx="38" cy="24" r="3" fill="#006FCD" />
            <circle cx="38" cy="24" r="1.8" fill="#38BDF8" className="animate-pulse" />
          </svg>
        </div>

        {/* Bottom-Left Controller Port 1 & Memory Card Slot */}
        <div className="absolute -bottom-3 -left-3 w-16 sm:w-20 h-16 sm:h-20 transform -scale-y-100">
          <svg viewBox="0 0 80 80" className="w-full h-full drop-shadow-[0_4px_12px_rgba(0,111,205,0.8)]">
            <path
              d="M0 0 L56 0 L56 16 L20 16 L20 56 L0 56 Z"
              fill="#060913"
              stroke="#006FCD"
              strokeWidth="1.5"
            />
            {/* Memory card flap slot */}
            <rect x="8" y="6" width="38" height="6" fill="#02040a" stroke="#006FCD" strokeWidth="0.8" />
            <line x1="12" y1="9" x2="42" y2="9" stroke="#38BDF8" strokeWidth="0.6" opacity="0.6" />
          </svg>
        </div>

        {/* Bottom-Right Dual USB 1.1 & S400 i.LINK Jacks */}
        <div className="absolute -bottom-3 -right-3 w-16 sm:w-20 h-16 sm:h-20 transform -scale-x-100 -scale-y-100">
          <svg viewBox="0 0 80 80" className="w-full h-full drop-shadow-[0_4px_12px_rgba(0,111,205,0.8)]">
            <path
              d="M0 0 L56 0 L56 16 L20 16 L20 56 L0 56 Z"
              fill="#060913"
              stroke="#006FCD"
              strokeWidth="1.5"
            />
            {/* USB port silhouettes */}
            <rect x="10" y="6" width="14" height="6" fill="#02040a" stroke="#006FCD" strokeWidth="0.8" />
            <rect x="28" y="6" width="14" height="6" fill="#02040a" stroke="#006FCD" strokeWidth="0.8" />
          </svg>
        </div>
      </div>
    );
  }

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
