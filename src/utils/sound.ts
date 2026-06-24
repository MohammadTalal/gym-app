/**
 * Plays a short two-note chime via the Web Audio API (no audio file needed).
 * Used to signal the end of a rest period. Silently no-ops if unsupported.
 */
export function playChime(): void {
  try {
    const Ctx: typeof AudioContext =
      window.AudioContext ?? (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
    if (!Ctx) return;
    const ctx = new Ctx();

    const beep = (freq: number, start: number, dur: number) => {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.type = 'sine';
      osc.frequency.value = freq;
      const t0 = ctx.currentTime + start;
      gain.gain.setValueAtTime(0.0001, t0);
      gain.gain.exponentialRampToValueAtTime(0.3, t0 + 0.02);
      gain.gain.exponentialRampToValueAtTime(0.0001, t0 + dur);
      osc.start(t0);
      osc.stop(t0 + dur + 0.02);
    };

    beep(660, 0, 0.18);
    beep(990, 0.16, 0.28);
    setTimeout(() => ctx.close(), 700);
  } catch {
    // audio is a nice-to-have
  }
}

export const SOUND_KEY = 'gymcoach-sound-v1';
