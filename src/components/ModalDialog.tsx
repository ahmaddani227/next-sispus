"use client";

import * as React from "react";
import { X } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { cn } from "@/lib/utils";

export type ModalDialogSize = "sm" | "md" | "lg" | "xl";

export interface ModalDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  title: React.ReactNode;
  description?: React.ReactNode;
  icon?: React.ReactNode;
  iconBgClass?: string;
  headerBadge?: React.ReactNode;
  size?: ModalDialogSize;
  children: React.ReactNode;
  footer?: React.ReactNode;
  className?: string;
  contentClassName?: string;
  hideClose?: boolean;
}

const sizeClasses: Record<ModalDialogSize, string> = {
  sm: "max-w-sm",
  md: "max-w-md",
  lg: "max-w-2xl",
  xl: "max-w-3xl",
};

export function ModalDialog({
  open,
  onOpenChange,
  title,
  description,
  icon,
  iconBgClass = "bg-emerald-100 text-emerald-800",
  headerBadge,
  size = "lg",
  children,
  footer,
  className,
  contentClassName,
  hideClose = false,
}: ModalDialogProps) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent
        hideClose
        className={cn(
          "max-h-[90vh] overflow-hidden p-0 rounded-2xl flex flex-col",
          sizeClasses[size],
          className
        )}
      >
        {/* Modal Header */}
        <DialogHeader className="p-5 px-6 border-b border-border bg-muted/40 flex flex-row items-center justify-between space-y-0 shrink-0">
          <div className="flex items-center gap-2.5">
            {icon && (
              <div
                className={cn(
                  "w-8 h-8 rounded-lg flex items-center justify-center font-bold text-sm shrink-0",
                  iconBgClass
                )}
              >
                {icon}
              </div>
            )}
            <div>
              <div className="flex items-center gap-2">
                {headerBadge}
                <DialogTitle className="font-bold text-foreground text-base leading-tight">
                  {title}
                </DialogTitle>
              </div>
              {description && (
                <DialogDescription className="text-xs text-muted-foreground mt-0.5">
                  {description}
                </DialogDescription>
              )}
            </div>
          </div>

          {!hideClose && (
            <button
              type="button"
              onClick={() => onOpenChange(false)}
              className="p-1 rounded-lg text-muted-foreground hover:text-foreground hover:bg-muted transition-colors focus:outline-none cursor-pointer"
              title="Tutup"
            >
              <X className="w-5 h-5" />
              <span className="sr-only">Tutup</span>
            </button>
          )}
        </DialogHeader>

        {/* Modal Scrollable Body */}
        <div className={cn("overflow-y-auto flex-1", contentClassName)}>
          {children}
        </div>

        {/* Modal Footer */}
        {footer && (
          <div className="p-4 px-6 border-t border-border flex items-center justify-end gap-2.5 bg-muted/40 shrink-0">
            {footer}
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}
