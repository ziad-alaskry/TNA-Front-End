'use client'

import React from 'react'
import { AppShell } from '@/components/layout/AppShell'
import DataTableLayout, { DataTableColumn } from '@/components/templates/DataTableLayout'
import { 
    Fingerprint, 
    User, 
    Desktop, 
    ArrowRight, 
    MagnifyingGlass, 
    Funnel,
    Database,
    ShieldCheck,
    WarningCircle,
    Info
} from '@phosphor-icons/react'

interface AuditLog {
    id: string;
    actor: string;
    role: string;
    action: string;
    timestamp: string;
    ip: string;
    status: 'SUCCESS' | 'WARNING' | 'CRITICAL';
}

const mockLogs: AuditLog[] = [
    { id: 'LOG-4490', actor: 'مشرف ع . ن', role: 'GOV_ADMIN', action: 'تعديل رسوم الإصدار التجاري', timestamp: '2025/11/15 10:45 AM', ip: '10.0.8.12', status: 'SUCCESS' },
    { id: 'LOG-4485', actor: 'النظام الآلي', role: 'SYSTEM', action: 'محاولة دخول فاشلة متكررة', timestamp: '2025/11/15 09:12 AM', ip: '192.168.1.1', status: 'WARNING' },
    { id: 'LOG-4470', actor: 'سالم الدوسري', role: 'VISITOR', action: 'طلب إصدار TNA جديد', timestamp: '2025/11/15 08:30 AM', ip: '176.10.22.4', status: 'SUCCESS' },
    { id: 'LOG-4462', actor: 'مدير النظام', role: 'SUPER_ADMIN', action: 'تغيير إعدادات مفتاح التشفير', timestamp: '2025/11/14 11:00 PM', ip: '10.0.8.2', status: 'CRITICAL' },
];

export default function GovAuditPage() {
    const columns: DataTableColumn<AuditLog>[] = [
        {
            key: 'timestamp',
            label: 'الوقت والتاريخ',
            render: (val) => <span className="text-[10px] font-bold text-neutral-400 font-mono">{val}</span>
        },
        {
            key: 'actor',
            label: 'المستخدم / الفاعل',
            render: (val, row) => (
                <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-full bg-neutral-100 flex items-center justify-center text-neutral-400">
                        {row.role === 'SYSTEM' ? <Database size={16} /> : <User size={16} />}
                    </div>
                    <div className="flex flex-col">
                        <span className="text-xs font-bold text-neutral-900">{val}</span>
                        <span className="text-[9px] text-neutral-500 uppercase tracking-tighter">{row.role}</span>
                    </div>
                </div>
            )
        },
        {
            key: 'action',
            label: 'العملية المنجزة',
            render: (val) => <span className="text-sm font-semibold text-neutral-700">{val}</span>
        },
        {
            key: 'status',
            label: 'مستوى الأمان',
            render: (val) => {
                const colors: Record<AuditLog['status'], string> = {
                    SUCCESS: 'text-success bg-success-bg',
                    WARNING: 'text-warning bg-warning-bg',
                    CRITICAL: 'text-error bg-error-bg',
                };
                return (
                    <span className={`px-2 py-0.5 rounded text-[9px] font-bold tracking-widest ${colors[val as AuditLog['status']]}`}>
                        {val}
                    </span>
                )
            }
        },
        {
            key: 'ip',
            label: 'عنوان الشبكة',
            render: (val) => <span className="text-[10px] font-mono text-neutral-400">{val}</span>
        },
        {
            key: 'id',
            label: '',
            render: () => (
                <div className="flex justify-end">
                    <button className="p-2 rounded-sm hover:bg-neutral-100 text-neutral-400">
                        <ArrowRight size={18} className="rotate-180" />
                    </button>
                </div>
            )
        }
    ];

    return (
        <AppShell role="Gov" header="سجل التدقيق الأمني">
            <DataTableLayout
                title="أرشيف عمليات النظام"
                columns={columns}
                data={mockLogs}
            >
                <div className="flex gap-2">
                    <div className="relative">
                        <MagnifyingGlass size={18} className="absolute right-3 top-1/2 -translate-y-1/2 text-neutral-400" />
                        <input 
                            placeholder="بحث في السجلات..." 
                            className="h-11 w-[240px] px-10 rounded-sm border border-neutral-200 bg-surface-200 text-xs outline-none focus:ring-1 focus:ring-primary"
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
