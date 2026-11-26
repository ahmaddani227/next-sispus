"use client";

import {
  useCallback,
  useEffect,
  useRef,
  useState,
  useTransition,
} from "react";
import { toast } from "sonner";
import {
  Ban,
  BookOpen,
  CheckCircle2,
  Loader2,
  Plus,
  QrCode,
  RotateCcw,
  ScanBarcode,
  Search,
  Upload,
  Users,
} from "lucide-react";
import {
  findStudentByNisAction,
  getStudentClassOptionsAction,
  getStudentDetailAction,
  getStudentsAction,
} from "../actions/student.actions";
import type {
  StudentClassOption,
  StudentDetailItem,
  StudentFilterParams,
  StudentItem,
  StudentListResponse,
} from "../types/student.types";
import { StudentDetailDialog } from "./student-detail-dialog";
import { StudentFormDialog } from "./student-form-dialog";
import { StudentImportDialog } from "./student-import-dialog";
import { StudentStatusDialog } from "./student-status-dialog";
import { StudentTable } from "./student-table";

interface StudentPageClientProps {
  initialData: StudentListResponse;
  initialClassOptions: StudentClassOption[];
}

export function StudentPageClient({
  initialData,
  initialClassOptions,
}: StudentPageClientProps) {
  const [listData, setListData] = useState<StudentListResponse>(initialData);
  const [classOptions, setClassOptions] =
    useState<StudentClassOption[]>(initialClassOptions);

  // Filter & Pagination
  const [search, setSearch] = useState("");
  const [classId, setClassId] = useState("all");
  const [statusFilter, setStatusFilter] =
    useState<NonNullable<StudentFilterParams["status"]>>("all");
  const [loanStatus, setLoanStatus] =
    useState<NonNullable<StudentFilterParams["loanStatus"]>>("all");
  const [page, setPage] = useState(initialData.page);

  // Pemindai Barcode NIS
  const [scanInput, setScanInput] = useState("");
  const [isScanning, startScanTransition] = useTransition();

  // Modal States
  const [formOpen, setFormOpen] = useState(false);
  const [editingStudent, setEditingStudent] = useState<StudentItem | null>(
    null
  );

  const [detailOpen, setDetailOpen] = useState(false);
  const [detailStudent, setDetailStudent] = useState<StudentDetailItem | null>(
    null
  );
  const [isLoadingDetail, startDetailTransition] = useTransition();

  const [statusDialogOpen, setStatusDialogOpen] = useState(false);
  const [statusTarget, setStatusTarget] = useState<StudentItem | null>(null);

  const [importOpen, setImportOpen] = useState(false);

  const [isLoadingList, startListTransition] = useTransition();
  const isFirstRender = useRef(true);

  const fetchStudents = useCallback(
    (overrides?: Partial<StudentFilterParams>) => {
      const params: StudentFilterParams = {
        search: overrides?.search ?? search,
        classId: overrides?.classId ?? classId,
        status: overrides?.status ?? statusFilter,
        loanStatus: overrides?.loanStatus ?? loanStatus,
        page: overrides?.page ?? page,
        pageSize: listData.pageSize,
      };

      startListTransition(async () => {
        const [res, classes] = await Promise.all([
          getStudentsAction(params),
          getStudentClassOptionsAction(),
        ]);

        if (!res.success || !res.data) {
          toast.error(res.message);
          return;
        }

        setListData(res.data);
        setClassOptions(classes);
      });
    },
    [search, classId, statusFilter, loanStatus, page, listData.pageSize]
  );

  // Debounce saat filter atau pencarian berubah
  useEffect(() => {
    if (isFirstRender.current) {
      isFirstRender.current = false;
      return;
    }

    const timer = setTimeout(() => {
      fetchStudents({
        search,
        classId,
        status: statusFilter,
        loanStatus,
        page,
      });
    }, 300);

    return () => clearTimeout(timer);
  }, [search, classId, statusFilter, loanStatus, page, fetchStudents]);

  const handleSearchChange = (value: string) => {
    setSearch(value);
    setPage(1);
  };

  const handleClassFilterChange = (value: string) => {
    setClassId(value);
    setPage(1);
  };

  const handleStatusFilterChange = (
    value: NonNullable<StudentFilterParams["status"]>
  ) => {
    setStatusFilter(value);
    setPage(1);
  };

  const handleLoanStatusFilterChange = (
    value: NonNullable<StudentFilterParams["loanStatus"]>
  ) => {
    setLoanStatus(value);
    setPage(1);
  };

  const handleResetFilters = () => {
    setSearch("");
    setClassId("all");
    setStatusFilter("all");
    setLoanStatus("all");
    setPage(1);
  };

  const handleScanNis = (e: React.FormEvent) => {
    e.preventDefault();
    const trimmed = scanInput.trim();
    if (!trimmed) {
      toast.error("Masukkan atau scan NIS siswa terlebih dahulu.");
      return;
    }

    startScanTransition(async () => {
      const res = await findStudentByNisAction(trimmed);
      if (!res.success || !res.data) {
        toast.error(res.message);
        return;
      }

      setDetailStudent(res.data);
      setDetailOpen(true);
      setScanInput("");
    });
  };

  const handleOpenCreate = () => {
    setEditingStudent(null);
    setFormOpen(true);
  };

  const handleOpenEdit = (student: StudentItem) => {
    setEditingStudent(student);
    setFormOpen(true);
  };

  const handleOpenDetail = (student: StudentItem) => {
    setDetailStudent(null);
    setDetailOpen(true);

    startDetailTransition(async () => {
      const res = await getStudentDetailAction(student.id);
      if (!res.success || !res.data) {
        toast.error(res.message);
        setDetailOpen(false);
        return;
      }
      setDetailStudent(res.data);
    });
  };

  const handleOpenToggleStatus = (student: StudentItem) => {
    setStatusTarget(student);
    setStatusDialogOpen(true);
  };

  const hasActiveFilters =
    search.trim() !== "" ||
    classId !== "all" ||
    statusFilter !== "all" ||
    loanStatus !== "all";

  const { stats } = listData;
  const activePct =
    stats.totalStudents > 0
      ? ((stats.activeStudents / stats.totalStudents) * 100).toFixed(1)
      : "0.0";
  const borrowingPct =
    stats.totalStudents > 0
      ? ((stats.borrowingStudents / stats.totalStudents) * 100).toFixed(1)
      : "0.0";

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col gap-4 rounded-xl border border-slate-200 bg-white p-6 shadow-xs sm:flex-row sm:items-center sm:justify-between dark:border-slate-800 dark:bg-slate-900">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-slate-900 dark:text-white">
            Manajemen Siswa
          </h1>
          <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
            Kelola data keanggotaan siswa MI &amp; MTs, impor data massal, dan
            pantau status sirkulasi perpustakaan.
          </p>
        </div>

        <button
          type="button"
          onClick={handleOpenCreate}
          className="inline-flex items-center justify-center gap-2 rounded-lg bg-emerald-600 px-4 py-2.5 text-sm font-medium text-white transition-colors hover:bg-emerald-700"
        >
          <Plus className="h-4 w-4" />
          Tambah Siswa Baru
        </button>
      </div>

      {/* 4 Kartu Statistik */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-xs dark:border-slate-800 dark:bg-slate-900">
          <div className="flex items-center justify-between">
            <span className="text-sm font-medium text-slate-500 dark:text-slate-400">
              Total Siswa Terdaftar
            </span>
            <Users className="h-5 w-5 text-emerald-500" />
          </div>
          <div className="mt-2 flex items-baseline gap-2">
            <p className="text-2xl font-bold text-slate-900 dark:text-white">
              {new Intl.NumberFormat("id-ID").format(stats.totalStudents)}
            </p>
            <span className="text-xs text-slate-500 dark:text-slate-400">
              Siswa
            </span>
          </div>
          <p className="mt-1 text-xs text-slate-500 dark:text-slate-400">
            Total basis data anggota
          </p>
        </div>

        <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-xs dark:border-slate-800 dark:bg-slate-900">
          <div className="flex items-center justify-between">
            <span className="text-sm font-medium text-slate-500 dark:text-slate-400">
              Siswa Aktif Perpustakaan
            </span>
            <CheckCircle2 className="h-5 w-5 text-emerald-500" />
          </div>
          <div className="mt-2 flex items-baseline gap-2">
            <p className="text-2xl font-bold text-emerald-600 dark:text-emerald-400">
              {new Intl.NumberFormat("id-ID").format(stats.activeStudents)}
            </p>
            <span className="rounded-full bg-emerald-100 px-2 py-0.5 text-[11px] font-medium text-emerald-700 dark:bg-emerald-500/15 dark:text-emerald-400">
              {activePct}% Aktif
            </span>
          </div>
          <p className="mt-1 text-xs text-slate-500 dark:text-slate-400">
            Status keanggotaan aktif sirkulasi
          </p>
        </div>

        <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-xs dark:border-slate-800 dark:bg-slate-900">
          <div className="flex items-center justify-between">
            <span className="text-sm font-medium text-slate-500 dark:text-slate-400">
              Siswa Sedang Meminjam
            </span>
            <BookOpen className="h-5 w-5 text-blue-500" />
          </div>
          <div className="mt-2 flex items-baseline gap-2">
            <p className="text-2xl font-bold text-blue-600 dark:text-blue-400">
              {new Intl.NumberFormat("id-ID").format(stats.borrowingStudents)}
            </p>
            <span className="rounded-full bg-blue-100 px-2 py-0.5 text-[11px] font-medium text-blue-700 dark:bg-blue-500/15 dark:text-blue-400">
              {borrowingPct}% Pinjam
            </span>
          </div>
          <p className="mt-1 text-xs text-slate-500 dark:text-slate-400">
            Memiliki pinjaman buku aktif
          </p>
        </div>

        <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-xs dark:border-slate-800 dark:bg-slate-900">
          <div className="flex items-center justify-between">
            <span className="text-sm font-medium text-slate-500 dark:text-slate-400">
              Status Nonaktif / Skorsing
            </span>
            <Ban className="h-5 w-5 text-red-500" />
          </div>
          <div className="mt-2 flex items-baseline gap-2">
            <p className="text-2xl font-bold text-red-600 dark:text-red-400">
              {new Intl.NumberFormat("id-ID").format(
                stats.inactiveOrSanctionedStudents
              )}
            </p>
            <span className="rounded-full bg-red-100 px-2 py-0.5 text-[11px] font-medium text-red-700 dark:bg-red-500/15 dark:text-red-400">
              Perlu Review
            </span>
          </div>
          <p className="mt-1 text-xs text-slate-500 dark:text-slate-400">
            Perlu evaluasi / mutasi / sanksi
          </p>
        </div>
      </div>

      {/* Banner Pemindai Barcode NIS */}
      <form
        onSubmit={handleScanNis}
        className="flex flex-col gap-4 rounded-xl border border-emerald-700/30 bg-emerald-900 p-4 text-white shadow-xs lg:flex-row lg:items-center lg:justify-between dark:border-emerald-500/30 dark:bg-emerald-950/90"
      >
        <div className="flex items-center gap-3.5">
          <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-lg bg-emerald-800/80 text-emerald-300 dark:bg-emerald-900/80">
            <QrCode className="h-6 w-6" />
          </div>
          <div>
            <div className="flex flex-wrap items-center gap-2">
              <h2 className="text-xs font-bold uppercase tracking-wider text-emerald-100">
                Pemindai Barcode NIS Siswa
              </h2>
              <span className="inline-flex items-center gap-1 rounded-full bg-emerald-500/20 px-2 py-0.5 text-[11px] font-medium text-emerald-300">
                <span className="h-1.5 w-1.5 rounded-full bg-emerald-400" />
                Ready to Scan
              </span>
            </div>
            <p className="mt-0.5 text-xs text-emerald-200/80">
              Arahkan USB scanner kartu siswa atau ketikkan NIS lalu tekan Enter
              untuk melihat profil secara instan.
            </p>
          </div>
        </div>

        <div className="flex w-full items-center gap-2 lg:w-auto">
          <div className="relative flex-1 lg:w-72">
            <ScanBarcode className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-emerald-300/80" />
            <input
              type="text"
              value={scanInput}
              onChange={(e) => setScanInput(e.target.value)}
              disabled={isScanning}
              placeholder="Scan Barcode NIS (cth: 202407001)"
              className="w-full rounded-lg border border-emerald-700 bg-emerald-950/60 py-2 pl-9 pr-3 text-sm text-white placeholder:text-emerald-300/60 outline-none focus:border-emerald-400 focus:ring-2 focus:ring-emerald-400/25"
            />
          </div>
          <button
            type="submit"
            disabled={isScanning}
            className="inline-flex shrink-0 items-center gap-1.5 rounded-lg bg-emerald-600 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-emerald-500 disabled:opacity-50"
          >
            {isScanning ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : (
              <Search className="h-4 w-4" />
            )}
            Scan NIS
          </button>
        </div>
      </form>

      {/* Baris Pencarian, Impor, & Filter */}
      <div className="space-y-3 rounded-xl border border-slate-200 bg-white p-4 shadow-xs dark:border-slate-800 dark:bg-slate-900">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
          <div className="relative flex-1">
            <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              value={search}
              onChange={(e) => handleSearchChange(e.target.value)}
              placeholder="Cari berdasarkan NIS atau Nama Siswa..."
              className="w-full rounded-lg border border-slate-300 bg-white py-2 pl-9 pr-3 text-sm text-slate-900 outline-none focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20 dark:border-slate-700 dark:bg-slate-950 dark:text-white"
            />
          </div>

          <button
            type="button"
            onClick={() => setImportOpen(true)}
            className="inline-flex shrink-0 items-center justify-center gap-2 rounded-lg border border-slate-300 bg-white px-4 py-2 text-sm font-medium text-slate-700 transition-colors hover:bg-slate-50 dark:border-slate-700 dark:bg-slate-950 dark:text-slate-200 dark:hover:bg-slate-800"
          >
            <Upload className="h-4 w-4" />
            Impor Data Siswa
          </button>
        </div>

        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-4">
          <select
            value={classId}
            onChange={(e) => handleClassFilterChange(e.target.value)}
            aria-label="Filter kelas"
            className="rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm text-slate-700 outline-none focus:border-emerald-500 dark:border-slate-700 dark:bg-slate-950 dark:text-slate-200"
          >
            <option value="all">Semua Kelas</option>
            <option value="none">Belum Punya Kelas</option>
            {classOptions.map((cls) => (
              <option key={cls.id} value={cls.id}>
                {cls.name} ({cls.academicYear})
                {!cls.isActive ? " - Nonaktif" : ""}
              </option>
            ))}
          </select>

          <select
            value={statusFilter}
            onChange={(e) =>
              handleStatusFilterChange(
                e.target.value as NonNullable<StudentFilterParams["status"]>
              )
            }
            aria-label="Filter status anggota"
            className="rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm text-slate-700 outline-none focus:border-emerald-500 dark:border-slate-700 dark:bg-slate-950 dark:text-slate-200"
          >
            <option value="all">Semua Status Anggota</option>
            <option value="ACTIVE">Aktif</option>
            <option value="INACTIVE">Nonaktif</option>
          </select>

          <select
            value={loanStatus}
            onChange={(e) =>
              handleLoanStatusFilterChange(
                e.target.value as NonNullable<StudentFilterParams["loanStatus"]>
              )
            }
            aria-label="Filter status pinjaman"
            className="rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm text-slate-700 outline-none focus:border-emerald-500 dark:border-slate-700 dark:bg-slate-950 dark:text-slate-200"
          >
            <option value="all">Semua Status Pinjaman</option>
            <option value="BORROWING">Sedang Meminjam</option>
            <option value="FREE">Bebas Pinjam</option>
            <option value="BLOCKED">Akses Diblokir / Skorsing</option>
          </select>

          <button
            type="button"
            onClick={handleResetFilters}
            disabled={!hasActiveFilters}
            className="inline-flex items-center justify-center gap-1.5 rounded-lg border border-slate-300 px-3 py-2 text-sm font-medium text-slate-600 transition-colors hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-45 dark:border-slate-700 dark:text-slate-300 dark:hover:bg-slate-800"
          >
            <RotateCcw className="h-3.5 w-3.5" />
            Reset Filter
          </button>
        </div>
      </div>

      {/* Tabel Data Siswa */}
      <div className={isLoadingList ? "opacity-60 transition-opacity" : ""}>
        <StudentTable
          students={listData.data}
          total={listData.total}
          page={listData.page}
          pageSize={listData.pageSize}
          totalPages={listData.totalPages}
          maxActiveLoans={listData.maxActiveLoans}
          onPageChange={(nextPage) => setPage(nextPage)}
          onDetail={handleOpenDetail}
          onEdit={handleOpenEdit}
          onToggleStatus={handleOpenToggleStatus}
        />
      </div>

      {/* Modal Tambah / Edit Siswa */}
      <StudentFormDialog
        open={formOpen}
        onOpenChange={setFormOpen}
        initialData={editingStudent}
        classOptions={classOptions}
        maxActiveLoans={listData.maxActiveLoans}
        defaultLoanDays={listData.defaultLoanDays}
        onSuccess={() => fetchStudents()}
      />

      {/* Modal Detail Siswa */}
      <StudentDetailDialog
        open={detailOpen}
        onOpenChange={setDetailOpen}
        student={detailStudent}
        isLoading={isLoadingDetail}
        onEdit={handleOpenEdit}
      />

      {/* Modal Konfirmasi Nonaktifkan / Aktifkan */}
      <StudentStatusDialog
        open={statusDialogOpen}
        onOpenChange={setStatusDialogOpen}
        student={statusTarget}
        onSuccess={() => fetchStudents()}
      />

      {/* Modal Impor Excel / CSV */}
      <StudentImportDialog
        open={importOpen}
        onOpenChange={setImportOpen}
        onSuccess={() => {
          setPage(1);
          fetchStudents({ page: 1 });
        }}
      />
    </div>
  );
}