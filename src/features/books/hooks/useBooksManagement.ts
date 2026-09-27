"use client";

import { useState, useCallback, useMemo } from "react";
import { toast } from "sonner";
import { MetricCardProps } from "@/components/MetricCards";
import {
  BookItem,
  BookFilterState,
  BookFormData,
  BookCopyItem,
} from "../types/books.types";
import { INITIAL_BOOKS } from "../constants/books-data";

export function useBooksManagement() {
  const [books, setBooks] = useState<BookItem[]>(INITIAL_BOOKS);
  const [filters, setFilters] = useState<BookFilterState>({
    search: "",
    status: "all",
    shelf: "all",
    level: "all",
    category: "all",
  });

  // Dialog States
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingBook, setEditingBook] = useState<BookItem | null>(null);

  const [isCopiesOpen, setIsCopiesOpen] = useState(false);
  const [selectedBookForCopies, setSelectedBookForCopies] =
    useState<BookItem | null>(null);

  const [isImportOpen, setIsImportOpen] = useState(false);

  const [isStatusDialogOpen, setIsStatusDialogOpen] = useState(false);
  const [targetStatusBook, setTargetStatusBook] = useState<BookItem | null>(
    null
  );

  // Filter Handler
  const handleFilterChange = useCallback(
    (newFilters: Partial<BookFilterState>) => {
      setFilters((prev) => ({ ...prev, ...newFilters }));
    },
    []
  );

  const handleResetFilter = useCallback(() => {
    setFilters({
      search: "",
      status: "all",
      shelf: "all",
      level: "all",
      category: "all",
    });
    toast.info("Filter pencarian buku telah direset.");
  }, []);

  // Filtered Books List
  const filteredBooks = useMemo(() => {
    return books.filter((book) => {
      const q = filters.search.toLowerCase().trim();
      const matchSearch =
        !q ||
        book.title.toLowerCase().includes(q) ||
        book.code.toLowerCase().includes(q) ||
        book.isbn.toLowerCase().includes(q) ||
        book.author.toLowerCase().includes(q) ||
        book.publisher.toLowerCase().includes(q) ||
        book.categories.some((cat) => cat.toLowerCase().includes(q));

      const matchStatus =
        filters.status === "all" || book.status === filters.status;

      const matchShelf =
        filters.shelf === "all" ||
        book.shelfId.toLowerCase().includes(filters.shelf.toLowerCase()) ||
        book.shelfName.toLowerCase().includes(filters.shelf.toLowerCase());

      const matchLevel =
        filters.level === "all" ||
        book.level.toLowerCase() === filters.level.toLowerCase();

      const matchCategory =
        filters.category === "all" ||
        book.categories.some((cat) =>
          cat.toLowerCase().includes(filters.category.toLowerCase())
        );

      return (
        matchSearch &&
        matchStatus &&
        matchShelf &&
        matchLevel &&
        matchCategory
      );
    });
  }, [books, filters]);

  // Statistics calculation for Metric Cards
  const metricItems = useMemo<MetricCardProps[]>(() => {
    const totalTitles = 1420;
    const totalPhysicalCopies = 2845;
    const available = 2610;
    const borrowed = 235;

    return [
      {
        id: "stat-titles",
        title: "Total Judul Buku",
        value: totalTitles.toLocaleString("id-ID"),
        unit: "Judul",
        badgeText: "Katalog Terdata",
        badgeVariant: "emerald",
        description: "MI: 840 judul • MTs: 580 judul",
        iconName: "book-open",
      },
      {
        id: "stat-copies",
        title: "Total Eksemplar Fisik",
        value: totalPhysicalCopies.toLocaleString("id-ID"),
        unit: "Eks",
        badgeText: "Inventaris Tercatat",
        badgeVariant: "neutral",
        description: "Barcode & RFID barcode sinkron",
        iconName: "layers",
      },
      {
        id: "stat-available",
        title: "Tersedia di Rak",
        value: available.toLocaleString("id-ID"),
        unit: "Eks",
        badgeText: "91.7% Siap",
        badgeVariant: "emerald",
        description: "Siap Dipinjam Siswa & Guru",
        iconName: "check-circle",
        highlightColor: "text-emerald-700",
        unitColor: "text-emerald-600",
      },
      {
        id: "stat-borrowed",
        title: "Sedang Dipinjam",
        value: borrowed.toLocaleString("id-ID"),
        unit: "Eks",
        badgeText: "8.2% Beredar",
        badgeVariant: "info",
        description: "Beredar di Siswa & Dewan Guru",
        iconName: "arrow-left-right",
        highlightColor: "text-blue-700",
        unitColor: "text-blue-600",
      },
    ];
  }, []);

  // Actions
  const handleOpenCreateModal = useCallback(() => {
    setEditingBook(null);
    setIsFormOpen(true);
  }, []);

  const handleEditBook = useCallback((book: BookItem) => {
    setEditingBook(book);
    setIsFormOpen(true);
  }, []);

  const handleOpenCopies = useCallback((book: BookItem) => {
    setSelectedBookForCopies(book);
    setIsCopiesOpen(true);
  }, []);

  const handleToggleStatusClick = useCallback((book: BookItem) => {
    setTargetStatusBook(book);
    setIsStatusDialogOpen(true);
  }, []);

  const handleConfirmStatusChange = useCallback((book: BookItem) => {
    const nextStatus = book.status === "active" ? "inactive" : "active";
    setBooks((prev) =>
      prev.map((b) => (b.id === book.id ? { ...b, status: nextStatus } : b))
    );

    if (nextStatus === "active") {
      toast.success(
        `✓ Berhasil: Data buku "${book.title}" telah diaktifkan kembali dan kini tampil di katalog.`
      );
    } else {
      toast.warning(
        `✓ Berhasil: Data buku "${book.title}" (${book.code}) telah dinonaktifkan dari sirkulasi perpustakaan.`
      );
    }
  }, []);

  const handleSaveBook = useCallback((formData: BookFormData) => {
    if (formData.id) {
      // Edit
      setBooks((prev) =>
        prev.map((b) =>
          b.id === formData.id
            ? {
                ...b,
                ...formData,
                shelfName: `${formData.shelfId} (${formData.categories[0] || "Umum"})`,
              }
            : b
        )
      );
      toast.success(`Data bibliografi buku "${formData.title}" berhasil diperbarui.`);
    } else {
      // Create
      const newBook: BookItem = {
        id: `book-${Date.now()}`,
        code: formData.code,
        isbn: formData.isbn,
        title: formData.title,
        author: formData.author,
        publisher: formData.publisher,
        publicationYear: formData.publicationYear,
        categories: formData.categories,
        level: "MTs",
        shelfId: formData.shelfId,
        shelfName: `${formData.shelfId} (${formData.categories[0] || "Umum"})`,
        pages: formData.pages,
        language: formData.language,
        synopsis: formData.synopsis,
        status: "active",
        totalCopies: 1,
        availableCopies: 1,
        borrowedCopies: 0,
        copies: [
          {
            id: `cp-${Date.now()}`,
            barcode: `BC-${formData.code.replace("BK-", "")}-01`,
            shelfRow: `${formData.shelfId} - Baris 1`,
            status: "AVAILABLE",
            condition: "Sangat Baik",
          },
        ],
      };
      setBooks((prev) => [newBook, ...prev]);
      toast.success(`Buku baru "${formData.title}" berhasil ditambahkan.`);
    }
  }, []);

  const handleUpdateCopies = useCallback(
    (bookId: string, updatedCopies: BookCopyItem[]) => {
      setBooks((prev) =>
        prev.map((b) => {
          if (b.id !== bookId) return b;
          const available = updatedCopies.filter(
            (c) => c.status === "AVAILABLE"
          ).length;
          const borrowed = updatedCopies.filter(
            (c) => c.status === "BORROWED"
          ).length;
          return {
            ...b,
            copies: updatedCopies,
            totalCopies: updatedCopies.length,
            availableCopies: available,
            borrowedCopies: borrowed,
          };
        })
      );
    },
    []
  );

  const handleImportSuccess = useCallback(() => {
    toast.success("Katalog diperbarui dengan data impor spreadsheet.");
  }, []);

  return {
    books,
    filters,
    filteredBooks,
    metricItems,
    // Dialog states & setters
    isFormOpen,
    setIsFormOpen,
    editingBook,
    isCopiesOpen,
    setIsCopiesOpen,
    selectedBookForCopies,
    isImportOpen,
    setIsImportOpen,
    isStatusDialogOpen,
    setIsStatusDialogOpen,
    targetStatusBook,
    // Actions
    handleFilterChange,
    handleResetFilter,
    handleOpenCreateModal,
    handleEditBook,
    handleOpenCopies,
    handleToggleStatusClick,
    handleConfirmStatusChange,
    handleSaveBook,
    handleUpdateCopies,
    handleImportSuccess,
  };
}
