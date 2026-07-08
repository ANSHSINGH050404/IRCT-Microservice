import express from 'express';
import cors from 'cors';
import { requestLogger } from './middlewares/req.middleware.js';
import { errorHandler } from './middlewares/error.middleware.js';
import authRoutes from './routes/auth.routes.js';

const app = express();

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(requestLogger);
app.use('/api/v1/auth', authRoutes);
app.use(errorHandler);
app.get('/', (_req, res) => {
  res.json({ success: true, message: 'User service is running' });
});

app.get('/health', (_req, res) => {
  res.json({ success: true, message: 'Health check OK' });
});

app.use((_req, res) => {
  res.status(404).json({ success: false, message: 'Route not found' });
});

export default app;
