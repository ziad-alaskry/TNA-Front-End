'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useQuery } from '@tanstack/react-query';
import {
    Package,
    MapPin,
    ChevronLeft,
    MoreHorizontal,
    Check,
    Circle,
    PlusCircle,
    LayoutGrid
} from 'lucide-react';
import { TNA, TNAResponse } from '@/lib/types/tna';
import { Delivery, DeliveryResponse } from '@/lib/types/deliveries';
import { useT } from '@/lib/hooks/useT';

// Mock Data Generators for Frontend-Only Phase
const mockTnas: TNA[] = [
    { tna_id: '1', tna_code: 'TNA-EMAA5083', status: 'ACTIVE', linked_until: '18/10/2024' },
    { tna_id: '2', tna_code: 'TNA-JKLM9278', status: 'ACTIVE', linked_until: '23/10/2024' },
    { tna_id: '3', tna_code: 'TNA-ALCT9837', status: 'UNLINKED' },
];

const mockDeliveries: Delivery[] = [
    { delivery_id: 'd1', tracking_no: '456327', carrier: 'Aramex', tna_code: 'TNA-EMAA5083', expected_at: '2024-10-18' },
    { delivery_id: 'd2', tracking_no: '15486633698', carrier: 'DHL', tna_code: 'TNA-JKLM9278', expected_at: '2024-10-23' },
];

