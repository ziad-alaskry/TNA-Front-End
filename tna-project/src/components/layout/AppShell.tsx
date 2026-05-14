'use client'

import React, { ReactNode, useState, useEffect } from 'react'
import { List, X } from '@phosphor-icons/react'

import { SidebarContent } from './RoleSidebar'
import { useLocale } from '@/i18n/LocaleProvider'
import Breadcrumbs from '@/components/shared/Breadcrumbs'
import { LanguageSwitcher } from '@/components/ui/LanguageSwitcher'
import { BottomNav } from './BottomNav'
import { cn } from '@/lib/utils/cn'
import Header from '@/components/shell/Header'
import { useMounted } from '@/lib/hooks/useMounted'

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
  const [collapsed, setCollapsed] = useState(true) // Sidebar defaults to collapsed (icon-only)
  const [isDesktop, setIsDesktop] = useState(false)
  const { isRTL, t } = useLocale()
  const mounted = useMounted()

  useEffect(() => {
    const checkIfDesktop = () => {
      setIsDesktop(window.innerWidth >= 768) // md breakpoint
    }
    checkIfDesktop()
    window.addEventListener('resize', checkIfDesktop)
    return () => window.removeEventListener('resize', checkIfDesktop)
  }, [])

  if (!mounted) return null

  return (
    <div suppressHydrationWarning className="flex h-screen w-full flex-col bg-surface-100 text-neutral-900" dir={t('common.dir') as any}>

      {/* ── HEADER (Enterprise Header with Bell, Search, Avatar) ────────────── */}
      <Header 
        title={header} 
        onMenuClick={() => {
          if (isDesktop) {
            setCollapsed(!collapsed)
          } else {
            setSidebarOpen(true)
          }
        }} 
      />

      {/* ── BODY ─────────────────────────────────────────────── */}
      <div className="flex flex-1 overflow-hidden">

        {/* DESKTOP SIDEBAR */}
        <aside className={cn(
          'hidden shrink-0 md:flex flex-col border-e border-white/10 h-[calc(100vh-var(--navbar-height))] sticky top-navbar z-[40]',
          !isDesktop ? 'hidden' : '', // Hide on mobile
          collapsed ? 'w-[72px]' : 'w-64', // Width based on collapsed state
          'transition-all duration-300 ease-in-out bg-[var(--sidebar-gradient)] shadow-xl'
        )}>
          <nav className="flex-1 overflow-y-auto py-8 text-start no-scrollbar">
            <SidebarContent role={role} collapsed={collapsed} />
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
                "absolute inset-0 bg-primary-dark/60 backdrop-blur-sm transition-opacity duration-300",
                sidebarOpen ? "opacity-100" : "opacity-0"
            )}
            onClick={() => setSidebarOpen(false)}
          />
          
          {/* Drawer */}
          <aside
            className={cn(
                "absolute inset-y-0 w-72 bg-primary-gradient shadow-modal transition-transform duration-300 ease-out flex flex-col",
                isRTL 
                    ? (sidebarOpen ? "translate-x-0" : "translate-x-full") 
                    : (sidebarOpen ? "translate-x-0" : "-translate-x-full"),
                isRTL ? "right-0" : "left-0"
            )}
          >
             <div className="flex items-center justify-between p-5 border-b border-white/10 bg-black/10">
                <span className="font-bold text-white tracking-tight">{t('common.menu')}</span>
                <button 
                  className="lg:hidden p-2 -ms-2 text-white/70 hover:text-white hover:bg-white/10 rounded-md transition-colors"
                  onClick={() => setSidebarOpen(false)}
                >
                  <X size={22} weight="bold" />
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
