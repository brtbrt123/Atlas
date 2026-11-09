import { colors } from './colors';

/** Semantic recipes for future primitives. These do not change the existing UI draft. */
export const componentVariants = {
  button: {
    primary: { background: colors.accent, foreground: colors.background, border: colors.accent },
    secondary: { background: colors.elevated, foreground: colors.text, border: colors.muted },
    danger: { background: colors.surface, foreground: colors.danger, border: colors.danger },
  },
  input: {
    default: { background: colors.background, foreground: colors.text, border: colors.muted },
    focused: { background: colors.background, foreground: colors.text, border: colors.accent },
    invalid: { background: colors.background, foreground: colors.text, border: colors.danger },
    completed: { background: colors.surface, foreground: colors.accent, border: colors.muted },
  },
  card: { default: { background: colors.surface, border: colors.border }, elevated: { background: colors.elevated, border: colors.border } },
  state: { pressedOpacity: 0.85, disabledOpacity: 0.5, focusRingWidth: 2 },
} as const;
