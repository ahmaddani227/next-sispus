"use server";

import { revalidatePath } from "next/cache";
import { prisma } from "@/lib/prisma";
import { requireRole } from "@/lib/auth/guard";
import {
  systemSettingsSchema,
  SystemSettingsInput,
} from "../schemas/settings.schema";
import type {
  SystemSettingsValues,
  SystemSettingRecord,
} from "../types/settings.types";
import { DEFAULT_SETTINGS } from "../constants/settings.constants";

export type ActionResponse<T = unknown> = {
  success: boolean;
  message?: string;
  error?: string;
  data?: T;
};

export type SystemSettingsResult = {
  values: SystemSettingsValues;
  records: SystemSettingRecord[];
  lastUpdated: string | null;
};

async function batchUpsertSettings(
  items: Array<{ settingKey: string; value: string; description: string }>
) {
  return prisma.$transaction(
    items.map((item) =>
      prisma.systemSetting.upsert({
        where: { settingKey: item.settingKey },
        update: {
          value: item.value,
          description: item.description,
        },
        create: {
          settingKey: item.settingKey,
          value: item.value,
          description: item.description,
        },
      })
    )
  );
}

export async function getSystemSettingsAction(): Promise<
  ActionResponse<SystemSettingsResult>
> {
  try {
    await requireRole(["ADMIN"]);

    // Supabase Postgres Best Practice:
    // 1. SELECT hanya kolom yang dibutuhkan (explicit projection)
    // 2. Explicit deterministic ORDER BY untuk mencegah pergeseran baris (heap order) pada tabel saat diupdate
    const records = await prisma.systemSetting.findMany({
      select: {
        id: true,
        settingKey: true,
        value: true,
        description: true,
        createdAt: true,
        updatedAt: true,
      },
      orderBy: {
        settingKey: "asc",
      },
    });

    const map = new Map<string, string>();
    let latestUpdatedAt: Date | null = null;

    for (const record of records) {
      map.set(record.settingKey, record.value);
      if (!latestUpdatedAt || record.updatedAt > latestUpdatedAt) {
        latestUpdatedAt = record.updatedAt;
      }
    }

    const parseSettingInt = (
      key: keyof SystemSettingsValues,
      fallback: number
    ): number => {
      const raw = map.get(key);
      if (!raw) return fallback;
      const parsed = parseInt(raw, 10);
      return Number.isFinite(parsed) ? parsed : fallback;
    };

    const values: SystemSettingsValues = {
      MAX_ACTIVE_LOANS: parseSettingInt(
        "MAX_ACTIVE_LOANS",
        DEFAULT_SETTINGS.MAX_ACTIVE_LOANS
      ),
      DEFAULT_LOAN_DAYS: parseSettingInt(
        "DEFAULT_LOAN_DAYS",
        DEFAULT_SETTINGS.DEFAULT_LOAN_DAYS
      ),
      MAX_LOAN_EXTENSIONS: parseSettingInt(
        "MAX_LOAN_EXTENSIONS",
        DEFAULT_SETTINGS.MAX_LOAN_EXTENSIONS
      ),
      DEFAULT_EXTENSION_DAYS: parseSettingInt(
        "DEFAULT_EXTENSION_DAYS",
        DEFAULT_SETTINGS.DEFAULT_EXTENSION_DAYS
      ),
    };

    const formattedRecords: SystemSettingRecord[] = records.map((r) => ({
      id: r.id,
      settingKey: r.settingKey,
      value: r.value,
      description: r.description,
      createdAt: r.createdAt.toISOString(),
      updatedAt: r.updatedAt.toISOString(),
    }));

    return {
      success: true,
      data: {
        values,
        records: formattedRecords,
        lastUpdated: latestUpdatedAt ? latestUpdatedAt.toISOString() : null,
      },
    };
  } catch (error: any) {
    return {
      success: false,
      error: error?.message || "Gagal memuat konfigurasi sistem.",
      data: {
        values: DEFAULT_SETTINGS,
        records: [],
        lastUpdated: null,
      },
    };
  }
}

export async function updateSystemSettingsAction(
  input: SystemSettingsInput
): Promise<ActionResponse<SystemSettingsValues>> {
  try {
    await requireRole(["ADMIN"]);

    const parsed = systemSettingsSchema.safeParse(input);
    if (!parsed.success) {
      return {
        success: false,
        error: parsed.error.issues[0]?.message || "Data konfigurasi tidak valid.",
      };
    }

    const {
      MAX_ACTIVE_LOANS,
      DEFAULT_LOAN_DAYS,
      MAX_LOAN_EXTENSIONS,
      DEFAULT_EXTENSION_DAYS,
    } = parsed.data;

    const updates = [
      {
        settingKey: "MAX_ACTIVE_LOANS",
        value: String(MAX_ACTIVE_LOANS),
        description: "Maksimal jumlah buku aktif yang dapat dipinjam siswa",
      },
      {
        settingKey: "DEFAULT_LOAN_DAYS",
        value: String(DEFAULT_LOAN_DAYS),
        description: "Durasi default peminjaman dalam hari",
      },
      {
        settingKey: "MAX_LOAN_EXTENSIONS",
        value: String(MAX_LOAN_EXTENSIONS),
        description: "Maksimal jumlah perpanjangan per buku",
      },
      {
        settingKey: "DEFAULT_EXTENSION_DAYS",
        value: String(DEFAULT_EXTENSION_DAYS),
        description: "Durasi default perpanjangan dalam hari",
      },
    ];

    // Eksekusi atomik menggunakan batch pipeline $transaction([...])
    await batchUpsertSettings(updates);

    revalidatePath("/dashboard/settings");
    revalidatePath("/dashboard");

    return {
      success: true,
      message: "Aturan konfigurasi sistem perpustakaan berhasil diperbarui.",
      data: parsed.data,
    };
  } catch (error: any) {
    return {
      success: false,
      error: error?.message || "Terjadi kesalahan saat menyimpan konfigurasi sistem.",
    };
  }
}

export async function resetSystemSettingsAction(): Promise<
  ActionResponse<SystemSettingsValues>
> {
  try {
    await requireRole(["ADMIN"]);

    const defaultItems = [
      {
        settingKey: "MAX_ACTIVE_LOANS",
        value: String(DEFAULT_SETTINGS.MAX_ACTIVE_LOANS),
        description: "Maksimal jumlah buku aktif yang dapat dipinjam siswa",
      },
      {
        settingKey: "DEFAULT_LOAN_DAYS",
        value: String(DEFAULT_SETTINGS.DEFAULT_LOAN_DAYS),
        description: "Durasi default peminjaman dalam hari",
      },
      {
        settingKey: "MAX_LOAN_EXTENSIONS",
        value: String(DEFAULT_SETTINGS.MAX_LOAN_EXTENSIONS),
        description: "Maksimal jumlah perpanjangan per buku",
      },
      {
        settingKey: "DEFAULT_EXTENSION_DAYS",
        value: String(DEFAULT_SETTINGS.DEFAULT_EXTENSION_DAYS),
        description: "Durasi default perpanjangan dalam hari",
      },
    ];

    // Eksekusi atomik menggunakan batch pipeline $transaction([...])
    await batchUpsertSettings(defaultItems);

    revalidatePath("/dashboard/settings");
    revalidatePath("/dashboard");

    return {
      success: true,
      message: "Konfigurasi aturan sistem berhasil dikembalikan ke default",
      data: DEFAULT_SETTINGS,
    };
  } catch (error: any) {
    return {
      success: false,
      error: error?.message || "Gagal mengembalikan konfigurasi sistem ke default.",
    };
  }
}
