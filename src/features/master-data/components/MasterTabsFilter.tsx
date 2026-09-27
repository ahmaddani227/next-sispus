"use client";

import { Search, RotateCcw, Plus, Tag, Layers, Building2, Users, X } from "lucide-react";
import { MasterFilterState, MasterTabType } from "../types/master-data.types";
import { MASTER_TAB_CONFIGS } from "../constants/master-data";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";

interface MasterTabsFilterProps {
  activeTab: MasterTabType;
  onTabChange: (tab: MasterTabType) => void;
  tabCounts: Record<MasterTabType, number>;
  filters: MasterFilterState;
  onFilterChange: (filters: Partial<MasterFilterState>) => void;
  onResetFilter: () => void;
  onOpenCreateModal: () => void;
}

const tabIcons = {
  kategori: Tag,
  rak: Layers,
  penerbit: Building2,
  kelas: Users,
};

export function MasterTabsFilter({
  activeTab,
  onTabChange,
  tabCounts,
  filters,
  onFilterChange,
  onResetFilter,
  onOpenCreateModal,
}: MasterTabsFilterProps) {
  const tabs: MasterTabType[] = ["kategori", "rak", "penerbit", "kelas"];

  return (
    <Card className="rounded-xl border border-slate-200 dark:border-border shadow-xs bg-white dark:bg-card p-5 space-y-4">
      {/* Tab Switcher 4 Entitas Master */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between border-b border-slate-200 dark:border-border pb-4 gap-3">
        <div className="flex items-center gap-1.5 p-1 bg-slate-100 dark:bg-slate-900 rounded-lg border border-slate-200 dark:border-border w-full sm:w-auto overflow-x-auto scrollbar-none">
          {tabs.map((tabKey) => {
            const config = MASTER_TAB_CONFIGS[tabKey];
            const Icon = tabIcons[tabKey];
            const isActive = activeTab === tabKey;
            const count = tabCounts[tabKey] || 0;

            return (
              <Button
                key={tabKey}
                type="button"
                variant={isActive ? "default" : "ghost"}
                size="sm"
                onClick={() => onTabChange(tabKey)}
                className={cn(
                  "px-3.5 py-1.5 text-xs font-semibold rounded-md transition-all gap-2 whitespace-nowrap cursor-pointer h-auto",
                  isActive
                    ? "bg-white text-emerald-800 shadow-xs hover:bg-white hover:text-emerald-900 font-bold dark:bg-emerald-950/70 dark:text-emerald-300 dark:hover:bg-emerald-950/90"
                    : "text-slate-600 hover:text-slate-900 hover:bg-slate-200/60 dark:text-slate-400 dark:hover:text-slate-100 dark:hover:bg-slate-800"
                )}
              >
                <Icon
                  className={cn(
                    "w-3.5 h-3.5 shrink-0",
                    isActive ? "text-emerald-700 dark:text-emerald-400" : "text-slate-400 dark:text-slate-500"
                  )}
                />
                <span>
                  {config.label} ({count})
                </span>
              </Button>
            );
          })}
        </div>
      </div>

      {/* Search & Filter Controls */}
      <div className="flex flex-col lg:flex-row items-stretch lg:items-center justify-between gap-3">
        {/* Left: Search & Filter Dropdown */}
        <div className="flex flex-col sm:flex-row items-center gap-3 flex-1 min-w-0">
          {/* Search Input */}
          <div className="relative w-full sm:flex-1">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400 dark:text-slate-500">
              <Search className="w-4 h-4" />
            </div>
            <Input
              type="text"
              value={filters.searchQuery}
              onChange={(e) => onFilterChange({ searchQuery: e.target.value })}
              placeholder="Cari master data (Kode, Nama entitas, Spesifikasi, Lokasi)..."
              className="w-full pl-9 pr-8 py-2 text-xs bg-slate-50 dark:bg-slate-900/60 border border-slate-200 dark:border-border rounded-lg text-slate-800 dark:text-slate-100 placeholder-slate-400 dark:placeholder-slate-500 focus:bg-white dark:focus:bg-card focus:outline-none focus:border-emerald-600 transition-colors h-auto shadow-none"
            />
            {filters.searchQuery && (
              <button
                type="button"
                onClick={() => onFilterChange({ searchQuery: "" })}
                className="absolute inset-y-0 right-0 pr-3 flex items-center text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 cursor-pointer"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            )}
          </div>

          {/* Status Dropdown */}
          <div className="w-full sm:w-60 shrink-0">
            <select
              value={filters.status}
              onChange={(e) =>
                onFilterChange({
                  status: e.target.value as MasterFilterState["status"],
                })
              }
              className="w-full py-2 px-3 text-xs bg-slate-50 dark:bg-slate-900/60 border border-slate-200 dark:border-border rounded-lg text-slate-800 dark:text-slate-100 font-semibold focus:bg-white dark:focus:bg-card focus:outline-none focus:border-emerald-600 cursor-pointer transition-colors"
            >
              <option value="all">Semua Status (Aktif &amp; Nonaktif)</option>
              <option value="aktif">Hanya Status Aktif</option>
              <option value="nonaktif">Hanya Status Nonaktif</option>
            </select>
          </div>
        </div>

        {/* Right: Action Buttons */}
        <div className="flex items-center justify-end gap-2 shrink-0">
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={onResetFilter}
            className="bg-slate-100 dark:bg-slate-800/80 hover:bg-slate-200 dark:hover:bg-slate-700/80 text-slate-700 dark:text-slate-300 border-slate-200 dark:border-border text-xs font-semibold gap-1.5 h-auto py-2 px-3 whitespace-nowrap cursor-pointer"
          >
            <RotateCcw className="w-3.5 h-3.5 text-slate-500 dark:text-slate-400" />
            <span>Reset Filter</span>
          </Button>

          <Button
            type="button"
            size="sm"
            onClick={onOpenCreateModal}
            className="bg-emerald-800 hover:bg-emerald-900 text-white text-xs font-bold gap-1.5 shadow-xs h-auto py-2 px-3.5 whitespace-nowrap cursor-pointer"
          >
            <Plus className="w-3.5 h-3.5 text-white" />
            <span>Tambah Data</span>
          </Button>
        </div>
      </div>
    </Card>
  );
}
