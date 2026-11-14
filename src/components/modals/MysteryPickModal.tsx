import React, { useCallback, useEffect, useRef, useState } from 'react';
import { X, Sparkles, CheckCircle2, Trees, Gamepad2, Lock, Unlock } from 'lucide-react';
import { soundManager } from '../../audio/soundManager';
import { launchCoinFountain } from '../../fx/celebrations';
import type { GameId } from '../../games/types';

interface MysteryPickModalProps {
  totalBet: number;
  activeGameId?: GameId;
  onComplete: (wonAmount: number) => void;
  onClose?: () => void;
}

interface VaultSafe {
  id: number;
  label: string;
  isOpened: boolean;
  type: 'COINS' | 'MULTIPLIER' | 'EXTRA_PICK' | 'MEGA_PRIZE';
  multiplier: number;
  value: number;
  awardedValue?: number;
  description: string;
}

const VAULT_CONFIGS: Record<GameId, {
  title: string;
  subtitle: string;
  safeName: string;
  accentColor: string;
  borderColor: string;
  icon: string;
}> = {
  'vault-24k': {
    title: 'Fort Knox Safecracker',
    subtitle: 'Pick high-security safety deposit boxes to reveal cash bullion & multipliers!',
    safeName: 'DEPOSIT VAULT',
    accentColor: '#F59E0B',
    borderColor: 'border-yellow-400',
    icon: '👑',
  },
  'timber-critters': {
    title: 'Critter Hollow Cache',
    subtitle: 'Search ancient cedar hollows for golden acorns, forest berries & multipliers!',
    safeName: 'HOLLOW LOG',
    accentColor: '#10B981',
    borderColor: 'border-emerald-500',
    icon: '🌲',
  },
  'pixel-arcade': {
    title: '8-Bit Mystery Block',
    subtitle: 'Crack open retro arcade prize cubes for hidden coin multipliers & extra lives!',
    safeName: 'PRIZE CUBE',
    accentColor: '#EC4899',
    borderColor: 'border-pink-500',
    icon: '🕹️',
  },
  'ps2-legends': {
    title: 'MagicGate Memory Recovery',
    subtitle: 'Recover corrupt save-file sectors from 8MB Memory Cards for credits!',
    safeName: 'SECTOR BLOCK',
    accentColor: '#00F0FF',
    borderColor: 'border-[#006FCD]',
    icon: '🎮',
  },
};

