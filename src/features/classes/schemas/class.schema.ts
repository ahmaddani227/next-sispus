import { z } from "zod";

export const createClassSchema = z.object({
  name: z
    .string()
    .trim()
    .min(1, "Nama kelas wajib diisi")
    .max(100, "Nama kelas maksimal 100 karakter"),
  academicYear: z
    .string()
    .trim()
    .min(4, "Tahun ajaran wajib diisi (contoh: 2026/2027)")
    .max(20, "Tahun ajaran maksimal 20 karakter")
    .regex(
      /^\d{4}\/\d{4}$/,
      "Format tahun ajaran harus YYYY/YYYY (contoh: 2026/2027)"
    ),
  isActive: z.boolean().default(true),
});

export const updateClassSchema = createClassSchema.partial().extend({
  id: z.string().uuid("ID kelas tidak valid"),
});

export const classFilterSchema = z.object({
  search: z.string().trim().optional(),
  academicYear: z.string().trim().optional(),
  isActive: z.enum(["all", "active", "inactive"]).default("all"),
});

export type CreateClassInput = z.infer<typeof createClassSchema>;
export type UpdateClassInput = z.infer<typeof updateClassSchema>;
export type ClassFilterInput = z.infer<typeof classFilterSchema>;