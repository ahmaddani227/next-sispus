import { NavSection, UserProfile } from "@/types/navigation";

export const currentUser: UserProfile = {
  name: "Ustadzah Siti Rahmawati",
  role: "Admin & Petugas Utama",
  roleType: "ADMIN",
  nip: "198804152014",
  initials: "SR",
};

export const adminNavSections: NavSection[] = [
  {
    title: "Utama",
    items: [
      {
        label: "Dashboard",
        href: "/dashboard",
        icon: "layout-dashboard",
      },
    ],
  },
  {
    title: "Data Master",
    items: [
      {
        label: "Data Master",
        href: "/dashboard/master-data",
        icon: "database",
      },
      {
        label: "Data Buku",
        href: "/dashboard/books",
        icon: "book-open",
      },
      {
        label: "Data Anggota",
        href: "#anggota",
        icon: "users",
      },
    ],
  },
  {
    title: "Transaksi",
    items: [
      {
        label: "Peminjaman",
        href: "#peminjaman",
        icon: "arrow-up-right",
      },
      {
        label: "Pengembalian",
        href: "#pengembalian",
        icon: "arrow-down-left",
      },
      {
        label: "Perpanjangan",
        href: "#perpanjangan",
        icon: "refresh-cw",
      },
      {
        label: "Riwayat Transaksi",
        href: "#riwayat",
        icon: "history",
      },
    ],
  },
  {
    title: "Kasus & Sanksi",
    items: [
      {
        label: "Manajemen Kasus",
        href: "#kasus",
        icon: "alert-triangle",
      },
    ],
  },
  {
    title: "Laporan",
    items: [
      {
        label: "Laporan Sirkulasi",
        href: "#laporan",
        icon: "file-text",
      },
    ],
  },
];
