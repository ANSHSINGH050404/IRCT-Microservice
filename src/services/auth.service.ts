
import { prisma } from "../../db";
import bcrypt from "bcrypt";
import { sendEmail } from "../utils/sendEmail";
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
    const {otp, optSessionId} = await generateOtpAndStore(meta);
    await sendEmail(email, otp);

    return { optSessionId };
}

