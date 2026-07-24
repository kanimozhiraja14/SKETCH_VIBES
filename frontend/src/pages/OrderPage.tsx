import { useState, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useForm } from 'react-hook-form';
import { useDropzone } from 'react-dropzone';
import { ordersAPI } from '../lib/api';
import toast from 'react-hot-toast';
import {
    Upload, X, CheckCircle, Package, ImagePlus, User, Palette,
    MapPin, ChevronRight, ChevronLeft, Phone, Mail, Clock,
    MessageCircle, Home, Star, Camera,
} from 'lucide-react';

/* ─── Constants ────────────────────────────────────────────────── */
const ARTWORK_TYPES = [
    'Pencil Sketching', 'Colour Pencil Art', 'Acrylic Painting', 'Oil Painting',
    'Blood Art', 'Turmeric Painting', 'Quill Art', 'Fingerprint Tree',
    'Paper Quilling', 'Event Artwork', 'Wall Mural', 'Custom Photo Frame',
];
const SIZES = ['A4', 'A3', 'A2', 'A1', '4x4', '5x7', '6x8', '8x10', '10x12', '12x16', 'Custom'];
const ORIENTATIONS = ['Portrait', 'Landscape', 'Square'];
const CONTACT_METHODS = ['WhatsApp', 'Call', 'Email'];
const STEPS = [
    { id: 1, label: 'Customer Details', icon: User },
    { id: 2, label: 'Artwork Details', icon: Palette },
    { id: 3, label: 'Reference Photos', icon: ImagePlus },
    { id: 4, label: 'Delivery Address', icon: MapPin },
    { id: 5, label: 'Review & Place Order', icon: Star },
];

/* ─── Form interface ────────────────────────────────────────────── */
interface OrderForm {
    customerName: string;
    mobile: string;
    email: string;
    contactMethod: string;
    artworkType: string;
    size: string;
    orientation: string;
    numberOfFaces: string;
    background: string;
    eventDate: string;
    instructions: string;
    street: string;
    city: string;
    state: string;
    pincode: string;
    landmark: string;
}

/* ─── Design tokens ─────────────────────────────────────────────── */
const GOLD = '#D4AF37';
const DARK = '#0D0D12';

const card: React.CSSProperties = {
    background: 'rgba(255,255,255,0.03)',
    border: '1px solid rgba(212,175,55,0.22)',
    borderRadius: 22,
    padding: '44px 48px',
    boxShadow: '0 8px 40px rgba(0,0,0,0.35)',
};

const inp: React.CSSProperties = {
    background: 'rgba(255,255,255,0.05)',
    border: '1px solid rgba(212,175,55,0.2)',
    color: '#F5F5F5',
    borderRadius: 12,
    padding: '15px 20px',
    width: '100%',
    fontSize: 15,
    outline: 'none',
    transition: 'border-color 0.2s, box-shadow 0.2s',
    fontFamily: 'inherit',
};

const inpErr: React.CSSProperties = {
    ...inp,
    border: '1px solid rgba(255,80,80,0.7)',
    boxShadow: '0 0 0 3px rgba(255,80,80,0.08)',
};

const lbl: React.CSSProperties = {
    color: GOLD,
    fontSize: 13,
    fontWeight: 600,
    letterSpacing: '0.05em',
    display: 'block',
    marginBottom: 10,
    textTransform: 'uppercase',
};

const sectionHead = (icon: React.ReactNode, title: string, sub: string) => (
    <div style={{ display: 'flex', alignItems: 'center', gap: 16, marginBottom: 36 }}>
        <div style={{
            width: 46, height: 46, borderRadius: '50%',
            background: 'rgba(212,175,55,0.12)', color: GOLD,
            display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0,
        }}>{icon}</div>
        <div>
            <h2 style={{ fontFamily: 'Cinzel, serif', fontSize: 24, fontWeight: 700, color: '#F5F5F5', margin: 0 }}>{title}</h2>
            <p style={{ fontSize: 13, color: '#555', margin: 0 }}>{sub}</p>
        </div>
    </div>
);

