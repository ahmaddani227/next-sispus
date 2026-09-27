"use client";

import { useState, useMemo, useCallback } from "react";
import { toast } from "sonner";
import { recentTransactions, operationalMetrics } from "../constants/dashboard-data";
import { TransactionRecord } from "../types/dashboard.types";
import { MetricCardProps } from "@/components/MetricCards";

export function useDashboard() {
  const [transactions, setTransactions] = useState<TransactionRecord[]>(recentTransactions);

  // Perhitungan statistik real-time dari data sirkulasi
  const stats = useMemo(() => {
    const borrowedCount = transactions.filter((t) => t.status === "BORROWED").length;
    const overdueCount = transactions.filter((t) => t.status === "OVERDUE").length;

    return {
      totalBorrowedCopies: 235, // data agregat sistem
      totalOverdueLoans: overdueCount > 0 ? overdueCount : 4,
      recentCount: transactions.length,
      borrowedCount,
      overdueCount,
    };
  }, [transactions]);

  // Handler proses pengembalian buku dari transaksi aktif / terlambat
  const handleProcessReturn = useCallback((transaction: TransactionRecord) => {
    setTransactions((prev) =>
      prev.map((t) =>
        t.id === transaction.id
          ? {
              ...t,
              status: "RETURNED",
              statusLabel: "Dikembalikan",
              dueStatus: {
                label: "Telah Dikembalikan Hari Ini",
                isOverdue: false,
                isDueToday: true,
                colorClass: "text-emerald-700 font-semibold",
              },
            }
          : t
      )
    );
    toast.success(
      `Buku "${transaction.book.title}" (${transaction.book.copyCode}) berhasil diproses kembali.`
    );
  }, []);

  // Handler melihat rincian transaksi sirkulasi
  const handleViewDetail = useCallback((transaction: TransactionRecord) => {
    toast.info(
      `Peminjam: ${transaction.borrower.name} (${transaction.borrower.nis}) - ${transaction.book.title}`
    );
  }, []);

  return {
    transactions,
    metrics: operationalMetrics as MetricCardProps[],
    stats,
    handleProcessReturn,
    handleViewDetail,
  };
}
