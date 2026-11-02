import React, { useState, useEffect } from 'react';
import { Crown, Gem, Coins, Banknote, Sparkles } from 'lucide-react';
import { storage } from '../../utils/storage';
import { soundManager } from '../../audio/soundManager';

interface JackpotMarqueeProps {
  totalBet: number;
}

export const JackpotMarquee: React.FC<JackpotMarqueeProps> = ({ totalBet }) => {
  // Live ticking progressive pots
  const [grand, setGrand] = useState<number>(() =>
    storage.getNumber('sloty_jackpot_grand', 78420.5)
  );
  const [major, setMajor] = useState<number>(() =>
    storage.getNumber('sloty_jackpot_major', 14250.25)
  );
  const [minor, setMinor] = useState<number>(() =>
    storage.getNumber('sloty_jackpot_minor', 1850.75)
  );
  const [mini, setMini] = useState<number>(() =>
    storage.getNumber('sloty_jackpot_mini', 340.1)
  );

  // Chasing light bulb phase
  const [bulbPhase, setBulbPhase] = useState(0);

  useEffect(() => {
    const bulbInterval = setInterval(() => {
      setBulbPhase((prev) => (prev + 1) % 6);
    }, 220);
    return () => clearInterval(bulbInterval);
  }, []);

  // Tick progressives in real-time
  useEffect(() => {
    const interval = setInterval(() => {
      setGrand((prev) => {
        const next = prev + 0.14 + Math.random() * 0.09;
        storage.setItem('sloty_jackpot_grand', next.toFixed(2));
        return next;
      });
      setMajor((prev) => {
        const next = prev + 0.07 + Math.random() * 0.05;
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
    soundManager.playGoldBarClank();
  };

  return (
    <div className="w-full max-w-4xl mx-auto px-1 sm:px-3 mb-2 select-none flex-shrink-0">
      {/* Heavy Ornate Vegas Slot Topper Console */}
      <div className="relative flex flex-col items-center">
        {/* ========================================================================= */}
        {/* 1. TOWERING CENTERPIECE: 24K FORT KNOX IMPERIAL VAULT CROWN (GRAND)       */}
        {/* ========================================================================= */}
        <div
          onClick={handleJackpotClick}
          className="relative w-full max-w-lg mx-auto z-20 cursor-pointer group"
          title="24K Fort Knox Imperial Grand Vault - Click for Audio"
        >
          {/* Radial Gold Sunburst Rays Behind Grand Arch */}
          <div className="absolute -top-3 left-1/2 -translate-x-1/2 w-72 h-14 bg-gradient-to-t from-yellow-500/25 to-transparent rounded-full filter blur-md pointer-events-none" />

          {/* Arched Crown Dome Silhouette */}
          <div className="relative bg-gradient-to-b from-amber-500 via-yellow-600 to-amber-950 p-[3px] rounded-t-[28px] sm:rounded-t-[36px] rounded-b-xl shadow-[0_8px_30px_rgba(245,158,11,0.65),inset_0_2px_4px_rgba(255,255,255,0.7)] group-hover:scale-[1.01] transition-transform duration-200">
            {/* Scalloped Gold Filigree Crest Cap */}
            <div className="absolute -top-3.5 left-1/2 -translate-x-1/2 flex items-center justify-center space-x-1.5 px-4 py-0.5 bg-gradient-to-r from-amber-600 via-yellow-300 to-amber-600 rounded-full border border-yellow-100 shadow-[0_2px_10px_rgba(0,0,0,0.8)] z-30">
              <Crown className="w-3.5 h-3.5 text-amber-950 fill-amber-950 animate-bounce" />
              <span className="text-[8px] sm:text-[9.5px] font-black uppercase tracking-widest text-amber-950 font-sans">
                ★ 24K FORT KNOX GRAND ★
              </span>
              <Sparkles className="w-3 h-3 text-amber-950" />
            </div>

            {/* Inner Obsidian & Ruby Glass Chamber */}
            <div className="relative bg-gradient-to-b from-red-950/90 via-black to-slate-950 rounded-t-[25px] sm:rounded-t-[33px] rounded-b-lg px-3 sm:px-6 pt-3 pb-1.5 flex items-center justify-between border border-yellow-300/40 overflow-hidden">
              {/* Animated Specular Light Beam */}
              <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/15 to-transparent -translate-x-full animate-shimmer-sweep pointer-events-none" />

              {/* Left: Crown Medallion & Chasing Marquee Bulbs */}
              <div className="flex items-center space-x-2 z-10">
                {/* Chasing Bulbs */}
                <div className="flex items-center space-x-1">
                  {[...Array(4)].map((_, i) => (
                    <div
                      key={i}
                      className={`w-1.5 sm:w-2 h-1.5 sm:h-2 rounded-full transition-all duration-200 ${
                        (i + bulbPhase) % 3 === 0
                          ? 'bg-yellow-300 shadow-[0_0_8px_#FCD34D]'
                          : 'bg-red-800'
                      }`}
                    />
                  ))}
                </div>

                <div className="hidden xs:flex flex-col">
                  <span className="text-[7.5px] font-black text-amber-400 tracking-widest uppercase">
                    PROGRESSIVE
                  </span>
                  <span className="text-[9px] font-black text-white font-mono leading-none">
                    TOP JACKPOT
                  </span>
                </div>
              </div>

              {/* Center-Right: Giant Glowing Golden Digital Readout */}
              <div className="flex items-baseline font-mono z-10 text-right">
                <span className="text-xs sm:text-sm font-black text-amber-400 mr-1">$</span>
                <span className="text-lg sm:text-2xl md:text-3xl font-black text-yellow-300 tracking-tight drop-shadow-[0_0_15px_rgba(253,224,71,1)] leading-none font-mono">
                  {Math.floor(grand).toLocaleString()}
                </span>
                <span className="text-xs sm:text-base font-bold text-amber-400/90 ml-0.5">
                  .{(grand % 1).toFixed(2).slice(2)}
                </span>
              </div>

              {/* Right: Chasing Marquee Bulbs */}
              <div className="flex items-center space-x-1 z-10">
                {[...Array(4)].map((_, i) => (
                  <div
                    key={i}
                    className={`w-1.5 sm:w-2 h-1.5 sm:h-2 rounded-full transition-all duration-200 ${
                      (i + bulbPhase + 1) % 3 === 0
                        ? 'bg-yellow-300 shadow-[0_0_8px_#FCD34D]'
                        : 'bg-red-800'
                    }`}
                  />
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* ========================================================================= */}
        {/* 2. THREE FLANKING UNIQUE THEMED JACKPOT PODS (MAJOR, MINOR, MINI)         */}
        {/* ========================================================================= */}
        <div className="grid grid-cols-3 gap-1.5 sm:gap-2.5 w-full mt-1 z-10">
          {/* ----------------------------------------------------------------------- */}
          {/* MAJOR: DIAMOND-BEVELED HEXAGON VAULT SHIELD                             */}
          {/* ----------------------------------------------------------------------- */}
          <div
            onClick={handleJackpotClick}
            className="relative cursor-pointer group"
            title="High Roller Major Cash Link - Click for Audio"
          >
            {/* Beveled Faceted Border Frame */}
            <div className="relative bg-gradient-to-b from-purple-500 via-indigo-700 to-purple-950 p-[2px] rounded-xl shadow-[0_4px_16px_rgba(168,85,247,0.5),inset_0_1px_2px_rgba(255,255,255,0.6)] group-hover:scale-[1.02] transition-transform duration-150">
              {/* Amethyst Chamber Glass */}
              <div className="relative bg-gradient-to-b from-purple-950/95 via-black to-slate-950 rounded-[10px] px-2 py-1.5 flex flex-col justify-between h-13 sm:h-14 overflow-hidden border border-purple-400/30">
                {/* Header Tag with Diamond Briefcase Emblem */}
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-1">
                    <div className="w-4 h-4 rounded-md bg-gradient-to-tr from-purple-500 to-pink-400 flex items-center justify-center shadow-sm">
                      <Gem className="w-2.5 h-2.5 text-white" />
                    </div>
                    <span className="text-[7.5px] sm:text-[9px] font-black uppercase text-purple-200 tracking-wider font-sans">
                      MAJOR
                    </span>
                  </div>
                  <span className="text-[6.5px] sm:text-[7px] font-black px-1 rounded bg-purple-900/80 text-purple-300 border border-purple-400/30">
                    CASH LINK
                  </span>
                </div>

                {/* LED Readout */}
                <div className="flex items-baseline justify-end font-mono mt-1">
                  <span className="text-[8px] font-bold text-purple-400 mr-0.5">$</span>
                  <span className="text-xs sm:text-base font-black text-purple-300 drop-shadow-[0_0_10px_rgba(216,180,254,0.9)] leading-none">
                    {Math.floor(major).toLocaleString()}
                  </span>
                  <span className="text-[7.5px] sm:text-[9px] font-bold text-purple-400/80 ml-0.5">
                    .{(major % 1).toFixed(2).slice(2)}
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* ----------------------------------------------------------------------- */}
          {/* MINOR: REEDED 999.9 BULLION COIN MEDALLION                              */}
          {/* ----------------------------------------------------------------------- */}
          <div
            onClick={handleJackpotClick}
            className="relative cursor-pointer group"
            title="Minted Bullion Minor - Click for Audio"
          >
            {/* Scalloped Brass Coin Rim */}
            <div className="relative bg-gradient-to-b from-cyan-400 via-teal-600 to-cyan-950 p-[2px] rounded-xl shadow-[0_4px_16px_rgba(6,182,212,0.5),inset_0_1px_2px_rgba(255,255,255,0.6)] group-hover:scale-[1.02] transition-transform duration-150">
              {/* Cobalt Glass Chamber */}
              <div className="relative bg-gradient-to-b from-cyan-950/95 via-black to-slate-950 rounded-[10px] px-2 py-1.5 flex flex-col justify-between h-13 sm:h-14 overflow-hidden border border-cyan-400/30">
                {/* Header Tag with Bullion Medal Emblem */}
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-1">
                    <div className="w-4 h-4 rounded-md bg-gradient-to-tr from-cyan-400 to-teal-300 flex items-center justify-center shadow-sm">
                      <Coins className="w-2.5 h-2.5 text-cyan-950 fill-cyan-950" />
                    </div>
                    <span className="text-[7.5px] sm:text-[9px] font-black uppercase text-cyan-200 tracking-wider font-sans">
                      MINOR
                    </span>
                  </div>
                  <span className="text-[6.5px] sm:text-[7px] font-black px-1 rounded bg-cyan-900/80 text-cyan-300 border border-cyan-400/30">
                    BULLION
                  </span>
                </div>

                {/* LED Readout */}
                <div className="flex items-baseline justify-end font-mono mt-1">
                  <span className="text-[8px] font-bold text-cyan-400 mr-0.5">$</span>
                  <span className="text-xs sm:text-base font-black text-cyan-300 drop-shadow-[0_0_10px_rgba(103,232,249,0.9)] leading-none">
                    {Math.floor(minor).toLocaleString()}
                  </span>
                  <span className="text-[7.5px] sm:text-[9px] font-bold text-cyan-400/80 ml-0.5">
                    .{(minor % 1).toFixed(2).slice(2)}
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* ----------------------------------------------------------------------- */}
          {/* MINI: OVERSTUFFED POCKET CASH VAULT PLAQUE                              */}
          {/* ----------------------------------------------------------------------- */}
          <div
            onClick={handleJackpotClick}
            className="relative cursor-pointer group"
            title="Pocket Cash Mini Pot - Click for Audio"
          >
            {/* Scalloped Emerald Frame */}
            <div className="relative bg-gradient-to-b from-emerald-400 via-green-600 to-emerald-950 p-[2px] rounded-xl shadow-[0_4px_16px_rgba(16,185,129,0.5),inset_0_1px_2px_rgba(255,255,255,0.6)] group-hover:scale-[1.02] transition-transform duration-150">
              {/* Emerald Glass Chamber */}
              <div className="relative bg-gradient-to-b from-emerald-950/95 via-black to-slate-950 rounded-[10px] px-2 py-1.5 flex flex-col justify-between h-13 sm:h-14 overflow-hidden border border-emerald-400/30">
                {/* Header Tag with Cash Bag Emblem */}
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-1">
                    <div className="w-4 h-4 rounded-md bg-gradient-to-tr from-emerald-400 to-lime-300 flex items-center justify-center shadow-sm">
                      <Banknote className="w-2.5 h-2.5 text-emerald-950" />
                    </div>
                    <span className="text-[7.5px] sm:text-[9px] font-black uppercase text-emerald-200 tracking-wider font-sans">
                      MINI
                    </span>
                  </div>
                  <span className="text-[6.5px] sm:text-[7px] font-black px-1 rounded bg-emerald-900/80 text-emerald-300 border border-emerald-400/30">
                    POCKET
                  </span>
                </div>

                {/* LED Readout */}
                <div className="flex items-baseline justify-end font-mono mt-1">
                  <span className="text-[8px] font-bold text-emerald-400 mr-0.5">$</span>
                  <span className="text-xs sm:text-base font-black text-emerald-300 drop-shadow-[0_0_10px_rgba(110,231,183,0.9)] leading-none">
                    {Math.floor(mini).toLocaleString()}
                  </span>
                  <span className="text-[7.5px] sm:text-[9px] font-bold text-emerald-400/80 ml-0.5">
                    .{(mini % 1).toFixed(2).slice(2)}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
