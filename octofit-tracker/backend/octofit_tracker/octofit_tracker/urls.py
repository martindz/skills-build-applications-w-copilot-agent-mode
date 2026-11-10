from django.urls import include, path, reverse
from rest_framework.decorators import api_view
from rest_framework.response import Response


@api_view(['GET'])
def api_root(request):
    return Response({
        'users': request.build_absolute_uri(reverse('users')),
        'teams': request.build_absolute_uri(reverse('teams')),
        'activities': request.build_absolute_uri(reverse('activities')),
        'leaderboard': request.build_absolute_uri(reverse('leaderboard')),
        'workouts': request.build_absolute_uri(reverse('workouts')),
    })


urlpatterns = [
    path('', api_root, name='api-root'),
    path('api/', api_root, name='api-root-alias'),
    path('api/', include('octofit_app.urls')),
]
