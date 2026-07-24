const multer = require('multer');
const cloudinary = require('../config/cloudinary');
const path = require('path');

// Use memory storage (buffer) — then upload to Cloudinary manually
const storage = multer.memoryStorage();

const upload = multer({
    storage,
    limits: { fileSize: 10 * 1024 * 1024 }, // 10MB
    fileFilter: (req, file, cb) => {
        const allowed = ['.jpg', '.jpeg', '.png', '.webp', '.gif'];
        const ext = path.extname(file.originalname).toLowerCase();
        if (file.mimetype.startsWith('image/') && allowed.includes(ext)) {
            cb(null, true);
        } else {
            cb(new Error('Only image files (JPG, PNG, WebP, GIF) are allowed'), false);
        }
    },
});

// Helper: upload buffer to Cloudinary
const uploadToCloudinary = (buffer, folder = 'sketchvibes23') => {
    return new Promise((resolve, reject) => {
        const stream = cloudinary.uploader.upload_stream(
            { folder, transformation: [{ width: 1200, crop: 'limit', quality: 'auto' }] },
            (error, result) => {
                if (error) reject(error);
                else resolve(result);
            }
        );
        stream.end(buffer);
    });
};

// Middleware that processes after multer
const processUploads = async (req, res, next) => {
    try {
        if (req.file) {
            const result = await uploadToCloudinary(req.file.buffer);
            req.file.path = result.secure_url;
            req.file.filename = result.public_id;
        }
        if (req.files && Array.isArray(req.files)) {
            for (const file of req.files) {
                const result = await uploadToCloudinary(file.buffer);
                file.path = result.secure_url;
                file.filename = result.public_id;
            }
        }
        next();
    } catch (error) {
        next(error);
    }
};

module.exports = { upload, processUploads };
