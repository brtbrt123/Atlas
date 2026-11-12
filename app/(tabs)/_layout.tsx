import { Link, Tabs } from 'expo-router';
import { Text } from 'react-native';

import { colors } from '../../src/theme/tokens';
import { navigationChrome, TabIcon } from '../../src/components/NavigationChrome';

// Tab shell. Switching tabs never discards the active workout: its state lives in SQLite and the
// store, not in a screen (CLAUDE.md). Visual styling of the chrome is Codex's task (DS-06).
export default function TabsLayout() {
  return (
    <Tabs
      screenOptions={{
        ...navigationChrome,
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: 'Home',
          tabBarIcon: ({ color }) => <TabIcon name="Home" color={color} />,
          headerRight: () => (
            <Link href="/settings" accessibilityRole="link" accessibilityLabel="Settings" style={{ marginRight: 16 }}>
              <Text style={{ color: colors.text }}>Settings</Text>
            </Link>
          ),
        }}
      />
      <Tabs.Screen name="exercises" options={{ title: 'Exercises', tabBarIcon: ({ color }) => <TabIcon name="Exercises" color={color} /> }} />
      <Tabs.Screen name="routines" options={{ title: 'Routines', tabBarIcon: ({ color }) => <TabIcon name="Routines" color={color} /> }} />
      <Tabs.Screen name="history" options={{ title: 'History', tabBarIcon: ({ color }) => <TabIcon name="History" color={color} /> }} />
      <Tabs.Screen name="progress" options={{ title: 'Progress', tabBarIcon: ({ color }) => <TabIcon name="Progress" color={color} /> }} />
    </Tabs>
  );
}
