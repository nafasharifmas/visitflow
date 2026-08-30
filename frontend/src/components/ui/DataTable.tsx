import type { ReactNode } from 'react'
import { cn } from '@/lib/utils'

export type Column<T> = {
  key: string
  header: ReactNode
  align?: 'left' | 'center' | 'right'
  render?: (row: T) => ReactNode
  className?: string
}

type DataTableProps<T> = {
  columns: Column<T>[]
  rows: T[]
  rowKey: (row: T) => string | number
  onRowClick?: (row: T) => void
  emptyMessage?: string
  className?: string
  dense?: boolean
}

const alignClass = { left: 'text-left', center: 'text-center', right: 'text-right' }

export function DataTable<T>({ columns, rows, rowKey, onRowClick, emptyMessage = 'No records found', className, dense = false }: DataTableProps<T>) {
  const cellPad = dense ? 'px-4 py-2.5' : 'px-5 py-3.5'

  return (
    <div className={cn('overflow-x-auto rounded-xl border border-stone-200 bg-white shadow-xs', className)}>
      <table className="w-full border-collapse text-sm">
        <thead>
          <tr className="border-b border-stone-200 bg-stone-50">
            {columns.map((col) => (
              <th
                key={col.key}
                className={cn(cellPad, 'text-xs font-semibold uppercase tracking-wide text-stone-500', alignClass[col.align ?? 'left'])}
              >
                {col.header}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {rows.length === 0 ? (
            <tr>
              <td colSpan={columns.length} className="px-6 py-10 text-center text-sm text-stone-400">
                {emptyMessage}
              </td>
            </tr>
          ) : (
            rows.map((row) => (
              <tr
                key={rowKey(row)}
                onClick={onRowClick ? () => onRowClick(row) : undefined}
                className={cn(
                  'border-b border-stone-100 last:border-b-0',
                  onRowClick ? 'cursor-pointer transition-colors hover:bg-stone-50' : '',
                )}
              >
                {columns.map((col) => (
                  <td key={col.key} className={cn(cellPad, 'text-stone-700', alignClass[col.align ?? 'left'], col.className)}>
                    {col.render ? col.render(row) : (row as Record<string, unknown>)[col.key] as ReactNode}
                  </td>
                ))}
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  )
}
