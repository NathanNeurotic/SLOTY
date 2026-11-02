import { storage } from '../utils/storage';

class SoundManager {
  private ctx: AudioContext | null = null;
  private isMuted: boolean = false;
  private isMusicMutedState: boolean = false;
  private sfxVolume: number = 0.85;
  private musicVolume: number = 0.70;

  // Background Music Sequencer State
  private isMusicPlayingState: boolean = false;
  private musicStep: number = 0;
  private musicTimerId: number | null = null;
  private musicTempo: number = 116; // BPM for Vegas VIP Lounge Funk
  private isOverdriveMusic: boolean = false;

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
    return gain;
  }

  // =========================================================================
  // --- PROCEDURAL VEGAS VIP LOUNGE & FEVER BACKGROUND MUSIC SYNTHESIZER ---
  // =========================================================================

  public startMusic(overdrive: boolean = false) {
    this.initContext();
    if (!this.ctx) return;
    if (this.ctx.state === 'suspended') {
      this.ctx.resume();
    }
    if (this.isMuted || this.isMusicMutedState) return;

    this.isOverdriveMusic = overdrive;
    this.musicTempo = overdrive ? 128 : 116;

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
    this.musicTempo = overdrive ? 128 : 116;
  }

  private scheduleNextMusicBeat() {
    if (!this.isMusicPlayingState || !this.ctx || this.isMuted || this.isMusicMutedState) {
      return;
    }

    const stepIntervalMs = (60 / this.musicTempo / 4) * 1000; // 16th note interval

    this.playMusicStep(this.musicStep);
    this.musicStep = (this.musicStep + 1) % 32;

    this.musicTimerId = window.setTimeout(() => {
      this.scheduleNextMusicBeat();
    }, stepIntervalMs);
  }

  private playMusicStep(step: number) {
    if (!this.ctx || this.isMuted || this.isMusicMutedState) return;
    const now = this.ctx.currentTime;
    const isOverdrive = this.isOverdriveMusic;
    const vol = this.musicVolume;

    // 1. Kick Drum: Warm punchy 808/909 kick
    if (step % 8 === 0 || (isOverdrive && step % 4 === 0) || (!isOverdrive && step === 14)) {
      const kickOsc = this.ctx.createOscillator();
      const kickGain = this.ctx.createGain();
      kickGain.gain.setValueAtTime(0.55 * vol, now);
      kickGain.gain.exponentialRampToValueAtTime(0.001, now + (isOverdrive ? 0.16 : 0.22));

      kickOsc.type = 'sine';
      kickOsc.frequency.setValueAtTime(isOverdrive ? 150 : 120, now);
      kickOsc.frequency.exponentialRampToValueAtTime(38, now + 0.12);

      kickOsc.connect(kickGain);
      kickGain.connect(this.ctx.destination);
      kickOsc.start(now);
      kickOsc.stop(now + 0.24);
    }

    // 2. Snare / Funk Rimshot & Shaker
    if (step % 8 === 4) {
      // Snappy noise snare
      const bufferSize = this.ctx.sampleRate * 0.12;
      const buffer = this.ctx.createBuffer(1, bufferSize, this.ctx.sampleRate);
      const output = buffer.getChannelData(0);
      for (let i = 0; i < bufferSize; i++) {
        output[i] = Math.random() * 2 - 1;
      }

      const noiseNode = this.ctx.createBufferSource();
      noiseNode.buffer = buffer;

      const noiseFilter = this.ctx.createBiquadFilter();
      noiseFilter.type = 'bandpass';
      noiseFilter.frequency.setValueAtTime(1400, now);
      noiseFilter.Q.setValueAtTime(1.8, now);

      const noiseGain = this.ctx.createGain();
      noiseGain.gain.setValueAtTime(0.38 * vol, now);
      noiseGain.gain.exponentialRampToValueAtTime(0.001, now + 0.11);

      noiseNode.connect(noiseFilter);
      noiseFilter.connect(noiseGain);
      noiseGain.connect(this.ctx.destination);
      noiseNode.start(now);

      // Body tone
      const bodyOsc = this.ctx.createOscillator();
      const bodyGain = this.ctx.createGain();
      bodyGain.gain.setValueAtTime(0.25 * vol, now);
      bodyGain.gain.exponentialRampToValueAtTime(0.001, now + 0.08);
      bodyOsc.type = 'triangle';
      bodyOsc.frequency.setValueAtTime(220, now);
      bodyOsc.frequency.exponentialRampToValueAtTime(110, now + 0.07);

      bodyOsc.connect(bodyGain);
      bodyGain.connect(this.ctx.destination);
      bodyOsc.start(now);
      bodyOsc.stop(now + 0.09);
    }

    // 3. Crisp Hi-Hat Sizzle (16th note swing)
    if (step % 2 === 0 || (isOverdrive && step % 4 === 2)) {
      const hatOsc = this.ctx.createOscillator();
      const hatGain = this.ctx.createGain();
      const isAccent = step % 8 === 2 || step % 8 === 6;
      const hatVol = isAccent ? 0.22 : 0.12;

      hatGain.gain.setValueAtTime(hatVol * vol, now);
      hatGain.gain.exponentialRampToValueAtTime(0.001, now + (isAccent ? 0.07 : 0.04));

      hatOsc.type = 'highpass' as unknown as OscillatorType;
      // High frequency sizzle square + highpass filter
      const sizzleOsc = this.ctx.createOscillator();
      sizzleOsc.type = 'square';
      sizzleOsc.frequency.setValueAtTime(8400, now);

      const filter = this.ctx.createBiquadFilter();
      filter.type = 'highpass';
      filter.frequency.setValueAtTime(6500, now);

      sizzleOsc.connect(filter);
      filter.connect(hatGain);
      hatGain.connect(this.ctx.destination);
      sizzleOsc.start(now);
      sizzleOsc.stop(now + 0.08);
    }

    // 4. Punchy Funk Walking Bassline (C minor / Eb / F / G groove)
    const bassline = [
      65.41, 0, 65.41, 77.78, 87.31, 0, 98.0, 0,       // C2 - C2 - Eb2 - F2 - G2
      65.41, 0, 77.78, 0, 87.31, 98.0, 110.0, 0,      // C2 - Eb2 - F2 - G2 - A2
      58.27, 0, 58.27, 69.3, 77.78, 0, 87.31, 0,       // Bb1 - Bb1 - Db2 - Eb2 - F2
      65.41, 77.78, 87.31, 98.0, 116.54, 0, 130.81, 0 // C2 - Eb2 - F2 - G2 - Bb2 - C3
    ];

    const bassFreq = bassline[step];
    if (bassFreq > 0) {
      const bassOsc = this.ctx.createOscillator();
      const bassGain = this.ctx.createGain();
      bassGain.gain.setValueAtTime((isOverdrive ? 0.48 : 0.40) * vol, now);
      bassGain.gain.exponentialRampToValueAtTime(0.001, now + (isOverdrive ? 0.15 : 0.22));

      bassOsc.type = isOverdrive ? 'sawtooth' : 'triangle';
      bassOsc.frequency.setValueAtTime(bassFreq, now);

      const filter = this.ctx.createBiquadFilter();
      filter.type = 'lowpass';
      filter.frequency.setValueAtTime(isOverdrive ? 900 : 480, now);
      filter.frequency.exponentialRampToValueAtTime(140, now + 0.18);

      bassOsc.connect(filter);
      filter.connect(bassGain);
      bassGain.connect(this.ctx.destination);
      bassOsc.start(now);
      bassOsc.stop(now + 0.24);
    }

    // 5. Velvet Electric Piano Chords on beats 0, 4, 8, 12, 16, 20, 24, 28
    if (step % 4 === 0) {
      // Four luxury chord voicings across the 32-step loop
      // Cm9 -> Fm9 -> Bb13 -> G7#9
      let chordNotes: number[] = [];
      if (step < 8) {
        chordNotes = [261.63, 311.13, 392.0, 466.16, 587.33]; // Cm9 (C4, Eb4, G4, Bb4, D5)
      } else if (step < 16) {
        chordNotes = [261.63, 311.13, 349.23, 440.0, 523.25]; // Fm9 (C4, Eb4, F4, A4, C5)
      } else if (step < 24) {
        chordNotes = [233.08, 293.66, 349.23, 440.0, 523.25]; // Bb13 (Bb3, D4, F4, A4, C5)
      } else {
        chordNotes = [246.94, 311.13, 392.0, 493.88, 587.33]; // G7#9 / Bdim
      }

      const isBeatStart = step % 8 === 0;
      chordNotes.forEach((note) => {
        if (!this.ctx) return;
        const chordOsc = this.ctx.createOscillator();
        const chordGain = this.ctx.createGain();
        chordGain.gain.setValueAtTime((isBeatStart ? 0.14 : 0.08) * vol, now);
        chordGain.gain.exponentialRampToValueAtTime(0.0001, now + (isBeatStart ? 0.65 : 0.35));

        chordOsc.type = 'triangle';
        chordOsc.frequency.setValueAtTime(note, now);

        chordOsc.connect(chordGain);
        chordGain.connect(this.ctx.destination);
        chordOsc.start(now);
        chordOsc.stop(now + (isBeatStart ? 0.70 : 0.40));
      });
    }

    // 6. Casino Bell / Vibraphone Arpeggio Accents
    if (step === 2 || step === 10 || step === 18 || step === 26) {
      const bellPitches = [523.25, 622.25, 783.99, 1046.5]; // C5, Eb5, G5, C6
      const pitch = bellPitches[(step / 8) | 0] || 783.99;

      const bellOsc = this.ctx.createOscillator();
      const bellGain = this.ctx.createGain();
      bellGain.gain.setValueAtTime(0.18 * vol, now);
      bellGain.gain.exponentialRampToValueAtTime(0.0001, now + 0.4);

      bellOsc.type = 'sine';
      bellOsc.frequency.setValueAtTime(pitch, now);

      bellOsc.connect(bellGain);
      bellGain.connect(this.ctx.destination);
      bellOsc.start(now);
      bellOsc.stop(now + 0.42);
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

  // Button click
  public playButtonClick() {
    this.initContext();
    if (!this.ctx || this.isMuted) return;

    const osc = this.ctx.createOscillator();
    const gain = this.createGainNode(0.06, 0.3, 0.01);
    if (!gain) return;

    osc.type = 'triangle';
    osc.frequency.setValueAtTime(440, this.ctx.currentTime);
    osc.frequency.exponentialRampToValueAtTime(880, this.ctx.currentTime + 0.05);

    osc.connect(gain);
    osc.start();
    osc.stop(this.ctx.currentTime + 0.06);
  }

  // --- Continuous Stimulating Oregon Lottery / Vegas Reel Spin Audio Loop ---
  private spinRollTimerId: number | null = null;
  private spinRollStep: number = 0;
  private isSpinRolling: boolean = false;
  private isAnticipationRolling: boolean = false;

  // Spin start: punchy casino excitation chord + pneumatic hiss
  public playSpinStart() {
    this.initContext();
    if (!this.ctx || this.isMuted) return;

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

  // Continuous stimulating Oregon Lottery spin arpeggio & mechanical ratchet ticker
  public startSpinRollLoop(isFever: boolean = false) {
    this.initContext();
    if (!this.ctx || this.isMuted) return;

    this.stopSpinRollLoop();
    this.isSpinRolling = true;
    this.isAnticipationRolling = false;
    this.spinRollStep = 0;

    // Classic Oregon Lottery VLT ascending arpeggio notes (bright pentatonic chime sequence)
    const rollNotes = isFever
      ? [587.33, 659.25, 783.99, 880.0, 1046.5, 1174.66, 1318.51, 1567.98]
      : [523.25, 587.33, 659.25, 783.99, 880.0, 1046.5, 1174.66, 1318.51];

    const stepIntervalMs = isFever ? 50 : 62; // ~16-20 ticks/chimes per second

    const playRollTick = () => {
      if (!this.isSpinRolling || !this.ctx || this.isMuted) return;

      const now = this.ctx.currentTime;
      const step = this.spinRollStep;

      // 1. Mechanical Stepper Ratchet Click (Rapid physical wheel ticking)
      const clickBuffer = this.ctx.createBuffer(1, Math.floor(this.ctx.sampleRate * 0.015), this.ctx.sampleRate);
      const clickData = clickBuffer.getChannelData(0);
      for (let i = 0; i < clickData.length; i++) {
        clickData[i] = (Math.random() * 2 - 1) * Math.exp(-i / 60);
      }
      const clickSource = this.ctx.createBufferSource();
      clickSource.buffer = clickBuffer;

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

      // 2. High-Energy Ascending Casino Marimba / Bell Chime Pulse
      const pitch = this.isAnticipationRolling
        ? 880 + (step % 8) * 140 // High suspense climbing ladder
        : rollNotes[step % rollNotes.length];

      const toneOsc = this.ctx.createOscillator();
      const toneGain = this.ctx.createGain();
      const toneVol = this.isAnticipationRolling ? 0.35 : 0.24;

      toneGain.gain.setValueAtTime(toneVol * this.sfxVolume, now);
      toneGain.gain.exponentialRampToValueAtTime(0.0001, now + (this.isAnticipationRolling ? 0.12 : 0.08));

      toneOsc.type = this.isAnticipationRolling ? 'sawtooth' : 'triangle';
      toneOsc.frequency.setValueAtTime(pitch, now);

      toneOsc.connect(toneGain);
      toneGain.connect(this.ctx.destination);
      toneOsc.start(now);
      toneOsc.stop(now + 0.09);

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

  // Heavy tactile physical reel stop (bass punch + spring latch clack)
  public playReelStop(reelIndex: number = 0) {
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

  // Coin tally
  public playCoinTally() {
    this.initContext();
    if (!this.ctx || this.isMuted) return;

    const now = this.ctx.currentTime;
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

  // Rapid cascading coin hopper clatter
  public playCoinCascade(coins: number = 8) {
    this.initContext();
    if (!this.ctx || this.isMuted) return;

    for (let i = 0; i < Math.min(25, coins); i++) {
      const delay = i * 0.045 + Math.random() * 0.015;
      const startTime = this.ctx.currentTime + delay;
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

  // Jackpot fanfare chord progression
  public playJackpotFanfare() {
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

  // Mechanical ratcheting slot pull lever sound
  public playLeverPull() {
    this.initContext();
    if (!this.ctx || this.isMuted) return;

    for (let i = 0; i < 4; i++) {
      const startTime = this.ctx.currentTime + i * 0.04;
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

    const clunkTime = this.ctx.currentTime + 0.17;
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

  // Crisp ceramic casino chip click
  public playChipClick() {
    this.initContext();
    if (!this.ctx || this.isMuted) return;

    const now = this.ctx.currentTime;
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
