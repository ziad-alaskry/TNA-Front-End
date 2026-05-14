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
  CheckCircle,
  User,
  CurrencyCircleDollar
} from '@phosphor-icons/react';
import { useLocale } from '@/i18n/LocaleProvider';
import { useMock } from '@/lib/hooks/useMock';
import { mockProperties } from '@/lib/mock/properties.mock';
import { mockBindings } from '@/lib/mock/bindings.mock';
import { mockBalances, mockWeeklyRevenue } from '@/lib/mock/financials.mock';
import { cn } from '@/lib/utils/cn';
import Button from '@/components/ui/Button';

export default function OwnerHomeModule() {
  const router = useRouter();
  const { locale, isRTL } = useLocale();

  const { data: properties, isLoading: propsLoading } = useMock(mockProperties);
  const { data: bindings, isLoading: bindingsLoading } = useMock(mockBindings);
  const balance = mockBalances['user-owner-1'] || 0;

  const pendingBindings = bindings?.filter(b => b.status === 'PENDING') || [];
  const activeBindings = bindings?.filter(b => b.status === 'ACTIVE') || [];

  return (
    <div className="space-y-8 pb-12 animate-in fade-in duration-700">
      
      {/* TOP STATS GRID */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { label: 'Properties', value: properties?.length || 0, icon: Buildings, color: 'text-primary', bg: 'bg-primary/10' },
          { label: 'Active Bindings', value: activeBindings.length, icon: LinkIcon, color: 'text-success', bg: 'bg-success/10' },
          { label: 'Pending Requests', value: pendingBindings.length, icon: Clock, color: 'text-warning', bg: 'bg-warning/10' },
          { label: 'Total Earnings', value: `SAR 12,300`, icon: TrendUp, color: 'text-secondary', bg: 'bg-secondary/10' },
        ].map((stat, i) => (
          <div key={i} className="bg-white p-6 rounded-2xl border border-neutral-100 shadow-sm flex items-center gap-4 group hover:border-primary/20 transition-all">
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
          <section className="relative overflow-hidden rounded-3xl bg-primary-dark text-white p-8 md:p-10 shadow-2xl">
            <div className="relative z-10 space-y-4 max-w-md">
              <h2 className="text-3xl font-black tracking-tight leading-tight">Maximize Your Property's Potential</h2>
              <p className="text-white/70 text-sm md:text-base">List your residential or commercial units and start earning from TNA binding requests today.</p>
              <div className="pt-2">
                <Button 
                  onClick={() => router.push(`/${locale}/owner/properties`)}
                  className="bg-white text-primary-dark hover:bg-neutral-100 border-none px-8 py-4 font-bold shadow-xl"
                >
                  <PlusCircle size={20} weight="fill" />
                  Add New Property
                </Button>
              </div>
            </div>
            {/* Background Decoration */}
            <House size={200} weight="duotone" className="absolute -bottom-10 -right-10 text-white/5 rotate-12 pointer-events-none" />
          </section>

          {/* PENDING REQUESTS */}
          <section className="space-y-4 text-start">
            <div className="flex items-center justify-between">
              <h3 className="text-xl font-black text-neutral-900 tracking-tight">Pending Requests</h3>
              <button 
                onClick={() => router.push(`/${locale}/owner/bindings`)}
                className="text-sm font-bold text-primary flex items-center gap-1 hover:underline"
              >
                View All
                <CaretRight size={14} className={cn(isRTL && "rotate-180")} />
              </button>
            </div>

            <div className="space-y-3">
              {pendingBindings.map((bind) => (
                <div 
                  key={bind.binding_id}
                  className="bg-white rounded-2xl border border-neutral-100 shadow-sm p-4 flex items-center gap-4 hover:border-warning/30 transition-all group"
                >
                  <div className="w-12 h-12 rounded-xl bg-warning/10 flex items-center justify-center text-warning group-hover:scale-110 transition-transform">
                    <User size={24} weight="bold" />
                  </div>
                  <div className="flex-1">
                    <div className="flex justify-between items-start">
                      <p className="text-[10px] font-black text-neutral-400 uppercase tracking-widest">New Binding Request</p>
                      <span className="text-[10px] font-bold text-neutral-500">{new Date(bind.created_at).toLocaleDateString()}</span>
                    </div>
                    <p className="font-bold text-neutral-900">Request for TNA: <span className="font-mono text-primary">{bind.tna_code}</span></p>
                    <p className="text-xs text-neutral-500 mt-0.5">Unit: {bind.sub_address_id} | Period: {new Date(bind.start_at).toLocaleDateString()} → {new Date(bind.end_at).toLocaleDateString()}</p>
                  </div>
                  <div className="flex gap-2">
                    <Button size="sm" className="h-8 px-4 text-[10px]" onClick={() => router.push(`/${locale}/owner/bindings`)}>
                      Accept
                    </Button>
                    <Button size="sm" variant="outline" className="h-8 px-4 text-[10px] border-neutral-200">
                      Decline
                    </Button>
                  </div>
                </div>
              ))}
              {pendingBindings.length === 0 && (
                <div className="p-12 bg-neutral-50 rounded-3xl border-2 border-dashed border-neutral-200 text-center">
                  <p className="text-neutral-400 font-medium">No pending requests at the moment.</p>
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
                <h3 className="text-xs font-black text-neutral-400 uppercase tracking-widest">Digital Wallet</h3>
              </div>
              <button 
                onClick={() => router.push(`/${locale}/owner/wallet`)}
                className="p-1 hover:bg-neutral-50 rounded-full transition-colors"
              >
                <ArrowUpRight size={18} className="text-neutral-400" />
              </button>
            </div>
            
            <div>
              <p className="text-[10px] text-neutral-400 font-bold uppercase tracking-widest mb-1">Available Balance</p>
              <p className="text-4xl font-black text-neutral-900 tracking-tighter">SAR {balance.toFixed(2)}</p>
            </div>

            <div className="pt-2">
              <Button 
                onClick={() => router.push(`/${locale}/owner/wallet`)}
                className="w-full py-4 shadow-glow-primary"
              >
                Withdraw Funds
              </Button>
            </div>

            <div className="h-px bg-neutral-100" />

            <div className="flex items-center justify-between text-xs">
              <span className="text-neutral-500 font-medium">Total Withdrawn</span>
              <span className="text-neutral-900 font-black">SAR 45,200.00</span>
            </div>
          </section>

           {/* QUICK PERFORMANCE CHART */}
           <section className="bg-surface-200 rounded-3xl border border-neutral-200 p-6 space-y-4">
             <div className="flex items-center gap-2">
               <ChartLineUp size={20} className="text-success" />
               <h3 className="text-xs font-black text-neutral-400 uppercase tracking-widest">Weekly Revenue</h3>
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
                       SAR {revenue}
                     </div>
                   </div>
                 );
               })}
             </div>
             <div className="flex justify-between text-[10px] font-bold text-neutral-400 uppercase tracking-tighter">
               <span>Sun</span>
               <span>Mon</span>
               <span>Tue</span>
               <span>Wed</span>
               <span>Thu</span>
               <span>Fri</span>
               <span>Sat</span>
             </div>
           </section>

        </div>
      </div>
    </div>
  );
}
