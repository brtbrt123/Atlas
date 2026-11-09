// Development-only check (DS-09, DEC-021): proves that the development build embeds Plus Jakarta Sans
// (weights 400-800, registered as one family by the expo-font config plugin) and links react-native-svg.
// Each row measures the same text in Plus Jakarta Sans and in the system font: equal widths mean the
// family silently fell back to the system font. Loaded only from app/dev/foundations.tsx inside
// `if (__DEV__)`, so it never ships in production bundles.
import { useState } from 'react';
import { ScrollView, StyleSheet, Text, View } from 'react-native';
import Svg, { Circle, Path, Rect } from 'react-native-svg';

const FAMILY = 'Plus Jakarta Sans';
const SAMPLE = 'Bench 22.5 kg';
const WEIGHTS = ['400', '500', '600', '700', '800'] as const;
type Weight = (typeof WEIGHTS)[number];

// The two chest paths of assets/images/body-map/front.svg (viewBox 100 x 180).
const CHEST = [
  'M38.7 35.2C38.9 35.2 38.8 35.1 40.1 35.2C41.3 35.4 45.1 36 46.3 36.2C47.5 36.4 46.8 36.2 47.2 36.5C47.5 36.8 48.1 37.4 48.4 37.9C48.6 38.3 48.7 38.6 48.8 39.2C48.9 39.7 49 40.1 49.1 41.4C49.2 42.7 49.2 45.6 49.2 47C49.2 48.5 49 49.3 48.9 50C48.7 50.7 48.5 51.1 48.2 51.5C48 51.9 47.8 52.1 47.3 52.3C46.8 52.6 46.4 52.8 45.4 53.1C44.4 53.3 42.5 53.6 41.3 53.7C40.2 53.8 39.1 53.8 38.4 53.7C37.7 53.7 37.7 53.7 37.1 53.4C36.5 53.1 35.5 52.5 34.9 52C34.2 51.5 33.7 50.9 33.3 50.3C32.8 49.7 32.6 49.3 32.2 48.6C31.8 47.9 31.1 46.7 30.8 46.1C30.6 45.5 30.4 45.6 30.7 45C31 44.4 31.7 43.9 32.4 42.7C33.2 41.5 34.4 38.9 35.2 37.8C36 36.7 36.6 36.4 37.2 36C37.8 35.6 38.3 35.5 38.6 35.3C38.8 35.2 38.4 35.2 38.7 35.2Z',
  'M59.9 35.2C60.2 35.2 60.9 35.2 61.2 35.2C61.5 35.3 61.4 35.1 62 35.5C62.5 36 63.7 36.5 64.7 37.8C65.7 39 67.1 42 67.8 43.2C68.5 44.4 69 44.6 69.2 45.1C69.4 45.6 69.3 45.5 69.1 46C68.9 46.4 68.4 47.2 68 48C67.6 48.7 67 49.7 66.5 50.3C66.1 50.9 65.8 51.3 65.4 51.7C64.9 52.1 64.5 52.5 64 52.8C63.5 53.1 63.2 53.3 62.5 53.5C61.8 53.7 60.8 53.8 59.8 53.8C58.9 53.8 57.8 53.7 56.7 53.5C55.7 53.3 54.1 53 53.3 52.8C52.6 52.5 52.6 52.5 52.2 52.1C51.8 51.8 51.4 51.4 51.1 50.6C50.9 49.9 50.8 48.9 50.7 47.6C50.6 46.2 50.6 43.6 50.7 42.2C50.8 40.8 51 39.9 51.1 39.2C51.3 38.4 51.4 38.1 51.6 37.7C51.9 37.2 52.4 36.7 52.7 36.5C53 36.3 52.4 36.4 53.6 36.2C54.7 36 58.8 35.5 59.8 35.3C60.9 35.2 59.7 35.2 59.9 35.2Z',
];

function WeightRow({ weight }: { weight: Weight }) {
  const [jakarta, setJakarta] = useState<number | null>(null);
  const [system, setSystem] = useState<number | null>(null);
  let verdict = 'measuring';
  if (jakarta !== null && system !== null) {
    verdict = Math.abs(jakarta - system) > 0.5 ? 'font active' : 'FALLBACK: same width as the system font';
  }
  return (
    <View style={styles.row}>
      <Text style={[styles.sample, { fontFamily: FAMILY, fontWeight: weight }]} onTextLayout={(e) => setJakarta(e.nativeEvent.lines[0]?.width ?? null)}>
        {SAMPLE}
      </Text>
      <Text style={[styles.sample, styles.system, { fontWeight: weight }]} onTextLayout={(e) => setSystem(e.nativeEvent.lines[0]?.width ?? null)}>
        {SAMPLE}
      </Text>
      <Text style={styles.meta}>{`${weight} · Jakarta ${jakarta?.toFixed(1) ?? '-'} · system ${system?.toFixed(1) ?? '-'} · ${verdict}`}</Text>
    </View>
  );
}

export function FontSvgCheck() {
  return (
    <ScrollView contentContainerStyle={styles.page}>
      <Text style={styles.heading}>Plus Jakarta Sans</Text>
      {WEIGHTS.map((w) => (
        <WeightRow key={w} weight={w} />
      ))}
      <Text style={styles.heading}>react-native-svg</Text>
      <Svg width={240} height={100} viewBox="0 0 240 100">
        <Rect x={0} y={0} width={110} height={100} rx={20} fill="#FF6961" />
        <Circle cx={180} cy={50} r={48} fill="#86C5FF" />
      </Svg>
      <Text style={styles.meta}>Chest paths from the body map</Text>
      <Svg width={240} height={131} viewBox="28 32 44 24">
        {CHEST.map((d) => (
          <Path key={d.slice(0, 20)} d={d} fill="#FFA987" />
        ))}
      </Svg>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  page: { padding: 20, gap: 12, backgroundColor: '#F6F6F8' },
  heading: { fontSize: 13, fontWeight: '700', color: '#6B6B77', marginTop: 8 },
  row: { gap: 2 },
  sample: { fontSize: 20, color: '#1D1D24', alignSelf: 'flex-start' },
  system: { color: '#6B6B77' },
  meta: { fontSize: 12, color: '#6B6B77' },
});
