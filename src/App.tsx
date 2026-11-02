import React, { useState, useEffect, useCallback, useRef } from 'react';
import type {
  DebugScenario,
  GameStats,
  SpinResult,
  SymbolGrid,
  WinTier,
} from './engine/types';
import { calculateProgression, getLevelUpReward, getXpRequiredForLevel } from './engine/progression';
import {
  evaluateSpin,
  generateForcedGrid,
  generateRandomGrid,
} from './engine/evaluator';
import type { GameId } from './games/types';
import { getGame } from './games/gameRegistry';
import { soundManager } from './audio/soundManager';
import { storage } from './utils/storage';
import { HeaderBar } from './components/hud/HeaderBar';
import { JackpotMarquee } from './components/hud/JackpotMarquee';
import { VegasTicker } from './components/hud/VegasTicker';
import { SceneBackdrop } from './components/scenes/SceneBackdrop';
import { VaultBlastDoors } from './components/scenes/VaultBlastDoors';
import { CASINO_SCENES, type CasinoScene, type CasinoSceneId } from './components/scenes/SceneTypes';
import { CashRainCanvas } from './fx/CashRainCanvas';
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
import { discordManager } from './multiplayer/discordSdk';
import { casinoRoomManager } from './multiplayer/casinoRoom';
import type { CasinoPeerState, DiscordUserProfile } from './multiplayer/discordTypes';
import { CasinoFloorBank } from './components/multiplayer/CasinoFloorBank';
import { LeaderboardModal } from './components/modals/LeaderboardModal';

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
  const [activeGameId, setActiveGameId] = useState<GameId>(() =>
    (storage.getItem('sloty_active_game') as GameId) || 'vault-24k'
  );
  const activeGameDef = getGame(activeGameId);

  const [selectedLines, setSelectedLines] = useState<number>(() =>
    storage.getNumber('sloty_lines', activeGameDef.defaultLines)
  );
  const [betPerLine, setBetPerLine] = useState<number>(() =>
    storage.getNumber('sloty_bet_per_line', 5)
  );
  const totalBet = selectedLines * betPerLine;

  const handleSelectGame = useCallback(
    (gameId: GameId) => {
      if (gameId === activeGameId) return;
      const target = getGame(gameId);
      setActiveGameId(gameId);
      soundManager.setGameTheme(gameId);
      storage.setItem('sloty_active_game', gameId);
      setSelectedLines(target.defaultLines);
      storage.setItem('sloty_lines', target.defaultLines.toString());
      const newGrid = generateRandomGrid(target);
      setCurrentGrid(newGrid);
      storage.setJSON('sloty_grid', newGrid);
      setSpinResult(null);
      setWinAmount(0);
      if (gameId === 'timber-critters') {
        soundManager.playOwlHoot(1);
      } else {
        soundManager.playCashRegister();
      }
    },
    [activeGameId]
  );

  useEffect(() => {
    soundManager.setGameTheme(activeGameId);
  }, [activeGameId]);

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

  // --- Discord Activity & Multiplayer State ---
  const [discordProfile, setDiscordProfile] = useState<DiscordUserProfile | null>(null);
  const [roomPeers, setRoomPeers] = useState<CasinoPeerState[]>([]);
  const [isFloorMode, setIsFloorMode] = useState<boolean>(() => storage.getItem('sloty_floor_mode') === 'true');
  const [showLeaderboardModal, setShowLeaderboardModal] = useState(false);
  const [peakBalance, setPeakBalance] = useState<number>(() => storage.getNumber('sloty_peak_balance', 167075));
  const [showStealthBailoutToast, setShowStealthBailoutToast] = useState(false);
  const [tipReceivedToast, setTipReceivedToast] = useState<string | null>(null);

  // Initialize Discord Embedded App SDK & Room Connection
  useEffect(() => {
    discordManager.initialize().then((profile) => {
      setDiscordProfile(profile);
      casinoRoomManager.initialize(profile, balance);
    });

    const unsubPeers = casinoRoomManager.subscribePeers((peers) => {
      setRoomPeers(peers);
    });

    const unsubTips = casinoRoomManager.subscribeTips((fromName, amount) => {
      setBalance((b) => b + amount);
      soundManager.playCoinTally();
      setTipReceivedToast(`Tipped +${amount} coins by ${fromName}!`);
      setTimeout(() => setTipReceivedToast(null), 4000);
    });

    return () => {
      unsubPeers();
      unsubTips();
      casinoRoomManager.destroy();
    };
  }, []);

  // Track Peak Bankroll Record
  useEffect(() => {
    if (balance > peakBalance) {
      setPeakBalance(balance);
      storage.setItem('sloty_peak_balance', balance.toString());
    }
  }, [balance, peakBalance]);

  // Stealth $1,000 Safety Net: Secretly recharges player balance so play never stops
  const triggerStealthBailout = useCallback((forcedAmount = 1000) => {
    setBalance((prev) => {
      const next = prev + forcedAmount;
      storage.setItem('sloty_balance', next.toString());
      return next;
    });
    soundManager.playCoinTally();
    soundManager.playCelebrationWhistle();
    setShowStealthBailoutToast(true);
    setTimeout(() => setShowStealthBailoutToast(false), 5000);
  }, []);

  // --- Active Scenic Environment State (Persisted) ---
  const [currentSceneId, setCurrentSceneId] = useState<CasinoSceneId>(() =>
    (storage.getItem('sloty_scene') as CasinoSceneId) || 'VAULT'
  );
  const [transitioningScene, setTransitioningScene] = useState<CasinoScene | null>(null);
  const [isVaultDoorTransitionOpen, setIsVaultDoorTransitionOpen] = useState(false);

  useEffect(() => {
    storage.setItem('sloty_scene', currentSceneId);
  }, [currentSceneId]);

  // Scene switcher: Only runs blast doors on manual user selection
  const handleSelectScene = useCallback(
    (sceneId: CasinoSceneId, withBlastDoors: boolean = true) => {
      if (sceneId === currentSceneId) return;
      const target = CASINO_SCENES[sceneId];
      if (withBlastDoors) {
        setTransitioningScene(target);
        setIsVaultDoorTransitionOpen(true);
        setTimeout(() => {
          setCurrentSceneId(sceneId);
        }, 400);
      } else {
        setCurrentSceneId(sceneId);
      }
    },
    [currentSceneId]
  );

  // Auto-unlock Web Audio and start background lounge music on user interaction
  useEffect(() => {
    const handleFirstGesture = () => {
      soundManager.unlockAudio();
    };

    window.addEventListener('pointerdown', handleFirstGesture, { passive: true });
    window.addEventListener('keydown', handleFirstGesture, { passive: true });
    window.addEventListener('click', handleFirstGesture, { passive: true });

    return () => {
      window.removeEventListener('pointerdown', handleFirstGesture);
      window.removeEventListener('keydown', handleFirstGesture);
      window.removeEventListener('click', handleFirstGesture);
    };
  }, []);

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

    // Strict balance check: Never allow betting more than player has
    if (!isFreeSpin && balance < totalBet) {
      soundManager.playError();
      return;
    }

    // Deduct wager and add XP
    if (!isFreeSpin) {
      setBalance((b) => Math.max(0, b - totalBet));
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

    soundManager.unlockAudio();
    soundManager.playSpinStart();
    setIsSpinning(true);
    setWinAmount(0);
    setSpinResult(null); // Keep results hidden while reels are spinning
    casinoRoomManager.broadcastSpinStart(totalBet);

    // Generate grid: check forced scenario first, then random for active game definition
    const nextGrid = forcedScenario
      ? generateForcedGrid(forcedScenario)
      : generateRandomGrid(activeGameDef);

    // Reset one-time forced scenario
    if (forcedScenario) setForcedScenario(null);

    // Free spins gives 3x multiplier, Fever Mode gives 2x
    const multiplier = (isFreeSpin ? 3 : 1) * (feverSpinsLeft > 0 ? 2 : 1);
    const evaluated = evaluateSpin(nextGrid, totalBet, selectedLines, multiplier, activeGameDef);

    pendingResultRef.current = evaluated;
    setCurrentGrid(nextGrid);
  }, [balance, totalBet, selectedLines, freeSpinsRemaining, forcedScenario, feverSpinsLeft, activeGameDef]);

  // Handle completion when all 5 reels stop
  const handleAllReelsStopped = useCallback(() => {
    setIsSpinning(false);
    const result = pendingResultRef.current;
    if (!result) return;

    setSpinResult(result);
    const { totalPayout, winTier, isFreeSpinsTriggered, isHoldAndSpinTriggered, coinCount } = result;

    // Reliably credit win amount to player's balance!
    const nextBalance = balance + totalPayout;
    if (totalPayout > 0) {
      setBalance((b) => b + totalPayout);
      setWinAmount(totalPayout);
      setStats((s) => ({
        ...s,
        totalWon: s.totalWon + totalPayout,
        biggestWin: Math.max(s.biggestWin, totalPayout),
      }));

      // Trigger tiered celebrations & voice announcements
      if (winTier === 'EPIC_JACKPOT' || winTier === 'MEGA_WIN') {
        soundManager.playJackpotSiren();
        soundManager.playCashRegister();
        soundManager.speakAnnouncer(winTier === 'EPIC_JACKPOT' ? "Epic Cash Jackpot! Congratulations!" : "Mega Cash Win!");
        setCelebration({ tier: winTier, amount: totalPayout });
      } else if (winTier === 'BIG_WIN') {
        soundManager.playCelebrationWhistle();
        soundManager.playCashRegister();
        soundManager.speakAnnouncer("Big Cash Win!");
        setCelebration({ tier: winTier, amount: totalPayout });
      } else {
        soundManager.playCashRegister();
        soundManager.playWinChime(winTier === 'REGULAR' ? 3 : 1);
        if (totalPayout >= totalBet * 2) {
          launchCoinFountain('big');
        }
      }
    }

    // Broadcast live spin outcome to Discord channel & casino floor peers
    casinoRoomManager.broadcastSpinResult(
      currentGrid,
      totalPayout,
      nextBalance,
      freeSpinsRemaining > 0,
      result.winningLines.length
    );

    // Stealth Safety Net Check: If player dropped below minimum bet (40)
    if (nextBalance < 40 && freeSpinsRemaining === 0 && feverSpinsLeft === 0) {
      setTimeout(() => {
        triggerStealthBailout(1000);
      }, 1200);
    }

    // Fever charge progression: +1% on spin, +3% on regular win, +6% on big win (requires ~25-35 spins)
    if (feverSpinsLeft === 0) {
      const chargeIncrement = totalPayout > 0 ? (totalPayout >= totalBet * 5 ? 6 : 3) : 1;
      setFeverCharge((c) => {
        const next = c + chargeIncrement;
        if (next >= 100) {
          setFeverSpinsLeft(5);
          soundManager.playFeverSurge();
          soundManager.setOverdriveMusic(true);
          soundManager.speakAnnouncer("24K Gold Overdrive Activated!");
          launchCoinFountain('jackpot');
          return 0;
        }
        return next;
      });
    }

    // Free Spins Triggered (Smooth backdrop switch, no blast doors interruption)
    if (isFreeSpinsTriggered) {
      soundManager.speakAnnouncer("Penthouse Free Spins Cash Rush!");
      handleSelectScene('PENTHOUSE', false);
      setShowFreeSpinsModal(true);
    }

    // Hold & Spin Cash Respins Triggered (Smooth backdrop switch, no blast doors interruption)
    if (isHoldAndSpinTriggered) {
      soundManager.speakAnnouncer("Fort Knox Cash Link Vault!");
      handleSelectScene('HEIST', false);
      setHoldAndSpinInitialCoins(coinCount);
      setShowHoldAndSpinModal(true);
    }

    // Check VIP Level Up (Paced at most 1 level up modal per spin)
    const currentProgression = calculateProgression(totalXp);
    if (currentProgression.level > prevLevelRef.current) {
      const nextLevel = Math.min(currentProgression.level, prevLevelRef.current + 1);
      const reward = getLevelUpReward(nextLevel);
      soundManager.speakAnnouncer("Level Up!");
      setLevelUpData({
        newLevel: nextLevel,
        bonusCoins: reward,
        newMaxBet: currentProgression.maxBet,
      });
      prevLevelRef.current = nextLevel;
    }

    // Handle Free Spins Sequence
    if (freeSpinsRemaining > 0) {
      setFreeSpinsRemaining((prev) => prev - 1);
    }

    // Handle Fever Spins Sequence
    if (feverSpinsLeft > 0) {
      setFeverSpinsLeft((prev) => {
        const next = prev - 1;
        if (next === 0) {
          soundManager.setOverdriveMusic(false);
        }
        return next;
      });
    }
  }, [totalXp, freeSpinsRemaining, feverSpinsLeft, totalBet, handleSelectScene]);

  // Quick Stop Handler
  const handleQuickStop = useCallback(() => {
    if (!isSpinning) return;
    handleAllReelsStopped();
  }, [isSpinning, handleAllReelsStopped]);

  // Max Bet Handler - capped by balance and progression maxBet
  const handleMaxBet = useCallback(() => {
    const lines = activeGameDef.defaultLines;
    setSelectedLines(lines);
    const maxAffordable = Math.min(balance, progression.maxBet);
    if (maxAffordable <= 0) {
      setBetPerLine(1);
      return;
    }
    const steps = [5000, 2500, 1000, 500, 250, 100, 50, 25, 10, 5, 2, 1];
    const bestStep = steps.find((s) => s * lines <= maxAffordable) || 1;
    setBetPerLine(bestStep);
  }, [balance, progression.maxBet, activeGameDef.defaultLines]);

  // Ensure bet never exceeds balance when balance drops
  useEffect(() => {
    if (freeSpinsRemaining > 0 || isSpinning) return;
    if (balance > 0 && totalBet > balance) {
      const lines = selectedLines;
      const steps = [5000, 2500, 1000, 500, 250, 100, 50, 25, 10, 5, 2, 1];
      const affordableStep = steps.find((s) => s * lines <= balance);
      if (affordableStep) {
        setBetPerLine(affordableStep);
      } else {
        const fittingLines = Math.max(1, Math.min(lines, Math.floor(balance)));
        setSelectedLines(fittingLines);
        setBetPerLine(1);
      }
    }
  }, [balance, totalBet, selectedLines, freeSpinsRemaining, isSpinning]);

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
  const levelUpDataRef = useRef(levelUpData);
  levelUpDataRef.current = levelUpData;
  const balanceRef = useRef(balance);
  balanceRef.current = balance;
  const totalBetRef = useRef(totalBet);
  totalBetRef.current = totalBet;
  const freeSpinsRemainingRef = useRef(freeSpinsRemaining);
  freeSpinsRemainingRef.current = freeSpinsRemaining;

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Avoid hotkeys when typing in debug input
      if (e.target instanceof HTMLInputElement || e.target instanceof HTMLSelectElement) {
        return;
      }

      if (e.code === 'Space' || e.code === 'Enter') {
        e.preventDefault();
        // Clear level-up modal if active
        if (levelUpDataRef.current !== null) {
          const currentLevelUp = levelUpDataRef.current;
          setBalance((b) => b + currentLevelUp.bonusCoins);
          setLevelUpData(null);
          soundManager.playButtonClick();
          return;
        }
        if (celebration !== null || showFreeSpinsModal || showHoldAndSpinModal || showGambleModal) {
          return;
        }
        if (isSpinning) {
          handleQuickStop();
        } else if (freeSpinsRemainingRef.current > 0 || balanceRef.current >= totalBetRef.current) {
          executeSpin();
        } else {
          soundManager.playError();
          if (balanceRef.current < 1) {
            setShowBonusWheelModal(true);
          }
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

  const isTimber = activeGameId === 'timber-critters';

  return (
    <div className={`min-h-screen text-slate-100 flex flex-col justify-between selection:bg-gold selection:text-black relative overflow-x-hidden transition-colors duration-300 ${
      isTimber ? 'bg-[#020d06]' : 'bg-casino-950'
    }`}>
      {/* 1. Dynamic Panoramic Scene Backdrop (Enchanted Forest vs Fort Knox Vault) */}
      <SceneBackdrop sceneId={currentSceneId} activeGameId={activeGameId} />

      {/* 2. Full-Screen 60 FPS Cascading Cash & Currency / Autumn Leaf Rain Canvas */}
      <CashRainCanvas
        activeGameId={activeGameId}
        intensity={
          celebration ? 'jackpot' : freeSpinsRemaining > 0 ? 'heavy' : winAmount > 0 ? 'light' : 'idle'
        }
      />

      {/* 3. Motorized Armored Vault Blast Doors Full Slide Transitions */}
      <VaultBlastDoors
        isOpen={isVaultDoorTransitionOpen}
        targetScene={transitioningScene}
        onTransitionComplete={() => {
          setIsVaultDoorTransitionOpen(false);
          setTransitioningScene(null);
        }}
      />

      {/* Header Bar */}
      <HeaderBar
        balance={balance}
        progression={progression}
        isMuted={isMuted}
        canClaimBonus={canClaimBonus}
        timeUntilBonus={timeUntilBonus}
        currentSceneId={currentSceneId}
        onSelectScene={handleSelectScene}
        activeGameId={activeGameId}
        onSelectGame={handleSelectGame}
        isSpinning={isSpinning}
        onToggleMute={() => setIsMuted((prev) => !prev)}
        onOpenPaytable={() => setShowPaytableModal(true)}
        onOpenBonusWheel={() => setShowBonusWheelModal(true)}
        onToggleDebug={() => setShowDebugDrawer((prev) => !prev)}
      />

      {/* Main Gaming Stage with responsive padding */}
      <main className="relative z-10 flex-1 flex flex-col items-center justify-start py-0.5 sm:py-2 w-full pb-24 sm:pb-36">
        {/* 4-Tier Deluxe Progressive Jackpots */}
        <JackpotMarquee totalBet={totalBet} activeGameId={activeGameId} />

        {/* Live Casino LED Marquee Ticker */}
        <VegasTicker freeSpinsRemaining={freeSpinsRemaining} activeGameId={activeGameId} />

        {/* Hyper Fever Overdrive Super Meter */}
        <FeverMeter charge={feverCharge} feverSpinsLeft={feverSpinsLeft} activeGameId={activeGameId} />

        {/* Multiplayer Casino Floor Bank View with Live Neighbors */}
        <CasinoFloorBank
          peers={roomPeers}
          isFloorMode={isFloorMode}
          activeGameId={activeGameId}
          onToggleFloorMode={() => {
            setIsFloorMode((prev) => {
              const next = !prev;
              storage.setItem('sloty_floor_mode', next.toString());
              return next;
            });
          }}
          onOpenLeaderboard={() => setShowLeaderboardModal(true)}
          onTipNeighbor={(peerId) => casinoRoomManager.tipNeighbor(peerId, 25)}
        >
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
            currentSceneId={currentSceneId}
            onRewardCoins={(amount) => {
              setBalance((b) => b + amount);
              soundManager.playCoinTally();
            }}
            activeGameId={activeGameId}
            isFloorMode={isFloorMode}
          />
        </CasinoFloorBank>
      </main>

      {/* Rock-Solid Fixed Bottom Controls Dock - Anchored to Viewport Glass */}
      <div className={`fixed bottom-0 left-0 right-0 z-40 border-t pb-safe transition-colors duration-300 ${
        isTimber
          ? 'bg-gradient-to-t from-stone-950 via-[#18110B] to-[#251A10] border-emerald-600/70 shadow-[0_-8px_30px_rgba(6,40,24,0.95)]'
          : 'bg-casino-950 border-white/15 shadow-[0_-8px_25px_rgba(0,0,0,0.95)]'
      }`}>
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
          availableLines={activeGameDef.availableLines}
          maxLines={activeGameDef.defaultLines}
          activeGameId={activeGameId}
        />

        {/* Integrated Footer info banner (desktop only) */}
        <footer className={`hidden sm:block py-1 border-t text-center text-[9px] sm:text-[10px] flex-shrink-0 ${
          isTimber
            ? 'bg-[#0e0a07]/95 border-emerald-900/40 text-emerald-500/80'
            : 'bg-casino-950/90 border-white/5 text-slate-500'
        }`}>
          PRESS <kbd className="px-1.5 py-0.5 bg-casino-900 border border-white/10 rounded text-slate-300 font-mono">SPACE</kbd> TO SPIN / QUICK STOP • <kbd className="px-1.5 py-0.5 bg-casino-900 border border-white/10 rounded text-slate-300 font-mono">~</kbd> OR <kbd className="px-1.5 py-0.5 bg-casino-900 border border-white/10 rounded text-slate-300 font-mono">D</kbd> FOR DEBUG CREDITS &amp; RIG REELS
        </footer>
      </div>

      {/* --- Modals & Overlays --- */}

      {/* Win Celebration Modal */}
      {celebration && (
        <WinCelebrationModal
          winTier={celebration.tier}
          winAmount={celebration.amount}
          onDismiss={() => setCelebration(null)}
        />
      )}

      {/* Video Poker Double-Up Gamble Modal */}
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
          activeGameId={activeGameId}
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
        <PaytableModal
          activeGameId={activeGameId}
          onClose={() => setShowPaytableModal(false)}
        />
      )}

      {/* Level Up Celebration Modal */}
      {levelUpData && (
        <LevelUpModal
          newLevel={levelUpData.newLevel}
          bonusCoins={levelUpData.bonusCoins}
          newMaxBet={levelUpData.newMaxBet}
          autoSpinsRemaining={autoSpinsRemaining}
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
          const xpNeeded = getXpRequiredForLevel(level);
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

      {/* Discord Server High Scores & Hall of Fame Leaderboard Modal */}
      {showLeaderboardModal && (
        <LeaderboardModal
          userProfile={discordProfile}
          currentBalance={balance}
          peakBalance={peakBalance}
          peers={roomPeers}
          onClose={() => setShowLeaderboardModal(false)}
        />
      )}

      {/* Stealth $1,000 Safety Net Whisper Notification */}
      {showStealthBailoutToast && (
        <div className="fixed top-14 left-1/2 -translate-x-1/2 z-50 animate-bounce max-w-sm w-full px-3 pointer-events-none">
          <div className="p-3 rounded-2xl bg-gradient-to-r from-amber-950 via-slate-900 to-amber-950 border-2 border-yellow-400 shadow-[0_0_30px_rgba(245,158,11,0.8)] flex items-center space-x-3 backdrop-blur-md">
            <div className="w-9 h-9 rounded-full bg-gradient-to-tr from-amber-500 to-yellow-300 border border-yellow-200 flex items-center justify-center text-lg flex-shrink-0 shadow-md">
              🎩
            </div>
            <div className="flex flex-col flex-1">
              <span className="text-[10px] font-black uppercase text-yellow-300 tracking-wider">
                SECRET SAFETY NET ACTIVATED
              </span>
              <span className="text-[11px] text-slate-200 font-semibold leading-tight">
                Psst... A secret benefactor slipped <strong className="text-emerald-400 font-bold">+$1,000</strong> into your coin hopper. Don't tell the pit boss!
              </span>
            </div>
          </div>
        </div>
      )}

      {/* Neighbor Tip Received Toast */}
      {tipReceivedToast && (
        <div className="fixed top-28 left-1/2 -translate-x-1/2 z-50 animate-pulse max-w-xs w-full px-3 pointer-events-none">
          <div className="p-2.5 rounded-xl bg-gradient-to-r from-emerald-950 via-slate-900 to-emerald-950 border border-emerald-400 shadow-[0_0_20px_rgba(16,185,129,0.7)] flex items-center space-x-2.5 backdrop-blur-md">
            <span className="text-lg">🪙</span>
            <span className="text-xs font-black text-emerald-300 tracking-wide">
              {tipReceivedToast}
            </span>
          </div>
        </div>
      )}
    </div>
  );
};

export default App;
