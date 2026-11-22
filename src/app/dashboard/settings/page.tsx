import Settings from "@/features/settings";
import { requireRole } from "@/lib/auth/guard";
import { getSystemSettingsAction } from "@/features/settings/actions/settings.actions";
import { DEFAULT_SETTINGS } from "@/features/settings/types/settings.types";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Sistem Manajemen & Konfigurasi - SIPUS Ar-Rasyid",
  description:
    "Konfigurasi aturan peminjaman, durasi jatuh tempo, dan perpanjangan buku sirkulasi perpustakaan madrasah Ar-Rasyid.",
};

export default async function SettingsPage() {
  await requireRole(["ADMIN"]);
  const res = await getSystemSettingsAction();

  return (
    <Settings
      initialValues={res.data?.values ?? DEFAULT_SETTINGS}
      records={res.data?.records ?? []}
      lastUpdated={res.data?.lastUpdated}
    />
  );
}
