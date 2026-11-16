"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";
import { AUTH_CONFIG } from "../constants/auth.constants";
import { loginSchema, LoginInput } from "../schemas/login.schema";
import { loginAction } from "../actions/auth.actions";

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

  const onSubmit = async (values: LoginInput) => {
    setErrorMessage("");

    try {
      const result = await loginAction(values);

      if (!result.success) {
        setErrorMessage(result.error || "Gagal masuk ke sistem.");
        return;
      }

      toast.success(`Selamat datang kembali, ${result.user?.fullName}!`);
      router.push(AUTH_CONFIG.dashboardUrl);
      router.refresh();
    } catch {
      setErrorMessage("Terjadi kesalahan sistem saat memproses login. Silakan coba lagi.");
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
