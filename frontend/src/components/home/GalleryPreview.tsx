import { motion, AnimatePresence } from 'framer-motion';
import { useInView } from 'react-intersection-observer';
import { useQuery } from '@tanstack/react-query';
import { galleryAPI } from '../../lib/api';
import type { GalleryItem } from '../../types';
import { Link } from 'react-router-dom';
import { Eye, ArrowRight, X } from 'lucide-react';
import { useState } from 'react';

const placeholderImages = [
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

const GalleryPreview = () => {
    const { ref, inView } = useInView({ triggerOnce: true, threshold: 0.1 });
    const [hovered, setHovered] = useState<string | null>(null);
    const [lightbox, setLightbox] = useState<GalleryItem | null>(null);

    const { data } = useQuery({
        queryKey: ['gallery-preview'],
        queryFn: () => galleryAPI.getAll({ limit: 8 }).then(r => r.data.data as GalleryItem[]),
    });

    const serverItems = data || [];
    const items = [...serverItems, ...placeholderImages].slice(0, 10); // Show max 10 in preview

    return (
        <section ref={ref} className="py-24 px-4" style={{ background: 'var(--dark-surface)' }}>
            <div className="max-w-7xl mx-auto">
                <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    animate={inView ? { opacity: 1, y: 0 } : {}}
                    transition={{ duration: 0.6 }}
                    className="text-center mb-16"
                >
                    <span className="text-xs tracking-widest uppercase" style={{ color: 'var(--gold)' }}>Artworks</span>
                    <h2 className="font-cinzel text-4xl md:text-5xl font-bold mt-3 mb-4">
                        <span className="gradient-text">Gallery Showcase</span>
                    </h2>
                    <p className="max-w-xl mx-auto" style={{ color: 'var(--text-secondary)' }}>
                        A curated collection of our finest work — each piece a timeless masterpiece
                    </p>
                </motion.div>

                {/* Masonry grid */}
                <div className="masonry-grid">
                    {items.map((item, i) => (
                        <motion.div
                            key={item._id}
                            initial={{ opacity: 0, scale: 0.9 }}
                            animate={inView ? { opacity: 1, scale: 1 } : {}}
                            transition={{ duration: 0.5, delay: i * 0.07 }}
                            className="relative overflow-hidden rounded-2xl cursor-pointer group"
                            onMouseEnter={() => setHovered(item._id)}
                            onMouseLeave={() => setHovered(null)}
                            onClick={() => setLightbox(item)}
                        >
                            <img
                                src={item.imageUrl}
                                alt={item.title}
                                className="w-full object-cover transition-transform duration-500 group-hover:scale-110"
                                style={{ display: 'block' }}
                                loading="lazy"
                            />
                            <motion.div
                                initial={{ opacity: 0 }}
                                animate={{ opacity: hovered === item._id ? 1 : 0 }}
                                transition={{ duration: 0.3 }}
                                className="absolute inset-0 flex flex-col justify-end p-4"
                                style={{ background: 'linear-gradient(to top, rgba(10,10,15,0.9) 0%, rgba(10,10,15,0.4) 50%, transparent 100%)' }}
                            >
                                <p className="text-xs mb-1" style={{ color: 'var(--gold)' }}>{item.category}</p>
                                <h3 className="font-cinzel font-bold text-sm" style={{ color: 'var(--text-primary)' }}>{item.title}</h3>
                                <div className="flex items-center gap-1 mt-1" style={{ color: 'var(--text-secondary)' }}>
                                    <Eye size={12} />
                                    <span className="text-xs">{item.views}</span>
                                </div>
                            </motion.div>
                            {item.isFeatured && (
                                <div className="absolute top-3 left-3">
                                    <span className="text-xs px-2 py-1 rounded-full font-medium" style={{ background: 'var(--gradient-primary)', color: '#000' }}>
                                        Featured
                                    </span>
                                </div>
                            )}
                        </motion.div>
                    ))}
                </div>

                <motion.div
                    initial={{ opacity: 0 }}
                    animate={inView ? { opacity: 1 } : {}}
                    transition={{ delay: 0.9 }}
                    className="text-center mt-12"
                >
                    <Link to="/gallery">
                        <motion.button
                            whileHover={{ scale: 1.05, y: -2 }}
                            className="btn-gold flex items-center gap-2 px-10 py-3 rounded-full font-semibold tracking-wider text-sm mx-auto"
                        >
                            View Full Gallery <ArrowRight size={16} />
                        </motion.button>
                    </Link>
                </motion.div>
            </div>

            {/* Lightbox */}
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

                            <img
                                src={lightbox.imageUrl}
                                alt={lightbox.title}
                                style={{ width: '100%', maxHeight: '80vh', objectFit: 'contain', borderRadius: 18, display: 'block' }}
                            />

                            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginTop: 18, padding: '0 4px' }}>
                                <div>
                                    <p style={{ fontSize: 12, color: 'var(--gold)', marginBottom: 4, fontWeight: 600, letterSpacing: '0.06em', textTransform: 'uppercase' }}>{lightbox.category}</p>
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
        </section>
    );
};

export default GalleryPreview;
