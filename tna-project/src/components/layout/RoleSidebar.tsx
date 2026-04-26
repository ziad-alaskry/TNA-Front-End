'use client'

import React from 'react'
import { 
    House as HouseIcon, 
    MagnifyingGlass as MagnifyingGlassIcon, 
    Wallet as WalletIcon, 
    User as UserIcon, 
    IdentificationCard as IdentificationCardIcon, 
    Truck as TruckIcon, 
    ShieldCheck as ShieldCheckIcon, 
    ChartBar as ChartBarIcon, 
    Gear as GearIcon, 
    Question as QuestionIcon,
    NavigationArrow as NavigationArrowIcon,
    Fingerprint as FingerprintIcon,
    Users as UsersIcon,
    Package as PackageIcon,
    Link as LinkIcon
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
      { labelKey: 'common.roles.Visitor.overview', icon: <HouseIcon size={22} />, href: '/visitor/home' },
      { labelKey: 'common.roles.Visitor.address_search', icon: <MagnifyingGlassIcon size={22} />, href: '/visitor/search' },
      { labelKey: 'common.roles.Visitor.wallet', icon: <WalletIcon size={22} />, href: '/visitor/wallet' },
      { labelKey: 'common.roles.Visitor.codes', icon: <IdentificationCardIcon size={22} />, href: '/visitor/tnas' },
      { labelKey: 'common.roles.Visitor.shipments', icon: <PackageIcon size={22} />, href: '/visitor/shipments' },
      { labelKey: 'common.roles.Visitor.profile', icon: <UserIcon size={22} />, href: '/visitor/profile' },
    ],
    Owner: [
      { labelKey: 'common.roles.Owner.overview', icon: <HouseIcon size={22} />, href: '/owner/home' },
      { labelKey: 'common.roles.Owner.properties', icon: <MagnifyingGlassIcon size={22} />, href: '/owner/properties' },
      { labelKey: 'common.roles.Owner.bindings', icon: <LinkIcon size={22} />, href: '/owner/bindings' },
      { labelKey: 'common.roles.Owner.earnings', icon: <WalletIcon size={22} />, href: '/owner/earnings' },
    ],
    Carrier: [
      { labelKey: 'common.roles.Carrier.overview', icon: <HouseIcon size={22} />, href: '/carrier/home' },
      { labelKey: 'common.roles.Carrier.fleet', icon: <TruckIcon size={22} />, href: '/carrier/fleet' },
      { labelKey: 'common.roles.Carrier.shipments', icon: <PackageIcon size={22} />, href: '/carrier/shipments' },
      { labelKey: 'common.roles.Carrier.tasks', icon: <NavigationArrowIcon size={22} />, href: '/carrier/driver/tasks' },
      { labelKey: 'common.roles.Carrier.reports', icon: <ChartBarIcon size={22} />, href: '/carrier/reports' },
    ],
    Gov: [
      { labelKey: 'common.roles.Gov.overview', icon: <HouseIcon size={22} />, href: '/gov/home' },
      { labelKey: 'common.roles.Gov.queue', icon: <ChartBarIcon size={22} />, href: '/gov/verification/queue' },
      { labelKey: 'common.roles.Gov.audit', icon: <FingerprintIcon size={22} />, href: '/gov/audit' },
      { labelKey: 'common.roles.Gov.agencies', icon: <UsersIcon size={22} />, href: '/gov/agencies' },
      { labelKey: 'common.roles.Gov.policy', icon: <GearIcon size={22} />, href: '/gov/policy' },
    ],
  }

  const menuItems = menuConfigs[role] || []
  
  return (
    <div className="flex h-full flex-col text-start">
      <div className="mb-10 px-2 py-4">
        <div className="flex items-center gap-3 rounded-md p-3 bg-btn-primary shadow-btn text-white">
          <div className="h-10 w-10 rounded-md bg-white/20 flex items-center justify-center font-bold text-lg shadow-inner">
            {t(`common.role_names.${role}`)[0]}
          </div>
          <div className="flex flex-col">
            <span className="font-bold tracking-tight text-white leading-none">TNA {t(`common.role_names.${role}`)}</span>
            <span className="text-[10px] text-white/70 mt-1 uppercase font-bold tracking-widest">{t('common.portal')}</span>
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
            <QuestionIcon size={18} className="text-primary" weight="fill" />
            <p className="text-[10px] font-bold text-neutral-400 uppercase tracking-wider">{t('common.support')}</p>
          </div>
          <p className="text-xs text-neutral-600 font-medium leading-relaxed">
            {t('common.logged_in_as').replace('{role}', t(`common.role_names.${role}`))}
          </p>
        </div>
      </div>
    </div>
  )
}
