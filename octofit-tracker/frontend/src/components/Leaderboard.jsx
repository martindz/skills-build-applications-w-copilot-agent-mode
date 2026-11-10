import { useApiCollection } from '../api/useApiCollection.js';
import DataTable from './DataTable.jsx';

const columns = [
  { key: 'rank', label: 'Rank' },
  { key: 'teamName', label: 'Team' },
  { key: 'totalPoints', label: 'Points' },
];

export default function Leaderboard() {
  const { data, error, loading } = useApiCollection(
    '/api/leaderboard/',
    'leaderboard',
    'Leaderboard',
  );

  return (
    <DataTable
      columns={columns}
      emptyMessage="No rankings found."
      error={error}
      loading={loading}
      rows={data}
      rowKey={(entry) => `${entry.rank}-${entry.teamName}`}
      title="Leaderboard"
    />
  );
}
