'use client';

import { Table } from "./table";
import { ResourceItem } from "@/app/resources/types";

interface ResourceTableProps {
  items: ResourceItem[];
  type: string;
}

export function ResourceTable({ items, type }: ResourceTableProps) {
  // Define columns based on resource type
  const getColumns = () => {
    switch (type) {
      case 'car':
        return [
          { header: 'Name', accessor: 'name' },
          { header: 'Status', accessor: 'status' },
          { header: 'Kampagne', accessor: 'campaign' },
          { header: 'Notizen', accessor: 'notes' },
          { header: 'Quelle', accessor: 'source' },
        ];
      case 'district':
        return [
          { header: 'Name', accessor: 'name' },
          { header: 'Status', accessor: 'status' },
          { header: 'Kapazität', accessor: 'capacity' },
          { header: 'Kontakt', accessor: 'contact' },
        ];
      case 'employee':
        return [
          { header: 'Name', accessor: 'name' },
          { header: 'Status', accessor: 'status' },
          { header: 'Kampagne', accessor: 'campaign' },
          { header: 'Shirt', accessor: (item) => item.clothingSizes?.shirt },
          { header: 'Jacke', accessor: (item) => item.clothingSizes?.jacket },
          { header: 'Hose', accessor: (item) => item.clothingSizes?.pants },
        ];
      case 'tablet':
      case 'equipment':
        return [
          { header: 'Name', accessor: 'name' },
          { header: 'Status', accessor: 'status' },
          { header: 'Zugewiesen an', accessor: 'assignedTo' },
          { header: 'Seriennummer', accessor: 'serialNumber' },
        ];
      case 'clothing':
        return [
          { header: 'Typ', accessor: 'itemType' },
          { header: 'S', accessor: (item) => item.sizes?.S },
          { header: 'M', accessor: (item) => item.sizes?.M },
          { header: 'L', accessor: (item) => item.sizes?.L },
          { header: 'XL', accessor: (item) => item.sizes?.XL },
        ];
      case 'accommodation':
        return [
          { header: 'Name', accessor: 'name' },
          { header: 'Standort', accessor: 'location' },
          { header: 'Kapazität', accessor: (item) => `${item.capacity} Personen` },
          { header: 'Kampagne', accessor: 'campaign' },
          { header: 'Kontakt', accessor: 'contact' },
        ];
      default:
        return [];
    }
  };

  const columns = getColumns();

  return (
    <div className="mt-4 rounded-md border">
      <Table>
        <Table.Header>
          <Table.Row>
            {columns.map((column) => (
              <Table.Head key={column.header}>{column.header}</Table.Head>
            ))}
          </Table.Row>
        </Table.Header>
        <Table.Body>
          {items.map((item, index) => (
            <Table.Row key={index}>
              {columns.map((column) => (
                <Table.Cell key={column.header}>
                  {typeof column.accessor === 'function'
                    ? column.accessor(item)
                    : item[column.accessor]}
                </Table.Cell>
              ))}
            </Table.Row>
          ))}
        </Table.Body>
      </Table>
    </div>
  );
}
