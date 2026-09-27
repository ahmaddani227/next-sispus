"use client";

import Link from "next/link";
import { Controller } from "react-hook-form";
import {
  User,
  Lock,
  Eye,
  EyeOff,
  ArrowRight,
  BookOpen,
  Loader2,
  AlertCircle,
} from "lucide-react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { AUTH_CONFIG } from "../constants/auth.constants";
import { useLoginForm } from "../hooks/useLoginForm";
import { cn } from "@/lib/utils";

export function LoginForm() {
  const {
    form: { register, control },
    showPassword,
    togglePasswordVisibility,
    errorMessage,
    onSubmit,
    isSubmitting,
    errors,
  } = useLoginForm();

  return (
    <form onSubmit={onSubmit} className="space-y-4.5" noValidate>
      {errorMessage && (
        <div className="flex items-center gap-2 rounded-lg border border-rose-200 bg-rose-50 p-3 text-xs font-medium text-rose-700">
          <AlertCircle className="h-4 w-4 shrink-0 text-rose-600" />
          <span>{errorMessage}</span>
        </div>
      )}

      {/* Field 1: Username / NIP */}
      <div className="space-y-1.5">
        <Label htmlFor="username">Username / NIP Petugas</Label>
        <div className="relative flex items-center">
          <User className="pointer-events-none absolute left-3.5 h-4 w-4 text-slate-400" />
          <Input
            id="username"
            type="text"
            placeholder="Masukkan NIP atau Username Admin"
            className={cn(
              "pl-11",
              errors.username &&
                "border-rose-400 focus-visible:border-rose-500 focus-visible:ring-rose-500/20"
            )}
            disabled={isSubmitting}
            aria-invalid={!!errors.username}
            aria-describedby={errors.username ? "username-error" : undefined}
            {...register("username")}
          />
        </div>
        {errors.username && (
          <p
            id="username-error"
            className="flex items-center gap-1.5 text-xs font-medium text-rose-600"
          >
            <AlertCircle className="h-3.5 w-3.5 shrink-0" />
            <span>{errors.username.message}</span>
          </p>
        )}
      </div>

      {/* Field 2: Kata Sandi */}
      <div className="space-y-1.5">
        <Label htmlFor="password">Kata Sandi</Label>
        <div className="relative flex items-center">
          <Lock className="pointer-events-none absolute left-3.5 h-4 w-4 text-slate-400" />
          <Input
            id="password"
            type={showPassword ? "text" : "password"}
            placeholder="Masukkan kata sandi"
            className={cn(
              "pl-11 pr-11",
              errors.password &&
                "border-rose-400 focus-visible:border-rose-500 focus-visible:ring-rose-500/20"
            )}
            disabled={isSubmitting}
            aria-invalid={!!errors.password}
            aria-describedby={errors.password ? "password-error" : undefined}
            {...register("password")}
          />
          <button
            type="button"
            onClick={togglePasswordVisibility}
            className="absolute right-3 p-1 text-slate-400 transition-colors hover:text-slate-600 focus:outline-none"
            aria-label={
              showPassword ? "Sembunyikan kata sandi" : "Tampilkan kata sandi"
            }
          >
            {showPassword ? (
              <EyeOff className="h-4 w-4" />
            ) : (
              <Eye className="h-4 w-4" />
            )}
          </button>
        </div>
        {errors.password && (
          <p
            id="password-error"
            className="flex items-center gap-1.5 text-xs font-medium text-rose-600"
          >
            <AlertCircle className="h-3.5 w-3.5 shrink-0" />
            <span>{errors.password.message}</span>
          </p>
        )}
      </div>

      {/* Remember Me */}
      <div className="flex items-center gap-2 pt-1 text-xs">
        <Controller
          name="rememberMe"
          control={control}
          render={({ field }) => (
            <Checkbox
              id="rememberMe"
              checked={field.value}
              onCheckedChange={field.onChange}
              disabled={isSubmitting}
            />
          )}
        />
        <label
          htmlFor="rememberMe"
          className="cursor-pointer select-none font-medium text-slate-600"
        >
          Ingat sesi di perangkat ini
        </label>
      </div>

      {/* Submit Button */}
      <div className="pt-2">
        <Button
          type="submit"
          disabled={isSubmitting}
          className="h-11 w-full gap-2 font-semibold shadow-xs transition-all active:scale-[0.99]"
        >
          {isSubmitting ? (
            <>
              <Loader2 className="h-4 w-4 animate-spin text-white" />
              <span>Memverifikasi Akun...</span>
            </>
          ) : (
            <>
              <span>Masuk ke Sistem Perpustakaan</span>
              <ArrowRight className="h-4 w-4" />
            </>
          )}
        </Button>
      </div>

      {/* Student OPAC Link */}
      <div className="pt-2 text-center">
        <Link
          href={AUTH_CONFIG.opacUrl}
          className="inline-flex items-center justify-center gap-1.5 text-xs font-medium text-slate-600 transition-colors hover:text-emerald-800"
        >
          <BookOpen className="h-4 w-4 text-emerald-700" />
          <span>
            Bukan petugas? <strong>Buka Katalog Buku Siswa &amp; Santri</strong>
          </span>
        </Link>
      </div>
    </form>
  );
}
