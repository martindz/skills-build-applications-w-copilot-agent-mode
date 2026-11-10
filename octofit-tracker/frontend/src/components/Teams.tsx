import { useApiCollection } from '../api/useApiCollection.js';

type Team = {
  id?: number | string;
  name: string;
  mascot?: string;
  members?: Array<number | string>;
};

export default function Teams() {
  const { data, error, loading } = useApiCollection<Team>(
    '/api/teams/',
    'teams',
    'Teams',
  );

  return (
    <section aria-labelledby="teams-heading">
      <h2 id="teams-heading">Teams</h2>
      {loading && <p role="status">Loading teams...</p>}
      {error && <p role="alert">{error}</p>}
      {!loading && !error && data.length === 0 && <p>No teams found.</p>}
      {!loading && !error && data.length > 0 && (
        <ul className="list-group">
          {data.map((team, index) => (
            <li className="list-group-item" key={team.id ?? index}>
              <strong>{team.name}</strong>
              {team.mascot && ` - ${team.mascot}`}
              {team.members && ` (${team.members.length} members)`}
            </li>
          ))}
        </ul>
      )}
    </section>
  );
}
