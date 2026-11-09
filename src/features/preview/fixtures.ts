import type { HomeModel, WorkoutModel } from './contracts';
/** Illustrative fixtures only. Never use these as recorded sessions or analytics. */
export const homeFixture: HomeModel = {
  week: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'].map((label, index) => ({ label, sessions: [0, 2, 4].includes(index) ? 1 : 0, isToday: index === 4 })),
  recent: { name: 'Upper Body A', date: 'Example session', duration: '48 min', sets: 18 },
};
export const workoutFixture: WorkoutModel = {
  name: 'Upper Body A', startedAt: '2026-11-09T08:00:00Z', notes: '',
  exercises: [
    { id: 'incline', name: 'Incline Bench Press', equipment: 'Barbell', previous: 'Previous: 40 kg × 10 reps', sets: [
      { id: 's1', weight: '40', reps: '10', rpe: '7', completed: true },
      { id: 's2', weight: '40', reps: '10', rpe: '', completed: false },
      { id: 's3', weight: '40', reps: '10', rpe: '', completed: false },
    ] },
    { id: 'row', name: 'Seated Cable Row', equipment: 'Cable', previous: 'Previous: 35 kg × 12 reps', sets: [
      { id: 's4', weight: '35', reps: '12', rpe: '', completed: false },
      { id: 's5', weight: '35', reps: '12', rpe: '', completed: false },
    ] },
  ],
};
