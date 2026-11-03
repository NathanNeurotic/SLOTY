import React, { useState, useEffect } from 'react';
import { Crown, Gem, Coins, Shield, Sparkles, Trees } from 'lucide-react';
import { storage } from '../../utils/storage';
import { soundManager } from '../../audio/soundManager';
import type { GameId } from '../../games/types';
import { getGame } from '../../games/gameRegistry';

interface JackpotMarqueeProps {
  totalBet: number;
  activeGameId?: GameId;
}

export const JackpotMarquee: React.FC<JackpotMarqueeProps> = ({
  totalBet,
  activeGameId = 'vault-24k',
}) => {
  const isTimber = activeGameId === 'timber-critters';
  const gameDef = getGame(activeGameId);

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

  return (
    <div className="w-full max-w-4xl mx-auto px-1 sm:px-3 mb-1 sm:mb-2 select-none flex-shrink-0">
      {/* Mobile Ultra-Compact Jackpot Ribbon (Height 28px, saves 110px on phones) */}
      <div
        onClick={handleJackpotClick}
        className={`sm:hidden w-full border rounded-xl px-2 py-1 shadow-md flex items-center justify-between text-[9px] font-mono cursor-pointer ${
          isTimber
            ? 'bg-gradient-to-r from-emerald-950 via-[#0a180e] to-emerald-950 border-emerald-500/60 shadow-[0_0_12px_rgba(16,185,129,0.3)]'
            : 'bg-gradient-to-r from-amber-950 via-casino-950 to-amber-950 border-yellow-400/60'
        }`}
        title={isTimber ? 'Grizzly Peak Progressive Jackpots' : 'Fort Knox Progressive Jackpots'}
      >
        <div className="flex items-center space-x-1">
          {isTimber ? (
            <Trees className="w-3 h-3 text-emerald-300 flex-shrink-0" />
          ) : (
            <Crown className="w-3 h-3 text-yellow-300 fill-yellow-300 animate-pulse flex-shrink-0" />
          )}
          <span className={`font-sans font-black text-[8px] ${isTimber ? 'text-emerald-300' : 'text-amber-400'}`}>
            {isTimber ? 'GRIZZLY' : 'GRAND'}
          </span>
          <span className={`font-bold leading-none ${isTimber ? 'text-emerald-100' : 'text-yellow-200'}`}>
            ${Math.floor(grand).toLocaleString()}
          </span>
        </div>
        <div className="h-3 w-px bg-white/15" />
        <div className="flex items-center space-x-1">
          <Gem className={`w-2.5 h-2.5 flex-shrink-0 ${isTimber ? 'text-teal-300' : 'text-purple-300'}`} />
          <span className={`font-sans font-black text-[8px] ${isTimber ? 'text-teal-300' : 'text-purple-300'}`}>
            {isTimber ? 'WOLF' : 'MAJ'}
          </span>
          <span className={`font-bold leading-none ${isTimber ? 'text-teal-100' : 'text-purple-200'}`}>
            ${Math.floor(major).toLocaleString()}
          </span>
        </div>
        <div className="h-3 w-px bg-white/15" />
        <div className="flex items-center space-x-1">
          <Coins className={`w-2.5 h-2.5 flex-shrink-0 ${isTimber ? 'text-amber-300' : 'text-cyan-300'}`} />
          <span className={`font-sans font-black text-[8px] ${isTimber ? 'text-amber-300' : 'text-cyan-300'}`}>
            {isTimber ? 'FOX' : 'MIN'}
          </span>
          <span className={`font-bold leading-none ${isTimber ? 'text-amber-100' : 'text-cyan-200'}`}>
            ${Math.floor(minor).toLocaleString()}
          </span>
        </div>
      </div>

      {/* Desktop Full 3D Sculptural Centerpiece & Pods */}
      <div className="hidden sm:flex relative flex-col items-center">
        {/* ========================================================================= */}
        {/* 1. TOWERING CENTERPIECE: TIMBER CABIN GABLE vs FORT KNOX VAULT MARQUEE   */}
        {/* ========================================================================= */}
        <div
          onClick={handleJackpotClick}
          className="relative w-full max-w-xl mx-auto z-20 cursor-pointer group"
          title={`${gameDef.theme.grandTitle} - Click for Audio`}
        >
          {isTimber ? (
            /* --- TIMBERLAND: Handcrafted Mountain Lodge Log Cabin Gable with Art Glass --- */
            <div className="relative pt-2">
              {/* Warm Forest Fireplace / Lantern Glow */}
              <div className="absolute -top-2 left-1/2 -translate-x-1/2 w-96 h-16 rounded-full bg-gradient-to-t from-amber-600/30 via-emerald-600/20 to-transparent filter blur-xl pointer-events-none" />

              {/* A-Frame Log Cabin Gable Truss */}
              <div className="relative bg-gradient-to-b from-[#451a03] via-[#2e180e] to-[#1a0d07] border-4 border-[#78350f] rounded-t-[32px] rounded-b-xl shadow-[0_12px_35px_rgba(0,0,0,0.95),0_0_30px_rgba(16,185,129,0.3)] p-1.5 transition-transform duration-200 group-hover:scale-[1.01]">
                {/* Carved Pine Crest Signboard */}
                <div className="absolute -top-3.5 left-1/2 -translate-x-1/2 flex items-center justify-center space-x-2 px-5 py-0.5 rounded-full bg-gradient-to-r from-[#2e180e] via-[#5c2b09] to-[#2e180e] border-2 border-amber-400 text-amber-200 shadow-[0_4px_12px_rgba(0,0,0,0.9)] z-30">
                  <Trees className="w-3.5 h-3.5 text-emerald-400" />
                  <span className="text-[9px] sm:text-[10px] font-black uppercase tracking-widest font-sans whitespace-nowrap text-amber-200 drop-shadow-[0_1px_2px_rgba(0,0,0,0.9)]">
                    🌲 {gameDef.theme.grandTitle} 🌲
                  </span>
                  <span className="text-xs">🌰</span>
                </div>

                {/* Backlit Illustrated Woodland Art Glass Marquee */}
                <div className="relative w-full h-10 sm:h-12 rounded-t-[26px] bg-gradient-to-r from-[#0d2818] via-[#051a0e] to-[#0d2818] border-b-2 border-[#78350f] flex items-center justify-between px-3 sm:px-6 overflow-hidden">
                  {/* Glowing Moon & Forest Trees in Background */}
                  <div className="absolute inset-0 opacity-40 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-emerald-400 via-transparent to-transparent pointer-events-none" />
                  <div className="absolute top-1 left-1/2 -translate-x-1/2 w-16 h-16 rounded-full bg-yellow-200/20 blur-md pointer-events-none" />

                  {/* Left Critters: Grizzly Gus & Owl */}
                  <div className="flex items-center space-x-2 z-10">
                    <div className="w-9 h-9 sm:w-11 sm:h-11 rounded-full bg-[#3b1d0c] border-2 border-amber-400/80 shadow-[0_0_10px_rgba(245,158,11,0.6)] flex items-center justify-center text-xl sm:text-2xl animate-bounce">
                      🐻
                    </div>
                    <div className="hidden xs:flex flex-col text-left">
                      <span className="text-[10px] font-black text-amber-300 leading-tight">GRIZZLY GUS</span>
                      <span className="text-[8px] font-bold text-emerald-400/80">LODGE MASCOT</span>
                    </div>
                  </div>

                  {/* Center Thematic Title Art */}
                  <div className="flex flex-col items-center z-10 text-center">
                    <div className="flex items-center space-x-1.5">
                      <span className="text-xs sm:text-sm">🦉</span>
                      <span className="text-xs sm:text-sm md:text-base font-black tracking-wider uppercase bg-gradient-to-r from-amber-300 via-yellow-200 to-amber-400 bg-clip-text text-transparent drop-shadow-[0_2px_4px_rgba(0,0,0,0.9)] font-sans">
                        TIMBERLAND CRITTERS
                      </span>
                      <span className="text-xs sm:text-sm">🐿️</span>
                    </div>
                    <span className="text-[8px] sm:text-[9px] font-bold tracking-widest uppercase text-emerald-300 drop-shadow-[0_1px_2px_rgba(0,0,0,0.8)]">
                      ★ FOREST HARVEST VIDEO LOTTERY ★
                    </span>
                  </div>

                  {/* Right Critters: Clever Fox & Squirrel */}
                  <div className="flex items-center space-x-2 z-10">
                    <div className="hidden xs:flex flex-col text-right">
                      <span className="text-[10px] font-black text-amber-300 leading-tight">MYSTIC OWLS</span>
                      <span className="text-[8px] font-bold text-teal-300/80">FREE SPINS</span>
                    </div>
                    <div className="w-9 h-9 sm:w-11 sm:h-11 rounded-full bg-[#182a1d] border-2 border-emerald-400/80 shadow-[0_0_10px_rgba(52,211,153,0.6)] flex items-center justify-center text-xl sm:text-2xl animate-pulse">
                      🦊
                    </div>
                  </div>
                </div>

                {/* Log Cabin Interior Chamber: Digital Jackpots */}
                <div className="relative bg-gradient-to-b from-[#120703] via-[#08140c] to-[#040805] rounded-b-lg px-4 sm:px-6 pt-2 pb-2 border-t-2 border-[#b45309]/50 flex items-center justify-between overflow-hidden">
                  {/* Left Rustic Lantern Sconce */}
                  <div className="flex items-center space-x-1.5 z-10 flex-shrink-0">
                    <div className="w-6 h-7 rounded-md bg-[#2e180e] border border-amber-500/70 shadow-[0_0_12px_rgba(245,158,11,0.8)] flex items-center justify-center relative overflow-hidden">
                      <div className="w-2.5 h-3 rounded-full bg-amber-400 animate-pulse shadow-[0_0_8px_#F59E0B]" />
                      <div className="absolute -top-0.5 w-3 h-1 bg-[#78350f] rounded-t" />
                    </div>
                    <div className="flex flex-col space-y-1">
                      <div className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-ping shadow-[0_0_6px_#34D399]" />
                      <div className="w-1.5 h-1.5 rounded-full bg-amber-400 shadow-[0_0_6px_#FBBF24]" />
                    </div>
                  </div>

                  {/* Center: Chiseled Cedar Log Readout */}
                  <div className="flex flex-col items-center z-10 mx-auto px-2">
                    <div className="flex items-baseline font-mono">
                      <span className="text-sm sm:text-lg font-black text-amber-400 mr-1">$</span>
                      <span className="text-xl sm:text-3xl md:text-4xl font-black tracking-tight leading-none text-emerald-200 drop-shadow-[0_0_20px_rgba(52,211,153,1)]">
                        {Math.floor(grand).toLocaleString()}
                      </span>
                      <span className="text-xs sm:text-lg font-bold text-emerald-400/90 ml-0.5">
                        .{(grand % 1).toFixed(2).slice(2)}
                      </span>
                    </div>
                    <span className="text-[8px] font-bold uppercase tracking-widest text-amber-300/80 mt-0.5">
                      MOUNTAIN LODGE FOREST PROGRESSIVE
                    </span>
                  </div>

                  {/* Right Rustic Lantern Sconce */}
                  <div className="flex items-center space-x-1.5 z-10 flex-shrink-0">
                    <div className="flex flex-col space-y-1">
                      <div className="w-1.5 h-1.5 rounded-full bg-amber-400 shadow-[0_0_6px_#FBBF24]" />
                      <div className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-ping shadow-[0_0_6px_#34D399]" />
                    </div>
                    <div className="w-6 h-7 rounded-md bg-[#2e180e] border border-amber-500/70 shadow-[0_0_12px_rgba(245,158,11,0.8)] flex items-center justify-center relative overflow-hidden">
                      <div className="w-2.5 h-3 rounded-full bg-amber-400 animate-pulse shadow-[0_0_8px_#F59E0B]" />
                      <div className="absolute -top-0.5 w-3 h-1 bg-[#78350f] rounded-t" />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ) : (
            /* --- 24K VAULT: Fort Knox Armored Bank Vault Marquee with Art Glass --- */
            <div className="relative pt-2">
              {/* Radial Golden Sunburst Glow */}
              <div className="absolute -top-3 left-1/2 -translate-x-1/2 w-80 h-16 rounded-full bg-gradient-to-t from-yellow-500/30 to-transparent filter blur-lg pointer-events-none" />

              {/* Armored Titanium & Solid Gold Bullion Pediment Frame */}
              <div className="relative p-[3px] rounded-t-[38px] rounded-b-xl bg-gradient-to-b from-amber-300 via-yellow-600 to-amber-950 shadow-[0_10px_35px_rgba(245,158,11,0.7)] group-hover:scale-[1.01] transition-transform duration-200">
                {/* Fort Knox Bullion Crest Cap */}
                <div className="absolute -top-3.5 left-1/2 -translate-x-1/2 flex items-center justify-center space-x-2 px-5 py-0.5 rounded-full bg-gradient-to-r from-amber-700 via-yellow-300 to-amber-700 border-2 border-yellow-100 text-amber-950 shadow-[0_4px_12px_rgba(0,0,0,0.9)] z-30">
                  <Crown className="w-3.5 h-3.5 text-amber-950 fill-amber-950 animate-bounce" />
                  <span className="text-[9px] sm:text-[10px] font-black uppercase tracking-widest font-sans whitespace-nowrap">
                    ★ {gameDef.theme.grandTitle} ★
                  </span>
                  <Sparkles className="w-3.5 h-3.5 text-amber-950" />
                </div>

                {/* Backlit Illustrated Fort Knox Bullion Glass Marquee */}
                <div className="relative w-full h-10 sm:h-12 rounded-t-[34px] bg-gradient-to-r from-amber-950 via-black to-amber-950 border-b-2 border-yellow-400/40 flex items-center justify-between px-3 sm:px-6 overflow-hidden">
                  {/* Laser Security Grid Rays */}
                  <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-amber-500/25 via-transparent to-transparent pointer-events-none" />

                  {/* Left Bullion Ingot Stacks */}
                  <div className="flex items-center space-x-2 z-10">
                    <div className="w-9 h-9 sm:w-11 sm:h-11 rounded-full bg-gradient-to-tr from-amber-600 to-yellow-300 border-2 border-yellow-100 shadow-[0_0_12px_rgba(245,158,11,0.8)] flex items-center justify-center text-lg sm:text-xl animate-pulse">
                      💰
                    </div>
                    <div className="hidden xs:flex flex-col text-left">
                      <span className="text-[10px] font-black text-yellow-300 leading-tight">.999 FINE GOLD</span>
                      <span className="text-[8px] font-bold text-amber-400/80">FORT KNOX LINK</span>
                    </div>
                  </div>

                  {/* Center High-Roller Title Art */}
                  <div className="flex flex-col items-center z-10 text-center">
                    <div className="flex items-center space-x-1.5">
                      <span className="text-xs sm:text-sm">💎</span>
                      <span className="text-xs sm:text-sm md:text-base font-black tracking-wider uppercase bg-gradient-to-r from-yellow-200 via-amber-300 to-yellow-100 bg-clip-text text-transparent drop-shadow-[0_2px_4px_rgba(0,0,0,0.9)] font-sans">
                        24K GOLD &amp; CASH VAULT
                      </span>
                      <span className="text-xs sm:text-sm">💎</span>
                    </div>
                    <span className="text-[8px] sm:text-[9px] font-bold tracking-widest uppercase text-yellow-400 drop-shadow-[0_1px_2px_rgba(0,0,0,0.8)]">
                      ★ 40 PAYLINES • HIGH ROLLER EDITION ★
                    </span>
                  </div>

                  {/* Right Diamond / Vault Dial */}
                  <div className="flex items-center space-x-2 z-10">
                    <div className="hidden xs:flex flex-col text-right">
                      <span className="text-[10px] font-black text-cyan-300 leading-tight">CASH VAULT</span>
                      <span className="text-[8px] font-bold text-cyan-400/80">HOLD &amp; SPIN</span>
                    </div>
                    <div className="w-9 h-9 sm:w-11 sm:h-11 rounded-full bg-gradient-to-tr from-cyan-600 to-teal-400 border-2 border-cyan-200 shadow-[0_0_12px_rgba(6,182,212,0.8)] flex items-center justify-center text-lg sm:text-xl animate-pulse">
                      🔒
                    </div>
                  </div>
                </div>

                {/* Armored Bank Vault Digital Glass Chamber: Jackpots */}
                <div className="relative rounded-b-lg px-4 sm:px-6 pt-2 pb-2 bg-gradient-to-b from-red-950/95 via-black to-slate-950 border-t border-yellow-300/40 flex items-center justify-between overflow-hidden">
                  {/* Metallic Shimmer Sweep */}
                  <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-full animate-shimmer-sweep pointer-events-none" />

                  {/* Left Chasing Gold Bulbs */}
                  <div className="flex items-center space-x-1.5 z-10 flex-shrink-0">
                    {[...Array(4)].map((_, i) => (
                      <div
                        key={i}
                        className="w-2 sm:w-2.5 h-2 sm:h-2.5 rounded-full bg-yellow-300 shadow-[0_0_8px_#FCD34D] animate-pulse"
                        style={{ animationDuration: '600ms', animationDelay: `${i * 150}ms` }}
                      />
                    ))}
                  </div>

                  {/* Center: Glowing Digital 7-Segment Readout */}
                  <div className="flex flex-col items-center z-10 mx-auto px-2">
                    <div className="flex items-baseline font-mono">
                      <span className="text-sm sm:text-base font-black text-amber-400 mr-1">$</span>
                      <span className="text-xl sm:text-3xl md:text-4xl font-black tracking-tight leading-none text-yellow-300 drop-shadow-[0_0_18px_rgba(253,224,71,1)]">
                        {Math.floor(grand).toLocaleString()}
                      </span>
                      <span className="text-xs sm:text-lg font-bold text-amber-400/90 ml-0.5">
                        .{(grand % 1).toFixed(2).slice(2)}
                      </span>
                    </div>
                    <span className="text-[8px] font-bold uppercase tracking-widest text-amber-400/80 mt-0.5">
                      LAS VEGAS HIGH-ROLLER PROGRESSIVE
                    </span>
                  </div>

                  {/* Right Chasing Gold Bulbs */}
                  <div className="flex items-center space-x-1.5 z-10 flex-shrink-0">
                    {[...Array(4)].map((_, i) => (
                      <div
                        key={i}
                        className="w-2 sm:w-2.5 h-2 sm:h-2.5 rounded-full bg-yellow-300 shadow-[0_0_8px_#FCD34D] animate-pulse"
                        style={{ animationDuration: '600ms', animationDelay: `${(3 - i) * 150}ms` }}
                      />
                    ))}
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* ========================================================================= */}
        {/* 2. THREE SCULPTURAL THEMED PODS (ASYMMETRIC TIMBER TOTEMS / VAULT PODS)     */}
        {/* ========================================================================= */}
        <div className={`w-full mt-1.5 sm:mt-2 z-10 ${
          isTimber ? 'flex items-start justify-between gap-1.5 sm:gap-3' : 'grid grid-cols-3 gap-1.5 sm:gap-3'
        }`}>
          {/* MAJOR (TIMBER WOLF: Tilted -3deg hanging on iron chains) */}
          <div
            onClick={handleJackpotClick}
            className={`relative cursor-pointer group flex flex-col items-center flex-1 ${
              isTimber ? 'transform -rotate-2 sm:-rotate-3 mt-1' : ''
            }`}
            title={`${gameDef.theme.majorTitle} - Click for Audio`}
          >
            {/* Hanging Iron Chain Links for Timberland */}
            {isTimber && (
              <div className="flex space-x-8 mb-0.5 pointer-events-none">
                <div className="w-1.5 h-3 border border-slate-600 rounded-full bg-slate-800" />
                <div className="w-1.5 h-3 border border-slate-600 rounded-full bg-slate-800" />
              </div>
            )}
            <div
              className={`relative w-full overflow-hidden transition-transform duration-200 group-hover:scale-105 ${
                isTimber ? 'rounded-2xl border-2 border-[#b45309] shadow-[0_6px_16px_rgba(0,0,0,0.95)]' : ''
              }`}
              style={
                isTimber
                  ? undefined
                  : { clipPath: 'polygon(50% 0%, 100% 12%, 100% 86%, 50% 100%, 0% 86%, 0% 12%)' }
              }
            >
              <div
                className={`p-[2px] sm:p-[2.5px] ${
                  isTimber
                    ? 'bg-gradient-to-b from-[#78350f] via-[#451a03] to-[#1c0a00]'
                    : 'bg-gradient-to-b from-yellow-300 via-purple-600 to-indigo-950'
                }`}
              >
                <div
                  className={`px-1 sm:px-2 pt-1 pb-1.5 flex flex-col items-center justify-between min-h-[44px] sm:min-h-[50px] ${
                    isTimber
                      ? 'bg-gradient-to-b from-[#1c0e07] via-[#0d0603] to-black rounded-xl'
                      : 'bg-gradient-to-b from-purple-950 via-slate-950 to-black'
                  }`}
                  style={
                    isTimber
                      ? undefined
                      : { clipPath: 'polygon(50% 0%, 100% 12%, 100% 86%, 50% 100%, 0% 86%, 0% 12%)' }
                  }
                >
                  <div className="flex items-center space-x-1 z-10 mt-0.5">
                    <div
                      className={`w-3.5 sm:w-4 h-3.5 sm:h-4 rounded-full flex items-center justify-center shadow-md flex-shrink-0 ${
                        isTimber
                          ? 'bg-gradient-to-tr from-teal-500 to-emerald-400 shadow-[0_0_8px_rgba(20,184,166,0.8)]'
                          : 'bg-gradient-to-tr from-purple-500 to-pink-400 shadow-[0_0_8px_rgba(168,85,247,0.8)]'
                      }`}
                    >
                      <Gem className="w-2 sm:w-2.5 h-2 sm:h-2.5 text-white" />
                    </div>
                    <span
                      className={`text-[8px] xs:text-[9px] sm:text-[10px] font-black uppercase tracking-wider font-sans whitespace-nowrap ${
                        isTimber ? 'text-teal-200' : 'text-purple-200'
                      }`}
                    >
                      {gameDef.theme.majorTitle}
                    </span>
                  </div>

                  <div className="flex items-baseline font-mono z-10 text-center mt-1 whitespace-nowrap">
                    <span className={`text-[9px] sm:text-xs font-bold mr-0.5 ${isTimber ? 'text-teal-400' : 'text-purple-400'}`}>
                      $
                    </span>
                    <span
                      className={`text-[11px] xs:text-xs sm:text-sm md:text-base font-black leading-none ${
                        isTimber
                          ? 'text-teal-200 drop-shadow-[0_0_10px_rgba(45,212,191,1)]'
                          : 'text-purple-300 drop-shadow-[0_0_10px_rgba(216,180,254,1)]'
                      }`}
                    >
                      {Math.floor(major).toLocaleString()}
                    </span>
                    <span className={`text-[8px] sm:text-[10px] font-bold ml-0.5 ${isTimber ? 'text-teal-400/80' : 'text-purple-400/80'}`}>
                      .{(major % 1).toFixed(2).slice(2)}
                    </span>
                  </div>

                  <div className={`w-4 h-0.5 rounded-full mb-0.5 ${isTimber ? 'bg-teal-400/40' : 'bg-purple-400/40'}`} />
                </div>
              </div>
            </div>
          </div>

          {/* MINOR (CLEVER FOX: Suspended lower in center) */}
          <div
            onClick={handleJackpotClick}
            className={`relative cursor-pointer group flex flex-col items-center flex-1 ${
              isTimber ? 'mt-3 sm:mt-4' : ''
            }`}
            title={`${gameDef.theme.minorTitle} - Click for Audio`}
          >
            {/* Hanging Iron Chain Links for Timberland */}
            {isTimber && (
              <div className="flex space-x-6 mb-0.5 pointer-events-none">
                <div className="w-1.5 h-3 border border-slate-600 rounded-full bg-slate-800" />
                <div className="w-1.5 h-3 border border-slate-600 rounded-full bg-slate-800" />
              </div>
            )}
            <div
              className={`relative w-full overflow-hidden transition-transform duration-200 group-hover:scale-105 ${
                isTimber ? 'rounded-2xl border-2 border-[#b45309] shadow-[0_4px_14px_rgba(0,0,0,0.9)]' : ''
              }`}
              style={
                isTimber
                  ? undefined
                  : { clipPath: 'polygon(15% 0%, 85% 0%, 100% 15%, 100% 85%, 85% 100%, 15% 100%, 0% 85%, 0% 15%)' }
              }
            >
              <div
                className={`p-[2px] sm:p-[2.5px] ${
                  isTimber
                    ? 'bg-gradient-to-b from-[#78350f] via-[#451a03] to-[#1c0a00]'
                    : 'bg-gradient-to-b from-yellow-300 via-teal-500 to-cyan-950'
                }`}
              >
                <div
                  className={`px-1 sm:px-2 pt-1 pb-1.5 flex flex-col items-center justify-between min-h-[44px] sm:min-h-[50px] ${
                    isTimber
                      ? 'bg-gradient-to-b from-[#1c0e07] via-[#0d0603] to-black rounded-xl'
                      : 'bg-gradient-to-b from-cyan-950 via-slate-950 to-black'
                  }`}
                  style={
                    isTimber
                      ? undefined
                      : { clipPath: 'polygon(15% 0%, 85% 0%, 100% 15%, 100% 85%, 85% 100%, 15% 100%, 0% 85%, 0% 15%)' }
                  }
                >
                  <div className="flex items-center space-x-1 z-10 mt-0.5">
                    <div
                      className={`w-3.5 sm:w-4 h-3.5 sm:h-4 rounded-full flex items-center justify-center shadow-md flex-shrink-0 ${
                        isTimber
                          ? 'bg-gradient-to-tr from-amber-500 to-orange-400 shadow-[0_0_8px_rgba(245,158,11,0.8)]'
                          : 'bg-gradient-to-tr from-cyan-400 to-teal-300 shadow-[0_0_8px_rgba(6,182,212,0.8)]'
                      }`}
                    >
                      <Coins className={`w-2 sm:w-2.5 h-2 sm:h-2.5 ${isTimber ? 'text-amber-950 fill-amber-950' : 'text-cyan-950 fill-cyan-950'}`} />
                    </div>
                    <span
                      className={`text-[8px] xs:text-[9px] sm:text-[10px] font-black uppercase tracking-wider font-sans whitespace-nowrap ${
                        isTimber ? 'text-amber-300' : 'text-cyan-200'
                      }`}
                    >
                      {gameDef.theme.minorTitle}
                    </span>
                  </div>

                  <div className="flex items-baseline font-mono z-10 text-center mt-1 whitespace-nowrap">
                    <span className={`text-[9px] sm:text-xs font-bold mr-0.5 ${isTimber ? 'text-amber-400' : 'text-cyan-400'}`}>
                      $
                    </span>
                    <span
                      className={`text-[11px] xs:text-xs sm:text-sm md:text-base font-black leading-none ${
                        isTimber
                          ? 'text-amber-200 drop-shadow-[0_0_10px_rgba(251,191,36,1)]'
                          : 'text-cyan-300 drop-shadow-[0_0_10px_rgba(103,232,249,1)]'
                      }`}
                    >
                      {Math.floor(minor).toLocaleString()}
                    </span>
                    <span className={`text-[8px] sm:text-[10px] font-bold ml-0.5 ${isTimber ? 'text-amber-400/80' : 'text-cyan-400/80'}`}>
                      .{(minor % 1).toFixed(2).slice(2)}
                    </span>
                  </div>

                  <div className={`w-4 h-0.5 rounded-full mb-0.5 ${isTimber ? 'bg-amber-400/40' : 'bg-cyan-400/40'}`} />
                </div>
              </div>
            </div>
          </div>

          {/* MINI (SQUIRREL: Tilted +2.5deg hanging higher on the right) */}
          <div
            onClick={handleJackpotClick}
            className={`relative cursor-pointer group flex flex-col items-center flex-1 ${
              isTimber ? 'transform rotate-2 sm:rotate-3 -mt-1 sm:-mt-2' : ''
            }`}
            title={`${gameDef.theme.miniTitle} - Click for Audio`}
          >
            {/* Hanging Iron Chain Links for Timberland */}
            {isTimber && (
              <div className="flex space-x-8 mb-0.5 pointer-events-none">
                <div className="w-1.5 h-3 border border-slate-600 rounded-full bg-slate-800" />
                <div className="w-1.5 h-3 border border-slate-600 rounded-full bg-slate-800" />
              </div>
            )}
            <div
              className={`relative w-full overflow-hidden transition-transform duration-200 group-hover:scale-105 ${
                isTimber ? 'rounded-2xl border-2 border-[#b45309] shadow-[0_4px_14px_rgba(0,0,0,0.9)]' : ''
              }`}
              style={
                isTimber
                  ? undefined
                  : { clipPath: 'polygon(10px 0, calc(100% - 10px) 0, 100% 10px, 100% calc(100% - 10px), calc(100% - 10px) 100%, 10px 100%, 0 calc(100% - 10px), 0 10px)' }
              }
            >
              <div
                className={`p-[2px] sm:p-[2.5px] ${
                  isTimber
                    ? 'bg-gradient-to-b from-[#78350f] via-[#451a03] to-[#1c0a00]'
                    : 'bg-gradient-to-b from-yellow-300 via-emerald-600 to-green-950'
                }`}
              >
                <div
                  className={`px-1 sm:px-2 pt-1 pb-1.5 flex flex-col items-center justify-between min-h-[44px] sm:min-h-[50px] ${
                    isTimber
                      ? 'bg-gradient-to-b from-[#1c0e07] via-[#0d0603] to-black rounded-xl'
                      : 'bg-gradient-to-b from-green-950 via-slate-950 to-black'
                  }`}
                  style={
                    isTimber
                      ? undefined
                      : { clipPath: 'polygon(10px 0, calc(100% - 10px) 0, 100% 10px, 100% calc(100% - 10px), calc(100% - 10px) 100%, 10px 100%, 0 calc(100% - 10px), 0 10px)' }
                  }
                >
                  <div className="flex items-center space-x-1 z-10 mt-0.5">
                    <div
                      className={`w-3.5 sm:w-4 h-3.5 sm:h-4 rounded-full flex items-center justify-center shadow-md flex-shrink-0 ${
                        isTimber
                          ? 'bg-gradient-to-tr from-emerald-500 to-lime-400 shadow-[0_0_8px_rgba(16,185,129,0.8)]'
                          : 'bg-gradient-to-tr from-emerald-400 to-lime-300 shadow-[0_0_8px_rgba(16,185,129,0.8)]'
                      }`}
                    >
                      <Shield className="w-2 sm:w-2.5 h-2 sm:h-2.5 text-emerald-950" />
                    </div>
                    <span
                      className={`text-[8px] xs:text-[9px] sm:text-[10px] font-black uppercase tracking-wider font-sans whitespace-nowrap ${
                        isTimber ? 'text-emerald-300' : 'text-emerald-200'
                      }`}
                    >
                      {gameDef.theme.miniTitle}
                    </span>
                  </div>

                  <div className="flex items-baseline font-mono z-10 text-center mt-1 whitespace-nowrap">
                    <span className="text-[9px] sm:text-xs font-bold text-emerald-400 mr-0.5">$</span>
                    <span className="text-[11px] xs:text-xs sm:text-sm md:text-base font-black text-emerald-300 drop-shadow-[0_0_10px_rgba(110,231,183,1)] leading-none">
                      {Math.floor(mini).toLocaleString()}
                    </span>
                    <span className="text-[8px] sm:text-[10px] font-bold text-emerald-400/80 ml-0.5">
                      .{(mini % 1).toFixed(2).slice(2)}
                    </span>
                  </div>

                  <div className="w-4 h-0.5 bg-emerald-400/40 rounded-full mb-0.5" />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
