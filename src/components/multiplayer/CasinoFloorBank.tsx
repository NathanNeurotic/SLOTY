import React from 'react';
import type { CasinoPeerState } from '../../multiplayer/discordTypes';
import { NeighborTerminal } from './NeighborTerminal';
import { Users, Trophy } from 'lucide-react';
import type { GameId } from '../../games/types';

interface CasinoFloorBankProps {
  peers: CasinoPeerState[];
  isFloorMode: boolean;
  onToggleFloorMode: () => void;
  onOpenLeaderboard: () => void;
  onTipNeighbor: (peerId: string) => void;
  children: React.ReactNode; // Center stage slot machine
  activeGameId?: GameId;
}

export const CasinoFloorBank: React.FC<CasinoFloorBankProps> = ({
  peers,
  isFloorMode,
  onToggleFloorMode,
  onOpenLeaderboard,
  onTipNeighbor,
  children,
  activeGameId = 'vault-24k',
}) => {
  const leftNeighbor = peers[0] || null;
  const rightNeighbor = peers[1] || null;

  const isTimber = activeGameId === 'timber-critters';

  return (
    <div className="relative w-full flex flex-col items-center">
      {/* Floor Mode Control Header (Desktop / Tablet only) */}
      <div className="hidden sm:flex items-center justify-between w-full max-w-4xl px-2 sm:px-4 mb-1">
        {/* Floor Mode Switch Button */}
        <button
          onClick={onToggleFloorMode}
          className={`flex items-center space-x-1.5 px-3 py-1 rounded-full border text-[10px] font-black uppercase transition-all shadow-md ${
            isFloorMode
              ? 'bg-gradient-to-r from-amber-500 to-yellow-400 text-amber-950 border-yellow-200 shadow-[0_0_15px_rgba(251,191,36,0.5)]'
              : 'bg-casino-900/90 text-amber-300 border-amber-500/30 hover:border-amber-400'
          }`}
          title="Toggle multiplayer casino floor bank view"
        >
          <Users className="w-3.5 h-3.5" />
          <span>{isFloorMode ? 'CASINO BANK ACTIVE' : 'SWITCH TO CASINO BANK VIEW'}</span>
        </button>

        {/* Server Leaderboard Button */}
        <button
          onClick={onOpenLeaderboard}
          className="flex items-center space-x-1.5 px-3 py-1 rounded-full bg-casino-900/90 hover:bg-casino-800 text-yellow-300 border border-yellow-400/40 text-[10px] font-black uppercase shadow-md transition-all hover:scale-105"
          title="View Discord Server High Scores & Hall of Fame"
        >
          <Trophy className="w-3.5 h-3.5 text-yellow-400 fill-yellow-400" />
          <span>SERVER HIGH SCORES</span>
        </button>
      </div>

      {/* Main Floor Arena with Themed Casino Floor Foundation */}
      <div className={`w-full max-w-7xl mx-auto rounded-3xl p-1 sm:p-3 relative transition-all duration-300 ${
        isTimber
          ? 'bg-gradient-to-b from-[#1b0e07]/80 via-[#2a1308]/90 to-[#0e0602] border-t-2 border-[#854d0e]/40 shadow-[0_25px_60px_rgba(0,0,0,0.95)]'
          : 'bg-gradient-to-b from-[#2d0505]/80 via-[#180202]/90 to-[#050000] border-t-2 border-yellow-500/30 shadow-[0_25px_60px_rgba(0,0,0,0.9)]'
      }`}>
        {/* Physical Themed Floor Pattern Texture */}
        {isTimber ? (
          <div className="absolute inset-x-0 bottom-0 h-44 pointer-events-none opacity-40 bg-[repeating-linear-gradient(0deg,transparent,transparent_24px,#140904_24px,#140904_26px)] overflow-hidden">
            {/* Scattered Autumn Leaves and Moss Patches on the boardwalk */}
            <div className="absolute bottom-2 left-10 text-xs">🍂</div>
            <div className="absolute bottom-5 left-36 text-xs">🍁</div>
            <div className="absolute bottom-3 right-16 text-xs">🍂</div>
            <div className="absolute bottom-6 right-48 text-xs">🍁</div>
            <div className="absolute bottom-1 inset-x-0 h-1 bg-gradient-to-r from-emerald-800/40 via-emerald-600/30 to-emerald-800/40" />
          </div>
        ) : (
          <div className="absolute inset-x-0 bottom-0 h-44 pointer-events-none opacity-30 overflow-hidden">
            {/* Las Vegas Red Velvet Diamond Trellis Pattern */}
            <svg viewBox="0 0 100 100" className="w-full h-full object-repeat opacity-40">
              <defs>
                <pattern id="carpetPattern" width="20" height="20" patternUnits="userSpaceOnUse">
                  <path d="M 0 10 L 10 0 L 20 10 L 10 20 Z" fill="none" stroke="#FBBF24" strokeWidth="0.5" />
                  <circle cx="10" cy="10" r="1.5" fill="#EF4444" />
                </pattern>
              </defs>
              <rect width="100%" height="100%" fill="url(#carpetPattern)" />
            </svg>
            <div className="absolute bottom-1 inset-x-0 h-1 bg-gradient-to-r from-amber-500/50 via-yellow-300/60 to-amber-500/50" />
          </div>
        )}

        <div className="relative z-10 w-full flex items-end justify-center gap-2 sm:gap-6 lg:gap-10 xl:gap-12 overflow-x-auto px-1 sm:px-2 py-1">
          {/* Left Seat: Neighbor Terminal */}
          {isFloorMode && leftNeighbor && (
            <div className="hidden md:block transition-all duration-300 flex-shrink-0">
              <NeighborTerminal
                peer={leftNeighbor}
                seatNumber={1}
                onTip={onTipNeighbor}
                activeGameId={activeGameId}
              />
            </div>
          )}

          {/* Center Seat: Primary Slot Machine */}
          <div className="flex-1 max-w-4xl z-10">
            {children}
          </div>

          {/* Right Seat: Neighbor Terminal */}
          {isFloorMode && rightNeighbor && (
            <div className="hidden md:block transition-all duration-300 flex-shrink-0">
              <NeighborTerminal
                peer={rightNeighbor}
                seatNumber={3}
                onTip={onTipNeighbor}
                activeGameId={activeGameId}
              />
            </div>
          )}
        </div>
      </div>


    </div>
  );
};
