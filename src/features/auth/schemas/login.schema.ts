import { z } from "zod";

export const loginSchema = z.object({
  username: z
    .string()
    .trim()
    .min(1, { message: "Username atau NIP wajib diisi." }),
  password: z
    .string()
    .min(1, { message: "Kata sandi wajib diisi." })
    .min(6, { message: "Kata sandi minimal 6 karakter." }),
  rememberMe: z.boolean(),
});

export type LoginInput = z.infer<typeof loginSchema>;
