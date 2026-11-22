import type { SettingPreset, SystemSettingsValues } from "../types/settings.types";

export const DEFAULT_SETTINGS: SystemSettingsValues = {
  MAX_ACTIVE_LOANS: 2,
  DEFAULT_LOAN_DAYS: 7,
  MAX_LOAN_EXTENSIONS: 1,
  DEFAULT_EXTENSION_DAYS: 7,
};

export const SETTINGS_METADATA = {
  MAX_ACTIVE_LOANS: {
    key: "MAX_ACTIVE_LOANS",
    label: "Batas Maksimal Buku Dipinjam",
    unit: "Buku / Eksemplar",
    description: "Maksimal jumlah buku aktif yang dapat dipinjam siswa secara bersamaan.",
    min: 1,
    max: 10,
    step: 1,
  },
  DEFAULT_LOAN_DAYS: {
    key: "DEFAULT_LOAN_DAYS",
    label: "Durasi Standar Peminjaman",
    unit: "Hari Kalender",
    description: "Lama waktu peminjaman default per eksemplar buku sebelum jatuh tempo (due date).",
    min: 1,
    max: 60,
    step: 1,
  },
  MAX_LOAN_EXTENSIONS: {
    key: "MAX_LOAN_EXTENSIONS",
    label: "Batas Maksimal Perpanjangan",
    unit: "Kali",
    description: "Berapa kali siswa diizinkan memperpanjang masa pinjam untuk satu transaksi buku.",
    min: 0,
    max: 5,
    step: 1,
  },
  DEFAULT_EXTENSION_DAYS: {
    key: "DEFAULT_EXTENSION_DAYS",
    label: "Tambahan Durasi Perpanjangan",
    unit: "Hari Kalender",
    description: "Jumlah hari kalender yang ditambahkan ke jatuh tempo saat perpanjangan disetujui.",
    min: 1,
    max: 30,
    step: 1,
  },
} as const;

export const MAX_LOANS_PRESETS: SettingPreset[] = [
  { value: 1, label: "1 Buku" },
  { value: 2, label: "2 Buku (Default)" },
  { value: 3, label: "3 Buku" },
  { value: 5, label: "5 Buku" },
];

export const LOAN_DAYS_PRESETS: SettingPreset[] = [
  { value: 3, label: "3 Hari" },
  { value: 7, label: "7 Hari (Default)" },
  { value: 14, label: "14 Hari" },
  { value: 30, label: "30 Hari" },
];

export const MAX_EXT_PRESETS: SettingPreset[] = [
  { value: 0, label: "Nonaktif (0x)" },
  { value: 1, label: "1x (Default)" },
  { value: 2, label: "2x" },
  { value: 3, label: "3x" },
];

export const EXT_DAYS_PRESETS: SettingPreset[] = [
  { value: 3, label: "+3 Hari" },
  { value: 7, label: "+7 Hari (Default)" },
  { value: 14, label: "+14 Hari" },
];
