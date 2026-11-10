import React from 'react';
import { act, render, screen, userEvent } from '@testing-library/react-native';
import { CustomExerciseScreen } from '../../src/features/exercises/CustomExerciseScreen';
import { ExerciseLibraryScreen } from '../../src/features/exercises/ExerciseLibraryScreen';
import { ExerciseDetailScreen } from '../../src/features/exercises/ExerciseDetailScreen';
import { ExercisePreview, exerciseFixtures } from '../../src/features/preview/ExercisePreview';

test('preview combines search and equipment filters and opens a result', async () => {
  await render(<ExercisePreview onExit={jest.fn()} />);
  await userEvent.type(screen.getByLabelText('Search exercises'), 'press');
  expect(screen.getByText('1 exercise found')).toBeOnTheScreen();
  expect(screen.queryByText('Seated cable row')).not.toBeOnTheScreen();
  await userEvent.press(screen.getByRole('button', { name: 'Filters' }));
  await userEvent.press(screen.getByRole('button', { name: 'Cable' }));
  expect(screen.getByText('No matches')).toBeOnTheScreen();
  await userEvent.press(screen.getByRole('button', { name: 'Clear filters' }));
  await userEvent.press(screen.getByRole('button', { name: 'Incline dumbbell press, Dumbbell' }));
  expect(screen.getByRole('header', { name: 'Muscles worked' })).toBeOnTheScreen();
  expect(screen.getByText('Last 8 sessions')).toBeOnTheScreen();
});

test.each(['loading', 'error'] as const)('library does not show stale rows or empty feedback while %s', async state => {
  await render(<ExerciseLibraryScreen exercises={exerciseFixtures} filter={{ includeArchived: false }} state={state} onFilterChange={jest.fn()} onOpen={jest.fn()} onCreate={jest.fn()} onRetry={jest.fn()} />);
  expect(screen.queryByText('Incline dumbbell press')).not.toBeOnTheScreen();
  expect(screen.queryByText('Your library is empty')).not.toBeOnTheScreen();
  expect(screen.getByText(state === 'loading' ? 'Loading exercises' : 'Couldn’t load exercises')).toBeOnTheScreen();
});

test('invalid form does not save; rejected save keeps values and permits retry', async () => {
  const save = jest.fn().mockRejectedValueOnce(new Error('offline')).mockResolvedValueOnce(undefined);
  await render(<CustomExerciseScreen onSave={save} onCancel={jest.fn()} />);
  await userEvent.press(screen.getByRole('button', { name: 'Save exercise' }));
  expect(save).not.toHaveBeenCalled();
  await userEvent.type(screen.getByLabelText('Exercise name'), 'My press');
  await userEvent.press(screen.getByRole('button', { name: 'Save exercise' }));
  expect(screen.getByText('Couldn’t save exercise')).toBeOnTheScreen();
  expect(screen.getByLabelText('Exercise name')).toHaveDisplayValue('My press');
  expect(screen.queryByText('Exercise saved')).not.toBeOnTheScreen();
  await userEvent.press(screen.getByRole('button', { name: 'Save exercise' }));
  expect(screen.getByText('Exercise saved')).toBeOnTheScreen();
  expect(save).toHaveBeenCalledTimes(2);
});

test('pending save locks editing and duplicate submission until confirmed', async () => {
  let finish!: () => void;
  const save = jest.fn(() => new Promise<void>(resolve => { finish = resolve; }));
  await render(<CustomExerciseScreen initial={{ name: 'My row' }} onSave={save} onCancel={jest.fn()} />);
  await userEvent.press(screen.getByRole('button', { name: 'Save exercise' }));
  expect(screen.getByRole('button', { name: 'Save exercise' })).toBeBusy();
  expect(screen.getByRole('button', { name: 'Cancel' })).toBeDisabled();
  expect(screen.queryByText('Exercise saved')).not.toBeOnTheScreen();
  await userEvent.press(screen.getByRole('button', { name: 'Save exercise' }));
  expect(save).toHaveBeenCalledTimes(1);
  await act(() => finish());
  expect(screen.getByText('Exercise saved')).toBeOnTheScreen();
});

test('detail distinguishes missing history from no completed sessions', async () => {
  await render(<ExerciseDetailScreen exercise={exerciseFixtures[2]} state="ready" recentPerformance={{ state: 'empty' }} onRetry={jest.fn()} onRetryHistory={jest.fn()} onEdit={jest.fn()} />);
  expect(screen.getByText('No completed sessions yet')).toBeOnTheScreen();
  expect(screen.getByRole('button', { name: 'Edit exercise' })).toBeOnTheScreen();
});
