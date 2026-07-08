
import { prisma } from "../../db";
import bcrypt from "bcrypt";
import { sendEmail, verifyOtp } from "../utils/sendEmail";
import { generateOtpAndStore } from "../utils/generateOtpAndStore";

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

