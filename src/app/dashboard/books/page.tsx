import { BooksManagement } from "@/features/books";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Manajemen Data Buku - SIPUS Ar-Rasyid",
  description:
    "Manajemen katalog buku, bibliografi, lokasi rak, status eksemplar fisik, barcode & RFID perpustakaan madrasah.",
};

export default function BooksPage() {
  return <BooksManagement />;
}
