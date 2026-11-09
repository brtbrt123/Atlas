// Domain enums: the single source of truth. The database schema imports these, never the reverse.
export const TRACKING_TYPES = ['weight_reps', 'bodyweight_reps', 'duration', 'distance_duration'] as const;
export const MUSCLE_ROLES = ['primary', 'secondary'] as const;
export const SET_TYPES = ['normal', 'warmup', 'drop', 'failure'] as const;
export const SESSION_STATUSES = ['active', 'completed'] as const;
/**
 * Fixed muscle vocabulary (EXL-01): anatomical muscle groups only. `shoulders` is deliberately a
 * single group (delt heads are not split; this is final). Cardio is expressed by the exercise's
 * tracking type and full-body movements by several primaries, so neither is a muscle value.
 * Stored as text; validated by Zod at the service boundary. Only add values, never rename or remove.
 */
export const MUSCLES = [
  'chest',
  'upper_back',
  'lats',
  'lower_back',
  'traps',
  'shoulders',
  'biceps',
  'triceps',
  'forearms',
  'abs',
  'obliques',
  'glutes',
  'quadriceps',
  'hamstrings',
  'calves',
  'adductors',
  'abductors',
  'hip_flexors',
  'neck',
] as const;
/** Fixed equipment vocabulary (EXL-01). */
/**
 * Fixed equipment vocabulary (EXL-01). One value per exercise, so values do not overlap:
 * `null` = not specified; `bodyweight` = no external load (push-ups, planks, air squats);
 * `pull_up_bar` = hanging movements (pull-ups, chin-ups, leg raises); `dip_station` = dips;
 * `other` = a real implement not listed here. Only add values, never rename or remove.
 */
export const EQUIPMENT = [
  'barbell',
  'dumbbell',
  'kettlebell',
  'machine',
  'cable',
  'smith_machine',
  'ez_bar',
  'trap_bar',
  'plate',
  'landmine',
  'resistance_band',
  'pull_up_bar',
  'dip_station',
  'suspension',
  'sled',
  'medicine_ball',
  'bodyweight',
  'cardio_machine',
  'other',
] as const;
export const WEIGHT_UNITS = ['kg', 'lb'] as const;
export const THEME_MODES = ['system', 'dark', 'light'] as const;

export type TrackingType = (typeof TRACKING_TYPES)[number];
export type MuscleRole = (typeof MUSCLE_ROLES)[number];
export type SetType = (typeof SET_TYPES)[number];
export type SessionStatus = (typeof SESSION_STATUSES)[number];
export type Muscle = (typeof MUSCLES)[number];
export type Equipment = (typeof EQUIPMENT)[number];
export type WeightUnit = (typeof WEIGHT_UNITS)[number];
export type ThemeMode = (typeof THEME_MODES)[number];
