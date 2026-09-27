export type BookStatus = "active" | "inactive";

/** Nilai enum book_copy_status di database */
export type BookCopyStatus = "AVAILABLE" | "BORROWED" | "DAMAGED" | "LOST";

/**
 * Merepresentasikan satu baris pada tabel book_copies.
 * Kolom: id, book_id, copy_code, status, created_at, updated_at
 */
export interface BookCopyItem {
  id: string;
  bookId?: string;
  copyCode: string;      // VARCHAR(100) UNIQUE — kode eksemplar fisik
  status: BookCopyStatus;
  createdAt?: string;
  updatedAt?: string;
}

export interface BookItem {
  id: string;
  code: string;
  isbn?: string;
  title: string;
  author: string;
  publisher: string;
  edition?: string;
  publicationYear: number | null;
  categories: string[];
  level: "MI" | "MTs" | "Umum";
  shelfId: string;
  shelfName: string;
  pages?: string;
  language?: "Indonesia" | "Arab" | "Inggris";
  synopsis?: string;
  status: BookStatus;
  totalCopies: number;
  availableCopies: number;
  borrowedCopies: number;
  copies?: BookCopyItem[];
}

export interface BookFilterState {
  search: string;
  status: "all" | "active" | "inactive";
  shelf: string;
  level: string;
  category: string;
}

export interface BookFormData {
  id?: string;
  title: string;
  author?: string;
  publisher?: string;
  edition?: string;
  publicationYear?: number | null;
  shelfId: string;
  categories: string[];
}

export interface SpreadsheetPreviewItem {
  code: string;
  title: string;
  isbn: string;
  author: string;
  shelf: string;
  isValid: boolean;
  notes?: string;
}
