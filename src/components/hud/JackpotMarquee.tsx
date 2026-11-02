import React, { useState, useEffect } from 'react';
import { Crown, Gem, Coins, Banknote } from 'lucide-react';
import { storage } from '../../utils/storage';
import { soundManager } from '../../audio/soundManager';

interface JackpotMarqueeProps {
  totalBet: number;
}

export const JackpotMarquee: React.FC<JackpotMarqueeProps> = ({ totalBet }) => {
  // Live ticking progressive pots (dual localStorage + cookie persistence)
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

  // Bulb chase animation tick
  const [bulbPhase, setBulbPhase] = useState(0);

  useEffect(() => {
    const bulbInterval = setInterval(() => {
      setBulbPhase((prev) => (prev + 1) % 4);
    }, 280);
    return () => clearInterval(bulbInterval);
  }, []);

  // Slowly tick progressive jackpots up in real-time
  useEffect(() => {
    const interval = setInterval(() => {
      setGrand((prev) => {
        const next = prev + 0.12 + Math.random() * 0.08;
        storage.setItem('sloty_jackpot_grand', next.toFixed(2));
        return next;
      });
      setMajor((prev) => {
        const next = prev + 0.06 + Math.random() * 0.04;
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

  // Feed a percentage of placed bets into the progressives
  useEffect(() => {
    if (totalBet > 0) {
      setGrand((g) => g + totalBet * 0.005);
      setMajor((m) => m + totalBet * 0.003);
      setMinor((mi) => mi + totalBet * 0.002);
      setMini((mn) => mn + totalBet * 0.001);
    }
  }, [totalBet]);

  const jackpotTiers = [
    {
      name: 'GRAND',
      fullName: '24K FORT KNOX VAULT',
      icon: Crown,
      amount: grand,
      outerBorder: 'border-amber-400',
      innerBg: 'bg-gradient-to-b from-red-950/90 via-black to-amber-950/90',
      ledText: 'text-yellow-300 drop-shadow-[0_0_10px_rgba(253,224,71,0.95)]',
      badgeBg: 'bg-gradient-to-b from-amber-400 to-yellow-600 text-amber-950',
      accentGlow: 'shadow-[0_0_20px_rgba(245,158,11,0.6)]',
      iconColor: 'text-amber-950',
      badgeTag: 'MEGA VAULT',
    },
    {
      name: 'MAJOR',
      fullName: 'HIGH ROLLER CASH LINK',
      icon: Gem,
      amount: major,
      outerBorder: 'border-purple-400/90',
      innerBg: 'bg-gradient-to-b from-purple-950/90 via-black to-slate-950',
      ledText: 'text-purple-300 drop-shadow-[0_0_10px_rgba(216,180,254,0.9)]',
      badgeBg: 'bg-gradient-to-b from-purple-400 to-indigo-600 text-white',
      accentGlow: 'shadow-[0_0_16px_rgba(168,85,247,0.5)]',
      iconColor: 'text-white',
      badgeTag: 'CASH LINK',
    },
    {
      name: 'MINOR',
      fullName: 'MINTED BULLION COIN',
      icon: Coins,
      amount: minor,
      outerBorder: 'border-cyan-400/90',
      innerBg: 'bg-gradient-to-b from-cyan-950/90 via-black to-slate-950',
      ledText: 'text-cyan-300 drop-shadow-[0_0_10px_rgba(103,232,249,0.9)]',
      badgeBg: 'bg-gradient-to-b from-cyan-400 to-blue-600 text-cyan-950',
      accentGlow: 'shadow-[0_0_16px_rgba(6,182,212,0.5)]',
      iconColor: 'text-cyan-950',
      badgeTag: 'BULLION POT',
    },
    {
      name: 'MINI',
      fullName: 'POCKET CASH POT',
      icon: Banknote,
      amount: mini,
      outerBorder: 'border-emerald-400/90',
      innerBg: 'bg-gradient-to-b from-emerald-950/90 via-black to-slate-950',
      ledText: 'text-emerald-300 drop-shadow-[0_0_10px_rgba(110,231,183,0.9)]',
      badgeBg: 'bg-gradient-to-b from-emerald-400 to-green-600 text-emerald-950',
      accentGlow: 'shadow-[0_0_16px_rgba(16,185,129,0.5)]',
      iconColor: 'text-emerald-950',
      badgeTag: 'POCKET CASH',
    },
  ];

  const handleJackpotClick = (name: string) => {
    soundManager.unlockAudio();
    soundManager.playGoldBarClank();
    soundManager.speakAnnouncement(`${name} PROGRESSIVE VAULT`);
  };

  return (
    <div className="w-full max-w-4xl mx-auto px-1 sm:px-3 mb-2 select-none flex-shrink-0">
      {/* Heavy Physical Cast Gold Slot Machine Topper Housing */}
      <div className="relative rounded-2xl bg-gradient-to-b from-amber-600 via-amber-800 to-yellow-950 p-1 sm:p-1.5 shadow-[0_8px_25px_rgba(0,0,0,0.9),inset_0_2px_4px_rgba(255,255,255,0.4)] border border-yellow-300/60">
        {/* Crown Pediment Banner */}
        <div className="flex items-center justify-between px-2 sm:px-4 py-0.5 mb-1 bg-gradient-to-r from-amber-950 via-yellow-900 to-amber-950 rounded-t-xl border-b border-yellow-400/30">
          {/* Left Chasing LED Bulbs */}
          <div className="flex items-center space-x-1 sm:space-x-1.5">
            {[...Array(5)].map((_, i) => (
              <div
                key={i}
                className={`w-1.5 sm:w-2 h-1.5 sm:h-2 rounded-full transition-all duration-200 ${
                  (i + bulbPhase) % 2 === 0
                    ? 'bg-yellow-300 shadow-[0_0_8px_#FCD34D]'
                    : 'bg-amber-700 shadow-none'
                }`}
              />
            ))}
          </div>

          {/* Marquee Center Title */}
          <div className="flex items-center space-x-1.5">
            <span className="text-[7.5px] sm:text-[9.5px] font-black uppercase tracking-widest text-amber-200 drop-shadow-[0_1px_3px_rgba(0,0,0,0.9)] font-sans">
              ★ FORT KNOX 24K PROGRESSIVE LINK ★
            </span>
          </div>

          {/* Right Chasing LED Bulbs */}
          <div className="flex items-center space-x-1 sm:space-x-1.5">
            {[...Array(5)].map((_, i) => (
              <div
                key={i}
                className={`w-1.5 sm:w-2 h-1.5 sm:h-2 rounded-full transition-all duration-200 ${
                  (i + bulbPhase + 1) % 2 === 0
                    ? 'bg-yellow-300 shadow-[0_0_8px_#FCD34D]'
                    : 'bg-amber-700 shadow-none'
                }`}
              />
            ))}
          </div>
        </div>

        {/* 4 Distinct Physical Progressive Chambers */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-1 sm:gap-1.5">
          {jackpotTiers.map((tier) => {
            const Icon = tier.icon;
            return (
              <div
                key={tier.name}
                onClick={() => handleJackpotClick(tier.name)}
                className={`relative ${tier.innerBg} border-2 ${tier.outerBorder} rounded-xl px-2 py-1.5 flex flex-col justify-between ${tier.accentGlow} overflow-hidden cursor-pointer hover:scale-[1.02] active:scale-[0.99] transition-transform duration-150 h-13 sm:h-14`}
                title={`${tier.fullName} - Click to Inspect`}
              >
                {/* Metallic glass light reflection sweep */}
                <div className="absolute top-0 left-0 right-0 h-[2px] bg-gradient-to-r from-transparent via-white/50 to-transparent animate-shimmer-sweep" />

                {/* Top Row: Tier Badge & Tag */}
                <div className="flex items-center justify-between w-full">
                  <div className="flex items-center space-x-1">
                    <div
                      className={`w-4 h-4 sm:w-5 sm:h-5 rounded-md ${tier.badgeBg} flex items-center justify-center shadow-md flex-shrink-0 font-bold`}
                    >
                      <Icon className={`w-2.5 h-2.5 sm:w-3 sm:h-3 ${tier.iconColor}`} />
                    </div>
                    <span className="text-[8.5px] sm:text-[9.5px] font-black tracking-wider text-white uppercase font-sans drop-shadow-md">
                      {tier.name}
                    </span>
                  </div>

                  <span className="text-[6.5px] sm:text-[7px] font-black px-1 py-0.5 rounded bg-black/60 text-yellow-400 border border-yellow-400/30 font-mono">
                    {tier.badgeTag}
                  </span>
                </div>

                {/* Bottom Row: High-Intensity LED 7-Segment Ticker */}
                <div className="flex items-baseline justify-between mt-1 pt-0.5 border-t border-white/10">
                  <span className="text-[7px] sm:text-[8px] font-bold text-slate-400 font-mono">
                    USD $
                  </span>
                  <div className="flex items-baseline font-mono">
                    <span
                      className={`text-xs sm:text-sm md:text-base font-black ${tier.ledText} tracking-tight leading-none`}
                    >
                      {Math.floor(tier.amount).toLocaleString()}
                    </span>
                    <span className="text-[8px] sm:text-[9px] font-bold text-yellow-500/90 leading-none ml-0.5">
                      .{(tier.amount % 1).toFixed(2).slice(2)}
                    </span>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
