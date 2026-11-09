import { Redirect } from 'expo-router';

// Development-only route (DS-09): checks that the development build has Plus Jakarta Sans and
// react-native-svg. Same pattern as dev/preview: in production builds `__DEV__` is false, Babel removes
// the whole `if (__DEV__)` block together with the require, and the route redirects Home.
export default function DevFoundationsRoute() {
  if (__DEV__) {
    // eslint-disable-next-line @typescript-eslint/no-require-imports -- keeps the check out of production bundles
    const { FontSvgCheck } = require('../../src/navigation/FontSvgCheck') as typeof import('../../src/navigation/FontSvgCheck');
    return <FontSvgCheck />;
  }
  return <Redirect href="/" />;
}
