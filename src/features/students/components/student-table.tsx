"use client";

import { useMemo } from "react";
import {
  AlertTriangle,
  ChevronLeft,
  ChevronRight,
  Users,
} from "lucide-react";
import type { StudentItem } from "../types/student.types";

interface StudentTableProps {
  students: StudentItem[];
  total: number;
  page: number;
  pageSize: number;
  totalPages: number;
  maxActiveLoans: number;
  onPageChange: (page: number) => void;
  onDetail: (student: StudentItem) => void;
  onEdit: (student: StudentItem) => void;
  onToggleStatus: (student: StudentItem) => void;
}

function formatShortDate(value: Date | string | null): string {
  if (!value) return "-";
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return "-";
  return new Intl.DateTimeFormat("id-ID", {
    day: "2-digit",
    month: "short",
  }).format(date);
}

function getVisiblePages(current: number, total: number): (number | "...")[] {
  if (total <= 5) {
    return Array.from({ length: total }, (_, i) => i + 1);
  }

  const pages: (number | "...")[] = [1];

  if (current > 3) {
    pages.push("...");
  }

  const start = Math.max(2, current - 1);
  const end = Math.min(total - 1, current + 1);

  for (let p = start; p <= end; p++) {
    pages.push(p);
  }

  if (current < total - 2) {
    pages.push("...");
  }

  pages.push(total);
  return pages;
}

