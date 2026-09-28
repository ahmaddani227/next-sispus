"use client";

import { Plus } from "lucide-react";
import { AdminLayout } from "@/components/layout/AdminLayout";
import { Button } from "@/components/ui/button";
import { MetricCards } from "@/components/MetricCards";
import { BookFilterBar } from "./BookFilterBar";
import { BooksTable } from "./BooksTable";
import { BookFormDialog } from "./BookFormDialog";
import { BookCopiesDialog } from "./BookCopiesDialog";
import { BookImportDialog } from "./BookImportDialog";
import { BookStatusDialog } from "./BookStatusDialog";
import { useBooksManagement } from "../hooks/useBooksManagement";

export function BooksManagement() {
  const {
    books,
    filters,
    filteredBooks,
    metricItems,
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
  } = useBooksManagement();

  return (
    <AdminLayout
      title="Manajemen Data Buku"
      actions={
        <Button
          type="button"
          size="sm"
          onClick={handleOpenCreateModal}
          className="bg-emerald-800 hover:bg-emerald-900 text-white text-xs font-bold shadow-xs gap-1.5 py-2 px-3.5 h-auto cursor-pointer"
          title="Tambah Buku Baru"
        >
          <Plus className="w-4 h-4" />
          <span>Tambah Buku Baru</span>
        </Button>
      }
    >
      {/* 1. CARD RINGKASAN STATISTIK INVENTARIS (4 Kolom) */}
      <section aria-labelledby="stat-inventory-heading" className="flex flex-col">
        <h2 id="stat-inventory-heading" className="sr-only">
          Ringkasan Statistik Inventaris Buku
        </h2>
        <MetricCards items={metricItems} columns={4} />
      </section>

      {/* Filter & Search */}
      <section aria-labelledby="filter-heading">
        <h2 id="filter-heading" className="sr-only">
          Filter dan Pencarian Buku
        </h2>
        <BookFilterBar
          filters={filters}
          onFilterChange={handleFilterChange}
          onResetFilter={handleResetFilter}
          onOpenImportModal={() => setIsImportOpen(true)}
        />
      </section>

      {/* Tabel Daftar Buku */}
      <section aria-labelledby="table-heading">
        <h2 id="table-heading" className="sr-only">
          Daftar Buku dan Eksemplar
        </h2>
        <BooksTable
          books={filteredBooks}
          totalAll={books.length}
          onEdit={handleEditBook}
          onOpenCopies={handleOpenCopies}
          onToggleStatus={handleToggleStatusClick}
          onResetFilter={handleResetFilter}
        />
      </section>

      {/* Modal Form Tambah/Edit Buku */}
      <BookFormDialog
        open={isFormOpen}
        onOpenChange={setIsFormOpen}
        bookToEdit={editingBook}
        onSave={handleSaveBook}
      />

      {/* Modal Manajemen Eksemplar Fisik */}
      <BookCopiesDialog
        open={isCopiesOpen}
        onOpenChange={setIsCopiesOpen}
        book={selectedBookForCopies}
        onUpdateCopies={handleUpdateCopies}
      />

      {/* Modal Fitur Import Excel/CSV */}
      <BookImportDialog
        open={isImportOpen}
        onOpenChange={setIsImportOpen}
        onSuccessImport={handleImportSuccess}
      />

      {/* Modal Konfirmasi Status Aktivasi / Deaktivasi */}
      <BookStatusDialog
        open={isStatusDialogOpen}
        onOpenChange={setIsStatusDialogOpen}
        book={targetStatusBook}
        onConfirm={handleConfirmStatusChange}
      />
    </AdminLayout>
  );
}
