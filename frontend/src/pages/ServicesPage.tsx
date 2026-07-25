import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useQuery } from '@tanstack/react-query';
import { servicesAPI } from '../lib/api';
import type { Service } from '../types';
import { Calendar, MessageCircle, ArrowRight, Star, Shield, Package, Clock, Award, X } from 'lucide-react';

/* ─── Placeholder data ───────────────────────────────────────────── */
const PLACEHOLDER: Service[] = [
    { _id: '1', title: 'Canvas Painting', description: 'Bold, expressive canvas paintings capturing culture, devotion, and life.', category: 'Painting', imageUrl: '/artwork/canvas_painting.jpg', startingPrice: 3000, priceRange: '₹3,000 – ₹8,000', estimatedDays: '10–14 days', features: ['Premium canvas', 'Vibrant colors', 'Ready to hang', 'Custom sizes'], isActive: true, isFeatured: true },
    { _id: '2', title: 'Paper Quilling', description: 'Intricate and colourful paper quilling names and shapes crafted with absolute perfection.', category: 'Craft', imageUrl: '/artwork/quil_art.jpg', startingPrice: 500, priceRange: '₹500 – ₹1,500', estimatedDays: '7–10 days', features: ['3D paper texture', 'Intricate details', 'Custom names', 'Gift ready'], isActive: true, isFeatured: true },
    { _id: '3', title: 'Fingerprint Tree', description: 'Heartfelt family trees for your special occasions using fingerprint impressions.', category: 'Special', imageUrl: '/artwork/fingerprint_tree_1.jpg', startingPrice: 2500, priceRange: '₹2,500 – ₹7,000', estimatedDays: '7–10 days', features: ['Personalised keepsakes', 'Event ready', 'Couples & Family', 'Framed options'], isActive: true, isFeatured: true },
    { _id: '4', title: 'Mobile Case Sketching', description: 'Customised mobile back cover sketching to keep your favourite memories right in your hand.', category: 'Special', imageUrl: '/artwork/mobile_back_cover.jpg', startingPrice: 250, priceRange: '₹250 – ₹1,000', estimatedDays: '3–5 days', features: ['Detailed sketches', 'Durable coat', 'Custom models', 'Unique gift'], isActive: true, isFeatured: false },
    { _id: '5', title: 'Colour Pencil Drawing', description: 'Vibrant, hyper-realistic colour pencil masterpieces full of rich detail and emotion.', category: 'Drawing', imageUrl: '/artwork/colour_pencil.jpg', startingPrice: 1200, priceRange: '₹1,200 – ₹4,500', estimatedDays: '7–10 days', features: ['Rich vivid colours', 'Smooth blending', 'Portraits & Art', 'Premium paper'], isActive: true, isFeatured: true },
    { _id: '6', title: 'Pencil Sketching', description: 'Hyper-realistic monochrome pencil portraits capturing every expression flawlessly.', category: 'Drawing', imageUrl: '/artwork/pencil_sketching.jpg', startingPrice: 800, priceRange: '₹800 – ₹3,000', estimatedDays: '5–7 days', features: ['High realism', 'Detailed shading', 'A4/A3 sizes available', 'Classic style'], isActive: true, isFeatured: true },
    { _id: '7', title: 'Blood Art', description: 'A highly unique and emotional artwork style using special reddish-brown blood-like tones.', category: 'Special', imageUrl: '/artwork/blood_art.jpg', startingPrice: 1500, priceRange: '₹1,500 – ₹5,000', estimatedDays: '7–10 days', features: ['Unique medium', 'High contrast', 'Unforgettable gift', 'Protective coat'], isActive: true, isFeatured: true },
    { _id: '8', title: 'Pencil Curving', description: 'Mind-blowing miniature sculptures carved directly onto pencil leads inside tiny bottles.', category: 'Miniature', imageUrl: '/artwork/pencil_curving.jpg', startingPrice: 500, priceRange: '₹500 – ₹1,200', estimatedDays: '7–10 days', features: ['Micro detailing', 'Custom text carving', 'Glass bottle included', 'Extreme precision'], isActive: true, isFeatured: true },
];

