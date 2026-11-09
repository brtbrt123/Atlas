import React, { useState } from 'react';
import { SafeAreaView, StyleSheet, View } from 'react-native';
import { Button, Type } from '../../components/ui';
import { colors } from '../../theme/tokens';
import { HomeScreen } from '../home/HomeScreen';
import { ActiveWorkoutScreen, isValidSet } from '../workout/ActiveWorkoutScreen';
import { homeFixture, workoutFixture } from './fixtures';
import type { LoadState, WorkoutActions, WorkoutModel } from './contracts';

/** Mount inside the existing app's development route only. No router or store ownership. */
export function AtlasPreview() {
  const [screen, setScreen] = useState<'home' | 'workout'>('home');
  const [state, setState] = useState<LoadState>('ready');
  const [empty, setEmpty] = useState(false);
  const [failSave, setFailSave] = useState(false);
  const [model, setModel] = useState<WorkoutModel>(() => ({ ...workoutFixture, startedAt: new Date().toISOString() }));
  const actions: WorkoutActions = {
    onEditSet: (exerciseId, setId, field, value) => setModel(current => ({ ...current, exercises: current.exercises.map(exercise => exercise.id !== exerciseId ? exercise : { ...exercise, sets: exercise.sets.map(set => set.id !== setId ? set : { ...set, [field]: value }) }) })),
    onCompleteSet: async (exerciseId, setId) => {
      if (failSave) throw new Error('Preview save failure');
      const set = model.exercises.find(exercise => exercise.id === exerciseId)?.sets.find(item => item.id === setId);
      if (!set || !isValidSet(set)) throw new Error('Invalid set');
      setModel(current => ({ ...current, exercises: current.exercises.map(exercise => exercise.id !== exerciseId ? exercise : { ...exercise, sets: exercise.sets.map(item => item.id === setId ? { ...item, completed: true } : item) }) }));
    },
    onNotesChange: notes => setModel(current => ({ ...current, notes })),
    onFinish: async () => { if (failSave) throw new Error('Preview finish failure'); },
  };
  return <SafeAreaView style={s.fill}>
    <View style={s.tools}><Type variant="caption" tone="accent">UI preview · Example data · Not saved</Type>
      <View style={s.controls}><Button variant="secondary" label={screen === 'home' ? 'View workout' : 'View home'} onPress={() => setScreen(screen === 'home' ? 'workout' : 'home')} /><Button variant="secondary" label={`State: ${state}`} onPress={() => setState(state === 'ready' ? 'loading' : state === 'loading' ? 'error' : 'ready')} /><Button variant="secondary" label={empty ? 'Show sample data' : 'Show empty'} onPress={() => setEmpty(!empty)} /><Button variant="secondary" label={failSave ? 'Save failure: on' : 'Save failure: off'} onPress={() => setFailSave(!failSave)} /></View>
    </View>
    {screen === 'home' ? <HomeScreen model={empty ? { week: homeFixture.week.map(day => ({ ...day, sessions: 0 })), recent: null } : homeFixture} state={state} onStart={() => setScreen('workout')} onResume={() => setScreen('workout')} onRetry={() => setState('ready')} /> : <ActiveWorkoutScreen model={empty ? { ...model, exercises: [] } : model} actions={actions} state={state} onRetry={() => setState('ready')} />}
  </SafeAreaView>;
}
const s = StyleSheet.create({ fill: { flex: 1, backgroundColor: colors.background }, tools: { padding: 12, gap: 8, borderBottomWidth: 1, borderColor: colors.border }, controls: { flexDirection: 'row', flexWrap: 'wrap', gap: 8 } });
