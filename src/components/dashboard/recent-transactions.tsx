import Link from "next/link";
import { recentTransactions } from "@/lib/dashboard-data";
import { TransactionRecord } from "@/types/dashboard";
import { cn } from "@/lib/utils";

interface RecentTransactionsProps {
  transactions?: TransactionRecord[];
}

export function RecentTransactions({
  transactions = recentTransactions,
}: RecentTransactionsProps) {
  return (
    <div className="flex w-full flex-col overflow-hidden rounded-xl border border-slate-200 bg-white shadow-[0_1px_3px_0_rgba(15,23,42,0.05)]">
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
      <div className="flex-1 overflow-x-auto">
        <table className="w-full text-left text-xs">
          <thead className="border-b border-slate-200 bg-slate-50 text-[11px] font-bold uppercase tracking-wider text-slate-600">
            <tr>
              <th scope="col" className="py-3 px-4 font-semibold">
                Peminjam
              </th>
              <th scope="col" className="py-3 px-4 font-semibold">
                Buku &amp; Kode
              </th>
              <th scope="col" className="py-3 px-4 font-semibold">
                Tgl Pinjam
              </th>
              <th scope="col" className="py-3 px-4 font-semibold">
                Jatuh Tempo
              </th>
              <th scope="col" className="py-3 px-4 text-center font-semibold">
                Status
              </th>
              <th scope="col" className="py-3 px-4 text-right font-semibold">
                Aksi
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100 text-slate-700 font-medium">
            {transactions.map((t) => {
              const isOverdue = t.status === "OVERDUE";
              const isReturned = t.status === "RETURNED";
              const isBorrowed = t.status === "BORROWED";

              return (
                <tr
                  key={t.id}
                  className={cn(
                    "transition-colors hover:bg-slate-50/80",
                    isReturned && "bg-slate-50/30"
                  )}
                >
                  {/* Peminjam Column */}
                  <td className="py-3 px-4">
                    <p className="font-bold text-slate-900">{t.borrower.name}</p>
                    <p className="text-[11px] text-slate-500">
                      NIS: <span className="font-data-mono">{t.borrower.nis}</span> •{" "}
                      {t.borrower.classGrade}
                    </p>
                  </td>

                  {/* Buku & Kode Column */}
                  <td className="py-3 px-4">
                    <p className="font-semibold text-slate-800">{t.book.title}</p>
                    <p className="font-data-mono text-[11px] text-slate-500">
                      {t.book.copyCode} ({t.book.shelfLocation})
                    </p>
                  </td>

                  {/* Tgl Pinjam Column */}
                  <td className="py-3 px-4 text-slate-600 whitespace-nowrap">
                    {t.loanDate}
                  </td>

                  {/* Jatuh Tempo Column */}
                  <td className="py-3 px-4 whitespace-nowrap">
                    <span
                      className={cn(
                        "font-semibold",
                        isOverdue ? "text-rose-600 font-bold" : "text-slate-800"
                      )}
                    >
                      {t.dueDate}
                    </span>
                    <p className={cn("text-[10px]", t.dueStatus.colorClass)}>
                      {t.dueStatus.label}
                    </p>
                  </td>

                  {/* Status Badge Column */}
                  <td className="py-3 px-4 text-center whitespace-nowrap">
                    {isOverdue && (
                      <span className="inline-flex items-center gap-1.5 rounded-full border border-rose-200 bg-rose-50 px-2.5 py-0.5 text-[11px] font-semibold text-rose-700">
                        <span className="h-1.5 w-1.5 rounded-full bg-rose-600" />
                        Terlambat
                      </span>
                    )}
                    {isBorrowed && (
                      <span className="inline-flex items-center gap-1.5 rounded-full border border-blue-200 bg-blue-50 px-2.5 py-0.5 text-[11px] font-semibold text-blue-700">
                        <span className="h-1.5 w-1.5 rounded-full bg-blue-600" />
                        Dipinjam
                      </span>
                    )}
                    {isReturned && (
                      <span className="inline-flex items-center gap-1.5 rounded-full border border-emerald-200 bg-emerald-50 px-2.5 py-0.5 text-[11px] font-semibold text-emerald-800">
                        <span className="h-1.5 w-1.5 rounded-full bg-emerald-600" />
                        Dikembalikan
                      </span>
                    )}
                  </td>

                  {/* Aksi Column */}
                  <td className="py-3 px-4 text-right whitespace-nowrap">
                    {isOverdue && (
                      <button
                        type="button"
                        className="rounded border border-slate-200 bg-white px-2.5 py-1 text-xs font-semibold text-slate-700 shadow-xs transition-colors hover:border-emerald-600 hover:text-emerald-800"
                      >
                        Proses Kembali
                      </button>
                    )}
                    {isBorrowed && (
                      <button
                        type="button"
                        className="rounded border border-slate-200 bg-white px-2.5 py-1 text-xs font-semibold text-slate-700 shadow-xs transition-colors hover:border-emerald-600 hover:text-emerald-800"
                      >
                        Detail
                      </button>
                    )}
                    {isReturned && (
                      <span className="text-[11px] italic text-slate-400">
                        Selesai
                      </span>
                    )}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {/* Footer Status Bar */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between border-t border-slate-100 bg-slate-50 px-4 py-3 text-xs text-slate-500 gap-2">
        <span>Menampilkan 5 aktivitas sirkulasi terkini</span>
        <div className="flex items-center gap-2">
          <span className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse" />
          <span>Sinkronisasi database aktif</span>
        </div>
      </div>
    </div>
  );
}
