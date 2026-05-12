'use client'

import React from 'react'
import { useAuthStore } from '@/lib/store/useAuthStore'
import { useWallet } from '@/lib/hooks/useWallet'
import { User, SignOut, ShieldCheck, Wallet, Building, Truck, Bank } from '@phosphor-icons/react'
import { cn } from '@/lib/utils/cn'
import { useLocale } from '@/i18n/LocaleProvider'

interface ProfileModuleProps {
  role: 'Visitor' | 'Owner' | 'Carrier' | 'Gov'
}

export function ProfileModule({ role }: ProfileModuleProps) {
  const { user, logout } = useAuthStore()
  const { balance } = useWallet()
  const { t } = useLocale()

  // Mock data for display - in real app these would come from stores
  const mockData = {
    Owner: {
      propertiesCount: 5,
      // ...other owner-specific
    },
    Carrier: {
      fleetSize: 12,
    },
    Gov: {
      department: 'Monitoring & Compliance',
    }
  }

  const getRoleBadgeColor = () => {
    switch (role) {
      case 'Visitor': return 'bg-blue-100 text-blue-700'
      case 'Owner': return 'bg-emerald-100 text-emerald-700'
      case 'Carrier': return 'bg-amber-100 text-amber-700'
      case 'Gov': return 'bg-purple-100 text-purple-700'
    }
  }

  return (
    <div className="space-y-6">
      {/* Profile Header */}
      <div className="flex items-center gap-4">
        <div className="h-20 w-20 rounded-full bg-primary/10 flex items-center justify-center text-primary border-2 border-primary/20">
          <User size={40} weight="duotone" />
        </div>
        <div>
          <h2 className="text-2xl font-bold text-neutral-900">{user?.full_name || 'User Name'}</h2>
          <span className={cn(
            "inline-block mt-1 px-3 py-1 text-xs font-bold uppercase tracking-wider rounded-full",
            getRoleBadgeColor()
          )}>
            {t(`common.roles.${role}.overview`)}
          </span>
        </div>
      </div>

      {/* Role-specific info sections */}
      <div className="grid gap-4 md:grid-cols-2">
        
        {/* KYC Status (Visitor only) */}
        {role === 'Visitor' && (
          <div className="p-4 rounded-lg border border-neutral-200 bg-surface-50">
            <div className="flex items-center gap-2 mb-2">
              <ShieldCheck size={20} className="text-success" weight="fill" />
              <h3 className="font-semibold text-neutral-900">{t('profile.kycStatus.title')}</h3>
            </div>
            <p className="text-sm text-success font-bold">{t('profile.kycStatus.verified')}</p>
          </div>
        )}

        {/* Wallet Balance (Visitor & Owner) */}
        {(role === 'Visitor' || role === 'Owner') && (
          <div className="p-4 rounded-lg border border-neutral-200 bg-surface-50">
            <div className="flex items-center gap-2 mb-2">
              <Wallet size={20} className="text-primary" />
              <h3 className="font-semibold text-neutral-900">{t('profile.wallet.title')}</h3>
            </div>
            <p className="text-xl font-bold text-primary">{balance.toLocaleString()} SAR</p>
            <p className="text-xs text-neutral-500 mt-1">{t('profile.wallet.available')}</p>
          </div>
        )}

        {/* Properties Count (Owner only) */}
        {role === 'Owner' && (
          <div className="p-4 rounded-lg border border-neutral-200 bg-surface-50">
            <div className="flex items-center gap-2 mb-2">
              <Building size={20} className="text-emerald-600" />
              <h3 className="font-semibold text-neutral-900">{t('profile.properties.title')}</h3>
            </div>
            <p className="text-2xl font-bold text-emerald-600">{mockData.Owner.propertiesCount}</p>
            <p className="text-xs text-neutral-500 mt-1">{t('profile.properties.count', { count: mockData.Owner.propertiesCount })}</p>
          </div>
        )}

        {/* Fleet Size (Carrier only) */}
        {role === 'Carrier' && (
          <div className="p-4 rounded-lg border border-neutral-200 bg-surface-50">
            <div className="flex items-center gap-2 mb-2">
              <Truck size={20} className="text-amber-600" />
              <h3 className="font-semibold text-neutral-900">{t('profile.fleet.title')}</h3>
            </div>
            <p className="text-2xl font-bold text-amber-600">{mockData.Carrier.fleetSize}</p>
            <p className="text-xs text-neutral-500 mt-1">{t('profile.fleet.count', { count: mockData.Carrier.fleetSize })}</p>
          </div>
        )}

        {/* Department (Gov only) */}
        {role === 'Gov' && (
          <div className="p-4 rounded-lg border border-neutral-200 bg-surface-50">
            <div className="flex items-center gap-2 mb-2">
              <Bank size={20} className="text-purple-600" />
              <h3 className="font-semibold text-neutral-900">{t('profile.department.title')}</h3>
            </div>
            <p className="text-sm font-bold text-purple-600">{mockData.Gov.department}</p>
            <p className="text-xs text-neutral-500 mt-1">{t('common.roles.Gov.overview')}</p>
          </div>
        )}
      </div>

      {/* Logout Button */}
      <div className="pt-4 border-t border-neutral-200">
        <button
          onClick={logout}
          className="flex items-center gap-2 px-4 py-3 w-full rounded-lg border border-error/20 bg-error/5 text-error hover:bg-error/10 transition-colors font-semibold"
        >
          <SignOut size={20} />
          <span>{t('profile.logout')}</span>
        </button>
      </div>
    </div>
  )
}
