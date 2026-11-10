from django.conf import settings
from django.urls import include, path, reverse
from rest_framework.decorators import api_view
from rest_framework.response import Response


@api_view(['GET'])
def api_root(request):
    codespace_host = (
        f'{settings.CODESPACE_NAME}-8000.app.github.dev'
        if settings.CODESPACE_NAME
        else None
    )
    base_url = (
        f'https://{codespace_host}'
        if codespace_host and request.get_host() == codespace_host
        else request.build_absolute_uri('/').rstrip('/')
    )
    return Response({
        'users': f'{base_url}{reverse("users")}',
        'teams': f'{base_url}{reverse("teams")}',
        'activities': f'{base_url}{reverse("activities")}',
        'leaderboard': f'{base_url}{reverse("leaderboard")}',
        'workouts': f'{base_url}{reverse("workouts")}',
    })


urlpatterns = [
    path('', api_root, name='api-root'),
    path('api/', api_root, name='api-root-alias'),
    path('api/', include('octofit_app.urls')),
]
