const Gallery = require('../models/Gallery');
const cloudinary = require('../config/cloudinary');

exports.getGallery = async (req, res) => {
    try {
        const { category, search, page = 1, limit = 20 } = req.query;
        const query = {};
        if (category) query.category = category;
        if (search) query.$or = [
            { title: { $regex: search, $options: 'i' } },
            { tags: { $in: [new RegExp(search, 'i')] } },
        ];
        const skip = (page - 1) * limit;
        const total = await Gallery.countDocuments(query);
        const items = await Gallery.find(query).sort({ createdAt: -1 }).skip(skip).limit(Number(limit));
        res.json({ success: true, data: items, total, page: Number(page), totalPages: Math.ceil(total / limit) });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

exports.createGallery = async (req, res) => {
    try {
        const { title, description, category, tags, isFeatured } = req.body;
        if (!req.file) return res.status(400).json({ success: false, message: 'Image is required' });

        const item = await Gallery.create({
            title, description, category,
            imageUrl: req.file.path,
            publicId: req.file.filename,
            tags: tags ? tags.split(',').map(t => t.trim()) : [],
            isFeatured: isFeatured === 'true',
        });
        res.status(201).json({ success: true, data: item });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

exports.updateGallery = async (req, res) => {
    try {
        const item = await Gallery.findByIdAndUpdate(req.params.id, { ...req.body, updatedAt: Date.now() }, { new: true });
        if (!item) return res.status(404).json({ success: false, message: 'Item not found' });
        res.json({ success: true, data: item });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

exports.deleteGallery = async (req, res) => {
    try {
        const item = await Gallery.findById(req.params.id);
        if (!item) return res.status(404).json({ success: false, message: 'Item not found' });
        await cloudinary.uploader.destroy(item.publicId);
        await item.deleteOne();
        res.json({ success: true, message: 'Deleted successfully' });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};
