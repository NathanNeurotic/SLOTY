import React from 'react';
import { X, Coins } from 'lucide-react';
import { SymbolRenderer } from '../slots/SymbolRenderer';
import { soundManager } from '../../audio/soundManager';
import type { GameId } from '../../games/types';
import type { GameStats } from '../../engine/types';
import { getGame } from '../../games/gameRegistry';

interface PaytableModalProps {
  onClose: () => void;
  activeGameId?: GameId;
  stats?: GameStats;
}

export const PaytableModal: React.FC<PaytableModalProps> = ({
  onClose,
  activeGameId = 'vault-24k',
  stats,
}) => {
  const gameDef = getGame(activeGameId);
  const isTimber = activeGameId === 'timber-critters';
  const isPixel = activeGameId === 'pixel-arcade';
  const isPs2 = activeGameId === 'ps2-legends';
  const symbols = Object.values(gameDef.symbols);
  const paylines = gameDef.paylines;
  const rows = gameDef.rows;
  const numReels = gameDef.reels;

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
      <div
        className={`relative max-w-2xl w-full bg-casino-950 border-2 ${
          isPs2
            ? 'border-[#006FCD] shadow-[0_0_50px_rgba(0,111,205,0.7)]'
            : isPixel
            ? 'border-pink-500 shadow-[0_0_50px_rgba(236,72,153,0.6)]'
            : isTimber
            ? 'border-emerald-400/80 shadow-[0_0_50px_rgba(16,185,129,0.5)]'
            : 'border-yellow-400/80 shadow-[0_0_50px_rgba(245,158,11,0.5)]'
        } rounded-3xl p-4 sm:p-6 max-h-[90vh] flex flex-col`}
      >
        {/* Header */}
        <div className="flex items-center justify-between pb-3 border-b border-white/10">
          <div className="flex items-center space-x-2">
            <Coins
              className={`w-5 h-5 ${
                isPs2
                  ? 'text-[#00F0FF]'
                  : isPixel
                  ? 'text-pink-400'
                  : isTimber
                  ? 'text-emerald-400'
                  : 'text-gold-bright'
              }`}
            />
            <h2
              className={`text-lg sm:text-xl font-black ${
                isPs2
                  ? 'text-cyan-300 drop-shadow-[0_0_8px_#00F0FF]'
                  : isPixel
                  ? 'text-pink-400 drop-shadow-[0_0_8px_#EC4899]'
                  : isTimber
                  ? 'text-emerald-300 drop-shadow-[0_0_8px_rgba(16,185,129,0.8)]'
                  : 'gold-gradient-text'
              } uppercase tracking-wider`}
            >
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
          {stats && (
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 p-2.5 rounded-xl bg-black/50 border border-white/10">
              <div className="flex flex-col">
                <span className="text-[9px] font-bold uppercase tracking-wider text-slate-400">Session Spins</span>
                <span className="text-sm font-black font-mono tabular-nums text-white">{stats.totalSpins.toLocaleString()}</span>
              </div>
              <div className="flex flex-col">
                <span className="text-[9px] font-bold uppercase tracking-wider text-slate-400">Session RTP</span>
                <span className="text-sm font-black font-mono tabular-nums text-emerald-300">
                  {stats.totalWagered > 0 ? `${((stats.totalWon / stats.totalWagered) * 100).toFixed(1)}%` : '—'}
                </span>
              </div>
              <div className="flex flex-col">
                <span className="text-[9px] font-bold uppercase tracking-wider text-slate-400">Best Hit</span>
                <span className="text-sm font-black font-mono tabular-nums text-amber-300">{stats.biggestWin.toLocaleString()}</span>
              </div>
              <div className="flex flex-col">
                <span className="text-[9px] font-bold uppercase tracking-wider text-slate-400">Bonuses Hit</span>
                <span className="text-sm font-black font-mono tabular-nums text-cyan-300">{(stats.freeSpinsPlayed + stats.holdAndSpinsPlayed).toLocaleString()}</span>
              </div>
            </div>
          )}
          {/* Special Feature Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
            {/* Wild */}
            <div className="bg-casino-900/90 border border-gold-bright/30 rounded-2xl p-3 flex items-center space-x-2.5">
              <div className="w-14 h-14 flex-shrink-0">
                <SymbolRenderer
                  id={gameDef.wildId}
                />
              </div>
              <div>
                <span className="text-[11px] font-black uppercase text-gold-bright block">
                  {isPs2
                    ? 'PS2 Hologram Wild'
                    : isPixel
                    ? 'Cyber Joystick Wild'
                    : isTimber
                    ? 'Grizzly Bear Wild'
                    : '24K Gold Wild'}
                </span>
                <p className="text-[10px] text-slate-300 leading-tight mt-0.5">
                  {isPs2
                    ? 'Substitutes for all symbols except DVD & Memory Card. 5 Wilds awards 1,200x line bet!'
                    : isPixel
                    ? 'Substitutes for all symbols except Cartridge & 1-UP Token. 6 Wilds awards 2,500x line bet!'
                    : isTimber
                    ? 'Substitutes for all symbols except Owl & Acorn. 5 Wilds awards 1,000x line bet!'
                    : 'Substitutes for all symbols except Scatter & Coin. 5 Wilds awards 1,800x line bet!'}
                </p>
              </div>
            </div>

            {/* Scatter */}
            <div className="bg-casino-900/90 border border-neon-cyan/30 rounded-2xl p-3 flex items-center space-x-2.5">
              <div className="w-14 h-14 flex-shrink-0">
                <SymbolRenderer
                  id={gameDef.scatterId}
                />
              </div>
              <div>
                <span className="text-[11px] font-black uppercase text-neon-cyan block">
                  {isPs2
                    ? 'Blue Laser DVD Scatter'
                    : isPixel
                    ? 'ROM Cartridge Scatter'
                    : isTimber
                    ? 'Moonlit Owl Scatter'
                    : 'Vault Door Scatter'}
                </span>
                <p className="text-[10px] text-slate-300 leading-tight mt-0.5">
                  {`3+ ${
                    isPs2
                      ? 'Blue Laser DVD-ROM discs award'
                      : isPixel
                      ? 'ROM cartridges trigger'
                      : isTimber
                      ? 'Moonlit Owls award'
                      : 'Bank Vault doors trigger'
                  } ${gameDef.freeSpinsAward} Free Spins at ${gameDef.freeSpinsMultiplier}X multiplier${
                    isPs2
                      ? ' — the long optical marathon, with BIOS crystal audio!'
                      : isPixel
                      ? ' with neon pixel chimes!'
                      : isTimber
                      ? ' with starry night animations!'
                      : ' with raining $100 bills!'
                  }`}
                </p>
              </div>
            </div>

            {/* Cash Link Coin */}
            <div className="bg-casino-900/90 border border-amber-400/40 rounded-2xl p-3 flex items-center space-x-2.5">
              <div className="w-14 h-14 flex-shrink-0">
                <SymbolRenderer
                  id={gameDef.coinId}
                />
              </div>
              <div>
                <span className="text-[11px] font-black uppercase text-amber-300 block">
                  {isPs2
                    ? '8MB Memory Card'
                    : isPixel
                    ? '1-UP Credit Token'
                    : isTimber
                    ? 'Golden Acorn Cash'
                    : 'Minted Bullion Coin'}
                </span>
                <p className="text-[10px] text-slate-300 leading-tight mt-0.5">
                  {isPs2
                    ? '6+ 8MB MagicGate Memory Cards trigger Hold & Spin Respins with Mini, Minor, Major & Grand Jackpots!'
                    : isPixel
                    ? '6+ 1-UP Credit Tokens trigger the Arcade High Score Respins with Mini, Minor, Major & Grand Pots!'
                    : isTimber
                    ? '6+ Golden Acorns trigger the Woodland Cash Link Respins with Mini, Minor, Major & Grand Pots!'
                    : '6+ Golden Bullion Coins trigger the Fort Knox Cash Link Respins with Mini, Minor, Major & Grand Pots!'}
                </p>
              </div>
            </div>
          </div>

          {/* Bonus Features & Jackpots Overview */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
            {/* Grand Jackpot Full Board */}
            <div className="bg-casino-900/80 border border-yellow-500/30 rounded-2xl p-2.5 flex flex-col justify-between">
              <div className="flex items-center space-x-2 mb-1">
                <span className="text-base">🏆</span>
                <span className="text-[11px] font-black uppercase text-yellow-400">Grand Jackpot (Full Board)</span>
              </div>
              <p className="text-[10px] text-slate-300 leading-relaxed">
                Lock all positions during Hold & Spin to win the top Grand Jackpot: +50,000 coins (+500x total bet) plus all locked prize values!
              </p>
            </div>

            {/* Mystery Safecracker Pick */}
            <div className="bg-casino-900/80 border border-emerald-500/30 rounded-2xl p-2.5 flex flex-col justify-between">
              <div className="flex items-center space-x-2 mb-1">
                <span className="text-base">🎁</span>
                <span className="text-[11px] font-black uppercase text-emerald-400">
                  {isPs2 ? 'MagicGate Pick Bonus' : isPixel ? 'Prize Cube Pick' : isTimber ? 'Critter Hollow Pick' : 'Safecracker Pick'}
                </span>
              </div>
              <p className="text-[10px] text-slate-300 leading-relaxed">
                Choose 3 mystery vaults to reveal instant cash bullion, multipliers up to 75x, and extra picks. Selectable anytime in the Double-Up menu!
              </p>
            </div>

            {/* Fever Surge Overdrive */}
            <div className="bg-casino-900/80 border border-purple-500/30 rounded-2xl p-2.5 flex flex-col justify-between">
              <div className="flex items-center space-x-2 mb-1">
                <span className="text-base">⚡</span>
                <span className="text-[11px] font-black uppercase text-purple-400">Fever Surge Overdrive</span>
              </div>
              <p className="text-[10px] text-slate-300 leading-relaxed">
                Spins charge the 100% Fever gauge. When full, 5 turbo-charged overdrive spins unlock with 2x multipliers and electric soundtrack!
              </p>
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
                    {numReels === 6 && sym.payouts[6] !== undefined && (
                      <span className="text-slate-400 font-mono">
                        6x: <strong className="text-gold-light">{sym.payouts[6]}x</strong>
                      </span>
                    )}
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
              {paylines.length} Active Paylines ({numReels}x{rows} Grid)
            </h3>
            <div className="grid grid-cols-4 sm:grid-cols-8 gap-1.5">
              {paylines.map((pattern, idx) => (
                <div
                  key={idx}
                  className="bg-casino-900/80 border border-white/10 rounded-lg p-1 flex flex-col items-center"
                >
                  <span className="text-[8px] font-bold text-slate-400 mb-0.5">Line {idx + 1}</span>
                  {/* Mini Grid */}
                  <div className={`grid gap-0.5 w-full`} style={{ gridTemplateColumns: `repeat(${numReels}, minmax(0, 1fr))` }}>
                    {Array.from({ length: numReels }, (_, reel) => (
                      <div key={reel} className="flex flex-col gap-0.5">
                        {Array.from({ length: rows }, (_, row) => (
                          <div
                            key={row}
                            className={`h-1.5 rounded-xs ${
                              pattern[reel] === row
                                ? isPs2
                                  ? 'bg-[#00F0FF] shadow-[0_0_3px_#00F0FF]'
                                  : isPixel
                                  ? 'bg-pink-400 shadow-[0_0_3px_#EC4899]'
                                  : isTimber
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
        <div className="pt-2.5 border-t border-white/10 text-center text-[9.5px] text-slate-500 font-mono">
          SLOTY is a free-play game — virtual coins only, no real-money gambling, and no regulator certification. {gameDef.name} profile: {gameDef.volatilityLabel}. Math model measured by the repo test suite (test-engine.ts).
        </div>
      </div>
    </div>
  );
};
