import cookieParser from 'cookie-parser';
import cors from 'cors';
import express from 'express';
import { requestLogger } from './middlewares/req.middleware.js';
import { errorHandler } from './middlewares/error.middleware.js';
import authRoutes from './routes/auth.routes.js';
import userRoutes from './routes/user.routes.js';
import notFoundMiddleware from './middlewares/notFound_middleware.js';

const app = express();

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(requestLogger);
app.use('/api/v1/auth', authRoutes);
app.use('/api/v1/user', userRoutes);
app.get('/', (_req, res) => {
  res.json({ success: true, message: 'User service is running' });
});

app.get('/health', (_req, res) => {
  res.json({ success: true, message: 'Health check OK' });
});

app.use(notFoundMiddleware);
app.use(errorHandler);

export default app;
