import { motion } from 'framer-motion';
import { useQuery } from '@tanstack/react-query';
import { servicesAPI } from '../lib/api';
import type { Service } from '../types';
import { Calendar, MessageCircle, ArrowRight, Star, Shield, Package, Clock, Award } from 'lucide-react';

/* ─── Placeholder data ───────────────────────────────────────────── */
const PLACEHOLDER: Service[] = [
    { _id: '1', title: 'Pencil Sketching', description: 'Hyper-realistic pencil portraits capturing every detail with artistic precision. Perfect for gifting and wall décor.', category: 'Drawing', imageUrl: 'https://images.unsplash.com/photo-1513364776144-60967b0f800f?w=600&q=80', startingPrice: 800, priceRange: '₹800 – ₹3,000', estimatedDays: '5–7 days', features: ['Reference photo required', 'A4/A3 sizes available', 'Premium cartridge paper', 'Black & white / coloured'], isActive: true, isFeatured: true },
    { _id: '2', title: 'Colour Pencil Art', description: 'Vibrant colour pencil masterpieces bursting with life and emotion, ideal for couple and family portraits.', category: 'Drawing', imageUrl: 'https://images.unsplash.com/photo-1541961017774-22349e4a1262?w=600&q=80', startingPrice: 1200, priceRange: '₹1,200 – ₹4,500', estimatedDays: '7–10 days', features: ['Rich vibrant colours', 'Smooth blending technique', 'Multiple sizes', 'Framing available'], isActive: true, isFeatured: true },
    { _id: '3', title: 'Acrylic Paintings', description: 'Bold, expressive acrylic paintings on premium canvas with lasting colours — from portraits to abstract compositions.', category: 'Painting', imageUrl: 'https://images.unsplash.com/photo-1579783902614-a3fb3927b6a5?w=600&q=80', startingPrice: 2000, priceRange: '₹2,000 – ₹8,000', estimatedDays: '10–14 days', features: ['Canvas painting', 'UV protected finish', 'Ready to hang', 'Custom sizes'], isActive: true, isFeatured: true },
    { _id: '4', title: 'Oil Paintings', description: 'Classic oil paintings with rich textures and timeless depth — the pinnacle of fine art tradition.', category: 'Painting', imageUrl: 'https://images.unsplash.com/photo-1503455637927-730bce8583c0?w=600&q=80', startingPrice: 3500, priceRange: '₹3,500 – ₹15,000', estimatedDays: '14–21 days', features: ['Linseed oil base', 'Rich texture & depth', 'Aging resistant', 'Fine art canvas'], isActive: true, isFeatured: true },
    { _id: '5', title: 'Blood Art', description: 'Unique and powerful artwork created with artistic blood-pigment medium — truly one of a kind.', category: 'Special', imageUrl: 'https://images.unsplash.com/photo-1561214115-f2f134cc4912?w=600&q=80', startingPrice: 1500, priceRange: '₹1,500 – ₹5,000', estimatedDays: '7–10 days', features: ['Special pigment', 'Certificate of authenticity', 'Unique artwork', 'UV sealed'], isActive: true, isFeatured: false },
    { _id: '6', title: 'Turmeric Painting', description: 'Traditional Indian art using natural turmeric for warm golden hues — a spiritual and cultural masterpiece.', category: 'Special', imageUrl: 'https://images.unsplash.com/photo-1493106641515-6b5631de4bb9?w=600&q=80', startingPrice: 1000, priceRange: '₹1,000 – ₹3,500', estimatedDays: '5–7 days', features: ['Natural turmeric medium', 'Warm golden tones', 'Traditional motifs', 'Eco-friendly'], isActive: true, isFeatured: false },
    { _id: '7', title: 'Quill Art', description: 'Intricate paper quilling portraits shaped into stunning three-dimensional compositions.', category: 'Craft', imageUrl: 'https://images.unsplash.com/photo-1517697471339-4aa32003c11a?w=600&q=80', startingPrice: 1800, priceRange: '₹1,800 – ₹6,000', estimatedDays: '10–14 days', features: ['3D paper texture', 'Intricate detail work', 'Custom backgrounds', 'Framed ready'], isActive: true, isFeatured: false },
    { _id: '8', title: 'Fingerprint Tree', description: 'Heartfelt family trees created from fingerprint impressions — a meaningful keepsake for every family.', category: 'Craft', imageUrl: 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=600&q=80', startingPrice: 2500, priceRange: '₹2,500 – ₹7,000', estimatedDays: '7–10 days', features: ['Family keepsake', 'Personalised names', 'Ink included', 'Framed & ready'], isActive: true, isFeatured: true },
    { _id: '9', title: 'Paper Quilling', description: 'Delicate rolled paper art creating intricate floral, wildlife, and abstract designs — perfect for gifting.', category: 'Craft', imageUrl: 'https://images.unsplash.com/photo-1524335442-77da9cd08c84?w=600&q=80', startingPrice: 1200, priceRange: '₹1,200 – ₹4,000', estimatedDays: '7–14 days', features: ['Intricate paper art', 'Multiple colour options', 'Gift wrapping', 'Certificate included'], isActive: true, isFeatured: false },
    { _id: '10', title: 'Event Artwork', description: 'Live event sketching and custom artwork for weddings, birthdays, and corporate events.', category: 'Event', imageUrl: 'https://images.unsplash.com/photo-1519741497674-611481863552?w=600&q=80', startingPrice: 5000, priceRange: '₹5,000 – ₹20,000', estimatedDays: 'On-site', features: ['Live sketching', 'Event coverage', 'Multiple portraits', 'Same day delivery'], isActive: true, isFeatured: true },
    { _id: '11', title: 'Wall Murals', description: 'Large-scale wall murals transforming spaces into breathtaking installations — commercial and residential.', category: 'Mural', imageUrl: 'https://images.unsplash.com/photo-1571115764595-644a1f56a55c?w=600&q=80', startingPrice: 8000, priceRange: '₹8,000 – ₹50,000', estimatedDays: 'By consultation', features: ['On-site artwork', 'Custom design', 'Durable weather-proof paints', 'Rate per sq.ft'], isActive: true, isFeatured: false },
    { _id: '12', title: 'Custom Photo Frames', description: 'Handcrafted premium frames to display your most precious memories forever — any size, any style.', category: 'Frames', imageUrl: 'https://images.unsplash.com/photo-1544931170-b5b55a2b0f58?w=600&q=80', startingPrice: 500, priceRange: '₹500 – ₹3,000', estimatedDays: '3–5 days', features: ['Multiple sizes & styles', 'Custom colours', 'Premium materials', 'Engraving available'], isActive: true, isFeatured: true },
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
};
const CATEGORY_TEXT: Record<string, string> = {
    Drawing: '#82aaff',
    Painting: '#ffaa60',
    Special: '#ff8080',
    Craft: '#60dca0',
    Event: '#c080ff',
    Mural: '#ffc840',
    Frames: GOLD,
};

/* ─── Component ─────────────────────────────────────────────────── */
const ServicesPage = () => {
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
                            <div style={{ position: 'relative', height: 232, overflow: 'hidden', flexShrink: 0 }}>
                                <img
                                    src={service.imageUrl}
                                    alt={service.title}
                                    style={{ width: '100%', height: '100%', objectFit: 'cover', transition: 'transform 0.55s ease', display: 'block' }}
                                    onMouseEnter={e => ((e.target as HTMLImageElement).style.transform = 'scale(1.09)')}
                                    onMouseLeave={e => ((e.target as HTMLImageElement).style.transform = 'scale(1)')}
                                />
                                <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(to top, rgba(10,10,15,0.82), transparent 55%)' }} />

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
        </div>
    );
};

export default ServicesPage;
