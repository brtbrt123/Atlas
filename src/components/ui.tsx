import React, { useEffect, useState } from 'react';
import { AccessibilityInfo, ActivityIndicator, Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import type { TextProps, ViewProps } from 'react-native';
import { colors, layout, radius, typography } from '../theme/tokens';

export function Type({ tone = 'primary', variant = 'body', style, ...props }: TextProps & {
  tone?: 'primary' | 'muted' | 'accent' | 'danger';
  variant?: 'body' | 'caption' | 'title' | 'heading' | 'display';
}) {
  return <Text {...props} style={[styles.text, { color: tone === 'primary' ? colors.text : colors[tone], fontSize: typography.size[variant] }, variant !== 'body' && variant !== 'caption' && styles.bold, style]} />;
}
export function Button({ label, onPress, variant = 'primary', disabled = false, busy = false }: {
  label: string; onPress: () => void; variant?: 'primary' | 'secondary' | 'danger'; disabled?: boolean; busy?: boolean;
}) {
  return <Pressable accessibilityRole="button" accessibilityLabel={label} accessibilityState={{ disabled: disabled || busy, busy }}
    disabled={disabled || busy} onPress={onPress}
    style={({ pressed }) => [styles.button, variant === 'primary' ? styles.primary : styles.secondary, (disabled || busy) && styles.disabled, pressed && styles.pressed]}>
    {busy && <ActivityIndicator color={variant === 'primary' ? colors.background : colors.text} />}
    <Type style={[styles.bold, variant === 'primary' && { color: colors.background }, variant === 'danger' && { color: colors.danger }]}>{label}</Type>
  </Pressable>;
}
export function Card({ style, ...props }: ViewProps) { return <View {...props} style={[styles.card, style]} />; }
export function Screen({ children }: React.PropsWithChildren) {
  return <ScrollView style={styles.screen} contentContainerStyle={styles.content} keyboardShouldPersistTaps="handled" automaticallyAdjustKeyboardInsets>
    <View style={styles.column}>{children}</View>
  </ScrollView>;
}
export function Section({ title, children }: React.PropsWithChildren<{ title: string }>) {
  return <View style={styles.section}><Type variant="title" accessibilityRole="header">{title}</Type>{children}</View>;
}
export function Feedback({ kind, title, detail, onRetry }: {
  kind: 'loading' | 'empty' | 'error' | 'success'; title: string; detail?: string; onRetry?: () => void;
}) {
  return <Card accessibilityLiveRegion="polite">
    {kind === 'loading' && <ActivityIndicator color={colors.accent} />}
    <Type variant="title" tone={kind === 'error' ? 'danger' : 'primary'}>{title}</Type>
    {detail && <Type tone="muted">{detail}</Type>}
    {onRetry && <Button label="Try again" variant="secondary" onPress={onRetry} />}
  </Card>;
}
/** Available to future motion consumers; the initial UI has no automatic animations. */
export function useReducedMotion() {
  const [reduced, setReduced] = useState(true);
  useEffect(() => {
    let mounted = true;
    AccessibilityInfo.isReduceMotionEnabled().then(value => { if (mounted) setReduced(value); }).catch(() => {});
    const subscription = AccessibilityInfo.addEventListener('reduceMotionChanged', setReduced);
    return () => { mounted = false; subscription.remove(); };
  }, []);
  return reduced;
}
export const styles = StyleSheet.create({
  text: { fontFamily: typography.family, lineHeight: undefined, flexShrink: 1 },
  bold: { fontWeight: '700' },
  button: { minHeight: layout.minTouch, borderRadius: radius.input, paddingHorizontal: 16, paddingVertical: 14, flexDirection: 'row', gap: 8, alignItems: 'center', justifyContent: 'center' },
  primary: { backgroundColor: colors.accent }, secondary: { backgroundColor: colors.elevated, borderWidth: 1, borderColor: colors.border },
  disabled: { opacity: 0.5 }, pressed: { opacity: 0.75 },
  card: { backgroundColor: colors.surface, borderRadius: radius.card, padding: 20, gap: 16, borderWidth: 1, borderColor: colors.border },
  screen: { flex: 1, backgroundColor: colors.background },
  content: { paddingHorizontal: layout.gutter, paddingTop: 24, paddingBottom: 40, flexGrow: 1 },
  column: { width: '100%', maxWidth: layout.maxWidth, alignSelf: 'center', gap: 32 },
  section: { gap: 16 },
});
