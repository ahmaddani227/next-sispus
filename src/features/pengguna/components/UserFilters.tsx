"use client";

import { Search, RotateCcw } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Card } from "@/components/ui/card";
import type { PenggunaFilterState } from "../types/pengguna.types";

interface UserFiltersProps {
  filters: PenggunaFilterState;
  onFilterChange: (key: keyof PenggunaFilterState, value: string) => void;
  onReset: () => void;
}

export function UserFilters({
  filters,
  onFilterChange,
  onReset,
}: UserFiltersProps) {
  return (
    <Card className="p-4 rounded-xl border border-border shadow-xs bg-card">
      <div className="flex flex-col md:flex-row items-center gap-3">
        {/* Search */}
        <div className="relative w-full md:w-150">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground pointer-events-none" />
          <Input
            id="pengguna-search"
            placeholder="Cari nama lengkap atau username..."
            value={filters.searchQuery}
            onChange={(e) => onFilterChange("searchQuery", e.target.value)}
            className="pl-9 text-xs bg-muted/40 border-border focus:bg-background"
          />
        </div>

        {/* Role Filter */}
        <Select
          value={filters.role}
          onValueChange={(v: any) => onFilterChange("role", v)}
        >
          <SelectTrigger
            id="pengguna-role-filter"
            className="w-full md:w-44 text-xs bg-muted/40 border-border focus:bg-background"
          >
            <SelectValue placeholder="Semua Role" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Semua Role</SelectItem>
            <SelectItem value="ADMIN">ADMIN</SelectItem>
            <SelectItem value="PETUGAS">PETUGAS</SelectItem>
            <SelectItem value="KEPALA_PERPUSTAKAAN">
              KEPALA PERPUSTAKAAN
            </SelectItem>
          </SelectContent>
        </Select>

        {/* Status Filter */}
        <Select
          value={filters.status}
          onValueChange={(v: any) => onFilterChange("status", v)}
        >
          <SelectTrigger
            id="pengguna-status-filter"
            className="w-full md:w-36 text-xs bg-muted/40 border-border focus:bg-background"
          >
            <SelectValue placeholder="Semua Status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Semua Status</SelectItem>
            <SelectItem value="Aktif">Aktif</SelectItem>
            <SelectItem value="Nonaktif">Nonaktif</SelectItem>
          </SelectContent>
        </Select>

        <Button
          type="button"
          variant="outline"
          size="sm"
          onClick={onReset}
          className="gap-1.5 text-xs whitespace-nowrap bg-muted/40 border-border text-muted-foreground hover:bg-muted hover:text-foreground"
        >
          <RotateCcw className="w-3.5 h-3.5" />
          Reset Filter
        </Button>
      </div>
    </Card>
  );
}
