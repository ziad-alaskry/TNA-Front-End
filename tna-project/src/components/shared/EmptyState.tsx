'use client'

import React from 'react'
import Button from '@/components/ui/Button'
import { LucideIcon } from 'lucide-react'

interface EmptyStateProps {
  icon: LucideIcon
  title: string
  description: string
  actionLabel?: string
  onAction?: () => void
}

export default function EmptyState({
  icon: Icon,
  title,
  description,
  actionLabel,
  onAction
}: EmptyStateProps) {
  return (
    <div className="flex flex-col items-center justify-center rounded-lg border border-dashed border-slate-300 bg-slate-50 p-12 text-center animate-in fade-in duration-500">
      <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-slate-100 text-slate-400">
        <Icon size={32} />
      </div>
      <h3 className="text-lg font-bold text-slate-900 font-rubik">{title}</h3>
      <p className="mt-2 max-w-sm text-sm text-slate-500 font-rubik leading-relaxed">
        {description}
      </p>
      {actionLabel && onAction && (
        <Button
          onClick={onAction}
          className="mt-6 bg-primitive-navy text-white rounded-md shadow-sm"
        >
          {actionLabel}
        </Button>
      )}
    </div>
  )
}
