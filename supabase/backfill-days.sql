-- ─────────────────────────────────────────────────────────────
-- Backfill: mark past days as "trained"
-- ─────────────────────────────────────────────────────────────
-- Use this to log workouts you did but didn't tick off in the app.
-- Run it in your Supabase dashboard → SQL Editor → Run.
--
-- HOW TO USE
--   1. Set your account email below (the one you sign in to the app with).
--   2. Edit the rows in the VALUES list — one line per day:
--        ('<workout_day_id>', date 'YYYY-MM-DD', <minutes>, <completed>, <total>)
--   3. Run. Re-running is safe: it updates the same day instead of duplicating.
--
-- workout_day_id reference (current Mon–Thu program):
--   'upper-a'  Monday    – Upper Body A   (6 exercises)
--   'upper-b'  Tuesday   – Upper Body B   (6 exercises)
--   'lower-a'  Wednesday – Lower Body A   (6 exercises)
--   'lower-b'  Thursday  – Lower Body B   (6 exercises)
--
--   minutes   = how long the session took (estimate is fine)
--   completed = how many exercises you actually did
--   total     = exercises in that day (6 for every day above)
-- ─────────────────────────────────────────────────────────────

with me as (
  select id from auth.users
  where email = 'talal.shamout@expirationreminder.com'   -- ← change if needed
)
insert into public.completed_workouts
  (user_id, workout_day_id, date, duration_minutes, completed_exercises, total_exercises)
select me.id, v.workout_day_id, v.date, v.duration, v.completed, v.total
from me, (values
  -- ↓ edit / add / remove lines as needed
  ('upper-a', date '2026-06-22', 52, 6, 6),
  ('upper-b', date '2026-06-23', 50, 6, 6)
) as v(workout_day_id, date, duration, completed, total)
on conflict (user_id, workout_day_id, date) do update set
  duration_minutes    = excluded.duration_minutes,
  completed_exercises = excluded.completed_exercises,
  total_exercises     = excluded.total_exercises;

-- To REMOVE a wrongly-added day instead, run (with your email):
--   delete from public.completed_workouts
--   where user_id = (select id from auth.users where email = 'YOUR_EMAIL')
--     and date = date '2026-06-22';
