import React, { useState, useEffect, useCallback, useRef } from 'react';
import type {
  DebugScenario,
  GameStats,
  SpinResult,
  SymbolGrid,
  WinTier,
} from './engine/types';
import { calculateProgression, getLevelUpReward } from './engine/progression';
import {
  evaluateSpin,
  generateForcedGrid,
  generateRandomGrid,
} from './engine/evaluator';
import { soundManager } from './audio/soundManager';
import { storage } from './utils/storage';
import { HeaderBar } from './components/hud/HeaderBar';
import { JackpotMarquee } from './components/hud/JackpotMarquee';
import { VegasTicker } from './components/hud/VegasTicker';
import { VegasAmbience } from './components/hud/VegasAmbience';
import { FeverMeter } from './components/hud/FeverMeter';
import { SlotMachine } from './components/slots/SlotMachine';
import { ControlsBar } from './components/controls/ControlsBar';
import { launchCoinFountain } from './fx/celebrations';
import { WinCelebrationModal } from './components/modals/WinCelebrationModal';
import { FreeSpinsModal } from './components/modals/FreeSpinsModal';
import { DailyBonusModal } from './components/modals/DailyBonusModal';
import { PaytableModal } from './components/modals/PaytableModal';
import { LevelUpModal } from './components/modals/LevelUpModal';
import { GambleModal } from './components/modals/GambleModal';
import { HoldAndSpinModal } from './components/modals/HoldAndSpinModal';
import { DebugDrawer } from './components/debug/DebugDrawer';

const BONUS_COOLDOWN_MS = 4 * 60 * 60 * 1000; // 4 hours

