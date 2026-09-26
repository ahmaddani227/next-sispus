"use client"

import { BookMarked, Layers, BookCheck, Clock } from "lucide-react"
import { Card, CardContent } from "@/components/ui/card"

interface CatalogStatsProps {
  onFilterAvailable: () => void
  onFilterBorrowed: () => void
  onResetAndScroll: () => void
}

export function CatalogStats({
  onFilterAvailable,
  onFilterBorrowed,
  onResetAndScroll,
}: CatalogStatsProps) {
  return (
    <section className="max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 -mt-6 z-10 relative">
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Stat 1: Total Koleksi Buku */}
        <Card
          role="button"
          tabIndex={0}
          onClick={onResetAndScroll}
          onKeyDown={(e) => e.key === "Enter" && onResetAndScroll()}
          className="bg-white rounded-xl shadow-xs hover:shadow-md transition-shadow cursor-pointer border-slate-200/80 group"
        >
          <CardContent className="p-4 flex items-center justify-between">
            <div className="flex flex-col">
              <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">
                Total Koleksi Buku
              </span>
              <span className="text-2xl font-bold font-mono text-[#166534] mt-0.5 group-hover:scale-105 transition-transform">
                2.845
              </span>
              <span className="text-xs text-slate-400 mt-0.5">
                Koleksi Terverifikasi
              </span>
            </div>
            <div className="w-12 h-12 rounded-xl bg-emerald-50 border border-emerald-200 flex items-center justify-center text-[#166534]">
              <BookMarked className="w-6 h-6" />
            </div>
          </CardContent>
        </Card>

        {/* Stat 2: Siap Dipinjam di Rak */}
        <Card
          role="button"
          tabIndex={0}
          onClick={onFilterAvailable}
          onKeyDown={(e) => e.key === "Enter" && onFilterAvailable()}
          className="bg-white rounded-xl shadow-xs hover:shadow-md transition-shadow cursor-pointer border-slate-200/80 group"
        >
          <CardContent className="p-4 flex items-center justify-between">
            <div className="flex flex-col">
              <span className="text-[11px] font-bold text-emerald-700 uppercase tracking-wider">
                Siap Dipinjam di Rak
              </span>
              <span className="text-2xl font-bold font-mono text-emerald-700 mt-0.5 group-hover:scale-105 transition-transform">
                2.610
              </span>
              <span className="text-xs text-emerald-600 flex items-center gap-1.5 mt-0.5 font-medium">
                <span className="w-2 h-2 rounded-full bg-emerald-500" /> 91.7% Stok Tersedia
              </span>
            </div>
            <div className="w-12 h-12 rounded-xl bg-emerald-50 border border-emerald-200 flex items-center justify-center text-emerald-700">
              <Layers className="w-6 h-6" />
            </div>
          </CardContent>
        </Card>

        {/* Stat 3: Sedang Dipinjam */}
        <Card
          role="button"
          tabIndex={0}
          onClick={onFilterBorrowed}
          onKeyDown={(e) => e.key === "Enter" && onFilterBorrowed()}
          className="bg-white rounded-xl shadow-xs hover:shadow-md transition-shadow cursor-pointer border-slate-200/80 group"
        >
          <CardContent className="p-4 flex items-center justify-between">
            <div className="flex flex-col">
              <span className="text-[11px] font-bold text-slate-600 uppercase tracking-wider">
                Sedang Dipinjam
              </span>
              <span className="text-2xl font-bold font-mono text-slate-700 mt-0.5 group-hover:scale-105 transition-transform">
                235
              </span>
              <span className="text-xs text-slate-400 mt-0.5">
                Aktif dalam sirkulasi
              </span>
            </div>
            <div className="w-12 h-12 rounded-xl bg-slate-100 border border-slate-200 flex items-center justify-center text-slate-600">
              <BookCheck className="w-6 h-6" />
            </div>
          </CardContent>
        </Card>

        {/* Stat 4: Jam Layanan OPAC */}
        <Card className="bg-white rounded-xl shadow-xs hover:shadow-md transition-shadow border-slate-200/80">
          <CardContent className="p-4 flex items-center justify-between">
            <div className="flex flex-col">
              <span className="text-[11px] font-bold text-[#166534] uppercase tracking-wider">
                Jam Layanan OPAC
              </span>
              <span className="text-xl font-bold font-mono text-[#166534] mt-0.5">
                07.30 - 15.30
              </span>
              <span className="text-xs text-slate-400 mt-0.5">
                Senin - Sabtu (Lt. 2)
              </span>
            </div>
            <div className="w-12 h-12 rounded-xl bg-emerald-50 border border-emerald-200 flex items-center justify-center text-[#166534]">
              <Clock className="w-6 h-6" />
            </div>
          </CardContent>
        </Card>
      </div>
    </section>
  )
}
