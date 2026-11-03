import React, { useState } from 'react';
import { RefreshCw, Landmark, Coins, X, FastForward, CheckCircle2, Trees } from 'lucide-react';
import { soundManager } from '../../audio/soundManager';
import type { GameId } from '../../games/types';

interface HoldAndSpinModalProps {
  totalBet: number;
  initialCoinCount: number;
  onComplete: (totalWon: number) => void;
  activeGameId?: GameId;
}

interface OrbCell {
  isLocked: boolean;
  value: number;
  jackpot?: 'MINI' | 'MINOR' | 'MAJOR' | 'GRAND';
}

export const HoldAndSpinModal: React.FC<HoldAndSpinModalProps> = ({
  totalBet,
  initialCoinCount,
  onComplete,
  activeGameId = 'vault-24k',
}) => {
  const isTimber = activeGameId === 'timber-critters';
  const [respinsLeft, setRespinsLeft] = useState(3);
  const [isSpinning, setIsSpinning] = useState(false);
  const [isFinished, setIsFinished] = useState(false);

  // Dynamic rows based on game (Timberland = 5x3 = 15, Vault = 5x4 = 20)
  const numRows = isTimber ? 3 : 4;
  const totalPositions = 5 * numRows;

  const [grid, setGrid] = useState<OrbCell[][]>(() => {
    const initial: OrbCell[][] = [];
    let lockedCount = 0;
    const targetLocks = Math.max(isTimber ? 5 : 6, initialCoinCount);

    for (let c = 0; c < 5; c++) {
      const col: OrbCell[] = [];
      for (let r = 0; r < numRows; r++) {
        // Place initial locked coins
        const shouldLock =
          lockedCount < targetLocks &&
          (Math.random() < 0.4 || targetLocks - lockedCount >= totalPositions - (c * numRows + r));
        if (shouldLock) {
          lockedCount++;
          const valMultiplier = [2, 5, 10, 15, 25][Math.floor(Math.random() * 5)];
          col.push({
            isLocked: true,
            value: totalBet * valMultiplier,
          });
        } else {
          col.push({
            isLocked: false,
            value: 0,
          });
        }
      }
      initial.push(col);
    }
    return initial;
  });

  const totalPot = grid.reduce(
    (sum, col) => sum + col.reduce((cSum, cell) => cSum + (cell.isLocked ? cell.value : 0), 0),
    0
  );

  const lockedCellsCount = grid.reduce(
    (count, col) => count + col.filter((cell) => cell.isLocked).length,
    0
  );

  const handleRespin = () => {
    if (isSpinning || respinsLeft <= 0 || isFinished) return;
    setIsSpinning(true);
    soundManager.playSpinStart();

    setTimeout(() => {
      let anyNewLocked = false;
      const nextGrid = grid.map((col) =>
        col.map((cell) => {
          if (cell.isLocked) return cell;

          // 22% chance of landing a new orb on empty position
          if (Math.random() < 0.22) {
            anyNewLocked = true;
            const isMini = Math.random() < 0.08;
            const isMinor = Math.random() < 0.03;
            const isMajor = Math.random() < 0.01;
            const multiplier = [2, 5, 10, 20][Math.floor(Math.random() * 4)];
            const val = isMajor
              ? totalBet * 50
              : isMinor
              ? totalBet * 20
              : isMini
              ? totalBet * 10
              : totalBet * multiplier;
            const jackpotType: 'MINI' | 'MINOR' | 'MAJOR' | undefined = isMajor
              ? 'MAJOR'
              : isMinor
              ? 'MINOR'
              : isMini
              ? 'MINI'
              : undefined;

            return {
              isLocked: true,
              value: val,
              jackpot: jackpotType,
            };
          }
          return cell;
        })
      );

      setGrid(nextGrid);
      setIsSpinning(false);

      if (anyNewLocked) {
        soundManager.playGoldBarClank();
        soundManager.playCoinCascade(6);
        setRespinsLeft(3); // Reset to 3 respins!
      } else {
        const nextRespins = respinsLeft - 1;
        setRespinsLeft(nextRespins);
        soundManager.playReelStop(0);

        if (nextRespins <= 0) {
          setIsFinished(true);
          soundManager.playCashRegister();
          soundManager.playJackpotFanfare();
        }
      }
    }, 450);
  };

  // Fast resolve: simulate remaining respins automatically and finish
  const handleAutoComplete = () => {
    let currentGridState = grid.map((col) => col.map((cell) => ({ ...cell })));
    let currentRespins = respinsLeft;

    while (currentRespins > 0) {
      let newHit = false;
      currentGridState = currentGridState.map((col) =>
        col.map((cell) => {
          if (cell.isLocked) return cell;
          if (Math.random() < 0.25) {
            newHit = true;
            const multiplier = [2, 5, 10, 25][Math.floor(Math.random() * 4)];
            return {
              isLocked: true,
              value: totalBet * multiplier,
            };
          }
          return cell;
        })
      );

      if (newHit) {
        currentRespins = 3;
      } else {
        currentRespins--;
      }
    }

    setGrid(currentGridState);
    setRespinsLeft(0);
    setIsFinished(true);
    soundManager.playCashRegister();
    soundManager.playJackpotFanfare();
  };

  const handleCollectAndExit = () => {
    soundManager.playCashRegister();
    soundManager.playJackpotFanfare();
    onComplete(totalPot);
  };

  React.useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.code === 'Space' || e.code === 'Enter') {
        e.preventDefault();
        e.stopPropagation();
        if (isFinished) {
          handleCollectAndExit();
        } else if (!isSpinning && respinsLeft > 0) {
          handleRespin();
        }
      } else if (e.key === 'Escape') {
        e.preventDefault();
        e.stopPropagation();
        handleCollectAndExit();
      }
    };

    window.addEventListener('keydown', handleKeyDown, { capture: true });
    return () => window.removeEventListener('keydown', handleKeyDown, { capture: true });
  }, [isFinished, isSpinning, respinsLeft, totalPot]);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-4 bg-black/90 backdrop-blur-md select-none animate-fadeIn">
      <div className={`relative max-w-2xl w-full max-h-[92vh] overflow-y-auto rounded-3xl p-3 sm:p-6 flex flex-col items-center ${
        isTimber
          ? 'bg-gradient-to-b from-[#24130a] via-[#101e14] to-[#040c06] border-2 border-emerald-500 shadow-[0_0_60px_rgba(16,185,129,0.5)]'
          : 'bg-gradient-to-b from-amber-950 via-casino-950 to-black border-2 border-yellow-400/80 shadow-[0_0_60px_rgba(245,158,11,0.6)]'
      }`}>
        {/* Header Marquee with Close X Button */}
        <div className={`w-full flex items-center justify-between pb-3 border-b mb-2 ${
          isTimber ? 'border-emerald-600/40' : 'border-yellow-500/30'
        }`}>
          <div className="flex items-center space-x-2">
            {isTimber ? (
              <Trees className="w-6 h-6 text-emerald-400 animate-pulse flex-shrink-0" />
            ) : (
              <Landmark className="w-6 h-6 text-yellow-400 animate-pulse flex-shrink-0" />
            )}
            <div>
              <h2 className={`text-base sm:text-lg font-black uppercase tracking-wider ${
                isTimber ? 'text-emerald-300 drop-shadow-[0_0_10px_rgba(52,211,153,0.8)]' : 'gold-gradient-text'
              }`}>
                {isTimber ? 'Forest Harvest Acorn Respin Bonus' : 'Fort Knox Cash Link Vault Bonus'}
              </h2>
              <span className={`text-[10px] block ${isTimber ? 'text-emerald-200/80' : 'text-yellow-300/80'}`}>
                {isTimber
                  ? 'Lock Golden Acorns to harvest forest bounty • Respins reset to 3 on new acorn'
                  : 'Lock 24K Bullion Coins to collect cash credits • Respins reset to 3 on new coin'}
              </span>
            </div>
          </div>

          <div className="flex items-center space-x-2">
            <div className="flex items-center space-x-1.5 bg-casino-900/90 px-2.5 py-1 rounded-xl border border-yellow-400/30">
              <span className="text-[9px] uppercase font-bold text-slate-400">Respins:</span>
              <div className="flex space-x-1">
                {[...Array(3)].map((_, i) => (
                  <div
                    key={i}
                    className={`w-3 h-3 rounded-full border border-yellow-400 ${
                      i < respinsLeft
                        ? 'bg-yellow-400 shadow-[0_0_8px_#F59E0B] animate-pulse'
                        : 'bg-black/60 opacity-30'
                    }`}
                  />
                ))}
              </div>
            </div>

            {/* Instant Exit X button */}
            <button
              onClick={handleCollectAndExit}
              title="Collect current coins and return to slots"
              className="p-1.5 rounded-lg bg-casino-900 hover:bg-casino-800 border border-white/20 text-slate-300 hover:text-white"
            >
              <X className="w-5 h-5 text-yellow-300" />
            </button>
          </div>
        </div>

        {/* Golden Orb / Acorn Matrix */}
        <div className={`grid grid-cols-5 gap-1.5 sm:gap-2 w-full p-2.5 sm:p-3 rounded-2xl border shadow-inner my-1.5 ${
          isTimber ? 'bg-[#0a120b] border-emerald-600/50' : 'bg-casino-950/90 border-yellow-500/30'
        }`}>
          {grid.map((col, colIdx) => (
            <div key={colIdx} className="flex flex-col gap-1.5 sm:gap-2">
              {col.map((cell, rowIdx) => (
                <div
                  key={rowIdx}
                  className={`${isTimber ? 'h-16 sm:h-22' : 'h-14 sm:h-18'} w-full rounded-xl flex flex-col items-center justify-center p-1 border transition-all duration-200 ${
                    cell.isLocked
                      ? isTimber
                        ? 'bg-gradient-to-b from-amber-400 via-amber-600 to-[#451a03] border-2 border-emerald-300 text-yellow-100 font-black shadow-[0_0_15px_rgba(245,158,11,0.9)] scale-[1.02]'
                        : 'bg-gradient-to-b from-yellow-300 via-amber-400 to-amber-600 border-yellow-100 text-black font-black shadow-[0_0_12px_rgba(245,158,11,0.8)] scale-[1.02]'
                      : isSpinning
                      ? isTimber
                        ? 'bg-emerald-950/30 border-emerald-500/30 animate-pulse'
                        : 'bg-casino-900/40 border-yellow-400/20 animate-pulse'
                      : isTimber
                      ? 'bg-[#150d07] border-white/5'
                      : 'bg-casino-900/20 border-white/5'
                  }`}
                >
                  {cell.isLocked ? (
                    <>
                      {cell.jackpot ? (
                        <span className="text-[8px] sm:text-[9px] font-black uppercase tracking-wider text-rose-950 bg-yellow-200 px-1 rounded shadow-sm">
                          {cell.jackpot}
                        </span>
                      ) : isTimber ? (
                        <span className="text-base sm:text-lg animate-bounce">🌰</span>
                      ) : (
                        <Coins className="w-3.5 h-3.5 text-amber-950" />
                      )}
                      <span className={`text-xs sm:text-sm font-black leading-tight mt-0.5 font-mono ${isTimber ? 'text-amber-200 drop-shadow' : 'text-amber-950'}`}>
                        +${cell.value.toLocaleString()}
                      </span>
                    </>
                  ) : (
                    <div className="w-3.5 h-3.5 rounded-full border border-dashed border-white/15" />
                  )}
                </div>
              ))}
            </div>
          ))}
        </div>

        {/* Total Cash Pot summary */}
        <div className={`flex items-center justify-between w-full px-3 py-2 rounded-xl border my-1.5 ${
          isTimber ? 'bg-[#140c06] border-emerald-600/40' : 'bg-casino-900/80 border-yellow-400/30'
        }`}>
          <div className="flex flex-col">
            <span className="text-[9px] uppercase font-bold text-slate-400">Total Accumulated Cash Win</span>
            <span className="text-lg sm:text-xl font-black text-amber-300 drop-shadow-[0_0_10px_rgba(251,191,36,0.8)] font-mono">
              +${totalPot.toLocaleString()}
            </span>
          </div>

          <div className="text-right">
            <span className="text-[9px] uppercase font-bold text-slate-400 block">
              {isTimber ? 'Locked Golden Acorns' : 'Locked Bullion Coins'}
            </span>
            <span className={`text-sm font-black ${isTimber ? 'text-emerald-300' : 'text-neon-cyan'}`}>
              {lockedCellsCount} / {totalPositions}
            </span>
          </div>
        </div>

        {/* Action Controls: RESPIN / AUTO COMPLETE / TAKE WIN & EXIT */}
        <div className="w-full flex items-center space-x-2 mt-2">
          {isFinished ? (
            <button
              onClick={handleCollectAndExit}
              className="w-full py-3 sm:py-3.5 rounded-2xl bg-gradient-to-r from-emerald-500 via-green-500 to-teal-500 hover:from-emerald-400 hover:to-teal-400 text-black font-black text-sm uppercase tracking-widest shadow-[0_0_25px_rgba(34,197,94,0.7)] animate-pulse hover:scale-[1.01] active:scale-95 flex items-center justify-center space-x-2"
            >
              <CheckCircle2 className="w-5 h-5" />
              <span>COLLECT +${totalPot.toLocaleString()} CASH &amp; RETURN TO SLOTS</span>
              <span className="px-2 py-0.5 rounded bg-black/25 text-[10px] font-mono font-bold">SPACE</span>
            </button>
          ) : (
            <>
              {/* Primary Respin button */}
              <button
                onClick={handleRespin}
                disabled={isSpinning || respinsLeft <= 0}
                className={`flex-1 py-3 rounded-2xl font-black text-xs sm:text-sm uppercase tracking-wider flex items-center justify-center space-x-2 shadow-xl transition-all ${
                  isSpinning
                    ? 'bg-slate-800 text-slate-500 cursor-not-allowed'
                    : 'bg-gradient-to-r from-amber-500 to-yellow-600 hover:from-amber-400 hover:to-yellow-500 text-black shadow-[0_0_20px_rgba(245,158,11,0.6)] hover:scale-[1.01] active:scale-95'
                }`}
              >
                <RefreshCw className={`w-4 h-4 ${isSpinning ? 'animate-spin' : ''}`} />
                <span>{isSpinning ? 'SPINNING...' : `RESPIN (${respinsLeft} LEFT)`}</span>
                {!isSpinning && <span className="px-1.5 py-0.5 rounded bg-black/25 text-[10px] font-mono font-bold">SPACE</span>}
              </button>

              {/* Auto complete remaining respins button */}
              <button
                onClick={handleAutoComplete}
                disabled={isSpinning}
                className="py-3 px-3.5 rounded-2xl bg-indigo-900/60 hover:bg-indigo-800 border border-indigo-400/40 text-indigo-200 font-bold text-xs uppercase flex items-center space-x-1.5 transition-all"
                title="Fast-forward and auto-resolve remaining respins"
              >
                <FastForward className="w-4 h-4 text-indigo-300" />
                <span className="hidden sm:inline">Auto-Complete</span>
              </button>

              {/* Instant Take Win & Exit button */}
              <button
                onClick={handleCollectAndExit}
                className="py-3 px-3.5 rounded-2xl bg-emerald-950/70 hover:bg-emerald-900 border border-emerald-500/40 text-emerald-300 font-bold text-xs uppercase transition-all"
                title="Collect your cash and exit to slots right now"
              >
                Collect &amp; Exit
              </button>
            </>
          )}
        </div>
      </div>
    </div>
  );
};
