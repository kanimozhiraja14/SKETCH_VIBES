const mongoose = require('mongoose');

const testimonialSchema = new mongoose.Schema({
    customerName: { type: String, required: true },
    rating: { type: Number, min: 1, max: 5, required: true },
    review: { type: String, required: true },
    profilePhoto: { type: String },
    profilePhotoPublicId: { type: String },
    artworkType: { type: String },
    isApproved: { type: Boolean, default: false },
    isFeatured: { type: Boolean, default: false },
    createdAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model('Testimonial', testimonialSchema);