/* ─── Feature items (bottom strip) ──────────────────────────────── */
const FEATURES = [
    { icon: Award, title: 'Premium Quality', desc: 'Museum-grade materials for every artwork' },
    { icon: Star, title: 'Custom Made', desc: 'Every piece crafted uniquely for you' },
    { icon: Package, title: 'Safe Packaging', desc: 'Secure, damage-proof delivery packaging' },
    { icon: Clock, title: 'On-Time Delivery', desc: 'Committed to promised delivery timelines' },
];

/* ─── Design tokens ─────────────────────────────────────────────── */
const GOLD = '#D4AF37';
const DARK = '#0D0D12';
const DARK2 = '#0f0f16';

const CONTAINER: React.CSSProperties = {
    maxWidth: 1400,
    margin: '0 auto',
    paddingLeft: 'clamp(16px, 4vw, 80px)',
    paddingRight: 'clamp(16px, 4vw, 80px)',
};

/* ─── Category badge colour map ─────────────────────────────────── */
const CATEGORY_COLOR: Record<string, string> = {
    Drawing: 'rgba(100,160,255,0.18)',
    Painting: 'rgba(255,140,80,0.18)',
    Special: 'rgba(212,80,80,0.18)',
    Craft: 'rgba(100,220,160,0.18)',
    Event: 'rgba(180,120,255,0.18)',
    Mural: 'rgba(255,200,60,0.18)',
    Frames: 'rgba(212,175,55,0.18)',
    Miniature: 'rgba(150,200,255,0.18)',
};
const CATEGORY_TEXT: Record<string, string> = {
    Drawing: '#82aaff',
    Painting: '#ffaa60',
    Special: '#ff8080',
    Craft: '#60dca0',
    Event: '#c080ff',
    Mural: '#ffc840',
    Frames: GOLD,
    Miniature: '#96c8ff',
};

