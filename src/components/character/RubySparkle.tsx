import React, { useState, useEffect, useRef } from 'react';
import { soundManager } from '../../audio/soundManager';
import { Star, Sparkles } from 'lucide-react';
import hostessImg from '../../assets/hostess_ruby.jpg';

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
  "Fortune favors the fun, darling!",
  "America's brightest jackpot is waiting for you!",
];

const SPIN_QUOTES = [
  "Spin, spin, spin! Bring home the gold!",
  "Come on lucky tumblers! Make it rain!",
  "Roll 'em high, superstar!",
  "Here comes a big one, I can feel it!",
];

const ANTICIPATION_QUOTES = [
  "OOH! TWO VAULT DOORS! HOLD YOUR BREATH!",
  "COME ON REEL FIVE! UNLOCK THE FORTRESS!",
  "JUST ONE MORE SCATTER, SUPERSTAR!",
];

const WIN_QUOTES = [
  "YAY! YOU DID IT! THAT'S A WINNER!",
  "WOOHOO! KA-CHING, SUPERSTAR!",
  "LOOK AT THAT BEAUTIFUL PAYOUT!",
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
  const [tapBonusText, setTapBonusText] = useState<string | null>(null);
  const quoteTimerRef = useRef<number | null>(null);

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

    if (rubyState === 'anticipation') {
      soundManager.speakHostess('Two vault doors! Come on, give us the third!');
    } else if (rubyState === 'bigwin') {
      soundManager.playChampagnePop();
      soundManager.speakHostess('Holy jackpot superstar! You broke the bank!');
    }
  }, [rubyState]);

  useEffect(() => {
    if (rubyState === 'idle') {
      quoteTimerRef.current = window.setInterval(() => {
        const quote = IDLE_QUOTES[Math.floor(Math.random() * IDLE_QUOTES.length)];
        setCurrentQuote(quote);
      }, 8000);
    }
    return () => {
      if (quoteTimerRef.current) clearInterval(quoteTimerRef.current);
    };
  }, [rubyState]);

  const handleRubyClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    setIsTapped(true);
    soundManager.playKissChime();
    soundManager.playCoinTally();

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
    setTimeout(() => setTapBonusText(null), 3500);
  };

  // Compact Badge for Mobile
  if (variant === 'compact') {
    return (
      <div
        onClick={handleRubyClick}
        className="relative group cursor-pointer select-none flex items-center space-x-2 bg-gradient-to-r from-rose-950 via-casino-900 to-amber-950 px-2.5 py-1 rounded-full border border-rose-500/50 shadow-[0_0_15px_rgba(244,63,94,0.4)] transition-all hover:scale-105 active:scale-95"
        title="Tap Ruby Sparkle for lucky sparkles and +50 bonus coins!"
      >
        {/* Illustrated Portrait Circle */}
        <div className="relative w-8 h-8 rounded-full overflow-hidden border-2 border-rose-400 bg-black flex-shrink-0 shadow-[0_0_8px_rgba(244,63,94,0.7)]">
          <img
            src={hostessImg}
            alt="Ruby Sparkle"
            className="w-full h-full object-cover object-top"
          />
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

  // Full High-Resolution Illustrated Standee for Desktop Flank
  return (
    <div
      onClick={handleRubyClick}
      className={`relative group cursor-pointer select-none transition-transform duration-200 flex flex-col items-center w-56 ${
        isTapped ? 'scale-105' : 'hover:scale-[1.02]'
      }`}
      title="Click Ruby Sparkle for lucky sparkles, friendly cheers & free coins!"
    >
      {/* Speech Bubble cleanly positioned above the standee */}
      <div className="relative mb-2 z-30 w-full max-w-[220px]">
        <div
          className={`relative px-3 py-1.5 rounded-2xl border-2 text-[11px] font-black shadow-xl tracking-wide transition-all ${
            rubyState === 'fever'
              ? 'bg-gradient-to-r from-red-600 via-rose-500 to-amber-400 text-black border-red-200 animate-pulse'
              : rubyState === 'anticipation'
              ? 'bg-rose-950 text-rose-100 border-rose-400 shadow-[0_0_15px_rgba(244,63,94,0.8)] animate-bounce'
              : rubyState === 'win' || rubyState === 'bigwin'
              ? 'bg-gradient-to-r from-rose-600 via-pink-600 to-amber-500 text-white border-white shadow-[0_0_18px_rgba(244,63,94,0.9)] animate-pulse'
              : 'bg-casino-900/95 text-rose-200 border-rose-500/50 shadow-[0_4px_12px_rgba(0,0,0,0.8)]'
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
        <div className="absolute top-4 z-40 animate-coin-burst pointer-events-none flex items-center space-x-1 text-rose-300 font-black text-sm drop-shadow-[0_0_10px_rgba(244,63,94,1)]">
          <Star className="w-4 h-4 fill-yellow-300 text-yellow-300" />
          <span>+50 COINS!</span>
        </div>
      )}

      {/* High-Resolution Illustrated Curvy Hostess Standee */}
      <div className="relative w-52 h-[340px] rounded-2xl overflow-hidden border-2 border-yellow-400/60 shadow-[0_0_30px_rgba(244,63,94,0.5),inset_0_0_20px_rgba(0,0,0,0.9)] bg-black">
        <img
          src={hostessImg}
          alt="Ruby Sparkle - Casino Hostess"
          className={`w-full h-full object-cover object-top transition-transform duration-300 ${
            rubyState === 'win' || rubyState === 'bigwin'
              ? 'scale-105 animate-pulse'
              : rubyState === 'anticipation'
              ? 'scale-105'
              : 'hover:scale-102'
          }`}
        />

        {/* Ambient Warm Golden Rim Glow */}
        <div className="absolute inset-0 pointer-events-none ring-1 ring-inset ring-yellow-300/40 rounded-2xl" />
        <div className="absolute bottom-0 inset-x-0 h-20 bg-gradient-to-t from-black via-black/60 to-transparent pointer-events-none" />

        {/* Pedestal Nameplate */}
        <div className="absolute bottom-2 inset-x-3 bg-gradient-to-r from-rose-950 via-casino-900 to-amber-950 py-1 px-2 rounded-lg border border-yellow-400/60 shadow-lg text-center">
          <div className="text-[10px] font-black tracking-widest text-yellow-300 uppercase flex items-center justify-center space-x-1">
            <Sparkles className="w-3 h-3 text-rose-400" />
            <span>RUBY SPARKLE</span>
            <Sparkles className="w-3 h-3 text-rose-400" />
          </div>
          <div className="text-[8px] text-rose-300 font-semibold tracking-wider uppercase">
            VIP CASINO HOSTESS
          </div>
        </div>
      </div>
    </div>
  );
};
