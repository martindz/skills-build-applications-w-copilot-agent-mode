from django.urls import path

from . import views

urlpatterns = [
    path('users/', views.UserListCreate.as_view(), name='users'),
    path('teams/', views.TeamListCreate.as_view(), name='teams'),
    path('activities/', views.ActivityListCreate.as_view(), name='activities'),
    path('leaderboard/', views.Leaderboard.as_view(), name='leaderboard'),
    path('workouts/', views.WorkoutListCreate.as_view(), name='workouts'),
    path(
        'workouts/suggestions/<str:user_email>/',
        views.WorkoutSuggestions.as_view(),
        name='workout-suggestions',
    ),
]
