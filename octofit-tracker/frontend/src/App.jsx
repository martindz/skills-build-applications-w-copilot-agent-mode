import { Navigate, NavLink, Route, Routes } from 'react-router-dom';
import Activities from './components/Activities.jsx';
import Leaderboard from './components/Leaderboard.jsx';
import Teams from './components/Teams.jsx';
import Users from './components/Users.jsx';
import Workouts from './components/Workouts.jsx';

const navigation = [
  { to: '/activities', label: 'Activities' },
  { to: '/teams', label: 'Teams' },
  { to: '/leaderboard', label: 'Leaderboard' },
  { to: '/users', label: 'Users' },
  { to: '/workouts', label: 'Workouts' },
];

export default function App() {
  return (
    <div className="app-shell">
      <header className="app-header">
        <div className="container app-header-inner">
          <NavLink className="navbar-brand app-brand" to="/activities">
            OctoFit <span>Tracker</span>
          </NavLink>
          <nav aria-label="Main navigation" className="nav nav-pills app-nav">
            {navigation.map(({ to, label }) => (
              <NavLink
                className={({ isActive }) => `nav-link${isActive ? ' active' : ''}`}
                key={to}
                to={to}
              >
                {label}
              </NavLink>
            ))}
          </nav>
        </div>
      </header>

      <main className="container app-main">
        <section className="app-intro" aria-labelledby="app-title">
          <p className="app-eyebrow">Move together. Go further.</p>
          <h1 id="app-title" className="display-5 fw-bold">Your fitness, in focus.</h1>
          <p className="app-lead">
            Track activity, celebrate your team, and find your next workout.
          </p>
        </section>
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
      <footer className="app-footer">
        <div className="container">Small steps. Strong teams. Better days.</div>
      </footer>
    </div>
  );
}
