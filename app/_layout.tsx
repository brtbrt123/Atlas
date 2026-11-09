import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';

// Root layout. Route files stay thin (see .claude/rules/architecture.md).
export default function RootLayout() {
  return (
    <>
      <StatusBar style="light" />
      <Stack screenOptions={{ headerShown: false, contentStyle: { backgroundColor: '#101418' } }} />
    </>
  );
}
