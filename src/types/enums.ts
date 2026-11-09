// Domain enums: the single source of truth. The database schema imports these, never the reverse.
export const TRACKING_TYPES = ['weight_reps', 'bodyweight_reps', 'duration', 'distance_duration'] as const;
export const MUSCLE_ROLES = ['primary', 'secondary'] as const;
export const SET_TYPES = ['normal', 'warmup', 'drop', 'failure'] as const;
export const SESSION_STATUSES = ['active', 'completed'] as const;
export const WEIGHT_UNITS = ['kg', 'lb'] as const;
export const THEME_MODES = ['system', 'dark', 'light'] as const;

export type TrackingType = (typeof TRACKING_TYPES)[number];
export type MuscleRole = (typeof MUSCLE_ROLES)[number];
export type SetType = (typeof SET_TYPES)[number];
export type SessionStatus = (typeof SESSION_STATUSES)[number];
export type WeightUnit = (typeof WEIGHT_UNITS)[number];
export type ThemeMode = (typeof THEME_MODES)[number];
