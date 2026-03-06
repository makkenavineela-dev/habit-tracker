import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowLeft, User, Activity, CheckCircle, Target, BookOpen, Layers, Sparkles, Trophy, Flame, Zap, Award, Star, LogOut } from 'lucide-react';
import { supabase } from '../lib/supabase';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar, Cell } from 'recharts';
import { getPastNDays, getShortDayName, formatDate, calculateStreak } from '../utils/dateUtils';

export default function UserProfile({ problems = [], challenges = [], weeklyHabits = [], dailyHabits = [] }) {
    const navigate = useNavigate();
    const [activeTab, setActiveTab] = useState('daily');

    const last7Days = getPastNDays(7);

    // Calculate Stats
    const totalDailyChecks = dailyHabits.reduce((acc, h) => acc + (h.completedDates ? h.completedDates.length : 0), 0);
    const totalDSADone = problems.filter(p => p.status === 'Done').length;
    const totalChallengesPoints = challenges.reduce((acc, c) => acc + (c.checks ? c.checks.filter(ch => ch).length : 0), 0);
    const totalActivityScore = totalDailyChecks + (totalDSADone * 5) + (totalChallengesPoints * 2);

    const level = Math.floor(Math.sqrt(totalActivityScore / 10)) + 1;
    const nextLevelScore = Math.pow(level, 2) * 10;
    const levelProgress = Math.min(100, Math.round((totalActivityScore / nextLevelScore) * 100));

    const maxStreak = dailyHabits.length > 0
        ? Math.max(...dailyHabits.map(h => calculateStreak(h.completedDates || [])), 0)
        : 0;

    // Data for Charts
    const dailyDataRaw = last7Days.map(date => {
        const dStr = formatDate(date);
        let completed = 0;
        dailyHabits.forEach(h => { if (h.completedDates && h.completedDates.includes(dStr)) completed++; });
        return { name: getShortDayName(date.getDay() === 0 ? 6 : date.getDay() - 1), completed, fullDate: dStr };
    });

    const tabs = [
        {
            id: 'daily',
            label: 'Daily Habits',
            icon: <CheckCircle size={16} />,
            data: dailyDataRaw,
            color: 'var(--accent-sage-dark)'
        },
        {
            id: 'challenges',
            label: 'Challenges',
            icon: <Target size={16} />,
            data: challenges.map(c => ({
                name: c.title.substring(0, 10),
                completed: c.checks ? c.checks.filter(ch => ch).length : 0,
                target: c.checks ? c.checks.length : 1
            })),
            color: '#f59e0b'
        },
        {
            id: 'dsa',
            label: 'DSA Progress',
            icon: <BookOpen size={16} />,
            data: last7Days.map(date => {
                const dStr = formatDate(date);
                const count = problems.filter(p => p.status === 'Done' && p.dateAdded === dStr).length;
                return { name: getShortDayName(date.getDay() === 0 ? 6 : date.getDay() - 1), completed: count };
            }),
            color: '#3b82f6'
        },
        {
            id: 'weekly',
            label: 'Weekly Goals',
            icon: <Layers size={16} />,
            data: weeklyHabits.map(h => ({ name: h.name, completed: h.checks || 0, target: h.target || 1 })),
            color: '#8b5cf6'
        },
    ];

    const currentTab = tabs.find(t => t.id === activeTab);

    // Actual Heatmap Data (last 90 days)
    const heatmapDays = Array.from({ length: 91 }).map((_, i) => {
        const d = new Date();
        d.setDate(d.getDate() - (90 - i));
        const dStr = formatDate(d);

        // Intensity based on how many habits completed that day
        let completedCount = 0;
        dailyHabits.forEach(h => {
            if (h.completedDates && h.completedDates.includes(dStr)) completedCount++;
        });

        // Map count to 0-4 intensity scale
        const intensity = dailyHabits.length > 0
            ? Math.min(4, Math.ceil((completedCount / dailyHabits.length) * 4))
            : 0;

        return { date: dStr, intensity };
    });

    const achievements = [
        { id: 1, name: 'First Ritual', desc: 'Complete your first habit', icon: <Zap size={20} />, unlocked: totalDailyChecks > 0 },
        { id: 2, name: 'Streak Master', desc: `Reach a 3-day streak (Best: ${maxStreak})`, icon: <Flame size={20} />, unlocked: maxStreak >= 3 },
        { id: 3, name: 'Problem Solver', desc: 'Solve 1+ DSA problems', icon: <Layers size={20} />, unlocked: totalDSADone >= 1 },
        { id: 4, name: 'Consistency King', desc: 'Complete 10+ rituals', icon: <Trophy size={20} />, unlocked: totalDailyChecks >= 10 },
        { id: 5, name: 'Elite Striker', desc: 'Reach a 7-day streak', icon: <Star size={20} />, unlocked: maxStreak >= 7 },
        { id: 6, name: 'Scribe', desc: 'Write 5+ journal entries', icon: <Award size={20} />, unlocked: dailyHabits.reduce((acc, h) => acc + (h.notes ? Object.keys(h.notes).length : 0), 0) >= 5 },
        { id: 7, name: 'Scholar', desc: 'Solve 10+ DSA problems', icon: <BookOpen size={20} />, unlocked: totalDSADone >= 10 },
        { id: 8, name: 'Marathoner', desc: 'Complete 30+ rituals', icon: <Activity size={20} />, unlocked: totalDailyChecks >= 30 }
    ];

    return (
        <div className="app-container" style={{ paddingBottom: '5rem' }}>
            <header className="dashboard-header" style={{ marginBottom: '2rem', display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                <div className="title-area">
                    <motion.h1
                        whileHover={{ x: 5 }}
                        style={{ display: 'flex', alignItems: 'center', cursor: 'pointer', color: 'var(--text-primary)' }}
                        onClick={() => navigate('/')}
                    >
                        <ArrowLeft size={32} style={{ marginRight: '1rem', color: 'var(--accent-sage-dark)' }} />
                        Performance Lab
                    </motion.h1>
                    <p>Quantifying your path to excellence.</p>
                </div>

                <motion.button
                    whileHover={{ scale: 1.1, background: 'var(--tag-red-bg)', color: 'var(--tag-red-text)' }}
                    whileTap={{ scale: 0.9 }}
                    onClick={() => supabase.auth.signOut()}
                    style={{
                        padding: '0.75rem', borderRadius: '14px', background: 'var(--bg-tertiary)',
                        border: 'none', cursor: 'pointer', color: 'var(--text-secondary)',
                        display: 'flex', alignItems: 'center', gap: '0.5rem', fontWeight: 700, fontSize: '0.85rem'
                    }}
                >
                    <LogOut size={18} />
                    Logout
                </motion.button>
            </header>

            <div className="grid-container layout-2">
                {/* Profile Card */}
                <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} className="card" style={{
                    background: 'linear-gradient(135deg, var(--bg-card) 0%, var(--accent-sage-light) 100%)',
                    padding: '3rem',
                    border: '1px solid var(--border-glass)'
                }}>
                    <div style={{ display: 'flex', gap: '2.5rem', alignItems: 'center', flexWrap: 'wrap' }}>
                        <div style={{ position: 'relative' }}>
                            <div style={{
                                width: '120px', height: '120px', background: 'var(--bg-primary)',
                                borderRadius: '35px', display: 'flex', alignItems: 'center',
                                justifyContent: 'center', boxShadow: '0 20px 40px rgba(91, 115, 88, 0.15)',
                                border: '2px solid white'
                            }}>
                                <User size={56} color="var(--accent-sage-dark)" />
                            </div>
                            <motion.div
                                whileHover={{ scale: 1.2, rotate: 10 }}
                                style={{
                                    position: 'absolute', bottom: '-5px', right: '-5px',
                                    background: 'var(--accent-sage-dark)', color: 'white',
                                    width: '44px', height: '44px', borderRadius: '14px',
                                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                                    fontWeight: 900, border: '4px solid var(--bg-primary)',
                                    fontSize: '1.2rem', boxShadow: '0 4px 12px rgba(0,0,0,0.1)'
                                }}>
                                {level}
                            </motion.div>
                        </div>
                        <div style={{ flex: 1, minWidth: '200px' }}>
                            <h2 style={{ fontSize: '2.5rem', margin: 0, fontFamily: 'Outfit, sans-serif', letterSpacing: '-0.03em' }}>Pioneer User</h2>
                            <div style={{ marginTop: '1rem' }}>
                                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.75rem', fontSize: '0.85rem', fontWeight: 800, color: 'var(--accent-sage-dark)' }}>
                                    <span>ZEN ASCENSION: LVL {level}</span>
                                    <span>{totalActivityScore} / {nextLevelScore} XP</span>
                                </div>
                                <div className="progress-track">
                                    <motion.div initial={{ width: 0 }} animate={{ width: `${levelProgress}%` }} className="progress-fill" />
                                </div>
                            </div>
                        </div>
                    </div>
                </motion.div>

                {/* Achievement Cabinet */}
                <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: 0.1 }} className="card" style={{ padding: '3rem' }}>
                    <h2 className="section-title"><Award size={24} /> Awards Cabinet</h2>
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(130px, 1fr))', gap: '1.25rem', marginTop: '1rem' }}>
                        {achievements.map(award => (
                            <motion.div
                                key={award.id}
                                whileHover={award.unlocked ? { y: -5, background: 'white', boxShadow: 'var(--shadow-premium)' } : {}}
                                style={{
                                    padding: '1.25rem', background: award.unlocked ? 'var(--bg-primary)' : 'var(--bg-secondary)',
                                    borderRadius: '20px', textAlign: 'center', border: award.unlocked ? '1px solid var(--accent-sage-light)' : '1px dashed var(--border-color)',
                                    opacity: award.unlocked ? 1 : 0.6, transition: 'all 0.4s ease'
                                }}>
                                <div style={{
                                    width: '44px', height: '44px', margin: '0 auto 0.75rem', borderRadius: '12px',
                                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                                    background: award.unlocked ? 'var(--accent-sage-light)' : 'transparent',
                                    color: award.unlocked ? 'var(--accent-sage-dark)' : 'var(--text-muted)'
                                }}>
                                    {award.icon}
                                </div>
                                <div style={{ fontSize: '0.85rem', fontWeight: 800, color: 'var(--text-primary)' }}>{award.name}</div>
                                <div style={{ fontSize: '0.7rem', color: 'var(--text-muted)', marginTop: '0.25rem', fontWeight: 500 }}>{award.desc}</div>
                            </motion.div>
                        ))}
                    </div>
                </motion.div>
            </div>

            {/* Heatmap Section */}
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }} className="card" style={{ marginTop: '2.5rem', padding: '2.5rem' }}>
                <h2 className="section-title"><Activity size={20} color="var(--accent-sage-dark)" /> Yearly Ritual Vibe</h2>
                <div style={{ marginTop: '2rem', display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(13, 1fr)', gap: '6px' }}>
                        {heatmapDays.map((d, i) => (
                            <motion.div
                                key={i}
                                whileHover={{ scale: 1.2, zIndex: 1 }}
                                title={`${d.date}: Level ${d.intensity}`}
                                style={{
                                    aspectRatio: '1 / 1', borderRadius: '4px',
                                    background: d.intensity === 0 ? 'var(--bg-tertiary)' :
                                        d.intensity === 1 ? '#d1d9cf' :
                                            d.intensity === 2 ? '#9db099' :
                                                d.intensity === 3 ? '#6b8268' : '#2d3b2a'
                                }}
                            />
                        ))}
                    </div>
                    <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.75rem', color: 'var(--text-muted)', marginTop: '0.5rem', fontWeight: 600 }}>
                        <span>Last 3 Months</span>
                        <div style={{ display: 'flex', gap: '4px', alignItems: 'center' }}>
                            <span>Less</span>
                            <div style={{ width: '10px', height: '10px', background: 'var(--bg-tertiary)', borderRadius: '2px' }} />
                            <div style={{ width: '10px', height: '10px', background: '#6b8268', borderRadius: '2px' }} />
                            <span>More</span>
                        </div>
                    </div>
                </div>
            </motion.div>

            {/* Chart Section */}
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }} className="card" style={{ marginTop: '2.5rem', padding: '2.5rem' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
                    <h2 className="section-title" style={{ margin: 0 }}><Trophy size={20} /> Deep Analytics</h2>
                    <div className="tabs" style={{ display: 'flex', background: 'var(--bg-tertiary)', padding: '0.3rem', borderRadius: '14px', gap: '0.3rem' }}>
                        {tabs.map(tab => (
                            <button key={tab.id} onClick={() => setActiveTab(tab.id)} style={{
                                border: 'none', background: activeTab === tab.id ? 'var(--bg-card)' : 'transparent',
                                padding: '0.5rem 1rem', borderRadius: '10px', cursor: 'pointer', fontSize: '0.8rem', fontWeight: 800,
                                color: activeTab === tab.id ? 'var(--text-primary)' : 'var(--text-muted)', boxShadow: activeTab === tab.id ? 'var(--shadow-sm)' : 'none'
                            }}>
                                {tab.label}
                            </button>
                        ))}
                    </div>
                </div>
                <div style={{ height: '350px' }}>
                    <AnimatePresence mode="wait">
                        <motion.div key={activeTab} initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} style={{ width: '100%', height: '100%' }}>
                            <ResponsiveContainer>
                                {activeTab === 'weekly' ? (
                                    <BarChart data={currentTab.data}>
                                        <XAxis dataKey="name" hide />
                                        <YAxis hide />
                                        <Tooltip cursor={{ fill: 'transparent' }} contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: 'var(--shadow-lg)' }} />
                                        <Bar dataKey="completed" radius={[10, 10, 10, 10]} fill={currentTab.color} barSize={40} />
                                    </BarChart>
                                ) : (
                                    <LineChart data={currentTab.data}>
                                        <Line type="monotone" dataKey="completed" stroke={currentTab.color} strokeWidth={4} dot={{ r: 6 }} />
                                        <Tooltip contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: 'var(--shadow-lg)' }} />
                                    </LineChart>
                                )}
                            </ResponsiveContainer>
                        </motion.div>
                    </AnimatePresence>
                </div>
            </motion.div>
        </div>
    );
}

