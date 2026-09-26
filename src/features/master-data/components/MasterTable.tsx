"use client";

import { Eye, Edit2, Trash2, SearchX } from "lucide-react";
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
    <div className="bg-white rounded-xl border border-slate-200 shadow-xs overflow-hidden flex flex-col">
      <div className="p-4 border-b border-slate-100 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
        <div>
          <div className="flex items-center gap-2">
            <h3 className="font-bold text-slate-900 text-sm">
              Data Master: {currentTabConfig.singularLabel}
            </h3>
            <Badge
              variant="outline"
              className="px-2 py-0.5 rounded text-[10px] font-bold bg-emerald-50 text-emerald-700 border border-emerald-200"
            >
              {totalFiltered} Data Terkonfigurasi
            </Badge>
          </div>
          <div className="flex items-center gap-2 mt-1 text-xs text-slate-500">
            <span>
              Menampilkan data master {currentTabConfig.label.toLowerCase()} yang
              terdaftar pada sistem
            </span>
            <span>•</span>
            <span className="text-slate-400">Sinkronisasi Terakhir: 10:45 WIB</span>
          </div>
        </div>

        <div className="flex items-center gap-2 shrink-0">
          <span className="text-xs text-slate-500">Mode Tampilan:</span>
          <span className="px-2 py-1 rounded bg-slate-100 text-slate-700 font-mono text-xs font-semibold">
            Standar Perpustakaan Madrasah
          </span>
        </div>
      </div>

      <div className="overflow-x-auto relative">
        <Table className="min-w-[1000px]">
          <TableHeader>
            <TableRow>
              <TableHead className="w-12 text-center">No</TableHead>
              <TableHead className="min-w-[140px]">Kode Master</TableHead>
              <TableHead className="min-w-[220px]">Nama Entitas</TableHead>
              <TableHead className="min-w-[300px]">
                Deskripsi
              </TableHead>
              <TableHead className="min-w-[180px] text-center">
                Relasi Koleksi BUku
              </TableHead>
              <TableHead className="min-w-[120px] text-center">Status</TableHead>
              <TableHead className="min-w-[140px] text-center">Aksi</TableHead>
            </TableRow>
          </TableHeader>

          <TableBody>
            {items.length === 0 ? (
              <TableRow>
                <TableCell colSpan={7} className="h-44 text-center">
                  <div className="flex flex-col items-center justify-center text-slate-400">
                    <SearchX className="w-8 h-8 mb-2 stroke-[1.5]" />
                    <p className="font-semibold text-slate-700 text-sm">
                      Tidak ada data master ditemukan
                    </p>
                    <p className="text-xs text-slate-400 mt-0.5">
                      Coba sesuaikan kata kunci pencarian atau ubah filter status Anda.
                    </p>
                  </div>
                </TableCell>
              </TableRow>
            ) : (
              items.map((item, index) => {
                const isAktif = item.status === "Aktif";

                return (
                  <TableRow
                    key={item.id}
                    className="hover:bg-slate-50/80 transition-colors"
                  >
                    <TableCell className="text-center font-semibold text-slate-500">
                      {index + 1}
                    </TableCell>

                    <TableCell className="font-mono font-bold text-emerald-800">
                      <span className="px-2 py-0.5 rounded bg-emerald-50 border border-emerald-200 text-xs">
                        {item.code}
                      </span>
                    </TableCell>

                    <TableCell className="font-bold text-slate-900">
                      {item.name}
                    </TableCell>

                    <TableCell className="text-slate-600 leading-relaxed text-xs">
                      {item.description}
                    </TableCell>

                    <TableCell className="text-center">
                      <span className="px-2.5 py-1 rounded-full text-xs font-semibold bg-emerald-50 text-emerald-800 border border-emerald-200">
                        {item.relation}
                      </span>
                    </TableCell>

                    <TableCell className="text-center">
                      <span
                        className={`px-2.5 py-0.5 rounded-full text-[11px] font-bold ${
                          isAktif
                            ? "bg-emerald-100 text-emerald-800"
                            : "bg-slate-100 text-slate-600"
                        }`}
                      >
                        {item.status}
                      </span>
                    </TableCell>

                    <TableCell className="text-center">
                      <div className="inline-flex items-center gap-1">
                        <Button
                          type="button"
                          variant="ghost"
                          size="icon-sm"
                          onClick={() => onViewDetail(item)}
                          className="h-8 w-8 text-slate-500 hover:text-emerald-700 hover:bg-emerald-50 rounded-lg transition-colors"
                          title="Lihat Detail"
                        >
                          <Eye className="w-4 h-4" />
                          <span className="sr-only">Detail</span>
                        </Button>

                        <Button
                          type="button"
                          variant="ghost"
                          size="icon-sm"
                          onClick={() => onEdit(item)}
                          className="h-8 w-8 text-slate-500 hover:text-blue-700 hover:bg-blue-50 rounded-lg transition-colors"
                          title="Edit Data"
                        >
                          <Edit2 className="w-4 h-4" />
                          <span className="sr-only">Edit</span>
                        </Button>

                        <Button
                          type="button"
                          variant="ghost"
                          size="icon-sm"
                          onClick={() => onDelete(item)}
                          className="h-8 w-8 text-slate-500 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-colors"
                          title="Hapus Data"
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

      <div className="p-4 border-t border-slate-200 bg-slate-50 flex flex-col sm:flex-row items-center justify-between gap-3">
        <div className="text-xs text-slate-500">
          Menampilkan{" "}
          <span className="font-bold text-slate-800">
            {items.length > 0 ? "1" : "0"} - {items.length}
          </span>{" "}
          dari{" "}
          <span className="font-bold text-slate-800">{totalFiltered}</span> entitas
          terdaftar
        </div>

        <div className="flex items-center gap-1.5">
          <Button
            type="button"
            variant="outline"
            size="sm"
            disabled
            className="px-2.5 py-1 text-xs font-semibold text-slate-400 bg-white border border-slate-200 rounded-lg h-auto"
          >
            Sebelumnya
          </Button>
          <Button
            type="button"
            size="sm"
            className="px-3 py-1 text-xs font-bold text-white bg-emerald-800 hover:bg-emerald-800 border border-emerald-800 rounded-lg h-auto cursor-default"
          >
            1
          </Button>
          <Button
            type="button"
            variant="outline"
            size="sm"
            disabled
            className="px-2.5 py-1 text-xs font-semibold text-slate-400 bg-white border border-slate-200 rounded-lg h-auto"
          >
            Selanjutnya
          </Button>
        </div>
      </div>
    </div>
  );
}
