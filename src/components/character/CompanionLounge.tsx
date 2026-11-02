import React, { useState } from 'react';
import { RubySparkle } from './RubySparkle';
import { BarnabyBullion } from './BarnabyBullion';
import { storage } from '../../utils/storage';
import { Sparkles, Crown } from 'lucide-react';

export type CompanionMode = 'dual' | 'ruby' | 'barnaby';

interface CompanionLoungeProps {
  isSpinning: boolean;
  isAnticipating: boolean;
  isWinning: boolean;
  isBigWin?: boolean;
  isFeverMode?: boolean;
  winAmount?: number;
  onRewardCoins?: (amount: number) => void;
  position: 'desktop-left' | 'desktop-right' | 'mobile-bar';
}

export const CompanionLounge: React.FC<CompanionLoungeProps> = ({
  isSpinning,
  isAnticipating,
  isWinning,
  isBigWin = false,
  isFeverMode = false,
  winAmount = 0,
  onRewardCoins,
  position,
}) => {
  const [companionMode, setCompanionMode] = useState<CompanionMode>(() => {
    return (storage.getItem('sloty_companion_mode') as CompanionMode) || 'dual';
  });

  const handleToggleMode = (mode: CompanionMode) => {
    setCompanionMode(mode);
    storage.setItem('sloty_companion_mode', mode);
  };

  // Position: Desktop Left (Ruby Sparkle by default in dual mode, or active companion)
  if (position === 'desktop-left') {
    if (companionMode === 'barnaby') return null;

    return (
      <div className="relative">
        <RubySparkle
          isSpinning={isSpinning}
          isAnticipating={isAnticipating}
          isWinning={isWinning}
          isBigWin={isBigWin}
          isFeverMode={isFeverMode}
          winAmount={winAmount}
          onRewardCoins={onRewardCoins}
          variant="full"
        />
      </div>
    );
  }

  // Position: Desktop Right (Barnaby Bullion by default in dual mode, or active companion)
  if (position === 'desktop-right') {
    if (companionMode === 'ruby') return null;

    return (
      <div className="relative">
        <BarnabyBullion
          isSpinning={isSpinning}
          isAnticipating={isAnticipating}
          isWinning={isWinning}
          isBigWin={isBigWin}
          isFeverMode={isFeverMode}
          winAmount={winAmount}
          onRewardCoins={onRewardCoins}
          variant="full"
        />
      </div>
    );
  }

  // Position: Mobile / Tablet Bar (Interactive VIP Carousel Bar with Switcher)
  return (
    <div className="w-full flex flex-col items-center space-y-1 select-none">
      {/* Switcher Tabs */}
      <div className="flex items-center space-x-1.5 bg-casino-900/90 p-0.5 rounded-full border border-white/10 shadow-md">
        <button
          onClick={() => handleToggleMode('ruby')}
          className={`flex items-center space-x-1 px-2.5 py-0.5 rounded-full text-[10px] font-black uppercase tracking-wider transition-all ${
            companionMode === 'ruby'
              ? 'bg-rose-600 text-white shadow-[0_0_10px_rgba(244,63,94,0.8)] scale-105'
              : 'text-rose-300 hover:text-white'
          }`}
        >
          <Sparkles className="w-2.5 h-2.5 fill-current" />
          <span>Ruby Sparkle</span>
        </button>

        <button
          onClick={() => handleToggleMode('dual')}
          className={`flex items-center space-x-1 px-2 py-0.5 rounded-full text-[10px] font-black uppercase tracking-wider transition-all ${
            companionMode === 'dual'
              ? 'bg-gradient-to-r from-rose-600 via-amber-500 to-yellow-400 text-black shadow-[0_0_10px_rgba(245,158,11,0.8)] scale-105 font-black'
              : 'text-amber-300 hover:text-white'
          }`}
        >
          <Crown className="w-2.5 h-2.5 fill-current" />
          <span>Duo Lounge</span>
        </button>

        <button
          onClick={() => handleToggleMode('barnaby')}
          className={`flex items-center space-x-1 px-2.5 py-0.5 rounded-full text-[10px] font-black uppercase tracking-wider transition-all ${
            companionMode === 'barnaby'
              ? 'bg-amber-500 text-black shadow-[0_0_10px_rgba(245,158,11,0.8)] scale-105'
              : 'text-amber-300 hover:text-white'
          }`}
        >
          <Sparkles className="w-2.5 h-2.5 fill-current" />
          <span>Barnaby</span>
        </button>
      </div>

      {/* Render Active Companion(s) in Compact Bar */}
      <div className="w-full flex justify-center items-center gap-2 flex-wrap">
        {(companionMode === 'ruby' || companionMode === 'dual') && (
          <div className="flex-1 min-w-[200px] max-w-sm">
            <RubySparkle
              isSpinning={isSpinning}
              isAnticipating={isAnticipating}
              isWinning={isWinning}
              isBigWin={isBigWin}
              isFeverMode={isFeverMode}
              winAmount={winAmount}
              onRewardCoins={onRewardCoins}
              variant="compact"
            />
          </div>
        )}

        {(companionMode === 'barnaby' || companionMode === 'dual') && (
          <div className="flex-1 min-w-[200px] max-w-sm">
            <BarnabyBullion
              isSpinning={isSpinning}
              isAnticipating={isAnticipating}
              isWinning={isWinning}
              isBigWin={isBigWin}
              isFeverMode={isFeverMode}
              winAmount={winAmount}
              onRewardCoins={onRewardCoins}
              variant="compact"
            />
          </div>
        )}
      </div>
    </div>
  );
};
