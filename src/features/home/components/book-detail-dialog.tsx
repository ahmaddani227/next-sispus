"use client"

import * as React from "react"
import { BookOpen, Copy, MapPin, Check, X } from "lucide-react"
import { Book } from "../types/catalog.types"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent } from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"

interface BookDetailDialogProps {
  book: Book | null
  open: boolean
  onOpenChange: (open: boolean) => void
  onToast: (message: string) => void
}

export function BookDetailDialog({
  book,
  open,
  onOpenChange,
  onToast,
}: BookDetailDialogProps) {
  const [copied, setCopied] = React.useState(false)
  const copyTimerRef = React.useRef<NodeJS.Timeout | null>(null)

  React.useEffect(() => {
    return () => {
      if (copyTimerRef.current) {
        clearTimeout(copyTimerRef.current)
      }
    }
  }, [])

  if (!book) return null

  const handleCopyCode = () => {
    if (navigator.clipboard) {
      navigator.clipboard.writeText(book.callNumber)
    }
    setCopied(true)
    onToast(`Kode Panggil ${book.callNumber} tersalin ke catatan.`)
    if (copyTimerRef.current) {
      clearTimeout(copyTimerRef.current)
    }
    copyTimerRef.current = setTimeout(() => setCopied(false), 2000)
  }

  const isAvailable = book.status === "tersedia"

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent hideClose className="max-w-xl p-0 overflow-hidden rounded-2xl border-none">
        {/* Modal Header */}
        <DialogHeader className="bg-[#166534] dark:bg-emerald-950 px-6 py-4 flex flex-row items-center justify-between text-white space-y-0">
          <div className="flex items-center gap-2">
            <BookOpen className="w-5 h-5 text-emerald-200" />
            <DialogTitle className="font-bold text-base text-white">
              Informasi Detail Buku &amp; Rak
            </DialogTitle>
          </div>
          <button
            type="button"
            onClick={() => onOpenChange(false)}
            className="text-white/80 hover:text-white p-1 rounded-lg hover:bg-white/10 transition-colors"
          >
            <X className="w-4 h-4" />
            <span className="sr-only">Tutup</span>
          </button>
        </DialogHeader>

        {/* Modal Body */}
        <div className="p-6 space-y-4">
          <div>
            <Badge
              variant="outline"
              className="px-2.5 py-1 rounded bg-emerald-50 text-[#166534] border-emerald-200 dark:bg-emerald-950/60 dark:text-emerald-300 dark:border-emerald-800 font-mono text-xs font-bold mb-1.5"
            >
              {book.callNumber}
            </Badge>
            <h2 className="text-lg font-bold text-slate-900 dark:text-foreground leading-snug">
              {book.title}
            </h2>
            <p className="text-xs text-slate-500 dark:text-muted-foreground mt-1">
              {book.author} • {book.publisher} ({book.year})
            </p>
          </div>

          {/* Physical Location Card */}
          <Card className="bg-slate-50 dark:bg-muted/40 shadow-none border-slate-200/60 dark:border-border">
            <CardContent className="p-4 space-y-1">
              <div className="flex items-center gap-2 text-[#166534] dark:text-emerald-400 text-sm font-bold">
                <MapPin className="w-4 h-4 shrink-0" />
                <span>{book.location}</span>
              </div>
              <p className="text-xs text-slate-500 dark:text-muted-foreground">
                Lokasi: Gedung Literasi Lt. 2. Harap catat nomor rak atau simpan kode panggil saat menuju ke lorong buku.
              </p>
            </CardContent>
          </Card>

          {/* Synopsis */}
          <div className="space-y-1">
            <span className="text-xs font-bold text-slate-800 dark:text-foreground block">
              Ringkasan Isi Buku:
            </span>
            <p className="text-xs text-slate-600 dark:text-muted-foreground leading-relaxed">
              {book.synopsis}
            </p>
          </div>

          <Separator className="bg-slate-100 dark:bg-border" />

          {/* Footer inside Body */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pt-1">
            <div className="flex items-center gap-2 text-xs font-semibold">
              <span
                className={`w-2.5 h-2.5 rounded-full ${
                  isAvailable ? "bg-emerald-600 dark:bg-emerald-500" : "bg-rose-500 dark:bg-rose-400"
                }`}
              />
              <span className={isAvailable ? "text-emerald-700 dark:text-emerald-400" : "text-rose-600 dark:text-rose-400"}>
                {isAvailable
                  ? `${book.availableCopies} dari ${book.totalCopies} Eksemplar Siap Pinjam`
                  : `Sedang Dipinjam (Estimasi: ${book.returnEstimate || "Segera"})`}
              </span>
            </div>

            <div className="flex items-center gap-2">
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={handleCopyCode}
                className="text-xs flex items-center gap-1.5"
              >
                {copied ? (
                  <>
                    <Check className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" />
                    <span>Tersalin!</span>
                  </>
                ) : (
                  <>
                    <Copy className="w-3.5 h-3.5" />
                    <span>Catat Kode</span>
                  </>
                )}
              </Button>
              <Button
                type="button"
                size="sm"
                onClick={() => onOpenChange(false)}
                className="bg-[#166534] hover:bg-[#14532d] dark:bg-primary dark:hover:bg-primary-hover text-white dark:text-primary-foreground text-xs px-5 shadow-xs"
              >
                Tutup
              </Button>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}
