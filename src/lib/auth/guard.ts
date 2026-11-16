import { redirect } from "next/navigation";
import type { UserRole } from "@prisma-client";
import { getAuthCookies, setAuthCookies } from "./cookies";
import { generateAccessToken, verifyAccessToken, TokenPayload } from "./token";
import { validateSession } from "./session";

/**
 * Get user info logged in
 */
export async function getCurrentUser(): Promise<TokenPayload | null> {
  const { accessToken, refreshToken } = await getAuthCookies();

  // 1. Cek access token jika masih valid
  if (accessToken) {
    const payload = verifyAccessToken(accessToken);
    if (payload) {
      return payload;
    }
  }

  // 2. Jika access token tidak ada/kadaluarsa, coba refresh via refresh token
  if (refreshToken) {
    const session = await validateSession(refreshToken);
    if (session) {
      const newPayload: TokenPayload = {
        userId: session.user.id,
        username: session.user.username,
        fullName: session.user.fullName,
        role: session.user.role,
      };

      const newAccessToken = generateAccessToken(newPayload);
      // Perbarui cookie access token
      await setAuthCookies(newAccessToken, refreshToken);

      return newPayload;
    }
  }

  return null;
}

export async function requireAuth(): Promise<TokenPayload> {
  const user = await getCurrentUser();
  if (!user) {
    redirect("/login");
  }
  return user;
}

export async function requireRole(allowedRoles: UserRole[]): Promise<TokenPayload> {
  const user = await requireAuth();

  if (!allowedRoles.includes(user.role)) {
    redirect("/dashboard");
  }

  return user;
}
