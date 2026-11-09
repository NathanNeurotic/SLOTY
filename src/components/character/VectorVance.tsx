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
  'Hit 3 DVD Discs for 15 Free Spins at 3X Emotion Engine clock speed!',
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

    const bonusRewards = [25, 50, 75, 100];
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
      title="Click PS2 Console for 8MB Memory Card bonus credits and BIOS tips!"
    >
      {/* Dynamic Speech Bubble Overlay */}
      <div className="relative mb-2 z-30 w-full max-w-[210px] animate-fadeIn">
        <div className="bg-[#020614]/95 text-cyan-200 text-[10px] sm:text-[11px] font-bold p-2.5 rounded-2xl border-2 border-[#006FCD] shadow-[0_4px_16px_rgba(0,111,205,0.4)] text-center leading-tight font-mono relative backdrop-blur-sm">
          <span>{tapBonusText || currentQuote}</span>
          {/* Speech Bubble Arrow */}
          <div className="absolute -bottom-2 left-1/2 -translate-x-1/2 w-0 h-0 border-l-[6px] border-l-transparent border-r-[6px] border-r-transparent border-t-[8px] border-t-[#006FCD]" />
        </div>
      </div>

      {/* Main Standee Chamber */}
      <div
        className={`relative w-48 h-[310px] rounded-2xl overflow-hidden border-2 shadow-2xl transition-all duration-300 bg-gradient-to-b from-[#060c1d] via-[#02050e] to-black p-3 flex flex-col justify-between ${
          mascotState === 'fever'
            ? 'border-cyan-300 shadow-[0_0_35px_rgba(0,240,255,0.8)] scale-105'
            : mascotState === 'bigwin'
            ? 'border-white shadow-[0_0_35px_rgba(0,111,205,0.9)] scale-105'
            : mascotState === 'win'
            ? 'border-[#006FCD] shadow-[0_0_25px_rgba(0,111,205,0.7)]'
            : mascotState === 'anticipation'
            ? 'border-cyan-400 animate-pulse shadow-[0_0_25px_rgba(0,240,255,0.8)]'
            : 'border-[#006FCD]/70 shadow-[0_0_25px_rgba(0,111,205,0.35)]'
        }`}
      >
        {/* Subtle PS2 vector grid background */}
        <div
          className="absolute inset-0 pointer-events-none opacity-20"
          style={{
            backgroundImage:
              'linear-gradient(rgba(0,111,205,0.3) 1px, transparent 1px), linear-gradient(90deg, rgba(0,111,205,0.3) 1px, transparent 1px)',
            backgroundSize: '16px 16px',
          }}
        />

        {/* Header Ribbon */}
        <div className="relative z-10 flex items-center justify-between border-b border-[#006FCD]/40 pb-1">
          <div className="flex items-center space-x-1 font-mono">
            <span className="w-2 h-2 rounded-full bg-emerald-400 shadow-[0_0_6px_#22c55e] animate-pulse" />
            <span className="text-[9.5px] font-black text-cyan-300 tracking-wider">PLAYSTATION 2</span>
          </div>
          <span className="text-[7.5px] font-mono text-[#006FCD] font-bold">128-BIT EE</span>
        </div>

        {/* Center Character: Authentic PlayStation 2 Console Artwork */}
        <div className="relative z-10 flex-1 flex flex-col items-center justify-center py-1">
          <div className="relative w-32 h-36 flex items-center justify-center">
            {/* Ambient Cyan Aura */}
            <div className="absolute inset-0 rounded-full bg-[#006FCD]/20 filter blur-lg animate-pulse" />

            <svg viewBox="0 0 100 135" className="w-full h-full drop-shadow-[0_4px_16px_rgba(0,111,205,0.9)]">
              <defs>
                <linearGradient id="ps2ChassisGrad" x1="0%" y1="0%" x2="100%" y2="0%">
                  <stop offset="0%" stopColor="#0E1628" />
                  <stop offset="35%" stopColor="#162038" />
                  <stop offset="75%" stopColor="#090E1A" />
                  <stop offset="100%" stopColor="#03050C" />
                </linearGradient>
                <linearGradient id="ps2LogoGrad" x1="0%" y1="0%" x2="100%" y2="0%">
                  <stop offset="0%" stopColor="#004B93" />
                  <stop offset="45%" stopColor="#006FCD" />
                  <stop offset="100%" stopColor="#00F0FF" />
                </linearGradient>
                <linearGradient id="ps2TrayGrad" x1="0%" y1="0%" x2="0%" y2="100%">
                  <stop offset="0%" stopColor="#1A243C" />
                  <stop offset="100%" stopColor="#080D18" />
                </linearGradient>
              </defs>

              {/* Console Vertical Stand Base */}
              <polygon points="14,124 86,124 80,116 20,116" fill="#040711" stroke="#006FCD" strokeWidth="1" />
              <rect x="24" y="120" width="52" height="3" fill="#020409" />

              {/* Monolithic Ribbed PS2 Console Body */}
              <rect
                x="20"
                y="10"
                width="60"
                height="106"
                rx="2"
                fill="url(#ps2ChassisGrad)"
                stroke="#006FCD"
                strokeWidth="1.5"
              />

              {/* Iconic Ribbed Horizontal Stepped Cooling Fins */}
              {[16, 22, 28, 34, 40, 46, 52, 58, 64, 70, 76, 82, 88, 94, 100, 106].map((y) => (
                <line key={y} x1="20" y1={y} x2="24" y2={y} stroke="#006FCD" strokeWidth="0.8" opacity="0.6" />
              ))}
              {[16, 22, 28, 34, 40, 46, 52, 58, 64, 70, 76, 82, 88, 94, 100, 106].map((y) => (
                <line key={`r-${y}`} x1="76" y1={y} x2="80" y2={y} stroke="#006FCD" strokeWidth="0.8" opacity="0.6" />
              ))}

              {/* DVD-ROM Disc Drive Tray */}
              <rect
                x="26"
                y="15"
                width="48"
                height="18"
                rx="1"
                fill="url(#ps2TrayGrad)"
                stroke="#006FCD"
                strokeWidth="0.8"
              />
              {/* Disc Tray Seam */}
              <line x1="26" y1="33" x2="74" y2="33" stroke="#334155" strokeWidth="0.6" />

              {/* Official PlayStation Badge & DVD-ROM Branding */}
              <rect x="29" y="18" width="6" height="6" rx="0.5" fill="#02050E" stroke="#334155" strokeWidth="0.5" />
              {/* PS Colorful Family Logo */}
              <polygon points="31,19 33,20 31,23" fill="#EF4444" />
              <polygon points="33,20 34,22 32,23" fill="#F59E0B" />
              <polygon points="31,23 33,22 34,23" fill="#00F0FF" />

              <text x="52" y="22.5" textAnchor="middle" fill="#CBD5E1" fontSize="3.8" fontFamily="sans-serif" fontWeight="900" letterSpacing="0.8">
                DVD-ROM
              </text>

              {/* Blue-Cyan Gradient PS2 Monogram */}
              <text x="52" y="30" textAnchor="middle" fill="url(#ps2LogoGrad)" fontSize="6.5" fontFamily="sans-serif" fontWeight="900" letterSpacing="1.2">
                PS2
              </text>

              {/* Power / Reset Button (Green LED) */}
              <rect x="66" y="37" width="8" height="4.5" rx="0.8" fill="#0A0F1D" stroke="#22C55E" strokeWidth="0.6" />
              <circle cx="70" cy="39.2" r="1" fill="#22C55E" className="shadow-[0_0_4px_#22C55E]" />

              {/* Disc Eject Button (Blue LED) */}
              <rect x="66" y="44" width="8" height="4.5" rx="0.8" fill="#0A0F1D" stroke="#006FCD" strokeWidth="0.6" />
              <circle cx="70" cy="46.2" r="1" fill="#00F0FF" className="shadow-[0_0_4px_#00F0FF]" />

              {/* Slot 1: MagicGate 8MB Memory Card Inserted */}
              <rect x="26" y="52" width="22" height="15" rx="1.5" fill="#141E38" stroke="#006FCD" strokeWidth="1" />
              <text x="37" y="58" textAnchor="middle" fill="#CBD5E1" fontSize="3.2" fontFamily="sans-serif" fontWeight="bold">
                MagicGate
              </text>
              <text x="37" y="63" textAnchor="middle" fill="#00F0FF" fontSize="3.8" fontFamily="sans-serif" fontWeight="900">
                8 MB
              </text>
              {/* Red Card Access Activity LED */}
              <circle cx="45" cy="55" r="0.8" fill="#EF4444" className="animate-pulse" />

              {/* Slot 2: Empty Bay */}
              <rect x="52" y="52" width="22" height="15" rx="1" fill="#030610" stroke="#1E293B" strokeWidth="0.8" />
              <text x="63" y="61" textAnchor="middle" fill="#475569" fontSize="3" fontFamily="sans-serif">
                SLOT 2
              </text>

              {/* Controller Port 1 (Connected to DualShock 2) */}
              <rect x="26" y="70" width="22" height="13" rx="1.5" fill="#0A0F1E" stroke="#006FCD" strokeWidth="0.9" />
              <rect x="29" y="73" width="16" height="7" rx="1" fill="#02040A" />
              <circle cx="33" cy="76.5" r="0.9" fill="#006FCD" />
              <circle cx="37" cy="76.5" r="0.9" fill="#006FCD" />
              <circle cx="41" cy="76.5" r="0.9" fill="#006FCD" />

              {/* Controller Port 2 */}
              <rect x="52" y="70" width="22" height="13" rx="1.5" fill="#030610" stroke="#1E293B" strokeWidth="0.8" />
              <text x="63" y="78" textAnchor="middle" fill="#475569" fontSize="2.8" fontFamily="sans-serif">
                PORT 2
              </text>

              {/* SONY Corporate Monogram */}
              <text x="50" y="93" textAnchor="middle" fill="#64748B" fontSize="4.2" fontFamily="sans-serif" letterSpacing="1.5">
                SONY
              </text>

              {/* 128-Bit Emotion Engine Core Badge */}
              <rect x="30" y="98" width="40" height="11" rx="1.5" fill="#02050E" stroke="#00F0FF" strokeWidth="0.8" />
              <text x="50" y="105" textAnchor="middle" fill="#00F0FF" fontSize="3.8" fontFamily="monospace" fontWeight="900" letterSpacing="0.5">
                EMOTION ENGINE
              </text>
            </svg>
          </div>

          {/* Memory Card & Disc Status */}
          <div className="flex items-center space-x-2 mt-1">
            <div className="flex items-center space-x-1 px-2 py-0.5 rounded bg-black border border-[#006FCD] font-mono text-[8px] text-cyan-300">
              <Save className="w-2.5 h-2.5 text-cyan-400" />
              <span>8MB CARD</span>
            </div>
            <div className="flex items-center space-x-1 px-2 py-0.5 rounded bg-black border border-cyan-400 font-mono text-[8px] text-emerald-400">
              <Disc className="w-2.5 h-2.5 text-blue-400 animate-spin" />
              <span>1X DVD</span>
            </div>
          </div>
        </div>

        {/* Footer Callout */}
        <div className="relative z-10 flex items-center justify-between border-t border-[#006FCD]/40 pt-1 text-[8px] font-mono text-cyan-400">
          <span className="flex items-center space-x-1">
            <Zap className="w-2.5 h-2.5 text-yellow-300 animate-pulse" />
            <span>CLICK FOR BIOS TIP</span>
          </span>
          <span className="text-slate-400 font-black">294 MHz</span>
        </div>
      </div>
    </div>
  );
};
