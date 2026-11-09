import React, { useState } from 'react';
import { Pressable, StyleSheet, TextInput, View } from 'react-native';
import type { TextInputProps } from 'react-native';
import { Type } from '../../components/ui';
import { colors, componentVariants, layout, radius, space, typography } from '../../theme/tokens';

export const displayLabel = (value: string) => value.split('_').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ');
export const trackingLabels = { weight_reps: 'Weight & reps', bodyweight_reps: 'Bodyweight & reps', duration: 'Duration', distance_duration: 'Distance & duration' };

export function Choice({ label, selected, onPress, disabled = false }: { label: string; selected: boolean; onPress: () => void; disabled?: boolean }) {
  return <Pressable accessibilityRole="button" accessibilityLabel={label} accessibilityState={{ selected, disabled }} disabled={disabled} onPress={onPress}
    style={({ pressed }) => [s.choice, selected && s.selected, pressed && { opacity: componentVariants.state.pressedOpacity }]}>
    <Type style={{ color: selected ? colors.accent : colors.text }}>{label}</Type>
  </Pressable>;
}

export function Field({ label, error, style, ...props }: TextInputProps & { label: string; error?: string }) {
  const [focused, setFocused] = useState(false);
  const recipe = componentVariants.input[error ? 'invalid' : focused ? 'focused' : 'default'];
  return <View style={{ gap: space.sm }}>
    <Type variant="caption" tone="muted">{label}</Type>
    <TextInput {...props} accessibilityLabel={label} accessibilityHint={error || props.accessibilityHint} placeholderTextColor={colors.muted} selectionColor={colors.accent}
      onFocus={event => { setFocused(true); props.onFocus?.(event); }} onBlur={event => { setFocused(false); props.onBlur?.(event); }}
      style={[s.field, { borderColor: recipe.border }, style]} />
    {error && <Type tone="danger" accessibilityLiveRegion="polite">{error}</Type>}
  </View>;
}

export const s = StyleSheet.create({
  fill: { flex: 1, backgroundColor: colors.background },
  content: { padding: layout.gutter, gap: space.lg, width: '100%', maxWidth: layout.maxWidth, alignSelf: 'center', flexGrow: 1 },
  stack: { gap: space.lg }, wrap: { flexDirection: 'row', flexWrap: 'wrap', gap: space.sm },
  choice: { minHeight: layout.minTouch, minWidth: layout.minTouch, paddingHorizontal: space.md, paddingVertical: space.md, borderWidth: 1, borderColor: colors.muted, borderRadius: radius.input, justifyContent: 'center' },
  selected: { borderColor: colors.accent, backgroundColor: colors.surface },
  field: { minHeight: layout.minTouch, padding: space.md, borderWidth: 1, borderRadius: radius.input, color: colors.text, backgroundColor: colors.background, fontFamily: typography.family, fontSize: typography.size.body, lineHeight: typography.lineHeight.body },
  row: { paddingVertical: space.lg, borderBottomWidth: 1, borderBottomColor: colors.border, gap: space.sm, minHeight: layout.minTouch },
});