export default function VisitorHomeModule() {
    const router = useRouter();
    const { t } = useT();
    const [activeSlide, setActiveSlide] = useState(0);

    // Queries with simulated delay
    const { data: tnas, isLoading: tnasLoading } = useQuery<TNAResponse>({
        queryKey: ['tna', 'me'],
        queryFn: async () => {
            await new Promise(r => setTimeout(r, 1000));
            return { data: mockTnas };
        },
    });

    const { data: deliveries, isLoading: deliveriesLoading } = useQuery<DeliveryResponse>({
        queryKey: ['deliveries', 'preview'],
        queryFn: async () => {
            await new Promise(r => setTimeout(r, 800));
            return { data: mockDeliveries };
        },
    });

    const formatDate = (dateStr: string) => {
        const date = new Date(dateStr);
        return date.toLocaleDateString('ar-EG', { day: 'numeric', month: 'numeric', year: 'numeric' });
    };

    return (
        <div className="min-h-screen bg-white pb-44" dir="rtl">
            {/* 1. STICKY HEADER */}
            <header className="sticky top-0 z-50 bg-white border-b border-tna-gray-100 py-3 flex flex-col items-center">
                <span className="text-base font-bold text-tna-gray-900">العنوان الوطني المؤقت</span>
                <span className="text-[10px] text-tna-gray-400 font-medium tracking-tight">Temporary National Address</span>
            </header>

            {/* 2. HERO BANNER CAROUSEL */}
            <div className="mx-4 mt-4 rounded-3xl overflow-hidden h-44 relative group shadow-lg">
                <div className="absolute inset-0 bg-gradient-to-br from-[#1e293b] via-[#334155] to-[#475569] transition-all duration-500" />

                {/* Visual Decoration (abstract shapes) */}
                <div className="absolute -top-10 -right-10 w-40 h-40 bg-white/5 rounded-full blur-3xl" />
                <div className="absolute -bottom-10 -left-10 w-40 h-40 bg-warning/10 rounded-full blur-3xl" />

                <div className="absolute inset-0 flex flex-col justify-center px-6 text-start">
                    <h2 className="text-warning font-bold text-lg mb-1 drop-shadow-sm">الآن مع تطبيق العنوان الوطني المؤقت</h2>
                    <p className="text-white text-[11px] leading-relaxed max-w-[200px] opacity-90 font-medium">
                        يمكنك الحصول على عنوان وطني مؤقت لإستلام وإرسال الشحنات من أي مكان داخل المملكة العربية السعودية بكل سهولة وأمان
                    </p>
                </div>

                {/* Dot Indicators */}
                <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex items-center gap-1.5 bg-black/10 backdrop-blur-sm px-2 py-1 rounded-full">
                    {[0, 1, 2, 3].map((i) => (
                        <button
                            key={i}
                            onClick={() => setActiveSlide(i)}
                            className={`h-2 rounded-full transition-all duration-300 ${activeSlide === i ? 'w-5 bg-warning shadow-sm' : 'w-2 bg-white/40 hover:bg-white/60'}`}
                        />
                    ))}
                </div>
            </div>

            {/* 3. SHIPMENTS SECTION */}
            <section className="px-4 mt-8">
                <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center gap-2.5">
                        <div className="w-8 h-8 rounded-lg bg-tna-gray-900 flex items-center justify-center text-white shadow-sm">
                            <Package size={20} />
                        </div>
                        <h3 className="text-base font-bold text-tna-gray-900">الشحنات</h3>
                    </div>
                    <button
                        onClick={() => router.push('/visitor/shipments')}
                        className="flex items-center text-primary text-xs font-bold gap-0.5 hover:underline"
                    >
                        عرض الكل
                        <ChevronLeft size={16} />
                    </button>
                </div>

                <div className="space-y-3">
                    {deliveriesLoading ? (
                        [1, 2].map(i => (
                            <div key={i} className="h-28 bg-tna-gray-50 animate-pulse rounded-2xl border border-tna-gray-100" />
                        ))
                    ) : (
                        deliveries?.data.slice(0, 2).map((delivery) => (
                            <div key={delivery.delivery_id} className="bg-white shadow-sm rounded-2xl p-4 border border-tna-gray-100 hover:border-primary/30 transition-colors group">
                                <div className="flex justify-between items-start mb-2">
                                    <h4 className="text-sm font-bold text-tna-gray-800">
                                        شحنة من: <span className="text-tna-gray-900">{delivery.carrier}-{delivery.tracking_no}</span>
                                    </h4>
                                    <button className="text-tna-gray-300 hover:text-tna-gray-600 transition-colors">
                                        <MoreHorizontal size={20} />
                                    </button>
                                </div>
                                <div className="space-y-1">
                                    <p className="text-[11px] text-tna-gray-500 font-medium">
                                        تاريخ الوصول المتوقع: <span className="text-tna-gray-700">{formatDate(delivery.expected_at)}</span>
                                    </p>
                                    <p className="text-[11px] text-tna-gray-500 font-medium">
                                        إلى العنوان المؤقت: <span className="font-mono text-primary font-bold tracking-[0.04em]">{delivery.tna_code}</span>
                                    </p>
                                </div>
                            </div>
                        ))
                    )}
                </div>

                <div className="border-t border-tna-gray-100 my-6" />
            </section>

            {/* 4. ADDRESSES SECTION */}
            <section className="px-4">
                <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center gap-2.5">
                        <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center text-primary shadow-sm">
                            <MapPin size={20} />
                        </div>
                        <h3 className="text-base font-bold text-tna-gray-900">عناويني المؤقتة</h3>
                    </div>
                    <button
                        onClick={() => router.push('/visitor/addresses')}
                        className="flex items-center text-primary text-xs font-bold gap-0.5 hover:underline"
                    >
                        إدارة العناوين
                        <ChevronLeft size={16} />
                    </button>
                </div>

                <div className="flex gap-3 overflow-x-auto pb-4 -mx-4 px-4 no-scrollbar scroll-smooth">
                    {tnasLoading ? (
                        [1, 2].map(i => (
                            <div key={i} className="min-w-[176px] h-32 bg-tna-gray-50 animate-pulse rounded-2xl border border-tna-gray-100" />
                        ))
                    ) : (
                        tnas?.data.map((tna) => (
                            <button
                                key={tna.tna_id}
                                onClick={() => router.push(`/visitor/addresses/${tna.tna_id}`)}
                                className="bg-white shadow-[0_4px_12px_rgba(0,0,0,0.05)] rounded-2xl p-4 min-w-[176px] flex-shrink-0 border border-tna-gray-100 flex flex-col justify-between items-start relative hover:border-primary/20 transition-all active:scale-95 text-start"
                            >
                                <div className="w-full flex justify-between items-start">
                                    <span className="font-mono text-sm font-bold tracking-[0.04em] text-tna-gray-900">{tna.tna_code}</span>
                                    <MoreHorizontal size={18} className="text-tna-gray-300" />
                                </div>

                                <div className="mt-4 w-full flex flex-col gap-1">
                                    {tna.status === 'ACTIVE' && (
                                        <>
                                            <div className="flex items-center gap-1.5 text-success">
                                                <Check size={14} strokeWidth={3} />
                                                <span className="text-[10px] font-bold">مرتبط بنجاح</span>
                                            </div>
                                            <span className="text-[9px] text-tna-gray-400 font-medium pr-5">حتى تاريخ: {tna.linked_until}</span>
                                        </>
                                    )}
                                    {tna.status === 'UNLINKED' && (
                                        <div className="flex items-center gap-1.5 text-primary">
                                            <Circle size={14} strokeWidth={3} />
                                            <span className="text-[10px] font-bold">لم يتم الربط</span>
                                        </div>
                                    )}
                                    {tna.status === 'SUSPENDED' && (
                                        <div className="text-danger font-bold text-[10px] pr-1">موقوف</div>
                                    )}
                                </div>
                            </button>
                        ))
                    )}
                </div>
            </section>

            {/* 5. CTA BUTTON */}
            <div className="fixed bottom-24 left-0 right-0 px-6 z-40 bg-gradient-to-t from-white via-white/95 to-transparent pt-6 pb-2 pointer-events-none">
                <button
                    onClick={() => router.push('/visitor/addresses/create')}
                    className="flex h-14 w-full items-center justify-center gap-3 rounded-pill bg-[linear-gradient(135deg,#02488D,#00B4C9)] text-white font-bold shadow-btn transition-all hover:opacity-95 active:scale-[0.98] pointer-events-auto"
                >
                    <PlusCircle size={22} />
                    <span className="text-sm">إنشاء عنوان وطني مؤقت جديد</span>
                </button>
            </div>
        </div>
    );
}