export function StudentTable({
  students,
  total,
  page,
  pageSize,
  totalPages,
  maxActiveLoans,
  onPageChange,
  onDetail,
  onEdit,
  onToggleStatus,
}: StudentTableProps) {
  const startItem = total === 0 ? 0 : (page - 1) * pageSize + 1;
  const endItem = Math.min(page * pageSize, total);

  const visiblePages = useMemo(
    () => getVisiblePages(page, totalPages),
    [page, totalPages]
  );

  return (
    <div className="overflow-hidden rounded-xl border border-slate-200 bg-white shadow-xs dark:border-slate-800 dark:bg-slate-900">
      {/* Header Tabel */}
      <div className="flex flex-col gap-2 border-b border-slate-200 px-5 py-4 sm:flex-row sm:items-center sm:justify-between dark:border-slate-800">
        <div>
          <h2 className="text-base font-semibold text-slate-900 dark:text-white">
            Daftar Anggota Siswa
          </h2>
          <p className="text-xs text-slate-500 dark:text-slate-400">
            Kelola identitas NIS, rombel kelas, hak sirkulasi peminjaman, dan
            status keanggotaan perpustakaan.
          </p>
        </div>
        <div className="inline-flex items-center gap-1.5 self-start rounded-full bg-emerald-50 px-3 py-1 text-xs font-medium text-emerald-700 sm:self-auto dark:bg-emerald-500/15 dark:text-emerald-400">
          <span>Total Terdata:</span>
          <span className="font-bold">
            {new Intl.NumberFormat("id-ID").format(total)} Siswa
          </span>
        </div>
      </div>

      {/* Isi Tabel */}
      <div className="overflow-x-auto">
        <table className="w-full text-left text-sm">
          <thead className="border-b border-slate-200 bg-slate-50/80 text-xs uppercase tracking-wider text-slate-500 dark:border-slate-800 dark:bg-slate-950/50 dark:text-slate-400">
            <tr>
              <th className="w-14 px-4 py-3.5 font-semibold">No</th>
              <th className="px-4 py-3.5 font-semibold">NIS</th>
              <th className="px-4 py-3.5 font-semibold">Nama Siswa</th>
              <th className="px-4 py-3.5 font-semibold">Kelas</th>
              <th className="px-4 py-3.5 font-semibold">Status</th>
              <th className="px-4 py-3.5 font-semibold">Pinjaman Aktif</th>
              <th className="px-4 py-3.5 text-right font-semibold">Aksi</th>
            </tr>
          </thead>

          <tbody className="divide-y divide-slate-200 dark:divide-slate-800">
            {students.length === 0 ? (
              <tr>
                <td
                  colSpan={7}
                  className="px-6 py-12 text-center text-slate-500 dark:text-slate-400"
                >
                  <Users className="mx-auto h-9 w-9 text-slate-300 dark:text-slate-700" />
                  <p className="mt-2.5 text-sm font-medium text-slate-700 dark:text-slate-300">
                    Belum ada data siswa yang cocok
                  </p>
                  <p className="mt-1 text-xs">
                    Coba ubah filter pencarian, tambah siswa baru, atau impor
                    dari file Excel/CSV.
                  </p>
                </td>
              </tr>
            ) : (
              students.map((student, index) => {
                const rowNumber = (page - 1) * pageSize + index + 1;
                const remainingQuota = Math.max(
                  0,
                  maxActiveLoans - student.activeLoansCount
                );
                const isBlocked =
                  student.status === "INACTIVE" ||
                  student.hasActiveSanction ||
                  student.pendingObligationsCount > 0;

                return (
                  <tr
                    key={student.id}
                    className="transition-colors hover:bg-slate-50/70 dark:hover:bg-slate-800/40"
                  >
                    {/* NO */}
                    <td className="px-4 py-3.5 text-xs text-slate-500 dark:text-slate-400">
                      {rowNumber}
                    </td>

                    {/* NIS */}
                    <td className="px-4 py-3.5">
                      <span className="inline-flex rounded-md bg-emerald-50 px-2 py-1 font-mono text-xs font-semibold text-emerald-700 dark:bg-emerald-500/15 dark:text-emerald-400">
                        {student.nis}
                      </span>
                    </td>

                    {/* NAMA SISWA */}
                    <td className="px-4 py-3.5">
                      <p className="font-medium text-slate-900 dark:text-white">
                        {student.fullName}
                      </p>
                      {(student.hasActiveSanction ||
                        student.pendingObligationsCount > 0) && (
                        <div className="mt-0.5 flex flex-wrap items-center gap-2 text-xs text-red-600 dark:text-red-400">
                          {student.hasActiveSanction && (
                            <span className="inline-flex items-center gap-1">
                              <AlertTriangle className="h-3 w-3" />
                              Skorsing Aktif
                            </span>
                          )}
                          {student.pendingObligationsCount > 0 && (
                            <span className="inline-flex items-center gap-1 text-amber-600 dark:text-amber-400">
                              <AlertTriangle className="h-3 w-3" />
                              {student.pendingObligationsCount} Kewajiban Buku
                            </span>
                          )}
                        </div>
                      )}
                    </td>

                    {/* KELAS */}
                    <td className="px-4 py-3.5">
                      {student.studentClass ? (
                        <span className="inline-flex items-center gap-1.5 rounded-full bg-slate-100 px-2.5 py-1 text-xs font-medium text-slate-700 dark:bg-slate-800 dark:text-slate-200">
                          <span className="h-1.5 w-1.5 rounded-full bg-emerald-500" />
                          {student.studentClass.name}
                          <span className="text-[11px] text-slate-400 dark:text-slate-400">
                            ({student.studentClass.academicYear})
                          </span>
                        </span>
                      ) : (
                        <span className="text-xs italic text-slate-400 dark:text-slate-500">
                          Belum ada kelas
                        </span>
                      )}
                    </td>

                    {/* STATUS */}
                    <td className="px-4 py-3.5">
                      <span
                        className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${
                          student.status === "ACTIVE"
                            ? "bg-emerald-100 text-emerald-700 dark:bg-emerald-500/15 dark:text-emerald-400"
                            : "bg-red-100 text-red-700 dark:bg-red-500/15 dark:text-red-400"
                        }`}
                      >
                        {student.status === "ACTIVE" ? "Aktif" : "Nonaktif"}
                      </span>
                    </td>

                    {/* PINJAMAN AKTIF */}
                    <td className="px-4 py-3.5">
                      {isBlocked && student.activeLoansCount === 0 ? (
                        <div>
                          <p className="text-xs font-semibold text-red-600 dark:text-red-400">
                            Akses Diblokir (0 Buku)
                          </p>
                          <p className="mt-0.5 text-xs text-slate-500 dark:text-slate-400">
                            {student.status === "INACTIVE"
                              ? "Keanggotaan nonaktif"
                              : student.hasActiveSanction
                              ? `Skorsing s/d ${formatShortDate(student.activeSanctionEndDate)}`
                              : "Ada kewajiban buku pending"}
                          </p>
                        </div>
                      ) : student.activeLoansCount > 0 ? (
                        <div>
                          <p
                            className={`text-xs font-semibold ${
                              remainingQuota === 0
                                ? "text-amber-600 dark:text-amber-400"
                                : "text-slate-900 dark:text-white"
                            }`}
                          >
                            {student.activeLoansCount} Buku Dipinjam
                            {remainingQuota === 0 ? " (Batas Kuota)" : ""}
                          </p>
                          <p className="mt-0.5 max-w-[220px] truncate text-xs text-slate-500 dark:text-slate-400">
                            {student.activeLoanTitles.join(", ")}
                          </p>
                          <p className="text-[11px] text-slate-400 dark:text-slate-500">
                            {student.nearestDueDate
                              ? `Tempo: ${formatShortDate(student.nearestDueDate)}`
                              : `Sisa kuota: ${remainingQuota}`}
                          </p>
                        </div>
                      ) : (
                        <div>
                          <p className="text-xs font-semibold text-emerald-700 dark:text-emerald-400">
                            0 Buku (Bebas Pinjam)
                          </p>
                          <p className="mt-0.5 text-xs text-slate-500 dark:text-slate-400">
                            Siap meminjam (Kuota {maxActiveLoans} buku)
                          </p>
                        </div>
                      )}
                    </td>

                    {/* AKSI */}
                    <td className="px-4 py-3.5 text-right">
                      <div className="inline-flex items-center justify-end gap-1.5">
                        <button
                          type="button"
                          onClick={() => onDetail(student)}
                          className="rounded-lg border border-emerald-200 bg-emerald-50 px-2.5 py-1.5 text-xs font-medium text-emerald-700 transition-colors hover:bg-emerald-100 dark:border-emerald-500/25 dark:bg-emerald-500/10 dark:text-emerald-400 dark:hover:bg-emerald-500/20"
                        >
                          Detail
                        </button>
                        <button
                          type="button"
                          onClick={() => onEdit(student)}
                          className="rounded-lg border border-slate-200 bg-white px-2.5 py-1.5 text-xs font-medium text-slate-700 transition-colors hover:bg-slate-50 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-200 dark:hover:bg-slate-700"
                        >
                          Edit
                        </button>
                        <button
                          type="button"
                          onClick={() => onToggleStatus(student)}
                          className={`rounded-lg border px-2.5 py-1.5 text-xs font-medium transition-colors ${
                            student.status === "ACTIVE"
                              ? "border-slate-200 bg-white text-slate-600 hover:border-red-200 hover:bg-red-50 hover:text-red-600 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-300 dark:hover:border-red-500/30 dark:hover:bg-red-500/10 dark:hover:text-red-400"
                              : "border-emerald-200 bg-emerald-50 text-emerald-700 hover:bg-emerald-100 dark:border-emerald-500/30 dark:bg-emerald-500/15 dark:text-emerald-400 dark:hover:bg-emerald-500/25"
                          }`}
                        >
                          {student.status === "ACTIVE"
                            ? "Nonaktifkan"
                            : "Aktifkan"}
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>

      {/* Footer Pagination */}
      {total > 0 && (
        <div className="flex flex-col items-center justify-between gap-3 border-t border-slate-200 px-5 py-3.5 sm:flex-row dark:border-slate-800">
          <p className="text-xs text-slate-500 dark:text-slate-400">
            Menampilkan{" "}
            <span className="font-semibold text-slate-700 dark:text-slate-200">
              {startItem} - {endItem}
            </span>{" "}
            dari{" "}
            <span className="font-semibold text-slate-700 dark:text-slate-200">
              {new Intl.NumberFormat("id-ID").format(total)}
            </span>{" "}
            siswa terdaftar
          </p>

          <div className="flex items-center gap-1">
            <button
              type="button"
              disabled={page <= 1}
              onClick={() => onPageChange(page - 1)}
              className="inline-flex items-center gap-1 rounded-lg border border-slate-200 bg-white px-2.5 py-1.5 text-xs font-medium text-slate-600 hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-40 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-300 dark:hover:bg-slate-700"
            >
              <ChevronLeft className="h-3.5 w-3.5" />
              Sebelumnya
            </button>

            {visiblePages.map((p, idx) =>
              p === "..." ? (
                <span
                  key={`ellipsis-${idx}`}
                  className="px-2 text-xs text-slate-400"
                >
                  ...
                </span>
              ) : (
                <button
                  key={p}
                  type="button"
                  onClick={() => onPageChange(p)}
                  className={`min-w-[30px] rounded-lg px-2.5 py-1.5 text-xs font-medium transition-colors ${
                    p === page
                      ? "bg-emerald-600 text-white"
                      : "border border-slate-200 bg-white text-slate-600 hover:bg-slate-50 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-300 dark:hover:bg-slate-700"
                  }`}
                >
                  {p}
                </button>
              )
            )}

            <button
              type="button"
              disabled={page >= totalPages}
              onClick={() => onPageChange(page + 1)}
              className="inline-flex items-center gap-1 rounded-lg border border-slate-200 bg-white px-2.5 py-1.5 text-xs font-medium text-slate-600 hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-40 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-300 dark:hover:bg-slate-700"
            >
              Selanjutnya
              <ChevronRight className="h-3.5 w-3.5" />
            </button>
          </div>
        </div>
      )}
    </div>
  );
}