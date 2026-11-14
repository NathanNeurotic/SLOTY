import React, { useCallback, useEffect, useState, useRef } from 'react';
import type { WinTier } from '../../engine/types';
import { soundManager } from '../../audio/soundManager';
import { launchCoinFountain } from '../../fx/celebrations';
import { Coins, Sparkles, Trees, Gamepad2, Zap } from 'lucide-react';
import type { GameId } from '../../games/types';

interface WinCelebrationModalProps {
  winTier: WinTier;
  winAmount: number;
  onDismiss: () => void;
  activeGameId?: GameId;
}

export const WinCelebrationModal: React.FC<WinCelebrationModalProps> = ({
  winTier,
  winAmount,
  onDismiss,
  activeGameId = 'vault-24k',
}) => {
  const isTimber = activeGameId === 'timber-critters';
  const isPixel = activeGameId === 'pixel-arcade';
  const isPs2 = activeGameId === 'ps2-legends';
  const [displayedAmount, setDisplayedAmount] = useState(0);
  const [isFinishedCounting, setIsFinishedCounting] = useState(false);
  const animationFrameRef = useRef<number | null>(null);
  const autoDismissTimerRef = useRef<number | null>(null);
  const isDismissedRef = useRef(false);

  const handleDismiss = useCallback(() => {
    if (isDismissedRef.current) return;
    isDismissedRef.current = true;
    if (animationFrameRef.current) cancelAnimationFrame(animationFrameRef.current);
    if (autoDismissTimerRef.current) clearTimeout(autoDismissTimerRef.current);
    soundManager.playButtonClick();
    onDismiss();
  }, [onDismiss]);

  const handleSkipOrCollect = useCallback(() => {
    if (!isFinishedCounting) {
      if (animationFrameRef.current) cancelAnimationFrame(animationFrameRef.current);
      setDisplayedAmount(winAmount);
      setIsFinishedCounting(true);
      soundManager.playButtonClick();
      if (autoDismissTimerRef.current) clearTimeout(autoDismissTimerRef.current);
      autoDismissTimerRef.current = window.setTimeout(() => {
        handleDismiss();
      }, 1400);
    } else {
      handleDismiss();
    }
  }, [isFinishedCounting, winAmount, handleDismiss]);

  useEffect(() => {
    // Determine celebration intensity
    const intensity =
      winTier === 'EPIC_JACKPOT' ? 'jackpot' : winTier === 'MEGA_WIN' ? 'mega' : 'big';

    launchCoinFountain(intensity);

    if (winTier === 'EPIC_JACKPOT') {
      if (isPs2) {
        soundManager.playPs2Startup();
      } else if (isPixel) {
        soundManager.playArcadeVictoryFanfare();
      } else if (isTimber) {
        soundManager.playWoodlandFanfare();
        soundManager.playGrizzlyRoar();
      } else {
        soundManager.playJackpotFanfare();
      }
    } else {
      if (isPs2) {
        soundManager.playPs2Win(winTier === 'MEGA_WIN' ? 25 : 10);
      } else if (isPixel) {
        soundManager.playArcadeVictoryFanfare();
      } else if (isTimber) {
        soundManager.playForestWin(winTier === 'MEGA_WIN' ? 25 : 10);
      } else {
        soundManager.playWinChime(winTier === 'MEGA_WIN' ? 25 : 10);
      }
    }

    const duration = 1800; // Snappy 1.8 seconds roll-up
    const startTime = performance.now();
    let lastTallySound = 0;

    const tick = (now: number) => {
      const elapsed = now - startTime;
      const progress = Math.min(1, elapsed / duration);
      const eased = 1 - Math.pow(1 - progress, 3);
      const current = Math.floor(eased * winAmount);
      setDisplayedAmount(current);

      if (now - lastTallySound > 85) {
        soundManager.playCoinTally();
        lastTallySound = now;
      }

      if (progress < 1) {
        animationFrameRef.current = requestAnimationFrame(tick);
      } else {
        setDisplayedAmount(winAmount);
        setIsFinishedCounting(true);

        autoDismissTimerRef.current = window.setTimeout(() => {
          handleDismiss();
        }, 2500);
      }
    };

    animationFrameRef.current = requestAnimationFrame(tick);

    return () => {
      if (animationFrameRef.current) cancelAnimationFrame(animationFrameRef.current);
      if (autoDismissTimerRef.current) clearTimeout(autoDismissTimerRef.current);
    };
  }, [winTier, winAmount, isTimber, isPixel, isPs2, handleDismiss]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.code === 'Space' || e.code === 'Enter' || e.key === 'Escape') {
        e.preventDefault();
        e.stopPropagation();
        handleSkipOrCollect();
      }
    };

    window.addEventListener('keydown', handleKeyDown, { capture: true });
    return () => window.removeEventListener('keydown', handleKeyDown, { capture: true });
  }, [handleSkipOrCollect]);

  const getTierDetails = () => {
    if (isPs2) {
      switch (winTier) {
        case 'EPIC_JACKPOT':
          return {
            title: '🎮 128-BIT EMOTION ENGINE GRAND JACKPOT! 🎮',
            subtitle: 'DUALSHOCK 2 SYSTEM MASTER REWARD UNLOCKED!',
            gradient: 'from-[#00F0FF] via-white to-[#006FCD]',
            borderColor: 'border-[#00F0FF]',
            textColor: 'text-[#00F0FF]',
            glow: 'shadow-[0_0_90px_rgba(0,240,255,0.95),inset_0_0_40px_rgba(0,0,0,0.98)]',
            bg: 'bg-gradient-to-b from-[#00102b] via-[#000817] to-black',
            buttonClass: 'bg-gradient-to-r from-[#00478F] via-[#006FCD] to-[#00F0FF] text-white border-2 border-cyan-200 shadow-[0_0_30px_rgba(0,111,205,0.9)] font-mono',
          };
        case 'MEGA_WIN':
          return {
            title: '💿 OPTICAL DVD-ROM MEGA WIN! 💿',
            subtitle: '294 MHZ HIGH SPEED CLOCK CYCLE HIT!',
            gradient: 'from-cyan-200 via-sky-400 to-[#006FCD]',
            borderColor: 'border-[#006FCD]',
            textColor: 'text-cyan-200',
            glow: 'shadow-[0_0_75px_rgba(0,111,205,0.85),inset_0_0_35px_rgba(0,0,0,0.95)]',
            bg: 'bg-gradient-to-b from-[#020b18] via-[#000511] to-black',
            buttonClass: 'bg-gradient-to-r from-[#003875] via-[#006FCD] to-cyan-400 text-white border-2 border-[#00F0FF] shadow-[0_0_25px_rgba(0,111,205,0.8)] font-mono',
          };
        default:
          return {
            title: '⚡ DUALSHOCK 2 BIG WIN! ⚡',
            subtitle: '8MB MEMORY CARD CASH STORED!',
            gradient: 'from-cyan-300 via-blue-400 to-indigo-300',
            borderColor: 'border-[#006FCD]',
            textColor: 'text-[#00F0FF]',
            glow: 'shadow-[0_0_55px_rgba(0,111,205,0.75)]',
            bg: 'bg-gradient-to-b from-[#010816] via-[#00030a] to-black',
            buttonClass: 'bg-gradient-to-r from-[#00478F] to-[#006FCD] text-white border border-[#00F0FF] font-mono',
          };
      }
    } else if (isPixel) {
      switch (winTier) {
        case 'EPIC_JACKPOT':
          return {
            title: '👾 1989 CYBER MEGA-BOSS DEFEATED! 👾',
            subtitle: 'ALL-TIME HIGH SCORE GRAND JACKPOT!',
            gradient: 'from-pink-400 via-cyan-300 to-yellow-300',
            borderColor: 'border-pink-500',
            textColor: 'text-pink-300',
            glow: 'shadow-[0_0_90px_rgba(236,72,153,0.95),inset_0_0_40px_rgba(0,0,0,0.98)]',
            bg: 'bg-gradient-to-b from-[#25083a] via-[#100326] to-[#04010a]',
            buttonClass: 'bg-gradient-to-r from-pink-600 via-purple-600 to-cyan-500 text-white border-2 border-pink-300 shadow-[0_0_30px_rgba(236,72,153,0.9)] font-mono',
          };
        case 'MEGA_WIN':
          return {
            title: '🕹️ STAGE 1 CLEAR MEGA BONUS! 🕹️',
            subtitle: 'CRITICAL COMBO CHAIN UNLOCKED!',
            gradient: 'from-cyan-300 via-pink-300 to-purple-300',
            borderColor: 'border-cyan-400',
            textColor: 'text-cyan-300',
            glow: 'shadow-[0_0_75px_rgba(6,182,212,0.85),inset_0_0_35px_rgba(0,0,0,0.95)]',
            bg: 'bg-gradient-to-b from-[#180a33] via-[#0b041a] to-[#03010a]',
            buttonClass: 'bg-gradient-to-r from-cyan-500 via-purple-600 to-pink-500 text-white border-2 border-cyan-300 shadow-[0_0_25px_rgba(6,182,212,0.8)] font-mono',
          };
        default:
          return {
            title: '⭐ 1UP SUPER RETRO WIN! ⭐',
            subtitle: 'PAC-COIN MULTIPLIER PAYOUT!',
            gradient: 'from-yellow-300 via-pink-400 to-cyan-300',
            borderColor: 'border-purple-500',
            textColor: 'text-yellow-300',
            glow: 'shadow-[0_0_55px_rgba(168,85,247,0.75)]',
            bg: 'bg-gradient-to-b from-[#150626] via-[#090214] to-[#03010a]',
            buttonClass: 'bg-gradient-to-r from-purple-600 to-pink-600 text-white border border-pink-400 font-mono',
          };
      }
    } else if (isTimber) {
      switch (winTier) {
        case 'EPIC_JACKPOT':
          return {
            title: '🌲 GRIZZLY GRAND JACKPOT! 🌲',
            subtitle: 'THE ENCHANTED FOREST REWARDS THE BOLD!',
            gradient: 'from-amber-300 via-emerald-300 to-yellow-200',
            borderColor: 'border-emerald-400',
            textColor: 'text-amber-300',
            glow: 'shadow-[0_0_90px_rgba(16,185,129,0.9),inset_0_0_40px_rgba(0,0,0,0.95)]',
            bg: 'bg-gradient-to-b from-[#2a1708] via-[#140c06] to-[#050905]',
            buttonClass: 'bg-gradient-to-r from-emerald-600 via-green-500 to-emerald-700 text-white border-2 border-emerald-300 shadow-[0_0_25px_rgba(16,185,129,0.8)]',
          };
        case 'MEGA_WIN':
          return {
            title: '🪵 TIMBERLAND MEGA WIN! 🪵',
            subtitle: 'A MASSIVE CRITTER WIN FALLS FROM THE CANOPY!',
            gradient: 'from-amber-400 via-teal-300 to-emerald-400',
            borderColor: 'border-[#b45309]',
            textColor: 'text-emerald-300',
            glow: 'shadow-[0_0_70px_rgba(245,158,11,0.8),inset_0_0_35px_rgba(0,0,0,0.95)]',
            bg: 'bg-gradient-to-b from-[#241308] via-[#120a05] to-[#040804]',
            buttonClass: 'bg-gradient-to-r from-amber-600 via-yellow-500 to-amber-700 text-amber-950 border-2 border-yellow-200 shadow-[0_0_25px_rgba(245,158,11,0.8)]',
          };
        default:
          return {
            title: '🐻 WOODLAND BIG WIN! 🐻',
            subtitle: 'HONEY & GOLDEN ACORNS COLLECTED!',
            gradient: 'from-emerald-300 via-amber-300 to-teal-200',
            borderColor: 'border-emerald-600',
            textColor: 'text-emerald-300',
            glow: 'shadow-[0_0_50px_rgba(16,185,129,0.7)]',
            bg: 'bg-gradient-to-b from-[#1c0f06] via-[#0d0703] to-[#040604]',
            buttonClass: 'bg-gradient-to-r from-emerald-600 to-teal-700 text-white border border-emerald-400',
          };
      }
    } else {
      switch (winTier) {
        case 'EPIC_JACKPOT':
          return {
            title: '👑 24K FORT KNOX GRAND HEIST! 👑',
            subtitle: 'LEGENDARY IMPERIAL VAULT JACKPOT BREACHED!',
            gradient: 'from-amber-400 via-yellow-200 to-amber-500',
            borderColor: 'border-yellow-300',
            textColor: 'text-yellow-300',
            glow: 'shadow-[0_0_90px_rgba(245,158,11,0.95),inset_0_0_50px_rgba(0,0,0,0.95)]',
            bg: 'bg-gradient-to-b from-amber-950 via-casino-950 to-black',
            buttonClass: 'gold-btn text-casino-950 shadow-[0_0_30px_rgba(245,158,11,0.8)]',
          };
        case 'MEGA_WIN':
          return {
            title: '💰 IMPERIAL BULLION MEGA WIN! 💰',
            subtitle: 'VAULT CASH DISPENSER RUNS OVERFLOWING!',
            gradient: 'from-yellow-300 via-amber-400 to-yellow-500',
            borderColor: 'border-amber-400',
            textColor: 'text-amber-300',
            glow: 'shadow-[0_0_70px_rgba(245,158,11,0.85)]',
            bg: 'bg-gradient-to-b from-slate-900 via-casino-950 to-black',
            buttonClass: 'gold-btn text-casino-950 shadow-[0_0_25px_rgba(245,158,11,0.7)]',
          };
        default:
          return {
            title: '⚡ HIGH-ROLLER CASH BREAKOUT! ⚡',
            subtitle: 'PREMIUM VAULT SECURITY OVERRIDE!',
            gradient: 'from-amber-300 via-yellow-200 to-amber-400',
            borderColor: 'border-amber-500/80',
            textColor: 'text-amber-300',
            glow: 'shadow-[0_0_55px_rgba(245,158,11,0.7)]',
            bg: 'bg-gradient-to-b from-casino-900 via-casino-950 to-black',
            buttonClass: 'gold-btn text-casino-950 shadow-lg',
          };
      }
    }
  };

  const tier = getTierDetails();

  return (
    <div
      onClick={handleSkipOrCollect}
      className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/90 cursor-pointer select-none animate-fadeIn"
    >
      <div
        className={`relative max-w-lg w-full max-h-[92vh] overflow-y-auto ${tier.bg} border-4 ${tier.borderColor} ${tier.glow} rounded-3xl p-5 sm:p-10 text-center flex flex-col items-center transform transition-transform hover:scale-[1.01]`}
      >
        {/* Top Decorative Sparkles */}
        <div className="flex items-center space-x-2 text-gold-bright mb-2 animate-bounce">
          {isPs2 ? (
            <span className="text-lg">🎮</span>
          ) : isPixel ? (
            <Gamepad2 className="w-5 h-5 text-cyan-300" />
          ) : isTimber ? (
            <Trees className="w-5 h-5 text-emerald-400" />
          ) : (
            <Sparkles className="w-5 h-5 text-yellow-300" />
          )}
          <span className="text-xs font-black uppercase tracking-widest text-slate-200 drop-shadow">
            {tier.subtitle}
          </span>
          {isPs2 ? (
            <span className="text-lg">💿</span>
          ) : isPixel ? (
            <Zap className="w-5 h-5 text-pink-400" />
          ) : isTimber ? (
            <Trees className="w-5 h-5 text-emerald-400" />
          ) : (
            <Sparkles className="w-5 h-5 text-yellow-300" />
          )}
        </div>

        {/* Big Banner Title */}
        <h1
          className={`text-3xl sm:text-5xl font-black uppercase tracking-wider bg-gradient-to-r ${tier.gradient} bg-clip-text text-transparent drop-shadow-[0_2px_12px_rgba(0,0,0,0.9)] mb-4`}
        >
          {tier.title}
        </h1>

        {/* Animated Win Ticker */}
        <div className={`flex items-center justify-center space-x-3 my-4 ${
          isPs2
            ? 'bg-[#020919] border-2 border-[#006FCD]/70 shadow-[0_0_20px_rgba(0,111,205,0.4)]'
            : isPixel
            ? 'bg-[#0f041e] border-2 border-pink-500/60 shadow-[0_0_20px_rgba(236,72,153,0.4)]'
            : isTimber
            ? 'bg-[#0f0904] border-2 border-emerald-600/50'
            : 'bg-casino-900/90 border border-white/10'
        } px-6 py-4 rounded-2xl w-full shadow-inner`}>
          <Coins className={`w-8 h-8 ${
            isPs2 ? 'text-[#00F0FF] fill-[#006FCD]' : isPixel ? 'text-cyan-300 fill-cyan-400' : isTimber ? 'text-emerald-400 fill-emerald-500' : 'text-gold-bright fill-gold'
          } animate-spin`} />
          <span className="text-4xl sm:text-5xl font-black text-white tracking-wide font-mono">
            +{displayedAmount.toLocaleString()} {isPs2 ? 'CREDITS' : ''}
          </span>
        </div>

        {/* Tap to collect hint */}
        <div className="mt-4 flex flex-col items-center">
          <button
            onClick={(e) => {
              e.stopPropagation();
              handleSkipOrCollect();
            }}
            className={`${tier.buttonClass} px-8 py-3 rounded-2xl font-black text-sm uppercase tracking-widest hover:scale-105 active:scale-95 transition-transform flex items-center justify-center space-x-2`}
          >
            <span>{isFinishedCounting ? isPs2 ? 'COLLECT CREDITS' : 'COLLECT COINS' : 'SKIP TO END'}</span>
            <span className="px-1.5 py-0.5 rounded bg-black/25 text-[10px] font-mono font-bold">SPACE</span>
          </button>
          <div className="text-[11px] text-slate-400 mt-2">
            Press Space or click anywhere to {isFinishedCounting ? 'dismiss' : 'fast-forward'}
          </div>
        </div>
      </div>
    </div>
  );
};
