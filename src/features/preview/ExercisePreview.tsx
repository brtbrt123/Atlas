import React, { useState } from 'react';
import { View } from 'react-native';
import { Button, Type } from '../../components/ui';
import { ExerciseInputSchema } from '../../types';
import type { Exercise, ExerciseFilter } from '../../types';
import { CustomExerciseScreen } from '../exercises/CustomExerciseScreen';
import { ExerciseDetailScreen } from '../exercises/ExerciseDetailScreen';
import { ExerciseLibraryScreen } from '../exercises/ExerciseLibraryScreen';
import { s } from '../exercises/exercise-ui';

/** MOCK ONLY: deliberately in the production-excluded preview tree. No persistence. */
export const exerciseFixtures: Exercise[] = [
  { id: '11111111-1111-4111-8111-111111111111', builtinKey: 'preview-press', name: 'Incline dumbbell press', equipment: 'dumbbell', trackingType: 'weight_reps', muscles: [{ muscle: 'chest', role: 'primary' }, { muscle: 'triceps', role: 'secondary' }], notes: 'Keep the setup consistent between sessions.', isCustom: false, isArchived: false, createdAt: 0, updatedAt: 0 },
  { id: '22222222-2222-4222-8222-222222222222', builtinKey: 'preview-row', name: 'Seated cable row', equipment: 'cable', trackingType: 'weight_reps', muscles: [{ muscle: 'upper_back', role: 'primary' }], notes: null, isCustom: false, isArchived: false, createdAt: 0, updatedAt: 0 },
  { id: '33333333-3333-4333-8333-333333333333', builtinKey: null, name: 'Paused goblet squat', equipment: 'kettlebell', trackingType: 'weight_reps', muscles: [{ muscle: 'quadriceps', role: 'primary' }], notes: null, isCustom: true, isArchived: false, createdAt: 0, updatedAt: 0 },
];

export function ExercisePreview({ onExit }: { onExit: () => void }) {
  const [items, setItems] = useState(exerciseFixtures);
  const [filter, setFilter] = useState<ExerciseFilter>({ includeArchived: false });
  const [page, setPage] = useState<'library' | 'detail' | 'form'>('library');
  const [id, setId] = useState<string | null>(null);
  const [state, setState] = useState<'ready' | 'loading' | 'error'>('ready');
  const [tools, setTools] = useState(false);
  const [fail, setFail] = useState(false);
  const exercise = items.find(item => item.id === id) || null;
  const visible = items.filter(item => !item.isArchived && item.name.toLowerCase().includes((filter.query || '').trim().toLowerCase()) && (!filter.equipment || item.equipment === filter.equipment) && (!filter.muscle || item.muscles.some(m => m.muscle === filter.muscle)));
  return <View style={s.fill}>
    <View style={{ padding: 12, gap: 8 }}><Type variant="caption" tone="accent">Example data · Memory only · Not saved</Type><Button label={tools ? 'Hide preview tools' : 'Preview tools'} variant="secondary" onPress={() => setTools(!tools)} />
      {tools && <View style={s.stack}><Button label={`State: ${state}`} variant="secondary" onPress={() => setState(state === 'ready' ? 'loading' : state === 'loading' ? 'error' : 'ready')} /><Button label={`Save failure: ${fail ? 'on' : 'off'}`} variant="secondary" onPress={() => setFail(!fail)} /><Button label="Back to exercise library" variant="secondary" onPress={() => setPage('library')} /><Button label="Exit exercise preview" variant="secondary" onPress={onExit} /></View>}
    </View>
    {page === 'library' ? <ExerciseLibraryScreen exercises={visible} filter={filter} state={state} onFilterChange={setFilter} onCreate={() => { setId(null); setPage('form'); }} onOpen={next => { setId(next); setPage('detail'); }} onRetry={() => setState('ready')} /> : page === 'detail' ? <ExerciseDetailScreen exercise={exercise} state={state} recentPerformance={{ state: 'unavailable' }} onRetry={() => setState('ready')} onRetryHistory={() => setState('ready')} onEdit={() => setPage('form')} /> : <CustomExerciseScreen key={id || 'new'} initial={exercise || undefined} onCancel={() => setPage('library')} onSave={async input => {
      if (fail) throw new Error('Simulated save failure');
      const parsed = ExerciseInputSchema.parse(input);
      const next: Exercise = exercise ? { ...exercise, ...parsed } : { ...parsed, id: `preview-${items.length}`, builtinKey: null, isCustom: true, isArchived: false, createdAt: 0, updatedAt: 0 };
      setItems(current => exercise ? current.map(item => item.id === exercise.id ? next : item) : [...current, next]);
    }} />}
  </View>;
}
