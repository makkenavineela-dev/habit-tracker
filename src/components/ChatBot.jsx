import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { MessageSquare, Send, X, Bot, Sparkles, User, Terminal, Trophy, Zap } from 'lucide-react';

const ChatBot = () => {
    const [isOpen, setIsOpen] = useState(false);
    const [messages, setMessages] = useState([
        { id: 1, text: "Greetings, voyager. I am the Sentinel of Flow. How can I assist your ritual today?", sender: 'bot', time: new Date() }
    ]);
    const [input, setInput] = useState('');
    const [isTyping, setIsTyping] = useState(false);
    const scrollRef = useRef(null);

    useEffect(() => {
        if (scrollRef.current) {
            scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
        }
    }, [messages, isTyping]);

    const handleSend = async () => {
        if (!input.trim()) return;

        const userMsg = { id: Date.now(), text: input, sender: 'user', time: new Date() };
        setMessages(prev => [...prev, userMsg]);
        setInput('');
        setIsTyping(true);

        // Simulate AI thinking
        setTimeout(() => {
            const botResponse = getMockResponse(input);
            const botMsg = { id: Date.now() + 1, text: botResponse, sender: 'bot', time: new Date() };
            setMessages(prev => [...prev, botMsg]);
            setIsTyping(false);
        }, 1500);
    };

    const getMockResponse = (text) => {
        const lowerText = text.toLowerCase();
        if (lowerText.includes('dsa') || lowerText.includes('coding')) {
            return "DSA is the language of efficiency. Remember to break down complex patterns into smaller sub-problems. Consistency in the Arena is key.";
        }
        if (lowerText.includes('habit') || lowerText.includes('ritual')) {
            return "Small rituals lead to massive transformations. Focus on the 1% improvement today. Your progress circle reflects your commitment.";
        }
        if (lowerText.includes('motivate') || lowerText.includes('tired')) {
            return "Even the strongest warriors need rest. If you're tired, learn to rest, not to quit. Take a 5-minute Zen session.";
        }
        if (lowerText.includes('help')) {
            return "I can help you track your habits, suggest coding strategies, or provide motivation. What's on your mind?";
        }
        return "Intriguing perspective. The flow state is achieved when challenge meets skill. Continue your ritual and seek the 1% edge.";
    };

    return (
        <>
            {/* Pulsating FAB */}
            <motion.div
                initial={{ scale: 0, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                onClick={() => setIsOpen(true)}
                style={{
                    position: 'fixed',
                    bottom: '100px',
                    right: '24px',
                    width: '56px',
                    height: '56px',
                    borderRadius: '28px',
                    background: 'var(--accent-sage)',
                    boxShadow: '0 8px 32px rgba(200, 245, 102, 0.3)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    cursor: 'pointer',
                    zIndex: 1000,
                    border: '4px solid var(--bg-primary)'
                }}
            >
                <div style={{ position: 'absolute', width: '100%', height: '100%', borderRadius: '50%', background: 'inherit', animation: 'ping 2s cubic-bezier(0, 0, 0.2, 1) infinite' }} />
                <style>{`
                    @keyframes ping {
                        75%, 100% { transform: scale(1.6); opacity: 0; }
                    }
                `}</style>
                <MessageSquare color="var(--bg-primary)" size={24} />
            </motion.div>

            {/* Chat Overlay */}
            <AnimatePresence>
                {isOpen && (
                    <motion.div
                        initial={{ opacity: 0, y: 100, scale: 0.9 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: 100, scale: 0.9 }}
                        transition={{ type: 'spring', damping: 25, stiffness: 300 }}
                        style={{
                            position: 'fixed',
                            bottom: '24px',
                            right: '24px',
                            width: 'calc(100% - 48px)',
                            maxWidth: '380px',
                            height: '600px',
                            maxHeight: 'calc(100vh - 120px)',
                            background: 'var(--bg-secondary)',
                            borderRadius: '32px',
                            border: '1px solid var(--border-glass)',
                            display: 'flex',
                            flexDirection: 'column',
                            boxShadow: '0 20px 80px rgba(0,0,0,0.6)',
                            zIndex: 1001,
                            overflow: 'hidden',
                            backdropFilter: 'blur(30px)'
                        }}
                    >
                        {/* Header */}
                        <div style={{ padding: '24px', borderBottom: '1px solid var(--border-soft)', display: 'flex', alignItems: 'center', gap: 12, background: 'rgba(255,255,255,0.02)' }}>
                            <div style={{ width: 40, height: 40, borderRadius: 12, background: 'linear-gradient(135deg, var(--accent-sage), var(--accent-sage-dark))', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                                <Bot color="var(--bg-primary)" size={20} />
                            </div>
                            <div style={{ flex: 1 }}>
                                <h3 style={{ fontSize: 16, fontFamily: "'Playfair Display', serif", margin: 0 }}>The Sentinel</h3>
                                <div style={{ fontSize: 10, color: 'var(--accent-sage)', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.04em' }}>Flow Intelligence</div>
                            </div>
                            <button onClick={() => setIsOpen(false)} style={{ background: 'var(--bg-card)', border: 'none', width: 32, height: 32, borderRadius: 8, display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', color: 'var(--text-muted)' }}>
                                <X size={18} />
                            </button>
                        </div>

                        {/* Messages */}
                        <div ref={scrollRef} style={{ flex: 1, padding: '20px', overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: 16, scrollBehavior: 'smooth' }}>
                            {messages.map((msg) => (
                                <div key={msg.id} style={{ alignSelf: msg.sender === 'user' ? 'flex-end' : 'flex-start', maxWidth: '85%' }}>
                                    <motion.div
                                        initial={{ opacity: 0, scale: 0.9, x: msg.sender === 'user' ? 20 : -20 }}
                                        animate={{ opacity: 1, scale: 1, x: 0 }}
                                        style={{
                                            padding: '12px 18px',
                                            borderRadius: msg.sender === 'user' ? '20px 4px 20px 20px' : '4px 20px 20px 20px',
                                            background: msg.sender === 'user' ? 'var(--accent-sage)' : 'var(--bg-card)',
                                            color: msg.sender === 'user' ? 'var(--bg-primary)' : 'var(--text-primary)',
                                            fontSize: 14,
                                            lineHeight: 1.5,
                                            boxShadow: msg.sender === 'user' ? '0 4px 12px rgba(200, 245, 102, 0.2)' : 'none',
                                            border: msg.sender === 'user' ? 'none' : '1px solid var(--border-soft)'
                                        }}
                                    >
                                        {msg.text}
                                    </motion.div>
                                    <div style={{ fontSize: 10, color: 'var(--text-muted)', marginTop: 4, textAlign: msg.sender === 'user' ? 'right' : 'left', opacity: 0.6 }}>
                                        {msg.sender === 'user' ? 'You' : 'Sentinel'} • {msg.time.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                    </div>
                                </div>
                            ))}
                            {isTyping && (
                                <div style={{ alignSelf: 'flex-start', background: 'var(--bg-card)', padding: '12px 18px', borderRadius: '4px 20px 20px 20px', border: '1px solid var(--border-soft)', display: 'flex', gap: 4 }}>
                                    {[0, 1, 2].map(i => (
                                        <motion.div
                                            key={i}
                                            animate={{ opacity: [0.3, 1, 0.3] }}
                                            transition={{ duration: 1, repeat: Infinity, delay: i * 0.2 }}
                                            style={{ width: 6, height: 6, borderRadius: '50%', background: 'var(--accent-sage)' }}
                                        />
                                    ))}
                                </div>
                            )}
                        </div>

                        {/* Input Area */}
                        <div style={{ padding: '24px', borderTop: '1px solid var(--border-soft)', background: 'rgba(255,255,255,0.01)' }}>
                            <div style={{ position: 'relative', display: 'flex', alignItems: 'center' }}>
                                <input
                                    type="text"
                                    value={input}
                                    onChange={(e) => setInput(e.target.value)}
                                    onKeyPress={(e) => e.key === 'Enter' && handleSend()}
                                    placeholder="Seek wisdom..."
                                    style={{
                                        width: '100%',
                                        padding: '16px 52px 16px 20px',
                                        background: 'var(--bg-card)',
                                        border: '1px solid var(--border-soft)',
                                        borderRadius: '20px',
                                        color: 'var(--text-primary)',
                                        fontSize: 14,
                                        outline: 'none',
                                        fontFamily: "'Inter', sans-serif"
                                    }}
                                />
                                <motion.button
                                    whileHover={{ scale: 1.1 }}
                                    whileTap={{ scale: 0.9 }}
                                    onClick={handleSend}
                                    style={{
                                        position: 'absolute',
                                        right: '8px',
                                        width: '40px',
                                        height: '40px',
                                        borderRadius: '14px',
                                        background: 'var(--accent-sage)',
                                        border: 'none',
                                        display: 'flex',
                                        alignItems: 'center',
                                        justifyContent: 'center',
                                        cursor: 'pointer',
                                    }}
                                >
                                    <Send size={18} color="var(--bg-primary)" />
                                </motion.button>
                            </div>
                        </div>

                        {/* Quick Actions */}
                        <div style={{ padding: '0 24px 24px', display: 'flex', gap: 8, overflowX: 'auto', whiteSpace: 'nowrap' }}>
                            {[
                                { icon: <Terminal size={12} />, label: 'DSA Strategy' },
                                { icon: <Zap size={12} />, label: 'Morning Ritual' },
                                { icon: <Trophy size={12} />, label: 'Motivate' }
                            ].map((action, i) => (
                                <button
                                    key={i}
                                    onClick={() => setInput(action.label)}
                                    style={{
                                        display: 'flex',
                                        alignItems: 'center',
                                        gap: 6,
                                        padding: '8px 14px',
                                        background: 'var(--bg-card)',
                                        border: '1px solid var(--border-soft)',
                                        borderRadius: '12px',
                                        fontSize: 11,
                                        color: 'var(--text-secondary)',
                                        cursor: 'pointer',
                                        fontWeight: 600
                                    }}
                                >
                                    {action.icon} {action.label}
                                </button>
                            ))}
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </>
    );
};

export default ChatBot;
