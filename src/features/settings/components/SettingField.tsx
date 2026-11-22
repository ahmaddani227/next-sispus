"use client";

import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import type { SettingPreset } from "../types/settings.types";

export type { SettingPreset };

interface SettingFieldProps {
  id: string;
  label: string;
  description: string;
  value: number;
  displayValue: React.ReactNode;
  min: number;
  max: number;
  presets: SettingPreset[];
  onChange: (value: number) => void;
  accentColor?: "emerald" | "blue";
}

export function SettingField({
  id,
  label,
  description,
  value,
  displayValue,
  min,
  max,
  presets,
  onChange,
  accentColor = "emerald",
}: SettingFieldProps) {
  const valueColor =
    accentColor === "emerald"
      ? "text-emerald-700 dark:text-emerald-400"
      : "text-blue-700 dark:text-blue-400";

  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between">
        <Label
          htmlFor={id}
          className="text-xs font-bold text-foreground flex items-center gap-1.5"
        >
          <span>{label}</span>
        </Label>
        <span className={cn("text-xs font-extrabold font-mono", valueColor)}>
          {displayValue}
        </span>
      </div>
      <p className="text-[11px] text-muted-foreground leading-relaxed">
        {description}
      </p>
      <div className="flex items-center gap-3 pt-1">
        <Input
          id={id}
          type="number"
          min={min}
          max={max}
          value={value}
          onChange={(e) => onChange(parseInt(e.target.value, 10) || min)}
          className="w-24 text-xs font-mono font-bold bg-muted/40 text-center"
        />
        {/* Presets */}
        <div className="flex items-center gap-1.5 flex-wrap">
          {presets.map((preset) => (
            <Button
              key={preset.value}
              type="button"
              variant={value === preset.value ? "default" : "outline"}
              size="sm"
              onClick={() => onChange(preset.value)}
              className="h-7 text-xs px-2.5 font-mono"
            >
              {preset.label}
            </Button>
          ))}
        </div>
      </div>
    </div>
  );
}
