"use server";

import { revalidatePath } from "next/cache";
import {
  classFilterSchema,
  createClassSchema,
  updateClassSchema,
  type CreateClassInput,
  type UpdateClassInput,
} from "../schemas/class.schema";
import {
  createClass,
  deleteClass,
  getAcademicYears,
  getClasses,
  toggleClassStatus,
  updateClass,
} from "../services/class.service";
import type {
  ClassActionResult,
  ClassFilterParams,
  ClassItem,
  ClassListResponse,
} from "../types/class.types";

const CLASSES_PATH = "/dashboard/classes";

export async function getClassesAction(
  filters: ClassFilterParams = {}
): Promise<ClassActionResult<ClassListResponse>> {
  try {
    const parsed = classFilterSchema.safeParse(filters);
    const validFilters = parsed.success ? parsed.data : {};
    const result = await getClasses(validFilters);

    return {
      success: true,
      message: "Data kelas berhasil dimuat.",
      data: result,
    };
  } catch (error) {
    return {
      success: false,
      message:
        error instanceof Error ? error.message : "Gagal memuat data kelas.",
    };
  }
}

export async function getAcademicYearsAction(): Promise<string[]> {
  try {
    return await getAcademicYears();
  } catch {
    return [];
  }
}

export async function createClassAction(
  input: CreateClassInput
): Promise<ClassActionResult<ClassItem>> {
  const parsed = createClassSchema.safeParse(input);
  if (!parsed.success) {
    return {
      success: false,
      message: "Periksa kembali data yang dimasukkan.",
      errors: parsed.error.flatten().fieldErrors,
    };
  }

  try {
    // TODO: Tambahkan cek sesi/role (ADMIN / PETUGAS) dari helper auth di src/lib/auth
    const created = await createClass(parsed.data);
    revalidatePath(CLASSES_PATH);

    return {
      success: true,
      message: `Kelas "${created.name}" berhasil ditambahkan.`,
      data: created,
    };
  } catch (error) {
    return {
      success: false,
      message:
        error instanceof Error ? error.message : "Gagal menambahkan kelas.",
    };
  }
}

export async function updateClassAction(
  input: UpdateClassInput
): Promise<ClassActionResult<ClassItem>> {
  const parsed = updateClassSchema.safeParse(input);
  if (!parsed.success) {
    return {
      success: false,
      message: "Periksa kembali data yang dimasukkan.",
      errors: parsed.error.flatten().fieldErrors,
    };
  }

  try {
    // TODO: Tambahkan cek sesi/role (ADMIN / PETUGAS) dari helper auth di src/lib/auth
    const updated = await updateClass(parsed.data);
    revalidatePath(CLASSES_PATH);

    return {
      success: true,
      message: `Kelas "${updated.name}" berhasil diperbarui.`,
      data: updated,
    };
  } catch (error) {
    return {
      success: false,
      message:
        error instanceof Error ? error.message : "Gagal memperbarui kelas.",
    };
  }
}

export async function toggleClassStatusAction(
  id: string
): Promise<ClassActionResult<ClassItem>> {
  try {
    // TODO: Tambahkan cek sesi/role (ADMIN / PETUGAS) dari helper auth di src/lib/auth
    const updated = await toggleClassStatus(id);
    revalidatePath(CLASSES_PATH);

    return {
      success: true,
      message: `Kelas "${updated.name}" sekarang berstatus ${
        updated.isActive ? "Aktif" : "Nonaktif"
      }.`,
      data: updated,
    };
  } catch (error) {
    return {
      success: false,
      message:
        error instanceof Error ? error.message : "Gagal mengubah status kelas.",
    };
  }
}

export async function deleteClassAction(
  id: string
): Promise<ClassActionResult<null>> {
  try {
    // TODO: Tambahkan cek sesi/role (ADMIN / PETUGAS) dari helper auth di src/lib/auth
    await deleteClass(id);
    revalidatePath(CLASSES_PATH);

    return {
      success: true,
      message: "Kelas berhasil dihapus.",
      data: null,
    };
  } catch (error) {
    return {
      success: false,
      message:
        error instanceof Error ? error.message : "Gagal menghapus kelas.",
    };
  }
}