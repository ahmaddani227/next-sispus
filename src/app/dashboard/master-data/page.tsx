import { MasterData } from "@/features/master-data";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Master Data Sistem - SIPUS Ar-Rasyid",
  description:
    "Pengaturan dan konfigurasi terpadu klasifikasi DDC/Kemenag, lokasi rak fisik, mitra penerbit, serta rombel kelas MI & MTs Ar-Rasyid.",
};

export default function MasterDataPage() {
  return <MasterData />;
}
