import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Target, PlusCircle } from 'lucide-react';
import WeeklyTracker from './WeeklyTracker';

export default function WeeklyDetailPage({ weeklyHabits, setWeeklyHabits, onHaptic }) {
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
            <header className="dashboard-header" style={{ marginBottom: '0.5rem' }}>
                <div className="title-area">
                    <h1 style={{ display: 'flex', alignItems: 'center', cursor: 'pointer', transition: 'opacity 0.2s', color: 'var(--text-primary)' }}
                        onClick={() => navigate('/')}
                        onMouseOver={e => e.currentTarget.style.opacity = 0.7}
                        onMouseOut={e => e.currentTarget.style.opacity = 1}>
                        <ArrowLeft size={24} style={{ marginRight: '0.5rem', color: 'var(--text-muted)' }} />
                        Weekly Focus Creator
                    </h1>
                    <p>Design habit metrics aimed for weekly frequencies (e.g. 3x per week).</p>
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
