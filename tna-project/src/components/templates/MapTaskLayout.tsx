'use client'

import React, { ReactNode } from 'react'
import { X } from 'lucide-react'

interface MapTaskLayoutProps {
  mapComponent: ReactNode
  taskCard?: ReactNode
  onTaskClose?: () => void
  showTaskCard?: boolean
  taskPosition?: 'bottom-right' | 'bottom-left' | 'top-right' | 'top-left'
  children?: ReactNode
}

/**
 * Map Task Template - Full-screen map with floating overlay task card
 * Usage: Driver delivery routes, Owner property geolocation
 */
export function MapTaskLayout({
  mapComponent,
  taskCard,
  onTaskClose,
  showTaskCard = true,
  taskPosition = 'bottom-right',
  children,
}: MapTaskLayoutProps) {
  const getPositionClasses = (position: string) => {
    switch (position) {
      case 'bottom-left':
        return 'bottom-6 start-6'
      case 'top-right':
        return 'top-6 end-6'
      case 'top-left':
        return 'top-6 start-6'
      case 'bottom-right':
      default:
        return 'bottom-6 end-6'
    }
  }

  const positionClasses = getPositionClasses(taskPosition)

  return (
    <div className="relative h-screen w-full overflow-hidden bg-neutral-100">
      {/* FULL-BLEED MAP BACKGROUND */}
      <div className="absolute inset-0 h-full w-full">
        {mapComponent}
      </div>

      {/* FLOATING TASK CARD */}
      {showTaskCard && taskCard && (
        <div
          className={`absolute ${positionClasses} z-40 w-full max-w-sm rounded-md border border-neutral-200 bg-surface-200 p-6 shadow-modal`}
        >
          <div className="flex items-start justify-between">
            <div className="flex-1">{taskCard}</div>
            <button
              onClick={onTaskClose}
              className="ps-3 text-neutral-500 hover:text-neutral-700 transition-colors"
              aria-label="Close task card"
            >
              <X size={20} />
            </button>
          </div>
        </div>
      )}

      {/* OVERLAY CONTROLS (if any) */}
      {children && (
        <div className="absolute inset-0 z-30 pointer-events-none flex items-center justify-center">
          <div className="pointer-events-auto">{children}</div>
        </div>
      )}

      {/* GRADIENT OVERLAY for bottom actions area */}
      <div className="pointer-events-none absolute bottom-0 inset-x-0 h-32 bg-gradient-to-t from-black/20 to-transparent" />
    </div>
  )
}
