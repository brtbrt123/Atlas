import { Text } from 'react-native';
import { renderRouter, screen } from 'expo-router/testing-library';

import DevFoundationsRoute from '../../app/dev/foundations';

// react-native-svg needs native views; plain Views are enough to render the check screen in Jest.
jest.mock('react-native-svg', () => {
  const React = jest.requireActual<typeof import('react')>('react');
  const { View } = jest.requireActual<typeof import('react-native')>('react-native');
  const Shape = (props: { children?: import('react').ReactNode }) => React.createElement(View, null, props.children);
  return { __esModule: true, default: Shape, Svg: Shape, Rect: Shape, Circle: Shape, Path: Shape };
});

declare const globalThis: { __DEV__: boolean };

// Only the two routes involved are mounted (in-memory route map), so the test does not load the whole
// app tree (tabs, database gate, Codex's screens); the full-app routing is covered by navigation tests.
const routes = {
  index: () => <Text>Home stub</Text>,
  'dev/foundations': DevFoundationsRoute,
};

describe('development-only font and SVG check route (DS-09)', () => {
  const original = globalThis.__DEV__;
  afterEach(() => {
    globalThis.__DEV__ = original;
  });

  it('renders the check in development', async () => {
    globalThis.__DEV__ = true;
    await renderRouter(routes, { initialUrl: '/dev/foundations' });
    expect(await screen.findByText('Plus Jakarta Sans')).toBeTruthy();
    expect(screen.getByText('react-native-svg')).toBeTruthy();
  });

  it('redirects Home and never renders the check in production', async () => {
    globalThis.__DEV__ = false;
    await renderRouter(routes, { initialUrl: '/dev/foundations' });
    expect(await screen.findByText('Home stub')).toBeTruthy();
    expect(screen.queryByText('Plus Jakarta Sans')).toBeNull();
  });
});
