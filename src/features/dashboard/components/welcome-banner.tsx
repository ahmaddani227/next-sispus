export function WelcomeBanner() {

  return (
    <div className="relative overflow-hidden rounded-xl bg-gradient-to-r from-emerald-900 via-emerald-800 to-emerald-900 p-5 sm:p-6 text-white shadow-xs border border-emerald-950/20">
      <div className="flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">
        {/* Left Information */}
        <div className="space-y-2.5">
          <div className="flex flex-wrap items-center gap-2">
            <span className="rounded bg-emerald-700/80 px-2.5 py-0.5 text-[11px] font-semibold tracking-wide uppercase text-emerald-100">
              Petugas Hari Ini
            </span>
          </div>

          <div>
            <h3 className="font-headline-md text-xl sm:text-2xl font-bold tracking-tight text-white">
              Selamat Bertugas, Ustadzah Siti Rahmawati
            </h3>
            
          </div>
        </div>

        {/* Right Counters */}
        <div className="flex shrink-0 items-center justify-around sm:justify-start gap-4 rounded-xl border border-emerald-700/50 bg-emerald-950/40 p-3 sm:p-4 backdrop-blur-xs">
          <div className="text-right">
            <p className="text-[11px] font-medium text-emerald-200">
              Buku Dipinjam
            </p>
            <p className="font-data-mono text-2xl font-extrabold text-white">
              235 <span className="text-xs font-normal text-emerald-200 font-sans">eks</span>
            </p>
          </div>

          <div className="h-10 w-px bg-emerald-700/60" />

          <div className="text-right">
            <p className="text-[11px] font-medium text-emerald-200">
              Perlu Tindak Lanjut
            </p>
            <p className="font-data-mono text-2xl font-extrabold text-amber-300">
              4{" "}
              <span className="text-xs font-normal text-emerald-200 font-sans">
                terlambat
              </span>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
