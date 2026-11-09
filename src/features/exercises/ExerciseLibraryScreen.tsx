import React, { useState } from 'react';
import { FlatList, Pressable, View } from 'react-native';
import { Button, Feedback, Type } from '../../components/ui';
import { EQUIPMENT, MUSCLES } from '../../types';
import type { Exercise, ExerciseFilter } from '../../types';
import { componentVariants, space } from '../../theme/tokens';
import { Choice, displayLabel, Field, s } from './exercise-ui';

/** Presentation boundary only. The EXL-05 adapter owns fetching, search and filtering. */
export type ExerciseLibraryProps = {
  exercises: readonly Exercise[];
  filter: ExerciseFilter;
  state: 'loading' | 'ready' | 'error';
  onFilterChange: (filter: ExerciseFilter) => void;
  onOpen: (id: string) => void;
  onCreate: () => void;
  onRetry: () => void;
};

export function ExerciseLibraryScreen({ exercises, filter, state, onFilterChange, onOpen, onCreate, onRetry }: ExerciseLibraryProps) {
  const [filtersOpen, setFiltersOpen] = useState(false);
  const filtered = Boolean(filter.query || filter.muscle || filter.equipment);
  return <FlatList style={s.fill} contentContainerStyle={s.content} data={state === 'ready' ? exercises : []}
    keyExtractor={item => item.id} keyboardShouldPersistTaps="handled" keyboardDismissMode="on-drag" contentInsetAdjustmentBehavior="automatic"
    ListHeaderComponent={<View style={s.stack}>
      <View><Type variant="caption" tone="accent">YOUR MOVEMENT INDEX</Type><Type variant="heading" accessibilityRole="header">Exercises</Type></View>
      <Field label="Search exercises" value={filter.query || ''} onChangeText={query => onFilterChange({ ...filter, query })} placeholder="Find an exercise" maxLength={100} returnKeyType="search" />
      <View style={s.wrap}><Choice label={`Filters${filter.muscle || filter.equipment ? ' · active' : ''}`} selected={filtersOpen} onPress={() => setFiltersOpen(!filtersOpen)} />
        {filtered && <Button label="Clear filters" variant="secondary" onPress={() => onFilterChange({ includeArchived: false })} />}</View>
      {filtersOpen && <View style={s.stack}>
        <Type accessibilityRole="header">Muscle group</Type><View style={s.wrap}>
          <Choice label="All muscles" selected={!filter.muscle} onPress={() => onFilterChange({ ...filter, muscle: undefined })} />
          {MUSCLES.map(muscle => <Choice key={muscle} label={displayLabel(muscle)} selected={filter.muscle === muscle} onPress={() => onFilterChange({ ...filter, muscle })} />)}
        </View><Type accessibilityRole="header">Equipment</Type><View style={s.wrap}>
          <Choice label="All equipment" selected={!filter.equipment} onPress={() => onFilterChange({ ...filter, equipment: undefined })} />
          {EQUIPMENT.map(equipment => <Choice key={equipment} label={displayLabel(equipment)} selected={filter.equipment === equipment} onPress={() => onFilterChange({ ...filter, equipment })} />)}
        </View>
      </View>}
      <Button label="Create exercise" variant="secondary" onPress={onCreate} />
      {state === 'ready' && <Type variant="caption" tone="muted" accessibilityLiveRegion="polite">{exercises.length} {exercises.length === 1 ? 'exercise' : 'exercises'}{filtered ? ' found' : ''}</Type>}
    </View>}
    renderItem={({ item }) => <Pressable accessibilityRole="button" accessibilityLabel={`${item.name}, ${item.equipment ? displayLabel(item.equipment) : 'Equipment not specified'}${item.isCustom ? ', custom' : ''}`} onPress={() => onOpen(item.id)} style={({ pressed }) => [s.row, pressed && { opacity: componentVariants.state.pressedOpacity }]}>
      <Type variant="title">{item.name}</Type>
      <Type variant="caption" tone="muted">{item.equipment ? displayLabel(item.equipment) : 'Equipment not specified'} · {item.muscles.filter(m => m.role === 'primary').map(m => displayLabel(m.muscle)).join(', ') || 'Muscles not specified'}</Type>
      {item.isCustom && <Type variant="caption" tone="accent">Custom exercise</Type>}
    </Pressable>}
    ListEmptyComponent={<View style={{ paddingTop: space.lg }}>{state === 'loading' ? <Feedback kind="loading" title="Loading exercises" /> : state === 'error' ? <Feedback kind="error" title="Couldn’t load exercises" detail="Try again to load your library." onRetry={onRetry} /> : <Feedback kind="empty" title={filtered ? 'No matches' : 'Your library is empty'} detail={filtered ? 'Try another name or clear your filters.' : 'Create your first custom exercise to get started.'} />}</View>} />;
}
