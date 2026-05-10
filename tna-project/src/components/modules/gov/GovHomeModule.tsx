import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { 
  ShieldCheck, 
  MapPin, 
  Clock, 
  Pulse, 
  Gear, 
  Fingerprint,
  ArrowRight,
  ChartLineUp,
  Warning,
  Globe,
  CheckCircle,
  Users,
  CaretRight,
  Buildings,
  CurrencyDollar
} from '@phosphor-icons/react';
import { useLocale } from '@/i18n/LocaleProvider';
import { useMock } from '@/lib/hooks/useMock';
import { mockGovQueue, mockSubAddressQueue, mockGovAdjustments } from '@/lib/mock/gov.mock';
import { cn } from '@/lib/utils/cn';
import Button from '@/components/ui/Button';

export default function GovHomeModule() {
   const router = useRouter();
   const { locale, isRTL } = useLocale();

   const { data: tnaQueue, isLoading: tnaQueueLoading } = useMock(mockGovQueue);
   const { data: addressQueue, isLoading: addressQueueLoading } = useMock(mockSubAddressQueue);
   const { data: adjustments, isLoading: adjustmentsLoading } = useMock(mockGovAdjustments);

   const pendingTNARequests = tnaQueue?.filter(q => q.status === 'PENDING_REVIEW') || [];
   const pendingAddressRequests = addressQueue?.filter(a => a.status === 'PENDING') || [];
   const pendingAdjustments = adjustments?.filter(a => a.status === 'PENDING' && a.approval_required) || [];

   return (
     <div className="space-y-8 pb-12 animate-in fade-in duration-700">
        
        {/* SYSTEM HEALTH TOP STATS */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {[
            { label: isRTL ? 'TNA قيد المراجعة' : 'TNA Pending', value: pendingTNARequests.length, icon: ShieldCheck, color: 'text-warning', bg: 'bg-warning/10' },
            { label: isRTL ? 'عناوين قيد التحقق' : 'Addresses Pending', value: pendingAddressRequests.length, icon: MapPin, color: 'text-secondary', bg: 'bg-secondary/10' },
            { label: isRTL ? 'تعديلات معلقة' : 'Adjustments Pending', value: pendingAdjustments.length, icon: CurrencyDollar, color: 'text-primary', bg: 'bg-primary/10' },
            { label: isRTL ? 'معدل الموافقة التلقائي' : 'Auto-Approval Rate', value: '87%', icon: CheckCircle, color: 'text-success', bg: 'bg-success/10' },
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
        
        {/* MAIN ADMIN AREA */}
        <div className="lg:col-span-2 space-y-8">
          
          {/* SYSTEM PERFORMANCE BANNER */}
          <section className="bg-surface-200 rounded-3xl border border-neutral-200 p-8 flex flex-col md:flex-row items-center gap-8">
            <div className="space-y-4 flex-1">
              <div className="flex items-center gap-2">
                <Pulse size={24} className="text-success animate-pulse" weight="bold" />
                <h2 className="text-xl font-black text-neutral-900 uppercase tracking-tight">System Health: Optimal</h2>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="p-4 bg-white rounded-2xl border border-neutral-100">
                  <p className="text-[10px] font-black text-neutral-400 uppercase tracking-widest">Avg Response Time</p>
                  <p className="text-xl font-black text-neutral-900">45ms</p>
                </div>
                <div className="p-4 bg-white rounded-2xl border border-neutral-100">
                  <p className="text-[10px] font-black text-neutral-400 uppercase tracking-widest">Success Rate</p>
                  <p className="text-xl font-black text-success">99.98%</p>
                </div>
              </div>
            </div>
            <div className="w-px h-24 bg-neutral-200 hidden md:block" />
            <div className="space-y-2 text-center md:text-start">
              <p className="text-xs font-bold text-neutral-500 uppercase tracking-widest">Active Services</p>
              <div className="flex flex-wrap gap-2 justify-center md:justify-start">
                {['Registry', 'Auth', 'Mocks', 'Ledger'].map(s => (
                  <span key={s} className="px-3 py-1 bg-success/10 text-success text-[10px] font-black rounded-full border border-success/20 uppercase">
                    {s}
                  </span>
                ))}
              </div>
            </div>
          </section>

          {/* PENDING REVIEW QUEUE */}
          <section className="space-y-4 text-start">
            <div className="flex items-center justify-between">
              <h3 className="text-xl font-black text-neutral-900 tracking-tight">{isRTL ? 'الطابور' : 'Queues'}</h3>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* TNA Queue */}
              <div className="bg-white rounded-2xl border border-neutral-100 p-5 space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <ShieldCheck size={20} className="text-warning" weight="bold" />
                    <h4 className="font-bold text-neutral-900">{isRTL ? 'طلبات TNA' : 'TNA Requests'}</h4>
                  </div>
                  <span className="text-2xl font-black text-warning">{pendingTNARequests.length}</span>
                </div>
                <p className="text-xs text-neutral-500">{isRTL ? 'في انتظار المراجعة' : 'Awaiting review'}</p>
                <Button 
                  size="sm" 
                  variant="outline" 
                  className="w-full border-neutral-200"
                  onClick={() => router.push(`/${locale}/gov/tna-queue`)}
                >
                  {isRTL ? 'عرض الطابور' : 'View Queue'}
                </Button>
              </div>

              {/* Address Queue */}
              <div className="bg-white rounded-2xl border border-neutral-100 p-5 space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <MapPin size={20} className="text-secondary" weight="bold" />
                    <h4 className="font-bold text-neutral-900">{isRTL ? 'عناوين فرعية' : 'Sub-Addresses'}</h4>
                  </div>
                  <span className="text-2xl font-black text-secondary">{pendingAddressRequests.length}</span>
                </div>
                <p className="text-xs text-neutral-500">{isRTL ? 'في انتظار التحقق' : 'Awaiting verification'}</p>
                <Button 
                  size="sm" 
                  variant="outline" 
                  className="w-full border-neutral-200"
                  onClick={() => router.push(`/${locale}/gov/address-queue`)}
                >
                  {isRTL ? 'عرض الطابور' : 'View Queue'}
                </Button>
              </div>
            </div>
          </section>

        </div>

        {/* SIDEBAR TOOLS */}
        <div className="space-y-8">
          
          {/* QUICK ACTIONS PANEL */}
          <section className="bg-white rounded-3xl border border-neutral-200 shadow-xl p-6 space-y-6">
            <h3 className="text-xs font-black text-neutral-400 uppercase tracking-widest">{isRTL ? 'أدوات الحكومة' : 'Governance Tools'}</h3>
            
            <div className="space-y-3">
              {[
                { label: isRTL ? 'إعدادات السياسة' : 'Policy Settings', icon: Gear, path: '/gov/policy', color: 'text-primary' },
                { label: isRTL ? 'سجل التدقيق' : 'System Audit', icon: Fingerprint, path: '/gov/audit', color: 'text-secondary' },
                { label: isRTL ? 'إدارة الجهات' : 'Agency Management', icon: Buildings, path: '/gov/agencies', color: 'text-success' },
                { label: isRTL ? 'تعديلات الماليات' : 'Financial Adjustments', icon: CurrencyDollar, path: '/gov/adjustments', color: 'text-warning' },
              ].map((tool, i) => (
                <button 
                  key={i}
                  onClick={() => router.push(`/${locale}${tool.path}`)}
                  className="w-full p-4 bg-surface-200 border border-neutral-200 rounded-2xl flex items-center justify-between hover:border-primary/30 hover:bg-white transition-all group"
                >
                  <div className="flex items-center gap-3">
                    <tool.icon size={20} className={cn("transition-colors", tool.color)} weight="fill" />
                    <span className="text-xs font-bold text-neutral-700">{tool.label}</span>
                  </div>
                  <ArrowRight size={16} className={cn("text-neutral-300 group-hover:text-primary transition-colors", isRTL && "rotate-180")} />
                </button>
              ))}
            </div>
          </section>

          {/* CRITICAL ALERTS */}
          <section className="p-6 bg-error/5 rounded-3xl border border-error/10 space-y-4">
            <div className="flex items-center gap-2 text-error">
              <Warning size={24} weight="fill" />
              <h3 className="text-xs font-black uppercase tracking-widest">Critical Alerts</h3>
            </div>
            <div className="space-y-2">
              <div className="p-3 bg-white rounded-xl border border-error/20 flex items-start gap-3">
                <Clock size={16} className="text-error shrink-0 mt-0.5" />
                <p className="text-[10px] font-bold text-neutral-600 leading-relaxed">
                  TNA-9928: Multiple failed binding attempts detected from IP 192.168.1.1
                </p>
              </div>
            </div>
          </section>

        </div>
      </div>
    </div>
  );
}
