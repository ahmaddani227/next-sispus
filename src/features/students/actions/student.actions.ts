"use server";

import { revalidatePath } from "next/cache";
import {
  createStudentSchema,
  studentFilterSchema,
  updateStudentSchema,
  type CreateStudentInput,
  type StudentImportRowInput,
  type StudentStatusType,
  type UpdateStudentInput,
} from "../schemas/student.schema";
import {
  commitStudentImport,
  createStudent,
  getStudentById,
  getStudentByNis,
  getStudentClassOptions,
  getStudents,
  toggleStudentStatus,
  updateStudent,
  validateStudentImportRows,
} from "../services/student.service";
import type {
  StudentActionResult,
  StudentClassOption,
  StudentDetailItem,
  StudentFilterParams,
  StudentImportPreviewRow,
  StudentImportResult,
  StudentListResponse,
} from "../types/student.types";

const STUDENTS_PATH = "/dashboard/students";
const CLASSES_PATH = "/dashboard/classes";

interface MutatedStudentPayload {
  id: string;
  nis: string;
  fullName: string;
  classId: string | null;
  status: StudentStatusType;
}

export async function getStudentsAction(
  filters: StudentFilterParams = {}
): Promise<StudentActionResult<StudentListResponse>> {
  try {
    const parsed = studentFilterSchema.safeParse(filters);
    const validFilters = parsed.success ? parsed.data : {};
    const result = await getStudents(validFilters);

    return {
      success: true,
      message: "Data siswa berhasil dimuat.",
      data: result,
    };
  } catch (error) {
    return {
      success: false,
      message:
        error instanceof Error ? error.message : "Gagal memuat data siswa.",
    };
  }
}

export async function getStudentClassOptionsAction(): Promise<
  StudentClassOption[]
> {
  try {
    return await getStudentClassOptions();
  } catch {
    return [];
  }
}

export async function getStudentDetailAction(
  id: string
): Promise<StudentActionResult<StudentDetailItem>> {
  try {
    const student = await getStudentById(id);
    if (!student) {
      return {
        success: false,
        message: "Data siswa tidak ditemukan.",
      };
    }

    return {
      success: true,
      message: "Detail siswa berhasil dimuat.",
      data: student,
    };
  } catch (error) {
    return {
      success: false,
      message:
        error instanceof Error ? error.message : "Gagal memuat detail siswa.",
    };
  }
}

export async function findStudentByNisAction(
  nis: string
): Promise<StudentActionResult<StudentDetailItem>> {
  const trimmed = nis.trim();
  if (!trimmed) {
    return {
      success: false,
      message: "Masukkan atau scan NIS terlebih dahulu.",
    };
  }

  try {
    const student = await getStudentByNis(trimmed);
    if (!student) {
      return {
        success: false,
        message: `Siswa dengan NIS "${trimmed}" tidak ditemukan.`,
      };
    }

    return {
      success: true,
      message: `Siswa "${student.fullName}" ditemukan.`,
      data: student,
    };
  } catch (error) {
    return {
      success: false,
      message:
        error instanceof Error ? error.message : "Gagal mencari NIS siswa.",
    };
  }
}

export async function createStudentAction(
  input: CreateStudentInput
): Promise<StudentActionResult<MutatedStudentPayload>> {
  const parsed = createStudentSchema.safeParse(input);
  if (!parsed.success) {
    return {
      success: false,
      message: "Periksa kembali data siswa yang dimasukkan.",
      errors: parsed.error.flatten().fieldErrors,
    };
  }

  try {
    // TODO: Tambahkan cek sesi/role (ADMIN / PETUGAS) dari helper auth di src/lib/auth
    const created = await createStudent(parsed.data);
    revalidatePath(STUDENTS_PATH);
    revalidatePath(CLASSES_PATH);

    return {
      success: true,
      message: `Siswa "${created.fullName}" berhasil didaftarkan.`,
      data: {
        id: created.id,
        nis: created.nis,
        fullName: created.fullName,
        classId: created.classId,
        status: created.status,
      },
    };
  } catch (error) {
    return {
      success: false,
      message:
        error instanceof Error ? error.message : "Gagal mendaftarkan siswa.",
    };
  }
}

