import type { CasinoPeerState, CasinoRoomMessage, DiscordUserProfile } from './discordTypes';
import { storage } from '../utils/storage';
import { soundManager } from '../audio/soundManager';

type PeerUpdateCallback = (peers: CasinoPeerState[]) => void;
type TipReceivedCallback = (fromName: string, amount: number) => void;

class CasinoRoomManager {
  private channel: BroadcastChannel | null = null;
  private currentProfile: DiscordUserProfile | null = null;
  private peers: Map<string, CasinoPeerState> = new Map();
  private peerSubscribers: Set<PeerUpdateCallback> = new Set();
  private tipSubscribers: Set<TipReceivedCallback> = new Set();
  private simulationTimer: number | null = null;

  public initialize(profile: DiscordUserProfile, initialBalance: number) {
    this.currentProfile = profile;

    // 1. Setup local self peer
    const selfPeer: CasinoPeerState = {
      id: profile.id,
      name: profile.username,
      avatarUrl: profile.avatarUrl,
      isSelf: true,
      balance: initialBalance,
      peakBalance: storage.getNumber('sloty_peak_balance', initialBalance),
      lastWin: 0,
      isSpinning: false,
      reelSymbols: [
        ['WILD', 'SEVEN', 'DIAMOND', 'BELL'],
        ['SEVEN', 'MELON', 'GRAPES', 'ACE'],
        ['DIAMOND', 'GOLDBAR', 'COIN', 'KING'],
        ['BELL', 'HORSESHOE', 'PLUM', 'QUEEN'],
        ['WILD', 'SEVEN', 'DIAMOND', 'JACK'],
      ],
      winningLineCount: 0,
      isFreeSpins: false,
      statusText: 'Ready to spin',
      lastActive: Date.now(),
    };
    this.peers.set(profile.id, selfPeer);

    // 2. Setup BroadcastChannel for real-time cross-tab / cross-window sync
    try {
      this.channel = new BroadcastChannel('sloty_discord_casino_bank');
      this.channel.onmessage = (event: MessageEvent<CasinoRoomMessage>) => {
        this.handleIncomingMessage(event.data);
      };

      // Broadcast join to other peers
      this.channel.postMessage({
        type: 'JOIN',
        peer: selfPeer,
      });
    } catch {
      // BroadcastChannel fallback if unsupported
    }

    // 3. Populate default simulated patrons so the terminal bank is never empty
    this.initSimulatedPatrons();
    this.startSimulationLoop();
    this.notifySubscribers();
  }

  // Subscribe to real-time peer state updates
  public subscribePeers(cb: PeerUpdateCallback): () => void {
    this.peerSubscribers.add(cb);
    cb(this.getOtherPeers());
    return () => {
      this.peerSubscribers.delete(cb);
    };
  }

  // Subscribe to coin tips received from neighbors
  public subscribeTips(cb: TipReceivedCallback): () => void {
    this.tipSubscribers.add(cb);
    return () => {
      this.tipSubscribers.delete(cb);
    };
  }

  public getOtherPeers(): CasinoPeerState[] {
    const list: CasinoPeerState[] = [];
    this.peers.forEach((peer) => {
      if (!peer.isSelf) list.push(peer);
    });
    return list;
  }

  // Broadcast your own spin start
  public broadcastSpinStart(bet: number) {
    if (!this.currentProfile) return;
    const self = this.peers.get(this.currentProfile.id);
    if (self) {
      self.isSpinning = true;
      self.balance = Math.max(0, self.balance - bet);
      self.statusText = 'Spinning reels...';
      self.lastActive = Date.now();
    }

    this.channel?.postMessage({
      type: 'SPIN_START',
      peerId: this.currentProfile.id,
      bet,
    });
    this.notifySubscribers();
  }

  // Broadcast your spin settlement & wins
  public broadcastSpinResult(
    symbols: string[][],
    winAmount: number,
    newBalance: number,
    isFreeSpins: boolean,
    winningLinesCount: number
  ) {
    if (!this.currentProfile) return;
    const self = this.peers.get(this.currentProfile.id);
    if (self) {
      self.isSpinning = false;
      self.reelSymbols = symbols;
      self.lastWin = winAmount;
      self.balance = newBalance;
      self.isFreeSpins = isFreeSpins;
      self.winningLineCount = winningLinesCount;
      if (newBalance > self.peakBalance) {
        self.peakBalance = newBalance;
        storage.setItem('sloty_peak_balance', newBalance.toString());
      }
      self.statusText =
        winAmount > 0
          ? `Hit +$${winAmount.toLocaleString()}!`
          : isFreeSpins
          ? 'Free Spins in progress!'
          : 'Ready to spin';
      self.lastActive = Date.now();
    }

    this.channel?.postMessage({
      type: 'SPIN_RESULT',
      peerId: this.currentProfile.id,
      symbols,
      winAmount,
      newBalance,
      isFreeSpins,
    });
    this.notifySubscribers();
  }

  // Send a coin tip or high-five to a neighbor
  public tipNeighbor(neighborId: string, amount: number = 25) {
    if (!this.currentProfile) return;
    const neighbor = this.peers.get(neighborId);
    if (!neighbor) return;

    soundManager.playCoinTally();
    soundManager.playCelebrationWhistle();

    // Deduct locally and add to neighbor
    const self = this.peers.get(this.currentProfile.id);
    if (self) {
      self.balance = Math.max(0, self.balance - amount);
    }
    neighbor.balance += amount;
    neighbor.statusText = `Tipped by ${this.currentProfile.username}!`;

    this.channel?.postMessage({
      type: 'TIP_NEIGHBOR',
      fromId: this.currentProfile.id,
      toId: neighborId,
      amount,
    });
    this.notifySubscribers();
  }

