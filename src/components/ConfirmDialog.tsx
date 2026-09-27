"use client";

import * as React from "react";
import { AlertTriangle, CheckCircle2 } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

export type ConfirmDialogVariant = "danger" | "success" | "warning";

export interface ConfirmDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  title: React.ReactNode;
  description: React.ReactNode;
  confirmLabel?: string;
  cancelLabel?: string;
  variant?: ConfirmDialogVariant;
  icon?: React.ReactNode;
  onConfirm: () => void;
  isLoading?: boolean;
  className?: string;
}

const variantStyles: Record<
  ConfirmDialogVariant,
  { iconBg: string; iconColor: string; confirmBtn: string; defaultIcon: React.ReactElement }
> = {
  danger: {
    iconBg: "bg-rose-100",
    iconColor: "text-rose-600",
    confirmBtn: "bg-rose-600 hover:bg-rose-700 text-white font-bold",
    defaultIcon: <AlertTriangle className="w-6 h-6" />,
  },
  success: {
    iconBg: "bg-emerald-100",
    iconColor: "text-emerald-700",
    confirmBtn: "bg-emerald-700 hover:bg-emerald-800 text-white font-bold",
    defaultIcon: <CheckCircle2 className="w-6 h-6" />,
  },
  warning: {
    iconBg: "bg-amber-100",
    iconColor: "text-amber-700",
    confirmBtn: "bg-amber-600 hover:bg-amber-700 text-white font-bold",
    defaultIcon: <AlertTriangle className="w-6 h-6" />,
  },
};

export function ConfirmDialog({
  open,
  onOpenChange,
  title,
  description,
  confirmLabel,
  cancelLabel = "Batal",
  variant = "danger",
  icon,
  onConfirm,
  isLoading = false,
  className,
}: ConfirmDialogProps) {
  const currentVariant = variantStyles[variant];

  const defaultConfirmLabel =
    confirmLabel ||
    (variant === "danger"
      ? "Ya, Lanjutkan"
      : variant === "success"
      ? "Ya, Aktifkan"
      : "Lanjutkan");

  const handleConfirm = () => {
    onConfirm();
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent
        hideClose
        className={cn(
          "max-w-md p-0 rounded-2xl bg-white dark:bg-card border-slate-200 dark:border-border overflow-hidden",
          className
        )}
      >
        <div className="p-6 text-center space-y-3">
          {/* Status Icon */}
          <div
            className={cn(
              "mx-auto w-12 h-12 rounded-full flex items-center justify-center shrink-0",
              currentVariant.iconBg,
              currentVariant.iconColor
            )}
          >
            {icon ?? currentVariant.defaultIcon}
          </div>

          <DialogHeader className="text-center space-y-1 p-0">
            <DialogTitle className="font-bold text-slate-900 dark:text-foreground text-base text-center">
              {title}
            </DialogTitle>
            <DialogDescription className="text-xs text-slate-600 dark:text-muted-foreground leading-relaxed text-center">
              {description}
            </DialogDescription>
          </DialogHeader>
        </div>

        <DialogFooter className="p-4 border-t border-slate-100 dark:border-border flex items-center justify-center gap-3 bg-slate-50 dark:bg-slate-900/60">
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={() => onOpenChange(false)}
            disabled={isLoading}
            className="text-xs font-semibold text-slate-600 dark:text-slate-300 hover:bg-slate-200/60 dark:hover:bg-slate-800"
          >
            {cancelLabel}
          </Button>
          <Button
            type="button"
            size="sm"
            onClick={handleConfirm}
            disabled={isLoading}
            className={cn("text-xs shadow-xs cursor-pointer", currentVariant.confirmBtn)}
          >
            {isLoading ? "Memproses..." : defaultConfirmLabel}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
