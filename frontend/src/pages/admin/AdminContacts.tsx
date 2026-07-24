import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { contactAPI } from '../../lib/api';
import type {  Contact  } from '../../types';
import toast from 'react-hot-toast';
import { motion } from 'framer-motion';
import { Mail, Phone, CheckCircle, MessageSquare } from 'lucide-react';

const AdminContacts = () => {
    const queryClient = useQueryClient();
    const { data, isLoading } = useQuery({
        queryKey: ['admin-contacts'],
        queryFn: () => contactAPI.getAll().then(r => r.data.data as Contact[]),
    });

    const markReadMutation = useMutation({
        mutationFn: (id: string) => contactAPI.markRead(id),
        onSuccess: () => { toast.success('Marked as read'); queryClient.invalidateQueries({ queryKey: ['admin-contacts'] }); },
    });

    return (
        <div className="space-y-6">
            <div>
                <h2 className="font-cinzel text-xl font-bold gradient-text">Customer Enquiries</h2>
                <p className="text-xs mt-0.5" style={{ color: 'var(--text-secondary)' }}>{data?.filter(c => !c.isRead).length || 0} unread</p>
            </div>

            {isLoading ? (
                <div className="space-y-3">{[...Array(5)].map((_, i) => <div key={i} className="shimmer rounded-xl h-24" />)}</div>
            ) : !data?.length ? (
                <div className="glass rounded-2xl p-10 text-center" style={{ color: 'var(--text-secondary)' }}>
                    <MessageSquare size={40} className="mx-auto mb-3 opacity-30" />
                    <p>No enquiries yet</p>
                </div>
            ) : (
                <div className="space-y-3">
                    {data.map((contact, i) => (
                        <motion.div
                            key={contact._id}
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: i * 0.04 }}
                            className="glass rounded-xl p-4"
                            style={{ borderColor: !contact.isRead ? 'rgba(212,175,55,0.3)' : 'rgba(255,255,255,0.05)' }}
                        >
                            <div className="flex items-start justify-between gap-4">
                                <div className="flex-1 min-w-0">
                                    <div className="flex items-center gap-2 mb-1">
                                        <span className="font-semibold text-sm" style={{ color: 'var(--text-primary)' }}>{contact.name}</span>
                                        {!contact.isRead && <span className="text-xs px-1.5 py-0.5 rounded-full font-bold" style={{ background: 'var(--gradient-primary)', color: '#000' }}>NEW</span>}
                                    </div>
                                    <div className="flex gap-4 text-xs mb-2" style={{ color: 'var(--text-secondary)' }}>
                                        <span className="flex items-center gap-1"><Mail size={11} />{contact.email}</span>
                                        {contact.mobile && <span className="flex items-center gap-1"><Phone size={11} />{contact.mobile}</span>}
                                    </div>
                                    {contact.subject && <p className="text-sm font-medium mb-1" style={{ color: 'var(--gold)' }}>{contact.subject}</p>}
                                    <p className="text-sm" style={{ color: 'var(--text-secondary)' }}>{contact.message}</p>
                                    <p className="text-xs mt-2" style={{ color: 'var(--text-secondary)', opacity: 0.6 }}>{new Date(contact.createdAt).toLocaleString('en-IN')}</p>
                                </div>
                                <div className="flex flex-col gap-2">
                                    {!contact.isRead && (
                                        <button onClick={() => markReadMutation.mutate(contact._id)} className="flex items-center gap-1 text-xs px-2 py-1.5 rounded-lg whitespace-nowrap" style={{ background: 'rgba(16,185,129,0.1)', color: '#10b981' }}>
                                            <CheckCircle size={12} /> Mark Read
                                        </button>
                                    )}
                                    <a href={`mailto:${contact.email}`} className="flex items-center gap-1 text-xs px-2 py-1.5 rounded-lg whitespace-nowrap" style={{ background: 'rgba(212,175,55,0.1)', color: 'var(--gold)' }}>
                                        <Mail size={12} /> Reply
                                    </a>
                                    {contact.mobile && (
                                        <a href={`https://wa.me/91${contact.mobile.replace(/\D/g, '')}`} target="_blank" rel="noopener noreferrer" className="flex items-center gap-1 text-xs px-2 py-1.5 rounded-lg whitespace-nowrap" style={{ background: 'rgba(37,211,102,0.1)', color: '#25D366' }}>
                                            WhatsApp
                                        </a>
                                    )}
                                </div>
                            </div>
                        </motion.div>
                    ))}
                </div>
            )}
        </div>
    );
};

export default AdminContacts;
