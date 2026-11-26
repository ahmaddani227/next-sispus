"use client";

import { useCallback, useEffect, useMemo, useState, useTransition } from "react";
import { toast } from "sonner";
import {
  CheckCircle2,
  GraduationCap,
  Plus,
  RotateCcw,
  Search,
  Users,
} from "lucide-react";
import {
  getAcademicYearsAction,
  getClassesAction,
} from "../actions/class.actions";
import type { ClassFilterParams, ClassItem } from "../types/class.types";
import { ClassFormDialog } from "./class-form-dialog";
import { ClassTable } from "./class-table";

interface ClassPageClientProps {
  initialClasses: ClassItem[];
  initialAcademicYears: string[];
}

export function ClassPageClient({
  initialClasses,
  initialAcademicYears,
}: ClassPageClientProps) {
  const [classes, setClasses] = useState<ClassItem[]>(initialClasses);
  const [academicYears, setAcademicYears] =
    useState<string[]>(initialAcademicYears);

  const [search, setSearch] = useState("");
  const [academicYear, setAcademicYear] = useState("all");
  const [statusFilter, setStatusFilter] =
    useState<ClassFilterParams["isActive"]>("all");

  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingClass, setEditingClass] = useState<ClassItem | null>(null);
  const [isLoading, startTransition] = useTransition();

  const fetchClasses = useCallback(
    (overrides?: Partial<ClassFilterParams>) => {
      const params: ClassFilterParams = {
        search: overrides?.search ?? search,
        academicYear: overrides?.academicYear ?? academicYear,
        isActive: overrides?.isActive ?? statusFilter,
      };

      startTransition(async () => {
        const [res, years] = await Promise.all([
          getClassesAction(params),
          getAcademicYearsAction(),
        ]);

        if (!res.success || !res.data) {
          toast.error(res.message);
          return;
        }

        setClasses(res.data.data);
        setAcademicYears(years);
      });
    },
    [search, academicYear, statusFilter]
  );

  // Debounce pencarian agar tidak terlalu sering memanggil server
  useEffect(() => {
    const timer = setTimeout(() => {
      fetchClasses({ search, academicYear, isActive: statusFilter });
    }, 300);

    return () => clearTimeout(timer);
  }, [search, academicYear, statusFilter, fetchClasses]);

  const stats = useMemo(() => {
    const totalClasses = classes.length;
    const activeClasses = classes.filter((c) => c.isActive).length;
    const totalStudents = classes.reduce(
      (sum, c) => sum + (c._count?.students ?? 0),
      0
    );
    return { totalClasses, activeClasses, totalStudents };
  }, [classes]);

  const handleOpenCreate = () => {
    setEditingClass(null);
    setDialogOpen(true);
  };

  const handleOpenEdit = (item: ClassItem) => {
    setEditingClass(item);
    setDialogOpen(true);
  };

  const handleResetFilters = () => {
    setSearch("");
    setAcademicYear("all");
    setStatusFilter("all");
  };

  const hasActiveFilters =
    search.trim() !== "" || academicYear !== "all" || statusFilter !== "all";

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col gap-4 rounded-xl border border-slate-200 bg-white p-6 shadow-xs sm:flex-row sm:items-center sm:justify-between dark:border-slate-800 dark:bg-slate-900">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-slate-900 dark:text-white">
            Manajemen Kelas
          </h1>
          <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
            Kelola daftar rombel kelas MI &amp; MTs beserta tahun ajarannya.
          </p>
        </div>
        <button
          type="button"
          onClick={handleOpenCreate}
          className="inline-flex items-center justify-center gap-2 rounded-lg bg-emerald-600 px-4 py-2.5 text-sm font-medium text-white transition-colors hover:bg-emerald-700"
        >
          <Plus className="h-4 w-4" />
          Tambah Kelas
        </button>
      </div>

      {/* Kartu Statistik */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
        <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-xs dark:border-slate-800 dark:bg-slate-900">
          <div className="flex items-center justify-between">
            <span className="text-sm font-medium text-slate-500 dark:text-slate-400">
              Total Rombel
            </span>
            <GraduationCap className="h-5 w-5 text-emerald-500" />
          </div>
          <p className="mt-2 text-2xl font-bold text-slate-900 dark:text-white">
            {stats.totalClasses}
          </p>
        </div>

        <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-xs dark:border-slate-800 dark:bg-slate-900">
          <div className="flex items-center justify-between">
            <span className="text-sm font-medium text-slate-500 dark:text-slate-400">
              Kelas Aktif
            </span>
            <CheckCircle2 className="h-5 w-5 text-blue-500" />
          </div>
          <p className="mt-2 text-2xl font-bold text-slate-900 dark:text-white">
            {stats.activeClasses}
          </p>
        </div>

        <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-xs dark:border-slate-800 dark:bg-slate-900">
          <div className="flex items-center justify-between">
            <span className="text-sm font-medium text-slate-500 dark:text-slate-400">
              Total Siswa Terdaftar
            </span>
            <Users className="h-5 w-5 text-purple-500" />
          </div>
          <p className="mt-2 text-2xl font-bold text-slate-900 dark:text-white">
            {stats.totalStudents}
          </p>
        </div>
      </div>

      {/* Filter & Pencarian */}
      <div className="flex flex-col gap-3 rounded-xl border border-slate-200 bg-white p-4 shadow-xs sm:flex-row sm:items-center dark:border-slate-800 dark:bg-slate-900">
        <div className="relative flex-1">
          <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Cari nama kelas atau tahun ajaran..."
            className="w-full rounded-lg border border-slate-300 bg-white py-2 pl-9 pr-3 text-sm text-slate-900 outline-none focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20 dark:border-slate-700 dark:bg-slate-950 dark:text-white"
          />
        </div>

        <select
          value={academicYear}
          onChange={(e) => setAcademicYear(e.target.value)}
          aria-label="Filter tahun ajaran"
          className="rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm text-slate-700 outline-none focus:border-emerald-500 dark:border-slate-700 dark:bg-slate-950 dark:text-slate-200"
        >
          <option value="all">Semua Tahun Ajaran</option>
          {academicYears.map((year) => (
            <option key={year} value={year}>
              {year}
            </option>
          ))}
        </select>

        <select
          value={statusFilter}
          onChange={(e) =>
            setStatusFilter(e.target.value as ClassFilterParams["isActive"])
          }
          aria-label="Filter status kelas"
          className="rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm text-slate-700 outline-none focus:border-emerald-500 dark:border-slate-700 dark:bg-slate-950 dark:text-slate-200"
        >
          <option value="all">Semua Status</option>
          <option value="active">Aktif</option>
          <option value="inactive">Nonaktif</option>
        </select>

        {hasActiveFilters && (
          <button
            type="button"
            onClick={handleResetFilters}
            className="inline-flex items-center justify-center gap-1.5 rounded-lg border border-slate-300 px-3 py-2 text-sm text-slate-600 hover:bg-slate-50 dark:border-slate-700 dark:text-slate-300 dark:hover:bg-slate-800"
          >
            <RotateCcw className="h-3.5 w-3.5" />
            Reset
          </button>
        )}
      </div>

      {/* Tabel Data */}
      <div className={isLoading ? "opacity-60 transition-opacity" : ""}>
        <ClassTable
          classes={classes}
          onEdit={handleOpenEdit}
          onRefresh={() => fetchClasses()}
        />
      </div>

      {/* Modal Tambah / Edit */}
      <ClassFormDialog
        open={dialogOpen}
        onOpenChange={setDialogOpen}
        initialData={editingClass}
        onSuccess={() => fetchClasses()}
      />
    </div>
  );
}