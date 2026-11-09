import React, { useState, useEffect, useRef } from 'react';
import { soundManager } from '../../audio/soundManager';
import { Gamepad2, Disc, Save, Zap } from 'lucide-react';

export type VanceState = 'idle' | 'spinning' | 'anticipation' | 'win' | 'bigwin' | 'fever';

interface VectorVanceProps {
  isSpinning: boolean;
  isAnticipating: boolean;
  isWinning: boolean;
  isBigWin?: boolean;
  isFeverMode?: boolean;
  winAmount?: number;
  onRewardCoins?: (amount: number) => void;
  variant?: 'full' | 'compact';
}

const PS2_IDLE_QUOTES = [
  'Emotion Engine 128-bit pipeline initialized at 294 MHz.',
  'Reading Memory Card (8MB) in Slot 1... All save blocks verified.',
  'DualShock 2 pressure sensitivity calibrated on all 12 buttons.',
  'PlayStation 2 BIOS Version 1.00 online. Ready for spin cycle.',
  'Hit 3 DVD Discs for 15 Free Spins at 2X Emotion Engine clock speed!',
  'Lock 6 Memory Cards to initiate the 8MB Hold & Spin Respin!',
];

const PS2_SPIN_QUOTES = [
  'VU0 and VU1 executing parallel vector transforms!',
  'Spin cycle engaged! High-bandwidth DMA bus at 3.2 GB/s!',
  'Reading optical disc... No read errors detected!',
  'Sub-pixel rasterizer tracking active paylines!',
  '128-bit integer pipeline rolling at full throttle!',
];

const PS2_ANTICIPATION_QUOTES = [
  'OPTICAL LASER SEEK! TWO BLUE DISCS FOUND! NEED 1 MORE!',
  'BIOS WARNING: 3RD DVD SCATTER SEEK IN PROGRESS!',
  'HOLD YOUR DUALSHOCK! 15 FREE SPINS ON THE LINE!',
  'CRITICAL VECTOR: 3RD SCATTER TRAIN SCANNING!',
];

const PS2_WIN_QUOTES = [
  'PAYLINE CONFIRMED! CREDITS CACHED TO MEMORY CARD!',
  '128-BIT GRAPHICS SYNTHESIZER PAYOUT DELIVERED!',
  'LEVEL CLEAR! DUALSHOCK 2 MOTORS RUMBLING!',
  'SYSTEM HIT! CREDITS TRANSFERRED TO USER CACHE!',
  'CLEAN RASTER! VECTOR UNIT 0 DELIVERED MAXIMUM PAYOUT!',
];

const PS2_BIG_WIN_QUOTES = [
  'ALL-TIME RECORD WRITTEN TO 8MB MEMORY CARD!',
  'MAXIMUM OVERCLOCK! 6.2 GFLOPS EMOTION ENGINE SURGE!',
  'TITANIC WIN! GRAPHICS SYNTHESIZER VRAM OVERFLOWING!',
  'MASSIVE HIT! MAXIMUM FORCE FEEDBACK ENGAGED!',
];

const PS2_FEVER_QUOTES = [
  'OVERCLOCK FEVER: 2X EMOTION ENGINE BUS MULTIPLIER!',
  'SUPERCHARGED 294 MHz RUNTIME! ALL WINS DOUBLED!',
];

