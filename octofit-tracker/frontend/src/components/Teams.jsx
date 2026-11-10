import { useApiCollection } from '../api/useApiCollection.js';
import DataTable from './DataTable.jsx';

const columns = [
  { key: 'name', label: 'Team' },
  { key: 'mascot', label: 'Mascot' },
  {
    key: 'members',
    label: 'Members',
    render: (team) => team.members?.length ?? 0,
  },
];

export default function Teams() {
  const { data, error, loading } = useApiCollection(
    '/api/teams/',
    'teams',
    'Teams',
  );

  return (
    <DataTable
      columns={columns}
      emptyMessage="No teams found."
      error={error}
      loading={loading}
      rows={data}
      rowKey={(team, index) => team.id ?? index}
      title="Teams"
    />
  );
}
