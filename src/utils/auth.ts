import crypto from "node:crypto";
import jwt from "jsonwebtoken";

export const generateAccessToken = (userId: string): string => {
  const payload = { id: userId };

  return jwt.sign(payload, process.env.ACCESS_TOKEN_SECRET as string, {
    expiresIn: "15m",
  });
};

export const generateRefreshToken = (userId: string): { token: string; jti: string } => {
  const jti = crypto.randomUUID();
  const payload = { id: userId, jti };
  const token = jwt.sign(payload, process.env.REFRESH_TOKEN_SECRET as string, {
    expiresIn: "7d",
  });
  return { token, jti };
};
export const verifyAccessToken = (token: string): { id: string } => {
  try {
    const decoded = jwt.verify(
      token,
      process.env.ACCESS_TOKEN_SECRET as string,
    ) as { id: string };
    return decoded;
  } catch (error) {
    throw new Error("Invalid access token");
  }
};

export const verifyRefreshToken = (token: string): { id: string } => {
  try {
    const decoded = jwt.verify(
      token,
      process.env.REFRESH_TOKEN_SECRET as string,
    ) as { id: string };
    return decoded;
  } catch (error) {
    throw new Error("Invalid refresh token");
  }
};
