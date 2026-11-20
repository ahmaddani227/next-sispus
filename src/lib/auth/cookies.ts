import { cookies } from "next/headers";

export const AUTH_COOKIE_NAMES = {
  ACCESS_TOKEN: "simpus_access_token",
  REFRESH_TOKEN: "simpus_refresh_token",
} as const;

const isProduction = process.env.NODE_ENV === "production";

/**
 * Set authentication cookies (HttpOnly, SameSite Lax, Secure in production)
 */
export async function setAuthCookies(
  accessToken: string,
  refreshToken: string,
  rememberMe: boolean = false
) {
  const cookieStore = await cookies();

  // 15 minutes for access token
  const accessMaxAge = 15 * 60;

  // 30 days if Remember Me, or 7 days default for Refresh Token
  const refreshMaxAge = rememberMe
    ? 30 * 24 * 60 * 60
    : 7 * 24 * 60 * 60;

  cookieStore.set(AUTH_COOKIE_NAMES.ACCESS_TOKEN, accessToken, {
    httpOnly: true,
    secure: isProduction,
    sameSite: "lax",
    path: "/",
    maxAge: accessMaxAge,
  });

  cookieStore.set(AUTH_COOKIE_NAMES.REFRESH_TOKEN, refreshToken, {
    httpOnly: true,
    secure: isProduction,
    sameSite: "lax",
    path: "/",
    maxAge: refreshMaxAge,
  });
}

/**
 * Delete authentication cookies 
 */
export async function clearAuthCookies() {
  const cookieStore = await cookies();

  cookieStore.delete(AUTH_COOKIE_NAMES.ACCESS_TOKEN);
  cookieStore.delete(AUTH_COOKIE_NAMES.REFRESH_TOKEN);
}

/**
 * Get token from cookie store
 */
export async function getAuthCookies() {
  const cookieStore = await cookies();

  return {
    accessToken: cookieStore.get(AUTH_COOKIE_NAMES.ACCESS_TOKEN)?.value ?? null,
    refreshToken: cookieStore.get(AUTH_COOKIE_NAMES.REFRESH_TOKEN)?.value ?? null,
  };
}

