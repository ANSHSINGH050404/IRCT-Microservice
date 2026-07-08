
import { prisma } from "../../db";
import bcrypt from "bcrypt";
import { sendEmail, verifyOtp } from "../utils/sendEmail";
import { generateOtpAndStore } from "../utils/generateOtpAndStore";
import { generateAccessToken, generateRefreshToken } from "../utils/auth";
import { BadRequestError } from "../utils/error";

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


export const verifyOTP = async(otp: string, otpSessionId: string) => {
     return await verifyOtp(otp, otpSessionId);
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
  const refreshToken = generateRefreshToken(user.id);

  const { password: _, ...loggedUser } = user;

  return { accessToken, refreshToken, loggedUser };
}