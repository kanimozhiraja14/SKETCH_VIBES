import { motion } from 'framer-motion';

const PromoBannerSection = () => {
    return (
        <section className="relative py-20 px-4 flex justify-center items-center overflow-hidden" style={{ background: 'transparent' }}>
            <motion.div
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, ease: 'easeOut' }}
                className="relative z-10 w-full max-w-lg mx-auto"
            >
                {/* Gold Glow Behind Banner */}
                <div
                    className="absolute inset-0 blur-3xl opacity-20 pointer-events-none"
                    style={{ background: 'var(--gold)', transform: 'scale(0.9)' }}
                />

                {/* Banner Wrapper */}
                <motion.div
                    whileHover={{ scale: 1.02 }}
                    transition={{ duration: 0.4 }}
                    className="relative rounded-2xl overflow-hidden shadow-2xl"
                    style={{ border: '1px solid rgba(212,175,55,0.3)', boxShadow: '0 25px 50px -12px rgba(0,0,0,0.8), 0 0 40px rgba(212,175,55,0.15)' }}
                >
                    <img
                        src="/banners/promo_banner.jpg"
                        alt="Sketch Vibes Promotional Banner"
                        className="w-full h-auto block"
                        style={{ display: 'block' }}
                    />
                </motion.div>

                {/* Optional Decorative Elements */}
                <div className="flex justify-center items-center gap-4 mt-8 opacity-70">
                    <div className="h-px w-16" style={{ background: 'var(--gradient-primary)' }} />
                    <span style={{ color: 'var(--gold)', fontSize: '0.8rem', letterSpacing: '0.2em' }}>✦</span>
                    <div className="h-px w-16" style={{ background: 'var(--gradient-primary)' }} />
                </div>
            </motion.div>
        </section>
    );
};

export default PromoBannerSection;
