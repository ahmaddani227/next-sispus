"use client";

import { useState, useEffect } from "react";
import { Printer, Trash2, Plus, Layers, AlertCircle, Clock, Hash } from "lucide-react";
import { toast } from "sonner";
import { ModalDialog } from "@/components/ModalDialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@/components/ui/select";
import { cn } from "@/lib/utils";
import { BookItem, BookCopyItem, BookCopyStatus } from "../types/books.types";

const COPY_STATUS_OPTIONS: {
  value: BookCopyStatus;
  label: string;
  color: string;
  dot: string;
}[] = [
  { value: "AVAILABLE", label: "Tersedia di Rak",    color: "text-emerald-700", dot: "bg-emerald-500" },
  { value: "BORROWED",  label: "Sedang Dipinjam",    color: "text-blue-700",    dot: "bg-blue-500"    },
  { value: "DAMAGED",   label: "Rusak / Perbaikan",  color: "text-amber-700",   dot: "bg-amber-500"   },
  { value: "LOST",      label: "Hilang",             color: "text-rose-700",    dot: "bg-rose-500"    },
];

function getStatusMeta(status: BookCopyStatus) {
  return COPY_STATUS_OPTIONS.find((s) => s.value === status) ?? COPY_STATUS_OPTIONS[0];
}

function generateCopyCode(bookCode: string, index: number): string {
  const suffix = String(index).padStart(3, "0");
  return `EKS-${bookCode.replace("BK-", "")}-${suffix}`;
}

interface BookCopiesDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  book: BookItem | null;
  onUpdateCopies?: (bookId: string, updatedCopies: BookCopyItem[]) => void;
}

