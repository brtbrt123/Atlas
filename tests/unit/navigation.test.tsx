import { renderRouter, screen, fireEvent } from 'expo-router/testing-library';

// Smoke test of the real route tree in app/ (FND-09): every route resolves and renders its placeholder.
describe('route map', () => {
  it('opens on the Home tab', async () => {
    await renderRouter('./app', { initialUrl: '/' });
    expect(await screen.findByRole('header', { name: 'Home' })).toBeTruthy();
  });

  it.each([
    ['/exercises', 'Exercise Library'],
    ['/routines', 'Routine Library'],
    ['/history', 'Workout History'],
    ['/progress', 'Progress'],
    ['/settings', 'Settings'],
    ['/session/active', 'Active Workout'],
    ['/routine/new', 'New Routine'],
    ['/routine/3f2b8c1e-5a47-4d1f-9c3a-7e2d4b6a8f10', 'Routine'],
    ['/exercise/new', 'New Exercise'],
    ['/exercise/9a1c7e4d-2b36-4f58-8d0e-1c5a3b7f9e22', 'Exercise'],
  ])('resolves %s', async (url, title) => {
    await renderRouter('./app', { initialUrl: url });
    expect(await screen.findByRole('header', { name: title })).toBeTruthy();
  });

  it('switches between tabs and opens Settings from Home', async () => {
    await renderRouter('./app', { initialUrl: '/' });
    await fireEvent.press(await screen.findByRole('link', { name: 'Settings' }));
    expect(await screen.findByRole('header', { name: 'Settings' })).toBeTruthy();
  });
});
