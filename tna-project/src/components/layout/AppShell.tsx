'use client'

import React, { ReactNode, useState } from 'react'
import { Menu, X } from 'lucide-react'

import { SidebarContent } from './RoleSidebar'
import { useLocale } from '@/i18n/LocaleProvider'
import Breadcrumbs from '@/components/shared/Breadcrumbs'
import { LanguageSwitcher } from '@/components/ui/LanguageSwitcher'
import { BottomNav } from './BottomNav'

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

      {/* ── HEADER (TopBar) ────────────────────────────────────────── */}
      {header ? (
        <header
          suppressHydrationWarning
          className="ui-topbar ps-5 pe-5 py-4 shadow-sm"
        >
          <div className="flex items-center justify-between gap-3 max-w-7xl mx-auto w-full">
            <div className="flex items-center gap-3">
              <button
                onClick={() => setSidebarOpen(!sidebarOpen)}
                className="block md:hidden text-slate-600 hover:text-slate-900"
                aria-label="Toggle sidebar"
              >
                {sidebarOpen ? <X size={24} /> : <Menu size={24} />}
              </button>
              <div className="flex-1 text-start font-bold text-slate-900 text-lg tracking-tight">
                {header}
              </div>
            </div>
            <LanguageSwitcher />
          </div>
        </header>
      ) : null}

      {/* ── BODY ────────────────────────────────────────────── */}
      <div className="flex flex-1 overflow-hidden">

        {/* DESKTOP SIDEBAR */}
        <aside className="hidden w-64 shrink-0 border-e border-slate-200 bg-white md:flex">
          <nav className="h-full w-full overflow-y-auto ps-4 pe-4 py-6 text-start">
            <SidebarContent role={role} />
          </nav>
        </aside>

        {/* MAIN CONTENT */}
        <main className="flex-1 min-w-0 overflow-y-auto text-start p-6 md:p-8">
          <div className="max-w-7xl mx-auto">
            <Breadcrumbs />
            <div className="animate-in slide-in-from-bottom duration-500">
              {children}
            </div>
          </div>
        </main>
      </div>

      {/* MOBILE SIDEBAR */}
      {sidebarOpen ? (
        <>
          <div
            className="fixed inset-0 z-40 bg-slate-900/50 backdrop-blur-sm md:hidden"
            onClick={() => setSidebarOpen(false)}
          />
          <aside
            className="fixed inset-y-0 z-50 w-64 bg-white shadow-2xl md:hidden transition-transform duration-300 ease-in-out"
            style={{ insetInlineStart: 0 }}
          >
            <div className="flex items-center justify-between p-4 border-b border-slate-100">
               <span className="font-bold text-primitive-navy">{t('common.menu')}</span>
               <button onClick={() => setSidebarOpen(false)} className="text-slate-400">
                 <X size={20} />
               </button>
            </div>
            <nav className="h-full w-full overflow-y-auto ps-4 pe-4 py-6 text-start">
              <SidebarContent role={role} />
            </nav>
          </aside>
        </>
      ) : null}

      {/* BOTTOM NAV (Mobile) */}
      {showBottomNav ? (
        <BottomNav role={role} />
      ) : null}

      {/* FOOTER */}
      {footer ? (
        <footer className="border-t border-slate-200 bg-white ps-5 pe-5 py-6 text-start">
          <div className="max-w-7xl mx-auto text-sm text-slate-500">
            {footer}
          </div>
        </footer>
      ) : null}
    </div>
  )
}
