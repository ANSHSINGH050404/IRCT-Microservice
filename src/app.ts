import cookieParser from 'cookie-parser';
import cors from 'cors';
import express from 'express';
import { config } from './config';
import { authenticate } from './middlewares/auth';
import { correlationId } from './middlewares/correlationId';
import { errorHandler } from './middlewares/errorHandler';
import { requestLogger } from './middlewares/logger';
import { rateLimiter } from './middlewares/rateLimiter';
import { serviceProxies } from './routes/proxy';

const app = express();

app.use(cors({
  origin: config.corsOrigin === '*' ? true : config.corsOrigin,
  credentials: true,
}));
app.use(cookieParser());
app.use(correlationId);
app.use(requestLogger);
app.use(authenticate);
app.use(rateLimiter);
serviceProxies.forEach(proxy => app.use(proxy));

app.get('/health', (_req, res) => {
  res.json({ success: true, message: 'API Gateway is running' });
});

app.use((_req, res) => {
  res.status(404).json({ success: false, message: 'Route not found' });
});

app.use(errorHandler);

export default app;
