/** Font sizes are scalable logical units; line heights must grow with native text. */
export const typographyTokens = {
  families: { ios: 'System', android: 'sans-serif', web: 'system-ui' },
  size: { caption: 13, body: 16, title: 22, heading: 32, display: 40 },
  lineHeight: { caption: 20, body: 24, title: 28, heading: 40, display: 48 },
  weight: { regular: '400', medium: '500', bold: '700', brand: '900' },
  numericVariant: ['tabular-nums'],
} as const;
