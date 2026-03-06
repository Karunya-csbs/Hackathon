import express from 'express';
import cors from 'cors';
import 'express-async-errors';
import dotenv from 'dotenv';

import authRoutes from './routes/authRoutes.js';
import projectRoutes from './routes/projectRoutes.js';
import deployRoutes from './routes/deployRoutes.js';
import importRoutes from './routes/importRoutes.js';
import errorHandler from './middleware/errorHandler.js';
import authMiddleware from './middleware/authMiddleware.js';

dotenv.config();

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Routes
app.use('/api/auth', authRoutes);
// projects endpoint no longer requires authentication (public & CORS-friendly)
app.use('/api/projects', projectRoutes);
app.use('/api/deploy', authMiddleware, deployRoutes);
app.use('/api/import', importRoutes);

// Health check
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

// Error handling
app.use(errorHandler);

// use PORT env var if provided; default to 5000 for consistency with frontend docs
const PORT = process.env.PORT || 5000;
app.listen(PORT, '127.0.0.1', () => {
  console.log(`Server running on http://localhost:${PORT} (CORS enabled)`);
});