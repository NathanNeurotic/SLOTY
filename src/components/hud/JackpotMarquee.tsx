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
        {/* 1. TOWERING CENTERPIECE: GRAND JACKPOT ARCH                               */}
        {/* ========================================================================= */}
        <div
          onClick={handleJackpotClick}
          className="relative w-full max-w-xl mx-auto z-20 cursor-pointer group"
          title={`${gameDef.theme.grandTitle} - Click for Audio`}
        >
          {/* Radial Sunburst / Canopy Glow */}
          <div
            className={`absolute -top-3 left-1/2 -translate-x-1/2 w-80 h-16 rounded-full filter blur-lg pointer-events-none ${
              isTimber
                ? 'bg-gradient-to-t from-emerald-500/30 to-transparent'
                : 'bg-gradient-to-t from-yellow-500/30 to-transparent'
            }`}
          />

          {/* Sculptural Tiered Arch Pediment Frame */}
          <div
            className={`relative p-[2.5px] sm:p-[3px] rounded-t-[28px] sm:rounded-t-[42px] rounded-b-xl group-hover:scale-[1.01] transition-transform duration-200 ${
              isTimber
                ? 'bg-gradient-to-b from-emerald-500 via-amber-700 to-[#120a05] shadow-[0_10px_35px_rgba(16,185,129,0.6)]'
                : 'bg-gradient-to-b from-amber-300 via-yellow-600 to-amber-950 shadow-[0_10px_35px_rgba(245,158,11,0.7)]'
            }`}
          >
            {/* Scalloped Crest Cap */}
            <div
              className={`absolute -top-3.5 left-1/2 -translate-x-1/2 flex items-center justify-center space-x-1 sm:space-x-1.5 px-3 sm:px-5 py-0.5 rounded-full border-2 shadow-[0_4px_12px_rgba(0,0,0,0.9)] z-30 ${
                isTimber
                  ? 'bg-gradient-to-r from-stone-900 via-emerald-700 to-stone-900 border-emerald-300 text-emerald-100'
                  : 'bg-gradient-to-r from-amber-700 via-yellow-300 to-amber-700 border-yellow-100 text-amber-950'
              }`}
            >
              {isTimber ? (
                <Trees className="w-3 sm:w-3.5 h-3 sm:h-3.5 text-emerald-300" />
              ) : (
                <Crown className="w-3 sm:w-3.5 h-3 sm:h-3.5 text-amber-950 fill-amber-950 animate-bounce" />
              )}
              <span className="text-[7.5px] xs:text-[8.5px] sm:text-[10px] font-black uppercase tracking-widest font-sans whitespace-nowrap">
                {gameDef.theme.grandTitle}
              </span>
              <Sparkles className={`w-3 sm:w-3.5 h-3 sm:h-3.5 ${isTimber ? 'text-amber-300' : 'text-amber-950'}`} />
            </div>

            {/* Inner Glass Chamber */}
            <div
              className={`relative rounded-t-[25px] sm:rounded-t-[38px] rounded-b-lg px-2 sm:px-6 pt-3 sm:pt-4 pb-1.5 sm:pb-2 flex items-center justify-between border overflow-hidden ${
                isTimber
                  ? 'bg-gradient-to-b from-[#06180d] via-black to-[#041008] border-emerald-500/40'
                  : 'bg-gradient-to-b from-red-950/95 via-black to-slate-950 border-yellow-300/40'
              }`}
            >
              {/* Metallic Light Sweep */}
              <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-full animate-shimmer-sweep pointer-events-none" />

              {/* Left Chasing Bulbs */}
              <div className="flex items-center space-x-1 sm:space-x-1.5 z-10 flex-shrink-0">
                {[...Array(4)].map((_, i) => (
                  <div
                    key={i}
                    className={`w-1.5 sm:w-2.5 h-1.5 sm:h-2.5 rounded-full animate-pulse ${
                      isTimber
                        ? i % 2 === 0
                          ? 'bg-emerald-400 shadow-[0_0_8px_#34D399]'
                          : 'bg-amber-400 shadow-[0_0_8px_#FBBF24]'
                        : 'bg-yellow-300 shadow-[0_0_8px_#FCD34D]'
                    }`}
                    style={{ animationDuration: '600ms', animationDelay: `${i * 150}ms` }}
                  />
                ))}
              </div>

              {/* Center: Glowing Digital Readout */}
              <div className="flex items-baseline font-mono z-10 mx-auto px-1">
                <span className={`text-xs sm:text-base font-black mr-0.5 sm:mr-1 ${isTimber ? 'text-emerald-400' : 'text-amber-400'}`}>
                  $
                </span>
                <span
                  className={`text-lg xs:text-xl sm:text-3xl md:text-4xl font-black tracking-tight leading-none font-mono ${
                    isTimber
                      ? 'text-emerald-200 drop-shadow-[0_0_18px_rgba(52,211,153,1)]'
                      : 'text-yellow-300 drop-shadow-[0_0_18px_rgba(253,224,71,1)]'
                  }`}
                >
                  {Math.floor(grand).toLocaleString()}
                </span>
                <span className={`text-[10px] xs:text-xs sm:text-lg font-bold ml-0.5 ${isTimber ? 'text-emerald-400/90' : 'text-amber-400/90'}`}>
                  .{(grand % 1).toFixed(2).slice(2)}
                </span>
              </div>

              {/* Right Chasing Bulbs */}
              <div className="flex items-center space-x-1 sm:space-x-1.5 z-10 flex-shrink-0">
                {[...Array(4)].map((_, i) => (
                  <div
                    key={i}
                    className={`w-1.5 sm:w-2.5 h-1.5 sm:h-2.5 rounded-full animate-pulse ${
                      isTimber
                        ? (3 - i) % 2 === 0
                          ? 'bg-emerald-400 shadow-[0_0_8px_#34D399]'
                          : 'bg-amber-400 shadow-[0_0_8px_#FBBF24]'
                        : 'bg-yellow-300 shadow-[0_0_8px_#FCD34D]'
                    }`}
                    style={{ animationDuration: '600ms', animationDelay: `${(3 - i) * 150}ms` }}
                  />
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* ========================================================================= */}
        {/* 2. THREE UNIQUE SCULPTURAL THEMED PODS (MAJOR, MINOR, MINI)               */}
        {/* ========================================================================= */}
        <div className="grid grid-cols-3 gap-1.5 sm:gap-3 w-full mt-1.5 sm:mt-2 z-10">
          {/* MAJOR */}
          <div
            onClick={handleJackpotClick}
            className="relative cursor-pointer group flex flex-col items-center"
            title={`${gameDef.theme.majorTitle} - Click for Audio`}
          >
            <div
              className={`relative w-full overflow-hidden transition-transform duration-200 group-hover:scale-105 ${
                isTimber ? 'rounded-2xl border-2 border-[#b45309] shadow-[0_4px_14px_rgba(0,0,0,0.9)]' : ''
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
                  className={`px-1 sm:px-2.5 pt-2 pb-2.5 flex flex-col items-center justify-between min-h-[58px] sm:min-h-[68px] ${
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

          {/* MINOR */}
          <div
            onClick={handleJackpotClick}
            className="relative cursor-pointer group flex flex-col items-center"
            title={`${gameDef.theme.minorTitle} - Click for Audio`}
          >
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
                  className={`px-1 sm:px-2.5 pt-2 pb-2.5 flex flex-col items-center justify-between min-h-[58px] sm:min-h-[68px] ${
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

          {/* MINI */}
          <div
            onClick={handleJackpotClick}
            className="relative cursor-pointer group flex flex-col items-center"
            title={`${gameDef.theme.miniTitle} - Click for Audio`}
          >
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
                  className={`px-1 sm:px-2.5 pt-2 pb-2.5 flex flex-col items-center justify-between min-h-[58px] sm:min-h-[68px] ${
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
