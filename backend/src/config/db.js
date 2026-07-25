const mongoose = require('mongoose');

// Fail fast for queries when disconnected
mongoose.set('bufferTimeoutMS', 1500);

const connectDB = async () => {
    const uri = process.env.MONGODB_URI || process.env.MONGO_URI;
    if (!uri || uri.includes('<Replace')) {
        console.warn('⚠️ MongoDB URI is missing or invalid. Running without DB connection.');
        return; // Don't crash, just return
    }

    try {
        const conn = await mongoose.connect(uri, {
            serverSelectionTimeoutMS: 2000, // Fail fast if DB is down (~2s)
        });
        console.log(`✅ MongoDB Connected: ${conn.connection.host}`);
    } catch (error) {
        console.error(`❌ MongoDB Connection Error: ${error.message}`);
        console.warn('⚠️ Running without DB connection due to error.');
        // process.exit(1); -> Removed to prevent crashing the backend
    }
};

module.exports = connectDB;
