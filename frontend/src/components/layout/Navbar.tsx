import { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Menu, X, Camera, MessageCircle } from 'lucide-react';

const navLinks = [
    { path: '/', label: 'Home' },
    { path: '/gallery', label: 'Gallery' },
    { path: '/services', label: 'Services' },
    { path: '/frames', label: 'Frames' },
    { path: '/order', label: 'Order' },
    { path: '/contact', label: 'Contact' },
];

const Navbar = () => {
    const [isScrolled, setIsScrolled] = useState(false);
    const [isMobileOpen, setIsMobileOpen] = useState(false);
    const location = useLocation();

    useEffect(() => {
        const onScroll = () => setIsScrolled(window.scrollY > 50);
        window.addEventListener('scroll', onScroll);
        return () => window.removeEventListener('scroll', onScroll);
    }, []);

    useEffect(() => setIsMobileOpen(false), [location.pathname]);

    return (
        <>
            <motion.nav
                initial={{ y: -80 }}
                animate={{ y: 0 }}
                transition={{ duration: 0.6, ease: 'easeOut' }}
                className="fixed top-0 left-0 right-0 z-50 transition-all duration-300"
                style={{
                    background: isScrolled ? 'rgba(10,10,15,0.92)' : 'transparent',
                    backdropFilter: isScrolled ? 'blur(20px)' : 'none',
                    borderBottom: isScrolled ? '1px solid rgba(212,175,55,0.15)' : 'none',
                }}
            >
                <div className="max-w-7xl mx-auto px-4 h-16 flex items-center justify-between">
                    {/* Logo */}
                    <Link to="/">
                        <motion.div whileHover={{ scale: 1.03 }} className="flex items-center gap-2">
                            <div className="w-8 h-8 rounded-lg flex items-center justify-center font-cinzel font-black text-sm" style={{ background: 'var(--gradient-primary)', color: '#000' }}>SV</div>
                            <div>
                                <div className="font-cinzel font-black text-sm leading-none gradient-text">SKETCH_VIBES23</div>
                                <div className="text-xs leading-none" style={{ color: 'var(--text-secondary)' }}>Artist Saran</div>
                            </div>
                        </motion.div>
                    </Link>

                    {/* Desktop links */}
                    <div className="hidden md:flex items-center gap-6">
                        {navLinks.map((link) => (
                            <Link key={link.path} to={link.path}>
                                <motion.span
                                    whileHover={{ y: -1 }}
                                    className="text-sm font-medium transition-colors duration-200 relative"
                                    style={{ color: location.pathname === link.path ? 'var(--gold)' : 'var(--text-secondary)' }}
                                >
                                    {link.label}
                                    {location.pathname === link.path && (
                                        <motion.div
                                            layoutId="nav-underline"
                                            className="absolute -bottom-1 left-0 right-0 h-px"
                                            style={{ background: 'var(--gradient-primary)' }}
                                        />
                                    )}
                                </motion.span>
                            </Link>
                        ))}
                    </div>

                    {/* Right actions */}
                    <div className="hidden md:flex items-center gap-3">
                        <a href="https://wa.me/917806906030" target="_blank" rel="noopener noreferrer">
                            <motion.button
                                whileHover={{ scale: 1.05 }}
                                className="flex items-center gap-1.5 px-4 py-2 rounded-full text-xs font-semibold"
                                style={{ background: '#25D366', color: '#fff' }}
                            >
                                <MessageCircle size={14} /> WhatsApp
                            </motion.button>
                        </a>
                        <a href="https://instagram.com/Sketch_vibes23" target="_blank" rel="noopener noreferrer">
                            <motion.button
                                whileHover={{ scale: 1.05 }}
                                className="flex items-center gap-1.5 px-4 py-2 rounded-full text-xs font-semibold"
                                style={{ background: 'linear-gradient(45deg,#f09433,#dc2743,#bc1888)', color: '#fff' }}
                            >
                                <Camera size={14} />
                            </motion.button>
                        </a>
                        <Link to="/order">
                            <motion.button
                                whileHover={{ scale: 1.05 }}
                                className="btn-gold px-5 py-2 rounded-full text-xs font-bold tracking-wider"
                            >
                                Order Now
                            </motion.button>
                        </Link>
                    </div>

                    {/* Mobile menu toggle */}
                    <button
                        className="md:hidden p-2 rounded-lg"
                        style={{ color: 'var(--gold)' }}
                        onClick={() => setIsMobileOpen(!isMobileOpen)}
                    >
                        {isMobileOpen ? <X size={22} /> : <Menu size={22} />}
                    </button>
                </div>
            </motion.nav>

            {/* Mobile menu */}
            <AnimatePresence>
                {isMobileOpen && (
                    <motion.div
                        initial={{ opacity: 0, y: -20 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -20 }}
                        transition={{ duration: 0.25 }}
                        className="fixed top-16 left-0 right-0 z-40 p-4"
                        style={{ background: 'rgba(10,10,15,0.97)', backdropFilter: 'blur(20px)', borderBottom: '1px solid rgba(212,175,55,0.15)' }}
                    >
                        <div className="flex flex-col gap-1 mb-4">
                            {navLinks.map((link) => (
                                <Link key={link.path} to={link.path}>
                                    <div
                                        className="px-4 py-3 rounded-xl font-medium text-sm"
                                        style={{
                                            color: location.pathname === link.path ? 'var(--gold)' : 'var(--text-secondary)',
                                            background: location.pathname === link.path ? 'rgba(212,175,55,0.08)' : 'transparent',
                                        }}
                                    >
                                        {link.label}
                                    </div>
                                </Link>
                            ))}
                        </div>
                        <div className="flex gap-3 pt-3" style={{ borderTop: '1px solid rgba(212,175,55,0.1)' }}>
                            <a href="https://wa.me/917806906030" target="_blank" rel="noopener noreferrer" className="flex-1">
                                <button className="w-full py-2.5 rounded-xl text-xs font-semibold flex items-center justify-center gap-1.5" style={{ background: '#25D366', color: '#fff' }}>
                                    <MessageCircle size={14} /> WhatsApp
                                </button>
                            </a>
                            <Link to="/order" className="flex-1">
                                <button className="w-full btn-gold py-2.5 rounded-xl text-xs font-bold">Order Now</button>
                            </Link>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </>
    );
};

export default Navbar;
