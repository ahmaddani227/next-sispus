"use server";

import { revalidatePath } from "next/cache";
import { prisma } from "@/lib/prisma";
import { requireRole } from "@/lib/auth/guard";
import { hashPassword } from "@/lib/auth/password";
import { revokeAllUserSessions } from "@/lib/auth/session";
import {
  createPenggunaSchema,
  updatePenggunaSchema,
  toggleStatusPenggunaSchema,
  deletePenggunaSchema,
  CreatePenggunaInput,
  UpdatePenggunaInput,
} from "../schemas/pengguna.schema";
import type { Pengguna } from "../types/pengguna.types";
import { extractInitials, getAvatarColor } from "../_utils/userAvatar";

export type ActionResponse<T = unknown> = {
  success: boolean;
  message?: string;
  error?: string;
  data?: T;
};

export async function getPenggunaListAction(): Promise<ActionResponse<Pengguna[]>> {
  try {
    const currentAdmin = await requireRole(["ADMIN"]);

    const users = await prisma.user.findMany({
      select: {
        id: true,
        fullName: true,
        username: true,
        role: true,
        status: true,
        createdAt: true,
      },
      orderBy: {
        createdAt: "desc",
      },
    });

    const mappedUsers: Pengguna[] = users.map((user) => ({
      id: user.id,
      nama: user.fullName,
      username: user.username,
      role: user.role,
      status: user.status === "ACTIVE" ? "Aktif" : "Nonaktif",
      createdAt: user.createdAt.toISOString(),
      avatarInitials: extractInitials(user.fullName),
      avatarColor: getAvatarColor(user.role, user.id),
      isSelf: user.id === currentAdmin.userId,
    }));

    return {
      success: true,
      data: mappedUsers,
    };
  } catch (error: any) {
    return {
      success: false,
      error: error?.message || "Gagal memuat data pengguna.",
      data: [],
    };
  }
}


export async function createPenggunaAction(
  input: CreatePenggunaInput
): Promise<ActionResponse<{ id: string }>> {
  try {
    await requireRole(["ADMIN"]);

    const parsed = createPenggunaSchema.safeParse(input);
    if (!parsed.success) {
      return {
        success: false,
        error: parsed.error.issues[0]?.message || "Data input tidak valid.",
      };
    }

    const { nama, username, password, role } = parsed.data;
    const cleanUsername = username.toLowerCase().trim();

    // Index-only scan: hanya select { id: true }
    const existing = await prisma.user.findUnique({
      where: { username: cleanUsername },
      select: { id: true },
    });

    if (existing) {
      return {
        success: false,
        error: `Username "@${cleanUsername}" sudah digunakan oleh akun lain. Silakan gunakan username yang berbeda.`,
      };
    }

    // Hash kata sandi di luar transaction database
    const passwordHash = await hashPassword(password);

    // Simpan ke database
    const newUser = await prisma.user.create({
      data: {
        fullName: nama.trim(),
        username: cleanUsername,
        passwordHash,
        role,
        status: "ACTIVE",
      },
      select: {
        id: true,
      },
    });

    revalidatePath("/dashboard/users");

    return {
      success: true,
      message: `Akun "${nama}" (@${cleanUsername}) berhasil didaftarkan ke sistem SIPUS.`,
      data: { id: newUser.id },
    };
  } catch (error: any) {
    return {
      success: false,
      error: error?.message || "Terjadi kesalahan saat menambahkan akun pengguna.",
    };
  }
}

export async function updatePenggunaAction(
  input: UpdatePenggunaInput
): Promise<ActionResponse> {
  try {
    await requireRole(["ADMIN"]);

    const parsed = updatePenggunaSchema.safeParse(input);
    if (!parsed.success) {
      return {
        success: false,
        error: parsed.error.issues[0]?.message || "Data input tidak valid.",
      };
    }

    const { id, nama, username, password, role } = parsed.data;
    const cleanUsername = username.toLowerCase().trim();

    // Cek eksistensi user (hanya select atribut yang dibutuhkan)
    const user = await prisma.user.findUnique({
      where: { id },
      select: { id: true, username: true, fullName: true },
    });

    if (!user) {
      return {
        success: false,
        error: "Pengguna tidak ditemukan dalam sistem.",
      };
    }

    // Jika username berubah, periksa duplikasi via Index-Only Scan
    if (user.username !== cleanUsername) {
      const usernameConflict = await prisma.user.findUnique({
        where: { username: cleanUsername },
        select: { id: true },
      });

      if (usernameConflict) {
        return {
          success: false,
          error: `Username "@${cleanUsername}" sudah dipakai oleh akun lain.`,
        };
      }
    }

    // Hash password baru di luar transaksi untuk menjaga lock duration seringkas mungkin
    let newPasswordHash: string | undefined = undefined;
    if (password && password.trim().length > 0) {
      newPasswordHash = await hashPassword(password);
    }

    // Eksekusi atomic transaction
    await prisma.$transaction(async (tx) => {
      await tx.user.update({
        where: { id },
        data: {
          fullName: nama.trim(),
          username: cleanUsername,
          role,
          ...(newPasswordHash ? { passwordHash: newPasswordHash } : {}),
        },
      });

      // Jika password diubah, batalkan seluruh sesi aktif pengguna di perangkat lain secara atomik
      if (newPasswordHash) {
        await revokeAllUserSessions(id, tx);
      }
    });

    revalidatePath("/dashboard/users");

    return {
      success: true,
      message: `Data akun "${nama}" (@${cleanUsername}) berhasil diperbarui.`,
    };
  } catch (error: any) {
    return {
      success: false,
      error: error?.message || "Terjadi kesalahan saat memperbarui akun pengguna.",
    };
  }
}

