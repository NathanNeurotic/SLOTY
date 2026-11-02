class SoundManager {
  private ctx: AudioContext | null = null;
  private isMuted: boolean = false;
  private volume: number = 0.7;

  constructor() {
    // AudioContext will be initialized on first user gesture
  }

  private initContext() {
    if (!this.ctx) {
      const AudioCtx = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      if (AudioCtx) {
        this.ctx = new AudioCtx();
      }
    }
    if (this.ctx && this.ctx.state === 'suspended') {
      this.ctx.resume();
    }
  }

  public setMuted(muted: boolean) {
    this.isMuted = muted;
  }

  public getIsMuted(): boolean {
    return this.isMuted;
  }

  public setVolume(vol: number) {
    this.volume = Math.max(0, Math.min(1, vol));
  }

  private createGainNode(duration: number, startVal: number = 1, endVal: number = 0.001): GainNode | null {
    if (!this.ctx || this.isMuted) return null;
    const gain = this.ctx.createGain();
    const now = this.ctx.currentTime;
    gain.gain.setValueAtTime(startVal * this.volume, now);
    gain.gain.exponentialRampToValueAtTime(Math.max(0.0001, endVal * this.volume), now + duration);
    gain.connect(this.ctx.destination);
    return gain;
  }

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

  public playReelStop(reelIndex: number = 0) {
    this.initContext();
    if (!this.ctx || this.isMuted) return;

    // Pitch increases for later reels: 160Hz up to 280Hz
    const baseFreq = 160 + reelIndex * 28;
    const now = this.ctx.currentTime;

    const osc = this.ctx.createOscillator();
    const gain = this.createGainNode(0.12, 0.5, 0.01);
    if (!gain) return;

    osc.type = 'triangle';
    osc.frequency.setValueAtTime(baseFreq * 1.5, now);
    osc.frequency.exponentialRampToValueAtTime(baseFreq * 0.7, now + 0.1);

    // Add low impact punch
    const subOsc = this.ctx.createOscillator();
    const subGain = this.ctx.createGain();
    subGain.gain.setValueAtTime(0.6 * this.volume, now);
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

  public playScatterLand(scatterIndex: number = 1) {
    this.initContext();
    if (!this.ctx || this.isMuted) return;

    const now = this.ctx.currentTime;
    const baseFreq = 587.33 * Math.pow(1.25, scatterIndex); // D5 ascending

    const osc = this.ctx.createOscillator();
    const gain = this.createGainNode(0.4, 0.5, 0.01);
    if (!gain) return;

    osc.type = 'sine';
    osc.frequency.setValueAtTime(baseFreq, now);
    osc.frequency.setValueAtTime(baseFreq * 1.5, now + 0.08);

    // Harmonic sparkle
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

  public playCoinTally() {
    this.initContext();
    if (!this.ctx || this.isMuted) return;

    const now = this.ctx.currentTime;
    const osc = this.ctx.createOscillator();
    const gain = this.createGainNode(0.04, 0.25, 0.01);
    if (!gain) return;

    // High frequency metallic ping
    osc.type = 'sine';
    const freq = 1200 + Math.random() * 400;
    osc.frequency.setValueAtTime(freq, now);

    osc.connect(gain);
    osc.start();
    osc.stop(now + 0.04);
  }

  public playWinChime(multiplier: number = 1) {
    this.initContext();
    if (!this.ctx || this.isMuted) return;

    // Pentatonic scale arpeggio: C5, E5, G5, A5, C6, E6
    const notes = [523.25, 659.25, 783.99, 880.0, 1046.5, 1318.51];
    const count = multiplier >= 20 ? 6 : multiplier >= 5 ? 4 : 3;

    notes.slice(0, count).forEach((freq, idx) => {
      if (!this.ctx) return;
      const startTime = this.ctx.currentTime + idx * 0.08;
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();

      gain.gain.setValueAtTime(0.35 * this.volume, startTime);
      gain.gain.exponentialRampToValueAtTime(0.001, startTime + 0.35);

      osc.type = 'sine';
      osc.frequency.setValueAtTime(freq, startTime);

      osc.connect(gain);
      gain.connect(this.ctx.destination);

      osc.start(startTime);
      osc.stop(startTime + 0.35);
    });
  }

  public playJackpotFanfare() {
    this.initContext();
    if (!this.ctx || this.isMuted) return;

    // Grand fanfare chord progression
    const chords = [
      [261.63, 329.63, 392.0], // C major
      [293.66, 369.99, 440.0], // D major
      [329.63, 415.3, 493.88], // E major
      [523.25, 659.25, 783.99, 1046.5], // High C triumph
    ];

    chords.forEach((chord, chordIdx) => {
      if (!this.ctx) return;
      const startTime = this.ctx.currentTime + chordIdx * 0.22;
      chord.forEach((freq) => {
        if (!this.ctx) return;
        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();

        const duration = chordIdx === chords.length - 1 ? 1.2 : 0.25;
        gain.gain.setValueAtTime(0.25 * this.volume, startTime);
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
}

export const soundManager = new SoundManager();
