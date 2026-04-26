'use client'

import React, { ReactNode, useState } from 'react'
import { MagnifyingGlass, CaretLeft, CaretRight, ArrowsDownUp } from '@phosphor-icons/react'
import { useLocale } from '@/i18n/LocaleProvider'
import MirrorIcon from '@/components/shared/MirrorIcon'
import { SkeletonTableRow } from '@/components/ui/SkeletonCard'
import EmptyState from '@/components/ui/EmptyState'
import { cn } from '@/lib/utils/cn'

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
  actions?: ReactNode
  pageSize?: number
  isLoading?: boolean
  children?: ReactNode
}

/**
 * Data Table Template - Searchable/filterable high-density table
 * SPATIAL spec: neutral palette, shadow-card, proper border tokens
 */
export default function DataTableLayout<T extends Record<string, any>>({
  title,
  columns,
  data,
  onSearch,
  onFilter,
  onRowClick,
  actions,
  pageSize = 10,
  isLoading = false,
  children,
}: DataTableLayoutProps<T>) {
  const { t } = useLocale()
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
    <div className="flex flex-col gap-8">
      {/* HEADER SECTION */}
      <div className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
        <div>
          <h1 className="text-display font-bold text-neutral-900 mb-1">{title}</h1>
          <p className="text-body text-neutral-500">
            {t('common.total_records').replace('{count}', String(data.length))}
          </p>
        </div>
        
        {/* Actions/Filters */}
        <div className="flex flex-wrap items-center gap-3">
            {actions}
            <div className="relative min-w-[240px]">
                <MagnifyingGlass
                    size={20}
                    className="pointer-events-none absolute start-4 top-1/2 -translate-y-1/2 text-neutral-400"
                />
                <input
                    type="text"
                    placeholder={t('common.search_placeholder')}
                    value={searchQuery}
                    onChange={(e) => handleSearch(e.target.value)}
                    className="w-full h-11 rounded-sm border border-neutral-200 bg-surface-200 ps-12 pe-4 text-body text-neutral-900 placeholder-neutral-400 focus:border-primary focus:ring-2 focus:ring-primary/10 transition-all outline-none"
                />
            </div>
            {children}
        </div>
      </div>

      {/* TABLE CONTAINER */}
      <div className="overflow-hidden rounded-md border border-neutral-200 bg-surface-200 shadow-card">
        <div className="overflow-x-auto no-scrollbar">
          <table className="w-full text-start border-collapse">
            <thead>
              <tr className="border-b border-neutral-200 bg-neutral-50/50">
                {columns.map((col) => (
                  <th
                    key={String(col.key)}
                    className="whitespace-nowrap px-6 py-4 text-start text-caption font-bold uppercase text-neutral-500 tracking-wider"
                    style={{ width: col.width }}
                  >
                    <div className="flex items-center gap-2">
                        {col.label}
                        {col.sortable && (
                        <ArrowsDownUp size={14} weight="bold" className="text-neutral-400" />
                        )}
                    </div>
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-neutral-100">
              {isLoading ? (
                Array.from({ length: 5 }).map((_, i) => (
                    <SkeletonTableRow key={i} cols={columns.length} />
                ))
              ) : paginatedData.length === 0 ? (
                <tr>
                  <td colSpan={columns.length} className="px-6 py-16">
                    <EmptyState 
                        compact 
                        title={t('common.no_data')} 
                        description={t('common.no_data_desc') ?? 'No records found matching your criteria.'}
                    />
                  </td>
                </tr>
              ) : (
                paginatedData.map((row, idx) => (
                  <tr
                    key={idx}
                    onClick={() => onRowClick?.(row)}
                    className={cn(
                        "transition-all duration-200 hover:bg-neutral-50/80 group",
                        onRowClick && 'cursor-pointer'
                    )}
                  >
                    {columns.map((col) => (
                      <td
                        key={String(col.key)}
                        className="px-6 py-4 text-body text-neutral-700 group-hover:text-neutral-900 whitespace-nowrap"
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

        {/* PAGINATION FOOTER */}
        {totalPages > 1 && (
          <div className="flex items-center justify-between border-t border-neutral-100 px-6 py-4 bg-neutral-50/30">
            <p className="text-caption text-neutral-400 font-medium font-mono">
              {t('common.page_of')
                .replace('{current}', String(currentPage))
                .replace('{total}', String(totalPages))}
            </p>
            <div className="flex items-center gap-2">
              <button
                onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                disabled={currentPage === 1}
                className="flex items-center justify-center h-10 w-10 rounded-sm border border-neutral-200 bg-white text-neutral-600 hover:bg-neutral-100 disabled:opacity-30 disabled:hover:bg-white transition-all shadow-sm"
              >
                <MirrorIcon>
                    <CaretLeft size={18} weight="bold" />
                </MirrorIcon>
              </button>
              
              <div className="flex px-1 gap-1">
                  {[...Array(totalPages)].map((_, i) => (
                      <div 
                        key={i} 
                        className={cn(
                            "h-1.5 rounded-full transition-all duration-300",
                            currentPage === i + 1 ? "w-4 bg-primary" : "w-1.5 bg-neutral-200"
                        )}
                      />
                  ))}
              </div>

              <button
                onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
                disabled={currentPage === totalPages}
                className="flex items-center justify-center h-10 w-10 rounded-sm border border-neutral-200 bg-white text-neutral-600 hover:bg-neutral-100 disabled:opacity-30 disabled:hover:bg-white transition-all shadow-sm"
              >
                <MirrorIcon>
                    <CaretRight size={18} weight="bold" />
                </MirrorIcon>
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
