import { isIP } from "node:net";
import { rateLimit, ipKeyGenerator } from "express-rate-limit";

// Render routes public traffic through Cloudflare.
// Prefer its validated visitor-IP header; fall back to Express/socket IP locally.
const getClientKey = (req) => {
  const cloudflareIp = String(
    req.get("cf-connecting-ip") || ""
  ).trim();

  const fallbackIp = req.ip || req.socket?.remoteAddress || "";
  const clientIp = isIP(cloudflareIp) ? cloudflareIp : fallbackIp;

  return isIP(clientIp)
    ? ipKeyGenerator(clientIp, 56)
    : "unknown";
};

const createAuthLimiter = (
  windowMs,
  limit,
  message,
  options = {}
) =>
  rateLimit({
    windowMs,
    limit,
    standardHeaders: "draft-8",
    legacyHeaders: false,
    keyGenerator: getClientKey,
    ...options,
    handler: (_req, res) =>
      res.status(429).json({
        success: false,
        message,
      }),
  });

export const loginLimiter = createAuthLimiter(
  15 * 60 * 1000,
  10,
  "Too many login attempts. Please try again after 15 minutes.",
  { skipSuccessfulRequests: true }
);

export const registrationLimiter = createAuthLimiter(
  60 * 60 * 1000,
  5,
  "Too many registration attempts. Please try again after one hour."
);

export const forgotPasswordLimiter = createAuthLimiter(
  15 * 60 * 1000,
  5,
  "Too many password reset requests. Please try again later."
);

export const resetPasswordLimiter = createAuthLimiter(
  15 * 60 * 1000,
  10,
  "Too many password reset attempts. Please try again later."
);
