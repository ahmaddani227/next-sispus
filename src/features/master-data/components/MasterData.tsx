"use client";

import { MetricCards } from "@/components/MetricCards";
import { MasterHeaderBanner } from "./MasterHeaderBanner";
import { MasterTabsFilter } from "./MasterTabsFilter";
import { MasterTable } from "./MasterTable";
import { MasterFormDialog } from "./MasterFormDialog";
import { MasterDetailDialog } from "./MasterDetailDialog";
import { MasterDeleteDialog } from "./MasterDeleteDialog";
import { useMasterData } from "../hooks/useMasterData";

export function MasterData() {
  const {
    activeTab,
    filters,
    tabCounts,
    filteredItems,
    masterMetricItems,
    isFormOpen,
    setIsFormOpen,
    editingItem,
    isDetailOpen,
    setIsDetailOpen,
    detailItem,
    isDeleteOpen,
    setIsDeleteOpen,
    deleteItem,
    handleTabChange,
    handleFilterChange,
    handleResetFilter,
    handleOpenCreateModal,
    handleEdit,
    handleViewDetail,
    handleDeletePrompt,
    handleSaveItem,
    handleConfirmDelete,
    handleExportCSV,
  } = useMasterData();

  return (
    <div className="space-y-6">
      {/* Header & Actions */}
      <MasterHeaderBanner
        onExportCSV={handleExportCSV}
        onOpenCreateModal={handleOpenCreateModal}
      />

      {/* Card Ringkasan Metrik Master Data */}
      <MetricCards items={masterMetricItems} columns={4} />

      {/* TAB SWITCHER & FILTER/SEARCH CONTROLS */}
      <MasterTabsFilter
        activeTab={activeTab}
        onTabChange={handleTabChange}
        tabCounts={tabCounts}
        filters={filters}
        onFilterChange={handleFilterChange}
        onResetFilter={handleResetFilter}
        onOpenCreateModal={handleOpenCreateModal}
      />

      {/* TABEL DAFTAR MASTER DATA */}
      <MasterTable
        items={filteredItems}
        totalFiltered={filteredItems.length}
        activeTab={activeTab}
        onViewDetail={handleViewDetail}
        onEdit={handleEdit}
        onDelete={handleDeletePrompt}
      />

      {/* MODAL DIALOGS */}
      <MasterFormDialog
        open={isFormOpen}
        onOpenChange={setIsFormOpen}
        editingItem={editingItem}
        defaultTab={activeTab}
        onSave={handleSaveItem}
      />

      <MasterDetailDialog
        open={isDetailOpen}
        onOpenChange={setIsDetailOpen}
        item={detailItem}
      />

      <MasterDeleteDialog
        open={isDeleteOpen}
        onOpenChange={setIsDeleteOpen}
        item={deleteItem}
        onConfirm={handleConfirmDelete}
      />
    </div>
  );
}
