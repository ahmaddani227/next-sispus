"use client";

import {ReactNode, useState} from "react";
import Sidebar from "@/components/layout/Sidebar";
import Topbar from "@/components/layout/Topbar";
import AdminFooter from "@/components/layout/Footer";
import { useCurrentDate } from "@/hooks/useCurrentDate";

export default function DashboardLayout({
  children,
}: {
  children: ReactNode;
}) {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const formattedDate = useCurrentDate();

  return (
    <div className="flex h-screen h-dvh w-full overflow-hidden bg-background text-foreground antialiased font-sans border">
      <Sidebar
        isOpen={sidebarOpen}
        onClose={() => setSidebarOpen(false)}
      />

      <div className="flex flex-1 flex-col min-w-0 h-full overflow-hidden">
        <Topbar
          onToggleSidebar={() => setSidebarOpen((prev) => !prev)}
          dateString={formattedDate}
        />

        <main className="flex-1 min-h-0 overflow-y-auto p-4 sm:p-6 lg:p-8 space-y-6 scrollbar-thin">
          {children}
        </main>

        <AdminFooter />
      </div>
    </div>
  );
}
