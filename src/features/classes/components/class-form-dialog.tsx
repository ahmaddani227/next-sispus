"use client";

import { useEffect, useTransition } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { X } from "lucide-react";
import {
  createClassAction,
  updateClassAction,
} from "../actions/class.actions";
import {
  createClassSchema,
  type CreateClassInput,
} from "../schemas/class.schema";
import type { ClassItem } from "../types/class.types";

interface ClassFormDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  initialData?: ClassItem | null;
  onSuccess?: () => void;
}

export function ClassFormDialog({
  open,
  onOpenChange,
  initialData,
  onSuccess,
}: ClassFormDialogProps) {
  const isEdit = Boolean(initialData);
  const [isPending, startTransition] = useTransition();

  const {
    register,
    handleSubmit,
    reset,
    setError,
    formState: { errors },
  } = useForm<CreateClassInput>({
    defaultValues: {
      name: "",
      academicYear: "2026/2027",
      isActive: true,
    },
  });

  useEffect(() => {
    if (open) {
      reset({
        name: initialData?.name ?? "",
        academicYear: initialData?.academicYear ?? "2026/2027",
        isActive: initialData?.isActive ?? true,
      });
    }
  }, [open, initialData, reset]);

  if (!open) return null;

  const onSubmit = (values: CreateClassInput) => {
    const parsed = createClassSchema.safeParse(values);
    if (!parsed.success) {
      const fieldErrors = parsed.error.flatten().fieldErrors;
      if (fieldErrors.name?.[0]) {
        setError("name", { message: fieldErrors.name[0] });
      }
      if (fieldErrors.academicYear?.[0]) {
        setError("academicYear", { message: fieldErrors.academicYear[0] });
      }
      return;
    }

    startTransition(async () => {
      const result = isEdit && initialData
        ? await updateClassAction({ id: initialData.id, ...parsed.data })
        : await createClassAction(parsed.data);

      if (!result.success) {
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
      <div className="w-full max-w-md rounded-xl border border-slate-200 bg-white p-6 shadow-xl dark:border-slate-800 dark:bg-slate-900">
        <div className="mb-5 flex items-center justify-between">
          <div>
            <h2 className="text-lg font-semibold text-slate-900 dark:text-white">
              {isEdit ? "Edit Data Kelas" : "Tambah Kelas Baru"}
            </h2>
            <p className="text-sm text-slate-500 dark:text-slate-400">
              {isEdit
                ? "Perbarui informasi rombel kelas."
                : "Tambahkan rombel kelas baru untuk MI / MTs."}
            </p>
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

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div>
            <label
              htmlFor="class-name"
              className="mb-1.5 block text-sm font-medium text-slate-700 dark:text-slate-200"
            >
              Nama Kelas <span className="text-red-500">*</span>
            </label>
            <input
              id="class-name"
              type="text"
              placeholder="Contoh: 7A, 8B, atau 1 MI"
              disabled={isPending}
              {...register("name")}
              className="w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm text-slate-900 outline-none focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20 dark:border-slate-700 dark:bg-slate-950 dark:text-white"
            />
            {errors.name && (
              <p className="mt-1 text-xs text-red-500">{errors.name.message}</p>
            )}
          </div>

          <div>
            <label
              htmlFor="academic-year"
              className="mb-1.5 block text-sm font-medium text-slate-700 dark:text-slate-200"
            >
              Tahun Ajaran <span className="text-red-500">*</span>
            </label>
            <input
              id="academic-year"
              type="text"
              placeholder="Contoh: 2026/2027"
              disabled={isPending}
              {...register("academicYear")}
              className="w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm text-slate-900 outline-none focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20 dark:border-slate-700 dark:bg-slate-950 dark:text-white"
            />
            {errors.academicYear && (
              <p className="mt-1 text-xs text-red-500">
                {errors.academicYear.message}
              </p>
            )}
          </div>

          <div className="flex items-center gap-2.5 pt-1">
            <input
              id="is-active"
              type="checkbox"
              disabled={isPending}
              {...register("isActive")}
              className="h-4 w-4 rounded border-slate-300 text-emerald-600 focus:ring-emerald-500 dark:border-slate-700 dark:bg-slate-950"
            />
            <label
              htmlFor="is-active"
              className="text-sm text-slate-700 dark:text-slate-300"
            >
              Kelas berstatus aktif
            </label>
          </div>

          <div className="flex justify-end gap-2 pt-3">
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
                : "Tambah Kelas"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}