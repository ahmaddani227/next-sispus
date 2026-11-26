import { z } from "zod";

export const studentStatusEnum = z.enum(["ACTIVE", "INACTIVE"]);

export const createStudentSchema = z.object({
  nis: z
    .string()
    .trim()
    .min(1, "NIS wajib diisi")
    .max(50, "NIS maksimal 50 karakter")
    .regex(/^[A-Za-z0-9\-_.]+$/, "NIS hanya boleh berisi huruf, angka, atau tanda hubung"),
  fullName: z
    .string()
    .trim()
    .min(2, "Nama lengkap minimal 2 karakter")
    .max(150, "Nama lengkap maksimal 150 karakter"),
  classId: z
    .string()
    .uuid("Pilih kelas yang valid")
    .nullable()
    .optional()
    .or(z.literal("").transform(() => null)),
  status: studentStatusEnum.default("ACTIVE"),
});

export const updateStudentSchema = createStudentSchema.partial().extend({
  id: z.string().uuid("ID siswa tidak valid"),
});

export const studentFilterSchema = z.object({
  search: z.string().trim().optional(),
  classId: z.string().trim().optional(),
  status: z.enum(["all", "ACTIVE", "INACTIVE"]).default("all"),
  loanStatus: z
    .enum(["all", "BORROWING", "FREE", "BLOCKED"])
    .default("all"),
  page: z.coerce.number().int().min(1).default(1),
  pageSize: z.coerce.number().int().min(1).max(100).default(10),
});

export const studentImportRowSchema = z.object({
  nis: z
    .string()
    .trim()
    .min(1, "NIS wajib diisi")
    .max(50, "NIS maksimal 50 karakter"),
  fullName: z
    .string()
    .trim()
    .min(2, "Nama lengkap wajib diisi")
    .max(150, "Nama lengkap maksimal 150 karakter"),
  className: z.string().trim().optional().default(""),
  status: studentStatusEnum.default("ACTIVE"),
});

export type StudentStatusType = z.infer<typeof studentStatusEnum>;
export type CreateStudentInput = z.infer<typeof createStudentSchema>;
export type UpdateStudentInput = z.infer<typeof updateStudentSchema>;
export type StudentFilterInput = z.infer<typeof studentFilterSchema>;
export type StudentImportRowInput = z.infer<typeof studentImportRowSchema>;