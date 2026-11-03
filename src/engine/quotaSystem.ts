import { storage } from '../utils/storage';
import type { GameId } from '../games/types';

export interface QuotaTier {
  tier: number;
  name: string;
  targetPoints: number;
  coinReward: number;
  dialogueUnlock: string;
  perkDescription: string;
}

export const VAULT_QUOTA_TIERS: QuotaTier[] = [
  {
    tier: 1,
    name: '4-Minute Cafeteria Biscuit Break',
    targetPoints: 250,
    coinReward: 1000,
    dialogueUnlock: 'Splendid! You earned a warm buttered biscuit. Don’t get used to such luxury!',
    perkDescription: 'Executive permission to consume one carbohydrate.',
  },
  {
    tier: 2,
    name: 'Brass Monocle Polish Certificate',
    targetPoints: 750,
    coinReward: 2500,
    dialogueUnlock: 'Good heavens! The board was impressed. I had my valet send you a token!',
    perkDescription: '+15% steam pressure in the coin minting press.',
  },
  {
    tier: 3,
    name: '15-Watt Corp-Approved Desk Fan',
    targetPoints: 2000,
    coinReward: 5000,
    dialogueUnlock: 'Outstanding work, grease monkey! You’re putting my nephew to shame!',
    perkDescription: 'Cooling breeze for long high-roller sessions.',
  },
  {
    tier: 4,
    name: 'Key to the Executive Washroom',
    targetPoints: 5000,
    coinReward: 15000,
    dialogueUnlock: 'Great smoking gears! You hit the quota! The velvet towels are yours!',
    perkDescription: 'Single-ply is for peasants. You get the 3-ply.',
  },
  {
    tier: 5,
    name: 'EXPANSION CHAPTER: 2 Years of Overtime Rewarded',
    targetPoints: 15000,
    coinReward: 50000,
    dialogueUnlock: 'CONGRATULATIONS! Two years of spinning and you unlocked Chapter 2: The Deep Sub-Vault!',
    perkDescription: 'Grand Tycoon status. Bartholomew sheds a single oil tear.',
  },
];

export const TIMBER_QUOTA_TIERS: QuotaTier[] = [
  {
    tier: 1,
    name: 'Hot Flapjack with Extra Maple Drizzle',
    targetPoints: 250,
    coinReward: 1000,
    dialogueUnlock: 'HOT SQUIRREL GRAVY! That’s one fluffy pancake right off the griddle!',
    perkDescription: 'Fuel for the afternoon timber haul.',
  },
  {
    tier: 2,
    name: 'Rust-Free Two-Man Crosscut Saw',
    targetPoints: 750,
    coinReward: 2500,
    dialogueUnlock: 'Atta boy! That saw cuts cedar like soft butter. Keep crankin’!',
    perkDescription: 'Freshly oiled teeth for smooth woodland harvesting.',
  },
  {
    tier: 3,
    name: 'Arm-Wrestle Challenge with Grizzly Gus',
    targetPoints: 2000,
    coinReward: 5000,
    dialogueUnlock: 'HOO BOY! Gus says if you beat him, you get the whole honey hive!',
    perkDescription: 'Bear-grade stamina boost for forest free spins.',
  },
  {
    tier: 4,
    name: 'Chief Woodsman Plaque in Cabin B',
    targetPoints: 5000,
    coinReward: 15000,
    dialogueUnlock: 'TIMBERRRR! Your name is officially carved into the camp mantelpiece!',
    perkDescription: 'Permanent respect from all deer and badgers.',
  },
  {
    tier: 5,
    name: 'EXPANSION CHAPTER: Expedition to Bigfoot Hollow',
    targetPoints: 15000,
    coinReward: 50000,
    dialogueUnlock: 'YEEEE-HAW! You split 10,000 logs and unlocked Chapter 2: The Sasquatch Reserve!',
    perkDescription: 'Legendary camp master status. Sasquatch leaves fresh berries.',
  },
];

