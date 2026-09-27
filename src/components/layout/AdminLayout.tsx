"use client";

import * as React from "react";
import Sidebar from "./Sidebar";
import Topbar from "./Topbar";
import AdminFooter from "./Footer";


import { useCurrentDate } from "@/hooks/useCurrentDate";

interface AdminLayoutProps {
  children: React.ReactNode;
  title?: string;
  dateString?: string;
  actions?: React.ReactNode;
}

export function AdminLayout({
  children,
  title,
  dateString,
  actions,
}: AdminLayoutProps) {
  const [sidebarOpen, setSidebarOpen] = React.useState(false);
  const formattedDate = useCurrentDate(dateString);

  return (
    <div className="flex h-screen h-dvh w-full overflow-hidden bg-background text-foreground antialiased font-sans">
      <Sidebar
        isOpen={sidebarOpen}
        onClose={() => setSidebarOpen(false)}
      />

      <div className="flex flex-1 flex-col min-w-0 h-full overflow-hidden">
        <Topbar
          onToggleSidebar={() => setSidebarOpen((prev) => !prev)}
          title={title}
          dateString={formattedDate}
          actions={actions}
        />

        <main className="flex-1 min-h-0 overflow-y-auto p-4 sm:p-6 lg:p-8 space-y-6 scrollbar-thin">
          {children}
        </main>

        <AdminFooter />
      </div>
    </div>
  );
}
