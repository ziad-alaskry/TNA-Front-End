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
}

/**
 * Dashboard Template - Role-based stats grid + activity timeline
 * Usage: Tracking hub for all roles (Visitor TNA progress, Owner earnings, Carrier fleet stats)
 */
export function DashboardLayout({
  title,
  subtitle,
  stats = [],
  activity = [],
  children,
  onStatClick,
}: DashboardLayoutProps) {
  const getStatusColor = (status?: string) => {
    switch (status) {
      case 'success':
        return 'bg-status-success-bg border-s-4 border-status-success'
      case 'pending':
        return 'bg-status-pending-bg border-s-4 border-status-pending'
      case 'error':
        return 'bg-status-error-bg border-s-4 border-status-error'
      default:
        return 'bg-surface-200'
    }
  }

  return (
    <div className="min-h-screen bg-surface-100">
      {/* HEADER SECTION */}
      <div className="border-b border-neutral-200 bg-surface-200 px-5 py-8 shadow-card">
        <h1 className="text-3xl font-bold text-neutral-900">
          {title}
        </h1>
        {subtitle && (
          <p className="mt-2 text-neutral-500">{subtitle}</p>
        )}
      </div>

      {/* CONTENT */}
      <div className="px-5 py-8">
        {/* STATS GRID */}
        {stats.length > 0 && (
          <div className="mb-12">
            <h2 className="mb-6 text-lg font-semibold text-neutral-900">
              Key Metrics
            </h2>
            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
              {stats.map((stat, idx) => (
                <button
                  key={idx}
                  onClick={() => onStatClick?.(stat)}
                  className="rounded-md border border-neutral-200 bg-surface-200 p-6 shadow-card transition-all hover:shadow-modal hover:border-brand-secondary"
                >
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-xs font-semibold uppercase text-neutral-600">
                        {stat.label}
                      </p>
                      <p className="mt-3 text-2xl font-bold text-neutral-900">
                        {stat.value}
                      </p>
                      {stat.change && (
                        <p className="mt-2 text-xs text-neutral-500">
                          {stat.change}
                        </p>
                      )}
                    </div>
                    {stat.icon && (
                      <div className="text-brand-secondary">{stat.icon}</div>
                    )}
                  </div>
                </button>
              ))}
            </div>
          </div>
        )}

        {/* ACTIVITY SECTION */}
        {activity.length > 0 && (
          <div className="mb-12">
            <h2 className="mb-6 text-lg font-semibold text-neutral-900">
              Recent Activity
            </h2>
            <div className="space-y-4">
              {activity.map((item) => (
                <div
                  key={item.id}
                  className={`rounded-md p-4 transition-colors ${getStatusColor(item.status)}`}
                >
                  <div className="flex items-start justify-between">
                    <div>
                      <h3 className="font-semibold text-neutral-900">
                        {item.title}
                      </h3>
                      {item.description && (
                        <p className="mt-1 text-sm text-neutral-600">
                          {item.description}
                        </p>
                      )}
                    </div>
                    {item.timestamp && (
                      <p className="text-xs text-neutral-500">
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
