"use client";

import { Calendar, Menu, QrCode } from "lucide-react";
import { Button } from "@/components/ui/button";

interface TopbarProps {
  onToggleSidebar: () => void;
}

export function Topbar({
  onToggleSidebar,
}: TopbarProps) {
  return (
    <header className="sticky top-0 z-30 flex h-16 shrink-0 items-center justify-between border-b border-slate-200 bg-white/95 px-4 sm:px-8 backdrop-blur-xs">
      <div className="flex items-center gap-3">
        <Button
          variant="outline"
          size="icon-sm"
          onClick={onToggleSidebar}
          className="lg:hidden text-slate-600"
          aria-label="Buka navigasi menu"
        >
          <Menu className="h-5 w-5" />
        </Button>

        <div className="flex items-center gap-2.5">
          <h2 className="font-headline-sm text-sm sm:text-base font-bold text-slate-900">
            Dashboard
          </h2>
        </div>

      </div>

      <div className="flex items-center gap-2.5 sm:gap-3">
        <div className="hidden sm:flex items-center gap-2 rounded-md border border-slate-200 bg-slate-50 px-3 py-1.5 text-xs font-semibold text-slate-700">
          <Calendar className="h-4 w-4 text-emerald-700" />
          <span>Kamis, 24 Oktober 2024</span>
        </div>

        <Button
          variant="default"
          size="sm"
          className="gap-1.5"
          title="Buka Quick Scanner Sirkulasi"
        >
          <QrCode className="h-4 w-4" />
          <span className="hidden sm:inline">Scan Sirkulasi</span>
        </Button>
      </div>
    </header>
  );
}
