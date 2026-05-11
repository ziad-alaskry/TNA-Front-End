'use client'

import React, { useState } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { usePathname, useRouter } from 'next/navigation'
import { MagnifyingGlass, List } from '@phosphor-icons/react'
import { useLocale } from '@/i18n/LocaleProvider'
import { locales, type Locale } from '@/i18n/config'
import Breadcrumbs from '@/components/shared/Breadcrumbs'
import { LanguageSwitcher } from '@/components/ui/LanguageSwitcher'
import { NotificationBell } from '@/components/ui/NotificationBell'
import { UserAvatar } from '@/components/ui/UserAvatar'
import InputField from '@/components/ui/InputField'
import { cn } from '@/lib/utils/cn'
import { WalletBalanceChip } from '@/components/ui/WalletBalanceChip'
import { mockBalances } from '@/lib/mock'

export default function Header({ title, onMenuClick }: { title?: React.ReactNode; onMenuClick?: () => void }) {
  const pathname = usePathname()
  const router = useRouter()
  const { locale: currentLocale } = useLocale()
  const [searchQuery, setSearchQuery] = useState('')
  const [isSearching, setIsSearching] = useState(false)

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault()
    if (!searchQuery.trim()) return
    setIsSearching(true)
    const segments = pathname.split('/')
    segments[1] = currentLocale
    const basePath = segments.slice(0, 3).join('/') // /locale/role
    router.push(`${basePath}/search?q=${encodeURIComponent(searchQuery)}`)
    setIsSearching(false)
  }

  const shouldShowSearch = pathname.includes('/visitor') || pathname.includes('/owner') || 
                          pathname.includes('/carrier') || pathname.includes('/gov')
                          
  // Logic to determine role and balance for display
  const isOwner = pathname.includes('/owner')
  const isVisitor = pathname.includes('/visitor')
  const isCarrier = pathname.includes('/carrier')
  const isGov = pathname.includes('/gov')

  const balance = isOwner ? mockBalances['user-owner-1'] : 
                 isVisitor ? mockBalances['user-visitor-1'] : 
                 isCarrier ? mockBalances['user-carrier-1'] : 0

  const shouldShowBalance = isVisitor || isOwner

  return (
    <header 
      className={cn(
        'sticky top-0 z-[var(--z-header)] w-full border-b-4 border-[color:var(--color-primary)]',
        'bg-[color:var(--surface-200)]/80 backdrop-blur-[var(--backdrop-blur)]',
        'shadow-[var(--shadow-navbar)] transition-all duration-fast'
      )}
      style={{ height: 'var(--navbar-height)' }}
    >
      {/* Main Header Container */}
      <div className="h-full flex items-center justify-between px-[var(--space-4)] md:px-[var(--space-5)] lg:px-[var(--space-6)]">
        
        {/* Start Section: Logo + Menu button (mobile) + Title (if provided) + Breadcrumbs */}
        <div className="flex-shrink-0 ps-[var(--space-4)] flex items-center gap-3">
          {onMenuClick && (
            <button 
              className="md:hidden p-2 -ms-2 text-text-secondary hover:bg-neutral-50 rounded-md"
              onClick={onMenuClick}
              aria-label="القائمة"
            >
              <List size={22} weight="bold" />
            </button>
          )}
          {/* TNA Logo */}
          <Link href={`/${currentLocale}/visitor/home`} className="flex items-center gap-2 shrink-0">
            <Image
              src="/brand/logo.svg"
              alt="TNA Logo"
              width={28}
              height={28}
              className="drop-shadow-sm"
            />
            {title && (
              <div className="text-start font-bold text-primary text-lg tracking-tight hidden md:block">
                {title}
              </div>
            )}
          </Link>

          {!title && (
            <div className="hidden md:block">
              <Breadcrumbs />
            </div>
          )}
        </div>

        {/* Center Section: Search Slot */}
        <div className="hidden md:flex flex-1 justify-center px-4 max-w-[480px]">
          {shouldShowSearch ? (
            <form onSubmit={handleSearch} className="w-full">
              <InputField
                icon={MagnifyingGlass}
                placeholder="ابحث في العقارات والملفات..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full"
              />
            </form>
          ) : (
            <div className="w-full h-10 bg-surface-200 rounded-sm border border-[color:var(--color-divider)]/30" />
          )}
        </div>

        {/* End Section: User Controls */}
        <div className="flex-shrink-0 pe-[var(--space-4)] flex items-center gap-[var(--space-3)]">
          {/* Wallet Balance Chip */}
          {shouldShowBalance && (
            <div className="hidden sm:block">
               <WalletBalanceChip 
                 balance={balance} 
                 onClick={() => router.push(`/${currentLocale}/visitor/wallet`)}
               />
            </div>
          )}

          {/* Language Switcher */}
          <LanguageSwitcher variant="ghost" />
          
          {/* Notification Bell */}
          <NotificationBell count={3} />
          
          {/* User Avatar */}
          <UserAvatar 
            isVisitor={isVisitor}
            user={{
              name: isOwner ? 'أحمد المالك' : 
                    isCarrier ? 'ناقل المثال' :
                    isGov ? 'جهة حكومية' : undefined,
              avatar: undefined
            }}
          />
        </div>

        {/* Mobile Menu Button fallback - visible on small screens if no onMenuClick */}
        {!onMenuClick && (
          <div className="flex-shrink-0 md:hidden">
            <button 
              className="p-2 rounded-full hover:bg-surface-200 transition-colors"
              aria-label="القائمة"
            >
              <svg width="20" height="20" viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M3 6h14M3 10h14M3 14h14" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </button>
          </div>
        )}
      </div>

      {/* Mobile Search Bar - visible on small screens */}
      {shouldShowSearch && (
        <div className="md:hidden px-[var(--space-4)] pb-3 border-t border-[color:var(--color-divider)]/30">
          <form onSubmit={handleSearch} className="w-full">
            <InputField
              icon={MagnifyingGlass}
              placeholder="ابحث في العقارات والملفات..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full"
            />
          </form>
        </div>
      )}
    </header>
  )
}