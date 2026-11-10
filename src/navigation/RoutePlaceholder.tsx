import { StyleSheet, Text, View } from 'react-native';

import { colors } from '../theme/tokens';

// Temporary stand-in for Codex's screens. Each route renders this until its screen exists
// (see docs/CONTRACTS.md "Route map"). Claude-owned; Codex replaces it per route via a handoff.
export function RoutePlaceholder({ title, detail }: { title: string; detail?: string }) {
  return (
    <View style={styles.container}>
      <Text accessibilityRole="header" style={styles.title}>
        {title}
      </Text>
      {detail ? <Text style={styles.detail}>{detail}</Text> : null}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, alignItems: 'center', justifyContent: 'center', backgroundColor: colors.background, padding: 20 },
  title: { color: colors.text, fontSize: 20, fontWeight: '600' },
  detail: { color: colors.muted, fontSize: 14, marginTop: 8, textAlign: 'center' },
});
