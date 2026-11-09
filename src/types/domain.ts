// ATLAS domain schemas (Zod) and inferred types. Claude Code-owned; documented in docs/CONTRACTS.md.
// Units: weights are KILOGRAMS everywhere in the domain; unit conversion happens only at the
// display/input edge (SET-02). Times are epoch milliseconds (UTC). Ids are UUID v4 strings.
import { z } from 'zod';

import { MUSCLE_ROLES, SESSION_STATUSES, SET_TYPES, TRACKING_TYPES } from './enums';

// ---------------------------------------------------------------- primitives

export const IdSchema = z.uuid();
export const EpochMsSchema = z.number().int().nonnegative();
export const KgSchema = z.number().nonnegative().max(2000);
export const RepsSchema = z.number().int().nonnegative().max(1000);
/** RPE 1-10 in half-point steps (DEC-014). The database CHECK only enforces 1-10; Zod is stricter. */
export const RpeSchema = z.number().min(1).max(10).multipleOf(0.5);
export const SecondsSchema = z.number().int().nonnegative().max(86_400);
/** One range for every rest value: per-exercise rest, rest timer and the default (0 = no rest). */
export const RestSecondsSchema = z.number().int().min(0).max(1800);
export const RestTimerSecondsSchema = z.number().int().min(1).max(1800);
export const DurationMsSchema = z.number().int().nonnegative();
export const MetersSchema = z.number().nonnegative().max(1_000_000);
const NameSchema = z.string().trim().min(1).max(100);
const NotesSchema = z.string().trim().max(2000);

export const TrackingTypeSchema = z.enum(TRACKING_TYPES);
export const MuscleRoleSchema = z.enum(MUSCLE_ROLES);
export const SetTypeSchema = z.enum(SET_TYPES);
export const SessionStatusSchema = z.enum(SESSION_STATUSES);

// ------------------------------------------------------------------ exercises

export const ExerciseMuscleSchema = z.object({
  muscle: z.string().trim().toLowerCase().min(1).max(50),
  role: MuscleRoleSchema,
});

export const ExerciseSchema = z.object({
  id: IdSchema,
  builtinKey: z.string().nullable(),
  name: NameSchema,
  equipment: z.string().trim().max(50).nullable(),
  trackingType: TrackingTypeSchema,
  isCustom: z.boolean(),
  isArchived: z.boolean(),
  notes: NotesSchema.nullable(),
  muscles: z.array(ExerciseMuscleSchema),
  createdAt: EpochMsSchema,
  updatedAt: EpochMsSchema,
});

// `muscle` and `equipment` are free text until the vocabularies are fixed in EXL-01 (unstable).
const ExerciseFields = {
  name: NameSchema,
  equipment: z.string().trim().max(50).nullable(),
  trackingType: TrackingTypeSchema,
  notes: NotesSchema.nullable(),
  muscles: z.array(ExerciseMuscleSchema),
};

/** Create: defaults fill omitted fields. */
export const ExerciseInputSchema = z.object({
  name: ExerciseFields.name,
  equipment: ExerciseFields.equipment.default(null),
  trackingType: ExerciseFields.trackingType.default('weight_reps'),
  notes: ExerciseFields.notes.default(null),
  muscles: ExerciseFields.muscles.default([]),
});

/** Update: only the keys sent are present (no defaults, so a rename never resets other fields). */
export const ExerciseUpdateSchema = z.object(ExerciseFields).partial();

export const ExerciseFilterSchema = z.object({
  query: z.string().trim().max(100).optional(),
  muscle: z.string().trim().toLowerCase().optional(),
  equipment: z.string().trim().optional(),
  includeArchived: z.boolean().default(false),
});

// ------------------------------------------------------------------- routines

const SetTargetsShape = {
  targetReps: RepsSchema.nullable(),
  targetWeightKg: KgSchema.nullable(),
  targetDurationSeconds: SecondsSchema.nullable(),
  targetDistanceM: MetersSchema.nullable(),
};

export const RoutineSetSchema = z.object({
  id: IdSchema,
  position: z.number().int().nonnegative(),
  setType: SetTypeSchema,
  ...SetTargetsShape,
});

export const RoutineExerciseSchema = z.object({
  id: IdSchema,
  exerciseId: IdSchema,
  exerciseName: NameSchema, // joined for display; not stored on the routine row
  position: z.number().int().nonnegative(),
  restSeconds: RestSecondsSchema.nullable(),
  notes: NotesSchema.nullable(),
  sets: z.array(RoutineSetSchema),
});

export const RoutineSchema = z.object({
  id: IdSchema,
  name: NameSchema,
  notes: NotesSchema.nullable(),
  exercises: z.array(RoutineExerciseSchema),
  createdAt: EpochMsSchema,
  updatedAt: EpochMsSchema,
});

/** Write model: array order defines positions; ids are assigned by the service. */
export const RoutineSetInputSchema = z.object({
  setType: SetTypeSchema.default('normal'),
  targetReps: RepsSchema.nullable().default(null),
  targetWeightKg: KgSchema.nullable().default(null),
  targetDurationSeconds: SecondsSchema.nullable().default(null),
  targetDistanceM: MetersSchema.nullable().default(null),
});

export const RoutineExerciseInputSchema = z.object({
  exerciseId: IdSchema,
  restSeconds: RestSecondsSchema.nullable().default(null),
  notes: NotesSchema.nullable().default(null),
  sets: z.array(RoutineSetInputSchema).max(50).default([]),
});

