const dotenv = require('dotenv');
// Verify dotenv is loaded and add debug log
const result = dotenv.config();
if (result.error) {
    console.log("❌ Error loading .env file");
} else {
    console.log("✅ Environment variables loaded");
}

const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');
const morgan = require('morgan');
const connectDB = require('./src/config/db');

const app = express();
app.use(helmet({ crossOriginResourcePolicy: { policy: 'cross-origin' } }));
// Allow multiple origins: FRONTEND_URL can be comma-separated for Render + local dev
const allowedOrigins = [
    ...(process.env.FRONTEND_URL ? process.env.FRONTEND_URL.split(',').map(o => o.trim()) : []),
    'http://localhost:5173',
    'http://localhost:3000',
];
app.use(cors({
    origin: (origin, callback) => {
        // Allow requests with no origin (mobile apps, curl, Render health checks)
        if (!origin || allowedOrigins.includes(origin)) return callback(null, true);
        callback(new Error(`CORS: origin ${origin} not allowed`));
    },
    credentials: true,
}));

// Rate limiting
const limiter = rateLimit({ windowMs: 15 * 60 * 1000, max: 200 });
app.use('/api', limiter);

// Body parser
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Logging
if (process.env.NODE_ENV === 'development') app.use(morgan('dev'));

// Routes
app.use('/api/auth', require('./src/routes/auth'));
app.use('/api/gallery', require('./src/routes/gallery'));
app.use('/api/services', require('./src/routes/services'));
app.use('/api/frames', require('./src/routes/frames'));
app.use('/api/orders', require('./src/routes/orders'));
app.use('/api/contact', require('./src/routes/contact'));
app.use('/api/dashboard', require('./src/routes/dashboard'));

// Health checks & Root handles
app.get('/api/health', (req, res) => res.json({ status: 'ok', timestamp: new Date() }));
app.get('/api', (req, res) => res.json({ message: 'SKETCH_VIBES23 API is running' }));
app.get('/', (req, res) => res.send('Backend Server is live. Access frontend at localhost:5173'));

// Global error handler
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(err.status || 500).json({ success: false, message: err.message || 'Internal Server Error' });
});

const PORT = process.env.PORT || 5000;

// Connect to MongoDB and start server
connectDB().then(() => {
    app.listen(PORT, () => {
        console.log(`🚀 Server running on http://localhost:${PORT}`);
    });
}).catch(err => {
    console.error('Failed to start server due to database connection error.');
    process.exit(1);
});

module.exports = app;
