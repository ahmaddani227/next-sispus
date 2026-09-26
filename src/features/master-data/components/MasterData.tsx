"use client";

import { useState, useCallback, useMemo } from "react";
import { Download } from "lucide-react";
import { toast } from "sonner";
import { AdminLayout } from "@/components/layout/AdminLayout";
import { Button } from "@/components/ui/button";

import {
  MasterItem,
  MasterTabType,
  MasterFilterState,
} from "../types/master-data.types";
import {
  INITIAL_MASTER_ITEMS,
  MASTER_TAB_CONFIGS,
} from "../constants/master-data";
import { MasterHeaderBanner } from "./MasterHeaderBanner";
import { MasterMetrics } from "./MasterMetrics";
import { MasterTabsFilter } from "./MasterTabsFilter";
import { MasterTable } from "./MasterTable";
import { MasterFormDialog } from "./MasterFormDialog";
import { MasterDetailDialog } from "./MasterDetailDialog";
import { MasterDeleteDialog } from "./MasterDeleteDialog";

export function MasterData() {
  // Active Tab & Data State
  const [activeTab, setActiveTab] = useState<MasterTabType>("kategori");
  const [items, setItems] = useState<MasterItem[]>(INITIAL_MASTER_ITEMS);

  // Filters State
  const [filters, setFilters] = useState<MasterFilterState>({
    searchQuery: "",
    status: "all",
  });

  // Dialog States
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<MasterItem | null>(null);

  const [isDetailOpen, setIsDetailOpen] = useState(false);
  const [detailItem, setDetailItem] = useState<MasterItem | null>(null);

  const [isDeleteOpen, setIsDeleteOpen] = useState(false);
  const [deleteItem, setDeleteItem] = useState<MasterItem | null>(null);

  // Compute tab counts
  const tabCounts = useMemo(() => {
    const counts: Record<MasterTabType, number> = {
      kategori: 0,
      rak: 0,
      penerbit: 0,
      kelas: 0,
    };
    items.forEach((item) => {
      counts[item.type] = (counts[item.type] || 0) + 1;
    });
    return counts;
  }, [items]);

  // Filter items based on activeTab and filters
  const filteredItems = useMemo(() => {
    const query = filters.searchQuery.toLowerCase().trim();

    return items.filter((item) => {
      if (item.type !== activeTab) return false;
      if (filters.status === "aktif" && item.status !== "Aktif") return false;
      if (filters.status === "nonaktif" && item.status !== "Nonaktif") return false;
      if (!query) return true;

      return (
        item.code.toLowerCase().includes(query) ||
        item.name.toLowerCase().includes(query) ||
        item.description.toLowerCase().includes(query) ||
        item.relation.toLowerCase().includes(query)
      );
    });
  }, [items, activeTab, filters]);

  // Tab switch handler
  const handleTabChange = useCallback((newTab: MasterTabType) => {
    setActiveTab(newTab);
    const conf = MASTER_TAB_CONFIGS[newTab];
    toast.info(`Beralih ke tab: ${conf.label}`);
  }, []);

  // Filter update handler
  const handleFilterChange = useCallback(
    (newFilters: Partial<MasterFilterState>) => {
      setFilters((prev) => ({ ...prev, ...newFilters }));
    },
    []
  );

  // Reset filter
  const handleResetFilter = useCallback(() => {
    setFilters({ searchQuery: "", status: "all" });
    toast.info("Filter master data berhasil direset ke standar.");
  }, []);

  // Open Create Dialog
  const handleOpenCreateModal = useCallback(() => {
    setEditingItem(null);
    setIsFormOpen(true);
  }, []);

  // Open Edit Dialog
  const handleEdit = useCallback((item: MasterItem) => {
    setEditingItem(item);
    setIsFormOpen(true);
  }, []);

  // Open View Detail Dialog
  const handleViewDetail = useCallback((item: MasterItem) => {
    setDetailItem(item);
    setIsDetailOpen(true);
  }, []);

  // Open Delete Confirmation Dialog
  const handleDeletePrompt = useCallback((item: MasterItem) => {
    setDeleteItem(item);
    setIsDeleteOpen(true);
  }, []);

  // Confirm Save (Create or Edit)
  const handleSaveItem = useCallback(
    (itemData: Omit<MasterItem, "id"> & { id?: string }) => {
      if (itemData.id) {
        setItems((prev) =>
          prev.map((item) =>
            item.id === itemData.id ? { ...item, ...itemData } : item
          )
        );
        toast.success(
          `Data master "${itemData.name}" (${itemData.code}) berhasil diperbarui.`
        );
      } else {
        const newItem: MasterItem = {
          ...itemData,
          id: `master-${Date.now()}`,
        };
        setItems((prev) => [newItem, ...prev]);
        toast.success(
          `Data master baru "${itemData.name}" (${itemData.code}) berhasil ditambahkan.`
        );
      }
    },
    []
  );

  // Confirm Delete
  const handleConfirmDelete = useCallback(() => {
    if (!deleteItem) return;
    setItems((prev) => prev.filter((item) => item.id !== deleteItem.id));
    toast.success(
      `Entitas master "${deleteItem.name}" (${deleteItem.code}) berhasil dihapus.`
    );
    setDeleteItem(null);
  }, [deleteItem]);

  // Export CSV handler
  const handleExportCSV = useCallback(() => {
    const conf = MASTER_TAB_CONFIGS[activeTab];
    const filename = `Master_Data_${conf.label.replace(/\s+/g, "_")}_SIPUS_Ar-Rasyid.csv`;
    toast.success(`File "${filename}" berhasil di-generate dan diunduh.`);
  }, [activeTab]);

  // Export Excel handler for Topbar
  const handleExportExcel = useCallback(() => {
    const filename = `Master_Data_Semua_Entitas_SIPUS_Ar-Rasyid_Okt2024.xlsx`;
    toast.success(`File spreadsheet "${filename}" berhasil diunduh ke perangkat.`);
  }, []);

  return (
    <AdminLayout
      title="Master Data Sistem"
      dateString="Kamis, 24 Oktober 2024"
      actions={
        <Button
          type="button"
          size="sm"
          onClick={handleExportExcel}
          className="bg-[#166534] hover:bg-[#14532d] text-white text-xs font-bold shadow-xs gap-2 py-2 px-3.5 h-auto cursor-pointer"
          title="Unduh format spreadsheet"
        >
          <Download className="w-4 h-4 text-emerald-200" />
          <span>Export to Excel (.xlsx)</span>
        </Button>
      }
    >
      {/* Header & Actions */}
      <MasterHeaderBanner
        onExportCSV={handleExportCSV}
        onOpenCreateModal={handleOpenCreateModal}
      />

      {/* Card Ringkasan Metrik Master Data */}
      <MasterMetrics onSelectTab={handleTabChange} />

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
    </AdminLayout>
  );
}
