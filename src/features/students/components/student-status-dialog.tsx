"use client";

import { useTransition } from "react";
import { toast } from "sonner";
import { AlertTriangle, CheckCircle2, Info, X } from "lucide-react";
import { toggleStudentStatusAction } from "../actions/student.actions";
import type { StudentItem } from "../types/student.types";

interface StudentStatusDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  student: StudentItem | null;
  onSuccess?: () => void;
}

export function StudentStatusDialog({
  open,
  onOpenChange,
  student,
  onSuccess,
}: StudentStatusDialogProps) {
  const [isPending, startTransition] = useTransition();

  if (!open || !student) return null;

  const isDeactivating = student.status === "ACTIVE";

  const handleConfirm = () => {
    startTransition(async () => {
      const result = await toggleStudentStatusAction(student.id);

      if (!result.success) {
        toast.error(result.message);
        return;
      }

      toast.success(result.message);
      onOpenChange(false);
      onSuccess?.();
    });
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4 backdrop-blur-xs">
      <div className="relative w-full max-w-md rounded-xl border border-slate-200 bg-white p-6 shadow-xl dark:border-slate-800 dark:bg-slate-900">
        <button
          type="button"
          onClick={() => onOpenChange(false)}
          disabled={isPending}
          className="absolute right-4 top-4 rounded-lg p-1.5 text-slate-400 hover:bg-slate-100 hover:text-slate-600 dark:hover:bg-slate-800 dark:hover:text-slate-200"
          aria-label="Tutup dialog"
        >
          <X className="h-4 w-4" />
        </button>

        {/* Ikon & Judul */}
        <div className="flex flex-col items-center text-center">
          <div
            className={`flex h-12 w-12 items-center justify-center rounded-full ${
              isDeactivating
                ? "bg-amber-100 text-amber-600 dark:bg-amber-500/15 dark:text-amber-400"
                : "bg-emerald-100 text-emerald-600 dark:bg-emerald-500/15 dark:text-emerald-400"
            }`}
          >
            {isDeactivating ? (
              <AlertTriangle className="h-6 w-6" />
            ) : (
              <CheckCircle2 className="h-6 w-6" />
            )}
          </div>

          <h2 className="mt-4 text-lg font-semibold text-slate-900 dark:text-white">
            Konfirmasi Perubahan Status Siswa
          </h2>
          <p className="mt-1.5 text-sm text-slate-500 dark:text-slate-400">
            Apakah Anda yakin ingin{" "}
            {isDeactivating ? "menonaktifkan" : "mengaktifkan kembali"} status
            keanggotaan perpustakaan untuk siswa:
          </p>
          <p className="mt-2 text-sm font-semibold text-slate-900 dark:text-white">
            {student.fullName} (NIS: {student.nis}
            {student.studentClass ? ` - ${student.studentClass.name}` : ""})?
          </p>
        </div>

        {/* Kotak Konsekuensi */}
        {isDeactivating ? (
          <div className="mt-5 rounded-lg border border-amber-200 bg-amber-50/80 p-3.5 text-left text-xs text-amber-900 dark:border-amber-500/25 dark:bg-amber-500/10 dark:text-amber-200">
            <div className="mb-1.5 flex items-center gap-1.5 font-semibold text-amber-800 dark:text-amber-300">
              <Info className="h-4 w-4 shrink-0" />
              Konsekuensi Penonaktifan:
            </div>
            <ul className="list-disc space-y-1 pl-5">
              <li>
                Siswa tidak dapat melakukan peminjaman baru di loket sirkulasi
                perpustakaan.
              </li>
              {student.activeLoansCount > 0 ? (
                <li className="font-medium">
                  Tanggungan {student.activeLoansCount} buku yang sedang
                  dipinjam tetap wajib dikembalikan tepat waktu.
                </li>
              ) : (
                <li>
                  Siswa saat ini tidak memiliki tanggungan peminjaman buku
                  aktif.
                </li>
              )}
              <li>
                Riwayat peminjaman, skorsing, dan kewajiban buku tetap tersimpan
                aman di sistem.
              </li>
            </ul>
          </div>
        ) : (
          <div className="mt-5 rounded-lg border border-emerald-200 bg-emerald-50/80 p-3.5 text-left text-xs text-emerald-900 dark:border-emerald-500/25 dark:bg-emerald-500/10 dark:text-emerald-200">
            <div className="mb-1.5 flex items-center gap-1.5 font-semibold text-emerald-800 dark:text-emerald-300">
              <Info className="h-4 w-4 shrink-0" />
              Informasi Pengaktifan:
            </div>
            <ul className="list-disc space-y-1 pl-5">
              <li>
                Siswa akan kembali memperoleh hak akses sirkulasi peminjaman
                buku perpustakaan.
              </li>
              {student.hasActiveSanction && (
                <li className="font-medium text-amber-700 dark:text-amber-300">
                  Catatan: Siswa masih memiliki masa skorsing aktif sehingga
                  peminjaman tetap dibatasi hingga skorsing berakhir.
                </li>
              )}
            </ul>
          </div>
        )}

        {/* Tombol Aksi */}
        <div className="mt-6 flex items-center justify-end gap-2.5">
          <button
            type="button"
            onClick={() => onOpenChange(false)}
            disabled={isPending}
            className="rounded-lg border border-slate-300 px-4 py-2 text-sm font-medium text-slate-700 hover:bg-slate-50 disabled:opacity-50 dark:border-slate-700 dark:text-slate-300 dark:hover:bg-slate-800"
          >
            Batal
          </button>
          <button
            type="button"
            onClick={handleConfirm}
            disabled={isPending}
            className={`rounded-lg px-4 py-2 text-sm font-medium text-white disabled:opacity-50 ${
              isDeactivating
                ? "bg-red-600 hover:bg-red-700"
                : "bg-emerald-600 hover:bg-emerald-700"
            }`}
          >
            {isPending
              ? "Memproses..."
              : isDeactivating
              ? "Ya, Nonaktifkan Siswa"
              : "Ya, Aktifkan Siswa"}
          </button>
        </div>
      </div>
    </div>
  );
}