import { motion } from 'framer-motion';
import { useInView } from 'react-intersection-observer';
import { useQuery } from '@tanstack/react-query';
import { servicesAPI } from '../../lib/api';
import type {  Service  } from '../../types';
import { Link } from 'react-router-dom';
import { Calendar, DollarSign, ArrowRight } from 'lucide-react';

const placeholderServices: Service[] = [
    { _id: '1', title: 'Pencil Sketching', description: 'Hyper-realistic pencil portraits capturing every detail with artistic precision.', category: 'Drawing', imageUrl: 'https://images.unsplash.com/photo-1513364776144-60967b0f800f?w=400&q=80', startingPrice: 800, priceRange: '₹800 – ₹3,000', estimatedDays: '5-7 days', features: ['Reference photo required', 'A4/A3 sizes', 'Premium cartridge paper'], isActive: true, isFeatured: true },
    { _id: '2', title: 'Colour Pencil Art', description: 'Vibrant colour pencil masterpieces bursting with life and emotion.', category: 'Drawing', imageUrl: 'https://images.unsplash.com/photo-1541961017774-22349e4a1262?w=400&q=80', startingPrice: 1200, priceRange: '₹1,200 – ₹4,500', estimatedDays: '7-10 days', features: ['Vivid colours', 'Smooth blending', 'Multiple sizes'], isActive: true, isFeatured: true },
    { _id: '3', title: 'Acrylic Paintings', description: 'Bold, expressive acrylic paintings on premium canvas with lasting colours.', category: 'Painting', imageUrl: 'https://images.unsplash.com/photo-1579783902614-a3fb3927b6a5?w=400&q=80', startingPrice: 2000, priceRange: '₹2,000 – ₹8,000', estimatedDays: '10-14 days', features: ['Canvas painting', 'UV protected', 'Ready to hang'], isActive: true, isFeatured: true },
    { _id: '4', title: 'Oil Paintings', description: 'Classic oil paintings with rich textures and timeless depth of colour.', category: 'Painting', imageUrl: 'https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?w=400&q=80', startingPrice: 3500, priceRange: '₹3,500 – ₹15,000', estimatedDays: '14-21 days', features: ['Linseed oil base', 'Rich texture', 'Aging resistant'], isActive: true, isFeatured: true },
    { _id: '5', title: 'Blood Art', description: 'Unique and powerful artwork created with artistic blood-like pigments.', category: 'Special', imageUrl: 'https://images.unsplash.com/photo-1561214115-f2f134cc4912?w=400&q=80', startingPrice: 1500, priceRange: '₹1,500 – ₹5,000', estimatedDays: '7-10 days', features: ['Special pigment', 'Unique medium', 'Certificate included'], isActive: true, isFeatured: false },
    { _id: '6', title: 'Turmeric Painting', description: 'Traditional Indian art using natural turmeric for warm golden tones.', category: 'Special', imageUrl: 'https://images.unsplash.com/photo-1493106641515-6b5631de4bb9?w=400&q=80', startingPrice: 1000, priceRange: '₹1,000 – ₹3,500', estimatedDays: '5-7 days', features: ['Natural medium', 'Golden hues', 'Traditional art'], isActive: true, isFeatured: false },
    { _id: '7', title: 'Quill Art', description: 'Intricate quilling paper art shaped into stunning portraits and patterns.', category: 'Craft', imageUrl: 'https://images.unsplash.com/photo-1517697471339-4aa32003c11a?w=400&q=80', startingPrice: 1800, priceRange: '₹1,800 – ₹6,000', estimatedDays: '10-14 days', features: ['3D texture', 'Paper quilling', 'Unique pieces'], isActive: true, isFeatured: false },
    { _id: '8', title: 'Fingerprint Tree', description: 'Meaningful family trees created from fingerprint impressions of loved ones.', category: 'Craft', imageUrl: 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=400&q=80', startingPrice: 2500, priceRange: '₹2,500 – ₹7,000', estimatedDays: '7-10 days', features: ['Family keepsake', 'Personalized', 'Framed ready'], isActive: true, isFeatured: true },
    { _id: '9', title: 'Paper Quilling', description: 'Delicate rolled paper art creating intricate floral and abstract designs.', category: 'Craft', imageUrl: 'https://images.unsplash.com/photo-1524335442-77da9cd08c84?w=400&q=80', startingPrice: 1200, priceRange: '₹1,200 – ₹4,000', estimatedDays: '7-14 days', features: ['Paper art', 'Detailed work', 'Gift ready'], isActive: true, isFeatured: false },
    { _id: '10', title: 'Event Artwork', description: 'Live event sketching and custom artwork for weddings, birthdays & events.', category: 'Event', imageUrl: 'https://images.unsplash.com/photo-1519741497674-611481863552?w=400&q=80', startingPrice: 5000, priceRange: '₹5,000 – ₹20,000', estimatedDays: 'On-site', features: ['Live sketching', 'Event coverage', 'Same day delivery'], isActive: true, isFeatured: true },
    { _id: '11', title: 'Wall Murals', description: 'Large-scale wall murals transforming spaces into breathtaking art installations.', category: 'Mural', imageUrl: 'https://images.unsplash.com/photo-1571115764595-644a1f56a55c?w=400&q=80', startingPrice: 8000, priceRange: '₹8,000 – ₹50,000', estimatedDays: 'By consultation', features: ['On-site work', 'Custom design', 'Durable paints'], isActive: true, isFeatured: false },
    { _id: '12', title: 'Custom Photo Frames', description: 'Handcrafted premium frames to display your most precious memories forever.', category: 'Frames', imageUrl: 'https://images.unsplash.com/photo-1544931170-b5b55a2b0f58?w=400&q=80', startingPrice: 500, priceRange: '₹500 – ₹3,000', estimatedDays: '3-5 days', features: ['Multiple sizes', 'Custom colours', 'Premium material'], isActive: true, isFeatured: true },
];

const ServicesSection = () => {
    const { ref, inView } = useInView({ triggerOnce: true, threshold: 0.1 });
    const { data } = useQuery({
        queryKey: ['services'],
        queryFn: () => servicesAPI.getAll().then(r => r.data.data as Service[]),
    });

    const services = data && data.length > 0 ? data : placeholderServices;

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
                            <div className="relative h-48 overflow-hidden">
                                <img
                                    src={service.imageUrl}
                                    alt={service.title}
                                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                                />
                                <div className="absolute inset-0" style={{ background: 'linear-gradient(to top, rgba(10,10,15,0.8), transparent)' }} />
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
        </section>
    );
};

export default ServicesSection;
