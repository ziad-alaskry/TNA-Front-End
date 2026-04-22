'use client'

import React from 'react'
import Link from 'next/link'
import { usePathname, useRouter } from 'next/navigation'
import { Globe } from 'lucide-react'
import { useLocale } from '@/i18n/LocaleProvider'
import { locales, type Locale } from '@/i18n/config'

export default function Header() {
  const pathname = usePathname()
  const router = useRouter()
  const { locale: currentLocale } = useLocale()

  const handleLocaleToggle = () => {
    const newLocale: Locale = currentLocale === 'en' ? 'ar' : 'en'
    const segments = pathname.split('/')
    segments[1] = newLocale
    router.push(segments.join('/'))
  }

  return (
    <header className="flex h-16 items-center justify-between border-b border-neutral-100 bg-white px-6">
      <div className="flex items-center gap-2">
        <span className="text-lg font-bold tracking-tight text-neutral-900">
          TNA
        </span>
      </div>

      <button
        onClick={handleLocaleToggle}
        className="flex items-center gap-2 rounded-md border border-neutral-200 bg-white px-3 py-2 text-sm font-medium text-neutral-700 transition-colors hover:bg-neutral-50 hover:text-neutral-900"
        aria-label={`Switch to ${currentLocale === 'en' ? 'Arabic' : 'English'}`}
      >
        <Globe size={18} />
        <span className="min-w-[2ch]">{currentLocale === 'en' ? 'AR' : 'EN'}</span>
      </button>
    </header>
  )
}