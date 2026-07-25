import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useInView } from 'react-intersection-observer';
import { useQuery } from '@tanstack/react-query';
import { servicesAPI } from '../../lib/api';
import type { Service } from '../../types';
import { Link } from 'react-router-dom';
import { Calendar, DollarSign, ArrowRight, X } from 'lucide-react';

const placeholderServices: Service[] = [
    { _id: '1', title: 'Canvas Painting', description: 'Bold, expressive canvas paintings capturing culture, devotion, and life.', category: 'Painting', imageUrl: '/artwork/canvas_painting.jpg', startingPrice: 3000, priceRange: '₹3,000 – ₹8,000', estimatedDays: '10–14 days', features: ['Premium canvas', 'Vibrant colors', 'Ready to hang'], isActive: true, isFeatured: true },
    { _id: '2', title: 'Paper Quilling', description: 'Intricate and colourful paper quilling names and shapes crafted with absolute perfection.', category: 'Craft', imageUrl: '/artwork/quil_art.jpg', startingPrice: 500, priceRange: '₹500 – ₹1,500', estimatedDays: '7–10 days', features: ['3D paper texture', 'Intricate details', 'Custom names'], isActive: true, isFeatured: true },
    { _id: '3', title: 'Fingerprint Tree', description: 'Heartfelt family trees for your special occasions using fingerprint impressions.', category: 'Special', imageUrl: '/artwork/fingerprint_tree_1.jpg', startingPrice: 2500, priceRange: '₹2,500 – ₹7,000', estimatedDays: '7–10 days', features: ['Personalised keepsakes', 'Couples & Family', 'Framed options'], isActive: true, isFeatured: true },
    { _id: '5', title: 'Colour Pencil Drawing', description: 'Vibrant, hyper-realistic colour pencil masterpieces full of rich detail and emotion.', category: 'Drawing', imageUrl: '/artwork/colour_pencil.jpg', startingPrice: 1200, priceRange: '₹1,200 – ₹4,500', estimatedDays: '7–10 days', features: ['Rich vivid colours', 'Smooth blending', 'Portraits & Art'], isActive: true, isFeatured: true },
    { _id: '6', title: 'Pencil Sketching', description: 'Hyper-realistic monochrome pencil portraits capturing every expression flawlessly.', category: 'Drawing', imageUrl: '/artwork/pencil_sketching.jpg', startingPrice: 800, priceRange: '₹800 – ₹3,000', estimatedDays: '5–7 days', features: ['High realism', 'Detailed shading', 'Classic style'], isActive: true, isFeatured: true },
    { _id: '7', title: 'Blood Art', description: 'A highly unique and emotional artwork style using special reddish-brown tones.', category: 'Special', imageUrl: '/artwork/blood_art.jpg', startingPrice: 1500, priceRange: '₹1,500 – ₹5,000', estimatedDays: '7–10 days', features: ['Unique medium', 'High contrast', 'Unforgettable gift'], isActive: true, isFeatured: true },
    { _id: '4', title: 'Mobile Cover Sketching', description: 'Customised mobile back cover sketching for your favourite memories.', category: 'Special', imageUrl: '/artwork/mobile_back_cover.jpg', startingPrice: 250, priceRange: '₹250 – ₹1,000', estimatedDays: '3–5 days', features: ['Detailed sketches', 'Durable coat', 'Custom models'], isActive: true, isFeatured: true },
    { _id: '8', title: 'Pencil Curving', description: 'Mind-blowing miniature sculptures carved directly onto pencil leads.', category: 'Miniature', imageUrl: '/artwork/pencil_curving.jpg', startingPrice: 500, priceRange: '₹500 – ₹1,200', estimatedDays: '7–10 days', features: ['Micro detailing', 'Custom text carving', 'Extreme precision'], isActive: true, isFeatured: true },
];

