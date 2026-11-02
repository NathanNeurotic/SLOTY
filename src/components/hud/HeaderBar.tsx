import React from 'react';
import { Coins, Trophy, Gift, Volume2, VolumeX, HelpCircle, Terminal } from 'lucide-react';
import type { ProgressionState } from '../../engine/types';
import { soundManager } from '../../audio/soundManager';
import { SlotyLogo } from './SlotyLogo';

interface HeaderBarProps {
  balance: number;
  progression: ProgressionState;
  isMuted: boolean;
  canClaimBonus: boolean;
  timeUntilBonus: string;
  onToggleMute: () => void;
  onOpenPaytable: () => void;
  onOpenBonusWheel: () => void;
  onToggleDebug: () => void;
}

export const HeaderBar: React.FC<HeaderBarProps> = ({
  balance,
  progression,
  isMuted,
  canClaimBonus,
  timeUntilBonus,
  onToggleMute,
  onOpenPaytable,
  onOpenBonusWheel,
  onToggleDebug,
}) => {
  return (
    <header className="w-full bg-casino-950/90 border-b border-white/10 px-3 sm:px-6 py-2.5 backdrop-blur-md sticky top-0 z-30 select-none">
      <div className="max-w-6xl mx-auto flex items-center justify-between gap-2">
        {/* Left: Brand Logo & Title */}
        <SlotyLogo />

        {/* Center: Coin Balance & VIP Level Progression */}
        <div className="flex items-center space-x-2 sm:space-x-4">
          {/* Coins Balance Box */}
          <div className="flex items-center space-x-2 bg-casino-900 border border-gold-bright/40 px-3 sm:px-4 py-1.5 rounded-2xl shadow-[inset_0_0_10px_rgba(245,158,11,0.2)]">
            <div className="w-6 h-6 rounded-full bg-gradient-to-tr from-amber-500 to-yellow-300 flex items-center justify-center text-casino-950 shadow-sm">
              <Coins className="w-4 h-4 fill-amber-950 text-amber-950" />
            </div>
            <div className="flex flex-col">
              <span className="text-[9px] uppercase font-bold text-slate-400 leading-none">
                Coins
              </span>
              <span className="text-sm sm:text-base font-black text-gold-light leading-tight">
                {balance.toLocaleString()}
              </span>
            </div>
          </div>

          {/* VIP Level & XP Bar */}
          <div className="hidden sm:flex items-center space-x-2 bg-casino-900/80 border border-white/10 px-3 py-1.5 rounded-2xl">
            <div className="w-6 h-6 rounded-full bg-purple-600/30 border border-purple-400 flex items-center justify-center text-purple-300">
              <Trophy className="w-3.5 h-3.5" />
            </div>
            <div className="flex flex-col min-w-[90px]">
              <div className="flex items-center justify-between text-[9px] font-bold">
                <span className="text-purple-300">VIP Lv.{progression.level}</span>
                <span className="text-slate-400">{progression.progressPercent}%</span>
              </div>
              <div className="w-full bg-casino-950 h-1.5 rounded-full overflow-hidden mt-0.5 border border-white/5">
                <div
                  className="bg-gradient-to-r from-purple-500 to-neon-magenta h-full rounded-full transition-all duration-300"
                  style={{ width: `${progression.progressPercent}%` }}
                />
              </div>
            </div>
          </div>
        </div>

        {/* Right: Actions, Bonus Wheel, Audio, Paytable & Debug */}
        <div className="flex items-center space-x-1 sm:space-x-2">
          {/* Daily Bonus Wheel Button */}
          <button
            onClick={() => {
              soundManager.playButtonClick();
              onOpenBonusWheel();
            }}
            className={`relative flex items-center space-x-1.5 px-2.5 sm:px-3 py-1.5 rounded-xl border text-xs font-bold transition-all ${
              canClaimBonus
                ? 'bg-gradient-to-r from-pink-600 to-purple-600 border-pink-400 text-white shadow-[0_0_15px_rgba(236,72,153,0.7)] animate-pulse'
                : 'vlt-btn-stepper text-amber-300 hover:text-white'
            }`}
          >
            <Gift className={`w-4 h-4 ${canClaimBonus ? 'animate-bounce text-yellow-300' : 'text-amber-400'}`} />
            <span className="hidden md:inline font-mono">
              {canClaimBonus ? 'FREE COINS!' : timeUntilBonus}
            </span>
          </button>

          {/* Audio Mute Toggle */}
          <button
            onClick={() => {
              soundManager.playButtonClick();
              onToggleMute();
            }}
            title={isMuted ? 'Unmute Sound' : 'Mute Sound'}
            className="p-2 rounded-xl vlt-btn-stepper text-slate-300 hover:text-white transition-colors"
          >
            {isMuted ? <VolumeX className="w-4 h-4 text-rose-400" /> : <Volume2 className="w-4 h-4 text-cyan-300" />}
          </button>

          {/* Paytable & Rules Modal Button */}
          <button
            onClick={() => {
              soundManager.playButtonClick();
              onOpenPaytable();
            }}
            title="Paytable & Rules"
            className="p-2 rounded-xl vlt-btn-stepper text-slate-300 hover:text-white transition-colors"
          >
            <HelpCircle className="w-4 h-4 text-amber-300" />
          </button>

          {/* Debug Menu Toggle */}
          <button
            onClick={() => {
              soundManager.playButtonClick();
              onToggleDebug();
            }}
            title="Open Developer Debug Suite (~ / D)"
            className="flex items-center space-x-1 px-2.5 py-1.5 rounded-xl bg-gradient-to-b from-emerald-900 to-emerald-950 border border-emerald-400/50 text-emerald-300 text-xs font-mono font-bold transition-all shadow-[0_0_12px_rgba(16,185,129,0.3)] hover:brightness-110 active:translate-y-0.5"
          >
            <Terminal className="w-3.5 h-3.5 text-emerald-400" />
            <span className="hidden lg:inline">DEBUG</span>
          </button>
        </div>
      </div>
    </header>
  );
};
