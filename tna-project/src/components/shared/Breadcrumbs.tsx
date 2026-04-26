'use client'

import React from 'react'
import { usePathname } from 'next/navigation'
import { CaretRight, House } from '@phosphor-icons/react'
import { useLocale } from '@/i18n/LocaleProvider'
import { LocaleLink } from './LocaleLink'
import MirrorIcon from './MirrorIcon'
import { cn } from '@/lib/utils/cn'

export default function Breadcrumbs() {
  const pathname = usePathname()
  const { locale, t, isRTL } = useLocale()
  
  // Remove locale and split path
  const segments = pathname
    .split('/')
    .filter(segment => segment !== '' && segment !== locale)

  // Map segments to translation keys or readable labels
  const getLabel = (segment: string) => {
    // Basic ID check (uuid or numeric)
    if (segment.length > 20 || /^\d+$/.test(segment)) {
        return `#${segment.slice(0, 8)}...`
    }

    const roleKey = segment.charAt(0).toUpperCase() + segment.slice(1).toLowerCase()
    
    // Check if it's a known role
    if (['Visitor', 'Owner', 'Gov', 'Carrier'].includes(roleKey)) {
      return t(`common.roles.${roleKey}.overview`)
    }

    // Check if there is a known route translation for this segment
    const translatedRoute = t(`common.routes.${segment}`)
    if (translatedRoute && !translatedRoute.includes('common.routes')) {
      return translatedRoute
    }

    // Default formatting for other segments
    return segment.charAt(0).toUpperCase() + segment.slice(1).replace(/-/g, ' ')
  }

  return (
    <nav 
        className="flex items-center gap-2 text-caption font-medium text-neutral-500 mb-6 font-rubik overflow-x-auto no-scrollbar whitespace-nowrap" 
        aria-label="Breadcrumb"
    >
      <LocaleLink 
        href="/" 
        className="flex items-center hover:text-primary transition-colors shrink-0"
      >
        <House size={16} weight="fill" />
      </LocaleLink>
      
      {segments.map((segment, index) => {
        const path = `/${segments.slice(0, index + 1).join('/')}`
        const isLast = index === segments.length - 1
        const label = getLabel(segment)

        return (
          <React.Fragment key={path}>
            <MirrorIcon>
                <CaretRight size={14} weight="bold" className="text-neutral-300 shrink-0" />
            </MirrorIcon>
            {isLast ? (
              <span className="text-neutral-900 font-bold">{label}</span>
            ) : (
              <LocaleLink 
                href={path}
                className="hover:text-primary transition-colors"
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
