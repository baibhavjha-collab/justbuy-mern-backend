import 'dotenv/config';

import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import cookieParser from 'cookie-parser';
import rateLimit from 'express-rate-limit';

import connectDB from './config/db.js';

import authRoutes from './routes/authRoutes.js';
import userRoutes from './routes/userRoutes.js';
import productRoutes from './routes/productRoutes.js';
import categoryRoutes from './routes/categoryRoutes.js';
import cartRoutes from './routes/cartRoutes.js';
import orderRoutes from './routes/orderRoutes.js';
import reviewRoutes from './routes/reviewRoutes.js';
import uploadRoutes from './routes/uploadRoutes.js';

import {
  notFound,
  errorHandler,
} from './middleware/errorMiddleware.js';

await connectDB();

const app = express();

// -------------------------
// SECURITY
// -------------------------

app.use(
  helmet({
    crossOriginResourcePolicy: {
      policy: 'cross-origin',
    },
  })
);

// -------------------------
// CORS
// -------------------------

app.use(
  cors({
    origin:
      process.env.CLIENT_URL ||
      'http://localhost:5180',
    credentials: true,
  })
);

// -------------------------
// BODY PARSING
// -------------------------

app.use(
  express.json({
    limit: '7mb',
  })
);

app.use(cookieParser());

// -------------------------
// STATIC UPLOADED IMAGES
// -------------------------

app.use(
  '/uploads',
  express.static('uploads')
);

// -------------------------
// LOGGING
// -------------------------

app.use(morgan('dev'));

// -------------------------
// RATE LIMITING
// -------------------------

app.use(
  '/api',
  rateLimit({
    windowMs: 15 * 60 * 1000,
    max: 300,
    standardHeaders: true,
    legacyHeaders: false,
  })
);

// -------------------------
// HEALTH CHECK
// -------------------------

app.get('/api/health', (req, res) => {
  res.json({
    success: true,
    service: 'JustBuy API',
    environment:
      process.env.NODE_ENV || 'development',
  });
});

// -------------------------
// API ROUTES
// -------------------------

app.use('/api/auth', authRoutes);

app.use('/api/users', userRoutes);

app.use('/api/products', productRoutes);

app.use('/api/categories', categoryRoutes);

app.use('/api/cart', cartRoutes);

app.use('/api/orders', orderRoutes);

app.use('/api/reviews', reviewRoutes);

app.use('/api/uploads', uploadRoutes);

// -------------------------
// ERROR HANDLING
// -------------------------

app.use(notFound);

app.use(errorHandler);

// -------------------------
// SERVER
// -------------------------

const PORT = process.env.PORT || 5005;

app.listen(PORT, () => {
  console.log(
    `JustBuy API running on http://localhost:${PORT}`
  );
});