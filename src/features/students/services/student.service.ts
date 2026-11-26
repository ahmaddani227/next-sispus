import { prisma } from "@/lib/prisma";
import { compareClassItems } from "@/features/classes/utils/sort-classes";
import {
  studentImportRowSchema,
  type CreateStudentInput,
  type StudentImportRowInput,
  type UpdateStudentInput,
} from "../schemas/student.schema";
import type {
  StudentActiveLoanItem,
  StudentClassOption,
  StudentDetailItem,
  StudentFilterParams,
  StudentImportPreviewRow,
  StudentImportResult,
  StudentItem,
  StudentListResponse,
  StudentLoanHistoryItem,
  StudentStats,
} from "../types/student.types";

const DEFAULT_MAX_ACTIVE_LOANS = 2;
const DEFAULT_LOAN_DAYS = 7;

function getStartOfToday(): Date {
  const now = new Date();
  return new Date(now.getFullYear(), now.getMonth(), now.getDate());
}

function isSameCalendarDay(a: Date, b: Date) {
  return (
    a.getFullYear() === b.getFullYear() &&
    a.getMonth() === b.getMonth() &&
    a.getDate() === b.getDate()
  );
}

export async function getLibraryLoanConfig() {
  try {
    const settings = await prisma.systemSetting.findMany({
      where: {
        settingKey: {
          in: [
            "max_active_loans",
            "max_books_per_student",
            "default_loan_days",
            "loan_duration_days",
          ],
        },
      },
    });

    const map = new Map(settings.map((s) => [s.settingKey, s.value]));

    const rawMaxLoans =
      map.get("max_active_loans") ?? map.get("max_books_per_student");
    const rawLoanDays =
      map.get("default_loan_days") ?? map.get("loan_duration_days");

    const parsedMaxLoans = rawMaxLoans ? Number.parseInt(rawMaxLoans, 10) : NaN;
    const parsedLoanDays = rawLoanDays ? Number.parseInt(rawLoanDays, 10) : NaN;

    return {
      maxActiveLoans:
        Number.isFinite(parsedMaxLoans) && parsedMaxLoans > 0
          ? parsedMaxLoans
          : DEFAULT_MAX_ACTIVE_LOANS,
      defaultLoanDays:
        Number.isFinite(parsedLoanDays) && parsedLoanDays > 0
          ? parsedLoanDays
          : DEFAULT_LOAN_DAYS,
    };
  } catch {
    return {
      maxActiveLoans: DEFAULT_MAX_ACTIVE_LOANS,
      defaultLoanDays: DEFAULT_LOAN_DAYS,
    };
  }
}

export async function getStudentClassOptions(): Promise<StudentClassOption[]> {
  const classes = await prisma.class.findMany({
    select: {
      id: true,
      name: true,
      academicYear: true,
      isActive: true,
    },
  });

  return [...classes].sort(compareClassItems);
}

export async function getStudentStats(): Promise<StudentStats> {
  const today = getStartOfToday();

  const [
    totalStudents,
    activeStudents,
    borrowingStudents,
    inactiveOrSanctionedStudents,
  ] = await Promise.all([
    prisma.student.count(),
    prisma.student.count({ where: { status: "ACTIVE" } }),
    prisma.student.count({
      where: {
        loanTransactions: {
          some: {
            details: {
              some: { status: "BORROWED" },
            },
          },
        },
      },
    }),
    prisma.student.count({
      where: {
        OR: [
          { status: "INACTIVE" },
          {
            sanctions: {
              some: {
                status: "ACTIVE",
                endDate: { gte: today },
              },
            },
          },
        ],
      },
    }),
  ]);

  return {
    totalStudents,
    activeStudents,
    borrowingStudents,
    inactiveOrSanctionedStudents,
  };
}

