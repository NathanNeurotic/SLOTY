import React, { useState } from 'react';
import { RefreshCw, Trophy, Coins } from 'lucide-react';
import { soundManager } from '../../audio/soundManager';

interface HoldAndSpinModalProps {
  totalBet: number;
  initialCoinCount: number;
  onComplete: (totalWon: number) => void;
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
}) => {
  const [respinsLeft, setRespinsLeft] = useState(3);
  const [isSpinning, setIsSpinning] = useState(false);
  const [isFinished, setIsFinished] = useState(false);

  // 5 columns x 4 rows = 20 positions
  const [grid, setGrid] = useState<OrbCell[][]>(() => {
    const initial: OrbCell[][] = [];
    let lockedCount = 0;
    const targetLocks = Math.max(6, initialCoinCount);

    for (let c = 0; c < 5; c++) {
      const col: OrbCell[] = [];
      for (let r = 0; r < 4; r++) {
        // Place initial locked coins
        const shouldLock = lockedCount < targetLocks && (Math.random() < 0.4 || targetLocks - lockedCount >= (20 - (c * 4 + r)));
        if (shouldLock) {
          lockedCount++;
          const valMultiplier = [1, 2, 5, 10, 20][Math.floor(Math.random() * 5)];
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

          // 25% chance of landing a new orb on empty position
          if (Math.random() < 0.25) {
            anyNewLocked = true;
            const isMini = Math.random() < 0.08;
            const isMinor = Math.random() < 0.03;
            const isMajor = Math.random() < 0.01;
            const multiplier = [1, 2, 5, 10, 25][Math.floor(Math.random() * 5)];
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
        soundManager.playCoinTally();
        setRespinsLeft(3); // Reset to 3 respins!
      } else {
        const nextRespins = respinsLeft - 1;
        setRespinsLeft(nextRespins);
        soundManager.playReelStop(0);

        if (nextRespins <= 0) {
          setIsFinished(true);
          soundManager.playWinChime(15);
        }
      }
    }, 700);
  };

  const handleCollect = () => {
    soundManager.playJackpotFanfare();
    onComplete(totalPot);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-4 bg-black/90 backdrop-blur-md select-none animate-fadeIn">
      <div className="relative max-w-2xl w-full bg-gradient-to-b from-amber-950 via-casino-950 to-black border-2 border-yellow-400/80 shadow-[0_0_60px_rgba(245,158,11,0.6)] rounded-3xl p-4 sm:p-6 flex flex-col items-center">
        {/* Header Marquee */}
        <div className="w-full flex items-center justify-between pb-3 border-b border-yellow-500/30 mb-3">
          <div className="flex items-center space-x-2">
            <Trophy className="w-6 h-6 text-yellow-400 animate-bounce" />
            <div>
              <h2 className="text-base sm:text-xl font-black gold-gradient-text uppercase tracking-wider">
                Cash Link Hold &amp; Spin
              </h2>
              <span className="text-[10px] text-yellow-300/80 block">
                OREGON LOTTERY VLT RESPIN BONUS
              </span>
            </div>
          </div>

          <div className="flex items-center space-x-3 bg-casino-900/90 px-3 py-1.5 rounded-xl border border-yellow-400/30">
            <div className="flex flex-col items-center">
              <span className="text-[9px] uppercase font-bold text-slate-400">Respins Left</span>
              <div className="flex space-x-1 mt-0.5">
                {[...Array(3)].map((_, i) => (
                  <div
                    key={i}
                    className={`w-3.5 h-3.5 rounded-full border border-yellow-400 ${
                      i < respinsLeft
                        ? 'bg-yellow-400 shadow-[0_0_8px_#F59E0B] animate-pulse'
                        : 'bg-black/60 opacity-30'
                    }`}
                  />
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* 5x4 Orb Matrix */}
        <div className="grid grid-cols-5 gap-1.5 sm:gap-2 w-full p-2.5 sm:p-3 bg-casino-950/90 rounded-2xl border border-yellow-500/30 shadow-inner my-2">
          {grid.map((col, colIdx) => (
            <div key={colIdx} className="flex flex-col gap-1.5 sm:gap-2">
              {col.map((cell, rowIdx) => (
                <div
                  key={rowIdx}
                  className={`h-16 sm:h-20 w-full rounded-xl flex flex-col items-center justify-center p-1 border transition-all duration-300 ${
                    cell.isLocked
                      ? 'bg-gradient-to-b from-yellow-400 via-amber-500 to-amber-700 border-yellow-200 text-black font-black shadow-[0_0_15px_rgba(245,158,11,0.8)] scale-[1.02] animate-bounce-soft'
                      : isSpinning
                      ? 'bg-casino-900/40 border-yellow-400/20 animate-pulse'
                      : 'bg-casino-900/20 border-white/5'
                  }`}
                >
                  {cell.isLocked ? (
                    <>
                      {cell.jackpot ? (
                        <span className="text-[9px] sm:text-[10px] font-black uppercase tracking-wider text-rose-900 bg-yellow-200 px-1 rounded">
                          {cell.jackpot}
                        </span>
                      ) : (
                        <Coins className="w-3.5 h-3.5 text-amber-900" />
                      )}
                      <span className="text-xs sm:text-sm font-black leading-tight mt-0.5">
                        +{cell.value.toLocaleString()}
                      </span>
                    </>
                  ) : (
                    <div className="w-4 h-4 rounded-full border border-dashed border-white/20" />
                  )}
                </div>
              ))}
            </div>
          ))}
        </div>

        {/* Current Total Cash Pot */}
        <div className="flex items-center justify-between w-full px-4 py-2.5 bg-casino-900/80 rounded-xl border border-yellow-400/30 my-2">
          <div className="flex flex-col">
            <span className="text-[10px] uppercase font-bold text-slate-400">Total Bonus Win</span>
            <span className="text-xl sm:text-2xl font-black text-amber-300 drop-shadow-[0_0_10px_rgba(251,191,36,0.8)]">
              +{totalPot.toLocaleString()} COINS
            </span>
          </div>

          <div className="text-right">
            <span className="text-[10px] uppercase font-bold text-slate-400 block">Locked Orbs</span>
            <span className="text-sm font-black text-neon-cyan">
              {lockedCellsCount} / 20
            </span>
          </div>
        </div>

        {/* Respin / Collect Button */}
        {isFinished ? (
          <button
            onClick={handleCollect}
            className="w-full py-3.5 sm:py-4 rounded-2xl bg-gradient-to-r from-emerald-500 via-green-500 to-teal-500 hover:from-emerald-400 hover:to-teal-400 text-black font-black text-sm sm:text-base uppercase tracking-widest shadow-[0_0_25px_rgba(34,197,94,0.7)] animate-pulse hover:scale-[1.02] active:scale-95"
          >
            COLLECT +{totalPot.toLocaleString()} COINS!
          </button>
        ) : (
          <button
            onClick={handleRespin}
            disabled={isSpinning || respinsLeft <= 0}
            className={`w-full py-3 sm:py-3.5 rounded-2xl font-black text-sm uppercase tracking-wider flex items-center justify-center space-x-2 shadow-xl transition-all ${
              isSpinning
                ? 'bg-slate-800 text-slate-500 cursor-not-allowed'
                : 'bg-gradient-to-r from-amber-500 to-yellow-600 hover:from-amber-400 hover:to-yellow-500 text-black shadow-[0_0_20px_rgba(245,158,11,0.6)] hover:scale-[1.02] active:scale-95'
            }`}
          >
            <RefreshCw className={`w-4 h-4 ${isSpinning ? 'animate-spin' : ''}`} />
            <span>{isSpinning ? 'SPINNING ORBS...' : `RESPIN (${respinsLeft} LEFT)`}</span>
          </button>
        )}
      </div>
    </div>
  );
};
