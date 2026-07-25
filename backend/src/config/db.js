const mongoose = require('mongoose');

const connectDB = async () => {
    if (!process.env.MONGO_URI) {
        console.error('❌ MongoDB Connection Error: MONGO_URI is not defined in environment variables.');
        process.exit(1);
    }

    try {
        const conn = await mongoose.connect(process.env.MONGO_URI);
        console.log(`✅ MongoDB Atlas Connected Successfully`);
        console.log(`✅ Database connection established`);
    } catch (error) {
        console.error(`❌ MongoDB Connection Error: ${error.message}`);
        process.exit(1);
    }
};

module.exports = connectDB;