export async function getStudents(
  filters: StudentFilterParams = {}
): Promise<StudentListResponse> {
  const {
    search = "",
    classId = "all",
    status = "all",
    loanStatus = "all",
    page = 1,
    pageSize = 10,
  } = filters;

  const today = getStartOfToday();
  const whereConditions: Record<string, unknown>[] = [];

  if (search.trim() !== "") {
    whereConditions.push({
      OR: [
        { nis: { contains: search.trim(), mode: "insensitive" } },
        { fullName: { contains: search.trim(), mode: "insensitive" } },
      ],
    });
  }

  if (classId && classId !== "all") {
    if (classId === "none") {
      whereConditions.push({ classId: null });
    } else {
      whereConditions.push({ classId });
    }
  }

  if (status === "ACTIVE" || status === "INACTIVE") {
    whereConditions.push({ status });
  }

  if (loanStatus === "BORROWING") {
    whereConditions.push({
      loanTransactions: {
        some: {
          details: {
            some: { status: "BORROWED" },
          },
        },
      },
    });
  } else if (loanStatus === "FREE") {
    whereConditions.push({
      status: "ACTIVE",
      loanTransactions: {
        none: {
          details: {
            some: { status: "BORROWED" },
          },
        },
      },
      sanctions: {
        none: {
          status: "ACTIVE",
          endDate: { gte: today },
        },
      },
      replacementObligations: {
        none: {
          status: "PENDING",
        },
      },
    });
  } else if (loanStatus === "BLOCKED") {
    whereConditions.push({
      OR: [
        { status: "INACTIVE" },
        {
          sanctions: {
            some: {
              status: "ACTIVE",
              endDate: { gte: today },
            },
          },
        },
        {
          replacementObligations: {
            some: {
              status: "PENDING",
            },
          },
        },
      ],
    });
  }

  const where = whereConditions.length > 0 ? { AND: whereConditions } : {};
  const skip = (page - 1) * pageSize;

  const [rows, total, stats, config] = await Promise.all([
    prisma.student.findMany({
      where,
      skip,
      take: pageSize,
      orderBy: [{ createdAt: "desc" }, { fullName: "asc" }],
      include: {
        class: {
          select: {
            id: true,
            name: true,
            academicYear: true,
          },
        },
        loanTransactions: {
          where: {
            details: {
              some: { status: "BORROWED" },
            },
          },
          include: {
            details: {
              where: { status: "BORROWED" },
              include: {
                bookCopy: {
                  include: {
                    book: {
                      select: { title: true },
                    },
                  },
                },
              },
            },
          },
        },
        sanctions: {
          where: {
            status: "ACTIVE",
            endDate: { gte: today },
          },
          orderBy: { endDate: "desc" },
          take: 1,
        },
        replacementObligations: {
          where: { status: "PENDING" },
          select: { id: true },
        },
      },
    }),
    prisma.student.count({ where }),
    getStudentStats(),
    getLibraryLoanConfig(),
  ]);

  const data: StudentItem[] = rows.map((row) => {
    const activeDetails = row.loanTransactions.flatMap((tx) =>
      tx.details.map((d) => ({
        title: d.bookCopy.book.title,
        dueDate: d.dueDate,
      }))
    );

    const sortedDueDates = activeDetails
      .map((d) => new Date(d.dueDate))
      .sort((a, b) => a.getTime() - b.getTime());

    const activeSanction = row.sanctions[0] ?? null;

    return {
      id: row.id,
      nis: row.nis,
      fullName: row.fullName,
      classId: row.classId,
      status: row.status,
      createdAt: row.createdAt,
      updatedAt: row.updatedAt,
      studentClass: row.class,
      activeLoansCount: activeDetails.length,
      activeLoanTitles: activeDetails.map((d) => d.title),
      nearestDueDate: sortedDueDates[0] ?? null,
      hasActiveSanction: Boolean(activeSanction),
      activeSanctionEndDate: activeSanction?.endDate ?? null,
      pendingObligationsCount: row.replacementObligations.length,
    };
  });

  return {
    data,
    total,
    page,
    pageSize,
    totalPages: Math.max(1, Math.ceil(total / pageSize)),
    stats,
    maxActiveLoans: config.maxActiveLoans,
    defaultLoanDays: config.defaultLoanDays,
  };
}

