import React, { useState, useEffect } from 'react';
import { Crown, Gem, Coins, Shield, Sparkles } from 'lucide-react';
import { storage } from '../../utils/storage';
import { soundManager } from '../../audio/soundManager';

interface JackpotMarqueeProps {
  totalBet: number;
}

export const JackpotMarquee: React.FC<JackpotMarqueeProps> = ({ totalBet }) => {
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
    soundManager.playGoldBarClank();
  };

  return (
    <div className="w-full max-w-4xl mx-auto px-1 sm:px-3 mb-1 sm:mb-2 select-none flex-shrink-0">
      <div className="relative flex flex-col items-center">
        {/* ========================================================================= */}
        {/* 1. TOWERING CENTERPIECE: 24K FORT KNOX IMPERIAL VAULT CROWN (GRAND)       */}
        {/* ========================================================================= */}
        <div
          onClick={handleJackpotClick}
          className="relative w-full max-w-xl mx-auto z-20 cursor-pointer group"
          title="24K Fort Knox Imperial Grand Vault - Click for Audio"
        >
          {/* Radial Gold Sunburst Rays Behind Arch */}
          <div className="absolute -top-3 left-1/2 -translate-x-1/2 w-80 h-16 bg-gradient-to-t from-yellow-500/30 to-transparent rounded-full filter blur-lg pointer-events-none" />

          {/* Sculptural Tiered Arch Pediment Frame */}
          <div className="relative bg-gradient-to-b from-amber-300 via-yellow-600 to-amber-950 p-[2.5px] sm:p-[3px] rounded-t-[28px] sm:rounded-t-[42px] rounded-b-xl shadow-[0_10px_35px_rgba(245,158,11,0.7),inset_0_2px_4px_rgba(255,255,255,0.8)] group-hover:scale-[1.01] transition-transform duration-200">
            {/* 3D Scalloped Gold Filigree Laurel Crest Cap */}
            <div className="absolute -top-3.5 left-1/2 -translate-x-1/2 flex items-center justify-center space-x-1 sm:space-x-1.5 px-3 sm:px-5 py-0.5 bg-gradient-to-r from-amber-700 via-yellow-300 to-amber-700 rounded-full border-2 border-yellow-100 shadow-[0_4px_12px_rgba(0,0,0,0.9)] z-30">
              <Crown className="w-3 sm:w-3.5 h-3 sm:h-3.5 text-amber-950 fill-amber-950 animate-bounce" />
              <span className="text-[7.5px] xs:text-[8.5px] sm:text-[10px] font-black uppercase tracking-widest text-amber-950 font-sans whitespace-nowrap">
                ★ FORT KNOX IMPERIAL GRAND ★
              </span>
              <Sparkles className="w-3 sm:w-3.5 h-3 sm:h-3.5 text-amber-950" />
            </div>

            {/* Inner Obsidian & Ruby Glass Chamber */}
            <div className="relative bg-gradient-to-b from-red-950/95 via-black to-slate-950 rounded-t-[25px] sm:rounded-t-[38px] rounded-b-lg px-2 sm:px-6 pt-3 sm:pt-4 pb-1.5 sm:pb-2 flex items-center justify-between border border-yellow-300/40 overflow-hidden">
              {/* Metallic Light Sweep */}
              <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-full animate-shimmer-sweep pointer-events-none" />

              {/* Left Chasing Jewel Bulbs with Pure CSS Animation */}
              <div className="flex items-center space-x-1 sm:space-x-1.5 z-10 flex-shrink-0">
                {[...Array(4)].map((_, i) => (
                  <div
                    key={i}
                    className="w-1.5 sm:w-2.5 h-1.5 sm:h-2.5 rounded-full bg-yellow-300 shadow-[0_0_8px_#FCD34D] animate-pulse"
                    style={{ animationDuration: '600ms', animationDelay: `${i * 150}ms` }}
                  />
                ))}
              </div>

              {/* Center: Giant Glowing Golden Digital Readout */}
              <div className="flex items-baseline font-mono z-10 mx-auto px-1">
                <span className="text-xs sm:text-base font-black text-amber-400 mr-0.5 sm:mr-1">$</span>
                <span className="text-lg xs:text-xl sm:text-3xl md:text-4xl font-black text-yellow-300 tracking-tight drop-shadow-[0_0_18px_rgba(253,224,71,1)] leading-none font-mono">
                  {Math.floor(grand).toLocaleString()}
                </span>
                <span className="text-[10px] xs:text-xs sm:text-lg font-bold text-amber-400/90 ml-0.5">
                  .{(grand % 1).toFixed(2).slice(2)}
                </span>
              </div>

              {/* Right Chasing Jewel Bulbs with Pure CSS Animation */}
              <div className="flex items-center space-x-1 sm:space-x-1.5 z-10 flex-shrink-0">
                {[...Array(4)].map((_, i) => (
                  <div
                    key={i}
                    className="w-1.5 sm:w-2.5 h-1.5 sm:h-2.5 rounded-full bg-yellow-300 shadow-[0_0_8px_#FCD34D] animate-pulse"
                    style={{ animationDuration: '600ms', animationDelay: `${(3 - i) * 150}ms` }}
                  />
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* ========================================================================= */}
        {/* 2. THREE UNIQUE SCULPTURAL THEMED PODS (MAJOR, MINOR, MINI)               */}
        {/* NOT RECTANGLES: Diamond Shield, Coin Medallion, and Bullion Safe Plaque    */}
        {/* ========================================================================= */}
        <div className="grid grid-cols-3 gap-1.5 sm:gap-3 w-full mt-1.5 sm:mt-2 z-10">
          {/* ----------------------------------------------------------------------- */}
          {/* MAJOR: 3D FACETED DIAMOND VAULT SHIELD (Hexagonal Chevron Silhouette)     */}
          {/* ----------------------------------------------------------------------- */}
          <div
            onClick={handleJackpotClick}
            className="relative cursor-pointer group flex flex-col items-center"
            title="High Roller Major Diamond Shield - Click for Audio"
          >
            {/* Faceted Shield Container */}
            <div
              className="relative w-full overflow-hidden transition-transform duration-200 group-hover:scale-105"
              style={{
                clipPath: 'polygon(50% 0%, 100% 12%, 100% 86%, 50% 100%, 0% 86%, 0% 12%)',
              }}
            >
              {/* Outer 3D Gold & Amethyst Beveled Border */}
              <div className="bg-gradient-to-b from-yellow-300 via-purple-600 to-indigo-950 p-[2px] sm:p-[2.5px]">
                {/* Shield Body Face with Royal Velvet Amethyst Refraction */}
                <div
                  className="bg-gradient-to-b from-purple-950 via-slate-950 to-black px-1 sm:px-2.5 pt-2 pb-2.5 flex flex-col items-center justify-between min-h-[58px] sm:min-h-[68px]"
                  style={{
                    clipPath: 'polygon(50% 0%, 100% 12%, 100% 86%, 50% 100%, 0% 86%, 0% 12%)',
                  }}
                >
                  {/* Shield Top Header: Diamond Badge + Title */}
                  <div className="flex items-center space-x-1 z-10 mt-0.5">
                    <div className="w-3.5 sm:w-4 h-3.5 sm:h-4 rounded-full bg-gradient-to-tr from-purple-500 to-pink-400 flex items-center justify-center shadow-[0_0_8px_rgba(168,85,247,0.8)] flex-shrink-0">
                      <Gem className="w-2 sm:w-2.5 h-2 sm:h-2.5 text-white" />
                    </div>
                    <span className="text-[8px] xs:text-[9px] sm:text-[10px] font-black uppercase text-purple-200 tracking-wider font-sans whitespace-nowrap">
                      MAJOR
                    </span>
                  </div>

                  {/* High-Contrast Violet Neon Numeric Meter */}
                  <div className="flex items-baseline font-mono z-10 text-center mt-1 whitespace-nowrap">
                    <span className="text-[9px] sm:text-xs font-bold text-purple-400 mr-0.5">$</span>
                    <span className="text-[11px] xs:text-xs sm:text-sm md:text-base font-black text-purple-300 drop-shadow-[0_0_10px_rgba(216,180,254,1)] leading-none">
                      {Math.floor(major).toLocaleString()}
                    </span>
                    <span className="text-[8px] sm:text-[10px] font-bold text-purple-400/80 ml-0.5">
                      .{(major % 1).toFixed(2).slice(2)}
                    </span>
                  </div>

                  {/* Shield Bottom Chevron Accent */}
                  <div className="w-4 h-0.5 bg-purple-400/40 rounded-full mb-0.5" />
                </div>
              </div>
            </div>
          </div>

          {/* ----------------------------------------------------------------------- */}
          {/* MINOR: 3D 24K MINTED BULLION COIN MEDALLION (Circular Reeded Rim)        */}
          {/* ----------------------------------------------------------------------- */}
          <div
            onClick={handleJackpotClick}
            className="relative cursor-pointer group flex flex-col items-center"
            title="Minted Bullion 999.9 Minor Medallion - Click for Audio"
          >
            {/* Scalloped Medallion Container */}
            <div
              className="relative w-full overflow-hidden transition-transform duration-200 group-hover:scale-105"
              style={{
                clipPath: 'polygon(15% 0%, 85% 0%, 100% 15%, 100% 85%, 85% 100%, 15% 100%, 0% 85%, 0% 15%)',
              }}
            >
              {/* Outer Reeded Brass & Gold Edge */}
              <div className="bg-gradient-to-b from-yellow-300 via-teal-500 to-cyan-950 p-[2px] sm:p-[2.5px]">
                {/* Coin Face with Concentric Security Rings */}
                <div
                  className="bg-gradient-to-b from-cyan-950 via-slate-950 to-black px-1 sm:px-2.5 pt-2 pb-2.5 flex flex-col items-center justify-between min-h-[58px] sm:min-h-[68px]"
                  style={{
                    clipPath: 'polygon(15% 0%, 85% 0%, 100% 15%, 100% 85%, 85% 100%, 15% 100%, 0% 85%, 0% 15%)',
                  }}
                >
                  {/* Medallion Top Header: Bullion Coin Icon + Title */}
                  <div className="flex items-center space-x-1 z-10 mt-0.5">
                    <div className="w-3.5 sm:w-4 h-3.5 sm:h-4 rounded-full bg-gradient-to-tr from-cyan-400 to-teal-300 flex items-center justify-center shadow-[0_0_8px_rgba(6,182,212,0.8)] flex-shrink-0">
                      <Coins className="w-2 sm:w-2.5 h-2 sm:h-2.5 text-cyan-950 fill-cyan-950" />
                    </div>
                    <span className="text-[8px] xs:text-[9px] sm:text-[10px] font-black uppercase text-cyan-200 tracking-wider font-sans whitespace-nowrap">
                      MINOR
                    </span>
                  </div>

                  {/* High-Contrast Cyan Laser Numeric Meter */}
                  <div className="flex items-baseline font-mono z-10 text-center mt-1 whitespace-nowrap">
                    <span className="text-[9px] sm:text-xs font-bold text-cyan-400 mr-0.5">$</span>
                    <span className="text-[11px] xs:text-xs sm:text-sm md:text-base font-black text-cyan-300 drop-shadow-[0_0_10px_rgba(103,232,249,1)] leading-none">
                      {Math.floor(minor).toLocaleString()}
                    </span>
                    <span className="text-[8px] sm:text-[10px] font-bold text-cyan-400/80 ml-0.5">
                      .{(minor % 1).toFixed(2).slice(2)}
                    </span>
                  </div>

                  {/* Coin Notch Accent */}
                  <div className="w-4 h-0.5 bg-cyan-400/40 rounded-full mb-0.5" />
                </div>
              </div>
            </div>
          </div>

          {/* ----------------------------------------------------------------------- */}
          {/* MINI: 3D FORT KNOX BULLION SAFE PLAQUE (Chamfered Corner Notched Ingot)  */}
          {/* ----------------------------------------------------------------------- */}
          <div
            onClick={handleJackpotClick}
            className="relative cursor-pointer group flex flex-col items-center"
            title="Fort Knox Mini Safe Plaque - Click for Audio"
          >
            {/* Chamfered Ingot Container */}
            <div
              className="relative w-full overflow-hidden transition-transform duration-200 group-hover:scale-105"
              style={{
                clipPath: 'polygon(10px 0, calc(100% - 10px) 0, 100% 10px, 100% calc(100% - 10px), calc(100% - 10px) 100%, 10px 100%, 0 calc(100% - 10px), 0 10px)',
              }}
            >
              {/* Heavy Bolted Brass Ingot Bevel */}
              <div className="bg-gradient-to-b from-yellow-300 via-emerald-600 to-green-950 p-[2px] sm:p-[2.5px]">
                {/* Emerald Safe Interior Chamber */}
                <div
                  className="bg-gradient-to-b from-emerald-950 via-slate-950 to-black px-1 sm:px-2.5 pt-2 pb-2.5 flex flex-col items-center justify-between min-h-[58px] sm:min-h-[68px]"
                  style={{
                    clipPath: 'polygon(10px 0, calc(100% - 10px) 0, 100% 10px, 100% calc(100% - 10px), calc(100% - 10px) 100%, 10px 100%, 0 calc(100% - 10px), 0 10px)',
                  }}
                >
                  {/* Safe Top Header: Vault Shield Icon + Title */}
                  <div className="flex items-center space-x-1 z-10 mt-0.5">
                    <div className="w-3.5 sm:w-4 h-3.5 sm:h-4 rounded-full bg-gradient-to-tr from-emerald-400 to-lime-300 flex items-center justify-center shadow-[0_0_8px_rgba(16,185,129,0.8)] flex-shrink-0">
                      <Shield className="w-2 sm:w-2.5 h-2 sm:h-2.5 text-emerald-950" />
                    </div>
                    <span className="text-[8px] xs:text-[9px] sm:text-[10px] font-black uppercase text-emerald-200 tracking-wider font-sans whitespace-nowrap">
                      MINI
                    </span>
                  </div>

                  {/* High-Contrast Emerald Neon Numeric Meter */}
                  <div className="flex items-baseline font-mono z-10 text-center mt-1 whitespace-nowrap">
                    <span className="text-[9px] sm:text-xs font-bold text-emerald-400 mr-0.5">$</span>
                    <span className="text-[11px] xs:text-xs sm:text-sm md:text-base font-black text-emerald-300 drop-shadow-[0_0_10px_rgba(110,231,183,1)] leading-none">
                      {Math.floor(mini).toLocaleString()}
                    </span>
                    <span className="text-[8px] sm:text-[10px] font-bold text-emerald-400/80 ml-0.5">
                      .{(mini % 1).toFixed(2).slice(2)}
                    </span>
                  </div>

                  {/* Ingot Rivet Accent */}
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
