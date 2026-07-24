import { useState } from 'react';
import { motion } from 'framer-motion';
import { useQuery } from '@tanstack/react-query';
import { framesAPI } from '../lib/api';
import type { Frame } from '../types';
import { Filter, ShoppingCart, MessageCircle, Star } from 'lucide-react';

/* ─── Constants ─────────────────────────────────────────────────── */
const SIZES = ['All', '4x4', '5x7', '6x8', '8x10', '10x12', '12x16', 'A4', 'A3', 'A2', 'A1', 'Custom'];
const STYLES = ['All', 'Wooden', 'Black', 'White', 'Golden', 'Modern'];

const GOLD = '#D4AF37';
const DARK = '#0D0D12';
const DARK2 = '#0f0f16';

/* ─── Placeholder data ───────────────────────────────────────────── */
const PLACEHOLDER_FRAMES: Frame[] = [
    { _id: '1', name: 'Classic Wooden Frame', size: '8x10', style: 'Wooden', material: 'Natural Wood', imageUrl: 'https://images.unsplash.com/photo-1544931170-b5b55a2b0f58?w=600&q=80', price: 899, availableColors: ['Natural', 'Brown', 'Dark Walnut'], description: 'Premium natural wood frame with classic finish', isAvailable: true, isFeatured: true },
    { _id: '2', name: 'Modern Black Frame', size: 'A4', style: 'Black', material: 'Premium MDF', imageUrl: 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=600&q=80', price: 699, availableColors: ['Black', 'Matte Black'], description: 'Sleek modern black frame suitable for any décor', isAvailable: true, isFeatured: true },
    { _id: '3', name: 'Golden Luxury Frame', size: '12x16', style: 'Golden', material: 'Gilded Wood', imageUrl: 'https://images.unsplash.com/photo-1513364776144-60967b0f800f?w=600&q=80', price: 1499, availableColors: ['Gold', 'Antique Gold'], description: 'Opulent golden frame for your finest artworks', isAvailable: true, isFeatured: true },
    { _id: '4', name: 'White Minimalist Frame', size: '5x7', style: 'White', material: 'MDF', imageUrl: 'https://images.unsplash.com/photo-1541961017774-22349e4a1262?w=600&q=80', price: 549, availableColors: ['White', 'Off-White'], description: 'Clean minimalist white frame for modern homes', isAvailable: true, isFeatured: false },
    { _id: '5', name: 'Modern Floating Frame', size: 'A3', style: 'Modern', material: 'Acrylic + Metal', imageUrl: 'https://images.unsplash.com/photo-1503455637927-730bce8583c0?w=600&q=80', price: 1199, availableColors: ['Silver', 'Gunmetal', 'Rose Gold'], description: 'Contemporary floating frame with metallic accents', isAvailable: true, isFeatured: true },
    { _id: '6', name: 'Large Gallery Frame', size: 'A2', style: 'Wooden', material: 'Solid Wood', imageUrl: 'https://images.unsplash.com/photo-1543489822-c49534f3271f?w=600&q=80', price: 1899, availableColors: ['Oak', 'Mahogany', 'Ebony'], description: 'Museum-quality large format gallery frame', isAvailable: true, isFeatured: false },
    { _id: '7', name: 'Collage Multi-Frame', size: '10x12', style: 'Modern', material: 'MDF + Glass', imageUrl: 'https://images.unsplash.com/photo-1519741497674-611481863552?w=600&q=80', price: 999, availableColors: ['Black', 'White', 'Natural'], description: 'Perfect for displaying multiple memories together', isAvailable: true, isFeatured: false },
    { _id: '8', name: 'Custom Size Frame', size: 'Custom', style: 'Wooden', material: 'Choice of material', imageUrl: 'https://images.unsplash.com/photo-1609220136736-443140cffec6?w=600&q=80', price: 1200, availableColors: ['Any colour available'], description: 'Fully custom size and style to your specification', isAvailable: true, isFeatured: false },
];

/* ─── Shared tokens ─────────────────────────────────────────────── */
const CONTAINER: React.CSSProperties = {
    maxWidth: 1360,
    margin: '0 auto',
    paddingLeft: 'clamp(16px, 4vw, 72px)',
    paddingRight: 'clamp(16px, 4vw, 72px)',
};

/* ─── Filter pill ───────────────────────────────────────────────── */
const Pill = ({ label, active, onClick }: { label: string; active: boolean; onClick: () => void }) => (
    <motion.button
        whileHover={{ scale: 1.04 }}
        whileTap={{ scale: 0.96 }}
        onClick={onClick}
        style={{
            padding: '8px 18px',
            borderRadius: 999,
            fontSize: 13,
            fontWeight: active ? 700 : 400,
            cursor: 'pointer',
            transition: 'all 0.2s',
            background: active ? `linear-gradient(135deg, ${GOLD}, #B8961E)` : 'rgba(255,255,255,0.04)',
            color: active ? '#0D0D12' : '#888',
            border: active ? 'none' : '1px solid rgba(212,175,55,0.15)',
            letterSpacing: active ? '0.02em' : 0,
            whiteSpace: 'nowrap',
            fontFamily: 'inherit',
        }}
    >
        {label}
    </motion.button>
);

/* ─── Component ─────────────────────────────────────────────────── */
const FramesPage = () => {
    const [activeSize, setActiveSize] = useState('All');
    const [activeStyle, setActiveStyle] = useState('All');

    const { data } = useQuery({
        queryKey: ['frames', activeSize, activeStyle],
        queryFn: () =>
            framesAPI.getAll({
                ...(activeSize !== 'All' ? { size: activeSize } : {}),
                ...(activeStyle !== 'All' ? { style: activeStyle } : {}),
            }).then(r => r.data.data as Frame[]),
    });

    const frames = data && data.length > 0
        ? data
        : PLACEHOLDER_FRAMES.filter(f =>
            (activeSize === 'All' || f.size === activeSize) &&
            (activeStyle === 'All' || f.style === activeStyle)
        );

    return (
        <div style={{ minHeight: '100vh', background: DARK }}>

            {/* ══════════════════ HERO SECTION ══════════════════ */}
            <div style={{ background: DARK2, borderBottom: '1px solid rgba(212,175,55,0.08)', paddingTop: 112, paddingBottom: 72 }}>
                <div style={{ ...CONTAINER, display: 'flex', flexDirection: 'column', alignItems: 'center', textAlign: 'center' }}>
                    <motion.div
                        initial={{ opacity: 0, y: 28 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.65, ease: 'easeOut' }}
                        style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}
                    >
                        {/* Eyebrow */}
                        <span style={{
                            color: GOLD, fontSize: 12, fontWeight: 700,
                            letterSpacing: '0.25em', textTransform: 'uppercase', marginBottom: 16,
                        }}>
                            Collection
                        </span>

                        {/* Heading */}
                        <h1
                            className="font-cinzel"
                            style={{
                                fontSize: 'clamp(38px, 6vw, 72px)',
                                fontWeight: 800,
                                color: GOLD,
                                lineHeight: 1.1,
                                margin: '0 0 20px',
                            }}
                        >
                            Photo Frames
                        </h1>

                        {/* Gold divider */}
                        <div style={{
                            width: 56, height: 2, borderRadius: 999, marginBottom: 24,
                            background: `linear-gradient(90deg, transparent, ${GOLD}, transparent)`,
                        }} />

                        {/* Description */}
                        <p style={{
                            fontSize: 16, lineHeight: 1.75, color: '#888',
                            maxWidth: 520, margin: 0,
                        }}>
                            Handcrafted premium frames to display your most precious memories in timeless elegance.
                        </p>
                    </motion.div>
                </div>
            </div>

            {/* ══════════════════ FILTERS ══════════════════ */}
            <div style={{ background: DARK2, borderBottom: '1px solid rgba(212,175,55,0.06)', paddingTop: 28, paddingBottom: 28 }}>
                <div style={CONTAINER}>
                    <motion.div
                        initial={{ opacity: 0, y: 16 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.5, delay: 0.2 }}
                    >
                        {/* Size row */}
                        <div style={{ display: 'flex', alignItems: 'center', flexWrap: 'wrap', gap: 12, marginBottom: 14 }}>
                            <div style={{ display: 'flex', alignItems: 'center', gap: 7, color: GOLD, flexShrink: 0 }}>
                                <Filter size={14} strokeWidth={2} />
                                <span style={{ fontSize: 13, fontWeight: 600, letterSpacing: '0.06em', textTransform: 'uppercase' }}>Size</span>
                            </div>
                            <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
                                {SIZES.map(s => (
                                    <Pill key={s} label={s} active={activeSize === s} onClick={() => setActiveSize(s)} />
                                ))}
                            </div>
                        </div>

                        {/* Style row */}
                        <div style={{ display: 'flex', alignItems: 'center', flexWrap: 'wrap', gap: 12 }}>
                            <div style={{ display: 'flex', alignItems: 'center', gap: 7, color: GOLD, flexShrink: 0 }}>
                                <Filter size={14} strokeWidth={2} />
                                <span style={{ fontSize: 13, fontWeight: 600, letterSpacing: '0.06em', textTransform: 'uppercase' }}>Style</span>
                            </div>
                            <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
                                {STYLES.map(s => (
                                    <Pill key={s} label={s} active={activeStyle === s} onClick={() => setActiveStyle(s)} />
                                ))}
                            </div>
                        </div>
                    </motion.div>
                </div>
            </div>

            {/* ══════════════════ PRODUCT GRID ══════════════════ */}
            <div style={{ paddingTop: 56, paddingBottom: 80, ...CONTAINER }}>

                {frames.length === 0 ? (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        style={{ textAlign: 'center', padding: '80px 0', color: '#444' }}
                    >
                        <p style={{ fontSize: 16 }}>No frames match your current filters.</p>
                    </motion.div>
                ) : (
                    <div style={{
                        display: 'grid',
                        gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))',
                        gap: 28,
                    }}>
                        {frames.map((frame, i) => (
                            <motion.div
                                key={frame._id}
                                initial={{ opacity: 0, y: 32 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ duration: 0.45, delay: i * 0.07 }}
                                whileHover={{ y: -8, boxShadow: '0 20px 48px rgba(0,0,0,0.5)' }}
                                style={{
                                    borderRadius: 20,
                                    overflow: 'hidden',
                                    background: 'rgba(255,255,255,0.03)',
                                    border: '1px solid rgba(212,175,55,0.18)',
                                    display: 'flex',
                                    flexDirection: 'column',
                                    transition: 'border-color 0.25s',
                                }}
                                onMouseEnter={e => (e.currentTarget.style.borderColor = 'rgba(212,175,55,0.45)')}
                                onMouseLeave={e => (e.currentTarget.style.borderColor = 'rgba(212,175,55,0.18)')}
                            >
                                {/* Image */}
                                <div style={{ position: 'relative', height: 220, overflow: 'hidden', flexShrink: 0 }}>
                                    <img
                                        src={frame.imageUrl}
                                        alt={frame.name}
                                        style={{ width: '100%', height: '100%', objectFit: 'cover', transition: 'transform 0.5s ease', display: 'block' }}
                                        onMouseEnter={e => ((e.target as HTMLImageElement).style.transform = 'scale(1.08)')}
                                        onMouseLeave={e => ((e.target as HTMLImageElement).style.transform = 'scale(1)')}
                                    />
                                    {/* Gradient overlay */}
                                    <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(to top, rgba(10,10,15,0.75), transparent)' }} />

                                    {/* Badges — top left */}
                                    <div style={{ position: 'absolute', top: 14, left: 14, display: 'flex', gap: 8, alignItems: 'center' }}>
                                        <span style={{
                                            fontSize: 11, padding: '4px 10px', borderRadius: 999, fontWeight: 600,
                                            background: 'rgba(212,175,55,0.18)', color: GOLD, border: '1px solid rgba(212,175,55,0.3)',
                                        }}>{frame.size}</span>
                                        <span style={{
                                            fontSize: 11, padding: '4px 10px', borderRadius: 999, fontWeight: 500,
                                            background: 'rgba(0,0,0,0.45)', color: '#ccc',
                                        }}>{frame.style}</span>
                                    </div>

                                    {/* Top Pick badge — top right */}
                                    {frame.isFeatured && (
                                        <div style={{
                                            position: 'absolute', top: 14, right: 14,
                                            display: 'flex', alignItems: 'center', gap: 4,
                                            fontSize: 11, padding: '4px 10px', borderRadius: 999, fontWeight: 700,
                                            background: `linear-gradient(135deg, ${GOLD}, #B8961E)`, color: '#0D0D12',
                                        }}>
                                            <Star size={10} fill="#0D0D12" strokeWidth={0} /> Top Pick
                                        </div>
                                    )}
                                </div>

                                {/* Card body */}
                                <div style={{ padding: '22px 24px 24px', display: 'flex', flexDirection: 'column', flex: 1 }}>
                                    {/* Title */}
                                    <h3 className="font-cinzel" style={{ fontSize: 16, fontWeight: 700, color: '#F0F0F0', marginBottom: 4, lineHeight: 1.3 }}>
                                        {frame.name}
                                    </h3>

                                    {/* Material */}
                                    {frame.material && (
                                        <p style={{ fontSize: 12, color: GOLD, marginBottom: 8, fontWeight: 500, letterSpacing: '0.03em' }}>
                                            {frame.material}
                                        </p>
                                    )}

                                    {/* Description */}
                                    <p style={{ fontSize: 13, color: '#777', lineHeight: 1.65, marginBottom: 16, flex: 1 }}>
                                        {frame.description}
                                    </p>

                                    {/* Colour chips */}
                                    {frame.availableColors.length > 0 && (
                                        <div style={{ marginBottom: 20 }}>
                                            <p style={{ fontSize: 11, color: '#555', marginBottom: 8, textTransform: 'uppercase', letterSpacing: '0.08em', fontWeight: 600 }}>
                                                Available in
                                            </p>
                                            <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6 }}>
                                                {frame.availableColors.map(c => (
                                                    <span key={c} style={{
                                                        fontSize: 11, padding: '3px 10px', borderRadius: 999,
                                                        background: 'rgba(212,175,55,0.07)', color: '#aaa',
                                                        border: '1px solid rgba(212,175,55,0.15)',
                                                    }}>{c}</span>
                                                ))}
                                            </div>
                                        </div>
                                    )}

                                    {/* Price + Order */}
                                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 12 }}>
                                        <span className="font-cinzel" style={{ fontSize: 22, fontWeight: 800, color: GOLD }}>
                                            ₹{frame.price.toLocaleString()}
                                        </span>
                                        <a
                                            href={`https://wa.me/917806906030?text=Hi! I'd like to order the ${frame.name} (${frame.size})`}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            style={{ textDecoration: 'none' }}
                                        >
                                            <motion.button
                                                whileHover={{ scale: 1.06 }}
                                                whileTap={{ scale: 0.96 }}
                                                style={{
                                                    display: 'flex', alignItems: 'center', gap: 7,
                                                    padding: '10px 18px', borderRadius: 999,
                                                    background: `linear-gradient(135deg, ${GOLD}, #B8961E)`,
                                                    color: '#0D0D12', fontWeight: 700, fontSize: 13,
                                                    border: 'none', cursor: 'pointer', fontFamily: 'inherit',
                                                    boxShadow: '0 4px 16px rgba(212,175,55,0.22)',
                                                }}
                                            >
                                                <ShoppingCart size={13} strokeWidth={2.5} />
                                                Order
                                            </motion.button>
                                        </a>
                                    </div>
                                </div>
                            </motion.div>
                        ))}
                    </div>
                )}

                {/* ── Custom Size CTA ── */}
                <motion.div
                    initial={{ opacity: 0, y: 24 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.6, duration: 0.5 }}
                    style={{
                        marginTop: 72,
                        borderRadius: 22,
                        padding: '52px 40px',
                        textAlign: 'center',
                        background: 'rgba(255,255,255,0.02)',
                        border: '1px solid rgba(212,175,55,0.18)',
                    }}
                >
                    <h3 className="font-cinzel" style={{ fontSize: 28, fontWeight: 700, color: GOLD, marginBottom: 14 }}>
                        Need a Custom Size?
                    </h3>
                    <p style={{ fontSize: 15, color: '#777', maxWidth: 480, margin: '0 auto 32px', lineHeight: 1.7 }}>
                        We create frames in any dimension and style. Contact us directly for a personalised quote.
                    </p>
                    <a href="https://wa.me/917806906030" target="_blank" rel="noopener noreferrer" style={{ textDecoration: 'none' }}>
                        <motion.button
                            whileHover={{ scale: 1.04, y: -2 }}
                            whileTap={{ scale: 0.97 }}
                            style={{
                                display: 'inline-flex', alignItems: 'center', gap: 10,
                                padding: '15px 36px', borderRadius: 999,
                                background: `linear-gradient(135deg, ${GOLD}, #B8961E)`,
                                color: '#0D0D12', fontWeight: 700, fontSize: 15,
                                border: 'none', cursor: 'pointer', fontFamily: 'inherit',
                                boxShadow: '0 6px 24px rgba(212,175,55,0.25)',
                            }}
                        >
                            <MessageCircle size={18} /> Chat on WhatsApp
                        </motion.button>
                    </a>
                </motion.div>
            </div>
        </div>
    );
};

export default FramesPage;
