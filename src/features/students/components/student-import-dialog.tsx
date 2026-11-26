"use client";

import { useMemo, useRef, useState, useTransition } from "react";
import * as XLSX from "xlsx";
import { toast } from "sonner";
import {
  AlertCircle,
  AlertTriangle,
  CheckCircle2,
  Download,
  FileSpreadsheet,
  Loader2,
  RefreshCw,
  Upload,
  X,
} from "lucide-react";
import {
  commitStudentImportAction,
  validateStudentImportAction,
} from "../actions/student.actions";
import type { StudentImportRowInput } from "../schemas/student.schema";
import type { StudentImportPreviewRow } from "../types/student.types";

interface StudentImportDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSuccess?: () => void;
}

type PreviewFilter = "all" | "valid" | "error";

function normalizeHeader(header: string): string {
  return header
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]/g, "");
}

function normalizeStatus(value: unknown): "ACTIVE" | "INACTIVE" {
  const text = String(value ?? "")
    .trim()
    .toUpperCase();
  if (
    text === "INACTIVE" ||
    text === "NONAKTIF" ||
    text === "TIDAK AKTIF" ||
    text === "0"
  ) {
    return "INACTIVE";
  }
  return "ACTIVE";
}

function mapRawRowToInput(
  raw: Record<string, unknown>
): StudentImportRowInput | null {
  const normalized: Record<string, unknown> = {};
  for (const [key, val] of Object.entries(raw)) {
    normalized[normalizeHeader(key)] = val;
  }

  const nis = String(
    normalized.nis ??
      normalized.nomorinduksiswa ??
      normalized.noinduk ??
      normalized.barcode ??
      ""
  ).trim();

  const fullName = String(
    normalized.namalengkap ??
      normalized.nama ??
      normalized.namasiswa ??
      normalized.fullname ??
      normalized.name ??
      ""
  ).trim();

  const className = String(
    normalized.kelas ??
      normalized.namakelas ??
      normalized.rombel ??
      normalized.class ??
      normalized.classname ??
      ""
  ).trim();

  const status = normalizeStatus(normalized.status ?? normalized.keaktifan);

  // Abaikan baris yang benar-benar kosong
  if (!nis && !fullName && !className) {
    return null;
  }

  return {
    nis,
    fullName,
    className,
    status,
  };
}

