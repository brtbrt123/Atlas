import { fireEvent, render, screen, waitFor } from '@testing-library/react-native';
import { Text } from 'react-native';

import bundle from '../../drizzle/migrations';
import type { OpenAndMigrate } from '../../src/database/client';
import { DatabaseGate } from '../../src/navigation/DatabaseGate';
import { configureConnection, runMigrations, type MigrationBundle, type SqlDatabase } from '../../src/database/migrate';
import { asyncDb } from '../helpers/asyncDb';

const FAKE_DB = {} as never;

/** An `open` that runs the REAL runner against a real SQLite engine with the given bundle. */
const openWith = (migrationBundle: MigrationBundle): OpenAndMigrate => async () => {
  const sqlite = asyncDb();
  await configureConnection(sqlite as SqlDatabase);
  await runMigrations(sqlite as SqlDatabase, migrationBundle);
  return { sqlite: sqlite as never, db: FAKE_DB };
};

describe('DatabaseGate', () => {
  it('renders nothing from the app until migrations finish, then renders children', async () => {
    let release: () => void = () => undefined;
    const gate = new Promise<void>((resolve) => (release = resolve));
    const open: OpenAndMigrate = async () => {
      await gate;
      return { sqlite: {} as never, db: FAKE_DB };
    };
    await render(
      <DatabaseGate open={open}>
        <Text>App content</Text>
      </DatabaseGate>,
    );
    expect(screen.queryByText('App content')).toBeNull();
    release();
    expect(await screen.findByText('App content')).toBeTruthy();
  });

  it('applies the real migrations and then shows the app', async () => {
    await render(
      <DatabaseGate open={openWith(bundle as unknown as MigrationBundle)}>
        <Text>App content</Text>
      </DatabaseGate>,
    );
    expect(await screen.findByText('App content')).toBeTruthy();
  });

  it('blocks the app with an error screen when a migration fails, and never renders children', async () => {
    const broken: MigrationBundle = {
      journal: { entries: [{ idx: 0, tag: '0000_broken' }] },
      migrations: { m0000: 'THIS IS NOT SQL;' },
    };
    await render(
      <DatabaseGate open={openWith(broken)}>
        <Text>App content</Text>
      </DatabaseGate>,
    );
    expect(await screen.findByRole('alert', { name: 'The database could not be updated.' })).toBeTruthy();
    expect(screen.getByRole('header', { name: 'ATLAS can’t start' })).toBeTruthy();
    expect(screen.getByText('The database could not be updated.')).toBeTruthy();
    expect(screen.getByRole('button', { name: 'Try again' })).toBeTruthy();
    expect(screen.queryByText('App content')).toBeNull();
    // raw SQL/engine text is not shown to the user
    expect(screen.queryByText(/syntax error|NOT SQL/i)).toBeNull();
  });

  it('recovers when the user taps Try again and the retry succeeds', async () => {
    let calls = 0;
    const flaky: OpenAndMigrate = async () => {
      calls += 1;
      if (calls === 1) throw new Error('disk busy');
      return { sqlite: {} as never, db: FAKE_DB };
    };
    await render(
      <DatabaseGate open={flaky}>
        <Text>App content</Text>
      </DatabaseGate>,
    );
    await fireEvent.press(await screen.findByRole('button', { name: 'Try again' }));
    await waitFor(() => expect(screen.getByText('App content')).toBeTruthy());
    expect(calls).toBe(2);
  });

  it('shows an accessible loading indicator while migrating', async () => {
    const never: OpenAndMigrate = () => new Promise(() => undefined);
    await render(
      <DatabaseGate open={never}>
        <Text>App content</Text>
      </DatabaseGate>,
    );
    expect(screen.getByRole('progressbar', { name: 'Loading' })).toBeTruthy();
  });

  it('tells the user to update the app (no retry button) for data from a newer version', async () => {
    const db = asyncDb();
    await runMigrations(db as SqlDatabase, bundle as unknown as MigrationBundle);
    db.raw.exec("INSERT INTO __atlas_migrations (tag, applied_at) VALUES ('0099_future', 1)");
    const open: OpenAndMigrate = async () => {
      await runMigrations(db as SqlDatabase, bundle as unknown as MigrationBundle);
      return { sqlite: {} as never, db: FAKE_DB };
    };
    await render(
      <DatabaseGate open={open}>
        <Text>App content</Text>
      </DatabaseGate>,
    );
    expect(await screen.findByText(/newer version of ATLAS/)).toBeTruthy();
    expect(screen.queryByRole('button', { name: 'Try again' })).toBeNull();
    expect(screen.queryByText('App content')).toBeNull();
  });
});
