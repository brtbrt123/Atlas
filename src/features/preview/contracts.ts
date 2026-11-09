/** UI-only proposals. Replace via an adapter to Claude-owned contracts; not a domain API. */
export type LoadState = 'ready' | 'loading' | 'error';
export interface HomeModel {
  week: { label: string; sessions: number; isToday?: boolean }[];
  recent: null | { name: string; date: string; duration: string; sets: number };
  activeWorkoutName?: string;
}
export interface SetDraft { id: string; weight: string; reps: string; rpe: string; completed: boolean }
export interface ExerciseDraft { id: string; name: string; equipment: string; previous: string; sets: SetDraft[] }
export interface WorkoutModel { name: string; startedAt: string; exercises: ExerciseDraft[]; notes: string }
export interface WorkoutActions {
  onEditSet: (exerciseId: string, setId: string, field: 'weight' | 'reps' | 'rpe', value: string) => void;
  /** Resolve only after persistence succeeds. Rejections keep the row incomplete. */
  onCompleteSet: (exerciseId: string, setId: string) => Promise<void>;
  onNotesChange: (value: string) => void;
  onFinish: () => Promise<void>;
}
