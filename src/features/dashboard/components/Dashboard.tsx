"use client";

import { AdminLayout } from "@/components/layout/AdminLayout";
import { WelcomeBanner } from "./WelcomeBanner";
import { MetricCards } from "./MetricCards";
import { RecentTransactions } from "./RecentTransactions";

export function Dashboard() {
  return (
    <AdminLayout title="Dashboard">
      <WelcomeBanner />

      <section aria-labelledby="metric-heading">
        <h2 id="metric-heading" className="sr-only">
          Ringkasan Operasional Perpustakaan
        </h2>
        <MetricCards />
      </section>

      {/* Main Content: Recent Transactions Table */}
      <section aria-labelledby="transaksi-heading">
        <h2 id="transaksi-heading" className="sr-only">
          Transaksi dan Sirkulasi Terkini
        </h2>
        <RecentTransactions />
      </section>
    </AdminLayout>
  );
}
