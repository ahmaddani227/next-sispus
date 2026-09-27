"use client";

import { Eye, Edit2, Trash2 } from "lucide-react";
import { MasterItem, MasterTabType } from "../types/master-data.types";
import { MASTER_TAB_CONFIGS } from "../constants/master-data";
import {
  Table,
  TableHeader,
  TableBody,
  TableHead,
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
import { Button } from "@/components/ui/button";

interface MasterTableProps {
  items: MasterItem[];
  totalFiltered: number;
  activeTab: MasterTabType;
  onViewDetail: (item: MasterItem) => void;
  onEdit: (item: MasterItem) => void;
  onDelete: (item: MasterItem) => void;
}

export function MasterTable({
  items,
  totalFiltered,
  activeTab,
  onViewDetail,
  onEdit,
  onDelete,
}: MasterTableProps) {
  const currentTabConfig = MASTER_TAB_CONFIGS[activeTab];

  return (
    <TableCard>
      <TableCardHeader
        title={`Data Master: ${currentTabConfig.singularLabel}`}
        badge={
          <Badge
            variant="outline"
            className="px-2 py-0.5 rounded text-xs font-bold bg-emerald-50 text-emerald-700 border border-emerald-200"
          >
            {totalFiltered} Data Terkonfigurasi
          </Badge>
        }
        description={
          <div className="flex items-center gap-2">
            <span>
              Menampilkan data master {currentTabConfig.label.toLowerCase()} yang
              terdaftar pada sistem
            </span>
            <span>•</span>
            <span className="text-slate-400">Sinkronisasi Terakhir: 10:45 WIB</span>
          </div>
        }
        actions={
          <div className="flex items-center gap-2 shrink-0">
            <span className="text-xs text-slate-500">Mode Tampilan:</span>
            <span className="px-2 py-1 rounded bg-slate-100 text-slate-700 font-mono text-xs font-semibold">
              Standar Perpustakaan Madrasah
            </span>
          </div>
        }
      />

      <div className="overflow-x-auto relative">
        <Table className="min-w-[1000px]">
          <TableHeader>
            <TableRow>
              <TableHead className="w-12 text-center">No</TableHead>
              <TableHead className="min-w-[140px]">Kode Master</TableHead>
              <TableHead className="min-w-[220px]">Nama Entitas</TableHead>
              <TableHead className="min-w-[300px]">Deskripsi</TableHead>
              <TableHead className="min-w-[180px] text-center">
                Relasi Koleksi Buku
              </TableHead>
              <TableHead className="min-w-[120px] text-center">Status</TableHead>
              <TableHead className="min-w-[140px] text-center">Aksi</TableHead>
            </TableRow>
          </TableHeader>

          <TableBody>
            {items.length === 0 ? (
              <TableEmptyState
                asTableRow
                colSpan={7}
                title="Tidak ada data master ditemukan"
                description="Coba sesuaikan kata kunci pencarian atau ubah filter status Anda."
              />
            ) : (
              items.map((item, index) => {
                const isAktif = item.status === "Aktif";

                return (
                  <TableRow
                    key={item.id}
                    className="hover:bg-slate-50/80 transition-colors"
                  >
                    {/* No */}
                    <TableCell className="text-center font-medium text-slate-400 text-xs">
                      {index + 1}
                    </TableCell>

                    {/* Kode Master */}
                    <TableCell>
                      <span className="font-mono text-xs font-bold text-slate-900 bg-slate-100 px-2 py-0.5 rounded border border-slate-200">
                        {item.code}
                      </span>
                    </TableCell>

                    {/* Nama Entitas */}
                    <TableCell>
                      <div className="font-bold text-slate-900 text-xs">
                        {item.name}
                      </div>
                      <div className="text-[11px] text-slate-600 capitalize">
                        Tipe: {item.type}
                      </div>
                    </TableCell>

                    {/* Deskripsi */}
                    <TableCell>
                      <p className="text-xs text-slate-600 line-clamp-1 max-w-sm">
                        {item.description}
                      </p>
                    </TableCell>

                    {/* Relasi Koleksi Buku */}
                    <TableCell className="text-center">
                      <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-semibold bg-emerald-50 text-emerald-800 border border-emerald-200/60">
                        {item.relation}
                      </span>
                    </TableCell>

                    {/* Status Operasional */}
                    <TableCell className="text-center">
                      <Badge
                        variant="outline"
                        className={`px-2 py-0.5 rounded text-xs font-bold ${
                          isAktif
                            ? "bg-emerald-50 text-emerald-700 border-emerald-200"
                            : "bg-slate-100 text-slate-600 border-slate-200"
                        }`}
                      >
                        {item.status}
                      </Badge>
                    </TableCell>

                    {/* Aksi */}
                    <TableCell className="text-center">
                      <div className="flex items-center justify-center gap-1">
                        <Button
                          type="button"
                          variant="ghost"
                          size="icon-xs"
                          onClick={() => onViewDetail(item)}
                          className="hover:bg-slate-100 text-slate-600 hover:text-slate-900"
                          title="Lihat Detail Entitas"
                        >
                          <Eye className="w-4 h-4" />
                          <span className="sr-only">Lihat Detail</span>
                        </Button>
                        <Button
                          type="button"
                          variant="ghost"
                          size="icon-xs"
                          onClick={() => onEdit(item)}
                          className="hover:bg-slate-100 text-slate-600 hover:text-slate-900"
                          title="Edit Master Data"
                        >
                          <Edit2 className="w-4 h-4" />
                          <span className="sr-only">Edit</span>
                        </Button>
                        <Button
                          type="button"
                          variant="ghost"
                          size="icon-xs"
                          onClick={() => onDelete(item)}
                          className="hover:bg-rose-50 text-slate-400 hover:text-rose-600"
                          title="Hapus Entitas"
                        >
                          <Trash2 className="w-4 h-4" />
                          <span className="sr-only">Hapus</span>
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                );
              })
            )}
          </TableBody>
        </Table>
      </div>

      <TablePagination
        currentCount={items.length}
        totalCount={totalFiltered}
        itemLabel="entitas"
      />
    </TableCard>
  );
}
