/** Font sizes are scalable logical units; line heights must grow with native text. */
export const typographyTokens = {
  families: { ios: 'Plus Jakarta Sans', android: 'Plus Jakarta Sans', web: 'Plus Jakarta Sans' },
  size: { caption: 13, body: 16, title: 20, heading: 28, display: 36 },
  lineHeight: { caption: 20, body: 24, title: 26, heading: 36, display: 44 },
  weight: { regular: '400', medium: '500', bold: '700', semibold: '600', brand: '800' },
  numericVariant: ['tabular-nums'],
} as const;
