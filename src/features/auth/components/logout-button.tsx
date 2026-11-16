"use client";

import { useState, useTransition } from "react";
import { LogOut, Loader2 } from "lucide-react";
import { logoutAction } from "../actions/auth.actions";
import { useAuthStore } from "../stores/useAuthStore";
import { ConfirmDialog } from "@/components/ConfirmDialog";
import { cn } from "@/lib/utils";

interface LogoutButtonProps {
  className?: string;
  showText?: boolean;
}

export function LogoutButton({ className, showText = false }: LogoutButtonProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [isPending, startTransition] = useTransition();

  const handleLogout = () => {
    startTransition(async () => {
      useAuthStore.getState().clearUser();
      await logoutAction();
    });
  };

  return (
    <>
      <button
        type="button"
        onClick={() => setIsOpen(true)}
        disabled={isPending}
        className={cn(
          "cursor-pointer rounded-md p-1.5 text-slate-400 transition-colors hover:bg-rose-50 hover:text-rose-600 dark:hover:bg-rose-950/50 dark:hover:text-rose-400 disabled:opacity-50",
          showText && "flex items-center gap-2 px-3 py-2 text-sm font-medium",
          className
        )}
        title="Keluar dari Sistem"
        aria-label="Keluar dari Sistem"
      >
        {isPending ? (
          <Loader2 className="h-5 w-5 animate-spin text-rose-600" />
        ) : (
          <LogOut className="h-5 w-5" />
        )}
        {showText && <span>{isPending ? "Sedang keluar..." : "Keluar"}</span>}
        {!showText && <span className="sr-only">Keluar</span>}
      </button>

      <ConfirmDialog
        open={isOpen}
        onOpenChange={setIsOpen}
        title="Konfirmasi Keluar"
        description="Apakah Anda yakin ingin keluar dari sistem SIPUS Ar-Rasyid? Sesi Anda akan diakhiri dan Anda perlu masuk kembali untuk mengakses sistem."
        confirmLabel="Ya, Keluar"
        cancelLabel="Batal"
        variant="danger"
        icon={<LogOut className="w-6 h-6 text-rose-600 dark:text-rose-400" />}
        isLoading={isPending}
        onConfirm={handleLogout}
      />
    </>
  );
}
