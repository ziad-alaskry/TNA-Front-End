'use client'

import React from 'react'
import { useRouter, usePathname } from 'next/navigation'
import { 
  House, 
  MagnifyingGlass, 
  Wallet, 
  IdentificationCard, 
  Package, 
  User,
  Buildings,
  Link as LinkIcon,
  CurrencyCircleDollar,
  Truck,
  ClipboardText,
  ShieldCheck,
  Fingerprint,
  Gear
} from '@phosphor-icons/react'
import { useLocale } from '@/i18n/LocaleProvider'

type UserRole = 'Visitor' | 'Owner' | 'Gov' | 'Carrier'

interface BottomNavProps {
  role: UserRole
}

/**
 * Mobile Bottom Navigation — SPATIAL spec compliant.
 * Frosted-glass bg, amber active bar (3px), safe-area-bottom, logical properties.
 */
export function BottomNav({ role }: BottomNavProps) {
  const { locale, t } = useLocale()
  const pathname = usePathname()
  const router = useRouter()

  const isActive = (path: string) => {
    const fullPath = `/${locale}${path}`
    return pathname === fullPath || pathname.startsWith(`${fullPath}/`)
  }

  const visitorItems = [
    { id: 'home', icon: House, href: '/visitor/home', label: t('common.roles.Visitor.overview') },
    { id: 'search', icon: MagnifyingGlass, href: '/visitor/search', label: t('common.roles.Visitor.address_search') },
    { id: 'wallet', icon: Wallet, href: '/visitor/wallet', label: t('common.roles.Visitor.wallet') },
    { id: 'tnas', icon: IdentificationCard, href: '/visitor/tnas', label: t('common.roles.Visitor.codes') },
    { id: 'profile', icon: User, href: '/visitor/profile', label: t('common.roles.Visitor.profile') }
  ]

  const ownerItems = [
    { id: 'home', icon: House, href: '/owner/home', label: t('common.roles.Owner.overview') },
    { id: 'properties', icon: Buildings, href: '/owner/properties', label: t('common.roles.Owner.properties') },
    { id: 'bindings', icon: LinkIcon, href: '/owner/bindings', label: t('common.roles.Owner.bindings') },
    { id: 'earnings', icon: CurrencyCircleDollar, href: '/owner/earnings', label: t('common.roles.Owner.earnings') }
  ]

  const carrierItems = [
    { id: 'home', icon: House, href: '/carrier/home', label: t('common.roles.Carrier.overview') },
    { id: 'fleet', icon: Truck, href: '/carrier/fleet', label: t('common.roles.Carrier.fleet') },
    { id: 'shipments', icon: Package, href: '/carrier/shipments', label: t('common.roles.Carrier.shipments') },
    { id: 'tasks', icon: ClipboardText, href: '/carrier/tasks', label: t('common.roles.Carrier.tasks') }
  ]

  const govItems = [
    { id: 'home', icon: House, href: '/gov/home', label: t('common.roles.Gov.overview') },
    { id: 'queue', icon: ShieldCheck, href: '/gov/verification/queue', label: t('common.roles.Gov.queue') },
    { id: 'audit', icon: Fingerprint, href: '/gov/audit', label: t('common.roles.Gov.audit') },
    { id: 'policy', icon: Gear, href: '/gov/policy', label: t('common.roles.Gov.policy') }
  ]

  const items = {
    Visitor: visitorItems,
    Owner: ownerItems,
    Carrier: carrierItems,
    Gov: govItems
  }[role]

  return (
    <nav 
      className="fixed bottom-0 inset-x-0 z-50 border-t border-neutral-200 md:hidden safe-area-bottom"
      style={{ 
        background: 'var(--bottom-nav-bg)',
        backdropFilter: 'blur(16px)',
        WebkitBackdropFilter: 'blur(16px)',
        boxShadow: 'var(--shadow-navbar)'
      }}
    >
      <div className="flex items-center justify-around h-bottom-nav">
        {items.map((item) => {
          const active = isActive(item.href)
          const IconComponent = item.icon
          return (
            <button
              key={item.id}
              onClick={() => router.push(`/${locale}${item.href}`)}
              className={`relative flex flex-col items-center justify-center flex-1 h-full gap-1 transition-all duration-200 ${
                active ? 'text-primary' : 'text-neutral-400'
              }`}
            >
              {/* SPATIAL active bar — 3px amber top indicator */}
              {active && (
                <div className="absolute top-0 w-10 h-[3px] bg-warning rounded-b-full shadow-glow-primary" />
              )}
              <div className={active ? 'animate-zoom-in' : ''}>
                <IconComponent size={24} weight={active ? 'fill' : 'regular'} />
              </div>
              <span className="text-[10px] font-bold leading-none">{item.label}</span>
            </button>
          )
        })}
      </div>
    </nav>
  )
}
