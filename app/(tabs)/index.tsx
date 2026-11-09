import { Link } from 'expo-router';

import { RoutePlaceholder } from '../../src/navigation/RoutePlaceholder';

export default function HomeTab() {
  return (
    <>
      <RoutePlaceholder title="Home" detail="Weekly activity, recent workout and quick start arrive with HST-06." />
      {/* Development builds only: opens Codex's mock-data UI preview (FND-14). */}
      {__DEV__ ? (
        <Link href="/dev/preview" accessibilityRole="link" accessibilityLabel="Open UI preview (development only)" style={{ position: 'absolute', bottom: 24, alignSelf: 'center', color: '#B7F36B' }}>
          Open UI preview (dev only)
        </Link>
      ) : null}
    </>
  );
}
