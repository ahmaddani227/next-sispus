"use client"

import * as React from "react"
import { Scale, VolumeX, Library, UtensilsCrossed, BookOpenCheck, GraduationCap, BookOpen, PenLine, X } from "lucide-react"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"

const ADAB_RULES = [
  {
    id: 1,
    title: "1. Ketenangan & Kekhusyukan",
    desc: "Menjaga suasana ruang baca tetap tenang, tidak bercanda keras atau berlarian demi kenyamanan santri yang sedang muthala'ah kitab.",
    icon: VolumeX,
    iconBg: "bg-emerald-100 text-[#166534]",
  },
  {
    id: 2,
    title: "2. Letakkan di Meja Pengembalian",
    desc: (
      <>
        Jika ragu letak posisi rak asal buku yang baru dibaca, letakkan di{" "}
        <strong className="text-slate-800">Meja Pengembalian Sementara</strong>. Jangan menyisipkan di sembarang rak.
      </>
    ),
    icon: Library,
    iconBg: "bg-emerald-100 text-[#166534]",
  },
  {
    id: 3,
    title: "3. Larangan Makanan & Minuman",
    desc: "Dilarang membawa makanan, snack berminyak, minuman terbuka, atau benda tajam ke dalam area buku untuk menjaga kebersihan koleksi.",
    icon: UtensilsCrossed,
    iconBg: "bg-rose-100 text-rose-700",
  },
  {
    id: 4,
    title: "4. Menjaga Keutuhan & Kemuliaan Kitab",
    desc: "Dilarang melipat halaman, mencoret menggunakan pulpen/stabilo permanen, merobek, atau merusak sampul buku perpustakaan.",
    icon: BookOpenCheck,
    iconBg: "bg-amber-100 text-amber-800",
  },
]

interface RulesDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
}

export function RulesDialog({ open, onOpenChange }: RulesDialogProps) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent hideClose className="max-w-4xl p-0 overflow-hidden rounded-2xl border-none">
        {/* Header */}
        <DialogHeader className="bg-[#166534] px-6 py-4 flex flex-row items-center justify-between text-white space-y-0">
          <div className="flex items-center gap-2.5">
            <Scale className="w-6 h-6 text-emerald-200" />
            <div>
              <DialogTitle className="font-bold text-base text-white">
                Tata Tertib &amp; Adab Perpustakaan Madrasah
              </DialogTitle>
              <p className="text-xs text-emerald-100">
                Membangun Budaya Membaca yang Barakah, Disiplin, dan Menghormati Ilmu
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
        <div className="p-6 space-y-4 max-h-[80vh] overflow-y-auto">
          {/* 4 Adab Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {ADAB_RULES.map((adab) => {
              const Icon = adab.icon
              return (
                <Card key={adab.id} className="bg-white border-slate-200 shadow-xs rounded-xl">
                  <CardContent className="p-3.5 flex items-start gap-3">
                    <div className={`w-10 h-10 rounded-lg ${adab.iconBg} flex items-center justify-center shrink-0`}>
                      <Icon className="w-5 h-5" />
                    </div>
                    <div>
                      <h5 className="font-bold text-xs text-slate-900">{adab.title}</h5>
                      <p className="text-xs text-slate-500 mt-0.5 leading-relaxed">{adab.desc}</p>
                    </div>
                  </CardContent>
                </Card>
              )
            })}
          </div>

          {/* Sanksi Edukatif */}
          <Card className="bg-emerald-50 border-emerald-300 shadow-none rounded-xl">
            <CardContent className="p-4 space-y-2">
              <div className="flex items-center gap-2 text-[#166534] font-bold">
                <GraduationCap className="w-5 h-5" />
                <h5 className="text-xs font-bold">Prinsip Sanksi Edukatif Islami (Tanpa Denda Uang Tunai)</h5>
              </div>
              <p className="text-xs text-emerald-950 leading-relaxed">
                Perpustakaan Madrasah Ar-Rasyid mendidik kedisiplinan berlandaskan akhlakul karimah. Keterlambatan pengembalian buku <strong className="text-emerald-900">tidak dikenai denda uang tunai</strong>, melainkan sanksi edukatif yang menumbuhkan kecintaan pada ilmu:
              </p>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs text-emerald-900 pt-1">
                <div className="flex items-start gap-2 bg-white/80 p-2.5 rounded-lg border border-emerald-200">
                  <BookOpen className="w-4 h-4 text-[#166534] shrink-0 mt-0.5" />
                  <span>
                    <strong className="text-emerald-950">Terlambat 1 - 3 Hari:</strong> Membaca dan menyimak tadarus Al-Qur&apos;an surat pilihan bersama pustakawan.
                  </span>
                </div>
                <div className="flex items-start gap-2 bg-white/80 p-2.5 rounded-lg border border-emerald-200">
                  <PenLine className="w-4 h-4 text-[#166534] shrink-0 mt-0.5" />
                  <span>
                    <strong className="text-emerald-950">Terlambat &gt; 3 Hari:</strong> Menulis rangkuman 1 halaman dari intisari buku yang dipinjam sebagai pengayaan.
                  </span>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Footer */}
        <div className="p-4 bg-slate-50 border-t border-slate-100 flex items-center justify-between">
          <span className="text-xs text-slate-500 italic hidden sm:inline">
            &ldquo;Ilmu itu ibarat buruan, dan tulisan adalah pengikatnya.&rdquo; — Imam Asy-Syafi&apos;i
          </span>
          <Button
            type="button"
            size="sm"
            onClick={() => onOpenChange(false)}
            className="bg-[#166534] hover:bg-[#14532d] text-white text-xs ml-auto shadow-xs"
          >
            Saya Paham &amp; Siap Mematuhi
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  )
}
