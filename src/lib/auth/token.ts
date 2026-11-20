import crypto from "crypto";
import jwt from "jsonwebtoken";
import type { UserRole } from "@prisma-client";

const JWT_SECRET = process.env.JWT_SECRET || "fallback-secret-key-change-in-production";

export interface TokenPayload {
  userId: string;
  username: string;
  fullName: string;
  role: UserRole;
}

const ACCESS_TOKEN_EXPIRY = "15m";

export function generateAccessToken(payload: TokenPayload): string {
  return jwt.sign(payload, JWT_SECRET, {
    expiresIn: ACCESS_TOKEN_EXPIRY,
  });
}

export function verifyAccessToken(token: string): TokenPayload | null {
  try {
    const decoded = jwt.verify(token, JWT_SECRET) as TokenPayload & jwt.JwtPayload;
    return {
      userId: decoded.userId,
      username: decoded.username,
      fullName: decoded.fullName,
      role: decoded.role,
    };
  } catch {
    return null;
  }
}


export function generateRefreshToken(): string {
  return crypto.randomBytes(40).toString("hex");
}

export function hashToken(token: string): string {
  return crypto.createHash("sha256").update(token).digest("hex");
}
