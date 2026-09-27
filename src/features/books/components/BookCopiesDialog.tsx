"use client";

import { useState, useEffect, FormEvent } from "react";
import { Printer, Trash2, Plus, Layers } from "lucide-react";
import { toast } from "sonner";
import { ModalDialog } from "@/components/ModalDialog";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { BookItem, BookCopyItem } from "../types/books.types";

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
  const [isAddingNew, setIsAddingNew] = useState(false);
  const [newBarcode, setNewBarcode] = useState("");
  const [newRfid, setNewRfid] = useState("");
  const [newRow, setNewRow] = useState("Baris 1");

  useEffect(() => {
    if (book) {
      if (book.copies && book.copies.length > 0) {
        setCopies(book.copies);
      } else {
        const generated: BookCopyItem[] = [
          {
            id: `cp-${book.id}-1`,
            barcode: `BC-${book.code.replace("BK-", "")}-01`,
            rfidTag: "RFID-01",
            shelfRow: `${book.shelfId} - Baris 1`,
            status: "AVAILABLE",
            condition: "Sangat Baik",
          },
        ];
        setCopies(generated);
      }
    }
  }, [book, open]);

  const handleAddCopy = (e: FormEvent) => {
    e.preventDefault();
    if (!book) return;

    const copyNum = copies.length + 1;
    const barcodeCode =
      newBarcode.trim() ||
      `BC-${book.code.replace("BK-", "")}-${copyNum < 10 ? `0${copyNum}` : copyNum}`;

    const newCopy: BookCopyItem = {
      id: `cp-${Date.now()}`,
      barcode: barcodeCode,
      rfidTag: newRfid.trim() || `RFID-0${copyNum}`,
      shelfRow: `${book.shelfId} - ${newRow}`,
      status: "AVAILABLE",
      condition: "Sangat Baik",
    };

    setCopies((prev) => [...prev, newCopy]);
    setIsAddingNew(false);
    setNewBarcode("");
    setNewRfid("");
    toast.success(`Eksemplar baru "${barcodeCode}" berhasil ditambahkan.`);
  };

  const handleDeleteCopy = (id: string, barcode: string) => {
    setCopies((prev) => prev.filter((cp) => cp.id !== id));
    toast.info(`Eksemplar "${barcode}" dihapus dari daftar.`);
  };

  const handlePrintBarcode = (barcode: string) => {
    toast.success(`Memproses pencetakan stiker label & barcode: ${barcode}`);
  };

  const handleSave = () => {
    if (book && onUpdateCopies) {
      onUpdateCopies(book.id, copies);
    }
    toast.success("Perubahan data eksemplar fisik berhasil disimpan.");
    onOpenChange(false);
  };

  if (!book) return null;

  return (
    <ModalDialog
      open={open}
      onOpenChange={onOpenChange}
      size="lg"
      headerBadge={
        <span className="px-2 py-0.5 rounded text-[10px] font-mono font-bold bg-emerald-100 text-emerald-800">
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
            className="text-xs font-semibold text-slate-600 hover:bg-slate-200/60"
          >
            Tutup
          </Button>
          <Button
            type="button"
            size="sm"
            onClick={handleSave}
            className="text-xs font-bold text-white bg-emerald-800 hover:bg-emerald-900 shadow-xs cursor-pointer"
          >
            Simpan Perubahan Eksemplar
          </Button>
        </>
      }
    >
      <div className="p-5 space-y-4 text-xs">
        {/* Sub-header & Action button */}
        <div className="flex items-center justify-between">
          <span className="text-xs text-slate-500 font-medium">
            Daftar Barcode & Kondisi Eksemplar ({copies.length} Total)
          </span>
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={() => setIsAddingNew((prev) => !prev)}
            className="gap-1.5 text-xs font-semibold bg-emerald-50 text-emerald-800 hover:bg-emerald-100 border-emerald-200 cursor-pointer h-7"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>{isAddingNew ? "Batal Tambah" : "+ Tambah Eksemplar Baru"}</span>
          </Button>
        </div>

        {/* Form Tambah Eksemplar Inline */}
        {isAddingNew && (
          <form
            onSubmit={handleAddCopy}
            className="p-3 bg-emerald-50/50 rounded-lg border border-emerald-200/80 space-y-3"
          >
            <div className="font-semibold text-emerald-900 text-xs flex items-center gap-1.5">
              <Layers className="w-3.5 h-3.5 text-emerald-700" />
              <span>Form Eksemplar Baru</span>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
              <Input
                placeholder="Barcode (opsional)"
                value={newBarcode}
                onChange={(e) => setNewBarcode(e.target.value)}
                className="h-8 text-xs bg-white font-mono"
              />
              <Input
                placeholder="Tag RFID (opsional)"
                value={newRfid}
                onChange={(e) => setNewRfid(e.target.value)}
                className="h-8 text-xs bg-white font-mono"
              />
              <select
                value={newRow}
                onChange={(e) => setNewRow(e.target.value)}
                className="h-8 text-xs px-2 rounded-lg border border-slate-200 bg-white"
              >
                <option value="Baris 1">Baris 1</option>
                <option value="Baris 2">Baris 2</option>
                <option value="Baris 3">Baris 3</option>
                <option value="Baris 4">Baris 4</option>
              </select>
            </div>
            <div className="flex justify-end gap-2">
              <Button
                type="submit"
                size="sm"
                className="h-7 text-xs bg-emerald-700 hover:bg-emerald-800 text-white font-bold"
              >
                Tambahkan ke Daftar
              </Button>
            </div>
          </form>
        )}

        {/* Table Eksemplar */}
        <div className="border border-slate-200 rounded-lg overflow-hidden flex flex-col">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs min-w-[550px]">
              <thead className="bg-slate-50 text-slate-600 font-semibold border-b border-slate-200">
                <tr>
                  <th className="py-2.5 px-3">Nomor Barcode Fisik</th>
                  <th className="py-2.5 px-3">Lokasi Baris Rak</th>
                  <th className="py-2.5 px-3">Status Eksemplar</th>
                  <th className="py-2.5 px-3">Kondisi Buku</th>
                  <th className="py-2.5 px-3 text-right">Aksi</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 font-medium">
                {copies.map((copy) => {
                  const isAvailable = copy.status === "AVAILABLE";
                  const isBorrowed = copy.status === "BORROWED";

                  return (
                    <tr
                      key={copy.id}
                      className="hover:bg-slate-50/80 transition-colors"
                    >
                      <td className="py-2.5 px-3">
                        <div className="flex items-center gap-1.5">
                          <span className="font-mono font-bold text-slate-900 bg-slate-100 px-2 py-0.5 rounded border border-slate-200">
                            {copy.barcode}
                          </span>
                          {copy.rfidTag && (
                            <span className="text-[10px] text-emerald-700 bg-emerald-50 px-1.5 py-0.5 rounded font-semibold border border-emerald-100">
                              {copy.rfidTag}
                            </span>
                          )}
                        </div>
                      </td>
                      <td className="py-2.5 px-3 text-slate-700">
                        {copy.shelfRow}
                      </td>
                      <td className="py-2.5 px-3">
                        {isAvailable && (
                          <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-emerald-700">
                            <span className="w-1.5 h-1.5 rounded-full bg-emerald-600" />
                            Tersedia di Rak
                          </span>
                        )}
                        {isBorrowed && (
                          <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-blue-700">
                            <span className="w-1.5 h-1.5 rounded-full bg-blue-600" />
                            Dipinjam {copy.borrowerName ? `(${copy.borrowerName})` : ""}
                          </span>
                        )}
                        {!isAvailable && !isBorrowed && (
                          <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-rose-700">
                            <span className="w-1.5 h-1.5 rounded-full bg-rose-600" />
                            {copy.status}
                          </span>
                        )}
                      </td>
                      <td className="py-2.5 px-3">
                        <Badge
                          variant={
                            copy.condition === "Sangat Baik"
                              ? "success"
                              : copy.condition === "Baik"
                              ? "info"
                              : "warning"
                          }
                          size="sm"
                          className="text-[10px] font-semibold"
                        >
                          {copy.condition}
                        </Badge>
                      </td>
                      <td className="py-2.5 px-3 text-right">
                        <div className="inline-flex items-center gap-1">
                          <Button
                            type="button"
                            variant="ghost"
                            size="icon-xs"
                            onClick={() => handlePrintBarcode(copy.barcode)}
                            title="Cetak Barcode"
                            className="text-slate-600 hover:text-emerald-700"
                          >
                            <Printer className="w-4 h-4" />
                          </Button>
                          <Button
                            type="button"
                            variant="ghost"
                            size="icon-xs"
                            onClick={() =>
                              handleDeleteCopy(copy.id, copy.barcode)
                            }
                            title="Hapus Eksemplar"
                            className="text-slate-400 hover:text-rose-600"
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
