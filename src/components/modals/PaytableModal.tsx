import React from 'react';
import { X, Coins } from 'lucide-react';
import { SymbolRenderer } from '../slots/SymbolRenderer';
import { soundManager } from '../../audio/soundManager';
import type { GameId } from '../../games/types';
import { getGame } from '../../games/gameRegistry';

interface PaytableModalProps {
  onClose: () => void;
  activeGameId?: GameId;
}

export const PaytableModal: React.FC<PaytableModalProps> = ({ onClose, activeGameId = 'vault-24k' }) => {
  const gameDef = getGame(activeGameId);
  const isTimber = activeGameId === 'timber-critters';
  const symbols = Object.values(gameDef.symbols);
  const paylines = gameDef.paylines;
  const rows = gameDef.rows;

  React.useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' || e.code === 'Space' || e.code === 'Enter') {
        e.preventDefault();
        e.stopPropagation();
        soundManager.playButtonClick();
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown, { capture: true });
    return () => window.removeEventListener('keydown', handleKeyDown, { capture: true });
  }, [onClose]);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-black/85 backdrop-blur-md select-none overflow-y-auto animate-fadeIn">
      <div className={`relative max-w-2xl w-full bg-casino-950 border-2 ${isTimber ? 'border-emerald-400/80 shadow-[0_0_50px_rgba(16,185,129,0.5)]' : 'border-yellow-400/80 shadow-[0_0_50px_rgba(245,158,11,0.5)]'} rounded-3xl p-4 sm:p-6 max-h-[90vh] flex flex-col`}>
        {/* Header */}
        <div className="flex items-center justify-between pb-3 border-b border-white/10">
          <div className="flex items-center space-x-2">
            <Coins className={`w-5 h-5 ${isTimber ? 'text-emerald-400' : 'text-gold-bright'}`} />
            <h2 className={`text-lg sm:text-xl font-black ${isTimber ? 'text-emerald-300 drop-shadow-[0_0_8px_rgba(16,185,129,0.8)]' : 'gold-gradient-text'} uppercase tracking-wider`}>
              {gameDef.name} Paytable
            </h2>
          </div>
          <button
            onClick={() => {
              soundManager.playButtonClick();
              onClose();
            }}
            className="p-1.5 rounded-xl bg-casino-900 hover:bg-casino-800 text-slate-400 hover:text-white"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Scrollable Content */}
        <div className="overflow-y-auto pr-1 my-3 space-y-5">
          {/* Special Feature Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
            {/* Wild */}
            <div className="bg-casino-900/90 border border-gold-bright/30 rounded-2xl p-3 flex items-center space-x-2.5">
              <div className="w-14 h-14 flex-shrink-0">
                <SymbolRenderer id={isTimber ? 'BEAR' : 'WILD'} />
              </div>
              <div>
                <span className="text-[11px] font-black uppercase text-gold-bright block">
                  {isTimber ? 'Grizzly Bear Wild' : '24K Gold Wild'}
                </span>
                <p className="text-[10px] text-slate-300 leading-tight mt-0.5">
                  {isTimber
                    ? 'Substitutes for all symbols except Owl & Acorn. 5 Wilds awards 1,000x line bet!'
                    : 'Substitutes for all symbols except Scatter & Coin. 5 Wilds awards 1,800x line bet!'}
                </p>
              </div>
            </div>

            {/* Scatter */}
            <div className="bg-casino-900/90 border border-neon-cyan/30 rounded-2xl p-3 flex items-center space-x-2.5">
              <div className="w-14 h-14 flex-shrink-0">
                <SymbolRenderer id={isTimber ? 'OWL' : 'SCATTER'} />
              </div>
              <div>
                <span className="text-[11px] font-black uppercase text-neon-cyan block">
                  {isTimber ? 'Moonlit Owl Scatter' : 'Vault Door Scatter'}
                </span>
                <p className="text-[10px] text-slate-300 leading-tight mt-0.5">
                  {isTimber
                    ? '3+ Moonlit Owls award 10 Free Spins at 3X multiplier with starry animations!'
                    : '3+ Bank Vault doors trigger 10 Free Spins with 3X multipliers and raining $100 bills!'}
                </p>
              </div>
            </div>

            {/* Cash Link Coin */}
            <div className="bg-casino-900/90 border border-amber-400/40 rounded-2xl p-3 flex items-center space-x-2.5">
              <div className="w-14 h-14 flex-shrink-0">
                <SymbolRenderer id={isTimber ? 'ACORN' : 'COIN'} />
              </div>
              <div>
                <span className="text-[11px] font-black uppercase text-amber-300 block">
                  {isTimber ? 'Golden Acorn Cash' : 'Minted Bullion Coin'}
                </span>
                <p className="text-[10px] text-slate-300 leading-tight mt-0.5">
                  {isTimber
                    ? '6+ Golden Acorns trigger the Woodland Cash Link Respins with Mini, Minor, Major & Grand Pots!'
                    : '6+ Golden Bullion Coins trigger the Fort Knox Cash Link Respins with Mini, Minor, Major & Grand Pots!'}
                </p>
              </div>
            </div>
          </div>

          {/* Symbol Payouts Grid */}
          <div>
            <h3 className="text-xs font-black uppercase tracking-wider text-slate-400 mb-2">
              Symbol Multipliers (Line Bet × Multiplier)
            </h3>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
              {symbols.map((sym) => (
                <div
                  key={sym.id}
                  className="bg-casino-900/60 border border-white/5 rounded-xl p-2 flex items-center space-x-2"
                >
                  <div className="w-10 h-10 flex-shrink-0">
                    <SymbolRenderer id={sym.id} />
                  </div>
                  <div className="flex flex-col text-[10.5px]">
                    <span className="font-bold text-slate-200 truncate">{sym.name}</span>
                    <span className="text-slate-400 font-mono">
                      5x: <strong className="text-gold-light">{sym.payouts[5]}x</strong>
                    </span>
                    <span className="text-slate-400 font-mono">
                      4x: <strong className="text-slate-200">{sym.payouts[4]}x</strong>
                    </span>
                    <span className="text-slate-400 font-mono">
                      3x: <strong className="text-slate-300">{sym.payouts[3]}x</strong>
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Paylines Diagrams Preview */}
          <div>
            <h3 className="text-xs font-black uppercase tracking-wider text-slate-400 mb-2">
              {paylines.length} Active Paylines ({gameDef.reels}x{rows} Grid)
            </h3>
            <div className="grid grid-cols-4 sm:grid-cols-8 gap-1.5">
              {paylines.map((pattern, idx) => (
                <div
                  key={idx}
                  className="bg-casino-900/80 border border-white/10 rounded-lg p-1 flex flex-col items-center"
                >
                  <span className="text-[8px] font-bold text-slate-400 mb-0.5">Line {idx + 1}</span>
                  {/* Mini Grid */}
                  <div className="grid grid-cols-5 gap-0.5 w-full">
                    {[0, 1, 2, 3, 4].map((reel) => (
                      <div key={reel} className="flex flex-col gap-0.5">
                        {Array.from({ length: rows }, (_, row) => (
                          <div
                            key={row}
                            className={`h-1.5 rounded-xs ${
                              pattern[reel] === row
                                ? isTimber
                                  ? 'bg-emerald-400 shadow-[0_0_3px_#34D399]'
                                  : 'bg-gold-bright shadow-[0_0_3px_#F59E0B]'
                                : 'bg-casino-950'
                            }`}
                          />
                        ))}
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Footer Note */}
        <div className="pt-2.5 border-t border-white/10 text-center text-[9.5px] text-slate-500">
          SLOTY {gameDef.name} is an authentic Vegas VLT style slot machine with 95.8% certified RTP.
        </div>
      </div>
    </div>
  );
};
