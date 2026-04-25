'use client'

import React, { ReactNode } from 'react'
import { CaretLeft } from '@phosphor-icons/react'

interface DetailSection {
  title: string
  description?: string
  items: Array<{
    label: string
    value: ReactNode
  }>
}

interface DetailViewLayoutProps {
  title: string
  breadcrumb?: string[]
  mainContent: DetailSection[]
  sidebar?: ReactNode
  onBack?: () => void
  actions?: ReactNode
  children?: ReactNode
}

/**
 * Detail View Template - Two-column info groupings
 * Usage: Shipment tracking details, Title Deed info, Ledger entry views
 */
export function DetailViewLayout({
  title,
  breadcrumb,
  mainContent,
  sidebar,
  onBack,
  actions,
  children,
}: DetailViewLayoutProps) {
  return (
    <div className="min-h-screen bg-surface-100">
      {/* HEADER WITH BREADCRUMB */}
      <div className="border-b border-neutral-200 bg-surface-200 px-5 py-8 shadow-card">
        <div className="flex items-center gap-3">
          {onBack && (
            <button
              onClick={onBack}
              className="inline-flex items-center justify-center rounded-sm text-primary hover:bg-neutral-100 p-2 transition-colors"
              aria-label="Go back"
            >
              <CaretLeft size={24} className="rtl:rotate-180" />
            </button>
          )}
          <div className="flex-1">
            {breadcrumb && breadcrumb.length > 0 && (
              <div className="flex items-center gap-2 text-sm text-neutral-600 mb-3">
                {breadcrumb.map((item, idx) => (
                  <React.Fragment key={idx}>
                    {idx > 0 && <span className="opacity-50">/</span>}
                    <span>{item}</span>
                  </React.Fragment>
                ))}
              </div>
            )}
            <h1 className="text-2xl font-bold text-neutral-900">{title}</h1>
          </div>
          {actions && <div className="flex gap-3">{actions}</div>}
        </div>
      </div>

      {/* MAIN CONTENT */}
      <div className="px-5 py-8">
        <div className="grid grid-cols-1 gap-8 lg:grid-cols-3">
          {/* MAIN COLUMN (2/3 width) */}
          <div className="lg:col-span-2 space-y-6">
            {mainContent.map((section, idx) => (
              <div
                key={idx}
                className="rounded-md border border-neutral-200 bg-surface-200 shadow-card"
              >
                <div className="border-b border-neutral-200 px-6 py-4">
                  <h2 className="text-lg font-semibold text-neutral-900">
                    {section.title}
                  </h2>
                  {section.description && (
                    <p className="mt-1 text-sm text-neutral-600">
                      {section.description}
                    </p>
                  )}
                </div>

                <div className="divide-y divide-neutral-200">
                  {section.items.map((item, itemIdx) => (
                    <div
                      key={itemIdx}
                      className="flex items-start justify-between px-6 py-4 hover:bg-neutral-50"
                    >
                      <label className="text-sm font-semibold text-neutral-600">
                        {item.label}
                      </label>
                      <div className="text-end text-sm text-neutral-900">
                        {item.value}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ))}

            {children}
          </div>

          {/* SIDEBAR (1/3 width) */}
          {sidebar && (
            <div className="lg:col-span-1">
              <div className="sticky top-20 rounded-md border border-neutral-200 bg-surface-200 p-6 shadow-card">
                {sidebar}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
