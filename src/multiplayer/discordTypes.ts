export interface DiscordUserProfile {
  id: string;
  username: string;
  globalName: string;
  avatarUrl: string;
  isDiscordActivity: boolean;
  guildId?: string;
  channelId?: string;
}

export interface CasinoPeerState {
  id: string;
  name: string;
  avatarUrl: string;
  isSelf: boolean;
  isBot?: boolean;
  balance: number;
  peakBalance: number;
  lastWin: number;
  isSpinning: boolean;
  reelSymbols: string[][]; // 5 columns x 4 rows
  winningLineCount: number;
  isFreeSpins: boolean;
  statusText: string;
  lastActive: number;
}

export type CasinoRoomMessage =
  | { type: 'JOIN'; peer: CasinoPeerState }
  | { type: 'LEAVE'; peerId: string }
  | { type: 'SPIN_START'; peerId: string; bet: number }
  | { type: 'SPIN_RESULT'; peerId: string; symbols: string[][]; winAmount: number; newBalance: number; isFreeSpins: boolean }
  | { type: 'HIGH_SCORE'; peerId: string; peakBalance: number }
  | { type: 'TIP_NEIGHBOR'; fromId: string; toId: string; amount: number };
