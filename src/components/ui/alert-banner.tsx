"use client";

import * as React from "react";
import { CheckCircle2, X } from "lucide-react";
import { cn } from "@/lib/utils";

interface AlertBannerProps {
  message: string | null;
  onClose: () => void;
  className?: string;
}

export function AlertBanner({ message, onClose, className }: AlertBannerProps) {
  if (!message) return null;

  return (
    <div
      className={cn(
        "transition-all duration-300 animate-in fade-in-50",
        className
      )}
    >
      <div className="p-3 rounded-xl bg-emerald-50 border border-emerald-200 flex items-center justify-between text-xs font-semibold text-emerald-800 shadow-2xs">
        <div className="flex items-center gap-2">
          <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
          <span>{message}</span>
        </div>
        <button
          type="button"
          onClick={onClose}
          className="p-1 rounded text-emerald-600 hover:text-emerald-800 hover:bg-emerald-100/60 transition-colors cursor-pointer"
        >
          <X className="w-4 h-4" />
          <span className="sr-only">Tutup notifikasi</span>
        </button>
      </div>
    </div>
  );
}
