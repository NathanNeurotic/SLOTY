import React, { useState, useEffect, useRef } from 'react';
import { soundManager } from '../../audio/soundManager';
import { Star, Sparkles } from 'lucide-react';

export type RubyState = 'idle' | 'spinning' | 'anticipation' | 'win' | 'bigwin' | 'fever';

interface RubySparkleProps {
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
  "Hi superstar! Ready to strike gold today?",
  "You've got this! Lady Luck is in the house!",
  "Tap my sparkly dress for a lucky coin shower!",
  "Ooh, these reels are runnin' extra hot today!",
  "Spin it, win it, and let's celebrate together!",
  "Fortune favors the fun, darling!",
  "Oregon's brightest jackpot is waiting for you!",
];

const SPIN_QUOTES = [
  "Spin, spin, spin! Bring home the gold!",
  "Come on lucky tumblers! Make it rain!",
  "Roll 'em high, superstar!",
  "Watch that center reel drop!",
  "Here comes a big one, I can feel it!",
];

const ANTICIPATION_QUOTES = [
  "OOH! TWO VAULT DOORS! HOLD YOUR BREATH!",
  "COME ON REEL FIVE! UNLOCK THE FORTRESS!",
  "JUST ONE MORE SCATTER, SUPERSTAR!",
  "MY HEART IS JUMPING! COME ON!",
];

const WIN_QUOTES = [
  "YAY! YOU DID IT! THAT'S A WINNER!",
  "WOOHOO! KA-CHING, SUPERSTAR!",
  "LOOK AT THAT BEAUTIFUL PAYOUT!",
  "STACK THEM GOLD BARS HIGH!",
  "THAT'S WHAT I CALL A HIGH-ROLLER HIT!",
];

const BIG_WIN_QUOTES = [
  "HOLY MACKEREL! A COLOSSAL JACKPOT!",
  "YOU BROKE THE VAULT, CHAMPION!",
  "CELEBRATION TIME! CONFETTI FOR EVERYONE!",
];

const FEVER_QUOTES = [
  "SUPERCHARGED OVERDRIVE! 2X MULTIPLIERS!",
  "THE VAULT IS ON FIRE! BURN IT UP!",
  "MAX POWER, SUPERSTAR! DON'T STOP NOW!",
];

interface FloatingStarItem {
  id: number;
  tx: number;
  ty: number;
}