/* ─── Component ─────────────────────────────────────────────────── */
const OrderPage = () => {
    const [step, setStep] = useState(1);
    const [files, setFiles] = useState<File[]>([]);
    const [submitted, setSubmitted] = useState(false);
    const [orderNumber, setOrderNumber] = useState('');
    const [submittedName, setSubmittedName] = useState('');
    const [submittedArtwork, setSubmittedArtwork] = useState('');
    const [isSubmitting, setIsSubmitting] = useState(false);

    const { register, handleSubmit, trigger, watch, formState: { errors }, reset } =
        useForm<OrderForm>({ mode: 'onBlur' });

    const wv = watch();

    /* ── Dropzone ─────────────────────────────────────────────── */
    const onDrop = useCallback((accepted: File[]) => {
        setFiles(prev => [...prev, ...accepted].slice(0, 5));
    }, []);

    const { getRootProps, getInputProps, isDragActive } = useDropzone({
        accept: { 'image/*': [] }, maxFiles: 5, maxSize: 10 * 1024 * 1024, onDrop,
    });

    const removeFile = (i: number) => setFiles(f => f.filter((_, idx) => idx !== i));

    /* ── Step validation map ──────────────────────────────────── */
    const stepFields: Record<number, (keyof OrderForm)[]> = {
        1: ['customerName', 'mobile', 'email', 'contactMethod'],
        2: ['artworkType', 'size', 'orientation', 'numberOfFaces'],
        3: [], 4: ['street', 'city', 'state', 'pincode'], 5: [],
    };

    const goNext = async () => {
        const ok = await trigger(stepFields[step]);
        if (ok) setStep(s => Math.min(s + 1, 5));
    };
    const goBack = () => setStep(s => Math.max(s - 1, 1));

    /* ── Submit ───────────────────────────────────────────────── */
    const onSubmit = async (data: OrderForm) => {
        setIsSubmitting(true);
        try {
            const fd = new FormData();
            Object.entries(data).forEach(([k, v]) => {
                if (!['street', 'city', 'state', 'pincode', 'landmark'].includes(k)) fd.append(k, v);
            });
            fd.append('deliveryAddress', JSON.stringify({
                street: data.street, city: data.city, state: data.state,
                pincode: data.pincode, landmark: data.landmark,
            }));
            files.forEach(f => fd.append('referenceImages', f));

            const res = await ordersAPI.create(fd);
            setOrderNumber(res.data.data.orderNumber);
            setSubmittedName(data.customerName);
            setSubmittedArtwork(data.artworkType);
            setSubmitted(true);
            reset(); setFiles([]); setStep(1);
        } catch {
            toast.error('Failed to place order. Please try WhatsApp: +91 7806906030');
        } finally {
            setIsSubmitting(false);
        }
    };

    /* ── Pill radio helper ────────────────────────────────────── */
    const PillRadio = ({ name, value, label, icon }: { name: keyof OrderForm; value: string; label: string; icon?: React.ReactNode }) => {
        const active = wv[name] === value;
        return (
            <label style={{
                display: 'flex', alignItems: 'center', gap: 8,
                padding: '12px 22px', borderRadius: 999, cursor: 'pointer',
                border: active ? `1.5px solid ${GOLD}` : '1px solid rgba(212,175,55,0.2)',
                background: active ? 'rgba(212,175,55,0.12)' : 'transparent',
                color: active ? GOLD : '#888',
                fontSize: 14, fontWeight: active ? 600 : 400,
                transition: 'all 0.2s',
                userSelect: 'none',
            }}>
                <input type="radio" value={value} {...register(name as any)} style={{ display: 'none' }} />
                {icon}{label}
            </label>
        );
    };

    /* ── Success screen ───────────────────────────────────────── */
    if (submitted) {
        return (
            <div style={{ minHeight: '100vh', background: DARK, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '96px 20px' }}>
                <motion.div
                    initial={{ scale: 0.85, opacity: 0 }} animate={{ scale: 1, opacity: 1 }}
                    transition={{ duration: 0.5 }}
                    style={{ ...card, maxWidth: 600, width: '100%', textAlign: 'center', padding: '64px 56px' }}
                >
                    <motion.div animate={{ scale: [1, 1.12, 1] }} transition={{ repeat: 2, duration: 0.5 }}
                        style={{ width: 96, height: 96, borderRadius: '50%', background: 'rgba(212,175,55,0.12)', color: GOLD, display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 32px' }}>
                        <CheckCircle size={48} />
                    </motion.div>
                    <h2 style={{ fontFamily: 'Cinzel, serif', fontSize: 38, fontWeight: 700, color: GOLD, marginBottom: 12 }}>Thank You!</h2>
                    <p style={{ fontSize: 16, color: '#A0A0A0', lineHeight: 1.7, marginBottom: 36 }}>
                        Your custom artwork request has been submitted successfully.<br />
                        We'll get back to you within <strong style={{ color: GOLD }}>24 hours</strong>.
                    </p>

                    <div style={{ borderRadius: 16, padding: 24, marginBottom: 36, textAlign: 'left', background: 'rgba(212,175,55,0.05)', border: '1px solid rgba(212,175,55,0.18)' }}>
                        {[
                            { l: 'Order ID', v: orderNumber },
                            { l: 'Customer', v: submittedName },
                            { l: 'Artwork', v: submittedArtwork },
                            { l: 'Est. Response', v: 'Within 24 hours' },
                        ].map(({ l, v }) => (
                            <div key={l} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '12px 0', borderBottom: '1px solid rgba(212,175,55,0.1)' }}>
                                <span style={{ color: '#666', fontSize: 13 }}>{l}</span>
                                <span style={{ color: l === 'Order ID' ? GOLD : '#F5F5F5', fontWeight: 600, fontFamily: l === 'Order ID' ? 'Cinzel, serif' : 'inherit' }}>{v}</span>
                            </div>
                        ))}
                    </div>

                    <div style={{ display: 'flex', gap: 16, flexWrap: 'wrap' }}>
                        <motion.a href="https://wa.me/917806906030" target="_blank" rel="noopener noreferrer"
                            whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }}
                            style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8, padding: '16px 24px', borderRadius: 999, fontWeight: 700, fontSize: 15, background: `linear-gradient(135deg,${GOLD},#B8961E)`, color: '#0D0D12', textDecoration: 'none' }}>
                            <MessageCircle size={18} /> WhatsApp Us
                        </motion.a>
                        <motion.button onClick={() => setSubmitted(false)}
                            whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }}
                            style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8, padding: '16px 24px', borderRadius: 999, fontWeight: 700, fontSize: 15, background: 'transparent', border: `1px solid ${GOLD}`, color: GOLD, cursor: 'pointer' }}>
                            <Home size={18} /> Place Another Order
                        </motion.button>
                    </div>
                </motion.div>
            </div>
        );
    }

    /* ── Main page ────────────────────────────────────────────── */
    return (
        <div style={{ minHeight: '100vh', background: DARK, width: '100%' }}>

            {/* ── Header ── */}
            <div style={{ paddingTop: 96, paddingBottom: 56, textAlign: 'center', background: 'rgba(255,255,255,0.01)', borderBottom: '1px solid rgba(212,175,55,0.08)' }}>
                <motion.div initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }}>
                    <span style={{ fontSize: 12, letterSpacing: '0.25em', textTransform: 'uppercase', fontWeight: 700, color: GOLD }}>Custom Artwork</span>
                    <h1 style={{ fontFamily: 'Cinzel, serif', fontSize: 'clamp(40px, 5vw, 68px)', fontWeight: 800, color: GOLD, margin: '12px 0 16px', lineHeight: 1.1 }}>
                        Place an Order
                    </h1>
                    <p style={{ fontSize: 16, color: '#A0A0A0', maxWidth: 600, margin: '0 auto' }}>
                        Fill in the details below and we'll bring your vision to life with precision and artistry.
                    </p>
                </motion.div>
            </div>

            {/* ── Progress Stepper ── */}
            <div style={{ maxWidth: 1100, margin: '0 auto', padding: '48px 40px 0' }}>
                <div style={{ display: 'flex', alignItems: 'flex-start', position: 'relative' }}>
                    {/* Track */}
                    <div style={{ position: 'absolute', top: 22, left: 0, right: 0, height: 2, background: 'rgba(212,175,55,0.12)', zIndex: 0, margin: '0 32px' }} />
                    <div style={{
                        position: 'absolute', top: 22, left: '2%', height: 2, zIndex: 1,
                        width: `${((step - 1) / (STEPS.length - 1)) * 96}%`,
                        background: `linear-gradient(90deg,${GOLD},#B8961E)`,
                        transition: 'width 0.5s cubic-bezier(0.4,0,0.2,1)',
                    }} />
                    {STEPS.map(s => {
                        const Icon = s.icon;
                        const done = step > s.id, active = step === s.id;
                        return (
                            <div key={s.id} style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 10, position: 'relative', zIndex: 2 }}>
                                <div style={{
                                    width: 46, height: 46, borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center',
                                    transition: 'all 0.3s',
                                    background: done ? `linear-gradient(135deg,${GOLD},#B8961E)` : active ? 'rgba(212,175,55,0.15)' : 'rgba(255,255,255,0.04)',
                                    border: active ? `2px solid ${GOLD}` : done ? 'none' : '1px solid rgba(212,175,55,0.18)',
                                    color: done ? '#0D0D12' : active ? GOLD : '#444',
                                    boxShadow: active ? `0 0 16px rgba(212,175,55,0.3)` : 'none',
                                }}>
                                    {done ? <CheckCircle size={18} /> : <Icon size={18} />}
                                </div>
                                <span style={{
                                    fontSize: 11, fontWeight: active ? 700 : 500, color: active ? GOLD : done ? '#888' : '#3a3a3a',
                                    textAlign: 'center', maxWidth: 80, lineHeight: 1.3,
                                    display: window.innerWidth < 480 ? 'none' : 'block',
                                }}>{s.label}</span>
                            </div>
                        );
                    })}
                </div>
            </div>

            {/* ── Form ── */}
            <div style={{ maxWidth: 1700, margin: '0 auto', padding: 'clamp(32px,4vw,56px) clamp(16px,5vw,80px) 96px' }}>
                <form onSubmit={handleSubmit(onSubmit)}>
                    <AnimatePresence mode="wait">

                        {/* ═══ STEP 1: Customer Details ═══ */}
                        {step === 1 && (
                            <motion.div key="s1" initial={{ opacity: 0, x: 48 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -48 }} transition={{ duration: 0.32 }}>
                                <div style={card}>
                                    {sectionHead(<User size={20} />, 'Customer Details', 'Tell us about yourself')}
                                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit,minmax(280px,1fr))', gap: 28 }}>

                                        {/* Full Name */}
                                        <div>
                                            <label style={lbl}>Full Name *</label>
                                            <input {...register('customerName', { required: 'Full name is required' })}
                                                placeholder="Your full name"
                                                style={errors.customerName ? inpErr : inp} />
                                            {errors.customerName && <p style={{ color: '#ff6b6b', fontSize: 12, marginTop: 6 }}>{errors.customerName.message}</p>}
                                        </div>

                                        {/* Mobile */}
                                        <div>
                                            <label style={lbl}>Mobile Number *</label>
                                            <input {...register('mobile', {
                                                required: 'Mobile number is required',
                                                pattern: { value: /^[6-9]\d{9}$/, message: 'Enter a valid 10-digit mobile number' }
                                            })}
                                                placeholder="+91 98765 43210"
                                                style={errors.mobile ? inpErr : inp} />
                                            {errors.mobile && <p style={{ color: '#ff6b6b', fontSize: 12, marginTop: 6 }}>{errors.mobile.message}</p>}
                                        </div>

                                        {/* Email */}
                                        <div style={{ gridColumn: '1 / -1' }}>
                                            <label style={lbl}>Email Address *</label>
                                            <input {...register('email', {
                                                required: 'Email is required',
                                                pattern: { value: /^\S+@\S+\.\S+$/, message: 'Enter a valid email address' }
                                            })}
                                                placeholder="your@email.com"
                                                style={errors.email ? inpErr : inp} />
                                            {errors.email && <p style={{ color: '#ff6b6b', fontSize: 12, marginTop: 6 }}>{errors.email.message}</p>}
                                        </div>

                                        {/* Contact Method */}
                                        <div style={{ gridColumn: '1 / -1' }}>
                                            <label style={lbl}>Preferred Contact Method *</label>
                                            <div style={{ display: 'flex', flexWrap: 'wrap', gap: 12 }}>
                                                <PillRadio name="contactMethod" value="WhatsApp" label="WhatsApp" icon={<MessageCircle size={15} />} />
                                                <PillRadio name="contactMethod" value="Call" label="Call" icon={<Phone size={15} />} />
                                                <PillRadio name="contactMethod" value="Email" label="Email" icon={<Mail size={15} />} />
                                            </div>
                                            {errors.contactMethod && <p style={{ color: '#ff6b6b', fontSize: 12, marginTop: 6 }}>{(errors.contactMethod as any).message || 'Please select a contact method'}</p>}
                                        </div>
                                    </div>
                                </div>
                            </motion.div>
                        )}

                        {/* ═══ STEP 2: Artwork Details ═══ */}
                        {step === 2 && (
                            <motion.div key="s2" initial={{ opacity: 0, x: 48 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -48 }} transition={{ duration: 0.32 }}>
                                <div style={card}>
                                    {sectionHead(<Palette size={20} />, 'Artwork Details', "Describe what you'd like created")}
                                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit,minmax(260px,1fr))', gap: 28 }}>

                                        {/* Artwork Type */}
                                        <div>
                                            <label style={lbl}>Artwork Type *</label>
                                            <select {...register('artworkType', { required: 'Please select an artwork type' })}
                                                style={errors.artworkType ? { ...inpErr, appearance: 'none' } : { ...inp, appearance: 'none' }}>
                                                <option value="" style={{ background: '#1a1a28' }}>Select artwork type</option>
                                                {ARTWORK_TYPES.map(t => <option key={t} value={t} style={{ background: '#1a1a28' }}>{t}</option>)}
                                            </select>
                                            {errors.artworkType && <p style={{ color: '#ff6b6b', fontSize: 12, marginTop: 6 }}>{errors.artworkType.message}</p>}
                                        </div>

                                        {/* Frame Size */}
                                        <div>
                                            <label style={lbl}>Frame Size *</label>
                                            <select {...register('size', { required: 'Please select a size' })}
                                                style={errors.size ? { ...inpErr, appearance: 'none' } : { ...inp, appearance: 'none' }}>
                                                <option value="" style={{ background: '#1a1a28' }}>Select size</option>
                                                {SIZES.map(s => <option key={s} value={s} style={{ background: '#1a1a28' }}>{s}</option>)}
                                            </select>
                                            {errors.size && <p style={{ color: '#ff6b6b', fontSize: 12, marginTop: 6 }}>{errors.size.message}</p>}
                                        </div>

                                        {/* Orientation */}
                                        <div>
                                            <label style={lbl}>Orientation *</label>
                                            <div style={{ display: 'flex', gap: 12 }}>
                                                {ORIENTATIONS.map(o => <PillRadio key={o} name="orientation" value={o} label={o} />)}
                                            </div>
                                            {errors.orientation && <p style={{ color: '#ff6b6b', fontSize: 12, marginTop: 6 }}>{(errors.orientation as any).message}</p>}
                                        </div>

                                        {/* Number of Faces */}
                                        <div>
                                            <label style={lbl}>Number of Faces *</label>
                                            <input {...register('numberOfFaces', { required: 'Enter number of faces' })}
                                                placeholder="e.g. 1, 2, Family Group"
                                                style={errors.numberOfFaces ? inpErr : inp} />
                                            {errors.numberOfFaces && <p style={{ color: '#ff6b6b', fontSize: 12, marginTop: 6 }}>{errors.numberOfFaces.message}</p>}
                                        </div>

                                        {/* Background */}
                                        <div>
                                            <label style={lbl}>Background Preference</label>
                                            <input {...register('background')}
                                                placeholder="e.g. Plain white, Floral, Custom"
                                                style={inp} />
                                        </div>

                                        {/* Event Date */}
                                        <div>
                                            <label style={lbl}>Deadline / Event Date <span style={{ color: '#555', textTransform: 'none' }}>(Optional)</span></label>
                                            <input type="date" {...register('eventDate')}
                                                style={{ ...inp, colorScheme: 'dark' }} />
                                        </div>

                                        {/* Special Instructions — full-width */}
                                        <div style={{ gridColumn: '1 / -1' }}>
                                            <label style={lbl}>Special Instructions</label>
                                            <textarea {...register('instructions')}
                                                placeholder="Describe your vision — specific details, colour preferences, mood, occasion, or any other requirements…"
                                                rows={6}
                                                style={{ ...inp, resize: 'vertical', minHeight: 130 }} />
                                        </div>
                                    </div>
                                </div>
                            </motion.div>
                        )}

                        {/* ═══ STEP 3: Reference Photos ═══ */}
                        {step === 3 && (
                            <motion.div key="s3" initial={{ opacity: 0, x: 48 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -48 }} transition={{ duration: 0.32 }}>
                                <div style={card}>
                                    {sectionHead(<ImagePlus size={20} />, 'Reference Photos', 'Upload up to 5 clear reference images')}

                                    {/* Drop zone */}
                                    <div {...getRootProps()} style={{
                                        border: `2px dashed ${isDragActive ? GOLD : 'rgba(212,175,55,0.3)'}`,
                                        borderRadius: 18, padding: 64, textAlign: 'center', cursor: 'pointer',
                                        background: isDragActive ? 'rgba(212,175,55,0.06)' : 'rgba(255,255,255,0.02)',
                                        transition: 'all 0.2s',
                                    }}>
                                        <input {...getInputProps()} />
                                        <Upload size={48} style={{ color: GOLD, opacity: 0.75, margin: '0 auto 20px' }} />
                                        <p style={{ fontSize: 18, fontWeight: 600, color: '#F5F5F5', marginBottom: 8 }}>
                                            {isDragActive ? 'Release to upload' : 'Drag & Drop or Click to Upload'}
                                        </p>
                                        <p style={{ fontSize: 13, color: '#555', marginBottom: 24 }}>
                                            JPG, PNG, WebP · Max 10 MB per file · Up to 5 images
                                        </p>
                                        <motion.span whileHover={{ scale: 1.04 }} style={{
                                            display: 'inline-block', padding: '11px 28px', borderRadius: 999,
                                            background: 'rgba(212,175,55,0.13)', color: GOLD,
                                            border: '1px solid rgba(212,175,55,0.3)', fontSize: 14, fontWeight: 600, cursor: 'pointer',
                                        }}>Browse Files</motion.span>
                                    </div>

                                    {/* Preview grid */}
                                    {files.length > 0 && (
                                        <div style={{ marginTop: 32 }}>
                                            <div style={{ display: 'flex', alignItems: 'center', gap: 16, marginBottom: 20 }}>
                                                <Camera size={16} style={{ color: GOLD }} />
                                                <span style={{ color: GOLD, fontSize: 14, fontWeight: 600 }}>{files.length} / 5 uploaded</span>
                                                <div style={{ flex: 1, height: 6, borderRadius: 999, background: 'rgba(255,255,255,0.06)', overflow: 'hidden' }}>
                                                    <div style={{ height: '100%', borderRadius: 999, width: `${(files.length / 5) * 100}%`, background: `linear-gradient(90deg,${GOLD},#B8961E)`, transition: 'width 0.3s' }} />
                                                </div>
                                            </div>
                                            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill,minmax(160px,1fr))', gap: 16 }}>
                                                {files.map((file, i) => (
                                                    <div key={i} style={{ position: 'relative', borderRadius: 14, overflow: 'hidden', border: '1px solid rgba(212,175,55,0.18)' }}
                                                        className="group">
                                                        <img src={URL.createObjectURL(file)} alt=""
                                                            style={{ width: '100%', height: 140, objectFit: 'cover', display: 'block' }} />
                                                        <div style={{
                                                            position: 'absolute', inset: 0, background: 'rgba(0,0,0,0.5)',
                                                            display: 'flex', alignItems: 'center', justifyContent: 'center',
                                                            opacity: 0, transition: 'opacity 0.2s',
                                                        }}
                                                            onMouseEnter={e => (e.currentTarget.style.opacity = '1')}
                                                            onMouseLeave={e => (e.currentTarget.style.opacity = '0')}>
                                                            <button type="button" onClick={() => removeFile(i)}
                                                                style={{ width: 36, height: 36, borderRadius: '50%', background: '#ff4444', border: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                                                                <X size={16} color="#fff" />
                                                            </button>
                                                        </div>
                                                        <p style={{ fontSize: 10, padding: '5px 8px', color: '#888', background: 'rgba(0,0,0,0.6)', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                                                            {file.name}
                                                        </p>
                                                    </div>
                                                ))}
                                            </div>
                                        </div>
                                    )}
                                </div>
                            </motion.div>
                        )}

                        {/* ═══ STEP 4: Delivery Address ═══ */}
                        {step === 4 && (
                            <motion.div key="s4" initial={{ opacity: 0, x: 48 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -48 }} transition={{ duration: 0.32 }}>
                                <div style={card}>
                                    {sectionHead(<MapPin size={20} />, 'Delivery Address', 'Where should we deliver the artwork?')}
                                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit,minmax(260px,1fr))', gap: 28 }}>

                                        {/* Full Address */}
                                        <div style={{ gridColumn: '1 / -1' }}>
                                            <label style={lbl}>Full Address *</label>
                                            <input {...register('street', { required: 'Street address is required' })}
                                                placeholder="Door no, Building, Street, Area"
                                                style={errors.street ? inpErr : inp} />
                                            {errors.street && <p style={{ color: '#ff6b6b', fontSize: 12, marginTop: 6 }}>{errors.street.message}</p>}
                                        </div>

                                        {/* City */}
                                        <div>
                                            <label style={lbl}>City *</label>
                                            <input {...register('city', { required: 'City is required' })}
                                                placeholder="City"
                                                style={errors.city ? inpErr : inp} />
                                            {errors.city && <p style={{ color: '#ff6b6b', fontSize: 12, marginTop: 6 }}>{errors.city.message}</p>}
                                        </div>

                                        {/* State */}
                                        <div>
                                            <label style={lbl}>State *</label>
                                            <input {...register('state', { required: 'State is required' })}
                                                placeholder="State"
                                                style={errors.state ? inpErr : inp} />
                                            {errors.state && <p style={{ color: '#ff6b6b', fontSize: 12, marginTop: 6 }}>{errors.state.message}</p>}
                                        </div>

                                        {/* Pincode */}
                                        <div>
                                            <label style={lbl}>Pincode *</label>
                                            <input {...register('pincode', {
                                                required: 'Pincode is required',
                                                pattern: { value: /^\d{6}$/, message: 'Enter a valid 6-digit pincode' }
                                            })}
                                                placeholder="6-digit pincode"
                                                style={errors.pincode ? inpErr : inp} />
                                            {errors.pincode && <p style={{ color: '#ff6b6b', fontSize: 12, marginTop: 6 }}>{errors.pincode.message}</p>}
                                        </div>

                                        {/* Landmark */}
                                        <div>
                                            <label style={lbl}>Landmark <span style={{ color: '#555', textTransform: 'none' }}>(Optional)</span></label>
                                            <input {...register('landmark')}
                                                placeholder="e.g. Near Post Office"
                                                style={inp} />
                                        </div>
                                    </div>
                                </div>
                            </motion.div>
                        )}

                        {/* ═══ STEP 5: Review & Submit ═══ */}
                        {step === 5 && (
                            <motion.div key="s5" initial={{ opacity: 0, x: 48 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -48 }} transition={{ duration: 0.32 }}>
                                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit,minmax(340px,1fr))', gap: 28 }}>

                                    {/* LEFT — Order Summary + Photos */}
                                    <div style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>
                                        {/* Order Summary */}
                                        <div style={card}>
                                            {sectionHead(<Star size={18} />, 'Order Summary', 'Review your artwork details')}
                                            <div style={{ display: 'flex', flexDirection: 'column', gap: 0 }}>
                                                {[
                                                    { l: 'Customer', v: wv.customerName },
                                                    { l: 'Mobile', v: wv.mobile },
                                                    { l: 'Email', v: wv.email },
                                                    { l: 'Contact via', v: wv.contactMethod },
                                                    { l: 'Artwork Type', v: wv.artworkType },
                                                    { l: 'Frame Size', v: wv.size },
                                                    { l: 'Orientation', v: wv.orientation },
                                                    { l: 'Faces', v: wv.numberOfFaces },
                                                    { l: 'Background', v: wv.background || '—' },
                                                    { l: 'Event Date', v: wv.eventDate || '—' },
                                                ].map(({ l, v }) => (
                                                    <div key={l} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: 16, padding: '13px 0', borderBottom: '1px solid rgba(212,175,55,0.08)' }}>
                                                        <span style={{ fontSize: 13, color: '#555', minWidth: 110, flexShrink: 0 }}>{l}</span>
                                                        <span style={{ fontSize: 14, color: '#E0E0E0', fontWeight: 500, textAlign: 'right' }}>{v || '—'}</span>
                                                    </div>
                                                ))}
                                                {wv.instructions && (
                                                    <div style={{ paddingTop: 16 }}>
                                                        <p style={{ fontSize: 12, color: '#555', marginBottom: 6 }}>Special Instructions</p>
                                                        <p style={{ fontSize: 14, color: '#C0C0C0', lineHeight: 1.7 }}>{wv.instructions}</p>
                                                    </div>
                                                )}
                                            </div>
                                        </div>

                                        {/* Uploaded Photos */}
                                        {files.length > 0 && (
                                            <div style={card}>
                                                <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 20 }}>
                                                    <Camera size={18} style={{ color: GOLD }} />
                                                    <h3 style={{ fontFamily: 'Cinzel, serif', fontSize: 17, fontWeight: 700, color: '#F5F5F5', margin: 0 }}>
                                                        Uploaded Photos <span style={{ color: GOLD }}>({files.length})</span>
                                                    </h3>
                                                </div>
                                                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill,minmax(100px,1fr))', gap: 10 }}>
                                                    {files.map((f, i) => (
                                                        <img key={i} src={URL.createObjectURL(f)} alt=""
                                                            style={{ width: '100%', height: 90, objectFit: 'cover', borderRadius: 10, border: '1px solid rgba(212,175,55,0.15)' }} />
                                                    ))}
                                                </div>
                                            </div>
                                        )}
                                    </div>

                                    {/* RIGHT — Delivery + Price + Submit */}
                                    <div style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>
                                        {/* Delivery Details */}
                                        <div style={card}>
                                            {sectionHead(<MapPin size={18} />, 'Delivery Details', 'Shipping information')}
                                            <div>
                                                {[
                                                    { l: 'Address', v: wv.street },
                                                    { l: 'City', v: wv.city },
                                                    { l: 'State', v: wv.state },
                                                    { l: 'Pincode', v: wv.pincode },
                                                    { l: 'Landmark', v: wv.landmark || '—' },
                                                ].map(({ l, v }) => (
                                                    <div key={l} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: 16, padding: '13px 0', borderBottom: '1px solid rgba(212,175,55,0.08)' }}>
                                                        <span style={{ fontSize: 13, color: '#555', minWidth: 80, flexShrink: 0 }}>{l}</span>
                                                        <span style={{ fontSize: 14, color: '#E0E0E0', fontWeight: 500, textAlign: 'right' }}>{v || '—'}</span>
                                                    </div>
                                                ))}
                                            </div>
                                        </div>

                                        {/* Estimated Price Summary */}
                                        <div style={card}>
                                            <h3 style={{ fontFamily: 'Cinzel, serif', fontSize: 18, fontWeight: 700, color: '#F5F5F5', marginBottom: 24 }}>Estimated Timeline</h3>
                                            <div style={{ display: 'flex', gap: 16 }}>
                                                {[
                                                    { icon: <Clock size={20} />, label: 'Est. Response', value: 'Within 24 hrs' },
                                                    { icon: <Package size={20} />, label: 'Est. Delivery', value: '7–14 Working Days' },
                                                ].map(({ icon, label, value }) => (
                                                    <div key={label} style={{ flex: 1, borderRadius: 14, padding: '20px 16px', textAlign: 'center', background: 'rgba(212,175,55,0.05)', border: '1px solid rgba(212,175,55,0.13)' }}>
                                                        <div style={{ color: GOLD, marginBottom: 8 }}>{icon}</div>
                                                        <p style={{ fontSize: 11, color: '#555', marginBottom: 4 }}>{label}</p>
                                                        <p style={{ fontSize: 14, color: '#F5F5F5', fontWeight: 600 }}>{value}</p>
                                                    </div>
                                                ))}
                                            </div>

                                            <p style={{ fontSize: 12, color: '#555', marginTop: 20, lineHeight: 1.6 }}>
                                                Final pricing will be confirmed after reviewing your reference photos and requirements. We'll reach you via your preferred contact method.
                                            </p>

                                            {/* Place Order button inside review card */}
                                            <motion.button
                                                type="submit" disabled={isSubmitting}
                                                whileHover={isSubmitting ? {} : { scale: 1.02, y: -2 }}
                                                whileTap={{ scale: 0.97 }}
                                                style={{
                                                    marginTop: 28, width: '100%', padding: '18px 0', borderRadius: 999,
                                                    fontWeight: 700, fontSize: 16, cursor: isSubmitting ? 'not-allowed' : 'pointer',
                                                    background: `linear-gradient(135deg,${GOLD},#B8961E)`, color: '#0D0D12',
                                                    border: 'none', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 10,
                                                    opacity: isSubmitting ? 0.7 : 1, transition: 'opacity 0.2s',
                                                    boxShadow: `0 6px 24px rgba(212,175,55,0.25)`,
                                                    fontFamily: 'inherit',
                                                }}
                                            >
                                                {isSubmitting
                                                    ? <><div style={{ width: 20, height: 20, borderRadius: '50%', border: '2.5px solid #000', borderTopColor: 'transparent', animation: 'spin 0.7s linear infinite' }} /> Placing Order…</>
                                                    : <><Package size={19} /> Place Order</>
                                                }
                                            </motion.button>
                                        </div>
                                    </div>
                                </div>
                            </motion.div>
                        )}
                    </AnimatePresence>

                    {/* ── Navigation Buttons ── */}
                    <div style={{ display: 'flex', gap: 16, marginTop: 36, flexWrap: 'wrap' }}>
                        {step > 1 && (
                            <motion.button type="button" onClick={goBack}
                                whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}
                                style={{ display: 'flex', alignItems: 'center', gap: 8, padding: '16px 32px', borderRadius: 999, fontWeight: 700, fontSize: 15, background: 'transparent', border: `1px solid rgba(212,175,55,0.35)`, color: GOLD, cursor: 'pointer', fontFamily: 'inherit' }}>
                                <ChevronLeft size={18} /> Back
                            </motion.button>
                        )}
                        {step < 5 && (
                            <motion.button type="button" onClick={goNext}
                                whileHover={{ scale: 1.02, y: -2 }} whileTap={{ scale: 0.97 }}
                                style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8, padding: '16px 40px', borderRadius: 999, fontWeight: 700, fontSize: 16, background: `linear-gradient(135deg,${GOLD},#B8961E)`, color: '#0D0D12', border: 'none', cursor: 'pointer', fontFamily: 'inherit', boxShadow: `0 6px 24px rgba(212,175,55,0.22)` }}>
                                Continue <ChevronRight size={18} />
                            </motion.button>
                        )}
                    </div>

                    {/* Step counter */}
                    <p style={{ textAlign: 'center', fontSize: 12, color: '#3a3a3a', marginTop: 20 }}>
                        Step {step} of {STEPS.length} — {STEPS[step - 1].label}
                    </p>
                </form>
            </div>

            {/* Spinner keyframe */}
            <style>{`@keyframes spin{to{transform:rotate(360deg)}}`}</style>
        </div>
    );
};

export default OrderPage;
