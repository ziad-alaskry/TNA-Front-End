'use client'

import React from 'react'
import { AppShell } from '@/components/layout/AppShell'
import { DashboardLayout } from '@/components/templates/DashboardLayout'
import { 
    Truck as TruckIcon, 
    Package as PackageIcon, 
    Clock as ClockIcon, 
    ShieldCheck as ShieldCheckIcon, 
    Users as UsersIcon, 
    ChartBar as ChartBarIcon, 
    CaretRight as CaretRightIcon,
    MapPin as MapPinIcon,
    ArrowRight as ArrowRightIcon
} from '@phosphor-icons/react'
import { useRouter, useParams } from 'next/navigation'
import { useLocale } from '@/i18n/LocaleProvider'
import { RoleGuard } from '@/components/shared/RoleGuard'

export default function CarrierHomePage() {
  const router = useRouter();
  const { locale } = useParams();
  const { t, isRTL } = useLocale();

  const stats = [
    { 
        label: t('carrier.home.stats.fleet_size'), 
        value: t('carrier.home.mock_fleet_size'), 
        icon: <TruckIcon size={24} weight="fill" className="text-primary" /> 
    },
    { 
        label: t('carrier.home.stats.active_shipments'), 
        value: t('carrier.home.mock_active_shipments'), 
        icon: <PackageIcon size={24} weight="fill" className="text-success" /> 
    },
    { 
        label: t('carrier.home.stats.available_drivers'), 
        value: t('carrier.home.mock_drivers'), 
        icon: <UsersIcon size={24} weight="fill" className="text-secondary" /> 
    },
    { 
        label: t('carrier.home.stats.pending_distribution'), 
        value: t('carrier.home.mock_pending'), 
        icon: <ClockIcon size={24} weight="fill" className="text-warning" /> 
    },
  ];

  const activity = [
    {
      id: '1',
      title: t('carrier.home.activity1_title'),
      description: t('carrier.home.activity1_desc'),
      timestamp: t('carrier.home.time_15m'),
      status: 'success' as const,
    },
    {
      id: '2',
      title: t('carrier.home.activity2_title'),
      description: t('carrier.home.activity2_desc'),
      timestamp: t('carrier.home.time_2h'),
      status: 'pending' as const,
    },
    {
      id: '3',
      title: t('carrier.home.activity3_title'),
      description: t('carrier.home.activity3_desc'),
      timestamp: t('carrier.home.time_yesterday'),
      status: 'success' as const,
    },
  ];

  return (
    <RoleGuard requiredRole="Carrier">
      <AppShell role="Carrier" header={t('carrier.home.header')}>
        <DashboardLayout
          title={t('carrier.home.title')}
          subtitle={t('carrier.home.subtitle')}
          stats={stats}
          activity={activity}
        >
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mt-8">
              {/* Fleet Utilization Card */}
              <div className="lg:col-span-2 p-6 rounded-md border border-neutral-200 bg-surface-200 text-start">
                  <div className="flex justify-between items-center mb-6">
                      <h3 className="font-bold text-neutral-900 flex items-center gap-2">
                          <ChartBarIcon size={20} className="text-primary" weight="fill" />
                          {t('carrier.home.utilization.title')}
                      </h3>
                      <button className="text-[10px] font-bold text-neutral-400 hover:text-primary transition-colors uppercase tracking-widest">{t('carrier.home.utilization.view_report')}</button>
                  </div>
                  <div className="flex items-end gap-2 h-40">
                      {[65, 40, 85, 70, 90, 55, 80].map((h, i) => (
                          <div key={i} className="flex-1 flex flex-col items-center gap-2">
                              <div className="w-full bg-primary/10 rounded-t-sm relative group cursor-pointer hover:bg-primary/20 transition-colors" style={{ height: `${h}%` }}>
                                  <div className="absolute -top-8 left-1/2 -translate-x-1/2 bg-neutral-900 text-white text-[10px] px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity">
                                      {h}%
                                  </div>
                              </div>
                              <span className="text-[9px] font-bold text-neutral-400 font-mono italic uppercase tracking-tighter">{t('carrier.home.utilization.day_label')} {i+1}</span>
                          </div>
                      ))}
                  </div>
              </div>

              {/* Tasks Quick Access */}
              <div className="p-6 rounded-md bg-btn-primary text-white flex flex-col justify-between text-start">
                  <div>
                      <h4 className="text-lg font-bold mb-2">{t('carrier.home.tasks.title')}</h4>
                      <p className="text-xs opacity-70 leading-relaxed">
                          {t('carrier.home.tasks.description')}
                      </p>
                  </div>
                  <div className="space-y-2 mt-6">
                      <button 
                          onClick={() => router.push(`/${locale}/carrier/shipments`)}
                          className="w-full h-10 bg-white text-primary rounded-sm font-bold text-xs flex items-center justify-center gap-2 shadow-sm hover:bg-neutral-50 transition-colors"
                      >
                          <MapPinIcon size={16} weight="fill" />
                          {t('carrier.home.tasks.map_button')}
                      </button>
                      <button 
                          onClick={() => router.push(`/${locale}/carrier/fleet`)}
                          className="w-full h-10 bg-white/20 text-white rounded-sm font-bold text-xs hover:bg-white/30 transition-colors"
                      >
                          {t('carrier.home.tasks.manage_fleet')}
                      </button>
                  </div>
              </div>
          </div>

          {/* Live Tracking Banner */}
          <div className="mt-8 p-4 rounded-md border border-primary/20 bg-primary/5 flex flex-col md:flex-row items-center justify-between gap-4 text-start">
              <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-full bg-primary/20 flex items-center justify-center text-primary relative">
                      <MapPinIcon size={24} weight="fill" />
                      <span className="absolute -top-1 -right-1 w-3 h-3 bg-error rounded-full border-2 border-white animate-pulse" />
                  </div>
                  <div>
                      <p className="text-sm font-bold text-neutral-900">{t('carrier.home.tracking.title')}</p>
                      <p className="text-xs text-neutral-500">{t('carrier.home.tracking.description').replace('{count}', t('carrier.home.mock_pending'))}</p>
                  </div>
              </div>
              <button className="h-9 px-6 bg-neutral-900 text-white text-xs font-bold rounded-pill hover:bg-black transition-colors flex items-center gap-2">
                  {t('carrier.home.tracking.button')}
                  <ArrowRightIcon size={14} className={isRTL ? 'rotate-180' : ''} />
              </button>
          </div>
        </DashboardLayout>
      </AppShell>
    </RoleGuard>
  )
}
