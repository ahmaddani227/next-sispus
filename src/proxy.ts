import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { verifyAccessToken } from "@/lib/auth/token";
import { AUTH_COOKIE_NAMES } from "@/lib/auth/cookies";

// Rute yang khusus hanya boleh diakses oleh ADMIN / Kepala Perpustakaan
const ADMIN_ONLY_PREFIXES = ["/dashboard/users"];

export function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;

  const accessToken = request.cookies.get(AUTH_COOKIE_NAMES.ACCESS_TOKEN)?.value;
  const refreshToken = request.cookies.get(AUTH_COOKIE_NAMES.REFRESH_TOKEN)?.value;

  const verifiedPayload = accessToken ? verifyAccessToken(accessToken) : null;
  const isAuth = !!(verifiedPayload || refreshToken);

  // 1. Proteksi route dashboard umum: jika belum login, redirect ke /login
  if (pathname.startsWith("/dashboard")) {
    if (!isAuth) {
      const loginUrl = new URL("/login", request.url);
      loginUrl.searchParams.set("from", pathname);
      return NextResponse.redirect(loginUrl);
    }

    // 2. Otorisasi Role: Batasi akses rute khusus ADMIN dari role PETUGAS
    const isAdminOnlyRoute = ADMIN_ONLY_PREFIXES.some((prefix) =>
      pathname.startsWith(prefix)
    );

    if (isAdminOnlyRoute && verifiedPayload && verifiedPayload.role !== "ADMIN") {
      // Petugas dilarang mengakses Data Anggota / Manajemen Petugas -> redirect ke dashboard
      return NextResponse.redirect(new URL("/dashboard", request.url));
    }
  }

  // 3. Proteksi route login: jika sudah login, redirect langsung ke /dashboard
  if (pathname === "/login") {
    if (isAuth) {
      return NextResponse.redirect(new URL("/dashboard", request.url));
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/dashboard/:path*", "/login"],
};
