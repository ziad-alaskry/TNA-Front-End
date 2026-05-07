'use client'

import React from 'react'
import { AppShell } from '@/components/layout/AppShell'
import DataTableLayout, { DataTableColumn } from '@/components/templates/DataTableLayout'
import { useRouter, useParams } from 'next/navigation'
import { 
    Link as LinkIcon, 
    CheckCircle, 
    XCircle, 
    Clock,
    User
} from '@phosphor-icons/react'
import { useLocale } from '@/i18n/LocaleProvider'
import { mockBindings } from '@/lib/mock/bindings.mock'
import { useMock } from '@/lib/hooks/useMock'
import Button from '@/components/ui/Button'
import { cn } from '@/lib/utils/cn'

export default function OwnerBindingsPage() {
    const router = useRouter();
    const { locale, isRTL } = useLocale();
    const { data: bindings, isLoading } = useMock(mockBindings);

    const columns: DataTableColumn<any>[] = [
        {
            key: 'tna_code',
            label: isRTL ? 'كود TNA' : 'TNA Code',
            width: '25%',
            render: (val) => <span className="font-mono font-bold text-primary">{val}</span>
        },
        {
            key: 'visitor_id',
            label: isRTL ? 'المستأجر' : 'Visitor',
            width: '25%',
            render: (val) => (
                <div className="flex items-center gap-2">
                    <div className="w-8 h-8 rounded-full bg-neutral-100 flex items-center justify-center text-neutral-400">
                        <User size={16} />
                    </div>
                    <span className="text-xs font-bold text-neutral-700">{val}</span>
                </div>
            )
        },
        {
            key: 'status',
            label: isRTL ? 'الحالة' : 'Status',
            width: '20%',
            render: (val) => (
                <span className={cn(
                    "px-2 py-0.5 rounded text-[10px] font-black uppercase tracking-widest",
                    val === 'ACTIVE' ? "bg-success/10 text-success" : 
                    val === 'PENDING' ? "bg-warning/10 text-warning" : "bg-neutral-100 text-neutral-400"
                )}>
                    {val}
                </span>
            )
        },
        {
            key: 'binding_id',
            label: isRTL ? 'الإجراءات' : 'Actions',
            width: '30%',
            render: (id, row) => (
                <div className="flex gap-2 justify-end">
                    {row.status === 'PENDING' ? (
                      <>
                        <Button size="sm" className="h-8 px-3 text-[10px]">Approve</Button>
                        <Button size="sm" variant="outline" className="h-8 px-3 text-[10px] border-neutral-200">Reject</Button>
                      </>
                    ) : (
                      <Button variant="outline" size="sm" className="h-8 px-3 text-[10px] border-neutral-200">View Details</Button>
                    )}
                </div>
            )
        }
    ];

    return (
        <AppShell role="Owner" header={isRTL ? 'طلبات الربط' : 'Linking Requests'}>
            <DataTableLayout
                title="Property Bindings"
                columns={columns}
                data={bindings || []}
                isLoading={isLoading}
            />
        </AppShell>
    );
}
