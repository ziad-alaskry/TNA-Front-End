'use client'

import React, { useState } from 'react'
import { Wallet, TrendingUp, Clock, Loader2, AlertCircle } from 'lucide-react'
import EmptyState from '@/components/shared/EmptyState'
import { useLocale } from '@/i18n/LocaleProvider'

export default function OwnerEarningsPage() {
  const { t } = useLocale()
  const [isLoading, setIsLoading] = useState(false)
  const [availableBalance, setAvailableBalance] = useState(0) // Start with 0 to show empty state
  const minWithdrawal = 1000

  if (availableBalance === 0) {
    return (
      <div className="p-8 space-y-8 font-rubik">
        <h1 className="text-3xl font-bold tracking-tight text-slate-900">{t('owner.earnings.title')}</h1>
        <EmptyState 
          icon={AlertCircle}
          title={t('owner.earnings.empty_title')}
          description={t('owner.earnings.empty_description')}
          actionLabel={t('owner.earnings.empty_action')}
          onAction={() => window.location.href = '/owner/properties'}
        />
      </div>
    )
  }

  const metrics = [
    { label: t('owner.earnings.total_earned'), value: '124,500 SAR', icon: <TrendingUp className="text-emerald-500" /> },
    { label: t('owner.earnings.available_balance'), value: `${availableBalance.toLocaleString()} SAR`, icon: <Wallet className="text-blue-500" /> },
    { label: t('owner.earnings.pending_payouts'), value: '3,200 SAR', icon: <Clock className="text-amber-500" /> },
  ]

  const handleWithdraw = async () => {
    setIsLoading(true)
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 2000))
    setIsLoading(false)
    alert(t('common.confirm')) // Placeholder for success
  }

  return (
    <div className="p-8 font-rubik space-y-8">
      {/* Wallet Header */}
      <div className="relative overflow-hidden rounded-lg bg-[linear-gradient(135deg,#02488D,#00B4C9)] p-8 text-white shadow-lg">
        <div className="relative z-10 flex flex-col md:flex-row md:items-center md:justify-between gap-6">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">{t('owner.earnings.title')}</h1>
            <p className="mt-2 text-cyan-50 opacity-90">{t('owner.earnings.subtitle')}</p>
          </div>
          <div className="flex flex-col items-start md:items-end gap-3">
            <div className="text-right">
              <p className="text-xs font-medium uppercase tracking-wider text-cyan-100 opacity-80">{t('owner.earnings.available_for_withdrawal')}</p>
              <p className="text-4xl font-black">{availableBalance.toLocaleString()} <span className="text-xl font-normal">SAR</span></p>
            </div>
            <button
              onClick={handleWithdraw}
              disabled={availableBalance < minWithdrawal || isLoading}
              className={`flex items-center gap-2 rounded-md px-6 py-3 text-sm font-bold shadow-sm transition-all
                ${availableBalance < minWithdrawal || isLoading
                  ? 'bg-white/20 cursor-not-allowed text-white/50'
                  : 'bg-white text-primitive-navy hover:bg-cyan-50 active:scale-95'
                }`}
            >
              {isLoading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Wallet className="h-4 w-4" />}
              {isLoading ? t('owner.earnings.processing') : t('owner.earnings.withdraw_funds')}
            </button>
            {availableBalance < minWithdrawal && (
              <p className="text-xs text-red-200">{t('owner.earnings.min_withdrawal').replace('{amount}', String(minWithdrawal))}</p>
            )}
          </div>
        </div>
        
        {/* Decorative elements */}
        <div className="absolute -bottom-12 -right-12 h-64 w-64 rounded-full bg-white/10 blur-3xl" />
        <div className="absolute -top-12 -left-12 h-64 w-64 rounded-full bg-cyan-400/10 blur-3xl" />
      </div>

      {/* Metrics Grid */}
      <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
        {metrics.map((metric, idx) => (
          <div 
            key={idx} 
            className="flex items-center gap-4 rounded-lg border border-slate-200 bg-white p-6 shadow-sm transition-hover hover:shadow-md"
          >
            <div className="flex h-12 w-12 items-center justify-center rounded-full bg-slate-50 border border-slate-100">
              {metric.icon}
            </div>
            <div>
              <p className="text-xs font-semibold uppercase tracking-wider text-slate-500">{metric.label}</p>
              <p className="text-xl font-bold text-slate-900">{metric.value}</p>
            </div>
          </div>
        ))}
      </div>

      {/* Recent Activity Placeholder */}
      <div className="rounded-lg border border-slate-200 bg-white p-6 shadow-sm">
        <h2 className="mb-4 text-lg font-bold text-slate-900">{t('owner.earnings.recent_transactions')}</h2>
        <div className="flex flex-col items-center justify-center py-12 text-slate-400">
          <Clock size={48} className="mb-4 opacity-20" />
          <p>{t('owner.earnings.no_transactions')}</p>
        </div>
      </div>
    </div>
  )
}
