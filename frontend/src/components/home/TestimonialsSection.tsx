import { motion } from 'framer-motion';
import { useInView } from 'react-intersection-observer';
import { useQuery } from '@tanstack/react-query';
import { testimonialsAPI } from '../../lib/api';
import type {  Testimonial  } from '../../types';
import { Star, Quote } from 'lucide-react';

const placeholderTestimonials: Testimonial[] = [
    { _id: '1', customerName: 'Priya Krishnan', rating: 5, review: 'Absolutely stunning pencil portrait of my family! Artist Saran captured every detail perfectly. The quality is beyond what I expected. Worth every rupee!', artworkType: 'Family Portrait', profilePhoto: 'https://i.pravatar.cc/80?img=1', isApproved: true, isFeatured: true, createdAt: '' },
    { _id: '2', customerName: 'Rahul Sharma', rating: 5, review: 'Got a couple portrait as a wedding anniversary gift. My wife was in tears — it was so beautiful and realistic. Will definitely order again!', artworkType: 'Couple Portrait', profilePhoto: 'https://i.pravatar.cc/80?img=12', isApproved: true, isFeatured: true, createdAt: '' },
    { _id: '3', customerName: 'Meena Sundaram', rating: 5, review: 'The fingerprint tree for our family reunion was the best gift ever! Everyone loved it. Packaging was excellent and delivery was on time.', artworkType: 'Fingerprint Tree', profilePhoto: 'https://i.pravatar.cc/80?img=5', isApproved: true, isFeatured: true, createdAt: '' },
    { _id: '4', customerName: 'Vikram Nair', rating: 5, review: 'Pet portrait of my dog was absolutely perfect! Captured his personality so well. The colour pencil art is vibrant and looks premium framed.', artworkType: 'Pet Portrait', profilePhoto: 'https://i.pravatar.cc/80?img=8', isApproved: true, isFeatured: false, createdAt: '' },
    { _id: '5', customerName: 'Divya Rajan', rating: 5, review: 'Ordered an acrylic painting for my living room — it transformed the entire space! Saran is incredibly talented and responsive to feedback.', artworkType: 'Acrylic Painting', profilePhoto: 'https://i.pravatar.cc/80?img=9', isApproved: true, isFeatured: false, createdAt: '' },
    { _id: '6', customerName: 'Arun Kumar', rating: 5, review: 'The photo frame quality is exceptional. I got four custom frames and they look outstanding. Fast delivery and great customer service!', artworkType: 'Custom Photo Frame', profilePhoto: 'https://i.pravatar.cc/80?img=15', isApproved: true, isFeatured: false, createdAt: '' },
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
                        <span className="gradient-text">Happy Customers</span>
                    </h2>
                    <p className="max-w-xl mx-auto" style={{ color: 'var(--text-secondary)' }}>
                        500+ satisfied customers who treasure their personalized artwork
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
