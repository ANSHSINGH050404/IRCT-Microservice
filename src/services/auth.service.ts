
import { prisma } from "../../db";
import bcrypt from "bcrypt";
import { sendEmail, verifyOtp } from "../utils/sendEmail";
import { generateOtpAndStore } from "../utils/generateOtpAndStore";
import { generateAccessToken, generateRefreshToken } from "../utils/auth";
import { BadRequestError } from "../utils/error";
import RedisClient from "../config/redis";
import { config } from "../config";

const redis = RedisClient.getInstance();

export const sendOtp = async(firstName: string, lastName: string, email: string, password: string) => {

    const existingUser = await prisma.user.findUnique({ where: { email } });
    if (existingUser) {
        throw new Error("User already exists");
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const meta = {
      firstName,
      lastName,
      email,
    hashedPassword,
    };
    const {otp, otpSessionId} = await generateOtpAndStore(meta);
    await sendEmail(email, otp);

    return { otpSessionId };
}


export const verifyOTP = async (otp: string, otpSessionId: string) => {
  const { message, meta } = await verifyOtp(otp, otpSessionId);

  const user = await prisma.user.create({
    data: {
      firstName: meta.firstName,
      lastName: meta.lastName,
      email: meta.email,
      password: meta.hashedPassword,
      emailVerified: true,
    },
  });

  const { password: _, ...loggedUser } = user;

  return { message, user: loggedUser };
}

export const login = async (email: string, password: string, deviceId: string) => {
  const user = await prisma.user.findUnique({ where: { email } });
  if (!user || !user.password) {
    throw new BadRequestError("Invalid email or password");
  }

  const isPasswordValid = await bcrypt.compare(password, user.password);
  if (!isPasswordValid) {
    throw new BadRequestError("Invalid email or password");
  }

  const accessToken = generateAccessToken(user.id);
  const { token: refreshToken, jti } = generateRefreshToken(user.id);

  await redis.set(`refresh_token:${jti}`, user.id, "EX", config.REFRESH_TOKEN_EXPIRY_TIME);

  const { password: _, ...loggedUser } = user;

  return { accessToken, refreshToken, loggedUser };
}