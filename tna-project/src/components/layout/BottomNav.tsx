'use client'

import React from 'react'
import { useRouter, useParams, usePathname } from 'next/navigation'
import { 
  House, 
  MagnifyingGlass, 
  Wallet, 
  IdentificationCard, 
  Package, 
  User,
  Buildings,
  Link,
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

export function BottomNav({ role }: BottomNavProps) {
  const { locale, t } = useLocale()
  const pathname = usePathname()
  const router = useRouter()

  const isActive = (path: string) => {
    const fullPath = `/${locale}${path}`
    return pathname === fullPath
  }

  const visitorItems = [
    { id: 'home', icon: <House size={24} />, href: '/visitor/home', label: t('common.roles.Visitor.overview') },
    { id: 'search', icon: <MagnifyingGlass size={24} />, href: '/visitor/search', label: t('common.roles.Visitor.address_search') },
    { id: 'wallet', icon: <Wallet size={24} />, href: '/visitor/wallet', label: t('common.roles.Visitor.wallet') },
    { id: 'tnas', icon: <IdentificationCard size={24} />, href: '/visitor/tnas', label: t('common.roles.Visitor.codes') },
    { id: 'profile', icon: <User size={24} />, href: '/visitor/profile', label: t('common.roles.Visitor.profile') }
  ]

  const ownerItems = [
    { id: 'home', icon: <House size={24} />, href: '/owner/home', label: t('common.roles.Owner.overview') },
    { id: 'properties', icon: <Buildings size={24} />, href: '/owner/properties', label: t('common.roles.Owner.properties') },
    { id: 'bindings', icon: <Link size={24} />, href: '/owner/bindings', label: t('common.roles.Owner.bindings') },
    { id: 'earnings', icon: <CurrencyCircleDollar size={24} />, href: '/owner/earnings', label: t('common.roles.Owner.earnings') }
  ]

  const carrierItems = [
    { id: 'home', icon: <House size={24} />, href: '/carrier/home', label: t('common.roles.Carrier.overview') },
    { id: 'fleet', icon: <Truck size={24} />, href: '/carrier/fleet', label: t('common.roles.Carrier.fleet') },
    { id: 'shipments', icon: <Package size={24} />, href: '/carrier/shipments', label: t('common.roles.Carrier.shipments') },
    { id: 'tasks', icon: <ClipboardText size={24} />, href: '/carrier/tasks', label: t('common.roles.Carrier.tasks') }
  ]

  const govItems = [
    { id: 'home', icon: <House size={24} />, href: '/gov/home', label: t('common.roles.Gov.overview') },
    { id: 'queue', icon: <ShieldCheck size={24} />, href: '/gov/verification/queue', label: t('common.roles.Gov.queue') },
    { id: 'audit', icon: <Fingerprint size={24} />, href: '/gov/audit', label: t('common.roles.Gov.audit') },
    { id: 'policy', icon: <Gear size={24} />, href: '/gov/policy', label: t('common.roles.Gov.policy') }
  ]

  const items = {
    Visitor: visitorItems,
    Owner: ownerItems,
    Carrier: carrierItems,
    Gov: govItems
  }[role]

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-50 bg-white border-t border-slate-200 md:hidden safe-area-bottom">
      <div className="flex items-center justify-around h-16">
        {items.map((item) => {
          const active = isActive(item.href)
          return (
            <button
              key={item.id}
              onClick={() => router.push(`/${locale}${item.href}`)}
              className={`flex flex-col items-center justify-center flex-1 h-full gap-1 transition-colors ${
                active ? 'text-primary' : 'text-slate-400'
              }`}
            >
              <div className={`${active ? 'animate-in fade-in zoom-in duration-300' : ''}`}>
                {item.icon}
              </div>
              <span className="text-[10px] font-bold leading-none">{item.label}</span>
              {active && (
                <div className="absolute top-0 w-8 h-1 bg-primary rounded-b-full shadow-glow-primary" />
              )}
            </button>
          )
        })}
      </div>
    </nav>
  )
}
