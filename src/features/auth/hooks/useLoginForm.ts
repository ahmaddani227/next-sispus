"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { AUTH_CONFIG } from "../constants/auth.constants";
import { loginSchema, LoginInput } from "../schemas/login.schema";

export function useLoginForm() {
  const router = useRouter();
  const [showPassword, setShowPassword] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  const form = useForm<LoginInput>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      username: "",
      password: "",
      rememberMe: false,
    },
  });

  const togglePasswordVisibility = () => {
    setShowPassword((prev) => !prev);
  };

  const onSubmit = async () => {
    setErrorMessage("");

    try {
      // Simulasi delay autentikasi kredensial pengguna
      await new Promise((resolve) => setTimeout(resolve, 800));
      router.push(AUTH_CONFIG.dashboardUrl);
    } catch {
      setErrorMessage("Gagal memproses autentikasi. Silakan periksa kembali data Anda.");
    }
  };

  return {
    form,
    showPassword,
    togglePasswordVisibility,
    errorMessage,
    onSubmit: form.handleSubmit(onSubmit),
    isSubmitting: form.formState.isSubmitting,
    errors: form.formState.errors,
  };
}
