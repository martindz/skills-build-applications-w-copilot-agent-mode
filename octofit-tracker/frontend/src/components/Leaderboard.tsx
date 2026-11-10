import { useApiCollection } from '../api/useApiCollection.js';

type LeaderboardEntry = {
  teamName: string;
  totalPoints: number;
  rank: number;
};

export default function Leaderboard() {
  const { data, error, loading } = useApiCollection<LeaderboardEntry>(
    '/api/leaderboard/',
    'leaderboard',
    'Leaderboard',
  );

  return (
    <section aria-labelledby="leaderboard-heading">
      <h2 id="leaderboard-heading">Leaderboard</h2>
      {loading && <p role="status">Loading leaderboard...</p>}
      {error && <p role="alert">{error}</p>}
      {!loading && !error && data.length === 0 && <p>No rankings found.</p>}
      {!loading && !error && data.length > 0 && (
        <ol className="list-group list-group-numbered">
          {data.map((entry) => (
            <li className="list-group-item" key={`${entry.rank}-${entry.teamName}`}>
              <strong>{entry.teamName}</strong> - {entry.totalPoints} points
            </li>
          ))}
        </ol>
      )}
    </section>
  );
}
