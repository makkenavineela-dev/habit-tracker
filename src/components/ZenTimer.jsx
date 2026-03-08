import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Play, Pause, RotateCcw, X, Wind, Waves, Trees } from 'lucide-react';

export default function ZenTimer({ onClose }) {
    const [timeLeft, setTimeLeft] = useState(25 * 60);
    const [isActive, setIsActive] = useState(false);
    const [mode, setMode] = useState('focus'); // focus, short, long
    const [ambient, setAmbient] = useState(null); // wind, waves, birds
    const audioRef = React.useRef(null);

    const ambientSounds = {
        wind: 'https://assets.mixkit.co/sfx/preview/mixkit-wind-howl-at-the-window-1166.mp3',
        waves: 'https://assets.mixkit.co/sfx/preview/mixkit-sea-waves-loop-1191.mp3',
        birds: 'https://assets.mixkit.co/sfx/preview/mixkit-forest-birds-ambience-1210.mp3'
    };

    // Audio Playback Logic
    useEffect(() => {
        if (isActive && ambient && audioRef.current) {
            audioRef.current.play().catch(e => console.log("Audio play blocked", e));
        } else if (audioRef.current) {
            audioRef.current.pause();
        }
    }, [isActive, ambient]);

    // Timer Logic
    useEffect(() => {
        let interval = null;
        if (isActive && timeLeft > 0) {
            interval = setInterval(() => {
                setTimeLeft((prev) => prev - 1);
            }, 1000);
        } else if (timeLeft === 0) {
            clearInterval(interval);
            setIsActive(false);
            if (audioRef.current) audioRef.current.pause();
            // In a real app, we'd fire a notification here
            if ('Notification' in window && Notification.permission === 'granted') {
                new Notification('Focus Session Complete!', { body: 'Time to take a breath.' });
            }
        }
        return () => clearInterval(interval);
    }, [isActive, timeLeft]);

    const toggle = () => setIsActive(!isActive);
    const reset = () => {
        setIsActive(false);
        if (audioRef.current) audioRef.current.pause();
        setTimeLeft(mode === 'focus' ? 25 * 60 : mode === 'short' ? 5 * 60 : 50 * 60);
    };

    const formatTime = (seconds) => {
        const mins = Math.floor(seconds / 60);
        const secs = seconds % 60;
        return `${mins}:${secs.toString().padStart(2, '0')}`;
    };

    const totalTime = mode === 'focus' ? 25 * 60 : mode === 'short' ? 5 * 60 : 50 * 60;

    return (
        <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            style={{
                position: 'fixed', top: 0, left: 0, right: 0, bottom: 0,
                zIndex: 2000, background: 'rgba(253, 253, 252, 0.98)',
                backdropFilter: 'blur(30px)', display: 'flex', flexDirection: 'column',
                alignItems: 'center', justifyContent: 'center',
                fontFamily: "'Outfit', sans-serif"
            }}
        >
            <audio ref={audioRef} src={ambient ? ambientSounds[ambient] : ''} loop />
            {/* Background Zen Decoration */}
            <motion.div
                animate={{
                    scale: [1, 1.1, 1],
                    opacity: [0.3, 0.5, 0.3]
                }}
                transition={{ duration: 10, repeat: Infinity }}
                style={{
                    position: 'absolute', width: '600px', height: '600px',
                    borderRadius: '50%', background: 'radial-gradient(circle, var(--accent-sage-light) 0%, transparent 70%)',
                    zIndex: -1, filter: 'blur(60px)'
                }}
            />

            <motion.button
                whileTap={{ scale: 0.9 }}
                onClick={onClose}
                style={{ position: 'absolute', top: '2rem', right: '1.5rem', border: 'none', background: 'var(--bg-tertiary)', padding: '0.75rem', borderRadius: '50%', cursor: 'pointer', color: 'var(--text-muted)', display: 'flex' }}
            >
                <X size={20} />
            </motion.button>

            <div style={{ textAlign: 'center', marginBottom: '2rem', marginTop: '4rem' }}>
                <span style={{ letterSpacing: '0.4em', textTransform: 'uppercase', fontSize: '0.75rem', color: 'var(--accent-sage-dark)', fontWeight: 800 }}>
                    {isActive ? 'Deep Focus' : 'Paused Moment'}
                </span>
            </div>

            {/* Timer Circle */}
            <div className="timer-circle-container" style={{ position: 'relative', width: '300px', height: '300px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <svg className="timer-svg" width="300" height="300" style={{ transform: 'rotate(-90deg)' }}>
                    <circle
                        cx="150" cy="150" r="140"
                        stroke="var(--bg-tertiary)" strokeWidth="3" fill="none"
                        strokeOpacity="0.4"
                    />
                    <motion.circle
                        cx="150" cy="150" r="140"
                        stroke="var(--accent-sage-dark)" strokeWidth="6" fill="none"
                        strokeDasharray="880"
                        animate={{ strokeDashoffset: 880 - (880 * (timeLeft / totalTime)) }}
                        transition={{ ease: "linear", duration: 0.5 }}
                        strokeLinecap="round"
                    />
                </svg>
                <div style={{ position: 'absolute', textAlign: 'center' }}>
                    <motion.h1
                        key={formatTime(timeLeft)}
                        className="timer-time-text"
                        style={{ fontSize: '5rem', fontWeight: 300, margin: 0, letterSpacing: '-0.05em', color: 'var(--text-primary)' }}
                    >
                        {formatTime(timeLeft)}
                    </motion.h1>
                </div>
            </div>

            {/* Controls */}
            <div style={{ display: 'flex', gap: '1.5rem', marginTop: '3rem', alignItems: 'center', flexWrap: 'wrap', justifyContent: 'center' }}>
                <motion.button
                    whileTap={{ scale: 0.9 }}
                    onClick={reset}
                    style={{ border: 'none', background: 'var(--bg-tertiary)', color: 'var(--text-secondary)', width: '56px', height: '56px', borderRadius: '50%', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}
                >
                    <RotateCcw size={20} />
                </motion.button>

                <motion.button
                    whileTap={{ scale: 0.95 }}
                    onClick={toggle}
                    style={{ border: 'none', background: 'var(--accent-sage-dark)', color: 'white', width: '84px', height: '84px', borderRadius: '50%', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: '0 15px 30px rgba(91, 115, 88, 0.2)' }}
                >
                    {isActive ? <Pause size={38} fill="white" /> : <Play size={38} fill="white" style={{ marginLeft: '4px' }} />}
                </motion.button>

                <div style={{ display: 'flex', gap: '0.4rem', background: 'var(--bg-tertiary)', padding: '0.4rem', borderRadius: '20px' }}>
                    {[
                        { id: 'wind', icon: <Wind size={18} /> },
                        { id: 'waves', icon: <Waves size={18} /> },
                        { id: 'birds', icon: <Trees size={18} /> }
                    ].map(a => (
                        <motion.button
                            key={a.id}
                            whileTap={{ scale: 0.9 }}
                            onClick={() => setAmbient(ambient === a.id ? null : a.id)}
                            style={{
                                border: 'none',
                                background: ambient === a.id ? 'white' : 'transparent',
                                color: ambient === a.id ? 'var(--accent-sage-dark)' : 'var(--text-muted)',
                                width: '44px', height: '44px', borderRadius: '14px', cursor: 'pointer',
                                display: 'flex', alignItems: 'center', justifyContent: 'center',
                                boxShadow: ambient === a.id ? 'var(--shadow-sm)' : 'none'
                            }}
                        >
                            {a.icon}
                        </motion.button>
                    ))}
                </div>
            </div>

            {/* Mode Selection */}
            <div className="timer-modes" style={{ marginTop: '3rem' }}>
                {[
                    { id: 'short', label: 'Breathe', time: 5 * 60 },
                    { id: 'focus', label: 'Focus', time: 25 * 60 },
                    { id: 'long', label: 'Work', time: 50 * 60 }
                ].map(m => (
                    <button
                        key={m.id}
                        className="timer-mode-btn"
                        onClick={() => { setMode(m.id); setTimeLeft(m.time); setIsActive(false); if (audioRef.current) audioRef.current.pause(); }}
                        style={{
                            border: 'none',
                            background: mode === m.id ? 'var(--bg-card)' : 'transparent',
                            color: mode === m.id ? 'var(--accent-sage-dark)' : 'var(--text-muted)',
                            padding: '0.75rem 1.25rem', borderRadius: '100px', cursor: 'pointer',
                            fontSize: '0.85rem', fontWeight: 800, transition: 'all 0.4s ease',
                            whiteSpace: 'nowrap'
                        }}
                    >
                        {m.label}
                    </button>
                ))}
            </div>

            <div style={{ marginTop: '3rem', color: 'var(--text-muted)', fontSize: '0.75rem', fontWeight: 800, letterSpacing: '0.1em', opacity: 0.5 }}>
                SINK INTO THE FLOW
            </div>
        </motion.div>
    );
}
