const jwt = require('jsonwebtoken');
const User = require('../models/User');

const signToken = (id) =>
    jwt.sign({ id }, process.env.JWT_SECRET, { expiresIn: process.env.JWT_EXPIRE });

exports.login = async (req, res) => {
    try {
        const { email, password } = req.body;
        if (!email || !password)
            return res.status(400).json({ success: false, message: 'Please provide email and password' });

        const user = await User.findOne({ email }).select('+password');
        if (!user || !(await user.comparePassword(password)))
            return res.status(401).json({ success: false, message: 'Invalid credentials' });

        const token = signToken(user._id);
        user.password = undefined;
        res.json({ success: true, token, user });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

exports.getMe = async (req, res) => {
    res.json({ success: true, user: req.user });
};

exports.createAdmin = async (req, res) => {
    try {
        const existing = await User.findOne({ role: 'admin' });
        if (existing) return res.status(400).json({ success: false, message: 'Admin already exists' });

        const admin = await User.create({
            name: 'Admin',
            email: process.env.ADMIN_EMAIL || 'admin@sketchvibes23.com',
            password: 'Admin@123456',
            role: 'admin',
        });
        res.json({ success: true, message: 'Admin created', email: admin.email });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};
