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
                whileHover={{ scale: 1.1, rotate: 90 }}
                whileTap={{ scale: 0.9 }}
                onClick={onClose}
                style={{ position: 'absolute', top: '3rem', right: '3rem', border: 'none', background: 'var(--bg-tertiary)', padding: '1rem', borderRadius: '50%', cursor: 'pointer', color: 'var(--text-muted)', display: 'flex' }}
            >
                <X size={24} />
            </motion.button>

            <div style={{ textAlign: 'center', marginBottom: '4rem' }}>
                <span style={{ letterSpacing: '0.4em', textTransform: 'uppercase', fontSize: '0.85rem', color: 'var(--accent-sage-dark)', fontWeight: 800 }}>
                    {isActive ? 'Deep Focus' : 'Paused Moment'}
                </span>
            </div>

            {/* Timer Circle */}
            <div style={{ position: 'relative', width: '340px', height: '340px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <svg width="340" height="340" style={{ transform: 'rotate(-90deg)' }}>
                    <circle
                        cx="170" cy="170" r="160"
                        stroke="var(--bg-tertiary)" strokeWidth="4" fill="none"
                        strokeOpacity="0.5"
                    />
                    <motion.circle
                        cx="170" cy="170" r="160"
                        stroke="var(--accent-sage-dark)" strokeWidth="8" fill="none"
                        strokeDasharray="1005"
                        animate={{ strokeDashoffset: 1005 - (1005 * (timeLeft / totalTime)) }}
                        transition={{ ease: "linear", duration: 0.5 }}
                        strokeLinecap="round"
                    />
                </svg>
                <div style={{ position: 'absolute', textAlign: 'center' }}>
                    <motion.h1
                        key={formatTime(timeLeft)}
                        initial={{ scale: 0.9, opacity: 0.8 }}
                        animate={{ scale: 1, opacity: 1 }}
                        style={{ fontSize: '6rem', fontWeight: 300, margin: 0, letterSpacing: '-0.05em', color: 'var(--text-primary)' }}
                    >
                        {formatTime(timeLeft)}
                    </motion.h1>
                </div>
            </div>

            {/* Controls */}
            <div style={{ display: 'flex', gap: '2.5rem', marginTop: '5rem', alignItems: 'center' }}>
                <motion.button
                    whileTap={{ scale: 0.9 }}
                    onClick={reset}
                    title="Reset Timer"
                    style={{ border: 'none', background: 'var(--bg-tertiary)', color: 'var(--text-secondary)', width: '64px', height: '64px', borderRadius: '50%', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}
                >
                    <RotateCcw size={24} />
                </motion.button>

                <motion.button
                    whileHover={{ scale: 1.05, boxShadow: '0 25px 40px rgba(91, 115, 88, 0.25)' }}
                    whileTap={{ scale: 0.95 }}
                    onClick={toggle}
                    style={{ border: 'none', background: 'var(--accent-sage-dark)', color: 'white', width: '100px', height: '100px', borderRadius: '50%', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: '0 15px 30px rgba(91, 115, 88, 0.2)' }}
                >
                    {isActive ? <Pause size={44} fill="white" /> : <Play size={44} fill="white" style={{ marginLeft: '6px' }} />}
                </motion.button>

                {/* Ambient Selection */}
                <div style={{ display: 'flex', gap: '0.75rem', background: 'var(--bg-tertiary)', padding: '0.5rem', borderRadius: '25px' }}>
                    {[
                        { id: 'wind', icon: <Wind size={22} />, label: 'Breeze' },
                        { id: 'waves', icon: <Waves size={22} />, label: 'Ocean' },
                        { id: 'birds', icon: <Trees size={22} />, label: 'Forest' }
                    ].map(a => (
                        <motion.button
                            key={a.id}
                            whileHover={{ scale: 1.1 }}
                            whileTap={{ scale: 0.9 }}
                            onClick={() => {
                                const newAmbient = ambient === a.id ? null : a.id;
                                setAmbient(newAmbient);
                            }}
                            style={{
                                border: 'none',
                                background: ambient === a.id ? 'white' : 'transparent',
                                color: ambient === a.id ? 'var(--accent-sage-dark)' : 'var(--text-muted)',
                                width: '50px', height: '50px', borderRadius: '18px', cursor: 'pointer',
                                display: 'flex', alignItems: 'center', justifyContent: 'center',
                                boxShadow: ambient === a.id ? 'var(--shadow-sm)' : 'none'
                            }}
                            title={a.label}
                        >
                            {a.icon}
                        </motion.button>
                    ))}
                </div>
            </div>

            {/* Mode Selection */}
            <div style={{ display: 'flex', background: 'var(--bg-tertiary)', padding: '0.6rem', borderRadius: '100px', gap: '0.6rem', marginTop: '4rem', boxShadow: 'inset 0 2px 10px rgba(0,0,0,0.03)' }}>
                {[
                    { id: 'short', label: 'Breathe (5m)', time: 5 * 60 },
                    { id: 'focus', label: 'Zen Focus (25m)', time: 25 * 60 },
                    { id: 'long', label: 'Deep Work (50m)', time: 50 * 60 }
                ].map(m => (
                    <button
                        key={m.id}
                        onClick={() => { setMode(m.id); setTimeLeft(m.time); setIsActive(false); }}
                        style={{
                            border: 'none',
                            background: mode === m.id ? 'var(--bg-card)' : 'transparent',
                            color: mode === m.id ? 'var(--accent-sage-dark)' : 'var(--text-muted)',
                            padding: '1rem 2rem', borderRadius: '100px', cursor: 'pointer',
                            fontSize: '0.95rem', fontWeight: 800, transition: 'all 0.4s cubic-bezier(0.16, 1, 0.3, 1)',
                            boxShadow: mode === m.id ? 'var(--shadow-sm)' : 'none'
                        }}
                    >
                        {m.label}
                    </button>
                ))}
            </div>

            <div style={{ marginTop: '3rem', color: 'var(--text-muted)', fontSize: '0.85rem', fontWeight: 600, letterSpacing: '0.1em', opacity: 0.5 }}>
                SINK INTO THE FLOW
            </div>
        </motion.div>
    );
}
