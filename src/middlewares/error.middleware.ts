import type{ NextFunction, Request, Response } from "express";
import AppError from "../utils/error";

export const errorHandler = (
  err: AppError,
  req: Request,
  res: Response,
  next: NextFunction
) => {
  res.status(err.statusCode).json({
    success: false,
    error: err.message,
    statusCode: err.statusCode,
    code: err.code,
  });
};
