"use client";

import { Pencil, KeyRound, Power, Users } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableHead,
  TableHeader,
  TableRow,
  TableCell,
} from "@/components/ui/table";
import {
  TableCard,
  TableCardHeader,
  TableEmptyState,
  TablePagination,
} from "@/components/TableCard";
import { Badge } from "@/components/ui/badge";
import { UserAvatar, RoleBadge, StatusBadge } from "./UserBadges";
import type { Pengguna } from "../types/pengguna.types";
import { cn } from "@/lib/utils";

interface UserTableProps {
  items: Pengguna[];
  totalFiltered: number;
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
  onEdit: (item: Pengguna) => void;
  onDelete: (item: Pengguna) => void;
  onToggleStatus: (item: Pengguna) => void;
}

export function UserTable({
  items,
  totalFiltered,
  currentPage,
  totalPages,
  onPageChange,
  onEdit,
  onToggleStatus,
}: UserTableProps) {
  const startIdx = (currentPage - 1) * 5;
  const endIdx = Math.min(startIdx + items.length, totalFiltered);

  return (
    <TableCard>
      <TableCardHeader
        title="Daftar Akun Pengguna & Pustakawan"
        description={`Menampilkan ${endIdx} dari ${totalFiltered} akun staf perpustakaan madrasah`}
        actions={
          <div className="w-8 h-8 rounded-lg bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800 text-emerald-700 dark:text-emerald-400 flex items-center justify-center">
            <Users className="w-4 h-4" />
          </div>
        }
      />

      <div className="overflow-x-auto">
        <Table>
          <TableHeader>
            <TableRow className="bg-muted/40 border-b border-border text-[11px] font-bold uppercase tracking-wider text-muted-foreground hover:bg-muted/40">
              <TableHead className="py-3.5 px-4 w-12 text-center">NO</TableHead>
              <TableHead className="py-3.5 px-4">PENGGUNA / NIP</TableHead>
              <TableHead className="py-3.5 px-4">EMAIL & KONTAK</TableHead>
              <TableHead className="py-3.5 px-4">ROLE SISTEM</TableHead>
              <TableHead className="py-3.5 px-4">STATUS AKUN</TableHead>
              <TableHead className="py-3.5 px-4 text-center">AKSI</TableHead>
            </TableRow>
          </TableHeader>

          <TableBody className="divide-y divide-border text-xs text-foreground">
            {items.length === 0 ? (
              <TableEmptyState
                asTableRow
                colSpan={7}
                title="Tidak ada pengguna ditemukan"
                description="Coba sesuaikan kata kunci pencarian atau ubah filter role/status Anda."
              />
            ) : (
              items.map((user, idx) => (
                <TableRow
                  key={user.id}
                  className={cn(
                    "transition-colors hover:bg-muted/30",
                    user.isSelf &&
                      "bg-emerald-50/30 dark:bg-emerald-950/10"
                  )}
                >
                  {/* No */}
                  <TableCell className="py-3.5 px-4 text-center font-mono font-semibold text-muted-foreground">
                    {startIdx + idx + 1}
                  </TableCell>

                  {/* Pengguna */}
                  <TableCell className="py-3.5 px-4">
                    <div className="flex items-center gap-3">
                      <UserAvatar
                        initials={user.avatarInitials}
                        color={user.avatarColor}
                      />
                      <div>
                        <div className="font-bold text-foreground flex items-center gap-1.5 flex-wrap">
                          <span>{user.nama}</span>
                          {user.isSelf && (
                            <span className="px-1.5 py-0.5 rounded text-xs font-bold bg-emerald-100 dark:bg-emerald-950/60 text-emerald-800 dark:text-emerald-300">
                              Anda
                            </span>
                          )}
                        </div>
                        <div className="text-[11px] text-muted-foreground font-mono">
                          NIP: {user.nip} •{" "}
                          <span
                            className={cn(
                              "font-medium",
                              user.role === "ADMIN"
                                ? "text-emerald-700 dark:text-emerald-400"
                                : user.role === "KEPALA_PERPUSTAKAAN"
                                ? "text-purple-700 dark:text-purple-400"
                                : "text-blue-700 dark:text-blue-400"
                            )}
                          >
                            @{user.username}
                          </span>
                        </div>
                      </div>
                    </div>
                  </TableCell>

                  {/* Email & Kontak */}
                  <TableCell className="py-3.5 px-4">
                    <div className="font-medium text-foreground">{user.email}</div>
                    <div className="text-[11px] text-muted-foreground font-mono">
                      {user.telepon}
                    </div>
                  </TableCell>

                  {/* Role */}
                  <TableCell className="py-3.5 px-4">
                    <RoleBadge role={user.role} />
                  </TableCell>

                  {/* Status */}
                  <TableCell className="py-3.5 px-4">
                    <StatusBadge status={user.status} />
                  </TableCell>

                  {/* Actions */}
                  <TableCell className="py-3.5 px-4 text-center">
                    <div className="inline-flex items-center gap-1.5">
                      <Button
                        type="button"
                        variant="ghost"
                        size="icon"
                        title="Edit Akun / Role"
                        onClick={() => onEdit(user)}
                        className="w-8 h-8 text-muted-foreground hover:text-emerald-700 dark:hover:text-emerald-400 hover:bg-emerald-50 dark:hover:bg-emerald-950/40"
                      >
                        <Pencil className="w-4 h-4" />
                      </Button>
                      <Button
                        type="button"
                        variant="ghost"
                        size="icon"
                        title="Ganti Sandi"
                        onClick={() =>
                          onEdit({ ...user, username: user.username + " (reset)" })
                        }
                        className="w-8 h-8 text-muted-foreground hover:text-blue-700 dark:hover:text-blue-400 hover:bg-blue-50 dark:hover:bg-blue-950/40"
                      >
                        <KeyRound className="w-4 h-4" />
                      </Button>
                      <Button
                        type="button"
                        variant="ghost"
                        size="icon"
                        title={
                          user.status === "Aktif"
                            ? "Nonaktifkan Akun"
                            : "Aktifkan Akun"
                        }
                        onClick={() => onToggleStatus(user)}
                        className={cn(
                          "w-8 h-8 hover:bg-amber-50 dark:hover:bg-amber-950/40",
                          user.status === "Aktif"
                            ? "text-muted-foreground hover:text-amber-700 dark:hover:text-amber-400"
                            : "text-emerald-600 dark:text-emerald-400 hover:text-emerald-700"
                        )}
                      >
                        <Power className="w-4 h-4" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>

      <TablePagination
        currentCount={items.length}
        totalCount={totalFiltered}
        currentRange={
          totalFiltered === 0
            ? "0"
            : `${startIdx + 1}-${endIdx}`
        }
        itemLabel="akun staf madrasah"
        currentPage={currentPage}
        totalPages={totalPages}
        onPageChange={onPageChange}
      />
    </TableCard>
  );
}
