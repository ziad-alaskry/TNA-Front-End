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
    NavigationArrow as NavigationArrowIcon,
    Fingerprint as FingerprintIcon,
    Users as UsersIcon,
    Package as PackageIcon,
    Link as LinkIcon,
    MapPin as MapPinIcon,
    SignOut
} from '@phosphor-icons/react'
import Image from 'next/image'
import { useLocale } from '@/i18n/LocaleProvider'
import { useAuthStore } from '@/lib/store/useAuthStore'
import { cn } from '@/lib/utils/cn'
import { useRouter } from 'next/navigation'

interface SidebarProps {
  role: 'Visitor' | 'Owner' | 'Gov' | 'Carrier'
  collapsed?: boolean
}

export function SidebarContent({ role, collapsed = false }: SidebarProps) {
  const pathname = usePathname()
  const { locale, t } = useLocale()
  const router = useRouter()
  const { logout } = useAuthStore()

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

   const isCompact = role === 'Carrier' || role === 'Gov'
   
   return (
    <div className="flex h-full flex-col text-start font-english">
       <div
         className={cn(
           "border-b transition-colors",
           collapsed
             ? "flex h-[var(--navbar-height)] items-center justify-center px-2 bg-white border-transparent"
             : "flex min-h-28 items-center px-4 bg-gradient-to-r from-primary to-primary-dark border-white/20"
         )}
       >
         {!collapsed && (
           <div className="flex items-center gap-4">
             <div className="h-12 w-12 flex items-center justify-center">
               <Image
                 src="/brand/logo-clean.svg"
                 alt="TNA Logo"
                 width={44}
                 height={44}
                 className="drop-shadow-sm"
               />
             </div>
             <div className="flex flex-col">
               <span className="font-bold text-white text-lg leading-none tracking-tight">TNA</span>
               <span className="text-xs text-white/70 mt-0.5 uppercase font-semibold tracking-wide">{role}</span>
             </div>
           </div>
         )}
       </div>
       
       {/* Navigation Menu */}
       <nav className={cn(
         "flex-1 py-2 transition-all overflow-hidden",
         isCompact ? "space-y-0.5 px-3" : (collapsed ? "px-2 space-y-1" : "px-3 space-y-1")
       )}>
        {menuItems.map((item) => {
          const localizedHref = `/${locale}${item.href}`
          const isActive = pathname === localizedHref || (item.href !== '/visitor/home' && item.href !== '/owner/home' && pathname.startsWith(`${localizedHref}/`))
          
          return (
            <Link
              key={item.href}
              href={`/${locale}${item.href}`}
              className={cn(
                "flex items-center gap-3 rounded-md py-2.5 text-sm font-medium transition-all duration-300",
                collapsed ? "justify-center px-0" : "px-3",
                isActive
                  ? 'bg-[#e6f4fb] text-[#0E8FD1] border-s-3 border-[#0E8FD1]'
                  : 'text-[#374151] hover:bg-[#f2f7fb] hover:text-[#1a2736] border-s-3 border-transparent'
              )}
            >
              <span className={cn(
                "transition-transform duration-300 flex items-center shrink-0",
                isActive ? 'text-[#0E8FD1] scale-110' : 'text-[#374151]'
              )}>
                {item.icon}
              </span>
              {/* Hide text labels when collapsed */}
              {!collapsed && <span className="truncate">{t(item.labelKey)}</span>}
              {/* Add aria-label for accessibility when collapsed */}
              {collapsed && (
                <span className="sr-only">{t(item.labelKey)}</span>
              )}
            </Link>
          )
        })}
      </nav>

      {/* Sign-Out Footer (hidden when collapsed) */}
      {!collapsed && (
        <div className="p-3 border-t border-[var(--divider-strong)]">
          <button
            onClick={() => {
              logout()
              router.push(`/${locale}/visitor/home`)
            }}
            className="flex items-center gap-3 px-3 py-2.5 text-sm font-medium text-[#b91c1c] hover:bg-[#fef2f2] rounded-md transition-colors w-full"
          >
            <SignOut size={22} weight="bold" className="text-[#b91c1c]" />
            <span>{t('common.signOut')}</span>
          </button>
        </div>
      )}

      {/* Sign-Out Button (collapsed state - icon only) */}
      {collapsed && (
        <div className="p-3 border-t border-[var(--divider-strong)] flex justify-center">
          <button
            onClick={() => {
              logout()
              router.push(`/${locale}/visitor/home`)
            }}
            className="flex items-center justify-center px-2 py-2 text-sm font-medium text-[#b91c1c] hover:bg-[#fef2f2] rounded-md transition-colors"
            aria-label={t('common.signOut')}
          >
            <SignOut size={22} weight="bold" className="text-[#b91c1c]" />
            <span className="sr-only">{t('common.signOut')}</span>
          </button>
        </div>
      )}
    </div>
  )
}

