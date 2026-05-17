'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { 
  House, 
  Buildings, 
  Link as LinkIcon, 
  Wallet, 
  TrendUp, 
  PlusCircle, 
  CaretRight, 
  ArrowUpRight,
  ChartLineUp,
  Clock,
  User,
} from '@phosphor-icons/react';
import { useLocale } from '@/i18n/LocaleProvider';
import { useBindingContext } from '@/context/BindingContext';
import { useMock } from '@/lib/hooks/useMock';
import { mockProperties } from '@/lib/mock/properties.mock';
import { mockBindings } from '@/lib/mock/bindings.mock';
import { mockBalances, mockWeeklyRevenue } from '@/lib/mock/financials.mock';
import { cn } from '@/lib/utils/cn';
import Button from '@/components/ui/Button';
import WithdrawalWizard from './WithdrawalWizard';

export default function OwnerHomeModule() {
  const router = useRouter();
  const { locale, isRTL, t } = useLocale();

  const { data: properties } = useMock(mockProperties);
  const { data: bindings } = useMock(mockBindings);
  const { ownerAccount } = useBindingContext();
  const [isWithdrawalOpen, setIsWithdrawalOpen] = useState(false);
  const balance = ownerAccount?.current_balance ?? mockBalances['user-owner-1'] ?? 0;

  const pendingBindings = bindings?.filter(b => b.status === 'PENDING') || [];
  const activeBindings = bindings?.filter(b => b.status === 'ACTIVE') || [];

  return (
    <div className="space-y-8 pb-12 animate-in fade-in duration-700">
      
      {/* TOP STATS GRID */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { label: t('owner.home.stats.properties'), value: properties?.length || 0, icon: Buildings, color: 'text-primary', bg: 'bg-primary/10', path: 'properties' },
          { label: t('owner.home.stats.active_bindings'), value: activeBindings.length, icon: LinkIcon, color: 'text-success', bg: 'bg-success/10', path: 'bindings' },
          { label: t('owner.home.stats.pending_requests'), value: pendingBindings.length, icon: Clock, color: 'text-warning', bg: 'bg-warning/10', path: 'bindings' },
          { label: t('owner.home.stats.total_earnings'), value: `${t('common.currency')} 12,300`, icon: TrendUp, color: 'text-secondary', bg: 'bg-secondary/10', path: 'earnings' },
        ].map((stat, i) => (
          <div 
            key={i} 
            onClick={() => router.push(`/${locale}/owner/${stat.path}`)}
            className="bg-white p-6 rounded-2xl border border-neutral-100 shadow-sm flex items-center gap-4 group hover:border-primary/20 transition-all cursor-pointer"
          >
            <div className={cn("w-12 h-12 rounded-xl flex items-center justify-center transition-all", stat.bg, stat.color)}>
              <stat.icon size={28} weight="bold" />
            </div>
            <div>
              <p className="text-[10px] font-black text-neutral-400 uppercase tracking-widest">{stat.label}</p>
              <p className="text-2xl font-black text-neutral-900">{stat.value}</p>
            </div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* MAIN CONTENT AREA */}
        <div className="lg:col-span-2 space-y-8">
          
          {/* ACTION BANNER */}
          <section className="relative overflow-hidden rounded-3xl p-8 md:p-10 shadow-2xl" style={{ backgroundImage: 'url(/ownerBanner/ownerBanner.png)', backgroundSize: 'cover', backgroundPosition: 'center' }}>
            <div className="absolute inset-0 bg-primary-dark/70" />
            <div className="relative z-10 space-y-4 max-w-md text-white">
              <h2 className="text-3xl font-black tracking-tight leading-tight">{t('owner.home.banner.title')}</h2>
              <p className="text-white/70 text-sm md:text-base">{t('owner.home.banner.description')}</p>
              <div className="pt-2">
                <Button 
                  onClick={() => router.push(`/${locale}/owner/properties`)}
                  className="bg-white text-primary-dark hover:bg-neutral-100 border-none px-8 py-4 font-bold shadow-xl gap-2"
                >
                  <PlusCircle size={20} weight="fill" />
                  {t('owner.home.banner.cta')}
                </Button>
              </div>
            </div>
            {/* Background Decoration */}
            <House size={200} weight="duotone" className="absolute -bottom-10 -right-10 text-white/5 rotate-12 pointer-events-none" />
          </section>

          {/* PENDING REQUESTS */}
          <section className="space-y-4 text-start">
            <div className="flex items-center justify-between">
              <h3 className="text-xl font-black text-neutral-900 tracking-tight">{t('owner.home.pending.title')}</h3>
              <button 
                onClick={() => router.push(`/${locale}/owner/bindings`)}
                className="text-sm font-bold text-primary flex items-center gap-1 hover:underline"
              >
                {t('common.view_all')}
                <CaretRight size={14} className={cn(isRTL && "rotate-180")} />
              </button>
            </div>

            <div className="space-y-3">
              {pendingBindings.map((bind) => (
                <div 
                  key={bind.binding_id}
                  className="bg-white rounded-2xl border border-neutral-100 shadow-sm p-4 flex items-center gap-4 hover:border-warning/30 transition-all group cursor-pointer"
                  onClick={() => router.push(`/${locale}/owner/bindings`)}
                >
                  <div className="w-12 h-12 rounded-xl bg-warning/10 flex items-center justify-center text-warning group-hover:scale-110 transition-transform">
                    <User size={24} weight="bold" />
                  </div>
                  <div className="flex-1">
                    <div className="flex justify-between items-start">
                      <p className="text-[10px] font-black text-neutral-400 uppercase tracking-widest">{t('owner.home.pending.new_request')}</p>
                      <span className="text-[10px] font-bold text-neutral-500">{new Date(bind.created_at).toLocaleDateString(locale)}</span>
                    </div>
                    <p className="font-bold text-neutral-900">{t('owner.home.pending.request_for_tna')}: <span className="font-mono text-primary">{bind.tna_code}</span></p>
                    <p className="text-xs text-neutral-500 mt-0.5">
                      {t('owner.home.pending.unit')}: {bind.sub_address_id} | {t('owner.home.pending.period')}: {new Date(bind.start_at).toLocaleDateString(locale)} → {new Date(bind.end_at).toLocaleDateString(locale)}
                    </p>
                  </div>
                  <div className="flex gap-2" onClick={(e) => e.stopPropagation()}>
                    <Button size="sm" className="h-8 px-4 text-[10px]" onClick={() => router.push(`/${locale}/owner/bindings`)}>
                      {t('owner.home.pending.accept')}
                    </Button>
                    <Button size="sm" variant="outline" className="h-8 px-4 text-[10px] border-neutral-200">
                      {t('owner.home.pending.decline')}
                    </Button>
                  </div>
                </div>
              ))}
              {pendingBindings.length === 0 && (
                <div className="p-12 bg-neutral-50 rounded-3xl border-2 border-dashed border-neutral-200 text-center">
                  <p className="text-neutral-400 font-medium">{t('owner.home.pending.empty')}</p>
                </div>
              )}
            </div>
          </section>

        </div>

        {/* SIDEBAR AREA */}
        <div className="space-y-8">
          
          {/* WALLET WIDGET */}
          <section className="bg-white rounded-3xl border border-neutral-200 shadow-xl p-6 space-y-6">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Wallet size={20} className="text-primary" weight="fill" />
                <h3 className="text-xs font-black text-neutral-400 uppercase tracking-widest">{t('owner.home.wallet.title')}</h3>
              </div>
              <button 
                onClick={() => router.push(`/${locale}/owner/wallet`)}
                className="p-1 hover:bg-neutral-50 rounded-full transition-colors"
              >
                <ArrowUpRight size={18} className="text-neutral-400" />
              </button>
            </div>
            
            <div>
              <p className="text-[10px] text-neutral-400 font-bold uppercase tracking-widest mb-1">{t('owner.home.wallet.available_balance')}</p>
              <p className="text-4xl font-black text-neutral-900 tracking-tighter">{t('common.currency')} {balance.toFixed(2)}</p>
            </div>

            <div className="pt-2">
              <Button 
                onClick={() => setIsWithdrawalOpen(true)}
                className="w-full py-4 shadow-glow-primary"
              >
                {t('owner.home.wallet.withdraw')}
              </Button>
            </div>

            <div className="h-px bg-neutral-100" />

            <div className="flex items-center justify-between text-xs">
              <span className="text-neutral-500 font-medium">{t('owner.home.wallet.total_withdrawn')}</span>
              <span className="text-neutral-900 font-black">{t('common.currency')} 45,200.00</span>
            </div>
          </section>

           {/* QUICK PERFORMANCE CHART */}
           <section 
             onClick={() => router.push(`/${locale}/owner/earnings`)}
             className="bg-surface-200 rounded-3xl border border-neutral-200 p-6 space-y-4 cursor-pointer hover:border-primary/30 transition-all"
           >
             <div className="flex items-center gap-2">
               <ChartLineUp size={20} className="text-success" />
               <h3 className="text-xs font-black text-neutral-400 uppercase tracking-widest">{t('owner.home.revenue.title')}</h3>
             </div>
             
             <div className="h-32 flex items-end gap-2">
               {mockWeeklyRevenue.map((revenue, i) => {
                 // Calculate percentage based on max revenue for scaling
                 const maxRevenue = Math.max(...mockWeeklyRevenue);
                 const percentage = (revenue / maxRevenue) * 100;
                 
                 return (
                   <div 
                     key={i} 
                     className="flex-1 bg-primary/20 rounded-t-lg transition-all hover:bg-primary cursor-pointer group relative"
                     style={{ height: `${percentage}%` }}
                   >
                     <div className="absolute -top-8 left-1/2 -translate-x-1/2 bg-neutral-900 text-white text-[10px] px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap pointer-events-none">
                       {t('common.currency')} {revenue}
                     </div>
                   </div>
                 );
               })}
             </div>
             <div className="flex justify-between text-[10px] font-bold text-neutral-400 uppercase tracking-tighter">
               <span>{t('owner.home.revenue.days.sun')}</span>
               <span>{t('owner.home.revenue.days.mon')}</span>
               <span>{t('owner.home.revenue.days.tue')}</span>
               <span>{t('owner.home.revenue.days.wed')}</span>
               <span>{t('owner.home.revenue.days.thu')}</span>
               <span>{t('owner.home.revenue.days.fri')}</span>
               <span>{t('owner.home.revenue.days.sat')}</span>
             </div>
           </section>

        </div>
      </div>

      <WithdrawalWizard 
        isOpen={isWithdrawalOpen} 
        onClose={() => setIsWithdrawalOpen(false)} 
        balance={balance} 
      />
    </div>
  );
}
