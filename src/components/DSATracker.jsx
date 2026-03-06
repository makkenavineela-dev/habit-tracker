import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Database, Code2, Trash2, ArrowRight, Sparkles, ExternalLink } from 'lucide-react';

export default function DSATracker({ problems, setProblems, previewOnly, onHaptic }) {
    const getLeetCodeUrl = (name) => {
        const slug = name.toLowerCase()
            .replace(/[^a-z0-9\s-]/g, '')
            .trim()
            .replace(/\s+/g, '-');
        return `https://leetcode.com/problems/${slug}/`;
    };

    const toggleStatus = (id) => {
        if (onHaptic) onHaptic();
        setProblems(problems.map(p =>
            p.id === id ? { ...p, status: p.status === "Done" ? "Attempted" : "Done" } : p
        ));
    };

    const displayProblems = previewOnly && problems ? problems.slice(0, 4) : problems;

    const deleteProblem = (id) => {
        setProblems(problems.filter(p => p.id !== id));
    };

    const container = {
        hidden: { opacity: 0 },
        show: {
            opacity: 1,
            transition: { staggerChildren: 0.05 }
        }
    };

    const item = {
        hidden: { opacity: 0, x: -10 },
        show: { opacity: 1, x: 0 }
    };

    return (
        <div className="card">
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
                <h2 className="section-title" style={{ marginBottom: 0 }}>
                    <Database size={22} color="var(--accent-sage-dark)" />
                    DSA & Skills
                </h2>
                {previewOnly && (
                    <div className="manage-link">
                        Full Log <ArrowRight size={14} style={{ marginLeft: 4 }} />
                    </div>
                )}
            </div>

            <div className="dsa-table-wrapper">
                <table className="dsa-table">
                    <thead>
                        <tr>
                            <th style={{ width: '60px', textAlign: 'center' }}>Solve</th>
                            <th>Problem</th>
                            <th>Platform</th>
                            <th>Complexity</th>
                            <th>Domain</th>
                            <th style={{ textAlign: 'right' }}>Logged</th>
                            {!previewOnly && <th style={{ width: '60px' }}></th>}
                        </tr>
                    </thead>
                    <motion.tbody
                        variants={container}
                        initial="hidden"
                        animate="show"
                    >
                        <AnimatePresence mode="popLayout">
                            {(displayProblems || []).map((problem) => (
                                <motion.tr
                                    layout
                                    variants={item}
                                    key={problem.id}
                                >
                                    <td style={{ textAlign: 'center' }} onClick={e => e.stopPropagation()}>
                                        <input
                                            type="checkbox"
                                            className="custom-checkbox"
                                            checked={problem.status === "Done"}
                                            onChange={() => toggleStatus(problem.id)}
                                        />
                                    </td>
                                    <td>
                                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                                            <div className="habit-icon" style={{ width: '28px', height: '28px' }}>
                                                <Code2 size={14} />
                                            </div>
                                            {problem.platform === 'LeetCode' ? (
                                                <motion.a
                                                    href={getLeetCodeUrl(problem.name)}
                                                    target="_blank"
                                                    rel="noopener noreferrer"
                                                    whileHover={{ x: 5, color: 'var(--accent-sage-dark)' }}
                                                    style={{
                                                        fontWeight: 700,
                                                        color: 'var(--text-primary)',
                                                        fontFamily: 'Outfit, sans-serif',
                                                        textDecoration: 'none',
                                                        display: 'flex',
                                                        alignItems: 'center',
                                                        gap: '0.4rem'
                                                    }}
                                                >
                                                    {problem.number ? `${problem.number}. ` : ''}{problem.name}
                                                    <ExternalLink size={12} opacity={0.5} />
                                                </motion.a>
                                            ) : (
                                                <span style={{ fontWeight: 700, color: 'var(--text-primary)', fontFamily: 'Outfit, sans-serif' }}>
                                                    {problem.number ? `${problem.number}. ` : ''}{problem.name}
                                                </span>
                                            )}
                                        </div>
                                    </td>
                                    <td style={{ fontWeight: 600, color: 'var(--text-secondary)', fontSize: '0.9rem' }}>{problem.platform}</td>
                                    <td>
                                        <span className={`tag ${problem.difficulty ? problem.difficulty.toLowerCase() : 'medium'}`}>
                                            {problem.difficulty}
                                        </span>
                                    </td>
                                    <td>
                                        <span className="tag pending" style={{ background: 'var(--bg-tertiary)', color: 'var(--text-secondary)' }}>
                                            {problem.topic}
                                        </span>
                                    </td>
                                    <td style={{ textAlign: 'right', color: 'var(--text-muted)', fontSize: '0.75rem', fontWeight: 700 }}>
                                        {problem.dateAdded}
                                    </td>
                                    {!previewOnly && (
                                        <td style={{ textAlign: 'center' }}>
                                            <motion.button
                                                whileHover={{ scale: 1.1, color: 'var(--tag-red-text)' }}
                                                onClick={(e) => { e.stopPropagation(); deleteProblem(problem.id); }}
                                                style={{
                                                    background: 'none', border: 'none', cursor: 'pointer',
                                                    color: 'var(--text-muted)', padding: '4px'
                                                }}
                                            >
                                                <Trash2 size={16} />
                                            </motion.button>
                                        </td>
                                    )}
                                </motion.tr>
                            ))}
                        </AnimatePresence>
                        {(!displayProblems || displayProblems.length === 0) && (
                            <tr>
                                <td colSpan={previewOnly ? "6" : "7"} style={{ textAlign: 'center', padding: '4rem' }}>
                                    <Sparkles size={32} style={{ marginBottom: '1rem', opacity: 0.1, margin: '0 auto' }} />
                                    <p style={{ color: 'var(--text-muted)', fontWeight: 600 }}>No problems tracked yet.</p>
                                </td>
                            </tr>
                        )}
                    </motion.tbody>
                </table>
            </div>
        </div>
    );
}
