"use client";

import { ConfirmDialog } from "@/components/ConfirmDialog";
import { RotateCcw } from "lucide-react";

interface ResetDefaultsDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onConfirm: () => void;
  isLoading?: boolean;
}

export function ResetDefaultsDialog({
  open,
  onOpenChange,
  onConfirm,
  isLoading = false,
}: ResetDefaultsDialogProps) {
  return (
    <ConfirmDialog
      open={open}
      onOpenChange={onOpenChange}
      title="Pulihkan Konfigurasi ke Default"
      description={
        <div className="space-y-2 text-xs text-muted-foreground leading-relaxed">
          <p>
            Tindakan ini akan mengembalikan seluruh aturan sistem ke standar/default.
          </p>
          <ul className="list-disc pl-5 space-y-1 font-mono text-xs text-foreground font-semibold text-start">
            <li>Maksimal Buku Dipinjam: 2 eksemplar</li>
            <li>Durasi Standar Pinjam: 7 hari kalender</li>
            <li>Maksimal Perpanjangan: 1 kali</li>
            <li>Durasi Tambahan Perpanjangan: 7 hari kalender</li>
          </ul>
          <p className="pt-1">
            Aturan ini akan langsung berlaku pada seluruh transaksi loket sirkulasi
            baru berikutnya.
          </p>
        </div>
      }
      confirmLabel="Ya, Pulihkan Default"
      cancelLabel="Batal"
      variant="warning"
      icon={<RotateCcw className="w-6 h-6 text-amber-600 dark:text-amber-400" />}
      isLoading={isLoading}
      onConfirm={onConfirm}
    />
  );
}
