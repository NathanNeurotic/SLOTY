import React, { useState, useEffect, useRef } from 'react';
import { soundManager } from '../../audio/soundManager';
import { Star, Sparkles } from 'lucide-react';
import hostessImg from '../../assets/hostess_ruby.webp';

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

const VAULT_IDLE_QUOTES = [
  "Hi superstar! Ready to strike gold today?",
  "You've got this! Lady Luck is in the house!",
  "Tap my sparkly dress for a lucky coin shower!",
  "Ooh, these reels are runnin' extra hot today!",
  "Fortune favors the fun, darling!",
  "America's brightest jackpot is waiting for you!",
];

const VAULT_SPIN_QUOTES = [
  "Spin, spin, spin! Bring home the gold!",
  "Come on lucky tumblers! Make it rain!",
  "Roll 'em high, superstar!",
  "Here comes a big one, I can feel it!",
];

const VAULT_ANTICIPATION_QUOTES = [
  "OOH! TWO VAULT DOORS! HOLD YOUR BREATH!",
  "COME ON REEL FIVE! UNLOCK THE FORTRESS!",
  "JUST ONE MORE SCATTER, SUPERSTAR!",
];

const VAULT_WIN_QUOTES = [
  "YAY! YOU DID IT! THAT'S A WINNER!",
  "WOOHOO! KA-CHING, SUPERSTAR!",
  "LOOK AT THAT BEAUTIFUL PAYOUT!",
  "THAT'S WHAT I CALL A HIGH-ROLLER HIT!",
];

const VAULT_BIG_WIN_QUOTES = [
  "HOLY MACKEREL! A COLOSSAL JACKPOT!",
  "YOU BROKE THE VAULT, CHAMPION!",
  "CELEBRATION TIME! CONFETTI FOR EVERYONE!",
];

