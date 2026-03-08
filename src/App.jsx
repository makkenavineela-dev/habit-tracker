import React, { useState, useEffect } from 'react';
import { Routes, Route, useNavigate, useLocation } from 'react-router-dom';
import { AnimatePresence, motion } from 'framer-motion';
import confetti from 'canvas-confetti';
import PriorityDashboard from './components/PriorityDashboard';
import DailyGrid from './components/DailyGrid';
import WeeklyTracker from './components/WeeklyTracker';
import DSATracker from './components/DSATracker';
import ChallengeGallery from './components/ChallengeGallery';
import ChallengeDetailPage from './components/ChallengeDetailPage';
import DSADetailPage from './components/DSADetailPage';
import WeeklyDetailPage from './components/WeeklyDetailPage';
import UserProfile from './components/UserProfile';
import ZenTimer from './components/ZenTimer';
import { formatDate } from './utils/dateUtils';
import { Zap, Activity, Dumbbell, BookOpen, User, Sun, Droplets, Footprints, Moon, Sparkles, Trophy, Plus, X, LogOut, Cloud, CloudOff, CheckCircle, RefreshCw } from 'lucide-react';
import { Haptics, ImpactStyle } from '@capacitor/haptics';
import { StatusBar, Style } from '@capacitor/status-bar';
import { LocalNotifications } from '@capacitor/local-notifications';
import { supabase } from './lib/supabase';
import Auth from './components/Auth';
import useHabitStore from './store/useHabitStore';
import './App.css';

// Native Bridge Helper
const triggerHaptic = async () => {
  try {
    await Haptics.impact({ style: ImpactStyle.Light });
  } catch (e) {
    // Falls back gracefully on web
  }
};

// Initial data for fresh installs
const defaultProblems = [
  { id: 1, number: "1", name: "Two Sum", platform: "LeetCode", difficulty: "Easy", topic: "Hash Table", status: "Done", dateAdded: formatDate(new Date()) },
  { id: 2, number: "146", name: "LRU Cache", platform: "LeetCode", difficulty: "Medium", topic: "Design", status: "Attempted", dateAdded: formatDate(new Date()) }
];

const defaultChallenges = [
  { id: 1, title: "10k Steps Challenge", startDate: "2026-03-01", endDate: "2026-03-31", checks: Array(30).fill(false).map((_, i) => i < 5) }
];

const defaultWeekly = [
  { id: 1, name: "Running", icon: 'activity', target: 3, checks: 2 },
  { id: 2, name: "Book Reading", icon: 'book', target: 1, checks: 0 }
];

const defaultDaily = [
  { id: 1, name: "Deep Work", icon: 'sparkles', completedDates: [formatDate(new Date())] },
  { id: 2, name: "Hydration", icon: 'droplets', completedDates: [] }
];

const PageTransition = ({ children }) => (
  <motion.div
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    exit={{ opacity: 0, y: -20 }}
    className="page-transition"
    transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
  >
    {children}
  </motion.div>
);

// Basic Error Boundary
class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null };
  }
  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }
  componentDidCatch(error, errorInfo) {
    console.error("Vital Error Caught:", error, errorInfo);
  }
  render() {
    if (this.state.hasError) {
      return (
        <div style={{ padding: '2rem', background: '#fff1f0', color: '#c93d3d', minHeight: '100vh', fontFamily: 'monospace' }}>
          <h2>Something went wrong in Ritual Flow.</h2>
          <pre>{this.state.error?.toString()}</pre>
          <button onClick={() => { if (confirm("This will delete all your local habit data. Are you sure?")) { localStorage.clear(); window.location.reload(); } }} style={{ padding: '0.5rem 1rem', background: '#c93d3d', color: 'white', border: 'none', borderRadius: '4px' }}>
            Clear Local Data & Refresh
          </button>
        </div>
      );
    }
    return this.props.children;
  }
}

