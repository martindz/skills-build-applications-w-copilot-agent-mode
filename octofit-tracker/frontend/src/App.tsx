import { Navigate, NavLink, Route, Routes } from 'react-router-dom';
import Activities from './components/Activities.js';
import Leaderboard from './components/Leaderboard.js';
import Teams from './components/Teams.js';
import Users from './components/Users.js';
import Workouts from './components/Workouts.js';

const navigation = [
  { to: '/activities', label: 'Activities' },
  { to: '/teams', label: 'Teams' },
  { to: '/leaderboard', label: 'Leaderboard' },
  { to: '/users', label: 'Users' },
  { to: '/workouts', label: 'Workouts' },
];

export default function App() {
  return (
    <div className="container py-4">
      <header className="mb-4">
        <h1>OctoFit Tracker</h1>
        <nav aria-label="Main navigation" className="nav nav-pills flex-wrap">
          {navigation.map(({ to, label }) => (
            <NavLink className="nav-link" key={to} to={to}>
              {label}
            </NavLink>
          ))}
        </nav>
      </header>
      <main>
        <Routes>
          <Route path="/" element={<Navigate to="/activities" replace />} />
          <Route path="/activities" element={<Activities />} />
          <Route path="/teams" element={<Teams />} />
          <Route path="/leaderboard" element={<Leaderboard />} />
          <Route path="/users" element={<Users />} />
          <Route path="/workouts" element={<Workouts />} />
          <Route path="*" element={<Navigate to="/activities" replace />} />
        </Routes>
      </main>
    </div>
  );
}
