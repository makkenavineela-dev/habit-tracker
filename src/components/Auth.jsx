import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { supabase } from '../lib/supabase';
import { Mail, Lock, UserPlus, LogIn, Sparkles, AlertCircle } from 'lucide-react';

export default function Auth() {
    const [loading, setLoading] = useState(false);
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [isSignUp, setIsSignUp] = useState(false);
    const [mode, setMode] = useState('login'); // 'login', 'signup', 'forgot'
    const [error, setError] = useState(null);
    const [message, setMessage] = useState(null);

    const handleAuth = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError(null);
        setMessage(null);

        try {
            if (mode === 'signup') {
                const { error } = await supabase.auth.signUp({ email, password });
                if (error) throw error;
                setMessage('Verification email sent! Please check your inbox.');
            } else if (mode === 'login') {
                const { error } = await supabase.auth.signInWithPassword({ email, password });
                if (error) throw error;
            } else if (mode === 'forgot') {
                const { error } = await supabase.auth.resetPasswordForEmail(email, {
                    redirectTo: window.location.origin
                });
                if (error) throw error;
                setMessage('Password reset link sent to your email.');
            }
        } catch (err) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="auth-container" style={{
            minHeight: '100vh',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            padding: '2rem'
        }}>
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="card auth-card"
                style={{
                    maxWidth: '400px',
                    width: '100%',
                    padding: '3rem',
                    textAlign: 'center'
                }}
            >
                <div style={{
                    width: '60px', height: '60px', background: 'var(--accent-sage-dark)',
                    borderRadius: '20px', display: 'flex', alignItems: 'center',
                    justifyContent: 'center', color: 'white', margin: '0 auto 1.5rem',
                    boxShadow: '0 10px 20px rgba(107, 130, 104, 0.2)'
                }}>
                    <Sparkles size={30} />
                </div>

                <h1 className="text-gradient" style={{ fontSize: '2rem', marginBottom: '0.5rem' }}>Ritual Flow</h1>
                <p style={{ color: 'var(--text-secondary)', marginBottom: '2.5rem', fontWeight: 500 }}>
                    {mode === 'signup' ? 'Create your sacred space.' :
                        mode === 'forgot' ? 'Enter your email to reset password.' :
                            'Welcome back to your ritual.'}
                </p>

                <form onSubmit={handleAuth} style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
                    <div style={{ position: 'relative' }}>
                        <Mail size={18} style={{ position: 'absolute', left: '1rem', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
                        <input
                            type="email"
                            placeholder="Email Address"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            required
                            style={{
                                width: '100%', padding: '1rem 1rem 1rem 3rem', borderRadius: 'var(--radius-sm)',
                                border: '1px solid var(--border-color)', outline: 'none', background: 'var(--bg-secondary)',
                                fontWeight: 500
                            }}
                        />
                    </div>

                    {mode !== 'forgot' && (
                        <div style={{ position: 'relative' }}>
                            <Lock size={18} style={{ position: 'absolute', left: '1rem', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
                            <input
                                type="password"
                                placeholder="Password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                required
                                style={{
                                    width: '100%', padding: '1rem 1rem 1rem 3rem', borderRadius: 'var(--radius-sm)',
                                    border: '1px solid var(--border-color)', outline: 'none', background: 'var(--bg-secondary)',
                                    fontWeight: 500
                                }}
                            />
                        </div>
                    )}

                    {mode === 'login' && (
                        <div style={{ textAlign: 'right', marginTop: '-0.5rem' }}>
                            <button
                                type="button"
                                onClick={() => setMode('forgot')}
                                style={{ background: 'none', border: 'none', color: 'var(--text-muted)', fontSize: '0.8rem', cursor: 'pointer', fontWeight: 600 }}
                            >
                                Forgot Password?
                            </button>
                        </div>
                    )}

                    <AnimatePresence>
                        {error && (
                            <motion.div
                                initial={{ opacity: 0, height: 0 }}
                                animate={{ opacity: 1, height: 'auto' }}
                                style={{ color: 'var(--tag-red-text)', fontSize: '0.85rem', fontWeight: 600, display: 'flex', alignItems: 'center', gap: '0.5rem', justifyContent: 'center' }}
                            >
                                <AlertCircle size={14} /> {error}
                            </motion.div>
                        )}
                        {message && (
                            <motion.div
                                initial={{ opacity: 0, height: 0 }}
                                animate={{ opacity: 1, height: 'auto' }}
                                style={{ color: 'var(--tag-green-text)', fontSize: '0.85rem', fontWeight: 600, display: 'flex', alignItems: 'center', gap: '0.5rem', justifyContent: 'center' }}
                            >
                                <CheckCircle size={14} /> {message}
                            </motion.div>
                        )}
                    </AnimatePresence>

                    <motion.button
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        disabled={loading}
                        style={{
                            background: 'var(--accent-sage-dark)', color: 'white', border: 'none',
                            padding: '1.1rem', borderRadius: 'var(--radius-sm)', fontWeight: 800,
                            cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center',
                            gap: '0.75rem', marginTop: '0.5rem', transition: 'all 0.3s',
                            opacity: loading ? 0.7 : 1
                        }}
                    >
                        {loading ? 'Processing...' :
                            mode === 'signup' ? <UserPlus size={18} /> :
                                mode === 'forgot' ? <Mail size={18} /> :
                                    <LogIn size={18} />}
                        {mode === 'signup' ? 'Create Account' :
                            mode === 'forgot' ? 'Send Reset Link' :
                                'Login'}
                    </motion.button>
                </form>

                <p style={{ marginTop: '2rem', fontSize: '0.9rem', color: 'var(--text-secondary)' }}>
                    {mode === 'signup' ? 'Already have an account?' :
                        mode === 'forgot' ? 'Remembered your password?' :
                            'New to Ritual Flow?'} {' '}
                    <button
                        onClick={() => {
                            if (mode === 'signup' || mode === 'forgot') setMode('login');
                            else setMode('signup');
                        }}
                        style={{
                            background: 'none', border: 'none', color: 'var(--accent-sage-dark)',
                            fontWeight: 800, cursor: 'pointer', textDecoration: 'underline'
                        }}
                    >
                        {mode === 'signup' || mode === 'forgot' ? 'Login instead' : 'Create Account'}
                    </button>
                </p>
            </motion.div>
        </div>
    );
}
