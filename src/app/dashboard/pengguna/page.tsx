
import Pengguna from "@/features/pengguna";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Manajemen Pengguna - SIPUS Ar-Rasyid",
  description:
    "Pengelolaan akun staf, otorisasi hak akses, dan penugasan role pustakawan madrasah MI & MTs Ar-Rasyid.",
};

export default function PenggunaPage() {
  return <Pengguna />;
}
