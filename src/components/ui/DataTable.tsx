// src/components/ui/DataTable.tsx
import React from 'react';

export interface Column<T = any> {
  id: string;
  header: string;
  accessor: keyof T | ((data: T) => React.ReactNode);
  className?: string;
}

interface DataTableProps<T> {
  columns: Column<T>[];
  data: T[];
  keyField: keyof T;
  isLoading?: boolean;
  emptyMessage?: string;
  onRowClick?: (item: T) => void;
  className?: string;
}

function DataTable<T>({
  columns,
  data,
  keyField,
  isLoading = false,
  emptyMessage = 'No data found',
  onRowClick,
  className = '',
}: DataTableProps<T>) {
  if (isLoading) {
    return (
      <div className="w-full bg-white shadow-md rounded-lg border border-gray-200 overflow-hidden">
        <div className="p-4 flex justify-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
        </div>
      </div>
    );
  }

  if (data.length === 0) {
    return (
      <div className="w-full bg-white shadow-md rounded-lg border border-gray-200 overflow-hidden">
        <div className="p-4 text-center text-gray-500">{emptyMessage}</div>
      </div>
    );
  }

  const renderCell = (item: T, column: Column<T>) => {
    if (typeof column.accessor === 'function') {
      return column.accessor(item);
    }
    return String(item[column.accessor] || '');
  };

  return (
    <div className={`w-full bg-white shadow-md rounded-lg border border-gray-200 overflow-hidden ${className}`}>
      <table className="min-w-full divide-y divide-gray-200">
        <thead className="bg-gray-50">
          <tr>
            {columns.map((column) => (
              <th
                key={column.id}
                scope="col"
                className={`px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider ${
                  column.className || ''
                }`}
              >
                {column.header}
              </th>
            ))}
          </tr>
        </thead>
        <tbody className="bg-white divide-y divide-gray-200">
          {data.map((item) => (
            <tr
              key={String(item[keyField])}
              onClick={onRowClick ? () => onRowClick(item) : undefined}
              className={onRowClick ? 'cursor-pointer hover:bg-gray-50' : ''}
            >
              {columns.map((column) => (
                <td
                  key={`${String(item[keyField])}-${column.id}`}
                  className={`px-6 py-4 whitespace-nowrap text-sm text-gray-500 ${
                    column.className || ''
                  }`}
                >
                  {renderCell(item, column)}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default DataTable;