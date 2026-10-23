"use client";

import { ConfirmDialog } from "@/components/ConfirmDialog";
import type { Pengguna } from "../types/pengguna.types";

interface UserStatusDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  user: Pengguna | null;
  onConfirm: () => void;
}

export function UserStatusDialog({
  open,
  onOpenChange,
  user,
  onConfirm,
}: UserStatusDialogProps) {
  if (!user) return null;

  const isDeactivating = user.status === "Aktif";

  return (
    <ConfirmDialog
      open={open}
      onOpenChange={onOpenChange}
      variant={isDeactivating ? "warning" : "success"}
      title={
        isDeactivating
          ? "Konfirmasi Nonaktifkan Akun"
          : "Konfirmasi Aktivasi Akun"
      }
      description={
        isDeactivating ? (
          <>
            Apakah Anda yakin ingin menonaktifkan akun staf{" "}
            <strong className="text-foreground font-bold">
              {user.nama}
            </strong>{" "}
            (@{user.username})? Pengguna dengan status nonaktif tidak akan dapat
            login atau mengakses sistem sirkulasi perpustakaan madrasah.
          </>
        ) : (
          <>
            Apakah Anda yakin ingin mengaktifkan kembali akun{" "}
            <strong className="text-foreground font-bold">
              {user.nama}
            </strong>{" "}
            (@{user.username})? Akun ini akan segera dapat login dan mengakses
            layanan sistem SIPUS kembali.
          </>
        )
      }
      confirmLabel={
        isDeactivating ? "Ya, Nonaktifkan Akun" : "Ya, Aktifkan Akun"
      }
      onConfirm={onConfirm}
    />
  );
}
