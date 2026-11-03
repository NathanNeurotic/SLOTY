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
    targetPoints: 5000,
    coinReward: 500,
    dialogueUnlock: 'Splendid! You earned a warm buttered biscuit. Don’t get used to such luxury!',
    perkDescription: 'Executive permission to consume one carbohydrate.',
  },
  {
    tier: 2,
    name: 'Brass Monocle Polish Certificate',
    targetPoints: 15000,
    coinReward: 1500,
    dialogueUnlock: 'Good heavens! The board was impressed. I had my valet send you a token!',
    perkDescription: '+15% steam pressure in the coin minting press.',
  },
  {
    tier: 3,
    name: '15-Watt Corp-Approved Desk Fan',
    targetPoints: 40000,
    coinReward: 4000,
    dialogueUnlock: 'Outstanding work, grease monkey! You’re putting my nephew to shame!',
    perkDescription: 'Cooling breeze for long high-roller sessions.',
  },
  {
    tier: 4,
    name: 'Key to the Executive Washroom',
    targetPoints: 90000,
    coinReward: 10000,
    dialogueUnlock: 'Great smoking gears! You hit the quota! The velvet towels are yours!',
    perkDescription: 'Single-ply is for peasants. You get the 3-ply.',
  },
  {
    tier: 5,
    name: 'EXPANSION CHAPTER: 2 Years of Overtime Rewarded',
    targetPoints: 200000,
    coinReward: 25000,
    dialogueUnlock: 'CONGRATULATIONS! Two years of spinning and you unlocked Chapter 2: The Deep Sub-Vault!',
    perkDescription: 'Grand Tycoon status. Bartholomew sheds a single oil tear.',
  },
];

export const TIMBER_QUOTA_TIERS: QuotaTier[] = [
  {
    tier: 1,
    name: 'Hot Flapjack with Extra Maple Drizzle',
    targetPoints: 5000,
    coinReward: 500,
    dialogueUnlock: 'HOT SQUIRREL GRAVY! That’s one fluffy pancake right off the griddle!',
    perkDescription: 'Fuel for the afternoon timber haul.',
  },
  {
    tier: 2,
    name: 'Rust-Free Two-Man Crosscut Saw',
    targetPoints: 15000,
    coinReward: 1500,
    dialogueUnlock: 'Atta boy! That saw cuts cedar like soft butter. Keep crankin’!',
    perkDescription: 'Freshly oiled teeth for smooth woodland harvesting.',
  },
  {
    tier: 3,
    name: 'Arm-Wrestle Challenge with Grizzly Gus',
    targetPoints: 40000,
    coinReward: 4000,
    dialogueUnlock: 'HOO BOY! Gus says if you beat him, you get the whole honey hive!',
    perkDescription: 'Bear-grade stamina boost for forest free spins.',
  },
  {
    tier: 4,
    name: 'Chief Woodsman Plaque in Cabin B',
    targetPoints: 90000,
    coinReward: 10000,
    dialogueUnlock: 'TIMBERRRR! Your name is officially carved into the camp mantelpiece!',
    perkDescription: 'Permanent respect from all deer and badgers.',
  },
  {
    tier: 5,
    name: 'EXPANSION CHAPTER: Expedition to Bigfoot Hollow',
    targetPoints: 200000,
    coinReward: 25000,
    dialogueUnlock: 'YEEEE-HAW! You split 10,000 logs and unlocked Chapter 2: The Sasquatch Reserve!',
    perkDescription: 'Legendary camp master status. Sasquatch leaves fresh berries.',
  },
];

export interface QuotaState {
  currentPoints: number;
  currentTierIndex: number; // 0 to 4
  totalCompletedCycles: number;
}

export class QuotaManager {
  private static instance: QuotaManager;
  private state: Record<GameId, QuotaState> = {
    'vault-24k': { currentPoints: 0, currentTierIndex: 0, totalCompletedCycles: 0 },
    'timber-critters': { currentPoints: 0, currentTierIndex: 0, totalCompletedCycles: 0 },
  };

  private listeners: Array<(gameId: GameId, state: QuotaState) => void> = [];

  private constructor() {
    this.loadState('vault-24k');
    this.loadState('timber-critters');
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
    return gameId === 'timber-critters' ? TIMBER_QUOTA_TIERS : VAULT_QUOTA_TIERS;
  }

  public getCurrentTier(gameId: GameId): QuotaTier {
    const tiers = this.getTiers(gameId);
    const idx = Math.min(this.state[gameId].currentTierIndex, tiers.length - 1);
    return tiers[idx];
  }

  /**
   * Adds points earned from a spin. Wagers grant 1x points; winnings grant 2x points!
   * Returns newly unlocked QuotaTier if a milestone was reached, otherwise null.
   */
  public addSpinProgress(
    gameId: GameId,
    wager: number,
    winAmount: number
  ): { unlockedTier: QuotaTier | null; rewardCoins: number } {
    const pointsGained = Math.round(wager * 1.2 + winAmount * 2.0);
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
        curState.currentTierIndex += 1;
      } else {
        // Completed entire chapter! Reset to Tier 0 with a cycle prestige bump
        curState.currentTierIndex = 0;
        curState.currentPoints = 0;
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
