import { createContext, useCallback, useContext, useEffect, useState, type ReactNode } from 'react';

import { isAtlasError } from '../types/errors';
import { openAndMigrate as defaultOpen, type AtlasDb, type OpenAndMigrate } from './client';

// Gate logic only (no UI, no theme): no route renders until the database is open and migrated
// (FND-11). The loading and error views are supplied by the caller (src/navigation/DatabaseGate).
// The drizzle instance is reachable only through this context; screens and components must not
// import it (enforced by ESLint no-restricted-imports; they receive data through hooks).
const DatabaseContext = createContext<AtlasDb | null>(null);

/** For adapter hooks and service wiring only. */
export function useDb(): AtlasDb {
  const db = useContext(DatabaseContext);
  if (!db) throw new Error('useDb must be used inside <DatabaseProvider>');
  return db;
}

export interface GateError {
  message: string;
  /** False when retrying cannot help (e.g. the data was created by a newer app version). */
  retryable: boolean;
  /** True when the app itself must be updated. */
  needsAppUpdate: boolean;
}

type State = { status: 'loading' } | { status: 'ready'; db: AtlasDb } | { status: 'error'; error: GateError };

function toGateError(error: unknown): GateError {
  if (isAtlasError(error)) {
    const needsAppUpdate = Array.isArray(error.details?.unknown);
    const unrecoverable = needsAppUpdate || typeof error.details?.violationCount === 'number';
    return { message: error.message, retryable: !unrecoverable, needsAppUpdate };
  }
  return { message: 'The database could not be opened.', retryable: true, needsAppUpdate: false };
}

export function DatabaseProvider({
  children,
  open = defaultOpen,
  renderLoading,
  renderError,
}: {
  children: ReactNode;
  /** Injectable for tests. */
  open?: OpenAndMigrate;
  renderLoading: () => ReactNode;
  renderError: (error: GateError, retry: () => void) => ReactNode;
}) {
  const [state, setState] = useState<State>({ status: 'loading' });
  const [attempt, setAttempt] = useState(0);

  useEffect(() => {
    let cancelled = false;
    open().then(
      ({ db }) => {
        if (!cancelled) setState({ status: 'ready', db });
      },
      (error: unknown) => {
        if (__DEV__) console.warn('[database] open/migrate failed', isAtlasError(error) ? (error.cause ?? error) : error);
        if (!cancelled) setState({ status: 'error', error: toGateError(error) });
      },
    );
    return () => {
      cancelled = true;
    };
  }, [open, attempt]);

  const retry = useCallback(() => {
    setState({ status: 'loading' });
    setAttempt((n) => n + 1);
  }, []);

  if (state.status === 'ready') return <DatabaseContext.Provider value={state.db}>{children}</DatabaseContext.Provider>;
  if (state.status === 'error') return <>{renderError(state.error, retry)}</>;
  return <>{renderLoading()}</>;
}