  private handleIncomingMessage(msg: CasinoRoomMessage) {
    switch (msg.type) {
      case 'JOIN':
        if (msg.peer.id !== this.currentProfile?.id) {
          this.peers.set(msg.peer.id, { ...msg.peer, isSelf: false, isBot: false });
          this.notifySubscribers();
        }
        break;

      case 'LEAVE':
        this.peers.delete(msg.peerId);
        this.notifySubscribers();
        break;

      case 'SPIN_START': {
        const peer = this.peers.get(msg.peerId);
        if (peer && !peer.isSelf) {
          peer.isSpinning = true;
          peer.statusText = 'Spinning...';
          peer.lastActive = Date.now();
          this.notifySubscribers();
        }
        break;
      }

      case 'SPIN_RESULT': {
        const peer = this.peers.get(msg.peerId);
        if (peer && !peer.isSelf) {
          peer.isSpinning = false;
          peer.reelSymbols = msg.symbols;
          peer.lastWin = msg.winAmount;
          peer.balance = msg.newBalance;
          peer.isFreeSpins = msg.isFreeSpins;
          peer.statusText = msg.winAmount > 0 ? `Hit +$${msg.winAmount.toLocaleString()}!` : 'Idle';
          peer.lastActive = Date.now();

          // Play communal bell fanfare if a friend hits big
          if (msg.winAmount >= 1000) {
            soundManager.playCelebrationWhistle();
          }
          this.notifySubscribers();
        }
        break;
      }

      case 'TIP_NEIGHBOR':
        if (msg.toId === this.currentProfile?.id) {
          const fromPeer = this.peers.get(msg.fromId);
          const fromName = fromPeer?.name || 'A generous neighbor';
          this.tipSubscribers.forEach((cb) => cb(fromName, msg.amount));
        }
        break;
    }
  }

  private initSimulatedPatrons() {
    const patronA: CasinoPeerState = {
      id: 'bot_ruby',
      name: 'RubyViper_VIP',
      avatarUrl: 'https://cdn.discordapp.com/embed/avatars/1.png',
      isSelf: false,
      isBot: true,
      balance: 14250,
      peakBalance: 24500,
      lastWin: 350,
      isSpinning: false,
      reelSymbols: [
        ['SEVEN', 'SEVEN', 'DIAMOND', 'BELL'],
        ['WILD', 'SEVEN', 'COIN', 'ACE'],
        ['SEVEN', 'DIAMOND', 'GOLDBAR', 'KING'],
        ['BELL', 'HORSESHOE', 'PLUM', 'QUEEN'],
        ['SEVEN', 'WILD', 'DIAMOND', 'JACK'],
      ],
      winningLineCount: 2,
      isFreeSpins: false,
      statusText: 'Hot streak on Seat #1!',
      lastActive: Date.now(),
    };

    const patronB: CasinoPeerState = {
      id: 'bot_jack',
      name: 'DiamondJack77',
      avatarUrl: 'https://cdn.discordapp.com/embed/avatars/2.png',
      isSelf: false,
      isBot: true,
      balance: 8900,
      peakBalance: 18200,
      lastWin: 0,
      isSpinning: false,
      reelSymbols: [
        ['DIAMOND', 'BELL', 'GOLDBAR', 'ACE'],
        ['COIN', 'DIAMOND', 'WILD', 'KING'],
        ['HORSESHOE', 'MELON', 'DIAMOND', 'QUEEN'],
        ['BELL', 'DIAMOND', 'SEVEN', 'JACK'],
        ['DIAMOND', 'COIN', 'WILD', 'BELL'],
      ],
      winningLineCount: 0,
      isFreeSpins: false,
      statusText: 'Hunting Vault Scatters',
      lastActive: Date.now(),
    };

    this.peers.set(patronA.id, patronA);
    this.peers.set(patronB.id, patronB);
  }

  // Periodic life simulation so bots spin and win occasionally
  private startSimulationLoop() {
    this.simulationTimer = window.setInterval(() => {
      // Pick a random bot
      const bots = Array.from(this.peers.values()).filter((p) => p.isBot);
      if (bots.length === 0) return;
      const targetBot = bots[Math.floor(Math.random() * bots.length)];

      if (!targetBot.isSpinning) {
        targetBot.isSpinning = true;
        targetBot.statusText = 'Spinning...';
        this.notifySubscribers();

        setTimeout(() => {
          targetBot.isSpinning = false;
          const hitsWin = Math.random() > 0.45;
          const winAmount = hitsWin ? Math.floor(Math.random() * 800 + 50) : 0;
          targetBot.lastWin = winAmount;
          targetBot.balance += winAmount - 40;
          if (targetBot.balance > targetBot.peakBalance) {
            targetBot.peakBalance = targetBot.balance;
          }
          targetBot.statusText = hitsWin ? `Won +$${winAmount.toLocaleString()}!` : 'Idle';
          this.notifySubscribers();
        }, 1800);
      }
    }, 5500);
  }

  private notifySubscribers() {
    const list = this.getOtherPeers();
    this.peerSubscribers.forEach((cb) => cb(list));
  }

  public destroy() {
    if (this.simulationTimer) clearInterval(this.simulationTimer);
    if (this.currentProfile && this.channel) {
      this.channel.postMessage({ type: 'LEAVE', peerId: this.currentProfile.id });
      this.channel.close();
    }
  }
}

export const casinoRoomManager = new CasinoRoomManager();
