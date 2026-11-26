import { ClassPageClient } from "@/features/classes/components/class-page-client";
import {
  getAcademicYears,
  getClasses,
} from "@/features/classes/services/class.service";

export const dynamic = "force-dynamic";

export const metadata = {
  title: "Manajemen Kelas | SIPUS Ar-Rasyid",
  description: "Kelola data rombel kelas dan tahun ajaran perpustakaan.",
};

export default async function ClassesPage() {
  const [{ data: initialClasses }, initialAcademicYears] = await Promise.all([
    getClasses(),
    getAcademicYears(),
  ]);

  return (
    <main className="p-4 sm:p-6">
      <ClassPageClient
        initialClasses={initialClasses}
        initialAcademicYears={initialAcademicYears}
      />
    </main>
  );
}