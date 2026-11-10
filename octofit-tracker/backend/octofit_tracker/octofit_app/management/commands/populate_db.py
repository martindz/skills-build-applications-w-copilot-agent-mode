from datetime import datetime

from django.core.management.base import BaseCommand

from octofit_app.models import Activity, OctoFitUser, Team, Workout


class Command(BaseCommand):
    help = 'Create or update the OctoFit demo teams, users, activities, and workouts.'

    def handle(self, *args, **options):
        octocats, _ = Team.objects.update_or_create(
            name='Octocats',
            defaults={'mascot': 'Mona'},
        )
        robocats, _ = Team.objects.update_or_create(
            name='Robocats',
            defaults={'mascot': 'Hubot'},
        )

        mona = self._upsert_user(
            name='Mona',
            email='mona@example.com',
            team=octocats,
            fitness_goal='endurance',
        )
        hubot = self._upsert_user(
            name='Hubot',
            email='hubot@example.com',
            team=robocats,
            fitness_goal='strength',
        )

        self._upsert_activity(mona, octocats, 'run', 40, '2026-01-10T12:00:00+00:00')
        self._upsert_activity(hubot, robocats, 'cycle', 25, '2026-01-11T12:00:00+00:00')

        Workout.objects.update_or_create(
            title='Intervals',
            defaults={'focus': 'endurance', 'minutes': 30, 'difficulty': 'moderate'},
        )
        Workout.objects.update_or_create(
            title='Strength Circuit',
            defaults={'focus': 'strength', 'minutes': 30, 'difficulty': 'moderate'},
        )

        self.stdout.write(self.style.SUCCESS('OctoFit demo data is ready.'))

    @staticmethod
    def _upsert_user(name, email, team, fitness_goal):
        user, _ = OctoFitUser.objects.update_or_create(
            email=email,
            defaults={'name': name, 'team': team, 'fitness_goal': fitness_goal},
        )
        return user

    @staticmethod
    def _upsert_activity(user, team, activity_type, minutes, occurred_at):
        Activity.objects.update_or_create(
            user=user,
            team=team,
            type=activity_type,
            occurred_at=datetime.fromisoformat(occurred_at),
            defaults={'minutes': minutes, 'points': minutes},
        )
