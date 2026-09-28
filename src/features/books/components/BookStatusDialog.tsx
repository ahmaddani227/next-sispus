"use client";

import { ConfirmDialog } from "@/components/ConfirmDialog";
import { BookItem } from "../types/books.types";

interface BookStatusDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  book: BookItem | null;
  onConfirm: (book: BookItem) => void;
}

export function BookStatusDialog({
  open,
  onOpenChange,
  book,
  onConfirm,
}: BookStatusDialogProps) {
  if (!book) return null;

  const isDeactivating = book.status === "active";

  return (
    <ConfirmDialog
      open={open}
      onOpenChange={onOpenChange}
      variant={isDeactivating ? "danger" : "success"}
      title={
        isDeactivating
          ? "Konfirmasi Nonaktifkan Buku"
          : "Konfirmasi Aktivasi Data Buku"
      }
      description={
        isDeactivating ? (
          <>
            Apakah Anda yakin ingin menonaktifkan data buku{" "}
            <strong className="text-slate-900 dark:text-foreground font-bold">
              {book.title} ({book.code})
            </strong>{" "}
            dari sirkulasi? Buku yang dinonaktifkan tidak dapat dipinjam oleh
            siswa maupun dewan guru.
          </>
        ) : (
          <>
            Apakah Anda yakin ingin mengaktifkan kembali data buku{" "}
            <strong className="text-slate-900 dark:text-foreground font-bold">
              &apos;{book.title}&apos;
            </strong>
            ? Buku yang berstatus aktif akan dapat dicari dan dipinjam kembali
            melalui katalog OPAC siswa & santri.
          </>
        )
      }
      confirmLabel={isDeactivating ? "Ya, Nonaktifkan" : "Ya, Aktifkan Data"}
      onConfirm={() => onConfirm(book)}
    />
  );
}
