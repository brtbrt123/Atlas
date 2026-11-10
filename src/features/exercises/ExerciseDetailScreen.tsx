import React from 'react';
import { View, Image, ScrollView } from 'react-native';
import { Button, Card, Feedback, Screen, Type } from '../../components/ui';
import type { Exercise } from '../../types';
import { BodyMap, muscleColor } from './BodyMap';
import { equipmentImage } from './exercise-assets';
import { colors, radius } from '../../theme/tokens';
import Svg, { Polyline, Line, Circle } from 'react-native-svg';
import { displayLabel, trackingLabels, s } from './exercise-ui';

export type ExerciseDetailProps = {
  exercise: Exercise | null;
  state: 'loading' | 'ready' | 'error';
  // Display-ready history proposal until EXL-05 defines the adapter. No invented domain API.
  recentPerformance: { state: 'unavailable' | 'loading' | 'empty' | 'ready' | 'error'; summary?: string };
  onRetry: () => void;
  onRetryHistory: () => void;
  onEdit: () => void;
  performance?: { best: string; last: string; sessions: number; topSets: number[]; sets: string[] };
};

export function ExerciseDetailScreen({ exercise, state, recentPerformance, onRetry, onRetryHistory, onEdit, performance }: ExerciseDetailProps) {
  if (state !== 'ready' || !exercise) return <Screen><Feedback kind={state === 'ready' ? 'empty' : state} title={state === 'loading' ? 'Loading exercise' : state === 'error' ? 'Couldn’t load exercise' : 'Exercise not found'} onRetry={state === 'error' ? onRetry : undefined} /></Screen>;
  return <ScrollView style={s.fill} contentContainerStyle={[s.content, { gap: 16 }]} contentInsetAdjustmentBehavior="automatic">
    <Image source={equipmentImage(exercise.equipment)} style={{ width: '100%', height: 190, backgroundColor: muscleColor(exercise.muscles.find(m => m.role === 'primary')?.muscle || 'chest') + '30', borderRadius: radius.card }} resizeMode="contain" /><View style={{ gap: 8 }}>
      <View style={s.wrap}>{[exercise.isCustom ? 'Custom' : 'Built-in', exercise.equipment ? displayLabel(exercise.equipment) : 'Unspecified', trackingLabels[exercise.trackingType]].map(tag => <View key={tag} style={{ paddingHorizontal: 10, paddingVertical: 5, borderWidth: 1, borderColor: colors.border, borderRadius: 24, backgroundColor: colors.surface }}><Type variant="caption">{tag}</Type></View>)}</View>
      <Type variant="heading" accessibilityRole="header">{exercise.name}</Type>
      <Type variant="caption">{exercise.muscles.map(item => displayLabel(item.muscle)).join(' - ') || 'Muscles not specified'}</Type>
      {exercise.isCustom && <Button label="Edit exercise" variant="secondary" onPress={onEdit} />}
    </View>
    {performance && <View style={s.stack}>
      <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 8 }}>{[['Best set', performance.best], ['Last', performance.last], ['Sessions', String(performance.sessions)]].map(([label, value]) => <Card key={label} style={{ flex: 1, minWidth: 90, padding: 12, gap: 6 }}><Type variant="caption" tone="muted">{label}</Type><Type numeric style={{ fontWeight: '800' }}>{value}</Type></Card>)}</View>
      {performance.topSets.length > 1 && <Card style={{ gap: 8, padding: 16 }}><Type style={{ fontWeight: '700' }}>Top set</Type><Type variant="caption" tone="muted">Last {performance.topSets.length} sessions</Type><Type variant="title" numeric>{performance.best}</Type>
        <Svg width="100%" height={100} viewBox="0 0 300 100" accessibilityLabel="Top set trend">{[20, 50, 80].map(y => <Line key={y} x1={10} x2={290} y1={y} y2={y} stroke={colors.border} strokeDasharray="2 3" />)}<Polyline points={performance.topSets.map((value, index) => `${10 + index * 280 / (performance.topSets.length - 1)},${85 - value / Math.max(...performance.topSets, 1) * 70}`).join(' ')} fill="none" stroke={colors.accentText} strokeWidth={2} />{performance.topSets.map((value, index) => <Circle key={index} cx={10 + index * 280 / (performance.topSets.length - 1)} cy={85 - value / Math.max(...performance.topSets, 1) * 70} r={3} fill={colors.surface} stroke={colors.accentText} />)}</Svg>
      </Card>}
    </View>}
    {recentPerformance.state === 'empty' && <Card style={{ alignItems: 'center', gap: 8, borderWidth: 1, borderStyle: 'dashed', borderColor: colors.border }}>
      <Image source={require('../../../assets/images/empty/no-sets.png')} style={{ width: 150, height: 120 }} resizeMode="contain" />
      <Type style={{ fontWeight: '700' }}>No sets yet</Type><Type variant="caption" tone="muted">No completed sessions yet</Type>
    </Card>}
    <Card style={{ gap: 12, padding: 16 }}>
      <Type style={{ fontWeight: '700' }} accessibilityRole="header">Muscles worked</Type>
      <View style={{ flexDirection: 'row', alignItems: 'center', gap: 12 }}>
        <BodyMap muscles={exercise.muscles} size={130} />
        <View style={{ flex: 1, gap: 12 }}>{(['primary', 'secondary'] as const).map(role => <View key={role} style={{ gap: 6 }}>
          <Type variant="caption" tone="muted">{displayLabel(role)}</Type>
          {exercise.muscles.filter(item => item.role === role).map(item => <View key={item.muscle} style={{ flexDirection: 'row', alignItems: 'center', gap: 6 }}><View style={{ width: 8, height: 8, borderRadius: 3, backgroundColor: muscleColor(item.muscle) }} /><Type variant="caption">{displayLabel(item.muscle)}</Type></View>)}
        </View>)}</View>
      </View>
    </Card>
    {recentPerformance.state === 'ready' ? <Card style={{ padding: 16, gap: 12 }}>
      <Type style={{ fontWeight: '700' }} accessibilityRole="header">Recent sessions</Type>
      <Type variant="caption">{recentPerformance.summary}</Type>
      {performance && <View style={s.wrap}>{performance.sets.map((set, index) => <View key={index} style={{ backgroundColor: colors.background, borderRadius: 8, padding: 8 }}><Type variant="caption" numeric>{index + 1}  {set}</Type></View>)}</View>}
    </Card> : recentPerformance.state !== 'empty' && <Feedback
      kind={recentPerformance.state === 'loading' ? 'loading' : recentPerformance.state === 'error' ? 'error' : 'empty'}
      title={{ unavailable: 'History not connected', loading: 'Loading recent performance', error: 'Couldn’t load recent performance' }[recentPerformance.state]}
      onRetry={recentPerformance.state === 'error' ? onRetryHistory : undefined} />}
    <Card style={{ padding: 16, gap: 4 }}><Type variant="caption" tone="muted">Setup note</Type><Type variant="caption">{exercise.notes || 'No notes for this exercise.'}</Type></Card>
  </ScrollView>;
}
