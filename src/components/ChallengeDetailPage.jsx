import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Target, Calendar, Sun, Moon } from 'lucide-react';
import { formatDate } from '../utils/dateUtils';
import useHabitStore from '../store/useHabitStore';
import { motion } from 'framer-motion';

export default function ChallengeDetailPage({ challenges, setChallenges }) {
    const { theme, toggleTheme } = useHabitStore();
    const navigate = useNavigate();
    const [title, setTitle] = useState('');
    const [startDate, setStartDate] = useState(formatDate(new Date()));
    const [endDate, setEndDate] = useState('');
    const [expandedIds, setExpandedIds] = useState(new Set());

    const handleAddChallenge = (e) => {
        e.preventDefault();
        if (!title || !startDate || !endDate) return;

        const start = new Date(startDate);
        const end = new Date(endDate);
        const diffTime = Math.abs(end - start);
        let diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24)) + 1; // inclusive of start and end

        // Prevent huge or negative numbers safely
        if (diffDays <= 0) diffDays = 1;
        if (diffDays > 365) diffDays = 365;

        const startMonthYear = start.toLocaleString('default', { month: 'long', year: 'numeric' });

        const newChallenge = {
            id: Date.now(),
            title: title,
            dates: startMonthYear,
            startDate: formatDate(start),
            days: diffDays,
            checks: Array(diffDays).fill(false)
        };

        setChallenges([newChallenge, ...challenges]);
        setTitle('');
        setEndDate('');
    };

    const toggleDay = (cIdx, dIdx) => {
        const newChallenges = [...challenges];
        newChallenges[cIdx].checks[dIdx] = !newChallenges[cIdx].checks[dIdx];
        setChallenges(newChallenges);
    };

    const deleteChallenge = (id) => {
        setChallenges(challenges.filter(c => c.id !== id));
    };

    const toggleExpand = (id) => {
        const newExpanded = new Set(expandedIds);
        if (newExpanded.has(id)) {
            newExpanded.delete(id);
        } else {
            newExpanded.add(id);
        }
        setExpandedIds(newExpanded);
    };

    return (
        <div className="app-container">
            <header className="dashboard-header" style={{ marginBottom: '1.5rem', padding: '52px 20px 24px', margin: '0 0 1rem 0' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <div className="title-area">
                        <h1 style={{ display: 'flex', alignItems: 'center', cursor: 'pointer', transition: 'opacity 0.2s', color: 'var(--text-primary)', margin: 0 }}
                            onClick={() => navigate('/')}>
                            <ArrowLeft size={24} style={{ marginRight: '0.75rem', color: 'var(--text-muted)' }} />
                            Arena Challenges
                        </h1>
                        <p style={{ color: 'var(--text-muted)', fontSize: '0.85rem', marginTop: '4px' }}>Level up by creating and completing custom long-term challenges.</p>
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
                    <Target size={20} />
                    Create New Challenge
                </h2>
                <form onSubmit={handleAddChallenge} style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap', alignItems: 'flex-end' }}>

                    <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem', flex: '2', minWidth: '200px' }}>
                        <label style={{ fontSize: '0.875rem', fontWeight: 600, color: 'var(--text-secondary)' }}>Challenge Title</label>
                        <input
                            type="text"
                            value={title}
                            onChange={(e) => setTitle(e.target.value)}
                            placeholder="e.g. 75 Hard, Code Every Day"
                            required
                            style={{
                                padding: '0.75rem', border: '1px solid var(--border-color)',
                                borderRadius: 'var(--radius-sm)', outline: 'none', background: 'var(--bg-secondary)', color: 'var(--text-primary)'
                            }}
                        />
                    </div>

                    <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem', flex: '1', minWidth: '150px' }}>
                        <label style={{ fontSize: '0.875rem', fontWeight: 600, color: 'var(--text-secondary)' }}>Start Date</label>
                        <input
                            type="date"
                            value={startDate}
                            onChange={(e) => setStartDate(e.target.value)}
                            required
                            style={{
                                padding: '0.75rem', border: '1px solid var(--border-color)',
                                borderRadius: 'var(--radius-sm)', outline: 'none', background: 'var(--bg-secondary)', color: 'var(--text-primary)'
                            }}
                        />
                    </div>

                    <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem', flex: '1', minWidth: '150px' }}>
                        <label style={{ fontSize: '0.875rem', fontWeight: 600, color: 'var(--text-secondary)' }}>End Date</label>
                        <input
                            type="date"
                            value={endDate}
                            onChange={(e) => setEndDate(e.target.value)}
                            min={startDate}
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
                            padding: '0.75rem 1.5rem', background: 'var(--accent-sage-dark)', color: 'white',
                            border: 'none', borderRadius: 'var(--radius-sm)', cursor: 'pointer', fontWeight: 600, height: '44px',
                            minWidth: '120px'
                        }}
                    >
                        Create
                    </button>
                </form>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                <h2 className="section-title">Active Challenges</h2>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: '1.5rem' }}>
                    {challenges.length === 0 ? (
                        <p style={{ color: 'var(--text-muted)' }}>No challenges created yet.</p>
                    ) : (
                        challenges.map(challenge => (
                            <div className="card challenge-card" style={{ position: 'relative' }} key={challenge.id}>
                                <button
                                    onClick={() => deleteChallenge(challenge.id)}
                                    style={{ position: 'absolute', top: '1rem', right: '1rem', background: 'none', border: 'none', cursor: 'pointer', color: 'var(--text-muted)' }}
                                    title="Delete Challenge"
                                    onMouseOver={e => e.currentTarget.style.color = 'var(--tag-red-text)'}
                                    onMouseOut={e => e.currentTarget.style.color = 'var(--text-muted)'}
                                >
                                    Delete
                                </button>
                                <div className="challenge-header">
                                    <h3 className="challenge-title">{challenge.title}</h3>
                                    <p className="challenge-dates">
                                        <Calendar size={14} style={{ display: 'inline', marginRight: '4px', verticalAlign: '-2px' }} />
                                        {challenge.dates} • {challenge.days} Days
                                    </p>
                                </div>

                                <div className="challenge-grid">
                                    {Array.from({ length: expandedIds.has(challenge.id) ? challenge.days : Math.min(challenge.days, 35) }).map((_, dIdx) => (
                                        <div
                                            key={dIdx}
                                            className={`challenge-day ${challenge.checks[dIdx] ? 'completed' : ''}`}
                                            style={{ cursor: 'pointer' }}
                                            onClick={() => toggleDay(challenges.findIndex(c => c.id === challenge.id), dIdx)}
                                        >
                                            {dIdx + 1}
                                        </div>
                                    ))}
                                    {challenge.days > 35 && (
                                        <div
                                            style={{ gridColumn: '1 / -1', textAlign: 'center', fontSize: '0.875rem', color: 'var(--text-muted)', marginTop: '0.5rem', cursor: 'pointer' }}
                                            onClick={() => toggleExpand(challenge.id)}
                                            onMouseOver={e => e.currentTarget.style.color = 'var(--text-primary)'}
                                            onMouseOut={e => e.currentTarget.style.color = 'var(--text-muted)'}
                                        >
                                            {expandedIds.has(challenge.id) ? 'Show less' : `+ ${challenge.days - 35} more days tracked`}
                                        </div>
                                    )}
                                </div>
                            </div>
                        ))
                    )}
                </div>
            </div>
        </div>
    );
}
