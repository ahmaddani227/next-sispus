import type { Pengguna } from "../types/pengguna.types";
import type { MetricCardProps } from "@/components/MetricCards";
import { ShieldCheck, Users, UserCog } from "lucide-react";

export function buildPenggunaMetrics(data: Pengguna[]): MetricCardProps[] {
  const total = data.length;
  const adminCount = data.filter((u) => u.role === "ADMIN").length;
  const petugasCount = data.filter((u) => u.role === "PETUGAS").length;
  const aktifCount = data.filter((u) => u.status === "Aktif").length;

  return [
    {
      id: "total",
      title: "Total Pengguna",
      value: total,
      unit: "Akun",
      badgeText: "Terdaftar",
      badgeVariant: "emerald",
      description: "Total seluruh akun staf & petugas perpustakaan",
      icon: Users,
    },
    {
      id: "admin",
      title: "Admin / Kepala Perpus",
      value: adminCount,
      unit: "Akun",
      badgeText: "Full Access",
      badgeVariant: "emerald",
      description: "Hak akses penuh konfigurasi & manajemen",
      icon: ShieldCheck,
      highlightColor: "text-emerald-700 dark:text-emerald-400",
    },
    {
      id: "petugas",
      title: "Petugas Perpustakaan",
      value: petugasCount,
      unit: "Akun",
      badgeText: "Sirkulasi",
      badgeVariant: "blue",
      description: "Petugas loket peminjaman & katalog buku",
      icon: UserCog,
      highlightColor: "text-blue-700 dark:text-blue-400",
    },
    {
      id: "aktif",
      title: "Akun Aktif",
      value: aktifCount,
      unit: "Akun",
      badgeText: "Siap Akses",
      badgeVariant: "emerald",
      description: "Pengguna yang memiliki hak login saat ini",
      icon: ShieldCheck,
      highlightColor: "text-emerald-700 dark:text-emerald-400",
    },
  ];
}
