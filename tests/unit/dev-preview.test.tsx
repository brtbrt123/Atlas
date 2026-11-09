import { renderRouter, screen } from 'expo-router/testing-library';

// expo-sqlite needs native code; the migration gate is covered by database.provider.test.tsx.
jest.mock('../../src/database/client', () => ({
  openAndMigrate: async () => ({ sqlite: {}, db: {} }),
}));

declare const globalThis: { __DEV__: boolean };

describe('development-only UI preview route (FND-14)', () => {
  const original = globalThis.__DEV__;
  afterEach(() => {
    globalThis.__DEV__ = original;
  });

  it('mounts Codex\'s preview in development and keeps its mock-data banner', async () => {
    globalThis.__DEV__ = true;
    await renderRouter('./app', { initialUrl: '/dev/preview' });
    expect(await screen.findByText('UI preview · Example data · Not saved')).toBeTruthy();
  });

  it('shows the dev-only link on Home in development', async () => {
    globalThis.__DEV__ = true;
    await renderRouter('./app', { initialUrl: '/' });
    expect(await screen.findByRole('link', { name: 'Open UI preview (development only)' })).toBeTruthy();
  });

  it('redirects Home and never renders the preview in production', async () => {
    globalThis.__DEV__ = false;
    await renderRouter('./app', { initialUrl: '/dev/preview' });
    expect(await screen.findByRole('header', { name: 'Home' })).toBeTruthy();
    expect(screen.queryByText('UI preview · Example data · Not saved')).toBeNull();
    expect(screen.queryByRole('link', { name: 'Open UI preview (development only)' })).toBeNull();
  });
});
