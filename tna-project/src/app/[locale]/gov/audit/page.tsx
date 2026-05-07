'use client'

import React from 'react'
import { AppShell } from '@/components/layout/AppShell'
import DataTableLayout, { DataTableColumn } from '@/components/templates/DataTableLayout'
import { useRouter, useParams } from 'next/navigation'
import { 
    Fingerprint,
    IdentificationCard,
    Globe,
    FileText,
    ShieldCheck,
    Lock
} from '@phosphor-icons/react'
import { useLocale } from '@/i18n/LocaleProvider'
import { mockTNAs } from '@/lib/mock/tnas.mock'
import { useMock } from '@/lib/hooks/useMock'
import { cn } from '@/lib/utils/cn'

export default function GovAuditPage() {
    const { isRTL } = useLocale();
    const { data: tnas, isLoading } = useMock(mockTNAs);

    const columns: DataTableColumn<any>[] = [
        {
            key: 'tna_id',
            label: isRTL ? 'معرف المعاملة' : 'Transaction ID',
            width: '30%',
            render: (val) => <span className="font-mono font-bold text-neutral-400">{val.toUpperCase()}</span>
        },
        {
            key: 'tna_code',
            label: isRTL ? 'كود TNA' : 'TNA Hash',
            width: '20%',
            render: (val) => (
                <div className="flex items-center gap-2">
                    <Lock size={12} className="text-success" />
                    <span className="font-mono font-bold text-neutral-900">{val}</span>
                </div>
            )
        },
        {
            key: 'created_at',
            label: isRTL ? 'الطابع الزمني' : 'Timestamp',
            width: '25%',
            render: (val) => <span className="text-xs font-medium text-neutral-500">{new Date(val).toISOString()}</span>
        },
        {
            key: 'status',
            label: isRTL ? 'التحقق' : 'Integrity',
            width: '25%',
            render: () => (
                <div className="flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full bg-success animate-pulse" />
                    <span className="text-[10px] font-black text-success uppercase tracking-widest">Verified Ledger</span>
                </div>
            )
        }
    ];

    return (
        <AppShell role="Gov" header={isRTL ? 'سجل التدقيق' : 'System Audit Logs'}>
            <div className="mb-8 p-6 bg-neutral-900 text-white rounded-3xl shadow-2xl relative overflow-hidden">
                <div className="relative z-10 space-y-2">
                    <div className="flex items-center gap-2 text-primary-light">
                        <ShieldCheck size={24} weight="fill" />
                        <h2 className="text-xl font-black uppercase tracking-tight">Immutable Ledger Protocol</h2>
                    </div>
                    <p className="text-white/60 text-sm max-w-md">Every TNA issuance, binding, and shipment update is cryptographically signed and stored in the global audit log.</p>
                </div>
                <Fingerprint size={160} weight="thin" className="absolute -bottom-10 -right-10 text-white/5 rotate-12" />
            </div>

            <DataTableLayout
                title="Global Audit Trail"
                columns={columns}
                data={tnas || []}
                isLoading={isLoading}
            />
        </AppShell>
    );
}
