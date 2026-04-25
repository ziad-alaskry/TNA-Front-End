'use client'

import React, { ReactNode } from 'react'

interface StatCard {
  label: string
  value: string | number
  change?: string
  icon?: ReactNode
}

interface ActivityItem {
  id: string
  title: string
  description?: string
  timestamp?: string
  status?: 'success' | 'pending' | 'error'
}

interface DashboardLayoutProps {
  title: string
  subtitle?: string
  stats?: StatCard[]
  activity?: ActivityItem[]
  children?: ReactNode
  onStatClick?: (stat: StatCard) => void
  isLoading?: boolean
  error?: string
  onRetry?: () => void
}

/**
 * Dashboard Template - Role-based stats grid + activity timeline
 * SPATIAL spec: neutral palette, shadow-card, proper border tokens
 */
import { SkeletonStatsGrid } from '@/components/ui/SkeletonCard'
import ErrorAlert, { PageError } from '@/components/ui/ErrorAlert'

export function DashboardLayout({
  title,
  subtitle,
  stats = [],
  activity = [],
  children,
  onStatClick,
  isLoading = false,
  error,
  onRetry,
}: DashboardLayoutProps) {
  if (error) {
    return <PageError message={error} onRetry={onRetry} />
  }

  const getStatusColor = (status?: string) => {
    switch (status) {
      case 'success':
        return 'bg-success-bg border-s-4 border-success'
      case 'pending':
        return 'bg-pending-bg border-s-4 border-pending'
      case 'error':
        return 'bg-error-bg border-s-4 border-error'
      default:
        return 'bg-surface-200'
    }
  }

  return (
    <div className="min-h-screen bg-surface-100">
      {/* HEADER SECTION */}
      <div className="border-b border-neutral-200 bg-surface-200 px-5 py-8 shadow-card">
        <h1 className="text-display text-neutral-900">
          {title}
        </h1>
        {subtitle && (
          <p className="mt-2 text-body text-neutral-500">{subtitle}</p>
        )}
      </div>

      {/* CONTENT */}
      <div className="px-5 py-8">
        {/* STATS GRID */}
        {(isLoading || stats.length > 0) && (
          <div className="mb-12">
            {isLoading ? (
              <SkeletonStatsGrid count={4} />
            ) : (
              <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
                {stats.map((stat, idx) => (
                  <button
                    key={idx}
                    onClick={() => onStatClick?.(stat)}
                    className="rounded-md border border-neutral-200 bg-surface-200 p-6 shadow-card transition-all hover:shadow-modal hover:border-primary/40 text-start group"
                  >
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-caption font-bold uppercase text-neutral-500 tracking-wider">
                          {stat.label}
                        </p>
                        <p className="mt-2 text-heading text-neutral-900">
                          {stat.value}
                        </p>
                        {stat.change && (
                          <p className="mt-2 text-caption text-neutral-400">
                            {stat.change}
                          </p>
                        )}
                      </div>
                      {stat.icon && (
                        <div className="text-neutral-300 group-hover:text-primary transition-colors">{stat.icon}</div>
                      )}
                    </div>
                  </button>
                ))}
              </div>
            )}
          </div>
        )}

        {/* ACTIVITY SECTION */}
        {activity.length > 0 && (
          <div className="mb-12">
            <div className="space-y-3">
              {activity.map((item) => (
                <div
                  key={item.id}
                  className={`rounded-md p-4 transition-colors ${getStatusColor(item.status)}`}
                >
                  <div className="flex items-start justify-between">
                    <div>
                      <h3 className="font-bold text-neutral-900 text-body">
                        {item.title}
                      </h3>
                      {item.description && (
                        <p className="mt-1 text-caption text-neutral-600">
                          {item.description}
                        </p>
                      )}
                    </div>
                    {item.timestamp && (
                      <p className="text-caption text-neutral-400 whitespace-nowrap ms-4">
                        {item.timestamp}
                      </p>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* CUSTOM CONTENT */}
        {children}
      </div>
    </div>
  )
}
