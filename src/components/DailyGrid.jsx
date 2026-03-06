import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Droplets, Footprints, Moon, Sun, CheckCircle, Maximize2, ChevronLeft, ChevronRight, Plus, X, Edit2, Trash2, Check, Sparkles, BookOpen, Dumbbell, Activity, Target, Flame } from 'lucide-react';
import HabitCalendarModal from './HabitCalendarModal';
import { getPastNDays, getShortDayName, formatDate, calculateStreak } from '../utils/dateUtils';

export default function DailyGrid({ habits = [], setHabits, updateGlobalProgress, onAddHabit, onDeleteHabit, onUpdateHabit, onHaptic }) {
    const [selectedHabitId, setSelectedHabitId] = useState(null);
    const [offsetDays, setOffsetDays] = useState(0);
    const [isAdding, setIsAdding] = useState(false);
    const [newHabitName, setNewHabitName] = useState('');
    const [editingHabitId, setEditingHabitId] = useState(null);
    const [editName, setEditName] = useState('');

    const IconComponent = ({ iconName, ...props }) => {
        const icons = {
            'sparkles': <Sparkles {...props} />,
            'droplets': <Droplets {...props} />,
            'book': <BookOpen {...props} />,
            'footprints': <Footprints {...props} />,
            'dumbbell': <Dumbbell {...props} />,
            'activity': <Activity {...props} />,
            'sun': <Sun {...props} />,
            'moon': <Moon {...props} />,
            'target': <Target {...props} />
        };
        return icons[iconName] || <Sparkles {...props} />;
    };

    // We want today to be in the middle of our 7-day view when offset is 0.
    const endDate = new Date();
    endDate.setDate(endDate.getDate() + 3 - offsetDays);
    const daysToShow = getPastNDays(7, endDate);

    // Calculate today's overall progress across all habits
    useEffect(() => {
        const todayStr = formatDate(new Date());
        let completedToday = 0;
        habits.forEach(h => {
            if (h.completedDates && h.completedDates.includes(todayStr)) {
                completedToday++;
            }
        });

        const progress = habits.length > 0 ? Math.round((completedToday / habits.length) * 100) : 0;
        updateGlobalProgress(progress);
    }, [habits, updateGlobalProgress]);

    const toggleDate = (habitId, dateStr) => {
        if (onHaptic) onHaptic();
        setHabits(habits.map(h => {
            if (h.id === habitId) {
                const completedList = h.completedDates || [];
                const index = completedList.indexOf(dateStr);
                if (index > -1) {
                    return { ...h, completedDates: completedList.filter(d => d !== dateStr) };
                } else {
                    return { ...h, completedDates: [...completedList, dateStr] };
                }
            }
            return h;
        }));
    };

    const updateNote = (habitId, dateStr, note) => {
        setHabits(habits.map(h => {
            if (h.id === habitId) {
                const notes = h.notes || {};
                return { ...h, notes: { ...notes, [dateStr]: note } };
            }
            return h;
        }));
    };

    const handleAddHabit = (e) => {
        e.preventDefault();
        if (newHabitName.trim()) {
            onAddHabit(newHabitName.trim());
            setNewHabitName('');
            setIsAdding(false);
        }
    };

    const startEditing = (habit) => {
        setEditingHabitId(habit.id);
        setEditName(habit.name);
    };

    const saveEdit = (id) => {
        if (editName.trim()) {
            onUpdateHabit(id, editName.trim());
            setEditingHabitId(null);
        }
    };

    const selectedHabit = habits.find(h => h.id === selectedHabitId);

    return (
        <div className="card daily-grid" style={{ overflow: 'visible' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
                <h2 className="section-title" style={{ marginBottom: 0 }}>
                    <Sparkles size={22} className="text-sage" style={{ color: 'var(--accent-sage-dark)' }} />
                    Daily Rituals
                </h2>
                <div style={{ display: 'flex', gap: '0.75rem', alignItems: 'center' }}>
                    <div style={{ display: 'flex', gap: '0.4rem', background: 'var(--bg-tertiary)', padding: '0.4rem', borderRadius: '14px' }}>
                        {[
                            { name: 'Water', icon: 'droplets' },
                            { name: 'Read', icon: 'book' },
                            { name: 'Walk', icon: 'footprints' },
                            { name: 'Gym', icon: 'dumbbell' }
                        ].map(tmpl => (
                            <motion.button
                                key={tmpl.name}
                                whileHover={{ scale: 1.1, background: 'var(--bg-card)' }}
                                whileTap={{ scale: 0.9 }}
                                onClick={() => onAddHabit(tmpl.name, tmpl.icon)}
                                style={{
                                    border: 'none', background: 'transparent', padding: '0.4rem', borderRadius: '10px',
                                    cursor: 'pointer', color: 'var(--accent-sage-dark)', display: 'flex'
                                }}
                                title={`Add ${tmpl.name} `}
                            >
                                <IconComponent iconName={tmpl.icon} size={16} />
                            </motion.button>
                        ))}
                    </div>
                    <motion.button
                        whileHover={{ scale: 1.05, boxShadow: '0 8px 25px rgba(91, 115, 88, 0.2)' }}
                        whileTap={{ scale: 0.95 }}
                        onClick={() => setIsAdding(!isAdding)}
                        className="establish-btn"
                        style={{
                            background: isAdding ? '#fff1f0' : 'var(--accent-sage-dark)',
                            color: isAdding ? '#c93d3d' : 'white',
                            border: 'none', padding: '0.75rem 1.5rem', borderRadius: '100px',
                            cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '0.6rem',
                            fontSize: '0.9rem', fontWeight: 800, transition: 'all 0.4s'
                        }}
                    >
                        {isAdding ? <X size={18} /> : <Plus size={18} />}
                        {isAdding ? 'Cancel' : 'New Ritual'}
                    </motion.button>
                    <div style={{ display: 'flex', gap: '0.25rem', background: 'var(--bg-tertiary)', padding: '0.3rem', borderRadius: '12px' }}>
                        <button onClick={() => setOffsetDays(offsetDays + 7)} className="cal-nav-btn" style={{ padding: '4px' }}>
                            <ChevronLeft size={18} />
                        </button>
                        <button onClick={() => setOffsetDays(offsetDays - 7)} className="cal-nav-btn" style={{ padding: '4px' }}>
                            <ChevronRight size={18} />
                        </button>
                    </div>
                </div>
            </div>

            <AnimatePresence>
                {isAdding && (
                    <motion.form
                        initial={{ opacity: 0, height: 0, marginBottom: 0 }}
                        animate={{ opacity: 1, height: 'auto', marginBottom: '2.5rem' }}
                        exit={{ opacity: 0, height: 0, marginBottom: 0 }}
                        onSubmit={handleAddHabit}
                        style={{ display: 'flex', gap: '0.75rem', overflow: 'hidden' }}
                    >
                        <input
                            type="text"
                            value={newHabitName}
                            onChange={(e) => setNewHabitName(e.target.value)}
                            placeholder="Identify a small, consistent action..."
                            autoFocus
                            style={{
                                flex: 1, padding: '1.25rem', borderRadius: 'var(--radius-lg)',
                                border: '1px solid var(--border-color)', background: 'var(--bg-secondary)',
                                color: 'var(--text-primary)', outline: 'none', fontWeight: 600, fontSize: '1rem'
                            }}
                        />
                        <button
                            type="submit"
                            disabled={!newHabitName.trim()}
                            style={{
                                background: 'var(--accent-sage-dark)', color: 'white', border: 'none',
                                padding: '0 2rem', borderRadius: 'var(--radius-lg)', cursor: 'pointer',
                                fontWeight: 800, opacity: newHabitName.trim() ? 1 : 0.5,
                                textTransform: 'uppercase', letterSpacing: '0.05em', fontSize: '0.8rem'
                            }}
                        >
                            Establish
                        </button>
                    </motion.form>
                )}
            </AnimatePresence>

            <div className="habit-rows" style={{ display: 'flex', flexDirection: 'column', gap: '2.5rem' }}>
                <AnimatePresence mode="popLayout">
                    {habits.map((habit) => {
                        const completedDates = habit.completedDates || [];
                        const last7DaysDone = daysToShow.filter(d => completedDates.includes(formatDate(d))).length;
                        const progress = Math.round((last7DaysDone / 7) * 100);
                        const isEditing = editingHabitId === habit.id;
                        const streak = calculateStreak(habit.completedDates || []);

                        return (
                            <motion.div
                                layout
                                initial={{ opacity: 0, scale: 0.95 }}
                                animate={{ opacity: 1, scale: 1 }}
                                exit={{ opacity: 0, scale: 0.95 }}
                                className="habit-row"
                                key={habit.id}
                            >
                                <div className="habit-info" style={{ marginBottom: '1rem' }}>
                                    <div style={{ display: 'flex', alignItems: 'center', gap: '1.25rem', flex: 1 }}>
                                        <div className="habit-icon">
                                            <IconComponent iconName={habit.icon} size={20} />
                                        </div>
                                        {isEditing ? (
                                            <div style={{ display: 'flex', gap: '0.5rem', flex: 1 }}>
                                                <input
                                                    value={editName}
                                                    onChange={(e) => setEditName(e.target.value)}
                                                    autoFocus
                                                    onKeyDown={(e) => e.key === 'Enter' && saveEdit(habit.id)}
                                                    style={{
                                                        padding: '0.5rem 0.75rem', borderRadius: '8px', border: '2px solid var(--accent-sage)',
                                                        background: 'var(--bg-card)', color: 'var(--text-primary)', fontSize: '1rem', flex: 1, outline: 'none'
                                                    }}
                                                />
                                                <button onClick={() => saveEdit(habit.id)} style={{ color: 'var(--tag-green-text)', background: 'none', border: 'none', cursor: 'pointer' }}><Check size={20} /></button>
                                                <button onClick={() => setEditingHabitId(null)} style={{ color: 'var(--text-muted)', background: 'none', border: 'none', cursor: 'pointer' }}><X size={20} /></button>
                                            </div>
                                        ) : (
                                            <div className="habit-name-group" style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                                                <div style={{ display: 'flex', flexDirection: 'column' }}>
                                                    <h3
                                                        className="habit-name habit-clickable"
                                                        onClick={() => setSelectedHabitId(habit.id)}
                                                        style={{ fontWeight: 700, fontSize: '1.25rem', margin: 0, fontFamily: 'Outfit, sans-serif' }}
                                                    >
                                                        {habit.name}
                                                        <Maximize2 size={12} color="var(--text-muted)" style={{ marginLeft: 8, opacity: 0.5 }} />
                                                    </h3>
                                                    {streak > 0 && (
                                                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.3rem', color: streak >= 3 ? '#ff7043' : 'var(--text-muted)', fontSize: '0.8rem', fontWeight: 800 }}>
                                                            <Flame size={14} fill={streak >= 3 ? '#ff7043' : 'transparent'} className={streak >= 5 ? 'animate-pulse' : ''} />
                                                            <span>{streak} DAY STREAK</span>
                                                        </div>
                                                    )}
                                                </div>
                                                <div className="habit-actions" style={{ display: 'flex', gap: '0.5rem', transition: 'opacity 0.2s' }}>
                                                    <button onClick={() => startEditing(habit)} style={{ color: 'var(--text-muted)', background: 'none', border: 'none', cursor: 'pointer', padding: '4px' }} title="Edit"><Edit2 size={16} /></button>
                                                    <button onClick={() => onDeleteHabit(habit.id)} style={{ color: 'var(--tag-red-text)', background: 'none', border: 'none', cursor: 'pointer', padding: '4px' }} title="Delete"><Trash2 size={16} /></button>
                                                </div>
                                            </div>
                                        )}
                                    </div>
                                    <div style={{ textAlign: 'right' }}>
                                        <div style={{ fontSize: '1.1rem', fontWeight: 800, color: 'var(--accent-sage-dark)', fontFamily: 'Outfit, sans-serif' }}>
                                            {progress}%
                                        </div>
                                        <div style={{ fontSize: '0.7rem', fontWeight: 600, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                                            Last 7 Days
                                        </div>
                                    </div>
                                </div>

                                <div className="progress-track" style={{ marginBottom: '1.25rem', height: '6px' }}>
                                    <motion.div
                                        initial={{ width: 0 }}
                                        animate={{ width: `${progress}%` }}
                                        className="progress-fill"
                                    />
                                </div>

                                <div className="days-grid">
                                    {daysToShow.map((dateObj, dIdx) => {
                                        const dStr = formatDate(dateObj);
                                        const isCompleted = completedDates.includes(dStr);
                                        const isToday = dStr === formatDate(new Date());

                                        return (
                                            <div className="day-col" key={dIdx}>
                                                <span className="day-label" style={{
                                                    color: isToday ? 'var(--accent-sage-dark)' : 'var(--text-muted)',
                                                    fontWeight: isToday ? 800 : 600,
                                                    marginBottom: '0.25rem'
                                                }}>
                                                    {isToday ? 'Today' : getShortDayName(dateObj.getDay() === 0 ? 6 : dateObj.getDay() - 1)}
                                                </span>
                                                <motion.div
                                                    whileHover={{ scale: 1.1, y: -4 }}
                                                    whileTap={{ scale: 0.9 }}
                                                    className={`day-circle ${isCompleted ? 'completed animate-check' : ''}`}
                                                    onClick={() => toggleDate(habit.id, dStr)}
                                                >
                                                    {isCompleted ? <Check size={24} strokeWidth={3} /> : dateObj.getDate()}
                                                </motion.div>
                                            </div>
                                        );
                                    })}
                                </div>
                            </motion.div>
                        );
                    })}
                </AnimatePresence>
            </div>

            {selectedHabit && (
                <HabitCalendarModal
                    habit={selectedHabit}
                    onClose={() => setSelectedHabitId(null)}
                    onToggleDate={toggleDate}
                    onUpdateNote={updateNote}
                />
            )}
        </div>
    );
}

