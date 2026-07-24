const Service = require('../models/Service');
const cloudinary = require('../config/cloudinary');

exports.getServices = async (req, res) => {
    try {
        const services = await Service.find({ isActive: true }).sort({ order: 1 });
        res.json({ success: true, data: services });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

exports.getAllServices = async (req, res) => {
    try {
        const services = await Service.find().sort({ order: 1 });
        res.json({ success: true, data: services });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

exports.createService = async (req, res) => {
    try {
        const data = { ...req.body };
        if (req.file) {
            data.imageUrl = req.file.path;
            data.publicId = req.file.filename;
        }
        if (data.features) data.features = data.features.split(',').map(f => f.trim());
        const service = await Service.create(data);
        res.status(201).json({ success: true, data: service });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

exports.updateService = async (req, res) => {
    try {
        const data = { ...req.body, updatedAt: Date.now() };
        if (req.file) {
            data.imageUrl = req.file.path;
            data.publicId = req.file.filename;
        }
        const service = await Service.findByIdAndUpdate(req.params.id, data, { new: true });
        if (!service) return res.status(404).json({ success: false, message: 'Service not found' });
        res.json({ success: true, data: service });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

exports.deleteService = async (req, res) => {
    try {
        const service = await Service.findById(req.params.id);
        if (!service) return res.status(404).json({ success: false, message: 'Service not found' });
        if (service.publicId) await cloudinary.uploader.destroy(service.publicId);
        await service.deleteOne();
        res.json({ success: true, message: 'Deleted successfully' });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};