/* ─── Component ─────────────────────────────────────────────────── */
const ServicesPage = () => {
    const [lightbox, setLightbox] = useState<Service | null>(null);
    const { data } = useQuery({
        queryKey: ['services-page'],
        queryFn: () => servicesAPI.getAll().then(r => r.data.data as Service[]),
    });
    const services = data && data.length > 0 ? data : PLACEHOLDER;

    return (
        <div style={{ minHeight: '100vh', background: DARK }}>

            {/* ══════════════════ HERO ══════════════════ */}
            <div style={{ background: DARK2, borderBottom: '1px solid rgba(212,175,55,0.07)', paddingTop: 110, paddingBottom: 72 }}>
                <div style={{ ...CONTAINER, display: 'flex', flexDirection: 'column', alignItems: 'center', textAlign: 'center' }}>
                    <motion.div
                        initial={{ opacity: 0, y: 28 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.65, ease: 'easeOut' }}
                        style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}
                    >
                        {/* Eyebrow */}
                        <span style={{ color: GOLD, fontSize: 12, fontWeight: 700, letterSpacing: '0.26em', textTransform: 'uppercase', marginBottom: 18 }}>
                            What We Offer
                        </span>

                        {/* Heading */}
                        <h1 className="font-cinzel" style={{ fontSize: 'clamp(38px,6vw,72px)', fontWeight: 800, color: GOLD, lineHeight: 1.1, margin: '0 0 20px' }}>
                            Our Services
                        </h1>

                        {/* Gold divider */}
                        <div style={{ width: 56, height: 2, borderRadius: 999, background: `linear-gradient(90deg,transparent,${GOLD},transparent)`, marginBottom: 24 }} />

                        {/* Description */}
                        <p style={{ fontSize: 16, lineHeight: 1.75, color: '#888', maxWidth: 540, margin: 0 }}>
                            12+ art styles crafted with passion — discover the perfect artwork for every occasion, space, and story.
                        </p>
                    </motion.div>
                </div>
            </div>

            {/* ══════════════════ SERVICE GRID ══════════════════ */}
            <div style={{ paddingTop: 64, paddingBottom: 80, ...CONTAINER }}>
                <div style={{
                    display: 'grid',
                    gridTemplateColumns: 'repeat(auto-fill, minmax(340px, 1fr))',
                    gap: 32,
                }}>
                    {services.map((service, i) => (
                        <motion.div
                            key={service._id}
                            initial={{ opacity: 0, y: 36 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.48, delay: i * 0.055 }}
                            whileHover={{ y: -8, boxShadow: '0 24px 56px rgba(0,0,0,0.55)' }}
                            style={{
                                borderRadius: 22,
                                overflow: 'hidden',
                                background: 'rgba(255,255,255,0.025)',
                                border: '1px solid rgba(212,175,55,0.16)',
                                display: 'flex',
                                flexDirection: 'column',
                                transition: 'border-color 0.25s',
                            }}
                            onMouseEnter={e => (e.currentTarget.style.borderColor = 'rgba(212,175,55,0.42)')}
                            onMouseLeave={e => (e.currentTarget.style.borderColor = 'rgba(212,175,55,0.16)')}
                        >
                            {/* ── Image ── */}
                            <div
                                style={{ position: 'relative', height: 232, overflow: 'hidden', flexShrink: 0, backgroundColor: 'rgba(0,0,0,0.6)', cursor: 'zoom-in' }}
                                onClick={() => setLightbox(service)}
                            >
                                <img
                                    src={service.imageUrl}
                                    alt={service.title}
                                    style={{ width: '100%', height: '100%', objectFit: 'contain', transition: 'transform 0.55s ease', display: 'block' }}
                                    onMouseEnter={e => ((e.target as HTMLImageElement).style.transform = 'scale(1.04)')}
                                    onMouseLeave={e => ((e.target as HTMLImageElement).style.transform = 'scale(1)')}
                                />
                                <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(to top, rgba(10,10,15,0.82), transparent 55%)', pointerEvents: 'none' }} />

                                {/* Category badge — top left */}
                                <div style={{ position: 'absolute', top: 16, left: 16 }}>
                                    <span style={{
                                        fontSize: 11, padding: '5px 12px', borderRadius: 999, fontWeight: 600,
                                        background: CATEGORY_COLOR[service.category] || 'rgba(212,175,55,0.18)',
                                        color: CATEGORY_TEXT[service.category] || GOLD,
                                        border: `1px solid ${CATEGORY_TEXT[service.category] || GOLD}33`,
                                        letterSpacing: '0.04em',
                                    }}>
                                        {service.category}
                                    </span>
                                </div>

                                {/* Popular badge — top right */}
                                {service.isFeatured && (
                                    <div style={{
                                        position: 'absolute', top: 16, right: 16,
                                        display: 'flex', alignItems: 'center', gap: 5,
                                        fontSize: 11, padding: '5px 11px', borderRadius: 999, fontWeight: 700,
                                        background: `linear-gradient(135deg,${GOLD},#B8961E)`, color: '#0D0D12',
                                    }}>
                                        <Star size={10} fill="#0D0D12" strokeWidth={0} /> Popular
                                    </div>
                                )}
                            </div>

                            {/* ── Card body ── */}
                            <div style={{ padding: '26px 28px 28px', display: 'flex', flexDirection: 'column', flex: 1 }}>

                                {/* Title */}
                                <h3 className="font-cinzel" style={{ fontSize: 18, fontWeight: 800, color: '#F0F0F0', marginBottom: 10, lineHeight: 1.3 }}>
                                    {service.title}
                                </h3>

                                {/* Description */}
                                <p style={{ fontSize: 13.5, color: '#777', lineHeight: 1.7, marginBottom: 20 }}>
                                    {service.description}
                                </p>

                                {/* Features list */}
                                <ul style={{ listStyle: 'none', padding: 0, margin: '0 0 22px', display: 'flex', flexDirection: 'column', gap: 9 }}>
                                    {service.features.map(f => (
                                        <li key={f} style={{ display: 'flex', alignItems: 'center', gap: 10, fontSize: 13, color: '#888' }}>
                                            <span style={{ color: GOLD, fontSize: 15, lineHeight: 1, flexShrink: 0 }}>✦</span>
                                            {f}
                                        </li>
                                    ))}
                                </ul>

                                {/* Spacer to push price+button to bottom */}
                                <div style={{ flex: 1 }} />

                                {/* Price + delivery row */}
                                <div style={{
                                    display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                                    padding: '14px 18px', borderRadius: 14, marginBottom: 20,
                                    background: 'rgba(212,175,55,0.05)', border: '1px solid rgba(212,175,55,0.12)',
                                }}>
                                    <div>
                                        <p style={{ fontSize: 11, color: '#555', marginBottom: 4, textTransform: 'uppercase', letterSpacing: '0.07em', fontWeight: 600 }}>Starting from</p>
                                        <span className="font-cinzel" style={{ fontSize: 17, fontWeight: 800, color: GOLD }}>
                                            {service.priceRange || `₹${service.startingPrice}`}
                                        </span>
                                    </div>
                                    {service.estimatedDays && (
                                        <div style={{ textAlign: 'right' }}>
                                            <p style={{ fontSize: 11, color: '#555', marginBottom: 4, textTransform: 'uppercase', letterSpacing: '0.07em', fontWeight: 600 }}>Delivery</p>
                                            <span style={{ display: 'flex', alignItems: 'center', gap: 5, fontSize: 13, fontWeight: 600, color: '#C0C0C0' }}>
                                                <Calendar size={12} strokeWidth={2} style={{ color: GOLD }} />
                                                {service.estimatedDays}
                                            </span>
                                        </div>
                                    )}
                                </div>

                                {/* Book Now button — always full width */}
                                <a
                                    href={`https://wa.me/917806906030?text=Hi! I'm interested in ${service.title}`}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    style={{ display: 'block', textDecoration: 'none' }}
                                >
                                    <motion.button
                                        whileHover={{ scale: 1.02 }}
                                        whileTap={{ scale: 0.97 }}
                                        style={{
                                            width: '100%', padding: '14px 0', borderRadius: 14,
                                            display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 9,
                                            background: `linear-gradient(135deg,${GOLD},#B8961E)`,
                                            color: '#0D0D12', fontWeight: 700, fontSize: 14,
                                            border: 'none', cursor: 'pointer', fontFamily: 'inherit',
                                            boxShadow: '0 4px 18px rgba(212,175,55,0.2)',
                                        }}
                                    >
                                        <MessageCircle size={15} strokeWidth={2.5} /> Book Now
                                    </motion.button>
                                </a>
                            </div>
                        </motion.div>
                    ))}
                </div>

                {/* ══════════════════ BOTTOM FEATURES STRIP ══════════════════ */}
                <motion.div
                    initial={{ opacity: 0, y: 24 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.5, duration: 0.55 }}
                    style={{
                        marginTop: 80,
                        borderRadius: 22,
                        padding: '52px 48px',
                        background: 'rgba(255,255,255,0.02)',
                        border: '1px solid rgba(212,175,55,0.14)',
                    }}
                >
                    {/* Strip heading */}
                    <div style={{ textAlign: 'center', marginBottom: 52 }}>
                        <span style={{ fontSize: 12, fontWeight: 700, letterSpacing: '0.22em', textTransform: 'uppercase', color: GOLD }}>Why Choose Us</span>
                        <h2 className="font-cinzel" style={{ fontSize: 'clamp(24px,3vw,36px)', fontWeight: 700, color: '#F0F0F0', marginTop: 14, marginBottom: 0 }}>
                            The Sketch Vibes Promise
                        </h2>
                    </div>

                    {/* 4-column feature grid */}
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: 32 }}>
                        {FEATURES.map(({ icon: Icon, title, desc }) => (
                            <motion.div
                                key={title}
                                whileHover={{ y: -4 }}
                                style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', textAlign: 'center' }}
                            >
                                <div style={{
                                    width: 64, height: 64, borderRadius: '50%', marginBottom: 20,
                                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                                    background: 'rgba(212,175,55,0.1)', border: '1px solid rgba(212,175,55,0.22)', color: GOLD,
                                }}>
                                    <Icon size={26} strokeWidth={1.6} />
                                </div>
                                <h4 className="font-cinzel" style={{ fontSize: 15, fontWeight: 700, color: '#F0F0F0', marginBottom: 10 }}>{title}</h4>
                                <p style={{ fontSize: 13, color: '#666', lineHeight: 1.65 }}>{desc}</p>
                            </motion.div>
                        ))}
                    </div>
                </motion.div>

                {/* ══════════════════ CTA ══════════════════ */}
                <motion.div
                    initial={{ opacity: 0, y: 24 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.7, duration: 0.5 }}
                    style={{
                        marginTop: 36,
                        borderRadius: 22,
                        padding: '56px 48px',
                        textAlign: 'center',
                        background: 'rgba(212,175,55,0.04)',
                        border: '1px solid rgba(212,175,55,0.18)',
                    }}
                >
                    <h3 className="font-cinzel" style={{ fontSize: 'clamp(22px,3vw,34px)', fontWeight: 700, color: GOLD, marginBottom: 16 }}>
                        Don't See What You Need?
                    </h3>
                    <p style={{ fontSize: 15, color: '#777', maxWidth: 500, margin: '0 auto 36px', lineHeight: 1.75 }}>
                        We accept all creative requests! Chat with Artist Saran to discuss your unique requirements.
                    </p>
                    <div style={{ display: 'flex', justifyContent: 'center', gap: 20, flexWrap: 'wrap' }}>
                        <a href="https://wa.me/917806906030" target="_blank" rel="noopener noreferrer" style={{ textDecoration: 'none' }}>
                            <motion.button
                                whileHover={{ scale: 1.04, y: -2 }} whileTap={{ scale: 0.97 }}
                                style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '15px 36px', borderRadius: 999, fontWeight: 700, fontSize: 15, background: `linear-gradient(135deg,${GOLD},#B8961E)`, color: '#0D0D12', border: 'none', cursor: 'pointer', fontFamily: 'inherit', boxShadow: '0 6px 24px rgba(212,175,55,0.24)' }}>
                                <MessageCircle size={17} /> WhatsApp Us
                            </motion.button>
                        </a>
                        <a href="/order" style={{ textDecoration: 'none' }}>
                            <motion.button
                                whileHover={{ scale: 1.04, y: -2 }} whileTap={{ scale: 0.97 }}
                                style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '15px 36px', borderRadius: 999, fontWeight: 700, fontSize: 15, background: 'transparent', border: `1px solid rgba(212,175,55,0.4)`, color: GOLD, cursor: 'pointer', fontFamily: 'inherit' }}>
                                Custom Order <ArrowRight size={17} />
                            </motion.button>
                        </a>
                    </div>
                </motion.div>
            </div>

            {/* Bottom shield trust line */}
            <div style={{ borderTop: '1px solid rgba(212,175,55,0.07)', paddingTop: 24, paddingBottom: 28, ...CONTAINER }}>
                <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', gap: 8 }}>
                    <Shield size={14} style={{ color: GOLD }} />
                    <span style={{ fontSize: 13, color: '#444' }}>100% satisfaction guaranteed · All artworks are handcrafted originals</span>
                </div>
            </div>

            {/* ══════════════════ LIGHTBOX ══════════════════ */}
            <AnimatePresence>
                {lightbox && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        onClick={() => setLightbox(null)}
                        style={{
                            position: 'fixed', inset: 0, zIndex: 100,
                            display: 'flex', alignItems: 'center', justifyContent: 'center',
                            padding: 24, background: 'rgba(0,0,0,0.93)',
                            backdropFilter: 'blur(12px)',
                        }}
                    >
                        <motion.div
                            initial={{ scale: 0.82, opacity: 0 }}
                            animate={{ scale: 1, opacity: 1 }}
                            exit={{ scale: 0.82, opacity: 0 }}
                            transition={{ duration: 0.3 }}
                            onClick={e => e.stopPropagation()}
                            style={{ position: 'relative', maxWidth: 900, width: '100%' }}
                        >
                            {/* Close */}
                            <button
                                onClick={() => setLightbox(null)}
                                style={{
                                    position: 'absolute', top: -16, right: -16, zIndex: 110,
                                    width: 42, height: 42, borderRadius: '50%', border: 'none', cursor: 'pointer',
                                    background: 'rgba(255,255,255,0.12)', color: '#fff',
                                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                                    backdropFilter: 'blur(4px)',
                                }}
                            >
                                <X size={18} />
                            </button>

                            {/* Image */}
                            <img
                                src={lightbox.imageUrl}
                                alt={lightbox.title}
                                style={{ width: '100%', maxHeight: '78vh', objectFit: 'contain', borderRadius: 18, display: 'block' }}
                            />

                            {/* Meta */}
                            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginTop: 18, padding: '0 4px' }}>
                                <div>
                                    <p style={{ fontSize: 12, color: GOLD, marginBottom: 4, fontWeight: 600, letterSpacing: '0.06em', textTransform: 'uppercase' }}>{lightbox.category}</p>
                                    <h3 className="font-cinzel" style={{ fontSize: 20, fontWeight: 700, color: '#F0F0F0' }}>{lightbox.title}</h3>
                                </div>
                                <div style={{ display: 'flex', alignItems: 'center', gap: 6, color: '#555', fontSize: 13 }}>
                                    Starting at {lightbox.priceRange || `₹${lightbox.startingPrice}`}
                                </div>
                            </div>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
};

export default ServicesPage;
