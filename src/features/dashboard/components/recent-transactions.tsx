import Link from "next/link";
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
import { Card } from "@/components/ui/card";
import { recentTransactions } from "../constants/dashboard-data";
import { TransactionRecord } from "../types/dashboard.types";
import { cn } from "@/lib/utils";

interface RecentTransactionsProps {
  transactions?: TransactionRecord[];
}

export function RecentTransactions({
  transactions = recentTransactions,
}: RecentTransactionsProps) {
  return (
    <Card className="flex w-full flex-col overflow-hidden">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between border-b border-slate-100 p-4 sm:p-5 gap-2">
        <div>
          <h4 className="font-headline-sm text-sm font-bold text-slate-900">
            Transaksi &amp; Sirkulasi Terbaru
          </h4>
          <p className="text-xs text-slate-500">
            Pencatatan real-time peminjaman dan pengembalian siswa
          </p>
        </div>
        <Link
          href="#riwayat"
          className="text-xs font-semibold text-emerald-700 hover:text-emerald-800 hover:underline inline-flex items-center gap-1"
        >
          Lihat Semua Riwayat &rarr;
        </Link>
      </div>

      {/* Table Container */}
      <Table>
        <TableHeader>
          <TableRow className="hover:bg-transparent">
            <TableHead>Peminjam</TableHead>
            <TableHead>Buku &amp; Kode</TableHead>
            <TableHead>Tgl Pinjam</TableHead>
            <TableHead>Jatuh Tempo</TableHead>
            <TableHead className="text-center">Status</TableHead>
            <TableHead className="text-right">Aksi</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {transactions.map((t) => {
            const isOverdue = t.status === "OVERDUE";
            const isReturned = t.status === "RETURNED";
            const isBorrowed = t.status === "BORROWED";

            return (
              <TableRow
                key={t.id}
                className={cn(isReturned && "bg-slate-50/30")}
              >
                {/* Peminjam Column */}
                <TableCell>
                  <p className="font-bold text-slate-900">{t.borrower.name}</p>
                  <p className="text-[11px] text-slate-500">
                    NIS: <span className="font-data-mono">{t.borrower.nis}</span> •{" "}
                    {t.borrower.classGrade}
                  </p>
                </TableCell>

                {/* Buku & Kode Column */}
                <TableCell>
                  <p className="font-semibold text-slate-800">{t.book.title}</p>
                  <p className="font-data-mono text-[11px] text-slate-500">
                    {t.book.copyCode} ({t.book.shelfLocation})
                  </p>
                </TableCell>

                {/* Tgl Pinjam Column */}
                <TableCell className="text-slate-600 whitespace-nowrap">
                  {t.loanDate}
                </TableCell>

                {/* Jatuh Tempo Column */}
                <TableCell className="whitespace-nowrap">
                  <span
                    className={cn(
                      "font-semibold",
                      isOverdue ? "text-rose-600 font-bold" : "text-slate-800"
                    )}
                  >
                    {t.dueDate}
                  </span>
                  <p className={cn("text-xs", t.dueStatus.colorClass)}>
                    {t.dueStatus.label}
                  </p>
                </TableCell>

                {/* Status Badge Column */}
                <TableCell className="text-center whitespace-nowrap">
                  {isOverdue && (
                    <Badge variant="danger" dot>
                      Terlambat
                    </Badge>
                  )}
                  {isBorrowed && (
                    <Badge variant="info" dot>
                      Dipinjam
                    </Badge>
                  )}
                  {isReturned && (
                    <Badge variant="success" dot>
                      Dikembalikan
                    </Badge>
                  )}
                </TableCell>

                {/* Aksi Column */}
                <TableCell className="text-right whitespace-nowrap">
                  {isOverdue && (
                    <Button
                      variant="outline"
                      size="xs"
                      className="hover:border-emerald-600 hover:text-emerald-800 font-semibold"
                    >
                      Proses Kembali
                    </Button>
                  )}
                  {isBorrowed && (
                    <Button
                      variant="outline"
                      size="xs"
                      className="hover:border-emerald-600 hover:text-emerald-800 font-semibold"
                    >
                      Detail
                    </Button>
                  )}
                  {isReturned && (
                    <span className="text-[11px] italic text-slate-400">
                      Selesai
                    </span>
                  )}
                </TableCell>
              </TableRow>
            );
          })}
        </TableBody>
      </Table>

      {/* Footer Status Bar */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between border-t border-slate-100 bg-slate-50 px-4 py-3 text-xs text-slate-500 gap-2">
        <span>Menampilkan 5 aktivitas sirkulasi terkini</span>
        
      </div>
    </Card>
  );
}
