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
  private ratchetBuffer: AudioBuffer | null = null;
  private activeGameTheme: 'vault-24k' | 'timber-critters' = 'vault-24k';

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
    // 16 bars of 16 steps each = 256 steps (33+ seconds per full musical loop)
    this.musicStep = (this.musicStep + 1) % 256;

    this.musicTimerId = window.setTimeout(() => {
      this.scheduleNextMusicBeat();
    }, stepIntervalMs);
  }

  private playMusicStep(step: number) {
    if (!this.ctx || this.isMuted || this.isMusicMutedState) return;
    if (this.activeGameTheme === 'timber-critters') {
      this.playWoodlandMusicStep(step);
      return;
    }
    const now = this.ctx.currentTime;
    const isOverdrive = this.isOverdriveMusic;
    const vol = this.musicVolume;
    const bar = Math.floor(step / 16); // 0 to 15
    const stepInBar = step % 16; // 0 to 15

    // 1. Kick Drum: Warm punchy 808/909 kick
    // Bars 0-14 groove: steps 0, 8 (or 4 on overdrive) + syncopations; Bar 15 turnaround fill
    const isKick =
      stepInBar === 0 ||
      stepInBar === 8 ||
      (isOverdrive && stepInBar % 4 === 0) ||
      (!isOverdrive && (bar % 2 === 1) && stepInBar === 14) ||
      (bar === 15 && (stepInBar === 10 || stepInBar === 12));

    if (isKick) {
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
    // Backbeat on steps 4 & 12; plus Bar 15 drum turnaround fill on steps 12, 14, 15
    const isSnare =
      stepInBar === 4 ||
      stepInBar === 12 ||
      (bar === 15 && (stepInBar === 10 || stepInBar === 14 || stepInBar === 15));

    if (isSnare) {
      const bufferSize = Math.floor(this.ctx.sampleRate * 0.12);
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
      const hatGain = this.ctx.createGain();
      const isAccent = stepInBar === 2 || stepInBar === 6 || stepInBar === 10 || stepInBar === 14;
      const hatVol = isAccent ? 0.22 : 0.12;

      hatGain.gain.setValueAtTime(hatVol * vol, now);
      hatGain.gain.exponentialRampToValueAtTime(0.001, now + (isAccent ? 0.07 : 0.04));

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

    // 4. Punchy Funk Walking Bassline (16-Bar 256-step harmonic journey)
    const funkBassline256 = [
      // Bars 0-1 (Cm9 establish): C2 - C2 - Eb2 - F2 - G2 - Bb2 - C2 - Eb2
      65.41, 0, 65.41, 0, 77.78, 0, 87.31, 0, 98.00, 0, 77.78, 0, 87.31, 98.00, 116.54, 0,
      65.41, 0, 77.78, 0, 87.31, 98.00, 110.00, 0, 98.00, 0, 87.31, 0, 77.78, 0, 65.41, 0,
      // Bars 2-3 (Fm9 -> G7#9): F2 - Ab2 - Bb2 - C3 - G2 - B2 - D3 - G2
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

    // 5. Velvet Electric Piano Chords across 16 bars (syncopated comping on downbeats & offbeats)
    if (stepInBar === 0 || stepInBar === 6 || stepInBar === 10) {
      let chordNotes: number[] = [];
      if (bar === 0 || bar === 1) {
        chordNotes = [261.63, 311.13, 392.00, 466.16, 587.33]; // Cm9 (C4, Eb4, G4, Bb4, D5)
      } else if (bar === 2) {
        chordNotes = [261.63, 311.13, 349.23, 415.30, 523.25]; // Fm9 (C4, Eb4, F4, Ab4, C5)
      } else if (bar === 3) {
        chordNotes = [246.94, 311.13, 392.00, 466.16, 587.33]; // G7#9 (B3, Eb4, G4, Bb4, D5)
      } else if (bar === 4 || bar === 5) {
        chordNotes = [261.63, 311.13, 392.00, 415.30, 523.25]; // Abmaj9 (C4, Eb4, G4, Ab4, C5)
      } else if (bar === 6) {
        chordNotes = [233.08, 293.66, 349.23, 440.00, 523.25]; // Bb13 (Bb3, D4, F4, A4, C5)
      } else if (bar === 7) {
        chordNotes = [261.63, 329.63, 392.00, 466.16, 554.37]; // C7b9 (C4, E4, G4, Bb4, Db5)
      } else if (bar === 8) {
        chordNotes = [293.66, 349.23, 415.30, 493.88, 587.33]; // Dm7b5 (D4, F4, Ab4, B4, D5)
      } else if (bar === 9) {
        chordNotes = [246.94, 311.13, 392.00, 415.30, 622.25]; // G7alt (B3, Eb4, G4, Ab4, Eb5)
      } else if (bar === 10) {
        chordNotes = [261.63, 311.13, 392.00, 466.16, 587.33]; // Cm9 (C4, Eb4, G4, Bb4, D5)
      } else if (bar === 11) {
        chordNotes = [220.00, 261.63, 311.13, 349.23, 440.00]; // F9 (A3, C4, Eb4, F4, A4)
      } else if (bar === 12) {
        chordNotes = [261.63, 311.13, 392.00, 466.16, 587.33]; // Ebmaj9 (C4, Eb4, G4, Bb4, D5)
      } else if (bar === 13) {
        chordNotes = [261.63, 311.13, 349.23, 415.30, 523.25]; // Fm9 (C4, Eb4, F4, Ab4, C5)
      } else if (bar === 14) {
        chordNotes = [261.63, 311.13, 415.30, 493.88, 523.25]; // Abmaj7 (C4, Eb4, Ab4, B4, C5)
      } else {
        chordNotes = [246.94, 311.13, 392.00, 466.16, 622.25]; // G7#9alt resolution
      }

      const isBeatStart = stepInBar === 0;
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

    // 6. Casino Vibraphone / Bell Melodic Cues across the 16 bars
    const vibraphonePitches: Record<number, number> = {
      2: 783.99,   // G5
      10: 932.33,  // Bb5
      18: 1046.50, // C6
      26: 1174.66, // D6
      42: 880.00,  // A5
      58: 987.77,  // B5
      66: 1046.50, // C6
      74: 1174.66, // D6
      82: 1244.51, // Eb6
      98: 932.33,  // Bb5
      106: 880.00, // A5
      122: 783.99, // G5
      138: 830.61, // Ab5
      154: 987.77, // B5
      170: 1046.50,// C6
      186: 1174.66,// D6
      202: 1244.51,// Eb6
      218: 1046.50,// C6
      234: 932.33, // Bb5
      242: 830.61, // Ab5
      246: 783.99, // G5
      250: 622.25, // Eb5
    };

    const bellPitch = vibraphonePitches[step];
    if (bellPitch) {
      const bellOsc = this.ctx.createOscillator();
      const bellGain = this.ctx.createGain();
      bellGain.gain.setValueAtTime(0.18 * vol, now);
      bellGain.gain.exponentialRampToValueAtTime(0.0001, now + 0.42);

      bellOsc.type = 'sine';
      bellOsc.frequency.setValueAtTime(bellPitch, now);

      bellOsc.connect(bellGain);
      bellGain.connect(this.ctx.destination);
      bellOsc.start(now);
      bellOsc.stop(now + 0.44);
    }
  }

  // =========================================================================
  // --- PROCEDURAL ACOUSTIC WOODLAND BLUEGRASS & FOLK SYNTHESIZER ---
  // =========================================================================

  private playWoodlandMusicStep(step: number) {
    if (!this.ctx || this.isMuted || this.isMusicMutedState) return;
    const now = this.ctx.currentTime;
    const isOverdrive = this.isOverdriveMusic;
    const vol = this.musicVolume;
    const bar = Math.floor(step / 16); // 0 to 15
    const stepInBar = step % 16; // 0 to 15

    // 1. Organic Log Stomp / Acoustic Bass Drum
    if (stepInBar === 0 || stepInBar === 8 || (isOverdrive && stepInBar % 4 === 0)) {
      const kickOsc = this.ctx.createOscillator();
      const kickGain = this.ctx.createGain();
      kickGain.gain.setValueAtTime(0.48 * vol, now);
      kickGain.gain.exponentialRampToValueAtTime(0.001, now + (isOverdrive ? 0.15 : 0.20));

      kickOsc.type = 'triangle';
      kickOsc.frequency.setValueAtTime(90, now);
      kickOsc.frequency.exponentialRampToValueAtTime(32, now + 0.14);

      kickOsc.connect(kickGain);
      kickGain.connect(this.ctx.destination);
      kickOsc.start(now);
      kickOsc.stop(now + 0.22);
    }

    // 2. Resonant Carved Cedar Woodblock Knock
    // Steps 4, 12; plus Bar 15 hoedown turnaround roll
    const isWoodblock =
      stepInBar === 4 ||
      stepInBar === 12 ||
      (bar === 15 && (stepInBar === 8 || stepInBar === 10 || stepInBar === 14 || stepInBar === 15));

    if (isWoodblock) {
      const blockOsc = this.ctx.createOscillator();
      const blockGain = this.ctx.createGain();
      blockGain.gain.setValueAtTime(0.55 * vol, now);
      blockGain.gain.exponentialRampToValueAtTime(0.001, now + 0.08);

      blockOsc.type = 'triangle';
      blockOsc.frequency.setValueAtTime(680 + (stepInBar % 3) * 60, now);
      blockOsc.frequency.exponentialRampToValueAtTime(340, now + 0.07);

      blockOsc.connect(blockGain);
      blockGain.connect(this.ctx.destination);
      blockOsc.start(now);
      blockOsc.stop(now + 0.09);
    }

    // 3. Dried Seed Pod Shaker / Rustling Leaves (16th-note swing)
    if (step % 2 === 1) {
      const rustleOsc = this.ctx.createOscillator();
      const rustleGain = this.ctx.createGain();
      const isAccent = stepInBar === 4 || stepInBar === 12;
      rustleGain.gain.setValueAtTime((isAccent ? 0.18 : 0.10) * vol, now);
      rustleGain.gain.exponentialRampToValueAtTime(0.001, now + 0.05);

      rustleOsc.type = 'square';
      rustleOsc.frequency.setValueAtTime(7400 + (step % 3) * 400, now);

      const filter = this.ctx.createBiquadFilter();
      filter.type = 'highpass';
      filter.frequency.setValueAtTime(5500, now);

      rustleOsc.connect(filter);
      filter.connect(rustleGain);
      rustleGain.connect(this.ctx.destination);
      rustleOsc.start(now);
      rustleOsc.stop(now + 0.06);
    }

    // 4. Plucked Acoustic Upright Double Bass (16-Bar 256-step Country Bluegrass Walking Bass)
    const woodlandBass256 = [
      // Bars 0-1 (G major): G2 -> D3 -> G2 -> B2
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
      bassGain.gain.setValueAtTime(0.42 * vol, now);
      bassGain.gain.exponentialRampToValueAtTime(0.001, now + 0.24);

      bassOsc.type = 'triangle';
      bassOsc.frequency.setValueAtTime(bassPitch, now);

      const bassFilter = this.ctx.createBiquadFilter();
      bassFilter.type = 'lowpass';
      bassFilter.frequency.setValueAtTime(450, now);
      bassFilter.frequency.exponentialRampToValueAtTime(110, now + 0.2);

      bassOsc.connect(bassFilter);
      bassFilter.connect(bassGain);
      bassGain.connect(this.ctx.destination);
      bassOsc.start(now);
      bassOsc.stop(now + 0.25);
    }

    // 5. Plucked Bluegrass Banjo / Folk Dulcimer 16-bar Arpeggios (Scruggs-Style Rolls)
    const banjoChordsByBar = [
      [392.00, 493.88, 587.33, 783.99], // Bar 0: G
      [392.00, 493.88, 587.33, 880.00], // Bar 1: G6
      [523.25, 659.25, 783.99, 1046.5], // Bar 2: C
      [587.33, 739.99, 880.00, 1174.6], // Bar 3: D7
      [659.25, 783.99, 987.77, 1318.5], // Bar 4: Em
      [493.88, 587.33, 739.99, 987.77], // Bar 5: Bm
      [523.25, 659.25, 783.99, 1046.5], // Bar 6: C
      [587.33, 739.99, 880.00, 1174.6], // Bar 7: D
      [440.00, 523.25, 659.25, 880.00], // Bar 8: Am
      [587.33, 739.99, 880.00, 1174.6], // Bar 9: D7
      [392.00, 493.88, 587.33, 783.99], // Bar 10: G
      [659.25, 783.99, 987.77, 1318.5], // Bar 11: Em
      [523.25, 659.25, 783.99, 1046.5], // Bar 12: C
      [493.88, 587.33, 783.99, 987.77], // Bar 13: G/B
      [440.00, 523.25, 659.25, 880.00], // Bar 14: Am7
      [587.33, 739.99, 880.00, 1174.6], // Bar 15: D7 Turnaround
    ];

    const currentBarPitches = banjoChordsByBar[bar] || banjoChordsByBar[0];
    const rollPattern = [0, 1, 2, 3, 2, 1, 0, 2, 1, 3, 2, 1, 0, 1, 2, 3];
    const noteIdx = rollPattern[stepInBar];
    const banjoPitch = currentBarPitches[noteIdx];

    if (banjoPitch) {
      const banjoOsc = this.ctx.createOscillator();
      const banjoGain = this.ctx.createGain();
      banjoGain.gain.setValueAtTime(0.24 * vol, now);
      banjoGain.gain.exponentialRampToValueAtTime(0.0001, now + 0.16);

      banjoOsc.type = 'triangle';
      banjoOsc.frequency.setValueAtTime(banjoPitch, now);

      banjoOsc.connect(banjoGain);
      banjoGain.connect(this.ctx.destination);
      banjoOsc.start(now);
      banjoOsc.stop(now + 0.18);
    }

    // 6. Whimsical Forest Cedar Wood Flute Melody (Sings lyrical phrases in Bars 4-12)
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
      fluteGain.gain.setValueAtTime(0.22 * vol, now);
      fluteGain.gain.exponentialRampToValueAtTime(0.001, now + 0.55);

      fluteOsc.type = 'sine';
      fluteOsc.frequency.setValueAtTime(flutePitch, now);
      fluteOsc.frequency.exponentialRampToValueAtTime(flutePitch * 1.02, now + 0.25);
      fluteOsc.frequency.exponentialRampToValueAtTime(flutePitch, now + 0.5);

      fluteOsc.connect(fluteGain);
      fluteGain.connect(this.ctx.destination);
      fluteOsc.start(now);
      fluteOsc.stop(now + 0.58);
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

  // Low error / invalid action buzzer
  public playError() {
    this.initContext();
    if (!this.ctx || this.isMuted) return;
    const now = this.ctx.currentTime;
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

  // Spin start: punchy casino excitation chord + pneumatic hiss, or crispy woodland twig snap
  public playSpinStart() {
    this.initContext();
    if (!this.ctx || this.isMuted) return;

    if (this.activeGameTheme === 'timber-critters') {
      this.playTwigSnap();
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

    // Classic VLT ascending arpeggio notes (bright pentatonic chime sequence)
    const vaultRollNotes = isFever
      ? [587.33, 659.25, 783.99, 880.0, 1046.5, 1174.66, 1318.51, 1567.98]
      : [523.25, 587.33, 659.25, 783.99, 880.0, 1046.5, 1174.66, 1318.51];

    // Timberland pentatonic G-major marimba / banjo notes
    const timberRollNotes = isFever
      ? [440.0, 493.88, 587.33, 659.25, 783.99, 880.0, 987.77, 1174.66]
      : [392.0, 440.0, 493.88, 587.33, 659.25, 783.99, 880.0, 987.77];

    const rollNotes = isTimber ? timberRollNotes : vaultRollNotes;
    const stepIntervalMs = isFever ? 48 : 58;

    const playRollTick = () => {
      if (!this.isSpinRolling || !this.ctx || this.isMuted) return;

      const now = this.ctx.currentTime;
      const step = this.spinRollStep;

      // 1. Ticking percussion: Woodpecker/woodblock for Timberland, ratchet for Vault
      if (isTimber) {
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

      // 2. Melodic Pitch Pulse: Marimba / Banjo for Timberland, Casino Synth for Vault
      const pitch = this.isAnticipationRolling
        ? isTimber
          ? 783.99 + (step % 8) * 110 // Suspenseful climbing owl whistle
          : 880 + (step % 8) * 140   // High suspense climbing ladder
        : rollNotes[step % rollNotes.length];

      const toneOsc = this.ctx.createOscillator();
      const toneGain = this.ctx.createGain();
      const toneVol = this.isAnticipationRolling ? 0.35 : isTimber ? 0.28 : 0.24;

      toneGain.gain.setValueAtTime(toneVol * this.sfxVolume, now);
      toneGain.gain.exponentialRampToValueAtTime(0.0001, now + (this.isAnticipationRolling ? 0.12 : 0.08));

      toneOsc.type = isTimber ? 'triangle' : this.isAnticipationRolling ? 'sawtooth' : 'triangle';
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

  public setGameTheme(theme: 'vault-24k' | 'timber-critters') {
    this.activeGameTheme = theme;
  }

  public getGameTheme(): 'vault-24k' | 'timber-critters' {
    return this.activeGameTheme;
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

  // Heavy tactile physical reel stop (bass punch + spring latch clack)
  public playReelStop(reelIndex: number = 0) {
    if (this.activeGameTheme === 'timber-critters') {
      this.playTimberStop(reelIndex);
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
    if (this.activeGameTheme === 'timber-critters') {
      this.playOwlHoot(scatterIndex);
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
    if (this.activeGameTheme === 'timber-critters') {
      this.playForestWin(multiplier);
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

  // Jackpot fanfare chord progression
  public playJackpotFanfare() {
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
