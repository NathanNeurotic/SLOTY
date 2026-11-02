import React, { useEffect, useState, useRef } from 'react';
import { Trophy, Coins, Sparkles } from 'lucide-react';
import { soundManager } from '../../audio/soundManager';
import { launchCoinFountain } from '../../fx/celebrations';

interface LevelUpModalProps {
  newLevel: number;
  bonusCoins: number;
  newMaxBet: number;
  onClaim: () => void;
  autoSpinsRemaining?: number;
}

export const LevelUpModal: React.FC<LevelUpModalProps> = ({
  newLevel,
  bonusCoins,
  newMaxBet,
  onClaim,
  autoSpinsRemaining = 0,
}) => {
  const [countdown, setCountdown] = useState(autoSpinsRemaining > 0 ? 3 : 5);
  const claimedRef = useRef(false);

  const handleClaim = () => {
    if (claimedRef.current) return;
    claimedRef.current = true;
    soundManager.playButtonClick();
    onClaim();
  };

  useEffect(() => {
    soundManager.playLevelUp();
    launchCoinFountain('big');

    // Space / Enter / Escape to instantly claim and clear level up modal
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.code === 'Space' || e.code === 'Enter' || e.key === 'Escape') {
        e.preventDefault();
        e.stopPropagation();
        handleClaim();
      }
    };
    window.addEventListener('keydown', handleKeyDown, { capture: true });

    // Auto-claim countdown so the game never locks up or hangs
    const timer = setInterval(() => {
      setCountdown((prev) => {
        if (prev <= 1) {
          clearInterval(timer);
          handleClaim();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => {
      clearInterval(timer);
      window.removeEventListener('keydown', handleKeyDown, { capture: true });
    };
  }, []);

  return (
    <div
      onClick={handleClaim}
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/90 select-none cursor-pointer animate-fadeIn"
    >
      <div
        onClick={(e) => e.stopPropagation()}
        className="relative max-w-sm w-full bg-casino-950 border-2 border-purple-500 shadow-[0_0_50px_rgba(168,85,247,0.7)] rounded-3xl p-6 text-center flex flex-col items-center"
      >
        {/* Level Up Trophy */}
        <div className="w-16 h-16 rounded-full bg-gradient-to-tr from-purple-600 to-pink-500 flex items-center justify-center shadow-[0_0_25px_rgba(168,85,247,0.8)] mb-3 animate-bounce">
          <Trophy className="w-9 h-9 text-yellow-300" />
        </div>

        <div className="flex items-center space-x-1.5 text-purple-300 text-xs font-bold uppercase tracking-widest mb-1">
          <Sparkles className="w-4 h-4" />
          <span>VIP PROGRESSION</span>
          <Sparkles className="w-4 h-4" />
        </div>

        <h2 className="text-3xl font-black text-white uppercase mb-1">
          Level {newLevel} Reached!
        </h2>
        <p className="text-slate-400 text-xs mb-4">
          Congratulations on reaching a higher tier status!
        </p>

        {/* Rewards Box */}
        <div className="w-full bg-casino-900 border border-white/10 rounded-2xl p-3.5 mb-5 space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-xs text-slate-300 flex items-center space-x-1.5">
              <Coins className="w-4 h-4 text-gold-bright" />
              <span>Coin Bonus:</span>
            </span>
            <span className="text-sm font-black text-gold-light">
              +{bonusCoins.toLocaleString()}
            </span>
          </div>

          <div className="flex items-center justify-between border-t border-white/5 pt-2">
            <span className="text-xs text-slate-300">Max Bet Unlocked:</span>
            <span className="text-sm font-black text-purple-300">
              {newMaxBet.toLocaleString()}
            </span>
          </div>
        </div>

        <button
          onClick={handleClaim}
          className="gold-btn w-full py-3 rounded-2xl font-black text-sm uppercase tracking-wider text-casino-950 hover:scale-105 active:scale-95 transition-transform"
        >
          CLAIM &amp; CONTINUE {countdown > 0 && `(${countdown}s)`}
        </button>

        <p className="text-[10px] text-slate-500 mt-2">
          Tap anywhere to claim instantly
        </p>
      </div>
    </div>
  );
};
