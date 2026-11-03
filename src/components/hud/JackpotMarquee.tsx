import React, { useState, useEffect } from 'react';
import { Crown, Gem, Coins, Sparkles, Trees, Users, Trophy, Flame } from 'lucide-react';
import { storage } from '../../utils/storage';
import { soundManager } from '../../audio/soundManager';
import type { GameId } from '../../games/types';
import { getGame } from '../../games/gameRegistry';

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
  freeSpinsRemaining = 0,
  feverCharge = 35,
  feverSpinsLeft = 0,
  isFloorMode = false,
  onToggleFloorMode,
  onOpenLeaderboard,
}) => {
  const isTimber = activeGameId === 'timber-critters';
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
    } else {
      soundManager.playGoldBarClank();
    }
  };

  const tickerText =
    freeSpinsRemaining > 0
      ? gameDef.theme.tickerFreeSpinsText
      : gameDef.theme.tickerText;

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
            className="w-full h-10 px-2 rounded-xl bg-gradient-to-r from-[#241308] via-[#120703] to-[#241308] border-2 border-[#a16207] shadow-md flex items-center justify-between cursor-pointer"
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
        <div className="hidden sm:block relative pt-1 sm:pt-1.5">
          {/* Ambient Warm Hearth Glow */}
          <div className="absolute -top-2 left-1/2 -translate-x-1/2 w-3/4 h-14 rounded-full bg-gradient-to-t from-amber-600/30 via-emerald-600/15 to-transparent filter blur-lg pointer-events-none" />

          {/* Roof Shingles & Log Trusses Container - Sleek Bounded Height (~88px - 96px) */}
          <div className="relative bg-gradient-to-b from-[#3b1d0c] via-[#241207] to-[#120703] border-2 sm:border-3 border-[#78350f] rounded-t-2xl sm:rounded-t-3xl rounded-b-xl shadow-[0_10px_30px_rgba(0,0,0,0.9),0_0_25px_rgba(16,185,129,0.3)] p-1.5 transition-transform duration-200">
            {/* Top Roof Peak: Nature's Fury Sap Branch & Trail Controls */}
            <div className="flex items-center justify-between px-2 mb-1 z-30 relative">
              {/* Left Trail Sign: Floor Bank Toggle */}
              {onToggleFloorMode && (
                <button
                  onClick={onToggleFloorMode}
                  className={`flex items-center space-x-1 px-2.5 py-0.5 rounded-full border text-[8.5px] sm:text-[9.5px] font-black uppercase shadow transition-all ${
                    isFloorMode
                      ? 'bg-gradient-to-r from-emerald-600 to-teal-500 text-white border-emerald-200 shadow-[0_0_10px_rgba(52,211,153,0.7)]'
                      : 'bg-[#261207] text-amber-200 border-[#a16207] hover:border-amber-400'
                  }`}
                  title="Toggle Camp Bank view"
                >
                  <Users className="w-3 h-3 text-amber-300" />
                  <span>{isFloorMode ? 'CAMP BANK ON' : '🌲 CAMP BANK'}</span>
                </button>
              )}

              {/* Center: Nature's Fury Birch Sap Meter */}
              <div className="flex-1 max-w-xs sm:max-w-sm mx-2 px-2.5 py-0.5 rounded-full bg-[#1c0c04] border border-[#a16207] shadow-inner flex items-center space-x-2">
                <div className="flex items-center space-x-1 text-[8.5px] font-black text-emerald-300 uppercase whitespace-nowrap">
                  <Trees className="w-3 h-3 text-emerald-400 animate-pulse" />
                  <span className="hidden xs:inline">SAP:</span>
                  <span className="text-amber-300 font-mono">{feverCharge}%</span>
                </div>
                <div className="flex-1 bg-black/80 h-1.5 rounded-full overflow-hidden p-0.5 border border-emerald-600/40">
                  <div
                    className="h-full rounded-full bg-gradient-to-r from-emerald-500 via-teal-400 to-amber-300 shadow-[0_0_6px_#34D399] transition-all duration-300"
                    style={{ width: `${feverCharge}%` }}
                  />
                </div>
                {isFeverActive && (
                  <span className="text-[8.5px] font-black text-amber-300 animate-bounce">2X!</span>
                )}
              </div>

              {/* Right Trail Sign: Leaderboard */}
              {onOpenLeaderboard && (
                <button
                  onClick={onOpenLeaderboard}
                  className="flex items-center space-x-1 px-2.5 py-0.5 rounded-full bg-[#261207] hover:bg-[#3b1d0c] text-amber-200 border border-[#a16207] hover:border-amber-400 text-[8.5px] sm:text-[9.5px] font-black uppercase shadow transition-all"
                  title="View Forest Hall of Fame"
                >
                  <Trophy className="w-3 h-3 text-yellow-400 fill-yellow-400" />
                  <span>HALL OF FAME</span>
                </button>
              )}
            </div>

            {/* UNIFIED HORIZONTAL CEDAR LODGE JACKPOT DECK */}
            <div className="grid grid-cols-12 gap-1.5 items-stretch">
              {/* Left Column: MAJOR Timber Wolf Plaque */}
              <div
                onClick={handleJackpotClick}
                className="col-span-3 cursor-pointer group relative p-1 sm:p-1.5 rounded-xl bg-gradient-to-b from-[#2e180e] via-[#1a0c05] to-black border border-[#b45309] shadow flex flex-col justify-center items-center hover:scale-[1.02] transition-transform"
              >
                <div className="flex items-center space-x-1">
                  <span className="text-xs">🐺</span>
                  <span className="text-[7.5px] sm:text-[8.5px] font-black uppercase text-teal-300 tracking-wider">
                    {gameDef.theme.majorTitle}
                  </span>
                </div>
                <div className="flex items-baseline font-mono text-xs sm:text-sm md:text-base font-black text-teal-200 drop-shadow-[0_0_8px_#2DD4BF] mt-0.5">
                  <span>${Math.floor(major).toLocaleString()}</span>
                  <span className="text-[9px] text-teal-400/80">.{(major % 1).toFixed(2).slice(2)}</span>
                </div>
              </div>

              {/* Center Column: GRAND JACKPOT Hollowed Cedar Log (HERO) */}
              <div
                onClick={handleJackpotClick}
                className="col-span-6 relative rounded-xl bg-gradient-to-r from-[#170a04] via-[#0b1f13] to-[#170a04] border-2 border-[#a16207] shadow-inner p-1 sm:p-1.5 flex items-center justify-between cursor-pointer group overflow-hidden"
              >
                <div className="w-7 h-7 sm:w-8 sm:h-8 rounded-full bg-[#2e180e] border border-amber-400/80 shadow-[0_0_8px_rgba(245,158,11,0.7)] flex items-center justify-center text-sm sm:text-base animate-bounce flex-shrink-0">
                  🐻
                </div>

                <div className="flex flex-col items-center z-10 mx-auto px-1 text-center">
                  <div className="flex items-center space-x-1 text-amber-300 text-[8px] sm:text-[9px] font-black uppercase tracking-widest">
                    <span>🌲 {gameDef.theme.grandTitle} 🌲</span>
                  </div>
                  <div className="flex items-baseline font-mono">
                    <span className="text-xs sm:text-sm font-black text-amber-400 mr-0.5">$</span>
                    <span className="text-xl sm:text-3xl md:text-4xl font-black tracking-tight leading-none text-emerald-200 drop-shadow-[0_0_15px_rgba(52,211,153,1)]">
                      {Math.floor(grand).toLocaleString()}
                    </span>
                    <span className="text-[10px] sm:text-xs font-bold text-emerald-400/90 ml-0.5">
                      .{(grand % 1).toFixed(2).slice(2)}
                    </span>
                  </div>
                </div>

                <div className="w-7 h-7 sm:w-8 sm:h-8 rounded-full bg-[#182a1d] border border-emerald-400/80 shadow-[0_0_8px_rgba(52,211,153,0.7)] flex items-center justify-center text-sm sm:text-base animate-pulse flex-shrink-0">
                  🦉
                </div>
              </div>

              {/* Right Column: MINOR & MINI Split Totem Plaque */}
              <div className="col-span-3 grid grid-cols-2 gap-1">
                {/* MINOR */}
                <div
                  onClick={handleJackpotClick}
                  className="cursor-pointer group relative p-1 rounded-xl bg-gradient-to-b from-[#2e180e] via-[#1a0c05] to-black border border-[#b45309] shadow flex flex-col justify-center items-center hover:scale-[1.02] transition-transform"
                >
                  <div className="flex items-center space-x-0.5">
                    <span className="text-[10px]">🦊</span>
                    <span className="text-[7px] sm:text-[8px] font-black uppercase text-amber-300 tracking-wider">
                      {gameDef.theme.minorTitle}
                    </span>
                  </div>
                  <div className="flex items-baseline font-mono text-[10px] sm:text-xs md:text-sm font-black text-amber-200 drop-shadow-[0_0_6px_#FBBF24]">
                    <span>${Math.floor(minor).toLocaleString()}</span>
                  </div>
                </div>

                {/* MINI */}
                <div
                  onClick={handleJackpotClick}
                  className="cursor-pointer group relative p-1 rounded-xl bg-gradient-to-b from-[#2e180e] via-[#1a0c05] to-black border border-[#b45309] shadow flex flex-col justify-center items-center hover:scale-[1.02] transition-transform"
                >
                  <div className="flex items-center space-x-0.5">
                    <span className="text-[10px]">🐿️</span>
                    <span className="text-[7px] sm:text-[8px] font-black uppercase text-emerald-300 tracking-wider">
                      {gameDef.theme.miniTitle}
                    </span>
                  </div>
                  <div className="flex items-baseline font-mono text-[10px] sm:text-xs md:text-sm font-black text-emerald-200 drop-shadow-[0_0_6px_#34D399]">
                    <span>${Math.floor(mini).toLocaleString()}</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Cross-Cut Cedar Beam Ticker Ribbon Across Bottom of Gable */}
            <div className="mt-1 rounded-lg bg-[#08180e] border border-emerald-600/40 px-2 py-0.5 flex items-center overflow-hidden">
              <div className="flex items-center space-x-1 pr-1.5 border-r border-emerald-700/60 flex-shrink-0 text-[8px] font-black text-emerald-300 uppercase whitespace-nowrap">
                <Trees className="w-2.5 h-2.5 text-emerald-400 animate-pulse" />
                <span>FOREST TICKER</span>
              </div>
              <div className="flex-1 overflow-hidden whitespace-nowrap ml-1.5 relative">
                <div className="inline-block animate-marquee-text font-mono text-[9px] sm:text-[10px] font-bold text-emerald-200 drop-shadow-[0_0_4px_rgba(52,211,153,0.8)]">
                  {tickerText}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // =========================================================================
  // --- VERSION B: 24K VAULT (FORT KNOX HIGH-ROLLER GOLD BULLION TOP BOX) ---
  // =========================================================================
  return (
    <div className="w-full max-w-5xl xl:max-w-6xl 2xl:max-w-7xl mx-auto px-1 sm:px-2 mb-0.5 sm:mb-1 select-none flex-shrink-0 z-20">
      {/* Mobile Compact Top Box (< 640px) */}
      <div className="sm:hidden w-full px-0.5 py-0.5">
        <div
          onClick={handleJackpotClick}
          className="w-full h-10 px-2 rounded-xl bg-gradient-to-r from-amber-950 via-slate-950 to-amber-950 border-2 border-yellow-400/80 shadow-md flex items-center justify-between cursor-pointer"
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
      <div className="hidden sm:block relative pt-1 sm:pt-1.5">
        {/* Radial Sunburst Gold Glow */}
        <div className="absolute -top-2 left-1/2 -translate-x-1/2 w-3/4 h-14 rounded-full bg-gradient-to-t from-yellow-500/30 via-amber-500/15 to-transparent filter blur-lg pointer-events-none" />

        {/* Monolithic Top Box Housing - Sleek Bounded Height (~88px - 96px) */}
        <div className="relative bg-gradient-to-b from-amber-600 via-yellow-700 to-amber-950 p-[2px] rounded-t-2xl sm:rounded-t-3xl rounded-b-xl shadow-[0_10px_30px_rgba(0,0,0,0.9),0_0_25px_rgba(245,158,11,0.4)]">
          <div className="relative bg-gradient-to-b from-slate-950 via-casino-950 to-black rounded-t-[22px] sm:rounded-t-[30px] rounded-b-lg p-1.5">
            {/* Top Header: Molten Gold Reactor Gauge & High-Roller Mode Switches */}
            <div className="flex items-center justify-between px-2 mb-1 z-30 relative">
              {/* Left Switch: Bank View */}
              {onToggleFloorMode && (
                <button
                  onClick={onToggleFloorMode}
                  className={`flex items-center space-x-1 px-2.5 py-0.5 rounded-full border text-[8.5px] sm:text-[9.5px] font-black uppercase shadow transition-all ${
                    isFloorMode
                      ? 'bg-gradient-to-r from-amber-500 to-yellow-300 text-amber-950 border-yellow-100 shadow-[0_0_10px_rgba(251,191,36,0.8)]'
                      : 'bg-casino-900 text-amber-300 border-amber-500/60 hover:border-yellow-300'
                  }`}
                  title="Toggle Multiplayer Casino Floor Bank"
                >
                  <Users className="w-3 h-3" />
                  <span>{isFloorMode ? 'CASINO BANK ACTIVE' : '★ BANK VIEW'}</span>
                </button>
              )}

              {/* Center: Molten Gold Reactor PSI Overdrive Bar */}
              <div className="flex-1 max-w-xs sm:max-w-sm mx-2 px-2.5 py-0.5 rounded-full bg-slate-950 border border-yellow-500/60 shadow-inner flex items-center space-x-2">
                <div className="flex items-center space-x-1 text-[8.5px] font-black text-amber-300 uppercase whitespace-nowrap">
                  <Flame className="w-3 h-3 text-red-500 fill-red-500 animate-pulse" />
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
                  <span className="text-[8.5px] font-black text-yellow-300 animate-bounce">FEVER!</span>
                )}
              </div>

              {/* Right Switch: High Scores */}
              {onOpenLeaderboard && (
                <button
                  onClick={onOpenLeaderboard}
                  className="flex items-center space-x-1 px-2.5 py-0.5 rounded-full bg-casino-900 hover:bg-casino-800 text-yellow-300 border border-yellow-400/60 hover:border-yellow-300 text-[8.5px] sm:text-[9.5px] font-black uppercase shadow transition-all"
                  title="View Vegas Server High Scores"
                >
                  <Trophy className="w-3 h-3 text-yellow-400 fill-yellow-400" />
                  <span>HIGH SCORES</span>
                </button>
              )}
            </div>

            {/* UNIFIED HORIZONTAL VAULT METERS DECK */}
            <div className="grid grid-cols-12 gap-1.5 items-stretch">
              {/* Left Column: MAJOR Amethyst Meter */}
              <div
                onClick={handleJackpotClick}
                className="col-span-3 cursor-pointer group relative p-1 sm:p-1.5 rounded-xl bg-gradient-to-b from-purple-950 via-slate-950 to-black border border-purple-400/70 shadow flex flex-col justify-center items-center hover:scale-[1.02] transition-transform"
              >
                <div className="flex items-center space-x-1">
                  <Gem className="w-3 h-3 text-purple-300" />
                  <span className="text-[7.5px] sm:text-[8.5px] font-black uppercase text-purple-300 tracking-wider">
                    {gameDef.theme.majorTitle}
                  </span>
                </div>
                <div className="flex items-baseline font-mono text-xs sm:text-sm md:text-base font-black text-purple-200 drop-shadow-[0_0_8px_#D8B4FE] mt-0.5">
                  <span>${Math.floor(major).toLocaleString()}</span>
                  <span className="text-[9px] text-purple-400/80">.{(major % 1).toFixed(2).slice(2)}</span>
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
                      className="w-1.5 sm:w-2 h-1.5 sm:h-2 rounded-full bg-yellow-300 shadow-[0_0_6px_#FDE047] animate-pulse"
                      style={{ animationDuration: '500ms', animationDelay: `${i * 120}ms` }}
                    />
                  ))}
                </div>

                <div className="flex flex-col items-center z-10 mx-auto px-1 text-center">
                  <div className="flex items-center space-x-1 text-amber-300 text-[8px] sm:text-[9px] font-black uppercase tracking-widest">
                    <Crown className="w-3 h-3 text-yellow-300 fill-yellow-300 animate-bounce" />
                    <span>★ {gameDef.theme.grandTitle} ★</span>
                    <Sparkles className="w-3 h-3 text-yellow-300" />
                  </div>
                  <div className="flex items-baseline font-mono">
                    <span className="text-xs sm:text-sm font-black text-amber-400 mr-0.5">$</span>
                    <span className="text-xl sm:text-3xl md:text-4xl font-black tracking-tight leading-none text-yellow-300 drop-shadow-[0_0_15px_rgba(253,224,71,1)]">
                      {Math.floor(grand).toLocaleString()}
                    </span>
                    <span className="text-[10px] sm:text-xs font-bold text-amber-400/90 ml-0.5">
                      .{(grand % 1).toFixed(2).slice(2)}
                    </span>
                  </div>
                </div>

                <div className="flex items-center space-x-1 z-10 flex-shrink-0">
                  {[...Array(3)].map((_, i) => (
                    <div
                      key={i}
                      className="w-1.5 sm:w-2 h-1.5 sm:h-2 rounded-full bg-yellow-300 shadow-[0_0_6px_#FDE047] animate-pulse"
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
                  className="cursor-pointer group relative p-1 rounded-xl bg-gradient-to-b from-cyan-950 via-slate-950 to-black border border-cyan-400/70 shadow flex flex-col justify-center items-center hover:scale-[1.02] transition-transform"
                >
                  <div className="flex items-center space-x-0.5">
                    <Coins className="w-2.5 h-2.5 text-cyan-300" />
                    <span className="text-[7px] sm:text-[8px] font-black uppercase text-cyan-300 tracking-wider">
                      {gameDef.theme.minorTitle}
                    </span>
                  </div>
                  <div className="flex items-baseline font-mono text-[10px] sm:text-xs md:text-sm font-black text-cyan-200 drop-shadow-[0_0_6px_#67E8F9]">
                    <span>${Math.floor(minor).toLocaleString()}</span>
                  </div>
                </div>

                {/* MINI */}
                <div
                  onClick={handleJackpotClick}
                  className="cursor-pointer group relative p-1 rounded-xl bg-gradient-to-b from-amber-950 via-slate-950 to-black border border-yellow-400/70 shadow flex flex-col justify-center items-center hover:scale-[1.02] transition-transform"
                >
                  <div className="flex items-center space-x-0.5">
                    <Crown className="w-2.5 h-2.5 text-yellow-300" />
                    <span className="text-[7px] sm:text-[8px] font-black uppercase text-yellow-300 tracking-wider">
                      {gameDef.theme.miniTitle}
                    </span>
                  </div>
                  <div className="flex items-baseline font-mono text-[10px] sm:text-xs md:text-sm font-black text-yellow-200 drop-shadow-[0_0_6px_#FDE047]">
                    <span>${Math.floor(mini).toLocaleString()}</span>
                  </div>
                </div>
              </div>
            </div>

            {/* High-Roller Gold-Bezeled LED Ticker Ribbon Across Bottom */}
            <div className="mt-1 rounded-lg bg-slate-950 border border-yellow-500/40 px-2 py-0.5 flex items-center overflow-hidden">
              <div className="flex items-center space-x-1 pr-1.5 border-r border-yellow-500/40 flex-shrink-0 text-[8px] font-black text-yellow-300 uppercase whitespace-nowrap">
                <Coins className="w-2.5 h-2.5 text-yellow-400 animate-pulse" />
                <span>CASH TICKER</span>
              </div>
              <div className="flex-1 overflow-hidden whitespace-nowrap ml-1.5 relative">
                <div className="inline-block animate-marquee-text font-mono text-[9px] sm:text-[10px] font-bold text-amber-300 drop-shadow-[0_0_4px_rgba(251,191,36,0.8)]">
                  {tickerText}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
