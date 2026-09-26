"use client";

import { AdminLayout } from "@/components/layout/AdminLayout";
import { MetricCards } from "@/components/MetricCards";
import { operationalMetrics } from "../constants/dashboard-data";
import { WelcomeBanner } from "./WelcomeBanner";
import { RecentTransactions } from "./RecentTransactions";

export function Dashboard() {
  return (
    <AdminLayout title="Dashboard">
      <WelcomeBanner />

      <section aria-labelledby="metric-heading">
        <h2 id="metric-heading" className="sr-only">
          Ringkasan Operasional Perpustakaan
        </h2>
        <MetricCards items={operationalMetrics} columns={3} />
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
