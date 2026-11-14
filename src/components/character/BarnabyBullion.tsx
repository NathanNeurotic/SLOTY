import React, { useState, useEffect } from 'react';
import { soundManager } from '../../audio/soundManager';
import { Sparkles, DollarSign } from 'lucide-react';

export type MascotState = 'idle' | 'spinning' | 'anticipation' | 'win' | 'bigwin' | 'fever';

interface BarnabyBullionProps {
  isSpinning: boolean;
  isAnticipating: boolean;
  isWinning: boolean;
  isBigWin?: boolean;
  isFeverMode?: boolean;
  winAmount?: number;
  onRewardCoins?: (amount: number) => void;
  variant?: 'full' | 'compact';
}

const IDLE_QUOTES = [
  "Vault's ripe for the pickin' today, partner!",
  "Feelin' lucky? The reels are runnin' hot!",
  "Barnaby smells a jackpot in the air!",
  "Give her a spin! Fortune favors the bold!",
  "24 karats of pure gold waitin' for ya!",
  "Tap my hat for a little pocket change!",
];

const SPIN_QUOTES = [
  "Roll 'em high, partner!",
  "Come to Barnaby! Big money!",
  "Spin those golden tumblers!",
  "Feel that mechanical rhythm!",
  "Watch that center reel drop!",
];

const ANTICIPATION_QUOTES = [
  "HOLD YOUR BREATH! TWO VAULT DOORS!",
  "SWEET MOTHER OF GOLD! JUST ONE MORE!",
  "COME ON REEL FIVE! UNLOCK THE VAULT!",
  "I CAN SMELL THE BULLION!",
];

const WIN_QUOTES = [
  "KA-CHING! CASH ON THE BARRELHEAD!",
  "THAT'S WHAT I CALL PAYDIRT!",
  "PURE PROFIT, PARTNER!",
  "STACK THEM BULLION BARS HIGH!",
  "WE'RE IN THE MONEY NOW!",
];

const BIG_WIN_QUOTES = [
  "HOLY FORT KNOX! YOU'RE ROLLING IN IT!",
  "MASSIVE JACKPOT! CALL THE MINT TRUCK!",
  "YOU BROKE THE BANK! CHAMPAGNE FOR EVERYONE!",
];

const FEVER_QUOTES = [
  "HYPER FEVER OVERDRIVE! 2X MULTIPLIERS!",
  "THE VAULT IS ON FIRE! DOUBLE PAYOUTS!",
  "LET 'ER RIP! MAX POWER!",
];

