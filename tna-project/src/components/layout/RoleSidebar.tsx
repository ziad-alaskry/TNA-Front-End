'use client'

import React from 'react'
import { Home, Search, Wallet, User, Bell, Truck, ShieldAlert, BarChart3, Settings, Package, Link as LinkIcon } from 'lucide-react'
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
      { labelKey: 'common.roles.Visitor.overview', icon: <Home size={20} />, href: '/visitor/home' },
      { labelKey: 'common.roles.Visitor.address_search', icon: <Search size={20} />, href: '/visitor/search' },
      { labelKey: 'common.roles.Visitor.wallet', icon: <Wallet size={20} />, href: '/visitor/wallet' },
      { labelKey: 'common.roles.Visitor.codes', icon: <Bell size={20} />, href: '/visitor/tnas' },
      { labelKey: 'common.roles.Visitor.profile', icon: <User size={20} />, href: '/visitor/profile' },
    ],
    Owner: [
      { labelKey: 'common.roles.Owner.overview', icon: <Home size={20} />, href: '/owner/home' },
      { labelKey: 'common.roles.Owner.properties', icon: <Search size={20} />, href: '/owner/properties' },
      { labelKey: 'common.roles.Owner.bindings', icon: <LinkIcon size={20} />, href: '/owner/bindings' },
      { labelKey: 'common.roles.Owner.earnings', icon: <Wallet size={20} />, href: '/owner/earnings' },
    ],
    Carrier: [
      { labelKey: 'common.roles.Carrier.overview', icon: <Home size={20} />, href: '/carrier/home' },
      { labelKey: 'common.roles.Carrier.fleet', icon: <Truck size={20} />, href: '/carrier/fleet' },
      { labelKey: 'common.roles.Carrier.shipments', icon: <Package size={20} />, href: '/carrier/shipments' },
    ],
    Gov: [
      { labelKey: 'common.roles.Gov.overview', icon: <Home size={20} />, href: '/gov/home' },
      { labelKey: 'common.roles.Gov.queue', icon: <BarChart3 size={20} />, href: '/gov/verification/queue' },
      { labelKey: 'common.roles.Gov.audit', icon: <Settings size={20} />, href: '/gov/audit' },
    ],
  }

  const menuItems = menuConfigs[role] || []
  
  const getRoleBranding = () => {
    switch (role) {
      case 'Visitor': return 'bg-primitive-cyan-mid'
      case 'Owner':
      case 'Gov': return 'bg-primitive-navy'
      case 'Carrier': return 'bg-primitive-amber'
      default: return 'bg-primitive-navy'
    }
  }

  return (
    <div className="flex h-full flex-col text-start">
      <div className="mb-10 px-2 py-4">
        <div className={`flex items-center gap-3 rounded-md p-3 text-white ${getRoleBranding()}`}>
          <div className="h-8 w-8 rounded-full bg-white/20 flex items-center justify-center font-bold">
            {role[0]}
          </div>
          <span className="font-bold tracking-tight text-white">TNA {role}</span>
        </div>
      </div>

      <nav className="flex-1 space-y-2">
        {menuItems.map((item) => {
          const localizedHref = `/${locale}${item.href}`
          const isActive = pathname === localizedHref || pathname.startsWith(`${localizedHref}/`)
          
          return (
            <Link
              key={item.href}
              href={`/${locale}${item.href}`}
              className={`flex items-center gap-3 rounded-sm px-4 py-3 text-sm font-medium transition-all duration-200 ${
                isActive
                  ? 'border-s-4 border-primitive-navy bg-primitive-navy/5 text-primitive-navy'
                  : 'text-slate-500 hover:bg-slate-50 hover:text-slate-900'
              }`}
            >
              <span className={`transition-transform duration-200 flex items-center ${isActive ? 'text-inherit' : 'text-neutral-400'}`}>
                <span className="rtl:-scale-x-100 inline-block">
                  {item.icon}
                </span>
              </span>
              <span>{t(item.labelKey)}</span>
            </Link>
          )
        })}
      </nav>

      <div className="mt-auto border-t border-slate-100 pt-6">
        <div className="rounded-md bg-slate-50 p-4">
          <p className="text-xs font-semibold text-slate-400 uppercase mb-2">{t('common.support')}</p>
          <p className="text-xs text-slate-600 leading-relaxed">
            {t('common.logged_in_as').replace('{role}', role)}
          </p>
        </div>
      </div>
    </div>
  )
}
