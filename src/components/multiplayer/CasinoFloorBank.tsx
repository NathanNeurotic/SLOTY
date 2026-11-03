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
  companionNode?: React.ReactNode;
  flankCompanion?: React.ReactNode;
}

export const CasinoFloorBank: React.FC<CasinoFloorBankProps> = ({
  peers,
  isFloorMode,
  onToggleFloorMode,
  onOpenLeaderboard,
  onTipNeighbor,
  children,
  activeGameId = 'vault-24k',
  companionNode,
  flankCompanion,
}) => {
  const leftNeighbor = peers[0] || null;
  const rightNeighbor = peers[1] || null;

  return (
    <div className="relative w-full flex flex-col items-center">
      {/* Floor Mode Control Header with Integrated Live Mascot Chip */}
      <div className="hidden sm:flex items-center justify-between w-full max-w-5xl xl:max-w-6xl px-2 sm:px-4 mb-2 z-20">
        {/* Floor Mode Switch Button */}
        <button
          onClick={onToggleFloorMode}
          className={`flex items-center space-x-1.5 px-3 py-1 rounded-full border text-[10px] font-black uppercase transition-all shadow-md flex-shrink-0 ${
            isFloorMode
              ? 'bg-gradient-to-r from-amber-500 to-yellow-400 text-amber-950 border-yellow-200 shadow-[0_0_15px_rgba(251,191,36,0.5)]'
              : 'bg-casino-900/90 text-amber-300 border-amber-500/30 hover:border-amber-400'
          }`}
          title="Toggle multiplayer casino floor bank view"
        >
          <Users className="w-3.5 h-3.5" />
          <span>{isFloorMode ? 'CASINO BANK ACTIVE' : 'SWITCH TO CASINO BANK VIEW'}</span>
        </button>

        {/* Center: Live VIP Hostess / Mascot Companion */}
        {companionNode && (
          <div className="flex-1 max-w-md mx-3">
            {companionNode}
          </div>
        )}

        {/* Server Leaderboard Button */}
        <button
          onClick={onOpenLeaderboard}
          className="flex items-center space-x-1.5 px-3 py-1 rounded-full bg-casino-900/90 hover:bg-casino-800 text-yellow-300 border border-yellow-400/40 text-[10px] font-black uppercase shadow-md transition-all hover:scale-105 flex-shrink-0"
          title="View Discord Server High Scores & Hall of Fame"
        >
          <Trophy className="w-3.5 h-3.5 text-yellow-400 fill-yellow-400" />
          <span>SERVER HIGH SCORES</span>
        </button>
      </div>

      {/* Main Floor Arena */}
      <div className="w-full flex items-end justify-center gap-2 sm:gap-4 lg:gap-6 px-1 sm:px-2 py-1">
        {/* Left Flank: Neighbor Terminal (in Floor Mode) OR Full Mascot Standee */}
        {isFloorMode && leftNeighbor ? (
          <div className="hidden md:block transition-all duration-300 flex-shrink-0">
            <NeighborTerminal
              peer={leftNeighbor}
              seatNumber={1}
              onTip={onTipNeighbor}
              activeGameId={activeGameId}
            />
          </div>
        ) : flankCompanion ? (
          <div className="hidden lg:flex flex-col items-center justify-end transition-all duration-300 flex-shrink-0 pb-3 z-20">
            {flankCompanion}
          </div>
        ) : null}

        {/* Center Seat: Primary Slot Machine */}
        <div className="flex-1 max-w-5xl xl:max-w-6xl z-10">
          {children}
        </div>

        {/* Right Flank: Neighbor Terminal */}
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
  );
};
