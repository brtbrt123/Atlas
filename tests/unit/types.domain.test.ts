import {
  ExerciseInputSchema,
  ExerciseSchema,
  ExerciseUpdateSchema,
  HistoryQuerySchema,
  KgSchema,
  RestSecondsSchema,
  RestTimerSecondsSchema,
  RoutineInputSchema,
  RpeSchema,
  SessionPatchSchema,
  SetValuesInputSchema,
  StartWorkoutInputSchema,
  WorkoutSetSchema,
  WorkoutSummarySchema,
} from '../../src/types';

const ID = '3f2b8c1e-5a47-4d1f-9c3a-7e2d4b6a8f10';
const ID2 = '9a1c7e4d-2b36-4f58-8d0e-1c5a3b7f9e22';

describe('primitives', () => {
  it('accepts RPE in half-point steps from 1 to 10 only', () => {
    for (const ok of [1, 6.5, 8, 10]) expect(RpeSchema.safeParse(ok).success).toBe(true);
    for (const bad of [0, 0.5, 10.5, 11, 7.3]) expect(RpeSchema.safeParse(bad).success).toBe(false);
  });

  it('rejects negative, absurd and non-numeric weights', () => {
    expect(KgSchema.safeParse(0).success).toBe(true);
    expect(KgSchema.safeParse(102.5).success).toBe(true);
    for (const bad of [-1, 2001, Number.NaN, Infinity, '80']) expect(KgSchema.safeParse(bad).success).toBe(false);
  });
});

describe('exercise input', () => {
  it('applies defaults and normalizes text', () => {
    const parsed = ExerciseInputSchema.parse({ name: '  Bench Press ', muscles: [{ muscle: ' Chest ', role: 'primary' }] });
    expect(parsed).toEqual({
      name: 'Bench Press',
      equipment: null,
      trackingType: 'weight_reps',
      notes: null,
      muscles: [{ muscle: 'chest', role: 'primary' }],
    });
  });

  it('rejects blank names, bad tracking types and bad muscle roles', () => {
    expect(ExerciseInputSchema.safeParse({ name: '   ' }).success).toBe(false);
    expect(ExerciseInputSchema.safeParse({ name: 'X', trackingType: 'bogus' }).success).toBe(false);
    expect(ExerciseInputSchema.safeParse({ name: 'X', muscles: [{ muscle: 'chest', role: 'tertiary' }] }).success).toBe(false);
  });

  it('parses a partial update to exactly the keys sent (no defaults reset other fields)', () => {
    expect(ExerciseUpdateSchema.parse({ name: ' Renamed ' })).toEqual({ name: 'Renamed' });
    expect(ExerciseUpdateSchema.parse({})).toEqual({});
    expect(ExerciseUpdateSchema.parse({ equipment: null, muscles: [] })).toEqual({ equipment: null, muscles: [] });
    expect(ExerciseUpdateSchema.safeParse({ trackingType: 'bogus' }).success).toBe(false);
  });

  it('round-trips a full exercise', () => {
    const exercise = {
      id: ID,
      builtinKey: null,
      name: 'Row',
      equipment: 'barbell',
      trackingType: 'weight_reps',
      isCustom: true,
      isArchived: false,
      notes: null,
      muscles: [{ muscle: 'back', role: 'primary' }],
      createdAt: 1,
      updatedAt: 2,
    };
    expect(ExerciseSchema.parse(exercise)).toEqual(exercise);
    expect(ExerciseSchema.safeParse({ ...exercise, id: 'not-a-uuid' }).success).toBe(false);
  });
});

