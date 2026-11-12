import React from 'react';
import type { ColorValue } from 'react-native';
import Svg, { Path } from 'react-native-svg';
import { colors, typography } from '../theme/tokens';

const paths = {
  Home: 'M3 11L12 3L21 11V21H15V15H9V21H3Z',
  Exercises: 'M2 9V15M5 6V18M5 12H19M19 6V18M22 9V15',
  Routines: 'M8 5H21M8 12H21M8 19H21M3 5H4M3 12H4M3 19H4',
  History: 'M12 3C0 3 0 21 12 21C24 21 24 3 12 3M12 7V12L16 15',
  Progress: 'M3 19L10 11L14 15L22 5M16 5H22V11',
};
export function TabIcon({ name, color }: { name: keyof typeof paths; color: ColorValue | null }) {
  return <Svg width={24} height={24} viewBox="0 0 24 24"><Path d={paths[name]} fill="none" stroke={color ?? colors.muted} strokeWidth={1.8} strokeLinecap="round" strokeLinejoin="round" /></Svg>;
}
export const navigationChrome = {
  headerStyle: { backgroundColor: colors.background },
  headerTintColor: colors.text,
  headerTitleStyle: { fontFamily: typography.family, fontWeight: '700' as const },
  headerShadowVisible: false,
  tabBarActiveTintColor: colors.accentText,
  tabBarInactiveTintColor: colors.muted,
  tabBarStyle: { backgroundColor: colors.surface, borderTopColor: colors.border },
  tabBarLabelStyle: { fontFamily: typography.family, fontSize: 12 },
};
