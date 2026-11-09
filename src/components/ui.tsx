import React, { useEffect, useState } from 'react';
import { AccessibilityInfo, ActivityIndicator, Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import type { TextProps, ViewProps } from 'react-native';
import { colors, componentVariants, layout, radius, space, typography } from '../theme/tokens';

export function Type({ tone = 'primary', variant = 'body', numeric = false, style, ...props }: TextProps & {
  tone?: 'primary' | 'muted' | 'accent' | 'danger';
  variant?: 'body' | 'caption' | 'title' | 'heading' | 'display';
  numeric?: boolean;
}) {
  return <Text {...props} style={[styles.text, { color: tone === 'primary' ? colors.text : colors[tone], fontSize: typography.size[variant], lineHeight: typography.lineHeight[variant] }, variant !== 'body' && variant !== 'caption' && styles.bold, numeric && styles.numeric, style]} />;
}
export function Button({ label, onPress, variant = 'primary', disabled = false, busy = false, accessibilityHint }: {
  label: string; onPress: () => void; variant?: keyof typeof componentVariants.button; disabled?: boolean; busy?: boolean; accessibilityHint?: string;
}) {
  const recipe = componentVariants.button[variant];
  return <Pressable accessibilityRole="button" accessibilityLabel={label} accessibilityHint={accessibilityHint} accessibilityState={{ disabled: disabled || busy, busy }}
    disabled={disabled || busy} onPress={onPress}
    style={({ pressed }) => [styles.button, { backgroundColor: recipe.background, borderColor: recipe.border }, disabled && styles.disabled, pressed && styles.pressed]}>
    {busy && <ActivityIndicator accessible={false} color={recipe.foreground} />}
    <Type style={[styles.bold, { color: recipe.foreground, textAlign: 'center' }]}>{label}</Type>
  </Pressable>;
}
export function Card({ style, variant = 'default', ...props }: ViewProps & { variant?: keyof typeof componentVariants.card }) {
  const recipe = componentVariants.card[variant];
  return <View {...props} style={[styles.card, { backgroundColor: recipe.background, borderColor: recipe.border }, style]} />;
}
export function Screen({ children }: React.PropsWithChildren) {
  return <ScrollView style={styles.screen} contentContainerStyle={styles.content} keyboardShouldPersistTaps="handled" contentInsetAdjustmentBehavior="automatic" automaticallyAdjustKeyboardInsets>
    <View style={styles.column}>{children}</View>
  </ScrollView>;
}
export function Section({ title, children }: React.PropsWithChildren<{ title: string }>) {
  return <View style={styles.section}><Type variant="title" accessibilityRole="header">{title}</Type>{children}</View>;
}
export function Feedback({ kind, title, detail, onRetry }: {
  kind: 'loading' | 'empty' | 'error' | 'success'; title: string; detail?: string; onRetry?: () => void;
}) {
  return <Card accessibilityLiveRegion="polite" accessibilityState={{ busy: kind === 'loading' }}>
    {kind === 'loading' && <ActivityIndicator accessible={false} color={colors.accent} />}
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
  text: { fontFamily: typography.family, flexShrink: 1 },
  bold: { fontWeight: typography.weight.bold }, numeric: { fontVariant: ['tabular-nums'] },
  button: { minHeight: layout.minTouch, minWidth: layout.minTouch, borderRadius: radius.input, borderWidth: 1, paddingHorizontal: space.lg, paddingVertical: space.md, flexDirection: 'row', gap: space.sm, alignItems: 'center', justifyContent: 'center' },
  disabled: { opacity: componentVariants.state.disabledOpacity }, pressed: { opacity: componentVariants.state.pressedOpacity },
  card: { borderRadius: radius.card, padding: layout.gutter, gap: space.lg, borderWidth: 1 },
  screen: { flex: 1, backgroundColor: colors.background },
  content: { paddingHorizontal: layout.gutter, paddingTop: space.xl, paddingBottom: space.xxl + space.sm, flexGrow: 1 },
  column: { width: '100%', maxWidth: layout.maxWidth, alignSelf: 'center', gap: space.xxl },
  section: { gap: space.lg },
});
