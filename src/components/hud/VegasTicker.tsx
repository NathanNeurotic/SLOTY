import React from 'react';
import { Sparkles, Trophy } from 'lucide-react';

interface VegasTickerProps {
  freeSpinsRemaining: number;
}

export const VegasTicker: React.FC<VegasTickerProps> = ({ freeSpinsRemaining }) => {
  const tickerText = freeSpinsRemaining > 0
    ? `🔥🔥🔥 FREE SPINS BONUS ROUND ACTIVE • ALL PAYLINE WINS TRIPLED (3X) • ${freeSpinsRemaining} FREE SPINS REMAINING 🔥🔥🔥`
    : `★ SLOTY DELUXE 777 ★ 40 ACTIVE PAYLINES ★ HIT 6 COINS FOR GOLDEN HOLD & SPIN RESPIN FEATURE ★ 3 SCATTERS AWARD 10 FREE SPINS AT 3X MULTIPLIER ★ RISK WINS IN RED/BLACK VIDEO POKER DOUBLE-UP ★ 95.8% RTP CERTIFIED ★ GOOD LUCK HIGH ROLLER! ★`;

  return (
    <div className="w-full max-w-4xl mx-auto px-1 sm:px-3 mb-1.5 select-none overflow-hidden">
      <div className="relative bg-casino-950/90 border border-gold-bright/30 rounded-lg px-2 py-1 shadow-[inset_0_0_10px_rgba(245,158,11,0.2)] flex items-center overflow-hidden">
        {/* Left Badge */}
        <div className="flex items-center space-x-1 pr-2 border-r border-white/10 flex-shrink-0 z-10 bg-casino-950">
          <Trophy className="w-3.5 h-3.5 text-gold-bright animate-bounce" />
          <span className="text-[9px] font-black tracking-widest text-gold-bright uppercase whitespace-nowrap">
            CASINO LIVE
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
        <div className="pl-2 border-l border-white/10 flex-shrink-0 z-10 bg-casino-950 hidden sm:flex items-center">
          <Sparkles className="w-3 h-3 text-neon-cyan animate-spin" />
        </div>
      </div>
    </div>
  );
};
