"use client";

import { Calendar, Menu, QrCode } from "lucide-react";
import { UserRole } from "@/types/dashboard";
import { cn } from "@/lib/utils";

interface TopbarProps {
  onToggleSidebar: () => void;
  selectedRole: UserRole;
  onSelectRole: (role: UserRole) => void;
}

export function Topbar({
  onToggleSidebar,
  selectedRole,
  onSelectRole,
}: TopbarProps) {
  const roles: { id: UserRole; label: string }[] = [
    { id: "ADMIN", label: "Admin" },
    { id: "PETUGAS", label: "Petugas" },
    { id: "KEPALA_PERPUSTAKAAN", label: "Kepala Perpus" },
  ];

  return (
    <header className="sticky top-0 z-30 flex h-16 shrink-0 items-center justify-between border-b border-slate-200 bg-white/95 px-4 sm:px-8 backdrop-blur-xs">
      {/* Left: Mobile Toggle + Title & Role Selector */}
      <div className="flex items-center gap-3">
        <button
          type="button"
          onClick={onToggleSidebar}
          className="flex h-9 w-9 items-center justify-center rounded-md border border-slate-200 text-slate-600 hover:bg-slate-100 lg:hidden"
          aria-label="Buka navigasi menu"
        >
          <Menu className="h-5 w-5" />
        </button>

        <div className="flex items-center gap-2.5">
          <h2 className="font-headline-sm text-sm sm:text-base font-bold text-slate-900">
            Dashboard Utama
          </h2>
          <span className="hidden text-slate-300 sm:inline">|</span>
          <span className="hidden rounded-full bg-emerald-50 px-2.5 py-0.5 text-xs font-semibold text-emerald-800 border border-emerald-200/50 sm:inline-block">
            Beranda
          </span>
        </div>

        {/* Role Switcher (PRD Section 2: ADMIN, PETUGAS, KEPALA_PERPUSTAKAAN) */}
        <div className="hidden xl:flex items-center gap-1.5 ml-4 pl-4 border-l border-slate-200">
          <span className="text-xs font-medium text-slate-500">
            Hak Akses:
          </span>
          <div className="inline-flex rounded-md border border-slate-200 bg-slate-100 p-0.5 text-xs font-medium">
            {roles.map((r) => (
              <button
                key={r.id}
                type="button"
                onClick={() => onSelectRole(r.id)}
                className={cn(
                  "rounded-xs px-2.5 py-1 text-xs transition-all",
                  selectedRole === r.id
                    ? "bg-white font-bold text-emerald-800 shadow-xs"
                    : "text-slate-600 hover:text-slate-900"
                )}
              >
                {r.label}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Right: Academic Year, Date, and Quick Action */}
      <div className="flex items-center gap-2.5 sm:gap-3">
        <div className="hidden md:inline-flex items-center rounded-md border border-slate-200 bg-slate-50 px-2.5 py-1 text-xs font-medium text-slate-700">
          T.A 2024/2025 Semester Ganjil
        </div>

        <div className="hidden sm:flex items-center gap-2 rounded-md border border-slate-200 bg-slate-50 px-3 py-1.5 text-xs font-semibold text-slate-700">
          <Calendar className="h-4 w-4 text-emerald-700" />
          <span>Kamis, 24 Oktober 2024</span>
        </div>

        <button
          type="button"
          className="inline-flex items-center gap-1.5 rounded-md bg-emerald-800 px-3 py-1.5 text-xs font-semibold text-white shadow-xs transition-colors hover:bg-emerald-700 active:bg-emerald-900"
          title="Buka Quick Scanner Sirkulasi"
        >
          <QrCode className="h-4 w-4" />
          <span className="hidden sm:inline">Scan Sirkulasi</span>
        </button>
      </div>
    </header>
  );
}
