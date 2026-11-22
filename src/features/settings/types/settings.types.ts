export interface SystemSettingsValues {
  MAX_ACTIVE_LOANS: number;
  DEFAULT_LOAN_DAYS: number;
  MAX_LOAN_EXTENSIONS: number;
  DEFAULT_EXTENSION_DAYS: number;
}

export interface SystemSettingRecord {
  id: string;
  settingKey: string;
  value: string;
  description: string | null;
  createdAt: string;
  updatedAt: string;
}

export interface SettingPreset {
  value: number;
  label: string;
}

// Re-export constants for seamless backwards compatibility
export * from "../constants/settings.constants";
