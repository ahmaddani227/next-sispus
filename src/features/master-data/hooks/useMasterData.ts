"use client";

import { useState, useCallback, useMemo } from "react";
import { toast } from "sonner";
import {
  MasterItem,
  MasterTabType,
  MasterFilterState,
} from "../types/master-data.types";
import {
  INITIAL_MASTER_ITEMS,
  MASTER_TAB_CONFIGS,
  MASTER_METRICS_DATA,
} from "../constants/master-data";
import { MetricCardProps } from "@/components/MetricCards";

export function useMasterData() {
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

  // Tab switch handler
  const handleTabChange = useCallback((newTab: MasterTabType) => {
    setActiveTab(newTab);
    const conf = MASTER_TAB_CONFIGS[newTab];
    toast.info(`Beralih ke tab: ${conf.label}`);
  }, []);

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

  // Metrik Cards Data
  const masterMetricItems: MetricCardProps[] = useMemo(() => {
    const tabKeys: MasterTabType[] = ["kategori", "rak", "penerbit", "kelas"];
    return MASTER_METRICS_DATA.map((metric, index) => {
      const targetTab = tabKeys[index];
      const isLayers = metric.icon === "layers";
      const isBuilding = metric.icon === "building";

      return {
        id: metric.id,
        title: metric.title,
        value: metric.value,
        unit: metric.unit,
        badgeText: metric.badgeText,
        badgeVariant: metric.badgeVariant,
        description: metric.description,
        iconName: metric.icon,
        highlightColor: isLayers
          ? "text-blue-700"
          : isBuilding
          ? "text-amber-700"
          : "text-slate-900",
        unitColor: isLayers ? "text-blue-600" : "text-slate-500",
        onClick: () => handleTabChange(targetTab),
        clickable: true,
      };
    });
  }, [handleTabChange]);

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

  return {
    activeTab,
    filters,
    tabCounts,
    filteredItems,
    masterMetricItems,
    // Dialog state & setters
    isFormOpen,
    setIsFormOpen,
    editingItem,
    isDetailOpen,
    setIsDetailOpen,
    detailItem,
    isDeleteOpen,
    setIsDeleteOpen,
    deleteItem,
    // Actions
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
    handleExportExcel,
  };
}
