'use client'

import React from 'react'
import { AppShell } from '@/components/layout/AppShell'
import DataTableLayout, { DataTableColumn } from '@/components/templates/DataTableLayout'
import { 
    Clock, 
    User, 
    ShieldCheck, 
    IdentificationCard, 
    WarningCircle,
    CaretRight,
    ArrowRight,
    MagnifyingGlass,
    Funnel
} from '@phosphor-icons/react'
import { useRouter, useParams } from 'next/navigation'

interface VerificationRequest {
    id: string;
    visitor_name: string;
    tna_code: string;
    request_date: string;
    type: 'RESIDENTIAL' | 'COMMERCIAL';
    status: 'PENDING' | 'REJECTED' | 'APPROVED';
}

const mockRequests: VerificationRequest[] = [
    { id: 'REQ-1002', visitor_name: 'سالم الدوسري', tna_code: 'TNA-667722', request_date: '2025/11/15 10:00 AM', type: 'RESIDENTIAL', status: 'PENDING' },
    { id: 'REQ-0995', visitor_name: 'هند محمد', tna_code: 'TNA-102938', request_date: '2025/11/14 02:30 PM', type: 'RESIDENTIAL', status: 'PENDING' },
    { id: 'REQ-0881', visitor_name: 'شركة اللوجستيات العربية', tna_code: 'TNA-556123', request_date: '2025/11/10 09:15 AM', type: 'COMMERCIAL', status: 'PENDING' },
];

export default function VerificationQueuePage() {
    const router = useRouter();
    const { locale } = useParams();

    const columns: DataTableColumn<VerificationRequest>[] = [
        {
            key: 'visitor_name',
            label: 'مقدم الطلب',
            render: (val, row) => (
                <div className="flex items-center gap-3 min-w-0">
                    <div className="w-8 h-8 rounded-full bg-neutral-100 flex items-center justify-center text-neutral-400 group-hover:bg-primary/10 group-hover:text-primary transition-colors shrink-0">
                        <User size={16} weight="bold" />
                    </div>
                    <div className="flex flex-col min-w-0">
                        <span className="font-bold text-text-primary text-sm truncate">{val}</span>
                        <span className="text-[10px] text-text-placeholder truncate">UUID: {row.id}</span>
                    </div>
                </div>
            )
        },
        {
            key: 'tna_code',
            label: 'كود العنوان المصدر',
            width: '120px',
            render: (val) => (
                <div className="flex items-center gap-2 min-w-0">
                    <IdentificationCard size={14} className="text-primary shrink-0" weight="bold" />
                    <span className="text-xs font-bold text-primary font-mono tracking-wider truncate">{val}</span>
                </div>
            )
        },
        {
            key: 'type',
            label: 'نوع الطلب',
            width: '80px',
            render: (val) => (
                <span className={`text-[10px] font-bold uppercase tracking-wider ${
                    val === 'COMMERCIAL' ? 'text-secondary' : 'text-text-secondary'
                }`}>
                    {val === 'COMMERCIAL' ? 'تجاري' : 'سكني'}
                </span>
            )
        },
        {
            key: 'request_date',
            label: 'تاريخ الاستلام',
            width: '130px',
            render: (val) => (
                <div className="flex items-center gap-2 min-w-0">
                    <Clock size={14} className="text-text-placeholder shrink-0" />
                    <span className="text-xs text-text-secondary font-medium truncate">{val}</span>
                </div>
            )
        },
        {
            key: 'status',
            label: 'الحالة',
            width: '110px',
            render: () => (
                <div className="flex items-center gap-2">
                    <span className="px-1.5 py-0.5 bg-warning-light text-warning text-[9px] font-bold rounded">قيد المراجعة</span>
                    <WarningCircle size={12} className="text-warning shrink-0" weight="fill" />
                </div>
            )
        },
        {
            key: 'id',
            label: '',
            width: '120px',
            render: (id) => (
                <div className="flex justify-end">
                    <button 
                        onClick={() => router.push(`/${locale}/gov/verify?id=${id}`)}
                        className="h-8 px-2 bg-primary text-white text-[10px] font-bold rounded-md shadow-button hover:opacity-90 transition-all flex items-center gap-1 whitespace-nowrap"
                    >
                        بدء المعالجة
                        <CaretRight size={10} className="rtl:rotate-0 ltr:rotate-180 shrink-0" />
                    </button>
                </div>
            )
        }
    ];

    return (
        <AppShell role="Gov">
            <DataTableLayout
                title="طابور التحقق من العناوين"
                columns={columns}
                data={mockRequests}
                onRowClick={(row) => router.push(`/${locale}/gov/verify?id=${row.id}`)}
            >
                <div className="flex gap-2">
                    <div className="relative">
                        <MagnifyingGlass size={18} className="absolute end-3 top-1/2 -translate-y-1/2 text-text-placeholder" />
                        <input 
                            placeholder="بحث برقم الهوية أو TNA..." 
                            className="h-11 w-[240px] px-10 rounded-md border border-divider bg-card text-xs focus:ring-1 focus:ring-primary outline-offset-0"
                        />
                    </div>
                    <button className="h-11 px-6 rounded-md border border-divider bg-card font-bold text-xs flex items-center gap-2 hover:bg-neutral-50 transition-colors">
                        <Funnel size={18} />
                        تصفية متقدمة
                    </button>
                </div>
            </DataTableLayout>
        </AppShell>
    );
}
