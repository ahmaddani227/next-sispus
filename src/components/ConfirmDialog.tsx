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
    iconBg: "bg-rose-100 dark:bg-rose-950/60",
    iconColor: "text-rose-600 dark:text-rose-400",
    confirmBtn: "bg-destructive text-destructive-foreground hover:bg-destructive/90 font-bold",
    defaultIcon: <AlertTriangle className="w-6 h-6" />,
  },
  success: {
    iconBg: "bg-emerald-100 dark:bg-emerald-950/60",
    iconColor: "text-emerald-700 dark:text-emerald-400",
    confirmBtn: "bg-primary text-primary-foreground hover:bg-primary-hover font-bold",
    defaultIcon: <CheckCircle2 className="w-6 h-6" />,
  },
  warning: {
    iconBg: "bg-amber-100 dark:bg-amber-950/60",
    iconColor: "text-amber-700 dark:text-amber-400",
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
          "max-w-md p-0 rounded-2xl overflow-hidden",
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
            <DialogTitle className="font-bold text-base text-center">
              {title}
            </DialogTitle>
            <DialogDescription className="text-xs leading-relaxed text-center">
              {description}
            </DialogDescription>
          </DialogHeader>
        </div>

        <DialogFooter className="p-4 border-t border-border flex items-center justify-center gap-3 bg-muted/40">
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={() => onOpenChange(false)}
            disabled={isLoading}
            className="text-xs font-semibold"
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
