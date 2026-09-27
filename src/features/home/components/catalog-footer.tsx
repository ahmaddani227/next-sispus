"use client"

import { BookOpen, Clock, MapPin, Mail, MessageSquare } from "lucide-react"

export function CatalogFooter() {
  return (
    <footer className="w-full bg-white dark:bg-card shadow-[0_-1px_8px_rgba(0,0,0,0.03)] mt-auto border-t border-slate-200 dark:border-border">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 grid grid-cols-1 md:grid-cols-3 gap-8">
        {/* Col 1 */}
        <div className="space-y-3">
          <div className="flex items-center gap-2">
            <BookOpen className="w-5 h-5 text-[#166534] dark:text-emerald-400" />
            <h3 className="text-base font-bold text-[#166534] dark:text-emerald-400">Perpustakaan Ar-Rasyid</h3>
          </div>
          <p className="text-xs text-slate-500 dark:text-muted-foreground leading-relaxed">
            Layanan katalog terpadu peminjaman literatur, kitab turats, dan referensi akademik siswa serta
            dewan asatidz Madrasah Ibtidaiyah dan Madrasah Tsanawiyah Ar-Rasyid.
          </p>
        </div>

        {/* Col 2 */}
        <div className="space-y-3">
          <div className="flex items-center gap-2">
            <Clock className="w-4 h-4 text-emerald-800 dark:text-emerald-400" />
            <h4 className="text-xs font-bold text-slate-800 dark:text-slate-200">Jam Buka &amp; Kunjungan</h4>
          </div>
          <ul className="space-y-1.5 text-xs text-slate-500 dark:text-muted-foreground">
            <li className="flex justify-between pb-1 border-b border-slate-100 dark:border-border">
              <span className="font-medium">Senin - Kamis</span>
              <span className="font-mono text-slate-800 dark:text-slate-200 font-semibold">07:30 - 15:30 WIB</span>
            </li>
            <li className="flex justify-between pb-1 border-b border-slate-100 dark:border-border">
              <span className="font-medium">Sabtu</span>
              <span className="font-mono text-slate-800 dark:text-slate-200 font-semibold">07:30 - 11:30 WIB</span>
            </li>
            <li className="flex justify-between pb-1 border-b border-slate-100 dark:border-border">
              <span className="font-medium">Ahad</span>
              <span className="font-mono text-slate-800 dark:text-slate-200 font-semibold">08:00 - 14:00 WIB</span>
            </li>
            <li className="flex justify-between text-rose-600 dark:text-rose-400 font-semibold">
              <span>Jum&apos;at &amp; Hari Libur Nasional</span>
              <span>Tutup</span>
            </li>
          </ul>
        </div>

        {/* Col 3 */}
        <div className="space-y-3">
          <div className="flex items-center gap-2">
            <MessageSquare className="w-4 h-4 text-emerald-800 dark:text-emerald-400" />
            <h4 className="text-xs font-bold text-slate-800 dark:text-slate-200">Kontak &amp; Layanan Pustakawan</h4>
          </div>
          <div className="space-y-2 text-xs text-slate-500 dark:text-muted-foreground">
            <div className="flex items-center gap-2">
              <MapPin className="w-4 h-4 text-[#166534] dark:text-emerald-400 shrink-0" />
              <span>Gedung Literasi Lt. 2 Kampus Madrasah Ar-Rasyid</span>
            </div>
            <div className="flex items-center gap-2">
              <Mail className="w-4 h-4 text-[#166534] dark:text-emerald-400 shrink-0" />
              <span className="font-mono text-slate-700 dark:text-slate-300">perpustakaan@ar-rasyid.sch.id</span>
            </div>
            
          </div>
        </div>
      </div>

      {/* Bottom Bar */}
      <div className="bg-slate-50 dark:bg-slate-900/60 py-3 border-t border-slate-100 dark:border-border">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-2 text-xs text-slate-500 dark:text-muted-foreground">
          <span>© 2026 Perpustakaan MI &amp; MTs Ar-Rasyid. Hak Cipta Dilindungi.</span>
          <span>Sistem Informasi Perpustakaan &amp; Katalog Publik Terbuka (OPAC)</span>
        </div>
      </div>
    </footer>
  )
}
