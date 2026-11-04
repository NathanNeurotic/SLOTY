import React, { useState } from 'react';
import {
  X,
  Plus,
  RotateCcw,
  CheckCircle2,
  Coins,
} from 'lucide-react';
import type { DebugScenario, GameStats, SymbolGrid, SymbolId } from '../../engine/types';
import { soundManager } from '../../audio/soundManager';
import { SYMBOL_LIST } from '../../engine/symbols';
import { evaluateSpin, generateRandomGrid } from '../../engine/evaluator';

interface DebugDrawerProps {
  isOpen: boolean;
  balance: number;
  currentLevel: number;
  stats: GameStats;
  forcedScenario: DebugScenario | null;
  onClose: () => void;
  onAddCredits: (amount: number) => void;
  onSetBalance: (amount: number) => void;
  onAddXp: (amount: number) => void;
  onSetLevel: (level: number) => void;
  onSetForcedScenario: (scenario: DebugScenario | null) => void;
  onInjectCustomGrid: (grid: SymbolGrid) => void;
  onResetStats: () => void;
}

export const DebugDrawer: React.FC<DebugDrawerProps> = ({
  isOpen,
  balance,
  currentLevel,
  stats,
  forcedScenario,
  onClose,
  onAddCredits,
  onSetBalance,
  onAddXp,
  onSetLevel,
  onSetForcedScenario,
  onInjectCustomGrid,
  onResetStats,
}) => {
  const [customCreditAmount, setCustomCreditAmount] = useState('500000');
  const [customLevelInput, setCustomLevelInput] = useState(String(currentLevel));
  const [activeTab, setActiveTab] = useState<'credits' | 'outcomes' | 'grid' | 'sim' | 'audio'>('credits');

  // Custom Grid Editor state (5 reels x 3 rows)
  const [editingGrid, setEditingGrid] = useState<SymbolGrid>([
    ['WILD', 'CHERRY', 'PLUM'],
    ['WILD', 'MELON', 'BELL'],
    ['WILD', 'SEVEN', 'DIAMOND'],
    ['DIAMOND', 'HORSESHOE', 'CHERRY'],
    ['DIAMOND', 'BELL', 'PLUM'],
  ]);

  // RTP Simulation State
  const [simResults, setSimResults] = useState<{
    spins: number;
    wagered: number;
    won: number;
    rtp: number;
    hitRate: number;
    freeSpinsCount: number;
    maxWin: number;
  } | null>(null);
  const [isSimulating, setIsSimulating] = useState(false);

  if (!isOpen) return null;

  const handleRunSimulation = (spinsCount: number) => {
    setIsSimulating(true);
    setTimeout(() => {
      let totalWagered = 0;
      let totalWon = 0;
      let winningSpins = 0;
      let freeSpinsCount = 0;
      let maxWin = 0;
      const bet = 100;

      for (let i = 0; i < spinsCount; i++) {
        totalWagered += bet;
        const grid = generateRandomGrid();
        const res = evaluateSpin(grid, bet, 20);
        totalWon += res.totalPayout;
        if (res.totalPayout > 0) winningSpins++;
        if (res.isFreeSpinsTriggered) freeSpinsCount++;
        if (res.totalPayout > maxWin) maxWin = res.totalPayout;
      }

      setSimResults({
        spins: spinsCount,
        wagered: totalWagered,
        won: totalWon,
        rtp: Number(((totalWon / totalWagered) * 100).toFixed(2)),
        hitRate: Number(((winningSpins / spinsCount) * 100).toFixed(2)),
        freeSpinsCount,
        maxWin,
      });
      setIsSimulating(false);
    }, 50);
  };

  return (
    <div className="fixed inset-y-0 right-0 z-50 w-full max-w-md bg-casino-950/98 border-l border-emerald-500/40 shadow-2xl flex flex-col select-none backdrop-blur-xl animate-fadeIn">
      {/* Drawer Header */}
      <div className="flex items-center justify-between p-4 border-b border-emerald-500/30 bg-emerald-950/30">
        <div className="flex items-center space-x-2">
          <div className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-ping" />
          <h2 className="text-sm font-mono font-bold tracking-wider text-emerald-400 uppercase">
            Developer Debug Suite
          </h2>
        </div>
        <button
          onClick={() => {
            soundManager.playButtonClick();
            onClose();
          }}
          className="p-1.5 rounded-lg bg-casino-900 hover:bg-casino-800 text-slate-400 hover:text-white"
        >
          <X className="w-4 h-4" />
        </button>
      </div>

      {/* Tabs */}
      <div className="flex border-b border-white/10 bg-casino-900/50 text-[11px] font-mono">
        {(['credits', 'outcomes', 'grid', 'sim', 'audio'] as const).map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`flex-1 py-2.5 text-center font-bold capitalize transition-colors ${
              activeTab === tab
                ? 'text-emerald-400 border-b-2 border-emerald-400 bg-emerald-950/20'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            {tab}
          </button>
        ))}
      </div>

      {/* Drawer Body */}
      <div className="flex-1 overflow-y-auto p-4 space-y-5 font-mono text-xs">
        {/* TAB 1: CREDITS & LEVEL */}
        {activeTab === 'credits' && (
          <div className="space-y-4">
            {/* Live Balance Summary */}
            <div className="flex items-center justify-between p-2.5 bg-casino-900 rounded-xl border border-white/10 text-slate-300">
              <span className="text-[10px] uppercase font-bold text-slate-400">Current Balance:</span>
              <span className="font-bold text-gold-light flex items-center space-x-1">
                <Coins className="w-3.5 h-3.5 text-gold-bright" />
                <span>{balance.toLocaleString()}</span>
              </span>
            </div>

            {/* Quick Credit Injectors */}
            <div>
              <span className="text-[10px] text-slate-400 uppercase font-bold tracking-wider block mb-2">
                Quick Credit Injector
              </span>
              <div className="grid grid-cols-2 gap-2">
                <button
                  onClick={() => onAddCredits(10000)}
                  className="py-2 px-3 rounded-xl bg-casino-900 hover:bg-emerald-950 border border-emerald-500/30 text-emerald-300 font-bold flex items-center justify-center space-x-1"
                >
                  <Plus className="w-3.5 h-3.5" />
                  <span>10,000</span>
                </button>
                <button
                  onClick={() => onAddCredits(100000)}
                  className="py-2 px-3 rounded-xl bg-casino-900 hover:bg-emerald-950 border border-emerald-500/30 text-emerald-300 font-bold flex items-center justify-center space-x-1"
                >
                  <Plus className="w-3.5 h-3.5" />
                  <span>100,000</span>
                </button>
                <button
                  onClick={() => onAddCredits(1000000)}
                  className="py-2 px-3 rounded-xl bg-casino-900 hover:bg-emerald-950 border border-emerald-500/30 text-emerald-300 font-bold flex items-center justify-center space-x-1"
                >
                  <Plus className="w-3.5 h-3.5" />
                  <span>1,000,000</span>
                </button>
                <button
                  onClick={() => onAddCredits(10000000)}
                  className="py-2 px-3 rounded-xl bg-casino-900 hover:bg-emerald-950 border border-emerald-500/30 text-emerald-300 font-bold flex items-center justify-center space-x-1"
                >
                  <Plus className="w-3.5 h-3.5" />
                  <span>10,000,000</span>
                </button>
              </div>
            </div>

            {/* Custom Amount Input */}
            <div>
              <span className="text-[10px] text-slate-400 uppercase font-bold tracking-wider block mb-1.5">
                Custom Coin Amount
              </span>
              <div className="flex space-x-2">
                <input
                  type="number"
                  value={customCreditAmount}
                  onChange={(e) => setCustomCreditAmount(e.target.value)}
                  className="flex-1 bg-casino-900 border border-white/20 rounded-xl px-3 py-2 text-white font-mono focus:outline-none focus:border-emerald-500"
                  placeholder="Enter amount"
                />
                <button
                  onClick={() => {
                    const parsed = parseInt(customCreditAmount, 10);
                    if (!isNaN(parsed) && parsed > 0) onAddCredits(parsed);
                  }}
                  className="px-4 py-2 bg-emerald-600 hover:bg-emerald-500 text-black font-bold rounded-xl"
                >
                  Add
                </button>
              </div>
            </div>

            {/* Balance Reset */}
            <div className="flex space-x-2 pt-2 border-t border-white/10">
              <button
                onClick={() => onSetBalance(50000)}
                className="flex-1 py-2 bg-casino-900 hover:bg-casino-800 border border-white/10 rounded-xl text-slate-300"
              >
                Reset to 50k
              </button>
              <button
                onClick={() => onSetBalance(0)}
                className="flex-1 py-2 bg-rose-950/60 hover:bg-rose-900 border border-rose-500/40 rounded-xl text-rose-300"
              >
                Set to 0 (Bankrupt)
              </button>
            </div>

            {/* VIP Level & XP Controls */}
            <div className="pt-3 border-t border-white/10">
              <span className="text-[10px] text-slate-400 uppercase font-bold tracking-wider block mb-2">
                VIP Level & XP Manipulator
              </span>
              <div className="flex space-x-2 mb-2">
                <button
                  onClick={() => onAddXp(2500)}
                  className="flex-1 py-2 bg-purple-950/60 hover:bg-purple-900 border border-purple-500/40 rounded-xl text-purple-300 font-bold"
                >
                  +2,500 XP
                </button>
                <button
                  onClick={() => onAddXp(10000)}
                  className="flex-1 py-2 bg-purple-950/60 hover:bg-purple-900 border border-purple-500/40 rounded-xl text-purple-300 font-bold"
                >
                  +10,000 XP
                </button>
              </div>
              <div className="flex space-x-2">
                <input
                  type="number"
                  min="1"
                  max="100"
                  value={customLevelInput}
                  onChange={(e) => setCustomLevelInput(e.target.value)}
                  className="w-20 bg-casino-900 border border-white/20 rounded-xl px-2 py-1.5 text-center text-white"
                />
                <button
                  onClick={() => {
                    const lvl = parseInt(customLevelInput, 10);
                    if (!isNaN(lvl) && lvl >= 1) onSetLevel(lvl);
                  }}
                  className="flex-1 py-1.5 bg-casino-800 hover:bg-casino-700 border border-white/10 rounded-xl text-slate-200"
                >
                  Set VIP Level
                </button>
              </div>
            </div>
          </div>
        )}

        {/* TAB 2: FORCE OUTCOME MATRIX */}
        {activeTab === 'outcomes' && (
          <div className="space-y-3">
            <span className="text-[10px] text-slate-400 uppercase font-bold tracking-wider block">
              Rig the Next Spin
            </span>
            <p className="text-[11px] text-slate-400 leading-normal">
              Select an outcome below. The next spin will force these reels, allowing you to test
              celebrations and edge cases:
            </p>

            <div className="space-y-2">
              {[
                {
                  id: 'FIVE_WILDS' as DebugScenario,
                  name: '5x Wilds (Epic Jackpot)',
                  desc: 'Full payline of crowns, 1000x multiplier',
                  color: 'border-yellow-400 text-yellow-300',
                },
                {
                  id: 'FIVE_DIAMONDS' as DebugScenario,
                  name: '5x Diamonds (Mega Win)',
                  desc: 'High tier win celebration',
                  color: 'border-sky-400 text-sky-300',
                },
                {
                  id: 'FIVE_SEVENS' as DebugScenario,
                  name: '5x Blazing 7s',
                  desc: 'Classic Vegas 5-of-a-kind line',
                  color: 'border-red-400 text-red-300',
                },
                {
                  id: 'FREE_SPINS' as DebugScenario,
                  name: '3+ Scatters (Free Spins)',
                  desc: 'Triggers Free Spins at the active game\'s award & multiplier',
                  color: 'border-cyan-400 text-cyan-300',
                },
                {
                  id: 'NEAR_MISS' as DebugScenario,
                  name: 'Near Miss Suspense',
                  desc: 'Scatters on reels 1 & 2; tests suspense reel slowing',
                  color: 'border-amber-400 text-amber-300',
                },
                {
                  id: 'BIG_WIN' as DebugScenario,
                  name: 'Multiple Mid Wins',
                  desc: 'Hits several 4-of-a-kind lines',
                  color: 'border-purple-400 text-purple-300',
                },
                {
                  id: 'NO_WIN' as DebugScenario,
                  name: 'Guaranteed 0 Win',
                  desc: 'Tests dry spin behavior',
                  color: 'border-slate-500 text-slate-400',
                },
              ].map((item) => (
                <button
                  key={item.id}
                  onClick={() => {
                    soundManager.playButtonClick();
                    onSetForcedScenario(forcedScenario === item.id ? null : item.id);
                  }}
                  className={`w-full text-left p-2.5 rounded-xl border transition-all flex items-center justify-between ${
                    forcedScenario === item.id
                      ? `${item.color} bg-white/10 shadow-lg`
                      : 'border-white/10 bg-casino-900/60 hover:bg-casino-900 text-slate-300'
                  }`}
                >
                  <div>
                    <div className="font-bold">{item.name}</div>
                    <div className="text-[10px] text-slate-400">{item.desc}</div>
                  </div>
                  {forcedScenario === item.id && (
                    <CheckCircle2 className="w-5 h-5 text-emerald-400 flex-shrink-0" />
                  )}
                </button>
              ))}
            </div>

            {forcedScenario && (
              <button
                onClick={() => onSetForcedScenario(null)}
                className="w-full py-2 bg-casino-800 hover:bg-casino-700 text-slate-300 rounded-xl text-center mt-2"
              >
                Clear Forced Outcome (Use Random RNG)
              </button>
            )}
          </div>
        )}

        {/* TAB 3: CUSTOM GRID BUILDER */}
        {activeTab === 'grid' && (
          <div className="space-y-3">
            <span className="text-[10px] text-slate-400 uppercase font-bold tracking-wider block">
              5×3 Symbol Grid Editor
            </span>
            <p className="text-[11px] text-slate-400">
              Customize any symbol in the grid, then click &quot;Inject &amp; Evaluate&quot; to test:
            </p>

            <div className="grid grid-cols-5 gap-1.5 p-2 bg-casino-900 rounded-xl border border-white/10">
              {[0, 1, 2, 3, 4].map((reelIdx) => (
                <div key={reelIdx} className="space-y-1.5">
                  <div className="text-[9px] text-center text-slate-400 font-bold">R{reelIdx + 1}</div>
                  {[0, 1, 2].map((rowIdx) => (
                    <select
                      key={rowIdx}
                      value={editingGrid[reelIdx][rowIdx]}
                      onChange={(e) => {
                        const newGrid = editingGrid.map((r) => [...r]);
                        newGrid[reelIdx][rowIdx] = e.target.value as SymbolId;
                        setEditingGrid(newGrid);
                      }}
                      className="w-full bg-casino-950 border border-white/15 text-[10px] p-1 rounded text-white text-center font-bold"
                    >
                      {SYMBOL_LIST.map((s) => (
                        <option key={s.id} value={s.id}>
                          {s.id.substring(0, 4)}
                        </option>
                      ))}
                    </select>
                  ))}
                </div>
              ))}
            </div>

            <button
              onClick={() => {
                soundManager.playButtonClick();
                onInjectCustomGrid(editingGrid);
              }}
              className="w-full py-2.5 bg-emerald-600 hover:bg-emerald-500 text-black font-bold rounded-xl"
            >
              Inject Into Slot Machine
            </button>
          </div>
        )}

        {/* TAB 4: RTP & MATH SIMULATOR */}
        {activeTab === 'sim' && (
          <div className="space-y-3">
            <span className="text-[10px] text-slate-400 uppercase font-bold tracking-wider block">
              High-Speed RTP Math Simulator
            </span>
            <p className="text-[11px] text-slate-400">
              Run batches of spins through the RNG &amp; evaluation engine to verify statistical return:
            </p>

            <div className="flex space-x-2">
              <button
                disabled={isSimulating}
                onClick={() => handleRunSimulation(1000)}
                className="flex-1 py-2 bg-casino-900 hover:bg-casino-800 border border-white/10 rounded-xl text-slate-200"
              >
                1,000 Spins
              </button>
              <button
                disabled={isSimulating}
                onClick={() => handleRunSimulation(10000)}
                className="flex-1 py-2 bg-casino-900 hover:bg-casino-800 border border-white/10 rounded-xl text-slate-200"
              >
                10,000 Spins
              </button>
              <button
                disabled={isSimulating}
                onClick={() => handleRunSimulation(50000)}
                className="flex-1 py-2 bg-emerald-950 border border-emerald-500/40 text-emerald-300 rounded-xl font-bold"
              >
                50,000 Spins
              </button>
            </div>

            {isSimulating && (
              <div className="text-center py-4 text-emerald-400 animate-pulse font-bold">
                Simulating Monte Carlo spins...
              </div>
            )}

            {simResults && !isSimulating && (
              <div className="bg-casino-900 border border-white/10 p-3 rounded-2xl space-y-2">
                <div className="flex justify-between">
                  <span className="text-slate-400">Spins Analyzed:</span>
                  <span className="text-white font-bold">{simResults.spins.toLocaleString()}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400">Total Wagered:</span>
                  <span className="text-white">{simResults.wagered.toLocaleString()}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400">Total Paid Out:</span>
                  <span className="text-white">{simResults.won.toLocaleString()}</span>
                </div>
                <div className="flex justify-between border-t border-white/10 pt-1.5">
                  <span className="text-slate-300 font-bold">Session RTP:</span>
                  <span
                    className={`font-black text-sm ${
                      simResults.rtp >= 90 && simResults.rtp <= 100
                        ? 'text-emerald-400'
                        : 'text-amber-400'
                    }`}
                  >
                    {simResults.rtp}%
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400">Hit Frequency:</span>
                  <span className="text-white">{simResults.hitRate}%</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400">Free Spins Hit:</span>
                  <span className="text-white">{simResults.freeSpinsCount} times</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400">Single Max Win:</span>
                  <span className="text-gold-light font-bold">
                    {simResults.maxWin.toLocaleString()}
                  </span>
                </div>
              </div>
            )}

            {/* Current Session Stats */}
            <div className="pt-3 border-t border-white/10">
              <div className="flex items-center justify-between mb-2">
                <span className="text-[10px] text-slate-400 uppercase font-bold">
                  Live Player Session Stats
                </span>
                <button
                  onClick={onResetStats}
                  className="text-[10px] text-rose-400 hover:underline flex items-center space-x-1"
                >
                  <RotateCcw className="w-3 h-3" />
                  <span>Reset</span>
                </button>
              </div>
              <div className="bg-casino-900/60 p-2.5 rounded-xl space-y-1 text-[11px]">
                <div className="flex justify-between">
                  <span className="text-slate-400">Spins:</span>
                  <span className="text-white">{stats.totalSpins}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400">Wagered:</span>
                  <span className="text-white">{stats.totalWagered.toLocaleString()}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400">Won:</span>
                  <span className="text-white">{stats.totalWon.toLocaleString()}</span>
                </div>
                <div className="flex justify-between font-bold">
                  <span className="text-slate-300">Live RTP:</span>
                  <span className="text-emerald-300">
                    {stats.totalWagered > 0
                      ? `${((stats.totalWon / stats.totalWagered) * 100).toFixed(1)}%`
                      : '0%'}
                  </span>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* TAB 5: AUDIO TEST BOARD */}
        {activeTab === 'audio' && (
          <div className="space-y-3">
            <span className="text-[10px] text-slate-400 uppercase font-bold tracking-wider block">
              Web Audio Synthesizer Soundboard
            </span>
            <p className="text-[11px] text-slate-400">
              Trigger procedural Web Audio synthesis nodes:
            </p>

            <div className="grid grid-cols-2 gap-2">
              <button
                onClick={() => soundManager.playSpinStart()}
                className="p-2.5 bg-casino-900 hover:bg-casino-800 rounded-xl text-left border border-white/10"
              >
                <div className="font-bold text-white">Spin Start</div>
                <div className="text-[10px] text-slate-400">Mechanical whirr</div>
              </button>
              <button
                onClick={() => soundManager.playReelStop(0)}
                className="p-2.5 bg-casino-900 hover:bg-casino-800 rounded-xl text-left border border-white/10"
              >
                <div className="font-bold text-white">Reel Stop (R1)</div>
                <div className="text-[10px] text-slate-400">Low recoil thud</div>
              </button>
              <button
                onClick={() => soundManager.playReelStop(4)}
                className="p-2.5 bg-casino-900 hover:bg-casino-800 rounded-xl text-left border border-white/10"
              >
                <div className="font-bold text-white">Reel Stop (R5)</div>
                <div className="text-[10px] text-slate-400">High pitch settle</div>
              </button>
              <button
                onClick={() => soundManager.playScatterLand(1)}
                className="p-2.5 bg-casino-900 hover:bg-casino-800 rounded-xl text-left border border-white/10"
              >
                <div className="font-bold text-white">Scatter Hit</div>
                <div className="text-[10px] text-slate-400">Harmonic bell chime</div>
              </button>
              <button
                onClick={() => soundManager.playAnticipationLoop()}
                className="p-2.5 bg-casino-900 hover:bg-casino-800 rounded-xl text-left border border-white/10"
              >
                <div className="font-bold text-white">Anticipation Heartbeat</div>
                <div className="text-[10px] text-slate-400">Tension pulse</div>
              </button>
              <button
                onClick={() => soundManager.playCoinTally()}
                className="p-2.5 bg-casino-900 hover:bg-casino-800 rounded-xl text-left border border-white/10"
              >
                <div className="font-bold text-white">Coin Tally</div>
                <div className="text-[10px] text-slate-400">Counter tick</div>
              </button>
              <button
                onClick={() => soundManager.playWinChime(10)}
                className="p-2.5 bg-casino-900 hover:bg-casino-800 rounded-xl text-left border border-white/10"
              >
                <div className="font-bold text-white">Win Chime</div>
                <div className="text-[10px] text-slate-400">Pentatonic arpeggio</div>
              </button>
              <button
                onClick={() => soundManager.playJackpotFanfare()}
                className="p-2.5 bg-amber-950/60 hover:bg-amber-900 rounded-xl text-left border border-amber-500/40 text-amber-300"
              >
                <div className="font-bold">Jackpot Fanfare</div>
                <div className="text-[10px] text-amber-400/80">Victory synth chords</div>
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Drawer Footer Info */}
      <div className="p-3 border-t border-white/10 text-[10px] text-slate-500 bg-casino-900/60 flex items-center justify-between">
        <span>Hotkey: Press `~` or `D` to toggle</span>
        <span className="text-emerald-400">DEBUG ACTIVE</span>
      </div>
    </div>
  );
};
