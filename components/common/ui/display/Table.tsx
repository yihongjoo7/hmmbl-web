'use client';
import { ReactNode } from 'react';

interface Column<T> {
  key: keyof T | string;
  header: string;
  render?: (row: T) => ReactNode;
  width?: string;
  align?: 'left' | 'center' | 'right';
}

interface TableProps<T> {
  columns: Column<T>[];
  data: T[];
  rowKey: keyof T;
  onRowClick?: (row: T) => void;
  loading?: boolean;
  emptyText?: string;
}

export function Table<T>({ columns, data, rowKey, onRowClick, loading, emptyText = '데이터가 없습니다.' }: TableProps<T>) {
  if (loading) return <div className="w-full h-32 flex items-center justify-center text-text-disabled text-sm">로딩 중...</div>;
  return (
    <div className="w-full overflow-x-auto">
      <table className="w-full border-collapse text-sm">
        <thead>
          <tr className="border-b border-border-default bg-bg-secondary">
            {columns.map((col) => (
              <th key={String(col.key)} style={{ width: col.width }}
                className={`px-4 py-3 font-semibold text-text-primary text-${col.align ?? 'left'}`}>
                {col.header}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {data.length === 0
            ? <tr><td colSpan={columns.length} className="px-4 py-8 text-center text-text-disabled">{emptyText}</td></tr>
            : data.map((row) => (
              <tr key={String(row[rowKey])}
                onClick={() => onRowClick?.(row)}
                className={`border-b border-border-subtle hover:bg-bg-secondary ${onRowClick ? 'cursor-pointer' : ''}`}>
                {columns.map((col) => (
                  <td key={String(col.key)} className={`px-4 py-3 text-${col.align ?? 'left'}`}>
                    {col.render ? col.render(row) : String((row as any)[col.key] ?? '')}
                  </td>
                ))}
              </tr>
            ))
          }
        </tbody>
      </table>
    </div>
  );
}
