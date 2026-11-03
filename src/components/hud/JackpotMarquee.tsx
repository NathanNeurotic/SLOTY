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
  const isPs2 = activeGameId === 'ps2-legends';
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
    if (isPs2) {
      soundManager.playPs2Scatter(3);
    } else if (isTimber) {
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
        {/* Mobile Compact Top Box (< 640px): Carved Cedar Plank */}
        <div className="sm:hidden w-full px-0.5 py-0.5">
          <div
            onClick={handleJackpotClick}
            className="w-full h-11 px-3 bg-gradient-to-r from-[#2e1408] via-[#142419] to-[#2e1408] border-2 border-[#854d0e] shadow-md flex items-center justify-between cursor-pointer"
            style={{
              clipPath: 'polygon(0% 15%, 2% 0%, 98% 0%, 100% 15%, 98% 50%, 100% 85%, 98% 100%, 2% 100%, 0% 85%, 2% 50%)',
            }}
          >
            {/* Left: Mascot Icon + Label */}
            <div className="flex items-center space-x-1 flex-shrink-0">
              <span className="text-base">🐻</span>
              <span className="text-[8.5px] font-black uppercase text-amber-300 tracking-wider font-serif">
                HARVEST
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
              <div className="px-1.5 py-0.5 bg-[#122216] border border-emerald-500/50 text-[7.5px] font-mono font-bold text-emerald-300 flex items-center space-x-0.5">
                <span>SAP</span>
                <span className="text-white font-black">{feverCharge}%</span>
              </div>
            </div>
          </div>
        </div>

        {/* Desktop / Tablet Mountain Cabin Hand-Hewn Lodge Gable (>= 640px) */}
        <div className="hidden sm:block relative pt-0.5 sm:pt-1">
          {/* Ambient Warm Hearth Glow */}
          <div className="absolute -top-1 left-1/2 -translate-x-1/2 w-3/4 h-10 rounded-full bg-gradient-to-t from-amber-600/30 via-emerald-600/15 to-transparent filter blur-md pointer-events-none" />

          {/* Roof Shingles & Log Trusses Container */}
          <div
            className="relative bg-gradient-to-b from-[#3b1d0c] via-[#241207] to-[#0e0703] border-2 border-[#78350f] shadow-[0_6px_20px_rgba(0,0,0,0.95),0_0_15px_rgba(16,185,129,0.25)] p-1 sm:p-1.5 transition-transform duration-200"
            style={{
              clipPath: 'polygon(0% 0%, 100% 0%, 99.5% 100%, 0.5% 100%)',
            }}
          >
            {/* Top Roof Peak: Nature's Fury Sap Branch & Trail Controls */}
            <div className="flex items-center justify-between px-1.5 mb-0.5 z-30 relative">
              {/* Left Trail Sign: Floor Bank Toggle */}
              {onToggleFloorMode && (
                <button
                  onClick={onToggleFloorMode}
                  className={`flex items-center space-x-1 px-2.5 py-0.5 border text-[8px] sm:text-[9px] font-black uppercase font-serif tracking-wider shadow transition-all ${
                    isFloorMode
                      ? 'bg-gradient-to-r from-emerald-700 to-teal-600 text-white border-emerald-300 shadow-[0_0_8px_rgba(52,211,153,0.7)]'
                      : 'bg-[#221006] hover:bg-[#34180a] text-amber-200 border-[#a16207]'
                  }`}
                  style={{
                    clipPath: 'polygon(6px 0%, calc(100% - 6px) 0%, 100% 50%, calc(100% - 6px) 100%, 6px 100%, 0% 50%)',
                  }}
                  title="Toggle Camp Bank view"
                >
                  <Users className="w-2.5 h-2.5 text-amber-300" />
                  <span>{isFloorMode ? 'CAMP BANK ON' : 'CAMP BANK'}</span>
                </button>
              )}

              {/* Center: Nature's Fury Birch Sap Meter */}
              <div className="flex-1 max-w-xs sm:max-w-sm mx-1.5 px-2 py-0.5 bg-[#180a03] border border-[#a16207] shadow-inner flex items-center space-x-1.5">
                <div className="flex items-center space-x-1 text-[8px] font-black text-emerald-300 uppercase whitespace-nowrap font-serif">
                  <Trees className="w-2.5 h-2.5 text-emerald-400 animate-pulse" />
                  <span className="hidden xs:inline">SAP:</span>
                  <span className="text-amber-300 font-mono">{feverCharge}%</span>
                </div>
                <div className="flex-1 bg-black/80 h-1.5 overflow-hidden p-0.5 border border-emerald-600/40">
                  <div
                    className="h-full bg-gradient-to-r from-emerald-500 via-teal-400 to-amber-300 shadow-[0_0_6px_#34D399] transition-all duration-300"
                    style={{ width: `${feverCharge}%` }}
                  />
                </div>
                {isFeverActive && (
                  <span className="text-[8px] font-black text-amber-300 animate-bounce font-serif">2X!</span>
                )}
              </div>

              {/* Right Trail Sign: Leaderboard */}
              {onOpenLeaderboard && (
                <button
                  onClick={onOpenLeaderboard}
                  className="flex items-center space-x-1 px-2.5 py-0.5 bg-[#221006] hover:bg-[#34180a] text-amber-200 border border-[#a16207] hover:border-amber-400 text-[8px] sm:text-[9px] font-black uppercase font-serif tracking-wider shadow transition-all"
                  style={{
                    clipPath: 'polygon(0% 0%, calc(100% - 6px) 0%, 100% 50%, calc(100% - 6px) 100%, 0% 100%, 6% 50%)',
                  }}
                  title="View Forest Hall of Fame"
                >
                  <Trophy className="w-2.5 h-2.5 text-yellow-400 fill-yellow-400" />
                  <span>HALL OF FAME</span>
                </button>
              )}
            </div>

            {/* ASYMMETRICAL PACIFIC NORTHWEST CABIN GABLE & FOREST TRAILGUIDE */}
            <div className="grid grid-cols-12 gap-1.5 items-stretch w-full">
              {/* Left 8 Columns: THE GREAT GRIZZLY REDWOOD GABLE (HERO) */}
              <div
                onClick={handleJackpotClick}
                className="col-span-8 relative bg-gradient-to-r from-[#2e1408] via-[#122216] to-[#2e1408] border-2 border-[#b45309] shadow-2xl p-1 sm:p-1.5 flex items-center justify-between cursor-pointer group overflow-hidden"
                style={{
                  clipPath: 'polygon(0% 12%, 2.5% 0%, 97.5% 0%, 100% 12%, 98% 50%, 100% 88%, 97.5% 100%, 2.5% 100%, 0% 88%, 2% 50%)',
                }}
              >
                {/* Ambient campfire ember glow */}
                <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_50%_120%,rgba(245,158,11,0.25),transparent_70%)] pointer-events-none" />

                {/* Left: Carved Grizzly Totem Icon with Square Iron Nails */}
                <div
                  className="relative z-10 w-7 h-7 sm:w-8 sm:h-8 bg-[#3b1d0c] border-2 border-amber-400 shadow-[0_0_10px_rgba(245,158,11,0.8)] flex items-center justify-center text-sm sm:text-base animate-bounce flex-shrink-0"
                  style={{ clipPath: 'polygon(15% 0%, 85% 0%, 100% 15%, 100% 85%, 85% 100%, 15% 100%, 0% 85%, 0% 15%)' }}
                >
                  🐻
                </div>

                {/* Center: Grand Harvest Pot Title & Big Amount */}
                <div className="flex flex-col items-center z-10 mx-auto px-1 text-center">
                  <div className="flex items-center justify-center space-x-1 text-amber-300 text-[8px] sm:text-[9.5px] font-black uppercase tracking-widest font-serif">
                    <Trees className="w-3 h-3 text-emerald-400 fill-emerald-500/30 animate-pulse flex-shrink-0" />
                    <span>GRIZZLY PEAK GRAND HARVEST</span>
                    <Trees className="w-3 h-3 text-emerald-400 fill-emerald-500/30 animate-pulse flex-shrink-0" />
                  </div>
                  <div className="flex items-baseline font-mono">
                    <span className="text-xs sm:text-sm font-black text-amber-400 mr-0.5">$</span>
                    <span className="text-lg sm:text-2xl md:text-3xl font-black tracking-tight leading-none text-emerald-200 drop-shadow-[0_0_14px_rgba(52,211,153,1)]">
                      {Math.floor(grand).toLocaleString()}
                    </span>
                    <span className="text-[9px] sm:text-[11px] font-bold text-emerald-400/90 ml-0.5">
                      .{(grand % 1).toFixed(2).slice(2)}
                    </span>
                  </div>
                </div>

                {/* Right: Mystic Owl Guardian */}
                <div
                  className="relative z-10 w-7 h-7 sm:w-8 sm:h-8 bg-[#132216] border-2 border-emerald-400 shadow-[0_0_10px_rgba(52,211,153,0.8)] flex items-center justify-center text-sm sm:text-base animate-pulse flex-shrink-0"
                  style={{ clipPath: 'polygon(15% 0%, 85% 0%, 100% 15%, 100% 85%, 85% 100%, 15% 100%, 0% 85%, 0% 15%)' }}
                >
                  🦉
                </div>
              </div>

              {/* Right 4 Columns: VERTICAL FOREST TRAILGUIDE (Wolf Pack & Critter Caches) */}
              <div className="col-span-4 flex flex-col justify-between gap-1">
                {/* WOLF PACK MAJOR CACHE: Carved Wooden Arrow Trail Sign */}
                <div
                  onClick={handleJackpotClick}
                  className="cursor-pointer group relative px-2 py-1 bg-gradient-to-r from-[#34180a] to-[#122216] border-2 border-[#b45309] shadow-lg flex items-center justify-between hover:brightness-110 transition-all flex-1"
                  style={{
                    clipPath: 'polygon(0% 0%, 88% 0%, 100% 50%, 88% 100%, 0% 100%, 4% 50%)',
                  }}
                >
                  <div className="flex items-center space-x-1 pl-1">
                    <span className="text-xs">🐺</span>
                    <span className="text-[7.5px] sm:text-[8px] font-black uppercase text-teal-300 tracking-wider font-serif">
                      WOLF PACK
                    </span>
                  </div>
                  <div className="flex items-baseline font-mono text-xs sm:text-sm font-black text-teal-200 drop-shadow-[0_0_6px_#2DD4BF] pr-3">
                    <span>${Math.floor(major).toLocaleString()}</span>
                  </div>
                </div>

                {/* FOX & SQUIRREL MINOR & MINI: Hand-cut Chamfered Wood Shingles */}
                <div className="grid grid-cols-2 gap-1 flex-1">
                  <div
                    onClick={handleJackpotClick}
                    className="cursor-pointer group relative px-1 py-0.5 bg-gradient-to-b from-[#2a1306] to-[#0e0703] border border-amber-600/70 shadow flex items-center justify-between hover:brightness-110 transition-all"
                    style={{
                      clipPath: 'polygon(6px 0, calc(100% - 6px) 0, 100% 6px, 100% calc(100% - 6px), calc(100% - 6px) 100%, 6px 100%, 0 calc(100% - 6px), 0 6px)',
                    }}
                  >
                    <span className="text-[9px]">🦊</span>
                    <span className="text-[8px] sm:text-[9.5px] font-black text-amber-200 font-mono">
                      ${Math.floor(minor).toLocaleString()}
                    </span>
                  </div>

                  <div
                    onClick={handleJackpotClick}
                    className="cursor-pointer group relative px-1 py-0.5 bg-gradient-to-b from-[#132216] to-[#050e08] border border-emerald-600/70 shadow flex items-center justify-between hover:brightness-110 transition-all"
                    style={{
                      clipPath: 'polygon(6px 0, calc(100% - 6px) 0, 100% 6px, 100% calc(100% - 6px), calc(100% - 6px) 100%, 6px 100%, 0 calc(100% - 6px), 0 6px)',
                    }}
                  >
                    <span className="text-[9px]">🐿️</span>
                    <span className="text-[8px] sm:text-[9.5px] font-black text-emerald-200 font-mono">
                      ${Math.floor(mini).toLocaleString()}
                    </span>
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
            className="w-full h-11 px-2.5 bg-gradient-to-r from-[#18052e] via-[#090117] to-[#18052e] border-2 border-pink-500 shadow-[0_0_15px_rgba(236,72,153,0.5)] flex items-center justify-between cursor-pointer"
            style={{
              clipPath: 'polygon(0 4px, 2px 4px, 2px 2px, 4px 2px, 4px 0, calc(100% - 4px) 0, calc(100% - 4px) 2px, calc(100% - 2px) 2px, calc(100% - 2px) 4px, 100% 4px, 100% calc(100% - 4px), calc(100% - 2px) calc(100% - 4px), calc(100% - 2px) calc(100% - 2px), calc(100% - 4px) calc(100% - 2px), calc(100% - 4px) 100%, 4px 100%, 4px calc(100% - 2px), 2px calc(100% - 2px), 2px calc(100% - 4px), 0 calc(100% - 4px))',
            }}
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
              <div className="px-1.5 py-0.5 bg-purple-950 border border-pink-500/60 text-[7.5px] font-bold text-pink-200">
                HP {bossHpPercent}%
              </div>
            </div>
          </div>
        </div>

        {/* Desktop / Tablet Retro Arcade Coin-Op Hood (>= 640px) */}
        <div className="hidden sm:block relative pt-0.5 sm:pt-1">
          {/* Neon Purple / Cyan Edge Glow */}
          <div className="absolute -top-1 left-1/2 -translate-x-1/2 w-3/4 h-10 bg-gradient-to-t from-pink-600/30 via-cyan-500/20 to-transparent filter blur-md pointer-events-none" />

          {/* Molded Cyber Marquee Frame with Neon Double Stroke */}
          <div className="relative bg-gradient-to-b from-[#2a0845] via-[#100326] to-[#05010e] border-2 border-pink-500 shadow-[0_6px_20px_rgba(0,0,0,0.95),0_0_15px_rgba(236,72,153,0.5)] p-1">
            {/* Corner Arcade Machine Screws */}
            <div className="absolute top-1 left-1 font-mono text-[7px] text-pink-400/80 leading-none select-none">[+]</div>
            <div className="absolute top-1 right-1 font-mono text-[7px] text-pink-400/80 leading-none select-none">[+]</div>

            {/* TIER 1: AUTHENTIC 1980s SCOREBOARD STRIP */}
            <div className="flex items-center justify-between px-2 py-0.5 bg-black border border-pink-500/50 mb-1 shadow-inner text-[9.5px] sm:text-xs">
              {/* 1UP Player Score */}
              <div className="flex items-center space-x-1 sm:space-x-1.5">
                <span className="text-[9px] sm:text-xs font-black text-rose-500 animate-pulse tracking-widest">1UP</span>
                <span className="text-[10px] sm:text-xs md:text-sm font-black text-cyan-300 tracking-wider">
                  {Math.floor(grand * 0.35).toLocaleString().padStart(8, '0')}
                </span>
              </div>

              {/* HIGH SCORE: Center Trophy Display */}
              <div
                onClick={handleJackpotClick}
                className="flex items-center space-x-1 sm:space-x-1.5 cursor-pointer group"
                title="Grand Arcade Jackpot"
              >
                <Trophy className="w-3 h-3 sm:w-3.5 sm:h-3.5 text-yellow-400 fill-yellow-400 animate-bounce" />
                <span className="text-[9px] sm:text-xs font-black text-amber-400 tracking-widest">HIGH SCORE:</span>
                <span className="text-[11px] sm:text-xs md:text-base font-black text-yellow-300 drop-shadow-[0_0_10px_#F59E0B]">
                  ${Math.floor(grand).toLocaleString()}
                </span>
                <Trophy className="w-3 h-3 sm:w-3.5 sm:h-3.5 text-yellow-400 fill-yellow-400 animate-bounce" />
              </div>

              {/* 2UP / Credits Inserted & Actions */}
              <div className="flex items-center space-x-1 sm:space-x-1.5">
                <span className="text-[9px] sm:text-xs font-black text-cyan-400 hidden sm:inline">CREDITS:</span>
                <span className="text-[10px] sm:text-xs md:text-sm font-black text-emerald-400 hidden sm:inline">04</span>
                {onToggleFloorMode && (
                  <button
                    onClick={onToggleFloorMode}
                    className={`px-1.5 py-0.5 text-[7px] sm:text-[7.5px] font-black uppercase border transition-all ${
                      isFloorMode
                        ? 'bg-pink-600 text-white border-pink-200 shadow-[0_0_6px_#EC4899]'
                        : 'bg-purple-950 text-pink-300 border-pink-500 hover:border-pink-300'
                    }`}
                  >
                    {isFloorMode ? 'BANK ON' : 'BANK'}
                  </button>
                )}
                {onOpenLeaderboard && (
                  <button
                    onClick={onOpenLeaderboard}
                    className="px-1.5 py-0.5 text-[7px] sm:text-[7.5px] font-black uppercase bg-purple-950 hover:bg-purple-900 text-yellow-300 border border-yellow-400 transition-all flex items-center space-x-0.5"
                  >
                    <Trophy className="w-2.5 h-2.5 text-yellow-400" />
                    <span className="hidden xs:inline">SCORES</span>
                  </button>
                )}
              </div>
            </div>

            {/* TIER 2: BOSS BATTLE HP GAUGE & BOUNTY HUD */}
            <div className="grid grid-cols-12 gap-1 items-center px-0.5">
              {/* Left 7 Columns: STAGE 1 MECHA DRAGON BOSS ENCOUNTER */}
              <div
                onClick={handleJackpotClick}
                className="col-span-7 bg-gradient-to-r from-purple-950 via-[#18052e] to-purple-950 border-2 border-pink-500 p-1 shadow flex items-center justify-between cursor-pointer group hover:border-pink-300 transition-colors"
                style={{
                  clipPath: 'polygon(0 6px, 2px 6px, 2px 4px, 4px 4px, 4px 2px, 6px 2px, 6px 0, calc(100% - 6px) 0, calc(100% - 6px) 2px, calc(100% - 4px) 2px, calc(100% - 4px) 4px, calc(100% - 2px) 4px, calc(100% - 2px) 6px, 100% 6px, 100% calc(100% - 6px), calc(100% - 2px) calc(100% - 6px), calc(100% - 2px) calc(100% - 4px), calc(100% - 4px) calc(100% - 4px), calc(100% - 4px) calc(100% - 2px), calc(100% - 6px) calc(100% - 2px), calc(100% - 6px) 100%, 6px 100%, 6px calc(100% - 2px), 4px calc(100% - 2px), 4px calc(100% - 4px), 2px calc(100% - 4px), 2px calc(100% - 6px), 0 calc(100% - 6px))',
                }}
              >
                {/* Boss Avatar */}
                <div className="w-6 h-6 bg-black border border-pink-400 flex items-center justify-center text-sm shadow-[0_0_8px_#EC4899] flex-shrink-0 animate-pulse">
                  🐉
                </div>

                {/* Boss Title & Segmented Health Bar */}
                <div className="flex-1 mx-2 flex flex-col justify-center">
                  <div className="flex items-center justify-between text-[7.5px] sm:text-[8px] font-black tracking-wider uppercase mb-0.5">
                    <span className="text-pink-300 flex items-center space-x-1">
                      <ShieldAlert className="w-2.5 h-2.5 text-red-400 animate-pulse" />
                      <span>[ BOSS: MECHA DRAGON ]</span>
                    </span>
                    <span className="text-cyan-300 font-mono">
                      HP: {bossHpPercent}%
                    </span>
                  </div>

                  {/* 12-Segment Retro Pixel HP Bar */}
                  <div className="w-full h-2 bg-black p-0.5 border border-purple-500/80 flex space-x-0.5">
                    {Array.from({ length: 12 }, (_, i) => (
                      <div
                        key={i}
                        className={`flex-1 h-full transition-all duration-300 ${
                          i < bossSegments
                            ? i < 4
                              ? 'bg-rose-500 shadow-[0_0_4px_#F43F5E]'
                              : i < 8
                              ? 'bg-amber-400 shadow-[0_0_4px_#FBBF24]'
                              : 'bg-emerald-400 shadow-[0_0_4px_#34D399]'
                            : 'bg-stone-900 opacity-30'
                        }`}
                      />
                    ))}
                  </div>
                </div>

                {/* Defeat Bounty */}
                <div className="flex flex-col items-end flex-shrink-0 pl-1 border-l border-pink-500/40">
                  <span className="text-[6.5px] sm:text-[7px] font-black text-rose-400 uppercase tracking-widest">DRAGON BOUNTY</span>
                  <span className="text-[10px] sm:text-xs md:text-sm font-black text-cyan-200 drop-shadow-[0_0_6px_#06B6D4]">
                    ${Math.floor(major).toLocaleString()}
                  </span>
                </div>
              </div>

              {/* Right 5 Columns: OVERDRIVE COMBO & SUB-BOSS MINI BOUNTIES */}
              <div className="col-span-5 bg-gradient-to-r from-[#120424] to-black border border-cyan-500/70 p-1 shadow flex flex-col justify-between h-full">
                {/* Overdrive Combo Meter */}
                <div className="flex items-center justify-between mb-0.5">
                  <div className="flex items-center space-x-1 text-[7.5px] sm:text-[8px] font-black uppercase tracking-wider text-cyan-300">
                    <Zap className="w-2.5 h-2.5 text-cyan-400 animate-pulse" />
                    <span>COMBO:</span>
                    <span className="text-yellow-300 font-mono">{feverCharge}%</span>
                  </div>
                  {isFeverActive ? (
                    <span className="text-[7px] sm:text-[7.5px] font-black text-yellow-300 animate-bounce uppercase">
                      2X!
                    </span>
                  ) : (
                    <span className="text-[7px] sm:text-[7.5px] font-bold text-slate-400 uppercase">
                      100%
                    </span>
                  )}
                </div>

                {/* Sub-Boss Badges */}
                <div className="flex items-center justify-between gap-1 mt-0.5">
                  <div
                    onClick={handleJackpotClick}
                    className="flex-1 bg-black px-1.5 py-0.5 border border-purple-500/70 flex items-center justify-between cursor-pointer hover:border-cyan-400 transition-colors"
                  >
                    <span className="text-[7.5px] text-purple-300 font-bold">👾 GOBLIN</span>
                    <span className="text-[8px] font-black text-cyan-300 font-mono">
                      ${Math.floor(minor).toLocaleString()}
                    </span>
                  </div>
                  <div
                    onClick={handleJackpotClick}
                    className="flex-1 bg-black px-1.5 py-0.5 border border-purple-500/70 flex items-center justify-between cursor-pointer hover:border-pink-400 transition-colors"
                  >
                    <span className="text-[7.5px] text-pink-300 font-bold">🤖 BOT</span>
                    <span className="text-[8px] font-black text-pink-300 font-mono">
                      ${Math.floor(mini).toLocaleString()}
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* TIER 3: RETRO ARCADE SCANLINE NEWS TICKER & BANK CONTROLS */}
            <div className="mt-1 hidden xl:flex items-center justify-between px-2 py-0.5 bg-black border border-pink-500/60 text-[8px] sm:text-[8.5px] text-cyan-300 overflow-hidden shadow-inner">
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
  // --- VERSION D: PLAYSTATION 2 (EMOTION ENGINE & BIOS MONOLITH TOP BOX) ---
  // =========================================================================
  if (isPs2) {
    const eeMhz = Math.round(294.9 + (feverCharge / 100) * 150);
    const eeSegments = Math.round((feverCharge / 100) * 12);

    return (
      <div className="w-full max-w-5xl xl:max-w-6xl 2xl:max-w-7xl mx-auto px-1 sm:px-2 mb-0.5 sm:mb-1 select-none flex-shrink-0 z-20 font-mono">
        {/* Mobile Compact PS2 Monolith Bar (< 640px) */}
        <div className="sm:hidden w-full px-0.5 py-0.5">
          <div
            onClick={handleJackpotClick}
            className="w-full h-11 px-2.5 bg-gradient-to-r from-[#030612] via-[#081126] to-[#030612] border-2 border-[#006FCD] shadow-[0_0_15px_rgba(0,111,205,0.7)] flex items-center justify-between cursor-pointer"
            style={{
              clipPath: 'polygon(0 0, calc(100% - 6px) 0, 100% 6px, 100% 100%, 6px 100%, 0 calc(100% - 6px))',
            }}
          >
            {/* Left: PS Family Logo badge */}
            <div className="flex items-center space-x-1.5 flex-shrink-0">
              <span className="text-[10px] font-black text-[#006FCD] drop-shadow-[0_0_8px_#006FCD]">PS2</span>
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 shadow-[0_0_6px_#22c55e]" />
            </div>

            {/* Center: EMOTION ENGINE GRAND JACKPOT */}
            <div className="flex flex-col items-center px-1">
              <span className="text-[7px] font-black text-cyan-400 tracking-wider uppercase">EMOTION ENGINE</span>
              <div className="flex items-baseline">
                <span className="text-xs font-black text-cyan-400 mr-0.5">$</span>
                <span className="text-sm font-black text-white drop-shadow-[0_0_12px_#006FCD]">
                  {Math.floor(grand).toLocaleString()}
                </span>
              </div>
            </div>

            {/* Right: CPU Clock */}
            <div className="flex items-center space-x-1 flex-shrink-0">
              <div className="px-1.5 py-0.5 bg-[#00183b] border border-[#006FCD] text-[7.5px] font-bold text-cyan-300">
                {eeMhz} MHz
              </div>
            </div>
          </div>
        </div>

        {/* Desktop / Tablet PS2 Console Chassis Top Box (>= 640px) */}
        <div className="hidden sm:block relative pt-0.5 sm:pt-1">
          {/* Cobalt Blue Ambient Horizon Glow */}
          <div className="absolute -top-1 left-1/2 -translate-x-1/2 w-3/4 h-10 bg-gradient-to-t from-[#006FCD]/30 via-cyan-500/20 to-transparent filter blur-md pointer-events-none" />

          {/* Ribbed Matte Black Chassis Housing */}
          <div className="relative bg-gradient-to-b from-[#0a0f1d] via-[#040711] to-[#010308] border-2 border-[#006FCD] shadow-[0_6px_20px_rgba(0,0,0,0.95),0_0_15px_rgba(0,111,205,0.6)] p-1">
            {/* Top Ribbed Cooling Slat Lines */}
            <div className="absolute -top-1 left-4 right-4 h-1 flex justify-between space-x-1 opacity-70">
              {[...Array(24)].map((_, i) => (
                <div key={i} className="flex-1 h-0.5 bg-[#006FCD]/60 rounded-xs" />
              ))}
            </div>

            {/* TIER 1: PS2 EMOTION ENGINE SYSTEM STRIP */}
            <div className="flex items-center justify-between px-2 py-0.5 border-b border-[#006FCD]/40 bg-[#02050e]/90 text-[8px] sm:text-[9px]">
              {/* Left: PlayStation 2 Brand Header */}
              <div className="flex items-center space-x-2">
                <div className="flex items-center space-x-1 px-1.5 py-0.5 bg-black border border-[#006FCD]/80 shadow-[0_0_8px_rgba(0,111,205,0.5)]">
                  <span className="font-black text-[9px] tracking-widest text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-[#006FCD]">
                    PlayStation 2
                  </span>
                  <span className="text-[7px] text-slate-400">®</span>
                </div>
                <div className="hidden md:flex items-center space-x-1 text-[7.5px] text-cyan-300 font-bold">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 shadow-[0_0_6px_#22c55e] animate-pulse" />
                  <span>POWER / 294.912 MHz EE</span>
                </div>
              </div>

              {/* Center: Overclock Capacitor Meter */}
              <div className="flex items-center space-x-1 sm:space-x-2">
                <span className="text-[7px] sm:text-[8px] font-black text-cyan-400 uppercase tracking-widest">
                  EE BUS CLOCK:
                </span>
                <div className="flex items-center space-x-0.5 px-1 py-0.5 bg-black border border-[#006FCD]/60">
                  {[...Array(12)].map((_, i) => (
                    <div
                      key={i}
                      className={`w-1.5 sm:w-2 h-2 sm:h-2.5 transition-all ${
                        i < eeSegments
                          ? 'bg-gradient-to-t from-[#006FCD] via-cyan-400 to-white shadow-[0_0_6px_#00F0FF]'
                          : 'bg-[#061024] border border-[#0d2247]'
                      }`}
                    />
                  ))}
                </div>
                <span className="text-[8px] font-black text-cyan-300">{eeMhz} MHz</span>
              </div>

              {/* Right: Casino Floor Mode / Trophies */}
              <div className="flex items-center space-x-1 sm:space-x-1.5">
                {onToggleFloorMode && (
                  <button
                    onClick={onToggleFloorMode}
                    className={`px-1.5 py-0.5 text-[7px] sm:text-[7.5px] font-black uppercase border transition-all ${
                      isFloorMode
                        ? 'bg-cyan-500 text-black border-cyan-300 shadow-[0_0_8px_#00F0FF]'
                        : 'bg-black text-cyan-400/80 border-[#006FCD]/50 hover:bg-[#081836]'
                    }`}
                  >
                    FLOOR
                  </button>
                )}
                {onOpenLeaderboard && (
                  <button
                    onClick={onOpenLeaderboard}
                    className="flex items-center space-x-1 px-1.5 py-0.5 text-[7px] sm:text-[7.5px] font-black uppercase bg-black text-cyan-300 border border-[#006FCD]/60 hover:bg-[#081836]"
                  >
                    <Trophy className="w-2.5 h-2.5 text-cyan-400" />
                    <span>SCORES</span>
                  </button>
                )}
              </div>
            </div>

            {/* TIER 2: 3-POD ARCHITECTURAL PROGRESSIVE MARQUEE */}
            <div className="grid grid-cols-12 gap-1 sm:gap-1.5 pt-1 items-stretch">
              {/* Left Pod (3 Cols): Graphics Synthesizer Major */}
              <div
                onClick={handleJackpotClick}
                className="col-span-3 bg-gradient-to-b from-[#040a18] via-[#02050e] to-[#010206] border border-[#006FCD]/70 shadow-inner p-1 sm:p-1.5 flex flex-col justify-center items-center cursor-pointer hover:border-cyan-300 transition-all relative overflow-hidden"
              >
                <div className="flex items-center space-x-1 text-[#38BDF8] text-[7.5px] sm:text-[8.5px] font-black uppercase tracking-wider">
                  <span>MAJOR GS 147MHz</span>
                </div>
                <div className="flex items-baseline text-white font-mono mt-0.5">
                  <span className="text-[9px] sm:text-[10px] text-cyan-400 mr-0.5">$</span>
                  <span className="text-xs sm:text-sm xl:text-base font-black text-cyan-200 drop-shadow-[0_0_8px_#006FCD]">
                    {major.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                  </span>
                </div>
              </div>

              {/* Center Monolith (6 Cols): 128-Bit Emotion Engine Grand Jackpot */}
              <div
                onClick={handleJackpotClick}
                className="col-span-6 bg-gradient-to-b from-[#081836] via-[#030917] to-[#010308] border-2 border-cyan-400 shadow-[0_0_20px_rgba(0,111,205,0.8),inset_0_0_15px_rgba(0,111,205,0.4)] p-1 sm:p-1.5 flex flex-col justify-center items-center cursor-pointer hover:border-white transition-all relative overflow-hidden"
              >
                <div className="flex items-center space-x-1 sm:space-x-2 text-[8px] sm:text-[9.5px] font-black uppercase tracking-widest text-cyan-300 drop-shadow">
                  <span>★</span>
                  <span>128-BIT EMOTION ENGINE GRAND</span>
                  <span>★</span>
                </div>
                <div className="flex items-baseline text-white font-mono mt-0.5">
                  <span className="text-sm sm:text-base xl:text-xl font-black text-cyan-400 mr-1">$</span>
                  <span className="text-lg sm:text-xl xl:text-2xl font-black text-white drop-shadow-[0_0_15px_#00F0FF]">
                    {grand.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                  </span>
                </div>
              </div>

              {/* Right Pod (3 Cols): MagicGate Minor & i.LINK Mini */}
              <div
                onClick={handleJackpotClick}
                className="col-span-3 bg-gradient-to-b from-[#040a18] via-[#02050e] to-[#010206] border border-[#006FCD]/70 shadow-inner p-1 sm:p-1.5 flex flex-col justify-between cursor-pointer hover:border-cyan-300 transition-all relative overflow-hidden"
              >
                {/* Minor */}
                <div className="flex items-center justify-between">
                  <span className="text-[7px] sm:text-[8px] font-black text-[#A855F7] uppercase tracking-wider">
                    MINOR 8MB
                  </span>
                  <span className="text-[9px] sm:text-xs font-black text-purple-200 font-mono drop-shadow">
                    ${Math.floor(minor).toLocaleString()}
                  </span>
                </div>
                <div className="w-full h-px bg-white/10 my-0.5" />
                {/* Mini */}
                <div className="flex items-center justify-between">
                  <span className="text-[7px] sm:text-[8px] font-black text-emerald-400 uppercase tracking-wider">
                    MINI S400
                  </span>
                  <span className="text-[9px] sm:text-xs font-black text-emerald-200 font-mono drop-shadow">
                    ${Math.floor(mini).toLocaleString()}
                  </span>
                </div>
              </div>
            </div>

            {/* Sub-Strip: Live Retro Casino Broadcast Ticker */}
            <div className="mt-1">
              <RetroCasinoAdBanner activeGameId={activeGameId} />
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
      {/* Mobile Compact Top Box (< 640px): Chamfered Gold Ingot */}
      <div className="sm:hidden w-full px-0.5 py-0.5">
        <div
          onClick={handleJackpotClick}
          className="w-full h-11 px-3 bg-gradient-to-r from-amber-950 via-slate-950 to-amber-950 border-2 border-yellow-400 shadow-md flex items-center justify-between cursor-pointer"
          style={{
            clipPath: 'polygon(8px 0, calc(100% - 8px) 0, 100% 8px, 100% calc(100% - 8px), calc(100% - 8px) 100%, 8px 100%, 0 calc(100% - 8px), 0 8px)',
          }}
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
            <div className="px-1.5 py-0.5 bg-slate-950 border border-amber-500/50 text-[7.5px] font-mono font-bold text-amber-300 flex items-center space-x-0.5">
              <span>PSI</span>
              <span className="text-white font-black">{feverCharge}%</span>
            </div>
          </div>
        </div>
      </div>

      {/* Desktop / Tablet Heavy Armored Titanium & 24K Gold Bullion Ingot Pediment (>= 640px) */}
      <div className="hidden sm:block relative pt-0.5 sm:pt-1">
        {/* Radial Sunburst Gold Glow */}
        <div className="absolute -top-2 left-1/2 -translate-x-1/2 w-3/4 h-10 bg-gradient-to-t from-yellow-500/25 via-amber-500/10 to-transparent filter blur-md pointer-events-none" />

        {/* Monolithic Top Box Housing */}
        <div
          className="relative bg-gradient-to-b from-amber-600 via-yellow-700 to-amber-950 p-[2px] shadow-[0_8px_25px_rgba(0,0,0,0.9),0_0_20px_rgba(245,158,11,0.35)]"
          style={{
            clipPath: 'polygon(12px 0, calc(100% - 12px) 0, 100% 12px, 100% 100%, 0 100%, 0 12px)',
          }}
        >
          <div className="relative bg-gradient-to-b from-slate-950 via-casino-950 to-black p-1 sm:p-1.5">
            {/* Top Header: Molten Gold Reactor Gauge & High-Roller Mode Switches */}
            <div className="flex items-center justify-between px-1.5 mb-0.5 z-30 relative">
              {/* Left Switch: Bank View (Chamfered Brass Keycard) */}
              {onToggleFloorMode && (
                <button
                  onClick={onToggleFloorMode}
                  className={`flex items-center space-x-1 px-2.5 py-0.5 border text-[8px] sm:text-[9px] font-black uppercase shadow transition-all ${
                    isFloorMode
                      ? 'bg-gradient-to-r from-amber-500 to-yellow-300 text-amber-950 border-yellow-100 shadow-[0_0_10px_rgba(251,191,36,0.8)]'
                      : 'bg-casino-900 text-amber-300 border-amber-500 hover:border-yellow-300'
                  }`}
                  style={{
                    clipPath: 'polygon(5px 0, calc(100% - 5px) 0, 100% 5px, 100% calc(100% - 5px), calc(100% - 5px) 100%, 5px 100%, 0 calc(100% - 5px), 0 5px)',
                  }}
                  title="Toggle Multiplayer Casino Floor Bank"
                >
                  <Users className="w-2.5 h-2.5" />
                  <span>{isFloorMode ? 'BANK ON' : '★ BANK'}</span>
                </button>
              )}

              {/* Center: Molten Gold Reactor PSI Overdrive Bar */}
              <div
                className="flex-1 max-w-xs sm:max-w-sm mx-1.5 px-2 py-0.5 bg-slate-950 border border-yellow-500/80 shadow-inner flex items-center space-x-1.5"
                style={{
                  clipPath: 'polygon(6px 0, calc(100% - 6px) 0, 100% 50%, calc(100% - 6px) 100%, 6px 100%, 0 50%)',
                }}
              >
                <div className="flex items-center space-x-1 text-[8px] font-black text-amber-300 uppercase whitespace-nowrap pl-1">
                  <Flame className="w-2.5 h-2.5 text-red-500 fill-red-500 animate-pulse" />
                  <span className="hidden xs:inline">REACTOR:</span>
                  <span className="text-yellow-300 font-mono">{feverCharge}%</span>
                </div>
                <div className="flex-1 bg-black h-1.5 overflow-hidden p-0.5 border border-amber-500/40">
                  <div
                    className="h-full bg-gradient-to-r from-amber-600 via-yellow-400 to-yellow-200 shadow-[0_0_8px_#FDE047] transition-all duration-300"
                    style={{ width: `${feverCharge}%` }}
                  />
                </div>
                {isFeverActive && (
                  <span className="text-[8px] font-black text-yellow-300 animate-bounce pr-1">FEVER!</span>
                )}
              </div>

              {/* Right Switch: High Scores (Chamfered Brass Keycard) */}
              {onOpenLeaderboard && (
                <button
                  onClick={onOpenLeaderboard}
                  className="flex items-center space-x-1 px-2.5 py-0.5 bg-casino-900 hover:bg-casino-800 text-yellow-300 border border-yellow-400 hover:border-yellow-300 text-[8px] sm:text-[9px] font-black uppercase shadow transition-all"
                  style={{
                    clipPath: 'polygon(5px 0, calc(100% - 5px) 0, 100% 5px, 100% calc(100% - 5px), calc(100% - 5px) 100%, 5px 100%, 0 calc(100% - 5px), 0 5px)',
                  }}
                  title="View Vegas Server High Scores"
                >
                  <Trophy className="w-2.5 h-2.5 text-yellow-400 fill-yellow-400" />
                  <span>SCORES</span>
                </button>
              )}
            </div>

            {/* UNIFIED HORIZONTAL VAULT METERS DECK */}
            <div className="grid grid-cols-12 gap-1.5 items-stretch">
              {/* Left Column: MAJOR Amethyst Faceted Hexagonal Gem Cartouche */}
              <div
                onClick={handleJackpotClick}
                className="col-span-3 cursor-pointer group relative p-1 bg-gradient-to-b from-purple-950 via-slate-950 to-black border-2 border-purple-400 shadow-xl flex flex-col justify-center items-center hover:brightness-125 transition-all"
                style={{
                  clipPath: 'polygon(12px 0, calc(100% - 12px) 0, 100% 50%, calc(100% - 12px) 100%, 12px 100%, 0 50%)',
                }}
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

              {/* Center Column: GRAND JACKPOT Fort Knox 3D Gold Bullion Ingot Arch (HERO) */}
              <div
                onClick={handleJackpotClick}
                className="col-span-6 relative bg-gradient-to-r from-amber-950 via-black to-amber-950 border-2 border-yellow-400 shadow-2xl p-1 sm:p-1.5 flex items-center justify-between cursor-pointer group overflow-hidden"
                style={{
                  clipPath: 'polygon(14px 0, calc(100% - 14px) 0, 100% 14px, 100% calc(100% - 14px), calc(100% - 14px) 100%, 14px 100%, 0 calc(100% - 14px), 0 14px)',
                }}
              >
                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent animate-shimmer-sweep pointer-events-none" />

                {/* Left Revolving Combination Lock Pin Studs */}
                <div className="flex flex-col items-center space-y-1 z-10 flex-shrink-0 pl-1">
                  {[...Array(3)].map((_, i) => (
                    <div
                      key={i}
                      className="w-1.5 h-1.5 rounded-full bg-yellow-300 shadow-[0_0_6px_#FDE047] animate-pulse"
                      style={{ animationDuration: '500ms', animationDelay: `${i * 120}ms` }}
                    />
                  ))}
                </div>

                {/* Center Bullion Stamp & Jackpot Amount */}
                <div className="flex flex-col items-center z-10 mx-auto px-1 text-center">
                  <div className="flex items-center space-x-1 text-amber-300 text-[7px] sm:text-[8px] font-black uppercase tracking-widest">
                    <span>★ 999.9 FINE ★</span>
                    <Crown className="w-2.5 h-2.5 text-yellow-300 fill-yellow-300 animate-bounce" />
                    <span>{gameDef.theme.grandTitle}</span>
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

                {/* Right Revolving Combination Lock Pin Studs */}
                <div className="flex flex-col items-center space-y-1 z-10 flex-shrink-0 pr-1">
                  {[...Array(3)].map((_, i) => (
                    <div
                      key={i}
                      className="w-1.5 h-1.5 rounded-full bg-yellow-300 shadow-[0_0_6px_#FDE047] animate-pulse"
                      style={{ animationDuration: '500ms', animationDelay: `${(2 - i) * 120}ms` }}
                    />
                  ))}
                </div>
              </div>

              {/* Right Column: MINOR & MINI Chamfered Ingot Deck */}
              <div className="col-span-3 grid grid-cols-2 gap-1">
                {/* MINOR: Circular Rim Pressure Gauge */}
                <div
                  onClick={handleJackpotClick}
                  className="cursor-pointer group relative p-0.5 sm:p-1 bg-gradient-to-b from-cyan-950 via-slate-950 to-black border-2 border-cyan-400 shadow flex flex-col justify-center items-center hover:brightness-125 transition-all"
                  style={{
                    clipPath: 'polygon(6px 0, calc(100% - 6px) 0, 100% 6px, 100% calc(100% - 6px), calc(100% - 6px) 100%, 6px 100%, 0 calc(100% - 6px), 0 6px)',
                  }}
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

                {/* MINI: Stamped 24K Gold Ingot Plate */}
                <div
                  onClick={handleJackpotClick}
                  className="cursor-pointer group relative p-0.5 sm:p-1 bg-gradient-to-b from-amber-950 via-slate-950 to-black border-2 border-yellow-400 shadow flex flex-col justify-center items-center hover:brightness-125 transition-all"
                  style={{
                    clipPath: 'polygon(6px 0, calc(100% - 6px) 0, 100% 6px, 100% calc(100% - 6px), calc(100% - 6px) 100%, 6px 100%, 0 calc(100% - 6px), 0 6px)',
                  }}
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
