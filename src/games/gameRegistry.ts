import type { GameDefinition, GameId } from './types';
import { VAULT_24K_GAME } from './vault24k/vaultDefinition';
import { TIMBER_CRITTERS_GAME } from './timberland/timberDefinition';

export const GAMES: Record<GameId, GameDefinition> = {
  'vault-24k': VAULT_24K_GAME,
  'timber-critters': TIMBER_CRITTERS_GAME,
};

export const DEFAULT_GAME_ID: GameId = 'vault-24k';

export function getGame(id: GameId): GameDefinition {
  return GAMES[id] || VAULT_24K_GAME;
}

export function getAllGames(): GameDefinition[] {
  return Object.values(GAMES);
}
