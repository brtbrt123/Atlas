import { Platform } from 'react-native';
import { typographyTokens } from './typography';

export { colors, muscleColors, cardShadow } from './colors';
export { space, layout } from './spacing';
export { radius } from './radii';
export { motion } from './motion';
export { accessibility } from './accessibility';
export { componentVariants } from './variants';
export { typographyTokens } from './typography';

// Preserve the earlier draft's import API while keeping platform-independent token data separate.
export const typography = {
  family: Platform.select({ ...typographyTokens.families, default: typographyTokens.families.web }),
  size: typographyTokens.size,
  lineHeight: typographyTokens.lineHeight,
  weight: typographyTokens.weight,
} as const;
