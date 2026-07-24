import { motion } from 'framer-motion';
import { useInView } from 'react-intersection-observer';
import { Hand, Star, ShoppingCart, Truck, DollarSign, Package, Gift, Zap } from 'lucide-react';

const features = [
  { icon: Hand, title: '100% Handmade', description: 'Every piece meticulously crafted by skilled hands' },
  { icon: Star, title: 'Premium Quality', description: 'Museum-grade materials for lasting beauty' },
  { icon: ShoppingCart, title: 'Custom Orders', description: 'Personalized artwork tailored to your vision' },
  { icon: Truck, title: 'Fast Delivery', description: 'Safe & timely delivery across India' },
  { icon: DollarSign, title: 'Affordable Pricing', description: 'Premium art at accessible prices' },
  { icon: Package, title: 'Safe Packaging', description: 'Triple-protected packaging for safe transit' },
  { icon: Gift, title: 'Personalized Gifts', description: 'Perfect custom gifts for every occasion' },
  { icon: Zap, title: 'Quick Turnaround', description: '7-14 days for most artwork orders' },
];

const FeaturesSection = () => {
  const { ref, inView } = useInView({ triggerOnce: true, threshold: 0.1 });

  return (
    <section ref={ref} className="py-20 px-4" style={{ background: 'var(--dark-surface)' }}>
      <div className="max-w-7xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <span className="text-xs tracking-widest uppercase" style={{ color: 'var(--gold)' }}>Why Choose Us</span>
          <h2 className="font-cinzel text-4xl md:text-5xl font-bold mt-3 mb-4">
            <span className="gradient-text">Our Promise</span>
          </h2>
          <p className="max-w-xl mx-auto" style={{ color: 'var(--text-secondary)' }}>
            Committed to delivering exceptional art experiences with every stroke of the brush
          </p>
        </motion.div>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
          {features.map((feature, i) => {
            const Icon = feature.icon;
            return (
              <motion.div
                key={feature.title}
                initial={{ opacity: 0, y: 30 }}
                animate={inView ? { opacity: 1, y: 0 } : {}}
                transition={{ duration: 0.5, delay: i * 0.08 }}
                whileHover={{ y: -5, scale: 1.02 }}
                className="glass rounded-2xl p-6 text-center group cursor-default"
              >
                <div
                  className="w-12 h-12 rounded-xl flex items-center justify-center mx-auto mb-4 transition-transform duration-300 group-hover:scale-110"
                  style={{ background: 'rgba(212,175,55,0.1)', color: 'var(--gold)' }}
                >
                  <Icon size={22} />
                </div>
                <h3 className="font-semibold text-sm mb-2" style={{ color: 'var(--text-primary)' }}>{feature.title}</h3>
                <p className="text-xs leading-relaxed" style={{ color: 'var(--text-secondary)' }}>{feature.description}</p>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default FeaturesSection;
