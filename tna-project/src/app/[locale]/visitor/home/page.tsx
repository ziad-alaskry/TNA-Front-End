'use client'

import React from 'react'
import { AppShell } from '@/components/layout/AppShell'
import { DashboardLayout } from '@/components/templates/DashboardLayout'
import { 
    MagnifyingGlass, 
    Wallet, 
    ArrowRight, 
    Clock, 
    CheckCircle, 
    PlusCircle,
    Package
} from '@phosphor-icons/react'
import { useBindingContext } from '@/context/BindingContext'
import { useRouter, useParams } from 'next/navigation'
import { cn } from '@/lib/utils/cn'
import { useLocale } from '@/i18n/LocaleProvider'
import { RoleGuard } from '@/components/shared/RoleGuard'
import EmptyState from '@/components/ui/EmptyState'

export default function VisitorHomePage() {
  const router = useRouter();
  const { locale } = useParams();
  const { t, isRTL } = useLocale();
  const { visitorTnas, ownerAccount } = useBindingContext();

  const activeTnas = visitorTnas.filter(tna => tna.status === 'ACTIVE');
  const pendingTnas = visitorTnas.filter(tna => tna.status === 'PENDING_OWNER_APPROVAL');

  const stats = [
    { 
        label: t('visitor.home.addresses.linked_success'), 
        value: activeTnas.length, 
        icon: <CheckCircle size={24} weight="fill" className="text-success" /> 
    },
    { 
        label: t('common.statuses.PENDING'), 
        value: pendingTnas.length, 
        icon: <Clock size={24} weight="fill" className="text-warning" /> 
    },
    { 
        label: t('visitor.home.shipments.title'), 
        value: 0, 
        icon: <Package size={24} weight="fill" className="text-primary" /> 
    },
    { 
        label: t('common.roles.Visitor.wallet'), 
        value: `SAR ${ownerAccount.current_balance}`, 
        icon: <Wallet size={24} weight="fill" className="text-primary" /> 
    },
  ];

  const recentActivity = [
    ...(activeTnas.map(tna => ({
        id: tna.tna_id,
        title: t('visitor.home.addresses.linked_success'),
        description: `${t('visitor.home.addresses.title')} ${tna.tna_code} ${t('common.statuses.ACTIVE')}.`,
        timestamp: t('visitor.home.time_2_days'),
        status: 'success' as const
    }))),
    ...(pendingTnas.map(tna => ({
        id: tna.tna_id,
        title: t('common.statuses.PENDING'),
        description: t('visitor.home.pending_approval_desc'),
        timestamp: t('visitor.home.time_1_hour'),
        status: 'pending' as const
    })))
  ];

  return (
    <RoleGuard requiredRole="Visitor">
      <AppShell role="Visitor" header={t('common.roles.Visitor.overview')}>
        <DashboardLayout
          title={t('visitor.home.title')}
          subtitle={t('visitor.home.subtitle')}
          stats={stats}
          activity={recentActivity.slice(0, 5)}
        >
          {/* Quick Actions Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-8">
              <button 
                  onClick={() => router.push(`/${locale}/visitor/search`)}
                  className="group p-6 rounded-md border border-neutral-200 bg-surface-200 shadow-card hover:shadow-modal transition-all text-start flex items-center justify-between"
              >
                  <div>
                      <div className="w-12 h-12 rounded-md bg-primary/10 flex items-center justify-center text-primary mb-4 group-hover:bg-primary group-hover:text-white transition-colors">
                          <PlusCircle size={28} weight="fill" />
                      </div>
                      <h3 className="text-subheading font-bold text-neutral-900">{t('visitor.home.actions.create_new')}</h3>
                      <p className="text-caption text-neutral-500 mt-1">{t('visitor.home.actions.create_new_desc')}</p>
                  </div>
                  <ArrowRight size={24} className={cn("text-neutral-300 group-hover:text-primary transition-colors", isRTL && "rotate-180")} />
              </button>

              <button 
                  onClick={() => router.push(`/${locale}/visitor/wallet`)}
                  className="group p-6 rounded-md border border-neutral-200 bg-surface-200 shadow-card hover:shadow-modal transition-all text-start flex items-center justify-between"
              >
                  <div>
                      <div className="w-12 h-12 rounded-md bg-primary/10 flex items-center justify-center text-primary mb-4 group-hover:bg-primary group-hover:text-white transition-colors">
                          <Wallet size={28} weight="fill" />
                      </div>
                      <h3 className="text-subheading font-bold text-neutral-900">{t('common.roles.Visitor.wallet')}</h3>
                      <p className="text-caption text-neutral-500 mt-1">{t('visitor.home.actions.wallet_desc')}</p>
                  </div>
                  <ArrowRight size={24} className={cn("text-neutral-300 group-hover:text-primary transition-colors", isRTL && "rotate-180")} />
              </button>
          </div>

          {/* Status Breakdown Section */}
          <div className="mt-12 text-start">
              <h2 className="text-lg font-bold text-neutral-900 mb-6 px-1">{t('visitor.home.addresses.linked_success')}</h2>
              {activeTnas.length === 0 ? (
                  <EmptyState
                    icon={Package}
                    title={t('visitor.home.empty_active.title')}
                    description={t('visitor.home.empty_active.desc')}
                    actionLabel={t('visitor.home.empty_active.action')}
                    onAction={() => router.push(`/${locale}/visitor/search`)}
                  />
              ) : (
                  <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                      {activeTnas.map(tna => (
                          <div key={tna.tna_id} className="p-5 border border-neutral-200 bg-surface-200 rounded-md shadow-card hover:border-primary/50 transition-colors cursor-pointer group" onClick={() => router.push(`/${locale}/visitor/tnas/${tna.tna_id}`)}>
                              <div className="flex justify-between items-start mb-4">
                                  <span className="px-2 py-1 bg-success-bg text-success text-[10px] font-bold rounded uppercase tracking-wider">{t('common.statuses.ACTIVE')}</span>
                                  <CheckCircle size={20} className="text-success" weight="fill" />
                              </div>
                              <div className="space-y-1">
                                  <p className="text-xs text-neutral-400 font-medium">{t('visitor.home.addresses.code')}</p>
                                  <p className="text-xl font-mono font-bold text-neutral-900 tracking-wider transition-colors group-hover:text-primary">{tna.tna_code}</p>
                              </div>
                              <div className="mt-4 pt-4 border-t border-neutral-100 flex justify-between items-center">
                                  <span className="text-xs text-neutral-500">{t('visitor.home.addresses.until_date')} 2026/10/15</span>
                                  <ArrowRight size={16} className={cn("text-neutral-400 group-hover:text-primary", isRTL && "rotate-180")} />
                              </div>
                          </div>
                      ))}
                  </div>
              )}
          </div>
        </DashboardLayout>
      </AppShell>
    </RoleGuard>
  )
}