export const MysteryPickModal: React.FC<MysteryPickModalProps> = ({
  totalBet,
  activeGameId = 'vault-24k',
  onComplete,
  onClose,
}) => {
  const isTimber = activeGameId === 'timber-critters';
  const isPixel = activeGameId === 'pixel-arcade';
  const isPs2 = activeGameId === 'ps2-legends';
  const theme = VAULT_CONFIGS[activeGameId] || VAULT_CONFIGS['vault-24k'];

  const [picksRemaining, setPicksRemaining] = useState(3);
  const [totalMultiplier, setTotalMultiplier] = useState(1);
  const [accumulatedPot, setAccumulatedPot] = useState(0);
  const [isFinished, setIsFinished] = useState(false);
  const [recentMessage, setRecentMessage] = useState<string | null>(null);

  // 5 Safes with pre-seeded variety
  const [safes, setSafes] = useState<VaultSafe[]>(() => {
    const prizeTemplates: { type: VaultSafe['type']; mult: number; desc: string }[] = [
      { type: 'COINS', mult: 10, desc: '+10X Bet' },
      { type: 'COINS', mult: 20, desc: '+20X Bet' },
      { type: 'EXTRA_PICK', mult: 5, desc: '+1 Extra Pick & +5X' },
      { type: 'MULTIPLIER', mult: 25, desc: '2X Booster & +25X' },
      { type: 'MEGA_PRIZE', mult: 75, desc: '★ 75X Mega Prize!' },
    ];
    // Shuffle
    const shuffled = [...prizeTemplates].sort(() => Math.random() - 0.5);

    return shuffled.map((p, idx) => ({
      id: idx,
      label: `${theme.safeName} #${idx + 1}`,
      isOpened: false,
      type: p.type,
      multiplier: p.mult,
      value: Math.max(100, Math.round(totalBet * p.mult)),
      description: p.desc,
    }));
  });

  const fanfareTimerRef = useRef<number | null>(null);
  const completedRef = useRef(false);

  useEffect(() => {
    return () => {
      if (fanfareTimerRef.current) clearTimeout(fanfareTimerRef.current);
    };
  }, []);

  const handlePickSafe = useCallback(
    (safeId: number) => {
      if (picksRemaining <= 0 || isFinished) return;
      const safe = safes.find((s) => s.id === safeId);
      if (!safe || safe.isOpened) return;

      soundManager.vibrate(35);
      if (isPs2) {
        soundManager.playPs2MemoryCardSave();
      } else if (isPixel) {
        soundManager.playLaserZap();
      } else if (isTimber) {
        soundManager.playAcornChime();
      } else {
        soundManager.playVaultLock();
      }

      let nextMultiplier = totalMultiplier;
      let extraPicks = 0;
      const appliedCash = safe.value * totalMultiplier;

      if (safe.type === 'MULTIPLIER') {
        nextMultiplier *= 2;
        setTotalMultiplier(nextMultiplier);
        soundManager.playWinChime(15);
        setRecentMessage(
          `2X MULTIPLIER ACTIVE (${nextMultiplier}X)! +${appliedCash.toLocaleString()} COINS!`
        );
      } else if (safe.type === 'EXTRA_PICK') {
        extraPicks = 1;
        soundManager.playCelebrationWhistle();
        setRecentMessage(
          `LUCKY KEY! +1 EXTRA PICK GRANTED & +${appliedCash.toLocaleString()} COINS${totalMultiplier > 1 ? ` (${totalMultiplier}X)` : ''}!`
        );
      } else if (safe.type === 'MEGA_PRIZE') {
        soundManager.playJackpotFanfare();
        launchCoinFountain('big');
        setRecentMessage(
          `★ MEGA JACKPOT SAFECRACK! +${appliedCash.toLocaleString()} COINS${totalMultiplier > 1 ? ` (${totalMultiplier}X)` : ''}! ★`
        );
      } else {
        soundManager.playCashRegister();
        soundManager.playCoinCascade(4);
        setRecentMessage(
          `+${appliedCash.toLocaleString()} COINS ADDED TO HOARD${totalMultiplier > 1 ? ` (${totalMultiplier}X)` : ''}!`
        );
      }

      const updatedSafes = safes.map((s) =>
        s.id === safeId ? { ...s, isOpened: true, awardedValue: appliedCash } : s
      );
      setSafes(updatedSafes);

      setAccumulatedPot((prev) => prev + appliedCash);

      const nextPicks = picksRemaining - 1 + extraPicks;
      setPicksRemaining(nextPicks);

      if (nextPicks <= 0 || updatedSafes.every((s) => s.isOpened)) {
        setIsFinished(true);
        fanfareTimerRef.current = window.setTimeout(() => {
          soundManager.playJackpotFanfare();
          soundManager.speakAnnouncer('Bonus Complete! Excellent work!');
          launchCoinFountain('mega');
        }, 700);
      }
    },
    [picksRemaining, isFinished, safes, totalMultiplier, isPs2, isPixel, isTimber]
  );

  const handleCollect = useCallback(() => {
    if (completedRef.current) return;
    completedRef.current = true;
    soundManager.playButtonClick();
    soundManager.playCoinTally();
    onComplete(accumulatedPot);
  }, [onComplete, accumulatedPot]);

  // Keyboard navigation: 1-5 keys to pick, Space/Enter to collect
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (isFinished) {
        if (e.code === 'Space' || e.code === 'Enter' || e.key === 'Escape') {
          e.preventDefault();
          e.stopPropagation();
          handleCollect();
        }
        return;
      }

      const num = parseInt(e.key, 10);
      if (!isNaN(num) && num >= 1 && num <= safes.length) {
        e.preventDefault();
        e.stopPropagation();
        handlePickSafe(num - 1);
      } else if (e.key === 'Escape' && onClose && accumulatedPot === 0) {
        e.preventDefault();
        e.stopPropagation();
        soundManager.playButtonClick();
        onClose();
      }
    };

    window.addEventListener('keydown', handleKeyDown, { capture: true });
    return () => window.removeEventListener('keydown', handleKeyDown, { capture: true });
  }, [isFinished, safes.length, accumulatedPot, onClose, handleCollect, handlePickSafe]);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-5 bg-black/90 backdrop-blur-md select-none animate-fadeIn">
      <div
        className={`relative max-w-xl w-full max-h-[92vh] overflow-y-auto rounded-3xl p-4 sm:p-6 shadow-2xl flex flex-col items-center border-2 ${
          isPs2
            ? 'bg-gradient-to-b from-[#030919] via-[#050f29] to-black border-[#006FCD] shadow-[0_0_60px_rgba(0,111,205,0.7)] font-mono text-cyan-200'
            : isPixel
            ? 'bg-gradient-to-b from-[#1b052e] via-[#0e021a] to-black border-pink-500 shadow-[0_0_60px_rgba(236,72,153,0.6)] font-mono text-pink-200'
            : isTimber
            ? 'bg-gradient-to-b from-[#241308] via-[#140b04] to-[#040804] border-[#b45309] shadow-[0_0_60px_rgba(180,83,9,0.5)] text-amber-200 font-serif'
            : 'bg-gradient-to-b from-[#241703] via-casino-950 to-black border-yellow-400 shadow-[0_0_60px_rgba(245,158,11,0.6)] text-yellow-200'
        }`}
      >
        {/* Close Button */}
        {onClose && (
          <button
            onClick={() => {
              soundManager.playButtonClick();
              onClose();
            }}
            disabled={!isFinished && accumulatedPot > 0}
            className="absolute top-4 right-4 p-2 rounded-xl bg-casino-900 hover:bg-casino-800 text-slate-400 hover:text-white"
          >
            <X className="w-5 h-5" />
          </button>
        )}

        {/* Header Title */}
        <div className="flex items-center space-x-2 text-xs font-black uppercase tracking-widest mb-1">
          <Sparkles className="w-4 h-4 text-yellow-400 animate-spin" />
          <span>{theme.title}</span>
          <Sparkles className="w-4 h-4 text-yellow-400 animate-spin" />
        </div>
        <h2 className="text-xl sm:text-2xl font-black uppercase text-white tracking-wide text-center mb-1">
          {theme.title}
        </h2>
        <p className="text-[11px] sm:text-xs text-slate-300 text-center max-w-md mb-4">
          {theme.subtitle}
        </p>

        {/* Dashboard Stat Chips */}
        <div className="grid grid-cols-3 gap-2 w-full mb-4">
          <div className="flex flex-col items-center justify-center p-2 rounded-xl bg-black/60 border border-white/10">
            <span className="text-[9px] uppercase font-bold text-slate-400">Picks Left</span>
            <span className="text-lg sm:text-xl font-black text-amber-400 font-mono">
              {picksRemaining}
            </span>
          </div>

          <div className="flex flex-col items-center justify-center p-2 rounded-xl bg-black/60 border border-white/10">
            <span className="text-[9px] uppercase font-bold text-slate-400">Total Pot</span>
            <span className="text-lg sm:text-xl font-black text-emerald-400 font-mono">
              +{accumulatedPot.toLocaleString()}
            </span>
          </div>

          <div className="flex flex-col items-center justify-center p-2 rounded-xl bg-black/60 border border-white/10">
            <span className="text-[9px] uppercase font-bold text-slate-400">Multiplier</span>
            <span className="text-lg sm:text-xl font-black text-cyan-300 font-mono">
              {totalMultiplier}X
            </span>
          </div>
        </div>

        {/* Recent Message Toast */}
        {recentMessage && (
          <div className="w-full mb-3 p-2 rounded-xl bg-gradient-to-r from-amber-950 via-slate-900 to-amber-950 border border-yellow-400/60 text-center text-xs font-black text-yellow-300 tracking-wide animate-pulse">
            {recentMessage}
          </div>
        )}

        {/* 5 Interactive Vault Safes */}
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5 sm:gap-3.5 w-full my-2">
          {safes.map((safe, idx) => {
            const isClickable = !safe.isOpened && picksRemaining > 0 && !isFinished;

            return (
              <button
                key={safe.id}
                type="button"
                onClick={() => handlePickSafe(safe.id)}
                disabled={!isClickable}
                className={`relative flex flex-col items-center justify-center p-3 rounded-2xl border-2 transition-all min-h-[110px] sm:min-h-[125px] ${
                  safe.isOpened
                    ? 'bg-gradient-to-b from-amber-950/80 to-black border-yellow-400/80 shadow-[0_0_20px_rgba(245,158,11,0.5)]'
                    : isClickable
                    ? 'bg-gradient-to-b from-slate-900 to-black hover:from-slate-800 hover:scale-105 active:scale-95 border-white/20 shadow-lg cursor-pointer'
                    : 'bg-black/60 border-white/5 opacity-50 cursor-not-allowed'
                }`}
              >
                {/* Hotkey Badge */}
                {!safe.isOpened && (
                  <span className="absolute top-1.5 left-2 px-1.5 py-0.5 rounded bg-white/10 text-[8.5px] font-mono font-bold text-slate-300">
                    #{idx + 1}
                  </span>
                )}

                {safe.isOpened ? (
                  <div className="flex flex-col items-center justify-center space-y-1 animate-bounce-soft">
                    <Unlock className="w-6 h-6 text-yellow-300 mb-0.5" />
                    <span className="text-xs sm:text-sm font-black text-white font-mono leading-none">
                      +{(safe.awardedValue ?? safe.value).toLocaleString()}
                    </span>
                    <span className="text-[9.5px] font-bold text-amber-300 leading-tight">
                      {safe.description}
                    </span>
                  </div>
                ) : (
                  <div className="flex flex-col items-center justify-center space-y-1">
                    <div className="w-10 h-10 rounded-full bg-white/5 border border-white/15 flex items-center justify-center shadow-inner mb-1">
                      {isTimber ? (
                        <Trees className="w-5 h-5 text-emerald-400" />
                      ) : isPixel ? (
                        <Gamepad2 className="w-5 h-5 text-pink-400" />
                      ) : isPs2 ? (
                        <span className="text-lg">💾</span>
                      ) : (
                        <Lock className="w-5 h-5 text-yellow-400" />
                      )}
                    </div>
                    <span className="text-[10px] font-black uppercase tracking-wider text-slate-300">
                      {safe.label}
                    </span>
                    <span className="text-[8px] font-mono text-slate-400">
                      {isClickable ? 'CLICK OR TAP' : 'LOCKED'}
                    </span>
                  </div>
                )}
              </button>
            );
          })}
        </div>

        {/* Footer Action */}
        <div className="w-full mt-4">
          {isFinished ? (
            <button
              type="button"
              onClick={handleCollect}
              className="gold-btn w-full py-3.5 rounded-2xl font-black text-sm uppercase tracking-wider text-casino-950 hover:scale-105 active:scale-95 transition-transform flex items-center justify-center space-x-2"
            >
              <CheckCircle2 className="w-5 h-5" />
              <span>COLLECT +{accumulatedPot.toLocaleString()} COINS</span>
              <span className="px-2 py-0.5 rounded bg-black/25 text-[11px] font-mono font-bold">SPACE</span>
            </button>
          ) : (
            <div className="text-center text-[10px] text-slate-400">
              Press keys <strong className="text-white">1 - 5</strong> on your keyboard to crack corresponding safes!
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
