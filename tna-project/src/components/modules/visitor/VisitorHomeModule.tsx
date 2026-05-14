'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { 
  Package, 
  MapPin, 
  IdentificationCard, 
  PlusCircle, 
  CaretRight, 
  CaretLeft,
  ArrowRight,
  ShieldCheck,
  TrendUp,
  Clock,
  ArrowSquareOut,
  Info
} from '@phosphor-icons/react';
import { useLocale } from '@/i18n/LocaleProvider';
import { useMock } from '@/lib/hooks/useMock';
import { mockTNAs } from '@/lib/mock/tnas.mock';
import { mockShipments } from '@/lib/mock/shipments.mock';
import { mockBalances } from '@/lib/mock/financials.mock';
import { cn } from '@/lib/utils/cn';
import Button from '@/components/ui/Button';
import { SkeletonCard } from '@/components/ui/SkeletonCard';

export default function VisitorHomeModule() {
  const router = useRouter();
  const { locale, t, isRTL } = useLocale();
  const [activeSlide, setActiveSlide] = useState(0);

  // Use the new mock hook
  const { data: tnas, isLoading: tnasLoading } = useMock(mockTNAs);
  const { data: shipments, isLoading: shipmentsLoading } = useMock(mockShipments);

  const activeTnas = tnas?.filter(t => t.status === 'ACTIVE') || [];
  const recentShipments = shipments?.slice(0, 2) || [];

  const slides = [
    {
      title: "Saudi National Address Proxy",
      desc: "Get your temporary national address today and receive shipments anywhere in the Kingdom with ease and security.",
      cta: "Request TNA",
      onClick: () => router.push(`/${locale}/visitor/tna/new`),
      image: "/brand/banner-1.jpg",
      color: "bg-primary"
    },
    {
      title: "Secure & Reliable",
      desc: "Our system ensures your privacy and security throughout the shipping process.",
      cta: "Find Address",
      onClick: () => router.push(`/${locale}/visitor/search`),
      image: "/brand/banner-2.jpg",
      color: "bg-primary-dark"
    },
    {
      title: "Instant Verification",
      desc: "Quick administrative review and autonomous issuance for eligible users.",
      cta: "Start Now",
      onClick: () => router.push(`/${locale}/visitor/tna/new`),
      image: "/brand/banner-3.jpg",
      color: "bg-secondary"
    }
  ];

  useEffect(() => {
    const timer = setInterval(() => {
      setActiveSlide(prev => (prev + 1) % slides.length);
    }, 5000);
    return () => clearInterval(timer);
  }, [slides.length]);

  return (
    <div className="space-y-8 pb-12 animate-in fade-in duration-700">
      {/* HERO BANNER CAROUSEL */}
      <section className="relative h-64 md:h-80 rounded-3xl overflow-hidden shadow-2xl group">
        {slides.map((slide, i) => (
          <div 
            key={i}
            className={cn(
              "absolute inset-0 transition-all duration-1000 ease-in-out flex items-center p-8 md:p-12",
              slide.color,
              activeSlide === i ? "opacity-100 translate-x-0" : "opacity-0 translate-x-full"
            )}
          >
            {/* Mock background pattern */}
            <div className="absolute inset-0 opacity-10 pointer-events-none">
              <div className="absolute top-0 right-0 w-64 h-64 bg-white rounded-full -mr-32 -mt-32 blur-3xl" />
              <div className="absolute bottom-0 left-0 w-48 h-48 bg-white rounded-full -ml-24 -mb-24 blur-2xl" />
            </div>

            <div className="relative z-10 max-w-lg space-y-4">
              <h1 className="text-3xl md:text-5xl font-black text-white leading-tight tracking-tighter">
                {slide.title}
              </h1>
              <p className="text-white/80 text-sm md:text-lg font-medium leading-relaxed">
                {slide.desc}
              </p>
              <div className="pt-4">
                <Button 
                  onClick={slide.onClick}
                  className="bg-white text-primary hover:bg-white/90 border-none px-8 py-6 text-lg font-black shadow-xl"
                >
                  {slide.cta}
                  <ArrowRight size={20} className={cn("ml-2", isRTL && "rotate-180")} />
                </Button>
              </div>
            </div>
          </div>
        ))}

        {/* Carousel Indicators */}
        <div className="absolute bottom-6 left-1/2 -translate-x-1/2 flex gap-2">
          {slides.map((_, i) => (
            <button 
              key={i}
              onClick={() => setActiveSlide(i)}
              className={cn(
                "h-2 rounded-full transition-all duration-300",
                activeSlide === i ? "w-8 bg-white" : "w-2 bg-white/40"
              )}
            />
          ))}
        </div>
      </section>

      {/* STATS ROW */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div 
          onClick={() => router.push(`/${locale}/visitor/tnas`)}
          className="bg-white p-6 rounded-2xl border border-neutral-100 shadow-sm flex items-center justify-between group hover:border-primary/20 transition-all cursor-pointer"
        >
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center text-primary group-hover:bg-primary group-hover:text-white transition-all">
              <IdentificationCard size={28} weight="bold" />
            </div>
            <div>
              <p className="text-xs font-black text-neutral-400 uppercase tracking-widest">Active TNAs</p>
              <p className="text-3xl font-black text-neutral-900">{activeTnas.length}</p>
            </div>
          </div>
          <TrendUp size={32} className="text-success opacity-20" />
        </div>
        <div 
          onClick={() => router.push(`/${locale}/visitor/shipments`)}
          className="bg-white p-6 rounded-2xl border border-neutral-100 shadow-sm flex items-center justify-between group hover:border-primary/20 transition-all cursor-pointer"
        >
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-xl bg-secondary/10 flex items-center justify-center text-secondary group-hover:bg-secondary group-hover:text-white transition-all">
              <Package size={28} weight="bold" />
            </div>
            <div>
              <p className="text-xs font-black text-neutral-400 uppercase tracking-widest">Shipments</p>
              <p className="text-3xl font-black text-neutral-900">{shipments?.length || 0}</p>
            </div>
          </div>
          <Clock size={32} className="text-pending opacity-20" />
        </div>
      </div>

       {/* MY TNAS SECTION */}
       <section className="space-y-4">
         <div className="flex items-center justify-between">
           <h2 className="text-xl font-black text-neutral-900 tracking-tight">My Active Addresses</h2>
           <button 
             onClick={() => router.push(`/${locale}/visitor/tnas`)}
             className="text-sm font-bold text-primary flex items-center gap-1 hover:underline"
           >
             Manage Addresses
             <CaretRight size={14} className={cn(isRTL && "rotate-180")} />
           </button>
         </div>
         
         {tnasLoading ? (
           <div className="flex gap-4 overflow-x-auto pb-4 no-scrollbar -mx-4 px-4 snap-x">
             {[1, 2, 3].map((i) => (
               <SkeletonCard 
                 key={i}
                 className="min-w-[280px] snap-start"
               />
             ))}
           </div>
         ) : (
           <div className="flex gap-4 overflow-x-auto pb-4 no-scrollbar -mx-4 px-4 snap-x">
             {activeTnas.map((tna) => (
               <div 
                 key={tna.tna_id}
                 className="min-w-[280px] snap-start bg-white rounded-2xl border border-neutral-200 shadow-sm p-5 space-y-4 hover:border-primary/50 transition-colors cursor-pointer group"
                 onClick={() => router.push(`/${locale}/visitor/tnas/${tna.tna_id}`)}
               >
                 <div className="flex justify-between items-start">
                   <p className="text-lg font-black font-mono text-primary group-hover:scale-105 transition-transform">{tna.tna_code}</p>
                   <span className="px-2 py-0.5 bg-success/10 text-success text-[10px] font-bold rounded-full border border-success/20">
                     {tna.status}
                   </span>
                 </div>
                 <div className="space-y-1">
                   <p className="text-[10px] font-black text-neutral-400 uppercase tracking-widest">Expires On</p>
                   <p className="text-xs font-bold text-neutral-600">{new Date(tna.expires_at).toLocaleDateString()}</p>
                 </div>
                 <div className="pt-2 flex items-center gap-2 text-xs font-bold text-primary">
                   View Details
                   <ArrowRight size={14} className={cn(isRTL && "rotate-180")} />
                 </div>
               </div>
             ))}
           </div>
         )}
       </section>

      {/* RECENT SHIPMENTS SECTION */}
      <section className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-xl font-black text-neutral-900 tracking-tight">Recent Shipments</h2>
          <button 
            onClick={() => router.push(`/${locale}/visitor/shipments`)}
            className="text-sm font-bold text-primary flex items-center gap-1 hover:underline"
          >
            View All
            <CaretRight size={14} className={cn(isRTL && "rotate-180")} />
          </button>
        </div>

        {shipmentsLoading ? (
          <div className="space-y-3">
            {[1, 2, 3].map((i) => (
              <SkeletonCard 
                key={i}
                className="min-w-full"
              />
            ))}
          </div>
        ) : (
          <div className="space-y-3">
            {recentShipments.map((shipment) => (
              <div 
                key={shipment.shipment_id}
                className="bg-white rounded-2xl border border-neutral-100 shadow-sm p-4 flex items-center gap-4 hover:border-secondary/30 transition-all cursor-pointer group"
                onClick={() => router.push(`/${locale}/visitor/shipments`)}
              >
                <div className="w-12 h-12 rounded-xl bg-secondary/10 flex items-center justify-center text-secondary group-hover:scale-110 transition-transform">
                  <Package size={24} weight="bold" />
                </div>
                <div className="flex-1">
                  <div className="flex justify-between items-start">
                    <p className="text-[10px] font-black text-neutral-400 uppercase tracking-widest">{shipment.carrier}</p>
                    <span className="text-[10px] font-bold text-neutral-500">{shipment.expected_at ? new Date(shipment.expected_at).toLocaleDateString() : ''}</span>
                  </div>
                  <p className="font-mono font-bold text-neutral-900">{shipment.tracking_no}</p>
                  <div className="flex items-center gap-1.5 mt-1">
                    <MapPin size={12} className="text-neutral-400" />
                    <p className="text-[10px] text-neutral-500 font-medium">To: <span className="text-primary font-bold">{shipment.tna_code}</span></p>
                  </div>
                </div>
                <ArrowSquareOut size={20} className="text-neutral-300 group-hover:text-secondary transition-colors" />
              </div>
            ))}
          </div>
        )}

        {!shipmentsLoading && recentShipments.length === 0 && (
          <div className="p-8 bg-neutral-50 rounded-2xl border border-dashed border-neutral-200 text-center space-y-3">
            <div className="mx-auto w-12 h-12 rounded-full bg-neutral-100 flex items-center justify-center text-neutral-400">
              <Info size={24} />
            </div>
            <p className="text-sm text-neutral-500 font-medium">No active shipments found.</p>
            <Button 
              variant="outline" 
              size="sm"
              onClick={() => router.push(`/${locale}/visitor/shipments/order`)}
            >
              Order Your First Shipment
            </Button>
          </div>
        )}
      </section>

    </div>
  );
}