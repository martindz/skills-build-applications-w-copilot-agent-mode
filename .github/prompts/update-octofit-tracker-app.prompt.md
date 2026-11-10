---
mode: 'agent'
model: copilot fusion
---

# Django App Updates

All Django project files are in `octofit-tracker/backend/octofit_tracker`.

1. Update `settings.py` for the MongoDB connection and CORS.
2. Update `models.py`, `serializers.py`, `urls.py`, `views.py`, `tests.py`, and `admin.py` to support the users, teams, activities, leaderboard, and workouts collections.
3. Ensure `/` points to the API and `api_root` is present in `urls.py`.
