"use client";

import { AdminLayout } from "@/components/layout/AdminLayout";
import { MetricCards } from "@/components/MetricCards";
import { WelcomeBanner } from "./WelcomeBanner";
import { RecentTransactions } from "./RecentTransactions";
import { useDashboard } from "../hooks/useDashboard";

export function Dashboard() {
  const {
    transactions,
    metrics,
    stats,
    handleProcessReturn,
    handleViewDetail,
  } = useDashboard();

  return (
    <AdminLayout title="Dashboard">
      <WelcomeBanner
        borrowedCount={stats.totalBorrowedCopies}
        overdueCount={stats.totalOverdueLoans}
      />

      <section aria-labelledby="metric-heading">
        <h2 id="metric-heading" className="sr-only">
          Ringkasan Operasional Perpustakaan
        </h2>
        <MetricCards items={metrics} columns={3} />
      </section>

      {/* Main Content: Recent Transactions Table */}
      <section aria-labelledby="transaksi-heading">
        <h2 id="transaksi-heading" className="sr-only">
          Transaksi dan Sirkulasi Terkini
        </h2>
        <RecentTransactions
          transactions={transactions}
          onProcessReturn={handleProcessReturn}
          onViewDetail={handleViewDetail}
        />
      </section>
    </AdminLayout>
  );
}