export const App: React.FC = () => {
  // --- Persistent Storage State (Dual LocalStorage + Cookie Mirroring) ---
  const [balance, setBalance] = useState<number>(() =>
    storage.getNumber('sloty_balance', 50000)
  );

  const [totalXp, setTotalXp] = useState<number>(() =>
    storage.getNumber('sloty_xp', 0)
  );

  const [lastBonusClaimTime, setLastBonusClaimTime] = useState<number>(() =>
    storage.getNumber('sloty_bonus_time', 0)
  );

  const [isMuted, setIsMuted] = useState<boolean>(() =>
    storage.getBoolean('sloty_muted', false)
  );

  const [stats, setStats] = useState<GameStats>(() =>
    storage.getJSON<GameStats>('sloty_stats', {
      totalSpins: 0,
      totalWagered: 0,
      totalWon: 0,
      biggestWin: 0,
      freeSpinsPlayed: 0,
      holdAndSpinsPlayed: 0,
    })
  );

  // --- Active Game & Bet State (Persisted) ---
  const [selectedLines, setSelectedLines] = useState<number>(() =>
    storage.getNumber('sloty_lines', 40)
  );
  const [betPerLine, setBetPerLine] = useState<number>(() =>
    storage.getNumber('sloty_bet_per_line', 5)
  );
  const totalBet = selectedLines * betPerLine;

  const [isSpinning, setIsSpinning] = useState(false);
  const [isTurbo, setIsTurbo] = useState<boolean>(() =>
    storage.getBoolean('sloty_turbo', false)
  );
  const [winAmount, setWinAmount] = useState(0);
  const [freeSpinsRemaining, setFreeSpinsRemaining] = useState(0);
  const [autoSpinsRemaining, setAutoSpinsRemaining] = useState(0);
  const [feverCharge, setFeverCharge] = useState<number>(() =>
    storage.getNumber('sloty_fever_charge', 35)
  );
  const [feverSpinsLeft, setFeverSpinsLeft] = useState(0);

  // Initial 5 reels x 4 rows grid (Persisted)
  const [currentGrid, setCurrentGrid] = useState<SymbolGrid>(() =>
    storage.getJSON<SymbolGrid>('sloty_grid', [
      ['SEVEN', 'DIAMOND', 'BELL', 'JACK'],
      ['WILD', 'SEVEN', 'MELON', 'QUEEN'],
      ['DIAMOND', 'GOLDBAR', 'GRAPES', 'KING'],
      ['HORSESHOE', 'BELL', 'COIN', 'ACE'],
      ['MELON', 'SEVEN', 'HORSESHOE', 'WILD'],
    ])
  );

  // Save to dual localStorage + cookies on change
  useEffect(() => {
    storage.setItem('sloty_balance', balance.toString());
  }, [balance]);

  useEffect(() => {
    storage.setItem('sloty_xp', totalXp.toString());
  }, [totalXp]);

  useEffect(() => {
    storage.setItem('sloty_bonus_time', lastBonusClaimTime.toString());
  }, [lastBonusClaimTime]);

  useEffect(() => {
    storage.setItem('sloty_muted', isMuted.toString());
    soundManager.setMuted(isMuted);
  }, [isMuted]);

  useEffect(() => {
    storage.setJSON('sloty_stats', stats);
  }, [stats]);

  useEffect(() => {
    storage.setItem('sloty_lines', selectedLines.toString());
  }, [selectedLines]);

  useEffect(() => {
    storage.setItem('sloty_bet_per_line', betPerLine.toString());
  }, [betPerLine]);

  useEffect(() => {
    storage.setItem('sloty_turbo', isTurbo.toString());
  }, [isTurbo]);

  useEffect(() => {
    storage.setItem('sloty_fever_charge', feverCharge.toString());
  }, [feverCharge]);

  useEffect(() => {
    storage.setJSON('sloty_grid', currentGrid);
  }, [currentGrid]);

  // --- Derived Progression State ---
  const progression = calculateProgression(totalXp);
  const prevLevelRef = useRef<number>(progression.level);

  const [spinResult, setSpinResult] = useState<SpinResult | null>(null);
  const [forcedScenario, setForcedScenario] = useState<DebugScenario | null>(null);
  const pendingResultRef = useRef<SpinResult | null>(null);

  // --- Modals State ---
  const [celebration, setCelebration] = useState<{ tier: WinTier; amount: number } | null>(null);
  const [showFreeSpinsModal, setShowFreeSpinsModal] = useState(false);
  const [showHoldAndSpinModal, setShowHoldAndSpinModal] = useState(false);
  const [holdAndSpinInitialCoins, setHoldAndSpinInitialCoins] = useState(6);
  const [showGambleModal, setShowGambleModal] = useState(false);
  const [showBonusWheelModal, setShowBonusWheelModal] = useState(false);
  const [showPaytableModal, setShowPaytableModal] = useState(false);
  const [levelUpData, setLevelUpData] = useState<{
    newLevel: number;
    bonusCoins: number;
    newMaxBet: number;
  } | null>(null);
  const [showDebugDrawer, setShowDebugDrawer] = useState(false);

  // --- Bonus Countdown Timer ---
  const [timeUntilBonus, setTimeUntilBonus] = useState('');
  const canClaimBonus = Date.now() - lastBonusClaimTime >= BONUS_COOLDOWN_MS;

  useEffect(() => {
    const updateCountdown = () => {
      const remainingMs = BONUS_COOLDOWN_MS - (Date.now() - lastBonusClaimTime);
      if (remainingMs <= 0) {
        setTimeUntilBonus('CLAIM NOW!');
      } else {
        const hours = Math.floor(remainingMs / (1000 * 60 * 60));
        const minutes = Math.floor((remainingMs % (1000 * 60 * 60)) / (1000 * 60));
        const seconds = Math.floor((remainingMs % (1000 * 60)) / 1000);
        setTimeUntilBonus(
          `${hours.toString().padStart(2, '0')}:${minutes
            .toString()
            .padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`
        );
      }
    };

    updateCountdown();
    const interval = setInterval(updateCountdown, 1000);
    return () => clearInterval(interval);
  }, [lastBonusClaimTime]);

  // --- Main Spin Logic ---
  const executeSpin = useCallback(() => {
    const isFreeSpin = freeSpinsRemaining > 0;

    // Balance check
    if (!isFreeSpin && balance < totalBet) {
      soundManager.playButtonClick();
      setAutoSpinsRemaining(0);
      alert('Out of coins! Open the Lucky Bonus Wheel or use the Debug menu to add credits.');
      return;
    }

    // Deduct wager and add XP
    if (!isFreeSpin) {
      setBalance((b) => b - totalBet);
      setTotalXp((xp) => xp + totalBet);
      setStats((s) => ({
        ...s,
        totalSpins: s.totalSpins + 1,
        totalWagered: s.totalWagered + totalBet,
      }));
    } else {
      setStats((s) => ({
        ...s,
        totalSpins: s.totalSpins + 1,
        freeSpinsPlayed: s.freeSpinsPlayed + 1,
      }));
    }

    soundManager.playSpinStart();
    setIsSpinning(true);
    setWinAmount(0);
    setSpinResult(null); // Keep results hidden while reels are spinning

    // Generate grid: check forced scenario first, then random
    const nextGrid = forcedScenario
      ? generateForcedGrid(forcedScenario)
      : generateRandomGrid();

    // Reset one-time forced scenario
    if (forcedScenario) setForcedScenario(null);

    // Free spins gives 3x multiplier, Fever Mode gives 2x
    const multiplier = (isFreeSpin ? 3 : 1) * (feverSpinsLeft > 0 ? 2 : 1);
    const evaluated = evaluateSpin(nextGrid, totalBet, selectedLines, multiplier);

    if (feverSpinsLeft === 0) {
      setFeverCharge((c) => Math.min(100, c + 3));
    }

    pendingResultRef.current = evaluated;
    setCurrentGrid(nextGrid);
  }, [balance, totalBet, selectedLines, freeSpinsRemaining, forcedScenario, feverSpinsLeft]);

  // Handle completion when all 5 reels stop
  const handleAllReelsStopped = useCallback(() => {
    setIsSpinning(false);
    const result = pendingResultRef.current;
    if (!result) return;

    setSpinResult(result);
    const { totalPayout, winTier, isFreeSpinsTriggered, isHoldAndSpinTriggered, coinCount } = result;

    // Reliably credit win amount to player's balance!
    if (totalPayout > 0) {
      setBalance((b) => b + totalPayout);
      setWinAmount(totalPayout);
      setStats((s) => ({
        ...s,
        totalWon: s.totalWon + totalPayout,
        biggestWin: Math.max(s.biggestWin, totalPayout),
      }));

      if (feverSpinsLeft === 0) {
        setFeverCharge((c) => {
          const next = Math.min(100, c + 18);
          if (next >= 100) {
            setTimeout(() => {
              setFeverSpinsLeft(5);
              setFeverCharge(0);
              soundManager.playFeverSurge();
              soundManager.speakAnnouncer("Hyper Fever Mode!");
              launchCoinFountain('jackpot');
            }, 800);
          }
          return next >= 100 ? 100 : next;
        });
      }

      // Trigger tiered celebrations & voice announcements
      if (winTier === 'EPIC_JACKPOT' || winTier === 'MEGA_WIN') {
        soundManager.playJackpotSiren();
        soundManager.speakAnnouncer(winTier === 'EPIC_JACKPOT' ? "Epic Jackpot! Congratulations!" : "Mega Win!");
        setCelebration({ tier: winTier, amount: totalPayout });
      } else if (winTier === 'BIG_WIN') {
        soundManager.playCelebrationWhistle();
        soundManager.speakAnnouncer("Big Win!");
        setCelebration({ tier: winTier, amount: totalPayout });
      } else {
        soundManager.playWinChime(winTier === 'REGULAR' ? 3 : 1);
        if (totalPayout >= totalBet * 2) {
          launchCoinFountain('big');
        }
      }
    }

    // Free Spins Triggered
    if (isFreeSpinsTriggered) {
      soundManager.speakAnnouncer("Free Spins Bonus Round!");
      setShowFreeSpinsModal(true);
    }

    // Hold & Spin Cash Respins Triggered
    if (isHoldAndSpinTriggered) {
      soundManager.speakAnnouncer("Cash Link Hold and Spin!");
      setHoldAndSpinInitialCoins(coinCount);
      setShowHoldAndSpinModal(true);
    }

    // Check VIP Level Up
    const currentProgression = calculateProgression(totalXp);
    if (currentProgression.level > prevLevelRef.current) {
      const reward = getLevelUpReward(currentProgression.level);
      soundManager.speakAnnouncer("Level Up!");
      setLevelUpData({
        newLevel: currentProgression.level,
        bonusCoins: reward,
        newMaxBet: currentProgression.maxBet,
      });
      prevLevelRef.current = currentProgression.level;
    }

    // Handle Free Spins Sequence
    if (freeSpinsRemaining > 0) {
      setFreeSpinsRemaining((prev) => prev - 1);
    }

    // Handle Fever Spins Sequence
    if (feverSpinsLeft > 0) {
      setFeverSpinsLeft((prev) => prev - 1);
    }
  }, [totalXp, freeSpinsRemaining, feverSpinsLeft, totalBet]);

  // Quick Stop Handler
  const handleQuickStop = useCallback(() => {
    if (!isSpinning) return;
    handleAllReelsStopped();
  }, [isSpinning, handleAllReelsStopped]);

  // Max Bet Handler
  const handleMaxBet = useCallback(() => {
    setSelectedLines(40);
    // Find highest bet per line that stays <= maxBet
    const allowableBetPerLine = Math.max(1, Math.floor(progression.maxBet / 40));
    setBetPerLine(allowableBetPerLine);
  }, [progression.maxBet]);

  // Handle continuous Auto-Spins and Free-Spins cadence
  useEffect(() => {
    if (
      isSpinning ||
      celebration !== null ||
      showFreeSpinsModal ||
      showHoldAndSpinModal ||
      showGambleModal ||
      levelUpData !== null
    ) {
      return;
    }

    // Next Free Spin
    if (freeSpinsRemaining > 0) {
      const timer = setTimeout(() => {
        executeSpin();
      }, isTurbo ? 500 : 1100);
      return () => clearTimeout(timer);
    }

    // Next Auto Spin
    if (autoSpinsRemaining > 0) {
      const timer = setTimeout(() => {
        setAutoSpinsRemaining((prev) => prev - 1);
        executeSpin();
      }, isTurbo ? 500 : 1100);
      return () => clearTimeout(timer);
    }
  }, [
    isSpinning,
    freeSpinsRemaining,
    autoSpinsRemaining,
    celebration,
    showFreeSpinsModal,
    showHoldAndSpinModal,
    showGambleModal,
    levelUpData,
    executeSpin,
    isTurbo,
  ]);

  // --- Keyboard Shortcuts ---
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Avoid hotkeys when typing in debug input
      if (e.target instanceof HTMLInputElement || e.target instanceof HTMLSelectElement) {
        return;
      }

      if (e.code === 'Space' || e.code === 'Enter') {
        e.preventDefault();
        if (celebration !== null || showFreeSpinsModal || showHoldAndSpinModal || showGambleModal) {
          return;
        }
        if (isSpinning) {
          handleQuickStop();
        } else {
          executeSpin();
        }
      } else if (e.key === '`' || e.key === '~' || e.key === 'd' || e.key === 'D') {
        setShowDebugDrawer((prev) => !prev);
      } else if (e.key === 'm' || e.key === 'M') {
        setIsMuted((prev) => !prev);
      } else if (e.key === 't' || e.key === 'T') {
        setIsTurbo((prev) => !prev);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [
    isSpinning,
    celebration,
    showFreeSpinsModal,
    showHoldAndSpinModal,
    showGambleModal,
    executeSpin,
    handleQuickStop,
  ]);

  return (
    <div className="min-h-screen bg-casino-950 text-slate-100 flex flex-col justify-between selection:bg-gold selection:text-black relative overflow-x-hidden">
      {/* Dynamic Vegas Sky Searchlights & Stardust Particle Field */}
      <VegasAmbience />

      {/* Header Bar */}
      <HeaderBar
        balance={balance}
        progression={progression}
        isMuted={isMuted}
        canClaimBonus={canClaimBonus}
        timeUntilBonus={timeUntilBonus}
        onToggleMute={() => setIsMuted((prev) => !prev)}
        onOpenPaytable={() => setShowPaytableModal(true)}
        onOpenBonusWheel={() => setShowBonusWheelModal(true)}
        onToggleDebug={() => setShowDebugDrawer((prev) => !prev)}
      />

      {/* Main Gaming Stage */}
      <main className="relative z-10 flex-1 flex flex-col items-center justify-center py-1 sm:py-3 w-full">
        {/* 4-Tier Vegas & Oregon Lottery Progressive Jackpots */}
        <JackpotMarquee totalBet={totalBet} />

        {/* Live Casino LED Marquee Ticker */}
        <VegasTicker freeSpinsRemaining={freeSpinsRemaining} />

        {/* Hyper Fever Overdrive Super Meter */}
        <FeverMeter charge={feverCharge} feverSpinsLeft={feverSpinsLeft} />

        <SlotMachine
          currentGrid={currentGrid}
          isSpinning={isSpinning}
          spinResult={spinResult}
          isTurbo={isTurbo}
          selectedLines={selectedLines}
          onSelectLines={(lines) => setSelectedLines(lines)}
          onAllReelsStopped={handleAllReelsStopped}
          onQuickStop={handleQuickStop}
          freeSpinsRemaining={freeSpinsRemaining}
          onSpin={executeSpin}
          canSpin={balance >= totalBet || freeSpinsRemaining > 0 || feverSpinsLeft > 0}
          isFeverMode={feverSpinsLeft > 0}
        />

        <ControlsBar
          balance={balance}
          selectedLines={selectedLines}
          betPerLine={betPerLine}
          totalBet={totalBet}
          maxBet={progression.maxBet}
          winAmount={winAmount}
          isSpinning={isSpinning}
          isTurbo={isTurbo}
          autoSpinsRemaining={autoSpinsRemaining}
          freeSpinsRemaining={freeSpinsRemaining}
          onSpin={executeSpin}
          onQuickStop={handleQuickStop}
          onLinesChange={(lines) => setSelectedLines(lines)}
          onBetPerLineChange={(bet) => setBetPerLine(bet)}
          onMaxBet={handleMaxBet}
          onTurboToggle={() => setIsTurbo((prev) => !prev)}
          onAutoSpinStart={(count) => {
            setAutoSpinsRemaining(count);
            executeSpin();
          }}
          onAutoSpinStop={() => setAutoSpinsRemaining(0)}
          onOpenGamble={() => setShowGambleModal(true)}
        />
      </main>

      {/* Footer info banner */}
      <footer className="relative z-10 py-1.5 border-t border-white/5 text-center text-[10px] text-slate-500 bg-casino-950/80">
        PRESS <kbd className="px-1.5 py-0.5 bg-casino-900 border border-white/10 rounded text-slate-300 font-mono">SPACE</kbd> TO SPIN / QUICK STOP • <kbd className="px-1.5 py-0.5 bg-casino-900 border border-white/10 rounded text-slate-300 font-mono">~</kbd> OR <kbd className="px-1.5 py-0.5 bg-casino-900 border border-white/10 rounded text-slate-300 font-mono">D</kbd> FOR DEBUG CREDITS &amp; RIG REELS
      </footer>

      {/* --- Modals & Overlays --- */}

      {/* Win Celebration Modal */}
      {celebration && (
        <WinCelebrationModal
          winTier={celebration.tier}
          winAmount={celebration.amount}
          onDismiss={() => setCelebration(null)}
        />
      )}

      {/* Oregon Lottery Video Poker Double-Up Gamble Modal */}
      {showGambleModal && (
        <GambleModal
          initialPot={winAmount}
          onCollect={(doubledPot) => {
            const addedDifference = doubledPot - winAmount;
            setBalance((b) => b + addedDifference);
            setWinAmount(doubledPot);
            setShowGambleModal(false);
          }}
          onLose={() => {
            setBalance((b) => b - winAmount);
            setWinAmount(0);
            setShowGambleModal(false);
          }}
          onClose={() => setShowGambleModal(false)}
        />
      )}

      {/* Cash Link Hold & Spin Modal */}
      {showHoldAndSpinModal && (
        <HoldAndSpinModal
          totalBet={totalBet}
          initialCoinCount={holdAndSpinInitialCoins}
          onComplete={(bonusWon) => {
            setBalance((b) => b + bonusWon);
            setWinAmount(bonusWon);
            setStats((s) => ({
              ...s,
              totalWon: s.totalWon + bonusWon,
              biggestWin: Math.max(s.biggestWin, bonusWon),
              holdAndSpinsPlayed: s.holdAndSpinsPlayed + 1,
            }));
            setShowHoldAndSpinModal(false);
          }}
        />
      )}

      {/* Free Spins Awarded Modal */}
      {showFreeSpinsModal && (
        <FreeSpinsModal
          freeSpinsAwarded={10}
          multiplier={3}
          onStart={() => {
            setShowFreeSpinsModal(false);
            setFreeSpinsRemaining((prev) => prev + 10);
          }}
        />
      )}

      {/* Lucky Bonus Wheel Modal */}
      {showBonusWheelModal && (
        <DailyBonusModal
          canClaim={canClaimBonus}
          timeRemaining={timeUntilBonus}
          onClaim={(amount) => {
            setBalance((b) => b + amount);
            setLastBonusClaimTime(Date.now());
          }}
          onClose={() => setShowBonusWheelModal(false)}
        />
      )}

      {/* Paytable & Rules Modal */}
      {showPaytableModal && (
        <PaytableModal onClose={() => setShowPaytableModal(false)} />
      )}

      {/* Level Up Celebration Modal */}
      {levelUpData && (
        <LevelUpModal
          newLevel={levelUpData.newLevel}
          bonusCoins={levelUpData.bonusCoins}
          newMaxBet={levelUpData.newMaxBet}
          onClaim={() => {
            setBalance((b) => b + levelUpData.bonusCoins);
            setLevelUpData(null);
          }}
        />
      )}

      {/* Developer Debug Suite Drawer */}
      <DebugDrawer
        isOpen={showDebugDrawer}
        balance={balance}
        currentLevel={progression.level}
        stats={stats}
        forcedScenario={forcedScenario}
        onClose={() => setShowDebugDrawer(false)}
        onAddCredits={(amount) => setBalance((b) => b + amount)}
        onSetBalance={(amount) => setBalance(amount)}
        onAddXp={(amount) => setTotalXp((xp) => xp + amount)}
        onSetLevel={(level) => {
          const xpNeeded = Math.floor(1000 * Math.pow(level - 1, 1.4));
          setTotalXp(xpNeeded);
        }}
        onSetForcedScenario={(scenario) => setForcedScenario(scenario)}
        onInjectCustomGrid={(grid) => {
          setCurrentGrid(grid);
          const evaluated = evaluateSpin(grid, totalBet, selectedLines, freeSpinsRemaining > 0 ? 3 : 1);
          setSpinResult(evaluated);
        }}
        onResetStats={() =>
          setStats({
            totalSpins: 0,
            totalWagered: 0,
            totalWon: 0,
            biggestWin: 0,
            freeSpinsPlayed: 0,
            holdAndSpinsPlayed: 0,
          })
        }
      />
    </div>
  );
};

export default App;
