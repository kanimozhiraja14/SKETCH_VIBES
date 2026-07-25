const Frame = require('../models/Frame');

exports.getFrames = async (req, res) => {
    console.log(`[API Request] GET /api/frames - Query:`, req.query);
    try {
        const { size, style } = req.query;
        const query = { isAvailable: true };
        if (size) query.size = size;
        if (style) query.style = style;
        const frames = await (Frame.find(query).sort({ price: 1 }) || []);
        console.log(`[DB Success] Retrieved ${frames.length} frames`);
        res.status(200).json({ success: true, data: frames });
    } catch (error) {
        console.error(`[DB Error] Failed in getFrames`);
        console.error(error.stack);
        res.status(200).json({ success: true, data: [], fallback: true });
    }
};

exports.getAllFrames = async (req, res) => {
    console.log(`[API Request] GET /api/frames/all`);
    try {
        const frames = await (Frame.find().sort({ createdAt: -1 }) || []);
        console.log(`[DB Success] Retrieved ${frames.length} total frames`);
        res.status(200).json({ success: true, data: frames });
    } catch (error) {
        console.error(`[DB Error] Failed in getAllFrames`);
        console.error(error.stack);
        res.status(200).json({ success: true, data: [], fallback: true });
    }
};

exports.createFrame = async (req, res) => {
    console.log(`[API Request] POST /api/frames`, req.body);
    try {
        const data = { ...req.body };
        if (req.file) { data.imageUrl = req.file.path; data.publicId = req.file.filename; }
        if (data.availableColors) data.availableColors = data.availableColors.split(',').map(c => c.trim());
        const frame = await Frame.create(data);
        console.log(`[DB Success] Created frame:`, frame._id);
        res.status(201).json({ success: true, data: frame });
    } catch (error) {
        console.error(`[DB Error] Failed in createFrame`);
        console.error(error.stack);
        res.status(500).json({ success: false, message: "Server error during creation" });
    }
};

exports.updateFrame = async (req, res) => {
    console.log(`[API Request] PUT /api/frames/${req.params.id}`, req.body);
    try {
        const data = { ...req.body, updatedAt: Date.now() };
        if (req.file) { data.imageUrl = req.file.path; data.publicId = req.file.filename; }
        const frame = await Frame.findByIdAndUpdate(req.params.id, data, { new: true });
        if (!frame) return res.status(404).json({ success: false, message: 'Frame not found' });
        console.log(`[DB Success] Updated frame:`, frame._id);
        res.json({ success: true, data: frame });
    } catch (error) {
        console.error(`[DB Error] Failed in updateFrame`);
        console.error(error.stack);
        res.status(500).json({ success: false, message: "Server error during update" });
    }
};

exports.deleteFrame = async (req, res) => {
    console.log(`[API Request] DELETE /api/frames/${req.params.id}`);
    try {
        const frame = await Frame.findByIdAndDelete(req.params.id);
        if (!frame) return res.status(404).json({ success: false, message: 'Frame not found' });
        console.log(`[DB Success] Deleted frame:`, req.params.id);
        res.json({ success: true, message: 'Deleted successfully' });
    } catch (error) {
        console.error(`[DB Error] Failed in deleteFrame`);
        console.error(error.stack);
        res.status(500).json({ success: false, message: "Server error during deletion" });
    }
};
