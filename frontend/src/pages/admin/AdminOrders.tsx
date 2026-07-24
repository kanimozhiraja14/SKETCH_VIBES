import { useState } from 'react';
import { motion } from 'framer-motion';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { ordersAPI } from '../../lib/api';
import type {  Order  } from '../../types';
import toast from 'react-hot-toast';
import { Eye, X, ChevronDown } from 'lucide-react';

const STATUS_OPTIONS = ['Pending', 'Confirmed', 'In Progress', 'Completed', 'Delivered', 'Cancelled'];

const statusColors: Record<string, string> = {
    Pending: '#f59e0b', Confirmed: '#3b82f6', 'In Progress': '#8b5cf6',
    Completed: '#10b981', Delivered: '#06b6d4', Cancelled: '#ef4444',
};

const AdminOrders = () => {
    const queryClient = useQueryClient();
    const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
    const [filterStatus, setFilterStatus] = useState('');

    const { data, isLoading } = useQuery({
        queryKey: ['admin-orders', filterStatus],
        queryFn: () => ordersAPI.getAll({ ...(filterStatus ? { status: filterStatus } : {}), limit: 100 }).then(r => r.data.data as Order[]),
    });

    const updateMutation = useMutation({
        mutationFn: ({ id, data }: { id: string; data: any }) => ordersAPI.update(id, data),
        onSuccess: () => { toast.success('Order updated!'); queryClient.invalidateQueries({ queryKey: ['admin-orders'] }); },
    });

    const handleStatusChange = (order: Order, status: string) => {
        updateMutation.mutate({ id: order._id, data: { status } });
        if (selectedOrder?._id === order._id) setSelectedOrder({ ...selectedOrder, status: status as any });
    };

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <div>
                    <h2 className="font-cinzel text-xl font-bold gradient-text">Orders</h2>
                    <p className="text-xs mt-0.5" style={{ color: 'var(--text-secondary)' }}>{data?.length || 0} total orders</p>
                </div>
                <div className="flex items-center gap-2">
                    <select value={filterStatus} onChange={e => setFilterStatus(e.target.value)} className="px-3 py-2 rounded-xl text-sm outline-none" style={{ background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(212,175,55,0.2)', color: 'var(--text-primary)' }}>
                        <option value="" style={{ background: '#1a1a28' }}>All Status</option>
                        {STATUS_OPTIONS.map(s => <option key={s} value={s} style={{ background: '#1a1a28' }}>{s}</option>)}
                    </select>
                </div>
            </div>

            {isLoading ? (
                <div className="space-y-3">{[...Array(5)].map((_, i) => <div key={i} className="shimmer rounded-xl h-16" />)}</div>
            ) : !data?.length ? (
                <div className="glass rounded-2xl p-10 text-center" style={{ color: 'var(--text-secondary)' }}>
                    <div className="text-4xl mb-3">📦</div>
                    <p>No orders found</p>
                </div>
            ) : (
                <div className="glass rounded-2xl overflow-hidden">
                    <div className="overflow-x-auto">
                        <table className="w-full">
                            <thead>
                                <tr style={{ borderBottom: '1px solid rgba(212,175,55,0.1)' }}>
                                    {['Order ID', 'Customer', 'Artwork', 'Size', 'Date', 'Status', 'Actions'].map(h => (
                                        <th key={h} className="text-left px-4 py-3 text-xs font-medium uppercase tracking-wider" style={{ color: 'var(--gold)' }}>{h}</th>
                                    ))}
                                </tr>
                            </thead>
                            <tbody>
                                {data.map((order, i) => (
                                    <motion.tr
                                        key={order._id}
                                        initial={{ opacity: 0 }}
                                        animate={{ opacity: 1 }}
                                        transition={{ delay: i * 0.03 }}
                                        className="transition-colors hover:bg-white/2"
                                        style={{ borderBottom: '1px solid rgba(212,175,55,0.05)' }}
                                    >
                                        <td className="px-4 py-3 text-xs font-mono" style={{ color: 'var(--gold)' }}>{order.orderNumber}</td>
                                        <td className="px-4 py-3">
                                            <p className="text-sm font-medium" style={{ color: 'var(--text-primary)' }}>{order.customerName}</p>
                                            <p className="text-xs" style={{ color: 'var(--text-secondary)' }}>{order.mobile}</p>
                                        </td>
                                        <td className="px-4 py-3 text-sm" style={{ color: 'var(--text-secondary)' }}>{order.artworkType}</td>
                                        <td className="px-4 py-3 text-sm" style={{ color: 'var(--text-secondary)' }}>{order.size}</td>
                                        <td className="px-4 py-3 text-xs" style={{ color: 'var(--text-secondary)' }}>{new Date(order.createdAt).toLocaleDateString('en-IN')}</td>
                                        <td className="px-4 py-3">
                                            <select
                                                value={order.status}
                                                onChange={e => handleStatusChange(order, e.target.value)}
                                                className="text-xs px-2 py-1 rounded-lg outline-none"
                                                style={{ background: `${statusColors[order.status]}15`, color: statusColors[order.status], border: `1px solid ${statusColors[order.status]}40` }}
                                            >
                                                {STATUS_OPTIONS.map(s => <option key={s} value={s} style={{ background: '#1a1a28', color: 'white' }}>{s}</option>)}
                                            </select>
                                        </td>
                                        <td className="px-4 py-3">
                                            <button onClick={() => setSelectedOrder(order)} className="p-2 rounded-lg hover:bg-white/5 transition-colors" style={{ color: 'var(--gold)' }}>
                                                <Eye size={16} />
                                            </button>
                                        </td>
                                    </motion.tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            )}

            {/* Order detail modal */}
            {selectedOrder && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4" style={{ background: 'rgba(0,0,0,0.8)', backdropFilter: 'blur(10px)' }}>
                    <motion.div initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} className="glass rounded-2xl p-6 w-full max-w-lg max-h-[85vh] overflow-y-auto">
                        <div className="flex items-center justify-between mb-5">
                            <h3 className="font-cinzel font-bold gradient-text">{selectedOrder.orderNumber}</h3>
                            <button onClick={() => setSelectedOrder(null)} style={{ color: 'var(--text-secondary)' }}><X size={20} /></button>
                        </div>
                        <div className="space-y-4">
                            {[
                                ['Customer', selectedOrder.customerName],
                                ['Mobile', selectedOrder.mobile],
                                ['Email', selectedOrder.email],
                                ['Artwork Type', selectedOrder.artworkType],
                                ['Size', selectedOrder.size],
                                ['Instructions', selectedOrder.instructions || 'None'],
                                ['Status', selectedOrder.status],
                            ].map(([label, value]) => (
                                <div key={label} className="flex justify-between py-2" style={{ borderBottom: '1px solid rgba(212,175,55,0.06)' }}>
                                    <span className="text-xs" style={{ color: 'var(--text-secondary)' }}>{label}</span>
                                    <span className="text-sm font-medium text-right max-w-xs" style={{ color: 'var(--text-primary)' }}>{value}</span>
                                </div>
                            ))}
                            {selectedOrder.deliveryAddress?.city && (
                                <div className="flex justify-between py-2" style={{ borderBottom: '1px solid rgba(212,175,55,0.06)' }}>
                                    <span className="text-xs" style={{ color: 'var(--text-secondary)' }}>Delivery</span>
                                    <span className="text-sm font-medium text-right" style={{ color: 'var(--text-primary)' }}>
                                        {[selectedOrder.deliveryAddress.street, selectedOrder.deliveryAddress.city, selectedOrder.deliveryAddress.state, selectedOrder.deliveryAddress.pincode].filter(Boolean).join(', ')}
                                    </span>
                                </div>
                            )}
                            {selectedOrder.referenceImages?.length > 0 && (
                                <div>
                                    <p className="text-xs mb-2" style={{ color: 'var(--text-secondary)' }}>Reference Images</p>
                                    <div className="flex gap-2 flex-wrap">
                                        {selectedOrder.referenceImages.map((img, i) => (
                                            <img key={i} src={img.url} alt="" className="w-20 h-20 object-cover rounded-lg" />
                                        ))}
                                    </div>
                                </div>
                            )}
                        </div>
                    </motion.div>
                </div>
            )}
        </div>
    );
};

export default AdminOrders;
