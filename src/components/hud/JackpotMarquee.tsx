import React, { useState, useEffect } from 'react';
import { Crown, Gem, Coins, Sparkles, Trees, Users, Trophy, Flame, ShieldAlert, Zap } from 'lucide-react';
import { storage } from '../../utils/storage';
import { soundManager } from '../../audio/soundManager';
import type { GameId } from '../../games/types';
import { getGame } from '../../games/gameRegistry';
import { RetroCasinoAdBanner } from './RetroCasinoAdBanner';

interface JackpotMarqueeProps {
  totalBet: number;
  activeGameId?: GameId;
  freeSpinsRemaining?: number;
  feverCharge?: number;
  feverSpinsLeft?: number;
  isFloorMode?: boolean;
  onToggleFloorMode?: () => void;
  onOpenLeaderboard?: () => void;
}

export const JackpotMarquee: React.FC<JackpotMarqueeProps> = ({
  totalBet,
  activeGameId = 'vault-24k',
  freeSpinsRemaining: _freeSpinsRemaining = 0,
  feverCharge = 35,
  feverSpinsLeft = 0,
  isFloorMode = false,
  onToggleFloorMode,
  onOpenLeaderboard,
}) => {
  const isTimber = activeGameId === 'timber-critters';
  const isPixel = activeGameId === 'pixel-arcade';
  const gameDef = getGame(activeGameId);
  const isFeverActive = feverSpinsLeft > 0;

  // Live ticking progressive pots
  const [grand, setGrand] = useState<number>(() =>
    storage.getNumber('sloty_jackpot_grand', 78709.8)
  );
  const [major, setMajor] = useState<number>(() =>
    storage.getNumber('sloty_jackpot_major', 14395.31)
  );
  const [minor, setMinor] = useState<number>(() =>
    storage.getNumber('sloty_jackpot_minor', 1924.71)
  );
  const [mini, setMini] = useState<number>(() =>
    storage.getNumber('sloty_jackpot_mini', 368.64)
  );

  // Tick progressives in real-time
  useEffect(() => {
    const interval = setInterval(() => {
      setGrand((prev) => {
        const next = prev + 0.14 + Math.random() * 0.08;
        storage.setItem('sloty_jackpot_grand', next.toFixed(2));
        return next;
      });
      setMajor((prev) => {
        const next = prev + 0.07 + Math.random() * 0.04;
        storage.setItem('sloty_jackpot_major', next.toFixed(2));
        return next;
      });
      setMinor((prev) => {
        const next = prev + 0.03 + Math.random() * 0.02;
        storage.setItem('sloty_jackpot_minor', next.toFixed(2));
        return next;
      });
      setMini((prev) => {
        const next = prev + 0.01 + Math.random() * 0.01;
        storage.setItem('sloty_jackpot_mini', next.toFixed(2));
        return next;
      });
    }, 1100);

    return () => clearInterval(interval);
  }, []);

  // Feed wagers into progressives
  useEffect(() => {
    if (totalBet > 0) {
      setGrand((g) => g + totalBet * 0.005);
      setMajor((m) => m + totalBet * 0.003);
      setMinor((mi) => mi + totalBet * 0.002);
      setMini((mn) => mn + totalBet * 0.001);
    }
  }, [totalBet]);

  const handleJackpotClick = () => {
    soundManager.unlockAudio();
    if (isTimber) {
      soundManager.playGrizzlyRoar();
    } else if (isPixel) {
      soundManager.playPuppetBoing();
    } else {
      soundManager.playGoldBarClank();
    }
  };

  // =========================================================================
  // --- VERSION A: TIMBERLAND CRITTERS (HANDCRAFTED CEDAR CABIN GABLE) ---
  // =========================================================================
  if (isTimber) {
    return (
      <div className="w-full max-w-5xl xl:max-w-6xl 2xl:max-w-7xl mx-auto px-1 sm:px-2 mb-0.5 sm:mb-1 select-none flex-shrink-0 z-20">
        {/* Mobile Compact Top Box (< 640px) */}
        <div className="sm:hidden w-full px-0.5 py-0.5">
          <div
            onClick={handleJackpotClick}
            className="w-full h-11 px-2.5 rounded-xl bg-gradient-to-r from-[#241308] via-[#120703] to-[#241308] border-2 border-[#a16207] shadow-md flex items-center justify-between cursor-pointer"
          >
            {/* Left: Mascot Icon + Label */}
            <div className="flex items-center space-x-1 flex-shrink-0">
              <span className="text-base">🐻</span>
              <span className="text-[8.5px] font-black uppercase text-amber-300 tracking-wider">
                GRAND
              </span>
            </div>

            {/* Center: Live Grand Jackpot */}
            <div className="flex items-baseline font-mono px-1">
              <span className="text-xs font-black text-amber-400 mr-0.5">$</span>
              <span className="text-base font-black tracking-tight leading-none text-emerald-200 drop-shadow-[0_0_8px_rgba(52,211,153,0.9)]">
                {Math.floor(grand).toLocaleString()}
              </span>
              <span className="text-[9px] font-bold text-emerald-400">
                .{(grand % 1).toFixed(2).slice(2)}
              </span>
            </div>

            {/* Right: Sub-jackpot summary & Sap meter */}
            <div className="flex items-center space-x-1.5 flex-shrink-0">
              <span className="text-[8px] font-mono font-bold text-teal-300">
                🐺${Math.round(major / 1000)}k
              </span>
              <div className="px-1.5 py-0.5 rounded-full bg-emerald-950/90 border border-emerald-500/50 text-[7.5px] font-mono font-bold text-emerald-300 flex items-center space-x-0.5">
                <span>SAP</span>
                <span className="text-white font-black">{feverCharge}%</span>
              </div>
            </div>
          </div>
        </div>

        {/* Desktop / Tablet Mountain Cabin A-Frame Shingle Roof Pediment (>= 640px) */}
        <div className="hidden sm:block relative pt-0.5 sm:pt-1">
          {/* Ambient Warm Hearth Glow */}
          <div className="absolute -top-1 left-1/2 -translate-x-1/2 w-3/4 h-10 rounded-full bg-gradient-to-t from-amber-600/30 via-emerald-600/15 to-transparent filter blur-md pointer-events-none" />

          {/* Roof Shingles & Log Trusses Container */}
          <div className="relative bg-gradient-to-b from-[#3b1d0c] via-[#241207] to-[#120703] border-2 border-[#78350f] rounded-t-xl sm:rounded-t-2xl rounded-b-lg shadow-[0_6px_20px_rgba(0,0,0,0.9),0_0_15px_rgba(16,185,129,0.25)] p-1 sm:p-1.5 transition-transform duration-200">
            {/* Top Roof Peak: Nature's Fury Sap Branch & Trail Controls */}
            <div className="flex items-center justify-between px-1.5 mb-0.5 z-30 relative">
              {/* Left Trail Sign: Floor Bank Toggle */}
              {onToggleFloorMode && (
                <button
                  onClick={onToggleFloorMode}
                  className={`flex items-center space-x-1 px-2 py-0.5 rounded-full border text-[8px] sm:text-[9px] font-black uppercase shadow transition-all ${
                    isFloorMode
                      ? 'bg-gradient-to-r from-emerald-600 to-teal-500 text-white border-emerald-200 shadow-[0_0_8px_rgba(52,211,153,0.7)]'
                      : 'bg-[#261207] text-amber-200 border-[#a16207] hover:border-amber-400'
                  }`}
                  title="Toggle Camp Bank view"
                >
                  <Users className="w-2.5 h-2.5 text-amber-300" />
                  <span>{isFloorMode ? 'CAMP BANK ON' : 'CAMP BANK'}</span>
                </button>
              )}

              {/* Center: Nature's Fury Birch Sap Meter */}
              <div className="flex-1 max-w-xs sm:max-w-sm mx-1.5 px-2 py-0.5 rounded-full bg-[#1c0c04] border border-[#a16207] shadow-inner flex items-center space-x-1.5">
                <div className="flex items-center space-x-1 text-[8px] font-black text-emerald-300 uppercase whitespace-nowrap">
                  <Trees className="w-2.5 h-2.5 text-emerald-400 animate-pulse" />
                  <span className="hidden xs:inline">SAP:</span>
                  <span className="text-amber-300 font-mono">{feverCharge}%</span>
                </div>
                <div className="flex-1 bg-black/80 h-1 rounded-full overflow-hidden p-0.5 border border-emerald-600/40">
                  <div
                    className="h-full rounded-full bg-gradient-to-r from-emerald-500 via-teal-400 to-amber-300 shadow-[0_0_6px_#34D399] transition-all duration-300"
                    style={{ width: `${feverCharge}%` }}
                  />
                </div>
                {isFeverActive && (
                  <span className="text-[8px] font-black text-amber-300 animate-bounce">2X!</span>
                )}
              </div>

              {/* Right Trail Sign: Leaderboard */}
              {onOpenLeaderboard && (
                <button
                  onClick={onOpenLeaderboard}
                  className="flex items-center space-x-1 px-2 py-0.5 rounded-full bg-[#261207] hover:bg-[#3b1d0c] text-amber-200 border border-[#a16207] hover:border-amber-400 text-[8px] sm:text-[9px] font-black uppercase shadow transition-all"
                  title="View Forest Hall of Fame"
                >
                  <Trophy className="w-2.5 h-2.5 text-yellow-400 fill-yellow-400" />
                  <span>HALL OF FAME</span>
                </button>
              )}
            </div>

            {/* HANGING CEDAR PLAQUES & HONEY POT ARCHITECTURE */}
            <div className="flex items-stretch gap-1 w-full">
              {/* Left Hanging Sign: Wolf Pack Major Cache */}
              <div
                onClick={handleJackpotClick}
                className="w-1/4 cursor-pointer group relative p-1 rounded-lg bg-gradient-to-b from-[#2e180e] via-[#1a0c05] to-black border border-[#b45309] shadow flex flex-col justify-center items-center hover:scale-[1.02] transition-transform"
              >
                <div className="flex items-center space-x-1">
                  <span className="text-xs">🐺</span>
                  <span className="text-[7.5px] sm:text-[8px] font-black uppercase text-teal-300 tracking-wider">
                    {gameDef.theme.majorTitle}
                  </span>
                </div>
                <div className="flex items-baseline font-mono text-xs sm:text-sm font-black text-teal-200 drop-shadow-[0_0_6px_#2DD4BF] mt-0.5">
                  <span>${Math.floor(major).toLocaleString()}</span>
                  <span className="text-[8.5px] text-teal-400/80">.{(major % 1).toFixed(2).slice(2)}</span>
                </div>
              </div>

              {/* Center Carved Honey Log: Grand Jackpot Hero */}
              <div
                onClick={handleJackpotClick}
                className="flex-1 relative rounded-lg bg-gradient-to-r from-[#170a04] via-[#0b1f13] to-[#170a04] border-2 border-[#a16207] shadow-inner p-1 flex items-center justify-between cursor-pointer group overflow-hidden"
              >
                <div className="w-6 h-6 sm:w-7 sm:h-7 rounded-full bg-[#2e180e] border border-amber-400/80 shadow-[0_0_6px_rgba(245,158,11,0.7)] flex items-center justify-center text-xs sm:text-sm animate-bounce flex-shrink-0">
                  🐻
                </div>

                <div className="flex flex-col items-center z-10 mx-auto px-1 text-center">
                  <div className="flex items-center justify-center space-x-1 text-amber-300 text-[7.5px] sm:text-[8.5px] font-black uppercase tracking-widest">
                    <Trees className="w-2.5 h-2.5 text-emerald-400 fill-emerald-500/30 animate-pulse flex-shrink-0" />
                    <span>{gameDef.theme.grandTitle}</span>
                    <Trees className="w-2.5 h-2.5 text-emerald-400 fill-emerald-500/30 animate-pulse flex-shrink-0" />
                  </div>
                  <div className="flex items-baseline font-mono">
                    <span className="text-xs sm:text-sm font-black text-amber-400 mr-0.5">$</span>
                    <span className="text-lg sm:text-2xl md:text-3xl font-black tracking-tight leading-none text-emerald-200 drop-shadow-[0_0_12px_rgba(52,211,153,1)]">
                      {Math.floor(grand).toLocaleString()}
                    </span>
                    <span className="text-[9px] sm:text-[10px] font-bold text-emerald-400/90 ml-0.5">
                      .{(grand % 1).toFixed(2).slice(2)}
                    </span>
                  </div>
                </div>

                <div className="w-6 h-6 sm:w-7 sm:h-7 rounded-full bg-[#182a1d] border border-emerald-400/80 shadow-[0_0_6px_rgba(52,211,153,0.7)] flex items-center justify-center text-xs sm:text-sm animate-pulse flex-shrink-0">
                  🦉
                </div>
              </div>

              {/* Right Stacked Wood Slices: Minor & Mini */}
              <div className="w-1/4 grid grid-cols-2 gap-1">
                <div
                  onClick={handleJackpotClick}
                  className="cursor-pointer group relative p-0.5 sm:p-1 rounded-lg bg-gradient-to-b from-[#2e180e] via-[#1a0c05] to-black border border-[#b45309] shadow flex flex-col justify-center items-center hover:scale-[1.02] transition-transform"
                >
                  <div className="flex items-center space-x-0.5">
                    <span className="text-[9px]">🦊</span>
                    <span className="text-[6.5px] sm:text-[7.5px] font-black uppercase text-amber-300 tracking-wider">
                      {gameDef.theme.minorTitle}
                    </span>
                  </div>
                  <div className="flex items-baseline font-mono text-[9px] sm:text-xs font-black text-amber-200 drop-shadow-[0_0_4px_#FBBF24]">
                    <span>${Math.floor(minor).toLocaleString()}</span>
                  </div>
                </div>

                <div
                  onClick={handleJackpotClick}
                  className="cursor-pointer group relative p-0.5 sm:p-1 rounded-lg bg-gradient-to-b from-[#2e180e] via-[#1a0c05] to-black border border-[#b45309] shadow flex flex-col justify-center items-center hover:scale-[1.02] transition-transform"
                >
                  <div className="flex items-center space-x-0.5">
                    <span className="text-[9px]">🐿️</span>
                    <span className="text-[6.5px] sm:text-[7.5px] font-black uppercase text-emerald-300 tracking-wider">
                      {gameDef.theme.miniTitle}
                    </span>
                  </div>
                  <div className="flex items-baseline font-mono text-[9px] sm:text-xs font-black text-emerald-200 drop-shadow-[0_0_4px_#34D399]">
                    <span>${Math.floor(mini).toLocaleString()}</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Hand-carved Trail Announcement Sign */}
            <div className="mt-0.5 hidden xl:block">
              <RetroCasinoAdBanner activeGameId={activeGameId} />
            </div>
          </div>
        </div>
      </div>
    );
  }

  // =========================================================================
  // --- VERSION B: PIXEL ARCADE (1980s COIN-OP CRT SCOREBOARD & BOSS HUD) ---
  // =========================================================================
  if (isPixel) {
    const bossHpPercent = Math.max(12, 100 - feverCharge);
    const bossSegments = Math.round((bossHpPercent / 100) * 12);

    return (
      <div className="w-full max-w-5xl xl:max-w-6xl 2xl:max-w-7xl mx-auto px-1 sm:px-2 mb-0.5 sm:mb-1 select-none flex-shrink-0 z-20 font-mono">
        {/* Mobile Compact CRT Scoreboard (< 640px) */}
        <div className="sm:hidden w-full px-0.5 py-0.5">
          <div
            onClick={handleJackpotClick}
            className="w-full h-11 px-2.5 rounded-xl bg-gradient-to-r from-[#18052e] via-[#090117] to-[#18052e] border-2 border-pink-500/80 shadow-[0_0_15px_rgba(236,72,153,0.5)] flex items-center justify-between cursor-pointer"
          >
            {/* Left: 1UP */}
            <div className="flex items-center space-x-1 flex-shrink-0">
              <span className="text-[9px] font-black text-rose-400 animate-pulse">1UP:</span>
              <span className="text-[10px] font-black text-cyan-300 font-mono">
                {Math.floor(grand * 0.35).toLocaleString()}
              </span>
            </div>

            {/* Center: HIGH SCORE */}
            <div className="flex flex-col items-center px-1">
              <span className="text-[7.5px] font-black text-amber-300 tracking-wider uppercase">HIGH SCORE</span>
              <div className="flex items-baseline font-mono">
                <span className="text-xs font-black text-amber-400 mr-0.5">$</span>
                <span className="text-sm font-black text-yellow-300 drop-shadow-[0_0_10px_#F59E0B]">
                  {Math.floor(grand).toLocaleString()}
                </span>
              </div>
            </div>

            {/* Right: Mecha Dragon HP */}
            <div className="flex items-center space-x-1 flex-shrink-0">
              <span className="text-xs">🐉</span>
              <div className="px-1.5 py-0.5 rounded bg-purple-950 border border-pink-500/60 text-[7.5px] font-bold text-pink-200">
                HP {bossHpPercent}%
              </div>
            </div>
          </div>
        </div>

        {/* Desktop / Tablet Retro Arcade Coin-Op Hood (>= 640px) */}
        <div className="hidden sm:block relative pt-0.5 sm:pt-1">
          {/* Neon Purple / Cyan Edge Glow */}
          <div className="absolute -top-1 left-1/2 -translate-x-1/2 w-3/4 h-10 rounded-full bg-gradient-to-t from-pink-600/30 via-cyan-500/20 to-transparent filter blur-md pointer-events-none" />

          {/* Molded Cyber Marquee Frame with Neon Double Stroke */}
          <div className="relative bg-gradient-to-b from-[#2a0845] via-[#100326] to-[#05010e] border-2 border-pink-500 rounded-t-xl sm:rounded-t-2xl rounded-b-lg shadow-[0_6px_20px_rgba(0,0,0,0.95),0_0_15px_rgba(236,72,153,0.5)] p-1 sm:p-1.5">
            {/* TIER 1: AUTHENTIC 1980s SCOREBOARD STRIP */}
            <div className="flex items-center justify-between px-2 py-0.5 bg-black/90 rounded border border-pink-500/40 mb-1 shadow-inner text-[10px] sm:text-xs">
              {/* 1UP Player Score */}
              <div className="flex items-center space-x-1.5">
                <span className="text-[10px] sm:text-xs font-black text-rose-500 animate-pulse tracking-widest">1UP</span>
                <span className="text-[11px] sm:text-xs md:text-sm font-black text-cyan-300 tracking-wider">
                  {Math.floor(grand * 0.35).toLocaleString().padStart(8, '0')}
                </span>
              </div>

              {/* HIGH SCORE: Center Trophy Display */}
              <div
                onClick={handleJackpotClick}
                className="flex items-center space-x-1.5 cursor-pointer group"
                title="Grand Arcade Jackpot"
              >
                <Trophy className="w-3.5 h-3.5 text-yellow-400 fill-yellow-400 animate-bounce" />
                <span className="text-[10px] sm:text-xs font-black text-amber-400 tracking-widest">HIGH SCORE:</span>
                <span className="text-xs sm:text-sm md:text-base font-black text-yellow-300 drop-shadow-[0_0_10px_#F59E0B]">
                  ${Math.floor(grand).toLocaleString()}
                </span>
                <Trophy className="w-3.5 h-3.5 text-yellow-400 fill-yellow-400 animate-bounce" />
              </div>

              {/* 2UP / Credits Inserted & Actions */}
              <div className="flex items-center space-x-1.5">
                <span className="text-[10px] sm:text-xs font-black text-cyan-400 hidden sm:inline">CREDITS:</span>
                <span className="text-[11px] sm:text-xs md:text-sm font-black text-emerald-400 hidden sm:inline">04</span>
                {onToggleFloorMode && (
                  <button
                    onClick={onToggleFloorMode}
                    className={`px-1.5 py-0.5 rounded text-[7.5px] font-black uppercase border transition-all ${
                      isFloorMode
                        ? 'bg-pink-600 text-white border-pink-200 shadow-[0_0_6px_#EC4899]'
                        : 'bg-purple-950 text-pink-300 border-pink-500/50 hover:border-pink-300'
                    }`}
                  >
                    {isFloorMode ? 'BANK ON' : 'BANK'}
                  </button>
                )}
                {onOpenLeaderboard && (
                  <button
                    onClick={onOpenLeaderboard}
                    className="px-1.5 py-0.5 rounded text-[7.5px] font-black uppercase bg-purple-950 hover:bg-purple-900 text-yellow-300 border border-yellow-400/60 transition-all flex items-center space-x-0.5"
                  >
                    <Trophy className="w-2.5 h-2.5 text-yellow-400" />
                    <span className="hidden xs:inline">SCORES</span>
                  </button>
                )}
              </div>
            </div>

            {/* TIER 2: BOSS BATTLE HP GAUGE & BOUNTY HUD */}
            <div className="grid grid-cols-12 gap-1.5 items-center px-0.5">
              {/* Left 7 Columns: STAGE 1 MECHA DRAGON BOSS ENCOUNTER */}
              <div
                onClick={handleJackpotClick}
                className="col-span-7 bg-gradient-to-r from-purple-950/80 via-[#18052e] to-purple-950/80 rounded-lg border border-pink-500/70 p-1 sm:p-1.5 shadow flex items-center justify-between cursor-pointer group hover:border-pink-300 transition-colors"
              >
                {/* Boss Avatar */}
                <div className="w-7 h-7 sm:w-8 sm:h-8 rounded bg-black border-2 border-pink-400 flex items-center justify-center text-base sm:text-lg shadow-[0_0_8px_#EC4899] flex-shrink-0 animate-pulse">
                  🐉
                </div>

                {/* Boss Title & Segmented Health Bar */}
                <div className="flex-1 mx-2 flex flex-col justify-center">
                  <div className="flex items-center justify-between text-[8px] sm:text-[8.5px] font-black tracking-wider uppercase mb-0.5">
                    <span className="text-pink-300 flex items-center space-x-1">
                      <ShieldAlert className="w-2.5 h-2.5 text-red-400" />
                      <span>MECHA DRAGON</span>
                    </span>
                    <span className="text-cyan-300 font-mono">
                      HP: {bossHpPercent}%
                    </span>
                  </div>

                  {/* 12-Segment Retro Pixel HP Bar */}
                  <div className="w-full h-2 sm:h-2.5 bg-black rounded p-0.5 border border-purple-500/60 flex space-x-0.5">
                    {Array.from({ length: 12 }, (_, i) => (
                      <div
                        key={i}
                        className={`flex-1 h-full rounded-2xs transition-all duration-300 ${
                          i < bossSegments
                            ? i < 4
                              ? 'bg-rose-500 shadow-[0_0_4px_#F43F5E]'
                              : i < 8
                              ? 'bg-amber-400 shadow-[0_0_4px_#FBBF24]'
                              : 'bg-emerald-400 shadow-[0_0_4px_#34D399]'
                            : 'bg-stone-900 opacity-40'
                        }`}
                      />
                    ))}
                  </div>
                </div>

                {/* Defeat Bounty */}
                <div className="flex flex-col items-end flex-shrink-0">
                  <span className="text-[7px] sm:text-[7.5px] font-black text-rose-400 uppercase tracking-widest">DRAGON BOUNTY</span>
                  <span className="text-[11px] sm:text-xs md:text-sm font-black text-cyan-200 drop-shadow-[0_0_6px_#06B6D4]">
                    ${Math.floor(major).toLocaleString()}
                  </span>
                </div>
              </div>

              {/* Right 5 Columns: OVERDRIVE COMBO & SUB-BOSS MINI BOUNTIES */}
              <div className="col-span-5 bg-gradient-to-r from-[#120424] to-black rounded-lg border border-cyan-500/60 p-1 sm:p-1.5 shadow flex flex-col justify-between h-full">
                {/* Overdrive Combo Meter */}
                <div className="flex items-center justify-between mb-0.5">
                  <div className="flex items-center space-x-1 text-[8px] sm:text-[8.5px] font-black uppercase tracking-wider text-cyan-300">
                    <Zap className="w-2.5 h-2.5 text-cyan-400 animate-pulse" />
                    <span>COMBO:</span>
                    <span className="text-yellow-300 font-mono">{feverCharge}%</span>
                  </div>
                  {isFeverActive ? (
                    <span className="text-[7.5px] sm:text-[8px] font-black text-yellow-300 animate-bounce uppercase">
                      2X OVERDRIVE!
                    </span>
                  ) : (
                    <span className="text-[7.5px] sm:text-[8px] font-bold text-slate-400 uppercase">
                      BUILD 100%
                    </span>
                  )}
                </div>

                {/* Sub-Boss Badges */}
                <div className="flex items-center justify-between gap-1 mt-0.5">
                  <div
                    onClick={handleJackpotClick}
                    className="flex-1 bg-black/80 rounded px-1 py-0.5 border border-purple-500/50 flex items-center justify-between cursor-pointer hover:border-cyan-400 transition-colors"
                  >
                    <span className="text-[7.5px] text-purple-300">👾 GOBLIN</span>
                    <span className="text-[8.5px] font-black text-cyan-300 font-mono">
                      ${Math.floor(minor).toLocaleString()}
                    </span>
                  </div>
                  <div
                    onClick={handleJackpotClick}
                    className="flex-1 bg-black/80 rounded px-1 py-0.5 border border-purple-500/50 flex items-center justify-between cursor-pointer hover:border-pink-400 transition-colors"
                  >
                    <span className="text-[7.5px] text-pink-300">🤖 BOT</span>
                    <span className="text-[8.5px] font-black text-pink-300 font-mono">
                      ${Math.floor(mini).toLocaleString()}
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* TIER 3: RETRO ARCADE SCANLINE NEWS TICKER & BANK CONTROLS */}
            <div className="mt-1 hidden xl:flex items-center justify-between px-1.5 py-0.5 bg-black/95 rounded border border-pink-500/50 text-[8px] sm:text-[8.5px] text-cyan-300 overflow-hidden shadow-inner">
              <div className="flex items-center space-x-1.5 truncate flex-1 mr-1.5">
                <span className="w-1.5 h-1.5 rounded-full bg-pink-500 animate-ping flex-shrink-0" />
                <span className="text-pink-300 font-bold uppercase truncate">
                  ★ NEW RECORD: TODD R. (117,245 PTS) • 3 CARTRIDGES UNLOCK 15 BOSS RUSH FREE SPINS • 50 RETRO PAYLINES ★
                </span>
              </div>

              {/* Action Buttons */}
              <div className="flex items-center space-x-1 flex-shrink-0">
                {onToggleFloorMode && (
                  <button
                    onClick={onToggleFloorMode}
                    className={`px-1.5 py-0.5 rounded text-[7.5px] sm:text-[8px] font-black uppercase border transition-all ${
                      isFloorMode
                        ? 'bg-pink-600 text-white border-pink-200 shadow-[0_0_8px_#EC4899]'
                        : 'bg-purple-950 text-pink-300 border-pink-500/50 hover:border-pink-300'
                    }`}
                  >
                    {isFloorMode ? 'BANK ON' : 'BANK'}
                  </button>
                )}
                {onOpenLeaderboard && (
                  <button
                    onClick={onOpenLeaderboard}
                    className="px-1.5 py-0.5 rounded text-[7.5px] sm:text-[8px] font-black uppercase bg-purple-950 hover:bg-purple-900 text-yellow-300 border border-yellow-400/60 transition-all flex items-center space-x-0.5"
                  >
                    <Trophy className="w-2.5 h-2.5 text-yellow-400" />
                    <span>SCORES</span>
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // =========================================================================
  // --- VERSION C: 24K VAULT (FORT KNOX HIGH-ROLLER GOLD BULLION TOP BOX) ---
  // =========================================================================
  return (
    <div className="w-full max-w-5xl xl:max-w-6xl 2xl:max-w-7xl mx-auto px-1 sm:px-2 mb-0.5 sm:mb-1 select-none flex-shrink-0 z-20">
      {/* Mobile Compact Top Box (< 640px) */}
      <div className="sm:hidden w-full px-0.5 py-0.5">
        <div
          onClick={handleJackpotClick}
          className="w-full h-11 px-2.5 rounded-xl bg-gradient-to-r from-amber-950 via-slate-950 to-amber-950 border-2 border-yellow-400/80 shadow-md flex items-center justify-between cursor-pointer"
        >
          {/* Left: Mascot Icon + Label */}
          <div className="flex items-center space-x-1 flex-shrink-0">
            <span className="text-base">👑</span>
            <span className="text-[8.5px] font-black uppercase text-yellow-300 tracking-wider">
              GRAND
            </span>
          </div>

          {/* Center: Live Grand Jackpot */}
          <div className="flex items-baseline font-mono px-1">
            <span className="text-xs font-black text-amber-400 mr-0.5">$</span>
            <span className="text-base font-black tracking-tight leading-none text-yellow-300 drop-shadow-[0_0_8px_rgba(253,224,71,0.9)]">
              {Math.floor(grand).toLocaleString()}
            </span>
            <span className="text-[9px] font-bold text-amber-400">
              .{(grand % 1).toFixed(2).slice(2)}
            </span>
          </div>

          {/* Right: Sub-jackpot summary & PSI meter */}
          <div className="flex items-center space-x-1.5 flex-shrink-0">
            <span className="text-[8px] font-mono font-bold text-purple-300">
              💎${Math.round(major / 1000)}k
            </span>
            <div className="px-1.5 py-0.5 rounded-full bg-slate-950 border border-amber-500/50 text-[7.5px] font-mono font-bold text-amber-300 flex items-center space-x-0.5">
              <span>PSI</span>
              <span className="text-white font-black">{feverCharge}%</span>
            </div>
          </div>
        </div>
      </div>

      {/* Desktop / Tablet Heavy Armored Titanium & 24K Gold Bullion Ingot Pediment (>= 640px) */}
      <div className="hidden sm:block relative pt-0.5 sm:pt-1">
        {/* Radial Sunburst Gold Glow */}
        <div className="absolute -top-2 left-1/2 -translate-x-1/2 w-3/4 h-10 rounded-full bg-gradient-to-t from-yellow-500/25 via-amber-500/10 to-transparent filter blur-md pointer-events-none" />

        {/* Monolithic Top Box Housing */}
        <div className="relative bg-gradient-to-b from-amber-600 via-yellow-700 to-amber-950 p-[2px] rounded-t-2xl sm:rounded-t-3xl rounded-b-xl shadow-[0_8px_25px_rgba(0,0,0,0.9),0_0_20px_rgba(245,158,11,0.35)]">
          <div className="relative bg-gradient-to-b from-slate-950 via-casino-950 to-black rounded-t-[22px] sm:rounded-t-[30px] rounded-b-lg p-1 sm:p-1.5">
            {/* Top Header: Molten Gold Reactor Gauge & High-Roller Mode Switches */}
            <div className="flex items-center justify-between px-1.5 mb-0.5 z-30 relative">
              {/* Left Switch: Bank View */}
              {onToggleFloorMode && (
                <button
                  onClick={onToggleFloorMode}
                  className={`flex items-center space-x-1 px-2 py-0.5 rounded-full border text-[8px] sm:text-[9px] font-black uppercase shadow transition-all ${
                    isFloorMode
                      ? 'bg-gradient-to-r from-amber-500 to-yellow-300 text-amber-950 border-yellow-100 shadow-[0_0_10px_rgba(251,191,36,0.8)]'
                      : 'bg-casino-900 text-amber-300 border-amber-500/60 hover:border-yellow-300'
                  }`}
                  title="Toggle Multiplayer Casino Floor Bank"
                >
                  <Users className="w-2.5 h-2.5" />
                  <span>{isFloorMode ? 'BANK ON' : '★ BANK'}</span>
                </button>
              )}

              {/* Center: Molten Gold Reactor PSI Overdrive Bar */}
              <div className="flex-1 max-w-xs sm:max-w-sm mx-1.5 px-2 py-0.5 rounded-full bg-slate-950 border border-yellow-500/60 shadow-inner flex items-center space-x-1.5">
                <div className="flex items-center space-x-1 text-[8px] font-black text-amber-300 uppercase whitespace-nowrap">
                  <Flame className="w-2.5 h-2.5 text-red-500 fill-red-500 animate-pulse" />
                  <span className="hidden xs:inline">REACTOR:</span>
                  <span className="text-yellow-300 font-mono">{feverCharge}%</span>
                </div>
                <div className="flex-1 bg-black h-1.5 rounded-full overflow-hidden p-0.5 border border-amber-500/40">
                  <div
                    className="h-full rounded-full bg-gradient-to-r from-amber-600 via-yellow-400 to-yellow-200 shadow-[0_0_8px_#FDE047] transition-all duration-300"
                    style={{ width: `${feverCharge}%` }}
                  />
                </div>
                {isFeverActive && (
                  <span className="text-[8px] font-black text-yellow-300 animate-bounce">FEVER!</span>
                )}
              </div>

              {/* Right Switch: High Scores */}
              {onOpenLeaderboard && (
                <button
                  onClick={onOpenLeaderboard}
                  className="flex items-center space-x-1 px-2 py-0.5 rounded-full bg-casino-900 hover:bg-casino-800 text-yellow-300 border border-yellow-400/60 hover:border-yellow-300 text-[8px] sm:text-[9px] font-black uppercase shadow transition-all"
                  title="View Vegas Server High Scores"
                >
                  <Trophy className="w-2.5 h-2.5 text-yellow-400 fill-yellow-400" />
                  <span>SCORES</span>
                </button>
              )}
            </div>

            {/* UNIFIED HORIZONTAL VAULT METERS DECK */}
            <div className="grid grid-cols-12 gap-1 items-stretch">
              {/* Left Column: MAJOR Amethyst Meter */}
              <div
                onClick={handleJackpotClick}
                className="col-span-3 cursor-pointer group relative p-1 rounded-xl bg-gradient-to-b from-purple-950 via-slate-950 to-black border border-purple-400/70 shadow flex flex-col justify-center items-center hover:scale-[1.01] transition-transform"
              >
                <div className="flex items-center space-x-1">
                  <Gem className="w-2.5 h-2.5 text-purple-300" />
                  <span className="text-[7px] sm:text-[8px] font-black uppercase text-purple-300 tracking-wider">
                    {gameDef.theme.majorTitle}
                  </span>
                </div>
                <div className="flex items-baseline font-mono text-[11px] sm:text-xs md:text-sm font-black text-purple-200 drop-shadow-[0_0_6px_#D8B4FE] mt-0.5">
                  <span>${Math.floor(major).toLocaleString()}</span>
                  <span className="text-[8.5px] text-purple-400/80">.{(major % 1).toFixed(2).slice(2)}</span>
                </div>
              </div>

              {/* Center Column: GRAND JACKPOT Fort Knox Armored Glass Chamber (HERO) */}
              <div
                onClick={handleJackpotClick}
                className="col-span-6 relative rounded-xl bg-gradient-to-r from-amber-950 via-black to-amber-950 border-2 border-yellow-400/70 shadow-inner p-1 sm:p-1.5 flex items-center justify-between cursor-pointer group overflow-hidden"
              >
                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent animate-shimmer-sweep pointer-events-none" />

                <div className="flex items-center space-x-1 z-10 flex-shrink-0">
                  {[...Array(3)].map((_, i) => (
                    <div
                      key={i}
                      className="w-1.5 h-1.5 rounded-full bg-yellow-300 shadow-[0_0_6px_#FDE047] animate-pulse"
                      style={{ animationDuration: '500ms', animationDelay: `${i * 120}ms` }}
                    />
                  ))}
                </div>

                <div className="flex flex-col items-center z-10 mx-auto px-1 text-center">
                  <div className="flex items-center space-x-1 text-amber-300 text-[7.5px] sm:text-[8.5px] font-black uppercase tracking-widest">
                    <Crown className="w-2.5 h-2.5 text-yellow-300 fill-yellow-300 animate-bounce" />
                    <span>★ {gameDef.theme.grandTitle} ★</span>
                    <Sparkles className="w-2.5 h-2.5 text-yellow-300" />
                  </div>
                  <div className="flex items-baseline font-mono">
                    <span className="text-xs font-black text-amber-400 mr-0.5">$</span>
                    <span className="text-lg sm:text-2xl md:text-2xl lg:text-3xl font-black tracking-tight leading-none text-yellow-300 drop-shadow-[0_0_12px_rgba(253,224,71,1)]">
                      {Math.floor(grand).toLocaleString()}
                    </span>
                    <span className="text-[9.5px] sm:text-[11px] font-bold text-amber-400/90 ml-0.5">
                      .{(grand % 1).toFixed(2).slice(2)}
                    </span>
                  </div>
                </div>

                <div className="flex items-center space-x-1 z-10 flex-shrink-0">
                  {[...Array(3)].map((_, i) => (
                    <div
                      key={i}
                      className="w-1.5 h-1.5 rounded-full bg-yellow-300 shadow-[0_0_6px_#FDE047] animate-pulse"
                      style={{ animationDuration: '500ms', animationDelay: `${(2 - i) * 120}ms` }}
                    />
                  ))}
                </div>
              </div>

              {/* Right Column: MINOR & MINI High-Security Cyan & Gold Meter */}
              <div className="col-span-3 grid grid-cols-2 gap-1">
                {/* MINOR */}
                <div
                  onClick={handleJackpotClick}
                  className="cursor-pointer group relative p-0.5 sm:p-1 rounded-xl bg-gradient-to-b from-cyan-950 via-slate-950 to-black border border-cyan-400/70 shadow flex flex-col justify-center items-center hover:scale-[1.01] transition-transform"
                >
                  <div className="flex items-center space-x-0.5">
                    <Coins className="w-2 h-2 text-cyan-300" />
                    <span className="text-[6.5px] sm:text-[7.5px] font-black uppercase text-cyan-300 tracking-wider">
                      {gameDef.theme.minorTitle}
                    </span>
                  </div>
                  <div className="flex items-baseline font-mono text-[9px] sm:text-[11px] md:text-xs font-black text-cyan-200 drop-shadow-[0_0_6px_#67E8F9]">
                    <span>${Math.floor(minor).toLocaleString()}</span>
                  </div>
                </div>

                {/* MINI */}
                <div
                  onClick={handleJackpotClick}
                  className="cursor-pointer group relative p-0.5 sm:p-1 rounded-xl bg-gradient-to-b from-amber-950 via-slate-950 to-black border border-yellow-400/70 shadow flex flex-col justify-center items-center hover:scale-[1.01] transition-transform"
                >
                  <div className="flex items-center space-x-0.5">
                    <Crown className="w-2 h-2 text-yellow-300" />
                    <span className="text-[6.5px] sm:text-[7.5px] font-black uppercase text-yellow-300 tracking-wider">
                      {gameDef.theme.miniTitle}
                    </span>
                  </div>
                  <div className="flex items-baseline font-mono text-[9px] sm:text-[11px] md:text-xs font-black text-yellow-200 drop-shadow-[0_0_6px_#FDE047]">
                    <span>${Math.floor(mini).toLocaleString()}</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Retro Casino Promotional Ad Banner */}
            <div className="mt-0.5 hidden xl:block">
              <RetroCasinoAdBanner activeGameId={activeGameId} />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
