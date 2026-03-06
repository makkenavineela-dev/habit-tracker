import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronLeft, ChevronRight, X, Calendar as CalendarIcon, Flame, Sparkles, PenLine, Save } from 'lucide-react';
import {
    getCalendarGrid,
    getMonthName,
    getShortDayName,
    formatDate
} from '../utils/dateUtils';

export default function HabitCalendarModal({ habit, onClose, onToggleDate, onUpdateNote }) {
    const today = new Date();
    const [currentDate, setCurrentDate] = useState(new Date(today.getFullYear(), today.getMonth(), 1));
    const [selectedDate, setSelectedDate] = useState(formatDate(new Date()));
    const [note, setNote] = useState(habit.notes?.[selectedDate] || '');

    useEffect(() => {
        setNote(habit.notes?.[selectedDate] || '');
    }, [selectedDate, habit.notes]);

    const handleSaveNote = () => {
        if (onUpdateNote) {
            onUpdateNote(habit.id, selectedDate, note);
        }
    };

    const year = currentDate.getFullYear();
    const month = currentDate.getMonth();

    const handlePrevMonth = () => {
        setCurrentDate(new Date(year, month - 1, 1));
    };

    const handleNextMonth = () => {
        setCurrentDate(new Date(year, month + 1, 1));
    };

    const grid = getCalendarGrid(year, month);
    const completedSet = new Set(habit.completedDates);

    // Calculate strict streak using dateUtils or internal logic
    const calculateStreakInternal = () => {
        let streak = 0;
        const checkDate = new Date();
        let todayStr = formatDate(checkDate);
        let yesterdayDate = new Date();
        yesterdayDate.setDate(yesterdayDate.getDate() - 1);
        let yesterdayStr = formatDate(yesterdayDate);

        if (!completedSet.has(todayStr) && !completedSet.has(yesterdayStr)) return 0;

        while (true) {
            const dStr = formatDate(checkDate);
            if (completedSet.has(dStr)) {
                streak++;
                checkDate.setDate(checkDate.getDate() - 1);
            } else {
                if (streak === 0 && dStr === todayStr) {
                    checkDate.setDate(checkDate.getDate() - 1);
                } else break;
            }
        }
        return streak;
    };

    const currentStreak = calculateStreakInternal();

    return (
        <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="modal-overlay"
            onClick={onClose}
        >
            <motion.div
                initial={{ scale: 0.9, y: 20 }}
                animate={{ scale: 1, y: 0 }}
                exit={{ scale: 0.9, y: 20 }}
                className="modal-content"
                onClick={e => e.stopPropagation()}
                style={{ padding: '2.5rem', maxWidth: '800px', width: '90%' }}
            >
                <div style={{ display: 'grid', gridTemplateColumns: '1.2fr 1fr', gap: '3rem' }}>

                    {/* Left: Calendar View */}
                    <div>
                        <div className="modal-header" style={{ marginBottom: '2rem' }}>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                                <div className="habit-icon" style={{ width: '40px', height: '40px', fontSize: '1.25rem' }}>{habit.icon}</div>
                                <div>
                                    <h2 style={{ fontSize: '1.5rem', fontWeight: 800, margin: 0, fontFamily: 'Outfit, sans-serif' }}>
                                        {habit.name}
                                    </h2>
                                    <p style={{ color: 'var(--text-muted)', fontSize: '0.85rem', fontWeight: 600, margin: 0 }}>Progress Tracker</p>
                                </div>
                            </div>
                        </div>

                        <div className="cal-header" style={{ marginBottom: '1.5rem', background: 'var(--bg-tertiary)', padding: '0.75rem', borderRadius: '12px' }}>
                            <motion.button whileTap={{ scale: 0.9 }} className="cal-nav-btn" onClick={handlePrevMonth}><ChevronLeft size={20} /></motion.button>
                            <h3 style={{ fontSize: '1.1rem', fontWeight: 800, margin: 0, fontFamily: 'Outfit, sans-serif' }}>{getMonthName(month)} {year}</h3>
                            <motion.button whileTap={{ scale: 0.9 }} className="cal-nav-btn" onClick={handleNextMonth}><ChevronRight size={20} /></motion.button>
                        </div>

                        <div className="cal-grid">
                            {['M', 'T', 'W', 'T', 'F', 'S', 'S'].map((day, idx) => (
                                <div key={idx} className="cal-day-label">{day}</div>
                            ))}
                            {grid.map((week, wIdx) =>
                                week.map((date, dIdx) => {
                                    if (!date) return <div key={`empty-${wIdx}-${dIdx}`} className="cal-cell empty"></div>;
                                    const dStr = formatDate(date);
                                    const isCompleted = completedSet.has(dStr);
                                    const isSelected = selectedDate === dStr;
                                    const hasNote = habit.notes?.[dStr];

                                    return (
                                        <motion.div
                                            key={dStr}
                                            whileHover={{ scale: 1.1 }}
                                            whileTap={{ scale: 0.95 }}
                                            className={`cal-cell ${isCompleted ? 'completed' : 'uncompleted'} ${isSelected ? 'selected' : ''}`}
                                            style={{
                                                position: 'relative',
                                                border: isSelected ? '2px solid var(--accent-sage-dark)' : 'none'
                                            }}
                                            onClick={() => {
                                                onToggleDate(habit.id, dStr);
                                                setSelectedDate(dStr);
                                            }}
                                        >
                                            {date.getDate()}
                                            {hasNote && <div style={{ position: 'absolute', bottom: '4px', width: '4px', height: '4px', borderRadius: '50%', background: isCompleted ? 'white' : 'var(--accent-sage-dark)' }}></div>}
                                        </motion.div>
                                    );
                                })
                            )}
                        </div>
                    </div>

                    {/* Right: Notes & Stats */}
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
                        <div className="streak-card" style={{ margin: 0, background: 'var(--bg-tertiary)', borderRadius: '20px', padding: '1.5rem' }}>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.5rem' }}>
                                <Flame size={20} color="var(--accent-sage-dark)" />
                                <span style={{ color: 'var(--accent-sage-dark)', fontSize: '0.85rem', fontWeight: 800, textTransform: 'uppercase' }}>Current Streak</span>
                            </div>
                            <div className="streak-value" style={{ fontSize: '2.5rem' }}>{currentStreak} {currentStreak === 1 ? 'Day' : 'Days'}</div>
                        </div>

                        <div className="note-section" style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                                <PenLine size={18} color="var(--accent-sage-dark)" />
                                <span style={{ fontWeight: 800, fontSize: '0.9rem', color: 'var(--text-primary)' }}>Journal Entry</span>
                                <span style={{ marginLeft: 'auto', fontSize: '0.75rem', color: 'var(--text-muted)' }}>{selectedDate}</span>
                            </div>
                            <textarea
                                value={note}
                                onChange={(e) => setNote(e.target.value)}
                                placeholder="How did it go? (e.g. 'Felt energetic', '20 mins today')"
                                style={{
                                    flex: 1, background: 'var(--bg-tertiary)', border: 'none', borderRadius: '16px',
                                    padding: '1rem', color: 'var(--text-primary)', fontFamily: 'inherit',
                                    fontSize: '0.9rem', resize: 'none', outline: 'none', border: '1px solid transparent'
                                }}
                            />
                            <motion.button
                                whileHover={{ scale: 1.02, background: 'var(--accent-sage-dark)', color: 'white' }}
                                whileTap={{ scale: 0.98 }}
                                onClick={handleSaveNote}
                                style={{
                                    padding: '0.75rem', borderRadius: '12px', background: 'var(--bg-tertiary)',
                                    color: 'var(--accent-sage-dark)', border: 'none', fontWeight: 800,
                                    cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem'
                                }}
                            >
                                <Save size={16} /> Save Reflexion
                            </motion.button>
                        </div>
                    </div>
                </div>

                <motion.button
                    whileHover={{ scale: 1.1, rotate: 90 }}
                    style={{ position: 'absolute', top: '1.5rem', right: '1.5rem', border: 'none', background: 'none', cursor: 'pointer', color: 'var(--text-muted)' }}
                    onClick={onClose}
                >
                    <X size={24} />
                </motion.button>

            </motion.div>
        </motion.div>
    );
}
