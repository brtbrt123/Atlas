import React, { useState } from 'react';
import { Pressable, StyleSheet, TextInput, View, Image } from 'react-native';
import type { TextInputProps } from 'react-native';
import { Type } from '../../components/ui';
import { equipmentImage } from './exercise-assets';
import Svg, { Path } from 'react-native-svg';
import { colors, componentVariants, layout, radius, space, typography } from '../../theme/tokens';

export const displayLabel = (value: string) => value.split('_').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ');
export const trackingLabels = { weight_reps: 'Weight & reps', bodyweight_reps: 'Bodyweight & reps', duration: 'Duration', distance_duration: 'Distance & duration' };

const iconPaths = {
  plus: 'M12 4V20M4 12H20',
  search: 'M17 10C17 19 3 19 3 10C3 1 17 1 17 10M15 15L21 21',
  filter: 'M3 7H13M17 7H21M13 4V10M3 17H7M11 17H21M11 14V20',
  back: 'M15 5L8 12L15 19',
  close: 'M6 6L18 18M18 6L6 18',
  next: 'M9 6L15 12L9 18',
};
export function ScreenIcon({ name, color = colors.muted }: { name: keyof typeof iconPaths; color?: string }) {
  return <Svg width={20} height={20} viewBox="0 0 24 24"><Path d={iconPaths[name]} fill="none" stroke={color} strokeWidth={1.8} strokeLinecap="round" strokeLinejoin="round" /></Svg>;
}
export function IconButton({ name, label, onPress, primary = false, disabled = false }: { name: keyof typeof iconPaths; label: string; onPress: () => void; primary?: boolean; disabled?: boolean }) {
  return <Pressable accessibilityRole="button" accessibilityLabel={label} accessibilityState={{ disabled }} disabled={disabled} onPress={onPress}
    style={{ width: 48, height: 48, borderRadius: primary ? 24 : 16, backgroundColor: primary ? colors.accent : colors.surface, alignItems: 'center', justifyContent: 'center' }}>
    <ScreenIcon name={name} color={primary ? colors.onAccent : colors.text} />
  </Pressable>;
}

export function EquipmentTile({ equipment, selected, disabled = false, onPress }: { equipment: string; selected: boolean; disabled?: boolean; onPress: () => void }) {
  return <Pressable accessibilityRole="button" accessibilityLabel={displayLabel(equipment)} accessibilityState={{ selected, disabled }} disabled={disabled} onPress={onPress}
    style={{ width: '30%', padding: 8, borderRadius: radius.input, backgroundColor: selected ? colors.accentSoft : colors.surface, borderWidth: 1, borderColor: selected ? colors.accentText : colors.surface, alignItems: 'center', gap: 4, minHeight: 100 }}>
    <Image source={equipmentImage(equipment)} style={{ width: 60, height: 60 }} resizeMode="contain" />
    <Type variant="caption" style={{ textAlign: 'center', color: selected ? colors.onAccent : colors.text }}>{displayLabel(equipment)}</Type>
  </Pressable>;
}

export function Choice({ label, selected, onPress, disabled = false }: { label: string; selected: boolean; onPress: () => void; disabled?: boolean }) {
  return <Pressable accessibilityRole="button" accessibilityLabel={label} accessibilityState={{ selected, disabled }} disabled={disabled} onPress={onPress}
    style={({ pressed }) => [s.choice, selected && s.selected, pressed && { opacity: componentVariants.state.pressedOpacity }]}>
    <Type style={{ color: selected ? colors.onAccent : colors.text, fontSize: 14, lineHeight: 20 }}>{label}</Type>
  </Pressable>;
}

export function Field({ label, error, style, hideLabel = false, ...props }: TextInputProps & { label: string; error?: string; hideLabel?: boolean }) {
  const [focused, setFocused] = useState(false);
  const recipe = componentVariants.input[error ? 'invalid' : focused ? 'focused' : 'default'];
  return <View style={{ gap: space.sm }}>
    {!hideLabel && <Type variant="caption" tone="muted">{label}</Type>}
    <TextInput {...props} accessibilityLabel={label} accessibilityHint={error || props.accessibilityHint} placeholderTextColor={colors.muted} selectionColor={colors.accent}
      onFocus={event => { setFocused(true); props.onFocus?.(event); }} onBlur={event => { setFocused(false); props.onBlur?.(event); }}
      style={[s.field, { borderColor: recipe.border }, style]} />
    {error && <Type tone="danger" accessibilityLiveRegion="polite">{error}</Type>}
  </View>;
}

export const s = StyleSheet.create({
  fill: { flex: 1, backgroundColor: colors.background },
  content: { paddingHorizontal: layout.gutter, paddingTop: 12, paddingBottom: 24, gap: space.lg, width: '100%', maxWidth: layout.maxWidth, alignSelf: 'center', flexGrow: 1 },
  stack: { gap: space.lg }, wrap: { flexDirection: 'row', flexWrap: 'wrap', gap: space.sm },
  choice: { minHeight: layout.minTouch, minWidth: layout.minTouch, paddingHorizontal: 12, paddingVertical: 8, borderWidth: 1, borderColor: colors.muted, borderRadius: radius.pill, justifyContent: 'center' },
  selected: { borderColor: colors.accentText, backgroundColor: colors.accent },
  field: { minHeight: layout.minTouch, padding: space.md, borderWidth: 1, borderRadius: radius.input, color: colors.text, backgroundColor: colors.background, fontFamily: typography.family, fontSize: typography.size.body, lineHeight: typography.lineHeight.body },
  row: { paddingVertical: space.lg, borderBottomWidth: 1, borderBottomColor: colors.border, gap: space.sm, minHeight: layout.minTouch },
});
