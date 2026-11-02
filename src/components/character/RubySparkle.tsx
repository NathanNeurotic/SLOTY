import React, { useState, useEffect, useRef } from 'react';
import { soundManager } from '../../audio/soundManager';
import { Star, Sparkles, Trees } from 'lucide-react';
import hostessImg from '../../assets/hostess_ruby.jpg';
import type { GameId } from '../../games/types';

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
  activeGameId?: GameId;
}

const VAULT_IDLE_QUOTES = [
  "Hi superstar! Ready to strike gold today?",
  "You've got this! Lady Luck is in the house!",
  "Tap my sparkly dress for a lucky coin shower!",
  "Ooh, these reels are runnin' extra hot today!",
  "Fortune favors the fun, darling!",
  "America's brightest jackpot is waiting for you!",
];

const TIMBER_IDLE_QUOTES = [
  "Welcome to the enchanted forest, explorer!",
  "Hear that owl? Fortune is stirring in the canopy!",
  "Tap my ranger badge for some lucky golden acorns!",
  "The bears are friendly and the reels are wild!",
  "Six golden acorns trigger the Forest Harvest Respin!",
  "Watch for the mystic owl, 3 scatter doors await!",
];

const VAULT_SPIN_QUOTES = [
  "Spin, spin, spin! Bring home the gold!",
  "Come on lucky tumblers! Make it rain!",
  "Roll 'em high, superstar!",
  "Here comes a big one, I can feel it!",
];

const TIMBER_SPIN_QUOTES = [
  "Shake the branches! Bring home the forest harvest!",
  "Roll 'em high through the towering pines!",
  "Come on lucky woodland critters! Make it rain acorns!",
  "Feel that forest breeze! A big win is blowing in!",
];

const VAULT_ANTICIPATION_QUOTES = [
  "OOH! TWO VAULT DOORS! HOLD YOUR BREATH!",
  "COME ON REEL FIVE! UNLOCK THE FORTRESS!",
  "JUST ONE MORE SCATTER, SUPERSTAR!",
];

const TIMBER_ANTICIPATION_QUOTES = [
  "HOOT! TWO MYSTIC OWLS! HOLD YOUR BREATH!",
  "COME ON REEL FIVE! UNLOCK THE MOONLIT CANOPY!",
  "JUST ONE MORE OWL TO UNLEASH FREE SPINS!",
];

const VAULT_WIN_QUOTES = [
  "YAY! YOU DID IT! THAT'S A WINNER!",
  "WOOHOO! KA-CHING, SUPERSTAR!",
  "LOOK AT THAT BEAUTIFUL PAYOUT!",
  "THAT'S WHAT I CALL A HIGH-ROLLER HIT!",
];

const TIMBER_WIN_QUOTES = [
  "YAY! A BOUNTIFUL FOREST HARVEST HIT!",
  "WOOHOO! THE CRITTERS BROUGHT HOME THE GOLD!",
  "LOOK AT THAT BEAUTIFUL WOODLAND PAYOUT!",
  "NATURE REWARDS THE BOLD, EXPLORER!",
];

const VAULT_BIG_WIN_QUOTES = [
  "HOLY MACKEREL! A COLOSSAL JACKPOT!",
  "YOU BROKE THE VAULT, CHAMPION!",
  "CELEBRATION TIME! CONFETTI FOR EVERYONE!",
];

const TIMBER_BIG_WIN_QUOTES = [
  "HOLY MACKEREL! A COLOSSAL GRIZZLY JACKPOT!",
  "YOU BROKE THE FOREST RECORD, EXPLORER!",
  "NATURE'S GREATEST HARVEST! CONGRATS!",
];

const VAULT_FEVER_QUOTES = [
  "SUPERCHARGED OVERDRIVE! 2X MULTIPLIERS!",
  "THE VAULT IS ON FIRE! BURN IT UP!",
  "MAX POWER, SUPERSTAR! DON'T STOP NOW!",
];

