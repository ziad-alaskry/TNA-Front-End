'use client'

import React from 'react'
import { AppShell } from '@/components/layout/AppShell'
import { DetailViewLayout } from '@/components/templates/DetailViewLayout'
import { 
    Clock, 
    MapPin, 
    IdentificationCard, 
    Calendar, 
    Receipt,
    CheckCircle,
    Info
} from '@phosphor-icons/react'
import { useParams, useRouter } from 'next/navigation'
import { useBindingContext } from '@/context/BindingContext'

export default function VisitorTnaDetailPage() {
    const { id, locale } = useParams();
    const router = useRouter();
    const { visitorTnas, realEstateObjects } = useBindingContext();

    const tna = visitorTnas.find(t => t.tna_id === id);
    const mockTnaCode = tna?.tna_code || 'TNA-102938485';
    
    // Find linked property (mocking logic)
    const property = realEstateObjects[0]; 

    const sections = [
        {
            title: 'معلومات العنوان',
            description: 'البيانات الأساسية لعنوانك الوطني المؤقت.',
            items: [
                { label: 'كود العنوان', value: <span className="font-mono font-bold text-primary">{mockTnaCode}</span> },
                { label: 'حالة التفعيل', value: <span className="px-2 py-0.5 bg-success-bg text-success text-xs font-bold rounded">نشط</span> },
                { label: 'تاريخ الإصدار', value: '2025/10/16' },
                { label: 'تاريخ الانتهاء', value: '2026/10/15' },
            ]
        },
        {
            title: 'العقار المرتبط',
            description: 'تفاصيل العقار الذي تم ربط العنوان به.',
            items: [
                { label: 'اسم العقار', value: property?.name || 'برج النخبة 1' },
                { label: 'العنوان الجغرافي', value: 'الرياض، حي الملقا، طريق الملك فهد' },
                { label: 'رقم الوحدة', value: '101' },
                { label: 'نوع العقار', value: 'سكني' },
            ]
        },
        {
            title: 'سجل العمليات',
            description: 'تتبع دورة حياة العنوان والعمليات التي تمت عليه.',
            items: [
                { 
                    label: 'إصدار العنوان', 
                    value: (
                        <div className="flex flex-col items-end">
                            <span className="text-sm font-medium">تم سداد الرسوم بنجاح</span>
                            <span className="text-xs text-neutral-400">2025/10/16 - 10:30 AM</span>
                        </div>
                    )
                },
                { 
                    label: 'ربط بالعقار', 
                    value: (
                        <div className="flex flex-col items-end">
                            <span className="text-sm font-medium">تمت موافقة المالك</span>
                            <span className="text-xs text-neutral-400">2025/10/16 - 11:15 AM</span>
                        </div>
                    )
                }
            ]
        }
    ];

    const sidebar = (
        <div className="space-y-6 text-right">
            <div>
                <h3 className="text-sm font-bold text-neutral-900 mb-2">إجراءات سريعة</h3>
                <div className="grid gap-3">
                    <button className="w-full py-2 px-4 bg-primary text-white text-sm font-bold rounded-sm flex items-center justify-center gap-2 shadow-btn">
                        <IdentificationCard size={18} />
                        عرض البطاقة الرقمية
                    </button>
                    <button className="w-full py-2 px-4 border border-neutral-300 text-neutral-600 text-sm font-bold rounded-sm flex items-center justify-center gap-2 hover:bg-neutral-50 transition-colors">
                        <Calendar size={18} />
                        تجديد العنوان
                    </button>
                </div>
            </div>

            <div className="pt-6 border-t border-neutral-100">
                <div className="p-4 bg-info-bg rounded-md flex gap-3 text-right">
                    <Info size={24} className="text-primary shrink-0" weight="fill" />
                    <div>
                        <p className="text-xs font-bold text-primary mb-1">تلميح</p>
                        <p className="text-xs text-neutral-600 leading-relaxed">تأكد من تجديد العنوان قبل 15 يوماً من انتهائه لتجنب انقطاع الخدمة.</p>
                    </div>
                </div>
            </div>
        </div>
    );

    return (
        <AppShell role="Visitor" header="تفاصيل العنوان">
            <DetailViewLayout
                title={`تفاصيل العنوان ${mockTnaCode}`}
                breadcrumb={['الرئيسية', 'عناويني', mockTnaCode]}
                mainContent={sections}
                sidebar={sidebar}
                onBack={() => router.push(`/${locale}/visitor/tnas`)}
            />
        </AppShell>
    );
}
