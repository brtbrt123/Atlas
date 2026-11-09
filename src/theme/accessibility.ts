/** Targets are logical units; contrast values are WCAG ratios. */
export const accessibility = {
  minTouchTarget: 48,
  targetGap: 8,
  textContrast: 4.5,
  essentialGraphicContrast: 3,
  allowFontScaling: true,
  reviewFontScale: 2,
  reviewWidths: [320, 390, 768],
  colorOnlyFeedback: false,
} as const;
