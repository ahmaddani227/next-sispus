export type BookStatus = "active" | "inactive";

export type BookCopyStatus = "AVAILABLE" | "BORROWED" | "DAMAGED" | "LOST";

export type BookCopyCondition =
  | "Sangat Baik"
  | "Baik"
  | "Rusak Ringan"
  | "Rusak Berat";

export interface BookCopyItem {
  id: string;
  barcode: string;
  rfidTag?: string;
  shelfRow: string;
  status: BookCopyStatus;
  borrowerName?: string;
  condition: BookCopyCondition;
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
