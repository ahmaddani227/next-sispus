"use server";

import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { loginSchema, LoginInput } from "../schemas/login.schema";
import { verifyPassword } from "@/lib/auth/password";
import { generateAccessToken, generateRefreshToken } from "@/lib/auth/token";
import { createSession, revokeSession } from "@/lib/auth/session";
import { setAuthCookies, clearAuthCookies, getAuthCookies } from "@/lib/auth/cookies";
import { getCurrentUser } from "@/lib/auth/guard";

export type AuthActionResult = {
  success: boolean;
  error?: string;
  user?: {
    id: string;
    username: string;
    fullName: string;
    role: string;
  };
};

/**
 * Server Action for login authentications users
 */
export async function loginAction(input: LoginInput): Promise<AuthActionResult> {
  const parsed = loginSchema.safeParse(input);
  if (!parsed.success) {
    return {
      success: false,
      error: parsed.error.issues[0]?.message || "Data input tidak valid.",
    };
  }

  const { username, password, rememberMe } = parsed.data;

  // 1. Search user by username
  const user = await prisma.user.findUnique({
    where: { username },
  });

  if (!user) {
    return {
      success: false,
      error: "Username atau kata sandi tidak sesuai.",
    };
  }

  // 2. Check status user
  if (user.status !== "ACTIVE") {
    return {
      success: false,
      error: "Akun Anda dinonaktifkan. Silakan hubungi Administrator.",
    };
  }

  // 3. Verify password with bcrypt
  const isPasswordValid = await verifyPassword(password, user.passwordHash);
  if (!isPasswordValid) {
    return {
      success: false,
      error: "Username atau kata sandi tidak sesuai.",
    };
  }

  // 4. Generate token and session
  const accessToken = generateAccessToken({
    userId: user.id,
    username: user.username,
    fullName: user.fullName,
    role: user.role,
  });

  const refreshToken = generateRefreshToken();

  // 5. Save session in database
  await createSession(user.id, refreshToken, rememberMe);

  // 6. Save cookie session
  await setAuthCookies(accessToken, refreshToken, rememberMe);

  return {
    success: true,
    user: {
      id: user.id,
      username: user.username,
      fullName: user.fullName,
      role: user.role,
    },
  };
}

/**
 * Server Action for logout user
 */
export async function logoutAction(): Promise<void> {
  const { refreshToken } = await getAuthCookies();

  if (refreshToken) {
    await revokeSession(refreshToken);
  }

  await clearAuthCookies();
  redirect("/login");
}

export async function getCurrentUserAction() {
  return getCurrentUser();
}

