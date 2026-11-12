// Procedural Playful Space Background Music & Audio Engine — Web Audio API
// Generates whimsical, cosmic, playful space synth music that plays all over the game.
// Completely self-contained: zero external audio assets required, zero latency, 100% offline.

export type MusicMode = 'normal' | 'fly' | 'alarm' | 'calm';

class SpaceMusicEngine {
  private ctx: AudioContext | null = null;
  private masterGain: GainNode | null = null;
  private musicGain: GainNode | null = null;
  private filter: BiquadFilterNode | null = null;
  private isPlaying = false;
  private isMuted = false;
  private timerId: number | null = null;
  private currentStep = 0;
  private mode: MusicMode = 'normal';
  private listeners: Set<(playing: boolean, muted: boolean) => void> = new Set();

  // Musical Scale: C Lydian / C Major Pentatonic (bright, playful, cosmic, dreamy)
  // [C4, D4, E4, F#4, G4, A4, B4, C5, D5, E5, G5, A5, C6]
  private readonly notes = {
    C3: 130.81,
    E3: 164.81,
    F3: 174.61,
    G3: 196.0,
    A3: 220.0,
    B3: 246.94,
    C4: 261.63,
    D4: 293.66,
    E4: 329.63,
    Fs4: 369.99,
    G4: 392.0,
    A4: 440.0,
    B4: 493.88,
    C5: 523.25,
    D5: 587.33,
    E5: 659.25,
    G5: 783.99,
    A5: 880.0,
    C6: 1046.5,
  };

  // 16-step melody pattern (repeating with variations)
  private readonly melodyPattern = [
    'C4', 'E4', 'G4', 'C5',
    'B4', 'G4', 'E4', 'D4',
    'E4', 'G4', 'A4', 'C5',
    'D5', 'C5', 'G4', 'E4',
    'F3', 'A3', 'C4', 'E4',
    'G4', 'E4', 'D4', 'C4',
    'G3', 'B3', 'D4', 'G4',
    'A4', 'B4', 'C5', 'E5',
  ];

  // Playful bouncy bass pattern (root & fifth)
  private readonly bassPattern = [
    'C3', null, 'G3', null,
    'C3', null, 'E3', null,
    'A3', null, 'E3', null,
    'A3', null, 'G3', null,
    'F3', null, 'C3', null,
    'F3', null, 'A3', null,
    'G3', null, 'D4', null,
    'G3', null, 'B3', null,
  ];

  constructor() {
    if (typeof window !== 'undefined') {
      // Check stored preference (default: sound enabled)
      let storedMute: string | null = null;
      try {
        if (typeof localStorage !== 'undefined') {
          storedMute = localStorage.getItem('crewready_music_muted');
        }
      } catch {
        /* ignore */
      }
      this.isMuted = storedMute === 'true';

      // Attach interaction listener to resume AudioContext upon first touch
      const unlockAudio = () => {
        if (!this.ctx) {
          this.init();
        }
        if (this.ctx && this.ctx.state === 'suspended') {
          this.ctx.resume();
        }
        if (!this.isPlaying && !this.isMuted) {
          this.play();
        }
      };

      ['pointerdown', 'keydown', 'touchstart'].forEach((event) => {
        window.addEventListener(event, unlockAudio, { once: true, passive: true });
      });

      // Pause when tab is hidden, resume when visible
      document.addEventListener('visibilitychange', () => {
        if (document.hidden) {
          if (this.ctx && this.ctx.state === 'running') {
            this.ctx.suspend();
          }
        } else {
          if (this.ctx && this.ctx.state === 'suspended' && this.isPlaying && !this.isMuted) {
            this.ctx.resume();
          }
        }
      });
    }
  }

  private init() {
    if (this.ctx) return;
    try {
      const AudioCtx = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      if (!AudioCtx) return;
      this.ctx = new AudioCtx();

      // Master low-pass filter gives that warm retro-space charm
      this.filter = this.ctx.createBiquadFilter();
      this.filter.type = 'lowpass';
      this.filter.frequency.setValueAtTime(2600, this.ctx.currentTime);
      this.filter.Q.setValueAtTime(1.2, this.ctx.currentTime);

      // Music gain node (boosted for clearer, louder audibility)
      this.musicGain = this.ctx.createGain();
      this.musicGain.gain.setValueAtTime(this.isMuted ? 0 : 0.38, this.ctx.currentTime);

      // Master output gain
      this.masterGain = this.ctx.createGain();
      this.masterGain.gain.setValueAtTime(1.0, this.ctx.currentTime);

      this.musicGain.connect(this.filter);
      this.filter.connect(this.masterGain);
      this.masterGain.connect(this.ctx.destination);
    } catch {
      // Web Audio not supported or blocked
    }
  }

  public subscribe(fn: (playing: boolean, muted: boolean) => void): () => void {
    this.listeners.add(fn);
    fn(this.isPlaying, this.isMuted);
    return () => this.listeners.delete(fn);
  }

  private notify() {
    for (const fn of this.listeners) {
      fn(this.isPlaying, this.isMuted);
    }
  }

  public setMode(mode: MusicMode) {
    this.mode = mode;
    if (this.filter && this.ctx) {
      const now = this.ctx.currentTime;
      if (mode === 'fly') {
        this.filter.frequency.linearRampToValueAtTime(3800, now + 0.3);
      } else if (mode === 'alarm') {
        this.filter.frequency.linearRampToValueAtTime(2200, now + 0.3);
      } else {
        this.filter.frequency.linearRampToValueAtTime(2600, now + 0.3);
      }
    }
  }

