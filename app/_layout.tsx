import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';

import { DatabaseGate } from '../src/navigation/DatabaseGate';
import { colors } from '../src/theme/tokens';

// Root layout (Claude-owned route config). DatabaseGate gates every route until the database
// is open and migrated (FND-11). Tabs are the main shell; the active workout, routine
// builder, exercise detail and settings are pushed over them.
export default function RootLayout() {
  return (
    <DatabaseGate>
      <StatusBar style="light" />
      <Stack
        screenOptions={{
          headerStyle: { backgroundColor: colors.surface },
          headerTintColor: colors.text,
          contentStyle: { backgroundColor: colors.background },
        }}
      >
        <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
        <Stack.Screen name="session/active" options={{ title: 'Workout', gestureEnabled: false }} />
        <Stack.Screen name="routine/[id]" options={{ title: 'Routine' }} />
        <Stack.Screen name="exercise/[id]" options={{ title: 'Exercise' }} />
        <Stack.Screen name="settings" options={{ title: 'Settings' }} />
      </Stack>
    </DatabaseGate>
  );
}
