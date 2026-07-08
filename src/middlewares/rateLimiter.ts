import type { NextFunction, Request, Response } from 'express';
import { config } from '../config';
import RedisClient from '../utils/redis';

const redis = RedisClient.getInstance();

const getLimit = (path: string): { max: number; windowMs: number } => {
  for (const [routePath, opts] of Object.entries(config.rateLimit.routes)) {
    if (path.startsWith(routePath)) {
      return { max: opts.max, windowMs: config.rateLimit.windowMs };
    }
  }
  return { max: config.rateLimit.maxDefault, windowMs: config.rateLimit.windowMs };
};

export const rateLimiter = async (req: Request, res: Response, next: NextFunction) => {
  const ip = req.ip || req.socket.remoteAddress || 'unknown';
  const { max, windowMs } = getLimit(req.path);
  const key = `rate_limit:${ip}:${req.path}`;

  try {
    const count = await redis.incr(key);
    if (count === 1) {
      await redis.expire(key, Math.ceil(windowMs / 1000));
    }
    if (count > max) {
      res.status(429).json({
        success: false,
        error: 'Too many requests',
        statusCode: 429,
        code: 'RATE_LIMIT_EXCEEDED',
      });
      return;
    }
  } catch {
    // allow request if Redis is unavailable
  }
  next();
};
