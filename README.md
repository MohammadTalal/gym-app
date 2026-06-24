# GymCoach — Beginner Trainer

A mobile-first gym workout app (React + TypeScript + Tailwind). Bilingual
(English / العربية with RTL), dark mode, and a step-by-step Workout Mode.

## Run locally

```bash
npm install
npm run dev      # http://localhost:5173
npm run build    # production build
npm run preview  # preview the production build
```

## Data & storage

The app **saves everything you enter** — profile, completed workouts, body
weight, and personal records. It ships with **no fake/sample data**: it starts
with your real profile and your starting weight, and fills up as you use it.

There are two storage modes, chosen automatically:

### 1. Local mode (default, no setup)

If no backend is configured, data is saved to this browser's `localStorage`.
Works offline and needs no account — but it stays on this one device.

### 2. Cloud mode (Supabase — syncs across devices)

Set up a free Supabase project so your data is saved to a real database and
syncs across devices, behind a sign-in.

1. Create a project at [supabase.com](https://supabase.com).
2. In the dashboard, open **SQL Editor**, paste the contents of
   [`supabase/schema.sql`](supabase/schema.sql), and click **Run**. This creates
   the tables and row-level-security policies (each account only sees its own data).
3. In **Settings → API**, copy the **Project URL** and the **anon public** key.
4. Copy `.env.example` to `.env.local` and fill them in:

   ```
   VITE_SUPABASE_URL=https://YOUR-PROJECT.supabase.co
   VITE_SUPABASE_ANON_KEY=your-anon-key
   ```

5. Restart `npm run dev`. The app now shows a sign-in screen. Create an account
   with email + password.

   > By default Supabase sends a confirmation email on sign-up. To skip that
   > while testing, turn off **Authentication → Sign In / Providers → Email →
   > Confirm email** in the Supabase dashboard.

On first sign-in, your real profile (Male, 176 cm, Beginner) and starting body
weight (84.5 kg) are created automatically. Everything you do from there is
saved to your account.

## Editing your data

- **Profile** — edit name, sex, height, level, and goal on the **Progress** tab
  (the card at the top). Sign out is there too in cloud mode.
- **Body weight** — log a new entry on the Progress tab.
- **Personal records** — set a record on any exercise's detail page.
- **Workouts** — logged automatically when you finish a session in Workout Mode.
- **Reset** — "Reset all progress" on the Progress tab clears history (keeps your profile).
- **Backfill past days** (cloud mode) — to log a day you trained but didn't tick
  off in the app, edit and run [`supabase/backfill-days.sql`](supabase/backfill-days.sql)
  in the Supabase SQL Editor.
