'use client'

import React from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { ChevronRight, Home } from 'lucide-react'
import { useLocale } from '@/i18n/LocaleProvider'

export default function Breadcrumbs() {
  const pathname = usePathname()
  const { locale, t } = useLocale()
  
  // Remove locale and split path
  const segments = pathname
    .split('/')
    .filter(segment => segment !== '' && segment !== locale)

  return (
    <nav className="flex items-center space-x-2 text-xs font-medium text-slate-500 mb-6 font-rubik" aria-label="Breadcrumb">
      <Link 
        href={`/${locale}/home`}
        className="flex items-center hover:text-primitive-navy transition-colors"
      >
        <Home size={14} className="me-1" />
        {t('common.home')}
      </Link>
      
      {segments.map((segment, index) => {
        const path = `/${locale}/${segments.slice(0, index + 1).join('/')}`
        const isLast = index === segments.length - 1
        const label = segment.charAt(0).toUpperCase() + segment.slice(1).replace(/-/g, ' ')

        return (
          <React.Fragment key={path}>
            <ChevronRight size={14} className="text-slate-300 rtl:rotate-180" />
            {isLast ? (
              <span className="text-slate-900 font-bold">{label}</span>
            ) : (
              <Link 
                href={path}
                className="hover:text-primitive-navy transition-colors"
              >
                {label}
              </Link>
            )}
          </React.Fragment>
        )
      })}
    </nav>
  )
}
