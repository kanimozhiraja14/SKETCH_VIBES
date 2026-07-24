import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { testimonialsAPI } from '../../lib/api';
import type {  Testimonial  } from '../../types';
import { motion } from 'framer-motion';
import toast from 'react-hot-toast';
import { Star, Trash2, CheckCircle, X } from 'lucide-react';

const AdminTestimonials = () => {
    const queryClient = useQueryClient();
    const { data, isLoading } = useQuery({
        queryKey: ['admin-testimonials'],
        queryFn: () => testimonialsAPI.getAllAdmin().then(r => r.data.data as Testimonial[]),
    });

    const updateMutation = useMutation({
        mutationFn: ({ id, data }: { id: string; data: any }) => testimonialsAPI.update(id, data),
        onSuccess: () => { toast.success('Updated!'); queryClient.invalidateQueries({ queryKey: ['admin-testimonials'] }); },
    });

    const deleteMutation = useMutation({
        mutationFn: (id: string) => testimonialsAPI.delete(id),
        onSuccess: () => { toast.success('Deleted!'); queryClient.invalidateQueries({ queryKey: ['admin-testimonials'] }); },
    });

    const RatingStars = ({ rating }: { rating: number }) => (
        <div className="flex gap-0.5">
            {[...Array(5)].map((_, i) => <Star key={i} size={12} fill={i < rating ? '#d4af37' : 'transparent'} color={i < rating ? '#d4af37' : '#555'} />)}
        </div>
    );

    return (
        <div className="space-y-6">
            <div>
                <h2 className="font-cinzel text-xl font-bold gradient-text">Testimonials</h2>
                <p className="text-xs mt-0.5" style={{ color: 'var(--text-secondary)' }}>{data?.filter(t => !t.isApproved).length || 0} pending approval</p>
            </div>

            {isLoading ? (
                <div className="grid md:grid-cols-2 gap-4">{[...Array(4)].map((_, i) => <div key={i} className="shimmer rounded-xl h-32" />)}</div>
            ) : (
                <div className="grid md:grid-cols-2 gap-4">
                    {data?.map((t, i) => (
                        <motion.div key={t._id} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.05 }}
                            className="glass rounded-xl p-4 relative"
                            style={{ borderColor: t.isApproved ? 'rgba(16,185,129,0.2)' : 'rgba(245,158,11,0.2)' }}
                        >
                            <div className="flex items-start gap-3 mb-3">
                                <img src={t.profilePhoto || `https://i.pravatar.cc/48?u=${t._id}`} alt={t.customerName} className="w-10 h-10 rounded-full object-cover" />
                                <div className="flex-1 min-w-0">
                                    <p className="font-semibold text-sm" style={{ color: 'var(--text-primary)' }}>{t.customerName}</p>
                                    {t.artworkType && <p className="text-xs" style={{ color: 'var(--gold)' }}>{t.artworkType}</p>}
                                    <RatingStars rating={t.rating} />
                                </div>
                                <div className="flex gap-1">
                                    <span className="text-xs px-1.5 py-0.5 rounded-full" style={{ background: t.isApproved ? 'rgba(16,185,129,0.15)' : 'rgba(245,158,11,0.15)', color: t.isApproved ? '#10b981' : '#f59e0b' }}>
                                        {t.isApproved ? 'Approved' : 'Pending'}
                                    </span>
                                </div>
                            </div>
                            <p className="text-sm" style={{ color: 'var(--text-secondary)' }}>"{t.review}"</p>
                            <div className="flex gap-2 mt-4">
                                {!t.isApproved && (
                                    <button onClick={() => updateMutation.mutate({ id: t._id, data: { isApproved: true } })} className="flex items-center gap-1 text-xs px-2 py-1 rounded-lg" style={{ background: 'rgba(16,185,129,0.1)', color: '#10b981' }}>
                                        <CheckCircle size={12} /> Approve
                                    </button>
                                )}
                                <button onClick={() => updateMutation.mutate({ id: t._id, data: { isFeatured: !t.isFeatured } })} className="flex items-center gap-1 text-xs px-2 py-1 rounded-lg" style={{ background: 'rgba(212,175,55,0.1)', color: 'var(--gold)' }}>
                                    <Star size={12} /> {t.isFeatured ? 'Unfeature' : 'Feature'}
                                </button>
                                <button onClick={() => { if (confirm('Delete?')) deleteMutation.mutate(t._id); }} className="flex items-center gap-1 text-xs px-2 py-1 rounded-lg ml-auto" style={{ background: 'rgba(255,68,68,0.1)', color: '#ff4444' }}>
                                    <Trash2 size={12} /> Delete
                                </button>
                            </div>
                        </motion.div>
                    ))}
                </div>
            )}
        </div>
    );
};

export default AdminTestimonials;
