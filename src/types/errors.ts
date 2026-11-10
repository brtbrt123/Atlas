// Typed domain errors. Services reject/throw AtlasError; raw SQLite errors never reach the UI.
// `message` and `details` are SAFE to show; the original low-level error is kept in `Error.cause` for logs only.
export const ATLAS_ERROR_CODES = [
  'VALIDATION', //            input failed schema validation (details.issues)
  'NOT_FOUND', //             the referenced record does not exist
  'ACTIVE_SESSION_EXISTS', // a workout is already active (only one allowed)
  'NO_ACTIVE_SESSION', //     the operation needs an active workout and there is none
  'SESSION_NOT_ACTIVE', //    the session is already completed
  'SESSION_ACTIVE', //        the session is still active (use discard, not delete)
  'EXERCISE_IN_USE', //       exercise is referenced by a routine
  'HAS_HISTORY', //           exercise has workout history; archive instead of delete
  'PERSISTENCE', //           the database write/read failed (services translate repository errors)
  'MIGRATION', //             startup migration failed
  'INTERNAL', //              unexpected bug; not retryable (original error in Error.cause)
] as const;

export type AtlasErrorCode = (typeof ATLAS_ERROR_CODES)[number];

export class AtlasError extends Error {
  readonly code: AtlasErrorCode;
  readonly details?: Record<string, unknown>;

  constructor(code: AtlasErrorCode, message: string, details?: Record<string, unknown>, cause?: unknown) {
    super(message, cause === undefined ? undefined : { cause });
    this.name = 'AtlasError';
    this.code = code;
    this.details = details;
  }
}

export const isAtlasError = (value: unknown): value is AtlasError =>
  value instanceof AtlasError ||
  // Fallback if a class transform breaks the prototype chain.
  (value instanceof Error &&
    value.name === 'AtlasError' &&
    ATLAS_ERROR_CODES.includes((value as { code?: AtlasErrorCode }).code as AtlasErrorCode));

export type Result<T> = { ok: true; value: T } | { ok: false; error: AtlasError };

/** Adapter helper: run a service call and capture a typed failure instead of throwing. */
export async function attempt<T>(run: () => Promise<T>): Promise<Result<T>> {
  try {
    return { ok: true, value: await run() };
  } catch (error) {
    if (isAtlasError(error)) return { ok: false, error };
    return { ok: false, error: new AtlasError('INTERNAL', 'Unexpected failure', undefined, error) };
  }
}
