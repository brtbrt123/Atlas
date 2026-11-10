/**
 * Runs `fn` at most once at a time. Concurrent callers share the same promise; the result of a
 * success is kept, a failure is forgotten so a retry can run again. expo-sqlite shares one native
 * connection per file, so two overlapping open+migrate runs would interleave (review of FND-11).
 */
export function singleFlight<T>(fn: () => Promise<T>): () => Promise<T> {
  let current: Promise<T> | null = null;
  return () => {
    if (!current) {
      current = fn().catch((error: unknown) => {
        current = null;
        throw error;
      });
    }
    return current;
  };
}
