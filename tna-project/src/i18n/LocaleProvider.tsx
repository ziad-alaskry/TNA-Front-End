'use client'

import React, { createContext, useContext, useEffect } from 'react'
import type { Locale } from './config'
import { getDirection } from './config'

interface LocaleContextValue {
  locale: Locale
  dir: 'rtl' | 'ltr'
  isRTL: boolean
  messages: any
  t: (key: string) => string
}

const LocaleContext = createContext<LocaleContextValue>({
  locale: 'en',
  dir: 'ltr',
  isRTL: false,
  messages: {},
  t: (key) => key,
})

export function useLocale() {
  const context = useContext(LocaleContext)
  
  const t = (path: string) => {
    const keys = path.split('.')
    let current = context.messages
    for (const key of keys) {
      if (current && current[key]) {
        current = current[key]
      } else {
        return path // Fallback to key
      }
    }
    return typeof current === 'string' ? current : path
  }

  return { ...context, t }
}

interface LocaleProviderProps {
  locale: Locale
  messages: any
  children: React.ReactNode
}

export function LocaleProvider({ locale, messages, children }: LocaleProviderProps) {
  const dir = getDirection(locale)
  const isRTL = dir === 'rtl'

  useEffect(() => {
    document.documentElement.lang = locale
    document.documentElement.dir = dir
  }, [locale, dir])

  const t = (path: string) => {
    const keys = path.split('.')
    let current: any = messages
    for (const key of keys) {
      if (current && typeof current === 'object' && current[key] !== undefined) {
        current = current[key]
      } else {
        return path
      }
    }
    return typeof current === 'string' ? current : path
  }

  return (
    <LocaleContext.Provider value={{ locale, dir, isRTL, messages, t }}>
      {children}
    </LocaleContext.Provider>
  )
}
