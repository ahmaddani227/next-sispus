"use client";

import { MetricCards } from "@/components/MetricCards";
import { WelcomeBanner } from "./WelcomeBanner";
import { RecentTransactions } from "./RecentTransactions";
import { useDashboard } from "../hooks/useDashboard";
import { useAuthUser } from "@/features/auth/hooks/useAuthUser";

export function Dashboard() {
  const { user } = useAuthUser();
  const {
    transactions,
    metrics,
    stats,
    handleProcessReturn,
    handleViewDetail,
  } = useDashboard();

  return (
    <div className="space-y-6">
      <WelcomeBanner
        borrowedCount={stats.totalBorrowedCopies}
        overdueCount={stats.totalOverdueLoans}
        officerName={user?.fullName}
        role={user?.role}
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
    </div>
  );
}
