"use client"

import {useState, useEffect, useRef, useCallback, useMemo } from "react"
import { SearchX, CheckCircle2, Info } from "lucide-react"
import { Book, CatalogFilterState, BookRak } from "../types/catalog.types"
import { INITIAL_FILTERS, MOCK_BOOKS } from "../constants/catalog-data"
import { CatalogHeader } from "./catalog-header"
import { HeroSearch } from "./hero-search"
import { CatalogStats } from "./catalog-stats"
import { CatalogFilters } from "./catalog-filters"
import { BookCard } from "./book-card"
import { BookDetailDialog } from "./book-detail-dialog"
import { MapDialog } from "./map-dialog"
import { BorrowGuideDialog } from "./borrow-guide-dialog"
import { RulesDialog } from "./rules-dialog"
import { CatalogFooter } from "./catalog-footer"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"

export function Home() {
  const [filters, setFilters] = useState<CatalogFilterState>(INITIAL_FILTERS)
  const [activeTopic, setActiveTopic] = useState<string>("Semua Koleksi")

  // Modal dialog states
  const [selectedBook, setSelectedBook] = useState<Book | null>(null)
  const [isBookDetailOpen, setIsBookDetailOpen] = useState(false)
  const [isMapOpen, setIsMapOpen] = useState(false)
  const [isBorrowGuideOpen, setIsBorrowGuideOpen] = useState(false)
  const [isRulesOpen, setIsRulesOpen] = useState(false)

  // Floating toast feedback state
  const [toastMessage, setToastMessage] = useState<string | null>(null)
  const toastTimeoutRef = useRef<NodeJS.Timeout | null>(null)

  const catalogSectionRef = useRef<HTMLElement>(null)

  const showToast = useCallback((message: string) => {
    setToastMessage(message)
    if (toastTimeoutRef.current) {
      clearTimeout(toastTimeoutRef.current)
    }
    toastTimeoutRef.current = setTimeout(() => {
      setToastMessage(null)
    }, 3500)
  }, [])

  useEffect(() => {
    return () => {
      if (toastTimeoutRef.current) {
        clearTimeout(toastTimeoutRef.current)
      }
    }
  }, [])

  const scrollToCatalog = useCallback(() => {
    catalogSectionRef.current?.scrollIntoView({ behavior: "smooth", block: "start" })
  }, [])

  const handleFilterChange = useCallback(
    <K extends keyof CatalogFilterState>(key: K, value: CatalogFilterState[K]) => {
      setFilters((prev) => ({ ...prev, [key]: value }))
      if (key !== "searchQuery") {
        setActiveTopic("")
      }
    },
    []
  )

  const handleResetFilters = useCallback(() => {
    setFilters(INITIAL_FILTERS)
    setActiveTopic("Semua Koleksi")
    showToast("Filter berhasil direset.")
  }, [showToast])

  const handleApplyTopic = useCallback(
    (topicLabel: string, topicFilter: Partial<CatalogFilterState>) => {
      setActiveTopic(topicLabel)
      setFilters((prev) => ({
        ...prev,
        ...topicFilter,
      }))
      showToast(`Filter topik diterapkan: ${topicLabel}`)
      scrollToCatalog()
    },
    [showToast, scrollToCatalog]
  )

  const handleSelectBook = useCallback((book: Book) => {
    setSelectedBook(book)
    setIsBookDetailOpen(true)
  }, [])

  const handleFilterByRack = useCallback(
    (rackCode: BookRak, zoneTitle: string) => {
      setFilters((prev) => ({ ...prev, rak: rackCode }))
      showToast(`Menampilkan koleksi di ${zoneTitle}`)
      scrollToCatalog()
    },
    [showToast, scrollToCatalog]
  )

  // Quick stat card triggers
  const handleFilterAvailable = useCallback(() => {
    setFilters((prev) => ({ ...prev, status: "tersedia" }))
    showToast("Menampilkan koleksi siap di rak.")
    scrollToCatalog()
  }, [showToast, scrollToCatalog])

  const handleFilterBorrowed = useCallback(() => {
    setFilters((prev) => ({ ...prev, status: "dipinjam" }))
    showToast("Menampilkan koleksi yang sedang dipinjam.")
    scrollToCatalog()
  }, [showToast, scrollToCatalog])

  const handleResetAndScroll = useCallback(() => {
    handleResetFilters()
    scrollToCatalog()
  }, [handleResetFilters, scrollToCatalog])

  // Filter books logic
  const filteredBooks = useMemo(() => {
    const q = filters.searchQuery.toLowerCase().trim()

    return MOCK_BOOKS.filter((book) => {
      const matchSearch =
        !q ||
        book.title.toLowerCase().includes(q) ||
        book.author.toLowerCase().includes(q) ||
        book.callNumber.toLowerCase().includes(q) ||
        book.publisher.toLowerCase().includes(q) ||
        book.badgeLabel.toLowerCase().includes(q)

      const matchJenjang = filters.jenjang === "semua" || book.jenjang === filters.jenjang
      const matchKategori = filters.kategori === "semua" || book.kategori === filters.kategori
      const matchRak = filters.rak === "semua" || book.rack === filters.rak
      const matchStatus = filters.status === "semua" || book.status === filters.status
      const matchFormat = filters.format === "semua" || book.format === filters.format
      const matchTahun = filters.tahun === "semua" || book.tahunRange === filters.tahun

      return (
        matchSearch &&
        matchJenjang &&
        matchKategori &&
        matchRak &&
        matchStatus &&
        matchFormat &&
        matchTahun
      )
    })
  }, [filters])

  return (
    <div className="h-full w-full overflow-y-auto bg-slate-50 dark:bg-background text-foreground flex flex-col font-sans selection:bg-accent selection:text-accent-foreground scroll-smooth">
      {/* Top Navigation */}
      <CatalogHeader
        onOpenMap={() => setIsMapOpen(true)}
        onOpenBorrowGuide={() => setIsBorrowGuideOpen(true)}
        onOpenRules={() => setIsRulesOpen(true)}
        onScrollToCatalog={scrollToCatalog}
      />

      <main className="w-full flex-1">
        {/* Hero Search Section */}
        <HeroSearch
          searchQuery={filters.searchQuery}
          onSearchChange={(query) => handleFilterChange("searchQuery", query)}
          onApplyTopic={handleApplyTopic}
          activeTopic={activeTopic}
          onSubmitSearch={scrollToCatalog}
        />

        {/* Quick Stats Banner */}
        <CatalogStats
          onFilterAvailable={handleFilterAvailable}
          onFilterBorrowed={handleFilterBorrowed}
          onResetAndScroll={handleResetAndScroll}
        />

        {/* Main Catalog OPAC Explorer Section */}
        <section
          ref={catalogSectionRef}
          id="catalog-section"
          className="max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-12 scroll-mt-24"
        >
          <div className="flex flex-col lg:flex-row gap-8 items-start">
            {/* Left Filter Sidebar */}
            <CatalogFilters
              filters={filters}
              onFilterChange={handleFilterChange}
              onResetFilters={handleResetFilters}
            />

            {/* Right Main Catalog Grid & Result Header */}
            <div className="flex-1 w-full space-y-4">
              {/* Results Bar */}
              <Card className="bg-white dark:bg-card rounded-xl shadow-xs border-slate-200 dark:border-border">
                <CardContent className="px-5 py-3.5 flex flex-col sm:flex-row items-center justify-between gap-2 p-0 sm:p-3.5">
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-bold text-slate-800 dark:text-foreground">Daftar Buku Pilihan</span>
                    <Badge
                      variant="outline"
                      className="text-xs px-2.5 py-0.5 rounded-full bg-emerald-50 dark:bg-emerald-950/60 text-[#166534] dark:text-emerald-300 font-mono font-bold border-emerald-200 dark:border-emerald-800"
                    >
                      {filteredBooks.length} Judul Ditampilkan
                    </Badge>
                  </div>
                  <div className="flex items-center gap-1.5 text-xs text-slate-500 dark:text-muted-foreground">
                    <CheckCircle2 className="w-4 h-4 text-[#166534] dark:text-emerald-400" />
                    <span>Sinkronisasi otomatis dengan Meja Sirkulasi</span>
                  </div>
                </CardContent>
              </Card>

              {/* Book Cards Grid */}
              {filteredBooks.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
                  {filteredBooks.map((book) => (
                    <BookCard
                      key={book.id}
                      book={book}
                      onSelect={handleSelectBook}
                    />
                  ))}
                </div>
              ) : (
                /* No Results Fallback */
                <Card className="bg-white dark:bg-card rounded-xl shadow-xs border-slate-200 dark:border-border">
                  <CardContent className="p-10 text-center space-y-3">
                    <div className="w-14 h-14 rounded-full bg-slate-100 dark:bg-muted mx-auto flex items-center justify-center text-[#166534] dark:text-emerald-400">
                      <SearchX className="w-7 h-7" />
                    </div>
                    <h4 className="text-base font-bold text-slate-800 dark:text-foreground">Buku Belum Ditemukan</h4>
                    <p className="text-xs text-slate-500 dark:text-muted-foreground max-w-md mx-auto leading-relaxed">
                      Coba periksa kembali ejaan kata kunci, kode buku, atau gunakan istilah umum seperti
                      &quot;Fiqih&quot;, &quot;Kelas 5&quot;, atau kembalikan saringan Anda.
                    </p>
                    <Button
                      type="button"
                      onClick={handleResetFilters}
                      className="bg-[#166534] hover:bg-[#14532d] dark:bg-primary dark:hover:bg-primary-hover text-white dark:text-primary-foreground text-xs px-6 py-2 shadow-xs"
                    >
                      Kembalikan Semua Koleksi
                    </Button>
                  </CardContent>
                </Card>
              )}
            </div>
          </div>
        </section>
      </main>

      {/* Footer */}
      <CatalogFooter />

      {/* Modals */}
      <BookDetailDialog
        book={selectedBook}
        open={isBookDetailOpen}
        onOpenChange={setIsBookDetailOpen}
        onToast={showToast}
      />

      <MapDialog
        open={isMapOpen}
        onOpenChange={setIsMapOpen}
        onFilterByRack={handleFilterByRack}
      />

      <BorrowGuideDialog
        open={isBorrowGuideOpen}
        onOpenChange={setIsBorrowGuideOpen}
      />

      <RulesDialog
        open={isRulesOpen}
        onOpenChange={setIsRulesOpen}
      />

      {/* Floating Toast Notification */}
      {toastMessage && (
        <div className="fixed bottom-6 right-6 z-50 bg-slate-900 dark:bg-slate-800 text-white dark:text-slate-100 border border-slate-700/50 px-4 py-3 rounded-xl shadow-xl flex items-center gap-2.5 text-xs animate-in slide-in-from-bottom-3 duration-300">
          <Info className="w-4 h-4 text-emerald-400 shrink-0" />
          <span>{toastMessage}</span>
        </div>
      )}
    </div>
  )
}
