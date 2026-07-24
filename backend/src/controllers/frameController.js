const Frame = require('../models/Frame');

exports.getFrames = async (req, res) => {
    try {
        const { size, style } = req.query;
        const query = { isAvailable: true };
        if (size) query.size = size;
        if (style) query.style = style;
        const frames = await Frame.find(query).sort({ price: 1 });
        res.json({ success: true, data: frames });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

exports.getAllFrames = async (req, res) => {
    try {
        const frames = await Frame.find().sort({ createdAt: -1 });
        res.json({ success: true, data: frames });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

exports.createFrame = async (req, res) => {
    try {
        const data = { ...req.body };
        if (req.file) { data.imageUrl = req.file.path; data.publicId = req.file.filename; }
        if (data.availableColors) data.availableColors = data.availableColors.split(',').map(c => c.trim());
        const frame = await Frame.create(data);
        res.status(201).json({ success: true, data: frame });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

exports.updateFrame = async (req, res) => {
    try {
        const data = { ...req.body, updatedAt: Date.now() };
        if (req.file) { data.imageUrl = req.file.path; data.publicId = req.file.filename; }
        const frame = await Frame.findByIdAndUpdate(req.params.id, data, { new: true });
        if (!frame) return res.status(404).json({ success: false, message: 'Frame not found' });
        res.json({ success: true, data: frame });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

exports.deleteFrame = async (req, res) => {
    try {
        const frame = await Frame.findByIdAndDelete(req.params.id);
        if (!frame) return res.status(404).json({ success: false, message: 'Frame not found' });
        res.json({ success: true, message: 'Deleted successfully' });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};
