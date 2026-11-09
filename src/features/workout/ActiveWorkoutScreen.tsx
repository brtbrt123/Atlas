import React, { useEffect, useState } from 'react';
import { KeyboardAvoidingView, Platform, StyleSheet, TextInput, View, useWindowDimensions } from 'react-native';
import { Button, Card, Feedback, Screen, Type } from '../../components/ui';
import { colors } from '../../theme/tokens';
import type { LoadState, SetDraft, WorkoutActions, WorkoutModel } from '../preview/contracts';

export function isValidSet(set: SetDraft) {
  const decimal = /^\d+(\.\d+)?$/;
  return decimal.test(set.weight) && Number(set.weight) >= 0 && /^\d+$/.test(set.reps) && Number(set.reps) > 0 &&
    (set.rpe === '' || (decimal.test(set.rpe) && Number(set.rpe) >= 1 && Number(set.rpe) <= 10));
}
function useElapsed(startedAt: string) {
  const [now, setNow] = useState(() => Date.now());
  useEffect(() => { const timer = setInterval(() => setNow(Date.now()), 1000); return () => clearInterval(timer); }, []);
  const minutes = Math.max(0, Math.floor((now - Date.parse(startedAt)) / 60000));
  return Number.isFinite(minutes) ? `${minutes} min` : '—';
}
export function ActiveWorkoutScreen({ model, actions, state = 'ready', onRetry }: {
  model: WorkoutModel; actions: WorkoutActions; state?: LoadState; onRetry: () => void;
}) {
  const elapsed = useElapsed(model.startedAt);
  const { width, fontScale } = useWindowDimensions();
  const stacked = width < 360 || fontScale > 1.3;
  const [pending, setPending] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [confirm, setConfirm] = useState(false);
  const [finished, setFinished] = useState(false);
  const sets = model.exercises.flatMap(exercise => exercise.sets);
  const completed = sets.filter(set => set.completed).length;
  async function save(key: string, action: () => Promise<void>) {
    if (pending) return;
    setPending(key); setError(null);
    try { await action(); } catch { setError('Your changes couldn’t be saved. Try the action again.'); }
    finally { setPending(null); }
  }
  return <KeyboardAvoidingView style={s.fill} behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
    <Screen>
      <View style={s.header}><Type tone="accent" variant="caption">Active workout</Type><Type accessibilityRole="header" variant="heading">{model.name}</Type><Type tone="muted">{elapsed} elapsed · {completed} of {sets.length} sets complete</Type></View>
      {state === 'loading' ? <Feedback kind="loading" title="Restoring your session" /> : state === 'error' ? <Feedback kind="error" title="Session couldn’t load" detail="Reload before logging more sets." onRetry={onRetry} /> : finished ? <Feedback kind="success" title="Workout finished" detail="Your session is ready to review." /> : <>
        {error && <Feedback kind="error" title="Save failed" detail={error} />}
        {model.exercises.length === 0 && <Feedback kind="empty" title="No exercises yet" detail="Add exercises through the workout engine to begin logging sets." />}
        {model.exercises.map((exercise, index) => <Card key={exercise.id}>
          <View style={s.header}><Type tone="muted" variant="caption">Exercise {index + 1} · {exercise.equipment}</Type><Type variant="title" accessibilityRole="header">{exercise.name}</Type><Type tone="muted" variant="caption">{exercise.previous}</Type></View>
          {exercise.sets.length === 0 && <Type tone="muted">No sets planned for this exercise.</Type>}
          {exercise.sets.map((set, setIndex) => <View key={set.id} style={s.set}>
            <Type tone={set.completed ? 'accent' : 'primary'}>Set {setIndex + 1}{set.completed ? ' · Completed' : ''}</Type>
            <View style={[s.fields, stacked && s.stacked]}>
              {(['weight', 'reps', 'rpe'] as const).map(field => <View key={field} style={s.field}>
                <Type variant="caption" tone="muted">{field === 'weight' ? 'Weight (kg)' : field === 'reps' ? 'Reps' : 'RPE (optional)'}</Type>
                <TextInput value={set[field]} editable={!set.completed && pending === null} selectTextOnFocus
                  accessibilityLabel={`${exercise.name}, set ${setIndex + 1}, ${field === 'weight' ? 'weight in kilograms' : field === 'rpe' ? 'RPE, optional, 1 to 10' : 'repetitions'}`}
                  keyboardType={field === 'reps' ? 'number-pad' : 'decimal-pad'}
                  onChangeText={value => actions.onEditSet(exercise.id, set.id, field, value.replace(',', '.'))}
                  style={[s.input, set.completed && s.completed]} />
              </View>)}
            </View>
            {!set.completed && <Button label={`Complete set ${setIndex + 1}`} disabled={pending !== null || !isValidSet(set)} busy={pending === set.id}
              onPress={() => void save(set.id, () => actions.onCompleteSet(exercise.id, set.id))} />}
            {!set.completed && !isValidSet(set) && <Type tone="muted" variant="caption">Enter a weight of 0 or more, whole reps above 0, and an optional RPE from 1 to 10.</Type>}
          </View>)}
        </Card>)}
        <View style={s.header}><Type variant="title">Session notes</Type><TextInput multiline value={model.notes} onChangeText={actions.onNotesChange} editable={pending === null} accessibilityLabel="Session notes" placeholder="Anything to remember next time?" placeholderTextColor={colors.muted} style={[s.input, s.notes]} /></View>
        {confirm ? <Card><Type variant="title">Finish this workout?</Type><Type tone="muted">{completed} completed sets will be included. {sets.length - completed} incomplete sets won’t count toward your training.</Type><Button label="Confirm finish" disabled={pending !== null} busy={pending === 'finish'} onPress={() => void save('finish', async () => { await actions.onFinish(); setFinished(true); })} /><Button label="Keep training" variant="secondary" disabled={pending !== null} onPress={() => setConfirm(false)} /></Card> : <Button label="Finish workout" variant="secondary" disabled={pending !== null || completed === 0} onPress={() => setConfirm(true)} />}
      </>}
    </Screen>
  </KeyboardAvoidingView>;
}
const s = StyleSheet.create({
  fill: { flex: 1, backgroundColor: colors.background }, header: { gap: 8 },
  set: { gap: 12, borderTopWidth: 1, borderColor: colors.border, paddingTop: 16 },
  fields: { flexDirection: 'row', gap: 8 }, stacked: { flexDirection: 'column' }, field: { flex: 1, gap: 8 },
  input: { minHeight: 48, borderRadius: 8, borderWidth: 1, borderColor: colors.border, backgroundColor: colors.background, color: colors.text, padding: 12, fontSize: 18, fontVariant: ['tabular-nums'] },
  completed: { color: colors.accent, backgroundColor: colors.surface }, notes: { minHeight: 112, textAlignVertical: 'top', fontSize: 16 },
});
