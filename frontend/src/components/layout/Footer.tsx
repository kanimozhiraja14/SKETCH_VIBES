import { Link } from 'react-router-dom';
import { Camera, Mail, MessageCircle, Heart } from 'lucide-react';

const Footer = () => {
    return (
        <footer className="w-full font-inter" style={{ background: '#0D0D12' }}>
            <div className="max-w-[1300px] mx-auto px-6 py-[80px]">
                {/* Top 3 Columns */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-12 lg:gap-20 border-b pb-[60px]" style={{ borderColor: 'rgba(212,175,55,0.15)' }}>

                    {/* Column 1 - Brand */}
                    <div className="space-y-6">
                        <Link to="/" className="inline-block">
                            <span className="font-cinzel text-[32px] font-bold tracking-wider" style={{ color: '#F5F5F5' }}>
                                SKETCH_<span style={{ color: '#D4AF37' }}>VIBES23</span>
                            </span>
                        </Link>
                        <p className="text-[16px] leading-relaxed max-w-[300px]" style={{ color: '#A0A0A0' }}>
                            Premium custom artwork, personalized portraits, and event sketches crafted with passion by Artist Saran.
                        </p>
                        <div className="flex gap-4 pt-2">
                            {[
                                { icon: MessageCircle, href: 'https://wa.me/917806906030' },
                                { icon: Camera, href: 'https://instagram.com/Sketch_vibes23' },
                                { icon: Mail, href: 'mailto:sketchvibes23@gmail.com' }
                            ].map((social, i) => (
                                <a
                                    key={i}
                                    href={social.href}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="w-[40px] h-[40px] rounded-full flex items-center justify-center transition-colors duration-300 hover:bg-[#D4AF37] hover:text-[#F5F5F5]"
                                    style={{ background: '#15151D', border: '1px solid rgba(212,175,55,0.2)', color: '#D4AF37' }}
                                >
                                    <social.icon size={18} />
                                </a>
                            ))}
                        </div>
                    </div>

                    {/* Column 2 - Links */}
                    <div>
                        <h4 className="font-cinzel text-[22px] font-semibold mb-6" style={{ color: '#F5F5F5' }}>Quick Links</h4>
                        <ul className="space-y-4">
                            {[
                                { name: 'Home', path: '/' },
                                { name: 'Gallery', path: '/gallery' },
                                { name: 'Services', path: '/services' },
                                { name: 'Frames', path: '/frames' },
                                { name: 'Custom Order', path: '/order' },
                                { name: 'Contact', path: '/contact' }
                            ].map((link) => (
                                <li key={link.name}>
                                    <Link
                                        to={link.path}
                                        className="text-[16px] transition-colors duration-300 hover:text-[#D4AF37]"
                                        style={{ color: '#A0A0A0' }}
                                    >
                                        {link.name}
                                    </Link>
                                </li>
                            ))}
                        </ul>
                    </div>

                    {/* Column 3 - Contact Info */}
                    <div>
                        <h4 className="font-cinzel text-[22px] font-semibold mb-6" style={{ color: '#F5F5F5' }}>Contact Details</h4>
                        <ul className="space-y-5">
                            <li className="flex items-center gap-4 text-[16px]" style={{ color: '#A0A0A0' }}>
                                <MessageCircle size={20} style={{ color: '#D4AF37' }} />
                                <span>+91 7806906030</span>
                            </li>
                            <li className="flex items-center gap-4 text-[16px]" style={{ color: '#A0A0A0' }}>
                                <Camera size={20} style={{ color: '#D4AF37' }} />
                                <span>@Sketch_Vibes23</span>
                            </li>
                            <li className="flex items-center gap-4 text-[16px]" style={{ color: '#A0A0A0' }}>
                                <Mail size={20} style={{ color: '#D4AF37' }} />
                                <span>sketchvibes23@gmail.com</span>
                            </li>
                            <li className="flex gap-4 text-[16px] pt-1" style={{ color: '#A0A0A0' }}>
                                <span className="font-semibold px-3 py-1 rounded text-xs tracking-wider" style={{ background: '#15151D', border: '1px solid rgba(212,175,55,0.2)' }}>Mon–Sat</span>
                                <span className="pt-0.5">9:00 AM – 6:00 PM</span>
                            </li>
                        </ul>
                    </div>

                </div>

                {/* Bottom Bar */}
                <div className="flex flex-col md:flex-row justify-between items-center mt-[40px] text-[15px] space-y-4 md:space-y-0" style={{ color: '#A0A0A0' }}>
                    <p>© 2024 Sketch_Vibes23. All rights reserved.</p>
                    <p className="flex items-center gap-2">
                        Made with <Heart size={16} fill="#E1306C" color="#E1306C" /> by Artist Saran
                    </p>
                </div>
            </div>
        </footer>
    );
};

export default Footer;
