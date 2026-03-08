import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Target, PlusCircle, Sun, Moon } from 'lucide-react';
import WeeklyTracker from './WeeklyTracker';
import useHabitStore from '../store/useHabitStore';
import { motion } from 'framer-motion';

export default function WeeklyDetailPage({ weeklyHabits, setWeeklyHabits, onHaptic }) {
    const { theme, toggleTheme } = useHabitStore();
    const navigate = useNavigate();
    const [name, setName] = useState('');
    const [target, setTarget] = useState(3);

    const handleAdd = (e) => {
        e.preventDefault();
        if (!name || target < 1) return;
        if (onHaptic) onHaptic();

        const newHabit = {
            id: Date.now(),
            name: name,
            icon: 'target',
            target: parseInt(target, 10),
            checks: 0
        };

        setWeeklyHabits([newHabit, ...weeklyHabits]);
        setName('');
        setTarget(3);
    };

    return (
        <div className="app-container">
            <header className="dashboard-header" style={{ marginBottom: '1.5rem', padding: '52px 20px 24px', margin: '0 0 1rem 0' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <div className="title-area">
                        <h1 style={{ display: 'flex', alignItems: 'center', cursor: 'pointer', transition: 'opacity 0.2s', color: 'var(--text-primary)', margin: 0 }}
                            onClick={() => navigate('/')}>
                            <ArrowLeft size={24} style={{ marginRight: '0.75rem', color: 'var(--text-muted)' }} />
                            Weekly Focus
                        </h1>
                        <p style={{ color: 'var(--text-muted)', fontSize: '0.85rem', marginTop: '4px' }}>Design habit metrics aimed for weekly frequencies.</p>
                    </div>

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
                </div>
            </header>

            <div className="card" style={{ marginBottom: '2rem' }}>
                <h2 className="section-title">
                    <PlusCircle size={20} />
                    Create New Weekly Goal
                </h2>
                <form onSubmit={handleAdd} style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap', alignItems: 'flex-end' }}>

                    <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem', flex: '2', minWidth: '200px' }}>
                        <label style={{ fontSize: '0.875rem', fontWeight: 600, color: 'var(--text-secondary)' }}>Goal Name</label>
                        <input
                            type="text"
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            placeholder="e.g. Read Non-Fiction, Gym Session"
                            required
                            style={{
                                padding: '0.75rem', border: '1px solid var(--border-color)',
                                borderRadius: 'var(--radius-sm)', outline: 'none', background: 'var(--bg-secondary)', color: 'var(--text-primary)'
                            }}
                        />
                    </div>

                    <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem', flex: '1', minWidth: '150px' }}>
                        <label style={{ fontSize: '0.875rem', fontWeight: 600, color: 'var(--text-secondary)' }}>Target Days per Week</label>
                        <input
                            type="number"
                            value={target}
                            onChange={(e) => setTarget(e.target.value)}
                            min="1"
                            max="7"
                            required
                            style={{
                                padding: '0.75rem', border: '1px solid var(--border-color)',
                                borderRadius: 'var(--radius-sm)', outline: 'none', background: 'var(--bg-secondary)', color: 'var(--text-primary)'
                            }}
                        />
                    </div>

                    <button
                        type="submit"
                        style={{
                            padding: '0.75rem 1.5rem', background: 'var(--accent-sage-dark)', color: 'var(--bg-primary)',
                            border: 'none', borderRadius: 'var(--radius-sm)', cursor: 'pointer', fontWeight: 800, height: '44px',
                            minWidth: '120px', textTransform: 'uppercase', letterSpacing: '0.05em', fontSize: '0.75rem'
                        }}
                    >
                        Create
                    </button>
                </form>
            </div>

            <WeeklyTracker weeklyHabits={weeklyHabits} setWeeklyHabits={setWeeklyHabits} previewOnly={false} onHaptic={onHaptic} />
        </div>
    );
}
