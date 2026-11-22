"use client";

import { CalendarDays } from "lucide-react";
import { Card } from "@/components/ui/card";
import { SettingField } from "./SettingField";
import type { SystemSettingsValues } from "../types/settings.types";
import {
  SETTINGS_METADATA,
  MAX_EXT_PRESETS,
  EXT_DAYS_PRESETS,
} from "../constants/settings.constants";

interface ExtensionRulesCardProps {
  values: SystemSettingsValues;
  onChange: (key: keyof SystemSettingsValues, value: number) => void;
}

export function ExtensionRulesCard({ values, onChange }: ExtensionRulesCardProps) {
  return (
    <Card className="p-6 rounded-xl border border-border shadow-xs bg-card space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between pb-3 border-b border-border">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-lg bg-blue-50 dark:bg-blue-950/60 border border-blue-200 dark:border-blue-800 text-blue-800 dark:text-blue-400 flex items-center justify-center font-bold">
            <CalendarDays className="w-4 h-4" />
          </div>
          <div>
            <h3 className="text-sm font-bold text-foreground">
              Aturan Perpanjangan Masa Pinjam
            </h3>
          </div>
        </div>
      </div>

      <div className="space-y-6">
        {/* MAX_LOAN_EXTENSIONS */}
        <SettingField
          id="f-max-ext"
          label={SETTINGS_METADATA.MAX_LOAN_EXTENSIONS.label}
          description={SETTINGS_METADATA.MAX_LOAN_EXTENSIONS.description}
          value={values.MAX_LOAN_EXTENSIONS}
          displayValue={
            values.MAX_LOAN_EXTENSIONS === 0
              ? "Dinonaktifkan"
              : `${values.MAX_LOAN_EXTENSIONS} Kali`
          }
          min={SETTINGS_METADATA.MAX_LOAN_EXTENSIONS.min}
          max={SETTINGS_METADATA.MAX_LOAN_EXTENSIONS.max}
          presets={MAX_EXT_PRESETS}
          onChange={(val) => onChange("MAX_LOAN_EXTENSIONS", val)}
          accentColor="blue"
        />

        <hr className="border-border" />

        {/* DEFAULT_EXTENSION_DAYS */}
        <SettingField
          id="f-ext-days"
          label={SETTINGS_METADATA.DEFAULT_EXTENSION_DAYS.label}
          description={SETTINGS_METADATA.DEFAULT_EXTENSION_DAYS.description}
          value={values.DEFAULT_EXTENSION_DAYS}
          displayValue={`+${values.DEFAULT_EXTENSION_DAYS} Hari`}
          min={SETTINGS_METADATA.DEFAULT_EXTENSION_DAYS.min}
          max={SETTINGS_METADATA.DEFAULT_EXTENSION_DAYS.max}
          presets={EXT_DAYS_PRESETS}
          onChange={(val) => onChange("DEFAULT_EXTENSION_DAYS", val)}
          accentColor="blue"
        />
      </div>
    </Card>
  );
}