export const RubySparkle: React.FC<RubySparkleProps> = ({
  isSpinning,
  isAnticipating,
  isWinning,
  isBigWin = false,
  isFeverMode = false,
  winAmount = 0,
  onRewardCoins,
  variant = 'full',
}) => {
  const [currentQuote, setCurrentQuote] = useState(IDLE_QUOTES[0]);
  const [isTapped, setIsTapped] = useState(false);
  const [stars, setStars] = useState<FloatingStarItem[]>([]);
  const [tapBonusText, setTapBonusText] = useState<string | null>(null);
  const [isWinking, setIsWinking] = useState(false);
  const quoteTimerRef = useRef<number | null>(null);
  const winkTimerRef = useRef<number | null>(null);

  // Compute operational state
  const rubyState: RubyState = isFeverMode
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

  // Reactively update quotes based on events
  useEffect(() => {
    let pool: string[];
    switch (rubyState) {
      case 'fever':
        pool = FEVER_QUOTES;
        break;
      case 'bigwin':
        pool = BIG_WIN_QUOTES;
        break;
      case 'win':
        pool = WIN_QUOTES;
        break;
      case 'anticipation':
        pool = ANTICIPATION_QUOTES;
        break;
      case 'spinning':
        pool = SPIN_QUOTES;
        break;
      default:
        pool = IDLE_QUOTES;
        break;
    }

    const selectedQuote =
      winAmount > 0 && (rubyState === 'win' || rubyState === 'bigwin')
        ? `WOOHOO! +${winAmount.toLocaleString()} COINS FOR THE CHAMPION!`
        : pool[Math.floor(Math.random() * pool.length)];

    setCurrentQuote(selectedQuote);

    // Speak announcement if exciting state
    if (rubyState === 'anticipation') {
      soundManager.speakHostess('Two vault doors! Come on, give us the third!');
    } else if (rubyState === 'bigwin') {
      soundManager.playChampagnePop();
      soundManager.speakHostess('Holy jackpot superstar! You broke the bank!');
    } else if (rubyState === 'win') {
      setIsWinking(true);
      setTimeout(() => setIsWinking(false), 1200);
    }
  }, [rubyState]);

  // Periodic idle chatter cycle
  useEffect(() => {
    if (rubyState === 'idle') {
      quoteTimerRef.current = window.setInterval(() => {
        const quote = IDLE_QUOTES[Math.floor(Math.random() * IDLE_QUOTES.length)];
        setCurrentQuote(quote);
      }, 7000);
    }
    return () => {
      if (quoteTimerRef.current) clearInterval(quoteTimerRef.current);
    };
  }, [rubyState]);

  // Periodic friendly wink in idle
  useEffect(() => {
    const triggerWink = () => {
      setIsWinking(true);
      setTimeout(() => setIsWinking(false), 350);
    };

    winkTimerRef.current = window.setInterval(triggerWink, 5000);
    return () => {
      if (winkTimerRef.current) clearInterval(winkTimerRef.current);
    };
  }, []);

  // Handle clicking on Ruby for interactive friendly bonus & sparkles!
  const handleRubyClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    setIsTapped(true);
    setIsWinking(true);
    soundManager.playKissChime();
    soundManager.playCoinTally();

    // Spawn 4 floating stars
    const newStars: FloatingStarItem[] = [
      { id: Date.now(), tx: -20, ty: -50 },
      { id: Date.now() + 1, tx: 20, ty: -60 },
      { id: Date.now() + 2, tx: -10, ty: -75 },
      { id: Date.now() + 3, tx: 25, ty: -40 },
    ];
    setStars(newStars);

    setTimeout(() => {
      setStars([]);
    }, 1800);

    const bonus = 50;
    if (onRewardCoins) {
      onRewardCoins(bonus);
    }

    const cheerfulPhrases = [
      "Yay! Good luck sparkles for you! +50 Coins!",
      "A sparkly bonus for my favorite player! +50 Coins!",
      "Keep shining superstar! +50 Coins!",
      "High five! That's +50 coins for your bankroll!",
    ];
    const phrase = cheerfulPhrases[Math.floor(Math.random() * cheerfulPhrases.length)];
    setTapBonusText(phrase);
    soundManager.speakHostess(phrase);

    setTimeout(() => setIsTapped(false), 300);
    setTimeout(() => setIsWinking(false), 700);
    setTimeout(() => setTapBonusText(null), 3500);
  };

  // Compact Badge for Mobile / Responsive Viewport
  if (variant === 'compact') {
    return (
      <div
        onClick={handleRubyClick}
        className="relative group cursor-pointer select-none flex items-center space-x-2 bg-gradient-to-r from-rose-950 via-casino-900 to-amber-950 px-2.5 py-1 rounded-full border border-rose-500/50 shadow-[0_0_15px_rgba(244,63,94,0.4)] transition-all hover:scale-105 active:scale-95"
        title="Tap Ruby Sparkle for lucky sparkles and +50 bonus coins!"
      >
        {/* Animated Ruby Miniature Cartoon Avatar */}
        <div className="relative w-8 h-8 rounded-full overflow-hidden border-2 border-rose-400 bg-rose-950 flex-shrink-0 shadow-[0_0_8px_rgba(244,63,94,0.7)]">
          <svg viewBox="0 0 160 160" className="w-full h-full">
            <defs>
              <linearGradient id="rbMiniHair" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#FB7185" />
                <stop offset="50%" stopColor="#E11D48" />
                <stop offset="100%" stopColor="#881337" />
              </linearGradient>
            </defs>
            {/* Hair */}
            <circle cx="80" cy="80" r="65" fill="url(#rbMiniHair)" />
            {/* Face */}
            <ellipse cx="80" cy="88" rx="42" ry="44" fill="#FED7AA" />
            {/* Cheeks */}
            <circle cx="56" cy="96" r="10" fill="#FB7185" opacity="0.65" />
            <circle cx="104" cy="96" r="10" fill="#FB7185" opacity="0.65" />
            {/* Big Expressive Cartoon Eyes */}
            <ellipse cx="62" cy="82" rx="9" ry="11" fill="#FFFFFF" />
            <circle cx="63" cy="83" r="6" fill="#0284C7" />
            <circle cx="61" cy="80" r="2" fill="#FFFFFF" />

            {isWinking ? (
              <path d="M92 85 Q102 75 112 85" stroke="#881337" strokeWidth="3.5" fill="none" strokeLinecap="round" />
            ) : (
              <>
                <ellipse cx="98" cy="82" rx="9" ry="11" fill="#FFFFFF" />
                <circle cx="97" cy="83" r="6" fill="#0284C7" />
                <circle cx="95" cy="80" r="2" fill="#FFFFFF" />
              </>
            )}
            {/* Huge Friendly Smile */}
            <path d="M66 108 Q80 126 94 108 Z" fill="#DC2626" />
            <path d="M72 108 Q80 114 88 108" fill="#FFFFFF" />
            {/* Gold Tiara */}
            <polygon points="62,46 72,32 80,42 88,32 98,46" fill="#FDE047" stroke="#B45309" strokeWidth="1.5" />
          </svg>
          <div className="absolute inset-0 rounded-full ring-1 ring-inset ring-rose-400/50" />
        </div>

        {/* Dynamic Speech Text */}
        <div className="flex-1 min-w-0 pr-1">
          <div className="text-[10px] text-rose-300 font-bold uppercase tracking-wider flex items-center space-x-1">
            <span>RUBY SPARKLE</span>
            <Sparkles className="w-2.5 h-2.5 text-yellow-300 inline animate-spin" />
          </div>
          <div className="text-xs text-yellow-200 font-semibold truncate max-w-[190px] sm:max-w-[280px]">
            {tapBonusText || currentQuote}
          </div>
        </div>

        {/* Quick Bonus Pill */}
        <div className="flex items-center space-x-1 bg-rose-600 hover:bg-rose-500 text-white font-black text-[10px] px-2 py-0.5 rounded-full shadow-[0_0_8px_rgba(244,63,94,0.8)] flex-shrink-0 animate-pulse">
          <Star className="w-3 h-3 fill-white" />
          <span>+50</span>
        </div>
      </div>
    );
  }

  // Full Flanking Character Display for Desktop / Wide screens
  return (
    <div
      onClick={handleRubyClick}
      className={`relative group cursor-pointer select-none transition-transform duration-200 flex flex-col items-center ${
        isTapped ? 'scale-110' : 'hover:scale-105'
      }`}
      title="Click Ruby Sparkle for lucky sparkles, friendly cheers & free coins!"
    >
      {/* Dynamic Comic Speech Bubble */}
      <div className="relative mb-1 z-30 max-w-[210px] sm:max-w-[240px]">
        <div
          className={`relative px-3 py-1.5 rounded-2xl border-2 text-[11px] sm:text-xs font-black shadow-xl tracking-wide transition-all ${
            rubyState === 'fever'
              ? 'bg-gradient-to-r from-red-600 via-rose-500 to-amber-400 text-black border-red-200 animate-pulse'
              : rubyState === 'anticipation'
              ? 'bg-rose-950 text-rose-100 border-rose-400 shadow-[0_0_15px_rgba(244,63,94,0.8)] animate-bounce'
              : rubyState === 'win' || rubyState === 'bigwin'
              ? 'bg-gradient-to-r from-rose-600 via-pink-600 to-amber-500 text-white border-white shadow-[0_0_18px_rgba(244,63,94,0.9)] animate-pulse'
              : 'bg-casino-900/95 text-rose-200 border-rose-500/50 backdrop-blur-md shadow-[0_4px_12px_rgba(0,0,0,0.8)]'
          }`}
        >
          <div className="flex items-center space-x-1">
            {rubyState === 'anticipation' && <Sparkles className="w-3.5 h-3.5 text-yellow-300 animate-spin" />}
            {(rubyState === 'win' || rubyState === 'bigwin') && <Star className="w-3.5 h-3.5 text-yellow-300 fill-yellow-300 animate-ping" />}
            <span className="truncate whitespace-normal leading-tight text-center w-full">
              {tapBonusText || currentQuote}
            </span>
          </div>

          {/* Speech bubble tail pointer */}
          <div
            className={`absolute -bottom-2 left-1/2 -translate-x-1/2 w-0 h-0 border-l-[6px] border-l-transparent border-r-[6px] border-r-transparent border-t-[8px] ${
              rubyState === 'fever'
                ? 'border-t-rose-500'
                : rubyState === 'anticipation'
                ? 'border-t-rose-400'
                : rubyState === 'win' || rubyState === 'bigwin'
                ? 'border-t-rose-600'
                : 'border-t-casino-900'
            }`}
          />
        </div>
      </div>

      {/* Floating bonus coin particle when tapped */}
      {tapBonusText && (
        <div className="absolute top-2 z-40 animate-coin-burst pointer-events-none flex items-center space-x-1 text-rose-300 font-black text-sm drop-shadow-[0_0_10px_rgba(244,63,94,1)]">
          <Star className="w-4 h-4 fill-yellow-300 text-yellow-300" />
          <span>+50 COINS!</span>
        </div>
      )}

      {/* Floating Cartoon Sparkle Stars */}
      {stars.map((s) => (
        <div
          key={s.id}
          style={
            {
              '--tx': `${s.tx}px`,
              '--ty': `${s.ty}px`,
            } as React.CSSProperties
          }
          className="absolute z-50 pointer-events-none animate-coin-burst text-yellow-300 drop-shadow-[0_0_8px_rgba(253,224,71,1)]"
        >
          ✨
        </div>
      ))}

      {/* Beautiful Curvy Cartoon Character in Shiny Sparkling Red Dress */}
      <div className="relative w-32 h-36 sm:w-36 sm:h-40 drop-shadow-[0_10px_20px_rgba(0,0,0,0.95)]">
        <svg
          viewBox="0 0 160 180"
          className={`w-full h-full overflow-visible transition-all duration-300 ${
            rubyState === 'anticipation'
              ? 'animate-pulse scale-105'
              : rubyState === 'win' || rubyState === 'bigwin'
              ? 'animate-bounce'
              : rubyState === 'spinning'
              ? 'rotate-[-1deg]'
              : 'hover:rotate-[2deg]'
          }`}
        >
          <defs>
            {/* Glossy Metallic Red Dress Gradient */}
            <linearGradient id="rubyDressGrad" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#FFF1F2" />
              <stop offset="15%" stopColor="#FB7185" />
              <stop offset="45%" stopColor="#E11D48" />
              <stop offset="80%" stopColor="#9F1239" />
              <stop offset="100%" stopColor="#4C0519" />
            </linearGradient>

            {/* Specular White Dress Sheen */}
            <linearGradient id="rubySheen" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="#FFFFFF" stopOpacity="0" />
              <stop offset="50%" stopColor="#FFFFFF" stopOpacity="0.7" />
              <stop offset="100%" stopColor="#FFFFFF" stopOpacity="0" />
            </linearGradient>

            {/* Luscious Auburn Cartoon Hair Gradient */}
            <linearGradient id="rubyHairGrad" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#FDA4AF" />
              <stop offset="30%" stopColor="#F43F5E" />
              <stop offset="70%" stopColor="#BE123C" />
              <stop offset="100%" stopColor="#4C0519" />
            </linearGradient>

            {/* 24K Gold Jewelry Gradient */}
            <linearGradient id="rubyGoldGrad" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#FFFBEB" />
              <stop offset="35%" stopColor="#FDE047" />
              <stop offset="70%" stopColor="#D97706" />
              <stop offset="100%" stopColor="#78350F" />
            </linearGradient>
          </defs>

          {/* 1. Cheerful Aura Glow */}
          <circle
            cx="80"
            cy="90"
            r="70"
            fill={
              rubyState === 'fever'
                ? '#F59E0B'
                : rubyState === 'anticipation'
                ? '#FB7185'
                : rubyState === 'win'
                ? '#F43F5E'
                : '#BE123C'
            }
            opacity={rubyState === 'idle' ? '0.2' : '0.45'}
            className={rubyState !== 'idle' ? 'animate-pulse' : ''}
            filter="blur(12px)"
          />

          {/* 2. Bouncy Flowing Back Hair Curls */}
          <path
            d="M20 75 C10 105, 18 140, 40 160 C32 135, 30 100, 38 75 Z"
            fill="url(#rubyHairGrad)"
            stroke="#881337"
            strokeWidth="1.5"
          />
          <path
            d="M140 75 C150 105, 142 140, 120 160 C128 135, 130 100, 122 75 Z"
            fill="url(#rubyHairGrad)"
            stroke="#881337"
            strokeWidth="1.5"
          />

          {/* 3. Voluptuous Curvy Silhouette: Hourglass Body & Sparkling Red Dress */}
          {/* Curvy Hips & Waist Contour */}
          <path
            d="M50 178 C44 145, 54 135, 62 120 C68 110, 72 108, 80 108 C88 108, 92 110, 98 120 C106 135, 116 145, 110 178 Z"
            fill="url(#rubyDressGrad)"
            stroke="#FDE047"
            strokeWidth="2"
          />

          {/* Shiny Specular Sheen Stripe down the curve */}
          <path
            d="M62 120 C68 135, 64 155, 60 176 L68 176 C72 155, 76 135, 70 120 Z"
            fill="url(#rubySheen)"
          />

          {/* Sweetheart Neckline with Sparkly Gold Trim */}
          <path
            d="M56 108 C64 116, 74 116, 80 110 C86 116, 96 116, 104 108 C102 124, 58 124, 56 108 Z"
            fill="#FED7AA"
            stroke="#B45309"
            strokeWidth="1"
          />
          <path
            d="M54 108 C64 118, 74 118, 80 112 C86 118, 96 118, 106 108"
            fill="none"
            stroke="#FDE047"
            strokeWidth="2.5"
          />

          {/* Sparkling Sequin Starbursts on the Dress! */}
          <g className="animate-pulse">
            <polygon points="70,132 72,136 76,137 73,140 74,144 70,142 66,144 67,140 64,137 68,136" fill="#FFFFFF" />
            <polygon points="90,145 92,148 95,149 93,151 94,154 90,152 87,154 88,151 86,149 89,148" fill="#FFFBEB" />
            <polygon points="78,160 80,163 83,164 81,166 82,169 78,167 75,169 76,166 74,164 77,163" fill="#FFFFFF" />
            <polygon points="60,150 61,153 64,153 62,155 63,158 60,156 58,158 59,155 57,153 59,153" fill="#FDE047" />
            <polygon points="100,162 101,165 104,165 102,167 103,170 100,168 98,170 99,167 97,165 99,165" fill="#FFFFFF" />
          </g>

          {/* 4. Elegant Cartoon Neck & 24K Star Necklace */}
          <path d="M72 88 L72 106 L88 106 L88 88 Z" fill="#FED7AA" />
          {/* Gold Choker with Star Charm */}
          <rect x="71" y="98" width="18" height="3" fill="url(#rubyGoldGrad)" rx="1.5" />
          <polygon
            points="80,100 81.5,104 85,104.5 82.5,107 83,110.5 80,109 77,110.5 77.5,107 75,104.5 78.5,104"
            fill="#FDE047"
            stroke="#78350F"
            strokeWidth="0.5"
            className="animate-spin"
            style={{ transformOrigin: '80px 105px', animationDuration: '6s' }}
          />

          {/* 5. Comically Friendly Cartoon Head */}
          <ellipse cx="80" cy="68" rx="33" ry="32" fill="#FED7AA" stroke="#78350F" strokeWidth="2" />

          {/* Bright Rosy Cheeks */}
          <circle cx="58" cy="74" r="8" fill="#FB7185" opacity="0.7" />
          <circle cx="102" cy="74" r="8" fill="#FB7185" opacity="0.7" />

          {/* 6. Big Expressive Friendly Cartoon Eyes */}
          {/* Left Eye */}
          <g>
            <ellipse cx="65" cy="64" rx="10" ry="12" fill="#FFFFFF" stroke="#1E1B4B" strokeWidth="1.5" />
            {/* Big Blue Pupil with Twinkle Star */}
            <circle cx="66" cy="64" r="7" fill="#0284C7" />
            <circle cx="66" cy="64" r="4" fill="#0369A1" />
            <circle cx="63.5" cy="61" r="2.5" fill="#FFFFFF" />
            <circle cx="68" cy="67" r="1.2" fill="#FFFFFF" />
            {/* Long Friendly Curved Lashes */}
            <path d="M54 58 Q64 50 74 58" fill="none" stroke="#1E1B4B" strokeWidth="2.5" strokeLinecap="round" />
            <path d="M53 57 L49 53" stroke="#1E1B4B" strokeWidth="2" strokeLinecap="round" />
            <path d="M55 55 L53 50" stroke="#1E1B4B" strokeWidth="2" strokeLinecap="round" />
          </g>

          {/* Right Eye (Can Wink!) */}
          <g>
            {isWinking ? (
              // Cute Comic Wink Lash Arch!
              <>
                <path
                  d="M86 64 Q96 73 106 64"
                  fill="none"
                  stroke="#1E1B4B"
                  strokeWidth="3.5"
                  strokeLinecap="round"
                />
                <path d="M106 64 L111 60" stroke="#1E1B4B" strokeWidth="2" strokeLinecap="round" />
                <path d="M104 66 L108 70" stroke="#1E1B4B" strokeWidth="2" strokeLinecap="round" />
              </>
            ) : (
              // Big Open Cartoon Eye
              <>
                <ellipse cx="95" cy="64" rx="10" ry="12" fill="#FFFFFF" stroke="#1E1B4B" strokeWidth="1.5" />
                <circle cx="94" cy="64" r="7" fill="#0284C7" />
                <circle cx="94" cy="64" r="4" fill="#0369A1" />
                <circle cx="91.5" cy="61" r="2.5" fill="#FFFFFF" />
                <circle cx="96" cy="67" r="1.2" fill="#FFFFFF" />
                <path d="M86 58 Q96 50 106 58" fill="none" stroke="#1E1B4B" strokeWidth="2.5" strokeLinecap="round" />
                <path d="M107 57 L111 53" stroke="#1E1B4B" strokeWidth="2" strokeLinecap="round" />
                <path d="M105 55 L107 50" stroke="#1E1B4B" strokeWidth="2" strokeLinecap="round" />
              </>
            )}
          </g>

          {/* Friendly Eyebrows */}
          <path d="M55 52 Q65 45 74 51" fill="none" stroke="#991B1B" strokeWidth="2.5" strokeLinecap="round" />
          <path d="M86 51 Q95 45 105 52" fill="none" stroke="#991B1B" strokeWidth="2.5" strokeLinecap="round" />

          {/* Dainty Cartoon Nose */}
          <path d="M80 67 Q82 72 78 73" fill="none" stroke="#D97706" strokeWidth="1.5" strokeLinecap="round" />

          {/* Huge Friendly Wholesome Cartoon Smile */}
          <path
            d="M68 78 Q80 94 92 78 Z"
            fill="#DC2626"
            stroke="#991B1B"
            strokeWidth="1.5"
          />
          {/* Bright White Smile Teeth */}
          <path d="M72 78 Q80 84 88 78" fill="#FFFFFF" stroke="#FFFFFF" strokeWidth="1" />

          {/* 7. Voluminous Jessica/Betty Cartoon Ginger Hair */}
          <path
            d="M48 58 C42 32, 60 18, 80 18 C102 18, 118 32, 112 58 C104 38, 88 36, 76 42 C62 48, 52 46, 48 58 Z"
            fill="url(#rubyHairGrad)"
            stroke="#881337"
            strokeWidth="2"
          />
          {/* Swept Front Bang */}
          <path
            d="M52 38 C64 32, 86 36, 92 48 C82 44, 68 42, 52 38 Z"
            fill="#FB7185"
            opacity="0.8"
          />

          {/* 8. 24K Gold Crown / Star Tiara */}
          <g transform="translate(68, 12)">
            <polygon
              points="12,0 15,8 24,9 17,15 19,23 12,18 5,23 7,15 0,9 9,8"
              fill="url(#rubyGoldGrad)"
              stroke="#B45309"
              strokeWidth="1"
              className="animate-sparkle-glitz"
            />
            <circle cx="12" cy="12" r="3" fill="#FFFFFF" />
          </g>

          {/* 9. Curvy Posing Cartoon Arms: Left Arm on shapely hip with gold bangles */}
          <path
            d="M104 114 C116 122, 122 135, 112 148 C108 142, 102 136, 98 130"
            fill="none"
            stroke="#FED7AA"
            strokeWidth="7"
            strokeLinecap="round"
          />
          {/* Gold Bangles on Wrist */}
          <ellipse cx="108" cy="144" rx="5" ry="2.5" fill="none" stroke="url(#rubyGoldGrad)" strokeWidth="2.5" />

          {/* Right Arm waving or holding giant gold coin */}
          <path
            d="M56 114 C44 122, 38 135, 48 148 C52 142, 58 136, 62 130"
            fill="none"
            stroke="#FED7AA"
            strokeWidth="7"
            strokeLinecap="round"
          />
          {/* Giant Gold Coin in Hand */}
          <g transform="translate(36, 142)">
            <circle cx="8" cy="8" r="9" fill="url(#rubyGoldGrad)" stroke="#FEF08A" strokeWidth="1.2" />
            <text x="8" y="11" textAnchor="middle" fill="#78350F" fontWeight="900" fontSize="10" fontFamily="sans-serif">
              $
            </text>
          </g>

          {/* 10. Starburst Glint Overlay */}
          <g className="animate-spin" style={{ transformOrigin: '80px 20px', animationDuration: '7s' }}>
            <line x1="80" y1="14" x2="80" y2="26" stroke="#FFF" strokeWidth="1.5" strokeLinecap="round" opacity="0.8" />
            <line x1="74" y1="20" x2="86" y2="20" stroke="#FFF" strokeWidth="1.5" strokeLinecap="round" opacity="0.8" />
          </g>
        </svg>
      </div>

      {/* Companion Identity Plaque */}
      <div className="mt-1 flex items-center space-x-1 bg-gradient-to-r from-rose-950 via-casino-900 to-amber-950 px-3 py-0.5 rounded-full border border-rose-500/40 shadow-[0_2px_8px_rgba(0,0,0,0.8)]">
        <Sparkles className="w-3 h-3 text-rose-400 animate-spin" />
        <span className="text-[10px] sm:text-xs font-black tracking-widest text-rose-200 uppercase">
          RUBY SPARKLE
        </span>
        <span className="text-[9px] text-amber-300 font-bold bg-rose-900/60 px-1.5 py-0.2 rounded border border-rose-500/30">
          HOSTESS
        </span>
      </div>
    </div>
  );
};
