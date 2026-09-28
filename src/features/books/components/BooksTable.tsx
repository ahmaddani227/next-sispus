"use client";

import { RotateCcw } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Table,
  TableHeader,
  TableBody,
  TableHead,
  TableRow,
  TableCell,
} from "@/components/ui/table";
import {
  TableCard,
  TableCardHeader,
  TableEmptyState,
  TablePagination,
} from "@/components/TableCard";
import { cn } from "@/lib/utils";
import { BookItem } from "../types/books.types";

interface BooksTableProps {
  books: BookItem[];
  totalAll: number;
  onEdit: (book: BookItem) => void;
  onOpenCopies: (book: BookItem) => void;
  onToggleStatus: (book: BookItem) => void;
  onResetFilter: () => void;
}

export function BooksTable({
  books,
  totalAll,
  onEdit,
  onOpenCopies,
  onToggleStatus,
  onResetFilter,
}: BooksTableProps) {
  return (
    <TableCard>
      {/* Table Header Section */}
      <TableCardHeader
        title="Daftar Katalog Buku & Eksemplar"
        description="Kelola informasi bibliografi, ketersediaan stok fisik di rak, dan status aktivasi buku."
        actions={
          <div className="text-xs font-semibold text-slate-500 dark:text-muted-foreground">
            Total:{" "}
            <span className="text-emerald-800 dark:text-emerald-400 font-bold">
              {books.length}
            </span>{" "}
            Judul Terkatalog
          </div>
        }
      />

      {/* Table Content */}
      <div className="overflow-x-auto relative">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-12 text-center">NO</TableHead>
              <TableHead className="w-44">Kode Buku & Isbn</TableHead>
              <TableHead>JUDUL BUKU & KATEGORI</TableHead>
              <TableHead className="w-44">LOKASI RAK</TableHead>
              <TableHead className="w-44">STATUS & EKSEMPLAR</TableHead>
              <TableHead className="text-right w-56">AKSI</TableHead>
            </TableRow>
          </TableHeader>

          <TableBody>
            {books.length === 0 ? (
              <TableEmptyState
                asTableRow
                colSpan={6}
                title="Tidak ada buku yang sesuai dengan filter pencarian"
                description="Silakan ubah kata kunci pencarian atau sesuaikan opsi filter status, rak, jenjang, dan kategori."
                action={
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={onResetFilter}
                    className="gap-1.5 text-xs font-semibold text-emerald-800 dark:text-emerald-300 bg-emerald-50 dark:bg-emerald-950/60 hover:bg-emerald-100 dark:hover:bg-emerald-900/60 border-emerald-200 dark:border-emerald-800 cursor-pointer"
                  >
                    <RotateCcw className="w-3.5 h-3.5" />
                    <span>Reset Filter</span>
                  </Button>
                }
              />
            ) : (
              books.map((book, index) => {
                const isInactive = book.status === "inactive";

                return (
                  <TableRow
                    key={book.id}
                    className={cn(
                      "hover:bg-slate-50/80 dark:hover:bg-slate-800/50 transition-colors",
                      isInactive && "bg-slate-50/40 dark:bg-slate-900/40"
                    )}
                  >
                    {/* No */}
                    <TableCell className="text-center font-semibold text-slate-400 dark:text-slate-500">
                      {index + 1}
                    </TableCell>

                    {/* Kode & ISBN */}
                    <TableCell>
                      <div className="flex flex-col gap-0.5">
                        <span
                          className={cn(
                            "font-mono text-xs font-bold px-2 py-0.5 rounded border w-fit",
                            isInactive
                              ? "text-slate-600 dark:text-slate-300 bg-slate-100 dark:bg-slate-800 border-slate-200 dark:border-slate-700"
                              : "text-emerald-800 dark:text-emerald-300 bg-emerald-50 dark:bg-emerald-950/60 border-emerald-200/60 dark:border-emerald-800"
                          )}
                        >
                          {book.code}
                        </span>
                        {book.isbn ? (
                          <span className="text-[11px] text-slate-400 dark:text-slate-500 font-mono">
                            ISBN {book.isbn}
                          </span>
                        ) : (
                          <span className="text-[11px] text-slate-300 dark:text-slate-600 font-mono italic">
                            Tanpa ISBN
                          </span>
                        )}
                      </div>
                    </TableCell>

                    {/* Judul Buku & Kategori */}
                    <TableCell>
                      <div className="flex items-center gap-1.5 flex-wrap">
                        <span className="font-semibold text-slate-900 dark:text-foreground text-sm">
                          {book.title}
                        </span>
                        {book.edition && (
                          <span className="text-[11px] px-1.5 py-0.5 rounded bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 font-medium">
                            {book.edition}
                          </span>
                        )}
                      </div>
                      <div className="flex flex-wrap items-center gap-1.5 mt-1">
                        {book.categories.map((cat) => (
                          <Badge
                            key={cat}
                            variant="outline"
                            size="sm"
                            className="text-[11px] font-medium bg-emerald-50 dark:bg-emerald-950/60 text-emerald-800 dark:text-emerald-300 border-emerald-200 dark:border-emerald-800"
                          >
                            {cat}
                          </Badge>
                        ))}
                        {book.level && (
                          <Badge
                            variant="neutral"
                            size="sm"
                            className="text-[11px] font-medium text-slate-600 dark:text-slate-300"
                          >
                            {book.level}
                          </Badge>
                        )}
                      </div>
                    </TableCell>

                    {/* Lokasi Rak */}
                    <TableCell>
                      <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-slate-100 dark:bg-slate-800 font-medium text-slate-700 dark:text-slate-300 text-[11px]">
                        <span
                          className={cn(
                            "w-1.5 h-1.5 rounded-full",
                            isInactive ? "bg-slate-400 dark:bg-slate-500" : "bg-emerald-600 dark:bg-emerald-400"
                          )}
                        />
                        {book.shelfName || book.shelfId}
                      </span>
                    </TableCell>

                    {/* Status & Eksemplar */}
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <Badge
                          variant={isInactive ? "danger" : "success"}
                          size="sm"
                          className="text-[11px] font-semibold"
                        >
                          {isInactive ? "Nonaktif" : "Aktif"}
                        </Badge>
                        <span className="font-bold text-slate-900 dark:text-foreground text-xs">
                          {book.availableCopies}/{book.totalCopies}{" "}
                          <span className="font-normal text-slate-500 dark:text-muted-foreground text-[11px]">
                            Eks
                          </span>
                        </span>
                      </div>
                      <div
                        className={cn(
                          "text-[11px] font-medium mt-0.5",
                          isInactive ? "text-slate-400 dark:text-slate-500" : "text-emerald-700 dark:text-emerald-400"
                        )}
                      >
                        {book.availableCopies} Tersedia • {book.borrowedCopies} Pinjam
                      </div>
                    </TableCell>

                    {/* Aksi */}
                    <TableCell className="text-right">
                      <div className="inline-flex items-center justify-end gap-1.5">
                        <Button
                          type="button"
                          variant="outline"
                          size="sm"
                          onClick={() => onEdit(book)}
                          className="h-7 px-2.5 py-1 text-xs font-medium text-slate-700 hover:text-emerald-700 hover:bg-emerald-50 border-slate-200 dark:text-slate-300 dark:border-slate-700 dark:hover:bg-emerald-950/50 dark:hover:text-emerald-400 cursor-pointer"
                        >
                          Edit
                        </Button>
                        <Button
                          type="button"
                          variant="secondary"
                          size="sm"
                          onClick={() => onOpenCopies(book)}
                          className="h-7 px-2.5 py-1 text-xs font-medium text-emerald-800 bg-emerald-50 hover:bg-emerald-100 border border-emerald-200 dark:text-emerald-300 dark:bg-emerald-950/60 dark:hover:bg-emerald-900/60 dark:border-emerald-800 cursor-pointer"
                        >
                          Eksemplar
                        </Button>
                        <Button
                          type="button"
                          size="sm"
                          onClick={() => onToggleStatus(book)}
                          className={cn(
                            "h-7 px-2.5 py-1 text-xs font-medium rounded border cursor-pointer transition-colors",
                            isInactive
                              ? "text-rose-700 bg-rose-50 hover:bg-rose-100 border-rose-200 dark:text-rose-300 dark:bg-rose-950/50 dark:hover:bg-rose-900/50 dark:border-rose-900"
                              : "text-emerald-700 bg-emerald-50 hover:bg-emerald-100 border-emerald-300 dark:text-emerald-300 dark:bg-emerald-950/60 dark:hover:bg-emerald-900/60 dark:border-emerald-800"
                          )}
                        >
                          {isInactive ? "Aktifkan" : "Nonaktifkan"}
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                );
              })
            )}
          </TableBody>
        </Table>
      </div>

      {/* Pagination Footer */}
      <TablePagination
        currentCount={books.length}
        totalCount={totalAll}
        itemLabel="buku"
      />
    </TableCard>
  );
}
