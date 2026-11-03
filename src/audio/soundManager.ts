import { storage } from '../utils/storage';
import type { GameId } from '../games/types';

class SoundManager {
  private ctx: AudioContext | null = null;
  private isMuted: boolean = false;
  private isMusicMutedState: boolean = false;
  private sfxVolume: number = 0.85;
  private musicVolume: number = 0.70;

  // Master Background Music Bus & Butterworth Warmth Lowpass Filter
  private musicBus: GainNode | null = null;
  private musicWarmthFilter: BiquadFilterNode | null = null;

  // Background Music Sequencer State
  private isMusicPlayingState: boolean = false;
  private musicStep: number = 0;
  private musicTimerId: number | null = null;
  private musicTempo: number = 86; // Relaxed tempo for Vegas Lounge Funk
  private isOverdriveMusic: boolean = false;
  private ratchetBuffer: AudioBuffer | null = null;
  private softNoiseBuffer: AudioBuffer | null = null;
  private activeGameTheme: GameId = 'vault-24k';

  constructor() {
    this.isMuted = storage.getBoolean('sloty_muted', false);
    this.isMusicMutedState = !storage.getBoolean('sloty_music_enabled', true);
    this.sfxVolume = storage.getNumber('sloty_sfx_volume', 85) / 100;
    this.musicVolume = storage.getNumber('sloty_music_volume', 70) / 100;
  }

