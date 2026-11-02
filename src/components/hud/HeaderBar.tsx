import React, { useState } from 'react';
import {
  Coins,
  Trophy,
  Gift,
  Volume2,
  VolumeX,
  Music,
  HelpCircle,
  Terminal,
  Sliders,
} from 'lucide-react';
import type { ProgressionState } from '../../engine/types';
import { soundManager } from '../../audio/soundManager';
import { SlotyLogo } from './SlotyLogo';
import { SceneSelector } from '../scenes/SceneSelector';
import type { CasinoSceneId } from '../scenes/SceneTypes';

interface HeaderBarProps {
  balance: number;
  progression: ProgressionState;
  isMuted: boolean;
  canClaimBonus: boolean;
  timeUntilBonus: string;
  currentSceneId: CasinoSceneId;
  onSelectScene: (sceneId: CasinoSceneId) => void;
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
  currentSceneId,
  onSelectScene,
  onToggleMute,
  onOpenPaytable,
  onOpenBonusWheel,
  onToggleDebug,
}) => {
  const [isMusicOn, setIsMusicOn] = useState(false);
  const [showAudioPopover, setShowAudioPopover] = useState(false);
  const [sfxVol, setSfxVol] = useState(70);
  const [musicVol, setMusicVol] = useState(35);

  const handleToggleMusic = () => {
    soundManager.toggleMusic();
    setIsMusicOn(soundManager.isMusicPlaying());
  };

  const handleSfxChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = Number(e.target.value);
    setSfxVol(val);
    soundManager.setVolume(val / 100);
  };

  const handleMusicChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = Number(e.target.value);
    setMusicVol(val);
    soundManager.setMusicVolume(val / 100);
    if (!isMusicOn && val > 0) {
      soundManager.startMusic();
      setIsMusicOn(true);
    }
  };

  return (
    <header className="w-full bg-casino-950/95 border-b border-white/10 px-2 sm:px-5 py-2 backdrop-blur-md sticky top-0 z-30 select-none">
      <div className="max-w-6xl mx-auto flex items-center justify-between gap-1.5 sm:gap-3 flex-wrap">
        {/* Left: Brand Logo & Title */}
        <SlotyLogo />

        {/* Center-Left: Coin Balance & VIP Level Progression */}
        <div className="flex items-center space-x-1.5 sm:space-x-3">
          {/* Coins Balance Box */}
          <div className="flex items-center space-x-1.5 sm:space-x-2 bg-gradient-to-b from-casino-900 to-casino-950 border border-gold-bright/50 px-2.5 sm:px-3.5 py-1 rounded-2xl shadow-[inset_0_0_12px_rgba(245,158,11,0.25)]">
            <div className="w-5 h-5 sm:w-6 sm:h-6 rounded-full bg-gradient-to-tr from-amber-500 to-yellow-300 flex items-center justify-center text-casino-950 shadow-sm flex-shrink-0">
              <Coins className="w-3.5 h-3.5 fill-amber-950 text-amber-950" />
            </div>
            <div className="flex flex-col">
              <span className="text-[7.5px] sm:text-[8.5px] uppercase font-bold text-slate-400 leading-none">
                Cash Vault
              </span>
              <span className="text-xs sm:text-base font-black text-gold-light leading-tight font-mono">
                ${balance.toLocaleString()}
              </span>
            </div>
          </div>

          {/* VIP Level & XP Bar */}
          <div className="hidden md:flex items-center space-x-2 bg-casino-900/80 border border-white/10 px-2.5 py-1 rounded-2xl">
            <div className="w-5 h-5 rounded-full bg-purple-600/30 border border-purple-400 flex items-center justify-center text-purple-300 flex-shrink-0">
              <Trophy className="w-3 h-3" />
            </div>
            <div className="flex flex-col min-w-[80px]">
              <div className="flex items-center justify-between text-[8px] font-bold">
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

        {/* Center: Full Scenic Environment Selector */}
        <div className="hidden lg:flex items-center">
          <SceneSelector
            currentSceneId={currentSceneId}
            onSelectScene={onSelectScene}
          />
        </div>

        {/* Right: Actions, Music & Audio Controls, Bonus Wheel & Help */}
        <div className="flex items-center space-x-1 sm:space-x-1.5 relative">
          {/* Daily Bonus Wheel Button */}
          <button
            onClick={() => {
              soundManager.playButtonClick();
              onOpenBonusWheel();
            }}
            className={`relative flex items-center space-x-1 px-2 sm:px-2.5 py-1.5 rounded-xl border text-[10px] sm:text-xs font-bold transition-all flex-shrink-0 ${
              canClaimBonus
                ? 'bg-gradient-to-r from-pink-600 to-purple-600 border-pink-400 text-white shadow-[0_0_15px_rgba(236,72,153,0.7)] animate-pulse'
                : 'vlt-btn-stepper text-amber-300 hover:text-white'
            }`}
          >
            <Gift className={`w-3.5 h-3.5 ${canClaimBonus ? 'animate-bounce text-yellow-300' : 'text-amber-400'}`} />
            <span className="hidden sm:inline font-mono">
              {canClaimBonus ? 'FREE BONUS' : timeUntilBonus}
            </span>
          </button>

          {/* Background Lounge Music Toggle */}
          <button
            onClick={handleToggleMusic}
            title={isMusicOn ? 'Mute Casino Lounge Music' : 'Play Vegas VIP Lounge Music'}
            className={`flex items-center space-x-1 px-2 py-1.5 rounded-xl border transition-all flex-shrink-0 ${
              isMusicOn
                ? 'bg-gradient-to-b from-emerald-600/40 to-emerald-950 border-emerald-400 text-emerald-300 shadow-[0_0_15px_rgba(16,185,129,0.5)]'
                : 'vlt-btn-stepper text-slate-400 hover:text-white'
            }`}
          >
            <Music className={`w-3.5 h-3.5 ${isMusicOn ? 'text-emerald-300 animate-pulse' : 'text-slate-400'}`} />
            <span className="hidden xs:inline text-[9px] sm:text-[10px] font-black uppercase tracking-wider">
              {isMusicOn ? 'MUSIC ON' : 'MUSIC'}
            </span>
          </button>

          {/* Master Audio Mute Toggle */}
          <button
            onClick={() => {
              soundManager.playButtonClick();
              onToggleMute();
            }}
            title={isMuted ? 'Unmute All Sounds' : 'Mute All Sounds'}
            className={`p-1.5 sm:p-2 rounded-xl border transition-all flex-shrink-0 ${
              isMuted
                ? 'bg-rose-950/60 border-rose-500/80 text-rose-400 shadow-[0_0_10px_rgba(244,63,94,0.4)]'
                : 'vlt-btn-stepper text-slate-300 hover:text-white'
            }`}
          >
            {isMuted ? <VolumeX className="w-4 h-4 text-rose-400" /> : <Volume2 className="w-4 h-4 text-emerald-400" />}
          </button>

          {/* Audio Controls Popover Button (Sliders) */}
          <button
            onClick={() => {
              soundManager.playButtonClick();
              setShowAudioPopover(!showAudioPopover);
            }}
            title="Audio & Sound Mixer"
            className="p-1.5 sm:p-2 rounded-xl vlt-btn-stepper text-slate-400 hover:text-white transition-colors"
          >
            <Sliders className="w-4 h-4 text-yellow-300" />
          </button>

          {/* Paytable & Rules Button */}
          <button
            onClick={() => {
              soundManager.playButtonClick();
              onOpenPaytable();
            }}
            title="Paytable & Rules"
            className="p-1.5 sm:p-2 rounded-xl vlt-btn-stepper text-slate-400 hover:text-white transition-colors"
          >
            <HelpCircle className="w-4 h-4 text-cyan-300" />
          </button>

          {/* Debug Drawer Toggle Button */}
          <button
            onClick={() => {
              soundManager.playButtonClick();
              onToggleDebug();
            }}
            title="Developer Rig Suite"
            className="p-1.5 sm:p-2 rounded-xl vlt-btn-stepper text-slate-400 hover:text-amber-400 transition-colors"
          >
            <Terminal className="w-4 h-4 text-slate-400 hover:text-amber-300" />
          </button>

          {/* Audio Mixer Popover Drawer */}
          {showAudioPopover && (
            <div className="absolute right-0 top-full mt-2 w-72 bg-casino-950 border-2 border-yellow-400/80 rounded-2xl p-3.5 shadow-2xl z-50 animate-fadeIn text-slate-200">
              <div className="flex items-center justify-between pb-2 border-b border-white/10 mb-3">
                <span className="text-xs font-black uppercase gold-gradient-text tracking-wider">
                  Vegas Sound Studio
                </span>
                <button
                  onClick={() => setShowAudioPopover(false)}
                  className="text-slate-400 hover:text-white text-xs font-bold"
                >
                  ✕
                </button>
              </div>

              {/* Background Music Volume Slider */}
              <div className="mb-3">
                <div className="flex items-center justify-between text-[10px] font-bold text-slate-300 mb-1">
                  <span className="flex items-center space-x-1">
                    <Music className="w-3 h-3 text-emerald-400" />
                    <span>Lounge Music</span>
                  </span>
                  <span className="font-mono text-emerald-400">{musicVol}%</span>
                </div>
                <input
                  type="range"
                  min="0"
                  max="100"
                  value={musicVol}
                  onChange={handleMusicChange}
                  className="w-full accent-emerald-400 cursor-pointer"
                />
              </div>

              {/* Sound FX Volume Slider */}
              <div className="mb-3">
                <div className="flex items-center justify-between text-[10px] font-bold text-slate-300 mb-1">
                  <span className="flex items-center space-x-1">
                    <Volume2 className="w-3 h-3 text-amber-400" />
                    <span>Sound Effects</span>
                  </span>
                  <span className="font-mono text-amber-400">{sfxVol}%</span>
                </div>
                <input
                  type="range"
                  min="0"
                  max="100"
                  value={sfxVol}
                  onChange={handleSfxChange}
                  className="w-full accent-amber-400 cursor-pointer"
                />
              </div>

              {/* Interactive Sound Test Buttons */}
              <div className="pt-2 border-t border-white/10">
                <div className="text-[9px] font-bold uppercase text-slate-400 mb-1.5">
                  Test Wealth &amp; Cash Audio:
                </div>
                <div className="grid grid-cols-2 gap-1.5">
                  <button
                    onClick={() => soundManager.playCashRegister()}
                    className="px-2 py-1 bg-casino-900 hover:bg-casino-800 text-[9px] font-bold rounded-lg border border-white/10 text-amber-300 text-center"
                  >
                    Cha-Ching!
                  </button>
                  <button
                    onClick={() => soundManager.playVaultLock()}
                    className="px-2 py-1 bg-casino-900 hover:bg-casino-800 text-[9px] font-bold rounded-lg border border-white/10 text-cyan-300 text-center"
                  >
                    Vault Lock
                  </button>
                  <button
                    onClick={() => soundManager.playGoldBarClank()}
                    className="px-2 py-1 bg-casino-900 hover:bg-casino-800 text-[9px] font-bold rounded-lg border border-white/10 text-yellow-300 text-center"
                  >
                    Gold Bars
                  </button>
                  <button
                    onClick={() => soundManager.playCashCounter()}
                    className="px-2 py-1 bg-casino-900 hover:bg-casino-800 text-[9px] font-bold rounded-lg border border-white/10 text-emerald-300 text-center"
                  >
                    Cash Counter
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </header>
  );
};
