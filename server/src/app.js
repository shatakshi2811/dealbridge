const express = require('express');
const cors = require('cors');
const morgan = require('morgan');
const rateLimit = require('express-rate-limit');

const authRoutes = require('./routes/auth');
const productRoutes = require('./routes/products');
const offerRoutes = require('./routes/offers');
const clickRoutes = require('./routes/clicks');
const wishlistRoutes = require('./routes/wishlist');
const analyticsRoutes = require('./routes/analytics');
const { errorHandler, notFound } = require('./middleware/errorHandler');

const app = express();

// ─── Trust proxy (needed for accurate IP in production / Render) ───────────
app.set('trust proxy', 1);

// ─── CORS ──────────────────────────────────────────────────────────────────
const allowedOrigins = [
  process.env.CLIENT_URL || 'http://localhost:3000',
  'http://localhost:5173', // Vite dev server
];

app.use(
  cors({
    origin: (origin, callback) => {
      // Allow requests with no origin (curl, Postman, mobile apps)
      if (!origin) return callback(null, true);
      if (allowedOrigins.includes(origin)) return callback(null, true);
      callback(new Error(`CORS: Origin ${origin} not allowed`));
    },
    credentials: true,
  })
);

// ─── Body parsers ──────────────────────────────────────────────────────────
app.use(express.json({ limit: '10kb' }));
app.use(express.urlencoded({ extended: true, limit: '10kb' }));

// ─── HTTP logging ──────────────────────────────────────────────────────────
if (process.env.NODE_ENV !== 'test') {
  app.use(morgan(process.env.NODE_ENV === 'production' ? 'combined' : 'dev'));
}

// ─── General API rate limit ────────────────────────────────────────────────
const generalLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 200,
  standardHeaders: true,
  legacyHeaders: false,
  message: { success: false, message: 'Too many requests. Please slow down.' },
});
app.use('/api', generalLimiter);

// ─── Health check ──────────────────────────────────────────────────────────
app.get('/api/health', (req, res) => {
  res.json({ success: true, message: 'DealBridge API is running', timestamp: new Date() });
});

// ─── Routes ────────────────────────────────────────────────────────────────
app.use('/api/auth', authRoutes);
app.use('/api/products', productRoutes);
app.use('/api/offers', offerRoutes);
app.use('/api/redirect', clickRoutes);
app.use('/api/wishlist', wishlistRoutes);
app.use('/api/analytics', analyticsRoutes);

// ─── 404 & Error handlers ──────────────────────────────────────────────────
app.use(notFound);
app.use(errorHandler);

module.exports = app;