export const BarnabyBullion: React.FC<BarnabyBullionProps> = ({
  isSpinning,
  isAnticipating,
  isWinning,
  isBigWin = false,
  isFeverMode = false,
  winAmount = 0,
  onRewardCoins,
  variant = 'full',
}) => {
  const [idleIndex, setIdleIndex] = useState(0);
  const [reactionIndex, setReactionIndex] = useState(0);
  const [isTapped, setIsTapped] = useState(false);
  const [showCoinSpark, setShowCoinSpark] = useState(false);
  const [tapBonusText, setTapBonusText] = useState<string | null>(null);
  const [cooldownLeft, setCooldownLeft] = useState(0);

  // Compute mascot operational state
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

  const pool =
    mascotState === 'fever'
      ? FEVER_QUOTES
      : mascotState === 'bigwin'
      ? BIG_WIN_QUOTES
      : mascotState === 'win'
      ? WIN_QUOTES
      : mascotState === 'anticipation'
      ? ANTICIPATION_QUOTES
      : mascotState === 'spinning'
      ? SPIN_QUOTES
      : IDLE_QUOTES;

  const baseQuote =
    winAmount > 0 && (mascotState === 'win' || mascotState === 'bigwin')
      ? `KA-CHING! +${winAmount.toLocaleString()} COINS!`
      : pool[(mascotState === 'idle' ? idleIndex : reactionIndex) % pool.length];
  const currentQuote = tapBonusText || baseQuote;

  // Speak announcement on state transitions without synchronous setState
  useEffect(() => {
    if (mascotState === 'anticipation') {
      soundManager.speakAnnouncement('Two scatters! One more for the vault!');
    } else if (mascotState === 'bigwin') {
      soundManager.speakAnnouncement('Colossal bankroll! High roller payout!');
    }

    if (mascotState !== 'idle') {
      const raf = requestAnimationFrame(() => setReactionIndex((i) => i + 1));
      return () => cancelAnimationFrame(raf);
    }

    const timer = window.setInterval(() => {
      setIdleIndex((i) => i + 1);
    }, 7000);
    return () => clearInterval(timer);
  }, [mascotState]);

  useEffect(() => {
    if (cooldownLeft <= 0) return;
    const t = window.setTimeout(() => setCooldownLeft((c) => Math.max(0, c - 1)), 1000);
    return () => clearTimeout(t);
  }, [cooldownLeft]);

  // Handle clicking on Barnaby for interactive joy & bonus coins
  const handleMascotClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    setIsTapped(true);
    setTimeout(() => setIsTapped(false), 700);
    soundManager.playCoinTally();

    if (cooldownLeft > 0) {
      setIdleIndex((i) => i + 1);
      setTapBonusText(`Vault pocket recharging (${cooldownLeft}s)`);
      setTimeout(() => setTapBonusText(null), 1500);
      return;
    }

    setCooldownLeft(8);
    setShowCoinSpark(true);
    soundManager.playCelebrationWhistle();

    const bonus = 50;
    setTapBonusText(`+${bonus} COINS!`);
    onRewardCoins?.(bonus);

    setTimeout(() => {
      setShowCoinSpark(false);
      setTapBonusText(null);
    }, 1800);
  };

  if (variant === 'compact') {
    return (
      <div
        onClick={handleMascotClick}
        className={`relative flex items-center justify-between w-full max-w-sm px-2.5 py-1 rounded-full border transition-all cursor-pointer shadow-md select-none ${
          mascotState === 'fever'
            ? 'bg-gradient-to-r from-red-950 via-amber-900 to-red-950 border-yellow-300 text-yellow-200 animate-pulse'
            : mascotState === 'anticipation'
            ? 'bg-cyan-950 border-neon-cyan text-cyan-200 shadow-[0_0_12px_rgba(0,240,255,0.7)] animate-bounce'
            : mascotState === 'win' || mascotState === 'bigwin'
            ? 'bg-amber-950 border-yellow-400 text-yellow-300 shadow-[0_0_10px_rgba(251,191,36,0.8)]'
            : 'bg-casino-900/95 border-yellow-500/40 text-amber-200'
        } ${isTapped ? 'scale-105' : 'hover:scale-[1.02]'}`}
        title="Tap Barnaby for +25 bonus coins!"
      >
        {/* Left: Mini Avatar */}
        <div className="flex items-center space-x-1.5 flex-shrink-0">
          <div className="w-6 h-6 rounded-full bg-gradient-to-tr from-amber-600 to-yellow-300 border border-yellow-100 flex items-center justify-center shadow-sm overflow-hidden text-xs">
            🎩
          </div>
          <span className="text-[8.5px] font-black uppercase tracking-wider text-gold-bright">
            BARNABY:
          </span>
        </div>

        {/* Center: Live Quote Banner */}
        <div className="flex-1 px-1.5 overflow-hidden text-center">
          <span className="text-[9.5px] font-bold tracking-tight truncate block">
            {tapBonusText || currentQuote}
          </span>
        </div>

        {/* Right: Interactive Tip Button */}
        <div className="flex items-center space-x-0.5 px-1.5 py-0.5 rounded-full bg-amber-400/25 border border-yellow-400/50 text-[8.5px] font-black text-yellow-300 flex-shrink-0">
          <span>🪙</span>
          <span>+25</span>
        </div>
      </div>
    );
  }

  return (
    <div
      onClick={handleMascotClick}
      className={`relative group cursor-pointer select-none transition-transform duration-200 flex flex-col items-center ${
        isTapped ? 'scale-110' : 'hover:scale-105'
      }`}
      title="Click Barnaby Bullion for a high-roller tip & free gold coins!"
    >
      {/* Dynamic Comic Speech Bubble with Deluxe VLT Voice Quotes */}
      <div className="relative mb-1 z-30 max-w-[210px] sm:max-w-[240px]">
        <div
          className={`relative px-3 py-1.5 rounded-2xl border-2 text-[11px] sm:text-xs font-black shadow-xl tracking-wide transition-all ${
            mascotState === 'fever'
              ? 'bg-gradient-to-r from-red-600 via-amber-500 to-yellow-400 text-black border-yellow-200 animate-pulse'
              : mascotState === 'anticipation'
              ? 'bg-cyan-950 text-cyan-200 border-neon-cyan shadow-[0_0_15px_rgba(0,240,255,0.8)] animate-bounce'
              : mascotState === 'win' || mascotState === 'bigwin'
              ? 'bg-amber-400 text-amber-950 border-white shadow-[0_0_15px_rgba(251,191,36,0.9)] animate-pulse'
              : 'bg-casino-900/95 text-yellow-300 border-yellow-500/50 backdrop-blur-md shadow-[0_4px_12px_rgba(0,0,0,0.8)]'
          }`}
        >
          <div className="flex items-center space-x-1">
            {mascotState === 'anticipation' && <Sparkles className="w-3 h-3 text-cyan-300 animate-spin" />}
            {(mascotState === 'win' || mascotState === 'bigwin') && <DollarSign className="w-3.5 h-3.5 text-amber-950 animate-ping" />}
            <span className="truncate whitespace-normal leading-tight text-center w-full">
              {tapBonusText || currentQuote}
            </span>
          </div>

          {/* Speech bubble tail pointer */}
          <div
            className={`absolute -bottom-2 left-1/2 -translate-x-1/2 w-0 h-0 border-l-[6px] border-l-transparent border-r-[6px] border-r-transparent border-t-[8px] ${
              mascotState === 'fever'
                ? 'border-t-amber-500'
                : mascotState === 'anticipation'
                ? 'border-t-cyan-500'
                : mascotState === 'win' || mascotState === 'bigwin'
                ? 'border-t-amber-400'
                : 'border-t-casino-900'
            }`}
          />
        </div>
      </div>

      {/* Floating bonus coin particle when tapped */}
      {showCoinSpark && (
        <div className="absolute top-2 z-40 animate-coin-float pointer-events-none flex items-center space-x-1 text-gold-bright font-black text-sm drop-shadow-[0_0_8px_rgba(245,158,11,1)]">
          <span>🪙</span>
          <span>+25 COINS!</span>
        </div>
      )}

      {/* The Animated Barnaby Bullion Mascot SVG */}
      <div className="relative w-28 h-28 sm:w-32 sm:h-32 drop-shadow-[0_8px_16px_rgba(0,0,0,0.9)]">
        <svg
          viewBox="0 0 160 160"
          className={`w-full h-full overflow-visible transition-all duration-300 ${
            mascotState === 'anticipation'
              ? 'animate-pulse scale-105'
              : mascotState === 'win' || mascotState === 'bigwin'
              ? 'animate-bounce'
              : mascotState === 'spinning'
              ? 'rotate-1'
              : 'hover:rotate-[-2deg]'
          }`}
        >
          <defs>
            <linearGradient id="barnabyGoldHat" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#FFFBEB" />
              <stop offset="30%" stopColor="#FDE047" />
              <stop offset="60%" stopColor="#D97706" />
              <stop offset="100%" stopColor="#78350F" />
            </linearGradient>
            <linearGradient id="barnabyRubyVest" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#991B1B" />
              <stop offset="50%" stopColor="#7F1D1D" />
              <stop offset="100%" stopColor="#450A0A" />
            </linearGradient>
            <radialGradient id="barnabyMonocleGlass" cx="40%" cy="40%" r="60%">
              <stop offset="0%" stopColor="#E0F2FE" stopOpacity="0.85" />
              <stop offset="60%" stopColor="#38BDF8" stopOpacity="0.5" />
              <stop offset="100%" stopColor="#0369A1" stopOpacity="0.8" />
            </radialGradient>
          </defs>

          {/* 1. Aura glow behind mascot */}
          <circle
            cx="80"
            cy="80"
            r="65"
            fill={
              mascotState === 'fever'
                ? '#F59E0B'
                : mascotState === 'anticipation'
                ? '#00F0FF'
                : mascotState === 'win'
                ? '#FBBF24'
                : '#B45309'
            }
            opacity={mascotState === 'idle' ? '0.15' : '0.4'}
            className={mascotState !== 'idle' ? 'animate-pulse' : ''}
            filter="blur(10px)"
          />

          {/* 2. Velvet Suit Body & Shoulders */}
          <path
            d="M32 152 C32 120, 52 110, 80 110 C108 110, 128 120, 128 152 Z"
            fill="url(#barnabyRubyVest)"
            stroke="#FEF08A"
            strokeWidth="2"
          />

          {/* White Dress Shirt & Gold Bow Tie */}
          <polygon points="80,110 70,126 90,126" fill="#F8FAFC" />
          <polygon points="70,116 80,122 70,128" fill="#F59E0B" stroke="#78350F" strokeWidth="0.8" />
          <polygon points="90,116 80,122 90,128" fill="#F59E0B" stroke="#78350F" strokeWidth="0.8" />
          <circle cx="80" cy="122" r="2.5" fill="#FEF08A" stroke="#78350F" strokeWidth="0.8" />

          {/* Gold Pocket Watch Chain */}
          <path d="M58 134 Q80 144 94 136" fill="none" stroke="#FDE047" strokeWidth="2" strokeDasharray="3 1.5" />

          {/* 3. Rosy Character Head */}
          <ellipse cx="80" cy="80" rx="36" ry="34" fill="#FED7AA" stroke="#78350F" strokeWidth="2.5" />

          {/* Rosy Cheeks */}
          <circle cx="56" cy="88" r="8" fill="#FCA5A5" opacity="0.6" />
          <circle cx="104" cy="88" r="8" fill="#FCA5A5" opacity="0.6" />

          {/* 4. Eyes (Dynamic states!) */}
          {mascotState === 'spinning' ? (
            // Spinning Eyes (Dollar signs)
            <>
              <text x="64" y="80" textAnchor="middle" fill="#15803D" fontWeight="900" fontSize="16" fontFamily="sans-serif">
                $
              </text>
              <text x="96" y="80" textAnchor="middle" fill="#15803D" fontWeight="900" fontSize="16" fontFamily="sans-serif">
                $
              </text>
            </>
          ) : mascotState === 'anticipation' ? (
            // Wide terrified / thrilled eyes with giant pupils
            <>
              <circle cx="64" cy="74" r="9" fill="#FFF" stroke="#78350F" strokeWidth="1.5" />
              <circle cx="64" cy="74" r="5.5" fill="#0C0F18" className="animate-ping" />
              <circle cx="62" cy="72" r="2" fill="#FFF" />

              <circle cx="96" cy="74" r="9" fill="#FFF" stroke="#78350F" strokeWidth="1.5" />
              <circle cx="96" cy="74" r="5.5" fill="#0C0F18" className="animate-ping" />
              <circle cx="94" cy="72" r="2" fill="#FFF" />

              {/* Sweat drop on forehead */}
              <path d="M46 62 Q42 68 46 72 Q50 68 46 62 Z" fill="#38BDF8" className="animate-bounce" />
            </>
          ) : mascotState === 'win' || mascotState === 'bigwin' ? (
            // Star Eyes for winning!
            <>
              <polygon points="64,66 66,72 72,74 66,76 64,82 62,76 56,74 62,72" fill="#F59E0B" stroke="#FFF" strokeWidth="1" />
              <polygon points="96,66 98,72 104,74 98,76 96,82 94,76 88,74 94,72" fill="#F59E0B" stroke="#FFF" strokeWidth="1" />
            </>
          ) : (
            // Natural Alert Eyes
            <>
              <ellipse cx="64" cy="75" rx="6" ry="7.5" fill="#FFF" stroke="#78350F" strokeWidth="1.5" />
              <circle cx="65" cy="76" r="3.5" fill="#1E293B" />
              <circle cx="63.5" cy="74" r="1.2" fill="#FFF" />

              <ellipse cx="96" cy="75" rx="6" ry="7.5" fill="#FFF" stroke="#78350F" strokeWidth="1.5" />
              <circle cx="97" cy="76" r="3.5" fill="#1E293B" />
              <circle cx="95.5" cy="74" r="1.2" fill="#FFF" />
            </>
          )}

          {/* Golden Monocle over Right Eye */}
          <circle cx="96" cy="75" r="12" fill="url(#barnabyMonocleGlass)" stroke="#FBBF24" strokeWidth="2.5" />
          <path d="M108 77 Q118 85 116 114" fill="none" stroke="#FDE047" strokeWidth="1.5" />
          {/* Monocle Glint Reflection */}
          <line x1="91" y1="67" x2="101" y2="72" stroke="#FFF" strokeWidth="2" strokeLinecap="round" opacity="0.9" />

          {/* 5. Big Handlebar Mustache */}
          <path
            d="M80 88 C70 82, 50 82, 44 91 C42 95, 52 95, 62 92 C72 90, 78 93, 80 95 C82 93, 88 90, 98 92 C108 95, 118 95, 116 91 C110 82, 90 82, 80 88 Z"
            fill="#78350F"
            stroke="#FEF08A"
            strokeWidth="1.2"
          />

          {/* Mouth (Open grinning or cheering) */}
          {mascotState === 'win' || mascotState === 'bigwin' ? (
            <g>
              <ellipse cx="80" cy="100" rx="9" ry="6" fill="#991B1B" stroke="#78350F" strokeWidth="1" />
              {/* Single Blinding 24K Gold Tooth */}
              <rect x="76" y="94.5" width="4" height="4" rx="1" fill="#FDE047" stroke="#78350F" strokeWidth="0.6" />
              <polygon points="76,94 77,96 79,96 78,98 78,94" fill="#FFF" />
            </g>
          ) : mascotState === 'anticipation' ? (
            <ellipse cx="80" cy="100" rx="6" ry="7" fill="#78350F" />
          ) : (
            <path d="M74 97 Q80 102 86 97" fill="none" stroke="#78350F" strokeWidth="2" strokeLinecap="round" />
          )}

          {/* 6. Aristocratic 24K Gold Top Hat */}
          {/* Hat Brim */}
          <ellipse cx="80" cy="52" rx="46" ry="11" fill="url(#barnabyGoldHat)" stroke="#FEF08A" strokeWidth="2" />
          {/* Hat Crown Tube */}
          <path
            d="M48 50 L52 14 L108 14 L112 50 Z"
            fill="url(#barnabyGoldHat)"
            stroke="#FEF08A"
            strokeWidth="2"
            strokeLinejoin="round"
          />
          {/* Hat Top Cap */}
          <ellipse cx="80" cy="14" rx="28" ry="6" fill="#FEF08A" stroke="#78350F" strokeWidth="1.5" />

          {/* Crimson Ribbon on Hat */}
          <path d="M50 43 L110 43 L111 49 L49 49 Z" fill="#DC2626" stroke="#991B1B" strokeWidth="0.8" />
          {/* Gold Dollar Buckle on Hat */}
          <rect x="73" y="41.5" width="14" height="9" rx="2" fill="#FEF08A" stroke="#78350F" strokeWidth="1.2" />
          <text x="80" y="49" textAnchor="middle" fill="#78350F" fontWeight="900" fontSize="8" fontFamily="sans-serif">
            $
          </text>

          {/* Hat Top Glint */}
          <polygon points="100,16 102,20 106,21 102,22 100,26 98,22 94,21 98,20" fill="#FFFFFF" />

          {/* 7. Right Hand Holding Ruby-Tipped Golden Cane */}
          <g transform="translate(18, 90)">
            {/* Golden Shaft */}
            <line x1="12" y1="20" x2="4" y2="68" stroke="url(#barnabyGoldHat)" strokeWidth="4.5" strokeLinecap="round" />
            {/* Ruby Knob */}
            <circle cx="13" cy="18" r="7.5" fill="#DC2626" stroke="#FEF08A" strokeWidth="1.5" />
            <circle cx="11.5" cy="16" r="2.5" fill="#FFF" />
          </g>

          {/* 8. Left Hand Flipping a 24K Gold Coin */}
          <g transform="translate(118, 95)">
            <ellipse cx="14" cy="22" rx="7" ry="9" fill="#FED7AA" stroke="#78350F" strokeWidth="1.5" />
            {/* Spinning Coin suspended in mid-air above his fingers */}
            <ellipse
              cx="14"
              cy="8"
              rx="9"
              ry="4"
              fill="#FDE047"
              stroke="#78350F"
              strokeWidth="1.2"
              className={mascotState === 'idle' ? 'animate-bounce' : 'animate-spin'}
            />
          </g>
        </svg>
      </div>

      {/* Mascot Base Plaque: "BARNABY BULLION" */}
      <div className="mt-[-6px] px-2.5 py-0.5 rounded-full bg-gradient-to-r from-amber-600 via-yellow-400 to-amber-600 border border-yellow-200 shadow-md">
        <span className="text-[9px] font-black tracking-wider uppercase text-amber-950 flex items-center space-x-0.5">
          <span>★</span>
          <span>BARNABY BULLION</span>
          <span>★</span>
        </span>
      </div>
    </div>
  );
};
