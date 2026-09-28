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
          className="bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 text-xs font-semibold rounded-lg"
        >
          Tutup
        </Button>
      }
    >
      <div className="p-6 space-y-3.5">
        {/* Kode Entitas */}
        <div className="flex items-center justify-between p-3 rounded-lg bg-slate-50 dark:bg-slate-900 border border-slate-100 dark:border-border">
          <span className="text-xs font-semibold text-slate-500 dark:text-muted-foreground">
            Kode Entitas
          </span>
          <span className="font-mono text-xs font-bold text-slate-900 dark:text-slate-100 bg-white dark:bg-card px-2 py-0.5 rounded border border-slate-200 dark:border-border">
            {item.code}
          </span>
        </div>

        {/* Nama Lengkap */}
        <div>
          <span className="text-xs font-semibold text-slate-500 dark:text-muted-foreground block mb-0.5">
            Nama Lengkap Entitas
          </span>
          <p className="text-sm font-bold text-slate-900 dark:text-foreground">{item.name}</p>
        </div>

        {/* Deskripsi */}
        <div>
          <span className="text-xs font-semibold text-slate-500 dark:text-muted-foreground block mb-0.5">
            Deskripsi / Spesifikasi / Lokasi
          </span>
          <p className="text-xs text-slate-700 dark:text-slate-200 bg-slate-50 dark:bg-slate-900 p-2.5 rounded-lg border border-slate-200 dark:border-border leading-relaxed">
            {item.description}
          </p>
        </div>

        {/* Relasi & Status */}
        <div className="grid grid-cols-2 gap-3 pt-1">
          <div>
            <span className="text-xs font-semibold text-slate-500 dark:text-muted-foreground block mb-0.5">
              Relasi / Kapasitas
            </span>
            <p className="text-xs font-bold text-emerald-800 dark:text-emerald-400">
              {item.relation}
            </p>
          </div>
          <div>
            <span className="text-xs font-semibold text-slate-500 dark:text-muted-foreground block mb-0.5">
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
