'use client'

import React, { ReactNode, useState } from 'react'
import { List, X } from '@phosphor-icons/react'

import { SidebarContent } from './RoleSidebar'
import { useLocale } from '@/i18n/LocaleProvider'
import Breadcrumbs from '@/components/shared/Breadcrumbs'
import { LanguageSwitcher } from '@/components/ui/LanguageSwitcher'
import { BottomNav } from './BottomNav'
import { cn } from '@/lib/utils/cn'

type UserRole = 'Visitor' | 'Owner' | 'Gov' | 'Carrier'

interface AppShellProps {
  children: ReactNode
  role: UserRole
  header?: ReactNode
  footer?: ReactNode
  showBottomNav?: boolean
}

/**
 * Master AppShell — Direction-agnostic layout wrapper.
 * SPATIAL spec: 1280px content width, frosted-glass topbar, dark surface mobile overlay.
 */
export function AppShell({
  children,
  role,
  header,
  footer,
  showBottomNav = true,
}: AppShellProps) {
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const { isRTL, t } = useLocale()

  return (
    <div suppressHydrationWarning className="flex h-screen w-full flex-col bg-surface-100 text-neutral-900" dir={isRTL ? 'rtl' : 'ltr'}>

      {/* ── HEADER (TopBar — frosted glass per SPATIAL) ────────────── */}
      <header
          suppressHydrationWarning
          className="ui-topbar ps-5 pe-5 py-4 shrink-0"
      >
          <div className="flex items-center justify-between gap-3 ui-content-container mx-auto">
            <div className="flex items-center gap-3">
              <button
                onClick={() => setSidebarOpen(true)}
                className="md:hidden p-1.5 rounded-sm hover:bg-neutral-100 text-neutral-600 hover:text-neutral-900 transition-all"
                aria-label="Open menu"
              >
                <List size={22} weight="bold" />
              </button>
              <div className="text-start font-bold text-neutral-900 text-lg tracking-tight">
                {header || 'TNA Platform'}
              </div>
            </div>
            <LanguageSwitcher />
          </div>
      </header>

      {/* ── BODY ─────────────────────────────────────────────── */}
      <div className="flex flex-1 overflow-hidden">

        {/* DESKTOP SIDEBAR */}
        <aside className="hidden w-64 shrink-0 border-e border-neutral-200 bg-surface-200 md:flex flex-col">
          <nav className="flex-1 overflow-y-auto px-4 py-8 text-start no-scrollbar">
            <SidebarContent role={role} />
          </nav>
        </aside>

        {/* MAIN CONTENT — constrained to 1280px */}
        <main className="flex-1 min-w-0 overflow-y-auto text-start p-6 md:p-10 pb-28 md:pb-10 no-scrollbar">
          <div className="ui-content-container mx-auto">
            <Breadcrumbs />
            <div className="animate-in slide-in-from-bottom-4 duration-500 fade-in fill-mode-both">
              {children}
            </div>
          </div>
        </main>
      </div>

      {/* MOBILE SIDEBAR — dark surface overlay per SPATIAL */}
      <div className={cn(
          "fixed inset-0 z-50 transition-all duration-300 md:hidden",
          sidebarOpen ? "visible" : "invisible pointer-events-none"
      )}>
          {/* Overlay */}
          <div
            className={cn(
                "absolute inset-0 bg-neutral-900/40 backdrop-blur-sm transition-opacity duration-300",
                sidebarOpen ? "opacity-100" : "opacity-0"
            )}
            onClick={() => setSidebarOpen(false)}
          />
          
          {/* Drawer */}
          <aside
            className={cn(
                "absolute inset-y-0 w-72 bg-surface-200 shadow-modal transition-transform duration-300 ease-out flex flex-col",
                isRTL 
                    ? (sidebarOpen ? "translate-x-0" : "translate-x-full") 
                    : (sidebarOpen ? "translate-x-0" : "-translate-x-full"),
                isRTL ? "right-0" : "left-0"
            )}
          >
            <div className="flex items-center justify-between p-5 border-b border-neutral-100 bg-surface-300">
               <span className="font-bold text-neutral-900 tracking-tight">{t('common.menu')}</span>
               <button 
                    onClick={() => setSidebarOpen(false)} 
                    className="p-1.5 rounded-sm hover:bg-neutral-100 text-neutral-400 hover:text-neutral-700 transition-all"
                >
                  <X size={20} weight="bold" />
               </button>
            </div>
            <nav className="flex-1 overflow-y-auto px-4 py-8 text-start">
              <SidebarContent role={role} />
            </nav>
          </aside>
      </div>

      {/* BOTTOM NAV (Mobile) */}
      {showBottomNav && <BottomNav role={role} />}

      {/* FOOTER */}
      {footer && (
        <footer className="shrink-0 border-t border-neutral-200 bg-surface-200 px-6 py-8 text-start">
          <div className="ui-content-container mx-auto text-caption text-neutral-500">
            {footer}
          </div>
        </footer>
      )}
    </div>
  )
}
