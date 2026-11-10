import React, { useState } from 'react';
import { FlatList, Pressable, View, Image, ScrollView, Modal, Switch } from 'react-native';
import { Button, Feedback, Type } from '../../components/ui';
import { EQUIPMENT, MUSCLES } from '../../types';
import type { Exercise, ExerciseFilter } from '../../types';
import { componentVariants, space, colors, radius, cardShadow } from '../../theme/tokens';
import { BodyMap, muscleColor } from './BodyMap';
import { equipmentImage } from './exercise-assets';
import { EquipmentTile, Choice, displayLabel, Field, IconButton, ScreenIcon, s } from './exercise-ui';

/** Presentation boundary only. The EXL-05 adapter owns fetching, search and filtering. */
export type ExerciseLibraryProps = {
  exercises: readonly Exercise[];
  filter: ExerciseFilter;
  state: 'loading' | 'ready' | 'error';
  onFilterChange: (filter: ExerciseFilter) => void;
  onOpen: (id: string) => void;
  onCreate: () => void;
  onRetry: () => void;
  recent?: readonly Exercise[];
  bestSets?: Readonly<Record<string, string>>;
};

export function ExerciseLibraryScreen({ exercises, filter, state, onFilterChange, onOpen, onCreate, onRetry, recent = [], bestSets = {} }: ExerciseLibraryProps) {
  const [filtersOpen, setFiltersOpen] = useState(false);
  const [allMuscles, setAllMuscles] = useState(false);
  const [allEquipment, setAllEquipment] = useState(false);
  const filtered = Boolean(filter.query || filter.muscle || filter.equipment);
  return <FlatList style={s.fill} contentContainerStyle={s.content} data={state === 'ready' ? exercises : []}
    keyExtractor={item => item.id} keyboardShouldPersistTaps="handled" keyboardDismissMode="on-drag" contentInsetAdjustmentBehavior="automatic"
    ListHeaderComponent={<View style={s.stack}>
      <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', gap: 12 }}>
        <View style={{ flex: 1, gap: 4 }}><Type variant="heading" accessibilityRole="header">Exercises</Type><Type variant="caption" tone="muted">{exercises.length} exercises in your library</Type></View>
        <IconButton name="plus" label="Create exercise" primary onPress={onCreate} />
      </View>
      <View style={{ flexDirection: 'row', alignItems: 'center', gap: 10 }}>
        <View style={{ flex: 1, backgroundColor: colors.surface, borderRadius: 16, flexDirection: 'row', alignItems: 'center', paddingLeft: 14, boxShadow: cardShadow }}>
          <ScreenIcon name="search" /><View style={{ flex: 1 }}><Field hideLabel label="Search exercises" value={filter.query || ''} onChangeText={query => onFilterChange({ ...filter, query })} placeholder="Search exercises" maxLength={100} returnKeyType="search" style={{ borderWidth: 0, backgroundColor: colors.surface }} /></View>
        </View>
        <IconButton name="filter" label={filter.muscle || filter.equipment ? 'Filters - active' : 'Filters'} onPress={() => setFiltersOpen(true)} />
      </View>
      {!filter.muscle && <View style={{ backgroundColor: colors.surface, borderRadius: radius.card, padding: 16, flexDirection: 'row', alignItems: 'center', gap: 8 }}>
        <View style={{ flex: 1, gap: 8 }}><Type variant="caption" tone="accent">Muscle map</Type><Type variant="title">Train by muscle</Type><Type variant="caption" tone="muted">Tap a muscle to see its exercises.</Type><Button label="Open map" onPress={() => setFiltersOpen(true)} /></View>
        <BodyMap all size={120} />
      </View>}
      {filter.muscle && <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }}><Type variant="heading">{displayLabel(filter.muscle)}</Type><BodyMap muscles={[{ muscle: filter.muscle, role: 'primary' }]} size={110} /></View>}
      <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={{ gap: 8 }}>
        <Choice label="All" selected={!filter.muscle} onPress={() => onFilterChange({ ...filter, muscle: undefined })} />
        {MUSCLES.map(muscle => <Choice key={muscle} label={displayLabel(muscle)} selected={filter.muscle === muscle} onPress={() => onFilterChange({ ...filter, muscle })} />)}
      </ScrollView>
      {filtered && <Button label="Clear filters" variant="secondary" onPress={() => onFilterChange({ includeArchived: false })} />}
      <Modal visible={filtersOpen} transparent animationType="none" onRequestClose={() => setFiltersOpen(false)}>
        <View style={{ flex: 1, backgroundColor: 'rgba(29,29,36,0.35)', justifyContent: 'flex-end' }}>
          <View style={{ maxHeight: '90%', backgroundColor: colors.surface, borderTopLeftRadius: 28, borderTopRightRadius: 28, padding: 20, gap: 12 }}>
            <View style={{ alignSelf: 'center', width: 40, height: 5, borderRadius: 3, backgroundColor: colors.border }} /><View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}><Type variant="title" accessibilityRole="header">Filters</Type><Button label="Reset" variant="secondary" onPress={() => onFilterChange({ includeArchived: false })} /></View>
            <ScrollView keyboardShouldPersistTaps="handled" contentContainerStyle={s.stack}>
        <Type accessibilityRole="header">Muscle group</Type><View style={s.wrap}>
          <Choice label="All muscles" selected={!filter.muscle} onPress={() => onFilterChange({ ...filter, muscle: undefined })} />
          {(allMuscles ? MUSCLES : MUSCLES.slice(0, 8)).map(muscle => <Choice key={muscle} label={displayLabel(muscle)} selected={filter.muscle === muscle} onPress={() => onFilterChange({ ...filter, muscle })} />)}
          <Choice label={allMuscles ? 'Show fewer muscles' : 'More muscles'} selected={false} onPress={() => setAllMuscles(!allMuscles)} />
        </View><Type accessibilityRole="header">Equipment</Type><View style={s.wrap}>
          <Choice label="All equipment" selected={!filter.equipment} onPress={() => onFilterChange({ ...filter, equipment: undefined })} />
          {(allEquipment ? EQUIPMENT : EQUIPMENT.slice(0, 5)).map(equipment => <EquipmentTile key={equipment} equipment={equipment} selected={filter.equipment === equipment} onPress={() => onFilterChange({ ...filter, equipment })} />)}
          <Choice label={allEquipment ? 'Show fewer equipment types' : 'More equipment'} selected={false} onPress={() => setAllEquipment(!allEquipment)} />
        </View>
        <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }}><Type>Show archived</Type><Switch accessibilityLabel="Show archived" value={filter.includeArchived} onValueChange={includeArchived => onFilterChange({ ...filter, includeArchived })} /></View>
            </ScrollView><Button label="Show results" onPress={() => setFiltersOpen(false)} />
            <Button label="Close filters" variant="secondary" onPress={() => setFiltersOpen(false)} />
          </View>
        </View>
      </Modal>
      {!filtered && state === 'ready' && recent.length > 0 && <View style={s.stack}><Type variant="title">Recently viewed</Type><ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={{ gap: 12 }}>{recent.map(item => <Pressable key={item.id} accessibilityRole="button" accessibilityLabel={`View recent ${item.name}`} onPress={() => onOpen(item.id)} style={{ width: 158, padding: 12, borderRadius: radius.card, backgroundColor: colors.surface, gap: 8 }}><Image source={equipmentImage(item.equipment)} style={{ width: 134, height: 84, backgroundColor: muscleColor(item.muscles.find(m => m.role === 'primary')?.muscle || 'chest') + '30', borderRadius: 16 }} resizeMode="contain" /><Type style={{ fontWeight: '600', fontSize: 14, lineHeight: 20 }}>{item.name}</Type>{bestSets[item.id] && <View style={{ flexDirection: 'row', alignItems: 'baseline', gap: 6 }}><Type numeric style={{ fontWeight: '800' }}>{bestSets[item.id]}</Type><Type variant="caption" tone="muted">Best</Type></View>}</Pressable>)}</ScrollView></View>}
      <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}><Type style={{ fontWeight: '700' }}>{filtered ? 'Results' : 'All exercises'}</Type><Type variant="caption" tone="muted">A-Z</Type></View>
      {state === 'ready' && <Type variant="caption" tone="muted" accessibilityLiveRegion="polite">{exercises.length} {exercises.length === 1 ? 'exercise' : 'exercises'}{filtered ? ' found' : ''}</Type>}
    </View>}
    renderItem={({ item }) => <Pressable accessibilityRole="button" accessibilityLabel={`${item.name}, ${item.equipment ? displayLabel(item.equipment) : 'Equipment not specified'}${item.isCustom ? ', custom' : ''}`} onPress={() => onOpen(item.id)} style={({ pressed }) => [s.row, { flexDirection: 'row', alignItems: 'center', padding: 12, backgroundColor: colors.surface, borderRadius: 20, borderWidth: 1, borderColor: colors.border, boxShadow: undefined }, pressed && { opacity: componentVariants.state.pressedOpacity }]}>
      <Image source={equipmentImage(item.equipment)} style={{ width: 60, height: 60, borderRadius: 16 }} /><View style={{ flex: 1, gap: 4 }}><Type style={{ fontWeight: '600' }}>{item.name}</Type>
      <Type variant="caption" tone="muted">{item.equipment ? displayLabel(item.equipment) : 'Equipment not specified'} · {item.muscles.filter(m => m.role === 'primary').map(m => displayLabel(m.muscle)).join(', ') || 'Muscles not specified'}</Type>
      {item.isCustom && <Type variant="caption" tone="accent">Custom exercise</Type>}</View>{bestSets[item.id] && <View style={{ alignItems: 'flex-end' }}><Type numeric style={{ fontWeight: '700' }}>{bestSets[item.id]}</Type><Type variant="caption" tone="muted">Best</Type></View>}<ScreenIcon name="next" />
    </Pressable>}
    ListEmptyComponent={<View style={{ paddingTop: space.lg }}>{state === 'loading' ? <Feedback kind="loading" title="Loading exercises" /> : state === 'error' ? <Feedback kind="error" title="Couldn’t load exercises" detail="Try again to load your library." onRetry={onRetry} /> : <><Image source={require('../../../assets/images/empty/no-results.png')} style={{ width: 130, height: 130, alignSelf: 'center' }} /><Feedback kind="empty" title={filtered ? 'No matches' : 'Your library is empty'} detail={filtered ? 'Try another name or clear your filters.' : 'Create your first custom exercise to get started.'} /></>}</View>} />;
}