describe('routine input', () => {
  it('fills defaults for exercises and sets', () => {
    const routine = RoutineInputSchema.parse({
      name: 'Upper A',
      exercises: [{ exerciseId: ID, sets: [{ targetReps: 8, targetWeightKg: 60 }, {}] }],
    });
    expect(routine.notes).toBeNull();
    expect(routine.exercises[0].restSeconds).toBeNull();
    expect(routine.exercises[0].sets[0]).toEqual({
      setType: 'normal',
      targetReps: 8,
      targetWeightKg: 60,
      targetDurationSeconds: null,
      targetDistanceM: null,
    });
    expect(routine.exercises[0].sets[1].targetReps).toBeNull();
  });

  it('rejects invalid ids, negative targets and oversized routines', () => {
    expect(RoutineInputSchema.safeParse({ name: 'A', exercises: [{ exerciseId: 'x' }] }).success).toBe(false);
    expect(
      RoutineInputSchema.safeParse({ name: 'A', exercises: [{ exerciseId: ID, sets: [{ targetWeightKg: -5 }] }] }).success,
    ).toBe(false);
    expect(
      RoutineInputSchema.safeParse({ name: 'A', exercises: Array.from({ length: 51 }, () => ({ exerciseId: ID })) }).success,
    ).toBe(false);
  });
});

describe('shared ranges and history inputs', () => {
  it('uses one rest range (0-1800 s; timer needs at least 1 s)', () => {
    expect(RestSecondsSchema.safeParse(0).success).toBe(true);
    expect(RestSecondsSchema.safeParse(1800).success).toBe(true);
    expect(RestSecondsSchema.safeParse(1801).success).toBe(false);
    expect(RestTimerSecondsSchema.safeParse(0).success).toBe(false);
    expect(RestTimerSecondsSchema.safeParse(90).success).toBe(true);
  });

  it('bounds history queries and defaults them', () => {
    expect(HistoryQuerySchema.parse({})).toEqual({ cursor: null, limit: 20 });
    expect(HistoryQuerySchema.safeParse({ limit: 0 }).success).toBe(false);
    expect(HistoryQuerySchema.safeParse({ limit: 101 }).success).toBe(false);
    expect(SessionPatchSchema.parse({ name: ' Leg day ' })).toEqual({ name: 'Leg day' });
    expect(SessionPatchSchema.safeParse({ name: '  ' }).success).toBe(false);
  });

  it('summary defaults records to empty and rejects a timestamp-typed duration being negative', () => {
    const base = { sessionId: ID, name: 'A', startedAt: 1, endedAt: 2, durationMs: 1, exerciseCount: 1, completedSetCount: 2, totalVolumeKg: 100 };
    expect(WorkoutSummarySchema.parse(base).records).toEqual([]);
    expect(WorkoutSummarySchema.safeParse({ ...base, durationMs: -1 }).success).toBe(false);
  });
});

describe('workout input', () => {
  it('validates start input and set value patches', () => {
    expect(StartWorkoutInputSchema.safeParse({}).success).toBe(true);
    expect(StartWorkoutInputSchema.safeParse({ routineId: ID2, name: 'Push' }).success).toBe(true);
    expect(StartWorkoutInputSchema.safeParse({ routineId: 'nope' }).success).toBe(false);
    expect(SetValuesInputSchema.parse({ weightKg: 100, reps: 5, rpe: 8.5 })).toEqual({ weightKg: 100, reps: 5, rpe: 8.5 });
    expect(SetValuesInputSchema.parse({ rpe: null })).toEqual({ rpe: null });
    expect(SetValuesInputSchema.safeParse({ reps: 2.5 }).success).toBe(false);
    expect(SetValuesInputSchema.safeParse({ rpe: 11 }).success).toBe(false);
  });

  it('validates a persisted set', () => {
    const set = {
      id: ID,
      position: 0,
      setType: 'normal',
      targetReps: 5,
      targetWeightKg: 100,
      targetDurationSeconds: null,
      targetDistanceM: null,
      weightKg: 100,
      reps: 5,
      rpe: 8,
      durationSeconds: null,
      distanceM: null,
      isCompleted: true,
      completedAt: 1500,
    };
    expect(WorkoutSetSchema.parse(set)).toEqual(set);
    expect(WorkoutSetSchema.safeParse({ ...set, rpe: 12 }).success).toBe(false);
  });
});
