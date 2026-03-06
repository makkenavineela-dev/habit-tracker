import React from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { Trophy, Calendar, Sparkles, Trash2, ArrowRight } from 'lucide-react';

export default function ChallengeGallery({ challenges, setChallenges, previewOnly, onHaptic }) {
    const navigate = useNavigate();

    const deleteChallenge = (id) => {
        if (onHaptic) onHaptic();
        setChallenges(challenges.filter(c => c.id !== id));
    };

    const displayChallenges = previewOnly && challenges ? challenges.slice(0, 3) : challenges;

    const container = {
        hidden: { opacity: 0 },
        show: {
            opacity: 1,
            transition: { staggerChildren: 0.1 }
        }
    };

    const item = {
        hidden: { opacity: 0, scale: 0.95 },
        show: { opacity: 1, scale: 1 }
    };

    return (
        <div className="card" style={{ padding: '2.5rem' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2.5rem' }}>
                <h2 className="section-title" style={{ marginBottom: 0 }}>
                    <Trophy size={24} color="var(--accent-earth)" />
                    Active Challenges
                </h2>
                {previewOnly && (
                    <div
                        className="manage-link"
                        onClick={() => navigate('/challenges')}
                        style={{ color: 'var(--accent-earth-dark)', background: 'var(--accent-earth-light)', cursor: 'pointer' }}
                    >
                        All Challenges <ArrowRight size={14} style={{ marginLeft: 4 }} />
                    </div>
                )}
            </div>

            <motion.div
                className="gallery-grid"
                variants={container}
                initial="hidden"
                animate="show"
            >
                {(displayChallenges || []).map((challenge) => (
                    <motion.div
                        variants={item}
                        className="card challenge-card"
                        key={challenge.id}
                    >
                        {!previewOnly && (
                            <motion.button
                                whileHover={{ scale: 1.1, color: 'var(--tag-red-text)' }}
                                onClick={(e) => { e.stopPropagation(); deleteChallenge(challenge.id); }}
                                style={{
                                    position: 'absolute', top: '1.5rem', right: '1.5rem', background: 'none', border: 'none', cursor: 'pointer',
                                    color: 'var(--text-muted)', zIndex: 5
                                }}
                            >
                                <Trash2 size={16} />
                            </motion.button>
                        )}
                        <div className="challenge-header">
                            <div>
                                <h3 className="challenge-title">{challenge.title}</h3>
                                <div className="challenge-dates">
                                    <Calendar size={14} style={{ marginRight: '6px', opacity: 0.7 }} />
                                    {challenge.startDate} — {challenge.endDate}
                                </div>
                            </div>
                        </div>

                        <div className="challenge-grid">
                            {Array.from({ length: 21 }).map((_, dIdx) => (
                                <motion.div
                                    key={dIdx}
                                    whileHover={{ scale: 1.2, rotate: 5, zIndex: 10 }}
                                    className={`challenge-day ${dIdx < 5 ? 'completed' : ''}`}
                                    title={`Day ${dIdx + 1}`}
                                    onClick={() => { if (onHaptic) onHaptic(); }}
                                >
                                    {dIdx + 1}
                                </motion.div>
                            ))}
                        </div>
                    </motion.div>
                ))}
                {(!displayChallenges || displayChallenges.length === 0) && (
                    <div style={{ color: 'var(--text-muted)', textAlign: 'center', gridColumn: '1 / -1', padding: '4rem', background: 'var(--bg-tertiary)', borderRadius: 'var(--radius-lg)', border: '2px dashed var(--border-color)' }}>
                        <Sparkles size={40} style={{ marginBottom: '1.5rem', opacity: 0.2, margin: '0 auto' }} />
                        <p style={{ fontWeight: 700, fontSize: '1.1rem' }}>Ready for a new challenge?</p>
                        <p style={{ fontSize: '0.9rem', marginTop: '0.5rem' }}>Create one to start tracking your progress.</p>
                    </div>
                )}
            </motion.div>
        </div>
    );
}
