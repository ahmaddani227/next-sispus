"use client";

import { Eye } from "lucide-react";
import { ModalDialog } from "@/components/ModalDialog";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { MasterItem } from "../types/master-data.types";

interface MasterDetailDialogProps {
  item: MasterItem | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function MasterDetailDialog({
  item,
  open,
  onOpenChange,
}: MasterDetailDialogProps) {
  if (!item) return null;

  const isAktif = item.status === "Aktif";

  return (
    <ModalDialog
      open={open}
      onOpenChange={onOpenChange}
      size="md"
      icon={<Eye className="w-4 h-4 text-blue-700" />}
      iconBgClass="bg-blue-100 text-blue-800"
      title="Detail Entitas Master"
      description="Spesifikasi & relasi koleksi katalog"
      footer={
        <Button
          type="button"
          variant="outline"
          size="sm"
          onClick={() => onOpenChange(false)}
          className="bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-semibold rounded-lg"
        >
          Tutup
        </Button>
      }
    >
      <div className="p-6 space-y-3.5">
        {/* Kode Entitas */}
        <div className="flex items-center justify-between p-3 rounded-lg bg-slate-50 border border-slate-100">
          <span className="text-xs font-semibold text-slate-500">
            Kode Entitas
          </span>
          <span className="font-mono text-xs font-bold text-slate-900 bg-white px-2 py-0.5 rounded border border-slate-200">
            {item.code}
          </span>
        </div>

        {/* Nama Lengkap */}
        <div>
          <span className="text-xs font-semibold text-slate-500 block mb-0.5">
            Nama Lengkap Entitas
          </span>
          <p className="text-sm font-bold text-slate-900">{item.name}</p>
        </div>

        {/* Deskripsi */}
        <div>
          <span className="text-xs font-semibold text-slate-500 block mb-0.5">
            Deskripsi / Spesifikasi / Lokasi
          </span>
          <p className="text-xs text-slate-700 bg-slate-50 p-2.5 rounded-lg border border-slate-200 leading-relaxed">
            {item.description}
          </p>
        </div>

        {/* Relasi & Status */}
        <div className="grid grid-cols-2 gap-3 pt-1">
          <div>
            <span className="text-xs font-semibold text-slate-500 block mb-0.5">
              Relasi / Kapasitas
            </span>
            <p className="text-xs font-bold text-emerald-800">
              {item.relation}
            </p>
          </div>
          <div>
            <span className="text-xs font-semibold text-slate-500 block mb-0.5">
              Status Operasional
            </span>
            <Badge
              variant={isAktif ? "success" : "neutral"}
              size="sm"
              className="font-bold"
            >
              {item.status}
            </Badge>
          </div>
        </div>
      </div>
    </ModalDialog>
  );
}
