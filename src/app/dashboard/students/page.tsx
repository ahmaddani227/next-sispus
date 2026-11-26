import type { Metadata } from "next";
import { StudentPageClient } from "@/features/students/components/student-page-client";
import {
  getStudentClassOptions,
  getStudents,
} from "@/features/students/services/student.service";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Manajemen Siswa | SIMPUS Digital",
  description:
    "Kelola data keanggotaan siswa, impor data Excel/CSV, pemindai NIS, dan status sirkulasi perpustakaan.",
};

export default async function StudentsPage() {
  const [initialData, initialClassOptions] = await Promise.all([
    getStudents({ page: 1, pageSize: 10 }),
    getStudentClassOptions(),
  ]);

  return (
    <StudentPageClient
      initialData={initialData}
      initialClassOptions={initialClassOptions}
    />
  );
}