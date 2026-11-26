"use client";

import { useState, useTransition } from "react";
import { toast } from "sonner";
import { Pencil, Power, Trash2, Users } from "lucide-react";
import {
  deleteClassAction,
  toggleClassStatusAction,
} from "../actions/class.actions";
import type { ClassItem } from "../types/class.types";

interface ClassTableProps {
  classes: ClassItem[];
  onEdit: (item: ClassItem) => void;
  onRefresh: () => void;
}

export function ClassTable({ classes, onEdit, onRefresh }: ClassTableProps) {
  const [isPending, startTransition] = useTransition();
  const [activeId, setActiveId] = useState<string | null>(null);

  const handleToggleStatus = (item: ClassItem) => {
    setActiveId(item.id);
    startTransition(async () => {
      const result = await toggleClassStatusAction(item.id);
      setActiveId(null);

      if (!result.success) {
        toast.error(result.message);
        return;
      }

      toast.success(result.message);
      onRefresh();
    });
  };

  const handleDelete = (item: ClassItem) => {
    const studentCount = item._count?.students ?? 0;
    if (studentCount > 0) {
      toast.error(
        `Kelas "${item.name}" masih memiliki ${studentCount} siswa. Nonaktifkan kelas saja atau pindahkan siswa terlebih dahulu.`
      );
      return;
    }

    const confirmed = window.confirm(
      `Yakin ingin menghapus kelas "${item.name}" (${item.academicYear})?`
    );
    if (!confirmed) return;

    setActiveId(item.id);
    startTransition(async () => {
      const result = await deleteClassAction(item.id);
      setActiveId(null);

      if (!result.success) {
        toast.error(result.message);
        return;
      }

      toast.success(result.message);
      onRefresh();
    });
  };

  if (classes.length === 0) {
    return (
      <div className="rounded-xl border border-dashed border-slate-300 bg-white p-10 text-center dark:border-slate-700 dark:bg-slate-900/50">
        <p className="text-sm font-medium text-slate-700 dark:text-slate-200">
          Belum ada data kelas yang sesuai.
        </p>
        <p className="mt-1 text-xs text-slate-500 dark:text-slate-400">
          Klik tombol &ldquo;+ Tambah Kelas&rdquo; untuk menambahkan rombel baru.
        </p>
      </div>
    );
  }

  return (
    <div className="overflow-hidden rounded-xl border border-slate-200 bg-white shadow-xs dark:border-slate-800 dark:bg-slate-900">
      <div className="overflow-x-auto">
        <table className="w-full text-left text-sm">
          <thead className="border-b border-slate-200 bg-slate-50 text-xs font-semibold uppercase tracking-wider text-slate-600 dark:border-slate-800 dark:bg-slate-950/60 dark:text-slate-400">
            <tr>
              <th className="px-4 py-3.5">Nama Kelas</th>
              <th className="px-4 py-3.5">Tahun Ajaran</th>
              <th className="px-4 py-3.5">Jumlah Siswa</th>
              <th className="px-4 py-3.5">Status</th>
              <th className="px-4 py-3.5 text-right">Aksi</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-200 dark:divide-slate-800">
            {classes.map((item) => {
              const isRowBusy = isPending && activeId === item.id;
              const studentCount = item._count?.students ?? 0;

              return (
                <tr
                  key={item.id}
                  className="transition-colors hover:bg-slate-50/80 dark:hover:bg-slate-800/40"
                >
                  <td className="px-4 py-3.5 font-medium text-slate-900 dark:text-white">
                    {item.name}
                  </td>
                  <td className="px-4 py-3.5 text-slate-600 dark:text-slate-300">
                    {item.academicYear}
                  </td>
                  <td className="px-4 py-3.5">
                    <span className="inline-flex items-center gap-1.5 text-slate-700 dark:text-slate-300">
                      <Users className="h-4 w-4 text-slate-400" />
                      {studentCount} siswa
                    </span>
                  </td>
                  <td className="px-4 py-3.5">
                    <span
                      className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${
                        item.isActive
                          ? "bg-emerald-100 text-emerald-700 dark:bg-emerald-500/15 dark:text-emerald-400"
                          : "bg-slate-100 text-slate-600 dark:bg-slate-800 dark:text-slate-400"
                      }`}
                    >
                      {item.isActive ? "Aktif" : "Nonaktif"}
                    </span>
                  </td>
                  <td className="px-4 py-3.5 text-right">
                    <div className="inline-flex items-center justify-end gap-1.5">
                      <button
                        type="button"
                        onClick={() => onEdit(item)}
                        disabled={isRowBusy}
                        title="Edit kelas"
                        className="rounded-lg p-1.5 text-slate-500 hover:bg-slate-100 hover:text-slate-900 disabled:opacity-50 dark:text-slate-400 dark:hover:bg-slate-800 dark:hover:text-white"
                      >
                        <Pencil className="h-4 w-4" />
                      </button>
                      <button
                        type="button"
                        onClick={() => handleToggleStatus(item)}
                        disabled={isRowBusy}
                        title={item.isActive ? "Nonaktifkan kelas" : "Aktifkan kelas"}
                        className={`rounded-lg p-1.5 disabled:opacity-50 ${
                          item.isActive
                            ? "text-amber-600 hover:bg-amber-50 dark:text-amber-400 dark:hover:bg-amber-500/10"
                            : "text-emerald-600 hover:bg-emerald-50 dark:text-emerald-400 dark:hover:bg-emerald-500/10"
                        }`}
                      >
                        <Power className="h-4 w-4" />
                      </button>
                      <button
                        type="button"
                        onClick={() => handleDelete(item)}
                        disabled={isRowBusy || studentCount > 0}
                        title={
                          studentCount > 0
                            ? "Tidak bisa dihapus karena masih ada siswa"
                            : "Hapus kelas"
                        }
                        className="rounded-lg p-1.5 text-red-500 hover:bg-red-50 disabled:cursor-not-allowed disabled:opacity-35 dark:text-red-400 dark:hover:bg-red-500/10"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}