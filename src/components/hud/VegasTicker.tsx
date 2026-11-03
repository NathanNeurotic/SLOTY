import React from 'react';
import { Landmark, Coins, Trees, Compass } from 'lucide-react';
import type { GameId } from '../../games/types';
import { getGame } from '../../games/gameRegistry';

interface VegasTickerProps {
  freeSpinsRemaining: number;
  activeGameId?: GameId;
}

export const VegasTicker: React.FC<VegasTickerProps> = ({
  freeSpinsRemaining,
  activeGameId = 'vault-24k',
}) => {
  const isTimber = activeGameId === 'timber-critters';
  const gameDef = getGame(activeGameId);

  const tickerText =
    freeSpinsRemaining > 0
      ? gameDef.theme.tickerFreeSpinsText
      : gameDef.theme.tickerText;

  return (
    <div className="w-full max-w-5xl xl:max-w-6xl mx-auto px-1 sm:px-3 mb-0.5 sm:mb-1 select-none overflow-hidden flex-shrink-0">
      <div
        className={`relative rounded-lg px-2 py-0.5 flex items-center overflow-hidden h-6.5 sm:h-7.5 flex-shrink-0 border transition-colors ${
          isTimber
            ? 'bg-[#08180e]/95 border-emerald-500/50 shadow-[inset_0_0_12px_rgba(16,185,129,0.3)]'
            : 'bg-casino-950/90 border-gold-bright/40 shadow-[inset_0_0_12px_rgba(245,158,11,0.25)]'
        }`}
      >
        {/* Left Badge */}
        <div
          className={`flex items-center space-x-1 pr-2 border-r border-white/10 flex-shrink-0 z-10 ${
            isTimber ? 'bg-[#08180e]' : 'bg-casino-950'
          }`}
        >
          {isTimber ? (
            <Trees className="w-3.5 h-3.5 text-emerald-300 animate-pulse" />
          ) : (
            <Coins className="w-3.5 h-3.5 text-yellow-300 animate-pulse" />
          )}
          <span
            className={`text-[8.5px] sm:text-[9.5px] font-black tracking-widest uppercase whitespace-nowrap ${
              isTimber ? 'text-emerald-300' : 'text-gold-bright'
            }`}
          >
            {gameDef.theme.tickerBadge}
          </span>
        </div>

        {/* Scrolling Ticker Text Container */}
        <div className="flex-1 overflow-hidden whitespace-nowrap ml-2 relative">
          <div
            className={`inline-block animate-marquee-text font-mono text-[10px] sm:text-[11px] font-bold ${
              isTimber
                ? 'text-emerald-200 drop-shadow-[0_0_4px_rgba(52,211,153,0.7)]'
                : 'text-amber-300 drop-shadow-[0_0_4px_rgba(251,191,36,0.6)]'
            }`}
          >
            <span className="mr-8">{tickerText}</span>
            <span className="mr-8">{tickerText}</span>
          </div>
        </div>

        {/* Right Badge */}
        <div
          className={`pl-2 border-l border-white/10 flex-shrink-0 z-10 hidden sm:flex items-center space-x-1 ${
            isTimber ? 'bg-[#08180e]' : 'bg-casino-950'
          }`}
        >
          {isTimber ? (
            <>
              <Compass className="w-3 h-3 text-amber-400" />
              <span className="text-[8.5px] font-black text-amber-400">DEEP WOODS</span>
            </>
          ) : (
            <>
              <Landmark className="w-3 h-3 text-emerald-400" />
              <span className="text-[8.5px] font-black text-emerald-400">FORT KNOX</span>
            </>
          )}
        </div>
      </div>
    </div>
  );
};
