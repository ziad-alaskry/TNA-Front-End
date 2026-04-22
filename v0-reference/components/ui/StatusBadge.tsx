'use client'

import React from 'react'
import { Check, AlertCircle, Clock, XCircle } from 'lucide-react'

type StatusType = 'success' | 'error' | 'warning' | 'pending' | 'info'

interface StatusBadgeProps {
  status: StatusType
  label: string
  showIcon?: boolean
  size?: 'sm' | 'md' | 'lg'
}

const statusConfig = {
  success: {
    bg: 'bg-status-success-bg',
    text: 'text-status-success',
    icon: Check,
  },
  error: {
    bg: 'bg-status-error-bg',
    text: 'text-status-error',
    icon: XCircle,
  },
  warning: {
    bg: 'bg-status-warning-bg',
    text: 'text-status-warning',
    icon: AlertCircle,
  },
  pending: {
    bg: 'bg-status-pending-bg',
    text: 'text-status-pending',
    icon: Clock,
  },
  info: {
    bg: 'bg-status-info-bg',
    text: 'text-status-info',
    icon: AlertCircle,
  },
}

const sizeConfig = {
  sm: {
    padding: 'px-2 py-1',
    text: 'text-xs',
    icon: 14,
  },
  md: {
    padding: 'px-3 py-1.5',
    text: 'text-sm',
    icon: 16,
  },
  lg: {
    padding: 'px-4 py-2',
    text: 'text-base',
    icon: 18,
  },
}

/**
 * Status Badge - Reusable status indicator with icon
 * Usage: Table status columns, timeline items, result states
 */
export function StatusBadge({
  status,
  label,
  showIcon = true,
  size = 'md',
}: StatusBadgeProps) {
  const config = statusConfig[status]
  const sizeClass = sizeConfig[size]
  const IconComponent = config.icon

  return (
    <div
      className={`inline-flex items-center gap-1.5 rounded-sm font-semibold ${config.bg} ${config.text} ${sizeClass.padding} ${sizeClass.text}`}
    >
      {showIcon && (
        <IconComponent size={sizeClass.icon as number} className="flex-shrink-0" />
      )}
      <span>{label}</span>
    </div>
  )
}
