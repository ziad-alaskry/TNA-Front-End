'use client'

import React, { createContext, useCallback, useContext, useEffect, useRef, useState } from 'react'
import { CheckCircle, WarningCircle, Info, X } from '@phosphor-icons/react'
import { cn } from '@/lib/utils/cn'

// ─── Types ────────────────────────────────────────────────
export type ToastVariant = 'success' | 'error' | 'warning' | 'info'

export interface Toast {
    id: string
    message: string
    title?: string
    variant: ToastVariant
    duration?: number
}

interface ToastContextValue {
    toast: (options: Omit<Toast, 'id'>) => void
    success: (message: string, title?: string) => void
    error: (message: string, title?: string) => void
    warning: (message: string, title?: string) => void
    info: (message: string, title?: string) => void
    dismiss: (id: string) => void
}

// ─── Context ──────────────────────────────────────────────
const ToastContext = createContext<ToastContextValue | null>(null)

// ─── Toast Item Component ─────────────────────────────────
const VARIANT_STYLES: Record<ToastVariant, { container: string; icon: string; IconComponent: typeof CheckCircle }> = {
    success: {
        container: 'bg-success-light border-success/20 text-success',
        icon: 'text-success',
        IconComponent: CheckCircle,
    },
    error: {
        container: 'bg-error-light border-error/20 text-error',
        icon: 'text-error',
        IconComponent: WarningCircle,
    },
    warning: {
        container: 'bg-warning-light border-warning/20 text-warning',
        icon: 'text-warning',
        IconComponent: WarningCircle,
    },
    info: {
        container: 'bg-info-light border-info/20 text-info',
        icon: 'text-info',
        IconComponent: Info,
    },
}

function ToastItem({ toast, onDismiss }: { toast: Toast; onDismiss: (id: string) => void }) {
    const [visible, setVisible] = useState(false)
    const { container, icon, IconComponent } = VARIANT_STYLES[toast.variant]

    // slide-in on mount
    useEffect(() => {
        const t = setTimeout(() => setVisible(true), 10)
        return () => clearTimeout(t)
    }, [])

    const handleDismiss = useCallback(() => {
        setVisible(false)
        setTimeout(() => onDismiss(toast.id), 200)
    }, [onDismiss, toast.id])

    // auto-dismiss
    useEffect(() => {
        const duration = toast.duration ?? 4000
        const t = setTimeout(handleDismiss, duration)
        return () => clearTimeout(t)
    }, [toast.id, toast.duration, handleDismiss])

    return (
        <div
            className={cn(
                'flex items-start gap-4 p-5 rounded-lg border shadow-popover max-w-sm w-full backdrop-blur-sm',
                'transition-all duration-fast',
                visible ? 'opacity-100 translate-y-0 scale-100' : 'opacity-0 translate-y-2 scale-95',
                container
            )}
            role="alert"
            aria-live="polite"
        >
            <IconComponent size={24} weight="fill" className={cn('shrink-0 mt-0.5', icon)} />
            <div className="flex-1 min-w-0">
                {toast.title && (
                    <p className="text-sm font-bold mb-1 text-text-primary">{toast.title}</p>
                )}
                <p className="text-sm font-medium text-text-secondary leading-relaxed ps-0.5">{toast.message}</p>
            </div>
            <button
                onClick={handleDismiss}
                className="shrink-0 text-text-placeholder hover:text-text-primary transition-colors"
                aria-label="إغلاق"
            >
                <X size={18} weight="bold" />
            </button>
        </div>
    )
}

// ─── Provider ─────────────────────────────────────────────
export function ToastProvider({ children }: { children: React.ReactNode }) {
    const [toasts, setToasts] = useState<Toast[]>([])
    const counterRef = useRef(0)

    const dismiss = useCallback((id: string) => {
        setToasts((prev) => prev.filter((t) => t.id !== id))
    }, [])

    const toast = useCallback((options: Omit<Toast, 'id'>) => {
        const id = `toast-${++counterRef.current}`
        setToasts((prev) => [...prev.slice(-4), { ...options, id }]) // max 5 toasts
    }, [])

    const success = useCallback((message: string, title?: string) => toast({ variant: 'success', message, title }), [toast])
    const error   = useCallback((message: string, title?: string) => toast({ variant: 'error', message, title }), [toast])
    const warning = useCallback((message: string, title?: string) => toast({ variant: 'warning', message, title }), [toast])
    const info    = useCallback((message: string, title?: string) => toast({ variant: 'info', message, title }), [toast])

    return (
        <ToastContext.Provider value={{ toast, success, error, warning, info, dismiss }}>
            {children}
            {/* Toast Viewport — fixed bottom-right (RTL-aware) */}
            <div
                className="fixed bottom-20 md:bottom-6 inset-x-4 md:inset-x-auto md:end-6 z-[200] flex flex-col items-end gap-3 pointer-events-none"
                aria-label="Notifications"
            >
                {toasts.map((t) => (
                    <div key={t.id} className="pointer-events-auto w-full md:w-auto">
                        <ToastItem toast={t} onDismiss={dismiss} />
                    </div>
                ))}
            </div>
        </ToastContext.Provider>
    )
}

// ─── Hook ─────────────────────────────────────────────────
export function useToast(): ToastContextValue {
    const ctx = useContext(ToastContext)
    if (!ctx) throw new Error('useToast must be used within ToastProvider')
    return ctx
}
