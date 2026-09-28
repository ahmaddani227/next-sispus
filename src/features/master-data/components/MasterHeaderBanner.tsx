"use client";

import { Download, Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { HeaderBanner } from "@/components/HeaderBanner";

interface MasterHeaderBannerProps {
  onExportCSV: () => void;
  onOpenCreateModal: () => void;
}

export function MasterHeaderBanner({
  onExportCSV,
  onOpenCreateModal,
}: MasterHeaderBannerProps) {
  return (
    <HeaderBanner
      title="Master Data Sistem"
      description="Pengaturan & konfigurasi master data lokasi rak fisik, mitra penerbit katalog, serta jenjang rombel kelas MI & MTs Ar-Rasyid."
      actions={
        <>
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={onExportCSV}
            className="bg-slate-100 hover:bg-slate-200 border-slate-200 text-xs font-semibold shadow-2xs gap-1.5 h-auto py-2 px-3.5"
          >
            <Download className="w-4 h-4 text-slate-500" />
            <span className="text-slate-700">Ekspor Data (CSV/Excel)</span>
          </Button>

          <Button
            type="button"
            size="sm"
            onClick={onOpenCreateModal}
            className="bg-[#166534] hover:bg-[#14532d] text-white text-xs font-bold shadow-xs gap-1.5 h-auto py-2 px-4"
          >
            <Plus className="w-4 h-4 text-emerald-200" />
            <span>Tambah Master Data Baru</span>
          </Button>
        </>
      }
    />
  );
}
