'use client'

import React from 'react'
import { usePathname } from 'next/navigation'
import { ChevronRight, Home } from 'lucide-react'
import { useLocale } from '@/i18n/LocaleProvider'
import { LocaleLink } from './LocaleLink'

export default function Breadcrumbs() {
  const pathname = usePathname()
  const { locale, t } = useLocale()
  
  // Remove locale and split path
  const segments = pathname
    .split('/')
    .filter(segment => segment !== '' && segment !== locale)

  // Map segments to translation keys or readable labels
  const getLabel = (segment: string) => {
    const roleKey = segment.charAt(0).toUpperCase() + segment.slice(1).toLowerCase()
    
    // Check if it's a known role
    if (['Visitor', 'Owner', 'Gov', 'Carrier'].includes(roleKey)) {
      return t(`common.roles.${roleKey}.overview`)
    }

    // Default formatting for other segments
    return segment.charAt(0).toUpperCase() + segment.slice(1).replace(/-/g, ' ')
  }

  return (
    <nav className="flex items-center space-x-2 text-xs font-medium text-slate-500 mb-6 font-rubik overflow-hidden whitespace-nowrap" aria-label="Breadcrumb">
      <LocaleLink 
        href="/visitor/home" 
        className="flex items-center hover:text-primitive-navy transition-colors shrink-0"
      >
        <Home size={14} className="me-1" />
      </LocaleLink>
      
      {segments.map((segment, index) => {
        const path = `/${segments.slice(0, index + 1).join('/')}`
        const isLast = index === segments.length - 1
        const label = getLabel(segment)

        return (
          <React.Fragment key={path}>
            <ChevronRight size={14} className="text-slate-300 rtl:rotate-180 shrink-0" />
            {isLast ? (
              <span className="text-slate-900 font-bold truncate">{label}</span>
            ) : (
              <LocaleLink 
                href={path}
                className="hover:text-primitive-navy transition-colors truncate"
              >
                {label}
              </LocaleLink>
            )}
          </React.Fragment>
        )
      })}
    </nav>
  )
}
