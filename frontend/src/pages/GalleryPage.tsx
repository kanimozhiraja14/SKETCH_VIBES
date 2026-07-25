import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useQuery } from '@tanstack/react-query';
import { galleryAPI } from '../lib/api';
import type { GalleryItem } from '../types';
import { Search, X, ZoomIn, Eye, Star } from 'lucide-react';
import { useInView } from 'react-intersection-observer';

/* ─── Constants ─────────────────────────────────────────────────── */
const CATEGORIES = [
    'All', 'Pencil Sketch', 'Colour Pencil Art', 'Canvas Painting',
    'Blood Art', 'Fingerprint Tree', 'Paper Quilling', 'Mobile Case Sketching',
    'Pencil Curving', 'Couple Portraits', 'Acrylic Painting', 'Oil Painting',

];

const PLACEHOLDERS: GalleryItem[] = [

    { _id: '1', title: 'Lord Murugan Painting', category: 'Canvas Painting', imageUrl: '/artwork/canvas_painting.jpg', isFeatured: true, views: 254, tags: [], publicId: '', description: '', createdAt: '' },
    { _id: '2', title: 'Rekha Name Quilling', category: 'Paper Quilling', imageUrl: '/artwork/quil_art.jpg', isFeatured: false, views: 189, tags: [], publicId: '', description: '', createdAt: '' },
    { _id: '3', title: 'Boy or Girl Fingerprint Tree', category: 'Fingerprint Tree', imageUrl: '/artwork/fingerprint_tree_1.jpg', isFeatured: false, views: 156, tags: [], publicId: '', description: '', createdAt: '' },
    { _id: '4', title: 'Vijay & Divya Fingerprint Tree', category: 'Fingerprint Tree', imageUrl: '/artwork/fingerprint_tree_2.jpg', isFeatured: true, views: 312, tags: [], publicId: '', description: '', createdAt: '' },
    { _id: '5', title: 'Phone Case Eye Sketch', category: 'Mobile Case Sketching', imageUrl: '/artwork/mobile_back_cover.jpg', isFeatured: false, views: 298, tags: [], publicId: '', description: '', createdAt: '' },
    { _id: '6', title: 'Bharatanatyam Dancer', category: 'Colour Pencil Art', imageUrl: '/artwork/colour_pencil.jpg', isFeatured: true, views: 467, tags: [], publicId: '', description: '', createdAt: '' },
    { _id: '7', title: 'Murugan & Peacock', category: 'Colour Pencil Art', imageUrl: '/artwork/multiple_colour_pencils.jpg', isFeatured: true, views: 521, tags: [], publicId: '', description: '', createdAt: '' },
    { _id: '8', title: 'Boy Portrait Sketch', category: 'Pencil Sketch', imageUrl: '/artwork/pencil_sketching.jpg', isFeatured: false, views: 343, tags: [], publicId: '', description: '', createdAt: '' },
    { _id: '9', title: 'Boundless Love Blood Art', category: 'Blood Art', imageUrl: '/artwork/blood_art.jpg', isFeatured: true, views: 689, tags: [], publicId: '', description: '', createdAt: '' },
    { _id: '10', title: 'Pencil Curving Miniature', category: 'Pencil Curving', imageUrl: '/artwork/pencil_curving.jpg', isFeatured: true, views: 411, tags: [], publicId: '', description: '', createdAt: '' },
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

/* ─── Component ─────────────────────────────────────────────────── */
const GalleryPage = () => {
    const [activeCategory, setActiveCategory] = useState('All');
    const [search, setSearch] = useState('');
    const [lightbox, setLightbox] = useState<GalleryItem | null>(null);
    const { ref, inView } = useInView({ triggerOnce: true, threshold: 0.05 });

    const { data, isLoading } = useQuery({
        queryKey: ['gallery', activeCategory, search],
        queryFn: () =>
            galleryAPI.getAll({
                ...(activeCategory !== 'All' ? { category: activeCategory } : {}),
                ...(search ? { search } : {}),
                limit: 50,
            }).then(r => r.data.data as GalleryItem[]),
    });

    const serverItems = data || [];
    const allItems = [...serverItems, ...PLACEHOLDERS];

    const items = allItems.filter(p =>
        (activeCategory === 'All' || p.category === activeCategory) &&
        (!search || p.title.toLowerCase().includes(search.toLowerCase()))
    );

    return (
        <div style={{ minHeight: '100vh', background: DARK }}>

            {/* ══════════════════ HERO ══════════════════ */}
            <div style={{ background: DARK2, borderBottom: '1px solid rgba(212,175,55,0.07)', paddingTop: 112, paddingBottom: 60 }}>
                <div style={{ ...CONTAINER, display: 'flex', flexDirection: 'column', alignItems: 'center', textAlign: 'center' }}>

                    <motion.div
                        initial={{ opacity: 0, y: 28 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.65, ease: 'easeOut' }}
                        style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', width: '100%' }}
                    >
                        {/* Eyebrow */}
                        <span style={{ color: GOLD, fontSize: 12, fontWeight: 700, letterSpacing: '0.26em', textTransform: 'uppercase', marginBottom: 18 }}>
                            Artworks
                        </span>

                        {/* Heading */}
                        <h1 className="font-cinzel" style={{ fontSize: 'clamp(40px, 7vw, 76px)', fontWeight: 800, color: GOLD, lineHeight: 1.08, margin: '0 0 20px' }}>
                            Gallery
                        </h1>

                        {/* Gold divider */}
                        <div style={{ width: 56, height: 2, borderRadius: 999, background: `linear-gradient(90deg,transparent,${GOLD},transparent)`, marginBottom: 22 }} />

                        {/* Description */}
                        <p style={{ fontSize: 16, lineHeight: 1.75, color: '#888', maxWidth: 500, margin: '0 0 36px' }}>
                            Browse our complete collection of handcrafted masterpieces.
                        </p>

                        {/* ── Search bar ── */}
                        <motion.div
                            initial={{ opacity: 0, y: 16 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.25, duration: 0.5 }}
                            style={{ position: 'relative', width: '100%', maxWidth: 560 }}
                        >
                            <Search
                                size={17}
                                style={{ position: 'absolute', left: 20, top: '50%', transform: 'translateY(-50%)', color: GOLD, pointerEvents: 'none' }}
                            />
                            <input
                                value={search}
                                onChange={e => setSearch(e.target.value)}
                                placeholder="Search artworks…"
                                style={{
                                    width: '100%',
                                    padding: '15px 48px 15px 52px',
                                    borderRadius: 999,
                                    fontSize: 15,
                                    outline: 'none',
                                    fontFamily: 'inherit',
                                    background: 'rgba(255,255,255,0.05)',
                                    border: '1px solid rgba(212,175,55,0.25)',
                                    color: '#F0F0F0',
                                    boxSizing: 'border-box',
                                    transition: 'border-color 0.2s',
                                }}
                                onFocus={e => (e.target.style.borderColor = 'rgba(212,175,55,0.6)')}
                                onBlur={e => (e.target.style.borderColor = 'rgba(212,175,55,0.25)')}
                            />
                            {search && (
                                <button
                                    onClick={() => setSearch('')}
                                    style={{ position: 'absolute', right: 18, top: '50%', transform: 'translateY(-50%)', background: 'none', border: 'none', cursor: 'pointer', color: '#666', display: 'flex', alignItems: 'center' }}
                                >
                                    <X size={15} />
                                </button>
                            )}
                        </motion.div>
                    </motion.div>
                </div>
            </div>

            {/* ══════════════════ CATEGORY FILTERS ══════════════════ */}
            <div style={{ background: DARK2, borderBottom: '1px solid rgba(212,175,55,0.06)', paddingTop: 22, paddingBottom: 22 }}>
                <div style={CONTAINER}>
                    <motion.div
                        initial={{ opacity: 0, y: 14 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.35, duration: 0.45 }}
                        style={{ display: 'flex', flexWrap: 'wrap', gap: 10, justifyContent: 'center' }}
                    >
                        {CATEGORIES.map(cat => (
                            <motion.button
                                key={cat}
                                whileHover={{ scale: 1.04 }}
                                whileTap={{ scale: 0.96 }}
                                onClick={() => setActiveCategory(cat)}
                                style={{
                                    padding: '8px 18px', borderRadius: 999,
                                    fontSize: 13, fontWeight: activeCategory === cat ? 700 : 400,
                                    cursor: 'pointer', transition: 'all 0.2s', whiteSpace: 'nowrap',
                                    background: activeCategory === cat ? `linear-gradient(135deg,${GOLD},#B8961E)` : 'rgba(255,255,255,0.04)',
                                    color: activeCategory === cat ? '#0D0D12' : '#888',
                                    border: activeCategory === cat ? 'none' : '1px solid rgba(212,175,55,0.14)',
                                    fontFamily: 'inherit',
                                }}
                            >
                                {cat}
                            </motion.button>
                        ))}
                    </motion.div>
                </div>
            </div>

            {/* ══════════════════ GALLERY GRID ══════════════════ */}
            <div ref={ref} style={{ paddingTop: 52, paddingBottom: 80, ...CONTAINER }}>

                {/* Results count */}
                {!isLoading && (
                    <motion.p
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        style={{ fontSize: 13, color: '#444', marginBottom: 28, textAlign: 'center' }}
                    >
                        {items.length} artwork{items.length !== 1 ? 's' : ''} found
                        {activeCategory !== 'All' && <> in <span style={{ color: GOLD }}>{activeCategory}</span></>}
                    </motion.p>
                )}

                {/* Loading skeleton */}
                {isLoading && (
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: 24 }}>
                        {[...Array(12)].map((_, i) => (
                            <div key={i} style={{ borderRadius: 18, overflow: 'hidden', background: 'rgba(255,255,255,0.04)', height: 260 + (i % 3) * 40 }} className="shimmer" />
                        ))}
                    </div>
                )}

                {/* Empty state */}
                {!isLoading && items.length === 0 && (
                    <motion.div
                        initial={{ opacity: 0 }} animate={{ opacity: 1 }}
                        style={{ textAlign: 'center', padding: '80px 0', color: '#444' }}
                    >
                        <p style={{ fontSize: 48, marginBottom: 16 }}>🎨</p>
                        <p style={{ fontSize: 16 }}>No artworks found. Try a different filter or search term.</p>
                    </motion.div>
                )}

                {/* Grid */}
                {!isLoading && items.length > 0 && (
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(290px, 1fr))', gap: 24 }}>
                        {items.map((item, i) => (
                            <motion.div
                                key={item._id}
                                initial={{ opacity: 0, scale: 0.93 }}
                                animate={inView ? { opacity: 1, scale: 1 } : {}}
                                transition={{ duration: 0.42, delay: Math.min(i * 0.05, 0.45) }}
                                whileHover={{ y: -6, boxShadow: '0 20px 48px rgba(0,0,0,0.5)' }}
                                onClick={() => setLightbox(item)}
                                style={{
                                    position: 'relative',
                                    borderRadius: 18,
                                    overflow: 'hidden',
                                    cursor: 'pointer',
                                    border: '1px solid rgba(212,175,55,0.14)',
                                    background: 'rgba(255,255,255,0.02)',
                                    aspectRatio: '4/3',
                                    transition: 'border-color 0.25s',
                                }}
                                onMouseEnter={e => (e.currentTarget.style.borderColor = 'rgba(212,175,55,0.42)')}
                                onMouseLeave={e => (e.currentTarget.style.borderColor = 'rgba(212,175,55,0.14)')}
                            >
                                {/* Image */}
                                <img
                                    src={item.imageUrl}
                                    alt={item.title}
                                    loading="lazy"
                                    style={{ width: '100%', height: '100%', objectFit: 'contain', backgroundColor: 'rgba(0,0,0,0.4)', display: 'block', transition: 'transform 0.5s ease' }}
                                    onMouseEnter={e => ((e.target as HTMLImageElement).style.transform = 'scale(1.04)')}
                                    onMouseLeave={e => ((e.target as HTMLImageElement).style.transform = 'scale(1)')}
                                />

                                {/* Hover overlay */}
                                <div style={{
                                    position: 'absolute', inset: 0,
                                    background: 'linear-gradient(to top, rgba(10,10,15,0.92) 0%, transparent 55%)',
                                    opacity: 0, transition: 'opacity 0.3s',
                                    display: 'flex', flexDirection: 'column', justifyContent: 'flex-end',
                                    padding: '20px 18px',
                                }}
                                    onMouseEnter={e => (e.currentTarget.style.opacity = '1')}
                                    onMouseLeave={e => (e.currentTarget.style.opacity = '0')}
                                >
                                    <div style={{ display: 'flex', alignItems: 'flex-end', justifyContent: 'space-between', gap: 8 }}>
                                        <div>
                                            <p style={{ fontSize: 11, color: GOLD, marginBottom: 4, fontWeight: 600, letterSpacing: '0.05em' }}>{item.category}</p>
                                            <h3 style={{ fontSize: 15, fontWeight: 700, color: '#fff', lineHeight: 1.3 }}>{item.title}</h3>
                                        </div>
                                        <div style={{ width: 36, height: 36, borderRadius: '50%', background: 'rgba(212,175,55,0.2)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, color: GOLD }}>
                                            <ZoomIn size={15} />
                                        </div>
                                    </div>
                                </div>

                                {/* Featured star badge */}
                                {item.isFeatured && (
                                    <div style={{
                                        position: 'absolute', top: 12, left: 12,
                                        width: 30, height: 30, borderRadius: '50%',
                                        background: `linear-gradient(135deg,${GOLD},#B8961E)`,
                                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                                    }}>
                                        <Star size={13} fill="#0D0D12" strokeWidth={0} />
                                    </div>
                                )}

                                {/* View count */}
                                {item.views > 0 && (
                                    <div style={{
                                        position: 'absolute', top: 12, right: 12,
                                        display: 'flex', alignItems: 'center', gap: 4,
                                        padding: '4px 10px', borderRadius: 999,
                                        background: 'rgba(0,0,0,0.55)', color: '#aaa', fontSize: 11,
                                    }}>
                                        <Eye size={11} /> {item.views}
                                    </div>
                                )}
                            </motion.div>
                        ))}
                    </div>
                )}
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
                            position: 'fixed', inset: 0, zIndex: 50,
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
                                    position: 'absolute', top: -16, right: -16, zIndex: 10,
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
                                    <Eye size={14} /> {lightbox.views} views
                                </div>
                            </div>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
};

export default GalleryPage;
