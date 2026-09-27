"use client";

import { useState, useEffect, FormEvent } from "react";
import { BookOpen } from "lucide-react";
import { ModalDialog } from "@/components/ModalDialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { cn } from "@/lib/utils";
import { BookItem, BookFormData } from "../types/books.types";
import { SHELF_OPTIONS, CATEGORY_TAG_OPTIONS } from "../constants/books-data";

interface BookFormDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  bookToEdit: BookItem | null;
  onSave: (formData: BookFormData) => void;
}

export function BookFormDialog({
  open,
  onOpenChange,
  bookToEdit,
  onSave,
}: BookFormDialogProps) {
  const isEditing = Boolean(bookToEdit);

  const [formData, setFormData] = useState<BookFormData>({
    code: "",
    isbn: "",
    title: "",
    author: "",
    publisher: "",
    publicationYear: new Date().getFullYear(),
    categories: ["Fiqih"],
    shelfId: "Rak A1",
    pages: "",
    language: "Indonesia",
    synopsis: "",
  });

  useEffect(() => {
    if (bookToEdit) {
      setFormData({
        id: bookToEdit.id,
        code: bookToEdit.code,
        isbn: bookToEdit.isbn,
        title: bookToEdit.title,
        author: bookToEdit.author,
        publisher: bookToEdit.publisher,
        publicationYear: bookToEdit.publicationYear,
        categories: bookToEdit.categories,
        shelfId: bookToEdit.shelfId,
        pages: bookToEdit.pages || "",
        language: bookToEdit.language || "Indonesia",
        synopsis: bookToEdit.synopsis || "",
      });
    } else {
      setFormData({
        code: `BK-AGM-${Math.floor(1000 + Math.random() * 9000)}`,
        isbn: "978-602-",
        title: "",
        author: "",
        publisher: "",
        publicationYear: new Date().getFullYear(),
        categories: ["Fiqih"],
        shelfId: "Rak A1",
        pages: "",
        language: "Indonesia",
        synopsis: "",
      });
    }
  }, [bookToEdit, open]);

  const toggleCategory = (cat: string) => {
    setFormData((prev) => {
      const exists = prev.categories.includes(cat);
      return {
        ...prev,
        categories: exists
          ? prev.categories.filter((c) => c !== cat)
          : [...prev.categories, cat],
      };
    });
  };

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    if (!formData.title || !formData.code || !formData.isbn) {
      return;
    }
    onSave(formData);
    onOpenChange(false);
  };

  return (
    <ModalDialog
      open={open}
      onOpenChange={onOpenChange}
      size="xl"
      icon={<BookOpen className="w-4 h-4" />}
      title={
        isEditing
          ? `Edit Bibliografi Buku: ${bookToEdit?.code}`
          : "Tambah Katalog Buku Baru"
      }
      description="Lengkapi data katalog dan klasifikasi rak fisik perpustakaan"
    >
      <form onSubmit={handleSubmit} className="p-6 space-y-4 text-xs">
        {/* Row 1: Kode & ISBN */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="space-y-1.5">
            <Label htmlFor="code" className="text-xs font-semibold text-slate-700">
              Nomor Induk / Kode Buku <span className="text-rose-500">*</span>
            </Label>
            <Input
              id="code"
              required
              value={formData.code}
              onChange={(e) =>
                setFormData((prev) => ({ ...prev, code: e.target.value }))
              }
              placeholder="BK-AGM-0183"
              className="font-mono text-xs h-9 bg-white"
            />
          </div>
          <div className="space-y-1.5">
            <Label htmlFor="isbn" className="text-xs font-semibold text-slate-700">
              Nomor ISBN <span className="text-rose-500">*</span>
            </Label>
            <Input
              id="isbn"
              required
              value={formData.isbn}
              onChange={(e) =>
                setFormData((prev) => ({ ...prev, isbn: e.target.value }))
              }
              placeholder="978-602-xxx-xxx"
              className="font-mono text-xs h-9 bg-white"
            />
          </div>
        </div>

        {/* Row 2: Judul Lengkap */}
        <div className="space-y-1.5">
          <Label htmlFor="title" className="text-xs font-semibold text-slate-700">
            Judul Buku Lengkap <span className="text-rose-500">*</span>
          </Label>
          <Input
            id="title"
            required
            value={formData.title}
            onChange={(e) =>
              setFormData((prev) => ({ ...prev, title: e.target.value }))
            }
            placeholder="Masukkan judul buku..."
            className="text-xs h-9 bg-white"
          />
        </div>

        {/* Row 3: Pengarang, Penerbit, Tahun */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div className="space-y-1.5">
            <Label htmlFor="author" className="text-xs font-semibold text-slate-700">
              Pengarang / Penulis <span className="text-rose-500">*</span>
            </Label>
            <Input
              id="author"
              required
              value={formData.author}
              onChange={(e) =>
                setFormData((prev) => ({ ...prev, author: e.target.value }))
              }
              placeholder="Nama penulis..."
              className="text-xs h-9 bg-white"
            />
          </div>
          <div className="space-y-1.5">
            <Label htmlFor="publisher" className="text-xs font-semibold text-slate-700">
              Penerbit
            </Label>
            <Input
              id="publisher"
              value={formData.publisher}
              onChange={(e) =>
                setFormData((prev) => ({ ...prev, publisher: e.target.value }))
              }
              placeholder="Penerbit..."
              className="text-xs h-9 bg-white"
            />
          </div>
          <div className="space-y-1.5">
            <Label htmlFor="year" className="text-xs font-semibold text-slate-700">
              Tahun Terbit
            </Label>
            <Input
              id="year"
              type="number"
              value={formData.publicationYear}
              onChange={(e) =>
                setFormData((prev) => ({
                  ...prev,
                  publicationYear: Number(e.target.value),
                }))
              }
              placeholder="2024"
              className="text-xs h-9 bg-white"
            />
          </div>
        </div>

        {/* Row 4: Multi Kategori */}
        <div className="space-y-1.5">
          <Label className="text-xs font-semibold text-slate-700">
            Pengaturan Multi-Kategori (Pilih Tag)
          </Label>
          <div className="flex flex-wrap gap-2 p-2.5 bg-slate-50 rounded-lg border border-slate-200">
            {CATEGORY_TAG_OPTIONS.map((cat) => {
              const isSelected = formData.categories.includes(cat);
              return (
                <label
                  key={cat}
                  className={cn(
                    "inline-flex items-center gap-1.5 px-2.5 py-1 rounded text-xs font-medium cursor-pointer transition-colors shadow-2xs select-none",
                    isSelected
                      ? "bg-white border border-emerald-300 text-emerald-800"
                      : "bg-white border border-slate-200 text-slate-600 hover:border-slate-300"
                  )}
                >
                  <Checkbox
                    checked={isSelected}
                    onCheckedChange={() => toggleCategory(cat)}
                    className="w-3.5 h-3.5 text-emerald-700"
                  />
                  <span>{cat}</span>
                </label>
              );
            })}
          </div>
        </div>

        {/* Row 5: Lokasi Rak, Halaman, Bahasa */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div className="space-y-1.5">
            <Label htmlFor="shelf" className="text-xs font-semibold text-slate-700">
              Penentuan Lokasi Rak Fisik <span className="text-rose-500">*</span>
            </Label>
            <select
              id="shelf"
              value={formData.shelfId}
              onChange={(e) =>
                setFormData((prev) => ({ ...prev, shelfId: e.target.value }))
              }
              className="w-full text-xs px-3 py-2 border border-slate-200 rounded-lg focus:ring-1 focus:ring-emerald-700 focus:border-emerald-700 bg-white h-9 cursor-pointer"
            >
              {SHELF_OPTIONS.map((sh) => (
                <option key={sh.id} value={sh.id}>
                  {sh.name}
                </option>
              ))}
            </select>
          </div>

          <div className="space-y-1.5">
            <Label htmlFor="pages" className="text-xs font-semibold text-slate-700">
              Jumlah Halaman
            </Label>
            <Input
              id="pages"
              value={formData.pages}
              onChange={(e) =>
                setFormData((prev) => ({ ...prev, pages: e.target.value }))
              }
              placeholder="Contoh: 248 hlm"
              className="text-xs h-9 bg-white"
            />
          </div>

          <div className="space-y-1.5">
            <Label htmlFor="language" className="text-xs font-semibold text-slate-700">
              Bahasa
            </Label>
            <select
              id="language"
              value={formData.language}
              onChange={(e) =>
                setFormData((prev) => ({
                  ...prev,
                  language: e.target.value as BookFormData["language"],
                }))
              }
              className="w-full text-xs px-3 py-2 border border-slate-200 rounded-lg focus:ring-1 focus:ring-emerald-700 focus:border-emerald-700 bg-white h-9 cursor-pointer"
            >
              <option value="Indonesia">Indonesia</option>
              <option value="Arab">Arab</option>
              <option value="Inggris">Inggris</option>
            </select>
          </div>
        </div>

        {/* Row 6: Sinopsis */}
        <div className="space-y-1.5">
          <Label htmlFor="synopsis" className="text-xs font-semibold text-slate-700">
            Sinopsis Ringkas
          </Label>
          <Textarea
            id="synopsis"
            rows={3}
            value={formData.synopsis}
            onChange={(e) =>
              setFormData((prev) => ({ ...prev, synopsis: e.target.value }))
            }
            placeholder="Tuliskan ringkasan pokok materi atau abstrak buku..."
            className="text-xs bg-white resize-y"
          />
        </div>

        <div className="pt-4 border-t border-slate-100 flex items-center justify-end gap-2.5">
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={() => onOpenChange(false)}
            className="text-xs font-semibold text-slate-600 hover:bg-slate-100"
          >
            Batal
          </Button>
          <Button
            type="submit"
            size="sm"
            className="text-xs font-bold text-white bg-emerald-800 hover:bg-emerald-900 shadow-xs cursor-pointer"
          >
            Simpan Bibliografi
          </Button>
        </div>
      </form>
    </ModalDialog>
  );
}
