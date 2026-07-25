const Gallery = require('../models/Gallery');
const cloudinary = require('../config/cloudinary');

exports.getGallery = async (req, res) => {
    console.log(`[API Request] GET /api/gallery - Query:`, req.query);
    try {
        const { category, search, page = 1, limit = 20 } = req.query;
        const query = {};
        if (category) query.category = category;
        if (search) query.$or = [
            { title: { $regex: search, $options: 'i' } },
            { tags: { $in: [new RegExp(search, 'i')] } },
        ];
        const skip = (page - 1) * limit;
        const total = await (Gallery.countDocuments(query).catch(() => 0));
        const items = await (Gallery.find(query).sort({ createdAt: -1 }).skip(skip).limit(Number(limit)).catch(() => []));

        console.log(`[DB Success] Retrieved ${items.length} gallery items`);
        res.status(200).json({ success: true, data: items, total, page: Number(page), totalPages: Math.ceil((total || 1) / limit) });
    } catch (error) {
        console.error(`[DB Error] Failed in getGallery`);
        console.error(error.stack);
        res.status(200).json({ success: true, data: [], total: 0, page: 1, totalPages: 1, fallback: true });
    }
};

exports.createGallery = async (req, res) => {
    console.log(`[API Request] POST /api/gallery`, req.body);
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
        console.log(`[DB Success] Created gallery item:`, item._id);
        res.status(201).json({ success: true, data: item });
    } catch (error) {
        console.error(`[DB Error] Failed in createGallery`);
        console.error(error.stack);
        res.status(500).json({ success: false, message: "Server error during creation" });
    }
};

exports.updateGallery = async (req, res) => {
    console.log(`[API Request] PUT /api/gallery/${req.params.id}`, req.body);
    try {
        const item = await Gallery.findByIdAndUpdate(req.params.id, { ...req.body, updatedAt: Date.now() }, { new: true });
        if (!item) return res.status(404).json({ success: false, message: 'Item not found' });
        console.log(`[DB Success] Updated gallery item:`, item._id);
        res.json({ success: true, data: item });
    } catch (error) {
        console.error(`[DB Error] Failed in updateGallery`);
        console.error(error.stack);
        res.status(500).json({ success: false, message: "Server error during update" });
    }
};

exports.deleteGallery = async (req, res) => {
    console.log(`[API Request] DELETE /api/gallery/${req.params.id}`);
    try {
        const item = await Gallery.findById(req.params.id);
        if (!item) return res.status(404).json({ success: false, message: 'Item not found' });
        await cloudinary.uploader.destroy(item.publicId);
        await item.deleteOne();
        console.log(`[DB Success] Deleted gallery item:`, req.params.id);
        res.json({ success: true, message: 'Deleted successfully' });
    } catch (error) {
        console.error(`[DB Error] Failed in deleteGallery`);
        console.error(error.stack);
        res.status(500).json({ success: false, message: "Server error during deletion" });
    }
};
