import { z } from "zod";

export const bookFormSchema = z.object({
  title: z
    .string()
    .trim()
    .min(1, "Judul buku tidak boleh kosong")
    .max(500, "Judul buku maksimal 500 karakter"),

  author: z
    .string()
    .trim()
    .max(255, "Nama pengarang maksimal 255 karakter")
    .optional()
    .or(z.literal("")),

  publisher: z
    .string()
    .trim()
    .max(255, "Nama penerbit maksimal 255 karakter")
    .optional()
    .or(z.literal("")),

  edition: z
    .string()
    .trim()
    .max(100, "Keterangan edisi maksimal 100 karakter")
    .optional()
    .or(z.literal("")),

  publicationYear: z
    .number()
    .int("Tahun harus bilangan bulat")
    .min(1000, "Tahun terbit minimal tahun 1000")
    .max(9999, "Tahun terbit maksimal tahun 9999")
    .nullable()
    .optional(),

  shelfId: z
    .string()
    .min(1, "Lokasi rak fisik wajib dipilih"),

  categories: z
    .array(z.string())
    .min(1, "Pilih minimal 1 kategori buku"),
});

export type BookFormSchema = z.infer<typeof bookFormSchema>;
