'use client'

import React, { ReactNode, useState, useEffect } from 'react'
import Image from 'next/image'

import { SidebarContent } from './RoleSidebar'
import { useLocale } from '@/i18n/LocaleProvider'
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

   const isMobile = !isDesktop
   const isMenuOpen = isMobile ? sidebarOpen : !collapsed
   const showCloseIcon = isMobile && sidebarOpen

   useEffect(() => {
     const checkIfDesktop = () => {
       setIsDesktop(window.innerWidth >= 768) // md breakpoint
     }
     checkIfDesktop()
     window.addEventListener('resize', checkIfDesktop)
     return () => window.removeEventListener('resize', checkIfDesktop)
   }, [])

    // Body scroll lock for mobile sidebar
    useEffect(() => {
      if (isDesktop) return
      document.body.style.overflow = sidebarOpen ? 'hidden' : ''
      return () => {
        document.body.style.overflow = ''
      }
    }, [sidebarOpen, isDesktop])

    // Escape key to close mobile sidebar
    useEffect(() => {
      const handleEscape = (e: KeyboardEvent) => {
        if (e.key === 'Escape' && sidebarOpen) {
          setSidebarOpen(false)
        }
      }
      document.addEventListener('keydown', handleEscape)
      return () => document.removeEventListener('keydown', handleEscape)
    }, [sidebarOpen])

  if (!mounted) return null

  return (
    <div suppressHydrationWarning className="flex h-screen w-full flex-col bg-surface-100 text-neutral-900" dir={t('common.dir') as any}>

      {/* ── HEADER (Enterprise Header) ── */}
        <Header 
          title={header} 
          isMenuOpen={isMenuOpen}
          showCloseIcon={showCloseIcon}
          desktopSidebarWidth={isDesktop ? 72 : 0}
          onMenuClick={() => {
            if (isDesktop) {
              setCollapsed(!collapsed)
            } else {
              setSidebarOpen(prev => !prev)
            }
          }} 
        />

      {/* ── BODY ── */}
      <div className="flex flex-1 overflow-hidden">

        <div
          aria-hidden="true"
          className="hidden w-[72px] shrink-0 md:block"
        />

        {/* DESKTOP SIDEBAR */}
        <aside className={cn(
          'fixed left-0 top-[var(--navbar-height)] bottom-0 z-[40] hidden h-[calc(100vh-var(--navbar-height))] shrink-0 md:flex flex-col border-e border-[var(--divider-strong)]',
          !isDesktop ? 'hidden' : '', // Hide on mobile
          collapsed ? 'w-[72px]' : 'w-64', // Width based on collapsed state
          'transition-all duration-300 ease-in-out bg-white shadow-xl'
        )}>
           <nav className="flex-1 overflow-hidden text-start no-scrollbar">
            <SidebarContent role={role} collapsed={collapsed} />
          </nav>
        </aside>

        {/* MAIN CONTENT */}
        <main className="flex-1 min-w-0 overflow-y-auto text-start p-6 md:p-10 pb-28 md:pb-10 no-scrollbar">
          <div className="ui-content-container mx-auto">
            <div className="animate-in slide-in-from-bottom-4 duration-500 fade-in fill-mode-both">
              {children}
            </div>
          </div>
        </main>
      </div>

       {/* MOBILE SIDEBAR */}
       <div className={cn(
           "fixed inset-0 transition-all duration-300 md:hidden",
           sidebarOpen ? "visible" : "invisible pointer-events-none"
       )}>
           {/* Overlay */}
           <div
             className={cn(
                 "absolute inset-0 z-[var(--z-overlay)] bg-transparent",
                 sidebarOpen ? "opacity-100" : "opacity-0"
             )}
             onClick={() => setSidebarOpen(false)}
           />
           
            {/* Drawer */}
            <aside
              className={cn(
                  "fixed top-0 bottom-0 z-[var(--z-sidebar)] w-[min(280px,85vw)] bg-white shadow-modal transition-transform duration-300 ease-out flex flex-col",
                  isRTL 
                      ? (sidebarOpen ? "translate-x-0" : "translate-x-full") 
                      : (sidebarOpen ? "translate-x-0" : "-translate-x-full"),
                  isRTL ? "right-0" : "left-0"
              )}
            >
                 <div className="flex items-center justify-between p-5 border-b border-[var(--divider-on-blue)] bg-gradient-to-r from-primary to-primary-dark">
                    <div className="flex items-center gap-3">
                      <div className="h-10 w-10 rounded-lg bg-white/10 flex items-center justify-center shadow-sm">
                        <Image src="/brand/logo.svg" alt="TNA Logo" width={28} height={28} className="drop-shadow-sm" />
                      </div>
                      <div className="flex flex-col">
                        <span className="font-bold text-white text-lg leading-none tracking-tight">TNA</span>
                        <span className="text-xs text-white/70 mt-0.5 uppercase font-semibold tracking-wide">{role}</span>
                      </div>
                    </div>
                 </div>
              <nav className="flex-1 overflow-hidden px-4 py-8 text-start">
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
