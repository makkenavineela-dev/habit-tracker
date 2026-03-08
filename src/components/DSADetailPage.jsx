import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, PlusCircle, Sun, Moon } from 'lucide-react';
import DSATracker from './DSATracker';
import useHabitStore from '../store/useHabitStore';
import { motion } from 'framer-motion';
import { formatDate } from '../utils/dateUtils';
import leetcodeData from '../utils/leetcode.json';

export default function DSADetailPage({ problems, setProblems, onHaptic }) {
    const { theme, toggleTheme } = useHabitStore();
    const navigate = useNavigate();
    const [questionNumber, setQuestionNumber] = useState('');
    const [topic, setTopic] = useState('');

    const handleAdd = (e) => {
        e.preventDefault();
        const num = parseInt(questionNumber);
        if (!questionNumber || isNaN(num) || num <= 0) {
            alert("Please enter a valid positive question number.");
            return;
        }
        if (onHaptic) onHaptic();

        const problemNumStr = String(questionNumber).trim();
        const apiData = leetcodeData[problemNumStr];

        // Generate actual LeetCode slug from title
        const generateSlug = (title) => {
            return title.toLowerCase()
                .replace(/[^a-z0-9\s-]/g, '') // remove special chars except hyphens
                .trim()
                .replace(/\s+/g, '-'); // spaces to hyphens
        };

        const newProblem = {
            id: Date.now(),
            number: problemNumStr,
            name: apiData ? apiData.title : `Unknown Problem #${problemNumStr}`,
            slug: apiData ? generateSlug(apiData.title) : generateSlug(`Unknown Problem ${problemNumStr}`),
            platform: "LeetCode",
            difficulty: apiData ? apiData.difficulty : "Medium",
            topic: topic || "Algorithmic Practice",
            status: "Done",
            dateAdded: formatDate(new Date())
        };

        setProblems([newProblem, ...problems]);
        setQuestionNumber('');
        setTopic('');
    };

    return (
        <div className="app-container">
            <header className="dashboard-header" style={{ marginBottom: '1.5rem', padding: '52px 20px 24px', margin: '0 0 1rem 0' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <div className="title-area">
                        <h1 style={{ display: 'flex', alignItems: 'center', cursor: 'pointer', transition: 'opacity 0.2s', color: 'var(--text-primary)', margin: 0 }}
                            onClick={() => navigate('/')}>
                            <ArrowLeft size={24} style={{ marginRight: '0.75rem', color: 'var(--text-muted)' }} />
                            DSA Tracker
                        </h1>
                        <p style={{ color: 'var(--text-muted)', fontSize: '0.85rem', marginTop: '4px' }}>Log your algorithmic progress manually or automatically.</p>
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
                    Log a specific problem
                </h2>
                <form onSubmit={handleAdd} style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap', alignItems: 'flex-end' }}>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem', flex: '1', minWidth: '200px' }}>
                        <label style={{ fontSize: '0.875rem', fontWeight: 600, color: 'var(--text-secondary)' }}>LeetCode Question #</label>
                        <input
                            type="number"
                            value={questionNumber}
                            onChange={(e) => setQuestionNumber(e.target.value)}
                            placeholder="e.g. 1"
                            required
                            style={{
                                padding: '0.75rem', border: '1px solid var(--border-color)',
                                borderRadius: 'var(--radius-sm)', outline: 'none', background: 'var(--bg-secondary)', color: 'var(--text-primary)'
                            }}
                        />
                    </div>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem', flex: '1.5', minWidth: '250px' }}>
                        <label style={{ fontSize: '0.875rem', fontWeight: 600, color: 'var(--text-secondary)' }}>Topic (Optional)</label>
                        <input
                            type="text"
                            value={topic}
                            onChange={(e) => setTopic(e.target.value)}
                            placeholder="e.g. Dynamic Programming"
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
                            textTransform: 'uppercase', letterSpacing: '0.05em', fontSize: '0.75rem'
                        }}
                    >
                        Add Log
                    </button>
                </form>
            </div>

            <DSATracker problems={problems} setProblems={setProblems} onHaptic={onHaptic} />
        </div>
    );
}
