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
import { Zap, Activity, BookOpen, User, Sparkles, Trophy, Plus, CheckCircle, RefreshCw, Cloud, CloudOff, Moon, Sun } from 'lucide-react';
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
  } catch (e) { }
};

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
        <div style={{ padding: '2rem', background: '#0a0a0f', color: '#ff7043', minHeight: '100vh', fontFamily: 'monospace', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', textAlign: 'center' }}>
          <h2 style={{ fontFamily: "'Playfair Display', serif", fontSize: '2rem', marginBottom: '1rem' }}>A Glitch in the Ritual.</h2>
          <pre style={{ background: 'rgba(255,112,67,0.1)', padding: '1rem', borderRadius: '12px', marginBottom: '2rem', maxWidth: '80%' }}>{this.state.error?.toString()}</pre>
          <button onClick={() => {
            const msg = `Would you like to clear your local storage to fix this? Your cloud data is safe.`;
            if (confirm(msg)) {
              localStorage.removeItem('habit-storage');
              window.location.reload();
            }
          }} style={{ padding: '1rem 2rem', background: '#ff7043', color: 'white', border: 'none', borderRadius: '12px', fontWeight: 800, cursor: 'pointer' }}>
            Repair Ritual (Clear Cache)
          </button>
        </div>
      );
    }
    return this.props.children;
  }
}

const SyncIndicator = ({ status }) => {
  const meta = {
    syncing: { icon: <RefreshCw size={12} className="animate-spin" />, text: 'Syncing', color: '#c8f566' },
    saved: { icon: <CheckCircle size={12} />, text: 'Synced', color: '#c8f566' },
    error: { icon: <CloudOff size={12} />, text: 'Offline', color: '#ff7043' },
    idle: { icon: <Cloud size={12} />, text: 'Ready', color: 'rgba(255,255,255,0.3)' }
  };
  const current = meta[status] || meta.idle;
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: 6, padding: '6px 14px', borderRadius: 100, background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)', fontSize: 10, fontWeight: 800, color: current.color, textTransform: 'uppercase', letterSpacing: '0.06em' }}>
      <div style={{ width: 6, height: 6, borderRadius: '50%', background: current.color, animation: status === 'syncing' ? 'pulseDot 1s infinite' : 'none' }} />
      {current.text}
    </div>
  );
};

const AmbientBlobs = ({ theme }) => (
  <div style={{ position: "fixed", inset: 0, pointerEvents: "none", zIndex: 0, overflow: "hidden" }}>
    {[
      { top: "-10%", left: "-15%", size: "50vw", color: theme === 'dark' ? "rgba(200,245,102,.06)" : "rgba(200,245,102,.02)", dur: "20s" },
      { bottom: "10%", right: "-10%", size: "40vw", color: theme === 'dark' ? "rgba(139,100,220,.08)" : "rgba(139,100,220,.03)", dur: "25s", rev: true },
      { top: "40%", left: "30%", size: "30vw", color: theme === 'dark' ? "rgba(100,180,255,.04)" : "rgba(100,180,255,.01)", dur: "18s", delay: "5s" },
    ].map((b, i) => (
      <div key={i} style={{
        position: "absolute", width: b.size, height: b.size, borderRadius: "50%",
        background: `radial-gradient(circle, ${b.color} 0%, transparent 70%)`,
        animation: `drift ${b.dur} ease-in-out infinite ${b.rev ? "reverse" : ""} ${b.delay || ""}`,
        top: b.top, left: b.left, bottom: b.bottom, right: b.right,
      }} />
    ))}
  </div>
);

