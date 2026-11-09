// Injectable ports so services are deterministic in tests (no wall clock, no random ids).
export interface Clock {
  /** Current time in epoch milliseconds. */
  now(): number;
}

export interface IdGenerator {
  /** A new UUID v4 string. */
  uuid(): string;
}

/** Local notification scheduling (rest timer end). Implemented with expo-notifications in WKT-05. */
export interface Notifier {
  /** Schedules a notification at `atEpochMs`; returns an id to cancel it. */
  schedule(atEpochMs: number, title: string, body: string): Promise<string>;
  cancel(id: string): Promise<void>;
}
