const Service = require('../models/Service');
const cloudinary = require('../config/cloudinary');

exports.getServices = async (req, res) => {
    console.log(`[API Request] GET /api/services - Query:`, req.query);
    try {
        const services = await (Service.find({ isActive: true }).sort({ order: 1 }) || []);
        console.log(`[DB Success] Retrieved ${services.length} active services`);
        res.status(200).json({ success: true, data: services });
    } catch (error) {
        console.error(`[DB Error] Failed in getServices`);
        console.error(error.stack);
        res.status(200).json({ success: true, data: [], fallback: true });
    }
};

exports.getAllServices = async (req, res) => {
    console.log(`[API Request] GET /api/services/all - Query:`, req.query);
    try {
        const services = await (Service.find().sort({ order: 1 }) || []);
        console.log(`[DB Success] Retrieved ${services.length} total services`);
        res.status(200).json({ success: true, data: services });
    } catch (error) {
        console.error(`[DB Error] Failed in getAllServices`);
        console.error(error.stack);
        res.status(200).json({ success: true, data: [], fallback: true });
    }
};

exports.createService = async (req, res) => {
    console.log(`[API Request] POST /api/services`, req.body);
    try {
        const data = { ...req.body };
        if (req.file) {
            data.imageUrl = req.file.path;
            data.publicId = req.file.filename;
        }
        if (data.features) data.features = data.features.split(',').map(f => f.trim());
        const service = await Service.create(data);
        console.log(`[DB Success] Created service:`, service._id);
        res.status(201).json({ success: true, data: service });
    } catch (error) {
        console.error(`[DB Error] Failed in createService`);
        console.error(error.stack);
        res.status(500).json({ success: false, message: "Server error during creation" });
    }
};

exports.updateService = async (req, res) => {
    console.log(`[API Request] PUT /api/services/${req.params.id}`, req.body);
    try {
        const data = { ...req.body, updatedAt: Date.now() };
        if (req.file) {
            data.imageUrl = req.file.path;
            data.publicId = req.file.filename;
        }
        const service = await Service.findByIdAndUpdate(req.params.id, data, { new: true });
        if (!service) return res.status(404).json({ success: false, message: 'Service not found' });
        console.log(`[DB Success] Updated service:`, service._id);
        res.json({ success: true, data: service });
    } catch (error) {
        console.error(`[DB Error] Failed in updateService`);
        console.error(error.stack);
        res.status(500).json({ success: false, message: "Server error during update" });
    }
};

exports.deleteService = async (req, res) => {
    console.log(`[API Request] DELETE /api/services/${req.params.id}`);
    try {
        const service = await Service.findById(req.params.id);
        if (!service) return res.status(404).json({ success: false, message: 'Service not found' });
        if (service.publicId) await cloudinary.uploader.destroy(service.publicId);
        await service.deleteOne();
        console.log(`[DB Success] Deleted service:`, req.params.id);
        res.json({ success: true, message: 'Deleted successfully' });
    } catch (error) {
        console.error(`[DB Error] Failed in deleteService`);
        console.error(error.stack);
        res.status(500).json({ success: false, message: "Server error during deletion" });
    }
};
