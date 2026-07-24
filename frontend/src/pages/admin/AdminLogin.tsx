import { useState } from 'react';
import { motion } from 'framer-motion';
import { useAuth } from '../../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import { Lock, Mail, Eye, EyeOff, LogIn } from 'lucide-react';

const AdminLogin = () => {
    const [showPassword, setShowPassword] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [form, setForm] = useState({ email: '', password: '' });
    const { login } = useAuth();
    const navigate = useNavigate();

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);
        try {
            await login(form.email, form.password);
            toast.success('Welcome back, Admin! 🎨');
            navigate('/admin/dashboard');
        } catch (err: any) {
            toast.error(err?.response?.data?.message || 'Invalid credentials');
        } finally {
            setIsLoading(false);
        }
    };

    const inputStyle = {
        background: 'rgba(255,255,255,0.05)',
        border: '1px solid rgba(212,175,55,0.25)',
        color: 'var(--text-primary)',
    };

    return (
        <div className="min-h-screen flex items-center justify-center px-4" style={{ background: 'var(--gradient-hero)' }}>
            {/* Background decoration */}
            <div className="absolute inset-0 overflow-hidden">
                {[...Array(3)].map((_, i) => (
                    <motion.div
                        key={i}
                        animate={{ rotate: [0, 360] }}
                        transition={{ duration: 30 + i * 10, repeat: Infinity, ease: 'linear' }}
                        className="absolute rounded-full"
                        style={{
                            width: `${200 + i * 100}px`,
                            height: `${200 + i * 100}px`,
                            border: '1px dashed rgba(212,175,55,0.1)',
                            top: `${20 + i * 20}%`,
                            left: `${10 + i * 30}%`,
                        }}
                    />
                ))}
            </div>

            <motion.div
                initial={{ opacity: 0, y: 40, scale: 0.95 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                transition={{ duration: 0.6 }}
                className="w-full max-w-md relative z-10"
            >
                {/* Card */}
                <div className="glass rounded-3xl p-8" style={{ border: '1px solid rgba(212,175,55,0.2)' }}>
                    {/* Header */}
                    <div className="text-center mb-8">
                        <motion.div
                            animate={{ scale: [1, 1.05, 1] }}
                            transition={{ duration: 3, repeat: Infinity }}
                            className="w-16 h-16 rounded-2xl flex items-center justify-center mx-auto mb-4 font-cinzel font-black text-xl"
                            style={{ background: 'var(--gradient-primary)', color: '#000' }}
                        >
                            SV
                        </motion.div>
                        <h1 className="font-cinzel text-2xl font-black gradient-text mb-1">Admin Panel</h1>
                        <p className="text-xs" style={{ color: 'var(--text-secondary)' }}>SKETCH_VIBES23 · Secure Login</p>
                    </div>

                    <form onSubmit={handleSubmit} className="space-y-4">
                        {/* Email */}
                        <div>
                            <label className="block text-xs font-medium mb-1.5" style={{ color: 'var(--gold)' }}>Email Address</label>
                            <div className="relative">
                                <Mail size={15} className="absolute left-4 top-1/2 -translate-y-1/2" style={{ color: 'var(--text-secondary)' }} />
                                <input
                                    type="email"
                                    value={form.email}
                                    onChange={e => setForm({ ...form, email: e.target.value })}
                                    placeholder="admin@sketchvibes23.com"
                                    required
                                    className="w-full pl-10 pr-4 py-3 rounded-xl text-sm outline-none focus:ring-2 focus:ring-yellow-400/30"
                                    style={inputStyle}
                                />
                            </div>
                        </div>

                        {/* Password */}
                        <div>
                            <label className="block text-xs font-medium mb-1.5" style={{ color: 'var(--gold)' }}>Password</label>
                            <div className="relative">
                                <Lock size={15} className="absolute left-4 top-1/2 -translate-y-1/2" style={{ color: 'var(--text-secondary)' }} />
                                <input
                                    type={showPassword ? 'text' : 'password'}
                                    value={form.password}
                                    onChange={e => setForm({ ...form, password: e.target.value })}
                                    placeholder="••••••••"
                                    required
                                    className="w-full pl-10 pr-10 py-3 rounded-xl text-sm outline-none focus:ring-2 focus:ring-yellow-400/30"
                                    style={inputStyle}
                                />
                                <button
                                    type="button"
                                    onClick={() => setShowPassword(!showPassword)}
                                    className="absolute right-4 top-1/2 -translate-y-1/2"
                                    style={{ color: 'var(--text-secondary)' }}
                                >
                                    {showPassword ? <EyeOff size={15} /> : <Eye size={15} />}
                                </button>
                            </div>
                        </div>

                        <motion.button
                            type="submit"
                            disabled={isLoading}
                            whileHover={{ scale: !isLoading ? 1.02 : 1, y: !isLoading ? -1 : 0 }}
                            whileTap={{ scale: 0.98 }}
                            className="btn-gold w-full py-3.5 rounded-xl font-bold text-sm flex items-center justify-center gap-2 mt-6"
                        >
                            {isLoading ? (
                                <div className="w-5 h-5 rounded-full border-2 border-black border-t-transparent animate-spin" />
                            ) : (
                                <><LogIn size={16} /> Sign In to Admin Panel</>
                            )}
                        </motion.button>
                    </form>

                    <p className="text-center text-xs mt-6" style={{ color: 'var(--text-secondary)' }}>
                        Default: admin@sketchvibes23.com / Admin@123456
                    </p>
                </div>

                <p className="text-center text-xs mt-4" style={{ color: 'var(--text-secondary)' }}>
                    <a href="/" className="hover:text-yellow-400 transition-colors">← Back to Website</a>
                </p>
            </motion.div>
        </div>
    );
};

export default AdminLogin;
