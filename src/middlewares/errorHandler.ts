import type { NextFunction, Request, Response } from 'express';

export const errorHandler = (err: Error, _req: Request, res: Response, _next: NextFunction) => {
  console.error(`[ERROR] ${err.message}`);
  res.status(500).json({
    success: false,
    error: 'Internal server error',
    statusCode: 500,
    code: 'INTERNAL_ERROR',
  });
};
