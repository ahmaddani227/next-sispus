import { prisma } from "@/lib/prisma";
import { hashToken } from "./token";

/**
 * Buat session baru di database
 */
export async function createSession(
  userId: string,
  refreshToken: string,
  rememberMe: boolean = false
) {
  const durationDays = rememberMe ? 30 : 7;
  const expiresAt = new Date(Date.now() + durationDays * 24 * 60 * 60 * 1000);
  const refreshTokenHash = hashToken(refreshToken);

  return prisma.userSession.create({
    data: {
      userId,
      refreshTokenHash,
      expiresAt,
    },
  });
}

/**
 * Validasi session berdasarkan refresh token
 */
export async function validateSession(refreshToken: string) {
  const refreshTokenHash = hashToken(refreshToken);

  const session = await prisma.userSession.findUnique({
    where: {
      refreshTokenHash,
    },
    include: {
      user: {
        select: {
          id: true,
          username: true,
          fullName: true,
          role: true,
          status: true,
        },
      },
    },
  });

  if (
    !session ||
    session.revokedAt !== null ||
    session.expiresAt <= new Date() ||
    session.user.status !== "ACTIVE"
  ) {
    return null;
  }

  return session;
}

/**
 * Cabut (revoke) session tertentu (logout perangkat saat ini)
 */
export async function revokeSession(refreshToken: string) {
  const refreshTokenHash = hashToken(refreshToken);

  return prisma.userSession.updateMany({
    where: {
      refreshTokenHash,
      revokedAt: null,
    },
    data: {
      revokedAt: new Date(),
    },
  });
}

/**
 * Cabut semua session aktif milik user (logout dari semua perangkat)
 */
export async function revokeAllUserSessions(userId: string) {
  return prisma.userSession.updateMany({
    where: {
      userId,
      revokedAt: null,
    },
    data: {
      revokedAt: new Date(),
    },
  });
}

