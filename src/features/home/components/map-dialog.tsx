"use client"

import * as React from "react"
import { Map, MapPin, Armchair, DoorClosed, Compass, X } from "lucide-react"
import { ZONE_INFO_DATA } from "../constants/catalog-data"
import { BookRak, ZoneInfo } from "../types/catalog.types"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { cn } from "@/lib/utils"

interface MapDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  onFilterByRack: (rackCode: BookRak, zoneTitle: string) => void
}

function ZoneCardItem({
  zone,
  selected,
  onSelect,
  compact = false,
}: {
  zone: ZoneInfo
  selected: boolean
  onSelect: (k: string) => void
  compact?: boolean
}) {
  return (
    <Card
      role="button"
      tabIndex={0}
      onClick={() => onSelect(zone.badge)}
      onKeyDown={(e) => e.key === "Enter" && onSelect(zone.badge)}
      className={cn(
        "rounded-xl border-2 cursor-pointer transition-all bg-white dark:bg-card shadow-none",
        compact ? "p-2.5" : "p-3",
        selected
          ? "border-emerald-600 dark:border-emerald-500 shadow-md ring-2 ring-emerald-500/20"
          : "border-slate-200 dark:border-border hover:border-emerald-600/70 hover:shadow-xs"
      )}
    >
      <CardContent className="p-0">
        <div className="flex items-center justify-between mb-1">
          <Badge
            variant="outline"
            className="px-2 py-0.5 rounded bg-emerald-100 text-[#166534] border-emerald-200 dark:bg-emerald-950/60 dark:text-emerald-300 dark:border-emerald-800 font-bold text-xs"
          >
            RAK {zone.badge}
          </Badge>
          <span
            className={cn(
              "font-bold text-emerald-700 dark:text-emerald-300 bg-emerald-50 dark:bg-emerald-950/60 rounded-full",
              compact ? "text-[10px] px-1.5 py-0.5" : "text-[11px] px-2 py-0.5"
            )}
          >
            {zone.fillRate}
          </span>
        </div>
        <h5 className="font-bold text-xs text-slate-900 dark:text-foreground">{zone.shortTitle}</h5>
        <p className={cn("text-[11px] text-slate-500 dark:text-muted-foreground", compact ? "line-clamp-1" : "mt-1 line-clamp-2")}>
          {zone.description}
        </p>
        {!compact && (
          <div className="mt-2 text-[11px] text-[#166534] dark:text-emerald-400 font-semibold flex items-center gap-1">
            <MapPin className="w-3 h-3" /> {zone.locationNote}
          </div>
        )}
      </CardContent>
    </Card>
  )
}

