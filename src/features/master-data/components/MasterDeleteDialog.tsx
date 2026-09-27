"use client";

import { ConfirmDialog } from "@/components/ConfirmDialog";
import { MasterItem } from "../types/master-data.types";

interface MasterDeleteDialogProps {
  item: MasterItem | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onConfirm: () => void;
}

export function MasterDeleteDialog({
  item,
  open,
  onOpenChange,
  onConfirm,
}: MasterDeleteDialogProps) {
  if (!item) return null;

  return (
    <ConfirmDialog
      open={open}
      onOpenChange={onOpenChange}
      variant="danger"
      title="Hapus Master Data Entitas?"
      description={
        <>
          Apakah Anda yakin ingin menghapus entitas{" "}
          <strong className="text-slate-800">{item.name}</strong> ({item.code})?
          Tindakan ini dapat memengaruhi integritas relasi buku pada katalog.
        </>
      }
      cancelLabel="Batalkan"
      confirmLabel="Ya, Hapus Data"
      onConfirm={onConfirm}
    />
  );
}