export const PIXEL_QUOTA_TIERS: QuotaTier[] = [
  {
    tier: 1,
    name: 'Warm Plastic Cup of 25 Tokens',
    targetPoints: 250,
    coinReward: 1000,
    dialogueUnlock: 'LEVEL 1 CLEAR! The arcade attendant dumped a fresh cup of brass tokens on your machine!',
    perkDescription: 'Fresh brass tokens from the coin hopper.',
  },
  {
    tier: 2,
    name: 'Rapid-Fire Turbo Controller Mod',
    targetPoints: 750,
    coinReward: 2500,
    dialogueUnlock: 'COMBO STREAK! Your thumb is blistering, but that rapid-fire mod is smoking hot!',
    perkDescription: '+15% faster combo charge on arcade reels.',
  },
  {
    tier: 3,
    name: 'CRT Monitor De-Gaussing Coil',
    targetPoints: 2000,
    coinReward: 5000,
    dialogueUnlock: 'BZZZZZT! De-gaussing the CRT tube! Those pixel colors are blindingly sharp!',
    perkDescription: 'Removes magnetic distortion from the phosphor glass.',
  },
  {
    tier: 4,
    name: 'All-Time High Score Initials "AAA"',
    targetPoints: 5000,
    coinReward: 15000,
    dialogueUnlock: 'HIGH SCORE LEADER! Your initials AAA are permanently burnt into the phosphor glass!',
    perkDescription: 'Top spot on the neighborhood leaderboard.',
  },
  {
    tier: 5,
    name: 'EXPANSION CHAPTER: Secret Warp Zone to World 8-4',
    targetPoints: 15000,
    coinReward: 50000,
    dialogueUnlock: 'WARP ZONE UNLOCKED! You found the hidden pipe behind the coin door! Expansion Chapter active!',
    perkDescription: 'Master of the 8-bit universe. Mecha Dragon bows down.',
  },
];

export const PS2_QUOTA_TIERS: QuotaTier[] = [
  {
    tier: 1,
    name: '8MB MagicGate Memory Card Format',
    targetPoints: 250,
    coinReward: 1000,
    dialogueUnlock: 'FORMAT COMPLETE! 8MB MagicGate card initialized in Slot 1! System save blocks allocated.',
    perkDescription: 'Authentic 8MB block allocation for session winnings.',
  },
  {
    tier: 2,
    name: 'DualShock 2 Pressure-Sensitive Calibration',
    targetPoints: 750,
    coinReward: 2500,
    dialogueUnlock: 'ANALOG ACTIVE! Dual analog sticks calibrated with 256 levels of pressure sensitivity!',
    perkDescription: 'Dual rumble vibration motors active during spin anticipation.',
  },
  {
    tier: 3,
    name: 'Component AV Gold-Plated Cable Upgrade',
    targetPoints: 2000,
    coinReward: 5000,
    dialogueUnlock: 'CRYSTAL CLARITY! Switched to 480p progressive scan component video! The blue lasers gleam.',
    perkDescription: '480p crystal progressive visual clarity across all 40 paylines.',
  },
  {
    tier: 4,
    name: '128-Bit Emotion Engine Core Overclock',
    targetPoints: 5000,
    coinReward: 15000,
    dialogueUnlock: 'OVERCLOCK ENGAGED! Emotion Engine CPU pushed to 294.912 MHz! Maximum vector floating point power!',
    perkDescription: '66 million polygons per second rendering the jackpot aura.',
  },
  {
    tier: 5,
    name: 'EXPANSION CHAPTER: Midnight BIOS Ocean Void Archive',
    targetPoints: 15000,
    coinReward: 50000,
    dialogueUnlock: 'SYSTEM UNLOCKED! You summoned all floating 3D save monoliths in the BIOS Ocean Void! Chapter 2 Active!',
    perkDescription: 'Legendary PS2 Grandmaster. All memory towers permanently illuminated.',
  },
];

export interface QuotaState {
  currentPoints: number;
  currentTierIndex: number;
  totalCompletedCycles: number;
}

