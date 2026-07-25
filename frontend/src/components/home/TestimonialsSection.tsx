import { motion } from 'framer-motion';
import { useInView } from 'react-intersection-observer';
import { useQuery } from '@tanstack/react-query';
import { testimonialsAPI } from '../../lib/api';
import type { Testimonial } from '../../types';
import { Star, Quote } from 'lucide-react';

const placeholderTestimonials: Testimonial[] = [
    { _id: '1', customerName: 'Priyadharshini – Chennai', rating: 5, review: 'Pencil portrait romba nalla irundhuchu. En akka-ku gift ah kuduthen, avanga romba happy aayitanga. Kandippa recommend panren.', artworkType: 'Pencil Portrait', profilePhoto: '/testimonials/priyadharshini.png', isApproved: true, isFeatured: true, createdAt: '' },
    { _id: '2', customerName: 'Karthikeyan – Coimbatore', rating: 5, review: 'Enga family portrait super ah vandhirundhuchu. Original photo madhiri irundhuchu. Family ku romba pidichiruku.', artworkType: 'Family Portrait', profilePhoto: '/testimonials/karthikeyan.png', isApproved: true, isFeatured: true, createdAt: '' },
    { _id: '3', customerName: 'Meenakshi – Madurai', rating: 5, review: 'Wedding gift ah order pannom. Result expected vida better ah irundhuchu. Delivery um correct time ku vandhuduchu.', artworkType: 'Wedding Sketch', profilePhoto: '/testimonials/meenakshi.png', isApproved: true, isFeatured: true, createdAt: '' },
    { _id: '4', customerName: 'Saravanan – Trichy', rating: 5, review: 'Frame quality semma. Hall la maati vachirukom, vandha ellarum pathi kekuraanga.', artworkType: 'Custom Frame', profilePhoto: '/testimonials/saravanan.png', isApproved: true, isFeatured: false, createdAt: '' },
    { _id: '5', customerName: 'Kavitha – Salem', rating: 5, review: 'Enga dog oda portrait super ah iruku. Face expression kooda perfect ah capture pannirukanga.', artworkType: 'Pet Portrait', profilePhoto: '/testimonials/kavitha.png', isApproved: true, isFeatured: false, createdAt: '' },
    { _id: '6', customerName: 'Arun Prakash – Erode', rating: 5, review: 'Artwork work romba alaga irundhuchu. Veetuku vandhavanga ellarume paarthu super ah iruku nu sonnanga. Semma work!', artworkType: 'Custom Artwork', profilePhoto: '/testimonials/arun.png', isApproved: true, isFeatured: false, createdAt: '' },
];

const RatingStars = ({ rating }: { rating: number }) => (
    <div className="flex gap-1">
        {[...Array(5)].map((_, i) => (
            <Star key={i} size={14} fill={i < rating ? '#d4af37' : 'transparent'} color={i < rating ? '#d4af37' : '#555'} />
        ))}
    </div>
);

const TestimonialsSection = () => {
    const { ref, inView } = useInView({ triggerOnce: true, threshold: 0.1 });
    const { data } = useQuery({
        queryKey: ['testimonials'],
        queryFn: () => testimonialsAPI.getAll().then(r => r.data.data as Testimonial[]),
    });

    const testimonials = data && data.length > 0 ? data : placeholderTestimonials;

    return (
        <section ref={ref} className="py-24 px-4" style={{ background: 'var(--dark-bg)' }}>
            <div className="max-w-7xl mx-auto">
                <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    animate={inView ? { opacity: 1, y: 0 } : {}}
                    transition={{ duration: 0.6 }}
                    className="text-center mb-16"
                >
                    <span className="text-xs tracking-widest uppercase" style={{ color: 'var(--gold)' }}>Testimonials</span>
                    <h2 className="font-cinzel text-4xl md:text-5xl font-bold mt-3 mb-4">
                        <span className="gradient-text">HAPPY CUSTOMERS FROM TAMIL NADU</span>
                    </h2>
                    <p className="max-w-xl mx-auto" style={{ color: 'var(--text-secondary)' }}>
                        500+ customers across Tamil Nadu trust Sketch_Vibes23 for personalized handmade artwork.
                    </p>
                </motion.div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {testimonials.slice(0, 6).map((t, i) => (
                        <motion.div
                            key={t._id}
                            initial={{ opacity: 0, y: 40 }}
                            animate={inView ? { opacity: 1, y: 0 } : {}}
                            transition={{ duration: 0.5, delay: i * 0.1 }}
                            whileHover={{ y: -5 }}
                            className="glass-gold rounded-2xl p-6 relative"
                        >
                            <Quote
                                size={40}
                                className="absolute top-4 right-4 opacity-10"
                                style={{ color: 'var(--gold)' }}
                            />
                            <div className="flex items-center gap-3 mb-4">
                                <img
                                    src={t.profilePhoto || `https://i.pravatar.cc/60?u=${t._id}`}
                                    alt={t.customerName}
                                    className="w-12 h-12 rounded-full object-cover"
                                    style={{ border: '2px solid rgba(212,175,55,0.4)' }}
                                />
                                <div>
                                    <h4 className="font-semibold text-sm" style={{ color: 'var(--text-primary)' }}>{t.customerName}</h4>
                                    {t.artworkType && (
                                        <p className="text-xs" style={{ color: 'var(--gold)' }}>{t.artworkType}</p>
                                    )}
                                </div>
                            </div>
                            <RatingStars rating={t.rating} />
                            <p className="text-sm leading-relaxed mt-3" style={{ color: 'var(--text-secondary)' }}>
                                "{t.review}"
                            </p>
                        </motion.div>
                    ))}
                </div>

                {/* Overall rating bar */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={inView ? { opacity: 1, y: 0 } : {}}
                    transition={{ delay: 0.8 }}
                    className="mt-12 glass rounded-2xl p-8 flex flex-wrap justify-center gap-10"
                >
                    {[
                        { label: 'Overall Rating', value: '5.0 / 5.0' },
                        { label: 'Happy Customers', value: '500+' },
                        { label: 'Repeat Orders', value: '60%' },
                        { label: 'On-Time Delivery', value: '98%' },
                    ].map((stat) => (
                        <div key={stat.label} className="text-center">
                            <div className="font-cinzel text-2xl font-bold gradient-text">{stat.value}</div>
                            <div className="text-xs mt-1" style={{ color: 'var(--text-secondary)' }}>{stat.label}</div>
                        </div>
                    ))}
                </motion.div>
            </div>
        </section>
    );
};

export default TestimonialsSection;
