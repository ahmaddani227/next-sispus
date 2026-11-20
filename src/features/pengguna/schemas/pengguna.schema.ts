import { z } from "zod";

export const createPenggunaSchema = z.object({
  nama: z
    .string()
    .min(3, "Nama lengkap minimal 3 karakter.")
    .max(150, "Nama lengkap maksimal 150 karakter."),
  username: z
    .string()
    .min(3, "Username minimal 3 karakter.")
    .max(100, "Username maksimal 100 karakter.")
    .regex(
      /^[a-zA-Z0-9._]+$/,
      "Username hanya boleh berisi huruf, angka, titik (.), atau garis bawah (_)."
    ),
  password: z
    .string()
    .min(6, "Kata sandi minimal 6 karakter.")
    .max(100, "Kata sandi maksimal 100 karakter."),
  role: z.enum(["ADMIN", "PETUGAS"], {
    message: "Role harus berupa ADMIN atau PETUGAS.",
  }),
});

export const updatePenggunaSchema = z.object({
  id: z.string().uuid("ID pengguna tidak valid."),
  nama: z
    .string()
    .min(3, "Nama lengkap minimal 3 karakter.")
    .max(150, "Nama lengkap maksimal 150 karakter."),
  username: z
    .string()
    .min(3, "Username minimal 3 karakter.")
    .max(100, "Username maksimal 100 karakter.")
    .regex(
      /^[a-zA-Z0-9._]+$/,
      "Username hanya boleh berisi huruf, angka, titik (.), atau garis bawah (_)."
    ),
  password: z
    .string()
    .min(6, "Kata sandi baru minimal 6 karakter.")
    .max(100, "Kata sandi maksimal 100 karakter.")
    .optional()
    .or(z.literal("")),
  role: z.enum(["ADMIN", "PETUGAS"], {
    message: "Role harus berupa ADMIN atau PETUGAS.",
  }),
});

export const toggleStatusPenggunaSchema = z.object({
  id: z.string().uuid("ID pengguna tidak valid."),
});

export const deletePenggunaSchema = z.object({
  id: z.string().uuid("ID pengguna tidak valid."),
});

export type CreatePenggunaInput = z.infer<typeof createPenggunaSchema>;
export type UpdatePenggunaInput = z.infer<typeof updatePenggunaSchema>;
