import { useApiCollection } from '../api/useApiCollection.js';

type Activity = {
  id?: number | string;
  type: string;
  minutes: number;
  points: number;
  user?: number | string;
  team?: number | string;
};

export default function Activities() {
  const { data, error, loading } = useApiCollection<Activity>(
    '/api/activities/',
    'activities',
    'Activities',
  );

  return (
    <section aria-labelledby="activities-heading">
      <h2 id="activities-heading">Activities</h2>
      {loading && <p role="status">Loading activities...</p>}
      {error && <p role="alert">{error}</p>}
      {!loading && !error && data.length === 0 && <p>No activities found.</p>}
      {!loading && !error && data.length > 0 && (
        <ul className="list-group">
          {data.map((activity, index) => (
            <li className="list-group-item" key={activity.id ?? index}>
              <strong>{activity.type}</strong>
              {' - '}
              {activity.minutes} minutes, {activity.points} points
            </li>
          ))}
        </ul>
      )}
    </section>
  );
}
