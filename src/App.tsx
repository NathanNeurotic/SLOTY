import React, { useState, useEffect, useCallback, useRef } from 'react';
import type {
  DebugScenario,
  GameStats,
  SpinResult,
  SymbolGrid,
  SymbolId,
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
import { SceneBackdrop } from './components/scenes/SceneBackdrop';
import { VaultBlastDoors } from './components/scenes/VaultBlastDoors';
import { CASINO_SCENES, type CasinoScene, type CasinoSceneId } from './components/scenes/SceneTypes';
import { CashRainCanvas } from './fx/CashRainCanvas';
import { ThemedCursorFX } from './fx/ThemedCursorFX';
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
import { CompanionLounge } from './components/character/CompanionLounge';
import { PuppetCharacterPopup } from './components/popups/PuppetCharacterPopup';
import { quotaManager, type QuotaTier } from './engine/quotaSystem';

// The debug suite (forced reels, credit injection, custom grids) is a
// development tool: available in dev builds, or in production only with
// ?debug=1 in the URL. It must never ship as a player-facing feature.
const DEBUG_ENABLED =
  import.meta.env.DEV ||
  (typeof window !== 'undefined' && new URLSearchParams(window.location.search).has('debug'));

function resolveGameIdFromUrl(): GameId | null {
  if (typeof window === 'undefined') return null;
  try {
    const params = new URLSearchParams(window.location.search);
    const raw = (params.get('game') || params.get('theme') || window.location.hash.replace(/^#/, '')).trim().toLowerCase();
    if (!raw) return null;
    if (raw === 'timber-critters' || raw === 'timberland' || raw === 'timber' || raw === 'critters') {
      return 'timber-critters';
    }
    if (raw === 'ps2-legends' || raw === 'ps2' || raw === 'playstation' || raw === 'playstation2' || raw === 'emotion-engine') {
      return 'ps2-legends';
    }
    if (raw === 'pixel-arcade' || raw === 'pixel' || raw === 'arcade' || raw === '8bit') {
      return 'pixel-arcade';
    }
    if (raw === 'vault-24k' || raw === 'vault' || raw === '24k' || raw === 'gold') {
      return 'vault-24k';
    }
  } catch {
    // Ignore URL parsing errors
  }
  return null;
}

const BONUS_COOLDOWN_MS = 4 * 60 * 60 * 1000; // 4 hours

export const App: React.FC = () => {
  const [unlockedQuotaTier, setUnlockedQuotaTier] = useState<QuotaTier | null>(null);
  const [consecutiveWins, setConsecutiveWins] = useState<number>(0);
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
    (() => {
      const fromUrl = resolveGameIdFromUrl();
      if (fromUrl) return fromUrl;
      const persisted = storage.getItem('sloty_active_game') as GameId;
      if (
        persisted &&
        (persisted === 'vault-24k' ||
          persisted === 'timber-critters' ||
          persisted === 'pixel-arcade' ||
          persisted === 'ps2-legends')
      ) {
        return persisted;
      }
      return 'vault-24k';
    })()
  );
  // The game whose reels triggered the pending/active free spins. Its award
  // and multiplier govern the whole bonus, even if the player switches games
  // while the award modal is up or the spins are running.
  const [freeSpinGameId, setFreeSpinGameId] = useState<GameId | null>(null);
  const [freeSpinsRemaining, setFreeSpinsRemaining] = useState(0);
  const [showFreeSpinsModal, setShowFreeSpinsModal] = useState(false);
  const activeGameDef = getGame(activeGameId);
  const freeSpinDef = freeSpinGameId ? getGame(freeSpinGameId) : activeGameDef;

  // Synchronize audio theme with active game on initial load and updates
  useEffect(() => {
    soundManager.setGameTheme(activeGameId);
  }, [activeGameId]);

  // Synchronize URL query parameter with active game so sharing preserves the selected game
  useEffect(() => {
    if (typeof window === 'undefined') return;
    try {
      const url = new URL(window.location.href);
      if (url.searchParams.get('game') !== activeGameId) {
        url.searchParams.set('game', activeGameId);
        window.history.replaceState(null, '', url.toString());
      }
    } catch {
      // Ignore if history state is unavailable
    }
  }, [activeGameId]);

  const [selectedLines, setSelectedLines] = useState<number>(() =>
    storage.getNumber('sloty_lines', activeGameDef.defaultLines)
  );
  const [betPerLine, setBetPerLine] = useState<number>(() =>
    storage.getNumber('sloty_bet_per_line', 5)
  );
  const totalBet = selectedLines * betPerLine;

  const handleSelectGame = useCallback(
    (gameId: GameId) => {
      // Cabinet locked while a free-spins bonus is pending or running: the
      // award's identity (count + multiplier) belongs to the triggering
      // game, and the pooled remaining count cannot track two games' awards
      // at once — a mid-bonus switch would reprice the remaining spins.
      if (showFreeSpinsModal || freeSpinsRemaining > 0) return;
      if (gameId === activeGameId) return;
      // Switching mid-spin would orphan the reel-stop timers and leave the machine stuck spinning
      if (isSpinningRef.current) return;
      const target = getGame(gameId);
      setActiveGameId(gameId);
      soundManager.setGameTheme(gameId);
      storage.setItem('sloty_active_game', gameId);
      const lines = target.defaultLines;
      setSelectedLines(lines);
      storage.setItem('sloty_lines', lines.toString());

      // Ensure bet conforms to the selected game's max bet rules and player balance
      let nextBet = betPerLine;
      if (nextBet > target.maxBetPerLine) {
        nextBet = target.maxBetPerLine;
      }
      if (lines * nextBet > target.maxTotalBet) {
        const revSteps = [...target.betSteps].reverse();
        nextBet = revSteps.find((s) => s * lines <= target.maxTotalBet) || 1;
      }
      if (balance > 0 && lines * nextBet > balance) {
        const revSteps = [...target.betSteps].reverse();
        nextBet = revSteps.find((s) => s * lines <= balance) || 1;
      }
      setBetPerLine(nextBet);
      storage.setItem('sloty_bet_per_line', nextBet.toString());

      const newGrid = generateRandomGrid(target);
      setCurrentGrid(newGrid);
      storage.setJSON('sloty_grid', newGrid);
      setSpinResult(null);
      setWinAmount(0);
      if (gameId === 'ps2-legends') {
        soundManager.playPs2Startup();
      } else if (gameId === 'timber-critters') {
        soundManager.playOwlHoot(1);
      } else if (gameId === 'pixel-arcade') {
        soundManager.playLaserZap();
      } else {
        setCurrentSceneId('VAULT');
        storage.setItem('sloty_scene', 'VAULT');
        soundManager.playCashRegister();
      }
    },
    [activeGameId, balance, betPerLine, showFreeSpinsModal, freeSpinsRemaining]
  );


  const [isSpinning, setIsSpinning] = useState(false);
  const [isTurbo, setIsTurbo] = useState<boolean>(() =>
    storage.getBoolean('sloty_turbo', false)
  );

  // Synchronous refs for rapid keydown throttling and rate-limiting
  const isSpinningRef = useRef(isSpinning);
  isSpinningRef.current = isSpinning;
  const isTurboRef = useRef(isTurbo);
  isTurboRef.current = isTurbo;
  const lastSpinStartTimeRef = useRef(0);
  const lastSpinEndTimeRef = useRef(0);
  const [winAmount, setWinAmount] = useState(0);
  const [autoSpinsRemaining, setAutoSpinsRemaining] = useState(0);
  const [feverCharge, setFeverCharge] = useState<number>(() =>
    storage.getNumber('sloty_fever_charge', 35)
  );
  const [feverSpinsLeft, setFeverSpinsLeft] = useState(0);

  // --- Discord Activity & Multiplayer State ---
  const [discordProfile, setDiscordProfile] = useState<DiscordUserProfile | null>(null);
  const [roomPeers, setRoomPeers] = useState<CasinoPeerState[]>([]);
  const [isFloorMode, setIsFloorMode] = useState<boolean>(false);
  const [showLeaderboardModal, setShowLeaderboardModal] = useState(false);
  const [peakBalance, setPeakBalance] = useState<number>(() => storage.getNumber('sloty_peak_balance', 50000));
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
  const [currentSceneId, setCurrentSceneId] = useState<CasinoSceneId>(() => {
    const saved = storage.getItem('sloty_scene') as CasinoSceneId;
    return saved === 'VAULT' ? 'VAULT' : 'VAULT';
  });
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

  // Initial grid conforming strictly to active game's dimensions (reels x rows)
  const [currentGrid, setCurrentGrid] = useState<SymbolGrid>(() => {
    const saved = storage.getJSON<SymbolGrid | null>('sloty_grid', null);
    if (
      saved &&
      saved.length === (activeGameDef.reels || 5) &&
      saved.every((col) => col.length === activeGameDef.rows)
    ) {
      return saved;
    }
    return generateRandomGrid(activeGameDef);
  });

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

  // Ensure currentGrid strictly conforms to active game dimensions (reels x rows)
  useEffect(() => {
    setCurrentGrid((prev) => {
      if (
        prev &&
        prev.length === (activeGameDef.reels || 5) &&
        prev.every((col) => col && col.length === activeGameDef.rows)
      ) {
        return prev;
      }
      const fresh = generateRandomGrid(activeGameDef);
      storage.setJSON('sloty_grid', fresh);
      return fresh;
    });
  }, [activeGameDef]);

  // --- Derived Progression State ---
  const progression = calculateProgression(totalXp);
  const prevLevelRef = useRef<number>(progression.level);

  const [spinResult, setSpinResult] = useState<SpinResult | null>(null);
  const [forcedScenario, setForcedScenario] = useState<DebugScenario | null>(null);
  const pendingResultRef = useRef<SpinResult | null>(null);
  const pendingResultGameIdRef = useRef<GameId | null>(null);

  // --- Modals State ---
  const [celebration, setCelebration] = useState<{ tier: WinTier; amount: number } | null>(null);
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
    if (isSpinningRef.current) return;
    const now = performance.now();
    // Guard against rapid-fire spin spam (minimum 350ms between spin starts)
    if (now - lastSpinStartTimeRef.current < 350) return;

    const isFreeSpin = freeSpinsRemaining > 0;

    // Strict balance check: Never allow betting more than player has.
    // Runs before the spin lock is taken so a rejected spin cannot leave the game stuck "spinning".
    if (!isFreeSpin && balance < totalBet) {
      soundManager.playError();
      setAutoSpinsRemaining(0);
      return;
    }

    lastSpinStartTimeRef.current = now;
    isSpinningRef.current = true;

    // Deduct wager and add XP
    if (!isFreeSpin) {
      setBalance((b) => Math.max(0, b - totalBet));
      // Cap XP gained from a single spin to that level's max bet increment
      const earnedXp = Math.min(totalBet, progression.maxBet);
      setTotalXp((xp) => xp + earnedXp);
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
    let nextGrid: SymbolGrid;
    if (forcedScenario) {
      const rawForced = generateForcedGrid(forcedScenario);
      nextGrid = rawForced.map((col) => {
        // Forced grids are written with Vault symbol IDs; translate the
        // scatter placeholder to the active game's scatter so the FREE_SPINS
        // and NEAR_MISS scenarios still register on games whose scatterId
        // is not 'SCATTER' (evaluator counts only activeDef.scatterId).
        const c = col.map((sym) => (sym === 'SCATTER' ? activeGameDef.scatterId : sym));
        // Pad by extending the column's tail. Copying c[0] duplicated
        // scatters on 5-row Pixel Arcade — NEAR_MISS padded itself into a
        // free-spins trigger. (No forced column ends in a scatter, so the
        // tail symbol is always scatter-safe.)
        while (c.length < activeGameDef.rows) c.push(c[c.length - 1]);
        return c.slice(0, activeGameDef.rows);
      });
      while (nextGrid.length < (activeGameDef.reels || 5)) {
        nextGrid.push(Array(activeGameDef.rows).fill('SEVEN'));
      }
    } else {
      nextGrid = generateRandomGrid(activeGameDef);
    }

    // Reset one-time forced scenario
    if (forcedScenario) setForcedScenario(null);

    // Free spins pay the triggering game's multiplier; Fever Mode gives 2x
    const multiplier = (isFreeSpin ? freeSpinDef.freeSpinsMultiplier : 1) * (feverSpinsLeft > 0 ? 2 : 1);
    const evaluated = evaluateSpin(nextGrid, totalBet, selectedLines, multiplier, activeGameDef);

    pendingResultRef.current = evaluated;
    // The completion handler must attribute this result to the game that
    // EVALUATED it: G can switch cabinets while the reels are still spinning.
    pendingResultGameIdRef.current = activeGameId;
    setCurrentGrid(nextGrid);
  }, [balance, totalBet, selectedLines, freeSpinsRemaining, forcedScenario, feverSpinsLeft, activeGameDef, activeGameId, freeSpinDef, progression.maxBet]);

  // Handle completion when all reels stop
  const handleAllReelsStopped = useCallback(() => {
    setIsSpinning(false);
    isSpinningRef.current = false;
    lastSpinEndTimeRef.current = performance.now();
    // Consume the pending result exactly once so a duplicate stop signal can never pay a spin twice
    const result = pendingResultRef.current;
    pendingResultRef.current = null;
    if (!result) return;

    setSpinResult(result);
    const { totalPayout, winTier, isFreeSpinsTriggered, isHoldAndSpinTriggered, coinCount } = result;

    // Reliably credit win amount to player's balance!
    const nextBalance = balance + totalPayout;
    if (totalPayout > 0) {
      setConsecutiveWins((w) => w + 1);
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
    } else {
      setConsecutiveWins(0);
    }

    // Update Unreasonable Boss / Camp Quota System — attributed to the game
    // that evaluated this spin, not a cabinet selected while reels spun.
    const resultGameId = pendingResultGameIdRef.current ?? activeGameId;
    const quotaResult = quotaManager.addSpinProgress(resultGameId, totalBet, totalPayout);
    if (quotaResult.unlockedTier) {
      setUnlockedQuotaTier(quotaResult.unlockedTier);
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
      const nextCharge = feverCharge + chargeIncrement;
      if (nextCharge >= 100) {
        // Side effects live outside the state updater so StrictMode's double-invoke can't repeat them
        setFeverCharge(0);
        setFeverSpinsLeft(5);
        soundManager.playFeverSurge();
        soundManager.setOverdriveMusic(true);
        soundManager.speakAnnouncer("24K Gold Overdrive Activated!");
        launchCoinFountain('jackpot');
      } else {
        setFeverCharge(nextCharge);
      }
    }

    // Free Spins Triggered (Smooth backdrop switch, no blast doors interruption)
    if (isFreeSpinsTriggered) {
      soundManager.speakAnnouncer("Penthouse Free Spins Cash Rush!");
      handleSelectScene('PENTHOUSE', false);
      setFreeSpinGameId(resultGameId);
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
      // Last free spin consumed with no retrigger: the bonus is over, so
      // release the triggering-game snapshot.
      if (freeSpinsRemaining === 1 && !isFreeSpinsTriggered) {
        setFreeSpinGameId(null);
      }
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
  }, [
    balance,
    totalXp,
    freeSpinsRemaining,
    feverSpinsLeft,
    feverCharge,
    totalBet,
    activeGameId,
    currentGrid,
    handleSelectScene,
    triggerStealthBailout,
  ]);

  // Quick Stop Handler with minimum spin duration before stopping is permitted
  const handleQuickStop = useCallback(() => {
    if (!isSpinningRef.current) return;
    const elapsed = performance.now() - lastSpinStartTimeRef.current;
    if (elapsed < 300) return;
    handleAllReelsStopped();
  }, [handleAllReelsStopped]);

  // Max Bet Handler - capped by game max bet rules, balance and progression maxBet
  const handleMaxBet = useCallback(() => {
    const lines = activeGameDef.defaultLines;
    setSelectedLines(lines);
    const gameMaxTotal = activeGameDef.maxTotalBet || 2000;
    const maxAffordable = Math.min(balance, progression.maxBet, gameMaxTotal);
    if (maxAffordable <= 0) {
      setBetPerLine(1);
      return;
    }
    const revSteps = [...(activeGameDef.betSteps || [1])].reverse();
    const bestStep = revSteps.find((s) => s * lines <= maxAffordable && s <= activeGameDef.maxBetPerLine) || 1;
    setBetPerLine(bestStep);
    storage.setItem('sloty_bet_per_line', bestStep.toString());
  }, [balance, progression.maxBet, activeGameDef]);

  const handleSelectLines = useCallback(
    (lines: number) => {
      setSelectedLines(lines);
      storage.setItem('sloty_lines', lines.toString());
      const maxAllowed = Math.min(balance > 0 ? balance : Infinity, activeGameDef.maxTotalBet);
      if (lines * betPerLine > maxAllowed) {
        const revSteps = [...(activeGameDef.betSteps || [1])].reverse();
        const affordable = revSteps.find((s) => s * lines <= maxAllowed && s <= activeGameDef.maxBetPerLine) || 1;
        setBetPerLine(affordable);
        storage.setItem('sloty_bet_per_line', affordable.toString());
      }
    },
    [balance, betPerLine, activeGameDef]
  );

  const handleSelectBetPerLine = useCallback(
    (bet: number) => {
      const maxAllowed = Math.min(balance > 0 ? balance : Infinity, progression.maxBet, activeGameDef.maxTotalBet);
      const clampedBet = Math.min(bet, activeGameDef.maxBetPerLine);
      if (clampedBet * selectedLines > maxAllowed) {
        const revSteps = [...(activeGameDef.betSteps || [1])].reverse();
        const affordable = revSteps.find((s) => s * selectedLines <= maxAllowed && s <= activeGameDef.maxBetPerLine) || 1;
        setBetPerLine(affordable);
        storage.setItem('sloty_bet_per_line', affordable.toString());
      } else {
        setBetPerLine(clampedBet);
        storage.setItem('sloty_bet_per_line', clampedBet.toString());
      }
    },
    [balance, progression.maxBet, selectedLines, activeGameDef]
  );

  const handleStartFreeSpins = useCallback(() => {
    setShowFreeSpinsModal(false);
    setFreeSpinsRemaining((prev) => prev + freeSpinDef.freeSpinsAward);
    soundManager.playButtonClick();
  }, [freeSpinDef]);

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

  // --- Keyboard Shortcuts & Zero-Mouse Navigation ---
  const levelUpDataRef = useRef(levelUpData);
  levelUpDataRef.current = levelUpData;
  const showFreeSpinsModalRef = useRef(showFreeSpinsModal);
  showFreeSpinsModalRef.current = showFreeSpinsModal;
  const balanceRef = useRef(balance);
  balanceRef.current = balance;
  const totalBetRef = useRef(totalBet);
  totalBetRef.current = totalBet;
  const freeSpinsRemainingRef = useRef(freeSpinsRemaining);
  freeSpinsRemainingRef.current = freeSpinsRemaining;
  const betPerLineRef = useRef(betPerLine);
  betPerLineRef.current = betPerLine;
  const selectedLinesRef = useRef(selectedLines);
  selectedLinesRef.current = selectedLines;
  const maxBetRef = useRef(progression.maxBet);
  maxBetRef.current = progression.maxBet;
  const activeGameIdRef = useRef(activeGameId);
  activeGameIdRef.current = activeGameId;
  const autoSpinsRemainingRef = useRef(autoSpinsRemaining);
  autoSpinsRemainingRef.current = autoSpinsRemaining;
  // True while any overlay is open; gameplay hotkeys must not act behind a modal
  const modalOpenRef = useRef(false);
  modalOpenRef.current =
    celebration !== null ||
    showFreeSpinsModal ||
    showHoldAndSpinModal ||
    showGambleModal ||
    showBonusWheelModal ||
    showPaytableModal ||
    levelUpData !== null;
  const activeGameDefRef = useRef(activeGameDef);
  activeGameDefRef.current = activeGameDef;

  useEffect(() => {
    const BET_STEPS = [1, 2, 5, 10, 20, 50, 100, 200, 500, 1000, 2000, 5000];

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
        // Start free spins if modal is active
        if (showFreeSpinsModalRef.current) {
          handleStartFreeSpins();
          return;
        }
        if (modalOpenRef.current) {
          return;
        }
        const now = performance.now();

        // Holding down space/enter triggers repeated keydown events with e.repeat = true
        if (e.repeat) {
          // Rule 1: Never quick-stop on key repeat. Quick-stop requires an intentional manual key press.
          if (isSpinningRef.current) {
            return;
          }
          // Rule 2: If reels have settled, pace continuous auto-spinning at a controlled, enjoyable rate.
          // Enforce rest delay to let the player view payouts, win lines, and celebratory tallies (350ms in Turbo, 600ms in normal).
          const minRestDelay = isTurboRef.current ? 350 : 600;
          if (now - lastSpinEndTimeRef.current < minRestDelay) {
            return;
          }
          if (freeSpinsRemainingRef.current > 0 || balanceRef.current >= totalBetRef.current) {
            executeSpin();
          }
          return;
        }

        // Fresh, intentional key press (not an auto-repeat):
        if (isSpinningRef.current) {
          handleQuickStop();
        } else if (freeSpinsRemainingRef.current > 0 || balanceRef.current >= totalBetRef.current) {
          executeSpin();
        } else {
          soundManager.playError();
          if (balanceRef.current < 1) {
            setShowBonusWheelModal(true);
          }
        }
      } else if (e.key === 'ArrowUp') {
        e.preventDefault();
        if (isSpinningRef.current || modalOpenRef.current) return;
        const def = activeGameDefRef.current;
        const cur = betPerLineRef.current;
        let idx = BET_STEPS.indexOf(cur);
        if (idx === -1) idx = BET_STEPS.findIndex((s) => s >= cur);
        if (idx < BET_STEPS.length - 1) {
          const nextStep = BET_STEPS[idx + 1];
          const maxAllowed = Math.min(balanceRef.current, maxBetRef.current, def.maxTotalBet);
          if (nextStep * selectedLinesRef.current <= maxAllowed && nextStep <= def.maxBetPerLine) {
            setBetPerLine(nextStep);
            soundManager.playChipClick();
          }
        }
      } else if (e.key === 'ArrowDown') {
        e.preventDefault();
        if (isSpinningRef.current || modalOpenRef.current) return;
        const cur = betPerLineRef.current;
        let idx = BET_STEPS.indexOf(cur);
        if (idx === -1) idx = BET_STEPS.findIndex((s) => s >= cur);
        if (idx > 0) {
          setBetPerLine(BET_STEPS[idx - 1]);
          soundManager.playChipClick();
        }
      } else if (e.key === 'b' || e.key === 'B') {
        e.preventDefault();
        if (isSpinningRef.current || modalOpenRef.current) return;
        handleMaxBet();
      } else if (e.key === 'a' || e.key === 'A') {
        e.preventDefault();
        if (modalOpenRef.current) return;
        if (autoSpinsRemainingRef.current > 0) {
          setAutoSpinsRemaining(0);
        } else if (!isSpinningRef.current) {
          // The first spin starts immediately, so queue one fewer
          setAutoSpinsRemaining(24);
          executeSpin();
        }
      } else if (e.key === 'g' || e.key === 'G') {
        e.preventDefault();
        if (isSpinningRef.current || modalOpenRef.current) return;
        const gameCycle: GameId[] = ['vault-24k', 'timber-critters', 'pixel-arcade', 'ps2-legends'];
        const curIdx = gameCycle.indexOf(activeGameIdRef.current);
        const nextGame = gameCycle[(curIdx + 1) % gameCycle.length];
        handleSelectGame(nextGame);
      } else if (e.key === 'f' || e.key === 'F') {
        e.preventDefault();
        setIsFloorMode((prev) => {
          const next = !prev;
          storage.setItem('sloty_floor_mode', next.toString());
          return next;
        });
      } else if (e.key === 'l' || e.key === 'L' || e.key === 'p' || e.key === 'P' || e.key === '?') {
        e.preventDefault();
        setShowPaytableModal((prev) => !prev);
      } else if (DEBUG_ENABLED && (e.key === '`' || e.key === '~' || e.key === 'd' || e.key === 'D')) {
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
    handleMaxBet,
    handleSelectGame,
  ]);

  const isTimber = activeGameId === 'timber-critters';
  const isPixel = activeGameId === 'pixel-arcade';
  const isPs2 = activeGameId === 'ps2-legends';

  return (
    <div className={`fixed inset-0 h-[100dvh] max-h-[100dvh] w-screen text-slate-100 flex flex-col justify-between selection:bg-gold selection:text-black overflow-hidden select-none transition-colors duration-300 ${
      isPs2 ? 'bg-[#00040a]' : isPixel ? 'bg-[#060112]' : isTimber ? 'bg-[#020d06]' : 'bg-casino-950'
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

      {/* 2b. Interactive Themed Particle Cursor & Radial Tap Bursts */}
      <ThemedCursorFX activeGameId={activeGameId} />

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
        onToggleDebug={DEBUG_ENABLED ? () => setShowDebugDrawer((prev) => !prev) : undefined}
      />

      {/* Main Gaming Stage with dynamic viewport fitting */}
      <main className="relative z-10 flex-1 min-h-0 flex flex-col items-center justify-center gap-0.5 sm:gap-1 w-full px-1 sm:px-2 py-0.5 overflow-hidden">
        {/* Dynamic Architectural Physical Top Box (Fort Knox Vault vs Cedar Cabin Gable) */}
        <JackpotMarquee
          totalBet={totalBet}
          activeGameId={activeGameId}
          freeSpinsRemaining={freeSpinsRemaining}
          feverCharge={feverCharge}
          feverSpinsLeft={feverSpinsLeft}
          isFloorMode={isFloorMode}
          onToggleFloorMode={() => {
            setIsFloorMode((prev) => {
              const next = !prev;
              storage.setItem('sloty_floor_mode', next.toString());
              return next;
            });
          }}
          onOpenLeaderboard={() => setShowLeaderboardModal(true)}
        />

        {/* Multiplayer Casino Floor Bank View with Live Neighbors */}
        {(() => {
          const scatterSym: SymbolId = activeGameDef.scatterId;
          const hasScatter0 = currentGrid[0]?.includes(scatterSym);
          const hasScatter1 = currentGrid[1]?.includes(scatterSym);
          const isAnticipating = isSpinning && !!hasScatter0 && !!hasScatter1;

          return (
            <CasinoFloorBank
              peers={roomPeers}
              isFloorMode={isFloorMode}
              activeGameId={activeGameId}
              onOpenPaytable={() => setShowPaytableModal(true)}
              onTipNeighbor={(peerId) => casinoRoomManager.tipNeighbor(peerId, 25)}
              flankCompanion={
                <CompanionLounge
                  position="desktop-flank"
                  isSpinning={isSpinning}
                  isAnticipating={isAnticipating}
                  isWinning={!isSpinning && !!spinResult && spinResult.totalPayout > 0}
                  isBigWin={!isSpinning && !!spinResult && spinResult.totalPayout >= 500}
                  isFeverMode={feverSpinsLeft > 0}
                  winAmount={spinResult?.totalPayout || 0}
                  onRewardCoins={(amount) => {
                    setBalance((b) => b + amount);
                    soundManager.playCoinTally();
                  }}
                  activeGameId={activeGameId}
                />
              }
            >
              <SlotMachine
                currentGrid={currentGrid}
                isSpinning={isSpinning}
                spinResult={spinResult}
                isTurbo={isTurbo}
                selectedLines={selectedLines}
                onSelectLines={handleSelectLines}
                onAllReelsStopped={handleAllReelsStopped}
                onQuickStop={handleQuickStop}
                freeSpinsRemaining={freeSpinsRemaining}
                freeSpinsMultiplier={freeSpinDef.freeSpinsMultiplier}
                onSpin={executeSpin}
                canSpin={balance >= totalBet || freeSpinsRemaining > 0}
                isFeverMode={feverSpinsLeft > 0}
                currentSceneId={currentSceneId}
                onRewardCoins={(amount) => {
                  setBalance((b) => b + amount);
                  soundManager.playCoinTally();
                }}
                activeGameId={activeGameId}
                isFloorMode={isFloorMode}
                onOpenGamble={() => setShowGambleModal(true)}
              />
            </CasinoFloorBank>
          );
        })()}
      </main>

      {/* Integrated Bottom Controls Dock */}
      <div className={`flex-shrink-0 relative z-30 w-full border-t pb-safe transition-colors duration-300 ${
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
          onLinesChange={handleSelectLines}
          onBetPerLineChange={handleSelectBetPerLine}
          onMaxBet={handleMaxBet}
          onTurboToggle={() => setIsTurbo((prev) => !prev)}
          onAutoSpinStart={(count) => {
            // The first spin starts immediately, so queue one fewer
            setAutoSpinsRemaining(Math.max(0, count - 1));
            executeSpin();
          }}
          onAutoSpinStop={() => setAutoSpinsRemaining(0)}
          onOpenGamble={() => setShowGambleModal(true)}
          availableLines={activeGameDef.availableLines}
          maxLines={activeGameDef.defaultLines}
          activeGameId={activeGameId}
          betSteps={activeGameDef.betSteps}
          maxBetPerLine={activeGameDef.maxBetPerLine}
          maxTotalBet={activeGameDef.maxTotalBet}
        />

        {/* Integrated Footer info banner */}
        <footer className={`hidden xl:block py-0.5 border-t text-center text-[8.5px] sm:text-[9.5px] flex-shrink-0 ${
          isTimber
            ? 'bg-[#0e0a07]/95 border-emerald-900/40 text-emerald-500/80 font-serif'
            : isPixel
            ? 'bg-black/95 border-pink-500/30 text-cyan-400/80 font-mono'
            : isPs2
            ? 'bg-[#02050f]/95 border-[#006FCD]/40 text-cyan-400/80 font-mono'
            : 'bg-casino-950/90 border-white/5 text-slate-500'
        }`}>
          PRESS <kbd className="px-1.5 py-0.5 bg-casino-900 border border-white/10 rounded text-slate-300 font-mono">SPACE</kbd> TO SPIN / QUICK STOP • <kbd className="px-1.5 py-0.5 bg-casino-900 border border-white/10 rounded text-slate-300 font-mono">G</kbd> SWITCH GAME • <kbd className="px-1.5 py-0.5 bg-casino-900 border border-white/10 rounded text-slate-300 font-mono">P</kbd> PAYTABLE • SLOTY IS A FREE GAME — VIRTUAL COINS ONLY, NO REAL-MONEY PAYOUTS • <span className="text-cyan-300 font-mono font-bold">SLOTY v2.4.1 (MATRIX-LOCKED)</span>
        </footer>
      </div>

      {/* Corny Pin-Joint Puppet Character Pop-Up (Baron Bartholomew Sterling, Grizzly Gus & Bit-Crusher) */}
      <PuppetCharacterPopup
        activeGameId={activeGameId}
        isSpinning={isSpinning}
        isAnticipating={
          isSpinning &&
          !!currentGrid[0]?.includes(activeGameDef.scatterId) &&
          !!currentGrid[1]?.includes(activeGameDef.scatterId)
        }
        isNearMiss={!isSpinning && !!spinResult && spinResult.scatterCount === 2}
        isMaxBet={totalBet >= progression.maxBet}
        consecutiveWins={consecutiveWins}
        winAmount={spinResult?.totalPayout || 0}
        unlockedTier={unlockedQuotaTier}
        onRewardCoins={(amount) => {
          setBalance((b) => b + amount);
          soundManager.playCoinTally();
        }}
        onClearUnlockedTier={() => setUnlockedQuotaTier(null)}
      />

      {/* --- Modals & Overlays --- */}

      {/* Win Celebration Modal */}
      {celebration && (
        <WinCelebrationModal
          winTier={celebration.tier}
          winAmount={celebration.amount}
          onDismiss={() => setCelebration(null)}
          activeGameId={activeGameId}
        />
      )}

      {/* Video Poker Double-Up Gamble Modal */}
      {showGambleModal && (
        <GambleModal
          initialPot={winAmount}
          activeGameId={activeGameId}
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
          freeSpinsAwarded={freeSpinDef.freeSpinsAward}
          multiplier={freeSpinDef.freeSpinsMultiplier}
          onStart={handleStartFreeSpins}
          activeGameId={freeSpinGameId ?? activeGameId}
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

      {/* Developer Debug Suite Drawer — dev builds / ?debug=1 only */}
      {DEBUG_ENABLED && (
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
          const evaluated = evaluateSpin(grid, totalBet, selectedLines, freeSpinsRemaining > 0 ? freeSpinDef.freeSpinsMultiplier : 1, activeGameDef);
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
      )}

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
