import { useApiCollection } from '../api/useApiCollection.js';
import DataTable from './DataTable.jsx';

const columns = [
  { key: 'type', label: 'Activity' },
  { key: 'minutes', label: 'Minutes' },
  { key: 'points', label: 'Points' },
  { key: 'user', label: 'User' },
  { key: 'team', label: 'Team' },
];

export default function Activities() {
  const { data, error, loading } = useApiCollection(
    '/api/activities/',
    'activities',
    'Activities',
  );

  return (
    <DataTable
      columns={columns}
      emptyMessage="No activities found."
      error={error}
      loading={loading}
      rows={data}
      rowKey={(activity, index) => activity.id ?? index}
      title="Activities"
    />
  );
}
