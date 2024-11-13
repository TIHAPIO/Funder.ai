import { useState, useEffect } from 'react';
import { SheetCategory } from '@/app/resources/types';

export function useSheets(category: SheetCategory | '') {
  const [data, setData] = useState<any[][]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [spreadsheetId, setSpreadsheetId] = useState<string | null>(null);

  useEffect(() => {
    if (category) {
      fetchData();
    } else {
      setData([]);
      setLoading(false);
      setError(null);
      setSpreadsheetId(null);
    }
  }, [category]);

  const fetchData = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const response = await fetch(`/api/sheets?action=getData&category=${category}`);
      const result = await response.json();
      
      if (result.success) {
        setData(result.data);
        // Set spreadsheetId for both new and existing sheets
        if (result.spreadsheetId) {
          setSpreadsheetId(result.spreadsheetId);
        }
      } else {
        setError(result.error || 'Failed to fetch data');
      }
    } catch (err) {
      setError('Error fetching data');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const updateData = async (values: any[][]) => {
    if (!spreadsheetId) {
      console.error('No spreadsheet ID available');
      return;
    }

    try {
      const response = await fetch('/api/sheets', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          spreadsheetId,
          range: 'Daten',
          values,
        }),
      });

      const result = await response.json();
      
      if (result.success) {
        setData(values);
      } else {
        throw new Error(result.error || 'Failed to update data');
      }
    } catch (err) {
      console.error('Error updating data:', err);
      throw err;
    }
  };

  return {
    data,
    loading,
    error,
    updateData,
    refreshData: fetchData,
  };
}
