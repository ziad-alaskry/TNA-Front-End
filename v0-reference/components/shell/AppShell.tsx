'use client'

import React, { ReactNode, useState } from 'react'
import { Menu, X } from 'lucide-react'

type UserRole = 'Visitor' | 'Owner' | 'Gov' | 'Carrier'

interface AppShellProps {
  children: ReactNode
  role: UserRole
  sidebar?: ReactNode
  header?: ReactNode
  footer?: ReactNode
  showBottomNav?: boolean
}

/**
 * Master AppShell - RTL-compliant layout wrapper
 * Supports role-based branding and flexible navigation patterns
 */
export function AppShell({
  children,
  role,
  sidebar,
  header,
  footer,
  showBottomNav = true,
}: AppShellProps) {
  const [sidebarOpen, setSidebarOpen] = useState(false)

  // Determine brand color based on role
  const getBrandingClass = (role: UserRole) => {
    switch (role) {
      case 'Visitor':
        return 'bg-primitive-cyan-mid'
      case 'Owner':
      case 'Gov':
        return 'bg-primitive-navy'
      case 'Carrier':
        return 'bg-primitive-amber'
      default:
        return 'bg-primitive-navy'
    }
  }

  const brandingClass = getBrandingClass(role)

  return (
    <div className="flex h-screen w-full flex-col bg-surface-100 font-en">
      {/* HEADER */}
      {header && (
        <header
          className={`${brandingClass} border-b border-neutral-200 px-5 py-6 text-white shadow-card`}
        >
          <div className="flex items-center justify-between">
            {sidebar && (
              <button
                onClick={() => setSidebarOpen(!sidebarOpen)}
                className="block ps-0 pe-3 md:hidden"
                aria-label="Toggle sidebar"
              >
                {sidebarOpen ? (
                  <X size={24} />
                ) : (
                  <Menu size={24} />
                )}
              </button>
            )}
            {header}
          </div>
        </header>
      )}

      {/* MAIN CONTENT AREA */}
      <div className="flex flex-1 overflow-hidden">
        {/* SIDEBAR (Desktop) */}
        {sidebar && (
          <aside
            className={`fixed inset-y-0 start-0 z-40 w-64 transform bg-surface-200 transition-transform duration-300 ease-in-out md:relative md:translate-x-0 ${
              sidebarOpen ? 'translate-x-0 rtl:translate-x-0' : '-translate-x-full rtl:translate-x-full'
            }`}
          >
            <nav className="h-full overflow-y-auto border-e border-neutral-200 p-5">
              {sidebar}
            </nav>
          </aside>
        )}

        {/* OVERLAY for mobile sidebar */}
        {sidebar && sidebarOpen && (
          <div
            className="fixed inset-0 z-30 bg-black/50 md:hidden"
            onClick={() => setSidebarOpen(false)}
          />
        )}

        {/* MAIN CONTENT */}
        <main className="flex-1 overflow-y-auto">
          {children}
        </main>
      </div>

      {/* BOTTOM NAVIGATION (Mobile) */}
      {showBottomNav && (
        <nav
          className="border-t border-neutral-200 bg-surface-200 md:hidden"
          style={{ height: 'var(--navbar-height)' }}
        >
          <div className="flex h-full items-center justify-around px-0">
            {/* Navigation items would go here */}
          </div>
        </nav>
      )}

      {/* FOOTER */}
      {footer && (
        <footer className="border-t border-neutral-200 bg-surface-200 px-5 py-6">
          {footer}
        </footer>
      )}
    </div>
  )
}
