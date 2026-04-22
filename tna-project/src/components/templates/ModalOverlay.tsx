'use client'

import React, { ReactNode, useEffect } from 'react'
import { X } from 'lucide-react'

type ModalSize = 'sm' | 'md' | 'lg' | 'xl'

interface ModalOverlayProps {
  isOpen: boolean
  onClose: () => void
  title: string
  children: ReactNode
  footer?: ReactNode
  size?: ModalSize
  showCloseButton?: boolean
  closeOnBackdropClick?: boolean
  closeOnEscapeKey?: boolean
}

/**
 * Modal Overlay Template - Standardized blurred backdrop dialog
 * Usage: Language toggle, Binding confirmations, Filter settings
 */
export function ModalOverlay({
  isOpen,
  onClose,
  title,
  children,
  footer,
  size = 'md',
  showCloseButton = true,
  closeOnBackdropClick = true,
  closeOnEscapeKey = true,
}: ModalOverlayProps) {
  // Handle escape key
  useEffect(() => {
    if (!isOpen || !closeOnEscapeKey) return

    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onClose()
      }
    }

    document.addEventListener('keydown', handleEscape)
    return () => document.removeEventListener('keydown', handleEscape)
  }, [isOpen, closeOnEscapeKey, onClose])

  // Prevent body scroll when modal is open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden'
    } else {
      document.body.style.overflow = ''
    }

    return () => {
      document.body.style.overflow = ''
    }
  }, [isOpen])

  if (!isOpen) return null

  const getSizeClasses = (size: ModalSize) => {
    switch (size) {
      case 'sm':
        return 'max-w-sm'
      case 'md':
        return 'max-w-md'
      case 'lg':
        return 'max-w-lg'
      case 'xl':
        return 'max-w-xl'
      default:
        return 'max-w-md'
    }
  }

  const sizeClass = getSizeClasses(size)

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      {/* BLURRED BACKDROP */}
      <div
        className="absolute inset-0 bg-black/50 backdrop-blur-sm transition-opacity"
        onClick={() => closeOnBackdropClick && onClose()}
        aria-hidden="true"
      />

      {/* MODAL DIALOG */}
      <div
        className={`relative z-10 rounded-lg border border-neutral-200 bg-surface-200 shadow-modal ${sizeClass}`}
        style={{ width: 'calc(100% - 2.5rem)' }}
        role="dialog"
        aria-modal="true"
        aria-labelledby="modal-title"
      >
        {/* HEADER */}
        <div className="flex items-center justify-between border-b border-neutral-200 px-6 py-4">
          <h2
            id="modal-title"
            className="text-lg font-semibold text-neutral-900"
          >
            {title}
          </h2>
          {showCloseButton && (
            <button
              onClick={onClose}
              className="text-neutral-500 hover:text-neutral-700 transition-colors p-1"
              aria-label="Close modal"
            >
              <X size={20} />
            </button>
          )}
        </div>

        {/* CONTENT */}
        <div className="px-6 py-6">{children}</div>

        {/* FOOTER */}
        {footer && (
          <div className="border-t border-neutral-200 px-6 py-4">
            {footer}
          </div>
        )}
      </div>
    </div>
  )
}