export function StudentImportDialog({
  open,
  onOpenChange,
  onSuccess,
}: StudentImportDialogProps) {
  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const [fileName, setFileName] = useState<string>("");
  const [previewRows, setPreviewRows] = useState<StudentImportPreviewRow[]>([]);
  const [filter, setFilter] = useState<PreviewFilter>("all");
  const [isValidating, startValidateTransition] = useTransition();
  const [isCommitting, startCommitTransition] = useTransition();

  const summary = useMemo(() => {
    const total = previewRows.length;
    const valid = previewRows.filter((r) => r.isValid).length;
    const invalid = total - valid;
    const withWarnings = previewRows.filter(
      (r) => r.isValid && r.warnings.length > 0
    ).length;
    return { total, valid, invalid, withWarnings };
  }, [previewRows]);

  const filteredRows = useMemo(() => {
    if (filter === "valid") return previewRows.filter((r) => r.isValid);
    if (filter === "error") return previewRows.filter((r) => !r.isValid);
    return previewRows;
  }, [previewRows, filter]);

  if (!open) return null;

  const isBusy = isValidating || isCommitting;

  const handleReset = () => {
    setFileName("");
    setPreviewRows([]);
    setFilter("all");
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const handleClose = () => {
    if (isBusy) return;
    handleReset();
    onOpenChange(false);
  };

  const handleDownloadTemplate = () => {
    const templateRows = [
      {
        NIS: "202607001",
        "Nama Lengkap": "Ahmad Fauzan",
        Kelas: "7A",
        Status: "ACTIVE",
      },
      {
        NIS: "202607002",
        "Nama Lengkap": "Siti Aisyah",
        Kelas: "7A",
        Status: "ACTIVE",
      },
    ];

    const worksheet = XLSX.utils.json_to_sheet(templateRows);
    worksheet["!cols"] = [
      { wch: 16 },
      { wch: 28 },
      { wch: 16 },
      { wch: 12 },
    ];

    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Template Siswa");
    XLSX.writeFile(workbook, "template-import-siswa-sipus.xlsx");
  };

  const handleFileChange = async (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    const file = event.target.files?.[0];
    if (!file) return;

    const ext = file.name.split(".").pop()?.toLowerCase();
    if (!ext || !["xlsx", "xls", "csv"].includes(ext)) {
      toast.error("Format file harus .xlsx, .xls, atau .csv.");
      event.target.value = "";
      return;
    }

    try {
      const buffer = await file.arrayBuffer();
      const workbook = XLSX.read(buffer, { type: "array" });
      const firstSheetName = workbook.SheetNames[0];

      if (!firstSheetName) {
        toast.error("File tidak memiliki sheet yang dapat dibaca.");
        return;
      }

      const sheet = workbook.Sheets[firstSheetName];
      const rawJson = XLSX.utils.sheet_to_json<Record<string, unknown>>(sheet, {
        defval: "",
      });

      const mappedRows = rawJson
        .map(mapRawRowToInput)
        .filter((row): row is StudentImportRowInput => row !== null);

      if (mappedRows.length === 0) {
        toast.error(
          "Tidak ditemukan baris data siswa. Pastikan nama kolom sesuai template (NIS, Nama Lengkap, Kelas, Status)."
        );
        return;
      }

      setFileName(file.name);
      setFilter("all");

      startValidateTransition(async () => {
        const res = await validateStudentImportAction(mappedRows);
        if (!res.success || !res.data) {
          toast.error(res.message);
          handleReset();
          return;
        }
        setPreviewRows(res.data);
        toast.info(res.message);
      });
    } catch {
      toast.error("Gagal membaca file. Pastikan file Excel/CSV tidak rusak.");
      handleReset();
    }
  };

  const handleCommitImport = () => {
    if (summary.valid === 0) {
      toast.error("Tidak ada baris valid untuk disimpan.");
      return;
    }

    startCommitTransition(async () => {
      const res = await commitStudentImportAction(previewRows);
      if (!res.success) {
        toast.error(res.message);
        return;
      }

      toast.success(res.message);
      handleReset();
      onOpenChange(false);
      onSuccess?.();
    });
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4 backdrop-blur-xs">
      <div className="flex max-h-[90vh] w-full max-w-4xl flex-col overflow-hidden rounded-xl border border-slate-200 bg-white shadow-xl dark:border-slate-800 dark:bg-slate-900">
        {/* Header */}
        <div className="flex items-start justify-between gap-3 border-b border-slate-200 px-6 py-4 dark:border-slate-800">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-emerald-100 text-emerald-700 dark:bg-emerald-500/15 dark:text-emerald-400">
              <FileSpreadsheet className="h-5 w-5" />
            </div>
            <div>
              <h2 className="text-base font-semibold text-slate-900 dark:text-white">
                Impor Data Siswa (.xlsx / .csv)
              </h2>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Unggah berkas daftar siswa untuk divalidasi terlebih dahulu
                sebelum disimpan ke database.
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={handleClose}
            disabled={isBusy}
            className="rounded-lg p-1.5 text-slate-400 hover:bg-slate-100 hover:text-slate-600 disabled:opacity-50 dark:hover:bg-slate-800 dark:hover:text-slate-200"
            aria-label="Tutup dialog"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Body */}
        <div className="flex-1 space-y-5 overflow-y-auto px-6 py-5">
          {/* Panduan & Tombol Unduh Template */}
          <div className="flex flex-col gap-3 rounded-xl border border-slate-200 bg-slate-50/70 p-4 sm:flex-row sm:items-center sm:justify-between dark:border-slate-800 dark:bg-slate-950/60">
            <div className="text-xs text-slate-600 dark:text-slate-300">
              <p className="font-semibold text-slate-900 dark:text-white">
                Format Kolom yang Didukung:
              </p>
              <p className="mt-0.5">
                <code className="rounded bg-slate-200/70 px-1 py-0.5 dark:bg-slate-800">
                  NIS
                </code>
                ,{" "}
                <code className="rounded bg-slate-200/70 px-1 py-0.5 dark:bg-slate-800">
                  Nama Lengkap
                </code>
                ,{" "}
                <code className="rounded bg-slate-200/70 px-1 py-0.5 dark:bg-slate-800">
                  Kelas
                </code>{" "}
                (harus sesuai nama di Data Kelas), dan{" "}
                <code className="rounded bg-slate-200/70 px-1 py-0.5 dark:bg-slate-800">
                  Status
                </code>{" "}
                (opsional: ACTIVE / INACTIVE).
              </p>
            </div>
            <button
              type="button"
              onClick={handleDownloadTemplate}
              disabled={isBusy}
              className="inline-flex shrink-0 items-center justify-center gap-1.5 rounded-lg border border-slate-300 bg-white px-3 py-2 text-xs font-medium text-slate-700 hover:bg-slate-50 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-200 dark:hover:bg-slate-800"
            >
              <Download className="h-3.5 w-3.5" />
              Unduh Template (.xlsx)
            </button>
          </div>

          {/* Area Upload (Muncul jika belum ada preview) */}
          {previewRows.length === 0 && !isValidating && (
            <label className="flex cursor-pointer flex-col items-center justify-center rounded-xl border-2 border-dashed border-slate-300 bg-slate-50/40 px-6 py-10 text-center transition-colors hover:border-emerald-500 hover:bg-emerald-50/30 dark:border-slate-700 dark:bg-slate-950/40 dark:hover:border-emerald-500/60 dark:hover:bg-emerald-500/5">
              <Upload className="h-9 w-9 text-emerald-600 dark:text-emerald-400" />
              <p className="mt-3 text-sm font-medium text-slate-900 dark:text-white">
                Klik untuk memilih file Excel atau CSV
              </p>
              <p className="mt-1 text-xs text-slate-500 dark:text-slate-400">
                Format didukung: .xlsx, .xls, atau .csv
              </p>
              <input
                ref={fileInputRef}
                type="file"
                accept=".xlsx,.xls,.csv"
                onChange={handleFileChange}
                className="hidden"
              />
            </label>
          )}

          {/* Loading Validasi */}
          {isValidating && (
            <div className="flex flex-col items-center justify-center py-12 text-slate-500 dark:text-slate-400">
              <Loader2 className="h-8 w-8 animate-spin text-emerald-600" />
              <p className="mt-2 text-sm">
                Memvalidasi baris data terhadap database...
              </p>
            </div>
          )}

          {/* Ringkasan & Tabel Preview */}
          {previewRows.length > 0 && !isValidating && (
            <div className="space-y-4">
              {/* Info File & Tombol Ganti */}
              <div className="flex flex-wrap items-center justify-between gap-2">
                <div className="flex items-center gap-2 text-xs text-slate-600 dark:text-slate-300">
                  <FileSpreadsheet className="h-4 w-4 text-emerald-600 dark:text-emerald-400" />
                  <span className="font-medium text-slate-900 dark:text-white">
                    {fileName}
                  </span>
                </div>
                <button
                  type="button"
                  onClick={handleReset}
                  disabled={isCommitting}
                  className="inline-flex items-center gap-1.5 rounded-lg border border-slate-300 px-2.5 py-1.5 text-xs font-medium text-slate-600 hover:bg-slate-50 dark:border-slate-700 dark:text-slate-300 dark:hover:bg-slate-800"
                >
                  <RefreshCw className="h-3.5 w-3.5" />
                  Ganti File
                </button>
              </div>

              {/* Kartu Ringkasan Validasi */}
              <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
                <div className="rounded-lg border border-slate-200 bg-white p-3 dark:border-slate-800 dark:bg-slate-950/50">
                  <p className="text-xs text-slate-500 dark:text-slate-400">
                    Total Baris
                  </p>
                  <p className="mt-0.5 text-lg font-bold text-slate-900 dark:text-white">
                    {summary.total}
                  </p>
                </div>
                <div className="rounded-lg border border-emerald-200 bg-emerald-50/60 p-3 dark:border-emerald-500/20 dark:bg-emerald-500/10">
                  <p className="text-xs text-emerald-700 dark:text-emerald-300">
                    Siap Disimpan (Valid)
                  </p>
                  <p className="mt-0.5 text-lg font-bold text-emerald-700 dark:text-emerald-400">
                    {summary.valid}
                  </p>
                </div>
                <div className="rounded-lg border border-red-200 bg-red-50/60 p-3 dark:border-red-500/20 dark:bg-red-500/10">
                  <p className="text-xs text-red-700 dark:text-red-300">
                    Error (Dilewati)
                  </p>
                  <p className="mt-0.5 text-lg font-bold text-red-700 dark:text-red-400">
                    {summary.invalid}
                  </p>
                </div>
                <div className="rounded-lg border border-amber-200 bg-amber-50/60 p-3 dark:border-amber-500/20 dark:bg-amber-500/10">
                  <p className="text-xs text-amber-700 dark:text-amber-300">
                    Peringatan
                  </p>
                  <p className="mt-0.5 text-lg font-bold text-amber-700 dark:text-amber-400">
                    {summary.withWarnings}
                  </p>
                </div>
              </div>

              {/* Tab Filter Preview */}
              <div className="flex flex-wrap items-center gap-2">
                {(
                  [
                    { key: "all", label: `Semua (${summary.total})` },
                    { key: "valid", label: `Valid (${summary.valid})` },
                    { key: "error", label: `Error (${summary.invalid})` },
                  ] as const
                ).map((tab) => (
                  <button
                    key={tab.key}
                    type="button"
                    onClick={() => setFilter(tab.key)}
                    className={`rounded-lg px-3 py-1.5 text-xs font-medium transition-colors ${
                      filter === tab.key
                        ? "bg-emerald-600 text-white"
                        : "border border-slate-200 bg-white text-slate-600 hover:bg-slate-50 dark:border-slate-800 dark:bg-slate-950 dark:text-slate-300 dark:hover:bg-slate-800"
                    }`}
                  >
                    {tab.label}
                  </button>
                ))}
              </div>

              {/* Tabel Preview */}
              <div className="overflow-hidden rounded-lg border border-slate-200 dark:border-slate-800">
                <div className="max-h-72 overflow-auto">
                  <table className="w-full text-left text-xs">
                    <thead className="sticky top-0 border-b border-slate-200 bg-slate-50 text-slate-600 dark:border-slate-800 dark:bg-slate-950 dark:text-slate-400">
                      <tr>
                        <th className="px-3 py-2.5 font-semibold">Baris</th>
                        <th className="px-3 py-2.5 font-semibold">NIS</th>
                        <th className="px-3 py-2.5 font-semibold">
                          Nama Lengkap
                        </th>
                        <th className="px-3 py-2.5 font-semibold">Kelas</th>
                        <th className="px-3 py-2.5 font-semibold">Status</th>
                        <th className="px-3 py-2.5 font-semibold">
                          Hasil Validasi
                        </th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-200 dark:divide-slate-800">
                      {filteredRows.length === 0 ? (
                        <tr>
                          <td
                            colSpan={6}
                            className="px-3 py-6 text-center text-slate-500 dark:text-slate-400"
                          >
                            Tidak ada baris pada kategori ini.
                          </td>
                        </tr>
                      ) : (
                        filteredRows.map((row) => (
                          <tr
                            key={`${row.rowNumber}-${row.nis}`}
                            className={
                              !row.isValid
                                ? "bg-red-50/40 dark:bg-red-500/5"
                                : ""
                            }
                          >
                            <td className="px-3 py-2.5 font-mono text-slate-500 dark:text-slate-400">
                              #{row.rowNumber}
                            </td>
                            <td className="px-3 py-2.5 font-mono font-medium text-slate-900 dark:text-white">
                              {row.nis || "-"}
                            </td>
                            <td className="px-3 py-2.5 text-slate-900 dark:text-white">
                              {row.fullName || "-"}
                            </td>
                            <td className="px-3 py-2.5 text-slate-600 dark:text-slate-300">
                              {row.className || (
                                <span className="italic text-slate-400">
                                  Kosong
                                </span>
                              )}
                            </td>
                            <td className="px-3 py-2.5">
                              <span
                                className={`inline-flex rounded-full px-2 py-0.5 text-[11px] font-medium ${
                                  row.status === "ACTIVE"
                                    ? "bg-emerald-100 text-emerald-700 dark:bg-emerald-500/15 dark:text-emerald-400"
                                    : "bg-slate-200 text-slate-700 dark:bg-slate-800 dark:text-slate-300"
                                }`}
                              >
                                {row.status === "ACTIVE" ? "Aktif" : "Nonaktif"}
                              </span>
                            </td>
                            <td className="px-3 py-2.5">
                              {!row.isValid ? (
                                <div className="space-y-0.5 text-red-600 dark:text-red-400">
                                  {row.errors.map((err, idx) => (
                                    <div
                                      key={idx}
                                      className="flex items-start gap-1"
                                    >
                                      <AlertCircle className="mt-0.5 h-3.5 w-3.5 shrink-0" />
                                      <span>{err}</span>
                                    </div>
                                  ))}
                                </div>
                              ) : row.warnings.length > 0 ? (
                                <div className="space-y-0.5 text-amber-600 dark:text-amber-400">
                                  {row.warnings.map((warn, idx) => (
                                    <div
                                      key={idx}
                                      className="flex items-start gap-1"
                                    >
                                      <AlertTriangle className="mt-0.5 h-3.5 w-3.5 shrink-0" />
                                      <span>{warn}</span>
                                    </div>
                                  ))}
                                </div>
                              ) : (
                                <div className="flex items-center gap-1 font-medium text-emerald-600 dark:text-emerald-400">
                                  <CheckCircle2 className="h-3.5 w-3.5 shrink-0" />
                                  <span>Valid</span>
                                </div>
                              )}
                            </td>
                          </tr>
                        ))
                      )}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="flex items-center justify-between gap-3 border-t border-slate-200 px-6 py-4 dark:border-slate-800">
          <p className="text-xs text-slate-500 dark:text-slate-400">
            {previewRows.length > 0
              ? `Hanya ${summary.valid} baris valid yang akan disimpan. Baris error dilewati otomatis.`
              : "Unduh template agar format kolom langsung cocok."}
          </p>
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={handleClose}
              disabled={isBusy}
              className="rounded-lg border border-slate-300 px-4 py-2 text-sm font-medium text-slate-700 hover:bg-slate-50 disabled:opacity-50 dark:border-slate-700 dark:text-slate-300 dark:hover:bg-slate-800"
            >
              Batal
            </button>
            <button
              type="button"
              onClick={handleCommitImport}
              disabled={isBusy || summary.valid === 0}
              className="rounded-lg bg-emerald-600 px-4 py-2 text-sm font-medium text-white hover:bg-emerald-700 disabled:opacity-50"
            >
              {isCommitting
                ? "Menyimpan..."
                : `Impor ${summary.valid > 0 ? `${summary.valid} ` : ""}Siswa Valid`}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}