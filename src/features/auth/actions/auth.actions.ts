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

// Server Action untuk autentikasi login pengguna
export async function loginAction(input: LoginInput): Promise<AuthActionResult> {
  try {
    const parsed = loginSchema.safeParse(input);
    if (!parsed.success) {
      return {
        success: false,
        error: parsed.error.issues[0]?.message || "Data input tidak valid.",
      };
    }

    const { username, password, rememberMe } = parsed.data;
    const cleanUsername = username.toLowerCase().trim();

    const user = await prisma.user.findUnique({
      where: { username: cleanUsername },
      select: {
        id: true,
        username: true,
        fullName: true,
        role: true,
        status: true,
        passwordHash: true,
      },
    });

    if (!user) {
      return {
        success: false,
        error: "Username atau kata sandi tidak sesuai.",
      };
    }

    // Periksa status keaktifan user
    if (user.status !== "ACTIVE") {
      return {
        success: false,
        error: "Akun Anda dinonaktifkan. Silakan hubungi Administrator.",
      };
    }

    // Verifikasi kata sandi dengan bcrypt
    const isPasswordValid = await verifyPassword(password, user.passwordHash);
    if (!isPasswordValid) {
      return {
        success: false,
        error: "Username atau kata sandi tidak sesuai.",
      };
    }

    // Generate token dan session
    const accessToken = generateAccessToken({
      userId: user.id,
      username: user.username,
      fullName: user.fullName,
      role: user.role,
    });

    const refreshToken = generateRefreshToken();

    // Simpan session baru di database (Postgres)
    await createSession(user.id, refreshToken, rememberMe);

    // Simpan cookie session di browser client
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
  } catch (error: any) {
    return {
      success: false,
      error: error?.message || "Terjadi kesalahan saat memproses login ke sistem.",
    };
  }
}

// Server Action untuk logout pengguna.
export async function logoutAction(): Promise<void> {
  try {
    const { refreshToken } = await getAuthCookies();

    if (refreshToken) {
      await revokeSession(refreshToken);
    }
  } catch (error) {
    console.error("Gagal mencabut sesi di database saat logout:", error);
  } finally {
    await clearAuthCookies();
    redirect("/login");
  }
}

export async function getCurrentUserAction() {
  return getCurrentUser();
}
