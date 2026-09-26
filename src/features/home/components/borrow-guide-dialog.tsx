"use client"

import { BookOpen, Route, IdCard, CalendarClock, X } from "lucide-react"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"

const BORROW_STEPS = [
  {
    number: 1,
    title: "Cari & Catat No. Rak",
    desc: (
      <>
        Cari judul pada katalog OPAC ini, lalu catat Kode Panggil (misal:{" "}
        <em className="font-mono text-emerald-800">BK-AGM-0182</em>) dan lokasi raknya.
      </>
    ),
  },
  {
    number: 2,
    title: "Ambil Buku di Rak",
    desc: "Menuju ke lorong rak fisik sesuai zona (Rak A s.d. E) dan ambil buku secara berurutan dan tertib.",
  },
  {
    number: 3,
    title: "Tunjukkan KTA",
    desc: "Bawa buku ke Meja Sirkulasi Pustakawan, serahkan Kartu Tanda Anggota (KTA) santri untuk discan petugas.",
  },
  {
    number: 4,
    title: "Masa Pinjam 7 Hari",
    desc: "Buku dapat dipinjam 7 hari kalender dan dapat diperpanjang 1x selama tidak ada antrean santri lain.",
  },
]

interface BorrowGuideDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
}

export function BorrowGuideDialog({
  open,
  onOpenChange,
}: BorrowGuideDialogProps) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent hideClose className="max-w-4xl p-0 overflow-hidden rounded-2xl border-none">
        {/* Header */}
        <DialogHeader className="bg-[#166534] px-6 py-4 flex flex-row items-center justify-between text-white space-y-0">
          <div className="flex items-center gap-2.5">
            <BookOpen className="w-6 h-6 text-emerald-200" />
            <div>
              <DialogTitle className="font-bold text-base text-white">
                Panduan Peminjaman Buku Santri &amp; Siswa
              </DialogTitle>
              <p className="text-xs text-emerald-100">
                Langkah Cepat &amp; Tertib Peminjaman Mandiri di Perpustakaan Ar-Rasyid
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
          {/* 4 Steps */}
          <div>
            <h4 className="text-sm font-bold text-slate-800 mb-3 flex items-center gap-2">
              <Route className="w-4 h-4 text-[#166534]" />
              <span>4 Langkah Mudah Meminjam Buku</span>
            </h4>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
              {BORROW_STEPS.map((step) => (
                <Card key={step.number} className="bg-slate-50 border-slate-200 shadow-none rounded-xl">
                  <CardContent className="p-3.5 flex flex-col justify-between h-full">
                    <div className="w-7 h-7 rounded-full bg-[#166534] text-white flex items-center justify-center font-bold text-xs mb-2 shadow-xs">
                      {step.number}
                    </div>
                    <div>
                      <h5 className="font-bold text-xs text-slate-900 mb-1">{step.title}</h5>
                      <p className="text-xs text-slate-500 leading-relaxed">{step.desc}</p>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>

          {/* Guidelines Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Card className="bg-emerald-50/70 border-emerald-200 shadow-none rounded-xl">
              <CardContent className="p-4 space-y-2">
                <div className="flex items-center gap-2 text-[#166534] font-bold">
                  <IdCard className="w-4 h-4" />
                  <h5 className="text-xs font-bold">Batas Peminjaman Santri &amp; Guru</h5>
                </div>
                <ul className="text-xs text-slate-700 space-y-1.5 list-disc pl-4 leading-relaxed">
                  <li>
                    <strong className="text-slate-900">Santri MI &amp; MTs:</strong> Maksimal 2 (dua) eksemplar buku sekaligus.
                  </li>
                  <li>
                    <strong className="text-slate-900">Dewan Asatidz &amp; Guru:</strong> Maksimal 5 (lima) eksemplar buku materi/referensi.
                  </li>
                  <li>Kitab rujukan langka &amp; kamus tebal (Rak E) hanya untuk baca di tempat/ruang referensi.</li>
                </ul>
              </CardContent>
            </Card>

            <Card className="bg-slate-50 border-slate-200 shadow-none rounded-xl">
              <CardContent className="p-4 space-y-2">
                <div className="flex items-center gap-2 text-slate-800 font-bold">
                  <CalendarClock className="w-4 h-4 text-[#166534]" />
                  <h5 className="text-xs font-bold">Jadwal Operasional Sirkulasi</h5>
                </div>
                <ul className="text-xs text-slate-600 space-y-1.5">
                  <li className="flex justify-between border-b border-slate-200/60 pb-1">
                    <span>Senin - Kamis:</span>
                    <span className="font-bold font-mono text-slate-900">07:30 - 15:30 WIB</span>
                  </li>
                  <li className="flex justify-between border-b border-slate-200/60 pb-1">
                    <span>Sabtu (Pelayanan Cepat):</span>
                    <span className="font-bold font-mono text-slate-900">07:30 - 11:30 WIB</span>
                  </li>
                  <li className="flex justify-between border-b border-slate-200/60 pb-1">
                    <span>Ahad (Koleksi Mandiri):</span>
                    <span className="font-bold font-mono text-slate-900">08:00 - 14:00 WIB</span>
                  </li>
                  <li className="flex justify-between text-rose-600 font-semibold">
                    <span>Jum&apos;at &amp; Libur Resmi:</span>
                    <span>Tutup</span>
                  </li>
                </ul>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Footer */}
        <div className="p-4 bg-slate-50 border-t border-slate-100 flex items-center justify-between">
          <span className="text-xs text-slate-400 hidden sm:inline">
            Pustakawan siap membantu santri yang kesulitan menemukan nomor panggil buku.
          </span>
          <Button
            type="button"
            size="sm"
            onClick={() => onOpenChange(false)}
            className="bg-[#166534] hover:bg-[#14532d] text-white text-xs ml-auto shadow-xs"
          >
            Saya Mengerti, Tutup
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  )
}
