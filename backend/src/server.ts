import express, { Request, Response, NextFunction } from 'express';
import cors from 'cors';
import morgan from 'morgan';
import path from 'path';
import fs from 'fs';
import dotenv from 'dotenv';
import mongoose from 'mongoose';

import { initStorage } from './config/database.js';
import { seedDatabase } from './seeds/seedData.js';
import authRoutes from './routes/auth.routes.js';
import productRoutes from './routes/products.routes.js';
import orderRoutes from './routes/orders.routes.js';
import customCakeRoutes from './routes/customCakes.routes.js';
import offerRoutes from './routes/offers.routes.js';
import statsRoutes from './routes/stats.routes.js';
import uploadRoutes from './routes/upload.routes.js';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// Initialize database store and seed
initStorage();
seedDatabase();

// Connect MongoDB if MONGODB_URI is provided
if (process.env.MONGODB_URI) {
  mongoose
    .connect(process.env.MONGODB_URI)
    .then(() => console.log('✅ Connected to MongoDB database successfully.'))
    .catch(err => console.warn('⚠️ MongoDB connection not available, using high-performance local store fallback:', err.message));
} else {
  console.log('ℹ️ Local JSON file store active (backend/data/db.json). Ready for all operations.');
}

// Middleware
app.use(cors({
  origin: '*',
  methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));
app.use(morgan('dev'));

// Static uploads folder (support running from root or backend directory)
const BACKEND_ROOT = fs.existsSync(path.resolve(process.cwd(), 'uploads')) || fs.existsSync(path.resolve(process.cwd(), 'src'))
  ? process.cwd()
  : path.resolve(process.cwd(), 'backend');
const UPLOADS_DIR = path.resolve(BACKEND_ROOT, 'uploads');
app.use('/uploads', express.static(UPLOADS_DIR));

// Health check & Info
app.get('/api/health', (_req: Request, res: Response) => {
  res.json({
    status: 'healthy',
    timestamp: new Date().toISOString(),
    bakery: {
      name: 'PON CAFE (Rukmani Bakery)',
      admin: 'Rukmani',
      phone: '6374123265',
      address: 'Kangeayam Road, Chennimalai, Erode – 638051'
    }
  });
});

// API Routes
app.use('/api/auth', authRoutes);
app.use('/api/products', productRoutes);
app.use('/api/orders', orderRoutes);
app.use('/api/custom-cakes', customCakeRoutes);
app.use('/api/offers', offerRoutes);
app.use('/api/stats', statsRoutes);
app.use('/api/upload', uploadRoutes);

// 404 Handler
app.use((_req: Request, res: Response) => {
  res.status(404).json({ success: false, message: 'API route not found' });
});

// Global Error Handler
app.use((err: any, _req: Request, res: Response, _next: NextFunction) => {
  console.error('Unhandled server error:', err);
  res.status(500).json({
    success: false,
    message: err.message || 'An internal server error occurred.'
  });
});

app.listen(PORT, () => {
  console.log(`
🧁 ======================================================= 🧁
   🎂 PON CAFE / RUKMANI BAKERY BACKEND SERVER RUNNING 🎂
   📍 Location: Kangeayam Road, Chennimalai, Erode – 638051
   👤 Administrator: Rukmani (📞 6374123265)
   🚀 Server Port: http://localhost:${PORT}
   🔗 Health Check: http://localhost:${PORT}/api/health
🧁 ======================================================= 🧁
  `);
});

export default app;
