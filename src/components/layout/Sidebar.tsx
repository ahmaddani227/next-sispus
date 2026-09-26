"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
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
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { adminNavSections, currentUser } from "@/constants/navigation";
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

const Sidebar = ({ isOpen, onClose }: SidebarProps) => {
  const pathname = usePathname();

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
          "fixed inset-y-0 left-0 z-50 flex h-full w-[16.5rem] shrink-0 min-h-0 flex-col border-r border-slate-200 bg-white transition-transform duration-200 ease-in-out lg:static lg:translate-x-0 select-none",
          isOpen ? "translate-x-0" : "-translate-x-full"
        )}
      >
        {/* Brand Header */}
        <div className="flex h-16 shrink-0 items-center justify-between border-b border-slate-100 p-5">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg border border-emerald-100 bg-emerald-50 text-emerald-800 shadow-xs">
              <Library className="h-6 w-6 text-emerald-700" />
            </div>
            <div>
              <h1 className="font-headline-sm text-sm font-bold tracking-tight text-slate-900">
                SIPUS Ar-Rasyid
              </h1>
              <p className="text-[11px] text-slate-500 font-medium">
                Perpustakaan MI &amp; MTs
              </p>
            </div>
          </div>

          {/* Mobile close button */}
          <Button
            variant="ghost"
            size="icon-sm"
            onClick={onClose}
            className="text-slate-400 hover:bg-slate-100 hover:text-slate-700 lg:hidden"
            aria-label="Tutup menu navigasi"
          >
            <X className="h-5 w-5" />
          </Button>
        </div>

        {/* Navigation Sections */}
        <nav className="flex-1 min-h-0 space-y-6 overflow-y-auto p-4 scrollbar-thin">
          {adminNavSections.map((section) => (
            <div key={section.title}>
              <div className="font-label-sm mb-2 px-3 text-[11px] font-bold tracking-wider text-slate-800 uppercase">
                {section.title}
              </div>
              <ul className="space-y-1">
                {section.items.map((item) => {
                  const Icon = iconMap[item.icon] || BookOpen;
                  const isActive =
                    item.href === pathname ||
                    (item.href !== "/dashboard" &&
                      item.href !== "/" &&
                      !item.href.startsWith("#") &&
                      pathname.startsWith(item.href));

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
        <div className="shrink-0 border-t border-slate-100 bg-slate-50/70 p-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2.5 overflow-hidden">
              <Avatar className="h-9 w-9 ring-2 ring-emerald-500/20">
                <AvatarFallback>{currentUser.initials}</AvatarFallback>
              </Avatar>
              <div className="overflow-hidden">
                <p className="truncate text-[12px] font-bold text-slate-900">
                  {currentUser.name}
                </p>
                <p className="font-data-mono truncate text-[11px] text-slate-500">
                  NIP. {currentUser.nip}
                </p>
              </div>
            </div>

            <Link
              href="/login"
              className="rounded-md p-1.5 text-slate-400 transition-colors hover:bg-rose-50 hover:text-rose-600"
              title="Keluar dari Sistem"
            >
              <LogOut className="h-5 w-5" />
              <span className="sr-only">Keluar</span>
            </Link>
          </div>
        </div>
      </aside>
    </>
  );
}

export default Sidebar