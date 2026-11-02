import React from 'react';
import { X, Sparkles } from 'lucide-react';
import { SYMBOL_LIST } from '../../engine/symbols';
import { SymbolRenderer } from '../slots/SymbolRenderer';
import { PAYLINES } from '../../engine/paylines';
import { soundManager } from '../../audio/soundManager';

interface PaytableModalProps {
  onClose: () => void;
}

export const PaytableModal: React.FC<PaytableModalProps> = ({ onClose }) => {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-black/85 backdrop-blur-md select-none overflow-y-auto">
      <div className="relative max-w-2xl w-full bg-casino-950 border border-white/20 shadow-2xl rounded-3xl p-5 sm:p-7 max-h-[90vh] flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between pb-4 border-b border-white/10">
          <div className="flex items-center space-x-2">
            <Sparkles className="w-5 h-5 text-gold-bright" />
            <h2 className="text-xl sm:text-2xl font-black gold-gradient-text uppercase">
              Paytable & Rules
            </h2>
          </div>
          <button
            onClick={() => {
              soundManager.playButtonClick();
              onClose();
            }}
            className="p-2 rounded-xl bg-casino-900 hover:bg-casino-800 text-slate-400 hover:text-white"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Scrollable Content */}
        <div className="overflow-y-auto pr-1 my-4 space-y-6">
          {/* Special Feature Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div className="bg-casino-900/90 border border-gold-bright/30 rounded-2xl p-3.5 flex items-center space-x-3">
              <div className="w-16 h-16 flex-shrink-0">
                <SymbolRenderer id="WILD" />
              </div>
              <div>
                <span className="text-xs font-black uppercase text-gold-bright block">
                  Wild Crown
                </span>
                <p className="text-[11px] text-slate-300 leading-tight mt-1">
                  Substitutes for all symbols except Scatter. 5 Wilds on any payline awards 1,000x line bet!
                </p>
              </div>
            </div>

            <div className="bg-casino-900/90 border border-neon-cyan/30 rounded-2xl p-3.5 flex items-center space-x-3">
              <div className="w-16 h-16 flex-shrink-0">
                <SymbolRenderer id="SCATTER" />
              </div>
              <div>
                <span className="text-xs font-black uppercase text-neon-cyan block">
                  Bonus Vault (Scatter)
                </span>
                <p className="text-[11px] text-slate-300 leading-tight mt-1">
                  Appears anywhere. 3+ Scatters trigger 10 Free Spins with an automatic 3X multiplier on all wins!
                </p>
              </div>
            </div>
          </div>

          {/* Symbol Payouts Grid */}
          <div>
            <h3 className="text-xs font-black uppercase tracking-wider text-slate-400 mb-2">
              Symbol Multipliers (Line Bet × Payout)
            </h3>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5">
              {SYMBOL_LIST.map((sym) => (
                <div
                  key={sym.id}
                  className="bg-casino-900/60 border border-white/5 rounded-xl p-2.5 flex items-center space-x-2.5"
                >
                  <div className="w-11 h-11 flex-shrink-0">
                    <SymbolRenderer id={sym.id} />
                  </div>
                  <div className="flex flex-col text-[11px]">
                    <span className="font-bold text-slate-200">{sym.name}</span>
                    <span className="text-slate-400">
                      5x: <strong className="text-gold-light">{sym.payouts[5]}x</strong>
                    </span>
                    <span className="text-slate-400">
                      4x: <strong className="text-slate-200">{sym.payouts[4]}x</strong>
                    </span>
                    <span className="text-slate-400">
                      3x: <strong className="text-slate-300">{sym.payouts[3]}x</strong>
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* 20 Paylines Diagrams */}
          <div>
            <h3 className="text-xs font-black uppercase tracking-wider text-slate-400 mb-2">
              20 Payline Patterns
            </h3>
            <div className="grid grid-cols-4 sm:grid-cols-5 gap-2">
              {PAYLINES.map((pattern, idx) => (
                <div
                  key={idx}
                  className="bg-casino-900/80 border border-white/10 rounded-lg p-1.5 flex flex-col items-center"
                >
                  <span className="text-[9px] font-bold text-slate-400 mb-1">Line {idx + 1}</span>
                  {/* Mini 5x3 Grid */}
                  <div className="grid grid-cols-5 gap-0.5 w-full">
                    {[0, 1, 2, 3, 4].map((reel) => (
                      <div key={reel} className="flex flex-col gap-0.5">
                        {[0, 1, 2].map((row) => (
                          <div
                            key={row}
                            className={`h-2.5 rounded-sm ${
                              pattern[reel] === row
                                ? 'bg-gold-bright shadow-[0_0_4px_#F59E0B]'
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
        <div className="pt-3 border-t border-white/10 text-center text-[10px] text-slate-500">
          Vegas Neon Slots is a free-to-play social casino game. All credits and points are virtual and hold no real cash value.
        </div>
      </div>
    </div>
  );
};
