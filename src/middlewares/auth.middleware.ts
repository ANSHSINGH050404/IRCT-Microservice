import type { NextFunction, Request, Response } from "express";
import { verifyAccessToken } from "../utils/auth";
import { UnauthorizedError } from "../utils/error";

declare global {
  namespace Express {
    interface Request {
      user?: { id: string; email: string };
    }
  }
}

export const authenticate = (req: Request, _res: Response, next: NextFunction) => {
  const token = req.cookies?.accessToken ?? req.headers.authorization?.replace("Bearer ", "");

  if (!token) {
    return next(new UnauthorizedError("Access token is required"));
  }

  try {
    const decoded = verifyAccessToken(token);
    req.user = { id: decoded.id, email: decoded.email };
    next();
  } catch (err) {
    next(err);
  }
};
