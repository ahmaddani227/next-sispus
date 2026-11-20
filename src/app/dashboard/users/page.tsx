import Pengguna from "@/features/pengguna";
import { requireRole } from "@/lib/auth/guard";
import { getPenggunaListAction } from "@/features/pengguna/actions/pengguna.actions";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Manajemen Petugas - SIPUS Ar-Rasyid",
  description:
    "Pengelolaan akun staf, otorisasi hak akses, dan penugasan role pustakawan madrasah MI & MTs Ar-Rasyid.",
};

export default async function PenggunaPage() {
  await requireRole(["ADMIN"]);
  const res = await getPenggunaListAction();

  return <Pengguna initialUsers={res.data ?? []} />;
}
