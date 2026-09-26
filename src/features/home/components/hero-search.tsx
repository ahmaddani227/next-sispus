"use client"

import * as React from "react"
import { Search, X } from "lucide-react"
import { TOPIC_FILTERS } from "../constants/catalog-data"
import { CatalogFilterState } from "../types/catalog.types"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"

interface HeroSearchProps {
  searchQuery: string
  onSearchChange: (query: string) => void
  onApplyTopic: (topicLabel: string, filter: Partial<CatalogFilterState>) => void
  activeTopic: string
  onSubmitSearch: () => void
}

export function HeroSearch({
  searchQuery,
  onSearchChange,
  onApplyTopic,
  activeTopic,
  onSubmitSearch,
}: HeroSearchProps) {
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    onSubmitSearch()
  }

  return (
    <section className="relative w-full overflow-hidden bg-gradient-to-b from-emerald-50/50 via-slate-50 to-white pt-12 pb-16 px-4 sm:px-6 lg:px-8 border-b border-slate-100">
      {/* Decorative blurred background orbs */}
      <div className="absolute -right-24 -top-24 w-96 h-96 rounded-full bg-emerald-200/30 blur-3xl pointer-events-none" />
      <div className="absolute -left-20 bottom-0 w-80 h-80 rounded-full bg-emerald-100/40 blur-2xl pointer-events-none" />

      <div className="relative max-w-5xl mx-auto flex flex-col items-center text-center">

        {/* Headline */}
        <h1 className="text-3xl sm:text-4xl md:text-5xl font-extrabold text-slate-900 tracking-tight mb-4 leading-tight">
          Selamat Datang di{" "}
          <span className="text-[#166534] underline decoration-emerald-300 decoration-4 underline-offset-6">
            Katalog Pustaka
          </span>{" "}
          Santri &amp; Siswa Ar-Rasyid
        </h1>

        {/* Subtitle */}
        <p className="text-sm sm:text-base text-slate-600 max-w-2xl leading-relaxed mb-8">
          Temukan buku pelajaran MI &amp; MTs, kitab keagamaan, ensiklopedia sains, dan cerita Islami
          favoritmu tanpa ribet. Cek ketersediaan di rak sebelum melangkah ke loket sirkulasi!
        </p>

        {/* Search Bar Container */}
        <div className="w-full max-w-3xl bg-white rounded-full p-2 shadow-lg border border-emerald-100 transition-all focus-within:border-emerald-400 focus-within:shadow-xl focus-within:scale-[1.005]">
          <form onSubmit={handleSubmit} className="flex items-center gap-2 pl-4 pr-3">
            <div className="flex items-center flex-1 w-full gap-2 text-slate-500">
              <Search className="w-5 h-5 text-[#166534] shrink-0" />
              <Input
                type="text"
                aria-label="Pencarian Buku"
                value={searchQuery}
                onChange={(e) => onSearchChange(e.target.value)}
                placeholder="Ketik judul buku"
                className="w-full bg-transparent py-2.5 px-2 text-sm text-slate-900 placeholder:text-slate-400 border-none outline-none focus-visible:ring-0 focus-visible:ring-offset-0 shadow-none h-auto"
              />
              {searchQuery && (
                <Button
                  type="button"
                  variant="ghost"
                  size="icon"
                  onClick={() => onSearchChange("")}
                  className="h-7 w-7 text-slate-400 hover:text-slate-700 hover:bg-slate-100 p-0 rounded-full"
                  title="Bersihkan"
                >
                  <X className="w-4 h-4" />
                </Button>
              )}
            </div>
          </form>
        </div>

        {/* Topic Pills */}
        <div className="w-full max-w-4xl mt-6 flex items-center justify-center gap-2 flex-wrap">
          <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider mr-1">
            Rekomendasi Topik:
          </span>
          {TOPIC_FILTERS.map((topic) => {
            const isActive = activeTopic === topic.label
            return (
              <Button
                key={topic.label}
                type="button"
                variant={isActive ? "default" : "ghost"}
                onClick={() => onApplyTopic(topic.label, topic.filter)}
                className={cn(
                  "h-auto px-3.5 py-1.5 rounded-full text-xs font-semibold transition-all cursor-pointer",
                  isActive
                    ? "bg-[#166534] text-white hover:bg-[#14532d] shadow-xs"
                    : "bg-slate-100 hover:bg-slate-200 text-slate-600"
                )}
              >
                {topic.label}
              </Button>
            )
          })}
        </div>
      </div>
    </section>
  )
}
