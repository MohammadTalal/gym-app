import { describe, expect, it } from 'vitest';
import { syncDayLog } from './session';

// 2026-06-22 is a Monday → Upper Body A (upper-a, 6 exercises).
const MON = '2026-06-22';
// 2026-06-26 is a Friday → rest day (no scheduled workout).
const FRI = '2026-06-26';

describe('syncDayLog', () => {
  it('logs a trained session when at least one scheduled exercise is ticked', () => {
    const completion = { [MON]: ['chest-press-machine', 'lat-pulldown'] };
    const logs = syncDayLog([], completion, MON);
    expect(logs).toHaveLength(1);
    expect(logs[0]).toMatchObject({
      workoutDayId: 'upper-a',
      date: MON,
      completedExercises: 2,
      totalExercises: 6,
    });
  });

  it('removes the log when no exercises are ticked', () => {
    const seeded = [
      { id: 'upper-a-' + MON, workoutDayId: 'upper-a', date: MON, durationMinutes: 30, completedExercises: 2, totalExercises: 6 },
    ];
    const logs = syncDayLog(seeded, { [MON]: [] }, MON);
    expect(logs).toHaveLength(0);
  });

  it('preserves an existing (e.g. Workout Mode) duration', () => {
    const seeded = [
      { id: 'upper-a-' + MON, workoutDayId: 'upper-a', date: MON, durationMinutes: 55, completedExercises: 6, totalExercises: 6 },
    ];
    const logs = syncDayLog(seeded, { [MON]: ['chest-press-machine'] }, MON);
    expect(logs[0].durationMinutes).toBe(55);
    expect(logs[0].completedExercises).toBe(1);
  });

  it('does nothing on a rest day', () => {
    const logs = syncDayLog([], { [FRI]: ['chest-press-machine'] }, FRI);
    expect(logs).toHaveLength(0);
  });

  it('ignores exercises that are not part of that day’s workout', () => {
    const completion = { [MON]: ['goblet-squat'] }; // a leg-day exercise
    const logs = syncDayLog([], completion, MON);
    expect(logs).toHaveLength(0);
  });
});
