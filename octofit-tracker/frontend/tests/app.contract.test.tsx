import '@testing-library/jest-dom/vitest';
import { cleanup, render, screen, waitFor } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import App from '../src/App.jsx';

function renderRoute(route: string) {
  return render(<MemoryRouter initialEntries={[route]}><App /></MemoryRouter>);
}

const capabilities = [
  { route: '/activities', empty: { activities: [] }, emptyText: /no activities/i },
  { route: '/teams', empty: { teams: [] }, emptyText: /no teams/i },
  { route: '/leaderboard', empty: { leaderboard: [] }, emptyText: /no (leaderboard|rankings|scores)/i },
  { route: '/users', empty: { users: [] }, emptyText: /no users/i },
  { route: '/workouts', empty: { workouts: [] }, emptyText: /no workouts/i },
];

describe('OctoFit presentation contract', () => {
  afterEach(() => {
    cleanup();
    vi.unstubAllGlobals();
  });

  beforeEach(() => {
    vi.restoreAllMocks();
    vi.stubGlobal('fetch', vi.fn(async (input: RequestInfo | URL) => {
      const url = String(input);
      if (url.includes('/api/activities')) return new Response(JSON.stringify({ activities: [{ type: 'run', minutes: 30, points: 30 }] }), { status: 200 });
      if (url.includes('/api/teams')) return new Response(JSON.stringify({ teams: [{ name: 'Octocats', members: ['Mona'] }] }), { status: 200 });
      if (url.includes('/api/leaderboard')) return new Response(JSON.stringify({ leaderboard: [{ teamName: 'Octocats', totalPoints: 90, rank: 1 }] }), { status: 200 });
      if (url.includes('/api/users')) return new Response(JSON.stringify({ users: [{ name: 'Mona', email: 'mona@example.com' }] }), { status: 200 });
      if (url.includes('/api/workouts')) return new Response(JSON.stringify({ workouts: [{ title: 'Intervals', reason: 'Build endurance' }] }), { status: 200 });
      return new Response(JSON.stringify({ message: 'Not found' }), { status: 404 });
    }));
  });

  it('renders activity data from the API', async () => {
    renderRoute('/activities');
    expect(screen.getByRole('heading', { name: /activities/i })).toBeInTheDocument();
    await waitFor(() => {
      expect(screen.getByRole('table')).toHaveClass('table', 'table-hover');
      expect(screen.getByText(/run/i)).toBeInTheDocument();
    });
  });

  it('renders teams, leaderboard, users, and workouts with accessible content', async () => {
    const teams = renderRoute('/teams');
    await waitFor(() => {
      expect(screen.getByRole('table')).toHaveClass('table', 'table-hover');
      expect(screen.getByText(/Octocats/)).toBeInTheDocument();
    });
    teams.unmount();
    const leaderboard = renderRoute('/leaderboard');
    await waitFor(() => {
      expect(screen.getByRole('table')).toHaveClass('table', 'table-hover');
      expect(screen.getByText(/90/)).toBeInTheDocument();
    });
    leaderboard.unmount();
    const users = renderRoute('/users');
    await waitFor(() => {
      expect(screen.getByRole('table')).toHaveClass('table', 'table-hover');
      expect(screen.getByText(/Mona/)).toBeInTheDocument();
    });
    users.unmount();
    renderRoute('/workouts');
    await waitFor(() => {
      expect(screen.getByRole('table')).toHaveClass('table', 'table-hover');
      expect(screen.getByText(/Intervals/)).toBeInTheDocument();
    });
  });

  it('shows the main navigation and requests the REST collection endpoints', async () => {
    renderRoute('/workouts');
    expect(screen.getByRole('navigation', { name: /main navigation/i })).toHaveTextContent(
      /activities.*teams.*leaderboard.*users.*workouts/i,
    );
    await waitFor(() => expect(fetch).toHaveBeenCalledWith(
      expect.stringMatching(/\/api\/workouts\/$/),
    ));
  });

  it('accepts both plain arrays and paginated results', async () => {
    vi.stubGlobal('fetch', vi.fn(async (input: RequestInfo | URL) => {
      if (String(input).includes('/api/activities')) {
        return new Response(JSON.stringify([{ type: 'walk', minutes: 15, points: 15 }]), { status: 200 });
      }
      return new Response(JSON.stringify({ count: 1, results: [{ name: 'Paginated team' }] }), { status: 200 });
    }));

    renderRoute('/activities');
    await waitFor(() => expect(screen.getByText(/walk/)).toBeInTheDocument());
    cleanup();
    renderRoute('/teams');
    await waitFor(() => expect(screen.getByText(/Paginated team/)).toBeInTheDocument());
  });

  for (const capability of capabilities) {
    describe(capability.route, () => {
      it('announces a loading state while the API request is pending', () => {
        vi.stubGlobal('fetch', vi.fn(() => new Promise<Response>(() => {})));
        renderRoute(capability.route);
        expect(screen.getByRole('status')).toHaveTextContent(/loading/i);
      });

      it('shows a meaningful empty state', async () => {
        vi.stubGlobal('fetch', vi.fn(async () => new Response(JSON.stringify(capability.empty), { status: 200 })));
        renderRoute(capability.route);
        await waitFor(() => expect(screen.getByText(capability.emptyText)).toBeInTheDocument());
      });

      it('announces API failures as an accessible alert', async () => {
        vi.stubGlobal('fetch', vi.fn(async () => new Response(JSON.stringify({ message: 'Unavailable' }), { status: 503 })));
        renderRoute(capability.route);
        await waitFor(() => expect(screen.getByRole('alert')).toHaveTextContent(/unable|unavailable|error/i));
      });
    });
  }
});
