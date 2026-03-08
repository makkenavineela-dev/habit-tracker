import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Target, TrendingUp, Sparkles, Quote, Trophy } from 'lucide-react';
import useHabitStore from '../store/useHabitStore';

export default function PriorityDashboard({ globalProgress }) {
    const { priorities, setPriorities } = useHabitStore();
    const [editingId, setEditingId] = useState(null);

    const handleTextChange = (id, newText) => {
        setPriorities(priorities.map(p => p.id === id ? { ...p, text: newText } : p));
    };

    const handleKeyDown = (e) => {
        if (e.key === 'Enter') {
            setEditingId(null);
        }
    };

    const container = {
        hidden: { opacity: 0 },
        show: {
            opacity: 1,
            transition: { staggerChildren: 0.1 }
        }
    };

    const item = {
        hidden: { opacity: 0, scale: 0.9 },
        show: { opacity: 1, scale: 1 }
    };

    return (
        <motion.div
            variants={container}
            initial="hidden"
            animate="show"
            className="grid-container layout-2"
        >


            <motion.div variants={item} className="card priority-card" style={{ display: 'flex', flexDirection: 'column' }}>
                <h2 className="section-title">
                    <Target size={22} />
                    Top Priorities
                </h2>
                <div className="priority-list" style={{ marginTop: '1rem' }}>
                    {priorities.map((item, index) => (
                        <motion.div
                            key={item.id}
                            className="priority-item"
                        >
                            <span className="priority-number">{index + 1}</span>
                            {editingId === item.id ? (
                                <input
                                    type="text"
                                    value={item.text}
                                    onChange={(e) => handleTextChange(item.id, e.target.value)}
                                    onBlur={() => setEditingId(null)}
                                    onKeyDown={handleKeyDown}
                                    autoFocus
                                    className="priority-text"
                                    style={{
                                        border: 'none',
                                        background: 'transparent',
                                        color: 'var(--text-primary)',
                                        outline: 'none',
                                        width: '100%',
                                        padding: 0
                                    }}
                                />
                            ) : (
                                <span
                                    className="priority-text"
                                    onClick={() => setEditingId(item.id)}
                                    style={{ cursor: 'text', flex: 1 }}
                                >
                                    {item.text}
                                </span>
                            )}
                        </motion.div>
                    ))}
                </div>
            </motion.div>

            <motion.div variants={item} className="quote-card" style={{ gridColumn: '1 / -1' }}>
                <Quote size={48} style={{ position: 'absolute', top: '2rem', left: '2rem', opacity: 0.05, color: 'var(--accent-sage-dark)' }} />
                <p className="quote-text">
                    "Success is the sum of small efforts, repeated day in and day out."
                </p>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.75rem', marginTop: '1.5rem' }}>
                    <div style={{ height: '2px', width: '24px', background: 'rgba(200, 245, 102, 0.2)' }}></div>
                    <span className="quote-author">Robert Collier</span>
                    <div style={{ height: '2px', width: '24px', background: 'rgba(200, 245, 102, 0.2)' }}></div>
                </div>
            </motion.div>
        </motion.div>
    );
}
