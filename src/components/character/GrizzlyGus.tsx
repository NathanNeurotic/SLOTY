import React, { useState, useEffect, useRef } from 'react';
import { soundManager } from '../../audio/soundManager';
import { Sparkles, Trees, Star } from 'lucide-react';

export type MascotState = 'idle' | 'spinning' | 'anticipation' | 'win' | 'bigwin' | 'fever';

interface GrizzlyGusProps {
  isSpinning: boolean;
  isAnticipating: boolean;
  isWinning: boolean;
  isBigWin?: boolean;
  isFeverMode?: boolean;
  winAmount?: number;
  onRewardCoins?: (amount: number) => void;
  variant?: 'full' | 'compact';
}

const TIMBER_IDLE_QUOTES = [
  "Mmm, I smell fresh salmon and a giant jackpot!",
  "Rub my fuzzy belly for some lucky golden acorns!",
  "Hear that owl? Fortune is stirring in the canopy!",
  "The bears are friendly and the reels are wild!",
  "Six golden acorns trigger the Forest Harvest Respin!",
  "Shake them towering pines, explorer!",
];

const TIMBER_SPIN_QUOTES = [
  "Shake the branches! Bring home the harvest!",
  "Roll 'em high through the towering pines!",
  "Come on lucky woodland critters! Make it rain!",
  "Feel that forest breeze! A big win is blowing in!",
  "Keep your eyes peeled, partner!",
];

const TIMBER_ANTICIPATION_QUOTES = [
  "HOOT! TWO MYSTIC OWLS! HOLD YOUR BREATH!",
  "COME ON REEL FIVE! UNLOCK THE MOONLIT CANOPY!",
  "JUST ONE MORE OWL TO UNLEASH FREE SPINS!",
  "SWEET HONEYCOMB! WE'RE RIGHT THERE!",
];

const TIMBER_WIN_QUOTES = [
  "YEE-HAW! A BOUNTIFUL FOREST HARVEST HIT!",
  "WOOHOO! THE CRITTERS BROUGHT HOME THE GOLD!",
  "LOOK AT THAT BEAUTIFUL WOODLAND PAYOUT!",
  "NATURE REWARDS THE BOLD, EXPLORER!",
  "CASH ON THE BARRELHEAD, PARTNER!",
];

const TIMBER_BIG_WIN_QUOTES = [
  "HOLY MACKEREL! A COLOSSAL GRIZZLY JACKPOT!",
  "YOU BROKE THE FOREST RECORD, EXPLORER!",
  "NATURE'S GREATEST HARVEST! CONGRATS!",
  "HONEY JARS AND GOLDEN ACORNS FOR EVERYONE!",
];

const TIMBER_FEVER_QUOTES = [
  "NATURE'S FURY UNLEASHED! 2X MULTIPLIERS!",
  "THE FOREST IS GLOWING! HARVEST EVERY CRITTER!",
  "MAX WOODLAND POWER! KEEP SPINNING!",
];

