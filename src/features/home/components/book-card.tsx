"use client"

import * as React from "react"
import Image from "next/image"
import { Eye, MapPin, CalendarX } from "lucide-react"
import { Book } from "../types/catalog.types"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardFooter } from "@/components/ui/card"

import { cn } from "@/lib/utils"

interface BookCardProps {
  book: Book
  onSelect: (book: Book) => void
}

export const BookCard = React.memo(function BookCard({ book, onSelect }: BookCardProps) {
  const isAvailable = book.status === "tersedia"
  const isLowStock = isAvailable && book.availableCopies > 0 && book.availableCopies <= 3

  return (
    <Card
      className={cn(
        "rounded-xl overflow-hidden shadow-xs hover:shadow-md transition-all flex flex-col justify-between group",
        isAvailable
          ? "bg-white border-slate-200"
          : "bg-white border-2 border-rose-400 hover:border-rose-500"
      )}
    >
      <CardContent className="p-4 space-y-3">
        {/* Top Badges */}
        <div className="flex items-start justify-between gap-2">
          <Badge
            variant="outline"
            className="px-2 py-0.5 bg-emerald-50 text-[#166534] border-emerald-200 rounded-md text-[11px] font-semibold"
          >
            {book.badgeLabel}
          </Badge>

          {isAvailable && (
            isLowStock ? (
              <Badge variant="warning" dot className="text-[11px] font-semibold">
                {book.availableCopies} Tersisa
              </Badge>
            ) : (
              <Badge variant="success" dot className="text-[11px] font-semibold">
                Tersedia
              </Badge>
            )
          )}
        </div>

        {/* Cover Image & Metadata */}
        <div className="flex gap-3.5 pt-1">
          <div className="w-20 h-28 bg-slate-100 shrink-0 rounded-lg overflow-hidden shadow-xs relative">
            <Image
              src={book.coverUrl}
              alt={book.title}
              fill
              unoptimized
              sizes="80px"
              className="object-cover group-hover:scale-105 transition-transform duration-300"
            />
            <div className="absolute bottom-0 inset-x-0 bg-[#166534]/95 py-0.5 text-center font-mono text-[11px] text-white font-bold z-10">
              {book.callNumber}
            </div>
          </div>

          <div className="min-w-0 flex-1">
            <h4 className="text-sm font-bold text-slate-900 group-hover:text-[#166534] transition-colors line-clamp-2 leading-snug">
              {book.title}
            </h4>
            <p className="text-xs text-slate-500 mt-1 line-clamp-1">
              {book.author}
            </p>
            <p className="text-xs text-slate-600">
              Penerbit: {book.publisher} ({book.year})
            </p>

            <div className="mt-2 text-xs">
              {isAvailable ? (
                <>
                  <span className="font-mono text-emerald-700 font-bold">
                    {book.availableCopies} dari {book.totalCopies}
                  </span>
                  <span className="text-slate-500"> Eksemplar di rak</span>
                </>
              ) : (
                <div className="text-rose-600 flex items-center gap-1 font-semibold">
                  <CalendarX className="w-3.5 h-3.5" />
                  <span>Kembali: {book.returnEstimate || "Segera"}</span>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Physical Shelf Location */}
        <div className="p-2 rounded-lg bg-slate-50 flex items-center gap-2 text-slate-700 text-xs">
          <MapPin className="w-4 h-4 text-[#166534] shrink-0" />
          <span className="truncate font-medium">{book.location}</span>
        </div>
      </CardContent>

      {/* Action Button */}
      <CardFooter className="p-4 pt-0">
        <Button
          type="button"
          onClick={() => onSelect(book)}
          className="w-full py-1.5 h-9 bg-[#166534] hover:bg-[#14532d] text-white rounded-lg text-xs font-semibold flex items-center justify-center gap-1.5 shadow-xs transition-colors"
        >
          <Eye className="w-3.5 h-3.5" />
          <span>Lihat Detail Buku</span>
        </Button>
      </CardFooter>
    </Card>
  )
})