const SyncIndicator = ({ status }) => {
  const meta = {
    syncing: { icon: <RefreshCw size={14} className="animate-spin" />, text: 'Syncing...', color: 'var(--accent-sage-dark)' },
    saved: { icon: <CheckCircle size={14} />, text: 'Cloud Secured', color: 'var(--tag-green-text)' },
    error: { icon: <CloudOff size={14} />, text: 'Sync Paused', color: 'var(--tag-red-text)' },
    idle: { icon: <Cloud size={14} />, text: 'Cloud Sync On', color: 'var(--text-muted)' }
  };

  const current = meta[status] || meta.idle;

  return (
    <motion.div
      initial={{ opacity: 0, y: -10 }}
      animate={{ opacity: 1, y: 0 }}
      style={{
        display: 'flex', alignItems: 'center', gap: '0.4rem',
        padding: '0.4rem 0.8rem', borderRadius: '100px',
        background: 'var(--bg-tertiary)', fontSize: '0.75rem',
        fontWeight: 800, color: current.color,
        border: `1px solid ${status === 'syncing' ? 'var(--accent-sage)' : 'transparent'}`,
        transition: 'all 0.3s ease'
      }}
    >
      {current.icon}
      <span style={{ textTransform: 'uppercase', letterSpacing: '0.03em' }}>{current.text}</span>
    </motion.div>
  );
};

const BackgroundDecoration = () => (
  <div style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, zIndex: -1, overflow: 'hidden', pointerEvents: 'none' }}>
    <motion.div
      animate={{
        scale: [1, 1.3, 1],
        rotate: [0, 120, 0],
        x: ['-10%', '10%', '-10%'],
        y: ['-5%', '15%', '-5%']
      }}
      transition={{ duration: 25, repeat: Infinity, ease: "easeInOut" }}
      style={{
        position: 'absolute', top: '-15%', left: '-15%', width: '50%', height: '50%',
        background: 'radial-gradient(circle, rgba(91, 115, 88, 0.08) 0%, transparent 70%)',
        filter: 'blur(80px)', opacity: 0.8
      }}
    />
    <motion.div
      animate={{
        scale: [1.3, 1, 1.3],
        rotate: [0, -90, 0],
        x: ['10%', '-10%', '10%'],
        y: ['15%', '-5%', '15%']
      }}
      transition={{ duration: 30, repeat: Infinity, ease: "easeInOut" }}
      style={{
        position: 'absolute', bottom: '-10%', right: '-10%', width: '45%', height: '45%',
        background: 'radial-gradient(circle, rgba(166, 139, 124, 0.06) 0%, transparent 70%)',
        filter: 'blur(60px)', opacity: 0.6
      }}
    />
  </div>
);

