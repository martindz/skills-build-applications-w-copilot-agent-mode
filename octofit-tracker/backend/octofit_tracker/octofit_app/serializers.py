from django.utils import timezone
from rest_framework import serializers

from .models import Activity, OctoFitUser, Team, Workout


class UserSerializer(serializers.ModelSerializer):
    fitnessGoal = serializers.CharField(source='fitness_goal')

    class Meta:
        model = OctoFitUser
        fields = ('id', 'name', 'email', 'team', 'fitnessGoal')


class TeamSerializer(serializers.ModelSerializer):
    members = serializers.PrimaryKeyRelatedField(
        source='users',
        many=True,
        queryset=OctoFitUser.objects.all(),
        required=False,
    )

    class Meta:
        model = Team
        fields = ('id', 'name', 'mascot', 'members')

    def create(self, validated_data):
        members = validated_data.pop('users', [])
        team = Team.objects.create(**validated_data)
        OctoFitUser.objects.filter(
            pk__in=[member.pk for member in members],
        ).update(team=team)
        return team


class ActivitySerializer(serializers.ModelSerializer):
    user = serializers.IntegerField(source='user_id', read_only=True)
    team = serializers.IntegerField(source='team_id', read_only=True)
    userId = serializers.PrimaryKeyRelatedField(
        source='user',
        queryset=OctoFitUser.objects.all(),
        write_only=True,
    )
    teamId = serializers.PrimaryKeyRelatedField(
        source='team',
        queryset=Team.objects.all(),
        write_only=True,
    )
    occurredAt = serializers.DateTimeField(
        source='occurred_at',
        required=False,
    )
    points = serializers.IntegerField(min_value=0, required=False)

    class Meta:
        model = Activity
        fields = (
            'id',
            'user',
            'team',
            'userId',
            'teamId',
            'type',
            'minutes',
            'points',
            'occurredAt',
        )

    def create(self, validated_data):
        validated_data.setdefault('points', validated_data['minutes'])
        validated_data.setdefault('occurred_at', timezone.now())
        return super().create(validated_data)

    def validate(self, attrs):
        user = attrs['user']
        team = attrs['team']
        if user.team_id != team.pk:
            raise serializers.ValidationError({
                'teamId': 'The activity team must match the user team.',
            })
        return attrs


class WorkoutSerializer(serializers.ModelSerializer):
    class Meta:
        model = Workout
        fields = ('id', 'title', 'focus', 'minutes', 'difficulty')