async function buildStudentDetail(
  where: { id: string } | { nis: string }
): Promise<StudentDetailItem | null> {
  const today = getStartOfToday();

  const [row, config] = await Promise.all([
    prisma.student.findUnique({
      where,
      include: {
        class: {
          select: {
            id: true,
            name: true,
            academicYear: true,
          },
        },
        loanTransactions: {
          orderBy: { loanDate: "desc" },
          include: {
            details: {
              include: {
                bookCopy: {
                  include: {
                    book: {
                      select: { title: true },
                    },
                  },
                },
              },
            },
          },
        },
        sanctions: {
          where: {
            status: "ACTIVE",
            endDate: { gte: today },
          },
          orderBy: { endDate: "desc" },
          take: 1,
        },
        replacementObligations: {
          where: { status: "PENDING" },
          select: { id: true },
        },
      },
    }),
    getLibraryLoanConfig(),
  ]);

  if (!row) return null;

  const activeLoans: StudentActiveLoanItem[] = [];
  const completedLoans: StudentLoanHistoryItem[] = [];

  for (const tx of row.loanTransactions) {
    for (const detail of tx.details) {
      const dueDate = new Date(detail.dueDate);
      const dueDay = new Date(
        dueDate.getFullYear(),
        dueDate.getMonth(),
        dueDate.getDate()
      );

      if (detail.status === "BORROWED") {
        activeLoans.push({
          detailId: detail.id,
          bookTitle: detail.bookCopy.book.title,
          copyCode: detail.bookCopy.copyCode,
          loanDate: tx.loanDate,
          dueDate: detail.dueDate,
          isOverdue: today > dueDay,
          isDueToday: isSameCalendarDay(today, dueDay),
        });
      } else {
        completedLoans.push({
          detailId: detail.id,
          bookTitle: detail.bookCopy.book.title,
          copyCode: detail.bookCopy.copyCode,
          loanDate: tx.loanDate,
          returnedAt: detail.returnedAt,
          status: detail.status,
          lateDays: detail.lateDays,
        });
      }
    }
  }

  const totalCompletedLoans = completedLoans.length;
  const onTimeCount = completedLoans.filter(
    (item) => item.status === "RETURNED" && item.lateDays === 0
  ).length;
  const onTimeRate =
    totalCompletedLoans > 0
      ? Math.round((onTimeCount / totalCompletedLoans) * 100)
      : null;

  const sortedDueDates = activeLoans
    .map((l) => new Date(l.dueDate))
    .sort((a, b) => a.getTime() - b.getTime());

  const activeSanction = row.sanctions[0] ?? null;

  return {
    id: row.id,
    nis: row.nis,
    fullName: row.fullName,
    classId: row.classId,
    status: row.status,
    createdAt: row.createdAt,
    updatedAt: row.updatedAt,
    studentClass: row.class,
    activeLoansCount: activeLoans.length,
    activeLoanTitles: activeLoans.map((l) => l.bookTitle),
    nearestDueDate: sortedDueDates[0] ?? null,
    hasActiveSanction: Boolean(activeSanction),
    activeSanctionEndDate: activeSanction?.endDate ?? null,
    pendingObligationsCount: row.replacementObligations.length,
    maxActiveLoans: config.maxActiveLoans,
    defaultLoanDays: config.defaultLoanDays,
    onTimeRate,
    totalCompletedLoans,
    activeLoans,
    recentLoans: completedLoans.slice(0, 3),
  };
}

export async function getStudentById(id: string) {
  return buildStudentDetail({ id });
}

export async function getStudentByNis(nis: string) {
  return buildStudentDetail({ nis: nis.trim() });
}

export async function createStudent(input: CreateStudentInput) {
  const existing = await prisma.student.findUnique({
    where: { nis: input.nis },
  });

  if (existing) {
    throw new Error(`Siswa dengan NIS "${input.nis}" sudah terdaftar.`);
  }

  if (input.classId) {
    const classExists = await prisma.class.findUnique({
      where: { id: input.classId },
      select: { id: true },
    });
    if (!classExists) {
      throw new Error("Kelas yang dipilih tidak ditemukan.");
    }
  }

  return prisma.student.create({
    data: {
      nis: input.nis,
      fullName: input.fullName,
      classId: input.classId ?? null,
      status: input.status ?? "ACTIVE",
    },
  });
}

