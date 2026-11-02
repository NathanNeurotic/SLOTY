import React, { useState, useEffect } from 'react';
import { Crown, Gem, Zap, Sparkles } from 'lucide-react';

interface JackpotMarqueeProps {
  totalBet: number;
}

export const JackpotMarquee: React.FC<JackpotMarqueeProps> = ({ totalBet }) => {
  // Live ticking progressive pots
  const [grand, setGrand] = useState<number>(() => {
    const saved = localStorage.getItem('sloty_jackpot_grand');
    return saved ? parseFloat(saved) : 78420.5;
  });

  const [major, setMajor] = useState<number>(() => {
    const saved = localStorage.getItem('sloty_jackpot_major');
    return saved ? parseFloat(saved) : 14250.25;
  });

  const [minor, setMinor] = useState<number>(() => {
    const saved = localStorage.getItem('sloty_jackpot_minor');
    return saved ? parseFloat(saved) : 1850.75;
  });

  const [mini, setMini] = useState<number>(() => {
    const saved = localStorage.getItem('sloty_jackpot_mini');
    return saved ? parseFloat(saved) : 340.1;
  });

  // Slowly tick progressive jackpots up in real-time
  useEffect(() => {
    const interval = setInterval(() => {
      setGrand((prev) => {
        const next = prev + 0.12 + Math.random() * 0.08;
        localStorage.setItem('sloty_jackpot_grand', next.toFixed(2));
        return next;
      });
      setMajor((prev) => {
        const next = prev + 0.06 + Math.random() * 0.04;
        localStorage.setItem('sloty_jackpot_major', next.toFixed(2));
        return next;
      });
      setMinor((prev) => {
        const next = prev + 0.03 + Math.random() * 0.02;
        localStorage.setItem('sloty_jackpot_minor', next.toFixed(2));
        return next;
      });
      setMini((prev) => {
        const next = prev + 0.01 + Math.random() * 0.01;
        localStorage.setItem('sloty_jackpot_mini', next.toFixed(2));
        return next;
      });
    }, 1200);

    return () => clearInterval(interval);
  }, []);

  // When totalBet is placed, feed a percentage of the bet into the progressives
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
      icon: Crown,
      amount: grand,
      bg: 'from-amber-950 via-red-950 to-amber-950',
      border: 'border-yellow-400',
      textColor: 'text-yellow-300',
      badgeBg: 'bg-red-600',
      glow: 'shadow-[0_0_15px_rgba(245,158,11,0.5)]',
      iconColor: 'text-yellow-300',
    },
    {
      name: 'MAJOR',
      icon: Gem,
      amount: major,
      bg: 'from-purple-950 via-slate-900 to-purple-950',
      border: 'border-purple-400',
      textColor: 'text-purple-300',
      badgeBg: 'bg-purple-600',
      glow: 'shadow-[0_0_15px_rgba(168,85,247,0.4)]',
      iconColor: 'text-purple-300',
    },
    {
      name: 'MINOR',
      icon: Zap,
      amount: minor,
      bg: 'from-cyan-950 via-slate-900 to-cyan-950',
      border: 'border-cyan-400',
      textColor: 'text-cyan-300',
      badgeBg: 'bg-cyan-600',
      glow: 'shadow-[0_0_15px_rgba(6,182,212,0.4)]',
      iconColor: 'text-cyan-300',
    },
    {
      name: 'MINI',
      icon: Sparkles,
      amount: mini,
      bg: 'from-emerald-950 via-slate-900 to-emerald-950',
      border: 'border-emerald-400',
      textColor: 'text-emerald-300',
      badgeBg: 'bg-emerald-600',
      glow: 'shadow-[0_0_15px_rgba(16,185,129,0.4)]',
      iconColor: 'text-emerald-300',
    },
  ];

  return (
    <div className="w-full max-w-4xl mx-auto px-1 sm:px-3 mb-2 select-none">
      <div className="grid grid-cols-2 md:grid-cols-4 gap-1.5 sm:gap-2">
        {jackpotTiers.map((tier) => {
          const Icon = tier.icon;
          return (
            <div
              key={tier.name}
              className={`relative bg-gradient-to-b ${tier.bg} border ${tier.border} rounded-xl px-2 py-1.5 flex items-center justify-between ${tier.glow} overflow-hidden`}
            >
              {/* Animated top shimmer bar */}
              <div className="absolute top-0 left-0 right-0 h-[2px] bg-gradient-to-r from-transparent via-white/40 to-transparent animate-shimmer-sweep" />

              {/* Left tier badge & icon */}
              <div className="flex items-center space-x-1.5">
                <div
                  className={`w-6 h-6 rounded-lg ${tier.badgeBg} flex items-center justify-center shadow-md flex-shrink-0`}
                >
                  <Icon className={`w-3.5 h-3.5 text-white`} />
                </div>
                <div className="flex flex-col">
                  <span className="text-[9px] font-black tracking-widest text-slate-300 uppercase leading-none">
                    {tier.name}
                  </span>
                  <span className="text-[7px] font-bold text-slate-400 uppercase leading-none mt-0.5">
                    PROGRESSIVE
                  </span>
                </div>
              </div>

              {/* Live incrementing ticker amount */}
              <div className="text-right">
                <div
                  className={`text-xs sm:text-sm md:text-base font-black ${tier.textColor} tracking-tight font-mono leading-none`}
                >
                  ${Math.floor(tier.amount).toLocaleString()}
                </div>
                <div className="text-[8px] font-bold text-amber-400/80 leading-none mt-0.5">
                  .{(tier.amount % 1).toFixed(2).slice(2)}
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
