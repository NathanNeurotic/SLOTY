import React, { useState, useEffect } from 'react';
import { soundManager } from '../../audio/soundManager';
import { Sparkles, Gamepad2, Star, Zap } from 'lucide-react';
import pennyImg from '../../assets/pixel_penny.webp';

export type PennyState = 'idle' | 'spinning' | 'anticipation' | 'win' | 'bigwin' | 'fever';

interface PixelPennyProps {
  isSpinning: boolean;
  isAnticipating: boolean;
  isWinning: boolean;
  isBigWin?: boolean;
  isFeverMode?: boolean;
  winAmount?: number;
  onRewardCoins?: (amount: number) => void;
  variant?: 'full' | 'compact';
}

const PIXEL_IDLE_QUOTES = [
  "Ready Player One! Let's set a new all-time high score!",
  "Insert coin to continue! Lady Luck is in the arcade!",
  "Tap my headphones for a lucky retro token shower!",
  "These reels are hotter than an overclocked CRT monitor!",
  "3 Cartridges unlock the 8-Bit Boss Stage with 3X multipliers!",
  "Hit 6 retro tokens to trigger the High Score Respin!",
];

const PIXEL_SPIN_QUOTES = [
  "Spin that wheel! Combo meter charging up!",
  "Roll 'em high! Lock in those 6 reels!",
  "Come on pixel power-ups! Level up!",
  "Eyes on the screen! High score incoming!",
  "Speedrun that spin, player!",
];

const PIXEL_ANTICIPATION_QUOTES = [
  "ALERT! TWO CARTRIDGES LOCKED! ONE MORE TO BOSS STAGE!",
  "COME ON REEL SIX! UNLOCK THE 8-BIT CYBERSPACE!",
  "HOLD YOUR JOYSTICK! ONE MORE TO WIN!",
  "CRITICAL HIT INCOMING! LEVEL UP!",
];

const PIXEL_WIN_QUOTES = [
  "STAGE CLEAR! COMBO MULTIPLIER ACTIVE!",
  "WOOHOO! NEW HIGH SCORE REGISTERED!",
  "NICE HIT! 25¢ TURNED INTO PURE GOLD!",
  "POWER UP ACQUIRED! KEEP THE STREAK ALIVE!",
  "PERFECT COMBO! YOU'RE ON FIRE!",
];

const PIXEL_BIG_WIN_QUOTES = [
  "HOLY 8-BIT CART! A CYBER MEGA-BOSS JACKPOT!",
  "YOU SMASHED THE ARCADE HIGH SCORE RECORD!",
  "LEVEL 99 CHAMPION HIT! MAXIMUM CREDITS!",
  "TOKENS AND TICKETS RAINING EVERYWHERE!",
];

const PIXEL_FEVER_QUOTES = [
  "OVERDRIVE COMBO ACTIVE! 2X 8-BIT WIN STRIKES!",
  "MAXIMUM OVERCLOCK! REELS ARE SUPERCHARGED!",
  "TURBO MODE ENGAGED! KEEP SPINNING!",
];

