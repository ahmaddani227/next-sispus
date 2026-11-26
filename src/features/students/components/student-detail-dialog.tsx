"use client";

import {
  BookOpen,
  Clock,
  Loader2,
  Pencil,
  ShieldAlert,
  ShieldCheck,
  User,
  X,
} from "lucide-react";
import type { StudentDetailItem } from "../types/student.types";

interface StudentDetailDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  student: StudentDetailItem | null;
  isLoading?: boolean;
  onEdit?: (student: StudentDetailItem) => void;
}

function formatDateId(value: Date | string | null | undefined): string {
  if (!value) return "-";
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return "-";
  return new Intl.DateTimeFormat("id-ID", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  }).format(date);
}

function getInitials(name: string): string {
  const parts = name.trim().split(/\s+/).filter(Boolean);
  if (parts.length === 0) return "SW";
  if (parts.length === 1) return parts[0].slice(0, 2).toUpperCase();
  return `${parts[0][0]}${parts[1][0]}`.toUpperCase();
}

export function StudentDetailDialog({
  open,
  onOpenChange,
  student,
  isLoading = false,
  onEdit,
}: StudentDetailDialogProps) {
  if (!open) return null;

  const remainingQuota = student
    ? Math.max(0, student.maxActiveLoans - student.activeLoansCount)
    : 0;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4 backdrop-blur-xs">
      <div className="flex max-h-[90vh] w-full max-w-2xl flex-col overflow-hidden rounded-xl border border-slate-200 bg-white shadow-xl dark:border-slate-800 dark:bg-slate-900">
        {/* Header */}
        <div className="flex items-start justify-between gap-3 border-b border-slate-200 px-6 py-4 dark:border-slate-800">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-emerald-100 text-emerald-700 dark:bg-emerald-500/15 dark:text-emerald-400">
              <User className="h-5 w-5" />
            </div>
            <div>
              <h2 className="text-base font-semibold text-slate-900 dark:text-white">
                Rincian Profil Siswa &amp; Status Sirkulasi
              </h2>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                {student
                  ? `NIS / Barcode: ${student.nis}`
                  : "Memuat informasi keanggotaan siswa..."}
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={() => onOpenChange(false)}
            className="rounded-lg p-1.5 text-slate-400 hover:bg-slate-100 hover:text-slate-600 dark:hover:bg-slate-800 dark:hover:text-slate-200"
            aria-label="Tutup dialog"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Body */}
        <div className="flex-1 space-y-5 overflow-y-auto px-6 py-5">
          {isLoading || !student ? (
            <div className="flex flex-col items-center justify-center py-12 text-slate-500 dark:text-slate-400">
              <Loader2 className="h-7 w-7 animate-spin text-emerald-600" />
              <p className="mt-2 text-sm">Memuat rincian siswa...</p>
            </div>
          ) : (
            <>
              {/* Kartu Profil Ringkas */}
              <div className="flex flex-col gap-4 rounded-xl border border-slate-200 bg-slate-50/70 p-4 sm:flex-row sm:items-center sm:justify-between dark:border-slate-800 dark:bg-slate-950/60">
                <div className="flex items-center gap-3.5">
                  <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-emerald-600 text-sm font-bold text-white">
                    {getInitials(student.fullName)}
                  </div>
                  <div>
                    <h3 className="text-base font-semibold text-slate-900 dark:text-white">
                      {student.fullName}
                    </h3>
                    <div className="mt-0.5 flex flex-wrap items-center gap-x-2 gap-y-1 text-xs text-slate-500 dark:text-slate-400">
                      <span>
                        {student.studentClass
                          ? `${student.studentClass.name} (${student.studentClass.academicYear})`
                          : "Belum terdaftar di kelas"}
                      </span>
                      <span>&bull;</span>
                      <span>NIS: {student.nis}</span>
                    </div>
                  </div>
                </div>

                <div className="flex flex-col items-start gap-1 sm:items-end">
                  <span
                    className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${
                      student.status === "ACTIVE"
                        ? "bg-emerald-100 text-emerald-700 dark:bg-emerald-500/15 dark:text-emerald-400"
                        : "bg-red-100 text-red-700 dark:bg-red-500/15 dark:text-red-400"
                    }`}
                  >
                    {student.status === "ACTIVE"
                      ? "Aktif Sirkulasi"
                      : "Nonaktif"}
                  </span>
                  <span className="text-xs text-slate-500 dark:text-slate-400">
                    Terdaftar: {formatDateId(student.createdAt)}
                  </span>
                </div>
              </div>

              {/* Status Sirkulasi & Kuota Pustaka */}
              <div>
                <h4 className="mb-2.5 flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400">
                  <ShieldCheck className="h-4 w-4 text-emerald-600 dark:text-emerald-400" />
                  Status Sirkulasi &amp; Kuota Pustaka
                </h4>
                <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
                  {/* Kuota */}
                  <div className="rounded-lg border border-slate-200 bg-white p-3 dark:border-slate-800 dark:bg-slate-950/50">
                    <p className="text-xs text-slate-500 dark:text-slate-400">
                      Kuota Digunakan
                    </p>
                    <p className="mt-1 text-base font-bold text-slate-900 dark:text-white">
                      {student.activeLoansCount} / {student.maxActiveLoans} Buku
                    </p>
                    <p className="mt-0.5 text-xs text-emerald-600 dark:text-emerald-400">
                      {remainingQuota > 0
                        ? `Sisa kuota ${remainingQuota} buku`
                        : "Kuota penuh"}
                    </p>
                  </div>

                  {/* Kepatuhan */}
                  <div className="rounded-lg border border-slate-200 bg-white p-3 dark:border-slate-800 dark:bg-slate-950/50">
                    <p className="text-xs text-slate-500 dark:text-slate-400">
                      Kepatuhan Kembali
                    </p>
                    <p className="mt-1 text-base font-bold text-slate-900 dark:text-white">
                      {student.onTimeRate !== null
                        ? `${student.onTimeRate}%`
                        : "-"}
                    </p>
                    <p className="mt-0.5 text-xs text-slate-500 dark:text-slate-400">
                      {student.totalCompletedLoans > 0
                        ? `Dari ${student.totalCompletedLoans} pinjaman selesai`
                        : "Belum ada riwayat"}
                    </p>
                  </div>

                  {/* Skorsing */}
                  <div className="rounded-lg border border-slate-200 bg-white p-3 dark:border-slate-800 dark:bg-slate-950/50">
                    <p className="text-xs text-slate-500 dark:text-slate-400">
                      Status Skorsing
                    </p>
                    <p
                      className={`mt-1 text-sm font-bold ${
                        student.hasActiveSanction
                          ? "text-red-600 dark:text-red-400"
                          : "text-emerald-600 dark:text-emerald-400"
                      }`}
                    >
                      {student.hasActiveSanction
                        ? "Sedang Skorsing"
                        : "Bebas Skorsing"}
                    </p>
                    <p className="mt-0.5 text-xs text-slate-500 dark:text-slate-400">
                      {student.hasActiveSanction &&
                      student.activeSanctionEndDate
                        ? `Hingga ${formatDateId(student.activeSanctionEndDate)}`
                        : "Catatan disiplin bersih"}
                    </p>
                  </div>

                  {/* Kewajiban Buku */}
                  <div className="rounded-lg border border-slate-200 bg-white p-3 dark:border-slate-800 dark:bg-slate-950/50">
                    <p className="text-xs text-slate-500 dark:text-slate-400">
                      Kewajiban Buku
                    </p>
                    <p
                      className={`mt-1 text-sm font-bold ${
                        student.pendingObligationsCount > 0
                          ? "text-amber-600 dark:text-amber-400"
                          : "text-emerald-600 dark:text-emerald-400"
                      }`}
                    >
                      {student.pendingObligationsCount > 0
                        ? `${student.pendingObligationsCount} Pending`
                        : "Nihil"}
                    </p>
                    <p className="mt-0.5 text-xs text-slate-500 dark:text-slate-400">
                      {student.pendingObligationsCount > 0
                        ? "Perlu perbaikan / ganti"
                        : "Bebas tanggungan buku"}
                    </p>
                  </div>
                </div>
              </div>

              {/* Buku yang Sedang Dipinjam */}
              <div>
                <div className="mb-2.5 flex items-center justify-between">
                  <h4 className="flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400">
                    <BookOpen className="h-4 w-4 text-emerald-600 dark:text-emerald-400" />
                    Buku yang Sedang Dipinjam
                  </h4>
                  <span className="rounded-full bg-blue-100 px-2 py-0.5 text-xs font-medium text-blue-700 dark:bg-blue-500/15 dark:text-blue-400">
                    {student.activeLoans.length} Koleksi Aktif
                  </span>
                </div>

                {student.activeLoans.length === 0 ? (
                  <div className="rounded-lg border border-dashed border-slate-300 px-4 py-5 text-center text-xs text-slate-500 dark:border-slate-700 dark:text-slate-400">
                    Tidak ada buku yang sedang dipinjam saat ini.
                  </div>
                ) : (
                  <div className="space-y-2">
                    {student.activeLoans.map((loan) => (
                      <div
                        key={loan.detailId}
                        className="flex flex-col gap-2 rounded-lg border border-slate-200 bg-white p-3.5 sm:flex-row sm:items-center sm:justify-between dark:border-slate-800 dark:bg-slate-950/50"
                      >
                        <div>
                          <div className="flex flex-wrap items-center gap-2">
                            <p className="text-sm font-medium text-slate-900 dark:text-white">
                              {loan.bookTitle}
                            </p>
                            <span className="rounded bg-slate-100 px-1.5 py-0.5 font-mono text-[11px] text-slate-600 dark:bg-slate-800 dark:text-slate-300">
                              {loan.copyCode}
                            </span>
                          </div>
                          <p className="mt-1 text-xs text-slate-500 dark:text-slate-400">
                            Pinjam: {formatDateId(loan.loanDate)} &bull; Jatuh
                            Tempo:{" "}
                            <span
                              className={
                                loan.isOverdue
                                  ? "font-medium text-red-600 dark:text-red-400"
                                  : loan.isDueToday
                                  ? "font-medium text-amber-600 dark:text-amber-400"
                                  : ""
                              }
                            >
                              {formatDateId(loan.dueDate)}
                            </span>
                          </p>
                        </div>

                        <div className="flex items-center gap-1.5">
                          {loan.isOverdue && (
                            <span className="inline-flex items-center gap-1 rounded-full bg-red-100 px-2.5 py-0.5 text-xs font-medium text-red-700 dark:bg-red-500/15 dark:text-red-400">
                              <ShieldAlert className="h-3 w-3" />
                              Terlambat
                            </span>
                          )}
                          {!loan.isOverdue && loan.isDueToday && (
                            <span className="rounded-full bg-amber-100 px-2.5 py-0.5 text-xs font-medium text-amber-700 dark:bg-amber-500/15 dark:text-amber-400">
                              Tempo Hari Ini
                            </span>
                          )}
                          <span className="rounded-full bg-blue-100 px-2.5 py-0.5 text-xs font-medium text-blue-700 dark:bg-blue-500/15 dark:text-blue-400">
                            Dipinjam
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* Riwayat 3 Peminjaman Terakhir */}
              <div>
                <h4 className="mb-2.5 flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400">
                  <Clock className="h-4 w-4 text-slate-500 dark:text-slate-400" />
                  Riwayat 3 Peminjaman Terakhir
                </h4>

                {student.recentLoans.length === 0 ? (
                  <div className="rounded-lg border border-dashed border-slate-300 px-4 py-5 text-center text-xs text-slate-500 dark:border-slate-700 dark:text-slate-400">
                    Belum ada riwayat pengembalian buku.
                  </div>
                ) : (
                  <div className="overflow-hidden rounded-lg border border-slate-200 dark:border-slate-800">
                    <div className="overflow-x-auto">
                      <table className="w-full text-left text-xs">
                        <thead className="border-b border-slate-200 bg-slate-50 text-slate-600 dark:border-slate-800 dark:bg-slate-950/60 dark:text-slate-400">
                          <tr>
                            <th className="px-3.5 py-2.5 font-semibold">
                              Judul Koleksi Buku
                            </th>
                            <th className="px-3.5 py-2.5 font-semibold">
                              Tgl Pinjam
                            </th>
                            <th className="px-3.5 py-2.5 font-semibold">
                              Tgl Kembali
                            </th>
                            <th className="px-3.5 py-2.5 text-right font-semibold">
                              Status
                            </th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-200 dark:divide-slate-800">
                          {student.recentLoans.map((item) => (
                            <tr key={item.detailId}>
                              <td className="px-3.5 py-2.5 font-medium text-slate-900 dark:text-white">
                                {item.bookTitle}
                              </td>
                              <td className="px-3.5 py-2.5 text-slate-600 dark:text-slate-300">
                                {formatDateId(item.loanDate)}
                              </td>
                              <td className="px-3.5 py-2.5 text-slate-600 dark:text-slate-300">
                                {formatDateId(item.returnedAt)}
                              </td>
                              <td className="px-3.5 py-2.5 text-right">
                                {item.status === "DAMAGED" ? (
                                  <span className="font-medium text-amber-600 dark:text-amber-400">
                                    Rusak
                                  </span>
                                ) : item.status === "LOST" ? (
                                  <span className="font-medium text-red-600 dark:text-red-400">
                                    Hilang
                                  </span>
                                ) : item.lateDays > 0 ? (
                                  <span className="font-medium text-amber-600 dark:text-amber-400">
                                    Terlambat {item.lateDays} hari
                                  </span>
                                ) : (
                                  <span className="font-medium text-emerald-600 dark:text-emerald-400">
                                    Tepat Waktu
                                  </span>
                                )}
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </div>
                )}
              </div>
            </>
          )}
        </div>

        {/* Footer */}
        <div className="flex items-center justify-between border-t border-slate-200 px-6 py-4 dark:border-slate-800">
          <button
            type="button"
            onClick={() => onOpenChange(false)}
            className="rounded-lg border border-slate-300 px-4 py-2 text-sm font-medium text-slate-700 hover:bg-slate-50 dark:border-slate-700 dark:text-slate-300 dark:hover:bg-slate-800"
          >
            Tutup
          </button>

          {student && onEdit && (
            <button
              type="button"
              onClick={() => {
                onOpenChange(false);
                onEdit(student);
              }}
              className="inline-flex items-center gap-2 rounded-lg bg-emerald-600 px-4 py-2 text-sm font-medium text-white hover:bg-emerald-700"
            >
              <Pencil className="h-4 w-4" />
              Edit Data Siswa
            </button>
          )}
        </div>
      </div>
    </div>
  );
}