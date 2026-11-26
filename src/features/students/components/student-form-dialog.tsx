"use client";

import { useEffect, useTransition } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { Info, PencilLine, UserPlus, X } from "lucide-react";
import {
  createStudentAction,
  updateStudentAction,
} from "../actions/student.actions";
import {
  createStudentSchema,
  type CreateStudentInput,
} from "../schemas/student.schema";
import type {
  StudentClassOption,
  StudentItem,
} from "../types/student.types";

interface StudentFormDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  initialData?: StudentItem | null;
  classOptions: StudentClassOption[];
  maxActiveLoans?: number;
  defaultLoanDays?: number;
  onSuccess?: () => void;
}

export function StudentFormDialog({
  open,
  onOpenChange,
  initialData,
  classOptions,
  maxActiveLoans = 2,
  defaultLoanDays = 7,
  onSuccess,
}: StudentFormDialogProps) {
  const isEdit = Boolean(initialData);
  const [isPending, startTransition] = useTransition();

  const {
    register,
    handleSubmit,
    reset,
    setError,
    formState: { errors },
  } = useForm<CreateStudentInput>({
    defaultValues: {
      nis: "",
      fullName: "",
      classId: "",
      status: "ACTIVE",
    },
  });

  useEffect(() => {
    if (open) {
      reset({
        nis: initialData?.nis ?? "",
        fullName: initialData?.fullName ?? "",
        classId: initialData?.classId ?? "",
        status: initialData?.status ?? "ACTIVE",
      });
    }
  }, [open, initialData, reset]);

  if (!open) return null;

  const activeClasses = classOptions.filter(
    (cls) => cls.isActive || cls.id === initialData?.classId
  );

  const onSubmit = (values: CreateStudentInput) => {
    const payload = {
      ...values,
      classId: values.classId ? values.classId : null,
    };

    const parsed = createStudentSchema.safeParse(payload);
    if (!parsed.success) {
      const fieldErrors = parsed.error.flatten().fieldErrors;
      if (fieldErrors.nis?.[0]) {
        setError("nis", { message: fieldErrors.nis[0] });
      }
      if (fieldErrors.fullName?.[0]) {
        setError("fullName", { message: fieldErrors.fullName[0] });
      }
      if (fieldErrors.classId?.[0]) {
        setError("classId", { message: fieldErrors.classId[0] });
      }
      return;
    }

    startTransition(async () => {
      const result =
        isEdit && initialData
          ? await updateStudentAction({ id: initialData.id, ...parsed.data })
          : await createStudentAction(parsed.data);

      if (!result.success) {
        if (result.errors?.nis?.[0]) {
          setError("nis", { message: result.errors.nis[0] });
        }
        if (result.errors?.fullName?.[0]) {
          setError("fullName", { message: result.errors.fullName[0] });
        }
        toast.error(result.message);
        return;
      }

      toast.success(result.message);
      onOpenChange(false);
      onSuccess?.();
    });
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4 backdrop-blur-xs">
      <div className="w-full max-w-lg rounded-xl border border-slate-200 bg-white p-6 shadow-xl dark:border-slate-800 dark:bg-slate-900">
        {/* Header */}
        <div className="mb-5 flex items-start justify-between gap-3">
          <div className="flex items-start gap-3">
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-emerald-100 text-emerald-700 dark:bg-emerald-500/15 dark:text-emerald-400">
              {isEdit ? (
                <PencilLine className="h-5 w-5" />
              ) : (
                <UserPlus className="h-5 w-5" />
              )}
            </div>
            <div>
              <h2 className="text-lg font-semibold text-slate-900 dark:text-white">
                {isEdit ? "Edit Data Anggota Siswa" : "Tambah Anggota Siswa Baru"}
              </h2>
              <p className="text-sm text-slate-500 dark:text-slate-400">
                {isEdit && initialData
                  ? `Perbarui informasi siswa NIS: ${initialData.nis} (${initialData.fullName})`
                  : "Registrasi keanggotaan perpustakaan siswa MI & MTs."}
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={() => onOpenChange(false)}
            disabled={isPending}
            className="rounded-lg p-1.5 text-slate-400 hover:bg-slate-100 hover:text-slate-600 dark:hover:bg-slate-800 dark:hover:text-slate-200"
            aria-label="Tutup dialog"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div>
            <label
              htmlFor="student-nis"
              className="mb-1.5 block text-sm font-medium text-slate-700 dark:text-slate-200"
            >
              NIS (Nomor Induk Siswa) <span className="text-red-500">*</span>
            </label>
            <input
              id="student-nis"
              type="text"
              placeholder="Contoh: 202407001"
              disabled={isPending}
              {...register("nis")}
              className="w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm text-slate-900 outline-none focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20 dark:border-slate-700 dark:bg-slate-950 dark:text-white"
            />
            {errors.nis ? (
              <p className="mt-1 text-xs text-red-500">{errors.nis.message}</p>
            ) : (
              <p className="mt-1 text-xs text-slate-500 dark:text-slate-400">
                NIS bersifat unik dan juga digunakan untuk pemindaian barcode siswa.
              </p>
            )}
          </div>

          <div>
            <label
              htmlFor="student-fullname"
              className="mb-1.5 block text-sm font-medium text-slate-700 dark:text-slate-200"
            >
              Nama Lengkap Siswa <span className="text-red-500">*</span>
            </label>
            <input
              id="student-fullname"
              type="text"
              placeholder="Contoh: Ahmad Fauzan"
              disabled={isPending}
              {...register("fullName")}
              className="w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm text-slate-900 outline-none focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20 dark:border-slate-700 dark:bg-slate-950 dark:text-white"
            />
            {errors.fullName && (
              <p className="mt-1 text-xs text-red-500">
                {errors.fullName.message}
              </p>
            )}
          </div>

          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <div>
              <label
                htmlFor="student-class"
                className="mb-1.5 block text-sm font-medium text-slate-700 dark:text-slate-200"
              >
                Kelas &amp; Rombel
              </label>
              <select
                id="student-class"
                disabled={isPending}
                {...register("classId")}
                className="w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm text-slate-900 outline-none focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20 dark:border-slate-700 dark:bg-slate-950 dark:text-white"
              >
                <option value="">-- Tanpa Kelas --</option>
                {activeClasses.map((cls) => (
                  <option key={cls.id} value={cls.id}>
                    {cls.name} ({cls.academicYear})
                    {!cls.isActive ? " - Nonaktif" : ""}
                  </option>
                ))}
              </select>
              {errors.classId && (
                <p className="mt-1 text-xs text-red-500">
                  {errors.classId.message}
                </p>
              )}
            </div>

            <div>
              <label
                htmlFor="student-status"
                className="mb-1.5 block text-sm font-medium text-slate-700 dark:text-slate-200"
              >
                Status Keanggotaan <span className="text-red-500">*</span>
              </label>
              <select
                id="student-status"
                disabled={isPending}
                {...register("status")}
                className="w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm text-slate-900 outline-none focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20 dark:border-slate-700 dark:bg-slate-950 dark:text-white"
              >
                <option value="ACTIVE">Aktif (Dapat Meminjam)</option>
                <option value="INACTIVE">Nonaktif (Akses Diblokir)</option>
              </select>
            </div>
          </div>

          {/* Info Kuota Pinjam (Read-only dari System Settings) */}
          <div className="flex items-start gap-2.5 rounded-lg border border-emerald-200 bg-emerald-50/70 p-3 text-xs text-emerald-800 dark:border-emerald-500/20 dark:bg-emerald-500/10 dark:text-emerald-300">
            <Info className="mt-0.5 h-4 w-4 shrink-0" />
            <div>
              <span className="font-semibold">Kebijakan Sirkulasi Standar:</span>{" "}
              Maksimal <strong>{maxActiveLoans} buku</strong> per siswa dengan
              durasi peminjaman <strong>{defaultLoanDays} hari</strong> (diatur
              melalui Sistem Manajemen).
            </div>
          </div>

          <div className="flex justify-end gap-2 pt-2">
            <button
              type="button"
              onClick={() => onOpenChange(false)}
              disabled={isPending}
              className="rounded-lg border border-slate-300 px-4 py-2 text-sm font-medium text-slate-700 hover:bg-slate-50 disabled:opacity-50 dark:border-slate-700 dark:text-slate-300 dark:hover:bg-slate-800"
            >
              Batal
            </button>
            <button
              type="submit"
              disabled={isPending}
              className="rounded-lg bg-emerald-600 px-4 py-2 text-sm font-medium text-white hover:bg-emerald-700 disabled:opacity-50"
            >
              {isPending
                ? "Menyimpan..."
                : isEdit
                ? "Simpan Perubahan"
                : "Simpan & Daftarkan Siswa"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}