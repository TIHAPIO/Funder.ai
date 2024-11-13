export interface SheetConfig {
  title: string;
  headers: string[];
}

export const sheetConfigs = {
  employees: {
    title: 'Mitarbeiter',
    headers: ['Name', 'Status', 'Kampagne', 'Shirt Größe', 'Jacken Größe', 'Hosen Größe', 'Ausrüstung'],
  },
  equipment: {
    title: 'Ausrüstung',
    headers: ['Name', 'Kategorie', 'Status', 'Zugewiesen an', 'Seriennummer'],
  },
  clothing: {
    title: 'Kleidung',
    headers: ['Artikel', 'Größe S', 'Größe M', 'Größe L', 'Größe XL'],
  },
  vehicles: {
    title: 'Fahrzeuge',
    headers: ['Name', 'Status', 'Kampagne', 'Notizen', 'Quelle'],
  },
  districts: {
    title: 'Kreisverbände',
    headers: ['Name', 'Status', 'Kapazität', 'Kontakt'],
  },
  accommodations: {
    title: 'Unterkünfte',
    headers: ['Name', 'Standort', 'Kapazität', 'Kampagne', 'Kontakt'],
  },
} as const;

export type SheetCategory = keyof typeof sheetConfigs;

export interface Category {
  title: string;
  icon: any;
  key: SheetCategory;
  resourceType: 'internal' | 'external';
}
