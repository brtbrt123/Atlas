import { Redirect } from 'expo-router';

// Development-only route (FND-14): mounts Codex's isolated, mock-data UI preview, which shows its own
// "UI preview · Example data · Not saved" banner. In production builds `__DEV__` is false, Babel removes
// the whole `if (__DEV__)` block together with the require (verified against the exported bundle), and
// the route redirects Home, so the preview and its fixtures never ship. Do not wire this to services.
export default function DevPreviewRoute() {
  if (__DEV__) {
    // eslint-disable-next-line @typescript-eslint/no-require-imports -- keeps the preview out of production bundles
    const { AtlasPreview } = require('../../src/features/preview/AtlasPreview') as typeof import('../../src/features/preview/AtlasPreview');
    return <AtlasPreview />;
  }
  return <Redirect href="/" />;
}
