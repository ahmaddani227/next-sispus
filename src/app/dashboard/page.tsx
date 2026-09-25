import { Dashboard } from "@/features/dashboard/components/Dashboard";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Dashboard Admin - SIPUS Ar-Rasyid",
  description:
    "Dashboard administrasi perpustakaan madrasah MI & MTs Ar-Rasyid.",
};

export default function DashboardPage() {
  return <Dashboard />;
}
