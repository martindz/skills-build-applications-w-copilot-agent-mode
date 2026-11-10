import { useApiCollection } from '../api/useApiCollection.js';
import DataTable from './DataTable.jsx';

const columns = [
  { key: 'title', label: 'Workout' },
  { key: 'focus', label: 'Focus' },
  { key: 'minutes', label: 'Minutes' },
  { key: 'difficulty', label: 'Difficulty' },
  { key: 'reason', label: 'Recommendation' },
];

export default function Workouts() {
  const { data, error, loading } = useApiCollection(
    '/api/workouts/',
    'workouts',
    'Workouts',
  );

  return (
    <DataTable
      columns={columns}
      emptyMessage="No workouts found."
      error={error}
      loading={loading}
      rows={data}
      rowKey={(workout, index) => workout.id ?? index}
      title="Workouts"
    />
  );
}
