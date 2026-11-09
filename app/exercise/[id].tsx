import { useLocalSearchParams } from 'expo-router';

import { RoutePlaceholder } from '../../src/navigation/RoutePlaceholder';

// `id` is an exercise UUID, or "new" to create a custom exercise (EXL-08).
export default function ExerciseRoute() {
  const { id } = useLocalSearchParams<{ id: string }>();
  return <RoutePlaceholder title={id === 'new' ? 'New Exercise' : 'Exercise'} detail={`Exercise ${id}. Details arrive with EXL-07.`} />;
}