export const VectorVance: React.FC<VectorVanceProps> = ({
  isSpinning,
  isAnticipating,
  isWinning,
  isBigWin = false,
  isFeverMode = false,
  winAmount: _winAmount = 0,
  onRewardCoins,
  variant = 'full',
}) => {
  const [currentQuote, setCurrentQuote] = useState<string>(PS2_IDLE_QUOTES[0]);
  const [isTapped, setIsTapped] = useState<boolean>(false);
  const [tapBonusText, setTapBonusText] = useState<string | null>(null);
  const quoteTimerRef = useRef<number | null>(null);

  // Compute active mascot emotional state
  const mascotState: VanceState = isFeverMode
    ? 'fever'
    : isBigWin
    ? 'bigwin'
    : isWinning
    ? 'win'
    : isAnticipating
    ? 'anticipation'
    : isSpinning
    ? 'spinning'
    : 'idle';

  // React to slot gameplay events with voice lines and sound effects
  useEffect(() => {
    if (tapBonusText) return;

    if (mascotState === 'bigwin') {
      const q = PS2_BIG_WIN_QUOTES[Math.floor(Math.random() * PS2_BIG_WIN_QUOTES.length)];
      setCurrentQuote(q);
      soundManager.playPs2Scatter(3);
    } else if (mascotState === 'win') {
      const q = PS2_WIN_QUOTES[Math.floor(Math.random() * PS2_WIN_QUOTES.length)];
      setCurrentQuote(q);
    } else if (mascotState === 'anticipation') {
      const q = PS2_ANTICIPATION_QUOTES[Math.floor(Math.random() * PS2_ANTICIPATION_QUOTES.length)];
      setCurrentQuote(q);
    } else if (mascotState === 'spinning') {
      const q = PS2_SPIN_QUOTES[Math.floor(Math.random() * PS2_SPIN_QUOTES.length)];
      setCurrentQuote(q);
    } else if (mascotState === 'fever') {
      const q = PS2_FEVER_QUOTES[Math.floor(Math.random() * PS2_FEVER_QUOTES.length)];
      setCurrentQuote(q);
    }
  }, [mascotState, tapBonusText]);

  // Periodic ambient dialogue rotation during idle periods
  useEffect(() => {
    if (mascotState === 'idle') {
      quoteTimerRef.current = window.setInterval(() => {
        const nextQuote = PS2_IDLE_QUOTES[Math.floor(Math.random() * PS2_IDLE_QUOTES.length)];
        setCurrentQuote(nextQuote);
      }, 8000);
    }

    return () => {
      if (quoteTimerRef.current) clearInterval(quoteTimerRef.current);
    };
  }, [mascotState]);

  // Click-to-interact easter egg with coin tip reward
  const handleMascotTap = () => {
    soundManager.unlockAudio();
    soundManager.playPs2MemoryCardSave();
    setIsTapped(true);

    const bonusRewards = [50, 75, 100, 150];
    const awarded = bonusRewards[Math.floor(Math.random() * bonusRewards.length)];

    setTapBonusText(`+${awarded} 🎮 MEMORY CACHE!`);
    if (onRewardCoins) {
      onRewardCoins(awarded);
    }

    setCurrentQuote('Vector Unit 1 allocated spare credits to your balance!');

    setTimeout(() => {
      setIsTapped(false);
      setTapBonusText(null);
    }, 2400);
  };

  // Compact Mode (for mobile footer bar)
  if (variant === 'compact') {
    return (
      <div
        onClick={handleMascotTap}
        className="flex items-center space-x-2 bg-[#02050e]/95 border-2 border-[#006FCD]/80 rounded-full px-3 py-1 shadow-lg cursor-pointer select-none active:scale-95 transition-transform"
      >
        <div className="relative w-8 h-8 rounded-full overflow-hidden border border-cyan-400 bg-black flex items-center justify-center flex-shrink-0">
          <Gamepad2 className="w-5 h-5 text-cyan-300" />
          {isWinning && (
            <div className="absolute inset-0 bg-[#006FCD]/40 animate-pulse pointer-events-none" />
          )}
        </div>
        <div className="flex flex-col text-left overflow-hidden">
          <div className="flex items-center space-x-1">
            <Gamepad2 className="w-3 h-3 text-[#006FCD]" />
            <span className="text-[10px] font-black text-cyan-300 uppercase tracking-wider font-mono">
              PLAYSTATION 2
            </span>
          </div>
          <span className="text-[9px] text-cyan-200 font-medium truncate max-w-[200px] font-mono">
            {tapBonusText || currentQuote}
          </span>
        </div>
      </div>
    );
  }

  // Full Desktop Flank Standee Card
  return (
    <div
      onClick={handleMascotTap}
      className={`relative group cursor-pointer select-none transition-transform duration-300 flex flex-col items-center w-52 hover:scale-[1.02] ${
        isTapped ? 'scale-95' : ''
      }`}
      title="Click PS2 Console & Controller for 8MB Memory Card bonus credits and BIOS tips!"
    >
      {/* Dynamic Speech Bubble Overlay */}
      <div className="relative mb-2 z-30 w-full max-w-[210px] animate-fadeIn">
        <div className="bg-[#020614]/95 text-cyan-200 text-[10px] sm:text-[11px] font-bold p-2 rounded-2xl border-2 border-[#006FCD] shadow-[0_4px_16px_rgba(0,111,205,0.4)] text-center leading-tight font-mono relative backdrop-blur-sm">
          <span>{tapBonusText || currentQuote}</span>
          {/* Speech Bubble Arrow */}
          <div className="absolute -bottom-2 left-1/2 -translate-x-1/2 w-0 h-0 border-l-[6px] border-l-transparent border-r-[6px] border-r-transparent border-t-[8px] border-t-[#006FCD]" />
        </div>
      </div>

      {/* Floating bonus cache text on click */}
      {tapBonusText && (
        <div className="absolute top-8 z-40 animate-coin-burst pointer-events-none flex items-center space-x-1 font-black text-xs font-mono text-cyan-300 drop-shadow-[0_0_12px_rgba(0,240,255,1)]">
          <span>🎮</span>
          <span>{tapBonusText}</span>
        </div>
      )}

      {/* Main Standee Chamber - Sized to Match Grizzly Gus & Pixel Penny */}
      <div
        className={`relative w-52 h-[340px] rounded-2xl overflow-hidden border-2 shadow-2xl transition-all duration-300 bg-gradient-to-b from-[#081226] via-[#030612] to-black p-2.5 flex flex-col justify-between ${
          mascotState === 'fever'
            ? 'border-cyan-300 shadow-[0_0_35px_rgba(0,240,255,0.8)] scale-105'
            : mascotState === 'bigwin'
            ? 'border-white shadow-[0_0_35px_rgba(0,111,205,0.9)] scale-105'
            : mascotState === 'win'
            ? 'border-[#006FCD] shadow-[0_0_25px_rgba(0,111,205,0.7)]'
            : mascotState === 'anticipation'
            ? 'border-cyan-400 animate-pulse shadow-[0_0_25px_rgba(0,240,255,0.8)]'
            : 'border-[#006FCD]/80 shadow-[0_0_25px_rgba(0,111,205,0.4)]'
        }`}
      >
        {/* Subtle PS2 vector grid background */}
        <div
          className="absolute inset-0 pointer-events-none opacity-25"
          style={{
            backgroundImage:
              'linear-gradient(rgba(0,111,205,0.3) 1px, transparent 1px), linear-gradient(90deg, rgba(0,111,205,0.3) 1px, transparent 1px)',
            backgroundSize: '16px 16px',
          }}
        />

        {/* Ambient Cyan/Blue Light Flares */}
        <div className="absolute -top-10 -left-10 w-32 h-32 bg-[#006FCD]/20 rounded-full blur-2xl pointer-events-none" />
        <div className="absolute -bottom-10 -right-10 w-32 h-32 bg-[#00F0FF]/15 rounded-full blur-2xl pointer-events-none" />

        {/* Header Ribbon */}
        <div className="relative z-10 flex items-center justify-between border-b border-[#006FCD]/40 pb-1">
          <div className="flex items-center space-x-1 font-mono">
            <span className="w-2 h-2 rounded-full bg-emerald-400 shadow-[0_0_6px_#22c55e] animate-pulse" />
            <span className="text-[10px] font-black text-cyan-300 tracking-wider">PLAYSTATION 2</span>
          </div>
          <span className="text-[8px] font-mono text-cyan-400 font-bold tracking-tight">128-BIT EE</span>
        </div>

        {/* Center Artwork Area: Full-Chamber PS2 Console & DualShock 2 Controller Duo */}
        <div className="relative z-10 flex-1 w-full flex flex-col items-center justify-center my-0.5">
          <svg
            viewBox="0 0 200 230"
            className={`w-full h-full max-h-[240px] drop-shadow-[0_4px_20px_rgba(0,111,205,0.8)] transition-transform duration-300 ${
              mascotState === 'win' || mascotState === 'bigwin'
                ? 'scale-105'
                : 'group-hover:scale-102'
            }`}
          >
            <defs>
              {/* Radial Cyan Glow behind hardware */}
              <radialGradient id="auraGlow" cx="50%" cy="50%" r="50%">
                <stop offset="0%" stopColor="#006FCD" stopOpacity="0.45" />
                <stop offset="60%" stopColor="#002855" stopOpacity="0.15" />
                <stop offset="100%" stopColor="#020614" stopOpacity="0" />
              </radialGradient>

              {/* Console Metallic Chassis Gradient */}
              <linearGradient id="ps2TowerGrad" x1="0%" y1="0%" x2="100%" y2="0%">
                <stop offset="0%" stopColor="#1C2744" />
                <stop offset="25%" stopColor="#141E34" />
                <stop offset="70%" stopColor="#0A0F1E" />
                <stop offset="100%" stopColor="#04060C" />
              </linearGradient>

              {/* Controller Body Gradient */}
              <linearGradient id="ds2BodyGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#223052" />
                <stop offset="40%" stopColor="#131B2E" />
                <stop offset="85%" stopColor="#070A14" />
                <stop offset="100%" stopColor="#020308" />
              </linearGradient>

              {/* PS2 Gradient Logo */}
              <linearGradient id="ps2LogoGlow" x1="0%" y1="0%" x2="100%" y2="0%">
                <stop offset="0%" stopColor="#0056B3" />
                <stop offset="45%" stopColor="#0080FF" />
                <stop offset="100%" stopColor="#00F0FF" />
              </linearGradient>

              {/* Disc Tray Shading */}
              <linearGradient id="ps2TrayGrad" x1="0%" y1="0%" x2="0%" y2="100%">
                <stop offset="0%" stopColor="#25355B" />
                <stop offset="100%" stopColor="#0A1020" />
              </linearGradient>

              {/* Thumbstick Convex Dome Shading */}
              <radialGradient id="stickGrad" cx="40%" cy="35%" r="60%">
                <stop offset="0%" stopColor="#243048" />
                <stop offset="65%" stopColor="#0E1420" />
                <stop offset="100%" stopColor="#04060A" />
              </radialGradient>

              {/* Drop Shadow for Foreground Controller */}
              <filter id="controllerDropShadow" x="-20%" y="-20%" width="150%" height="150%">
                <feDropShadow dx="-2" dy="4" stdDeviation="5" floodColor="#000000" floodOpacity="0.9" />
              </filter>
            </defs>

            {/* Ambient Background Radial Glow */}
            <circle cx="100" cy="115" r="95" fill="url(#auraGlow)" />

            {/* Floor Grid Horizon Line & Ground Reflection */}
            <ellipse cx="100" cy="208" rx="88" ry="12" fill="#002855" opacity="0.35" />
            <ellipse cx="60" cy="204" rx="42" ry="7" fill="#00F0FF" opacity="0.15" />

            {/* ============================================================= */}
            {/* 1. PLAYSTATION 2 TOWER CONSOLE (Vertical Stand on Left)        */}
            {/* ============================================================= */}
            <g id="ps2Console">
              {/* Vertical Stand Base (Elliptical Plate) */}
              <ellipse cx="56" cy="198" rx="42" ry="8" fill="#040714" stroke="#006FCD" strokeWidth="1.2" />
              <ellipse cx="56" cy="198" rx="36" ry="5.5" fill="#081022" stroke="#00F0FF" strokeWidth="0.8" opacity="0.8" />
              <rect x="42" y="193" width="28" height="3" fill="#006FCD" opacity="0.6" />

              {/* Console Main Tower Body */}
              <rect
                x="20"
                y="18"
                width="72"
                height="176"
                rx="3"
                fill="url(#ps2TowerGrad)"
                stroke="#006FCD"
                strokeWidth="1.6"
              />

              {/* Stepped Chassis Accent (PS2 Fat Distinct Silhouette) */}
              <rect x="23" y="106" width="69" height="88" rx="1.5" fill="#090E1C" stroke="#004B93" strokeWidth="0.8" opacity="0.8" />

              {/* Stepped Cooling Ribs (Iconic PS2 Front Fins) */}
              {[26, 33, 40, 47, 54, 61, 68, 75, 82, 89, 96, 103, 110, 117, 124, 131, 138, 145, 152, 159, 166, 173, 180, 187].map((y) => (
                <line
                  key={y}
                  x1="20"
                  y1={y}
                  x2="92"
                  y2={y}
                  stroke="#006FCD"
                  strokeWidth="0.9"
                  opacity="0.45"
                />
              ))}

              {/* Left Rim Highlight Line */}
              <line x1="21" y1="19" x2="21" y2="193" stroke="#38BDF8" strokeWidth="1.2" opacity="0.7" />

              {/* DVD-ROM Disc Drive Tray */}
              <rect
                x="25"
                y="26"
                width="62"
                height="26"
                rx="1.5"
                fill="url(#ps2TrayGrad)"
                stroke="#006FCD"
                strokeWidth="1"
              />
              {/* Disc Tray Eject Seam */}
              <line x1="25" y1="52" x2="87" y2="52" stroke="#475569" strokeWidth="0.8" />

              {/* PlayStation Family Color Logo Badge */}
              <g transform="translate(28, 29)">
                <rect x="0" y="0" width="8" height="8" rx="1" fill="#020409" stroke="#334155" strokeWidth="0.5" />
                <polygon points="2,1.5 4.5,2.5 2,6" fill="#EF4444" />
                <polygon points="4.5,2.5 6,5 3.5,6" fill="#F59E0B" />
                <polygon points="2,6 4.5,5 6,6" fill="#00F0FF" />
              </g>

              {/* DVD-ROM Branding Text */}
              <text
                x="56"
                y="35"
                textAnchor="middle"
                fill="#CBD5E1"
                fontSize="4"
                fontFamily="sans-serif"
                fontWeight="900"
                letterSpacing="0.8"
              >
                DVD-ROM
              </text>

              {/* Prominent Glowing PS2 Logo */}
              <text
                x="56"
                y="46"
                textAnchor="middle"
                fill="url(#ps2LogoGlow)"
                fontSize="10"
                fontFamily="sans-serif"
                fontWeight="900"
                letterSpacing="1.5"
              >
                PS2
              </text>

              {/* Power / Reset Switch with Glowing Green LED */}
              <rect x="73" y="56" width="12" height="6.5" rx="1" fill="#080E1C" stroke="#22C55E" strokeWidth="0.7" />
              <circle cx="77" cy="59.2" r="1.4" fill="#22C55E" />
              <text x="81" y="60.5" fill="#22C55E" fontSize="3" fontFamily="sans-serif" fontWeight="bold">I/O</text>

              {/* Disc Eject Switch with Glowing Blue LED */}
              <rect x="73" y="65" width="12" height="6.5" rx="1" fill="#080E1C" stroke="#006FCD" strokeWidth="0.7" />
              <circle cx="77" cy="68.2" r="1.4" fill="#00F0FF" />
              <polygon points="80.5,69 83.5,69 82,66.8" fill="#00F0FF" />

              {/* Slot 1: MagicGate 8MB Memory Card (Inserted & Active) */}
              <g id="memoryCard1">
                <rect x="25" y="76" width="28" height="18" rx="2" fill="#14203D" stroke="#006FCD" strokeWidth="1.2" />
                <text x="39" y="83" textAnchor="middle" fill="#E2E8F0" fontSize="3.6" fontFamily="sans-serif" fontWeight="bold">
                  MagicGate
                </text>
                <text x="39" y="90" textAnchor="middle" fill="#00F0FF" fontSize="5" fontFamily="sans-serif" fontWeight="900">
                  8 MB
                </text>
                {/* Save Activity Red LED */}
                <circle cx="49" cy="79.5" r="1.2" fill="#EF4444" className="animate-pulse" />
              </g>

              {/* Slot 2: Empty Bay Door */}
              <g id="memoryCard2">
                <rect x="56" y="76" width="28" height="18" rx="1.5" fill="#040712" stroke="#1E293B" strokeWidth="0.9" />
                <text x="70" y="87" textAnchor="middle" fill="#475569" fontSize="3.8" fontFamily="sans-serif" fontWeight="bold">
                  SLOT 2
                </text>
              </g>

              {/* Controller Port 1 (Connected to DualShock 2 Cable) */}
              <rect x="25" y="98" width="28" height="15" rx="2" fill="#0A1020" stroke="#006FCD" strokeWidth="1.1" />
              <rect x="28" y="101" width="22" height="9" rx="1" fill="#020409" />
              {/* Connector Plug Inserted */}
              <rect x="29" y="102" width="20" height="7" rx="1" fill="#18243E" stroke="#38BDF8" strokeWidth="0.6" />
              <circle cx="34" cy="105.5" r="1" fill="#00F0FF" />
              <circle cx="39" cy="105.5" r="1" fill="#00F0FF" />
              <circle cx="44" cy="105.5" r="1" fill="#00F0FF" />

              {/* Controller Port 2 */}
              <rect x="56" y="98" width="28" height="15" rx="2" fill="#040712" stroke="#1E293B" strokeWidth="0.9" />
              <text x="70" y="108" textAnchor="middle" fill="#475569" fontSize="3.5" fontFamily="sans-serif" fontWeight="bold">
                PORT 2
              </text>

              {/* 128-Bit Emotion Engine Processor Plaque */}
              <rect x="26" y="146" width="60" height="15" rx="2" fill="#020612" stroke="#00F0FF" strokeWidth="1" />
              <text x="56" y="154" textAnchor="middle" fill="#00F0FF" fontSize="4.6" fontFamily="monospace" fontWeight="900" letterSpacing="0.8">
                EMOTION ENGINE
              </text>
              <text x="56" y="158.5" textAnchor="middle" fill="#94A3B8" fontSize="2.8" fontFamily="sans-serif" fontWeight="bold">
                294 MHz • 128-BIT
              </text>

              {/* SONY Monogram */}
              <text x="56" y="178" textAnchor="middle" fill="#64748B" fontSize="5" fontFamily="sans-serif" fontWeight="bold" letterSpacing="1.5">
                SONY
              </text>
            </g>

            {/* Controller Cable Connecting Console to Controller */}
            <path
              d="M 39 109 C 39 135, 55 150, 75 145 C 88 142, 95 130, 108 124"
              fill="none"
              stroke="#03050C"
              strokeWidth="5"
              strokeLinecap="round"
            />
            <path
              d="M 39 109 C 39 135, 55 150, 75 145 C 88 142, 95 130, 108 124"
              fill="none"
              stroke="#006FCD"
              strokeWidth="1.6"
              strokeLinecap="round"
              opacity="0.85"
            />

            {/* ============================================================= */}
            {/* 2. DUALSHOCK 2 CONTROLLER (Foreground Dynamic Hero)            */}
            {/* ============================================================= */}
            <g id="dualShock2" filter="url(#controllerDropShadow)">
              {/* L1 & R1 Shoulder Trigger Bumpers */}
              <rect x="100" y="116" width="18" height="9" rx="3" fill="#18243E" stroke="#006FCD" strokeWidth="1" />
              <text x="109" y="122.5" textAnchor="middle" fill="#64748B" fontSize="3.5" fontFamily="sans-serif" fontWeight="bold">L1</text>

              <rect x="162" y="116" width="18" height="9" rx="3" fill="#18243E" stroke="#006FCD" strokeWidth="1" />
              <text x="171" y="122.5" textAnchor="middle" fill="#64748B" fontSize="3.5" fontFamily="sans-serif" fontWeight="bold">R1</text>

              {/* Controller Cable Top Strain Relief Bushing */}
              <rect x="136" y="117" width="8" height="7" rx="1.5" fill="#0B101E" stroke="#334155" strokeWidth="0.8" />

              {/* Main DualShock 2 Ergonomic Body Silhouette */}
              <path
                d="M 106 123
                   C 118 123, 126 127, 140 128
                   C 154 127, 162 123, 174 123
                   C 188 123, 198 133, 196 166
                   C 194 186, 188 208, 176 210
                   C 164 212, 156 194, 152 178
                   C 146 170, 142 168, 140 168
                   C 138 168, 134 170, 128 178
                   C 124 194, 116 212, 104 210
                   C 92 208, 86 186, 84 166
                   C 82 133, 92 123, 106 123 Z"
                fill="url(#ds2BodyGrad)"
                stroke="#006FCD"
                strokeWidth="1.8"
                strokeLinejoin="round"
              />

              {/* Contour Highlights on Grip Edges for 3D Feel */}
              <path
                d="M 88 160 C 86 180, 92 198, 102 203"
                fill="none"
                stroke="#38BDF8"
                strokeWidth="1.2"
                opacity="0.6"
              />
              <path
                d="M 192 160 C 194 180, 188 198, 178 203"
                fill="none"
                stroke="#38BDF8"
                strokeWidth="1.2"
                opacity="0.6"
              />

              {/* SONY Corporate Logo on Controller */}
              <text x="140" y="136" textAnchor="middle" fill="#CBD5E1" fontSize="4.2" fontFamily="sans-serif" fontWeight="bold" letterSpacing="0.8">
                SONY
              </text>

              {/* D-Pad on Left Grip */}
              <g id="dpad" transform="translate(108, 147)">
                {/* Cross Base */}
                <rect x="-13" y="-4" width="26" height="8" rx="2" fill="#050812" stroke="#334155" strokeWidth="0.8" />
                <rect x="-4" y="-13" width="8" height="26" rx="2" fill="#050812" stroke="#334155" strokeWidth="0.8" />
                {/* Directional Arrows (Cyan) */}
                <polygon points="0,-11 -2.5,-8 2.5,-8" fill="#38BDF8" />
                <polygon points="0,11 -2.5,8 2.5,8" fill="#38BDF8" />
                <polygon points="-11,0 -8,-2.5 -8,2.5" fill="#38BDF8" />
                <polygon points="11,0 8,-2.5 8,2.5" fill="#38BDF8" />
                {/* Center Pivot */}
                <circle cx="0" cy="0" r="2.5" fill="#0B1220" />
              </g>

              {/* =========================================================== */}
              {/* THE FOUR ICONIC PLAYSTATION FACE BUTTONS (Right Grip)       */}
              {/* Green Triangle, Red Circle, Blue Cross, Pink Square         */}
              {/* =========================================================== */}
              <g id="faceButtons" transform="translate(172, 147)">
                {/* 1. GREEN TRIANGLE △ (Top) */}
                <circle cx="0" cy="-12" r="5.2" fill="#040814" stroke="#22C55E" strokeWidth="1.2" />
                <polygon points="0,-14.8 -3,-9.6 3,-9.6" fill="#22C55E" />
                <circle cx="0" cy="-12" r="5.2" fill="none" stroke="#22C55E" strokeWidth="0.8" opacity="0.4" className="animate-ping" />

                {/* 2. PINK SQUARE □ (Left) */}
                <circle cx="-12" cy="0" r="5.2" fill="#040814" stroke="#EC4899" strokeWidth="1.2" />
                <rect x="-14.5" y="-2.5" width="5" height="5" fill="none" stroke="#EC4899" strokeWidth="1.4" />

                {/* 3. RED CIRCLE ○ (Right) */}
                <circle cx="12" cy="0" r="5.2" fill="#040814" stroke="#EF4444" strokeWidth="1.2" />
                <circle cx="12" cy="0" r="2.5" fill="none" stroke="#EF4444" strokeWidth="1.4" />

                {/* 4. BLUE CROSS ✕ (Bottom) */}
                <circle cx="0" cy="12" r="5.2" fill="#040814" stroke="#38BDF8" strokeWidth="1.2" />
                <line x1="-2.4" y1="9.6" x2="2.4" y2="14.4" stroke="#38BDF8" strokeWidth="1.6" strokeLinecap="round" />
                <line x1="2.4" y1="9.6" x2="-2.4" y2="14.4" stroke="#38BDF8" strokeWidth="1.6" strokeLinecap="round" />
              </g>

              {/* SELECT & START Buttons */}
              <rect x="127" y="142" width="6" height="3" rx="1" fill="#1E293B" stroke="#475569" strokeWidth="0.5" />
              <rect x="147" y="142" width="6" height="3" rx="1" fill="#1E293B" stroke="#475569" strokeWidth="0.5" />

              {/* ANALOG Button & Glowing Red Indicator LED */}
              <circle cx="140" cy="151" r="3.4" fill="#060A14" stroke="#334155" strokeWidth="0.8" />
              <text x="140" y="148" textAnchor="middle" fill="#94A3B8" fontSize="2.4" fontFamily="sans-serif" fontWeight="bold">ANALOG</text>
              <circle cx="140" cy="156.5" r="1.3" fill="#EF4444" className="shadow-[0_0_6px_#EF4444] animate-pulse" />

              {/* Twin Analog Thumbsticks with Concentric Rubber Ribs */}
              {/* Left Thumbstick */}
              <g transform="translate(124, 172)">
                <circle cx="0" cy="0" r="11" fill="#060A14" stroke="#334155" strokeWidth="1.1" />
                <circle cx="0" cy="0" r="8.5" fill="url(#stickGrad)" stroke="#1E293B" strokeWidth="0.8" />
                {/* Thumbstick Concave Center Pad */}
                <circle cx="0" cy="0" r="4.5" fill="#04060C" stroke="#006FCD" strokeWidth="0.6" />
                {/* 4 Grip Dots */}
                <circle cx="0" cy="-6" r="0.7" fill="#64748B" />
                <circle cx="0" cy="6" r="0.7" fill="#64748B" />
                <circle cx="-6" cy="0" r="0.7" fill="#64748B" />
                <circle cx="6" cy="0" r="0.7" fill="#64748B" />
              </g>

              {/* Right Thumbstick */}
              <g transform="translate(156, 172)">
                <circle cx="0" cy="0" r="11" fill="#060A14" stroke="#334155" strokeWidth="1.1" />
                <circle cx="0" cy="0" r="8.5" fill="url(#stickGrad)" stroke="#1E293B" strokeWidth="0.8" />
                <circle cx="0" cy="0" r="4.5" fill="#04060C" stroke="#006FCD" strokeWidth="0.6" />
                <circle cx="0" cy="-6" r="0.7" fill="#64748B" />
                <circle cx="0" cy="6" r="0.7" fill="#64748B" />
                <circle cx="-6" cy="0" r="0.7" fill="#64748B" />
                <circle cx="6" cy="0" r="0.7" fill="#64748B" />
              </g>

              {/* DUALSHOCK 2 Text on Controller */}
              <text x="140" y="196" textAnchor="middle" fill="#00F0FF" fontSize="3.6" fontFamily="sans-serif" fontWeight="900" letterSpacing="0.8">
                DUALSHOCK 2
              </text>
            </g>
          </svg>
        </div>

        {/* Bottom Hardware Plaque Badge - Matching Grizzly Gus & Pixel Penny */}
        <div className="relative z-10 py-1.5 px-2 rounded-xl bg-[#040814]/95 border border-[#006FCD]/70 backdrop-blur-md shadow-lg flex items-center justify-between">
          <div className="flex items-center space-x-1.5">
            <Gamepad2 className="w-3.5 h-3.5 text-cyan-300 animate-pulse flex-shrink-0" />
            <div className="flex flex-col text-left">
              <span className="text-[10px] font-black text-cyan-200 tracking-wider uppercase font-mono">
                PS2 & DUALSHOCK 2
              </span>
              <span className="text-[7.5px] font-bold text-slate-400 tracking-widest uppercase font-mono">
                EMOTION ENGINE 128-BIT
              </span>
            </div>
          </div>
          <div className="flex items-center space-x-1 font-mono text-[8px] text-emerald-400 font-black">
            <Save className="w-2.5 h-2.5 text-cyan-400" />
            <span>8MB OK</span>
            {isSpinning && <Disc className="w-2.5 h-2.5 text-blue-400 animate-spin" />}
            {isFeverMode && <Zap className="w-2.5 h-2.5 text-yellow-400 animate-pulse" />}
          </div>
        </div>
      </div>

      {/* 3D PS2 Vertical Stand Pedestal Base Beneath Card */}
      <div className="w-full flex flex-col items-center -mt-2 z-10 pointer-events-none">
        <div className="w-44 h-2.5 bg-gradient-to-r from-[#02050E] via-[#004B93] to-[#02050E] rounded-t-md border-t border-cyan-400/80 shadow-md flex items-center justify-around px-4">
          <span className="w-1.5 h-1.5 rounded-full bg-cyan-400 shadow-[0_0_4px_#00F0FF]" />
          <span className="text-[7px] font-mono text-cyan-200 font-bold">SONY COMPUTER ENTERTAINMENT</span>
          <span className="w-1.5 h-1.5 rounded-full bg-cyan-400 shadow-[0_0_4px_#00F0FF]" />
        </div>
        <div className="w-52 h-5 bg-gradient-to-r from-[#010206] via-[#091226] to-[#010206] rounded-b-xl border-b-2 border-x-2 border-[#006FCD] shadow-2xl relative flex items-center justify-center">
          <div className="w-28 h-1 bg-cyan-400/60 rounded-full blur-[0.5px]" />
        </div>
        <div className="w-56 h-2.5 bg-black/80 blur-sm rounded-full -mt-1" />
      </div>
    </div>
  );
};
