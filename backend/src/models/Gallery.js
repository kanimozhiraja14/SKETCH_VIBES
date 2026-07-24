const mongoose = require('mongoose');

const gallerySchema = new mongoose.Schema({
    title: { type: String, required: true },
    description: { type: String },
    category: {
        type: String,
        required: true,
        enum: [
            'Pencil Sketch', 'Colour Pencil Art', 'Acrylic Painting', 'Oil Painting',
            'Canvas Painting', 'Blood Art', 'Fingerprint Tree', 'Turmeric Painting',
            'Paper Quilling', 'Wall Murals', 'Couple Portraits', 'Family Portraits',
            'Pet Portraits', 'Wedding Gifts', 'Photo Frames'
        ],
    },
    imageUrl: { type: String, required: true },
    publicId: { type: String, required: true },
    tags: [{ type: String }],
    isFeatured: { type: Boolean, default: false },
    views: { type: Number, default: 0 },
    createdAt: { type: Date, default: Date.now },
    updatedAt: { type: Date, default: Date.now },
});

gallerySchema.pre('save', function (next) {
    this.updatedAt = Date.now();
    next();
});

module.exports = mongoose.model('Gallery', gallerySchema);
