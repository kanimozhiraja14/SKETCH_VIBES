import { useEffect, useRef, useState, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Camera, MessageCircle, Eye, ShoppingBag, Sparkles } from 'lucide-react';
import { Link } from 'react-router-dom';

interface Particle {
    id: number;
    x: number;
    y: number;
    size: number;
    opacity: number;
    speed: number;
    drift: number;
}

const PARTICLE_COUNT = 30;

const HeroSection = () => {
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const animationRef = useRef<number>(0);
    const particlesRef = useRef<Particle[]>([]);
    const mouseRef = useRef({ x: 0, y: 0 });
    const [titleVisible, setTitleVisible] = useState(false);

    // Random art symbols for floating particles
    const artSymbols = ['✦', '◆', '✧', '◇', '✦', '⬡', '✦'];

    const initParticles = useCallback(() => {
        particlesRef.current = Array.from({ length: PARTICLE_COUNT }, (_, i) => ({
            id: i,
            x: Math.random() * window.innerWidth,
            y: Math.random() * window.innerHeight,
            size: Math.random() * 3 + 1,
            opacity: Math.random() * 0.6 + 0.2,
            speed: Math.random() * 0.5 + 0.1,
            drift: (Math.random() - 0.5) * 0.3,
        }));
    }, []);

    useEffect(() => {
        const canvas = canvasRef.current;
        if (!canvas) return;
        const ctx = canvas.getContext('2d');
        if (!ctx) return;

        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;
        initParticles();

        const handleResize = () => {
            canvas.width = window.innerWidth;
            canvas.height = window.innerHeight;
        };

        const handleMouse = (e: MouseEvent) => {
            mouseRef.current = { x: e.clientX, y: e.clientY };
        };

        window.addEventListener('resize', handleResize);
        window.addEventListener('mousemove', handleMouse);

        const animate = () => {
            ctx.clearRect(0, 0, canvas.width, canvas.height);
            particlesRef.current.forEach((p) => {
                const dx = mouseRef.current.x - p.x;
                const dy = mouseRef.current.y - p.y;
                const dist = Math.sqrt(dx * dx + dy * dy);
                const repel = dist < 100 ? (100 - dist) / 100 : 0;

                p.y -= p.speed + repel * 2;
                p.x += p.drift;
                if (p.y < -10) { p.y = canvas.height + 10; p.x = Math.random() * canvas.width; }
                if (p.x < -10) p.x = canvas.width;
                if (p.x > canvas.width + 10) p.x = 0;

                const grd = ctx.createRadialGradient(p.x, p.y, 0, p.x, p.y, p.size * 3);
                grd.addColorStop(0, `rgba(212,175,55,${p.opacity})`);
                grd.addColorStop(1, 'rgba(212,175,55,0)');
                ctx.fillStyle = grd;
                ctx.beginPath();
                ctx.arc(p.x, p.y, p.size * 3, 0, Math.PI * 2);
                ctx.fill();
            });
            animationRef.current = requestAnimationFrame(animate);
        };

        animate();
        setTimeout(() => setTitleVisible(true), 300);

        return () => {
            window.removeEventListener('resize', handleResize);
            window.removeEventListener('mousemove', handleMouse);
            cancelAnimationFrame(animationRef.current);
        };
    }, [initParticles]);

    const containerVariants = {
        hidden: { opacity: 0 },
        visible: { opacity: 1, transition: { staggerChildren: 0.2 } },
    };

    const itemVariants = {
        hidden: { opacity: 0, y: 40 },
        visible: { opacity: 1, y: 0, transition: { duration: 0.8, ease: 'easeOut' } },
    };

    return (
        <section className="relative min-h-screen flex items-center justify-center overflow-hidden" style={{ background: 'var(--gradient-hero)' }}>
            {/* Animated canvas background */}
            <canvas ref={canvasRef} className="absolute inset-0 pointer-events-none" style={{ zIndex: 0 }} />

            {/* Radial gradient overlay */}
            <div className="absolute inset-0" style={{
                background: 'radial-gradient(ellipse at 50% 50%, rgba(212,175,55,0.08) 0%, transparent 70%)',
                zIndex: 1,
            }} />

            {/* Brush stroke decorations */}
            <div className="absolute top-20 right-10 opacity-10" style={{ zIndex: 1 }}>
                <motion.div
                    animate={{ rotate: [0, 360] }}
                    transition={{ duration: 30, repeat: Infinity, ease: 'linear' }}
                    className="w-64 h-64 rounded-full"
                    style={{ border: '2px solid rgba(212,175,55,0.5)', borderStyle: 'dashed' }}
                />
            </div>
            <div className="absolute bottom-20 left-10 opacity-10" style={{ zIndex: 1 }}>
                <motion.div
                    animate={{ rotate: [360, 0] }}
                    transition={{ duration: 40, repeat: Infinity, ease: 'linear' }}
                    className="w-48 h-48 rounded-full"
                    style={{ border: '1px solid rgba(212,175,55,0.5)', borderStyle: 'dashed' }}
                />
            </div>

            {/* Glowing lines */}
            <div className="absolute inset-0 overflow-hidden" style={{ zIndex: 1 }}>
                {[...Array(3)].map((_, i) => (
                    <motion.div
                        key={i}
                        className="absolute h-px w-full"
                        style={{
                            top: `${25 + i * 25}%`,
                            background: 'linear-gradient(90deg, transparent, rgba(212,175,55,0.15), transparent)',
                        }}
                        animate={{ x: ['-100%', '100%'] }}
                        transition={{ duration: 8 + i * 2, repeat: Infinity, ease: 'linear', delay: i * 2 }}
                    />
                ))}
            </div>

            {/* Main content */}
            <div className="relative z-10 text-center px-4 max-w-5xl mx-auto">
                <AnimatePresence>
                    {titleVisible && (
                        <motion.div variants={containerVariants} initial="hidden" animate="visible">
                            {/* Brand badge */}
                            <motion.div variants={itemVariants} className="flex justify-center mb-6">
                                <span className="glass-gold px-4 py-2 rounded-full text-xs font-medium tracking-widest uppercase" style={{ color: 'var(--gold)', letterSpacing: '0.3em' }}>
                                    ✦ Premium Artist Portfolio ✦
                                </span>
                            </motion.div>

                            {/* Main title */}
                            <motion.h1
                                variants={itemVariants}
                                className="font-cinzel font-black text-6xl md:text-8xl lg:text-9xl mb-4 leading-none"
                                style={{ letterSpacing: '-0.02em' }}
                            >
                                <span className="gradient-text">SKETCH</span>
                                <br />
                                <span style={{ color: 'var(--text-primary)' }}>VIBES</span>
                                <span className="gradient-text">23</span>
                            </motion.h1>

                            {/* Artist name */}
                            <motion.p
                                variants={itemVariants}
                                className="font-cinzel text-xl md:text-2xl mb-2 tracking-widest uppercase"
                                style={{ color: 'var(--gold)', letterSpacing: '0.5em' }}
                            >
                                Artist Saran
                            </motion.p>

                            {/* Subtitle */}
                            <motion.p
                                variants={itemVariants}
                                className="text-sm md:text-base mb-2 tracking-widest uppercase"
                                style={{ color: 'var(--text-secondary)', letterSpacing: '0.25em' }}
                            >
                                Professional Drawing Artist | Custom Photo Frames
                            </motion.p>

                            {/* Tagline */}
                            <motion.p
                                variants={itemVariants}
                                className="font-playfair text-xl md:text-2xl italic mb-10"
                                style={{ color: 'var(--gold-light)' }}
                            >
                                "Turning Memories into Timeless Art."
                            </motion.p>

                            {/* Decorative line */}
                            <motion.div variants={itemVariants} className="flex justify-center items-center gap-4 mb-10">
                                <div className="h-px w-24" style={{ background: 'var(--gradient-primary)' }} />
                                <span style={{ color: 'var(--gold)' }}>✦</span>
                                <div className="h-px w-24" style={{ background: 'var(--gradient-primary)' }} />
                            </motion.div>

                            {/* CTA Buttons */}
                            <motion.div variants={itemVariants} className="flex flex-wrap gap-4 justify-center">
                                <Link to="/gallery">
                                    <motion.button
                                        whileHover={{ scale: 1.05, y: -2 }}
                                        whileTap={{ scale: 0.98 }}
                                        className="btn-gold flex items-center gap-2 px-8 py-4 rounded-full text-sm font-bold tracking-wider uppercase"
                                    >
                                        <Eye size={16} />
                                        View Gallery
                                    </motion.button>
                                </Link>

                                <Link to="/order">
                                    <motion.button
                                        whileHover={{ scale: 1.05, y: -2 }}
                                        whileTap={{ scale: 0.98 }}
                                        className="btn-outline-gold flex items-center gap-2 px-8 py-4 rounded-full text-sm font-bold tracking-wider uppercase"
                                        style={{ color: 'var(--gold)', border: '1px solid var(--gold)' }}
                                    >
                                        <ShoppingBag size={16} />
                                        Order Now
                                    </motion.button>
                                </Link>

                                <a href="https://wa.me/917806906030" target="_blank" rel="noopener noreferrer">
                                    <motion.button
                                        whileHover={{ scale: 1.05, y: -2 }}
                                        whileTap={{ scale: 0.98 }}
                                        className="flex items-center gap-2 px-8 py-4 rounded-full text-sm font-bold tracking-wider uppercase transition-all"
                                        style={{ background: '#25D366', color: '#fff', border: 'none', cursor: 'pointer' }}
                                    >
                                        <MessageCircle size={16} />
                                        WhatsApp
                                    </motion.button>
                                </a>

                                <a href="https://instagram.com/Sketch_vibes23" target="_blank" rel="noopener noreferrer">
                                    <motion.button
                                        whileHover={{ scale: 1.05, y: -2 }}
                                        whileTap={{ scale: 0.98 }}
                                        className="flex items-center gap-2 px-8 py-4 rounded-full text-sm font-bold tracking-wider uppercase transition-all"
                                        style={{ background: 'linear-gradient(45deg, #f09433, #e6683c, #dc2743, #cc2366, #bc1888)', color: '#fff', border: 'none', cursor: 'pointer' }}
                                    >
                                        <Camera size={16} />
                                        Camera
                                    </motion.button>
                                </a>
                            </motion.div>

                            {/* Stats */}
                            <motion.div variants={itemVariants} className="flex flex-wrap justify-center gap-8 mt-16">
                                {[
                                    { value: '500+', label: 'Artworks Created' },
                                    { value: '12+', label: 'Art Styles' },
                                    { value: '5★', label: 'Customer Rating' },
                                    { value: '100%', label: 'Handmade' },
                                ].map((stat) => (
                                    <div key={stat.label} className="text-center">
                                        <div className="font-cinzel text-2xl font-bold gradient-text">{stat.value}</div>
                                        <div className="text-xs mt-1 uppercase tracking-wider" style={{ color: 'var(--text-secondary)' }}>{stat.label}</div>
                                    </div>
                                ))}
                            </motion.div>
                        </motion.div>
                    )}
                </AnimatePresence>
            </div>

            {/* Scroll indicator */}
            <motion.div
                className="absolute bottom-8 left-1/2 -translate-x-1/2"
                animate={{ y: [0, 10, 0] }}
                transition={{ duration: 2, repeat: Infinity }}
                style={{ zIndex: 10 }}
            >
                <div className="flex flex-col items-center gap-2" style={{ color: 'var(--gold)' }}>
                    <span className="text-xs tracking-widest uppercase" style={{ color: 'var(--text-secondary)' }}>Scroll</span>
                    <div className="w-px h-8" style={{ background: 'var(--gradient-primary)' }} />
                </div>
            </motion.div>
        </section>
    );
};

export default HeroSection;
