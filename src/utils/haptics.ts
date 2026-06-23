/**
 * Light wrapper around the Vibration API for tactile feedback at the gym.
 * No-ops silently on unsupported devices (most desktops, iOS Safari).
 */
export function buzz(pattern: number | number[] = 12): void {
  if (typeof navigator !== 'undefined' && typeof navigator.vibrate === 'function') {
    try {
      navigator.vibrate(pattern);
    } catch {
      // ignore — vibration is a nice-to-have
    }
  }
}

/** Named feedback patterns so call sites read clearly. */
export const haptics = {
  tap: () => buzz(10),
  setDone: () => buzz(18),
  restOver: () => buzz([0, 60, 40, 60]),
  celebrate: () => buzz([0, 70, 40, 70, 40, 120]),
};
