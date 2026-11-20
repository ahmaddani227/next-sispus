"use client";

import { useState, useMemo, useCallback, useEffect, useTransition } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { buildPenggunaMetrics } from "../constants/pengguna";
import {
  createPenggunaAction,
  updatePenggunaAction,
  toggleStatusPenggunaAction,
  deletePenggunaAction,
  getPenggunaListAction,
} from "../actions/pengguna.actions";
import type {
  Pengguna,
  PenggunaFilterState,
  PenggunaFormValues,
} from "../types/pengguna.types";

const ITEMS_PER_PAGE = 5;

export function usePengguna(initialData: Pengguna[] = []) {
  const router = useRouter();
  const [data, setData] = useState<Pengguna[]>(initialData);
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

  // Transition / Loading states
  const [isSaving, startSaveTransition] = useTransition();
  const [isDeleting, startDeleteTransition] = useTransition();
  const [isTogglingStatus, startStatusTransition] = useTransition();

  // Update data state whenever initialData from Server Component changes
  useEffect(() => {
    if (initialData && initialData.length > 0) {
      setData(initialData);
    }
  }, [initialData]);

  // If initialData was empty on mount, fetch once on client
  useEffect(() => {
    if (initialData.length === 0) {
      getPenggunaListAction().then((res) => {
        if (res.success && res.data) {
          setData(res.data);
        }
      });
    }
  }, [initialData.length]);

  const refreshList = useCallback(async () => {
    const res = await getPenggunaListAction();
    if (res.success && res.data) {
      setData(res.data);
    }
    router.refresh();
  }, [router]);

  const filteredItems = useMemo(() => {
    return data.filter((u) => {
      const q = filters.searchQuery.toLowerCase().trim();
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

  const totalPages = Math.max(1, Math.ceil(filteredItems.length / ITEMS_PER_PAGE));
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
    if (item.isSelf) {
      toast.error("Anda tidak dapat menghapus akun Anda sendiri.");
      return;
    }
    setDeleteItem(item);
    setIsDeleteOpen(true);
  }, []);

  const handleToggleStatus = useCallback((item: Pengguna) => {
    if (item.isSelf) {
      toast.error(
        "Anda tidak dapat menonaktifkan akun Anda sendiri yang sedang aktif digunakan."
      );
      return;
    }
    setStatusUser(item);
    setIsStatusOpen(true);
  }, []);

  const handleConfirmToggleStatus = useCallback(() => {
    if (!statusUser) return;

    startStatusTransition(async () => {
      const res = await toggleStatusPenggunaAction(statusUser.id);
      if (!res.success) {
        toast.error(res.error || "Gagal mengubah status akun.");
        return;
      }

      toast.success(res.message);
      setIsStatusOpen(false);
      setStatusUser(null);
      await refreshList();
    });
  }, [statusUser, refreshList]);

  const handleSave = useCallback(
    (values: PenggunaFormValues) => {
      startSaveTransition(async () => {
        if (editingItem) {
          // Update akun
          const res = await updatePenggunaAction({
            id: editingItem.id,
            nama: values.nama,
            username: values.username,
            password: values.password || undefined,
            role: values.role,
          });

          if (!res.success) {
            toast.error(res.error || "Gagal memperbarui data pengguna.");
            return;
          }

          toast.success(res.message);
          setIsFormOpen(false);
          setEditingItem(null);
          await refreshList();
        } else {
          // Tambah akun baru
          const res = await createPenggunaAction({
            nama: values.nama,
            username: values.username,
            password: values.password,
            role: values.role,
          });

          if (!res.success) {
            toast.error(res.error || "Gagal menambahkan akun baru.");
            return;
          }

          toast.success(res.message);
          setIsFormOpen(false);
          setEditingItem(null);
          await refreshList();
        }
      });
    },
    [editingItem, refreshList]
  );

  const handleConfirmDelete = useCallback(() => {
    if (!deleteItem) return;

    startDeleteTransition(async () => {
      const res = await deletePenggunaAction(deleteItem.id);
      if (!res.success) {
        toast.error(res.error || "Gagal menghapus akun pengguna.");
        return;
      }

      toast.success(res.message);
      setIsDeleteOpen(false);
      setDeleteItem(null);
      await refreshList();
    });
  }, [deleteItem, refreshList]);

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
  };
}
