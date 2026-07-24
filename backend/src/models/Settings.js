const mongoose = require('mongoose');

const settingsSchema = new mongoose.Schema({
    siteName: { type: String, default: 'SKETCH_VIBES23' },
    artistName: { type: String, default: 'Artist Saran' },
    tagline: { type: String, default: 'Turning Memories into Timeless Art.' },
    heroBanner: { type: String },
    heroBannerPublicId: { type: String },
    whatsappNumber: { type: String, default: '7806906030' },
    instagramUrl: { type: String, default: 'https://instagram.com/Sketch_vibes23' },
    email: { type: String, default: 'sketchvibes23@gmail.com' },
    address: { type: String },
    businessHours: { type: String, default: 'Mon-Sat: 9AM - 6PM' },
    aboutText: { type: String },
    socialLinks: {
        instagram: { type: String },
        facebook: { type: String },
        youtube: { type: String },
        twitter: { type: String },
    },
    seoTitle: { type: String },
    seoDescription: { type: String },
    updatedAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model('Settings', settingsSchema);
