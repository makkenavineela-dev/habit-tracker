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
                            <th style={{ width: '40px', textAlign: 'center' }}>Solve</th>
                            <th>Problem</th>
                            <th style={{ width: '100px', textAlign: 'right' }}>Status</th>
                            {!previewOnly && <th style={{ width: '40px' }}></th>}
                        </tr>
                    </thead>
                    <motion.tbody variants={container} initial="hidden" animate="show">
                        <AnimatePresence mode="popLayout">
                            {(displayProblems || []).map((problem) => (
                                <motion.tr layout variants={item} key={problem.id}>
                                    <td style={{ textAlign: 'center' }} onClick={e => e.stopPropagation()}>
                                        <input type="checkbox" className="custom-checkbox" checked={problem.status === "Done"} onChange={() => toggleStatus(problem.id)} />
                                    </td>
                                    <td>
                                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                                            {problem.platform === 'LeetCode' ? (
                                                <a href={getLeetCodeUrl(problem.name)} target="_blank" rel="noopener noreferrer" style={{ fontWeight: 700, color: 'var(--text-primary)', textDecoration: 'none', display: 'flex', alignItems: 'center', gap: '0.3rem', fontSize: '0.95rem' }}>
                                                    {problem.number ? `${problem.number}. ` : ''}{problem.name}
                                                    <ExternalLink size={10} opacity={0.5} />
                                                </a>
                                            ) : (
                                                <span style={{ fontWeight: 700, color: 'var(--text-primary)', fontSize: '0.95rem' }}>
                                                    {problem.number ? `${problem.number}. ` : ''}{problem.name}
                                                </span>
                                            )}
                                            <span className={`tag ${problem.difficulty ? problem.difficulty.toLowerCase() : 'medium'}`} style={{ fontSize: '0.55rem', padding: '1px 6px', marginLeft: '0.5rem' }}>{problem.difficulty}</span>
                                        </div>
                                    </td>
                                    <td style={{ textAlign: 'right', color: 'var(--text-muted)', fontSize: '0.75rem', fontWeight: 800 }}>
                                        {problem.status === 'Done' ? 'DONE' : 'PENDING'}
                                    </td>
                                    {!previewOnly && (
                                        <td style={{ textAlign: 'center' }}>
                                            <button onClick={(e) => { e.stopPropagation(); deleteProblem(problem.id); }} style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--text-muted)', padding: '4px' }}><Trash2 size={16} /></button>
                                        </td>
                                    )}
                                </motion.tr>
                            ))}
                        </AnimatePresence>
                    </motion.tbody>
                </table>
            </div>

            <div className="dsa-mobile-cards">
                <AnimatePresence mode="popLayout">
                    {(displayProblems || []).map((problem) => (
                        <motion.div layout variants={item} key={problem.id} className="dsa-mobile-card">
                            <input
                                type="checkbox"
                                className="custom-checkbox"
                                checked={problem.status === "Done"}
                                onChange={() => toggleStatus(problem.id)}
                                style={{ marginTop: '0.2rem' }}
                            />
                            <div className="card-content">
                                <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: '0.5rem' }}>
                                    {problem.platform === 'LeetCode' ? (
                                        <a href={getLeetCodeUrl(problem.name)} target="_blank" rel="noopener noreferrer" style={{ fontWeight: 700, color: 'var(--text-primary)', textDecoration: 'none', fontSize: '0.95rem', lineHeight: 1.3 }}>
                                            {problem.number ? `${problem.number}. ` : ''}{problem.name}
                                            <ExternalLink size={10} style={{ marginLeft: 4, opacity: 0.5 }} />
                                        </a>
                                    ) : (
                                        <span style={{ fontWeight: 700, color: 'var(--text-primary)', fontSize: '0.95rem', lineHeight: 1.3 }}>
                                            {problem.number ? `${problem.number}. ` : ''}{problem.name}
                                        </span>
                                    )}
                                    {!previewOnly && (
                                        <button onClick={() => deleteProblem(problem.id)} style={{ background: 'none', border: 'none', color: 'var(--text-muted)', padding: '2px' }}>
                                            <Trash2 size={14} />
                                        </button>
                                    )}
                                </div>
                                <div className="card-meta" style={{ marginTop: '0.4rem' }}>
                                    <span className={`tag ${problem.difficulty ? problem.difficulty.toLowerCase() : 'medium'}`} style={{ fontSize: '0.55rem', padding: '1px 6px' }}>
                                        {problem.difficulty}
                                    </span>
                                </div>
                            </div>
                        </motion.div>
                    ))}
                </AnimatePresence>
            </div>

            {(!displayProblems || displayProblems.length === 0) && (
                <div style={{ textAlign: 'center', padding: '4rem' }}>
                    <Sparkles size={32} style={{ marginBottom: '1rem', opacity: 0.1, margin: '0 auto' }} />
                    <p style={{ color: 'var(--text-muted)', fontWeight: 600 }}>No problems tracked yet.</p>
                </div>
            )}
        </div>
    );
}
