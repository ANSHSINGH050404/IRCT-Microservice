import crypto from "crypto";

export const generateDeviceFingerprint = (req: any) => {
  const userAgent = req.headers["user-agent"] || "";
  const ipAddress = req.ip || req.connection.remoteAddress || "";
  const accept = req.headers["accept"] || "";
  const raw = `${userAgent}|${ipAddress}|${accept}`;

  return crypto.createHash("sha256").update(raw).digest("hex");
};
