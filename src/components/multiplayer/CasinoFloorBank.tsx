import React from 'react';
import type { CasinoPeerState } from '../../multiplayer/discordTypes';
import { NeighborTerminal } from './NeighborTerminal';
import type { GameId } from '../../games/types';
import { GamePerkCard } from '../hud/GamePerkCard';

interface CasinoFloorBankProps {
  peers: CasinoPeerState[];
  isFloorMode: boolean;
  onToggleFloorMode?: () => void;
  onOpenLeaderboard?: () => void;
  onOpenPaytable?: () => void;
  onTipNeighbor: (peerId: string) => void;
  children: React.ReactNode; // Center stage slot machine
  activeGameId?: GameId;
  companionNode?: React.ReactNode;
  flankCompanion?: React.ReactNode;
}

export const CasinoFloorBank: React.FC<CasinoFloorBankProps> = ({
  peers,
  isFloorMode,
  onTipNeighbor,
  onOpenPaytable,
  children,
  activeGameId = 'vault-24k',
  flankCompanion,
}) => {
  const leftNeighbor = peers[0] || null;
  const rightNeighbor = peers[1] || null;

  return (
    <div className="relative w-full flex flex-col items-center flex-1 min-h-0 justify-center">
      {/* Main Floor Arena with generous clearance for lever & flank cards */}
      <div className="w-full flex items-end justify-center gap-2 sm:gap-4 lg:gap-8 xl:gap-14 2xl:gap-16 px-1 sm:px-2 py-0.5 sm:py-1 flex-1 min-h-0">
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
        <div className="flex-1 min-h-0 max-w-4xl lg:max-w-5xl xl:max-w-6xl 2xl:max-w-7xl z-10 flex flex-col justify-center">
          {children}
        </div>

        {/* Right Flank: Neighbor Terminal (in Floor Mode) OR Full Perk Guide Standee */}
        {isFloorMode && rightNeighbor ? (
          <div className="hidden md:block transition-all duration-300 flex-shrink-0 xl:ml-4 2xl:ml-8">
            <NeighborTerminal
              peer={rightNeighbor}
              seatNumber={3}
              onTip={onTipNeighbor}
              activeGameId={activeGameId}
            />
          </div>
        ) : (
          <div className="hidden lg:flex flex-col items-center justify-end transition-all duration-300 flex-shrink-0 pb-3 z-20 xl:ml-12 2xl:ml-16">
            <GamePerkCard
              activeGameId={activeGameId}
              onOpenPaytable={onOpenPaytable}
            />
          </div>
        )}
      </div>
    </div>
  );
};