  public initContext() {
    if (!this.ctx) {
      const AudioCtx =
        window.AudioContext ||
        (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      if (AudioCtx) {
        this.ctx = new AudioCtx();
      }
    }
    if (this.ctx && this.ctx.state === 'suspended') {
      this.ctx.resume();
    }
    // Pre-allocate ratchet click noise buffer once to avoid per-tick allocations on mobile
    if (this.ctx && !this.ratchetBuffer) {
      try {
        const bufferLength = Math.floor(this.ctx.sampleRate * 0.015);
        this.ratchetBuffer = this.ctx.createBuffer(1, bufferLength, this.ctx.sampleRate);
        const data = this.ratchetBuffer.getChannelData(0);
        for (let i = 0; i < data.length; i++) {
          data[i] = (Math.random() * 2 - 1) * Math.exp(-i / 60);
        }
      } catch {}
    }
    // Pre-allocate warm pink-ish noise buffer for smooth brushed snares and soft acoustic shakers
    if (this.ctx && !this.softNoiseBuffer) {
      try {
        const bufferLength = Math.floor(this.ctx.sampleRate * 0.5); // 0.5s loopable soft noise
        this.softNoiseBuffer = this.ctx.createBuffer(1, bufferLength, this.ctx.sampleRate);
        const data = this.softNoiseBuffer.getChannelData(0);
        let b0 = 0, b1 = 0, b2 = 0;
        for (let i = 0; i < bufferLength; i++) {
          const white = Math.random() * 2 - 1;
          b0 = 0.99765 * b0 + white * 0.0990460;
          b1 = 0.96300 * b1 + white * 0.170426;
          b2 = 0.57000 * b2 + white * 0.44910;
          data[i] = (b0 + b1 + b2 + white * 0.05) * 0.22;
        }
      } catch {}
    }
    // Master Warmth Bus: lowpass at 3.0 kHz (Butterworth) so no shrill frequencies ever reach speakers
    if (this.ctx && !this.musicBus) {
      try {
        this.musicBus = this.ctx.createGain();
        this.musicBus.gain.setValueAtTime(this.musicVolume * 0.40, this.ctx.currentTime);
        this.musicWarmthFilter = this.ctx.createBiquadFilter();
        this.musicWarmthFilter.type = 'lowpass';
        this.musicWarmthFilter.frequency.setValueAtTime(3000, this.ctx.currentTime);
        this.musicWarmthFilter.Q.setValueAtTime(0.707, this.ctx.currentTime);
        this.musicBus.connect(this.musicWarmthFilter);
        this.musicWarmthFilter.connect(this.ctx.destination);
      } catch {}
    }
  }

  public getMusicDestination(): AudioNode | null {
    if (!this.ctx) return null;
    if (!this.musicBus) {
      this.initContext();
    }
    return this.musicBus || this.ctx.destination;
  }

  // Auto-unlock audio and start background music on first user gesture
  public unlockAudio() {
    this.initContext();
    if (this.ctx && this.ctx.state === 'running' && !this.isMuted && !this.isMusicMutedState) {
      if (!this.isMusicPlayingState) {
        this.startMusic(this.isOverdriveMusic);
      }
    }
  }

  // --- Volume & Mute Controls ---

  public setMuted(muted: boolean) {
    this.isMuted = muted;
    storage.setItem('sloty_muted', muted ? 'true' : 'false');
    if (muted && this.isMusicPlayingState) {
      this.stopMusic();
    } else if (!muted && !this.isMusicMutedState) {
      this.startMusic(this.isOverdriveMusic);
    }
  }

  public getIsMuted(): boolean {
    return this.isMuted;
  }

  public setMusicMuted(muted: boolean) {
    this.isMusicMutedState = muted;
    storage.setItem('sloty_music_enabled', muted ? 'false' : 'true');
    if (muted) {
      this.stopMusic();
    } else {
      this.startMusic(this.isOverdriveMusic);
    }
  }

  public getIsMusicMuted(): boolean {
    return this.isMusicMutedState;
  }

  public setVolume(vol: number) {
    this.sfxVolume = Math.max(0, Math.min(1, vol));
    storage.setItem('sloty_sfx_volume', Math.round(this.sfxVolume * 100).toString());
  }

  public setMusicVolume(vol: number) {
    this.musicVolume = Math.max(0, Math.min(1, vol));
    storage.setItem('sloty_music_volume', Math.round(this.musicVolume * 100).toString());
    if (this.musicBus && this.ctx) {
      this.musicBus.gain.setValueAtTime(this.musicVolume * 0.40, this.ctx.currentTime);
    }
  }

  public getMusicVolume(): number {
    return this.musicVolume;
  }

  public getSFXVolume(): number {
    return this.sfxVolume;
  }

  private createGainNode(
    duration: number,
    startVal: number = 1,
    endVal: number = 0.001
  ): GainNode | null {
    if (!this.ctx || this.isMuted) return null;
    const gain = this.ctx.createGain();
    const now = this.ctx.currentTime;
    gain.gain.setValueAtTime(startVal * this.sfxVolume, now);
    gain.gain.exponentialRampToValueAtTime(
      Math.max(0.0001, endVal * this.sfxVolume),
      now + duration
    );
    gain.connect(this.ctx.destination);

    // Auto-garbage collect audio node after playback finishes to prevent mobile memory leaks
    setTimeout(() => {
      try {
        gain.disconnect();
      } catch {}
    }, (duration + 0.15) * 1000);

    return gain;
  }

  // =========================================================================
  // --- PROCEDURAL VEGAS VIP LOUNGE & FEVER BACKGROUND MUSIC SYNTHESIZER ---
  // =========================================================================

  private updateTempoForTheme() {
    if (this.activeGameTheme === 'timber-critters') {
      this.musicTempo = this.isOverdriveMusic ? 90 : 74;
    } else if (this.activeGameTheme === 'pixel-arcade') {
      this.musicTempo = this.isOverdriveMusic ? 122 : 102;
    } else if (this.activeGameTheme === 'ps2-legends') {
      this.musicTempo = this.isOverdriveMusic ? 116 : 94;
    } else {
      this.musicTempo = this.isOverdriveMusic ? 104 : 86;
    }
  }

  public startMusic(overdrive: boolean = false) {
    this.initContext();
    if (!this.ctx) return;
    if (this.ctx.state === 'suspended') {
      this.ctx.resume();
    }
    if (this.isMuted || this.isMusicMutedState) return;

    this.isOverdriveMusic = overdrive;
    this.updateTempoForTheme();

    if (this.isMusicPlayingState) return;

    this.isMusicPlayingState = true;
    this.musicStep = 0;
    this.scheduleNextMusicBeat();
  }

  public stopMusic() {
    this.isMusicPlayingState = false;
    if (this.musicTimerId) {
      clearTimeout(this.musicTimerId);
      this.musicTimerId = null;
    }
  }

  public toggleMusic() {
    if (this.isMusicPlayingState) {
      this.setMusicMuted(true);
    } else {
      this.setMusicMuted(false);
    }
  }

  public isMusicPlaying(): boolean {
    return this.isMusicPlayingState && !this.isMusicMutedState && !this.isMuted;
  }

  public setOverdriveMusic(overdrive: boolean) {
    this.isOverdriveMusic = overdrive;
    this.updateTempoForTheme();
  }

  private scheduleNextMusicBeat() {
    if (!this.isMusicPlayingState || !this.ctx || this.isMuted || this.isMusicMutedState) {
      return;
    }

    const stepIntervalMs = (60 / this.musicTempo / 4) * 1000; // 16th note interval

    this.playMusicStep(this.musicStep);
    // 16 bars of 16 steps each = 256 steps
    this.musicStep = (this.musicStep + 1) % 256;

    this.musicTimerId = window.setTimeout(() => {
      this.scheduleNextMusicBeat();
    }, stepIntervalMs);
  }

  private playMusicStep(step: number) {
    if (!this.ctx || this.isMuted || this.isMusicMutedState) return;
    if (this.activeGameTheme === 'timber-critters') {
      this.playWoodlandMusicStep(step);
    } else if (this.activeGameTheme === 'pixel-arcade') {
      this.playPixelMusicStep(step);
    } else if (this.activeGameTheme === 'ps2-legends') {
      this.playPs2MusicStep(step);
    } else {
      this.playVaultLoungeMusicStep(step);
    }
  }

  // =========================================================================
  // --- TRACK 1: 24K GOLD VAULT (SMOOTH LO-FI RHODES CASINO LOUNGE JAZZ) ---
  // =========================================================================

  private playVaultLoungeMusicStep(step: number) {
    if (!this.ctx) return;
    const dest = this.getMusicDestination();
    if (!dest) return;

    const now = this.ctx.currentTime;
    const isOverdrive = this.isOverdriveMusic;
    const vol = this.musicVolume;
    const bar = Math.floor(step / 16);
    const stepInBar = step % 16;

    // 1. Kick Drum: Warm soft sine drop
    const isKick =
      stepInBar === 0 ||
      stepInBar === 8 ||
      (isOverdrive && stepInBar % 4 === 0) ||
      (!isOverdrive && bar % 2 === 1 && stepInBar === 14) ||
      (bar === 15 && (stepInBar === 10 || stepInBar === 12));

    if (isKick) {
      const kickOsc = this.ctx.createOscillator();
      const kickGain = this.ctx.createGain();
      kickGain.gain.setValueAtTime(0.50 * vol, now);
      kickGain.gain.exponentialRampToValueAtTime(0.001, now + (isOverdrive ? 0.15 : 0.20));

      kickOsc.type = 'sine';
      kickOsc.frequency.setValueAtTime(isOverdrive ? 130 : 100, now);
      kickOsc.frequency.exponentialRampToValueAtTime(36, now + 0.12);

      kickOsc.connect(kickGain);
      kickGain.connect(dest);
      kickOsc.start(now);
      kickOsc.stop(now + 0.22);
    }

    // 2. Brushed Snare: Filtered soft pink noise
    const isSnare =
      stepInBar === 4 ||
      stepInBar === 12 ||
      (bar === 15 && (stepInBar === 10 || stepInBar === 14 || stepInBar === 15));

    if (isSnare && this.softNoiseBuffer) {
      const noiseSource = this.ctx.createBufferSource();
      noiseSource.buffer = this.softNoiseBuffer;

      const noiseFilter = this.ctx.createBiquadFilter();
      noiseFilter.type = 'bandpass';
      noiseFilter.frequency.setValueAtTime(1100, now);
      noiseFilter.Q.setValueAtTime(1.5, now);

      const noiseGain = this.ctx.createGain();
      noiseGain.gain.setValueAtTime(0.32 * vol, now);
      noiseGain.gain.exponentialRampToValueAtTime(0.001, now + 0.10);

      noiseSource.connect(noiseFilter);
      noiseFilter.connect(noiseGain);
      noiseGain.connect(dest);
      noiseSource.start(now);
      noiseSource.stop(now + 0.12);

      // Warm triangle body snap
      const bodyOsc = this.ctx.createOscillator();
      const bodyGain = this.ctx.createGain();
      bodyGain.gain.setValueAtTime(0.18 * vol, now);
      bodyGain.gain.exponentialRampToValueAtTime(0.001, now + 0.07);
      bodyOsc.type = 'triangle';
      bodyOsc.frequency.setValueAtTime(160, now);
      bodyOsc.frequency.exponentialRampToValueAtTime(80, now + 0.06);

      bodyOsc.connect(bodyGain);
      bodyGain.connect(dest);
      bodyOsc.start(now);
      bodyOsc.stop(now + 0.08);
    }

    // 3. Gentle Sizzle Hi-Hat: Soft bandpassed pink noise (NO square waves!)
    if (step % 2 === 0 || (isOverdrive && step % 4 === 2)) {
      if (this.softNoiseBuffer) {
        const isAccent = stepInBar === 2 || stepInBar === 6 || stepInBar === 10 || stepInBar === 14;
        const hatGain = this.ctx.createGain();
        hatGain.gain.setValueAtTime((isAccent ? 0.18 : 0.09) * vol, now);
        hatGain.gain.exponentialRampToValueAtTime(0.001, now + (isAccent ? 0.05 : 0.035));

        const noiseSource = this.ctx.createBufferSource();
        noiseSource.buffer = this.softNoiseBuffer;

        const filter = this.ctx.createBiquadFilter();
        filter.type = 'bandpass';
        filter.frequency.setValueAtTime(2600, now);
        filter.Q.setValueAtTime(2.2, now);

        noiseSource.connect(filter);
        filter.connect(hatGain);
        hatGain.connect(dest);
        noiseSource.start(now);
        noiseSource.stop(now + 0.06);
      }
    }

    // 4. Velvet Jazz Walking Bassline
    const funkBassline256 = [
      // Bars 0-1 (Cm9): C2 - C2 - Eb2 - F2 - G2 - Bb2 - C2 - Eb2
      65.41, 0, 65.41, 0, 77.78, 0, 87.31, 0, 98.00, 0, 77.78, 0, 87.31, 98.00, 116.54, 0,
      65.41, 0, 77.78, 0, 87.31, 98.00, 110.00, 0, 98.00, 0, 87.31, 0, 77.78, 0, 65.41, 0,
      // Bars 2-3 (Fm9 -> G7alt): F2 - Ab2 - Bb2 - C3 - G2 - B2 - D3 - G2
      87.31, 0, 87.31, 0, 103.83, 0, 116.54, 0, 130.81, 0, 116.54, 0, 103.83, 0, 87.31, 0,
      98.00, 0, 98.00, 0, 123.47, 0, 146.83, 0, 123.47, 0, 116.54, 0, 98.00, 87.31, 77.78, 0,
      // Bars 4-5 (Abmaj9 -> Bb13): Ab1 - C2 - Eb2 - G2 - Bb1 - D2 - F2 - Ab2
      51.91, 0, 51.91, 0, 65.41, 0, 77.78, 0, 103.83, 0, 77.78, 0, 65.41, 0, 51.91, 0,
      58.27, 0, 58.27, 0, 73.42, 0, 87.31, 0, 116.54, 0, 87.31, 0, 73.42, 0, 58.27, 0,
      // Bars 6-7 (Gm7 -> C7b9): G1 - Bb1 - D2 - F2 - C2 - E2 - G2 - Bb2
      49.00, 0, 49.00, 0, 58.27, 0, 73.42, 0, 98.00, 0, 73.42, 0, 58.27, 0, 49.00, 0,
      65.41, 0, 65.41, 0, 82.41, 0, 98.00, 0, 116.54, 0, 98.00, 0, 82.41, 0, 65.41, 0,
      // Bars 8-9 (Dm7b5 -> G7alt): D2 - F2 - Ab2 - C3 - G2 - Ab2 - B2 - D3
      73.42, 0, 73.42, 0, 87.31, 0, 103.83, 0, 130.81, 0, 103.83, 0, 87.31, 0, 73.42, 0,
      98.00, 0, 103.83, 0, 123.47, 0, 146.83, 0, 123.47, 0, 103.83, 0, 98.00, 0, 87.31, 0,
      // Bars 10-11 (Cm9 -> F9 lift): C2 - Eb2 - G2 - Bb2 - F2 - A2 - C3 - Eb3
      65.41, 0, 65.41, 0, 77.78, 0, 98.00, 0, 116.54, 0, 98.00, 0, 77.78, 0, 65.41, 0,
      87.31, 0, 87.31, 0, 110.00, 0, 130.81, 0, 155.56, 0, 130.81, 0, 110.00, 0, 87.31, 0,
      // Bars 12-13 (Ebmaj9 -> Fm9): Eb2 - G2 - Bb2 - D3 - F2 - Ab2 - C3 - Eb3
      77.78, 0, 77.78, 0, 98.00, 0, 116.54, 0, 146.83, 0, 116.54, 0, 98.00, 0, 77.78, 0,
      87.31, 0, 87.31, 0, 103.83, 0, 130.81, 0, 155.56, 0, 130.81, 0, 103.83, 0, 87.31, 0,
      // Bars 14-15 (Abmaj7 -> G7alt Turnaround): Ab1 - C2 - Eb2 - G2 - D2 - G2 - B1 - G1
      51.91, 0, 65.41, 0, 77.78, 0, 103.83, 0, 77.78, 0, 65.41, 0, 51.91, 0, 49.00, 0,
      73.42, 0, 87.31, 0, 98.00, 0, 123.47, 0, 146.83, 123.47, 98.00, 87.31, 77.78, 73.42, 69.30, 0
    ];

    const bassFreq = funkBassline256[step];
    if (bassFreq > 0) {
      const bassOsc = this.ctx.createOscillator();
      const bassGain = this.ctx.createGain();
      bassGain.gain.setValueAtTime((isOverdrive ? 0.38 : 0.32) * vol, now);
      bassGain.gain.exponentialRampToValueAtTime(0.001, now + (isOverdrive ? 0.16 : 0.22));

      bassOsc.type = 'triangle';
      bassOsc.frequency.setValueAtTime(bassFreq, now);

      const filter = this.ctx.createBiquadFilter();
      filter.type = 'lowpass';
      filter.frequency.setValueAtTime(isOverdrive ? 480 : 320, now);
      filter.frequency.exponentialRampToValueAtTime(120, now + 0.18);

      bassOsc.connect(filter);
      filter.connect(bassGain);
      bassGain.connect(dest);
      bassOsc.start(now);
      bassOsc.stop(now + 0.24);
    }

    // 5. Velvet Rhodes Chords: Soft warm electric piano
    if (stepInBar === 0 || stepInBar === 6 || stepInBar === 10) {
      let chordNotes: number[] = [];
      if (bar === 0 || bar === 1) chordNotes = [261.63, 311.13, 392.00, 466.16]; // Cm9
      else if (bar === 2) chordNotes = [261.63, 311.13, 349.23, 415.30]; // Fm9
      else if (bar === 3) chordNotes = [246.94, 311.13, 392.00, 466.16]; // G7alt
      else if (bar === 4 || bar === 5) chordNotes = [261.63, 311.13, 392.00, 415.30]; // Abmaj9
      else if (bar === 6) chordNotes = [233.08, 293.66, 349.23, 440.00]; // Bb13
      else if (bar === 7) chordNotes = [261.63, 329.63, 392.00, 466.16]; // C7b9
      else if (bar === 8) chordNotes = [293.66, 349.23, 415.30, 493.88]; // Dm7b5
      else if (bar === 9) chordNotes = [246.94, 311.13, 392.00, 415.30]; // G7alt
      else if (bar === 10) chordNotes = [261.63, 311.13, 392.00, 466.16]; // Cm9
      else if (bar === 11) chordNotes = [220.00, 261.63, 311.13, 349.23]; // F9
      else if (bar === 12) chordNotes = [261.63, 311.13, 392.00, 466.16]; // Ebmaj9
      else if (bar === 13) chordNotes = [261.63, 311.13, 349.23, 415.30]; // Fm9
      else if (bar === 14) chordNotes = [261.63, 311.13, 415.30, 493.88]; // Abmaj7
      else chordNotes = [246.94, 311.13, 392.00, 466.16]; // G7alt

      const isBeatStart = stepInBar === 0;
      chordNotes.forEach((note) => {
        if (!this.ctx) return;
        const chordOsc = this.ctx.createOscillator();
        const chordGain = this.ctx.createGain();
        chordGain.gain.setValueAtTime((isBeatStart ? 0.09 : 0.05) * vol, now);
        chordGain.gain.exponentialRampToValueAtTime(0.0001, now + (isBeatStart ? 0.55 : 0.30));

        chordOsc.type = 'triangle';
        chordOsc.frequency.setValueAtTime(note, now);

        chordOsc.connect(chordGain);
        chordGain.connect(dest);
        chordOsc.start(now);
        chordOsc.stop(now + (isBeatStart ? 0.60 : 0.35));
      });
    }

    // 6. Warm Vibraphone Cues
    const vibraphonePitches: Record<number, number> = {
      2: 783.99,   // G5
      18: 1046.50, // C6
      42: 880.00,  // A5
      66: 1046.50, // C6
      98: 932.33,  // Bb5
      122: 783.99, // G5
      138: 830.61, // Ab5
      170: 1046.50,// C6
      202: 1244.51,// Eb6
      234: 932.33, // Bb5
      246: 783.99, // G5
    };

    const bellPitch = vibraphonePitches[step];
    if (bellPitch) {
      const bellOsc = this.ctx.createOscillator();
      const bellGain = this.ctx.createGain();
      bellGain.gain.setValueAtTime(0.12 * vol, now);
      bellGain.gain.exponentialRampToValueAtTime(0.0001, now + 0.36);

      bellOsc.type = 'sine';
      bellOsc.frequency.setValueAtTime(bellPitch, now);

      bellOsc.connect(bellGain);
      bellGain.connect(dest);
      bellOsc.start(now);
      bellOsc.stop(now + 0.38);
    }
  }

  // =========================================================================
  // --- TRACK 2: TIMBERLAND CRITTERS (COZY MOUNTAIN CABIN FOLK) ---
  // =========================================================================

  private playWoodlandMusicStep(step: number) {
    if (!this.ctx) return;
    const dest = this.getMusicDestination();
    if (!dest) return;

    const now = this.ctx.currentTime;
    const isOverdrive = this.isOverdriveMusic;
    const vol = this.musicVolume;
    const bar = Math.floor(step / 16);
    const stepInBar = step % 16;

    // 1. Organic Wooden Log Stomp Kick
    if (stepInBar === 0 || stepInBar === 8 || (isOverdrive && stepInBar % 4 === 0)) {
      const kickOsc = this.ctx.createOscillator();
      const kickGain = this.ctx.createGain();
      kickGain.gain.setValueAtTime(0.42 * vol, now);
      kickGain.gain.exponentialRampToValueAtTime(0.001, now + 0.16);

      kickOsc.type = 'triangle';
      kickOsc.frequency.setValueAtTime(75, now);
      kickOsc.frequency.exponentialRampToValueAtTime(28, now + 0.12);

      kickOsc.connect(kickGain);
      kickGain.connect(dest);
      kickOsc.start(now);
      kickOsc.stop(now + 0.18);
    }

    // 2. Hollow Cedar Woodblock Knock (Warm & woody, NO distortion)
    const isWoodblock =
      stepInBar === 4 ||
      stepInBar === 12 ||
      (bar === 15 && (stepInBar === 8 || stepInBar === 10 || stepInBar === 14));

    if (isWoodblock) {
      const blockOsc = this.ctx.createOscillator();
      const blockGain = this.ctx.createGain();
      blockGain.gain.setValueAtTime(0.35 * vol, now);
      blockGain.gain.exponentialRampToValueAtTime(0.001, now + 0.06);

      blockOsc.type = 'triangle';
      blockOsc.frequency.setValueAtTime(540 + (stepInBar % 3) * 40, now);
      blockOsc.frequency.exponentialRampToValueAtTime(260, now + 0.05);

      blockOsc.connect(blockGain);
      blockGain.connect(dest);
      blockOsc.start(now);
      blockOsc.stop(now + 0.07);
    }

    // 3. Gentle Dried Seed Pod Shaker: Ultra-soft pink noise (NO square waves!)
    if (step % 2 === 1 && this.softNoiseBuffer) {
      const isAccent = stepInBar === 4 || stepInBar === 12;
      const rustleGain = this.ctx.createGain();
      rustleGain.gain.setValueAtTime((isAccent ? 0.10 : 0.05) * vol, now);
      rustleGain.gain.exponentialRampToValueAtTime(0.001, now + 0.04);

      const noiseSource = this.ctx.createBufferSource();
      noiseSource.buffer = this.softNoiseBuffer;

      const filter = this.ctx.createBiquadFilter();
      filter.type = 'bandpass';
      filter.frequency.setValueAtTime(2200, now);
      filter.Q.setValueAtTime(1.8, now);

      noiseSource.connect(filter);
      filter.connect(rustleGain);
      rustleGain.connect(dest);
      noiseSource.start(now);
      noiseSource.stop(now + 0.05);
    }

    // 4. Plucked Acoustic Upright Bass (G Major Country Walk)
    const woodlandBass256 = [
      // Bars 0-1 (G): G2 -> D3 -> G2 -> B2
      98.00, 0, 98.00, 0, 146.83, 0, 146.83, 0, 98.00, 0, 123.47, 0, 146.83, 0, 123.47, 0,
      98.00, 0, 98.00, 0, 146.83, 0, 146.83, 0, 98.00, 0, 110.00, 0, 123.47, 0, 110.00, 0,
      // Bars 2-3 (C -> D7): C2 -> G2 -> D2 -> A2
      65.41, 0, 65.41, 0, 98.00, 0, 98.00, 0, 65.41, 0, 82.41, 0, 98.00, 0, 82.41, 0,
      73.42, 0, 73.42, 0, 110.00, 0, 110.00, 0, 73.42, 0, 92.50, 0, 110.00, 0, 92.50, 0,
      // Bars 4-5 (Em -> Bm): E2 -> B2 -> B1 -> F#2
      82.41, 0, 82.41, 0, 123.47, 0, 123.47, 0, 82.41, 0, 98.00, 0, 123.47, 0, 98.00, 0,
      61.74, 0, 61.74, 0, 92.50, 0, 92.50, 0, 61.74, 0, 73.42, 0, 92.50, 0, 73.42, 0,
      // Bars 6-7 (C -> D): C2 -> G2 -> D2 -> A2
      65.41, 0, 65.41, 0, 98.00, 0, 98.00, 0, 65.41, 0, 82.41, 0, 98.00, 0, 82.41, 0,
      73.42, 0, 73.42, 0, 110.00, 0, 110.00, 0, 73.42, 0, 98.00, 0, 110.00, 0, 123.47, 0,
      // Bars 8-9 (Am -> D): A1 -> E2 -> D2 -> A2
      55.00, 0, 55.00, 0, 82.41, 0, 82.41, 0, 55.00, 0, 65.41, 0, 82.41, 0, 65.41, 0,
      73.42, 0, 73.42, 0, 110.00, 0, 110.00, 0, 73.42, 0, 87.31, 0, 98.00, 0, 110.00, 0,
      // Bars 10-11 (G -> Em): G2 -> D3 -> E2 -> B2
      98.00, 0, 98.00, 0, 146.83, 0, 146.83, 0, 98.00, 0, 110.00, 0, 123.47, 0, 110.00, 0,
      82.41, 0, 82.41, 0, 123.47, 0, 123.47, 0, 82.41, 0, 73.42, 0, 65.41, 0, 61.74, 0,
      // Bars 12-13 (C -> G/B): C2 -> G2 -> B1 -> F#2
      65.41, 0, 65.41, 0, 98.00, 0, 98.00, 0, 65.41, 0, 82.41, 0, 98.00, 0, 82.41, 0,
      61.74, 0, 61.74, 0, 92.50, 0, 92.50, 0, 61.74, 0, 73.42, 0, 92.50, 0, 73.42, 0,
      // Bars 14-15 (Am7 -> D7 Turnaround -> G): A1 -> C2 -> D2 -> F#2 -> G2
      55.00, 0, 65.41, 0, 82.41, 0, 65.41, 0, 73.42, 0, 92.50, 0, 110.00, 0, 123.47, 0,
      73.42, 0, 82.41, 0, 92.50, 0, 110.00, 0, 146.83, 123.47, 110.00, 98.00, 82.41, 73.42, 65.41, 0
    ];

    const bassPitch = woodlandBass256[step];
    if (bassPitch > 0) {
      const bassOsc = this.ctx.createOscillator();
      const bassGain = this.ctx.createGain();
      bassGain.gain.setValueAtTime(0.35 * vol, now);
      bassGain.gain.exponentialRampToValueAtTime(0.001, now + 0.22);

      bassOsc.type = 'triangle';
      bassOsc.frequency.setValueAtTime(bassPitch, now);

      const bassFilter = this.ctx.createBiquadFilter();
      bassFilter.type = 'lowpass';
      bassFilter.frequency.setValueAtTime(260, now);
      bassFilter.frequency.exponentialRampToValueAtTime(95, now + 0.18);

      bassOsc.connect(bassFilter);
      bassFilter.connect(bassGain);
      bassGain.connect(dest);
      bassOsc.start(now);
      bassOsc.stop(now + 0.24);
    }

    // 5. Plucked Folk Acoustic Nylon Guitar Arpeggios
    const banjoChordsByBar = [
      [392.00, 493.88, 587.33], // Bar 0: G
      [392.00, 493.88, 587.33], // Bar 1: G6
      [523.25, 659.25, 783.99], // Bar 2: C
      [587.33, 739.99, 880.00], // Bar 3: D7
      [659.25, 783.99, 987.77], // Bar 4: Em
      [493.88, 587.33, 739.99], // Bar 5: Bm
      [523.25, 659.25, 783.99], // Bar 6: C
      [587.33, 739.99, 880.00], // Bar 7: D
      [440.00, 523.25, 659.25], // Bar 8: Am
      [587.33, 739.99, 880.00], // Bar 9: D7
      [392.00, 493.88, 587.33], // Bar 10: G
      [659.25, 783.99, 987.77], // Bar 11: Em
      [523.25, 659.25, 783.99], // Bar 12: C
      [493.88, 587.33, 783.99], // Bar 13: G/B
      [440.00, 523.25, 659.25], // Bar 14: Am7
      [587.33, 739.99, 880.00], // Bar 15: D7 Turnaround
    ];

    const currentBarPitches = banjoChordsByBar[bar] || banjoChordsByBar[0];
    const rollPattern = [0, 1, 2, 1, 0, 2, 1, 2, 0, 1, 2, 1, 0, 2, 1, 0];
    const noteIdx = rollPattern[stepInBar];
    const banjoPitch = currentBarPitches[noteIdx % currentBarPitches.length];

    if (banjoPitch && step % 2 === 0) {
      const guitarOsc = this.ctx.createOscillator();
      const guitarGain = this.ctx.createGain();
      guitarGain.gain.setValueAtTime(0.12 * vol, now);
      guitarGain.gain.exponentialRampToValueAtTime(0.0001, now + 0.16);

      guitarOsc.type = 'sine';
      guitarOsc.frequency.setValueAtTime(banjoPitch, now);

      guitarOsc.connect(guitarGain);
      guitarGain.connect(dest);
      guitarOsc.start(now);
      guitarOsc.stop(now + 0.18);
    }

    // 6. Whimsical Forest Cedar Wood Flute Melody (Warm, lyrical, soothing)
    const fluteMelody: Record<number, number> = {
      64: 783.99,   // G5
      72: 987.77,   // B5
      80: 1174.66,  // D6
      96: 1046.50,  // C6
      104: 987.77,  // B5
      112: 880.00,  // A5
      128: 880.00,  // A5
      136: 1046.50, // C6
      144: 1174.66, // D6
      160: 987.77,  // B5
      168: 880.00,  // A5
      176: 783.99,  // G5
      192: 659.25,  // E5
      200: 783.99,  // G5
    };

    const flutePitch = fluteMelody[step];
    if (flutePitch) {
      const fluteOsc = this.ctx.createOscillator();
      const fluteGain = this.ctx.createGain();
      fluteGain.gain.setValueAtTime(0.16 * vol, now);
      fluteGain.gain.exponentialRampToValueAtTime(0.001, now + 0.50);

      fluteOsc.type = 'sine';
      fluteOsc.frequency.setValueAtTime(flutePitch, now);
      fluteOsc.frequency.exponentialRampToValueAtTime(flutePitch * 1.015, now + 0.22);
      fluteOsc.frequency.exponentialRampToValueAtTime(flutePitch, now + 0.45);

      fluteOsc.connect(fluteGain);
      fluteGain.connect(dest);
      fluteOsc.start(now);
      fluteOsc.stop(now + 0.52);
    }
  }

  // =========================================================================
  // --- TRACK 3: PIXEL ARCADE (1989 JAPANESE ARCADE CHILLWAVE SYNTH) ---
  // =========================================================================

  private playPixelMusicStep(step: number) {
    if (!this.ctx) return;
    const dest = this.getMusicDestination();
    if (!dest) return;

    const now = this.ctx.currentTime;
    const isOverdrive = this.isOverdriveMusic;
    const vol = this.musicVolume;
    const bar = Math.floor(step / 16);
    const stepInBar = step % 16;

    // 1. Analog Arcade Kick: Tight 80s punch
    const isKick =
      stepInBar === 0 ||
      stepInBar === 8 ||
      (isOverdrive && (stepInBar === 4 || stepInBar === 12)) ||
      (bar === 15 && (stepInBar === 10 || stepInBar === 12));

    if (isKick) {
      const kickOsc = this.ctx.createOscillator();
      const kickGain = this.ctx.createGain();
      kickGain.gain.setValueAtTime(0.50 * vol, now);
      kickGain.gain.exponentialRampToValueAtTime(0.001, now + 0.15);

      kickOsc.type = 'sine';
      kickOsc.frequency.setValueAtTime(125, now);
      kickOsc.frequency.exponentialRampToValueAtTime(42, now + 0.10);

      kickOsc.connect(kickGain);
      kickGain.connect(dest);
      kickOsc.start(now);
      kickOsc.stop(now + 0.17);
    }

    // 2. 80s Gated Snare & Electronic Clap
    const isSnare = stepInBar === 4 || stepInBar === 12;
    if (isSnare && this.softNoiseBuffer) {
      const noiseSource = this.ctx.createBufferSource();
      noiseSource.buffer = this.softNoiseBuffer;

      const filter = this.ctx.createBiquadFilter();
      filter.type = 'bandpass';
      filter.frequency.setValueAtTime(1300, now);
      filter.Q.setValueAtTime(1.8, now);

      const noiseGain = this.ctx.createGain();
      noiseGain.gain.setValueAtTime(0.30 * vol, now);
      noiseGain.gain.exponentialRampToValueAtTime(0.001, now + 0.10);

      noiseSource.connect(filter);
      filter.connect(noiseGain);
      noiseGain.connect(dest);
      noiseSource.start(now);
      noiseSource.stop(now + 0.11);
    }

    // 3. Crisp Electronic Hi-Hat: 16th note pattern
    if (step % 2 === 0 && this.softNoiseBuffer) {
      const isAccent = stepInBar === 2 || stepInBar === 6 || stepInBar === 10 || stepInBar === 14;
      const hatGain = this.ctx.createGain();
      hatGain.gain.setValueAtTime((isAccent ? 0.16 : 0.08) * vol, now);
      hatGain.gain.exponentialRampToValueAtTime(0.001, now + 0.035);

      const noiseSource = this.ctx.createBufferSource();
      noiseSource.buffer = this.softNoiseBuffer;

      const filter = this.ctx.createBiquadFilter();
      filter.type = 'bandpass';
      filter.frequency.setValueAtTime(2800, now);
      filter.Q.setValueAtTime(2.5, now);

      noiseSource.connect(filter);
      filter.connect(hatGain);
      hatGain.connect(dest);
      noiseSource.start(now);
      noiseSource.stop(now + 0.05);
    }

    // 4. Juno / Outrun Synth Bass Pluck (Dm7 -> Bbmaj7 -> C9 -> Am7)
    const arcadeBass256 = [
      // Dm7: D2 (73.42) - F2 (87.31) - A2 (110.00)
      73.42, 0, 73.42, 0, 87.31, 0, 110.00, 0, 73.42, 0, 73.42, 0, 87.31, 0, 110.00, 0,
      73.42, 0, 73.42, 0, 87.31, 0, 110.00, 0, 73.42, 0, 87.31, 0, 98.00, 0, 110.00, 0,
      // Bbmaj7: Bb1 (58.27) - D2 (73.42) - F2 (87.31)
      58.27, 0, 58.27, 0, 73.42, 0, 87.31, 0, 58.27, 0, 58.27, 0, 73.42, 0, 87.31, 0,
      58.27, 0, 58.27, 0, 73.42, 0, 87.31, 0, 58.27, 0, 65.41, 0, 73.42, 0, 87.31, 0,
      // C9: C2 (65.41) - E2 (82.41) - G2 (98.00)
      65.41, 0, 65.41, 0, 82.41, 0, 98.00, 0, 65.41, 0, 65.41, 0, 82.41, 0, 98.00, 0,
      65.41, 0, 65.41, 0, 82.41, 0, 98.00, 0, 65.41, 0, 73.42, 0, 82.41, 0, 98.00, 0,
      // Am7: A1 (55.00) - C2 (65.41) - E2 (82.41)
      55.00, 0, 55.00, 0, 65.41, 0, 82.41, 0, 55.00, 0, 55.00, 0, 65.41, 0, 82.41, 0,
      55.00, 0, 55.00, 0, 65.41, 0, 82.41, 0, 55.00, 0, 61.74, 0, 65.41, 0, 73.42, 0,
      // Repeat loop with lift
      73.42, 0, 73.42, 0, 87.31, 0, 110.00, 0, 73.42, 0, 73.42, 0, 87.31, 0, 110.00, 0,
      73.42, 0, 73.42, 0, 87.31, 0, 110.00, 0, 73.42, 0, 87.31, 0, 98.00, 0, 110.00, 0,
      58.27, 0, 58.27, 0, 73.42, 0, 87.31, 0, 58.27, 0, 58.27, 0, 73.42, 0, 87.31, 0,
      58.27, 0, 58.27, 0, 73.42, 0, 87.31, 0, 58.27, 0, 65.41, 0, 73.42, 0, 87.31, 0,
      65.41, 0, 65.41, 0, 82.41, 0, 98.00, 0, 65.41, 0, 65.41, 0, 82.41, 0, 98.00, 0,
      65.41, 0, 65.41, 0, 82.41, 0, 98.00, 0, 65.41, 0, 73.42, 0, 82.41, 0, 98.00, 0,
      55.00, 0, 55.00, 0, 65.41, 0, 82.41, 0, 55.00, 0, 55.00, 0, 65.41, 0, 82.41, 0,
      55.00, 0, 65.41, 0, 73.42, 0, 82.41, 0, 87.31, 0, 98.00, 0, 110.00, 0, 123.47, 0
    ];

    const bassFreq = arcadeBass256[step];
    if (bassFreq > 0) {
      const bassOsc = this.ctx.createOscillator();
      const bassGain = this.ctx.createGain();
      bassGain.gain.setValueAtTime(0.34 * vol, now);
      bassGain.gain.exponentialRampToValueAtTime(0.001, now + 0.18);

      bassOsc.type = 'triangle';
      bassOsc.frequency.setValueAtTime(bassFreq, now);

      const filter = this.ctx.createBiquadFilter();
      filter.type = 'lowpass';
      filter.frequency.setValueAtTime(450, now);
      filter.frequency.exponentialRampToValueAtTime(140, now + 0.16);

      bassOsc.connect(filter);
      filter.connect(bassGain);
      bassGain.connect(dest);
      bassOsc.start(now);
      bassOsc.stop(now + 0.20);
    }

    // 5. Analog Synth Poly-Pad Chords: Warm, filtered, ambient
    if (stepInBar === 0 || stepInBar === 8) {
      let padPitches: number[] = [];
      const chordBar = bar % 4;
      if (chordBar === 0) padPitches = [293.66, 349.23, 440.00, 523.25]; // Dm7
      else if (chordBar === 1) padPitches = [233.08, 293.66, 349.23, 440.00]; // Bbmaj7
      else if (chordBar === 2) padPitches = [261.63, 329.63, 392.00, 523.25]; // C9
      else padPitches = [220.00, 261.63, 329.63, 440.00]; // Am7

      padPitches.forEach((pitch) => {
        if (!this.ctx) return;
        const padOsc = this.ctx.createOscillator();
        const padGain = this.ctx.createGain();
        padGain.gain.setValueAtTime(0.08 * vol, now);
        padGain.gain.exponentialRampToValueAtTime(0.0001, now + 0.45);

        padOsc.type = 'triangle';
        padOsc.frequency.setValueAtTime(pitch, now);

        padOsc.connect(padGain);
        padGain.connect(dest);
        padOsc.start(now);
        padOsc.stop(now + 0.48);
      });
    }

    // 6. FM Synth Lead: 8-bit arcade hero melody (Bars 8-15)
    if (bar >= 8) {
      const arcadeLeadPitches: Record<number, number> = {
        128: 587.33, // D5
        132: 659.25, // E5
        136: 698.46, // F5
        144: 880.00, // A5
        152: 783.99, // G5
        160: 698.46, // F5
        168: 587.33, // D5
        176: 523.25, // C5
        184: 659.25, // E5
        192: 587.33, // D5
        208: 880.00, // A5
        216: 1046.50,// C6
        224: 880.00, // A5
        232: 783.99, // G5
        240: 698.46, // F5
        248: 587.33, // D5
      };

      const leadPitch = arcadeLeadPitches[step];
      if (leadPitch) {
        const leadOsc = this.ctx.createOscillator();
        const leadGain = this.ctx.createGain();
        leadGain.gain.setValueAtTime(0.14 * vol, now);
        leadGain.gain.exponentialRampToValueAtTime(0.001, now + 0.32);

        leadOsc.type = 'sine';
        leadOsc.frequency.setValueAtTime(leadPitch, now);

        leadOsc.connect(leadGain);
        leadGain.connect(dest);
        leadOsc.start(now);
        leadOsc.stop(now + 0.35);
      }
    }
  }

  // Quick sound test preview trigger
  public testAudio() {
    this.unlockAudio();
    this.playCashRegister();
    setTimeout(() => this.playGoldBarClank(), 160);
    setTimeout(() => this.playCoinTally(), 320);
  }

  // =========================================================================
  // --- AUTHENTIC GOLD, CASH & VEGAS SOUND FX SUITE ---
  // =========================================================================

  // Heavy motorized Bank Vault Door Slide
  public playVaultSlide() {
    this.initContext();
    if (!this.ctx || this.isMuted) return;

    const now = this.ctx.currentTime;
    const osc = this.ctx.createOscillator();
    const gain = this.createGainNode(0.5, 0.45, 0.01);
    if (!gain) return;

    osc.type = 'triangle';
    osc.frequency.setValueAtTime(95, now);
    osc.frequency.exponentialRampToValueAtTime(45, now + 0.45);

    // Filtered pneumatic air hiss
    const noiseBuffer = this.ctx.createBuffer(1, this.ctx.sampleRate * 0.4, this.ctx.sampleRate);
    const output = noiseBuffer.getChannelData(0);
    for (let i = 0; i < noiseBuffer.length; i++) {
      output[i] = Math.random() * 2 - 1;
    }
    const whiteNoise = this.ctx.createBufferSource();
    whiteNoise.buffer = noiseBuffer;
    const filter = this.ctx.createBiquadFilter();
    filter.type = 'bandpass';
    filter.frequency.setValueAtTime(800, now);
    filter.frequency.exponentialRampToValueAtTime(300, now + 0.35);

    const noiseGain = this.ctx.createGain();
    noiseGain.gain.setValueAtTime(0.25 * this.sfxVolume, now);
    noiseGain.gain.exponentialRampToValueAtTime(0.001, now + 0.4);

    whiteNoise.connect(filter);
    filter.connect(noiseGain);
    noiseGain.connect(this.ctx.destination);

    osc.connect(gain);
    osc.start(now);
    whiteNoise.start(now);
    osc.stop(now + 0.5);
    whiteNoise.stop(now + 0.4);
  }

  // Heavy Bank Vault Steel Deadbolt Lock
  public playVaultLock() {
    this.initContext();
    if (!this.ctx || this.isMuted) return;

    const now = this.ctx.currentTime;
    // Massive metallic thud
    const osc = this.ctx.createOscillator();
    const gain = this.createGainNode(0.35, 0.7, 0.001);
    if (!gain) return;

    osc.type = 'sine';
    osc.frequency.setValueAtTime(140, now);
    osc.frequency.exponentialRampToValueAtTime(25, now + 0.3);

    // Mechanical gear click
    const clickOsc = this.ctx.createOscillator();
    const clickGain = this.ctx.createGain();
    clickGain.gain.setValueAtTime(0.4 * this.sfxVolume, now);
    clickGain.gain.exponentialRampToValueAtTime(0.001, now + 0.08);
    clickOsc.type = 'square';
    clickOsc.frequency.setValueAtTime(850, now);
    clickOsc.frequency.exponentialRampToValueAtTime(200, now + 0.07);

    clickOsc.connect(clickGain);
    clickGain.connect(this.ctx.destination);
    clickOsc.start(now);
    clickOsc.stop(now + 0.08);

    osc.connect(gain);
    osc.start(now);
    osc.stop(now + 0.35);
  }

  // =========================================================================
  // --- TRACK 4: PLAYSTATION 2 EMOTION ENGINE (DEEP BIOS OCEAN VOID AMBIENCE) ---
  // =========================================================================

  private playPs2MusicStep(step: number) {
    if (!this.ctx) return;
    const dest = this.getMusicDestination();
    if (!dest) return;

    const now = this.ctx.currentTime;
    const isOverdrive = this.isOverdriveMusic;
    const vol = this.musicVolume;
    const bar = Math.floor(step / 16);
    const stepInBar = step % 16;

    // 1. Sub-bass pulse (Deep 48Hz / 55Hz ocean floor heartbeat)
    const isSub = stepInBar === 0 || stepInBar === 8 || (isOverdrive && (stepInBar === 4 || stepInBar === 12));
    if (isSub) {
      const subOsc = this.ctx.createOscillator();
      const subGain = this.ctx.createGain();
      subGain.gain.setValueAtTime(0.55 * vol, now);
      subGain.gain.exponentialRampToValueAtTime(0.001, now + (isOverdrive ? 0.22 : 0.35));
      subOsc.type = 'sine';
      const rootFreq = bar % 4 === 3 ? 55.0 : bar % 2 === 1 ? 43.65 : 48.99; // G1, F1, D1
      subOsc.frequency.setValueAtTime(rootFreq, now);
      subOsc.frequency.exponentialRampToValueAtTime(rootFreq * 0.85, now + 0.2);
      subOsc.connect(subGain);
      subGain.connect(dest);
      subOsc.start(now);
      subOsc.stop(now + 0.38);
    }

    // 2. Optical laser seek step (percussive digital actuator tick)
    const isSeekTick = stepInBar === 2 || stepInBar === 6 || stepInBar === 10 || stepInBar === 14;
    if (isSeekTick) {
      const seekOsc = this.ctx.createOscillator();
      const seekGain = this.ctx.createGain();
      seekGain.gain.setValueAtTime(0.18 * vol, now);
      seekGain.gain.exponentialRampToValueAtTime(0.001, now + 0.03);
      seekOsc.type = 'triangle';
      seekOsc.frequency.setValueAtTime(1400 + (stepInBar * 80), now);
      seekOsc.frequency.exponentialRampToValueAtTime(600, now + 0.025);
      seekOsc.connect(seekGain);
      seekGain.connect(dest);
      seekOsc.start(now);
      seekOsc.stop(now + 0.035);
    }

    // 3. Ambient Crystalline Monolith Chords (every bar start)
    if (stepInBar === 0) {
      const chordRoots = [
        [293.66, 369.99, 440.0, 554.37], // Dmaj9
        [246.94, 329.63, 392.0, 493.88], // Em7
        [220.0, 277.18, 329.63, 440.0],  // A7sus4
        [293.66, 440.0, 587.33, 739.99], // D high crystal
      ];
      const chord = chordRoots[bar % 4];
      chord.forEach((freq, idx) => {
        if (!this.ctx) return;
        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();
        const duration = isOverdrive ? 1.4 : 2.2;
        gain.gain.setValueAtTime(0.09 * vol, now + idx * 0.03);
        gain.gain.exponentialRampToValueAtTime(0.001, now + duration);
        osc.type = 'sine';
        osc.frequency.setValueAtTime(freq, now);
        osc.connect(gain);
        gain.connect(dest);
        osc.start(now + idx * 0.03);
        osc.stop(now + duration + 0.1);
      });
    }

    // 4. Overdrive 128-bit Arpeggios when Fever mode is active
    if (isOverdrive && (stepInBar % 2 === 0)) {
      const arpNotes = [440.0, 554.37, 659.25, 880.0, 987.77, 1174.66, 1318.51, 1760.0];
      const note = arpNotes[(step + bar) % arpNotes.length];
      const arpOsc = this.ctx.createOscillator();
      const arpGain = this.ctx.createGain();
      arpGain.gain.setValueAtTime(0.12 * vol, now);
      arpGain.gain.exponentialRampToValueAtTime(0.001, now + 0.08);
      arpOsc.type = 'triangle';
      arpOsc.frequency.setValueAtTime(note, now);
      arpOsc.connect(arpGain);
      arpGain.connect(dest);
      arpOsc.start(now);
      arpOsc.stop(now + 0.09);
    }
  }

  // Rapid High-Speed Currency Counter Machine ("brrrrrr-ch-ch-ch-ch")
  public playCashCounter(count: number = 10) {
    this.initContext();
    if (!this.ctx || this.isMuted) return;

    for (let i = 0; i < Math.min(20, count); i++) {
      const delay = i * 0.038;
      const startTime = this.ctx.currentTime + delay;
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();

      gain.gain.setValueAtTime(0.2 * this.sfxVolume, startTime);
      gain.gain.exponentialRampToValueAtTime(0.001, startTime + 0.045);

      osc.type = 'triangle';
      osc.frequency.setValueAtTime(1100 + (i % 3) * 150, startTime);
      osc.frequency.exponentialRampToValueAtTime(450, startTime + 0.04);

      osc.connect(gain);
      gain.connect(this.ctx.destination);
      osc.start(startTime);
      osc.stop(startTime + 0.045);
    }
  }

  // Heavy 999.9 Gold Bullion Bars Clanking
  public playGoldBarClank() {
    this.initContext();
    if (!this.ctx || this.isMuted) return;

    const now = this.ctx.currentTime;
    [1650, 2450, 3200].forEach((freq, idx) => {
      if (!this.ctx) return;
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      const delay = idx * 0.025;
      const startTime = now + delay;

      gain.gain.setValueAtTime(0.28 * this.sfxVolume, startTime);
      gain.gain.exponentialRampToValueAtTime(0.001, startTime + 0.28);

      osc.type = 'sine';
      osc.frequency.setValueAtTime(freq, startTime);
      osc.connect(gain);
      gain.connect(this.ctx.destination);
      osc.start(startTime);
      osc.stop(startTime + 0.3);
    });
  }

  // Cash Register Drawer Bell ("Ding! Cha-Ching!")
  public playCashRegister() {
    this.initContext();
    if (!this.ctx || this.isMuted) return;

    const now = this.ctx.currentTime;
    // 1. Drawer open mechanical spring
    const springOsc = this.ctx.createOscillator();
    const springGain = this.ctx.createGain();
    springGain.gain.setValueAtTime(0.3 * this.sfxVolume, now);
    springGain.gain.exponentialRampToValueAtTime(0.001, now + 0.08);
    springOsc.type = 'square';
    springOsc.frequency.setValueAtTime(220, now);
    springOsc.frequency.exponentialRampToValueAtTime(80, now + 0.07);
    springOsc.connect(springGain);
    springGain.connect(this.ctx.destination);
    springOsc.start(now);
    springOsc.stop(now + 0.08);

    // 2. Clear bell chime ("Ding!")
    const bellTime = now + 0.07;
    const bellOsc = this.ctx.createOscillator();
    const bellGain = this.ctx.createGain();
    bellGain.gain.setValueAtTime(0.45 * this.sfxVolume, bellTime);
    bellGain.gain.exponentialRampToValueAtTime(0.001, bellTime + 0.6);
    bellOsc.type = 'sine';
    bellOsc.frequency.setValueAtTime(2093, bellTime); // High C7
    bellOsc.connect(bellGain);
    bellGain.connect(this.ctx.destination);
    bellOsc.start(bellTime);
    bellOsc.stop(bellTime + 0.6);
  }

  // 100% Bespoke Tactile Button Click Per Game
  public playButtonClick() {
    this.initContext();
    if (!this.ctx || this.isMuted) return;
    const now = this.ctx.currentTime;

    if (this.activeGameTheme === 'pixel-arcade') {
      // 1989 Japanese Arcade Sanwa Push-Button Switch: crisp 8-bit chip blip
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      gain.gain.setValueAtTime(0.22 * this.sfxVolume, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.045);
      osc.type = 'square';
      osc.frequency.setValueAtTime(987.77, now);
      osc.frequency.setValueAtTime(1318.51, now + 0.02);
      osc.connect(gain);
      gain.connect(this.ctx.destination);
      osc.start(now);
      osc.stop(now + 0.048);
      return;
    }

    if (this.activeGameTheme === 'timber-critters') {
      // Hollow Cedar Woodblock Tap: resonant organic acoustic knock
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      gain.gain.setValueAtTime(0.35 * this.sfxVolume, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.05);
      osc.type = 'triangle';
      osc.frequency.setValueAtTime(680, now);
      osc.frequency.exponentialRampToValueAtTime(320, now + 0.045);
      osc.connect(gain);
      gain.connect(this.ctx.destination);
      osc.start(now);
      osc.stop(now + 0.055);
      return;
    }

    if (this.activeGameTheme === 'ps2-legends') {
      this.playPs2Button();
      return;
    }

    // 24K Gold Vault: Heavy Brass Lock Tumbler Click
    const osc = this.ctx.createOscillator();
    const gain = this.createGainNode(0.06, 0.32, 0.01);
    if (!gain) return;
    osc.type = 'triangle';
    osc.frequency.setValueAtTime(540, now);
    osc.frequency.exponentialRampToValueAtTime(1100, now + 0.05);
    osc.connect(gain);
    osc.start(now);
    osc.stop(now + 0.06);
  }

  // Low error / invalid action buzzer: Bespoke Per Game
  public playError() {
    this.initContext();
    if (!this.ctx || this.isMuted) return;
    const now = this.ctx.currentTime;

    if (this.activeGameTheme === 'pixel-arcade') {
      // 8-Bit Arcade Miss Buzz
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      gain.gain.setValueAtTime(0.25 * this.sfxVolume, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.18);
      osc.type = 'sawtooth';
      osc.frequency.setValueAtTime(95, now);
      osc.frequency.linearRampToValueAtTime(65, now + 0.16);
      osc.connect(gain);
      gain.connect(this.ctx.destination);
      osc.start(now);
      osc.stop(now + 0.18);
      return;
    }

    if (this.activeGameTheme === 'timber-critters') {
      // Hollow fallen cedar log dull thud
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      gain.gain.setValueAtTime(0.30 * this.sfxVolume, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.15);
      osc.type = 'triangle';
      osc.frequency.setValueAtTime(110, now);
      osc.frequency.exponentialRampToValueAtTime(45, now + 0.14);
      osc.connect(gain);
      gain.connect(this.ctx.destination);
      osc.start(now);
      osc.stop(now + 0.15);
      return;
    }

    if (this.activeGameTheme === 'ps2-legends') {
      // PS2 Red screen of death invalid disc tone
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      gain.gain.setValueAtTime(0.28 * this.sfxVolume, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.22);
      osc.type = 'sawtooth';
      osc.frequency.setValueAtTime(82.4, now);
      osc.frequency.linearRampToValueAtTime(55, now + 0.2);
      osc.connect(gain);
      gain.connect(this.ctx.destination);
      osc.start(now);
      osc.stop(now + 0.22);
      return;
    }

    // 24K Vault Biometric Security Reject Buzzer
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();
    gain.gain.setValueAtTime(0.28 * this.sfxVolume, now);
    gain.gain.exponentialRampToValueAtTime(0.001, now + 0.16);
    osc.type = 'sawtooth';
    osc.frequency.setValueAtTime(130, now);
    osc.frequency.linearRampToValueAtTime(80, now + 0.14);
    osc.connect(gain);
    gain.connect(this.ctx.destination);
    osc.start(now);
    osc.stop(now + 0.16);
  }

  // --- Continuous Stimulating Deluxe VLT Reel Spin Audio Loop ---
  private spinRollTimerId: number | null = null;
  private spinRollStep: number = 0;
  private isSpinRolling: boolean = false;
  private isAnticipationRolling: boolean = false;

  // Spin start: Bespoke Per Game
  public playSpinStart() {
    this.initContext();
    if (!this.ctx || this.isMuted) return;

    if (this.activeGameTheme === 'pixel-arcade') {
      this.playArcadeCoinDrop();
      return;
    }

    if (this.activeGameTheme === 'timber-critters') {
      this.playTwigSnap();
      return;
    }

    if (this.activeGameTheme === 'ps2-legends') {
      this.playPs2Spin();
      return;
    }

    const now = this.ctx.currentTime;

    // 1. Rising pneumatic air swoosh
    const osc = this.ctx.createOscillator();
    const gain = this.createGainNode(0.22, 0.5, 0.01);
    if (!gain) return;

    osc.type = 'sine';
    osc.frequency.setValueAtTime(140, now);
    osc.frequency.exponentialRampToValueAtTime(520, now + 0.2);

    osc.connect(gain);
    osc.start(now);
    osc.stop(now + 0.22);

    // 2. Punchy lever release clack
    const clack = this.ctx.createOscillator();
    const clackGain = this.ctx.createGain();
    clackGain.gain.setValueAtTime(0.45 * this.sfxVolume, now);
    clackGain.gain.exponentialRampToValueAtTime(0.001, now + 0.08);

    clack.type = 'triangle';
    clack.frequency.setValueAtTime(280, now);
    clack.frequency.exponentialRampToValueAtTime(60, now + 0.07);

    clack.connect(clackGain);
    clackGain.connect(this.ctx.destination);
    clack.start(now);
    clack.stop(now + 0.09);
  }

  // 1989 Coin-Op Insert Coin Clink & Stage Start Chime for Pixel Arcade
  public playArcadeCoinDrop() {
    this.initContext();
    if (!this.ctx || this.isMuted) return;
    const now = this.ctx.currentTime;

    // First coin click through arcade slot
    const osc1 = this.ctx.createOscillator();
    const gain1 = this.ctx.createGain();
    gain1.gain.setValueAtTime(0.35 * this.sfxVolume, now);
    gain1.gain.exponentialRampToValueAtTime(0.001, now + 0.05);
    osc1.type = 'sine';
    osc1.frequency.setValueAtTime(2800, now);
    osc1.connect(gain1);
    gain1.connect(this.ctx.destination);
    osc1.start(now);
    osc1.stop(now + 0.055);

    // Second coin drop landing inside metal hopper
    const osc2 = this.ctx.createOscillator();
    const gain2 = this.ctx.createGain();
    gain2.gain.setValueAtTime(0.32 * this.sfxVolume, now + 0.04);
    gain2.gain.exponentialRampToValueAtTime(0.001, now + 0.09);
    osc2.type = 'sine';
    osc2.frequency.setValueAtTime(3400, now + 0.04);
    osc2.connect(gain2);
    gain2.connect(this.ctx.destination);
    osc2.start(now + 0.04);
    osc2.stop(now + 0.095);

    // Snappy 8-bit game start blip sequence
    const arpeggio = [523.25, 659.25, 783.99, 1046.5];
    arpeggio.forEach((pitch, i) => {
      if (!this.ctx) return;
      const t = now + 0.08 + i * 0.035;
      const osc = this.ctx.createOscillator();
      const g = this.ctx.createGain();
      g.gain.setValueAtTime(0.24 * this.sfxVolume, t);
      g.gain.exponentialRampToValueAtTime(0.001, t + 0.05);
      osc.type = 'square';
      osc.frequency.setValueAtTime(pitch, t);
      osc.connect(g);
      g.connect(this.ctx.destination);
      osc.start(t);
      osc.stop(t + 0.055);
    });
  }

  // Crisp woodland twig snap + branch whip for Timberland spin start
  public playTwigSnap() {
    this.initContext();
    if (!this.ctx || this.isMuted) return;
    const now = this.ctx.currentTime;

    // 1. Crisp twig crack (high-passed noise snap)
    const bufferSize = Math.floor(this.ctx.sampleRate * 0.05);
    const buffer = this.ctx.createBuffer(1, bufferSize, this.ctx.sampleRate);
    const output = buffer.getChannelData(0);
    for (let i = 0; i < bufferSize; i++) {
      output[i] = (Math.random() * 2 - 1) * Math.exp(-i / 80);
    }
    const snapSrc = this.ctx.createBufferSource();
    snapSrc.buffer = buffer;

    const snapFilter = this.ctx.createBiquadFilter();
    snapFilter.type = 'highpass';
    snapFilter.frequency.setValueAtTime(2400, now);

    const snapGain = this.ctx.createGain();
    snapGain.gain.setValueAtTime(0.55 * this.sfxVolume, now);
    snapGain.gain.exponentialRampToValueAtTime(0.001, now + 0.045);

    snapSrc.connect(snapFilter);
    snapFilter.connect(snapGain);
    snapGain.connect(this.ctx.destination);
    snapSrc.start(now);

    // 2. Hollow birch branch whip
    const whipOsc = this.ctx.createOscillator();
    const whipGain = this.ctx.createGain();
    whipGain.gain.setValueAtTime(0.4 * this.sfxVolume, now);
    whipGain.gain.exponentialRampToValueAtTime(0.001, now + 0.12);
    whipOsc.type = 'triangle';
    whipOsc.frequency.setValueAtTime(580, now);
    whipOsc.frequency.exponentialRampToValueAtTime(140, now + 0.11);
    whipOsc.connect(whipGain);
    whipGain.connect(this.ctx.destination);
    whipOsc.start(now);
    whipOsc.stop(now + 0.13);

    // 3. Playful forest bird chirp
    const chirpTime = now + 0.06;
    const chirpOsc = this.ctx.createOscillator();
    const chirpGain = this.ctx.createGain();
    chirpGain.gain.setValueAtTime(0.25 * this.sfxVolume, chirpTime);
    chirpGain.gain.exponentialRampToValueAtTime(0.001, chirpTime + 0.09);
    chirpOsc.type = 'sine';
    chirpOsc.frequency.setValueAtTime(1800, chirpTime);
    chirpOsc.frequency.exponentialRampToValueAtTime(2600, chirpTime + 0.08);
    chirpOsc.connect(chirpGain);
    chirpGain.connect(this.ctx.destination);
    chirpOsc.start(chirpTime);
    chirpOsc.stop(chirpTime + 0.09);
  }

  // Pneumatic hydraulic high-pressure steam vent release for 24K Vault
  public playSteamHiss() {
    this.initContext();
    if (!this.ctx || this.isMuted) return;
    const now = this.ctx.currentTime;
    const duration = 0.38;
    const bufferSize = Math.floor(this.ctx.sampleRate * duration);
    const buffer = this.ctx.createBuffer(1, bufferSize, this.ctx.sampleRate);
    const output = buffer.getChannelData(0);
    for (let i = 0; i < bufferSize; i++) {
      output[i] = (Math.random() * 2 - 1) * Math.exp(-i / (this.ctx.sampleRate * 0.12));
    }
    const noiseSrc = this.ctx.createBufferSource();
    noiseSrc.buffer = buffer;

    const filter = this.ctx.createBiquadFilter();
    filter.type = 'bandpass';
    filter.frequency.setValueAtTime(3200, now);
    filter.frequency.exponentialRampToValueAtTime(1100, now + duration);
    filter.Q.setValueAtTime(3.0, now);

    const gain = this.ctx.createGain();
    gain.gain.setValueAtTime(0.4 * this.sfxVolume, now);
    gain.gain.exponentialRampToValueAtTime(0.001, now + duration);

    noiseSrc.connect(filter);
    filter.connect(gain);
    gain.connect(this.ctx.destination);
    noiseSrc.start(now);
  }

  // Rustling pine needles and cedar twigs falling for Timberland
  public playPineNeedleRustle() {
    this.initContext();
    if (!this.ctx || this.isMuted) return;
    const now = this.ctx.currentTime;
    const duration = 0.45;
    const bufferSize = Math.floor(this.ctx.sampleRate * duration);
    const buffer = this.ctx.createBuffer(1, bufferSize, this.ctx.sampleRate);
    const output = buffer.getChannelData(0);
    for (let i = 0; i < bufferSize; i++) {
      output[i] = (Math.random() * 2 - 1) * Math.sin((i / bufferSize) * Math.PI) * Math.exp(-i / (this.ctx.sampleRate * 0.2));
    }
    const noiseSrc = this.ctx.createBufferSource();
    noiseSrc.buffer = buffer;

    const filter = this.ctx.createBiquadFilter();
    filter.type = 'highpass';
    filter.frequency.setValueAtTime(1800, now);

    const gain = this.ctx.createGain();
    gain.gain.setValueAtTime(0.3 * this.sfxVolume, now);
    gain.gain.exponentialRampToValueAtTime(0.001, now + duration);

    noiseSrc.connect(filter);
    filter.connect(gain);
    gain.connect(this.ctx.destination);
    noiseSrc.start(now);
  }

  // Continuous stimulating Deluxe Casino spin arpeggio & mechanical ratchet ticker
  public startSpinRollLoop(isFever: boolean = false) {
    this.initContext();
    if (!this.ctx || this.isMuted) return;

    this.stopSpinRollLoop();
    this.isSpinRolling = true;
    this.isAnticipationRolling = false;
    this.spinRollStep = 0;

    const isTimber = this.activeGameTheme === 'timber-critters';
    const isPixel = this.activeGameTheme === 'pixel-arcade';

    // Pixel Arcade: 1989 fast Japanese arcade 8-bit square wave arpeggios
    const pixelRollNotes = isFever
      ? [523.25, 659.25, 783.99, 1046.5, 1318.51, 1567.98, 2093.0, 2637.02]
      : [440.0, 523.25, 659.25, 783.99, 880.0, 1046.5, 1318.51, 1567.98];

    // Classic VLT ascending arpeggio notes (bright pentatonic chime sequence)
    const vaultRollNotes = isFever
      ? [587.33, 659.25, 783.99, 880.0, 1046.5, 1174.66, 1318.51, 1567.98]
      : [523.25, 587.33, 659.25, 783.99, 880.0, 1046.5, 1174.66, 1318.51];

    // Timberland pentatonic G-major marimba / banjo notes
    const timberRollNotes = isFever
      ? [440.0, 493.88, 587.33, 659.25, 783.99, 880.0, 987.77, 1174.66]
      : [392.0, 440.0, 493.88, 587.33, 659.25, 783.99, 880.0, 987.77];

    const rollNotes = isPixel ? pixelRollNotes : isTimber ? timberRollNotes : vaultRollNotes;
    const stepIntervalMs = isFever ? 44 : isPixel ? 50 : 58;

    const playRollTick = () => {
      if (!this.isSpinRolling || !this.ctx || this.isMuted) return;

      const now = this.ctx.currentTime;
      const step = this.spinRollStep;

      // 1. Ticking percussion: 8-bit blip for Pixel, Woodpecker for Timberland, ratchet for Vault
      if (isPixel) {
        // Fast 8-Bit Arcade Counter Pulse
        const bitTick = this.ctx.createOscillator();
        const bitGain = this.ctx.createGain();
        bitGain.gain.setValueAtTime(0.20 * this.sfxVolume, now);
        bitGain.gain.exponentialRampToValueAtTime(0.001, now + 0.022);

        bitTick.type = 'square';
        const tickFreq = (step % 2 === 0 ? 880 : 1320);
        bitTick.frequency.setValueAtTime(tickFreq, now);

        bitTick.connect(bitGain);
        bitGain.connect(this.ctx.destination);
        bitTick.start(now);
        bitTick.stop(now + 0.025);

        setTimeout(() => {
          try {
            bitTick.disconnect();
            bitGain.disconnect();
          } catch {}
        }, 30);
      } else if (isTimber) {
        // Hollow Woodpecker Woodblock Knock
        const woodTick = this.ctx.createOscillator();
        const woodGain = this.ctx.createGain();
        woodGain.gain.setValueAtTime(0.40 * this.sfxVolume, now);
        woodGain.gain.exponentialRampToValueAtTime(0.001, now + 0.022);

        woodTick.type = 'triangle';
        const tickPitch = (step % 2 === 0 ? 520 : 740) + (step % 4) * 40;
        woodTick.frequency.setValueAtTime(tickPitch, now);
        woodTick.frequency.exponentialRampToValueAtTime(tickPitch * 0.6, now + 0.02);

        woodTick.connect(woodGain);
        woodGain.connect(this.ctx.destination);
        woodTick.start(now);
        woodTick.stop(now + 0.025);

        setTimeout(() => {
          try {
            woodTick.disconnect();
            woodGain.disconnect();
          } catch {}
        }, 30);
      } else if (this.ratchetBuffer) {
        // Mechanical Stepper Ratchet Click
        const clickSource = this.ctx.createBufferSource();
        clickSource.buffer = this.ratchetBuffer;

        const clickFilter = this.ctx.createBiquadFilter();
        clickFilter.type = 'bandpass';
        clickFilter.frequency.setValueAtTime(2600 + (step % 4) * 250, now);
        clickFilter.Q.setValueAtTime(2.2, now);

        const clickGain = this.ctx.createGain();
        clickGain.gain.setValueAtTime(0.38 * this.sfxVolume, now);
        clickGain.gain.exponentialRampToValueAtTime(0.001, now + 0.018);

        clickSource.connect(clickFilter);
        clickFilter.connect(clickGain);
        clickGain.connect(this.ctx.destination);
        clickSource.start(now);

        setTimeout(() => {
          try {
            clickSource.disconnect();
            clickFilter.disconnect();
            clickGain.disconnect();
          } catch {}
        }, 25);
      }

      // 2. Melodic Pitch Pulse: 8-Bit Chiptune for Pixel, Marimba for Timberland, Synth for Vault
      const pitch = this.isAnticipationRolling
        ? isPixel
          ? 987.77 + (step % 8) * 160 // Fast 8-bit cyber suspense riser
          : isTimber
          ? 783.99 + (step % 8) * 110 // Suspenseful climbing owl whistle
          : 880 + (step % 8) * 140   // High suspense climbing ladder
        : rollNotes[step % rollNotes.length];

      const toneOsc = this.ctx.createOscillator();
      const toneGain = this.ctx.createGain();
      const toneVol = this.isAnticipationRolling ? 0.35 : isPixel ? 0.22 : isTimber ? 0.28 : 0.24;

      toneGain.gain.setValueAtTime(toneVol * this.sfxVolume, now);
      toneGain.gain.exponentialRampToValueAtTime(0.0001, now + (this.isAnticipationRolling ? 0.12 : 0.08));

      toneOsc.type = isPixel ? 'square' : isTimber ? 'triangle' : this.isAnticipationRolling ? 'sawtooth' : 'triangle';
      toneOsc.frequency.setValueAtTime(pitch, now);

      toneOsc.connect(toneGain);
      toneGain.connect(this.ctx.destination);
      toneOsc.start(now);
      toneOsc.stop(now + 0.09);

      setTimeout(() => {
        try {
          toneOsc.disconnect();
          toneGain.disconnect();
        } catch {}
      }, 100);

      this.spinRollStep = (this.spinRollStep + 1) % 32;
      this.spinRollTimerId = window.setTimeout(playRollTick, stepIntervalMs);
    };

    playRollTick();
  }

  // Accelerate and raise pitch when anticipation is triggered (reels 0 & 1 hit scatters)
  public updateSpinRollAnticipation() {
    this.isAnticipationRolling = true;
  }

  // Stop the spin roll loop when all reels settle
  public stopSpinRollLoop() {
    this.isSpinRolling = false;
    this.isAnticipationRolling = false;
    if (this.spinRollTimerId) {
      clearTimeout(this.spinRollTimerId);
      this.spinRollTimerId = null;
    }
  }

  public setGameTheme(theme: GameId) {
    const prevTheme = this.activeGameTheme;
    this.activeGameTheme = theme;
    if (prevTheme !== theme) {
      this.musicStep = 0;
      this.updateTempoForTheme();
    }
  }

  public getGameTheme(): GameId {
    return this.activeGameTheme;
  }

  // Authentic 8-bit square-wave reel stop blip for Pixel Arcade
  public playArcadeStop(reelIndex: number = 0) {
    this.initContext();
    if (!this.ctx || this.isMuted) return;

    const basePitch = 220 * Math.pow(2, (reelIndex * 2) / 12);
    const now = this.ctx.currentTime;

    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();
    gain.gain.setValueAtTime(0.55 * this.sfxVolume, now);
    gain.gain.setValueAtTime(0.55 * this.sfxVolume, now + 0.04);
    gain.gain.exponentialRampToValueAtTime(0.001, now + 0.08);

    osc.type = 'square';
    osc.frequency.setValueAtTime(basePitch, now);
    osc.frequency.setValueAtTime(basePitch * 1.5, now + 0.03);

    osc.connect(gain);
    gain.connect(this.ctx.destination);
    osc.start(now);
    osc.stop(now + 0.09);
  }

  // 8-bit Power-Up chime for Pixel Cartridge
  public playArcadeCartridge(scatterIndex: number = 1) {
    this.initContext();
    if (!this.ctx || this.isMuted) return;

    const notes = [440, 554.37, 659.25, 880, 1108.73, 1318.51];
    const now = this.ctx.currentTime;

    notes.slice(0, Math.min(notes.length, scatterIndex + 2)).forEach((freq, idx) => {
      if (!this.ctx) return;
      const t = now + idx * 0.055;
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      gain.gain.setValueAtTime(0.4 * this.sfxVolume, t);
      gain.gain.exponentialRampToValueAtTime(0.001, t + 0.12);

      osc.type = 'square';
      osc.frequency.setValueAtTime(freq, t);

      osc.connect(gain);
      gain.connect(this.ctx.destination);
      osc.start(t);
      osc.stop(t + 0.13);
    });
  }

  // 8-bit arpeggiated victory fanfare
  public playArcadeWin(multiplier: number = 1) {
    this.initContext();
    if (!this.ctx || this.isMuted) return;

    const notes = [523.25, 659.25, 783.99, 1046.5, 1318.51, 1567.98];
    const count = multiplier >= 20 ? 6 : multiplier >= 5 ? 5 : 4;
    const now = this.ctx.currentTime;

    notes.slice(0, count).forEach((freq, idx) => {
      if (!this.ctx) return;
      const t = now + idx * 0.07;
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      gain.gain.setValueAtTime(0.45 * this.sfxVolume, t);
      gain.gain.exponentialRampToValueAtTime(0.001, t + 0.14);

      osc.type = 'square';
      osc.frequency.setValueAtTime(freq, t);

      osc.connect(gain);
      gain.connect(this.ctx.destination);
      osc.start(t);
      osc.stop(t + 0.15);
    });
  }

  // Resonant wooden block strike for Timberland reels
  public playTimberStop(reelIndex: number = 0) {
    this.initContext();
    if (!this.ctx || this.isMuted) return;

    const basePitch = 180 + reelIndex * 40;
    const now = this.ctx.currentTime;

    // Resonant wooden block strike
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();
    gain.gain.setValueAtTime(0.75 * this.sfxVolume, now);
    gain.gain.exponentialRampToValueAtTime(0.001, now + 0.11);

    osc.type = 'triangle';
    osc.frequency.setValueAtTime(basePitch * 1.5, now);
    osc.frequency.exponentialRampToValueAtTime(basePitch * 0.7, now + 0.09);

    osc.connect(gain);
    gain.connect(this.ctx.destination);
    osc.start(now);
    osc.stop(now + 0.12);

    // Woody hollow knock (low thump)
    const thump = this.ctx.createOscillator();
    const thumpGain = this.ctx.createGain();
    thumpGain.gain.setValueAtTime(0.5 * this.sfxVolume, now);
    thumpGain.gain.exponentialRampToValueAtTime(0.001, now + 0.08);

    thump.type = 'sine';
    thump.frequency.setValueAtTime(95 + reelIndex * 15, now);
    thump.frequency.exponentialRampToValueAtTime(40, now + 0.07);

    thump.connect(thumpGain);
    thumpGain.connect(this.ctx.destination);
    thump.start(now);
    thump.stop(now + 0.09);
  }

  // Mystical two-tone owl call for Timberland scatters
  public playOwlHoot(scatterIndex: number = 1) {
    this.initContext();
    if (!this.ctx || this.isMuted) return;

    const now = this.ctx.currentTime;
    // Tone 1: Soft "hoo"
    const osc1 = this.ctx.createOscillator();
    const gain1 = this.ctx.createGain();
    gain1.gain.setValueAtTime(0.3 * this.sfxVolume, now);
    gain1.gain.exponentialRampToValueAtTime(0.001, now + 0.18);
    osc1.type = 'sine';
    osc1.frequency.setValueAtTime(440 + scatterIndex * 40, now);
    osc1.connect(gain1);
    gain1.connect(this.ctx.destination);
    osc1.start(now);
    osc1.stop(now + 0.19);

    // Tone 2: Rising mystical "HOOO"
    const t2 = now + 0.14;
    const osc2 = this.ctx.createOscillator();
    const gain2 = this.ctx.createGain();
    gain2.gain.setValueAtTime(0.45 * this.sfxVolume, t2);
    gain2.gain.exponentialRampToValueAtTime(0.001, t2 + 0.45);
    osc2.type = 'sine';
    osc2.frequency.setValueAtTime(587.33 + scatterIndex * 50, t2);
    osc2.frequency.exponentialRampToValueAtTime(520 + scatterIndex * 40, t2 + 0.4);
    osc2.connect(gain2);
    gain2.connect(this.ctx.destination);
    osc2.start(t2);
    osc2.stop(t2 + 0.46);
  }

  // Upbeat plucked bluegrass / acoustic folk arpeggio for Timberland wins
  public playForestWin(multiplier: number = 1) {
    this.initContext();
    if (!this.ctx || this.isMuted) return;

    const notes = [392.0, 493.88, 587.33, 783.99, 987.77, 1174.66]; // G4, B4, D5, G5, B5, D6
    const count = multiplier >= 20 ? 6 : multiplier >= 5 ? 4 : 3;

    notes.slice(0, count).forEach((freq, idx) => {
      if (!this.ctx) return;
      const startTime = this.ctx.currentTime + idx * 0.075;
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();

      gain.gain.setValueAtTime(0.4 * this.sfxVolume, startTime);
      gain.gain.exponentialRampToValueAtTime(0.001, startTime + 0.28);

      osc.type = 'triangle';
      osc.frequency.setValueAtTime(freq, startTime);
      osc.frequency.exponentialRampToValueAtTime(freq * 0.99, startTime + 0.25);

      osc.connect(gain);
      gain.connect(this.ctx.destination);
      osc.start(startTime);
      osc.stop(startTime + 0.3);
    });
  }

  // Deep, warm, playful Grizzly Bear roar for Wild wins
  public playGrizzlyRoar() {
    this.initContext();
    if (!this.ctx || this.isMuted) return;
    const now = this.ctx.currentTime;

    // 1. Low guttural bear growl rumble (frequency-modulated sine/sawtooth)
    const roarOsc = this.ctx.createOscillator();
    const roarGain = this.ctx.createGain();
    roarGain.gain.setValueAtTime(0.65 * this.sfxVolume, now);
    roarGain.gain.exponentialRampToValueAtTime(0.001, now + 0.55);

    roarOsc.type = 'sawtooth';
    roarOsc.frequency.setValueAtTime(95, now);
    roarOsc.frequency.linearRampToValueAtTime(135, now + 0.15);
    roarOsc.frequency.exponentialRampToValueAtTime(45, now + 0.5);

    const roarFilter = this.ctx.createBiquadFilter();
    roarFilter.type = 'lowpass';
    roarFilter.frequency.setValueAtTime(260, now);
    roarFilter.frequency.linearRampToValueAtTime(420, now + 0.15);
    roarFilter.frequency.exponentialRampToValueAtTime(120, now + 0.5);

    roarOsc.connect(roarFilter);
    roarFilter.connect(roarGain);
    roarGain.connect(this.ctx.destination);
    roarOsc.start(now);
    roarOsc.stop(now + 0.55);

    // 2. Heavy bear paw swipe swoosh
    const swipeOsc = this.ctx.createOscillator();
    const swipeGain = this.ctx.createGain();
    swipeGain.gain.setValueAtTime(0.4 * this.sfxVolume, now);
    swipeGain.gain.exponentialRampToValueAtTime(0.001, now + 0.22);
    swipeOsc.type = 'triangle';
    swipeOsc.frequency.setValueAtTime(180, now);
    swipeOsc.frequency.exponentialRampToValueAtTime(60, now + 0.2);
    swipeOsc.connect(swipeGain);
    swipeGain.connect(this.ctx.destination);
    swipeOsc.start(now);
    swipeOsc.stop(now + 0.22);
  }

  // Soaring melodic Timber Wolf howl ("A-WOOOOO!")
  public playWolfHowl() {
    this.initContext();
    if (!this.ctx || this.isMuted) return;
    const now = this.ctx.currentTime;

    const howlOsc = this.ctx.createOscillator();
    const howlGain = this.ctx.createGain();
    howlGain.gain.setValueAtTime(0.45 * this.sfxVolume, now);
    howlGain.gain.exponentialRampToValueAtTime(0.001, now + 0.85);

    howlOsc.type = 'sine';
    // Gentle upward howl scoop: D4 (293Hz) -> A4 (440Hz) -> D5 (587Hz)
    howlOsc.frequency.setValueAtTime(293.66, now);
    howlOsc.frequency.exponentialRampToValueAtTime(440.0, now + 0.25);
    howlOsc.frequency.linearRampToValueAtTime(587.33, now + 0.55);
    howlOsc.frequency.exponentialRampToValueAtTime(520.0, now + 0.8);

    howlOsc.connect(howlGain);
    howlGain.connect(this.ctx.destination);
    howlOsc.start(now);
    howlOsc.stop(now + 0.85);
  }

  // Playful, cheeky Clever Fox double-yip ("Yip-Yip!")
  public playFoxYip() {
    this.initContext();
    if (!this.ctx || this.isMuted) return;
    const now = this.ctx.currentTime;

    [0, 0.12].forEach((offset, idx) => {
      if (!this.ctx) return;
      const t = now + offset;
      const yipOsc = this.ctx.createOscillator();
      const yipGain = this.ctx.createGain();
      yipGain.gain.setValueAtTime(0.35 * this.sfxVolume, t);
      yipGain.gain.exponentialRampToValueAtTime(0.001, t + 0.09);

      yipOsc.type = 'triangle';
      const startPitch = idx === 0 ? 820 : 1050;
      yipOsc.frequency.setValueAtTime(startPitch, t);
      yipOsc.frequency.exponentialRampToValueAtTime(startPitch * 1.5, t + 0.08);

      yipOsc.connect(yipGain);
      yipGain.connect(this.ctx.destination);
      yipOsc.start(t);
      yipOsc.stop(t + 0.09);
    });
  }

  // Bouncing Golden Acorn chime with sparkling magic stars
  public playAcornChime() {
    this.initContext();
    if (!this.ctx || this.isMuted) return;
    const now = this.ctx.currentTime;

    // 1. Woody hollow acorn bounce
    const tapOsc = this.ctx.createOscillator();
    const tapGain = this.ctx.createGain();
    tapGain.gain.setValueAtTime(0.6 * this.sfxVolume, now);
    tapGain.gain.exponentialRampToValueAtTime(0.001, now + 0.07);
    tapOsc.type = 'triangle';
    tapOsc.frequency.setValueAtTime(480, now);
    tapOsc.frequency.exponentialRampToValueAtTime(240, now + 0.06);
    tapOsc.connect(tapGain);
    tapGain.connect(this.ctx.destination);
    tapOsc.start(now);
    tapOsc.stop(now + 0.07);

    // 2. Sparkling crystalline twinkle chime
    [1046.5, 1318.51, 1567.98].forEach((freq, idx) => {
      if (!this.ctx) return;
      const t = now + 0.04 + idx * 0.045;
      const chimeOsc = this.ctx.createOscillator();
      const chimeGain = this.ctx.createGain();
      chimeGain.gain.setValueAtTime(0.3 * this.sfxVolume, t);
      chimeGain.gain.exponentialRampToValueAtTime(0.001, t + 0.25);
      chimeOsc.type = 'sine';
      chimeOsc.frequency.setValueAtTime(freq, t);
      chimeOsc.connect(chimeGain);
      chimeGain.connect(this.ctx.destination);
      chimeOsc.start(t);
      chimeOsc.stop(t + 0.26);
    });
  }

  // Fast bushy squirrel nut chatter
  public playSquirrelChatter() {
    this.initContext();
    if (!this.ctx || this.isMuted) return;
    const now = this.ctx.currentTime;

    for (let i = 0; i < 4; i++) {
      const t = now + i * 0.035;
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      gain.gain.setValueAtTime(0.28 * this.sfxVolume, t);
      gain.gain.exponentialRampToValueAtTime(0.001, t + 0.025);
      osc.type = 'triangle';
      osc.frequency.setValueAtTime(1200 + (i % 2) * 300, t);
      osc.frequency.exponentialRampToValueAtTime(600, t + 0.02);
      osc.connect(gain);
      gain.connect(this.ctx.destination);
      osc.start(t);
      osc.stop(t + 0.03);
    }
  }

  // Full celebratory bluegrass breakdown fanfare for Timberland jackpots
  public playWoodlandFanfare() {
    this.initContext();
    if (!this.ctx || this.isMuted) return;

    // Upbeat G major hoedown chord progression: G -> C -> D7 -> G
    const chords = [
      [392.0, 493.88, 587.33], // G Major
      [523.25, 659.25, 783.99], // C Major
      [587.33, 739.99, 880.0, 1046.5], // D7
      [783.99, 987.77, 1174.66, 1567.98], // High G Major triumphant
    ];

    chords.forEach((chord, chordIdx) => {
      if (!this.ctx) return;
      const startTime = this.ctx.currentTime + chordIdx * 0.24;
      chord.forEach((freq) => {
        if (!this.ctx) return;
        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();

        const duration = chordIdx === chords.length - 1 ? 1.4 : 0.28;
        gain.gain.setValueAtTime(0.32 * this.sfxVolume, startTime);
        gain.gain.exponentialRampToValueAtTime(0.001, startTime + duration);

        osc.type = 'triangle';
        osc.frequency.setValueAtTime(freq, startTime);

        osc.connect(gain);
        gain.connect(this.ctx.destination);

        osc.start(startTime);
        osc.stop(startTime + duration);
      });
    });

    // Celebratory owl call finale
    setTimeout(() => {
      this.playOwlHoot(3);
    }, 900);
  }

  // PlayStation 2 BIOS Ocean Swell & Crystal Chords Startup Sequence
  public playPs2Startup() {
    this.initContext();
    if (!this.ctx || this.isMuted) return;
    const now = this.ctx.currentTime;

    // 1. Resonant Deep Ocean Atmosphere Swell
    const swellOsc = this.ctx.createOscillator();
    const swellGain = this.ctx.createGain();
    swellGain.gain.setValueAtTime(0.001, now);
    swellGain.gain.exponentialRampToValueAtTime(0.45 * this.sfxVolume, now + 0.4);
    swellGain.gain.exponentialRampToValueAtTime(0.001, now + 1.8);
    swellOsc.type = 'sine';
    swellOsc.frequency.setValueAtTime(55, now);
    swellOsc.frequency.exponentialRampToValueAtTime(110, now + 1.2);
    swellOsc.connect(swellGain);
    swellGain.connect(this.ctx.destination);
    swellOsc.start(now);
    swellOsc.stop(now + 1.9);

    // 2. Crystal Monolith Boot Chord [C3, G3, D4, A4, E5]
    const chord = [130.81, 196.0, 293.66, 440.0, 659.25];
    chord.forEach((freq, idx) => {
      if (!this.ctx) return;
      const t = now + 0.35 + idx * 0.08;
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      gain.gain.setValueAtTime(0.25 * this.sfxVolume, t);
      gain.gain.exponentialRampToValueAtTime(0.001, t + 1.6);
      osc.type = 'sine';
      osc.frequency.setValueAtTime(freq, t);
      osc.connect(gain);
      gain.connect(this.ctx.destination);
      osc.start(t);
      osc.stop(t + 1.7);
    });
  }

  // Optical drive spin-up and laser track alignment on PS2 spin start
  public playPs2Spin() {
    this.initContext();
    if (!this.ctx || this.isMuted) return;
    const now = this.ctx.currentTime;

    // Optical spindle motor accelerating
    const motor = this.ctx.createOscillator();
    const motorGain = this.ctx.createGain();
    motorGain.gain.setValueAtTime(0.3 * this.sfxVolume, now);
    motorGain.gain.exponentialRampToValueAtTime(0.001, now + 0.28);
    motor.type = 'sine';
    motor.frequency.setValueAtTime(140, now);
    motor.frequency.exponentialRampToValueAtTime(540, now + 0.24);
    motor.connect(motorGain);
    motorGain.connect(this.ctx.destination);
    motor.start(now);
    motor.stop(now + 0.3);

    // Laser seek chirp
    const chirp = this.ctx.createOscillator();
    const chirpGain = this.ctx.createGain();
    chirpGain.gain.setValueAtTime(0.25 * this.sfxVolume, now + 0.05);
    chirpGain.gain.exponentialRampToValueAtTime(0.001, now + 0.12);
    chirp.type = 'triangle';
    chirp.frequency.setValueAtTime(920, now + 0.05);
    chirp.frequency.exponentialRampToValueAtTime(1440, now + 0.11);
    chirp.connect(chirpGain);
    chirpGain.connect(this.ctx.destination);
    chirp.start(now + 0.05);
    chirp.stop(now + 0.13);
  }

  // DualShock 2 tactile pressure button click
  public playPs2Button() {
    this.initContext();
    if (!this.ctx || this.isMuted) return;
    const now = this.ctx.currentTime;

    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();
    gain.gain.setValueAtTime(0.35 * this.sfxVolume, now);
    gain.gain.exponentialRampToValueAtTime(0.001, now + 0.04);
    osc.type = 'sine';
    osc.frequency.setValueAtTime(520, now);
    osc.frequency.exponentialRampToValueAtTime(880, now + 0.035);
    osc.connect(gain);
    gain.connect(this.ctx.destination);
    osc.start(now);
    osc.stop(now + 0.045);
  }

  // Optical drive seek head actuator step & laser track settling for PS2 reels
  public playPs2Stop(reelIndex: number = 0) {
    this.initContext();
    if (!this.ctx || this.isMuted) return;
    const now = this.ctx.currentTime;

    // Laser step actuator click
    const osc1 = this.ctx.createOscillator();
    const gain1 = this.ctx.createGain();
    gain1.gain.setValueAtTime(0.55 * this.sfxVolume, now);
    gain1.gain.exponentialRampToValueAtTime(0.001, now + 0.035);
    osc1.type = 'triangle';
    const baseFreq = 880 + reelIndex * 120;
    osc1.frequency.setValueAtTime(baseFreq, now);
    osc1.frequency.exponentialRampToValueAtTime(220, now + 0.03);
    osc1.connect(gain1);
    gain1.connect(this.ctx.destination);
    osc1.start(now);
    osc1.stop(now + 0.04);

    // Motor spindle micro-stop
    const spinOsc = this.ctx.createOscillator();
    const spinGain = this.ctx.createGain();
    spinGain.gain.setValueAtTime(0.35 * this.sfxVolume, now + 0.01);
    spinGain.gain.exponentialRampToValueAtTime(0.001, now + 0.08);
    spinOsc.type = 'sine';
    spinOsc.frequency.setValueAtTime(160, now + 0.01);
    spinOsc.frequency.exponentialRampToValueAtTime(45, now + 0.07);
    spinOsc.connect(spinGain);
    spinGain.connect(this.ctx.destination);
    spinOsc.start(now + 0.01);
    spinOsc.stop(now + 0.09);
  }

  // Blue Laser DVD Scatter landing: BIOS Memory Monolith shimmer
  public playPs2Scatter(scatterIndex: number = 1) {
    this.initContext();
    if (!this.ctx || this.isMuted) return;
    const now = this.ctx.currentTime;

    const baseNotes = [587.33, 739.99, 880.0, 1174.66, 1479.98];
    const freq = baseNotes[Math.min(baseNotes.length - 1, Math.max(0, scatterIndex - 1))];

    // Shimmering crystalline overtone
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();
    gain.gain.setValueAtTime(0.4 * this.sfxVolume, now);
    gain.gain.exponentialRampToValueAtTime(0.001, now + 0.45);
    osc.type = 'sine';
    osc.frequency.setValueAtTime(freq, now);
    osc.frequency.linearRampToValueAtTime(freq * 1.05, now + 0.4);
    osc.connect(gain);
    gain.connect(this.ctx.destination);
    osc.start(now);
    osc.stop(now + 0.48);

    // Sub-bass ocean echo
    const subOsc = this.ctx.createOscillator();
    const subGain = this.ctx.createGain();
    subGain.gain.setValueAtTime(0.3 * this.sfxVolume, now);
    subGain.gain.exponentialRampToValueAtTime(0.001, now + 0.3);
    subOsc.type = 'sine';
    subOsc.frequency.setValueAtTime(75, now);
    subOsc.frequency.exponentialRampToValueAtTime(35, now + 0.28);
    subOsc.connect(subGain);
    subGain.connect(this.ctx.destination);
    subOsc.start(now);
    subOsc.stop(now + 0.32);
  }

  // 8MB MagicGate Memory Card Save chime (2-tone rising confirmation)
  public playPs2MemoryCardSave() {
    this.initContext();
    if (!this.ctx || this.isMuted) return;
    const now = this.ctx.currentTime;

    [659.25, 1318.51].forEach((pitch, idx) => {
      if (!this.ctx) return;
      const t = now + idx * 0.12;
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      gain.gain.setValueAtTime(0.35 * this.sfxVolume, t);
      gain.gain.exponentialRampToValueAtTime(0.001, t + 0.35);
      osc.type = 'sine';
      osc.frequency.setValueAtTime(pitch, t);
      osc.connect(gain);
      gain.connect(this.ctx.destination);
      osc.start(t);
      osc.stop(t + 0.38);
    });
  }

  // PlayStation 2 emotion engine victory fanfare
  public playPs2Win(multiplier: number = 1) {
    this.initContext();
    if (!this.ctx || this.isMuted) return;
    const now = this.ctx.currentTime;

    const chords = [
      [293.66, 369.99, 440.0],
      [369.99, 440.0, 587.33],
      [440.0, 554.37, 659.25],
      [587.33, 739.99, 880.0, 1174.66],
    ];
    const count = multiplier >= 20 ? 4 : multiplier >= 5 ? 3 : 2;

    chords.slice(0, count).forEach((chord, chordIdx) => {
      if (!this.ctx) return;
      const t = now + chordIdx * 0.18;
      chord.forEach((freq) => {
        if (!this.ctx) return;
        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();
        gain.gain.setValueAtTime(0.25 * this.sfxVolume, t);
        gain.gain.exponentialRampToValueAtTime(0.001, t + 0.5);
        osc.type = 'triangle';
        osc.frequency.setValueAtTime(freq, t);
        osc.connect(gain);
        gain.connect(this.ctx.destination);
        osc.start(t);
        osc.stop(t + 0.55);
      });
    });
  }

  // Heavy tactile physical reel stop (bass punch + spring latch clack)
  public playReelStop(reelIndex: number = 0) {
    if (this.activeGameTheme === 'pixel-arcade') {
      this.playArcadeStop(reelIndex);
      return;
    }
    if (this.activeGameTheme === 'timber-critters') {
      this.playTimberStop(reelIndex);
      return;
    }
    if (this.activeGameTheme === 'ps2-legends') {
      this.playPs2Stop(reelIndex);
      return;
    }
    this.initContext();
    if (!this.ctx || this.isMuted) return;

    const baseFreq = 140 + reelIndex * 35; // Ascending mechanical pitch from reel 0 to 4
    const now = this.ctx.currentTime;

    // 1. Heavy physical clunk impact
    const punchOsc = this.ctx.createOscillator();
    const punchGain = this.ctx.createGain();
    punchGain.gain.setValueAtTime(0.70 * this.sfxVolume, now);
    punchGain.gain.exponentialRampToValueAtTime(0.001, now + 0.12);

    punchOsc.type = 'triangle';
    punchOsc.frequency.setValueAtTime(baseFreq * 1.8, now);
    punchOsc.frequency.exponentialRampToValueAtTime(baseFreq * 0.4, now + 0.1);

    punchOsc.connect(punchGain);
    punchGain.connect(this.ctx.destination);
    punchOsc.start(now);
    punchOsc.stop(now + 0.13);

    // 2. Sub-bass cabinet thump
    const subOsc = this.ctx.createOscillator();
    const subGain = this.ctx.createGain();
    subGain.gain.setValueAtTime(0.65 * this.sfxVolume, now);
    subGain.gain.exponentialRampToValueAtTime(0.001, now + 0.09);

    subOsc.type = 'sine';
    subOsc.frequency.setValueAtTime(85, now);
    subOsc.frequency.exponentialRampToValueAtTime(32, now + 0.08);

    subOsc.connect(subGain);
    subGain.connect(this.ctx.destination);
    subOsc.start(now);
    subOsc.stop(now + 0.1);

    // 3. Metallic latch lock click
    const latchOsc = this.ctx.createOscillator();
    const latchGain = this.ctx.createGain();
    latchGain.gain.setValueAtTime(0.35 * this.sfxVolume, now);
    latchGain.gain.exponentialRampToValueAtTime(0.001, now + 0.04);
    latchOsc.type = 'square';
    latchOsc.frequency.setValueAtTime(950 + reelIndex * 120, now);

    latchOsc.connect(latchGain);
    latchGain.connect(this.ctx.destination);
    latchOsc.start(now);
    latchOsc.stop(now + 0.05);
  }

  // Radiant casino scatter bell fanfare with dual harmonic ring
  public playScatterLand(scatterIndex: number = 1) {
    if (this.activeGameTheme === 'pixel-arcade') {
      this.playArcadeCartridge(scatterIndex);
      return;
    }
    if (this.activeGameTheme === 'timber-critters') {
      this.playOwlHoot(scatterIndex);
      return;
    }
    if (this.activeGameTheme === 'ps2-legends') {
      this.playPs2Scatter(scatterIndex);
      return;
    }
    this.initContext();
    if (!this.ctx || this.isMuted) return;

    const now = this.ctx.currentTime;
    const basePitches = [523.25, 659.25, 783.99, 1046.5, 1318.51];
    const pitch = basePitches[Math.min(basePitches.length - 1, Math.max(0, scatterIndex - 1))];

    const osc1 = this.ctx.createOscillator();
    const osc2 = this.ctx.createOscillator();
    const gain = this.createGainNode(0.65, 0.65, 0.0001);
    if (!gain) return;

    osc1.type = 'sine';
    osc1.frequency.setValueAtTime(pitch, now);

    osc2.type = 'triangle';
    osc2.frequency.setValueAtTime(pitch * 2, now);

    osc1.connect(gain);
    osc2.connect(gain);

    osc1.start(now);
    osc2.start(now);
    osc1.stop(now + 0.65);
    osc2.stop(now + 0.65);
  }

  // Anticipation loop
  public playAnticipationLoop() {
    this.initContext();
    if (!this.ctx || this.isMuted) return;

    const now = this.ctx.currentTime;
    const osc = this.ctx.createOscillator();
    const gain = this.createGainNode(0.15, 0.4, 0.01);
    if (!gain) return;

    osc.type = 'sine';
    osc.frequency.setValueAtTime(90, now);
    osc.frequency.exponentialRampToValueAtTime(140, now + 0.12);

    osc.connect(gain);
    osc.start();
    osc.stop(now + 0.15);
  }

  // Coin tally: 100% Bespoke per game
  public playCoinTally() {
    this.initContext();
    if (!this.ctx || this.isMuted) return;
    const now = this.ctx.currentTime;

    if (this.activeGameTheme === 'pixel-arcade') {
      // 8-bit score counter tick
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      gain.gain.setValueAtTime(0.18 * this.sfxVolume, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.035);
      osc.type = 'square';
      osc.frequency.setValueAtTime(1200 + (Math.random() * 300), now);
      osc.connect(gain);
      gain.connect(this.ctx.destination);
      osc.start(now);
      osc.stop(now + 0.038);
      return;
    }

    if (this.activeGameTheme === 'timber-critters') {
      // Organic seed pod / acorn rattle
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      gain.gain.setValueAtTime(0.25 * this.sfxVolume, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.04);
      osc.type = 'triangle';
      osc.frequency.setValueAtTime(750 + Math.random() * 250, now);
      osc.frequency.exponentialRampToValueAtTime(350, now + 0.035);
      osc.connect(gain);
      gain.connect(this.ctx.destination);
      osc.start(now);
      osc.stop(now + 0.042);
      return;
    }

    if (this.activeGameTheme === 'ps2-legends') {
      // Memory card sector write tick
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      gain.gain.setValueAtTime(0.22 * this.sfxVolume, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.035);
      osc.type = 'sine';
      osc.frequency.setValueAtTime(1046.5 + Math.random() * 200, now);
      osc.connect(gain);
      gain.connect(this.ctx.destination);
      osc.start(now);
      osc.stop(now + 0.038);
      return;
    }

    // 24K Gold Vault: high metallic gold coin ring
    const osc = this.ctx.createOscillator();
    const gain = this.createGainNode(0.04, 0.25, 0.01);
    if (!gain) return;

    osc.type = 'sine';
    const freq = 1200 + Math.random() * 400;
    osc.frequency.setValueAtTime(freq, now);

    osc.connect(gain);
    osc.start();
    osc.stop(now + 0.04);
  }

  // Rapid cascading payout shower: Bespoke per game
  public playCoinCascade(coins: number = 8) {
    this.initContext();
    if (!this.ctx || this.isMuted) return;

    const count = Math.min(25, coins);
    const now = this.ctx.currentTime;

    if (this.activeGameTheme === 'pixel-arcade') {
      // 8-bit arcade coin fountain spray
      for (let i = 0; i < count; i++) {
        const delay = i * 0.04;
        const startTime = now + delay;
        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();
        gain.gain.setValueAtTime(0.18 * this.sfxVolume, startTime);
        gain.gain.exponentialRampToValueAtTime(0.001, startTime + 0.05);
        osc.type = 'square';
        osc.frequency.setValueAtTime(987.77 + (i % 4) * 220, startTime);
        osc.connect(gain);
        gain.connect(this.ctx.destination);
        osc.start(startTime);
        osc.stop(startTime + 0.055);
      }
      return;
    }

    if (this.activeGameTheme === 'timber-critters') {
      // Bountiful acorn & golden pinecone tumble
      for (let i = 0; i < count; i++) {
        const delay = i * 0.045 + Math.random() * 0.015;
        const startTime = now + delay;
        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();
        gain.gain.setValueAtTime(0.26 * this.sfxVolume, startTime);
        gain.gain.exponentialRampToValueAtTime(0.001, startTime + 0.06);
        osc.type = 'triangle';
        const f = 600 + Math.random() * 600;
        osc.frequency.setValueAtTime(f, startTime);
        osc.frequency.exponentialRampToValueAtTime(f * 0.5, startTime + 0.05);
        osc.connect(gain);
        gain.connect(this.ctx.destination);
        osc.start(startTime);
        osc.stop(startTime + 0.065);
      }
      return;
    }

    // 24K Gold Vault: Metallic coin hopper clatter
    for (let i = 0; i < count; i++) {
      const delay = i * 0.045 + Math.random() * 0.015;
      const startTime = now + delay;
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();

      const freq = 1400 + Math.random() * 1200;
      gain.gain.setValueAtTime(0.18 * this.sfxVolume, startTime);
      gain.gain.exponentialRampToValueAtTime(0.001, startTime + 0.07);

      osc.type = Math.random() > 0.5 ? 'triangle' : 'sine';
      osc.frequency.setValueAtTime(freq, startTime);
      osc.frequency.exponentialRampToValueAtTime(freq * 0.6, startTime + 0.06);

      osc.connect(gain);
      gain.connect(this.ctx.destination);

      osc.start(startTime);
      osc.stop(startTime + 0.07);
    }
  }

  // Laser zap for energized paylines
  public playLaserZap() {
    this.initContext();
    if (!this.ctx || this.isMuted) return;

    const now = this.ctx.currentTime;
    const osc = this.ctx.createOscillator();
    const gain = this.createGainNode(0.15, 0.35, 0.01);
    if (!gain) return;

    osc.type = 'sawtooth';
    osc.frequency.setValueAtTime(1400, now);
    osc.frequency.exponentialRampToValueAtTime(150, now + 0.14);

    osc.connect(gain);
    osc.start();
    osc.stop(now + 0.15);
  }

  // Vegas Jackpot Police / Casino Siren
  public playJackpotSiren() {
    this.initContext();
    if (!this.ctx || this.isMuted) return;

    const cycles = 5;
    for (let c = 0; c < cycles; c++) {
      const startTime = this.ctx.currentTime + c * 0.28;
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();

      gain.gain.setValueAtTime(0.3 * this.sfxVolume, startTime);
      gain.gain.exponentialRampToValueAtTime(0.01, startTime + 0.27);

      osc.type = 'sawtooth';
      osc.frequency.setValueAtTime(580, startTime);
      osc.frequency.linearRampToValueAtTime(1250, startTime + 0.14);
      osc.frequency.linearRampToValueAtTime(580, startTime + 0.27);

      osc.connect(gain);
      gain.connect(this.ctx.destination);

      osc.start(startTime);
      osc.stop(startTime + 0.27);
    }
  }

  // Celebration whistle chime
  public playCelebrationWhistle() {
    this.initContext();
    if (!this.ctx || this.isMuted) return;

    const now = this.ctx.currentTime;
    const osc = this.ctx.createOscillator();
    const gain = this.createGainNode(0.35, 0.4, 0.01);
    if (!gain) return;

    osc.type = 'sine';
    osc.frequency.setValueAtTime(900, now);
    osc.frequency.exponentialRampToValueAtTime(2200, now + 0.2);
    osc.frequency.linearRampToValueAtTime(1800, now + 0.35);

    osc.connect(gain);
    osc.start();
    osc.stop(now + 0.35);
  }

  // Deep suspenseful heartbeat thump during anticipation
  public playAnticipationHeartbeat() {
    this.initContext();
    if (!this.ctx || this.isMuted) return;

    const now = this.ctx.currentTime;
    [0, 0.12].forEach((offset) => {
      if (!this.ctx) return;
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      const startTime = now + offset;

      gain.gain.setValueAtTime(0.5 * this.sfxVolume, startTime);
      gain.gain.exponentialRampToValueAtTime(0.001, startTime + 0.1);

      osc.type = 'sine';
      osc.frequency.setValueAtTime(65, startTime);
      osc.frequency.exponentialRampToValueAtTime(35, startTime + 0.09);

      osc.connect(gain);
      gain.connect(this.ctx.destination);

      osc.start(startTime);
      osc.stop(startTime + 0.1);
    });
  }

  // Win chime arpeggio
  public playWinChime(multiplier: number = 1) {
    if (this.activeGameTheme === 'pixel-arcade') {
      this.playArcadeWin(multiplier);
      return;
    }
    if (this.activeGameTheme === 'timber-critters') {
      this.playForestWin(multiplier);
      return;
    }
    if (this.activeGameTheme === 'ps2-legends') {
      this.playPs2Win(multiplier);
      return;
    }
    this.initContext();
    if (!this.ctx || this.isMuted) return;

    const notes = [523.25, 659.25, 783.99, 880.0, 1046.5, 1318.51];
    const count = multiplier >= 20 ? 6 : multiplier >= 5 ? 4 : 3;

    notes.slice(0, count).forEach((freq, idx) => {
      if (!this.ctx) return;
      const startTime = this.ctx.currentTime + idx * 0.08;
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();

      gain.gain.setValueAtTime(0.35 * this.sfxVolume, startTime);
      gain.gain.exponentialRampToValueAtTime(0.001, startTime + 0.35);

      osc.type = 'sine';
      osc.frequency.setValueAtTime(freq, startTime);

      osc.connect(gain);
      gain.connect(this.ctx.destination);

      osc.start(startTime);
      osc.stop(startTime + 0.35);
    });
  }

  // 1980s Japanese Arcade Stage Clear & Boss Defeated Victory Fanfare
  public playArcadeVictoryFanfare() {
    this.initContext();
    if (!this.ctx || this.isMuted) return;

    const arpeggioNotes = [261.63, 329.63, 392.0, 523.25, 659.25, 783.99, 1046.5];
    const now = this.ctx.currentTime;
    arpeggioNotes.forEach((note, idx) => {
      if (!this.ctx) return;
      const startTime = now + idx * 0.07;
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      gain.gain.setValueAtTime(0.32 * this.sfxVolume, startTime);
      gain.gain.exponentialRampToValueAtTime(0.001, startTime + 0.14);

      osc.type = 'triangle';
      osc.frequency.setValueAtTime(note, startTime);

      osc.connect(gain);
      gain.connect(this.ctx.destination);
      osc.start(startTime);
      osc.stop(startTime + 0.16);
    });

    const chordTime = now + arpeggioNotes.length * 0.07;
    const victoryChord = [523.25, 659.25, 783.99, 987.77, 1046.5];
    victoryChord.forEach((note) => {
      if (!this.ctx) return;
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      gain.gain.setValueAtTime(0.24 * this.sfxVolume, chordTime);
      gain.gain.exponentialRampToValueAtTime(0.0001, chordTime + 1.2);

      osc.type = 'sine';
      osc.frequency.setValueAtTime(note, chordTime);

      osc.connect(gain);
      gain.connect(this.ctx.destination);
      osc.start(chordTime);
      osc.stop(chordTime + 1.25);
    });
  }

  // Jackpot fanfare chord progression
  public playJackpotFanfare() {
    if (this.activeGameTheme === 'pixel-arcade') {
      this.playArcadeVictoryFanfare();
      return;
    }
    if (this.activeGameTheme === 'timber-critters') {
      this.playWoodlandFanfare();
      return;
    }
    this.initContext();
    if (!this.ctx || this.isMuted) return;

    const chords = [
      [261.63, 329.63, 392.0],
      [293.66, 369.99, 440.0],
      [329.63, 415.3, 493.88],
      [523.25, 659.25, 783.99, 1046.5],
    ];

    chords.forEach((chord, chordIdx) => {
      if (!this.ctx) return;
      const startTime = this.ctx.currentTime + chordIdx * 0.22;
      chord.forEach((freq) => {
        if (!this.ctx) return;
        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();

        const duration = chordIdx === chords.length - 1 ? 1.2 : 0.25;
        gain.gain.setValueAtTime(0.25 * this.sfxVolume, startTime);
        gain.gain.exponentialRampToValueAtTime(0.001, startTime + duration);

        osc.type = 'triangle';
        osc.frequency.setValueAtTime(freq, startTime);

        osc.connect(gain);
        gain.connect(this.ctx.destination);

        osc.start(startTime);
        osc.stop(startTime + duration);
      });
    });
  }

  public playLevelUp() {
    this.initContext();
    if (!this.ctx || this.isMuted) return;

    const now = this.ctx.currentTime;
    const osc = this.ctx.createOscillator();
    const gain = this.createGainNode(0.8, 0.4, 0.001);
    if (!gain) return;

    osc.type = 'sine';
    osc.frequency.setValueAtTime(300, now);
    osc.frequency.exponentialRampToValueAtTime(1200, now + 0.5);

    osc.connect(gain);
    osc.start();
    osc.stop(now + 0.8);
  }

  // Mechanical ratcheting slot pull lever sound: Bespoke per game
  public playLeverPull() {
    this.initContext();
    if (!this.ctx || this.isMuted) return;
    const now = this.ctx.currentTime;

    if (this.activeGameTheme === 'pixel-arcade') {
      // 1989 Heavy Sanwa microswitch throw + spring rebound
      const osc1 = this.ctx.createOscillator();
      const gain1 = this.ctx.createGain();
      gain1.gain.setValueAtTime(0.35 * this.sfxVolume, now);
      gain1.gain.exponentialRampToValueAtTime(0.001, now + 0.05);
      osc1.type = 'square';
      osc1.frequency.setValueAtTime(320, now);
      osc1.frequency.setValueAtTime(740, now + 0.02);
      osc1.connect(gain1);
      gain1.connect(this.ctx.destination);
      osc1.start(now);
      osc1.stop(now + 0.055);

      const osc2 = this.ctx.createOscillator();
      const gain2 = this.ctx.createGain();
      gain2.gain.setValueAtTime(0.4 * this.sfxVolume, now + 0.06);
      gain2.gain.exponentialRampToValueAtTime(0.001, now + 0.14);
      osc2.type = 'square';
      osc2.frequency.setValueAtTime(1200, now + 0.06);
      osc2.frequency.exponentialRampToValueAtTime(440, now + 0.13);
      osc2.connect(gain2);
      gain2.connect(this.ctx.destination);
      osc2.start(now + 0.06);
      osc2.stop(now + 0.15);
      return;
    }

    if (this.activeGameTheme === 'timber-critters') {
      // Heavy hand-carved cedar timber arm creak + oak peg lock
      const osc1 = this.ctx.createOscillator();
      const gain1 = this.ctx.createGain();
      gain1.gain.setValueAtTime(0.45 * this.sfxVolume, now);
      gain1.gain.exponentialRampToValueAtTime(0.001, now + 0.12);
      osc1.type = 'sawtooth';
      osc1.frequency.setValueAtTime(140, now);
      osc1.frequency.linearRampToValueAtTime(220, now + 0.08);
      osc1.frequency.exponentialRampToValueAtTime(70, now + 0.11);
      osc1.connect(gain1);
      gain1.connect(this.ctx.destination);
      osc1.start(now);
      osc1.stop(now + 0.13);

      const osc2 = this.ctx.createOscillator();
      const gain2 = this.ctx.createGain();
      gain2.gain.setValueAtTime(0.55 * this.sfxVolume, now + 0.12);
      gain2.gain.exponentialRampToValueAtTime(0.001, now + 0.22);
      osc2.type = 'triangle';
      osc2.frequency.setValueAtTime(260, now + 0.12);
      osc2.frequency.exponentialRampToValueAtTime(45, now + 0.21);
      osc2.connect(gain2);
      gain2.connect(this.ctx.destination);
      osc2.start(now + 0.12);
      osc2.stop(now + 0.23);
      return;
    }

    if (this.activeGameTheme === 'ps2-legends') {
      this.playPs2MemoryCardSave();
      return;
    }

    // 24K Gold Vault: Heavy ratcheting brass gear teeth + hydraulic solenoid snap
    for (let i = 0; i < 4; i++) {
      const startTime = now + i * 0.04;
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      gain.gain.setValueAtTime(0.22 * this.sfxVolume, startTime);
      gain.gain.exponentialRampToValueAtTime(0.001, startTime + 0.03);
      osc.type = 'square';
      osc.frequency.setValueAtTime(160 + i * 45, startTime);
      osc.connect(gain);
      gain.connect(this.ctx.destination);
      osc.start(startTime);
      osc.stop(startTime + 0.03);
    }

    const clunkTime = now + 0.17;
    const subOsc = this.ctx.createOscillator();
    const subGain = this.ctx.createGain();
    subGain.gain.setValueAtTime(0.55 * this.sfxVolume, clunkTime);
    subGain.gain.exponentialRampToValueAtTime(0.001, clunkTime + 0.16);
    subOsc.type = 'triangle';
    subOsc.frequency.setValueAtTime(120, clunkTime);
    subOsc.frequency.exponentialRampToValueAtTime(30, clunkTime + 0.14);
    subOsc.connect(subGain);
    subGain.connect(this.ctx.destination);
    subOsc.start(clunkTime);
    subOsc.stop(clunkTime + 0.16);
  }

  // Crisp ceramic casino chip click: Bespoke per game
  public playChipClick() {
    this.initContext();
    if (!this.ctx || this.isMuted) return;
    const now = this.ctx.currentTime;

    if (this.activeGameTheme === 'pixel-arcade') {
      // 8-bit crisp credit tick
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      gain.gain.setValueAtTime(0.22 * this.sfxVolume, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.03);
      osc.type = 'square';
      osc.frequency.setValueAtTime(1480, now);
      osc.frequency.setValueAtTime(1980, now + 0.015);
      osc.connect(gain);
      gain.connect(this.ctx.destination);
      osc.start(now);
      osc.stop(now + 0.032);
      return;
    }

    if (this.activeGameTheme === 'timber-critters') {
      // Carved birch/cedar wood chip clack
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      gain.gain.setValueAtTime(0.32 * this.sfxVolume, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.04);
      osc.type = 'triangle';
      osc.frequency.setValueAtTime(820, now);
      osc.frequency.exponentialRampToValueAtTime(390, now + 0.035);
      osc.connect(gain);
      gain.connect(this.ctx.destination);
      osc.start(now);
      osc.stop(now + 0.042);
      return;
    }

    if (this.activeGameTheme === 'ps2-legends') {
      this.playPs2Button();
      return;
    }

    // 24K Gold Vault: Crisp ceramic clay casino chip click
    const osc = this.ctx.createOscillator();
    const gain = this.createGainNode(0.05, 0.35, 0.01);
    if (!gain) return;

    osc.type = 'sine';
    osc.frequency.setValueAtTime(1800, now);
    osc.frequency.exponentialRampToValueAtTime(800, now + 0.04);

    osc.connect(gain);
    osc.start();
    osc.stop(now + 0.05);
  }

  // High-voltage FEVER SURGE synth arpeggio
  public playFeverSurge() {
    this.initContext();
    if (!this.ctx || this.isMuted) return;

    const freqs = [330, 440, 554.37, 659.25, 880, 1108.73, 1318.51, 1760];
    freqs.forEach((freq, idx) => {
      if (!this.ctx) return;
      const startTime = this.ctx.currentTime + idx * 0.05;
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      gain.gain.setValueAtTime(0.25 * this.sfxVolume, startTime);
      gain.gain.exponentialRampToValueAtTime(0.001, startTime + 0.2);
      osc.type = 'sawtooth';
      osc.frequency.setValueAtTime(freq, startTime);
      osc.connect(gain);
      gain.connect(this.ctx.destination);
      osc.start(startTime);
      osc.stop(startTime + 0.2);
    });
  }

  // Flirty lucky kiss pop and sparkling harp chime for Scarlet Cash
  public playKissChime() {
    this.initContext();
    if (!this.ctx || this.isMuted) return;

    const now = this.ctx.currentTime;

    // 1. Kiss "mwah" pop
    const popOsc = this.ctx.createOscillator();
    const popGain = this.ctx.createGain();
    popGain.gain.setValueAtTime(0.4 * this.sfxVolume, now);
    popGain.gain.exponentialRampToValueAtTime(0.001, now + 0.06);
    popOsc.type = 'sine';
    popOsc.frequency.setValueAtTime(650, now);
    popOsc.frequency.exponentialRampToValueAtTime(280, now + 0.05);
    popOsc.connect(popGain);
    popGain.connect(this.ctx.destination);
    popOsc.start(now);
    popOsc.stop(now + 0.07);

    // 2. Ascending celestial sparkle chimes
    const chimeFreqs = [1760, 2217.46, 2637.02, 3520]; // A6, C#7, E7, A7
    chimeFreqs.forEach((f, idx) => {
      if (!this.ctx) return;
      const t = now + 0.04 + idx * 0.06;
      const chimeOsc = this.ctx.createOscillator();
      const chimeGain = this.ctx.createGain();
      chimeGain.gain.setValueAtTime(0.3 * this.sfxVolume, t);
      chimeGain.gain.exponentialRampToValueAtTime(0.001, t + 0.4);
      chimeOsc.type = 'sine';
      chimeOsc.frequency.setValueAtTime(f, t);
      chimeOsc.connect(chimeGain);
      chimeGain.connect(this.ctx.destination);
      chimeOsc.start(t);
      chimeOsc.stop(t + 0.42);
    });
  }

  // Celebratory champagne bottle cork pop and fizzy bubbly effervescence
  public playChampagnePop() {
    this.initContext();
    if (!this.ctx || this.isMuted) return;

    const now = this.ctx.currentTime;

    // Cork "THUMP"
    const corkOsc = this.ctx.createOscillator();
    const corkGain = this.ctx.createGain();
    corkGain.gain.setValueAtTime(0.6 * this.sfxVolume, now);
    corkGain.gain.exponentialRampToValueAtTime(0.001, now + 0.09);
    corkOsc.type = 'triangle';
    corkOsc.frequency.setValueAtTime(320, now);
    corkOsc.frequency.exponentialRampToValueAtTime(80, now + 0.08);
    corkOsc.connect(corkGain);
    corkGain.connect(this.ctx.destination);
    corkOsc.start(now);
    corkOsc.stop(now + 0.1);

    // Fizzy bubbles
    for (let i = 0; i < 8; i++) {
      const bubbleTime = now + 0.08 + i * 0.035;
      const bubbleOsc = this.ctx.createOscillator();
      const bubbleGain = this.ctx.createGain();
      bubbleGain.gain.setValueAtTime(0.18 * this.sfxVolume, bubbleTime);
      bubbleGain.gain.exponentialRampToValueAtTime(0.001, bubbleTime + 0.05);
      bubbleOsc.type = 'sine';
      bubbleOsc.frequency.setValueAtTime(2400 + Math.random() * 2000, bubbleTime);
      bubbleOsc.connect(bubbleGain);
      bubbleGain.connect(this.ctx.destination);
      bubbleOsc.start(bubbleTime);
      bubbleOsc.stop(bubbleTime + 0.06);
    }
  }

  // Deep subwoofer 48Hz punch for reel impacts
  public playSubwooferPulse() {
    this.initContext();
    if (!this.ctx || this.isMuted) return;

    const now = this.ctx.currentTime;
    const subOsc = this.ctx.createOscillator();
    const subGain = this.ctx.createGain();
    subGain.gain.setValueAtTime(0.45 * this.sfxVolume, now);
    subGain.gain.exponentialRampToValueAtTime(0.001, now + 0.18);
    subOsc.type = 'sine';
    subOsc.frequency.setValueAtTime(75, now);
    subOsc.frequency.exponentialRampToValueAtTime(38, now + 0.16);
    subOsc.connect(subGain);
    subGain.connect(this.ctx.destination);
    subOsc.start(now);
    subOsc.stop(now + 0.2);
  }

  // Playful spring boing for puppet joint animations
  public playPuppetBoing() {
    this.initContext();
    if (!this.ctx || this.isMuted) return;

    const now = this.ctx.currentTime;
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();

    osc.type = 'triangle';
    osc.frequency.setValueAtTime(140, now);
    osc.frequency.exponentialRampToValueAtTime(460, now + 0.08);
    osc.frequency.exponentialRampToValueAtTime(220, now + 0.20);
    osc.frequency.exponentialRampToValueAtTime(340, now + 0.32);

    gain.gain.setValueAtTime(0.28 * this.sfxVolume, now);
    gain.gain.exponentialRampToValueAtTime(0.01, now + 0.38);

    osc.connect(gain);
    gain.connect(this.ctx.destination);
    osc.start(now);
    osc.stop(now + 0.40);
  }

  // Playful pop for character speech bubbles
  public playPuppetQuip() {
    this.initContext();
    if (!this.ctx || this.isMuted) return;

    const now = this.ctx.currentTime;
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();

    osc.type = 'sine';
    osc.frequency.setValueAtTime(520, now);
    osc.frequency.exponentialRampToValueAtTime(840, now + 0.06);

    gain.gain.setValueAtTime(0.25 * this.sfxVolume, now);
    gain.gain.exponentialRampToValueAtTime(0.01, now + 0.12);

    osc.connect(gain);
    gain.connect(this.ctx.destination);
    osc.start(now);
    osc.stop(now + 0.14);
  }

  // Retro comedy honk-honk for boomer humor moments
  public playCornyHorn() {
    this.initContext();
    if (!this.ctx || this.isMuted) return;

    const now = this.ctx.currentTime;
    [0, 0.14].forEach((delay) => {
      if (!this.ctx) return;
      const t = now + delay;
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();

      osc.type = 'sawtooth';
      osc.frequency.setValueAtTime(260, t);
      osc.frequency.linearRampToValueAtTime(245, t + 0.09);

      gain.gain.setValueAtTime(0.18 * this.sfxVolume, t);
      gain.gain.exponentialRampToValueAtTime(0.01, t + 0.10);

      osc.connect(gain);
      gain.connect(this.ctx.destination);
      osc.start(t);
      osc.stop(t + 0.11);
    });
  }

  // Voice synthesizer casino announcement
  public speakAnnouncement(phrase: string) {
    this.speakAnnouncer(phrase);
  }

  // Seductive casino hostess voice synthesizer
  public speakHostess(phrase: string) {
    if (this.isMuted) return;
    if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
      try {
        window.speechSynthesis.cancel();
        const utterance = new SpeechSynthesisUtterance(phrase);
        utterance.rate = 1.08;
        utterance.pitch = 1.35;
        utterance.volume = this.sfxVolume;
        const voices = window.speechSynthesis.getVoices();
        const femaleVoice = voices.find(
          (v) =>
            v.lang.startsWith('en') &&
            (v.name.includes('Zira') ||
              v.name.includes('Samantha') ||
              v.name.includes('Victoria') ||
              v.name.includes('Jenny') ||
              v.name.includes('Female') ||
              v.name.includes('Google US English') ||
              v.name.includes('Microsoft'))
        );
        if (femaleVoice) utterance.voice = femaleVoice;
        window.speechSynthesis.speak(utterance);
      } catch {
        // Speech synthesis fallback
      }
    }
  }

  public speakAnnouncer(phrase: string) {
    if (this.isMuted) return;
    if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
      try {
        window.speechSynthesis.cancel();
        const utterance = new SpeechSynthesisUtterance(phrase);
        utterance.rate = 1.15;
        utterance.pitch = 1.05;
        utterance.volume = this.sfxVolume;
        const voices = window.speechSynthesis.getVoices();
        const enVoice = voices.find(
          (v) =>
            v.lang.startsWith('en') &&
            (v.name.includes('Natural') ||
              v.name.includes('Google') ||
              v.name.includes('David') ||
              v.name.includes('Mark'))
        );
        if (enVoice) utterance.voice = enVoice;
        window.speechSynthesis.speak(utterance);
      } catch {
        // Speech synthesis fallback
      }
    }
  }
}

export const soundManager = new SoundManager();
