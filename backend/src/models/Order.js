const mongoose = require('mongoose');

const orderSchema = new mongoose.Schema({
    orderNumber: { type: String, unique: true },
    customerName: { type: String, required: true },
    mobile: { type: String, required: true },
    email: { type: String, required: true },
    artworkType: { type: String, required: true },
    frame: { type: mongoose.Schema.Types.ObjectId, ref: 'Frame' },
    size: { type: String, required: true },
    instructions: { type: String },
    deliveryAddress: {
        street: String,
        city: String,
        state: String,
        pincode: String,
        country: { type: String, default: 'India' },
    },
    referenceImages: [{
        url: String,
        publicId: String,
    }],
    status: {
        type: String,
        enum: ['Pending', 'Confirmed', 'In Progress', 'Completed', 'Delivered', 'Cancelled'],
        default: 'Pending',
    },
    totalAmount: { type: Number },
    isPaid: { type: Boolean, default: false },
    notes: { type: String },
    createdAt: { type: Date, default: Date.now },
    updatedAt: { type: Date, default: Date.now },
});

orderSchema.pre('save', function (next) {
    if (!this.orderNumber) {
        this.orderNumber = 'ORD-' + Date.now() + '-' + Math.random().toString(36).substr(2, 5).toUpperCase();
    }
    this.updatedAt = Date.now();
    next();
});

module.exports = mongoose.model('Order', orderSchema);
