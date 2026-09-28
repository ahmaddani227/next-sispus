"use client"

import { SlidersHorizontal, Info, RotateCcw } from "lucide-react"
import {
  CatalogFilterState,
  BookJenjang,
  BookKategori,
  BookRak,
  BookStatus,
  BookFormat,
  BookTahun,
} from "../types/catalog.types"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { Button } from "@/components/ui/button"

interface CatalogFiltersProps {
  filters: CatalogFilterState
  onFilterChange: <K extends keyof CatalogFilterState>(key: K, value: CatalogFilterState[K]) => void
  onResetFilters: () => void
}

export function CatalogFilters({
  filters,
  onFilterChange,
  onResetFilters,
}: CatalogFiltersProps) {
  return (
    <aside className="w-full lg:w-80 shrink-0 space-y-4">
      {/* Main Filter Card */}
      <Card className="bg-white dark:bg-card rounded-xl shadow-xs border-slate-200 dark:border-border">
        <CardHeader className="p-5 pb-4 flex flex-row items-center justify-between border-b border-slate-100 dark:border-border space-y-0">
          <CardTitle className="text-sm font-bold text-slate-800 dark:text-foreground flex items-center gap-2">
            <SlidersHorizontal className="w-4 h-4 text-[#166534] dark:text-emerald-400" />
            <span>Filter Buku</span>
          </CardTitle>
          <Button
            type="button"
            variant="ghost"
            size="sm"
            onClick={onResetFilters}
            className="h-auto p-0 text-xs font-semibold text-[#166534] hover:text-[#14532d] dark:text-emerald-400 dark:hover:text-emerald-300 hover:bg-transparent flex items-center gap-1 cursor-pointer"
          >
            <RotateCcw className="w-3 h-3" />
            <span>Reset</span>
          </Button>
        </CardHeader>

        <CardContent className="p-5 pt-4 space-y-4">
          {/* Jenjang */}
          <div className="space-y-1.5">
            <Label className="text-xs font-semibold text-slate-700 dark:text-slate-300 block">
              Tingkat / Jenjang
            </Label>
            <select
              value={filters.jenjang}
              onChange={(e) => onFilterChange("jenjang", e.target.value as BookJenjang)}
              className="w-full bg-slate-50 dark:bg-muted/40 text-slate-800 dark:text-foreground rounded-lg px-3 py-2 text-xs font-medium focus:outline-none focus:bg-white dark:focus:bg-card border border-slate-200 dark:border-border focus:border-emerald-600 dark:focus:border-emerald-500 transition-colors"
            >
              <option value="semua" className="bg-white dark:bg-slate-900 text-slate-900 dark:text-slate-100">Semua Jenjang Madrasah</option>
              <option value="mi" className="bg-white dark:bg-slate-900 text-slate-900 dark:text-slate-100">MI Ar-Rasyid (Kelas 1 - 6)</option>
              <option value="mts" className="bg-white dark:bg-slate-900 text-slate-900 dark:text-slate-100">MTs Ar-Rasyid (Kelas 7 - 9)</option>
              <option value="umum" className="bg-white dark:bg-slate-900 text-slate-900 dark:text-slate-100">Umum &amp; Pengayaan Santri</option>
            </select>
          </div>

          {/* Kategori Materi */}
          <div className="space-y-1.5">
            <Label className="text-xs font-semibold text-slate-700 dark:text-slate-300 block">
              Kategori Materi
            </Label>
            <select
              value={filters.kategori}
              onChange={(e) => onFilterChange("kategori", e.target.value as BookKategori)}
              className="w-full bg-slate-50 dark:bg-muted/40 text-slate-800 dark:text-foreground rounded-lg px-3 py-2 text-xs font-medium focus:outline-none focus:bg-white dark:focus:bg-card border border-slate-200 dark:border-border focus:border-emerald-600 dark:focus:border-emerald-500 transition-colors"
            >
              <option value="semua" className="bg-white dark:bg-slate-900 text-slate-900 dark:text-slate-100">Semua Kategori</option>
              <option value="agama" className="bg-white dark:bg-slate-900 text-slate-900 dark:text-slate-100">Kitab &amp; Fiqih Agama</option>
              <option value="tematik" className="bg-white dark:bg-slate-900 text-slate-900 dark:text-slate-100">Buku Tematik MI</option>
              <option value="sains" className="bg-white dark:bg-slate-900 text-slate-900 dark:text-slate-100">Sains &amp; Eksak MTs</option>
              <option value="bahasa" className="bg-white dark:bg-slate-900 text-slate-900 dark:text-slate-100">Bahasa &amp; Kamus</option>
              <option value="sastra" className="bg-white dark:bg-slate-900 text-slate-900 dark:text-slate-100">Sastra &amp; Cerita Nabi</option>
            </select>
          </div>

          {/* Zona Rak */}
          <div className="space-y-1.5">
            <Label className="text-xs font-semibold text-slate-700 dark:text-slate-300 block">
              Zona Rak Perpustakaan
            </Label>
            <select
              value={filters.rak}
              onChange={(e) => onFilterChange("rak", e.target.value as BookRak)}
              className="w-full bg-slate-50 dark:bg-muted/40 text-slate-800 dark:text-foreground rounded-lg px-3 py-2 text-xs font-medium focus:outline-none focus:bg-white dark:focus:bg-card border border-slate-200 dark:border-border focus:border-emerald-600 dark:focus:border-emerald-500 transition-colors"
            >
              <option value="semua" className="bg-white dark:bg-slate-900 text-slate-900 dark:text-slate-100">Semua Zona Rak</option>
              <option value="rak-a" className="bg-white dark:bg-slate-900 text-slate-900 dark:text-slate-100">Rak A - Kitab Turats &amp; Fiqih Islam</option>
              <option value="rak-b" className="bg-white dark:bg-slate-900 text-slate-900 dark:text-slate-100">Rak B - Buku Tematik MI</option>
              <option value="rak-c" className="bg-white dark:bg-slate-900 text-slate-900 dark:text-slate-100">Rak C - Sains &amp; MTs Eksak</option>
              <option value="rak-d" className="bg-white dark:bg-slate-900 text-slate-900 dark:text-slate-100">Rak D - Cerita Islami &amp; Karakter</option>
              <option value="rak-e" className="bg-white dark:bg-slate-900 text-slate-900 dark:text-slate-100">Rak E - Kamus &amp; Referensi</option>
            </select>
          </div>

          {/* Status Ketersediaan */}
          <div className="space-y-1.5">
            <Label className="text-xs font-semibold text-slate-700 dark:text-slate-300 block">
              Status Ketersediaan
            </Label>
            <select
              value={filters.status}
              onChange={(e) => onFilterChange("status", e.target.value as BookStatus)}
              className="w-full bg-slate-50 dark:bg-muted/40 text-slate-800 dark:text-foreground rounded-lg px-3 py-2 text-xs font-medium focus:outline-none focus:bg-white dark:focus:bg-card border border-slate-200 dark:border-border focus:border-emerald-600 dark:focus:border-emerald-500 transition-colors"
            >
              <option value="semua" className="bg-white dark:bg-slate-900 text-slate-900 dark:text-slate-100">Semua Status Koleksi</option>
              <option value="tersedia" className="bg-white dark:bg-slate-900 text-slate-900 dark:text-slate-100">Hanya yang Siap di Rak (Tersedia)</option>
              <option value="dipinjam" className="bg-white dark:bg-slate-900 text-slate-900 dark:text-slate-100">Koleksi yang Sedang Dipinjam</option>
            </select>
          </div>

          {/* Format Koleksi */}
          <div className="space-y-1.5">
            <Label className="text-xs font-semibold text-slate-700 dark:text-slate-300 block">
              Format / Jenis Koleksi
            </Label>
            <select
              value={filters.format}
              onChange={(e) => onFilterChange("format", e.target.value as BookFormat)}
              className="w-full bg-slate-50 dark:bg-muted/40 text-slate-800 dark:text-foreground rounded-lg px-3 py-2 text-xs font-medium focus:outline-none focus:bg-white dark:focus:bg-card border border-slate-200 dark:border-border focus:border-emerald-600 dark:focus:border-emerald-500 transition-colors"
            >
              <option value="semua" className="bg-white dark:bg-slate-900 text-slate-900 dark:text-slate-100">Semua Format Koleksi</option>
              <option value="buku-cetak" className="bg-white dark:bg-slate-900 text-slate-900 dark:text-slate-100">Buku Cetak Kurikulum</option>
              <option value="kitab" className="bg-white dark:bg-slate-900 text-slate-900 dark:text-slate-100">Kitab &amp; Risalah Turats</option>
              <option value="referensi" className="bg-white dark:bg-slate-900 text-slate-900 dark:text-slate-100">Kamus &amp; Referensi Meja</option>
              <option value="cerita" className="bg-white dark:bg-slate-900 text-slate-900 dark:text-slate-100">Buku Bergambar / Fiksi</option>
            </select>
          </div>

          {/* Tahun Terbit */}
          <div className="space-y-1.5">
            <Label className="text-xs font-semibold text-slate-700 dark:text-slate-300 block">
              Tahun Terbit
            </Label>
            <select
              value={filters.tahun}
              onChange={(e) => onFilterChange("tahun", e.target.value as BookTahun)}
              className="w-full bg-slate-50 dark:bg-muted/40 text-slate-800 dark:text-foreground rounded-lg px-3 py-2 text-xs font-medium focus:outline-none focus:bg-white dark:focus:bg-card border border-slate-200 dark:border-border focus:border-emerald-600 dark:focus:border-emerald-500 transition-colors"
            >
              <option value="semua" className="bg-white dark:bg-slate-900 text-slate-900 dark:text-slate-100">Semua Tahun Terbit</option>
              <option value="2023-2024" className="bg-white dark:bg-slate-900 text-slate-900 dark:text-slate-100">Terbaru (2023 - 2024)</option>
              <option value="2020-2022" className="bg-white dark:bg-slate-900 text-slate-900 dark:text-slate-100">2020 - 2022</option>
              <option value="klasik" className="bg-white dark:bg-slate-900 text-slate-900 dark:text-slate-100">Klasik &amp; Edisi Standar</option>
            </select>
          </div>
        </CardContent>
      </Card>

      {/* Student Quick Tip Box */}
      <Card className="bg-slate-50 dark:bg-card rounded-xl shadow-none border-slate-200/80 dark:border-border">
        <CardContent className="p-4 space-y-2">
          <div className="flex items-center gap-2 text-[#166534] dark:text-emerald-400">
            <Info className="w-4 h-4 shrink-0" />
            <h4 className="text-xs font-bold text-slate-800 dark:text-foreground">Petunjuk Pencarian Cepat</h4>
          </div>
          <p className="text-xs text-slate-600 dark:text-muted-foreground leading-relaxed">
            Catat <strong className="text-slate-800 dark:text-slate-200">Kode Panggil</strong> (misal:{" "}
            <em className="font-mono text-emerald-800 dark:text-emerald-300">BK-AGM-0182</em>) lalu periksa langsung ke
            nomor rak yang tertera di kartu buku. Tunjukkan Kartu Siswa (KTA) di loket sirkulasi saat
            meminjam.
          </p>
        </CardContent>
      </Card>
    </aside>
  )
}
