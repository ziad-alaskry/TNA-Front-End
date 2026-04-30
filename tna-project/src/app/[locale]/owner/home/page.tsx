'use client'

import React from 'react'
import { AppShell } from '@/components/layout/AppShell'
import { DashboardLayout } from '@/components/templates/DashboardLayout'
import { 
    House, 
    Link as LinkIcon, 
    Wallet, 
    ArrowUpRight, 
    TrendUp, 
    PlusCircle,
    CaretRight,
    ChartLineUp
} from '@phosphor-icons/react'
import { useBindingContext } from '@/context/BindingContext'
import { useRouter, useParams } from 'next/navigation'
import { useLocale } from '@/i18n/LocaleProvider'
import { RoleGuard } from '@/components/shared/RoleGuard'
import WithdrawalWizard from '@/components/modules/owner/WithdrawalWizard'

export default function OwnerHomePage() {
  const { ownerAccount, realEstateObjects } = useBindingContext();
  const router = useRouter();
  const { locale } = useParams();
  const { t, isRTL } = useLocale();

  const [isWithdrawalOpen, setIsWithdrawalOpen] = React.useState(false);

  const stats = [
    { 
        label: t('owner.home.stats.properties'), 
        value: realEstateObjects.length, 
        icon: <House size={24} weight="fill" className="text-primary" /> 
    },
    { 
        label: t('owner.home.stats.bindings'), 
        value: '14', 
        icon: <LinkIcon size={24} weight="fill" className="text-success" /> 
    },
    { 
        label: t('owner.home.stats.earnings'), 
        value: `${ownerAccount.total_earned.toFixed(2)} SAR`, 
        icon: <TrendUp size={24} weight="fill" className="text-secondary" /> 
    },
    { 
        label: t('owner.home.stats.balance'), 
        value: `${ownerAccount.current_balance.toFixed(2)} SAR`, 
        icon: <Wallet size={24} weight="fill" className="text-primary" /> 
    },
  ];

  const recentRequests = [
    {
        id: 'req-101',
        title: t('owner.home.activity1_title'),
        description: t('owner.home.activity1_desc'),
        timestamp: t('owner.home.time_15m'),
        status: 'pending' as const
    },
    {
        id: 'req-99',
        title: t('owner.home.activity2_title'),
        description: t('owner.home.activity2_desc'),
        timestamp: t('owner.home.time_2h'),
        status: 'success' as const
    }
  ];

  return (
    <RoleGuard requiredRole="Owner">
      <AppShell role="Owner" header={t('owner.home.header')}>
        <DashboardLayout
          title={t('owner.home.title')}
          subtitle={t('owner.home.subtitle')}
          stats={stats}
          activity={recentRequests}
        >
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mt-8">
              {/* Main Action Card */}
              <div className="lg:col-span-2 p-8 rounded-md bg-btn-primary text-white relative overflow-hidden flex flex-col justify-between min-h-[240px]">
                  <div className="relative z-10 text-start">
                      <h3 className="text-2xl font-bold mb-2">{t('owner.home.cta.title')}</h3>
                      <p className="opacity-80 text-sm max-w-md leading-relaxed">
                          {t('owner.home.cta.description')}
                      </p>
                  </div>
                  <div className="relative z-10 pt-6 flex justify-start">
                      <button 
                          onClick={() => router.push(`/${locale}/owner/property/add`)}
                          className="h-12 px-8 rounded-pill bg-white text-primary font-bold flex items-center gap-2 hover:bg-neutral-50 transition-colors shadow-lg"
                      >
                          <PlusCircle size={20} weight="fill" />
                          {t('owner.home.cta.button')}
                      </button>
                  </div>
                  <House size={160} weight="duotone" className={`absolute -bottom-10 text-white/10 rotate-12 pointer-events-none ${isRTL ? '-left-10' : '-right-10'}`} />
              </div>

              {/* Quick Balance Card */}
              <div className="p-6 rounded-md border border-neutral-200 bg-surface-200 flex flex-col justify-between text-start">
                  <div>
                      <div className="flex justify-between items-center mb-4">
                          <span className="text-[10px] uppercase font-bold text-neutral-400 tracking-wider font-mono">{t('owner.home.withdraw.title')}</span>
                          <ArrowUpRight size={18} className="text-neutral-300" />
                      </div>
                      <p className="text-sm text-neutral-500 font-medium mb-1">{t('owner.home.withdraw.current_balance')}</p>
                      <h4 className="text-2xl font-bold text-neutral-900">{ownerAccount.current_balance.toFixed(2)} SAR</h4>
                  </div>
                  <div className="pt-4 mt-4 border-t border-neutral-100 flex gap-2">
                      <button 
                          onClick={() => router.push(`/${locale}/owner/earnings`)}
                          className="flex-1 h-10 text-xs font-bold text-primary hover:bg-primary/5 rounded-sm transition-colors border border-primary/20"
                      >
                          {t('owner.home.withdraw.statement')}
                      </button>
                      <button 
                        onClick={() => setIsWithdrawalOpen(true)}
                        className="flex-1 h-10 text-xs font-bold bg-neutral-900 text-white rounded-sm hover:bg-black transition-colors"
                      >
                          {t('owner.home.withdraw.transfer')}
                      </button>
                  </div>
              </div>
          </div>

          {/* Revenue Analytics Preview */}
          <div className="mt-8 p-6 rounded-md border border-neutral-200 bg-surface-200 text-start">
              <div className="flex justify-between items-center mb-6">
                  <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-md bg-success/10 flex items-center justify-center text-success">
                          <ChartLineUp size={20} weight="bold" />
                      </div>
                      <h3 className="font-bold text-neutral-900">{t('owner.home.analytics.title')}</h3>
                  </div>
                  <button className="text-xs font-bold text-neutral-400 hover:text-primary flex items-center gap-1 transition-colors">
                      {t('owner.home.analytics.view_details')}
                      <CaretRight size={14} className={isRTL ? 'rotate-180' : ''} />
                  </button>
              </div>
              
              {/* Mock Chart Area */}
              <div className="h-[200px] w-full bg-surface-100 rounded border border-neutral-100 border-dashed flex items-center justify-center relative overflow-hidden">
                  <div className="absolute inset-0 flex items-end px-4 pb-4 gap-2">
                      {[30, 45, 25, 60, 55, 80, 40].map((h, i) => (
                          <div key={i} className="flex-1 bg-primary/20 rounded-t-sm hover:bg-primary transition-colors relative group" style={{ height: `${h}%` }}>
                              <div className="absolute -top-8 left-1/2 -translate-x-1/2 bg-neutral-900 text-white text-[10px] px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity">
                                  {h*10} SAR
                              </div>
                          </div>
                      ))}
                  </div>
                  <p className="text-xs text-neutral-400 font-medium z-10 px-6 py-2 bg-white/50 backdrop-blur-sm rounded-pill border border-neutral-200">{t('owner.home.analytics.placeholder')}</p>
              </div>
          </div>

          <WithdrawalWizard 
            isOpen={isWithdrawalOpen} 
            onClose={() => setIsWithdrawalOpen(false)} 
            balance={ownerAccount.current_balance} 
          />
        </DashboardLayout>
      </AppShell>
    </RoleGuard>
  )
}
