'use client'

import React from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
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
    Link as LinkIcon,
    MapPin as MapPinIcon
} from '@phosphor-icons/react'
import Image from 'next/image'
import { useLocale } from '@/i18n/LocaleProvider'
import { useAuthStore } from '@/lib/store/useAuthStore'
import { useWallet } from '@/lib/hooks/useWallet'
import { UserAvatar } from '@/components/ui/UserAvatar'

interface SidebarProps {
  role: 'Visitor' | 'Owner' | 'Gov' | 'Carrier'
  collapsed?: boolean
}

function SidebarProfile({ role }: { role: string }) {
  const { user } = useAuthStore()
  const { balance } = useWallet()
  
  return (
    <div className="px-4 py-4 border-b border-white/5 bg-white/5 mx-3 rounded-lg mb-4">
      <div className="flex items-center gap-3">
        <UserAvatar 
          user={{ name: user?.full_name || 'User', avatar: undefined }}
          isVisitor={role === 'Visitor'}
          className="h-10 w-10"
        />
        <div className="flex flex-col min-w-0">
          <span className="text-sm font-bold text-white truncate">{user?.full_name || 'Default User'}</span>
          <span className="text-[10px] text-sky-400 font-black uppercase tracking-wider">
            {role === 'Owner' ? `${balance.toLocaleString()} SAR` : role}
          </span>
        </div>
      </div>
    </div>
  )
}

