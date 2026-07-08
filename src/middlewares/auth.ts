import type { NextFunction, Request, Response } from 'express';
import jwt from 'jsonwebtoken';
import { config } from '../config';

const PUBLIC_PATHS = ['/api/v1/auth', '/health', '/'];

export const authenticate = (req: Request, res: Response, next: NextFunction) => {
  const isPublic = PUBLIC_PATHS.some(p => {
    if (p === '/') return req.path === '/';
    return req.path === p || req.path.startsWith(p + '/');
  });

  if (isPublic) {
    return next();
  }

  const token = req.cookies?.accessToken || req.headers.authorization?.replace('Bearer ', '');

  if (!token) {
    res.status(401).json({
      success: false,
      error: 'Access token is required',
      statusCode: 401,
      code: 'UNAUTHORIZED',
    });
    return;
  }

  try {
    const decoded = jwt.verify(token, config.accessTokenSecret) as { id: string };
    req.headers['x-user-id'] = decoded.id;
    next();
  } catch {
    res.status(401).json({
      success: false,
      error: 'Invalid or expired access token',
      statusCode: 401,
      code: 'UNAUTHORIZED',
    });
  }
};
