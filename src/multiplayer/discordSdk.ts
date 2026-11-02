import { DiscordSDK } from '@discord/embedded-app-sdk';
import type { DiscordUserProfile } from './discordTypes';
import { storage } from '../utils/storage';

// Default application client ID for Discord Developer Portal registration
// Users can provide their own via VITE_DISCORD_CLIENT_ID or URL query param
const DEFAULT_CLIENT_ID = '123456789012345678';

class DiscordManager {
  private sdk: DiscordSDK | null = null;
  private profile: DiscordUserProfile | null = null;
  private isInitialized = false;

  public async initialize(): Promise<DiscordUserProfile> {
    if (this.isInitialized && this.profile) {
      return this.profile;
    }

    // Check if running inside Discord Activity iframe (Discord injects frame_id)
    const urlParams = new URLSearchParams(window.location.search);
    const frameId = urlParams.get('frame_id');
    const clientId =
      urlParams.get('client_id') ||
      import.meta.env.VITE_DISCORD_CLIENT_ID ||
      DEFAULT_CLIENT_ID;

    if (frameId) {
      try {
        this.sdk = new DiscordSDK(clientId);
        await this.sdk.ready();

        // Retrieve Discord Guild & Channel context
        const guildId = this.sdk.guildId || undefined;
        const channelId = this.sdk.channelId || undefined;

        // Perform client authentication or fetch user details
        let username = 'Discord Player';
        let avatarUrl = 'https://cdn.discordapp.com/embed/avatars/0.png';
        let userId = 'discord_' + Math.random().toString(36).substring(2, 9);

        // Fetch activity participants directly from Discord SDK without requiring a backend
        try {
          const result = await this.sdk.commands.getInstanceConnectedParticipants();
          if (result && result.participants && result.participants.length > 0) {
            const first = result.participants[0];
            username = first.global_name || first.username;
            userId = first.id;
            if (first.avatar) {
              avatarUrl = `https://cdn.discordapp.com/avatars/${first.id}/${first.avatar}.png`;
            }
          }
        } catch {
          // If unauthenticated, attempt authorize flow
          try {
            await this.sdk.commands.authorize({
              client_id: clientId,
              scope: ['identify', 'guilds'],
            });
          } catch {
            // Fallback inside Discord
          }
        }

        this.profile = {
          id: userId,
          username,
          globalName: username,
          avatarUrl,
          isDiscordActivity: true,
          guildId,
          channelId,
        };
        this.isInitialized = true;
        return this.profile;
      } catch (err) {
        console.warn('Discord SDK initialization failed, falling back to Web Guest mode', err);
      }
    }

    // Web Guest fallback mode: generate or load persistent VIP identity
    let savedId = storage.getItem('sloty_user_id');
    if (!savedId) {
      savedId = 'vip_' + Math.random().toString(36).substring(2, 9);
      storage.setItem('sloty_user_id', savedId);
    }

    let savedName = storage.getItem('sloty_username');
    if (!savedName) {
      const handles = ['HighRoller', 'LuckyAce', 'GoldBaron', 'VaultMaster', 'DiamondKing'];
      savedName = `${handles[Math.floor(Math.random() * handles.length)]}_${Math.floor(
        Math.random() * 900 + 100
      )}`;
      storage.setItem('sloty_username', savedName);
    }

    // Assign avatar from curated casino avatars
    const avatarIndex = (savedId.charCodeAt(savedId.length - 1) || 0) % 5;
    const avatarUrl = `https://cdn.discordapp.com/embed/avatars/${avatarIndex}.png`;

    this.profile = {
      id: savedId,
      username: savedName,
      globalName: savedName,
      avatarUrl,
      isDiscordActivity: false,
    };
    this.isInitialized = true;
    return this.profile;
  }

  public getProfile(): DiscordUserProfile | null {
    return this.profile;
  }

  public getSDK(): DiscordSDK | null {
    return this.sdk;
  }
}

export const discordManager = new DiscordManager();
