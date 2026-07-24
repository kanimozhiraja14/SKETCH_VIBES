const Order = require('../models/Order');
const nodemailer = require('nodemailer');
const cloudinary = require('../config/cloudinary');

const sendEmail = async (to, subject, html) => {
    try {
        const transporter = nodemailer.createTransport({
            host: process.env.EMAIL_HOST,
            port: process.env.EMAIL_PORT,
            auth: { user: process.env.EMAIL_USER, pass: process.env.EMAIL_PASS },
        });
        await transporter.sendMail({ from: process.env.EMAIL_USER, to, subject, html });
    } catch (err) {
        console.error('Email error:', err.message);
    }
};

exports.createOrder = async (req, res) => {
    try {
        const { customerName, mobile, email, artworkType, size, instructions, deliveryAddress } = req.body;
        const referenceImages = [];
        if (req.files && req.files.length > 0) {
            for (const file of req.files) {
                referenceImages.push({ url: file.path, publicId: file.filename });
            }
        }
        const order = await Order.create({
            customerName, mobile, email, artworkType, size, instructions,
            deliveryAddress: deliveryAddress ? JSON.parse(deliveryAddress) : {},
            frame: req.body.frame || null,
            referenceImages,
        });

        // Send confirmation email to customer
        await sendEmail(email, `Order Confirmed - ${order.orderNumber}`, `
      <h2>Thank you for your order, ${customerName}!</h2>
      <p>Your order <strong>${order.orderNumber}</strong> has been received.</p>
      <p><strong>Artwork Type:</strong> ${artworkType}</p>
      <p><strong>Size:</strong> ${size}</p>
      <p>We will contact you shortly. WhatsApp: +91 7806906030</p>
      <br><p>- SKETCH_VIBES23 | Artist Saran</p>
    `);

        // Notify admin
        await sendEmail(process.env.ADMIN_EMAIL, `New Order - ${order.orderNumber}`, `
      <h3>New order received!</h3>
      <p><strong>Customer:</strong> ${customerName}</p>
      <p><strong>Mobile:</strong> ${mobile}</p>
      <p><strong>Email:</strong> ${email}</p>
      <p><strong>Artwork:</strong> ${artworkType} | Size: ${size}</p>
    `);

        res.status(201).json({ success: true, data: order });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

exports.getOrders = async (req, res) => {
    try {
        const { status, page = 1, limit = 20 } = req.query;
        const query = status ? { status } : {};
        const skip = (page - 1) * limit;
        const total = await Order.countDocuments(query);
        const orders = await Order.find(query).populate('frame').sort({ createdAt: -1 }).skip(skip).limit(Number(limit));
        res.json({ success: true, data: orders, total, page: Number(page) });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

exports.updateOrder = async (req, res) => {
    try {
        const order = await Order.findByIdAndUpdate(
            req.params.id,
            { ...req.body, updatedAt: Date.now() },
            { new: true }
        ).populate('frame');
        if (!order) return res.status(404).json({ success: false, message: 'Order not found' });

        // Send status update email
        if (req.body.status) {
            await sendEmail(order.email, `Order Update - ${order.orderNumber}`, `
        <h3>Your order status has been updated!</h3>
        <p>Order: <strong>${order.orderNumber}</strong></p>
        <p>New Status: <strong>${req.body.status}</strong></p>
        <p>For queries, WhatsApp: +91 7806906030</p>
      `);
        }
        res.json({ success: true, data: order });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};