export default function App() {
  const navigate = useNavigate();
  const location = useLocation();
  const [session, setSession] = useState(null);
  const [isInitializing, setIsInitializing] = useState(true);
  const [isTimerOpen, setIsTimerOpen] = useState(false);
  const [recoveryMode, setRecoveryMode] = useState(false);
  const [globalProgress, setGlobalProgress] = useState(0);
  const [syncStatus, setSyncStatus] = useState('idle');
  const [isCloudLoaded, setIsCloudLoaded] = useState(false);

  const {
    dailyHabits, setDailyHabits,
    weeklyHabits, setWeeklyHabits,
    challenges, setChallenges,
    problems, setProblems,
    theme, toggleTheme,
    addDailyHabit, deleteDailyHabit, updateDailyHabit
  } = useHabitStore();

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
    if (theme === 'light') {
      StatusBar.setStyle({ style: Style.Light });
    } else {
      StatusBar.setStyle({ style: Style.Dark });
    }
  }, [theme]);

  useEffect(() => {
    const checkWeeklyReset = () => {
      const now = new Date();
      // Monday is 1 in getDay()
      const isMonday = now.getDay() === 1;
      const lastReset = localStorage.getItem('last-weekly-reset');
      const todayStr = formatDate(now);

      if (isMonday && lastReset !== todayStr) {
        useHabitStore.getState().resetWeeklyHabits();
        localStorage.setItem('last-weekly-reset', todayStr);
        console.log("Weekly goals have been reset for the new week.");
      }
    };

    if (isCloudLoaded) {
      checkWeeklyReset();
    }
  }, [isCloudLoaded]);

  useEffect(() => {
    const checkSession = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      setSession(session);
      setIsInitializing(false);
    };
    checkSession();
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_, session) => {
      setSession(session);
      setIsInitializing(false);
    });
    return () => subscription.unsubscribe();
  }, []);

  useEffect(() => {
    if (session?.user?.id && !isCloudLoaded) {
      const loadFromCloud = async () => {
        const { data } = await supabase.from('user_sync').select('*').eq('user_id', session.user.id).single();
        if (data) {
          if (data.problems) setProblems(data.problems);
          if (data.challenges) setChallenges(data.challenges);
          if (data.weeklyHabits) setWeeklyHabits(data.weeklyHabits);
          if (data.dailyHabits) setDailyHabits(data.dailyHabits);
        }
        setIsCloudLoaded(true);
      };
      loadFromCloud();
    }
  }, [session, isCloudLoaded]);

  useEffect(() => {
    if (!isCloudLoaded || !session) return;
    const syncTimeout = setTimeout(async () => {
      setSyncStatus('syncing');
      const { error } = await supabase.from('user_sync').upsert({
        user_id: session.user.id, problems, challenges, weeklyHabits, dailyHabits, updated_at: new Date().toISOString()
      });
      setSyncStatus(error ? 'error' : 'saved');
      setTimeout(() => setSyncStatus('idle'), 3000);
    }, 2000);
    return () => clearTimeout(syncTimeout);
  }, [problems, challenges, weeklyHabits, dailyHabits, session, isCloudLoaded]);

  if (isInitializing) return (
    <div style={{ height: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: '#0a0a0f' }}>
      <motion.div animate={{ rotate: 360 }} transition={{ duration: 1, repeat: Infinity, ease: "linear" }}>
        <Sparkles size={40} color="#c8f566" />
      </motion.div>
    </div>
  );

  if (!session) return (
    <ErrorBoundary>
      <AmbientBlobs />
      <Auth />
    </ErrorBoundary>
  );

  return (
    <div style={{ minHeight: "100vh", background: "var(--bg-primary)", fontFamily: "'DM Sans', sans-serif", color: "var(--text-primary)", overflowX: "hidden" }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=DM+Sans:opsz,wght@9..40,300;9..40,400;9..40,500;9..40,700&family=Playfair+Display:ital,wght@0,700;1,400&display=swap');
        @keyframes drift{0%,100%{transform:translate(0,0) rotate(0deg)}33%{transform:translate(30px,-20px) rotate(120deg)}66%{transform:translate(-20px,10px) rotate(240deg)}}
        @keyframes sweepIn{from{opacity:0;transform:translateY(10px)}to{opacity:1;transform:translateY(0)}}
        @keyframes pulseDot{0%,100%{opacity:1;transform:scale(1)}50%{opacity:.5;transform:scale(.8)}}
        .glass{background:var(--bg-glass);border:1px solid var(--border-soft);backdrop-filter:blur(20px);border-radius:20px;transition:all .3s}
        .nav-item-v3{display:flex;flex-direction:column;align-items:center;gap:4px;padding:8px 12px;border-radius:14px;cursor:pointer;transition:all .2s;color:var(--text-muted);font-size:10px;font-weight:700;letter-spacing:.08em;text-transform:uppercase}
        .nav-item-v3.active{color:var(--bg-primary);background:var(--accent-sage);opacity:1;font-weight:900}
      `}</style>
      <AmbientBlobs />
      <ErrorBoundary>
        <AnimatePresence mode="wait">
          <Routes location={location} key={location.pathname}>
            <Route path="/" element={
              <Dashboard
                globalProgress={globalProgress} setGlobalProgress={setGlobalProgress}
                problems={problems} setProblems={setProblems}
                challenges={challenges} setChallenges={setChallenges}
                weeklyHabits={weeklyHabits} setWeeklyHabits={setWeeklyHabits}
                dailyHabits={dailyHabits} setDailyHabits={setDailyHabits}
                onAddHabit={addDailyHabit} onDeleteHabit={deleteDailyHabit} onUpdateHabit={updateDailyHabit}
                syncStatus={syncStatus} onOpenTimer={() => setIsTimerOpen(true)}
                theme={theme} toggleTheme={toggleTheme}
              />
            } />
            <Route path="/profile" element={<PageTransition><UserProfile problems={problems} challenges={challenges} weeklyHabits={weeklyHabits} dailyHabits={dailyHabits} /></PageTransition>} />
            <Route path="/dsa" element={<DSADetailPage problems={problems} setProblems={setProblems} onHaptic={triggerHaptic} />} />
            <Route path="/weekly" element={<WeeklyDetailPage weeklyHabits={weeklyHabits} setWeeklyHabits={setWeeklyHabits} onHaptic={triggerHaptic} />} />
            <Route path="/challenges" element={<ChallengeDetailPage challenges={challenges} setChallenges={setChallenges} onHaptic={triggerHaptic} />} />
          </Routes>
        </AnimatePresence>
        <BottomNav activePath={location.pathname} navigate={navigate} />
        {isTimerOpen && <ZenTimer onClose={() => setIsTimerOpen(false)} />}
      </ErrorBoundary>
    </div>
  );
}

const BottomNav = ({ activePath, navigate }) => {
  const items = [
    { id: "/", icon: "✦", label: "Home" },
    { id: "/weekly", icon: "◎", label: "Weekly" },
    { id: "/dsa", icon: "⌨", label: "DSA" },
    { id: "/challenges", icon: "⚔", label: "Arena" },
    { id: "/profile", icon: "◐", label: "Profile" }
  ];
  return (
    <div style={{ position: "fixed", bottom: 0, left: "50%", transform: "translateX(-50%)", width: "100%", maxWidth: 430, background: "var(--bg-glass)", backdropFilter: "blur(30px)", borderTop: "1px solid var(--border-soft)", padding: "10px 20px 28px", display: "flex", justifyContent: "space-around", zIndex: 100 }}>
      {items.map(item => (
        <div key={item.id} className={`nav-item-v3 ${activePath === item.id ? 'active' : ''}`} onClick={() => navigate(item.id)}>
          <span style={{ fontSize: 18, lineHeight: 1 }}>{item.icon}</span>
          {item.label}
        </div>
      ))}
    </div>
  );
};

function Dashboard({
  globalProgress, setGlobalProgress,
  problems, setProblems,
  challenges, setChallenges,
  weeklyHabits, setWeeklyHabits,
  dailyHabits, setDailyHabits,
  onAddHabit, onDeleteHabit, onUpdateHabit,
  syncStatus, onOpenTimer,
  theme, toggleTheme
}) {
  const navigate = useNavigate();
  const today = new Date();
  const circumference = 2 * Math.PI * 42;

  return (
    <PageTransition>
      <div style={{ maxWidth: 430, margin: "0 auto", padding: "0 0 100px" }}>
        {/* HEADER */}
        <div style={{ padding: "52px 20px 24px", display: "flex", flexDirection: "column", gap: 16, animation: "sweepIn .6s ease both" }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
            <div style={{ display: "flex", flexDirection: "column" }}>
              <div style={{ fontSize: 11, fontWeight: 700, letterSpacing: ".14em", color: "var(--text-muted)", textTransform: "uppercase", marginBottom: 4 }}>
                {today.toLocaleDateString("en-US", { weekday: "long", month: "long", day: "numeric" })}
              </div>
              <h1 style={{
                fontFamily: "'Playfair Display',serif",
                fontSize: 32,
                fontWeight: 700,
                letterSpacing: "-.02em",
                color: "var(--text-primary)"
              }}>
                Ritual Flow
              </h1>
            </div>

            <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
              <motion.div
                whileTap={{ scale: 0.9 }}
                onClick={toggleTheme}
                style={{
                  width: 36, height: 36, borderRadius: 10, background: "var(--bg-card)",
                  display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer",
                  border: "1px solid var(--border-soft)", color: "var(--text-muted)"
                }}
              >
                {theme === 'dark' ? <Sun size={18} /> : <Moon size={18} />}
              </motion.div>
              <SyncIndicator status={syncStatus} />
            </div>
          </div>
          <div style={{ display: "flex", gap: 8 }}>
            <button onClick={onOpenTimer} style={{ display: "flex", alignItems: "center", gap: 6, padding: "8px 16px", borderRadius: 12, background: "var(--bg-card)", border: "1px solid var(--border-soft)", fontSize: 12, fontWeight: 700, color: "var(--text-secondary)", cursor: "pointer" }}>⚡ Focus</button>
            <button onClick={() => navigate('/profile')} style={{ display: "flex", alignItems: "center", gap: 6, padding: "8px 16px", borderRadius: 12, background: "var(--bg-card)", border: "1px solid var(--border-soft)", fontSize: 12, fontWeight: 700, color: "var(--text-secondary)", cursor: "pointer" }}>👤 Profile</button>
          </div>
        </div>

        {/* PERFORMANCE */}
        <div style={{ margin: "0 20px 16px", animation: "sweepIn .6s .15s ease both", opacity: 0, animationFillMode: "forwards" }}>
          <div className="glass" style={{ padding: "28px 24px", display: "flex", alignItems: "center", gap: 24 }}>
            <div style={{ position: "relative", width: 100, height: 100, flexShrink: 0 }}>
              <svg width="100" height="100" viewBox="0 0 100 100">
                <circle cx="50" cy="50" r="42" fill="none" stroke="var(--border-soft)" strokeWidth="8" />
                <circle cx="50" cy="50" r="42" fill="none" stroke="url(#g1)" strokeWidth="8" strokeLinecap="round" strokeDasharray={circumference} strokeDashoffset={circumference * (1 - globalProgress / 100)} transform="rotate(-90 50 50)" style={{ transition: 'stroke-dashoffset 1.5s ease' }} />
                <defs><linearGradient id="g1" x1="0%" y1="0%" x2="100%" y2="100%"><stop offset="0%" stopColor="#c8f566" /><stop offset="100%" stopColor="#8bdb4a" /></linearGradient></defs>
              </svg>
              <div style={{ position: "absolute", inset: 0, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center" }}>
                <div style={{ fontFamily: "'Playfair Display',serif", fontSize: 22, fontWeight: 700, color: "#c8f566" }}>{globalProgress}%</div>
                <div style={{ fontSize: 9, fontWeight: 700, color: "var(--text-muted)", textTransform: "uppercase" }}>today</div>
              </div>
            </div>
            <div style={{ flex: 1 }}>
              <div style={{ fontSize: 10, fontWeight: 700, color: "var(--text-muted)", textTransform: "uppercase", marginBottom: 4 }}>Performance</div>
              <div style={{ fontFamily: "'Playfair Display',serif", fontSize: 20, color: "var(--text-primary)" }}>{globalProgress > 70 ? "Excellent!" : "Steady Progress"}</div>
              <div style={{ fontSize: 12, color: "var(--text-muted)", marginTop: 4 }}>You're on track to hit your targets.</div>
            </div>
          </div>
        </div>

        <PriorityDashboard globalProgress={globalProgress} />

        {/* DAILY RITUALS (Styled V3 but keeping DailyGrid functionality) */}
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

        {/* FOOTER QUOTE */}
        <div style={{ margin: "24px 20px", padding: "20px 24px", borderRadius: 20, background: "linear-gradient(135deg,rgba(200,245,102,.08),rgba(139,100,220,.08))", border: "1px solid rgba(200,245,102,.12)" }}>
          <div style={{ fontFamily: "'Playfair Display',serif", fontSize: 15, fontStyle: "italic", color: "var(--text-muted)", lineHeight: 1.7, marginBottom: 12 }}>
            "Success is the sum of small efforts, repeated day in and day out."
          </div>
          <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
            <div style={{ flex: 1, height: 1, background: "rgba(200,245,102,.2)" }} />
            <span style={{ fontSize: 11, fontWeight: 700, color: "rgba(200,245,102,.6)", letterSpacing: ".06em" }}>ROBERT COLLIER</span>
            <div style={{ flex: 1, height: 1, background: "rgba(200,245,102,.2)" }} />
          </div>
        </div>
      </div>
    </PageTransition >
  );
}
