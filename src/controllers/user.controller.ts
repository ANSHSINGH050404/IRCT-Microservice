import type { NextFunction, Request, Response } from "express";
import { prisma } from "../../db";
import RedisClient from "../config/redis";
import { NotFoundError } from "../utils/error";

const redis = RedisClient.getInstance();

export const getProfile = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const userId = req.user!.id;

    const cached = await redis.get(`user:${userId}`);
    if (cached) {
      res.status(200).json({ success: true, user: JSON.parse(cached) });
      return;
    }

    const user = await prisma.user.findUnique({ where: { id: userId } });
    if (!user) {
      throw new NotFoundError("User not found");
    }

    const { password: _, ...userData } = user;

    await redis.set(`user:${userId}`, JSON.stringify(userData), "EX", 300);

    res.status(200).json({ success: true, user: userData });
  } catch (error) {
    next(error);
  }
};
