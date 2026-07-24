const Gallery = require('../models/Gallery');
const Order = require('../models/Order');
const Contact = require('../models/Contact');
const Testimonial = require('../models/Testimonial');
const Service = require('../models/Service');

exports.getDashboardStats = async (req, res) => {
    try {
        const [totalGallery, totalOrders, pendingOrders, completedOrders, totalContacts, unreadContacts, totalTestimonials, totalServices] = await Promise.all([
            Gallery.countDocuments(),
            Order.countDocuments(),
            Order.countDocuments({ status: 'Pending' }),
            Order.countDocuments({ status: 'Completed' }),
            Contact.countDocuments(),
            Contact.countDocuments({ isRead: false }),
            Testimonial.countDocuments(),
            Service.countDocuments(),
        ]);

        const recentOrders = await Order.find().sort({ createdAt: -1 }).limit(5).populate('frame');
        const recentContacts = await Contact.find().sort({ createdAt: -1 }).limit(5);

        res.json({
            success: true,
            data: {
                totalGallery, totalOrders, pendingOrders, completedOrders,
                totalContacts, unreadContacts, totalTestimonials, totalServices,
                recentOrders, recentContacts,
            },
        });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};
