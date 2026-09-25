import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { AUTH_CONFIG } from "../constants/auth.constants";

export function LoginHeader() {
  return (
    <div className="mb-3 flex items-center justify-between">
      <Link
        href={AUTH_CONFIG.opacUrl}
        className="inline-flex items-center gap-2 rounded-lg border border-emerald-200 bg-emerald-50/80 px-3 py-2 text-xs sm:text-sm font-medium text-emerald-800 shadow-xs transition-all hover:bg-emerald-100 hover:text-emerald-950 active:scale-[0.99]"
      >
        <ArrowLeft className="h-4 w-4" />
        <span>Kembali ke Katalog OPAC Siswa</span>
      </Link>
      <span className="hidden text-[11px] font-medium text-slate-500 sm:inline">
        Portal Madrasah
      </span>
    </div>
  );
}
