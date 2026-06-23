-- ─────────────────────────────────────────────────────────────
-- GymCoach database schema
-- Run this once in your Supabase project: SQL Editor → paste → Run.
-- Every table is scoped to the signed-in user via Row Level Security,
-- so each account only ever sees and edits its own data.
-- ─────────────────────────────────────────────────────────────

-- Personal profile (one row per user).
create table if not exists public.profiles (
  user_id    uuid primary key references auth.users(id) on delete cascade,
  name       text    not null default 'Athlete',
  sex        text    not null default 'Male' check (sex in ('Male', 'Female')),
  height_cm  numeric not null default 176,
  level      text    not null default 'Beginner' check (level in ('Beginner', 'Intermediate', 'Advanced')),
  goal       text    not null default '',
  dark_mode  boolean not null default true,
  updated_at timestamptz not null default now()
);

-- Logged workout sessions.
create table if not exists public.completed_workouts (
  id                 uuid primary key default gen_random_uuid(),
  user_id            uuid not null references auth.users(id) on delete cascade,
  workout_day_id     text not null,
  date               date not null,
  duration_minutes   int  not null default 0,
  completed_exercises int not null default 0,
  total_exercises    int  not null default 0,
  unique (user_id, workout_day_id, date)
);

-- Body-weight history.
create table if not exists public.body_weight (
  user_id   uuid not null references auth.users(id) on delete cascade,
  date      date not null,
  weight_kg numeric not null,
  primary key (user_id, date)
);

-- Personal records (best lift per exercise).
create table if not exists public.personal_records (
  user_id     uuid not null references auth.users(id) on delete cascade,
  exercise_id text not null,
  weight_kg   numeric not null,
  reps        int  not null,
  date        date not null,
  primary key (user_id, exercise_id)
);

-- Per-day "exercise ticked complete" markers (drives Today's checkboxes).
create table if not exists public.exercise_completions (
  user_id     uuid not null references auth.users(id) on delete cascade,
  date        date not null,
  exercise_id text not null,
  primary key (user_id, date, exercise_id)
);

-- ── Row Level Security ────────────────────────────────────────
alter table public.profiles             enable row level security;
alter table public.completed_workouts   enable row level security;
alter table public.body_weight          enable row level security;
alter table public.personal_records     enable row level security;
alter table public.exercise_completions enable row level security;

create policy "own_profiles" on public.profiles
  for all using (auth.uid() = user_id) with check (auth.uid() = user_id);

create policy "own_completed_workouts" on public.completed_workouts
  for all using (auth.uid() = user_id) with check (auth.uid() = user_id);

create policy "own_body_weight" on public.body_weight
  for all using (auth.uid() = user_id) with check (auth.uid() = user_id);

create policy "own_personal_records" on public.personal_records
  for all using (auth.uid() = user_id) with check (auth.uid() = user_id);

create policy "own_exercise_completions" on public.exercise_completions
  for all using (auth.uid() = user_id) with check (auth.uid() = user_id);