const ServicesSection = () => {
    const { ref, inView } = useInView({ triggerOnce: true, threshold: 0.1 });
    const [lightbox, setLightbox] = useState<Service | null>(null);
    const { data } = useQuery({
        queryKey: ['services'],
        queryFn: () => servicesAPI.getAll().then(r => r.data.data as Service[]),
    });

    const serverServices = data || [];
    const services = [...serverServices, ...placeholderServices].slice(0, 8);

    return (
        <section ref={ref} className="py-24 px-4" style={{ background: 'var(--dark-bg)' }}>
            <div className="max-w-7xl mx-auto">
                <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    animate={inView ? { opacity: 1, y: 0 } : {}}
                    transition={{ duration: 0.6 }}
                    className="text-center mb-16"
                >
                    <span className="text-xs tracking-widest uppercase" style={{ color: 'var(--gold)' }}>What We Create</span>
                    <h2 className="font-cinzel text-4xl md:text-5xl font-bold mt-3 mb-4">
                        <span className="gradient-text">Our Services</span>
                    </h2>
                    <p className="max-w-2xl mx-auto" style={{ color: 'var(--text-secondary)' }}>
                        From pencil sketches to wall murals — every artwork is a unique story waiting to be told
                    </p>
                </motion.div>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                    {services.map((service, i) => (
                        <motion.div
                            key={service._id}
                            initial={{ opacity: 0, y: 40 }}
                            animate={inView ? { opacity: 1, y: 0 } : {}}
                            transition={{ duration: 0.5, delay: i * 0.06 }}
                            whileHover={{ y: -8 }}
                            className="glass rounded-2xl overflow-hidden group cursor-pointer"
                        >
                            {/* Image */}
                            <div
                                className="relative h-48 overflow-hidden"
                                style={{ backgroundColor: 'rgba(0,0,0,0.6)', cursor: 'zoom-in' }}
                                onClick={() => setLightbox(service)}
                            >
                                <img
                                    src={service.imageUrl}
                                    alt={service.title}
                                    className="w-full h-full object-contain transition-transform duration-500 group-hover:scale-105"
                                />
                                <div className="absolute inset-0 pointer-events-none" style={{ background: 'linear-gradient(to top, rgba(10,10,15,0.8), transparent)' }} />
                                <div className="absolute top-3 right-3">
                                    <span className="text-xs px-2 py-1 rounded-full" style={{ background: 'rgba(212,175,55,0.2)', color: 'var(--gold)', border: '1px solid rgba(212,175,55,0.3)' }}>
                                        {service.category}
                                    </span>
                                </div>
                            </div>

                            {/* Content */}
                            <div className="p-5">
                                <h3 className="font-cinzel font-bold text-lg mb-2" style={{ color: 'var(--text-primary)' }}>{service.title}</h3>
                                <p className="text-xs leading-relaxed mb-4" style={{ color: 'var(--text-secondary)' }}>{service.description}</p>

                                {/* Features */}
                                <ul className="space-y-1 mb-4">
                                    {service.features?.slice(0, 3).map((f) => (
                                        <li key={f} className="flex items-center gap-2 text-xs" style={{ color: 'var(--text-secondary)' }}>
                                            <span style={{ color: 'var(--gold)' }}>✦</span> {f}
                                        </li>
                                    ))}
                                </ul>

                                {/* Price & days */}
                                <div className="flex items-center justify-between mb-4">
                                    <div className="flex items-center gap-1" style={{ color: 'var(--gold)' }}>
                                        <DollarSign size={14} />
                                        <span className="font-bold text-sm">{service.priceRange || `${service.startingPrice}+`}</span>
                                    </div>
                                    {service.estimatedDays && (
                                        <div className="flex items-center gap-1 text-xs" style={{ color: 'var(--text-secondary)' }}>
                                            <Calendar size={12} />
                                            {service.estimatedDays}
                                        </div>
                                    )}
                                </div>

                                {/* CTA */}
                                <a href="https://wa.me/917806906030" target="_blank" rel="noopener noreferrer">
                                    <motion.button
                                        whileHover={{ scale: 1.03 }}
                                        whileTap={{ scale: 0.97 }}
                                        className="w-full btn-gold py-2.5 rounded-xl flex items-center justify-center gap-2 text-sm font-bold"
                                    >
                                        Book Now <ArrowRight size={14} />
                                    </motion.button>
                                </a>
                            </div>
                        </motion.div>
                    ))}
                </div>

                <motion.div
                    initial={{ opacity: 0 }}
                    animate={inView ? { opacity: 1 } : {}}
                    transition={{ delay: 0.8 }}
                    className="text-center mt-12"
                >
                    <Link to="/services">
                        <motion.button
                            whileHover={{ scale: 1.05, y: -2 }}
                            className="btn-outline-gold px-10 py-3 rounded-full font-semibold tracking-wider text-sm"
                        >
                            View All Services
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
                                    Starting at {lightbox.priceRange || `₹${lightbox.startingPrice}`}
                                </div>
                            </div>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>
        </section>
    );
};

export default ServicesSection;
