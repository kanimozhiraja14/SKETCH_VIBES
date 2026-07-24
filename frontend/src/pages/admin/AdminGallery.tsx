import { useState } from 'react';
import { motion } from 'framer-motion';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { galleryAPI } from '../../lib/api';
import type {  GalleryItem  } from '../../types';
import toast from 'react-hot-toast';
import { Plus, Trash2, Edit3, Upload, X, Search } from 'lucide-react';

const CATEGORIES = ['Pencil Sketch', 'Colour Pencil Art', 'Acrylic Painting', 'Oil Painting', 'Canvas Painting', 'Blood Art', 'Fingerprint Tree', 'Turmeric Painting', 'Paper Quilling', 'Wall Murals', 'Couple Portraits', 'Family Portraits', 'Pet Portraits', 'Wedding Gifts', 'Photo Frames'];

const AdminGallery = () => {
    const queryClient = useQueryClient();
    const [showForm, setShowForm] = useState(false);
    const [editItem, setEditItem] = useState<GalleryItem | null>(null);
    const [form, setForm] = useState({ title: '', description: '', category: '', tags: '', isFeatured: false });
    const [imageFile, setImageFile] = useState<File | null>(null);
    const [preview, setPreview] = useState('');
    const [search, setSearch] = useState('');

    const { data, isLoading } = useQuery({
        queryKey: ['admin-gallery', search],
        queryFn: () => galleryAPI.getAll({ ...(search ? { search } : {}), limit: 100 }).then(r => r.data.data as GalleryItem[]),
    });

    const createMutation = useMutation({
        mutationFn: (fd: FormData) => galleryAPI.create(fd),
        onSuccess: () => { toast.success('Image uploaded!'); queryClient.invalidateQueries({ queryKey: ['admin-gallery'] }); resetForm(); },
        onError: () => toast.error('Upload failed'),
    });

    const deleteMutation = useMutation({
        mutationFn: (id: string) => galleryAPI.delete(id),
        onSuccess: () => { toast.success('Deleted!'); queryClient.invalidateQueries({ queryKey: ['admin-gallery'] }); },
        onError: () => toast.error('Delete failed'),
    });

    const updateMutation = useMutation({
        mutationFn: ({ id, data }: { id: string; data: any }) => galleryAPI.update(id, data),
        onSuccess: () => { toast.success('Updated!'); queryClient.invalidateQueries({ queryKey: ['admin-gallery'] }); resetForm(); },
        onError: () => toast.error('Update failed'),
    });

    const resetForm = () => { setShowForm(false); setEditItem(null); setForm({ title: '', description: '', category: '', tags: '', isFeatured: false }); setImageFile(null); setPreview(''); };

    const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) { setImageFile(file); setPreview(URL.createObjectURL(file)); }
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (editItem) {
            updateMutation.mutate({ id: editItem._id, data: { ...form } });
        } else {
            if (!imageFile) return toast.error('Image is required');
            const fd = new FormData();
            Object.entries(form).forEach(([k, v]) => fd.append(k, String(v)));
            fd.append('image', imageFile);
            createMutation.mutate(fd);
        }
    };

    const openEdit = (item: GalleryItem) => {
        setEditItem(item);
        setForm({ title: item.title, description: item.description || '', category: item.category, tags: item.tags.join(', '), isFeatured: item.isFeatured });
        setPreview(item.imageUrl);
        setShowForm(true);
    };

    const inputStyle = { background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(212,175,55,0.2)', color: 'var(--text-primary)' };
    const inputClass = "w-full px-3 py-2.5 rounded-xl text-sm outline-none focus:ring-2 focus:ring-yellow-400/30";

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex items-center justify-between">
                <div>
                    <h2 className="font-cinzel text-xl font-bold gradient-text">Gallery Management</h2>
                    <p className="text-xs mt-0.5" style={{ color: 'var(--text-secondary)' }}>{data?.length || 0} artworks</p>
                </div>
                <motion.button onClick={() => setShowForm(true)} whileHover={{ scale: 1.05 }} className="btn-gold flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-bold">
                    <Plus size={16} /> Add Image
                </motion.button>
            </div>

            {/* Search */}
            <div className="relative max-w-sm">
                <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2" style={{ color: 'var(--text-secondary)' }} />
                <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Search gallery..." className={`${inputClass} pl-9`} style={inputStyle} />
            </div>

            {/* Form modal */}
            {showForm && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4" style={{ background: 'rgba(0,0,0,0.8)', backdropFilter: 'blur(10px)' }}>
                    <motion.div initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} className="glass rounded-2xl p-6 w-full max-w-lg max-h-[90vh] overflow-y-auto">
                        <div className="flex items-center justify-between mb-6">
                            <h3 className="font-cinzel font-bold text-lg gradient-text">{editItem ? 'Edit Image' : 'Upload Image'}</h3>
                            <button onClick={resetForm} style={{ color: 'var(--text-secondary)' }}><X size={20} /></button>
                        </div>
                        <form onSubmit={handleSubmit} className="space-y-4">
                            {preview && <img src={preview} alt="" className="w-full h-40 object-cover rounded-xl" />}
                            {!editItem && (
                                <label className="block w-full py-8 border-2 border-dashed rounded-xl text-center cursor-pointer transition-colors hover:border-yellow-400/50" style={{ borderColor: 'rgba(212,175,55,0.25)' }}>
                                    <Upload size={24} className="mx-auto mb-2" style={{ color: 'var(--gold)' }} />
                                    <span className="text-sm" style={{ color: 'var(--text-secondary)' }}>Click to upload image</span>
                                    <input type="file" accept="image/*" onChange={handleImageChange} className="hidden" />
                                </label>
                            )}
                            {[
                                { label: 'Title *', key: 'title', placeholder: 'Artwork title' },
                                { label: 'Description', key: 'description', placeholder: 'Brief description' },
                                { label: 'Tags (comma-separated)', key: 'tags', placeholder: 'portrait, family, pencil' },
                            ].map(f => (
                                <div key={f.key}>
                                    <label className="block text-xs font-medium mb-1" style={{ color: 'var(--gold)' }}>{f.label}</label>
                                    <input value={(form as any)[f.key]} onChange={e => setForm({ ...form, [f.key]: e.target.value })} placeholder={f.placeholder} className={inputClass} style={inputStyle} />
                                </div>
                            ))}
                            <div>
                                <label className="block text-xs font-medium mb-1" style={{ color: 'var(--gold)' }}>Category *</label>
                                <select value={form.category} onChange={e => setForm({ ...form, category: e.target.value })} required className={inputClass} style={inputStyle}>
                                    <option value="" style={{ background: '#1a1a28' }}>Select category</option>
                                    {CATEGORIES.map(c => <option key={c} value={c} style={{ background: '#1a1a28' }}>{c}</option>)}
                                </select>
                            </div>
                            <label className="flex items-center gap-2 cursor-pointer">
                                <input type="checkbox" checked={form.isFeatured} onChange={e => setForm({ ...form, isFeatured: e.target.checked })} className="w-4 h-4 accent-yellow-400" />
                                <span className="text-sm" style={{ color: 'var(--text-secondary)' }}>Featured artwork</span>
                            </label>
                            <div className="flex gap-3 pt-2">
                                <button type="button" onClick={resetForm} className="flex-1 py-2.5 rounded-xl text-sm font-medium" style={{ background: 'rgba(255,255,255,0.05)', color: 'var(--text-secondary)' }}>Cancel</button>
                                <button type="submit" disabled={createMutation.isPending || updateMutation.isPending} className="flex-1 btn-gold py-2.5 rounded-xl font-bold text-sm">
                                    {createMutation.isPending || updateMutation.isPending ? 'Saving...' : editItem ? 'Update' : 'Upload'}
                                </button>
                            </div>
                        </form>
                    </motion.div>
                </div>
            )}

            {/* Gallery grid */}
            {isLoading ? (
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
                    {[...Array(10)].map((_, i) => <div key={i} className="shimmer rounded-xl h-40" />)}
                </div>
            ) : !data?.length ? (
                <div className="text-center py-20 glass rounded-2xl" style={{ color: 'var(--text-secondary)' }}>
                    <div className="text-5xl mb-4">🎨</div>
                    <p>No gallery images yet. Upload your first artwork!</p>
                </div>
            ) : (
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
                    {data.map((item) => (
                        <motion.div key={item._id} initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="group relative rounded-xl overflow-hidden" style={{ aspectRatio: '1' }}>
                            <img src={item.imageUrl} alt={item.title} className="w-full h-full object-cover" />
                            <div className="absolute inset-0 flex flex-col justify-end p-2 opacity-0 group-hover:opacity-100 transition-opacity" style={{ background: 'linear-gradient(to top, rgba(0,0,0,0.85), transparent)' }}>
                                <p className="text-xs font-medium truncate text-white mb-2">{item.title}</p>
                                <div className="flex gap-1">
                                    <button onClick={() => openEdit(item)} className="flex-1 py-1.5 rounded-lg text-xs font-medium" style={{ background: 'rgba(212,175,55,0.25)', color: 'var(--gold)' }}>
                                        <Edit3 size={12} className="mx-auto" />
                                    </button>
                                    <button onClick={() => { if (confirm('Delete this image?')) deleteMutation.mutate(item._id); }} className="flex-1 py-1.5 rounded-lg text-xs font-medium" style={{ background: 'rgba(255,68,68,0.25)', color: '#ff4444' }}>
                                        <Trash2 size={12} className="mx-auto" />
                                    </button>
                                </div>
                            </div>
                            {item.isFeatured && <div className="absolute top-2 left-2 text-xs px-1.5 py-0.5 rounded font-bold" style={{ background: 'var(--gradient-primary)', color: '#000' }}>★</div>}
                        </motion.div>
                    ))}
                </div>
            )}
        </div>
    );
};

export default AdminGallery;
