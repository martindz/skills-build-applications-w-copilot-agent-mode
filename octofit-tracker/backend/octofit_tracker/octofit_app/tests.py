from django.urls import reverse
from rest_framework import status
from rest_framework.test import APITestCase

from .models import Activity, OctoFitUser, Team, Workout


class OctoFitApiTests(APITestCase):
    def setUp(self):
        self.team = Team.objects.create(name='Octocats', mascot='Mona')
        self.user = OctoFitUser.objects.create(
            name='Mona',
            email='mona@example.com',
            team=self.team,
            fitness_goal='endurance',
        )

    def test_api_root_is_available_at_root_and_api_prefix(self):
        root_response = self.client.get('/')
        api_response = self.client.get('/api/')

        self.assertEqual(root_response.status_code, status.HTTP_200_OK)
        self.assertEqual(api_response.status_code, status.HTTP_200_OK)
        self.assertIn('users', root_response.data)
        self.assertIn('leaderboard', api_response.data)
        self.assertEqual(
            root_response.data['activities'],
            'http://testserver/api/activities/',
        )

    def test_cors_allows_the_vite_development_origin(self):
        response = self.client.get(
            '/api/',
            HTTP_ORIGIN='http://localhost:5173',
        )

        self.assertEqual(
            response['Access-Control-Allow-Origin'],
            'http://localhost:5173',
        )

    def test_users_and_teams_are_listed_with_api_contract_fields(self):
        users_response = self.client.get(reverse('users'))
        teams_response = self.client.get(reverse('teams'))

        self.assertEqual(users_response.status_code, status.HTTP_200_OK)
        self.assertEqual(users_response.data['users'][0]['fitnessGoal'], 'endurance')
        self.assertEqual(teams_response.data['teams'][0]['members'], [self.user.pk])

    def test_team_create_assigns_existing_members(self):
        response = self.client.post(
            '/api/teams/',
            {
                'name': 'New Octocats',
                'mascot': 'Mona',
                'members': [self.user.pk],
            },
            format='json',
        )

        self.assertEqual(response.status_code, status.HTTP_201_CREATED)
        self.assertEqual(response.data['team']['members'], [self.user.pk])
        self.user.refresh_from_db()
        self.assertEqual(self.user.team.name, 'New Octocats')

    def test_activity_create_validates_references_and_defaults_fields(self):
        invalid_response = self.client.post('/api/activities/', {}, format='json')
        self.assertEqual(invalid_response.status_code, status.HTTP_400_BAD_REQUEST)
        self.assertEqual(Activity.objects.count(), 0)

        response = self.client.post(
            '/api/activities/',
            {
                'userId': self.user.pk,
                'teamId': self.team.pk,
                'type': 'run',
                'minutes': 30,
            },
            format='json',
        )

        self.assertEqual(response.status_code, status.HTTP_201_CREATED)
        self.assertEqual(response.data['activity']['points'], 30)
        self.assertEqual(response.data['activity']['user'], self.user.pk)
        self.assertTrue(response.data['activity']['occurredAt'])
        self.assertEqual(
            self.client.get('/api/activities/').data['activities'][0]['type'],
            'run',
        )

    def test_activity_cannot_be_assigned_to_a_different_user_team(self):
        another_team = Team.objects.create(name='Robocats', mascot='Hubot')
        response = self.client.post(
            '/api/activities/',
            {
                'userId': self.user.pk,
                'teamId': another_team.pk,
                'type': 'run',
                'minutes': 30,
            },
            format='json',
        )

        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)
        self.assertEqual(Activity.objects.count(), 0)

    def test_leaderboard_orders_teams_by_activity_points(self):
        robocats = Team.objects.create(name='Robocats', mascot='Hubot')
        hubot = OctoFitUser.objects.create(
            name='Hubot',
            email='hubot@example.com',
            team=robocats,
            fitness_goal='strength',
        )
        Activity.objects.create(
            user=self.user,
            team=self.team,
            type='run',
            minutes=25,
            points=25,
            occurred_at='2026-01-10T12:00:00Z',
        )
        Activity.objects.create(
            user=hubot,
            team=robocats,
            type='cycle',
            minutes=35,
            points=35,
            occurred_at='2026-01-11T12:00:00Z',
        )

        response = self.client.get('/api/leaderboard/')

        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(
            response.data['leaderboard'],
            [
                {'teamName': 'Robocats', 'totalPoints': 35, 'rank': 1},
                {'teamName': 'Octocats', 'totalPoints': 25, 'rank': 2},
            ],
        )

    def test_workout_suggestions_match_user_goal_and_unknown_users_404(self):
        Workout.objects.create(
            title='Strength Circuit',
            focus='strength',
            minutes=30,
            difficulty='moderate',
        )
        Workout.objects.create(
            title='Intervals',
            focus='endurance',
            minutes=30,
            difficulty='moderate',
        )

        response = self.client.get(
            '/api/workouts/suggestions/mona%40example.com/'
        )
        missing_user = self.client.get(
            '/api/workouts/suggestions/nobody%40example.com/'
        )

        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(response.data['suggestions'][0]['title'], 'Intervals')
        self.assertIn('endurance', response.data['suggestions'][0]['reason'])
        self.assertEqual(missing_user.status_code, status.HTTP_404_NOT_FOUND)

    def test_workouts_are_listed_and_created(self):
        response = self.client.post(
            '/api/workouts/',
            {
                'title': 'Intervals',
                'focus': 'endurance',
                'minutes': 30,
                'difficulty': 'moderate',
            },
            format='json',
        )

        self.assertEqual(response.status_code, status.HTTP_201_CREATED)
        self.assertEqual(response.data['workout']['title'], 'Intervals')
        self.assertEqual(
            self.client.get('/api/workouts/').data['workouts'][0]['focus'],
            'endurance',
        )