export const PixelPenny: React.FC<PixelPennyProps> = ({
  isSpinning,
  isAnticipating,
  isWinning,
  isBigWin = false,
  isFeverMode = false,
  winAmount: _winAmount = 0,
  onRewardCoins,
  variant = 'full',
}) => {
  const [idleIndex, setIdleIndex] = useState(0);
  const [reactionIndex, setReactionIndex] = useState(0);
  const [isTapped, setIsTapped] = useState(false);
  const [tapBonusText, setTapBonusText] = useState<string | null>(null);
  const [cooldownLeft, setCooldownLeft] = useState(0);

  // Compute operational mascot state
  const mascotState: PennyState = isFeverMode
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
      ? PIXEL_FEVER_QUOTES
      : mascotState === 'bigwin'
      ? PIXEL_BIG_WIN_QUOTES
      : mascotState === 'win'
      ? PIXEL_WIN_QUOTES
      : mascotState === 'anticipation'
      ? PIXEL_ANTICIPATION_QUOTES
      : mascotState === 'spinning'
      ? PIXEL_SPIN_QUOTES
      : PIXEL_IDLE_QUOTES;

  const currentQuote = pool[(mascotState === 'idle' ? idleIndex : reactionIndex) % pool.length];

  // Auto-cycle dialogue cleanly without synchronous setState in effect
  useEffect(() => {
    if (mascotState !== 'idle') {
      const raf = requestAnimationFrame(() => setReactionIndex((i) => i + 1));
      return () => cancelAnimationFrame(raf);
    }
    const timer = window.setInterval(() => {
      setIdleIndex((i) => i + 1);
    }, 8000);
    return () => clearInterval(timer);
  }, [mascotState]);

  useEffect(() => {
    if (cooldownLeft <= 0) return;
    const t = window.setTimeout(() => setCooldownLeft((c) => Math.max(0, c - 1)), 1000);
    return () => clearTimeout(t);
  }, [cooldownLeft]);

  // Click-to-interact easter egg with fair cooldown coin tip reward
  const handleMascotTap = () => {
    soundManager.unlockAudio();
    soundManager.playButtonClick();
    setIsTapped(true);
    setTimeout(() => setIsTapped(false), 700);

    if (cooldownLeft > 0) {
      setIdleIndex((i) => i + 1);
      setTapBonusText(`1UP token buffer cooling (${cooldownLeft}s)`);
      setTimeout(() => setTapBonusText(null), 1600);
      return;
    }

    const bonusRewards = [50, 75, 100];
    const awarded = bonusRewards[Math.floor(Math.random() * bonusRewards.length)];
    setCooldownLeft(8);
    setTapBonusText(`+${awarded} 🪙 RETRO TIP!`);
    onRewardCoins?.(awarded);

    setTimeout(() => {
      setTapBonusText(null);
    }, 2400);
  };

  // Compact Mode (for mobile footer bar)
  if (variant === 'compact') {
    return (
      <div
        onClick={handleMascotTap}
        className="flex items-center space-x-2 bg-purple-950/90 border-2 border-pink-500/70 rounded-full px-3 py-1 shadow-lg cursor-pointer select-none active:scale-95 transition-transform"
      >
        <div className="relative w-8 h-8 rounded-full overflow-hidden border border-pink-400 flex-shrink-0">
          <img src={pennyImg} alt="Pixel Penny" className="w-full h-full object-cover object-top" />
          {isWinning && (
            <div className="absolute inset-0 bg-pink-500/30 animate-pulse pointer-events-none" />
          )}
        </div>
        <div className="flex flex-col text-left overflow-hidden">
          <div className="flex items-center space-x-1">
            <Gamepad2 className="w-3 h-3 text-cyan-300" />
            <span className="text-[10px] font-black text-pink-300 uppercase tracking-wider font-mono">
              PIXEL PENNY
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
      title="Click Penny for good luck tokens and arcade tips!"
    >
      {/* Dynamic Speech Bubble Overlay */}
      <div className="relative mb-2 z-30 w-full max-w-[210px] animate-fadeIn">
        <div className="bg-purple-950/95 text-cyan-200 text-[10px] sm:text-[11px] font-bold p-2.5 rounded-2xl border-2 border-pink-500/80 shadow-[0_4px_16px_rgba(236,72,153,0.4)] text-center leading-tight font-mono relative backdrop-blur-sm">
          <span>{tapBonusText || currentQuote}</span>
          {/* Speech Bubble Arrow */}
          <div className="absolute -bottom-2 left-1/2 -translate-x-1/2 w-0 h-0 border-l-[6px] border-l-transparent border-r-[6px] border-r-transparent border-t-[8px] border-t-pink-500/80" />
        </div>
      </div>

      {/* Main Standee Chamber */}
      <div
        className={`relative w-full max-w-[196px] 2xl:max-w-[208px] aspect-[192/310] max-h-[310px] rounded-2xl overflow-hidden border-2 shadow-2xl transition-all duration-300 bg-gradient-to-b from-[#180938] via-[#0d0422] to-[#05010e] ${
          mascotState === 'fever'
            ? 'border-yellow-400 shadow-[0_0_35px_rgba(250,204,21,0.8)] scale-105'
            : mascotState === 'bigwin'
            ? 'border-pink-400 shadow-[0_0_35px_rgba(236,72,153,0.85)] scale-105'
            : mascotState === 'win'
            ? 'border-cyan-400 shadow-[0_0_25px_rgba(34,211,238,0.7)]'
            : mascotState === 'anticipation'
            ? 'border-purple-400 animate-pulse shadow-[0_0_25px_rgba(192,132,252,0.8)]'
            : 'border-pink-500/60 shadow-[0_0_25px_rgba(236,72,153,0.35)]'
        }`}
      >
        {/* Penny Mascot Photographic Portrait */}
        <img
          src={pennyImg}
          alt="Pixel Penny"
          className={`w-full h-full object-cover object-top transition-transform duration-500 ${
            mascotState === 'spinning'
              ? 'scale-105 brightness-110'
              : mascotState === 'win' || mascotState === 'bigwin'
              ? 'scale-110'
              : 'group-hover:scale-105'
          }`}
        />

        {/* Ambient CRT Scanline Overlay */}
        <div className="absolute inset-0 bg-[linear-gradient(rgba(18,16,16,0)_50%,rgba(0,0,0,0.35)_50%)] bg-[length:100%_4px] pointer-events-none opacity-40" />

        {/* Dynamic Glow Auras for Wins & Fever */}
        {mascotState === 'win' && (
          <div className="absolute inset-0 bg-gradient-to-t from-cyan-500/30 via-transparent to-transparent pointer-events-none animate-pulse" />
        )}
        {mascotState === 'bigwin' && (
          <div className="absolute inset-0 bg-gradient-to-t from-pink-500/40 via-yellow-400/20 to-transparent pointer-events-none animate-bounce" />
        )}
        {mascotState === 'fever' && (
          <div className="absolute inset-0 bg-gradient-to-t from-yellow-500/40 via-pink-500/20 to-transparent pointer-events-none animate-pulse" />
        )}

        {/* Floating Sparkles & Icons */}
        {mascotState === 'fever' && (
          <div className="absolute top-2 right-2 flex space-x-1">
            <Zap className="w-5 h-5 text-yellow-300 fill-yellow-300 animate-bounce" />
          </div>
        )}
        {mascotState === 'bigwin' && (
          <div className="absolute top-2 left-2 flex space-x-1">
            <Star className="w-5 h-5 text-pink-300 fill-pink-300 animate-spin" />
            <Sparkles className="w-5 h-5 text-yellow-300 fill-yellow-300 animate-pulse" />
          </div>
        )}

        {/* Bottom Mascot Plaque Badge */}
        <div className="absolute bottom-2 inset-x-2 py-1 px-2 rounded-xl bg-purple-950/90 border border-pink-400/60 backdrop-blur-md shadow-lg flex items-center justify-between">
          <div className="flex items-center space-x-1.5">
            <Gamepad2 className="w-3.5 h-3.5 text-cyan-300 animate-pulse" />
            <div className="flex flex-col text-left">
              <span className="text-[10px] font-black text-pink-200 tracking-wider uppercase font-mono">
                PIXEL PENNY
              </span>
              <span className="text-[7.5px] font-bold text-cyan-300 tracking-widest uppercase font-mono">
                ARCADE CHAMPION
              </span>
            </div>
          </div>
          <div className="flex space-x-0.5 text-yellow-300">
            <Star className="w-2.5 h-2.5 fill-yellow-300" />
            <Star className="w-2.5 h-2.5 fill-yellow-300" />
            <Star className="w-2.5 h-2.5 fill-yellow-300" />
          </div>
        </div>
      </div>
    </div>
  );
};
