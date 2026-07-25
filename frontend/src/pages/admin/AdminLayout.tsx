import { useState } from 'react';
import { Link, useLocation, Outlet } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuth } from '../../context/AuthContext';
import {
    LayoutDashboard, Images, Layers, Frame, ShoppingBag,
    MessageSquare, LogOut, Menu, X, ChevronRight
} from 'lucide-react';

const navItems = [
    { path: '/admin/dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { path: '/admin/gallery', label: 'Gallery', icon: Images },
    { path: '/admin/services', label: 'Services', icon: Layers },
    { path: '/admin/frames', label: 'Frames', icon: Frame },
    { path: '/admin/orders', label: 'Orders', icon: ShoppingBag },
    { path: '/admin/contacts', label: 'Enquiries', icon: MessageSquare },
];

const AdminLayout = () => {
    const [sidebarOpen, setSidebarOpen] = useState(true);
    const { user, logout } = useAuth();
    const location = useLocation();

    const sidebar = (
        <div
            className="flex flex-col h-full"
            style={{
                background: 'var(--dark-surface)',
                borderRight: '1px solid rgba(212,175,55,0.1)',
            }}
        >
            {/* Logo */}
            <div className="p-5 flex items-center gap-3" style={{ borderBottom: '1px solid rgba(212,175,55,0.1)' }}>
                <div className="w-9 h-9 rounded-xl flex items-center justify-center font-cinzel font-black text-sm flex-shrink-0" style={{ background: 'var(--gradient-primary)', color: '#000' }}>SV</div>
                <AnimatePresence>
                    {sidebarOpen && (
                        <motion.div initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -10 }}>
                            <div className="font-cinzel font-black text-sm gradient-text">SKETCH_VIBES23</div>
                            <div className="text-xs" style={{ color: 'var(--text-secondary)' }}>Admin Panel</div>
                        </motion.div>
                    )}
                </AnimatePresence>
            </div>

            {/* Nav links */}
            <nav className="flex-1 p-3 space-y-1 overflow-y-auto">
                {navItems.map((item) => {
                    const active = location.pathname === item.path;
                    const Icon = item.icon;
                    return (
                        <Link key={item.path} to={item.path}>
                            <motion.div
                                whileHover={{ x: 4 }}
                                className="flex items-center gap-3 px-3 py-2.5 rounded-xl transition-all duration-200 cursor-pointer"
                                style={{
                                    background: active ? 'rgba(212,175,55,0.12)' : 'transparent',
                                    color: active ? 'var(--gold)' : 'var(--text-secondary)',
                                    border: active ? '1px solid rgba(212,175,55,0.2)' : '1px solid transparent',
                                }}
                            >
                                <Icon size={18} className="flex-shrink-0" />
                                <AnimatePresence>
                                    {sidebarOpen && (
                                        <motion.span initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="text-sm font-medium">
                                            {item.label}
                                        </motion.span>
                                    )}
                                </AnimatePresence>
                                {active && sidebarOpen && <ChevronRight size={14} className="ml-auto" />}
                            </motion.div>
                        </Link>
                    );
                })}
            </nav>

            {/* User & logout */}
            <div className="p-3" style={{ borderTop: '1px solid rgba(212,175,55,0.1)' }}>
                <div className="flex items-center gap-3 px-3 py-2 mb-2">
                    <div className="w-8 h-8 rounded-full flex items-center justify-center font-bold text-xs flex-shrink-0" style={{ background: 'var(--gradient-primary)', color: '#000' }}>
                        {user?.name?.[0]?.toUpperCase() || 'A'}
                    </div>
                    <AnimatePresence>
                        {sidebarOpen && (
                            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="flex-1 min-w-0">
                                <div className="text-sm font-medium truncate" style={{ color: 'var(--text-primary)' }}>{user?.name}</div>
                                <div className="text-xs truncate" style={{ color: 'var(--text-secondary)' }}>Administrator</div>
                            </motion.div>
                        )}
                    </AnimatePresence>
                </div>
                <button
                    onClick={logout}
                    className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl transition-all hover:bg-red-500/10 text-sm"
                    style={{ color: '#ff6b6b' }}
                >
                    <LogOut size={16} />
                    <AnimatePresence>
                        {sidebarOpen && <motion.span initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>Logout</motion.span>}
                    </AnimatePresence>
                </button>
            </div>
        </div>
    );

    return (
        <div className="flex h-screen" style={{ background: 'var(--dark-bg)' }}>
            {/* Sidebar */}
            <motion.aside
                animate={{ width: sidebarOpen ? 240 : 64 }}
                transition={{ duration: 0.25 }}
                className="flex-shrink-0 relative overflow-hidden"
            >
                {sidebar}
            </motion.aside>

            {/* Main */}
            <div className="flex-1 flex flex-col overflow-hidden">
                {/* Top bar */}
                <header className="flex items-center gap-4 px-6 h-14 flex-shrink-0" style={{ background: 'var(--dark-surface)', borderBottom: '1px solid rgba(212,175,55,0.1)' }}>
                    <button
                        onClick={() => setSidebarOpen(!sidebarOpen)}
                        className="p-2 rounded-lg transition-colors hover:bg-white/5"
                        style={{ color: 'var(--gold)' }}
                    >
                        {sidebarOpen ? <X size={18} /> : <Menu size={18} />}
                    </button>
                    <div className="flex-1">
                        <h2 className="font-cinzel text-sm font-bold gradient-text">
                            {navItems.find(n => n.path === location.pathname)?.label || 'Admin'}
                        </h2>
                    </div>
                    <Link to="/" className="text-xs hover:text-yellow-400 transition-colors" style={{ color: 'var(--text-secondary)' }}>
                        ← View Website
                    </Link>
                </header>

                {/* Content */}
                <main className="flex-1 overflow-y-auto p-6">
                    <Outlet />
                </main>
            </div>
        </div>
    );
};

export default AdminLayout;
