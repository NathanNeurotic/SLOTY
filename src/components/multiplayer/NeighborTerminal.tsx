import React from 'react';
import type { CasinoPeerState } from '../../multiplayer/discordTypes';
import { SymbolRenderer } from '../slots/SymbolRenderer';
import { Coins, Sparkles, Trees } from 'lucide-react';
import type { SymbolId } from '../../engine/types';
import type { GameId } from '../../games/types';

interface NeighborTerminalProps {
  peer: CasinoPeerState;
  seatNumber: number;
  onTip: (peerId: string) => void;
  activeGameId?: GameId;
}

const VAULT_TO_TIMBER: Record<string, SymbolId> = {
  WILD: 'BEAR',
  SCATTER: 'OWL',
  COIN: 'ACORN',
  SEVEN: 'WOLF',
  DIAMOND: 'FOX',
  BELL: 'RACCOON',
  MELON: 'SQUIRREL',
  GOLDBAR: 'MUSHROOM',
  HORSESHOE: 'PINECONE',
  GRAPES: 'BERRIES',
  PLUM: 'ACORN',
  ACE: 'ACE',
  KING: 'KING',
  QUEEN: 'QUEEN',
  JACK: 'JACK',
};

export const NeighborTerminal: React.FC<NeighborTerminalProps> = ({
  peer,
  seatNumber,
  onTip,
  activeGameId = 'vault-24k',
}) => {
  const isTimber = activeGameId === 'timber-critters';

  return (
    <div
      className={`relative flex flex-col w-[190px] sm:w-[220px] rounded-2xl p-2 shadow-2xl transition-all duration-300 flex-shrink-0 select-none overflow-hidden ${
        isTimber
          ? 'bg-gradient-to-b from-[#24130a] via-[#140a05] to-black border-2 border-amber-800/70 shadow-[0_0_25px_rgba(16,185,129,0.25)]'
          : 'bg-gradient-to-b from-casino-900 via-casino-950 to-black border border-white/15'
      }`}
    >
      {/* Ambient Glow behind Terminal */}
      <div
        className={`absolute -inset-1 rounded-2xl filter blur-sm pointer-events-none transition-opacity ${
          peer.lastWin >= 1000
            ? isTimber
              ? 'bg-emerald-400/40 opacity-100 animate-pulse'
              : 'bg-amber-400/40 opacity-100 animate-pulse'
            : peer.isSpinning
            ? isTimber
              ? 'bg-teal-500/25 opacity-100'
              : 'bg-cyan-500/20 opacity-100'
            : 'opacity-0'
        }`}
      />

      {/* Terminal Top Cabinet Marquee */}
      <div className={`relative z-10 flex items-center justify-between border-b pb-1.5 mb-1.5 ${
        isTimber ? 'border-amber-900/60' : 'border-white/10'
      }`}>
        {/* Neighbor Player Info */}
        <div className="flex items-center space-x-1.5 overflow-hidden">
          <img
            src={peer.avatarUrl}
            alt={peer.name}
            className={`w-6 h-6 rounded-full border shadow-sm flex-shrink-0 ${
              isTimber ? 'border-emerald-400' : 'border-yellow-300'
            }`}
          />
          <div className="flex flex-col min-w-0">
            <span className="text-[10px] font-black text-slate-100 truncate leading-tight font-sans">
              {peer.name}
            </span>
            <span className={`text-[7.5px] font-bold leading-none ${isTimber ? 'text-emerald-300' : 'text-amber-400/90'}`}>
              SEAT #{seatNumber} {peer.isBot ? '• BOT' : '• DISCORD'}
            </span>
          </div>
        </div>

        {/* Live Status Pill */}
        <div
          className={`px-1.5 py-0.5 rounded-full text-[7.5px] font-black uppercase tracking-wider flex items-center space-x-0.5 flex-shrink-0 ${
            peer.isSpinning
              ? isTimber
                ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-400/50 animate-pulse'
                : 'bg-cyan-500/20 text-neon-cyan border border-cyan-400/50 animate-pulse'
              : peer.lastWin > 0
              ? isTimber
                ? 'bg-amber-500/25 text-amber-200 border border-amber-400/60'
                : 'bg-amber-500/20 text-yellow-300 border border-yellow-400/50'
              : 'bg-casino-800 text-slate-400'
          }`}
        >
          {peer.isSpinning && (
            isTimber ? <Trees className="w-2 h-2 text-emerald-300 animate-spin" /> : <Sparkles className="w-2 h-2 text-neon-cyan animate-spin" />
          )}
          <span>{peer.isSpinning ? 'SPINNING' : peer.lastWin > 0 ? 'WINNER' : 'READY'}</span>
        </div>
      </div>

      {/* Credit & Win Readouts */}
      <div className={`relative z-10 flex items-center justify-between px-2 py-1 rounded-lg border mb-1.5 ${
        isTimber ? 'bg-black/80 border-amber-900/40' : 'bg-black/60 border-white/5'
      }`}>
        <div className="flex flex-col">
          <span className="text-[7px] font-black text-slate-400 uppercase tracking-widest">
            BANKROLL
          </span>
          <span className="text-xs font-black font-mono text-emerald-400">
            ${peer.balance.toLocaleString()}
          </span>
        </div>

        <div className="flex flex-col text-right">
          <span className="text-[7px] font-black text-slate-400 uppercase tracking-widest">
            LAST WIN
          </span>
          <span
            className={`text-xs font-black font-mono ${
              peer.lastWin > 0
                ? isTimber
                  ? 'text-emerald-300 animate-pulse'
                  : 'text-yellow-300 animate-pulse'
                : 'text-slate-500'
            }`}
          >
            {peer.lastWin > 0 ? `+$${peer.lastWin.toLocaleString()}` : '$0'}
          </span>
        </div>
      </div>

      {/* Mini 5-Reel Slot Grid (5 columns x 4 rows) */}
      <div className={`relative z-10 grid grid-cols-5 gap-0.5 p-1 rounded-lg border shadow-inner h-[130px] sm:h-[150px] overflow-hidden ${
        isTimber ? 'bg-[#09150d] border-emerald-600/30' : 'bg-casino-950 border-white/10'
      }`}>
        {/* Spinning Motion Blur Overlay */}
        {peer.isSpinning && (
          <div className="absolute inset-0 bg-black/80 backdrop-blur-[1px] flex flex-col items-center justify-center z-20 pointer-events-none">
            <div className={`w-5 h-5 rounded-full border-2 border-t-transparent animate-spin mb-1 ${
              isTimber ? 'border-emerald-400' : 'border-neon-cyan'
            }`} />
            <span className={`text-[8px] font-black tracking-widest uppercase animate-pulse ${
              isTimber ? 'text-emerald-300' : 'text-neon-cyan'
            }`}>
              ROLLING...
            </span>
          </div>
        )}

        {/* 5 Columns */}
        {[0, 1, 2, 3, 4].map((colIdx) => (
          <div key={colIdx} className="flex flex-col justify-between h-full">
            {[0, 1, 2, 3].map((rowIdx) => {
              const rawSymId = (peer.reelSymbols[colIdx]?.[rowIdx] as SymbolId) || 'SEVEN';
              const symId = isTimber ? (VAULT_TO_TIMBER[rawSymId] || rawSymId) : rawSymId;
              return (
                <div
                  key={rowIdx}
                  className="flex-1 flex items-center justify-center p-0.5 overflow-hidden"
                >
                  <SymbolRenderer id={symId} />
                </div>
              );
            })}
          </div>
        ))}
      </div>

      {/* Terminal Footer: Tip Neighbor Button */}
      <div className={`relative z-10 flex items-center justify-between mt-2 pt-1.5 border-t ${
        isTimber ? 'border-amber-900/60' : 'border-white/10'
      }`}>
        <span className="text-[8px] font-bold text-slate-400 truncate max-w-[110px]">
          {peer.statusText}
        </span>

        <button
          onClick={() => onTip(peer.id)}
          className={`flex items-center space-x-1 px-2 py-0.5 rounded-full font-black text-[8px] uppercase shadow-md transition-transform active:scale-95 flex-shrink-0 ${
            isTimber
              ? 'bg-gradient-to-r from-emerald-600 via-teal-500 to-emerald-700 text-white hover:brightness-110'
              : 'bg-gradient-to-r from-amber-500 to-yellow-400 hover:from-amber-400 hover:to-yellow-300 text-amber-950'
          }`}
          title={`Toss a 25-coin tip to ${peer.name}!`}
        >
          <Coins className="w-2.5 h-2.5" />
          <span>TIP +25</span>
        </button>
      </div>
    </div>
  );
};
