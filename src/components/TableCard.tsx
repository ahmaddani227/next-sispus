"use client";

import {ReactNode, HTMLAttributes}from "react";
import { SearchX } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { TableRow, TableCell } from "@/components/ui/table";
import { cn } from "@/lib/utils";

export interface TableCardProps extends HTMLAttributes<HTMLDivElement> {
  children: ReactNode;
}

// Main Contentent
export function TableCard({ children, className, ...props }: TableCardProps) {
  return (
    <Card
      className={cn(
        "rounded-xl border border-slate-200 shadow-xs overflow-hidden flex flex-col bg-white",
        className
      )}
      {...props}
    >
      {children}
    </Card>
  );
}

// Table Card Header
export interface TableCardHeaderProps {
  title: ReactNode;
  description?: ReactNode;
  badge?: ReactNode;
  actions?: ReactNode;
  className?: string;
}

export function TableCardHeader({
  title,
  description,
  badge,
  actions,
  className,
}: TableCardHeaderProps) {
  return (
    <div
      className={cn(
        "p-4 sm:p-5 border-b border-slate-100 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 bg-white",
        className
      )}
    >
      <div>
        <div className="flex flex-wrap items-center gap-2">
          <h3 className="font-bold text-slate-900 text-sm">{title}</h3>
          {badge}
        </div>
        {description && (
          <div className="text-xs text-slate-500 mt-1">{description}</div>
        )}
      </div>

      {actions && (
        <div className="flex items-center gap-2 shrink-0">{actions}</div>
      )}
    </div>
  );
}

// Table Empty State
export interface TableEmptyStateProps {
  icon?: ReactNode;
  title?: string;
  description?: string;
  action?: ReactNode;
  colSpan?: number;
  asTableRow?: boolean;
  className?: string;
}

export function TableEmptyState({
  icon,
  title = "Tidak ada data ditemukan",
  description = "Coba sesuaikan kata kunci pencarian atau ubah filter Anda.",
  action,
  colSpan,
  asTableRow = false,
  className,
}: TableEmptyStateProps) {
  const content = (
    <div
      className={cn(
        "flex flex-col items-center justify-center text-center p-8 sm:p-12",
        className
      )}
    >
      <div className="mx-auto w-12 h-12 rounded-full bg-slate-100 text-slate-400 flex items-center justify-center mb-3">
        {icon ?? <SearchX className="w-6 h-6 stroke-[1.5]" />}
      </div>
      <h4 className="text-sm font-bold text-slate-800">{title}</h4>
      {description && (
        <p className="text-xs text-slate-500 mt-1 max-w-sm mx-auto leading-relaxed">
          {description}
        </p>
      )}
      {action && <div className="mt-3.5">{action}</div>}
    </div>
  );

  if (asTableRow && colSpan) {
    return (
      <TableRow className="hover:bg-transparent">
        <TableCell colSpan={colSpan} className="p-0">
          {content}
        </TableCell>
      </TableRow>
    );
  }

  return content;
}

// Table Pagination
export interface TablePaginationProps {
  currentCount?: number;
  totalCount: number;
  currentRange?: string;
  itemLabel?: string;
  currentPage?: number;
  totalPages?: number;
  onPageChange?: (page: number) => void;
  className?: string;
}

export function TablePagination({
  currentCount,
  totalCount,
  currentRange,
  itemLabel = "data",
  currentPage = 1,
  totalPages = 1,
  onPageChange,
  className,
}: TablePaginationProps) {
  const displayRange =
    currentRange ||
    (totalCount === 0
      ? "0"
      : currentCount !== undefined
      ? `1 - ${currentCount}`
      : `1 - ${totalCount}`);

  return (
    <div
      className={cn(
        "p-4 bg-slate-50 border-t border-slate-200 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-slate-600 select-none",
        className
      )}
    >
      <div>
        Menampilkan <span className="font-bold text-slate-900">{displayRange}</span>{" "}
        dari <span className="font-bold text-slate-900">{totalCount}</span> {itemLabel}{" "}
        terdaftar
      </div>

      <div className="inline-flex items-center gap-1">
        <Button
          type="button"
          variant="outline"
          size="sm"
          disabled={currentPage <= 1}
          onClick={() => onPageChange?.(currentPage - 1)}
          className="h-8 px-2.5 text-xs text-slate-600 bg-white border-slate-200 disabled:opacity-50 hover:bg-slate-100"
        >
          Sebelumnya
        </Button>

        <Button
          type="button"
          size="sm"
          className="h-8 px-3 text-xs font-bold text-white bg-emerald-700 hover:bg-emerald-800"
        >
          {currentPage}
        </Button>

        {totalPages > 1 && (
          <>
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={() => onPageChange?.(2)}
              className="h-8 px-3 text-xs bg-white text-slate-700 hover:bg-slate-50 border-slate-200"
            >
              2
            </Button>
            {totalPages > 2 && <span className="px-1 text-slate-400">...</span>}
          </>
        )}

        <Button
          type="button"
          variant="outline"
          size="sm"
          disabled={currentPage >= totalPages}
          onClick={() => onPageChange?.(currentPage + 1)}
          className="h-8 px-2.5 text-xs text-slate-600 bg-white border-slate-200 disabled:opacity-50 hover:bg-slate-100"
        >
          Selanjutnya
        </Button>
      </div>
    </div>
  );
}
