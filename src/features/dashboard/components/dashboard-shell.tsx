"use client";

import { useState } from "react";
import { Sidebar } from "./sidebar";
import { Topbar } from "./topbar";
import { WelcomeBanner } from "./welcome-banner";
import { MetricCards } from "./metric-cards";
import { RecentTransactions } from "./recent-transactions";
import { DashboardFooter } from "./footer";

export function DashboardShell() {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <div className="flex h-screen h-dvh w-full overflow-hidden bg-[#f8fafc] text-slate-900 antialiased font-sans">
      <Sidebar
        isOpen={sidebarOpen}
        onClose={() => setSidebarOpen(false)}
      />

      {/* Main Content Area */}
      <div className="flex flex-1 flex-col min-w-0 h-full overflow-hidden">
        {/* Topbar Navigation */}
        <Topbar
          onToggleSidebar={() => setSidebarOpen((prev) => !prev)}
        />

        {/* Workspace Scrollable Canvas */}
        <main className="flex-1 min-h-0 overflow-y-auto p-4 sm:p-6 lg:p-8 space-y-6 scrollbar-thin">
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
        </main>

        {/* Operational Footer */}
        <DashboardFooter />
      </div>
    </div>
  );
}