export default function App() {
  const navigate = useNavigate();
  const location = useLocation();
  const [session, setSession] = useState(null);
  const [isInitializing, setIsInitializing] = useState(true);
  const [isTimerOpen, setIsTimerOpen] = useState(false);
  const [recoveryMode, setRecoveryMode] = useState(false);

  useEffect(() => {
    const checkSession = async () => {
      try {
        const { data: { session } } = await supabase.auth.getSession();
        setSession(session);
      } catch (e) {
        console.error("Session check failed:", e);
      } finally {
        setIsInitializing(false);
      }
    };

    checkSession();

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((event, session) => {
      if (event === 'PASSWORD_RECOVERY') {
        setRecoveryMode(true);
      }
      setSession(session);
      setIsInitializing(false);
    });

    return () => subscription.unsubscribe();
  }, []);

  useEffect(() => {
    const initNative = async () => {
      try {
        await StatusBar.setStyle({ style: Style.Light });
        await StatusBar.setBackgroundColor({ color: '#fdfdfc' });
      } catch (e) { }
    };
    initNative();
  }, []);

  useEffect(() => {
    const setupReminders = async () => {
      try {
        const { display } = await LocalNotifications.checkPermissions();
        if (display !== 'granted') {
          await LocalNotifications.requestPermissions();
        }

        // Clear existing to avoid duplicates
        await LocalNotifications.cancel({ notifications: [{ id: 101 }] });

        await LocalNotifications.schedule({
          notifications: [
            {
              title: "Sacred Rituals Await",
              body: "Take a moment to center yourself and log your progress.",
              id: 101,
              schedule: {
                on: { hour: 21, minute: 0 },
                repeats: true,
                allowWhileIdle: true
              },
              sound: 'default',
              actionTypeId: "",
              extra: null
            }
          ]
        });
      } catch (e) {
        console.warn("Notifications not supported or denied.");
      }
    };
    setupReminders();
  }, []);

  // Load state from localStorage with validation
  const loadState = (key, fallback) => {
    try {
      const saved = localStorage.getItem(key);
      if (!saved) return fallback;
      const parsed = JSON.parse(saved);
      // Basic check to ensure it's an array if expected
      if (Array.isArray(fallback) && !Array.isArray(parsed)) return fallback;
      return parsed;
    } catch (e) {
      console.error(`Error loading ${key} from localStorage:`, e);
      return fallback;
    }
  };

  const [globalProgress, setGlobalProgress] = useState(0);
  const [syncStatus, setSyncStatus] = useState('idle'); // 'idle', 'syncing', 'saved', 'error'
  const [isCloudLoaded, setIsCloudLoaded] = useState(false);

  const {
    dailyHabits, setDailyHabits,
    weeklyHabits, setWeeklyHabits,
    challenges, setChallenges,
    problems, setProblems,
    addDailyHabit, deleteDailyHabit, updateDailyHabit
  } = useHabitStore();

  // Load from Cloud once on session change
  useEffect(() => {
    if (session?.user?.id && !isCloudLoaded) {
      const loadFromCloud = async () => {
        const { data, error } = await supabase
          .from('user_sync')
          .select('*')
          .eq('user_id', session.user.id)
          .single();

        if (data && !error) {
          if (data.problems) setProblems(data.problems);
          if (data.challenges) setChallenges(data.challenges);
          if (data.weeklyHabits) setWeeklyHabits(data.weeklyHabits);
          if (data.dailyHabits) setDailyHabits(data.dailyHabits);
        }
        setIsCloudLoaded(true);
      };
      loadFromCloud();
    } else if (!session) {
      setIsCloudLoaded(false);
    }
  }, [session, isCloudLoaded]);

  // Debounced Auto-Save & Sync Effect
  useEffect(() => {
    if (!isCloudLoaded) return; // Prevent overwriting cloud data before it's loaded

    const syncTimeout = setTimeout(async () => {
      // Cloud Sync
      if (session?.user?.id) {
        setSyncStatus('syncing');
        const payload = {
          user_id: session.user.id,
          problems,
          challenges,
          weeklyHabits,
          dailyHabits,
          updated_at: new Date().toISOString()
        };

        const { error } = await supabase
          .from('user_sync')
          .upsert(payload, { onConflict: 'user_id' });

        if (error) {
          console.error("Cloud Sync Error:", error);
          setSyncStatus('error');
        } else {
          setSyncStatus('saved');
          setTimeout(() => setSyncStatus('idle'), 3000);
        }
      }
    }, 2000); // 2 second debounce

    return () => clearTimeout(syncTimeout);
  }, [problems, challenges, weeklyHabits, dailyHabits, session, isCloudLoaded]);

  // Check for 100% daily completion to fire confetti
  useEffect(() => {
    if (dailyHabits.length > 0) {
      const todayStr = formatDate(new Date());
      const allDone = dailyHabits.every(h => h.completedDates && h.completedDates.includes(todayStr));
      if (allDone && globalProgress === 100) {
        confetti({
          particleCount: 150,
          spread: 70,
          origin: { y: 0.6 },
          colors: ['#6b8268', '#7a9476', '#b69e90']
        });
      }
    }
  }, [dailyHabits, globalProgress]);

  const addHabit = (name, icon = 'sparkles') => addDailyHabit(name, icon);
  const deleteHabit = (id) => deleteDailyHabit(id);
  const updateHabit = (id, newName) => updateDailyHabit(id, newName);

  if (isInitializing) {
    return (
      <ErrorBoundary>
        <div style={{ height: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'var(--bg-primary)' }}>
          <motion.div animate={{ rotate: 360 }} transition={{ duration: 1, repeat: Infinity, ease: "linear" }}>
            <Sparkles size={40} color="var(--accent-sage-dark)" />
          </motion.div>
        </div>
      </ErrorBoundary>
    );
  }

  if (!session) {
    return (
      <ErrorBoundary>
        <BackgroundDecoration />
        {recoveryMode ? (
          <UpdatePassword onComplete={() => setRecoveryMode(false)} />
        ) : (
          <Auth />
        )}
      </ErrorBoundary>
    );
  }

  return (
    <ErrorBoundary>
      <BackgroundDecoration />
      <AnimatePresence mode="wait">
        <Routes location={location} key={location.pathname}>
          <Route path="/" element={
            <Dashboard
              globalProgress={globalProgress} setGlobalProgress={setGlobalProgress}
              problems={problems} setProblems={setProblems}
              challenges={challenges} setChallenges={setChallenges}
              weeklyHabits={weeklyHabits} setWeeklyHabits={setWeeklyHabits}
              dailyHabits={dailyHabits} setDailyHabits={setDailyHabits}
              onAddHabit={addHabit} onDeleteHabit={deleteHabit} onUpdateHabit={updateHabit}
              syncStatus={syncStatus} onOpenTimer={() => setIsTimerOpen(true)}
              isTimerOpen={isTimerOpen}
            />
          } />
          <Route path="/profile" element={
            <PageTransition>
              <UserProfile
                problems={problems} challenges={challenges}
                weeklyHabits={weeklyHabits} dailyHabits={dailyHabits}
              />
            </PageTransition>
          } />
          <Route path="/dsa" element={<DSADetailPage problems={problems} setProblems={setProblems} onHaptic={triggerHaptic} />} />
          <Route path="/weekly" element={<WeeklyDetailPage weeklyHabits={weeklyHabits} setWeeklyHabits={setWeeklyHabits} onHaptic={triggerHaptic} />} />
          <Route path="/challenges" element={<ChallengeDetailPage challenges={challenges} setChallenges={setChallenges} onHaptic={triggerHaptic} />} />
        </Routes>
      </AnimatePresence>
      <BottomNav />
      <AnimatePresence>
        {isTimerOpen && <ZenTimer onClose={() => setIsTimerOpen(false)} />}
      </AnimatePresence>
    </ErrorBoundary>
  );
}

