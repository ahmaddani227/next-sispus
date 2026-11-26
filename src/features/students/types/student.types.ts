import type { StudentStatusType } from "../schemas/student.schema";

export interface StudentClassOption {
  id: string;
  name: string;
  academicYear: string;
  isActive: boolean;
}

export interface StudentActiveLoanItem {
  detailId: string;
  bookTitle: string;
  copyCode: string;
  loanDate: Date | string;
  dueDate: Date | string;
  isOverdue: boolean;
  isDueToday: boolean;
}

export interface StudentLoanHistoryItem {
  detailId: string;
  bookTitle: string;
  copyCode: string;
  loanDate: Date | string;
  returnedAt: Date | string | null;
  status: "BORROWED" | "RETURNED" | "DAMAGED" | "LOST";
  lateDays: number;
}

export interface StudentItem {
  id: string;
  nis: string;
  fullName: string;
  classId: string | null;
  status: StudentStatusType;
  createdAt: Date | string;
  updatedAt: Date | string;
  studentClass: {
    id: string;
    name: string;
    academicYear: string;
  } | null;
  activeLoansCount: number;
  activeLoanTitles: string[];
  nearestDueDate: Date | string | null;
  hasActiveSanction: boolean;
  activeSanctionEndDate: Date | string | null;
  pendingObligationsCount: number;
}

export interface StudentDetailItem extends StudentItem {
  maxActiveLoans: number;
  defaultLoanDays: number;
  onTimeRate: number | null;
  totalCompletedLoans: number;
  activeLoans: StudentActiveLoanItem[];
  recentLoans: StudentLoanHistoryItem[];
}

export interface StudentStats {
  totalStudents: number;
  activeStudents: number;
  borrowingStudents: number;
  inactiveOrSanctionedStudents: number;
}

export interface StudentListResponse {
  data: StudentItem[];
  total: number;
  page: number;
  pageSize: number;
  totalPages: number;
  stats: StudentStats;
  maxActiveLoans: number;
  defaultLoanDays: number;
}

export interface StudentFilterParams {
  search?: string;
  classId?: string;
  status?: "all" | "ACTIVE" | "INACTIVE";
  loanStatus?: "all" | "BORROWING" | "FREE" | "BLOCKED";
  page?: number;
  pageSize?: number;
}

export interface StudentActionResult<T = StudentItem> {
  success: boolean;
  message: string;
  data?: T;
  errors?: Record<string, string[]>;
}

export interface StudentImportPreviewRow {
  rowNumber: number;
  nis: string;
  fullName: string;
  className: string;
  matchedClassId: string | null;
  status: StudentStatusType;
  isValid: boolean;
  errors: string[];
  warnings: string[];
}

export interface StudentImportResult {
  insertedCount: number;
  skippedCount: number;
}