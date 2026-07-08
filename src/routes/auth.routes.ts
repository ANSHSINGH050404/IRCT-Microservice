import { Router } from "express";
import { sendOtp, verifyOTP } from "../controllers/auth.controller";

const router = Router();

router.post("/send-otp", sendOtp);
router.post("/verify-otp", verifyOTP);

export default router;
