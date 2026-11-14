import React, { useState, useEffect } from 'react';
import {
  Crown,
  Trophy,
  Gift,
  Volume2,
  VolumeX,
  Music,
  HelpCircle,
  Terminal,
  Sliders,
  Play,
  Trees,
  Gamepad2,
  Users,
  Sparkles,
} from 'lucide-react';
import type { ProgressionState } from '../../engine/types';
import type { GameId } from '../../games/types';
import { soundManager } from '../../audio/soundManager';
import { SlotyLogo } from './SlotyLogo';
import { GameSelector } from './GameSelector';
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
  activeGameId: GameId;
  onSelectGame: (gameId: GameId) => void;
  isSpinning?: boolean;
  onToggleMute: () => void;
  onOpenPaytable: () => void;
  onOpenBonusWheel: () => void;
  onToggleDebug?: () => void;
  onOpenLeaderboard?: () => void;
  isFloorMode?: boolean;
  onToggleFloorMode?: () => void;
  showMobileCompanion?: boolean;
  onToggleMobileCompanion?: () => void;
}

export const HeaderBar: React.FC<HeaderBarProps> = ({
  balance,
  progression,
  isMuted,
  canClaimBonus,
  timeUntilBonus,
  currentSceneId,
  onSelectScene,
  activeGameId,
  onSelectGame,
  isSpinning = false,
  onToggleMute,
  onOpenPaytable,
  onOpenBonusWheel,
  onToggleDebug,
  onOpenLeaderboard,
  isFloorMode = false,
  onToggleFloorMode,
  showMobileCompanion = true,
  onToggleMobileCompanion,
}) => {
  const [isMusicOn, setIsMusicOn] = useState(() => soundManager.isMusicPlaying());
  const [showAudioPopover, setShowAudioPopover] = useState(false);
  const [showMobileToolsDrawer, setShowMobileToolsDrawer] = useState(false);
  const [sfxVol, setSfxVol] = useState(() => Math.round(soundManager.getSFXVolume() * 100));
  const [musicVol, setMusicVol] = useState(() => Math.round(soundManager.getMusicVolume() * 100));

  // Sync music state with engine
  useEffect(() => {
    const interval = setInterval(() => {
      setIsMusicOn(soundManager.isMusicPlaying());
    }, 350);
    return () => clearInterval(interval);
  }, []);

  const handleToggleMusic = () => {
    soundManager.unlockAudio();
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

  const handleTestAudio = () => {
    soundManager.testAudio();
  };

  const isTimber = activeGameId === 'timber-critters';
  const isPixel = activeGameId === 'pixel-arcade';
  const isPs2 = activeGameId === 'ps2-legends';

  return (
    <header className={`w-full px-1.5 sm:px-4 py-1 sm:py-1.5 sticky top-0 z-30 select-none shadow-[0_4px_25px_rgba(0,0,0,0.95)] transition-colors duration-300 flex-shrink-0 ${
      isPs2
        ? 'bg-gradient-to-r from-[#030612] via-[#081126] to-[#030612] border-b-2 sm:border-b-4 border-[#006FCD] shadow-[0_4px_25px_rgba(0,111,205,0.7)]'
        : isTimber
        ? 'bg-gradient-to-r from-[#3b1d0c] via-[#200e05] to-[#3b1d0c] border-b-2 sm:border-b-4 border-[#854d0e] shadow-[0_4px_25px_rgba(20,83,45,0.65)]'
        : isPixel
        ? 'bg-gradient-to-r from-[#220642] via-[#0b011c] to-[#220642] border-b-2 sm:border-b-4 border-pink-500 shadow-[0_4px_25px_rgba(236,72,153,0.7)]'
        : 'bg-gradient-to-r from-[#2a1b02] via-[#0f0a01] to-[#2a1b02] border-b-2 sm:border-b-4 border-yellow-400 shadow-[0_4px_25px_rgba(245,158,11,0.6)]'
    }`}>
      <div className="max-w-7xl mx-auto flex items-center justify-between gap-1 sm:gap-3 w-full h-10 sm:h-11 min-w-0">
        {/* Left: Brand Logo & Coin Balance */}
        <div className="flex items-center space-x-1 sm:space-x-2 flex-shrink-0">
          <SlotyLogo activeGameId={activeGameId} />

          {/* Digital Bank Vault / Forest Reserve / Arcade Credits Dispenser */}
          <div
            className={`flex items-center space-x-1 sm:space-x-1.5 px-1 sm:px-2.5 xl:px-3.5 py-0.5 sm:py-1 shadow-md border select-none ${
              isPs2
                ? 'bg-gradient-to-b from-black via-[#040c1e] to-black border-2 border-[#006FCD] shadow-[0_0_12px_rgba(0,111,205,0.6)]'
                : isTimber
                ? 'bg-gradient-to-b from-[#241208] via-[#122216] to-[#241208] border-emerald-500/90 shadow-[0_0_12px_rgba(16,185,129,0.5)]'
                : isPixel
                ? 'bg-gradient-to-b from-black via-[#1c0638] to-black border-2 border-cyan-400 shadow-[0_0_12px_rgba(6,182,212,0.6)]'
                : 'bg-gradient-to-b from-[#241703] via-[#0f0a01] to-[#241703] border-2 border-yellow-400 shadow-[0_0_12px_rgba(245,158,11,0.6)]'
            }`}
            style={{
              clipPath: isPixel
                ? 'polygon(0 4px, 4px 0, calc(100% - 4px) 0, 100% 4px, 100% calc(100% - 4px), calc(100% - 4px) 100%, 4px 100%, 0 calc(100% - 4px))'
                : isPs2
                ? 'polygon(0 3px, 3px 0, calc(100% - 3px) 0, 100% 3px, 100% calc(100% - 3px), calc(100% - 3px) 100%, 3px 100%, 0 calc(100% - 3px))'
                : isTimber
                ? 'polygon(0% 15%, 4% 0%, 96% 0%, 100% 15%, 96% 50%, 100% 85%, 96% 100%, 4% 100%, 0% 85%, 4% 50%)'
                : 'polygon(6px 0, calc(100% - 6px) 0, 100% 6px, 100% calc(100% - 6px), calc(100% - 6px) 100%, 6px 100%, 0 calc(100% - 6px), 0 6px)',
            }}
          >
            <div
              className={`w-4 h-4 sm:w-5 sm:h-5 flex items-center justify-center shadow-md flex-shrink-0 border ${
                isPs2
                  ? 'bg-gradient-to-tr from-[#006FCD] to-cyan-400 border-cyan-300 text-white shadow-[0_0_6px_#00F0FF]'
                  : isTimber
                  ? 'bg-gradient-to-tr from-emerald-600 to-teal-400 border-emerald-200 text-white'
                  : isPixel
                  ? 'bg-gradient-to-tr from-pink-500 to-cyan-400 border-cyan-200 text-white shadow-[0_0_6px_#06B6D4]'
                  : 'bg-gradient-to-tr from-amber-500 to-yellow-300 border-yellow-200 text-casino-950 shadow-[0_0_6px_#F59E0B]'
              }`}
              style={{
                clipPath: isPixel
                  ? 'polygon(0 2px, 2px 0, calc(100% - 2px) 0, 100% 2px, 100% calc(100% - 2px), calc(100% - 2px) 100%, 2px 100%, 0 calc(100% - 2px))'
                  : undefined,
              }}
            >
              {isPs2 ? (
                <span className="text-[10px]">💾</span>
              ) : isTimber ? (
                <span className="text-[10px]">🌰</span>
              ) : isPixel ? (
                <span className="text-[10px]">🪙</span>
              ) : (
                <Crown className="w-3 h-3 fill-amber-950 text-amber-950" />
              )}
            </div>
            <div className="flex flex-col">
              <span className={`text-[6px] sm:text-[7.5px] uppercase font-black tracking-wider leading-none ${
                isPs2 ? 'text-cyan-300 font-mono' : isTimber ? 'text-emerald-400 font-serif' : isPixel ? 'text-cyan-300 font-mono' : 'text-yellow-400 font-mono'
              }`}>
                {isPs2 ? 'SLOT 1 MEMORY' : isTimber ? 'FORAGE CACHE' : isPixel ? 'CREDITS (04)' : 'FORT KNOX VAULT'}
              </span>
              <span className={`text-[11px] sm:text-sm font-black leading-tight font-mono ${
                isPs2
                  ? 'text-cyan-200 drop-shadow-[0_0_8px_#00F0FF]'
                  : isTimber
                  ? 'text-emerald-200 drop-shadow-[0_0_8px_rgba(52,211,153,0.9)]'
                  : isPixel
                  ? 'text-cyan-200 drop-shadow-[0_0_8px_#06B6D4]'
                  : 'text-yellow-300 drop-shadow-[0_0_8px_rgba(253,224,71,0.9)]'
              }`}>
                ${balance.toLocaleString()}
              </span>
            </div>
          </div>

          {/* Level / Stage Indicator */}
          <div
            className={`hidden xl:flex items-center space-x-1.5 px-2 py-0.5 shadow-md border ${
              isPs2
                ? 'bg-gradient-to-b from-[#02050f] to-black border-[#006FCD]/80 text-cyan-300 font-mono'
                : isTimber
                ? 'bg-gradient-to-b from-[#241308] to-[#122216] border-emerald-500/70 text-emerald-300'
                : isPixel
                ? 'bg-gradient-to-b from-[#260845] to-black border-pink-500/70 text-pink-300 font-mono'
                : 'bg-gradient-to-b from-slate-900 to-black border-yellow-400/70 text-yellow-300 font-mono'
            }`}
            style={{
              clipPath: isPixel
                ? 'polygon(0 3px, 3px 0, calc(100% - 3px) 0, 100% 3px, 100% calc(100% - 3px), calc(100% - 3px) 100%, 3px 100%, 0 calc(100% - 3px))'
                : isPs2
                ? 'polygon(0 2px, 2px 0, calc(100% - 2px) 0, 100% 2px, 100% calc(100% - 2px), calc(100% - 2px) 100%, 2px 100%, 0 calc(100% - 2px))'
                : isTimber
                ? 'polygon(0% 15%, 4% 0%, 96% 0%, 100% 15%, 96% 50%, 100% 85%, 96% 100%, 4% 100%, 0% 85%, 4% 50%)'
                : 'polygon(5px 0, calc(100% - 5px) 0, 100% 5px, 100% calc(100% - 5px), calc(100% - 5px) 100%, 5px 100%, 0 calc(100% - 5px), 0 5px)',
            }}
          >
            {isPs2 ? <Gamepad2 className="w-3 h-3 text-cyan-400" /> : isTimber ? <Trees className="w-3 h-3 text-emerald-400" /> : isPixel ? <Gamepad2 className="w-3 h-3 text-cyan-300" /> : <Trophy className="w-3 h-3 text-yellow-300" />}
            <span className="text-[8px] font-black uppercase">
              {isPs2 ? `VPU LV.${progression.level}` : isTimber ? `RANGER LV.${progression.level}` : isPixel ? `STAGE ${progression.level}` : `VIP LV.${progression.level}`}
            </span>
          </div>
        </div>

        {/* Center: Multi-Game Machine Switcher (24K Gold Vault vs Timberland Critters) */}
        <div className="flex items-center flex-shrink-0">
          <GameSelector
            activeGameId={activeGameId}
            onSelectGame={onSelectGame}
            disabled={isSpinning}
          />
        </div>

        {/* Right: Actions & Tools */}
        <div className="flex items-center space-x-1 sm:space-x-1.5 flex-shrink-0 relative">
          {/* Daily Bonus Wheel Button */}
          <button
            onClick={() => {
              soundManager.playButtonClick();
              onOpenBonusWheel();
            }}
            className={`w-7 h-7 sm:w-auto flex items-center justify-center space-x-1 p-1 sm:px-2 xl:px-2.5 py-1 border text-[9px] sm:text-xs font-bold transition-all flex-shrink-0 ${
              canClaimBonus
                ? 'bg-gradient-to-r from-pink-600 via-purple-600 to-amber-500 border-yellow-300 text-white shadow-[0_0_15px_rgba(236,72,153,0.8)] animate-pulse'
                : 'vlt-btn-stepper text-amber-300 hover:text-white'
            }`}
            style={{
              clipPath: isPixel
                ? 'polygon(0 3px, 3px 0, calc(100% - 3px) 0, 100% 3px, 100% calc(100% - 3px), calc(100% - 3px) 100%, 3px 100%, 0 calc(100% - 3px))'
                : isTimber
                ? 'polygon(0% 15%, 4% 0%, 96% 0%, 100% 15%, 96% 50%, 100% 85%, 96% 100%, 4% 100%, 0% 85%, 4% 50%)'
                : 'polygon(5px 0, calc(100% - 5px) 0, 100% 5px, 100% calc(100% - 5px), calc(100% - 5px) 100%, 5px 100%, 0 calc(100% - 5px), 0 5px)',
            }}
            title="Claim Daily Bonus Wheel"
          >
            <Gift className={`w-3.5 h-3.5 ${canClaimBonus ? 'animate-bounce text-yellow-300' : 'text-amber-400'}`} />
            <span className="hidden xl:inline font-mono font-black">
              {canClaimBonus ? 'FREE BONUS' : timeUntilBonus}
            </span>
          </button>

          {/* Background Lounge Music Toggle (desktop; on mobile it's in the Settings Drawer) */}
          <button
            onClick={handleToggleMusic}
            title={isMusicOn ? 'Mute Music' : 'Start Music'}
            className={`hidden sm:flex w-7 h-7 sm:w-auto p-1 sm:px-2 sm:py-1 border transition-all items-center justify-center flex-shrink-0 ${
              isMusicOn
                ? 'bg-emerald-950/80 border-emerald-400 text-emerald-300 shadow-[0_0_10px_rgba(16,185,129,0.5)]'
                : 'vlt-btn-stepper text-slate-400 hover:text-white border-white/20'
            }`}
            style={{
              clipPath: isPixel
                ? 'polygon(0 3px, 3px 0, calc(100% - 3px) 0, 100% 3px, 100% calc(100% - 3px), calc(100% - 3px) 100%, 3px 100%, 0 calc(100% - 3px))'
                : isTimber
                ? 'polygon(0% 15%, 4% 0%, 96% 0%, 100% 15%, 96% 50%, 100% 85%, 96% 100%, 4% 100%, 0% 85%, 4% 50%)'
                : 'polygon(5px 0, calc(100% - 5px) 0, 100% 5px, 100% calc(100% - 5px), calc(100% - 5px) 100%, 5px 100%, 0 calc(100% - 5px), 0 5px)',
            }}
          >
            <Music className={`w-3.5 h-3.5 ${isMusicOn ? 'text-emerald-300' : 'text-slate-400'}`} />
          </button>

          {/* Tools & Audio Settings Drawer Launcher (< 1280px) */}
          <button
            onClick={() => {
              soundManager.playButtonClick();
              setShowMobileToolsDrawer(true);
            }}
            className="xl:hidden w-7 h-7 sm:w-auto p-1 sm:p-1.5 flex items-center justify-center vlt-btn-stepper text-slate-300 hover:text-white border border-white/20"
            style={{
              clipPath: isPixel
                ? 'polygon(0 3px, 3px 0, calc(100% - 3px) 0, 100% 3px, 100% calc(100% - 3px), calc(100% - 3px) 100%, 3px 100%, 0 calc(100% - 3px))'
                : undefined,
            }}
            title="Open Tools & Settings"
          >
            <Sliders className="w-3.5 h-3.5 text-yellow-300" />
          </button>

          {/* Desktop-only individual utility buttons (>= 1280px) */}
          <div className="hidden xl:flex items-center space-x-1.5">
            <button
              onClick={() => {
                soundManager.playButtonClick();
                onToggleMute();
              }}
              title={isMuted ? 'Unmute' : 'Mute'}
              className={`p-1.5 border transition-all flex-shrink-0 ${
                isMuted
                  ? 'bg-rose-950/60 border-rose-500/80 text-rose-400 shadow-[0_0_10px_rgba(244,63,94,0.4)]'
                  : 'vlt-btn-stepper text-slate-300 hover:text-white border-white/20'
              }`}
              style={{
                clipPath: isPixel
                  ? 'polygon(0 2px, 2px 0, calc(100% - 2px) 0, 100% 2px, 100% calc(100% - 2px), calc(100% - 2px) 100%, 2px 100%, 0 calc(100% - 2px))'
                  : undefined,
              }}
            >
              {isMuted ? <VolumeX className="w-3.5 h-3.5 text-rose-400" /> : <Volume2 className="w-3.5 h-3.5 text-emerald-400" />}
            </button>

            <button
              onClick={() => {
                soundManager.playButtonClick();
                setShowAudioPopover(!showAudioPopover);
              }}
              title="Audio Mixer"
              className="p-1.5 vlt-btn-stepper text-slate-400 hover:text-white transition-colors border-white/20"
              style={{
                clipPath: isPixel
                  ? 'polygon(0 2px, 2px 0, calc(100% - 2px) 0, 100% 2px, 100% calc(100% - 2px), calc(100% - 2px) 100%, 2px 100%, 0 calc(100% - 2px))'
                  : undefined,
              }}
            >
              <Sliders className="w-3.5 h-3.5 text-yellow-300" />
            </button>

            <button
              onClick={() => {
                soundManager.playButtonClick();
                onOpenPaytable();
              }}
              title="Paytable & Rules"
              className="p-1.5 vlt-btn-stepper text-slate-400 hover:text-white transition-colors border-white/20"
              style={{
                clipPath: isPixel
                  ? 'polygon(0 2px, 2px 0, calc(100% - 2px) 0, 100% 2px, 100% calc(100% - 2px), calc(100% - 2px) 100%, 2px 100%, 0 calc(100% - 2px))'
                  : undefined,
              }}
            >
              <HelpCircle className="w-3.5 h-3.5 text-cyan-300" />
            </button>

            {onToggleDebug && (
            <button
              onClick={() => {
                soundManager.playButtonClick();
                onToggleDebug();
              }}
              title="Developer Rig Suite"
              className="p-1.5 vlt-btn-stepper text-slate-400 hover:text-amber-400 transition-colors border-white/20"
              style={{
                clipPath: isPixel
                  ? 'polygon(0 2px, 2px 0, calc(100% - 2px) 0, 100% 2px, 100% calc(100% - 2px), calc(100% - 2px) 100%, 2px 100%, 0 calc(100% - 2px))'
                  : undefined,
              }}
            >
              <Terminal className="w-3.5 h-3.5 text-slate-400 hover:text-amber-300" />
            </button>
            )}
          </div>

          {/* Desktop Audio Mixer Popover Drawer */}
          {showAudioPopover && (
            <div className="absolute right-0 top-full mt-2 w-72 bg-gradient-to-b from-slate-900 to-black border-2 border-yellow-400 rounded-2xl p-4 shadow-[0_10px_35px_rgba(0,0,0,0.95)] z-50 animate-fadeIn text-slate-200">
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

              {/* Instant Full Sound Test Button */}
              <button
                onClick={handleTestAudio}
                className="w-full mb-3 py-1.5 bg-gradient-to-r from-amber-500 to-yellow-400 hover:from-amber-400 hover:to-yellow-300 text-amber-950 font-black text-xs uppercase tracking-wider rounded-xl shadow-md flex items-center justify-center space-x-1.5 transition-all"
              >
                <Play className="w-3.5 h-3.5 fill-amber-950" />
                <span>Test Audio (Cha-Ching)</span>
              </button>

              {/* Background Music Volume Slider */}
              <div className="mb-3">
                <div className="flex items-center justify-between text-[10px] font-bold text-slate-300 mb-1">
                  <span className="flex items-center space-x-1">
                    <Music className="w-3 h-3 text-emerald-400" />
                    <span>VIP Lounge Music</span>
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

              {/* Individual Sound FX */}
              {/* Scene / Backdrop Switcher */}
              <div className="pt-2 border-t border-white/10 mb-3">
                <div className="text-[9px] font-bold uppercase text-slate-400 mb-1.5">
                  Casino Floor Backdrop:
                </div>
                <SceneSelector
                  currentSceneId={currentSceneId}
                  onSelectScene={onSelectScene}
                />
              </div>

              <div className="pt-2 border-t border-white/10">
                <div className="text-[9px] font-bold uppercase text-slate-400 mb-1.5">
                  Individual Sound FX:
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

      {/* Mobile Tools & Settings Drawer Modal */}
      {showMobileToolsDrawer && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-sm select-none animate-fadeIn">
          <div className="relative w-full max-w-sm max-h-[92vh] overflow-y-auto bg-gradient-to-b from-slate-900 via-casino-950 to-black border-2 border-amber-400 rounded-3xl p-5 shadow-2xl flex flex-col space-y-4">
            <div className="flex items-center justify-between pb-2 border-b border-white/10">
              <span className="text-sm font-black uppercase text-amber-300 tracking-wider">
                Game Settings &amp; Tools
              </span>
              <button
                onClick={() => setShowMobileToolsDrawer(false)}
                className="w-7 h-7 rounded-full bg-white/10 flex items-center justify-center text-slate-300 hover:text-white font-bold"
              >
                ✕
              </button>
            </div>

            {/* Quick Action Buttons */}
            <div className="grid grid-cols-2 gap-2">
              <button
                onClick={() => {
                  soundManager.playButtonClick();
                  onToggleMute();
                }}
                className={`py-2 px-3 rounded-xl border font-bold text-xs flex items-center justify-center space-x-1.5 ${
                  isMuted ? 'bg-rose-950 border-rose-500 text-rose-300' : 'bg-casino-900 border-white/20 text-white'
                }`}
              >
                {isMuted ? <VolumeX className="w-4 h-4 text-rose-400" /> : <Volume2 className="w-4 h-4 text-emerald-400" />}
                <span>{isMuted ? 'Unmute Audio' : 'Mute Audio'}</span>
              </button>

              <button
                onClick={() => {
                  soundManager.playButtonClick();
                  setShowMobileToolsDrawer(false);
                  onOpenPaytable();
                }}
                className="py-2 px-3 rounded-xl bg-casino-900 border border-cyan-400/50 text-cyan-200 font-bold text-xs flex items-center justify-center space-x-1.5"
              >
                <HelpCircle className="w-4 h-4 text-cyan-300" />
                <span>Paytable &amp; Rules</span>
              </button>

              {onOpenLeaderboard && (
                <button
                  onClick={() => {
                    soundManager.playButtonClick();
                    setShowMobileToolsDrawer(false);
                    onOpenLeaderboard();
                  }}
                  className="py-2 px-3 rounded-xl bg-casino-900 border border-amber-400/50 text-amber-200 font-bold text-xs flex items-center justify-center space-x-1.5"
                >
                  <Trophy className="w-4 h-4 text-amber-300" />
                  <span>Leaderboard</span>
                </button>
              )}

              {onToggleFloorMode && (
                <button
                  onClick={() => {
                    soundManager.playButtonClick();
                    onToggleFloorMode();
                  }}
                  className={`py-2 px-3 rounded-xl border font-bold text-xs flex items-center justify-center space-x-1.5 ${
                    isFloorMode
                      ? 'bg-emerald-950 border-emerald-400 text-emerald-200'
                      : 'bg-casino-900 border-white/20 text-slate-200'
                  }`}
                >
                  <Users className="w-4 h-4 text-emerald-300" />
                  <span>{isFloorMode ? 'Floor Bank: ON' : 'Floor Bank: OFF'}</span>
                </button>
              )}

              {onToggleMobileCompanion && (
                <button
                  onClick={() => {
                    soundManager.playButtonClick();
                    onToggleMobileCompanion();
                  }}
                  className={`col-span-2 py-2 px-3 rounded-xl border font-bold text-xs flex items-center justify-center space-x-1.5 ${
                    showMobileCompanion
                      ? 'bg-purple-950/70 border-purple-400/60 text-purple-200'
                      : 'bg-casino-900 border-white/20 text-slate-300'
                  }`}
                >
                  <Sparkles className="w-4 h-4 text-purple-300" />
                  <span>{showMobileCompanion ? 'Host & Mascot Strip: Visible' : 'Host & Mascot Strip: Hidden'}</span>
                </button>
              )}
            </div>

            {/* Scene / Backdrop Switcher */}
            <div className="bg-black/50 p-3 rounded-2xl border border-white/10">
              <div className="text-[10px] font-bold uppercase tracking-wider text-slate-400 mb-2">
                Casino Floor Backdrop
              </div>
              <SceneSelector
                currentSceneId={currentSceneId}
                onSelectScene={onSelectScene}
              />
            </div>

            {/* Volume Sliders */}
            <div className="flex flex-col space-y-3 bg-black/50 p-3 rounded-2xl border border-white/10">
              <div>
                <div className="flex justify-between text-[11px] font-bold text-slate-300 mb-1">
                  <span>VIP Lounge Music</span>
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

              <div>
                <div className="flex justify-between text-[11px] font-bold text-slate-300 mb-1">
                  <span>Sound Effects</span>
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
            </div>

            {/* Developer Drawer Launcher */}
            {onToggleDebug && (
            <button
              onClick={() => {
                soundManager.playButtonClick();
                setShowMobileToolsDrawer(false);
                onToggleDebug();
              }}
              className="w-full py-2 bg-slate-900 hover:bg-slate-800 border border-white/15 rounded-xl font-bold text-xs text-slate-300 flex items-center justify-center space-x-1.5"
            >
              <Terminal className="w-4 h-4 text-amber-300" />
              <span>Open Developer Rig</span>
            </button>
            )}
          </div>
        </div>
      )}
    </header>
  );
};
