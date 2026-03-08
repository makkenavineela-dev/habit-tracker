import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Activity, Dumbbell, BookOpen, Trash2, ArrowRight, Sparkles, Droplets, Footprints, Moon, Sun, Target } from 'lucide-react';

export default function WeeklyTracker({ weeklyHabits = [], setWeeklyHabits, previewOnly, onHaptic }) {

    const IconComponent = ({ iconName, ...props }) => {
        if (!iconName) return <Sparkles {...props} />;
        if (typeof iconName !== 'string') return iconName;

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
        const icon = icons[iconName] || <Sparkles {...props} />;
        return React.cloneElement(icon, { ...props });
    };

    const toggleCheck = (hIdx, cIdx) => {
        if (onHaptic) onHaptic();

        const newHabits = [...weeklyHabits];
        const habit = { ...newHabits[hIdx] };

        // Ensure checks is an array
        if (!Array.isArray(habit.checks)) {
            habit.checks = Array(habit.target).fill(false);
        }

        const newChecks = [...habit.checks];
        newChecks[cIdx] = !newChecks[cIdx];
        habit.checks = newChecks;

        newHabits[hIdx] = habit;
        setWeeklyHabits(newHabits);
    };

    const deleteHabit = (id) => {
        setWeeklyHabits(weeklyHabits.filter(h => h.id !== id));
    };

    const displayHabits = previewOnly && weeklyHabits ? weeklyHabits.slice(0, 3) : weeklyHabits;

    const container = {
        hidden: { opacity: 0 },
        show: {
            opacity: 1,
            transition: {
                staggerChildren: 0.1
            }
        }
    };

    const item = {
        hidden: { opacity: 0, y: 20 },
        show: { opacity: 1, y: 0 }
    };

    return (
        <div className="card weekly-tracker-container">
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
                <h2 className="section-title" style={{ marginBottom: 0 }}>
                    <Activity size={22} color="var(--accent-sage-dark)" />
                    Weekly Focus
                </h2>
                {previewOnly && (
                    <div className="manage-link">
                        Manage Goals <ArrowRight size={14} style={{ marginLeft: 4 }} />
                    </div>
                )}
            </div>

            <motion.div
                className="weekly-grid"
                variants={container}
                initial="hidden"
                animate="show"
            >
                {(displayHabits || []).map((habit, displayIdx) => {
                    const hIdx = weeklyHabits.findIndex(h => h.id === habit.id);
                    const completedCount = Array.isArray(habit.checks)
                        ? habit.checks.filter(c => c).length
                        : (typeof habit.checks === 'number' ? habit.checks : 0);
                    const progress = Math.round((completedCount / habit.target) * 100);
                    return (
                        <motion.div
                            variants={item}
                            className="card weekly-card"
                            key={habit.id}
                        >
                            {!previewOnly && (
                                <motion.button
                                    whileHover={{ scale: 1.1, color: 'var(--tag-red-text)' }}
                                    onClick={(e) => { e.stopPropagation(); deleteHabit(habit.id); }}
                                    style={{
                                        position: 'absolute', top: '1.25rem', right: '1.25rem', background: 'none', border: 'none', cursor: 'pointer',
                                        color: 'var(--text-muted)'
                                    }}
                                >
                                    <Trash2 size={16} />
                                </motion.button>
                            )}
                            <div className="weekly-header">
                                <span className="habit-name">
                                    <span className="habit-icon">
                                        <IconComponent iconName={habit.icon} size={18} />
                                    </span>
                                    {habit.name}
                                </span>
                                <span className="weekly-goal">{habit.target}x / week</span>
                            </div>

                            <div className="weekly-progress">
                                <div className="progress-track" style={{ flex: 1, height: '6px' }}>
                                    <motion.div
                                        initial={{ width: 0 }}
                                        animate={{ width: `${progress}%` }}
                                        className="progress-fill"
                                    />
                                </div>
                                <span style={{ fontSize: '0.85rem', fontWeight: 800, color: 'var(--accent-sage-dark)', fontFamily: 'Outfit, sans-serif' }}>
                                    {progress}%
                                </span>
                            </div>

                            <div className="weekly-checkbox-group">
                                {Array.from({ length: habit.target }).map((_, cIdx) => (
                                    <div key={cIdx} onClick={(e) => e.stopPropagation()} style={{ display: 'inline-flex' }}>
                                        <input
                                            type="checkbox"
                                            className="custom-checkbox"
                                            checked={Array.isArray(habit.checks) ? !!habit.checks[cIdx] : cIdx < habit.checks}
                                            onChange={() => toggleCheck(hIdx, cIdx)}
                                        />
                                    </div>
                                ))}
                            </div>
                        </motion.div>
                    );
                })}
                {(!displayHabits || displayHabits.length === 0) && (
                    <div style={{ color: 'var(--text-muted)', textAlign: 'center', gridColumn: '1 / -1', padding: '3rem', background: 'var(--bg-tertiary)', borderRadius: 'var(--radius-md)', border: '1px dashed var(--border-color)' }}>
                        <Sparkles size={32} style={{ marginBottom: '1rem', opacity: 0.3 }} />
                        <p style={{ fontWeight: 600 }}>No focus goals yet!</p>
                    </div>
                )}
            </motion.div>
        </div>
    );
}
