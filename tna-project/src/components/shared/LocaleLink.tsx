'use client'

import React from 'react'
import Link, { LinkProps } from 'next/link'
import { useParams } from 'next/navigation'

interface LocaleLinkProps extends LinkProps {
  children: React.ReactNode
  className?: string
  id?: string
}

/**
 * A wrapper around next/link that automatically prepends the current locale to the href.
 * Example: href="/visitor/home" becomes "/ar/visitor/home" if current locale is "ar".
 */
export function LocaleLink({ href, children, ...props }: LocaleLinkProps) {
  const { locale } = useParams()
  
  // Ensure href is a string for prefixing
  const hrefString = typeof href === 'string' ? href : href.pathname || ''
  
  // Only prefix internal links that don't already have the locale
  const isInternal = hrefString.startsWith('/')
  const alreadyHasLocale = isInternal && (hrefString.startsWith(`/${locale}/`) || hrefString === `/${locale}`)
  
  const finalHref = isInternal && !alreadyHasLocale 
    ? `/${locale}${hrefString === '/' ? '' : hrefString}`
    : href
    
  return (
    <Link href={finalHref} {...props}>
      {children}
    </Link>
  )
}
