import crypto from "node:crypto";
import jwt from "jsonwebtoken";
import { config } from "../config";

export const generateAccessToken = (userId: string, email: string): string => {
  const payload = { id: userId, email };

  return jwt.sign(payload, config.ACCESS_TOKEN_SECRET, {
    expiresIn: "15m",
  });
};

export const generateRefreshToken = (userId: string): { token: string; jti: string } => {
  const jti = crypto.randomUUID();
  const payload = { id: userId, jti };
  const token = jwt.sign(payload, config.REFRESH_TOKEN_SECRET, {
    expiresIn: "7d",
  });
  return { token, jti };
};
export const verifyAccessToken = (token: string): { id: string; email: string } => {
  try {
    const decoded = jwt.verify(
      token,
      config.ACCESS_TOKEN_SECRET,
    ) as { id: string; email: string };
    return decoded;
  } catch (error) {
    throw new Error("Invalid access token");
  }
};

export const verifyRefreshToken = (token: string): { id: string; jti: string } => {
  try {
    const decoded = jwt.verify(
      token,
      config.REFRESH_TOKEN_SECRET,
    ) as { id: string; jti: string };
    return decoded;
  } catch (error) {
    throw new Error("Invalid refresh token");
  }
};
