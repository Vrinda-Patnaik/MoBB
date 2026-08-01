// Web Audio API Sound Synthesizer for MuseumOS
// Provides soft, professional, low-volume museum sound effects and ambient soundscapes.

let audioCtx: AudioContext | null = null;
let ambienceNode: { stop: () => void; setVolume: (v: number) => void } | null = null;

// Sound settings from localStorage
const SOUND_KEY = 'museum_sound_enabled';
const AMBIENCE_KEY = 'museum_ambience_enabled';

export function isSoundEnabled(): boolean {
  if (typeof window === 'undefined') return false;
  try {
    const stored = localStorage.getItem(SOUND_KEY);
    return stored !== null ? stored === 'true' : true;
  } catch {
    return true;
  }
}

export function setSoundEnabled(enabled: boolean): void {
  if (typeof window === 'undefined') return;
  try {
    localStorage.setItem(SOUND_KEY, enabled ? 'true' : 'false');
  } catch {}
  if (!enabled) {
    stopAmbienceSound();
  } else {
    startAmbienceSound();
  }
}

export function isAmbienceEnabled(): boolean {
  if (typeof window === 'undefined') return false;
  try {
    const stored = localStorage.getItem(AMBIENCE_KEY);
    return stored !== null ? stored === 'true' : true;
  } catch {
    return true;
  }
}

export function setAmbienceEnabled(enabled: boolean): void {
  if (typeof window === 'undefined') return;
  try {
    localStorage.setItem(AMBIENCE_KEY, enabled ? 'true' : 'false');
  } catch {}
  if (!enabled) {
    stopAmbienceSound();
  } else if (isSoundEnabled()) {
    startAmbienceSound();
  }
}

function getAudioContext(): AudioContext | null {
  if (typeof window === 'undefined') return null;
  try {
    if (!audioCtx || audioCtx.state === 'closed') {
      const AudioContextClass = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      if (AudioContextClass) {
        audioCtx = new AudioContextClass();
      }
    }
    if (audioCtx && audioCtx.state === 'suspended') {
      audioCtx.resume().catch(() => {});
    }
    return audioCtx;
  } catch {
    return null;
  }
}

/**
 * Playful synthesized duck quack sound effect
 */
export function playQuackSound(freq = 380): void {
  if (!isSoundEnabled()) return;
  const ctx = getAudioContext();
  if (!ctx) return;

  try {
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();

    osc.type = 'sawtooth';
    osc.frequency.setValueAtTime(freq, ctx.currentTime);
    osc.frequency.exponentialRampToValueAtTime(freq / 2, ctx.currentTime + 0.2);

    gain.gain.setValueAtTime(0.12, ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.2);

    osc.connect(gain);
    gain.connect(ctx.destination);

    osc.start();
    osc.stop(ctx.currentTime + 0.2);
  } catch {
    // Ignore audio context errors
  }
}

/**
 * Subtle tactile button click sound
 */
export function playClickSound(): void {
  if (!isSoundEnabled()) return;
  const ctx = getAudioContext();
  if (!ctx) return;

  try {
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();

    // Short soft sine drop
    osc.type = 'sine';
    osc.frequency.setValueAtTime(320, ctx.currentTime);
    osc.frequency.exponentialRampToValueAtTime(140, ctx.currentTime + 0.035);

    // Subtle gain envelope (max 0.04 - very gentle)
    gain.gain.setValueAtTime(0.04, ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.035);

    osc.connect(gain);
    gain.connect(ctx.destination);

    osc.start();
    osc.stop(ctx.currentTime + 0.04);
  } catch {
    // Ignore audio context errors
  }
}

/**
 * Soft, resonant glass/marimba chime when opening an artifact or modal
 */
