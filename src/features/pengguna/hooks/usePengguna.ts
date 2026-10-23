"use client";

import { useState, useMemo, useCallback } from "react";
import { toast } from "sonner";
import { MOCK_PENGGUNA, buildPenggunaMetrics } from "../constants/pengguna";
import type {
  Pengguna,
  PenggunaFilterState,
  PenggunaFormValues,
} from "../types/pengguna.types";

const ITEMS_PER_PAGE = 5;

export function usePengguna() {
  const [data, setData] = useState<Pengguna[]>(MOCK_PENGGUNA);
  const [filters, setFilters] = useState<PenggunaFilterState>({
    searchQuery: "",
    role: "all",
    status: "all",
  });
  const [currentPage, setCurrentPage] = useState(1);

  // Dialog states
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<Pengguna | null>(null);
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);
  const [deleteItem, setDeleteItem] = useState<Pengguna | null>(null);
  const [isStatusOpen, setIsStatusOpen] = useState(false);
  const [statusUser, setStatusUser] = useState<Pengguna | null>(null);

  const filteredItems = useMemo(() => {
    return data.filter((u) => {
      const q = filters.searchQuery.toLowerCase();
      const matchSearch =
        !q ||
        u.nama.toLowerCase().includes(q) ||
        u.username.toLowerCase().includes(q);
      const matchRole = filters.role === "all" || u.role === filters.role;
      const matchStatus =
        filters.status === "all" || u.status === filters.status;
      return matchSearch && matchRole && matchStatus;
    });
  }, [data, filters]);

  const totalPages = Math.ceil(filteredItems.length / ITEMS_PER_PAGE);
  const paginatedItems = filteredItems.slice(
    (currentPage - 1) * ITEMS_PER_PAGE,
    currentPage * ITEMS_PER_PAGE
  );

  const metrics = useMemo(() => buildPenggunaMetrics(data), [data]);

  const handleFilterChange = useCallback(
    (key: keyof PenggunaFilterState, value: string) => {
      setFilters((prev) => ({ ...prev, [key]: value }));
      setCurrentPage(1);
    },
    []
  );

  const handleResetFilter = useCallback(() => {
    setFilters({ searchQuery: "", role: "all", status: "all" });
    setCurrentPage(1);
  }, []);

  const handleOpenCreate = useCallback(() => {
    setEditingItem(null);
    setIsFormOpen(true);
  }, []);

  const handleEdit = useCallback((item: Pengguna) => {
    setEditingItem(item);
    setIsFormOpen(true);
  }, []);

  const handleDeletePrompt = useCallback((item: Pengguna) => {
    setDeleteItem(item);
    setIsDeleteOpen(true);
  }, []);

  const handleToggleStatus = useCallback((item: Pengguna) => {
    if (item.isSelf && item.status === "Aktif") {
      toast.error("Anda tidak dapat menonaktifkan akun Anda sendiri yang sedang aktif digunakan.");
      return;
    }
    setStatusUser(item);
    setIsStatusOpen(true);
  }, []);

  const handleConfirmToggleStatus = useCallback(() => {
    if (!statusUser) return;
    const newStatus = statusUser.status === "Aktif" ? "Nonaktif" : "Aktif";

    setData((prev) =>
      prev.map((u) =>
        u.id === statusUser.id
          ? { ...u, status: newStatus }
          : u
      )
    );

    toast.success(
      `Status akun ${statusUser.nama} berhasil diubah menjadi ${newStatus}.`
    );

    setIsStatusOpen(false);
    setStatusUser(null);
  }, [statusUser]);

  const handleSave = useCallback(
    (values: PenggunaFormValues) => {
      if (editingItem) {
        setData((prev) =>
          prev.map((u) =>
            u.id === editingItem.id
              ? {
                  ...u,
                  nama: values.nama,
                  username: values.username,
                  role: values.role,
                }
              : u
          )
        );
        toast.success("Data akun pengguna berhasil diperbarui.");
      } else {
        const initials = values.nama
          .split(" ")
          .slice(0, 2)
          .map((w) => w[0])
          .join("")
          .toUpperCase();
        const newUser: Pengguna = {
          id: String(Date.now()),
          nama: values.nama,
          username: values.username,
          role: values.role,
          status: "Aktif",
          createdAt: new Date().toISOString(),
          avatarInitials: initials,
          avatarColor: "emerald",
        };
        setData((prev) => [newUser, ...prev]);
        toast.success("Akun pengguna baru berhasil didaftarkan ke SIPUS.");
      }
      setIsFormOpen(false);
      setEditingItem(null);
    },
    [editingItem]
  );

  const handleConfirmDelete = useCallback(() => {
    if (!deleteItem) return;
    setData((prev) => prev.filter((u) => u.id !== deleteItem.id));
    toast.success(`Akun ${deleteItem.nama} berhasil dihapus dari sistem.`);
    setIsDeleteOpen(false);
    setDeleteItem(null);
  }, [deleteItem]);

  const handleExport = useCallback(() => {
    toast.info("Fitur ekspor data pengguna sedang dalam pengembangan.");
  }, []);

  return {
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
    handleFilterChange,
    handleResetFilter,
    handleOpenCreate,
    handleEdit,
    handleDeletePrompt,
    handleToggleStatus,
    handleConfirmToggleStatus,
    handleSave,
    handleConfirmDelete,
    handleExport,
    setCurrentPage,
  };
}
