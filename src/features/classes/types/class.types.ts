export interface ClassItem {
  id: string;
  name: string;
  academicYear: string;
  isActive: boolean;
  createdAt: Date | string;
  updatedAt: Date | string;
  _count?: {
    students: number;
  };
}

export interface ClassListResponse {
  data: ClassItem[];
  total: number;
}

export interface ClassActionResult<T = ClassItem> {
  success: boolean;
  message: string;
  data?: T;
  errors?: Record<string, string[]>;
}

export interface ClassFilterParams {
  search?: string;
  academicYear?: string;
  isActive?: "all" | "active" | "inactive";
}