const VAULT_FEVER_QUOTES = [
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
  winAmount: _winAmount = 0,
  onRewardCoins,
  variant = 'full',
}) => {
  const [currentQuote, setCurrentQuote] = useState(VAULT_IDLE_QUOTES[0]);
  const [isTapped, setIsTapped] = useState(false);
  const [tapBonusText, setTapBonusText] = useState<string | null>(null);
  const [cooldownLeft, setCooldownLeft] = useState(0);
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
        pool = VAULT_FEVER_QUOTES;
        break;
      case 'bigwin':
        pool = VAULT_BIG_WIN_QUOTES;
        break;
      case 'win':
        pool = VAULT_WIN_QUOTES;
        break;
      case 'anticipation':
        pool = VAULT_ANTICIPATION_QUOTES;
        break;
      case 'spinning':
        pool = VAULT_SPIN_QUOTES;
        break;
      case 'idle':
      default:
        pool = VAULT_IDLE_QUOTES;
        break;
    }

    const nextQuote = pool[Math.floor(Math.random() * pool.length)];
    const rafId = requestAnimationFrame(() => {
      setCurrentQuote(nextQuote);
    });

    // Dynamic rotation during idle state
    if (rubyState === 'idle') {
      quoteTimerRef.current = window.setInterval(() => {
        const randomIdle = pool[Math.floor(Math.random() * pool.length)];
        setCurrentQuote(randomIdle);
      }, 7000);
    }

    return () => {
      cancelAnimationFrame(rafId);
      if (quoteTimerRef.current) clearInterval(quoteTimerRef.current);
    };
  }, [rubyState]);

  useEffect(() => {
    if (cooldownLeft <= 0) return;
    const t = window.setTimeout(() => setCooldownLeft((prev) => Math.max(0, prev - 1)), 1000);
    return () => clearTimeout(t);
  }, [cooldownLeft]);

  const tapTimerRef = useRef<number | null>(null);
  useEffect(() => {
    return () => {
      if (tapTimerRef.current) clearTimeout(tapTimerRef.current);
    };
  }, []);

  const handleRubyClick = () => {
    soundManager.unlockAudio();
    soundManager.playButtonClick();

    if (cooldownLeft > 0) {
      setIsTapped(true);
      setTapBonusText(`Vault charm cooling (${cooldownLeft}s)`);
      if (tapTimerRef.current) clearTimeout(tapTimerRef.current);
      tapTimerRef.current = window.setTimeout(() => {
        setIsTapped(false);
        setTapBonusText(null);
      }, 1200);
      return;
    }

    soundManager.playGoldBarClank();
    setIsTapped(true);
    setCooldownLeft(8);
    setTapBonusText('+50 COINS!');

    if (onRewardCoins) {
      onRewardCoins(50);
    }

    if (tapTimerRef.current) clearTimeout(tapTimerRef.current);
    tapTimerRef.current = window.setTimeout(() => {
      setIsTapped(false);
      setTapBonusText(null);
    }, 1200);
  };

  // Compact Stage Banner for Header & Floor Mode
  if (variant === 'compact') {
    return (
      <div
        onClick={handleRubyClick}
        className={`relative w-full max-w-md mx-auto flex items-center justify-between px-3 py-1.5 rounded-2xl cursor-pointer select-none transition-all shadow-xl bg-gradient-to-r from-rose-950/90 via-casino-950 to-amber-950/90 border-2 border-yellow-400/60 shadow-[0_0_20px_rgba(244,63,94,0.35)] ${
          isTapped ? 'scale-105' : 'hover:scale-[1.02]'
        }`}
        title="Tap Ruby Sparkle for lucky advice & +50 bonus coins!"
      >
        {/* Hostess Avatar / Bust */}
        <div className="relative flex items-center space-x-2 flex-shrink-0">
          <div className="relative w-11 h-11 sm:w-12 sm:h-12 rounded-full overflow-hidden border-2 border-yellow-300 shadow-[0_0_12px_rgba(245,158,11,0.6)] flex-shrink-0">
            <img
              src={hostessImg}
              alt="Ruby Sparkle"
              className="w-full h-full object-cover object-top"
            />
          </div>
          <div className="flex flex-col">
            <div className="flex items-center space-x-1">
              <Sparkles className="w-3 h-3 text-yellow-300 animate-spin" />
              <span className="text-[10px] sm:text-xs font-black uppercase tracking-wider text-yellow-300 font-sans">
                RUBY SPARKLE
              </span>
            </div>
            <span className="text-[8px] font-semibold tracking-wider text-rose-300 uppercase">
              VIP CASINO HOSTESS
            </span>
          </div>
        </div>

        {/* Dynamic Speech Bubble */}
        <div className="flex-1 mx-2 sm:mx-3 px-2.5 py-1 rounded-xl bg-black/60 border border-white/10 text-center overflow-hidden">
          <span className="text-[9px] sm:text-[10.5px] font-bold text-slate-100 truncate block leading-tight font-sans">
            {tapBonusText || currentQuote}
          </span>
        </div>

        {/* Interactive Tap Bonus Action Pill */}
        <div className="flex items-center space-x-1 px-2.5 py-1 rounded-full text-[9px] sm:text-[10px] font-black text-slate-950 bg-gradient-to-r from-yellow-300 via-amber-300 to-yellow-400 shadow-md flex-shrink-0 animate-pulse">
          <Star className="w-3 h-3 fill-slate-950 text-slate-950" />
          <span>+50 TIP</span>
        </div>
      </div>
    );
  }

  // Full High-Resolution Illustrated Standee for Desktop Flank
  return (
    <div
      onClick={handleRubyClick}
      className={`relative group cursor-pointer select-none transition-transform duration-200 flex flex-col items-center w-full max-w-[196px] 2xl:max-w-[224px] ${
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
        <div className="absolute top-4 z-40 animate-coin-burst pointer-events-none flex items-center space-x-1 font-black text-sm text-rose-300 drop-shadow-[0_0_10px_rgba(244,63,94,1)]">
          <Star className="w-4 h-4 fill-yellow-300 text-yellow-300" />
          <span>+50 COINS!</span>
        </div>
      )}

      {/* High-Resolution Illustrated Curvy Hostess Standee */}
      <div className="relative w-[92%] aspect-[208/340] max-h-[340px] rounded-2xl overflow-hidden border-2 shadow-2xl bg-black border-yellow-400/60 shadow-[0_0_30px_rgba(244,63,94,0.5)]">
        <img
          src={hostessImg}
          alt="Ruby Sparkle"
          className={`w-full h-full object-cover object-top transition-transform duration-300 ${
            rubyState === 'win' || rubyState === 'bigwin'
              ? 'scale-105 animate-pulse'
              : rubyState === 'anticipation'
              ? 'scale-105'
              : 'hover:scale-102'
          }`}
        />

        {/* Ambient Rim Glow */}
        <div className="absolute inset-0 pointer-events-none ring-1 ring-inset rounded-2xl ring-yellow-300/40" />
        <div className="absolute bottom-0 inset-x-0 h-20 bg-gradient-to-t from-black via-black/60 to-transparent pointer-events-none" />

        {/* Pedestal Nameplate */}
        <div className="absolute bottom-2 inset-x-3 py-1 px-2 rounded-lg border shadow-lg text-center bg-gradient-to-r from-rose-950 via-casino-900 to-amber-950 border-yellow-400/60">
          <div className="text-[10px] font-black tracking-widest uppercase flex items-center justify-center space-x-1">
            <Sparkles className="w-3 h-3 text-rose-400" />
            <span className="text-yellow-300">RUBY SPARKLE</span>
            <Sparkles className="w-3 h-3 text-rose-400" />
          </div>
          <div className="text-[8px] font-semibold tracking-wider uppercase text-rose-300">
            VIP CASINO HOSTESS
          </div>
        </div>
      </div>

      {/* 3D Grounded VIP Stanchion & Velvet Pedestal Base */}
      <div className="w-full flex flex-col items-center -mt-2 z-10 pointer-events-none">
        <div className="w-[86%] h-3 bg-gradient-to-r from-amber-700 via-yellow-300 to-amber-700 rounded-t-md border-t border-yellow-100 shadow-md" />
        <div className="w-full h-6 bg-gradient-to-r from-[#4a0614] via-[#880d25] to-[#4a0614] rounded-b-xl border-b-2 border-x-2 border-yellow-500 shadow-2xl relative flex items-center justify-center">
          <div className="w-16 h-1 bg-yellow-400/60 rounded-full" />
        </div>
        <div className="w-60 h-3 bg-black/70 blur-sm rounded-full -mt-1" />
      </div>
    </div>
  );
};
