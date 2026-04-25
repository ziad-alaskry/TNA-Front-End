'use client'

import React from 'react'
import { AppShell } from '@/components/layout/AppShell'
import DataTableLayout, { DataTableColumn } from '@/components/templates/DataTableLayout'
import { 
    CheckCircle, 
    XCircle, 
    Clock, 
    User, 
    Building,
    ArrowRight,
    Handshake,
    IdentificationCard
} from '@phosphor-icons/react'
import { useBindingContext } from '@/context/BindingContext'
import { useRouter, useParams } from 'next/navigation'

interface BindingRequest {
    id: string;
    visitor_name: string;
    property_name: string;
    start_date: string;
    duration: string;
    fee: number;
    status: 'PENDING' | 'ACTIVE' | 'REJECTED';
}

const mockRequests: BindingRequest[] = [
    {
        id: 'BND-771',
        visitor_name: 'أحمد العتيبي',
        property_name: 'فيلا الملقا ١٢',
        start_date: '2025/11/20',
        duration: '٣ أشهر',
        fee: 135.00,
        status: 'PENDING'
    },
    {
        id: 'BND-650',
        visitor_name: 'سارة محمد',
        property_name: 'عمارة النرجس',
        start_date: '2025/11/15',
        duration: 'شهر واحد',
        fee: 50.00,
        status: 'ACTIVE'
    }
];

export default function OwnerBindingsPage() {
    const { acceptBindingRequest } = useBindingContext();
    const router = useRouter();
    const { locale } = useParams();

    const columns: DataTableColumn<BindingRequest>[] = [
        {
            key: 'visitor_name',
            label: 'الزائر / المستفيد',
            render: (val, row) => (
                <div className="flex items-center gap-3">
                    <div className="w-9 h-9 rounded-full bg-primary/10 flex items-center justify-center text-primary">
                        <User size={18} weight="bold" />
                    </div>
                    <div className="flex flex-col">
                        <span className="font-bold text-neutral-900">{val}</span>
                        <span className="text-[10px] text-neutral-400">{row.id}</span>
                    </div>
                </div>
            )
        },
        {
            key: 'property_name',
            label: 'العقار المستهدف',
            render: (val) => (
                <div className="flex items-center gap-2">
                    <Building size={16} className="text-neutral-400" />
                    <span className="text-sm font-semibold text-neutral-700">{val}</span>
                </div>
            )
        },
        {
            key: 'fee',
            label: 'الرسوم المتوقعة',
            render: (val) => <span className="font-bold text-primary">{val.toFixed(2)} SAR</span>
        },
        {
            key: 'status',
            label: 'الحالة',
            render: (val) => {
                const configs: Record<BindingRequest['status'], { label: string; class: string; icon: React.ReactNode }> = {
                    PENDING: { label: 'بانتظار موافقتك', class: 'bg-warning-bg text-warning', icon: <Clock size={14} /> },
                    ACTIVE: { label: 'نشط', class: 'bg-success-bg text-success', icon: <CheckCircle size={14} /> },
                    REJECTED: { label: 'مرفوض', class: 'bg-error-bg text-error', icon: <XCircle size={14} /> },
                };
                const config = configs[val as BindingRequest['status']];
                return (
                    <div className={`flex items-center gap-2 px-2 py-1 rounded text-[10px] font-bold uppercase tracking-wider ${config.class}`}>
                        {config.icon}
                        {config.label}
                    </div>
                )
            }
        },
        {
            key: 'id',
            label: 'الإجراءات',
            render: (id, row) => (
                <div className="flex gap-2">
                    {row.status === 'PENDING' ? (
                        <>
                            <button 
                                onClick={(e) => { e.stopPropagation(); acceptBindingRequest(id, row.fee); }}
                                className="h-8 px-4 bg-success text-white text-[10px] font-bold rounded-sm hover:opacity-90 transition-opacity"
                            >
                                قبول
                            </button>
                            <button 
                                onClick={(e) => { e.stopPropagation(); console.log('Rejected', id); }}
                                className="h-8 px-4 bg-neutral-100 text-neutral-600 text-[10px] font-bold rounded-sm hover:bg-neutral-200 transition-colors"
                            >
                                رفض
                            </button>
                        </>
                    ) : (
                        <button className="p-2 rounded-sm hover:bg-neutral-100 text-neutral-400">
                            <ArrowRight size={18} className="rotate-180" />
                        </button>
                    )}
                </div>
            )
        }
    ];

    return (
        <AppShell role="Owner" header="طلبات الارتباط">
            <DataTableLayout
                title="إدارة طلبات ربط العناوين"
                columns={columns}
                data={mockRequests}
                onRowClick={(row) => console.log('Viewing binding details:', row.id)}
            >
                <div className="flex items-center gap-3 p-4 bg-primary/5 rounded-md border border-primary/10">
                    <Handshake size={24} weight="fill" className="text-primary" />
                    <div>
                        <p className="text-xs font-bold text-neutral-900">سياسة الربط التلقائي</p>
                        <p className="text-[10px] text-neutral-500">العقارات السكنية تتطلب موافقة يدوية، بينما التجارية يمكن برمجتها للقبول التلقائي.</p>
                    </div>
                </div>
            </DataTableLayout>
        </AppShell>
    );
}