const BottomNav = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const navItems = [
    { label: 'Home', icon: <Sparkles size={20} />, path: '/' },
    { label: 'Weekly', icon: <Activity size={20} />, path: '/weekly' },
    { label: 'DSA', icon: <BookOpen size={20} />, path: '/dsa' },
    { label: 'Arena', icon: <Trophy size={20} />, path: '/challenges' },
    { label: 'Profile', icon: <User size={20} />, path: '/profile' }
  ];

  return (
    <div className="bottom-nav">
      {navItems.map((item) => {
        const isActive = location.pathname === item.path;
        return (
          <div
            key={item.label}
            className={`nav-item ${isActive ? 'active' : ''}`}
            onClick={() => navigate(item.path)}
          >
            <div className="nav-icon">{item.icon}</div>
            <span className="nav-label">{item.label}</span>
          </div>
        );
      })}
    </div>
  );
};


function UpdatePassword({ onComplete }) {
  const [newPassword, setNewPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleUpdate = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    try {
      const { error } = await supabase.auth.updateUser({ password: newPassword });
      if (error) throw error;
      alert('Password updated successfully!');
      onComplete();
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-container" style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '2rem' }}>
      <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} className="card auth-card" style={{ maxWidth: '400px', width: '100%', padding: '3rem', textAlign: 'center' }}>
        <h2 className="text-gradient" style={{ marginBottom: '1rem' }}>Secure Your Ritual</h2>
        <p style={{ color: 'var(--text-secondary)', marginBottom: '2rem' }}>Enter your new password below.</p>
        <form onSubmit={handleUpdate} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          <input
            type="password"
            placeholder="New Password"
            value={newPassword}
            onChange={(e) => setNewPassword(e.target.value)}
            required
            style={{ width: '100%', padding: '1rem', borderRadius: '12px', border: '1px solid var(--border-color)', background: 'var(--bg-secondary)' }}
          />
          {error && <p style={{ color: 'var(--tag-red-text)', fontSize: '0.8rem' }}>{error}</p>}
          <button
            disabled={loading}
            style={{ background: 'var(--accent-sage-dark)', color: 'white', border: 'none', padding: '1rem', borderRadius: '12px', fontWeight: 800, cursor: 'pointer' }}
          >
            {loading ? 'Updating...' : 'Set New Password'}
          </button>
        </form>
      </motion.div>
    </div>
  );
}

