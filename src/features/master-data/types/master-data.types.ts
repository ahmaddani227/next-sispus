export type MasterTabType = "kategori" | "rak" | "penerbit" | "kelas";

export type MasterStatus = "Aktif" | "Nonaktif";

export interface MasterItem {
  id: string;
  code: string;
  name: string;
  description: string;
  relation: string;
  status: MasterStatus;
  type: MasterTabType;
}

export interface MasterFilterState {
  searchQuery: string;
  status: "all" | "aktif" | "nonaktif";
}

export interface MasterMetric {
  id: string;
  title: string;
  value: string;
  unit: string;
  badgeText: string;
  badgeVariant: "emerald" | "blue" | "amber" | "purple";
  description: string;
  icon: "tag" | "layers" | "building" | "users";
}

export interface MasterTabConfig {
  key: MasterTabType;
  label: string;
  singularLabel: string;
  codePrefix: string;
  codePlaceholder: string;
  namePlaceholder: string;
  descPlaceholder: string;
  relationPlaceholder: string;
}
