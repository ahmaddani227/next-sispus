"use client";

import Link from "next/link";
import {
  LayoutDashboard,
  Database,
  BookOpen,
  Users,
  ArrowUpRight,
  ArrowDownLeft,
  RefreshCw,
  History,
  AlertTriangle,
  FileText,
  LogOut,
  X,
  Library,
} from "lucide-react";
import { dashboardNavSections, currentUser } from "@/lib/dashboard-data";
import { cn } from "@/lib/utils";

interface SidebarProps {
  isOpen: boolean;
  onClose: () => void;
}

const iconMap: Record<string, React.ElementType> = {
  "layout-dashboard": LayoutDashboard,
  database: Database,
  "book-open": BookOpen,
  users: Users,
  "arrow-up-right": ArrowUpRight,
  "arrow-down-left": ArrowDownLeft,
  "refresh-cw": RefreshCw,
  history: History,
  "alert-triangle": AlertTriangle,
  "file-text": FileText,
};

export function Sidebar({ isOpen, onClose }: SidebarProps) {
  return (
    <>
      {/* Mobile Backdrop */}
      {isOpen && (
        <div
          className="fixed inset-0 z-40 bg-slate-900/50 backdrop-blur-xs transition-opacity lg:hidden"
          onClick={onClose}
          aria-hidden="true"
        />
      )}

      {/* Sidebar Aside Element */}
      <aside
        className={cn(
          "fixed inset-y-0 left-0 z-50 flex w-[16.5rem] flex-col border-r border-slate-200 bg-white transition-transform duration-200 ease-in-out lg:static lg:translate-x-0 select-none",
          isOpen ? "translate-x-0" : "-translate-x-full"
        )}
      >
        {/* Brand Header */}
        <div className="flex items-center justify-between border-b border-slate-100 p-5">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg border border-emerald-100 bg-emerald-50 text-emerald-800 shadow-xs">
              <Library className="h-6 w-6 text-emerald-700" />
            </div>
            <div>
              <h1 className="font-headline-sm text-sm font-bold tracking-tight text-slate-900">
                SIPUS Ar-Rasyid
              </h1>
              <p className="font-body-sm text-[11px] font-medium text-slate-500">
                Perpustakaan MI &amp; MTs
              </p>
            </div>
          </div>

          {/* Mobile close button */}
          <button
            type="button"
            onClick={onClose}
            className="flex h-8 w-8 items-center justify-center rounded-md text-slate-400 hover:bg-slate-100 hover:text-slate-700 lg:hidden"
            aria-label="Tutup menu navigasi"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Navigation Sections */}
        <nav className="flex-1 space-y-6 overflow-y-auto p-4 scrollbar-thin">
          {dashboardNavSections.map((section) => (
            <div key={section.title}>
              <div className="font-label-sm mb-2 px-3 text-[11px] font-bold tracking-wider text-slate-400 uppercase">
                {section.title}
              </div>
              <ul className="space-y-1">
                {section.items.map((item) => {
                  const Icon = iconMap[item.icon] || BookOpen;
                  const isActive = item.isActive;

                  return (
                    <li key={item.label}>
                      <Link
                        href={item.href}
                        onClick={() => {
                          if (window.innerWidth < 1024) onClose();
                        }}
                        className={cn(
                          "group flex items-center gap-3 rounded-md px-3 py-2 text-sm font-medium transition-colors",
                          isActive
                            ? "bg-emerald-50 text-emerald-900 font-semibold border-l-[3px] border-emerald-800"
                            : "text-slate-600 hover:bg-slate-50 hover:text-slate-900"
                        )}
                      >
                        <Icon
                          className={cn(
                            "h-5 w-5 shrink-0 transition-colors",
                            isActive
                              ? "text-emerald-800"
                              : "text-slate-400 group-hover:text-slate-600"
                          )}
                        />
                        <span className="truncate">{item.label}</span>
                      </Link>
                    </li>
                  );
                })}
              </ul>
            </div>
          ))}
        </nav>

        {/* Profile Card & Logout */}
        <div className="border-t border-slate-100 bg-slate-50/70 p-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2.5 overflow-hidden">
              <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-emerald-800 text-xs font-bold text-white ring-2 ring-emerald-500/20">
                SR
              </div>
              <div className="overflow-hidden">
                <p className="truncate text-xs font-bold text-slate-900">
                  {currentUser.name}
                </p>
                <p className="truncate text-[10px] font-semibold text-emerald-700">
                  {currentUser.role}
                </p>
                <p className="font-data-mono truncate text-[10px] text-slate-500">
                  NIP. {currentUser.nip}
                </p>
              </div>
            </div>

            <button
              type="button"
              className="rounded-md p-1.5 text-slate-400 transition-colors hover:bg-rose-50 hover:text-rose-600"
              title="Keluar dari Sistem"
              aria-label="Logout"
            >
              <LogOut className="h-5 w-5" />
            </button>
          </div>
        </div>
      </aside>
    </>
  );
}