export function BookCopiesDialog({
  open,
  onOpenChange,
  book,
  onUpdateCopies,
}: BookCopiesDialogProps) {
  const [copies, setCopies] = useState<BookCopyItem[]>([]);

  // Form state tambah eksemplar
  const [isAddingNew, setIsAddingNew] = useState(false);
  const [formCopyCode, setFormCopyCode] = useState("");
  const [formStatus, setFormStatus] = useState<BookCopyStatus>("AVAILABLE");
  const [formError, setFormError] = useState("");

  // Sinkronisasi data saat modal dibuka
  useEffect(() => {
    if (open && book) {
      if (book.copies && book.copies.length > 0) {
        setCopies(book.copies);
      } else {
        // Satu eksemplar default saat belum ada data
        setCopies([
          {
            id: `cp-${book.id}-1`,
            bookId: book.id,
            copyCode: generateCopyCode(book.code, 1),
            status: "AVAILABLE",
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString(),
          },
        ]);
      }
      // Reset form tambah
      setIsAddingNew(false);
      setFormCopyCode("");
      setFormStatus("AVAILABLE");
      setFormError("");
    }
  }, [book, open]);

  const handleAddCopy = () => {
    if (!book) return;

    const code = formCopyCode.trim();

    // Validasi: copy_code wajib diisi
    if (!code) {
      setFormError("Kode eksemplar (copy_code) wajib diisi.");
      return;
    }

    if (code.length > 100) {
      setFormError("Kode eksemplar maksimal 100 karakter.");
      return;
    }

    if (copies.some((c) => c.copyCode.toLowerCase() === code.toLowerCase())) {
      setFormError(`Kode eksemplar "${code}" sudah terdaftar. Gunakan kode unik lain.`);
      return;
    }

    const now = new Date().toISOString();
    const newCopy: BookCopyItem = {
      id: `cp-${Date.now()}`,
      bookId: book.id,
      copyCode: code,
      status: formStatus,
      createdAt: now,
      updatedAt: now,
    };

    setCopies((prev) => [...prev, newCopy]);
    setIsAddingNew(false);
    setFormCopyCode("");
    setFormStatus("AVAILABLE");
    setFormError("");
    toast.success(`Eksemplar "${code}" berhasil ditambahkan ke daftar.`);
  };

 const handleChangeStatus = (id: string, newStatus: BookCopyStatus) => {
    setCopies((prev) =>
      prev.map((c) =>
        c.id === id
          ? { ...c, status: newStatus, updatedAt: new Date().toISOString() }
          : c
      )
    );
  };

  const handleDeleteCopy = (id: string, copyCode: string) => {
    setCopies((prev) => prev.filter((c) => c.id !== id));
    toast.info(`Eksemplar "${copyCode}" dihapus dari daftar.`);
  };

  const handlePrintLabel = (copyCode: string) => {
    toast.success(`Memproses pencetakan label kode eksemplar: ${copyCode}`);
  };

 const handleSave = () => {
    if (book && onUpdateCopies) {
      onUpdateCopies(book.id, copies);
    }
    toast.success("Data eksemplar fisik berhasil disimpan.");
    onOpenChange(false);
  };

  if (!book) return null;

  // Ringkasan status
  const countByStatus = (status: BookCopyStatus) =>
    copies.filter((c) => c.status === status).length;

  return (
    <ModalDialog
      open={open}
      onOpenChange={onOpenChange}
      size="lg"
      icon={<Layers className="w-4 h-4" />}
      headerBadge={
        <span className="px-2 py-0.5 rounded text-xs font-mono font-bold bg-emerald-100 dark:bg-emerald-950/70 text-emerald-800 dark:text-emerald-300">
          {book.code}
        </span>
      }
      title="Kelola Eksemplar Fisik"
      description={book.title}
      footer={
        <>
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={() => onOpenChange(false)}
            className="text-xs font-semibold text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800"
          >
            Tutup
          </Button>
          <Button
            type="button"
            size="sm"
            onClick={handleSave}
            className="text-xs font-bold text-white bg-emerald-800 hover:bg-emerald-900 shadow-xs cursor-pointer"
          >
            Simpan Perubahan
          </Button>
        </>
      }
    >
      <div className="p-5 space-y-4 text-xs">

       <div className="grid grid-cols-4 gap-2">
          {COPY_STATUS_OPTIONS.map((s) => (
            <div
              key={s.value}
              className="flex flex-col items-center justify-center p-2 rounded-lg border border-slate-200 dark:border-border bg-slate-50 dark:bg-slate-900/60 gap-0.5"
            >
              <span className={cn("text-lg font-bold", s.color)}>
                {countByStatus(s.value)}
              </span>
              <span className="text-xs text-slate-500 dark:text-muted-foreground text-center leading-tight">{s.label}</span>
            </div>
          ))}
        </div>

        <div className="flex items-center justify-between">
          <span className="text-xs text-slate-500 dark:text-muted-foreground font-medium">
            Daftar Eksemplar Fisik ({copies.length} total)
          </span>
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={() => {
              setIsAddingNew((prev) => !prev);
              setFormError("");
              setFormCopyCode("");
              setFormStatus("AVAILABLE");
            }}
            className="gap-1.5 text-xs font-semibold bg-emerald-50 dark:bg-emerald-950/60 text-emerald-800 dark:text-emerald-300 hover:bg-emerald-100 dark:hover:bg-emerald-900/60 border-emerald-200 dark:border-emerald-800 cursor-pointer h-7"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>{isAddingNew ? "Batal Tambah" : "Tambah Eksemplar"}</span>
          </Button>
        </div>

        {isAddingNew && (
          <div className="p-3.5 bg-emerald-50/60 dark:bg-emerald-950/40 rounded-lg border border-emerald-200/80 dark:border-emerald-800/80 space-y-3">
            <div className="font-semibold text-emerald-900 dark:text-emerald-300 text-xs flex items-center gap-1.5">
              <Hash className="w-3.5 h-3.5 text-emerald-700 dark:text-emerald-400" />
              <span>Tambah Eksemplar Baru</span>
            </div>

            {/* copy_code & status — sesuai kolom DB */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
              {/* copy_code — VARCHAR(100) NOT NULL UNIQUE */}
              <div className="space-y-1">
                <Label className="text-[11px] font-semibold text-slate-700 dark:text-slate-200">
                  Kode Eksemplar <span className="text-rose-500">*</span>
                </Label>
                <Input
                  placeholder={`Contoh: ${generateCopyCode(book.code, copies.length + 1)}`}
                  value={formCopyCode}
                  onChange={(e) => {
                    setFormCopyCode(e.target.value);
                    if (formError) setFormError("");
                  }}
                  className={cn(
                    "h-8 text-xs bg-white dark:bg-slate-900 border-slate-200 dark:border-border dark:text-slate-100 font-mono",
                    formError && "border-rose-400 focus-visible:ring-rose-400/20"
                  )}
                  maxLength={100}
                />
                {formError && (
                  <p className="flex items-center gap-1 text-[11px] font-medium text-rose-600">
                    <AlertCircle className="w-3.5 h-3.5 shrink-0" />
                    {formError}
                  </p>
                )}
              </div>

              {/* status — book_copy_status ENUM */}
              <div className="space-y-1">
                <Label className="text-[11px] font-semibold text-slate-700 dark:text-slate-200">
                  Status Eksemplar <span className="text-rose-500">*</span>
                  <span className="ml-1 text-slate-400 dark:text-slate-500 font-normal">(status)</span>
                </Label>
                <Select
                  value={formStatus}
                  onValueChange={(val) => setFormStatus(val as BookCopyStatus)}
                >
                  <SelectTrigger className="h-8 text-xs bg-white dark:bg-slate-900 border-slate-200 dark:border-border dark:text-slate-100">
                    <SelectValue placeholder="Pilih status..." />
                  </SelectTrigger>
                  <SelectContent>
                    {COPY_STATUS_OPTIONS.map((s) => (
                      <SelectItem key={s.value} value={s.value} className="text-xs">
                        <span className="flex items-center gap-2">
                          <span className={cn("w-2 h-2 rounded-full inline-block shrink-0", s.dot)} />
                          {s.label}
                        </span>
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="flex justify-end">
              <Button
                type="button"
                size="sm"
                onClick={handleAddCopy}
                className="h-7 text-xs bg-emerald-700 hover:bg-emerald-800 text-white font-bold"
              >
                Tambahkan ke Daftar
              </Button>
            </div>
          </div>
        )}

        <div className="border border-slate-200 dark:border-border rounded-lg overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs min-w-[520px]">
              <thead className="bg-slate-50 dark:bg-slate-900/60 text-slate-600 dark:text-muted-foreground font-semibold border-b border-slate-200 dark:border-border">
                <tr>
                  <th className="py-2.5 px-3 text-slate-500 dark:text-muted-foreground font-medium">#</th>
                  {/* copy_code — kolom utama DB */}
                  <th className="py-2.5 px-3">
                    <span className="flex items-center gap-1">
                      <Hash className="w-3 h-3" />
                      Kode Eksemplar
                      <span className="text-[10px] text-slate-400 dark:text-slate-500 font-normal ml-0.5">(copy_code)</span>
                    </span>
                  </th>
                  {/* status — enum DB */}
                  <th className="py-2.5 px-3">Status</th>
                  {/* created_at */}
                  <th className="py-2.5 px-3">
                    <span className="flex items-center gap-1">
                      <Clock className="w-3 h-3" />
                      Ditambahkan
                    </span>
                  </th>
                  <th className="py-2.5 px-3 text-right">Aksi</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-800/60 font-medium">
                {copies.length === 0 && (
                  <tr>
                    <td colSpan={5} className="py-8 text-center text-slate-400 dark:text-slate-500">
                      Belum ada eksemplar terdaftar.
                    </td>
                  </tr>
                )}
                {copies.map((copy, idx) => {
                  const meta = getStatusMeta(copy.status);
                  const createdLabel = copy.createdAt
                    ? new Date(copy.createdAt).toLocaleDateString("id-ID", {
                        day: "2-digit",
                        month: "short",
                        year: "numeric",
                      })
                    : "—";

                  return (
                    <tr
                      key={copy.id}
                      className="hover:bg-slate-50/80 dark:hover:bg-slate-800/50 transition-colors"
                    >
                      {/* Nomor urut */}
                      <td className="py-2.5 px-3 text-slate-400 dark:text-slate-500 tabular-nums">
                        {idx + 1}
                      </td>

                      {/* copy_code */}
                      <td className="py-2.5 px-3">
                        <span className="font-mono font-bold text-slate-800 dark:text-slate-200 bg-slate-100 dark:bg-slate-800 px-2 py-0.5 rounded border border-slate-200 dark:border-slate-700 text-[11px]">
                          {copy.copyCode}
                        </span>
                      </td>

                      {/* status — dengan inline-select untuk ubah langsung */}
                      <td className="py-2.5 px-3">
                        <Select
                          value={copy.status}
                          onValueChange={(val) =>
                            handleChangeStatus(copy.id, val as BookCopyStatus)
                          }
                        >
                          <SelectTrigger
                            className={cn(
                              "h-6 text-[11px] font-semibold border-none shadow-none bg-transparent px-0 gap-1 w-auto focus:ring-0",
                              meta.color
                            )}
                          >
                            <span className={cn("w-1.5 h-1.5 rounded-full inline-block shrink-0", meta.dot)} />
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            {COPY_STATUS_OPTIONS.map((s) => (
                              <SelectItem key={s.value} value={s.value} className="text-xs">
                                <span className="flex items-center gap-2">
                                  <span className={cn("w-2 h-2 rounded-full inline-block shrink-0", s.dot)} />
                                  {s.label}
                                </span>
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </td>

                      {/* created_at */}
                      <td className="py-2.5 px-3 text-slate-500 dark:text-muted-foreground tabular-nums">
                        {createdLabel}
                      </td>

                      {/* Aksi */}
                      <td className="py-2.5 px-3 text-right">
                        <div className="inline-flex items-center gap-1">
                          <Button
                            type="button"
                            variant="ghost"
                            size="icon-xs"
                            onClick={() => handlePrintLabel(copy.copyCode)}
                            title="Cetak Label Kode Eksemplar"
                            className="text-slate-500 hover:text-emerald-700 dark:text-slate-400 dark:hover:text-emerald-400"
                          >
                            <Printer className="w-4 h-4" />
                          </Button>
                          <Button
                            type="button"
                            variant="ghost"
                            size="icon-xs"
                            onClick={() => handleDeleteCopy(copy.id, copy.copyCode)}
                            title="Hapus Eksemplar"
                            className="text-slate-400 hover:text-rose-600 dark:hover:text-rose-400"
                          >
                            <Trash2 className="w-4 h-4" />
                          </Button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </ModalDialog>
  );
}
