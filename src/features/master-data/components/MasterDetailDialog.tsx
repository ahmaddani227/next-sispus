"use client";

import { Eye, X } from "lucide-react";
import { MasterItem } from "../types/master-data.types";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

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
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent hideClose className="max-w-md p-0 overflow-hidden rounded-2xl border-slate-200">
        {/* Header */}
        <DialogHeader className="px-6 py-4 border-b border-slate-100 flex flex-row items-center justify-between bg-slate-50/70 space-y-0">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-blue-100 text-blue-800 flex items-center justify-center font-bold">
              <Eye className="w-4 h-4 text-blue-700" />
            </div>
            <div>
              <DialogTitle className="text-sm font-bold text-slate-900">
                Detail Entitas Master
              </DialogTitle>
              <p className="text-xs text-slate-500">
                Spesifikasi &amp; relasi koleksi katalog
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={() => onOpenChange(false)}
            className="p-1 text-slate-400 hover:text-slate-600 rounded-lg hover:bg-slate-200/60 transition-colors"
          >
            <X className="w-5 h-5" />
            <span className="sr-only">Tutup</span>
          </button>
        </DialogHeader>

        {/* Content Body */}
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
                variant="outline"
                className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                  isAktif
                    ? "bg-emerald-50 text-emerald-700 border-emerald-200"
                    : "bg-slate-100 text-slate-600 border-slate-200"
                }`}
              >
                {item.status}
              </Badge>
            </div>
          </div>

          {/* Footer Action */}
          <div className="pt-4 border-t border-slate-100 flex justify-end">
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={() => onOpenChange(false)}
              className="bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-semibold rounded-lg"
            >
              Tutup
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
