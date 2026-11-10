from django.contrib import admin

from .models import Activity, OctoFitUser, Team, Workout


@admin.register(OctoFitUser)
class OctoFitUserAdmin(admin.ModelAdmin):
    list_display = ('name', 'email', 'team', 'fitness_goal')
    list_filter = ('fitness_goal', 'team')
    search_fields = ('name', 'email')


@admin.register(Team)
class TeamAdmin(admin.ModelAdmin):
    list_display = ('name', 'mascot')
    search_fields = ('name', 'mascot')


@admin.register(Activity)
class ActivityAdmin(admin.ModelAdmin):
    list_display = ('type', 'user', 'team', 'minutes', 'points', 'occurred_at')
    list_filter = ('type', 'team')
    search_fields = ('user__name', 'user__email', 'team__name')


@admin.register(Workout)
class WorkoutAdmin(admin.ModelAdmin):
    list_display = ('title', 'focus', 'minutes', 'difficulty')
    list_filter = ('focus', 'difficulty')
    search_fields = ('title', 'focus')
