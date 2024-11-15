'use client';

import React, { useState, useEffect, useCallback } from 'react';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "./table";
import { Input } from "./input";
import { Button } from "./button";
import { Plus, Save, Trash, AlertCircle } from 'lucide-react';
import { useTranslation } from '../../hooks/useTranslation';

interface DataTableProps {
  headers: readonly string[];
  data: (string | number)[][];
  onSave?: (data: (string | number)[][]) => void;
  onAddRow?: () => void;
  onDeleteRow?: (index: number) => void;
  editable?: boolean;
  ariaLabel?: string;
}

export function DataTable({
  headers,
  data,
  onSave,
  onAddRow,
  onDeleteRow,
  editable = false,
  ariaLabel,
}: DataTableProps) {
  const { t } = useTranslation('common');
  const [localData, setLocalData] = useState(data);
  const [hasChanges, setHasChanges] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [focusedCell, setFocusedCell] = useState<{ row: number; col: number } | null>(null);

  useEffect(() => {
    setLocalData(data);
    setHasChanges(false);
    setError(null);
  }, [data]);

  const handleCellChange = useCallback((rowIndex: number, colIndex: number, value: string) => {
    try {
      const newData = [...localData];
      if (!newData[rowIndex]) {
        newData[rowIndex] = new Array(headers.length).fill('');
      }
      newData[rowIndex][colIndex] = value;
      setLocalData(newData);
      setHasChanges(true);
      setError(null);
    } catch (err) {
      setError(t('errors.updateFailed'));
    }
  }, [localData, headers.length, t]);

  const handleSave = useCallback(async () => {
    try {
      if (onSave) {
        await onSave(localData);
        setHasChanges(false);
        setError(null);
      }
    } catch (err) {
      setError(t('errors.saveFailed'));
    }
  }, [localData, onSave, t]);

  const handleAddRow = useCallback(() => {
    try {
      if (onAddRow) {
        onAddRow();
      } else {
        const newData = [...localData, new Array(headers.length).fill('')];
        setLocalData(newData);
        setHasChanges(true);
      }
      setError(null);
    } catch (err) {
      setError(t('errors.addRowFailed'));
    }
  }, [localData, headers.length, onAddRow, t]);

  const handleDeleteRow = useCallback((index: number) => {
    try {
      if (onDeleteRow) {
        onDeleteRow(index);
      } else {
        const newData = localData.filter((_, i) => i !== index);
        setLocalData(newData);
        setHasChanges(true);
      }
      setError(null);
    } catch (err) {
      setError(t('errors.deleteRowFailed'));
    }
  }, [localData, onDeleteRow, t]);

  const handleKeyDown = useCallback((e: React.KeyboardEvent, rowIndex: number, colIndex: number) => {
    if (!focusedCell) return;

    switch (e.key) {
      case 'ArrowUp':
        e.preventDefault();
        if (rowIndex > 0) {
          setFocusedCell({ row: rowIndex - 1, col: colIndex });
        }
        break;
      case 'ArrowDown':
        e.preventDefault();
        if (rowIndex < localData.length - 1) {
          setFocusedCell({ row: rowIndex + 1, col: colIndex });
        }
        break;
      case 'ArrowLeft':
        if (colIndex > 0) {
          setFocusedCell({ row: rowIndex, col: colIndex - 1 });
        }
        break;
      case 'ArrowRight':
        if (colIndex < headers.length - 1) {
          setFocusedCell({ row: rowIndex, col: colIndex + 1 });
        }
        break;
      case 'Delete':
        if (e.ctrlKey || e.metaKey) {
          e.preventDefault();
          handleDeleteRow(rowIndex);
        }
        break;
    }
  }, [focusedCell, localData.length, headers.length, handleDeleteRow]);

  return (
    <div 
      className="space-y-4"
      role="region"
      aria-label={ariaLabel || t('table.dataTable')}
    >
      {error && (
        <div 
          className="bg-destructive/10 text-destructive px-4 py-2 rounded-md flex items-center gap-2"
          role="alert"
        >
          <AlertCircle className="h-4 w-4" />
          <span>{error}</span>
        </div>
      )}
      
      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              {headers.map((header, index) => (
                <TableHead key={index} scope="col">
                  {header}
                </TableHead>
              ))}
              {editable && (
                <TableHead className="w-[100px]" scope="col">
                  {t('table.actions')}
                </TableHead>
              )}
            </TableRow>
          </TableHeader>
          <TableBody>
            {localData.map((row, rowIndex) => (
              <TableRow key={rowIndex}>
                {headers.map((_, colIndex) => (
                  <TableCell key={colIndex}>
                    {editable ? (
                      <Input
                        value={row[colIndex]?.toString() || ''}
                        onChange={(e) =>
                          handleCellChange(rowIndex, colIndex, e.target.value)
                        }
                        onFocus={() => setFocusedCell({ row: rowIndex, col: colIndex })}
                        onKeyDown={(e) => handleKeyDown(e, rowIndex, colIndex)}
                        className="h-8"
                        aria-label={`${headers[colIndex]} ${t('table.row')} ${rowIndex + 1}`}
                      />
                    ) : (
                      row[colIndex]?.toString() || ''
                    )}
                  </TableCell>
                ))}
                {editable && (
                  <TableCell>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleDeleteRow(rowIndex)}
                      aria-label={`${t('table.deleteRow')} ${rowIndex + 1}`}
                    >
                      <Trash className="h-4 w-4 text-destructive" />
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
            aria-label={t('table.addRow')}
          >
            <Plus className="h-4 w-4 mr-2" aria-hidden="true" />
            {t('table.addRow')}
          </Button>
          {hasChanges && (
            <Button
              size="sm"
              onClick={handleSave}
              aria-label={t('table.saveChanges')}
            >
              <Save className="h-4 w-4 mr-2" aria-hidden="true" />
              {t('table.saveChanges')}
            </Button>
          )}
        </div>
      )}
    </div>
  );
}