export function MapDialog({
  open,
  onOpenChange,
  onFilterByRack,
}: MapDialogProps) {
  const [selectedZone, setSelectedZone] = React.useState<string>("A")
  const zone = ZONE_INFO_DATA[selectedZone] || ZONE_INFO_DATA["A"]

  const handleApplyFilter = () => {
    onFilterByRack(zone.rackCode, zone.title)
    onOpenChange(false)
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent hideClose className="max-w-4xl p-0 overflow-hidden rounded-2xl border-none">
        {/* Header */}
        <DialogHeader className="bg-[#166534] dark:bg-emerald-950 px-6 py-4 flex flex-row items-center justify-between text-white space-y-0">
          <div className="flex items-center gap-2">
            <Map className="w-6 h-6 text-emerald-200" />
            <div>
              <DialogTitle className="font-bold text-base text-white">
                Peta Rak &amp; Denah Gedung Literasi Lt. 2
              </DialogTitle>
              <p className="text-xs text-emerald-100">
                Perpustakaan Madrasah Ar-Rasyid • Panduan Penataan Fisik Buku
              </p>
            </div>
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

        {/* Body */}
        <div className="p-6 space-y-6 max-h-[80vh] overflow-y-auto">
          {/* Denah Floor Layout */}
          <Card className="bg-slate-50 dark:bg-muted/30 shadow-none border-slate-200/80 dark:border-border rounded-2xl">
            <CardContent className="p-4 sm:p-6">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-4 pb-2 border-b border-slate-200 dark:border-border">
                <div className="flex items-center gap-2">
                  <Badge className="bg-[#166534] hover:bg-[#166534] text-white text-[11px] font-bold uppercase tracking-wider rounded">
                    Lantai 2
                  </Badge>
                  <span className="text-xs font-bold text-slate-800 dark:text-foreground">
                    Tata Letak Ruangan Sirkulasi &amp; Rak Koleksi
                  </span>
                </div>
                <span className="text-[11px] text-slate-500 dark:text-muted-foreground flex items-center gap-1">
                  <Compass className="w-3.5 h-3.5 text-slate-400 dark:text-muted-foreground" />
                  Klik zona rak di denah untuk info detail
                </span>
              </div>

              {/* Visual Floor Grid */}
              <div className="grid grid-cols-1 md:grid-cols-12 gap-3 min-h-[260px]">
                {/* Left Side: Rak A & Rak B */}
                <div className="md:col-span-4 flex flex-col gap-3">
                  {(["A", "B"] as const).map((key) => (
                    <ZoneCardItem
                      key={key}
                      zone={ZONE_INFO_DATA[key]}
                      selected={selectedZone === key}
                      onSelect={setSelectedZone}
                    />
                  ))}
                </div>

                {/* Center Corridor & Reading Area */}
                <div className="md:col-span-4 flex flex-col justify-between gap-3">
                  <div className="p-3 bg-emerald-50 dark:bg-emerald-950/30 border border-dashed border-emerald-300 dark:border-emerald-800 rounded-xl text-center flex flex-col items-center justify-center">
                    <div className="w-7 h-7 rounded-full bg-[#166534] text-white flex items-center justify-center mb-1 text-xs font-bold">
                      ★
                    </div>
                    <span className="text-xs font-bold text-emerald-950 dark:text-emerald-200">
                      Meja Piket Sirkulasi &amp; Pustakawan
                    </span>
                    <span className="text-[11px] text-emerald-800 dark:text-emerald-400">
                      Layanan Pinjam, Kembali &amp; Verifikasi KTA
                    </span>
                  </div>

                  <Card className="bg-white dark:bg-card rounded-xl border-slate-200 dark:border-border shadow-none text-center flex-1 flex flex-col items-center justify-center">
                    <CardContent className="p-4 flex flex-col items-center justify-center">
                      <Armchair className="w-7 h-7 text-[#166534] dark:text-emerald-400 mb-1" />
                      <span className="text-xs font-bold text-slate-800 dark:text-foreground">Area Baca Lesehan Santri</span>
                      <p className="text-[11px] text-slate-500 dark:text-muted-foreground max-w-xs mt-0.5">
                        Karpet empuk, meja rendah, dan pencahayaan sejuk untuk telaah kitab santri.
                      </p>
                    </CardContent>
                  </Card>

                  <div className="p-2.5 bg-amber-50 dark:bg-amber-950/30 border border-amber-200 dark:border-amber-800/80 rounded-xl flex items-center justify-between text-xs">
                    <div className="flex items-center gap-1.5 text-amber-900 dark:text-amber-200 font-bold">
                      <DoorClosed className="w-4 h-4" />
                      <span>Pintu Masuk Lt. 2</span>
                    </div>
                    <span className="text-[10px] bg-white dark:bg-card px-2 py-0.5 rounded font-mono text-amber-900 dark:text-amber-200 font-semibold border border-amber-200 dark:border-amber-800">
                      Terminal OPAC #1 &amp; #2
                    </span>
                  </div>
                </div>

                {/* Right Side: Rak C, D & E */}
                <div className="md:col-span-4 flex flex-col gap-2.5">
                  {(["C", "D", "E"] as const).map((key) => (
                    <ZoneCardItem
                      key={key}
                      zone={ZONE_INFO_DATA[key]}
                      selected={selectedZone === key}
                      onSelect={setSelectedZone}
                      compact
                    />
                  ))}
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Zone Detail Panel */}
          <Card className="bg-white dark:bg-card border-slate-200 dark:border-border shadow-none">
            <CardContent className="p-4 space-y-3">
              <div className="flex flex-wrap items-center justify-between gap-2 border-b border-slate-100 dark:border-border pb-2">
                <div className="flex items-center gap-2">
                  <span className="w-7 h-7 rounded-lg bg-[#166534] dark:bg-primary text-white dark:text-primary-foreground flex items-center justify-center font-bold text-sm">
                    {zone.badge}
                  </span>
                  <h4 className="text-sm font-bold text-slate-900 dark:text-foreground">{zone.title}</h4>
                </div>
                <Button
                  type="button"
                  size="sm"
                  onClick={handleApplyFilter}
                  className="bg-emerald-100 hover:bg-emerald-200 text-[#166534] dark:bg-emerald-950/60 dark:hover:bg-emerald-900/60 dark:text-emerald-300 text-xs font-bold"
                >
                  Tampilkan Buku Rak Ini di Katalog
                </Button>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
                <div className="p-2.5 rounded-lg bg-slate-50 dark:bg-muted/40">
                  <span className="text-slate-500 dark:text-muted-foreground block mb-0.5 font-medium">Kapasitas &amp; Kondisi Rak:</span>
                  <span className="font-bold text-slate-900 dark:text-foreground">{zone.capacity}</span>
                </div>
                <div className="p-2.5 rounded-lg bg-slate-50 dark:bg-muted/40">
                  <span className="text-slate-500 dark:text-muted-foreground block mb-0.5 font-medium">Rekomendasi Jenjang:</span>
                  <span className="font-bold text-slate-900 dark:text-foreground">{zone.target}</span>
                </div>
                <div className="p-2.5 rounded-lg bg-slate-50 dark:bg-muted/40">
                  <span className="text-slate-500 dark:text-muted-foreground block mb-0.5 font-medium">Kategori Materi Pokok:</span>
                  <span className="font-bold text-slate-900 dark:text-foreground">{zone.categories}</span>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Footer */}
        <div className="p-4 bg-slate-50 dark:bg-muted/30 border-t border-slate-100 dark:border-border flex items-center justify-between">
          <span className="text-xs text-slate-500 dark:text-muted-foreground hidden sm:inline">
            Perpustakaan Gedung Literasi Lt. 2 Ar-Rasyid • Bersih, Tenang &amp; Rapi
          </span>
          <Button
            type="button"
            size="sm"
            onClick={() => onOpenChange(false)}
            className="bg-[#166534] hover:bg-[#14532d] dark:bg-primary dark:hover:bg-primary-hover text-white dark:text-primary-foreground text-xs ml-auto shadow-xs"
          >
            Tutup Peta Rak
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  )
}
