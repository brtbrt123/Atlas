import React from 'react';
import { StyleSheet, View } from 'react-native';
import { Button, Card, Feedback, Screen, Section, Type } from '../../components/ui';
import { colors } from '../../theme/tokens';
import type { HomeModel, LoadState } from '../preview/contracts';

export function HomeScreen({ model, state = 'ready', onStart, onResume, onRetry }: {
  model: HomeModel; state?: LoadState; onStart: () => void; onResume: () => void; onRetry: () => void;
}) {
  const count = model.week.reduce((total, day) => total + day.sessions, 0);
  return <Screen>
    <View style={s.brand}><Type style={s.wordmark}>ATLAS</Type><Type tone="muted" variant="caption">Personal training log</Type></View>
    <View style={s.intro}><Type variant="heading" accessibilityRole="header">Make time for{ '\n' }your next set.</Type><Type tone="muted">Your training, at your pace.</Type></View>
    {state === 'loading' ? <Feedback kind="loading" title="Loading your training" /> : state === 'error' ? <Feedback kind="error" title="Training couldn’t load" detail="Try loading your training again." onRetry={onRetry} /> : <>
      <Section title="This week">
        <View style={s.week}>
          {model.week.map(day => <View key={day.label} style={s.day} accessible accessibilityLabel={`${day.label}${day.isToday ? ', today' : ''}: ${day.sessions} workouts`}>
            <Type variant="caption" tone={day.isToday ? 'primary' : 'muted'}>{day.label}</Type>
            <View style={[s.marker, day.sessions > 0 && s.trained, day.isToday && s.today]}><Type style={day.sessions > 0 ? s.dark : undefined}>{day.sessions > 0 ? '✓' : '–'}</Type></View>
          </View>)}
        </View>
        <Type tone="muted">{count === 0 ? 'A fresh week. Start when you’re ready.' : `${count} ${count === 1 ? 'workout' : 'workouts'} logged this week`}</Type>
      </Section>
      <Card><Type variant="title">{model.activeWorkoutName ?? 'Ready when you are.'}</Type><Type tone="muted">{model.activeWorkoutName ? 'Pick up your session where you left off.' : 'Start an empty session and build as you go.'}</Type><Button label={model.activeWorkoutName ? 'Resume workout' : 'Start workout'} onPress={model.activeWorkoutName ? onResume : onStart} /></Card>
      <Section title="Last workout">
        {model.recent ? <Card><Type variant="caption" tone="muted">{model.recent.date}</Type><Type variant="title">{model.recent.name}</Type><View style={s.metrics}><Type>{model.recent.duration}</Type><Type tone="muted">{model.recent.sets} completed sets</Type></View></Card> : <Feedback kind="empty" title="Your training starts here" detail="Finish your first workout to see it here." />}
      </Section>
    </>}
  </Screen>;
}
const s = StyleSheet.create({
  brand: { gap: 4 }, wordmark: { fontSize: 24, fontWeight: '900', letterSpacing: 3 }, intro: { gap: 12 },
  week: { flexDirection: 'row', justifyContent: 'space-between', gap: 4 }, day: { flex: 1, alignItems: 'center', gap: 12 },
  marker: { minHeight: 36, minWidth: 28, padding: 4, borderRadius: 8, alignItems: 'center', justifyContent: 'center', backgroundColor: colors.surface },
  trained: { backgroundColor: colors.accent }, today: { borderWidth: 2, borderColor: colors.text }, dark: { color: colors.background, fontWeight: '700' },
  metrics: { flexDirection: 'row', flexWrap: 'wrap', gap: 16 },
});
