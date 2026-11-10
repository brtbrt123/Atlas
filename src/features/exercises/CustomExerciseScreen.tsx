import React, { useRef, useState } from 'react';
import { KeyboardAvoidingView, Platform, ScrollView, View, Pressable } from 'react-native';
import { Button, Card, Feedback, Type } from '../../components/ui';
import { EQUIPMENT, ExerciseInputSchema, MUSCLES, TRACKING_TYPES } from '../../types';
import type { ExerciseInput } from '../../types';
import { BodyMap } from './BodyMap';
import { colors } from '../../theme/tokens';
import { EquipmentTile, IconButton, Choice, displayLabel, Field, s, trackingLabels } from './exercise-ui';

export type CustomExerciseProps = {
  initial?: ExerciseInput;
  onSave: (input: ExerciseInput) => Promise<void>;
  onCancel: () => void;
};

/** Mount keyed by exercise id; the route owns unsaved-navigation confirmation. */
export function CustomExerciseScreen({ initial, onSave, onCancel }: CustomExerciseProps) {
  const [draft, setDraft] = useState<Required<ExerciseInput>>(() => ({ name: initial?.name || '', equipment: initial?.equipment ?? null, trackingType: initial?.trackingType ?? 'weight_reps', notes: initial?.notes ?? null, muscles: initial?.muscles ?? [] }));
  const [status, setStatus] = useState<'editing' | 'saving' | 'error' | 'saved'>('editing');
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [picker, setPicker] = useState<'equipment' | 'muscles' | null>(null);
  const saving = useRef(false);
  const scroll = useRef<React.ComponentRef<typeof ScrollView>>(null);
  const locked = status === 'saving' || status === 'saved';
  const edit = (patch: Partial<ExerciseInput>) => { setDraft(current => ({ ...current, ...patch })); setStatus('editing'); setErrors({}); };
  const save = async () => {
    if (saving.current || status === 'saved') return;
    const result = ExerciseInputSchema.safeParse(draft);
    if (!result.success) {
      setErrors(Object.fromEntries(result.error.issues.map(issue => [String(issue.path[0]), issue.message])));
      scroll.current?.scrollTo({ y: 0, animated: false });
      return;
    }
    saving.current = true; setStatus('saving');
    try { await onSave(result.data); setStatus('saved'); }
    catch { setStatus('error'); }
    finally { saving.current = false; scroll.current?.scrollToEnd({ animated: false }); }
  };
  return <KeyboardAvoidingView style={s.fill} behavior={Platform.OS === 'ios' ? 'padding' : 'height'}>
    <ScrollView ref={scroll} contentContainerStyle={s.content} keyboardShouldPersistTaps="handled" keyboardDismissMode="on-drag" automaticallyAdjustKeyboardInsets contentInsetAdjustmentBehavior="automatic">
      <View style={{ flexDirection: 'row', alignItems: 'center', gap: 12 }}><IconButton name="close" label={status === 'saved' ? 'Done' : 'Cancel'} onPress={onCancel} disabled={status === 'saving'} /><Type style={{ fontWeight: '700', flex: 1, textAlign: 'center' }} accessibilityRole="header">{initial ? 'Edit exercise' : 'New exercise'}</Type></View>
      <Field label="Exercise name" placeholder="e.g. Incline dumbbell press" value={draft.name} onChangeText={name => edit({ name })} editable={!locked} error={errors.name} maxLength={100} />
      <Type accessibilityRole="header">Equipment</Type><View style={s.wrap}>{(['barbell', 'dumbbell', 'kettlebell', 'cable', 'bodyweight'] as const).map(equipment => <EquipmentTile key={equipment} equipment={equipment} selected={draft.equipment === equipment} disabled={locked} onPress={() => edit({ equipment })} />)}<Pressable accessibilityRole="button" accessibilityLabel="More equipment" disabled={locked} onPress={() => setPicker(picker === 'equipment' ? null : 'equipment')} style={{ width: '30%', minHeight: 100, borderRadius: 16, backgroundColor: colors.surface, alignItems: 'center', justifyContent: 'center', gap: 8 }}><Type variant="title" tone="muted">+</Type><Type variant="caption" tone="muted">More equipment</Type></Pressable></View>
      {picker === 'equipment' && <View style={s.wrap}><Choice label="No equipment specified" selected={draft.equipment === null} disabled={locked} onPress={() => { edit({ equipment: null }); setPicker(null); }} />{EQUIPMENT.map(equipment => <Choice key={equipment} label={displayLabel(equipment)} selected={draft.equipment === equipment} disabled={locked} onPress={() => { edit({ equipment }); setPicker(null); }} />)}</View>}
      <Type style={{ fontWeight: '700' }} accessibilityRole="header">Track</Type>
      <View style={{ flexDirection: 'row', backgroundColor: colors.elevated, borderRadius: 12, padding: 4 }}>
        {TRACKING_TYPES.map((trackingType, index) => <Pressable key={trackingType} accessibilityRole="button" accessibilityLabel={trackingLabels[trackingType]} accessibilityState={{ selected: draft.trackingType === trackingType, disabled: locked }} disabled={locked} onPress={() => edit({ trackingType })}
          style={{ flex: 1, minHeight: 48, borderRadius: 10, alignItems: 'center', justifyContent: 'center', padding: 4, backgroundColor: draft.trackingType === trackingType ? colors.surface : 'transparent' }}>
          <Type variant="caption" style={{ textAlign: 'center', fontWeight: draft.trackingType === trackingType ? '700' : '400' }}>{['Weight & reps', 'Reps', 'Time', 'Distance'][index]}</Type>
        </Pressable>)}
      </View>
      <View style={{ flexDirection: 'row', justifyContent: 'space-between', gap: 8 }}><Type style={{ fontWeight: '700' }} accessibilityRole="header">Muscles</Type><Type variant="caption" tone="muted">Tap again for secondary</Type></View>
      <Card style={{ padding: 16, gap: 12 }}>
        <BodyMap muscles={draft.muscles} size={160} onSelect={locked ? undefined : muscle => {
          const role = draft.muscles.find(item => item.muscle === muscle)?.role;
          edit({ muscles: [...draft.muscles.filter(item => item.muscle !== muscle), ...(role === 'secondary' ? [] : [{ muscle, role: role ? 'secondary' as const : 'primary' as const }])] });
        }} />
        {draft.muscles.map(item => <View key={item.muscle} style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', backgroundColor: '#E5F7F1', paddingHorizontal: 12, borderRadius: 12 }}>
          <Type variant="caption">{displayLabel(item.muscle)}</Type><Choice label={displayLabel(item.role) + ' - remove ' + displayLabel(item.muscle)} selected={false} disabled={locked} onPress={() => edit({ muscles: draft.muscles.filter(m => m.muscle !== item.muscle) })} />
        </View>)}
        <Choice label="Choose muscles (accessible list)" selected={picker === 'muscles'} disabled={locked} onPress={() => setPicker(picker === 'muscles' ? null : 'muscles')} />
        {picker === 'muscles' && <View style={s.wrap}>{MUSCLES.map(muscle => {
          const role = draft.muscles.find(item => item.muscle === muscle)?.role;
          return <Choice key={muscle} label={displayLabel(muscle) + ' - ' + (role || 'not selected')} selected={Boolean(role)} disabled={locked} onPress={() => edit({ muscles: [...draft.muscles.filter(item => item.muscle !== muscle), ...(role === 'secondary' ? [] : [{ muscle, role: role ? 'secondary' as const : 'primary' as const }])] })} />;
        })}</View>}
      </Card>
      {errors.muscles && <Type tone="danger" accessibilityLiveRegion="polite">{errors.muscles}</Type>}
      <Field label="Notes (optional)" placeholder="Setup cues or reminders" value={draft.notes || ''} onChangeText={notes => edit({ notes })} editable={!locked} multiline style={{ minHeight: 96, textAlignVertical: 'top', backgroundColor: colors.surface, borderColor: colors.border }} maxLength={2000} error={errors.notes} />
      {status === 'error' && <Feedback kind="error" title="Couldn’t save exercise" detail="Your edits are still here. Try saving again." />}
      {status === 'saved' && <Feedback kind="success" title="Exercise saved" />}
      <Button label="Save exercise" onPress={() => { void save(); }} busy={status === 'saving'} disabled={status === 'saved'} />
    </ScrollView>
  </KeyboardAvoidingView>;
}
