import React, { useRef, useState } from 'react';
import { KeyboardAvoidingView, Platform, ScrollView, View } from 'react-native';
import { Button, Feedback, Type } from '../../components/ui';
import { EQUIPMENT, ExerciseInputSchema, MUSCLES, TRACKING_TYPES } from '../../types';
import type { ExerciseInput } from '../../types';
import { Choice, displayLabel, Field, s, trackingLabels } from './exercise-ui';

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
      <View><Type variant="caption" tone="accent">YOUR LIBRARY, YOUR WAY</Type><Type variant="heading" accessibilityRole="header">{initial ? 'Edit exercise' : 'Create exercise'}</Type></View>
      <Field label="Exercise name" placeholder="e.g. Incline dumbbell press" value={draft.name} onChangeText={name => edit({ name })} editable={!locked} error={errors.name} maxLength={100} />
      <Type accessibilityRole="header">Equipment</Type><Choice label={draft.equipment ? displayLabel(draft.equipment) : 'Not specified'} selected={picker === 'equipment'} disabled={locked} onPress={() => setPicker(picker === 'equipment' ? null : 'equipment')} />
      {picker === 'equipment' && <View style={s.wrap}><Choice label="No equipment specified" selected={draft.equipment === null} disabled={locked} onPress={() => { edit({ equipment: null }); setPicker(null); }} />{EQUIPMENT.map(equipment => <Choice key={equipment} label={displayLabel(equipment)} selected={draft.equipment === equipment} disabled={locked} onPress={() => { edit({ equipment }); setPicker(null); }} />)}</View>}
      <Type accessibilityRole="header">What you track</Type><View style={s.wrap}>{TRACKING_TYPES.map(trackingType => <Choice key={trackingType} label={trackingLabels[trackingType]} selected={draft.trackingType === trackingType} disabled={locked} onPress={() => edit({ trackingType })} />)}</View>
      <Type accessibilityRole="header">Muscle groups</Type><Type variant="caption" tone="muted">Tap a muscle to cycle: not selected, primary, secondary.</Type>
      <Choice label={draft.muscles.length ? `${draft.muscles.length} muscles selected` : 'Choose muscles (optional)'} selected={picker === 'muscles'} disabled={locked} onPress={() => setPicker(picker === 'muscles' ? null : 'muscles')} />
      {picker === 'muscles' && <View style={s.wrap}>{MUSCLES.map(muscle => {
        const role = draft.muscles.find(item => item.muscle === muscle)?.role;
        return <Choice key={muscle} label={`${displayLabel(muscle)} · ${role || 'not selected'}`} selected={Boolean(role)} disabled={locked} onPress={() => edit({ muscles: [...draft.muscles.filter(item => item.muscle !== muscle), ...(role === 'secondary' ? [] : [{ muscle, role: role ? 'secondary' as const : 'primary' as const }])] })} />;
      })}</View>}
      {errors.muscles && <Type tone="danger" accessibilityLiveRegion="polite">{errors.muscles}</Type>}
      <Field label="Notes (optional)" placeholder="Setup cues or reminders" value={draft.notes || ''} onChangeText={notes => edit({ notes })} editable={!locked} multiline maxLength={2000} error={errors.notes} />
      {status === 'error' && <Feedback kind="error" title="Couldn’t save exercise" detail="Your edits are still here. Try saving again." />}
      {status === 'saved' && <Feedback kind="success" title="Exercise saved" />}
      <Button label="Save exercise" onPress={() => { void save(); }} busy={status === 'saving'} disabled={status === 'saved'} />
      <Button label={status === 'saved' ? 'Done' : 'Cancel'} variant="secondary" onPress={onCancel} disabled={status === 'saving'} />
    </ScrollView>
  </KeyboardAvoidingView>;
}
