import React, { useState } from 'react';
import { RubySparkle } from './RubySparkle';
import { storage } from '../../utils/storage';
import { Eye, EyeOff } from 'lucide-react';
import type { GameId } from '../../games/types';

interface CompanionLoungeProps {
  isSpinning: boolean;
  isAnticipating: boolean;
  isWinning: boolean;
  isBigWin?: boolean;
  isFeverMode?: boolean;
  winAmount?: number;
  onRewardCoins?: (amount: number) => void;
  position: 'desktop-flank' | 'mobile-bar';
  activeGameId?: GameId;
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
  activeGameId = 'vault-24k',
}) => {
  const [isVisible, setIsVisible] = useState<boolean>(() => {
    return storage.getBoolean('sloty_hostess_visible', true);
  });

  const handleToggleVisible = () => {
    setIsVisible((prev) => {
      const next = !prev;
      storage.setItem('sloty_hostess_visible', next.toString());
      return next;
    });
  };

  if (!isVisible && position === 'desktop-flank') return null;

  // Desktop Flank: Elegantly placed on the side, NEVER overlapping the cabinet
  if (position === 'desktop-flank') {
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
          activeGameId={activeGameId}
        />
      </div>
    );
  }

  // Mobile / Responsive Compact Bar
  return (
    <div className="w-full flex justify-center items-center select-none py-0.5">
      {isVisible ? (
        <div className="flex items-center space-x-1.5 w-full max-w-sm">
          <div className="flex-1">
            <RubySparkle
              isSpinning={isSpinning}
              isAnticipating={isAnticipating}
              isWinning={isWinning}
              isBigWin={isBigWin}
              isFeverMode={isFeverMode}
              winAmount={winAmount}
              onRewardCoins={onRewardCoins}
              variant="compact"
              activeGameId={activeGameId}
            />
          </div>
          <button
            onClick={handleToggleVisible}
            title="Hide Hostess"
            className="p-1 rounded-full text-slate-400 hover:text-white bg-casino-900/80 border border-white/10"
          >
            <EyeOff className="w-3 h-3" />
          </button>
        </div>
      ) : (
        <button
          onClick={handleToggleVisible}
          className="flex items-center space-x-1 px-3 py-1 rounded-full text-[10px] font-bold text-rose-300 bg-rose-950/80 border border-rose-500/30 hover:scale-105 transition-transform"
        >
          <Eye className="w-3 h-3 text-rose-400" />
          <span>Show Hostess Ruby (+50 Coins)</span>
        </button>
      )}
    </div>
  );
};
