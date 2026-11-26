import { prisma } from "@/lib/prisma";
import { compareClassItems } from "../utils/sort-classes";
import type {
  CreateClassInput,
  UpdateClassInput,
} from "../schemas/class.schema";
import type { ClassFilterParams } from "../types/class.types";

export async function getClasses(filters: ClassFilterParams = {}) {
  const { search, academicYear, isActive = "all" } = filters;

  const where: Record<string, unknown> = {};

  if (search && search.trim() !== "") {
    where.OR = [
      { name: { contains: search.trim(), mode: "insensitive" } },
      { academicYear: { contains: search.trim(), mode: "insensitive" } },
    ];
  }

  if (academicYear && academicYear !== "all") {
    where.academicYear = academicYear;
  }

  if (isActive === "active") {
    where.isActive = true;
  } else if (isActive === "inactive") {
    where.isActive = false;
  }

  const rawData = await prisma.class.findMany({
    where,
    include: {
      _count: {
        select: { students: true },
      },
    },
  });

  const data = [...rawData].sort(compareClassItems);

  return { data, total: data.length };
}

export async function getClassById(id: string) {
  return prisma.class.findUnique({
    where: { id },
    include: {
      _count: {
        select: { students: true },
      },
    },
  });
}

export async function getAcademicYears() {
  const rows = await prisma.class.findMany({
    select: { academicYear: true },
    distinct: ["academicYear"],
    orderBy: { academicYear: "desc" },
  });

  return rows.map((row) => row.academicYear);
}

export async function createClass(input: CreateClassInput) {
  const existing = await prisma.class.findFirst({
    where: {
      name: { equals: input.name, mode: "insensitive" },
      academicYear: input.academicYear,
    },
  });

  if (existing) {
    throw new Error(
      `Kelas "${input.name}" pada tahun ajaran ${input.academicYear} sudah terdaftar.`
    );
  }

  return prisma.class.create({
    data: {
      name: input.name,
      academicYear: input.academicYear,
      isActive: input.isActive ?? true,
    },
    include: {
      _count: {
        select: { students: true },
      },
    },
  });
}

export async function updateClass(input: UpdateClassInput) {
  const { id, name, academicYear, isActive } = input;

  const current = await prisma.class.findUnique({ where: { id } });
  if (!current) {
    throw new Error("Data kelas tidak ditemukan.");
  }

  const nextName = name ?? current.name;
  const nextYear = academicYear ?? current.academicYear;

  const duplicate = await prisma.class.findFirst({
    where: {
      id: { not: id },
      name: { equals: nextName, mode: "insensitive" },
      academicYear: nextYear,
    },
  });

  if (duplicate) {
    throw new Error(
      `Kelas "${nextName}" pada tahun ajaran ${nextYear} sudah terdaftar.`
    );
  }

  return prisma.class.update({
    where: { id },
    data: {
      ...(name !== undefined && { name }),
      ...(academicYear !== undefined && { academicYear }),
      ...(isActive !== undefined && { isActive }),
    },
    include: {
      _count: {
        select: { students: true },
      },
    },
  });
}

export async function toggleClassStatus(id: string) {
  const current = await prisma.class.findUnique({ where: { id } });
  if (!current) {
    throw new Error("Data kelas tidak ditemukan.");
  }

  return prisma.class.update({
    where: { id },
    data: { isActive: !current.isActive },
    include: {
      _count: {
        select: { students: true },
      },
    },
  });
}

export async function deleteClass(id: string) {
  const current = await prisma.class.findUnique({
    where: { id },
    include: { _count: { select: { students: true } } },
  });

  if (!current) {
    throw new Error("Data kelas tidak ditemukan.");
  }

  if (current._count.students > 0) {
    throw new Error(
      `Kelas masih memiliki ${current._count.students} siswa. Nonaktifkan kelas saja atau pindahkan siswa terlebih dahulu.`
    );
  }

  return prisma.class.delete({ where: { id } });
}