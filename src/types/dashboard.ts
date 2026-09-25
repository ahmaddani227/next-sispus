export type UserRole = "ADMIN" | "PETUGAS" | "KEPALA_PERPUSTAKAAN";

export interface UserProfile {
  name: string;
  role: string;
  roleType: UserRole;
  nip: string;
  avatarUrl: string;
}

export interface MetricItem {
  id: string;
  title: string;
  value: string;
  unit: string;
  badgeText: string;
  badgeVariant: "success" | "neutral" | "info" | "warning" | "danger";
  description: string;
  iconName:
    | "book-open"
    | "layers"
    | "check-circle"
    | "arrow-left-right"
    | "alert-triangle"
    | "x-circle"
    | "clock"
    | "shield-alert"
    | "file-check";
  highlightColor?: string;
}

export type TransactionStatus = "RETURNED" | "BORROWED" | "OVERDUE";

export interface TransactionRecord {
  id: string;
  borrower: {
    name: string;
    nis: string;
    classGrade: string;
  };
  book: {
    title: string;
    copyCode: string;
    shelfLocation: string;
  };
  loanDate: string;
  dueDate: string;
  dueStatus: {
    label: string;
    isOverdue: boolean;
    isDueToday?: boolean;
    colorClass: string;
  };
  status: TransactionStatus;
  statusLabel: string;
}

export interface NavItem {
  label: string;
  href: string;
  icon: string;
  isActive?: boolean;
  badge?: string;
}

export interface NavSection {
  title: string;
  items: NavItem[];
}
