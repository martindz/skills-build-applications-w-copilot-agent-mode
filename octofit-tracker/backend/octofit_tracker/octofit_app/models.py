from django.db import models


class Team(models.Model):
    name = models.CharField(max_length=100, unique=True)
    mascot = models.CharField(max_length=100)

    class Meta:
        db_table = 'octofit_teams'

    def __str__(self):
        return self.name


class OctoFitUser(models.Model):
    name = models.CharField(max_length=100)
    email = models.EmailField(unique=True)
    team = models.ForeignKey(Team, null=True, blank=True, on_delete=models.SET_NULL, related_name='users')
    fitness_goal = models.CharField(max_length=100)

    class Meta:
        db_table = 'octofit_users'

    def __str__(self):
        return self.email


class Activity(models.Model):
    user = models.ForeignKey(OctoFitUser, on_delete=models.CASCADE, related_name='activities')
    team = models.ForeignKey(Team, on_delete=models.CASCADE, related_name='activities')
    type = models.CharField(max_length=50)
    minutes = models.PositiveIntegerField()
    points = models.PositiveIntegerField()
    occurred_at = models.DateTimeField()

    class Meta:
        db_table = 'octofit_activities'
        constraints = [
            models.UniqueConstraint(
                fields=('user', 'team', 'type', 'occurred_at'),
                name='unique_octofit_activity',
            ),
        ]

    def __str__(self):
        return f'{self.type} by {self.user} ({self.points} points)'


class Workout(models.Model):
    title = models.CharField(max_length=100, unique=True)
    focus = models.CharField(max_length=100)
    minutes = models.PositiveIntegerField()
    difficulty = models.CharField(max_length=50)

    class Meta:
        db_table = 'octofit_workouts'

    def __str__(self):
        return self.title
