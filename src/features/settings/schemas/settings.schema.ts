import { z } from "zod";

export const systemSettingsSchema = z.object({
  MAX_ACTIVE_LOANS: z.coerce
    .number({ message: "Maksimal buku harus berupa angka." })
    .int("Harus berupa bilangan bulat.")
    .min(1, "Minimal kuota buku yang dapat dipinjam adalah 1 eksemplar.")
    .max(10, "Maksimal kuota buku yang dapat dipinjam adalah 10 eksemplar."),
  DEFAULT_LOAN_DAYS: z.coerce
    .number({ message: "Durasi pinjam harus berupa angka." })
    .int("Harus berupa bilangan bulat.")
    .min(1, "Minimal durasi peminjaman adalah 1 hari.")
    .max(60, "Maksimal durasi peminjaman adalah 60 hari."),
  MAX_LOAN_EXTENSIONS: z.coerce
    .number({ message: "Maksimal perpanjangan harus berupa angka." })
    .int("Harus berupa bilangan bulat.")
    .min(0, "Minimal 0 kali (0 artinya perpanjangan dinonaktifkan).")
    .max(5, "Maksimal perpanjangan adalah 5 kali."),
  DEFAULT_EXTENSION_DAYS: z.coerce
    .number({ message: "Durasi perpanjangan harus berupa angka." })
    .int("Harus berupa bilangan bulat.")
    .min(1, "Minimal durasi perpanjangan adalah 1 hari.")
    .max(30, "Maksimal durasi perpanjangan adalah 30 hari."),
});

export type SystemSettingsInput = z.infer<typeof systemSettingsSchema>;
