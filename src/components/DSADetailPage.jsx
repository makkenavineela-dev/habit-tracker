import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, PlusCircle } from 'lucide-react';
import DSATracker from './DSATracker';
import { formatDate } from '../utils/dateUtils';
import leetcodeData from '../utils/leetcode.json';

export default function DSADetailPage({ problems, setProblems, onHaptic }) {
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

        const newProblem = {
            id: Date.now(),
            number: problemNumStr,
            name: apiData ? apiData.title : `Unknown Problem #${problemNumStr}`,
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
            <header className="dashboard-header" style={{ marginBottom: '0.5rem' }}>
                <div className="title-area">
                    <h1 style={{ display: 'flex', alignItems: 'center', cursor: 'pointer', transition: 'opacity 0.2s', color: 'var(--text-primary)' }}
                        onClick={() => navigate('/')}
                        onMouseOver={e => e.currentTarget.style.opacity = 0.7}
                        onMouseOut={e => e.currentTarget.style.opacity = 1}>
                        <ArrowLeft size={24} style={{ marginRight: '0.5rem', color: 'var(--text-muted)' }} />
                        DSA Log & Archive
                    </h1>
                    <p>Add completed questions. Title and difficulty fetch automatically based on LeetCode #.</p>
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
                            padding: '0.75rem 1.5rem', background: 'var(--text-primary)', color: 'white',
                            border: 'none', borderRadius: 'var(--radius-sm)', cursor: 'pointer', fontWeight: 600, height: '44px'
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
