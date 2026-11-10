import { useApiCollection } from '../api/useApiCollection.js';
import DataTable from './DataTable.jsx';

const columns = [
  { key: 'name', label: 'Name' },
  { key: 'email', label: 'Email' },
  { key: 'fitnessGoal', label: 'Fitness goal' },
  { key: 'team', label: 'Team' },
];

export default function Users() {
  const { data, error, loading } = useApiCollection(
    '/api/users/',
    'users',
    'Users',
  );

  return (
    <DataTable
      columns={columns}
      emptyMessage="No users found."
      error={error}
      loading={loading}
      rows={data}
      rowKey={(user, index) => user.id ?? user.email ?? index}
      title="Users"
    />
  );
}
