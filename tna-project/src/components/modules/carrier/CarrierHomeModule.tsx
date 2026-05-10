'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { 
  Truck, 
  Package, 
  Clock, 
  ChartBar, 
  MapPin, 
  ArrowRight,
  CaretRight,
  Users,
  Warning,
  Scan,
  NavigationArrow,
  CheckCircle,
  TrendUp
} from '@phosphor-icons/react';
import { useLocale } from '@/i18n/LocaleProvider';
import { useMock } from '@/lib/hooks/useMock';
import { mockShipments } from '@/lib/mock/shipments.mock';
import { cn } from '@/lib/utils/cn';
import Button from '@/components/ui/Button';

export default function CarrierHomeModule() {
  const router = useRouter();
  const { locale, isRTL } = useLocale();

  const { data: shipments, isLoading } = useMock(mockShipments);

  const pendingPickups = shipments?.filter(s => s.status === 'CREATED') || [];
  const inTransit = shipments?.filter(s => s.status === 'IN_TRANSIT') || [];
  const deliveredToday = shipments?.filter(s => s.status === 'DELIVERED') || [];

  return (
    <div className="space-y-8 pb-12 animate-in fade-in duration-700">
      
      {/* PERFORMANCE OVERVIEW */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { label: 'Pending Pickups', value: pendingPickups.length, icon: Clock, color: 'text-warning', bg: 'bg-warning/10' },
          { label: 'In Transit', value: inTransit.length, icon: Truck, color: 'text-primary', bg: 'bg-primary/10' },
          { label: 'Delivered Today', value: deliveredToday.length, icon: CheckCircle, color: 'text-success', bg: 'bg-success/10' },
          { label: 'Active Drivers', value: '18', icon: Users, color: 'text-secondary', bg: 'bg-secondary/10' },
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
        
        {/* OPERATIONAL TASKS */}
        <div className="lg:col-span-2 space-y-8">
          
          {/* SCANNER QUICK ACTION */}
          <section className="relative overflow-hidden rounded-3xl bg-primary text-white p-8 md:p-10 shadow-2xl group cursor-pointer" onClick={() => router.push(`/${locale}/carrier/scan`)}>
            <div className="relative z-10 space-y-4 max-w-md">
              <div className="w-12 h-12 rounded-full bg-white/20 flex items-center justify-center backdrop-blur-md">
                <Scan size={28} weight="bold" />
              </div>
              <h2 className="text-3xl font-black tracking-tight leading-tight">Instant Shipment Scanner</h2>
              <p className="text-white/80 text-sm md:text-base">Scan TNA barcodes or QR codes to instantly retrieve shipment details and update statuses.</p>
              <div className="pt-2">
                <Button 
                  className="bg-white text-primary hover:bg-neutral-100 border-none px-8 py-4 font-bold shadow-xl"
                >
                  Open Scanner Simulator
                  <ArrowRight size={20} className={cn("ml-2", isRTL && "rotate-180")} />
                </Button>
              </div>
            </div>
            <Scan size={240} weight="thin" className="absolute -bottom-20 -right-20 text-white/5 rotate-12 pointer-events-none group-hover:scale-110 transition-transform duration-700" />
          </section>

          {/* ACTIVE SHIPMENTS FEED */}
          <section className="space-y-4 text-start">
            <div className="flex items-center justify-between">
              <h3 className="text-xl font-black text-neutral-900 tracking-tight">Active Operations</h3>
              <button 
                onClick={() => router.push(`/${locale}/carrier/shipments`)}
                className="text-sm font-bold text-primary flex items-center gap-1 hover:underline"
              >
                Manage All
                <CaretRight size={14} className={isRTL ? "rotate-180" : ""} />
              </button>
            </div>

            <div className="space-y-3">
              {shipments?.slice(0, 3).map((ship) => (
                <div 
                  key={ship.shipment_id}
                  className="bg-white rounded-2xl border border-neutral-100 shadow-sm p-4 flex items-center gap-4 hover:border-primary/30 transition-all group"
                >
                  <div className="w-12 h-12 rounded-xl bg-primary/5 flex items-center justify-center text-primary group-hover:bg-primary group-hover:text-white transition-all">
                    <Package size={24} weight="bold" />
                  </div>
                  <div className="flex-1">
                    <div className="flex justify-between items-start">
                      <p className="text-[10px] font-black text-neutral-400 uppercase tracking-widest">{ship.status}</p>
                      <span className="text-[10px] font-bold text-neutral-500">{ship.tracking_number}</span>
                    </div>
                    <p className="font-bold text-neutral-900 leading-tight">Deliver to: <span className="text-primary font-mono">{ship.tna_id}</span></p>
                    <div className="flex items-center gap-1.5 mt-1">
                      <MapPin size={12} className="text-neutral-400" />
                      <p className="text-[10px] text-neutral-500 font-medium">Recipient: {ship.recipient_name}</p>
                    </div>
                  </div>
                  <Button 
                    size="sm" 
                    variant="outline" 
                    className="h-9 px-4 text-xs gap-2 border-neutral-200"
                    onClick={() => router.push(`/${locale}/carrier/shipments/${ship.shipment_id}`)}
                  >
                    Update
                    <NavigationArrow size={16} weight="fill" />
                  </Button>
                </div>
              ))}
            </div>
          </section>

        </div>

        {/* SIDEBAR OPS */}
        <div className="space-y-8">
          
          {/* OPERATIONS overview */}
          <section className="bg-white rounded-3xl border border-neutral-200 shadow-xl p-6 space-y-6">
            <div className="flex items-center gap-2">
              <ChartBar size={20} className="text-primary" weight="fill" />
              <h3 className="text-xs font-black text-neutral-400 uppercase tracking-widest">Operations Overview</h3>
            </div>
            
            <div className="space-y-4">
               <div className="space-y-1.5">
                 <div className="flex justify-between text-[10px] font-black uppercase">
                   <span className="text-neutral-500">Active Drivers</span>
                   <span className="text-primary">85%</span>
                 </div>
                <div className="h-2 w-full bg-neutral-100 rounded-full overflow-hidden">
                  <div className="h-full bg-primary rounded-full transition-all duration-1000" style={{ width: '85%' }} />
                </div>
              </div>
              <div className="space-y-1.5">
                <div className="flex justify-between text-[10px] font-black uppercase">
                  <span className="text-neutral-500">Driver Availability</span>
                  <span className="text-secondary">72%</span>
                </div>
                <div className="h-2 w-full bg-neutral-100 rounded-full overflow-hidden">
                  <div className="h-full bg-secondary rounded-full transition-all duration-1000" style={{ width: '72%' }} />
                </div>
              </div>
            </div>

            <div className="h-px bg-neutral-100" />

             <div className="flex items-center gap-3 p-3 bg-warning/5 border border-warning/10 rounded-xl">
               <Warning size={20} className="text-warning shrink-0" weight="fill" />
               <p className="text-[10px] text-warning-dark font-medium">3 staff members require certification renewal within the next 48 hours.</p>
             </div>
          </section>

          {/* QUICK LINKS */}
          <section className="space-y-3">
            {[
              { label: 'Manage Routes', icon: MapPin },
              { label: 'Staff Management', icon: Users },
              { label: 'Vehicle Maintenance', icon: Truck },
            ].map((link, i) => (
              <button 
                key={i}
                className="w-full p-4 bg-surface-200 border border-neutral-200 rounded-2xl flex items-center justify-between hover:border-primary/30 hover:bg-white transition-all group"
              >
                <div className="flex items-center gap-3">
                  <link.icon size={20} className="text-neutral-400 group-hover:text-primary transition-colors" />
                  <span className="text-xs font-bold text-neutral-700">{link.label}</span>
                </div>
                <CaretRight size={16} className="text-neutral-300 group-hover:text-primary transition-colors" />
              </button>
            ))}
          </section>

        </div>
      </div>
    </div>
  );
}
