'use client';

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
  CaretRight
} from '@phosphor-icons/react';
import { useLocale } from '@/i18n/LocaleProvider';
import { useMock } from '@/lib/hooks/useMock';
import { mockGovQueue } from '@/lib/mock/gov.mock';
import { mockTNAs } from '@/lib/mock/tnas.mock';
import { cn } from '@/lib/utils/cn';
import Button from '@/components/ui/Button';

export default function GovHomeModule() {
  const router = useRouter();
  const { locale, isRTL } = useLocale();

  const { data: queue, isLoading: queueLoading } = useMock(mockGovQueue);
  const { data: tnas, isLoading: tnasLoading } = useMock(mockTNAs);

  const pendingRequests = queue?.filter(q => q.status === 'PENDING_REVIEW') || [];

  return (
    <div className="space-y-8 pb-12 animate-in fade-in duration-700">
      
      {/* SYSTEM HEALTH TOP STATS */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { label: 'Total TNA Issued', value: tnas?.length || 0, icon: Globe, color: 'text-primary', bg: 'bg-primary/10' },
          { label: 'Pending Review', value: pendingRequests.length, icon: ShieldCheck, color: 'text-warning', bg: 'bg-warning/10' },
          { label: 'Verified Addresses', value: '1,240', icon: CheckCircle, color: 'text-success', bg: 'bg-success/10' },
          { label: 'Active Users', value: '3,820', icon: Users, color: 'text-secondary', bg: 'bg-secondary/10' },
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
              <h3 className="text-xl font-black text-neutral-900 tracking-tight">Review Queue</h3>
              <button 
                onClick={() => router.push(`/${locale}/gov/queue`)}
                className="text-sm font-bold text-primary flex items-center gap-1 hover:underline"
              >
                View Full Queue
                <CaretRight size={14} className={isRTL ? "rotate-180" : ""} />
              </button>
            </div>

            <div className="space-y-3">
              {pendingRequests.slice(0, 3).map((req) => (
                <div 
                  key={req.request_id}
                  className="bg-white rounded-2xl border border-neutral-100 shadow-sm p-4 flex items-center gap-4 hover:border-primary/30 transition-all group"
                >
                  <div className="w-12 h-12 rounded-xl bg-primary/5 flex items-center justify-center text-primary group-hover:bg-primary group-hover:text-white transition-all">
                    <ShieldCheck size={24} weight="bold" />
                  </div>
                  <div className="flex-1">
                    <div className="flex justify-between items-start">
                      <p className="text-[10px] font-black text-neutral-400 uppercase tracking-widest">{req.mode}</p>
                      <span className="text-[10px] font-bold text-neutral-500">{new Date(req.submitted_at).toLocaleDateString()}</span>
                    </div>
                    <p className="font-bold text-neutral-900 leading-tight">Visitor: {req.visitor_name}</p>
                    <p className="text-[10px] text-neutral-500 mt-1 uppercase tracking-widest">Origin: {req.nationality}</p>
                  </div>
                  <Button 
                    size="sm" 
                    variant="outline" 
                    className="h-9 px-6 text-xs border-neutral-200"
                    onClick={() => router.push(`/${locale}/gov/queue/${req.request_id}`)}
                  >
                    Review
                  </Button>
                </div>
              ))}
            </div>
          </section>

        </div>

        {/* SIDEBAR TOOLS */}
        <div className="space-y-8">
          
          {/* QUICK ACTIONS PANEL */}
          <section className="bg-white rounded-3xl border border-neutral-200 shadow-xl p-6 space-y-6">
            <h3 className="text-xs font-black text-neutral-400 uppercase tracking-widest">Governance Tools</h3>
            
            <div className="space-y-3">
              {[
                { label: 'Policy Settings', icon: Gear, path: '/gov/policy', color: 'text-primary' },
                { label: 'System Audit', icon: Fingerprint, path: '/gov/audit', color: 'text-secondary' },
                { label: 'Regional Analysis', icon: MapPin, path: '/gov/analytics', color: 'text-success' },
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
