"use client";

import { useState, DragEvent } from "react";
import { UploadCloud, CheckCircle2, AlertTriangle, FileSpreadsheet } from "lucide-react";
import { toast } from "sonner";
import { ModalDialog } from "@/components/ModalDialog";
import { Button } from "@/components/ui/button";
import { SAMPLE_SPREADSHEET_PREVIEW } from "../constants/books-data";

interface BookImportDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSuccessImport?: () => void;
}

export function BookImportDialog({
  open,
  onOpenChange,
  onSuccessImport,
}: BookImportDialogProps) {
  const [selectedFile, setSelectedFile] = useState<string | null>(
    "katalog_buku_oktober_2024.xlsx"
  );
  const [isProcessing, setIsProcessing] = useState(false);

  const handleDownloadTemplate = () => {
    toast.success("Mengunduh template standar: Template_Katalog_SIPUS.xlsx");
  };

  const handleFileDrop = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      setSelectedFile(e.dataTransfer.files[0].name);
      toast.info(`File ${e.dataTransfer.files[0].name} berhasil dibaca.`);
    }
  };

  const handleConfirmImport = () => {
    setIsProcessing(true);
    setTimeout(() => {
      setIsProcessing(false);
      onOpenChange(false);
      toast.success("Berhasil mengimpor 4 data buku baru ke dalam katalog perpustakaan.");
      if (onSuccessImport) onSuccessImport();
    }, 700);
  };

  return (
    <ModalDialog
      open={open}
      onOpenChange={onOpenChange}
      size="lg"
      icon={<UploadCloud className="w-4 h-4" />}
      title="Impor Katalog Buku via Spreadsheet"
      description="Unggah file format .xlsx atau .csv sesuai template perpustakaan"
      footer={
        <>
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={() => onOpenChange(false)}
            className="text-xs font-semibold text-slate-600 hover:bg-slate-200/60"
          >
            Batal
          </Button>
          <Button
            type="button"
            size="sm"
            disabled={isProcessing}
            onClick={handleConfirmImport}
            className="text-xs font-bold text-white bg-emerald-800 hover:bg-emerald-900 shadow-xs cursor-pointer"
          >
            {isProcessing ? "Mengimpor..." : "Konfirmasi Impor"}
          </Button>
        </>
      }
    >
      <div className="p-6 space-y-4 text-xs">
        {/* Drag & Drop Area */}
        <div
          onDragOver={(e) => e.preventDefault()}
          onDrop={handleFileDrop}
          className="border-2 border-dashed border-emerald-300/80 bg-emerald-50/30 hover:bg-emerald-50/60 transition-colors rounded-xl p-6 text-center cursor-pointer select-none"
        >
          <div className="mx-auto w-10 h-10 rounded-full bg-emerald-100 text-emerald-700 flex items-center justify-center mb-2">
            <FileSpreadsheet className="w-5 h-5" />
          </div>
          <p className="text-xs font-bold text-slate-800">
            Tarik & letakkan file .xlsx / .csv di sini
          </p>
          <p className="text-[11px] text-slate-500 mt-0.5">
            atau klik untuk memilih file dari komputer (Maks 10MB)
          </p>
          <button
            type="button"
            onClick={handleDownloadTemplate}
            className="inline-block mt-3 text-[11px] font-semibold text-emerald-800 underline hover:text-emerald-900 cursor-pointer"
          >
            Unduh Template Standar SIPUS (.xlsx)
          </button>
        </div>

        {/* Preview Data Spreadsheet */}
        <div>
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-bold text-slate-800">
              Preview Data Spreadsheet (3 Sampel Terdeteksi)
            </span>
            <span className="text-[11px] text-slate-500">
              File: <strong className="text-slate-700">{selectedFile}</strong>
            </span>
          </div>

          <div className="border border-slate-200 rounded-lg overflow-x-auto text-[11px]">
            <table className="w-full text-left">
              <thead className="bg-slate-100 text-slate-700 font-bold border-b border-slate-200">
                <tr>
                  <th className="py-2 px-3">Kode Buku</th>
                  <th className="py-2 px-3">Judul Buku</th>
                  <th className="py-2 px-3">ISBN</th>
                  <th className="py-2 px-3">Pengarang</th>
                  <th className="py-2 px-3">Lokasi Rak</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 font-medium text-slate-600">
                {SAMPLE_SPREADSHEET_PREVIEW.map((item, idx) => (
                  <tr
                    key={idx}
                    className={item.isValid ? "" : "bg-amber-50/50"}
                  >
                    <td className="py-2 px-3 font-mono">{item.code}</td>
                    <td className="py-2 px-3 font-semibold text-slate-800">
                      {item.title}
                    </td>
                    <td className="py-2 px-3 font-mono">{item.isbn}</td>
                    <td className="py-2 px-3">{item.author}</td>
                    <td
                      className={`py-2 px-3 ${
                        item.isValid
                          ? "text-slate-700"
                          : "text-amber-700 font-bold"
                      }`}
                    >
                      {item.shelf}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Kotak Validasi & Warning */}
        <div className="space-y-2">
          <div className="p-2.5 rounded-lg bg-emerald-50 border border-emerald-200 flex items-center gap-2 text-xs font-semibold text-emerald-800">
            <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
            <span>✓ 4 Data Valid Siap Impor ke database perpustakaan.</span>
          </div>
          <div className="p-2.5 rounded-lg bg-amber-50 border border-amber-200 flex items-center gap-2 text-xs font-medium text-amber-800">
            <AlertTriangle className="w-4 h-4 text-amber-600 shrink-0" />
            <span>
              ⚠️ 1 Data: Penomoran rak belum terdaftar, otomatis dialokasikan ke Rak Sementara.
            </span>
          </div>
        </div>
      </div>
    </ModalDialog>
  );
}
