from django.shortcuts import get_object_or_404
from rest_framework import generics
from rest_framework.response import Response
from rest_framework.views import APIView

from .models import Activity, OctoFitUser, Team, Workout
from .serializers import (
    ActivitySerializer,
    TeamSerializer,
    UserSerializer,
    WorkoutSerializer,
)


class EnvelopeListCreateAPIView(generics.ListCreateAPIView):
    response_key = None
    response_item_key = None

    def list(self, request, *args, **kwargs):
        serializer = self.get_serializer(self.get_queryset(), many=True)
        return Response({self.response_key: serializer.data})

    def create(self, request, *args, **kwargs):
        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        self.perform_create(serializer)
        return Response(
            {self.response_item_key: serializer.data},
            status=201,
        )


class UserListCreate(EnvelopeListCreateAPIView):
    queryset = OctoFitUser.objects.select_related('team').order_by('name', 'id')
    serializer_class = UserSerializer
    response_key = 'users'
    response_item_key = 'user'


class TeamListCreate(EnvelopeListCreateAPIView):
    queryset = Team.objects.prefetch_related('users').order_by('name', 'id')
    serializer_class = TeamSerializer
    response_key = 'teams'
    response_item_key = 'team'


class ActivityListCreate(EnvelopeListCreateAPIView):
    queryset = Activity.objects.select_related('user', 'team').order_by(
        '-occurred_at',
        '-id',
    )
    serializer_class = ActivitySerializer
    response_key = 'activities'
    response_item_key = 'activity'


class WorkoutListCreate(EnvelopeListCreateAPIView):
    queryset = Workout.objects.order_by('title', 'id')
    serializer_class = WorkoutSerializer
    response_key = 'workouts'
    response_item_key = 'workout'


class Leaderboard(APIView):
    def get(self, request):
        teams = Team.objects.prefetch_related('activities').order_by('name', 'id')
        scores = [
            (
                team,
                sum(activity.points for activity in team.activities.all()),
            )
            for team in teams
        ]
        scores.sort(key=lambda item: (-item[1], item[0].name.casefold(), item[0].id))
        leaderboard = [
            {
                'teamName': team.name,
                'totalPoints': total_points,
                'rank': rank,
            }
            for rank, (team, total_points) in enumerate(scores, start=1)
        ]
        return Response({'leaderboard': leaderboard})


class WorkoutSuggestions(APIView):
    def get(self, request, user_email):
        user = get_object_or_404(OctoFitUser, email=user_email)
        latest_activity = user.activities.order_by('-occurred_at').first()
        goal = user.fitness_goal.casefold()
        activity_type = latest_activity.type.casefold() if latest_activity else None
        workouts = list(Workout.objects.order_by('title', 'id'))
        workouts.sort(
            key=lambda workout: (
                workout.focus.casefold() not in {goal, activity_type},
                workout.title.casefold(),
            )
        )

        suggestions = []
        for workout in workouts:
            data = dict(WorkoutSerializer(workout).data)
            if workout.focus.casefold() == goal:
                data['reason'] = f'Matches your {user.fitness_goal} fitness goal.'
            elif workout.focus.casefold() == activity_type:
                data['reason'] = f'Matches your recent {latest_activity.type} activity.'
            else:
                data['reason'] = 'A workout suggestion to support your fitness routine.'
            suggestions.append(data)

        return Response({'suggestions': suggestions})
