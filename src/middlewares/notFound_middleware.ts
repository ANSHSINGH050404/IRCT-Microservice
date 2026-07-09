import type{ Request, Response, NextFunction } from 'express';
import { NotFoundError } from "../utils/error";


export default function notFoundMiddleware(req: Request, res: Response, next: NextFunction) {
    next(new NotFoundError(`Route ${req.method} ${req.path} not found`));
}