export class QuotaManager {
  private static instance: QuotaManager;
  private state: Record<GameId, QuotaState> = {
    'vault-24k': { currentPoints: 0, currentTierIndex: 0, totalCompletedCycles: 0 },
    'timber-critters': { currentPoints: 0, currentTierIndex: 0, totalCompletedCycles: 0 },
    'pixel-arcade': { currentPoints: 0, currentTierIndex: 0, totalCompletedCycles: 0 },
    'ps2-legends': { currentPoints: 0, currentTierIndex: 0, totalCompletedCycles: 0 },
  };

  private listeners: Array<(gameId: GameId, state: QuotaState) => void> = [];

  private constructor() {
    this.loadState('vault-24k');
    this.loadState('timber-critters');
    this.loadState('pixel-arcade');
    this.loadState('ps2-legends');
  }

  public static getInstance(): QuotaManager {
    if (!QuotaManager.instance) {
      QuotaManager.instance = new QuotaManager();
    }
    return QuotaManager.instance;
  }

  private loadState(gameId: GameId) {
    const raw = storage.getItem(`sloty_quota_${gameId}`);
    if (raw) {
      try {
        const parsed = JSON.parse(raw);
        this.state[gameId] = parsed;
      } catch {}
    }
  }

  private saveState(gameId: GameId) {
    storage.setItem(`sloty_quota_${gameId}`, JSON.stringify(this.state[gameId]));
    this.listeners.forEach((l) => l(gameId, this.state[gameId]));
  }

  public getState(gameId: GameId): QuotaState {
    return this.state[gameId] || { currentPoints: 0, currentTierIndex: 0, totalCompletedCycles: 0 };
  }

  public getTiers(gameId: GameId): QuotaTier[] {
    if (gameId === 'timber-critters') return TIMBER_QUOTA_TIERS;
    if (gameId === 'pixel-arcade') return PIXEL_QUOTA_TIERS;
    if (gameId === 'ps2-legends') return PS2_QUOTA_TIERS;
    return VAULT_QUOTA_TIERS;
  }

  public getCurrentTier(gameId: GameId): QuotaTier {
    const tiers = this.getTiers(gameId);
    const idx = Math.min(this.state[gameId].currentTierIndex, tiers.length - 1);
    return tiers[idx];
  }

  /**
   * Adds points earned from a spin.
   * Progress scales with spins and win multipliers rather than raw coin bets,
   * guaranteeing consistent 15-40 spin pacing per tier without instant-skip resets.
   */
  public addSpinProgress(
    gameId: GameId,
    wager: number,
    winAmount: number
  ): { unlockedTier: QuotaTier | null; rewardCoins: number } {
    const winRatio = wager > 0 ? winAmount / wager : 0;
    const basePoints = 15;
    const winBonus = winAmount > 0 ? (winRatio >= 25 ? 120 : winRatio >= 5 ? 50 : 20) : 0;
    const pointsGained = basePoints + winBonus;

    const curState = this.state[gameId];
    const tiers = this.getTiers(gameId);
    const curTier = tiers[curState.currentTierIndex];

    curState.currentPoints += pointsGained;

    let unlocked: QuotaTier | null = null;
    let rewardCoins = 0;

    if (curState.currentPoints >= curTier.targetPoints) {
      unlocked = curTier;
      rewardCoins = curTier.coinReward;

      if (curState.currentTierIndex < tiers.length - 1) {
        curState.currentPoints = Math.max(0, curState.currentPoints - curTier.targetPoints);
        curState.currentTierIndex += 1;
      } else {
        // Unlocked final chapter! Cap at max target and increment prestige cycle count without resetting to 0
        curState.currentPoints = curTier.targetPoints;
        curState.totalCompletedCycles += 1;
      }
    }

    this.saveState(gameId);
    return { unlockedTier: unlocked, rewardCoins };
  }

  public subscribe(listener: (gameId: GameId, state: QuotaState) => void): () => void {
    this.listeners.push(listener);
    return () => {
      this.listeners = this.listeners.filter((l) => l !== listener);
    };
  }
}

export const quotaManager = QuotaManager.getInstance();
