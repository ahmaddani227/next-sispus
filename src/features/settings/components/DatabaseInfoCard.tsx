"use client";

import { Database } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { formatDate } from "@/utils/formatDate";
import type { SystemSettingRecord } from "../types/settings.types";

interface DatabaseInfoCardProps {
  records: SystemSettingRecord[];
  lastUpdated?: string | null;
}

export function DatabaseInfoCard({ records, lastUpdated }: DatabaseInfoCardProps) {
  return (
    <Card className="p-6 rounded-xl border border-border shadow-xs bg-card space-y-4">
      {/* Header */}
      <div className="flex items-center justify-between pb-3 border-b border-border">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-lg bg-slate-100 dark:bg-slate-800 text-slate-800 dark:text-slate-200 flex items-center justify-center font-bold">
            <Database className="w-4 h-4" />
          </div>
          <div>
            <h3 className="text-sm font-bold text-foreground">
              Informasi Tabel Sistem Manajemen &amp; Konfigurasi
            </h3>
            <p className="text-[11px] text-muted-foreground">
              Parameter konfigurasi tersimpan dinamis di database.
            </p>
          </div>
        </div>
        {lastUpdated && (
          <div className="text-[11px] text-muted-foreground">
            Terakhir diperbarui:{" "}
            <strong className="text-foreground">{formatDate(lastUpdated)}</strong>
          </div>
        )}
      </div>

      {/* Grid records */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 text-xs">
        {records.map((rec) => (
          <div
            key={rec.id}
            className="p-3 rounded-lg border border-border/80 bg-muted/20 space-y-1.5"
          >
            <div className="flex items-center justify-between">
              <span className="font-mono font-bold text-[11px] text-foreground">
                {rec.settingKey}
              </span>
              <Badge variant="neutral" size="sm" className="font-mono font-bold">
                {rec.value}
              </Badge>
            </div>
            <p className="text-[11px] text-muted-foreground leading-snug line-clamp-2">
              {rec.description}
            </p>
          </div>
        ))}
      </div>
    </Card>
  );
}
