'use client'

import React, { ReactNode, useState } from 'react'
import { Search, ChevronLeft, ChevronRight } from 'lucide-react'

export interface DataTableColumn<T> {
  key: keyof T
  label: string
  width?: string
  render?: (value: any, row: T) => ReactNode
  sortable?: boolean
}

interface DataTableLayoutProps<T extends Record<string, any>> {
  title: string
  columns: DataTableColumn<T>[]
  data: T[]
  onSearch?: (query: string) => void
  onFilter?: (filters: Record<string, any>) => void
  onRowClick?: (row: T) => void
  pageSize?: number
  isLoading?: boolean
  children?: ReactNode
}

/**
 * Data Table Template - Searchable/filterable high-density table
 * Usage: Audit logs, shipment lists, payout records, issuance queues
 */
export function DataTableLayout<T extends Record<string, any>>({
  title,
  columns,
  data,
  onSearch,
  onFilter,
  onRowClick,
  pageSize = 10,
  isLoading = false,
  children,
}: DataTableLayoutProps<T>) {
  const [searchQuery, setSearchQuery] = useState('')
  const [currentPage, setCurrentPage] = useState(1)

  const handleSearch = (query: string) => {
    setSearchQuery(query)
    onSearch?.(query)
    setCurrentPage(1)
  }

  const totalPages = Math.ceil(data.length / pageSize)
  const startIdx = (currentPage - 1) * pageSize
  const paginatedData = data.slice(startIdx, startIdx + pageSize)

  return (
    <div className="min-h-screen bg-surface-100">
      {/* HEADER */}
      <div className="border-b border-neutral-200 bg-surface-200 px-5 py-8 shadow-card">
        <h1 className="text-2xl font-bold text-neutral-900">{title}</h1>
      </div>

      {/* CONTENT */}
      <div className="px-5 py-8">
        {/* FILTER/SEARCH ROW */}
        <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div className="relative flex-1">
            <Search
              size={20}
              className="pointer-events-none absolute start-3 top-3 text-neutral-400"
            />
            <input
              type="text"
              placeholder="Search..."
              value={searchQuery}
              onChange={(e) => handleSearch(e.target.value)}
              className="w-full rounded-sm border border-neutral-300 bg-surface-200 py-2 ps-10 pe-4 text-neutral-900 placeholder-neutral-400 focus:border-brand-secondary focus:outline-none"
            />
          </div>
          {children}
        </div>

        {/* TABLE */}
        <div className="overflow-x-auto rounded-md border border-neutral-200 bg-surface-200 shadow-card">
          <table className="w-full">
            <thead>
              <tr className="border-b border-neutral-200 bg-neutral-100">
                {columns.map((col) => (
                  <th
                    key={String(col.key)}
                    className="px-4 py-3 text-start text-xs font-semibold uppercase text-neutral-600"
                    style={{ width: col.width }}
                  >
                    {col.label}
                    {col.sortable && (
                      <span className="ms-2 inline opacity-50">↕</span>
                    )}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {isLoading ? (
                <tr>
                  <td
                    colSpan={columns.length}
                    className="px-4 py-8 text-center text-neutral-500"
                  >
                    Loading...
                  </td>
                </tr>
              ) : paginatedData.length === 0 ? (
                <tr>
                  <td
                    colSpan={columns.length}
                    className="px-4 py-8 text-center text-neutral-500"
                  >
                    No data found
                  </td>
                </tr>
              ) : (
                paginatedData.map((row, idx) => (
                  <tr
                    key={idx}
                    onClick={() => onRowClick?.(row)}
                    className="border-b border-neutral-100 transition-colors hover:bg-neutral-50"
                  >
                    {columns.map((col) => (
                      <td
                        key={String(col.key)}
                        className="px-4 py-3 text-sm text-neutral-700"
                      >
                        {col.render
                          ? col.render(row[col.key], row)
                          : row[col.key]}
                      </td>
                    ))}
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* PAGINATION */}
        {totalPages > 1 && (
          <div className="mt-6 flex items-center justify-between">
            <p className="text-sm text-neutral-600">
              Page {currentPage} of {totalPages} • {data.length} total records
            </p>
            <div className="flex gap-2">
              <button
                onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                disabled={currentPage === 1}
                className="inline-flex items-center justify-center rounded-sm border border-neutral-300 bg-surface-200 p-2 hover:bg-neutral-100 disabled:opacity-50"
              >
                <ChevronLeft size={18} />
              </button>
              <button
                onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
                disabled={currentPage === totalPages}
                className="inline-flex items-center justify-center rounded-sm border border-neutral-300 bg-surface-200 p-2 hover:bg-neutral-100 disabled:opacity-50"
              >
                <ChevronRight size={18} />
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
