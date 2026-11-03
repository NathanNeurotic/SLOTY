import React, { useState, useEffect, useRef } from 'react';
import { soundManager } from '../../audio/soundManager';
import { Sparkles, Trees, Star } from 'lucide-react';
import grizzlyImg from '../../assets/grizzly_gus.jpg';

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
            <img
              src={grizzlyImg}
              alt="Grizzly Gus"
              className="w-full h-full object-cover object-top scale-110"
            />
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
      className={`relative group cursor-pointer select-none transition-transform duration-200 flex flex-col items-center w-56 ${
        isTapped ? 'scale-105' : 'hover:scale-[1.02]'
      }`}
      title="Click Grizzly Gus for lucky cheers, bear roars & free acorns!"
    >
      {/* Speech Bubble cleanly positioned above the mascot */}
      <div className="relative mb-2 z-30 w-full max-w-[220px]">
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
            <span className="text-[10px] sm:text-[11px] font-black leading-tight text-center w-full block">
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

      {/* High-Resolution Illustrated 3D Mascot Character Standee */}
      <div className={`relative w-52 h-[340px] rounded-2xl overflow-hidden border-2 shadow-2xl bg-black ${
        mascotState === 'fever'
          ? 'border-amber-400 shadow-[0_0_35px_rgba(245,158,11,0.8)]'
          : 'border-emerald-400/70 shadow-[0_0_30px_rgba(16,185,129,0.5)]'
      }`}>
        <img
          src={grizzlyImg}
          alt="Grizzly Gus"
          className={`w-full h-full object-cover object-top transition-transform duration-300 ${
            mascotState === 'win' || mascotState === 'bigwin'
              ? 'scale-105 animate-pulse'
              : mascotState === 'anticipation'
              ? 'scale-105'
              : 'hover:scale-102'
          }`}
        />

        {/* Ambient Rim Glow */}
        <div className="absolute inset-0 pointer-events-none ring-1 ring-inset rounded-2xl ring-emerald-400/40" />
        <div className="absolute bottom-0 inset-x-0 h-20 bg-gradient-to-t from-black via-black/60 to-transparent pointer-events-none" />

        {/* Pedestal Nameplate */}
        <div className="absolute bottom-2 inset-x-3 py-1 px-2 rounded-lg border shadow-lg text-center bg-gradient-to-r from-stone-900 via-[#0a180e] to-stone-900 border-emerald-400/60">
          <div className="text-[10px] font-black tracking-widest uppercase flex items-center justify-center space-x-1">
            <Trees className="w-3 h-3 text-emerald-300" />
            <span className="text-emerald-200">GRIZZLY GUS</span>
            <Trees className="w-3 h-3 text-emerald-300" />
          </div>
          <div className="text-[8px] font-semibold tracking-wider uppercase text-amber-300">
            WOODLAND LODGE MASCOT
          </div>
        </div>
      </div>

      {/* 3D Mossy Cedar Log Stump Base */}
      <div className="w-full flex flex-col items-center -mt-2 z-10 pointer-events-none">
        <div className="w-48 h-3 bg-gradient-to-r from-[#2e180e] via-[#5c2b09] to-[#2e180e] rounded-t-md border-t border-[#a16207] shadow-md flex items-center justify-around px-4">
          <span className="text-[8px]">🍂</span>
          <span className="text-[8px]">🌰</span>
          <span className="text-[8px]">🍁</span>
        </div>
        <div className="w-56 h-6 bg-gradient-to-r from-[#170a04] via-[#2e180e] to-[#170a04] rounded-b-xl border-b-2 border-x-2 border-[#78350f] shadow-2xl relative flex items-center justify-center">
          <div className="w-24 h-1.5 bg-emerald-700/60 rounded-full blur-[0.5px]" />
        </div>
        <div className="w-60 h-3 bg-black/80 blur-sm rounded-full -mt-1" />
      </div>
    </div>
  );
};