const TIMBER_FEVER_QUOTES = [
  "NATURE'S FURY UNLEASHED! 2X MULTIPLIERS!",
  "THE FOREST IS GLOWING! HARVEST EVERY CRITTER!",
  "MAX WOODLAND POWER! KEEP SPINNING!",
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
  activeGameId = 'vault-24k',
}) => {
  const isTimber = activeGameId === 'timber-critters';
  const defaultIdle = isTimber ? TIMBER_IDLE_QUOTES[0] : VAULT_IDLE_QUOTES[0];
  const [currentQuote, setCurrentQuote] = useState(defaultIdle);
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
        pool = isTimber ? TIMBER_FEVER_QUOTES : VAULT_FEVER_QUOTES;
        break;
      case 'bigwin':
        pool = isTimber ? TIMBER_BIG_WIN_QUOTES : VAULT_BIG_WIN_QUOTES;
        break;
      case 'win':
        pool = isTimber ? TIMBER_WIN_QUOTES : VAULT_WIN_QUOTES;
        break;
      case 'anticipation':
        pool = isTimber ? TIMBER_ANTICIPATION_QUOTES : VAULT_ANTICIPATION_QUOTES;
        break;
      case 'spinning':
        pool = isTimber ? TIMBER_SPIN_QUOTES : VAULT_SPIN_QUOTES;
        break;
      case 'idle':
      default:
        pool = isTimber ? TIMBER_IDLE_QUOTES : VAULT_IDLE_QUOTES;
        break;
    }

    const nextQuote = pool[Math.floor(Math.random() * pool.length)];
    setCurrentQuote(nextQuote);

    // Dynamic rotation during idle state
    if (rubyState === 'idle') {
      quoteTimerRef.current = window.setInterval(() => {
        const randomIdle = pool[Math.floor(Math.random() * pool.length)];
        setCurrentQuote(randomIdle);
      }, 7000);
    }

    return () => {
      if (quoteTimerRef.current) clearInterval(quoteTimerRef.current);
    };
  }, [rubyState, isTimber]);

  const handleRubyClick = () => {
    soundManager.unlockAudio();
    soundManager.playButtonClick();
    if (isTimber) {
      soundManager.playOwlHoot(1);
    } else {
      soundManager.playGoldBarClank();
    }
    setIsTapped(true);
    setTapBonusText('+50 COINS!');

    if (onRewardCoins) {
      onRewardCoins(50);
    }

    setTimeout(() => {
      setIsTapped(false);
      setTapBonusText(null);
    }, 1200);
  };

  // Compact Mobile / Tablet Top Bar Variant
  if (variant === 'compact') {
    return (
      <div
        onClick={handleRubyClick}
        className={`flex items-center space-x-2 px-2.5 py-1 rounded-full cursor-pointer select-none transition-all shadow-md ${
          isTimber
            ? 'bg-[#08180e]/90 border border-emerald-500/60'
            : 'bg-casino-900/90 border border-rose-500/50'
        } ${isTapped ? 'scale-105' : ''}`}
        title="Tap Ruby Sparkle for lucky advice & +50 bonus coins!"
      >
        <div className={`relative w-6 h-6 rounded-full overflow-hidden border flex-shrink-0 ${
          isTimber ? 'border-emerald-300' : 'border-rose-400'
        }`}>
          <img src={hostessImg} alt="Hostess Ruby" className="w-full h-full object-cover object-top" />
        </div>
        <div className="flex flex-col text-left overflow-hidden">
          <div className="flex items-center space-x-1">
            <span className={`text-[8.5px] font-black uppercase tracking-wider ${
              isTimber ? 'text-emerald-300' : 'text-rose-300'
            }`}>
              {isTimber ? 'RANGER RUBY' : 'RUBY SPARKLE'}
            </span>
            <Sparkles className={`w-2.5 h-2.5 ${isTimber ? 'text-emerald-400' : 'text-yellow-300'}`} />
          </div>
          <span className="text-[7.5px] text-slate-300 truncate font-semibold">
            {tapBonusText || currentQuote}
          </span>
        </div>
        <div className={`ml-auto flex items-center space-x-0.5 px-1.5 py-0.5 rounded-full text-[8px] font-black text-white flex-shrink-0 ${
          isTimber ? 'bg-emerald-600' : 'bg-rose-600'
        }`}>
          <Star className="w-2.5 h-2.5 fill-yellow-300 text-yellow-300" />
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
              ? isTimber
                ? 'bg-gradient-to-r from-emerald-600 via-teal-600 to-amber-500 text-white border-emerald-200 animate-pulse'
                : 'bg-gradient-to-r from-red-600 via-rose-500 to-amber-400 text-black border-red-200 animate-pulse'
              : rubyState === 'anticipation'
              ? isTimber
                ? 'bg-emerald-950 text-emerald-100 border-emerald-400 shadow-[0_0_15px_rgba(52,211,153,0.8)] animate-bounce'
                : 'bg-rose-950 text-rose-100 border-rose-400 shadow-[0_0_15px_rgba(244,63,94,0.8)] animate-bounce'
              : rubyState === 'win' || rubyState === 'bigwin'
              ? isTimber
                ? 'bg-gradient-to-r from-emerald-600 via-teal-600 to-amber-500 text-white border-white shadow-[0_0_18px_rgba(16,185,129,0.9)] animate-pulse'
                : 'bg-gradient-to-r from-rose-600 via-pink-600 to-amber-500 text-white border-white shadow-[0_0_18px_rgba(244,63,94,0.9)] animate-pulse'
              : isTimber
              ? 'bg-[#08180e]/95 text-emerald-200 border-emerald-500/50 shadow-[0_4px_12px_rgba(0,0,0,0.8)]'
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
                ? isTimber
                  ? 'border-t-emerald-600'
                  : 'border-t-rose-500'
                : rubyState === 'anticipation'
                ? isTimber
                  ? 'border-t-emerald-400'
                  : 'border-t-rose-400'
                : rubyState === 'win' || rubyState === 'bigwin'
                ? isTimber
                  ? 'border-t-emerald-600'
                  : 'border-t-rose-600'
                : isTimber
                ? 'border-t-[#08180e]'
                : 'border-t-casino-900'
            }`}
          />
        </div>
      </div>

      {/* Floating bonus coin particle when tapped */}
      {tapBonusText && (
        <div className={`absolute top-4 z-40 animate-coin-burst pointer-events-none flex items-center space-x-1 font-black text-sm ${
          isTimber
            ? 'text-emerald-300 drop-shadow-[0_0_10px_rgba(16,185,129,1)]'
            : 'text-rose-300 drop-shadow-[0_0_10px_rgba(244,63,94,1)]'
        }`}>
          <Star className="w-4 h-4 fill-yellow-300 text-yellow-300" />
          <span>+50 COINS!</span>
        </div>
      )}

      {/* High-Resolution Illustrated Curvy Hostess Standee */}
      <div className={`relative w-52 h-[340px] rounded-2xl overflow-hidden border-2 shadow-2xl bg-black ${
        isTimber
          ? 'border-emerald-400/70 shadow-[0_0_30px_rgba(16,185,129,0.5)]'
          : 'border-yellow-400/60 shadow-[0_0_30px_rgba(244,63,94,0.5)]'
      }`}>
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
        <div className={`absolute inset-0 pointer-events-none ring-1 ring-inset rounded-2xl ${
          isTimber ? 'ring-emerald-400/40' : 'ring-yellow-300/40'
        }`} />
        <div className="absolute bottom-0 inset-x-0 h-20 bg-gradient-to-t from-black via-black/60 to-transparent pointer-events-none" />

        {/* Pedestal Nameplate */}
        <div className={`absolute bottom-2 inset-x-3 py-1 px-2 rounded-lg border shadow-lg text-center ${
          isTimber
            ? 'bg-gradient-to-r from-stone-900 via-[#0a180e] to-stone-900 border-emerald-400/60'
            : 'bg-gradient-to-r from-rose-950 via-casino-900 to-amber-950 border-yellow-400/60'
        }`}>
          <div className="text-[10px] font-black tracking-widest uppercase flex items-center justify-center space-x-1">
            {isTimber ? (
              <>
                <Trees className="w-3 h-3 text-emerald-300" />
                <span className="text-emerald-200">RANGER RUBY</span>
                <Trees className="w-3 h-3 text-emerald-300" />
              </>
            ) : (
              <>
                <Sparkles className="w-3 h-3 text-rose-400" />
                <span className="text-yellow-300">RUBY SPARKLE</span>
                <Sparkles className="w-3 h-3 text-rose-400" />
              </>
            )}
          </div>
          <div className={`text-[8px] font-semibold tracking-wider uppercase ${
            isTimber ? 'text-emerald-400' : 'text-rose-300'
          }`}>
            {isTimber ? 'WOODLAND EXPEDITION GUIDE' : 'VIP CASINO HOSTESS'}
          </div>
        </div>
      </div>
    </div>
  );
};
