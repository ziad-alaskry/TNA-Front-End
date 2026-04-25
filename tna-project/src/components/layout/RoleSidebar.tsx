'use client'

import React from 'react'
import { 
    House, 
    MagnifyingGlass, 
    Wallet, 
    User, 
    IdentificationCard, 
    Truck, 
    ShieldCheck, 
    ChartBar, 
    Gear, 
    Package, 
    Link as LinkIcon,
    Question
} from '@phosphor-icons/react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'

import { useLocale } from '@/i18n/LocaleProvider'

interface SidebarProps {
  role: 'Visitor' | 'Owner' | 'Gov' | 'Carrier'
}

export function SidebarContent({ role }: SidebarProps) {
  const pathname = usePathname()
  const { locale, t } = useLocale()

  const menuConfigs = {
    Visitor: [
      { labelKey: 'common.roles.Visitor.overview', icon: <House size={22} />, href: '/visitor/home' },
      { labelKey: 'common.roles.Visitor.address_search', icon: <MagnifyingGlass size={22} />, href: '/visitor/search' },
      { labelKey: 'common.roles.Visitor.wallet', icon: <Wallet size={22} />, href: '/visitor/wallet' },
      { labelKey: 'common.roles.Visitor.codes', icon: <IdentificationCard size={22} />, href: '/visitor/tnas' },
      { labelKey: 'common.roles.Visitor.shipments', icon: <Package size={22} />, href: '/visitor/shipments' },
      { labelKey: 'common.roles.Visitor.profile', icon: <User size={22} />, href: '/visitor/profile' },
    ],
    Owner: [
      { labelKey: 'common.roles.Owner.overview', icon: <House size={22} />, href: '/owner/home' },
      { labelKey: 'common.roles.Owner.properties', icon: <MagnifyingGlass size={22} />, href: '/owner/properties' },
      { labelKey: 'common.roles.Owner.bindings', icon: <LinkIcon size={22} />, href: '/owner/bindings' },
      { labelKey: 'common.roles.Owner.earnings', icon: <Wallet size={22} />, href: '/owner/earnings' },
    ],
    Carrier: [
      { labelKey: 'common.roles.Carrier.overview', icon: <House size={22} />, href: '/carrier/home' },
      { labelKey: 'common.roles.Carrier.fleet', icon: <Truck size={22} />, href: '/carrier/fleet' },
      { labelKey: 'common.roles.Carrier.shipments', icon: <Package size={22} />, href: '/carrier/shipments' },
    ],
    Gov: [
      { labelKey: 'common.roles.Gov.overview', icon: <House size={22} />, href: '/gov/home' },
      { labelKey: 'common.roles.Gov.queue', icon: <ChartBar size={22} />, href: '/gov/verification/queue' },
      { labelKey: 'common.roles.Gov.audit', icon: <Gear size={22} />, href: '/gov/audit' },
    ],
  }

  const menuItems = menuConfigs[role] || []
  
  return (
    <div className="flex h-full flex-col text-start">
      <div className="mb-10 px-2 py-4">
        <div className="flex items-center gap-3 rounded-md p-3 bg-btn-primary shadow-btn text-white">
          <div className="h-10 w-10 rounded-md bg-white/20 flex items-center justify-center font-bold text-lg shadow-inner">
            {role[0]}
          </div>
          <div className="flex flex-col">
            <span className="font-bold tracking-tight text-white leading-none">TNA {role}</span>
            <span className="text-[10px] text-white/70 mt-1 uppercase font-bold tracking-widest">Portal</span>
          </div>
        </div>
      </div>

      <nav className="flex-1 space-y-1.5">
        {menuItems.map((item) => {
          const localizedHref = `/${locale}${item.href}`
          const isExact = pathname === localizedHref
          const isActive = pathname === localizedHref || (item.href !== '/visitor/home' && item.href !== '/owner/home' && pathname.startsWith(`${localizedHref}/`))
          
          return (
            <Link
              key={item.href}
              href={`/${locale}${item.href}`}
              className={`flex items-center gap-3 rounded-sm px-4 py-3.5 text-sm font-bold transition-all duration-300 ${
                isActive
                  ? 'bg-primary/10 text-primary border-s-4 border-primary'
                  : 'text-neutral-500 hover:bg-neutral-50 hover:text-neutral-900 border-s-4 border-transparent'
              }`}
            >
              <span className={`transition-transform duration-300 flex items-center ${isActive ? 'text-primary' : 'text-neutral-400'}`}>
                {item.icon}
              </span>
              <span>{t(item.labelKey)}</span>
            </Link>
          )
        })}
      </nav>

      <div className="mt-auto pt-6 border-t border-neutral-100">
        <div className="rounded-md bg-neutral-50 p-4 border border-neutral-200/50">
          <div className="flex items-center gap-2 mb-2">
            <Question size={18} className="text-primary" weight="fill" />
            <p className="text-[10px] font-bold text-neutral-400 uppercase tracking-wider">{t('common.support')}</p>
          </div>
          <p className="text-xs text-neutral-600 font-medium leading-relaxed">
            {t('common.logged_in_as').replace('{role}', role)}
          </p>
        </div>
      </div>
    </div>
  )
}
