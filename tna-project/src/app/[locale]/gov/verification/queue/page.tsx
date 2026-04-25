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
                <div className="flex items-center gap-3">
                    <div className="w-9 h-9 rounded-full bg-neutral-100 flex items-center justify-center text-neutral-400 group-hover:bg-primary/10 group-hover:text-primary transition-colors">
                        <User size={18} weight="bold" />
                    </div>
                    <div className="flex flex-col">
                        <span className="font-bold text-neutral-900">{val}</span>
                        <span className="text-[10px] text-neutral-400">UUID: {row.id}</span>
                    </div>
                </div>
            )
        },
        {
            key: 'tna_code',
            label: 'كود العنوان المصدر',
            render: (val) => (
                <div className="flex items-center gap-2">
                    <IdentificationCard size={18} className="text-primary" weight="bold" />
                    <span className="text-sm font-bold text-primary font-mono tracking-widest">{val}</span>
                </div>
            )
        },
        {
            key: 'type',
            label: 'نوع الطلب',
            render: (val) => (
                <span className={`text-[10px] font-bold uppercase tracking-wider ${
                    val === 'COMMERCIAL' ? 'text-secondary' : 'text-neutral-500'
                }`}>
                    {val === 'COMMERCIAL' ? 'تجاري' : 'سكني'}
                </span>
            )
        },
        {
            key: 'request_date',
            label: 'تاريخ الاستلام',
            render: (val) => (
                <div className="flex items-center gap-2">
                    <Clock size={16} className="text-neutral-400" />
                    <span className="text-xs text-neutral-500 font-medium">{val}</span>
                </div>
            )
        },
        {
            key: 'status',
            label: 'الحالة',
            render: () => (
                <div className="flex items-center gap-2">
                    <span className="px-2 py-0.5 bg-warning-bg text-warning text-[10px] font-bold rounded">قيد المراجعة</span>
                    <WarningCircle size={14} className="text-warning" weight="fill" />
                </div>
            )
        },
        {
            key: 'id',
            label: '',
            render: (id) => (
                <div className="flex justify-end">
                    <button 
                        onClick={() => router.push(`/${locale}/gov/verify?id=${id}`)}
                        className="h-9 px-4 bg-primary text-white text-[10px] font-bold rounded-sm shadow-btn hover:opacity-90 transition-all flex items-center gap-2"
                    >
                        بدء المعالجة
                        <CaretRight size={14} className="rotate-180" />
                    </button>
                </div>
            )
        }
    ];

    return (
        <AppShell role="Gov" header="غرفة معالجة الطلبات">
            <DataTableLayout
                title="طابور التحقق من العناوين"
                columns={columns}
                data={mockRequests}
                onRowClick={(row) => router.push(`/${locale}/gov/verify?id=${row.id}`)}
            >
                <div className="flex gap-2">
                    <div className="relative">
                        <MagnifyingGlass size={18} className="absolute right-3 top-1/2 -translate-y-1/2 text-neutral-400" />
                        <input 
                            placeholder="بحث برقم الهوية أو TNA..." 
                            className="h-11 w-[240px] px-10 rounded-sm border border-neutral-200 bg-surface-200 text-xs focus:ring-1 focus:ring-primary outline-offset-0"
                        />
                    </div>
                    <button className="h-11 px-6 rounded-sm border border-neutral-200 bg-surface-200 font-bold text-xs flex items-center gap-2 hover:bg-neutral-100 transition-colors">
                        <Funnel size={18} />
                        تصفية متقدمة
                    </button>
                </div>
            </DataTableLayout>
        </AppShell>
    );
}