export function playArtifactOpenSound(): void {
  if (!isSoundEnabled()) return;
  const ctx = getAudioContext();
  if (!ctx) return;

  try {
    const now = ctx.currentTime;
    
    // Primary fundamental tone + overtone
    const freqs = [523.25, 783.99, 1046.50]; // C5, G5, C6 notes
    freqs.forEach((freq, idx) => {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();

      osc.type = 'sine';
      osc.frequency.setValueAtTime(freq, now + idx * 0.02);

      const maxGain = idx === 0 ? 0.05 : 0.025;
      gain.gain.setValueAtTime(0.001, now + idx * 0.02);
      gain.gain.linearRampToValueAtTime(maxGain, now + idx * 0.02 + 0.02);
      gain.gain.exponentialRampToValueAtTime(0.0001, now + idx * 0.02 + 0.35);

      osc.connect(gain);
      gain.connect(ctx.destination);

      osc.start(now + idx * 0.02);
      osc.stop(now + idx * 0.02 + 0.38);
    });
  } catch {
    // Ignore audio context errors
  }
}

/**
 * Uplifting, elegant 3-note harmonic arpeggio for achievement unlock
 */
export function playAchievementSound(): void {
  if (!isSoundEnabled()) return;
  const ctx = getAudioContext();
  if (!ctx) return;

  try {
    const now = ctx.currentTime;
    // Arpeggio notes: F5, A5, C6, F6
    const notes = [698.46, 880.00, 1046.50, 1396.91];

    notes.forEach((freq, i) => {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();

      osc.type = i === 3 ? 'triangle' : 'sine';
      osc.frequency.setValueAtTime(freq, now + i * 0.07);

      const maxGain = i === 3 ? 0.06 : 0.04;
      gain.gain.setValueAtTime(0.001, now + i * 0.07);
      gain.gain.linearRampToValueAtTime(maxGain, now + i * 0.07 + 0.03);
      gain.gain.exponentialRampToValueAtTime(0.0001, now + i * 0.07 + 0.45);

      osc.connect(gain);
      gain.connect(ctx.destination);

      osc.start(now + i * 0.07);
      osc.stop(now + i * 0.07 + 0.5);
    });
  } catch {
    // Ignore audio context errors
  }
}

/**
 * Soft Museum Room Ambience (Quiet, deep acoustic hall murmur with filtered warm noise)
 */
export function startAmbienceSound(): void {
  if (!isSoundEnabled() || !isAmbienceEnabled()) return;
  if (ambienceNode) return; // Already playing

  const ctx = getAudioContext();
  if (!ctx) return;

  try {
    const bufferSize = ctx.sampleRate * 2;
    const noiseBuffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
    const output = noiseBuffer.getChannelData(0);

    // Generate brown noise (deep, room-like warmth)
    let lastOut = 0.0;
    for (let i = 0; i < bufferSize; i++) {
      const white = Math.random() * 2 - 1;
      output[i] = (lastOut + 0.02 * white) / 1.02;
      lastOut = output[i];
      output[i] *= 3.5; // Gain factor
    }

    const whiteNoise = ctx.createBufferSource();
    whiteNoise.buffer = noiseBuffer;
    whiteNoise.loop = true;

    // Filter to retain only ultra-deep room acoustics (< 200 Hz)
    const filter = ctx.createBiquadFilter();
    filter.type = 'lowpass';
    filter.frequency.setValueAtTime(160, ctx.currentTime);

    // Warm gain (barely audible low background airiness: ~0.012)
    const gainNode = ctx.createGain();
    gainNode.gain.setValueAtTime(0.001, ctx.currentTime);
    gainNode.gain.linearRampToValueAtTime(0.012, ctx.currentTime + 2.0); // Soft fade in

    whiteNoise.connect(filter);
    filter.connect(gainNode);
    gainNode.connect(ctx.destination);

    whiteNoise.start();

    ambienceNode = {
      stop: () => {
        try {
          const now = ctx.currentTime;
          gainNode.gain.linearRampToValueAtTime(0.0001, now + 0.8);
          setTimeout(() => {
            try {
              whiteNoise.stop();
              whiteNoise.disconnect();
            } catch {}
          }, 850);
        } catch {}
      },
      setVolume: (v: number) => {
        try {
          gainNode.gain.linearRampToValueAtTime(v, ctx.currentTime + 0.2);
        } catch {}
      },
    };
  } catch {
    // Ignore audio errors
  }
}

export function stopAmbienceSound(): void {
  if (ambienceNode) {
    ambienceNode.stop();
    ambienceNode = null;
  }
}
