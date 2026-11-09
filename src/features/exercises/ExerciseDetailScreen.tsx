import React from 'react';
import { View } from 'react-native';
import { Button, Card, Feedback, Screen, Section, Type } from '../../components/ui';
import type { Exercise } from '../../types';
import { displayLabel, trackingLabels, s } from './exercise-ui';

export type ExerciseDetailProps = {
  exercise: Exercise | null;
  state: 'loading' | 'ready' | 'error';
  // Display-ready history proposal until EXL-05 defines the adapter. No invented domain API.
  recentPerformance: { state: 'unavailable' | 'loading' | 'empty' | 'ready' | 'error'; summary?: string };
  onRetry: () => void;
  onRetryHistory: () => void;
  onEdit: () => void;
};

export function ExerciseDetailScreen({ exercise, state, recentPerformance, onRetry, onRetryHistory, onEdit }: ExerciseDetailProps) {
  if (state !== 'ready' || !exercise) return <Screen><Feedback kind={state === 'ready' ? 'empty' : state} title={state === 'loading' ? 'Loading exercise' : state === 'error' ? 'Couldn’t load exercise' : 'Exercise not found'} onRetry={state === 'error' ? onRetry : undefined} /></Screen>;
  return <Screen>
    <View style={s.stack}><Type variant="caption" tone="accent">{exercise.isCustom ? 'CUSTOM EXERCISE' : 'EXERCISE LIBRARY'}{exercise.isArchived ? ' · ARCHIVED' : ''}</Type>
      <Type variant="heading" accessibilityRole="header">{exercise.name}</Type><Type tone="muted">{exercise.equipment ? displayLabel(exercise.equipment) : 'Equipment not specified'} · {trackingLabels[exercise.trackingType]}</Type>
      {exercise.isCustom && <Button label="Edit exercise" variant="secondary" onPress={onEdit} />}
    </View>
    <Section title="Muscles"><Card>{(['primary', 'secondary'] as const).map(role => <View key={role} style={s.stack}><Type variant="caption" tone="muted">{displayLabel(role)}</Type><Type>{exercise.muscles.filter(m => m.role === role).map(m => displayLabel(m.muscle)).join(', ') || 'Not specified'}</Type></View>)}</Card></Section>
    <Section title="Notes"><Type tone={exercise.notes ? 'primary' : 'muted'}>{exercise.notes || 'No notes for this exercise.'}</Type></Section>
    <Section title="Recent performance">{recentPerformance.state === 'ready' ? <Card><Type numeric>{recentPerformance.summary}</Type></Card> : <Feedback
      kind={recentPerformance.state === 'loading' ? 'loading' : recentPerformance.state === 'error' ? 'error' : 'empty'}
      title={{ unavailable: 'History not connected', loading: 'Loading recent performance', empty: 'No completed sessions yet', error: 'Couldn’t load recent performance' }[recentPerformance.state]}
      detail={recentPerformance.state === 'unavailable' ? 'Recent performance will appear when the history adapter is available.' : undefined}
      onRetry={recentPerformance.state === 'error' ? onRetryHistory : undefined} />}</Section>
  </Screen>;
}
