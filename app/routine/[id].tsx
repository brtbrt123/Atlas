import { useLocalSearchParams } from 'expo-router';

import { RoutePlaceholder } from '../../src/navigation/RoutePlaceholder';

// `id` is a routine UUID, or "new" to create one in the builder (RTN-06).
export default function RoutineRoute() {
  const { id } = useLocalSearchParams<{ id: string }>();
  return <RoutePlaceholder title={id === 'new' ? 'New Routine' : 'Routine'} detail={`Routine ${id}. The builder arrives with RTN-06.`} />;
}
