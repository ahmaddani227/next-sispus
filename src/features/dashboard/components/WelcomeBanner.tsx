import { HeaderBanner } from "@/components/HeaderBanner";

interface WelcomeBannerProps {
  borrowedCount?: number;
  overdueCount?: number;
  officerName?: string;
}

export function WelcomeBanner({
  borrowedCount = 235,
  overdueCount = 4,
  officerName = "Ustadzah Siti Rahmawati",
}: WelcomeBannerProps) {
  return (
    <HeaderBanner
      variant="gradient"
      badge={
        <span className="rounded bg-emerald-700/80 px-2.5 py-0.5 text-[11px] font-semibold tracking-wide uppercase text-emerald-100">
          Petugas Hari Ini
        </span>
      }
      title={`Selamat Bertugas, ${officerName}`}
      actions={
        <div className="flex shrink-0 items-center justify-around sm:justify-start gap-4 rounded-xl border border-emerald-700/50 bg-emerald-950/40 p-3 sm:p-4 backdrop-blur-xs">
          <div className="text-right">
            <p className="text-[11px] font-medium text-emerald-200">
              Buku Dipinjam
            </p>
            <p className="font-data-mono text-2xl font-extrabold text-white">
              {borrowedCount}{" "}
              <span className="text-xs font-normal text-emerald-200 font-sans">
                eks
              </span>
            </p>
          </div>

          <div className="h-10 w-px bg-emerald-700/60" />

          <div className="text-right">
            <p className="text-[11px] font-medium text-emerald-200">
              Perlu Tindak Lanjut
            </p>
            <p className="font-data-mono text-2xl font-extrabold text-amber-300">
              {overdueCount}{" "}
              <span className="text-xs font-normal text-emerald-200 font-sans">
                terlambat
              </span>
            </p>
          </div>
        </div>
      }
    />
  );
}
