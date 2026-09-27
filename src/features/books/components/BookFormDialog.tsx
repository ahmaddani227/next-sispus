"use client";

import { BookOpen, AlertCircle } from "lucide-react";
import { ModalDialog } from "@/components/ModalDialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { SearchableSelect } from "@/components/ui/searchable-select";
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@/components/ui/select";
import { cn } from "@/lib/utils";
import { BookItem, BookFormData } from "../types/books.types";
import {
  SHELF_OPTIONS,
  PUBLISHER_OPTIONS,
  CATEGORY_TAG_OPTIONS,
  YEAR_OPTIONS,
} from "../constants/books-data";
import { useBookForm } from "../hooks/useBookForm";

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
  const {
    isEditing,
    register,
    errors,
    isSubmitting,
    selectedCategories,
    selectedPublisher,
    selectedShelfId,
    selectedYear,
    toggleCategory,
    setPublisher,
    setShelfId,
    setPublicationYear,
    onSubmit,
  } = useBookForm({ open, bookToEdit, onSave, onOpenChange });

  return (
    <ModalDialog
      open={open}
      onOpenChange={onOpenChange}
      size="lg"
      icon={<BookOpen className="w-4 h-4" />}
      title={
        isEditing
          ? `Edit Data Buku: ${bookToEdit?.title}`
          : "Tambah Katalog Buku Baru"
      }
      description="Lengkapi informasi bibliografi buku sesuai struktur tabel books pada basis data"
    >
      <form onSubmit={onSubmit} className="p-6 space-y-4.5 text-xs">
        {/* Field 1: Judul Buku (title - VARCHAR(500) NOT NULL) */}
        <div className="space-y-1.5">
          <Label htmlFor="title" className="text-xs font-semibold text-slate-700">
            Judul Buku <span className="text-rose-500">*</span>
          </Label>
          <Input
            id="title"
            {...register("title")}
            placeholder="Masukkan judul buku lengkap..."
            className={cn(
              "text-xs h-9 bg-white",
              errors.title && "border-rose-400 focus-visible:ring-rose-400/20"
            )}
          />
          {errors.title && (
            <p className="flex items-center gap-1 text-[11px] font-medium text-rose-600">
              <AlertCircle className="w-3.5 h-3.5 shrink-0" />
              {errors.title.message}
            </p>
          )}
        </div>

        {/* Field 2 & 3: Pengarang (author) & Penerbit (publishers) */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="space-y-1.5">
            <Label htmlFor="author" className="text-xs font-semibold text-slate-700">
              Pengarang / Penulis <span className="text-slate-400 font-normal">(Opsional)</span>
            </Label>
            <Input
              id="author"
              {...register("author")}
              placeholder="Contoh: Drs. H. Ahmad Muhaimin"
              className="text-xs h-9 bg-white"
            />
            {errors.author && (
              <p className="text-[11px] font-medium text-rose-600">
                {errors.author.message}
              </p>
            )}
          </div>

          <div className="space-y-1.5">
            <Label htmlFor="publisher" className="text-xs font-semibold text-slate-700">
              Penerbit Buku <span className="text-slate-400 font-normal">(Opsional)</span>
            </Label>
            <SearchableSelect
              id="publisher"
              value={selectedPublisher}
              onChange={setPublisher}
              options={PUBLISHER_OPTIONS}
              placeholder="Pilih mitra penerbit..."
              searchPlaceholder="Cari penerbit buku..."
              emptyText="Penerbit belum terdaftar di Data Master."
              hasError={Boolean(errors.publisher)}
            />
            {errors.publisher && (
              <p className="text-[11px] font-medium text-rose-600">
                {errors.publisher.message}
              </p>
            )}
          </div>
        </div>

        {/* Field 4 & 5: Edisi (edition) & Tahun Terbit via Shadcn Select (publication_year) */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="space-y-1.5">
            <Label htmlFor="edition" className="text-xs font-semibold text-slate-700">
              Edisi / Cetakan <span className="text-slate-400 font-normal">(Opsional)</span>
            </Label>
            <Input
              id="edition"
              {...register("edition")}
              placeholder="Contoh: Cetakan ke-2 / Edisi Revisi"
              className="text-xs h-9 bg-white"
            />
            {errors.edition && (
              <p className="text-[11px] font-medium text-rose-600">
                {errors.edition.message}
              </p>
            )}
          </div>

          <div className="space-y-1.5">
            <Label htmlFor="publicationYear" className="text-xs font-semibold text-slate-700">
              Tahun Terbit <span className="text-slate-400 font-normal">(Opsional)</span>
            </Label>
            <Select
              value={selectedYear ? String(selectedYear) : ""}
              onValueChange={(val) => setPublicationYear(val ? Number(val) : null)}
            >
              <SelectTrigger
                id="publicationYear"
                className={cn(
                  "w-full h-9 text-xs bg-white",
                  errors.publicationYear && "border-destructive focus-visible:ring-destructive"
                )}
              >
                <SelectValue placeholder="Pilih tahun terbit..." />
              </SelectTrigger>
              <SelectContent>
                {YEAR_OPTIONS.map((yr) => (
                  <SelectItem key={yr} value={String(yr)}>
                    Tahun {yr}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            {errors.publicationYear && (
              <p className="text-[11px] font-medium text-rose-600">
                {errors.publicationYear.message}
              </p>
            )}
          </div>
        </div>

        {/* Field 6: Lokasi Rak Fisik Searchable Dropdown (shelves) */}
        <div className="space-y-1.5">
          <Label htmlFor="shelf" className="text-xs font-semibold text-slate-700">
            Lokasi Rak Fisik <span className="text-rose-500">*</span>
          </Label>
          <SearchableSelect
            id="shelf"
            value={selectedShelfId}
            onChange={setShelfId}
            options={SHELF_OPTIONS}
            placeholder="Pilih lokasi penempatan rak fisik..."
            searchPlaceholder="Cari kode atau kategori rak..."
            emptyText="Lokasi rak tidak ditemukan."
            hasError={Boolean(errors.shelfId)}
          />
          {errors.shelfId && (
            <p className="text-[11px] font-medium text-rose-600">
              {errors.shelfId.message}
            </p>
          )}
        </div>

        {/* Field 7: Kategori Buku Multi-Tag (book_category_assignments) */}
        <div className="space-y-1.5">
          <div className="flex items-center justify-between">
            <Label className="text-xs font-semibold text-slate-700">
              Kategori Buku <span className="text-rose-500">*</span>
            </Label>
            <span className="text-[11px] text-slate-500">
              {selectedCategories.length} kategori dipilih
            </span>
          </div>
          <div
            className={cn(
              "flex flex-wrap gap-2 p-2.5 bg-slate-50 rounded-lg border transition-colors",
              errors.categories
                ? "border-rose-400 bg-rose-50/40"
                : "border-slate-200"
            )}
          >
            {CATEGORY_TAG_OPTIONS.map((cat) => {
              const isSelected = selectedCategories.includes(cat);
              return (
                <label
                  key={cat}
                  className={cn(
                    "inline-flex items-center gap-1.5 px-2.5 py-1 rounded text-xs font-medium cursor-pointer transition-colors shadow-2xs select-none",
                    isSelected
                      ? "bg-white border border-emerald-300 text-emerald-800 font-semibold"
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
          {errors.categories && (
            <p className="flex items-center gap-1 text-[11px] font-medium text-rose-600">
              <AlertCircle className="w-3.5 h-3.5 shrink-0" />
              {errors.categories.message}
            </p>
          )}
        </div>

        {/* Footer Actions */}
        <div className="pt-4 border-t border-slate-100 flex items-center justify-end gap-2.5">
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={() => onOpenChange(false)}
            className="text-xs font-semibold text-slate-600 hover:bg-slate-100 cursor-pointer"
          >
            Batal
          </Button>
          <Button
            type="submit"
            size="sm"
            disabled={isSubmitting}
            className="text-xs font-bold text-white bg-emerald-800 hover:bg-emerald-900 shadow-xs cursor-pointer"
          >
            Simpan Data Buku
          </Button>
        </div>
      </form>
    </ModalDialog>
  );
}