export function SidebarContent({ role, collapsed = false }: SidebarProps) {
  const pathname = usePathname()
  const { locale, t } = useLocale()

  const menuConfigs = {
    Visitor: [
      { labelKey: 'common.roles.Visitor.overview', icon: <HouseIcon size={22} />, href: '/visitor/home' },
      { labelKey: 'common.roles.Visitor.address_search', icon: <MagnifyingGlassIcon size={22} />, href: '/visitor/search' },
      { labelKey: 'common.roles.Visitor.codes', icon: <IdentificationCardIcon size={22} />, href: '/visitor/tnas' },
      { labelKey: 'common.roles.Visitor.shipments', icon: <PackageIcon size={22} />, href: '/visitor/shipments' },
      { labelKey: 'common.roles.Visitor.profile', icon: <UserIcon size={22} />, href: '/visitor/profile' },
    ],
    Owner: [
      { labelKey: 'common.roles.Owner.overview', icon: <HouseIcon size={22} />, href: '/owner/home' },
      { labelKey: 'common.roles.Owner.properties', icon: <MagnifyingGlassIcon size={22} />, href: '/owner/properties' },
      { labelKey: 'common.roles.Owner.bindings', icon: <LinkIcon size={22} />, href: '/owner/bindings' },
      { labelKey: 'common.roles.Owner.earnings', icon: <WalletIcon size={22} />, href: '/owner/earnings' },
      { labelKey: 'common.roles.Owner.profile', icon: <UserIcon size={22} />, href: '/owner/profile' },
    ],
    Carrier: [
      { labelKey: 'common.roles.Carrier.overview', icon: <HouseIcon size={22} />, href: '/carrier/home' },
      { labelKey: 'common.roles.Carrier.resolve', icon: <MagnifyingGlassIcon size={22} />, href: '/carrier/resolve' },
      { labelKey: 'common.roles.Carrier.shipments', icon: <PackageIcon size={22} />, href: '/carrier/shipments' },
      { labelKey: 'common.roles.Carrier.staff', icon: <UsersIcon size={22} />, href: '/carrier/staff' },
      { labelKey: 'common.roles.Carrier.tasks', icon: <NavigationArrowIcon size={22} />, href: '/carrier/driver/tasks' },
      { labelKey: 'common.roles.Carrier.settings', icon: <GearIcon size={22} />, href: '/carrier/settings/integration' },
      { labelKey: 'common.roles.Carrier.profile', icon: <UserIcon size={22} />, href: '/carrier/profile' },
    ],
    Gov: [
      { labelKey: 'common.roles.Gov.overview', icon: <HouseIcon size={22} />, href: '/gov/home' },
      { labelKey: 'common.roles.Gov.tna_queue', icon: <ChartBarIcon size={22} />, href: '/gov/tna-queue' },
      { labelKey: 'common.roles.Gov.address_queue', icon: <MapPinIcon size={22} />, href: '/gov/address-queue' },
      { labelKey: 'common.roles.Gov.adjustments', icon: <GearIcon size={22} />, href: '/gov/adjustments' },
      { labelKey: 'common.roles.Gov.audit', icon: <FingerprintIcon size={22} />, href: '/gov/audit' },
      { labelKey: 'common.roles.Gov.agencies', icon: <UsersIcon size={22} />, href: '/gov/agencies' },
      { labelKey: 'common.roles.Gov.policy', icon: <GearIcon size={22} />, href: '/gov/policy' },
      { labelKey: 'common.roles.Gov.profile', icon: <UserIcon size={22} />, href: '/gov/profile' },
    ],
  }

  interface MenuItem {
    labelKey: string;
    icon: React.ReactNode;
    href: string;
  }

  const menuItems: MenuItem[] = (menuConfigs as any)[role] || (menuConfigs as any)[{
    VISITOR: 'Visitor',
    OWNER: 'Owner',
    CARRIER_STAFF: 'Carrier',
    GOV_USER: 'Gov'
  }[role as string] || 'Visitor'] || []
  
  return (
    <div className="flex h-full flex-col text-start font-english">
      {/* Header Block with Logo + Role Badge (hidden when collapsed) */}
      {!collapsed && (
        <div className="px-4 py-6 border-b border-white/10 mb-2">
          <div className="flex items-center gap-3">
            {/* TNA Logo Image */}
            <div className="h-10 w-10 rounded-lg bg-white/10 flex items-center justify-center shadow-sm">
              <Image
                src="/brand/logo.svg"
                alt="TNA Logo"
                width={28}
                height={28}
                className="drop-shadow-sm"
              />
            </div>
            <div className="flex flex-col">
              <span className="font-bold text-white text-lg leading-none tracking-tight">TNA</span>
              <span className="text-xs text-white/70 mt-0.5 uppercase font-semibold tracking-wide">{role}</span>
            </div>
          </div>
        </div>
      )}
      
      {/* Profile Section - Dynamically injected for Owner (hidden when collapsed) */}
      {!collapsed && <SidebarProfile role={role} />}

      {/* Navigation Menu */}
      <nav className="flex-1 py-2 px-3 space-y-1 overflow-y-auto no-scrollbar">
        {menuItems.map((item) => {
          const localizedHref = `/${locale}${item.href}`
          const isActive = pathname === localizedHref || (item.href !== '/visitor/home' && item.href !== '/owner/home' && pathname.startsWith(`${localizedHref}/`))
          
          return (
            <Link
              key={item.href}
              href={`/${locale}${item.href}`}
              className={`flex items-center gap-3 rounded-md px-3 py-2.5 text-sm font-medium transition-all duration-fast ${
                isActive
                  ? 'bg-white/10 text-white border-s-3 border-sky-400 bg-white/8'
                  : 'text-neutral-300 hover:bg-white/5 hover:text-white border-s-3 border-transparent'
              }`}
            >
              <span className={`transition-transform duration-fast flex items-center ${isActive ? 'text-white' : 'text-neutral-400'}`}>
                {item.icon}
              </span>
              {/* Hide text labels when collapsed */}
              {!collapsed && <span>{t(item.labelKey)}</span>}
              {/* Add aria-label for accessibility when collapsed */}
              {collapsed && (
                <span className="sr-only">{t(item.labelKey)}</span>
              )}
            </Link>
          )
        })}
      </nav>

      {/* Bottom Support Section (hidden when collapsed) */}
      {!collapsed && (
        <div className="p-4 border-t border-white/10">
          <div className="rounded-md bg-surface-200/10 p-3 border border-white/5 shadow-inner">
            <div className="flex items-center gap-2 mb-2">
              <QuestionIcon size={16} className="text-neutral-300" weight="fill" />
              <p className="text-[10px] font-semibold text-neutral-400 uppercase tracking-wider">{t('common.support')}</p>
            </div>
            <p className="text-xs text-neutral-300 font-medium leading-relaxed">
              {t('common.logged_in_as').replace('{role}', t(`common.roles.${role}.overview`))}
            </p>
          </div>
        </div>
      )}
    </div>
  )
}

