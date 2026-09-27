"use client";

import { Search, UploadCloud, RotateCcw } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { BookFilterState } from "../types/books.types";

interface BookFilterBarProps {
  filters: BookFilterState;
  onFilterChange: (newFilters: Partial<BookFilterState>) => void;
  onResetFilter: () => void;
  onOpenImportModal: () => void;
}

export function BookFilterBar({
  filters,
  onFilterChange,
  onResetFilter,
  onOpenImportModal,
}: BookFilterBarProps) {
  return (
    <Card className="p-4 space-y-3 bg-white dark:bg-card border-slate-200 dark:border-border shadow-xs">
      {/* Row 1: Search Bar & Import Action */}
      <div className="flex flex-col md:flex-row gap-3 items-stretch md:items-center justify-between">
        <div className="relative flex-1">
          <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400 dark:text-slate-500">
            <Search className="w-4 h-4" />
          </div>
          <input
            type="text"
            value={filters.search}
            onChange={(e) => onFilterChange({ search: e.target.value })}
            placeholder="Cari judul, ISBN, pengarang, penerbit, atau kategori..."
            className="w-full pl-10 pr-4 py-2 text-xs text-slate-800 dark:text-foreground bg-slate-50/70 dark:bg-slate-900/60 rounded-lg border border-slate-200 dark:border-border focus:bg-white dark:focus:bg-card focus:outline-none focus:ring-2 focus:ring-emerald-700/20 focus:border-emerald-700 placeholder-slate-400 dark:placeholder-slate-500 transition-colors"
          />
        </div>

        <Button
          type="button"
          variant="outline"
          size="sm"
          onClick={onOpenImportModal}
          className="gap-2 border-emerald-700/60 dark:border-emerald-600 text-emerald-800 dark:text-emerald-400 hover:bg-emerald-50 dark:hover:bg-emerald-950/50 hover:text-emerald-900 dark:hover:text-emerald-300 font-bold shrink-0 cursor-pointer"
        >
          <UploadCloud className="w-4 h-4 text-emerald-700 dark:text-emerald-400" />
          <span>Impor Excel/CSV</span>
        </Button>
      </div>

      {/* Row 2: Filter Selects & Reset */}
      <div className="grid grid-cols-2 md:grid-cols-5 gap-2.5 pt-1">
        <div>
          <select
            value={filters.status}
            onChange={(e) =>
              onFilterChange({
                status: e.target.value as BookFilterState["status"],
              })
            }
            className="w-full py-1.5 px-3 text-xs bg-white dark:bg-slate-900 border border-slate-200 dark:border-border rounded-lg text-slate-700 dark:text-slate-200 focus:outline-none focus:ring-1 focus:ring-emerald-700 focus:border-emerald-700 cursor-pointer"
          >
            <option value="all">Semua Status</option>
            <option value="active">Aktif</option>
            <option value="inactive">Nonaktif</option>
          </select>
        </div>

        <div>
          <select
            value={filters.shelf}
            onChange={(e) => onFilterChange({ shelf: e.target.value })}
            className="w-full py-1.5 px-3 text-xs bg-white dark:bg-slate-900 border border-slate-200 dark:border-border rounded-lg text-slate-700 dark:text-slate-200 focus:outline-none focus:ring-1 focus:ring-emerald-700 focus:border-emerald-700 cursor-pointer"
          >
            <option value="all">Semua Lokasi Rak</option>
            <option value="Rak A1">Rak A1 - Agama</option>
            <option value="Rak B1">Rak B1 - Tematik</option>
            <option value="Rak C1">Rak C1 - Sains</option>
            <option value="Rak D1">Rak D1 - Cerita</option>
            <option value="Rak C2">Rak C2 - Bahasa</option>
          </select>
        </div>

        <div>
          <select
            value={filters.level}
            onChange={(e) => onFilterChange({ level: e.target.value })}
            className="w-full py-1.5 px-3 text-xs bg-white dark:bg-slate-900 border border-slate-200 dark:border-border rounded-lg text-slate-700 dark:text-slate-200 focus:outline-none focus:ring-1 focus:ring-emerald-700 focus:border-emerald-700 cursor-pointer"
          >
            <option value="all">Semua Jenjang</option>
            <option value="MI">MI Ar-Rasyid</option>
            <option value="MTs">MTs Ar-Rasyid</option>
            <option value="Umum">Umum / Guru</option>
          </select>
        </div>

        <div>
          <select
            value={filters.category}
            onChange={(e) => onFilterChange({ category: e.target.value })}
            className="w-full py-1.5 px-3 text-xs bg-white dark:bg-slate-900 border border-slate-200 dark:border-border rounded-lg text-slate-700 dark:text-slate-200 focus:outline-none focus:ring-1 focus:ring-emerald-700 focus:border-emerald-700 cursor-pointer"
          >
            <option value="all">Semua Kategori</option>
            <option value="Fiqih">Fiqih</option>
            <option value="Tematik">Tematik</option>
            <option value="Sains">Sains</option>
            <option value="Sastra">Sastra / Cerita</option>
            <option value="Bahasa">Bahasa</option>
          </select>
        </div>

        <div className="col-span-2 md:col-span-1">
          <Button
            type="button"
            variant="secondary"
            size="sm"
            onClick={onResetFilter}
            className="w-full py-1.5 px-3 text-xs font-semibold text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white bg-slate-100 dark:bg-slate-800/80 hover:bg-slate-200/80 dark:hover:bg-slate-700/80 rounded-lg border border-slate-200 dark:border-border gap-1.5 cursor-pointer h-auto"
          >
            <RotateCcw className="w-3.5 h-3.5 text-slate-500 dark:text-slate-400" />
            <span>Reset Filter</span>
          </Button>
        </div>
      </div>
    </Card>
  );
}