export async function toggleStatusPenggunaAction(
  id: string
): Promise<ActionResponse<{ newStatus: "Aktif" | "Nonaktif" }>> {
  try {
    const currentAdmin = await requireRole(["ADMIN"]);

    const parsed = toggleStatusPenggunaSchema.safeParse({ id });
    if (!parsed.success) {
      return {
        success: false,
        error: "ID pengguna tidak valid.",
      };
    }

    // Cegah admin menonaktifkan akunnya sendiri
    if (id === currentAdmin.userId) {
      return {
        success: false,
        error: "Anda tidak dapat menonaktifkan akun Anda sendiri yang sedang aktif digunakan.",
      };
    }

    const user = await prisma.user.findUnique({
      where: { id },
      select: { id: true, fullName: true, status: true },
    });

    if (!user) {
      return {
        success: false,
        error: "Pengguna tidak ditemukan.",
      };
    }

    const nextStatus = user.status === "ACTIVE" ? "INACTIVE" : "ACTIVE";

    // Atomic transaction: update status + revoke active sessions jika nonaktif
    await prisma.$transaction(async (tx) => {
      await tx.user.update({
        where: { id },
        data: {
          status: nextStatus,
        },
      });

      if (nextStatus === "INACTIVE") {
        await revokeAllUserSessions(id, tx);
      }
    });

    revalidatePath("/dashboard/users");

    const statusLabel = nextStatus === "ACTIVE" ? "Aktif" : "Nonaktif";

    return {
      success: true,
      message: `Status akun "${user.fullName}" berhasil diubah menjadi ${statusLabel}.`,
      data: { newStatus: statusLabel },
    };
  } catch (error: any) {
    return {
      success: false,
      error: error?.message || "Terjadi kesalahan saat mengubah status akun pengguna.",
    };
  }
}

export async function deletePenggunaAction(id: string): Promise<ActionResponse> {
  try {
    const currentAdmin = await requireRole(["ADMIN"]);

    const parsed = deletePenggunaSchema.safeParse({ id });
    if (!parsed.success) {
      return {
        success: false,
        error: "ID pengguna tidak valid.",
      };
    }

    // Cegah admin menghapus akunnya sendiri
    if (id === currentAdmin.userId) {
      return {
        success: false,
        error: "Anda tidak dapat menghapus akun Anda sendiri.",
      };
    }

    // Cek apakah akun memiliki relasi sirkulasi dengan hanya men-select atribut yang diperlukan
    const userWithRelations = await prisma.user.findUnique({
      where: { id },
      select: {
        id: true,
        fullName: true,
        username: true,
        _count: {
          select: {
            processedLoans: true,
            extendedLoans: true,
            verifiedObligations: true,
          },
        },
      },
    });

    if (!userWithRelations) {
      return {
        success: false,
        error: "Pengguna tidak ditemukan.",
      };
    }

    const totalTransactions =
      userWithRelations._count.processedLoans +
      userWithRelations._count.extendedLoans +
      userWithRelations._count.verifiedObligations;

    if (totalTransactions > 0) {
      return {
        success: false,
        error: `Akun "${userWithRelations.fullName}" tidak dapat dihapus karena tercatat memproses ${totalTransactions} transaksi/aktivitas sirkulasi perpustakaan. Silakan nonaktifkan akun ini agar riwayat data tetap terjaga.`,
      };
    }

    // Hapus akun pengguna (sesi akan terhapus via cascade di foreign key)
    try {
      await prisma.user.delete({
        where: { id },
      });
    } catch (dbErr: any) {
      // Prisma P2003 = Foreign key constraint failed on PostgreSQL
      if (dbErr.code === "P2003") {
        return {
          success: false,
          error: "Gagal menghapus: Akun ini masih memiliki referensi transaksi aktif di database.",
        };
      }
      throw dbErr;
    }

    revalidatePath("/dashboard/users");

    return {
      success: true,
      message: `Akun "${userWithRelations.fullName}" (@${userWithRelations.username}) berhasil dihapus dari sistem.`,
    };
  } catch (error: any) {
    return {
      success: false,
      error: error?.message || "Terjadi kesalahan saat menghapus akun pengguna.",
    };
  }
}
