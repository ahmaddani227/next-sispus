export function DashboardFooter() {
  return (
    <footer className="flex h-11 shrink-0 flex-col sm:flex-row items-center justify-between border-t border-slate-200 bg-white px-4 sm:px-8 py-2 text-[11px] text-slate-500 gap-1">
      <div>SIPUS Ar-Rasyid v2.4 &bull; Sistem Manajemen Perpustakaan MI &amp; MTs</div>
      <div className="flex items-center gap-4">
        <span className="font-medium text-emerald-700 flex items-center gap-1.5">
          <span className="h-1.5 w-1.5 rounded-full bg-emerald-600 inline-block" />
          Server Terhubung
        </span>
        <span className="text-slate-500">
          &circlearrowright; Sinkronisasi Otomatis: Aktif
        </span>
      </div>
    </footer>
  );
}
