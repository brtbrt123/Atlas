import { useEffect, type ReactNode } from 'react';
import { AccessibilityInfo, ActivityIndicator, Pressable, StyleSheet, Text, View } from 'react-native';

import { DatabaseProvider, type GateError } from '../database/DatabaseProvider';
import type { OpenAndMigrate } from '../database/client';
import { colors } from '../theme/tokens';

// Functional loading and blocking-error views for the database gate (FND-11). Claude-owned
// placeholders with a stable props contract (docs/CONTRACTS.md "Database gate"); Codex may replace
// the visuals by taking over these two components via a handoff.

export function GateLoadingView() {
  return (
    <View style={styles.container}>
      <ActivityIndicator accessible accessibilityRole="progressbar" accessibilityLabel="Loading" color={colors.accent} size="large" />
    </View>
  );
}

export function GateErrorView({ error, onRetry }: { error: GateError; onRetry: () => void }) {
  useEffect(() => {
    // role="alert" alone is not announced on Android; announce explicitly when the error appears.
    AccessibilityInfo.announceForAccessibility(error.message);
  }, [error.message]);

  return (
    <View style={styles.container}>
      <Text accessibilityRole="header" style={styles.title}>
        {'ATLAS can’t start'}
      </Text>
      <Text accessibilityRole="alert" accessibilityLiveRegion="assertive" style={styles.detail}>
        {error.message}
      </Text>
      {error.retryable ? (
        <>
          <Text style={styles.detail}>Your workout data has not been changed. Try again; if this keeps happening, restart the app.</Text>
          <Pressable accessibilityRole="button" accessibilityLabel="Try again" onPress={onRetry} style={styles.button}>
            <Text style={styles.buttonLabel}>Try again</Text>
          </Pressable>
        </>
      ) : (
        <Text style={styles.detail}>
          {error.needsAppUpdate ? 'Your workout data has not been changed.' : 'Your workout data has not been changed. Please restart the app.'}
        </Text>
      )}
    </View>
  );
}

/** Wraps the app: nothing renders until the database is open and migrated. */
export function DatabaseGate({ children, open }: { children: ReactNode; open?: OpenAndMigrate }) {
  return (
    <DatabaseProvider
      open={open}
      renderLoading={() => <GateLoadingView />}
      renderError={(error, retry) => <GateErrorView error={error} onRetry={retry} />}
    >
      {children}
    </DatabaseProvider>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, alignItems: 'center', justifyContent: 'center', backgroundColor: colors.background, padding: 24, gap: 12 },
  title: { color: colors.text, fontSize: 22, fontWeight: '600' },
  detail: { color: colors.muted, fontSize: 15, textAlign: 'center' },
  button: { minHeight: 48, minWidth: 120, alignItems: 'center', justifyContent: 'center', backgroundColor: colors.accent, borderRadius: 16, paddingHorizontal: 20, marginTop: 8 },
  buttonLabel: { color: colors.background, fontSize: 16, fontWeight: '600' },
});