export async function updateStudentAction(
  input: UpdateStudentInput
): Promise<StudentActionResult<MutatedStudentPayload>> {
  const parsed = updateStudentSchema.safeParse(input);
  if (!parsed.success) {
    return {
      success: false,
      message: "Periksa kembali data siswa yang dimasukkan.",
      errors: parsed.error.flatten().fieldErrors,
    };
  }

  try {
    // TODO: Tambahkan cek sesi/role (ADMIN / PETUGAS) dari helper auth di src/lib/auth
    const updated = await updateStudent(parsed.data);
    revalidatePath(STUDENTS_PATH);
    revalidatePath(CLASSES_PATH);

    return {
      success: true,
      message: `Data siswa "${updated.fullName}" berhasil diperbarui.`,
      data: {
        id: updated.id,
        nis: updated.nis,
        fullName: updated.fullName,
        classId: updated.classId,
        status: updated.status,
      },
    };
  } catch (error) {
    return {
      success: false,
      message:
        error instanceof Error ? error.message : "Gagal memperbarui data siswa.",
    };
  }
}

export async function toggleStudentStatusAction(
  id: string
): Promise<StudentActionResult<MutatedStudentPayload>> {
  try {
    // TODO: Tambahkan cek sesi/role (ADMIN / PETUGAS) dari helper auth di src/lib/auth
    const updated = await toggleStudentStatus(id);
    revalidatePath(STUDENTS_PATH);

    return {
      success: true,
      message: `Status siswa "${updated.fullName}" diubah menjadi ${
        updated.status === "ACTIVE" ? "Aktif" : "Nonaktif"
      }.`,
      data: {
        id: updated.id,
        nis: updated.nis,
        fullName: updated.fullName,
        classId: updated.classId,
        status: updated.status,
      },
    };
  } catch (error) {
    return {
      success: false,
      message:
        error instanceof Error
          ? error.message
          : "Gagal mengubah status keanggotaan siswa.",
    };
  }
}

export async function validateStudentImportAction(
  rows: StudentImportRowInput[]
): Promise<StudentActionResult<StudentImportPreviewRow[]>> {
  if (!Array.isArray(rows) || rows.length === 0) {
    return {
      success: false,
      message: "File tidak berisi baris data siswa.",
    };
  }

  try {
    // TODO: Tambahkan cek sesi/role (ADMIN / PETUGAS) dari helper auth di src/lib/auth
    const preview = await validateStudentImportRows(rows);
    const validCount = preview.filter((r) => r.isValid).length;

    return {
      success: true,
      message: `Validasi selesai: ${validCount} dari ${preview.length} baris valid.`,
      data: preview,
    };
  } catch (error) {
    return {
      success: false,
      message:
        error instanceof Error
          ? error.message
          : "Gagal memvalidasi data import.",
    };
  }
}

export async function commitStudentImportAction(
  rows: StudentImportPreviewRow[]
): Promise<StudentActionResult<StudentImportResult>> {
  try {
    // TODO: Tambahkan cek sesi/role (ADMIN / PETUGAS) dari helper auth di src/lib/auth
    const result = await commitStudentImport(rows);
    revalidatePath(STUDENTS_PATH);
    revalidatePath(CLASSES_PATH);

    return {
      success: true,
      message: `${result.insertedCount} siswa berhasil diimpor${
        result.skippedCount > 0
          ? `, ${result.skippedCount} baris dilewati`
          : ""
      }.`,
      data: result,
    };
  } catch (error) {
    return {
      success: false,
      message:
        error instanceof Error ? error.message : "Gagal menyimpan data import.",
    };
  }
}