export const RoutineInputSchema = z.object({
  name: NameSchema,
  notes: NotesSchema.nullable().default(null),
  exercises: z.array(RoutineExerciseInputSchema).max(50).default([]),
});

// -------------------------------------------------------------------- workouts

export const WorkoutSetSchema = z.object({
  id: IdSchema,
  position: z.number().int().nonnegative(),
  setType: SetTypeSchema,
  // Planned targets copied from the routine at start (never read live).
  ...SetTargetsShape,
  // Actual performance.
  weightKg: KgSchema.nullable(),
  reps: RepsSchema.nullable(),
  rpe: RpeSchema.nullable(),
  durationSeconds: SecondsSchema.nullable(),
  distanceM: MetersSchema.nullable(),
  isCompleted: z.boolean(),
  completedAt: EpochMsSchema.nullable(),
});

export const SessionExerciseSchema = z.object({
  id: IdSchema,
  exerciseId: IdSchema.nullable(), // null after the exercise was deleted; name is the snapshot
  name: NameSchema,
  trackingType: TrackingTypeSchema,
  position: z.number().int().nonnegative(),
  restSeconds: RestSecondsSchema.nullable(),
  notes: NotesSchema.nullable(),
  sets: z.array(WorkoutSetSchema),
});

export const WorkoutSessionSchema = z.object({
  id: IdSchema,
  routineId: IdSchema.nullable(),
  name: NameSchema,
  status: SessionStatusSchema,
  startedAt: EpochMsSchema,
  endedAt: EpochMsSchema.nullable(),
  restTimerEndsAt: EpochMsSchema.nullable(),
  notes: NotesSchema.nullable(),
  exercises: z.array(SessionExerciseSchema),
});

export const StartWorkoutInputSchema = z.object({
  routineId: IdSchema.optional(),
  name: NameSchema.optional(),
});

/** Partial update of a set's actual values; `null` clears a value. */
export const SetValuesInputSchema = z.object({
  setType: SetTypeSchema.optional(),
  weightKg: KgSchema.nullable().optional(),
  reps: RepsSchema.nullable().optional(),
  rpe: RpeSchema.nullable().optional(),
  durationSeconds: SecondsSchema.nullable().optional(),
  distanceM: MetersSchema.nullable().optional(),
});

/** Personal record reached in a workout. DRAFT: finalized in ANL-03; `records` is empty until then. */
export const PersonalRecordSchema = z.object({
  exerciseId: IdSchema.nullable(),
  exerciseName: NameSchema,
  kind: z.enum(['weight', 'reps', 'estimated_1rm', 'volume']),
  value: z.number().nonnegative(),
  previousValue: z.number().nonnegative().nullable(),
});

/** Patch for a session's own fields (history edit). */
export const SessionPatchSchema = z.object({ name: NameSchema.optional(), notes: NotesSchema.nullable().optional() });

export const HistoryQuerySchema = z.object({
  cursor: z.string().max(200).nullable().default(null),
  limit: z.number().int().min(1).max(100).default(20),
});

export const WorkoutSummarySchema = z.object({
  sessionId: IdSchema,
  name: NameSchema,
  startedAt: EpochMsSchema,
  endedAt: EpochMsSchema,
  durationMs: DurationMsSchema,
  exerciseCount: z.number().int().nonnegative(),
  completedSetCount: z.number().int().nonnegative(),
  /** Sum of weightKg x reps over completed weighted sets only. */
  totalVolumeKg: z.number().nonnegative(),
  records: z.array(PersonalRecordSchema).default([]),
});

// --------------------------------------------------------------------- history

export const HistoryItemSchema = WorkoutSummarySchema.extend({ routineId: IdSchema.nullable() });

export const HistoryPageSchema = z.object({
  items: z.array(HistoryItemSchema),
  nextCursor: z.string().nullable(),
});

// ----------------------------------------------------------------------- types

export type Exercise = z.infer<typeof ExerciseSchema>;
export type ExerciseInput = z.input<typeof ExerciseInputSchema>;
export type ExerciseUpdate = z.input<typeof ExerciseUpdateSchema>;
export type ExerciseFilter = z.input<typeof ExerciseFilterSchema>;
export type ExerciseMuscle = z.infer<typeof ExerciseMuscleSchema>;
export type Routine = z.infer<typeof RoutineSchema>;
export type RoutineExercise = z.infer<typeof RoutineExerciseSchema>;
export type RoutineSet = z.infer<typeof RoutineSetSchema>;
export type RoutineInput = z.input<typeof RoutineInputSchema>;
export type WorkoutSession = z.infer<typeof WorkoutSessionSchema>;
export type SessionExercise = z.infer<typeof SessionExerciseSchema>;
export type WorkoutSet = z.infer<typeof WorkoutSetSchema>;
export type StartWorkoutInput = z.input<typeof StartWorkoutInputSchema>;
export type SetValuesInput = z.input<typeof SetValuesInputSchema>;
export type WorkoutSummary = z.infer<typeof WorkoutSummarySchema>;
export type PersonalRecord = z.infer<typeof PersonalRecordSchema>;
export type SessionPatch = z.input<typeof SessionPatchSchema>;
export type HistoryQuery = z.input<typeof HistoryQuerySchema>;
export type HistoryItem = z.infer<typeof HistoryItemSchema>;
export type HistoryPage = z.infer<typeof HistoryPageSchema>;
