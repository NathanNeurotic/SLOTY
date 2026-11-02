class SoundManager {
  private ctx: AudioContext | null = null;
  private isMuted: boolean = false;
  private isMusicMutedState: boolean = false;
  private sfxVolume: number = 0.7;
  private musicVolume: number = 0.35;

  // Background Music Sequencer State
  private isMusicPlayingState: boolean = false;
  private musicStep: number = 0;
  private musicTimerId: number | null = null;
  private musicTempo: number = 114; // BPM for Vegas Lounge Funk
  private isOverdriveMusic: boolean = false;

  constructor() {
    // AudioContext will be initialized on first user gesture
  }

  private initContext() {
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

  // --- Volume & Mute Controls ---

  public setMuted(muted: boolean) {
    this.isMuted = muted;
    if (muted && this.isMusicPlayingState) {
      this.stopMusic();
    }
  }

  public getIsMuted(): boolean {
    return this.isMuted;
  }

  public setMusicMuted(muted: boolean) {
    this.isMusicMutedState = muted;
    if (muted) {
      this.stopMusic();
    } else {
      this.startMusic();
    }
  }

  public getIsMusicMuted(): boolean {
    return this.isMusicMutedState;
  }

  public setVolume(vol: number) {
    this.sfxVolume = Math.max(0, Math.min(1, vol));
  }

  public setMusicVolume(vol: number) {
    this.musicVolume = Math.max(0, Math.min(1, vol));
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
    if (!this.ctx || this.isMuted || this.isMusicMutedState) return;

    this.isOverdriveMusic = overdrive;
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
    return this.isMusicPlayingState;
  }

  public setOverdriveMusic(overdrive: boolean) {
    this.isOverdriveMusic = overdrive;
    this.musicTempo = overdrive ? 128 : 114;
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

    // 1. Kick & Snare / Rimshot
    if (step % 8 === 0) {
      // Warm lounge kick drum
      const kickOsc = this.ctx.createOscillator();
      const kickGain = this.ctx.createGain();
      kickGain.gain.setValueAtTime(0.28 * this.musicVolume, now);
      kickGain.gain.exponentialRampToValueAtTime(0.001, now + 0.12);
      kickOsc.frequency.setValueAtTime(isOverdrive ? 130 : 100, now);
      kickOsc.frequency.exponentialRampToValueAtTime(35, now + 0.1);
      kickOsc.connect(kickGain);
      kickGain.connect(this.ctx.destination);
      kickOsc.start(now);
      kickOsc.stop(now + 0.12);
    } else if (step % 8 === 4) {
      // Snare / Shaker click
      const snareOsc = this.ctx.createOscillator();
      const snareGain = this.ctx.createGain();
      snareGain.gain.setValueAtTime(0.14 * this.musicVolume, now);
      snareGain.gain.exponentialRampToValueAtTime(0.001, now + 0.08);
      snareOsc.type = 'triangle';
      snareOsc.frequency.setValueAtTime(320, now);
      snareOsc.frequency.exponentialRampToValueAtTime(120, now + 0.07);
      snareOsc.connect(snareGain);
      snareGain.connect(this.ctx.destination);
      snareOsc.start(now);
      snareOsc.stop(now + 0.08);
    }

    // 2. Closed Hi-Hat Pulse on 16th notes
    if (step % 2 === 0) {
      const hatOsc = this.ctx.createOscillator();
      const hatGain = this.ctx.createGain();
      const hatVol = step % 4 === 2 ? 0.08 : 0.04;
      hatGain.gain.setValueAtTime(hatVol * this.musicVolume, now);
      hatGain.gain.exponentialRampToValueAtTime(0.001, now + 0.03);
      hatOsc.type = 'sine';
      hatOsc.frequency.setValueAtTime(7500, now);
      hatOsc.connect(hatGain);
      hatGain.connect(this.ctx.destination);
      hatOsc.start(now);
      hatOsc.stop(now + 0.035);
    }

    // 3. Funky Bassline (F / G / C / A minor groove)
    const bassline = [
      65.41, 65.41, 0, 77.78, 65.41, 0, 87.31, 0, // C2 - D#2 - F2
      58.27, 58.27, 0, 69.3, 58.27, 0, 87.31, 0,  // A#1 - C#2 - F2
      55.0, 55.0, 0, 65.41, 55.0, 0, 73.42, 0,    // A1 - C2 - D2
      65.41, 0, 73.42, 0, 87.31, 0, 98.0, 130.81,  // C2 - D2 - F2 - G2 - C3
    ];

    const bassFreq = bassline[step];
    if (bassFreq > 0) {
      const bassOsc = this.ctx.createOscillator();
      const bassGain = this.ctx.createGain();
      bassGain.gain.setValueAtTime((isOverdrive ? 0.28 : 0.22) * this.musicVolume, now);
      bassGain.gain.exponentialRampToValueAtTime(0.001, now + 0.18);
      bassOsc.type = isOverdrive ? 'sawtooth' : 'triangle';
      bassOsc.frequency.setValueAtTime(bassFreq, now);

      // Lowpass filter for smooth round bass
      const filter = this.ctx.createBiquadFilter();
      filter.type = 'lowpass';
      filter.frequency.setValueAtTime(isOverdrive ? 650 : 380, now);

      bassOsc.connect(filter);
      filter.connect(bassGain);
      bassGain.connect(this.ctx.destination);
      bassOsc.start(now);
      bassOsc.stop(now + 0.2);
    }

    // 4. Velvet Electric Piano Chords on beat 0 and 16
    if (step === 0 || step === 16) {
      const chord = step === 0 ? [261.63, 329.63, 392.0, 493.88] : [220.0, 261.63, 329.63, 392.0]; // Cmaj7 or Am7
      chord.forEach((note) => {
        if (!this.ctx) return;
        const chordOsc = this.ctx.createOscillator();
        const chordGain = this.ctx.createGain();
        chordGain.gain.setValueAtTime(0.06 * this.musicVolume, now);
        chordGain.gain.exponentialRampToValueAtTime(0.0001, now + 1.2);
        chordOsc.type = 'sine';
        chordOsc.frequency.setValueAtTime(note, now);
        chordOsc.connect(chordGain);
        chordGain.connect(this.ctx.destination);
        chordOsc.start(now);
        chordOsc.stop(now + 1.25);
      });
    }
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

  // Spin start
  public playSpinStart() {
    this.initContext();
    if (!this.ctx || this.isMuted) return;

    const osc = this.ctx.createOscillator();
    const gain = this.createGainNode(0.2, 0.4, 0.01);
    if (!gain) return;

    osc.type = 'sine';
    osc.frequency.setValueAtTime(120, this.ctx.currentTime);
    osc.frequency.exponentialRampToValueAtTime(360, this.ctx.currentTime + 0.18);

    osc.connect(gain);
    osc.start();
    osc.stop(this.ctx.currentTime + 0.2);
  }

  // Reel stop
  public playReelStop(reelIndex: number = 0) {
    this.initContext();
    if (!this.ctx || this.isMuted) return;

    const baseFreq = 160 + reelIndex * 28;
    const now = this.ctx.currentTime;

    const osc = this.ctx.createOscillator();
    const gain = this.createGainNode(0.12, 0.5, 0.01);
    if (!gain) return;

    osc.type = 'triangle';
    osc.frequency.setValueAtTime(baseFreq * 1.5, now);
    osc.frequency.exponentialRampToValueAtTime(baseFreq * 0.7, now + 0.1);

    const subOsc = this.ctx.createOscillator();
    const subGain = this.ctx.createGain();
    subGain.gain.setValueAtTime(0.6 * this.sfxVolume, now);
    subGain.gain.exponentialRampToValueAtTime(0.01, now + 0.08);

    subOsc.type = 'sine';
    subOsc.frequency.setValueAtTime(80, now);
    subOsc.frequency.exponentialRampToValueAtTime(30, now + 0.08);

    osc.connect(gain);
    subOsc.connect(subGain);
    subGain.connect(this.ctx.destination);

    osc.start();
    subOsc.start();
    osc.stop(now + 0.12);
    subOsc.stop(now + 0.08);
  }

  // Scatter landing
  public playScatterLand(scatterIndex: number = 1) {
    this.initContext();
    if (!this.ctx || this.isMuted) return;

    const now = this.ctx.currentTime;
    const baseFreq = 587.33 * Math.pow(1.25, scatterIndex);

    const osc = this.ctx.createOscillator();
    const gain = this.createGainNode(0.4, 0.5, 0.01);
    if (!gain) return;

    osc.type = 'sine';
    osc.frequency.setValueAtTime(baseFreq, now);
    osc.frequency.setValueAtTime(baseFreq * 1.5, now + 0.08);

    const harmOsc = this.ctx.createOscillator();
    harmOsc.type = 'triangle';
    harmOsc.frequency.setValueAtTime(baseFreq * 2.5, now);

    osc.connect(gain);
    harmOsc.connect(gain);

    osc.start();
    harmOsc.start();
    osc.stop(now + 0.4);
    harmOsc.stop(now + 0.4);
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

  // Voice synthesizer casino announcement
  public speakAnnouncement(phrase: string) {
    this.speakAnnouncer(phrase);
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
