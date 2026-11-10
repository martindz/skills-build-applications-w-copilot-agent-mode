import { useApiCollection } from '../api/useApiCollection.js';

type Workout = {
  id?: number | string;
  title: string;
  focus?: string;
  minutes?: number;
  difficulty?: string;
  reason?: string;
};

export default function Workouts() {
  const { data, error, loading } = useApiCollection<Workout>(
    '/api/workouts/',
    'workouts',
    'Workouts',
  );

  return (
    <section aria-labelledby="workouts-heading">
      <h2 id="workouts-heading">Workouts</h2>
      {loading && <p role="status">Loading workouts...</p>}
      {error && <p role="alert">{error}</p>}
      {!loading && !error && data.length === 0 && <p>No workouts found.</p>}
      {!loading && !error && data.length > 0 && (
        <ul className="list-group">
          {data.map((workout, index) => (
            <li className="list-group-item" key={workout.id ?? index}>
              <strong>{workout.title}</strong>
              {workout.focus && ` - ${workout.focus}`}
              {workout.minutes !== undefined && `, ${workout.minutes} minutes`}
              {workout.difficulty && ` (${workout.difficulty})`}
              {workout.reason && <p className="mb-0">{workout.reason}</p>}
            </li>
          ))}
        </ul>
      )}
    </section>
  );
}
