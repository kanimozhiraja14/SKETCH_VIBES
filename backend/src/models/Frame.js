const mongoose = require('mongoose');

const frameSchema = new mongoose.Schema({
    name: { type: String, required: true },
    size: {
        type: String,
        required: true,
        enum: ['4x4', '5x7', '6x8', '8x10', '10x12', '12x16', 'A4', 'A3', 'A2', 'A1', 'Custom'],
    },
    style: {
        type: String,
        required: true,
        enum: ['Wooden', 'Black', 'White', 'Golden', 'Modern'],
    },
    material: { type: String },
    imageUrl: { type: String, required: true },
    publicId: { type: String },
    price: { type: Number, required: true },
    availableColors: [{ type: String }],
    description: { type: String },
    isAvailable: { type: Boolean, default: true },
    isFeatured: { type: Boolean, default: false },
    createdAt: { type: Date, default: Date.now },
    updatedAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model('Frame', frameSchema);
