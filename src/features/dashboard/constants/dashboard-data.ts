import {
  MetricItem,
  NavSection,
  TransactionRecord,
  UserProfile,
} from "../types/dashboard.types";

export const currentUser: UserProfile = {
  name: "Ustadzah Siti Rahmawati",
  role: "Admin & Petugas Utama",
  roleType: "ADMIN",
  nip: "198804152014",
  initials: "SR",
};

export const dashboardNavSections: NavSection[] = [
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
        href: "#buku",
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

export const operationalMetrics: MetricItem[] = [
  {
    id: "total-titles",
    title: "Total Judul Buku",
    value: "1.420",
    unit: "Judul",
    badgeText: "Katalog Aktif",
    badgeVariant: "success",
    description: "MI: 840 judul • MTs: 580 judul",
    iconName: "book-open",
  },
  {
    id: "total-copies",
    title: "Total Eksemplar Fisik",
    value: "2.845",
    unit: "Eks",
    badgeText: "Inventaris Total",
    badgeVariant: "neutral",
    description: "Tercatat barcode dan RFID aktif",
    iconName: "layers",
  },
  {
    id: "available-copies",
    title: "Buku Tersedia di Rak",
    value: "2.583",
    unit: "Eks",
    badgeText: "90.8% Siap Pinjam",
    badgeVariant: "success",
    description: "Tersedia di Rak A1-D2 & Ruang Baca",
    iconName: "check-circle",
    highlightColor: "text-emerald-700",
  },
  {
    id: "borrowed-copies",
    title: "Buku Dipinjam",
    value: "235",
    unit: "Eks",
    badgeText: "8.2% Beredar",
    badgeVariant: "info",
    description: "Siswa MI, Siswa MTs & Dewan Guru",
    iconName: "arrow-left-right",
    highlightColor: "text-blue-700",
  },
  {
    id: "damaged-copies",
    title: "Buku Rusak",
    value: "18",
    unit: "Eks",
    badgeText: "Perlu Repair",
    badgeVariant: "warning",
    description: "11 perbaikan ringan • 7 jilid ulang",
    iconName: "alert-triangle",
    highlightColor: "text-amber-700",
  },
  {
    id: "lost-copies",
    title: "Buku Hilang",
    value: "9",
    unit: "Eks",
    badgeText: "Kasus Terdata",
    badgeVariant: "danger",
    description: "Proses verifikasi & konfirmasi siswa",
    iconName: "x-circle",
    highlightColor: "text-rose-600",
  },
  {
    id: "active-loans",
    title: "Peminjaman Aktif",
    value: "142",
    unit: "Transaksi",
    badgeText: "Sirkulasi Berjalan",
    badgeVariant: "success",
    description: "138 tepat waktu • 4 terlambat",
    iconName: "clock",
    highlightColor: "text-emerald-700",
  },
  {
    id: "suspended-students",
    title: "Siswa Ter-skorsing",
    value: "4",
    unit: "Siswa",
    badgeText: "Akses Ditangguhkan",
    badgeVariant: "danger",
    description: "Keterlambatan berturut-turut > 3 hari",
    iconName: "shield-alert",
    highlightColor: "text-rose-600",
  },
  {
    id: "active-replacements",
    title: "Kewajiban Penggantian Aktif",
    value: "7",
    unit: "Kasus",
    badgeText: "Replacement Active",
    badgeVariant: "warning",
    description: "5 buku identik • 2 kompensasi madrasah",
    iconName: "file-check",
    highlightColor: "text-amber-700",
  },
];

export const recentTransactions: TransactionRecord[] = [
  {
    id: "TRX-001",
    borrower: {
      name: "Muhammad Faiz Zaki",
      nis: "232407012",
      classGrade: "Kelas VII-A MTs",
    },
    book: {
      title: "Fiqih Ibadah Praktis MTs",
      copyCode: "BK-AGM-0182",
      shelfLocation: "Rak A1",
    },
    loanDate: "14 Okt 2024",
    dueDate: "21 Okt 2024",
    dueStatus: {
      label: "+3 Hari Lewat",
      isOverdue: true,
      colorClass: "text-rose-600 font-bold",
    },
    status: "OVERDUE",
    statusLabel: "Terlambat",
  },
  {
    id: "TRX-002",
    borrower: {
      name: "Aisyah Nur Ramadhani",
      nis: "212205044",
      classGrade: "Kelas V-B MI",
    },
    book: {
      title: "Tematik Terpadu 5B: Udara Bersih",
      copyCode: "BK-TMT-0419",
      shelfLocation: "Rak B1",
    },
    loanDate: "24 Okt 2024",
    dueDate: "31 Okt 2024",
    dueStatus: {
      label: "Sisa 7 Hari",
      isOverdue: false,
      colorClass: "text-emerald-700",
    },
    status: "BORROWED",
    statusLabel: "Dipinjam",
  },
  {
    id: "TRX-003",
    borrower: {
      name: "Fattah Al-Ghifari",
      nis: "222308019",
      classGrade: "Kelas VIII-B MTs",
    },
    book: {
      title: "IPA Terpadu MTs Kelas VIII",
      copyCode: "BK-IPA-0098",
      shelfLocation: "Rak C1",
    },
    loanDate: "24 Okt 2024",
    dueDate: "31 Okt 2024",
    dueStatus: {
      label: "Sisa 7 Hari",
      isOverdue: false,
      colorClass: "text-emerald-700",
    },
    status: "BORROWED",
    statusLabel: "Dipinjam",
  },
  {
    id: "TRX-004",
    borrower: {
      name: "Khadijah Zahra Azzahra",
      nis: "222304031",
      classGrade: "Kelas IV-A MI",
    },
    book: {
      title: "Kisah 25 Nabi & Rasul Bergambar",
      copyCode: "BK-CRT-0211",
      shelfLocation: "Rak D1",
    },
    loanDate: "17 Okt 2024",
    dueDate: "24 Okt 2024",
    dueStatus: {
      label: "Kembali Hari Ini",
      isOverdue: false,
      isDueToday: true,
      colorClass: "text-slate-500",
    },
    status: "RETURNED",
    statusLabel: "Dikembalikan",
  },
  {
    id: "TRX-005",
    borrower: {
      name: "Ahmad Bilal Ramadhan",
      nis: "212209004",
      classGrade: "Kelas IX-A MTs",
    },
    book: {
      title: "Kamus Al-Munawwir Arab-Indo",
      copyCode: "BK-BHS-0012",
      shelfLocation: "Rak C2",
    },
    loanDate: "18 Okt 2024",
    dueDate: "25 Okt 2024",
    dueStatus: {
      label: "Kembali 23 Okt",
      isOverdue: false,
      colorClass: "text-slate-500",
    },
    status: "RETURNED",
    statusLabel: "Dikembalikan",
  },
];
