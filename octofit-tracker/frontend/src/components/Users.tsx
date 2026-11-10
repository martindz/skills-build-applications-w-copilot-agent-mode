import { useApiCollection } from '../api/useApiCollection.js';

type User = {
  id?: number | string;
  name: string;
  email: string;
  fitnessGoal?: string;
  team?: number | string | null;
};

export default function Users() {
  const { data, error, loading } = useApiCollection<User>(
    '/api/users/',
    'users',
    'Users',
  );

  return (
    <section aria-labelledby="users-heading">
      <h2 id="users-heading">Users</h2>
      {loading && <p role="status">Loading users...</p>}
      {error && <p role="alert">{error}</p>}
      {!loading && !error && data.length === 0 && <p>No users found.</p>}
      {!loading && !error && data.length > 0 && (
        <ul className="list-group">
          {data.map((user, index) => (
            <li className="list-group-item" key={user.id ?? user.email ?? index}>
              <strong>{user.name}</strong> ({user.email})
              {user.fitnessGoal && ` - Goal: ${user.fitnessGoal}`}
            </li>
          ))}
        </ul>
      )}
    </section>
  );
}
