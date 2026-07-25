import { motion } from 'framer-motion';
import { useQuery } from '@tanstack/react-query';
import { dashboardAPI } from '../../lib/api';
import type { DashboardStats, Order, Contact } from '../../types';
import { Images, ShoppingBag, MessageSquare, Clock, CheckCircle, AlertCircle, Layers } from 'lucide-react';

const StatCard = ({ label, value, icon: Icon, color, sub }: { label: string; value: number | string; icon: any; color: string; sub?: string }) => (
    <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        whileHover={{ y: -4 }}
        className="glass rounded-2xl p-5"
    >
        <div className="flex items-start justify-between mb-4">
            <div className="w-11 h-11 rounded-xl flex items-center justify-center" style={{ background: `${color}15`, color }}>
                <Icon size={22} />
            </div>
        </div>
        <div className="font-cinzel text-3xl font-black mb-1" style={{ color: 'var(--text-primary)' }}>{value}</div>
        <div className="text-sm font-medium" style={{ color: 'var(--text-secondary)' }}>{label}</div>
        {sub && <div className="text-xs mt-0.5" style={{ color }}>{sub}</div>}
    </motion.div>
);

const statusColors: Record<string, string> = {
    Pending: '#f59e0b',
    Confirmed: '#3b82f6',
    'In Progress': '#8b5cf6',
    Completed: '#10b981',
    Delivered: '#06b6d4',
    Cancelled: '#ef4444',
};

const AdminDashboard = () => {
    const { data, isLoading } = useQuery({
        queryKey: ['dashboard-stats'],
        queryFn: () => dashboardAPI.getStats().then(r => r.data.data as DashboardStats),
        refetchInterval: 60000,
    });

    if (isLoading) {
        return (
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
                {[...Array(8)].map((_, i) => (
                    <div key={i} className="shimmer rounded-2xl h-32" />
                ))}
            </div>
        );
    }

    const stats = data || { totalGallery: 0, totalOrders: 0, pendingOrders: 0, completedOrders: 0, totalContacts: 0, unreadContacts: 0, totalServices: 0, recentOrders: [], recentContacts: [] };

    return (
        <div className="space-y-8">
            {/* Welcome banner */}
            <motion.div
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                className="glass-gold rounded-2xl p-6 flex items-center justify-between"
            >
                <div>
                    <h1 className="font-cinzel text-2xl font-black gradient-text mb-1">Dashboard Overview</h1>
                    <p className="text-sm" style={{ color: 'var(--text-secondary)' }}>
                        {new Date().toLocaleDateString('en-IN', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
                    </p>
                </div>
                <div className="text-4xl">🎨</div>
            </motion.div>

            {/* Stats grid */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                <StatCard label="Gallery Items" value={stats.totalGallery} icon={Images} color="#d4af37" />
                <StatCard label="Total Orders" value={stats.totalOrders} icon={ShoppingBag} color="#8b5cf6" />
                <StatCard label="Pending Orders" value={stats.pendingOrders} icon={Clock} color="#f59e0b" sub="Needs attention" />
                <StatCard label="Completed" value={stats.completedOrders} icon={CheckCircle} color="#10b981" />
                <StatCard label="Enquiries" value={stats.totalContacts} icon={MessageSquare} color="#3b82f6" />
                <StatCard label="Unread" value={stats.unreadContacts} icon={AlertCircle} color="#ef4444" sub="New messages" />
                <StatCard label="Services" value={stats.totalServices} icon={Layers} color="#06b6d4" />
            </div>

            {/* Recent data */}
            <div className="grid lg:grid-cols-2 gap-6">
                {/* Recent Orders */}
                <div className="glass rounded-2xl p-5">
                    <h3 className="font-cinzel font-bold text-sm mb-4 gradient-text">Recent Orders</h3>
                    {stats.recentOrders.length === 0 ? (
                        <p className="text-sm text-center py-8" style={{ color: 'var(--text-secondary)' }}>No orders yet</p>
                    ) : (
                        <div className="space-y-3">
                            {stats.recentOrders.map((order: Order) => (
                                <div key={order._id} className="flex items-center gap-3 p-3 rounded-xl" style={{ background: 'rgba(255,255,255,0.03)' }}>
                                    <div className="flex-1 min-w-0">
                                        <p className="text-sm font-medium truncate" style={{ color: 'var(--text-primary)' }}>{order.customerName}</p>
                                        <p className="text-xs truncate" style={{ color: 'var(--text-secondary)' }}>{order.artworkType} · {order.size}</p>
                                    </div>
                                    <span className="text-xs px-2 py-0.5 rounded-full flex-shrink-0 font-medium" style={{ background: `${statusColors[order.status]}20`, color: statusColors[order.status] }}>
                                        {order.status}
                                    </span>
                                </div>
                            ))}
                        </div>
                    )}
                </div>

                {/* Recent Enquiries */}
                <div className="glass rounded-2xl p-5">
                    <h3 className="font-cinzel font-bold text-sm mb-4 gradient-text">Recent Enquiries</h3>
                    {stats.recentContacts.length === 0 ? (
                        <p className="text-sm text-center py-8" style={{ color: 'var(--text-secondary)' }}>No enquiries yet</p>
                    ) : (
                        <div className="space-y-3">
                            {stats.recentContacts.map((contact: Contact) => (
                                <div key={contact._id} className="flex items-center gap-3 p-3 rounded-xl" style={{ background: 'rgba(255,255,255,0.03)' }}>
                                    <div className="flex-1 min-w-0">
                                        <p className="text-sm font-medium truncate" style={{ color: 'var(--text-primary)' }}>{contact.name}</p>
                                        <p className="text-xs truncate" style={{ color: 'var(--text-secondary)' }}>{contact.subject || contact.message.slice(0, 40)}</p>
                                    </div>
                                    {!contact.isRead && (
                                        <span className="text-xs px-2 py-0.5 rounded-full font-medium flex-shrink-0" style={{ background: 'rgba(212,175,55,0.2)', color: 'var(--gold)' }}>New</span>
                                    )}
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default AdminDashboard;
