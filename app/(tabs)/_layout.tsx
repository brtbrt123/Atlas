import { Link, Tabs } from 'expo-router';
import { Text } from 'react-native';

import { colors } from '../../src/theme/tokens';

// Tab shell. Switching tabs never discards the active workout: its state lives in SQLite and the
// store, not in a screen (CLAUDE.md). Visual styling of the chrome is Codex's task (DS-06).
export default function TabsLayout() {
  return (
    <Tabs
      screenOptions={{
        headerStyle: { backgroundColor: colors.surface },
        headerTintColor: colors.text,
        tabBarStyle: { backgroundColor: colors.surface, borderTopColor: colors.border },
        tabBarActiveTintColor: colors.accent,
        tabBarInactiveTintColor: colors.muted,
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: 'Home',
          headerRight: () => (
            <Link href="/settings" accessibilityRole="link" accessibilityLabel="Settings" style={{ marginRight: 16 }}>
              <Text style={{ color: colors.text }}>Settings</Text>
            </Link>
          ),
        }}
      />
      <Tabs.Screen name="exercises" options={{ title: 'Exercises' }} />
      <Tabs.Screen name="routines" options={{ title: 'Routines' }} />
      <Tabs.Screen name="history" options={{ title: 'History' }} />
      <Tabs.Screen name="progress" options={{ title: 'Progress' }} />
    </Tabs>
  );
}
