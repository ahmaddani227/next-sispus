"use client";

import { useState } from "react";
import { UserRole } from "@/types/dashboard";
import { Sidebar } from "./sidebar";
import { Topbar } from "./topbar";
import { WelcomeBanner } from "./welcome-banner";
import { MetricCards } from "./metric-cards";
import { RecentTransactions } from "./recent-transactions";
import { DashboardFooter } from "./footer";

export function DashboardShell() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [selectedRole, setSelectedRole] = useState<UserRole>("ADMIN");

  return (
    <div className="flex min-h-screen w-full bg-[#f8fafc] text-slate-900 antialiased font-sans">
      {/* Sidebar Navigation */}
      <Sidebar
        isOpen={sidebarOpen}
        onClose={() => setSidebarOpen(false)}
      />

      {/* Main Content Area */}
      <div className="flex flex-1 flex-col min-w-0 overflow-hidden">
        {/* Topbar Navigation */}
        <Topbar
          onToggleSidebar={() => setSidebarOpen((prev) => !prev)}
          selectedRole={selectedRole}
          onSelectRole={(role) => setSelectedRole(role)}
        />

        {/* Workspace Scrollable Canvas */}
        <main className="flex-1 overflow-y-auto p-4 sm:p-6 lg:p-8 space-y-6">
          {/* Welcome Institutional Banner */}
          <WelcomeBanner currentRole={selectedRole} />

          {/* Operational Metrics (9 Cards Strict PRD Scope) */}
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