export async function updateStudent(input: UpdateStudentInput) {
  const { id, nis, fullName, classId, status } = input;

  const current = await prisma.student.findUnique({ where: { id } });
  if (!current) {
    throw new Error("Data siswa tidak ditemukan.");
  }

  if (nis && nis !== current.nis) {
    const duplicate = await prisma.student.findUnique({ where: { nis } });
    if (duplicate) {
      throw new Error(`NIS "${nis}" sudah digunakan oleh siswa lain.`);
    }
  }

  if (classId) {
    const classExists = await prisma.class.findUnique({
      where: { id: classId },
      select: { id: true },
    });
    if (!classExists) {
      throw new Error("Kelas yang dipilih tidak ditemukan.");
    }
  }

  return prisma.student.update({
    where: { id },
    data: {
      ...(nis !== undefined && { nis }),
      ...(fullName !== undefined && { fullName }),
      ...(classId !== undefined && { classId }),
      ...(status !== undefined && { status }),
    },
  });
}

export async function toggleStudentStatus(id: string) {
  const current = await prisma.student.findUnique({ where: { id } });
  if (!current) {
    throw new Error("Data siswa tidak ditemukan.");
  }

  const nextStatus = current.status === "ACTIVE" ? "INACTIVE" : "ACTIVE";

  return prisma.student.update({
    where: { id },
    data: { status: nextStatus },
  });
}

export async function validateStudentImportRows(
  rows: StudentImportRowInput[]
): Promise<StudentImportPreviewRow[]> {
  const [existingStudents, allClasses] = await Promise.all([
    prisma.student.findMany({ select: { nis: true } }),
    prisma.class.findMany({
      select: { id: true, name: true, academicYear: true, isActive: true },
      orderBy: [{ isActive: "desc" }, { academicYear: "desc" }],
    }),
  ]);

  const existingNisSet = new Set(
    existingStudents.map((s) => s.nis.trim().toLowerCase())
  );

  const classNameMap = new Map<string, string>();
  for (const cls of allClasses) {
    const key = cls.name.trim().toLowerCase();
    if (!classNameMap.has(key)) {
      classNameMap.set(key, cls.id);
    }
  }

  const seenInFile = new Set<string>();

  return rows.map((raw, index) => {
    const rowNumber = index + 2;
    const errors: string[] = [];
    const warnings: string[] = [];

    const parsed = studentImportRowSchema.safeParse(raw);
    const nis = (raw.nis ?? "").toString().trim();
    const fullName = (raw.fullName ?? "").toString().trim();
    const className = (raw.className ?? "").toString().trim();
    const status = raw.status === "INACTIVE" ? "INACTIVE" : "ACTIVE";

    if (!parsed.success) {
      const flat = parsed.error.flatten().fieldErrors;
      if (flat.nis) errors.push(...flat.nis);
      if (flat.fullName) errors.push(...flat.fullName);
    }

    const normalizedNis = nis.toLowerCase();
    if (normalizedNis) {
      if (seenInFile.has(normalizedNis)) {
        errors.push(`NIS "${nis}" duplikat di dalam file import.`);
      } else {
        seenInFile.add(normalizedNis);
      }

      if (existingNisSet.has(normalizedNis)) {
        errors.push(`NIS "${nis}" sudah terdaftar di database.`);
      }
    }

    let matchedClassId: string | null = null;
    if (className) {
      const foundId = classNameMap.get(className.toLowerCase());
      if (foundId) {
        matchedClassId = foundId;
      } else {
        errors.push(
          `Kelas "${className}" tidak ditemukan di Data Kelas. Tambahkan kelas terlebih dahulu.`
        );
      }
    } else {
      warnings.push("Kolom kelas kosong (siswa akan disimpan tanpa kelas).");
    }

    return {
      rowNumber,
      nis,
      fullName,
      className,
      matchedClassId,
      status,
      isValid: errors.length === 0,
      errors,
      warnings,
    };
  });
}

export async function commitStudentImport(
  rows: StudentImportPreviewRow[]
): Promise<StudentImportResult> {
  const validRows = rows.filter((r) => r.isValid);
  const skippedCount = rows.length - validRows.length;

  if (validRows.length === 0) {
    return { insertedCount: 0, skippedCount };
  }

  const result = await prisma.student.createMany({
    data: validRows.map((row) => ({
      nis: row.nis,
      fullName: row.fullName,
      classId: row.matchedClassId,
      status: row.status,
    })),
    skipDuplicates: true,
  });

  return {
    insertedCount: result.count,
    skippedCount: rows.length - result.count,
  };
}