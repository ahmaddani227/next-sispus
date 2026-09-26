"use client";

import { AlertTriangle } from "lucide-react";
import { MasterItem } from "../types/master-data.types";
import {
  Dialog,
  DialogContent,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";

interface MasterDeleteDialogProps {
  item: MasterItem | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onConfirm: () => void;
}

export function MasterDeleteDialog({
  item,
  open,
  onOpenChange,
  onConfirm,
}: MasterDeleteDialogProps) {
  if (!item) return null;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent hideClose className="max-w-sm p-6 overflow-hidden rounded-2xl border-slate-200">
        <div className="text-center space-y-3">
          <div className="w-12 h-12 rounded-full bg-rose-100 text-rose-600 flex items-center justify-center mx-auto">
            <AlertTriangle className="w-6 h-6" />
          </div>

          <h4 className="text-sm font-bold text-slate-900">
            Hapus Master Data Entitas?
          </h4>

          <p className="text-xs text-slate-500 leading-relaxed">
            Apakah Anda yakin ingin menghapus entitas{" "}
            <strong className="text-slate-800">{item.name}</strong> ({item.code})?
            Tindakan ini dapat memengaruhi integritas relasi buku pada katalog.
          </p>

          <div className="pt-3 flex items-center justify-center gap-2">
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={() => onOpenChange(false)}
              className="bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-semibold"
            >
              Batalkan
            </Button>
            <Button
              type="button"
              size="sm"
              onClick={() => {
                onConfirm();
                onOpenChange(false);
              }}
              className="bg-rose-600 hover:bg-rose-700 text-white text-xs font-bold shadow-xs"
            >
              Ya, Hapus Data
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
