import { Router } from "express";
import { sendOtp } from "../controllers/auth.controller";

const router = Router();

router.post("/send-otp", sendOtp);

export default router;
