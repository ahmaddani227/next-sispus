export type BookJenjang = "semua" | "mi" | "mts" | "umum"
export type BookKategori = "semua" | "agama" | "tematik" | "sains" | "bahasa" | "sastra"
export type BookRak = "semua" | "rak-a" | "rak-b" | "rak-c" | "rak-d" | "rak-e"
export type BookStatus = "semua" | "tersedia" | "dipinjam"
export type BookFormat = "semua" | "buku-cetak" | "kitab" | "referensi" | "cerita"
export type BookTahun = "semua" | "2023-2024" | "2020-2022" | "klasik"

export interface Book {
  id: string
  title: string
  callNumber: string
  author: string
  publisher: string
  year: string
  synopsis: string
  badgeLabel: string
  location: string
  rack: BookRak
  jenjang: BookJenjang
  kategori: BookKategori
  status: "tersedia" | "dipinjam"
  format: BookFormat
  tahunRange: BookTahun
  availableCopies: number
  totalCopies: number
  coverUrl: string
  returnEstimate?: string
}

export interface CatalogFilterState {
  searchQuery: string
  jenjang: BookJenjang
  kategori: BookKategori
  rak: BookRak
  status: BookStatus
  format: BookFormat
  tahun: BookTahun
}

export interface ZoneInfo {
  badge: string
  title: string
  shortTitle: string
  fillRate: string
  capacity: string
  target: string
  categories: string
  rackCode: BookRak
  description: string
  locationNote: string
}