export const GrizzlyGus: React.FC<GrizzlyGusProps> = ({
  isSpinning,
  isAnticipating,
  isWinning,
  isBigWin = false,
  isFeverMode = false,
  winAmount: _winAmount = 0,
  onRewardCoins,
  variant = 'full',
}) => {
  const [currentQuote, setCurrentQuote] = useState(TIMBER_IDLE_QUOTES[0]);
  const [isTapped, setIsTapped] = useState(false);
  const [tapBonusText, setTapBonusText] = useState<string | null>(null);
  const quoteTimerRef = useRef<number | null>(null);

  // Compute operational mascot state
  const mascotState: MascotState = isFeverMode
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

  useEffect(() => {
    let pool: string[];
    switch (mascotState) {
      case 'fever':
        pool = TIMBER_FEVER_QUOTES;
        break;
      case 'bigwin':
        pool = TIMBER_BIG_WIN_QUOTES;
        break;
      case 'win':
        pool = TIMBER_WIN_QUOTES;
        break;
      case 'anticipation':
        pool = TIMBER_ANTICIPATION_QUOTES;
        break;
      case 'spinning':
        pool = TIMBER_SPIN_QUOTES;
        break;
      case 'idle':
      default:
        pool = TIMBER_IDLE_QUOTES;
        break;
    }

    const nextQuote = pool[Math.floor(Math.random() * pool.length)];
    setCurrentQuote(nextQuote);

    if (quoteTimerRef.current) clearInterval(quoteTimerRef.current);

    if (mascotState === 'idle') {
      quoteTimerRef.current = window.setInterval(() => {
        setCurrentQuote(TIMBER_IDLE_QUOTES[Math.floor(Math.random() * TIMBER_IDLE_QUOTES.length)]);
      }, 7500);
    }

    return () => {
      if (quoteTimerRef.current) clearInterval(quoteTimerRef.current);
    };
  }, [mascotState]);

  const handleGusClick = () => {
    soundManager.unlockAudio();
    soundManager.playGrizzlyRoar();

    setIsTapped(true);
    setTapBonusText('+150 GOLDEN ACORNS!');

    if (onRewardCoins) {
      onRewardCoins(150);
    }

    setTimeout(() => setIsTapped(false), 800);
    setTimeout(() => setTapBonusText(null), 2500);
  };

  // Compact Stage Banner for Header & Floor Mode
  if (variant === 'compact') {
    return (
      <div
        onClick={handleGusClick}
        className={`relative w-full max-w-md mx-auto flex items-center justify-between px-3 py-1.5 rounded-2xl cursor-pointer select-none transition-all shadow-xl bg-gradient-to-r from-[#14281a] via-[#0d1c12] to-[#08120a] border-2 border-[#b45309] shadow-[0_0_20px_rgba(16,185,129,0.35)] ${
          isTapped ? 'scale-105' : 'hover:scale-[1.02]'
        }`}
        title="Tap Grizzly Gus to rub his fuzzy belly & get +150 golden acorns!"
      >
        {/* Gus Avatar */}
        <div className="relative flex items-center space-x-2 flex-shrink-0">
          <div className="relative w-11 h-11 sm:w-12 sm:h-12 rounded-full overflow-hidden border-2 border-amber-400 bg-[#2d1608] flex items-center justify-center flex-shrink-0 shadow-[0_0_12px_rgba(245,158,11,0.6)]">
            <span className="text-2xl select-none animate-bounce">🐻</span>
          </div>
          <div className="flex flex-col">
            <div className="flex items-center space-x-1">
              <Trees className="w-3 h-3 text-emerald-400" />
              <span className="text-[10px] sm:text-xs font-black uppercase tracking-wider text-emerald-300 font-sans">
                GRIZZLY GUS
              </span>
            </div>
            <span className="text-[8px] font-semibold tracking-wider text-amber-300 uppercase">
              WOODLAND MASCOT
            </span>
          </div>
        </div>

        {/* Dynamic Speech Bubble */}
        <div className="flex-1 mx-2 sm:mx-3 px-2.5 py-1 rounded-xl bg-black/60 border border-emerald-500/20 text-center overflow-hidden">
          <span className="text-[9px] sm:text-[10.5px] font-bold text-emerald-100 truncate block leading-tight font-sans">
            {tapBonusText || currentQuote}
          </span>
        </div>

        {/* Interactive Rub Belly Action Pill */}
        <div className="flex items-center space-x-1 px-2.5 py-1 rounded-full text-[9px] sm:text-[10px] font-black text-amber-950 bg-gradient-to-r from-amber-400 via-yellow-300 to-amber-400 shadow-md flex-shrink-0 animate-pulse">
          <span>🌰</span>
          <span>+150 ACORNS</span>
        </div>
      </div>
    );
  }

  // Full High-Resolution Animated Cartoon Standee for Flank / Podium
  return (
    <div
      onClick={handleGusClick}
      className={`relative group cursor-pointer select-none transition-transform duration-200 flex flex-col items-center w-52 sm:w-60 ${
        isTapped ? 'scale-105' : 'hover:scale-[1.02]'
      }`}
      title="Click Grizzly Gus for lucky cheers, bear roars & free acorns!"
    >
      {/* Speech Bubble cleanly positioned above the mascot */}
      <div className="relative mb-2 z-30 w-full max-w-[240px]">
        <div
          className={`relative px-3 py-1.5 rounded-2xl border-2 text-[11px] font-black shadow-xl tracking-wide transition-all ${
            mascotState === 'fever'
              ? 'bg-gradient-to-r from-emerald-600 via-teal-600 to-amber-500 text-white border-emerald-200 animate-pulse'
              : mascotState === 'anticipation'
              ? 'bg-emerald-950 text-emerald-100 border-emerald-400 shadow-[0_0_15px_rgba(52,211,153,0.8)] animate-bounce'
              : mascotState === 'win' || mascotState === 'bigwin'
              ? 'bg-gradient-to-r from-emerald-600 via-teal-600 to-amber-500 text-white border-white shadow-[0_0_18px_rgba(16,185,129,0.9)] animate-pulse'
              : 'bg-[#0a1e12]/95 text-emerald-200 border-emerald-500/50 shadow-[0_4px_12px_rgba(0,0,0,0.8)]'
          }`}
        >
          <div className="flex items-center space-x-1">
            {mascotState === 'anticipation' && <Sparkles className="w-3.5 h-3.5 text-yellow-300 animate-spin" />}
            {(mascotState === 'win' || mascotState === 'bigwin') && <Star className="w-3.5 h-3.5 text-yellow-300 fill-yellow-300 animate-ping" />}
            <span className="truncate whitespace-normal leading-tight text-center w-full">
              {tapBonusText || currentQuote}
            </span>
          </div>

          {/* Speech bubble tail pointer */}
          <div
            className={`absolute -bottom-2 left-1/2 -translate-x-1/2 w-0 h-0 border-l-[6px] border-l-transparent border-r-[6px] border-r-transparent border-t-[8px] ${
              mascotState === 'fever'
                ? 'border-t-emerald-600'
                : mascotState === 'anticipation'
                ? 'border-t-emerald-400'
                : mascotState === 'win' || mascotState === 'bigwin'
                ? 'border-t-emerald-600'
                : 'border-t-[#0a1e12]'
            }`}
          />
        </div>
      </div>

      {/* Floating bonus acorn text on click */}
      {tapBonusText && (
        <div className="absolute top-4 z-40 animate-coin-burst pointer-events-none flex items-center space-x-1 font-black text-sm text-amber-300 drop-shadow-[0_0_10px_rgba(245,158,11,1)]">
          <span>🌰</span>
          <span>+150 COINS!</span>
        </div>
      )}

      {/* Illustrated 3D Mascot Character Standee: GRIZZLY GUS */}
      <div className="relative w-48 sm:w-56 h-64 sm:h-72 flex flex-col items-center justify-end">
        {/* Glow behind Gus */}
        <div className={`absolute inset-4 rounded-full filter blur-xl pointer-events-none transition-all duration-300 ${
          mascotState === 'win' || mascotState === 'bigwin'
            ? 'bg-amber-400/50 scale-110'
            : mascotState === 'anticipation'
            ? 'bg-emerald-400/40 animate-pulse'
            : 'bg-emerald-800/25'
        }`} />

        {/* Vector SVG Cartoon Mascot: Grizzly Gus in Lumberjack Vest & Ranger Hat */}
        <svg viewBox="0 0 160 200" className="w-full h-full drop-shadow-2xl overflow-visible">
          <defs>
            <linearGradient id="gusFur" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#854D0E" />
              <stop offset="40%" stopColor="#542F0B" />
              <stop offset="100%" stopColor="#2A1405" />
            </linearGradient>
            <linearGradient id="gusSnout" x1="0%" y1="0%" x2="0%" y2="100%">
              <stop offset="0%" stopColor="#FDE047" />
              <stop offset="60%" stopColor="#D97706" />
              <stop offset="100%" stopColor="#92400E" />
            </linearGradient>
            <linearGradient id="plaidRed" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="#DC2626" />
              <stop offset="50%" stopColor="#991B1B" />
              <stop offset="100%" stopColor="#7F1D1D" />
            </linearGradient>
            <linearGradient id="rangerHat" x1="0%" y1="0%" x2="0%" y2="100%">
              <stop offset="0%" stopColor="#65A30D" />
              <stop offset="100%" stopColor="#365314" />
            </linearGradient>
          </defs>

          {/* Woody Stump Platform */}
          <ellipse cx="80" cy="188" rx="60" ry="12" fill="#1C0E06" stroke="#542F0B" strokeWidth="2" />
          <ellipse cx="80" cy="186" rx="54" ry="9" fill="#3D1E0C" />
          {/* Annual rings */}
          <ellipse cx="80" cy="186" rx="40" ry="6" fill="none" stroke="#663311" strokeWidth="1" />
          <ellipse cx="80" cy="186" rx="24" ry="4" fill="none" stroke="#663311" strokeWidth="1" />

          {/* Bear Legs / Boots */}
          <ellipse cx="56" cy="172" rx="14" ry="12" fill="#2A1405" stroke="#000" strokeWidth="1" />
          <ellipse cx="104" cy="172" rx="14" ry="12" fill="#2A1405" stroke="#000" strokeWidth="1" />
          {/* Boots */}
          <path d="M42 176 Q56 182 70 178 L70 184 Q56 188 42 184 Z" fill="#78350F" />
          <path d="M90 178 Q104 182 118 176 L118 184 Q104 188 90 184 Z" fill="#78350F" />

          {/* Massive Bear Body */}
          <ellipse
            cx="80"
            cy="128"
            rx="46"
            ry="44"
            fill="url(#gusFur)"
            stroke="#1C0A00"
            strokeWidth="2"
            className={mascotState === 'idle' ? 'animate-pulse' : ''}
          />

          {/* Red Buffalo-Plaid Lumberjack Vest */}
          <path
            d="M38 108 Q80 102 122 108 L126 152 Q80 162 34 152 Z"
            fill="url(#plaidRed)"
            stroke="#450A0A"
            strokeWidth="2"
          />
          {/* Plaid lines */}
          <path d="M54 106 L52 154" stroke="#000" strokeWidth="2.5" opacity="0.6" />
          <path d="M106 106 L108 154" stroke="#000" strokeWidth="2.5" opacity="0.6" />
          <path d="M36 130 Q80 134 124 130" stroke="#000" strokeWidth="2.5" opacity="0.6" />

          {/* Fluffy Tummy Peeking Out with Golden Buckle */}
          <ellipse cx="80" cy="136" rx="20" ry="24" fill="url(#gusSnout)" opacity="0.9" />
          <rect x="72" y="152" width="16" height="12" rx="3" fill="#F59E0B" stroke="#78350F" strokeWidth="1.5" />

          {/* Bear Paws / Arms */}
          {/* Left Arm */}
          <g className={mascotState === 'win' || mascotState === 'bigwin' ? 'animate-bounce origin-[40px_110px]' : ''}>
            <ellipse cx="36" cy="122" rx="12" ry="22" fill="url(#gusFur)" transform="rotate(22 36 122)" stroke="#1C0A00" strokeWidth="1.5" />
            {/* Claws */}
            <circle cx="30" cy="138" r="3.5" fill="#F59E0B" />
            <circle cx="36" cy="142" r="3.5" fill="#F59E0B" />
            <circle cx="43" cy="140" r="3.5" fill="#F59E0B" />
          </g>

          {/* Right Arm waving or thumbs up */}
          <g className={mascotState === 'spinning' ? 'animate-pulse origin-[120px_110px]' : ''}>
            <ellipse cx="124" cy="122" rx="12" ry="22" fill="url(#gusFur)" transform="rotate(-22 124 122)" stroke="#1C0A00" strokeWidth="1.5" />
            {/* Claws */}
            <circle cx="117" cy="140" r="3.5" fill="#F59E0B" />
            <circle cx="124" cy="142" r="3.5" fill="#F59E0B" />
            <circle cx="130" cy="138" r="3.5" fill="#F59E0B" />
          </g>

          {/* Fuzzy Round Bear Ears */}
          <circle cx="48" cy="56" r="14" fill="#542F0B" stroke="#1C0A00" strokeWidth="2" />
          <circle cx="48" cy="56" r="8" fill="#F59E0B" />
          <circle cx="112" cy="56" r="14" fill="#542F0B" stroke="#1C0A00" strokeWidth="2" />
          <circle cx="112" cy="56" r="8" fill="#F59E0B" />

          {/* Round Bear Head */}
          <circle
            cx="80"
            cy="76"
            rx="38"
            fill="url(#gusFur)"
            stroke="#1C0A00"
            strokeWidth="2"
          />

          {/* Big Warm Snout / Muzzle */}
          <ellipse cx="80" cy="86" rx="22" ry="16" fill="url(#gusSnout)" stroke="#78350F" strokeWidth="1.5" />

          {/* Shiny Black Heart-Shaped Nose */}
          <path d="M72 78 Q80 75 88 78 Q84 88 80 91 Q76 88 72 78 Z" fill="#0F172A" stroke="#000" strokeWidth="1" />
          <circle cx="76" cy="80" r="1.5" fill="#FFF" opacity="0.8" />

          {/* Big Cheerful Smile */}
          <path d="M72 93 Q80 100 88 93" fill="none" stroke="#2A1405" strokeWidth="2.5" strokeLinecap="round" />
          {mascotState === 'win' || mascotState === 'bigwin' ? (
            <path d="M73 93 Q80 106 87 93 Z" fill="#EF4444" stroke="#7F1D1D" strokeWidth="1" />
          ) : null}

          {/* Expressive Cartoon Eyes */}
          <g>
            {/* Sclera */}
            <ellipse cx="64" cy="68" rx="8" ry="10" fill="#FFF" stroke="#2A1405" strokeWidth="1.5" />
            <ellipse cx="96" cy="68" rx="8" ry="10" fill="#FFF" stroke="#2A1405" strokeWidth="1.5" />
            {/* Pupils */}
            <circle
              cx={mascotState === 'spinning' ? '66' : '64'}
              cy="69"
              r="5.5"
              fill={mascotState === 'anticipation' ? '#F59E0B' : '#0F172A'}
              className={mascotState === 'anticipation' ? 'animate-pulse' : ''}
            />
            <circle
              cx={mascotState === 'spinning' ? '98' : '96'}
              cy="69"
              r="5.5"
              fill={mascotState === 'anticipation' ? '#F59E0B' : '#0F172A'}
              className={mascotState === 'anticipation' ? 'animate-pulse' : ''}
            />
            {/* Highlights */}
            <circle cx="62" cy="66" r="2" fill="#FFF" />
            <circle cx="94" cy="66" r="2" fill="#FFF" />
            {/* Friendly Eyebrows */}
            <path d="M56 56 Q64 52 72 57" stroke="#2A1405" strokeWidth="3" fill="none" strokeLinecap="round" />
            <path d="M88 57 Q96 52 104 56" stroke="#2A1405" strokeWidth="3" fill="none" strokeLinecap="round" />
          </g>

          {/* Forest Ranger Hat */}
          <path d="M38 52 Q80 36 122 52 L116 46 Q80 34 44 46 Z" fill="url(#rangerHat)" stroke="#1E293B" strokeWidth="1.5" />
          <path d="M56 46 Q80 20 104 46 Z" fill="url(#rangerHat)" stroke="#1E293B" strokeWidth="1.5" />
          {/* Hat Leather Band with Pine Sprig */}
          <path d="M54 46 Q80 40 106 46" stroke="#78350F" strokeWidth="3.5" fill="none" />
          <path d="M96 44 L102 36 L100 44 L106 38" stroke="#16A34A" strokeWidth="2" strokeLinecap="round" />
        </svg>
      </div>

      {/* Nameplate Badge on Podium */}
      <div className="mt-1 flex items-center space-x-1.5 px-4 py-1 rounded-full bg-gradient-to-r from-[#2a1308] via-[#451e0e] to-[#2a1308] border-2 border-amber-600/80 shadow-lg">
        <Trees className="w-3.5 h-3.5 text-emerald-400" />
        <span className="text-[10px] font-black uppercase tracking-widest text-amber-300 font-sans">
          GRIZZLY GUS
        </span>
        <Trees className="w-3.5 h-3.5 text-emerald-400" />
      </div>
    </div>
  );
};
