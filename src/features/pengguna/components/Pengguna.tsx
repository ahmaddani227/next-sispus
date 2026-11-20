"use client";

import { UserPlus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { MetricCards } from "@/components/MetricCards";
import { HeaderBanner } from "@/components/HeaderBanner";
import { ConfirmDialog } from "@/components/ConfirmDialog";
import { UserFilters } from "./UserFilters";
import { UserTable } from "./UserTable";
import { UserFormDialog } from "./UserFormDialog";
import { UserStatusDialog } from "./UserStatusDialog";
import { usePengguna } from "../hooks/usePengguna";
import type { Pengguna as PenggunaType } from "../types/pengguna.types";

interface PenggunaProps {
  initialUsers?: PenggunaType[];
}

export default function Pengguna({ initialUsers = [] }: PenggunaProps) {
  const {
    filters,
    paginatedItems,
    filteredItems,
    metrics,
    currentPage,
    totalPages,
    isFormOpen,
    setIsFormOpen,
    editingItem,
    isDeleteOpen,
    setIsDeleteOpen,
    deleteItem,
    isStatusOpen,
    setIsStatusOpen,
    statusUser,
    isSaving,
    isDeleting,
    isTogglingStatus,
    handleFilterChange,
    handleResetFilter,
    handleOpenCreate,
    handleEdit,
    handleDeletePrompt,
    handleToggleStatus,
    handleConfirmToggleStatus,
    handleSave,
    handleConfirmDelete,
    setCurrentPage,
  } = usePengguna(initialUsers);

  return (
    <div className="space-y-6">
      {/* Page Header Banner */}
      <HeaderBanner
        title="Manajemen Petugas"
        description="Pengelolaan akun staf, otorisasi hak akses loket sirkulasi, penugasan role pustakawan madrasah, dan audit aktivitas akun SIPUS Ar-Rasyid."
        actions={
          <>
            <Button
              type="button"
              size="sm"
              onClick={handleOpenCreate}
              className="gap-2 text-xs font-bold bg-emerald-800 hover:bg-emerald-900 dark:bg-emerald-700 dark:hover:bg-emerald-800 text-white shadow-sm"
              id="btn-tambah-pengguna"
            >
              <UserPlus className="w-4 h-4 text-emerald-200" />
              + Tambah Pengguna Baru
            </Button>
          </>
        }
      />

      {/* Metric Cards */}
      <section aria-labelledby="pengguna-metrics-heading">
        <h2 id="pengguna-metrics-heading" className="sr-only">
          Ringkasan Statistik Pengguna
        </h2>
        <MetricCards items={metrics} columns={4} />
      </section>

      {/* Filter & Search */}
      <UserFilters
        filters={filters}
        onFilterChange={handleFilterChange}
        onReset={handleResetFilter}
      />

      {/* Table */}
      <section aria-labelledby="pengguna-table-heading">
        <h2 id="pengguna-table-heading" className="sr-only">
          Daftar Akun Pengguna
        </h2>
        <UserTable
          items={paginatedItems}
          totalFiltered={filteredItems.length}
          currentPage={currentPage}
          totalPages={totalPages}
          onPageChange={setCurrentPage}
          onEdit={handleEdit}
          onDelete={handleDeletePrompt}
          onToggleStatus={handleToggleStatus}
        />
      </section>

      {/* Form Dialog */}
      <UserFormDialog
        open={isFormOpen}
        onOpenChange={setIsFormOpen}
        editingItem={editingItem}
        onSave={handleSave}
        isLoading={isSaving}
      />

      {/* Delete Confirm Dialog */}
      <ConfirmDialog
        open={isDeleteOpen}
        onOpenChange={setIsDeleteOpen}
        title="Hapus Akun Pengguna"
        description={
          deleteItem
            ? `Anda akan menghapus akun "${deleteItem.nama}" (@${deleteItem.username}) dari sistem SIPUS secara permanen. Tindakan ini tidak dapat dibatalkan.`
            : ""
        }
        confirmLabel="Ya, Hapus Akun"
        onConfirm={handleConfirmDelete}
        isLoading={isDeleting}
        variant="danger"
      />

      {/* Toggle Status Confirm Dialog */}
      <UserStatusDialog
        open={isStatusOpen}
        onOpenChange={setIsStatusOpen}
        user={statusUser}
        onConfirm={handleConfirmToggleStatus}
        isLoading={isTogglingStatus}
      />
    </div>
  );
}