  public toggleMute(): boolean {
    this.isMuted = !this.isMuted;
    try {
      localStorage.setItem('crewready_music_muted', String(this.isMuted));
    } catch {
      /* ignore */
    }

    if (this.musicGain && this.ctx) {
      const now = this.ctx.currentTime;
      if (this.isMuted) {
        this.musicGain.gain.linearRampToValueAtTime(0, now + 0.2);
      } else {
        this.musicGain.gain.linearRampToValueAtTime(0.38, now + 0.2);
        if (!this.isPlaying) {
          this.play();
        }
      }
    } else if (!this.isMuted) {
      this.play();
    }

    this.notify();
    return this.isMuted;
  }

  public getMuted(): boolean {
    return this.isMuted;
  }

  public getPlaying(): boolean {
    return this.isPlaying;
  }

  public play() {
    if (this.isPlaying) return;
    this.init();
    if (!this.ctx) return;

    if (this.ctx.state === 'suspended') {
      this.ctx.resume();
    }

    this.isPlaying = true;
    this.currentStep = 0;
    this.scheduleTick();
    this.notify();
  }

  public pause() {
    if (!this.isPlaying) return;
    this.isPlaying = false;
    if (this.timerId !== null) {
      clearTimeout(this.timerId);
      this.timerId = null;
    }
    this.notify();
  }

  private scheduleTick() {
    if (!this.isPlaying || !this.ctx) return;

    // Tempo: fly mode = 132 BPM, normal = 114 BPM, calm = 96 BPM
    const bpm = this.mode === 'fly' ? 132 : this.mode === 'calm' ? 96 : 114;
    const stepDuration = (60 / bpm) / 2; // 16th note steps in seconds

    this.playStep(this.currentStep);
    this.currentStep = (this.currentStep + 1) % 32;

    this.timerId = window.setTimeout(() => {
      this.scheduleTick();
    }, stepDuration * 1000);
  }

  /** Synthesizes the voices for this musical beat step */
  private playStep(step: number) {
    if (!this.ctx || !this.musicGain || this.isMuted) return;
    const now = this.ctx.currentTime;

    // 1. Playful Star Chime / Melody Voice
    const noteName = this.melodyPattern[step % this.melodyPattern.length] as keyof typeof this.notes;
    if (noteName && this.notes[noteName]) {
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();

      // Soft triangle/sine blend for sweet cosmic sparkle
      osc.type = step % 4 === 0 ? 'triangle' : 'sine';
      osc.frequency.setValueAtTime(this.notes[noteName], now);

      // Slightly detune for warm chorus effect
      osc.detune.setValueAtTime(step % 2 === 0 ? 3 : -3, now);

      const noteVol = this.mode === 'fly' ? 0.26 : 0.22;
      gain.gain.setValueAtTime(0, now);
      gain.gain.linearRampToValueAtTime(noteVol, now + 0.015);
      gain.gain.exponentialRampToValueAtTime(0.0001, now + (this.mode === 'fly' ? 0.22 : 0.32));

      osc.connect(gain);
      gain.connect(this.musicGain);

      osc.start(now);
      osc.stop(now + 0.35);
    }

    // 2. Playful Bouncing Bassline (on alternate steps)
    const bassNote = this.bassPattern[step % this.bassPattern.length] as keyof typeof this.notes | null;
    if (bassNote && this.notes[bassNote]) {
      const bOsc = this.ctx.createOscillator();
      const bGain = this.ctx.createGain();

      bOsc.type = 'triangle';
      bOsc.frequency.setValueAtTime(this.notes[bassNote], now);

      bGain.gain.setValueAtTime(0, now);
      bGain.gain.linearRampToValueAtTime(0.28, now + 0.02);
      bGain.gain.exponentialRampToValueAtTime(0.0001, now + 0.3);

      bOsc.connect(bGain);
      bGain.connect(this.musicGain);

      bOsc.start(now);
      bOsc.stop(now + 0.35);
    }

    // 3. Gentle Cosmic Ambient Pad (every 8 steps = on downbeats)
    if (step % 8 === 0) {
      const chordRoots = [this.notes.C4, this.notes.A3, this.notes.F3, this.notes.G3];
      const chordIdx = Math.floor(step / 8) % chordRoots.length;
      const root = chordRoots[chordIdx];

      // Two warm detuned pad oscillators
      [root, root * 1.5, root * 1.25].forEach((freq, i) => {
        if (!this.ctx || !this.musicGain) return;
        const padOsc = this.ctx.createOscillator();
        const padGain = this.ctx.createGain();

        padOsc.type = 'sine';
        padOsc.frequency.setValueAtTime(freq, now);
        padOsc.detune.setValueAtTime(i === 0 ? 5 : -5, now);

        padGain.gain.setValueAtTime(0, now);
        padGain.gain.linearRampToValueAtTime(0.07, now + 0.35);
        padGain.gain.linearRampToValueAtTime(0.0001, now + 1.2);

        padOsc.connect(padGain);
        padGain.connect(this.musicGain);

        padOsc.start(now);
        padOsc.stop(now + 1.25);
      });
    }

    // 4. Subtle Cosmic Hi-Hat / Star Shimmer (faster rhythm in fly mode)
    if (this.mode === 'fly' || step % 4 === 2) {
      const shimmer = this.ctx.createOscillator();
      const sGain = this.ctx.createGain();
      shimmer.type = 'sine';
      shimmer.frequency.setValueAtTime(this.mode === 'fly' ? 1400 : 900, now);

      sGain.gain.setValueAtTime(0.04, now);
      sGain.gain.exponentialRampToValueAtTime(0.0001, now + 0.05);

      shimmer.connect(sGain);
      sGain.connect(this.musicGain);

      shimmer.start(now);
      shimmer.stop(now + 0.06);
    }
  }
}

// Global Singleton Music Engine
export const spaceMusic = new SpaceMusicEngine();
