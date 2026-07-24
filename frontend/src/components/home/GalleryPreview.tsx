import { motion } from 'framer-motion';
import { useInView } from 'react-intersection-observer';
import { useQuery } from '@tanstack/react-query';
import { galleryAPI } from '../../lib/api';
import type {  GalleryItem  } from '../../types';
import { Link } from 'react-router-dom';
import { Eye, ArrowRight } from 'lucide-react';
import { useState } from 'react';

const placeholderImages = [
    { _id: '1', title: 'Couple Portrait', category: 'Couple Portraits', imageUrl: 'https://images.unsplash.com/photo-1543489822-c49534f3271f?w=500&q=80', isFeatured: true, views: 120, tags: [], publicId: '', description: '', createdAt: '' },
    { _id: '2', title: 'Pencil Sketch', category: 'Pencil Sketch', imageUrl: 'https://images.unsplash.com/photo-1513364776144-60967b0f800f?w=500&q=80', isFeatured: true, views: 98, tags: [], publicId: '', description: '', createdAt: '' },
    { _id: '3', title: 'Acrylic Landscape', category: 'Acrylic Painting', imageUrl: 'https://images.unsplash.com/photo-1579783902614-a3fb3927b6a5?w=500&q=80', isFeatured: false, views: 75, tags: [], publicId: '', description: '', createdAt: '' },
    { _id: '4', title: 'Oil Portrait', category: 'Oil Painting', imageUrl: 'https://images.unsplash.com/photo-1503455637927-730bce8583c0?w=500&q=80', isFeatured: true, views: 203, tags: [], publicId: '', description: '', createdAt: '' },
    { _id: '5', title: 'Wedding Gift', category: 'Wedding Gifts', imageUrl: 'https://images.unsplash.com/photo-1519741497674-611481863552?w=500&q=80', isFeatured: false, views: 88, tags: [], publicId: '', description: '', createdAt: '' },
    { _id: '6', title: 'Family Portrait', category: 'Family Portraits', imageUrl: 'https://images.unsplash.com/photo-1609220136736-443140cffec6?w=500&q=80', isFeatured: true, views: 145, tags: [], publicId: '', description: '', createdAt: '' },
    { _id: '7', title: 'Pet Portrait', category: 'Pet Portraits', imageUrl: 'https://images.unsplash.com/photo-1587300003388-59208cc962cb?w=500&q=80', isFeatured: false, views: 167, tags: [], publicId: '', description: '', createdAt: '' },
    { _id: '8', title: 'Colour Art', category: 'Colour Pencil Art', imageUrl: 'https://images.unsplash.com/photo-1541961017774-22349e4a1262?w=500&q=80', isFeatured: true, views: 92, tags: [], publicId: '', description: '', createdAt: '' },
];

const GalleryPreview = () => {
    const { ref, inView } = useInView({ triggerOnce: true, threshold: 0.1 });
    const [hovered, setHovered] = useState<string | null>(null);

    const { data } = useQuery({
        queryKey: ['gallery-preview'],
        queryFn: () => galleryAPI.getAll({ limit: 8 }).then(r => r.data.data as GalleryItem[]),
    });

    const items = data && data.length > 0 ? data : placeholderImages;

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
        </section>
    );
};

export default GalleryPreview;
