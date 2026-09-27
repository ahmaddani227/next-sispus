"use client"

import * as React from "react"
import Link from "next/link"
import { ShieldCheck, MapPin, BookOpen, ScrollText } from "lucide-react"
import { Button, buttonVariants } from "@/components/ui/button"
import { cn } from "@/lib/utils"

interface CatalogHeaderProps {
  onOpenMap: () => void
  onOpenBorrowGuide: () => void
  onOpenRules: () => void
  onScrollToCatalog: () => void
}

export function CatalogHeader({
  onOpenMap,
  onOpenBorrowGuide,
  onOpenRules,
  onScrollToCatalog,
}: CatalogHeaderProps) {
  return (
    <header className="sticky top-0 w-full z-40 bg-white/95 dark:bg-card/95 backdrop-blur-md border-b border-slate-200/80 dark:border-border shadow-xs transition-all">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between gap-4">
        {/* Logo and Brand */}
        <div
          className="flex items-center gap-3 cursor-pointer select-none"
          onClick={() => {
            window.scrollTo({ top: 0, behavior: "smooth" })
          }}
        >
          <div className="flex flex-col justify-center">
            <div className="flex items-center gap-2">
              <span className="text-base font-bold text-[#166534] dark:text-emerald-400 tracking-tight">
                SIPUS Ar-Rasyid
              </span>
            </div>
            <span className="text-xs text-slate-500 dark:text-muted-foreground hidden sm:inline-block">
              Portal Katalog &amp; OPAC Siswa Madrasah
            </span>
          </div>
        </div>

        {/* Center Nav Links */}
        <nav className="hidden xl:flex items-center gap-1 bg-slate-50/80 dark:bg-slate-900/80 p-1.5 rounded-xl border border-slate-200/60 dark:border-border">
          <Button
            type="button"
            size="sm"
            onClick={onScrollToCatalog}
            className="px-4 py-2 bg-[#166534] text-white text-xs font-semibold rounded-lg shadow-xs hover:bg-[#14532d] transition-all cursor-pointer flex items-center gap-1.5 h-auto"
          >
            <BookOpen className="w-3.5 h-3.5" />
            <span>Katalog Buku</span>
          </Button>
          <Button
            type="button"
            variant="ghost"
            size="sm"
            onClick={onOpenMap}
            className="text-xs font-medium px-4 py-2 rounded-lg text-slate-600 hover:text-[#166534] hover:bg-slate-100 transition-all cursor-pointer flex items-center gap-1.5 h-auto"
          >
            <MapPin className="w-3.5 h-3.5" />
            <span>Peta Rak &amp; Lokasi</span>
          </Button>
          <Button
            type="button"
            variant="ghost"
            size="sm"
            onClick={onOpenBorrowGuide}
            className="text-xs font-medium px-4 py-2 rounded-lg text-slate-600 hover:text-[#166534] hover:bg-slate-100 transition-all cursor-pointer flex items-center gap-1.5 h-auto"
          >
            <BookOpen className="w-3.5 h-3.5" />
            <span>Panduan Peminjaman</span>
          </Button>
          <Button
            type="button"
            variant="ghost"
            size="sm"
            onClick={onOpenRules}
            className="text-xs font-medium px-4 py-2 rounded-lg text-slate-600 hover:text-[#166534] hover:bg-slate-100 transition-all cursor-pointer flex items-center gap-1.5 h-auto"
          >
            <ScrollText className="w-3.5 h-3.5" />
            <span>Tata Tertib Perpustakaan</span>
          </Button>
        </nav>

        {/* Admin Login Link */}
        <div className="flex items-center gap-3 shrink-0">
          <Link
            href="/login"
            className={cn(
              buttonVariants(),
              "bg-[#166534] hover:bg-[#14532d] text-white transition-all rounded-xl text-xs sm:text-sm font-semibold shadow-xs active:scale-[0.98] border border-emerald-700/60 h-auto py-2.5 px-4 inline-flex items-center gap-2"
            )}
          >
            <ShieldCheck className="w-4 h-4 text-emerald-200" />
            <span>Login</span>
          </Link>
        </div>
      </div>
    </header>
  )
}
