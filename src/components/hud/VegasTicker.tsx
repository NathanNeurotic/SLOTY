import React from 'react';
import { Landmark, Coins } from 'lucide-react';

interface VegasTickerProps {
  freeSpinsRemaining: number;
}

export const VegasTicker: React.FC<VegasTickerProps> = ({ freeSpinsRemaining }) => {
  const tickerText =
    freeSpinsRemaining > 0
      ? `🔥🔥🔥 PENTHOUSE CASH RUSH ACTIVE • ALL PAYLINE WINS TRIPLED (3X) • ${freeSpinsRemaining} FREE SPINS REMAINING • RAINING $100 BILLS 🔥🔥🔥`
      : `★ 24K GOLD & CASH VAULT ★ 40 HIGH-ROLLER PAYLINES ★ HIT 6 MINTED BULLION COINS FOR FORT KNOX CASH LINK ★ 3 VAULT SCATTERS AWARD 10 FREE SPINS AT 3X MULTIPLIER ★ RISK WINS IN OREGON DOUBLE-UP VIDEO POKER ★ 95.8% RTP CERTIFIED ★ GOOD LUCK HIGH ROLLER! ★`;

  return (
    <div className="w-full max-w-4xl mx-auto px-1 sm:px-3 mb-1.5 select-none overflow-hidden flex-shrink-0">
      <div className="relative bg-casino-950/90 border border-gold-bright/40 rounded-lg px-2 py-1 shadow-[inset_0_0_12px_rgba(245,158,11,0.25)] flex items-center overflow-hidden h-8 sm:h-9 flex-shrink-0">
        {/* Left Badge */}
        <div className="flex items-center space-x-1 pr-2 border-r border-white/10 flex-shrink-0 z-10 bg-casino-950">
          <Coins className="w-3.5 h-3.5 text-yellow-300 animate-pulse" />
          <span className="text-[8.5px] sm:text-[9.5px] font-black tracking-widest text-gold-bright uppercase whitespace-nowrap">
            CASH TICKER
          </span>
        </div>

        {/* Scrolling Ticker Text Container */}
        <div className="flex-1 overflow-hidden whitespace-nowrap ml-2 relative">
          <div className="inline-block animate-marquee-text font-mono text-[10px] sm:text-[11px] font-bold text-amber-300 drop-shadow-[0_0_4px_rgba(251,191,36,0.6)]">
            <span className="mr-8">{tickerText}</span>
            <span className="mr-8">{tickerText}</span>
          </div>
        </div>

        {/* Right Badge */}
        <div className="pl-2 border-l border-white/10 flex-shrink-0 z-10 bg-casino-950 hidden sm:flex items-center space-x-1">
          <Landmark className="w-3 h-3 text-emerald-400" />
          <span className="text-[8.5px] font-black text-emerald-400">FORT KNOX</span>
        </div>
      </div>
    </div>
  );
};
