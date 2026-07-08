import type{ NextFunction, Request, Response } from "express";
import AppError from "../utils/error";

export const errorHandler = (
  err: Error,
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const statusCode = err instanceof AppError ? err.statusCode : 500;
  const code = err instanceof AppError ? err.code : "INTERNAL_ERROR";

  res.status(statusCode).json({
    success: false,
    error: err.message,
    statusCode,
    code,
  });
};
