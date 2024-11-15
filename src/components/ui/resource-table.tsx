'use client';

import { useState, useMemo } from 'react';
import { Table, TableHeader, TableBody, TableHead, TableRow, TableCell } from "./table";
import { useTranslation } from '../../hooks/useTranslation';
import { ChevronUp, ChevronDown } from 'lucide-react';
import { sheetConfigs, type SheetCategory } from '../../app/resources/types';

interface ResourceItem {
  id: string;
  name?: string;
  status?: string;
  campaign?: string;
  notes?: string;
  source?: string;
  capacity?: number;
  contact?: string;
  clothingSizes?: {
    shirt?: string;
    jacket?: string;
    pants?: string;
  };
  assignedTo?: string;
  serialNumber?: string;
  itemType?: string;
  sizes?: {
    S?: number;
    M?: number;
    L?: number;
    XL?: number;
  };
  location?: string;
  [key: string]: any; // Add index signature for dynamic access
}

interface Column {
  header: string;
  accessor: string | ((item: ResourceItem) => string | number | undefined);
  sortable?: boolean;
}

interface ResourceTableProps {
  items: ResourceItem[];
  type: SheetCategory;
}

type SortConfig = {
  key: string;
  direction: 'asc' | 'desc';
} | null;

export function ResourceTable({ items, type }: ResourceTableProps) {
  const { t } = useTranslation('resources');
  const [sortConfig, setSortConfig] = useState<SortConfig>(null);
  const [selectedItem, setSelectedItem] = useState<string | null>(null);

  // Define columns based on resource type with translations and sorting
  const getColumns = (): Column[] => {
    switch (type) {
      case 'vehicles':
        return [
          { header: t('table.name'), accessor: 'name', sortable: true },
          { header: t('table.status'), accessor: 'status', sortable: true },
          { header: t('table.campaign'), accessor: 'campaign', sortable: true },
          { header: t('table.notes'), accessor: 'notes' },
          { header: t('table.source'), accessor: 'source', sortable: true },
        ];
      case 'districts':
        return [
          { header: t('table.name'), accessor: 'name', sortable: true },
          { header: t('table.status'), accessor: 'status', sortable: true },
          { header: t('table.capacity'), accessor: 'capacity', sortable: true },
          { header: t('table.contact'), accessor: 'contact', sortable: true },
        ];
      case 'employees':
        return [
          { header: t('table.name'), accessor: 'name', sortable: true },
          { header: t('table.status'), accessor: 'status', sortable: true },
          { header: t('table.campaign'), accessor: 'campaign', sortable: true },
          { header: t('table.clothing.shirt'), accessor: (item) => item.clothingSizes?.shirt },
          { header: t('table.clothing.jacket'), accessor: (item) => item.clothingSizes?.jacket },
          { header: t('table.clothing.pants'), accessor: (item) => item.clothingSizes?.pants },
        ];
      case 'equipment':
        return [
          { header: t('table.name'), accessor: 'name', sortable: true },
          { header: t('table.status'), accessor: 'status', sortable: true },
          { header: t('table.assignedTo'), accessor: 'assignedTo', sortable: true },
          { header: t('table.serialNumber'), accessor: 'serialNumber', sortable: true },
        ];
      case 'clothing':
        return [
          { header: t('table.type'), accessor: 'itemType', sortable: true },
          { header: 'S', accessor: (item) => item.sizes?.S?.toString() },
          { header: 'M', accessor: (item) => item.sizes?.M?.toString() },
          { header: 'L', accessor: (item) => item.sizes?.L?.toString() },
          { header: 'XL', accessor: (item) => item.sizes?.XL?.toString() },
        ];
      case 'accommodations':
        return [
          { header: t('table.name'), accessor: 'name', sortable: true },
          { header: t('table.location'), accessor: 'location', sortable: true },
          { header: t('table.capacity'), accessor: (item) => `${item.capacity} ${t('table.persons')}`, sortable: true },
          { header: t('table.campaign'), accessor: 'campaign', sortable: true },
          { header: t('table.contact'), accessor: 'contact', sortable: true },
        ];
      default:
        return [];
    }
  };

  const handleSort = (key: string) => {
    setSortConfig(current => {
      if (current?.key === key) {
        if (current.direction === 'asc') {
          return { key, direction: 'desc' };
        }
        return null;
      }
      return { key, direction: 'asc' };
    });
  };

  const sortedItems = useMemo(() => {
    if (!sortConfig) return items;

    return [...items].sort((a, b) => {
      const column = columns.find(col => 
        typeof col.accessor === 'string' ? col.accessor === sortConfig.key : false
      );

      if (!column) return 0;

      const accessor = column.accessor;
      if (typeof accessor !== 'string') return 0;

      const aValue = a[accessor];
      const bValue = b[accessor];

      if (aValue === bValue) return 0;
      if (aValue === undefined) return 1;
      if (bValue === undefined) return -1;

      const result = aValue > bValue ? 1 : -1;
      return sortConfig.direction === 'asc' ? result : -result;
    });
  }, [items, sortConfig]);

  const columns = getColumns();

  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case 'available':
      case 'verfügbar':
        return 'text-green-600 dark:text-green-400';
      case 'in use':
      case 'in benutzung':
        return 'text-blue-600 dark:text-blue-400';
      case 'maintenance':
      case 'wartung':
        return 'text-yellow-600 dark:text-yellow-400';
      default:
        return 'text-gray-600 dark:text-gray-400';
    }
  };

  if (items.length === 0) {
    return (
      <div 
        className="text-center py-8 text-muted-foreground"
        role="status"
        aria-label={t('messages.noData')}
      >
        {t('messages.noData')}
      </div>
    );
  }

  return (
    <div 
      className="mt-4 rounded-md border"
      role="region"
      aria-label={t(`categories.${type}`)}
    >
      <Table>
        <TableHeader>
          <TableRow>
            {columns.map((column) => (
              <TableHead 
                key={column.header}
                className={column.sortable ? 'cursor-pointer select-none' : ''}
                onClick={() => column.sortable && typeof column.accessor === 'string' && handleSort(column.accessor)}
                role={column.sortable ? 'button' : undefined}
                aria-sort={
                  sortConfig?.key === column.accessor
                    ? sortConfig.direction === 'asc'
                      ? 'ascending'
                      : 'descending'
                    : undefined
                }
              >
                <div className="flex items-center gap-2">
                  {column.header}
                  {column.sortable && typeof column.accessor === 'string' && (
                    <span className="text-muted-foreground">
                      {sortConfig?.key === column.accessor ? (
                        sortConfig.direction === 'asc' ? (
                          <ChevronUp className="w-4 h-4" aria-hidden="true" />
                        ) : (
                          <ChevronDown className="w-4 h-4" aria-hidden="true" />
                        )
                      ) : (
                        <div className="w-4 h-4" />
                      )}
                    </span>
                  )}
                </div>
              </TableHead>
            ))}
          </TableRow>
        </TableHeader>
        <TableBody>
          {sortedItems.map((item, index) => (
            <TableRow 
              key={item.id || index}
              className={`
                hover:bg-muted/50 cursor-pointer
                ${selectedItem === item.id ? 'bg-muted/50' : ''}
              `}
              onClick={() => setSelectedItem(selectedItem === item.id ? null : item.id)}
              role="row"
              aria-selected={selectedItem === item.id}
              tabIndex={0}
              onKeyDown={(e: React.KeyboardEvent<HTMLTableRowElement>) => {
                if (e.key === 'Enter' || e.key === ' ') {
                  e.preventDefault();
                  setSelectedItem(selectedItem === item.id ? null : item.id);
                }
              }}
            >
              {columns.map((column) => (
                <TableCell key={column.header}>
                  {column.header === t('table.status') ? (
                    <span className={getStatusColor(
                      typeof column.accessor === 'function'
                        ? column.accessor(item)?.toString() || ''
                        : (item[column.accessor] as string) || ''
                    )}>
                      {typeof column.accessor === 'function'
                        ? column.accessor(item)
                        : item[column.accessor]}
                    </span>
                  ) : (
                    typeof column.accessor === 'function'
                      ? column.accessor(item)
                      : item[column.accessor]
                  )}
                </TableCell>
              ))}
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}
