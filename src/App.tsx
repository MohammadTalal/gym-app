import { Routes, Route, useLocation } from 'react-router-dom';
import { Loader2 } from 'lucide-react';
import { BottomNav } from './components/BottomNav';
import { AuthScreen } from './components/AuthScreen';
import { AuthProvider, useAuth } from './context/AuthContext';
import { CloudAppProvider } from './context/CloudAppProvider';
import { LocalAppProvider } from './context/LocalAppProvider';
import { isSupabaseConfigured } from './lib/supabase';
import { Dashboard } from './pages/Dashboard';
import { TodayWorkout } from './pages/TodayWorkout';
import { WorkoutMode } from './pages/WorkoutMode';
import { Progress } from './pages/Progress';
import { Library } from './pages/Library';
import { ExerciseDetail } from './pages/ExerciseDetail';

function AppRoutes() {
  const location = useLocation();
  // Workout Mode is full-screen and hides the bottom nav for focus.
  const isWorkoutMode = location.pathname.startsWith('/workout/');

  return (
    <div className="mx-auto min-h-screen max-w-md bg-slate-50 dark:bg-slate-950">
      <main className={isWorkoutMode ? '' : 'pb-24'}>
        <Routes>
          <Route path="/" element={<Dashboard />} />
          <Route path="/today" element={<TodayWorkout />} />
          <Route path="/workout/:workoutId" element={<WorkoutMode />} />
          <Route path="/progress" element={<Progress />} />
          <Route path="/library" element={<Library />} />
          <Route path="/library/:exerciseId" element={<ExerciseDetail />} />
        </Routes>
      </main>
      {!isWorkoutMode && <BottomNav />}
    </div>
  );
}

/** Cloud mode: require sign-in, then load the user's data from Supabase. */
function CloudApp() {
  const { loading, session } = useAuth();

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-brand-500" />
      </div>
    );
  }
  if (!session) return <AuthScreen />;

  return (
    <CloudAppProvider>
      <AppRoutes />
    </CloudAppProvider>
  );
}

export default function App() {
  // With a backend configured, gate on auth + sync to Supabase. Otherwise fall
  // back to local-only storage so the app still works out of the box.
  if (isSupabaseConfigured) {
    return (
      <AuthProvider>
        <CloudApp />
      </AuthProvider>
    );
  }

  return (
    <LocalAppProvider>
      <AppRoutes />
    </LocalAppProvider>
  );
}
