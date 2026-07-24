import { motion } from 'framer-motion';
import { useInView } from 'react-intersection-observer';
import { MessageCircle, Camera, Mail, Clock } from 'lucide-react';

/* ─── Contact data ───────────────────────────────────────── */
const CONTACTS = [
    { icon: MessageCircle, label: 'WhatsApp', value: '+91 7806906030', href: 'https://wa.me/917806906030' },
    { icon: Camera, label: 'Instagram', value: '@Sketch_Vibes23', href: 'https://instagram.com/Sketch_vibes23' },
    { icon: Mail, label: 'Email', value: 'sketchvibes23@gmail.com', href: 'mailto:sketchvibes23@gmail.com' },
    { icon: Clock, label: 'Working Hours', value: 'Mon – Sat  |  9 AM – 6 PM', href: null },
];

const SOCIALS = [
    { icon: MessageCircle, href: 'https://wa.me/917806906030' },
    { icon: Camera, href: 'https://instagram.com/Sketch_vibes23' },
    { icon: Mail, href: 'mailto:sketchvibes23@gmail.com' },
];

const GOLD = '#D4AF37';

const ContactSection = () => {
    const { ref, inView } = useInView({ triggerOnce: true, threshold: 0.1 });

    return (
        <section
            ref={ref}
            id="contact"
            style={{ background: '#0D0D12', width: '100%' }}
        >
            {/* ── Outer centering shell ─────────────────────────────── */}
            <div style={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                paddingTop: 120,
                paddingBottom: 120,
                paddingLeft: 24,
                paddingRight: 24,
            }}>

                {/* ── Header block ──────────────────────────────────────── */}
                <motion.div
                    initial={{ opacity: 0, y: 32 }}
                    animate={inView ? { opacity: 1, y: 0 } : {}}
                    transition={{ duration: 0.65, ease: 'easeOut' }}
                    style={{
                        display: 'flex',
                        flexDirection: 'column',
                        alignItems: 'center',
                        textAlign: 'center',
                        marginBottom: 72,
                        width: '100%',
                        maxWidth: 860,
                    }}
                >
                    {/* Subtitle */}
                    <span style={{
                        color: GOLD,
                        fontSize: 13,
                        fontWeight: 700,
                        letterSpacing: '0.22em',
                        textTransform: 'uppercase',
                        marginBottom: 18,
                        display: 'block',
                    }}>
                        Get In Touch
                    </span>

                    {/* Main heading */}
                    <h2
                        className="font-cinzel"
                        style={{
                            fontSize: 'clamp(40px,6vw,72px)',
                            fontWeight: 800,
                            color: GOLD,
                            lineHeight: 1.1,
                            margin: '0 0 24px',
                        }}
                    >
                        Contact Us
                    </h2>

                    {/* Gold accent line */}
                    <div style={{
                        width: 60, height: 2,
                        background: `linear-gradient(90deg,transparent,${GOLD},transparent)`,
                        borderRadius: 999,
                        marginBottom: 28,
                    }} />

                    {/* Description */}
                    <p style={{
                        fontSize: 16,
                        lineHeight: 1.75,
                        color: '#909090',
                        maxWidth: 560,
                        margin: 0,
                    }}>
                        Ready to transform your ideas into timeless artwork?<br />
                        Let's discuss your custom portrait, event sketch, or personalized artwork.
                    </p>
                </motion.div>

                {/* ── Cards container ────────────────────────────────────── */}
                <div style={{
                    width: '100%',
                    maxWidth: 860,
                    display: 'flex',
                    flexDirection: 'column',
                    gap: 20,
                    marginBottom: 56,
                }}>
                    {CONTACTS.map((item, index) => {
                        const Icon = item.icon;

                        const card = (
                            <motion.div
                                initial={{ opacity: 0, y: 28 }}
                                animate={inView ? { opacity: 1, y: 0 } : {}}
                                transition={{ duration: 0.5, delay: 0.1 + index * 0.1, ease: 'easeOut' }}
                                whileHover={item.href ? {
                                    y: -4,
                                    boxShadow: '0 12px 36px rgba(212,175,55,0.13)',
                                    borderColor: 'rgba(212,175,55,0.55)',
                                } : {}}
                                style={{
                                    display: 'flex',
                                    alignItems: 'center',
                                    gap: 28,
                                    padding: '26px 36px',
                                    borderRadius: 18,
                                    border: '1px solid rgba(212,175,55,0.28)',
                                    background: 'rgba(255,255,255,0.025)',
                                    cursor: item.href ? 'pointer' : 'default',
                                    transition: 'border-color 0.25s',
                                    width: '100%',
                                    boxSizing: 'border-box',
                                }}
                            >
                                {/* Icon circle — strictly centered */}
                                <div style={{
                                    width: 58,
                                    height: 58,
                                    borderRadius: '50%',
                                    background: 'rgba(212,175,55,0.1)',
                                    border: '1px solid rgba(212,175,55,0.2)',
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    flexShrink: 0,
                                    color: GOLD,
                                }}>
                                    <Icon size={24} strokeWidth={1.8} />
                                </div>

                                {/* Text */}
                                <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
                                    <span
                                        className="font-cinzel"
                                        style={{ fontSize: 20, fontWeight: 700, color: '#F0F0F0', lineHeight: 1.2 }}
                                    >
                                        {item.label}
                                    </span>
                                    <span style={{ fontSize: 16, color: '#888', lineHeight: 1.4 }}>
                                        {item.value}
                                    </span>
                                </div>
                            </motion.div>
                        );

                        return item.href ? (
                            <a
                                key={item.label}
                                href={item.href}
                                target="_blank"
                                rel="noopener noreferrer"
                                style={{ display: 'block', width: '100%', textDecoration: 'none' }}
                            >
                                {card}
                            </a>
                        ) : (
                            <div key={item.label} style={{ width: '100%' }}>{card}</div>
                        );
                    })}
                </div>

                {/* ── Social icons row ─────────────────────────────────── */}
                <div style={{ display: 'flex', justifyContent: 'center', gap: 20 }}>
                    {SOCIALS.map((social, i) => {
                        const Icon = social.icon;
                        return (
                            <motion.a
                                key={i}
                                href={social.href}
                                target="_blank"
                                rel="noopener noreferrer"
                                initial={{ opacity: 0, scale: 0.75 }}
                                animate={inView ? { opacity: 1, scale: 1 } : {}}
                                transition={{ duration: 0.4, delay: 0.5 + i * 0.1 }}
                                whileHover={{ scale: 1.12, backgroundColor: GOLD, color: '#0D0D12' }}
                                style={{
                                    width: 60,
                                    height: 60,
                                    borderRadius: '50%',
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    border: `1px solid ${GOLD}`,
                                    color: GOLD,
                                    background: 'transparent',
                                    textDecoration: 'none',
                                    transition: 'background 0.25s, color 0.25s',
                                }}
                            >
                                <Icon size={22} strokeWidth={1.8} />
                            </motion.a>
                        );
                    })}
                </div>
            </div>
        </section>
    );
};

export default ContactSection;
