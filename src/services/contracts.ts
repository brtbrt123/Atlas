// Service interfaces consumed by adapter hooks (src/hooks) and implemented in later tasks.
// Claude Code-owned; v1 signatures are documented in docs/CONTRACTS.md and are finalized per
// feature (EXL-05, RTN-04, WKT-06, HST-04, SET-01). Screens never call these directly.
//
// Error behaviour: every method rejects with AtlasError (src/types/errors.ts); inputs are
// validated with the Zod schemas in src/types/domain.ts. Promises returned by write methods
// resolve only AFTER the change has been committed to SQLite.
import type {
  Exercise,
  ExerciseFilter,
  ExerciseInput,
  ExerciseUpdate,
  HistoryPage,
  HistoryQuery,
  Routine,
  RoutineInput,
  SessionPatch,
  SetValuesInput,
  StartWorkoutInput,
  WorkoutSession,
  WorkoutSummary,
} from '../types/domain';
import type { SettingKey, Settings } from '../types/settings';

export interface ExerciseService {
  list(filter?: ExerciseFilter): Promise<Exercise[]>;
  get(id: string): Promise<Exercise>; //                          NOT_FOUND
  create(input: ExerciseInput): Promise<Exercise>; //             VALIDATION
  update(id: string, patch: ExerciseUpdate): Promise<Exercise>; // NOT_FOUND, VALIDATION
  archive(id: string): Promise<void>;
  unarchive(id: string): Promise<void>;
  /** Hard delete. EXERCISE_IN_USE if a routine uses it; HAS_HISTORY if any session references it. */
  remove(id: string): Promise<void>;
}

export interface RoutineService {
  list(): Promise<Routine[]>;
  get(id: string): Promise<Routine>; //                  NOT_FOUND
  create(input: RoutineInput): Promise<Routine>; //      VALIDATION, NOT_FOUND (unknown exercise)
  update(id: string, input: RoutineInput): Promise<Routine>; // replaces exercises/sets; array order = positions
  duplicate(id: string): Promise<Routine>; //            deep copy named "<name> copy"
  remove(id: string): Promise<void>; //                  past sessions are unaffected
}

export interface WorkoutService {
  getActive(): Promise<WorkoutSession | null>; //                     restores after app termination
  /** Starts a workout (empty or from a routine, copying names and targets). */
  start(input?: StartWorkoutInput): Promise<WorkoutSession>; //       ACTIVE_SESSION_EXISTS
  addExercise(exerciseId: string): Promise<WorkoutSession>; //        NO_ACTIVE_SESSION, NOT_FOUND
  removeExercise(sessionExerciseId: string): Promise<WorkoutSession>;
  addSet(sessionExerciseId: string): Promise<WorkoutSession>;
  updateSet(setId: string, values: SetValuesInput): Promise<WorkoutSession>; // VALIDATION
  /** Marks the set completed (optionally saving values) in ONE immediate commit. */
  completeSet(setId: string, values?: SetValuesInput): Promise<WorkoutSession>;
  uncompleteSet(setId: string): Promise<WorkoutSession>;
  removeSet(setId: string): Promise<WorkoutSession>;
  setNotes(notes: string | null): Promise<WorkoutSession>;
  startRestTimer(seconds: number): Promise<WorkoutSession>; //        1-1800 s; stores restTimerEndsAt
  /** Adds/removes seconds relative to the STORED end time (clock-safe); clamps to at least now + 1 s. */
  adjustRestTimer(deltaSeconds: number): Promise<WorkoutSession>;
  clearRestTimer(): Promise<WorkoutSession>;
  /** Transactionally completes the session; endedAt = max(now, startedAt). Incomplete sets stay but are never counted. */
  finish(): Promise<WorkoutSummary>;
  /** Deletes the active session and all its sets. */
  discard(): Promise<void>;
}

export interface HistoryService {
  list(query?: HistoryQuery): Promise<HistoryPage>;
  get(sessionId: string): Promise<WorkoutSession>; //                 NOT_FOUND; built from snapshots
  /** Summary of a completed session (reopenable after the app is killed); NOT_FOUND / SESSION_ACTIVE. */
  getSummary(sessionId: string): Promise<WorkoutSummary>;
  update(sessionId: string, patch: SessionPatch): Promise<WorkoutSession>;
  /** Edit a set of a COMPLETED session (DRAFT, HST-02); WorkoutService.updateSet rejects completed sessions. */
  updateSet(setId: string, values: SetValuesInput): Promise<WorkoutSession>;
  removeSet(setId: string): Promise<WorkoutSession>;
  /** Deletes a completed session; SESSION_ACTIVE if it is the active one (use WorkoutService.discard). */
  remove(sessionId: string): Promise<void>;
}

export interface SettingsService {
  get(): Promise<Settings>; //                                        never throws on corrupt values
  set<K extends SettingKey>(key: K, value: Settings[K]): Promise<Settings>; // VALIDATION
}
