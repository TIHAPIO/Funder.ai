import React from 'react';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Plus, Save, Trash } from 'lucide-react';

interface DataTableProps {
  headers: readonly string[];
  data: any[][];
  onSave?: (data: any[][]) => void;
  onAddRow?: () => void;
  onDeleteRow?: (index: number) => void;
  editable?: boolean;
}

export function DataTable({
  headers,
  data,
  onSave,
  onAddRow,
  onDeleteRow,
  editable = false,
}: DataTableProps) {
  const [localData, setLocalData] = React.useState(data);
  const [hasChanges, setHasChanges] = React.useState(false);

  React.useEffect(() => {
    setLocalData(data);
    setHasChanges(false);
  }, [data]);

  const handleCellChange = (rowIndex: number, colIndex: number, value: string) => {
    const newData = [...localData];
    if (!newData[rowIndex]) {
      newData[rowIndex] = new Array(headers.length).fill('');
    }
    newData[rowIndex][colIndex] = value;
    setLocalData(newData);
    setHasChanges(true);
  };

  const handleSave = () => {
    if (onSave) {
      onSave(localData);
      setHasChanges(false);
    }
  };

  const handleAddRow = () => {
    if (onAddRow) {
      onAddRow();
    } else {
      const newData = [...localData, new Array(headers.length).fill('')];
      setLocalData(newData);
      setHasChanges(true);
    }
  };

  const handleDeleteRow = (index: number) => {
    if (onDeleteRow) {
      onDeleteRow(index);
    } else {
      const newData = localData.filter((_, i) => i !== index);
      setLocalData(newData);
      setHasChanges(true);
    }
  };

  return (
    <div className="space-y-4">
      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              {headers.map((header, index) => (
                <TableHead key={index}>{header}</TableHead>
              ))}
              {editable && <TableHead className="w-[100px]">Aktionen</TableHead>}
            </TableRow>
          </TableHeader>
          <TableBody>
            {localData.map((row, rowIndex) => (
              <TableRow key={rowIndex}>
                {headers.map((_, colIndex) => (
                  <TableCell key={colIndex}>
                    {editable ? (
                      <Input
                        value={row[colIndex] || ''}
                        onChange={(e) =>
                          handleCellChange(rowIndex, colIndex, e.target.value)
                        }
                        className="h-8"
                      />
                    ) : (
                      row[colIndex] || ''
                    )}
                  </TableCell>
                ))}
                {editable && (
                  <TableCell>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleDeleteRow(rowIndex)}
                    >
                      <Trash className="h-4 w-4 text-red-500" />
                    </Button>
                  </TableCell>
                )}
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      {editable && (
        <div className="flex justify-between">
          <Button
            variant="outline"
            size="sm"
            onClick={handleAddRow}
          >
            <Plus className="h-4 w-4 mr-2" />
            Neue Zeile
          </Button>
          {hasChanges && (
            <Button
              size="sm"
              onClick={handleSave}
            >
              <Save className="h-4 w-4 mr-2" />
              Speichern
            </Button>
          )}
        </div>
      )}
    </div>
  );
}