function Dashboard({
  globalProgress, setGlobalProgress,
  problems, setProblems,
  challenges, setChallenges,
  weeklyHabits, setWeeklyHabits,
  dailyHabits, setDailyHabits,
  onAddHabit, onDeleteHabit, onUpdateHabit,
  syncStatus, onOpenTimer, isTimerOpen
}) {
  const navigate = useNavigate();

  return (
    <PageTransition>
      <div className="app-container">
        <header className="dashboard-header">
          <div className="title-row">
            <h1 className="text-gradient dashboard-title">Ritual Flow</h1>
            <SyncIndicator status={syncStatus} />
          </div>
          <div className="header-controls">
            <motion.div
              whileTap={{ scale: 0.95 }}
              onClick={onOpenTimer}
              className={`user-profile-btn ${isTimerOpen ? 'pulse' : ''}`}
            >
              <Zap size={16} />
              Focus
            </motion.div>
            <motion.div
              whileTap={{ scale: 0.95 }}
              onClick={() => navigate('/profile')}
              className="user-profile-btn"
            >
              <User size={16} />
              Profile
            </motion.div>
          </div>
        </header>

        <PriorityDashboard globalProgress={globalProgress} />

        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}>
          <DailyGrid
            habits={dailyHabits}
            setHabits={setDailyHabits}
            updateGlobalProgress={setGlobalProgress}
            onAddHabit={onAddHabit}
            onDeleteHabit={onDeleteHabit}
            onUpdateHabit={onUpdateHabit}
            onHaptic={triggerHaptic}
          />
        </motion.div>

        <div className="grid-container layout-2">
          <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.3 }}>
            <WeeklyTracker
              weeklyHabits={weeklyHabits}
              setWeeklyHabits={setWeeklyHabits}
              previewOnly={true}
              onHaptic={triggerHaptic}
            />
            <motion.div
              whileTap={{ scale: 0.98 }}
              onClick={() => navigate('/weekly')}
              className="manage-btn-mobile"
            >
              Manage Weekly Goals <Activity size={16} />
            </motion.div>
          </motion.div>
          <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.3 }}>
            <DSATracker
              problems={problems}
              setProblems={setProblems}
              previewOnly={true}
              onHaptic={triggerHaptic}
            />
            <motion.div
              whileTap={{ scale: 0.98 }}
              onClick={() => navigate('/dsa')}
              className="manage-btn-mobile"
            >
              View Problem Log <BookOpen size={16} />
            </motion.div>
          </motion.div>
        </div>

        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4 }}>
          <ChallengeGallery
            challenges={challenges}
            setChallenges={setChallenges}
            previewOnly={true}
            onHaptic={triggerHaptic}
          />
          <div onClick={() => navigate('/challenges')} className="manage-link" style={{ marginTop: '0.5rem', display: 'flex', justifyContent: 'flex-end' }}>
            Enter Challenge Arena →
          </div>
        </motion.div>
      </div>
    </PageTransition>
  );
}
